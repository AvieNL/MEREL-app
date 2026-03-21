import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { useAuth } from '../../context/AuthContext';
import { useSync } from '../../context/SyncContext';
import { useSpeciesError } from '../../hooks/useSpeciesRef';
import { db } from '../../lib/db';
import { supabase } from '../../lib/supabase';
import { formatDatum } from '../../utils/dateHelper';

function fmtTijd(date, t) {
  if (!date) return '—';
  const tijd = date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  const isVandaag = date.toDateString() === new Date().toDateString();
  return isVandaag ? `${t('cloud_today')} ${tijd}` : `${formatDatum(date.toISOString().slice(0, 10))} ${tijd}`;
}

export default function CloudStatus() {
  const { user } = useAuth();
  const { pendingCount, syncError, lastSynced, isOnline, syncLost, syncLostItems, clearSyncLost } = useSync();
  const speciesError = useSpeciesError();
  const { t } = useTranslation();
  const [online, setOnline] = useState(null);
  const [loadingOnline, setLoadingOnline] = useState(true);
  const [onlineError, setOnlineError] = useState('');
  const [lastPull, setLastPull] = useState(null);
  const [storageInfo, setStorageInfo] = useState(null);

  // Lokale tellingen — één gecombineerde reactieve query
  const lokaalCounts = useLiveQuery(
    async () => {
      if (!user) return { vangsten: 0, verwijderd: 0, projecten: 0, ringstrengen: 0 };
      const [vangsten, verwijderd, projecten, ringstrengen] = await Promise.all([
        db.vangsten.where('user_id').equals(user.id).filter(r => !r.deleted_at).count(),
        db.vangsten.where('user_id').equals(user.id).filter(r => !!r.deleted_at).count(),
        db.projecten.where('user_id').equals(user.id).count(),
        db.ringstrengen.where('user_id').equals(user.id).count(),
      ]);
      return { vangsten, verwijderd, projecten, ringstrengen };
    },
    [user?.id],
    { vangsten: 0, verwijderd: 0, projecten: 0, ringstrengen: 0 }
  ) ?? { vangsten: 0, verwijderd: 0, projecten: 0, ringstrengen: 0 };

  const { vangsten: lokaalVangsten, verwijderd: lokaalVerwijderd, projecten: lokaalProjecten, ringstrengen: lokaalRingstrengen } = lokaalCounts;

  useEffect(() => {
    if (!user) return;
    laadOnline();
    laadLastPull();
    laadStorage();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  async function laadOnline() {
    setLoadingOnline(true);
    setOnlineError('');
    try {
      const [vangsten, projecten, ringstrengen] = await Promise.all([
        supabase.from('vangsten').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('projecten').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('ringstrengen').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);
      const firstError = [vangsten, projecten, ringstrengen].find(r => r.error);
      if (firstError) throw firstError.error;
      setOnline({
        vangsten: vangsten.count ?? 0,
        projecten: projecten.count ?? 0,
        ringstrengen: ringstrengen.count ?? 0,
      });
    } catch {
      setOnlineError(t('cloud_error'));
    } finally {
      setLoadingOnline(false);
    }
  }

  async function laadLastPull() {
    const meta = await db.meta.get(`last_pull_vangsten_${user.id}`);
    if (meta?.value) setLastPull(new Date(meta.value));
  }

  async function laadStorage() {
    if (!navigator.storage?.estimate) return;
    try {
      const { usage, quota } = await navigator.storage.estimate();
      setStorageInfo({ usage, quota });
    } catch {
      // niet beschikbaar in deze browser
    }
  }

  function vernieuwen() {
    laadOnline();
    laadLastPull();
    laadStorage();
  }

  const tabelRijen = [
    { label: t('cloud_catches'),     lokaal: lokaalVangsten,    online: online?.vangsten },
    { label: t('cloud_trash'),       lokaal: lokaalVerwijderd,  online: null, sub: true },
    { label: t('cloud_projects'),    lokaal: lokaalProjecten,   online: online?.projecten },
    { label: t('cloud_ring_strings'),lokaal: lokaalRingstrengen,online: online?.ringstrengen },
  ];

  const fout = syncError || onlineError || speciesError;
  const verloren = syncLost > 0;

  const storagePercent = storageInfo?.quota
    ? Math.round((storageInfo.usage / storageInfo.quota) * 100)
    : null;
  const storageMb = storageInfo
    ? `${(storageInfo.usage / 1024 / 1024).toFixed(1)} MB`
    : null;

  return (
    <div className="cloud-status">
      <div className="cloud-status__header">
        <div className={`cloud-status__dot cloud-status__dot--${isOnline ? 'online' : 'offline'}`} />
        <span className={`cloud-status__label cloud-status__label--${isOnline ? 'online' : 'offline'}`}>
          {isOnline ? t('status_online') : t('status_offline')}
        </span>
        <button className="cloud-status__refresh" onClick={vernieuwen} title="Vernieuwen">↻</button>
      </div>

      <table className="cloud-status__table">
        <thead>
          <tr>
            <th></th>
            <th>{t('cloud_status_local')}</th>
            <th>{t('cloud_status_online')}</th>
          </tr>
        </thead>
        <tbody>
          {tabelRijen.map(rij => (
            <tr key={rij.label} className={rij.sub ? 'cloud-status__row--sub' : ''}>
              <td>{rij.label}</td>
              <td>{rij.lokaal}</td>
              <td>
                {rij.online !== null && rij.online !== undefined
                  ? (loadingOnline ? '…' : rij.online)
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cloud-status__tijden">
        <div className="cloud-status__tijd-rij">
          <span>{t('cloud_last_pull')}</span>
          <span>{fmtTijd(lastPull, t)}</span>
        </div>
        <div className="cloud-status__tijd-rij">
          <span>{t('cloud_last_sync')}</span>
          <span>{fmtTijd(lastSynced, t)}</span>
        </div>
        {pendingCount > 0 && (
          <div className="cloud-status__tijd-rij cloud-status__pending">
            <span>{t('cloud_pending')}</span>
            <span>{t('cloud_pending_count', { count: pendingCount })}</span>
          </div>
        )}
        {storageMb !== null && (
          <div className={`cloud-status__tijd-rij${storagePercent >= 80 ? ' cloud-status__storage--vol' : ''}`}>
            <span>{t('cloud_storage')}</span>
            <span>{storageMb}{storagePercent !== null ? ` (${storagePercent}%)` : ''}</span>
          </div>
        )}
      </div>

      {verloren && (
        <div className="cloud-status__lost">
          <span>
            {t('cloud_lost', { count: syncLost })}
            {syncLostItems.length > 0 && (
              <span className="cloud-status__lost-items">
                {' '}({syncLostItems.slice(0, 5).join(', ')}{syncLostItems.length > 5 ? ` en ${syncLostItems.length - 5} meer` : ''})
              </span>
            )}
          </span>
          <button className="cloud-status__lost-dismiss" onClick={clearSyncLost} aria-label="Melding sluiten">✕</button>
        </div>
      )}
      {fout && <div className="cloud-status__error">{fout}</div>}
    </div>
  );
}
