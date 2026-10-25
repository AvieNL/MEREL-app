import { useMemo } from 'react';
import RarityIcon from './RarityIcon';

export default function OverzichtPage({ waarnemingen }) {
  const sorted = useMemo(() =>
    [...waarnemingen].sort((a, b) => b.datum.localeCompare(a.datum)),
    [waarnemingen]
  );

  const totaal = waarnemingen.length;
  const soorten = useMemo(() => new Set(waarnemingen.map(w => w.species_name_lat || w.species_name_nl).filter(Boolean)).size, [waarnemingen]);
  const landen = useMemo(() => new Set(waarnemingen.map(w => w.country_code).filter(Boolean)).size, [waarnemingen]);

  if (totaal === 0) {
    return (
      <div className="w-page">
        <div className="w-empty">
          <span className="w-empty-icon">🔭</span>
          <p className="w-empty-text">Nog geen waarnemingen geïmporteerd.<br />Ga naar Inst. om je API-token in te stellen of een CSV te importeren.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-page">
      <div className="w-tiles">
        <div className="w-tile">
          <div className="w-tile-value">{totaal.toLocaleString('nl')}</div>
          <div className="w-tile-label">Waarnemingen</div>
        </div>
        <div className="w-tile">
          <div className="w-tile-value">{soorten.toLocaleString('nl')}</div>
          <div className="w-tile-label">Soorten</div>
        </div>
        <div className="w-tile">
          <div className="w-tile-value">{landen}</div>
          <div className="w-tile-label">Landen</div>
        </div>
      </div>

      <p className="w-section-title">Recente waarnemingen</p>

      {sorted.slice(0, 100).map(w => (
        <ObsRow key={w.id} obs={w} />
      ))}

      {sorted.length > 100 && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '12px 0' }}>
          Nog {sorted.length - 100} waarnemingen — gebruik Lifelist of Jaarlijst voor volledig overzicht
        </p>
      )}
    </div>
  );
}

export function ObsRow({ obs }) {
  const datum = obs.datum ? formatDate(obs.datum) : '';

  return (
    <div className="w-obs-row">
      <div className="w-obs-main">
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span className="w-obs-name">{obs.species_name_nl || obs.species_name_lat || '?'}</span>
          <RarityIcon rarity={obs.rarity} />
        </div>
        {obs.species_name_lat && obs.species_name_nl && obs.species_name_lat !== obs.species_name_nl && (
          <div className="w-obs-lat">{obs.species_name_lat}</div>
        )}
        {obs.location_name && (
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 1 }}>{obs.location_name}</div>
        )}
      </div>
      <div className="w-obs-meta">
        <span className="w-obs-date">{datum}</span>
        {obs.country_code && <span className="w-obs-country">{obs.country_code}</span>}
      </div>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
}
