

# 🎯 6 Hónapos Day Trading & Prop Firm Felkészülési Roadmap

_Bővített, kutatással frissített verzió — 2026. augusztusi állapot szerint. A kiindulási vázat minden ponton kibontottam a mesterpromptban kért mélységre, és minden cégspecifikus/iparági adatot friss forrásokból ellenőriztem. Ahol a források egymásnak ellentmondtak (ez gyakran előfordult — ez maga is fontos tanulság, lásd lent), azt jelzem._

---

## 0. Mielőtt elkezded

**Feltételezések, amikkel dolgoztam** (szólj, ha valamelyik nem stimmel):

1. Nincs megadva konkrét induló tőke a challenge-díjra — ezért a roadmap úgy épül fel, hogy **valódi pénzt csak a 6. hónapban, és csak a legolcsóbb szinten** kockáztass, ha egyáltalán odáig jutsz.
2. Nincs előzetes piaci preferenciád (forex vs. futures) — ez rendben van, pont ezért van az 1. hónap végén egy dedikált döntési keret.
3. A heti 10–15 órát rugalmasan kezelem: mivel emellett heti 6–9 órát japán nyelvtanulásra fordítasz és fizika/kémia vizsgákra is készülsz, lesznek hetek, amikor kevesebb, és lesznek, amikor több idő jut erre — a roadmap havi célokban gondolkodik, nem napi kényszer-kvótában.

**Mi változott a kiindulási tervhez képest?** A korábbi vázlat jó kiindulópont volt, de több kötelező elemet egyáltalán nem tartalmazott (piacválasztási keret, cég due diligence, magyar adózási kontextus, konzisztencia-szabály mélyebb magyarázata, konkrét go/no-go rendszer), és néhány helyen elavult vagy túl egyszerűsített adatot használt (pl. a hónapok/óraszámok szétosztása, a "biztos" cégnevek). Ezt a verziót a mesterprompt teljes specifikációja szerint építettem újra, és minden cégspecifikus adatot 2026 közepi forrásokkal kereszteztem.

### ⏱️ Idő- és forrásigény összefoglaló

|Hónap|Fő fókusz|Becsült óra/hét|Fő mérföldkő a hónap végén|
|---|---|---|---|
|1|Piaci alapmechanika + piacválasztás|10–12|Döntés: forex-prop vagy futures-prop|
|2|Technikai elemzés + választott piac specifikumai|11–13|Önállóan felismersz és megindokolsz 20 chart-szitrén egy setupot|
|3|Kockázatkezelés mélyen, prop szabályokra szabva|11–14|Pozícióméretező sablon + saját "szabálykönyv" 1 lapon|
|4|Saját stratégia, backtesztelés, napló, demo indítása|13–15|100+ backtesztelt kötés dokumentálva|
|5|Pszichológia + intenzív demo/szimulátor gyakorlás|13–15|2 egymást követő hónap demo-adat pozitív és szabálykövető|
|6|Cégválasztás, due diligence, mock eval, go/no-go|10–13|Kitöltött go/no-go checklist → döntés|

**Fontos, őszinte megjegyzés már itt az elején:** a legtöbb ember, aki elkezd egy ilyen tervet, nem jut el a 6. hónap végére változatlan tempóban — ez normális, nem kudarc. A terv rugalmas pontjai (2–4. hónap végén "maradj még egy kört, ha kell" opciók) pontosan ezért vannak benne.

---

## 1. HÓNAP — Piaci alapmechanika & Piacválasztás

### 1–2. hét: Hogyan mozog a pénz a piacon

**Altémák / tanulási célok:**

- Mi a különbség a készpénz (spot) piac, a CFD és a futures kontraktus között — ki a partnered az ügyletben, és ez miért számít (ez lesz kulcsfontosságú a 6. hónapos due diligence-nél is).
- Rendelés-típusok: market, limit, stop, stop-limit, OCO (one-cancels-other), bracket order.
- Bid/ask spread, slippage — miért nem az az ár, amit a képernyőn látsz, amin tényleg beteljesül a megbízásod.
- Tőkeáttétel (leverage) és margin — mit jelent valójában, ha 1:30 vagy 1:100 tőkeáttétellel kereskedsz.
- Likviditás fogalma és miért mozog másképp egy fő devizapár, mint egy egzotikus pár vagy egy kis kapitalizációjú future.

**Gyakorlati feladatok:**

- Regisztrálj egy TradingView fiókot (a free/Basic szint is elég ehhez a szakaszhoz — a papírkereskedési motor minden szinten ugyanaz, csak a részletesebb intraday visszajátszási mélység fizetős).
- Nyiss meg 5 különböző instrumentumot (pl. EUR/USD, egy index future, egy kripto, egy részvény), és írd le egy mondatban, mi mozgatja mindegyiket alapvetően.
- Számolj ki kézzel 3 példát: mennyi a spread költsége pip-ben/tick-ben, ha X lot/kontraktusszámmal kereskedsz.

**Önellenőrzés / mérföldkő:**

- [ ] Meg tudod magyarázni egy laikusnak (pl. egy osztálytársadnak), mi a különbség market és limit order között, konkrét példával.
- [ ] Ki tudod számolni fejben, mennyibe kerül neked a spread egy adott kötésen.

**Tipikus kezdő hibák:**

- A tőkeáttételt "szabad pénznek" nézni, nem kockázat-multiplikátornak.
- Limit order helyett mindig market order-t használni "mert az egyszerűbb" — ez pluszköltség (spread + esetleges slippage) minden kötésen.

**Becsült óraszám:** ~10–11 óra

### 3–4. hét: Piacválasztási döntési pont

Ez a mesterprompt egyik legfontosabb kötelező eleme, és a kiindulási vázlatból teljesen hiányzott. Mielőtt bármit tovább mélyítenél, döntened kell — nem véglegesen, de irányadóan —, hogy **forex-prop** vagy **futures-prop** (esetleg multi-asset/crypto-prop) felé indulsz el, mert a 2–6. hónap tartalma ettől függően más hangsúlyokat kap.

**Döntési mátrix — töltsd ki magadra szabva:**

