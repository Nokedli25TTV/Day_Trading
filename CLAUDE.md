# TradeCraft Akadémia

Magyar nyelvű, egyfelhasználós day trading tanulófelület. A tulajdonos saját jegyzeteiből
(`Day Trading RoadMap.md`, `Orderflow_tanulasi_jegyzet.md`) épül: 6 hónapos terv, 35 lecke,
kvíz, laborok, gyakorlási napló. Oktatási eszköz, nem befektetési tanácsadás.

- Repó: https://github.com/Nokedli25TTV/Day_Trading (privát), fő ág: `main`
- A felhasználóval magyarul beszélj. A felület, a kódkommentek és a commitüzenetek is magyarok.

## Futtatás és ellenőrzés

Nincs build lépés és nincs függőség: a `day-trading-akademia/dist` mappa maga az oldal.

```bash
node .claude/static-server.mjs            # előnézet (a .claude/launch.json "akademia" konfigja ezt indítja)
node day-trading-akademia/tests/calc.test.mjs   # a számolófüggvények tesztjei a leckék példáival
```

- A `?qa=1` paraméter külön tárolókulcsot használ (`tradecraft-academy-qa-v1`), így a teszt
  nem nyúl a valódi haladáshoz. Tesztelés után töröld ezt a kulcsot.
- Ha a Claude ablaka háttérben van, a böngészőpanel nem rajzol: a képernyőkép időtúllépést ad,
  és a `requestAnimationFrame` nem fut le. Ilyenkor a DOM-ból ellenőrizz (`javascript_tool`),
  és időzítéshez `setTimeout`-ot használj, ne rAF-et.
- Azonos URL-re navigálva (csak a hash változik) az oldal nem töltődik újra: módosítás után
  `location.reload()` kell.
- Minden felületi változtatás után nézd meg: asztali és 375 px-es szélesség, világos és sötét
  mód, konzolhibák, vízszintes görgetés (`document.documentElement.scrollWidth`).
- A `day-trading-akademia/.openai/hosting.json` egy külső tárhely beállítása. Oda csak a
  felhasználó kifejezett kérésére tölts fel.

## Felépítés

Minden fájl a `day-trading-akademia/dist` alatt van, sima `<script defer>` sorrendben töltődik.

| Fájl | Szerep |
|---|---|
| `index.html` | Az összes nézet jelölője. A JS az `id`-kre és `data-*` attribútumokra kapaszkodik. |
| `styles.css` | Tokenek (világos + kétszer a sötét), komponensek, töréspontok a fájl végén. |
| `data.js` | `TRADECRAFT_DATA`: modulok és leckevázak, kvízkérdések, források. |
| `content/0N-*.js` | `TRADECRAFT_CONTENT[leckeId]`: a leckék részletes törzsanyaga modulonként. |
| `content/fogalomtar.js` | `TRADECRAFT_GLOSSARY`: `[kifejezés, magyarázat, leckeId]` sorok. |
| `calc.js` | `TRADECRAFT_CALC`: tiszta számolófüggvények, DOM és állapot nélkül. Tesztelt. |
| `charts.js` | `TRADECRAFT_CHARTS`: SVG vonaldiagram célkereszttel és tooltippel. |
| `labs.js` | Állapot nélküli laborok (pozícióméret, várható érték, value area, footprint, drawdown, consistency). |
| `app.js` | Állapot, nézetváltás, minden állapotfüggő megjelenítés (lecke, napló, statisztika, ismétlés, heti terv). |

### Állapot

Egyetlen objektum a `localStorage`-ben (`tradecraft-academy-v1`). Alakját a `createDefaultState()`
adja meg az `app.js` elején; régi és importált mentést a `normalizeState()` egészít ki. Új mezőt
mindig mindkettőbe vegyél fel, különben a meglévő felhasználói adat eltörik.

Főbb mezők: `profile` (napi cél, `startDate` a heti tervhez), `progress[leckeId]`, `quizAttempts`,
`journalEntries`, `questions`, `reviews[kártyaId]` (időzített ismétlés: `box`, `due`), `studyLog[nap]`
(másodperc), `activityDates`, `settings`.

### Navigáció

Nézetek: `attekintes`, `roadmap`, `tananyag`, `lecke`, `gyakorlas`, `naplo`. A `showView()` vált,
a hash a forrás (`#lecke/<id>`), a böngésző Vissza gombja a `popstate`-en át működik.

## Tartalom bővítése

- **Új lecke:** váz a `data.js` megfelelő moduljába (`id`, `week`, `title`, `duration`, `summary`,
  `keyPoints`, `exercise`, `sourceTag`), törzsanyag a modul `content/` fájljába ugyanazzal az `id`-val.
