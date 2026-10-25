import { useMemo, useState } from 'react';
import { useRecords } from '../../hooks/useRecords';
import { countryFlag, formatDate } from './utils';
import SoortDetailPanel from './SoortDetailPanel';

export default function LifelistPage({ waarnemingen }) {
  const [query, setQuery] = useState('');
  const [selectedKey, setSelectedKey] = useState(null);
  const { records } = useRecords();

  // Build set of EURING codes from ring records for cross-reference
  const ringEuringCodes = useMemo(() => new Set(
    records.map(r => r.euring_code).filter(Boolean)
  ), [records]);

  // Build lifelist: one entry per unique species (by lat name, fallback nl)
  const lifelist = useMemo(() => {
    const map = new Map();
    for (const w of waarnemingen) {
      const key = w.species_name_lat || w.species_name_nl;
      if (!key) continue;
      if (!map.has(key)) {
        map.set(key, {
          key,
          species_name_nl: w.species_name_nl,
          species_name_lat: w.species_name_lat,
          euring_code: w.euring_code,
          first_date: w.datum,
          last_date: w.datum,
          count: 0,
          countries: new Set(),
          geringd: false,
        });
      }
      const entry = map.get(key);
      entry.count++;
      if (w.datum < entry.first_date) entry.first_date = w.datum;
      if (w.datum > entry.last_date) entry.last_date = w.datum;
      if (w.country_code) entry.countries.add(w.country_code);
      if (w.euring_code && ringEuringCodes.has(w.euring_code)) entry.geringd = true;
    }
    return [...map.values()]
      .map(e => ({ ...e, countries: [...e.countries] }))
      .sort((a, b) => (a.species_name_nl || a.species_name_lat || '').localeCompare(b.species_name_nl || b.species_name_lat || '', 'nl'));
  }, [waarnemingen, ringEuringCodes]);

  const filtered = useMemo(() => {
    if (!query.trim()) return lifelist;
    const q = query.toLowerCase();
    return lifelist.filter(e =>
      (e.species_name_nl || '').toLowerCase().includes(q) ||
      (e.species_name_lat || '').toLowerCase().includes(q)
    );
  }, [lifelist, query]);

  if (selectedKey) {
    return (
      <SoortDetailPanel
        speciesKey={selectedKey}
        waarnemingen={waarnemingen}
        ringRecords={records}
        onClose={() => setSelectedKey(null)}
      />
    );
  }

  if (waarnemingen.length === 0) {
    return (
      <div className="w-page">
        <div className="w-empty">
          <span className="w-empty-icon">✦</span>
          <p className="w-empty-text">Geen waarnemingen. Importeer eerst via Instellingen.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-page">
      <div className="w-tiles">
        <div className="w-tile">
          <div className="w-tile-value">{lifelist.length}</div>
          <div className="w-tile-label">Soorten</div>
        </div>
        <div className="w-tile">
          <div className="w-tile-value">{lifelist.filter(e => e.geringd).length}</div>
          <div className="w-tile-label">Geringd</div>
        </div>
        <div className="w-tile">
          <div className="w-tile-value">{lifelist.reduce((s, e) => s + e.countries.length, 0)}</div>
          <div className="w-tile-label">Landrecords</div>
        </div>
      </div>

      <input
        className="w-search"
        type="search"
        placeholder="Zoek soort…"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {filtered.map(entry => (
        <LifelistRow key={entry.key} entry={entry} onClick={() => setSelectedKey(entry.key)} />
      ))}

      {filtered.length === 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '24px 0' }}>
          Geen resultaten voor "{query}"
        </p>
      )}
    </div>
  );
}

function LifelistRow({ entry, onClick }) {
  return (
    <div className="w-obs-row" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="w-obs-main">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="w-obs-name">{entry.species_name_nl || entry.species_name_lat}</span>
          {entry.geringd && <span className="w-ring-badge">geringd</span>}
        </div>
        {entry.species_name_lat && entry.species_name_nl && entry.species_name_lat !== entry.species_name_nl && (
          <div className="w-obs-lat">{entry.species_name_lat}</div>
        )}
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 3, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {entry.countries.map(c => (
            <span key={c} title={c}>{countryFlag(c)}</span>
          ))}
          <span style={{ marginLeft: 2 }}>{entry.count}×</span>
        </div>
      </div>
      <div className="w-obs-meta">
        <span className="w-obs-date">{formatDate(entry.first_date)}</span>
        {entry.first_date !== entry.last_date && (
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            – {formatDate(entry.last_date)}
          </span>
        )}
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>›</span>
      </div>
    </div>
  );
}
