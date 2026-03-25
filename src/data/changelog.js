export const VERSIE = '1.51.1';

export const CHANGELOG = [
  {
    versie: '1.51.1',
    datum: '2026-03-25',
    wijzigingen: [
      'Fix: recente vangsten op soortdetailpagina gesorteerd op meest recente datum (via toYMD-normalisatie)',
    ],
    wijzigingen_en: [
      'Fix: recent catches on species detail page sorted by most recent date (via toYMD normalisation)',
    ],
    wijzigingen_de: [
      'Fix: Letzte Fänge auf der Artdetailseite nach neuestem Datum sortiert (via toYMD-Normalisierung)',
    ],
  },
  {
    versie: '1.51.0',
    datum: '2026-03-25',
    wijzigingen: [
      'Fix: projecten niet meer dubbel door eigen gebruiker in project_members te filteren op DB-niveau',
      'Feat: project, vangstmethode en locatie worden tot middernacht bewaard via localStorage (dagdefaults)',
    ],
    wijzigingen_en: [
      'Fix: projects no longer duplicated by filtering own user from project_members at DB level',
      'Feat: project, catch method and location are retained until midnight via localStorage (day defaults)',
    ],
    wijzigingen_de: [
      'Fix: Projekte nicht mehr doppelt durch Filterung des eigenen Nutzers aus project_members auf DB-Ebene',
      'Feat: Projekt, Fangmethode und Standort werden bis Mitternacht via localStorage gespeichert (Tagesstandards)',
    ],
  },
  {
    versie: '1.50.0',
    datum: '2026-03-24',
    wijzigingen: [
      'Feat: stats-pagina toont "Biometrie extremen" — zwaarste, lichtste, langste en kortste vogel per meting (excl. pulli)',
      'Feat: soortdetailpagina toont biometrie-extremen (max/min per meting) in "Mijn vangsten" (excl. pulli)',
    ],
    wijzigingen_en: [
      'Feat: stats page shows "Biometry extremes" — heaviest, lightest, longest and shortest bird per measurement (excl. pulli)',
      'Feat: species detail page shows biometry extremes (max/min per measurement) in "My catches" (excl. pulli)',
    ],
    wijzigingen_de: [
      'Feat: Statistikseite zeigt "Biometrie-Extreme" — schwerster, leichtester, längster und kürzester Vogel pro Messung (ohne Nestjunge)',
      'Feat: Artdetailseite zeigt Biometrie-Extreme (Max/Min pro Messung) in "Meine Fänge" (ohne Nestjunge)',
    ],
  },
  {
    versie: '1.49.0',
    datum: '2026-03-24',
    wijzigingen: [
      'Fix: ringnummer in teruggevangen-tabel is nu een tekstlink (geen knop)',
      'Fix: tabel herschikt van 7 naar 5 kolommen — soort/ring/kast gecombineerd in één "Vogel"-kolom',
    ],
    wijzigingen_en: [
      'Fix: ring number in recaptured table is now a text link (not a button)',
      'Fix: table restructured from 7 to 5 columns — species/ring/box combined into one "Bird" column',
    ],
    wijzigingen_de: [
      'Fix: Ringnummer in der Wiederangefangen-Tabelle ist jetzt ein Textlink (kein Button)',
      'Fix: Tabelle von 7 auf 5 Spalten umstrukturiert — Art/Ring/Kasten in einer "Vogel"-Spalte zusammengefasst',
    ],
  },
  {
    versie: '1.48.0',
    datum: '2026-03-24',
    wijzigingen: [
      'Fix: teruggevangen-tabel toont plaatsnaam (google_plaats / nesadres) in plaats van coördinaten',
    ],
    wijzigingen_en: [
      'Fix: recaptured table shows place name (google_plaats / nest address) instead of coordinates',
    ],
    wijzigingen_de: [
      'Fix: Wiederangefangen-Tabelle zeigt Ortsname (google_plaats / Nestadresse) statt Koordinaten',
    ],
  },
  {
    versie: '1.47.0',
    datum: '2026-03-24',
    wijzigingen: [
      'Feat: ringnummers in teruggevangen-tabel zijn klikbaar en openen de vogel in de vangstlijst',
      'Feat: kolomtitels in teruggevangen-tabel zijn klikbaar om te sorteren (▲/▼)',
      'Feat: kastnummer toont nu ook de omschrijving van het nest',
    ],
    wijzigingen_en: [
      'Feat: ring numbers in recaptured table are clickable and open the bird in the records list',
      'Feat: column headers in recaptured table are clickable for sorting (▲/▼)',
      'Feat: nest box number now also shows the nest description',
    ],
    wijzigingen_de: [
      'Feat: Ringnummern in der Wiederangefangen-Tabelle sind anklickbar und öffnen den Vogel in der Fangliste',
      'Feat: Spaltenüberschriften in der Wiederangefangen-Tabelle sind zum Sortieren anklickbar (▲/▼)',
      'Feat: Nistkastennummer zeigt jetzt auch die Nestbeschreibung',
    ],
  },
  {
    versie: '1.46.0',
    datum: '2026-03-24',
    wijzigingen: [
      'Fix: teruggevangen nestringen toont nu alle geringde vogels (pulli én adulten), niet alleen via vangst_id',
      'Fix: dagen tussen vangsten was NaN door dd-mm-yyyy datumformaat — opgelost met robuuste toISO-conversie',
    ],
    wijzigingen_en: [
      'Fix: recaptured nest rings now includes all ringed birds (pulli and adults), not only via vangst_id',
      'Fix: days between catches was NaN due to dd-mm-yyyy date format — fixed with robust toISO conversion',
    ],
    wijzigingen_de: [
      'Fix: Wiederangefangene Nestringe zeigt jetzt alle beringten Vögel (Nestjunge und Adulte), nicht nur via vangst_id',
      'Fix: Tage zwischen Fängen war NaN wegen dd-mm-yyyy-Datumsformat — mit robuster toISO-Konvertierung behoben',
    ],
  },
  {
    versie: '1.45.0',
    datum: '2026-03-24',
    wijzigingen: [
      'Fix: datum in teruggevangen-sectie stond dubbel geconverteerd — nu direct weergegeven als dd-mm-yyyy',
      'Fix: vogelsoort in teruggevangen-sectie begint nu met hoofdletter',
    ],
    wijzigingen_en: [
      'Fix: date in recaptured section was double-converted — now displayed directly as dd-mm-yyyy',
      'Fix: species name in recaptured section now starts with capital letter',
    ],
    wijzigingen_de: [
      'Fix: Datum in der Wiederangefangen-Sektion wurde doppelt konvertiert — jetzt direkt als dd-mm-yyyy angezeigt',
      'Fix: Artname in der Wiederangefangen-Sektion beginnt jetzt mit Großbuchstaben',
    ],
  },
  {
    versie: '1.44.0',
    datum: '2026-03-24',
    wijzigingen: [
      'Feat: sectie "Teruggevangen nestringen" toegevoegd aan neststats met eerste/laatste vangst, locatie, afstand (haversine) en dagen',
    ],
    wijzigingen_en: [
      'Feat: "Recaptured nest rings" section added to nest stats with first/last catch, location, distance (haversine) and days',
    ],
    wijzigingen_de: [
      'Feat: Abschnitt "Wiederangefangene Nestringe" zu Niststats hinzugefügt mit Erst-/Letztvang, Standort, Abstand (Haversine) und Tagen',
    ],
  },
  {
    versie: '1.43.0',
    datum: '2026-03-24',
    wijzigingen: [
      'Feat: ringnummers in nestdetail zijn klikbare links die direct naar de juiste vogel op de vangstpagina navigeren',
    ],
    wijzigingen_en: [
      'Feat: ring numbers in nest detail are now clickable links that navigate directly to the correct bird on the records page',
    ],
    wijzigingen_de: [
      'Feat: Ringnummern im Nestdetail sind jetzt anklickbare Links, die direkt zum richtigen Vogel auf der Fangseite navigieren',
    ],
  },
  {
    versie: '1.42.0',
    datum: '2026-03-23',
    wijzigingen: [
      'Fix: AviNest nestsleutel uitgebreid met PERCEELNR zodat nestkastlocaties per perceel uniek zijn',
    ],
    wijzigingen_en: [
      'Fix: AviNest nest key extended with PERCEELNR so nest box locations are unique per property',
    ],
    wijzigingen_de: [
      'Fix: AviNest-Nestschlüssel um PERCEELNR erweitert, sodass Nistkastenstandorte pro Grundstück eindeutig sind',
    ],
  },
  {
    versie: '1.41.0',
    datum: '2026-03-23',
    wijzigingen: [
      'Fix: AviNest import vult ontbrekende verplichte velden (centrale, leeftijd, sexe) correct in voor nestring-records',
    ],
    wijzigingen_en: [
      'Fix: AviNest import correctly fills missing required fields (centrale, leeftijd, sexe) for nestring records',
    ],
    wijzigingen_de: [
      'Fix: AviNest-Import füllt fehlende Pflichtfelder (centrale, leeftijd, sexe) korrekt für nestring-Datensätze',
    ],
  },
  {
    versie: '1.40.0',
    datum: '2026-03-23',
    wijzigingen: [
      'Feat: AviNest TXT-import in de nestmodule (nesten, legsels, bezoeken, ringen)',
      'Feat: preview met nieuwe records, hergebruikte nesten, duplicaten en fouten vóór import',
      'Feat: ringnummers automatisch gekoppeld aan bestaande vangsten bij import',
    ],
    wijzigingen_en: [
      'Feat: AviNest TXT import on the Statistics page (nests, clutches, visits, rings)',
      'Feat: preview showing new records, reused nests, duplicates and errors before import',
      'Feat: ring numbers automatically linked to existing catches on import',
    ],
    wijzigingen_de: [
      'Feat: AviNest TXT-Import auf der Statistikseite (Nester, Gelege, Besuche, Ringe)',
      'Feat: Vorschau mit neuen Datensätzen, wiederverwendeten Nestern, Duplikaten und Fehlern',
      'Feat: Ringnummern werden beim Import automatisch mit vorhandenen Fängen verknüpft',
    ],
  },
  {
    versie: '1.39.0',
    datum: '2026-03-23',
    wijzigingen: [
      'Fix: punten worden automatisch verwijderd uit ringnummers bij invoer (formulier + pulli-ringen)',
    ],
    wijzigingen_en: [
      'Fix: dots are automatically removed from ring numbers on input (form + pulli rings)',
    ],
    wijzigingen_de: [
      'Fix: Punkte werden bei der Eingabe automatisch aus Ringnummern entfernt (Formular + Pulli-Ringe)',
    ],
  },
  {
    versie: '1.38.0',
    datum: '2026-03-23',
    wijzigingen: [
      'Fix: permanentDeleteNest cascadet nu correct (legsel → nestbezoek → nestring) in Dexie en Supabase',
    ],
    wijzigingen_en: [
      'Fix: permanentDeleteNest now correctly cascades (legsel → nestbezoek → nestring) in Dexie and Supabase',
    ],
    wijzigingen_de: [
      'Fix: permanentDeleteNest kaskadiert jetzt korrekt (legsel → nestbezoek → nestring) in Dexie und Supabase',
    ],
  },
  {
    versie: '1.37.0',
    datum: '2026-03-23',
    wijzigingen: [
      'Rename: project hernoemd naar merel-app in GitHub, Vercel, Supabase en package.json',
    ],
    wijzigingen_en: [
      'Rename: project renamed to merel-app in GitHub, Vercel, Supabase and package.json',
    ],
    wijzigingen_de: [
      'Rename: Projekt in GitHub, Vercel, Supabase und package.json zu merel-app umbenannt',
    ],
  },
  {
    versie: '1.36.0',
    datum: '2026-03-23',
    wijzigingen: [
      'Feat: neststats gesplitst in "Te exporteren" en totaaloverzicht (analoog aan ringstats)',
      'Feat: export-tracking voor legsels via exported_at vlag',
      'Feat: soortentabel (alle jaren) uitgebreid met eieren, pulli, succes en sortering',
      'Fix: jaarselectie volledig verwijderd uit neststats — altijd alle data',
    ],
    wijzigingen_en: [
      'Feat: nest stats split into "To export" and total overview (like ring stats)',
      'Feat: export tracking for clutches via exported_at flag',
      'Feat: species table (all years) extended with eggs, chicks, success and sorting',
      'Fix: year filter fully removed from nest stats — always all data',
    ],
    wijzigingen_de: [
      'Feat: Niststats in "Zu exportieren" und Gesamtübersicht aufgeteilt (wie Ringstats)',
      'Feat: Export-Tracking für Gelege via exported_at Flag',
      'Feat: Artentabelle (alle Jahre) um Eier, Küken, Erfolg und Sortierung erweitert',
      'Fix: Jahresfilter vollständig aus Niststats entfernt — immer alle Daten',
    ],
  },
  {
    versie: '1.35.0',
    datum: '2026-03-23',
    wijzigingen: [
      'Feat: app hernoemd naar MEREL — MEld.REgistreer.Log.',
      'Feat: merel (lijster) SVG-logo toegevoegd',
      'Feat: nieuw kleurenpalet — diep zwart achtergrond, oranje merkkleur (#e8720c)',
    ],
    wijzigingen_en: [
      'Feat: app renamed to MEREL — MEld.REgistreer.Log.',
      'Feat: blackbird SVG logo added',
      'Feat: new color palette — deep black background, orange brand color (#e8720c)',
    ],
    wijzigingen_de: [
      'Feat: App umbenannt in MEREL — MEld.REgistreer.Log.',
      'Feat: Amsel SVG-Logo hinzugefügt',
      'Feat: Neues Farbschema — tiefschwarzer Hintergrund, orange Markenfarbe (#e8720c)',
    ],
  },
  {
    versie: '1.34.0',
    datum: '2026-03-23',
    wijzigingen: [
      'Feat: app hernoemd naar WREN — Wing Ringing & Entry for Nesting',
      'Feat: winterkoning SVG-logo toegevoegd aan header en over-pagina',
    ],
    wijzigingen_en: [
      'Feat: app renamed to WREN — Wing Ringing & Entry for Nesting',
      'Feat: wren SVG logo added to header and about page',
    ],
    wijzigingen_de: [
      'Feat: App umbenannt in WREN — Wing Ringing & Entry for Nesting',
      'Feat: Zaunkönig SVG-Logo zu Header und Über-Seite hinzugefügt',
    ],
  },
  {
    versie: '1.33.4',
    datum: '2026-03-23',
    wijzigingen: [
      'Fix: nestbezoek-sync faalde door ontbrekende kolommen in Supabase (stadium2, soort_euring, volgende_bezoek_type)',
      'Fix: volgende_bezoek_type wordt nu opgeslagen bij bezoek (nodig voor iCal-feed)',
    ],
    wijzigingen_en: [
      'Fix: nest visit sync failed due to missing Supabase columns (stadium2, soort_euring, volgende_bezoek_type)',
      'Fix: volgende_bezoek_type is now saved with each visit (required for iCal feed)',
    ],
    wijzigingen_de: [
      'Fix: Nestbesuch-Sync schlug fehl wegen fehlender Supabase-Spalten (stadium2, soort_euring, volgende_bezoek_type)',
      'Fix: volgende_bezoek_type wird jetzt beim Besuch gespeichert (für iCal-Feed erforderlich)',
    ],
  },
  {
    versie: '1.33.3',
    datum: '2026-03-23',
    wijzigingen: [
      'Fix: veldlabel omschrijving nest hernoemd naar "Naam / Omschrijving"',
      'Fix: placeholder omschrijving nieuw nest bijgewerkt met voorbeeld Bb.dD32',
    ],
    wijzigingen_en: [
      'Fix: nest description field renamed to "Name / Description"',
      'Fix: nest description placeholder updated with example Bb.dD32',
    ],
    wijzigingen_de: [
      'Fix: Nestbeschreibungsfeld umbenannt in "Name / Beschreibung"',
      'Fix: Platzhalter Nestbeschreibung mit Beispiel Bb.dD32 aktualisiert',
    ],
  },
  {
    versie: '1.33.2',
    datum: '2026-03-23',
    wijzigingen: [
      'Feat: prullenbak toont ring- en nestmodule apart met modulekleur',
      'Feat: "Alles herstellen" en "Alles verwijderen" per sectie in prullenbak',
    ],
    wijzigingen_en: [
      'Feat: trash page shows ring and nest module separately with module color',
      'Feat: "Restore all" and "Delete all" buttons per section in trash',
    ],
    wijzigingen_de: [
      'Feat: Papierkorb zeigt Ring- und Nestmodul getrennt mit Modulfarbe',
      'Feat: "Alle wiederherstellen" und "Alle löschen" pro Abschnitt im Papierkorb',
    ],
  },
  {
    versie: '1.33.1',
    datum: '2026-03-23',
    wijzigingen: [
      'Fix: prullenbak-knop in hamburgermenu nu 25% transparant (SVG + tekst)',
    ],
    wijzigingen_en: [
      'Fix: trash button in hamburger menu now 25% transparent (SVG + text)',
    ],
    wijzigingen_de: [
      'Fix: Papierkorb-Schaltfläche im Hamburger-Menü jetzt 25% transparent (SVG + Text)',
    ],
  },
  {
    versie: '1.33.0',
    datum: '2026-03-23',
    wijzigingen: [
      'Feat: iCal-export op planningpagina — download .ics of abonneer via webcal-link',
      'Feat: webcal-abonnement via Supabase Edge Function (live, automatisch bijgewerkt)',
    ],
    wijzigingen_en: [
      'Feat: iCal export on planning page — download .ics or subscribe via webcal link',
      'Feat: webcal subscription via Supabase Edge Function (live, auto-updated)',
    ],
    wijzigingen_de: [
      'Feat: iCal-Export auf der Planungsseite — .ics herunterladen oder webcal-Link abonnieren',
      'Feat: Webcal-Abonnement über Supabase Edge Function (live, automatisch aktualisiert)',
    ],
  },
  {
    versie: '1.32.1',
    datum: '2026-03-23',
    wijzigingen: [
      'Fix: kopieerknop toegevoegd aan sync-foutmeldingen (CloudStatus + SyncIndicator)',
    ],
    wijzigingen_en: [
      'Fix: copy button added to sync error messages (CloudStatus + SyncIndicator)',
    ],
    wijzigingen_de: [
      'Fix: Kopierschaltfläche zu Sync-Fehlermeldungen hinzugefügt',
    ],
  },
  {
    versie: '1.32.0',
    datum: '2026-03-23',
    wijzigingen: [
      'Feat: nestkastformulier uitgebreid met kasttype en hoogte',
      'Feat: bezoekformulier registreert nu ook dode eieren en dode pulli',
      'Feat: datum eerste ei en marge instelbaar bij aanmaken nieuw legsel',
      'Feat: export nestkastdata als JSON backup, CSV (AviNest-stijl) en XML (nestlocaties)',
      'Data: KASTTYPE_CODES en EIMETHODE_CODES toegevoegd aan sovon-codes',
    ],
    wijzigingen_en: [
      'Feat: nest box form extended with box type and height',
      'Feat: visit form now registers dead eggs and dead chicks',
      'Feat: date of first egg and margin settable when creating new clutch',
      'Feat: export nest box data as JSON backup, CSV (AviNest-style) and XML (nest locations)',
      'Data: KASTTYPE_CODES and EIMETHODE_CODES added to sovon-codes',
    ],
    wijzigingen_de: [
      'Feat: Nistkastenformular mit Kastentyp und Höhe erweitert',
      'Feat: Besuchsformular registriert jetzt auch tote Eier und tote Küken',
      'Feat: Datum des ersten Eis und Toleranz beim Anlegen eines neuen Geleges einstellbar',
      'Feat: Nistkastendaten als JSON-Backup, CSV (AviNest-Stil) und XML (Neststandorte) exportieren',
      'Data: KASTTYPE_CODES und EIMETHODE_CODES zu sovon-codes hinzugefügt',
    ],
  },
  {
    versie: '1.31.9',
    datum: '2026-03-23',
    wijzigingen: [
      'UX: gebruikersnaam en buy-me-a-coffee in header beter leesbaar (opacity verhoogd)',
    ],
    wijzigingen_en: [
      'UX: username and buy-me-a-coffee in header more readable (increased opacity)',
    ],
    wijzigingen_de: [
      'UX: Benutzername und Buy-me-a-coffee in Header besser lesbar (Deckkraft erhöht)',
    ],
  },
  {
    versie: '1.31.8',
    datum: '2026-03-22',
    wijzigingen: [
      'Fix: nestsymbool ⌂ consequent doorgevoerd in zoekresultaten, planningspagina en kaarttooltip',
    ],
    wijzigingen_en: [
      'Fix: nest symbol ⌂ consistently applied in search results, planning page and map tooltip',
    ],
    wijzigingen_de: [
      'Fix: Nestsymbol ⌂ konsequent in Suchergebnissen, Planungsseite und Karten-Tooltip',
    ],
  },
  {
    versie: '1.31.7',
    datum: '2026-03-22',
    wijzigingen: [
      'Fix: nestsymbool ⌂ in bezoekformulieren (was nog #)',
    ],
    wijzigingen_en: [
      'Fix: nest symbol ⌂ in visit forms (was still #)',
    ],
    wijzigingen_de: [
      'Fix: Nestsymbol ⌂ in Besuchsformularen (war noch #)',
    ],
  },
  {
    versie: '1.31.6',
    datum: '2026-03-22',
    wijzigingen: [
      'Fix: status legselblok gebruikt nu datum én tijd als sorteerbasis (was alleen datum)',
    ],
    wijzigingen_en: [
      'Fix: clutch block status now uses date and time as sort basis (was date only)',
    ],
    wijzigingen_de: [
      'Fix: Gelegeblock-Status verwendet jetzt Datum und Uhrzeit als Sortiergrundlage',
    ],
  },
  {
    versie: '1.31.5',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: gekleurde linkerbalk op legselblok (zelfde kleur als nestkaartenlijst)',
    ],
    wijzigingen_en: [
      'Feat: colored left border on clutch block (same color as nest card list)',
    ],
    wijzigingen_de: [
      'Feat: farbiger linker Rand am Gelegeblock (gleiche Farbe wie Nestkartenliste)',
    ],
  },
  {
    versie: '1.31.4',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: gekleurde status-pill (Eieren/Nestjongen/etc.) in legsel-header op nestdetailpagina',
      'Refactor: BROEDSTATUS en getBroedStatus naar gedeelde utility nestPlanning.js',
    ],
    wijzigingen_en: [
      'Feat: colored status pill (Eggs/Nestlings/etc.) in clutch header on nest detail page',
      'Refactor: BROEDSTATUS and getBroedStatus moved to shared utility nestPlanning.js',
    ],
    wijzigingen_de: [
      'Feat: farbige Status-Pille (Eier/Nestjunge/etc.) in Gelege-Header auf Nestdetailseite',
      'Refactor: BROEDSTATUS und getBroedStatus in gemeinsame Utility nestPlanning.js verschoben',
    ],
  },
  {
    versie: '1.31.3',
    datum: '2026-03-22',
    wijzigingen: [
      'Fix: geringde pulli als derde regel in bezoekitem — "Geringd: NLA123, NLA124"',
    ],
    wijzigingen_en: [
      'Fix: ringed chicks as third line in visit item — "Ringed: NLA123, NLA124"',
    ],
    wijzigingen_de: [
      'Fix: beringte Küken als dritte Zeile im Besuchseintrag — "Beringt: NLA123, NLA124"',
    ],
  },
  {
    versie: '1.31.2',
    datum: '2026-03-22',
    wijzigingen: [
      'UX: geringde pullen als inline tekst "Geringd: NLA123, NLA124" in nestbezoek',
    ],
    wijzigingen_en: [
      'UX: ringed chicks shown inline as "Ringed: NLA123, NLA124" in nest visit',
    ],
    wijzigingen_de: [
      'UX: beringte Küken inline als "Beringt: NLA123, NLA124" im Nestbesuch',
    ],
  },
  {
    versie: '1.31.1',
    datum: '2026-03-22',
    wijzigingen: [
      'UX: "Geringd" label boven ringnummers in nestbezoek, onderstreping verwijderd',
    ],
    wijzigingen_en: [
      'UX: "Ringed" label above ring numbers in nest visit, underline removed',
    ],
    wijzigingen_de: [
      'UX: "Beringt" Label über Ringnummern im Nestbesuch, Unterstreichung entfernt',
    ],
  },
  {
    versie: '1.31.0',
    datum: '2026-03-22',
    wijzigingen: [
      'Refactor: verwijderknop per ring in nestmodule verwijderd — cascade via ringmodule volstaat',
    ],
    wijzigingen_en: [
      'Refactor: per-ring delete button in nest module removed — cascade via ring module suffices',
    ],
    wijzigingen_de: [
      'Refactor: Löschen-Schaltfläche pro Ring im Nestmodul entfernt — Kaskade über Ringmodul genügt',
    ],
  },
  {
    versie: '1.30.9',
    datum: '2026-03-22',
    wijzigingen: [
      'UX: ringnummers in nestbezoek als klikbare tekst (geen badge), navigeert naar vangst in ringmodule',
    ],
    wijzigingen_en: [
      'UX: ring numbers in nest visit as clickable text (no badge), navigates to catch in ring module',
    ],
    wijzigingen_de: [
      'UX: Ringnummern im Nestbesuch als klickbarer Text (kein Badge), navigiert zum Fang im Ringmodul',
    ],
  },
  {
    versie: '1.30.8',
    datum: '2026-03-22',
    wijzigingen: [
      'UX: pulli ringen inline in bezoekformulier — geen aparte pagina meer',
    ],
    wijzigingen_en: [
      'UX: pulli ringing inline in visit form — no separate page anymore',
    ],
    wijzigingen_de: [
      'UX: Pulli-Beringen inline im Besuchsformular — keine separate Seite mehr',
    ],
  },
  {
    versie: '1.30.7',
    datum: '2026-03-22',
    wijzigingen: [
      'UX: pulli ringen knop verplaatst van bezoeklijst naar bezoekformulier (zichtbaar bij N-stadium)',
    ],
    wijzigingen_en: [
      'UX: pulli ringing button moved from visit list to visit form (visible for N-stadium)',
    ],
    wijzigingen_de: [
      'UX: Pulli-Beringen Schaltfläche aus Besuchsliste ins Besuchsformular verschoben (bei N-Stadium sichtbar)',
    ],
  },
  {
    versie: '1.30.6',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: nauwkeurigheid pullus leeftijd instelbaar in ringbatch, standaard ±2 dagen',
      'Fix: nauwkeurigheid gebruikte ongeldige codes D/E — nu correcte EURING waarden (0–9, U)',
    ],
    wijzigingen_en: [
      'Feat: pullus age accuracy selectable in ring batch, default ±2 days',
      'Fix: accuracy used invalid codes D/E — now correct EURING values (0–9, U)',
    ],
    wijzigingen_de: [
      'Feat: Altersgenauigkeit im Beringungsformular einstellbar, Standard ±2 Tage',
      'Fix: Genauigkeit verwendete ungültige Codes D/E — jetzt korrekte EURING-Werte (0–9, U)',
    ],
  },
  {
    versie: '1.30.5',
    datum: '2026-03-22',
    wijzigingen: [
      'Fix: placeholder leeftijdveld toont nu "ca. X" in plaats van "~X"',
    ],
    wijzigingen_en: [
      'Fix: age field placeholder now shows "ca. X" instead of "~X"',
    ],
    wijzigingen_de: [
      'Fix: Platzhalter Altersfeld zeigt jetzt "ca. X" statt "~X"',
    ],
  },
  {
    versie: '1.30.4',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: pullus leeftijd (dagen) handmatig invulbaar in ringbatch, overschrijft berekende waarde',
      'Fix: conditie standaard op 8 (nestjong) bij pullusringen',
    ],
    wijzigingen_en: [
      'Feat: pullus age (days) can be entered manually in ring batch, overrides calculated value',
      'Fix: condition defaults to 8 (nestling) when ringing pulli',
    ],
    wijzigingen_de: [
      'Feat: Pullus-Alter (Tage) im Beringungsformular manuell eintragbar, überschreibt Berechnung',
      'Fix: Kondition standardmäßig 8 (Nestling) beim Pulli-Beringen',
    ],
  },
  {
    versie: '1.30.3',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: ringkoppeling (nestring-badge) verwijderbaar via × knopje in nestbezoek',
    ],
    wijzigingen_en: [
      'Feat: ring link (nestring badge) can be removed via × button in nest visit',
    ],
    wijzigingen_de: [
      'Feat: Ringverknüpfung (Nestring-Badge) über × Schaltfläche im Nestbesuch entfernbar',
    ],
  },
  {
    versie: '1.30.2',
    datum: '2026-03-22',
    wijzigingen: [
      'Fix: verwijderen vangst in ringmodule verwijdert nu ook gekoppeld nestring-record in nestmodule',
    ],
    wijzigingen_en: [
      'Fix: deleting a catch in the ring module now also removes the linked nestring record in the nest module',
    ],
    wijzigingen_de: [
      'Fix: Löschen eines Fangs im Ringmodul entfernt jetzt auch den verknüpften Nestberingungseintrag',
    ],
  },
  {
    versie: '1.30.1',
    datum: '2026-03-22',
    wijzigingen: [
      'Fix: pulli ringen — ringernummer en initialen worden nu ingevuld vanuit instellingen',
      'Fix: ringnummer automatisch ingevuld vanuit passende ringstreng (op maat soort), streng schuift door',
      'Fix: pullus leeftijd (2-cijferig) en nauwkeurigheid (D=geschat) correct opgeslagen',
      'Fix: broedselgrootte ingevuld vanuit nestbezoek, aanpasbaar in formulier',
      'Fix: omstandigheid 21, vangstmethode N, conditie 0, vangsttijd en plaatsnaam correct',
    ],
    wijzigingen_en: [
      'Fix: pullus ringing — ringer number and initials now filled from settings',
      'Fix: ring number auto-filled from matching ring series (by species size), series advances',
      'Fix: pullus age (2-digit) and accuracy (D=estimated) correctly saved',
      'Fix: brood size pre-filled from nest visit, editable in form',
      'Fix: circumstances 21, method N, condition 0, catch time and place name correct',
    ],
    wijzigingen_de: [
      'Fix: Pulli-Beringung — Beringernummer und Initialen aus Einstellungen',
      'Fix: Ringnummer aus passender Ringserie (nach Artgröße), Serie rückt vor',
      'Fix: Pullus-Alter (2-stellig) und Genauigkeit (D=geschätzt) korrekt gespeichert',
      'Fix: Brutgröße aus Nestbesuch vorausgefüllt, im Formular anpassbar',
      'Fix: Umstände 21, Methode N, Kondition 0, Fangzeit und Ortsname korrekt',
    ],
  },
  {
    versie: '1.30.0',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: pulli ringen vanuit nestbezoek — batch-invoer per nestjong met Griel-koppeling',
      'Feat: elke pullus opgeslagen als vangst (Griel-export) én gekoppeld aan nestbezoek',
      'Feat: locatie nestkast als ringlocatie, nestnummer+naam in Griel-opmerking',
      'Feat: Griel-project voor nestkastonderzoek instelbaar in instellingen',
    ],
    wijzigingen_en: [
      'Feat: ring pulli from nest visit — batch entry per nestling with Griel link',
      'Feat: each pullus saved as catch record (Griel export) and linked to nest visit',
      'Feat: nest box location as ringing location, nest number+name in Griel remarks',
      'Feat: Griel project for nest box research configurable in settings',
    ],
    wijzigingen_de: [
      'Feat: Pulli vom Nestbesuch beringen — Stapeleingabe mit Griel-Verknüpfung',
      'Feat: jeder Pullus als Fangdatensatz gespeichert und mit Nestbesuch verknüpft',
      'Feat: Nistkastenstandort als Beringungsort, Kastnummer+Name in Griel-Bemerkung',
      'Feat: Griel-Projekt für Nistkastenforschung in Einstellungen konfigurierbar',
    ],
  },
  {
    versie: '1.29.11',
    datum: '2026-03-22',
    wijzigingen: [
      'Fix: bewerk- en verwijderknop bezoek rechts uitgelijnd in één blok',
    ],
    wijzigingen_en: [
      'Fix: edit and delete buttons right-aligned as a group in visit row',
    ],
    wijzigingen_de: [
      'Fix: Bearbeiten- und Löschen-Schaltfläche rechts ausgerichtet als Gruppe',
    ],
  },
  {
    versie: '1.29.10',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: nestbezoek verwijderen met bevestigingsdialog (🗑️ knop per bezoek)',
    ],
    wijzigingen_en: [
      'Feat: delete nest visit with confirmation dialog (🗑️ button per visit)',
    ],
    wijzigingen_de: [
      'Feat: Nestbesuch löschen mit Bestätigungsdialog (🗑️-Schaltfläche pro Besuch)',
    ],
  },
  {
    versie: '1.29.9',
    datum: '2026-03-22',
    wijzigingen: [
      'Fix: vogelsoort bij bezoek alleen getoond als afwijkend van legselsoort',
    ],
    wijzigingen_en: [
      'Fix: species shown on visit row only when different from clutch species',
    ],
    wijzigingen_de: [
      'Fix: Vogelart bei Besuch nur angezeigt wenn abweichend von Gelegart',
    ],
  },
  {
    versie: '1.29.8',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: bezoekregels opgesplitst — datum+volgende datum (r1), soort+status+aantallen (r2)',
      'Fix: emoji vervangen door tekst bij eieren/jongen',
      'Fix: vertalingen btn_edit en btn_delete toegevoegd',
      'Fix: bewerkknop bezoek rechts uitgelijnd',
    ],
    wijzigingen_en: [
      'Feat: visit rows split — date+next date (r1), species+status+counts (r2)',
      'Fix: emoji replaced by text for eggs/chicks',
      'Fix: translations added for btn_edit and btn_delete',
      'Fix: edit button aligned to the right in visit row',
    ],
    wijzigingen_de: [
      'Feat: Besuchszeilen aufgeteilt — Datum+nächstes Datum (Z1), Art+Status+Anzahl (Z2)',
      'Fix: Emoji durch Text für Eier/Junge ersetzt',
      'Fix: Übersetzungen für btn_edit und btn_delete hinzugefügt',
      'Fix: Bearbeitungsschaltfläche rechts ausgerichtet',
    ],
  },
  {
    versie: '1.29.7',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: vervolgbezoek-suggestiedatum als gekleurde pill in nestdetailpagina (groen/geel/oranje/rood op urgentie)',
    ],
    wijzigingen_en: [
      'Feat: next-visit suggestion date shown as coloured urgency pill in nest detail page',
    ],
    wijzigingen_de: [
      'Feat: Folgebesuch-Datum als farbige Dringlichkeitspille in der Nestdetailseite',
    ],
  },
  {
    versie: '1.29.6',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: kastnummer groot weergegeven in header nestdetailpagina',
      'Feat: adres getoond i.p.v. coördinaten in nestdetail als bekend',
      'Feat: nestsymbool ⌂ voor kastnummer in lijst en detailpagina',
      'Fix: ✏️-knop bezoek direct na bezoekdata, vóór vervolgbezoek-suggestie',
      'Fix: vervolgbezoek-suggestiedatum getoond als dd-mm-yyyy',
    ],
    wijzigingen_en: [
      'Feat: nest number displayed prominently in nest detail header',
      'Feat: address shown instead of coordinates in nest detail when available',
      'Feat: nest symbol ⌂ before nest number in list and detail page',
      'Fix: ✏️ edit button placed directly after visit data, before next-visit suggestion',
      'Fix: next-visit suggestion date shown as dd-mm-yyyy',
    ],
    wijzigingen_de: [
      'Feat: Kastenummer groß im Nestkopf angezeigt',
      'Feat: Adresse statt Koordinaten im Nestdetail wenn vorhanden',
      'Feat: Nestsymbol ⌂ vor Kastnummer in Liste und Detailseite',
      'Fix: ✏️-Schaltfläche direkt nach Besuchsdaten, vor Folgebesuch-Vorschlag',
      'Fix: Folgebesuch-Datum wird als dd-mm-yyyy angezeigt',
    ],
  },
  {
    versie: '1.29.5',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: bezoek aan nest wijzigen — nieuw bewerkscherm per nestbezoek (✏️ knop in tijdlijn)',
    ],
    wijzigingen_en: [
      'Feat: edit nest visit — new edit page per nest visit (✏️ button in timeline)',
    ],
    wijzigingen_de: [
      'Feat: Nestbesuch bearbeiten — neue Bearbeitungsseite pro Nestbesuch (✏️-Schaltfläche in Zeitachse)',
    ],
  },
  {
    versie: '1.29.4',
    datum: '2026-03-22',
    wijzigingen: [
      'Fix: stadiumcodes E1–E7 tonen nu broedstatus (koud/warm/bebroed/etc.) i.p.v. foutief aantal eieren',
    ],
    wijzigingen_en: [
      'Fix: stadium codes E1–E7 now show breeding status (cold/warm/incubated/etc.) instead of incorrect egg count',
    ],
    wijzigingen_de: [
      'Fix: Stadiumcodes E1–E7 zeigen jetzt Brutstatus statt fehlerhafter Eieranzahl',
    ],
  },
  {
    versie: '1.29.3',
    datum: '2026-03-22',
    wijzigingen: [
      'Fix: lokale CSS/JS-wijzigingen alsnog gepusht (NestOverzicht, NieuwBezoek, SyncIndicator)',
      'Fix: sovon-codes uitgebreid met EN/DE vertalingen',
      'Fix: vervolgbezoeksuggestie verfijnd voor E6/E7 stadia',
      'Fix: ververs-knop soortenpagina verwijderd (overbodig)',
    ],
    wijzigingen_en: [
      'Fix: local CSS/JS changes finally pushed (NestOverzicht, NieuwBezoek, SyncIndicator)',
      'Fix: sovon-codes extended with EN/DE translations',
      'Fix: follow-up visit suggestion refined for E6/E7 stages',
      'Fix: refresh button removed from species page (redundant)',
    ],
    wijzigingen_de: [
      'Fix: lokale CSS/JS-Änderungen endlich gepusht',
      'Fix: sovon-codes um EN/DE-Übersetzungen erweitert',
      'Fix: Folgebesuch-Vorschlag für E6/E7-Stadien verfeinert',
      'Fix: Aktualisierungsschaltfläche von der Artenseite entfernt',
    ],
  },
  {
    versie: '1.29.2',
    datum: '2026-03-22',
    wijzigingen: [
      'Fix: service worker bijgewerkt naar autoUpdate — app vernieuwt zichzelf automatisch na nieuwe versie',
      'Fix: dist/ uit git-tracking verwijderd zodat Vercel altijd vers bouwt vanuit broncode',
    ],
    wijzigingen_en: [
      'Fix: service worker switched to autoUpdate — app updates itself automatically after new release',
      'Fix: dist/ removed from git tracking so Vercel always builds fresh from source',
    ],
    wijzigingen_de: [
      'Fix: Service Worker auf autoUpdate umgestellt — App aktualisiert sich nach neuer Version automatisch',
      'Fix: dist/ aus Git-Tracking entfernt, sodass Vercel immer neu aus dem Quellcode baut',
    ],
  },
  {
    versie: '1.29.1',
    datum: '2026-03-22',
    wijzigingen: [
      'Fix: ringnummers overal in de app weergegeven zonder puntjes (SoortDetail, Stats, ProjectDetail, ExternMeldingModal, NestDetail)',
    ],
    wijzigingen_en: [
      'Fix: ring numbers displayed without dots throughout the app',
    ],
    wijzigingen_de: [
      'Fix: Ringnummern werden überall in der App ohne Punkte angezeigt',
    ],
  },
  {
    versie: '1.29.0',
    datum: '2026-03-22',
    wijzigingen: [
      'Refactor: nest_seizoen tussenlaag verwijderd — legsel heeft nu direct nest_id en jaar',
      'Refactor: nestdetailpagina toont platte legsellijst gesorteerd op meest recente bezoek',
      'Fix: soortnaam legsel afgeleid van bezoeken → legsel → nest (correcte prioriteit)',
      'Fix: bezoekdatum in nestoverzicht weergegeven als dd-mm-yyyy',
      'Fix: uniforme terugknop op alle nestpagina\'s (btn-secondary page-back)',
      'Fix: uniforme wijzig/verwijder icoongnoppen op alle pagina\'s (icon-edit-btn / icon-delete-btn)',
    ],
    wijzigingen_en: [
      'Refactor: nest_seizoen intermediate layer removed — legsel now directly has nest_id and jaar',
      'Refactor: nest detail page shows flat clutch list sorted by most recent visit',
      'Fix: species name on clutch derived from visits → clutch → nest (correct priority)',
      'Fix: visit date in nest overview displayed as dd-mm-yyyy',
      'Fix: uniform back button on all nest pages (btn-secondary page-back)',
      'Fix: uniform edit/delete icon buttons on all pages (icon-edit-btn / icon-delete-btn)',
    ],
    wijzigingen_de: [
      'Refactor: nest_seizoen-Zwischenschicht entfernt — Legsel hat jetzt direkt nest_id und jaar',
      'Refactor: Nest-Detailseite zeigt flache Gelegeliste sortiert nach jüngstem Besuch',
      'Fix: Artname des Geleges aus Besuchen → Gelege → Nest abgeleitet (korrekte Priorität)',
      'Fix: Besuchsdatum in der Nestübersicht als dd-mm-yyyy angezeigt',
      'Fix: Einheitliche Zurück-Schaltfläche auf allen Nestseiten',
      'Fix: Einheitliche Bearbeiten/Löschen-Icon-Schaltflächen auf allen Seiten',
    ],
  },
  {
    versie: '1.28.0',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: kastnummer automatisch voorgesteld bij nieuw nest (hoogste + 1)',
      'Feat: eigenaar autocomplete bij nieuw nest — vult ook email en telefoon in',
      'Feat: contextuele toelichting bij nesttype/nestplaats/vondst die om nadere omschrijving vragen',
      'Fix: Leaflet layer-knop niet meer boven de navigatiebalk bij scrollen',
      'Fix: terugknop nestpagina\'s gebruikt juiste stijl en vertaling',
    ],
    wijzigingen_en: [
      'Feat: nest box number auto-suggested when adding new nest (highest + 1)',
      'Feat: owner autocomplete when adding new nest — also fills in email and phone',
      'Feat: contextual note field for nest type/location/discovery codes that require clarification',
      'Fix: Leaflet layer button no longer appears above navigation bar when scrolling',
      'Fix: back button on nest pages uses correct style and translation',
    ],
    wijzigingen_de: [
      'Feat: Kastnummer wird beim neuen Nest automatisch vorgeschlagen (höchste + 1)',
      'Feat: Eigentümer-Autovervollständigung beim neuen Nest — füllt auch E-Mail und Telefon aus',
      'Feat: Kontextuelle Erläuterung bei Nesttyp/Nestplatz/Fund-Codes die Angaben erfordern',
      'Fix: Leaflet-Schicht-Schaltfläche erscheint beim Scrollen nicht mehr über der Navigationsleiste',
      'Fix: Zurück-Schaltfläche auf Nestseiten verwendet korrekten Stil und Übersetzung',
    ],
  },
  {
    versie: '1.27.0',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: nestbezoekmodule volledig vertaald (nl/en/de) — stadia, knoppen, infopaneel, planningsbalk, betrouwbaarheid',
      'Feat: soortzoekopdracht in nestmodule zoekt ook in Engelse en Duitse soortnamen',
    ],
    wijzigingen_en: [
      'Feat: nest visit module fully translated (nl/en/de) — stages, buttons, info panel, planning bar, reliability',
      'Feat: species search in nest module now also searches English and German species names',
    ],
    wijzigingen_de: [
      'Feat: Nestbesuchsmodul vollständig übersetzt (nl/en/de) — Stadien, Schaltflächen, Infopanel, Planungsleiste, Zuverlässigkeit',
      'Feat: Artsuche im Nestmodul sucht jetzt auch englische und deutsche Artnamen',
    ],
  },
  {
    versie: '1.26.0',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: statspagina toont dagrecord vangsten en dagrecord soorten als aparte badges op de stat-kaarten',
    ],
    wijzigingen_en: [
      'Feat: stats page shows day record catches and day record species as separate badges on stat cards',
    ],
    wijzigingen_de: [
      'Feat: Statistikseite zeigt Tagesrekord Fänge und Tagesrekord Arten als separate Badges auf den Stat-Karten',
    ],
  },
  {
    versie: '1.25.1',
    datum: '2026-03-22',
    wijzigingen: [
      'Fix: nestsoort-infopanel toont alle velden altijd in dezelfde stijl (geen highlight bij N-stadium)',
    ],
    wijzigingen_en: [
      'Fix: nest species info panel always shows all fields in consistent style (no highlight on N stage)',
    ],
    wijzigingen_de: [
      'Fix: Nestarten-Infopanel zeigt alle Felder immer einheitlich (kein Highlight bei N-Stadium)',
    ],
  },
  {
    versie: '1.25.0',
    datum: '2026-03-22',
    wijzigingen: [
      'Fix: nestbezoek SOVON-coderingen volledig gecorrigeerd op basis van officieel coderingsdocument (B, E, N, C, P)',
      'Feat: nestbezoek — apart invoerveld voor aantal eieren; gemengd nest (eieren + pulli) mogelijk',
      'Feat: nestplanning — ringmoment gekoppeld aan stadium N6 (slagpennen half volgroeid)',
      'Feat: header — naam en statusindicator links, koffie-link rechts boven knoppen',
      'Fix: terugvangstdatums in ringmodule geformatteerd als dd-mm-jjjj',
    ],
    wijzigingen_en: [
      'Fix: nest visit SOVON codes fully corrected based on official coding document (B, E, N, C, P)',
      'Feat: nest visit — separate input for number of eggs; mixed nest (eggs + chicks) supported',
      'Feat: nest planning — ringing moment linked to stage N6 (half-grown flight feathers)',
      'Feat: header — name and sync indicator on left, coffee link above right buttons',
      'Fix: recapture dates in ring module formatted as dd-mm-yyyy',
    ],
    wijzigingen_de: [
      'Fix: Nestbesuch SOVON-Codierungen vollständig korrigiert anhand offizielles Codierungsdokument (B, E, N, C, P)',
      'Feat: Nestbesuch — separates Eingabefeld für Eieranzahl; gemischtes Nest (Eier + Nestlinge) möglich',
      'Feat: Nestplanung — Beringungszeitpunkt an Stadium N6 (halbgewachsene Schwungfedern) geknüpft',
      'Feat: Kopfzeile — Name und Statusanzeige links, Kaffee-Link rechts über Schaltflächen',
      'Fix: Wiederfangdaten im Ringmodul als TT-MM-JJJJ formatiert',
    ],
  },
  {
    versie: '1.24.0',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: statspagina toont dagrecord én jaarsoort tegelijk als beide van toepassing zijn',
    ],
    wijzigingen_en: [
      'Feat: stats page shows day record and year species badges simultaneously when both apply',
    ],
    wijzigingen_de: [
      'Feat: Statistikseite zeigt Tagesrekord und Jahresart gleichzeitig an, wenn beides zutrifft',
    ],
  },
  {
    versie: '1.23.0',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: neststatusbadge toont broedcode-categorie (leeg, bouw, eieren, nestjongen, succesvol, mislukt)',
    ],
    wijzigingen_en: [
      'Feat: nest status badge shows breeding code category (empty, building, eggs, nestlings, successful, failed)',
    ],
    wijzigingen_de: [
      'Feat: Neststatusbadge zeigt Brutcode-Kategorie (leer, Nestbau, Eier, Nestlinge, erfolgreich, gescheitert)',
    ],
  },
  {
    versie: '1.22.0',
    datum: '2026-03-22',
    wijzigingen: [
      'Style: nestenoverzicht opgeschoond — jaarfilter en exportknoppen verwijderd, toggle gestyled als de rest van de app',
    ],
    wijzigingen_en: [
      'Style: nest overview cleaned up — year filter and export buttons removed, toggle styled consistently',
    ],
    wijzigingen_de: [
      'Style: Nestübersicht bereinigt — Jahresfilter und Exportschaltflächen entfernt, Umschalter einheitlich gestaltet',
    ],
  },
  {
    versie: '1.21.0',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: slim modulewisselen — navigeert naar de overeenkomende pagina (stats↔stats, nieuw↔nieuw, vogels↔nesten)',
      'Style: navigatietab "Records" hernoemd naar "Vogels"',
    ],
    wijzigingen_en: [
      'Feat: smart module switching — navigates to the equivalent page (stats↔stats, new↔new, birds↔nests)',
      'Style: navigation tab "Records" renamed to "Birds"',
    ],
    wijzigingen_de: [
      'Feat: intelligenter Modulwechsel — navigiert zur entsprechenden Seite (Statistik↔Statistik, Neu↔Neu, Vögel↔Nester)',
      'Style: Navigationsreiter "Einträge" in "Vögel" umbenannt',
    ],
  },
  {
    versie: '1.20.0',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: segmented control in header om snel tussen Ringonderzoek en Nestonderzoek te schakelen',
    ],
    wijzigingen_en: [
      'Feat: segmented control in header to quickly switch between Ringing and Nest research',
    ],
    wijzigingen_de: [
      'Feat: Segmented Control in der Kopfzeile zum schnellen Wechsel zwischen Beringung und Nestforschung',
    ],
  },
  {
    versie: '1.19.0',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: onderste navigatiebalk in nestmodule met knoppen voor nieuw nest, nesten, stats en soorten',
      'Feat: neststatistiekenpagina met kerngetallen, soorten- en stadiumverdeling, bezoeken per maand',
    ],
    wijzigingen_en: [
      'Feat: bottom navigation bar in nest module with buttons for new nest, nests, stats and species',
      'Feat: nest statistics page with key figures, species and stage breakdown, visits per month',
    ],
    wijzigingen_de: [
      'Feat: untere Navigationsleiste im Nestmodul mit Schaltflächen für neues Nest, Nester, Statistiken und Arten',
      'Feat: Neststatistikseite mit Kennzahlen, Arten- und Stadiumverteilung, Besuche pro Monat',
    ],
  },
  {
    versie: '1.18.0',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: satelietbeelden beschikbaar op alle kaarten (🛰️-knop rechtsboven op de kaart)',
    ],
    wijzigingen_en: [
      'Feat: satellite imagery available on all maps (🛰️ button top-right on each map)',
    ],
    wijzigingen_de: [
      'Feat: Satellitenbilder auf allen Karten verfügbar (🛰️-Schaltfläche oben rechts auf der Karte)',
    ],
  },
  {
    versie: '1.17.0',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: nesten wijzigen en verwijderen in nestmodule (✏️/🗑️ knoppen op nestdetailpagina)',
    ],
    wijzigingen_en: [
      'Feat: edit and delete nests in nest module (✏️/🗑️ buttons on nest detail page)',
    ],
    wijzigingen_de: [
      'Feat: Nester bearbeiten und löschen im Nestmodul (✏️/🗑️ Schaltflächen auf Nest-Detailseite)',
    ],
  },
  {
    versie: '1.16.5',
    datum: '2026-03-22',
    wijzigingen: [
      'Fix: instellingenpagina crashte in nestmodule door ontbrekende settings-prop',
      'Style: prullenbak-link in sync-tabel minder prominent (muted kleur, gestippeld)',
      'Fix: moduleкleuren (blauw/groen) zichtbaar bij subkopjes bronnen',
    ],
    wijzigingen_en: [
      'Fix: settings page crashed in nest module due to missing settings prop',
      'Style: trash link in sync table less prominent (muted color, dotted underline)',
      'Fix: module colors (blue/green) now visible on sources section headings',
    ],
    wijzigingen_de: [
      'Fix: Einstellungsseite stürzte im Nestmodul wegen fehlendem Settings-Prop ab',
      'Style: Papierkorb-Link in Sync-Tabelle weniger prominent (gedämpfte Farbe, gepunktet)',
      'Fix: Modulfarben (blau/grün) bei Quellenüberschriften sichtbar',
    ],
  },
  {
    versie: '1.16.4',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: "Over deze app" en bronnenlijst bijgewerkt voor de nestmodule',
    ],
    wijzigingen_en: [
      'Feat: "About this app" and sources updated to reflect the nest module',
    ],
    wijzigingen_de: [
      'Feat: "Über diese App" und Quellen für das Nestmodul aktualisiert',
    ],
  },
  {
    versie: '1.16.3',
    datum: '2026-03-22',
    wijzigingen: [
      'Refactor: vangsttype-badges (○ NW / ⟳ TV / ⟲ TVo etc.) consistent doorgevoerd op soortpagina',
    ],
    wijzigingen_en: [
      'Refactor: catch type badges (○ NC / ⟳ RC / ⟲ RCo etc.) consistently applied on species page',
    ],
    wijzigingen_de: [
      'Refactor: Fangtyp-Badges (○ NF / ⟳ WF / ⟲ WFo usw.) konsistent auf Artseite übernommen',
    ],
  },
  {
    versie: '1.16.2',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: klikken op "In prullenbak" in synchronisatiestatus opent prullenbak in vangstlijst',
    ],
    wijzigingen_en: [
      'Feat: clicking "In trash" in sync status opens trash in catch list',
    ],
    wijzigingen_de: [
      'Feat: Klick auf "Im Papierkorb" in Synchronisationsstatus öffnet Papierkorb in der Fangliste',
    ],
  },
  {
    versie: '1.16.1',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: synchronisatiestatus toont nesten en nestbezoeken (lokaal + online)',
      'Feat: "Alles opnieuw ophalen" haalt nu ook nestdata op',
    ],
    wijzigingen_en: [
      'Feat: sync status shows nests and nest visits (local + online)',
      'Feat: "Reload all data" now also pulls nest data',
    ],
    wijzigingen_de: [
      'Feat: Synchronisationsstatus zeigt Nester und Nestbesuche (lokal + online)',
      'Feat: "Alle Daten neu laden" ruft jetzt auch Nestdaten ab',
    ],
  },
  {
    versie: '1.16.0',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: ruitypen-editor verplaatst naar eigen pagina (/ruitypen)',
    ],
    wijzigingen_en: [
      'Feat: moult type editor moved to its own page (/ruitypen)',
    ],
    wijzigingen_de: [
      'Feat: Mauser-Typen-Editor auf eigene Seite verschoben (/ruitypen)',
    ],
  },
  {
    versie: '1.15.9',
    datum: '2026-03-22',
    wijzigingen: [
      'Fix: rol-simulatie pills hoogte 20px — min-height override toegevoegd',
    ],
    wijzigingen_en: [
      'Fix: role simulation pills height 20px — min-height override added',
    ],
    wijzigingen_de: [
      'Fix: Rollen-Simulations-Pills Höhe 20px — min-height Override hinzugefügt',
    ],
  },
  {
    versie: '1.15.8',
    datum: '2026-03-22',
    wijzigingen: [
      'Fix: admin ziet standaard "Admin" geselecteerd bij nest-rol simulatie',
      'Fix: simulatie-pills hebben vaste hoogte van 24px (was niet zichtbaar verlaagd)',
    ],
    wijzigingen_en: [
      'Fix: admin sees "Admin" selected by default for nest role simulation',
      'Fix: simulation pills have fixed height of 24px (reduction was not visible)',
    ],
    wijzigingen_de: [
      'Fix: Admin sieht standardmäßig "Admin" bei der Nest-Rollen-Simulation',
      'Fix: Simulations-Pills haben feste Höhe von 24px (Reduzierung war nicht sichtbar)',
    ],
  },
  {
    versie: '1.15.7',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: admin kan ring-rol "Geen ringmodule" toewijzen aan gebruikers',
      'Feat: admin kan nest-rol "Admin" toewijzen aan gebruikers',
      'Fix: nestkast_rol "admin" geeft volledige toegang tot nestmodule',
    ],
    wijzigingen_en: [
      'Feat: admin can assign ring role "No ring module" to users',
      'Feat: admin can assign nest role "Admin" to users',
      'Fix: nestkast_rol "admin" grants full access to nest module',
    ],
    wijzigingen_de: [
      'Feat: Admin kann Ringmodul-Rolle "Kein Ringmodul" zuweisen',
      'Feat: Admin kann Nestmodul-Rolle "Admin" zuweisen',
      'Fix: nestkast_rol "admin" gewährt vollen Zugang zum Nestmodul',
    ],
  },
  {
    versie: '1.15.6',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: rol "Geen ringmodule" toegevoegd voor gebruikers die alleen nestonderzoek doen',
      'Feat: ring-simulatie uitgebreid met Ringer+ en Geen ringmodule',
      'Feat: nest-simulatie uitgebreid met Admin',
      'Fix: simulatie-pills minder hoog en beter leesbaar',
    ],
    wijzigingen_en: [
      'Feat: role "No ring module" added for users who only do nest research',
      'Feat: ring simulation extended with Ringer+ and No ring module',
      'Feat: nest simulation extended with Admin',
      'Fix: simulation pills less tall and more readable',
    ],
    wijzigingen_de: [
      'Feat: Rolle "Kein Ringmodul" für Benutzer hinzugefügt, die nur Nestforschung betreiben',
      'Feat: Ringsimulation um Beringer+ und Kein Ringmodul erweitert',
      'Feat: Nestsimulation um Admin erweitert',
      'Fix: Simulations-Pills weniger hoch und besser lesbar',
    ],
  },
  {
    versie: '1.15.5',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: module-kleuren consistent in adminpanel (ring=blauw, nest=groen)',
      'Fix: rollijst bij uitnodiging toont geen overlappende tekst meer',
      'Feat: rolsimulatie in hamburgermenu als verticale pills met modulekleuren',
      'Fix: rol "Viewer" heet in het Nederlands nu "Kijker"',
    ],
    wijzigingen_en: [
      'Feat: module colours consistent in admin panel (ring=blue, nest=green)',
      'Fix: role list in invite section no longer overlaps',
      'Feat: role simulation in hamburger menu as vertical pills with module colours',
      'Fix: role "Viewer" is now called "Kijker" in Dutch',
    ],
    wijzigingen_de: [
      'Feat: Modulfarben im Adminpanel einheitlich (Ring=Blau, Nest=Grün)',
      'Fix: Rollenliste in Einladungsbereich überlappt nicht mehr',
      'Feat: Rollensimulation im Hamburger-Menü als vertikale Pills mit Modulfarben',
      'Fix: Rolle "Viewer" heißt auf Niederländisch jetzt "Kijker"',
    ],
  },
  {
    versie: '1.15.4',
    datum: '2026-03-22',
    wijzigingen: [
      'Fix: Ringer+ beschrijving gecorrigeerd (AI-tool, niet beheerdersrechten)',
      'Fix: nest-viewer heet nu overal "Viewer" (was "Kijker")',
      'Feat: Admin toegevoegd aan nestmodule rollenlijst in adminpanel',
      'Fix: instellingen, over en admin bereikbaar vanuit hamburgermenu in nestmodule',
    ],
    wijzigingen_en: [
      'Fix: Ringer+ description corrected (AI tool, not admin rights)',
      'Fix: nest viewer now consistently named "Viewer" (was "Kijker")',
      'Feat: Admin added to nest module role list in admin panel',
      'Fix: settings, about and admin accessible from hamburger menu in nest module',
    ],
    wijzigingen_de: [
      'Fix: Ringer+ Beschreibung korrigiert (KI-Tool, keine Adminrechte)',
      'Fix: Nest-Betrachter heißt jetzt überall "Viewer" (war "Kijker")',
      'Feat: Admin zur Nestmodul-Rollenliste im Adminpanel hinzugefügt',
      'Fix: Einstellungen, Über und Admin im Nestmodul-Hamburgermenü erreichbar',
    ],
  },
  {
    versie: '1.15.3',
    datum: '2026-03-22',
    wijzigingen: [
      'Fix: adminpanel toonde incorrect vangstenaantal door Supabase row-limiet — opgelost met count-query',
      'Feat: adminpanel toont nu ook aantal nesten en nestbezoeken per gebruiker',
    ],
    wijzigingen_en: [
      'Fix: admin panel showed incorrect catch count due to Supabase row limit — fixed with count query',
      'Feat: admin panel now also shows nest count and nest visit count per user',
    ],
    wijzigingen_de: [
      'Fix: Admin-Panel zeigte falsche Fanganzahl wegen Supabase-Zeilenlimit — mit Count-Query behoben',
      'Feat: Admin-Panel zeigt jetzt auch Nest- und Nestbesuchanzahl pro Benutzer',
    ],
  },
  {
    versie: '1.15.2',
    datum: '2026-03-22',
    wijzigingen: [
      'Fix: admin toont "Admin" in nesttoegang-kolom (niet langer "nestonderzoeker" of leeg)',
      'Fix: admin wordt niet auto-gepromoot naar nestonderzoeker bij invullen SOVON-nummer',
      'Feat: SOVON-nummer invullen geeft niet-admins automatisch nestonderzoeker-toegang',
    ],
    wijzigingen_en: [
      'Fix: admin shows "Admin" in nest access column (no longer "nestonderzoeker" or blank)',
      'Fix: admin is not auto-promoted to nestonderzoeker when entering SOVON number',
      'Feat: entering SOVON number automatically grants non-admins nest researcher access',
    ],
    wijzigingen_de: [
      'Fix: Admin zeigt "Admin" in Nestzugang-Spalte (nicht mehr "nestonderzoeker" oder leer)',
      'Fix: Admin wird beim Eingeben der SOVON-Nummer nicht zum Nestforscher befördert',
      'Feat: SOVON-Nummer eingeben gibt Nicht-Admins automatisch Nestforscherzugang',
    ],
  },
  {
    versie: '1.15.0',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: hamburgermenu gesecteerd (module-specifiek / app-breed / admin)',
      'Feat: Projecten en Ringstrengen alleen zichtbaar in ring-module',
      'Feat: rolsimulatie uitgebreid met nest-rollen (nestonderzoeker / kijker / geen)',
      'Feat: header app-titel klikbaar naar modulekeuze of startpagina',
      'Feat: module-pill in header (ring: blauw, nest: groen), klikbaar naar invoerpagina',
      'Fix: "VRS Breedenbroek" → "VRS App" op modulekeuzescherm',
      'Fix: kastnummer index toegevoegd aan Dexie nest-tabel (v9)',
    ],
    wijzigingen_en: [
      'Feat: hamburger menu sectioned (module-specific / app-wide / admin)',
      'Feat: Projects and Ring strings only visible in ring module',
      'Feat: role simulation extended with nest roles (nest researcher / viewer / none)',
      'Feat: header app title clickable to module selector or start page',
      'Feat: module pill in header (ring: blue, nest: green), clickable to entry page',
      'Fix: "VRS Breedenbroek" → "VRS App" on module selector screen',
      'Fix: kastnummer index added to Dexie nest table (v9)',
    ],
    wijzigingen_de: [
      'Feat: Hamburgermenü in Abschnitte unterteilt (modulspezifisch / App-weit / Admin)',
      'Feat: Projekte und Ringschnüre nur im Ring-Modul sichtbar',
      'Feat: Rollensimulation um Nest-Rollen erweitert (Nestforscher / Betrachter / Kein)',
      'Feat: App-Titel in Header anklickbar zur Modulauswahl oder Startseite',
      'Feat: Modul-Pill im Header (Ring: blau, Nest: grün), anklickbar zur Eingabeseite',
      'Fix: "VRS Breedenbroek" → "VRS App" auf der Modulauswahlseite',
      'Fix: kastnummer-Index zur Dexie-Nesttabelle hinzugefügt (v9)',
    ],
  },
  {
    versie: '1.14.0',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: CSV-export van nestbezoeken per seizoen (Excel-compatibel)',
      'Feat: JSON-export van volledige nestdata per seizoen',
      'Feat: export-knoppen op nestoverzichtpagina naast seizoenfilter',
    ],
    wijzigingen_en: [
      'Feat: CSV export of nest visits per season (Excel-compatible)',
      'Feat: JSON export of full nest data per season',
      'Feat: export buttons on nest overview page next to season filter',
    ],
    wijzigingen_de: [
      'Feat: CSV-Export der Nestbesuche pro Saison (Excel-kompatibel)',
      'Feat: JSON-Export vollständiger Nestdaten pro Saison',
      'Feat: Export-Schaltflächen auf Nestübersichtsseite neben Saisonfilter',
    ],
  },
  {
    versie: '1.13.0',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: "Vogel ringen" knop bij N-stadium nestbezoeken',
      'Feat: ring formulier opent vanuit nestbezoek met soort, datum en locatie vooringevuld',
      'Feat: ring automatisch gekoppeld aan nestbezoek via nestring-record na opslaan',
      'Feat: geringde vogels zichtbaar per nestbezoek in de detailpagina',
    ],
    wijzigingen_en: [
      'Feat: "Ring bird" button on N-stadium nest visits',
      'Feat: ring form opens from nest visit with species, date and location prefilled',
      'Feat: ring automatically linked to nest visit via nestring record after saving',
      'Feat: ringed birds visible per nest visit in the detail page',
    ],
    wijzigingen_de: [
      'Feat: "Vogel beringen"-Schaltfläche bei N-Stadium-Nestbesuchen',
      'Feat: Beringungsformular öffnet sich aus Nestbesuch mit vorausgefüllter Art, Datum und Standort',
      'Feat: Ring wird nach dem Speichern automatisch über nestring-Datensatz mit Nestbesuch verknüpft',
      'Feat: Beringte Vögel pro Nestbesuch auf der Detailseite sichtbar',
    ],
  },
  {
    versie: '1.12.0',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: nestbezoek invoerformulier met visuele stadiumselectie per groep',
      'Feat: conditionele velden voor eieren (E) en pulli (N)',
      'Feat: nestsucces-blok bij afsluitend stadium (verlies, methode, predatie)',
      'Feat: vervolgbezoeksuggestie op basis van stadium en broedduur soort',
      'Feat: nieuw legsel aanmaken met SOVON LINK_TYPE',
      'Feat: betrouwbaarheidsscores uitklapbaar (default 1 = exact)',
    ],
    wijzigingen_en: [
      'Feat: nest visit form with visual stadium selection per group',
      'Feat: conditional fields for eggs (E) and chicks (N)',
      'Feat: nest success block for closing stadiums (loss, method, predation)',
      'Feat: follow-up visit suggestion based on stadium and species incubation',
      'Feat: new clutch creation with SOVON LINK_TYPE',
      'Feat: reliability scores collapsible (default 1 = exact)',
    ],
    wijzigingen_de: [
      'Feat: Nestbesuchsformular mit visueller Stadienauswahl pro Gruppe',
      'Feat: Bedingte Felder für Eier (E) und Küken (N)',
      'Feat: Bruterfolgsblock bei abschließenden Stadien (Verlust, Methode, Prädation)',
      'Feat: Folgebesuchsempfehlung basierend auf Stadium und Brutdauer',
      'Feat: Neues Gelege anlegen mit SOVON LINK_TYPE',
      'Feat: Zuverlässigkeitsscores aufklappbar (Standard 1 = exakt)',
    ],
  },
  {
    versie: '1.11.0',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: nestoverzichtpagina met lijst en kaartweergave (seizoenfilter)',
      'Feat: nieuw nest registreren met locatiepicker en SOVON-velden',
      'Feat: nestdetailpagina met tijdlijn per seizoen, legsel en bezoek',
      'Data: SOVON-codelijsten (habitat, stadiums, nestsucces, etc.)',
    ],
    wijzigingen_en: [
      'Feat: nest overview page with list and map view (season filter)',
      'Feat: register new nest with location picker and SOVON fields',
      'Feat: nest detail page with timeline per season, clutch and visit',
      'Data: SOVON code lists (habitat, stadiums, nest success, etc.)',
    ],
    wijzigingen_de: [
      'Feat: Nestübersichtsseite mit Listen- und Kartenansicht (Saisonfilter)',
      'Feat: Neues Nest registrieren mit Standortauswahl und SOVON-Feldern',
      'Feat: Nestdetailseite mit Zeitleiste pro Saison, Gelege und Besuch',
      'Daten: SOVON-Codelisten (Habitat, Stadien, Nestsicherheit, usw.)',
    ],
  },
  {
    versie: '1.10.1',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: SOVON-registratienummer instelbaar in instellingen (alleen zichtbaar voor nestonderzoekers)',
    ],
    wijzigingen_en: [
      'Feat: SOVON registration number configurable in settings (only visible for nest researchers)',
    ],
    wijzigingen_de: [
      'Feat: SOVON-Registrierungsnummer in den Einstellungen konfigurierbar (nur für Nestforscher sichtbar)',
    ],
  },
  {
    versie: '1.10.0',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: nestkastonderzoek module — fundament (database, offline sync, rollen)',
      'Feat: modulekeuzescherm bij opstarten (ringonderzoek / nestonderzoek)',
      'Feat: nestonderzoeker en kijker rollen beheerbaar via admin panel',
    ],
    wijzigingen_en: [
      'Feat: nest box research module — foundation (database, offline sync, roles)',
      'Feat: module selection screen on startup (ring research / nest research)',
      'Feat: nest researcher and viewer roles manageable via admin panel',
    ],
    wijzigingen_de: [
      'Feat: Nistkastenforschungsmodul — Grundlage (Datenbank, Offline-Sync, Rollen)',
      'Feat: Modulauswahlbildschirm beim Start (Ringforschung / Nestforschung)',
      'Feat: Nestforscher- und Betrachtungsrollen im Admin-Panel verwaltbar',
    ],
  },
  {
    versie: '1.9.4',
    datum: '2026-03-22',
    wijzigingen: [
      'UX: geslacht (♂/♀) inline achter de soortnaam in terugvangst-info',
      'Fix: soortnaam in terugvangst-info begint nu met een hoofdletter',
    ],
    wijzigingen_en: [
      'UX: recapture info now also shows the sex of the first own catch',
      'Fix: species name in recapture info now starts with a capital letter',
    ],
    wijzigingen_de: [
      'UX: Wiederfanginfo zeigt jetzt auch das Geschlecht des ersten eigenen Fangs',
      'Fix: Artname in Wiederfanginfo beginnt jetzt mit einem Großbuchstaben',
    ],
  },
  {
    versie: '1.9.2',
    datum: '2026-03-22',
    wijzigingen: [
      'Fix: bewerk-project toonde geen leden door aanroep van niet-bestaande setters (setNewMemberEmail etc.)',
    ],
    wijzigingen_en: [
      'Fix: edit project showed no members due to call to non-existent setters',
    ],
    wijzigingen_de: [
      'Fix: Projekt bearbeiten zeigte keine Mitglieder wegen Aufruf nicht vorhandener Setter',
    ],
  },
  {
    versie: '1.9.1',
    datum: '2026-03-22',
    wijzigingen: [
      'UX: baansoort-indicator rood en vetgedrukt; dagrecord blauw *; jaarsoort groen * (was †)',
    ],
    wijzigingen_en: [
      'UX: site species indicator red bold; day record blue *; year species green * (was †)',
    ],
    wijzigingen_de: [
      'UX: Stationsart-Indikator rot fett; Tagesrekord blau *; Jahresart grün * (war †)',
    ],
  },
  {
    versie: '1.9.0',
    datum: '2026-03-22',
    wijzigingen: [
      'Feat: indicatoren bij soorten in "huidige vangsten" — * = nieuwe baansoort of dagrecord, † = nieuwe jaarsoort',
    ],
    wijzigingen_en: [
      'Feat: indicators next to species in "current catches" — * = new site species or day record, † = new year species',
    ],
    wijzigingen_de: [
      'Feat: Indikatoren bei Arten in "aktuelle Fänge" — * = neue Stationsart oder Tagesrekord, † = neue Jahresart',
    ],
  },
  {
    versie: '1.8.2',
    datum: '2026-03-22',
    wijzigingen: [
      'Fix: biometrie-bereik in formulier toont nu geslachtsspecifieke data (M/V) als geslacht bekend is',
      'Fix: algemeen bereik wordt afgeleid uit M+F als er geen apart algemeen bereik is (bijv. Koolmees vleugel)',
      'UX: label "soortendata" hernoemd naar "literatuur"; "gebruikerdata" naar "eigen-invoer" (oranje)',
    ],
    wijzigingen_en: [
      'Fix: biometry range in form now shows gender-specific data (M/F) when sex is known',
      'Fix: general range derived from M+F when no separate general range exists',
      'UX: label "soortendata" renamed to "literatuur"; "gebruikerdata" to "eigen-invoer" (orange)',
    ],
    wijzigingen_de: [
      'Fix: Biometriebereich im Formular zeigt jetzt geschlechtsspezifische Daten wenn Geschlecht bekannt',
      'Fix: Allgemeiner Bereich wird aus M+F abgeleitet wenn kein separater allgemeiner Bereich vorhanden',
      'UX: Label "soortendata" in "literatuur" umbenannt; "gebruikerdata" in "eigen-invoer" (orange)',
    ],
  },
  {
    versie: '1.8.1',
    datum: '2026-03-22',
    wijzigingen: [
      'Fix: biometrie-prioriteit literatuur > gebruikerdata > vangsten consistent doorgevoerd',
      'Fix: geslachtsspecifieke bereiken hadden omgekeerde prioriteit (override > literatuur) — nu literatuur > override',
      'UX: eigen override toont als "(gebruikerdata)" in oranje i.p.v. "(soortendata)"',
    ],
    wijzigingen_en: [
      'Fix: biometry priority literature > user data > catches consistently applied',
      'Fix: gender-specific ranges had reversed priority (override > literature) — now literature > override',
      'UX: own override now shown as "(gebruikerdata)" in orange instead of "(soortendata)"',
    ],
    wijzigingen_de: [
      'Fix: Biometrie-Priorität Literatur > Nutzerdaten > Fänge konsistent umgesetzt',
      'Fix: Geschlechtsspezifische Bereiche hatten umgekehrte Priorität — jetzt Literatur > Override',
      'UX: Eigene Overrides werden jetzt als "(gebruikerdata)" in Orange angezeigt',
    ],
  },
  {
    versie: '1.8.0',
    datum: '2026-03-21',
    wijzigingen: [
      'Feat: Ringstation-locatie in instellingen — coördinaten als fallback voor vangsten zonder GPS bij afstandsberekeningen en kaartlijnen',
      'Fix: Zoeken op ringnummer negeert nu puntjes (S611104 vindt ook S.611104)',
    ],
    wijzigingen_en: [
      'Feat: Ringing station location in settings — coordinates as fallback for catches without GPS in distance calculations and map lines',
      'Fix: Ring number search now ignores dots (S611104 also finds S.611104)',
    ],
    wijzigingen_de: [
      'Feat: Beringungsstation-Standort in Einstellungen — Koordinaten als Fallback für Fänge ohne GPS bei Abstandsberechnungen und Kartenlinien',
      'Fix: Ringnummernsuche ignoriert jetzt Punkte (S611104 findet auch S.611104)',
    ],
  },
  {
    versie: '1.7.1',
    datum: '2026-03-21',
    wijzigingen: [
      'Fix: Externe meldingen zichtbaar op de kaart als rode stip (herkenbaar als externe melding)',
      'Fix: externe_ring_info-records (scenario B) nu ook getoond op kaart in statistieken',
    ],
    wijzigingen_en: [
      'Fix: External reports now shown on map as red dots (recognizable as external)',
      'Fix: externe_ring_info records (scenario B) now also shown on stats map',
    ],
    wijzigingen_de: [
      'Fix: Externe Meldungen jetzt als rote Punkte auf der Karte sichtbar',
      'Fix: externe_ring_info-Datensätze (Szenario B) jetzt auch auf der Statistikkarte',
    ],
  },
  {
    versie: '1.7.0',
    datum: '2026-03-21',
    wijzigingen: [
      'Feat: Externe EURING-meldingen — plak een EURING Exchange Code (pijpjes) om een terugvangstmelding (scenario A) of eerste-vangstreferentie (scenario B) op te slaan',
      'Feat: Scenario A telt mee in terugvangststatistieken; scenario B vergroot afstand/dagberekening; geen van beide in Griel-export',
    ],
    wijzigingen_en: [
      'Feat: External EURING notifications — paste an EURING Exchange Code (pipe-delimited) to save a recapture notification (scenario A) or first-catch reference (scenario B)',
      'Feat: Scenario A counts in recapture statistics; scenario B enables distance/day calculation; neither exported to Griel',
    ],
    wijzigingen_de: [
      'Feat: Externe EURING-Meldungen — EURING Exchange Code (Pipe-getrennt) einfügen, um eine Wiederfangmeldung (Szenario A) oder Erstfangreferenz (Szenario B) zu speichern',
      'Feat: Szenario A zählt in Wiederfangstatistiken; Szenario B aktiviert Abstands-/Tagesberechnung; keines davon wird an Griel exportiert',
    ],
  },
  {
    versie: '1.6.0',
    datum: '2026-03-21',
    wijzigingen: [
      'Feat: Terugvangsten-detailpagina — record oudste/verste, grafieken (vrije tijd, seizoen, afstand), soortentabel met %TV, kaart en sorteerbare volledige lijst',
      'UX: Actuele vangsten — soorten niet meer klikbaar (staan al in de tabel); Totaal — terugvangsten klikbaar naar detailpagina',
    ],
    wijzigingen_en: [
      'Feat: Recaptures detail page — oldest/furthest records, charts (time free, season, distance), species table with %RC, map and sortable full list',
      'UX: Current catch — species no longer clickable; Total — recaptures clickable to detail page',
    ],
    wijzigingen_de: [
      'Feat: Wiederfang-Detailseite — ältester/weitester Rekord, Diagramme (Freizeit, Saison, Entfernung), Artentabelle mit %WF, Karte und sortierbare Gesamtliste',
      'UX: Aktuelle Fänge — Arten nicht mehr klickbar; Gesamt — Wiederfänge führen zur Detailseite',
    ],
  },
  {
    versie: '1.5.4',
    datum: '2026-03-21',
    wijzigingen: [
      'I18n: Grafiekteksten vertaald — legenda (Nieuw/Terugvangst) en kaarttitel (Vangstlocaties)',
    ],
    wijzigingen_en: [
      'I18n: Chart labels translated — legend (New/Recapture) and map title (Catch locations)',
    ],
    wijzigingen_de: [
      'I18n: Diagrammbeschriftungen übersetzt — Legende (Neu/Wiederfang) und Kartentitel (Fangstandorte)',
    ],
  },
  {
    versie: '1.5.3',
    datum: '2026-03-21',
    wijzigingen: [
      'I18n: Alle vogelnamen op de statspagina worden getoond in de gekozen taal (soortentabel, top, terugvangsten, kaart, projectdetail)',
    ],
    wijzigingen_en: [
      'I18n: All bird names on the stats page are now shown in the chosen language (species table, top, recaptures, map, project detail)',
    ],
    wijzigingen_de: [
      'I18n: Alle Vogelnamen auf der Statistikseite werden in der gewählten Sprache angezeigt (Artentabelle, Top, Wiederfänge, Karte, Projektdetail)',
    ],
  },
  {
    versie: '1.5.2',
    datum: '2026-03-21',
    wijzigingen: [
      'UX: Bij terugvangsten (Tv/Tvᵒ) toont het uitklapscherm de eerste eigen vangst: datum, leeftijd, project en plaats',
    ],
    wijzigingen_en: [
      'UX: For recaptures (Rc/Rcᵒ) the expanded view shows the original own catch: date, age, project and place',
    ],
    wijzigingen_de: [
      'UX: Bei Wiederfängen (Wf/Wfᵒ) zeigt die Detailansicht den ersten eigenen Fang: Datum, Alter, Projekt und Ort',
    ],
  },
  {
    versie: '1.5.1',
    datum: '2026-03-21',
    wijzigingen: [
      'UX: Recordbadge toont icoon + vertaalde afkorting in 4 categorieën met kleurcodering',
      '○ Nw (groen) · ⟳ Tv zelfde project (oranje) · ⟲ Tvᵒ ander eigen project (geel) · ⊕ Tvˣ extern (rood)',
    ],
    wijzigingen_en: [
      'UX: Record badge shows icon + translated abbreviation in 4 categories with colour coding',
      '○ Nc (green) · ⟳ Rc same project (orange) · ⟲ Rcᵒ other own project (yellow) · ⊕ Rcˣ external (red)',
    ],
    wijzigingen_de: [
      'UX: Fang-Badge zeigt Symbol + übersetzte Abkürzung in 4 Kategorien mit Farbkodierung',
      '○ Nf (grün) · ⟳ Wf gleiches Projekt (orange) · ⟲ Wfᵒ anderes eigenes Projekt (gelb) · ⊕ Wfˣ extern (rot)',
    ],
  },
  {
    versie: '1.5.0',
    datum: '2026-03-21',
    wijzigingen: [
      'Zoeken op vogelsoort werkt nu in alle talen: NL, Latijn, EN, DE, FR en ES (records- en soortenpagina)',
      'useDisplayNaam ondersteunt nu ook FR en ES als weergavetaal',
    ],
    wijzigingen_en: [
      'Species search now works in all languages: NL, Latin, EN, DE, FR and ES (records and species pages)',
      'useDisplayNaam now also supports FR and ES as display languages',
    ],
    wijzigingen_de: [
      'Artsuche funktioniert jetzt in allen Sprachen: NL, Latein, EN, DE, FR und ES (Einträge- und Artenseite)',
      'useDisplayNaam unterstützt jetzt auch FR und ES als Anzeigesprache',
    ],
  },
  {
    versie: '1.4.20',
    datum: '2026-03-21',
    wijzigingen: [
      'UX: Recorddetail vereenvoudigd — toont alleen leeftijd, project en plaats',
    ],
    wijzigingen_en: [
      'UX: Record detail simplified — shows only age, project and place',
    ],
    wijzigingen_de: [
      'UX: Fangdetail vereinfacht — zeigt nur Alter, Projekt und Ort',
    ],
  },
  {
    versie: '1.4.19',
    datum: '2026-03-21',
    wijzigingen: [
      'Fix: getCodesForSelect gebruikt euringReference vertalingen als fallback wanneer veld_config geen EN/DE beschrijvingen heeft',
    ],
    wijzigingen_en: [
      'Fix: getCodesForSelect uses euringReference translations as fallback when veld_config lacks EN/DE descriptions',
    ],
    wijzigingen_de: [
      'Fix: getCodesForSelect verwendet euringReference-Übersetzungen als Fallback, wenn veld_config keine EN/DE-Beschreibungen hat',
    ],
  },
  {
    versie: '1.4.18',
    datum: '2026-03-21',
    wijzigingen: [
      'i18n: SectieProject en LocatiePicker volledig vertaald (EN/DE)',
      'i18n: omstandigheden dropdown vertaald (61 codes voorzien van EN/DE beschrijvingen)',
    ],
    wijzigingen_en: [
      'i18n: SectieProject and LocatiePicker fully translated (EN/DE)',
      'i18n: Circumstances dropdown translated (61 codes now have EN/DE descriptions)',
    ],
    wijzigingen_de: [
      'i18n: SectieProject und LocatiePicker vollständig übersetzt (EN/DE)',
      'i18n: Umstände-Dropdown übersetzt (61 Codes mit EN/DE-Beschreibungen versehen)',
    ],
  },
  {
    versie: '1.4.17',
    datum: '2026-03-21',
    wijzigingen: [
      'Refactor: pull-orchestratie geëxtraheerd naar useSyncPulls hook (scheiding van concerns)',
      'SyncContext beheert nu alleen nog de mutatie-wachtrij; pulls staan in useSyncPulls.js',
    ],
    wijzigingen_en: [
      'Refactor: pull orchestration extracted to useSyncPulls hook (separation of concerns)',
      'SyncContext now only manages the mutation queue; pulls are in useSyncPulls.js',
    ],
    wijzigingen_de: [
      'Refactor: Pull-Orchestrierung in useSyncPulls-Hook extrahiert (Trennung der Verantwortlichkeiten)',
      'SyncContext verwaltet jetzt nur noch die Mutations-Warteschlange; Pulls sind in useSyncPulls.js',
    ],
  },
  {
    versie: '1.4.16',
    datum: '2026-03-21',
    wijzigingen: [
      'Refactor: ProjectenPage ledenformulier-state geconsolideerd (4 losse states → memberForm object)',
    ],
    wijzigingen_en: [
      'Refactor: ProjectenPage member form state consolidated (4 separate states → memberForm object)',
    ],
    wijzigingen_de: [
      'Refactor: ProjectenPage Mitgliederformular-State konsolidiert (4 einzelne States → memberForm-Objekt)',
    ],
  },
  {
    versie: '1.4.15',
    datum: '2026-03-21',
    wijzigingen: [
      'Refactor: todayISO/yesterdayISO helpers toegevoegd aan dateHelper (tijdzone-veilig)',
      'Refactor: inline .toISOString().slice(0,10) patronen in StatsPage vervangen',
    ],
    wijzigingen_en: [
      'Refactor: todayISO/yesterdayISO helpers added to dateHelper (timezone-safe)',
      'Refactor: inline .toISOString().slice(0,10) patterns in StatsPage replaced',
    ],
    wijzigingen_de: [
      'Refactor: todayISO/yesterdayISO-Hilfsfunktionen zu dateHelper hinzugefügt (zeitzonensicher)',
      'Refactor: Inline .toISOString().slice(0,10)-Muster in StatsPage ersetzt',
    ],
  },
  {
    versie: '1.4.14',
    datum: '2026-03-21',
    wijzigingen: [
      'Docs: merge-volgorde biometriedata gedocumenteerd in useBioRanges.js en SoortDetail.jsx',
    ],
    wijzigingen_en: [
      'Docs: biometry data merge order documented in useBioRanges.js and SoortDetail.jsx',
    ],
    wijzigingen_de: [
      'Docs: Zusammenführungsreihenfolge der Biometriedaten in useBioRanges.js und SoortDetail.jsx dokumentiert',
    ],
  },
  {
    versie: '1.4.13',
    datum: '2026-03-21',
    wijzigingen: [
      'UX: exportfouten worden nu inline getoond met sluitknop (prominenter dan toast)',
    ],
    wijzigingen_en: [
      'UX: export errors are now shown inline with a close button (more prominent than toast)',
    ],
    wijzigingen_de: [
      'UX: Exportfehler werden jetzt inline mit Schaltfläche zum Schließen angezeigt',
    ],
  },
  {
    versie: '1.4.12',
    datum: '2026-03-21',
    wijzigingen: [
      'UX: laadindicator toegevoegd in RecordsPage en StatsPage (toont "Laden..." bij initieel laden)',
    ],
    wijzigingen_en: [
      'UX: loading indicator added to RecordsPage and StatsPage (shows "Loading..." during initial load)',
    ],
    wijzigingen_de: [
      'UX: Ladeindikator in RecordsPage und StatsPage hinzugefügt (zeigt "Laden..." beim ersten Laden)',
    ],
  },
  {
    versie: '1.4.11',
    datum: '2026-03-21',
    wijzigingen: [
      'Perf: db.species verwijdering via gefilterde query i.p.v. toArray() (minder geheugengebruik)',
      'Perf: db.veld_config gesorteerd via Dexie orderBy i.p.v. JS sort (Dexie v7 schema)',
    ],
    wijzigingen_en: [
      'Perf: db.species deletion via filtered query instead of toArray() (less memory usage)',
      'Perf: db.veld_config sorted via Dexie orderBy instead of JS sort (Dexie v7 schema)',
    ],
    wijzigingen_de: [
      'Perf: db.species Löschung über gefilterte Abfrage statt toArray() (weniger Speicherverbrauch)',
      'Perf: db.veld_config per Dexie orderBy sortiert statt JS sort (Dexie v7 Schema)',
    ],
  },
  {
    versie: '1.4.10',
    datum: '2026-03-21',
    wijzigingen: [
      'Refactor: magic number 60*60*1000 vervangen door PULL_INTERVAL_MS constante',
      'Refactor: STATS_UITGESLOTEN verplaatst van StatsPage naar data/constants.js',
    ],
    wijzigingen_en: [
      'Refactor: magic number 60*60*1000 replaced by PULL_INTERVAL_MS constant',
      'Refactor: STATS_UITGESLOTEN moved from StatsPage to data/constants.js',
    ],
    wijzigingen_de: [
      'Refactor: Magic Number 60*60*1000 durch PULL_INTERVAL_MS Konstante ersetzt',
      'Refactor: STATS_UITGESLOTEN von StatsPage nach data/constants.js verschoben',
    ],
  },
  {
    versie: '1.4.9',
    datum: '2026-03-21',
    wijzigingen: [
      'Refactor: syncQueue.js herschreven als dispatch-tabel (leesbaarder, uitbreidbaar)',
      'Feat: in-memory cache voor referentiefoto-URLs (voorkomt dubbele fetches per sessie)',
      'Feat: AI-prompt uitgebreid met instructies voor visuele ruikenmerken',
      'Feat: OpenGraph meta-tags toegevoegd aan index.html',
      'Tests: unit tests toegevoegd voor aiAnalyse (selectReferenties, buildPrompt)',
    ],
    wijzigingen_en: [
      'Refactor: syncQueue.js rewritten as dispatch table (more readable, extensible)',
      'Feat: in-memory cache for reference photo URLs (prevents duplicate fetches per session)',
      'Feat: AI prompt extended with instructions for visual moult feature analysis',
      'Feat: OpenGraph meta tags added to index.html',
      'Tests: unit tests added for aiAnalyse (selectReferenties, buildPrompt)',
    ],
    wijzigingen_de: [
      'Refactor: syncQueue.js als Dispatch-Tabelle neu geschrieben (lesbarer, erweiterbar)',
      'Feat: In-Memory-Cache für Referenzfoto-URLs (verhindert doppelte Abrufe pro Sitzung)',
      'Feat: KI-Prompt um Anweisungen zur visuellen Mauser-Merkmalsanalyse erweitert',
      'Feat: OpenGraph-Meta-Tags zu index.html hinzugefügt',
      'Tests: Unit-Tests für aiAnalyse hinzugefügt (selectReferenties, buildPrompt)',
    ],
  },
  {
    versie: '1.4.8',
    datum: '2026-03-21',
    wijzigingen: [
      'Fix: CSS --error variabele toegevoegd als alias voor --danger (voorkomt onzichtbare fout-styling)',
      'Cleanup: verouderde Dexie referentiebibliotheek-tabel verwijderd (data staat nu in Supabase)',
    ],
    wijzigingen_en: [
      'Fix: CSS --error variable added as alias for --danger (prevents invisible error styling)',
      'Cleanup: obsolete Dexie reference library table removed (data is now in Supabase)',
    ],
    wijzigingen_de: [
      'Fix: CSS --error Variable als Alias für --danger hinzugefügt (verhindert unsichtbares Fehler-Styling)',
      'Cleanup: veraltete Dexie Referenzbibliothek-Tabelle entfernt (Daten sind jetzt in Supabase)',
    ],
  },
  {
    versie: '1.4.7',
    datum: '2026-03-21',
    wijzigingen: [
      'Fix: profiellaad-fout wordt nu zichtbaar getoond als waarschuwingsbanner',
      'Fix: AI-analyse time-out na 30 seconden met duidelijke melding',
      'Fix: AI-resultaat EURING-codes worden gevalideerd vóór invullen in formulier',
      'Fix: maandberekening in AI-sectie gebruikt nu correcte tijdzone (geen UTC-verschuiving)',
    ],
    wijzigingen_en: [
      'Fix: profile load error is now visibly shown as a warning banner',
      'Fix: AI analysis times out after 30 seconds with a clear message',
      'Fix: AI result EURING codes are validated before filling in the form',
      'Fix: month calculation in AI section now uses correct timezone (no UTC offset)',
    ],
    wijzigingen_de: [
      'Fix: Profilladefehler wird jetzt als Warnungsbanner angezeigt',
      'Fix: KI-Analyse läuft nach 30 Sekunden mit einer klaren Meldung ab',
      'Fix: KI-Ergebnis EURING-Codes werden vor dem Ausfüllen des Formulars validiert',
      'Fix: Monatsberechnung im KI-Bereich verwendet jetzt korrekte Zeitzone (kein UTC-Versatz)',
    ],
  },
  {
    versie: '1.4.6',
    datum: '2026-03-21',
    wijzigingen: [
      'PWA: manifest.json heeft nu een id-veld voor betrouwbare PWA-identiteit bij updates',
      'PWA: apple-touch-icon toegevoegd voor correct icoon bij "Voeg toe aan beginscherm" op iOS',
    ],
    wijzigingen_en: [
      'PWA: manifest.json now has an id field for reliable PWA identity on updates',
      'PWA: apple-touch-icon added for correct icon when using "Add to Home Screen" on iOS',
    ],
    wijzigingen_de: [
      'PWA: manifest.json hat jetzt ein id-Feld für zuverlässige PWA-Identität bei Updates',
      'PWA: apple-touch-icon für korrektes Symbol bei "Zum Startbildschirm hinzufügen" auf iOS hinzugefügt',
    ],
  },
  {
    versie: '1.4.5',
    datum: '2026-03-21',
    wijzigingen: [
      'Perf: invoerformulier wordt nu pas ingeladen bij navigatie (lazy loading), snellere initiële start',
      'Fix: biometrie-berekening gebruikt geen spread-operator meer (veilig bij grote datasets)',
      'Improve: laadindicator zichtbaar bij navigeren tussen pagina\'s',
    ],
    wijzigingen_en: [
      'Perf: entry form is now loaded on demand (lazy loading), faster initial startup',
      'Fix: biometrics calculation no longer uses spread operator (safe with large datasets)',
      'Improve: loading indicator visible when navigating between pages',
    ],
    wijzigingen_de: [
      'Perf: Eingabeformular wird jetzt erst bei Navigation geladen (Lazy Loading), schnellerer Start',
      'Fix: Biometrie-Berechnung verwendet keinen Spread-Operator mehr (sicher bei großen Datensätzen)',
      'Improve: Ladeindikator beim Navigieren zwischen Seiten sichtbar',
    ],
  },
  {
    versie: '1.4.4',
    datum: '2026-03-21',
    wijzigingen: [
      'Fix: adminpagina laadt geen vangsten op als er geen gebruikers zijn (lege array guard)',
      'Fix: vangstenteller op adminpagina telt geen verwijderde vangsten meer mee',
      'Fix: foutmelding op adminpagina is nu toegankelijk voor screenreaders (role="alert")',
    ],
    wijzigingen_en: [
      'Fix: admin page no longer queries catches when there are no users (empty array guard)',
      'Fix: catch counter on admin page no longer counts deleted catches',
      'Fix: error message on admin page is now accessible to screen readers (role="alert")',
    ],
    wijzigingen_de: [
      'Fix: Admin-Seite fragt keine Fänge ab, wenn keine Benutzer vorhanden sind (leeres Array Guard)',
      'Fix: Fangzähler auf Admin-Seite zählt keine gelöschten Fänge mehr',
      'Fix: Fehlermeldung auf der Admin-Seite ist jetzt für Screenreader zugänglich (role="alert")',
    ],
  },
  {
    versie: '1.4.3',
    datum: '2026-03-21',
    wijzigingen: [
      'Fix: fotobestand te groot (>20 MB) geeft nu een leesbare foutmelding',
      'Fix: HEIF-bestanden (.heif) worden nu ook herkend en geconverteerd naar JPEG',
      'Fix: HEIC/HEIF-conversiefout geeft nu een duidelijke melding i.p.v. een crash',
      'Fix: ophalen van referentiefoto\'s voor AI-analyse heeft nu foutafhandeling; één falende foto breekt de analyse niet meer af',
      'Fix: mediatype van referentiefoto\'s wordt nu bepaald vanuit de HTTP Content-Type header',
    ],
    wijzigingen_en: [
      'Fix: file too large (>20 MB) now shows a readable error message',
      'Fix: HEIF files (.heif) are now also detected and converted to JPEG',
      'Fix: HEIC/HEIF conversion error now shows a clear message instead of crashing',
      'Fix: fetching reference photos for AI analysis now has error handling; one failing photo no longer aborts the analysis',
      'Fix: media type of reference photos is now determined from the HTTP Content-Type header',
    ],
    wijzigingen_de: [
      'Fix: Datei zu groß (>20 MB) zeigt jetzt eine lesbare Fehlermeldung',
      'Fix: HEIF-Dateien (.heif) werden jetzt auch erkannt und in JPEG konvertiert',
      'Fix: HEIC/HEIF-Konvertierungsfehler zeigt jetzt eine klare Meldung statt eines Absturzes',
      'Fix: Abrufen von Referenzfotos für die KI-Analyse hat jetzt eine Fehlerbehandlung; ein fehlschlagendes Foto bricht die Analyse nicht mehr ab',
      'Fix: Medientyp von Referenzfotos wird jetzt aus dem HTTP Content-Type-Header ermittelt',
    ],
  },
  {
    versie: '1.4.2',
    datum: '2026-03-21',
    wijzigingen: [
      'Fix: maandafleiding uit datum gebruikt nu correcte tijdzone (geen UTC-verschuiving meer)',
      'Fix: AI-referentieselectie — seizoensafstand is nu circulair (december en januari liggen dicht bij elkaar)',
      'Fix: AI-prompt geslachtsbepalingcodes gecorrigeerd naar officiële EURING-waarden',
    ],
    wijzigingen_en: [
      'Fix: month derivation from date now uses correct timezone (no more UTC offset)',
      'Fix: AI reference selection — seasonal distance is now circular (December and January are close)',
      'Fix: AI prompt sex determination codes corrected to official EURING values',
    ],
    wijzigingen_de: [
      'Fix: Monatsableitung aus Datum verwendet jetzt korrekte Zeitzone (kein UTC-Versatz mehr)',
      'Fix: KI-Referenzauswahl — saisonaler Abstand ist jetzt zirkulär (Dezember und Januar liegen nah beieinander)',
      'Fix: KI-Prompt Geschlechtsbestimmungscodes auf offizielle EURING-Werte korrigiert',
    ],
  },
  {
    versie: '1.4.1',
    datum: '2026-03-21',
    wijzigingen: [
      'Improve: referentiebibliotheek — soort via soortendatabase autocomplete, leeftijd als EURING dropdown, geslacht als dropdown, ondersteuning volledige datum (maand wordt automatisch afgeleid)',
    ],
    wijzigingen_en: [
      'Improve: reference library — species via database autocomplete, age as EURING dropdown, sex as dropdown, full date support (month derived automatically)',
    ],
    wijzigingen_de: [
      'Improve: Referenzbibliothek — Art per Datenbank-Autocomplete, Alter als EURING-Dropdown, Geschlecht als Dropdown, volles Datum (Monat wird automatisch abgeleitet)',
    ],
  },
  {
    versie: '1.4.0',
    datum: '2026-03-21',
    wijzigingen: [
      'Feat: AI-gestuurde leeftijd/geslacht analyse via foto — gebruik Claude AI om de vogel te analyseren en het formulier automatisch in te vullen',
      'Feat: referentiebibliotheek (admin) — sla bevestigde vangstfoto\'s op als referentie voor toekomstige AI-analyses',
      'Feat: nieuwe rol ringer+ met toegang tot AI-analyse',
      'Feat: automatische HEIC→JPEG conversie en afbeeldingsverkleining voor opslag',
    ],
    wijzigingen_en: [
      'Feat: AI-powered age/sex analysis via photo — use Claude AI to analyse the bird and auto-fill the form',
      'Feat: reference library (admin) — save confirmed catch photos as references for future AI analyses',
      'Feat: new role ringer+ with access to AI analysis',
      'Feat: automatic HEIC→JPEG conversion and image resizing for storage',
    ],
    wijzigingen_de: [
      'Feat: KI-gestützte Alters-/Geschlechtsanalyse per Foto — Claude KI analysiert den Vogel und füllt das Formular automatisch aus',
      'Feat: Referenzbibliothek (Admin) — bestätigte Fangfotos als Referenz für zukünftige KI-Analysen speichern',
      'Feat: neue Rolle Beringer+ mit Zugang zur KI-Analyse',
      'Feat: automatische HEIC→JPEG-Konvertierung und Bildverkleinerung für die Speicherung',
    ],
  },
  {
    versie: '1.3.9',
    datum: '2026-03-21',
    wijzigingen: [
      'i18n: changelog volledig vertaald (NL/EN/DE) — versiegeschiedenis wordt getoond in de actieve taal',
    ],
    wijzigingen_en: [
      'i18n: changelog fully translated (NL/EN/DE) — version history is shown in the active language',
    ],
    wijzigingen_de: [
      'i18n: Changelog vollständig übersetzt (NL/EN/DE) — Versionshistorie wird in der aktiven Sprache angezeigt',
    ],
  },
  {
    versie: '1.3.8',
    datum: '2026-03-21',
    wijzigingen: [
      'i18n: soortdetailpagina volledig vertaald — biometrie-velden (Vleugel/Wing/Flügel etc.), namen-sectie (Latijn/Latin/Latein), taxonomie (Familie/Orde), nestgegevens (Eileg/Clutch size/Gelegegröße etc.) en determinatieboeken (Klaassen voorjaar/spring/Frühjahr)',
    ],
    wijzigingen_en: [
      'i18n: species detail page fully translated — biometrics fields (Wing/Flügel etc.), names section (Latin/Latein), taxonomy (Family/Order), nest data (Clutch size/Gelegegröße etc.) and ID books (Klaassen spring/Frühjahr)',
    ],
    wijzigingen_de: [
      'i18n: Artdetailseite vollständig übersetzt — Biometrie-Felder (Flügel etc.), Namen-Abschnitt (Latein), Taxonomie (Familie/Ordnung), Nestdaten (Gelegegröße etc.) und Bestimmungsbücher (Klaassen Frühjahr)',
    ],
  },
  {
    versie: '1.3.7',
    datum: '2026-03-21',
    wijzigingen: [
      'i18n: soortzoekactie zoekt nu eerst in de actieve taal (NL/EN/DE) — Duits zoeken vindt direct de juiste soort',
      'i18n: soortnamen in zoeksuggesties en invoerveld worden getoond in de actieve taal',
      'i18n: alle dropdownkeuzes in het invoerformulier volledig vertaald (NL/EN/DE): leeftijd, geslacht, vet, borstspier, broedvlek, cloaca, conditie, handicap, rui, coördinaatnauwkeurigheid, datumnauwkeurigheid, en meer',
      'i18n: EURING-codes voor vangstmethode, lokmiddelen, status, omstandighedenzekerheid, gemanipuleerd, metalenringinfo en identificatiemethode vertaald',
      'i18n: soortenbrowser zoekt nu ook op Duitse naam',
    ],
    wijzigingen_en: [
      'i18n: species search now prioritises the active language (NL/EN/DE) — searching in German finds the correct species directly',
      'i18n: species names in search suggestions and input field are shown in the active language',
      'i18n: all dropdown options in the entry form fully translated (NL/EN/DE): age, sex, fat, pectoral muscle, brood patch, cloaca, condition, injury, moult, coordinate accuracy, date accuracy, and more',
      'i18n: EURING codes for catch method, lure, status, circumstance certainty, manipulated, metal ring info and identification method translated',
      'i18n: species browser now also searches on German name',
    ],
    wijzigingen_de: [
      'i18n: Artsuche priorisiert jetzt die aktive Sprache (NL/EN/DE) — Suche auf Deutsch findet direkt die richtige Art',
      'i18n: Artnamen in Suchvorschlägen und Eingabefeld werden in der aktiven Sprache angezeigt',
      'i18n: alle Dropdown-Optionen im Erfassungsformular vollständig übersetzt (NL/EN/DE): Alter, Geschlecht, Fett, Brustmuskel, Brutfleck, Kloake, Kondition, Verletzung, Mauser, Koordinatengenauigkeit, Datumsgenauigkeit und mehr',
      'i18n: EURING-Codes für Fangmethode, Lockmittel, Status, Umstandssicherheit, manipuliert, Metallringinformation und Identifikationsmethode übersetzt',
      'i18n: Artenbrowser sucht jetzt auch nach deutschem Namen',
    ],
  },
  {
    versie: '1.3.6',
    datum: '2026-03-21',
    wijzigingen: [
      'UX: taal- en themakiezer gesplitst in twee aparte dropdowns — vlagicoon (taal) en thema-icoon elk met eigen hover/klik dropdown',
    ],
    wijzigingen_en: [
      'UX: language and theme selector split into two separate dropdowns — flag icon (language) and theme icon each with their own hover/click dropdown',
    ],
    wijzigingen_de: [
      'UX: Sprach- und Thema-Auswahl in zwei separate Dropdowns aufgeteilt — Flaggen-Icon (Sprache) und Thema-Icon jeweils mit eigenem Hover/Klick-Dropdown',
    ],
  },
  {
    versie: '1.3.5',
    datum: '2026-03-21',
    wijzigingen: [
      'UX: taal- en themakiezer samengevoegd tot één vlagicoon in de header — hover/klik opent dropdown met talen (vlag + naam) en thema\'s (icoon + label)',
      'UX: pref-dropdown sluit automatisch bij klik buiten op mobiel',
      'UX: pref-menu en hamburgermenu sluiten elkaar uit',
    ],
    wijzigingen_en: [
      'UX: language and theme selector merged into a single flag icon in the header — hover/click opens dropdown with languages (flag + name) and themes (icon + label)',
      'UX: pref-dropdown closes automatically when clicking outside on mobile',
      'UX: pref-menu and hamburger menu are mutually exclusive',
    ],
    wijzigingen_de: [
      'UX: Sprach- und Thema-Auswahl zu einem einzigen Flaggen-Icon in der Kopfzeile zusammengeführt — Hover/Klick öffnet Dropdown mit Sprachen (Flagge + Name) und Themen (Icon + Label)',
      'UX: pref-Dropdown schließt automatisch bei Klick außerhalb auf Mobilgeräten',
      'UX: pref-Menü und Hamburger-Menü schließen sich gegenseitig aus',
    ],
  },
  {
    versie: '1.3.4',
    datum: '2026-03-21',
    wijzigingen: [
      'i18n: invoerformulier volledig vertaald — alle secties, labels, validatieberichten en hints (NL/EN/DE)',
      'i18n: Stats/SoortenOverzicht en Stats/ProjectDetail vertaald (tabellen, grafieken, knoppen)',
      'i18n: ~120 nieuwe vertalingssleutels per taal (form_*, so_*, pd_*)',
    ],
    wijzigingen_en: [
      'i18n: entry form fully translated — all sections, labels, validation messages and hints (NL/EN/DE)',
      'i18n: Stats/SpeciesOverview and Stats/ProjectDetail translated (tables, charts, buttons)',
      'i18n: ~120 new translation keys per language (form_*, so_*, pd_*)',
    ],
    wijzigingen_de: [
      'i18n: Erfassungsformular vollständig übersetzt — alle Abschnitte, Labels, Validierungsmeldungen und Hinweise (NL/EN/DE)',
      'i18n: Stats/ArtenÜbersicht und Stats/ProjektDetail übersetzt (Tabellen, Diagramme, Schaltflächen)',
      'i18n: ~120 neue Übersetzungsschlüssel pro Sprache (form_*, so_*, pd_*)',
    ],
  },
  {
    versie: '1.3.3',
    datum: '2026-03-21',
    wijzigingen: [
      'i18n: taalkiezer (🇳🇱 🇬🇧 🇩🇪) toegevoegd aan header — taalvoorkeur wordt meteen opgeslagen',
      'i18n: vogelnaam weergegeven in geselecteerde taal (EN/DE) op soortenpagina, vangstlijst en soortdetail',
      'i18n: SoortDetail volledig vertaald (alle secties, alerts, bevestigingsdialogen)',
      'i18n: DatabasesPage, RecordsPage en SoortenPage vertaald',
      'i18n: OverPage "over deze app" tekst vertaald',
    ],
    wijzigingen_en: [
      'i18n: language selector (🇳🇱 🇬🇧 🇩🇪) added to header — language preference is saved immediately',
      'i18n: bird name shown in selected language (EN/DE) on species page, catch list and species detail',
      'i18n: SoortDetail fully translated (all sections, alerts, confirmation dialogs)',
      'i18n: DatabasesPage, RecordsPage and SoortenPage translated',
      'i18n: OverPage "about this app" text translated',
    ],
    wijzigingen_de: [
      'i18n: Sprachauswahl (🇳🇱 🇬🇧 🇩🇪) zur Kopfzeile hinzugefügt — Spracheinstellung wird sofort gespeichert',
      'i18n: Vogelname wird in der gewählten Sprache (EN/DE) auf Artenseite, Fangliste und Artdetail angezeigt',
      'i18n: SoortDetail vollständig übersetzt (alle Abschnitte, Alerts, Bestätigungsdialoge)',
      'i18n: DatabasesPage, RecordsPage und SoortenPage übersetzt',
      'i18n: OverPage „Über diese App"-Text übersetzt',
    ],
  },
  {
    versie: '1.3.2',
    datum: '2026-03-21',
    wijzigingen: [
      'Performance: useProjects — allProjects in useMemo, herberekening alleen bij wijziging van projects/sharedProjects',
      'Performance: useProjects.pullMyAupis — twee Supabase-queries parallel via Promise.all (was: sequentieel)',
      'Performance: SyncContext.processQueue — wachtrij-items parallel verwerkt via Promise.allSettled (was: sequentieel)',
      'Performance: CloudStatus — vier lokale Dexie-tellingen samengevoegd tot één gecombineerde query',
    ],
    wijzigingen_en: [
      'Performance: useProjects — allProjects in useMemo, recomputed only when projects/sharedProjects change',
      'Performance: useProjects.pullMyAupis — two Supabase queries run in parallel via Promise.all (was: sequential)',
      'Performance: SyncContext.processQueue — queue items processed in parallel via Promise.allSettled (was: sequential)',
      'Performance: CloudStatus — four local Dexie counts merged into one combined query',
    ],
    wijzigingen_de: [
      'Performance: useProjects — allProjects in useMemo, Neuberechnung nur bei Änderung von projects/sharedProjects',
      'Performance: useProjects.pullMyAupis — zwei Supabase-Abfragen parallel via Promise.all (war: sequenziell)',
      'Performance: SyncContext.processQueue — Warteschlangen-Einträge parallel via Promise.allSettled verarbeitet (war: sequenziell)',
      'Performance: CloudStatus — vier lokale Dexie-Zählungen zu einer kombinierten Abfrage zusammengeführt',
    ],
  },
  {
    versie: '1.3.1',
    datum: '2026-03-21',
    wijzigingen: [
      'Tests: Vitest opgezet — 56 unit tests voor dateHelper, bioHelper en Griel XML-export',
      'Tests: exportGriel dekt datum/tijd-conversie, geslacht, pullus-velden, XML-escaping en biometrie',
    ],
    wijzigingen_en: [
      'Tests: Vitest set up — 56 unit tests for dateHelper, bioHelper and Griel XML export',
      'Tests: exportGriel covers date/time conversion, sex, pullus fields, XML escaping and biometrics',
    ],
    wijzigingen_de: [
      'Tests: Vitest eingerichtet — 56 Unit-Tests für dateHelper, bioHelper und Griel-XML-Export',
      'Tests: exportGriel deckt Datum/Uhrzeit-Konvertierung, Geschlecht, Pullus-Felder, XML-Escaping und Biometrie ab',
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
    wijzigingen_en: [
      'i18n: full translation of all remaining pages — Header, ErrorBoundary, MigrationBanner, SyncIndicator, CatchList, Statistics, Admin, Species, RingStrings, Projects and About page',
      'i18n: ~150 new translation keys per language (NL/EN/DE) in common and errors namespace',
      'i18n: error messages for export, import, admin and projects translated in errors namespace',
    ],
    wijzigingen_de: [
      'i18n: vollständige Übersetzung aller verbleibenden Seiten — Header, ErrorBoundary, MigrationBanner, SyncIndicator, Fangliste, Statistiken, Admin, Arten, Ringschnüre, Projekte und Über-Seite',
      'i18n: ~150 neue Übersetzungsschlüssel pro Sprache (NL/EN/DE) in common- und errors-Namespace',
      'i18n: Fehlermeldungen für Export, Import, Admin und Projekte im errors-Namespace übersetzt',
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
    wijzigingen_en: [
      'i18n: multilingual support — language switcher added in Settings (Nederlands, English, Deutsch)',
      'i18n: navigation, login screen, settings page, cloud sync status and system messages translated',
      'i18n: language preference is saved in localStorage and automatically detected via browser language',
    ],
    wijzigingen_de: [
      'i18n: mehrsprachige Unterstützung — Sprachumschalter in Einstellungen hinzugefügt (Nederlands, English, Deutsch)',
      'i18n: Navigation, Anmeldebildschirm, Einstellungsseite, Cloud-Synchronisierungsstatus und Systemmeldungen übersetzt',
      'i18n: Spracheinstellung wird in localStorage gespeichert und automatisch über die Browsersprache erkannt',
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
    wijzigingen_en: [
      'Fix: CloudStatus only checked the first of three Supabase calls for errors — now all three are checked',
      'Fix: silent error on projects pull replaced by assertNoError — error is now visible in the console',
      'Stability: assertNoError helper added to supabaseHelper for a uniform error pattern',
      'DX: supabase.js now throws a clear error for missing environment variables in development',
    ],
    wijzigingen_de: [
      'Fix: CloudStatus prüfte nur den ersten von drei Supabase-Aufrufen auf Fehler — jetzt werden alle drei geprüft',
      'Fix: stiller Fehler beim Projekte-Pull durch assertNoError ersetzt — Fehler ist jetzt in der Konsole sichtbar',
      'Stabilität: assertNoError-Helper zu supabaseHelper für einheitliches Fehlermuster hinzugefügt',
      'DX: supabase.js wirft jetzt einen klaren Fehler bei fehlenden Umgebungsvariablen in der Entwicklung',
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
    wijzigingen_en: [
      'Accessibility: focus-visible outline added for keyboard users',
      'Accessibility: :disabled style for buttons — disabled buttons are now visually distinguishable',
      'Accessibility: btn-sm minimum tap target size increased to 36×36px',
      'Responsive: form-row falls back to 1 column on screens ≤ 400px (e.g. iPhone SE)',
      'Accessibility: prefers-reduced-motion — animations and transitions are suppressed when requested',
    ],
    wijzigingen_de: [
      'Barrierefreiheit: focus-visible Outline für Tastaturnutzer hinzugefügt',
      'Barrierefreiheit: :disabled-Stil für Schaltflächen — deaktivierte Schaltflächen sind jetzt visuell unterscheidbar',
      'Barrierefreiheit: btn-sm minimale Tippfläche auf 36×36px vergrößert',
      'Responsive: form-row fällt auf 1 Spalte bei Bildschirmen ≤ 400px zurück (z. B. iPhone SE)',
      'Barrierefreiheit: prefers-reduced-motion — Animationen und Übergänge werden bei Bedarf unterdrückt',
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
    wijzigingen_en: [
      'Fix: JSONB null-check in useRingStrengen — crash on missing data column in Supabase resolved',
      'Fix: race condition in species/veldconfig/override pulls — boolean flag replaced by Promise reference',
      'Fix: updateRecord now shows an error message if the local write operation fails (was: silent error)',
      'UX: lost sync items now show the name and date of the affected catch in CloudStatus',
    ],
    wijzigingen_de: [
      'Fix: JSONB-Null-Prüfung in useRingStrengen — Absturz bei fehlender data-Spalte in Supabase behoben',
      'Fix: Race Condition in species/veldconfig/override-Pulls — boolesches Flag durch Promise-Referenz ersetzt',
      'Fix: updateRecord zeigt jetzt eine Fehlermeldung, wenn der lokale Schreibvorgang fehlschlägt (war: stiller Fehler)',
      'UX: verlorene Sync-Einträge zeigen jetzt Name und Datum des betroffenen Fangs in CloudStatus',
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
    wijzigingen_en: [
      'Accessibility: aria-label added to all icon buttons (✕ close, delete) in 6 components',
      'UX: empty state added to Species — shows message when search result is empty',
      'HTML: meta description added',
      'Refactor: hard-coded colour values in Charts.jsx consolidated into named constants',
    ],
    wijzigingen_de: [
      'Barrierefreiheit: aria-label zu allen Icon-Schaltflächen (✕ Schließen, Löschen) in 6 Komponenten hinzugefügt',
      'UX: Leer-Zustand zu Arten hinzugefügt — zeigt Meldung, wenn Suchergebnis leer ist',
      'HTML: Meta-Description hinzugefügt',
      'Refactor: hartcodierte Farbwerte in Charts.jsx zu benannten Konstanten zusammengeführt',
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
    wijzigingen_en: [
      'Sync: queue deduplication — multiple offline edits to the same record are merged into a single upsert',
      'Sync: exponential backoff after failure (30s → 60s → 120s → … → max 8 min) — Supabase no longer polled every second during outages',
      'Sync: backoff is reset on reconnect — items are retried immediately when internet returns',
    ],
    wijzigingen_de: [
      'Sync: Warteschlangen-Deduplizierung — mehrere Offline-Bearbeitungen desselben Datensatzes werden zu einem einzigen Upsert zusammengeführt',
      'Sync: Exponentieller Backoff nach Fehler (30s → 60s → 120s → … → max 8 Min) — Supabase wird bei Ausfällen nicht mehr jede Sekunde abgefragt',
      'Sync: Backoff wird bei Wiederverbindung zurückgesetzt — Einträge werden sofort erneut versucht, wenn Internet zurückkommt',
    ],
  },
  {
    versie: '1.2.0',
    datum: '2026-03-20',
    wijzigingen: [
      'Refactor: fetchAllPages helper in utils/supabaseHelper.js — dubbel pagineringspatroon in useRecords en useSpeciesRef samengevoegd',
      'Refactor: useBioRanges hook — 5 biometrie-useMemos uit NieuwPage geëxtraheerd naar src/hooks/useBioRanges.js',
    ],
    wijzigingen_en: [
      'Refactor: fetchAllPages helper in utils/supabaseHelper.js — duplicate pagination pattern in useRecords and useSpeciesRef merged',
      'Refactor: useBioRanges hook — 5 biometrics useMemos extracted from NieuwPage to src/hooks/useBioRanges.js',
    ],
    wijzigingen_de: [
      'Refactor: fetchAllPages-Helper in utils/supabaseHelper.js — doppeltes Paginierungsmuster in useRecords und useSpeciesRef zusammengeführt',
      'Refactor: useBioRanges-Hook — 5 Biometrie-useMemos aus NieuwPage nach src/hooks/useBioRanges.js extrahiert',
    ],
  },
  {
    versie: '1.1.9',
    datum: '2026-03-20',
    wijzigingen: [
      'Performance: AdminPage N+1 opgelost — vangstentelling per gebruiker in één Supabase-request i.p.v. één per gebruiker',
      'Performance: filterByDatum in StatsPage in useCallback — stabiele referentie bij export',
    ],
    wijzigingen_en: [
      'Performance: AdminPage N+1 resolved — catch count per user in one Supabase request instead of one per user',
      'Performance: filterByDatum in StatsPage wrapped in useCallback — stable reference on export',
    ],
    wijzigingen_de: [
      'Performance: AdminPage-N+1 behoben — Fangzählung pro Benutzer in einer Supabase-Anfrage statt einer pro Benutzer',
      'Performance: filterByDatum in StatsPage in useCallback — stabile Referenz beim Export',
    ],
  },
  {
    versie: '1.1.8',
    datum: '2026-03-20',
    wijzigingen: [
      'Performance: soortzoekopdracht debouncet op 150ms — zoeken door 3500+ soorten niet meer op elke toetsaanslag',
      'Performance: update, toggleSection, handleSpeciesInput, updateRuikaart e.a. in useCallback — stabiele referenties',
    ],
    wijzigingen_en: [
      'Performance: species search debounced at 150ms — searching through 3500+ species no longer triggered on every keystroke',
      'Performance: update, toggleSection, handleSpeciesInput, updateRuikaart etc. wrapped in useCallback — stable references',
    ],
    wijzigingen_de: [
      'Performance: Artsuche auf 150ms gedrosselt — Suche durch 3500+ Arten wird nicht mehr bei jedem Tastendruck ausgelöst',
      'Performance: update, toggleSection, handleSpeciesInput, updateRuikaart u.a. in useCallback — stabile Referenzen',
    ],
  },
  {
    versie: '1.1.7',
    datum: '2026-03-20',
    wijzigingen: [
      'Offline: QuotaExceededError afgevangen in sync-wachtrij — gebruiker krijgt een duidelijke melding bij vol apparaat',
      'Offline: opslaggebruik zichtbaar in Instellingen → Cloudstatus (oranje waarschuwing boven 80%)',
    ],
    wijzigingen_en: [
      'Offline: QuotaExceededError caught in sync queue — user gets a clear message when device storage is full',
      'Offline: storage usage visible in Settings → Cloud status (orange warning above 80%)',
    ],
    wijzigingen_de: [
      'Offline: QuotaExceededError in der Sync-Warteschlange abgefangen — Benutzer erhält eine klare Meldung bei vollem Gerätespeicher',
      'Offline: Speichernutzung in Einstellungen → Cloudstatus sichtbar (orangefarbene Warnung ab 80%)',
    ],
  },
  {
    versie: '1.1.6',
    datum: '2026-03-20',
    wijzigingen: [
      'UX: ToastContext toegevoegd — gecentraliseerde meldingen in de gehele app',
      'UX: export- en importmeldingen in StatsPage tonen nu als toast (niet langer inline)',
    ],
    wijzigingen_en: [
      'UX: ToastContext added — centralised notifications throughout the app',
      'UX: export and import notifications in StatsPage now shown as toast (no longer inline)',
    ],
    wijzigingen_de: [
      'UX: ToastContext hinzugefügt — zentralisierte Benachrichtigungen in der gesamten App',
      'UX: Export- und Importbenachrichtigungen in StatsPage werden jetzt als Toast angezeigt (nicht mehr inline)',
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
    wijzigingen_en: [
      'Security: AdminPage now uses realRol (Supabase) instead of simulatedRole for access control',
      'Stability: ErrorBoundary added — crashes now show a recoverable error screen instead of a blank page',
      'Validation: import file is checked for required fields (bird name, ring number, catch date) before saving',
    ],
    wijzigingen_de: [
      'Security: AdminPage verwendet jetzt realRol (Supabase) statt simulatedRole für die Zugriffskontrolle',
      'Stabilität: ErrorBoundary hinzugefügt — Abstürze zeigen jetzt einen wiederherstellbaren Fehlerbildschirm statt einer leeren Seite',
      'Validierung: Importdatei wird vor dem Speichern auf Pflichtfelder geprüft (Vogelname, Ringnummer, Fangdatum)',
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
    wijzigingen_en: [
      'Refactor: SoortDetail split — editor mode moved to SoortDetailEditor.jsx (1022 → 712 lines)',
      'Refactor: computeBioRanges centralised in utils/bioHelper.js — NieuwPage and SoortDetail share the same logic',
      'Refactor: species pull centralised in SyncContext — useSpeciesRef now only reads from local cache',
      'Docs: merge priority documented in useSpeciesOverrides.getMerged()',
    ],
    wijzigingen_de: [
      'Refactor: SoortDetail aufgeteilt — Editor-Modus in SoortDetailEditor.jsx ausgelagert (1022 → 712 Zeilen)',
      'Refactor: computeBioRanges in utils/bioHelper.js zentralisiert — NieuwPage und SoortDetail nutzen dieselbe Logik',
      'Refactor: Species-Pull in SyncContext zentralisiert — useSpeciesRef liest jetzt nur noch aus dem lokalen Cache',
      'Docs: Merge-Priorität in useSpeciesOverrides.getMerged() dokumentiert',
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
    wijzigingen_en: [
      'Refactor: hamburger icon replaced by inline SVG',
      'Refactor: formatDatumTijd added to dateHelper — duplicate implementation in RecordsPage removed',
      'Refactor: STATS_UITGESLOTEN simplified from Set to array',
    ],
    wijzigingen_de: [
      'Refactor: Hamburger-Icon durch inline SVG ersetzt',
      'Refactor: formatDatumTijd zu dateHelper hinzugefügt — doppelte Implementierung in RecordsPage entfernt',
      'Refactor: STATS_UITGESLOTEN von Set zu Array vereinfacht',
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
    wijzigingen_en: [
      'PWA: PNG icons generated (192×192 and 512×512) — manifest was pointing to missing files',
      'PWA: maskable icon added for better display on Android',
      'PWA: shortcuts added (New catch, Catches, Statistics) for quick access from the home screen',
    ],
    wijzigingen_de: [
      'PWA: PNG-Icons generiert (192×192 und 512×512) — Manifest verwies auf fehlende Dateien',
      'PWA: maskierbares Icon für bessere Darstellung auf Android hinzugefügt',
      'PWA: Shortcuts hinzugefügt (Neuer Fang, Fänge, Statistiken) für schnellen Zugriff vom Startbildschirm',
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
    wijzigingen_en: [
      'UX: export error now shows a close button (✕) and export buttons are disabled during export',
      'Fix: app no longer hangs when profile loading fails (always calls setLoading(false))',
      'Fix: error message for failed species pull now visible in Cloud status',
    ],
    wijzigingen_de: [
      'UX: Exportfehler zeigt jetzt eine Schließen-Schaltfläche (✕) und Exportschaltflächen sind während des Exports deaktiviert',
      'Fix: App hängt sich nicht mehr auf, wenn das Laden des Profils fehlschlägt (ruft immer setLoading(false) auf)',
      'Fix: Fehlermeldung für fehlgeschlagenen Arten-Pull jetzt in Cloudstatus sichtbar',
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
    wijzigingen_en: [
      'Performance: React.lazy code-splitting — main bundle 806 kB → 687 kB',
      'Performance: Leaflet no longer loaded twice (CDN removed, npm bundle only)',
      'Performance: VangstKaart now loads Leaflet via dynamic import instead of window.L',
      'Performance: db.species.orderBy uses index instead of full table scan',
    ],
    wijzigingen_de: [
      'Performance: React.lazy Code-Splitting — Hauptbündel 806 kB → 687 kB',
      'Performance: Leaflet wird nicht mehr doppelt geladen (CDN entfernt, nur npm-Bündel)',
      'Performance: VangstKaart lädt Leaflet jetzt über Dynamic Import statt window.L',
      'Performance: db.species.orderBy verwendet Index statt vollständiger Tabellensuche',
    ],
  },
  {
    versie: '1.0.9',
    datum: '2026-03-20',
    wijzigingen: [
      'Security: DOMPurify toegevoegd aan renderMarkdown als extra sanitatielaag',
    ],
    wijzigingen_en: [
      'Security: DOMPurify added to renderMarkdown as an extra sanitisation layer',
    ],
    wijzigingen_de: [
      'Security: DOMPurify zu renderMarkdown als zusätzliche Bereinigungsschicht hinzugefügt',
    ],
  },
  {
    versie: '1.0.8',
    datum: '2026-03-20',
    wijzigingen: [
      'Refactor: NieuwPage opgesplitst in 7 sectiecomponenten via NieuwFormContext',
      'Refactor: NieuwPage haalt data zelf op via hooks — geen props meer vanuit App',
    ],
    wijzigingen_en: [
      'Refactor: NieuwPage split into 7 section components via NieuwFormContext',
      'Refactor: NieuwPage now fetches its own data via hooks — no more props from App',
    ],
    wijzigingen_de: [
      'Refactor: NieuwPage in 7 Abschnittskomponenten via NieuwFormContext aufgeteilt',
      'Refactor: NieuwPage holt Daten jetzt selbst über Hooks — keine Props mehr von App',
    ],
  },
  {
    versie: '1.0.7',
    datum: '2026-03-20',
    wijzigingen: [
      'Sync: verloren wijzigingen (na 5 mislukte pogingen) worden zichtbaar gemeld in Instellingen → Cloudstatus',
      'Refactor: executeQueueItem verplaatst naar utils/syncQueue.js (betere scheiding van verantwoordelijkheden)',
    ],
    wijzigingen_en: [
      'Sync: lost changes (after 5 failed attempts) are visibly reported in Settings → Cloud status',
      'Refactor: executeQueueItem moved to utils/syncQueue.js (better separation of concerns)',
    ],
    wijzigingen_de: [
      'Sync: verlorene Änderungen (nach 5 fehlgeschlagenen Versuchen) werden in Einstellungen → Cloudstatus sichtbar gemeldet',
      'Refactor: executeQueueItem nach utils/syncQueue.js verschoben (bessere Trennung der Zuständigkeiten)',
    ],
  },
  {
    versie: '1.0.6',
    datum: '2026-03-20',
    wijzigingen: [
      'Security: SUPABASE_SERVICE_KEY verwijderd uit .env.local (niet gebruikt, hoort niet in client-omgeving)',
      'PWA: Service Worker van autoUpdate naar prompt — update-banner werkt nu correct',
    ],
    wijzigingen_en: [
      'Security: SUPABASE_SERVICE_KEY removed from .env.local (unused, does not belong in client environment)',
      'PWA: Service Worker changed from autoUpdate to prompt — update banner now works correctly',
    ],
    wijzigingen_de: [
      'Security: SUPABASE_SERVICE_KEY aus .env.local entfernt (nicht verwendet, gehört nicht in die Client-Umgebung)',
      'PWA: Service Worker von autoUpdate auf prompt umgestellt — Update-Banner funktioniert jetzt korrekt',
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
    wijzigingen_en: [
      'Major cleanup: all historical seed and migration files removed (data is fully in Supabase)',
      'useRecords: static JSON import for foreign/other-rings replaced by Supabase pull',
      'App bundle reduced from ~2.6 MB to ~1.0 MB',
    ],
    wijzigingen_de: [
      'Große Bereinigung: alle historischen Seed- und Migrationsdateien entfernt (Daten vollständig in Supabase)',
      'useRecords: statischer JSON-Import für Ausland/andere-Ringe durch Supabase-Pull ersetzt',
      'App-Bündel von ~2,6 MB auf ~1,0 MB verkleinert',
    ],
  },
  {
    versie: '1.0.4',
    datum: '2026-03-20',
    wijzigingen: [
      'Opruiming: euring-codes.json fallback verwijderd — alle 3565 soorten hebben EURING-code in Supabase',
    ],
    wijzigingen_en: [
      'Cleanup: euring-codes.json fallback removed — all 3565 species have EURING code in Supabase',
    ],
    wijzigingen_de: [
      'Bereinigung: euring-codes.json-Fallback entfernt — alle 3565 Arten haben EURING-Code in Supabase',
    ],
  },
  {
    versie: '1.0.3',
    datum: '2026-03-20',
    wijzigingen: [
      'Opruiming: species-reference.json en generate-species-sql.js verwijderd (niet langer nodig, Supabase is gevuld)',
    ],
    wijzigingen_en: [
      'Cleanup: species-reference.json and generate-species-sql.js removed (no longer needed, Supabase is populated)',
    ],
    wijzigingen_de: [
      'Bereinigung: species-reference.json und generate-species-sql.js entfernt (nicht mehr benötigt, Supabase ist befüllt)',
    ],
  },
  {
    versie: '1.0.2',
    datum: '2026-03-20',
    wijzigingen: [
      'Fix: taalfout "ringen ontbreekt" gecorrigeerd naar "ringen ontbreken" bij ringstrengen',
    ],
    wijzigingen_en: [
      'Fix: language error "ringen ontbreekt" corrected to "ringen ontbreken" for ring strings',
    ],
    wijzigingen_de: [
      'Fix: Sprachfehler „ringen ontbreekt" zu „ringen ontbreken" bei Ringschnüren korrigiert',
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
    wijzigingen_en: [
      'About page: app description rewritten and placed above Maker section',
      'Maker: ringer number removed, e-mail address added',
      'Version number placed after the page title',
      'Sources completed and sorted: authors, Griel specification, Handkenmerken, Demongin, Leaflet',
    ],
    wijzigingen_de: [
      'Über-Seite: App-Beschreibung neu geschrieben und über dem Ersteller-Abschnitt platziert',
      'Ersteller: Ringernummer entfernt, E-Mail-Adresse hinzugefügt',
      'Versionsnummer hinter dem Seitentitel platziert',
      'Quellen ergänzt und sortiert: Autoren, Griel-Spezifikation, Handkenmerken, Demongin, Leaflet',
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
    wijzigingen_en: [
      'Record catches with full EURING/Griel entry form',
      'Offline operation as PWA with service worker',
      'Griel XML and CSV export',
      'Supabase cloud sync with offline queue',
      'Species page with biometrics reference and own catch statistics',
      'Moult chart with visual moult score diagram',
      'Project and ring string management',
      'Statistics, charts and map view',
      'Dark / light / system theme',
      'Multiple users with role management (admin / ringer / viewer)',
      'Admin panel for user management and moult type configuration',
      'Settings: help display, sync status, my data',
    ],
    wijzigingen_de: [
      'Fänge erfassen mit vollständigem EURING/Griel-Erfassungsformular',
      'Offline-Betrieb als PWA mit Service Worker',
      'Griel-XML- und CSV-Export',
      'Supabase-Cloud-Synchronisierung mit Offline-Warteschlange',
      'Artenseite mit Biometrie-Referenz und eigenen Fangstatistiken',
      'Mauserkarte mit visuellem Mauserdiagramm',
      'Projekte- und Ringschnüre-Verwaltung',
      'Statistiken, Diagramme und Kartenansicht',
      'Dunkel- / Hell- / System-Thema',
      'Mehrere Benutzer mit Rollenverwaltung (Admin / Beringer / Betrachter)',
      'Admin-Panel für Benutzerverwaltung und Mausertyp-Konfiguration',
      'Einstellungen: Hilfsanzeige, Synchronisierungsstatus, Meine Daten',
    ],
  },
];