- **Törzsanyag szerkezete:** `sections[]` (`title`, opcionális `intro[]`, `table {head, rows}`, `list[]`,
  `body[]`, ebben a megjelenítési sorrendben), `example`, `mistakes[]`, `check[] {q, a}`.
  Az egyetlen megengedett szövegjelölés a `**kiemelés**`.
- **Kvízkérdés:** a `lesson` mező a kapcsolódó lecke `id`-ja. A helyes válasz helye mindegy, a
  válaszok körönként keverednek.
- A `check` kérdések és a hibás kvízválaszok automatikusan bekerülnek az ismétlő pakliba.
- A tartalom a két jegyzetből származik. Ne írj bele olyat, ami nincs a jegyzetekben vagy a
  forráslistában, és ne nevezz meg cégeket: a cégspecifikus adatok gyorsan elavulnak.
- Időérzékeny állítás mellé mindig kerüljön forrás és dátum.

## Dizájn

Papír + kék tinta: nyugodt tanulófelület, szándékosan nem „kereskedési terminál”.

- **Színek:** OKLCH tokenek a `:root`-ban. A sötét értékek kétszer szerepelnek
  (`prefers-color-scheme` és `[data-theme="dark"]`): mindkettőt módosítsd.
- **A zöld és a piros jelentést hordoz** (helyes/hibás, bid/ask, nyerő/vesztő R). Díszítésre és
  haladásjelzésre a kék (`--accent`) való.
- **Diagramok:** `--series-1..3` a dataviz referencia-palettából, a saját felületeinken ellenőrizve
  (`validate_palette.js --pairs all`). Egy tengely, hajszálvékony rács, 2 px-es vonal, a szöveg
  soha nem veszi fel az adatszínt, két vagy több sorozatnál jelmagyarázat.
- **Elrendezés:** listasorok és elválasztó vonalak, kártyarács helyett. Az egyetlen telített
  felület az áttekintés „Következő lecke” blokkja.
- **Navigáció:** lebegő üveg kapszula (felül, telefonon alul). Az aktív elem jelölője
  `clip-path`-szal csúszik; a pozícióját a `positionNavIndicator()` számolja.
- **Tipográfia:** Instrument Sans, rögzített rem skála. Számoszlopokban `tabular-nums`.
- **Mozgás:** 150–280 ms, `--ease-out`, csak `transform`, `opacity` és `clip-path`.
- **Szöveg:** nincs hosszú gondolatjel (—), nincs nagybetűs címkézés, nincs ismételt címsor.

## Kódolási szabályok

- Sima JavaScript, keretrendszer és build nélkül. Új függőség csak a felhasználó kérésére.
- Felhasználói szöveg a DOM-ba csak `escapeHTML()`-en vagy `textContent`-en át kerülhet.
- Számolás a `calc.js`-be, teszttel. Megjelenítés az `app.js`-be vagy a `labs.js`-be.
- Elrendezési tulajdonságot ne animálj; egyoszlopos rácsnál `minmax(0, 1fr)`, különben a széles
  táblázat szétnyomja az oldalt telefonon.
- Minden interaktív elem billentyűzettel is működjön, és legyen látható fókusza.

## Történet

- **2026-10-07, 1. kör:** teljes újratervezés. Sötét neonzöld kártyás felület helyett papír + tinta
  megjelenés, világos és sötét mód, lecke olvasónézet felugró ablak helyett, élő kalkulátorok.
- **2026-10-07, 2. kör:** a tananyag 24 leckéről 35-re bővült részletes törzsanyaggal, fogalomtár
  (89 fogalom), 30 kérdéses sorsolt kvíz, lebegő üveg navigáció.
- **2026-10-07, 3. kör:** git és GitHub, napló-statisztika R-görbével, Orderflow-labor és Prop
  szabályok (value area, footprint, drawdown, consistency), időzített ismétlés, heti terv,
  tanulási idő mérése és naptár.

### Nyitott ötletek

- Go/No-Go ellenőrzőlista bizonyítékmezőkkel, szabálykönyv- és ha–akkor szerkesztő.
- Mock evaluation követő a cég szabályaival paraméterezve.
- Ábrák a leckékben (ajánlati könyv, profil, footprint), kattintható fogalmak a szövegben.
- Offline működés: helyben tárolt betűtípus, telepíthető alkalmazás.
- Automatikus adatmentés fájlba; a napló képernyőképei (a `localStorage` ehhez kevés).
- A 6. modul és a szabályozási lecke forrásellenőrzése; a tartalom lektorálása.
