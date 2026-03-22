/**
 * Berekent de datum van het aanbevolen vervolgbezoek op basis van het stadium.
 *
 * @param {string} stadium  - SOVON-stadiumcode (bijv. 'E4', 'N3', 'L0')
 * @param {string} datum    - Datum van het huidige bezoek (YYYY-MM-DD)
 * @param {object|null} soort - Soortobject uit Dexie (bevat nest_ei_dagen, nest_jong_dagen)
 * @returns {string|null}   - Aanbevolen datum (YYYY-MM-DD) of null als geen suggestie
 */
export function berekenVervolgbezoek(stadium, datum, soort) {
  if (!stadium || !datum) return null;

  const date = new Date(datum + 'T12:00:00');
  let dagen = null;

  if (stadium === 'L0') {
    dagen = 14; // Nestbouw verwacht

  } else if (stadium.startsWith('B')) {
    dagen = 7;  // Eileg verwacht

  } else if (stadium.startsWith('P')) {
    dagen = 5;  // Ouder aanwezig, inhoud onbekend — snel terugkomen

  } else if (stadium.startsWith('E')) {
    // Broedtijd (aantal incubatiedagen) — conservatief: tel vanaf nu de volle broedduur
    const broedtijd = soort?.nest_ei_dagen ?? 14;
    dagen = Math.max(3, broedtijd);

  } else if (stadium === 'N+') {
    // Leeftijd onbekend — gebruik halve nestjongduur als schatting
    const nestjong = soort?.nest_jong_dagen ?? 18;
    dagen = Math.round(nestjong / 2) + 7;

  } else if (stadium.startsWith('N')) {
    // N0–N11: dag in het nest bekend
    const dagNr = parseInt(stadium.slice(1), 10);
    const nestjong = soort?.nest_jong_dagen ?? 18;
    const resterend = Math.max(0, nestjong - dagNr);
    // +7 voor nacontrole (1 week nadat verwacht leeg)
    dagen = resterend + 7;

  } else if (stadium.startsWith('C') || stadium === 'X0') {
    return null; // geen suggestie na nacontrole
  }

  if (dagen === null) return null;

  date.setDate(date.getDate() + dagen);
  return date.toISOString().slice(0, 10);
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
