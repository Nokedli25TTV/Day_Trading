// Go / No-Go: a hét feltétel állása a saját adataidból, és a mock evaluation követő.
import { state, save, commit, onRender } from "../store.js";
import { showToast } from "../toast.js";
import { journalStats } from "../logic/calc.js";
import { dailyDiscipline, evaluateMock, goNoGo, THRESHOLDS } from "../logic/readiness.js";
import { lineChart, legend } from "../charts.js";
import { getCurrentView, onViewShown } from "../router.js";
import { currentTab, onTab } from "../tabs.js";
import { $, setText, setMeter, escapeHTML, formatNumber, formatDate, signedR, signed, formObject, formNumbers, localDateKey, uid, debounce } from "../util.js";

const DD_LABEL = { static: "statikus", eod: "nap végi trailing", intraday: "intraday trailing" };
const MANUAL = {
  diligence: ["Elvégzett due diligence, vészjel nélkül", "Melyik cég, milyen forrásból, mikor ellenőrizted?"],
  tax: ["Ismered az adózási és jogi kontextust", "Kihez fordulsz kifizetés előtt, és mit tisztáztál eddig?"],
  money: ["Elbírod a díj teljes elvesztését", "Mekkora a díj, és miből fizeted?"],
};

const visible = () => getCurrentView() === "roadmap" && currentTab("roadmap") === "readiness";
const mockResult = (mock) => evaluateMock(mock.config, mock.days);
const activeMock = () => state.mocks.find((mock) => !mock.closedAt);

// ---------- A hét feltétel ----------

function criterionText(criterion, stats, discipline, passed) {
  switch (criterion.key) {
    case "limit": return ["Két hónap napi limit áthágás nélkül",
      discipline.tradingDays ? `${discipline.cleanDays} tiszta nap a szükséges ${THRESHOLDS.cleanDays}-ból. Áthágás összesen: ${discipline.breachDays} nap.` : "Még nincs R-eredménnyel rögzített kötés a naplóban."];
    case "positive": return ["Szabálykövető módon pozitív eredmény",
      `${stats.count} kötés a szükséges ${THRESHOLDS.minTrades}-ból, várható érték ${stats.count ? signedR(stats.expectancy, 3) : "–"}. A legjobb nap aránya ${discipline.bestDayShare === null ? "–" : `${formatNumber(discipline.bestDayShare, 0)}%`} (legfeljebb ${THRESHOLDS.bestDayShare}%).`];
    case "rules": return ["Legalább 90% szabálykövetés", stats.entries ? `${formatNumber(stats.ruleRate, 0)}% a napló ${stats.entries} bejegyzésében.` : "A napló még üres."];
    case "mock": return ["Sikeres mock evaluation", `${passed} teljesített ciklus. Egy kötelező, kettő ajánlott.`];
    default: return [MANUAL[criterion.key][0], ""];
  }
}

function evaluate() {
  const stats = journalStats(state.journalEntries);
  const discipline = dailyDiscipline(state.journalEntries, Number(state.profile.dailyLimitR) || 2, localDateKey());
  const passed = state.mocks.filter((mock) => mockResult(mock).status === "passed").length;
  return { stats, discipline, passed, result: goNoGo({ stats, discipline, mocksPassed: passed, manual: state.readiness }) };
}

function renderVerdict(result) {
  const verdict = $("#readiness-verdict");
  verdict.className = `verdict ${result.go ? "is-go" : "is-no-go"}`;
  verdict.innerHTML = result.go
    ? "<strong>Go</strong><p>Mind a hét feltétel teljesül. A legolcsóbb szinttel indulj, változatlan szabályokkal és mérettel.</p>"
    : `<strong>No-Go</strong><p>${result.missing.length} feltétel hiányzik a hétből. Ez nem kudarc: erre szolgál a fél év. Az alábbi lista mutatja, min kell még dolgozni.</p>`;
}

