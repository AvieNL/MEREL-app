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

  const nesten    = useLiveQuery(() => db.nest.orderBy('kastnummer').filter(n => !n.deleted_at).toArray(), [], []);
  const deletedNesten = useLiveQuery(() => db.nest.filter(n => !!n.deleted_at).toArray(), [], []);
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

  const bulkImportNestBackup = useCallback(async (backup) => {
    if (!user) return null;
    const now = new Date().toISOString();
    let counts = { nesten: 0, legsels: 0, bezoeken: 0, ringen: 0 };

    for (const nest of (backup.nesten ?? [])) {
      const { legsels: nestLegsels, ...nestData } = nest;
      const existing = await db.nest.get(nestData.id);
      if (!existing) {
        const record = { ...nestData, aangemaakt_door: user.id, updated_at: now };
        await db.nest.put(record);
        await addToQueue('nest', 'upsert', record);
        counts.nesten++;
      }

      for (const legsel of (nestLegsels ?? [])) {
        const { bezoeken: legselBezoeken, ...legselData } = legsel;
        const existingL = await db.legsel.get(legselData.id);
        if (!existingL) {
          const record = { ...legselData, aangemaakt_door: user.id, updated_at: now };
          await db.legsel.put(record);
          await addToQueue('legsel', 'upsert', record);
          counts.legsels++;
        }

        for (const bezoek of (legselBezoeken ?? [])) {
          const { ringen: bezoekRingen, ...bezoekData } = bezoek;
          const existingB = await db.nestbezoek.get(bezoekData.id);
          if (!existingB) {
            const record = { ...bezoekData, aangemaakt_door: user.id, updated_at: now };
            await db.nestbezoek.put(record);
            await addToQueue('nestbezoek', 'upsert', record);
            counts.bezoeken++;
          }

          for (const ring of (bezoekRingen ?? [])) {
            const existingR = await db.nestring.get(ring.id);
            if (!existingR) {
              const record = { ...ring, aangemaakt_door: user.id, updated_at: now };
              await db.nestring.put(record);
              await addToQueue('nestring', 'upsert', record);
              counts.ringen++;
            }
          }
        }
      }
    }

    return counts;
  }, [user, addToQueue]);

  const deleteNest = useCallback(async (id) => {
    const deleted_at = new Date().toISOString();
    await db.nest.update(id, { deleted_at });
    await addToQueue('nest', 'nest_soft_delete', { id, deleted_at });
  }, [addToQueue]);

  const restoreNest = useCallback(async (id) => {
    await db.nest.update(id, { deleted_at: null });
    await addToQueue('nest', 'nest_restore', { id });
  }, [addToQueue]);

  const permanentDeleteNest = useCallback(async (id) => {
    // Cascade: verwijder kinderen vóór de ouder (FK-volgorde)
    const legsels = await db.legsel.where('nest_id').equals(id).toArray();
    const legselIds = legsels.map(l => l.id);
    if (legselIds.length > 0) {
      const bezoeken = await db.nestbezoek.where('legsel_id').anyOf(legselIds).toArray();
      const bezoekIds = bezoeken.map(b => b.id);
      if (bezoekIds.length > 0) {
        await db.nestring.where('nestbezoek_id').anyOf(bezoekIds).delete();
        await db.nestbezoek.bulkDelete(bezoekIds);
      }
      await db.legsel.bulkDelete(legselIds);
    }
    await db.nest.delete(id);
    await addToQueue('nest', 'nest_delete', { id });
  }, [addToQueue]);

  const markLegselsExported = useCallback(async (ids) => {
    const exported_at = new Date().toISOString();
    await db.legsel.where('id').anyOf(ids).modify({ exported_at });
    await addToQueue('legsel', 'mark_nest_exported', { ids, exported_at });
  }, [addToQueue]);

  const deleteBezoek = useCallback(async (id) => {
    await db.nestbezoek.delete(id);
    await addToQueue('nestbezoek', 'nest_delete', { id });
  }, [addToQueue]);

  const deleteNestring = useCallback(async (id) => {
    await db.nestring.delete(id);
    await addToQueue('nestring', 'nest_delete', { id });
  }, [addToQueue]);

  const updateNestring = useCallback(async (id, updates) => {
    const existing = await db.nestring.get(id);
    if (!existing) return;
    const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
    await db.nestring.put(updated);
    await addToQueue('nestring', 'upsert', updated);
  }, [addToQueue]);

  return {
    nesten,
    deletedNesten,
    legsels,
    bezoeken,
    ringen,
    bulkImportNestBackup,
    addNest,
    updateNest,
    addLegsel,
    updateLegsel,
    addBezoek,
    updateBezoek,
    addNestring,
    markLegselsExported,
    deleteNest,
    restoreNest,
    permanentDeleteNest,
    deleteBezoek,
    deleteNestring,
    updateNestring,
  };
}
