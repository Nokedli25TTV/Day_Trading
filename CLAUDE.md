# TradeCraft Akadémia

Magyar nyelvű, egyfelhasználós day trading tanulófelület. A tulajdonos saját jegyzeteiből
(`Day Trading RoadMap.md`, `Orderflow_tanulasi_jegyzet.md`) épül: 6 hónapos terv, 35 lecke,
kvíz, laborok, gyakorlási napló, Go/No-Go lista. Oktatási eszköz, nem befektetési tanácsadás.

- Repó: https://github.com/Nokedli25TTV/Day_Trading, fő ág: `main`. **Nyilvános** 2026-10-08 óta, a tulajdonos
  kifejezett döntése alapján: minden, amit ide feltöltesz, bárki számára olvasható. Titkot, jelszót és új személyes
  adatot ne commitolj.
- A felhasználóval magyarul beszélj. A felület, a kódkommentek és a commitüzenetek is magyarok.

## A legfontosabb szabály: kis modulok

**Ne írj nagy, mindent tartalmazó fájlt.** A felhasználó kifejezetten kérte, hogy a kód ne egyetlen
JS fájlban legyen. Minden funkció a saját moduljában él; új funkcióhoz új modul készül.
Ha egy fájl 250 sor fölé nő, bontsd szét, mielőtt továbbírod.

## Futtatás és ellenőrzés

Nincs build lépés és nincs függőség: a `day-trading-akademia/dist` mappa maga az oldal.
A kód ES modulokból áll, ezért webszerverről kell megnyitni (fájlként megnyitva nem indul el).
A felhasználó a gyökérben lévő `Inditas.bat` fájllal indítja: ez elindítja a `preview-server.mjs`-t
(`http://127.0.0.1:4173`) és megnyitja a böngészőt. Ha az alkalmazás nem indul el, az `index.html`
alján lévő figyelő látható hibaüzenetet tesz ki (`#boot-error`); a `main.js` a `window.tradecraftReady`
jelzővel szól, hogy elindult.

```bash
node .claude/static-server.mjs                 # előnézet (a .claude/launch.json "akademia" konfigja ezt indítja)
cd day-trading-akademia && node --test         # az összes teszt
node day-trading-akademia/tools/make-icons.mjs # az alkalmazásikonok újragenerálása
```

- A `?qa=1` paraméter külön tárolókulcsot használ (`tradecraft-academy-qa-v1`), így a teszt
  nem nyúl a valódi haladáshoz. Tesztelés után töröld ezt a kulcsot. A képernyőképek IndexedDB-je
  közös: a tesztben mentett képet is töröld (`deleteAttachment`).
- Ha a Claude ablaka háttérben van, a böngészőpanel nem rajzol: a képernyőkép időtúllépést ad,
  az átmenetek megakadnak, és a `requestAnimationFrame` nem fut le. Ilyenkor a DOM-ból ellenőrizz
  (`javascript_tool`), és a kódban időzítéshez `setTimeout`-ot használj, ne rAF-et.
- Azonos URL-re navigálva (csak a hash változik) az oldal nem töltődik újra: módosítás után
  `location.reload()` kell.
- Minden felületi változtatás után nézd meg: asztali és 375 px-es szélesség, világos és sötét mód,
  konzolhibák, vízszintes görgetés (`document.documentElement.scrollWidth`).
- A `day-trading-akademia/.openai/hosting.json` egy külső tárhely beállítása, amelyhez innen nincs
  feltöltőeszköz. Az élő oldalt a felhasználó frissíti.

## Közzététel jelszóval

A `dist` mappa a helyi, nyílt változat. Amíg a repó nyilvános, a tananyag a forrásban is olvasható, így a jelszavas
kiadás csak kényelmi kapu, nem valódi védelem; valódi védelemhez a forrásnak privátnak kell lennie.
A nyilvános kiadást a `node tools/build-public.mjs` állítja elő a `day-trading-akademia/public` mappába
(a git nem követi). Ebben a tananyag egyetlen titkosított fájl (`content.enc.json`, AES-256-GCM,
PBKDF2-SHA256 600 000 körrel), a `data.js`, a `content/index.js` és a `content/fogalomtar.js` helyén pedig
átadó modul áll, amely a `js/lock/unlock.js`-re vár. Az alkalmazás többi modulja változatlan.

