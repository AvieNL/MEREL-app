/**
 * observation.org API client.
 * Auth: Authorization: Token <token>
 * Observations for a specific user: GET /api/v1/observations/?observer_id=<id>
 */

const BASE_URL = 'https://api.observation.org/api/v1';

export async function fetchUserObservations({ token, observerId, onProgress }) {
  const headers = { Authorization: `Token ${token}` };
  let results = [];
  let url = `${BASE_URL}/observations/?observer_id=${observerId}&limit=100`;
  let page = 0;

  while (url) {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API fout ${res.status}: ${text.slice(0, 200)}`);
    }
    const data = await res.json();
    const items = data.results ?? [];
    results = results.concat(items);
    page++;
    onProgress?.({ fetched: results.length, total: data.count ?? null, page });
    url = data.next ?? null;
    if (!url) break;
    // Respect rate limits
    await new Promise(r => setTimeout(r, 200));
  }

  return results.map(normaliseObservation);
}

export async function validateToken(token) {
  const res = await fetch(`${BASE_URL}/observations/?limit=1`, {
    headers: { Authorization: `Token ${token}` },
  });
  return res.ok || res.status === 401 ? res.status : null;
}

/**
 * Normalize a raw observation.org record into our internal schema.
 */
export function normaliseObservation(raw) {
  const species = raw.species_detail ?? {};
  const location = raw.location_detail ?? {};

  // Extract coordinates: API returns GeoJSON Point or flat lat/lon fields
  let lat = null, lon = null;
  if (raw.point?.coordinates?.length === 2) {
    [lon, lat] = raw.point.coordinates; // GeoJSON: [lon, lat]
  } else if (raw.lat != null && raw.lon != null) {
    lat = Number(raw.lat); lon = Number(raw.lon);
  } else if (location.lat != null && location.lon != null) {
    lat = Number(location.lat); lon = Number(location.lon);
  }

  return {
    id: String(raw.id),
    datum: raw.date,
    species_obs_id: raw.species,
    species_name_nl: species.name ?? '',
    species_name_lat: species.scientific_name ?? '',
    euring_code: species.euring_code ? String(species.euring_code) : '',
    country_code: location.country_code ?? raw.country_code ?? '',
    country_name: location.country ?? '',
    location_name: location.name ?? raw.location_name ?? '',
    lat: lat !== null && !isNaN(lat) ? lat : null,
    lon: lon !== null && !isNaN(lon) ? lon : null,
    rarity: raw.rarity ?? 0,
    validation_status: raw.validation_status ?? '',
    count: raw.number ?? 1,
    permalink: raw.permalink ?? '',
    has_photo: (raw.photos?.length ?? 0) > 0,
    source: 'api',
    imported_at: new Date().toISOString(),
  };
}

/**
 * Parse a waarneming.nl / observation.org CSV export.
 * The CSV format exported by waarneming.nl uses semicolon separators.
 */
export function parseCsv(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const raw = lines[0];
  // Detect separator: tab, semicolon or comma
  const sep = raw.includes('\t') ? '\t' : raw.includes(';') ? ';' : ',';
  const headers = raw.split(sep).map(h => h.trim().replace(/"/g, '').toLowerCase());

  const get = (row, ...keys) => {
    for (const k of keys) {
      const idx = headers.indexOf(k);
      if (idx >= 0 && row[idx] !== undefined) return row[idx].replace(/"/g, '').trim();
    }
    return '';
  };

  const results = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(sep);
    if (row.length < 3) continue;

    // Alleen vogels importeren — species group = "Vogels" of "Birds"
    const speciesGroup = get(row, 'species group', 'species_group', 'soortengroep').toLowerCase();
    if (speciesGroup && speciesGroup !== 'vogels' && speciesGroup !== 'birds') continue;

    const id = get(row, 'id', 'observation_id', 'waarneming_id') || `csv-${i}`;
    const datum = normaliseDatum(get(row, 'date', 'datum', 'observation_date'));
    if (!datum) continue;

    // Landcode afleiden uit landnaam; normaliseer ook de naam
    const rawCountryName = get(row, 'country', 'land');
    const countryCode = countryNameToCode(rawCountryName) || 'XX';
    const countryName = canonicalCountryName(countryCode, rawCountryName);

    results.push({
      id: `csv-${id}`,
      datum,
      species_obs_id: null,
      species_name_nl: get(row, 'species name', 'dutch name', 'nederlandsenaam', 'nederlandse naam', 'soort', 'species_nl', 'naam', 'vernacular name', 'species_name_nl'),
      species_name_lat: get(row, 'scientific name', 'wetenschappelijke naam', 'latijnsenaam', 'soort_latijn', 'species_lat', 'scientific', 'species_name_lat'),
      euring_code: get(row, 'euring', 'euring_code'),
      country_code: countryCode,
      country_name: countryName,
      location_name: get(row, 'location', 'locatie', 'location_name', 'stad'),
      lat: parseCoord(get(row, 'lat', 'latitude', 'breedtegraad', 'y_coordinaat', 'y')),
      lon: parseCoord(get(row, 'lng', 'lon', 'longitude', 'lengtegraad', 'x_coordinaat', 'x')),
      rarity: Number(get(row, 'rarity', 'zeldzaamheid')) || 0,
      validation_status: get(row, 'validation_status', 'status'),
      count: Number(get(row, 'number', 'aantal')) || 1,
      permalink: /^\d+$/.test(id) ? `https://waarneming.nl/observation/${id}/` : (get(row, 'link', 'permalink', 'url') || ''),
      province: get(row, 'country division', 'country_division', 'provincie', 'regio', 'subdivision') || '',
      has_photo: false,
      source: 'csv',
      imported_at: new Date().toISOString(),
    });
  }
  return results;
}

