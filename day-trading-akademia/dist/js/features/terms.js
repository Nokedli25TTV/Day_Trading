// Kattintható fogalmak a leckeszövegben: az első előfordulás gombbá válik, a magyarázat felugró kártyán jelenik meg.
import { GLOSSARY } from "../../content/fogalomtar.js";
import { getLesson } from "../lessons.js";
import { $, escapeHTML } from "../util.js";

// Túl általános szavak, amelyeket nem érdemes mindenhol kiemelni.
const SKIP = new Set(["point", "reset", "bid", "ask", "fill"]);
// Magyar szótövek a leggyakoribb fogalmakhoz: a ragozott alakok is találnak.
const HUNGARIAN_STEMS = {
  "likviditás": "Liquidity",
  "tőkeáttétel": "Leverage",
  "abszorpció": "Absorption",
  "kifáradás": "Exhaustion",
  "sikertelen kitörés": "Failed breakout",
  "várható érték": "Expectancy",
  "beszorult keresked": "Trapped traders",
};

const exact = new Map();
const stems = new Map();
GLOSSARY.forEach(([term], index) => {
  const inner = [...term.matchAll(/\(([^)]+)\)/g)].map((match) => match[1]);
  [...term.replace(/\([^)]*\)/g, "").split(","), ...inner]
    .map((alias) => alias.trim().toLocaleLowerCase("hu-HU"))
    .filter((alias) => alias.length >= 3 && !SKIP.has(alias))
    .forEach((alias) => { if (!exact.has(alias)) exact.set(alias, index); });
});
Object.entries(HUNGARIAN_STEMS).forEach(([stem, term]) => {
  const index = GLOSSARY.findIndex(([name]) => name === term);
  if (index >= 0) stems.set(stem, index);
});

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const alternatives = (map) => [...map.keys()].sort((a, b) => b.length - a.length).map(escapeRegExp).join("|");
const PATTERN = new RegExp(`(?<![\\p{L}\\p{N}])(?:(${alternatives(exact)})(?![\\p{L}\\p{N}])|(${alternatives(stems)})\\p{L}*)`, "giu");

// html: már escape-elt szöveg, legfeljebb <strong> címkékkel. used: az ebben a leckében már kiemelt fogalmak.
export function linkTerms(html, used) {
  return html.split(/(<[^>]+>)/).map((part) => {
    if (part.startsWith("<")) return part;
    return part.replace(PATTERN, (match, exactAlias, stem) => {
      const index = exactAlias ? exact.get(exactAlias.toLocaleLowerCase("hu-HU")) : stems.get(stem.toLocaleLowerCase("hu-HU"));
      if (index === undefined || used.has(index)) return match;
      used.add(index);
      return `<button class="term" type="button" data-term="${index}">${match}</button>`;
    });
  }).join("");
}

function showTerm(button) {
  const popover = $("#term-popover");
  const [term, definition, lessonId] = GLOSSARY[Number(button.dataset.term)];
  const lesson = getLesson(lessonId);
  popover.innerHTML = `<strong>${escapeHTML(term)}</strong><p>${escapeHTML(definition)}</p>${lesson ? `<button class="text-button" type="button" data-open-lesson="${lesson.id}">${lesson.globalIndex}. lecke: ${escapeHTML(lesson.title)}</button>` : ""}`;
  popover.showPopover();
  // A kártya a szó alá kerül, a képernyő szélein belül tartva.
  const anchor = button.getBoundingClientRect();
  const left = Math.max(12, Math.min(anchor.left, window.innerWidth - popover.offsetWidth - 12));
  const below = anchor.bottom + 8;
  const top = below + popover.offsetHeight > window.innerHeight - 12 ? anchor.top - popover.offsetHeight - 8 : below;
  popover.style.left = `${left}px`;
  popover.style.top = `${Math.max(12, top)}px`;
}

export function initTerms() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest(".term");
    if (button) showTerm(button);
    else if (event.target.closest("#term-popover [data-open-lesson]")) $("#term-popover").hidePopover();
  });
}
