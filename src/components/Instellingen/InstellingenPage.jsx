import { useState } from 'react';
import { useSync } from '../../context/SyncContext';
import CloudStatus from './CloudStatus';
import './InstellingenPage.css';

export default function InstellingenPage({ settings, onUpdateSettings, onFullResync }) {
  const { processQueue, syncing, pendingCount, isOnline, lastSynced } = useSync();
  const [resyncing, setResyncing] = useState(false);

  return (
    <div className="page instellingen-page">
      <h2>Instellingen</h2>

      <div className="section">
        <h3>Hulpweergave</h3>
        <div className="section-content">
          <div className="mode-toggle">
            <button
              className={`mode-btn${settings.hulpModus === 'uitgebreid' ? ' active' : ''}`}
              onClick={() => onUpdateSettings({ hulpModus: 'uitgebreid' })}
            >
              Uitgebreid
            </button>
            <button
              className={`mode-btn${settings.hulpModus === 'basis' ? ' active' : ''}`}
              onClick={() => onUpdateSettings({ hulpModus: 'basis' })}
            >
              Basis
            </button>
          </div>
        </div>
      </div>

      <div className="section">
        <h3>Cloud & account</h3>
        <div className="section-content">
          <CloudStatus />
          <div className="sync-controls">
            <button
              className="btn-secondary sync-force-btn"
              onClick={processQueue}
              disabled={syncing || !isOnline || pendingCount === 0}
            >
              {syncing ? 'Synchroniseren...' : `Forceer sync${pendingCount > 0 ? ` (${pendingCount})` : ''}`}
            </button>
            {lastSynced && (
              <span className="sync-last-time">
                Laatste sync: {lastSynced.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            {!isOnline && (
              <span className="sync-offline-note">Offline — sync niet mogelijk</span>
            )}
          </div>
        </div>
      </div>

      <div className="section">
        <h3>Data herstellen</h3>
        <div className="section-content">
          <p className="admin-hint">
            Haal alle vangsten opnieuw op vanuit de cloud. Gebruik dit als de app niet up-to-date lijkt na een synchronisatiefout of na gebruik op een ander apparaat.
          </p>
          <button
            className="btn-secondary sync-force-btn"
            onClick={async () => { setResyncing(true); await onFullResync(); setResyncing(false); }}
            disabled={resyncing || !isOnline}
          >
            {resyncing ? 'Bezig…' : '↺ Herlaad alle data'}
          </button>
          {!isOnline && <span className="sync-offline-note">Offline — niet mogelijk</span>}
        </div>
      </div>

      <div className="section">
        <h3>Standaard ringer</h3>
        <div className="section-content">
          <div className="form-group">
            <label>Volledige naam</label>
            <input
              type="text"
              value={settings.ringerNaam}
              onChange={e => onUpdateSettings({ ringerNaam: e.target.value })}
              placeholder="bijv. Thijs ter Avest"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Initiaal</label>
              <input
                type="text"
                value={settings.ringerInitiaal}
                onChange={e => onUpdateSettings({ ringerInitiaal: e.target.value })}
                placeholder="bijv. TtA"
              />
            </div>
            <div className="form-group">
              <label>Ringernummer</label>
              <input
                type="text"
                value={settings.ringerNummer}
                onChange={e => onUpdateSettings({ ringerNummer: e.target.value })}
                placeholder="bijv. 3254"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
