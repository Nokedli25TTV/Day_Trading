// A jelszavas védelem tesztjei: a titkosítás oda-vissza működik, és a nyilvános csomagban nincs nyílt tananyag.
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { encryptJSON, decryptJSON, keyFromPassword, exportKey, importKey, ITERATIONS } from "../dist/js/lock/crypto.js";
import { buildPublic, MIN_PASSWORD_LENGTH } from "../tools/build-public.mjs";
import { DATA } from "../dist/data.js";
import { CONTENT } from "../dist/content/index.js";
import { GLOSSARY } from "../dist/content/fogalomtar.js";

// Tesztjelszó: csak a tesztekben és a helyi próbakiadásban használatos, éles oldalhoz ne használd.
export const TEST_PASSWORD = "csak-teszt-jelszo-2026";
const FAST = 1000;

test("titkosítás: a helyes jelszó visszaadja az adatot", async () => {
  const value = { szöveg: "árvíztűrő tükörfúrógép", szám: 42, lista: [1, 2, 3] };
  const payload = await encryptJSON(value, TEST_PASSWORD, { iterations: FAST });
  assert.equal(payload.iterations, FAST);
  assert.ok(!JSON.stringify(payload).includes("tükörfúrógép"));
  assert.deepEqual(await decryptJSON(payload, await keyFromPassword(payload, TEST_PASSWORD)), value);
});

test("titkosítás: hibás jelszóval a visszafejtés hibát dob", async () => {
  const payload = await encryptJSON({ titok: true }, TEST_PASSWORD, { iterations: FAST });
  await assert.rejects(async () => decryptJSON(payload, await keyFromPassword(payload, `${TEST_PASSWORD}x`)));
});

test("titkosítás: a megjegyzett kulcs jelszó nélkül is nyit, és minden csomag más", async () => {
  const salt = new Uint8Array(16).fill(7);
  const first = await encryptJSON({ a: 1 }, TEST_PASSWORD, { iterations: FAST, salt });
  const second = await encryptJSON({ a: 2 }, TEST_PASSWORD, { iterations: FAST, salt });
  const remembered = await exportKey(await keyFromPassword(first, TEST_PASSWORD));
  // Rögzített sónál ugyanaz a kulcs nyitja a következő kiadást is, de az IV és a titkosított adat eltér.
  assert.deepEqual(await decryptJSON(second, await importKey(remembered)), { a: 2 });
  assert.notEqual(first.iv, second.iv);
  assert.notEqual(first.data, second.data);
});

test("titkosítás: az alapértelmezett körszám megfelel a mai ajánlásnak", () => {
  assert.ok(ITERATIONS >= 600000);
});

test("közzététel: rövid jelszóval nem készül csomag", async () => {
  await assert.rejects(() => buildPublic({ password: "x".repeat(MIN_PASSWORD_LENGTH - 1), outDir: join(tmpdir(), "tradecraft-nope") }), /legalább/);
});

test("közzététel: a csomagban nincs nyílt tananyag, és a jelszó visszaadja", async () => {
  const outDir = await mkdtemp(join(tmpdir(), "tradecraft-public-"));
  try {
    const { files } = await buildPublic({ password: TEST_PASSWORD, outDir, iterations: FAST });
    assert.ok(files.includes("content.enc.json") && files.includes("index.html") && files.includes("js/lock/unlock.js"));
    assert.deepEqual((await readdir(join(outDir, "content"))).sort(), ["fogalomtar.js", "index.js"]);

    // Jellegzetes mondatok a leckékből, a kvízből és a fogalomtárból: egyik sem szerepelhet egyetlen fájlban sem.
    const markers = [
      CONTENT["kotes-letrejotte"].sections[0].body[0].slice(0, 60),
      CONTENT["drawdown"].mistakes[0],
      DATA.modules[0].lessons[0].summary,
      DATA.quiz[0].explanation,
      GLOSSARY[20][1],
    ];
    for (const file of files.filter((name) => /\.(js|json|html|css|webmanifest)$/.test(name))) {
      const text = await readFile(join(outDir, file), "utf8");
      markers.forEach((marker) => assert.ok(!text.includes(marker), `nyílt tananyag maradt itt: ${file}`));
    }

    for (const file of ["data.js", "content/index.js", "content/fogalomtar.js"]) {
      assert.match(await readFile(join(outDir, file), "utf8"), /lock\/unlock\.js/);
    }
    assert.match(await readFile(join(outDir, "index.html"), "utf8"), /<html lang="hu" data-locked="1">/);

    const sw = await readFile(join(outDir, "sw.js"), "utf8");
    const assets = sw.slice(sw.indexOf("const ASSETS = ["), sw.indexOf("\n];"));
    const cached = [...assets.matchAll(/"\.\/([^"]+)"/g)].map((match) => match[1]);
    assert.deepEqual(cached.sort(), [...files].sort());

    const payload = JSON.parse(await readFile(join(outDir, "content.enc.json"), "utf8"));
    const bundle = await decryptJSON(payload, await keyFromPassword(payload, TEST_PASSWORD));
    assert.equal(bundle.DATA.modules.length, DATA.modules.length);
    assert.equal(Object.keys(bundle.CONTENT).length, Object.keys(CONTENT).length);
    assert.equal(bundle.GLOSSARY.length, GLOSSARY.length);
  } finally {
    await rm(outDir, { recursive: true, force: true });
  }
});
