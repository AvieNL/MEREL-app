import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/index.js';
import { useAuth } from '../../context/AuthContext';
import { useSync } from '../../context/SyncContext';
import { useNestRole } from '../../hooks/useNestRole';
import CloudStatus from './CloudStatus';
import './InstellingenPage.css';

const TALEN = [
  { code: 'nl', key: 'language_nl' },
  { code: 'en', key: 'language_en' },
  { code: 'de', key: 'language_de' },
];

export default function InstellingenPage({ settings, onUpdateSettings, onFullResync }) {
  const { user, profile, updateProfile } = useAuth();
  const { processQueue, syncing, pendingCount, isOnline, lastSynced } = useSync();
  const { hasNestAccess } = useNestRole();
  const { t } = useTranslation(['common', 'forms']);
  const [resyncing, setResyncing] = useState(false);
  const [sovonNr, setSovonNr] = useState(profile?.sovon_registratienummer || '');
  const [sovonSaved, setSovonSaved] = useState(false);

  async function saveSovonNr() {
    const updates = { sovon_registratienummer: sovonNr.trim() || null };
    // Automatisch nestonderzoeker worden bij invullen SOVON-nummer
    // (niet voor admin — die heeft al volledige toegang via ring-rol)
    if (sovonNr.trim() && !profile?.nestkast_rol && profile?.rol !== 'admin') {
      updates.nestkast_rol = 'nestonderzoeker';
    }
    await updateProfile(updates);
    setSovonSaved(true);
    setTimeout(() => setSovonSaved(false), 2000);
  }

  return (
    <div className="page instellingen-page">
      <h2>{t('settings_title')}</h2>

      <div className="section">
        <h3>{t('section_my_data')}</h3>
        <div className="section-content">
          <div className="form-group">
            <label>{t('forms:full_name')}</label>
            <input
              type="text"
              value={settings.ringerNaam}
              onChange={e => onUpdateSettings({ ringerNaam: e.target.value })}
              placeholder={t('forms:full_name_placeholder')}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('forms:initial')}</label>
              <input
                type="text"
                value={settings.ringerInitiaal}
                onChange={e => onUpdateSettings({ ringerInitiaal: e.target.value })}
                placeholder={t('forms:initial_placeholder')}
              />
            </div>
            <div className="form-group">
              <label>{t('forms:ringer_number')}</label>
              <input
                type="text"
                value={settings.ringerNummer}
                onChange={e => onUpdateSettings({ ringerNummer: e.target.value })}
                placeholder={t('forms:ringer_number_placeholder')}
              />
            </div>
          </div>
          {user && (
            <div className="instellingen-account-info">
              <span className="instellingen-account-email">{user.email}</span>
              {profile?.rol && (
                <span className="cloud-status__rol">{t(`role_${profile.rol}`) || profile.rol}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="section">
        <h3>{t('section_ringstation')}</h3>
        <div className="section-content">
          <p className="admin-hint">{t('ringstation_description')}</p>
          <div className="form-row">
            <div className="form-group">
              <label>{t('ringstation_lat')}</label>
              <input
                type="text"
                inputMode="decimal"
                value={settings.ringstationLat}
                onChange={e => onUpdateSettings({ ringstationLat: e.target.value })}
                placeholder="51.8903"
              />
            </div>
            <div className="form-group">
              <label>{t('ringstation_lon')}</label>
              <input
                type="text"
                inputMode="decimal"
                value={settings.ringstationLon}
                onChange={e => onUpdateSettings({ ringstationLon: e.target.value })}
                placeholder="6.4657"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h3>{t('section_nestonderzoek')}</h3>
        <div className="section-content">
          <p className="admin-hint">
            {hasNestAccess
              ? t('nestonderzoek_sovon_hint')
              : t('nestonderzoek_sovon_hint_unlock')}
          </p>
          <div className="form-group">
            <label>{t('nestonderzoek_sovon_nr')}</label>
            <input
              type="text"
              value={sovonNr}
              onChange={e => setSovonNr(e.target.value)}
              placeholder={t('nestonderzoek_sovon_nr_placeholder')}
              onBlur={saveSovonNr}
            />
            {sovonSaved && (
              <span className="instellingen-saved">
                {!hasNestAccess && sovonNr.trim()
                  ? t('nestonderzoek_sovon_activated')
                  : t('btn_saved')}
              </span>
            )}
          </div>
          {hasNestAccess && (
            <p className="admin-hint" style={{ marginTop: 6 }}>
              {t('nestonderzoek_rol_label')}: <strong>
                {profile?.rol === 'admin'
                  ? t('nestonderzoek_rol_admin')
                  : (profile?.nestkast_rol || '—')}
              </strong>
            </p>
          )}
        </div>
      </div>

      <div className="section">
        <h3>{t('section_help_display')}</h3>
        <div className="section-content">
          <p className="admin-hint">{t('help_display_description')}</p>
          <div className="mode-toggle">
            <button
              className={`mode-btn${settings.hulpModus === 'uitgebreid' ? ' active' : ''}`}
              onClick={() => onUpdateSettings({ hulpModus: 'uitgebreid' })}
            >
              {t('mode_extended')}
            </button>
            <button
              className={`mode-btn${settings.hulpModus === 'basis' ? ' active' : ''}`}
              onClick={() => onUpdateSettings({ hulpModus: 'basis' })}
            >
              {t('mode_basic')}
            </button>
          </div>
        </div>
      </div>

      <div className="section">
        <h3>{t('section_language')}</h3>
        <div className="section-content">
          <div className="mode-toggle">
            {TALEN.map(taal => (
              <button
                key={taal.code}
                className={`mode-btn${i18n.language === taal.code ? ' active' : ''}`}
                onClick={() => i18n.changeLanguage(taal.code)}
              >
                {t(taal.key)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <h3>{t('section_sync')}</h3>
        <div className="section-content">
          <CloudStatus />
          <div className="sync-acties">
            <div className="sync-actie">
              <div className="sync-actie-tekst">
                <strong>{t('sync_send_title')} <span className="sync-label">{t('sync_send_label')}</span></strong>
                <span>{t('sync_send_description')}</span>
              </div>
              <div className="sync-actie-controls">
                <button
                  className="btn-secondary sync-force-btn"
                  onClick={processQueue}
                  disabled={syncing || !isOnline || pendingCount === 0}
                >
                  {syncing
                    ? t('btn_syncing')
                    : pendingCount > 0 ? t('btn_send_count', { count: pendingCount }) : t('btn_send')
                  }
                </button>
                {lastSynced && (
                  <span className="sync-last-time">
                    {t('last_sync_time', { time: lastSynced.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }) })}
                  </span>
                )}
              </div>
            </div>
            <div className="sync-actie">
              <div className="sync-actie-tekst">
                <strong>{t('sync_pull_title')} <span className="sync-label">{t('sync_pull_label')}</span></strong>
                <span>{t('sync_pull_description')}</span>
              </div>
              <div className="sync-actie-controls">
                <button
                  className="btn-secondary sync-force-btn"
                  onClick={async () => { setResyncing(true); await onFullResync(); setResyncing(false); }}
                  disabled={resyncing || !isOnline}
                >
                  {resyncing ? t('btn_busy') : t('btn_reload_data')}
                </button>
              </div>
            </div>
            {!isOnline && <span className="sync-offline-note">{t('offline_sync_impossible')}</span>}
          </div>
        </div>
      </div>

    </div>
  );
}
