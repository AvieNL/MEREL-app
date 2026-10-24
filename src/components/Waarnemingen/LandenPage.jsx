import { useMemo, useState } from 'react';
import { countryFlag } from './utils';

const COUNTRY_NAMES = {
  NL: 'Nederland', BE: 'België', DE: 'Duitsland', FR: 'Frankrijk', GB: 'Groot-Brittannië',
  ES: 'Spanje', PT: 'Portugal', IT: 'Italië', SE: 'Zweden', NO: 'Noorwegen', DK: 'Denemarken',
  FI: 'Finland', PL: 'Polen', AT: 'Oostenrijk', CH: 'Zwitserland', GR: 'Griekenland',
  TR: 'Turkije', MA: 'Marokko', DZ: 'Algerije', TN: 'Tunesië', EG: 'Egypte',
  SN: 'Senegal', NG: 'Nigeria', KE: 'Kenia', ZA: 'Zuid-Afrika', US: 'Verenigde Staten',
  CA: 'Canada', MX: 'Mexico', BR: 'Brazilië', AR: 'Argentinië', AU: 'Australië',
  NZ: 'Nieuw-Zeeland', JP: 'Japan', IN: 'India', ZW: 'Zimbabwe', TZ: 'Tanzania',
};

export default function LandenPage({ waarnemingen }) {
  const [expanded, setExpanded] = useState(null);

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
        return {
          code,
          name: COUNTRY_NAMES[code] ?? code,
          obs_count: obs.length,
          species_count: species.size,
          first_date: sorted[0]?.datum ?? '',
          last_date: sorted[sorted.length - 1]?.datum ?? '',
          species_list: [...species].sort((a, b) => a.localeCompare(b, 'nl')),
        };
      })
      .sort((a, b) => b.species_count - a.species_count);
  }, [waarnemingen]);

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
        <div key={country.code}>
          <div
            className="w-country-row"
            style={{ cursor: 'pointer' }}
            onClick={() => setExpanded(expanded === country.code ? null : country.code)}
          >
            <span className="w-country-flag">{countryFlag(country.code)}</span>
            <div className="w-country-info">
              <div className="w-country-name">{country.name}</div>
              <div className="w-country-count">{country.species_count} soorten · {country.obs_count} waarnemingen</div>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              {expanded === country.code ? '▲' : '▼'}
            </span>
          </div>

          {expanded === country.code && (
            <div style={{
              padding: '8px 12px 12px 52px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-tertiary)',
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                Eerste: {formatDate(country.first_date)} · Laatste: {formatDate(country.last_date)}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px' }}>
                {country.species_list.map(sp => (
                  <span key={sp} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{sp}</span>
                ))}
              </div>
            </div>
          )}
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
