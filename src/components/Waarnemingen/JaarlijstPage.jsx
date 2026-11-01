import { useMemo, useState } from 'react';

const MONTHS = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

export default function JaarlijstPage({ waarnemingen }) {
  const years = useMemo(() => {
    const set = new Set(waarnemingen.map(w => w.datum?.slice(0, 4)).filter(Boolean));
    return [...set].sort((a, b) => b.localeCompare(a));
  }, [waarnemingen]);

  const [selectedYear, setSelectedYear] = useState(() => years[0] ?? new Date().getFullYear().toString());

  const byYear = useMemo(() => {
    const map = new Map();
    for (const w of waarnemingen) {
      const yr = w.datum?.slice(0, 4);
      if (!yr) continue;
      if (!map.has(yr)) map.set(yr, new Set());
      const key = w.species_name_lat || w.species_name_nl;
      if (key) map.get(yr).add(key);
    }
    return [...map.entries()]
      .map(([yr, sp]) => ({ yr, species: sp.size }))
      .sort((a, b) => a.yr.localeCompare(b.yr));
  }, [waarnemingen]);

  const { jaarlijst, totalObs, byMonth } = useMemo(() => {
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
    const list = [...map.values()].sort((a, b) => a.first_date.localeCompare(b.first_date));

    // Nieuwe soorten per maand
    const monthCounts = Array(12).fill(0);
    for (const entry of list) {
      const m = parseInt(entry.first_date.slice(5, 7), 10) - 1;
      if (m >= 0 && m < 12) monthCounts[m]++;
    }

    return { jaarlijst: list, totalObs: inYear.length, byMonth: monthCounts };
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

  const maxYear = Math.max(...byYear.map(y => y.species), 1);
  const maxMonth = Math.max(...byMonth, 1);

  return (
    <div className="w-page">
      {/* Jaargrafiek */}
      {byYear.length > 1 && (
        <>
          <p className="w-section-title">Soorten per jaar</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 72, marginBottom: 4 }}>
            {byYear.map(({ yr, species }) => (
              <div
                key={yr}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => setSelectedYear(yr)}
                title={`${yr}: ${species} soorten`}
              >
                <div style={{
                  width: '100%', borderRadius: '3px 3px 0 0',
                  background: yr === selectedYear ? 'var(--accent)' : 'color-mix(in srgb, var(--accent) 40%, var(--bg-secondary))',
                  height: `${Math.max(8, (species / maxYear) * 56)}px`,
                  transition: 'height 0.3s, background 0.2s',
                }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
            {byYear.map(({ yr }) => (
              <div key={yr} style={{
                flex: 1, textAlign: 'center',
                fontSize: byYear.length > 8 ? '0.52rem' : '0.6rem',
                color: yr === selectedYear ? 'var(--accent)' : 'var(--text-muted)',
                fontWeight: yr === selectedYear ? 700 : 400,
                cursor: 'pointer',
              }} onClick={() => setSelectedYear(yr)}>
                {yr.slice(2)}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Jaarselector */}
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

      {/* Stat-tegels */}
      <div className="w-tiles" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: 20 }}>
        <div className="w-tile">
          <div className="w-tile-value">{jaarlijst.length}</div>
          <div className="w-tile-label">Soorten</div>
        </div>
        <div className="w-tile">
          <div className="w-tile-value">{totalObs.toLocaleString('nl')}</div>
          <div className="w-tile-label">Waarnemingen</div>
        </div>
      </div>

      {/* Maandgrafiek */}
      {jaarlijst.length > 0 && (
        <>
          <p className="w-section-title">Nieuwe soorten per maand</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 72, marginBottom: 4 }}>
            {byMonth.map((n, i) => (
              <div key={i} title={n > 0 ? `${MONTHS[i]}: ${n} soort${n !== 1 ? 'en' : ''}` : `${MONTHS[i]}: geen`}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{
                  width: '100%', borderRadius: '3px 3px 0 0',
                  background: n > 0 ? 'var(--accent)' : 'var(--bg-secondary)',
                  opacity: n > 0 ? 0.8 : 1,
                  height: n > 0 ? `${Math.max(8, (n / maxMonth) * 56)}px` : '4px',
                  transition: 'height 0.3s',
                }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
            {MONTHS.map((m, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                {m}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Lijst */}
      <p className="w-section-title">Jaarlijst {selectedYear}</p>

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
  return `${d}-${m}-${y.slice(2)}`;
}
