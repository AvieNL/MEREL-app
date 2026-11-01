import { useLiveQuery } from 'dexie-react-hooks';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/db';
import { supabase } from '../lib/supabase';

const BATCH_SIZE = 500;

export function useWaarnemingen() {
  const { user } = useAuth();

  // undefined = Dexie nog aan het laden; [] = echt leeg; array = data
  const waarnemingen = useLiveQuery(
    () => user ? db.waarnemingen.where('user_id').equals(user.id).toArray() : [],
    [user?.id]
  );

  // Pull all records from Supabase into Dexie, paginated (Supabase max 1000 per request)
  async function syncFromSupabase() {
    if (!user) return 0;
    const all = [];
    let from = 0;
    while (true) {
      const { data, error } = await supabase
        .from('waarnemingen')
        .select('*')
        .eq('user_id', user.id)
        .range(from, from + BATCH_SIZE - 1);
      if (error) throw error;
      if (!data?.length) break;
      all.push(...data);
      if (data.length < BATCH_SIZE) break;
      from += BATCH_SIZE;
    }
    if (!all.length) return 0;
    await db.waarnemingen.where('user_id').equals(user.id).delete();
    await db.waarnemingen.bulkPut(all);
    return all.length;
  }

  // Import items: upsert to Supabase (cloud), then cache in Dexie
  // onProgress(done, total) is called after each batch
  async function importWaarnemingen(items, onProgress) {
    if (!user) return 0;
    const seen = new Map();
    for (const item of items) seen.set(item.id, item);
    const unique = [...seen.values()].map(item => ({ ...item, user_id: user.id }));

    for (let i = 0; i < unique.length; i += BATCH_SIZE) {
      const batch = unique.slice(i, i + BATCH_SIZE);
      const { error } = await supabase
        .from('waarnemingen')
        .upsert(batch, { onConflict: 'id,user_id' });
      if (error) throw error;
      onProgress?.(Math.min(i + BATCH_SIZE, unique.length), unique.length);
    }

    await db.waarnemingen.bulkPut(unique);
    return unique.length;
  }

  async function deleteWaarneming(id) {
    if (user) {
      await supabase.from('waarnemingen').delete().eq('id', id).eq('user_id', user.id);
    }
    await db.waarnemingen.delete(id);
  }

  async function clearAllWaarnemingen() {
    if (!user) return;
    const { error } = await supabase
      .from('waarnemingen')
      .delete()
      .eq('user_id', user.id);
    if (error) throw error;
    await db.waarnemingen.where('user_id').equals(user.id).delete();
  }

  return { waarnemingen, importWaarnemingen, deleteWaarneming, clearAllWaarnemingen, syncFromSupabase };
}
