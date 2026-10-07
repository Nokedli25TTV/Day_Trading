(() => {
  "use strict";

  const DATA = window.TRADECRAFT_DATA;
  const STORAGE_KEY = new URLSearchParams(location.search).has("qa")
    ? "tradecraft-academy-qa-v1"
    : "tradecraft-academy-v1";
  const CONTENT = window.TRADECRAFT_CONTENT || {};
  const GLOSSARY = window.TRADECRAFT_GLOSSARY || [];
  const QUIZ_LENGTH = Math.min(12, DATA.quiz.length);
  const allLessons = DATA.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      ...lesson,
      ...(CONTENT[lesson.id] || {}),
      moduleId: module.id,
      moduleNumber: module.number,
      moduleTitle: module.title,
    })),
  );
  allLessons.forEach((lesson, index) => { lesson.globalIndex = index + 1; });
  const CALC = window.TRADECRAFT_CALC;
  const CHARTS = window.TRADECRAFT_CHARTS;
  const TOTAL_WEEKS = Math.max(...allLessons.map((lesson) => lesson.week));
  // Ismétlési időközök napban, dobozonként: a tudott kártya egyre ritkábban jön vissza.
  const REVIEW_INTERVALS = [1, 2, 4, 8, 16, 32];
  const STUDY_TICK_SECONDS = 15;
  const IDLE_LIMIT_MS = 120000;

  const todayLabel = (() => {
    const label = new Intl.DateTimeFormat("hu-HU", { month: "long", day: "numeric", weekday: "long" }).format(new Date());
    return label.charAt(0).toLocaleUpperCase("hu-HU") + label.slice(1);
  })();

  const viewMeta = {
    attekintes: { title: "Áttekintés", subtitle: todayLabel },
    roadmap: { title: "Roadmap", subtitle: `24 hét, ${DATA.modules.length} mérföldkő, ${allLessons.length} lecke` },
    tananyag: { title: "Tananyag", subtitle: `${allLessons.length} lecke és ${GLOSSARY.length} fogalom a saját jegyzeteidből` },
    lecke: { title: "Lecke", subtitle: "" },
    gyakorlas: { title: "Gyakorlás", subtitle: "Kvíz és kalkulátorok" },
    naplo: { title: "Napló", subtitle: "A folyamat számít, nem az eredmény" },
  };

  const STATUS_LABEL = { done: "Kész", progress: "Folyamatban", new: "Új" };

  const createDefaultState = () => ({
    schemaVersion: 1,
    profile: {
      experience: "kezdo",
      dailyGoal: 30,
      startDate: localDateKey(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    progress: {},
    quizAttempts: [],
    journalEntries: [],
    questions: [],
    activityDates: [],
    reviews: {},
    studyLog: {},
    settings: { reducedMotion: false, theme: "system" },
  });

  let storageRecovered = false;
  let state = loadState();
  let activeLessonId = null;
  let currentView = "attekintes";
  let lessonReturnView = "tananyag";
  let roadmapFilter = "all";
  let noteTimer = null;
  let pendingNote = null;
  let quizRun = createQuizRun();
  let journalTab = "entries";
  let journalLimit = 12;
  let statsMode = "all";
  let reviewSession = null;
  let lastInteraction = Date.now();

  // Régi vagy importált mentés kiegészítése a hiányzó mezőkkel.
  function normalizeState(parsed) {
    const fallback = createDefaultState();
    const object = (value) => (value && typeof value === "object" && !Array.isArray(value) ? value : {});
    const profile = { ...fallback.profile, ...object(parsed.profile) };
    // Régi mentésnél a terv kezdete a profil létrehozásának napja.
    if (!object(parsed.profile).startDate) {
      const created = new Date(profile.createdAt);
      profile.startDate = localDateKey(Number.isNaN(created.getTime()) ? new Date() : created);
    }
    return {
      ...fallback,
      ...parsed,
      schemaVersion: 1,
      profile,
      settings: { ...fallback.settings, ...object(parsed.settings) },
      progress: object(parsed.progress),
      quizAttempts: Array.isArray(parsed.quizAttempts) ? parsed.quizAttempts : [],
      journalEntries: Array.isArray(parsed.journalEntries) ? parsed.journalEntries : [],
      questions: Array.isArray(parsed.questions) ? parsed.questions : [],
      activityDates: Array.isArray(parsed.activityDates) ? parsed.activityDates : [],
      reviews: object(parsed.reviews),
      studyLog: object(parsed.studyLog),
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createDefaultState();
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") throw new Error("Invalid state");
      return normalizeState(parsed);
    } catch {
      storageRecovered = true;
      return createDefaultState();
    }
  }

  function saveState(message = "Helyben mentve") {
    const indicator = document.querySelector("#save-state");
    try {
      state.profile.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      if (indicator) {
        indicator.classList.remove("error");
        indicator.innerHTML = `<span aria-hidden="true"></span> ${escapeHTML(message)}`;
      }
      return true;
    } catch {
      if (indicator) {
        indicator.classList.add("error");
        indicator.innerHTML = '<span aria-hidden="true"></span> A mentés sikertelen';
      }
      showToast("A böngésző nem tudta menteni az adatokat. Exportáld őket biztonsági másolatként.", true);
      return false;
    }
  }

  function uid() {
    return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function localDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function addDays(dateKey, days) {
    const date = new Date(`${dateKey}T12:00:00`);
    date.setDate(date.getDate() + days);
    return localDateKey(date);
  }

  function daysBetween(fromKey, toKey) {
    return Math.round((new Date(`${toKey}T12:00:00`) - new Date(`${fromKey}T12:00:00`)) / 86400000);
  }

  // Az időbélyegek UTC-ben tárolódnak, a „ma” viszont helyi nap.
  function isToday(timestamp) {
    return Boolean(timestamp) && localDateKey(new Date(timestamp)) === localDateKey();
  }

  function shortDate(dateKey) {
    return new Intl.DateTimeFormat("hu-HU", { month: "short", day: "numeric" }).format(new Date(`${dateKey}T12:00:00`));
  }

  function signedR(value, digits = 2) {
    return `${value > 0 ? "+" : value < 0 ? "−" : ""}${formatNumber(Math.abs(value), digits)}R`;
  }

  function recordActivity() {
    const today = localDateKey();
    if (!state.activityDates.includes(today)) state.activityDates.push(today);
  }

  function getStreak() {
    const dates = new Set(state.activityDates);
    if (!dates.size) return 0;
    let cursor = new Date();
    if (!dates.has(localDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    let streak = 0;
    while (dates.has(localDateKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
    })[character]);
  }

  // A tartalomban a **kiemelés** az egyetlen megengedett jelölés.
  function formatInline(value) {
    return escapeHTML(value).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }

  function tableHTML(table) {
    if (!table) return "";
    return `<div class="table-wrap"><table><thead><tr>${table.head.map((cell) => `<th scope="col">${formatInline(cell)}</th>`).join("")}</tr></thead><tbody>${table.rows.map((row) => `<tr>${row.map((cell) => `<td>${formatInline(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }

  function blockHTML(block) {
    const paragraphs = (texts) => (texts || []).map((text) => `<p>${formatInline(text)}</p>`).join("");
    const list = block.list ? `<ul>${block.list.map((item) => `<li>${formatInline(item)}</li>`).join("")}</ul>` : "";
    return paragraphs(block.intro) + tableHTML(block.table) + list + paragraphs(block.body);
  }

  function lessonText(lesson) {
    const blocks = [...(lesson.sections || []), lesson.example || {}];
    return [
      lesson.title, lesson.summary, lesson.moduleTitle, ...lesson.keyPoints, ...(lesson.mistakes || []),
      ...blocks.flatMap((block) => [block.title || "", ...(block.intro || []), ...(block.body || []), ...(block.list || [])]),
    ].join(" ").toLocaleLowerCase("hu-HU");
  }

  function shuffle(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [result[index], result[swap]] = [result[swap], result[index]];
    }
    return result;
  }

  function formatNumber(value, maximumFractionDigits = 2) {
    return new Intl.NumberFormat("hu-HU", { maximumFractionDigits }).format(value);
  }

  function formatDate(value) {
    if (!value) return "–";
    const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
    return new Intl.DateTimeFormat("hu-HU", { year: "numeric", month: "short", day: "numeric" }).format(date);
  }

  function getLesson(id) {
    return allLessons.find((lesson) => lesson.id === id);
  }

  function ensureLessonProgress(id) {
    if (!state.progress[id]) {
      state.progress[id] = { status: "in_progress", completed: false, note: "", lastOpenedAt: new Date().toISOString(), completedAt: null };
    }
    return state.progress[id];
  }

  function isLessonComplete(id) {
    return Boolean(state.progress[id]?.completed);
  }

  function lessonStatus(id) {
    return isLessonComplete(id) ? "done" : state.progress[id] ? "progress" : "new";
  }

  function getCompletedCount() {
    return allLessons.filter((lesson) => isLessonComplete(lesson.id)).length;
  }

  function getModuleStats(module) {
    const completed = module.lessons.filter((lesson) => isLessonComplete(lesson.id)).length;
    return { completed, total: module.lessons.length, percent: Math.round((completed / module.lessons.length) * 100) };
  }

  function getNextLesson() {
    return allLessons.find((lesson) => !isLessonComplete(lesson.id)) || allLessons[allLessons.length - 1];
  }

  function getBestQuiz() {
    if (!state.quizAttempts.length) return null;
    return Math.max(...state.quizAttempts.map((attempt) => Number(attempt.percent) || 0));
  }

  function setMeter(selector, ratio) {
    const bar = document.querySelector(selector);
    if (bar) bar.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
  }

  function ticksHTML(module) {
    return `<span class="ticks" aria-hidden="true">${module.lessons.map((lesson) => `<i class="${isLessonComplete(lesson.id) ? "on" : ""}"></i>`).join("")}</span>`;
  }

  function lessonRowHTML(lesson, detailed = false) {
    const status = lessonStatus(lesson.id);
    const schedule = getSchedule();
    const thisWeek = schedule.started && schedule.week === lesson.week;
    return `<li><button class="lesson-row${detailed ? " lesson-row--detailed" : ""} is-${status}${thisWeek ? " is-this-week" : ""}" type="button" data-open-lesson="${lesson.id}">
      <span class="lesson-row__state" aria-hidden="true"></span>
      <span class="lesson-row__text"><strong>${escapeHTML(lesson.title)}</strong>${detailed ? `<span>${escapeHTML(lesson.summary)}</span>` : ""}</span>
      <span class="lesson-row__meta lesson-row__week">${thisWeek ? "Ez a hét" : `${lesson.week}. hét`}</span>
      <span class="lesson-row__meta">${lesson.duration} perc</span>
      <span class="lesson-row__status">${STATUS_LABEL[status]}</span>
    </button></li>`;
  }

  function renderAll() {
    renderOverview();
    renderRoadmap();
    renderLessons();
    renderLesson();
    renderJournal();
    renderQuestions();
    renderSources();
    renderGlossary();
    renderReview();
    applySettings();
  }

  function renderOverview() {
    const completed = getCompletedCount();
    const percent = Math.round((completed / allLessons.length) * 100);
    const next = getNextLesson();
    const allDone = completed === allLessons.length;
    const currentModule = DATA.modules.find((module) => module.id === next.moduleId) || DATA.modules[0];
    const moduleStats = getModuleStats(currentModule);
    const bestQuiz = getBestQuiz();

    setText("#focus-module", allDone ? "Minden lecke kész · ismétlés" : `Következő lecke · ${next.moduleNumber} ${next.moduleTitle}`);
    setText("#focus-title", next.title);
    setText("#focus-description", next.summary);
    document.querySelector("#focus-meta").innerHTML = `<span>${next.week}. hét</span><span>${next.duration} perc</span><span>${moduleStats.completed}/${moduleStats.total} kész a modulból</span>`;
    const continueButton = document.querySelector("#continue-button");
    continueButton.dataset.openLesson = next.id;
    continueButton.textContent = allDone ? "Lecke átismétlése" : state.progress[next.id] ? "Tanulás folytatása" : "Lecke megkezdése";

    setText("#overall-count", `${completed} / ${allLessons.length}`);
    setText("#sidebar-progress-copy", `${completed} / ${allLessons.length} lecke · ${percent}%`);
    setMeter("#sidebar-progress-bar", completed / allLessons.length);
    setText("#stat-streak", String(getStreak()));
    setText("#stat-quiz", bestQuiz === null ? "–" : `${bestQuiz}%`);
    setText("#stat-journal", String(state.journalEntries.length));
    setText("#stat-questions", String(state.questions.length));
    renderStudyTime();
    renderWeek();
    setText("#stat-rules", state.journalEntries.length ? `${formatNumber(CALC.journalStats(state.journalEntries).ruleRate, 0)}%` : "–");

    document.querySelector("#overview-roadmap").innerHTML = DATA.modules.map((module) => {
      const stats = getModuleStats(module);
      const status = stats.completed === stats.total ? "completed" : module.id === currentModule.id ? "current" : "";
      return `<li class="track ${status}">${ticksHTML(module)}<span class="track__num">${module.number}</span><strong>${escapeHTML(module.shortTitle)}</strong><small>${stats.completed}/${stats.total} lecke</small></li>`;
    }).join("");

    const today = localDateKey();
    const dueCount = reviewCards().filter((card) => card.due <= today).length;
    const reviewedToday = Object.values(state.reviews).some((review) => review.seen === today);
    setText("#stat-due", String(dueCount));
    const quizDoneToday = state.quizAttempts.some((attempt) => isToday(attempt.completedAt));
    const journalDoneToday = state.journalEntries.some((entry) => isToday(entry.createdAt));
    document.querySelector("#daily-steps").innerHTML = [
      { title: next.title, detail: `${next.duration} perc · ${next.moduleTitle}`, done: isLessonComplete(next.id), action: "Lecke", attr: `data-open-lesson="${next.id}"` },
      ...(dueCount || reviewedToday ? [{ title: dueCount ? `${dueCount} kártya ismétlése` : "Ismétlés", detail: "Önellenőrző kérdések és korábbi hibás válaszok", done: !dueCount, action: "Ismétlés", attr: 'data-view-target="gyakorlas" data-practice-open="review"' }] : []),
      { title: "3–5 kvízkérdés", detail: "Aktív felidézés, azonnali magyarázattal", done: quizDoneToday, action: "Kvíz", attr: 'data-view-target="gyakorlas" data-practice-open="quiz"' },
      { title: "Egy mondatos review", detail: "Mit értettél meg, mi maradt kérdés?", done: journalDoneToday, action: "Napló", attr: 'data-view-target="naplo"' },
    ].map((item, index) => `<li class="step${item.done ? " done" : ""}"><span class="step__mark" aria-hidden="true">${item.done ? "✓" : index + 1}</span><div><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.detail)}${item.done ? " · ma kész" : ""}</small></div><button class="text-button" type="button" ${item.attr}>${item.action}</button></li>`).join("");
  }

  function renderRoadmap() {
    const completed = getCompletedCount();
    const percent = Math.round((completed / allLessons.length) * 100);
    const next = getNextLesson();
    const stack = document.querySelector("#roadmap-stack");
    setText("#roadmap-summary-percent", `${percent}%`);

    // A felhasználó által kinyitott modulok újrarajzolás után is nyitva maradnak.
    const firstRender = !stack.querySelector("details");
    const openModules = new Set([...stack.querySelectorAll("details[open]")].map((details) => details.dataset.module));

    const modules = DATA.modules.filter((module) => {
      const stats = getModuleStats(module);
      const status = stats.completed === stats.total ? "completed" : module.id === next.moduleId ? "active" : "remaining";
      return roadmapFilter === "all" || roadmapFilter === status;
    });

    stack.innerHTML = modules.map((module) => {
      const stats = getModuleStats(module);
      const status = stats.completed === stats.total ? "completed" : module.id === next.moduleId ? "current" : "remaining";
      const open = firstRender ? status === "current" : openModules.has(module.id);
      const badge = status === "current" ? '<span class="badge">Aktív</span>' : status === "completed" ? '<span class="badge badge--done">Kész</span>' : "";
      return `<article class="module ${status}">
        <details data-module="${module.id}" ${open ? "open" : ""}>
          <summary>
            <span class="module__num">${module.number}</span>
            <div><span class="module__when">${escapeHTML(module.duration)} · ${escapeHTML(module.weeks)} · ${weekRangeLabel(getSchedule().start, Math.min(...module.lessons.map((lesson) => lesson.week)), Math.max(...module.lessons.map((lesson) => lesson.week)))} ${badge}</span><h3>${escapeHTML(module.title)}</h3><p>${escapeHTML(module.description)}</p></div>
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

  function renderLessons() {
    const moduleSelect = document.querySelector("#lesson-module-filter");
    if (moduleSelect && moduleSelect.options.length === 1) {
      DATA.modules.forEach((module) => moduleSelect.add(new Option(`${module.number} · ${module.shortTitle}`, module.id)));
    }
    const search = document.querySelector("#lesson-search")?.value.trim().toLocaleLowerCase("hu-HU") || "";
    const moduleFilter = moduleSelect?.value || "all";
    const statusFilter = document.querySelector("#lesson-status-filter")?.value || "all";
    const filtered = allLessons.filter((lesson) => {
      const searchMatch = !search || lessonText(lesson).includes(search);
      const moduleMatch = moduleFilter === "all" || lesson.moduleId === moduleFilter;
      const statusMatch = statusFilter === "all" || (statusFilter === "completed" ? isLessonComplete(lesson.id) : !isLessonComplete(lesson.id));
      return searchMatch && moduleMatch && statusMatch;
    });

    document.querySelector("#lesson-grid").innerHTML = DATA.modules.map((module) => {
      const lessons = filtered.filter((lesson) => lesson.moduleId === module.id);
      if (!lessons.length) return "";
      const stats = getModuleStats(module);
      return `<section class="lesson-group">
        <header class="lesson-group__head"><span>${module.number}</span><h3>${escapeHTML(module.title)}</h3><small>${stats.completed}/${stats.total} kész</small></header>
        <ul class="lesson-rows">${lessons.map((lesson) => lessonRowHTML(lesson, true)).join("")}</ul>
      </section>`;
    }).join("");
    document.querySelector("#lesson-empty").hidden = filtered.length > 0;
  }

  function renderSources() {
    const container = document.querySelector("#source-grid");
    if (!container || container.dataset.rendered) return;
    container.innerHTML = DATA.sources.map((source) => `<a class="source-card" href="${source.url}" target="_blank" rel="noreferrer"><strong>${escapeHTML(source.title)}</strong><span>${escapeHTML(source.tag)}</span><p>${escapeHTML(source.note)}</p></a>`).join("");
    container.dataset.rendered = "true";
  }

  function renderGlossary() {
    const list = document.querySelector("#glossary-list");
    if (!list) return;
    const search = document.querySelector("#glossary-search")?.value.trim().toLocaleLowerCase("hu-HU") || "";
    const terms = GLOSSARY.filter(([term, definition]) => !search || `${term} ${definition}`.toLocaleLowerCase("hu-HU").includes(search));
    list.innerHTML = terms.map(([term, definition, lessonId]) => {
      const lesson = getLesson(lessonId);
      return `<div><dt>${escapeHTML(term)}</dt><dd>${escapeHTML(definition)}</dd>${lesson ? `<button class="text-button" type="button" data-open-lesson="${lesson.id}" title="${escapeHTML(lesson.title)}">${lesson.globalIndex}. lecke</button>` : "<span></span>"}</div>`;
    }).join("");
    setText("#glossary-count", search ? `${terms.length} találat` : `${GLOSSARY.length} fogalom`);
    document.querySelector("#glossary-empty").hidden = terms.length > 0;
  }

  function setLibraryTab(tab) {
    document.querySelectorAll("[data-library-tab]").forEach((button) => {
      const active = button.dataset.libraryTab === tab;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll("[data-library-panel]").forEach((panel) => { panel.hidden = panel.dataset.libraryPanel !== tab; });
  }

  function renderJournal() {
    const list = document.querySelector("#journal-list");
    const entries = [...state.journalEntries].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    setText("#journal-count", `${entries.length} db`);
    document.querySelector("#journal-empty").hidden = entries.length > 0;
    document.querySelector("#journal-more").hidden = entries.length <= journalLimit;
    const detail = (label, value) => (value ? `<p class="journal-entry__detail"><strong>${label}:</strong> ${escapeHTML(value)}</p>` : "");
    const excursion = (label, value) => (value !== "" && value != null && Number.isFinite(Number(value)) ? `<span>${label} ${formatNumber(Number(value))}R</span>` : "");
    list.innerHTML = entries.slice(0, journalLimit).map((entry) => {
      const hasResult = entry.resultR !== "" && entry.resultR != null && Number.isFinite(Number(entry.resultR));
      const result = Number(entry.resultR);
      const resultClass = !hasResult || result === 0 ? "" : result > 0 ? "is-good" : "is-bad";
      return `<article class="journal-entry">
        <div class="journal-entry__top"><div><strong>${escapeHTML(entry.symbol)} · ${escapeHTML(directionLabel(entry.direction))}</strong><small>${formatDate(entry.tradedAt)} · ${escapeHTML(modeLabel(entry.mode))}</small></div><button class="delete-entry" type="button" data-delete-entry="${entry.id}" aria-label="Bejegyzés törlése">×</button></div>
        <div class="journal-entry__badges"><span class="${resultClass}">${hasResult ? signedR(result) : "R: –"}</span><span>${escapeHTML(entry.setup)}</span><span>Szabály: ${escapeHTML(ruleLabel(entry.ruleFollowed))}</span><span>${escapeHTML(emotionLabel(entry.emotion))}</span>${excursion("MAE", entry.mae)}${excursion("MFE", entry.mfe)}</div>
        ${detail("Megfigyelés", entry.observation)}${detail("Hipotézis", entry.hypothesis)}${detail("Érvénytelenítés", entry.invalidation)}
        <p>${escapeHTML(entry.lesson)}</p>
      </article>`;
    }).join("");
    if (journalTab === "stats") renderStats();
  }

  function renderQuestions() {
    const list = document.querySelector("#question-list");
    document.querySelector("#question-empty").hidden = state.questions.length > 0;
    list.innerHTML = state.questions.map((question, index) => `<li><span>${index + 1}.</span><p>${escapeHTML(question.text)}</p><button class="delete-question" type="button" data-delete-question="${question.id}" aria-label="Kérdés törlése">×</button></li>`).join("");
  }

  function renderLesson() {
    const lesson = getLesson(activeLessonId);
    if (!lesson) return;
    const status = lessonStatus(lesson.id);
    document.querySelector("#lesson-content").innerHTML = `<p class="lesson-meta"><span>${lesson.week}. hét</span><span>${lesson.duration} perc</span><span class="is-${status}">${STATUS_LABEL[status]}</span></p>
      <p class="lesson-lead">${escapeHTML(lesson.summary)}</p>
      <div class="lesson-body">
        ${(lesson.sections || []).map((section) => `<h2>${escapeHTML(section.title)}</h2>${blockHTML(section)}`).join("")}
        ${lesson.example ? `<section class="worked"><p class="worked__label">Kidolgozott példa</p><h2>${escapeHTML(lesson.example.title)}</h2>${blockHTML(lesson.example)}</section>` : ""}
      </div>
      ${lesson.mistakes ? `<h2>Tipikus hibák</h2><ul class="mistakes">${lesson.mistakes.map((item) => `<li>${formatInline(item)}</li>`).join("")}</ul>` : ""}
      <h2>${lesson.sections ? "Összefoglalás" : "Kulcsgondolatok"}</h2>
      <ol class="key-points">${lesson.keyPoints.map((point) => `<li><span>${escapeHTML(point)}</span></li>`).join("")}</ol>
      ${lesson.check ? `<h2>Ellenőrizd magad</h2><div class="self-check">${lesson.check.map((item) => `<details><summary>${escapeHTML(item.q)}</summary><p>${formatInline(item.a)}</p></details>`).join("")}</div>` : ""}
      <section class="exercise"><h2>Gyakorlat</h2><p>${escapeHTML(lesson.exercise)}</p></section>
      <p class="source-tag">Forrás a saját anyagodból: ${escapeHTML(lesson.sourceTag)}</p>`;

    const index = allLessons.indexOf(lesson);
    [["#lesson-prev", allLessons[index - 1]], ["#lesson-next", allLessons[index + 1]]].forEach(([selector, target]) => {
      const button = document.querySelector(selector);
      button.hidden = !target;
      if (!target) return delete button.dataset.openLesson;
      button.dataset.openLesson = target.id;
      button.querySelector("span").textContent = target.title;
    });

    setText("#lesson-back-label", viewMeta[lessonReturnView].title);
    updateLessonCompleteButton();
  }

  function openLesson(id, updateHash = true) {
    const lesson = getLesson(id);
    if (!lesson) return;
    flushNote();
    if (currentView !== "lecke") lessonReturnView = currentView;
    activeLessonId = id;
    const progress = ensureLessonProgress(id);
    progress.lastOpenedAt = new Date().toISOString();
    recordActivity();
    saveState();
    document.querySelector("#lesson-note").value = progress.note || "";
    setText("#lesson-note-status", "A jegyzet automatikusan mentődik.");
    renderAll();
    showView("lecke", updateHash);
  }

  function updateLessonCompleteButton() {
    const button = document.querySelector("#toggle-lesson-complete");
    if (!activeLessonId || !button) return;
    const complete = isLessonComplete(activeLessonId);
    button.textContent = complete ? "Visszajelölés folyamatbanra" : "Lecke teljesítése";
    button.classList.toggle("secondary-button", complete);
    button.classList.toggle("primary-button", !complete);
  }

  function toggleLessonComplete(id, explicitValue) {
    const lesson = getLesson(id);
    if (!lesson) throw new Error("Ismeretlen leckeazonosító.");
    const progress = ensureLessonProgress(id);
    const complete = typeof explicitValue === "boolean" ? explicitValue : !progress.completed;
    progress.completed = complete;
    progress.status = complete ? "completed" : "in_progress";
    progress.completedAt = complete ? new Date().toISOString() : null;
    progress.lastOpenedAt = new Date().toISOString();
    recordActivity();
    saveState(complete ? "Lecke teljesítve" : "Állapot frissítve");
    renderAll();
    showToast(complete ? `Kész: ${lesson.title}` : `Újratanulásra jelölve: ${lesson.title}`);
    return { lessonId: id, completed: complete, completedLessons: getCompletedCount(), totalLessons: allLessons.length };
  }

  function flushNote() {
    clearTimeout(noteTimer);
    if (!pendingNote) return;
    ensureLessonProgress(pendingNote.id).note = pendingNote.value;
    pendingNote = null;
    saveState("Jegyzet mentve");
    setText("#lesson-note-status", "Jegyzet mentve ezen a böngészőn.");
  }

  function createQuizRun() {
    const questions = shuffle(DATA.quiz).slice(0, QUIZ_LENGTH).map((question) => {
      const order = shuffle(question.options.map((_, index) => index));
      return { ...question, options: order.map((index) => question.options[index]), correct: order.indexOf(question.correct) };
    });
    return { questions, index: 0, score: 0, answers: [], answered: false, choice: null, startedAt: new Date().toISOString(), saved: false };
  }

  function renderQuiz() {
    const content = document.querySelector("#quiz-content");
    if (quizRun.index >= quizRun.questions.length) {
      if (!quizRun.saved) finishQuiz();
      const percent = Math.round((quizRun.score / quizRun.questions.length) * 100);
      const reviewLessons = [...new Set(quizRun.answers.filter((answer) => !answer.correct).map((answer) => answer.lesson))].map(getLesson).filter(Boolean);
      const reviewHTML = reviewLessons.length ? `<div class="quiz-review"><h3>Érdemes átismételni</h3><ul class="lesson-rows">${reviewLessons.map((lesson) => lessonRowHTML(lesson)).join("")}</ul></div>` : "";
      content.innerHTML = `<div class="quiz-result"><p class="quiz-result__count">${quizRun.score} / ${quizRun.questions.length} helyes válasz</p><h2><span class="quiz-result__score">${percent}%</span> · ${percent >= 80 ? "Stabil alapok" : percent >= 60 ? "Jó irány, célzott ismétléssel" : "Még épül az alap"}</h2><p>${percent >= 80 ? "Ismételd át a bizonytalan válaszokat, majd alkalmazd a fogalmakat replayben." : "Nyisd meg a hibás témák leckéit, majd próbáld újra. A következő kör új kérdéseket sorsol."}</p>${reviewHTML}<button class="primary-button" type="button" id="restart-quiz">Új kör, új kérdések</button></div>`;
      setText("#quiz-counter", "Kész");
      setText("#quiz-score", `${quizRun.score} pont`);
      setMeter("#quiz-progress-bar", 1);
      document.querySelector("#restart-quiz")?.addEventListener("click", startQuiz);
      return;
    }

    const question = quizRun.questions[quizRun.index];
    setText("#quiz-counter", `${quizRun.index + 1} / ${quizRun.questions.length}`);
    setText("#quiz-score", `${quizRun.score} pont`);
    setMeter("#quiz-progress-bar", (quizRun.index + (quizRun.answered ? 1 : 0)) / quizRun.questions.length);
    content.innerHTML = `<h2 class="quiz-question">${escapeHTML(question.question)}</h2><div class="quiz-options">${question.options.map((option, index) => {
      const isChosen = quizRun.choice === index;
      const optionClass = quizRun.answered ? index === question.correct ? "correct" : isChosen ? "wrong" : "" : "";
      return `<button class="quiz-option ${optionClass}" type="button" data-quiz-option="${index}" ${quizRun.answered ? "disabled" : ""}><span>${String.fromCharCode(65 + index)}</span>${escapeHTML(option)}</button>`;
    }).join("")}</div>${quizRun.answered ? `<div class="quiz-feedback ${quizRun.choice === question.correct ? "" : "wrong"}"><strong>${quizRun.choice === question.correct ? "Helyes gondolatmenet" : "Most még nem ez a legpontosabb"}</strong><p>${escapeHTML(question.explanation)}</p>${getLesson(question.lesson) ? `<button class="text-button" type="button" data-open-lesson="${question.lesson}">Kapcsolódó lecke: ${escapeHTML(getLesson(question.lesson).title)}</button>` : ""}</div><div class="quiz-next"><button class="primary-button" id="next-question" type="button">${quizRun.index === quizRun.questions.length - 1 ? "Eredmény megtekintése" : "Következő kérdés"}</button></div>` : ""}`;

    content.querySelectorAll("[data-quiz-option]").forEach((button) => button.addEventListener("click", () => answerQuiz(Number(button.dataset.quizOption))));
    document.querySelector("#next-question")?.addEventListener("click", () => { quizRun.index += 1; quizRun.answered = false; quizRun.choice = null; renderQuiz(); });
  }

  function answerQuiz(choice) {
    if (quizRun.answered) return;
    const question = quizRun.questions[quizRun.index];
    quizRun.answered = true;
    quizRun.choice = choice;
    const correct = choice === question.correct;
    if (correct) quizRun.score += 1;
    quizRun.answers.push({ question: question.question, lesson: question.lesson, correct });
    if (!correct) {
      state.reviews[quizCardId(question)] = { box: 0, due: addDays(localDateKey(), 1) };
      saveState("Kérdés az ismétlők között");
      renderReview();
    }
    renderQuiz();
  }

  function finishQuiz() {
    const percent = Math.round((quizRun.score / quizRun.questions.length) * 100);
    state.quizAttempts.push({ id: uid(), answers: quizRun.answers, score: quizRun.score, percent, startedAt: quizRun.startedAt, completedAt: new Date().toISOString() });
    quizRun.saved = true;
    recordActivity();
    saveState("Kvízeredmény mentve");
    renderOverview();
  }

  function startQuiz() {
    quizRun = createQuizRun();
    renderQuiz();
  }

  // ---------- Heti terv ----------

  function getSchedule() {
    const today = localDateKey();
    const start = state.profile.startDate || today;
    const elapsed = daysBetween(start, today);
    return { start, started: elapsed >= 0, week: Math.floor(Math.max(0, elapsed) / 7) + 1 };
  }

  function weekRangeLabel(start, fromWeek, toWeek = fromWeek) {
    return `${shortDate(addDays(start, (fromWeek - 1) * 7))} – ${shortDate(addDays(start, toWeek * 7 - 1))}`;
  }

  function renderWeek() {
    const { start, started, week } = getSchedule();
    const remaining = allLessons.filter((lesson) => !isLessonComplete(lesson.id));
    let lessons = allLessons.filter((lesson) => lesson.week === Math.min(week, TOTAL_WEEKS));
    let range = `${week}. hét · ${weekRangeLabel(start, week)}`;
    let status;
    if (!started) {
      lessons = allLessons.filter((lesson) => lesson.week === 1);
      range = `Kezdés: ${shortDate(start)}`;
      status = "A terv még nem indult el. Addig is bármelyik lecke megnyitható.";
    } else if (week > TOTAL_WEEKS) {
      lessons = remaining.slice(0, 4);
      range = `A ${TOTAL_WEEKS} hetes terv véget ért`;
      status = remaining.length
        ? `${remaining.length} lecke van még hátra. A tempó a tiéd: a beállításokban új kezdőnapot is megadhatsz.`
        : "Minden lecke kész. Most a gyakorlás és a heti review számít.";
    } else {
      const behind = allLessons.filter((lesson) => lesson.week < week && !isLessonComplete(lesson.id)).length;
      const ahead = allLessons.filter((lesson) => lesson.week > week && isLessonComplete(lesson.id)).length;
      const left = lessons.filter((lesson) => !isLessonComplete(lesson.id)).length;
      status = behind ? `${behind} lecke maradt el a korábbi hetekből. Előbb azokat pótold: a sorrend számít.`
        : left ? `${left} lecke van hátra erre a hétre.`
        : ahead ? `A heti leckék készen vannak, és ${ahead} leckével előrébb jársz a tervnél.`
        : "A heti leckék készen vannak. Marad idő ismétlésre és replayre.";
    }
    setText("#week-range", range);
    setText("#week-status", status);
    document.querySelector("#week-lessons").innerHTML = lessons.map((lesson) => lessonRowHTML(lesson)).join("");
  }

  // ---------- Tanulási idő és naptár ----------

  function studyMinutes(dateKey = localDateKey()) {
    return Math.floor((Number(state.studyLog[dateKey]) || 0) / 60);
  }

  function renderStudyTime() {
    const goal = Number(state.profile.dailyGoal) || 30;
    setText("#daily-goal-chip", `${studyMinutes()} / ${goal} perc`);
    setMeter("#daily-meter", studyMinutes() / goal);
    renderCalendar();
  }

  // Öt hét hétfőtől vasárnapig, az utolsó sor az aktuális hét.
  function renderCalendar() {
    const container = document.querySelector("#study-calendar");
    if (!container) return;
    const today = localDateKey();
    const goal = Number(state.profile.dailyGoal) || 30;
    const weekday = (new Date().getDay() + 6) % 7;
    const first = addDays(today, -weekday - 28);
    let weekMinutes = 0;
    let weekDays = 0;
    container.innerHTML = Array.from({ length: 35 }, (_, index) => {
      const key = addDays(first, index);
      const minutes = studyMinutes(key);
      const active = minutes > 0 || state.activityDates.includes(key);
      const future = key > today;
      if (index >= 28 && !future) { weekMinutes += minutes; if (active) weekDays += 1; }
      const level = !active ? 0 : minutes >= goal ? 3 : minutes >= goal / 2 ? 2 : 1;
      const label = `${shortDate(key)}: ${future ? "még hátravan" : !active ? "nem volt tanulás" : minutes ? `${minutes} perc` : "aktív nap"}`;
      return `<i class="cal ${future ? "is-future" : `level-${level}`}${key === today ? " is-today" : ""}" title="${label}"></i>`;
    }).join("");
    const summary = `Ezen a héten ${weekMinutes} perc, ${weekDays} aktív nap.`;
    container.setAttribute("role", "img");
    container.setAttribute("aria-label", `Tanulási naptár az elmúlt öt hétről. ${summary}`);
    setText("#calendar-summary", summary);
  }

  // Csak akkor számol, ha a lap látható és volt friss interakció.
  function tickStudyTime() {
    if (document.visibilityState !== "visible" || Date.now() - lastInteraction > IDLE_LIMIT_MS) return;
    const today = localDateKey();
    const before = studyMinutes(today);
    state.studyLog[today] = (Number(state.studyLog[today]) || 0) + STUDY_TICK_SECONDS;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* a következő mentés jelzi a hibát */ }
    const after = studyMinutes(today);
    if (after === before) return;
    renderStudyTime();
    if (after === Number(state.profile.dailyGoal)) showToast(`Megvan a mai ${after} perc.`);
  }

  // ---------- Időzített ismétlés ----------

  function hashText(text) {
    let hash = 5381;
    for (const character of text) hash = ((hash << 5) + hash + character.codePointAt(0)) >>> 0;
    return hash.toString(36);
  }

  const quizCardId = (question) => `quiz:${hashText(question.question)}`;
  const QUIZ_BY_CARD = new Map(DATA.quiz.map((question) => [quizCardId(question), question]));

  // A pakli: a teljesített leckék önellenőrző kérdései és a korábban elrontott kvízkérdések.
  function reviewCards() {
    const cards = [];
    allLessons.forEach((lesson) => (lesson.check || []).forEach((item, index) => {
      const id = `check:${lesson.id}:${index}`;
      const saved = state.reviews[id];
      if (!saved && !isLessonComplete(lesson.id)) return;
      const completed = new Date(state.progress[lesson.id]?.completedAt || Date.now());
      cards.push({ id, front: item.q, back: item.a, lesson, box: saved?.box || 0, due: saved ? saved.due : addDays(localDateKey(completed), 1) });
    }));
    Object.keys(state.reviews).forEach((id) => {
      const question = QUIZ_BY_CARD.get(id);
      if (!question) return;
      cards.push({ id, front: question.question, back: `**${question.options[question.correct]}** ${question.explanation}`, lesson: getLesson(question.lesson), box: state.reviews[id].box || 0, due: state.reviews[id].due, fromQuiz: true });
    });
    return cards;
  }

  function renderReview(focus = false) {
    const content = document.querySelector("#review-content");
    if (!content) return;
    const today = localDateKey();
    const cards = reviewCards();
    const byId = new Map(cards.map((card) => [card.id, card]));
    const due = cards.filter((card) => card.due <= today).sort((a, b) => a.due.localeCompare(b.due) || a.box - b.box);

    const count = document.querySelector("#review-count");
    count.hidden = due.length === 0;
    count.textContent = String(due.length);

    if (!reviewSession) reviewSession = { queue: [], revealed: false, done: 0, again: new Set() };
    reviewSession.queue = reviewSession.queue.filter((id) => byId.has(id));
    if (!reviewSession.queue.length) reviewSession.queue = due.map((card) => card.id);

    if (!cards.length) {
      setText("#review-status", "");
      content.innerHTML = '<div class="empty-state"><h3>Az ismétlő pakli még üres</h3><p>A pakli a teljesített leckék önellenőrző kérdéseiből és a kvízben elrontott kérdésekből épül. Teljesíts egy leckét, és másnap itt várnak a kérdései.</p><button class="secondary-button" type="button" data-view-target="tananyag">Tananyag megnyitása</button></div>';
      return;
    }

    if (!reviewSession.queue.length) {
      const upcoming = cards.filter((card) => card.due > today).sort((a, b) => a.due.localeCompare(b.due));
      const nextDay = upcoming[0]?.due;
      const nextCount = upcoming.filter((card) => card.due === nextDay).length;
      setText("#review-status", `A pakliban ${cards.length} kártya van.`);
      content.innerHTML = `<div class="empty-state"><h3>${reviewSession.done ? `Mára kész: ${reviewSession.done} kártyát ismételtél át` : "Mára nincs esedékes kártya"}</h3><p>${nextDay ? `A következő ismétlés: ${shortDate(nextDay)}, ${nextCount} kártya. A tudott kártyák egyre ritkábban jönnek vissza.` : "Minden kártya a helyén van."}</p></div>`;
      return;
    }

    const card = byId.get(reviewSession.queue[0]);
    setText("#review-status", `Mára még ${reviewSession.queue.length} kártya van hátra. A pakliban összesen ${cards.length}.`);
    const source = card.lesson ? `${card.fromQuiz ? "Kvízkérdés" : "Önellenőrzés"} · ${card.lesson.globalIndex}. lecke: ${card.lesson.title}` : "Kvízkérdés";
    content.innerHTML = `<article class="review-card">
      <p class="review-card__source">${escapeHTML(source)}</p>
      <h2>${escapeHTML(card.front)}</h2>
      ${reviewSession.revealed
        ? `<div class="review-card__answer">${formatInline(card.back)}</div>
           <div class="review-actions"><button class="secondary-button" type="button" data-review-grade="again">Nem tudtam</button><button class="primary-button" type="button" data-review-grade="good">Tudtam</button>${card.lesson ? `<button class="text-button" type="button" data-open-lesson="${card.lesson.id}">Lecke megnyitása</button>` : ""}</div>`
        : '<div class="review-actions"><button class="primary-button" type="button" data-review-reveal>Válasz mutatása</button></div>'}
    </article>`;
    if (focus) content.querySelector('[data-review-reveal], [data-review-grade="good"]')?.focus();
  }

  function gradeReview(known) {
    const id = reviewSession?.queue[0];
    if (!id) return;
    const today = localDateKey();
    const secondLook = reviewSession.again.has(id);
    reviewSession.queue.shift();
    reviewSession.revealed = false;
    // Az elrontott kártya még egyszer visszajön a mai körben, de az ütemezése holnapra szól.
    if (!secondLook) {
      const box = known ? Math.min((state.reviews[id]?.box || 0) + 1, REVIEW_INTERVALS.length - 1) : 0;
      state.reviews[id] = { box, due: addDays(today, REVIEW_INTERVALS[box]), seen: today };
      reviewSession.done += 1;
      if (!known) { reviewSession.again.add(id); reviewSession.queue.push(id); }
      recordActivity();
      saveState("Ismétlés mentve");
    }
    renderReview(true);
    renderOverview();
  }

  // ---------- Napló-statisztika ----------

  function setJournalTab(tab) {
    journalTab = tab;
    document.querySelectorAll('[role="tab"][data-journal-tab]').forEach((button) => {
      const active = button.dataset.journalTab === tab;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll("[data-journal-panel]").forEach((panel) => { panel.hidden = panel.dataset.journalPanel !== tab; });
    if (tab === "stats") renderStats();
  }

  function renderStats() {
    const stats = CALC.journalStats(state.journalEntries.filter((entry) => statsMode === "all" || entry.mode === statsMode));
    setText("#stats-sample", `${stats.count} kötés, ${stats.entries} bejegyzés`);
    document.querySelector("#stats-empty").hidden = stats.count > 0;
    document.querySelector("#stats-body").hidden = stats.count === 0;
    if (!stats.count) return;

    setText("#stats-note", stats.count < 20
      ? `Ez még nem statisztika: ${stats.count} kötésnél a szórás nagyobb, mint a jel. Gyűjts tovább, mielőtt bármit módosítasz a szabályaidon.`
      : stats.count < 100 ? `Az első érdemi képhez legalább 100, előre rögzített szabály szerinti kötés kell. Most ${stats.count} van.` : "");

    const tone = (value) => (value > 0 ? "is-good" : value < 0 ? "is-bad" : "");
    document.querySelector("#stats-figures").innerHTML = [
      ["Várható érték kötésenként", signedR(stats.expectancy, 3), tone(stats.expectancy)],
      ["Összes eredmény", signedR(stats.totalR), tone(stats.totalR)],
      ["Találati arány", `${formatNumber(stats.winRate, 1)}%`],
      ["Átlagos nyerő", signedR(stats.avgWin)],
      ["Átlagos vesztes", signedR(-stats.avgLoss)],
      ["Legnagyobb visszaesés", `${formatNumber(stats.maxDrawdown)}R`],
      ["Leghosszabb vesztes sorozat", `${stats.maxLossStreak} kötés`],
      ["Szabálykövetés (cél: 90%)", `${formatNumber(stats.ruleRate, 0)}%`, stats.ruleRate >= 90 ? "is-good" : "is-bad"],
      ["Szabálytalan nyerő kötés", String(stats.ruleBreakWins)],
      ["Kötés nélküli bejegyzés", String(stats.noTrades)],
      ...(stats.maeCount ? [["Átlagos MAE / MFE", `${formatNumber(stats.avgMae)}R / ${formatNumber(stats.avgMfe)}R`]] : []),
    ].map(([label, value, className = ""]) => `<div><dt>${label}</dt><dd class="${className}">${value}</dd></div>`).join("");

    const container = document.querySelector("#stats-curve");
    if (container.clientWidth > 0) {
      const { curve } = stats;
      const color = "var(--series-1)";
      const step = Math.max(1, Math.ceil(curve.length / 6));
      const ticks = [];
      for (let index = 0; index <= curve.length; index += step) ticks.push(index);
      if (curve.length - ticks[ticks.length - 1] > step / 2) ticks.push(curve.length); else ticks[ticks.length - 1] = curve.length;
      CHARTS.lineChart(container, {
        count: curve.length + 1,
        series: [{ label: "Halmozott eredmény", color, values: [0, ...curve.map((point) => point.cumulative)], endLabel: signedR(stats.totalR) }],
        xTicks: [...new Set(ticks)].map((index) => ({ x: index, label: index ? `${index}.` : "0" })),
        baseline: 0,
        formatY: (value) => `${formatNumber(value, 1)}R`,
        ariaLabel: `Halmozott eredmény ${curve.length} kötés után: ${signedR(stats.totalR)}. A nyílbillentyűkkel léptethető.`,
        tooltip: (index) => {
          if (index === 0) return { title: "Kezdés", rows: [{ color, value: "0R", label: "Halmozott" }] };
          const point = curve[index - 1];
          return { title: `${point.index}. kötés · ${point.symbol} · ${formatDate(point.date)}`, rows: [{ color, value: signedR(point.cumulative), label: "Halmozott" }, { value: signedR(point.result), label: "Ez a kötés" }] };
        },
      });
    }

    const breakdown = (title, groups, labelOf) => `<section><h3>${title}</h3><div class="table-wrap"><table>
      <thead><tr><th scope="col">Csoport</th><th scope="col" class="num">Kötés</th><th scope="col" class="num">Találati arány</th><th scope="col" class="num">Átlag</th><th scope="col" class="num">Összesen</th></tr></thead>
      <tbody>${groups.map((group) => `<tr><td>${escapeHTML(labelOf(group.key))}</td><td class="num">${group.count}</td><td class="num">${formatNumber(group.winRate, 0)}%</td><td class="num">${signedR(group.expectancy)}</td><td class="num">${signedR(group.totalR)}</td></tr>`).join("")}</tbody>
    </table></div></section>`;
    const capitalize = (text) => text.charAt(0).toLocaleUpperCase("hu-HU") + text.slice(1);
    document.querySelector("#stats-tables").innerHTML = breakdown("Setup szerint", stats.bySetup, (key) => key)
      + breakdown("Szabálykövetés szerint", stats.byRule, (key) => ({ igen: "Szabályos", reszben: "Részben szabályos", nem: "Szabálytalan" })[key] || key)
      + breakdown("Érzelmi állapot szerint", stats.byEmotion, (key) => capitalize(emotionLabel(key)));
  }

  function addJournalEntry(input) {
    const entry = {
      id: uid(),
      mode: input.mode || "paper",
      tradedAt: input.tradedAt || localDateKey(),
      symbol: String(input.symbol || "").trim().slice(0, 24),
      direction: input.direction || "long",
      setup: String(input.setup || "").trim().slice(0, 80),
      entry: input.entry ?? "",
      stop: input.stop ?? "",
      target: input.target ?? "",
      resultR: input.resultR ?? "",
      emotion: input.emotion || "nyugodt",
      ruleFollowed: input.ruleFollowed || "igen",
      lesson: String(input.lesson || "").trim().slice(0, 600),
      observation: String(input.observation || "").trim().slice(0, 600),
      hypothesis: String(input.hypothesis || "").trim().slice(0, 200),
      invalidation: String(input.invalidation || "").trim().slice(0, 200),
      mae: input.mae ?? "",
      mfe: input.mfe ?? "",
      createdAt: new Date().toISOString(),
    };
    if (!entry.symbol || !entry.setup || !entry.lesson) throw new Error("Az instrumentum, setup és tanulság kötelező.");
    state.journalEntries.push(entry);
    recordActivity();
    saveState("Naplóbejegyzés mentve");
    renderJournal();
    renderOverview();
    return entry;
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tradecraft-mentes-${localDateKey()}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("A JSON biztonsági mentés elkészült.");
  }

  function showView(view, updateHash = true) {
    if (!viewMeta[view] || (view === "lecke" && !getLesson(activeLessonId))) view = "attekintes";
    flushNote();
    currentView = view;
    const lesson = view === "lecke" ? getLesson(activeLessonId) : null;
    const navView = lesson ? "tananyag" : view;

    document.querySelectorAll(".app-view").forEach((section) => {
      const active = section.dataset.view === view;
      section.hidden = !active;
      section.classList.toggle("active", active);
    });
    document.querySelectorAll(".nav-item").forEach((button) => {
      const active = button.dataset.viewTarget === navView;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
    });

    positionNavIndicator();

    const title = lesson ? lesson.title : viewMeta[view].title;
    setText("#page-title", title);
    setText("#page-eyebrow", lesson ? `${lesson.globalIndex}. lecke · ${lesson.moduleTitle}` : viewMeta[view].subtitle);
    document.title = view === "attekintes" ? "TradeCraft Akadémia" : `${title} · TradeCraft Akadémia`;

    const hash = lesson ? `#lecke/${lesson.id}` : `#${view}`;
    if (updateHash && location.hash !== hash) history.pushState(null, "", hash);
    window.scrollTo(0, 0);
    if (view === "naplo" && journalTab === "stats") renderStats();
  }

  function positionNavIndicator() {
    const nav = document.querySelector(".main-nav");
    const active = nav?.querySelector(".nav-item.active");
    if (!nav || !active) return;
    nav.style.setProperty("--l", `${active.offsetLeft}px`);
    nav.style.setProperty("--r", `${nav.clientWidth - active.offsetLeft - active.offsetWidth}px`);
    // Az első pozicionálás ugrik, csak utána animál.
    requestAnimationFrame(() => nav.classList.add("is-ready"));
  }

  function route(updateHash = false) {
    const target = decodeURIComponent(location.hash.slice(1));
    if (target.startsWith("lecke/") && getLesson(target.slice(6))) return openLesson(target.slice(6), updateHash);
    showView(viewMeta[target] && target !== "lecke" ? target : "attekintes", updateHash);
  }

  function setPracticeTab(tab) {
    document.querySelectorAll("[data-practice-tab]").forEach((button) => {
      const active = button.dataset.practiceTab === tab;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll("[data-practice-panel]").forEach((panel) => {
      const active = panel.dataset.practicePanel === tab;
      panel.hidden = !active;
      panel.classList.toggle("active", active);
    });
    if (tab === "review") renderReview();
  }

  function openSettings() {
    const form = document.querySelector("#settings-form");
    form.elements.experience.value = state.profile.experience;
    form.elements.dailyGoal.value = String(state.profile.dailyGoal);
    form.elements.startDate.value = state.profile.startDate;
    form.elements.theme.value = ["light", "dark"].includes(state.settings.theme) ? state.settings.theme : "system";
    form.elements.reducedMotion.checked = Boolean(state.settings.reducedMotion);
    document.querySelector("#settings-dialog").showModal();
  }

  function applySettings() {
    document.body.classList.toggle("reduce-motion", Boolean(state.settings.reducedMotion));
    const theme = state.settings.theme;
    if (theme === "light" || theme === "dark") document.documentElement.dataset.theme = theme;
    else delete document.documentElement.dataset.theme;
  }

  function showToast(message, isError = false) {
    const toast = document.createElement("div");
    toast.className = `toast${isError ? " error" : ""}`;
    toast.textContent = message;
    document.querySelector("#toast-region").append(toast);
    window.setTimeout(() => {
      toast.classList.add("out");
      window.setTimeout(() => toast.remove(), 220);
    }, 3200);
  }

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  }

  function modeLabel(mode) {
    return ({ paper: "szimulált", replay: "replay", live: "valós" })[mode] || mode;
  }

  function directionLabel(direction) {
    return ({ long: "Long", short: "Short", "no-trade": "No trade" })[direction] || direction;
  }

  function emotionLabel(emotion) {
    return ({ nyugodt: "nyugodt", bizonytalan: "bizonytalan", kapkodo: "kapkodó", frusztralt: "frusztrált", tulbiztos: "túl magabiztos" })[emotion] || emotion;
  }

  function ruleLabel(rule) {
    return ({ igen: "igen", reszben: "részben", nem: "nem" })[rule] || rule;
  }

  function formObject(form) {
    return Object.fromEntries(new FormData(form).entries());
  }

  async function copyQuestions() {
    if (!state.questions.length) return showToast("Még nincs másolható kérdés.");
    const text = `Megbeszélendő day trading kérdések:\n${state.questions.map((question, index) => `${index + 1}. ${question.text}`).join("\n")}`;
    try {
      await navigator.clipboard.writeText(text);
      showToast("A kérdéslista a vágólapra került.");
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      showToast("A kérdéslista a vágólapra került.");
    }
  }

  function registerWebMCP() {
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
        return { completedLessons: getCompletedCount(), totalLessons: allLessons.length, percent: Math.round((getCompletedCount() / allLessons.length) * 100), nextLesson: { id: next.id, title: next.title } };
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
        const entry = addJournalEntry({ ...input, tradedAt: localDateKey(), emotion: "nyugodt", ruleFollowed: "igen" });
        return { id: entry.id, saved: true, symbol: entry.symbol, mode: entry.mode };
      },
    });
  }

  document.addEventListener("click", (event) => {
    const viewButton = event.target.closest("[data-view-target]");
    if (viewButton) showView(viewButton.dataset.viewTarget);

    const lessonButton = event.target.closest("[data-open-lesson]");
    if (lessonButton) openLesson(lessonButton.dataset.openLesson);

    const closeButton = event.target.closest("[data-close-dialog]");
    if (closeButton) document.querySelector(`#${closeButton.dataset.closeDialog}`)?.close();

    const roadmapButton = event.target.closest("[data-roadmap-filter]");
    if (roadmapButton) {
      roadmapFilter = roadmapButton.dataset.roadmapFilter;
      document.querySelectorAll("[data-roadmap-filter]").forEach((button) => button.classList.toggle("active", button === roadmapButton));
      renderRoadmap();
    }

    if (event.target.closest("[data-open-settings]")) openSettings();

    const libraryButton = event.target.closest("[data-library-tab]");
    if (libraryButton) setLibraryTab(libraryButton.dataset.libraryTab);

    const tabButton = event.target.closest("[data-practice-tab]");
    if (tabButton) setPracticeTab(tabButton.dataset.practiceTab);

    const practiceOpen = event.target.closest("[data-practice-open]");
    if (practiceOpen) setPracticeTab(practiceOpen.dataset.practiceOpen);

    const journalButton = event.target.closest("[data-journal-tab]");
    if (journalButton) setJournalTab(journalButton.dataset.journalTab);

    const statsButton = event.target.closest("[data-stats-mode]");
    if (statsButton) {
      statsMode = statsButton.dataset.statsMode;
      document.querySelectorAll("[data-stats-mode]").forEach((button) => button.classList.toggle("active", button === statsButton));
      renderStats();
    }

    if (event.target.closest("[data-review-reveal]") && reviewSession) { reviewSession.revealed = true; renderReview(true); }
    const gradeButton = event.target.closest("[data-review-grade]");
    if (gradeButton) gradeReview(gradeButton.dataset.reviewGrade === "good");

    if (event.target.closest("#journal-more")) { journalLimit += 20; renderJournal(); }

    const entryDelete = event.target.closest("[data-delete-entry]");
    if (entryDelete && confirm("Biztosan törlöd ezt a naplóbejegyzést?")) {
      state.journalEntries = state.journalEntries.filter((entry) => entry.id !== entryDelete.dataset.deleteEntry);
      saveState("Bejegyzés törölve"); renderJournal(); renderOverview();
    }

    const questionDelete = event.target.closest("[data-delete-question]");
    if (questionDelete) {
      state.questions = state.questions.filter((question) => question.id !== questionDelete.dataset.deleteQuestion);
      saveState("Kérdés törölve"); renderQuestions(); renderOverview();
    }
  });

  window.addEventListener("popstate", () => route(false));
  window.addEventListener("pagehide", flushNote);
  window.addEventListener("resize", positionNavIndicator);
  document.fonts?.ready.then(positionNavIndicator);

  document.querySelector("#lesson-back")?.addEventListener("click", () => showView(lessonReturnView));
  document.querySelector("#toggle-lesson-complete")?.addEventListener("click", () => activeLessonId && toggleLessonComplete(activeLessonId));
  document.querySelector("#lesson-note")?.addEventListener("input", (event) => {
    if (!activeLessonId) return;
    clearTimeout(noteTimer);
    pendingNote = { id: activeLessonId, value: event.target.value };
    setText("#lesson-note-status", "Mentés…");
    noteTimer = window.setTimeout(flushNote, 350);
  });

  ["#lesson-search", "#lesson-module-filter", "#lesson-status-filter"].forEach((selector) => document.querySelector(selector)?.addEventListener(selector === "#lesson-search" ? "input" : "change", renderLessons));
  document.querySelector("#clear-lesson-filters")?.addEventListener("click", () => { document.querySelector("#lesson-search").value = ""; document.querySelector("#lesson-module-filter").value = "all"; document.querySelector("#lesson-status-filter").value = "all"; renderLessons(); });
  document.querySelector("#glossary-search")?.addEventListener("input", renderGlossary);

  document.querySelector("#settings-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = formObject(event.currentTarget);
    state.profile.experience = input.experience;
    state.profile.dailyGoal = Number(input.dailyGoal) || 30;
    if (input.startDate) state.profile.startDate = input.startDate;
    state.settings.theme = input.theme;
    state.settings.reducedMotion = event.currentTarget.elements.reducedMotion.checked;
    saveState("Beállítások mentve"); renderAll(); document.querySelector("#settings-dialog").close(); showToast("A beállítások frissültek.");
  });

  document.querySelectorAll("[data-order-answer]").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll("[data-order-answer]").forEach((item) => item.classList.toggle("selected", item === button));
    const messages = {
      market: "A market buy illik az »azonnal venni« célhoz, de az átlagár a látható asknál rosszabb is lehet. Végrehajtást keres, nem garantált árat.",
      limit: "A 5102,00-s limit buy árkontrollt ad, de a jelenlegi best ask mellett nem feltétlenül teljesül. Akkor helyes, ha a maximális ár fontosabb az azonnaliságnál.",
      stop: "Az 5103,00-s buy stop csak a trigger elérésekor aktiválódik; kitörési feltételhez lehet alkalmas, nem azonnali belépéshez.",
    };
    const feedback = document.querySelector("#order-feedback");
    feedback.textContent = messages[button.dataset.orderAnswer];
    feedback.classList.add("is-answered");
  }));

  document.querySelector("#journal-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      addJournalEntry(formObject(event.currentTarget));
      event.currentTarget.reset();
      event.currentTarget.elements.tradedAt.value = localDateKey();
      showToast("A naplóbejegyzés mentve.");
    } catch (error) { showToast(error.message, true); }
  });

  document.querySelector("#question-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = event.currentTarget.elements.question.value.trim();
    if (!text) return;
    state.questions.push({ id: uid(), text: text.slice(0, 240), createdAt: new Date().toISOString() });
    event.currentTarget.reset(); saveState("Kérdés mentve"); renderQuestions(); renderOverview(); showToast("A kérdés bekerült a listába.");
  });

  document.querySelector("#copy-questions")?.addEventListener("click", copyQuestions);
  document.querySelector("#export-data")?.addEventListener("click", exportData);
  document.querySelector("#export-from-journal")?.addEventListener("click", exportData);
  document.querySelector("#import-data")?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!parsed || typeof parsed !== "object" || !parsed.profile || !parsed.progress) throw new Error("A fájl nem érvényes TradeCraft mentés.");
      if (!confirm("Az import felülírja a jelenlegi helyi adatokat. Folytatod?")) return;
      state = normalizeState(parsed);
      reviewSession = null;
      saveState("Import kész"); renderAll(); if (currentView === "lecke") showView("tananyag"); document.querySelector("#settings-dialog").close(); showToast("Az adatok importálva.");
    } catch (error) { showToast(error.message || "Az import sikertelen.", true); }
    finally { event.target.value = ""; }
  });

  document.querySelector("#reset-data")?.addEventListener("click", () => {
    if (!confirm("Ez törli a helyi haladást, jegyzeteket, kvízeket és naplót. Exportált mentés nélkül nem vonható vissza. Biztosan folytatod?")) return;
    pendingNote = null;
    reviewSession = null;
    state = createDefaultState();
    saveState("Adatok törölve"); renderAll(); startQuiz(); if (currentView === "lecke") showView("tananyag"); document.querySelector("#settings-dialog").close(); showToast("A helyi adatok törölve.");
  });

  document.querySelectorAll("dialog").forEach((dialog) => dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) dialog.close();
  }));

  document.querySelector("#journal-form").elements.tradedAt.value = localDateKey();
  renderAll();
  renderQuiz();
  route(false);
  ["pointerdown", "keydown", "scroll"].forEach((type) => window.addEventListener(type, () => { lastInteraction = Date.now(); }, { passive: true }));
  window.setInterval(tickStudyTime, STUDY_TICK_SECONDS * 1000);
  let statsResizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(statsResizeTimer);
    statsResizeTimer = setTimeout(() => { if (currentView === "naplo" && journalTab === "stats") renderStats(); }, 150);
  });
  registerWebMCP();
  if (storageRecovered) showToast("A korábbi helyi adat nem volt olvasható, ezért biztonságos alapállapotot töltöttünk be.", true);
})();