- A jelszót a felhasználó adja meg (a szkript rákérdez, vagy `SITE_PASSWORD` környezeti változó). Ne te válaszd,
  ne írd le csevegésben, és ne kerüljön a repóba.
- A `tests/lock.test.mjs` tesztjelszava csak tesztekhez és helyi próbához való. Próba után töröld a `public` mappát.
- Helyi próba: `preview_start` az `akademia-public` konfiggal.
- A védelem a tananyagra szól. A felhasználó naplója és haladása nincs a szerveren: minden böngészőben külön tárolódik.
- Ez megosztott jelszó, nem felhasználói fiók: nincs szerver, így nincs jelszó-visszaállítás és próbálkozáskorlát sem.

## Felépítés

Minden a `day-trading-akademia/dist` alatt van. Az `index.html` egyetlen `<script type="module" src="./js/main.js">`
sort tölt be; a többi modul importtal kapcsolódik.

| Hely | Szerep |
|---|---|
| `index.html` | Az összes nézet jelölője. A JS az `id`-kre és `data-*` attribútumokra kapaszkodik. |
| `css/*.css` | Téma szerint bontva; a betöltési sorrend számít (lásd lent). |
| `data.js` | `DATA`: modulok és leckevázak, kvízkérdések, források. |
| `content/0N-*.js` | A leckék törzsanyaga modulonként; a `content/index.js` fűzi össze `CONTENT`-té. |
| `content/fogalomtar.js` | `GLOSSARY`: `[kifejezés, magyarázat, leckeId]` sorok. |
| `js/main.js` | Belépési pont: csak a modulok bekötési sorrendje. |
| `js/store.js` | Az állapot: betöltés, mentés, `commit()`, `onRender()`. |
| `js/router.js`, `js/tabs.js` | Nézetváltás hash-sel; fülek `data-tab="csoport:név"` / `data-panel` párokkal. |
| `js/lessons.js`, `js/review-deck.js`, `js/labels.js`, `js/util.js` | Közös modell és segédfüggvények. |
| `js/logic/` | **Tiszta számolás**, DOM és állapot nélkül, tesztekkel: `calc`, `dates`, `schedule`, `review`, `readiness`, `search`. |
| `js/views/` | Egy nézet vagy fül = egy modul (`overview`, `roadmap`, `readiness`, `library`, `lesson`, `quiz`, `review`, `labs`, `journal`, `questions`, `stats`, `weekly-review`, `settings`). |
| `js/features/` | Nézetfüggetlen funkciók (`backup`, `attachments`, `idb`, `search`, `terms`, `study-time`, `pwa`, `webmcp`). |
| `js/lock/` | A nyilvános kiadás belépése: `crypto.js` (böngészőben és Node-ban is fut), `unlock.js`. Helyben nem töltődik be. |
| `js/charts.js`, `js/diagrams.js` | SVG vonaldiagram; leckeábrák és a laborokkal közös megjelenítők. |
| `sw.js`, `manifest.webmanifest`, `icons/` | Offline működés és telepíthetőség. |
| `tools/` | `build-public.mjs` (titkosított kiadás), `make-icons.mjs` (ikonok). |
| `tests/` | `node --test`: számolás, logika, tartalom épsége, offline lista és jelölők. |

### Hogyan kapcsolódnak a modulok

- Minden nézet exportál egy `initX()` függvényt: ez köti be az eseményeket, és `onRender(render)`-rel
  feliratkozik az újrarajzolásra. A `main.js` hívja őket.
- Állapotot módosítani: írd át a `state`-et, majd `commit("üzenet")` (mentés + minden nézet újrarajzolása).
  Ha gépelés közben nem akarsz újrarajzolni, `save()` és célzott DOM-frissítés.
