export const VERSIE = '1.9.3';

export const CHANGELOG = [
  {
    versie: '1.9.3',
    datum: '2026-03-22',
    wijzigingen: [
      'UX: terugvangst-info toont nu ook het geslacht van de eerste eigen vangst',
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