|Szempont|Forex-prop|Futures-prop|
|---|---|---|
|**Tipikus induló challenge-díj**|Gyakran alacsonyabb belépő (kisebb számlaméreteknél kb. $30–150 tartomány, cégtől és promóciótól függően)|Gyakran havi előfizetés (nem egyszeri díj!) egy résznél (pl. Topstep), máshol egyszeri díj (pl. Apex) — a teljes költség a próbálkozások számától függ|
|**Kereskedési órák**|Vasárnap este – péntek este, gyakorlatilag 24 órás munkanapokban, sok az átfedő session|Kb. 23 órás elektronikus kereskedés (CME Globex), napi ~1 órás technikai szünettel (jellemzően 16:00–17:00 CT), a legtöbb likviditás a Regular Trading Hours alatt koncentrálódik|
|**Instrumentum-választék**|Devizapárok, sok cégnél index/árupiaci CFD is|Index-, árupiaci, kötvény-, deviza-futures kontraktusok (pl. ES/MES, NQ/MNQ, CL, GC)|
|**Belépési tőkeigény (saját, nem a challenge-hez)**|Alacsonyabb eszközigény otthoni gyakorláshoz|Kontraktus-specifikációk és tick-értékek megértése egy kicsit meredekebb tanulási görbe|
|**Szabályozói háttér**|A legtöbb forex-prop cég **nem** szabályozott brókerként működik (erről bővebben a 6. hónapban és az adózási modulban)|A mögöttes tőzsde (pl. CME) erősen szabályozott, de a prop cég maga itt is tipikusan nem szabályozott entitás|
|**Saját érdeklődésed**|_(töltsd ki: mi izgat jobban — makrogazdasági hírek/devizapár-dinamika, vagy konkrét indexek/árupiacok mozgása?)_||

**Gyakorlati feladat:** töltsd ki a táblázat utolsó sorát, és nézz meg 3–3 chart-ot mindkét piactípusból (pl. TradingView-n) — melyiken tudtad könnyebben követni, mi történik?

**Önellenőrzés / mérföldkő:**

- [ ] Van egy irányadó döntésed (forex vagy futures — a "mindkettő egyszerre" nem javasolt kezdőként, szét fogja szórni a fókuszod).
- [ ] Le tudod írni 2-3 mondatban, _miért_ ezt választottad.

**Tipikus kezdő hiba:** a döntést kizárólag a challenge-díj alapján meghozni, a saját érdeklődés és a rendelkezésre álló idő (pl. futures RTH sok szempontból jobban illeszkedik egy iskola/munka melletti napi rutinhoz, mint egy 24 órás forex-piac állandó FOMO-ja) figyelmen kívül hagyásával.

**Becsült óraszám:** ~5–6 óra (a fenti kutatás + döntés)

**1. havi teljes becsült óraszám: ~10–12 óra/hét × 4 hét**

---

## 2. HÓNAP — Technikai elemzés + a választott piac specifikumai

### 1–2. hét: Technikai elemzés alapjai — kritikus szemlélettel

**Altémák / tanulási célok:**

- Gyertyaalakzatok (candlestick patterns) — de ne memorizálj 50 alakzatot, koncentrálj 5–6 megbízható, gyakran visszatérőre (pl. engulfing, pin bar/hammer, inside bar).
- Trend azonosítása, support/resistance szintek berajzolása — ez a leggyakrabban alábecsült, valójában legfontosabb készség.
- Idősíkok (timeframe-ek) közötti kapcsolat: hogyan nézd a napi/4 órás chart-ot a kontextushoz, és az 15 perces/5 perces-t a belépéshez.
- **Kritikus szemlélet az indikátorokkal**: válassz 2-3 indikátort (pl. egy mozgóátlag-pár + egy momentum-indikátor, mint az RSI), és értsd meg **miért** működnek (vagy miért nem) — a cél NEM az "indikátor-halmozás" (5 indikátor egy chart-on general nem ad több infót, csak vizuális zajt).
- Piaci szerkezet (market structure) alapfogalmai: higher high/higher low vs. lower high/lower low.

**Konkrét források:**

|Forrás|Miért ajánlott|Mire figyelj|
|---|---|---|
|Investopedia (angol)|Ingyenes, jó referencia alapfogalmakhoz|Csak alapozásra használd, nem stratégiaként|
|BabyPips "School of Pipsology"|Ingyenes, jól strukturált, kezdőbarát — eredetileg forexre írták, de a technikai elemzés rész piac-agnosztikus|Néhány rész elavult lehet a részletekben, a koncepciók viszont időtállóak|
|John J. Murphy – _Technical Analysis of the Financial Markets_|A technikai elemzés "tankönyve", alapos és piac-agnosztikus|Hosszú — nem kell egyben végigolvasni, fejezetenként is jó|
|TradingView beépített oktatóanyagok + közösségi elemzések|Ingyenes, direkt a chart mellett tanulhatsz|A közösségi "ötletek" (Ideas) között sok a spekulatív tartalom — kezeld forrásként, ne kövesd vakon|
|YouTube-csatornák technikai elemzésről|Vizuális, gyors|🚩 **Piros zászló**: ha egy csatorna signal-csoportot hirdet, "garantált" win rate-et ígér, vagy elrejti a veszteséges kötéseit — azonnal szűrd ki. Nézz rá, hogy mutatnak-e _valós_, ellenőrizhető (pl. broker-statement screenshottal alátámasztott) eredményeket, nem csak nyerő kereskedéseket kiragadva|

**Gyakorlati feladatok:**

- Válassz ki 20 múltbéli chart-szituációt (TradingView Bar Replay-jel, visszamenőleg), és minden esetben írd le: mit látsz, hol lenne a support/resistance, mit vársz a következő pár gyertyától — **mielőtt** előre görgetnél és megnéznéd, mi történt valójában.
- Rajzolj be kézzel (vagy TradingView rajzeszközökkel) trendvonalakat 10 különböző instrumentumon.

**Önellenőrzés / mérföldkő:**

- [ ] A 20 chart-szituációból legalább 12-nél a te előzetes várakozásod és a tényleges kimenet iránya egybeesett (ez még nem stratégia-validáció, csak mintafelismerés-teszt).
- [ ] Meg tudod indokolni _miért_ pont ott rajzoltad be egy support-szintet, nem csak "mert ott volt egy csúcs".

**Tipikus kezdő hibák:**

- Indikátor-halmozás: 6 indikátor egy chart-on, mindegyik mást "mond", és a kezdő végül azt hiszi meg, amelyik éppen a saját elképzelésével egyezik (megerősítési torzítás grafikonon).
- Chart-mintákat visszamenőleg "belelátni" (hindsight bias) — ezért fontos az előzetes leírás a Bar Replay-gyakorlatnál.

**Becsült óraszám:** ~11–12 óra

### 3–4. hét: A választott piac specifikumai

_Ez az a pont, ahol a tartalom kettéágazik az 1. hónap végi döntésed alapján — mindkettőt megadom, hogy referenciaként megtartsd, akkor is, ha csak egyet mélyítesz el most._

**🔹 Ha FOREX-prop irányba mentél:**

