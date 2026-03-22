// Parset een bereik-string ("18-31") of getal naar een integer (neemt het minimum).
function parseNestDagen(waarde, fallback = 18) {
  const n = parseInt(waarde, 10);
  return isNaN(n) ? fallback : n;
}

/**
 * Geschatte fractie van de nestjongenperiode per SOVON-stadiumcode.
 * N6 (slagpennen half volgroeid) = ringtijdstip (~75%).
 */
const N_FRACTIE = {
  'N+': null, // onbekend
  'N0': 0.00, // net uitgekomen
  'N1': 0.10, // naakt of in dons
  'N2': 0.20, // blind
  'N3': 0.30, // ogen open
  'N4': 0.45, // slagpennen in pin
  'N5': 0.60, // slagpennen uit bloedspoel
  'N6': 0.75, // slagpennen half volgroeid ← RINGEN
  'N7': 0.90, // klaar om uit te vliegen
  'N9': 1.00, // uitgevlogen op controledag
  'N10': 1.00,
  'N11': 1.00,
};

const RING_FRACTIE = 0.75; // = N6

/**
 * Schat de dag in het nest waarop N6 bereikt wordt (~75% van nestjongenperiode).
 */
export function berekenRingLeeftijd(soort) {
  const nestjong = parseNestDagen(soort?.nest_jong_dagen, 18);
  const optimaal = Math.floor(nestjong * RING_FRACTIE);
  return Math.max(7, Math.min(optimaal, nestjong - 3));
}

/**
 * Berekent het aanbevolen vervolgbezoek met type-aanduiding.
 *
 * @param {string}      stadium  - SOVON-stadiumcode
 * @param {string}      datum    - Datum huidig bezoek (YYYY-MM-DD)
 * @param {object|null} soort    - Soortobject (nest_ei_dagen, nest_jong_dagen)
 * @returns {{ datum: string, type: string } | null}
 *   type: 'eileg' | 'bouw' | 'ringen' | 'nacontrole' | 'check' | null
 */
export function berekenVervolgbezoekInfo(stadium, datum, soort) {
  if (!stadium || !datum) return null;

  const date = new Date(datum + 'T12:00:00');
  let dagen = null;
  let type = null;

  if (stadium === 'L0') {
    dagen = 14;
    type = 'bouw';

  } else if (stadium.startsWith('B')) {
    dagen = 7;
    type = 'eileg';

  } else if (stadium.startsWith('P')) {
    dagen = 5;
    type = 'check';

  } else if (stadium === 'E6' || stadium === 'E7') {
    // Eieren komen uit / jongen piepend in ei — snel terug
    dagen = 3;
    type = 'jongen';

  } else if (stadium.startsWith('E')) {
    const broedtijd = parseNestDagen(soort?.nest_ei_dagen, 14);
    dagen = Math.max(4, broedtijd);
    type = 'jongen';

  } else if (stadium === 'N+') {
    // Stadium onbekend — snel terug om stadium te schatten
    dagen = 3;
    type = 'check';

  } else if (stadium.startsWith('N')) {
    const nestjong = parseNestDagen(soort?.nest_jong_dagen, 18);
    const fractieNu = N_FRACTIE[stadium] ?? null;

    if (fractieNu === null) {
      // Onbekend stadium
      dagen = 3;
      type = 'check';
    } else if (fractieNu < RING_FRACTIE) {
      // Voor N6 — schat dagen tot ringtijdstip (N6)
      dagen = Math.max(2, Math.round((RING_FRACTIE - fractieNu) * nestjong));
      type = 'ringen';
    } else if (fractieNu >= 1.0) {
      // Al uitgevlogen — nacontrole
      dagen = 3;
      type = 'nacontrole';
    } else {
      // N6 of later maar nog in nest — nacontrole
      dagen = Math.max(2, Math.round((1.0 - fractieNu) * nestjong));
      type = 'nacontrole';
    }

  } else if (stadium.startsWith('C') || stadium === 'X0') {
    return null;
  }

  if (dagen === null) return null;

  date.setDate(date.getDate() + dagen);
  return { datum: date.toISOString().slice(0, 10), type };
}

/**
 * Berekent de datum van het aanbevolen vervolgbezoek (backwards compatible).
 *
 * @param {string}      stadium
 * @param {string}      datum
 * @param {object|null} soort
 * @returns {string|null}  YYYY-MM-DD of null
 */
export function berekenVervolgbezoek(stadium, datum, soort) {
  return berekenVervolgbezoekInfo(stadium, datum, soort)?.datum ?? null;
}

/**
 * Geeft de groep van een stadiumcode terug.
 */
export function stadiumGroep(stadium) {
  if (!stadium) return null;
  if (stadium === 'L0') return 'leeg';
  if (stadium.startsWith('B')) return 'bouw';
  if (stadium.startsWith('P')) return 'ouders';
  if (stadium.startsWith('E')) return 'eieren';
  if (stadium === 'N+' || stadium.startsWith('N')) return 'pulli';
  if (stadium.startsWith('C')) return 'nacontrole';
  return 'overig';
}

/**
 * Geeft true terug als het stadium een nacontrole/afsluitend stadium is.
 */
export function isAfsluitendStadium(stadium) {
  if (!stadium) return false;
  return stadium.startsWith('C') || stadium === 'X0';
}
