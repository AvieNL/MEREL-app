import { useSyncExternalStore } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { fetchAllPages } from '../utils/supabaseHelper';
import { supabase } from '../lib/supabase';
import { PULL_INTERVAL_MS } from '../data/constants';

// Module-level promise-referentie: gelijktijdige aanroepen wachten op dezelfde pull
let _pullPromise = null;
let _pullError = null;
const _errorListeners = new Set();

function setSpeciesError(msg) {
  _pullError = msg;
  _errorListeners.forEach(fn => fn());
}

export function useSpeciesError() {
  return useSyncExternalStore(
    cb => { _errorListeners.add(cb); return () => _errorListeners.delete(cb); },
    () => _pullError
  );
}

/**
 * Geeft alle soorten terug uit de lokale Dexie-cache (offline-first).
 * Pull van Supabase als de cache leeg is of ouder dan 24 uur.
 */
// Pull wordt getriggerd door SyncContext (bij inloggen en app-heractivering).
// useSpeciesRef leest alleen uit de lokale Dexie-cache.
export function useSpeciesRef() {
  const species = useLiveQuery(
    () => db.species.orderBy('naam_nl').toArray(),
    [],
    []
  ) ?? [];

  return species;
}

/**
 * Controleert of een Supabase-pull nodig is en voert deze uit.
 * Exporteerbaar zodat SyncContext dit ook kan aanroepen.
 */
export function pullSpeciesIfNeeded(force = false) {
  if (_pullPromise) return _pullPromise;
  _pullPromise = _doSpeciesPull(force).finally(() => { _pullPromise = null; });
  return _pullPromise;
}

async function _doSpeciesPull(force) {
  if (!force) {
    const count = await db.species.count();
    if (count > 0) {
      const meta = await db.meta.get('species_last_pull');
      if (meta) {
        const age = Date.now() - new Date(meta.value).getTime();
        if (age < PULL_INTERVAL_MS) return; // Nog niet verlopen
      }
    }
  }

  // Gepagineerd ophalen (Supabase max 1000 rijen per request)
  let allData;
  try {
    allData = await fetchAllPages((from, to) =>
      supabase.from('species').select('naam_nl, data').range(from, to)
    );
  } catch (err) {
    console.error('Soorten ophalen mislukt:', err.message);
    setSpeciesError('Soorten konden niet worden opgehaald. Controleer je verbinding.');
    return;
  }

  if (allData.length === 0) return;

  const rows = allData.map(r => r.data);
  await db.species.bulkPut(rows);

  // Verwijder lokale soorten die op een ander apparaat zijn gewist
  const supabaseNames = new Set(allData.map(r => r.data?.naam_nl).filter(Boolean));
  const toDelete = await db.species.filter(r => !supabaseNames.has(r.naam_nl)).primaryKeys();
  if (toDelete.length > 0) await db.species.bulkDelete(toDelete);

  await db.meta.put({ key: 'species_last_pull', value: new Date().toISOString() });
}
