// Hibafüzet: a kvízben és modulvizsgán elrontott kérdések egy helyen.
import { state, commit, onRender } from "../store.js";
import { getLesson } from "../lessons.js";
import { mistakeList, mistakeSummary, setMistakeResolved } from "../logic/mistakes.js";
import { $, escapeHTML, formatInline, formatDate, localDateKey } from "../util.js";

let filter = "active";

function cardHTML(item) {
  const lesson = getLesson(item.lesson);
  const source = item.source === "exam" ? "Modulvizsga" : item.source === "review" ? "Ismétlés" : "Tudáspróba";
  return `<article class="mistake-card${item.resolvedAt ? " is-resolved" : ""}">
    <div class="mistake-card__meta"><span>${source}</span><span>${item.wrongCount || 1} hiba</span><span>${formatDate(item.lastWrongAt)}</span></div>
    <h3>${escapeHTML(item.question)}</h3>
    ${item.selectedAnswer ? `<p class="mistake-card__wrong"><strong>A válaszod:</strong> ${escapeHTML(item.selectedAnswer)}</p>` : ""}
    <p class="mistake-card__right"><strong>Helyes válasz:</strong> ${formatInline(item.correctAnswer)}</p>
    ${item.explanation ? `<p class="mistake-card__explanation">${formatInline(item.explanation)}</p>` : ""}
    <div class="mistake-card__actions">
      <button class="${item.resolvedAt ? "secondary-button" : "primary-button"}" type="button" data-mistake-toggle="${escapeHTML(item.id)}">${item.resolvedAt ? "Visszateszem" : "Megértettem"}</button>
      ${lesson ? `<button class="text-button" type="button" data-open-lesson="${lesson.id}">Kapcsolódó lecke: ${escapeHTML(lesson.title)}</button>` : ""}
    </div>
  </article>`;
}

function render() {
  const summary = mistakeSummary(state.mistakes);
  const items = mistakeList(state.mistakes, filter);
  const count = $("#mistake-count");
  count.hidden = summary.active === 0;
  count.textContent = String(summary.active);
  $("#mistake-filter").value = filter;
  $("#mistake-summary").textContent = summary.total
    ? `${summary.active} aktív, ${summary.resolved} megértett kérdés.`
    : "A hibafüzet még üres.";
  $("#mistake-list").innerHTML = items.length
    ? items.map(cardHTML).join("")
    : `<div class="empty-state"><h3>${filter === "active" ? "Nincs aktív hiba" : "Nincs ilyen bejegyzés"}</h3><p>A téves kvíz- és vizsgaválaszok automatikusan ide kerülnek.</p></div>`;
}

function toggle(id) {
  const item = state.mistakes[id];
  if (!item) return;
  const resolved = !item.resolvedAt;
  state.mistakes = setMistakeResolved(state.mistakes, id, resolved);
  if (!resolved) state.reviews[id] = { box: 0, due: localDateKey() };
  commit(resolved ? "Hiba megértettként jelölve" : "Hiba visszatéve az ismétlésbe");
}

export function initMistakes() {
  onRender(render);
  $("#mistake-filter").addEventListener("change", (event) => { filter = event.target.value; render(); });
  $("#mistake-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-mistake-toggle]");
    if (button) toggle(button.dataset.mistakeToggle);
  });
  render();
}