const COUNTRY_CODES = {
  'nederland': 'NL', 'netherlands': 'NL', 'the netherlands': 'NL',
  'duitsland': 'DE', 'germany': 'DE', 'deutschland': 'DE',
  'belgië': 'BE', 'belgie': 'BE', 'belgium': 'BE',
  'frankrijk': 'FR', 'france': 'FR',
  'spanje': 'ES', 'spain': 'ES', 'españa': 'ES',
  'portugal': 'PT',
  'verenigd koninkrijk': 'GB', 'united kingdom': 'GB', 'great britain': 'GB',
  'ierland': 'IE', 'ireland': 'IE',
  'denemarken': 'DK', 'denmark': 'DK',
  'zweden': 'SE', 'sweden': 'SE', 'sverige': 'SE',
  'noorwegen': 'NO', 'norway': 'NO', 'norge': 'NO',
  'finland': 'FI', 'suomi': 'FI',
  'zwitserland': 'CH', 'switzerland': 'CH', 'schweiz': 'CH',
  'oostenrijk': 'AT', 'austria': 'AT', 'österreich': 'AT',
  'italië': 'IT', 'italie': 'IT', 'italy': 'IT', 'italia': 'IT',
  'griekenland': 'GR', 'greece': 'GR',
  'turkije': 'TR', 'turkey': 'TR', 'türkiye': 'TR',
  'marokko': 'MA', 'morocco': 'MA', 'maroc': 'MA',
  'senegal': 'SN',
  'gambia': 'GM',
  'ghana': 'GH',
  'kenya': 'KE', 'kenia': 'KE',
  'tanzania': 'TZ',
  'tsjechië': 'CZ', 'tsjechiё': 'CZ', 'tsjechie': 'CZ', 'czech republic': 'CZ', 'czechia': 'CZ',
  'hongarije': 'HU', 'hungary': 'HU', 'ungarn': 'HU',
  'letland': 'LV', 'latvia': 'LV',
  'litouwen': 'LT', 'lithuania': 'LT',
  'estland': 'EE', 'estonia': 'EE',
  'ijsland': 'IS', 'iceland': 'IS', 'ísland': 'IS',
  'luxemburg': 'LU', 'luxembourg': 'LU', 'luxembourg (grand-duché)': 'LU',
  'liechtenstein': 'LI',
  'roemenië': 'RO', 'roemenie': 'RO', 'romania': 'RO',
  'rusland': 'RU', 'russia': 'RU', 'russian federation': 'RU',
  'thailand': 'TH',
  'venezuela': 'VE',
  'cuba': 'CU',
  'suriname': 'SR',
  'sierra leone': 'SL',
  'jordanië': 'JO', 'jordanie': 'JO', 'jordan': 'JO',
  'joegoslavië': 'RS', 'servië': 'RS', 'serbia': 'RS',
  'sremski': 'RS', 'južnobački': 'RS', 'juznobackl': 'RS', 'severno-banatski': 'RS',
  // Nederlandse provincies → NL
  'noord-holland': 'NL', 'zuid-holland': 'NL', 'zeeland': 'NL', 'utrecht': 'NL',
  'flevoland': 'NL', 'friesland': 'NL', 'fryslân': 'NL', 'groningen': 'NL',
  'drenthe': 'NL', 'overijssel': 'NL', 'gelderland': 'NL',
  'noord-brabant': 'NL', 'limburg': 'NL',
  'zuid-afrika': 'ZA', 'south africa': 'ZA',
  'malta': 'MT',
  'polen': 'PL', 'poland': 'PL', 'polska': 'PL',
  'slowakije': 'SK', 'slovakia': 'SK',
  'slovenië': 'SI', 'slovenie': 'SI', 'slovenia': 'SI',
  'kroatië': 'HR', 'kroatie': 'HR', 'croatia': 'HR',
  'bulgarije': 'BG', 'bulgaria': 'BG',
  'moldavië': 'MD', 'moldova': 'MD',
  'oekraïne': 'UA', 'oekraine': 'UA', 'ukraine': 'UA',
  'wit-rusland': 'BY', 'belarus': 'BY',
  'albanië': 'AL', 'albanie': 'AL', 'albania': 'AL',
  'macedonië': 'MK', 'macedonie': 'MK', 'north macedonia': 'MK',
  'bosnië': 'BA', 'bosnie': 'BA', 'bosnia': 'BA',
  'tunesië': 'TN', 'tunesiё': 'TN', 'tunesie': 'TN', 'tunisia': 'TN',
  'algerije': 'DZ', 'algeria': 'DZ',
  'egypte': 'EG', 'egypt': 'EG',
  'mauritanië': 'MR', 'mauritanie': 'MR', 'mauritania': 'MR',
  'mali': 'ML',
  'niger': 'NE',
  'nigeria': 'NG',
  'guinee': 'GN', 'guinea': 'GN',
  'guinee-bissau': 'GW',
  'ivoorkust': 'CI', "côte d'ivoire": 'CI',
  'burkina faso': 'BF',
  'kameroen': 'CM',
  'ethiopië': 'ET', 'ethiopie': 'ET',
  'mozambique': 'MZ',
  'madagaskar': 'MG', 'madagascar': 'MG',
  'namibië': 'NA', 'namibie': 'NA', 'namibia': 'NA',
  'botswana': 'BW',
  'zimbabwe': 'ZW',
  'zambia': 'ZM',
  'israel': 'IL', 'israël': 'IL',
  'iran': 'IR',
  'irak': 'IQ', 'iraq': 'IQ',
  'china': 'CN',
  'india': 'IN',
  'japan': 'JP',
  'indonesië': 'ID', 'indonesie': 'ID', 'indonesia': 'ID',
  'verenigde staten': 'US', 'verenigde staten van amerika': 'US', 'united states': 'US', 'united states of america': 'US', 'usa': 'US',
  'canada': 'CA',
  'mexico': 'MX',
  'brazilië': 'BR', 'brazilie': 'BR', 'brazil': 'BR',
  'argentinië': 'AR', 'argentinie': 'AR', 'argentina': 'AR',
  'australië': 'AU', 'australie': 'AU', 'australia': 'AU',
  'nieuw-zeeland': 'NZ', 'new zealand': 'NZ',
};

