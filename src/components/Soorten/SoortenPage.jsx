import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import { useRole } from '../../hooks/useRole';
import { useDisplayNaam } from '../../hooks/useDisplayNaam';
import { buildEuringLookup } from '../../utils/euring-lookup';
import { getAidsVoorSoort } from '../../data/determinatie/index';
import './SoortenPage.css';

const EMPTY_FILTERS = {
  foto:         'beide', // 'beide' | 'ja' | 'nee'
  gevangen:     'beide', // 'beide' | 'ja' | 'nee'
  determinatie: 'beide', // 'beide' | 'ja' | 'nee'
  nlIsLat: false,
  geenEn: false, geenDe: false,
  geenFr: false, geenEs: false,
};

const TRI_LABELS = { beide: 'Beide', ja: 'Wel', nee: 'Geen' };

function TriSwitch({ label, value, onChange }) {
  return (
    <div className="tri-switch-row">
      <span className="tri-switch-label">{label}</span>
      <div className="tri-switch">
        {['beide', 'ja', 'nee'].map(v => (
          <button
            key={v}
            className={`tri-switch-btn${value === v ? ' tri-switch-btn--on' : ''}`}
            onClick={() => onChange(v)}
          >
            {TRI_LABELS[v]}
          </button>
        ))}
      </div>
    </div>
  );
}

const CHIP_DEFS = [
  { key: 'nlIsLat', label: 'NL = Lat' },
  { key: 'geenEn',  label: 'Geen EN' },
  { key: 'geenDe',  label: 'Geen DE' },
  { key: 'geenFr',  label: 'Geen FR' },
  { key: 'geenEs',  label: 'Geen ES' },
];

