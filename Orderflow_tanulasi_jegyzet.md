# Orderflow tanulási jegyzet

## A piac működésétől az önálló gyakorlásig

Ez a tananyag azt magyarázza el, hogyan kapcsolódnak össze a megbízások, a végrehajtott kötések, a likviditás és az ármozgás. Az alapoktól indul, majd bemutatja a volume profile, a delta, a footprint és a megbízási könyv használatát. A cél, hogy egy piaci helyzetet saját szavaiddal meg tudj magyarázni, tesztelhető elképzelést tudj alkotni róla, és felismerd, amikor az adatok nem elegendők a döntéshez.

**Az orderflow legfontosabb kérdése: mekkora kereskedési aktivitás történt, és milyen árreakciót váltott ki az adott likviditási környezetben?** Egy nagy vételi kötés jelentése attól függ, hogy utána emelkedik, megáll vagy visszaesik az ár. A számok értelmezéséhez ezért az ár helyzetét és reakcióját is követni kell.

A számpéldák kitalált oktatási helyzetek. A bemutatott belépési minták vizsgálandó hipotézisek, nincs hozzájuk igazolt nyereségességi vagy találatiarány-ígéret. A tanulási időkre adott becslések tervezési támpontok, nem kutatással igazolt átlagok. A technikai hivatkozások a jegyzet végén találhatók; ellenőrzésük dátuma 2026. október 7.

### Hogyan használd a jegyzetet

Először az 1–5. fejezetet olvasd végig, hogy értsd a piaci mechanikát és az ár környezetét. Utána jöhet a delta, a footprint és a minták értelmezése. A gyakorlati fejezetekhez csak akkor lépj tovább, ha már el tudod különíteni a várakozó megbízást a végrehajtott kötéstől.

Egy tanulási alkalom végén csukd be a jegyzetet, és magyarázd el hangosan a témát egy képzeletbeli kezdőnek. Ha csak a szakkifejezést tudod felidézni, de példát nem tudsz rá mondani, még gyakorold. A számolási feladatokat a megoldás megtekintése előtt végezd el.

### Tartalom

1. Mi az orderflow és mit lehet belőle megismerni
2. Megbízások és likviditás
3. Az aukció logikája és az erőfeszítés eredménye
4. Eszközök és adatminőség
5. A volume profile részletesen
6. Delta és kumulatív delta
7. A footprint olvasása
8. Abszorpció kifáradás és csapdák
9. Az adatok összekapcsolása
10. Végigvezetett gyakorlati helyzetek
11. Egy tesztelhető kereskedési modell felépítése
12. Kockázat költségek és várható érték
13. Gyakorlás visszajátszás és naplózás
14. Tanulási sorrend és reális időigény
15. Tipikus félreértések
16. Angol magyar fogalomtár
17. Gyakorlófeladatok
18. Megoldások és magyarázatok
19. Források és további olvasás

## 1 Mi az orderflow és mit lehet belőle megismerni

### A fogalom jelentése

Az orderflow magyarul megbízásáramlás. Tág értelemben a piacra beérkező, módosuló, törlődő és végrehajtott megbízások folyamatát jelenti. A kereskedési oktatásban sokszor szűkebben használják: a végrehajtott kötések irányának, mennyiségének és árszintenkénti eloszlásának elemzésére.

Egy hagyományos gyertya megmutatja egy időszak nyitóárát, legmagasabb és legalacsonyabb árát, valamint záróárát. Az orderflow azt is vizsgálja, milyen kötések történtek az út során, mely árszinteken koncentrálódtak, és mennyi elérhető ellenoldali mennyiség volt a könyvben. Két ugyanolyan alakú gyertya mögött egészen eltérő kereskedési folyamat állhat.

Például egy emelkedő gyertya létrejöhet erős agresszív vásárlással. De kevés vétel is elegendő lehet hozzá, ha az eladási ajánlatok ritkák vagy visszavonják őket. Azonos ármozgásból ezért önmagában nem következik azonos vásárlási erő.

### Minden kötésnek két oldala van

Ha 100 kontraktus cserél gazdát, a kötésben 100 kontraktust megvásárolnak és 100-at eladnak. A szokásos kötésvolumen ezt 100 kontraktusként számolja, nem 200-ként. A vevő és az eladó személyeinek száma ettől még eltérhet: egy nagy megbízás sok kisebb megbízással találkozhat.

Az „erősebbek a vevők” kifejezés orderflow-környezetben általában azt jelenti, hogy a vevői oldal agresszívebben kezdeményez végrehajtást, vagy a vásárlás nagyobb felfelé irányuló árhatással jár. Nem azt jelenti, hogy a végrehajtott mennyiségen belül több megvásárolt kontraktus van, mint eladott.

**A kulcskülönbség az, hogy ki kezdeményez, és hogyan reagál az ellenoldal.** A passzív eladó lehet olyan erős, hogy sok agresszív vételt kis ármozgással kiszolgál. A passzív vevő pedig sok agresszív eladást fogadhat úgy, hogy az ár nem tud érdemben lejjebb jutni.

### Miért változik az ár

Folyamatos megbízási könyvben az azonnali végrehajtást kereső vásárlás a rendelkezésre álló eladási ajánlatokkal találkozik. Ha egy árszinten elfogy az eladható mennyiség, a következő vétel magasabb árszinten kaphat teljesülést. Eladásnál ugyanez fordítva történik.

Az ajánlati árak új megbízástól vagy törléstől is változhatnak. Ha a legjobb eladási ajánlatot visszavonják, a best ask feljebb kerülhet anélkül, hogy ott előbb kötés történne. A legutolsó kötési ár, a legjobb bid, a legjobb ask és a kettő középértéke ezért különböző dolgok. Mindig tudd, melyiket látod a grafikonon.

A rövid távú árhatásban a kötések mellett az új ajánlatok és a törlések is számítanak. Cont, Kukanov és Stoikov részvénypiaci vizsgálata az order book eseményeit összegző egyensúlytalanságot robusztusabb magyarázó változónak találta a puszta kötésvolumennél. Ez konkrét vizsgálati eredmény, nem minden piacra és időtávra szóló jóslási szabály. [2]

### Mit nem lehet biztosan kiolvasni

Egy szokásos footprintből vagy deltából nem tudod megállapítani a résztvevő személyét, a teljes pozícióját, a célját vagy azt, hogy új pozíciót nyitott-e. Egy agresszív vásárlás lehet új long belépés, short pozíció zárása, fedezés vagy más stratégia része.

Azt sem látod előre, hogyan reagál majd a piac egy új hírre, mikor vonják vissza a likviditást, és mennyi eddig nem látható megbízás érkezik. Az orderflow megfigyelhető eseményekből segít következtetni. A következtetés erőssége mindig kisebb, mint a megfigyelt adat bizonyossága.

## 2 Megbízások és likviditás

### Bid ask és spread

**Bid:** az az ár, amelyen vásárlási ajánlat várakozik. A best bid a legmagasabb aktuális vételi ajánlat.

**Ask vagy offer:** az az ár, amelyen eladási ajánlat várakozik. A best ask a legalacsonyabb aktuális eladási ajánlat.

**Spread:** a best ask és a best bid különbsége. Ha a best bid 100,00, az ask pedig 100,25, a spread 0,25. Az azonnal vásárló fél tipikusan az askhoz, az azonnal eladó fél a bidhez érkezik. Az azonnali oda-vissza ügyletet ezért már a spread is terheli.

**Tick size:** az instrumentum legkisebb megengedett árlépése. **Tick value:** egy tick pénzbeli értéke egy adott mennyiségre. Egy pont több tickből állhat; a pont, a tick és a dollár külön mértékegység.

### Market limit és stop

| Megbízás | Mit határoz meg | Teljesülés fő sajátossága |
|---|---|---|
| Market | Azonnali végrehajtást keres | Az elérhető ellenoldali árakon teljesülhet |
| Limit | Legrosszabb elfogadható vételi vagy eladási árat ad meg | Az ár korlátozott, a teljesülés bizonytalan |
| Marketable limit | Olyan limit, amely már eléri az ellenoldali ajánlatot | A megadott árhatárig agresszíven teljesülhet |
| Stop market jellegű | Aktiváló árszintet ad meg | Aktiválás után azonnali végrehajtást kereshet |
| Stop limit | Aktiváló árszintet és limitárat ad meg | Aktiválás után limitmegbízásként működik |

A limit tehát nem szükségszerűen passzív. Ha 100,25-ön van eladó, és 100,50-es vételi limitet küldesz, az ajánlatod az elérhető 100,25-ös mennyiséggel is találkozhat. Az agresszivitást a könyvhöz viszonyított végrehajthatóság dönti el. A limitár a legrosszabb elfogadható árat korlátozza; jobb ár lehetséges. [1]

A stop megbízás aktiválási feltételhez kötött. A végrehajtás és a védelem részletei piacfüggők: a CME például stop-limit és stop with protection megbízást is használ. A kiválasztott platform és termék szabályait külön ellenőrizni kell. A stopár nem jelent minden körülmény között azon az áron történő teljesülést. [1]

### Agresszív és passzív oldal

Az **agresszív fél** elfogadja az ellenoldali elérhető árat a gyors végrehajtás érdekében. Vételnél ezt gyakran „lifting the offer”, eladásnál „hitting the bid” kifejezéssel írják le.

A **passzív fél** a könyvben várakozik, és likviditást biztosít a hozzá érkező ellenoldalnak. A passzív eladás nem azonos a gyengeséggel: komoly ellenállást jelenthet az agresszív vevőknek. A passzív vásárlás pedig megállíthat egy eladási hullámot.

Ezek az adott végrehajtásban betöltött szerepek. Ugyanaz a kereskedő egyik ügyletében passzívan, a következőben agresszíven kereskedhet.

### Mit jelent a likviditás

A likviditás annak lehetősége, hogy mennyiséget viszonylag gyorsan, kis költséggel és korlátozott árhatással végre lehessen hajtani. Négy külön tulajdonság segít megérteni: a spread szélessége, az árszinteken elérhető mennyiség, a kívánt méret árhatása és a könyv feltöltődésének sebessége.

**Resting liquidity:** a könyvben jelenleg várakozó, látható mennyiség. **Traded volume:** már végrehajtott mennyiség. Ha tegnap sok kontraktust kötöttek 100-on, abból nem következik, hogy ma is nagy várakozó ajánlat van ott.

**Hidden liquidity:** a teljes mennyiség egy része nem látható a szokásos könyvben. Iceberg esetén csak egy rész jelenik meg, amely teljesülés után újratöltődhet. Az újratöltődés önmagában még nem bizonyít icebergöt: több résztvevő új ajánlatai is hasonló képet adhatnak. [3]

### A sorban állás jelentősége

Az, hogy az ár eléri a limitmegbízásodat, nem feltétlenül jelenti, hogy teljesülsz. Ha előtted még sok mennyiség várakozik, és a beérkező ellenoldali forgalom azt sem fogyasztja el, a te megbízásod érintetlen maradhat.

A párosítási prioritás termékfüggő. Egyes piacokon az időbeli sorrend hangsúlyos, másokon arányos vagy kombinált elosztás működik. Az egyszerű „aki előbb érkezett, előbb teljesül” szabályt csak ott alkalmazd, ahol valóban ez a matching algorithm.

### Példa egy vételi megbízás árhatására

Tegyük fel, hogy a könyv eladási oldalán a következő ajánlatok várakoznak:

| Eladási ár | Várakozó kontraktus |
|---|---:|
| 100,25 | 20 |
| 100,50 | 30 |
| 100,75 | 80 |

Egy 60 kontraktusos agresszív vétel először 20-at kap 100,25-ön, majd 30-at 100,50-en, végül 10-et 100,75-ön. Átlagos teljesülési ára megközelítőleg 100,4583. A legutolsó részlet 100,75-ön köt, de ez nem jelenti, hogy az egész megbízás ott teljesült.

Az átlagár számítása: (20 × 100,25 + 30 × 100,50 + 10 × 100,75) / 60.

