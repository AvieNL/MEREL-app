export const VERSIE = '1.3.2';

export const CHANGELOG = [
  {
    versie: '1.3.2',
    datum: '2026-03-21',
    wijzigingen: [
      'Performance: useProjects — allProjects in useMemo, herberekening alleen bij wijziging van projects/sharedProjects',
      'Performance: useProjects.pullMyAupis — twee Supabase-queries parallel via Promise.all (was: sequentieel)',
      'Performance: SyncContext.processQueue — wachtrij-items parallel verwerkt via Promise.allSettled (was: sequentieel)',
      'Performance: CloudStatus — vier lokale Dexie-tellingen samengevoegd tot één gecombineerde query',
    ],
  },
  {
    versie: '1.3.1',
    datum: '2026-03-21',
    wijzigingen: [
      'Tests: Vitest opgezet — 56 unit tests voor dateHelper, bioHelper en Griel XML-export',
      'Tests: exportGriel dekt datum/tijd-conversie, geslacht, pullus-velden, XML-escaping en biometrie',
    ],
  },
  {
    versie: '1.3.0',
    datum: '2026-03-21',
    wijzigingen: [
      'i18n: volledige vertaling van alle resterende pagina\'s — Header, ErrorBoundary, MigrationBanner, SyncIndicator, Vangstlijst, Statistieken, Admin, Soorten, Ringstrengen, Projecten en Over-pagina',
      'i18n: ~150 nieuwe vertalingssleutels per taal (NL/EN/DE) in common en errors namespace',
      'i18n: foutmeldingen voor export, import, admin en projecten vertaald in errors namespace',
    ],
  },
  {
    versie: '1.2.6',
    datum: '2026-03-21',
    wijzigingen: [
      'i18n: meertalige ondersteuning — taalwisselaar toegevoegd in Instellingen (Nederlands, English, Deutsch)',
      'i18n: navigatie, loginscherm, instellingenpagina, cloudsynchronisatiestatus en systeemmeldingen vertaald',
      'i18n: taalvoorkeur wordt opgeslagen in localStorage en automatisch herkend via browsertaal',
    ],
  },
  {
    versie: '1.2.5',
    datum: '2026-03-21',
    wijzigingen: [
      'Fix: CloudStatus controleerde alleen de eerste van drie Supabase-aanroepen op fouten — nu worden alle drie gecontroleerd',
      'Fix: stille fout bij projecten-pull vervangen door assertNoError — fout is nu zichtbaar in console',
      'Stabiliteit: assertNoError helper toegevoegd aan supabaseHelper voor uniform foutpatroon',
      'DX: supabase.js gooit nu een duidelijke fout bij ontbrekende omgevingsvariabelen in development',
    ],
  },
  {
    versie: '1.2.4',
    datum: '2026-03-21',
    wijzigingen: [
      'Toegankelijkheid: focus-visible outline toegevoegd voor toetsenbordgebruikers',
      'Toegankelijkheid: :disabled stijl voor knoppen — uitgeschakelde knoppen zijn nu visueel onderscheidbaar',
      'Toegankelijkheid: btn-sm minimale tikvlakgrootte verhoogd naar 36×36px',
      'Responsive: form-row valt terug op 1 kolom op schermen ≤ 400px (bijv. iPhone SE)',
      'Toegankelijkheid: prefers-reduced-motion — animaties en transities worden onderdrukt indien gewenst',
    ],
  },
  {
    versie: '1.2.3',
    datum: '2026-03-20',
    wijzigingen: [
      'Fix: JSONB null-check in useRingStrengen — crash bij ontbrekende data-kolom in Supabase opgelost',
      'Fix: race condition in species/veldconfig/override pulls — boolean flag vervangen door Promise-referentie',
      'Fix: updateRecord toont nu een foutmelding als de lokale schrijfoperatie mislukt (was: stille fout)',
      'UX: verloren sync-items tonen nu de naam en datum van de betrokken vangst in CloudStatus',
    ],
  },
  {
    versie: '1.2.2',
    datum: '2026-03-20',
    wijzigingen: [
      'Toegankelijkheid: aria-label toegevoegd aan alle icoon-knoppen (✕ sluiten, verwijderen) in 6 componenten',
      'UX: lege staat toegevoegd aan Soorten — toont melding als zoekresultaat leeg is',
      'HTML: meta description toegevoegd',
      'Refactor: harde kleurwaarden in Charts.jsx samengevoegd in benoemde constanten',
    ],
  },
  {
    versie: '1.2.1',
    datum: '2026-03-20',
    wijzigingen: [
      'Sync: wachtrij-deduplicatie — meerdere edits van hetzelfde record offline worden samengevoegd tot één upsert',
      'Sync: exponentiële backoff na mislukking (30s → 60s → 120s → … → max 8 min) — Supabase niet langer elke seconde aangesproken bij storingen',
      'Sync: backoff wordt gereset bij herverbinding — items worden direct opnieuw geprobeerd als internet terugkomt',
    ],
  },
  {
    versie: '1.2.0',
    datum: '2026-03-20',
    wijzigingen: [
      'Refactor: fetchAllPages helper in utils/supabaseHelper.js — dubbel pagineringspatroon in useRecords en useSpeciesRef samengevoegd',
      'Refactor: useBioRanges hook — 5 biometrie-useMemos uit NieuwPage geëxtraheerd naar src/hooks/useBioRanges.js',
    ],
  },
  {
    versie: '1.1.9',
    datum: '2026-03-20',
    wijzigingen: [
      'Performance: AdminPage N+1 opgelost — vangstentelling per gebruiker in één Supabase-request i.p.v. één per gebruiker',
      'Performance: filterByDatum in StatsPage in useCallback — stabiele referentie bij export',
    ],
  },
  {
    versie: '1.1.8',
    datum: '2026-03-20',
    wijzigingen: [
      'Performance: soortzoekopdracht debouncet op 150ms — zoeken door 3500+ soorten niet meer op elke toetsaanslag',
      'Performance: update, toggleSection, handleSpeciesInput, updateRuikaart e.a. in useCallback — stabiele referenties',
    ],
  },
  {
    versie: '1.1.7',
    datum: '2026-03-20',
    wijzigingen: [
      'Offline: QuotaExceededError afgevangen in sync-wachtrij — gebruiker krijgt een duidelijke melding bij vol apparaat',
      'Offline: opslaggebruik zichtbaar in Instellingen → Cloudstatus (oranje waarschuwing boven 80%)',
    ],
  },
  {
    versie: '1.1.6',
    datum: '2026-03-20',
    wijzigingen: [
      'UX: ToastContext toegevoegd — gecentraliseerde meldingen in de gehele app',
      'UX: export- en importmeldingen in StatsPage tonen nu als toast (niet langer inline)',
    ],
  },
  {
    versie: '1.1.5',
    datum: '2026-03-20',
    wijzigingen: [
      'Security: AdminPage gebruikt nu realRol (Supabase) i.p.v. simulatedRole voor toegangscontrole',
      'Stability: ErrorBoundary toegevoegd — crashes tonen nu een herstelbaar foutscherm i.p.v. een lege pagina',
      'Validatie: importbestand wordt gecontroleerd op verplichte velden (vogelnaam, ringnummer, vangstdatum) vóór opslaan',
    ],
  },
  {
    versie: '1.1.4',
    datum: '2026-03-20',
    wijzigingen: [
      'Refactor: SoortDetail opgesplitst — editor-modus in SoortDetailEditor.jsx (1022 → 712 regels)',
      'Refactor: computeBioRanges gecentraliseerd in utils/bioHelper.js — NieuwPage en SoortDetail gebruiken dezelfde logica',
      'Refactor: species-pull gecentraliseerd in SyncContext — useSpeciesRef leest alleen nog uit de lokale cache',
      'Docs: merge-prioriteit gedocumenteerd in useSpeciesOverrides.getMerged()',
    ],
  },
  {
    versie: '1.1.3',
    datum: '2026-03-20',
    wijzigingen: [
      'Refactor: hamburger-icoon vervangen door inline SVG',
      'Refactor: formatDatumTijd toegevoegd aan dateHelper — dubbele implementatie in RecordsPage verwijderd',
      'Refactor: STATS_UITGESLOTEN vereenvoudigd van Set naar array',
    ],
  },
  {
    versie: '1.1.2',
    datum: '2026-03-20',
    wijzigingen: [
      'PWA: PNG-iconen gegenereerd (192×192 en 512×512) — manifest verwees naar ontbrekende bestanden',
      'PWA: maskable icon toegevoegd voor betere weergave op Android',
      'PWA: shortcuts toegevoegd (Nieuwe vangst, Vangsten, Statistieken) voor snelle toegang vanuit het homescreen',
    ],
  },
  {
    versie: '1.1.1',
    datum: '2026-03-20',
    wijzigingen: [
      'UX: exportfout toont nu een sluitknop (✕) en exportknoppen zijn uitgeschakeld tijdens export',
      'Fix: app blijft niet meer hangen als profiel laden mislukt (altijd setLoading(false))',
      'Fix: foutmelding bij mislukte soortenpull zichtbaar in Cloudstatus',
    ],
  },
  {
    versie: '1.1.0',
    datum: '2026-03-20',
    wijzigingen: [
      'Performance: React.lazy code-splitting — hoofdbundel 806 kB → 687 kB',
      'Performance: Leaflet niet langer dubbel geladen (CDN verwijderd, alleen npm-bundel)',
      'Performance: VangstKaart laadt Leaflet nu via dynamic import i.p.v. window.L',
      'Performance: db.species.orderBy gebruikt index i.p.v. volledige tabel scan',
    ],
  },
  {
    versie: '1.0.9',
    datum: '2026-03-20',
    wijzigingen: [
      'Security: DOMPurify toegevoegd aan renderMarkdown als extra sanitatielaag',
    ],
  },
  {
    versie: '1.0.8',
    datum: '2026-03-20',
    wijzigingen: [
      'Refactor: NieuwPage opgesplitst in 7 sectiecomponenten via NieuwFormContext',
      'Refactor: NieuwPage haalt data zelf op via hooks — geen props meer vanuit App',
    ],
  },
  {
    versie: '1.0.7',
    datum: '2026-03-20',
    wijzigingen: [
      'Sync: verloren wijzigingen (na 5 mislukte pogingen) worden zichtbaar gemeld in Instellingen → Cloudstatus',
      'Refactor: executeQueueItem verplaatst naar utils/syncQueue.js (betere scheiding van verantwoordelijkheden)',
    ],
  },
  {
    versie: '1.0.6',
    datum: '2026-03-20',
    wijzigingen: [
      'Security: SUPABASE_SERVICE_KEY verwijderd uit .env.local (niet gebruikt, hoort niet in client-omgeving)',
      'PWA: Service Worker van autoUpdate naar prompt — update-banner werkt nu correct',
    ],
  },
  {
    versie: '1.0.5',
    datum: '2026-03-20',
    wijzigingen: [
      'Grote opruiming: alle historische seed- en migratiebestanden verwijderd (data zit volledig in Supabase)',
      'useRecords: statische JSON-import van buitenland/andere-banen vervangen door Supabase pull',
      'App-bundel verkleind van ~2.6 MB naar ~1.0 MB',
    ],
  },
  {
    versie: '1.0.4',
    datum: '2026-03-20',
    wijzigingen: [
      'Opruiming: euring-codes.json fallback verwijderd — alle 3565 soorten hebben EURING-code in Supabase',
    ],
  },
  {
    versie: '1.0.3',
    datum: '2026-03-20',
    wijzigingen: [
      'Opruiming: species-reference.json en generate-species-sql.js verwijderd (niet langer nodig, Supabase is gevuld)',
    ],
  },
  {
    versie: '1.0.2',
    datum: '2026-03-20',
    wijzigingen: [
      'Fix: taalfout "ringen ontbreekt" gecorrigeerd naar "ringen ontbreken" bij ringstrengen',
    ],
  },
  {
    versie: '1.0.1',
    datum: '2026-03-20',
    wijzigingen: [
      'Over-pagina: app-beschrijving herschreven en boven Maker geplaatst',
      'Maker: ringernummer verwijderd, e-mailadres toegevoegd',
      'Versienummer achter de paginatitel geplaatst',
      'Bronnen aangevuld en gesorteerd: auteurs, Griel-specificatie, Handkenmerken, Demongin, Leaflet',
    ],
  },
  {
    versie: '1.0.0',
    datum: '2026-03-20',
    wijzigingen: [
      'Vangsten registreren met volledig EURING/Griel invoerformulier',
      'Offline werking als PWA met service worker',
      'Griel XML en CSV export',
      'Supabase cloud synchronisatie met offline wachtrij',
      'Soortenpagina met biometrie-referentie en eigen vangststatistieken',
      'Ruikaart met visueel ruiscore-diagram',
      'Projecten en ringstrengen beheer',
      'Statistieken, grafieken en kaartweergave',
      'Donker / licht / systeem thema',
      'Meerdere gebruikers met rolbeheer (admin / ringer / viewer)',
      'Admin panel voor gebruikersbeheer en ruitypen configuratie',
      'Instellingen: hulpweergave, synchronisatiestatus, mijn gegevens',
    ],
  },
];
