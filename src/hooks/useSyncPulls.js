import { useEffect } from 'react';
import { pullSpeciesIfNeeded } from './useSpeciesRef';
import { pullSpeciesOverrides } from './useSpeciesOverrides';
import { pullVeldConfigIfNeeded } from './useVeldConfig';

/**
 * Beheert de pull-triggers voor gedeelde referentiedata.
 * Scheiding van verantwoordelijkheden: SyncContext beheert de mutatie-wachtrij,
 * useSyncPulls beheert wanneer referentiedata wordt opgehaald.
 *
 * Trigger-momenten:
 * - Bij (her)inloggen: species + veldconfig ophalen
 * - Bij app-heractivering (visibilitychange): species + veldconfig + overrides ophalen
 */
export function useSyncPulls(user) {
  // Bij (her)inloggen: basisreferentiedata ophalen
  useEffect(() => {
    if (!user || !navigator.onLine) return;
    pullSpeciesIfNeeded(false).catch(e => console.warn('Species pull mislukt:', e.message));
    pullVeldConfigIfNeeded(false).catch(e => console.warn('VeldConfig pull mislukt:', e.message));
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // App wordt weer actief (bijv. terugkomen van achtergrond): alle referentiedata refreshen
  useEffect(() => {
    function handleVisibility() {
      if (!document.hidden && navigator.onLine && user) {
        pullSpeciesOverrides(user.id).catch(e => console.warn('Override pull mislukt:', e.message));
        pullSpeciesIfNeeded(false).catch(e => console.warn('Species pull mislukt:', e.message));
        pullVeldConfigIfNeeded(false).catch(e => console.warn('VeldConfig pull mislukt:', e.message));
      }
    }
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps
}
