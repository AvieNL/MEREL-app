# VRS Breedenbroek - Vogelringregistratie App

## Wat is dit?
Een PWA (Progressive Web App) voor vogelringers om vangsten te registreren in het veld. De app werkt offline en exporteert naar Griel XML-formaat voor het Vogeltrekstation.

## Eigenaar
Thijs ter Avest - VRS Breedenbroek (Gelderland)
Ringernummer: 3254

## Tech stack
- React 18 met Vite als bundler
- Vanilla CSS met CSS custom properties (geen Tailwind)
- Supabase als backend + localStorage/IndexedDB (Dexie) voor offline cache
- Service Worker voor offline gebruik

## Projectstructuur
```
src/
  components/     # React componenten, elk in eigen map
  data/           # Statische data (soorten, EURING codes, Griel import)
  hooks/          # Custom hooks (useRecords, useProjects)
  utils/          # Export functies (Griel XML, CSV), storage helpers
  styles/         # CSS theme en globale stijlen
public/           # PWA manifest, service worker, icons
```

## Design
- Donker thema: achtergrond #0f172a, accent #38bdf8, succes #22c55e
- Mobile-first responsive, minimaal 44px touch targets
- Nederlandse UI-teksten
- Inklapbare formulier-secties voor snelle invoer

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
- Soorten (~3565) komen uit Supabase (`species` tabel), offline gecached in Dexie. Inclusief EURING-codes, namen, ringmaat, ruitype, nestdata, boeken en biometrie.
- `data/griel-import.json` - 436 bestaande vangsten uit Griel-export (eenmalige historische import)

## Soortenpagina's
De app heeft een "Soorten" pagina met voor elke vogelsoort een detailpagina.
Data komt uitsluitend uit Supabase (via `useSpeciesRef` hook → Dexie cache).

Elke soortpagina toont:
- Namen (NL, Latijn, Engels, Duits)
- Ringmaat, ruitype
- Nestgegevens (eileg, broedels, eieren, ei-dagen, jong-dagen, broedzorg)
- Determinatieboeken met paginanummers
- Vangststatistieken van de gebruiker (uit opgeslagen records)

### Biometrie-validatie bij invoer
Als een soort wordt geselecteerd in het invoerformulier:
1. Toon de ringmaat en ruitype als info-balk
2. Controleer ingevoerde biometrie tegen bekende min/max ranges
3. Toon een gele waarschuwing als een waarde buiten de normale range valt
4. Blokkeer NIET het opslaan (het is een waarschuwing, geen fout)

De ranges worden opgebouwd vanuit de opgeslagen vangsten van die soort
(neem min en max van bestaande data + 10% marge).

## Commando's
- `npm run dev` - development server op localhost
- `npm run build` - productie build naar dist/
- `npm run preview` - preview van productie build

## Conventies
- Componentnamen in PascalCase
- Hook namen beginnen met `use`
- Nederlandse variabelenamen voor domein-specifieke concepten (vangst, soort, ringnummer)
- Engelse namen voor technische concepten (state, handler, export)
