import { useMemo, useState } from 'react';
import { useRecords } from '../../hooks/useRecords';
import { countryFlag, formatDate } from './utils';
import SoortDetailPanel from './SoortDetailPanel';
import RarityIcon from './RarityIcon';

export default function LifelistPage({ waarnemingen }) {
  const [query, setQuery] = useState('');
  const [filterGeringd, setFilterGeringd] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const { records } = useRecords();

  // Build set of normalized Dutch species names from ring records for cross-reference
  const ringVogelnamen = useMemo(() => new Set(
    records.map(r => (r.vogelnaam || '').toLowerCase().trim()).filter(Boolean)
  ), [records]);

  // Build lifelist: one entry per unique species (by lat name, fallback nl)
  const lifelist = useMemo(() => {
    const map = new Map();
    for (const w of waarnemingen) {
      const key = w.species_name_lat || w.species_name_nl;
      if (!key) continue;
      if (!map.has(key)) {
        map.set(key, {
          key,
          species_name_nl: w.species_name_nl,
          species_name_lat: w.species_name_lat,
          euring_code: w.euring_code,
          first_date: w.datum,
          last_date: w.datum,
          count: 0,
          rarity: 0,
          countries: new Set(),
          geringd: false,
        });
      }
      const entry = map.get(key);
      entry.count++;
      if (w.datum < entry.first_date) entry.first_date = w.datum;
      if (w.datum > entry.last_date) entry.last_date = w.datum;
      if ((w.rarity ?? 0) > entry.rarity) entry.rarity = w.rarity ?? 0;
      if (w.country_code) entry.countries.add(w.country_code);
      const nlNorm = (w.species_name_nl || '').toLowerCase().trim();
      if (nlNorm && ringVogelnamen.has(nlNorm)) entry.geringd = true;
    }
    const result = [...map.values()].map(e => ({ ...e, countries: [...e.countries] }));
    const r0 = result.filter(e => e.rarity === 0).length;
    const r1 = result.filter(e => e.rarity === 1).length;
    const r2plus = result.filter(e => e.rarity >= 2).length;
    // eslint-disable-next-line no-console
    console.log(`[Waarnemingen] rarity debug: ${result.length} soorten | 0: ${r0} | 1 (gewoon): ${r1} | ≥2 (zeldzaam): ${r2plus}`);
    return result.sort((a, b) => (a.species_name_nl || a.species_name_lat || '').localeCompare(b.species_name_nl || b.species_name_lat || '', 'nl'));
  }, [waarnemingen, ringVogelnamen]);

  const filtered = useMemo(() => {
    let list = lifelist;
    if (filterGeringd) list = list.filter(e => e.geringd);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(e =>
        (e.species_name_nl || '').toLowerCase().includes(q) ||
        (e.species_name_lat || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [lifelist, query, filterGeringd]);

  if (selectedKey) {
    return (
      <SoortDetailPanel
        speciesKey={selectedKey}
        waarnemingen={waarnemingen}
        ringRecords={records}
        onClose={() => setSelectedKey(null)}
      />
    );
  }

  if (waarnemingen.length === 0) {
    return (
      <div className="w-page">
        <div className="w-empty">
          <span className="w-empty-icon">✦</span>
          <p className="w-empty-text">Geen waarnemingen. Importeer eerst via Instellingen.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-page">
      <div className="w-tiles">
        <div className="w-tile">
          <div className="w-tile-value">{lifelist.length}</div>
          <div className="w-tile-label">Soorten</div>
        </div>
        <div
          className={`w-tile w-tile--clickable${filterGeringd ? ' w-tile--active' : ''}`}
          onClick={() => setFilterGeringd(f => !f)}
        >
          <div className="w-tile-value">{lifelist.filter(e => e.geringd).length}</div>
          <div className="w-tile-label">Geringd</div>
        </div>
        <div className="w-tile">
          <div className="w-tile-value">{lifelist.reduce((s, e) => s + e.countries.length, 0)}</div>
          <div className="w-tile-label">Landrecords</div>
        </div>
        <div className="w-tile" style={{ background: '#1e293b', border: '1px dashed #f59e0b' }}>
          <div className="w-tile-value" style={{ color: '#f59e0b', fontSize: '0.8rem' }}>
            {lifelist.filter(e => e.rarity === 0).length}/{lifelist.filter(e => e.rarity === 1).length}/{lifelist.filter(e => e.rarity >= 2).length}
          </div>
          <div className="w-tile-label" style={{ color: '#f59e0b', fontSize: '0.6rem' }}>r0/r1/r2+</div>
        </div>
      </div>

      <input
        className="w-search"
        type="search"
        placeholder="Zoek soort…"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {filtered.map(entry => (
        <LifelistRow key={entry.key} entry={entry} onClick={() => setSelectedKey(entry.key)} />
      ))}

      {filtered.length === 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '24px 0' }}>
          {query.trim() ? `Geen resultaten voor "${query}"` : 'Geen geringde soorten gevonden'}
        </p>
      )}
    </div>
  );
}

function LifelistRow({ entry, onClick }) {
  const hasLat = entry.species_name_lat && entry.species_name_nl && entry.species_name_lat !== entry.species_name_nl;
  const dateRange = entry.first_date === entry.last_date
    ? formatDate(entry.first_date)
    : `${formatDate(entry.first_date)} – ${formatDate(entry.last_date)}`;

  return (
    <div className="w-ll-row" onClick={onClick}>
      {/* Regel 1: naam · geringd · vlaggen · aantal */}
      <div className="w-ll-top">
        <span className="w-ll-name">{entry.species_name_nl || entry.species_name_lat}</span>
        {entry.geringd && <span className="w-ring-badge">◎</span>}
        <RarityIcon rarity={entry.rarity} />
        <span className="w-ll-flags">
          {entry.countries.map(c => (
            <span key={c} title={c}>{countryFlag(c)}</span>
          ))}
        </span>
        <span className="w-ll-count">{entry.count}×</span>
        <span className="w-ll-chevron">›</span>
      </div>
      {/* Regel 2: Latijnse naam + datumrange (alleen als relevant) */}
      {(hasLat || entry.first_date) && (
        <div className="w-ll-sub">
          {hasLat && <span className="w-ll-lat">{entry.species_name_lat}</span>}
          <span className="w-ll-dates">{dateRange}</span>
        </div>
      )}
    </div>
  );
}