- Session-ök és átfedéseik: Sydney, Tokió, London, New York — a legnagyobb likviditás a London/New York átfedésnél (kb. 13:00–17:00 CET környékén, de ezt mindig ellenőrizd, mert az óraátállítások miatt (EU/US eltérő váltási dátumok) évente 1-2 hét csúszás lehet a pontos átfedésben).
- Pip- és lot-számítás: mi a pip értéke egy standard/mini/micro loton, hogyan számold ki egy adott pozícióméret dollár-kockázatát.
- Tőkeáttétel és margin-hívás mechanikája CFD-alapú számláknál.
- **Fontos**: a legtöbb forex-prop cég a kereskedést szimulált/demo-tőkén futtatja, valós bróker-végrehajtás _modellezésével_ — ez nem ugyanaz, mint egy szabályozott brókernél saját tőkével kereskedni (ennek jogi/adózási vonzatairól bővebben a külön adózási modulban).

**🔸 Ha FUTURES-prop irányba mentél:**

- Kontraktus-specifikációk: méret (multiplier), tick-méret, tick-érték. Példák (**mindig ellenőrizd a CME Group oldalán, mert a margin-igény piaci volatilitástól függően változik**):
    - E-mini S&P 500 (ES): $50/pont, 0.25 pontos tick ≈ $12.50/tick
    - Micro E-mini S&P 500 (MES): $5/pont, tick ≈ $1.25 — ez az ES 1/10-e, jó belépő kontraktus kisebb számlához
    - Hasonló micro-verziók léteznek NQ (MNQ), Dow (MYM), Russell (M2K) esetén is
- Kereskedési idő (CME Globex): vasárnap 17:00 CT-től péntek 16:00 CT-ig, napi ~1 órás technikai szünettel (jellemzően 16:00–17:00 CT, hétfő-csütörtök) — CT (Central Time) és CET/CEST között figyelj az óraátállítási eltérésekre.
- Regular Trading Hours (RTH) vs. teljes elektronikus session — az RTH alatt (index future-öknél kb. 15:30–22:15 CET környékén, ismét ellenőrizendő) koncentrálódik a legtöbb likviditás és a legkisebb spread.
- Margin: a kiértékelési (challenge) számláknál a prop cég saját, szimulált margin-szabályai érvényesek, ami **más**, mint egy valódi brókernél a tőzsdei kezdő/fenntartási margin.

**Gyakorlati feladat (mindkét ágra):** csinálj egy 1 lapos "kontraktus-puska" / "session-puska" jegyzetet a választott piac 3-5 legfontosabb instrumentumáról, amit később a stratégia-tesztelésnél és kereskedésnél kéznél tartasz.

**Önellenőrzés / mérföldkő:**

- [ ] Fejből (vagy a puskádból 5 másodperc alatt) meg tudod mondani egy adott instrumentum tick-értékét/pip-értékét.
- [ ] Tudod, mikor van a "fő" kereskedési sávja a választott piacodnak a saját (magyar) időzónádban.

**Tipikus kezdő hibák:**

- Session-időpontokat egyszer megnézni, majd örökre fixnek hinni — az óraátállítások (US/EU eltérő váltási dátumai tavasszal/ősszel) miatt 1-2 hetes csúszás előfordulhat évente kétszer.
- Futures-nél a tick-értéket összekeverni a pontértékkel, és ezért drasztikusan túlméretezni egy pozíciót.

**Becsült óraszám:** ~9–10 óra

**2. havi teljes becsült óraszám: ~11–13 óra/hét × 4 hét**

---

## 3. HÓNAP — Kockázatkezelés mélyen, kifejezetten prop firm szabályokra szabva

Ez a roadmap egyik legfontosabb hónapja. A statisztikák egyértelműek: egy 2024-es, 300 000+ számlát vizsgáló elemzés (FPFX Tech, a Finance Magnates-en keresztül publikálva) szerint a kiértékelésre jelentkezőknek csak kb. **14%-a jutott át** az evaluation fázison, és a jelentkezőknek mindössze kb. **7%-a ért el valaha tényleges kifizetést**. Ezek az arányok forrásonként és cégenként eltérnek, de az irány mindenhol ugyanaz: **a bukás oka a legtöbb esetben nem a stratégia, hanem a kockázatkezelési szabályok be nem tartása.**

### 1–2. hét: Pozícióméretezés matematikája

**Altémák / tanulási célok:**

- Az alapformula: _Kockázat ($) = Belépő ár és Stop-loss közötti távolság × Pozícióméret_. Fordítva: _Pozícióméret = Vállalható kockázat ($) ÷ (Belépő és Stop távolsága × instrumentum tick/pip-értéke)_.
- A "sose kockáztass 0.5–1%-nál többet egy kötésen" szabály **miért** ez a tartomány — mert egy prop cég napi/teljes veszteséglimitje jellemzően 4–10% körüli, és egy rossz sorozat (5-10 vesztes kötés egymás után, ami statisztikailag _simán_ előfordulhat egy 50%-os nyerési arány mellett) nem eheti fel az egész mozgásterét.
- Kockázat/hozam arány (Risk-Reward, RRR): miért ér többet egy 1:2 vagy 1:3 arányú stratégia alacsonyabb nyerési aránnyal, mint egy magas nyerési arányú, de rossz RRR-ű.

**Gyakorlati feladat:** építs egy egyszerű pozícióméretező táblázatot (Google Sheets/Excel), ami bemenetként a számlaméretet, a kockázat %-ot és a stop-loss távolságát kéri, és kiadja a pozícióméretet. Ezt a 4. hónapban a backtestelésnél és a demo-kereskedésnél is használni fogod.

**Önellenőrzés:**

- [ ] 5 különböző stop-loss távolság esetén ki tudod számolni fejben (vagy táblázattal 10 másodperc alatt) a helyes pozícióméretet.

**Becsült óraszám:** ~9–10 óra

### 3. hét: Drawdown-típusok — a prop iparág legfontosabb (és legtöbbet félreértett) fogalma

Ez pontosan az a rész, ami miatt a "csak nézd meg a profitcélt" hozzáállás megbukik. **A drawdown _típusa_ legalább annyira fontos, mint a mértéke.**

