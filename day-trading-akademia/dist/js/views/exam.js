// Modulzáró vizsga: nyolc önellenőrző kérdés, felidézés után önértékeléssel.
import { DATA } from "../../data.js";
import { CONTENT } from "../../content/index.js";
import { state, commit, onRender, recordActivity } from "../store.js";
import { moduleQuestionPool, evaluateExam, EXAM_LENGTH, EXAM_PASS_PERCENT } from "../logic/exam.js";
import { recordMistake, setMistakeResolved } from "../logic/mistakes.js";
import { $, escapeHTML, formatInline, shuffle, uid, localDateKey, addDays, formatDate } from "../util.js";

let moduleId = DATA.modules[0]?.id;
let run = null;

const selectedModule = () => DATA.modules.find((module) => module.id === moduleId) || DATA.modules[0];
const moduleDone = (module) => module.lessons.filter((lesson) => state.progress[lesson.id]?.completed).length;
const lastAttempt = (id) => [...state.moduleExams].reverse().find((attempt) => attempt?.moduleId === id);

function updateBadge() {
  const passed = new Set(state.moduleExams.filter((attempt) => attempt?.passed).map((attempt) => attempt.moduleId)).size;
  const count = $("#exam-count");
  count.hidden = passed === 0;
  count.textContent = `${passed}/${DATA.modules.length}`;
}

function landingHTML(module) {
  const done = moduleDone(module);
  const official = done === module.lessons.length;
  const latest = lastAttempt(module.id);
  const result = latest
    ? `<p class="exam-latest"><strong>Legutóbbi:</strong> ${latest.percent}% · ${latest.passed ? "sikeres modulzáró" : latest.official ? "még nem sikerült" : "próbakör"} · ${formatDate(latest.completedAt)}</p>`
    : "";
  return `<div class="exam-intro">
    <p class="eyebrow">${escapeHTML(module.number)}. modul</p>
    <h2>${escapeHTML(module.title)}</h2>
    <p>Nyolc, véletlenszerűen választott kérdés. Előbb idézd fel a választ, csak utána fedd fel és értékeld magad.</p>
    <div class="exam-readiness"><span>${done} / ${module.lessons.length} lecke kész</span><span>${EXAM_PASS_PERCENT}% kell a sikerhez</span></div>
    ${result}
    <button class="primary-button" type="button" data-exam-start>${official ? "Modulzáró indítása" : "Próbakör indítása"}</button>
    ${official ? "" : `<p class="fine-print">A modul leckéi még nem teljesek, ezért az eredmény próbakörként mentődik.</p>`}
  </div>`;
}

function questionHTML(card) {
  const progress = (run.index + Number(run.revealed)) / run.cards.length;
  return `<div class="exam-topline"><span>${run.index + 1} / ${run.cards.length}</span><div class="meter"><span style="transform:scaleX(${progress})"></span></div><span>${run.score} pont</span></div>
    <article class="exam-question">
      <p class="review-card__source">${escapeHTML(card.lessonTitle)}</p>
      <h2>${escapeHTML(card.question)}</h2>
      ${run.revealed
        ? `<div class="review-card__answer">${formatInline(card.answer)}</div><div class="review-actions"><button class="secondary-button" type="button" data-exam-grade="wrong">Nem ment</button><button class="primary-button" type="button" data-exam-grade="right">Megvolt</button><button class="text-button" type="button" data-open-lesson="${card.lessonId}">Lecke megnyitása</button></div>`
        : '<div class="review-actions"><button class="primary-button" type="button" data-exam-reveal>Válasz mutatása</button></div>'}
    </article>`;
}

function resultHTML() {
  const { score, total, percent, official, passed } = run.result;
  const title = passed ? "Sikeres modulzáró" : official ? "Még egy célzott kör kell" : "Próbakör kész";
  const detail = official ? (passed ? "A modul lezárva. A hibafüzetben továbbra is visszanézheted a bizonytalan pontokat." : "Nézd át a hibafüzetet és az érintett leckéket, majd próbáld újra.") : "A teljes modul elvégzése után ugyanitt tehetsz érvényes modulzárót.";
  return `<div class="quiz-result"><p class="quiz-result__count">${score} / ${total} felidézett válasz</p><h2><span class="quiz-result__score">${percent}%</span> · ${title}</h2><p>${detail}</p><button class="primary-button" type="button" data-exam-restart>Vissza a modulokhoz</button></div>`;
}

function render() {
  updateBadge();
  $("#exam-module").value = moduleId;
  $("#exam-module").disabled = Boolean(run && !run.result);
  const content = $("#exam-content");
  if (!run) content.innerHTML = landingHTML(selectedModule());
  else if (run.result) content.innerHTML = resultHTML();
  else content.innerHTML = questionHTML(run.cards[run.index]);
}

function start() {
  const module = selectedModule();
  const cards = shuffle(moduleQuestionPool(module, CONTENT)).slice(0, EXAM_LENGTH);
  run = { moduleId: module.id, cards, index: 0, score: 0, answers: [], revealed: false, official: moduleDone(module) === module.lessons.length, startedAt: new Date().toISOString(), result: null };
  render();
}

function grade(correct) {
  const card = run?.cards[run.index];
  if (!card || !run.revealed) return;
  run.answers.push({ id: card.id, lesson: card.lessonId, correct });
  if (correct) {
    run.score += 1;
    if (state.mistakes[card.id] && !state.mistakes[card.id].resolvedAt) state.mistakes = setMistakeResolved(state.mistakes, card.id, true);
  } else {
    state.reviews[card.id] = { box: 0, due: addDays(localDateKey(), 1) };
    state.mistakes = recordMistake(state.mistakes, {
      id: card.id,
      source: "exam",
      question: card.question,
      lesson: card.lessonId,
      selectedAnswer: "Nem tudtam önállóan felidézni.",
      correctAnswer: card.answer,
      explanation: "A válasz bekerült az időzített ismétlésbe is.",
    });
  }
  run.index += 1;
  run.revealed = false;
  recordActivity();
  if (run.index >= run.cards.length) {
    run.result = evaluateExam(run.answers, run.official);
    state.moduleExams.push({ id: uid(), moduleId: run.moduleId, ...run.result, startedAt: run.startedAt, completedAt: new Date().toISOString() });
  }
  commit(run.result ? "Modulvizsga mentve" : "Vizsgaválasz mentve");
}

export function resetExam() {
  run = null;
  moduleId = DATA.modules.find((module) => !state.moduleExams.some((attempt) => attempt?.moduleId === module.id && attempt.passed))?.id || DATA.modules[0]?.id;
  render();
}

export function initExam() {
  $("#exam-module").innerHTML = DATA.modules.map((module) => `<option value="${module.id}">${module.number}. ${escapeHTML(module.shortTitle)}</option>`).join("");
  $("#exam-module").addEventListener("change", (event) => { moduleId = event.target.value; run = null; render(); });
  $("#exam-content").addEventListener("click", (event) => {
    if (event.target.closest("[data-exam-start]")) start();
    else if (event.target.closest("[data-exam-reveal]")) { run.revealed = true; render(); }
    else if (event.target.closest("[data-exam-grade]")) grade(event.target.closest("[data-exam-grade]").dataset.examGrade === "right");
    else if (event.target.closest("[data-exam-restart]")) { run = null; render(); }
  });
  onRender(render);
  resetExam();
}
