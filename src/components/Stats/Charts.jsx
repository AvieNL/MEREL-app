import { useMemo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { parseDate } from '../../utils/statsHelper';
import { buildEersteVangstMap, normalizeRingnummer } from '../../utils/catchHelper';
import { useDisplayNaam } from '../../hooks/useDisplayNaam';
import 'leaflet/dist/leaflet.css';
import { getTileType, saveTileType, addTileLayer } from '../../utils/leafletTiles';

const MAANDEN = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];

// Kaartkleur-constanten — spiegelen de CSS custom properties
// (Leaflet accepteert geen CSS variables, vandaar hex-waarden hier)
const KAART_KLEUR_NIEUW       = '#38bdf8'; // --accent
const KAART_KLEUR_TERUGVANGST = '#22c55e'; // --success
const KAART_KLEUR_EXTERN      = '#ef4444'; // rood — externe meldingen
const KAART_KLEUR_LIJN        = '#f97316'; // --warning-orange

function useContainerWidth(ref) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(ref.current);
    setWidth(ref.current.clientWidth);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

export function BarChartStacked({ data, title }) {
  const containerRef = useRef(null);
  const containerW = useContainerWidth(containerRef);
  const { t } = useTranslation();
  if (!data.length) return <div ref={containerRef} />;

  const maxVal = Math.max(...data.map(d => d.nieuw + d.terugvangst), 1);
  const chartH = 180;
  const padTop = 24;
  const padBottom = 28;
  const padLeft = 32;
  const padRight = 8;
  const barArea = chartH - padTop - padBottom;
  const usableW = containerW - padLeft - padRight;
  const barW = Math.max(12, Math.min(40, (usableW / data.length) - 6));
  const chartW = containerW || 300;

  return (
    <div className="chart-block" ref={containerRef}>
      <h3>{title}</h3>
      {containerW > 0 && (
        <svg viewBox={`0 0 ${chartW} ${chartH}`} width="100%" preserveAspectRatio="xMinYMin meet" className="chart-svg">
          {[0, 0.25, 0.5, 0.75, 1].map(f => {
            const y = padTop + barArea * (1 - f);
            const val = Math.round(maxVal * f);
            return (
              <g key={f}>
                <line x1={padLeft} y1={y} x2={chartW} y2={y} stroke="var(--bg-tertiary)" strokeWidth="1" />
                <text x={padLeft - 4} y={y + 3} textAnchor="end" fill="var(--text-muted)" fontSize="9">{val}</text>
              </g>
            );
          })}
          {data.map((d, i) => {
            const x = padLeft + (usableW / data.length) * i + ((usableW / data.length) - barW) / 2;
            const total = d.nieuw + d.terugvangst;
            const hTotal = (total / maxVal) * barArea;
            const hNieuw = (d.nieuw / maxVal) * barArea;
            const hTerug = (d.terugvangst / maxVal) * barArea;
            const yBase = padTop + barArea - hTotal;
            return (
              <g key={d.jaar}>
                {d.terugvangst > 0 && (
                  <rect x={x} y={yBase} width={barW} height={hTerug} rx="2" fill="var(--success, #22c55e)" />
                )}
                {d.nieuw > 0 && (
                  <rect x={x} y={yBase + hTerug} width={barW} height={hNieuw} rx="2" fill="var(--accent, #38bdf8)" />
                )}
                {total > 0 && (
                  <text x={x + barW / 2} y={yBase - 4} textAnchor="middle" fill="var(--text-secondary)" fontSize="9">{total}</text>
                )}
                <text x={x + barW / 2} y={chartH - 4} textAnchor="middle" fill="var(--text-muted)" fontSize="9">{d.jaar}</text>
              </g>
            );
          })}
        </svg>
      )}
      <div className="chart-legend">
        <span className="chart-legend-item"><span className="chart-dot" style={{ background: 'var(--accent, #38bdf8)' }} /> {t('stats_new')}</span>
        <span className="chart-legend-item"><span className="chart-dot" style={{ background: 'var(--success, #22c55e)' }} /> {t('stats_recatch')}</span>
      </div>
    </div>
  );
}

