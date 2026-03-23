/**
 * SOVON-codelijsten voor het nestkastonderzoek-systeem.
 * Conform de SOVON Digitale Nestkaart coderingen (coderingen.pdf).
 *
 * Verifieer bij twijfel altijd de exacte codes tegen docs/nestkast/coderingen.pdf.
 */

// ── HABITAT ──────────────────────────────────────────────────────────────────
// Codes 0-72; alleen de meest voorkomende zijn hier opgenomen.
// Vul aan uit coderingen.pdf als overige typen nodig zijn.
export const HABITAT_CODES = [
  { code: 0,  nl: 'Onbekend',                          en: 'Unknown',                        de: 'Unbekannt' },
  // BOS/PARK
  { code: 10, nl: 'Bos/park (categorie)',               en: 'Forest/park (category)',         de: 'Wald/Park (Kategorie)' },
  { code: 11, nl: 'Naaldbos',                           en: 'Coniferous forest',              de: 'Nadelwald' },
  { code: 12, nl: 'Loofbos',                            en: 'Deciduous forest',               de: 'Laubwald' },
  { code: 13, nl: 'Gemengd bos',                        en: 'Mixed forest',                   de: 'Mischwald' },
  { code: 14, nl: 'Moerasbos',                          en: 'Swamp forest',                   de: 'Sumpfwald' },
  { code: 15, nl: 'Kaalkap/aanplant < 1 m',             en: 'Clear-cut/planting < 1 m',       de: 'Kahlschlag/Aufforstung < 1 m' },
  // HEIDE/STUIFZAND
  { code: 20, nl: 'Heide/stuifzand (categorie)',        en: 'Heath/sand drift (category)',    de: 'Heide/Flugsand (Kategorie)' },
  { code: 21, nl: 'Duinheide/-vallei',                  en: 'Dune heath/valley',              de: 'Dünenheide/-tal' },
  { code: 22, nl: 'Heide binnenland',                   en: 'Inland heathland',               de: 'Binnenlandheide' },
  { code: 23, nl: 'Stuifzand',                          en: 'Sand drift',                     de: 'Flugsand' },
  // KUST
  { code: 30, nl: 'Kust (categorie)',                   en: 'Coast (category)',               de: 'Küste (Kategorie)' },
  { code: 31, nl: 'Zandbank/spaarzaam begroeide plaat', en: 'Sandbank/sparsely vegetated',   de: 'Sandbank/spärlich bewachsene Platte' },
  { code: 32, nl: 'Schor/gors/kwelder',                 en: 'Salt marsh',                     de: 'Salzwiese/Watt' },
  { code: 33, nl: 'Strand',                             en: 'Beach',                          de: 'Strand' },
  { code: 34, nl: 'Duin',                               en: 'Dune',                           de: 'Düne' },
  // MOERAS/WATER
  { code: 40, nl: 'Moeras/water (categorie)',           en: 'Marsh/water (category)',         de: 'Sumpf/Wasser (Kategorie)' },
  { code: 41, nl: 'Riet',                               en: 'Reedbed',                        de: 'Schilf' },
  { code: 42, nl: 'Ruigte',                             en: 'Rough vegetation',               de: 'Hochstauden/Brache' },
  { code: 43, nl: 'Struweel',                           en: 'Scrub',                          de: 'Gebüsch' },
  { code: 44, nl: 'Oever van open water',               en: 'Bank of open water',             de: 'Ufer von offenem Gewässer' },
  // CULTUURLAND
  { code: 50, nl: 'Cultuurland (categorie)',            en: 'Farmland (category)',            de: 'Kulturland (Kategorie)' },
  { code: 51, nl: 'Grasland',                           en: 'Grassland',                      de: 'Grünland' },
  { code: 52, nl: 'Akkerland',                          en: 'Arable land',                    de: 'Ackerland' },
  { code: 53, nl: 'Boomgaard',                          en: 'Orchard',                        de: 'Obstgarten' },
  { code: 54, nl: 'Boerenerf',                          en: 'Farmyard',                       de: 'Bauernhof' },
  // BEBOUWING
  { code: 60, nl: 'Bebouwing (categorie)',              en: 'Urban (category)',               de: 'Bebauung (Kategorie)' },
  { code: 61, nl: 'Woonwijk, weinig beplanting',        en: 'Residential, sparse planting',  de: 'Wohngebiet, wenig Bepflanzung' },
  { code: 62, nl: 'Woonwijk, veel beplanting',          en: 'Residential, much planting',    de: 'Wohngebiet, viel Bepflanzung' },
  { code: 63, nl: 'Industrieterrein',                   en: 'Industrial area',                de: 'Industriegebiet' },
  { code: 64, nl: 'Plantsoen',                          en: 'Park/garden',                    de: 'Grünanlage' },
  { code: 65, nl: 'Dijk',                               en: 'Dyke',                           de: 'Deich' },
  // VEEN
  { code: 70, nl: 'Veen (categorie)',                   en: 'Peat (category)',                de: 'Moor (Kategorie)' },
  { code: 71, nl: 'Hoogveen',                           en: 'Raised bog',                     de: 'Hochmoor' },
  { code: 72, nl: 'Laagveen',                           en: 'Fen/lowland peat',               de: 'Niedermoor' },
];

