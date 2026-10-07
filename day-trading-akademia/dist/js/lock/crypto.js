// Jelszóval védett tartalom: PBKDF2 (SHA-256) kulcsszármaztatás és AES-GCM titkosítás.
// Ugyanez a kód fut a böngészőben (visszafejtés) és Node-ban (a közzétételi csomag készítése).

const { subtle } = globalThis.crypto;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Minél több kör, annál lassabb a jelszó próbálgatása. A belépés így is egy másodperc körül marad.
export const ITERATIONS = 600000;

export function toBase64(bytes) {
  let text = "";
  for (const byte of new Uint8Array(bytes)) text += String.fromCharCode(byte);
  return btoa(text);
}

export const fromBase64 = (text) => Uint8Array.from(atob(text), (character) => character.charCodeAt(0));

async function deriveKey(password, salt, iterations) {
  const material = await subtle.importKey("raw", encoder.encode(password.normalize("NFKC")), "PBKDF2", false, ["deriveKey"]);
  return subtle.deriveKey({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, material, { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
}

// salt: ha megadod, ugyanabból a jelszóból mindig ugyanaz a kulcs lesz. A közzétételi csomag így készül,
// hogy a „maradjak bejelentkezve” egy új kiadás után is érvényes maradjon. Az IV mindig friss.
export async function encryptJSON(value, password, { iterations = ITERATIONS, salt = globalThis.crypto.getRandomValues(new Uint8Array(16)) } = {}) {
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt, iterations);
  const data = await subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(JSON.stringify(value)));
  return { version: 1, kdf: "PBKDF2-SHA256", cipher: "AES-256-GCM", iterations, salt: toBase64(salt), iv: toBase64(iv), data: toBase64(data) };
}

// A kulcs a csomagban tárolt sóból és körszámból készül.
export const keyFromPassword = (payload, password) => deriveKey(password, fromBase64(payload.salt), payload.iterations);

// Hibás kulcsnál az AES-GCM ellenőrzése elbukik, és a függvény hibát dob.
export async function decryptJSON(payload, key) {
  const plain = await subtle.decrypt({ name: "AES-GCM", iv: fromBase64(payload.iv) }, key, fromBase64(payload.data));
  return JSON.parse(decoder.decode(plain));
}

// A „maradjak bejelentkezve” a kész kulcsot tárolja, nem a jelszót.
export const exportKey = async (key) => toBase64(await subtle.exportKey("raw", key));
export const importKey = (text) => subtle.importKey("raw", fromBase64(text), "AES-GCM", true, ["encrypt", "decrypt"]);
