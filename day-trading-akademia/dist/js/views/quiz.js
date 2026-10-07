// Tudáspróba: körönként sorsolt kérdések kevert válaszokkal. A hibás válasz az ismétlő pakliba kerül.
import { DATA } from "../../data.js";
import { state, commit, recordActivity } from "../store.js";
import { getLesson, lessonRowHTML } from "../lessons.js";
import { quizCardId } from "../review-deck.js";
import { $, $$, setText, setMeter, escapeHTML, shuffle, uid, localDateKey, addDays } from "../util.js";

const QUIZ_LENGTH = Math.min(12, DATA.quiz.length);
let run = createRun();

function createRun() {
  const questions = shuffle(DATA.quiz).slice(0, QUIZ_LENGTH).map((question) => {
    const order = shuffle(question.options.map((_, index) => index));
    return { ...question, options: order.map((index) => question.options[index]), correct: order.indexOf(question.correct) };
  });
  return { questions, index: 0, score: 0, answers: [], answered: false, choice: null, startedAt: new Date().toISOString(), saved: false };
}

function finish() {
  const percent = Math.round((run.score / run.questions.length) * 100);
  state.quizAttempts.push({ id: uid(), answers: run.answers, score: run.score, percent, startedAt: run.startedAt, completedAt: new Date().toISOString() });
  run.saved = true;
  recordActivity();
  commit("Kvízeredmény mentve");
}

function renderResult(content) {
  const percent = Math.round((run.score / run.questions.length) * 100);
  const reviewLessons = [...new Set(run.answers.filter((answer) => !answer.correct).map((answer) => answer.lesson))].map(getLesson).filter(Boolean);
  const review = reviewLessons.length ? `<div class="quiz-review"><h3>Érdemes átismételni</h3><ul class="lesson-rows">${reviewLessons.map((lesson) => lessonRowHTML(lesson)).join("")}</ul></div>` : "";
  const title = percent >= 80 ? "Stabil alapok" : percent >= 60 ? "Jó irány, célzott ismétléssel" : "Még épül az alap";
  const advice = percent >= 80 ? "Ismételd át a bizonytalan válaszokat, majd alkalmazd a fogalmakat replayben." : "Nyisd meg a hibás témák leckéit, majd próbáld újra. A következő kör új kérdéseket sorsol.";
  content.innerHTML = `<div class="quiz-result"><p class="quiz-result__count">${run.score} / ${run.questions.length} helyes válasz</p><h2><span class="quiz-result__score">${percent}%</span> · ${title}</h2><p>${advice}</p>${review}<button class="primary-button" type="button" data-quiz-restart>Új kör, új kérdések</button></div>`;
  setText("#quiz-counter", "Kész");
  setText("#quiz-score", `${run.score} pont`);
  setMeter("#quiz-progress-bar", 1);
}

function renderQuiz() {
  const content = $("#quiz-content");
  if (run.index >= run.questions.length) {
    if (!run.saved) finish();
    renderResult(content);
    return;
  }
  const question = run.questions[run.index];
  const lesson = getLesson(question.lesson);
  setText("#quiz-counter", `${run.index + 1} / ${run.questions.length}`);
  setText("#quiz-score", `${run.score} pont`);
  setMeter("#quiz-progress-bar", (run.index + (run.answered ? 1 : 0)) / run.questions.length);
  const right = run.choice === question.correct;
  content.innerHTML = `<h2 class="quiz-question">${escapeHTML(question.question)}</h2>
    <div class="quiz-options">${question.options.map((option, index) => {
      const className = !run.answered ? "" : index === question.correct ? "correct" : run.choice === index ? "wrong" : "";
      return `<button class="quiz-option ${className}" type="button" data-quiz-option="${index}" ${run.answered ? "disabled" : ""}><span>${String.fromCharCode(65 + index)}</span>${escapeHTML(option)}</button>`;
    }).join("")}</div>
    ${run.answered ? `<div class="quiz-feedback ${right ? "" : "wrong"}"><strong>${right ? "Helyes gondolatmenet" : "Most még nem ez a legpontosabb"}</strong><p>${escapeHTML(question.explanation)}</p>${lesson ? `<button class="text-button" type="button" data-open-lesson="${lesson.id}">Kapcsolódó lecke: ${escapeHTML(lesson.title)}</button>` : ""}</div>
      <div class="quiz-next"><button class="primary-button" type="button" data-quiz-next>${run.index === run.questions.length - 1 ? "Eredmény megtekintése" : "Következő kérdés"}</button></div>` : ""}`;
  if (run.answered) content.querySelector("[data-quiz-next]").focus({ preventScroll: true });
}

function answer(choice) {
  if (run.answered) return;
  const question = run.questions[run.index];
  run.answered = true;
  run.choice = choice;
  const correct = choice === question.correct;
  if (correct) run.score += 1;
  run.answers.push({ question: question.question, lesson: question.lesson, correct });
  if (!correct) {
    state.reviews[quizCardId(question)] = { box: 0, due: addDays(localDateKey(), 1) };
    commit("Kérdés az ismétlők között");
  }
  renderQuiz();
}

export function resetQuiz() {
  run = createRun();
  renderQuiz();
}

export function initQuiz() {
  $("#quiz-content").addEventListener("click", (event) => {
    const option = event.target.closest("[data-quiz-option]");
    if (option) answer(Number(option.dataset.quizOption));
    else if (event.target.closest("[data-quiz-next]")) { run.index += 1; run.answered = false; run.choice = null; renderQuiz(); }
    else if (event.target.closest("[data-quiz-restart]")) resetQuiz();
  });
  renderQuiz();
}
