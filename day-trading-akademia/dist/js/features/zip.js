// Egyszerű ZIP olvasó és író külső függőség nélkül.
// A fájlokat tömörítés nélkül tárolja: a képek eleve tömörítettek, a mentés így gyors és hordozható.

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const MAX_ARCHIVE_BYTES = 250 * 1024 * 1024;
const MAX_ENTRIES = 2000;

const CRC_TABLE = Array.from({ length: 256 }, (_, value) => {
  let current = value;
  for (let bit = 0; bit < 8; bit += 1) current = (current & 1) ? 0xedb88320 ^ (current >>> 1) : current >>> 1;
  return current >>> 0;
});

export function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function joinBytes(parts) {
  const output = new Uint8Array(parts.reduce((total, part) => total + part.length, 0));
  let offset = 0;
  parts.forEach((part) => { output.set(part, offset); offset += part.length; });
  return output;
}

function header(size) {
  const bytes = new Uint8Array(size);
  return { bytes, view: new DataView(bytes.buffer) };
}

function dosDateTime(date = new Date()) {
  const year = Math.max(1980, date.getFullYear());
  return {
    date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
  };
}

function safeName(name) {
  const value = String(name).replaceAll("\\", "/");
  if (!value || value.startsWith("/") || value.split("/").includes("..") || value.includes("\0")) throw new Error("A ZIP érvénytelen fájlnevet tartalmaz.");
  return value;
}

async function toBytes(value) {
  if (typeof value === "string") return encoder.encode(value);
  if (value instanceof Uint8Array) return value;
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (value?.arrayBuffer) return new Uint8Array(await value.arrayBuffer());
  throw new Error("A ZIP-be tett fájl típusa nem támogatott.");
}

export async function createZip(entries) {
  if (!Array.isArray(entries) || entries.length > MAX_ENTRIES) throw new Error("Túl sok fájl kerülne a mentésbe.");
  const local = [];
  const central = [];
  const names = new Set();
  const stamp = dosDateTime();
  let offset = 0;

  for (const entry of entries) {
    const name = safeName(entry.name);
    if (names.has(name)) throw new Error(`Dupla fájl a ZIP-ben: ${name}`);
    names.add(name);
    const nameBytes = encoder.encode(name);
    const data = await toBytes(entry.data);
    const checksum = crc32(data);
    if (data.length > 0xffffffff) throw new Error("Egy fájl túl nagy a ZIP-formátumhoz.");

    const localHeader = header(30);
    localHeader.view.setUint32(0, 0x04034b50, true);
    localHeader.view.setUint16(4, 20, true);
    localHeader.view.setUint16(6, 0x0800, true);
    localHeader.view.setUint16(8, 0, true);
    localHeader.view.setUint16(10, stamp.time, true);
    localHeader.view.setUint16(12, stamp.date, true);
    localHeader.view.setUint32(14, checksum, true);
    localHeader.view.setUint32(18, data.length, true);
    localHeader.view.setUint32(22, data.length, true);
    localHeader.view.setUint16(26, nameBytes.length, true);
    localHeader.view.setUint16(28, 0, true);

    const centralHeader = header(46);
    centralHeader.view.setUint32(0, 0x02014b50, true);
    centralHeader.view.setUint16(4, 20, true);
    centralHeader.view.setUint16(6, 20, true);
    centralHeader.view.setUint16(8, 0x0800, true);
    centralHeader.view.setUint16(10, 0, true);
    centralHeader.view.setUint16(12, stamp.time, true);
    centralHeader.view.setUint16(14, stamp.date, true);
    centralHeader.view.setUint32(16, checksum, true);
    centralHeader.view.setUint32(20, data.length, true);
    centralHeader.view.setUint32(24, data.length, true);
    centralHeader.view.setUint16(28, nameBytes.length, true);
    centralHeader.view.setUint32(42, offset, true);

    local.push(localHeader.bytes, nameBytes, data);
    central.push(centralHeader.bytes, nameBytes);
    offset += localHeader.bytes.length + nameBytes.length + data.length;
  }

  const centralBytes = joinBytes(central);
  const end = header(22);
  end.view.setUint32(0, 0x06054b50, true);
  end.view.setUint16(8, entries.length, true);
  end.view.setUint16(10, entries.length, true);
  end.view.setUint32(12, centralBytes.length, true);
  end.view.setUint32(16, offset, true);
  const bytes = joinBytes([...local, centralBytes, end.bytes]);
  if (bytes.length > MAX_ARCHIVE_BYTES) throw new Error("A teljes mentés nagyobb 250 MB-nál.");
  return new Blob([bytes], { type: "application/zip" });
}

export async function readZip(input) {
  const bytes = await toBytes(input);
  if (bytes.length > MAX_ARCHIVE_BYTES) throw new Error("A mentés nagyobb 250 MB-nál.");
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const files = new Map();
  let offset = 0;

  while (offset + 4 <= bytes.length && view.getUint32(offset, true) === 0x04034b50) {
    if (files.size >= MAX_ENTRIES || offset + 30 > bytes.length) throw new Error("A ZIP szerkezete érvénytelen.");
    const flags = view.getUint16(offset + 6, true);
    const method = view.getUint16(offset + 8, true);
    const checksum = view.getUint32(offset + 14, true);
    const size = view.getUint32(offset + 18, true);
    const nameLength = view.getUint16(offset + 26, true);
    const extraLength = view.getUint16(offset + 28, true);
    if (flags & 0x0008 || method !== 0) throw new Error("A ZIP tömörítési módja nem támogatott.");
    const dataStart = offset + 30 + nameLength + extraLength;
    const dataEnd = dataStart + size;
    if (dataEnd > bytes.length) throw new Error("A ZIP csonka.");
    const name = safeName(decoder.decode(bytes.subarray(offset + 30, offset + 30 + nameLength)));
    const data = bytes.slice(dataStart, dataEnd);
    if (files.has(name) || crc32(data) !== checksum) throw new Error("A ZIP sérült vagy ismétlődő fájlt tartalmaz.");
    files.set(name, data);
    offset = dataEnd;
  }

  if (!files.size || offset + 4 > bytes.length || view.getUint32(offset, true) !== 0x02014b50) throw new Error("Ez nem érvényes TradeCraft ZIP mentés.");
  return files;
}
