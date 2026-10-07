// Gyakorló laborok: állapot nélküli kalkulátorok és szimulátorok a Gyakorlás nézetben.
// A számolás a logic/calc.js-ben van; itt csak a bemenet és a megjelenítés.
import { positionSize, expectancy, consistency, drawdown, valueArea, footprint } from "../logic/calc.js";
import { profileHTML, drawdownChart, DRAWDOWN_TYPES, pointLabel } from "../diagrams.js";
import { onViewShown } from "../router.js";
import { onTab } from "../tabs.js";
import { $, $$, setText, formatNumber as fmt, signed, formNumbers, resultRowsHTML, debounce } from "../util.js";

const fixed = (value, digits = 2) => new Intl.NumberFormat("hu-HU", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
const hint = (text) => `<p class="result-hint">${text}</p>`;

// ---------- Kockázati labor ----------

// Pontérték egy kontraktusra. Termékspecifikus adat: az aktuális értéket a tőzsde oldalán ellenőrizd.
const INSTRUMENTS = { MES: 5, ES: 50, MNQ: 2, NQ: 20 };

function renderPosition() {
  const result = positionSize(formNumbers($("#position-form")));
  $("#position-result").innerHTML = result
    ? resultRowsHTML([
      { label: "Elméleti egész méret", value: `${fmt(result.size, 0)} egység`, className: "is-main" },
      { label: "Kockázati keret", value: fmt(result.riskBudget) },
      { label: "Stop-távolság", value: fmt(result.distance, 6) },
      { label: "Egy egység becsült kockázata", value: fmt(result.unitRisk) },
      { label: "Tényleges kockázat ezzel a mérettel", value: fmt(result.actualRisk) },
    ]) + (result.size === 0 ? hint("A legkisebb mennyiség is több kockázat, mint amennyit a keret enged: nincs kötés.") : "")
    : hint("Adj meg pozitív számokat. A belépő és a stop nem lehet azonos.");
}

function renderExpectancy() {
  const result = expectancy(formNumbers($("#expectancy-form")));
  $("#expectancy-result").innerHTML = result
    ? resultRowsHTML([
      { label: "Várható érték költség után", value: `${signed(result.net, 3)}R`, className: `is-main ${result.net > 0 ? "is-good" : result.net < 0 ? "is-bad" : ""}` },
      { label: "Várható érték költség előtt", value: `${signed(result.gross, 3)}R` },
      { label: "Nullszaldós találati arány", value: result.breakEven === null ? "–" : `${fmt(result.breakEven, 1)}%` },
    ])
    : hint("A találati arány 0 és 100 között legyen, az R-értékek ne legyenek negatívak.");
}

// ---------- Megbízás-labor ----------

const ORDER_FEEDBACK = {
  market: "A market buy illik az »azonnal venni« célhoz, de az átlagár a látható asknál rosszabb is lehet. Végrehajtást keres, nem garantált árat.",
  limit: "A 5102,00-s limit buy árkontrollt ad, de a jelenlegi best ask mellett nem feltétlenül teljesül. Akkor helyes, ha a maximális ár fontosabb az azonnaliságnál.",
  stop: "Az 5103,00-s buy stop csak a trigger elérésekor aktiválódik; kitörési feltételhez lehet alkalmas, nem azonnali belépéshez.",
};

function chooseOrder(button) {
  $$("[data-order-answer]").forEach((item) => item.classList.toggle("selected", item === button));
  setText("#order-feedback", ORDER_FEEDBACK[button.dataset.orderAnswer]);
  $("#order-feedback").classList.add("is-answered");
}

// ---------- Prop szabályok ----------

function renderConsistency() {
  const result = consistency(formNumbers($("#consistency-form")));
  $("#consistency-result").innerHTML = result
    ? resultRowsHTML([
      { label: "A legjobb nap aránya", value: `${fmt(result.share, 1)}%`, className: `is-main ${result.passes ? "is-good" : "is-bad"}` },
      { label: "Megfelel a küszöbnek", value: result.passes ? "Igen" : "Nem" },
      { label: "Ehhez a naphoz szükséges összprofit", value: fmt(result.requiredTotal) },
      { label: "Még hiányzó profit más napokon", value: fmt(result.missing) },
      ...(result.maxDayAtTarget === null ? [] : [{ label: "Legnagyobb megengedett nap a célnál", value: fmt(result.maxDayAtTarget) }]),
    ])
    : hint("Adj meg pozitív számokat. A legjobb nap nem lehet nagyobb az összprofitnál.");
}

const SCENARIOS = {
  paper: [[400, -100, 300], [1500, -200, 200], [300, -600, -400], [200, -700, -500], [500, -100, 400]],
  steady: [[300, -150, 200], [350, -100, 250], [200, -250, -150], [400, -100, 300], [250, -150, 150]],
  losing: [[100, -500, -400], [150, -450, -350], [200, -600, -500], [100, -400, -300], [300, -550, -450]],
};

function fillScenario(name) {
  const cell = (kind, label, index, value) => `<td><input name="${kind}-${index}" type="number" step="50" value="${value}" inputmode="decimal" aria-label="${index + 1}. nap ${label} eredménye" /></td>`;
  $("#drawdown-days").innerHTML = SCENARIOS[name].map(([high, low, close], index) => `<tr><th scope="row">${index + 1}. nap</th>${cell("high", "legmagasabb", index, high)}${cell("low", "legalacsonyabb", index, low)}${cell("close", "záró", index, close)}</tr>`).join("");
}

function renderDrawdown() {
  const input = formNumbers($("#drawdown-form"));
  const days = SCENARIOS.paper.map((_, index) => ({ high: input[`high-${index}`], low: input[`low-${index}`], close: input[`close-${index}`] }));
  const result = drawdown({ startBalance: input.startBalance, maxDrawdown: input.maxDrawdown, days });
  if (!result) {
    $("#drawdown-chart").replaceChildren();
    $("#drawdown-legend").replaceChildren();
    $("#drawdown-result").innerHTML = hint("Adj meg pozitív kezdő egyenleget és maximális visszaesést.");
    return;
  }
  drawdownChart($("#drawdown-chart"), $("#drawdown-legend"), result);
  $("#drawdown-result").innerHTML = `<div class="table-wrap"><table>
    <thead><tr><th scope="col">Típus</th><th scope="col" class="num">Küszöb a végén</th><th scope="col" class="num">Maradék mozgástér</th><th scope="col">Állapot</th></tr></thead>
    <tbody>${DRAWDOWN_TYPES.map((type) => {
      const breach = result.breaches[type.key];
      const status = breach === null ? '<span class="status is-good">✓ Rendben</span>' : `<span class="status is-bad">× Átlépve: ${pointLabel(result.points[breach])}</span>`;
      return `<tr><td><i class="chart-key" style="--c: ${type.color}"></i> ${type.label}</td><td class="num">${fmt(result.finalThresholds[type.key], 0)}</td><td class="num">${fmt(result.room[type.key], 0)}</td><td>${status}</td></tr>`;
    }).join("")}</tbody></table></div>`;
}

// ---------- Orderflow-labor ----------

const PRICES = [101.25, 101, 100.75, 100.5, 100.25, 100];
const VA_EXAMPLE = [70, 140, 230, 320, 180, 60];
const FP_EXAMPLE = [[15, 25], [20, 100], [30, 170], [50, 220], [60, 180], [40, 10]];

function fillProfile(volumes) {
  $("#va-rows").innerHTML = PRICES.map((price, index) => `<tr><th scope="row">${fixed(price)}</th><td><input name="volume-${index}" type="number" min="0" step="10" value="${volumes[index]}" inputmode="numeric" aria-label="Kötött mennyiség ${fixed(price)} áron" /></td></tr>`).join("");
}

function randomProfile() {
  const peak = 1 + Math.floor(Math.random() * 4);
  const top = 250 + Math.floor(Math.random() * 20) * 10;
  return PRICES.map((_, index) => Math.max(20, Math.round((top * Math.exp(-((index - peak) ** 2) / 2.6) + Math.random() * 90) / 10) * 10));
}

function renderValueArea() {
  const input = formNumbers($("#va-form"));
  const result = valueArea(PRICES.map((price, index) => ({ price, volume: input[`volume-${index}`] })), input.target);
  if (!result) {
    $("#va-chart").replaceChildren();
    $("#va-steps").replaceChildren();
    $("#va-summary").innerHTML = hint("Adj meg legalább egy pozitív mennyiséget.");
    return;
  }
  const { rows } = result;
  $("#va-chart").innerHTML = profileHTML(result);
  $("#va-summary").innerHTML = resultRowsHTML([
    { label: "POC", value: fixed(rows[result.pocIndex].price), className: "is-main" },
    { label: "VAH", value: fixed(rows[result.high].price) },
    { label: "VAL", value: fixed(rows[result.low].price) },
    { label: `Bevont hányad (cél: ${fmt(input.target, 0)}%)`, value: `${fmt(result.percent, 1)}%` },
  ]);
  const share = (value) => `${fmt(value, 0)} (${fmt((value / result.total) * 100, 0)}%)`;
  $("#va-steps").innerHTML = result.steps.map((step) => {
    const price = fixed(rows[step.index].price);
    if (step.type === "poc") return `<li>A legnagyobb forgalmú sor a <strong>${price}</strong> (${fmt(rows[step.index].volume, 0)}): ez a POC. Összeg: ${share(step.included)}.</li>`;
    const compare = step.above === null ? "Fölül elfogytak a sorok" : step.below === null ? "Alul elfogytak a sorok" : `Felső szomszéd ${fmt(step.above, 0)}, alsó ${fmt(step.below, 0)}`;
    return `<li>${compare}: ${step.side === "above" ? "a felső" : "az alsó"} sor (<strong>${price}</strong>) kerül be. Összeg: ${share(step.included)}.</li>`;
  }).join("") + `<li>${result.included >= result.target ? `A cél (${fmt(result.target, 0)}) teljesült.` : "Minden sor bekerült, a cél így sem teljesült."}</li>`;
}

function fillFootprint() {
  $("#fp-rows").innerHTML = PRICES.map((price, index) => `<tr data-price="${price}">
    <th scope="row">${fixed(price)}</th>
    <td><input name="bid-${index}" type="number" min="0" step="5" value="${FP_EXAMPLE[index][0]}" inputmode="numeric" aria-label="Bid volumen ${fixed(price)} áron" /></td>
    <td><input name="ask-${index}" type="number" min="0" step="5" value="${FP_EXAMPLE[index][1]}" inputmode="numeric" aria-label="Ask volumen ${fixed(price)} áron" /></td>
    <td class="num" data-cell="delta"></td><td class="num" data-cell="buy"></td><td class="num" data-cell="sell"></td>
  </tr>`).join("");
}

function renderFootprint() {
  const input = formNumbers($("#fp-form"));
  const result = footprint(PRICES.map((price, index) => ({ price, bid: input[`bid-${index}`], ask: input[`ask-${index}`] })), { ratio: input.ratio || 3, minVolume: input.minVolume || 0 });
  $$("#fp-rows [data-cell]").forEach((node) => { node.textContent = "–"; node.className = "num"; });
  if (!result || result.rows.length !== PRICES.length) {
    $("#fp-summary").innerHTML = hint("Minden sorba írj nullát vagy pozitív számot.");
    return;
  }
  result.rows.forEach((row, index) => {
    const tr = $(`#fp-rows tr[data-price="${row.price}"]`);
    const set = (name, value, flagged, tone) => {
      const node = tr.querySelector(`[data-cell="${name}"]`);
      node.textContent = value;
      if (flagged) node.classList.add(tone);
    };
    set("delta", signed(row.delta, 0));
    set("buy", row.buyRatio === null ? "–" : `${fmt(row.buyRatio, 2)} : 1`, row.buyImbalance, "is-good");
    set("sell", row.sellRatio === null ? "–" : `${fmt(row.sellRatio, 2)} : 1`, row.sellImbalance, "is-bad");
    tr.classList.toggle("is-poc", index === result.pocIndex);
  });
  $("#fp-summary").innerHTML = resultRowsHTML([
    { label: "Delta", value: signed(result.delta, 0), className: `is-main ${result.delta > 0 ? "is-good" : result.delta < 0 ? "is-bad" : ""}` },
    { label: "Összvolumen", value: fmt(result.volume, 0) },
    { label: "Deltaarány", value: `${signed(result.deltaPercent, 1)}%` },
    { label: "A gyertya POC-ja", value: fixed(result.rows[result.pocIndex].price) },
    { label: "Leghosszabb vételi halmozódás", value: `${result.stackedBuy} sor` },
    { label: "Leghosszabb eladási halmozódás", value: `${result.stackedSell} sor` },
  ]);
}

// ---------- Bekötés ----------

export function initLabs() {
  const bind = (selector, render) => {
    const form = $(selector);
    form.addEventListener("input", render);
    form.addEventListener("submit", (event) => { event.preventDefault(); render(); });
    render();
  };

  fillScenario("paper");
  fillProfile(VA_EXAMPLE);
  fillFootprint();
  bind("#position-form", renderPosition);
  bind("#expectancy-form", renderExpectancy);
  bind("#consistency-form", renderConsistency);
  bind("#drawdown-form", renderDrawdown);
  bind("#va-form", renderValueArea);
  bind("#fp-form", renderFootprint);

  const position = $("#position-form");
  position.elements.instrument.addEventListener("change", (event) => {
    if (INSTRUMENTS[event.target.value]) position.elements.unitValue.value = INSTRUMENTS[event.target.value];
    renderPosition();
  });
  position.elements.unitValue.addEventListener("input", () => { position.elements.instrument.value = "custom"; });
  $("#drawdown-form").elements.scenario.addEventListener("change", (event) => { fillScenario(event.target.value); renderDrawdown(); });
  $("#va-example").addEventListener("click", () => { fillProfile(VA_EXAMPLE); renderValueArea(); });
  $("#va-random").addEventListener("click", () => { fillProfile(randomProfile()); renderValueArea(); });
  $("#fp-example").addEventListener("click", () => { fillFootprint(); renderFootprint(); });
  $$("[data-order-answer]").forEach((button) => button.addEventListener("click", () => chooseOrder(button)));

  // A diagramnak valós szélesség kell: fül- és nézetváltás, átméretezés után újrarajzoljuk.
  onTab("practice", (name) => { if (name === "prop") renderDrawdown(); });
  onViewShown((view) => { if (view === "gyakorlas") renderDrawdown(); });
  window.addEventListener("resize", debounce(renderDrawdown, 150));
}
