// Első indításos bemutató: a kiválasztott elem körül világos ablak marad, a többi háttér elhalványul.
import { state, save } from "../store.js";
import { showView } from "../router.js";
import { activateTab } from "../tabs.js";
import { $ } from "../util.js";

const STEPS = [
  { view: "attekintes", selector: ".next-lesson", title: "Innen indul a napi tanulás", text: "A következő ajánlott lecke, a heti cél és a haladás mindig az Áttekintésen vár." },
  { view: "roadmap", tab: ["roadmap", "plan"], selector: "#roadmap-plan .toolbar", title: "A teljes útvonal", text: "A Roadmap 24 hétre és hat modulra bontja a tanulást. Bármelyik leckét megnyithatod." },
  { view: "tananyag", tab: ["library", "lessons"], selector: ".library-toolbar", title: "Leckék és fogalomtár", text: "Itt kereshetsz a leckékben, szűrhetsz modulra, és saját jegyzetet írhatsz." },
  { view: "gyakorlas", tab: ["practice", "quiz"], selector: "#view-gyakorlas .tab-list", title: "Gyakorlás többféleképpen", text: "Kvíz, modulvizsga, hibafüzet, időzített ismétlés és számolós laborok vannak egy helyen." },
  { view: "naplo", tab: ["journal", "entries"], selector: "#journal-form-title", title: "A folyamat naplója", text: "Rögzítsd a helyzetet, az R-eredményt, a szabályokat és akár egy képernyőképet is." },
  { view: "attekintes", selector: "[data-open-search]", title: "Gyorskereső", text: "A nagyítóval vagy Ctrl+K-val leckére, fogalomra, naplóbejegyzésre és eszközre ugorhatsz." },
  { view: "attekintes", selector: "[data-open-settings]", title: "Téma, mentés és import", text: "A Beállításokban témát válthatsz, teljes ZIP mentést készíthetsz, és újraindíthatod ezt a bemutatót." },
];

let stepIndex = 0;
let currentTarget = null;

const visibleTarget = (selector) => [...document.querySelectorAll(selector)].find((element) => element.getClientRects().length && getComputedStyle(element).visibility !== "hidden");
const shade = (name) => $(`[data-tutorial-shade="${name}"]`);

function setBox(element, { top, left, width, height }) {
  Object.assign(element.style, { top: `${top}px`, left: `${left}px`, width: `${Math.max(0, width)}px`, height: `${Math.max(0, height)}px` });
}

function position() {
  if ($("#tutorial").hidden || !currentTarget) return;
  const padding = 8;
  const raw = currentTarget.getBoundingClientRect();
  const x = Math.max(6, raw.left - padding);
  const y = Math.max(6, raw.top - padding);
  const right = Math.min(innerWidth - 6, raw.right + padding);
  const bottom = Math.min(innerHeight - 6, raw.bottom + padding);
  setBox(shade("top"), { top: 0, left: 0, width: innerWidth, height: y });
  setBox(shade("bottom"), { top: bottom, left: 0, width: innerWidth, height: innerHeight - bottom });
  setBox(shade("left"), { top: y, left: 0, width: x, height: bottom - y });
  setBox(shade("right"), { top: y, left: right, width: innerWidth - right, height: bottom - y });
  setBox($("#tutorial-highlight"), { top: y, left: x, width: right - x, height: bottom - y });

  const card = $("#tutorial-card");
  const cardWidth = Math.min(360, innerWidth - 24);
  card.style.width = `${cardWidth}px`;
  const cardHeight = card.offsetHeight;
  const below = innerHeight - bottom >= cardHeight + 24;
  card.classList.toggle("arrow-top", below);
  card.classList.toggle("arrow-bottom", !below);
  const top = below ? bottom + 16 : Math.max(12, y - cardHeight - 16);
  const left = Math.min(innerWidth - cardWidth - 12, Math.max(12, x + (right - x - cardWidth) / 2));
  Object.assign(card.style, { top: `${top}px`, left: `${left}px` });
}

function showStep() {
  const step = STEPS[stepIndex];
  showView(step.view, { updateHash: false });
  if (step.tab) activateTab(...step.tab);
  $("#tutorial-step").textContent = `${stepIndex + 1} / ${STEPS.length}`;
  $("#tutorial-title").textContent = step.title;
  $("#tutorial-text").textContent = step.text;
  $("#tutorial-back").hidden = stepIndex === 0;
  $("#tutorial-next").textContent = stepIndex === STEPS.length - 1 ? "Kész ✓" : "Tovább →";
  setTimeout(() => {
    currentTarget = visibleTarget(step.selector);
    if (!currentTarget) { finish(); return; }
    currentTarget.scrollIntoView({ block: "center", inline: "nearest" });
    setTimeout(() => { position(); $("#tutorial-next").focus({ preventScroll: true }); }, 80);
  }, 40);
}

function finish() {
  $("#tutorial").hidden = true;
  document.body.classList.remove("tutorial-open");
  currentTarget = null;
  state.settings.tutorialSeen = true;
  save("Bemutató befejezve");
}

export function startTutorial() {
  const settings = $("#settings-dialog");
  if (settings?.open) settings.close();
  stepIndex = 0;
  $("#tutorial").hidden = false;
  document.body.classList.add("tutorial-open");
  showStep();
}

export function initTutorial() {
  $("#tutorial-next").addEventListener("click", () => {
    if (stepIndex >= STEPS.length - 1) finish();
    else { stepIndex += 1; showStep(); }
  });
  $("#tutorial-back").addEventListener("click", () => { if (stepIndex > 0) { stepIndex -= 1; showStep(); } });
  $("#tutorial-skip").addEventListener("click", finish);
  window.addEventListener("resize", position);
  document.addEventListener("keydown", (event) => {
    if ($("#tutorial").hidden) return;
    if (event.key === "Escape") finish();
    else if (event.key === "ArrowRight") $("#tutorial-next").click();
    else if (event.key === "ArrowLeft" && stepIndex > 0) $("#tutorial-back").click();
  });
  if (!state.settings.tutorialSeen) setTimeout(startTutorial, 650);
}
