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
    const sorted = [...map.entries()]
      .map(([yr, sp]) => ({ yr, species: sp.size, set: sp }))
      .sort((a, b) => a.yr.localeCompare(b.yr));

    // Lifers = soorten die in dit jaar voor het eerst voorkomen
    const seen = new Set();
    for (const entry of sorted) {
      let lifers = 0;
      for (const sp of entry.set) {
        if (!seen.has(sp)) { lifers++; seen.add(sp); }
      }
      entry.lifers = lifers;
      entry.returning = entry.species - lifers;
    }
    return sorted;
  }, [waarnemingen]);

  const { jaarlijst, totalObs, byMonth } = useMemo(() => {
    const inYear = waarnemingen.filter(w => w.datum?.startsWith(selectedYear));

    // Soorten die vóór het geselecteerde jaar al gezien zijn
    const seenBefore = new Set(
      waarnemingen
        .filter(w => w.datum && w.datum.slice(0, 4) < selectedYear)
        .map(w => w.species_name_lat || w.species_name_nl)
        .filter(Boolean)
    );

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
          isLifer: !seenBefore.has(key),
        });
      }
      const entry = map.get(key);
      entry.count++;
      if (w.datum < entry.first_date) entry.first_date = w.datum;
    }

    const sorted = [...map.values()].sort((a, b) => a.first_date.localeCompare(b.first_date));
    // Lifers bovenaan, daarna terugkerend — binnen elke groep op datum
    const list = [
      ...sorted.filter(e => e.isLifer),
      ...sorted.filter(e => !e.isLifer),
    ];

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
  const CHART_H = 160;
  const maxMonth = Math.max(...byMonth, 1);

  return (
    <div className="w-page">
      {/* Jaargrafiek */}
      {byYear.length > 1 && (
        <>
          <p className="w-section-title">Soorten per jaar</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: CHART_H, marginBottom: 0 }}>
            {byYear.map(({ yr, species, lifers, returning }) => {
              const totalH = Math.max(6, (species / maxYear) * (CHART_H - 6));
              const liferH = Math.round((lifers / species) * totalH);
              const retH = totalH - liferH;
              const selected = yr === selectedYear;
              return (
                <div
                  key={yr}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', cursor: 'pointer' }}
                  onClick={() => setSelectedYear(yr)}
                  title={`${yr}: ${species} soorten (${lifers} nieuw, ${returning} terugkerend)`}
                >
                  {liferH > 0 && <div style={{
                    height: liferH,
                    borderRadius: retH === 0 ? '3px 3px 0 0' : '0',
                    background: selected ? '#4ade80' : '#22c55e',
                    transition: 'height 0.3s',
                  }} />}
                  {retH > 0 && <div style={{
                    height: retH,
                    borderRadius: liferH === 0 ? '3px 3px 0 0' : '0',
                    background: selected ? 'var(--accent)' : '#1e6fa8',
                    transition: 'height 0.3s',
                  }} />}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
            {byYear.map(({ yr }) => (
              <div key={yr} style={{ flex: 1, height: 3, borderRadius: 2, background: yr === selectedYear ? 'var(--accent)' : 'transparent' }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
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
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: '#22c55e', opacity: 0.9 }} />
              Nieuw (lifers)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--accent)', opacity: 0.75 }} />
              Terugkerend
            </div>
          </div>
        </>
      )}

      {/* Jaarselector */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {years.map(y => (
          <button
            key={y}
            onClick={() => setSelectedYear(y)}
            style={{
              padding: '4px 10px',
              border: 'none',
              borderBottom: `2px solid ${y === selectedYear ? 'var(--accent)' : 'transparent'}`,
              background: 'none',
              color: y === selectedYear ? 'var(--accent)' : 'var(--text-muted)',
              fontWeight: y === selectedYear ? 700 : 400,
              fontSize: '0.82rem',
              cursor: 'pointer',
              flexShrink: 0,
              whiteSpace: 'nowrap',
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
      {jaarlijst.some(e => e.isLifer) && (
        <p className="w-section-title" style={{ color: '#22c55e' }}>
          Lifers ({jaarlijst.filter(e => e.isLifer).length})
        </p>
      )}

      {jaarlijst.map((entry, idx) => {
        const firstReturning = !entry.isLifer && idx > 0 && jaarlijst[idx - 1].isLifer;
        return (
          <>
            {firstReturning && (
              <p key="terugkerend-header" className="w-section-title" style={{ marginTop: 16 }}>
                Terugkerend ({jaarlijst.filter(e => !e.isLifer).length})
              </p>
            )}
            <div key={entry.key} className="w-obs-row">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: 28 }}>
                {idx + 1}.
              </span>
              <div className="w-obs-main">
                <div className="w-obs-name" style={entry.isLifer ? { color: '#4ade80' } : {}}>
                  {entry.species_name_nl || entry.species_name_lat}
                </div>
                {entry.species_name_lat && entry.species_name_nl && entry.species_name_lat !== entry.species_name_nl && (
                  <div className="w-obs-lat">{entry.species_name_lat}</div>
                )}
              </div>
              <div className="w-obs-meta">
                <span className="w-obs-date">{formatDate(entry.first_date)}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{entry.count}×</span>
              </div>
            </div>
          </>
        );
      })}

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
