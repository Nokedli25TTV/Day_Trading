// Dátumkezelés napkulcsokkal ("2026-10-07"). A kulcs mindig helyi nap, nem UTC.

export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const atNoon = (dateKey) => new Date(`${dateKey}T12:00:00`);

export function addDays(dateKey, days) {
  const date = atNoon(dateKey);
  date.setDate(date.getDate() + days);
  return localDateKey(date);
}

export function daysBetween(fromKey, toKey) {
  return Math.round((atNoon(toKey) - atNoon(fromKey)) / 86400000);
}

// A hét hétfővel kezdődik.
export function weekStart(dateKey) {
  const weekday = (atNoon(dateKey).getDay() + 6) % 7;
  return addDays(dateKey, -weekday);
}
