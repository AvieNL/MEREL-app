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
alleAids.forEach(aid => {
  aid.soorten.forEach(code => {
    if (!aidsByEuring[code]) aidsByEuring[code] = [];
    aidsByEuring[code].push(aid);
  });
});

/**
 * Geeft alle determinatiehulpen terug voor een EURING-code.
 * @param {string} euringCode
 * @returns {Array}
 */
export function getAidsVoorSoort(euringCode) {
  if (!euringCode) return [];
  return aidsByEuring[euringCode] || [];
}

export { alleAids };
