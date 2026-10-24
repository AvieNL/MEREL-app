import { useMemo, useState } from 'react';

export default function JaarlijstPage({ waarnemingen }) {
  const years = useMemo(() => {
    const set = new Set(waarnemingen.map(w => w.datum?.slice(0, 4)).filter(Boolean));
    return [...set].sort((a, b) => b.localeCompare(a));
  }, [waarnemingen]);

  const [selectedYear, setSelectedYear] = useState(() => years[0] ?? new Date().getFullYear().toString());

  const jaarlijst = useMemo(() => {
    const inYear = waarnemingen.filter(w => w.datum?.startsWith(selectedYear));
    const map = new Map();
    for (const w of inYear) {
      const key = w.species_name_lat || w.species_name_nl;
      if (!key) continue;
      if (!map.has(key)) {
        map.set(key, {
          key,
          species_name_nl: w.species_name_nl,
          species_name_lat: w.species_name_lat,
          first_date: w.datum,
          count: 0,
        });
      }
      const entry = map.get(key);
      entry.count++;
      if (w.datum < entry.first_date) entry.first_date = w.datum;
    }
    return [...map.values()]
      .sort((a, b) => a.first_date.localeCompare(b.first_date));
  }, [waarnemingen, selectedYear]);

  if (waarnemingen.length === 0) {
    return (
      <div className="w-page">
        <div className="w-empty">
          <span className="w-empty-icon">◷</span>
          <p className="w-empty-text">Geen waarnemingen. Importeer eerst via Instellingen.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-page">
      {/* Year selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {years.map(y => (
          <button
            key={y}
            onClick={() => setSelectedYear(y)}
            style={{
              padding: '5px 12px',
              borderRadius: 'var(--radius)',
              border: `1px solid ${y === selectedYear ? 'var(--accent)' : 'var(--border)'}`,
              background: y === selectedYear ? 'color-mix(in srgb, var(--accent) 15%, transparent)' : 'var(--bg-tertiary)',
              color: y === selectedYear ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: y === selectedYear ? 700 : 400,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {y}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <p className="w-section-title" style={{ margin: 0 }}>Jaarlijst {selectedYear}</p>
        <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700 }}>
          {jaarlijst.length} soorten
        </span>
      </div>

      {jaarlijst.map((entry, idx) => (
        <div key={entry.key} className="w-obs-row">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: 28 }}>
            {idx + 1}.
          </span>
          <div className="w-obs-main">
            <div className="w-obs-name">{entry.species_name_nl || entry.species_name_lat}</div>
            {entry.species_name_lat && entry.species_name_nl && entry.species_name_lat !== entry.species_name_nl && (
              <div className="w-obs-lat">{entry.species_name_lat}</div>
            )}
          </div>
          <div className="w-obs-meta">
            <span className="w-obs-date">{formatDate(entry.first_date)}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{entry.count}×</span>
          </div>
        </div>
      ))}

      {jaarlijst.length === 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '24px 0' }}>
          Geen waarnemingen in {selectedYear}
        </p>
      )}
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
}
