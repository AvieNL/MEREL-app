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
  { code: 0,  nl: 'Onbekend' },
  { code: 1,  nl: 'Akker' },
  { code: 2,  nl: 'Boomgaard' },
  { code: 3,  nl: 'Loofbos' },
  { code: 4,  nl: 'Naaldbos' },
  { code: 5,  nl: 'Gemengd bos' },
  { code: 6,  nl: 'Bosrand' },
  { code: 7,  nl: 'Braakliggend terrein' },
  { code: 8,  nl: 'Duinen' },
  { code: 9,  nl: 'Groenstrook/berm' },
  { code: 10, nl: 'Heide' },
  { code: 11, nl: 'Houtwal/singel' },
  { code: 12, nl: 'Moeras/rietland' },
  { code: 13, nl: 'Park/begraafplaats' },
  { code: 14, nl: 'Slootkant/oever' },
  { code: 15, nl: 'Stedelijk gebied/tuin' },
  { code: 16, nl: 'Weiland' },
  { code: 17, nl: 'Rivier/beek' },
  { code: 18, nl: 'Plas/meer/ven' },
  { code: 19, nl: 'Zandverstuiving' },
  { code: 43, nl: 'Erf/boerderij' },
];

// ── NESTPLAATS ────────────────────────────────────────────────────────────────
// Exacte plaatsing van het nest. -1 = onbekend.
export const NESTPLAATS_CODES = [
  { code: -1, nl: 'Onbekend' },
  { code: 0,  nl: 'Op de grond' },
  { code: 1,  nl: 'In gras/kruidlaag (< 30 cm)' },
  { code: 2,  nl: 'In struik/heg (30–300 cm)' },
  { code: 3,  nl: 'In boom — lage tak (< 5 m)' },
  { code: 4,  nl: 'In boom — hoge tak (≥ 5 m)' },
  { code: 5,  nl: 'In boomholte' },
  { code: 6,  nl: 'In gebouw/gevel' },
  { code: 7,  nl: 'In nestkast' },
  { code: 8,  nl: 'Op gebouw/dak' },
  { code: 9,  nl: 'In watervegetatie' },
  { code: 10, nl: 'Drijvend' },
  { code: 11, nl: 'In rotswand/steilkant' },
  { code: 12, nl: 'Op paal/mast' },
  { code: 99, nl: 'Overig' },
];

// ── NESTTYPE (NEST) ───────────────────────────────────────────────────────────
// Type nest of neststructuur
export const NESTTYPE_CODES = [
  { code: '0',  nl: 'Zelf gebouwd nest' },
  { code: '1',  nl: 'Gebruik gemaakt van verlaten nest' },
  { code: '2',  nl: 'Nestkast (zie kastnummer)' },
  { code: '3',  nl: 'Holte in gebouw' },
  { code: '4',  nl: 'Holte in boom (niet kast)' },
  { code: '5',  nl: 'Platform/kunstmatige nestgelegenheid' },
  { code: '9',  nl: 'Overig' },
];

// ── VONDST ────────────────────────────────────────────────────────────────────
// Hoe is het nest gevonden?
export const VONDST_CODES = [
  { code: 0, nl: 'Bij toeval' },
  { code: 1, nl: 'Doelgericht gezocht' },
  { code: 2, nl: 'Tijdens nestkaartonderzoek' },
  { code: 3, nl: 'Melding van derden' },
  { code: 4, nl: 'Via zender/telemetrie' },
  { code: 5, nl: 'Via kleurringen' },
  { code: 6, nl: 'Via ander ringonderzoek' },
  { code: 7, nl: 'Onbekend' },
];

// ── VERSTOPT ──────────────────────────────────────────────────────────────────
// Mate waarin het nest verborgen is
export const VERSTOPT_CODES = [
  { code: 0, nl: 'Niet verstopt — zichtbaar van bovenaf' },
  { code: 1, nl: 'Half verstopt — enigszins bedekt' },
  { code: 3, nl: 'Goed verstopt — niet zichtbaar van bovenaf' },
  { code: 5, nl: 'In holte/nestkast' },
];

// ── BESCHERM ──────────────────────────────────────────────────────────────────
// Aanwezige bescherming
export const BESCHERM_CODES = [
  { code: 1, nl: 'Geen bescherming' },
  { code: 2, nl: 'Prikkeldraad' },
  { code: 3, nl: 'Hek/bewaking' },
  { code: 4, nl: 'Verbodsbord' },
  { code: 5, nl: 'Nestkast (beschermd)' },
  { code: 6, nl: 'Onderwaterfundament' },
  { code: 7, nl: 'Overige bescherming' },
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
  { code: 'E0',  groep: 'eieren',   nl: 'E0 — Eieren, aantal onbekend' },
  { code: 'E1',  groep: 'eieren',   nl: 'E1 — 1 ei' },
  { code: 'E2',  groep: 'eieren',   nl: 'E2 — 2 eieren' },
  { code: 'E3',  groep: 'eieren',   nl: 'E3 — 3 eieren' },
  { code: 'E4',  groep: 'eieren',   nl: 'E4 — 4 eieren' },
  { code: 'E5',  groep: 'eieren',   nl: 'E5 — 5 eieren' },
  { code: 'E6',  groep: 'eieren',   nl: 'E6 — 6 eieren' },
  { code: 'E7',  groep: 'eieren',   nl: 'E7 — 7+ eieren' },
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
  { code: 1, nl: '1 — Exacte datum' },
  { code: 2, nl: '2 — ± 1 dag' },
  { code: 3, nl: '3 — ± 2–3 dagen' },
  { code: 4, nl: '4 — ± 1 week' },
  { code: 5, nl: '5 — ± 2 weken' },
  { code: 6, nl: '6 — Datum onbekend' },
];

export const BETROUWB_AANTAL_CODES = [
  { code: 1, nl: '1 — Exact geteld' },
  { code: 2, nl: '2 — Geschat ± 1' },
  { code: 3, nl: '3 — Geschat ± 2–3' },
  { code: 4, nl: '4 — Geschat ± 5' },
  { code: 5, nl: '5 — Ruwe schatting' },
  { code: 6, nl: '6 — Minimum bekend' },
  { code: 7, nl: '7 — Onbekend' },
];

export const BETROUWB_DAGEN_CODES = [
  { code: 1, nl: '1 — Exact (gewogen/gemeten)' },
  { code: 2, nl: '2 — ± 1–2 dagen' },
  { code: 3, nl: '3 — ± 3–4 dagen' },
  { code: 4, nl: '4 — ± 5–7 dagen' },
  { code: 5, nl: '5 — ± 1–2 weken' },
  { code: 6, nl: '6 — Ruwe schatting' },
  { code: 7, nl: '7 — Onbekend' },
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
