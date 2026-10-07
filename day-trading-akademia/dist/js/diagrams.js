// Ábrák a leckékhez és a laborokhoz. A számokat mindig a calc.js adja, az ábra csak megjeleníti.
import { valueArea, footprint, drawdown } from "./logic/calc.js";
import { lineChart, legend } from "./charts.js";
import { $$, formatNumber, signed } from "./util.js";

const fixed = (value, digits = 2) => new Intl.NumberFormat("hu-HU", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);

// ---------- Volume profile ----------

// Sávok árszintenként, magasabb ár felül. A value area sorai színesek, a többi semleges.
export function profileHTML(result) {
  const max = Math.max(...result.rows.map((row) => row.volume));
  return result.rows.map((row, index) => ({ row, index })).reverse().map(({ row, index }) => {
    const inside = index >= result.low && index <= result.high;
    const tags = [index === result.pocIndex ? "POC" : "", index === result.high ? "VAH" : "", index === result.low ? "VAL" : ""].filter(Boolean).join(" · ");
    const share = `${formatNumber((row.volume / result.total) * 100, 1)}%`;
    return `<div class="profile-row${inside ? " is-in" : ""}${index === result.pocIndex ? " is-poc" : ""}" title="${fixed(row.price)}: ${formatNumber(row.volume, 0)} kontraktus, ${share}">
      <span class="profile-row__price">${fixed(row.price)}</span>
      <span class="profile-row__track"><i style="width: ${Math.max(1, (row.volume / max) * 100)}%"></i></span>
      <span class="profile-row__value">${formatNumber(row.volume, 0)}${tags ? `<small>${tags}</small>` : ""}</span>
    </div>`;
  }).join("");
}

// ---------- Drawdown ----------

export const DRAWDOWN_TYPES = [
  { key: "static", label: "Statikus", short: "Statikus", color: "var(--series-1)" },
  { key: "eod", label: "Nap végi trailing", short: "Nap végi", color: "var(--series-2)" },
  { key: "intraday", label: "Intraday trailing", short: "Intraday", color: "var(--series-3)" },
];
const KIND_LABEL = { start: "kezdés", high: "napi csúcs", low: "napi mélypont", close: "zárás" };

export const pointLabel = (point) => (point.day === 0 ? "Kezdés" : `${point.day}. nap, ${KIND_LABEL[point.kind]}`);

// Egyenleg és küszöbök egy diagramon. types: a kirajzolandó küszöbtípusok.
export function drawdownChart(container, legendContainer, result, types = DRAWDOWN_TYPES, height = 300) {
  if (!container.clientWidth) return;
  const { points } = result;
  // A nap végi küszöb zárás után lép: a zárás pontján dupla csúcsponttal rajzolunk lépcsőt.
  const eodVertices = points.flatMap((point, index) => {
    const next = points[index + 1] ? points[index + 1].eod : result.finalThresholds.eod;
    return point.kind === "close" && next !== point.eod ? [{ x: index, y: point.eod }, { x: index, y: next }] : [{ x: index, y: point.eod }];
  });
  const series = [
    { label: "Egyenleg", color: "var(--text)", values: points.map((point) => point.equity), endLabel: "Egyenleg" },
    ...types.map((type) => ({
      label: type.label,
      color: type.color,
      values: points.map((point) => point[type.key]),
      vertices: type.key === "eod" ? eodVertices : undefined,
      endLabel: type.short,
    })),
  ];
  if (legendContainer) legend(legendContainer, series);
  lineChart(container, {
    count: points.length,
    series,
    xTicks: points.map((point, index) => ({ point, index })).filter(({ point }) => point.kind === "close").map(({ point, index }) => ({ x: index, label: `${point.day}. nap` })),
    markers: types.filter((type) => result.breaches[type.key] !== null).map((type) => ({ x: result.breaches[type.key], y: points[result.breaches[type.key]].equity, color: type.color })),
    formatY: (value) => formatNumber(value, 0),
    ariaLabel: "Egyenleg és a drawdown-küszöbök alakulása napról napra. A nyílbillentyűkkel léptethető.",
    height,
    tooltip: (index) => ({
      title: pointLabel(points[index]),
      rows: series.map((item) => ({ color: item.color, label: item.label, value: formatNumber(item.values[index], 0) })),
    }),
  });
}

// ---------- Leckeábrák ----------

// A „Hogyan jön létre egy kötés?” példája: 60 kontraktusos vétel három eladási szinten.
function orderBook(container) {
  const asks = [[100.75, 80, 10], [100.5, 30, 30], [100.25, 20, 20]];
  const bids = [[100, 45], [99.75, 60]];
  const max = 80;
  const row = (side, price, size, taken = 0) => `<div class="book-row book-row--${side}">
    <span class="book-row__side">${side === "ask" ? "Eladó" : "Vevő"}</span>
    <span class="book-row__price">${fixed(price)}</span>
    <span class="book-row__track"><i style="width: ${(size / max) * 100}%">${taken ? `<b style="width: ${(taken / size) * 100}%"></b>` : ""}</i></span>
    <span class="book-row__size">${taken ? `${size} → ${size - taken}` : size}</span>
  </div>`;
  container.innerHTML = `<div class="book" role="img" aria-label="Ajánlati könyv: a vétel 20-at visz el 100,25-ön, 30-at 100,50-en és 10-et 100,75-ön">
    ${asks.map(([price, size, taken]) => row("ask", price, size, taken)).join("")}
    <div class="book-row book-row--spread"><span></span><span>spread</span><span></span><span></span></div>
    ${bids.map(([price, size]) => row("bid", price, size)).join("")}
  </div>
  <p class="diagram__key"><i class="book-key"></i> a 60 kontraktusos vétel által elfogyasztott mennyiség</p>`;
}

