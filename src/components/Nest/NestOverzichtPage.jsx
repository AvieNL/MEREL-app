import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNestData } from '../../hooks/useNestData';
import { useNestRole } from '../../hooks/useNestRole';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import 'leaflet/dist/leaflet.css';
import { getTileType, saveTileType, addTileLayer } from '../../utils/leafletTiles';
import { BROEDSTATUS, getBroedStatus, formatDatum } from '../../utils/nestPlanning';
import { IconFlag, NestIcoon } from '../shared/Icons';
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

  const [tab, setTab] = useState('lijst');
  const [zoekterm, setZoekterm] = useState('');
  const [filterJaar, setFilterJaar] = useState(new Date().getFullYear());
  const [filterStatus, setFilterStatus] = useState(null);

  const speciesByEuring = useMemo(() => {
    const map = {};
    species.forEach(s => { if (s.euring_code) map[s.euring_code] = s; });
    return map;
  }, [species]);

  // Alle jaren waarvoor legsels bestaan + huidig jaar
  const beschikbareJaren = useMemo(() => {
    const jaren = new Set(legsels.map(l => l.jaar).filter(Boolean));
    jaren.add(HUIDIG_JAAR);
    return [...jaren].sort((a, b) => b - a);
  }, [legsels]);

  // Verrijkte nesten: status/bezoeken op basis van het actuele legsel voor het gekozen jaar
  const verrijkteNesten = useMemo(() => {
    return nesten.map(nest => {
      // Soort voor welke de kast bedoeld is (nest-niveau)
      const kastSoort = nest.soort_euring
        ? (speciesByEuring[nest.soort_euring]?.naam_nl || nest.soort_euring)
        : null;

      // Meest recente legsel (gefilterd op jaar als gekozen)
      const jaarLegsels = legsels
        .filter(l => l.nest_id === nest.id && (filterJaar === null || l.jaar === filterJaar))
        .sort((a, b) => (b.jaar || 0) - (a.jaar || 0) || (b.volgnummer || 0) - (a.volgnummer || 0));
      const actueelLegsel = jaarLegsels[0] || null;

      // Bezoeken: voor status/datum altijd het actuele legsel, voor teller afhankelijk van filter
      const legselBezoekenActueel = actueelLegsel
        ? bezoeken.filter(b => b.legsel_id === actueelLegsel.id)
        : [];
      const sortedBezoeken = [...legselBezoekenActueel].sort((a, b) => b.datum.localeCompare(a.datum));
      const laatsteBezoek = sortedBezoeken[0] || null;

      const aantalBezoeken = filterJaar === null
        ? jaarLegsels.reduce((sum, l) => sum + bezoeken.filter(b => b.legsel_id === l.id).length, 0)
        : legselBezoekenActueel.length;

      return { ...nest, kastSoort, actueelLegsel, aantalBezoeken, laatsteBezoek };
    });
  }, [nesten, legsels, bezoeken, speciesByEuring, filterJaar]);

  // Zoek- en statusfilter
  const gefilterdeNesten = useMemo(() => {
    let result = verrijkteNesten;
    const q = zoekterm.trim().toLowerCase();
    if (q) result = result.filter(n =>
      String(n.kastnummer).toLowerCase().includes(q) ||
      (n.omschrijving && n.omschrijving.toLowerCase().includes(q)) ||
      (n.kastSoort && n.kastSoort.toLowerCase().includes(q)) ||
      (n.adres && n.adres.toLowerCase().includes(q))
    );
    if (filterStatus) result = result.filter(n =>
      getBroedStatus(n.laatsteBezoek?.stadium) === filterStatus
    );
    const STATUS_VOLGORDE = { bouw: 0, eieren: 1, nestjongen: 2, succesvol: 3, mislukt: 4, onbekend: 5, leeg: 6 };
    result = [...result].sort((a, b) => {
      const aStatus = a.actueelLegsel ? getBroedStatus(a.laatsteBezoek?.stadium) : 'leeg';
      const bStatus = b.actueelLegsel ? getBroedStatus(b.laatsteBezoek?.stadium) : 'leeg';
      const statusDiff = (STATUS_VOLGORDE[aStatus] ?? 6) - (STATUS_VOLGORDE[bStatus] ?? 6);
      if (statusDiff !== 0) return statusDiff;
      const aNaam = String(a.kastnummer || '') + (a.omschrijving || '');
      const bNaam = String(b.kastnummer || '') + (b.omschrijving || '');
      return aNaam.localeCompare(bNaam, undefined, { numeric: true });
    });
    return result;
  }, [verrijkteNesten, zoekterm, filterStatus]);

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
          <input
            className="nest-zoek-input"
            type="search"
            placeholder={t('nest_search_placeholder')}
            value={zoekterm}
            onChange={e => setZoekterm(e.target.value)}
          />
          {canNestAdd && (
            <button className="btn-primary nest-nieuw-btn" onClick={() => navigate('/nest/nieuw')}>
              + {t('nest_btn_new')}
            </button>
          )}
        </div>
        <div className="nest-filters">
        <div className="nest-jaar-filter">
          <button
            className={`nest-jaar-btn${filterJaar === null ? ' active' : ''}`}
            onClick={() => setFilterJaar(null)}
          >{t('nest_filter_alle_jaren')}</button>
          {beschikbareJaren.map(jaar => (
            <button
              key={jaar}
              className={`nest-jaar-btn${filterJaar === jaar ? ' active' : ''}`}
              onClick={() => setFilterJaar(jaar)}
            >{jaar}</button>
          ))}
        </div>
        <div className="nest-status-filter">
          <button
            className={`nest-status-btn${filterStatus === null ? ' active' : ''}`}
            onClick={() => setFilterStatus(null)}
          >{t('nest_filter_alle_statussen')}</button>
          {Object.entries(BROEDSTATUS).map(([key, cfg]) => (
            <button
              key={key}
              className={`nest-status-btn${filterStatus === key ? ' active' : ''}`}
              style={{ '--s-kleur': cfg.kleur }}
              onClick={() => setFilterStatus(filterStatus === key ? null : key)}
            >{t(cfg.labelKey)}</button>
          ))}
        </div>
        </div>
      </div>

      {tab === 'lijst' && (
        <NestenLijst nesten={gefilterdeNesten} navigate={navigate} t={t} zoekterm={zoekterm} filterJaar={filterJaar} />
      )}
      {tab === 'kaart' && (
        <NestenKaart nesten={gefilterdeNesten} navigate={navigate} t={t} filterJaar={filterJaar} />
      )}
    </div>
  );
}