|Típus|Hogyan működik|Miért fontos|
|---|---|---|
|**Statikus (static) drawdown**|A limit a kezdő egyenleghez van rögzítve, és nem mozdul, akárhogy is nő a számlád|Trader-barátabb: a profitod nem "szűkíti" a mozgástered|
|**Trailing (EOD – nap végi) drawdown**|A küszöb csak a **nap végi (záró) egyenleghez** igazodik felfelé — napközbeni, nyitott pozíción elért átmeneti csúcs nem mozdítja azonnal|Kevésbé szigorú, mint a tick-by-tick verzió: egy napközbeni visszapattanás nem ér el egy csak nap végén frissülő küszöböt|
|**Trailing (intraday / "tick-by-tick") drawdown**|A küszöb **azonnal, valós időben** követi a legmagasabb elért egyenleget — még egy nyitott, nem realizált pozíció átmeneti csúcsértékét is|**Jóval szigorúbb**: ha egy nyitott pozíción átmenetileg nagy papír-profitod van, a küszöböd azonnal feljebb ugrik, és ha utána a piac visszafordul, sokkal kisebb mozgástered marad, mint hinnéd|

**Miért ez a legfontosabb rész?** 2026-ban több nagy futures-prop cég (pl. Apex) kifejezetten **választhatóvá** tette ezt a beállítást (EOD vagy Intraday trailing) — ami azt jelenti, hogy ugyanannál a cégnél, ugyanolyan számlaméretnél, radikálisan más a valós kockázati profilod attól függően, melyiket választod. Ez pontosan az a részlet, amit egy kezdő általában át sem olvas, és utólag lepődik meg, amikor egy nyitott pozíció átmeneti csúcsa miatt "elfogy" a mozgástere.

**Gyakorlati feladat:** nézz meg 2 különböző (valós) prop cég publikus szabályzatát, és azonosítsd be mindegyiknél, melyik drawdown-típust használja. Rajzolj fel kézzel (papíron) egy 5 napos, hipotetikus egyenleg-görbét, és rajzold be mindhárom drawdown-típus küszöbét ugyanarra a görbére — vizuálisan fogod látni a különbséget.

**Önellenőrzés / mérföldkő:**

- [ ] Meg tudod magyarázni saját szavaiddal, miért "ehet meg" egy tick-by-tick trailing drawdown több mozgásteret, mint egy EOD-trailing, ugyanazon kereskedési nap alatt.

**Tipikus kezdő hiba:** csak a profitcélt és a "max drawdown %"-ot nézni a marketing-oldalon, és nem olvasni el, _melyik típusú_ a drawdown — ez az egyik leggyakoribb ok, amiért egy amúgy nyereséges kereskedő is elbukik egy kiértékelést.

**Becsült óraszám:** ~5–6 óra

### 4. hét: Consistency rule (konzisztencia-szabály) és a napi veszteséglimit fegyelme

**A consistency rule** azt korlátozza, hogy egyetlen nyereséges nap ne tehessen ki túl nagy részt a teljes profitcélból. Célja (a cég szempontjából): kiszűrni azokat, akik egyetlen nagy, túlkockáztatott kötéssel "lövik be" a célt, majd defenzívan kereskednek tovább.

- A küszöb cégenként **jelentősen** eltér: a kutatásom során 30%-tól (pl. The5%ers, mindkét fázisban egyszerre — ami ritka, mert a legtöbb cég csak egy fázisra vonatkoztatja) az 50%-ig (pl. Topstep "legjobb nap" szabálya, Apex kifizetésnél) találtam példákat. Fontos: **ugyanannál a cégnél** is előfordult, hogy egyik évről a másikra megváltozott a küszöb (pl. az Apex 30%-ról 50%-ra módosította 2026 márciusában).
- Van olyan cég, ahol a szabály megszegése _nem_ azonnali bukás, csak megnöveli a szükséges teljes profitot (puha szabály) — másutt ez keményebb feltétel. **Mindig olvasd el a saját cégednél, melyik logika érvényes.**
- **Napi veszteséglimit fegyelme**: nem elég ismerni a számot — kell egy _előre lefektetett szabály_, mi történik, ha eléred (pl. "aznap nem nyitok több pozíciót, kikapcsolom a platformot"). Ez már a psychology-modulhoz (5. hónap) vezet át.

**Gyakorlati feladat:** írj egy féloldalas, **saját szavaiddal megfogalmazott "szabálykönyvet"**, ami tartalmazza: kockázat/kötés %, napi maximális veszteség (és mi történik, ha eléred), heti "stop" szabály, és a te választott piacod/cégtípusod tipikus consistency rule tartománya.

**Önellenőrzés / mérföldkő:**

- [ ] Kész a saját 1 lapos szabálykönyved, és fejből fel tudod mondani a 3 legfontosabb pontját.

**Becsült óraszám:** ~9–10 óra

**3. havi teljes becsült óraszám: ~11–14 óra/hét × 4 hét** — ez a legmagasabb súlyozású hónap, indokoltan.

---

## 4. HÓNAP — Saját stratégia, Backtesztelés, Napló, Demo gyakorlás indítása

### 1. hét: Szabály-alapú stratégia kialakítása

**Altémák / tanulási célok:**

- Mit jelent, hogy egy stratégia "szabály-alapú": minden belépési, kilépési és pozícióméretezési döntésnek olyan konkrétnak kell lennie, hogy **egy másik ember is ugyanazt a döntést hozná** ugyanazon chart-on, ugyanazon pillanatban.
- Válassz **egyetlen** letisztult koncepciót a 2. hónapban tanult elemekből (pl. trend + support/resistance visszapattanás, vagy egy egyszerű kitörés-stratégia). Ne kombinálj 5 megközelítést egyszerre.
- Írd le a stratégiát úgy, mintha egy receptet írnál: (1) milyen piaci feltétel mellett keresel setupot, (2) mi a pontos belépési trigger, (3) hol a stop-loss, (4) hol a take-profit vagy hogyan menedzseled a nyitott pozíciót, (5) mikor **nem** kereskedsz (pl. nagy hír előtt/után, alacsony likviditású sávban).

**Gyakorlati feladat:** írd le a stratégiádat egy oldalon, olyan részletesen, hogy 2 hónap múlva is pontosan ugyanazt csinálnád, ha visszaolvasod.

**Önellenőrzés:**

- [ ] A stratégia-leírásod alapján egy teljesen kívülálló is fel tudná ismerni a setupjaidat egy chart-on.

### 2–3. hét: Backtesztelés

**Altémák / tanulási célok:**

- A kézi/vizuális backtesztelés módszertana: TradingView Bar Replay funkcióval visszamész 6–12 hónapot, és bar-ról bar-ra lejátszod a piacot úgy, hogy a jövőt nem látod előre.
- **Figyelem**: az intraday (percgyertyás) Replay-mélység TradingView-n fizetős csomagtól függ (a free/Basic szinten korlátozottabb a visszamenő percgyertyás adat) — napi/magasabb idősíkon viszont minden csomagnál teljes az előzmény. Ha ez korlátoz, napi/4 órás idősíkon is el lehet kezdeni a mintafelismerést, vagy nézz szabad alternatívákat.
- Statisztikai minimum: **legalább 100 tesztkötés** szükséges, mire bármilyen érdemi következtetést lehet levonni a nyerési arányról — 20-30 kötésből semmit nem lehet biztosan megállapítani (ez pusztán a statisztikai szórás miatt van így).

