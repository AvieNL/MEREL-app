/**
 * useDeterminatieAids
 *
 * Laadt determinatie-hulpen uit de lokale Dexie-cache (offline-first).
 * Pull van Supabase wordt getriggerd door SyncContext.
 *
 * Geeft dezelfde API terug als de statische determinatie/index.js zodat
 * componenten niet hoeven te veranderen.
 */

import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { supabase } from '../lib/supabase';
import { hydrateAid } from '../utils/determinatie-interpreter';

let _pullPromise = null;

export function pullDeterminatieAidsIfNeeded(force = false) {
  if (_pullPromise) return _pullPromise;
  _pullPromise = _doPull(force).finally(() => { _pullPromise = null; });
  return _pullPromise;
}

async function _doPull(force) {
  if (!force) {
    const count = await db.determinatie_aid.count();
    if (count > 0) return; // al gecached
  }

  const { data, error } = await supabase
    .from('determinatie_aid')
    .select('id, data');

  if (error) {
    console.error('Determinatie-hulpen ophalen mislukt:', error.message);
    return;
  }
  if (!data?.length) return;

  await db.determinatie_aid.bulkPut(data);

  // Verwijder lokaal verouderde aids
  const remoteIds = new Set(data.map(r => r.id));
  const toDelete = await db.determinatie_aid
    .filter(r => !remoteIds.has(r.id))
    .primaryKeys();
  if (toDelete.length > 0) await db.determinatie_aid.bulkDelete(toDelete);
}

/**
 * Hook: geeft getAidsVoorSoort en getAidById terug.
 * De aid-objecten worden gehydrateerd (transform_type → echte functie).
 */
export function useDeterminatieAids() {
  const rawRows = useLiveQuery(
    () => db.determinatie_aid.toArray(),
    [],
    []
  ) ?? [];

  return useMemo(() => {
    const byEuring = {};
    const byId = {};

    for (const row of rawRows) {
      const aid = hydrateAid(row.data);
      if (!aid?.id) continue;
      byId[aid.id] = aid;
      (aid.soorten || []).forEach(code => {
        if (!byEuring[code]) byEuring[code] = [];
        byEuring[code].push(aid);
      });
    }

    return {
      getAidsVoorSoort: (euringCode) => (euringCode ? byEuring[euringCode] || [] : []),
      getAidById: (id) => byId[id] || null,
    };
  }, [rawRows]);
}