A példa változatlan könyvet, újratöltődés nélküli ajánlatokat és a szükséges árszintek elérhetőségét feltételezi. Ha ugyanez a 60 kontraktus egy 500 kontraktusos best askkal találkozna, az egész mennyiség elférhetne az első árszinten. Ugyanannyi agresszív vásárlás így eltérő árhatással járna.

## 3 Az aukció logikája és az erőfeszítés eredménye

### A piac mint folyamatos aukció

Az Auction Market Theory, röviden AMT, a piacot folyamatos aukcióként értelmezi. Az ár olyan szinteket keres, ahol a résztvevők hajlandók egymással kereskedni. Ez hasznos leíró keret az oldalazás, a trend és az ár új tartományba kerülésének megértéséhez.

**Balance:** az ár egy tartományon belül ismételten kétirányú kereskedést folytat. **Imbalance:** az aukció irányba mozdul, és más árszinteket vizsgál. **Price discovery:** új kereskedési tartomány keresése.

A profile-ban „fair value”-nak nevezett terület az adott időszak kereskedési elfogadottságára utal. Nem egy részvény vagy más eszköz fundamentális belső értékének kiszámítása. Különböző időtávokon különböző egyensúlyok létezhetnek: a napi trendben is lehet rövid, néhány perces oldalazás.

### Elfogadás és elutasítás

**Acceptance, elfogadás:** a piac ismételten visszatér egy területre, kétirányú kötéseket hoz létre, és ott is képes folytatni a kereskedést. **Rejection, elutasítás:** a piac megvizsgál egy árszintet vagy tartományt, de gyorsan távozik belőle, és egy ideig nem képes ott tartósan kereskedni.

Egyetlen érintésből nem lehet tartós elfogadást megállapítani. Az elfogadásnak nincs minden piacra érvényes kötelező másodperc- vagy gyertyaszáma. Egy kereskedési modellben neked kell előre meghatározni, mit fogsz mérhető elfogadásnak tekinteni.

Például gyakorlási szabályként előírhatod, hogy a kitörési szint fölött két lezárt egyperces gyertya legyen, majd egy visszateszt ne zárjon a szint alá. Ez egy tesztelhető definíció. Attól, hogy pontosan megfogalmaztad, még nem válik bizonyítottan nyereségessé.

### Az erőfeszítés és az eredmény kapcsolata

Az erőfeszítés–eredmény gondolat a kötési aktivitást az ár elmozdulásával hasonlítja össze. A volumen jelzi az aktivitás nagyságát, az ármozgás az adott helyzetben kialakult eredményt. A kapcsolat értelmezése függ a könyv mélységétől, az újratöltődéstől és az időszaktól.

| Megfigyelés | Vizsgálandó értelmezés | Következő ellenőrzés |
|---|---|---|
| Sok kötés és jelentős elmozdulás | Az agresszió eredményes lehetett | Megmarad-e az új tartomány |
| Sok kötés és kevés elmozdulás | Erős passzív ellenoldal vagy kétirányú forgalom lehet jelen | Milyen irányú a forgalom és mi történik utána |
| Kevés kötés és nagy elmozdulás | Ritka vagy visszavont likviditás is okozhatja | Stabil-e a könyv és az ár |
| Kevés kötés és kis elmozdulás | Alacsony aktivitás vagy kivárás lehet | Változik-e az aktivitás a következő vizsgálatnál |

A nagy összvolumen és kis gyertyatartomány még nem bizonyít abszorpciót. A gyertyán belül sok váltakozó vétel és eladás is történhetett. Az abszorpciós értelmezés erősebb, ha meghatározott irányú agresszív kötések egy helyen ismétlődnek, és az ár mégsem jut tovább abba az irányba.

### Mi mozgatja az aukciót

Új információ, fedezési igény, pozíciózárás, portfólióátrendezés és végrehajtási kényszer is változtathatja a résztvevők viselkedését. Ezek hatása a megbízásokon és a likviditáson keresztül jelenik meg az árban. Hír nélkül is lehet nagy ármozgás, és fontos hír mellett is lehet kicsi, ha az információ már beárazódott.

Az „információ mozgatja a piacot” és a „likviditás mozgatja a piacot” mondat különböző szinteket írhat le. Az egyik a motivációra, a másik a végrehajtás feltételeire vonatkozik. A megfigyelt kötésből a teljes motivációt rendszerint nem lehet rekonstruálni.

## 4 Eszközök és adatminőség

### Melyik eszköz milyen kérdésre válaszol

| Eszköz | Fő kérdés | Legfontosabb korlát |
|---|---|---|
| Árgyertya | Hová jutott az ár az időszakban | Nem mutatja a teljes belső folyamatot |
| Idő szerinti volumen | Mennyi mennyiség kötött az időszakban | Nem bontja fel árszintekre |
| Volume profile | Hol kötött a mennyiség | A kiválasztott időszaktól és felbontástól függ |
| Footprint | Hol és melyik agresszoroldalon kötött a mennyiség | A besorolás és a gyertyaképzés számít |
| Delta és CVD | Melyik agresszoroldal kötött nagyobb mennyiséget | Nem méri közvetlenül a passzív oldal erejét |
| DOM | Milyen látható ajánlatok várakoznak most | A mennyiség módosulhat és törlődhet |
| Time and Sales | Milyen kötések érkeztek egymás után | Gyors piacon nehéz manuálisan feldolgozni |
| Likviditási heatmap | Hogyan változott a látható könyv időben | A megjelenített ajánlat nem teljesülési ígéret |
| VWAP | Mi az időszak volumennel súlyozott átlagára | Függ az időszaktól és a számítás adatától |
| TPO Market Profile | Mely árszintek hány időablakban szerepeltek | Időbeli jelenlétet mér, nem kötött mennyiséget |

A DOM pillanatfelvételt ad a könyvről. A heatmap ennek változását teszi visszanézhetővé; a világosabb vagy erősebb szín a beállítások szerint nagyobb látható mennyiséget jelenthet. A történeti heatmap tehát múltbeli várakozó ajánlatokat mutat, és nem válik ettől kötésvolumenné. [9]

### Végrehajtott kötések és várakozó ajánlatok

Az első kategória a már megtörtént ügyletekből áll: ide tartozik a kötéslista és az ezekből képzett volumen, footprint vagy delta. A második a még végrehajtatlan, látható ajánlatokat tartalmazza: ezt követi a DOM és a könyvet ábrázoló heatmap.

A „valós idejű” és a „történeti” felosztás ettől független. Egy footprint is frissülhet valós időben, és egy megbízási könyvnek is lehet történeti felvétele. Az adatok természetét az határozza meg, hogy kötést vagy ajánlatot mutatnak, nem az, hogy élőben nézed-e őket.

### Milyen piac adatát látod

Tőzsdei futuresnél az adott tőzsde és kontraktus központi könyvéhez, valamint kötéseihez kapcsolódó adatot lehet elemezni. Ez jó kiindulás a mechanika tanulásához, de az egész mögöttes piac összes tranzakcióját ez sem fedi le.

Spot forex esetén nincs egyetlen teljes, globális megbízási könyv. A BIS a devizapiacot OTC és több kereskedési helyszínre tagolt piacként írja le. Egy szolgáltató forgalma a saját adatforrására vonatkozik. A forex tick volume gyakran az árfrissítések számát jelenti, nem a teljes devizapiaci kereskedés kontraktusmennyiségét. [12] [6]

Részvények több helyszínen is kereskedhetnek, ezért egyetlen könyv nem feltétlenül fedi le az összes kereskedési érdeklődést. Kriptónál egy adott tőzsde és termék orderflow-ja szintén nem azonos az összes többi tőzsdével. Spot, futures és perpetual adatok összekapcsolásakor külön kell kezelni a termékek eltérését.

A futuresből származó információ segíthet egy kapcsolódó CFD vagy devizapár megértésében, de az árszintek, spreadek, termékfeltételek és végrehajtások eltérhetnek. Az összefüggés nem teszi a két termék adatait felcserélhetővé.

### L1 L2 MBP és MBO

**L1 vagy top of book:** tipikusan a legjobb bid és ask, az ottani mennyiségek és a kötési adatok. **L2 vagy market depth:** több árszint látható ajánlati mennyisége. A pontos csomagtartalom szolgáltatónként változik.

**Market by Price, MBP:** árszintenként összesített ajánlatok. **Market by Order, MBO:** különálló, anonim megbízások adatai, amelyek részletesebb sor- és megbízáskövetést tesznek lehetővé. Az MBO sem árulja el a résztvevő nevét vagy teljes portfólióját. [3]

Az L1/L2 az adatszolgáltatás mélységéhez kapcsolódó elnevezés, az MBP/MBO az ajánlatok részletezettségéhez. A kettő nem azonos felosztás. Egy hagyományos footprinthez nem feltétlenül kell teljes mélységi adat: megfelelő részletes kötések és a kötésoldal besorolása szükséges. A Sierra Chart külön jelzi, hogy a Numbers Bars nem függ market depth adattól. [4]

### Miért különbözhet két platform deltája

Egy szolgáltatás használhat a tőzsdétől származó agresszorjelölést, a kötés pillanatának bid/ask viszonyát vagy ármozgás szerinti becslést. Az utóbbi nem ugyanaz a mérés, mint az igazolt bid/ask kötésbesorolás.

A TradingView volume profile dokumentációja alacsonyabb idősíkú adatokból dolgozó, up/down besorolást ír le. A footprint dokumentációja is az intrabar ármozgás alapján kategorizálja a volument, és a történeti felbontás a rendelkezésre álló adatoktól függ. Emiatt a „buy”, „sell” és „delta” felirat önmagában nem igazolja, hogy valódi bid/ask agresszoradatot látsz. [6] [7]

Két CVD eltérését okozhatja eltérő piac, kontraktus, kötésbesorolás, kezdőidő, session, hiányzó adat vagy szűrés. Először a módszert és a bemenetet hasonlítsd össze. A szoftver márkanevéből önmagában nem lehet eldönteni, melyik mérés felel meg a feladatnak.

### Ellenőrzés a gyakorlás előtt

Minden tanulási munkamenetben tudd megnevezni az instrumentumot, a kereskedési helyszínt és futuresnél a kontraktus lejáratát. Ellenőrizd a volumen mértékegységét, az agresszorbesorolást, a session időhatárait, a CVD resetjét és a grafikon ársorainak méretét.

Visszajátszásnál azt is tisztázd, hogy tickadatot, történeti könyvet vagy csak gyertyákat kapsz. Gyertyás replayből nem lehet az elveszett könyvváltozásokat és kötési sorrendet biztosan visszaállítani. A rollover környékén az aktív kontraktus változhat, ezért a lejáratok és a folytonos grafikon képzésének módja is számít.

A sessioneket a piac saját időzónájában rögzítsd, majd használd a platform időzóna-kezelését. A New York-i és budapesti óraátállítás eltérő napjai miatt az időeltérés egyes hetekben változik. Az RTH és ETH pontos értelmezését termékenként és platformonként ellenőrizd.

## 5 A volume profile részletesen

### Mit mutat a profil

A volume profile egy kiválasztott időszak kötött mennyiségét árszintek szerint rendezi. A hosszabb vízszintes sáv nagyobb mennyiséget jelent az adott ársoron. Az idő szerinti volumen arra válaszol, mennyi kötött például öt perc alatt; a profil arra, ebből hol kötött sok vagy kevés.

Egyetlen ársor több ticket is összefoghat. A profil kinézete emiatt függ az adatok részletességétől, a sorok méretétől és a vizsgált időszaktól. A POC és a value area mindig ennek a konkrét eloszlásnak a jellemzője. [6]

### POC VA VAH VAL HVN és LVN

**Point of Control, POC:** a legnagyobb kötött mennyiségű ársor a kiválasztott profilban. Statisztikai értelemben a leggyakoribb értékhez, a móduszhoz áll közel. Nem szükségszerűen átlagár, és nem automatikus belépési pont.

