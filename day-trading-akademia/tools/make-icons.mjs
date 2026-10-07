// Az alkalmazásikonok előállítása függőség nélkül: a favicon három oszlopa kék alapon.
// Futtatás: node tools/make-icons.mjs
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../dist/icons/", import.meta.url));
const BLUE = [0x20, 0x4e, 0xc3];
const PAPER = [0xfb, 0xfa, 0xf7];
// A favicon rajza 64-es rácson: három függőleges vonal, lekerekített véggel.
const BARS = [[20, 32, 44], [32, 20, 44], [44, 28, 44]];
const BAR_HALF_WIDTH = 3;

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, "latin1");
  const tail = Buffer.alloc(4);
  tail.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
  return Buffer.concat([head, data, tail]);
}

// scale: a rajz mérete a vászonhoz képest (maszkolható ikonnál kisebb, hogy a biztonsági zónán belül maradjon).
function render(size, { rounded, scale }) {
  const samples = 3;
  const pixels = Buffer.alloc(size * (size * 4 + 1));
  const radius = rounded ? 0.22 * 64 : 0;
  const inBackground = (x, y) => {
    if (!rounded) return true;
    const dx = Math.max(radius - x, x - (64 - radius), 0);
    const dy = Math.max(radius - y, y - (64 - radius), 0);
    return dx * dx + dy * dy <= radius * radius;
  };
  const inBars = (x, y) => {
    const px = (x - 32) / scale + 32;
    const py = (y - 32) / scale + 32;
    return BARS.some(([bx, top, bottom]) => Math.hypot(px - bx, py - Math.max(top, Math.min(bottom, py))) <= BAR_HALF_WIDTH);
  };
  for (let row = 0; row < size; row += 1) {
    const offset = row * (size * 4 + 1);
    pixels[offset] = 0;
    for (let column = 0; column < size; column += 1) {
      let background = 0;
      let bars = 0;
      for (let sy = 0; sy < samples; sy += 1) {
        for (let sx = 0; sx < samples; sx += 1) {
          const x = ((column + (sx + 0.5) / samples) / size) * 64;
          const y = ((row + (sy + 0.5) / samples) / size) * 64;
          if (inBackground(x, y)) { background += 1; if (inBars(x, y)) bars += 1; }
        }
      }
      const total = samples * samples;
      const mix = background ? bars / background : 0;
      const at = offset + 1 + column * 4;
      for (let channel = 0; channel < 3; channel += 1) pixels[at + channel] = Math.round(BLUE[channel] + (PAPER[channel] - BLUE[channel]) * mix);
      pixels[at + 3] = Math.round((background / total) * 255);
    }
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header.set([8, 6, 0, 0, 0], 8);
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk("IHDR", header), chunk("IDAT", deflateSync(pixels, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}

mkdirSync(OUT, { recursive: true });
[
  ["icon-192.png", 192, { rounded: true, scale: 1 }],
  ["icon-512.png", 512, { rounded: true, scale: 1 }],
  ["icon-maskable-512.png", 512, { rounded: false, scale: 0.72 }],
].forEach(([name, size, options]) => {
  const png = render(size, options);
  writeFileSync(OUT + name, png);
  console.log(`${name}: ${png.length} bájt`);
});
