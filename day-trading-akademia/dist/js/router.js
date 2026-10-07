// Nézetváltás és útvonalak. A hash a forrás: #roadmap, #lecke/<id>.
import { DATA } from "../data.js";
import { GLOSSARY } from "../content/fogalomtar.js";
import { allLessons } from "./lessons.js";
import { $, $$, setText, capitalize } from "./util.js";

const todayLabel = capitalize(new Intl.DateTimeFormat("hu-HU", { month: "long", day: "numeric", weekday: "long" }).format(new Date()));

const views = {
  attekintes: { title: "Áttekintés", subtitle: todayLabel },
  roadmap: { title: "Roadmap", subtitle: `24 hét, ${DATA.modules.length} mérföldkő, ${allLessons.length} lecke` },
  tananyag: { title: "Tananyag", subtitle: `${allLessons.length} lecke és ${GLOSSARY.length} fogalom a saját jegyzeteidből` },
  lecke: { title: "Lecke", subtitle: "" },
  gyakorlas: { title: "Gyakorlás", subtitle: "Kvíz, ismétlés és laborok" },
  naplo: { title: "Napló", subtitle: "A folyamat számít, nem az eredmény" },
};

let currentView = "attekintes";
const shownListeners = [];
const leaveListeners = [];
const routes = [];

export const getCurrentView = () => currentView;
export const viewTitle = (view) => views[view]?.title || "";
export const onViewShown = (listener) => shownListeners.push(listener);
export const onViewLeave = (listener) => leaveListeners.push(listener);
// Egy modul saját útvonalat vehet fel, például "lecke/" előtaggal.
export const registerRoute = (prefix, handler) => routes.push({ prefix, handler });

// Az aktív menüpont mögötti kapszula helye. Az első pozicionálás ugrik, csak utána animál.
export function positionNavIndicator() {
  const nav = $(".main-nav");
  const active = nav?.querySelector(".nav-item.active");
  if (!nav || !active) return;
  nav.style.setProperty("--l", `${active.offsetLeft}px`);
  nav.style.setProperty("--r", `${nav.clientWidth - active.offsetLeft - active.offsetWidth}px`);
  setTimeout(() => nav.classList.add("is-ready"), 50);
}

// options: { updateHash, title, eyebrow, hash, nav } – az utóbbi négyet az alnézetek (lecke) adják meg.
export function showView(view, options = {}) {
  if (!views[view] || (view === "lecke" && !options.title)) view = "attekintes";
  leaveListeners.forEach((listener) => listener(currentView, view));
  currentView = view;
  const navView = options.nav || view;

  $$(".app-view").forEach((section) => {
    const active = section.dataset.view === view;
    section.hidden = !active;
    section.classList.toggle("active", active);
  });
  $$(".nav-item").forEach((button) => {
    const active = button.dataset.viewTarget === navView;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
  });
  positionNavIndicator();

  const title = options.title || views[view].title;
  setText("#page-title", title);
  setText("#page-eyebrow", options.eyebrow ?? views[view].subtitle);
  document.title = view === "attekintes" ? "TradeCraft Akadémia" : `${title} · TradeCraft Akadémia`;

  const hash = options.hash || `#${view}`;
  if (options.updateHash !== false && location.hash !== hash) history.pushState(null, "", hash);
  window.scrollTo(0, 0);
  shownListeners.forEach((listener) => listener(view));
}

export function route(updateHash = false) {
  const target = decodeURIComponent(location.hash.slice(1));
  const match = routes.find((entry) => target.startsWith(entry.prefix));
  if (match && match.handler(target.slice(match.prefix.length), updateHash)) return;
  showView(views[target] && target !== "lecke" ? target : "attekintes", { updateHash });
}

export function initRouter() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-view-target]");
    if (button) showView(button.dataset.viewTarget);
  });
  window.addEventListener("popstate", () => route(false));
  window.addEventListener("resize", positionNavIndicator);
  document.fonts?.ready.then(positionNavIndicator);
}