**Value Area, VA:** a választott célhányadhoz tartozó, általában a POC körül algoritmikusan kialakított összefüggő ársáv. Gyakori beállítás a 70%. **VAH:** e sáv felső határa. **VAL:** az alsó határa. A teljes ársorok bevonása miatt a tényleges volumenhányad eltérhet a célértéktől. [6]

**High Volume Node, HVN:** a profilban viszonylag nagy mennyiségű kiemelkedés. Több is lehet, és a POC ezek közül a legnagyobb. **Low Volume Node, LVN:** a környezetéhez képest kis mennyiségű völgy. Ezek az elnevezések a múltbeli eloszlást írják le. Az aktuális könyv mélységét külön kell megvizsgálni.

Egy HVN környékén kialakulhat újbóli kétirányú kereskedés. Egy LVN vizsgálatakor lehet gyors áthaladás vagy gyors visszafordulás is. A harmadik lehetőség, hogy az új körülmények miatt ott most jelentős mennyiség kezd felhalmozódni. A régi eloszlás nem köti meg a jelenlegi résztvevőket.

### A value area kiszámítása egy példán

Az alábbi kitalált profil összesen 1000 kontraktust tartalmaz:

| Ársor | Kötött kontraktus | Részesedés |
|---|---:|---:|
| 100,00 | 60 | 6% |
| 100,25 | 180 | 18% |
| 100,50 | 320 | 32% |
| 100,75 | 230 | 23% |
| 101,00 | 140 | 14% |
| 101,25 | 70 | 7% |
| Összesen | 1000 | 100% |

A POC 100,50, mert itt kötött a legtöbb, 320 kontraktus. A 70%-os cél 700 kontraktus. Egy szemléltető számításban a POC-ból indulunk, és mindig a már bevont tartomány két közvetlenül szomszédos sora közül a nagyobb volumenűt vonjuk be.

Először 100,75 kerül be, mert 230 nagyobb, mint az alsó szomszéd 180-as mennyisége. Az összeg 550. Ezután az új felső szomszéd, 101,00 mennyisége 140, míg 100,25-é 180. Az alsó sort vonjuk be: az összeg 730, így a 700-as cél teljesült.

Ebben a példában VAL = 100,25, VAH = 100,75, a ténylegesen bevont hányad 73%. A sorok nem darabolhatók tetszőlegesen, ezért lett az eredmény nagyobb 70%-nál. Más platformok eltérő szomszédsor-kezelést, tie-break szabályt vagy több sor együttes összehasonlítását használhatják. A példában alkalmazott algoritmus egyértelmű, de nem helyettesíti a konkrét szoftver dokumentációját.

### Miért nem egy szórás a 70 százalék

A normális eloszlásnál az átlag körüli egy szórás hozzávetőleg 68,3%-ot foglal magában. A volume profile 70%-os value area beállítása viszont választott volumenhányadot keres, és nem feltétlenül az átlagból vagy a szórásból számol.

A piaci profil lehet ferde, többcsúcsú vagy töredezett. Ezért a value area határaiból nem következik, hogy az ár 70% valószínűséggel ott marad. Az adott mintában kötött mennyiség aránya és a jövőbeli ár helyének valószínűsége két külön fogalom.

A 40%-os „core value area” egy szűkebb célhányadú egyedi beállítás. Nem univerzálisan jobb, és durva felbontás mellett nem feltétlenül ad finom szinteket. A fenti példában a POC 32%, a következő teljes sorral együtt már 55%; a 40%-os cél így is jelentősen túlléphető.

### Milyen időszakból épüljön a profil

**Session profile:** egy előre megadott kereskedési szakasz profilja. **Fixed range profile:** kézzel vagy szabály alapján választott kezdet és vég közötti profil. **Visible range profile:** a képernyőn látható részhez kapcsolódik, ezért zoomoláskor változhat. **Composite profile:** több nap vagy szakasz összesített profilja.

Gyakorláskor olyan választást használj, amelyet később is azonos módon meg tudsz ismételni. Ha minden helyzet után addig változtatod a kezdőpontot, amíg „szép” reakciószintet kapsz, utólag illeszted a magyarázatot. Egy rögzített session vagy előre definiált swing-szakasz jobb összehasonlítási alapot ad.

**Developing POC és developing VA:** az éppen épülő időszak aktuális értékei. A session végső profilja csak a session végén ismert. Replayben a később kialakuló végső POC használata korábbi belépés igazolására jövőbeli információ bevonása lenne.

### Profilalakok és értékterület-vándorlás

A D alak gyakran viszonylag középen koncentrálódó eloszlásként jelenik meg. A P alaknál több volumen gyűlik a felső részen, a kis b alaknál az alsón. A kétcsúcsú eloszlás két jelentősebb volumenkoncentrációt tartalmaz, közöttük kisebb forgalmú területtel.

Ezek alakleírások. A P alakhoz gyakran társítanak short covering történetet, a b alakhoz long liquidationt, de a profil alakja önmagában nem azonosítja a résztvevők pozícióváltozását. Ugyanaz az alak több különböző folyamatból létrejöhet.

Ha több egymást követő, összehasonlítható session value area területe és POC-ja magasabbra kerül, az magasabb árszinteken kialakuló kereskedési elfogadást jelez. Ez az emelkedő trend egyik lehetséges kontextusa. Egyetlen magasabb profil viszont kevés annak kijelentéséhez, hogy a következő nap is emelkedni fog.

Vizsgáld az átfedést is. Két terület emelkedhet úgy, hogy nagyrészt egymáson marad; ez más környezet, mint amikor a következő session szinte teljesen új tartományba kerül. Az éppen zajló aukció reakciója döntő marad.

### A VWAP külön szerepe

A VWAP, vagyis Volume Weighted Average Price, volumennel súlyozott átlagár. Kötésszintű adatnál az egyes kötési árakat megszorozzuk a hozzájuk tartozó mennyiséggel, ezeket összeadjuk, majd osztunk az összvolumennel. Gyertyákból számoló megoldásnál a használt reprezentatív gyertyaár és az adatfelbontás is számít. [8]

Ha 100-on 20, 101-en 30, 102-n 50 kontraktus kötött, a VWAP (100 × 20 + 101 × 30 + 102 × 50) / 100 = 101,30. A POC viszont 102, mert ott a legnagyobb az egyedi mennyiség. Az átlag és a legnagyobb csúcs tehát eltérhet.

A VWAP hasznos viszonyítási pont az adott időszak átlagos végrehajtási árszintjéhez. Az, hogy az ár felette van, még nem önálló vételi jel. Tartós trendben az ár hosszabb ideig is távol maradhat tőle. A VWAP-hoz kapcsolódó szórássáv nem azonos a volume profile value area területével.

### TPO és volume profile

A TPO, Time Price Opportunity, időablakokban rögzíti egy árszint jelenlétét. Ha ugyanaz az árszint sok időablakban szerepel, több TPO-t kap. A volume profile ezzel szemben a kötött mennyiséget összegzi. [11]

Egy áron lehet sok rövid idő alatt végrehajtott kötés, és lehet kevés kötés sok külön időablakban. A volume POC és a TPO POC emiatt eltérhet. A két eszköz összekapcsolható, de a mennyiség és az idő szerinti mérés külön értelmezést igényel.

## 6 Delta és kumulatív delta

### A delta számítása

Bid/ask kötésbesorolás esetén a delta az askon végrehajtott, vevő által kezdeményezett mennyiség és a biden végrehajtott, eladó által kezdeményezett mennyiség különbsége. A pozitív delta több agresszív vételi, a negatív több agresszív eladási mennyiséget jelez az adott mintában. [4] [5]

**Delta = askon kötött volumen − biden kötött volumen.**

Ha 710 kontraktust sorolunk az askhoz és 290-et a bidhez, az összvolumen 1000, a delta +420. A deltarány +42%, mert 420 / 1000 × 100 = 42%. Itt feltételezzük, hogy minden kötés e két oldal valamelyikéhez került.

Ez nem 420 „plusz vevőt” jelent. Az összes 1000 kontraktushoz vevő és eladó is tartozott. A +420 azt jelzi, mennyivel volt nagyobb a vételi agresszorhoz sorolt mennyiség az eladási agresszorhoz soroltnál.

### Miért nem jóslat a delta előjele

Tegyük fel, hogy sokan vásárolnak agresszíven, de egy passzív eladói oldal folyamatosan kiszolgálja őket. A delta pozitív, az ár mégsem jut feljebb. Ha később a vásárlók aktivitása gyengül és eladás indul, az ár eshet.

Máskor kevés agresszív vétel is jelentős emelkedést okoz, mert az eladási könyv ritka. Ilyenkor a delta kicsi lehet, az árhatás mégis nagy. Ezért a delta önmagában nem mutatja meg, mennyire eredményes az agresszív oldal.

Egy emelkedő gyertya negatív deltával is összeegyeztethető. Például a gyertya első felében sok agresszív eladás köt alacsonyabb árszinteken, majd a későbbi, kisebb vételi forgalom magasabbra viszi az árat. A gyertya összesítése eltakarhatja ezt a sorrendet.

### A CVD jelentése és kezdőpontja

A CVD, Cumulative Volume Delta, a kiválasztott kezdőpont óta összegzett delta. Ugyanazokból a kötésekből származó egymást követő bar deltákat összeadja. A session eleji nullázás vagy más reset megváltoztatja a viszonyítási alapját. [5]

| Gyertya | Gyertya deltája | CVD nulláról indulva |
|---|---:|---:|
| 1 | +120 | +120 |
| 2 | −80 | +40 |
| 3 | +200 | +240 |
| 4 | −50 | +190 |

A CVD lehet pozitív úgy is, hogy éppen csökken: a táblázat utolsó sora ezt mutatja. A szint azt jelzi, mi halmozódott fel a kezdőpont óta; a friss változás azt, mi történt az utolsó időszakban. Az abszolút szintet eltérő reset vagy eltérő kontraktus között közvetlenül összehasonlítani félrevezető.

### Divergencia az ár és az agresszió között

Ha az ár új csúcsot ér el, miközben a CVD nem ér el új csúcsot, az eltérő viselkedést jelez. Lehet gyengülő vételi agresszió, de lehet olyan eladási könyv is, amelyből kevesebb mennyiséget kell elfogyasztani. A divergencia lehetséges magyarázatokat ad, nem egyetlen biztos okot.

Ha az ár új mélypontot vizsgál és a CVD is jelentősen esik, miközben az ár alig halad tovább, felmerülhet az eladói agresszió abszorpciója. Ezt erősítheti a visszatérés a korábbi tartományba és a későbbi eladási próbálkozás kudarca. Ha viszont az ár alacsonyabban elfogadást alakít ki, a fordulós elképzelés gyengül.

Nem minden divergencia alkalmas kereskedésre. A jel értelmét a helyszín, az időtáv, a friss kötési sorrend és az ár további viselkedése határozza meg. A CVD és a footprint gyakran ugyanannak a kötési adatnak két összesítése; ezek együttes jelenléte nem két független bizonyíték.

### Három különböző imbalance

A **trade delta** a már végrehajtott agresszív mennyiségek különbsége. A **book imbalance** a várakozó ajánlatok közötti mennyiségi aránytalanság. Az **Order Flow Imbalance, OFI** egy kutatási definícióban a legjobb árszintek ajánlatváltozásait, kötések és törlések hatását is összegzi. Ezeket nem lehet pusztán az „imbalance” szó alapján azonos mérésként kezelni. [2]

## 7 A footprint olvasása

### A gyertya belsejének felbontása

Egy bid × ask footprint árszintenként mutatja az adott gyertyában biden és askon kötött mennyiséget. Gyakori elrendezésben a bid volumen balra, az ask volumen jobbra kerül. Az oszlopok sorrendjét mindig a platform jelmagyarázatából ellenőrizd. A footprint színezése és a kiemelések beállításai nem univerzálisak. [4]

A következő példa 0,25-ös ársorokat és valódi bid/ask besorolást feltételez. Az ársorok itt növekvő sorrendben szerepelnek; sok platformon a magasabb ár kerül felülre.

