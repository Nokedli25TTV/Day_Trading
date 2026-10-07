// Beállítások ablak: profil, megjelenés, adatmentés, import és törlés.
import { state, replaceState, normalizeState, createDefaultState, commit, onRender } from "../store.js";
import { showToast } from "../toast.js";
import { showView, getCurrentView } from "../router.js";
import { exportJSON } from "../features/backup.js";
import { clearAttachments } from "../features/attachments.js";
import { resetQuiz } from "./quiz.js";
import { resetReview } from "./review.js";
import { $, formObject } from "../util.js";

function applySettings() {
  document.body.classList.toggle("reduce-motion", Boolean(state.settings.reducedMotion));
  const theme = state.settings.theme;
  if (theme === "light" || theme === "dark") document.documentElement.dataset.theme = theme;
  else delete document.documentElement.dataset.theme;
}

function open() {
  const form = $("#settings-form");
  form.elements.experience.value = state.profile.experience;
  form.elements.dailyGoal.value = String(state.profile.dailyGoal);
  form.elements.dailyLimitR.value = String(state.profile.dailyLimitR);
  form.elements.startDate.value = state.profile.startDate;
  form.elements.theme.value = ["light", "dark"].includes(state.settings.theme) ? state.settings.theme : "system";
  form.elements.reducedMotion.checked = Boolean(state.settings.reducedMotion);
  $("#settings-dialog").showModal();
}

function submit(event) {
  event.preventDefault();
  const input = formObject(event.currentTarget);
  state.profile.experience = input.experience;
  state.profile.dailyGoal = Number(input.dailyGoal) || 30;
  state.profile.dailyLimitR = Number(input.dailyLimitR) > 0 ? Number(input.dailyLimitR) : 2;
  if (input.startDate) state.profile.startDate = input.startDate;
  state.settings.theme = input.theme;
  state.settings.reducedMotion = event.currentTarget.elements.reducedMotion.checked;
  commit("Beállítások mentve");
  $("#settings-dialog").close();
  showToast("A beállítások frissültek.");
}

// Csere után minden munkamenet-állapot (kvíz, ismétlés, nyitott lecke) is alaphelyzetbe kerül.
function swapState(next, message) {
  replaceState(next);
  resetReview();
  commit(message);
  resetQuiz();
  if (getCurrentView() === "lecke") showView("tananyag");
  $("#settings-dialog").close();
}

async function importFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    if (!parsed || typeof parsed !== "object" || !parsed.profile || !parsed.progress) throw new Error("A fájl nem érvényes TradeCraft mentés.");
    if (!confirm("Az import felülírja a jelenlegi helyi adatokat. Folytatod?")) return;
    swapState(normalizeState(parsed), "Import kész");
    showToast("Az adatok importálva.");
  } catch (error) {
    showToast(error.message || "Az import sikertelen.", true);
  } finally {
    event.target.value = "";
  }
}

function reset() {
  if (!confirm("Ez törli a helyi haladást, jegyzeteket, kvízeket, naplót és a képernyőképeket. Exportált mentés nélkül nem vonható vissza. Biztosan folytatod?")) return;
  clearAttachments().catch(() => {});
  swapState(createDefaultState(), "Adatok törölve");
  showToast("A helyi adatok törölve.");
}

export function initSettings() {
  onRender(applySettings);
  $("#settings-form").addEventListener("submit", submit);
  $("#export-data").addEventListener("click", exportJSON);
  $("#export-from-journal").addEventListener("click", exportJSON);
  $("#import-data").addEventListener("change", importFile);
  $("#reset-data").addEventListener("click", reset);
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-open-settings]")) open();
    const close = event.target.closest("[data-close-dialog]");
    if (close) $(`#${close.dataset.closeDialog}`)?.close();
  });
  // Kattintás a párbeszédablakon kívülre: bezárás.
  document.querySelectorAll("dialog").forEach((dialog) => dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  }));
}
