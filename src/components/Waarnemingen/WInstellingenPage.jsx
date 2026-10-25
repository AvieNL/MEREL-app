import { useState, useRef } from 'react';
import { fetchUserObservations, parseCsv } from '../../lib/observation-api';
import { getEbirdKey, setEbirdKey, clearEbirdCache } from '../../lib/ebird-api';

const STORAGE_TOKEN_KEY = 'w_obs_token';
const STORAGE_USER_KEY  = 'w_obs_user_id';

export default function WInstellingenPage({ waarnemingen, onImport, onClear, onSync }) {
  const [token, setToken]   = useState(() => localStorage.getItem(STORAGE_TOKEN_KEY) ?? '');
  const [userId, setUserId] = useState(() => localStorage.getItem(STORAGE_USER_KEY) ?? '');
  const [ebirdKey, setEbirdKeyState] = useState(() => getEbirdKey());
  const [showApi, setShowApi] = useState(false);
  const [status, setStatus] = useState(null);
  const [progress, setProgress] = useState(null);
  const [importing, setImporting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const fileRef = useRef(null);

  async function handleCsvImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setStatus(null);
    setProgress(null);
    try {
      const text = await file.text();
      const items = parseCsv(text);
      if (items.length === 0) {
        setStatus({ type: 'error', msg: 'Geen waarnemingen gevonden in CSV. Controleer het formaat (puntkomma- of komma-gescheiden).' });
        return;
      }
      setProgress(`Uploaden naar cloud: 0 / ${items.length}…`);
      const n = await onImport(items, (done, total) =>
        setProgress(`Uploaden naar cloud: ${done} / ${total}…`)
      );
      setStatus({ type: 'ok', msg: `${n} waarnemingen geïmporteerd en opgeslagen in de cloud.` });
    } catch (err) {
      setStatus({ type: 'error', msg: `Importfout: ${err.message}` });
    } finally {
      setImporting(false);
      setProgress(null);
      e.target.value = '';
    }
  }

  async function handleClear() {
    if (!window.confirm('Alle waarnemingen verwijderen uit de cloud én op dit apparaat? Dit kan niet ongedaan worden gemaakt.')) return;
    setImporting(true);
    try {
      await onClear();
      setStatus({ type: 'ok', msg: 'Alle waarnemingen verwijderd.' });
    } catch (err) {
      setStatus({ type: 'error', msg: `Verwijderen mislukt: ${err.message}` });
    } finally {
      setImporting(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    setStatus(null);
    try {
      const n = await onSync();
      setStatus({ type: 'ok', msg: n > 0 ? `${n} waarnemingen gesynchroniseerd van cloud.` : 'Cloud is leeg — importeer eerst een CSV.' });
    } catch (err) {
      setStatus({ type: 'error', msg: `Synchronisatie mislukt: ${err.message}` });
    } finally {
      setSyncing(false);
    }
  }

  function saveCredentials() {
    localStorage.setItem(STORAGE_TOKEN_KEY, token.trim());
    localStorage.setItem(STORAGE_USER_KEY, userId.trim());
    setStatus({ type: 'ok', msg: 'API-instellingen opgeslagen.' });
  }

  async function handleApiImport() {
    const t = token.trim();
    const u = userId.trim();
    if (!t || !u) {
      setStatus({ type: 'error', msg: 'Vul je API-token én gebruikers-ID in.' });
      return;
    }
    saveCredentials();
    setImporting(true);
    setProgress(null);
    setStatus(null);
    try {
      const items = await fetchUserObservations({
        token: t,
        observerId: u,
        onProgress: ({ fetched, total, page }) =>
          setProgress(`Pagina ${page} — ${fetched}${total ? ` / ${total}` : ''} waarnemingen opgehaald…`),
      });
      setProgress(`Uploaden naar cloud: 0 / ${items.length}…`);
      const n = await onImport(items, (done, total) =>
        setProgress(`Uploaden naar cloud: ${done} / ${total}…`)
      );
      setStatus({ type: 'ok', msg: `${n} waarnemingen geïmporteerd via API en opgeslagen in de cloud.` });
    } catch (err) {
      setStatus({ type: 'error', msg: `Importfout: ${err.message}` });
    } finally {
      setImporting(false);
      setProgress(null);
    }
  }

  const busy = importing || syncing;

  return (
    <div className="w-page">

      {/* ── CSV-import (primair) ── */}
      <p className="w-section-title">Importeren via CSV</p>

      <div style={{
        background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
        border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
        borderRadius: 'var(--radius)',
        padding: '12px 14px',
        marginBottom: 16,
        fontSize: '0.82rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.6,
      }}>
        <strong style={{ color: 'var(--text-primary)' }}>Hoe exporteer je je waarnemingen?</strong>
        <ol style={{ margin: '8px 0 0', paddingLeft: 18 }}>
          <li>Log in op <strong>waarneming.nl</strong></li>
          <li>Ga naar <strong>Mijn waarnemingen</strong> (klik op je profielnaam → Mijn waarnemingen)</li>
          <li>Scroll helemaal naar beneden</li>
          <li>Klik op <strong>Download als CSV</strong> of <strong>Exporteren</strong></li>
          <li>Importeer het gedownloade bestand hieronder</li>
        </ol>
      </div>

      <input
        type="file"
        accept=".csv,.txt"
        ref={fileRef}
        style={{ display: 'none' }}
        onChange={handleCsvImport}
      />
      <button
        className="btn-primary"
        style={{ width: '100%' }}
        onClick={() => fileRef.current?.click()}
        disabled={busy}
      >
        {importing ? 'Bezig…' : 'CSV-bestand kiezen en importeren'}
      </button>

      {progress && (
        <div style={{
          marginTop: 10, padding: '8px 12px', borderRadius: 'var(--radius)',
          background: 'var(--bg-secondary)', fontSize: '0.8rem', color: 'var(--text-muted)',
        }}>
          {progress}
        </div>
      )}

      {status && (
        <div style={{
          marginTop: 14,
          padding: '10px 14px',
          borderRadius: 'var(--radius)',
          background: status.type === 'ok'
            ? 'color-mix(in srgb, var(--success) 15%, transparent)'
            : 'color-mix(in srgb, var(--danger, #ef4444) 15%, transparent)',
          color: status.type === 'ok' ? 'var(--success)' : 'var(--danger, #ef4444)',
          fontSize: '0.85rem',
          border: `1px solid ${status.type === 'ok' ? 'var(--success)' : 'var(--danger, #ef4444)'}`,
        }}>
          {status.msg}
        </div>
      )}

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />

      {/* ── Cloud-synchronisatie ── */}
      <p className="w-section-title">Cloud</p>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
        Waarnemingen worden automatisch opgeslagen in de cloud (Supabase) en zijn daarna
        op elk ingelogd apparaat beschikbaar. Op een nieuw apparaat worden ze bij het
        openen van de Waarnemingen-module automatisch opgehaald.
      </p>
      <button
        className="btn-secondary"
        style={{ width: '100%' }}
        onClick={handleSync}
        disabled={busy}
      >
        {syncing ? 'Synchroniseren…' : 'Nu synchroniseren van cloud'}
      </button>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />

      {/* ── Gegevens ── */}
      <p className="w-section-title">Gegevens</p>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
        Lokaal gecached: <strong>{waarnemingen.length}</strong> waarnemingen
      </p>
      <button
        className="btn-danger"
        style={{ width: '100%' }}
        onClick={handleClear}
        disabled={busy || waarnemingen.length === 0}
      >
        Alle waarnemingen wissen (cloud + lokaal)
      </button>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />

      {/* ── eBird checklist ── */}
      <p className="w-section-title">Volledigheid per land (eBird)</p>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
        Met een gratis eBird API-sleutel zie je per land hoeveel procent van de soorten je al hebt gezien.
        Vraag een sleutel aan via <strong>ebird.org/api/keygen</strong> (gratis account vereist).
      </p>
      <div className="w-form-group">
        <label className="w-form-label">eBird API-sleutel</label>
        <input
          className="w-form-input"
          type="password"
          value={ebirdKey}
          onChange={e => setEbirdKeyState(e.target.value)}
          placeholder="Bijv. jce2r5xxxxxxxx"
          autoComplete="off"
        />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className="btn-secondary"
          style={{ flex: 1 }}
          onClick={() => {
            setEbirdKey(ebirdKey);
            clearEbirdCache();
            setStatus({ type: 'ok', msg: 'eBird API-sleutel opgeslagen. Cache gewist.' });
          }}
        >
          Opslaan
        </button>
        {ebirdKey && (
          <button
            className="btn-danger"
            onClick={() => {
              setEbirdKeyState('');
              setEbirdKey('');
              clearEbirdCache();
              setStatus({ type: 'ok', msg: 'eBird API-sleutel verwijderd.' });
            }}
          >
            Verwijderen
          </button>
        )}
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />

      {/* ── API (geavanceerd, inklapbaar) ── */}
      <button
        onClick={() => setShowApi(v => !v)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: '0.78rem', padding: 0,
          display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        <span>{showApi ? '▲' : '▼'}</span>
        <span>Geavanceerd: API-import (partners)</span>
      </button>

      {showApi && (
        <div style={{ marginTop: 14 }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.5 }}>
            API-toegang is alleen beschikbaar voor partners van observation.org.
            Neem contact op via <strong>info@observation.org</strong> als je partner bent of wilt worden.
          </p>
          <div className="w-form-group">
            <label className="w-form-label">API-token</label>
            <input className="w-form-input" type="password" value={token}
              onChange={e => setToken(e.target.value)} placeholder="Token" autoComplete="off" />
          </div>
          <div className="w-form-group">
            <label className="w-form-label">Gebruikers-ID</label>
            <input className="w-form-input" type="text" value={userId}
              onChange={e => setUserId(e.target.value)} placeholder="Bijv. 12345" inputMode="numeric" />
            <p className="w-form-hint">Zichtbaar in de URL: waarneming.nl/users/<strong>12345</strong>/</p>
          </div>
          <button className="btn-secondary" style={{ width: '100%', marginBottom: 8 }}
            onClick={saveCredentials} disabled={busy}>
            Opslaan
          </button>
          <button className="btn-primary" style={{ width: '100%' }}
            onClick={handleApiImport} disabled={busy || !token.trim() || !userId.trim()}>
            {importing ? 'Bezig…' : 'Importeer via API'}
          </button>
          {progress && <div className="w-progress">{progress}</div>}
        </div>
      )}
    </div>
  );
}
