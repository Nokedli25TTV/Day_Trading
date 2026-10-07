// Gyakorló laborok: állapot nélküli kalkulátorok és szimulátorok a Gyakorlás nézetben.
// A számolás a calc.js-ben, a vonaldiagram a charts.js-ben van; itt csak a bemenet és a megjelenítés.
(() => {
  "use strict";

  const CALC = window.TRADECRAFT_CALC;
  const CHARTS = window.TRADECRAFT_CHARTS;
  const $ = (selector) => document.querySelector(selector);

  const fmt = (value, digits = 2) => new Intl.NumberFormat("hu-HU", { maximumFractionDigits: digits }).format(value);
  const fixed = (value, digits = 2) => new Intl.NumberFormat("hu-HU", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
  const signed = (value, digits = 2) => `${value > 0 ? "+" : value < 0 ? "−" : ""}${fmt(Math.abs(value), digits)}`;
  const formNumbers = (form) => Object.fromEntries([...new FormData(form).entries()].map(([key, value]) => [key, String(value).trim() === "" ? NaN : Number(value)]));
  const rowsHTML = (rows) => `<dl class="result-list">${rows.map((row) => `<div class="${row.className || ""}"><dt>${row.label}</dt><dd>${row.value}</dd></div>`).join("")}</dl>`;
  const hint = (text) => `<p class="result-hint">${text}</p>`;

  // ---------- Pozícióméretező ----------

  // Pontérték egy kontraktusra. Termékspecifikus adat: az aktuális értéket a tőzsde oldalán ellenőrizd.
  const INSTRUMENTS = { MES: 5, ES: 50, MNQ: 2, NQ: 20 };

  function renderPosition() {
    const form = $("#position-form");
    const result = CALC.positionSize(formNumbers(form));
    $("#position-result").innerHTML = result
      ? rowsHTML([
        { label: "Elméleti egész méret", value: `${fmt(result.size, 0)} egység`, className: "is-main" },
        { label: "Kockázati keret", value: fmt(result.riskBudget) },
        { label: "Stop-távolság", value: fmt(result.distance, 6) },
        { label: "Egy egység becsült kockázata", value: fmt(result.unitRisk) },
        { label: "Tényleges kockázat ezzel a mérettel", value: fmt(result.actualRisk) },
      ]) + (result.size === 0 ? hint("A legkisebb mennyiség is több kockázat, mint amennyit a keret enged: nincs kötés.") : "")
      : hint("Adj meg pozitív számokat. A belépő és a stop nem lehet azonos.");
  }

  function renderExpectancy() {
    const result = CALC.expectancy(formNumbers($("#expectancy-form")));
    $("#expectancy-result").innerHTML = result
      ? rowsHTML([
        { label: "Várható érték költség után", value: `${signed(result.net, 3)}R`, className: `is-main ${result.net > 0 ? "is-good" : result.net < 0 ? "is-bad" : ""}` },
        { label: "Várható érték költség előtt", value: `${signed(result.gross, 3)}R` },
        { label: "Nullszaldós találati arány", value: result.breakEven === null ? "–" : `${fmt(result.breakEven, 1)}%` },
      ])
      : hint("A találati arány 0 és 100 között legyen, az R-értékek ne legyenek negatívak.");
  }

  // ---------- Consistency ----------

  function renderConsistency() {
    const input = formNumbers($("#consistency-form"));
    const result = CALC.consistency(input);
    $("#consistency-result").innerHTML = result
      ? rowsHTML([
        { label: "A legjobb nap aránya", value: `${fmt(result.share, 1)}%`, className: `is-main ${result.passes ? "is-good" : "is-bad"}` },
        { label: "Megfelel a küszöbnek", value: result.passes ? "Igen" : "Nem" },
        { label: "Ehhez a naphoz szükséges összprofit", value: fmt(result.requiredTotal) },
        { label: "Még hiányzó profit más napokon", value: fmt(result.missing) },
        ...(result.maxDayAtTarget === null ? [] : [{ label: "Legnagyobb megengedett nap a célnál", value: fmt(result.maxDayAtTarget) }]),
      ])
      : hint("Adj meg pozitív számokat. A legjobb nap nem lehet nagyobb az összprofitnál.");
  }

  // ---------- Drawdown-szimulátor ----------

  const SCENARIOS = {
    paper: [[400, -100, 300], [1500, -200, 200], [300, -600, -400], [200, -700, -500], [500, -100, 400]],
    steady: [[300, -150, 200], [350, -100, 250], [200, -250, -150], [400, -100, 300], [250, -150, 150]],
    losing: [[100, -500, -400], [150, -450, -350], [200, -600, -500], [100, -400, -300], [300, -550, -450]],
  };
  const DD_TYPES = [
    { key: "static", label: "Statikus", short: "Statikus", color: "var(--series-1)" },
    { key: "eod", label: "Nap végi trailing", short: "Nap végi", color: "var(--series-2)" },
    { key: "intraday", label: "Intraday trailing", short: "Intraday", color: "var(--series-3)" },
  ];
  const KIND_LABEL = { start: "kezdés", high: "napi csúcs", low: "napi mélypont", close: "zárás" };

  function fillScenario(name) {
    $("#drawdown-days").innerHTML = SCENARIOS[name].map(([high, low, close], index) => `<tr>
      <th scope="row">${index + 1}. nap</th>
      <td><input name="high-${index}" type="number" step="50" value="${high}" inputmode="decimal" aria-label="${index + 1}. nap legmagasabb eredménye" /></td>
      <td><input name="low-${index}" type="number" step="50" value="${low}" inputmode="decimal" aria-label="${index + 1}. nap legalacsonyabb eredménye" /></td>
      <td><input name="close-${index}" type="number" step="50" value="${close}" inputmode="decimal" aria-label="${index + 1}. nap záró eredménye" /></td>
    </tr>`).join("");
  }

  function renderDrawdown() {
    const form = $("#drawdown-form");
    const input = formNumbers(form);
    const days = SCENARIOS.paper.map((_, index) => ({ high: input[`high-${index}`], low: input[`low-${index}`], close: input[`close-${index}`] }));
    const result = CALC.drawdown({ startBalance: input.startBalance, maxDrawdown: input.maxDrawdown, days });
    const chart = $("#drawdown-chart");
    if (!result) {
      chart.replaceChildren();
      $("#drawdown-legend").replaceChildren();
      $("#drawdown-result").innerHTML = hint("Adj meg pozitív kezdő egyenleget és maximális visszaesést.");
      return;
    }
    const { points } = result;
    const where = (index) => (index === 0 ? "Kezdés" : `${points[index].day}. nap, ${KIND_LABEL[points[index].kind]}`);

    // A nap végi küszöb zárás után lép: a zárás pontján dupla csúcsponttal rajzolunk lépcsőt.
    const eodVertices = points.flatMap((point, index) => {
      const next = points[index + 1] ? points[index + 1].eod : result.finalThresholds.eod;
      return point.kind === "close" && next !== point.eod ? [{ x: index, y: point.eod }, { x: index, y: next }] : [{ x: index, y: point.eod }];
    });
    const series = [
      { label: "Egyenleg", color: "var(--text)", values: points.map((point) => point.equity), endLabel: "Egyenleg" },
      ...DD_TYPES.map((type) => ({
        label: type.label,
        color: type.color,
        values: points.map((point) => point[type.key]),
        vertices: type.key === "eod" ? eodVertices : undefined,
        endLabel: type.short,
      })),
    ];

    if (chart.clientWidth > 0) {
      CHARTS.legend($("#drawdown-legend"), series);
      CHARTS.lineChart(chart, {
        count: points.length,
        series,
        xTicks: points.map((point, index) => ({ point, index })).filter(({ point }) => point.kind === "close").map(({ point, index }) => ({ x: index, label: `${point.day}. nap` })),
        markers: DD_TYPES.filter((type) => result.breaches[type.key] !== null).map((type) => ({ x: result.breaches[type.key], y: points[result.breaches[type.key]].equity, color: type.color })),
        formatY: (value) => fmt(value, 0),
        ariaLabel: "Egyenleg és a három drawdown-küszöb alakulása öt nap alatt. A nyílbillentyűkkel léptethető.",
        height: 300,
        tooltip: (index) => ({
          title: where(index),
          rows: series.map((item) => ({ color: item.color, label: item.label, value: fmt(item.values[index], 0) })),
        }),
      });
    }

    $("#drawdown-result").innerHTML = `<div class="table-wrap"><table>
      <thead><tr><th scope="col">Típus</th><th scope="col" class="num">Küszöb a végén</th><th scope="col" class="num">Maradék mozgástér</th><th scope="col">Állapot</th></tr></thead>
      <tbody>${DD_TYPES.map((type) => {
        const breach = result.breaches[type.key];
        return `<tr><td><i class="chart-key" style="--c: ${type.color}"></i> ${type.label}</td><td class="num">${fmt(result.finalThresholds[type.key], 0)}</td><td class="num">${fmt(result.room[type.key], 0)}</td><td>${breach === null ? '<span class="status is-good">✓ Rendben</span>' : `<span class="status is-bad">× Átlépve: ${where(breach)}</span>`}</td></tr>`;
      }).join("")}</tbody></table></div>`;
  }

  // ---------- Value area építő ----------

  const VA_PRICES = [101.25, 101, 100.75, 100.5, 100.25, 100];
  const VA_EXAMPLE = [70, 140, 230, 320, 180, 60];

  function fillProfile(volumes) {
    $("#va-rows").innerHTML = VA_PRICES.map((price, index) => `<tr>
      <th scope="row">${fixed(price)}</th>
      <td><input name="volume-${index}" type="number" min="0" step="10" value="${volumes[index]}" inputmode="numeric" aria-label="Kötött mennyiség ${fixed(price)} áron" /></td>
    </tr>`).join("");
  }

  function randomProfile() {
    const peak = 1 + Math.floor(Math.random() * 4);
    const top = 250 + Math.floor(Math.random() * 20) * 10;
    return VA_PRICES.map((_, index) => Math.max(20, Math.round((top * Math.exp(-((index - peak) ** 2) / 2.6) + Math.random() * 90) / 10) * 10));
  }

  function renderValueArea() {
    const input = formNumbers($("#va-form"));
    const result = CALC.valueArea(VA_PRICES.map((price, index) => ({ price, volume: input[`volume-${index}`] })), input.target);
    if (!result) {
      $("#va-chart").replaceChildren();
      $("#va-steps").replaceChildren();
      $("#va-summary").innerHTML = hint("Adj meg legalább egy pozitív mennyiséget.");
      return;
    }
    const { rows } = result;
    const max = Math.max(...rows.map((row) => row.volume));
    // Magasabb ár felül, ahogy a platformok többségén.
    $("#va-chart").innerHTML = rows.map((row, index) => ({ row, index })).reverse().map(({ row, index }) => {
      const inside = index >= result.low && index <= result.high;
      const tags = [index === result.pocIndex ? "POC" : "", index === result.high ? "VAH" : "", index === result.low ? "VAL" : ""].filter(Boolean).join(" · ");
      const share = `${fmt((row.volume / result.total) * 100, 1)}%`;
      return `<div class="profile-row${inside ? " is-in" : ""}${index === result.pocIndex ? " is-poc" : ""}" title="${fixed(row.price)}: ${fmt(row.volume, 0)} kontraktus, ${share}">
        <span class="profile-row__price">${fixed(row.price)}</span>
        <span class="profile-row__track"><i style="width: ${Math.max(1, (row.volume / max) * 100)}%"></i></span>
        <span class="profile-row__value">${fmt(row.volume, 0)}${tags ? `<small>${tags}</small>` : ""}</span>
      </div>`;
    }).join("");

    $("#va-summary").innerHTML = rowsHTML([
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

  // ---------- Footprint-számoló ----------

  const FP_PRICES = [101.25, 101, 100.75, 100.5, 100.25, 100];
  const FP_EXAMPLE = [[15, 25], [20, 100], [30, 170], [50, 220], [60, 180], [40, 10]];

  function fillFootprint() {
    $("#fp-rows").innerHTML = FP_PRICES.map((price, index) => `<tr data-price="${price}">
      <th scope="row">${fixed(price)}</th>
      <td><input name="bid-${index}" type="number" min="0" step="5" value="${FP_EXAMPLE[index][0]}" inputmode="numeric" aria-label="Bid volumen ${fixed(price)} áron" /></td>
      <td><input name="ask-${index}" type="number" min="0" step="5" value="${FP_EXAMPLE[index][1]}" inputmode="numeric" aria-label="Ask volumen ${fixed(price)} áron" /></td>
      <td class="num" data-cell="delta"></td><td class="num" data-cell="buy"></td><td class="num" data-cell="sell"></td>
    </tr>`).join("");
  }

  function renderFootprint() {
    const input = formNumbers($("#fp-form"));
    const result = CALC.footprint(FP_PRICES.map((price, index) => ({ price, bid: input[`bid-${index}`], ask: input[`ask-${index}`] })), { ratio: input.ratio || 3, minVolume: input.minVolume || 0 });
    const cell = (row, name) => $(`#fp-rows tr[data-price="${row.price}"] [data-cell="${name}"]`);
    document.querySelectorAll("#fp-rows [data-cell]").forEach((node) => { node.textContent = "–"; node.className = "num"; });
    if (!result || result.rows.length !== FP_PRICES.length) {
      $("#fp-summary").innerHTML = hint("Minden sorba írj nullát vagy pozitív számot.");
      return;
    }
    result.rows.forEach((row, index) => {
      cell(row, "delta").textContent = signed(row.delta, 0);
      const ratio = (value, flagged, tone) => {
        const node = cell(row, tone === "is-good" ? "buy" : "sell");
        node.textContent = value === null ? "–" : `${fmt(value, 2)} : 1`;
        if (flagged) node.classList.add(tone);
      };
      ratio(row.buyRatio, row.buyImbalance, "is-good");
      ratio(row.sellRatio, row.sellImbalance, "is-bad");
      $(`#fp-rows tr[data-price="${row.price}"]`).classList.toggle("is-poc", index === result.pocIndex);
    });
    $("#fp-summary").innerHTML = rowsHTML([
      { label: "Delta", value: signed(result.delta, 0), className: `is-main ${result.delta > 0 ? "is-good" : result.delta < 0 ? "is-bad" : ""}` },
      { label: "Összvolumen", value: fmt(result.volume, 0) },
      { label: "Deltaarány", value: `${signed(result.deltaPercent, 1)}%` },
      { label: "A gyertya POC-ja", value: fixed(result.rows[result.pocIndex].price) },
      { label: "Leghosszabb vételi halmozódás", value: `${result.stackedBuy} sor` },
      { label: "Leghosszabb eladási halmozódás", value: `${result.stackedSell} sor` },
    ]);
  }

  // ---------- Bekötés ----------

  const bind = (selector, render) => {
    const form = $(selector);
    if (!form) return;
    form.addEventListener("input", render);
    form.addEventListener("submit", (event) => { event.preventDefault(); render(); });
  };

  $("#position-form")?.elements.instrument.addEventListener("change", (event) => {
    const value = INSTRUMENTS[event.target.value];
    if (value) $("#position-form").elements.unitValue.value = value;
    renderPosition();
  });
  $("#position-form")?.elements.unitValue.addEventListener("input", () => { $("#position-form").elements.instrument.value = "custom"; });
  $("#drawdown-form")?.elements.scenario.addEventListener("change", (event) => { fillScenario(event.target.value); renderDrawdown(); });
  $("#va-example")?.addEventListener("click", () => { fillProfile(VA_EXAMPLE); renderValueArea(); });
  $("#va-random")?.addEventListener("click", () => { fillProfile(randomProfile()); renderValueArea(); });
  $("#fp-example")?.addEventListener("click", () => { fillFootprint(); renderFootprint(); });

  fillScenario("paper");
  fillProfile(VA_EXAMPLE);
  fillFootprint();
  [["#position-form", renderPosition], ["#expectancy-form", renderExpectancy], ["#consistency-form", renderConsistency], ["#drawdown-form", renderDrawdown], ["#va-form", renderValueArea], ["#fp-form", renderFootprint]]
    .forEach(([selector, render]) => { bind(selector, render); render(); });

  // A diagramnak valós szélesség kell: fülváltás és átméretezés után újrarajzoljuk.
  let resizeTimer = null;
  const redraw = () => setTimeout(renderDrawdown, 0);
  document.addEventListener("click", (event) => { if (event.target.closest("[data-practice-tab], [data-view-target]")) redraw(); });
  window.addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(redraw, 150); });
  window.addEventListener("popstate", redraw);
})();
