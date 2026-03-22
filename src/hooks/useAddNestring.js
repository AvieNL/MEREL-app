import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSync } from '../context/SyncContext';
import { db } from '../lib/db';

/**
 * Lichtgewicht hook voor het aanmaken van een nestring-record.
 * Geen live queries — alleen schrijven naar Dexie + sync queue.
 */
export function useAddNestring() {
  const { user } = useAuth();
  const { addToQueue } = useSync();

  return useCallback(async (data) => {
    if (!user) return null;
    const id = crypto.randomUUID();
    const record = {
      ...data,
      id,
      aangemaakt_door: user.id,
      updated_at: new Date().toISOString(),
    };
    await db.nestring.put(record);
    await addToQueue('nestring', 'upsert', record);
    return id;
  }, [user, addToQueue]);
}
