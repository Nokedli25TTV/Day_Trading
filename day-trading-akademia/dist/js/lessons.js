// A leckék modellje: lista, állapot, teljesítés, heti terv, és a mindenhol használt leckesor.
import { DATA } from "../data.js";
import { CONTENT } from "../content/index.js";
import { state, commit, recordActivity } from "./store.js";
import { showToast } from "./toast.js";
import { escapeHTML, localDateKey, shortDate } from "./util.js";
import { scheduleFor, weekRange, weekProgress } from "./logic/schedule.js";

export const allLessons = DATA.modules.flatMap((module) =>
  module.lessons.map((lesson) => ({
    ...lesson,
    ...(CONTENT[lesson.id] || {}),
    moduleId: module.id,
    moduleNumber: module.number,
    moduleTitle: module.title,
  })),
);
allLessons.forEach((lesson, index) => { lesson.globalIndex = index + 1; });

export const TOTAL_WEEKS = Math.max(...allLessons.map((lesson) => lesson.week));
export const STATUS_LABEL = { done: "Kész", progress: "Folyamatban", new: "Új" };

// Melyik lecke melyik gyakorlófülhöz kapcsolódik.
export const LESSON_LABS = {
  "order-tipusok": ["order", "Megbízás-labor"],
  "spread-slippage": ["order", "Megbízás-labor"],
  "r-nyelve": ["risk", "Kockázati labor"],
  poziciomeretezes: ["risk", "Kockázati labor"],
  expectancy: ["risk", "Kockázati labor"],
  "volume-profile": ["flow", "Orderflow-labor"],
  "delta-cvd": ["flow", "Orderflow-labor"],
  footprint: ["flow", "Orderflow-labor"],
  drawdown: ["prop", "Prop szabályok"],
  "consistency-szabalykonyv": ["prop", "Prop szabályok"],
  "mock-evaluation": ["prop", "Prop szabályok"],
};

export const getLesson = (id) => allLessons.find((lesson) => lesson.id === id);
export const isLessonComplete = (id) => Boolean(state.progress[id]?.completed);
export const lessonStatus = (id) => (isLessonComplete(id) ? "done" : state.progress[id] ? "progress" : "new");
export const getCompletedCount = () => allLessons.filter((lesson) => isLessonComplete(lesson.id)).length;
export const getNextLesson = () => allLessons.find((lesson) => !isLessonComplete(lesson.id)) || allLessons[allLessons.length - 1];

export function getModuleStats(module) {
  const completed = module.lessons.filter((lesson) => isLessonComplete(lesson.id)).length;
  return { completed, total: module.lessons.length, percent: Math.round((completed / module.lessons.length) * 100) };
}

export function ensureLessonProgress(id) {
  if (!state.progress[id]) {
    state.progress[id] = { status: "in_progress", completed: false, note: "", lastOpenedAt: new Date().toISOString(), completedAt: null };
  }
  return state.progress[id];
}

export function toggleLessonComplete(id, explicitValue) {
  const lesson = getLesson(id);
  if (!lesson) throw new Error("Ismeretlen leckeazonosító.");
  const progress = ensureLessonProgress(id);
  const complete = typeof explicitValue === "boolean" ? explicitValue : !progress.completed;
  progress.completed = complete;
  progress.status = complete ? "completed" : "in_progress";
  progress.completedAt = complete ? new Date().toISOString() : null;
  progress.lastOpenedAt = new Date().toISOString();
  recordActivity();
  commit(complete ? "Lecke teljesítve" : "Állapot frissítve");
  showToast(complete ? `Kész: ${lesson.title}` : `Újratanulásra jelölve: ${lesson.title}`);
  return { lessonId: id, completed: complete, completedLessons: getCompletedCount(), totalLessons: allLessons.length };
}

// ---------- Heti terv ----------

export const getSchedule = () => scheduleFor(state.profile.startDate || localDateKey(), localDateKey());

export function weekRangeLabel(fromWeek, toWeek = fromWeek) {
  const range = weekRange(getSchedule().start, fromWeek, toWeek);
  return `${shortDate(range.from)} – ${shortDate(range.to)}`;
}

export const getWeekProgress = () => weekProgress(
  allLessons.map((lesson) => ({ week: lesson.week, complete: isLessonComplete(lesson.id) })),
  getSchedule(),
  TOTAL_WEEKS,
);

// ---------- Közös megjelenítés ----------

// Négy (vagy több) lecke = egy modul. Ugyanez a jel mutatja a haladást mindenhol.
export function ticksHTML(module) {
  return `<span class="ticks" aria-hidden="true">${module.lessons.map((lesson) => `<i class="${isLessonComplete(lesson.id) ? "on" : ""}"></i>`).join("")}</span>`;
}

export function lessonRowHTML(lesson, detailed = false) {
  const status = lessonStatus(lesson.id);
  const schedule = getSchedule();
  const thisWeek = schedule.started && schedule.week === lesson.week;
  return `<li><button class="lesson-row${detailed ? " lesson-row--detailed" : ""} is-${status}${thisWeek ? " is-this-week" : ""}" type="button" data-open-lesson="${lesson.id}">
    <span class="lesson-row__state" aria-hidden="true"></span>
    <span class="lesson-row__text"><strong>${escapeHTML(lesson.title)}</strong>${detailed ? `<span>${escapeHTML(lesson.summary)}</span>` : ""}</span>
    <span class="lesson-row__meta lesson-row__week">${thisWeek ? "Ez a hét" : `${lesson.week}. hét`}</span>
    <span class="lesson-row__meta">${lesson.duration} perc</span>
    <span class="lesson-row__status">${STATUS_LABEL[status]}</span>
  </button></li>`;
}

// A lecke teljes szövege kisbetűsen, a keresőknek.
export function lessonText(lesson) {
  const blocks = [...(lesson.sections || []), lesson.example || {}];
  return [
    lesson.title, lesson.summary, lesson.moduleTitle, ...lesson.keyPoints, ...(lesson.mistakes || []),
    ...blocks.flatMap((block) => [block.title || "", ...(block.intro || []), ...(block.body || []), ...(block.list || [])]),
  ].join(" ").toLocaleLowerCase("hu-HU");
}
