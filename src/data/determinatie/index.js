/**
 * Centrale registry van alle determinatiehulpen.
 * Voeg nieuwe bestanden toe als import + spread in alleAids.
 */

import { corvidae } from './corvidae';
// import { acrocephalus } from './acrocephalus';  ← volgende soortgroep
// import { sylvia } from './sylvia';

const alleAids = [
  ...corvidae,
  // ...acrocephalus,
  // ...sylvia,
];

// Index op EURING-code voor snelle lookup
const aidsByEuring = {};
const aidsById = {};
alleAids.forEach(aid => {
  aidsById[aid.id] = aid;
  aid.soorten.forEach(code => {
    if (!aidsByEuring[code]) aidsByEuring[code] = [];
    aidsByEuring[code].push(aid);
  });
});

/**
 * Geeft alle determinatiehulpen terug voor een EURING-code.
 */
export function getAidsVoorSoort(euringCode) {
  if (!euringCode) return [];
  return aidsByEuring[euringCode] || [];
}

/**
 * Geeft één determinatiehulp terug op basis van id.
 */
export function getAidById(id) {
  return aidsById[id] || null;
}

export { alleAids };
