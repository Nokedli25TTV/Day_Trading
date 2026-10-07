// Gyorskereső: ékezet- és kisbetűfüggetlen keresés leckékben, fogalmakban, naplóban és úti célokban.

export function normalize(text) {
  return String(text ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLocaleLowerCase("hu-HU");
}

// items: [{ type, title, detail?, text?, action }]
export function buildIndex(items) {
  return items.map((item) => ({ ...item, _title: normalize(item.title), _text: normalize(`${item.detail || ""} ${item.text || ""}`) }));
}

// Pontozás: címegyezés elején > szó elején > címben bárhol > a szövegben. Minden szónak találnia kell.
export function search(index, query, limit = 12) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return index.map((item) => {
    let score = 0;
    for (const word of words) {
      const at = item._title.indexOf(word);
      if (at === 0) score += 8;
      else if (at > 0 && /[\s(,·:–-]/.test(item._title[at - 1])) score += 5;
      else if (at > 0) score += 3;
      else if (item._text.includes(word)) score += 1;
      else return null;
    }
    return { item, score };
  }).filter(Boolean)
    .sort((a, b) => b.score - a.score || a.item.title.length - b.item.title.length)
    .slice(0, limit)
    .map((result) => result.item);
}