// ── NESTPLAATS ────────────────────────────────────────────────────────────────
// Exacte plaatsing van het nest. -1 = onbekend.
export const NESTPLAATS_CODES = [
  { code: -1, nl: 'Onbekend',                                en: 'Unknown',                              de: 'Unbekannt' },
  { code: 0,  nl: 'Drijvend op water',                       en: 'Floating on water',                    de: 'Schwimmend auf Wasser' },
  { code: 1,  nl: 'Op kale bodem',                           en: 'On bare ground',                       de: 'Auf kahlem Boden' },
  { code: 2,  nl: 'Bladeren/takken op grond',                en: 'Leaves/branches on ground',            de: 'Blätter/Äste auf dem Boden' },
  { code: 3,  nl: 'Kruidlaag',                               en: 'Herb layer',                           de: 'Krautschicht' },
  { code: 4,  nl: 'Ruigtekruiden (geef plantensoort)',       en: 'Rank vegetation (specify plant)',       de: 'Hochstauden (Pflanzenart angeben)' },
  { code: 5,  nl: 'Landbouwgewas (geef gewas)',              en: 'Agricultural crop (specify crop)',      de: 'Kulturpflanze (Pflanzenart angeben)' },
  { code: 6,  nl: 'Struiken/houtwal/etc. (geef soort)',      en: 'Shrubs/hedgerow (specify species)',     de: 'Sträucher/Hecke (Art angeben)' },
  { code: 7,  nl: 'Greppel/slootrand',                       en: 'Ditch/ditch bank',                     de: 'Graben/Grabenrand' },
  { code: 8,  nl: 'Omgevallen boom of soortgelijke plek',    en: 'Fallen tree or similar',               de: 'Umgefallener Baum oder ähnliches' },
  { code: 9,  nl: 'Naaldboom (geef boomsoort)',              en: 'Conifer (specify species)',             de: 'Nadelbaum (Art angeben)' },
  { code: 10, nl: 'Loofboom (geef boomsoort)',               en: 'Deciduous tree (specify species)',      de: 'Laubbaum (Art angeben)' },
  { code: 11, nl: 'Gebouw',                                  en: 'Building',                             de: 'Gebäude' },
  { code: 12, nl: 'Hoogspanningsmast',                       en: 'Power line pylon',                     de: 'Hochspannungsmast' },
  { code: 13, nl: 'Nestkast aan paal',                       en: 'Nest box on pole',                     de: 'Nistkasten an Pfahl' },
  { code: 99, nl: 'Overig (vul in bij toelichting)',         en: 'Other (add note)',                     de: 'Sonstige (in Erläuterung angeben)' },
];