// Gépelés közben nem építjük újra a listát (elveszne a fókusz), csak a jelöléseket frissítjük.
function patchCriteria() {
  const { result } = evaluate();
  renderVerdict(result);
  result.criteria.forEach((criterion, index) => {
    const item = $(`#readiness-list [data-criterion="${criterion.key}"]`);
    if (!item) return;
    item.className = `criterion ${criterion.pass ? "is-pass" : "is-open"}`;
    item.querySelector(".criterion__mark").textContent = criterion.pass ? "✓" : String(index + 1);
    item.querySelector(".criterion__state").textContent = criterion.pass ? "teljesül" : "hiányzik";
  });
}

function renderCriteria() {
  const { stats, discipline, passed, result } = evaluate();
  renderVerdict(result);
  $("#readiness-list").innerHTML = result.criteria.map((criterion, index) => {
    const [title, detail] = criterionText(criterion, stats, discipline, passed);
    const saved = state.readiness[criterion.key] || {};
    const manual = criterion.auto ? `<p>${detail}</p>` : `<label class="check-row"><input type="checkbox" data-readiness-check="${criterion.key}" ${saved.checked ? "checked" : ""} /> Teljesül</label>
      <label class="criterion__evidence">Bizonyíték<input type="text" data-readiness-evidence="${criterion.key}" maxlength="240" value="${escapeHTML(saved.evidence || "")}" placeholder="${MANUAL[criterion.key][1]}" /></label>`;
    return `<li class="criterion ${criterion.pass ? "is-pass" : "is-open"}" data-criterion="${criterion.key}">
      <span class="criterion__mark" aria-hidden="true">${criterion.pass ? "✓" : index + 1}</span>
      <div><h3>${title} <span class="criterion__state">${criterion.pass ? "teljesül" : "hiányzik"}</span></h3>${manual}</div>
    </li>`;
  }).join("");
}

// ---------- Mock evaluation ----------

function renderMockChart(result) {
  const container = $("#mock-chart");
  if (!container?.clientWidth || result.points.length < 2) return;
  // A trailing küszöb zárás után lép: a zárás pontján lépcsőt rajzolunk, a végén a mostani értékkel.
  const next = (index) => (result.points[index + 1] ? result.points[index + 1].threshold : result.threshold);
  const thresholds = result.points.map((point, index) => (index === result.points.length - 1 ? result.threshold : point.threshold));
  const vertices = result.points.flatMap((point, index) => (point.kind === "close" && next(index) !== point.threshold
    ? [{ x: index, y: point.threshold }, { x: index, y: next(index) }]
    : [{ x: index, y: point.threshold }]));
  const series = [
    { label: "Egyenleg", color: "var(--text)", values: result.points.map((point) => point.equity), endLabel: "Egyenleg" },
    { label: "Küszöb", color: "var(--series-2)", values: thresholds, vertices, endLabel: "Küszöb" },
  ];
  legend($("#mock-legend"), series);
  lineChart(container, {
    count: result.points.length,
    series,
    xTicks: result.points.map((point, index) => ({ point, index })).filter(({ point }) => point.kind === "close").map(({ point, index }) => ({ x: index, label: `${point.day}.` })),
    markers: result.breachPoint === null ? [] : [{ x: result.breachPoint, y: result.points[result.breachPoint].equity, color: "var(--series-2)" }],
    formatY: (value) => formatNumber(value, 0),
    ariaLabel: "A mock evaluation egyenlege és a drawdown-küszöb napról napra. A nyílbillentyűkkel léptethető.",
    height: 240,
    tooltip: (index) => ({ title: index === 0 ? "Kezdés" : `${result.points[index].day}. nap`, rows: series.map((item) => ({ color: item.color, label: item.label, value: formatNumber(item.values[index], 0) })) }),
  });
}