| Ár | Bid volumen | Ask volumen | Sor deltája |
|---|---:|---:|---:|
| 100,00 | 40 | 10 | −30 |
| 100,25 | 60 | 180 | +120 |
| 100,50 | 50 | 220 | +170 |
| 100,75 | 30 | 170 | +140 |
| 101,00 | 20 | 100 | +80 |
| 101,25 | 15 | 25 | +10 |
| Összesen | 215 | 705 | +490 |

Az összvolumen 920, a delta +490, a deltarány körülbelül +53,3%. A legnagyobb összvolumen 100,50-en van: 50 + 220 = 270. Ez a gyertya volume POC-ja. Ugyanitt a legnagyobb a sor pozitív deltája is, de más példában a két maximum eltérhet.

A táblázat azt mutatja, hol kötött a mennyiség a teljes gyertyában. Nem bizonyítja, hogy az ár egyszer, folyamatosan ment végig 100-ról 101,25-re. Az ár több alkalommal is visszatérhetett ugyanarra a sorra. A pontos sorrendhez kötéslista vagy megfelelő replay szükséges.

### Átlós összehasonlítás

Gyakori footprint-imbalance számításnál az adott ár ask mennyiségét az eggyel alacsonyabb ársor bid mennyiségével hasonlítják össze. Eladási iránynál az adott ár bid mennyiségét az eggyel magasabb ársor ask mennyiségével. Ez az átlós összehasonlítás különbözik az azonos soron számolt deltától. [4]

A fenti példában 100,25 askja és 100,00 bidje 180 / 40 = 4,5 arányt ad. 100,50 askja és 100,25 bidje 220 / 60 ≈ 3,67. Ha a jelölési küszöb 3:1, mindkettő vételi imbalance lehet a megadott szabály szerint.

100,75-nél 170 / 50 = 3,4; 101,00-nál 100 / 30 ≈ 3,33. Így négy egymást követő ársoron teljesül a 3:1 arány. 101,25-nél 25 / 20 = 1,25, tehát ez már nem teljesíti a feltételt.

### Stacked imbalance és szűrés

A **stacked imbalance** több egymás melletti, azonos irányú imbalance sorozata. A példában a négy kiemelhető sor ilyen sorozatot alkotna, ha a platform szabályai és a mennyiségi szűrés is ezt engedik.

Az arány önmagában elégtelen. A 3:1 három kontraktus és egy kontraktus összehasonlításából is kijöhet. Gyakorlási szabályként például megkövetelheted, hogy a nagyobbik összehasonlított mennyiség legalább 100 legyen. Ez a számpélda négy sorát engedné, de egy másik piacon teljesen más küszöb lehet értelmes.

Nullával osztani matematikailag nem lehet. A platform ilyenkor mellőzheti az összehasonlítást vagy külön szabályt alkalmazhat. Az így létrejövő színezés értelmezéséhez ellenőrizd a nullakezelést és a szélső ársorok szabályait. A „300%” felirat értelmét is nézd meg: a példában a 3:1 arányt használjuk.

### Mit mondanak a gyertya szélső árai

A gyertyacsúcson lévő nagy ask volumen azt mutathatja, hogy a vevők ott is agresszívek voltak. Ha az ár a csúcs közelében marad és újabb emelkedés követi, ez eredményes vásárlás része lehet. Ha gyorsan visszaesik, ugyanez a forgalom egy sikertelen vételi próbálkozás nyoma is lehet.

A „finished” és „unfinished auction” elnevezéseket bizonyos footprint-módszerek a szélső ársorok kötésmintájára használják, például arra, hogy a szélső soron mindkét oldalhoz tartozik-e kötés. Ebből nem következik kötelező későbbi visszatérés. A mintát a platform besorolása és az ársor mérete is befolyásolja.

### A gyertyaképzés szerepe

Az időgyertya rögzített időtartamot foglal össze. A volume bar adott mennyiség után záródik. A range bar meghatározott ármozgás szerint épül; a tick bar meghatározott számú kötéshez vagy adat-eseményhez kapcsolódhat, a platform definíciója szerint.

Ugyanazokból a kötésekből más gyertyaképzés eltérő footprint-mintát adhat. Ezért egy modellen belül előre rögzítsd a bar típusát és paraméterét. Utólag ne váltogasd addig, amíg a jel könnyebben felismerhetőnek tűnik.

## 8 Abszorpció kifáradás és csapdák

### Abszorpció

Az **absorption, abszorpció** olyan folyamat, amelyben a passzív ellenoldal jelentős agresszív forgalmat fogad, miközben az ár keveset halad tovább az agresszió irányába. A Bookmap oktatása a passzív megbízások által felvett agresszív kötések és a kifáradás megkülönböztetésére épít. [10]

Eladói agresszió abszorpciójánál sok eladás érkezik a bidre, de az ár nem tud tartósan lejjebb jutni. A feltételezett abszorbeáló oldal ilyenkor a passzív vevő. Vevői agresszió abszorpciójánál sok vásárlás érkezik az askra, de az ár nem halad tartósan feljebb; a feltételezett ellenoldal passzív eladó.

A kifejezések félreérthetők. A „buy absorption” egy oktatásban a passzív vevő által végzett felvételt, máshol a vásárlások elnyelését jelentheti. Mindig írd le a teljes folyamatot: „agresszív eladást vesz fel a passzív vevő”, vagy „agresszív vételt vesz fel a passzív eladó”.

### Mi erősíti az abszorpciós elképzelést

Először azonosíts egy konkrét területet. Nézd meg, hogy azonos irányú agresszív kötések ismétlődnek-e ott, miközben az ár nem jut tovább. Figyeld az ajánlatok újratöltődését, ha ehhez megfelelő könyvadatod van. Ezután vizsgáld, hogy az ár képes-e elindulni az ellenkező irányba, illetve a következő próbálkozás is kudarcot vall-e.

Egy nagy negatív delta a mélyponton még kevés. Ha rövid megállás után újabb mélypontok következnek, a passzív vevő átmenetileg fogadhatott eladásokat, de nem tartotta meg a területet. Az abszorpció megfigyelése nem jelent automatikusan fordulót.

A visszajátszásban különítsd el a korai gyanút a későbbi megerősítéstől. A jövőből már látható fordulat alapján könnyű minden előző nagy volumenű sort „biztos abszorpcióként” megnevezni. Valós időben csak az addig rendelkezésre álló reakcióból dolgozhatsz.

### Kifáradás

Az **exhaustion, kifáradás** az agresszív folytatási aktivitás gyengülése. Például egymást követő emelkedő vizsgálatok során egyre kevesebb új agresszív vétel érkezik, és az ár sem jut érdemben magasabbra.

Abszorpciónál jelentős agresszió talál erős passzív ellenoldalt. Kifáradásnál az agresszió utánpótlása fogyhat el. A két jelenség együtt is előfordulhat: először sok vételt fogad az eladó, később már kevesebb vásárló marad.

A kis szélső volumen lehet egyszerűen rövid vizsgálat vagy durva adatfelbontás következménye is. Kifáradást ezért ismétlődő folyamatként és a szokásos aktivitáshoz képest érdemes vizsgálni.

### Sikertelen aukció és beszorult kereskedők

**Failed auction vagy failed breakout:** az ár új területre jut, de nem alakít ki ott tartós kereskedést, és visszatér a korábbi tartományba. **Trapped traders:** olyan résztvevők feltételezett csoportja, akik az elmozdulás folytatására léptek be, majd az ellenkező mozgás miatt kedvezőtlen helyzetbe kerültek.

Felső kitörésnél agresszív vételek jelenhetnek meg. Ha az ár visszaesik a tartományba, egyes vevők később eladással zárhatnak; ez ráerősíthet a lefelé mozgásra. A kötésekből azonban rendszerint nem azonosítható biztosan, kik és milyen pozíciót zárnak. A „csapda” egy megfigyelt árfolyamat értelmezése.

### Stop sweep és visszatérés

A **sweep** több árszint gyors végigjárását vagy az ottani ajánlatok gyors elfogyasztását jelenti. Korábbi csúcs vagy mélypont körül aktiválódó stopok hozzájárulhatnak a mozgáshoz, de a szokásos DOM nem mutatja biztosan az összes stop helyét és méretét.

Egy csúcs fölé szúrás után két eltérő folytatás lehetséges. Az ár ott maradhat és új tartományt alakíthat ki, vagy visszaeshet a régi tartományba. A csúcs átlépése önmagában nem mondja meg, melyik következik. A későbbi elfogadás vagy elutasítás ad további információt.

### Stacking pulling iceberg és spoofing

**Stacking:** látható ajánlatok felépülése a könyvben. **Pulling:** ajánlatok visszavonása. Ha a kínálati oldal eltűnik, kevesebb vétel is magasabbra mozdíthatja az árat. A visszavonás lehet normális kockázatkezelési reakció, és egyetlen törlésből nem állapítható meg megtévesztési szándék.

Az iceberg csak a teljes mennyiség egy részét mutatja. A CME MBO leírása külön kezeli a tőzsdén kezelt native és a külső rendszer által kezelt synthetic icebergöt; ezek követhetősége eltérhet. A részleges megjelenítés önmagában nem azonos a spoofinggal. [3]

A **spoofing** megtévesztő, végrehajtás előtti törlési szándékkal beadott ajánlatokhoz kapcsolódó magatartás. A CFTC példája ilyen szándékot és ismétlődő kereskedési mintát ír le. Egy nagy ajánlat megjelenését és eltűnését látva ezt a szándékot a saját grafikonodból nem tudod bizonyítani. [14]

## 9 Az adatok összekapcsolása

### A döntés gondolatmenete

A piac értelmezését a tágabb környezettel kezdd. Az ár egy kialakult tartomány közepén jár, annak szélét teszteli vagy új területet keres? Az előző és az aktuális profil hol mutat kereskedési koncentrációt? A jelenlegi mozgás milyen időszakban történik?

Ezután azonosítsd a megfigyelés helyszínét. Egy nagy delta a tartomány közepén más helyzet, mint ugyanaz a delta egy korábbi mélypont alatt. A helyszín segít megfogalmazni, milyen folyamatot vársz: visszatérést, folytatást vagy kivárást.

Végül a friss eseményt és az árreakciót kapcsold össze. Ki köt agresszíven? Az ár halad-e abba az irányba? Megmarad-e az elért ársáv? Mely megfigyelés cáfolná meg az elképzelésedet? Ha kereskedést is vizsgálsz, ezután következik a végrehajtható belépés, az érvénytelenítés helye és a kockázat számítása.

### Négyféle ár és delta kapcsolat

| Ár friss viselkedése | Delta | Első vizsgálati kérdés |
|---|---|---|
| Emelkedik | Pozitív | Tartósan eredményes-e az agresszív vétel |
| Stagnál vagy visszaesik | Erősen pozitív | Hol fogadja a passzív eladó a vételeket |
| Esik | Negatív | Tartósan eredményes-e az agresszív eladás |
| Stagnál vagy emelkedik | Erősen negatív | Hol fogadja a passzív vevő az eladásokat |

A táblázat vizsgálati kiindulópontot ad. A sorok nem önálló belépési jelek. Más magyarázat is lehetséges, különösen akkor, ha a gyertya aggregálása eltakarja a sorrendet vagy a delta becsült besorolásból származik.

### Mit adj hozzá a hagyományos árfolyamelemzéshez

Támasz, ellenállás, swing, trend és range segíthet a helyszín kijelölésében. A volume profile hozzáteszi, hol halmozódott fel a kereskedési mennyiség. A footprint és a delta a friss agressziót bontja ki, a könyvadat pedig a látható ajánlatok változását mutatja.

Ha már találkoztál a BOS, CHoCH vagy FVG szavakkal, kezeld őket előre definiált árfolyamminták elnevezéseiként. Egy gyertyákból azonosított FVG és egy kis volumenű profilsor egybeeshet, de a kettő nem azonos mérés. Egy FVG önmagában nem bizonyítja, milyen passzív vagy agresszív szereplő van jelen.

### A bizonyítékok súlya

