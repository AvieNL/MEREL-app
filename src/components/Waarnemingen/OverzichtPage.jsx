import { useMemo, useState, useRef } from 'react';
import RarityIcon from './RarityIcon';
import { parseCsv } from '../../lib/observation-api';

export default function OverzichtPage({ waarnemingen, onImport }) {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(null);
  const [importStatus, setImportStatus] = useState(null);
  const fileRef = useRef(null);

  const [zoek, setZoek] = useState('');

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

  const totaal = waarnemingen.length;
  const soorten = useMemo(() => new Set(waarnemingen.map(w => w.species_name_lat || w.species_name_nl).filter(Boolean)).size, [waarnemingen]);
  const landen = useMemo(() => new Set(waarnemingen.map(w => w.country_code).filter(Boolean)).size, [waarnemingen]);

  const filtered = useMemo(() => {
    let list = [...waarnemingen].sort((a, b) => b.datum.localeCompare(a.datum));
    const q = zoek.trim().toLowerCase();
    if (q) {
      list = list.filter(w =>
        (w.species_name_nl || '').toLowerCase().includes(q) ||
        (w.species_name_lat || '').toLowerCase().includes(q) ||
        (w.location_name || '').toLowerCase().includes(q) ||
        (w.country_code || '').toLowerCase().includes(q) ||
        (w.province || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [waarnemingen, zoek]);

  const hasFilter = !!zoek.trim();

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

      {/* ── Filters ── */}
      <input
        className="w-search"
        type="search"
        placeholder="Zoek soort of locatie…"
        value={zoek}
        onChange={e => setZoek(e.target.value)}
      />

      <p className="w-section-title">
        {hasFilter ? `${filtered.length.toLocaleString('nl')} resultaten` : 'Recente waarnemingen'}
      </p>

      {filtered.slice(0, 200).map(w => (
        <ObsRow key={w.id} obs={w} />
      ))}

      {filtered.length > 200 && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '12px 0' }}>
          {filtered.length - 200} meer — verfijn je filter
        </p>
      )}

      {filtered.length === 0 && hasFilter && (
        <div className="w-empty">
          <p className="w-empty-text">Geen waarnemingen gevonden.</p>
        </div>
      )}
    </div>
  );
}

export function ObsRow({ obs }) {
  return (
    <div
      className="w-obs-row w-obs-row--compact"
      style={{ cursor: obs.permalink ? 'pointer' : 'default' }}
      onClick={() => obs.permalink && window.open(obs.permalink, '_blank', 'noopener')}
    >
      <span className="w-obs-flag">{countryFlag(obs.country_code)}</span>
      <span className="w-obs-name">{obs.species_name_nl || obs.species_name_lat || '?'}</span>
      <RarityIcon rarity={obs.rarity} />
      {obs.location_name && (
        <span className="w-obs-loc">{obs.location_name}</span>
      )}
      <span className="w-obs-date w-obs-date--push">{obs.datum ? formatDate(obs.datum) : ''}</span>
      {obs.permalink && <span className="w-obs-link">↗</span>}
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y.slice(2)}`;
}

function countryFlag(code) {
  if (!code || code.length !== 2) return '';
  return String.fromCodePoint(
    ...code.toUpperCase().split('').map(c => 0x1F1E6 + c.charCodeAt(0) - 65)
  );
}