export default function SoortenPage({ records }) {
  const [zoek, setZoek] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useRole();
  const { t } = useTranslation();
  const speciesRef = useSpeciesRef();
  const displayNaam = useDisplayNaam();

  const soorten = useMemo(
    () => speciesRef.filter(s => s.naam_nl && !s.naam_nl.includes('groene tekst')),
    [speciesRef]
  );

  const euringLookup = useMemo(() => buildEuringLookup(speciesRef), [speciesRef]);

  const countPerSoort = useMemo(() => {
    const counts = {};
    records.forEach(r => {
      if (r.vogelnaam) {
        const key = r.vogelnaam.toLowerCase();
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    return counts;
  }, [records]);

  const filtered = useMemo(() => {
    let result = soorten;

    if (zoek) {
      const lower = zoek.toLowerCase();
      result = result.filter(s =>
        s.naam_nl.toLowerCase().includes(lower) ||
        (s.naam_lat && s.naam_lat.toLowerCase().includes(lower)) ||
        (s.naam_en && s.naam_en.toLowerCase().includes(lower)) ||
        (s.naam_de && s.naam_de.toLowerCase().includes(lower)) ||
        (s.naam_fr && s.naam_fr.toLowerCase().includes(lower)) ||
        (s.naam_es && s.naam_es.toLowerCase().includes(lower)) ||
        (euringLookup[s.naam_nl?.toLowerCase()] && euringLookup[s.naam_nl.toLowerCase()].includes(lower))
      );
    }

    if (filters.foto === 'ja')  result = result.filter(s => !!s.foto);
    if (filters.foto === 'nee') result = result.filter(s => !s.foto);

    if (filters.gevangen === 'ja')  result = result.filter(s => (countPerSoort[s.naam_nl?.toLowerCase()] || 0) > 0);
    if (filters.gevangen === 'nee') result = result.filter(s => (countPerSoort[s.naam_nl?.toLowerCase()] || 0) === 0);

    if (filters.determinatie === 'ja')  result = result.filter(s => getAidsVoorSoort(s.euring_code).length > 0);
    if (filters.determinatie === 'nee') result = result.filter(s => getAidsVoorSoort(s.euring_code).length === 0);

    if (filters.nlIsLat) result = result.filter(s => s.naam_nl === s.naam_lat);
    if (filters.geenEn)  result = result.filter(s => !s.naam_en);
    if (filters.geenDe)  result = result.filter(s => !s.naam_de);
    if (filters.geenFr)  result = result.filter(s => !s.naam_fr);
    if (filters.geenEs)  result = result.filter(s => !s.naam_es);

    return result;
  }, [soorten, zoek, filters, euringLookup, countPerSoort]);

  const activeCount = useMemo(() => {
    let n = 0;
    if (filters.foto !== 'beide') n++;
    if (filters.gevangen !== 'beide') n++;
    if (filters.determinatie !== 'beide') n++;
    if (filters.nlIsLat) n++;
    if (filters.geenEn)  n++;
    if (filters.geenDe)  n++;
    if (filters.geenFr)  n++;
    if (filters.geenEs)  n++;
    return n;
  }, [filters]);

  function setTri(key, val) {
    setFilters(f => ({ ...f, [key]: val }));
  }

  function toggleChip(key) {
    setFilters(f => ({ ...f, [key]: !f[key] }));
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS);
  }

  return (
    <div className="page soorten-page">
      <div className="soorten-topbar">
        <input
          type="search"
          value={zoek}
          onChange={e => setZoek(e.target.value)}
          placeholder={t('species_search_placeholder')}
          className="soorten-search"
        />
        <button
          className={`soorten-filter-btn ${activeCount > 0 ? 'soorten-filter-btn--active' : ''}`}
          onClick={() => setFilterOpen(o => !o)}
          aria-label={t('species_filter')}
        >
          {t('species_filter')}{activeCount > 0 && <span className="soorten-filter-badge">{activeCount}</span>}
        </button>
        {isAdmin && (
          <button
            className="btn-primary soorten-nieuw-btn"
            onClick={() => navigate('/soorten/__nieuw__')}
          >
            {t('species_add_new')}
          </button>
        )}
      </div>

      {filterOpen && (
        <div className="soorten-filter-panel">
          <div className="soorten-filter-switches">
            <TriSwitch label="Foto"            value={filters.foto}         onChange={v => setTri('foto', v)} />
            <TriSwitch label="Gevangen"        value={filters.gevangen}     onChange={v => setTri('gevangen', v)} />
            <TriSwitch label="Determinatiehulp" value={filters.determinatie} onChange={v => setTri('determinatie', v)} />
          </div>
          {isAdmin && (
            <div className="soorten-filter-chips">
              {CHIP_DEFS.map(({ key, label }) => (
                <button
                  key={key}
                  className={`soorten-chip ${filters[key] ? 'soorten-chip--on' : ''}`}
                  onClick={() => toggleChip(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          {activeCount > 0 && (
            <button className="soorten-filter-reset" onClick={resetFilters}>
              {t('species_filter_reset')}
            </button>
          )}
        </div>
      )}

      <div className="soorten-count">
        {t('species_count', { filtered: filtered.length, total: soorten.length })}
      </div>

      {filtered.length === 0 && (
        <p className="soorten-leeg">{t('species_empty', { search: zoek })}</p>
      )}
      <div className="soorten-list">
        {filtered.map(s => {
          const count = countPerSoort[s.naam_nl.toLowerCase()] || 0;
          return (
            <div
              key={s.naam_nl}
              className="soort-card"
              onClick={() => navigate(`/soorten/${encodeURIComponent(s.naam_nl)}`)}
            >
              {(() => {
                const c = s.foto_crop ?? { x: 50, y: 50, zoom: 1 };
                return (
                  <div className="soort-thumb">
                    {s.foto ? (
                      <img
                        src={s.foto}
                        alt={s.naam_nl}
                        style={{
                          width: '100%', height: '100%',
                          objectFit: 'cover',
                          objectPosition: `${c.x}% ${c.y}%`,
                          transform: c.zoom !== 1 ? `scale(${c.zoom})` : undefined,
                          transformOrigin: `${c.x}% ${c.y}%`,
                          display: 'block',
                          pointerEvents: 'none',
                        }}
                      />
                    ) : (
                      <span className="soort-thumb-placeholder">🐦</span>
                    )}
                  </div>
                );
              })()}
              <div className="soort-info">
                <strong>
                  {displayNaam(s.naam_nl)}
                  {euringLookup[s.naam_nl?.toLowerCase()] && (
                    <span className="euring-hint">({euringLookup[s.naam_nl.toLowerCase()]})</span>
                  )}
                </strong>
                <span className="soort-lat">{s.naam_lat}</span>
              </div>
              <div className="soort-meta">
                {s.ringmaat && <span className="badge badge-accent">{s.ringmaat}</span>}
                {count > 0 && <span className="badge badge-success">{count}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
