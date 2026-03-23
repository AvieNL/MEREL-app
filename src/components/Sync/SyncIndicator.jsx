import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSync } from '../../context/SyncContext';
import { MAX_ATTEMPTS } from '../../context/SyncContext';
import './SyncIndicator.css';

function formatTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function SyncIndicator() {
  const { pendingCount, pendingItems, syncing, isOnline, syncError, lastSynced, processQueue, clearQueue } = useSync();
  const { t } = useTranslation();
  const failedItems = pendingItems.filter(i => (i.attempts ?? 0) >= MAX_ATTEMPTS);
  const retryableItems = pendingItems.filter(i => (i.attempts ?? 0) < MAX_ATTEMPTS);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const OP_LABELS = {
    upsert:                   t('op_upsert'),
    delete:                   t('op_delete'),
    soft_delete:              t('op_soft_delete'),
    restore:                  t('op_restore'),
    batch_upsert:             t('op_batch_upsert'),
    mark_uploaded:            t('op_mark_uploaded'),
    species_override_upsert:  t('op_species_override_upsert'),
    species_override_delete:  t('op_species_override_delete'),
    profile_update:           t('op_profile_update'),
  };

  const TABLE_LABELS = {
    vangsten:         t('table_vangsten'),
    species_overrides: t('table_species_overrides'),
    profiles:         t('table_profiles'),
  };

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  if (!isOnline) {
    return (
      <div className="sync-indicator sync-indicator--offline" title={t('sync_offline_title')}>
        <span className="sync-icon">⊘</span>
        <span className="sync-label">{t('sync_offline')}</span>
      </div>
    );
  }

  if (syncing) {
    return (
      <div className="sync-indicator sync-indicator--syncing" title={t('sync_syncing_title')}>
        <span className="sync-spinner" />
        <span className="sync-label">{t('sync_syncing_label')}</span>
      </div>
    );
  }

  if (pendingCount > 0) {
    return (
      <div className="sync-indicator sync-indicator--pending sync-indicator--clickable" ref={ref} onClick={() => setOpen(o => !o)}>
        <span className="sync-icon">↑</span>
        <span className="sync-badge">{pendingCount > 9 ? '9+' : pendingCount}</span>
        <span className="sync-label">{t('sync_waiting')}</span>
        {open && (
          <div className="sync-popover">
            <div className="sync-popover-header">
              <strong>{t('sync_queue_count', { count: pendingCount })}</strong>
              <div className="sync-popover-actions">
                {retryableItems.length > 0 && (
                  <button className="sync-force-btn" onClick={e => { e.stopPropagation(); processQueue(); setOpen(false); }}>
                    {t('sync_force_sync')}
                  </button>
                )}
                {failedItems.length > 0 && (
                  <button className="sync-clear-btn" onClick={e => {
                    e.stopPropagation();
                    if (window.confirm(t('sync_confirm_clear', { count: failedItems.length }))) {
                      clearQueue();
                      setOpen(false);
                    }
                  }}>
                    {t('sync_clear_queue')}
                  </button>
                )}
              </div>
            </div>
            {failedItems.length > 0 && (
              <div className="sync-popover-failed-note">
                {t('sync_failed_note', { count: failedItems.length, max: MAX_ATTEMPTS })}
              </div>
            )}
            <ul className="sync-popover-list">
              {pendingItems.map(item => {
                const failed = (item.attempts ?? 0) >= MAX_ATTEMPTS;
                return (
                  <li key={item.id} className={`sync-popover-item${failed ? ' sync-popover-item--failed' : ''}`}>
                    <span className="sync-popover-op">{OP_LABELS[item.operation] ?? item.operation}</span>
                    <span className="sync-popover-table">{TABLE_LABELS[item.table_name] ?? item.table_name}</span>
                    <span className="sync-popover-time">{formatTime(item.createdAt)}</span>
                    {item.attempts > 0 && (
                      <span className="sync-popover-attempts">
                        {failed
                          ? t('sync_failed_mark')
                          : t('sync_attempts', { count: item.attempts })
                        }
                        {item.lastError && <KopieerFout tekst={item.lastError} />}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            {lastSynced && (
              <div className="sync-popover-footer">{t('sync_last_synced', { time: formatTime(lastSynced.toISOString()) })}</div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (syncError) {
    return (
      <SyncFoutIndicator syncError={syncError} label={t('sync_error_label')} />
    );
  }

  // Online en volledig gesynchroniseerd
  return (
    <div className="sync-indicator sync-indicator--online" title={lastSynced ? t('sync_synced_title', { time: formatTime(lastSynced.toISOString()) }) : t('sync_online_title')}>
      <span className="sync-icon">●</span>
      <span className="sync-label">{t('sync_online')}</span>
    </div>
  );
}

function SyncFoutIndicator({ syncError, label }) {
  const [open, setOpen] = useState(false);
  const [gekopieerd, setGekopieerd] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const kopieer = useCallback((e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(syncError).then(() => {
      setGekopieerd(true);
      setTimeout(() => setGekopieerd(false), 2000);
    });
  }, [syncError]);

  return (
    <div className="sync-indicator sync-indicator--error sync-indicator--clickable" ref={ref} onClick={() => setOpen(o => !o)}>
      <span className="sync-icon">!</span>
      <span className="sync-label">{label}</span>
      {open && (
        <div className="sync-popover sync-popover--error">
          <div className="sync-popover-error-tekst">{syncError}</div>
          <button className="sync-copy-btn" onClick={kopieer}>
            {gekopieerd ? '✓ Gekopieerd' : '⎘ Kopieer foutmelding'}
          </button>
        </div>
      )}
    </div>
  );
}

function KopieerFout({ tekst }) {
  const [gekopieerd, setGekopieerd] = useState(false);
  const kopieer = useCallback((e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(tekst).then(() => {
      setGekopieerd(true);
      setTimeout(() => setGekopieerd(false), 2000);
    });
  }, [tekst]);
  return (
    <>
      {' '}— <span className="sync-popover-error-inline" title={tekst}>{tekst.length > 60 ? tekst.slice(0, 60) + '…' : tekst}</span>
      {' '}<button className="sync-copy-inline-btn" onClick={kopieer} title="Kopieer foutmelding">
        {gekopieerd ? '✓' : '⎘'}
      </button>
    </>
  );
}
