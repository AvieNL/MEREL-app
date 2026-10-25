const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 1 week

export const EBIRD_KEY = 'w_ebird_key';

export function getEbirdKey() {
  return localStorage.getItem(EBIRD_KEY) || '';
}

export function setEbirdKey(key) {
  localStorage.setItem(EBIRD_KEY, key.trim());
}

function readCache(key) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    if (v && Date.now() - v.ts < CACHE_TTL) return v.data;
  } catch { /* ignore localStorage errors */ }
  return null;
}

function writeCache(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data })); } catch { /* ignore quota errors */ }
}

async function ebirdFetch(path, apiKey) {
  const res = await fetch(`https://api.ebird.org/v2${path}`, {
    headers: { 'X-eBirdApiToken': apiKey },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`eBird ${res.status}${text ? ': ' + text.slice(0, 200) : ''}`);
  }
  return res.json();
}

async function fetchTaxonomyBatch(codes, apiKey) {
  const BATCH = 200;
  const results = [];
  for (let i = 0; i < codes.length; i += BATCH) {
    const batch = codes.slice(i, i + BATCH);
    const data = await ebirdFetch(
      `/ref/taxonomy/ebird?fmt=json&species=${batch.join(',')}`,
      apiKey
    );
    results.push(...data);
  }
  return results;
}

// Returns array of { sciName, comName, code } for all species in a country.
// Results are cached for 1 week in localStorage.
export async function fetchCountrySpecies(countryCode, apiKey) {
  if (!apiKey) return null;
  const cacheKey = `ebird_v1_spp_${countryCode}`;
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const codes = await ebirdFetch(`/product/spplist/${countryCode}`, apiKey);
  if (!Array.isArray(codes) || codes.length === 0) {
    writeCache(cacheKey, []);
    return [];
  }

  const taxonomy = await fetchTaxonomyBatch(codes, apiKey);
  const data = taxonomy
    .filter(t => t.category === 'species')
    .map(t => ({ sciName: t.sciName, comName: t.comName, code: t.speciesCode }));

  writeCache(cacheKey, data);
  return data;
}

// Fetch ALL eBird species worldwide (full taxonomy, ~10 700 species after filtering).
// Cached for 1 week because the taxonomy changes rarely.
export async function fetchWorldSpecies(apiKey) {
  if (!apiKey) return null;
  const cacheKey = 'ebird_v1_world';
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const taxonomy = await ebirdFetch('/ref/taxonomy/ebird?fmt=json', apiKey);
  const data = taxonomy
    .filter(t => t.category === 'species')
    .map(t => ({ sciName: t.sciName, comName: t.comName, code: t.speciesCode }));

  writeCache(cacheKey, data);
  return data;
}

// Province name (from waarneming.nl CSV 'country division') → eBird subnational1 code
export const PROVINCE_EBIRD_CODES = {
  'Drenthe': 'NL-DR',
  'Flevoland': 'NL-FL',
  'Friesland': 'NL-FR',
  'Fryslân': 'NL-FR',
  'Gelderland': 'NL-GE',
  'Groningen': 'NL-GR',
  'Limburg': 'NL-LI',
  'Noord-Brabant': 'NL-NB',
  'Noord-Holland': 'NL-NH',
  'Overijssel': 'NL-OV',
  'Utrecht': 'NL-UT',
  'Zeeland': 'NL-ZE',
  'Zuid-Holland': 'NL-ZH',
  // België — NL-Limburg en BE-Limburg zijn gelijk; country-aware lookup lost dit op
  'Antwerpen': 'BE-VAN',
  'Oost-Vlaanderen': 'BE-VOV',
  'West-Vlaanderen': 'BE-VWV',
  'Vlaams-Brabant': 'BE-VBR',
  'Henegouwen': 'BE-WHT',
  'Luik': 'BE-WLG',
  'Namen': 'BE-WNA',
  'Luxemburg': 'BE-WLX',
  'Waals-Brabant': 'BE-WBR',
  'Brussel': 'BE-BRU',
};

// countryCode is used to disambiguate e.g. 'Limburg' (NL vs BE)
export function provinceToEbirdCode(provinceName, countryCode) {
  if (!provinceName) return null;
  if (provinceName === 'Limburg') {
    if (countryCode === 'BE') return 'BE-VLI';
    return 'NL-LI';
  }
  return PROVINCE_EBIRD_CODES[provinceName] || null;
}

