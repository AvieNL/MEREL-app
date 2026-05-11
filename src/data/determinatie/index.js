/**
 * Determinatie-hulpen — centrale registry.
 *
 * De aids komen primair uit de Supabase-tabel `determinatie_aid` via
 * `useDeterminatieAids()` (offline gecached in Dexie).
 *
 * De statische `corvidae.js` dient als seed-fallback: als de DB-cache nog
 * leeg is (eerste opstart, geen netwerk) zijn de Roek-aids direct beschikbaar.
 * Na een succesvolle pull overschrijft de DB-versie de statische data.
 */

import { corvidae } from './corvidae';
import { columbidae } from './columbidae';
import { ficedula } from './ficedula';
import { fringillidae } from './fringillidae';
import { picidae } from './picidae';
import { paridae } from './paridae';
import { prunellidae } from './prunellidae';
import { troglodytidae } from './troglodytidae';
import { passeridae } from './passeridae';
import { turdidae } from './turdidae';
import { muscicapidae } from './muscicapidae';

// ─── Statische fallback-index ────────────────────────────────────────────────
// Wordt gevuld met de hardcoded aids EN daarna overschreven door populateFromAids()
// zodra de DB-pull voltooid is.

const alleAids = [...corvidae, ...columbidae, ...ficedula, ...fringillidae, ...picidae, ...paridae, ...prunellidae, ...troglodytidae, ...passeridae, ...turdidae, ...muscicapidae];

let _byEuring = {};
let _byId = {};

function _indexeer(aids) {
  _byEuring = {};
  _byId = {};
  aids.forEach(aid => {
    _byId[aid.id] = aid;
    (aid.soorten || []).forEach(code => {
      if (!_byEuring[code]) _byEuring[code] = [];
      _byEuring[code].push(aid);
    });
  });
}

// Initieel indexeren op basis van de statische fallback
_indexeer(alleAids);

/**
 * Wordt aangeroepen door SyncContext nadat de DB-pull gehydrateerde aids
 * heeft opgeleverd. Overschrijft de statische fallback-index.
 */
export function populateFromAids(hydratedAids) {
  _indexeer(hydratedAids);
}

/**
 * Geeft alle determinatiehulpen terug voor een EURING-code.
 */
export function getAidsVoorSoort(euringCode) {
  if (!euringCode) return [];
  return _byEuring[euringCode] || [];
}

/**
 * Geeft één determinatiehulp terug op basis van id.
 */
export function getAidById(id) {
  return _byId[id] || null;
}

export { alleAids };
