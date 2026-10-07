// Gyorskereső: Ctrl+K vagy „/” nyitja. Leckék, fogalmak, naplóbejegyzések és úti célok egy helyen.
import { GLOSSARY } from "../../content/fogalomtar.js";
import { state } from "../store.js";
import { allLessons, getLesson, lessonText } from "../lessons.js";
import { showView } from "../router.js";
import { activateTab } from "../tabs.js";
import { openLesson } from "../views/lesson.js";
import { buildIndex, search } from "../logic/search.js";
import { directionLabel } from "../labels.js";
import { $, $$, escapeHTML, formatDate } from "../util.js";

const TYPE_LABEL = { lesson: "Lecke", term: "Fogalom", entry: "Napló", go: "Ugrás" };
// [cím, nézet, fül]
const DESTINATIONS = [
  ["Áttekintés", "attekintes"], ["Roadmap", "roadmap", "roadmap:plan"], ["Go / No-Go és mock evaluation", "roadmap", "roadmap:readiness"],
  ["Tananyag", "tananyag", "library:lessons"], ["Fogalomtár", "tananyag", "library:glossary"],
  ["Tudáspróba (kvíz)", "gyakorlas", "practice:quiz"], ["Ismétlés", "gyakorlas", "practice:review"], ["Kockázati labor: pozícióméret, várható érték", "gyakorlas", "practice:risk"],
  ["Megbízás-labor", "gyakorlas", "practice:order"], ["Orderflow-labor: value area, footprint", "gyakorlas", "practice:flow"], ["Prop szabályok: drawdown, consistency", "gyakorlas", "practice:prop"],
  ["Napló: új bejegyzés", "naplo", "journal:entries"], ["Napló-statisztika", "naplo", "journal:stats"], ["Heti review", "naplo", "journal:weekly"],
];

let index = [];
let results = [];
let selected = 0;

function rebuild() {
  index = buildIndex([
    ...allLessons.map((lesson) => ({ type: "lesson", title: lesson.title, detail: `${lesson.globalIndex}. lecke · ${lesson.moduleTitle}`, text: lessonText(lesson), run: () => openLesson(lesson.id) })),
    ...GLOSSARY.map(([term, definition, lessonId]) => ({ type: "term", title: term, detail: definition, run: () => (getLesson(lessonId) ? openLesson(lessonId) : showView("tananyag")) })),
    ...state.journalEntries.slice(-300).map((entry) => ({
      type: "entry",
      title: `${entry.symbol} · ${directionLabel(entry.direction)} · ${entry.setup}`,
      detail: `${formatDate(entry.tradedAt)} · ${entry.lesson}`,
      text: `${entry.observation || ""} ${entry.hypothesis || ""}`,
      run: () => { showView("naplo"); activateTab("journal", "entries"); },
    })),
    ...DESTINATIONS.map(([title, view, tab]) => ({ type: "go", title, detail: "", run: () => { showView(view); if (tab) activateTab(...tab.split(":")); } })),
  ]);
}

function render() {
  const query = $("#search-input").value;
  results = query.trim() ? search(index, query) : index.filter((item) => item.type === "go").slice(0, 8);
  selected = Math.min(selected, Math.max(0, results.length - 1));
  $("#search-empty").hidden = results.length > 0;
  $("#search-results").innerHTML = results.map((item, position) => `<li role="option" id="search-option-${position}" aria-selected="${position === selected}" data-result="${position}">
    <span class="search-type">${TYPE_LABEL[item.type]}</span>
    <span class="search-text"><strong>${escapeHTML(item.title)}</strong>${item.detail ? `<small>${escapeHTML(item.detail)}</small>` : ""}</span>
  </li>`).join("");
  $("#search-input").setAttribute("aria-activedescendant", results.length ? `search-option-${selected}` : "");
  $(`#search-option-${selected}`)?.scrollIntoView({ block: "nearest" });
}

function choose(position) {
  const item = results[position];
  if (!item) return;
  $("#search-dialog").close();
  item.run();
}

function open() {
  rebuild();
  selected = 0;
  $("#search-input").value = "";
  render();
  $("#search-dialog").showModal();
}

export function initSearch() {
  $("#search-input").addEventListener("input", () => { selected = 0; render(); });
  $("#search-input").addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      selected = (selected + (event.key === "ArrowDown" ? 1 : -1) + results.length) % Math.max(1, results.length);
      render();
    } else if (event.key === "Enter") {
      event.preventDefault();
      choose(selected);
    }
  });
  $("#search-results").addEventListener("click", (event) => {
    const option = event.target.closest("[data-result]");
    if (option) choose(Number(option.dataset.result));
  });
  document.addEventListener("click", (event) => { if (event.target.closest("[data-open-search]")) open(); });
  document.addEventListener("keydown", (event) => {
    const typing = event.target.closest?.("input, textarea, select, [contenteditable]");
    const shortcut = ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") || (event.key === "/" && !typing);
    if (!shortcut || $$("dialog[open]").length) return;
    event.preventDefault();
    open();
  });
}
