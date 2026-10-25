import { useMemo, useState } from 'react';
import { countryFlag } from './utils';
import LandDetailPanel from './LandDetailPanel';
import { useRecords } from '../../hooks/useRecords';


export default function LandenPage({ waarnemingen }) {
  const [expanded, setExpanded] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const { records } = useRecords();

  const byCountry = useMemo(() => {
    const map = new Map();
    for (const w of waarnemingen) {
      const code = w.country_code || 'XX';
      if (!map.has(code)) map.set(code, { code, obs: [] });
      map.get(code).obs.push(w);
    }
    // Convert to array and sort by species count desc
    return [...map.values()]
      .map(({ code, obs }) => {
        const species = new Set(obs.map(w => w.species_name_lat || w.species_name_nl).filter(Boolean));
        const sorted = [...obs].sort((a, b) => a.datum.localeCompare(b.datum));
        // Gebruik opgeslagen landnaam uit de data; val terug op de code
        const storedName = obs.find(w => w.country_name)?.country_name || code;
        return {
          code,
          name: storedName,
          obs_count: obs.length,
          species_count: species.size,
        };
      })
      .sort((a, b) => b.species_count - a.species_count);
  }, [waarnemingen]);

  if (selectedCountry) {
    return (
      <LandDetailPanel
        countryCode={selectedCountry.code}
        countryName={selectedCountry.name}
        waarnemingen={waarnemingen}
        ringRecords={records}
        onClose={() => setSelectedCountry(null)}
      />
    );
  }

  if (waarnemingen.length === 0) {
    return (
      <div className="w-page">
        <div className="w-empty">
          <span className="w-empty-icon">⊕</span>
          <p className="w-empty-text">Geen waarnemingen. Importeer eerst via Instellingen.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-page">
      <div className="w-tiles" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="w-tile">
          <div className="w-tile-value">{byCountry.length}</div>
          <div className="w-tile-label">Landen</div>
        </div>
        <div className="w-tile">
          <div className="w-tile-value">{byCountry.reduce((s, c) => s + c.species_count, 0)}</div>
          <div className="w-tile-label">Landrecords</div>
        </div>
      </div>

      {byCountry.map(country => (
        <div
          key={country.code}
          className="w-country-row"
          style={{ cursor: 'pointer' }}
          onClick={() => setSelectedCountry(country)}
        >
          <span className="w-country-flag">{countryFlag(country.code)}</span>
          <div className="w-country-info">
            <div className="w-country-name">{country.name}</div>
            <div className="w-country-count">{country.species_count} soorten · {country.obs_count} waarnemingen</div>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>›</span>
        </div>
      ))}
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
}
