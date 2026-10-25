import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/index.js';
import { useAuth } from '../../context/AuthContext';
import { useSync } from '../../context/SyncContext';
import { useNestRole } from '../../hooks/useNestRole';
import { pullNestData } from '../../hooks/useNestSync';
import { useProjects } from '../../hooks/useProjects';
import { db } from '../../lib/db';
import { supabase } from '../../lib/supabase';
import { getEbirdKey, setEbirdKey, clearEbirdCache } from '../../lib/ebird-api';
import { useWaarnemingen } from '../../hooks/useWaarnemingen';
import { parseCsv } from '../../lib/observation-api';
import CloudStatus from './CloudStatus';
import './InstellingenPage.css';

const TALEN = [
  { code: 'nl', key: 'language_nl' },
  { code: 'en', key: 'language_en' },
  { code: 'de', key: 'language_de' },
];

export default function InstellingenPage({ settings, onUpdateSettings, onFullResync }) {
  const { user, profile, updateProfile } = useAuth();
  const { processQueue, clearQueue, resetQueue, syncing, pendingCount, pendingItems, isOnline, lastSynced } = useSync();
  const { hasNestAccess } = useNestRole();
  const { projects } = useProjects();
  const { t } = useTranslation(['common', 'forms']);
  const [resyncing, setResyncing] = useState(false);
  const [nestPushing, setNestPushing] = useState(false);
  const [nestPushResult, setNestPushResult] = useState(null);
  const [sovonNr, setSovonNr] = useState(profile?.sovon_registratienummer || '');
  const [sovonSaved, setSovonSaved] = useState(false);
  const [ebirdKeyVal, setEbirdKeyVal] = useState(() => profile?.ebird_key || getEbirdKey());
  const [ebirdSaved, setEbirdSaved] = useState(false);
  const { waarnemingen, syncFromSupabase, importWaarnemingen, clearAllWaarnemingen } = useWaarnemingen();
  const [wSyncing, setWSyncing] = useState(false);
  const [wImporting, setWImporting] = useState(false);
  const [wProgress, setWProgress] = useState(null);
  const [wStatus, setWStatus] = useState(null);
  const wFileRef = useRef(null);

  async function pushNestData() {
    if (!user) return;
    setNestPushing(true);
    setNestPushResult(null);
    try {
      const [nesten, legsels, bezoeken, ringen] = await Promise.all([
        db.nest.toArray(),
        db.legsel.toArray(),
        db.nestbezoek.toArray(),
        db.nestring.toArray(),
      ]);
      const results = await Promise.all([
        nesten.length   ? supabase.from('nest').upsert(nesten,      { onConflict: 'id' }) : null,
        legsels.length  ? supabase.from('legsel').upsert(legsels,   { onConflict: 'id' }) : null,
        bezoeken.length ? supabase.from('nestbezoek').upsert(bezoeken, { onConflict: 'id' }) : null,
        ringen.length   ? supabase.from('nestring').upsert(ringen,  { onConflict: 'id' }) : null,
      ]);
      const fout = results.find(r => r?.error)?.error;
      if (fout) {
        setNestPushResult({ ok: false, bericht: fout.message });
      } else {
        setNestPushResult({ ok: true, bericht: `${nesten.length} nesten · ${legsels.length} legsels · ${bezoeken.length} bezoeken gesynchroniseerd` });
      }
    } catch (e) {
      setNestPushResult({ ok: false, bericht: e.message });
    } finally {
      setNestPushing(false);
    }
  }

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

  async function handleWCsvImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setWImporting(true);
    setWStatus(null);
    setWProgress(null);
    try {
      const text = await file.text();
      const items = parseCsv(text);
      if (items.length === 0) {
        setWStatus({ ok: false, msg: 'Geen waarnemingen gevonden in CSV.' });
        return;
      }
      setWProgress(`Uploaden: 0 / ${items.length}…`);
      const n = await importWaarnemingen(items, (done, total) =>
        setWProgress(`Uploaden: ${done} / ${total}…`)
      );
      setWStatus({ ok: true, msg: `${n} waarnemingen geïmporteerd.` });
    } catch (err) {
      setWStatus({ ok: false, msg: `Fout: ${err.message}` });
    } finally {
      setWImporting(false);
      setWProgress(null);
      e.target.value = '';
    }
  }

  async function handleWSync() {
    setWSyncing(true);
    setWStatus(null);
    try {
      const n = await syncFromSupabase();
      setWStatus({ ok: true, msg: n > 0 ? `${n} waarnemingen opgehaald van cloud.` : 'Cloud is leeg — importeer eerst een CSV.' });
    } catch (err) {
      setWStatus({ ok: false, msg: `Synchronisatie mislukt: ${err.message}` });
    } finally {
      setWSyncing(false);
    }
  }

  async function handleWClear() {
    if (!window.confirm('Alle waarnemingen verwijderen uit de cloud én op dit apparaat?')) return;
    setWImporting(true);
    try {
      await clearAllWaarnemingen();
      setWStatus({ ok: true, msg: 'Alle waarnemingen verwijderd.' });
    } catch (err) {
      setWStatus({ ok: false, msg: `Verwijderen mislukt: ${err.message}` });
    } finally {
      setWImporting(false);
    }
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
            <>
              <p className="admin-hint" style={{ marginTop: 6 }}>
                {t('nestonderzoek_rol_label')}: <strong>
                  {profile?.rol === 'admin'
                    ? t('nestonderzoek_rol_admin')
                    : (profile?.nestkast_rol || '—')}
                </strong>
              </p>
              <div className="form-group" style={{ marginTop: 12 }}>
                <label>{t('nestonderzoek_project_label')}</label>
                <select
                  value={settings.nestProject || ''}
                  onChange={e => onUpdateSettings({ nestProject: e.target.value })}
                >
                  <option value="">— {t('nestonderzoek_project_geen')} —</option>
                  {projects.filter(p => p.actief !== false).map(p => (
                    <option key={p.id} value={p.naam}>{p.naam}</option>
                  ))}
                </select>
                <span className="form-hint">{t('nestonderzoek_project_hint')}</span>
              </div>
            </>
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
        <h3>eBird</h3>
        <div className="section-content">
          <p className="admin-hint">
            Met een gratis eBird API-sleutel zie je per land hoeveel procent van de soorten je al hebt gezien
            in de Waarnemingen-module. Vraag een sleutel aan via <strong>ebird.org/api/keygen</strong>.
          </p>
          <div className="form-group">
            <label>API-sleutel</label>
            <input
              type="password"
              value={ebirdKeyVal}
              onChange={e => setEbirdKeyVal(e.target.value)}
              placeholder="Bijv. jce2r5xxxxxxxx"
              autoComplete="off"
              style={{ fontFamily: 'inherit' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn-secondary"
              onClick={async () => {
                setEbirdKey(ebirdKeyVal);
                clearEbirdCache();
                try { await updateProfile({ ebird_key: ebirdKeyVal.trim() }); } catch { /* ignore */ }
                setEbirdSaved(true);
                setTimeout(() => setEbirdSaved(false), 2000);
              }}
            >
              Opslaan
            </button>
            {ebirdKeyVal && (
              <button
                className="btn-secondary"
                onClick={async () => {
                  setEbirdKeyVal('');
                  setEbirdKey('');
                  clearEbirdCache();
                  try { await updateProfile({ ebird_key: '' }); } catch { /* ignore */ }
                }}
              >
                Verwijderen
              </button>
            )}
            {ebirdSaved && <span className="instellingen-saved">Opgeslagen</span>}
          </div>
        </div>
      </div>

      <div className="section">
        <h3>Waarnemingen</h3>
        <div className="section-content">
          <p className="admin-hint">
            Gecached op dit apparaat: <strong>{(waarnemingen?.length ?? 0).toLocaleString('nl')}</strong> waarnemingen.
            Importeer een CSV-export van waarneming.nl of synchroniseer vanuit de cloud.
          </p>
          <input type="file" accept=".csv,.txt" ref={wFileRef} style={{ display: 'none' }} onChange={handleWCsvImport} />
          <div className="sync-acties">
            <div className="sync-actie">
              <div className="sync-actie-tekst">
                <strong>CSV importeren</strong>
                <span>Exporteer je waarnemingen op waarneming.nl en importeer het bestand hier.</span>
              </div>
              <div className="sync-actie-controls">
                <button className="btn-secondary sync-force-btn" onClick={() => wFileRef.current?.click()} disabled={wImporting || wSyncing}>
                  {wImporting ? 'Bezig…' : 'CSV kiezen'}
                </button>
              </div>
            </div>
            <div className="sync-actie">
              <div className="sync-actie-tekst">
                <strong>Ophalen van cloud</strong>
                <span>Haal eerder geïmporteerde waarnemingen op vanuit Supabase.</span>
              </div>
              <div className="sync-actie-controls">
                <button className="btn-secondary sync-force-btn" onClick={handleWSync} disabled={wImporting || wSyncing}>
                  {wSyncing ? 'Synchroniseren…' : 'Nu synchroniseren'}
                </button>
              </div>
            </div>
            <div className="sync-actie">
              <div className="sync-actie-tekst">
                <strong>Alles wissen</strong>
                <span>Verwijdert alle waarnemingen uit de cloud én lokaal.</span>
              </div>
              <div className="sync-actie-controls">
                <button className="btn-secondary sync-force-btn" onClick={handleWClear} disabled={wImporting || wSyncing || !(waarnemingen?.length)}>
                  Wissen
                </button>
              </div>
            </div>
          </div>
          {wProgress && <p className="sync-last-time" style={{ marginTop: 8 }}>{wProgress}</p>}
          {wStatus && (
            <p style={{ marginTop: 8, fontSize: '0.82rem', color: wStatus.ok ? 'var(--success)' : 'var(--danger)' }}>
              {wStatus.msg}
            </p>
          )}
        </div>
      </div>

      <div className="section">
        <h3>{t('section_sync')}</h3>
        <div className="section-content">
          <CloudStatus />

          {/* Vastgelopen items */}
          {(() => {
            const vastgelopen = (pendingItems || []).filter(i => (i.attempts || 0) > 0);
            if (vastgelopen.length === 0) return null;
            return (
              <div className="sync-vastgelopen">
                <div className="sync-vastgelopen__header">
                  <span className="sync-vastgelopen__titel">
                    ⚠ {vastgelopen.length} vastgelopen {vastgelopen.length === 1 ? 'item' : 'items'}
                  </span>
                  <button
                    className="btn-primary btn-xs"
                    onClick={resetQueue}
                    disabled={syncing || !isOnline}
                    title="Reset pogingen en probeer opnieuw"
                  >
                    Opnieuw proberen
                  </button>
                </div>
                <div className="sync-vastgelopen__lijst">
                  {vastgelopen.map(item => (
                    <div key={item.id} className="sync-vastgelopen__item">
                      <span className="sync-vastgelopen__label">{item.label || item.table_name}</span>
                      <span className="sync-vastgelopen__pogingen">
                        poging {item.attempts}/5
                        {item.nextRetryAt && item.nextRetryAt > Date.now() && (
                          <> · volgende over {Math.ceil((item.nextRetryAt - Date.now()) / 1000)}s</>
                        )}
                      </span>
                      {item.lastError && (
                        <span className="sync-vastgelopen__fout">{item.lastError}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

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
                  onClick={async () => { setResyncing(true); await Promise.all([onFullResync(), pullNestData()]); setResyncing(false); }}
                  disabled={resyncing || !isOnline}
                >
                  {resyncing ? t('btn_busy') : t('btn_reload_data')}
                </button>
              </div>
            </div>
            {hasNestAccess && (
              <div className="sync-actie">
                <div className="sync-actie-tekst">
                  <strong>Nestkastdata forceer-push</strong>
                  <span>Stuurt alle lokale nestkastdata opnieuw naar Supabase. Gebruik dit als nesten/legsels/bezoeken ontbreken in de cloud.</span>
                </div>
                <div className="sync-actie-controls">
                  <button
                    className="btn-secondary sync-force-btn"
                    onClick={pushNestData}
                    disabled={nestPushing || !isOnline}
                  >
                    {nestPushing ? t('btn_busy') : '↑ Push nestkastdata'}
                  </button>
                </div>
                {nestPushResult && (
                  <span className={nestPushResult.ok ? 'sync-push-ok' : 'sync-push-fout'}>
                    {nestPushResult.ok ? '✓ ' : '✕ '}{nestPushResult.bericht}
                  </span>
                )}
              </div>
            )}
            <div className="sync-actie">
              <div className="sync-actie-tekst">
                <strong>Wachtrij wissen</strong>
                <span>Verwijdert alle wachtende items uit de sync-wachtrij. Gebruik dit als er vastgelopen items in staan die niet meer verstuurd hoeven te worden.</span>
              </div>
              <div className="sync-actie-controls">
                <button
                  className="btn-secondary sync-force-btn"
                  onClick={clearQueue}
                  disabled={pendingCount === 0}
                >
                  {pendingCount > 0 ? `Wis ${pendingCount} items` : 'Wachtrij leeg'}
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
