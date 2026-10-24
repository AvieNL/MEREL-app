import { useEffect, useRef, useMemo, useState } from 'react';

export default function KaartPage({ waarnemingen }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [filter, setFilter] = useState('all');

  const withCoords = useMemo(
    () => waarnemingen.filter(w => w.lat != null && w.lon != null),
    [waarnemingen]
  );

  const filtered = useMemo(() => {
    if (filter === 'all') return withCoords;
    return withCoords.filter(w => w.country_code === filter);
  }, [withCoords, filter]);

  const countries = useMemo(() => {
    const seen = new Set();
    const result = [];
    for (const w of withCoords) {
      if (w.country_code && !seen.has(w.country_code)) {
        seen.add(w.country_code);
        result.push({ code: w.country_code, name: w.country_name || w.country_code });
      }
    }
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [withCoords]);

  useEffect(() => {
    if (!mapRef.current) return;
    let L;
    let map;

    async function init() {
      L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      map = L.map(mapRef.current, { preferCanvas: true }).setView([52.3, 5.3], 5);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 18,
      }).addTo(map);

      const icon = L.divIcon({
        className: '',
        html: '<div style="width:10px;height:10px;border-radius:50%;background:#38bdf8;border:2px solid #0f172a;"></div>',
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });

      const markers = [];
      for (const w of filtered) {
        const marker = L.marker([w.lat, w.lon], { icon })
          .bindPopup(
            `<strong>${w.species_name_nl || w.species_name_lat}</strong><br>` +
            `${w.datum}${w.location_name ? ` · ${w.location_name}` : ''}` +
            (w.country_name ? `<br>${w.country_name}` : '')
          );
        marker.addTo(map);
        markers.push(marker);
      }

      if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
      }
    }

    init().catch(console.error);

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [filtered]);

  if (withCoords.length === 0) {
    return (
      <div className="w-page">
        <p className="w-empty-msg">
          Geen waarnemingen met GPS-coördinaten gevonden.
          Zorg dat je CSV-export lat/lon kolommen bevat.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {countries.length > 1 && (
        <div style={{ padding: '8px 12px', display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              fontSize: '0.72rem', padding: '3px 9px', borderRadius: 10,
              border: '1px solid var(--border)', cursor: 'pointer',
              background: filter === 'all' ? 'var(--accent)' : 'var(--bg-primary)',
              color: filter === 'all' ? '#0f172a' : 'var(--text-secondary)',
              fontWeight: filter === 'all' ? 700 : 400,
            }}
          >
            Alles ({withCoords.length})
          </button>
          {countries.map(c => (
            <button
              key={c.code}
              onClick={() => setFilter(c.code)}
              style={{
                fontSize: '0.72rem', padding: '3px 9px', borderRadius: 10,
                border: '1px solid var(--border)', cursor: 'pointer',
                background: filter === c.code ? 'var(--accent)' : 'var(--bg-primary)',
                color: filter === c.code ? '#0f172a' : 'var(--text-secondary)',
                fontWeight: filter === c.code ? 700 : 400,
              }}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
      <div ref={mapRef} style={{ flex: 1, minHeight: 300 }} />
      <div style={{ padding: '6px 12px', fontSize: '0.72rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        {filtered.length} waarnemingen op kaart · {withCoords.length} van {waarnemingen.length} hebben coördinaten
      </div>
    </div>
  );
}
