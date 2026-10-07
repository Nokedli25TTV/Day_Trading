// 05 · Pszichológia és szimuláció: a leckék részletes törzsanyaga.
export default {
  "evaluation-nyomas": {
    sections: [
      {
        title: "Mi más egy kiértékelés alatt",
        body: [
          "Az evaluation nem általános „kereskedési pszichológia”. Határidő, szabályrendszer és befizetett díj alatt kereskedsz, és mindhárom ugyanabba az irányba húz: siess, kockáztass többet, hozd vissza.",
          "A profitcél közelsége, az időnyomás és a drawdown közelsége nem változtat a setupod statisztikai minőségén. Csak a te viselkedéseden."
        ]
      },
      {
        title: "Revenge trade",
        body: [
          "Egy veszteség után a trader, tudat alatt vissza akarva szerezni a pénzt, megnöveli a méretet vagy átlépi a saját setup-szabályait. A kötés célja ilyenkor az érzelmi állapot javítása, nem egy előny végrehajtása.",
          "Az ellenszer nem az, hogy „legközelebb fegyelmezettebb leszek”. Hanem egy előre leírt, mechanikus szabály: például két egymást követő vesztes kötés után aznapra bezárod a platformot."
        ]
      },
      {
        title: "A célközelség csapdája",
        body: [
          "Amikor a cél 80%-ánál jársz, erős a kísértés, hogy megemeld a kockázatot, és „gyorsan meglegyen”. Pont fordítva kellene: minél közelebb vagy, annál inkább az eredeti méretet tartsd. A consistency rule ráadásul büntetheti is a kiugró napot.",
          "A kötés nélküli nap lehet tökéletesen végrehajtott nap, ha a feltételeid nem teljesültek."
        ]
      },
      {
        title: "Ha el kell buknod",
        body: [
          "A jegyzeted által idézett adat szerint a jelentkezőknek nagyjából 14%-a jut át egy kiértékelésen. A bukás tehát a többséggel megtörténik, és nem azt jelenti, hogy rossz kereskedő vagy: a rendszer úgy épül fel, hogy elsőre a legtöbben ne érjék el a célt.",
          "Ezért kell már most leírni, mit teszel egy bukás után: mennyi szünetet tartasz, mit nézel át a naplóban, és milyen feltétellel indulsz újra."
        ]
      }
    ],
    mistakes: [
      "Akaraterővel próbálni megoldani azt, amit szabállyal kellene.",
      "A cél közelében megemelni a pozícióméretet.",
      "A bukást személyes kudarcként kezelni, elemzés nélkül újraindítani."
    ],
    check: [
      { q: "Mi a revenge trade valódi célja?", a: "Az érzelmi állapot javítása a veszteség után, nem egy statisztikai előny végrehajtása." },
      { q: "Mit teszel a cél 80%-ánál?", a: "Ugyanazt, mint addig: eredeti méret, eredeti szabályok. A közelség nem javít a setupon." }
    ]
  },

  "if-then": {
    sections: [
      {
        title: "Miért működik",
        body: [
          "Nyomás alatt rosszul döntünk, ezért a döntést előre kell meghozni. A ha–akkor szabály egy helyzetet köt össze egy kész cselekvéssel, így a triggerhelyzetben már csak végrehajtani kell.",
          "A jó szabály konkrét és ellenőrizhető. „Ha ideges vagyok, óvatosabb leszek” nem szabály. „Ha két vesztes kötés jön egymás után, bezárom a platformot és 30 percig nem nyitom meg” az."
        ]
      },
      {
        title: "A három kötelező helyzet",
        list: [
          "**Ha két egymást követő napon veszítek,** akkor a harmadik napon fél mérettel kereskedem, vagy szünetet tartok.",
          "**Ha a profitcél 80%-ánál járok,** akkor a méretem változatlan marad, és legfeljebb a szokásos számú kötést nyitom.",
          "**Ha elbukom egy kiértékelést,** akkor egy hét szünet, naplóelemzés, és csak leírt javítással indulok újra."
        ],
        body: [
          "Ezekre legyen kész válaszod, mielőtt éles pénzzel átélnéd őket."
        ]
      },
      {
        title: "További minták",
        list: [
          "Ha elérem a napi stopot, akkor a platform bezár, és nincs kivétel.",
          "Ha a setup nem teljes, akkor képernyőkép készül, kötés nem.",
          "Ha azon kapom magam, hogy a stopot akarom tágítani, akkor zárom a pozíciót az eredeti szinten.",
          "Ha kimarad egy jó mozgás, akkor felírom a naplóba, és nem ugrok utána."
        ]
      },
      {
        title: "Hol tartsd",
        body: [
          "A lista a 3. modulban írt szabálykönyv mellé kerül, látható helyre. A heti értékelésnél nézd meg, melyik szabály lépett életbe, és betartottad-e. Amelyik soha nem aktiválódik, az vagy fölösleges, vagy nem vetted észre a helyzetet."
        ]
      }
    ],
    mistakes: [
      "Homályos szabályt írni, amelyet nem lehet megszegni.",
      "Húsz szabályt írni öt helyett.",
      "A szabályt kereskedés közben átfogalmazni."
    ],
    check: [
      { q: "Mitől jó egy ha–akkor szabály?", a: "A feltétele megfigyelhető, a cselekvése konkrét, és utólag egyértelműen eldönthető, hogy betartottad-e." },
      { q: "Mikor írod meg ezeket?", a: "Nyugodt állapotban, kereskedésen kívül, még mielőtt a helyzetet élesben átélnéd." }
    ]
  },

  "replay-demo": {
    sections: [
      {
        title: "Előbb megfigyelés, belépő nélkül",
        body: [
          "Az első szakaszban ne akarj minden megfigyelést kötésre váltani. Válassz egy sessiont, jelöld be az előző profil referenciáit, és írd le, hol jár az ár ezekhez képest. Külön figyeld azokat a helyzeteket, ahol nagy agresszió kevés elmozdulást okoz, és ahol kevés volumen is nagy mozgást hoz."
        ]
      },
      {
        title: "Replay jövőbeli adat nélkül",
        body: [
          "Takard el a későbbi mozgást. A kiválasztott helyzet előtt állj meg, és írd le, melyik forgatókönyv milyen reakciótól erősödne. Csak utána engedd tovább. Ne csak azokat a helyzeteket vizsgáld, amelyekről tudod, hogy látványos fordulat lett belőlük.",
          "A sebességet igazítsd a feladathoz. A megértéshez lassíts, a végrehajtás gyakorlásához viszont közel valós idejű döntés kell. A lassított replayben elért hibátlan felismerés nem ugyanaz a készség, mint időnyomás alatt követni a szabályt."
        ]
      },
      {
        title: "Mit tud a demo, és mit nem",
        body: [
          "A paper trading valós adaton, valós időben fut, de nem szimulálja pontosan a slippage-et és a piac mikroszerkezetét. A cél ezért most nem a profit, hanem hogy a szabályaidat hiba nélkül kövesd élő körülmények között.",
          "Állítsd a virtuális egyenleget akkorára, amekkora kiértékelést célzol, és használd ugyanazt a pozícióméretezőt és szabálykönyvet. A szimulált eredményt mindig címkézd szimuláltként."
        ]
      },
      {
        title: "Mikor mehetsz tovább",
        intro: [
          "A jegyzeted négy feltételt ad. Ha bármelyik hiányzik, maradj még egy hónapot ebben a szakaszban."
        ],
        list: [
          "Két egymást követő hónapon át betartott napi veszteséglimit, nulla átlépéssel.",
          "Szabálykövető módon pozitív eredmény, nem egy-két szerencsés nap húzza fel.",
          "A kötések legalább 90%-a megfelel a szabálykönyvnek.",
          "Túléltél szimuláltan egy 4–5 kötéses vesztes sorozatot a szabályaid betartásával."
        ]
      }
    ],
    example: {
      title: "Egy hatvanperces alkalom",
      body: [
        "10 perc: egy fogalom átismétlése, a környezet bejelölése. 30 perc: egy rövid piaci szakasz megfigyelése vagy visszajátszása. 15 perc: néhány példa rögzítése a naplóban. 5 perc: egy konkrét tanulság és egy nyitott kérdés.",
        "Ha csak 30 perced van, a megfigyelt szakaszt rövidítsd, a naplózást ne hagyd ki. Iskola és vizsgák mellett a rövid, rendszeres alkalmak reálisabbak, mint a folyamatos piacnézés."
      ]
    },
    mistakes: [
      "Csak akkor kereskedni, amikor „jónak érződik” a piac, így túl kevés adatot gyűjteni.",
      "A demo szakaszt egyetlen jó hét után sikeresnek nyilvánítani.",
      "A demo egyenleget játékpénznek tekinteni."
    ],
    check: [
      { q: "Mit nem modellez jól a paper trading?", a: "A valós slippage-et, a sorban állást és a piac mikroszerkezetét, ezért az eredménye optimistább lehet az élesnél." },
      { q: "Mi a cél a demo szakaszban?", a: "A szabályok hibátlan követése élő körülmények között, nem a profit." }
    ]
  },

  "heti-review": {
    sections: [
      {
        title: "Az első kérdés a szabálykövetés",
        body: [
          "A heti értékelés sorrendje: előbb a folyamat, utána az eredmény. Hány kötés felelt meg a szabálykönyvnek? Hol tértél el, és milyen érzelmi állapotban voltál akkor? Ez mutatja meg a személyes triggermintáidat."
        ]
      },
      {
        title: "A négy mező",
        table: {
          head: ["", "Jó eredmény", "Rossz eredmény"],
          rows: [
            ["Szabályos döntés", "Ezt akarod ismételni", "A modell természetes kockázata"],
            ["Szabálytalan döntés", "Végrehajtási hiba, csak szerencséd volt", "Végrehajtási hiba, amely megbüntetett"]
          ]
        },
        body: [
          "A legveszélyesebb a bal alsó mező: a szabálytalan nyerő kötés jutalmazza a rossz szokást. Jelöld hibának, akármennyit hozott."
        ]
      },
      {
        title: "Folyamatpontszám",
        body: [
          "Értékeld 1-től 5-ig öt területen: előkészítés, kivárás, méretezés, kilépés, naplózás. Válaszd ki a leggyengébbet, és a következő héten csak arra figyelj.",
          "Egy héten legfeljebb egy érdemi változtatást vezess be. Írd le, miért változtatsz, milyen új viselkedést vársz, és mi alapján fogod megítélni. Az állandó beállításcsere nem következetes gyakorlás."
        ]
      },
      {
        title: "Amit még rögzíts",
        body: [
          "A mintanagyságot és a piaci környezetet. Öt kötésből nem vonsz le következtetést, és egy trendelő hét eredménye mást jelent, mint egy oldalazóé. Külön írd fel, melyik fogalmat értelmezted következetesen, hol léptél volna túl korán, és milyen adat maradt bizonytalan."
        ]
      }
    ],
    mistakes: [
      "Az értékelést az egyenleggel kezdeni.",
      "Minden vesztes hét után szabályt módosítani.",
      "Több változtatást bevezetni egyszerre."
    ],
    check: [
      { q: "Melyik mező a legveszélyesebb, és miért?", a: "A szabálytalan döntés jó eredménnyel, mert megerősíti a rossz szokást." },
      { q: "Hány változtatást vezetsz be egy héten?", a: "Legfeljebb egyet, előre leírt indokkal és értékelési szemponttal." }
    ]
  },

  "tanulasi-szintek": {
    sections: [
      {
        title: "Három külön teljesítmény",
        body: [
          "**Megértés:** el tudod magyarázni, mi történik. **Felismerés:** friss vagy visszajátszott adatban következetesen azonosítod ugyanazt a helyzetet. **Végrehajtás:** időnyomás alatt is tartod az előre meghatározott folyamatot.",
          "A nyereséges kereskedéshez ezek mellett költségek utáni előny és a piaci változásokhoz való alkalmazkodás is kell. Nincs óraszám, amely ezt önmagában biztosítaná. Lehet alaposan ismerni a fogalmakat úgy is, hogy a saját modell még nem működik."
        ]
      },
      {
        title: "A hat szint",
        table: {
          head: ["Szint", "Fő készség", "Összesített idő"],
          rows: [
            ["1", "Megbízások, bid/ask, tick, kockázat", "15–25 óra"],
            ["2", "Aukció, profil, piaci környezet", "45–70 óra"],
            ["3", "Delta, footprint, reakció értelmezése", "90–140 óra"],
            ["4", "Következetes felismerés replayben", "150–250 óra"],
            ["5", "Saját modell külön ellenőrző mintával", "250–450 óra"],
            ["6", "Stabil szimulált végrehajtás több környezetben", "450–800 óra vagy több"]
          ]
        },
        body: [
          "Az óraszámok a kezdettől felhalmozott, figyelmes tanulási időt mutatják, nem kell összeadni őket. Tervezési támpontok, nem kutatással igazolt átlagok. A hatodik szint sem garantál nyereséges éles kereskedést."
        ]
      },
      {
        title: "Mikor lépj tovább",
        list: [
          "**1. szint:** el tudsz magyarázni egy agresszív vételt úgy, hogy a passzív eladót is megnevezed, és tickből pénzkockázatot számolsz.",
          "**2. szint:** ugyanabból az adatból azonos módon építesz profilt, és elkülöníted a POC-ot, a VWAP-ot, a VAH-t és a VAL-t.",
          "**3. szint:** önállóan számolsz deltát és átlós arányt, és ugyanahhoz a pozitív deltához tudsz sikeres és sikertelen példát mondani.",
          "**4. szint:** későbbi mozgás nélküli replayben is következetesen minősítesz, külön írva a tényt és a hipotézist.",
          "**5. szint:** a szabályaidat más is követni tudja, és van külön ellenőrző mintád reális költséggel.",
          "**6. szint:** több egymást követő héten tartod a tervet vesztes sorozat alatt is."
        ]
      },
      {
        title: "Tizenkét hetes kezdő program",
        body: [
          "Heti 8–10 órával: 1–2. hét megbízások és könyv, 3–4. hét aukció és profil, 5–6. hét delta és footprint, 7–8. hét abszorpció és sikertelen kitörés, 9–10. hét egyetlen modell rögzítése, 11–12. hét új replayadat és végrehajtási gyakorlat. Heti 5–6 órával ez 18–24 hétre nyúlik.",
          "A maradék idő legyen ismétlés vagy pihenő, ne kényszerből végzett piacnézés."
        ]
      }
    ],
    mistakes: [
      "Egy letelt hónapszám alapján továbblépni.",
      "A lassított replayben elért eredményt végrehajtási készségnek venni.",
      "A lemaradást nagyobb kockázattal behozni."
    ],
    check: [
      { q: "Mi a különbség a felismerés és a végrehajtás között?", a: "A felismerés azt jelenti, hogy azonosítod a helyzetet. A végrehajtás azt, hogy időnyomás és vesztes sorozat alatt is a terv szerint cselekszel." },
      { q: "Mit bizonyít néhány jó hét?", a: "Keveset. Lehet a piaci állapot, a véletlen és a szabályos munka közös eredménye. Új adat és kedvezőtlen környezet is kell hozzá." }
    ]
  }
};