function statusHTML(mock, result) {
  if (result.status === "passed") return '<p class="verdict is-go"><strong>Teljesítve</strong> A cél, a minimális napok és a szabályok is megvannak.</p>';
  if (result.status === "failed") {
    const reason = result.failReason === "drawdown" ? `az egyenleg elérte a ${DD_LABEL[mock.config.ddType]} küszöböt` : "a napi veszteség átlépte a napi limitet";
    return `<p class="verdict is-no-go"><strong>Elbukott</strong> A ${result.failDay}. napon ${reason}. Elemezd a naplóból, mi történt, és csak utána indíts új kört.</p>`;
  }
  const notes = [];
  if (!result.targetHit) notes.push(`még ${formatNumber(mock.config.target - result.profit, 0)} profit kell a célhoz`);
  if (!result.enoughDays) notes.push(`még ${mock.config.minDays - result.tradedDays} kereskedési nap kell`);
  if (!result.consistencyOk) notes.push(`a legjobb nap aránya túl nagy, még ${formatNumber(result.missingForConsistency, 0)} profit kell más napokon`);
  return `<p class="verdict"><strong>Folyamatban</strong> ${notes.length ? `${notes.join(", ")}.` : "Rögzítsd az első napot."}</p>`;
}

function renderMock() {
  const mock = activeMock();
  $("#mock-form").hidden = Boolean(mock);
  $("#mock-active").hidden = !mock;
  if (mock) {
    const { config } = mock;
    const result = mockResult(mock);
    setText("#mock-title", mock.name || "Mock evaluation");
    setText("#mock-rules", `Számla ${formatNumber(config.startBalance, 0)}, cél +${formatNumber(config.target, 0)}, ${DD_LABEL[config.ddType]} drawdown ${formatNumber(config.maxDrawdown, 0)}${config.dailyLimit ? `, napi limit ${formatNumber(config.dailyLimit, 0)}` : ""}${config.consistencyPercent ? `, consistency ${config.consistencyPercent}%` : ""}, legalább ${config.minDays} nap.`);
    $("#mock-status").innerHTML = statusHTML(mock, result);
    setMeter("#mock-meter", result.targetProgress);
    $("#mock-figures").innerHTML = [
      ["Egyenleg", formatNumber(result.balance, 0)],
      ["Eredmény", signed(result.profit, 0), result.profit > 0 ? "is-good" : result.profit < 0 ? "is-bad" : ""],
      ["Küszöb", formatNumber(result.threshold, 0)],
      ["Maradék mozgástér", formatNumber(result.room, 0)],
      ["Kereskedési nap", `${result.tradedDays} / ${config.minDays}`],
      ["A legjobb nap aránya", result.bestDayShare === null ? "–" : `${formatNumber(result.bestDayShare, 0)}%`],
    ].map(([label, value, className = ""]) => `<div><dt>${label}</dt><dd class="${className}">${value}</dd></div>`).join("");
    $("#mock-days").innerHTML = mock.days.length ? `<div class="table-wrap"><table>
      <thead><tr><th scope="col">Nap</th><th scope="col">Dátum</th><th scope="col" class="num">Legmagasabb</th><th scope="col" class="num">Legalacsonyabb</th><th scope="col" class="num">Záró</th></tr></thead>
      <tbody>${mock.days.map((day, index) => `<tr><td>${index + 1}.</td><td>${formatDate(day.date)}</td><td class="num">${signed(Number(day.high) || 0, 0)}</td><td class="num">${signed(Number(day.low) || 0, 0)}</td><td class="num">${signed(Number(day.close) || 0, 0)}</td></tr>`).join("")}</tbody>
    </table></div>` : "";
    $("#mock-day-form").hidden = result.status !== "active";
    $("#mock-undo").hidden = mock.days.length === 0;
    $("#mock-day-form").elements.date.value ||= localDateKey();
    renderMockChart(result);
  }

  const closed = state.mocks.filter((item) => item.closedAt).reverse();
  $("#mock-history").innerHTML = closed.length ? `<h3>Korábbi ciklusok</h3><ul class="mock-history">${closed.map((item) => {
    const result = mockResult(item);
    const label = result.status === "passed" ? '<span class="status is-good">✓ Teljesítve</span>' : result.status === "failed" ? '<span class="status is-bad">× Elbukott</span>' : '<span class="status">Megszakítva</span>';
    return `<li><span><strong>${escapeHTML(item.name || "Mock evaluation")}</strong><small>${formatDate(item.startedAt)} – ${formatDate(item.closedAt)} · ${result.tradedDays} nap · ${signed(result.profit, 0)}</small></span>${label}</li>`;
  }).join("")}</ul>` : "";
}