// Emelkedő, majd megforduló struktúra a csúcsok és mélypontok nevével.
function structure(container) {
  const width = Math.max(280, Math.round(container.clientWidth));
  const height = 200;
  const pad = { x: 26, top: 26, bottom: 30 };
  const swings = [[0, 20, ""], [1, 46, "HH"], [2, 32, "HL"], [3, 64, "HH"], [4, 50, "HL"], [5, 80, "HH"], [6, 58, ""], [7, 70, "LH"], [8, 40, "LL"], [9, 52, "LH"], [10, 26, "LL"]];
  const x = (index) => pad.x + (index / (swings.length - 1)) * (width - pad.x * 2);
  const y = (value) => pad.top + (1 - (value - 20) / 60) * (height - pad.top - pad.bottom);
  const path = swings.map(([index, value], step) => `${step ? "L" : "M"}${x(index).toFixed(1)} ${y(value).toFixed(1)}`).join("");
  const turn = x(5.5);
  container.innerHTML = `<svg class="chart" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Árstruktúra: magasabb csúcsok és mélypontok sorozata, majd alacsonyabb csúcsok és mélypontok">
    <line class="chart-grid" x1="${turn}" x2="${turn}" y1="${pad.top - 12}" y2="${height - pad.bottom + 6}"></line>
    <text class="chart-tick" x="${x(2.5)}" y="${height - 8}" text-anchor="middle">emelkedő struktúra</text>
    <text class="chart-tick" x="${x(8)}" y="${height - 8}" text-anchor="middle">csökkenő struktúra</text>
    <path class="chart-line" style="--c: var(--text)" d="${path}"></path>
    ${swings.filter(([, , label]) => label).map(([index, value, label]) => {
      const high = label.startsWith("H") && label !== "HL" ? true : label === "LH";
      return `<circle class="chart-dot" style="--c: var(--series-1)" cx="${x(index)}" cy="${y(value)}" r="4.5"></circle><text class="chart-end-label" x="${x(index)}" y="${y(value) + (high ? -11 : 20)}" text-anchor="middle">${label}</text>`;
    }).join("")}
  </svg>`;
}

function profile(container) {
  const rows = [[100, 60], [100.25, 180], [100.5, 320], [100.75, 230], [101, 140], [101.25, 70]].map(([price, volume]) => ({ price, volume }));
  container.innerHTML = `<div class="profile" role="img" aria-label="Volume profile hat ársorral: POC 100,50, value area 100,25 és 100,75 között">${profileHTML(valueArea(rows, 70))}</div>`;
}

// A Footprint lecke gyertyája: bid × ask cellák, kiemelt átlós imbalance-ekkel.
function footprintFigure(container) {
  const rows = [[100, 40, 10], [100.25, 60, 180], [100.5, 50, 220], [100.75, 30, 170], [101, 20, 100], [101.25, 15, 25]].map(([price, bid, ask]) => ({ price, bid, ask }));
  const result = footprint(rows, { ratio: 3, minVolume: 100 });
  container.innerHTML = `<div class="fp" role="img" aria-label="Footprint gyertya: négy egymást követő vételi imbalance 100,25 és 101,00 között, delta +490">
    <div class="fp-row fp-row--head"><span>Ár</span><span>Bid</span><span></span><span>Ask</span><span>Delta</span></div>
    ${result.rows.slice().reverse().map((row, reversed) => {
      const index = result.rows.length - 1 - reversed;
      return `<div class="fp-row${index === result.pocIndex ? " is-poc" : ""}"><span class="fp-price">${fixed(row.price)}</span><span class="fp-cell${row.sellImbalance ? " is-bad" : ""}">${row.bid}</span><span class="fp-x">×</span><span class="fp-cell${row.buyImbalance ? " is-good" : ""}">${row.ask}</span><span class="fp-delta">${signed(row.delta, 0)}</span></div>`;
    }).join("")}
  </div>
  <p class="diagram__key"><i class="fp-key"></i> vételi imbalance: az ask legalább háromszorosa az eggyel alacsonyabb sor bidjének</p>`;
}

function drawdownTypes(container) {
  const result = drawdown({ startBalance: 50000, maxDrawdown: 2000, days: [[400, -100, 300], [1500, -200, 200], [300, -600, -400], [200, -700, -500], [500, -100, 400]].map(([high, low, close]) => ({ high, low, close })) });
  if (!container.querySelector(".chart-box")) container.innerHTML = '<div class="chart-legend"></div><div class="chart-box"></div>';
  drawdownChart(container.querySelector(".chart-box"), container.querySelector(".chart-legend"), result, DRAWDOWN_TYPES, 260);
}

const DIAGRAMS = { "order-book": orderBook, structure, profile, footprint: footprintFigure, "drawdown-types": drawdownTypes };

// A szélességfüggő ábrákhoz látható konténer kell: nézetváltás és átméretezés után hívd.
export function renderDiagrams(root = document) {
  $$("[data-diagram]", root).forEach((figure) => {
    const canvas = figure.querySelector(".diagram__canvas");
    if (canvas?.clientWidth) DIAGRAMS[figure.dataset.diagram]?.(canvas);
  });
}