**Gyakorlati feladat:** csinálj legalább 100 szabály-alapú tesztkötést a stratégiáddal Bar Replay-jel, és minden kötésnél rögzítsd: dátum, irány, belépő/stop/cél ár, kimenet (nyert/vesztett, hány R — azaz hányszorosa a kockázatnak).

**Önellenőrzés / mérföldkő:**

- [ ] Megvan a 100+ tesztkötésed dokumentálva, kiszámolt nyerési aránnyal és átlagos RRR-rel.
- [ ] A stratégiád matematikailag pozitív várható értékű ezen a mintán (nyerési arány × átlagos nyereség > vesztési arány × átlagos veszteség).

**Tipikus kezdő hiba:** a backtestelést "megnyerni akarni" — tudat alatt úgy válogatni a setupokat, hogy szépek legyenek az eredmények (ez a _lookahead bias_ egy formája). Ezért fontos az előre leírt, szigorú szabálykönyv a 3. hónapból — ha egyértelmű a szabály, kevesebb a csalás-lehetőség saját magad felé.

**Becsült óraszám (1-3. hét összesen):** ~20–22 óra

### 4. hét: Trading napló rendszer + demo/paper trading indítása

**A kereskedési napló minden kötésnél rögzítendő mezői:**

|Mező|Miért fontos|
|---|---|
|Dátum, idő, instrumentum|Alapadat, session-elemzéshez is kell|
|Belépő ár, stop, cél, tényleges kilépő ár|A terv vs. valóság összevetéséhez|
|Pozícióméret és kockázat $-ban/%-ban|Fegyelem-ellenőrzéshez|
|Setup típusa (melyik szabályod alapján léptél be)|Statisztika stratégiánként, ha többfélét tesztelsz|
|Eredmény R-egységben (hányszorosa a kockázatnak)|Összehasonlítható métrika, függetlenül a pozícióméret-től|
|**Érzelmi állapot belépés előtt/után** (1 rövid szó/mondat)|Ez köti majd össze a napló-adatot az 5. havi pszichológia-modullal|
|Screenshot a chart-ról belépéskor|Utólagos, objektív visszanézéshez|

Eszköz: Notion, Google Sheets, vagy Excel — a lényeg nem a szoftver, hanem hogy **minden kötésnél** kitöltsd, kivétel nélkül.

**Demo/paper trading indítása:**

- TradingView Paper Trading: minden csomagon (a free/Basic szinten is) elérhető, $100 000 virtuális egyenleggel indul, és valós piaci adaton, valós időben helyezhetsz el megbízásokat.
- Fontos korlát, amit tarts észben: a paper trading **nem** szimulálja pontosan a valós bróker-slippage-t és néhány mikrostruktúra-jelenséget — éppen ezért a cél most nem a "profit", hanem hogy a stratégiád szabályait **hiba nélkül** kövesd élő piaci körülmények között.
- Állítsd be a virtuális egyenleget akkora összegre, amilyen prop challenge-et majd meg szeretnél célozni (pl. $10 000 vagy $50 000), és **használd ugyanazt a pozícióméretező táblázatot és szabálykönyvet**, amit a 3. hónapban készítettél.

**Heti/havi napló-elemzés módja:** minden hét végén nézd át a naplót, és kérdezz rá: hány kötésnél tértél el a leírt szabálytól (akkor is, ha az a kötés nyert)? Ez fontosabb kérdés most, mint a nyereség/veszteség egyenlege.

**Önellenőrzés / mérföldkő:**

- [ ] Minden kötésed dokumentálva van, kivétel nélkül, screenshottal.
- [ ] Az elmúlt 2 hét demo-kötéseinek legalább 90%-a megfelelt a saját szabálykönyvednek (ez fontosabb mérőszám most, mint a P&L).

**Tipikus kezdő hibák:**

- Csak a nyerő/vesztes kötéseket naplózni, a "meh" köztes eseteket kihagyni.
- A demo-egyenleget úgy kezelni, mintha nem lenne súlya ("csak játékpénz") — ez pont az ellentéte annak, amire készülsz. Kezeld úgy, mintha valódi lenne, különben a fegyelem-gyakorlás értéktelen.

**Becsült óraszám:** ~10–11 óra

**4. havi teljes becsült óraszám: ~13–15 óra/hét × 4 hét**

> 🔶 **Aranyszabály:** ha a hónap végén a demo-kereskedésed veszteséges, vagy a szabálykövetés nem éri el a 90%-ot, **ne lépj tovább automatikusan** az 5. hónapra — ismételd meg ezt a szakaszt. Ez nem csúszás, ez pontosan így működik.

---

## 5. HÓNAP — Kereskedési pszichológia (evaluation-nyomásra szabva) & Intenzív demo gyakorlás

### 1–2. hét: Az "evaluation-nyomás" pszichológiája

Ez más, mint az általános "kereskedési pszichológia" — itt kifejezetten arról van szó, mit csinál a fejeddel az, hogy **egy határidő és egy szabályrendszer alatt**, pénzügyi téttel (a challenge-díj) kereskedsz.

**Altémák / tanulási célok:**

- **Revenge trading** egy rossz nap után: a mintázat az, hogy egy veszteség után a trader — tudat alatt "visszavenni akarva" a pénzt — megnöveli a pozícióméretet vagy figyelmen kívül hagyja a saját setup-szabályait. Az ellenintézkedés nem "akarj erősebben fegyelmezett lenni", hanem **előre lefektetett, mechanikus szabály**: pl. "2 egymást követő vesztes kötés után lezárom a platformot aznapra" — ez már a 3. hónapban leírt szabálykönyvedben is szerepelhet.
- A profitcél "sietős" teljesítésének csapdája: amikor a trader látja, hogy közel van a célhoz, hirtelen megnöveli a kockázatot, hogy "gyorsan meglegyen" — pont fordítva kellene, minél közelebb vagy, annál inkább az eredeti pozícióméretet kellene tartani.
- Hogyan kezeld, ha egy challenge-et **el kell buknod és újra kell kezdened**: ez statisztikailag a legtöbb embernek megtörténik (lásd a 3. hónap eleji statisztikát: a jelentkezőknek csak kb. 14%-a jut át egyáltalán egy kiértékelésen) — ez nem azt jelenti, hogy rossz kereskedő vagy, hanem hogy a rendszer eleve úgy van felépítve, hogy a többség első nekifutásra ne érje el a célt.