// ── NESTTYPE (NEST) ───────────────────────────────────────────────────────────
// Type nest of neststructuur
export const NESTTYPE_CODES = [
  { code: -1, nl: 'Onbekend',                                        en: 'Unknown',                                    de: 'Unbekannt' },
  { code: 0,  nl: 'Zelf gebouwd',                                    en: 'Self-built',                                 de: 'Selbst gebaut' },
  { code: 1,  nl: 'Van andere soort (geef toelichting)',             en: 'From other species (add note)',              de: 'Von anderer Art (Erläuterung angeben)' },
  { code: 2,  nl: 'Nestkast (geef kastnummer bij toelichting)',      en: 'Nest box (add box number in notes)',         de: 'Nistkasten (Kastnummer in Erläuterung)' },
  { code: 3,  nl: 'Holte (stenen, grond, ingerot gat)',             en: 'Hollow (stone, ground, rotted hole)',        de: 'Höhle (Stein, Boden, verfaultes Loch)' },
  { code: 4,  nl: 'Overig (geef toelichting)',                      en: 'Other (add note)',                           de: 'Sonstige (Erläuterung angeben)' },
  { code: 5,  nl: 'Nest uit een eerder jaar',                        en: 'Nest from a previous year',                 de: 'Nest aus einem früheren Jahr' },
  { code: 6,  nl: 'Hergebruikt nest (zelfde jaar; geen nestkast)',   en: 'Reused nest (same year; no nest box)',      de: 'Wiederverwendetes Nest (gleiches Jahr; kein Nistkasten)' },
];

// ── VONDST ────────────────────────────────────────────────────────────────────
// Hoe is het nest gevonden?
export const VONDST_CODES = [
  { code: 0, nl: 'Onbekend',                        en: 'Unknown',                            de: 'Unbekannt' },
  { code: 1, nl: 'Toevallig',                        en: 'By chance',                          de: 'Zufällig' },
  { code: 2, nl: 'Koud zoeken',                      en: 'Cold search',                        de: 'Gezielte Suche' },
  { code: 3, nl: 'Ouders gevolgd',                   en: 'Followed parents',                   de: 'Eltern verfolgt' },
  { code: 4, nl: 'Nest was al bekend',               en: 'Nest already known',                 de: 'Nest war bereits bekannt' },
  { code: 5, nl: 'Kolonietelling',                   en: 'Colony count',                       de: 'Koloniezählung' },
  { code: 6, nl: 'Anderszins (geef toelichting)',    en: 'Otherwise (add note)',               de: 'Anderweitig (Erläuterung angeben)' },
  { code: 7, nl: 'Getipt (melding van derden)',      en: 'Tipped off (report from others)',    de: 'Hinweis von Dritten' },
];

// ── VERSTOPT ──────────────────────────────────────────────────────────────────
// Mate waarin het nest verborgen is
export const VERSTOPT_CODES = [
  { code: 0, nl: 'Onbekend',               en: 'Unknown',              de: 'Unbekannt' },
  { code: 1, nl: 'Nest zeer opvallend',    en: 'Nest very conspicuous', de: 'Nest sehr auffällig' },
  { code: 3, nl: 'Nest niet goed verstopt', en: 'Nest not well hidden', de: 'Nest nicht gut versteckt' },
  { code: 5, nl: 'Nest goed verstopt',     en: 'Nest well hidden',     de: 'Nest gut versteckt' },
];

