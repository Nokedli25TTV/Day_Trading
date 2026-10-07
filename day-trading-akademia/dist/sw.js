// Service worker: az oldal net nélkül is megnyílik.
// Stratégia: a saját fájlok hálózat-először töltődnek (mindig a friss verzió), és csak hiba esetén jön a tárolt másolat.
// Új fájl hozzáadásakor vedd fel az ASSETS listába: a tests/pwa.test.mjs ellenőrzi, hogy semmi nem maradt ki.

const CACHE = "tradecraft-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./data.js",
  "./content/index.js",
  "./content/01-alapmechanika.js",
  "./content/02-kontextus.js",
  "./content/03-kockazat.js",
  "./content/04-strategia.js",
  "./content/05-pszichologia.js",
  "./content/06-diligence.js",
  "./content/fogalomtar.js",
  "./css/tokens.css",
  "./css/base.css",
  "./css/layout.css",
  "./css/components.css",
  "./css/overview.css",
  "./css/lessons.css",
  "./css/practice.css",
  "./css/journal.css",
  "./css/features.css",
  "./css/lock.css",
  "./css/responsive.css",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./js/main.js",
  "./js/store.js",
  "./js/util.js",
  "./js/toast.js",
  "./js/tabs.js",
  "./js/router.js",
  "./js/lessons.js",
  "./js/labels.js",
  "./js/review-deck.js",
  "./js/charts.js",
  "./js/diagrams.js",
  "./js/lock/crypto.js",
  "./js/lock/unlock.js",
  "./js/logic/calc.js",
  "./js/logic/dates.js",
  "./js/logic/readiness.js",
  "./js/logic/review.js",
  "./js/logic/schedule.js",
  "./js/logic/search.js",
  "./js/features/attachments.js",
  "./js/features/backup.js",
  "./js/features/idb.js",
  "./js/features/pwa.js",
  "./js/features/search.js",
  "./js/features/study-time.js",
  "./js/features/terms.js",
  "./js/features/webmcp.js",
  "./js/views/journal.js",
  "./js/views/labs.js",
  "./js/views/lesson.js",
  "./js/views/library.js",
  "./js/views/overview.js",
  "./js/views/questions.js",
  "./js/views/quiz.js",
  "./js/views/readiness.js",
  "./js/views/review.js",
  "./js/views/roadmap.js",
  "./js/views/settings.js",
  "./js/views/stats.js",
  "./js/views/weekly-review.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("tradecraft-") && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  const isFont = /^fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (url.origin !== self.location.origin && !isFont) return;

  // A betűtípus ritkán változik: elég egyszer letölteni, utána a tárolt példány megy.
  if (isFont) {
    event.respondWith(caches.open(CACHE).then(async (cache) => (await cache.match(request)) || fetch(request).then((response) => {
      cache.put(request, response.clone());
      return response;
    })));
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request, { ignoreSearch: true }).then((cached) => cached || caches.match("./index.html"))),
  );
});