**Gyakorlati feladat:** írj egy féloldalas "ha X, akkor Y" döntési listát a leggyakoribb nyomás-helyzetekre (pl. "ha 2 egymást követő napon veszítek → …", "ha 80%-on vagyok a profitcélnak → …", "ha egy kiértékelést elbuktam → …"). Tedd ezt a szabálykönyved mellé.

**Önellenőrzés / mérföldkő:**

- [ ] Van kész, leírt válaszod mind a 3 fenti nyomás-szituációra, mielőtt valóban átélnéd őket éles pénzzel.

**Becsült óraszám:** ~6–7 óra

### 3–4. hét, és a hónap további része: Intenzív demo/szimulátor gyakorlás valós piaci adatokon

**Cél:** nem új tudás, hanem **ismétlés nagy mennyiségben**, élő piaci körülmények között, hogy a 3–4. hónapban lefektetett szabályok reflexszé váljanak.

**Gyakorlati feladatok:**

- Kereskedj a választott idősávodban (pl. ha forex: London/New York átfedés; ha futures: RTH) minden kereskedési napon, a valós stratégiáddal, a valós pozícióméretező táblázatoddal.
- Minden kötést naplózz (lásd 4. hónap napló-sablonja), **beleértve az érzelmi állapot mezőt is** — ez most válik igazán fontossá.
- Hetente egyszer ülj le és nézd át: hányszor tértél el a szabályoktól, és _milyen érzelmi állapotban_ voltál akkor (ez mutatja meg a saját, személyes "trigger-mintáidat").

**Konkrét, mérhető readiness-kritériumok** (ezek alapján döntöd el a hónap végén, mehetsz-e tovább a 6. hónapba):

- [ ] **Legalább 2 egymást követő hónapon át** konzisztensen betartott napi veszteséglimit — nulla áthágás.
- [ ] A demo-eredmény **szabálykövető módon** pozitív — azaz nem 1-2 szerencsés nagy nyerő nap húzza fel az összképet, hanem a kötések többsége a leírt setup-szabály szerint történt.
- [ ] A napló szerint a kötéseid legalább 90%-a megfelel a saját szabálykönyvednek.
- [ ] Szimuláltan **túlélted** legalább egy olyan időszakot, amikor 4-5 egymást követő kötés veszített, a saját kockázatkezelési szabályaid szigorú betartásával (ez bizonyítja, hogy a rendszered nem csak "jó napokon" működik).

**Tipikus kezdő hibák:**

- Csak akkor kereskedni, amikor "jónak érzi" a piacot, és emiatt túl kevés adatpontot gyűjteni ahhoz, hogy a saját fegyelmét valóban tesztelje.
- A demo-fázist túl korán "sikeresnek" nyilvánítani egyetlen jó hét után.

**Becsült óraszám:** ~7–8 óra/hét a fennmaradó heteken

**5. havi teljes becsült óraszám: ~13–15 óra/hét × 4 hét**

> 🔶 **Aranyszabály (ismét, mert ez a legfontosabb egyetlen mondat az egész tervben):** ha a fenti 4 readiness-kritérium közül **bármelyik** nem teljesül a hónap végén, maradj még egy hónapot ebben a szakaszban. Fizetős challenge-et vásárolni ez előtt pontosan az a hiba, amit a legtöbb, első nekifutásra elbukó trader elkövet.

---

## 6. HÓNAP — Cégválasztás, Due Diligence, Mock Evaluation, Go/No-Go

### 1–2. hét: Prop cég due diligence — ez az iparág legváltozóbb, legkockázatosabb rétege

**Miért kell ezt ilyen alaposan venni?** 2024 februárja és 2025 vége között **kb. 80–100 prop cég szűnt meg világszerte** (több független forrás — Finance Magnates, illetve az FPFX Tech 300 000+ számlás elemzése — nagyságrendileg ugyanerre az adatra jut). A kiváltó ok nagyrészt az volt, hogy a MetaQuotes (a MetaTrader 4/5 platform gyártója) 2024 februárjában visszavonta a platform-licenceket azoktól a prop cégektől, amelyek amerikai ügyfeleket szolgáltak ki megfelelő brókeri regisztráció nélkül — ez láncreakciót indított el.

**Konkrét, dokumentált esetek** (tanulságként, nem rémisztésként):

|Cég|Mi történt|Tanulság|
|---|---|---|
|**True Forex Funds**|Magyarországi bejegyzésű cég; 2023 júniusában felkerült a CFTC "RED listájára" (nem regisztrált külföldi entitásként); 2024 májusában bezárt, kb. 300 trader és ~$1,2M kifizetés maradt függőben; utána Kajmán-szigetekre költözött, 2026-ra sem állt teljesen vissza a korábbi működési szintje|A "közelség" (magyar bejegyzés) önmagában semmit nem garantál — a szabályozói státusz a döntő|
|**MyForexFunds**|2023-ban a legnagyobb retail prop cég volt; a CFTC és a kanadai OSC csalással gyanúsította (állítólag $310M+ becsatornázása 135 000+ ügyféltől); működése azonnal leállt|A méret/népszerűség sem garancia|
|**SurgeTrader**|Napokon belül bezárt; az alapító házastársát az SEC egy külön, $35M-os csalási ügyben vádolta|Háttér-ellenőrzés (cégvezetés) is ide tartozik|
|**FundingTicks**|2025 decemberében visszamenőleges szabálymódosítást vezetett be (ez keltette fel a gyanút) → felhasználói felháborodás → Trustpilot pontszáma 4,1-ről 3,2-re esett → 2026 januárjában bezárt (állítólag rendezett visszafizetéssel)|A Trustpilot-**trend** (nem a pillanatnyi szám!) korai előjelző lehet|
|**MyFundedFX**|Átnevezte magát SeacrestFunded-re, ezután zárta be a prop-üzletágát|A hirtelen márkaváltás/átstrukturálás önmagában is figyelmeztető jel lehet|

**Konkrét due diligence checklist, amit MINDEN cégnél végigfuss vétel előtt:**

