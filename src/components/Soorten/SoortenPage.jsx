import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpeciesRef, pullSpeciesIfNeeded } from '../../hooks/useSpeciesRef';
import { useRole } from '../../hooks/useRole';
import { buildEuringLookup } from '../../utils/euring-lookup';
import './SoortenPage.css';

const FILTER_DEFS = [
  { key: 'gevangen',   label: 'Gevangen' },
  { key: 'nlIsLat',    label: 'NL = Latijn' },
  { key: 'geenEuring', label: 'Zonder EURING' },
  { key: 'geenEn',     label: 'Zonder Engels' },
  { key: 'geenDe',     label: 'Zonder Duits' },
  { key: 'geenFr',     label: 'Zonder Frans' },
  { key: 'geenEs',     label: 'Zonder Spaans' },
];

const EMPTY_FILTERS = {
  gevangen: false,
  nlIsLat: false, geenEuring: false,
  geenEn: false,  geenDe: false,
  geenFr: false,  geenEs: false,
};

export default function SoortenPage({ records }) {
  const [zoek, setZoek] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useRole();
  const speciesRef = useSpeciesRef();

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
        (euringLookup[s.naam_nl?.toLowerCase()] && euringLookup[s.naam_nl.toLowerCase()].includes(lower))
      );
    }

    if (filters.gevangen)   result = result.filter(s => (countPerSoort[s.naam_nl?.toLowerCase()] || 0) > 0);
    if (filters.nlIsLat)    result = result.filter(s => s.naam_nl === s.naam_lat);
    if (filters.geenEuring) result = result.filter(s => !euringLookup[s.naam_nl?.toLowerCase()]);
    if (filters.geenEn)     result = result.filter(s => !s.naam_en);
    if (filters.geenDe)     result = result.filter(s => !s.naam_de);
    if (filters.geenFr)     result = result.filter(s => !s.naam_fr);
    if (filters.geenEs)     result = result.filter(s => !s.naam_es);

    return result;
  }, [soorten, zoek, filters, euringLookup]);

  const activeCount = Object.values(filters).filter(Boolean).length;

  function toggleFilter(key) {
    setFilters(f => ({ ...f, [key]: !f[key] }));
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS);
  }

  async function handleVervers() {
    setSyncing(true);
    await pullSpeciesIfNeeded(true);
    setSyncing(false);
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
          <>
            <button
              className="soorten-filter-btn"
              onClick={handleVervers}
              disabled={syncing}
              title="Soorten opnieuw ophalen uit Supabase"
            >
              {syncing ? '...' : '↻'}
            </button>
            <button
              className="btn-primary soorten-nieuw-btn"
              onClick={() => navigate('/soorten/__nieuw__')}
            >
              + Nieuw
            </button>
          </>
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

      {filtered.length === 0 && (
        <p className="soorten-leeg">Geen soorten gevonden voor "{zoek}".</p>
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
              <div className="soort-info">
                <strong>
                  {s.naam_nl}
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