function startMock(event) {
  event.preventDefault();
  const text = formObject(event.currentTarget);
  const input = formNumbers(event.currentTarget);
  if (![input.startBalance, input.target, input.maxDrawdown].every((value) => Number.isFinite(value) && value > 0)) {
    showToast("A számlaméret, a profitcél és a maximális visszaesés legyen pozitív szám.", true);
    return;
  }
  state.mocks.push({
    id: uid(),
    name: String(text.name || "").trim().slice(0, 60),
    config: { startBalance: input.startBalance, target: input.target, maxDrawdown: input.maxDrawdown, ddType: text.ddType, dailyLimit: input.dailyLimit || 0, consistencyPercent: input.consistencyPercent || 0, minDays: input.minDays || 0 },
    days: [],
    startedAt: localDateKey(),
    closedAt: null,
  });
  commit("Mock evaluation elindítva");
}

function addDay(event) {
  event.preventDefault();
  const mock = activeMock();
  const text = formObject(event.currentTarget);
  const input = formNumbers(event.currentTarget);
  if (!mock || !Number.isFinite(input.close)) { showToast("A záró eredmény kötelező.", true); return; }
  mock.days.push({ date: text.date || localDateKey(), high: Number.isFinite(input.high) ? input.high : "", low: Number.isFinite(input.low) ? input.low : "", close: input.close });
  event.currentTarget.reset();
  commit("Nap rögzítve");
  const result = mockResult(mock);
  if (result.status === "failed") showToast("A mock elbukott: egy szabálysértés bukás, ahogy élesben is.", true);
  else if (result.status === "passed") showToast("A mock teljesítve.");
}

export function initReadiness() {
  onRender(() => { renderCriteria(); renderMock(); });
  onTab("roadmap", (name) => { if (name === "readiness") renderMock(); });
  onViewShown(() => { if (visible()) renderMock(); });
  window.addEventListener("resize", debounce(() => { if (visible()) renderMock(); }, 150));

  $("#readiness-list").addEventListener("change", (event) => {
    const key = event.target.dataset.readinessCheck || event.target.dataset.readinessEvidence;
    if (!key) return;
    const saved = state.readiness[key] || { checked: false, evidence: "" };
    if (event.target.dataset.readinessCheck) saved.checked = event.target.checked;
    else saved.evidence = event.target.value.trim().slice(0, 240);
    state.readiness[key] = saved;
    save("Feltétel frissítve");
    patchCriteria();
  });

  $("#mock-form").addEventListener("submit", startMock);
  $("#mock-day-form").addEventListener("submit", addDay);
  $("#mock-undo").addEventListener("click", () => {
    const mock = activeMock();
    if (!mock?.days.length) return;
    mock.days.pop();
    commit("Utolsó nap törölve");
  });
  $("#mock-close").addEventListener("click", () => {
    const mock = activeMock();
    if (!mock) return;
    const status = mockResult(mock).status;
    if (status === "active" && !confirm("A mock még folyamatban van. Megszakítod? A megszakított kör nem számít teljesítettnek.")) return;
    mock.closedAt = localDateKey();
    commit("Mock lezárva");
  });
}
