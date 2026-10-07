// Lecke olvasónézet: törzsanyag, ábrák, kattintható fogalmak, saját jegyzet, teljesítés, lapozás.
import { state, save, refresh, onRender, recordActivity } from "../store.js";
import { allLessons, getLesson, lessonStatus, isLessonComplete, ensureLessonProgress, toggleLessonComplete, STATUS_LABEL, LESSON_LABS } from "../lessons.js";
import { showView, getCurrentView, viewTitle, registerRoute, onViewShown, onViewLeave } from "../router.js";
import { renderDiagrams } from "../diagrams.js";
import { linkTerms } from "../features/terms.js";
import { $, setText, escapeHTML, formatInline, debounce } from "../util.js";

let activeLessonId = null;
let returnView = "tananyag";
let noteTimer = null;
let pendingNote = null;

function tableHTML(table) {
  if (!table) return "";
  return `<div class="table-wrap"><table><thead><tr>${table.head.map((cell) => `<th scope="col">${formatInline(cell)}</th>`).join("")}</tr></thead><tbody>${table.rows.map((row) => `<tr>${row.map((cell) => `<td>${formatInline(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

// Megjelenítési sorrend egy blokkon belül: bevezető, táblázat, ábra, lista, törzsszöveg.
function blockHTML(block, usedTerms) {
  const text = (value) => linkTerms(formatInline(value), usedTerms);
  const paragraphs = (texts) => (texts || []).map((value) => `<p>${text(value)}</p>`).join("");
  const list = block.list ? `<ul>${block.list.map((item) => `<li>${text(item)}</li>`).join("")}</ul>` : "";
  const diagram = block.diagram ? `<figure class="diagram" data-diagram="${block.diagram}"><div class="diagram__canvas"></div>${block.diagramCaption ? `<figcaption>${escapeHTML(block.diagramCaption)}</figcaption>` : ""}</figure>` : "";
  return paragraphs(block.intro) + tableHTML(block.table) + diagram + list + paragraphs(block.body);
}

function renderLesson() {
  const lesson = getLesson(activeLessonId);
  if (!lesson) return;
  const status = lessonStatus(lesson.id);
  const usedTerms = new Set();
  $("#lesson-content").innerHTML = `<p class="lesson-meta"><span>${lesson.week}. hét</span><span>${lesson.duration} perc</span><span class="is-${status}">${STATUS_LABEL[status]}</span></p>
    <p class="lesson-lead">${escapeHTML(lesson.summary)}</p>
    <div class="lesson-body">
      ${(lesson.sections || []).map((section) => `<h2>${escapeHTML(section.title)}</h2>${blockHTML(section, usedTerms)}`).join("")}
      ${lesson.example ? `<section class="worked"><p class="worked__label">Kidolgozott példa</p><h2>${escapeHTML(lesson.example.title)}</h2>${blockHTML(lesson.example, usedTerms)}</section>` : ""}
    </div>
    ${lesson.mistakes ? `<h2>Tipikus hibák</h2><ul class="mistakes">${lesson.mistakes.map((item) => `<li>${formatInline(item)}</li>`).join("")}</ul>` : ""}
    <h2>${lesson.sections ? "Összefoglalás" : "Kulcsgondolatok"}</h2>
    <ol class="key-points">${lesson.keyPoints.map((point) => `<li><span>${escapeHTML(point)}</span></li>`).join("")}</ol>
    ${lesson.check ? `<h2>Ellenőrizd magad</h2><div class="self-check">${lesson.check.map((item) => `<details><summary>${escapeHTML(item.q)}</summary><p>${formatInline(item.a)}</p></details>`).join("")}</div>` : ""}
    <section class="exercise"><h2>Gyakorlat</h2><p>${escapeHTML(lesson.exercise)}</p></section>
    <p class="source-tag">Forrás a saját anyagodból: ${escapeHTML(lesson.sourceTag)}</p>`;

  const index = allLessons.indexOf(lesson);
  [["#lesson-prev", allLessons[index - 1]], ["#lesson-next", allLessons[index + 1]]].forEach(([selector, target]) => {
    const button = $(selector);
    button.hidden = !target;
    if (!target) { delete button.dataset.openLesson; return; }
    button.dataset.openLesson = target.id;
    button.querySelector("span").textContent = target.title;
  });

  const lab = LESSON_LABS[lesson.id];
  const labLink = $("#lesson-lab");
  labLink.hidden = !lab;
  if (lab) { labLink.dataset.tab = `practice:${lab[0]}`; labLink.textContent = `Kipróbálom: ${lab[1]}`; }

  setText("#lesson-back-label", viewTitle(returnView));
  const complete = isLessonComplete(lesson.id);
  const button = $("#toggle-lesson-complete");
  button.textContent = complete ? "Visszajelölés folyamatbanra" : "Lecke teljesítése";
  button.classList.toggle("secondary-button", complete);
  button.classList.toggle("primary-button", !complete);
  if (getCurrentView() === "lecke") renderDiagrams($("#lesson-content"));
}

function flushNote() {
  clearTimeout(noteTimer);
  if (!pendingNote) return;
  ensureLessonProgress(pendingNote.id).note = pendingNote.value;
  pendingNote = null;
  save("Jegyzet mentve");
  setText("#lesson-note-status", "Jegyzet mentve ezen a böngészőn.");
}

export function openLesson(id, updateHash = true) {
  const lesson = getLesson(id);
  if (!lesson) return false;
  flushNote();
  if (getCurrentView() !== "lecke") returnView = getCurrentView();
  activeLessonId = id;
  const progress = ensureLessonProgress(id);
  progress.lastOpenedAt = new Date().toISOString();
  recordActivity();
  save();
  $("#lesson-note").value = progress.note || "";
  setText("#lesson-note-status", "A jegyzet automatikusan mentődik.");
  refresh();
  showView("lecke", { updateHash, title: lesson.title, eyebrow: `${lesson.globalIndex}. lecke · ${lesson.moduleTitle}`, hash: `#lecke/${lesson.id}`, nav: "tananyag" });
  return true;
}

export function initLesson() {
  registerRoute("lecke/", (id, updateHash) => openLesson(id, updateHash));
  onRender(renderLesson);
  onViewLeave(flushNote);
  onViewShown((view) => { if (view === "lecke") renderDiagrams($("#lesson-content")); });
  window.addEventListener("pagehide", flushNote);
  window.addEventListener("resize", debounce(() => { if (getCurrentView() === "lecke") renderDiagrams($("#lesson-content")); }, 150));

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-lesson]");
    if (button) openLesson(button.dataset.openLesson);
  });
  $("#lesson-back").addEventListener("click", () => showView(returnView));
  $("#toggle-lesson-complete").addEventListener("click", () => activeLessonId && toggleLessonComplete(activeLessonId));
  $("#lesson-note").addEventListener("input", (event) => {
    if (!activeLessonId) return;
    clearTimeout(noteTimer);
    pendingNote = { id: activeLessonId, value: event.target.value };
    setText("#lesson-note-status", "Mentés…");
    noteTimer = window.setTimeout(flushNote, 350);
  });
}
