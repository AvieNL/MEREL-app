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
  } catch {}
  return null;
}

function writeCache(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data })); } catch {}
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

export function clearEbirdCache() {
  const toRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith('ebird_v1_')) toRemove.push(k);
  }
  toRemove.forEach(k => localStorage.removeItem(k));
}
