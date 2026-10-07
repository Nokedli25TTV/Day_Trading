// Áttekintés: következő lecke, mai menet, heti terv, a hat hónap csíkja és az állapotlista.
import { DATA } from "../../data.js";
import { state, onRender, getStreak } from "../store.js";
import { allLessons, TOTAL_WEEKS, getNextLesson, getCompletedCount, getModuleStats, isLessonComplete, ticksHTML, lessonRowHTML, getSchedule, getWeekProgress, weekRangeLabel } from "../lessons.js";
import { dueCount, reviewedToday } from "../review-deck.js";
import { journalStats } from "../logic/calc.js";
import { $, setText, setMeter, escapeHTML, formatNumber, isToday, shortDate } from "../util.js";

function renderWeek() {
  const schedule = getSchedule();
  const progress = getWeekProgress();
  const remaining = allLessons.filter((lesson) => !isLessonComplete(lesson.id));
  let lessons = allLessons.filter((lesson) => lesson.week === schedule.week);
  let range = `${schedule.week}. hét · ${weekRangeLabel(schedule.week)}`;
  let status;
  if (progress.phase === "not-started") {
    lessons = allLessons.filter((lesson) => lesson.week === 1);
    range = `Kezdés: ${shortDate(schedule.start)}`;
    status = "A terv még nem indult el. Addig is bármelyik lecke megnyitható.";
  } else if (progress.phase === "finished") {
    lessons = remaining.slice(0, 4);
    range = `A ${TOTAL_WEEKS} hetes terv véget ért`;
    status = remaining.length
      ? `${remaining.length} lecke van még hátra. A tempó a tiéd: a beállításokban új kezdőnapot is megadhatsz.`
      : "Minden lecke kész. Most a gyakorlás és a heti review számít.";
  } else {
    status = progress.behind ? `${progress.behind} lecke maradt el a korábbi hetekből. Előbb azokat pótold: a sorrend számít.`
      : progress.left ? `${progress.left} lecke van hátra erre a hétre.`
      : progress.ahead ? `A heti leckék készen vannak, és ${progress.ahead} leckével előrébb jársz a tervnél.`
      : "A heti leckék készen vannak. Marad idő ismétlésre és replayre.";
  }
  setText("#week-range", range);
  setText("#week-status", status);
  $("#week-lessons").innerHTML = lessons.map((lesson) => lessonRowHTML(lesson)).join("");
}

function renderOverview() {
  const completed = getCompletedCount();
  const percent = Math.round((completed / allLessons.length) * 100);
  const next = getNextLesson();
  const allDone = completed === allLessons.length;
  const currentModule = DATA.modules.find((module) => module.id === next.moduleId) || DATA.modules[0];
  const moduleStats = getModuleStats(currentModule);
  const bestQuiz = state.quizAttempts.length ? Math.max(...state.quizAttempts.map((attempt) => Number(attempt.percent) || 0)) : null;

  setText("#focus-module", allDone ? "Minden lecke kész · ismétlés" : `Következő lecke · ${next.moduleNumber} ${next.moduleTitle}`);
  setText("#focus-title", next.title);
  setText("#focus-description", next.summary);
  $("#focus-meta").innerHTML = `<span>${next.week}. hét</span><span>${next.duration} perc</span><span>${moduleStats.completed}/${moduleStats.total} kész a modulból</span>`;
  const continueButton = $("#continue-button");
  continueButton.dataset.openLesson = next.id;
  continueButton.textContent = allDone ? "Lecke átismétlése" : state.progress[next.id] ? "Tanulás folytatása" : "Lecke megkezdése";

  const due = dueCount();
  setText("#overall-count", `${completed} / ${allLessons.length}`);
  setText("#nav-progress-copy", `${completed} / ${allLessons.length} lecke · ${percent}%`);
  setMeter("#nav-progress-bar", completed / allLessons.length);
  setText("#stat-streak", String(getStreak()));
  setText("#stat-quiz", bestQuiz === null ? "–" : `${bestQuiz}%`);
  setText("#stat-journal", String(state.journalEntries.length));
  setText("#stat-questions", String(state.questions.length));
  setText("#stat-rules", state.journalEntries.length ? `${formatNumber(journalStats(state.journalEntries).ruleRate, 0)}%` : "–");
  setText("#stat-due", String(due));

  renderWeek();

  $("#overview-roadmap").innerHTML = DATA.modules.map((module) => {
    const stats = getModuleStats(module);
    const status = stats.completed === stats.total ? "completed" : module.id === currentModule.id ? "current" : "";
    return `<li class="track ${status}">${ticksHTML(module)}<span class="track__num">${module.number}</span><strong>${escapeHTML(module.shortTitle)}</strong><small>${stats.completed}/${stats.total} lecke</small></li>`;
  }).join("");

  const steps = [
    { title: next.title, detail: `${next.duration} perc · ${next.moduleTitle}`, done: isLessonComplete(next.id), action: "Lecke", attr: `data-open-lesson="${next.id}"` },
    ...(due || reviewedToday() ? [{ title: due ? `${due} kártya ismétlése` : "Ismétlés", detail: "Önellenőrző kérdések és korábbi hibás válaszok", done: !due, action: "Ismétlés", attr: 'data-view-target="gyakorlas" data-tab="practice:review"' }] : []),
    { title: "3–5 kvízkérdés", detail: "Aktív felidézés, azonnali magyarázattal", done: state.quizAttempts.some((attempt) => isToday(attempt.completedAt)), action: "Kvíz", attr: 'data-view-target="gyakorlas" data-tab="practice:quiz"' },
    { title: "Egy mondatos review", detail: "Mit értettél meg, mi maradt kérdés?", done: state.journalEntries.some((entry) => isToday(entry.createdAt)), action: "Napló", attr: 'data-view-target="naplo"' },
  ];
  $("#daily-steps").innerHTML = steps.map((item, index) => `<li class="step${item.done ? " done" : ""}"><span class="step__mark" aria-hidden="true">${item.done ? "✓" : index + 1}</span><div><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.detail)}${item.done ? " · ma kész" : ""}</small></div><button class="text-button" type="button" ${item.attr}>${item.action}</button></li>`).join("");
}

export function initOverview() {
  onRender(renderOverview);
}
