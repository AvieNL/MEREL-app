const STORAGE_KEY = 'vrs_ruitype_config';

export const RUITYPE_TYPES = ['A', 'B', 'C', 'D', 'X'];

// Standaard seizoensteksten (na omwisseling voorjaar/najaar d.d. 2026-03)
export const DEFAULT_RUITYPE_CONFIG = {
  A: {
    voorjaar: [{ cond: '', val: 'volgroeid, leeftijd niet mogelijk' }],
    najaar:   [{ cond: '', val: 'na 1 kj, leeftijd niet mogelijk' }],
  },
  B: {
    voorjaar: [
      { cond: 'met ruigrens',    val: '2 kj' },
      { cond: 'zonder ruigrens', val: 'na 2 kj' },
    ],
    najaar: [
      { cond: 'met ruigrens',    val: '1 kj' },
      { cond: 'zonder ruigrens', val: 'na 1 kj' },
    ],
  },
  C: {
    voorjaar: [
      { cond: 'ruigrens',      val: '1 kj' },
      { cond: 'geen ruigrens', val: 'na 1 kj' },
    ],
    najaar: [
      { cond: 'twee ruigrenzen', val: '2 kj' },
      { cond: 'één ruigrens',    val: 'na 2 kj' },
      { cond: 'twijfel',         val: 'na 1 kj' },
    ],
  },
  D: {
    voorjaar: [
      { cond: 'vers kleed',      val: '1 kj' },
      { cond: 'versleten kleed', val: 'na 1 kj' },
    ],
    najaar: [{ cond: '', val: 'niet mogelijk op kleed, na 1 kj' }],
  },
  X: {
    voorjaar: [{ cond: '', val: 'leeftijdsbepaling niet mogelijk' }],
    najaar:   [{ cond: '', val: 'leeftijdsbepaling niet mogelijk' }],
  },
};

export function getRuitypenConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_RUITYPE_CONFIG;
    const parsed = JSON.parse(raw);
    // Zorg dat alle types aanwezig zijn (merge met defaults)
    const merged = { ...DEFAULT_RUITYPE_CONFIG };
    for (const type of RUITYPE_TYPES) {
      if (parsed[type]) merged[type] = parsed[type];
    }
    return merged;
  } catch {
    return DEFAULT_RUITYPE_CONFIG;
  }
}

export function saveRuitypenConfig(config) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  // Trigger storage event voor andere tabs/componenten
  window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
}

export function useRuitypen() {
  // Geen useState nodig — config wordt bij render ingelezen
  // en AdminPage herlaadt na opslaan via eigen state
  return getRuitypenConfig();
}
