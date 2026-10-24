import { useState, useRef } from 'react';
import { fetchUserObservations, parseCsv } from '../../lib/observation-api';

const STORAGE_TOKEN_KEY = 'w_obs_token';
const STORAGE_USER_KEY  = 'w_obs_user_id';

export default function WInstellingenPage({ waarnemingen, onImport, onClear }) {
  const [token, setToken]   = useState(() => localStorage.getItem(STORAGE_TOKEN_KEY) ?? '');
  const [userId, setUserId] = useState(() => localStorage.getItem(STORAGE_USER_KEY) ?? '');
  const [status, setStatus] = useState(null);
  const [progress, setProgress] = useState(null);
  const [importing, setImporting] = useState(false);
  const fileRef = useRef(null);

  function saveCredentials() {
    localStorage.setItem(STORAGE_TOKEN_KEY, token.trim());
    localStorage.setItem(STORAGE_USER_KEY, userId.trim());
    setStatus({ type: 'ok', msg: 'Instellingen opgeslagen.' });
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

  async function handleCsvImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setStatus(null);
    try {
      const text = await file.text();
      const items = parseCsv(text);
      if (items.length === 0) {
        setStatus({ type: 'error', msg: 'Geen waarnemingen gevonden in CSV. Controleer het formaat.' });
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

  return (
    <div className="w-page">
      <p className="w-section-title">API-koppeling (observation.org)</p>

      <div className="w-form-group">
        <label className="w-form-label">API-token</label>
        <input
          className="w-form-input"
          type="password"
          value={token}
          onChange={e => setToken(e.target.value)}
          placeholder="Plak hier je API-token"
          autoComplete="off"
        />
        <p className="w-form-hint">
          Te vinden op waarneming.nl → Profiel → API-token. Nooit gedeeld met anderen.
        </p>
      </div>

      <div className="w-form-group">
        <label className="w-form-label">Gebruikers-ID</label>
        <input
          className="w-form-input"
          type="text"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          placeholder="Bijv. 12345"
          inputMode="numeric"
        />
        <p className="w-form-hint">
          Zichtbaar in de URL van je profiel: waarneming.nl/users/<strong>12345</strong>/
        </p>
      </div>

      <button
        className="btn-primary"
        style={{ width: '100%', marginBottom: 10 }}
        onClick={saveCredentials}
        disabled={importing}
      >
        Instellingen opslaan
      </button>

      <button
        className="btn-primary"
        style={{ width: '100%' }}
        onClick={handleApiImport}
        disabled={importing || !token.trim() || !userId.trim()}
      >
        {importing ? 'Bezig met importeren…' : 'Importeer via API'}
      </button>

      {progress && <div className="w-progress">{progress}</div>}

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />

      <p className="w-section-title">CSV-import</p>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
        Exporteer je waarnemingen als CSV via waarneming.nl → Mijn waarnemingen → Exporteren.
        Ondersteunde formaten: waarneming.nl-export (puntkomma-gescheiden) en standard CSV.
      </p>

      <input
        type="file"
        accept=".csv,.txt"
        ref={fileRef}
        style={{ display: 'none' }}
        onChange={handleCsvImport}
      />
      <button
        className="btn-secondary"
        style={{ width: '100%' }}
        onClick={() => fileRef.current?.click()}
        disabled={importing}
      >
        CSV-bestand kiezen
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
    </div>
  );
}
