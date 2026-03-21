import { useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { supabase } from '../lib/supabase';
import { PULL_INTERVAL_MS } from '../data/constants';

// Module-level promise-referentie: gelijktijdige aanroepen wachten op dezelfde pull
let _pullPromise = null;

/**
 * Geeft de volledige veldconfiguratie terug uit de lokale Dexie-cache (offline-first).
 * Pull van Supabase als de cache leeg is of ouder dan 1 uur.
 */
export function useVeldConfig() {
  const pulledRef = useRef(false);

  const config = useLiveQuery(
    () => db.veld_config.orderBy('volgorde').toArray(),
    [],
    []
  ) ?? [];

  useEffect(() => {
    if (pulledRef.current) return;
    pulledRef.current = true;
    pullVeldConfigIfNeeded(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return config;
}

/**
 * Controleert of een Supabase-pull nodig is en voert deze uit.
 * Exporteerbaar zodat SyncContext dit ook kan aanroepen.
 */
export function pullVeldConfigIfNeeded(force = false) {
  if (!navigator.onLine) return Promise.resolve();
  if (_pullPromise) return _pullPromise;
  _pullPromise = _doVeldConfigPull(force).finally(() => { _pullPromise = null; });
  return _pullPromise;
}

async function _doVeldConfigPull(force) {
  if (!force) {
    const count = await db.veld_config.count();
    if (count > 0) {
      const meta = await db.meta.get('veld_config_last_pull');
      if (meta) {
        const age = Date.now() - new Date(meta.value).getTime();
        if (age < PULL_INTERVAL_MS) return;
      }
    }
  }

  const { data, error } = await supabase
    .from('veld_config')
    .select('*')
    .order('volgorde');

  if (error || !data || data.length === 0) return;

  await db.veld_config.bulkPut(data);
  await db.meta.put({ key: 'veld_config_last_pull', value: new Date().toISOString() });
}