- Nézetek nem importálják egymást körkörösen: közös dolog a `lessons.js`-be, `util.js`-be vagy a `logic/` alá kerül.
- Diagramot csak látható konténerbe lehet rajzolni: `onViewShown()`, `onTab()` és átméretezés után rajzolj újra.

### Állapot

Egyetlen objektum a `localStorage`-ben (`tradecraft-academy-v1`). Alakját a `createDefaultState()` adja meg
a `store.js`-ben; régi és importált mentést a `normalizeState()` egészít ki. **Új mezőt mindig mindkettőbe
vegyél fel**, különben a meglévő felhasználói adat eltörik.

Mezők: `profile` (napi cél, `dailyLimitR`, `startDate`, `lastExportAt`), `progress[leckeId]`, `quizAttempts`,
`journalEntries`, `questions`, `reviews[kártyaId]`, `studyLog[nap]`, `weeklyReviews`, `readiness[kulcs]`,
`mocks`, `activityDates`, `settings`.

IndexedDB (`tradecraft-akademia`): a napló képernyőképei és az automatikus mentés fájlkezelője.
Ezek nincsenek benne a JSON mentésben.

### Új fájl hozzáadásakor

1. Vedd fel a `sw.js` `ASSETS` listájába (a `tests/pwa.test.mjs` elbukik, ha kimarad).
2. Új stíluslapot az `index.html`-be is kösd be a megfelelő helyre.
3. Ha a JS új `id`-t keres, legyen meg az `index.html`-ben (ezt is teszt ellenőrzi).

### CSS betöltési sorrend

`tokens → base → layout → components → overview → lessons → practice → journal → features → responsive`.
A médialekérdezések a `responsive.css`-be (vagy a `features.css` végére) kerülnek: ha korábbi fájlba
teszed őket, a később betöltött alapszabály felülírja, és telefonon szétesik az elrendezés.

## Tartalom bővítése

- **Új lecke:** váz a `data.js` megfelelő moduljába (`id`, `week`, `title`, `duration`, `summary`,
  `keyPoints`, `exercise`, `sourceTag`), törzsanyag a modul `content/` fájljába ugyanazzal az `id`-val.
- **Törzsanyag szerkezete:** `sections[]` (`title`, opcionális `intro[]`, `table {head, rows}`, `diagram`,
  `list[]`, `body[]`, ebben a megjelenítési sorrendben), `example`, `mistakes[]`, `check[] {q, a}`.
  Az egyetlen megengedett szövegjelölés a `**kiemelés**`.
- **Ábra:** a blokk `diagram` mezője egy név a `js/diagrams.js` `DIAGRAMS` táblájából, `diagramCaption` a képaláírás.
- **Kvízkérdés:** a `lesson` mező a kapcsolódó lecke `id`-ja. A válaszok körönként keverednek.
- A `check` kérdések és a hibás kvízválaszok automatikusan bekerülnek az ismétlő pakliba; a fogalomtár
  kifejezései automatikusan kattinthatók a leckeszövegben (`js/features/terms.js`).
- A tartalom a két jegyzetből származik. Ne írj bele olyat, ami nincs a jegyzetekben vagy a forráslistában,
  és ne nevezz meg cégeket: a cégspecifikus adatok gyorsan elavulnak.
- Időérzékeny állítás mellé mindig kerüljön forrás és dátum. A szabályozási lecke FINRA- és ESMA-állításait
  2026-10-07-én ellenőriztük a hivatalos oldalakon; az adózási lecke a jegyzet összefoglalóját követi.

## Dizájn

Papír + kék tinta: nyugodt tanulófelület, szándékosan nem „kereskedési terminál”.

- **Színek:** OKLCH tokenek a `css/tokens.css`-ben. A sötét értékek kétszer szerepelnek
  (`prefers-color-scheme` és `[data-theme="dark"]`): mindkettőt módosítsd.