// ── BESCHERM ──────────────────────────────────────────────────────────────────
// Aanwezige bescherming
export const BESCHERM_CODES = [
  { code: 1, nl: 'Geen nestbescherming',                        en: 'No nest protection',                     de: 'Kein Nestschutz' },
  { code: 2, nl: 'Nesten gemarkeerd met stokjes',               en: 'Nests marked with sticks',               de: 'Nester mit Stäbchen markiert' },
  { code: 3, nl: 'Nestbeschermer over nest',                    en: 'Nest protector over nest',               de: 'Nestschutz über Nest' },
  { code: 4, nl: 'Schrikdraad rondom nest',                     en: 'Electric fence around nest',             de: 'Elektrozaun um Nest' },
  { code: 5, nl: 'Nest beschermd, onbekend hoe',                en: 'Nest protected, method unknown',         de: 'Nest geschützt, Methode unbekannt' },
  { code: 6, nl: 'Nestkast beschermd tegen predatie',           en: 'Nest box protected against predation',   de: 'Nistkasten gegen Prädation geschützt' },
  { code: 7, nl: 'Nestkast beschermd tegen andere soorten',     en: 'Nest box protected against other species', de: 'Nistkasten gegen andere Arten geschützt' },
];

// ── LINK_TYPE ─────────────────────────────────────────────────────────────────
// Relatie van dit legsel met het vorige legsel/seizoen
export const LINK_TYPE_CODES = [
  { code: 0, nl: 'Nieuw — eerste legsel of nieuw seizoen' },
  { code: 1, nl: 'Vervolglegsel — zelfde paar, zelfde seizoen' },
  { code: 2, nl: 'Hergebruik — ander individu, zelfde seizoen' },
  { code: 3, nl: 'Hergebruik — zelfde paar, volgend seizoen' },
  { code: 4, nl: 'Hergebruik — ander individu, volgend seizoen' },
  { code: 5, nl: 'Relatie onbekend' },
  { code: 6, nl: 'Geen relatie met vorig nest/legsel' },
];

