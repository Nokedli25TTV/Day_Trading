// Napló-statisztika: kulcsszámok, R-görbe, napi fegyelem és bontások.
import { state, onRender } from "../store.js";
import { journalStats } from "../logic/calc.js";
import { dailyDiscipline } from "../logic/readiness.js";
import { lineChart } from "../charts.js";
import { getCurrentView, onViewShown } from "../router.js";
import { currentTab, onTab } from "../tabs.js";
import { emotionLabel, ruleGroupLabel } from "../labels.js";
import { $, $$, setText, escapeHTML, formatNumber, formatDate, signedR, capitalize, debounce, localDateKey } from "../util.js";

let mode = "all";
const visible = () => getCurrentView() === "naplo" && currentTab("journal") === "stats";
const tone = (value) => (value > 0 ? "is-good" : value < 0 ? "is-bad" : "");
const figuresHTML = (figures) => figures.map(([label, value, className = ""]) => `<div><dt>${label}</dt><dd class="${className}">${value}</dd></div>`).join("");

function renderCurve(stats) {
  const container = $("#stats-curve");
  if (!container.clientWidth) return;
  const { curve } = stats;
  const color = "var(--series-1)";
  const step = Math.max(1, Math.ceil(curve.length / 6));
  const ticks = [];
  for (let index = 0; index <= curve.length; index += step) ticks.push(index);
  if (curve.length - ticks[ticks.length - 1] > step / 2) ticks.push(curve.length); else ticks[ticks.length - 1] = curve.length;
  lineChart(container, {
    count: curve.length + 1,
    series: [{ label: "Halmozott eredmény", color, values: [0, ...curve.map((point) => point.cumulative)], endLabel: signedR(stats.totalR) }],
    xTicks: [...new Set(ticks)].map((index) => ({ x: index, label: index ? `${index}.` : "0" })),
    baseline: 0,
    formatY: (value) => `${formatNumber(value, 1)}R`,
    ariaLabel: `Halmozott eredmény ${curve.length} kötés után: ${signedR(stats.totalR)}. A nyílbillentyűkkel léptethető.`,
    tooltip: (index) => {
      if (index === 0) return { title: "Kezdés", rows: [{ color, value: "0R", label: "Halmozott" }] };
      const point = curve[index - 1];
      return { title: `${point.index}. kötés · ${point.symbol} · ${formatDate(point.date)}`, rows: [{ color, value: signedR(point.cumulative), label: "Halmozott" }, { value: signedR(point.result), label: "Ez a kötés" }] };
    },
  });
}

function renderDiscipline(entries) {
  const limit = Number(state.profile.dailyLimitR) || 2;
  const discipline = dailyDiscipline(entries, limit, localDateKey());
  setText("#discipline-limit", `Napi limit: ${formatNumber(limit)}R`);
  $("#discipline-figures").innerHTML = figuresHTML([
    ["Kereskedési nap", String(discipline.tradingDays)],
    ["Limit elérve", `${discipline.limitDays} nap`],
    ["Limit utáni kötés (áthágás)", `${discipline.breachDays} nap`, discipline.breachDays ? "is-bad" : "is-good"],
    ["Tiszta nap az utolsó áthágás óta", String(discipline.cleanDays)],
    ["Utolsó áthágás", discipline.lastBreach ? formatDate(discipline.lastBreach) : "nem volt"],
    ["A legjobb nap aránya", discipline.bestDayShare === null ? "–" : `${formatNumber(discipline.bestDayShare, 0)}%`],
  ]);
  const status = (day) => (day.breached ? '<span class="status is-bad">× Áthágás</span>' : day.hitLimit ? '<span class="status">Limit elérve, megálltál</span>' : '<span class="status is-good">✓ Rendben</span>');
  $("#discipline-days").innerHTML = `<div class="table-wrap"><table>
    <thead><tr><th scope="col">Nap</th><th scope="col" class="num">Kötés</th><th scope="col" class="num">Napi eredmény</th><th scope="col">Állapot</th></tr></thead>
    <tbody>${discipline.days.slice(-10).reverse().map((day) => `<tr><td>${formatDate(day.date)}</td><td class="num">${day.trades}</td><td class="num">${signedR(day.totalR)}</td><td>${status(day)}</td></tr>`).join("")}</tbody>
  </table></div>`;
}