function NestenLijst({ nesten, navigate, t, zoekterm, filterJaar }) {
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
        const { kleur: statusKleur, labelKey: statusLabelKey } = BROEDSTATUS[status];
        const heeftLegsel = !!nest.actueelLegsel;

        return (
          <button
            key={nest.id}
            className={`nest-kaart${heeftLegsel ? '' : ' nest-kaart--geen-legsel'}`}
            style={{ '--status-kleur': heeftLegsel ? statusKleur : 'var(--border)' }}
            onClick={() => navigate(`/nest/${nest.id}`)}
          >
            <div className="nest-kaart__inhoud">
              <div className="nest-kaart__tekst">
                <div className="nest-kaart__hoofd">
                  <span className="nest-kaart__nr"><NestIcoon nest={nest} size={16} /> {nest.kastnummer}</span>
                  {nest.omschrijving && <span className="nest-kaart__naam">{nest.omschrijving}</span>}
                  {nest.adres && <span className="nest-kaart__adres">{nest.adres}</span>}
                  {nest.kastSoort && <span className="nest-kaart__soort">{nest.kastSoort}</span>}
                </div>
                {nest.toelichting && (
                  <p className="nest-kaart__toelichting">{nest.toelichting}</p>
                )}
                <div className="nest-kaart__status">
                  {heeftLegsel ? (
                    <>
                      <span className="nest-kaart__stadium" style={{ '--stadium-kleur': statusKleur }}>
                        <IconFlag size={11} />{t(statusLabelKey)}
                      </span>
                      {nest.laatsteBezoek ? (
                        <span className="nest-kaart__datum">
                          <span className="nest-kaart__datum-label">{t('nest_laatste_bezoek')}</span>
                          {formatDatum(nest.laatsteBezoek.datum)}
                        </span>
                      ) : null}
                    </>
                  ) : (
                    <span className="nest-kaart__geen-legsel">
                      {filterJaar === null ? t('nest_geen_legsel') : t('nest_geen_legsel_jaar', { jaar: filterJaar })}
                    </span>
                  )}
                </div>
              </div>
              {nest.fotos?.[0] && (
                <img className="nest-kaart__foto" src={nest.fotos[0]} alt="" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

const LEGENDA = Object.entries(BROEDSTATUS).map(([, v]) => v);

function NestenKaart({ nesten, navigate, t, filterJaar }) {
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
      const map = L.map(mapRef.current, { center: [52.05, 6.2], zoom: 12, zoomControl: true, maxZoom: 19 });
      tileLayerRef.current = addTileLayer(L, map, getTileType());
      mapInstanceRef.current = map;
      setTimeout(() => { if (!cancelled) { map.invalidateSize(); setMapReady(true); } }, 100);
    });

    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    getLeaflet().then(L => {
      const map = mapInstanceRef.current;
      if (!map) return;
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      const nestenMetCoords = nesten.filter(n => n.lat && n.lon);
      nestenMetCoords.forEach(nest => {
        const status = getBroedStatus(nest.laatsteBezoek?.stadium);
        const kleur = nest.actueelLegsel ? BROEDSTATUS[status].kleur : '#64748b';
        const icon = L.divIcon({
          className: '',
          html: `<div style="background:${kleur};width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.5)"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        const statusTekst = nest.actueelLegsel
          ? t(BROEDSTATUS[status].labelKey)
          : t('nest_geen_legsel_jaar', { jaar: filterJaar });
        const icoonTxt = nest.locatie_type === 'nest' ? '○' : '⌂';
        const tooltip = `<strong>${icoonTxt} ${nest.kastnummer}</strong>${nest.omschrijving ? ` — ${nest.omschrijving}` : ''}${nest.kastSoort ? `<br><em>${nest.kastSoort}</em>` : ''}<br>${statusTekst}${nest.laatsteBezoek ? ` · ${formatDatum(nest.laatsteBezoek.datum)}` : ''}`;
        const marker = L.marker([parseFloat(nest.lat), parseFloat(nest.lon)], { icon })
          .addTo(map)
          .bindTooltip(tooltip, { direction: 'top', offset: [0, -8] })
          .on('click', () => navigate(`/nest/${nest.id}`));
        markersRef.current.push(marker);
      });

      if (nestenMetCoords.length > 0) {
        const bounds = L.latLngBounds(nestenMetCoords.map(n => [parseFloat(n.lat), parseFloat(n.lon)]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      }
    });
  }, [nesten, navigate, mapReady, filterJaar]); // eslint-disable-line react-hooks/exhaustive-deps

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
