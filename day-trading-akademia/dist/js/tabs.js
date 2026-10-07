// Fülek egységesen: a gomb data-tab="csoport:név", a panel data-panel="csoport:név".
// Bármely elem válthat fület a data-tab attribútummal, akkor is, ha közben nézetet is vált.
import { $$ } from "./util.js";

const current = new Map();
const listeners = new Map();

export const currentTab = (group) => current.get(group);

export function onTab(group, listener) {
  if (!listeners.has(group)) listeners.set(group, []);
  listeners.get(group).push(listener);
}

export function activateTab(group, name) {
  $$(`[role="tab"][data-tab^="${group}:"]`).forEach((button) => {
    const active = button.dataset.tab === `${group}:${name}`;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  $$(`[data-panel^="${group}:"]`).forEach((panel) => { panel.hidden = panel.dataset.panel !== `${group}:${name}`; });
  current.set(group, name);
  (listeners.get(group) || []).forEach((listener) => listener(name));
}

export function initTabs() {
  $$('[role="tab"][data-tab].active').forEach((button) => {
    const [group, name] = button.dataset.tab.split(":");
    current.set(group, name);
  });
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-tab]");
    if (!button) return;
    const [group, name] = button.dataset.tab.split(":");
    activateTab(group, name);
  });
}