// ── STADIUM ───────────────────────────────────────────────────────────────────
// Nestfase bij een bezoek
export const STADIUM_CODES = [
  { code: 'L0',  groep: 'leeg',     nl: 'L0 — Leeg' },
  { code: 'B0',  groep: 'bouw',     nl: 'B0 — Nestbouw begonnen' },
  { code: 'B1',  groep: 'bouw',     nl: 'B1 — Nestbouw gevorderd' },
  { code: 'B2',  groep: 'bouw',     nl: 'B2 — Nest bijna klaar' },
  { code: 'B3',  groep: 'bouw',     nl: 'B3 — Nest klaar, geen eieren' },
  { code: 'B4',  groep: 'bouw',     nl: 'B4 — Nestbouw met tussenpozen' },
  { code: 'B5',  groep: 'bouw',     nl: 'B5 — Nestbouwfase onbekend' },
  { code: 'P0',  groep: 'ouders',   nl: 'P0 — Ouder aanwezig, stadium onbekend' },
  { code: 'P1',  groep: 'ouders',   nl: 'P1 — Ouder broedend' },
  { code: 'P2',  groep: 'ouders',   nl: 'P2 — Ouder voedert' },
  { code: 'P3',  groep: 'ouders',   nl: 'P3 — Ouder alarmeert' },
  { code: 'P4',  groep: 'ouders',   nl: 'P4 — Ouder weggevlogen bij nadering' },
  { code: 'P5',  groep: 'ouders',   nl: 'P5 — Afwezige ouder (inhoud onbekend)' },
  { code: 'P6',  groep: 'ouders',   nl: 'P6 — Oudergedrag onbekend' },
  { code: 'E0',  groep: 'eieren',   nl: 'E0 — Eieren, aantal onbekend', tKey: 'stad_e0' },
  { code: 'E1',  groep: 'eieren',   nl: 'E1 — Koud, onbebroed',         tKey: 'stad_e1' },
  { code: 'E2',  groep: 'eieren',   nl: 'E2 — Warm',                    tKey: 'stad_e2' },
  { code: 'E3',  groep: 'eieren',   nl: 'E3 — Toegedekt',               tKey: 'stad_e3' },
  { code: 'E4',  groep: 'eieren',   nl: 'E4 — Vers',                    tKey: 'stad_e4' },
  { code: 'E5',  groep: 'eieren',   nl: 'E5 — Bebroed',                 tKey: 'stad_e5' },
  { code: 'E6',  groep: 'eieren',   nl: 'E6 — Komen uit',               tKey: 'stad_e6' },
  { code: 'E7',  groep: 'eieren',   nl: 'E7 — Jongen piepend in ei',    tKey: 'stad_e7' },
  { code: 'N+',  groep: 'pulli',    nl: 'N+ — Pulli aanwezig, leeftijd onbekend' },
  { code: 'N0',  groep: 'pulli',    nl: 'N0 — Pulli dag 0 (net uitgekomen)' },
  { code: 'N1',  groep: 'pulli',    nl: 'N1 — Pulli dag 1' },
  { code: 'N2',  groep: 'pulli',    nl: 'N2 — Pulli dag 2' },
  { code: 'N3',  groep: 'pulli',    nl: 'N3 — Pulli dag 3' },
  { code: 'N4',  groep: 'pulli',    nl: 'N4 — Pulli dag 4' },
  { code: 'N5',  groep: 'pulli',    nl: 'N5 — Pulli dag 5' },
  { code: 'N6',  groep: 'pulli',    nl: 'N6 — Pulli dag 6' },
  { code: 'N7',  groep: 'pulli',    nl: 'N7 — Pulli dag 7' },
  { code: 'N8',  groep: 'pulli',    nl: 'N8 — Pulli dag 8' },
  { code: 'N9',  groep: 'pulli',    nl: 'N9 — Pulli dag 9' },
  { code: 'N10', groep: 'pulli',    nl: 'N10 — Pulli dag 10' },
  { code: 'N11', groep: 'pulli',    nl: 'N11 — Pulli dag 11+' },
  { code: 'C1',  groep: 'nacontrole', nl: 'C1 — Nacontrole: uitgevlogen' },
  { code: 'C2',  groep: 'nacontrole', nl: 'C2 — Nacontrole: mislukt' },
  { code: 'C3',  groep: 'nacontrole', nl: 'C3 — Nacontrole: onbekend' },
  { code: 'C4',  groep: 'nacontrole', nl: 'C4 — Nacontrole: gedeeltelijk' },
  { code: 'C5',  groep: 'nacontrole', nl: 'C5 — Nacontrole: nog bezet' },
  { code: 'C6',  groep: 'nacontrole', nl: 'C6 — Nacontrole: verlaten' },
  { code: 'C7',  groep: 'nacontrole', nl: 'C7 — Nacontrole: leeg (onbekend)' },
  { code: 'C8',  groep: 'nacontrole', nl: 'C8 — Nacontrole: nest vernield' },
  { code: 'C9',  groep: 'nacontrole', nl: 'C9 — Nacontrole: overig' },
  { code: 'X0',  groep: 'overig',   nl: 'X0 — Niet gebruiken / onjuist' },
];

// ── NESTSUCCES ────────────────────────────────────────────────────────────────
// Aantal uitgevlogen jongen. -1 = onbekend. 0-25 = getal.
// SUCCES2: categorie
export const SUCCES2_CODES = [
  { code: 'S', nl: 'Succesvol (≥ 1 jong uitgevlogen)' },
  { code: 'M', nl: 'Mislukt (0 jongen uitgevlogen)' },
  { code: 'O', nl: 'Onbekend' },
];

export const MOMENT_CODES = [
  { code: 1, nl: '1 — Verlies in eifase' },
  { code: 2, nl: '2 — Verlies in pullifase' },
  { code: 3, nl: '3 — Verlies in beide fasen' },
];

