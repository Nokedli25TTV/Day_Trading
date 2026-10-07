// Roadmap: a hat modul lenyitható listája szűrővel és naptári dátumokkal.
import { DATA } from "../../data.js";
import { onRender } from "../store.js";
import { allLessons, getLesson, getCompletedCount, getModuleStats, getNextLesson, ticksHTML, lessonRowHTML, weekRangeLabel } from "../lessons.js";
import { $, $$, setText, escapeHTML } from "../util.js";

let filter = "all";

function renderRoadmap() {
  const next = getNextLesson();
  const stack = $("#roadmap-stack");
  setText("#roadmap-summary-percent", `${Math.round((getCompletedCount() / allLessons.length) * 100)}%`);

  // A felhasználó által kinyitott modulok újrarajzolás után is nyitva maradnak.
  const firstRender = !stack.querySelector("details");
  const openModules = new Set($$("details[open]", stack).map((details) => details.dataset.module));
  const statusOf = (module) => {
    const stats = getModuleStats(module);
    return stats.completed === stats.total ? "completed" : module.id === next.moduleId ? "current" : "remaining";
  };

  stack.innerHTML = DATA.modules
    .filter((module) => filter === "all" || filter === (statusOf(module) === "current" ? "active" : statusOf(module)))
    .map((module) => {
      const stats = getModuleStats(module);
      const status = statusOf(module);
      const open = firstRender ? status === "current" : openModules.has(module.id);
      const badge = status === "current" ? '<span class="badge">Aktív</span>' : status === "completed" ? '<span class="badge badge--done">Kész</span>' : "";
      const weeks = module.lessons.map((lesson) => lesson.week);
      return `<article class="module ${status}">
        <details data-module="${module.id}" ${open ? "open" : ""}>
          <summary>
            <span class="module__num">${module.number}</span>
            <div><span class="module__when">${escapeHTML(module.duration)} · ${escapeHTML(module.weeks)} · ${weekRangeLabel(Math.min(...weeks), Math.max(...weeks))} ${badge}</span><h3>${escapeHTML(module.title)}</h3><p>${escapeHTML(module.description)}</p></div>
            <span class="module__progress">${ticksHTML(module)}<span>${stats.completed}/${stats.total}</span></span>
            <svg class="module__chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
          </summary>
          <div class="module__content">
            <p class="module__milestone"><strong>Mérföldkő:</strong> ${escapeHTML(module.milestone)}</p>
            <ul class="lesson-rows">${module.lessons.map((lesson) => lessonRowHTML(getLesson(lesson.id))).join("")}</ul>
          </div>
        </details>
      </article>`;
    }).join("") || '<div class="empty-state"><h3>Nincs ilyen modul</h3><p>Válassz másik állapotszűrőt.</p></div>';
}

export function initRoadmap() {
  onRender(renderRoadmap);
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-roadmap-filter]");
    if (!button) return;
    filter = button.dataset.roadmapFilter;
    $$("[data-roadmap-filter]").forEach((item) => item.classList.toggle("active", item === button));
    renderRoadmap();
  });
}
