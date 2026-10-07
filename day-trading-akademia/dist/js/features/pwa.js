// Offline működés és telepíthetőség: a service worker regisztrálása és a telepítés gomb.
import { showToast } from "../toast.js";
import { $ } from "../util.js";

let installPrompt = null;

export function initPWA() {
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("./sw.js").catch(() => { /* a lap service worker nélkül is működik */ });
  }
  const button = $("#install-app");
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    button.hidden = false;
  });
  window.addEventListener("appinstalled", () => {
    button.hidden = true;
    showToast("Az alkalmazás telepítve.");
  });
  button.addEventListener("click", async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    button.hidden = true;
  });
}
