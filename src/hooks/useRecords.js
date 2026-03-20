import { useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { generateId } from '../utils/storage';
import { db } from '../lib/db';
import { supabase } from '../lib/supabase';
import { fetchAllPages } from '../utils/supabaseHelper';
import { toVangstRow, fromVangstRow } from '../utils/supabase-helpers';
import { toYMD } from '../utils/dateHelper';
import { useAuth } from '../context/AuthContext';
import { useSync } from '../context/SyncContext';

function migrateUploaded(record) {
  if (record.uploaded !== undefined) return record;
  return { ...record, uploaded: record.bron === 'griel_import' };
}

export function useRecords() {
  const { user } = useAuth();
  const { addToQueue } = useSync();
  const pulledRef = useRef(false);

  // Actieve vangsten (niet soft-deleted)
  const records = useLiveQuery(
    () => {
      if (!user) return [];
      return db.vangsten
        .orderBy('[user_id+timestamp]')
        .reverse()
        .filter(r => r.user_id === user.id && !r.deleted_at)
        .toArray();
    },
    [user?.id],
    []
  ) ?? [];

  // Soft-deleted vangsten (prullenbak)
  const deletedRecords = useLiveQuery(
    () => {
      if (!user) return [];
      return db.vangsten
        .where('user_id').equals(user.id)
        .filter(r => !!r.deleted_at)
        .toArray();
    },
    [user?.id],
    []
  ) ?? [];

  // Bij (her)inloggen: pull data van Supabase naar Dexie
  useEffect(() => {
    if (!user) {
      pulledRef.current = false;
      return;
    }
    if (pulledRef.current) return;
    pulledRef.current = true;
    pullFromSupabase();
    normalizeVangstdatums();
  }, [user?.id]);  // eslint-disable-line react-hooks/exhaustive-deps

  async function pullFromSupabase() {
    const localCount = await db.vangsten
      .where('user_id').equals(user.id).count();

    const meta = await db.meta.get(`last_pull_vangsten_${user.id}`);
    const lastPull = meta?.value;

    // Pagineer: haal max 1000 records per request op tot alles binnen is
    let allRows;
    try {
      allRows = await fetchAllPages((from, to) => {
        let q = supabase
          .from('vangsten')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .range(from, to);
        if (localCount > 0 && lastPull) q = q.gt('updated_at', lastPull);
        return q;
      });
    } catch (err) {
      console.error('Pull vangsten mislukt:', err.message);
      return;
    }

    if (allRows.length === 0) return;

    const rows = allRows.map(r => {
      const record = { ...fromVangstRow(r), user_id: user.id };
      if (!record.timestamp) record.timestamp = r.updated_at || new Date().toISOString();
      return record;
    }).map(migrateUploaded);
    await db.vangsten.bulkPut(rows);
    await db.meta.put({
      key: `last_pull_vangsten_${user.id}`,
      value: new Date().toISOString(),
    });
  }

  // Eenmalige migratie: normaliseer vangstdatums naar yyyy-mm-dd
  async function normalizeVangstdatums() {
    const meta = await db.meta.get(`normalize_dates_v2_${user.id}`);
    if (meta?.value) return;
    const all = await db.vangsten.where('user_id').equals(user.id).toArray();
    const toFix = all.filter(r => r.vangstdatum && r.vangstdatum !== toYMD(r.vangstdatum));
    if (toFix.length > 0) {
      const fixed = toFix.map(r => ({ ...r, vangstdatum: toYMD(r.vangstdatum) }));
      await db.vangsten.bulkPut(fixed);
    }
    await db.meta.put({ key: `normalize_dates_v2_${user.id}`, value: true });
  }


  // --- Mutaties ---

  function addRecord(record) {
    if (!user) return null;
    const newRecord = {
      ...record,
      id: generateId(),
      timestamp: new Date().toISOString(),
      bron: 'app',
      uploaded: false,
      user_id: user.id,
    };
    db.vangsten.put(newRecord);
    addToQueue('vangsten', 'upsert', toVangstRow(newRecord, user.id));
    return newRecord;
  }

  function updateRecord(id, updates) {
    db.vangsten.get(id).then(existing => {
      if (!existing) return;
      const updated = { ...existing, ...updates, handmatig_gewijzigd_at: new Date().toISOString() };
      db.vangsten.put(updated);
      addToQueue('vangsten', 'upsert', toVangstRow(updated, user.id));
    }).catch(err => console.error('updateRecord mislukt:', err));
  }

  function deleteRecord(id) {
    const deletedAt = new Date().toISOString();
    db.vangsten.update(id, { deleted_at: deletedAt });
    addToQueue('vangsten', 'soft_delete', { id, deleted_at: deletedAt, user_id: user.id });
  }

  function restoreRecord(id) {
    db.vangsten.update(id, { deleted_at: null });
    addToQueue('vangsten', 'restore', { id, user_id: user.id });
  }

  function permanentDeleteRecord(id) {
    db.vangsten.delete(id);
    addToQueue('vangsten', 'delete', { id, user_id: user.id });
  }

  function markAsUploaded(ids) {
    const exportedAt = new Date().toISOString();
    db.vangsten.where('id').anyOf(ids).modify({ uploaded: true, exported_at: exportedAt });
    addToQueue('vangsten', 'mark_uploaded', { ids });
  }

  function markAllAsUploaded() {
    const exportedAt = new Date().toISOString();
    db.vangsten
      .where('user_id').equals(user.id)
      .and(r => !r.uploaded)
      .primaryKeys()
      .then(ids => {
        if (ids.length === 0) return;
        db.vangsten.where('id').anyOf(ids).modify({ uploaded: true, exported_at: exportedAt });
        addToQueue('vangsten', 'mark_uploaded', { ids });
      }).catch(err => console.error('markAllAsUploaded mislukt:', err));
  }

  function importRecords(newRecords) {
    if (!user) return 0;
    const withIds = newRecords.map(r => ({
      ...r,
      id: r.id || generateId(),
      timestamp: r.timestamp || new Date().toISOString(),
      bron: r.bron || 'import',
      uploaded: r.uploaded ?? true,
      user_id: user.id,
    }));
    db.vangsten.bulkPut(withIds);
    addToQueue('vangsten', 'batch_upsert', withIds.map(r => toVangstRow(r, user.id)));
    return withIds.length;
  }

  function renameProject(oldName, newName) {
    db.vangsten
      .where('user_id').equals(user.id)
      .and(r => r.project === oldName)
      .toArray()
      .then(affected => {
        if (affected.length === 0) return;
        const updated = affected.map(r => ({ ...r, project: newName }));
        db.vangsten.bulkPut(updated);
        addToQueue('vangsten', 'batch_upsert', updated.map(r => toVangstRow(r, user.id)));
      }).catch(err => console.error('renameProject mislukt:', err));
  }

  async function fullResync() {
    await db.meta.delete(`last_pull_vangsten_${user.id}`);
    await pullFromSupabase();
  }

  return {
    records,
    deletedRecords,
    addRecord,
    updateRecord,
    deleteRecord,
    restoreRecord,
    permanentDeleteRecord,
    markAsUploaded,
    markAllAsUploaded,
    importRecords,
    renameProject,
    fullResync,
  };
}
