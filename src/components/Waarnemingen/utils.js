export const RARITY_LABELS = {
  1: 'Gewoon',
  2: 'Vrij zeldzaam',
  3: 'Zeldzaam',
  4: 'Zeer zeldzaam',
  5: 'Extreem zeldzaam',
};

export function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
}

export function countryFlag(code) {
  if (!code || code.length !== 2) return '';
  return code.toUpperCase().replace(/./g, c =>
    String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0))
  );
}

// Normalise to genus+epithet only (first two words, lowercase).
// eBird (Clements) and IOC sometimes differ in subspecies or author treatment
// but almost always agree on the first two words.
export function normSciName(name) {
  if (!name) return '';
  return name.trim().toLowerCase().split(/\s+/).slice(0, 2).join(' ');
}

export function groupBy(arr, key) {
  const map = new Map();
  for (const item of arr) {
    const k = item[key] ?? '';
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(item);
  }
  return map;
}
