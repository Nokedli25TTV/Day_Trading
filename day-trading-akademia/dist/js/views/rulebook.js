// Szabálykönyv: saját szabályok, ha–akkor tervek és az ellenőrzőlista pontjai. Nyomtatható egy oldalra.
import { state, commit, onRender } from "../store.js";
import { $, escapeHTML, uid } from "../util.js";

const LISTS = {
  rules: (entry) => escapeHTML(entry.text),
  ifThen: (entry) => `<strong>Ha</strong> ${escapeHTML(entry.when)}, <strong>akkor</strong> ${escapeHTML(entry.then)}.`,
  checklist: (entry) => escapeHTML(entry.text),
};

function renderRulebook() {
  Object.entries(LISTS).forEach(([name, render]) => {
    $(`#rulebook-${name}`).innerHTML = state.rulebook[name].map((entry) => `<li><span>${render(entry)}</span><button class="delete-question" type="button" data-rulebook-delete="${name}:${entry.id}" aria-label="Törlés">×</button></li>`).join("")
      || '<li class="rulebook-empty">Még üres.</li>';
  });
  renderRuleChoices([...document.querySelectorAll("#journal-rules input:checked")].map((input) => input.value));
}

// A naplóűrlap jelölőnégyzetei: melyik szabályt szegted meg ennél a kötésnél.
export function renderRuleChoices(checked = []) {
  $("#journal-rules").innerHTML = state.rulebook.rules.length
    ? `<fieldset class="rule-choices"><legend>Megszegett szabály (ha volt)</legend>${state.rulebook.rules.map((rule) => `<label class="check-row"><input type="checkbox" name="broken" value="${rule.id}" ${checked.includes(rule.id) ? "checked" : ""} /> ${escapeHTML(rule.text)}</label>`).join("")}</fieldset>`
    : "";
}

function add(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const values = Object.fromEntries([...new FormData(form).entries()].map(([key, value]) => [key, String(value).trim().slice(0, 200)]));
  if (Object.values(values).some((value) => !value)) return;
  state.rulebook[form.dataset.rulebookForm].push({ id: uid(), ...values });
  form.reset();
  commit("Szabálykönyv mentve");
}

export function initRulebook() {
  onRender(renderRulebook);
  document.querySelectorAll("[data-rulebook-form]").forEach((form) => form.addEventListener("submit", add));
  $("#rulebook-print").addEventListener("click", () => window.print());
  $("#journal-rulebook").addEventListener("click", (event) => {
    const button = event.target.closest("[data-rulebook-delete]");
    if (!button) return;
    const [name, id] = button.dataset.rulebookDelete.split(":");
    state.rulebook[name] = state.rulebook[name].filter((entry) => entry.id !== id);
    commit("Szabálykönyv mentve");
  });
}
