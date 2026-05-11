# VRS Breedenbroek - Vogelringregistratie App

## Wat is dit?
Een PWA (Progressive Web App) voor vogelringers om vangsten te registreren in het veld. De app werkt offline en exporteert naar Griel XML-formaat voor het Vogeltrekstation.

## Eigenaar
Thijs ter Avest - VRS Breedenbroek (Gelderland)
Ringernummer: 3254

## Tech stack
- React 19 met Vite als bundler
- Vanilla CSS met CSS custom properties (geen Tailwind)
- Supabase als backend (PostgreSQL + RLS)
- Dexie (IndexedDB) voor offline-first cache
- Service Worker via vite-plugin-pwa voor offline gebruik
- React Router v7 voor navigatie
- Leaflet voor kaartweergave

## Projectstructuur
```
src/
  components/     # React componenten, elk in eigen map
    Admin/        # Gebruikersbeheer, ruitypen
    Auth/         # Login
    Databases/    # Database-overzichtspagina
    Instellingen/ # Instellingen, sync-status, thema
    Layout/       # Header, navigatie
    Nieuw/        # Invoerformulier nieuwe/bewerkte vangst
    Over/         # Over-pagina met changelog
    Projecten/    # Projectbeheer
    Records/      # Vangstlijst
    Ringstreng/   # Ringstrengen beheer
    Soorten/      # Soortenpagina's en detailpagina
    Stats/        # Statistieken, grafieken, exports
    Sync/         # MigrationBanner
  context/        # AuthContext, SyncContext
  data/           # Statische data en constanten
  hooks/          # 10 custom hooks
  lib/            # db.js (Dexie), supabase.js (client)
  styles/         # theme.css (CSS custom properties)
  utils/          # Export (XML/CSV), helpers, lookup
public/           # PWA manifest, service worker, icons
```

## Design
- Donker thema: achtergrond #0f172a, accent #38bdf8, succes #22c55e
- Mobile-first responsive, minimaal 44px touch targets
- Nederlandse UI-teksten
- Inklapbare formulier-secties voor snelle invoer

## Gebruikersrollen
Drie rollen via Supabase `profiles.rol`, simuleerbaar via sessionStorage:
- **admin** — volledig toegang + admin panel
- **ringer** — eigen data beheren (standaard)
- **viewer** — alleen lezen

## Griel/EURING veldsysteem
De app ondersteunt alle 65 velden uit het Griel-systeem (Vogeltrekstation).
De velden zijn georganiseerd in secties:
1. **Essentieel** - vogelnaam, ringnummer, metalenringinfo, leeftijd, geslacht, vangstmethode, tijd
2. **Biometrie** - vleugel, gewicht, tarsus, P8, staart, kop+snavel, etc. (0.1mm/0.5mm precisie)
3. **Rui & Conditie** - handpenscore, vet (Busse 0-5), borstspier, broedvlek, cloaca
4. **EURING Codes** - centrale (NLA), status, conditie, omstandigheden, lokmiddelen
5. **Opmerkingen** - vrije tekstvelden

## Griel XML-export
De export moet voldoen aan de Griel bulkupload specificatie:
- Root element: `<ringgegevens>`
- Per vangst: `<vangst>` element
- Decimalen in Nederlandse notatie (komma)
- Datum in dd-mm-yyyy formaat
- Alle verplichte EURING-velden moeten aanwezig zijn

## Data
- **Soorten (~3565)** komen uit Supabase (`species` tabel), offline gecached in Dexie. Bevat: namen (NL/Latijn/EN/DE/FR/ES), EURING-code, ringmaat, ruitype, nestdata, determinatieboeken, biometriegrenzen per geslacht.
- **EURING-codes** zitten in het `data`-veld van elke soort in Supabase — geen apart bestand.
- **`data/euring-reference.js`** — hardcoded EURING Exchange Code lijsten (metalenringinfo, leeftijd, geslacht, etc.) voor de keuzelijsten in het formulier.
- **`data/constants.js`** — app-brede constanten (PULL_INTERVAL_MS, RUIKAART_SLAGEN, MAX_GRIEL_TEKST).
- **`data/changelog.js`** — versiegeschiedenis en huidig versienummer.
- **`data/andere-banen-import.json`** en **`data/buitenland-import.json`** — eenmalige historische importbestanden.

## Soortenpagina's
Data komt uitsluitend uit Supabase via `useSpeciesRef()` → Dexie cache.

