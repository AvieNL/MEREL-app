import { useState, useRef, useEffect } from 'react';
import { useSync } from '../../context/SyncContext';
import './SyncIndicator.css';

const OP_LABELS = {
  upsert:                   'Opslaan',
  delete:                   'Verwijderen',
  soft_delete:              'Verwijderen',
  restore:                  'Herstellen',
  batch_upsert:             'Batch opslaan',
  mark_uploaded:            'Upload markeren',
  species_override_upsert:  'Soortwijziging',
  species_override_delete:  'Soortwijziging verw.',
  profile_update:           'Profiel bijwerken',
};

const TABLE_LABELS = {
  vangsten:         'vangst',
  species_overrides:'soortoverride',
  profiles:         'profiel',
};

function formatTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function SyncIndicator() {
  const { pendingCount, pendingItems, syncing, isOnline, syncError, lastSynced, processQueue } = useSync();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

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
      <div className="sync-indicator sync-indicator--offline" title="Geen internetverbinding — wijzigingen worden lokaal opgeslagen">
        <span className="sync-icon">⊘</span>
        <span className="sync-label">Offline</span>
      </div>
    );
  }

  if (syncing) {
    return (
      <div className="sync-indicator sync-indicator--syncing" title="Bezig met synchroniseren...">
        <span className="sync-spinner" />
        <span className="sync-label">Bezig…</span>
      </div>
    );
  }

  if (pendingCount > 0) {
    return (
      <div className="sync-indicator sync-indicator--pending sync-indicator--clickable" ref={ref} onClick={() => setOpen(o => !o)}>
        <span className="sync-icon">↑</span>
        <span className="sync-badge">{pendingCount > 9 ? '9+' : pendingCount}</span>
        <span className="sync-label">wacht</span>
        {open && (
          <div className="sync-popover">
            <div className="sync-popover-header">
              <strong>{pendingCount} item{pendingCount !== 1 ? 's' : ''} in wachtrij</strong>
              <button className="sync-force-btn" onClick={e => { e.stopPropagation(); processQueue(); setOpen(false); }}>
                ↑ Nu synchroniseren
              </button>
            </div>
            <ul className="sync-popover-list">
              {pendingItems.map(item => (
                <li key={item.id} className="sync-popover-item">
                  <span className="sync-popover-op">{OP_LABELS[item.operation] ?? item.operation}</span>
                  <span className="sync-popover-table">{TABLE_LABELS[item.table_name] ?? item.table_name}</span>
                  <span className="sync-popover-time">{formatTime(item.createdAt)}</span>
                  {item.attempts > 0 && (
                    <span className="sync-popover-attempts" title={item.lastError}>
                      {item.attempts}× geprobeerd{item.lastError ? ` — ${item.lastError}` : ''}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {lastSynced && (
              <div className="sync-popover-footer">Laatste sync: {formatTime(lastSynced.toISOString())}</div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (syncError) {
    return (
      <div className="sync-indicator sync-indicator--error" title={syncError}>
        <span className="sync-icon">!</span>
        <span className="sync-label">Fout</span>
      </div>
    );
  }

  // Online en volledig gesynchroniseerd
  return (
    <div className="sync-indicator sync-indicator--online" title={lastSynced ? `Gesynchroniseerd om ${formatTime(lastSynced.toISOString())}` : 'Online — data gesynchroniseerd met server'}>
      <span className="sync-icon">●</span>
      <span className="sync-label">Online</span>
    </div>
  );
}
