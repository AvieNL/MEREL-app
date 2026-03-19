import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import { useRole } from '../../hooks/useRole';
import './SoortenPage.css';

const FILTER_DEFS = [
  { key: 'nlIsLat',   label: 'NL = Latijn' },
  { key: 'geenEuring', label: 'Zonder EURING' },
  { key: 'geenEn',    label: 'Zonder Engels' },
  { key: 'geenDe',    label: 'Zonder Duits' },
  { key: 'geenFr',    label: 'Zonder Frans' },
  { key: 'geenEs',    label: 'Zonder Spaans' },
];

const EMPTY_FILTERS = {
  nlIsLat: false, geenEuring: false,
  geenEn: false,  geenDe: false,
  geenFr: false,  geenEs: false,
};

export default function SoortenPage({ records }) {
  const [zoek, setZoek] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useRole();
  const speciesRef = useSpeciesRef();

  const soorten = useMemo(
    () => speciesRef.filter(s => s.naam_nl && !s.naam_nl.includes('groene tekst')),
    [speciesRef]
  );

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
        (s.naam_en && s.naam_en.toLowerCase().includes(lower))
      );
    }

    if (filters.nlIsLat)    result = result.filter(s => s.naam_nl === s.naam_lat);
    if (filters.geenEuring) result = result.filter(s => !s.euring_code);
    if (filters.geenEn)     result = result.filter(s => !s.naam_en);
    if (filters.geenDe)     result = result.filter(s => !s.naam_de);
    if (filters.geenFr)     result = result.filter(s => !s.naam_fr);
    if (filters.geenEs)     result = result.filter(s => !s.naam_es);

    return result;
  }, [soorten, zoek, filters]);

  const activeCount = Object.values(filters).filter(Boolean).length;

  function toggleFilter(key) {
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
          placeholder="Zoek soort..."
          className="soorten-search"
        />
        <button
          className={`soorten-filter-btn ${activeCount > 0 ? 'soorten-filter-btn--active' : ''}`}
          onClick={() => setFilterOpen(o => !o)}
          aria-label="Filters"
        >
          Filter{activeCount > 0 && <span className="soorten-filter-badge">{activeCount}</span>}
        </button>
        {isAdmin && (
          <button
            className="btn-primary soorten-nieuw-btn"
            onClick={() => navigate('/soorten/__nieuw__')}
          >
            + Nieuw
          </button>
        )}
      </div>

      {filterOpen && (
        <div className="soorten-filter-panel">
          <div className="soorten-filter-chips">
            {FILTER_DEFS.map(({ key, label }) => (
              <button
                key={key}
                className={`soorten-chip ${filters[key] ? 'soorten-chip--on' : ''}`}
                onClick={() => toggleFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
          {activeCount > 0 && (
            <button className="soorten-filter-reset" onClick={resetFilters}>
              Wis filters
            </button>
          )}
        </div>
      )}

      <div className="soorten-count">
        {filtered.length} van {soorten.length} soorten
      </div>

      <div className="soorten-list">
        {filtered.map(s => {
          const count = countPerSoort[s.naam_nl.toLowerCase()] || 0;
          return (
            <div
              key={s.naam_nl}
              className="soort-card"
              onClick={() => navigate(`/soorten/${encodeURIComponent(s.naam_nl)}`)}
            >
              <div className="soort-info">
                <strong>{s.naam_nl}</strong>
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
