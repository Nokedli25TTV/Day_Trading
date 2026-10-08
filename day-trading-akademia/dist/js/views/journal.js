// Gyakorlási napló: bejegyzés rögzítése és szerkesztése, lista, képernyőképek, CSV export.
import { state, commit, onRender, recordActivity } from "../store.js";
import { showToast } from "../toast.js";
import { saveAttachment, deleteAttachment, attachmentURL } from "../features/attachments.js";
import { renderRuleChoices } from "./rulebook.js";
import { applyGate } from "./precheck.js";
import { modeLabel, directionLabel, emotionLabel, ruleLabel } from "../labels.js";
import { $, $$, setText, escapeHTML, formatNumber, formatDate, signedR, hasNumber, formObject, localDateKey, uid, downloadFile } from "../util.js";

const TEXT_FIELDS = { symbol: 24, setup: 80, lesson: 600, observation: 600, hypothesis: 200, invalidation: 200 };
const VALUE_FIELDS = ["entry", "stop", "target", "resultR", "mae", "mfe"];
let editingId = null;
let limit = 12;

// A bemenetből tiszta bejegyzésmezőket készít: levág, hosszt korlátoz, alapértéket ad.
function entryFields(input) {
  const fields = {
    mode: input.mode || "paper",
    tradedAt: input.tradedAt || localDateKey(),
    direction: input.direction || "long",
    emotion: input.emotion || "nyugodt",
    ruleFollowed: input.ruleFollowed || "igen",
  };
  Object.entries(TEXT_FIELDS).forEach(([name, max]) => { fields[name] = String(input[name] || "").trim().slice(0, max); });
  VALUE_FIELDS.forEach((name) => { fields[name] = input[name] ?? ""; });
  fields.brokenRules = Array.isArray(input.brokenRules) ? input.brokenRules : [];
  if (!fields.symbol || !fields.setup || !fields.lesson) throw new Error("Az instrumentum, a setup és a tanulság kötelező.");
  return fields;
}

export function addJournalEntry(input) {
  const entry = { id: uid(), ...entryFields(input), createdAt: new Date().toISOString() };
  state.journalEntries.push(entry);
  recordActivity();
  commit("Naplóbejegyzés mentve");
  return entry;
}

function updateJournalEntry(id, input) {
  const entry = state.journalEntries.find((item) => item.id === id);
  if (!entry) throw new Error("A szerkesztett bejegyzés már nem létezik.");
  Object.assign(entry, entryFields(input), { updatedAt: new Date().toISOString() });
  commit("Bejegyzés módosítva");
  return entry;
}

// ---------- Űrlap ----------

function setFormMode(entry) {
  const form = $("#journal-form");
  editingId = entry ? entry.id : null;
  setText("#journal-form-title", entry ? "Bejegyzés szerkesztése" : "Új bejegyzés");
  setText("#journal-submit", entry ? "Módosítás mentése" : "Bejegyzés mentése");
  $("#journal-cancel").hidden = !entry;
  form.reset();
  if (entry) form.dataset.editing = "1"; else delete form.dataset.editing;
  renderRuleChoices(entry?.brokenRules || []);
  applyGate();
  if (!entry) {
    form.elements.tradedAt.value = localDateKey();
    return;
  }
  ["mode", "tradedAt", "direction", "emotion", "ruleFollowed", ...Object.keys(TEXT_FIELDS), ...VALUE_FIELDS].forEach((name) => {
    form.elements[name].value = entry[name] ?? "";
  });
  form.querySelector(".form-more").open = ["observation", "hypothesis", "invalidation", "mae", "mfe"].some((name) => entry[name]) || Boolean(entry.attachment) || entry.brokenRules?.length > 0;
  form.scrollIntoView({ block: "start" });
  form.elements.symbol.focus({ preventScroll: true });
}

async function submit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const file = form.elements.screenshot.files[0];
  try {
    const { screenshot, broken, ...input } = formObject(form);
    input.brokenRules = new FormData(form).getAll("broken");
    const entry = editingId ? updateJournalEntry(editingId, input) : addJournalEntry(input);
    if (file) {
      await saveAttachment(entry.id, file);
      entry.attachment = true;
      commit("Képernyőkép mentve");
    }
    showToast(editingId ? "A bejegyzés módosítva." : "A naplóbejegyzés mentve.");
    setFormMode(null);
    renderJournal();
  } catch (error) {
    showToast(error.message || "A mentés nem sikerült.", true);
  }
}

// ---------- Lista ----------

