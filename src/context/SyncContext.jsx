import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../lib/db';
import { pullSpeciesIfNeeded } from '../hooks/useSpeciesRef';
import { pullSpeciesOverrides } from '../hooks/useSpeciesOverrides';
import { pullVeldConfigIfNeeded } from '../hooks/useVeldConfig';
import { executeQueueItem } from '../utils/syncQueue';

const SyncContext = createContext(null);

export const MAX_ATTEMPTS = 5;

export function SyncProvider({ children }) {
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingItems, setPendingItems] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSynced, setLastSynced] = useState(() => {
    const stored = localStorage.getItem('vrs-last-synced');
    return stored ? new Date(stored) : null;
  });
  const [syncError, setSyncError] = useState('');
  const [syncLost, setSyncLost] = useState(() => {
    const stored = localStorage.getItem('vrs-sync-lost');
    return stored ? parseInt(stored, 10) : 0;
  });
  const syncingRef = useRef(false);

  function addSyncLost(count) {
    setSyncLost(prev => {
      const next = prev + count;
      localStorage.setItem('vrs-sync-lost', String(next));
      return next;
    });
  }

  function clearSyncLost() {
    setSyncLost(0);
    localStorage.removeItem('vrs-sync-lost');
  }

  // Online/offline detectie
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      processQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // Bij (her)inloggen: pending count ophalen en wachtrij verwerken
  useEffect(() => {
    if (!user) {
      setPendingCount(0);
      return;
    }
    refreshPendingCount();
    if (navigator.onLine) processQueue();
  }, [user]);  // eslint-disable-line react-hooks/exhaustive-deps

  // App wordt weer actief (bijv. terugkomen van achtergrond): sync uitvoeren
  useEffect(() => {
    function handleVisibility() {
      if (!document.hidden && navigator.onLine && user) {
        processQueue();
        pullSpeciesOverrides(user.id).catch(e => console.warn('Override pull mislukt:', e.message));
        pullSpeciesIfNeeded(false).catch(e => console.warn('Species pull mislukt:', e.message));
        pullVeldConfigIfNeeded(false).catch(e => console.warn('VeldConfig pull mislukt:', e.message));
      }
    }
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [user]);  // eslint-disable-line react-hooks/exhaustive-deps

  async function refreshPendingCount() {
    const items = await db.sync_queue.orderBy('id').toArray();
    setPendingCount(items.length);
    setPendingItems(items);
  }

  /**
   * Voeg een mutatie toe aan de sync-wachtrij.
   * Wordt direct verwerkt als er internet is.
   */
  const addToQueue = useCallback(async (tableName, operation, data) => {
    await db.sync_queue.add({
      table_name: tableName,
      operation,       // 'upsert' | 'delete' | 'batch_upsert'
      data,
      createdAt: new Date().toISOString(),
      attempts: 0,
    });
    await refreshPendingCount();

    // Direct proberen als online
    if (navigator.onLine && user && !syncingRef.current) {
      processQueue();
    }
  }, [user]);  // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Verwerk de sync-wachtrij: verstuur pending mutaties naar Supabase.
   */
  const processQueue = useCallback(async () => {
    if (!user || syncingRef.current || !navigator.onLine) return;

    const pending = await db.sync_queue.orderBy('id').toArray();
    const speciesCount = await db.species.count();

    // Pull species basisdata als de cache leeg is (ongeacht queue)
    if (speciesCount === 0) {
      pullSpeciesIfNeeded(false).catch(e => console.warn('Species pull mislukt:', e.message));
    }

    if (pending.length === 0) return;

    syncingRef.current = true;
    setSyncing(true);
    setSyncError('');

    let hasErrors = false;

    for (const item of pending) {
      if (item.attempts >= MAX_ATTEMPTS) continue;

      try {
        await executeQueueItem(item, user.id);
        await db.sync_queue.delete(item.id);
      } catch (err) {
        hasErrors = true;
        await db.sync_queue.update(item.id, {
          attempts: (item.attempts || 0) + 1,
          lastError: err.message,
        });
        console.warn(`Sync mislukt (poging ${item.attempts + 1}/${MAX_ATTEMPTS}):`, err.message);
      }
    }

    // Verwijder items die het maximaal aantal pogingen hebben bereikt en waarschuw de gebruiker
    const exhausted = await db.sync_queue.filter(i => (i.attempts ?? 0) >= MAX_ATTEMPTS).toArray();
    if (exhausted.length > 0) {
      addSyncLost(exhausted.length);
      await db.sync_queue.bulkDelete(exhausted.map(i => i.id));
    }

    await refreshPendingCount();
    syncingRef.current = false;
    setSyncing(false);

    if (!hasErrors) {
      const now = new Date();
      setLastSynced(now);
      localStorage.setItem('vrs-last-synced', now.toISOString());
      setSyncError('');
      if (user) {
        pullSpeciesOverrides(user.id).catch(e => console.warn('Override pull mislukt:', e.message));
      }
    } else {
      const stillPending = await db.sync_queue.count();
      if (stillPending > 0) {
        setSyncError('Synchronisatie gedeeltelijk mislukt. Wordt opnieuw geprobeerd.');
      }
    }
  }, [user]);  // eslint-disable-line react-hooks/exhaustive-deps

  async function clearQueue() {
    await db.sync_queue.clear();
    await refreshPendingCount();
  }

  return (
    <SyncContext.Provider value={{
      pendingCount,
      pendingItems,
      syncing,
      isOnline,
      lastSynced,
      syncError,
      syncLost,
      clearSyncLost,
      addToQueue,
      processQueue,
      refreshPendingCount,
      clearQueue,
    }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error('useSync moet binnen een SyncProvider worden gebruikt');
  return ctx;
}

