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

    // Landcode afleiden uit landnaam
    const countryName = get(row, 'country', 'land');
    const countryCode = countryNameToCode(countryName) || countryName.slice(0, 2).toUpperCase();

    results.push({
      id: `csv-${id}`,
      datum,
      species_obs_id: null,
      species_name_nl: get(row, 'species name', 'dutch name', 'nederlandsenaam', 'nederlandse naam', 'soort', 'species_nl', 'naam', 'vernacular name', 'species_name_nl'),
      species_name_lat: get(row, 'scientific name', 'wetenschappelijke naam', 'latijnsenaam', 'soort_latijn', 'species_lat', 'scientific', 'species_name_lat'),
      euring_code: get(row, 'euring', 'euring_code'),
      country_code: countryCode,
      country_name: get(row, 'country', 'land'),
      location_name: get(row, 'location', 'locatie', 'location_name', 'stad'),
      lat: parseCoord(get(row, 'lat', 'latitude', 'breedtegraad', 'y_coordinaat', 'y')),
      lon: parseCoord(get(row, 'lng', 'lon', 'longitude', 'lengtegraad', 'x_coordinaat', 'x')),
      rarity: Number(get(row, 'rarity', 'zeldzaamheid')) || 0,
      validation_status: get(row, 'validation_status', 'status'),
      count: Number(get(row, 'number', 'aantal')) || 1,
      permalink: get(row, 'link', 'permalink', 'url'),
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
};

function countryNameToCode(name) {
  return COUNTRY_CODES[name.toLowerCase().trim()] ?? null;
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
