// A heti terv, az időzített ismétlés, a 6. hónap számításai és a kereső tesztjei.
import test from "node:test";
import assert from "node:assert/strict";
import { addDays, daysBetween, weekStart } from "../dist/js/logic/dates.js";
import { scheduleFor, weekRange, weekProgress } from "../dist/js/logic/schedule.js";
import { REVIEW_INTERVALS, gradeCard, firstDue, dueCards, nextUpcoming } from "../dist/js/logic/review.js";
import { dailyDiscipline, evaluateMock, goNoGo, THRESHOLDS } from "../dist/js/logic/readiness.js";
import { journalStats } from "../dist/js/logic/calc.js";
import { normalize, buildIndex, search } from "../dist/js/logic/search.js";

const near = (actual, expected, tolerance = 1e-6) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);

// ---------- Dátumok ----------

test("dátum: napok hozzáadása hónap- és évhatáron át", () => {
  assert.equal(addDays("2026-10-30", 3), "2026-11-02");
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(daysBetween("2026-10-01", "2026-10-07"), 6);
  assert.equal(daysBetween("2026-10-07", "2026-10-01"), -6);
});

test("dátum: az óraátállítás nem csúsztatja el a napot", () => {
  assert.equal(addDays("2026-10-24", 2), "2026-10-26");
  assert.equal(daysBetween("2026-10-24", "2026-10-26"), 2);
});

test("dátum: a hét hétfővel kezdődik", () => {
  assert.equal(weekStart("2026-10-07"), "2026-10-05");
  assert.equal(weekStart("2026-10-05"), "2026-10-05");
  assert.equal(weekStart("2026-10-11"), "2026-10-05");
});

// ---------- Heti terv ----------

test("heti terv: a hét sorszáma a kezdőnaptól", () => {
  assert.deepEqual(scheduleFor("2026-10-07", "2026-10-07"), { start: "2026-10-07", started: true, week: 1 });
  assert.equal(scheduleFor("2026-10-07", "2026-10-13").week, 1);
  assert.equal(scheduleFor("2026-10-07", "2026-10-14").week, 2);
  assert.equal(scheduleFor("2026-09-21", "2026-10-07").week, 3);
});

test("heti terv: jövőbeli kezdőnapnál még nem indult el", () => {
  const schedule = scheduleFor("2026-10-20", "2026-10-07");
  assert.equal(schedule.started, false);
  assert.equal(schedule.week, 1);
});

test("heti terv: egy hét és egy modul dátumtartománya", () => {
  assert.deepEqual(weekRange("2026-10-07", 1), { from: "2026-10-07", to: "2026-10-13" });
  assert.deepEqual(weekRange("2026-10-07", 1, 4), { from: "2026-10-07", to: "2026-11-03" });
});

test("heti terv: lemaradás, előny és a heti hátralék", () => {
  const lessons = [{ week: 1, complete: true }, { week: 2, complete: false }, { week: 3, complete: false }, { week: 3, complete: true }, { week: 5, complete: true }];
  assert.deepEqual(weekProgress(lessons, { started: true, week: 3 }, 24), { phase: "active", remaining: 2, behind: 1, ahead: 1, left: 1 });
  assert.equal(weekProgress(lessons, { started: false, week: 1 }, 24).phase, "not-started");
  assert.equal(weekProgress(lessons, { started: true, week: 25 }, 24).phase, "finished");
});

// ---------- Időzített ismétlés ----------

test("ismétlés: a tudott kártya egyre ritkábban jön vissza", () => {
  let saved;
  const gaps = [];
  for (let step = 0; step < 7; step += 1) {
    saved = gradeCard(saved, true, "2026-10-07");
    gaps.push(daysBetween("2026-10-07", saved.due));
  }
  assert.deepEqual(gaps, [2, 4, 8, 16, 32, 32, 32]);
  assert.equal(saved.box, REVIEW_INTERVALS.length - 1);
});

