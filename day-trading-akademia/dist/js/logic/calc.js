// Tiszta számolófüggvények: nincs DOM, nincs állapot. A laborok és a napló-statisztika erre épül.
// A képletek a tananyag leckéit követik, a tesztadatok a leckék kidolgozott példái.

const sum = (values) => values.reduce((total, value) => total + value, 0);
const mean = (values) => (values.length ? sum(values) / values.length : 0);

// ---------- Kockázat ----------

export function positionSize({ account, riskPercent, entry, stop, unitValue, costPerUnit = 0 }) {
  const distance = Math.abs(entry - stop);
  const valid = [account, riskPercent, entry, stop, unitValue, costPerUnit].every(Number.isFinite)
    && account > 0 && riskPercent > 0 && unitValue > 0 && distance > 0 && costPerUnit >= 0;
  if (!valid) return null;
  const riskBudget = account * riskPercent / 100;
  const unitRisk = distance * unitValue + costPerUnit;
  const size = Math.floor(riskBudget / unitRisk);
  return { riskBudget, distance, unitRisk, size, actualRisk: size * unitRisk };
}

export function expectancy({ winRate, avgWin, avgLoss, cost = 0 }) {
  const valid = [winRate, avgWin, avgLoss, cost].every(Number.isFinite)
    && winRate >= 0 && winRate <= 100 && avgWin >= 0 && avgLoss >= 0 && cost >= 0;
  if (!valid) return null;
  const p = winRate / 100;
  const gross = p * avgWin - (1 - p) * avgLoss;
  const breakEven = avgWin + avgLoss > 0 ? ((avgLoss + cost) / (avgWin + avgLoss)) * 100 : null;
  return { gross, net: gross - cost, breakEven };
}

// A legjobb nap aránya az összprofithoz képest. A küszöb cégenként eltér.
export function consistency({ bestDay, totalProfit, limitPercent, target }) {
  const valid = [bestDay, totalProfit, limitPercent].every(Number.isFinite)
    && bestDay > 0 && totalProfit > 0 && limitPercent > 0 && limitPercent <= 100 && bestDay <= totalProfit;
  if (!valid) return null;
  const limit = limitPercent / 100;
  const share = (bestDay / totalProfit) * 100;
  const requiredTotal = bestDay / limit;
  return {
    share,
    passes: share <= limitPercent + 1e-9,
    requiredTotal,
    missing: Math.max(0, requiredTotal - totalProfit),
    maxDayAtTarget: Number.isFinite(target) && target > 0 ? target * limit : null,
  };
}

// ---------- Drawdown ----------

// Naponként három szám a napi nyitóhoz képest: legmagasabb, legalacsonyabb és záró eredmény.
// Feltevés: napon belül előbb jön a csúcs, utána a mélypont. Ez a trailing küszöbnek a szigorúbb sorrend.
export function drawdown({ startBalance, maxDrawdown, days }) {
  if (![startBalance, maxDrawdown].every(Number.isFinite) || startBalance <= 0 || maxDrawdown <= 0 || !days.length) return null;
  const points = [];
  const thresholds = { static: startBalance - maxDrawdown, eod: startBalance - maxDrawdown, intraday: startBalance - maxDrawdown };
  const breaches = { static: null, eod: null, intraday: null };
  let balance = startBalance;
  let highWater = startBalance;
  let bestClose = startBalance;

  const push = (day, kind, equity) => {
    highWater = Math.max(highWater, equity);
    thresholds.intraday = highWater - maxDrawdown;
    const point = { day, kind, equity, static: thresholds.static, eod: thresholds.eod, intraday: thresholds.intraday };
    Object.keys(breaches).forEach((type) => {
      if (breaches[type] === null && equity <= thresholds[type]) breaches[type] = points.length;
    });
    points.push(point);
  };

  push(0, "start", balance);
  days.forEach((raw, index) => {
    const close = Number(raw.close) || 0;
    const high = Math.max(Number(raw.high) || 0, close, 0);
    const low = Math.min(Number(raw.low) || 0, close, 0);
    push(index + 1, "high", balance + high);
    push(index + 1, "low", balance + low);
    balance += close;
    push(index + 1, "close", balance);
    // A nap végi küszöb csak zárás után lép, ezért a következő ponttól érvényes.
    bestClose = Math.max(bestClose, balance);
    thresholds.eod = bestClose - maxDrawdown;
  });

  const last = points[points.length - 1];
  return {
    points,
    breaches,
    finalThresholds: { ...thresholds },
    room: { static: last.equity - thresholds.static, eod: last.equity - thresholds.eod, intraday: last.equity - thresholds.intraday },
  };
}

// ---------- Volume profile ----------

// A lecke algoritmusa: a POC-ból indulva mindig a bevont tartomány két szomszédja közül a nagyobb kerül be.
// Egyenlőségnél a felső sor. Más platform eltérő szabályt használhat.
export function valueArea(rows, targetPercent = 70) {
  const sorted = rows.filter((row) => Number.isFinite(row.price) && Number.isFinite(row.volume) && row.volume >= 0)
    .slice().sort((a, b) => a.price - b.price);
  const total = sum(sorted.map((row) => row.volume));
  if (!sorted.length || total <= 0) return null;
  let pocIndex = 0;
  sorted.forEach((row, index) => { if (row.volume > sorted[pocIndex].volume) pocIndex = index; });
  const target = total * targetPercent / 100;
  let low = pocIndex;
  let high = pocIndex;
  let included = sorted[pocIndex].volume;
  const steps = [{ type: "poc", index: pocIndex, included }];

  while (included < target && (low > 0 || high < sorted.length - 1)) {
    const below = low > 0 ? sorted[low - 1].volume : null;
    const above = high < sorted.length - 1 ? sorted[high + 1].volume : null;
    const takeAbove = below === null || (above !== null && above >= below);
    if (takeAbove) high += 1; else low -= 1;
    const index = takeAbove ? high : low;
    included += sorted[index].volume;
    steps.push({ type: "add", index, side: takeAbove ? "above" : "below", above, below, included });
  }

  return { rows: sorted, total, target, pocIndex, low, high, included, percent: (included / total) * 100, steps };
}