// ISO-2 country code → continent code
export const COUNTRY_CONTINENT = {
  // Europa
  NL:'EU', BE:'EU', DE:'EU', FR:'EU', GB:'EU', IE:'EU', ES:'EU', PT:'EU',
  IT:'EU', AT:'EU', CH:'EU', LU:'EU', MC:'EU', AD:'EU', SM:'EU', VA:'EU',
  PL:'EU', CZ:'EU', SK:'EU', HU:'EU', RO:'EU', BG:'EU', GR:'EU',
  SI:'EU', HR:'EU', BA:'EU', RS:'EU', ME:'EU', MK:'EU', AL:'EU', XK:'EU',
  DK:'EU', SE:'EU', NO:'EU', FI:'EU', IS:'EU', EE:'EU', LV:'EU', LT:'EU',
  BY:'EU', UA:'EU', MD:'EU', RU:'EU', CY:'EU', MT:'EU', LI:'EU', TR:'EU',
  // Afrika
  MA:'AF', DZ:'AF', TN:'AF', LY:'AF', EG:'AF', SD:'AF', SS:'AF',
  ET:'AF', ER:'AF', DJ:'AF', SO:'AF', KE:'AF', UG:'AF', TZ:'AF',
  RW:'AF', BI:'AF', MZ:'AF', ZW:'AF', ZM:'AF', MW:'AF', MG:'AF',
  KM:'AF', MU:'AF', SC:'AF', NA:'AF', BW:'AF', ZA:'AF', LS:'AF',
  SZ:'AF', AO:'AF', CD:'AF', CG:'AF', GA:'AF', GQ:'AF', CM:'AF',
  CF:'AF', TD:'AF', NE:'AF', NG:'AF', GH:'AF', TG:'AF', BJ:'AF',
  CI:'AF', LR:'AF', SL:'AF', GN:'AF', GW:'AF', SN:'AF', GM:'AF',
  CV:'AF', MR:'AF', ML:'AF', BF:'AF', ST:'AF', RE:'AF', YT:'AF',
  // Azië
  CN:'AS', JP:'AS', KR:'AS', KP:'AS', MN:'AS', TW:'AS', IN:'AS',
  PK:'AS', BD:'AS', LK:'AS', NP:'AS', BT:'AS', MM:'AS', TH:'AS',
  LA:'AS', VN:'AS', KH:'AS', MY:'AS', SG:'AS', ID:'AS', PH:'AS',
  TL:'AS', BN:'AS', IR:'AS', IQ:'AS', SY:'AS', LB:'AS', JO:'AS',
  IL:'AS', SA:'AS', YE:'AS', OM:'AS', AE:'AS', QA:'AS', BH:'AS',
  KW:'AS', AF:'AS', TJ:'AS', TM:'AS', UZ:'AS', KZ:'AS', KG:'AS',
  AZ:'AS', AM:'AS', GE:'AS', HK:'AS', MO:'AS',
  // Noord-Amerika
  US:'NA', CA:'NA', MX:'NA', GT:'NA', BZ:'NA', HN:'NA', SV:'NA',
  NI:'NA', CR:'NA', PA:'NA', CU:'NA', JM:'NA', HT:'NA', DO:'NA',
  PR:'NA', TT:'NA', BB:'NA', LC:'NA', VC:'NA', GD:'NA', AG:'NA',
  DM:'NA', KN:'NA', GL:'NA', PM:'NA',
  // Zuid-Amerika
  CO:'SA', VE:'SA', GY:'SA', SR:'SA', BR:'SA', EC:'SA', PE:'SA',
  BO:'SA', PY:'SA', AR:'SA', CL:'SA', UY:'SA', GF:'SA',
  // Oceanië
  AU:'OC', NZ:'OC', PG:'OC', FJ:'OC', SB:'OC', VU:'OC', WS:'OC',
  TO:'OC', KI:'OC', NR:'OC', PW:'OC', FM:'OC', MH:'OC', TV:'OC',
  // Antarctica
  AQ:'AN',
};

export const CONTINENT_NAMES = {
  EU: 'Europa',
  AF: 'Afrika',
  AS: 'Azië',
  NA: 'Noord-Amerika',
  SA: 'Zuid-Amerika',
  OC: 'Oceanië',
  AN: 'Antarctica',
};

export function clearEbirdCache() {
  const toRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith('ebird_v1_')) toRemove.push(k);
  }
  toRemove.forEach(k => localStorage.removeItem(k));
}