// Canonical Dutch country names per ISO code
const CANONICAL_COUNTRY_NAME = {
  NL: 'Nederland', DE: 'Duitsland', BE: 'België', FR: 'Frankrijk', GB: 'Groot-Brittannië',
  ES: 'Spanje', PT: 'Portugal', IT: 'Italië', SE: 'Zweden', NO: 'Noorwegen', DK: 'Denemarken',
  FI: 'Finland', PL: 'Polen', AT: 'Oostenrijk', CH: 'Zwitserland', GR: 'Griekenland',
  TR: 'Turkije', MA: 'Marokko', SN: 'Senegal', GM: 'Gambia', GH: 'Ghana',
  KE: 'Kenia', TZ: 'Tanzania', ZA: 'Zuid-Afrika', US: 'Verenigde Staten', CA: 'Canada',
  MX: 'Mexico', BR: 'Brazilië', AR: 'Argentinië', AU: 'Australië', NZ: 'Nieuw-Zeeland',
  JP: 'Japan', IN: 'India', ZW: 'Zimbabwe', CZ: 'Tsjechië', HU: 'Hongarije',
  LV: 'Letland', LT: 'Litouwen', EE: 'Estland', IS: 'IJsland', LU: 'Luxemburg',
  LI: 'Liechtenstein', RO: 'Roemenië', RU: 'Rusland', TH: 'Thailand', VE: 'Venezuela',
  CU: 'Cuba', SR: 'Suriname', SL: 'Sierra Leone', RS: 'Servië', SK: 'Slowakije',
  SI: 'Slovenië', HR: 'Kroatië', BG: 'Bulgarije', UA: 'Oekraïne', BY: 'Wit-Rusland',
  MT: 'Malta', AL: 'Albanië', MK: 'Noord-Macedonië', BA: 'Bosnië-Herzegovina',
  TN: 'Tunesië', DZ: 'Algerije', EG: 'Egypte', MR: 'Mauritanië', ML: 'Mali',
  NE: 'Niger', NG: 'Nigeria', GN: 'Guinee', GW: 'Guinee-Bissau', CI: 'Ivoorkust',
  BF: 'Burkina Faso', CM: 'Kameroen', ET: 'Ethiopië', MZ: 'Mozambique',
  MG: 'Madagaskar', NA: 'Namibië', BW: 'Botswana', ZM: 'Zambia', IL: 'Israël',
  IR: 'Iran', IQ: 'Irak', CN: 'China', ID: 'Indonesië',
};

function countryNameToCode(name) {
  return COUNTRY_CODES[name.toLowerCase().trim()] ?? null;
}

function canonicalCountryName(code, fallback) {
  return CANONICAL_COUNTRY_NAME[code] ?? fallback;
}

function parseCoord(raw) {
  if (!raw) return null;
  const n = Number(raw.replace(',', '.'));
  return isNaN(n) || n === 0 ? null : n;
}

function normaliseDatum(raw) {
  if (!raw) return null;
  // Accepts dd-mm-yyyy, yyyy-mm-dd, dd/mm/yyyy
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const parts = raw.split(/[-/]/);
  if (parts.length !== 3) return null;
  if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
  return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
}
