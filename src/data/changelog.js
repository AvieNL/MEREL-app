export const VERSIE = '1.0.9';

export const CHANGELOG = [
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
