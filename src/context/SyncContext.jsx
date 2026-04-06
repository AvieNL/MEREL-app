import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { db } from '../lib/db';
import i18n from '../i18n/index.js';
import { pullSpeciesIfNeeded } from '../hooks/useSpeciesRef';
import { pullSpeciesOverrides } from '../hooks/useSpeciesOverrides';
import { useSyncPulls } from '../hooks/useSyncPulls';
import { executeQueueItem } from '../utils/syncQueue';

function getLabelForQueueItem(tableName, data) {
  if (tableName === 'vangsten') {
    const naam  = data?.vogelnaam  ?? '';
    const ring  = data?.ringnummer ?? '';
    const datum = data?.vangstdatum ?? '';
    const parts = [naam, ring, datum].filter(Boolean);
    if (parts.length > 0) return parts.join(' · ');
  }
  if (tableName === 'nest') return `Nest ${data?.kastnummer ?? ''}`.trim();
  if (tableName === 'nestbezoek') return `Nestbezoek ${data?.datum ?? ''}`.trim();
  if (tableName === 'legsel') return `Legsel ${data?.volgnummer ?? ''}`.trim();
  return tableName;
}

function isQuotaError(err) {
  return (
    err?.name === 'QuotaExceededError' ||
    err?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    err?.inner?.name === 'QuotaExceededError' ||
    String(err?.message).toLowerCase().includes('quota')
  );
}

const SyncContext = createContext(null);

export const MAX_ATTEMPTS = 5;

