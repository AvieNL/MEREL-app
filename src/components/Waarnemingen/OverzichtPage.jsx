import { useMemo, useState, useRef } from 'react';
import RarityIcon from './RarityIcon';
import { parseCsv } from '../../lib/observation-api';

export default function OverzichtPage({ waarnemingen, onImport }) {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(null);
  const [importStatus, setImportStatus] = useState(null);
  const fileRef = useRef(null);

  async function handleCsvImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportStatus(null);
    setProgress(null);
    try {
      const text = await file.text();
      const items = parseCsv(text);
      if (items.length === 0) {
        setImportStatus({ ok: false, msg: 'Geen waarnemingen gevonden in CSV.' });
        return;
      }
      setProgress(`Uploaden: 0 / ${items.length}…`);
      const n = await onImport(items, (done, total) =>
        setProgress(`Uploaden: ${done} / ${total}…`)
      );
      setImportStatus({ ok: true, msg: `${n} waarnemingen geïmporteerd.` });
    } catch (err) {
      setImportStatus({ ok: false, msg: `Fout: ${err.message}` });
    } finally {
      setImporting(false);
      setProgress(null);
      e.target.value = '';
    }
  }
  const sorted = useMemo(() =>
    [...waarnemingen].sort((a, b) => b.datum.localeCompare(a.datum)),
    [waarnemingen]
  );

  const totaal = waarnemingen.length;
  const soorten = useMemo(() => new Set(waarnemingen.map(w => w.species_name_lat || w.species_name_nl).filter(Boolean)).size, [waarnemingen]);
  const landen = useMemo(() => new Set(waarnemingen.map(w => w.country_code).filter(Boolean)).size, [waarnemingen]);

  const importBtn = onImport && (
    <>
      <input type="file" accept=".csv,.txt" ref={fileRef} style={{ display: 'none' }} onChange={handleCsvImport} />
      <button
        className="btn-secondary"
        style={{ width: '100%', marginBottom: 12 }}
        onClick={() => fileRef.current?.click()}
        disabled={importing}
      >
        {importing ? progress || 'Bezig…' : '+ CSV importeren'}
      </button>
      {importStatus && (
        <p style={{ fontSize: '0.82rem', marginBottom: 12, color: importStatus.ok ? 'var(--success)' : 'var(--danger)' }}>
          {importStatus.msg}
        </p>
      )}
    </>
  );

  if (totaal === 0) {
    return (
      <div className="w-page">
        {importBtn}
        <div className="w-empty">
          <span className="w-empty-icon">🔭</span>
          <p className="w-empty-text">Nog geen waarnemingen geïmporteerd.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-page">
      {importBtn}
      <div className="w-tiles">
        <div className="w-tile">
          <div className="w-tile-value">{totaal.toLocaleString('nl')}</div>
          <div className="w-tile-label">Waarnemingen</div>
        </div>
        <div className="w-tile">
          <div className="w-tile-value">{soorten.toLocaleString('nl')}</div>
          <div className="w-tile-label">Soorten</div>
        </div>
        <div className="w-tile">
          <div className="w-tile-value">{landen}</div>
          <div className="w-tile-label">Landen</div>
        </div>
      </div>

      <p className="w-section-title">Recente waarnemingen</p>

      {sorted.slice(0, 100).map(w => (
        <ObsRow key={w.id} obs={w} />
      ))}

      {sorted.length > 100 && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '12px 0' }}>
          Nog {sorted.length - 100} waarnemingen — gebruik Lifelist of Jaarlijst voor volledig overzicht
        </p>
      )}
    </div>
  );
}

export function ObsRow({ obs }) {
  const datum = obs.datum ? formatDate(obs.datum) : '';

  return (
    <div
      className="w-obs-row"
      style={{ cursor: obs.permalink ? 'pointer' : 'default' }}
      onClick={() => obs.permalink && window.open(obs.permalink, '_blank', 'noopener')}
    >
      <div className="w-obs-main">
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span className="w-obs-name">{obs.species_name_nl || obs.species_name_lat || '?'}</span>
          <RarityIcon rarity={obs.rarity} />
        </div>
        {obs.species_name_lat && obs.species_name_nl && obs.species_name_lat !== obs.species_name_nl && (
          <div className="w-obs-lat">{obs.species_name_lat}</div>
        )}
        {obs.location_name && (
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 1 }}>{obs.location_name}</div>
        )}
      </div>
      <div className="w-obs-meta">
        <span className="w-obs-date">{datum}</span>
        {obs.country_code && (
          <span className="w-obs-country" title={obs.country_code}>
            {countryFlag(obs.country_code)}
          </span>
        )}
        {obs.permalink && <span style={{ fontSize: '0.65rem', color: 'var(--accent)' }}>↗</span>}
      </div>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
}

function countryFlag(code) {
  if (!code || code.length !== 2) return '';
  return String.fromCodePoint(
    ...code.toUpperCase().split('').map(c => 0x1F1E6 + c.charCodeAt(0) - 65)
  );
}