Elke soortpagina toont:
- Hero: foto, Nederlandse naam, Latijnse naam, ringmaat, ruitype
- Geslachts- en leeftijdsbepaling (♂/♀, voorjaar/najaar)
- Ring & Rui (ringmaat, ruitype, EURING-code, ruikalender)
- Namen (NL, Latijn, EN, DE, FR, ES) + taxonomie (familie, orde)
- Biometrie met algemene en geslachtsspecifieke min/max ranges, inclusief eigen vangsten
- Nestgegevens (eileg, broedels, eieren, broedtijd, nestjong, broedzorg)
- Determinatieboeken met paginanummers (Svensson, Demongin, Baker, Klaassen, etc.)
- Mijn vangsten: teller, geslacht/leeftijd verdeling, kaart, recente 10 vangsten

### Biometrie-validatie bij invoer
Bij soortselectie in het invoerformulier worden biometriegrenzen getoond en gecontroleerd.
Prioriteit van bronnen (hoog → laag):
1. Literatuurdata uit de `species` tabel (Supabase)
2. Gebruikersoverschrijving via `species_overrides`
3. Eigen vangsten (min 3 records, ±10% marge, nestjongen uitgesloten)

Toon gele waarschuwing bij waarde buiten range — blokkeer opslaan NIET.

## Offline & sync
- Mutaties worden in een `sync_queue` (Dexie) gezet en verwerkt zodra online
- Max 5 pogingen per item, daarna verwijderd
- Pull van species/overrides/veldconfig bij login en bij tab-focus
- `lastSynced` opgeslagen in localStorage
- Gesynchroniseerde tabellen: vangsten, projecten, ringstrengen, species_overrides, profiles

## App-pagina's
| Route | Pagina |
|---|---|
| `/` | Nieuw/bewerk vangst |
| `/records` | Vangstlijst |
| `/stats` | Statistieken & export |
| `/soorten` | Soortenbrowser |
| `/soorten/:naam` | Soortdetailpagina |
| `/projecten` | Projectbeheer |
| `/ringstrengen` | Ringstrengen |
| `/instellingen` | Instellingen & sync |
| `/databases` | Databaseoverzicht |
| `/over` | Over & changelog |
| `/admin` | Admin panel |

## Commando's
- `npm run dev` - development server
- `npm run build` - productie build naar dist/
- `npm run preview` - preview van productie build
- `npm run lint` - ESLint

## Conventies
- Componentnamen in PascalCase
- Hook namen beginnen met `use`
- Nederlandse variabelenamen voor domein-specifieke concepten (vangst, soort, ringnummer, rui)
- Engelse namen voor technische concepten (state, handler, export, sync)
- Bij elke commit: versienummer en changelog.js bijwerken
- Na elke voltooide taak/prompt: altijd changelog.js bijwerken, committen én pushen naar GitHub — zonder uitzondering

---

## Workflow: soortdata toevoegen vanuit Demongin

### ⚠️ VERPLICHTE VOLGORDE — altijd alle 6 stappen uitvoeren

Bij elke nieuwe soort worden ALLE stappen uitgevoerd zonder uitzondering, in deze volgorde:
1. `node scripts/update-[soort]-data.js`
2. `src/data/determinatie/[familie].js` aanmaken of uitbreiden
3. `src/data/determinatie/index.js` bijwerken
4. `node scripts/seed-[soort]-determinatie.js`
5. `src/data/changelog.js` + `package.json` versie ophogen
6. `git add ... && git commit && git push`

**Stap 2–4 zijn niet optioneel.** De determinatiehulp hoort altijd bij een nieuwe soort, ook als er niet expliciet om gevraagd wordt. Volg daarna de gedetailleerde uitleg per stap hieronder.

---

### Wanneer
Thijs levert de tekst van één of meer pagina's uit Demongin. Taak: zet alle aanwezige informatie over die soort om naar app-data. Voeg niets toe uit eigen kennis — alleen wat expliciet in de aangeleverde brontekst staat.

### Bronfideliteit — absolute regel
**Nooit iets verzinnen of aanvullen.** Als iets niet in de aangeleverde tekst staat, laat het veld leeg (`''`) of laat het weg. Bij twijfel: weglaten. Dit geldt ook voor:
- Broedvlek als geslachtsindicator (staat zelden expliciet vermeld)
- Uitstekende cloaca tenzij letterlijk genoemd (schrijf altijd "uitstekende cloaca", nooit de afkorting "CP")
- Aantallen uit het hoofd (e.g. "typisch 10 handpennen") — alleen overnemen als getal + context in bron staat
- Gedrag, voedsel, habitat — niet relevant voor ringersdata

### Stap 1 — Script schrijven: `scripts/update-[soort]-data.js`

