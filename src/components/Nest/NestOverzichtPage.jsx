import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNestData } from '../../hooks/useNestData';
import { useNestRole } from '../../hooks/useNestRole';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import 'leaflet/dist/leaflet.css';
import { getTileType, saveTileType, addTileLayer } from '../../utils/leafletTiles';
import { berekenPlanningItems, URGENTIE_KLEUR, BROEDSTATUS, getBroedStatus, formatDatum } from '../../utils/nestPlanning';
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


export default function NestOverzichtPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { canNestAdd } = useNestRole();
  const { nesten, legsels, bezoeken } = useNestData();
  const species = useSpeciesRef();
  const speciesByEuring = useMemo(() => {
    const map = {};
    species.forEach(s => { if (s.euring_code) map[s.euring_code] = s; });
    return map;
  }, [species]);
  const [tab, setTab] = useState('lijst');
  const [zoekterm, setZoekterm] = useState('');

  // Planningsitems per nest (meest urgent item per nest)
  const planningPerNest = useMemo(() => {
    const items = berekenPlanningItems({ nesten, legsels, bezoeken, speciesByEuring, jaar: HUIDIG_JAAR });
    const map = {};
    for (const item of items) {
      if (!map[item.nestId]) map[item.nestId] = item; // eerste = urgentst
    }
    return map;
  }, [nesten, legsels, bezoeken, speciesByEuring]);

  // Verrijkte nestenlijst: voeg laatste bezoek toe (altijd huidig jaar)
  const verrijkteNesten = useMemo(() => {
    const jaar = HUIDIG_JAAR;
    return nesten.map(nest => {
      const legselsInSeizoen = legsels.filter(l => l.nest_id === nest.id && l.jaar === jaar);
      const alleBezoeken = legselsInSeizoen.flatMap(l =>
        bezoeken.filter(b => b.legsel_id === l.id)
      );
      const sortedBezoeken = [...alleBezoeken].sort((a, b) => b.datum.localeCompare(a.datum));
      const laatsteBezoek = sortedBezoeken[0] || null;

      const soortEuring = sortedBezoeken.find(b => b.soort_euring)?.soort_euring
        || legselsInSeizoen.find(l => l.soort_euring)?.soort_euring
        || nest.soort_euring;
      const vogelNaam = soortEuring ? (speciesByEuring[soortEuring]?.naam_nl || soortEuring) : '';

      return { ...nest, legselsInSeizoen, laatsteBezoek, vogelNaam, aantalBezoeken: alleBezoeken.length, planning: planningPerNest[nest.id] || null };
    });
  }, [nesten, legsels, bezoeken, speciesByEuring, planningPerNest]);

  const gefilterdeNesten = useMemo(() => {
    const q = zoekterm.trim().toLowerCase();
    if (!q) return verrijkteNesten;
    return verrijkteNesten.filter(n =>
      String(n.kastnummer).toLowerCase().includes(q) ||
      (n.omschrijving && n.omschrijving.toLowerCase().includes(q)) ||
      (n.vogelNaam && n.vogelNaam.toLowerCase().includes(q)) ||
      (n.locatie && n.locatie.toLowerCase().includes(q))
    );
  }, [verrijkteNesten, zoekterm]);

  return (
    <div className="page nest-overzicht-page">
      <div className="nest-overzicht-header">
        <div className="nest-overzicht-controls">
          <div className="mode-toggle">
            <button className={`mode-btn${tab === 'lijst' ? ' active' : ''}`} onClick={() => setTab('lijst')}>
              {t('nest_tab_list')}
            </button>
            <button className={`mode-btn${tab === 'kaart' ? ' active' : ''}`} onClick={() => setTab('kaart')}>
              {t('nest_tab_map')}
            </button>
          </div>
          {tab === 'lijst' && (
            <input
              className="nest-zoek-input"
              type="search"
              placeholder={t('nest_search_placeholder')}
              value={zoekterm}
              onChange={e => setZoekterm(e.target.value)}
            />
          )}
          {canNestAdd && (
            <button className="btn-primary nest-nieuw-btn" onClick={() => navigate('/nest/nieuw')}>
              + {t('nest_btn_new')}
            </button>
          )}
        </div>
      </div>

      {tab === 'lijst' && (
        <NestenLijst nesten={gefilterdeNesten} navigate={navigate} t={t} zoekterm={zoekterm} />
      )}
      {tab === 'kaart' && (
        <NestenKaart nesten={verrijkteNesten} navigate={navigate} />
      )}
    </div>
  );
}

const TYPE_LABEL_KORT = {
  ringen:     'Ringen',
  nacontrole: 'Nacontrole',
  eileg:      'Eileg',
  jongen:     'Jongen',
  bouw:       'Nestbouw',
  check:      'Bezoek',
};

