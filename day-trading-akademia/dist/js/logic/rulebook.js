// Szabálykönyv és kereskedés előtti ellenőrzőlista: alapértékek és tiszta számítások.
// Az alapszöveg a „Consistency rule és az egyoldalas szabálykönyv” és a „Ha–akkor végrehajtási terv” leckéből jön.

let counter = 0;
const item = (fields) => ({ id: `alap-${(counter += 1)}`, ...fields });

export function defaultRulebook() {
  counter = 0;
  return {
    rules: [
      item({ text: "Kötésenként legfeljebb 0,5% kockázat, a méret mindig a stopból jön." }),
      item({ text: "Napi veszteséglimit: 2R. Ha elérem, aznap nem nyitok több pozíciót." }),
      item({ text: "Csak a leírt setupot kötöm, teljes feltételekkel." }),
      item({ text: "A stopot nem tágítom, a célt nem írom át menet közben." }),
      item({ text: "Naponta legfeljebb három kötés." }),
    ],
    ifThen: [
      item({ when: "két vesztes kötés jön egymás után", then: "bezárom a platformot, és 30 percig nem nyitom meg" }),
      item({ when: "a profitcél 80%-ánál járok", then: "a méretem változatlan marad" }),
      item({ when: "a setup nem teljes", then: "képernyőkép készül, kötés nem" }),
      item({ when: "kimarad egy jó mozgás", then: "felírom a naplóba, és nem ugrok utána" }),
    ],
    checklist: [
      item({ text: "Megvan a napi terv és a kijelölt szintek." }),
      item({ text: "Tudom a kötésenkénti kockázatomat és a napi limitemet." }),
      item({ text: "Tudom, mikor jön nagy hír, és addig nem kötök." }),
      item({ text: "Nyugodt vagyok, nem akarok visszaszerezni semmit." }),
    ],
  };
}

// Hiányos vagy régi mentés kiegészítése: mindhárom lista tömb legyen.
export function normalizeRulebook(value) {
  const fallback = defaultRulebook();
  if (!value || typeof value !== "object") return fallback;
  const list = (name) => (Array.isArray(value[name]) ? value[name].filter((entry) => entry && entry.id) : fallback[name]);
  return { rules: list("rules"), ifThen: list("ifThen"), checklist: list("checklist") };
}

// Kész a mai ellenőrzés, ha a lista minden pontja ki van pipálva. Üres lista nem zár.
export function checklistComplete(checklist, checkedIds = []) {
  return checklist.every((entry) => checkedIds.includes(entry.id));
}

// Melyik szabályt hányszor szegted meg a naplóbejegyzések szerint, gyakoriság szerint rendezve.
export function brokenRuleCounts(entries, rules) {
  const counts = new Map();
  entries.forEach((entry) => (entry.brokenRules || []).forEach((id) => counts.set(id, (counts.get(id) || 0) + 1)));
  return rules.map((rule) => ({ rule, count: counts.get(rule.id) || 0 })).filter((row) => row.count > 0).sort((a, b) => b.count - a.count);
}