// ---------- Footprint ----------

// Átlós összehasonlítás: az adott sor askja az eggyel alacsonyabb sor bidjével (vételi),
// az adott sor bidje az eggyel magasabb sor askjával (eladási). Nullával nem osztunk.
export function footprint(rows, { ratio = 3, minVolume = 0 } = {}) {
  const sorted = rows.filter((row) => [row.price, row.bid, row.ask].every(Number.isFinite) && row.bid >= 0 && row.ask >= 0)
    .slice().sort((a, b) => a.price - b.price);
  if (!sorted.length) return null;
  const out = sorted.map((row, index) => {
    const lower = sorted[index - 1];
    const upper = sorted[index + 1];
    const buyRatio = lower && lower.bid > 0 ? row.ask / lower.bid : null;
    const sellRatio = upper && upper.ask > 0 ? row.bid / upper.ask : null;
    return {
      ...row,
      total: row.bid + row.ask,
      delta: row.ask - row.bid,
      buyRatio,
      sellRatio,
      buyImbalance: buyRatio !== null && buyRatio >= ratio && row.ask >= minVolume,
      sellImbalance: sellRatio !== null && sellRatio >= ratio && row.bid >= minVolume,
    };
  });
  const longestRun = (key) => out.reduce((state, row) => {
    const run = row[key] ? state.run + 1 : 0;
    return { run, best: Math.max(state.best, run) };
  }, { run: 0, best: 0 }).best;
  const bid = sum(out.map((row) => row.bid));
  const ask = sum(out.map((row) => row.ask));
  let pocIndex = 0;
  out.forEach((row, index) => { if (row.total > out[pocIndex].total) pocIndex = index; });
  return {
    rows: out,
    bid,
    ask,
    volume: bid + ask,
    delta: ask - bid,
    deltaPercent: bid + ask > 0 ? ((ask - bid) / (bid + ask)) * 100 : 0,
    pocIndex,
    stackedBuy: longestRun("buyImbalance"),
    stackedSell: longestRun("sellImbalance"),
  };
}

// ---------- Napló-statisztika ----------

const hasResult = (entry) => entry.direction !== "no-trade" && entry.resultR !== "" && entry.resultR != null && Number.isFinite(Number(entry.resultR));

function summarize(trades) {
  const results = trades.map((entry) => Number(entry.resultR));
  const wins = results.filter((value) => value > 0);
  const losses = results.filter((value) => value < 0);
  return {
    count: results.length,
    winRate: results.length ? (wins.length / results.length) * 100 : 0,
    avgWin: mean(wins),
    avgLoss: Math.abs(mean(losses)),
    expectancy: mean(results),
    totalR: sum(results),
  };
}

export function journalStats(entries) {
  const ordered = entries.slice().sort((a, b) => String(a.tradedAt).localeCompare(String(b.tradedAt)) || String(a.createdAt).localeCompare(String(b.createdAt)));
  const trades = ordered.filter(hasResult);
  let cumulative = 0;
  let peak = 0;
  let maxDrawdown = 0;
  let streak = 0;
  let maxLossStreak = 0;
  const curve = trades.map((entry, index) => {
    const result = Number(entry.resultR);
    cumulative += result;
    peak = Math.max(peak, cumulative);
    maxDrawdown = Math.max(maxDrawdown, peak - cumulative);
    streak = result < 0 ? streak + 1 : 0;
    maxLossStreak = Math.max(maxLossStreak, streak);
    return { index: index + 1, date: entry.tradedAt, symbol: entry.symbol, setup: entry.setup, result, cumulative };
  });

  const groupBy = (keyOf) => {
    const groups = new Map();
    trades.forEach((entry) => {
      const key = keyOf(entry);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(entry);
    });
    return [...groups.entries()].map(([key, items]) => ({ key, ...summarize(items) })).sort((a, b) => b.count - a.count || b.totalR - a.totalR);
  };

  const followed = ordered.filter((entry) => entry.ruleFollowed === "igen").length;
  const numbers = (field) => trades.map((entry) => Number(entry[field])).filter((value, index) => trades[index][field] !== "" && trades[index][field] != null && Number.isFinite(value));
  return {
    ...summarize(trades),
    entries: ordered.length,
    noTrades: ordered.filter((entry) => entry.direction === "no-trade").length,
    ruleRate: ordered.length ? (followed / ordered.length) * 100 : 0,
    ruleBreakWins: trades.filter((entry) => entry.ruleFollowed !== "igen" && Number(entry.resultR) > 0).length,
    maxLossStreak,
    maxDrawdown,
    avgMae: mean(numbers("mae")),
    avgMfe: mean(numbers("mfe")),
    maeCount: numbers("mae").length,
    curve,
    bySetup: groupBy((entry) => String(entry.setup || "").trim() || "Nincs megadva"),
    byRule: groupBy((entry) => entry.ruleFollowed || "igen"),
    byEmotion: groupBy((entry) => entry.emotion || "nyugodt"),
  };
}
