// Belépés a nyilvános kiadásban. Ezt a modult csak a tools/build-public.mjs köti be (a data.js helyére):
// amíg a jelszó nincs meg, a tananyag titkosítva marad, és az alkalmazás többi modulja várakozik.
import { decryptJSON, keyFromPassword, exportKey, importKey } from "./crypto.js";

const REMEMBER_KEY = "tradecraft-unlock-v1";
const root = document.documentElement;
const $ = (selector) => document.querySelector(selector);

// Az index.html indulási figyelője ebből tudja, hogy a modulok betöltődtek, csak a jelszóra várunk.
window.tradecraftBooting = true;
root.dataset.locked = "1";

function finish(bundle) {
  delete root.dataset.locked;
  delete window.tradecraftBooting;
  $("#lock").hidden = true;
  const logout = $("#lock-logout");
  logout.hidden = false;
  logout.addEventListener("click", () => {
    localStorage.removeItem(REMEMBER_KEY);
    location.reload();
  });
  return bundle;
}

async function unlock() {
  const error = $("#lock-error");
  let payload;
  try {
    const response = await fetch("./content.enc.json", { cache: "no-store" });
    if (!response.ok) throw new Error(String(response.status));
    payload = await response.json();
  } catch {
    $("#lock").hidden = false;
    $("#lock-form").querySelectorAll("input, button").forEach((control) => { control.disabled = true; });
    error.textContent = "A tartalom nem tölthető be. Ellenőrizd a kapcsolatot, majd frissítsd az oldalt.";
    return new Promise(() => {});
  }

  const remembered = localStorage.getItem(REMEMBER_KEY);
  if (remembered) {
    try {
      return finish(await decryptJSON(payload, await importKey(remembered)));
    } catch {
      // A jelszó közben megváltozott: a régi kulcs már nem nyit.
      localStorage.removeItem(REMEMBER_KEY);
    }
  }

  const form = $("#lock-form");
  const input = $("#lock-password");
  const button = form.querySelector("button");
  $("#lock").hidden = false;
  input.focus();

  return new Promise((resolve) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      button.disabled = true;
      error.textContent = "";
      button.textContent = "Ellenőrzés…";
      try {
        const key = await keyFromPassword(payload, input.value);
        const bundle = await decryptJSON(payload, key);
        if ($("#lock-remember").checked) localStorage.setItem(REMEMBER_KEY, await exportKey(key));
        input.value = "";
        resolve(finish(bundle));
      } catch {
        error.textContent = "Hibás jelszó. Próbáld újra.";
        input.select();
      } finally {
        button.disabled = false;
        button.textContent = "Belépés";
      }
    });
  });
}

export const bundle = await unlock();