export function SyncProvider({ children }) {
  const { user } = useAuth();
  const { addToast } = useToast();
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
  const [syncLostItems, setSyncLostItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vrs-sync-lost-items') || '[]'); }
    catch { return []; }
  });
  const syncingRef = useRef(false);

  function addSyncLost(count, labels = []) {
    setSyncLost(prev => {
      const next = prev + count;
      localStorage.setItem('vrs-sync-lost', String(next));
      return next;
    });
    setSyncLostItems(prev => {
      const next = [...prev, ...labels];
      localStorage.setItem('vrs-sync-lost-items', JSON.stringify(next));
      return next;
    });
  }

  function clearSyncLost() {
    setSyncLost(0);
    setSyncLostItems([]);
    localStorage.removeItem('vrs-sync-lost');
    localStorage.removeItem('vrs-sync-lost-items');
  }

  // Online/offline detectie
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      // Reset backoff voor alle wachtende items bij herverbinding
      await db.sync_queue.toCollection().modify({ nextRetryAt: null });
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

  // Pull-orchestratie: wanneer referentiedata wordt opgehaald (login + heractivering)
  useSyncPulls(user);

  // Bij (her)inloggen: pending count ophalen en wachtrij verwerken
  useEffect(() => {
    if (!user) {
      setPendingCount(0);
      return;
    }
    refreshPendingCount();
    if (navigator.onLine) processQueue();
  }, [user]);  // eslint-disable-line react-hooks/exhaustive-deps

  // App wordt weer actief (bijv. terugkomen van achtergrond): wachtrij verwerken
  useEffect(() => {
    function handleVisibility() {
      if (!document.hidden && navigator.onLine && user) processQueue();
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
   * Dedupliceert: als er al een item staat voor dezelfde tabel + operatie + record-id,
   * wordt dat item overschreven in plaats van een nieuw item toegevoegd.
   * Wordt direct verwerkt als er internet is.
   */
  const addToQueue = useCallback(async (tableName, operation, data) => {
    try {
      // Bij een delete: verwijder eventuele pending upserts voor hetzelfde record
      // zodat ze niet parallel lopen en FK-violations veroorzaken
      if (data?.id && operation === 'nest_delete') {
        await db.sync_queue
          .where('table_name').equals(tableName)
          .filter(item => item.operation === 'upsert' && item.data?.id === data.id)
          .delete();
      }

      // Dedupliceer identieke operaties op hetzelfde record (bijv. meerdere edits offline)
      if (data?.id && ['upsert', 'soft_delete', 'restore'].includes(operation)) {
        const existing = await db.sync_queue
          .where('table_name').equals(tableName)
          .filter(item => item.operation === operation && item.data?.id === data.id)
          .first();
        if (existing) {
          await db.sync_queue.update(existing.id, {
            data,
            attempts: 0,
            nextRetryAt: null,
            createdAt: new Date().toISOString(),
          });
          await refreshPendingCount();
          if (navigator.onLine && user && !syncingRef.current) processQueue();
          return;
        }
      }

      await db.sync_queue.add({
        table_name: tableName,
        operation,
        data,
        label: getLabelForQueueItem(tableName, data),
        createdAt: new Date().toISOString(),
        attempts: 0,
        nextRetryAt: null,
      });
    } catch (err) {
      if (isQuotaError(err)) {
        addToast(i18n.t('errors:quota_exceeded'), 'error', 0);
        return;
      }
      throw err;
    }
    await refreshPendingCount();

    // Direct proberen als online
    if (navigator.onLine && user && !syncingRef.current) {
      processQueue();
    }
  }, [user, addToast]);  // eslint-disable-line react-hooks/exhaustive-deps

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

    if (pending.length === 0) {
      setSyncError('');
      return;
    }

    syncingRef.current = true;
    setSyncing(true);
    setSyncError('');

    let hasErrors = false;
    const now = Date.now();

    // Filter items die klaar zijn om te verwerken (geen backoff, niet uitgeput)
    const eligible = pending.filter(item =>
      item.attempts < MAX_ATTEMPTS &&
      !(item.nextRetryAt && item.nextRetryAt > now)
    );

    // Verwerk alle in-aanmerking-komende items parallel
    const results = await Promise.allSettled(
      eligible.map(item => executeQueueItem(item, user.id))
    );

    for (let i = 0; i < eligible.length; i++) {
      const item = eligible[i];
      if (results[i].status === 'fulfilled') {
        await db.sync_queue.delete(item.id);
      } else {
        hasErrors = true;
        const err = results[i].reason;
        const attempts = (item.attempts || 0) + 1;
        // Exponentiële backoff: 30s → 60s → 120s → 240s → 480s (max ~8 min)
        const backoffMs = Math.min(30_000 * Math.pow(2, attempts - 1), 8 * 60_000);
        await db.sync_queue.update(item.id, {
          attempts,
          lastError: err.message,
          nextRetryAt: Date.now() + backoffMs,
        });
        console.warn(`Sync mislukt (poging ${attempts}/${MAX_ATTEMPTS}, volgende poging over ${Math.round(backoffMs/1000)}s):`, err.message);
      }
    }

    // Verwijder items die het maximaal aantal pogingen hebben bereikt en waarschuw de gebruiker
    const exhausted = await db.sync_queue.filter(i => (i.attempts ?? 0) >= MAX_ATTEMPTS).toArray();
    if (exhausted.length > 0) {
      const lostLabels = exhausted.map(i => i.label || i.table_name).filter(Boolean);
      addSyncLost(exhausted.length, lostLabels);
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
        setSyncError(i18n.t('errors:sync_partial_failure'));
      }
    }
  }, [user]);  // eslint-disable-line react-hooks/exhaustive-deps

  async function clearQueue() {
    await db.sync_queue.clear();
    await refreshPendingCount();
    setSyncError('');
  }

  async function resetQueue() {
    await db.sync_queue.toCollection().modify({ attempts: 0, nextRetryAt: null, lastError: null });
    setSyncError('');
    await refreshPendingCount();
    if (navigator.onLine && user) processQueue();
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
      syncLostItems,
      clearSyncLost,
      addToQueue,
      processQueue,
      refreshPendingCount,
      clearQueue,
      resetQueue,
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

