// Tanulási idő mérése a napi célhoz, és az öthetes naptár az áttekintésen.
import { state, persist, onRender } from "../store.js";
import { showToast } from "../toast.js";
import { $, setText, setMeter, localDateKey, addDays, shortDate, weekStart } from "../util.js";

const TICK_SECONDS = 15;
const IDLE_LIMIT_MS = 120000;
let lastInteraction = Date.now();

export const studyMinutes = (dateKey = localDateKey()) => Math.floor((Number(state.studyLog[dateKey]) || 0) / 60);
const dailyGoal = () => Number(state.profile.dailyGoal) || 30;

// Öt hét hétfőtől vasárnapig, az utolsó sor az aktuális hét.
function renderCalendar() {
  const container = $("#study-calendar");
  if (!container) return;
  const today = localDateKey();
  const first = addDays(weekStart(today), -28);
  let weekMinutes = 0;
  let weekDays = 0;
  container.innerHTML = Array.from({ length: 35 }, (_, index) => {
    const key = addDays(first, index);
    const minutes = studyMinutes(key);
    const active = minutes > 0 || state.activityDates.includes(key);
    const future = key > today;
    if (index >= 28 && !future) { weekMinutes += minutes; if (active) weekDays += 1; }
    const level = !active ? 0 : minutes >= dailyGoal() ? 3 : minutes >= dailyGoal() / 2 ? 2 : 1;
    const label = `${shortDate(key)}: ${future ? "még hátravan" : !active ? "nem volt tanulás" : minutes ? `${minutes} perc` : "aktív nap"}`;
    return `<i class="cal ${future ? "is-future" : `level-${level}`}${key === today ? " is-today" : ""}" title="${label}"></i>`;
  }).join("");
  const summary = `Ezen a héten ${weekMinutes} perc, ${weekDays} aktív nap.`;
  container.setAttribute("role", "img");
  container.setAttribute("aria-label", `Tanulási naptár az elmúlt öt hétről. ${summary}`);
  setText("#calendar-summary", summary);
}

export function renderStudyTime() {
  setText("#daily-goal-chip", `${studyMinutes()} / ${dailyGoal()} perc`);
  setMeter("#daily-meter", studyMinutes() / dailyGoal());
  renderCalendar();
}

// Csak akkor számol, ha a lap látható és volt friss interakció.
function tick() {
  if (document.visibilityState !== "visible" || Date.now() - lastInteraction > IDLE_LIMIT_MS) return;
  const today = localDateKey();
  const before = studyMinutes(today);
  state.studyLog[today] = (Number(state.studyLog[today]) || 0) + TICK_SECONDS;
  persist();
  const after = studyMinutes(today);
  if (after === before) return;
  renderStudyTime();
  if (after === dailyGoal()) showToast(`Megvan a mai ${after} perc.`);
}

export function initStudyTime() {
  ["pointerdown", "keydown", "scroll"].forEach((type) => window.addEventListener(type, () => { lastInteraction = Date.now(); }, { passive: true }));
  window.setInterval(tick, TICK_SECONDS * 1000);
  onRender(renderStudyTime);
}
