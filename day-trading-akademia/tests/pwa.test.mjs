// Az offline működés feltétele: a service worker minden fájlt ismer, és semmi nem hivatkozik hiányzó fájlra.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, resolve } from "node:path";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const read = (file) => readFileSync(join(dist, file), "utf8");
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => (entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]));
const files = walk(dist).map((file) => relative(dist, file).replaceAll("\\", "/"));
const cached = [...read("sw.js").matchAll(/"\.\/([^"]*)"/g)].map((match) => match[1]).filter(Boolean);

test("service worker: minden fájl szerepel a listában", () => {
  const missing = files.filter((file) => file !== "sw.js" && !cached.includes(file));
  assert.deepEqual(missing, []);
});

test("service worker: a lista nem hivatkozik hiányzó fájlra", () => {
  assert.deepEqual(cached.filter((file) => !files.includes(file)), []);
});

test("modulok: minden import létező fájlra mutat", () => {
  const broken = [];
  files.filter((file) => file.endsWith(".js") && file !== "sw.js").forEach((file) => {
    for (const match of read(file).matchAll(/from "(\.[^"]+)"/g)) {
      if (!existsSync(resolve(dirname(join(dist, file)), match[1]))) broken.push(`${file} -> ${match[1]}`);
    }
  });
  assert.deepEqual(broken, []);
});

test("index.html: a hivatkozott stíluslapok, szkriptek és a manifest léteznek", () => {
  const html = read("index.html");
  const local = [...html.matchAll(/(?:href|src)="\.\/([^"#?]+)"/g)].map((match) => match[1]);
  assert.ok(local.includes("js/main.js") && local.includes("manifest.webmanifest"));
  assert.deepEqual(local.filter((file) => !files.includes(file)), []);
});

test("manifest: az ikonok léteznek", () => {
  const manifest = JSON.parse(read("manifest.webmanifest"));
  assert.ok(manifest.icons.length >= 2);
  manifest.icons.forEach((icon) => assert.ok(files.includes(icon.src), icon.src));
});

test("jelölők: a JS által keresett azonosítók megvannak az index.html-ben", () => {
  const html = read("index.html");
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  const missing = new Set();
  files.filter((file) => file.startsWith("js/")).forEach((file) => {
    for (const match of read(file).matchAll(/(?:\$|setText|setMeter)\("#([a-z0-9-]+)"/g)) {
      if (!ids.has(match[1])) missing.add(`${file}: #${match[1]}`);
    }
  });
  assert.deepEqual([...missing], []);
});
