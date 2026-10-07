// A 6. hónap számításai: napi limit, mock evaluation és a Go/No-Go feltételek.
// A küszöbök a „Go / No-Go döntés” és a „Replay és demo protokoll” leckéből jönnek.
import { daysBetween } from "./dates.js";
import { drawdown } from "./calc.js";

export const THRESHOLDS = { minTrades: 100, ruleRate: 90, cleanDays: 60, bestDayShare: 40, mocksNeeded: 1 };

const hasResult = (entry) => entry.direction !== "no-trade" && entry.resultR !== "" && entry.resultR != null && Number.isFinite(Number(entry.resultR));

// Napi fegyelem. „Limit elérve”: a napi halmozott eredmény elérte a −limitet.
// „Áthágás”: a limit elérése után még született kötés ugyanazon a napon.
export function dailyDiscipline(entries, limitR, todayKey) {
  const byDay = new Map();
  entries.filter(hasResult)
    .slice().sort((a, b) => String(a.tradedAt).localeCompare(String(b.tradedAt)) || String(a.createdAt).localeCompare(String(b.createdAt)))
    .forEach((entry) => {
      if (!byDay.has(entry.tradedAt)) byDay.set(entry.tradedAt, []);
      byDay.get(entry.tradedAt).push(Number(entry.resultR));
    });

  const days = [...byDay.entries()].map(([date, results]) => {
    let running = 0;
    let hitLimit = false;
    let breached = false;
    results.forEach((result) => {
      if (hitLimit) breached = true;
      running += result;
      if (limitR > 0 && running <= -limitR + 1e-9) hitLimit = true;
    });
    return { date, trades: results.length, totalR: running, hitLimit, breached };
  });

  const breaches = days.filter((day) => day.breached);
  const lastBreach = breaches.length ? breaches[breaches.length - 1].date : null;
  const firstDay = days.length ? days[0].date : null;
  const profit = days.reduce((total, day) => total + day.totalR, 0);
  const bestDay = days.reduce((best, day) => Math.max(best, day.totalR), 0);
  return {
    days,
    tradingDays: days.length,
    limitDays: days.filter((day) => day.hitLimit).length,
    breachDays: breaches.length,
    lastBreach,
    // Tiszta napok: az utolsó áthágás óta, vagy ha nem volt, az első kötés óta eltelt naptári napok.
    cleanDays: firstDay ? daysBetween(lastBreach || firstDay, todayKey) : 0,
    bestDayShare: profit > 0 && bestDay > 0 ? (bestDay / profit) * 100 : null,
  };
}

// Mock evaluation. config: { startBalance, target, maxDrawdown, ddType, dailyLimit, consistencyPercent, minDays }
// days: [{ date, high, low, close }] a napi nyitóhoz mért eredmények; a high és a low elhagyható.
export function evaluateMock(config, days) {
  const normalized = days.map((day) => {
    const close = Number(day.close) || 0;
    return { date: day.date, close, high: Math.max(Number(day.high) || 0, close, 0), low: Math.min(Number(day.low) || 0, close, 0) };
  });
  const base = { status: "active", failReason: null, failDay: null, profit: 0, balance: config.startBalance, tradedDays: 0, bestDayShare: null, points: [], threshold: config.startBalance - config.maxDrawdown };
  if (!normalized.length) return { ...base, room: config.maxDrawdown, targetProgress: 0, consistencyOk: true, missingForConsistency: 0 };

  const sim = drawdown({ startBalance: config.startBalance, maxDrawdown: config.maxDrawdown, days: normalized });
  const type = ["static", "eod", "intraday"].includes(config.ddType) ? config.ddType : "eod";
  const breachPoint = sim.breaches[type];
  const drawdownDay = breachPoint === null ? null : sim.points[breachPoint].day;
  const dailyDay = config.dailyLimit > 0 ? normalized.findIndex((day) => day.low <= -config.dailyLimit) + 1 || null : null;

  let failDay = null;
  let failReason = null;
  if (drawdownDay !== null && (dailyDay === null || drawdownDay <= dailyDay)) { failDay = drawdownDay; failReason = "drawdown"; }
  else if (dailyDay !== null) { failDay = dailyDay; failReason = "daily"; }

  // Bukás után a további napok nem számítanak, ahogy élesben sem.
  const counted = failDay === null ? normalized : normalized.slice(0, failDay);
  const profit = counted.reduce((total, day) => total + day.close, 0);
  const bestDay = counted.reduce((best, day) => Math.max(best, day.close), 0);
  const bestDayShare = profit > 0 && bestDay > 0 ? (bestDay / profit) * 100 : null;
  const consistencyOk = !(config.consistencyPercent > 0) || bestDayShare === null || bestDayShare <= config.consistencyPercent + 1e-9;
  const targetHit = profit >= config.target;
  const enoughDays = counted.length >= (config.minDays || 0);
  const lastPoint = sim.points[failDay === null ? sim.points.length - 1 : sim.points.findIndex((point) => point.day === failDay && point.kind === "close")];
  const threshold = failDay === null ? sim.finalThresholds[type] : lastPoint[type];

  return {
    status: failDay !== null ? "failed" : targetHit && enoughDays && consistencyOk ? "passed" : "active",
    failReason,
    failDay,
    profit,
    balance: config.startBalance + profit,
    threshold,
    room: config.startBalance + profit - threshold,
    targetProgress: config.target > 0 ? Math.max(0, Math.min(1, profit / config.target)) : 0,
    tradedDays: counted.length,
    enoughDays,
    targetHit,
    bestDayShare,
    consistencyOk,
    missingForConsistency: consistencyOk || !(config.consistencyPercent > 0) ? 0 : Math.max(0, bestDay / (config.consistencyPercent / 100) - profit),
    points: sim.points.map((point) => ({ day: point.day, kind: point.kind, equity: point.equity, threshold: point[type] })),
    breachPoint: failReason === "drawdown" ? breachPoint : null,
  };
}

// A hét feltétel. Négy az adatokból számolódik, hármat kézzel kell igazolni.
// input: { stats (journalStats), discipline (dailyDiscipline), mocksPassed, manual: { [key]: { checked, evidence } } }
export function goNoGo({ stats, discipline, mocksPassed, manual = {} }) {
  const checked = (key) => Boolean(manual[key]?.checked) && String(manual[key]?.evidence || "").trim().length > 0;
  const criteria = [
    {
      key: "limit",
      auto: true,
      pass: discipline.tradingDays > 0 && discipline.cleanDays >= THRESHOLDS.cleanDays,
      value: discipline.tradingDays ? discipline.cleanDays : null,
    },
    {
      key: "positive",
      auto: true,
      pass: stats.count >= THRESHOLDS.minTrades && stats.expectancy > 0 && (discipline.bestDayShare === null ? false : discipline.bestDayShare <= THRESHOLDS.bestDayShare),
      value: stats.count,
    },
    { key: "rules", auto: true, pass: stats.entries > 0 && stats.ruleRate >= THRESHOLDS.ruleRate, value: stats.entries ? stats.ruleRate : null },
    { key: "mock", auto: true, pass: mocksPassed >= THRESHOLDS.mocksNeeded, value: mocksPassed },
    { key: "diligence", auto: false, pass: checked("diligence") },
    { key: "tax", auto: false, pass: checked("tax") },
    { key: "money", auto: false, pass: checked("money") },
  ];
  const missing = criteria.filter((criterion) => !criterion.pass).map((criterion) => criterion.key);
  return { criteria, go: missing.length === 0, missing };
}