export const PREDATIE_CODES = [
  { code: 0, nl: '0 — Geen predatie/onbekend' },
  { code: 1, nl: '1 — Zoogdier' },
  { code: 2, nl: '2 — Vogel' },
  { code: 3, nl: '3 — Reptiel' },
  { code: 4, nl: '4 — Mens' },
  { code: 5, nl: '5 — Nest- of nestplaatsgenoot' },
  { code: 6, nl: '6 — Fret/hermelijn' },
  { code: 7, nl: '7 — Marter' },
  { code: 8, nl: '8 — Onbekend roofdier' },
];

export const METHODE_CODES = [
  { code: 0,  nl: '0 — Onbekend' },
  { code: 1,  nl: '1 — Directe telling uitgevlogen jongen' },
  { code: 2,  nl: '2 — Nestinhoud bij laatste bezoek' },
  { code: 3,  nl: '3 — Omgekeerd: nestinhoud + verliesregistratie' },
  { code: 4,  nl: '4 — Berekend uit eiaflegdata' },
  { code: 5,  nl: '5 — Markering eieren/pulli' },
  { code: 6,  nl: '6 — Nestkaart formule' },
  { code: 7,  nl: '7 — Schatting' },
  { code: 8,  nl: '8 — Ringgegevens als bewijs' },
  { code: 9,  nl: '9 — Nestcamera' },
  { code: 10, nl: '10 — Telemetrie' },
  { code: 11, nl: '11 — Anders' },
  { code: 12, nl: '12 — Niet vastgesteld' },
];

// ── VERLIES ───────────────────────────────────────────────────────────────────
// Verliesoorzaak: prefix geeft fase aan (E=ei, J=jong, L=legsel, N=nest, O=overig, V=vluchtelinge, W=weersomstandigheid)
export const VERLIES_CODES = [
  // Eieren
  { code: 'E1',  nl: 'E1 — Ei niet bevrucht' },
  { code: 'E2',  nl: 'E2 — Ei afgestorven' },
  { code: 'E3',  nl: 'E3 — Ei gepredeerd' },
  { code: 'E4',  nl: 'E4 — Ei verlaten' },
  { code: 'E5',  nl: 'E5 — Ei verwijderd door mens' },
  { code: 'E6',  nl: 'E6 — Ei beschadigd (niet predatie)' },
  { code: 'E7',  nl: 'E7 — Ei verdwenen (onbekend)' },
  // Jongen
  { code: 'J1',  nl: 'J1 — Jong gepredeerd' },
  { code: 'J2',  nl: 'J2 — Jong verhongerd' },
  { code: 'J3',  nl: 'J3 — Jong afgestorven (ziekte)' },
  { code: 'J4',  nl: 'J4 — Jong verlaten' },
  { code: 'J5',  nl: 'J5 — Jong door mens verwijderd' },
  { code: 'J6',  nl: 'J6 — Jong verdronken' },
  { code: 'J7',  nl: 'J7 — Jong uitgevallen' },
  { code: 'J8',  nl: 'J8 — Jong beschadigd' },
  { code: 'J9',  nl: 'J9 — Jong verdwenen (onbekend)' },
  // Overig
  { code: 'O1',  nl: 'O1 — Nest verlaten' },
  { code: 'O2',  nl: 'O2 — Nest vernield' },
  { code: 'O3',  nl: 'O3 — Nest gepredeerd (geheel)' },
  { code: 'O4',  nl: 'O4 — Overstroming' },
  { code: 'O5',  nl: 'O5 — Overig/onbekend' },
];

