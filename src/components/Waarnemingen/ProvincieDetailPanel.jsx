import { useMemo, useEffect, useRef, useState } from 'react';
import { countryFlag, formatDate, RARITY_LABELS, normSciName } from './utils';
import SoortDetailPanel from './SoortDetailPanel';
import { fetchCountrySpecies, getEbirdKey, provinceToEbirdCode } from '../../lib/ebird-api';

export default function ProvincieDetailPanel({ province, countryCode, waarnemingen, ringRecords, onClose }) {
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [checklist, setChecklist] = useState({ status: 'idle', data: null, error: null });
  const [showUnseen, setShowUnseen] = useState(false);
  const [showNoMatch, setShowNoMatch] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const obs = useMemo(
    () => waarnemingen.filter(w => w.province === province),
    [waarnemingen, province]
  );

  const ebirdCode = provinceToEbirdCode(province, countryCode);

  const stats = useMemo(() => {
    const speciesMap = new Map();
    const byYear = {};
    let earliest = null, latest = null;

    for (const w of obs) {
      const key = w.species_name_lat || w.species_name_nl;
      if (!key) continue;
      if (!speciesMap.has(key)) {
        speciesMap.set(key, {
          key,
          name_nl: w.species_name_nl || w.species_name_lat,
          name_lat: w.species_name_lat || '',
          count: 0,
          first: w.datum,
          last: w.datum,
          rarity: w.rarity ?? 0,
          euring_code: w.euring_code,
        });
      }
      const sp = speciesMap.get(key);
      sp.count++;
      if (w.datum < sp.first) sp.first = w.datum;
      if (w.datum > sp.last) sp.last = w.datum;
      if (!earliest || w.datum < earliest) earliest = w.datum;
      if (!latest || w.datum > latest) latest = w.datum;
      const yr = w.datum?.slice(0, 4);
      if (yr) byYear[yr] = (byYear[yr] || 0) + 1;
    }

    const ringEuring = new Set(ringRecords.map(r => r.euring_code).filter(Boolean));
    const speciesList = [...speciesMap.values()]
      .map(sp => ({ ...sp, geringd: sp.euring_code && ringEuring.has(sp.euring_code) }))
      .sort((a, b) => (a.name_nl || a.name_lat).localeCompare(b.name_nl || b.name_lat, 'nl'));

    return {
      total: obs.length,
      speciesCount: speciesMap.size,
      speciesList,
      earliest, latest,
      byYear: Object.entries(byYear).sort(([a], [b]) => b.localeCompare(a)),
      geringdCount: speciesList.filter(s => s.geringd).length,
    };
  }, [obs, ringRecords]);

  const withCoords = useMemo(() => obs.filter(w => w.lat != null && w.lon != null), [obs]);

  const seenSciNorm = useMemo(
    () => new Set(obs.map(w => normSciName(w.species_name_lat)).filter(Boolean)),
    [obs]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!ebirdCode) { setChecklist({ status: 'no-code', data: null, error: null }); return; }
    const key = getEbirdKey();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!key) { setChecklist({ status: 'no-key', data: null, error: null }); return; }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChecklist({ status: 'loading', data: null, error: null });
    fetchCountrySpecies(ebirdCode, key)
      .then(data => setChecklist({ status: 'done', data, error: null }))
      .catch(err => setChecklist({ status: 'error', data: null, error: err.message }));
  }, [ebirdCode]);

  const checklistStats = useMemo(() => {
    if (checklist.status !== 'done' || !checklist.data) return null;
    const ebirdNorms = new Set(checklist.data.map(s => normSciName(s.sciName)));
    const total = checklist.data.length;
    const seen = checklist.data.filter(s => seenSciNorm.has(normSciName(s.sciName)));
    const unseen = checklist.data.filter(s => !seenSciNorm.has(normSciName(s.sciName)));
    const noMatchMap = new Map();
    for (const w of obs) {
      const norm = normSciName(w.species_name_lat);
      if (norm && !ebirdNorms.has(norm) && !noMatchMap.has(norm)) {
        noMatchMap.set(norm, { name_nl: w.species_name_nl || w.species_name_lat, name_lat: w.species_name_lat });
      }
    }
    const noMatch = [...noMatchMap.values()]
      .sort((a, b) => (a.name_nl || a.name_lat).localeCompare(b.name_nl || b.name_lat, 'nl'));
    return { total, seenCount: seen.length, unseen, noMatch };
  }, [checklist, seenSciNorm, obs]);

  useEffect(() => {
    if (!mapRef.current || withCoords.length === 0) return;
    async function init() {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
      const map = L.map(mapRef.current, { preferCanvas: true }).setView([0, 0], 2);
      mapInstanceRef.current = map;
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap', maxZoom: 18,
      }).addTo(map);
      const icon = L.divIcon({
        className: '',
        html: '<div style="width:8px;height:8px;border-radius:50%;background:#38bdf8;border:2px solid #0f172a;opacity:0.8;"></div>',
        iconSize: [8, 8], iconAnchor: [4, 4],
      });
      const markers = withCoords.map(w =>
        L.marker([w.lat, w.lon], { icon })
          .bindPopup(`<strong>${w.species_name_nl || w.species_name_lat}</strong><br>${w.location_name || ''}<br>${formatDate(w.datum)}`)
          .addTo(map)
      );
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }
    init().catch(console.error);
    return () => { mapInstanceRef.current?.remove(); mapInstanceRef.current = null; };
  }, [withCoords]);

  if (selectedSpecies) {
    return (
      <SoortDetailPanel
        speciesKey={selectedSpecies}
        waarnemingen={waarnemingen}
        ringRecords={ringRecords}
        onClose={() => setSelectedSpecies(null)}
      />
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'var(--bg-primary)',
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
    }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
        padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-secondary)', fontSize: '1.3rem', lineHeight: 1, padding: '2px 6px',
        }}>←</button>
        <span style={{ fontSize: '1.4rem' }}>{countryFlag(countryCode)}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{province}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{ebirdCode || countryCode}</div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 80px' }}>
        <div className="w-tiles" style={{ marginBottom: 20 }}>
          <div className="w-tile">
            <div className="w-tile-value">{stats.speciesCount}</div>
            <div className="w-tile-label">Soorten</div>
          </div>
          <div className="w-tile">
            <div className="w-tile-value">{stats.total}</div>
            <div className="w-tile-label">Waarnemingen</div>
          </div>
          <div className="w-tile">
            <div className="w-tile-value">{stats.byYear.length}</div>
            <div className="w-tile-label">Jaren</div>
          </div>
          {stats.geringdCount > 0 && (
            <div className="w-tile">
              <div className="w-tile-value">{stats.geringdCount}</div>
              <div className="w-tile-label">Geringd</div>
            </div>
          )}
        </div>

        {/* eBird volledigheid */}
        {checklist.status === 'no-key' && (
          <div style={{
            background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
            border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
            borderRadius: 8, padding: '10px 14px', marginBottom: 20,
            fontSize: '0.8rem', color: 'var(--text-secondary)',
          }}>
            Stel een <strong style={{ color: 'var(--text-primary)' }}>eBird API-sleutel</strong> in via Instellingen voor volledigheidsdata.
          </div>
        )}
        {checklist.status === 'loading' && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 20 }}>Volledigheid ophalen…</div>
        )}
        {checklist.status === 'error' && (
          <div style={{ fontSize: '0.78rem', color: 'var(--danger, #ef4444)', marginBottom: 20 }}>eBird: {checklist.error}</div>
        )}
        {checklistStats && (
          <>
            <p className="w-section-title">
              Volledigheid ({checklistStats.seenCount} / {checklistStats.total} soorten)
            </p>
            <div style={{ marginBottom: 6 }}>
              <div style={{
                height: 10, borderRadius: 5,
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                overflow: 'hidden', marginBottom: 6,
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.round((checklistStats.seenCount / checklistStats.total) * 100)}%`,
                  background: 'var(--accent)', borderRadius: 5, transition: 'width 0.3s',
                }} />
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                <strong style={{ color: 'var(--text-primary)' }}>
                  {Math.round((checklistStats.seenCount / checklistStats.total) * 100)}%
                </strong>
                {' '}— {checklistStats.seenCount} van {checklistStats.total} eBird-soorten gezien
                <span style={{ color: 'var(--text-muted)' }}> · {checklistStats.unseen.length} nog te zien</span>
              </div>
            </div>
            {checklistStats.unseen.length > 0 && (
              <>
                <button onClick={() => setShowUnseen(v => !v)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: '0.78rem', padding: 0,
                  display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16,
                }}>
                  <span>{showUnseen ? '▲' : '▼'}</span>
                  <span>Nog te zien ({checklistStats.unseen.length})</span>
                </button>
                {showUnseen && (
                  <div style={{ marginBottom: 12 }}>
                    {checklistStats.unseen.slice(0, 200).map(sp => (
                      <div key={sp.code} style={{ padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{sp.comName}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{sp.sciName}</div>
                      </div>
                    ))}
                    {checklistStats.unseen.length > 200 && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '8px 0' }}>
                        ... en {checklistStats.unseen.length - 200} meer
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            {checklistStats.noMatch.length > 0 && (
              <>
                <button onClick={() => setShowNoMatch(v => !v)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: '0.78rem', padding: 0,
                  display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16,
                }}>
                  <span>{showNoMatch ? '▲' : '▼'}</span>
                  <span style={{ color: '#f59e0b' }}>Geen eBird-match ({checklistStats.noMatch.length})</span>
                </button>
                {showNoMatch && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                      Staan in jouw lijst maar zijn niet herkend in de eBird-taxonomie.
                    </div>
                    {checklistStats.noMatch.map(sp => (
                      <div key={sp.name_lat || sp.name_nl} style={{ padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{sp.name_nl}</div>
                        {sp.name_lat && sp.name_lat !== sp.name_nl && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{sp.name_lat}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {stats.earliest && (
          <>
            <p className="w-section-title">Eerste en laatste waarnaming</p>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
              {formatDate(stats.earliest)}
              {stats.earliest !== stats.latest && <> — {formatDate(stats.latest)}</>}
            </div>
          </>
        )}

        {stats.byYear.length > 0 && (
          <>
            <p className="w-section-title">Waarnemingen per jaar</p>
            <div style={{ marginBottom: 20 }}>
              {stats.byYear.map(([yr, cnt]) => {
                const max = Math.max(...stats.byYear.map(([, c]) => c));
                return (
                  <div key={yr} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ width: 36, fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>{yr}</span>
                    <div style={{ height: 14, borderRadius: 4, background: 'var(--accent)', opacity: 0.7, width: `${Math.max(4, (cnt / max) * 140)}px` }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{cnt}×</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {withCoords.length > 0 && (
          <>
            <p className="w-section-title">Kaart ({withCoords.length} locaties)</p>
            <div ref={mapRef} style={{ height: 220, borderRadius: 8, overflow: 'hidden', marginBottom: 20, border: '1px solid var(--border)' }} />
          </>
        )}

        <p className="w-section-title">Soorten ({stats.speciesCount})</p>
        {stats.speciesList.map(sp => (
          <div key={sp.key} className="w-obs-row" style={{ cursor: 'pointer' }}
            onClick={() => setSelectedSpecies(sp.key)}>
            <div className="w-obs-main">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="w-obs-name">{sp.name_nl}</span>
                {sp.geringd && <span className="w-ring-badge">geringd</span>}
                {sp.rarity >= 2 && (
                  <span style={{ fontSize: '0.65rem', color: '#f59e0b' }}>{RARITY_LABELS[sp.rarity]}</span>
                )}
              </div>
              {sp.name_lat && sp.name_lat !== sp.name_nl && (
                <div className="w-obs-lat">{sp.name_lat}</div>
              )}
            </div>
            <div className="w-obs-meta">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sp.count}×</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>›</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
