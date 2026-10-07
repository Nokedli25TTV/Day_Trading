// Tananyag: kereshető leckelista modulonként, forráslista és fogalomtár.
import { DATA } from "../../data.js";
import { GLOSSARY } from "../../content/fogalomtar.js";
import { onRender } from "../store.js";
import { allLessons, getLesson, getModuleStats, isLessonComplete, lessonRowHTML, lessonText } from "../lessons.js";
import { $, setText, escapeHTML } from "../util.js";

const lower = (text) => String(text).trim().toLocaleLowerCase("hu-HU");

function renderLessons() {
  const moduleSelect = $("#lesson-module-filter");
  if (moduleSelect.options.length === 1) {
    DATA.modules.forEach((module) => moduleSelect.add(new Option(`${module.number} · ${module.shortTitle}`, module.id)));
  }
  const search = lower($("#lesson-search").value);
  const moduleFilter = moduleSelect.value;
  const statusFilter = $("#lesson-status-filter").value;
  const filtered = allLessons.filter((lesson) => (!search || lessonText(lesson).includes(search))
    && (moduleFilter === "all" || lesson.moduleId === moduleFilter)
    && (statusFilter === "all" || (statusFilter === "completed") === isLessonComplete(lesson.id)));

  $("#lesson-grid").innerHTML = DATA.modules.map((module) => {
    const lessons = filtered.filter((lesson) => lesson.moduleId === module.id);
    if (!lessons.length) return "";
    const stats = getModuleStats(module);
    return `<section class="lesson-group">
      <header class="lesson-group__head"><span>${module.number}</span><h3>${escapeHTML(module.title)}</h3><small>${stats.completed}/${stats.total} kész</small></header>
      <ul class="lesson-rows">${lessons.map((lesson) => lessonRowHTML(lesson, true)).join("")}</ul>
    </section>`;
  }).join("");
  $("#lesson-empty").hidden = filtered.length > 0;
}

function renderSources() {
  const container = $("#source-grid");
  if (container.dataset.rendered) return;
  container.innerHTML = DATA.sources.map((source) => `<a class="source-card" href="${source.url}" target="_blank" rel="noreferrer"><strong>${escapeHTML(source.title)}</strong><span>${escapeHTML(source.tag)}</span><p>${escapeHTML(source.note)}</p></a>`).join("");
  container.dataset.rendered = "true";
}

function renderGlossary() {
  const search = lower($("#glossary-search").value);
  const terms = GLOSSARY.filter(([term, definition]) => !search || lower(`${term} ${definition}`).includes(search));
  $("#glossary-list").innerHTML = terms.map(([term, definition, lessonId]) => {
    const lesson = getLesson(lessonId);
    return `<div><dt>${escapeHTML(term)}</dt><dd>${escapeHTML(definition)}</dd>${lesson ? `<button class="text-button" type="button" data-open-lesson="${lesson.id}" title="${escapeHTML(lesson.title)}">${lesson.globalIndex}. lecke</button>` : "<span></span>"}</div>`;
  }).join("");
  setText("#glossary-count", search ? `${terms.length} találat` : `${GLOSSARY.length} fogalom`);
  $("#glossary-empty").hidden = terms.length > 0;
}

export function initLibrary() {
  onRender(renderLessons);
  onRender(renderSources);
  onRender(renderGlossary);
  $("#lesson-search").addEventListener("input", renderLessons);
  $("#lesson-module-filter").addEventListener("change", renderLessons);
  $("#lesson-status-filter").addEventListener("change", renderLessons);
  $("#glossary-search").addEventListener("input", renderGlossary);
  $("#clear-lesson-filters").addEventListener("click", () => {
    $("#lesson-search").value = "";
    $("#lesson-module-filter").value = "all";
    $("#lesson-status-filter").value = "all";
    renderLessons();
  });
}