test("ismétlés: az elrontott kártya újraindul, és holnap esedékes", () => {
  const saved = gradeCard({ box: 4 }, false, "2026-10-07");
  assert.deepEqual(saved, { box: 0, due: "2026-10-08", seen: "2026-10-07" });
});

test("ismétlés: az új kártya a teljesítés utáni napon esedékes", () => {
  assert.equal(firstDue("2026-10-07"), "2026-10-08");
});

test("ismétlés: esedékes kártyák sorrendje és a következő alkalom", () => {
  const cards = [
    { id: "a", due: "2026-10-07", box: 2 }, { id: "b", due: "2026-10-05", box: 1 },
    { id: "c", due: "2026-10-07", box: 0 }, { id: "d", due: "2026-10-09", box: 0 }, { id: "e", due: "2026-10-09", box: 3 }, { id: "f", due: "2026-10-12", box: 1 },
  ];
  assert.deepEqual(dueCards(cards, "2026-10-07").map((card) => card.id), ["b", "c", "a"]);
  assert.deepEqual(nextUpcoming(cards, "2026-10-07"), { date: "2026-10-09", count: 2 });
  assert.equal(nextUpcoming([], "2026-10-07"), null);
});

// ---------- Napi fegyelem ----------

const trade = (tradedAt, resultR, order = 0, extra = {}) => ({ tradedAt, createdAt: `${tradedAt}T10:0${order}:00Z`, direction: "long", ruleFollowed: "igen", emotion: "nyugodt", setup: "VAL", symbol: "MES", resultR: String(resultR), ...extra });

test("napi fegyelem: a limit elérése nem áthágás, a limit utáni kötés az", () => {
  const entries = [
    trade("2026-10-01", -1, 0), trade("2026-10-01", -1, 1),
    trade("2026-10-02", -1, 0), trade("2026-10-02", -1.2, 1), trade("2026-10-02", 2, 2),
    trade("2026-10-05", 1.5, 0),
  ];
  const result = dailyDiscipline(entries, 2, "2026-10-07");
  assert.equal(result.tradingDays, 3);
  assert.equal(result.limitDays, 2);
  assert.equal(result.breachDays, 1);
  assert.equal(result.lastBreach, "2026-10-02");
  assert.equal(result.cleanDays, 5);
  assert.deepEqual(result.days.map((day) => [day.hitLimit, day.breached]), [[true, false], [true, true], [false, false]]);
});

test("napi fegyelem: áthágás nélkül az első kötés óta számol", () => {
  const result = dailyDiscipline([trade("2026-08-01", 1), trade("2026-08-02", -1)], 2, "2026-10-07");
  assert.equal(result.breachDays, 0);
  assert.equal(result.cleanDays, 67);
});

test("napi fegyelem: a legjobb nap aránya az összprofitból", () => {
  const result = dailyDiscipline([trade("2026-10-01", 3), trade("2026-10-02", 1), trade("2026-10-03", 1)], 2, "2026-10-07");
  near(result.bestDayShare, 60);
  assert.equal(dailyDiscipline([], 2, "2026-10-07").bestDayShare, null);
});

// ---------- Mock evaluation ----------

const CONFIG = { startBalance: 50000, target: 3000, maxDrawdown: 2000, ddType: "eod", dailyLimit: 1000, consistencyPercent: 40, minDays: 5 };
const day = (close, high, low) => ({ date: "2026-10-01", close, high, low });

test("mock: üres körnél folyamatban, teljes mozgástérrel", () => {
  const result = evaluateMock(CONFIG, []);
  assert.equal(result.status, "active");
  assert.equal(result.room, 2000);
});

test("mock: cél, minimális napok és consistency együtt kell a teljesítéshez", () => {
  const steady = [day(700), day(600), day(650), day(550), day(600)];
  const result = evaluateMock(CONFIG, steady);
  assert.equal(result.profit, 3100);
  assert.equal(result.status, "passed");

  const spiky = evaluateMock(CONFIG, [day(2000), day(300), day(300), day(200), day(250)]);
  assert.equal(spiky.targetHit, true);
  assert.equal(spiky.consistencyOk, false);
  assert.equal(spiky.status, "active");
  near(spiky.missingForConsistency, 2000 / 0.4 - 3050);

  assert.equal(evaluateMock(CONFIG, [day(1500), day(1600)]).status, "active");
});

