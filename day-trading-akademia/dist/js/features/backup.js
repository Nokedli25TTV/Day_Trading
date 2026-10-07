// Adatbiztonság: automatikus mentés egy választott fájlba (ahol a böngésző engedi),
// kézi JSON export, és emlékeztető, ha régen volt mentés.
import { state, save, persist, onSave, onRender } from "../store.js";
import { showToast } from "../toast.js";
import { idbGet, idbSet, idbDelete } from "./idb.js";
import { $, setText, localDateKey, daysBetween, downloadFile, debounce, formatDate } from "../util.js";

const SUPPORTED = "showSaveFilePicker" in window;
const REMIND_AFTER_DAYS = 7;
let handle = null;
// off | active | paused (a böngésző újraindítás után újra engedélyt kér) | error
let status = "off";

const snapshot = () => JSON.stringify(state, null, 2);
const hasData = () => state.journalEntries.length > 0 || Object.keys(state.progress).length > 0;

async function writeFile() {
  if (status !== "active" || !handle) return;
  try {
    const writable = await handle.createWritable();
    await writable.write(snapshot());
    await writable.close();
    state.profile.lastExportAt = new Date().toISOString();
    persist();
  } catch {
    status = "error";
    showToast("Az automatikus mentés nem sikerült. Nézd meg a beállításokban.", true);
  }
  render();
}
const writeSoon = debounce(writeFile, 2000);

export function exportJSON() {
  downloadFile(`tradecraft-mentes-${localDateKey()}.json`, snapshot(), "application/json");
  state.profile.lastExportAt = new Date().toISOString();
  save("Biztonsági mentés letöltve");
  showToast("A JSON biztonsági mentés elkészült. A képernyőképek nincsenek benne.");
  render();
}

async function enable() {
  try {
    handle = await window.showSaveFilePicker({ suggestedName: "tradecraft-mentes.json", types: [{ description: "TradeCraft mentés", accept: { "application/json": [".json"] } }] });
    await idbSet("settings", "backupHandle", handle);
    status = "active";
    await writeFile();
    if (status === "active") showToast("Az automatikus mentés bekapcsolva.");
  } catch (error) {
    if (error.name !== "AbortError") showToast("A fájl kiválasztása nem sikerült.", true);
  }
  render();
}

// Újraindítás után a böngésző csak felhasználói kattintásra adja vissza az írási engedélyt.
async function resume() {
  try {
    if ((await handle.requestPermission({ mode: "readwrite" })) === "granted") {
      status = "active";
      await writeFile();
    }
  } catch {
    status = "error";
  }
  render();
}

async function disable() {
  handle = null;
  status = "off";
  await idbDelete("settings", "backupHandle").catch(() => {});
  render();
}

function render() {
  const lastExport = state.profile.lastExportAt;
  const days = lastExport ? daysBetween(localDateKey(new Date(lastExport)), localDateKey()) : null;
  const last = lastExport ? `Utolsó mentés: ${formatDate(localDateKey(new Date(lastExport)))}.` : "Még nem készült mentés.";

  setText("#backup-status", !SUPPORTED ? `Ez a böngésző nem tud fájlba menteni automatikusan. Használd a JSON exportot. ${last}`
    : status === "active" ? `Bekapcsolva: minden változás a „${handle.name}” fájlba kerül. ${last}`
    : status === "paused" ? `Szünetel: a böngésző újra engedélyt kér a „${handle.name}” fájlhoz.`
    : status === "error" ? "A legutóbbi írás nem sikerült. Válaszd ki újra a fájlt."
    : `Kikapcsolva. ${last}`);
  $("#backup-enable").hidden = !SUPPORTED || status === "active" || status === "paused";
  $("#backup-resume").hidden = status !== "paused";
  $("#backup-disable").hidden = status !== "active" && status !== "paused";

  // Emlékeztető az áttekintésen, ha nincs élő automatikus mentés.
  const notice = $("#backup-notice");
  const created = daysBetween(localDateKey(new Date(state.profile.createdAt)), localDateKey());
  const stale = hasData() && status !== "active" && (days === null ? created >= 3 : days >= REMIND_AFTER_DAYS);
  notice.hidden = !(status === "paused" || stale);
  if (notice.hidden) return;
  setText("#backup-notice-text", status === "paused"
    ? "Az automatikus mentés szünetel. Egy kattintással folytatható."
    : days === null ? "Az adataid csak ezen a böngészőn vannak meg, mentés még nem készült." : `Az utolsó biztonsági mentés ${days} napja készült.`);
  setText("#backup-notice-action", status === "paused" ? "Folytatás" : "Mentés most");
}

export async function initBackup() {
  onSave(writeSoon);
  onRender(render);
  $("#backup-enable").addEventListener("click", enable);
  $("#backup-resume").addEventListener("click", resume);
  $("#backup-disable").addEventListener("click", disable);
  $("#backup-notice-action").addEventListener("click", () => (status === "paused" ? resume() : SUPPORTED ? enable() : exportJSON()));
  if (!SUPPORTED) return;
  try {
    handle = await idbGet("settings", "backupHandle");
    if (handle) status = (await handle.queryPermission({ mode: "readwrite" })) === "granted" ? "active" : "paused";
  } catch {
    handle = null;
  }
  render();
}
