import { db } from '../lib/db';
import { supabase } from '../lib/supabase';

// Module-level promise-referentie: gelijktijdige aanroepen wachten op dezelfde pull
let _pullPromise = null;

/**
 * Pull alle nestkastdata van Supabase naar de lokale Dexie-cache.
 * Haalt alle 5 nesttabellen op in volgorde (ouder→kind) zodat FK-relaties kloppen.
 * RLS op Supabase bepaalt welke rijen de gebruiker mag zien.
 * Exporteerbaar zodat useSyncPulls dit ook kan aanroepen.
 */
export function pullNestData() {
  if (!navigator.onLine) return Promise.resolve();
  if (_pullPromise) return _pullPromise;
  _pullPromise = _doNestPull().finally(() => { _pullPromise = null; });
  return _pullPromise;
}

async function _doNestPull() {
  // Pull volgorde: ouder vóór kind (i.v.m. FK-constraints bij weergave)
  const tables = ['nest', 'legsel', 'nestbezoek', 'nestring'];

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.warn(`Nest pull mislukt voor ${table}:`, error.message);
      continue;
    }
    if (!data || data.length === 0) {
      await db[table].clear();
      continue;
    }

    // Upsert alle Supabase-rijen lokaal
    await db[table].bulkPut(data);

    // Verwijder lokale rijen die op een ander apparaat zijn gewist
    const supabaseIds = new Set(data.map(r => r.id));
    const localAll = await db[table].toArray();
    const toDelete = localAll.filter(r => !supabaseIds.has(r.id)).map(r => r.id);
    if (toDelete.length > 0) await db[table].bulkDelete(toDelete);
  }
}
