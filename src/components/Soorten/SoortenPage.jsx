import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import { useRole } from '../../hooks/useRole';
import { useDisplayNaam } from '../../hooks/useDisplayNaam';
import { buildEuringLookup } from '../../utils/euring-lookup';
import './SoortenPage.css';

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
  const navigate = useNavigate();
  const { isAdmin } = useRole();
  const { t } = useTranslation();
  const speciesRef = useSpeciesRef();
  const displayNaam = useDisplayNaam();

  const FILTER_DEFS = [
    { key: 'gevangen',   label: t('species_filter_caught') },
    { key: 'nlIsLat',    label: t('species_filter_nl_is_lat') },
    { key: 'geenEuring', label: t('species_filter_no_euring') },
    { key: 'geenEn',     label: t('species_filter_no_en') },
    { key: 'geenDe',     label: t('species_filter_no_de') },
    { key: 'geenFr',     label: t('species_filter_no_fr') },
    { key: 'geenEs',     label: t('species_filter_no_es') },
  ];

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
          <>
            <button
              className="btn-primary soorten-nieuw-btn"
              onClick={() => navigate('/soorten/__nieuw__')}
            >
              {t('species_add_new')}
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