export function BarChartSimple({ data, title, color }) {
  const containerRef = useRef(null);
  const containerW = useContainerWidth(containerRef);
  if (!data.length) return <div ref={containerRef} />;

  const maxVal = Math.max(...data.map(d => d.count), 1);
  const chartH = 160;
  const padTop = 20;
  const padBottom = 28;
  const padLeft = 32;
  const padRight = 8;
  const barArea = chartH - padTop - padBottom;
  const usableW = containerW - padLeft - padRight;
  const barW = Math.max(12, Math.min(36, (usableW / data.length) - 6));
  const chartW = containerW || 300;

  return (
    <div className="chart-block" ref={containerRef}>
      <h3>{title}</h3>
      {containerW > 0 && (
        <svg viewBox={`0 0 ${chartW} ${chartH}`} width="100%" preserveAspectRatio="xMinYMin meet" className="chart-svg">
          {[0, 0.5, 1].map(f => {
            const y = padTop + barArea * (1 - f);
            const val = Math.round(maxVal * f);
            return (
              <g key={f}>
                <line x1={padLeft} y1={y} x2={chartW} y2={y} stroke="var(--bg-tertiary)" strokeWidth="1" />
                <text x={padLeft - 4} y={y + 3} textAnchor="end" fill="var(--text-muted)" fontSize="9">{val}</text>
              </g>
            );
          })}
          {data.map((d, i) => {
            const x = padLeft + (usableW / data.length) * i + ((usableW / data.length) - barW) / 2;
            const h = (d.count / maxVal) * barArea;
            const y = padTop + barArea - h;
            return (
              <g key={i}>
                {d.count > 0 && (
                  <rect x={x} y={y} width={barW} height={h} rx="2" fill={color || 'var(--accent, #38bdf8)'} />
                )}
                {d.count > 0 && (
                  <text x={x + barW / 2} y={y - 4} textAnchor="middle" fill="var(--text-secondary)" fontSize="9">{d.count}</text>
                )}
                <text x={x + barW / 2} y={chartH - 4} textAnchor="middle" fill="var(--text-muted)" fontSize="9">{d.label}</text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

const DONUT_PALETTE = [
  '#22c55e', '#38bdf8', '#f59e0b', '#a78bfa',
  '#f472b6', '#34d399', '#60a5fa', '#fb923c',
];

export function DonutChart({ data, title }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  if (total === 0) return null;

  const cx = 56, cy = 56, r = 46, innerR = 28;
  let angle = -Math.PI / 2;

  const segments = data.map((d, i) => {
    const sweep = (d.count / total) * 2 * Math.PI;
    const end = angle + sweep;
    const large = sweep > Math.PI ? 1 : 0;
    const cos0 = Math.cos(angle), sin0 = Math.sin(angle);
    const cos1 = Math.cos(end),   sin1 = Math.sin(end);
    const path = [
      `M ${cx + r * cos0} ${cy + r * sin0}`,
      `A ${r} ${r} 0 ${large} 1 ${cx + r * cos1} ${cy + r * sin1}`,
      `L ${cx + innerR * cos1} ${cy + innerR * sin1}`,
      `A ${innerR} ${innerR} 0 ${large} 0 ${cx + innerR * cos0} ${cy + innerR * sin0}`,
      'Z',
    ].join(' ');
    const seg = { ...d, path, color: d.color || DONUT_PALETTE[i % DONUT_PALETTE.length], pct: Math.round((d.count / total) * 100) };
    angle = end;
    return seg;
  });

  return (
    <div className="chart-block">
      <h3>{title}</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <svg width="112" height="112" viewBox="0 0 112 112" style={{ flexShrink: 0 }}>
          {segments.map((seg, i) => (
            <path key={i} d={seg.path} fill={seg.color} />
          ))}
          <text x="56" y="60" textAnchor="middle" fill="var(--text-primary)" fontSize="13" fontWeight="700">{total}</text>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
          {segments.map((seg, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', minWidth: 0 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
              <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{seg.label}</span>
              <span style={{ color: 'var(--text-muted)', marginLeft: 'auto', paddingLeft: 8, whiteSpace: 'nowrap' }}>{seg.count} ({seg.pct}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LineChart({ data, title, xKey, yKey, onPointClick }) {
  const containerRef = useRef(null);
  const containerW = useContainerWidth(containerRef);
  if (!data.length) return <div ref={containerRef} />;

  const maxVal = Math.max(...data.map(d => d[yKey]), 1);
  const chartW = containerW || 300;
  const chartH = 160;
  const padTop = 20;
  const padBottom = 28;
  const padLeft = 32;
  const padRight = 16;
  const plotW = chartW - padLeft - padRight;
  const plotH = chartH - padTop - padBottom;

  const points = data.map((d, i) => {
    const x = padLeft + (data.length === 1 ? plotW / 2 : (i / (data.length - 1)) * plotW);
    const y = padTop + plotH - (d[yKey] / maxVal) * plotH;
    return { x, y, d };
  });

  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="chart-block" ref={containerRef}>
      <h3>{title}</h3>
      {containerW > 0 && (
        <svg viewBox={`0 0 ${chartW} ${chartH}`} width="100%" preserveAspectRatio="xMinYMin meet" className="chart-svg">
          {[0, 0.5, 1].map(f => {
            const y = padTop + plotH * (1 - f);
            const val = Math.round(maxVal * f);
            return (
              <g key={f}>
                <line x1={padLeft} y1={y} x2={chartW - padRight} y2={y} stroke="var(--bg-tertiary)" strokeWidth="1" />
                <text x={padLeft - 4} y={y + 3} textAnchor="end" fill="var(--text-muted)" fontSize="9">{val}</text>
              </g>
            );
          })}
          <polyline points={polyline} fill="none" stroke="var(--accent, #38bdf8)" strokeWidth="2" />
          {points.map((p, i) => (
            <g key={i} style={onPointClick ? { cursor: 'pointer' } : {}} onClick={onPointClick ? () => onPointClick(p.d) : undefined}>
              <circle cx={p.x} cy={p.y} r={onPointClick ? 6 : 4} fill="var(--accent, #38bdf8)" />
              <text x={p.x} y={p.y - 10} textAnchor="middle" fill="var(--text-secondary)" fontSize="9">{p.d[yKey]}</text>
              <text x={p.x} y={chartH - 4} textAnchor="middle" fill="var(--text-muted)" fontSize="9">{p.d[xKey]}</text>
            </g>
          ))}
        </svg>
      )}
    </div>
  );
}

export function VangstKaart({ targetRecords, allRecords, fallbackLat, fallbackLon }) {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const [tileType, setTileType] = useState(getTileType);
  const displayNaam = useDisplayNaam();

  const kaartData = useMemo(() => {
    const eersteVangst = buildEersteVangstMap(allRecords);

    const markers = [];
    const lijnen = [];

    targetRecords.forEach(r => {
      const lat = parseFloat(r.lat);
      const lon = parseFloat(r.lon);
      if (!lat || !lon || isNaN(lat) || isNaN(lon)) return;

      const isNieuw = r.metalenringinfo !== 4 && r.metalenringinfo !== '4';
      const isExtern = r.bron === 'externe_tv_melding' || r.bron === 'externe_ring_info';
      markers.push({
        lat, lon,
        soort: r.vogelnaam ? displayNaam(r.vogelnaam) : '',
        ring: r.ringnummer || '',
        datum: r.vangstdatum || '',
        isNieuw,
        isExtern,
      });

      if (!isNieuw && r.ringnummer) {
        const orig = eersteVangst[normalizeRingnummer(r.ringnummer)];
        if (orig) {
          const oLat = parseFloat(orig.lat) || fallbackLat;
          const oLon = parseFloat(orig.lon) || fallbackLon;
          if (oLat && oLon && !isNaN(oLat) && !isNaN(oLon)) {
            lijnen.push({ from: [oLat, oLon], to: [lat, lon] });
          }
        }
      }
    });

    return { markers, lijnen };
  }, [targetRecords, allRecords, displayNaam, fallbackLat, fallbackLon]);

  useEffect(() => {
    if (!mapRef.current || kaartData.markers.length === 0) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    let destroyed = false;

    import('leaflet').then(({ default: L }) => {
      if (destroyed || !mapRef.current) return;

      const map = L.map(mapRef.current, { scrollWheelZoom: false });
      mapInstanceRef.current = map;

      tileLayerRef.current = addTileLayer(L, map, getTileType());

      const bounds = [];

      kaartData.markers.forEach(m => {
        const color = m.isExtern ? KAART_KLEUR_EXTERN : m.isNieuw ? KAART_KLEUR_NIEUW : KAART_KLEUR_TERUGVANGST;
        const marker = L.circleMarker([m.lat, m.lon], {
          radius: 6,
          fillColor: color,
          color: '#fff',
          weight: 1,
          fillOpacity: 0.8,
        }).addTo(map);
        marker.bindPopup(`<b>${m.soort}</b><br>${m.ring}<br>${m.datum}`);
        bounds.push([m.lat, m.lon]);
      });

      kaartData.lijnen.forEach(l => {
        L.polyline([l.from, l.to], {
          color: KAART_KLEUR_LIJN,
          weight: 2,
          opacity: 0.7,
          dashArray: '6 4',
        }).addTo(map);
      });

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
      }
    });

    return () => {
      destroyed = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [kaartData]);

  if (kaartData.markers.length === 0) return null;

  function toggleTile() {
    const next = tileType === 'osm' ? 'satellite' : 'osm';
    saveTileType(next);
    setTileType(next);
    import('leaflet').then(({ default: L }) => {
      const map = mapInstanceRef.current;
      if (!map) return;
      if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = addTileLayer(L, map, next);
    });
  }

  return (
    <div className="chart-block">
      <h3>{t('stats_catch_locations')}</h3>
      <div style={{ position: 'relative' }}>
        <div ref={mapRef} className="kaart-container" style={{ height: 320 }} />
        <button type="button" className="kaart-tile-toggle" onClick={toggleTile} title={tileType === 'osm' ? t('map_switch_satellite') : t('map_switch_osm')}>
          {tileType === 'osm' ? '🛰️' : '🗺️'}
        </button>
      </div>
      <div className="chart-legend">
        <span className="chart-legend-item"><span className="chart-dot" style={{ background: KAART_KLEUR_NIEUW }} /> {t('stats_new')}</span>
        <span className="chart-legend-item"><span className="chart-dot" style={{ background: KAART_KLEUR_TERUGVANGST }} /> {t('stats_recatch')}</span>
        {kaartData.markers.some(m => m.isExtern) && (
          <span className="chart-legend-item"><span className="chart-dot" style={{ background: KAART_KLEUR_EXTERN }} /> {t('stats_extern')}</span>
        )}
      </div>
    </div>
  );
}

export function useChartData(targetRecords) {
  const perJaar = useMemo(() => {
    const map = {};
    targetRecords.forEach(r => {
      const d = parseDate(r.vangstdatum);
      if (!d) return;
      const jaar = d.getFullYear();
      if (!map[jaar]) map[jaar] = { jaar, nieuw: 0, terugvangst: 0 };
      if (r.metalenringinfo !== 4 && r.metalenringinfo !== '4') {
        map[jaar].nieuw++;
      } else {
        map[jaar].terugvangst++;
      }
    });
    return Object.values(map).sort((a, b) => a.jaar - b.jaar);
  }, [targetRecords]);

  const perMaand = useMemo(() => {
    const counts = Array.from({ length: 12 }, (_, i) => ({ maand: i + 1, count: 0, label: MAANDEN[i] }));
    targetRecords.forEach(r => {
      const d = parseDate(r.vangstdatum);
      if (!d) return;
      counts[d.getMonth()].count++;
    });
    return counts;
  }, [targetRecords]);

  const soortenPerJaar = useMemo(() => {
    const map = {};
    targetRecords.forEach(r => {
      const d = parseDate(r.vangstdatum);
      if (!d) return;
      const jaar = d.getFullYear();
      if (!map[jaar]) map[jaar] = new Set();
      if (r.vogelnaam) map[jaar].add(r.vogelnaam.toLowerCase());
    });
    return Object.entries(map)
      .map(([jaar, set]) => ({ jaar: +jaar, soorten: set.size, soortenSet: set }))
      .sort((a, b) => a.jaar - b.jaar);
  }, [targetRecords]);

  return { perJaar, perMaand, soortenPerJaar };
}
