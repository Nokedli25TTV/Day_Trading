// A hordozható teljes mentés formátuma: állapot + IndexedDB-ben tárolt képek egy ZIP-ben.
import { createZip, readZip } from "./zip.js";

const FORMAT = "tradecraft-backup";
const VERSION = 1;
const decoder = new TextDecoder();

const imageExtension = (type) => ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" })[type] || "bin";

export async function createBackupArchive(data, attachments = []) {
  const listed = attachments.map(({ id, blob }, index) => {
    if (!id || !blob?.arrayBuffer || !String(blob.type).startsWith("image/")) throw new Error("Érvénytelen képmelléklet a mentésben.");
    const path = `attachments/${index + 1}-${encodeURIComponent(String(id))}.${imageExtension(blob.type)}`;
    return { id: String(id), path, type: blob.type, size: blob.size, blob };
  });
  const manifest = {
    format: FORMAT,
    version: VERSION,
    createdAt: new Date().toISOString(),
    attachments: listed.map(({ id, path, type, size }) => ({ id, path, type, size })),
  };
  return createZip([
    { name: "manifest.json", data: JSON.stringify(manifest, null, 2) },
    { name: "data.json", data: JSON.stringify(data, null, 2) },
    ...listed.map(({ path, blob }) => ({ name: path, data: blob })),
  ]);
}

export async function readBackupArchive(input) {
  const files = await readZip(input);
  const parse = (name) => {
    const bytes = files.get(name);
    if (!bytes) throw new Error(`A teljes mentésből hiányzik: ${name}`);
    try { return JSON.parse(decoder.decode(bytes)); } catch { throw new Error(`A mentés hibás JSON-fájlt tartalmaz: ${name}`); }
  };
  const manifest = parse("manifest.json");
  if (manifest?.format !== FORMAT || manifest.version !== VERSION || !Array.isArray(manifest.attachments)) throw new Error("A teljes mentés formátuma vagy verziója nem támogatott.");
  const data = parse("data.json");
  const ids = new Set();
  const attachments = manifest.attachments.map((entry) => {
    if (!entry?.id || ids.has(entry.id) || !entry.path?.startsWith("attachments/") || !String(entry.type).startsWith("image/")) throw new Error("A mentés képlistája érvénytelen.");
    const bytes = files.get(entry.path);
    if (!bytes || bytes.length !== entry.size) throw new Error(`Hiányzó vagy sérült kép: ${entry.id}`);
    ids.add(entry.id);
    return { id: entry.id, blob: new Blob([bytes], { type: entry.type }) };
  });
  return { data, attachments, manifest };
}
