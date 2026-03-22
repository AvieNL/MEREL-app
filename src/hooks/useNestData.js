import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSync } from '../context/SyncContext';
import { db } from '../lib/db';

/**
 * Reactieve data-hook voor alle nestkast-tabellen.
 * Alle queries lopen via Dexie (offline-first); sync regelt de Supabase-kant.
 */
export function useNestData() {
  const { user } = useAuth();
  const { addToQueue } = useSync();

  const nesten    = useLiveQuery(() => db.nest.orderBy('kastnummer').toArray(), [], []);
  const legsels   = useLiveQuery(() => db.legsel.toArray(), [], []);
  const bezoeken  = useLiveQuery(() => db.nestbezoek.orderBy('datum').toArray(), [], []);
  const ringen    = useLiveQuery(() => db.nestring.toArray(), [], []);

  // ── Schrijfoperaties ──────────────────────────────────────────────────────

  const addNest = useCallback(async (nestData) => {
    if (!user) return null;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const record = {
      ...nestData,
      id,
      aangemaakt_door: user.id,
      aangemaakt_op: now,
      updated_at: now,
    };
    await db.nest.put(record);
    await addToQueue('nest', 'upsert', record);
    return id;
  }, [user, addToQueue]);

  const updateNest = useCallback(async (id, updates) => {
    const existing = await db.nest.get(id);
    if (!existing) return;
    const record = { ...existing, ...updates, updated_at: new Date().toISOString() };
    await db.nest.put(record);
    await addToQueue('nest', 'upsert', record);
  }, [addToQueue]);

  const addLegsel = useCallback(async (legselData) => {
    if (!user) return null;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const record = {
      ...legselData,
      id,
      aangemaakt_door: user.id,
      updated_at: now,
    };
    await db.legsel.put(record);
    await addToQueue('legsel', 'upsert', record);
    return id;
  }, [user, addToQueue]);

  const updateLegsel = useCallback(async (id, updates) => {
    const existing = await db.legsel.get(id);
    if (!existing) return;
    const record = { ...existing, ...updates, updated_at: new Date().toISOString() };
    await db.legsel.put(record);
    await addToQueue('legsel', 'upsert', record);
  }, [addToQueue]);

  const addBezoek = useCallback(async (bezoekData) => {
    if (!user) return null;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const record = {
      ...bezoekData,
      id,
      aangemaakt_door: user.id,
      updated_at: now,
    };
    await db.nestbezoek.put(record);
    await addToQueue('nestbezoek', 'upsert', record);
    return id;
  }, [user, addToQueue]);

  const updateBezoek = useCallback(async (id, updates) => {
    const existing = await db.nestbezoek.get(id);
    if (!existing) return;
    const record = { ...existing, ...updates, updated_at: new Date().toISOString() };
    await db.nestbezoek.put(record);
    await addToQueue('nestbezoek', 'upsert', record);
  }, [addToQueue]);

  const addNestring = useCallback(async (netstringData) => {
    if (!user) return null;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const record = {
      ...netstringData,
      id,
      aangemaakt_door: user.id,
      updated_at: now,
    };
    await db.nestring.put(record);
    await addToQueue('nestring', 'upsert', record);
    return id;
  }, [user, addToQueue]);

  const deleteNest = useCallback(async (id) => {
    await db.nest.delete(id);
    await addToQueue('nest', 'nest_delete', { id });
  }, [addToQueue]);

  return {
    nesten,
    legsels,
    bezoeken,
    ringen,
    addNest,
    updateNest,
    addLegsel,
    updateLegsel,
    addBezoek,
    updateBezoek,
    addNestring,
    deleteNest,
  };
}