Gebruik `scripts/TEMPLATE-soort-data.js` als startpunt. Alle velden in het `data`-object:

#### Biometrie (`biometrie_*`)
- Velden: `vleugel`, `staartlengte`, `tarsus_lengte`, `gewicht`, `p8`, `snavel_schedel`, `snavel_schedel_is_bill_to_feathers` (bool), `kop_snavel`, `snavel_diepte_mid` (snavelhoogte bij neusgat)
- Prefix in Supabase: `bio_[veld]_M_min` / `bio_[veld]_M_max` / `bio_[veld]_F_min` / `bio_[veld]_F_max`
- Per veld: `{ min, max }` voor algemeen, `{ M: {min,max}, F: {min,max} }` voor geslachtsspecifiek
- Subaspecies: `biometrie_ssp` object met subspecies-naam als key
- Eenheid altijd mm of g — uit bron overnemen

#### Penveren (`pennen_structuur`)
```js
{ wp: 'P3–P4', hp: 10, hp_note: '...', ap: 9, ap_note: '(soms 12; extr. 10–15)', tp: 3, sp: 12 }
```
`ap_note` en `hp_note` zijn optioneel. Alleen opnemen als de bron een range of uitzondering noemt.

#### Vleugelformule (`vleugelformule`) — altijd opnemen als Demongin de tabel geeft
Als Demongin een vleugelformuletabel geeft (P-WP afstanden, uitrandingen, inkepingen), ALTIJD opslaan als geformatteerde string. Nooit `''` laten staan als er data is.

Formaat (zie Roek als voorbeeld):
```
'WP=(3)4(5) · P5 en P6 lang · P1 relatief lang · P2 kort\n' +
'P1 WP 63–80 mm · P2 WP 10–15 mm · P3 WP (0)1–4 mm · P6 WP 2–7 mm · P10 WP 21–31 mm\n' +
'Uitgerand: P3 P4 P5 P6 · Inkeping: P2 P3 P4 (P5)\n' +
'Bron: Demongin (2016) p.XXX'
```
- Demongin "Em" = emarginations = **uitgerand** (P-nummers van buiten naar binnen, Demongin-telling)
- Demongin "Notch" = notch = **inkeping**
- Demongin P-nummering is omgekeerd aan Griel: Demongin P1 = buitenste; Griel P10 = buitenste
- Laat regels weg als de bron de data niet geeft (bv. geen Em/Notch)

**Demongin-afkortingen in determinatieteksten:**
- **TF** = tail feathers (staartveren) — NOOIT tertialen
- **T** = tertials (tertialen)
- **P** = primaries (handpennen), **S** = secondaries (armpennen)
- **GC/MC/LC** = grote/middelste/kleine vleugeldekveren
- **CC** = carpal coverts (carpaaldekveren), **PC** = primary coverts (handpendekveren)

#### Rui (`rui_notities`)
Vrije Markdown-tekst. Kalendermaanden als afkorting (jan/feb/…). Geen functies of {{MM}}-markers hier.

**⚠️ Opmaak rui_notities — leeftijdskop altijd inline**
`renderMarkdown()` converteert ALLE `\n` naar `<br>`. Een `\n\n` na een leeftijdskop levert een zichtbare lege regel op.
- ✅ Correct: `**1e kj (3)** Gedeeltelijke postjuv-rui van...` (kop + spatie + tekst, zelfde regel)
- ❌ Fout: `**1e kj (3)**\n\nGedeeltelijke...` (lege regel tussen kop en tekst)
Secties worden van elkaar gescheiden met `\n\n` (lege regel). Nooit `\n\n` ná een leeftijdskop.

#### Leeftijd en geslacht — KRITIEKE REGELS

**⚠️ EURING leeftijdscodes — altijd met Nederlandse naam**
Schrijf ALTIJD de Nederlandse leeftijdsnaam én de EURING-code (tussen haakjes). Nooit alleen de code. Formaat: `**Nederlandse naam (EURING X)**`

| EURING | Nederlandse naam | Toelichting |
|---|---|---|
| 0 | leeftijd onbekend | |
| 1 | pullus | nestjong |
| 1J | pullus, vliegvlug | strek genoeg om in buurt van nest te zijn |
| 2 | volgroeid | leeftijd onbekend, maar volwassen |
| 3 | 1e kj | 1e kalenderjaar, juveniel |
| 3J | 1e kj, deels in jeugdkleed | 1e kj tijdens/na gedeeltelijke rui |
| 4 | na 1e kj | bevestigd ≥ 2e kj, maar niet nader te dateren |
| 5 | 2e kj | 2e kalenderjaar |
| 6 | na 2e kj | bevestigd ≥ 3e kj, maar niet nader te dateren |
| 7 | 3e kj | 3e kalenderjaar |
| 8 | na 3e kj | bevestigd ≥ 4e kj, maar niet nader te dateren |
| 9 | 4e kj | 4e kalenderjaar |

