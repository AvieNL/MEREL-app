/**
 * EURING Exchange Code 2020 pipe-delimited parser.
 *
 * Veldenlijst (0-indexed):
 *  0  Ringing Scheme        (3 chars)
 *  1  Primary ID Method     (2 chars)
 *  2  Ring Number           (10 chars, dots als opvulling)
 *  3  Verification          (1 digit)
 *  4  Metal Ring Info       (1 digit: 2=NV op tarsus, 4=al aanwezig=TV)
 *  5  Other Marks           (2 chars)
 *  6  Species Mentioned     (5 digits, EURING-soortcode)
 *  7  Species Concluded     (5 digits)
 *  8  Manipulated           (1 letter)
 *  9  Moved Before          (1 digit)
 * 10  Catching Method       (1 letter)
 * 11  Catching Lures        (1 letter)
 * 12  Sex Mentioned         (1 letter: U/M/F)
 * 13  Sex Concluded         (1 letter)
 * 14  Age Mentioned         (1 char)
 * 15  Age Concluded         (1 char)
 * 16  Status                (1 letter)
 * 17  Brood Size            (2 chars, -- = geen nestjong)
 * 18  Pullus Age            (2 chars, -- = geen pullus)
 * 19  Acc. Pullus Age       (1 char)
 * 20  Date                  (8 digits: ddmmyyyy)
 * 21  Acc. Date             (1 digit)
 * 22  Time                  (4 chars: HHMM, ---- = onbekend)
 * 23  Place Code            (4 chars)
 * 24  Geo. Co-ordinates     (15 chars: +AABBCC+WWXXYYZZ)
 * 25  Acc. Co-ordinates     (1 digit/letter)
 * 26  Condition             (1 digit)
 * 27  Circumstances         (2 digits)
 * 28  Circ. Presumed        (1 digit)
 * 29  EURING Code ID        (1 digit)
 * 30  Distance              (max 5, ----- = eerste record)
 * 31  Direction             (3 digits, --- = eerste record)
 * 32  Elapsed Time          (max 5, ----- = eerste record)
 */

/**
 * Zet EURING ISO-6709 coördinaten-string (15 tekens) om naar decimale graden.
 * Formaat: +AABBCC+WWXXYYZZ
 *   A = +/- (N/S)
 *   BB = breedtegraden (2 cijfers)
 *   CC = minuten (2 cijfers)
 *   DD = seconden (2 cijfers)
 *   W = +/- (O/W)
 *   XXX = lengtegraden (3 cijfers)
 *   YY = minuten (2 cijfers)
 *   ZZ = seconden (2 cijfers)
 */
function parseCoords(raw) {
  if (!raw || raw.length !== 15) return { lat: null, lon: null };
  if (raw.replace(/\./g, '').length < 15) return { lat: null, lon: null };
  try {
    const latSign = raw[0] === '+' ? 1 : -1;
    const latDeg  = parseInt(raw.slice(1, 3), 10);
    const latMin  = parseInt(raw.slice(3, 5), 10);
    const latSec  = parseInt(raw.slice(5, 7), 10);

    const lonSign = raw[7] === '+' ? 1 : -1;
    const lonDeg  = parseInt(raw.slice(8, 11), 10);
    const lonMin  = parseInt(raw.slice(11, 13), 10);
    const lonSec  = parseInt(raw.slice(13, 15), 10);

    if (isNaN(latDeg) || isNaN(lonDeg)) return { lat: null, lon: null };

    const lat = latSign * (latDeg + latMin / 60 + latSec / 3600);
    const lon = lonSign * (lonDeg + lonMin / 60 + lonSec / 3600);
    return { lat: parseFloat(lat.toFixed(6)), lon: parseFloat(lon.toFixed(6)) };
  } catch {
    return { lat: null, lon: null };
  }
}

/**
 * Zet EURING-datum ddmmyyyy om naar yyyy-mm-dd.
 */
function parseDate(raw) {
  if (!raw || raw.length !== 8 || raw.includes('-')) return null;
  const d = raw.slice(0, 2);
  const m = raw.slice(2, 4);
  const y = raw.slice(4, 8);
  if (isNaN(parseInt(d)) || isNaN(parseInt(m)) || isNaN(parseInt(y))) return null;
  return `${y}-${m}-${d}`;
}

/**
 * Zet EURING-tijd HHMM om naar HH:MM. Retourneert null bij ---- of onbekend.
 */
function parseTime(raw) {
  if (!raw || raw.includes('-') || raw.length !== 4) return null;
  return `${raw.slice(0, 2)}:${raw.slice(2, 4)}`;
}

/**
 * Zoekt in speciesRef de naam_nl op basis van EURING-soortcode.
 * @param {Array} speciesRef - array van soortobjecten met euring_code en naam_nl
 * @param {string} code - 5-cijferige EURING-soortcode (bijv. "10840")
 * @returns {string|null}
 */
export function euringCodeToNaam(speciesRef, code) {
  if (!code || !speciesRef?.length) return null;
  const num = parseInt(code, 10);
  const soort = speciesRef.find(s => parseInt(s.euring_code, 10) === num);
  return soort?.naam_nl || null;
}

/**
 * Parseert een EURING Exchange Code 2020 pipe-delimited string.
 *
 * @param {string} raw - de ruwe EURING-string uit e-mail
 * @returns {{ scenario: 'A'|'B', fields: object }|null} null bij ongeldige invoer
 *
 * Scenario A (externe_tv_melding): jouw vogel teruggevangen door andere ringer
 *   → metalenringinfo = 4 (ring al aanwezig)
 * Scenario B (externe_ring_info): jij ving een vreemde vogel, ontvangt eerste-vangstdata
 *   → metalenringinfo = 2 (of 1/3, ring net toegevoegd)
 */
export function parseEuringCode(raw) {
  if (!raw) return null;
  const fields = raw.trim().split('|');
  if (fields.length < 27) return null;

  const metalenringinfo = parseInt(fields[4], 10);
  if (isNaN(metalenringinfo)) return null;

  const scenario = (metalenringinfo === 4) ? 'A' : 'B';

  // Ring: verwijder opvuldots
  const ringnummer = (fields[2] || '').replace(/\./g, '').trim();

  // Geslacht: EURING F → V (app-conventie), M blijft M, U blijft U
  const sexRaw = (fields[12] || '').toUpperCase();
  const geslacht = sexRaw === 'F' ? 'V' : (sexRaw === 'M' ? 'M' : 'U');

  // Leeftijd: EURING-leeftijdscode direct overnemen (bijv. '5', '3', '0')
  const leeftijdRaw = fields[14] || '';
  const leeftijd = (leeftijdRaw && leeftijdRaw !== '0' && leeftijdRaw !== '-') ? leeftijdRaw : null;

  // Vangstmethode: EURING Catching Method (bijv. 'M' = mistnetten)
  const vangstmethode = (fields[10] || '').toUpperCase();

  // Datum en tijd
  const vangstdatum = parseDate(fields[20]);
  const tijd = parseTime(fields[22]);

  // Coördinaten
  const { lat, lon } = parseCoords(fields[24]);

  // Plaatscode
  const plaatscode = fields[23] || null;

  return {
    scenario,
    ringnummer: ringnummer || null,
    euringSpeciesCode: fields[6] || null,
    geslacht,
    leeftijd,
    metalenringinfo,
    vangstmethode: vangstmethode && vangstmethode !== '-' && vangstmethode !== 'Z' ? vangstmethode : null,
    vangstdatum,
    tijd,
    plaatscode,
    lat,
    lon,
    euring_scheme: fields[0] || null,
  };
}
