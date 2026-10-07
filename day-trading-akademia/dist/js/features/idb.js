// Kis IndexedDB-burkoló azoknak az adatoknak, amelyek nem férnek a localStorage-be:
// képernyőképek (attachments) és a mentési fájl kezelője (settings).

const DB_NAME = "tradecraft-akademia";
const STORES = ["attachments", "settings"];
let opening = null;

function open() {
  opening ||= new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => STORES.forEach((name) => { if (!request.result.objectStoreNames.contains(name)) request.result.createObjectStore(name); });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return opening;
}

async function run(store, mode, action) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const request = action(db.transaction(store, mode).objectStore(store));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const idbGet = (store, key) => run(store, "readonly", (objects) => objects.get(key));
export const idbSet = (store, key, value) => run(store, "readwrite", (objects) => objects.put(value, key));
export const idbDelete = (store, key) => run(store, "readwrite", (objects) => objects.delete(key));
export const idbClear = (store) => run(store, "readwrite", (objects) => objects.clear());