Ugyanaz a vételi forgalom megjelenhet pozitív deltában, emelkedő CVD-ben és vételi footprint-imbalance-ben is. Ha ezeket három külön megerősítésnek számolod, ugyanazt az információt többször értékeled.

Hasznosabb megkülönböztetni a helyszínre, a végrehajtott kötésekre, a várakozó ajánlatokra és a későbbi árreakcióra vonatkozó megfigyeléseket. Ezek sem teljesen függetlenek, de más kérdésre válaszolnak. A legerősebbnek tűnő jel is gyengül, ha az ár következetesen az elképzeléseddel ellentétesen viselkedik.

## 10 Végigvezetett gyakorlati helyzetek

### Eladói agresszió abszorpciója a tartomány alján

Az előző befejezett session profiljának VAL-ja 100,00, POC-ja 102,00, VAH-ja 104,00. Az új session ára 100 környékére érkezik. A tartományba való visszatérés lehetőségét figyeled, de az ár érkezése még nem belépés.

Az ár 99,75-re kerül. A mélypont környékének megfigyelt időablakában 900 bid és 250 ask kontraktus köt: a delta −650, az összvolumen 1150. Ennyi agresszív eladás mellett az ár nem éri el 99,50-et. Ez felveti, hogy passzív vevők fogadják az eladásokat, de egyelőre az alsó árszint csak átmenetileg tartott.

A következő megfigyelt szakaszban az ár visszatér 100 fölé. Egy későbbi visszateszt nem hoz új mélypontot, majd az ár 100,50-re emelkedik. Ez már erősebb bizonyíték a lefelé irányuló vizsgálat kudarcára. Az orderflow-értelmezés az, hogy a nagy eladói agresszió kevés további lefelé eredményt ért el, majd ellenkező árreakció következett.

Egy szemléltető szimulált long terv 100,50-es teljesülést, 99,50-es stopot és 102,50-es célárat használ. Az árkockázat 1,00 pont, a lehetséges nyereség 2,00 pont, tehát a tervezett arány költségek előtt 2R. A cél valamivel a korábbi POC fölött van; azt külön tesztelni kell, hogy az ár milyen gyakran jut túl a köztes 102,00-s területen.

A fordulós elképzelés gyengül, ha a visszatérés után az ár ismét 100 alá kerül és ott kereskedik tovább. A gyakorlási terv dönthet úgy, hogy ekkor már a stop előtt zár, de az ilyen szabálynak előre rögzítettnek és külön teszteltnek kell lennie. Ha a piac rögtön 99,50 alá indul, a megerősítés sem alakul ki, ezért a bemutatott belépés nem jön létre.

### Kitörés és folytatás

Ugyanebben a korábbi profilban a VAH 104,00. Az aktuális session több alkalommal teszteli a felső területet, majd 104 fölé kerül. A magasabb ársávban további kötések keletkeznek, és az ár nem tér vissza tartósan 104 alá.

A kitörés során a vételi agresszió mellett az ár is halad. A visszahúzódás 104,25-ig jut, ahol negatív delta jelenik meg, de nem alakul ki tartós lefelé mozgás. A következő szakaszban az ár újra emelkedik. Itt a negatív delta a visszahúzódás része, és nem automatikus short jel.

Egy oktatási long terv 104,75-ös belépést, 103,75-ös stopot és 106,75-ös célt használhat. A tervezett arány költségek előtt 2R. A hipotézis az új, magasabb ársáv elfogadása és a visszahúzódás megállása. Ha az ár visszatér a régi value area területébe és ott marad, a folytatási elképzelés gyengül.

A helyzetet különítsd el attól, amikor egyetlen gyertya felnyúlik 104 fölé, majd azonnal visszaesik. Az első példában a magasabb ársávban is folytatódott kereskedés; a másodikban ez még hiányzik. Replayben csak az addig épülő profilt nézheted, a nap végén ismert profilt nem.

### Sikertelen felső kitörés

Az ár 104,75-ig emelkedik. A kitörési területen sok ask kötés jelenik meg, de az új csúcs után az ár visszakerül 104 alá. Egy későbbi 104 körüli visszateszt sem tudja visszavinni a piacot a magasabb ársávba.

A nagy vételi aktivitás így nem biztosította az elért terület megtartását. Felmerül a passzív eladói ellenállás és a kitörésre vásárlók kedvezőtlen helyzetbe kerülése. E szereplők személyét és tényleges zárásait a footprint nem igazolja; a biztosan megfigyelhető tény a nagy vételi aktivitás utáni visszatérés.

Egy szemléltető short terv 104,00-s belépést, 105,00-s stopot és 102,00-s célárat használhat. Az árkockázat 1 pont, a cél 2 pont, tehát 2R költségek előtt. A megerősítéshez tartozó visszateszt szabályát előre kell megadni. Ha az ár újból 104 fölött folytatja a kereskedést, az elutasítási elképzelés gyengül.

### Amikor nincs értelmes belépés

Az ár 102 körül mozog, a korábbi value area közepén. Az egymást követő gyertyák deltája váltakozik, a CVD lapos, és mindkét irányban rövid imbalance-ek jelennek meg. A vételi és eladási próbálkozások egyaránt gyorsan visszatérnek a középső ársávba.

Ebben a helyzetben a sok adat nem feltétlenül jelent jó kereskedési lehetőséget. Hiányozhat egy jól elkülöníthető helyszín, egy értelmes érvénytelenítési pont és a költségeket meghaladó várható elmozdulás. A megfigyelést érdemes naplózni, de a modell engedélyezheti a kivárást.

A „nem kereskedtem, mert a feltételek nem teljesültek” értékelhető döntés. A cél nem az, hogy minden gyertyához utólag találj történetet, hanem hogy előre meghatározott helyzeteket felismerj és következetesen kezeld őket.

## 11 Egy tesztelhető kereskedési modell felépítése

### Mi hiányzik egy jó megfigyelésből

Az „abszorpciót látok a VAL-nál” egy értelmezés. Kereskedési modell akkor lesz belőle, ha megadod a piacot, az adatot, a helyszínt, a konkrét belépési feltételt, a végrehajtás módját, a stopot, a kilépést és a kizáró körülményeket.

Az is szükséges, hogy ugyanazt a példát később nagyjából ugyanúgy minősítsd. Ha az abszorpciót egyik alkalommal nagy deltának, máskor nagy összvolumennek, harmadszor egy hosszú alsó kanócnak nevezed, az eredményeidet nem tudod egyetlen mintaként értékelni.

### Egy kezdeti kutatási modell

Az alábbi modell a tartomány alja alatti sikertelen vizsgálatot teszi gyakorolhatóvá. A paraméterek oktatási választások, nem optimalizált ajánlások.

1. Rögzíts egy instrumentumot, egy meghatározott sessiont és egyperces időgyertyákat. A korábbi befejezett session VAL-ját használd referenciaként.
2. Csak akkor figyelj belépést, ha az ár a VAL alá kerül. Előre válassz egy maximális távolságot tickben, amelyen belül még ezt a referenciát teszteltnek tekinted.
3. Jelöld a VAL alatti vizsgálat időablakát. Ebben negatív delta szükséges, de az adott küszöböt a kiválasztott piac adatai alapján külön rögzítsd. A nagy negatív delta önmagában még nem enged belépést.
4. Várj egy lezárt egyperces gyertyára, amely a VAL fölött zár. Ez lesz a visszatérés megfigyelhető feltétele.
5. A következő legfeljebb három gyertyában keress visszatesztet, amely nem hoz a vizsgálati mélypont alá új árat, majd egy gyertya a közvetlenül megelőző gyertya csúcsa fölött zár. A jelgyertya zárása után szimulálj vételt a következő elérhető askon.
6. A stop helye a vizsgálati mélypont alatt egy tick. A kockázatot a tényleges szimulált belépéshez mérd. A teszt első verziójában a cél 2R; köztes referencia közelségét naplózd, de ne változtasd utólag az egyes ügyletek célját.
7. Ha nincs visszateszt a három gyertyában, új mélypont keletkezik vagy a kockázat túl nagy a rögzített kerethez, ne legyen kötés. A sessionenkénti maximális kötésszámot és veszteséglimitet is rögzítsd előre.

Ez a változat szándékosan pontosítja, mi mikor ismert. A footprint kezdetben a jelöltek értelmezését segíti, de további footprint-szűrőt csak új modellverzióként adj hozzá. A hozzáadott feltétel eredményeit új adatokon is ellenőrizni kell.

### Mit vizsgálj a modellben

Mérd, hogy a visszatérés után mennyire gyakran sikerül megtartani a mélypontot, milyen messzire jut az ár, és mennyi ellened történő mozgás előzi meg az esetleges folytatást. Hasonlítsd össze a range és trend környezeteket, illetve az eltérő napszakokat.

A kialakításra használt példák és a későbbi ellenőrző példák legyenek külön. Ha egy szabály csak azon a napcsoporton működik, amelyen kitaláltad, még nem tudod, általánosítható-e. Egy szabályváltozás után ne vond össze automatikusan az előző és az új verzió eredményét.

### Miért kell a rossz példákat is gyűjteni

A tanulás szempontjából értékes az a helyzet, ahol nagy eladói agresszió mellett átmenetileg megáll az ár, majd mégis tovább esik. Ez mutatja meg, hogy a fordulós történet mikor marad téves.

Külön gyűjts olyan példákat is, ahol az ár a várt irányba ment, de a saját belépési feltételed nem alakult ki. Ezeket nem szabad nyerő ügyletekként hozzáadni a modellhez. A megfigyelt piaci mozgás és a ténylegesen végrehajtható kereskedés eredménye külön adat.

## 12 Kockázat költségek és várható érték

### Az R jelentése

Az **1R** egy ügylet előre meghatározott kezdeti árkockázata, pénzben vagy ahhoz viszonyított egységben kifejezve. Ha a belépés és a stop közötti távolság 1 pont, a cél pedig 2 pont, a tervezett árarány 2R. A tényleges eredményt a teljesülések és a költségek módosítják.

Rögzítsd, hogy a naplóban az R nevezője csak a kezdeti árkockázat vagy már a teljes költségkeret. A következő példák az árkockázatot használják nevezőként, a költséget külön vonják le. Így egy stopos ügylet nettó eredménye rosszabb lehet −1R-nél.

### Pozícióméret egy MES példán

A CME Micro E-mini S&P 500, MES, 0,25 pontos tickje egy kontraktuson 1,25 dollár; egy pont értéke 5 dollár. Ezek termékspecifikus adatok, nem minden futuresre érvényes értékek. [13]

Tegyük fel, hogy egy szimulált ügylet stopja 8 tickre van. Az árkockázat egy kontraktuson 8 × 1,25 = 10 dollár. A példa kitalált oda-vissza jutaléka 2 dollár, a külön megengedett további végrehajtási eltérés tartaléka 1 tick, azaz 1,25 dollár. A becsült teljes keret egy kontraktusra 13,25 dollár.

Ha az oktatási kockázatkeret 25 dollár, akkor lefelé kerekítve 25 / 13,25 alapján 1 kontraktus fér bele. Kettő már 26,50 dolláros becsült keretet jelentene. A jutalék és az eltérés itt szemléltető feltételezés, nem szolgáltatói árajánlat és nem maximális veszteséggarancia.

A számítás: **mennyiség = egészrész[kockázatkeret / egy egység becsült kockázata]**. Ha az eredmény nulla, a legkisebb mennyiség is túl nagy ehhez a kerethez. A marginigény, a számla kereskedési engedélye és az ügylet kockázata külön feltétel.

### A költségek számítása

A jutalék, a spread és a kedvezőtlen teljesülés rövid távon sokat számíthat. Ne vond le ugyanazt kétszer: ha a szimuláció belépést a tényleges askon és kilépést a tényleges biden számolja, a spread hatása már része az áreredménynek. A további slippage-et ehhez képest kezeld.

