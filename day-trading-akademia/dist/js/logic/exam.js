// Modulvizsga-kérdések és eredményszámítás DOM és állapot nélkül.

export const EXAM_LENGTH = 8;
export const EXAM_PASS_PERCENT = 80;

export function moduleQuestionPool(module, content) {
  if (!module?.lessons || !content) return [];
  return module.lessons.flatMap((lesson) => (content[lesson.id]?.check || []).map((item, index) => ({
    id: `check:${lesson.id}:${index}`,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    question: item.q,
    answer: item.a,
  })));
}

export function evaluateExam(answers, official) {
  const total = answers.length;
  const score = answers.filter((answer) => answer.correct).length;
  const percent = total ? Math.round((score / total) * 100) : 0;
  return { score, total, percent, official: Boolean(official), passed: Boolean(official) && percent >= EXAM_PASS_PERCENT };
}
