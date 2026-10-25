import { useMemo, useEffect, useRef, useState } from 'react';
import { countryFlag, formatDate, normSciName } from './utils';
import RarityIcon from './RarityIcon';
import SoortDetailPanel from './SoortDetailPanel';
import { fetchCountrySpecies, getEbirdKey } from '../../lib/ebird-api';

export default function LandDetailPanel({ countryCode, countryName, waarnemingen, ringRecords, onClose }) {
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [checklist, setChecklist] = useState({ status: 'idle', data: null, error: null });
  const [showUnseen, setShowUnseen] = useState(false);
  const [showNoMatch, setShowNoMatch] = useState(false);
  const [showSplits, setShowSplits] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const obs = useMemo(
    () => waarnemingen.filter(w => w.country_code === countryCode),
    [waarnemingen, countryCode]
  );

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

  // eBird checklist
  // Normalise to genus+epithet to bridge Clements vs IOC taxonomy differences
  const seenSciNorm = useMemo(
    () => new Set(obs.map(w => normSciName(w.species_name_lat)).filter(Boolean)),
    [obs]
  );
  // Dutch name fallback: for species where Latin name is missing or doesn't match
  const seenNlLower = useMemo(
    () => new Set(obs.map(w => (w.species_name_nl || '').toLowerCase().trim()).filter(Boolean)),
    [obs]
  );

  useEffect(() => {
    const key = getEbirdKey();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!key) { setChecklist({ status: 'no-key', data: null, error: null }); return; }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChecklist({ status: 'loading', data: null, error: null });
    fetchCountrySpecies(countryCode, key)
      .then(data => setChecklist({ status: 'done', data, error: null }))
      .catch(err => setChecklist({ status: 'error', data: null, error: err.message }));
  }, [countryCode]);

  // Omgekeerde lookup: eBird Dutch comName → normSciName.
  // Hiermee kan een user-Dutch-naam ook via de sciName gevonden worden,
  // zelfs als species_name_lat leeg is in de import-CSV.
  const ebirdNlToSciNorm = useMemo(() => {
    if (!checklist.data) return new Map();
    const map = new Map();
    for (const s of checklist.data) {
      const nl = (s.comName || '').toLowerCase().trim();
      if (nl) map.set(nl, normSciName(s.sciName));
    }
    return map;
  }, [checklist.data]);

  // Uitgebreide "gezien"-set: ook via omgekeerde NL→sciName lookup.
  const seenSciNormFull = useMemo(() => {
    const set = new Set(seenSciNorm);
    for (const nl of seenNlLower) {
      const sci = ebirdNlToSciNorm.get(nl);
      if (sci) set.add(sci);
    }
    return set;
  }, [seenSciNorm, seenNlLower, ebirdNlToSciNorm]);

  const checklistStats = useMemo(() => {
    if (checklist.status !== 'done' || !checklist.data) return null;
    const ebirdNorms = new Set(checklist.data.map(s => normSciName(s.sciName)));
    const total = checklist.data.length;
    const isSeen = s =>
      seenSciNormFull.has(normSciName(s.sciName)) ||
      seenNlLower.has((s.comName || '').toLowerCase().trim());
    const seen = checklist.data.filter(isSeen);
    const unseen = checklist.data.filter(s => !isSeen(s));
    // User's species that have no counterpart in the eBird list
    const noMatchMap = new Map();
    for (const w of obs) {
      const norm = normSciName(w.species_name_lat);
      const key = norm || (w.species_name_nl || '').toLowerCase();
      if (!key) continue;
      if (!ebirdNorms.has(norm) && !noMatchMap.has(key)) {
        noMatchMap.set(key, {
          name_nl: w.species_name_nl || w.species_name_lat,
          name_lat: w.species_name_lat,
        });
      }
    }
    const noMatch = [...noMatchMap.values()]
      .sort((a, b) => (a.name_nl || a.name_lat).localeCompare(b.name_nl || b.name_lat, 'nl'));

    // User species that share the same eBird norm (splits in obs taxonomy, lumped in eBird)
    const ebirdNormToUser = new Map(); // ebirdNorm → [{ name_nl, name_lat }]
    for (const w of obs) {
      const norm = normSciName(w.species_name_lat);
      if (!norm || !ebirdNorms.has(norm)) continue;
      const key = w.species_name_lat || w.species_name_nl;
      if (!key) continue;
      if (!ebirdNormToUser.has(norm)) ebirdNormToUser.set(norm, new Map());
      const userMap = ebirdNormToUser.get(norm);
      if (!userMap.has(key)) userMap.set(key, { name_nl: w.species_name_nl || w.species_name_lat, name_lat: w.species_name_lat });
    }
    const splits = [];
    for (const [, userMap] of ebirdNormToUser) {
      if (userMap.size > 1) splits.push([...userMap.values()]);
    }
    splits.sort((a, b) => (a[0].name_nl || '').localeCompare(b[0].name_nl || '', 'nl'));

    return { total, seenCount: seen.length, unseen, noMatch, splits };
  }, [checklist, seenSciNormFull, seenNlLower, obs]);

  useEffect(() => {
    if (!mapRef.current || withCoords.length === 0) return;
    let map;
    async function init() {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
      map = L.map(mapRef.current, { preferCanvas: true }).setView([0, 0], 2);
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
    <div className="w-page">
      {/* Terugknop + titel */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-secondary)', fontSize: '1.3rem', lineHeight: 1, padding: '2px 4px',
        }}>←</button>
        <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{countryFlag(countryCode)}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{countryName}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{countryCode}</div>
        </div>
      </div>

      {/* Stat tiles */}
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

        {/* eBird Volledigheid */}
        {checklist.status === 'no-key' && (
          <div style={{
            background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
            border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
            borderRadius: 8, padding: '10px 14px', marginBottom: 20,
            fontSize: '0.8rem', color: 'var(--text-secondary)',
          }}>
            Stel een <strong style={{ color: 'var(--text-primary)' }}>eBird API-sleutel</strong> in via Instellingen om te zien hoeveel procent van de soorten je al hebt gezien.
          </div>
        )}
        {checklist.status === 'loading' && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 20 }}>
            Volledigheid ophalen…
          </div>
        )}
        {checklist.status === 'error' && (
          <div style={{ fontSize: '0.78rem', color: 'var(--danger, #ef4444)', marginBottom: 20 }}>
            eBird: {checklist.error}
          </div>
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
                  background: 'var(--accent)',
                  borderRadius: 5,
                  transition: 'width 0.3s',
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
                  display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
                }}>
                  <span>{showUnseen ? '▲' : '▼'}</span>
                  <span>Nog te zien ({checklistStats.unseen.length})</span>
                </button>
                {showUnseen && (
                  <div style={{ marginBottom: 12 }}>
                    {checklistStats.unseen.map(sp => (
                      <div key={sp.code} style={{ padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{sp.comName}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{sp.sciName}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            {checklistStats.noMatch.length > 0 && (
              <>
                <button onClick={() => setShowNoMatch(v => !v)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: '0.78rem', padding: 0,
                  display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
                }}>
                  <span>{showNoMatch ? '▲' : '▼'}</span>
                  <span style={{ color: '#f59e0b' }}>Geen eBird-match ({checklistStats.noMatch.length})</span>
                </button>
                {showNoMatch && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                      Deze soorten staan in jouw lijst maar zijn niet herkend in de eBird-taxonomie.
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
            {checklistStats.splits.length > 0 && (
              <>
                <button onClick={() => setShowSplits(v => !v)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: '0.78rem', padding: 0,
                  display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16,
                }}>
                  <span>{showSplits ? '▲' : '▼'}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Taxonomisch anders ({checklistStats.splits.reduce((n, g) => n + g.length, 0)} jouw soorten → {checklistStats.splits.length} eBird-soorten)
                  </span>
                </button>
                {showSplits && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                      Jouw lijst telt deze als aparte soorten, maar eBird beschouwt ze als één soort.
                      Dit verklaart het verschil tussen jouw soortentelling en de eBird-teller.
                    </div>
                    {checklistStats.splits.map(group => (
                      <div key={group[0].name_lat || group[0].name_nl} style={{
                        padding: '6px 0', borderBottom: '1px solid var(--border)',
                      }}>
                        {group.map(sp => (
                          <div key={sp.name_lat || sp.name_nl} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            {sp.name_nl}
                            {sp.name_lat && sp.name_lat !== sp.name_nl && (
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic', marginLeft: 6 }}>{sp.name_lat}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Periode */}
        {stats.earliest && (
          <>
            <p className="w-section-title">Eerste en laatste bezoek</p>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
              {formatDate(stats.earliest)}
              {stats.earliest !== stats.latest && <> — {formatDate(stats.latest)}</>}
            </div>
          </>
        )}

        {/* Jaaroverzicht */}
        {stats.byYear.length > 0 && (
          <>
            <p className="w-section-title">Waarnemingen per jaar</p>
            <div style={{ marginBottom: 20 }}>
              {stats.byYear.map(([yr, cnt]) => {
                const max = Math.max(...stats.byYear.map(([, c]) => c));
                return (
                  <div key={yr} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ width: 36, fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>{yr}</span>
                    <div style={{
                      height: 14, borderRadius: 4, background: 'var(--accent)', opacity: 0.7,
                      width: `${Math.max(4, (cnt / max) * 140)}px`,
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

        {/* Soorten */}
        <p className="w-section-title">Soorten ({stats.speciesCount})</p>
        {stats.speciesList.map(sp => (
          <div key={sp.key} className="w-obs-row" style={{ cursor: 'pointer' }}
            onClick={() => setSelectedSpecies(sp.key)}>
            <div className="w-obs-main">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="w-obs-name">{sp.name_nl}</span>
                {sp.geringd && <span className="w-ring-badge">geringd</span>}
                <RarityIcon rarity={sp.rarity} />
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
  );
}