A várható teljesülési árhoz a megbízásméret és a könyv is hozzátartozik. Egy érintett limitár nem biztos fill, egy piaci stop pedig rosszabb áron is teljesülhet. A visszatesztben látott tökéletes belépési és kilépési árak könnyen túlbecsülik a valós eredményt.

### Találati arány és várható érték

A találati arány önmagában nem mutatja meg, hogy a modell pénzt keres-e. A várható értékhez a nyerő és vesztes ügyletek átlagos mérete, valamint a költség is szükséges.

**Várható érték = nyerési arány × átlagos bruttó nyereség − veszteségi arány × átlagos bruttó veszteség − átlagos költség.**

Ha a nyerési arány 40%, az átlagos bruttó nyerő 1,8R, az átlagos bruttó vesztes 1R, az átlagos költség 0,15R, akkor 0,40 × 1,8 − 0,60 × 1 − 0,15 = −0,03R. Költségek előtt az érték +0,12R lenne; a költség a példában negatívra fordítja.

Ezeknél az állandó átlagértékeknél a nullszaldós nyerési arány (1 + 0,15) / (1,8 + 1) ≈ 41,1%. Ez számolási összefüggés, nem annak előrejelzése, hogy a következő minta milyen nyerési arányt ad.

### Folyamatminőség és eredmény

Egy szabályos ügylet veszthet. Egy szabálytalan ügylet nyerhet. Ha minden veszteség után megváltoztatod a modellt, a véletlen ingadozást is új szabályként fogod értelmezni. Ha minden nyerőből jó döntésre következtetsz, a kockázatos szokásokat is jutalmazod.

A napi és heti értékelésben külön rögzítsd a nettó eredményt, a szabálykövetést, a végrehajtási hibát és az adatproblémát. Napi veszteséglimitet tanulási szabályként is használhatsz, például 2R-t, de ez egy választott fegyelmi keret. A stop, a napi limit és egy szolgáltató saját számlaszabálya eltérő fogalmak.

## 13 Gyakorlás visszajátszás és naplózás

### Megfigyelés belépés nélkül

Az első szakaszban ne akarj minden megfigyelést kötésre váltani. Válassz egy sessiont, jelöld a korábbi profil referenciáit, és írd le, hol jár az ár ezekhez képest. Külön figyeld azokat a helyzeteket, ahol nagy agresszió kevés elmozdulást okoz, és ahol kevés volumen mellett is jelentős mozgás történik.

Egy képernyőkép mellé írd le a megfigyelést szakkifejezések nélkül. Például: „A mélypont közelében sok eladás kötött, de a következő alacsonyabb árszintet nem érte el. Ezután az ár visszajött a korábbi tartományba.” Csak ezután add hozzá, hogy ez eladói agresszió lehetséges abszorpciója.

### Visszajátszás jövőbeli adat nélkül

Replayben takard el a későbbi mozgást. A kiválasztott helyzet előtt állj meg, és írd le, melyik forgatókönyv erősödne milyen reakció esetén. Ezután engedd tovább az adatot. Ne csak azokat a helyzeteket vizsgáld, amelyekről már tudod, hogy látványos fordulat következett.

A belépést csak akkor rögzítsd, amikor a saját feltételed teljesül. A fejlődő profilt az adott pillanatig használhatod. A későbbi napicsúcs, végső value area és utólag egyértelmű swing még nem ismert információ.

A sebességet igazítsd a feladathoz. A megértéshez lehet lassítani, a végrehajtás gyakorlásához viszont később szükség lesz közel valós idejű döntésre is. A lassított replayben elért hibátlan felismerés nem ugyanaz a készség, mint időnyomás alatt végrehajtani a szabályt.

### Milyen mintát gyűjts

Indulásként gyűjthetsz 20–30 részletesen magyarázott példát egyetlen jelenségből. Utána 50–100, előre rögzített szabály szerint minősített előfordulás már segíthet felismerni a gyakori hibákat. A mintában legyenek vesztesek, kimaradt jelek és kivárást indokló helyzetek is.

Ezek tanulási mérföldkövek, nem statisztikai nyereségességi bizonyítékok. Az egy napon kialakuló sok hasonló ügylet közös piaci környezetből származik, ezért nem feltétlenül tekinthető sok független megfigyelésnek. Gyűjts különböző napokat és több piaci állapotot.

A modell kialakítása után egy új, korábban nem használt időszakon is ellenőrizd a szabályokat. A forward szimulációban minden jogosult jelnek helye van, a kényelmetleneknek is. Ha csak utólag válogatott képeket nézel, főleg a mintafelismerést gyakorolod, nem a modell valós döntési folyamatát.

### A napló mezői

| Mező | Mit rögzíts |
|---|---|
| Azonosítás | Dátum instrumentum lejárat session időzóna |
| Adat és megjelenítés | Feed kötésbesorolás bar típus ársorméret CVD reset |
| Modellverzió | A használt szabályrendszer azonosítója |
| Környezet | Range trend vagy bizonytalan aukció |
| Helyszín | Előre kijelölt árszint és annak indoka |
| Megfigyelés | Kötések könyv és árreakció tényszerű leírása |
| Hipotézis | Milyen folytatást vizsgáltál |
| Érvénytelenítés | Milyen megfigyelés cáfolta volna a hipotézist |
| Végrehajtás | Tervezett és tényleges belépés stop cél méret |
| Eredmény | Bruttó és nettó eredmény R-ben valamint költség |
| MAE és MFE | Legnagyobb ellened és melletted történő elmozdulás |
| Szabálykövetés | Minden feltétel teljesült-e és hol hibáztál |
| Bizonyíték | Képernyőkép a döntés előtt és utána |

**MAE, Maximum Adverse Excursion:** a pozíció nyitva tartása alatt bekövetkező legnagyobb kedvezőtlen elmozdulás. **MFE, Maximum Favorable Excursion:** ugyanebben az időben a legnagyobb kedvező elmozdulás. Ezek segítenek a belépés és kilépés tanulmányozásában, de nem indokolják a stop vagy cél utólagos, példánkénti átírását.

### Egy hatvanperces tanulási alkalom

Az első 10 percben ismételj át egyetlen fogalmat és jelöld a környezetet. A következő 30 percben nézz vissza vagy figyelj meg egy rövid piaci szakaszt. Ezután 15 percben rögzíts legfeljebb néhány példát, végül 5 percben fogalmazz meg egy konkrét tanulságot és egy még nyitott kérdést.

Ha csak 30 perced van, rövidítsd a megfigyelt szakaszt. A naplózást ne hagyd ki teljesen: a következtetések rögzítése nélkül könnyen ugyanazokat a hibákat ismétled. Iskola és vizsgafelkészülés mellett a rövidebb, rendszeres alkalmak reálisabbak lehetnek, mint egy folyamatos élő piaci megfigyelésre épített napirend.

### Heti értékelés

Hetente nézd meg, melyik fogalmat értelmezted következetesen, melyik helyzetben léptél volna túl korán, és milyen adat maradt bizonytalan. Külön keresd a szabályosan vesztes és a szabálytalanul nyerő példákat. Az első a modell természetes kockázata lehet, a második végrehajtási hiba marad.

Egyszerre legfeljebb egy érdemi szabályváltozást vizsgálj. Írd le, miért változtatsz, milyen új viselkedést vársz, és milyen eredmény alapján fogod a változást értékelni. Az állandó beállításcserét ne számold következetes gyakorlásnak.

## 14 Tanulási sorrend és reális időigény

### Mit jelent az elsajátítás

Három eltérő teljesítményről beszélünk. Az első a fogalmak megértése: meg tudod magyarázni, mi történik. A második a felismerés: friss vagy visszajátszott adatban következetesen azonosítod ugyanazt a helyzetet. A harmadik a végrehajtás: időnyomás alatt is tartod az előre meghatározott folyamatot.

A nyereséges kereskedés ezek mellett megfelelő, költségek utáni előnyt és a piaci változásokhoz alkalmazkodó munkát is igényel. Nincs olyan óraszám, amely önmagában ezt biztosítaná. Lehet alaposan ismerni a fogalmakat úgy is, hogy egy saját modell még nem működik.

### Szintek és összesített óraszámok

A táblázat a kezdettől felhalmozott, figyelmes tanulási és gyakorlási időt mutatja. Az óraszámokat nem kell egymáshoz hozzáadni. A naptári becslések egyenletes terhelést feltételeznek; vizsgaidőszak, kihagyás vagy adatváltás meghosszabbíthatja őket.

| Szint | Fő készség | Összesített idő | Heti 6 órával | Heti 10 órával |
|---|---|---:|---|---|
| 1 | Megbízások bid ask tick kockázat | 15–25 óra | 3–5 hét | 2–3 hét |
| 2 | Aukció profil és piaci környezet | 45–70 óra | 8–12 hét | 5–7 hét |
| 3 | Delta footprint és reakció értelmezése | 90–140 óra | 15–24 hét | 9–14 hét |
| 4 | Következetes felismerés replayben | 150–250 óra | 25–42 hét | 15–25 hét |
| 5 | Saját modell külön ellenőrző mintával | 250–450 óra | 42–75 hét | 25–45 hét |
| 6 | Stabil szimulált végrehajtás több környezetben | 450–800 vagy több óra | 75–134 vagy több hét | 45–80 vagy több hét |

A becslések feltételezik, hogy rendszeresen ugyanazon a piacon és hasonló beállításokkal dolgozol. A hatodik szint sem garantál nyereséges éles kereskedést. Élő pénz nélkül is felépíthető a fogalmi alap, a mintagyűjtemény és egy szimulált döntési folyamat.

### Mikor lépj tovább az egyes szintekről

**Az első szinten** tudj elmagyarázni egy agresszív vételt úgy, hogy a passzív eladót is megnevezed. Számolj tickből pénzkockázatot, és mondd el, miért nem biztos a limit teljesülése. Ha a bid/ask irány még keveredik, a footprint tanulása idő előtt lenne.

**A második szinten** ugyanabból az adatszakaszból azonos módon építs profilt. Tudd elkülöníteni a POC-t, a VWAP-ot, a VAH-t és a VAL-t. Egy sessionről néhány összefüggő mondatban írd le, hol volt kereskedési koncentráció, és hol keresett az ár új területet.

**A harmadik szinten** számolj deltát és átlós arányt önállóan. Ugyanahhoz a pozitív deltához tudj eredményes vételi és sikertelen vételi példát mondani. A kiválasztott adatforrás besorolását is tudd megnevezni.

**A negyedik szinten** friss, későbbi mozgás nélküli replayben is következetesen minősítsd a helyzeteket. A feljegyzésben külön szerepeljen a megfigyelt tény és a hipotézis. Legyenek példáid a kivárásra és a korábban valószínűnek gondolt forgatókönyv elvetésére.

**Az ötödik szinten** egy modellverzió szabályait más is tudja követni. Legyen fejlesztési és külön ellenőrző mintád, reális költséggel és végrehajtással. Ne válts éles kockázatra csak azért, mert letelt egy előre választott hónapszám.

**A hatodik szinten** több egymást követő héten képes legyél a terv szerinti szimulált végrehajtásra akkor is, amikor vesztes sorozat jelentkezik. Egyetlen jó nap helyett a döntési folyamat tartósságát vizsgáld. A gyenge piaci állapotok és a végrehajtási hibák külön kezelése is része ennek a szintnek.

### Egy tizenkét hetes kezdő program

Ez a program heti körülbelül 8–10 órát feltételez. Heti 5–6 órával a tizenkét hét nagyjából 18–24 naptári hétre nyújtható. A program végére a fogalmi alap és a kezdeti replaykészség a cél; nem igazolt kereskedési jövedelem.

| Időszak | Fókusz | Elkészítendő eredmény |
|---|---|---|
| 1–2. hét | Megbízások könyv tick és teljesülés | 10 saját számpélda és az alapfogalmak magyarázata |
| 3–4. hét | Aukció session profile és VWAP | 10 azonos beállítással elemzett session |
| 5–6. hét | Delta CVD footprint | 20 tényszerűen leírt kötési és árreakciós példa |
| 7–8. hét | Abszorpció kifáradás sikertelen kitörés | Sikeres és sikertelen példák összehasonlítása |
| 9–10. hét | Egyetlen modell rögzítése | Írásos szabályok és fejlesztési minták |
| 11–12. hét | Új replayadat és végrehajtási gyakorlat | Ellenőrző napló és a fő hibák listája |

