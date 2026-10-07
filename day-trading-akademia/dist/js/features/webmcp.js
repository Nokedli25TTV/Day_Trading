// WebMCP eszközök: ha a böngésző támogatja, egy asszisztens lekérdezheti a haladást,
// jelölhet leckét és rögzíthet gyakorló naplóbejegyzést.
import { allLessons, getCompletedCount, getNextLesson, toggleLessonComplete } from "../lessons.js";
import { addJournalEntry } from "../views/journal.js";
import { localDateKey } from "../util.js";

export function initWebMCP() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const lifecycle = new AbortController();
  const register = (tool) => Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {});

  register({
    name: "get_learning_progress",
    title: "Tanulási haladás lekérése",
    description: "Lekéri a day trading roadmap teljesítését és a következő ajánlott leckét, módosítás nélkül.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute() {
      const next = getNextLesson();
      const completed = getCompletedCount();
      return { completedLessons: completed, totalLessons: allLessons.length, percent: Math.round((completed / allLessons.length) * 100), nextLesson: { id: next.id, title: next.title } };
    },
  });

  register({
    name: "mark_lesson_complete",
    title: "Lecke állapotának módosítása",
    description: "Egy létező TradeCraft lecke teljesítési állapotát módosítja, és frissíti a látható haladást.",
    inputSchema: { type: "object", properties: { lessonId: { type: "string" }, completed: { type: "boolean" } }, required: ["lessonId", "completed"], additionalProperties: false },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      if (!input || typeof input.lessonId !== "string" || typeof input.completed !== "boolean") throw new Error("A lessonId és completed mező kötelező.");
      return toggleLessonComplete(input.lessonId, input.completed);
    },
  });

  register({
    name: "create_practice_journal_entry",
    title: "Gyakorlási naplóbejegyzés létrehozása",
    description: "Szimulált vagy replay day trading naplóbejegyzést hoz létre a látható naplóban.",
    inputSchema: {
      type: "object",
      properties: {
        symbol: { type: "string", minLength: 1, maxLength: 24 },
        setup: { type: "string", minLength: 1, maxLength: 80 },
        lesson: { type: "string", minLength: 1, maxLength: 600 },
        mode: { type: "string", enum: ["paper", "replay", "live"] },
        direction: { type: "string", enum: ["long", "short", "no-trade"] },
        resultR: { type: "number" },
      },
      required: ["symbol", "setup", "lesson"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      if (!input || typeof input.symbol !== "string" || typeof input.setup !== "string" || typeof input.lesson !== "string") throw new Error("Az instrumentum, setup és tanulság kötelező.");
      const entry = addJournalEntry({ ...input, tradedAt: localDateKey() });
      return { id: entry.id, saved: true, symbol: entry.symbol, mode: entry.mode };
    },
  });
}