function NestenLijst({ nesten, navigate, t, zoekterm }) {
  if (nesten.length === 0) {
    return (
      <div className="nest-leeg">
        <p>{zoekterm ? t('nest_search_no_results') : t('nest_no_nests')}</p>
      </div>
    );
  }

  return (
    <div className="nest-lijst">
      {nesten.map(nest => {
        const status = getBroedStatus(nest.laatsteBezoek?.stadium);
        const statusKleur = BROEDSTATUS[status].kleur;
        const plan = nest.planning;
        const planKleur = plan ? URGENTIE_KLEUR[plan.urgentie] : null;
        return (
          <button
            key={nest.id}
            className="nest-kaart"
            style={{ '--status-kleur': statusKleur }}
            onClick={() => navigate(`/nest/${nest.id}`)}
          >
            <div className="nest-kaart__hoofd">
              <span className="nest-kaart__nr">⌂ {nest.kastnummer}</span>
              {nest.omschrijving && <span className="nest-kaart__naam">{nest.omschrijving}</span>}
              {nest.vogelNaam && <span className="nest-kaart__soort">{nest.vogelNaam}</span>}
            </div>
            <div className="nest-kaart__status">
              {nest.laatsteBezoek ? (
                <>
                  <span className="nest-kaart__stadium" style={{ '--stadium-kleur': statusKleur }}>
                    {t(BROEDSTATUS[status].labelKey)}
                  </span>
                  <span className="nest-kaart__datum">{formatDatum(nest.laatsteBezoek.datum)}</span>
                </>
              ) : (
                <span className="nest-kaart__geen-bezoek">{t('nest_no_visits_season', { jaar: HUIDIG_JAAR })}</span>
              )}
              {nest.aantalBezoeken > 0 && (
                <span className="nest-kaart__tel">{t('nest_visit_count', { count: nest.aantalBezoeken })}</span>
              )}
              {plan && (
                <span className="nest-kaart__planning-pill" style={{ '--pill-kleur': planKleur }}>
                  {plan.type ? (TYPE_LABEL_KORT[plan.type] ?? plan.type) + ' · ' : ''}{formatDatum(plan.datum)}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

const LEGENDA = Object.entries(BROEDSTATUS).map(([, v]) => v);

function NestenKaart({ nesten, navigate }) {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const tileLayerRef = useRef(null);
  const [tileType, setTileType] = useState(getTileType);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (mapInstanceRef.current) return;
    let cancelled = false;

    getLeaflet().then(L => {
      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [52.05, 6.2],
        zoom: 12,
        zoomControl: true,
        maxZoom: 19,
      });

      tileLayerRef.current = addTileLayer(L, map, getTileType());

      mapInstanceRef.current = map;
      setTimeout(() => { if (!cancelled) { map.invalidateSize(); setMapReady(true); } }, 100);
    });

    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Markers bijwerken als nestenlijst verandert of kaart gereed is
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
        const kleur = BROEDSTATUS[getBroedStatus(nest.laatsteBezoek?.stadium)].kleur;
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
          .bindTooltip(`<strong>#${nest.kastnummer}</strong>${nest.vogelNaam ? ` — ${nest.vogelNaam}` : ''}${nest.omschrijving ? `<br><em>${nest.omschrijving}</em>` : ''}<br>${t(BROEDSTATUS[getBroedStatus(nest.laatsteBezoek?.stadium)].labelKey)}${nest.laatsteBezoek ? ` · ${formatDatum(nest.laatsteBezoek.datum)}` : ''}`, { direction: 'top', offset: [0, -8] })
          .on('click', () => navigate(`/nest/${nest.id}`));

        markersRef.current.push(marker);
      });

      // Zoom naar alle markers als er zijn
      if (nestenMetCoords.length > 0) {
        const bounds = L.latLngBounds(nestenMetCoords.map(n => [parseFloat(n.lat), parseFloat(n.lon)]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      }
    });
  }, [nesten, navigate, mapReady]); // eslint-disable-line react-hooks/exhaustive-deps

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
    <div>
      <div style={{ position: 'relative' }}>
        <div ref={mapRef} className="nest-kaart-map" />
        <button type="button" className="kaart-tile-toggle" onClick={toggleTile} title={tileType === 'osm' ? t('map_switch_satellite') : t('map_switch_osm')}>
          {tileType === 'osm' ? '🛰️' : '🗺️'}
        </button>
      </div>
      <div className="nest-kaart-legenda">
        {LEGENDA.map(item => (
          <span key={item.kleur} className="nest-kaart-legenda__item">
            <span className="nest-kaart-legenda__stip" style={{ background: item.kleur }} />
            {t(item.labelKey)}
          </span>
        ))}
      </div>
    </div>
  );
}
