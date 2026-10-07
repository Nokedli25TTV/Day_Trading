// Az ismétlő pakli: a teljesített leckék önellenőrző kérdései és a kvízben elrontott kérdések.
import { DATA } from "../data.js";
import { state } from "./store.js";
import { allLessons, getLesson, isLessonComplete } from "./lessons.js";
import { hashText, localDateKey } from "./util.js";
import { firstDue } from "./logic/review.js";

export const quizCardId = (question) => `quiz:${hashText(question.question)}`;
const QUIZ_BY_CARD = new Map(DATA.quiz.map((question) => [quizCardId(question), question]));

export function reviewCards() {
  const cards = [];
  allLessons.forEach((lesson) => (lesson.check || []).forEach((item, index) => {
    const id = `check:${lesson.id}:${index}`;
    const saved = state.reviews[id];
    if (!saved && !isLessonComplete(lesson.id)) return;
    const completed = localDateKey(new Date(state.progress[lesson.id]?.completedAt || Date.now()));
    cards.push({ id, front: item.q, back: item.a, lesson, box: saved?.box || 0, due: saved ? saved.due : firstDue(completed) });
  }));
  Object.keys(state.reviews).forEach((id) => {
    const question = QUIZ_BY_CARD.get(id);
    if (!question) return;
    cards.push({
      id,
      front: question.question,
      back: `**${question.options[question.correct]}** ${question.explanation}`,
      lesson: getLesson(question.lesson),
      box: state.reviews[id].box || 0,
      due: state.reviews[id].due,
      fromQuiz: true,
    });
  });
  return cards;
}

export const dueCount = () => reviewCards().filter((card) => card.due <= localDateKey()).length;
export const reviewedToday = () => Object.values(state.reviews).some((review) => review.seen === localDateKey());
