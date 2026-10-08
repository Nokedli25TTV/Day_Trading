// Kereskedés előtti ellenőrzőlista: amíg a mai lista nincs kipipálva, új naplóbejegyzés nem rögzíthető.
// Meglévő bejegyzés szerkesztése mindig engedett.
import { state, commit, onRender } from "../store.js";
import { checklistComplete } from "../logic/rulebook.js";
import { $, setText, escapeHTML, localDateKey } from "../util.js";

const todayChecks = () => state.preChecks[localDateKey()] || [];

// A zár az űrlapot teszi elérhetetlenné; szerkesztésnél (data-editing) nyitva marad.
export function applyGate() {
  const form = $("#journal-form");
  form.inert = !checklistComplete(state.rulebook.checklist, todayChecks()) && !form.dataset.editing;
  form.classList.toggle("is-gated", form.inert);
}

function renderPrecheck() {
  const { checklist } = state.rulebook;
  const checked = todayChecks();
  const left = checklist.filter((entry) => !checked.includes(entry.id)).length;
  $("#precheck").hidden = checklist.length === 0;
  $("#precheck").classList.toggle("is-done", left === 0);
  $("#precheck-list").innerHTML = checklist.map((entry) => `<li><label class="check-row"><input type="checkbox" value="${entry.id}" ${checked.includes(entry.id) ? "checked" : ""} /> ${escapeHTML(entry.text)}</label></li>`).join("");
  setText("#precheck-status", left ? `Még ${left} pont van hátra. Addig az új bejegyzés zárva marad.` : "Kész: ma rögzíthetsz bejegyzést.");
  applyGate();
}

export function initPrecheck() {
  onRender(renderPrecheck);
  $("#precheck-list").addEventListener("change", (event) => {
    const checked = new Set(todayChecks());
    if (event.target.checked) checked.add(event.target.value); else checked.delete(event.target.value);
    // Csak a mai nap pipái maradnak meg: holnap újra végig kell menni a listán.
    state.preChecks = { [localDateKey()]: [...checked] };
    commit("Ellenőrzőlista mentve");
  });
}
