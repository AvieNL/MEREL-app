import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNestData } from '../../hooks/useNestData';
import { useNestRole } from '../../hooks/useNestRole';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import { buildNestExportData, exportNestJSON, exportNestCSV } from '../../utils/nestExport';
import 'leaflet/dist/leaflet.css';
import { getTileType, saveTileType, addTileLayer } from '../../utils/leafletTiles';
import './NestOverzichtPage.css';

const HUIDIG_JAAR = new Date().getFullYear();

async function getLeaflet() {
  const L = await import('leaflet');
  delete L.default.Icon.Default.prototype._getIconUrl;
  L.default.Icon.Default.mergeOptions({
    iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
    iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
    shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
  });
  return L.default;
}

function stadiumKleur(stadium) {
  if (!stadium) return '#64748b';
  if (stadium.startsWith('L')) return '#64748b';
  if (stadium.startsWith('B')) return '#f59e0b';
  if (stadium.startsWith('E')) return '#a78bfa';
  if (stadium.startsWith('N')) return '#38bdf8';
  if (stadium.startsWith('C')) return '#22c55e';
  if (stadium.startsWith('P')) return '#fb923c';
  return '#64748b';
}

export default function NestOverzichtPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { canNestAdd } = useNestRole();
  const { nesten, seizoenen, legsels, bezoeken, ringen } = useNestData();
  const species = useSpeciesRef();
  const speciesByEuring = useMemo(() => {
    const map = {};
    species.forEach(s => { if (s.euring_code) map[s.euring_code] = s; });
    return map;
  }, [species]);
  const [tab, setTab] = useState('lijst');
  const [seizoenFilter, setSeizoenFilter] = useState(String(HUIDIG_JAAR));

  // Beschikbare seizoenen op basis van nest_seizoen data
  const beschikbareJaren = useMemo(() => {
    const jaren = new Set(seizoenen.map(s => String(s.jaar)));
    jaren.add(String(HUIDIG_JAAR));
    return [...jaren].sort((a, b) => b - a);
  }, [seizoenen]);

  // Verrijkte nestenlijst: voeg seizoen + laatste bezoek toe
  const verrijkteNesten = useMemo(() => {
    const jaar = parseInt(seizoenFilter, 10);
    return nesten.map(nest => {
      const seizoen = seizoenen.find(s => s.nest_id === nest.id && s.jaar === jaar);
      const legselsInSeizoen = seizoen
        ? legsels.filter(l => l.nest_seizoen_id === seizoen.id)
        : [];
      const alleBezoeken = legselsInSeizoen.flatMap(l =>
        bezoeken.filter(b => b.legsel_id === l.id)
      );
      const sortedBezoeken = [...alleBezoeken].sort((a, b) => b.datum.localeCompare(a.datum));
      const laatsteBezoek = sortedBezoeken[0] || null;

      let vogelNaam = '';
      if (seizoen?.soort_euring) {
        const soort = speciesByEuring[seizoen.soort_euring];
        vogelNaam = soort?.naam_nl || seizoen.soort_euring;
      }

      return { ...nest, seizoen, legselsInSeizoen, laatsteBezoek, vogelNaam, aantalBezoeken: alleBezoeken.length };
    });
  }, [nesten, seizoenen, legsels, bezoeken, seizoenFilter, speciesByEuring]);

  return (
    <div className="page nest-overzicht-page">
      <div className="nest-overzicht-header">
        <div className="nest-overzicht-header__top">
          <h2>{t('nest_overview_title')}</h2>
          {canNestAdd && (
            <button className="btn-primary nest-nieuw-btn" onClick={() => navigate('/nest/nieuw')}>
              + {t('nest_btn_new')}
            </button>
          )}
        </div>

        <div className="nest-overzicht-controls">
          <div className="mode-toggle">
            <button className={`mode-btn${tab === 'lijst' ? ' active' : ''}`} onClick={() => setTab('lijst')}>
              {t('nest_tab_list')}
            </button>
            <button className={`mode-btn${tab === 'kaart' ? ' active' : ''}`} onClick={() => setTab('kaart')}>
              {t('nest_tab_map')}
            </button>
          </div>

          <select
            className="nest-seizoen-select"
            value={seizoenFilter}
            onChange={e => setSeizoenFilter(e.target.value)}
            aria-label={t('nest_season_filter')}
          >
            {beschikbareJaren.map(j => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>

          <div className="nest-export-knoppen">
            <button
              className="btn-secondary nest-export-btn"
              onClick={() => {
                const data = buildNestExportData({ nesten, seizoenen, legsels, bezoeken, ringen, jaar: seizoenFilter, speciesByEuring });
                exportNestCSV(data, seizoenFilter);
              }}
              title={t('nest_export_csv_title')}
            >
              CSV
            </button>
            <button
              className="btn-secondary nest-export-btn"
              onClick={() => {
                const data = buildNestExportData({ nesten, seizoenen, legsels, bezoeken, ringen, jaar: seizoenFilter, speciesByEuring });
                exportNestJSON(data, seizoenFilter);
              }}
              title={t('nest_export_json_title')}
            >
              JSON
            </button>
          </div>
        </div>
      </div>

      {tab === 'lijst' && (
        <NestenLijst nesten={verrijkteNesten} seizoenFilter={seizoenFilter} navigate={navigate} t={t} />
      )}
      {tab === 'kaart' && (
        <NestenKaart nesten={verrijkteNesten} navigate={navigate} />
      )}
    </div>
  );
}

function NestenLijst({ nesten, seizoenFilter, navigate, t }) {
  if (nesten.length === 0) {
    return (
      <div className="nest-leeg">
        <p>{t('nest_no_nests')}</p>
      </div>
    );
  }

  return (
    <div className="nest-lijst">
      {nesten.map(nest => (
        <button
          key={nest.id}
          className="nest-kaart"
          onClick={() => navigate(`/nest/${nest.id}`)}
        >
          <div className="nest-kaart__hoofd">
            <span className="nest-kaart__nr">#{nest.kastnummer}</span>
            {nest.vogelNaam && <span className="nest-kaart__soort">{nest.vogelNaam}</span>}
          </div>
          <div className="nest-kaart__status">
            {nest.laatsteBezoek ? (
              <>
                <span
                  className="nest-kaart__stadium"
                  style={{ '--stadium-kleur': stadiumKleur(nest.laatsteBezoek.stadium) }}
                >
                  {nest.laatsteBezoek.stadium}
                </span>
                <span className="nest-kaart__datum">{nest.laatsteBezoek.datum}</span>
              </>
            ) : (
              <span className="nest-kaart__geen-bezoek">{t('nest_no_visits_season', { jaar: seizoenFilter })}</span>
            )}
            {nest.aantalBezoeken > 0 && (
              <span className="nest-kaart__tel">{t('nest_visit_count', { count: nest.aantalBezoeken })}</span>
            )}
          </div>
          {nest.omschrijving && (
            <div className="nest-kaart__omschrijving">{nest.omschrijving}</div>
          )}
        </button>
      ))}
    </div>
  );
}

function NestenKaart({ nesten, navigate }) {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const tileLayerRef = useRef(null);
  const [tileType, setTileType] = useState(getTileType);

  useEffect(() => {
    if (mapInstanceRef.current) return;
    let cancelled = false;

    getLeaflet().then(L => {
      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [52.05, 6.2],
        zoom: 12,
        zoomControl: true,
      });

      tileLayerRef.current = addTileLayer(L, map, getTileType());

      mapInstanceRef.current = map;
      setTimeout(() => { if (!cancelled) map.invalidateSize(); }, 100);
    });

    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Markers bijwerken als nestenlijst verandert
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    getLeaflet().then(L => {
      const map = mapInstanceRef.current;
      if (!map) return;

      // Verwijder oude markers
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      const nestenMetCoords = nesten.filter(n => n.lat && n.lon);

      nestenMetCoords.forEach(nest => {
        const kleur = stadiumKleur(nest.laatsteBezoek?.stadium);
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            background:${kleur};
            width:14px;height:14px;
            border-radius:50%;
            border:2px solid #fff;
            box-shadow:0 1px 4px rgba(0,0,0,0.5);
          "></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        const marker = L.marker([parseFloat(nest.lat), parseFloat(nest.lon)], { icon })
          .addTo(map)
          .bindPopup(`<strong>#${nest.kastnummer}</strong>${nest.vogelNaam ? `<br>${nest.vogelNaam}` : ''}${nest.laatsteBezoek ? `<br>${nest.laatsteBezoek.stadium}` : ''}`)
          .on('click', () => navigate(`/nest/${nest.id}`));

        markersRef.current.push(marker);
      });

      // Zoom naar alle markers als er zijn
      if (nestenMetCoords.length > 0) {
        const bounds = L.latLngBounds(nestenMetCoords.map(n => [parseFloat(n.lat), parseFloat(n.lon)]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      }
    });
  }, [nesten, navigate]);

  function toggleTile() {
    const next = tileType === 'osm' ? 'satellite' : 'osm';
    saveTileType(next);
    setTileType(next);
    getLeaflet().then(L => {
      const map = mapInstanceRef.current;
      if (!map) return;
      if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = addTileLayer(L, map, next);
    });
  }

  return (
    <div style={{ position: 'relative' }}>
      <div ref={mapRef} className="nest-kaart-map" />
      <button type="button" className="kaart-tile-toggle" onClick={toggleTile} title={tileType === 'osm' ? t('map_switch_satellite') : t('map_switch_osm')}>
        {tileType === 'osm' ? '🛰️' : '🗺️'}
      </button>
    </div>
  );
}
