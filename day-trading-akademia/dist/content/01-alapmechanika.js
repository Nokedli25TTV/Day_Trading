// 01 · Piaci alapmechanika: a leckék részletes törzsanyaga.
export default {
  "kotes-letrejotte": {
    sections: [
      {
        title: "Minden kötésnek két oldala van",
        body: [
          "Ha 100 kontraktus cserél gazdát, abban 100 kontraktust megvesznek és 100-at eladnak. A kötésvolumen ezt 100-nak számolja, nem 200-nak. A szereplők száma ettől eltérhet: egy nagy megbízás sok kisebbel is találkozhat.",
          "Az „erősebbek a vevők” ezért nem azt jelenti, hogy több kontraktust vettek, mint amennyit eladtak. Azt jelenti, hogy a vevői oldal agresszívebben kezdeményez, vagy a vásárlásnak nagyobb a felfelé irányuló árhatása. **A kulcskérdés: ki kezdeményez, és hogyan reagál az ellenoldal.**"
        ]
      },
      {
        title: "Miért lép tovább az ár",
        body: [
          "Az azonnali végrehajtást kereső vétel a könyvben várakozó eladási ajánlatokkal találkozik. Ha egy árszinten elfogy az eladható mennyiség, a következő vétel már magasabb szinten teljesül. Eladásnál ugyanez történik fordítva.",
          "Az ajánlati ár kötés nélkül is változhat. Ha a legjobb eladási ajánlatot visszavonják, a best ask feljebb kerül, pedig ott senki nem kötött. Az utolsó kötési ár, a best bid, a best ask és a kettő középértéke négy külön dolog: mindig tudd, melyiket mutatja a grafikonod."
        ]
      },
      {
        title: "Amit a kötésekből nem lehet kiolvasni",
        body: [
          "Egy agresszív vétel lehet új long belépés, short pozíció zárása, fedezés vagy egy nagyobb stratégia része. A szokásos adatokból nem látod a résztvevő személyét, teljes pozícióját és célját, és azt sem, mikor vonják vissza a likviditást.",
          "Az orderflow megfigyelhető eseményekből segít következtetni. A következtetés mindig gyengébb, mint az adat, amelyre épül."
        ]
      }
    ],
    example: {
      title: "Egy 60 kontraktusos vétel három árszinten",
      diagram: "order-book",
      diagramCaption: "A vétel elfogyasztja a két legjobb eladási szintet, a harmadikból pedig 10-et visz el. A vételi oldal érintetlen marad.",
      table: { head: ["Eladási ár", "Várakozik", "Ebből teljesül"], rows: [["100,25", "20", "20"], ["100,50", "30", "30"], ["100,75", "80", "10"]] },
      body: [
        "Az átlagár (20 × 100,25 + 30 × 100,50 + 10 × 100,75) / 60 ≈ 100,4583. Az utolsó részlet 100,75-ön köt, de az egész megbízás nem ott teljesült.",
        "Ha ugyanez a 60 kontraktus egy 500-as best askkal találkozna, minden elférne az első szinten. Ugyanannyi agresszív vétel, egészen más árhatás."
      ]
    },
    mistakes: [
      "„Több vevő volt, ezért emelkedett.” Minden kötött mennyiséghez ugyanannyi vétel és eladás tartozik.",
      "Az utolsó kötési árat az egész megbízás teljesülési árának tekinteni.",
      "Két hasonló alakú gyertyából azonos vásárlási erőre következtetni."
    ],
    check: [
      { q: "Változhat a best ask úgy, hogy ott nem történik kötés?", a: "Igen. Ha a legjobb eladási ajánlatot visszavonják, vagy új, jobb ajánlat érkezik, a best ask kötés nélkül is elmozdul." },
      { q: "Egy emelkedő gyertya mindig erős vásárlást jelent?", a: "Nem. Kevés vétel is elég lehet hozzá, ha az eladási ajánlatok ritkák vagy visszavonják őket." }
    ]
  },

  "order-tipusok": {
    sections: [
      {
        title: "Mit határoz meg az egyes megbízás",
        table: {
          head: ["Megbízás", "Mit ad meg", "Fő sajátosság"],
          rows: [
            ["Market", "Azonnali végrehajtást keres", "Az elérhető ellenoldali árakon teljesül"],
            ["Limit", "A legrosszabb elfogadható árat", "Az ár korlátozott, a teljesülés bizonytalan"],
            ["Marketable limit", "Limit, amely már eléri az ellenoldalt", "Az árhatárig agresszíven teljesülhet"],
            ["Stop market", "Aktiváló árszintet", "Aktiválás után azonnali végrehajtást keres"],
            ["Stop limit", "Aktiváló árszintet és limitárat", "Aktiválás után limitként viselkedik"]
          ]
        },
        body: [
          "Ezekhez társul két gyakori kombináció. Az **OCO** (one cancels other) két megbízást köt össze: ha az egyik teljesül, a másik törlődik. A **bracket** a belépőhöz rögtön stopot és célárat is rendel."
        ]
      },
      {
        title: "A limit nem mindig passzív",
        body: [
          "Ha 100,25-ön van eladó, és 100,50-es vételi limitet küldesz, az ajánlatod azonnal találkozhat a 100,25-ös mennyiséggel. Az agresszivitást az dönti el, hogy a megbízás a könyvhöz képest végrehajtható-e, nem a neve.",
          "A limitár a legrosszabb elfogadható árat rögzíti. Jobb áron teljesülhetsz, rosszabbon nem."
        ]
      },
      {
        title: "A stop csak feltétel",
        body: [
          "A stop aktiválási árszint. Hogy utána mi történik, az a megbízás típusától és a piactól függ: a CME például stop-limit és védősávos stop megbízást is használ. **A stopár nem jelenti, hogy pontosan azon az áron teljesülsz.** Gyors piacon a tényleges ár rosszabb lehet.",
          "Mielőtt egy platformon élesben használnád, olvasd el, hogyan kezeli a stopot az adott terméken."
        ]
      }
    ],
    example: {
      title: "Ugyanaz a szándék, három megbízás",
      body: [
        "Venni szeretnél. A best bid 5102,00, a best ask 5102,25. Market megbízással azonnal kapsz teljesülést, de az átlagár a látható asknál rosszabb is lehet. Egy 5102,00-s limittel te szabod meg az árat, viszont lehet, hogy a piac nélküled megy tovább. Egy 5103,00-s buy stop csak akkor aktiválódik, ha az ár odáig emelkedik.",
        "Próbáld ki a Gyakorlás nézet Megbízás-laborjában."
      ]
    },
    mistakes: [
      "Mindig market megbízást használni, „mert egyszerűbb”. Ez minden kötésen spreadet és esetleges slippage-et jelent.",
      "A stopot garantált kilépési árnak hinni.",
      "A limitet eleve passzívnak tekinteni."
    ],
    check: [
      { q: "Mikor nagyobb gond a nem teljesülés, mint a slippage?", a: "Amikor a kimaradás költsége a nagyobb: például egy védelmi kilépésnél fontosabb, hogy kint legyél, mint hogy néhány tickkel jobb árat kapj." },
      { q: "Mi a különbség a stop market és a stop limit között aktiválás után?", a: "A stop market azonnali végrehajtást keres, akár rosszabb áron is. A stop limit limitként várakozik, így lehet, hogy egyáltalán nem teljesül." }
    ]
  },

  "agressziv-passziv": {
    sections: [
      {
        title: "Két szerep, nem két embertípus",
        body: [
          "Az **agresszív fél** elfogadja az ellenoldal elérhető árát a gyors végrehajtásért. Vételnél ezt „lifting the offer”, eladásnál „hitting the bid” néven emlegetik. A **passzív fél** a könyvben várakozik, és likviditást ad a hozzá érkezőnek.",
          "A passzív eladás nem gyengeség: komoly ellenállást jelenthet az agresszív vevőknek. A passzív vétel pedig megállíthat egy eladási hullámot. Ugyanaz a kereskedő az egyik ügyletében passzívan, a következőben agresszíven köt."
        ]
      },
      {
        title: "Mit jelent a likviditás",
        intro: [
          "A likviditás annak a lehetősége, hogy egy mennyiséget gyorsan, kis költséggel és korlátozott árhatással végre lehessen hajtani. Négy tulajdonsága segít megérteni:"
        ],
        list: [
          "a spread szélessége,",
          "az árszinteken elérhető mennyiség,",
          "a kívánt méret árhatása,",
          "a könyv feltöltődésének sebessége."
        ]
      },
      {
        title: "Várakozó ajánlat és kötött volumen",
        body: [
          "A **resting liquidity** a könyvben most várakozó, látható mennyiség. A **traded volume** már végrehajtott mennyiség. Ha tegnap sok kontraktus kötött 100-on, abból nem következik, hogy ma is nagy ajánlat várakozik ott.",
          "A könyv egy része rejtett lehet. Az iceberg megbízásból csak egy rész látszik, amely teljesülés után újratöltődik. Az újratöltődés önmagában még nem bizonyít icebergöt: több résztvevő új ajánlatai ugyanilyen képet adhatnak."
        ]
      },
      {
        title: "A sorban állás",
        body: [
          "Az, hogy az ár eléri a limitedet, még nem jelent teljesülést. Ha előtted sok mennyiség várakozik, és a beérkező ellenoldali forgalom azt sem fogyasztja el, a megbízásod érintetlen marad.",
          "A párosítás szabálya termékfüggő: van, ahol az időbeli sorrend számít, máshol arányos vagy kombinált az elosztás. Az „aki előbb jött, előbb teljesül” szabályt csak ott alkalmazd, ahol valóban ez érvényes."
        ]
      }
    ],
    mistakes: [
      "A könyvben látott nagy ajánlatot biztos falnak tekinteni. A mennyiség eltűnhet, elfogyhat vagy máshová kerülhet.",
      "A tegnapi nagy forgalmú szintet mai várakozó likviditásnak hinni.",
      "A backtesztben minden érintett limitet teljesültnek számolni."
    ],
    check: [
      { q: "Egy passzív eladó lehet „erős”?", a: "Igen. Ha sok agresszív vételt kis ármozgással kiszolgál, az komoly ellenállás az emelkedésnek." },
      { q: "Miért nem biztos a limit teljesülése, ha az ár megérinti?", a: "Mert a sorban előtted állók mennyiségét is el kell fogyasztania a beérkező forgalomnak, mielőtt rád kerülne a sor." }
    ]
  },

  "spread-slippage": {
    sections: [
      {
        title: "Bid, ask, spread, tick",
        body: [
          "A **best bid** a legmagasabb várakozó vételi ajánlat, a **best ask** a legalacsonyabb eladási. A **spread** a kettő különbsége: 100,00-s bid és 100,25-ös ask mellett 0,25. Aki azonnal vesz, tipikusan az askon köt, aki azonnal elad, a biden. Egy azonnali oda-vissza ügyletet így már a spread is terhel.",
          "A **tick size** a legkisebb megengedett árlépés, a **tick value** egy tick pénzbeli értéke adott mennyiségre. Egy pont több tickből állhat. A pont, a tick és a pénzösszeg három külön mértékegység."
        ]
      },
      {
        title: "Honnan jön a slippage",
        body: [
          "A slippage az eltérés a várt referenciaár és a tényleges teljesülés között. Akkor keletkezik, ha a megbízásod nagyobb, mint az első árszinten elérhető mennyiség, ha a könyv közben megváltozik, vagy ha egy stop gyors piacon aktiválódik.",
          "A látható spread tehát csak a költség egyik része. A mélység és a volatilitás legalább ennyit számít."
        ]
      },
      {
        title: "A kötés teljes költsége",
        body: [
          "Költség = jutalék + díjak + spreadhatás + slippage. Ügyelj, hogy ne vond le ugyanazt kétszer: ha a szimuláció a belépést a tényleges askon, a kilépést a tényleges biden számolja, a spread már benne van az áreredményben. A további slippage-et ehhez képest kezeld.",
          "A visszatesztben látott tökéletes belépési és kilépési árak könnyen túlbecsülik a valós eredményt."
        ]
      }
    ],
    example: {
      title: "Átlagár és slippage",
      body: [
        "Négy egységet veszel market megbízással. Kettő 100,25-ön, kettő 100,50-en teljesül. Az átlagár (2 × 100,25 + 2 × 100,50) / 4 = 100,375.",
        "Ha a döntésedet a 100,25-ös best askra alapoztad, a slippage egységenként 0,125. Fél tick, ami egy rövid távú stratégia teljes előnyét elviheti."
      ]
    },
    mistakes: [
      "A képernyőn látott árat teljesülési árnak venni.",
      "A spreadet kétszer levonni, vagy éppen teljesen kihagyni a számításból.",
      "A tickértéket összekeverni a pontértékkel."
    ],
    check: [
      { q: "Mennyi a spread 4998,75-ös bid és 4999,25-ös ask mellett, ha a tick 0,25?", a: "0,50 pont, vagyis 2 tick." },
      { q: "Miért lehet rosszabb a tényleges költség a látható spreadnél?", a: "Mert a megbízás mérete túlnyúlhat az első árszint mennyiségén, a könyv közben változhat, és a jutalék is hozzáadódik." }
    ]
  },

  "tokeattetel-margin": {
    sections: [
      {
        title: "Ki a partnered az ügyletben",
        table: {
          head: ["Termék", "Hol jön létre az ügylet", "Mire figyelj"],
          rows: [
            ["Spot (készpénzes) piac", "A kereskedési helyszínen vagy szolgáltatónál", "Deviza esetén nincs egyetlen központi könyv"],
            ["CFD", "A szolgáltatóval kötött szerződés az árkülönbözetre", "A partnered maga a szolgáltató"],
            ["Futures", "Tőzsdei, szabványosított kontraktus", "Kontraktusméret, lejárat, tickérték"]
          ]
        },
        body: [
          "A különbség nem elméleti. Ettől függ, milyen adatot látsz, milyen szabályozás véd, és kinél van a pénzed. A legtöbb prop cégnél ráadásul szimulált tőkén kereskedsz, modellezett végrehajtással: ez megint más helyzet, mint saját tőke egy szabályozott brókernél. A 6. modulban erre épül a cégek ellenőrzése."
        ]
      },
      {
        title: "A tőkeáttétel szorzó, nem ajándék",
        body: [
          "1:30 tőkeáttételnél 1000 egységnyi letéttel 30 000 egységnyi pozíciót tartasz. Az ár 1%-os elmozdulása a pozíción 300 egység, vagyis a letéted 30%-a. Az 1:100-as áttételnél ugyanez a mozgás a teljes letétet elviszi.",
          "A tőkeáttétel a nyereséget és a veszteséget pontosan ugyanúgy nagyítja fel. A kockázatot ezért soha nem az elérhető áttételből, hanem a stop távolságából és a vállalható veszteségből számold (3. modul)."
        ]
      },
      {
        title: "Margin",
        body: [
          "A margin letét, amelyet a pozíció nyitásához és fenntartásához kérnek. Nem díj, és nem a maximális veszteséged felső határa. Ha a számla értéke a fenntartási szint alá esik, a szolgáltató pótlást kérhet vagy zárhatja a pozíciót.",
          "A marginigény a piaci volatilitással változik, és a prop cégek kiértékelési számláin saját, szimulált szabályok érvényesek. Mindig az aktuális, saját szolgáltatódra vonatkozó értéket nézd."
        ]
      }
    ],
    mistakes: [
      "A tőkeáttételt szabad pénznek nézni, nem a kockázat szorzójának.",
      "A marginigényből következtetni arra, mennyit lehet veszíteni.",
      "Egy futures kontraktus adatait változtatás nélkül átvinni a hozzá kapcsolódó CFD-re."
    ],
    check: [
      { q: "1:50 tőkeáttételnél mekkora ellened irányuló ármozgás viszi el a teljes letétet?", a: "Nagyjából 2%. A pozíció a letét ötvenszerese, így a pozíció 2%-a a letét 100%-a." },
      { q: "Miért számít, hogy CFD-n vagy tőzsdei futuresön kereskedsz?", a: "Más a partnered, más az adat, amit látsz, mások az árak, a költségek és a szabályozói háttér." }
    ]
  },

  "piacvalasztas": {
    sections: [
      {
        title: "Miért kell most dönteni",
        body: [
          "A 2–6. modul hangsúlyai attól függnek, hogy forex-prop vagy futures-prop irányba indulsz. A döntés nem végleges, de irányt ad. Kezdőként a „mindkettő egyszerre” szétszórja a figyelmedet."
        ]
      },
      {
        title: "Döntési mátrix",
        table: {
          head: ["Szempont", "Forex-prop", "Futures-prop"],
          rows: [
            ["Díjszerkezet", "Gyakran alacsonyabb, egyszeri belépő", "Egy résznél havi előfizetés, máshol egyszeri díj"],
            ["Kereskedési idő", "Vasárnap estétől péntek estig, szinte folyamatos", "Közel 23 órás elektronikus kereskedés, napi rövid szünettel"],
            ["Instrumentumok", "Devizapárok, sok cégnél index- és árupiaci CFD", "Index-, árupiaci, kötvény- és devizafutures"],
            ["Adat", "A volumen és a könyv a szolgáltató adatforrásától függ", "Központi tőzsdei könyv és kötésadat"],
            ["Tanulási görbe", "Pip és lot számítása", "Kontraktusspecifikáció, tickérték"],
            ["Szabályozói háttér", "A prop cég jellemzően nem szabályozott bróker", "A tőzsde szabályozott, a prop cég jellemzően itt sem"]
          ]
        },
        body: [
          "Az utolsó sort neked kell hozzáírnod: mi érdekel jobban, a makrohírek és a devizapárok dinamikája, vagy konkrét indexek és árupiacok mozgása?"
        ]
      },
      {
        title: "Az adat is szempont",
        body: [
          "A spot devizapiacon nincs egyetlen teljes, globális megbízási könyv. A forex „tick volume” gyakran az árfrissítések számát jelenti, nem a kötött mennyiséget. Tőzsdei futuresnél az adott tőzsde központi könyvét és kötéseit látod.",
          "Ha a 4. modul orderflow-eszközeit (delta, footprint, profil) komolyan akarod tanulni, ez a futures mellett szól. Ha az ár és a struktúra elég neked, a forex is működő terep."
        ]
      },
      {
        title: "A saját időd",
        body: [
          "A futures fő kereskedési sávja magyar idő szerint délután és este van, ami sokszor jobban illik iskola vagy munka mellé, mint egy szinte folyamatosan nyitva lévő piac állandó kimaradástól való félelme. Nézz meg 3–3 chartot mindkét piactípusból, és figyeld meg, melyiken tudod könnyebben követni, mi történik."
        ]
      }
    ],
    mistakes: [
      "Kizárólag a challenge díja alapján dönteni.",
      "Mindkét piacot egyszerre tanulni.",
      "A saját időbeosztást és érdeklődést kihagyni a mérlegelésből."
    ],
    check: [
      { q: "Mit jelent gyakran a „volume” egy spot forex charton?", a: "Az árfrissítések számát a szolgáltató adatforrásában, nem a teljes devizapiac kötött mennyiségét." },
      { q: "Mi a hónap végi mérföldkő?", a: "Egy irányadó döntés (forex vagy futures), és két-három mondat arról, miért ezt választottad." }
    ]
  }
};
