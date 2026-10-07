// A heti terv számítása: melyik hétnél tartasz, és hogyan állsz a leckékkel.
import { addDays, daysBetween } from "./dates.js";

export function scheduleFor(startKey, todayKey) {
  const elapsed = daysBetween(startKey, todayKey);
  return { start: startKey, started: elapsed >= 0, week: Math.floor(Math.max(0, elapsed) / 7) + 1 };
}

// Egy vagy több egymást követő hét első és utolsó napja.
export function weekRange(startKey, fromWeek, toWeek = fromWeek) {
  return { from: addDays(startKey, (fromWeek - 1) * 7), to: addDays(startKey, toWeek * 7 - 1) };
}

// lessons: [{ week, complete }]
export function weekProgress(lessons, schedule, totalWeeks) {
  const remaining = lessons.filter((lesson) => !lesson.complete).length;
  if (!schedule.started) return { phase: "not-started", remaining, behind: 0, ahead: 0, left: 0 };
  if (schedule.week > totalWeeks) return { phase: "finished", remaining, behind: 0, ahead: 0, left: 0 };
  return {
    phase: "active",
    remaining,
    behind: lessons.filter((lesson) => lesson.week < schedule.week && !lesson.complete).length,
    ahead: lessons.filter((lesson) => lesson.week > schedule.week && lesson.complete).length,
    left: lessons.filter((lesson) => lesson.week === schedule.week && !lesson.complete).length,
  };
}
