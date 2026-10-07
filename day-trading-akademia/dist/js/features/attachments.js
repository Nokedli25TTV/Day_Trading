// Képernyőképek a naplóbejegyzésekhez. A képek IndexedDB-ben élnek, a bejegyzés azonosítójával.
// A JSON mentés nem tartalmazza őket: csak ezen a böngészőn maradnak meg.
import { idbGet, idbSet, idbDelete, idbClear } from "./idb.js";

const MAX_SIDE = 1600;
const urls = new Map();

// Kicsinyítés és JPEG-tömörítés, hogy egy kép néhány száz kilobájt legyen.
async function shrinkImage(file) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  return new Promise((resolve, reject) => canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("A kép nem alakítható át."))), "image/jpeg", 0.85));
}

function forget(id) {
  if (urls.has(id)) URL.revokeObjectURL(urls.get(id));
  urls.delete(id);
}

export async function saveAttachment(id, file) {
  await idbSet("attachments", id, await shrinkImage(file));
  forget(id);
}

export async function deleteAttachment(id) {
  forget(id);
  await idbDelete("attachments", id);
}

export async function clearAttachments() {
  [...urls.keys()].forEach(forget);
  await idbClear("attachments");
}

// Megjeleníthető URL a képhez, vagy null, ha nincs (például másik böngészőből importált naplónál).
export async function attachmentURL(id) {
  if (urls.has(id)) return urls.get(id);
  const blob = await idbGet("attachments", id);
  if (!blob) return null;
  urls.set(id, URL.createObjectURL(blob));
  return urls.get(id);
}