Voorbeelden: `**1e kj (3)**`, `**na 1e kj (4)**`, `**2e kj (5)**`, `**na 2e kj (6)**`
Seizoensovergang: `**na 1e kj (4)** — in/na postjuv-rui → in jan: 2e kj (5)`
Cross-referentie: `**2e kj (5)** (= vorig najaar: na 1e kj (4))`
Nooit "Adult" als standalone label — gebruik altijd de EURING-naam.

**⚠️ Markdown alinea-scheiding — \n\n tussen alinea's, maar NIET binnen tabelblokken**
`renderIDKenmerken()` splitst `determinatie_id_notities` op `\n\n`. Een `**Vergelijking ...:**`-kop en alle bijbehorende pipe-tabelrijen moeten in hetzelfde blok staan — gescheiden door `\n`, **nooit** `\n\n`. Zodra `\n\n` na de Vergelijking-kop staat, wordt de tabel als losse alinea gerenderd met `<br>` tussen elke rij.

Correcte structuur voor een tabelblok:
```
**Vergelijking A / B / C:**
| Kenmerk | A | B | C |
|---|---|---|---|
| Rij | ... | ... | ... |

**Volgende alinea...**
```

Voor overige koppen (`**Hybridisatie...**`, `**Afwijkende vogels**`, etc.) wél `\n\n` voor de volgende alinea — anders toont de renderer `<br>` na de kop.

**⚠️ Geslachtssymbolen — altijd met letter**
Schrijf ALTIJD de letter direct achter het geslachtssymbool. Nooit het symbool alleen.

| Symbool | Schrijf altijd | Betekenis |
|---|---|---|
| ♂ | ♂ M | mannetje |
| ♀ | ♀ V | vrouwtje |

Dit geldt overal in soortdata: in `geslachts_notities_m`, `geslachts_notities_f`, `leeftijds_notities_vj`, `determinatie_id_notities`, `vangst_checklist`, uitleg-teksten in determinatiehulpen, en alle overige vrije tekstvelden.

---

- **`leeftijds_notities_nj` ALTIJD `''` (lege string).** Zodra dit veld inhoud heeft, valt `SoortDetail.jsx` terug naar "klassieke modus" die `{{MM-MM}}`-blokken niet verwerkt.
- **Alle seizoensgebonden tekst gaat in `leeftijds_notities_vj`**, ook herfst-specifieke passages. Gebruik `{{07-12}}` en `{{01-06}}` blokken om tekst per seizoen te tonen.
- `{{MM1-MM2}}` toont de inhoud alleen als de huidige maand binnen het bereik valt (jan=1, dec=12). Blokken mogen genest worden maar niet overlappen.
- **⚠️ ELKE alinea krijgt zijn eigen marker.** `renderLeeftijdMarkdown` splitst op `\n\n` en filtert per alinea — alleen alinea's die zélf beginnen met `{{MM-MM}}` worden gefilterd. Alinea's zónder marker verschijnen in BEIDE tabbladen. Bij meerdere alinea's per seizoen dus elke alinea herhalen met de marker:
  ```
  {{07-12}}
  **1e kj (3)**
  Tekst...

  {{07-12}}
  **na 2e kj (6)**
  Tekst...

  {{01-06}}
  **2e kj (5)**
  Tekst...
  ```

#### Bron-velden
Alle literatuurverwijzingen uitsluitend in:
`bron_biometrie`, `bron_leeftijdsbepaling`, `bron_geslacht`, `bron_id_kenmerken`, `bron_ondersoorten`, `bron_ring`
Formaat: `'Demongin (2020) p.XXX'`
**Nooit** een bronnaam inline in lopende tekst zetten.

#### Andere velden
- `determinatie_id_notities` — veld-identificatiekenmerken (wat zie je aan de vogel). Geen leeftijds- of geslachtsinformatie hier. **Altijd opnemen als Demongin dit vermeldt: afwijkende vogels (aberrant), hybridisatie en verwisselbare soorten.** Gebruik "Afwijkende vogels" als koptekst (niet "Aberrante vogels").
- `vangst_checklist` — array van strings: wat te controleren bij vangst, alleen wat in bron staat
- `referenties_literatuur` — array van strings (bijv. `'Jenni & Winkler (1994)'`): de REFERENCES-sectie uit Demongin. Wordt getoond als inklapbare "Literatuur"-sectie onderaan de soortenpagina.
- `ondersoorten` — array van `{ naam, verspreiding, kenmerken }`, "ringers" niet "ringaars"
- `eerste_broedleeftijd` — string zoals `'2Y'`
- `nestgegevens` — `{ eileg, broedels, eieren_min, eieren_max, broedtijd_min, broedtijd_max, nestjong_min, nestjong_max, broedzorg_dagen_min, broedzorg_dagen_max }`