function renderStats() {
  const entries = state.journalEntries.filter((entry) => mode === "all" || entry.mode === mode);
  const stats = journalStats(entries);
  setText("#stats-sample", `${stats.count} kötés, ${stats.entries} bejegyzés`);
  $("#stats-empty").hidden = stats.count > 0;
  $("#stats-body").hidden = stats.count === 0;
  if (!stats.count) return;

  setText("#stats-note", stats.count < 20
    ? `Ez még nem statisztika: ${stats.count} kötésnél a szórás nagyobb, mint a jel. Gyűjts tovább, mielőtt bármit módosítasz a szabályaidon.`
    : stats.count < 100 ? `Az első érdemi képhez legalább 100, előre rögzített szabály szerinti kötés kell. Most ${stats.count} van.` : "");

  $("#stats-figures").innerHTML = figuresHTML([
    ["Várható érték kötésenként", signedR(stats.expectancy, 3), tone(stats.expectancy)],
    ["Összes eredmény", signedR(stats.totalR), tone(stats.totalR)],
    ["Találati arány", `${formatNumber(stats.winRate, 1)}%`],
    ["Átlagos nyerő", signedR(stats.avgWin)],
    ["Átlagos vesztes", signedR(-stats.avgLoss)],
    ["Legnagyobb visszaesés", `${formatNumber(stats.maxDrawdown)}R`],
    ["Leghosszabb vesztes sorozat", `${stats.maxLossStreak} kötés`],
    ["Szabálykövetés (cél: 90%)", `${formatNumber(stats.ruleRate, 0)}%`, stats.ruleRate >= 90 ? "is-good" : "is-bad"],
    ["Szabálytalan nyerő kötés", String(stats.ruleBreakWins)],
    ["Kötés nélküli bejegyzés", String(stats.noTrades)],
    ...(stats.maeCount ? [["Átlagos MAE / MFE", `${formatNumber(stats.avgMae)}R / ${formatNumber(stats.avgMfe)}R`]] : []),
  ]);

  renderCurve(stats);
  renderDiscipline(entries);

  const breakdown = (title, groups, labelOf) => `<section><h3>${title}</h3><div class="table-wrap"><table>
    <thead><tr><th scope="col">Csoport</th><th scope="col" class="num">Kötés</th><th scope="col" class="num">Találati arány</th><th scope="col" class="num">Átlag</th><th scope="col" class="num">Összesen</th></tr></thead>
    <tbody>${groups.map((group) => `<tr><td>${escapeHTML(labelOf(group.key))}</td><td class="num">${group.count}</td><td class="num">${formatNumber(group.winRate, 0)}%</td><td class="num">${signedR(group.expectancy)}</td><td class="num">${signedR(group.totalR)}</td></tr>`).join("")}</tbody>
  </table></div></section>`;
  $("#stats-tables").innerHTML = breakdown("Setup szerint", stats.bySetup, (key) => key)
    + breakdown("Szabálykövetés szerint", stats.byRule, ruleGroupLabel)
    + breakdown("Érzelmi állapot szerint", stats.byEmotion, (key) => capitalize(emotionLabel(key)));
}

export function initStats() {
  onRender(() => { if (visible()) renderStats(); });
  onTab("journal", (name) => { if (name === "stats") renderStats(); });
  onViewShown(() => { if (visible()) renderStats(); });
  window.addEventListener("resize", debounce(() => { if (visible()) renderStats(); }, 150));
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-stats-mode]");
    if (!button) return;
    mode = button.dataset.statsMode;
    $$("[data-stats-mode]").forEach((item) => item.classList.toggle("active", item === button));
    renderStats();
  });
}
