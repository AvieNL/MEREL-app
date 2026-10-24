import { useState, useRef } from 'react';
import { fetchUserObservations, parseCsv } from '../../lib/observation-api';

const STORAGE_TOKEN_KEY = 'w_obs_token';
const STORAGE_USER_KEY  = 'w_obs_user_id';

export default function WInstellingenPage({ waarnemingen, onImport, onClear }) {
  const [token, setToken]   = useState(() => localStorage.getItem(STORAGE_TOKEN_KEY) ?? '');
  const [userId, setUserId] = useState(() => localStorage.getItem(STORAGE_USER_KEY) ?? '');
  const [showApi, setShowApi] = useState(false);
  const [status, setStatus] = useState(null);
  const [progress, setProgress] = useState(null);
  const [importing, setImporting] = useState(false);
  const fileRef = useRef(null);

  async function handleCsvImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setStatus(null);
    try {
      const text = await file.text();
      const items = parseCsv(text);
      if (items.length === 0) {
        setStatus({ type: 'error', msg: 'Geen waarnemingen gevonden in CSV. Controleer het formaat (puntkomma- of komma-gescheiden).' });
        return;
      }
      const n = await onImport(items);
      setStatus({ type: 'ok', msg: `${n} waarnemingen geïmporteerd uit CSV.` });
    } catch (err) {
      setStatus({ type: 'error', msg: `CSV-fout: ${err.message}` });
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  }

  async function handleClear() {
    if (!window.confirm('Alle lokale waarnemingen verwijderen? Dit kan niet ongedaan worden gemaakt.')) return;
    await onClear();
    setStatus({ type: 'ok', msg: 'Alle waarnemingen verwijderd.' });
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
      const n = await onImport(items);
      setStatus({ type: 'ok', msg: `${n} waarnemingen geïmporteerd via API.` });
    } catch (err) {
      setStatus({ type: 'error', msg: `Importfout: ${err.message}` });
    } finally {
      setImporting(false);
      setProgress(null);
    }
  }

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
        disabled={importing}
      >
        {importing ? 'Bezig…' : 'CSV-bestand kiezen en importeren'}
      </button>

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

      {/* ── Gegevens ── */}
      <p className="w-section-title">Gegevens</p>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
        Lokaal opgeslagen: <strong>{waarnemingen.length}</strong> waarnemingen
      </p>
      <button
        className="btn-danger"
        style={{ width: '100%' }}
        onClick={handleClear}
        disabled={importing || waarnemingen.length === 0}
      >
        Alle waarnemingen wissen
      </button>

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
            onClick={saveCredentials} disabled={importing}>
            Opslaan
          </button>
          <button className="btn-primary" style={{ width: '100%' }}
            onClick={handleApiImport} disabled={importing || !token.trim() || !userId.trim()}>
            {importing ? 'Bezig…' : 'Importeer via API'}
          </button>
          {progress && <div className="w-progress">{progress}</div>}
        </div>
      )}
    </div>
  );
}