// ── BETROUWBAARHEID ──────────────────────────────────────────────────────────
export const BETROUWB_DATUM_CODES = [
  { code: 1, nl: '1 — Exacte datum',    en: '1 — Exact date',      de: '1 — Exaktes Datum' },
  { code: 2, nl: '2 — ± 1 dag',         en: '2 — ± 1 day',         de: '2 — ± 1 Tag' },
  { code: 3, nl: '3 — ± 2–3 dagen',     en: '3 — ± 2–3 days',      de: '3 — ± 2–3 Tage' },
  { code: 4, nl: '4 — ± 1 week',        en: '4 — ± 1 week',        de: '4 — ± 1 Woche' },
  { code: 5, nl: '5 — ± 2 weken',       en: '5 — ± 2 weeks',       de: '5 — ± 2 Wochen' },
  { code: 6, nl: '6 — Datum onbekend',  en: '6 — Date unknown',    de: '6 — Datum unbekannt' },
];

export const BETROUWB_AANTAL_CODES = [
  { code: 1, nl: '1 — Exact geteld',     en: '1 — Exact count',         de: '1 — Exakt gezählt' },
  { code: 2, nl: '2 — Geschat ± 1',      en: '2 — Estimated ± 1',       de: '2 — Geschätzt ± 1' },
  { code: 3, nl: '3 — Geschat ± 2–3',    en: '3 — Estimated ± 2–3',     de: '3 — Geschätzt ± 2–3' },
  { code: 4, nl: '4 — Geschat ± 5',      en: '4 — Estimated ± 5',       de: '4 — Geschätzt ± 5' },
  { code: 5, nl: '5 — Ruwe schatting',   en: '5 — Rough estimate',      de: '5 — Grobe Schätzung' },
  { code: 6, nl: '6 — Minimum bekend',   en: '6 — Minimum known',       de: '6 — Minimum bekannt' },
  { code: 7, nl: '7 — Onbekend',         en: '7 — Unknown',             de: '7 — Unbekannt' },
];

export const BETROUWB_DAGEN_CODES = [
  { code: 1, nl: '1 — Exact (gewogen/gemeten)', en: '1 — Exact (weighed/measured)', de: '1 — Exakt (gewogen/gemessen)' },
  { code: 2, nl: '2 — ± 1–2 dagen',            en: '2 — ± 1–2 days',               de: '2 — ± 1–2 Tage' },
  { code: 3, nl: '3 — ± 3–4 dagen',            en: '3 — ± 3–4 days',               de: '3 — ± 3–4 Tage' },
  { code: 4, nl: '4 — ± 5–7 dagen',            en: '4 — ± 5–7 days',               de: '4 — ± 5–7 Tage' },
  { code: 5, nl: '5 — ± 1–2 weken',            en: '5 — ± 1–2 weeks',              de: '5 — ± 1–2 Wochen' },
  { code: 6, nl: '6 — Ruwe schatting',         en: '6 — Rough estimate',           de: '6 — Grobe Schätzung' },
  { code: 7, nl: '7 — Onbekend',               en: '7 — Unknown',                  de: '7 — Unbekannt' },
];

// ── EISUCCES ─────────────────────────────────────────────────────────────────
export const EISUCCES_CODES = [
  { code: 1, nl: '1 — Uitgekomen' },
  { code: 2, nl: '2 — Niet uitgekomen — verlaten' },
  { code: 3, nl: '3 — Niet uitgekomen — infertiel' },
  { code: 4, nl: '4 — Niet uitgekomen — afgestorven' },
  { code: 5, nl: '5 — Niet uitgekomen — gepredeerd' },
  { code: 6, nl: '6 — Niet uitgekomen — beschadigd' },
  { code: 7, nl: '7 — Niet uitgekomen — reden onbekend' },
  { code: 8, nl: '8 — Lot onbekend' },
];

export const VINDSTATUS_CODES = [
  { code: 0, nl: '0 — Onbekend' },
  { code: 1, nl: '1 — Vers (< 24u oud)' },
  { code: 2, nl: '2 — Recent (1–3 dagen)' },
  { code: 3, nl: '3 — Oud (> 3 dagen)' },
];

