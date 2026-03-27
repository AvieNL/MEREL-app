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
