import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useAuth } from '../../context/AuthContext';
import { useSync } from '../../context/SyncContext';
import { db } from '../../lib/db';
import { supabase } from '../../lib/supabase';
import { formatDatum } from '../../utils/dateHelper';

function fmtTijd(date) {
  if (!date) return '—';
  const tijd = date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  const isVandaag = date.toDateString() === new Date().toDateString();
  return isVandaag ? `vandaag ${tijd}` : `${formatDatum(date.toISOString().slice(0, 10))} ${tijd}`;
}

export default function CloudStatus() {
  const { user } = useAuth();
  const { pendingCount, syncError, lastSynced, isOnline, syncLost, clearSyncLost } = useSync();
  const [online, setOnline] = useState(null);
  const [loadingOnline, setLoadingOnline] = useState(true);
  const [onlineError, setOnlineError] = useState('');
  const [lastPull, setLastPull] = useState(null);

  // Lokale tellingen — reactief via Dexie
  const lokaalVangsten = useLiveQuery(
    () => user ? db.vangsten.where('user_id').equals(user.id).filter(r => !r.deleted_at).count() : 0,
    [user?.id], 0
  ) ?? 0;
  const lokaalVerwijderd = useLiveQuery(
    () => user ? db.vangsten.where('user_id').equals(user.id).filter(r => !!r.deleted_at).count() : 0,
    [user?.id], 0
  ) ?? 0;
  const lokaalProjecten = useLiveQuery(
    () => user ? db.projecten.where('user_id').equals(user.id).count() : 0,
    [user?.id], 0
  ) ?? 0;
  const lokaalRingstrengen = useLiveQuery(
    () => user ? db.ringstrengen.where('user_id').equals(user.id).count() : 0,
    [user?.id], 0
  ) ?? 0;

  useEffect(() => {
    if (!user) return;
    laadOnline();
    laadLastPull();
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
      if (vangsten.error) throw vangsten.error;
      setOnline({
        vangsten: vangsten.count ?? 0,
        projecten: projecten.count ?? 0,
        ringstrengen: ringstrengen.count ?? 0,
      });
    } catch {
      setOnlineError('Kon clouddata niet ophalen');
    } finally {
      setLoadingOnline(false);
    }
  }

  async function laadLastPull() {
    const meta = await db.meta.get(`last_pull_vangsten_${user.id}`);
    if (meta?.value) setLastPull(new Date(meta.value));
  }

  function vernieuwen() {
    laadOnline();
    laadLastPull();
  }

  const tabelRijen = [
    { label: 'Vangsten',     lokaal: lokaalVangsten,    online: online?.vangsten },
    { label: 'In prullenbak',lokaal: lokaalVerwijderd,  online: null, sub: true },
    { label: 'Projecten',    lokaal: lokaalProjecten,   online: online?.projecten },
    { label: 'Ringstrengen', lokaal: lokaalRingstrengen,online: online?.ringstrengen },
  ];

  const fout = syncError || onlineError;
  const verloren = syncLost > 0;

  return (
    <div className="cloud-status">
      <div className="cloud-status__header">
        <div className={`cloud-status__dot cloud-status__dot--${isOnline ? 'online' : 'offline'}`} />
        <span className={`cloud-status__label cloud-status__label--${isOnline ? 'online' : 'offline'}`}>
          {isOnline ? 'Verbonden' : 'Offline'}
        </span>
        <button className="cloud-status__refresh" onClick={vernieuwen} title="Vernieuwen">↻</button>
      </div>

      <table className="cloud-status__table">
        <thead>
          <tr>
            <th></th>
            <th>Lokaal</th>
            <th>Online</th>
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
          <span>Laatste pull</span>
          <span>{fmtTijd(lastPull)}</span>
        </div>
        <div className="cloud-status__tijd-rij">
          <span>Laatste sync</span>
          <span>{fmtTijd(lastSynced)}</span>
        </div>
        {pendingCount > 0 && (
          <div className="cloud-status__tijd-rij cloud-status__pending">
            <span>Wacht op versturen</span>
            <span>{pendingCount} wijziging{pendingCount !== 1 ? 'en' : ''}</span>
          </div>
        )}
      </div>

      {verloren && (
        <div className="cloud-status__lost">
          <span>
            {syncLost} wijziging{syncLost !== 1 ? 'en' : ''} kon{syncLost !== 1 ? 'den' : ''} niet worden gesynchroniseerd en {syncLost !== 1 ? 'zijn' : 'is'} verwijderd uit de wachtrij.
          </span>
          <button className="cloud-status__lost-dismiss" onClick={clearSyncLost}>✕</button>
        </div>
      )}
      {fout && <div className="cloud-status__error">{fout}</div>}
    </div>
  );
}
