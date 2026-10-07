// Heti review: öt terület folyamatpontszáma, egy fókusz a következő hétre. Hetente egy értékelés.
import { state, commit, onRender } from "../store.js";
import { showToast } from "../toast.js";
import { journalStats } from "../logic/calc.js";
import { dailyDiscipline } from "../logic/readiness.js";
import { $, setText, escapeHTML, formatNumber, signedR, shortDate, localDateKey, addDays, weekStart, formObject, uid } from "../util.js";

export const AREAS = [
  ["prep", "Előkészítés", "Megvolt a terv és a kijelölt szintek a kereskedés előtt?"],
  ["patience", "Kivárás", "Csak a teljes setupnál léptél be?"],
  ["sizing", "Méretezés", "A méret mindig a kockázatból jött?"],
  ["exit", "Kilépés", "A stopot és a célt a terv szerint kezelted?"],
  ["journal", "Naplózás", "Minden kötés és kimaradt helyzet bekerült?"],
];

const thisWeek = () => weekStart(localDateKey());
const rangeLabel = (start) => `${shortDate(start)} – ${shortDate(addDays(start, 6))}`;
const average = (scores) => AREAS.reduce((total, [key]) => total + (Number(scores[key]) || 0), 0) / AREAS.length;

function weekEntries(start) {
  const end = addDays(start, 6);
  return state.journalEntries.filter((entry) => entry.tradedAt >= start && entry.tradedAt <= end);
}

function renderForm() {
  const start = thisWeek();
  const saved = state.weeklyReviews.find((review) => review.weekStart === start);
  const form = $("#weekly-form");
  setText("#weekly-range", `${rangeLabel(start)}${saved ? " · már értékelted, módosíthatod" : ""}`);

  const entries = weekEntries(start);
  const stats = journalStats(entries);
  const discipline = dailyDiscipline(entries, Number(state.profile.dailyLimitR) || 2, localDateKey());
  $("#weekly-summary").innerHTML = [
    ["Kötés a héten", String(stats.count)],
    ["Heti eredmény", stats.count ? signedR(stats.totalR) : "–"],
    ["Szabálykövetés", stats.entries ? `${formatNumber(stats.ruleRate, 0)}%` : "–"],
    ["Limit utáni kötés", `${discipline.breachDays} nap`],
  ].map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("");

  // A pontszámmezőket csak egyszer építjük fel, hogy kitöltés közben ne vesszen el a választás.
  const scores = $("#weekly-scores");
  if (!scores.children.length) {
    scores.innerHTML = AREAS.map(([key, label, question]) => `<fieldset class="score"><legend>${label}</legend><p>${question}</p><div class="score__options">${[1, 2, 3, 4, 5].map((value) => `<label><input type="radio" name="score-${key}" value="${value}" required /><span>${value}</span></label>`).join("")}</div></fieldset>`).join("");
  }
  if (form.dataset.week !== start + (saved?.updatedAt || "")) {
    form.dataset.week = start + (saved?.updatedAt || "");
    form.reset();
    if (saved) AREAS.forEach(([key]) => { form.elements[`score-${key}`].value = String(saved.scores[key]); });
    form.elements.wentWell.value = saved?.wentWell || "";
    form.elements.focus.value = saved?.focus || "";
    form.elements.change.value = saved?.change || "";
  }
}

function renderHistory() {
  const reviews = [...state.weeklyReviews].sort((a, b) => b.weekStart.localeCompare(a.weekStart));
  setText("#weekly-count", `${reviews.length} hét`);
  $("#weekly-empty").hidden = reviews.length > 0;
  $("#weekly-list").innerHTML = reviews.map((review) => {
    const weakest = AREAS.reduce((lowest, area) => (Number(review.scores[area[0]]) < Number(review.scores[lowest[0]]) ? area : lowest), AREAS[0]);
    return `<article class="journal-entry">
      <div class="journal-entry__top"><div><strong>${rangeLabel(review.weekStart)}</strong><small>Átlag: ${formatNumber(average(review.scores), 1)} / 5 · leggyengébb: ${weakest[1].toLocaleLowerCase("hu-HU")}</small></div></div>
      <div class="journal-entry__badges">${AREAS.map(([key, label]) => `<span>${label} ${review.scores[key]}</span>`).join("")}</div>
      <p class="journal-entry__detail"><strong>Fókusz:</strong> ${escapeHTML(review.focus)}</p>
      ${review.change ? `<p class="journal-entry__detail"><strong>Változtatás:</strong> ${escapeHTML(review.change)}</p>` : ""}
      ${review.wentWell ? `<p>${escapeHTML(review.wentWell)}</p>` : ""}
    </article>`;
  }).join("");
}

function submit(event) {
  event.preventDefault();
  const input = formObject(event.currentTarget);
  const start = thisWeek();
  const review = {
    weekStart: start,
    scores: Object.fromEntries(AREAS.map(([key]) => [key, Number(input[`score-${key}`])])),
    wentWell: String(input.wentWell || "").trim().slice(0, 600),
    focus: String(input.focus || "").trim().slice(0, 200),
    change: String(input.change || "").trim().slice(0, 200),
    updatedAt: new Date().toISOString(),
  };
  const existing = state.weeklyReviews.find((item) => item.weekStart === start);
  if (existing) Object.assign(existing, review); else state.weeklyReviews.push({ id: uid(), ...review });
  commit("Heti review mentve");
  showToast("A heti review mentve.");
}

export function initWeeklyReview() {
  onRender(() => { renderForm(); renderHistory(); });
  $("#weekly-form").addEventListener("submit", submit);
}