Heti bontásban például két alkalom mehet elméletre, három replayre és egy rövidebb alkalom értékelésre. A hátralévő idő legyen ismétlés vagy pihenő, ne kényszerből végzett újabb piacnézés. Tanulási lemaradást ne próbálj nagyobb kereskedési kockázattal „behozni”.

### Mivel kezdd a következő alkalmat

Először csak a bid, ask, market, limit és passzív/agresszív szerepeket dolgozd fel. Írj három példát arra, hogyan teljesül egy vétel, és egyet arra, hogyan változik a best ask kötés nélkül. Utána egyetlen session profilját elemezd: hol volt a POC és a value area, és hol maradt meg tartósan az ár.

Ha ezt biztonsággal el tudod magyarázni, következzen a delta. A footprintet csak ezután add hozzá. A DOM gyors olvasása, az iceberg-követés és a sokféle indikátor használata későbbi feladat lehet; az alapok gyakorlásának nem feltétele.

## 15 Tipikus félreértések

### Több vevő volt ezért emelkedett

Minden végrehajtott mennyiséghez azonos megvásárolt és eladott mennyiség tartozik. A helyes kérdés az agresszor szerepe, az ellenoldali ajánlatok állapota és a végrehajtás árhatása. A szereplők száma és a kontraktusmennyiség külön fogalom.

### A volumen mindig megelőzi az árat

A kötések és az árak közötti kapcsolat fontos, de nem univerzális időbeli vezető szabály. Az ajánlati ár új megbízástól vagy törléstől is változhat, és kis volumen mellett is lehet jelentős ármozgás. A „volume leads price” mondat így túl általános, ha biztos előrejelzésként használod.

### A pozitív delta vételi jel

A pozitív delta a vételi agresszorhoz sorolt mennyiség fölényét jelzi az adott ablakban. Ha az ár nem tud feljebb jutni, a passzív eladói oldal sikeresen fogadhatja a vételeket. Belépéshez a helyszínt és a reakciót is értelmezni kell.

### A nagy volumen biztos abszorpció

A nagy összvolumen származhat kétirányú kereskedésből vagy sok ismételt árszint-látogatásból. Abszorpciós hipotézishez irányított agressziót és annak korlátozott áreredményét vizsgáld. A későbbi áttörés azt mutathatja, hogy az ellenoldal végül nem tartotta meg a területet.

### A könyvben lévő nagy ajánlat megfogja az árat

A mennyiség eltűnhet, elfogyhat vagy más árszintre kerülhet. A látványos ajánlat lehet sok kisebb megbízás összesítése is. A könyv aktuális állapotát és változását együtt kell követni.

### Az iceberg és minden törlés manipuláció

A részleges mennyiségmegjelenítés és a normális ajánlatmódosítás önmagában nem bizonyít megtévesztést. A spoofing megítélésében a szándék és a viselkedésmintázat lényeges. Ezeket egy pillanatfelvételből nem tudod igazolni.

### A múltbeli volumen manipulálhatatlan igazság

A kötött és a még várakozó mennyiség valóban különbözik. De a történeti összesítés is függ az adat minőségétől, besorolásától, javításaitól és a választott határoktól. Bizonyos piacokon nem valódi gazdasági érdekeltséget tükröző forgalom is előfordulhat. A volumen rögzítése nem garantálja, hogy az értelmezés helyes.

### A HVN azt mutatja hol van most sok likviditás

A HVN múltbeli kötött mennyiséget mutat. A jelenlegi várakozó ajánlatokhoz aktuális könyvadat kell. Egy korábbi kereskedési koncentráció figyelemre méltó helyszín lehet, de nem helyettesíti a jelenlegi aukció megfigyelését.

### A 70 százalékos value area egy szórás

A szokásos value area algoritmus egy célzott volumenhányad alapján választ sorokat. Nem feltétlenül normális az eloszlás, és nem az átlag ± egy szórás képletet követi. A jövőbeli ár ottmaradásának valószínűsége sem olvasható ki belőle közvetlenül.

### A 80 százalékos szabály bizonyított találati arány

A value area területébe való visszatérés utáni áthaladást gyakran „80% rule” néven tanítják. A név vagy egy videós állítás önmagában nem ellenőrzött statisztika. A piacot, sessiont, elfogadás definícióját, célt, időkorlátot, mintát és költséget is meg kell adni ahhoz, hogy a saját környezetedben vizsgálható legyen.

### A 40 százalék és a négyszáz profilsor mindig jobb

A kisebb value area célhányad más területet emel ki, de nem bizonyítja, hogy a szint jobb kereskedési helyszín. A több sor részletesebb megjelenítést adhat, de hiányzó kötési adatot nem állít elő. A felbontásnak illeszkednie kell az adat minőségéhez, a tickhez és a megfigyelés időtávjához.

### A profil alakja megmutatja a következő irányt

A P, b vagy D alak a kiválasztott időszak mennyiségi eloszlását írja le. Ugyanabból az alakból több jövőbeli folyamat indulhat. Egy előre rögzített stratégia alakot is használhat, de a hatását új mintán kell vizsgálni.

### A charton lévő delta mindenhol ugyanaz

A platform ugyanazt a szót használhatja bid/ask kötésbesorolásra vagy ármozgás szerint becsült volumenre. A termék, a kezdőpont és a session is különbözhet. Előbb az adat definícióját tisztázd, utána hasonlíts mintákat.

### Sok indikátor sok független megerősítés

A delta, a CVD és a footprint-imbalance gyakran ugyanazokat a kötésekből származó adatokat mutatja eltérő összesítésben. Több kijelzés nem feltétlenül ad több külön információt. A túl sok feltétel ráadásul könnyen az utólag kiválasztott példákhoz igazodik.

### Néhány jó hét után kész a kereskedési tudás

A jó időszak lehet a piaci állapot, a véletlen és a szabályos munka közös eredménye. Az elsajátítás bizonyítékai között szerepeljenek új adatok, kedvezőtlen környezetek és következetes végrehajtás is. A fogalmi vizsga, a replayeredmény és az éles kereskedési eredmény külön teljesítmény.

## 16 Angol magyar fogalomtár

| Angol kifejezés | Magyar magyarázat |
|---|---|
| Order flow | A megbízások és végrehajtások folyamata |
| Order book | Várakozó vételi és eladási ajánlatok könyve |
| DOM | Depth of Market az ajánlati könyv árszintenkénti kijelzése |
| Bid | Vételi ajánlati ár |
| Ask vagy offer | Eladási ajánlati ár |
| Best bid és best ask | A legjobb aktuális vételi és eladási ajánlat |
| Spread | A legjobb ask és bid különbsége |
| Tick size | Legkisebb megengedett árlépés |
| Tick value | Egy tick pénzbeli értéke adott mennyiségen |
| Point | Az ár jegyzésének egy teljes pontja |
| Tick volume | Árfrissítések vagy adat-események száma a szolgáltatás definíciója szerint |
| Trade volume | Végrehajtott mennyiség például kontraktus vagy részvény |
| Market order | Azonnali végrehajtást kereső megbízás |
| Limit order | Legrosszabb elfogadható árat korlátozó megbízás |
| Marketable limit | Az ellenoldali ajánlatot már elérő limit |
| Stop order | Aktiválási feltételhez kötött megbízás |
| Aggressor vagy taker | Az ellenoldal elérhető árán kezdeményező fél |
| Passive vagy maker | A könyvben várakozó ellenoldali fél |
| Liquidity | Végrehajthatóság korlátozott költséggel és árhatással |
| Resting liquidity | Jelenleg várakozó látható ajánlati mennyiség |
| Hidden liquidity | Teljesen vagy részben nem látható ajánlati mennyiség |
| Iceberg | Csak részben látható mennyiségű megbízás |
| Replenishment | A könyv mennyiségének feltöltődése |
| Queue position | Egy megbízás helye a párosítási sorban |
| Fill és partial fill | Teljesülés illetve részleges teljesülés |
| Slippage | Eltérés a választott referenciaár és a teljesülés között |
| MBP | Market by Price árszintenként összesített ajánlatadat |
| MBO | Market by Order anonim egyedi megbízásadat |
| Tape vagy Time and Sales | A végrehajtott kötések időrendje |
| Speed of tape | A kötések érkezésének üteme |
| Footprint | Egy bar kötéseinek árszintenkénti részletes ábrázolása |
| Bid volume | Bidoldalra sorolt végrehajtott mennyiség |
| Ask volume | Askoldalra sorolt végrehajtott mennyiség |
| Delta | Ask és bid kötött mennyiségének különbsége a választott definícióban |
| Delta percentage | Delta osztva az összvolumennel százalékban |
| CVD | A kezdőpont óta összegzett delta |
| Reset | Egy felhalmozott számítás kezdőpontjának újraindítása |
| Divergence | Két mérés például ár és CVD eltérő viselkedése |
| Diagonal imbalance | Szomszédos ársorok ask és bid mennyiségének aránytalansága |
| Stacked imbalance | Több egymás melletti azonos irányú imbalance |
| Book imbalance | Várakozó ajánlati mennyiségek egyensúlytalansága |
| OFI | Könyveseményekből képzett Order Flow Imbalance |
| Absorption | Jelentős agresszió felvétele korlátozott árhaladással |
| Exhaustion | A folytatást hajtó agresszív aktivitás kifáradása |
| Sweep | Több árszint gyors vizsgálata vagy elfogyasztása |
| Failed breakout | Kitörés utáni visszatérés tartós külső elfogadás nélkül |
| Trapped traders | Sikertelen mozgás folytatására belépők feltételezett beszorulása |
| Short covering | Short pozíció zárása vásárlással |
| Long liquidation | Long pozíció zárása eladással |
| Stacking | Látható ajánlati mennyiség felépülése |
| Pulling | Várakozó ajánlatok visszavonása |
| Spoofing | Megtévesztési célú nem teljesülésre szánt ajánlatadás |
| Volume profile | Kötött mennyiség árszintek szerinti eloszlása |
| POC | A profil legnagyobb volumenű ársora |
| VA | A választott célhányad szerinti value area |
| VAH és VAL | A value area felső és alsó határa |
| HVN és LVN | Nagy illetve kis volumenű kiemelkedés és völgy |
| Developing profile | Az éppen épülő időszak profilja |
| Composite profile | Több időszak összesített profilja |
| VWAP | Volumennel súlyozott átlagár |
| AMT | A piacot folyamatos aukcióként értelmező keret |
| Balance és imbalance | Tartományon belüli kétirányú illetve irányt kereső aukció |
| Acceptance és rejection | Tartósabb kereskedési elfogadás illetve elutasítás |
| Price discovery | Új kereskedési ársáv keresése |
| TPO | Egy árszint jelenléte egy időablakban |
| RTH és ETH | Szabályos fő kereskedési szakasz és kiterjesztett kereskedési idő platformfüggő határokkal |
| Rollover | Átállás a következő futures lejáratra |
| Setup | Előre meghatározott kereskedési helyzet |
| Trigger | A belépést engedélyező konkrét feltétel |
| Invalidation | A hipotézist cáfoló előre meghatározott esemény |
| R | A kezdeti kockázathoz viszonyított eredményegység |
| Expectancy | Az ügylet várható átlagos eredménye |
| Drawdown | Visszaesés egy korábbi eredménycsúcshoz képest |
| MAE és MFE | Legnagyobb kedvezőtlen és kedvező elmozdulás |
| Backtest és replay | Múltbeli szabályvizsgálat és adat-visszajátszás |
| Forward test | Előre rögzített szabályok tesztje újonnan érkező adaton |
| Out of sample | A szabály kialakításához fel nem használt ellenőrző adat |
| Look ahead bias | Döntéskor még nem ismert későbbi adat használata |
| Overfitting | A szabályok túlzott hozzáigazítása a fejlesztési mintához |

