// Időzített ismétlés: a tudott kártya egyre ritkábban jön vissza, az elrontott újraindul.
import { addDays } from "./dates.js";

// Időközök napban, dobozonként.
export const REVIEW_INTERVALS = [1, 2, 4, 8, 16, 32];

// saved: a kártya eddigi állapota ({ box }) vagy undefined, ha most látod először.
export function gradeCard(saved, known, todayKey) {
  const box = known ? Math.min((saved?.box || 0) + 1, REVIEW_INTERVALS.length - 1) : 0;
  return { box, due: addDays(todayKey, REVIEW_INTERVALS[box]), seen: todayKey };
}

// Új kártya a lecke teljesítése utáni napon esedékes először.
export function firstDue(completedKey) {
  return addDays(completedKey, 1);
}

// A legrégebben esedékes és a legbizonytalanabb kártya kerül előre.
export function dueCards(cards, todayKey) {
  return cards.filter((card) => card.due <= todayKey).sort((a, b) => a.due.localeCompare(b.due) || a.box - b.box);
}

export function nextUpcoming(cards, todayKey) {
  const upcoming = cards.filter((card) => card.due > todayKey).sort((a, b) => a.due.localeCompare(b.due));
  if (!upcoming.length) return null;
  return { date: upcoming[0].due, count: upcoming.filter((card) => card.due === upcoming[0].due).length };
}
