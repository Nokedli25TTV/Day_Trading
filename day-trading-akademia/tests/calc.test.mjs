// A számolófüggvények ellenőrzése a leckék kidolgozott példáival.
// Futtatás: node day-trading-akademia/tests/calc.test.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const window = {};
new Function("window", readFileSync(fileURLToPath(new URL("../dist/calc.js", import.meta.url)), "utf8"))(window);
const calc = window.TRADECRAFT_CALC;
const near = (actual, expected, tolerance = 1e-6) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);
let passed = 0;
const test = (name, run) => { run(); passed += 1; console.log(`ok  ${name}`); };

test("pozícióméret: MES, 8 tickes stop, 25 USD keret (Pozícióméretezés lecke)", () => {
  const result = calc.positionSize({ account: 5000, riskPercent: 0.5, entry: 5100, stop: 5098, unitValue: 5, costPerUnit: 3.25 });
  near(result.riskBudget, 25);
  near(result.unitRisk, 13.25);
  assert.equal(result.size, 1);
});

test("pozícióméret: tickérték 2, stop 7 tick, jutalék 3, tartalék 1 tick, keret 50", () => {
  const result = calc.positionSize({ account: 5000, riskPercent: 1, entry: 100, stop: 93, unitValue: 2, costPerUnit: 5 });
  near(result.unitRisk, 19);
  assert.equal(result.size, 2);
});

test("pozícióméret: érvénytelen bemenetre null", () => {
  assert.equal(calc.positionSize({ account: 1000, riskPercent: 1, entry: 10, stop: 10, unitValue: 1 }), null);
});

test("várható érték: 40%, 1,8R, 1R, 0,15R költség (Várható érték lecke)", () => {
  const result = calc.expectancy({ winRate: 40, avgWin: 1.8, avgLoss: 1, cost: 0.15 });
  near(result.gross, 0.12);
  near(result.net, -0.03);
  near(result.breakEven, 41.0714, 1e-3);
});

test("várható érték: 45%, 1,6R, 1R, 0,10R költség", () => {
  near(calc.expectancy({ winRate: 45, avgWin: 1.6, avgLoss: 1, cost: 0.1 }).net, 0.07);
});

test("consistency: 1800 USD legjobb nap, 40%-os küszöb (Consistency lecke)", () => {
  const result = calc.consistency({ bestDay: 1800, totalProfit: 3000, limitPercent: 40, target: 3000 });
  near(result.share, 60);
  assert.equal(result.passes, false);
  near(result.requiredTotal, 4500);
  near(result.missing, 1500);
  near(result.maxDayAtTarget, 1200);
});

test("drawdown: az intraday trailing követi a nyitott csúcsot (Drawdown lecke)", () => {
  const result = calc.drawdown({ startBalance: 50000, maxDrawdown: 2000, days: [{ high: 800, low: 0, close: 200 }] });
  assert.equal(result.finalThresholds.static, 48000);
  assert.equal(result.finalThresholds.eod, 48200);
  assert.equal(result.finalThresholds.intraday, 48800);
  // 600 USD mozgástér veszett el egy nyereséggel zárt napon.
  near(result.room.eod - result.room.intraday, 600);
  assert.deepEqual(result.breaches, { static: null, eod: null, intraday: null });
});

test("drawdown: csak az intraday küszöb sérül, ha a papírprofit visszaesik", () => {
  const result = calc.drawdown({ startBalance: 50000, maxDrawdown: 2000, days: [{ high: 1500, low: -700, close: -400 }] });
  assert.equal(result.breaches.static, null);
  assert.equal(result.breaches.eod, null);
  assert.equal(result.points[result.breaches.intraday].kind, "low");
});

test("value area: POC 100,50, VAL 100,25, VAH 100,75, 73% (Volume profile lecke)", () => {
  const rows = [[100, 60], [100.25, 180], [100.5, 320], [100.75, 230], [101, 140], [101.25, 70]].map(([price, volume]) => ({ price, volume }));
  const result = calc.valueArea(rows, 70);
  assert.equal(result.total, 1000);
  assert.equal(result.rows[result.pocIndex].price, 100.5);
  assert.equal(result.rows[result.low].price, 100.25);
  assert.equal(result.rows[result.high].price, 100.75);
  near(result.percent, 73);
  assert.deepEqual(result.steps.map((step) => step.included), [320, 550, 730]);
});

test("value area: a 40%-os cél a POC-kal és egy sorral 55% (Volume profile lecke)", () => {
  const rows = [[100, 60], [100.25, 180], [100.5, 320], [100.75, 230], [101, 140], [101.25, 70]].map(([price, volume]) => ({ price, volume }));
  near(calc.valueArea(rows, 40).percent, 55);
});

test("footprint: delta +490, négy halmozott vételi imbalance (Footprint lecke)", () => {
  const rows = [[100, 40, 10], [100.25, 60, 180], [100.5, 50, 220], [100.75, 30, 170], [101, 20, 100], [101.25, 15, 25]].map(([price, bid, ask]) => ({ price, bid, ask }));
  const result = calc.footprint(rows, { ratio: 3, minVolume: 100 });
  assert.equal(result.volume, 920);
  assert.equal(result.delta, 490);
  near(result.deltaPercent, 53.2609, 1e-3);
  assert.equal(result.rows[result.pocIndex].price, 100.5);
  near(result.rows[1].buyRatio, 4.5);
  assert.equal(result.stackedBuy, 4);
  assert.equal(result.rows[5].buyImbalance, false);
});

test("footprint: nulla nevezőnél nincs arány", () => {
  const result = calc.footprint([{ price: 1, bid: 0, ask: 5 }, { price: 2, bid: 3, ask: 50 }]);
  assert.equal(result.rows[1].buyRatio, null);
  assert.equal(result.rows[1].buyImbalance, false);
});

test("napló-statisztika: R-ek, sorozat, szabálykövetés", () => {
  const entry = (tradedAt, resultR, extra = {}) => ({ tradedAt, createdAt: tradedAt, symbol: "MES", setup: "VAL", direction: "long", ruleFollowed: "igen", emotion: "nyugodt", resultR, ...extra });
  const stats = calc.journalStats([
    entry("2026-10-01", "1.8"),
    entry("2026-10-02", "-1.2"),
    entry("2026-10-03", "-1", { ruleFollowed: "nem", setup: "Kitörés" }),
    entry("2026-10-04", "0.52", { ruleFollowed: "reszben" }),
    entry("2026-10-05", "", { direction: "no-trade" }),
  ]);
  assert.equal(stats.count, 4);
  assert.equal(stats.entries, 5);
  assert.equal(stats.noTrades, 1);
  near(stats.winRate, 50);
  near(stats.totalR, 0.12);
  near(stats.expectancy, 0.03);
  near(stats.avgWin, 1.16);
  near(stats.avgLoss, 1.1);
  assert.equal(stats.maxLossStreak, 2);
  near(stats.maxDrawdown, 2.2);
  near(stats.ruleRate, 60);
  assert.equal(stats.ruleBreakWins, 1);
  assert.equal(stats.bySetup[0].key, "VAL");
  assert.equal(stats.curve.at(-1).index, 4);
});

console.log(`\n${passed} teszt rendben.`);
