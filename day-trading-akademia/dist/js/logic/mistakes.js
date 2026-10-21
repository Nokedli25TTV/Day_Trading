// A hibafüzet tiszta állapotkezelése. A nézetek új objektumot kapnak vissza, így könnyű tesztelni.

const object = (value) => (value && typeof value === "object" && !Array.isArray(value) ? value : {});
const items = (book) => Object.values(object(book)).filter((item) => item && typeof item === "object" && item.id && item.question && item.correctAnswer);

export function recordMistake(book, item, now = new Date().toISOString()) {
  if (!item?.id || !item.question || !item.correctAnswer) throw new Error("Hiányos hibafüzet-bejegyzés.");
  const current = object(book);
  const previous = object(current[item.id]);
  return {
    ...current,
    [item.id]: {
      ...previous,
      ...item,
      id: String(item.id),
      wrongCount: (Number(previous.wrongCount) || 0) + 1,
      firstWrongAt: previous.firstWrongAt || now,
      lastWrongAt: now,
      resolvedAt: null,
    },
  };
}

export function setMistakeResolved(book, id, resolved, now = new Date().toISOString()) {
  const current = object(book);
  if (!current[id]) return current;
  return { ...current, [id]: { ...current[id], resolvedAt: resolved ? now : null } };
}

export function mistakeList(book, filter = "active") {
  return items(book)
    .filter((item) => filter === "all" || (filter === "resolved" ? item.resolvedAt : !item.resolvedAt))
    .sort((a, b) => Number(Boolean(a.resolvedAt)) - Number(Boolean(b.resolvedAt)) || String(b.lastWrongAt).localeCompare(String(a.lastWrongAt)));
}

export function mistakeSummary(book) {
  const valid = items(book);
  const active = valid.filter((item) => !item.resolvedAt).length;
  return { total: valid.length, active, resolved: valid.length - active };
}
