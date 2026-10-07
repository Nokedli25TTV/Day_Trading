// 06 · Due diligence és Go/No-Go: a leckék részletes törzsanyaga.
window.TRADECRAFT_CONTENT = Object.assign(window.TRADECRAFT_CONTENT || {}, {
  "prop-diligence": {
    sections: [
      {
        title: "Miért ez az iparág legkockázatosabb rétege",
        body: [
          "A jegyzeted kutatása szerint 2024 februárja és 2025 vége között nagyságrendileg 80–100 prop cég szűnt meg világszerte. A hullámot nagyrészt az indította el, hogy egy elterjedt kereskedési platform gyártója visszavonta a licencet több cégtől.",
          "A bezárt cégek között volt magyar bejegyzésű, volt a piac akkori legnagyobbja, és volt olyan, amely egy visszamenőleges szabálymódosítás után néhány héttel zárt be. A tanulság mindegyiknél ugyanaz: a közelség, a méret és a népszerűség semmit nem garantál."
        ]
      },
      {
        title: "Ellenőrzőlista vásárlás előtt",
        list: [
          "**Értékelések trendje,** nem a pillanatnyi pontszám: romlott-e az elmúlt 2–3 hónapban? Egy hirtelen esés önmagában vészjel.",
          "**Kifizetési előzmények:** vannak ellenőrizhető, nem csak a marketingoldalon hivatkozott bizonyítékok?",
          "**Cégbejegyzés:** könnyen megtalálható, hol van bejegyezve, és ki vezeti? A szándékos homály vészjel.",
          "**Szabályváltoztatások:** keress rá a cég nevére a „rule change” és „retroactive” szavakkal.",
          "**Ügyfélszolgálat:** küldj egy kérdést vásárlás előtt, és nézd meg, érdemben válaszolnak-e.",
          "**Hatósági listák:** az amerikai CFTC nyilvános listát vezet a nem regisztrált külföldi szereplőkről.",
          "**Friss fórum-visszajelzések:** hetekben mérve frissek, ne féléves posztok."
        ]
      },
      {
        title: "Mit olvass el a szabályzatban",
        body: [
          "A drawdown pontos számítását (statikus, nap végi vagy intraday trailing), a napi limitet, a consistency rule küszöbét és jellegét, a tiltott stratégiákat, a minimális kereskedési napok számát és a kifizetés feltételeit.",
          "A jegyzeted saját tapasztalata: ugyanarról a cégről több, egymásnak ellentmondó leírás kering az összehasonlító oldalakon. Elsődleges forrás csak a cég saját, aktuális szabályzata lehet."
        ]
      },
      {
        title: "A stabil cég is változik",
        body: [
          "A hosszabb működési és kifizetési múlt jó kiindulópont, de nem ajánlás. A jegyzeted olyan példát is említ, ahol egy régóta működő cég egyik napról a másikra írta újra a teljes szabálykönyvét. Minden szabály mellé írd oda a forrást és az ellenőrzés dátumát, és vásárlás előtt nézd meg újra."
        ]
      }
    ],
    mistakes: [
      "A közösségi véleményt elsődleges bizonyítékként kezelni.",
      "Egy féléves összehasonlító táblázatból dolgozni.",
      "A pillanatnyi értékelési pontszámot nézni a trend helyett."
    ],
    check: [
      { q: "Miért a trend számít az értékeléseknél?", a: "Mert a hirtelen romlás korai előjele lehet a kifizetési vagy szabályozási gondoknak, még mielőtt az átlag látványosan leesne." },
      { q: "Mi az elsődleges forrás egy szabályhoz?", a: "A cég saját, aktuális szabályzata, az ellenőrzés dátumával együtt feljegyezve." }
    ]
  },

  "mock-evaluation": {
    sections: [
      {
        title: "Mi a célja",
        body: [
          "Megszokni a kiértékelés szigorát és ritmusát, mielőtt pénzt fizetnél érte. Ha a kiválasztott cégnél van ingyenes próba, használd. Ha nincs, szimuláld magadnak a demo számládon."
        ]
      },
      {
        title: "Paraméterezd előre",
        list: [
          "Számlaméret és profitcél.",
          "A drawdown típusa és mértéke.",
          "Napi veszteséglimit.",
          "Consistency rule küszöbe.",
          "Minimális kereskedési napok száma.",
          "Maximális kontraktusszám vagy lot."
        ],
        body: [
          "Mindet a cég aktuális szabályzatából vedd, forrással és dátummal. A trailing drawdownt neked kell kézzel vagy táblázatban követned, mert a demo platform nem fogja."
        ]
      },
      {
        title: "Egy szabálysértés bukás",
        body: [
          "Pontosan úgy, ahogy élesben történne. Ha átléped a napi limitet, a próba véget ért. Nem indítod újra visszamenőleg, nem törlöd a rossz napot, és nem mondod, hogy „az nem számít, csak teszt volt”.",
          "A siker feltétele a folyamat és a szabályok teljesítése, nem egy kiugró nap. Ha egyetlen nap vitte a cél felét, a próba akkor is gyenge, ha formálisan átmentél."
        ]
      },
      {
        title: "Elemzés és második kör",
        body: [
          "Ha a próba elbukik, a napló alapján keresd meg az okot: szabály, méret, érzelmi állapot vagy adat. Javíts egy dolgot, és csinálj egy második kört változatlan szabályokkal.",
          "A cél legalább egy, de inkább két teljes, szabálysértés nélküli ciklus. A kettőt hasonlítsd össze: ugyanazok a végrehajtási hibák tértek vissza?"
        ]
      }
    ],
    mistakes: [
      "A próba közben lazítani a szabályokon.",
      "A sikertelen kört visszamenőleg újraindítani.",
      "Elavult szabályokkal szimulálni."
    ],
    check: [
      { q: "Mi történik a mock során egy napi limitátlépésnél?", a: "A próba elbukott, ugyanúgy, mint élesben. Elemzés következik, majd új kör." },
      { q: "Miért kell két ciklus?", a: "Hogy lásd, a teljesítés ismételhető-e, és ugyanazok a hibák térnek-e vissza." }
    ]
  },

  "szabalyozas": {
    sections: [
      {
        title: "Négy kérdés minden szabály előtt",
        body: [
          "Egy szabályozási állítás csak akkor értelmes, ha tudod, melyik **joghatóságra**, melyik **instrumentumra**, melyik **számlatípusra** és melyik **szolgáltatóra** vonatkozik. Ami igaz egy amerikai részvényszámlára, az nem vihető át automatikusan futuresre, forexre vagy egy uniós számlára.",
          "Az időérzékeny állítás mellé mindig kerüljön dátum és forrás."
        ]
      },
      {
        title: "USA: intraday margin és a PDT-keret",
        body: [
          "A FINRA új intraday margin rendszere már hatályos, de a brókercégek 2027. október 20-ig átmeneti időszakot kaptak. 2026-ban ezért brókerenként eltérhet, melyik gyakorlat érvényes: mindig a konkrét brókernél, a konkrét számlatípusra kérdezz rá.",
          "A részvénypiaci pattern day trader keret amerikai margin számlákra vonatkozik. Nem vetíthető rá automatikusan futuresre, forexre vagy egy uniós számlára."
        ]
      },
      {
        title: "EU: perpetual termékek és CFD",
        body: [
          "Az ESMA 2026-ban emlékeztette a cégeket, hogy bizonyos perpetual futures termékek a jellemzőik alapján CFD-nek minősülhetnek, és ilyenkor a CFD-kre vonatkozó termékintervenciós szabályok érvényesek rájuk. A termék neve tehát nem dönti el a besorolást."
        ]
      },
      {
        title: "A prop cég nem bróker",
        body: [
          "A legtöbb prop cég nem szabályozott befektetési szolgáltató. A „kiértékelés, szimulált tőke, teljesítményalapú kifizetés” modell szándékosan más jogi kategória, mint a brókeri számlavezetés. A mögöttes tőzsde lehet erősen szabályozott, a prop cég ettől még nem az.",
          "Ez érinti a védelmedet és az adózást is (lásd a következő leckét). A forráskönyvtárban megtalálod a hivatalos kiindulópontokat."
        ]
      }
    ],
    mistakes: [
      "Egy amerikai szabályt uniós számlára alkalmazni.",
      "Dátum nélküli fórumbejegyzésből tájékozódni.",
      "A prop céget szabályozott brókernek hinni, mert szabályozott tőzsde termékét mutatja."
    ],
    check: [
      { q: "Mi a négy kérdés egy szabályozási állítás előtt?", a: "Melyik joghatóság, melyik instrumentum, melyik számlatípus, melyik szolgáltató." },
      { q: "Miért térhet el brókerenként az intraday margin gyakorlata 2026-ban?", a: "Mert az új rendszer hatályos, de a cégek átmeneti időszakot kaptak az átállásra." }
    ]
  },

  "adozas-hu": {
    sections: [
      {
        title: "A lényeg",
        body: [
          "A prop kifizetések hazai adóbesorolása eltérhet a saját brókerszámlás tőzsdei jövedelemétől, és ez pénzben jelentős különbség lehet. Ez a lecke a jegyzeted 2026. augusztusi összefoglalóját követi. **Általános tájékoztatás, nem adótanács:** a szabályok és a mértékek változhatnak."
        ]
      },
      {
        title: "Az ellenőrzött tőkepiaci ügylet",
        intro: [
          "A személyi jövedelemadóról szóló törvény kedvező kategóriát határoz meg ellenőrzött tőkepiaci ügylet (ETÜ) néven. A jegyzeted szerint, ha egy ügylet ennek minősül:"
        ],
        list: [
          "csak 15% személyi jövedelemadó terheli,",
          "nincs szociális hozzájárulási adó,",
          "a korábbi, bevallott veszteségek beszámíthatók egy későbbi nyereséges év adójába."
        ]
      },
      {
        title: "Mi történik, ha nem ETÜ",
        body: [
          "Akkor a jövedelem jellemzően egyéb jövedelemként vagy árfolyamnyereségként adózik: a jegyzeted szerint mindkét adónem terheli, és a veszteség nem számítható be a nyereséggel szemben.",
          "Az ETÜ feltétele leegyszerűsítve az, hogy a szolgáltató megfelelően szabályozott legyen, és biztosított legyen az információcsere a felügyeletek között. Első lépésként azt nézheted meg, szerepel-e a szolgáltató az MNB intézménykeresőjében."
        ]
      },
      {
        title: "Miért bizonytalan a prop kifizetés",
        body: [
          "A legtöbb prop cég nem szabályozott befektetési szolgáltató, és nem a te számládat vezeti: teljesítményalapú kifizetést ad szimulált tőkén elért eredmény után. Ezért nem garantált, hogy a kifizetés ETÜ-ként adózik, még akkor sem, ha a kereskedés forex vagy futures instrumentumon történt."
        ]
      },
      {
        title: "Mit tegyél már most",
        list: [
          "Dokumentáld minden kifizetés dátumát, összegét és forrását.",
          "Tartsd külön a prop kifizetéseket a saját brókerszámlás eredménytől.",
          "Ne magad döntsd el a besorolást: éles kifizetés előtt keress prop és külföldi teljesítményalapú kifizetésekben jártas adótanácsadót vagy könyvelőt."
        ]
      }
    ],
    mistakes: [
      "Abból kiindulni, hogy „futuresön kereskedtem, tehát tőzsdei jövedelem”.",
      "A nyilvántartást a kifizetés utánra hagyni.",
      "Fórumválasz alapján bevallani."
    ],
    check: [
      { q: "Miért nem garantált az ETÜ besorolás egy prop kifizetésnél?", a: "Mert a prop cég jellemzően nem szabályozott befektetési szolgáltató, és a kifizetés jogilag más, mint egy saját brókerszámla eredménye." },
      { q: "Ki döntsön a besorolásról?", a: "Szakember, a konkrét cég szerződése és a te helyzeted ismeretében, még az éles kifizetés előtt." }
    ]
  },

  "go-no-go": {
    sections: [
      {
        title: "Csak akkor Go, ha mindegyik igaz",
        list: [
          "Két egymást követő hónapon át betartott napi veszteséglimit, nulla átlépéssel.",
          "Szabálykövető módon pozitív demo eredmény, nem egy-két kiugró napra építve.",
          "A kötések legalább 90%-a megfelel a szabálykönyvnek.",
          "Legalább egy, inkább két sikeres mock evaluation a cég pontos, aktuális szabályai szerint.",
          "Elvégzett due diligence, vészjel nélkül.",
          "Ismered a magyar adózási és jogi kontextust, és tudod, kihez fordulsz kifizetés előtt.",
          "Anyagilag elbírod a díj teljes elvesztését: nem az utolsó pénzedből fizetsz."
        ]
      },
      {
        title: "Bizonyíték minden sor mellé",
        body: [
          "A „szerintem megvan” nem bizonyíték. Minden feltételhez tartozzon egy naplókivonat, egy táblázat, egy dátumozott forrás vagy egy képernyőkép. Ha valamelyikhez nem tudsz ilyet mutatni, az a feltétel nem teljesült.",
          "A döntést előre rögzített feltételek hozzák meg, nem a türelmetlenség és nem egy jó hét."
        ]
      },
      {
        title: "Ha a válasz No-Go",
        body: [
          "Ez nem kudarc, erre szolgál a fél év. Hosszabbítsd meg a demo szakaszt, térj vissza a 4–5. modul gyakorlataihoz, és próbáld újra 4–8 hét múlva. Írd le konkrétan, melyik feltétel hiányzott, és mi a következő lépés hozzá."
        ]
      },
      {
        title: "Ha a válasz Go",
        body: [
          "A legolcsóbb elérhető szinttel indulj, ne a legnagyobb számlamérettel. Kereskedj pontosan úgy, ahogy a szimulátorban: ne változtass a méreten csak azért, mert most éles.",
          "Legyen írásos leállási terved is: hány sikertelen próbálkozás vagy mekkora összeg után állsz meg, és mennyi időre."
        ]
      }
    ],
    mistakes: [
      "Egy jó hét után dönteni.",
      "A legnagyobb számlamérettel kezdeni.",
      "Éles számlán megváltoztatni a bevált pozícióméretet."
    ],
    check: [
      { q: "Mi a döntés, ha a hét feltételből egy hiányzik?", a: "No-Go, egy konkrét következő lépéssel a hiányzó feltételhez." },
      { q: "Melyik számlamérettel indulsz Go esetén?", a: "A legolcsóbb elérhető szinttel, változatlan szabályokkal és mérettel." }
    ]
  }
});
