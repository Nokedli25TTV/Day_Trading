// Közös segédfüggvények: DOM-elérés, formázás, dátum, apróságok.
import { localDateKey, addDays, daysBetween, weekStart } from "./logic/dates.js";

export { localDateKey, addDays, daysBetween, weekStart };

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = value;
}

// A sávok transform-mal nőnek, nem szélességgel.
export function setMeter(selector, ratio) {
  const bar = $(selector);
  if (bar) bar.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio || 0))})`;
}

export function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character]);
}

// A tartalomban a **kiemelés** az egyetlen megengedett jelölés.
export function formatInline(value) {
  return escapeHTML(value).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

export function formatNumber(value, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("hu-HU", { maximumFractionDigits }).format(value);
}

export function signed(value, digits = 2) {
  return `${value > 0 ? "+" : value < 0 ? "−" : ""}${formatNumber(Math.abs(value), digits)}`;
}

export const signedR = (value, digits = 2) => `${signed(value, digits)}R`;

export const hasNumber = (value) => value !== "" && value != null && Number.isFinite(Number(value));

// Az időbélyegek UTC-ben tárolódnak, a „ma” viszont helyi nap.
export function isToday(timestamp) {
  return Boolean(timestamp) && localDateKey(new Date(timestamp)) === localDateKey();
}

export function shortDate(dateKey) {
  return new Intl.DateTimeFormat("hu-HU", { month: "short", day: "numeric" }).format(new Date(`${dateKey}T12:00:00`));
}

export function formatDate(value) {
  if (!value) return "–";
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
  return new Intl.DateTimeFormat("hu-HU", { year: "numeric", month: "short", day: "numeric" }).format(date);
}

export function capitalize(text) {
  return text.charAt(0).toLocaleUpperCase("hu-HU") + text.slice(1);
}

export function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

export function hashText(text) {
  let hash = 5381;
  for (const character of text) hash = ((hash << 5) + hash + character.codePointAt(0)) >>> 0;
  return hash.toString(36);
}

export function uid() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function debounce(run, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => run(...args), delay);
  };
}

export function formObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

export function formNumbers(form) {
  return Object.fromEntries([...new FormData(form).entries()].map(([key, value]) => [key, String(value).trim() === "" ? NaN : Number(value)]));
}

export function downloadFile(name, content, type) {
  const url = URL.createObjectURL(content instanceof Blob ? content : new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// Eredménysorok a kalkulátorokhoz: [{ label, value, className }].
export function resultRowsHTML(rows) {
  return `<dl class="result-list">${rows.map((row) => `<div class="${row.className || ""}"><dt>${row.label}</dt><dd>${row.value}</dd></div>`).join("")}</dl>`;
}