function renderJournal() {
  const entries = [...state.journalEntries].sort((a, b) => String(b.tradedAt).localeCompare(String(a.tradedAt)) || String(b.createdAt).localeCompare(String(a.createdAt)));
  setText("#journal-count", `${entries.length} db`);
  $("#journal-empty").hidden = entries.length > 0;
  $("#journal-more").hidden = entries.length <= limit;
  $("#export-csv").hidden = entries.length === 0;
  const detail = (label, value) => (value ? `<p class="journal-entry__detail"><strong>${label}:</strong> ${escapeHTML(value)}</p>` : "");
  const excursion = (label, value) => (hasNumber(value) ? `<span>${label} ${formatNumber(Number(value))}R</span>` : "");
  $("#journal-list").innerHTML = entries.slice(0, limit).map((entry) => {
    const result = Number(entry.resultR);
    const tone = !hasNumber(entry.resultR) || result === 0 ? "" : result > 0 ? "is-good" : "is-bad";
    return `<article class="journal-entry${entry.id === editingId ? " is-editing" : ""}">
      <div class="journal-entry__top">
        <div><strong>${escapeHTML(entry.symbol)} · ${escapeHTML(directionLabel(entry.direction))}</strong><small>${formatDate(entry.tradedAt)} · ${escapeHTML(modeLabel(entry.mode))}${entry.updatedAt ? " · szerkesztve" : ""}</small></div>
        <div class="journal-entry__actions"><button class="text-button" type="button" data-edit-entry="${entry.id}">Szerkesztés</button><button class="delete-entry" type="button" data-delete-entry="${entry.id}" aria-label="Bejegyzés törlése">×</button></div>
      </div>
      <div class="journal-entry__badges"><span class="${tone}">${hasNumber(entry.resultR) ? signedR(result) : "R: –"}</span><span>${escapeHTML(entry.setup)}</span><span>Szabály: ${escapeHTML(ruleLabel(entry.ruleFollowed))}</span><span>${escapeHTML(emotionLabel(entry.emotion))}</span>${entry.brokenRules?.length ? `<span class="is-bad">${entry.brokenRules.length} megszegett szabály</span>` : ""}${excursion("MAE", entry.mae)}${excursion("MFE", entry.mfe)}</div>
      ${detail("Megfigyelés", entry.observation)}${detail("Hipotézis", entry.hypothesis)}${detail("Érvénytelenítés", entry.invalidation)}
      <p>${escapeHTML(entry.lesson)}</p>
      ${entry.attachment ? `<button class="journal-shot" type="button" data-shot="${entry.id}" aria-label="Képernyőkép megnyitása" hidden><img alt="" /></button>` : ""}
    </article>`;
  }).join("");

  // A képek külön tárolóból, utólag töltődnek be.
  $$("#journal-list [data-shot]").forEach(async (button) => {
    const url = await attachmentURL(button.dataset.shot).catch(() => null);
    if (!url) return;
    button.querySelector("img").src = url;
    button.hidden = false;
  });
}

async function openShot(id) {
  const url = await attachmentURL(id);
  if (!url) return;
  $("#shot-image").src = url;
  $("#shot-dialog").showModal();
}

function removeEntry(id) {
  if (!confirm("Biztosan törlöd ezt a naplóbejegyzést?")) return;
  state.journalEntries = state.journalEntries.filter((entry) => entry.id !== id);
  deleteAttachment(id).catch(() => {});
  if (editingId === id) setFormMode(null);
  commit("Bejegyzés törölve");
}

// ---------- CSV ----------

// Pontosvessző és tizedesvessző: így a magyar Excel közvetlenül megnyitja.
function exportCSV() {
  const number = (value) => (hasNumber(value) ? String(value).replace(".", ",") : "");
  const columns = [
    ["Dátum", (entry) => entry.tradedAt], ["Mód", (entry) => modeLabel(entry.mode)], ["Instrumentum", (entry) => entry.symbol],
    ["Irány", (entry) => directionLabel(entry.direction)], ["Setup", (entry) => entry.setup],
    ["Belépő", (entry) => number(entry.entry)], ["Stop", (entry) => number(entry.stop)], ["Cél", (entry) => number(entry.target)],
    ["Eredmény (R)", (entry) => number(entry.resultR)], ["MAE (R)", (entry) => number(entry.mae)], ["MFE (R)", (entry) => number(entry.mfe)],
    ["Érzelmi állapot", (entry) => emotionLabel(entry.emotion)], ["Szabálykövetés", (entry) => ruleLabel(entry.ruleFollowed)],
    ["Megfigyelés", (entry) => entry.observation], ["Hipotézis", (entry) => entry.hypothesis], ["Érvénytelenítés", (entry) => entry.invalidation],
    ["Tanulság", (entry) => entry.lesson],
  ];
  const cell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const rows = [...state.journalEntries].sort((a, b) => String(a.tradedAt).localeCompare(String(b.tradedAt)))
    .map((entry) => columns.map(([, read]) => cell(read(entry))).join(";"));
  downloadFile(`tradecraft-naplo-${localDateKey()}.csv`, `﻿${columns.map(([name]) => cell(name)).join(";")}\r\n${rows.join("\r\n")}`, "text/csv;charset=utf-8");
  showToast("A napló táblázatként letöltve.");
}

export function initJournal() {
  onRender(renderJournal);
  $("#journal-form").addEventListener("submit", submit);
  $("#journal-cancel").addEventListener("click", () => { setFormMode(null); renderJournal(); });
  $("#journal-more").addEventListener("click", () => { limit += 20; renderJournal(); });
  $("#export-csv").addEventListener("click", exportCSV);
  $("#journal-list").addEventListener("click", (event) => {
    const edit = event.target.closest("[data-edit-entry]");
    const remove = event.target.closest("[data-delete-entry]");
    const shot = event.target.closest("[data-shot]");
    if (edit) { setFormMode(state.journalEntries.find((entry) => entry.id === edit.dataset.editEntry)); renderJournal(); }
    else if (remove) removeEntry(remove.dataset.deleteEntry);
    else if (shot) openShot(shot.dataset.shot);
  });
  setFormMode(null);
}
