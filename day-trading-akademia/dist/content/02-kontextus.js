// 02 · Chart-kontextus és aukció: a leckék részletes törzsanyaga.
export default {
  "arstruktura": {
    sections: [
      {
        title: "Trend és tartomány",
        diagram: "structure",
        diagramCaption: "Emelkedő struktúra magasabb csúcsokkal (HH) és mélypontokkal (HL), majd az első alacsonyabb csúcs (LH) és mélypont (LL).",
        body: [
          "Emelkedő struktúrában az ár magasabb csúcsokat és magasabb mélypontokat épít (HH, HL), csökkenőben alacsonyabb csúcsokat és mélypontokat (LH, LL). Ha egyik sem áll fenn következetesen, tartományban vagy.",
          "A struktúra mindig egy idősíkhoz tartozik. Ami a napi charton emelkedő trend, az az ötpercesen lehet egy órákig tartó esés. Mielőtt bármit trendnek nevezel, mondd ki, melyik idősíkon."
        ]
      },
      {
        title: "Az idősíkok munkamegosztása",
        body: [
          "A magasabb idősík (napi, 4 órás) a környezetet adja: merre tart a piac, hol vannak a nagy szintek. Az alacsonyabb (15 vagy 5 perces) a végrehajtást segíti: hol alakul ki a belépési feltétel.",
          "Ha a két idősík ellentmond, az nem hiba, hanem információ. Egy napi emelkedő trenden belüli ötperces esés lehet visszahúzódás is, fordulat is. Ezt a szinteknél látott reakció dönti el, nem a struktúra neve."
        ]
      },
      {
        title: "A támasz és az ellenállás zóna",
        body: [
          "A szint nem matematikailag pontos vonal, hanem ársáv, ahol korábban reakció történt. A berajzolásnál az a kérdés, miért pont ott: volt ott többszöri fordulat, nagy forgalom, vagy egy korábbi tartomány széle?",
          "Ez a leggyakrabban alábecsült készség. A következő leckékben a volume profile ad hozzá mérhető választ arra, hol halmozódott fel valóban a kereskedés."
        ]
      }
    ],
    mistakes: [
      "Struktúrát mondani idősík megnevezése nélkül.",
      "Egy csúcsra támaszt rajzolni csak azért, „mert ott volt egy csúcs”.",
      "A szintet vonalnak kezelni, és egy tickes átlépésből áttörést kiáltani."
    ],
    check: [
      { q: "Lehet egyszerre emelkedő és csökkenő a struktúra?", a: "Igen, különböző idősíkokon. Ezért kell mindig megnevezni, melyiken beszélsz róla." },
      { q: "Mit ad a magasabb, és mit az alacsonyabb idősík?", a: "A magasabb a környezetet és a nagy szinteket, az alacsonyabb a belépési feltétel kialakulását." }
    ]
  },

  "gyertyak-indikatorok": {
    sections: [
      {
        title: "Kevés alakzat, de helyszínnel",
        body: [
          "Nem kell ötven gyertyaalakzatot megtanulni. Öt-hat gyakran visszatérő elég: az engulfing (elnyelő), a pin bar vagy hammer (hosszú kanócos), és az inside bar (az előző gyertyán belül maradó).",
          "Az alakzat önmagában keveset mond. Egy hosszú alsó kanóc a tartomány közepén zaj, ugyanaz egy korábbi mélypont alatt egy elutasított vizsgálat nyoma lehet. Mindig a helyszínnel együtt értelmezd."
        ]
      },
      {
        title: "Mit tud egy indikátor",
        body: [
          "Az indikátor az árból és a volumenből számolt érték. Nem hoz új információt, csak másképp mutatja ugyanazt. Válassz két-hármat, például egy mozgóátlag-párt és egy momentummutatót (RSI), és értsd meg, **miből** számolnak és mikor adnak félrevezető képet.",
          "Hat indikátor egy charton nem hat megerősítés. Mindegyik mást „mond”, és a végén azt hiszed el, amelyik a saját elképzelésedet támasztja alá. Ez megerősítési torzítás grafikonon."
        ]
      },
      {
        title: "Védekezés a visszamenőleges belelátás ellen",
        body: [
          "Utólag minden minta nyilvánvalónak látszik. Ezért a gyakorlásnál előbb írd le, mit látsz, hol a szint és mit vársz, és csak utána görgess tovább. Így a mintafelismerést teszteled, nem a memóriádat.",
          "A 20 helyzetből 12 eltalált irány még nem stratégia. Annyit jelent, hogy a mintákat következetesen felismered."
        ]
      },
      {
        title: "Források szűrése",
        intro: [
          "Alapozásra jó az Investopedia és a BabyPips iskolája, mélyebb referenciának John J. Murphy technikai elemzés könyve. A közösségi elemzéseket forrásként kezeld, ne kövesd vakon."
        ],
        list: [
          "Piros zászló, ha valaki garantált találati arányt ígér.",
          "Piros zászló, ha jelzéscsoportot hirdet „kövesd a kötéseimet” felállásban.",
          "Piros zászló, ha csak nyerő kötéseket mutat, ellenőrizhető számlaadat nélkül."
        ]
      }
    ],
    mistakes: [
      "Indikátorhalmozás: sok vonal, kevés megértés.",
      "Alakzatot keresni helyszín nélkül.",
      "A mintát utólag „belelátni” a chartba."
    ],
    check: [
      { q: "Miért nem három megerősítés három indikátor?", a: "Mert ugyanabból az ár- és volumenadatból számolnak, tehát nagyrészt ugyanazt az információt mutatják más formában." },
      { q: "Mit bizonyít, ha a 20 replayhelyzetből 12-nél jó volt az előzetes várakozásod?", a: "Csak azt, hogy a mintákat felismered. Stratégiát ez még nem igazol." }
    ]
  },

  "aukcio": {
    sections: [
      {
        title: "A piac mint folyamatos aukció",
        body: [
          "Az Auction Market Theory (AMT) szerint az ár olyan szinteket keres, ahol a résztvevők hajlandók egymással kereskedni. Három fogalom írja le a mozgást: **balance**, amikor az ár egy tartományon belül kétirányúan kereskedik; **imbalance**, amikor az aukció irányba mozdul; és **price discovery**, az új kereskedési tartomány keresése.",
          "A profilban emlegetett „fair value” az adott időszak kereskedési elfogadottságára utal. Nem az eszköz fundamentális értékének kiszámítása. Különböző időtávokon más-más egyensúly létezhet."
        ]
      },
      {
        title: "Elfogadás és elutasítás",
        body: [
          "**Elfogadás (acceptance):** a piac ismételten visszatér egy területre, kétirányú kötéseket hoz létre, és ott folytatni tudja a kereskedést. **Elutasítás (rejection):** megvizsgál egy szintet, de gyorsan távozik, és egy ideig nem tud ott tartósan kereskedni.",
          "Egyetlen érintésből nem lehet elfogadást megállapítani, és nincs minden piacra érvényes gyertyaszám. Neked kell előre meghatároznod, mit tekintesz mérhető elfogadásnak. Például: két lezárt egyperces gyertya a szint fölött, majd egy visszateszt, amely nem zár alá. Ez tesztelhető definíció, de a pontosságtól még nem lesz nyereséges."
        ]
      },
      {
        title: "Erőfeszítés és eredmény",
        table: {
          head: ["Megfigyelés", "Vizsgálandó értelmezés", "Következő ellenőrzés"],
          rows: [
            ["Sok kötés, jelentős elmozdulás", "Az agresszió eredményes lehetett", "Megmarad-e az új tartomány"],
            ["Sok kötés, kevés elmozdulás", "Erős passzív ellenoldal vagy kétirányú forgalom", "Milyen irányú a forgalom, és mi történik utána"],
            ["Kevés kötés, nagy elmozdulás", "Ritka vagy visszavont likviditás", "Stabil-e a könyv és az ár"],
            ["Kevés kötés, kis elmozdulás", "Alacsony aktivitás, kivárás", "Változik-e az aktivitás"]
          ]
        },
        body: [
          "A volumen az aktivitás nagyságát jelzi, az ármozgás az eredményt. A nagy összvolumen és a kis gyertya még nem bizonyít abszorpciót: a gyertyán belül sok váltakozó vétel és eladás is történhetett."
        ]
      },
      {
        title: "Mi mozgatja az aukciót",
        body: [
          "Új információ, fedezési igény, pozíciózárás, portfólióátrendezés és végrehajtási kényszer. Ezek hatása a megbízásokon és a likviditáson keresztül jelenik meg az árban. Hír nélkül is lehet nagy mozgás, és fontos hír mellett is lehet kicsi, ha már beárazódott."
        ]
      }
    ],
    mistakes: [
      "Egyetlen érintést elfogadásnak nevezni.",
      "A „fair value” területet fundamentális értéknek hinni.",
      "A megfigyelés helyett rögtön jóslatot írni."
    ],
    check: [
      { q: "Mi a különbség az elfogadás és az elutasítás között?", a: "Elfogadásnál a piac vissza-visszatér és ott tartósan, kétirányúan kereskedik. Elutasításnál megvizsgálja a területet, de gyorsan elhagyja." },
      { q: "Kevés volumen mellett nagy mozgás történt. Mi lehet az oka?", a: "Ritka vagy visszavont likviditás: kevés agresszív megbízás is messzire viszi az árat, ha nincs, ami megállítsa." }
    ]
  },

  "volume-profile": {
    sections: [
      {
        title: "Mit mutat a profil",
        body: [
          "A volume profile egy kiválasztott időszak kötött mennyiségét árszintek szerint rendezi. Az idő szerinti volumen arra válaszol, mennyi kötött öt perc alatt; a profil arra, ebből **hol** kötött sok vagy kevés.",
          "A profil kinézete függ az adatok részletességétől, az ársorok méretétől és a vizsgált időszaktól. A POC és a value area mindig ennek a konkrét eloszlásnak a jellemzője."
        ]
      },
      {
        title: "A fő fogalmak",
        list: [
          "**POC (Point of Control):** a legnagyobb kötött mennyiségű ársor. A leggyakoribb értékhez áll közel, nem átlagár és nem automatikus belépési pont.",
          "**Value area (VA):** a választott célhányadhoz (gyakran 70%) tartozó, általában a POC körül kialakított összefüggő ársáv. Felső határa a **VAH**, az alsó a **VAL**.",
          "**HVN:** nagy volumenű kiemelkedés a profilban. Több is lehet, a POC a legnagyobb közülük.",
          "**LVN:** a környezetéhez képest kis volumenű völgy."
        ],
        body: [
          "Ezek múltbeli eloszlást írnak le. Egy HVN-nél kialakulhat újabb kétirányú kereskedés, egy LVN-nél lehet gyors áthaladás vagy gyors visszafordulás, de az is, hogy ott most kezd mennyiség felhalmozódni. A régi eloszlás nem köti a mai résztvevőket."
        ]
      },
      {
        title: "A 70% nem egy szórás és nem valószínűség",
        body: [
          "A normális eloszlásnál az átlag körüli egy szórás nagyjából 68,3%-ot fed le. A value area viszont választott volumenhányadot keres, nem az átlagból és a szórásból számol. A piaci profil lehet ferde, többcsúcsú vagy töredezett.",
          "Ebből következik a fontosabb állítás: a value area határaiból **nem** olvasható ki, hogy az ár 70% eséllyel ott marad. A mintában kötött mennyiség aránya és a jövőbeli ár helyének valószínűsége két külön fogalom. A sokat emlegetett „80%-os szabály” is csak név, amíg a saját piacodon, saját definícióval nem tesztelted."
        ]
      }
    ],
    example: {
      title: "POC és value area számítása",
      diagram: "profile",
      diagramCaption: "Ugyanez a profil sávokkal: a kék sorok adják a value areát.",
      table: {
        head: ["Ársor", "Kötött kontraktus", "Részesedés"],
        rows: [["100,00", "60", "6%"], ["100,25", "180", "18%"], ["100,50", "320", "32%"], ["100,75", "230", "23%"], ["101,00", "140", "14%"], ["101,25", "70", "7%"]]
      },
      body: [
        "Az összeg 1000 kontraktus. A POC 100,50, mert ott kötött a legtöbb (320). A 70%-os cél 700 kontraktus.",
        "A POC-ból indulunk, és mindig a már bevont tartomány két szomszédja közül a nagyobbat vesszük hozzá. Először a 100,75 jön (230 > 180), az összeg 550. Utána a felső szomszéd 140, az alsó 180, tehát a 100,25 kerül be: 730, a cél teljesült.",
        "Eredmény: VAL = 100,25, VAH = 100,75, a ténylegesen bevont hányad 73%. A sorok nem darabolhatók, ezért lett több 70%-nál. Más platform eltérő szabályt használhat, ezért a saját szoftvered dokumentációját is nézd meg."
      ]
    },
    mistakes: [
      "A HVN-t mai várakozó likviditásnak hinni.",
      "A value areát jövőbeli valószínűségnek olvasni.",
      "Addig húzogatni a profil kezdőpontját, amíg „szép” szint nem jön ki."
    ],
    check: [
      { q: "Lehet egy profilban több HVN?", a: "Igen. A POC a legnagyobb közülük." },
      { q: "Miért lett a példában 73% a 70% helyett?", a: "Mert csak teljes ársorokat lehet bevonni, és az utolsó sorral az összeg átlépte a célt." }
    ]
  },

  "vwap-tpo": {
    sections: [
      {
        title: "Milyen időszakból épül a profil",
        list: [
          "**Session profile:** egy előre megadott kereskedési szakasz profilja.",
          "**Fixed range:** kézzel vagy szabály szerint választott kezdet és vég között.",
          "**Visible range:** a képernyőn látható részre számol, ezért zoomoláskor megváltozik.",
          "**Composite:** több nap vagy szakasz összesítve."
        ],
        body: [
          "Gyakorláshoz olyat válassz, amelyet később ugyanúgy meg tudsz ismételni. Egy rögzített session vagy előre definiált swing-szakasz jó összehasonlítási alap.",
          "A **developing POC** és a developing value area az éppen épülő időszak pillanatnyi értéke. A session végső profilja csak a végén ismert. Replayben a végső POC-ot egy korábbi belépés igazolására használni jövőbeli információ becsempészése."
        ]
      },
      {
        title: "Profilalakok és az értékterület vándorlása",
        body: [
          "A D alak középen koncentrálódó eloszlás, a P alaknál a felső, a b alaknál az alsó részen gyűlik több volumen, a kétcsúcsú profilban két koncentráció van, köztük ritkább területtel. Ezek leírások. A P alakhoz gyakran short zárást, a b alakhoz long likvidálást társítanak, de az alak önmagában nem azonosítja, kik és miért kötöttek.",
          "Ha több egymást követő, összehasonlítható session value areája és POC-ja feljebb kerül, az magasabb szinteken kialakuló elfogadást jelez. Nézd az átfedést is: más környezet, ha a területek nagyrészt egymáson maradnak, és más, ha a következő session szinte teljesen új tartományba kerül."
        ]
      },
      {
        title: "A VWAP",
        body: [
          "A VWAP a volumennel súlyozott átlagár: a kötési árakat megszorozzuk a mennyiségükkel, összeadjuk, és osztunk az összvolumennel. Hasznos viszonyítási pont az időszak átlagos végrehajtási szintjéhez.",
          "Az, hogy az ár fölötte van, nem vételi jel. Tartós trendben az ár sokáig távol maradhat tőle. A VWAP szórássávja pedig nem azonos a profil value areájával."
        ]
      },
      {
        title: "TPO: idő, nem mennyiség",
        body: [
          "A TPO (Time Price Opportunity) azt rögzíti, hány időablakban szerepelt egy árszint. A volume profile a kötött mennyiséget összegzi. Egy áron lehet sok kötés rövid idő alatt, és kevés kötés sok időablakban, ezért a volume POC és a TPO POC eltérhet."
        ]
      }
    ],
    example: {
      title: "VWAP és POC ugyanazon az adaton",
      body: [
        "100-on 20, 101-en 30, 102-n 50 kontraktus kötött. VWAP = (100 × 20 + 101 × 30 + 102 × 50) / 100 = 101,30.",
        "A POC viszont 102, mert ott a legnagyobb az egyedi mennyiség. Az átlag és a legnagyobb csúcs tehát két különböző szám."
      ]
    },
    mistakes: [
      "Visible range profilból szintet jegyezni, majd zoomolás után csodálkozni, hogy elmozdult.",
      "A profil alakjából a következő nap irányára következtetni.",
      "A VWAP feletti árat önálló vételi jelnek venni."
    ],
    check: [
      { q: "Miért veszélyes replayben a session végső POC-ja?", a: "Mert a döntés pillanatában még nem volt ismert. Csak az addig épülő (developing) értéket használhatod." },
      { q: "Mit mér a TPO, amit a volume profile nem?", a: "Az időbeli jelenlétet: hány időablakban járt az ár egy szinten, függetlenül a kötött mennyiségtől." }
    ]
  },

  "adatminoseg": {
    sections: [
      {
        title: "Melyik eszköz mire válaszol",
        table: {
          head: ["Eszköz", "Fő kérdés", "Legfontosabb korlát"],
          rows: [
            ["Árgyertya", "Hová jutott az ár", "Nem mutatja a belső folyamatot"],
            ["Volume profile", "Hol kötött a mennyiség", "Az időszaktól és a felbontástól függ"],
            ["Footprint", "Hol és melyik agresszoroldalon kötött", "A besorolás és a gyertyaképzés számít"],
            ["Delta és CVD", "Melyik agresszoroldal kötött többet", "Nem méri a passzív oldal erejét"],
            ["DOM", "Milyen ajánlatok várakoznak most", "A mennyiség módosulhat és törlődhet"],
            ["Heatmap", "Hogyan változott a látható könyv", "A megjelenített ajánlat nem teljesülési ígéret"]
          ]
        },
        body: [
          "Az alapvető felosztás: a kötéslista, a volumen, a footprint és a delta **megtörtént ügyletekből** áll. A DOM és a heatmap **még végrehajtatlan ajánlatokat** mutat. Ez független attól, hogy élőben vagy visszanézve látod."
        ]
      },
      {
        title: "L1, L2, MBP, MBO",
        body: [
          "Az **L1** (top of book) tipikusan a legjobb bid és ask a mennyiségekkel és a kötésekkel. Az **L2** több árszint ajánlati mennyiségét adja. A **Market by Price** árszintenként összesít, a **Market by Order** különálló, anonim megbízásokat mutat.",
          "Az L1/L2 az adat mélységére, az MBP/MBO a részletezettségére vonatkozik: ez két külön felosztás. Egy hagyományos footprinthez nem kell teljes mélységi adat, csak részletes kötések és megbízható oldalbesorolás."
        ]
      },
      {
        title: "Miért tér el két platform deltája",
        body: [
          "Egy szolgáltatás használhat tőzsdei agresszorjelölést, a kötés pillanatának bid/ask viszonyát, vagy ármozgás alapján becsült besorolást. Az utóbbi nem ugyanaz a mérés. A „buy”, „sell” és „delta” felirat önmagában nem igazolja, hogy valódi bid/ask adatot látsz.",
          "Két CVD eltérését okozhatja eltérő piac, kontraktus, besorolás, kezdőidő, session, hiányzó adat vagy szűrés. Először a módszert és a bemenetet hasonlítsd össze, ne a szoftver nevét."
        ]
      },
      {
        title: "Ellenőrzőlista minden alkalom előtt",
        list: [
          "Instrumentum, kereskedési helyszín, futuresnél a lejárat.",
          "A volumen mértékegysége és az agresszorbesorolás módja.",
          "A session időhatárai és a CVD nullázása.",
          "Az ársorok mérete és a gyertya típusa.",
          "Replayben: tickadat, történeti könyv vagy csak gyertya áll rendelkezésre?"
        ],
        body: [
          "A sessiont a piac saját időzónájában rögzítsd. Rollover környékén az aktív kontraktus változik, ezért a folytonos grafikon képzésének módja is számít."
        ]
      }
    ],
    mistakes: [
      "Két platform deltáját összehasonlítani a besorolás ellenőrzése nélkül.",
      "Gyertyás replayből könyvváltozásra és kötési sorrendre következtetni.",
      "Egy futures adatát felcserélhetőnek venni a kapcsolódó CFD-vel vagy devizapárral."
    ],
    check: [
      { q: "A DOM kötést vagy ajánlatot mutat?", a: "Várakozó, még végrehajtatlan ajánlatokat. Ezek módosulhatnak és törlődhetnek." },
      { q: "Mi változtatja meg a CVD-t ugyanazon a piacon?", a: "A kezdőpont és a session (reset), a besorolás módja, a kontraktus és az esetleges adathiány." }
    ]
  },

  "kontraktus-session": {
    sections: [
      {
        title: "Futures: méret, tick, pont",
        table: {
          head: ["Kontraktus", "Pontérték", "Tick", "Tickérték"],
          rows: [
            ["E-mini S&P 500 (ES)", "50 USD", "0,25 pont", "12,50 USD"],
            ["Micro E-mini S&P 500 (MES)", "5 USD", "0,25 pont", "1,25 USD"]
          ]
        },
        body: [
          "A micro kontraktus az E-mini tizede, ezért jó belépő kisebb számlához. Hasonló micro változat létezik a Nasdaqra (MNQ), a Dow-ra (MYM) és a Russellre (M2K).",
          "Ezek termékspecifikus adatok. Az aktuális értéket és a marginigényt mindig a tőzsde oldalán ellenőrizd, mert a margin a volatilitással változik."
        ]
      },
      {
        title: "Forex: pip és lot",
        body: [
          "Devizánál a pip a jegyzés szokásos legkisebb egysége, a lot a kötésméret. A standard, a mini és a micro lot között tízszeres lépések vannak, így a pip pénzértéke is tízszeresen változik. A pozícióméretezés logikája ugyanaz, mint futuresnél: stop távolsága szorozva az egységértékkel.",
          "A prop cégek többsége szimulált tőkén, modellezett végrehajtással futtatja a kereskedést. A margin és a tőkeáttétel szabályait ezért a cég saját leírásából vedd."
        ]
      },
      {
        title: "Mikor van a fő sáv",
        body: [
          "A CME elektronikus kereskedése vasárnap estétől péntek estig tart, napi nagyjából egyórás technikai szünettel. A legtöbb likviditás és a legszűkebb spread a fő kereskedési sávban (RTH) van, ami az indexfuturesnél magyar idő szerint délutántól estig tart.",
          "Forexnél a London és New York átfedése a legforgalmasabb, magyar idő szerint kora délutántól. **A pontos időpontokat mindig ellenőrizd:** az EU és az USA más napon állítja át az órát, ezért tavasszal és ősszel 1–2 hétig egy órával elcsúszik minden."
        ]
      },
      {
        title: "A puska",
        body: [
          "Készíts egyoldalas jegyzetet a 3–5 legfontosabb instrumentumodról: tickméret, tickérték, pontérték, fő sáv magyar idő szerint, és a dátum, amikor utoljára ellenőrizted. Ezt használod majd a pozícióméretezésnél és a tesztelésnél."
        ]
      }
    ],
    example: {
      title: "Ugyanaz a stop két kontraktuson",
      body: [
        "8 tickes stop az ES-en 8 × 12,50 = 100 USD kockázat kontraktusonként. Ugyanez a MES-en 8 × 1,25 = 10 USD.",
        "Aki a tickértéket a pontértékkel keveri, négyszeres hibát vét: a MES-en egy pont 5 USD, egy tick 1,25 USD."
      ]
    },
    mistakes: [
      "A sessionidőket egyszer megnézni, és örökre fixnek hinni.",
      "A tickértéket összekeverni a pontértékkel, és ezért túlméretezni a pozíciót.",
      "A valódi tőzsdei margint azonosnak venni a prop számla szimulált szabályával."
    ],
    check: [
      { q: "Mennyi egy 6 tickes stop pénzben egy MES kontraktuson?", a: "6 × 1,25 = 7,50 USD." },
      { q: "Miért csúszik el évente kétszer a fő sáv magyar idő szerint?", a: "Mert az EU és az USA nem ugyanazon a napon állít órát, így 1–2 hétig más az időeltérés." }
    ]
  }
};
