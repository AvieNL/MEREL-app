import { useSyncExternalStore, useEffect } from 'react';
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

  // Vangnet: als de cache leeg is (bijv. na Dexie-upgrade), direct een pull starten.
  // Normaal doet SyncContext dit — maar dit vangt gevallen op waarbij SyncContext
  // al vóór de Dexie-upgrade heeft geprobeerd te putten (en 0 rijen kreeg).
  useEffect(() => {
    if (species.length === 0 && navigator.onLine) {
      pullSpeciesIfNeeded(false).catch(() => {});
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      supabase.from('species').select('euring_code, naam_nl, data').range(from, to)
    );
  } catch (err) {
    console.error('Soorten ophalen mislukt:', err.message);
    setSpeciesError('Soorten konden niet worden opgehaald. Controleer je verbinding.');
    return;
  }

  if (allData.length === 0) {
    console.warn('Species pull: 0 rijen ontvangen van Supabase (RLS of verbindingsprobleem?)');
    return;
  }

  // Merge: data-blob + top-level euring_code zodat de secundaire index gevuld wordt.
  // naam_nl blijft de primaire sleutel in Dexie.
  const rows = allData.map(r => ({ ...r.data, euring_code: r.euring_code }));

  try {
    await db.species.bulkPut(rows);
  } catch (err) {
    console.error('Species bulkPut mislukt:', err.message, err);
    setSpeciesError('Soorten konden niet worden opgeslagen. Probeer de pagina te verversen.');
    return;
  }

  // Verwijder lokale soorten die op een ander apparaat zijn gewist
  const supabaseNamen = new Set(allData.map(r => r.naam_nl).filter(Boolean));
  const toDelete = await db.species.filter(r => !supabaseNamen.has(r.naam_nl)).primaryKeys();
  if (toDelete.length > 0) await db.species.bulkDelete(toDelete);

  await db.meta.put({ key: 'species_last_pull', value: new Date().toISOString() });
  console.log(`Species pull geslaagd: ${rows.length} soorten opgeslagen`);
}