- **A zöld és a piros jelentést hordoz** (helyes/hibás, bid/ask, nyerő/vesztő R). Díszítésre és
  haladásjelzésre a kék (`--accent`) való.
- **Diagramok:** `--series-1..3` a dataviz referencia-palettából, a saját felületeinken ellenőrizve
  (`validate_palette.js --pairs all`). Egy tengely, hajszálvékony rács, 2 px-es vonal, a szöveg soha nem
  veszi fel az adatszínt, két vagy több sorozatnál jelmagyarázat, tooltip egérrel és nyílbillentyűkkel.
- **Elrendezés:** listasorok és elválasztó vonalak, kártyarács helyett. Az egyetlen telített felület
  az áttekintés „Következő lecke” blokkja.
- **Navigáció:** lebegő üveg kapszula (felül, telefonon alul); az aktív elem jelölője `clip-path`-szal csúszik.
- **Tipográfia:** Instrument Sans, rögzített rem skála. Számoszlopokban `tabular-nums`.
- **Mozgás:** 150–280 ms, `--ease-out`, csak `transform`, `opacity` és `clip-path`.
- **Szöveg:** nincs hosszú gondolatjel (—), nincs nagybetűs címkézés, nincs ismételt címsor.

## Kódolási szabályok

- Sima JavaScript ES modulokban, keretrendszer és build nélkül. Új függőség csak a felhasználó kérésére.
- Felhasználói szöveg a DOM-ba csak `escapeHTML()`-en vagy `textContent`-en át kerülhet.
- Számolás a `js/logic/` alá, teszttel. Megjelenítés a `js/views/` vagy `js/features/` alá.
- Elrendezési tulajdonságot ne animálj; egyoszlopos rácsnál `minmax(0, 1fr)`, különben a széles
  táblázat szétnyomja az oldalt telefonon.
- Minden interaktív elem billentyűzettel is működjön, és legyen látható fókusza.

## Történet

- **1. kör (2026-10-07):** teljes újratervezés. Sötét neonzöld kártyás felület helyett papír + tinta megjelenés,
  világos és sötét mód, lecke olvasónézet felugró ablak helyett, élő kalkulátorok.
- **2. kör:** a tananyag 24 leckéről 35-re bővült részletes törzsanyaggal, fogalomtár (89 fogalom),
  30 kérdéses sorsolt kvíz, lebegő üveg navigáció.
- **3. kör:** git és GitHub, napló-statisztika R-görbével, Orderflow-labor és Prop szabályok, időzített ismétlés,
  heti terv, tanulási idő mérése és naptár.
- **4. kör:** az 1300 soros `app.js` szétbontva 38 ES modulra, a stíluslap 10 fájlra. Automatikus mentés fájlba
  és mentési emlékeztető, naplóbejegyzés szerkesztése, képernyőképek, CSV export. Napi limit követése, heti review,
  Go/No-Go lista, mock evaluation követő. Offline működés (service worker, telepíthető). Leckeábrák, kattintható
  fogalmak, labor-hivatkozások a leckékből. Gyorskereső (Ctrl+K), billentyűk az ismétléshez. 48 teszt.
- **5. kör:** indító (`Inditas.bat`) és látható indulási hibaüzenet. Jelszóval védett nyilvános kiadás:
  titkosított tananyag, belépőoldal, „maradjak bejelentkezve”, kijelentkezés. 54 teszt.

### Nyitott ötletek

- A betűtípus helyben tárolása (most a service worker gyorsítótárazza az első online betöltés után).
- Szabálykönyv- és ha–akkor szerkesztő, nyomtatható egyoldalas formában.
- A képernyőképek belefoglalása a mentésbe (például külön ZIP export).
- További leckeábrák: delta és CVD, erőfeszítés és eredmény, session-idők.
- A tartalom lektorálása a felhasználóval; az adózási lecke ellenőrzése szakemberrel.
- Az élő (hosztolt) oldal frissítése: ehhez a felhasználó tárhely-hozzáférése kell.
