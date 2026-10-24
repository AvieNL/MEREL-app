import { useLiveQuery } from 'dexie-react-hooks';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/db';

export function useWaarnemingen() {
  const { user } = useAuth();

  const waarnemingen = useLiveQuery(
    () => user ? db.waarnemingen.where('user_id').equals(user.id).toArray() : [],
    [user?.id],
    []
  );

  async function importWaarnemingen(items) {
    if (!user) return 0;
    const withUser = items.map(item => ({ ...item, user_id: user.id }));
    await db.waarnemingen.bulkPut(withUser);
    return withUser.length;
  }

  async function deleteWaarneming(id) {
    await db.waarnemingen.delete(id);
  }

  async function clearAllWaarnemingen() {
    if (!user) return;
    await db.waarnemingen.where('user_id').equals(user.id).delete();
  }

  return { waarnemingen, importWaarnemingen, deleteWaarneming, clearAllWaarnemingen };
}
