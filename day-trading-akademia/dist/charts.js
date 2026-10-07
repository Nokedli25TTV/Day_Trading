// Kis vonaldiagram-motor SVG-ben: egy tengely, hajszálvékony rács, 2 px-es vonalak,
// célkereszt + tooltip egérrel és billentyűzettel. A színeket CSS-változók adják (--series-N).
window.TRADECRAFT_CHARTS = (() => {
  "use strict";

  const NS = "http://www.w3.org/2000/svg";
  const svgEl = (name, attrs = {}, text) => {
    const node = document.createElementNS(NS, name);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const htmlEl = (name, className, text) => {
    const node = document.createElement(name);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  // Kerek osztásközök: 1, 2, 2,5 vagy 5 valamelyik tízes hatványa.
  function niceTicks(min, max, target = 5) {
    if (min === max) { min -= 1; max += 1; }
    const rough = (max - min) / target;
    const power = 10 ** Math.floor(Math.log10(rough));
    const step = [1, 2, 2.5, 5, 10].map((factor) => factor * power).find((candidate) => candidate >= rough);
    const first = Math.floor(min / step) * step;
    const ticks = [];
    for (let value = first; value <= max + step * 0.999; value += step) ticks.push(Number(value.toFixed(10)));
    return ticks;
  }

  // Jelmagyarázat vonalkulccsal. Két vagy több sorozatnál mindig kell.
  function legend(container, series) {
    container.replaceChildren(...series.map((item) => {
      const entry = htmlEl("span", "chart-legend__item");
      const key = htmlEl("i", "chart-key");
      key.style.setProperty("--c", item.color);
      entry.append(key, htmlEl("span", "", item.label));
      return entry;
    }));
  }

  /**
   * config: {
   *   count: az x pozíciók száma (0..count-1),
   *   series: [{ label, color, values: [y indexenként], vertices?: [{x, y}] lépcsős vonalhoz, endLabel?: string }],
   *   xTicks: [{ x, label }], baseline?: number, markers?: [{ x, y, color }],
   *   formatY(value), tooltip(index) -> { title, rows: [{ color, label, value }] }, ariaLabel, height?
   * }
   */
  function lineChart(container, config) {
    const width = Math.max(280, Math.round(container.clientWidth));
    const height = config.height || 260;
    const hasEndLabels = config.series.some((item) => item.endLabel);
    const margin = { top: 14, right: hasEndLabels ? 68 : 14, bottom: 28, left: 12 };

    const allY = config.series.flatMap((item) => (item.vertices ? item.vertices.map((vertex) => vertex.y) : item.values));
    if (Number.isFinite(config.baseline)) allY.push(config.baseline);
    const ticks = niceTicks(Math.min(...allY), Math.max(...allY));
    const yMin = ticks[0];
    const yMax = ticks[ticks.length - 1];
    const tickLabels = ticks.map(config.formatY);
    margin.left = 14 + Math.max(...tickLabels.map((label) => label.length)) * 6.6;

    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const x = (index) => margin.left + (config.count > 1 ? (index / (config.count - 1)) * plotWidth : plotWidth / 2);
    const y = (value) => margin.top + (1 - (value - yMin) / (yMax - yMin)) * plotHeight;

    const svg = svgEl("svg", { class: "chart", width, height, viewBox: `0 0 ${width} ${height}`, role: "img", "aria-label": config.ariaLabel, tabindex: "0" });

    ticks.forEach((tick, index) => {
      const isBaseline = Number.isFinite(config.baseline) ? tick === config.baseline : index === 0;
      svg.append(svgEl("line", { class: isBaseline ? "chart-axis" : "chart-grid", x1: margin.left, x2: width - margin.right, y1: y(tick), y2: y(tick) }));
      svg.append(svgEl("text", { class: "chart-tick", x: margin.left - 8, y: y(tick) + 4, "text-anchor": "end" }, tickLabels[index]));
    });
    config.xTicks.forEach((tick) => {
      svg.append(svgEl("text", { class: "chart-tick", x: x(tick.x), y: height - 8, "text-anchor": tick.x === 0 ? "start" : tick.x === config.count - 1 ? "end" : "middle" }, tick.label));
    });

    config.series.forEach((item) => {
      const vertices = item.vertices || item.values.map((value, index) => ({ x: index, y: value }));
      const path = vertices.map((vertex, index) => `${index ? "L" : "M"}${x(vertex.x).toFixed(1)} ${y(vertex.y).toFixed(1)}`).join("");
      svg.append(svgEl("path", { class: "chart-line", d: path, style: `--c: ${item.color}` }));
    });

    (config.markers || []).forEach((marker) => {
      svg.append(svgEl("circle", { class: "chart-dot", cx: x(marker.x), cy: y(marker.y), r: 5, style: `--c: ${marker.color}` }));
    });

    // Végcímkék csak ott, ahol nem ütköznek; a többit a jelmagyarázat és a tooltip viszi.
    const ends = config.series.filter((item) => item.endLabel)
      .map((item) => ({ item, top: y(item.values[item.values.length - 1]) }))
      .sort((a, b) => a.top - b.top);
    ends.forEach((end, index) => {
      const crowded = (ends[index - 1] && end.top - ends[index - 1].top < 15) || (ends[index + 1] && ends[index + 1].top - end.top < 15);
      if (crowded && ends.length > 1) return;
      svg.append(svgEl("text", { class: "chart-end-label", x: width - margin.right + 8, y: end.top + 4 }, end.item.endLabel));
    });

    // Hover réteg: a célkereszt a legközelebbi x pozícióra ugrik.
    const cross = svgEl("line", { class: "chart-cross", y1: margin.top, y2: margin.top + plotHeight, visibility: "hidden" });
    const dots = config.series.map((item) => svgEl("circle", { class: "chart-dot", r: 4.5, style: `--c: ${item.color}`, visibility: "hidden" }));
    svg.append(cross, ...dots);
    const tip = htmlEl("div", "chart-tip");
    tip.hidden = true;
    let active = -1;

    const show = (index) => {
      active = Math.max(0, Math.min(config.count - 1, index));
      const px = x(active);
      cross.setAttribute("x1", px);
      cross.setAttribute("x2", px);
      cross.setAttribute("visibility", "visible");
      config.series.forEach((item, seriesIndex) => {
        dots[seriesIndex].setAttribute("cx", px);
        dots[seriesIndex].setAttribute("cy", y(item.values[active]));
        dots[seriesIndex].setAttribute("visibility", "visible");
      });
      const content = config.tooltip(active);
      const rows = content.rows.map((row) => {
        const line = htmlEl("div", "chart-tip__row");
        const key = htmlEl("i", "chart-key");
        if (row.color) key.style.setProperty("--c", row.color); else key.style.visibility = "hidden";
        line.append(key, htmlEl("strong", "", row.value), htmlEl("span", "", row.label));
        return line;
      });
      tip.replaceChildren(htmlEl("div", "chart-tip__title", content.title), ...rows);
      tip.hidden = false;
      const flip = px + tip.offsetWidth + 16 > width;
      tip.style.left = `${flip ? px - tip.offsetWidth - 12 : px + 12}px`;
      tip.style.top = `${margin.top}px`;
    };
    const hide = () => {
      active = -1;
      tip.hidden = true;
      cross.setAttribute("visibility", "hidden");
      dots.forEach((dot) => dot.setAttribute("visibility", "hidden"));
    };

    svg.addEventListener("pointermove", (event) => {
      const rect = svg.getBoundingClientRect();
      const ratio = (event.clientX - rect.left - margin.left) / plotWidth;
      show(Math.round(ratio * (config.count - 1)));
    });
    svg.addEventListener("pointerleave", hide);
    svg.addEventListener("blur", hide);
    svg.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      show(active < 0 ? config.count - 1 : active + (event.key === "ArrowRight" ? 1 : -1));
    });

    container.replaceChildren(svg, tip);
  }

  return { lineChart, legend };
})();
