import { useMemo, useEffect, useState } from 'react';
import { normSciName, countryFlag } from './utils';
import {
  fetchWorldSpecies, getEbirdKey,
  COUNTRY_CONTINENT, CONTINENT_NAMES,
} from '../../lib/ebird-api';
import { useRecords } from '../../hooks/useRecords';
import ProvincieDetailPanel from './ProvincieDetailPanel';

const MAX_UNSEEN = 300;

export default function VolledigheidsPage({ waarnemingen }) {
  const { records: ringRecords } = useRecords();
  const [worldList, setWorldList] = useState({ status: 'idle', data: null, error: null });
  const [showWorldUnseen, setShowWorldUnseen] = useState(false);
  const [showWorldNoMatch, setShowWorldNoMatch] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);

  const ebirdKey = getEbirdKey();

  useEffect(() => {
    if (!ebirdKey) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWorldList({ status: 'loading', data: null, error: null });
    fetchWorldSpecies(ebirdKey)
      .then(data => setWorldList({ status: 'done', data, error: null }))
      .catch(err => setWorldList({ status: 'error', data: null, error: err.message }));
  }, [ebirdKey]);

  // Global lifelist: all unique species (normalised scientific name)
  const globalSciNorm = useMemo(
    () => new Set(waarnemingen.map(w => normSciName(w.species_name_lat)).filter(Boolean)),
    [waarnemingen]
  );
  const globalNlLower = useMemo(
    () => new Set(waarnemingen.map(w => (w.species_name_nl || '').toLowerCase().trim()).filter(Boolean)),
    [waarnemingen]
  );

  // World completeness vs eBird taxonomy
  const worldStats = useMemo(() => {
    if (worldList.status !== 'done' || !worldList.data) return null;
    const ebirdNorms = new Set(worldList.data.map(s => normSciName(s.sciName)));
    const total = worldList.data.length;
    const isSeen = s =>
      globalSciNorm.has(normSciName(s.sciName)) ||
      globalNlLower.has((s.comName || '').toLowerCase().trim());
    const seen = worldList.data.filter(isSeen);
    const unseen = worldList.data.filter(s => !isSeen(s));
    // Species in the user's lifelist that don't match any eBird species
    const noMatchMap = new Map();
    for (const w of waarnemingen) {
      const norm = normSciName(w.species_name_lat);
      const key = norm || (w.species_name_nl || '').toLowerCase();
      if (!key) continue;
      if (!ebirdNorms.has(norm) && !noMatchMap.has(key)) {
        noMatchMap.set(key, { name_nl: w.species_name_nl || w.species_name_lat, name_lat: w.species_name_lat });
      }
    }
    const noMatch = [...noMatchMap.values()]
      .sort((a, b) => (a.name_nl || a.name_lat).localeCompare(b.name_nl || b.name_lat, 'nl'));
    return { total, seenCount: seen.length, unseen, noMatch };
  }, [worldList, globalSciNorm, globalNlLower, waarnemingen]);

  // Continent aggregation from user data
  const continents = useMemo(() => {
    const map = new Map();
    for (const w of waarnemingen) {
      const cc = w.country_code || 'XX';
      const cont = COUNTRY_CONTINENT[cc];
      if (!cont) continue;
      if (!map.has(cont)) map.set(cont, { countries: new Set(), species: new Set(), count: 0 });
      const c = map.get(cont);
      c.countries.add(cc);
      const sp = normSciName(w.species_name_lat) || w.species_name_nl;
      if (sp) c.species.add(sp);
      c.count++;
    }
    return [...map.entries()]
      .map(([code, data]) => ({
        code,
        name: CONTINENT_NAMES[code] || code,
        countryCount: data.countries.size,
        speciesCount: data.species.size,
        obsCount: data.count,
      }))
      .sort((a, b) => b.speciesCount - a.speciesCount);
  }, [waarnemingen]);

  // Province aggregation
  const provinces = useMemo(() => {
    const map = new Map();
    for (const w of waarnemingen) {
      if (!w.province) continue;
      const key = `${w.country_code}|${w.province}`;
      if (!map.has(key)) map.set(key, { countryCode: w.country_code, province: w.province, species: new Set(), count: 0 });
      const p = map.get(key);
      const sp = normSciName(w.species_name_lat) || w.species_name_nl;
      if (sp) p.species.add(sp);
      p.count++;
    }
    return [...map.values()]
      .map(p => ({ ...p, speciesCount: p.species.size }))
      .sort((a, b) => b.speciesCount - a.speciesCount);
  }, [waarnemingen]);

  if (selectedProvince) {
    return (
      <ProvincieDetailPanel
        province={selectedProvince.province}
        countryCode={selectedProvince.countryCode}
        waarnemingen={waarnemingen}
        ringRecords={ringRecords}
        onClose={() => setSelectedProvince(null)}
      />
    );
  }

  if (waarnemingen.length === 0) {
    return (
      <div className="w-page">
        <div className="w-empty">
          <span className="w-empty-icon">◈</span>
          <p className="w-empty-text">Geen waarnemingen. Importeer eerst via Instellingen.</p>
        </div>
      </div>
    );
  }

  const pct = worldStats ? Math.round((worldStats.seenCount / worldStats.total) * 100) : null;

  return (
    <div className="w-page">

      {/* Wereld */}
      <p className="w-section-title">Wereld</p>

      {!ebirdKey && worldList.status !== 'done' && (
        <div style={{
          background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
          border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
          borderRadius: 8, padding: '10px 14px', marginBottom: 20,
          fontSize: '0.8rem', color: 'var(--text-secondary)',
        }}>
          Stel een <strong style={{ color: 'var(--text-primary)' }}>eBird API-sleutel</strong> in via Instellingen voor wereldvolledigheid.
          <div style={{ marginTop: 4, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Je eigen lifelist telt {globalSciNorm.size} soorten.
          </div>
        </div>
      )}

      {worldList.status === 'loading' && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 20 }}>
          Wereld-taxonomie ophalen (~10 700 soorten)…
        </div>
      )}
      {worldList.status === 'error' && (
        <div style={{ fontSize: '0.78rem', color: 'var(--danger, #ef4444)', marginBottom: 20 }}>
          eBird: {worldList.error}
        </div>
      )}

      {worldStats && (
        <div style={{ marginBottom: 24 }}>
          <div style={{
            height: 10, borderRadius: 5,
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            overflow: 'hidden', marginBottom: 8,
          }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: 'var(--accent)', borderRadius: 5, transition: 'width 0.3s',
            }} />
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
            <strong style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}>{pct}%</strong>
            {' '}— {worldStats.seenCount.toLocaleString('nl')} van {worldStats.total.toLocaleString('nl')} eBird-soorten gezien
            <span style={{ color: 'var(--text-muted)' }}> · {worldStats.unseen.length.toLocaleString('nl')} nog te zien</span>
          </div>

          {worldStats.unseen.length > 0 && (
            <>
              <button onClick={() => setShowWorldUnseen(v => !v)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', fontSize: '0.78rem', padding: 0,
                display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12,
              }}>
                <span>{showWorldUnseen ? '▲' : '▼'}</span>
                <span>Nog te zien ({worldStats.unseen.length.toLocaleString('nl')})</span>
              </button>
              {showWorldUnseen && (
                <div style={{ marginBottom: 20 }}>
                  {worldStats.unseen.slice(0, MAX_UNSEEN).map(sp => (
                    <div key={sp.code} style={{
                      padding: '5px 0', borderBottom: '1px solid var(--border)',
                    }}>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{sp.comName}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{sp.sciName}</div>
                    </div>
                  ))}
                  {worldStats.unseen.length > MAX_UNSEEN && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '8px 0' }}>
                      ... en {(worldStats.unseen.length - MAX_UNSEEN).toLocaleString('nl')} meer
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          {worldStats.noMatch.length > 0 && (
            <>
              <button onClick={() => setShowWorldNoMatch(v => !v)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', fontSize: '0.78rem', padding: 0,
                display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12,
              }}>
                <span>{showWorldNoMatch ? '▲' : '▼'}</span>
                <span style={{ color: '#f59e0b' }}>Geen eBird-match ({worldStats.noMatch.length})</span>
              </button>
              {showWorldNoMatch && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                    Deze soorten staan in jouw lijst maar zijn niet herkend in de eBird-wereldtaxonomie. Mogelijke oorzaken: andere geslachtsnaam (Clements vs IOC), hybride, niet-erkende soort, of onvolledige naam in de import.
                  </div>
                  {worldStats.noMatch.map(sp => (
                    <div key={sp.name_lat || sp.name_nl} className="w-ll-row">
                      <div className="w-ll-top"><span className="w-ll-name">{sp.name_nl || sp.name_lat}</span></div>
                      {sp.name_lat && sp.name_lat !== sp.name_nl && (
                        <div className="w-ll-sub"><span className="w-ll-lat">{sp.name_lat}</span></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Werelddelen */}
      {continents.length > 0 && (
        <>
          <p className="w-section-title">Werelddelen</p>
          {continents.map(c => (
            <div key={c.code} className="w-country-row" style={{ cursor: 'default' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)',
                letterSpacing: '0.02em',
              }}>{c.code}</div>
              <div className="w-country-info">
                <div className="w-country-name">{c.name}</div>
                <div className="w-country-count">
                  {c.speciesCount} soorten · {c.countryCount} {c.countryCount === 1 ? 'land' : 'landen'} · {c.obsCount.toLocaleString('nl')} waarnemingen
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Provincies */}
      {provinces.length > 0 && (
        <>
          <p className="w-section-title" style={{ marginTop: 24 }}>Provincies & regio's</p>
          {provinces.map(p => (
            <div
              key={`${p.countryCode}|${p.province}`}
              className="w-country-row"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedProvince(p)}
            >
              <span className="w-country-flag">{countryFlag(p.countryCode)}</span>
              <div className="w-country-info">
                <div className="w-country-name">{p.province}</div>
                <div className="w-country-count">{p.speciesCount} soorten · {p.count} waarnemingen</div>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>›</span>
            </div>
          ))}
        </>
      )}

      {provinces.length === 0 && waarnemingen.length > 0 && (
        <div style={{
          background: 'var(--bg-secondary)', borderRadius: 8, padding: '12px 14px',
          fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 16,
        }}>
          Geen provinciedata gevonden. Importeer opnieuw via Instellingen om provincies te activeren.
        </div>
      )}
    </div>
  );
}