test("mock: a napi limit átlépése bukás, a későbbi napok nem számítanak", () => {
  const result = evaluateMock(CONFIG, [day(500), day(-300, 100, -1100), day(2000), day(2000)]);
  assert.equal(result.status, "failed");
  assert.equal(result.failReason, "daily");
  assert.equal(result.failDay, 2);
  assert.equal(result.profit, 200);
  assert.equal(result.tradedDays, 2);
});

test("mock: az intraday trailing a papírprofit után szigorúbb, mint a nap végi", () => {
  const days = [day(200, 1800, 0), day(-400, 0, -700)];
  assert.equal(evaluateMock({ ...CONFIG, dailyLimit: 0, ddType: "eod" }, days).status, "active");
  const intraday = evaluateMock({ ...CONFIG, dailyLimit: 0, ddType: "intraday" }, days);
  assert.equal(intraday.status, "failed");
  assert.equal(intraday.failReason, "drawdown");
  assert.equal(intraday.failDay, 2);
});

// ---------- Go / No-Go ----------

test("go/no-go: üres adatokkal mind a hét feltétel hiányzik", () => {
  const stats = journalStats([]);
  const result = goNoGo({ stats, discipline: dailyDiscipline([], 2, "2026-10-07"), mocksPassed: 0, manual: {} });
  assert.equal(result.go, false);
  assert.equal(result.missing.length, 7);
});

test("go/no-go: csak akkor Go, ha minden feltétel teljesül", () => {
  // 120 kötés 70 nap alatt, pozitív várható értékkel, szabályosan, kiugró nap nélkül.
  const entries = Array.from({ length: 120 }, (_, index) => trade(addDays("2026-07-20", Math.floor(index / 2)), index % 2 ? 1.5 : -1, index % 2));
  const stats = journalStats(entries);
  const discipline = dailyDiscipline(entries, 2, "2026-10-07");
  const manual = { diligence: { checked: true, evidence: "forrás" }, tax: { checked: true, evidence: "könyvelő" }, money: { checked: true, evidence: "megtakarítás" } };
  assert.ok(stats.count >= THRESHOLDS.minTrades && stats.expectancy > 0);
  assert.ok(discipline.cleanDays >= THRESHOLDS.cleanDays && discipline.bestDayShare <= THRESHOLDS.bestDayShare);

  assert.equal(goNoGo({ stats, discipline, mocksPassed: 1, manual }).go, true);
  assert.deepEqual(goNoGo({ stats, discipline, mocksPassed: 0, manual }).missing, ["mock"]);
  // Pipa bizonyíték nélkül nem számít.
  assert.deepEqual(goNoGo({ stats, discipline, mocksPassed: 1, manual: { ...manual, tax: { checked: true, evidence: " " } } }).missing, ["tax"]);
});

// ---------- Kereső ----------

test("kereső: ékezet és kis-nagybetű nem számít", () => {
  assert.equal(normalize("Kockázat és ÁRSTRUKTÚRA"), "kockazat es arstruktura");
  const index = buildIndex([
    { type: "lesson", title: "Drawdown és napi stop", text: "trailing küszöb" },
    { type: "lesson", title: "Pozícióméretezés matematikája", text: "kockázat és drawdown" },
    { type: "term", title: "Trailing drawdown", detail: "Az egyenleg csúcsát követő küszöb" },
  ]);
  assert.deepEqual(search(index, "DRAWDOWN").map((item) => item.title), ["Drawdown és napi stop", "Trailing drawdown", "Pozícióméretezés matematikája"]);
  assert.deepEqual(search(index, "pozicio").map((item) => item.title), ["Pozícióméretezés matematikája"]);
  assert.equal(search(index, "kockázat drawdown").length, 1);
  assert.equal(search(index, "nincsilyen").length, 0);
  assert.equal(search(index, "   ").length, 0);
});
