import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'leaflet/dist/leaflet.css';
import { getTileType, saveTileType, addTileLayer } from '../../utils/leafletTiles';
import './LocatiePicker.css';

// Fix Leaflet default marker icons (Vite asset handling)
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

function detectPlatform() {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'other';
}

export default function LocatiePicker({ lat, lon, onChange, latError, lonError }) {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const tileLayerRef = useRef(null);
  const gpsZoomRef = useRef(false);
  const [gpsStatus, setGpsStatus] = useState(null); // null | 'loading' | 'error' | 'denied' | 'unavailable'
  const [tileType, setTileType] = useState(getTileType);

  const hasCoords = lat !== '' && lon !== '' && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lon));
  const center = hasCoords
    ? [parseFloat(lat), parseFloat(lon)]
    : [52.05, 6.2]; // Breedenbroek/Gelderland

  // Init map once
  useEffect(() => {
    if (mapInstanceRef.current) return;
    let cancelled = false;

    getLeaflet().then(L => {
      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center,
        zoom: hasCoords ? 13 : 9,
        zoomControl: true,
      });

      tileLayerRef.current = addTileLayer(L, map, getTileType());

      if (hasCoords) {
        markerRef.current = L.marker(center, { draggable: true }).addTo(map);
        markerRef.current.on('dragend', () => {
          const pos = markerRef.current.getLatLng();
          onChange(pos.lat.toFixed(6), pos.lng.toFixed(6));
        });
      }

      map.on('click', e => {
        const { lat: clickLat, lng: clickLng } = e.latlng;
        onChange(clickLat.toFixed(6), clickLng.toFixed(6));
        if (!markerRef.current) {
          markerRef.current = L.marker([clickLat, clickLng], { draggable: true }).addTo(map);
          markerRef.current.on('dragend', () => {
            const pos = markerRef.current.getLatLng();
            onChange(pos.lat.toFixed(6), pos.lng.toFixed(6));
          });
        } else {
          markerRef.current.setLatLng([clickLat, clickLng]);
        }
      });

      mapInstanceRef.current = map;

      // Forceer herberekening van container-afmetingen na mount
      setTimeout(() => { if (!cancelled) map.invalidateSize(); }, 100);
    });

    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync marker when lat/lon change externally
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    getLeaflet().then(L => {
      if (!hasCoords) return;
      const pos = [parseFloat(lat), parseFloat(lon)];
      if (!markerRef.current) {
        markerRef.current = L.marker(pos, { draggable: true }).addTo(map);
        markerRef.current.on('dragend', () => {
          const p = markerRef.current.getLatLng();
          onChange(p.lat.toFixed(6), p.lng.toFixed(6));
        });
      } else {
        markerRef.current.setLatLng(pos);
      }
      const targetZoom = gpsZoomRef.current ? 18 : Math.max(map.getZoom(), 13);
      gpsZoomRef.current = false;
      map.setView(pos, targetZoom);
    });
  }, [lat, lon]); // eslint-disable-line react-hooks/exhaustive-deps

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

  function useGPS() {
    if (!navigator.geolocation) {
      setGpsStatus('unavailable');
      return;
    }
    setGpsStatus('loading');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setGpsStatus(null);
        gpsZoomRef.current = true;
        onChange(pos.coords.latitude.toFixed(6), pos.coords.longitude.toFixed(6));
      },
      err => {
        if (err.code === 1) setGpsStatus('denied');
        else setGpsStatus('error');
      },
      { enableHighAccuracy: true, timeout: 20000 }
    );
  }

  return (
    <div className="locatie-picker">
      <div className="kaart-map-wrapper">
        <div ref={mapRef} className="locatie-map" />
        <button type="button" className="kaart-tile-toggle" onClick={toggleTile} title={tileType === 'osm' ? t('map_switch_satellite') : t('map_switch_osm')}>
          {tileType === 'osm' ? '🛰️' : '🗺️'}
        </button>
      </div>
      <div className="locatie-coords">
        <div className={`form-group${latError ? ' form-group--error' : ''}`}>
          <label>{t('loc_lat')}</label>
          <input
            type="text"
            inputMode="decimal"
            value={lat}
            onChange={e => onChange(e.target.value, lon)}
            placeholder={t('loc_lat_placeholder')}
          />
        </div>
        <div className={`form-group${lonError ? ' form-group--error' : ''}`}>
          <label>{t('loc_lon')}</label>
          <input
            type="text"
            inputMode="decimal"
            value={lon}
            onChange={e => onChange(lat, e.target.value)}
            placeholder={t('loc_lon_placeholder')}
          />
        </div>
      </div>
      <button type="button" className="btn-secondary gps-btn" onClick={useGPS} disabled={gpsStatus === 'loading'}>
        {gpsStatus === 'loading' ? t('loc_loading') : t('loc_gps_btn')}
      </button>
      {gpsStatus === 'denied' && (
        <span className="field-warning">
          {t('loc_gps_denied')}
          {detectPlatform() === 'ios' && (
            <span className="gps-instructions"> {t('loc_gps_denied_ios')}</span>
          )}
          {detectPlatform() === 'android' && (
            <span className="gps-instructions"> {t('loc_gps_denied_android')}</span>
          )}
        </span>
      )}
      {(gpsStatus === 'error' || gpsStatus === 'unavailable') && (
        <span className="field-warning">{t('loc_gps_error')}</span>
      )}
      {!hasCoords && gpsStatus !== 'loading' && (
        <span className="field-hint">{t('loc_hint')}</span>
      )}
    </div>
  );
}
