// Az alkalmazás állapota: egyetlen objektum a localStorage-ben.
// A nézetek az `state`-ből olvasnak, módosítás után `commit()`-ot hívnak: mentés + újrarajzolás.
import { localDateKey } from "./logic/dates.js";
import { showToast } from "./toast.js";
import { defaultRulebook, normalizeRulebook } from "./logic/rulebook.js";

export const STORAGE_KEY = new URLSearchParams(location.search).has("qa")
  ? "tradecraft-academy-qa-v1"
  : "tradecraft-academy-v1";

// Új mezőt ide ÉS a normalizeState()-be is fel kell venni, különben a régi mentések eltörnek.
export function createDefaultState() {
  return {
    schemaVersion: 1,
    profile: {
      experience: "kezdo",
      dailyGoal: 30,
      dailyLimitR: 2,
      startDate: localDateKey(),
      lastExportAt: null,
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
    weeklyReviews: [],
    readiness: {},
    rulebook: defaultRulebook(),
    preChecks: {},
    mocks: [],
    settings: { reducedMotion: false, theme: "system" },
  };
}

// Régi vagy importált mentés kiegészítése a hiányzó mezőkkel.
export function normalizeState(parsed) {
  const fallback = createDefaultState();
  const object = (value) => (value && typeof value === "object" && !Array.isArray(value) ? value : {});
  const list = (value) => (Array.isArray(value) ? value : []);
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
    quizAttempts: list(parsed.quizAttempts),
    journalEntries: list(parsed.journalEntries),
    questions: list(parsed.questions),
    activityDates: list(parsed.activityDates),
    reviews: object(parsed.reviews),
    studyLog: object(parsed.studyLog),
    weeklyReviews: list(parsed.weeklyReviews),
    readiness: object(parsed.readiness),
    rulebook: normalizeRulebook(parsed.rulebook),
    preChecks: object(parsed.preChecks),
    mocks: list(parsed.mocks),
  };
}

export let storageRecovered = false;

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

// Az objektum maga állandó, csak a tartalma cserélődik: így minden modul ugyanazt látja.
export const state = loadState();

export function replaceState(next) {
  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, next);
}

const renderers = [];
const saveListeners = [];

export const onRender = (render) => renderers.push(render);
export const onSave = (listener) => saveListeners.push(listener);
export const refresh = () => renderers.forEach((render) => render());

// Csendes írás, visszajelzés nélkül (például a tanulási idő számlálójához).
export function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function save(message = "Helyben mentve") {
  state.profile.updatedAt = new Date().toISOString();
  const saved = persist();
  const indicator = document.querySelector("#save-state");
  if (indicator) {
    indicator.classList.toggle("error", !saved);
    indicator.replaceChildren(Object.assign(document.createElement("span"), { ariaHidden: "true" }), ` ${saved ? message : "A mentés sikertelen"}`);
  }
  if (!saved) showToast("A böngésző nem tudta menteni az adatokat. Exportáld őket biztonsági másolatként.", true);
  else saveListeners.forEach((listener) => listener());
  return saved;
}

export function commit(message) {
  save(message);
  refresh();
}

export function recordActivity() {
  const today = localDateKey();
  if (!state.activityDates.includes(today)) state.activityDates.push(today);
}

export function getStreak() {
  const dates = new Set(state.activityDates);
  if (!dates.size) return 0;
  const cursor = new Date();
  if (!dates.has(localDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (dates.has(localDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