- [ ] **Trustpilot-trend, nem csak a pillanatnyi pontszám**: nézd meg, romlott-e a pontszám az elmúlt 2-3 hónapban (egy hirtelen 0,3+ pontos esés önmagában is vészjel).
- [ ] **Kifizetési előzmények/bizonyítékok**: vannak-e ellenőrizhető, valós (nem csak marketing-oldalon hivatkozott) kifizetési screenshotok, közösségi visszajelzések?
- [ ] **Cégbejegyzés átláthatósága**: könnyen megtalálható-e, hol van bejegyezve a cég, ki a tulajdonosa/vezetése? Ha ezt szándékosan homályban tartják, az önmagában vészjel.
- [ ] **Hirtelen, bejelentés nélküli szabályváltoztatás**: keresd rá a cég nevére + "rule change" / "retroactive" kombinációra — ha visszamenőlegesen érvénytelenítettek korábban elért profitokat, ez komoly figyelmeztetés.
- [ ] **Ügyfélszolgálat elérhetősége**: próbálj küldeni egy kérdést vétel előtt, és nézd meg, válaszolnak-e érdemben, elfogadható időn belül.
- [ ] **CFTC RED List** (elsősorban amerikai vonatkozású cégeknél/ügyfeleknél releváns, de érdemes tudni, hogy létezik: cftc.gov) — nyilvános, kereshető lista nem regisztrált entitásokról.
- [ ] Keresd rá a cég nevére a **PropFirmMap**, illetve hasonló összehasonlító oldalakon található **friss** (nem féléves) fórum-visszajelzésekre.

**Jelenleg (2026 közepén) hosszabb, dokumentált működési/kifizetési múlttal rendelkező szereplők** — kiindulásnak, **NEM** vak ajánlásként, és minden adat gyorsan változhat:

- **Futures oldalon**: Topstep (2012 óta), Apex Trader Funding (2018 óta, de 2026 márciusában a teljes szabálykönyvét újraírta "Apex 4.0" néven — ez önmagában is jó illusztráció arra, hogy egy stabil, régóta működő cégnél is drasztikusan változhatnak a szabályok egyik napról a másikra).
- **Forex oldalon**: FTMO (2015 óta, az iparág egyik leghosszabb kifizetési múltja, de a saját kutatásom során **több egymásnak ellentmondó leírást** találtam arra, hogy pontosan van-e formális "consistency rule"-ja és mekkora — ez magában is jó példa arra, miért kell mindig a cég saját, aktuális szabályzat-oldalát elolvasni, sose csak összehasonlító blogokat), The5%ers (2016 óta, statikus drawdown-modell).
- **Újabb, de 2026-ban is aktívnak és viszonylag jó Trustpilot-mutatókkal rendelkező szereplők**: FundedNext, Funding Pips — mindkettő gyakran módosítja a szabályait (pl. a FundedNext 2026 májusában vezette be az új "Flex Challenge" struktúráját), tehát a "jelenleg aktív" státusz **nem** garantálja, hogy 3-6 hónap múlva ugyanazok a feltételek lesznek érvényben.

**Becsült óraszám:** ~9–10 óra

### 3. hét: Mock evaluation (díjmentes vizsgaszimuláció)

**Cél:** megszokni a prop cégek szigorú felületét és időzítését, mielőtt valódi pénzt fizetnél.

**Gyakorlati feladat:**

- Ha a kiválasztott cégnél elérhető ingyenes próba/free trial lehetőség — ez cégenként és időszakonként változik, mindig ellenőrizd az aktuális kínálatot —, használd ki.
- Ha nincs ingyenes próba, **szimuláld saját magad**: állítsd be a demo-számládon pontosan a választott cég aktuális szabályait (profitcél, drawdown-típus és -mérték, napi veszteséglimit, consistency rule, minimális kereskedési napok száma), és kereskedj úgy, mintha éles kiértékelés lenne — **beleértve azt is**, hogy egyetlen szabálysértés esetén leállítod és "elbuktnak" tekinted a próbát, pont úgy, ahogy egy valódi challenge-nél történne.
- Ha a próba elbukik, elemezd ki alaposan (napló alapján) a hibát, és csinálj meg egy második kört, mielőtt továbblépnél.

**Önellenőrzés / mérföldkő:**

- [ ] Legalább egyszer, de inkább kétszer végigcsináltad a választott cég **pontos, aktuális** szabályai szerint szimulált kiértékelést, szabálysértés nélkül.

**Becsült óraszám:** ~9–10 óra

### 4. hét: A "Go/No-Go" döntés

**Kritériumrendszer — csak akkor menj tovább egy fizetős challenge felé, ha MINDEGYIK igaz:**

- [ ] Legalább 2 egymást követő hónapon át (4-5. hónap) konzisztensen betartottad a napi veszteséglimitet — nulla áthágás.
- [ ] A demo/szimulált eredményed szabálykövető módon pozitív, nem 1-2 kiugró nyerő napra alapozva.
- [ ] A napló szerint a kötéseid legalább 90%-a megfelel a saját szabálykönyvednek.
- [ ] Legalább egy (inkább két) sikeres mock evaluation-t végigcsináltál a választott cég pontos, aktuális szabályai szerint.
- [ ] Elvégezted a fenti due diligence checklistet a választott cégen, és nem találtál vészjelet.
- [ ] Elolvastad és megértetted a magyar adózási/jogi kontextust (lásd alább), és tudod, mihez kell fordulnod, ha eljutsz a kifizetésig.
- [ ] **Anyagilag** is elbírod a challenge-díj esetleges elvesztését — azaz nem "utolsó pénzedből" fizetsz be.

**Ha bármelyik pont hiányzik:** ez nem kudarc, ez pontosan az, amire ez a fél év szolgál — hosszabbítsd meg a demo-szakaszt (vissza a 4-5. hónap gyakorlataihoz), és próbáld újra 4-8 hét múlva.

**Ha minden pont teljesül:** válaszd a **legolcsóbb** elérhető challenge-szintet a kiválasztott cégnél (ne a legnagyobb számlamérettel indulj), és kereskedj **pontosan** úgy, ahogy a szimulátorban tetted — ne módosíts a pozícióméreteken "csak mert most éles".

**6. havi teljes becsült óraszám: ~10–13 óra/hét × 4 hét**

---

## 🇭🇺 Kitérő: Magyar adózási és jogi kontextus

_Ezt már most, kb. a 3-4. hónap környékén érdemes átfutni egyszer, hogy tudatosan tervezz vele — de a részletes, saját helyzetedre szabott tisztázás majd a 6. hónap végén, kifizetés előtt válik éles kérdéssé._

**A lényeg egy mondatban:** a prop firm kifizetések hazai adóbesorolása **eltérhet** a hagyományos, saját brókerszámlás tőzsdei jövedelmekétől — és ez pénzben is jelentős különbséget jelenthet.

**Miért?** A magyar SZJA-törvény (Szja tv. 67/A. §) egy kedvező adókategóriát határoz meg **Ellenőrzött Tőkepiaci Ügylet (ETÜ)** néven. Ha egy ügylet ETÜ-nek minősül:

