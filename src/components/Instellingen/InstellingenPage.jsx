import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSync } from '../../context/SyncContext';
import CloudStatus from './CloudStatus';
import './InstellingenPage.css';

const ROL_LABEL = { admin: 'Admin', ringer: 'Ringer', viewer: 'Viewer' };

export default function InstellingenPage({ settings, onUpdateSettings, onFullResync }) {
  const { user, profile } = useAuth();
  const { processQueue, syncing, pendingCount, isOnline, lastSynced } = useSync();
  const [resyncing, setResyncing] = useState(false);

  return (
    <div className="page instellingen-page">
      <h2>Instellingen</h2>

      <div className="section">
        <h3>Mijn gegevens</h3>
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
          {user && (
            <div className="instellingen-account-info">
              <span className="instellingen-account-email">{user.email}</span>
              {profile?.rol && (
                <span className="cloud-status__rol">{ROL_LABEL[profile.rol] || profile.rol}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="section">
        <h3>Hulpweergave</h3>
        <div className="section-content">
          <p className="admin-hint">
            Uitgebreid toont hulpinformatie in het invoerformulier: soortinfo, seizoensleeftijden bij rui en uitleg bij EURING-codes. Basis verbergt dit voor een rustiger formulier.
          </p>
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
        <h3>Synchronisatie</h3>
        <div className="section-content">
          <CloudStatus />
          <div className="sync-acties">
            <div className="sync-actie">
              <div className="sync-actie-tekst">
                <strong>Wijzigingen versturen <span className="sync-label">(sync)</span></strong>
                <span>Stuurt lokale wijzigingen die nog niet zijn gesynchroniseerd naar de cloud. Gebeurt normaal automatisch zodra je internet hebt.</span>
              </div>
              <div className="sync-actie-controls">
                <button
                  className="btn-secondary sync-force-btn"
                  onClick={processQueue}
                  disabled={syncing || !isOnline || pendingCount === 0}
                >
                  {syncing ? 'Synchroniseren...' : `Verstuur${pendingCount > 0 ? ` (${pendingCount})` : ''}`}
                </button>
                {lastSynced && (
                  <span className="sync-last-time">
                    Laatste sync: {lastSynced.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            </div>
            <div className="sync-actie">
              <div className="sync-actie-tekst">
                <strong>Gegevens ophalen <span className="sync-label">(pull)</span></strong>
                <span>Haalt alle vangsten opnieuw op vanuit de cloud. Gebruik dit als de app niet up-to-date lijkt na een synchronisatiefout of gebruik op een ander apparaat.</span>
              </div>
              <div className="sync-actie-controls">
                <button
                  className="btn-secondary sync-force-btn"
                  onClick={async () => { setResyncing(true); await onFullResync(); setResyncing(false); }}
                  disabled={resyncing || !isOnline}
                >
                  {resyncing ? 'Bezig…' : '↺ Herlaad alle data'}
                </button>
              </div>
            </div>
            {!isOnline && <span className="sync-offline-note">Offline — synchronisatie niet mogelijk</span>}
          </div>
        </div>
      </div>

    </div>
  );
}
