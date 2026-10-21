// A teljes mentés ZIP-formátuma külső csomag nélkül is oda-vissza működjön.
import test from "node:test";
import assert from "node:assert/strict";
import { createZip, readZip } from "../dist/js/features/zip.js";
import { createBackupArchive, readBackupArchive } from "../dist/js/features/backup-format.js";

const text = (bytes) => new TextDecoder().decode(bytes);

test("ZIP: UTF-8 fájlok és bináris adatok oda-vissza", async () => {
  const archive = await createZip([
    { name: "árvíztűrő.txt", data: "tükörfúrógép" },
    { name: "bin/adat.bin", data: new Uint8Array([0, 1, 2, 255]) },
  ]);
  const files = await readZip(archive);
  assert.equal(text(files.get("árvíztűrő.txt")), "tükörfúrógép");
  assert.deepEqual([...files.get("bin/adat.bin")], [0, 1, 2, 255]);
});

test("ZIP: sérült adatnál hibát jelez", async () => {
  const archive = await createZip([{ name: "adat.txt", data: "eredeti" }]);
  const bytes = new Uint8Array(await archive.arrayBuffer());
  bytes[bytes.indexOf(new TextEncoder().encode("eredeti")[0], 30)] ^= 0xff;
  await assert.rejects(() => readZip(bytes), /sérült/);
});

test("teljes mentés: állapot és képek visszaállíthatók", async () => {
  const data = { profile: { createdAt: "2026-10-19" }, progress: { lecke: { status: "completed" } } };
  const attachments = [
    { id: "naplo-1", blob: new Blob([new Uint8Array([1, 2, 3])], { type: "image/jpeg" }) },
    { id: "naplo-2", blob: new Blob([new Uint8Array([4, 5])], { type: "image/png" }) },
  ];
  const restored = await readBackupArchive(await createBackupArchive(data, attachments));
  assert.deepEqual(restored.data, data);
  assert.equal(restored.attachments.length, 2);
  assert.deepEqual([...new Uint8Array(await restored.attachments[0].blob.arrayBuffer())], [1, 2, 3]);
  assert.equal(restored.attachments[1].blob.type, "image/png");
});
