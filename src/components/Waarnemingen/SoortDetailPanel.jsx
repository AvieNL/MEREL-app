import { useMemo, useEffect, useRef } from 'react';
import { countryFlag, formatDate } from './utils';
import RarityIcon from './RarityIcon';

export default function SoortDetailPanel({ speciesKey, waarnemingen, ringRecords, onClose }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const sightings = useMemo(
    () => waarnemingen
      .filter(w => (w.species_name_lat || w.species_name_nl) === speciesKey)
      .sort((a, b) => b.datum.localeCompare(a.datum)),
    [waarnemingen, speciesKey]
  );

  const entry = sightings[0] ?? {};
  const name = entry.species_name_nl || entry.species_name_lat || speciesKey;
  const nameLat = entry.species_name_lat || '';

  const stats = useMemo(() => {
    const countries = new Map(); // code → { name, count }
    let earliest = null, latest = null;
    let withPhoto = 0;
    const byYear = {};

    for (const w of sightings) {
      if (w.country_code) {
        if (!countries.has(w.country_code)) countries.set(w.country_code, { name: w.country_name || w.country_code, count: 0 });
        countries.get(w.country_code).count++;
      }
      if (!earliest || w.datum < earliest) earliest = w.datum;
      if (!latest || w.datum > latest) latest = w.datum;
      if (w.has_photo) withPhoto++;
      const yr = w.datum?.slice(0, 4);
      if (yr) byYear[yr] = (byYear[yr] || 0) + 1;
    }
    return {
      total: sightings.length,
      countries: [...countries.entries()].map(([code, v]) => ({ code, ...v })).sort((a, b) => b.count - a.count),
      earliest, latest, withPhoto,
      byYear: Object.entries(byYear).sort(([a], [b]) => b.localeCompare(a)),
    };
  }, [sightings]);

  const geringd = useMemo(() => {
    const euringCode = entry.euring_code;
    if (!euringCode) return false;
    return ringRecords.some(r => r.euring_code === euringCode);
  }, [entry.euring_code, ringRecords]);

  const withCoords = useMemo(() => sightings.filter(w => w.lat != null && w.lon != null), [sightings]);

  useEffect(() => {
    if (!mapRef.current || withCoords.length === 0) return;
    let map;
    async function init() {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
      map = L.map(mapRef.current, { preferCanvas: true }).setView([52.3, 5.3], 5);
      mapInstanceRef.current = map;
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap', maxZoom: 18,
      }).addTo(map);
      const icon = L.divIcon({
        className: '',
        html: '<div style="width:10px;height:10px;border-radius:50%;background:#38bdf8;border:2px solid #0f172a;opacity:0.85;"></div>',
        iconSize: [10, 10], iconAnchor: [5, 5],
      });
      const markers = withCoords.map(w =>
        L.marker([w.lat, w.lon], { icon })
          .bindPopup(`${w.location_name || ''}<br>${formatDate(w.datum)}`)
          .addTo(map)
      );
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.15));
    }
    init().catch(console.error);
    return () => { mapInstanceRef.current?.remove(); mapInstanceRef.current = null; };
  }, [withCoords]);

  return (
    <div className="w-page">
      {/* Terugknop + titel */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-secondary)', fontSize: '1.3rem', lineHeight: 1, padding: '2px 4px',
        }}>←</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{name}</span>
            {geringd && <span className="w-ring-badge">geringd</span>}
          </div>
          {nameLat && nameLat !== name && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{nameLat}</div>
          )}
        </div>
      </div>

      {/* Stat tiles */}
        <div className="w-tiles" style={{ marginBottom: 20 }}>
          <div className="w-tile">
            <div className="w-tile-value">{stats.total}</div>
            <div className="w-tile-label">Waarnemingen</div>
          </div>
          <div className="w-tile">
            <div className="w-tile-value">{stats.countries.length}</div>
            <div className="w-tile-label">Landen</div>
          </div>
          <div className="w-tile">
            <div className="w-tile-value">{stats.byYear.length}</div>
            <div className="w-tile-label">Jaren</div>
          </div>
        </div>

        {/* Landen met vlaggen */}
        {stats.countries.length > 0 && (
          <>
            <p className="w-section-title">Landen</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {stats.countries.map(c => (
                <div key={c.code} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '5px 10px', fontSize: '0.82rem',
                }}>
                  <span style={{ fontSize: '1.1rem' }}>{countryFlag(c.code)}</span>
                  <span style={{ color: 'var(--text-primary)' }}>{c.name || c.code}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{c.count}×</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Periode */}
        <p className="w-section-title">Periode</p>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
          {formatDate(stats.earliest)}
          {stats.earliest !== stats.latest && <> — {formatDate(stats.latest)}</>}
        </div>

        {/* Jaaroverzicht */}
        {stats.byYear.length > 1 && (
          <>
            <p className="w-section-title">Per jaar</p>
            <div style={{ marginBottom: 20 }}>
              {stats.byYear.map(([yr, cnt]) => {
                const max = Math.max(...stats.byYear.map(([, c]) => c));
                return (
                  <div key={yr} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ width: 36, fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>{yr}</span>
                    <div style={{
                      height: 14, borderRadius: 4, background: 'var(--accent)',
                      opacity: 0.7, width: `${Math.max(4, (cnt / max) * 120)}px`,
                      minWidth: 4,
                    }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{cnt}×</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Kaart */}
        {withCoords.length > 0 && (
          <>
            <p className="w-section-title">Kaart ({withCoords.length} locaties)</p>
            <div ref={mapRef} style={{ height: 220, borderRadius: 8, overflow: 'hidden', marginBottom: 20, border: '1px solid var(--border)' }} />
          </>
        )}

        {/* Alle waarnemingen */}
        <p className="w-section-title">Alle waarnemingen</p>
        {sightings.map(w => (
          <div key={w.id} className="w-obs-row" style={{ cursor: w.permalink ? 'pointer' : 'default' }}
            onClick={() => w.permalink && window.open(w.permalink, '_blank', 'noopener')}>
            <div className="w-obs-main">
              <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                {w.location_name || '—'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 1, display: 'flex', gap: 6, alignItems: 'center' }}>
                {w.country_code && <span>{countryFlag(w.country_code)} {w.country_name || w.country_code}</span>}
                {w.count > 1 && <span>{w.count}×</span>}
                <RarityIcon rarity={w.rarity} />
                {w.has_photo && <span>📷</span>}
              </div>
            </div>
            <div className="w-obs-meta">
              <span className="w-obs-date">{formatDate(w.datum)}</span>
              {w.permalink && <span style={{ fontSize: '0.65rem', color: 'var(--accent)' }}>↗</span>}
            </div>
          </div>
        ))}
    </div>
  );
}