## 17 Gyakorlófeladatok

### Tíz választós kérdés

Minden kérdésnél egy válasz a legjobb. A válaszokat először a megoldás nélkül írd le, például 1B 2A formában.

**1. Mit jelent a +300-as delta valódi bid/ask besorolásnál?**

A. Háromszázzal több kontraktust vásároltak meg, mint amennyit eladtak.

B. Az askhoz sorolt végrehajtott mennyiség háromszázzal nagyobb a bidhez soroltnál.

C. A következő gyertya biztosan emelkedik.

**2. Nagy negatív delta mellett az ár a mélyponton megáll. Mi a következő értelmes lépés?**

A. Azonnal vásárolni, mert a forduló már bizonyított.

B. Megvizsgálni a helyszínt, a következő árreakciót és azt, hogy tartósan megállt-e az eladás árhatása.

C. A deltát figyelmen kívül hagyni, mert hibásnak kell lennie.

**3. Mit mutat a HVN?**

A. Az adott profilban nagyobb múltbeli kötött mennyiségű területet.

B. Az összes résztvevő még nyitott pozícióját.

C. Egy biztosan megmaradó aktuális limitfalat.

**4. Mire utal a 70%-os value area?**

A. Az ár következő napi ottmaradásának igazolt valószínűségére.

B. A normális eloszlás kötelező egy szórására.

C. A választott profil volumenének célhányada alapján képzett ársávra.

**5. Lehet-e limitmegbízás agresszív?**

A. Igen, ha az ellenoldali elérhető ajánlatot eléri.

B. Nem, minden limit szükségszerűen várakozik.

C. Csak akkor, ha előbb stop megbízássá alakul.

**6. Mitől nő a CVD?**

A. Attól, hogy minden áremelkedő gyertya után hozzáadunk egy pontot.

B. Attól, hogy a következő megfigyelt szakasz deltája pozitív.

C. Attól, hogy nő a könyvben a teljes látható vételi mennyiség.

**7. Mire használható a footprint egy teljes gyertyájának táblázata?**

A. A kötések pontos időrendjének biztos rekonstruálására.

B. A résztvevők neveinek azonosítására.

C. Az árszintenként összesített kötési aktivitás megvizsgálására.

**8. Mit bizonyít egy nagy ajánlat gyors törlése?**

A. Azt, hogy az ajánlat megváltozott vagy eltűnt; a megtévesztési szándék önmagában nem bizonyított.

B. Azt, hogy spoofing történt.

C. Azt, hogy a piac az ellenkező irányba fog menni.

**9. Melyik módszer von be jövőbeli adatot?**

A. A tegnap befejezett session POC-jának használata.

B. A mai session végső POC-jának használata egy mai délelőtti replaybelépéshez.

C. Az adott pillanatig épülő mai profil használata.

**10. Mit jelent száz pozitív eredményű, utólag kiválasztott screenshot?**

A. Megbízható bizonyítékot egy nyereséges modellre.

B. Automatikusan száz független statisztikai megfigyelést.

C. Példagyűjteményt, amelyből a kihagyott és vesztes helyzetek nélkül nem ítélhető meg a modell.

### Számolási feladatok

**11. Delta.** Egy gyertyában 840 ask és 560 bid kontraktus kötött. Számold ki az összvolument, a deltát és a deltarányt. Magyarázd el egy mondatban, miért nem jelent a delta ugyanennyi „plusz vevőt”.

**12. Átlós arány.** 100,50-en az ask volumen 180. Az eggyel alacsonyabb, 100,25-ös sor bid volumene 45. Mekkora a vételi átlós arány? Teljesíti-e a 3:1 feltételt? Mit kell még ellenőrizni a jelentőségéhez?

**13. CVD.** Nulláról indulva a négy következő bar deltája +150, −90, −200 és +80. Mennyi a végső CVD? Nő vagy csökken az utolsó bar alatt? Miért különbözik a két válasz jelentése?

**14. Pozícióméret.** Egy kitalált instrumentum tickértéke 2 pénzegység. A stop 7 tick, a feltételezett oda-vissza jutalék 3 pénzegység, a további kedvezőtlen végrehajtásra szánt tartalék 1 tick. A kockázatkeret 50 pénzegység. Legfeljebb hány egység fér bele a becsült keretbe?

**15. Várható érték.** A modell 45%-ban nyer, bruttó átlagnyerője 1,6R, bruttó átlagvesztese 1R, átlagköltsége 0,10R ügyletenként. Mennyi a nettó várható érték a megadott átlagok alapján?

### Önálló elemzési feladat

Válassz egy ismeretlen kimenetelű replayhelyzetet egy korábbi value area szélén. Írd le a helyszínt, a megfigyelhető kötési aktivitást és két lehetséges folytatást. Mindkettőhöz adj olyan árreakciót, amely erősítené vagy gyengítené az elképzelést.

Ha a feltételeid később belépést engednek, rögzítsd a ténylegesen akkor elérhető árat és az érvénytelenítési pontot. Ha egyik forgatókönyv sem válik elég egyértelművé, a megoldásod kivárás is lehet. Az értékelés a gondolatmenet következetességére és az akkor ismert adatok használatára épüljön.

## 18 Megoldások és magyarázatok

### A választós kérdések

| Kérdés | Válasz | Indok |
|---|---|---|
| 1 | B | A delta az agresszoroldali besorolások mennyiségi különbsége |
| 2 | B | A lehetséges abszorpció további árreakciót igényel |
| 3 | A | A HVN a kiválasztott profil múltbeli eloszlásának jellemzője |
| 4 | C | A value area célzott volumenhányadhoz kapcsolódik |
| 5 | A | A marketable limit az ellenoldal elérhető árával találkozhat |
| 6 | B | A CVD a deltákat összegzi |
| 7 | C | A footprint összesítést mutat és nem feltétlenül teljes sorrendet |
| 8 | A | A törlés ténye megfigyelhető a megtévesztési szándék önmagában nem bizonyított |
| 9 | B | A session végső profilja délelőtt még nem ismert |
| 10 | C | Az utólagos válogatás nem ad teljes előfordulási mintát |

### A számolások

**11.** Összvolumen = 840 + 560 = 1400. Delta = 840 − 560 = +280. Deltarány = 280 / 1400 × 100 = +20%. Minden kötött kontraktushoz vevő és eladó is tartozik; a +280 a kezdeményező oldalhoz sorolt mennyiségek különbsége.

**12.** 180 / 45 = 4, tehát 4:1, ami teljesíti a 3:1 küszöböt. Ettől még ellenőrizni kell a minimum mennyiséget, az adat besorolását, a helyszínt és az ár reakcióját. A szám önmagában nem belépési jel.

**13.** A végső CVD 150 − 90 − 200 + 80 = −60. Az utolsó bar alatt mégis nő, mert annak deltája +80. A −60 a kezdőpont óta felhalmozott különbség, a +80 az utolsó szakasz változása.

**14.** Egy egység árkockázata 7 × 2 = 14. A becsült teljes keret 14 + 3 + 2 = 19 pénzegység. Az 50 / 19 hányados lefelé kerekítve 2. Két egység 38-at, három 57-et igényelne. A tartalék a számítás feltételezése, nem bizonyított maximális slippage.

**15.** 0,45 × 1,6 − 0,55 × 1 − 0,10 = 0,72 − 0,55 − 0,10 = +0,07R. Ez a megadott átlagokból számolt pozitív várható érték. A jövőbeli minta ettől eltérhet, és a becslés megbízhatóságához a minta mérete és összetétele is szükséges.

### Az önálló elemzés értékelése

Adj magadnak egy-egy pontot, ha egyértelműen megnevezted a helyszínt, tényszerűen leírtad a megfigyelést, különválasztottad a hipotézist, megadtad a cáfoló reakciót, és nem használtál későbbi adatot. További egy pont jár, ha a kivárást is elfogadható kimenetként kezelted.

A számpéldák helyes megoldása és a hatpontos elemzési gyakorlat az anyag megértését ellenőrzi. A felismert minta nyereségességének vizsgálata külön, nagyobb feladat. Ha a megfigyelés és a hipotézis még összekeveredik, térj vissza a 8–10. fejezethez, és írj új, egyszerű mondatokat a folyamatokról.

## 19 Források és további olvasás

A technikai források a fogalmak és számítások ellenőrzésére szolgálnak. A szoftverdokumentáció leírhat használati példákat is, de ezek nem helyettesítik a saját stratégia ellenőrzését. A jegyzet számpéldái, gyakorlási modellje és időbecslései önálló oktatási kidolgozások.

[1] CME Group — Futures Order Types. Megbízástípusok, marketable limit és a CME stopváltozatai. https://www.cmegroup.com/education/courses/futures-trading-mechanics-and-regulation/futures-order-types

[2] Rama Cont, Arseniy Kukanov és Sasha Stoikov — The Price Impact of Order Book Events. Kötések, ajánlatok és törlések szerepe, valamint OFI. A megállapítások a vizsgálat piacaira és módszerére vonatkoznak. https://arxiv.org/abs/1011.6402

[3] CME Group — Market by Order. MBP, MBO, anonimitás és iceberg-megbízások részletei. https://www.cmegroup.com/articles/faqs/market-by-order-mbo.html

[4] Sierra Chart — Numbers Bars. Bid/ask volumen, árszintenkénti megjelenítés, átlós összehasonlítás és adatfeltételek. https://www.sierrachart.com/index.php?l=doc/NumbersBars.php

[5] Sierra Chart — Cumulative Delta Bars Volume. Deltaösszegzés, reset és történeti adatigény. https://www.sierrachart.com/index.php?ID=292&page=doc/StudiesReference.php

[6] TradingView — Volume profile indicators basic concepts. Profilfogalmak, számítási módszer, adatfajták és value area. https://www.tradingview.com/support/solutions/43000502040-volume-profile-indicators-basic-concepts/

[7] TradingView — Volume footprint charts a complete guide. Intrabar adatok, volumenbesorolás és a történeti felbontás változása. https://www.tradingview.com/support/solutions/43000726164-volume-footprint-charts-a-complete-guide/

[8] Sierra Chart — Volume Weighted Average Price with Standard Deviation Lines. VWAP-képlet és az adatfelbontás szerepe. https://www.sierrachart.com/index.php?ID=108&page=doc/StudiesReference.php

[9] Bookmap — Main Chart. A heatmap könyvadatainak és kötésmegjelenítésének értelmezése. https://bookmap.com/knowledgebase/docs/KB-SettingUpAndOperating-HeatmapMainChart

[10] Bookmap — How to Spot Absorption and Exhaustion in Order Flow. A passzív felvétel és az agresszió kifáradásának elkülönítése. https://bookmap.com/en/learning-center/supply-demand-setups/supply-demand-setups/absorption-exhaustion

[11] Exocharts Help — TPO and Market Profile. Időablakok szerinti árszintjelenlét és a volumenprofil különbsége. https://help.exocharts.com/hc/en-us/articles/50662247965969-TPO-and-Market-Profile

[12] Bank for International Settlements — The foreign exchange market, Working Paper 1094. A spot devizapiac OTC jellege és töredezett szerkezete. https://www.bis.org/publications/working-paper-1094-foreign-exchange-market

[13] CME Group — Micro E-mini Equity Index futures products overview. MES tickméret és tickérték. https://www.cmegroup.com/education/courses/micro-e-mini-futures/micro-e-mini-futures-products-overview

[14] CFTC — CFTC Charges Trader with Spoofing in Financial Futures Markets, 2019. A végrehajtás előtti törlési szándék és megtévesztő magatartás példája. https://www.cftc.gov/PressRoom/PressReleases/7988-19

A tanulási háttérként megadott volume profile videó leirata több témát felvetett, köztük az erőfeszítés–eredmény kapcsolatot, a profilalakokat és a value area használatát. Az általános érvényűnek hangzó állításokat, például a fix találati arányt vagy a value area szórással való azonosítását, ebben a jegyzetben külön kellően óvatosan értelmezzük.