#### Script uitvoeren
```bash
node scripts/update-[soort]-data.js
```
Controleer output op errors. Bij success: ✓ Updated [soort].

---

### Stap 2 — Determinatiehulp (altijd proberen)

Als de brontekst criteria bevat voor leeftijds- of geslachtsbepaling: maak een determinatiehulp.

#### Architectuur
| Laag | Bestand | Formaat |
|---|---|---|
| Static fallback | `src/data/determinatie/[familie].js` | Native JS-functies (`transform`, `bereken`) |
| Supabase | `scripts/seed-[soort]-determinatie.js` | `transform_type` strings, `bereken_type` + `bereken_config` |
| Interpreter | `src/utils/determinatie-interpreter.js` | Converteert strings → functies via `hydrateAid()` |
| Registry | `src/data/determinatie/index.js` | Importeert alle familie-bestanden |

#### Familie-bestanden (static fallback)
Bestaande bestanden:
- `corvidae.js` — Roek (EURING 15820), Kauw (15980)
- `columbidae.js` — Houtduif (06700)
- `ficedula.js` — Bonte Vliegenvanger (13490)

Nieuwe familie → nieuw bestand `[familie].js` exporteert `export const [familie] = [...]`.
Daarna in `index.js` importeren en toevoegen aan `alleAids`.

#### Seizoen-split
Vrijwel altijd is een seizoen-stap de eerste stap. Gebruik `uit_formulier` om het vangstdatum-veld automatisch om te zetten:
- Static: `transform: datumNaarPeriode` (functie bovenaan het bestand definiëren)
- Supabase: `transform_type: 'datum_naar_periode'`

`datumNaarPeriode` → jan–mei = `'jan_mei'`, jun–dec = `'jun_dec'`

#### Stap-typen
- `keuze` — meerkeuze, elke optie heeft `waarde` + `label` + (`volgende` of `resultaat`)
- `meting` — numerieke invoer, heeft `inputs[]` en `bereken_type` + `bereken_config`

#### Bereken-typen (meting-stappen)
| `bereken_type` | Gebruik |
|---|---|
| `drempelwaarde` | Één drempel: ≥ drempel → resultaat A, < drempel → resultaat B |
| `lineaire_grenswaarde` | Lineaire formule met M/F grenzen |
| `tf6_verschil` | TF6-specifieke berekening |

`drempelwaarde` config:
```js
bereken_config: {
  veld: 'kopbreedte',
  drempel: 22,
  resultaat_groter_gelijk: { waarde: 'M', label: '...', zeker: false, uitleg_template: '...' },
  resultaat_kleiner:        { waarde: 'F', label: '...', zeker: false, uitleg_template: '...' },
}
```
`uitleg_template` mag `{v}` (ingevoerde waarde) en `{drempel}` bevatten.

#### Resultaat-object
```js
resultaat: {
  waarde: '3',        // EURING-code (leeftijd) of 'M'/'F'/'U' (geslacht)
  label: '1e kj',    // leesbare naam
  zeker: false,       // true alleen als kenmerk absoluut onderscheidend is
  uitleg: '...',      // uitleg voor de ringer
  fallback_waarde: 'U', // optioneel: als waarde null is, gebruik dit als fallback
}
```

#### Onzekere gevallen
Als geslachtsbepaling niet mogelijk is (overlap 1e kj herfst e.d.):
```js
resultaat: { waarde: null, fallback_waarde: 'U', label: 'Niet te bepalen', zeker: false, uitleg: '...' }
```

#### Seed-script uitvoeren
```bash
node scripts/seed-[soort]-determinatie.js
```

---

### Stap 3 — Uitvoeren (zie verplichte volgorde bovenaan deze sectie)

Volg de 6 stappen bovenaan deze sectie. Stap 2–4 (determinatiehulp) nooit overslaan, ook niet als er niet expliciet om gevraagd wordt.

### Versie-conventies
- Minor bump (x.**Y**.0) per nieuwe soort of functie
- Patch bump (x.x.**Z**) voor fixes op bestaande data
- Changelog in NL + EN + DE
