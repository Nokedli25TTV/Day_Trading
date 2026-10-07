// 03 · Kockázat és prop szabályok: a leckék részletes törzsanyaga.
window.TRADECRAFT_CONTENT = Object.assign(window.TRADECRAFT_CONTENT || {}, {
  "r-nyelve": {
    sections: [
      {
        title: "Mi az 1R",
        body: [
          "Az **1R** egy ügylet előre meghatározott kezdeti kockázata. Ha a belépő és a stop között 1 pont a távolság, és a cél 2 pontra van, a terv 2R. Így egy MES és egy EUR/USD kötés, egy kicsi és egy nagy pozíció is összehasonlíthatóvá válik.",
          "Az R a döntés minőségét méri, nem a pénzt. Egy +2R-es kötés ugyanannyit ér a statisztikádban 10 dolláros és 100 dolláros kockázatnál."
        ]
      },
      {
        title: "Bruttó és nettó R",
        body: [
          "Rögzítsd a naplóban, mi az R nevezője: csak a kezdeti árkockázat, vagy a teljes költségkeret. Ha az árkockázat a nevező, és a költséget külön vonod le, akkor egy stopos kötés nettó eredménye **rosszabb lehet −1R-nél**.",
          "A −1R ráadásul csak akkor marad −1R, ha a végrehajtás és a fegyelem nem rontja. Egy elcsúszott stop vagy egy „még várok egy kicsit” döntés −1,4R-t csinál belőle."
        ]
      },
      {
        title: "Miért jobb, mint a pénzben számolás",
        body: [
          "Pénzben nézve egy nagy pozíció nyeresége eltakarja tíz kisebb kötés tanulságát. R-ben minden kötés egyforma súlyú megfigyelés, így látszik, hogy a setupod működik-e, vagy csak a méreted volt szerencsés.",
          "Az átlag mellett a szóródást is nézd: két stratégia átlaga lehet ugyanúgy +0,2R, miközben az egyik egyenletes, a másik három nagy nyerőn múlik."
        ]
      }
    ],
    example: {
      title: "Három kötés R-ben",
      table: {
        head: ["Kockázat", "Eredmény", "Költség", "Nettó R"],
        rows: [["10 USD", "+20 USD", "2 USD", "+1,8R"], ["10 USD", "−10 USD", "2 USD", "−1,2R"], ["25 USD", "+15 USD", "2 USD", "+0,52R"]]
      },
      body: [
        "Az átlag (1,8 − 1,2 + 0,52) / 3 ≈ +0,37R. Pénzben a harmadik kötés tűnik a legnagyobbnak, R-ben a leggyengébb nyerő."
      ]
    },
    mistakes: [
      "A stopot utólag tágítani, és az eredeti R-rel számolni tovább.",
      "A költséget kihagyni, és bruttó R-ből következtetni.",
      "Csak az átlagot nézni, a szóródást nem."
    ],
    check: [
      { q: "Lehet egy stopos kötés −1R-nél rosszabb?", a: "Igen. A jutalék és a slippage hozzáadódik, így a nettó eredmény például −1,2R." },
      { q: "Mit ér el az R-ben számolás?", a: "Különböző piacok és pozícióméretek kötései egyforma súlyú megfigyelésként hasonlíthatók össze." }
    ]
  },

  "poziciomeretezes": {
    sections: [
      {
        title: "Az alapképlet",
        body: [
          "A méret a kockázatból jön, nem fordítva. **Mennyiség = egészrész [ kockázatkeret / egy egység becsült kockázata ].**",
          "A kockázatkeret a számlaérték és a kötésenkénti kockázati százalék szorzata. Egy egység kockázata a stop távolsága tickben, szorozva a tickértékkel, plusz a becsült költség. Mindig lefelé kerekítesz. Ha az eredmény nulla, a legkisebb mennyiség is túl nagy ehhez a kerethez, vagyis nincs kötés."
        ]
      },
      {
        title: "Miért 0,5–1% kötésenként",
        body: [
          "Egy prop számla napi és teljes veszteséglimitje jellemzően 4–10% körül van. Egy 5–10 kötésből álló vesztes sorozat 50%-os találati arány mellett is simán előfordul. 1%-os kockázattal ez 5–10% visszaesés, ami már a limit közelében jár; 0,5%-kal még bőven van mozgástér.",
          "A kis kockázat nem gyávaság. Azt biztosítja, hogy a statisztikád kifuthassa magát, mielőtt a szabályok megállítanak."
        ]
      },
      {
        title: "A méret, a margin és az engedély három külön dolog",
        body: [
          "Attól, hogy a margin enged tíz kontraktust, a kockázatkereted még lehet, hogy csak egyet. A számla kereskedési szabályai (maximális kontraktusszám, napi limit) pedig külön feltételt jelentenek. Mindháromnak teljesülnie kell.",
          "Építs egy egyszerű táblázatot, amely a számlaméretből, a kockázati százalékból és a stoptávolságból kiadja a méretet, vagy használd a Gyakorlás nézet Kockázati laborját."
        ]
      }
    ],
    example: {
      title: "MES, 8 tickes stop",
      body: [
        "A MES tickértéke 1,25 USD. A 8 tickes stop árkockázata 8 × 1,25 = 10 USD kontraktusonként. A példa kitalált oda-vissza jutaléka 2 USD, a kedvezőtlen végrehajtásra szánt tartalék 1 tick, azaz 1,25 USD. Egy kontraktus becsült kerete 13,25 USD.",
        "25 USD kockázatkerettel 25 / 13,25 ≈ 1,89, lefelé kerekítve **1 kontraktus**. Kettő már 26,50 USD lenne. A jutalék és a tartalék itt feltételezés, nem árajánlat és nem a maximális veszteség garanciája."
      ]
    },
    mistakes: [
      "A méretet a kívánt profitból vagy a megérzésből indítani.",
      "Felfelé kerekíteni, „mert majdnem belefér”.",
      "A költséget és a slippage-tartalékot kihagyni az egységkockázatból."
    ],
    check: [
      { q: "Mit teszel, ha a képlet nullát ad?", a: "Nem kötsz. A legkisebb mennyiség is több kockázat, mint amennyit a kereted enged." },
      { q: "Tickérték 2, stop 7 tick, jutalék 3, tartalék 1 tick, keret 50. Mennyi a méret?", a: "Egy egység kerete 14 + 3 + 2 = 19. Az 50 / 19 lefelé kerekítve 2 egység." }
    ]
  },

  "expectancy": {
    sections: [
      {
        title: "A képlet",
        body: [
          "**Várható érték = nyerési arány × átlagos nyerő − veszteségi arány × átlagos vesztes − átlagos költség.**",
          "A találati arány önmagában semmit nem mond arról, keres-e a modell. Egy 70%-ban nyerő stratégia veszteséges, ha a vesztesek háromszor akkorák, mint a nyerők. Egy 35%-os lehet nyereséges, ha a nyerők elég nagyok."
        ]
      },
      {
        title: "A költség fordít az előjelen",
        body: [
          "40% nyerési arány, 1,8R átlagnyerő, 1R átlagvesztes: költség előtt 0,40 × 1,8 − 0,60 × 1 = +0,12R. Ha a költség átlagosan 0,15R, az eredmény −0,03R.",
          "A kis elméleti előnyt a jutalék, a spread és a slippage eltünteti. Rövid távú kereskedésnél, ahol a stop néhány tick, ez különösen erős hatás."
        ]
      },
      {
        title: "Nullszaldós találati arány",
        body: [
          "Állandó átlagértékek mellett a nullszaldóhoz szükséges nyerési arány (átlagvesztes + költség) / (átlagnyerő + átlagvesztes). A fenti példában (1 + 0,15) / (1,8 + 1) ≈ 41,1%.",
          "Ez számolási összefüggés, nem előrejelzés. A következő száz kötésed találati aránya ettől bármerre eltérhet, ezért kell elég nagy minta, mielőtt bármit elhiszel a saját számaidnak."
        ]
      },
      {
        title: "Jó döntés, rossz eredmény",
        body: [
          "Egy szabályos kötés veszthet, egy szabálytalan nyerhet. Ha minden veszteség után módosítasz, a véletlen ingadozást fogod szabállyá tenni. Ha minden nyerőből jó döntésre következtetsz, a kockázatos szokásaidat jutalmazod.",
          "Ezért a napi és heti értékelésben külön tartsd nyilván a nettó eredményt, a szabálykövetést, a végrehajtási hibát és az adatproblémát."
        ]
      }
    ],
    example: {
      title: "A lecke feladata levezetve",
      body: [
        "42% nyerési arány, +2,1R átlagnyerő, 1R átlagvesztes: 0,42 × 2,1 − 0,58 × 1 = 0,882 − 0,58 = +0,302R költség előtt.",
        "0,10R átlagköltséggel +0,202R marad. Próbáld ki más értékekkel a Kockázati laborban."
      ]
    },
    mistakes: [
      "A magas találati arányt nyereségességnek venni.",
      "A költséget „majd később” beszámítani.",
      "20–30 kötésből várható értéket számolni és elhinni."
    ],
    check: [
      { q: "Mennyi a várható érték 45% nyerés, 1,6R nyerő, 1R vesztes és 0,10R költség mellett?", a: "0,45 × 1,6 − 0,55 × 1 − 0,10 = +0,07R." },
      { q: "Miért nem elég a pozitív várható érték egy kis mintán?", a: "Mert a szórás miatt egy kis minta találati aránya messze eshet a valóditól. Legalább száz körüli, előre rögzített szabály szerinti kötés kell az első érdemi képhez." }
    ]
  },

  "drawdown": {
    sections: [
      {
        title: "A típus legalább annyit számít, mint a mérték",
        table: {
          head: ["Típus", "Hogyan mozog a küszöb", "Következmény"],
          rows: [
            ["Statikus", "A kezdő egyenleghez rögzített, nem mozdul", "A profit nem szűkíti a mozgásteret"],
            ["Nap végi (EOD) trailing", "Csak a napi záró egyenleghez igazodik felfelé", "A napközbeni csúcs nem húzza fel azonnal"],
            ["Intraday trailing", "Valós időben követi a legmagasabb elért értéket, a nem realizált csúcsot is", "Egy visszaforduló papírprofit is elveszi a mozgásteret"]
          ]
        },
        body: [
          "A marketingoldalon mindhárom ugyanúgy „max drawdown”-ként szerepelhet. A jegyzeted szerint 2026-ban több futures-prop cégnél választható lett, hogy nap végi vagy intraday trailing érvényes: ugyanaz a számlaméret így egészen más kockázati profilt jelent."
        ]
      },
      {
        title: "Miért csapda az intraday trailing",
        body: [
          "Nyitott pozíción átmenetileg 800 USD papírprofitod van. Az intraday küszöb azonnal 800-zal feljebb ugrik. Ha a piac visszafordul, és a nyereséged 200-ra olvad, a küszöb fent marad: 600 USD mozgásteret veszítettél egy olyan kötésen, amely nyereséggel zárt.",
          "Nap végi trailingnél ugyanez a nap csak a záró egyenleg szerint mozdítaná a küszöböt. Ezt a különbséget egy kezdő gyakran csak akkor veszi észre, amikor elfogyott a mozgástere."
        ]
      },
      {
        title: "A saját stopod legyen szigorúbb",
        body: [
          "A cég napi limitje bukási határ. A saját napi stopod ennél lejjebb legyen, hogy egy rossz végrehajtás vagy csúszás se vigyen át rajta. Tanulási szabályként használhatsz például 2R napi limitet.",
          "A kötés stopja, a saját napi limited és a cég számlaszabálya három különböző fogalom. Mindegyiket külön írd le. Ne feltételezd, hogy két cég azonos nevű szabálya azonos számítást jelent: mindig a cég saját, aktuális szabályzatát olvasd."
        ]
      }
    ],
    example: {
      title: "Rajzold le",
      body: [
        "Vegyél egy ötnapos, kitalált egyenleggörbét napközbeni csúcsokkal. Rajzold rá mindhárom drawdown-típus küszöbét ugyanarra az ábrára.",
        "Látni fogod, hogy a statikus vonal vízszintes, a nap végi lépcsőzetesen emelkedik, az intraday pedig minden csúcsot követ, és a legszűkebb sávot hagyja."
      ]
    },
    mistakes: [
      "Csak a profitcélt és a százalékot nézni, a típust nem.",
      "A cég bukási határát saját napi stopként használni.",
      "Összehasonlító blogból venni a szabályt a cég saját oldala helyett."
    ],
    check: [
      { q: "Miért „eszik” több mozgásteret az intraday trailing ugyanazon a napon?", a: "Mert a nyitott pozíció átmeneti csúcsát is követi, így a küszöb akkor is feljebb marad, ha a profit később visszaolvad." },
      { q: "Mi a különbség a saját napi stop és a cég napi limitje között?", a: "A cégé bukási határ. A sajátod szigorúbb fegyelmi keret, amely még a határ előtt megállít." }
    ]
  },

  "consistency-szabalykonyv": {
    sections: [
      {
        title: "Mit korlátoz a consistency rule",
        body: [
          "A konzisztencia-szabály azt mondja ki, hogy egyetlen nyereséges nap nem tehet ki túl nagy részt a teljes profitból. A cég így szűri ki azt, aki egy túlkockáztatott kötéssel „lövi be” a célt, majd defenzíven kivár.",
          "A jegyzeted 2026 közepi kutatása 30 és 50% közötti küszöböket talált, és olyan esetet is, ahol ugyanaz a cég egyik évről a másikra változtatott rajta. Van, ahol csak az egyik fázisra érvényes, máshol mindkettőre."
        ]
      },
      {
        title: "Kemény vagy puha szabály",
        body: [
          "Egyes cégeknél a megszegés nem azonnali bukás, csak megnöveli a szükséges teljes profitot. Másutt kemény feltétel. Ezt a marketingoldal ritkán írja ki világosan.",
          "A szabály egyébként a te érdekedet is szolgálja: ha a profitod nagy része egy napból jön, az inkább szerencse, mint ismételhető folyamat."
        ]
      },
      {
        title: "Az egyoldalas szabálykönyv",
        intro: [
          "A limit ismerete kevés. Azt kell előre leírni, **mi történik, amikor eléred**. Nyugodt állapotban, saját szavakkal, egy oldalon:"
        ],
        list: [
          "Kockázat kötésenként (százalékban és R-ben).",
          "Napi maximális veszteség, és a teendő: például „aznap nem nyitok több pozíciót, bezárom a platformot”.",
          "Heti stop és a kötelező szünet hossza.",
          "Maximális kötésszám naponta.",
          "A választott cégtípus consistency tartománya és drawdown-típusa, forrással és dátummal."
        ]
      },
      {
        title: "Miért ez a hónap legfontosabb terméke",
        body: [
          "A jegyzeted által idézett 2024-es, több mint 300 000 számlát vizsgáló elemzés szerint a jelentkezők nagyjából 14%-a jutott át a kiértékelésen, és körülbelül 7%-a ért el valaha kifizetést. A bukás oka a legtöbbször nem a stratégia, hanem a kockázati szabályok be nem tartása.",
          "A szabálykönyv akkor jó, ha a három legfontosabb pontját fejből fel tudod mondani."
        ]
      }
    ],
    example: {
      title: "Számold ki a legjobb napod arányát",
      body: [
        "A profitcél 3000 USD, a küszöb 40%. Egyetlen nap legfeljebb 1200 USD-t adhat a teljesítésbe.",
        "Ha egy napon 1800 USD-t nyersz, akkor puha szabálynál a szükséges teljes profit 1800 / 0,40 = 4500 USD-re nő, kemény szabálynál a kiértékelés elbukhat."
      ]
    },
    mistakes: [
      "A consistency rule-t a marketingoldalról megismerni a szabályzat helyett.",
      "A napi limitet ismerni, de teendőt nem rendelni hozzá.",
      "A szabálykönyvet a cég szabályainak másolataként megírni, saját fegyelmi pontok nélkül."
    ],
    check: [
      { q: "Mi a cég célja a consistency rule-lal?", a: "Kiszűrni azt, aki egyetlen nagy, túlkockáztatott nappal teljesíti a célt, ismételhető folyamat nélkül." },
      { q: "Mi hiányzik abból a szabályból, hogy „a napi limitem 2R”?", a: "A teendő. Mi történik, amikor eléred: zárod a platformot, meddig tart a szünet, mikor kereskedhetsz újra." }
    ]
  }
});