// ── KASTTYPE ─────────────────────────────────────────────────────────────────
// Type nestkast of neststructuur
export const KASTTYPE_CODES = [
  { code: 0, nl: 'Geen nestkast (vrij nest / holte)',       en: 'No nest box (open nest / hollow)',       de: 'Kein Nistkasten (Freinest / Höhle)' },
  { code: 1, nl: 'Standaard nestkast (ronde/ovale ingang)', en: 'Standard nest box (round/oval hole)',    de: 'Standard-Nistkasten (runde/ovale Öffnung)' },
  { code: 2, nl: 'Half-open nestkast',                      en: 'Semi-open nest box',                    de: 'Halboffener Nistkasten' },
  { code: 3, nl: 'Platform / nestplateau',                   en: 'Nest platform / tray',                  de: 'Nestplatte / Nestpalette' },
  { code: 4, nl: 'Kunstmatige holte (nis, muurgat)',        en: 'Artificial hollow (niche, wall hole)',   de: 'Künstliche Höhle (Nische, Maueröffnung)' },
  { code: 5, nl: 'Overig / onbekend',                       en: 'Other / unknown',                       de: 'Sonstiges / unbekannt' },
];

// ── EIMETHODE ─────────────────────────────────────────────────────────────────
// Methode waarmee de datum van het eerste ei is bepaald
export const EIMETHODE_CODES = [
  { code: 0, nl: 'Onbekend',                                  en: 'Unknown',                             de: 'Unbekannt' },
  { code: 1, nl: 'Eigen waarneming (eerste ei zelf gezien)',  en: 'Direct observation (egg seen)',       de: 'Eigene Beobachtung (Ei selbst gesehen)' },
  { code: 2, nl: 'Berekend via broedduur',                    en: 'Calculated via incubation period',    de: 'Berechnet über Brutdauer' },
  { code: 3, nl: 'Berekend via leeftijd pulli',               en: 'Calculated via pullus age',           de: 'Berechnet über Pullus-Alter' },
  { code: 4, nl: 'Berekend via eilegsnelheid',                en: 'Calculated via egg-laying rate',      de: 'Berechnet über Legefolge' },
];

// ── NESTRING ─────────────────────────────────────────────────────────────────
export const NEST_SEXE_CODES = [
  { code: 'O', nl: 'Onbekend' },
  { code: 'M', nl: 'Man' },
  { code: 'V', nl: 'Vrouw' },
];

export const NEST_LEEFTIJD_CODES = [
  { code: 1, nl: '1 — Adult' },
  { code: 2, nl: '2 — Jong (pullus)' },
];

export const NEST_POSITIE_CODES = [
  { code: 'LO', nl: 'LO — Linker poot, bovenste ring' },
  { code: 'RO', nl: 'RO — Rechter poot, bovenste ring' },
  { code: 'LB', nl: 'LB — Linker poot, onderste ring' },
  { code: 'RB', nl: 'RB — Rechter poot, onderste ring' },
  { code: 'L',  nl: 'L — Linker poot (enkel)' },
  { code: 'R',  nl: 'R — Rechter poot (enkel)' },
  { code: 'O',  nl: 'O — Beide poten, bovenste' },
  { code: 'B',  nl: 'B — Beide poten, onderste' },
];

export const NEST_CONDITIE_CODES = [
  { code: 0, nl: '0 — Niet beoordeeld' },
  { code: 1, nl: '1 — Uitstekend' },
  { code: 2, nl: '2 — Goed' },
  { code: 3, nl: '3 — Redelijk' },
  { code: 4, nl: '4 — Matig' },
  { code: 5, nl: '5 — Slecht' },
  { code: 6, nl: '6 — Zeer slecht' },
  { code: 7, nl: '7 — Stervend/dood' },
];

export const NEST_KROP_CODES = [
  { code: -1, nl: '-1 — Niet van toepassing' },
  { code: 0,  nl: '0 — Leeg' },
  { code: 1,  nl: '1 — Half gevuld' },
  { code: 2,  nl: '2 — Vol' },
];
