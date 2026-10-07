window.TRADECRAFT_DATA = {
  modules: [
    {
      id: "alapmechanika",
      number: "01",
      title: "Piaci alapmechanika",
      shortTitle: "Alapmechanika",
      weeks: "1–4. hét",
      duration: "1. hónap",
      description: "Megbízások, likviditás, tőkeáttétel és tudatos piacválasztás.",
      milestone: "Saját szavaiddal el tudod magyarázni, hogyan jön létre egy kötés és mitől mozdul az ár.",
      lessons: [
        {
          id: "kotes-letrejotte",
          week: 1,
          title: "Hogyan jön létre egy kötés?",
          duration: 14,
          summary: "Minden végrehajtott kötésnek van vevője és eladója; az agresszoroldal dönti el, melyik jegyzett áron történik a kötés.",
          keyPoints: [
            "A best bid a legjobb elérhető vételi, a best ask a legjobb eladási ajánlat.",
            "Az ár akkor lép tovább, amikor az aktuális árszinten elérhető likviditás elfogy vagy visszavonják.",
            "A »több vevő volt« megfogalmazás pontatlan: minden kötésben ugyanannyi vett és eladott mennyiség van."
          ],
          exercise: "Rajzolj két árszintes ajánlati könyvet. Jelöld, hogyan fogyaszt el egy 12 kontraktusos market buy 7-et a best askon, majd 5-öt a következő árszinten.",
          sourceTag: "Orderflow tanulási jegyzet · 1–2. fejezet"
        },
        {
          id: "order-tipusok",
          week: 2,
          title: "Market, limit és stop",
          duration: 16,
          summary: "A megbízástípus a végrehajtás, az árkontroll és az aktiválás közötti kompromisszum.",
          keyPoints: [
            "A market order végrehajtást keres, de nem garantál konkrét árat.",
            "A limit order árkorlátot ad, de lehet, hogy egyáltalán nem teljesül.",
            "A stop aktiváló feltétel; trigger után az order típusa szerint teljesülhet és csúszhat."
          ],
          exercise: "Írj egy példát, amikor a nem teljesülés nagyobb probléma, mint a slippage, és egyet, amikor épp fordítva.",
          sourceTag: "Roadmap + Investor.gov megbízástípusok"
        },
        {
          id: "agressziv-passziv",
          week: 2,
          title: "Agresszív és passzív oldal, likviditás",
          duration: 18,
          summary: "Az agresszív fél elfogadja az ellenoldal árát a gyors végrehajtásért, a passzív fél a könyvben várakozik; a likviditás azt mutatja, mennyi fér el kis árhatással.",
          keyPoints: [
            "Az agresszív és a passzív szerep egy adott végrehajtásra vonatkozik, nem a kereskedő személyére.",
            "A várakozó ajánlat (resting liquidity) módosítható és törölhető, a kötött volumen már megtörtént.",
            "Attól, hogy az ár eléri a limitedet, még nem biztos a teljesülés: a sorban előtted állók is számítanak."
          ],
          exercise: "Írj három példát arra, hogyan teljesül egy vétel, és egyet arra, hogyan változik a best ask úgy, hogy közben nem történik kötés.",
          sourceTag: "Orderflow tanulási jegyzet · 2. fejezet"
        },
        {
          id: "spread-slippage",
          week: 3,
          title: "Bid, ask, spread és slippage",
          duration: 18,
          summary: "A látható spread és a tényleges végrehajtás költsége külön fogalom; a mélység és a volatilitás is számít.",
          keyPoints: [
            "Spread = best ask − best bid.",
            "Slippage akkor keletkezik, ha a tényleges átlagár eltér a várt végrehajtási ártól.",
            "A kötés költsége: jutalék + díjak + spreadhatás + slippage."
          ],
          exercise: "Számold ki egy 4 egységes market buy átlagárát, ha 2 egység 100,25-ön és 2 egység 100,50-en teljesül.",
          sourceTag: "Orderflow tanulási jegyzet · 2. fejezet"
        },
        {
          id: "tokeattetel-margin",
          week: 3,
          title: "Tőkeáttétel, margin és a termék mögötti partner",
          duration: 18,
          summary: "A spot, a CFD és a futures más-más partnert és szabályrendszert jelent; a tőkeáttétel nem szabad pénz, hanem a kockázat szorzója.",
          keyPoints: [
            "Mindig tudd, ki a partnered az ügyletben: tőzsdei könyv, bróker vagy szimulált környezet.",
            "A tőkeáttétel a nyereséget és a veszteséget ugyanúgy felnagyítja.",
            "A margin letét, nem a maximális veszteség felső határa."
          ],
          exercise: "Nyiss meg öt különböző instrumentumot (devizapár, index future, kripto, részvény, árupiac), és írd le egy mondatban, mi mozgatja mindegyiket.",
          sourceTag: "6 hónapos Day Trading Roadmap · 1. hónap"
        },
        {
          id: "piacvalasztas",
          week: 4,
          title: "Forex vagy futures?",
          duration: 20,
          summary: "A piacot az adatminőség, a kereskedési idő, a költségek és a tanulási cél alapján válaszd, ne marketingígéretből.",
          keyPoints: [
            "Futuresnél központosított tőzsdei volumen és kontraktusspecifikáció áll rendelkezésre.",
            "Spot forexnél a látható volumen és könyv a szolgáltató adatforrásától függ.",
            "A tőkeáttétel mindkét esetben felnagyítja a veszteséget is."
          ],
          exercise: "Készíts döntési táblát: rendelkezésre álló idő, kezdőtőke, adatigény, költség, szabályozás, platform.",
          sourceTag: "6 hónapos Day Trading Roadmap · 1. hónap"
        }
      ]
    },
    {
      id: "kontextus",
      number: "02",
      title: "Chart-kontextus és aukció",
      shortTitle: "Chart-kontextus",
      weeks: "5–8. hét",
      duration: "2. hónap",
      description: "Árstruktúra, aukciós logika, volume profile és adatminőség.",
      milestone: "20 charthelyzetet előre, jövőbeli adat nélkül elemzel, és különválasztod a tényt a hipotézistől.",
      lessons: [
        {
          id: "arstruktura",
          week: 5,
          title: "Árstruktúra és idősík",
          duration: 18,
          summary: "A trend, a tartomány és a kulcsszintek kontextust adnak, nem automatikus belépőt.",
          keyPoints: ["HH/HL vagy LH/LL csak a választott idősíkhoz képest értelmezhető.", "A magasabb idősík környezetet, az alacsonyabb a végrehajtást segítheti.", "A support/resistance zóna, nem matematikailag pontos vonal."],
          exercise: "Jelölj három idősíkon struktúrát ugyanazon a charton, majd írd le, hol mondanak ellent egymásnak.",
          sourceTag: "6 hónapos Day Trading Roadmap · 2. hónap"
        },
        {
          id: "gyertyak-indikatorok",
          week: 5,
          title: "Gyertyák és indikátorok kritikus szemmel",
          duration: 20,
          summary: "Öt-hat megbízható alakzat és két-három megértett indikátor többet ér, mint ötven memorizált minta és egy telezsúfolt chart.",
          keyPoints: [
            "Az alakzat a helyszíntől kap jelentést: ugyanaz a pin bar a tartomány közepén és a szélén mást ér.",
            "Az indikátor az ár és a volumen átszámítása, nem új információ.",
            "Az előzetes leírás véd a visszamenőleges belelátás ellen."
          ],
          exercise: "Válassz 20 múltbeli charthelyzetet replayben. Mindegyiknél előre írd le, mit látsz és mit vársz, és csak utána görgess tovább.",
          sourceTag: "6 hónapos Day Trading Roadmap · 2. hónap"
        },
        {
          id: "aukcio",
          week: 6,
          title: "A piac mint folyamatos aukció",
          duration: 17,
          summary: "Az ár új szinteket tesztel; a piac ott időzik, ahol elfogadás alakul ki, és gyorsan távozhat az elutasított zónákból.",
          keyPoints: ["Balance: kétoldalú kereskedés és relatív elfogadás.", "Imbalance: az aukció új egyensúlyt keres.", "Az effort–result kérdés: mekkora aktivitás mekkora árreakciót váltott ki?"],
          exercise: "Keress egy elfogadott és egy gyorsan elutasított ársávot. Csak megfigyelést írj, jóslatot ne.",
          sourceTag: "Orderflow tanulási jegyzet · 3. fejezet"
        },
        {
          id: "volume-profile",
          week: 7,
          title: "Volume profile: POC, VAH, VAL",
          duration: 24,
          summary: "A profil megmutatja, mely árszinteken mennyi végrehajtott volumen történt a kiválasztott időszakban.",
          keyPoints: ["POC: a profil legnagyobb volumenű ársora.", "VAH/VAL: a választott value area felső és alsó határa.", "HVN/LVN múltbeli forgalmi szerkezet, nem pillanatnyi könyvlikviditás."],
          exercise: "Öt ársor volume adataiból keresd meg a POC-ot, majd építs kb. 70%-os value area-t a platformod algoritmusa szerint.",
          sourceTag: "Orderflow tanulási jegyzet · 5. fejezet"
        },
        {
          id: "vwap-tpo",
          week: 7,
          title: "Profiltípusok, VWAP és TPO",
          duration: 22,
          summary: "A profil időszaka, a volumennel súlyozott átlagár és az időalapú TPO ugyanarra a piacra három különböző kérdést tesz fel.",
          keyPoints: [
            "A session, a fixed range, a visible range és a composite profil más-más időszakot összesít.",
            "A VWAP átlag, a POC a legnagyobb csúcs: a kettő eltérhet.",
            "A TPO időbeli jelenlétet mér, a volume profile kötött mennyiséget."
          ],
          exercise: "Ugyanarra a sessionre számolj VWAP-ot és keresd meg a POC-ot. Írd le, miért nem esik egybe a kettő.",
          sourceTag: "Orderflow tanulási jegyzet · 5. fejezet"
        },
        {
          id: "adatminoseg",
          week: 8,
          title: "Adatminőség és session-beállítás",
          duration: 19,
          summary: "Két platform eltérő deltát vagy profilt mutathat a feed, a session, az aggregáció és a besorolás miatt.",
          keyPoints: ["L1, L2, market-by-price és market-by-order eltérő részletességet ad.", "A session kezdete megváltoztatja a CVD-t és a profilt.", "Mielőtt következtetsz, dokumentáld a feedet, időzónát és gyertyaképzést."],
          exercise: "Írd le a saját platformod adatforrását, session-időzónáját, volume típusát és delta-besorolását.",
          sourceTag: "Orderflow tanulási jegyzet · 4. fejezet"
        },
        {
          id: "kontraktus-session",
          week: 8,
          title: "Kontraktus- és session-puska",
          duration: 20,
          summary: "A tick, a pont és a pénzérték három külön mértékegység; a fő kereskedési sávot a piac saját időzónájában kell rögzíteni.",
          keyPoints: [
            "MES: 0,25 pontos tick = 1,25 USD, egy pont = 5 USD. Az ES ennek a tízszerese.",
            "A legtöbb likviditás a fő kereskedési sávban (RTH, illetve London/New York átfedés) koncentrálódik.",
            "Az EU és az USA eltérő óraátállítása évente kétszer 1–2 hétre elcsúsztatja az időpontokat."
          ],
          exercise: "Készíts egyoldalas puskát a választott piacod 3–5 instrumentumáról: tickméret, tickérték, pontérték és a fő sáv magyar idő szerint.",
          sourceTag: "6 hónapos Day Trading Roadmap · 2. hónap"
        }
      ]
    },
    {
      id: "kockazat",
      number: "03",
      title: "Kockázat és prop szabályok",
      shortTitle: "Kockázat",
      weeks: "9–12. hét",
      duration: "3. hónap",
      description: "R, pozícióméret, expectancy, drawdown és napi veszteséglimit.",
      milestone: "Minden trade előtt kiszámolod a kockázatot, és van írásos napi/ heti stopod.",
      lessons: [
        {
          id: "r-nyelve",
          week: 9,
          title: "Az R nyelve",
          duration: 14,
          summary: "Az 1R az előre vállalt kockázat; így különböző piacok és pozícióméretek összehasonlíthatók.",
          keyPoints: ["+2R kétszeres nyereség az előzetes kockázathoz képest.", "−1R csak akkor marad −1R, ha a végrehajtás és a fegyelem nem rontja.", "A nettó R-ből vond le a költségeket is."],
          exercise: "Alakíts át tíz korábbi szimulált eredményt R-be, majd számolj átlagot és szóródást.",
          sourceTag: "Orderflow tanulási jegyzet · 12. fejezet"
        },
        {
          id: "poziciomeretezes",
          week: 10,
          title: "Pozícióméretezés matematikája",
          duration: 22,
          summary: "A pozícióméretet a vállalható pénzkockázat, a stop távolsága és az egységérték együtt határozza meg.",
          keyPoints: ["Kockázati keret = számlaérték × kockázati százalék.", "Egységkockázat = stop távolság × pont/tick érték + becsült költség.", "Méret = lefelé kerekített kockázati keret / egységkockázat."],
          exercise: "Használd a Kockázati labort három különböző stop-távolsággal. Figyeld meg, hogyan változik a méret.",
          sourceTag: "Roadmap + Orderflow tanulási jegyzet"
        },
        {
          id: "expectancy",
          week: 11,
          title: "Várható érték és költségek",
          duration: 20,
          summary: "Egy stratégia a találati arány, az átlagos nyerő/vesztő és minden valós költség együttese.",
          keyPoints: ["Expectancy = P(nyerő) × átlag nyerő − P(vesztő) × átlag veszteség.", "A magas találati arány is lehet negatív, ha a veszteségek aránytalanul nagyok.", "A kis elméleti előnyt a jutalék és slippage eltüntetheti."],
          exercise: "Számold ki 42% találati arány, +2,1R átlagos nyerő és −1R átlagos veszteség várható értékét.",
          sourceTag: "Orderflow tanulási jegyzet · 12. fejezet"
        },
        {
          id: "drawdown",
          week: 12,
          title: "Drawdown és napi stop",
          duration: 25,
          summary: "A static, EOD és intraday trailing drawdown eltérően mozog; a konkrét prop szabályt szó szerint kell modellezni.",
          keyPoints: ["Ne feltételezd, hogy két cég azonos nevű szabálya azonos számítást jelent.", "Az intraday trailing a nem realizált csúcsot is követheti.", "A saját napi stop legyen szigorúbb, mint a külső bukási határ."],
          exercise: "Készíts egyoldalas szabálykártyát: max trade-kockázat, napi stop, heti stop, max tradeszám, kötelező szünet.",
          sourceTag: "6 hónapos Day Trading Roadmap · 3. hónap"
        },
        {
          id: "consistency-szabalykonyv",
          week: 12,
          title: "Consistency rule és az egyoldalas szabálykönyv",
          duration: 20,
          summary: "A konzisztencia-szabály azt korlátozza, mekkora részt tehet ki egyetlen nap a profitból; a saját szabálykönyved pedig azt, mit teszel, amikor elérsz egy limitet.",
          keyPoints: [
            "A küszöb cégenként és időben is változik, a jegyzeted 30 és 50% közötti példákat említ.",
            "Van, ahol a megszegése bukás, máshol csak megnöveli a szükséges profitot.",
            "A napi limit ismerete kevés: előre le kell írni, mi történik, amikor eléred."
          ],
          exercise: "Írj féloldalas szabálykönyvet a saját szavaiddal: kockázat kötésenként, napi maximum és a teendő, heti stop, a választott cégtípus consistency tartománya.",
          sourceTag: "6 hónapos Day Trading Roadmap · 3. hónap"
        }
      ]
    },
    {
      id: "strategia",
      number: "04",
      title: "Stratégia és orderflow",
      shortTitle: "Stratégia",
      weeks: "13–16. hét",
      duration: "4. hónap",
      description: "Tesztelhető setup, tiszta backtest, delta, footprint és naplózás.",
      milestone: "Van egy változatkezelt szabályrendszered és legalább 100 dokumentált teszteseted.",
      lessons: [
        {
          id: "setup-trigger",
          week: 13,
          title: "Setup, trigger és invalidation",
          duration: 20,
          summary: "A jó megfigyelésből csak akkor lesz tesztelhető modell, ha minden döntési pont objektív.",
          keyPoints: ["Setup = környezet; trigger = belépési esemény; invalidation = az ötlet cáfolata.", "A no-trade feltétel ugyanolyan fontos, mint a belépő.", "Egyszerre egy szabályt változtass, különben nem tudod, mi okozta az eltérést."],
          exercise: "Írd át a kedvenc setupodat öt igen/nem feltételre és egy egyértelmű cáfoló feltételre.",
          sourceTag: "Roadmap + Orderflow tanulási jegyzet · 11. fejezet"
        },
        {
          id: "backtest",
          week: 14,
          title: "Backteszt jövőbelátás nélkül",
          duration: 24,
          summary: "A szabályokat előre rögzítsd, a chart jobb oldalát rejtsd el, és különítsd el a fejlesztési és ellenőrző mintát.",
          keyPoints: ["Look-ahead bias: olyan információ használata, amely a döntés pillanatában még nem létezett.", "Overfitting: a szabály túl jól illeszkedik a múlthoz, de nem általánosít.", "A vesztes és kimaradt példák ugyanolyan fontosak, mint a szépek."],
          exercise: "Gyűjts 20 egymást követő, nem válogatott példát. Ne módosíts szabályt a sorozat közben.",
          sourceTag: "6 hónapos Day Trading Roadmap · 4. hónap"
        },
        {
          id: "naplo-rendszer",
          week: 14,
          title: "Kereskedési napló, MAE és MFE",
          duration: 18,
          summary: "A napló a tervet veti össze a valósággal; minden kötés belekerül, a köztes és a kimaradt helyzetek is.",
          keyPoints: [
            "Külön mezőbe kerül a megfigyelt tény, a hipotézis és az érvénytelenítés.",
            "A MAE a legnagyobb ellened, az MFE a legnagyobb melletted történő elmozdulás.",
            "A heti első kérdés: hány kötésnél tértél el a szabálytól, akkor is, ha nyert."
          ],
          exercise: "Vegyél fel három szimulált vagy replay bejegyzést a Napló nézetben, mindegyiknél külön mondatban a tényt, a hipotézist és a cáfoló feltételt.",
          sourceTag: "Roadmap 4. hónap + Orderflow tanulási jegyzet · 13. fejezet"
        },
        {
          id: "delta-cvd",
          week: 15,
          title: "Delta és kumulatív delta",
          duration: 26,
          summary: "A delta az askhoz és bidhez sorolt végrehajtott volumen különbsége; az előjele nem önálló vételi vagy eladási jel.",
          keyPoints: ["Delta = ask volume − bid volume.", "A CVD a választott kezdőponttól halmozott delta, ezért sessionfüggő.", "Pozitív delta + nem emelkedő ár passzív eladói abszorpció lehet, de csak helyszínnel és reakcióval együtt."],
          exercise: "Számold ki a CVD-t +150, −90, −200, +80 bar-deltából, majd írd le, mit nem tudsz még ebből.",
          sourceTag: "Orderflow tanulási jegyzet · 6. fejezet"
        },
        {
          id: "footprint",
          week: 16,
          title: "Footprint, abszorpció és kifáradás",
          duration: 28,
          summary: "A footprint az árszintenkénti végrehajtást bontja fel; az imbalance, abszorpció és kifáradás csak kontextusban értelmezhető.",
          keyPoints: ["A diagonális imbalance a szemközti árszintek agresszív volumenét hasonlíthatja össze.", "Nagy volumen + kis árhaladás abszorpcióra utalhat, de nem bizonyítja önmagában.", "A kifáradás kevés folytató aktivitás; ne keverd az aktív ellenerővel."],
          exercise: "Ugyanahhoz a jelhez gyűjts öt sikeres és öt sikertelen példát. Írd le a különbséget helyszínben és utóreakcióban.",
          sourceTag: "Orderflow tanulási jegyzet · 7–10. fejezet"
        },
        {
          id: "csapdak",
          week: 16,
          title: "Sikertelen kitörés, sweep és könyvjelenségek",
          duration: 22,
          summary: "A kitörés, a stopok kisöprése és a könyv változása megfigyelhető folyamat; a szándék és a szereplők kiléte nem az.",
          keyPoints: [
            "Sikertelen kitörés: az ár új területre jut, de nem alakul ki ott tartós kereskedés, és visszatér.",
            "Egy csúcs átlépése önmagában nem mondja meg, elfogadás vagy elutasítás következik.",
            "Egy nagy ajánlat törlése megfigyelhető tény, a megtévesztési szándék ebből nem bizonyítható."
          ],
          exercise: "Keress egy kitörést, amely megmaradt, és egyet, amely visszaesett. Írd le, mi különbözött a kitörés utáni első visszatesztben.",
          sourceTag: "Orderflow tanulási jegyzet · 8. fejezet"
        },
        {
          id: "osszekapcsolas",
          week: 16,
          title: "Az adatok összekapcsolása: négy végigvezetett helyzet",
          duration: 28,
          summary: "Környezet, helyszín, friss esemény, árreakció: ebben a sorrendben áll össze egy helyzet értelmezése, és a kivárás is érvényes kimenet.",
          keyPoints: [
            "Ugyanaz a delta a tartomány közepén és egy korábbi mélypont alatt más helyzet.",
            "A delta, a CVD és a footprint-imbalance gyakran ugyanazt az adatot mutatja, nem három független megerősítés.",
            "A „nem kereskedtem, mert a feltételek nem teljesültek” értékelhető döntés."
          ],
          exercise: "Válassz egy ismeretlen kimenetelű replayhelyzetet egy korábbi value area szélén. Írj két lehetséges folytatást, mindkettőhöz erősítő és gyengítő árreakcióval.",
          sourceTag: "Orderflow tanulási jegyzet · 9–10. fejezet"
        }
      ]
    },
    {
      id: "pszichologia",
      number: "05",
      title: "Pszichológia és szimuláció",
      shortTitle: "Pszichológia",
      weeks: "17–20. hét",
      duration: "5. hónap",
      description: "Evaluation-nyomás, végrehajtási rutin, replay és heti review.",
      milestone: "Két egymást követő szabálykövető időszak, napi limitátlépés nélkül.",
      lessons: [
        {
          id: "evaluation-nyomas",
          week: 17,
          title: "Evaluation-nyomás felismerése",
          duration: 16,
          summary: "A profitcél, időnyomás és drawdown-közelség könnyen a folyamat feladásához vezet.",
          keyPoints: ["A célközelség nem változtatja meg a setup statisztikai minőségét.", "A revenge trade célja gyakran az érzelmi állapot javítása, nem egy előny végrehajtása.", "A no-trade nap lehet tökéletesen végrehajtott nap."],
          exercise: "Írj három olyan belső mondatot, amely nálad kapkodást jelez, és melléjük egy megszakító rutint.",
          sourceTag: "6 hónapos Day Trading Roadmap · 5. hónap"
        },
        {
          id: "if-then",
          week: 18,
          title: "Ha–akkor végrehajtási terv",
          duration: 15,
          summary: "A döntést nyugodt állapotban készítsd elő: a triggerhelyzetben csak végrehajtani kelljen.",
          keyPoints: ["Ha két vesztes trade jön, akkor kötelező szünet.", "Ha a napi stop elér, akkor a platform bezár és nincs kivétel.", "Ha a setup nem teljes, akkor screenshot készül, trade nem."],
          exercise: "Készíts öt személyes ha–akkor szabályt a leggyakoribb hibáidra.",
          sourceTag: "6 hónapos Day Trading Roadmap · pszichológia"
        },
        {
          id: "replay-demo",
          week: 19,
          title: "Replay és demo protokoll",
          duration: 22,
          summary: "A replay a döntési folyamatot gyakorolja; a paper trading nem bizonyít live teljesítményt.",
          keyPoints: ["Rejtsd el a jövőbeli adatot és előre mondd ki a feltételeket.", "Modellezd a költséget, spreadet és reális slippage-et.", "A szimulált eredményt mindig egyértelműen címkézd."],
          exercise: "Futtass egy 60 perces blokkot: 10 perc terv, 35 perc replay, 15 perc napló és review.",
          sourceTag: "Orderflow tanulási jegyzet · 13–14. fejezet"
        },
        {
          id: "heti-review",
          week: 20,
          title: "Heti review: folyamatpontszám",
          duration: 18,
          summary: "A heti értékelés első kérdése a szabálykövetés, csak utána az eredmény.",
          keyPoints: ["Különítsd el a jó döntés–rossz eredmény és rossz döntés–jó eredmény esetét.", "Egy héten legfeljebb egy folyamatváltoztatást vezess be.", "A mintanagyságot és piaci környezetet mindig rögzítsd."],
          exercise: "Értékeld 1–5-ig: előkészítés, kivárás, méretezés, kilépés, naplózás. Válassz egyetlen fókuszt a jövő hétre.",
          sourceTag: "Roadmap + Orderflow tanulási jegyzet"
        },
        {
          id: "tanulasi-szintek",
          week: 20,
          title: "Tanulási szintek és reális időigény",
          duration: 15,
          summary: "A megértés, a felismerés és a végrehajtás három külön teljesítmény; egyikhez sem tartozik óraszám, amely önmagában nyereséget garantálna.",
          keyPoints: [
            "Megértés: el tudod magyarázni. Felismerés: friss adatban is azonosítod. Végrehajtás: időnyomás alatt is tartod a folyamatot.",
            "A továbblépés feltétele egy teljesített készség, nem egy letelt hónapszám.",
            "A lemaradást ne próbáld nagyobb kereskedési kockázattal behozni."
          ],
          exercise: "Sorold be magad a hat szint egyikébe, és írd le, melyik konkrét feltétel hiányzik még a következő szinthez.",
          sourceTag: "Orderflow tanulási jegyzet · 14. fejezet"
        }
      ]
    },
    {
      id: "diligence",
      number: "06",
      title: "Due diligence és Go/No-Go",
      shortTitle: "Go / No-Go",
      weeks: "21–24. hét",
      duration: "6. hónap",
      description: "Prop cég ellenőrzés, mock evaluation, szabályozási kontextus és döntés.",
      milestone: "Csak dokumentált, költség utáni eredmények és teljesült biztonsági feltételek alapján lépsz tovább.",
      lessons: [
        {
          id: "prop-diligence",
          week: 21,
          title: "Prop firm due diligence",
          duration: 28,
          summary: "A marketing helyett a szerződés, a szabálydefiníció, a payout-folyamat és a cég ellenőrizhető háttere számít.",
          keyPoints: ["Rögzítsd a szabály forrását és ellenőrzési dátumát.", "Vizsgáld a drawdown pontos számítását, tiltott stratégiákat és payout feltételeket.", "Ne kezeld a közösségi véleményt elsődleges bizonyítékként."],
          exercise: "Készíts összehasonlító lapot legalább két cégről, minden állításhoz közvetlen forráslinkkel.",
          sourceTag: "6 hónapos Day Trading Roadmap · 6. hónap"
        },
        {
          id: "mock-evaluation",
          week: 22,
          title: "Mock evaluation",
          duration: 24,
          summary: "Pontosan ugyanazokat a korlátokat szimuláld díjfizetés nélkül, és egy szabálysértést tekints bukásnak.",
          keyPoints: ["Profitcél, daily loss, drawdown és consistency legyen előre paraméterezve.", "Ne indítsd újra visszamenőleg a sikertelen tesztet.", "A siker feltétele a folyamat és a szabályok teljesítése, nem egy kiugró nap."],
          exercise: "Futtass két teljes mock ciklust változatlan szabályokkal, majd hasonlítsd össze a végrehajtási hibákat.",
          sourceTag: "6 hónapos Day Trading Roadmap · mock evaluation"
        },
        {
          id: "szabalyozas",
          week: 23,
          title: "Szabályozási kontextus 2026",
          duration: 22,
          summary: "A szabály mindig joghatóság-, instrumentum-, számlatípus- és szolgáltatófüggő; az időérzékeny állítást dátumozni kell.",
          keyPoints: ["A FINRA intraday margin átmenete miatt 2026-ban brókerenként eltérhet a gyakorlat.", "A FINRA/PDT keret nem vetíthető automatikusan futuresre, forexre vagy EU-s számlára.", "Bizonyos perpetual termékek az EU-ban jellemzőik alapján CFD-nek minősülhetnek."],
          exercise: "A saját termékedhez rögzítsd: joghatóság, instrumentum, számlatípus, bróker, forrás és ellenőrzési dátum.",
          sourceTag: "FINRA + ESMA · ellenőrizve 2026-10-07"
        },
        {
          id: "adozas-hu",
          week: 23,
          title: "Magyar adózási kontextus",
          duration: 16,
          summary: "A prop kifizetés hazai adóbesorolása eltérhet a saját brókerszámlás jövedelemétől; a besorolásról éles kifizetés előtt szakember döntsön.",
          keyPoints: [
            "Az ellenőrzött tőkepiaci ügylet (ETÜ) kedvezőbb kategória, de feltételekhez kötött.",
            "A legtöbb prop cég nem szabályozott befektetési szolgáltató, ezért az ETÜ besorolás nem garantált.",
            "Dokumentálj minden kifizetést, és tartsd külön a prop és a saját számlás eredményt."
          ],
          exercise: "Keresd meg az MNB intézménykeresőjében a választott szolgáltatódat, és jegyezd fel az eredményt dátummal együtt.",
          sourceTag: "6 hónapos Day Trading Roadmap · adózási kitérő (2026. augusztusi állapot)"
        },
        {
          id: "go-no-go",
          week: 24,
          title: "Go / No-Go döntés",
          duration: 20,
          summary: "A továbblépés előre rögzített bizonyítékokon alapuljon, ne türelmetlenségen vagy egy jó héten.",
          keyPoints: ["Elég nagy, költség utáni tesztminta és stabil végrehajtás.", "Két szabálykövető mock ciklus és nulla kritikus limitátlépés.", "Csak elveszíthető pénz, jogi/adózási ellenőrzés és írásos leállási terv."],
          exercise: "Minden feltételhez írj bizonyítékot. Ha bármelyik hiányzik, a döntés No-Go és konkrét következő lépés.",
          sourceTag: "6 hónapos Day Trading Roadmap · Go/No-Go"
        }
      ]
    }
  ],

  quiz: [
    {
      question: "Mit keres elsősorban egy market megbízás?",
      options: ["Garantált árat", "Azonnali végrehajtást", "Passzív sorpozíciót", "Nulla slippage-et"],
      correct: 1,
      lesson: "order-tipusok",
      explanation: "A market order végrehajtást keres az elérhető ellenoldali árakon. A pontos ár nem garantált."
    },
    {
      question: "Lehet-e egy limitmegbízás agresszív?",
      options: ["Soha", "Igen, ha eléri vagy keresztezi az ellenoldali ajánlatot", "Csak záráskor", "Csak stop után"],
      correct: 1,
      lesson: "order-tipusok",
      explanation: "A limit az árkorlátot határozza meg. Piacképes limit esetén azonnal fogyaszthat ellenoldali likviditást."
    },
    {
      question: "Mi a spread?",
      options: ["A legmagasabb és legalacsonyabb napi ár", "A best ask és best bid különbsége", "A jutalék", "Az átlagár és a VWAP különbsége"],
      correct: 1,
      lesson: "spread-slippage",
      explanation: "A spread a pillanatnyi best ask mínusz best bid. A teljes költség ennél több is lehet."
    },
    {
      question: "Mit jelent a +300-as delta?",
      options: ["300-zal több vevő van", "Az askhoz sorolt volumen 300-zal nagyobb a bidhez soroltnál", "Az ár 300 tickkel emelkedik", "300 limit order várakozik"],
      correct: 1,
      lesson: "delta-cvd",
      explanation: "A delta végrehajtott volumenek különbsége, nem a piaci szereplők darabszáma és nem árjóslat."
    },
    {
      question: "Mi a különbség resting liquidity és traded volume között?",
      options: ["Nincs különbség", "Az első várakozó ajánlat, a második végrehajtott mennyiség", "Az első múltbeli, a második jövőbeli", "Csak az adatfeed neve tér el"],
      correct: 1,
      lesson: "agressziv-passziv",
      explanation: "A könyvben várakozó ajánlat módosítható vagy törölhető; a traded volume már megtörtént kötés."
    },
    {
      question: "Mit mutat a POC?",
      options: ["A jövő legvalószínűbb fordulóját", "A kiválasztott profil legnagyobb volumenű ársorát", "A best bidet", "A session nyitóárát"],
      correct: 1,
      lesson: "volume-profile",
      explanation: "A POC múltbeli, időszakhoz kötött volumenstatisztika. Nem önálló előrejelzés."
    },
    {
      question: "A 70%-os value area azt jelenti, hogy az ár 70% eséllyel ott marad?",
      options: ["Igen", "Csak futuresnél", "Nem, múltbeli volumenhányadot jelöl", "Csak napi profilon"],
      correct: 2,
      lesson: "volume-profile",
      explanation: "A value area a profil volumenének kiválasztott részét foglalja össze; nem jövőbeli valószínűségi ígéret."
    },
    {
      question: "840 ask és 560 bid volumen esetén mennyi a delta?",
      options: ["+1400", "+280", "−280", "+20"],
      correct: 1,
      lesson: "delta-cvd",
      explanation: "Delta = ask − bid = 840 − 560 = +280. Az összvolumen 1400."
    },
    {
      question: "Miért nem automatikus vételi jel a pozitív delta?",
      options: ["Mert a delta mindig hibás", "Mert passzív eladók elnyelhetik az agresszív vételt", "Mert csak forexen működik", "Mert kizárólag napi charton használható"],
      correct: 1,
      lesson: "delta-cvd",
      explanation: "A nagy vételi agresszió mellett is stagnálhat vagy eshet az ár, ha az ellenoldali likviditás elnyeli."
    },
    {
      question: "+150, −90, −200 és +80 bar-delta után mennyi a CVD?",
      options: ["−60", "+60", "−140", "+440"],
      correct: 0,
      lesson: "delta-cvd",
      explanation: "150 − 90 − 200 + 80 = −60. A választott kezdőpont és session továbbra is lényeges."
    },
    {
      question: "Mi a pozícióméretezés helyes kiindulópontja?",
      options: ["A kívánt profit", "A vállalható pénzkockázat és az egységenkénti stopkockázat", "A maximális elérhető tőkeáttétel", "Az előző trade eredménye"],
      correct: 1,
      lesson: "poziciomeretezes",
      explanation: "A vállalható kockázati keretet osztjuk az egységenkénti stop- és költségkockázattal."
    },
    {
      question: "Mi a look-ahead bias egy profile replayben?",
      options: ["Túl sok chart megnyitása", "A session végső POC-jának használata egy korábbi döntéshez", "Kis pozícióméret", "A kötési díj levonása"],
      correct: 1,
      lesson: "backtest",
      explanation: "A végső POC a korábbi döntés pillanatában még nem volt ismert, ezért ez jövőbeli információ becsempészése."
    },
    {
      question: "Nagy negatív delta mellett az ár a mélyponton megáll. Mi a következő értelmes lépés?",
      options: ["Azonnal venni, mert a forduló bizonyított", "Megvizsgálni a helyszínt és a következő árreakciót", "A deltát hibásnak tekinteni", "Növelni a pozícióméretet"],
      correct: 1,
      lesson: "footprint",
      explanation: "A lehetséges abszorpció csak gyanú. A helyszín és az utána következő reakció dönti el, megmaradt-e a terület."
    },
    {
      question: "Mit mutat a HVN?",
      options: ["Egy biztosan megmaradó limitfalat", "Az összes nyitott pozíciót", "A profil nagyobb múltbeli kötött mennyiségű területét", "A következő nap irányát"],
      correct: 2,
      lesson: "volume-profile",
      explanation: "A HVN a kiválasztott profil múltbeli eloszlását írja le. A jelenlegi várakozó ajánlatokhoz aktuális könyvadat kell."
    },
    {
      question: "Mitől nő a CVD?",
      options: ["Minden emelkedő gyertyától", "Attól, hogy a következő szakasz deltája pozitív", "A könyv látható vételi mennyiségétől", "A spread szűkülésétől"],
      correct: 1,
      lesson: "delta-cvd",
      explanation: "A CVD a bar-deltákat összegzi a kezdőponttól. Pozitív delta növeli, negatív csökkenti."
    },
    {
      question: "Mire használható egy teljes gyertya footprint-táblázata?",
      options: ["A kötések pontos időrendjének rekonstruálására", "A résztvevők azonosítására", "Az árszintenként összesített kötési aktivitás vizsgálatára", "A következő gyertya irányának megadására"],
      correct: 2,
      lesson: "footprint",
      explanation: "A footprint összesítést mutat. A pontos sorrendhez kötéslista vagy megfelelő replay kell."
    },
    {
      question: "Mit bizonyít egy nagy ajánlat gyors törlése?",
      options: ["Hogy spoofing történt", "Hogy az ajánlat megváltozott vagy eltűnt, a szándék nem bizonyított", "Hogy az ár megfordul", "Hogy iceberg volt a könyvben"],
      correct: 1,
      lesson: "csapdak",
      explanation: "A törlés megfigyelhető tény. A megtévesztési szándékot egy pillanatfelvételből nem lehet igazolni."
    },
    {
      question: "Mit ér száz utólag kiválasztott, nyerő screenshot?",
      options: ["Megbízható bizonyíték a nyereségességre", "Száz független megfigyelés", "Példagyűjtemény, amelyből a vesztes és kimaradt helyzetek hiányoznak", "Kész stratégia"],
      correct: 2,
      lesson: "backtest",
      explanation: "Az utólagos válogatás nem ad teljes előfordulási mintát, ezért a modellről nem lehet belőle ítélni."
    },
    {
      question: "100,50-en az ask volumen 180, az eggyel alacsonyabb sor bid volumene 45. Mekkora a vételi átlós arány?",
      options: ["2:1", "3:1", "4:1", "135"],
      correct: 2,
      lesson: "footprint",
      explanation: "180 / 45 = 4, vagyis 4:1. A jelentőségéhez a minimum mennyiséget, a helyszínt és a reakciót is nézni kell."
    },
    {
      question: "Tickérték 2, stop 7 tick, oda-vissza jutalék 3, tartalék 1 tick, kockázatkeret 50. Legfeljebb hány egység fér bele?",
      options: ["1", "2", "3", "4"],
      correct: 1,
      lesson: "poziciomeretezes",
      explanation: "Egy egység becsült kerete 14 + 3 + 2 = 19. Az 50 / 19 lefelé kerekítve 2."
    },
    {
      question: "45% nyerési arány, 1,6R átlagnyerő, 1R átlagvesztes, 0,10R költség. Mennyi a nettó várható érték?",
      options: ["+0,17R", "+0,07R", "−0,03R", "+0,72R"],
      correct: 1,
      lesson: "expectancy",
      explanation: "0,45 × 1,6 − 0,55 × 1 − 0,10 = +0,07R. A költség nélkül +0,17R lenne."
    },
    {
      question: "100-on 20, 101-en 30, 102-n 50 kontraktus kötött. Melyik állítás igaz?",
      options: ["A VWAP és a POC is 102", "A VWAP 101,30, a POC 102", "A VWAP 101, a POC 101,30", "A VWAP 102, a POC 100"],
      correct: 1,
      lesson: "vwap-tpo",
      explanation: "VWAP = (2000 + 3030 + 5100) / 100 = 101,30. A POC a legnagyobb egyedi mennyiségű sor, vagyis 102."
    },
    {
      question: "Melyik drawdown követi a nyitott pozíció nem realizált csúcsát is?",
      options: ["A statikus", "A nap végi (EOD) trailing", "Az intraday trailing", "Egyik sem"],
      correct: 2,
      lesson: "drawdown",
      explanation: "Az intraday trailing valós időben követi a legmagasabb elért értéket, ezért egy visszaforduló papírprofit is szűkíti a mozgásteret."
    },
    {
      question: "Mit korlátoz a consistency rule?",
      options: ["A napi kötések számát", "Azt, hogy egyetlen nap mekkora részét adhatja a profitnak", "A maximális tőkeáttételt", "A kereskedhető instrumentumokat"],
      correct: 1,
      lesson: "consistency-szabalykonyv",
      explanation: "A szabály az egyetlen kiugró, túlkockáztatott napra épülő teljesítést szűri ki. A küszöb cégenként eltér."
    },
    {
      question: "Mennyit ér egy tick a Micro E-mini S&P 500 (MES) kontraktuson?",
      options: ["0,25 USD", "1,25 USD", "5 USD", "12,50 USD"],
      correct: 1,
      lesson: "kontraktus-session",
      explanation: "A MES 0,25 pontos tickje 1,25 USD, egy pont 5 USD. A 12,50 USD az ES tickértéke."
    },
    {
      question: "Mit jelent a MAE a naplóban?",
      options: ["Az átlagos nyereséget", "A legnagyobb kedvezőtlen elmozdulást a pozíció alatt", "A maximális tőkeáttételt", "A napi veszteséglimitet"],
      correct: 1,
      lesson: "naplo-rendszer",
      explanation: "A MAE a legnagyobb ellened történő elmozdulás. Tanulmányozásra való, nem a stop utólagos átírására."
    },
    {
      question: "Mi véd hatékonyan a revenge trade ellen?",
      options: ["Erősebb akarat", "Nagyobb pozíció a következő kötésen", "Előre rögzített, mechanikus szabály", "Több indikátor"],
      correct: 2,
      lesson: "evaluation-nyomas",
      explanation: "A döntést nyugodt állapotban kell meghozni, például: két egymást követő vesztes után aznapra vége."
    },
    {
      question: "Miben különbözik az abszorpció a kifáradástól?",
      options: ["Semmiben", "Abszorpciónál az agressziót passzív ellenoldal veszi fel, kifáradásnál az agresszió utánpótlása fogy el", "A kifáradás csak futuresen létezik", "Az abszorpció mindig fordulót jelent"],
      correct: 1,
      lesson: "footprint",
      explanation: "A kettő együtt is előfordulhat, de más folyamat: az egyikben erős az ellenoldal, a másikban gyengül a kezdeményező."
    },
    {
      question: "Mikor beszélünk sikertelen kitörésről?",
      options: ["Ha az ár egyáltalán nem éri el a szintet", "Ha az ár új területre jut, de nem alakul ki ott tartós kereskedés, és visszatér", "Ha a kitörés alacsony volumenű", "Ha a kitörés hír után történik"],
      correct: 1,
      lesson: "csapdak",
      explanation: "A meghatározó a kitörés utáni elfogadás hiánya és a visszatérés a korábbi tartományba."
    },
    {
      question: "Hol ellenőrizheted, hogy egy szolgáltató szerepel-e a magyar felügyelet nyilvántartásában?",
      options: ["A Trustpiloton", "Az MNB intézménykeresőjében", "A cég marketingoldalán", "A TradingView-n"],
      correct: 1,
      lesson: "adozas-hu",
      explanation: "Az MNB intézménykeresője a hivatalos kiindulópont. A besorolásról ettől még szakembernek kell döntenie."
    }
  ],

  sources: [
    { title: "FINRA · Intraday margin követelmények", tag: "USA · margin", url: "https://www.finra.org/investors/insights/intraday-margin-requirements", note: "A 2026-os új rendszer és a brókercégek átmeneti időszaka." },
    { title: "Investor.gov · Megbízástípusok", tag: "market · limit · stop", url: "https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders", note: "Hivatalos alapdefiníciók és a teljesülés korlátai." },
    { title: "Investor.gov · Margin számlák", tag: "margin · kockázat", url: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-29", note: "Margin call, kényszerlikvidálás és brókeri house requirement." },
    { title: "CFTC · Futures alapok", tag: "futures · leverage", url: "https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/FuturesMarketBasics/index.htm", note: "Napi elszámolás, tőkeáttétel és veszteségkockázat." },
    { title: "CFTC · Hipotetikus eredmények", tag: "backtest · paper", url: "https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/fraudadv_tradingsystem.html", note: "Spread, slippage, likviditás és szimulációs korlátok." },
    { title: "CME Group · Trading Simulator", tag: "gyakorlás · futures", url: "https://www.cmegroup.com/education/practice/about-the-trading-simulator", note: "Valós pénzügyi kockázat nélküli futures/opciós gyakorlókörnyezet." },
    { title: "ESMA · Perpetual futures / CFD", tag: "EU · 2026", url: "https://www.esma.europa.eu/press-news/esma-news/esma-reminds-firms-their-obligations-under-cfd-product-intervention-measures", note: "Bizonyos perpetual termékek jellemzőik alapján CFD-nek minősülhetnek." },
    { title: "CME Group · Futures megbízástípusok", tag: "futures · order", url: "https://www.cmegroup.com/education/courses/futures-trading-mechanics-and-regulation/futures-order-types", note: "Marketable limit és a CME stopváltozatai." },
    { title: "CME Group · Micro E-mini termékek", tag: "MES · tickérték", url: "https://www.cmegroup.com/education/courses/micro-e-mini-futures/micro-e-mini-futures-products-overview", note: "Tickméret és tickérték a micro index kontraktusokon." },
    { title: "CME Group · Market by Order", tag: "MBP · MBO", url: "https://www.cmegroup.com/articles/faqs/market-by-order-mbo.html", note: "Árszintenkénti és megbízásonkénti könyvadat, iceberg-megbízások." },
    { title: "TradingView · Volume profile alapfogalmak", tag: "POC · value area", url: "https://www.tradingview.com/support/solutions/43000502040-volume-profile-indicators-basic-concepts/", note: "Profilfogalmak, számítási módszer és adatfajták." },
    { title: "Sierra Chart · Numbers Bars", tag: "footprint · delta", url: "https://www.sierrachart.com/index.php?l=doc/NumbersBars.php", note: "Bid/ask volumen, átlós összehasonlítás és adatfeltételek." },
    { title: "Bookmap · Abszorpció és kifáradás", tag: "orderflow", url: "https://bookmap.com/en/learning-center/supply-demand-setups/supply-demand-setups/absorption-exhaustion", note: "A passzív felvétel és az agresszió kifáradásának elkülönítése." },
    { title: "BIS · A devizapiac szerkezete", tag: "spot forex · OTC", url: "https://www.bis.org/publications/working-paper-1094-foreign-exchange-market", note: "Miért nincs egyetlen globális megbízási könyv a spot devizapiacon." },
    { title: "MNB · Intézménykereső", tag: "HU · engedély", url: "https://intezmenykereso.mnb.hu", note: "Szolgáltatók engedélyének ellenőrzése a magyar felügyeletnél." }
  ]
};
