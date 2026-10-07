// 04 · Stratégia és orderflow: a leckék részletes törzsanyaga.
export default {
  "setup-trigger": {
    sections: [
      {
        title: "Megfigyelésből modell",
        body: [
          "Az „abszorpciót látok a VAL-nál” értelmezés, nem stratégia. Modell akkor lesz belőle, ha megadod a piacot, az adatot, a helyszínt, a konkrét belépési feltételt, a végrehajtás módját, a stopot, a kilépést és a kizáró körülményeket.",
          "A próba egyszerű: **egy másik ember ugyanazon a charton, ugyanabban a pillanatban ugyanazt a döntést hozná?** Ha az abszorpciót egyszer nagy deltának, máskor nagy volumennek, harmadszor hosszú kanócnak nevezed, az eredményeidet nem tudod egy mintaként értékelni."
        ]
      },
      {
        title: "A három fogalom",
        list: [
          "**Setup:** a környezet és a helyszín, ahol egyáltalán figyelsz.",
          "**Trigger:** a konkrét, megfigyelhető esemény, amely engedi a belépést.",
          "**Invalidation:** az előre megnevezett megfigyelés, amely megcáfolja az ötletet."
        ],
        body: [
          "A negyedik, amit a legtöbben kihagynak: a **no-trade feltétel**. Mikor nem kereskedsz? Nagy hír előtt és után, alacsony likviditású sávban, vagy ha a kockázat túl nagy a kerethez."
        ]
      },
      {
        title: "Egy kezdeti kutatási modell",
        intro: [
          "A jegyzeted mintamodellje a tartomány alja alatti sikertelen vizsgálatot teszi gyakorolhatóvá. A paraméterek oktatási választások, nem optimalizált ajánlások."
        ],
        list: [
          "Egy instrumentum, egy session, egyperces gyertyák. Referencia: az előző befejezett session VAL-ja.",
          "Csak akkor figyelsz, ha az ár a VAL alá kerül, előre megadott maximális távolságon belül.",
          "A vizsgálat ablakában negatív delta kell, a piacra szabott, előre rögzített küszöbbel. Ez még nem belépés.",
          "Várj egy lezárt gyertyára, amely a VAL fölött zár.",
          "A következő legfeljebb három gyertyában legyen visszateszt új mélypont nélkül, majd egy zárás az előző gyertya csúcsa fölött. Vétel a következő elérhető askon.",
          "Stop: a vizsgálati mélypont alatt egy tick. Cél: 2R.",
          "Nincs kötés, ha nincs visszateszt, új mélypont jön, vagy a kockázat túl nagy."
        ]
      },
      {
        title: "Egyszerre egy változtatás",
        body: [
          "Ha két szabályt módosítasz egyszerre, nem tudod, melyik okozta az eltérést. Minden változtatás új modellverzió: saját azonosítóval, és az eredményeit ne vond össze az előzőével.",
          "A footprint eleinte az értelmezést segíti. Szűrőként csak új verzióban add hozzá, és új adaton ellenőrizd."
        ]
      }
    ],
    mistakes: [
      "Öt megközelítést kombinálni egyetlen „stratégiában”.",
      "A triggert úgy megfogalmazni, hogy utólag bármire ráillik.",
      "Kihagyni a no-trade feltételt."
    ],
    check: [
      { q: "Mi a különbség a setup és a trigger között?", a: "A setup a környezet, ahol figyelsz. A trigger az a konkrét esemény, amelynél ténylegesen belépsz." },
      { q: "Miért kell verziószám a szabályrendszernek?", a: "Hogy az egyes változtatások hatása külön mérhető legyen, és ne keveredjenek a különböző szabályok eredményei." }
    ]
  },

  "backtest": {
    sections: [
      {
        title: "A kézi backteszt módszere",
        body: [
          "Replay funkcióval visszamész 6–12 hónapot, és gyertyáról gyertyára játszod le a piacot úgy, hogy a jövőt nem látod. Minden kötésnél rögzíted a dátumot, az irányt, a belépőt, a stopot, a célt és az eredményt R-ben.",
          "A perces visszajátszás mélysége a platform csomagjától függhet. Ha ez korlátoz, napi vagy négyórás idősíkon is elkezdheted a mintafelismerést."
        ]
      },
      {
        title: "Három torzítás",
        list: [
          "**Look-ahead bias:** olyan információt használsz, amely a döntéskor még nem létezett. Tipikus példa a session végső POC-ja egy délelőtti belépéshez.",
          "**Overfitting:** a szabály túl jól illeszkedik a múlthoz, de új adaton nem működik.",
          "**Válogatás:** tudat alatt a szép példákat veszed fel, a csúnyákat kihagyod."
        ],
        body: [
          "Mindhárom ellen ugyanaz véd: előre leírt, egyértelmű szabály, és az, hogy minden jogosult helyzet bekerül a mintába."
        ]
      },
      {
        title: "Mennyi minta kell",
        body: [
          "20–30 kötésből semmit nem lehet biztosan megállapítani, ez pusztán a szórás miatt van így. Az első érdemi képhez **legalább 100** szabály szerinti kötés kell.",
          "Egy napon belül keletkező sok hasonló helyzet közös környezetből származik, ezért nem számít sok független megfigyelésnek. Gyűjts különböző napokat és többféle piaci állapotot."
        ]
      },
      {
        title: "Fejlesztő és ellenőrző minta",
        body: [
          "Amelyik időszakon kitaláltad a szabályt, azon nem tudod ellenőrizni. Tarts félre egy korábban nem látott időszakot (out of sample), és azon futtasd le változtatás nélkül.",
          "A vesztes és a kimaradt példák ugyanolyan értékesek, mint a nyerők. Külön gyűjtsd azokat a helyzeteket is, ahol az ár a várt irányba ment, de a belépési feltételed nem alakult ki: ezek nem nyerő kötések."
        ]
      }
    ],
    mistakes: [
      "A backtesztet „megnyerni akarni”.",
      "Szabályt módosítani a sorozat közepén.",
      "Száz utólag kiválasztott nyerő képernyőképet bizonyítéknak tekinteni."
    ],
    check: [
      { q: "Mi a look-ahead bias egy profilos replayben?", a: "A session végső POC-jának vagy value areájának használata egy olyan döntéshez, amikor az még nem volt ismert." },
      { q: "Miért nem számít száz kötésnek száz jel ugyanarról a két napról?", a: "Mert közös piaci környezetből származnak, így nem független megfigyelések." }
    ]
  },

  "naplo-rendszer": {
    sections: [
      {
        title: "Mit rögzíts minden kötésnél",
        table: {
          head: ["Mező", "Mit írj bele"],
          rows: [
            ["Azonosítás", "Dátum, instrumentum, lejárat, session, időzóna"],
            ["Modellverzió", "A használt szabályrendszer azonosítója"],
            ["Környezet és helyszín", "Tartomány, trend vagy bizonytalan; az előre kijelölt szint és indoka"],
            ["Megfigyelés", "Kötések, könyv és árreakció tényszerűen"],
            ["Hipotézis", "Milyen folytatást vizsgáltál"],
            ["Érvénytelenítés", "Mi cáfolta volna"],
            ["Végrehajtás", "Tervezett és tényleges belépő, stop, cél, méret"],
            ["Eredmény", "Bruttó és nettó R, költség"],
            ["Érzelmi állapot", "Egy szó vagy mondat belépés előtt és után"],
            ["Bizonyíték", "Képernyőkép a döntés előtt és után"]
          ]
        },
        body: [
          "Az eszköz mindegy: táblázat, jegyzetalkalmazás vagy ennek az oldalnak a Napló nézete. A lényeg, hogy **minden** kötés bekerül, a köztes, „se ilyen, se olyan” esetek is."
        ]
      },
      {
        title: "Tény és hipotézis külön mondatban",
        body: [
          "Először írd le a megfigyelést szakkifejezések nélkül: „A mélypont közelében sok eladás kötött, de a következő alacsonyabb szintet nem érte el. Utána az ár visszajött a korábbi tartományba.”",
          "Csak ezután tedd hozzá az értelmezést: ez az eladói agresszió lehetséges abszorpciója. Ha a kettő összefolyik, utólag nem tudod megmondani, mit láttál és mit gondoltál."
        ]
      },
      {
        title: "MAE és MFE",
        body: [
          "A **MAE** (Maximum Adverse Excursion) a pozíció alatt a legnagyobb ellened történő elmozdulás, az **MFE** (Maximum Favorable Excursion) a legnagyobb melletted történő. Sok kötés után megmutatják, mennyi teret szokott kérni a setupod, és mennyit hagysz az asztalon.",
          "Ezek tanulmányozásra valók. Nem indokolják, hogy egy-egy példa alapján utólag átírd a stopot vagy a célt."
        ]
      },
      {
        title: "A heti kérdés",
        body: [
          "Minden hét végén először azt számold meg, hány kötésnél tértél el a leírt szabálytól, **akkor is, ha az a kötés nyert**. Ez most fontosabb, mint az egyenleg. A cél a demo szakaszban a legalább 90%-os szabálykövetés.",
          "A demo egyenleget kezeld valódiként. Ha játékpénznek tekinted, a fegyelem gyakorlása értéktelen."
        ]
      }
    ],
    mistakes: [
      "Csak a nyerő és a nagy vesztes kötéseket naplózni.",
      "A megfigyelést és az értelmezést egy mondatba gyúrni.",
      "A MAE alapján kötésenként utólag tágítani a stopot."
    ],
    check: [
      { q: "Mit mér a MAE?", a: "A pozíció nyitva tartása alatti legnagyobb kedvezőtlen elmozdulást." },
      { q: "Miért kell a szabályszegő nyerő kötést is hibának jelölni?", a: "Mert a végrehajtási hiba hiba marad. Ha jutalmazod, a kockázatos szokás rögzül." }
    ]
  },

  "delta-cvd": {
    sections: [
      {
        title: "A delta számítása",
        body: [
          "Valódi bid/ask besorolásnál **delta = askon kötött volumen − biden kötött volumen**. Az askon a vevő, a biden az eladó kezdeményez.",
          "Ha 710 kontraktus kerül az askhoz és 290 a bidhez, az összvolumen 1000, a delta +420, a deltaarány +42%. Ez nem 420 „plusz vevő”: mind az 1000 kontraktusnak volt vevője és eladója is. A +420 azt jelzi, mennyivel volt több a vételi agresszorhoz sorolt mennyiség."
        ]
      },
      {
        title: "Miért nem jóslat az előjel",
        body: [
          "Sokan vesznek agresszíven, de egy passzív eladói oldal folyamatosan kiszolgálja őket. A delta pozitív, az ár mégsem megy feljebb. Ha a vevők lendülete elfogy, az ár eshet.",
          "Máskor kevés agresszív vétel is nagy emelkedést okoz, mert ritka az eladási könyv: a delta kicsi, az árhatás nagy. Egy emelkedő gyertya ráadásul negatív deltával is összefér, ha az elején sok eladás kötött alacsonyabban, majd kisebb vételi forgalom vitte feljebb az árat. Az összesítés eltakarja a sorrendet."
        ]
      },
      {
        title: "A CVD és a kezdőpontja",
        table: {
          head: ["Gyertya", "Delta", "CVD nulláról"],
          rows: [["1", "+120", "+120"], ["2", "−80", "+40"], ["3", "+200", "+240"], ["4", "−50", "+190"]]
        },
        body: [
          "A CVD a kezdőpont óta összegzett delta. Lehet pozitív úgy is, hogy éppen csökken: az utolsó sor ezt mutatja. A szint a felhalmozott különbséget jelzi, a friss változás azt, mi történt most.",
          "A session eleji nullázás megváltoztatja a viszonyítási alapot, ezért eltérő reset vagy eltérő kontraktus CVD-szintjeit közvetlenül összehasonlítani félrevezető."
        ]
      },
      {
        title: "Divergencia",
        body: [
          "Ha az ár új csúcsot ér el, a CVD viszont nem, az eltérő viselkedést jelez. Lehet gyengülő vételi agresszió, de lehet ritkább eladási könyv is, amelyből kevesebbet kell elfogyasztani. A divergencia lehetséges magyarázatokat ad, nem egy biztos okot.",
          "A CVD és a footprint gyakran ugyanannak a kötési adatnak két összesítése. Ha mindkettő ugyanazt mutatja, az nem két független bizonyíték."
        ]
      },
      {
        title: "Három különböző „imbalance”",
        list: [
          "**Trade delta:** a már végrehajtott agresszív mennyiségek különbsége.",
          "**Book imbalance:** a várakozó ajánlatok mennyiségi aránytalansága.",
          "**Order Flow Imbalance (OFI):** kutatási mérőszám, amely a legjobb árszintek ajánlatváltozásait, kötéseit és törléseit is összegzi."
        ]
      }
    ],
    example: {
      title: "A lecke feladata levezetve",
      body: [
        "Bar-delták: +150, −90, −200, +80. A CVD lépésenként 150, 60, −140, −60.",
        "A végső érték −60, az utolsó bar alatt mégis nő, mert annak deltája +80. Amit ebből nem tudsz: hol járt közben az ár, milyen helyszínen történt, és hogyan reagált rá a piac."
      ]
    },
    mistakes: [
      "A pozitív deltát vételi jelnek venni.",
      "A deltát a szereplők számaként értelmezni.",
      "Két platform vagy két session CVD-szintjét közvetlenül összevetni."
    ],
    check: [
      { q: "840 ask és 560 bid mellett mennyi a delta és a deltaarány?", a: "Delta = +280, összvolumen 1400, deltaarány 280 / 1400 = +20%." },
      { q: "Lehet a CVD pozitív és közben csökkenő?", a: "Igen. A szint a kezdőpont óta felhalmozott különbség, a változás az utolsó szakasz deltája." }
    ]
  },

  "footprint": {
    sections: [
      {
        title: "A gyertya belseje",
        diagram: "footprint",
        diagramCaption: "Ugyanez a gyertya footprintként, magasabb árral felül. A kiemelt ask cellák adják a négysoros halmozódást.",
        table: {
          head: ["Ár", "Bid", "Ask", "Sor deltája"],
          rows: [["100,00", "40", "10", "−30"], ["100,25", "60", "180", "+120"], ["100,50", "50", "220", "+170"], ["100,75", "30", "170", "+140"], ["101,00", "20", "100", "+80"], ["101,25", "15", "25", "+10"]]
        },
        body: [
          "A bid × ask footprint árszintenként mutatja, mennyi kötött a biden és az askon. Itt az összvolumen 920, a delta +490, a deltaarány nagyjából +53%. A legnagyobb forgalmú sor a 100,50 (270 kontraktus): ez a gyertya POC-ja.",
          "A táblázat összesítés. Nem bizonyítja, hogy az ár egyszer, folyamatosan ment végig 100-ról 101,25-re: többször is visszatérhetett ugyanarra a sorra. A sorrendhez kötéslista vagy megfelelő replay kell. Az oszlopok sorrendjét és a színezést mindig a platform jelmagyarázatából ellenőrizd."
        ]
      },
      {
        title: "Átlós imbalance és halmozódás",
        body: [
          "A gyakori számítás az adott ár ask mennyiségét az **eggyel alacsonyabb** sor bid mennyiségével veti össze. A példában 180 / 40 = 4,5, majd 220 / 60 ≈ 3,67, 170 / 50 = 3,4 és 100 / 30 ≈ 3,33. Négy egymást követő sor teljesíti a 3:1 küszöböt: ez **stacked imbalance**. A 101,25-ös sor (25 / 20 = 1,25) már nem.",
          "Az arány önmagában kevés. A 3:1 három és egy kontraktusból is kijön, ezért kell minimális mennyiségi szűrő, amelyet a saját piacodhoz igazítasz."
        ]
      },
      {
        title: "Abszorpció",
        body: [
          "Abszorpciónál a passzív ellenoldal jelentős agresszív forgalmat vesz fel, miközben az ár alig halad tovább az agresszió irányába. Mindig a teljes folyamatot írd le: „agresszív eladást vesz fel a passzív vevő”, vagy „agresszív vételt vesz fel a passzív eladó”. A rövid elnevezések forrásonként mást jelentenek.",
          "Egy nagy negatív delta a mélyponton még kevés. Ha rövid megállás után újabb mélypontok jönnek, a passzív vevő csak átmenetileg tartott. Az abszorpció megfigyelése nem jelent automatikusan fordulót."
        ]
      },
      {
        title: "Kifáradás",
        body: [
          "A kifáradás az agresszív folytatás gyengülése: egymást követő próbálkozásoknál egyre kevesebb új agresszív kötés érkezik, és az ár sem jut tovább. Abszorpciónál erős az ellenoldal, kifáradásnál elfogy az utánpótlás. A kettő együtt is előfordul.",
          "A szélső soron látott kis volumen lehet egyszerűen rövid vizsgálat vagy durva felbontás következménye. Kifáradást ismétlődő folyamatként, a szokásos aktivitáshoz mérve érdemes vizsgálni."
        ]
      },
      {
        title: "A gyertyaképzés is beállítás",
        body: [
          "Időgyertya, volume bar, range bar, tick bar: ugyanazokból a kötésekből más-más footprint-minta rajzolódik ki. Egy modellen belül rögzítsd előre a típust és a paramétert, és ne váltogasd addig, amíg a jel szebbnek tűnik."
        ]
      }
    ],
    mistakes: [
      "A nagy összvolumenű, kis gyertyát biztos abszorpciónak nevezni.",
      "Az imbalance arányát mennyiségi szűrő nélkül használni.",
      "Replayben a már látott fordulat alapján minden korábbi nagy sort abszorpciónak címkézni."
    ],
    check: [
      { q: "100,50 askja 180, 100,25 bidje 45. Mekkora az átlós arány, és mit kell még ellenőrizni?", a: "180 / 45 = 4:1, teljesíti a 3:1 küszöböt. Ellenőrizni kell a minimum mennyiséget, a besorolást, a helyszínt és az ár reakcióját." },
      { q: "Mi erősíti az abszorpciós elképzelést?", a: "Ha egy konkrét helyen ismétlődik az azonos irányú agresszió, az ár mégsem jut tovább, majd el tud indulni az ellenkező irányba, és a következő próbálkozás is kudarcot vall." }
    ]
  },

  "csapdak": {
    sections: [
      {
        title: "Sikertelen kitörés és beszorult kereskedők",
        body: [
          "**Sikertelen kitörés (failed breakout):** az ár új területre jut, de nem alakul ki ott tartós kereskedés, és visszatér a korábbi tartományba. A **beszorult kereskedők** azok feltételezett csoportja, akik a folytatásra léptek be, és az ellenkező mozgás kedvezőtlen helyzetbe hozta őket.",
          "Felső kitörésnél megjelennek az agresszív vételek. Ha az ár visszaesik, egyes vevők eladással zárnak, ami ráerősíthet az esésre. A kötésekből azonban nem azonosítható biztosan, kik és milyen pozíciót zárnak. A „csapda” egy megfigyelt árfolyamat értelmezése, nem tény."
        ]
      },
      {
        title: "Stopok kisöprése",
        body: [
          "A **sweep** több árszint gyors végigjárása, az ottani ajánlatok gyors elfogyasztása. Egy korábbi csúcs vagy mélypont körül aktiválódó stopok hozzájárulhatnak, de a szokásos DOM nem mutatja az összes stop helyét és méretét.",
          "Egy csúcs fölé szúrás után két folytatás lehetséges: az ár ott marad és új tartományt épít, vagy visszaesik a régibe. A csúcs átlépése nem mondja meg, melyik jön. A későbbi elfogadás vagy elutasítás ad információt."
        ]
      },
      {
        title: "A könyv jelenségei",
        list: [
          "**Stacking:** látható ajánlatok felépülése egy szinten.",
          "**Pulling:** ajánlatok visszavonása. Ha a kínálat eltűnik, kevesebb vétel is feljebb mozdítja az árat.",
          "**Iceberg:** a teljes mennyiségnek csak egy része látszik, és teljesülés után újratöltődik.",
          "**Spoofing:** megtévesztő, végrehajtás előtti törlés szándékával beadott ajánlatokhoz kapcsolódó, tiltott magatartás."
        ],
        body: [
          "A visszavonás lehet normális kockázatkezelés. A részleges megjelenítés önmagában nem spoofing. A szándékot és a viselkedésmintát a saját grafikonodból nem tudod bizonyítani: amit biztosan látsz, az annyi, hogy egy ajánlat megjelent és eltűnt."
        ]
      },
      {
        title: "Befejezett és befejezetlen aukció",
        body: [
          "Egyes footprint-módszerek a gyertya szélső sorának kötésmintáját nevezik így, például azt, hogy a szélső soron mindkét oldalhoz tartozik-e kötés. Ebből nem következik kötelező későbbi visszatérés, és a minta függ a platform besorolásától meg az ársor méretétől."
        ]
      }
    ],
    example: {
      title: "Sikertelen felső kitörés",
      body: [
        "Az előző session VAH-ja 104,00. Az ár 104,75-ig emelkedik, a kitörési területen sok ask kötés jelenik meg, majd az ár visszakerül 104 alá. Egy későbbi visszateszt 104 körül nem tudja visszavinni a piacot a magasabb sávba.",
        "Szemléltető short terv: belépő 104,00, stop 105,00, cél 102,00, vagyis 2R költségek előtt. Ha az ár újra 104 fölött folytatja a kereskedést, az elutasítási elképzelés gyengül. A visszateszt szabályát előre meg kell adni."
      ]
    },
    mistakes: [
      "Minden kanócot stopvadászatnak nevezni.",
      "Egy törölt nagy ajánlatból manipulációra következtetni.",
      "A kitörést az átlépés pillanatában eldöntöttnek venni, visszateszt nélkül."
    ],
    check: [
      { q: "Mi dönti el egy csúcs átlépése után, hogy kitörés vagy sweep történt?", a: "A későbbi viselkedés: kialakul-e tartós kereskedés az új területen (elfogadás), vagy az ár visszatér a régi tartományba (elutasítás)." },
      { q: "Mit bizonyít egy újratöltődő ajánlat?", a: "Önmagában semmit. Lehet iceberg, de több résztvevő új ajánlatai is ugyanilyen képet adnak." }
    ]
  },

  "osszekapcsolas": {
    sections: [
      {
        title: "A gondolatmenet sorrendje",
        list: [
          "**Környezet:** tartomány közepe, széle, vagy új terület keresése? Hol volt koncentráció az előző és a mostani profilban?",
          "**Helyszín:** hol történik a megfigyelés? Egy nagy delta a tartomány közepén más helyzet, mint egy korábbi mélypont alatt.",
          "**Friss esemény:** ki köt agresszíven, és halad-e az ár abba az irányba?",
          "**Reakció:** megmarad-e az elért ársáv? Mi cáfolná az elképzelésedet?",
          "Csak ezután jön a végrehajtható belépő, az érvénytelenítés helye és a kockázat."
        ]
      },
      {
        title: "Négyféle ár és delta kapcsolat",
        table: {
          head: ["Az ár", "A delta", "Első vizsgálati kérdés"],
          rows: [
            ["Emelkedik", "Pozitív", "Tartósan eredményes-e az agresszív vétel"],
            ["Stagnál vagy visszaesik", "Erősen pozitív", "Hol fogadja a passzív eladó a vételeket"],
            ["Esik", "Negatív", "Tartósan eredményes-e az agresszív eladás"],
            ["Stagnál vagy emelkedik", "Erősen negatív", "Hol fogadja a passzív vevő az eladásokat"]
          ]
        },
        body: [
          "A sorok vizsgálati kiindulópontok, nem belépési jelek."
        ]
      },
      {
        title: "A bizonyítékok súlya",
        body: [
          "Ugyanaz a vételi forgalom megjelenik a pozitív deltában, az emelkedő CVD-ben és a vételi footprint-imbalance-ben is. Ha ezt három megerősítésnek számolod, ugyanazt az információt értékeled háromszor.",
          "Hasznosabb négy külön kérdésre bontani: mit mond a helyszín, mit a végrehajtott kötések, mit a várakozó ajánlatok, és mit a későbbi árreakció. Ha valahol találkoztál a BOS, CHoCH vagy FVG szavakkal, kezeld őket előre definiált árminták neveként: egy FVG nem bizonyítja, milyen szereplő van jelen."
        ]
      },
      {
        title: "1. helyzet: abszorpció a tartomány alján",
        body: [
          "Az előző session VAL-ja 100,00, POC-ja 102,00, VAH-ja 104,00. Az ár 99,75-re kerül. A mélypont körül 900 bid és 250 ask kontraktus köt: delta −650. Ennyi eladás mellett az ár nem éri el a 99,50-et. Ez felveti, hogy passzív vevők fogadják az eladásokat, de még csak gyanú.",
          "Az ár visszatér 100 fölé, egy visszateszt nem hoz új mélypontot, majd 100,50-re emelkedik. Szemléltető long terv: belépő 100,50, stop 99,50, cél 102,50, vagyis 2R költségek előtt. Ha az ár újra 100 alá kerül és ott kereskedik, a fordulós elképzelés gyengül."
        ]
      },
      {
        title: "2. helyzet: kitörés és folytatás",
        body: [
          "Az ár többször teszteli a 104,00-s VAH-t, majd fölé kerül, a magasabb sávban további kötések keletkeznek, és nem tér vissza tartósan 104 alá. A visszahúzódás 104,25-ig jut negatív deltával, de nem alakul ki tartós esés. Itt a negatív delta a visszahúzódás része, nem short jel.",
          "Oktatási long terv: belépő 104,75, stop 103,75, cél 106,75. A hipotézis az új sáv elfogadása. Különítsd el attól az esettől, amikor egyetlen gyertya felnyúlik 104 fölé, és azonnal visszaesik."
        ]
      },
      {
        title: "3. helyzet: amikor nincs értelmes belépő",
        body: [
          "Az ár 102 körül mozog, a korábbi value area közepén. A gyertyák deltája váltakozik, a CVD lapos, mindkét irányban rövid imbalance-ek jelennek meg, és minden próbálkozás visszatér középre.",
          "A sok adat itt nem jelent lehetőséget: nincs elkülöníthető helyszín, értelmes érvénytelenítési pont és a költségeket meghaladó várható elmozdulás. A megfigyelést naplózd, a modell pedig engedje a kivárást. A sikertelen felső kitörést, a negyedik helyzetet az előző leckében találod."
        ]
      }
    ],
    mistakes: [
      "A deltát, a CVD-t és az imbalance-t három független megerősítésnek venni.",
      "Minden gyertyához utólag történetet keresni.",
      "A kivárást elszalasztott lehetőségként könyvelni."
    ],
    check: [
      { q: "Az ár stagnál, a delta erősen pozitív. Mi az első kérdés?", a: "Hol és ki fogadja a vételeket: van-e passzív eladói oldal, amely felveszi az agressziót, és mi történik utána." },
      { q: "Miért elfogadható kimenet a kivárás?", a: "Mert a modell előre meghatározott helyzeteket keres. Ha a helyszín, az érvénytelenítés vagy a várható elmozdulás hiányzik, a szabályos döntés a nem kötés." }
    ]
  }
};