- csak 15% SZJA-t kell fizetni,
- **nincs** szocho-kötelezettség,
- és a korábbi, bevallott veszteségeid **beszámíthatók** (adókiegyenlítés) egy későbbi nyereséges év adójába.

Ha egy ügylet **nem** minősül ETÜ-nek, akkor jellemzően "egyéb jövedelemként" vagy árfolyamnyereségként adózik: **mindkét** adónem (SZJA **és** szocho) terheli, és a veszteségek **nem** számíthatók be a nyereség ellen.

**A gond:** az ETÜ-státusz feltétele (egyszerűsítve), hogy a szolgáltató/brókercég vagy egy EGT-tagállamban szabályozott legyen, vagy egy olyan OECD-tagállamban legyen bejegyezve, amellyel Magyarországnak kettős adóztatást elkerülő egyezménye van, és biztosított az információcsere a helyi felügyelet és az MNB között. A gyakorlatban ezt úgy ellenőrizheted, ha megnézed, szerepel-e a szolgáltató az **MNB intézménykeresőjében** (intezmenykereso.mnb.hu).

**A legtöbb prop firm viszont _nem_ szabályozott befektetési szolgáltatóként működik** — a "kiértékelés + szimulált tőke + teljesítmény-alapú kifizetés" modelljük szándékosan más jogi kategóriába esik, mint egy hagyományos brókeri számlavezetés. Ez pontosan az a különbség, amiért **nem garantált**, hogy a prop firm kifizetésed ETÜ-ként fog adózni, még akkor sem, ha a mögöttes kereskedés forex- vagy futures-instrumentumon történt.

**Mit tegyél ezzel gyakorlatilag már most?**

- **Dokumentálj mindent**: minden kifizetés dátumát, összegét és forrását pontosan tartsd nyilván (ez egyébként a kereskedési naplód természetes kiterjesztése).
- **Válaszd külön** a prop firm kifizetéseket a saját brókerszámlás (ha lenne ilyen) eredményeidtől a nyilvántartásban — ez segít a besorolás tisztázásában.
- **Ne a saját fejed alapján dönts a besorolásról** — ez esetfüggő lehet (van, aki egyéb jövedelemként, van, aki más kategóriában számolja el, és a jogszabály is változhat), ezért **éles kifizetés előtt** keress fel egy erre a témára (kifejezetten prop firm / külföldi teljesítmény-alapú kifizetések) szakosodott magyar adótanácsadót vagy könyvelőt.

⚠️ _Ez a szakasz általános, oktatási célú tájékoztatás, nem konkrét adójogi tanács — nem vagyok adótanácsadó, és a szabályozás, illetve a konkrét kulcsok/mértékek időről időre változhatnak. A te pontos helyzetedre (életkor, egyéb jövedelmeid, a konkrét cég szerződési konstrukciója) csak egy szakember tud érvényes választ adni._

---

## 🖥️ Demo/szimulátor platformok összefoglaló

|Platform|Piac|Költség|Megjegyzés|
|---|---|---|---|
|**TradingView Paper Trading**|Bármely (részvény, forex, index/áru future, kripto)|Ingyenes minden csomagon, $100 000 virtuális egyenleggel indul|A Bar Replay funkció napi/magasabb idősíkon minden csomagnál teljes előzményt ad; a perces (intraday) visszamenő mélység a fizetős csomagoknál nagyobb|
|**Tradovate / NinjaTrader demo**|Futures|Ingyenes demo-fiók|A legtöbb futures-prop cég (pl. Apex) is ezeken a platformokon (vagy Rithmic-en) futtatja az éles kiértékelést — így a demo-gyakorlás közvetlenül átvihető|
|**MetaTrader 4/5 demo**|Forex/CFD|Ingyenes demo-fiók bármely brókernél|Ez a legtöbb forex-prop cég éles kiértékelési platformja is, tehát a felület megszokása közvetlen hasznot hoz|

**Mielőtt fizetős challenge-re váltanál**: minden fenti platformon a demo-fiók **ingyenes és korlátlan ideig** használható — nincs ok arra, hogy a 4-5. hónapnál korábban éles pénzt kockáztass.

---

## 📚 Gyors forrás-könyvtár (kibővítve)

|Forrás|Terület|
|---|---|
|Investopedia|Alapfogalmak, referencia (angol)|
|BabyPips – "School of Pipsology"|Piaci alapmechanika, ingyenes, kezdőbarát|
|TradingView|Chart-elemzés gyakorlása + ingyenes paper trading + Bar Replay|
|CME Group oktatási anyagai és a CME honlap kontraktus-specifikációi|Ha a futures irány mellett döntesz, közvetlenül a tőzsdétől — itt találod a mindig aktuális margin- és session-adatokat is|
|Mark Douglas – _Trading in the Zone_|Kereskedési pszichológia|
|John J. Murphy – _Technical Analysis of the Financial Markets_|Technikai elemzés referencia|
|Trustpilot (a **trend**-et nézd, ne csak a pontszámot)|Cég-visszajelzések|
|MNB intézménykereső (intezmenykereso.mnb.hu)|Brókerek/szolgáltatók engedélyének ellenőrzése|
|CFTC RED List (cftc.gov)|Nem regisztrált külföldi entitások nyilvános listája (elsősorban USA-vonatkozású cégeknél releváns)|

🚩 **Általános piros zászló, bármelyik forrásnál/csatornánál**: garantált profit vagy win rate ígérete, signal-csoport hirdetése "csatlakozz és kövesd a kötéseimet" felállásban, vagy olyan "eredmény-bemutatás", ami csak a nyerő kötéseket mutatja screenshot nélkül ellenőrizhető broker-adat nélkül.

---

## Záró megjegyzés

Ez a roadmap **oktatási célú terv**, nem pénzügyi tanács, és nem helyettesíti a saját, egyedi helyzetedre szabott jogi/adózási/pénzügyi szakértői konzultációt. A day trading és a prop firm kiértékelés jelentős tőke-, illetve challenge-díj-veszteséggel járhat — a kutatás során talált statisztikák (kb. 14% jut át egy kiértékelésen, kb. 7% ér el tényleges kifizetést) azt mutatják, hogy ez a többségnek nem sikerül elsőre, és ez a tapasztalat teljesen normális, nem a te hibád lenne. Pontosan ezért épül ez a terv úgy, hogy a hangsúly az első 5 hónapban a kockázatmentes tanuláson és gyakorláson legyen, és valódi pénz csak a végén, tudatos, kritériumok alapján meghozott döntés után kerüljön kockára.