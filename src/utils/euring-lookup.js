/**
 * EURING soortcode lookup — ENIGE plek die euring-codes.json importeert.
 *
 * buildEuringLookup(speciesData) combineert:
 *   1. euring-codes.json als basis (hardcoded fallback, ~81 soorten)
 *   2. Supabase/Dexie species data als primaire bron (hogere prioriteit)
 *
 * Zodra een soort een euring_code heeft in Supabase (via de Soorten-pagina),
 * wint die altijd van de JSON-fallback.
 */
import euringCodesJson from '../data/euring-codes.json';

export function buildEuringLookup(speciesData = []) {
  const lookup = {};

  // Stap 1: JSON als basis (laagste prioriteit)
  for (const [naam, code] of Object.entries(euringCodesJson)) {
    lookup[naam.toLowerCase()] = String(code);
  }

  // Stap 2: Supabase/Dexie data overschrijft JSON (hoogste prioriteit)
  for (const s of speciesData) {
    if (s.naam_nl && s.euring_code) {
      lookup[s.naam_nl.toLowerCase()] = String(s.euring_code);
    }
  }

  return lookup;
}
