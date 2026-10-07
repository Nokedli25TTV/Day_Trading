// Megbeszélendő kérdések: rövid lista a Napló alján, másolható a vágólapra.
import { state, commit, onRender } from "../store.js";
import { showToast } from "../toast.js";
import { $, escapeHTML, uid } from "../util.js";

function renderQuestions() {
  $("#question-empty").hidden = state.questions.length > 0;
  $("#question-list").innerHTML = state.questions.map((question, index) => `<li><span>${index + 1}.</span><p>${escapeHTML(question.text)}</p><button class="delete-question" type="button" data-delete-question="${question.id}" aria-label="Kérdés törlése">×</button></li>`).join("");
}

async function copyQuestions() {
  if (!state.questions.length) { showToast("Még nincs másolható kérdés."); return; }
  const text = `Megbeszélendő day trading kérdések:\n${state.questions.map((question, index) => `${index + 1}. ${question.text}`).join("\n")}`;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = Object.assign(document.createElement("textarea"), { value: text });
    document.body.append(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
  showToast("A kérdéslista a vágólapra került.");
}

export function initQuestions() {
  onRender(renderQuestions);
  $("#copy-questions").addEventListener("click", copyQuestions);
  $("#question-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const text = event.currentTarget.elements.question.value.trim();
    if (!text) return;
    state.questions.push({ id: uid(), text: text.slice(0, 240), createdAt: new Date().toISOString() });
    event.currentTarget.reset();
    commit("Kérdés mentve");
    showToast("A kérdés bekerült a listába.");
  });
  $("#question-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-question]");
    if (!button) return;
    state.questions = state.questions.filter((question) => question.id !== button.dataset.deleteQuestion);
    commit("Kérdés törölve");
  });
}
