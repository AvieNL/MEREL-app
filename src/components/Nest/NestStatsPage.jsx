import { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useModuleSwitch } from '../../App';
import { useNestData } from '../../hooks/useNestData';
import AviNestImportSection from './AviNestImportSection';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import { useRecords } from '../../hooks/useRecords';
import { useToast } from '../../context/ToastContext';
import { BarChartSimple, DonutChart, GroupedBarChart, LineChart } from '../Stats/Charts';
import { HABITAT_CODES, NESTTYPE_CODES, NESTPLAATS_CODES, STADIUM_CODES } from '../../data/sovon-codes';
import {
  buildNestExportData, exportNestJSONBackup,
  exportNestCSV, exportAviNestTXT, exportAviNestXML,
} from '../../utils/nestExport';
import { formatDatum } from '../../utils/nestPlanning';
import { NestIcoon } from '../shared/Icons';
import '../Stats/StatsPage.css';
import './NestOverzichtPage.css';

// Lookup maps voor labels
const habitatLabel    = Object.fromEntries(HABITAT_CODES.map(c    => [c.code, c.nl]));
const nesttypeLabel   = Object.fromEntries(NESTTYPE_CODES.map(c   => [c.code, c.nl]));
const nestplaatsLabel = Object.fromEntries(NESTPLAATS_CODES.map(c => [c.code, c.nl]));
const stadiumLabel    = Object.fromEntries(STADIUM_CODES.map(c    => [c.code, c.nl]));

// ── Helpers ────────────────────────────────────────────────────────────────
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

// vangstdatum is dd-mm-yyyy → omzetten naar yyyy-mm-dd voor vergelijking en new Date()
function toISO(d) {
  if (!d) return '';
  const p = String(d).split('-');
  if (p.length !== 3) return d;
  if (p[0].length === 4) return d; // al ISO
  return `${p[2]}-${p[1].padStart(2, '0')}-${p[0].padStart(2, '0')}`;
}

function dagenTussen(d1, d2) {
  const t1 = new Date(toISO(d1)).getTime();
  const t2 = new Date(toISO(d2)).getTime();
  if (isNaN(t1) || isNaN(t2)) return null;
  return Math.round((t2 - t1) / 86_400_000);
}

function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Kleuren per nesttype (code → [fill, stroke])
const NESTTYPE_KLEUREN = {
  '-1': ['#94a3b8', '#64748b'], // Onbekend — grijs
   '0': ['#22c55e', '#16a34a'], // Zelf gebouwd — groen
   '1': ['#a78bfa', '#7c3aed'], // Van andere soort — paars
   '2': ['#38bdf8', '#0284c7'], // Nestkast — blauw
   '3': ['#f59e0b', '#d97706'], // Holte — amber
   '4': ['#94a3b8', '#64748b'], // Overig — grijs
   '5': ['#fb923c', '#ea580c'], // Nest uit eerder jaar — oranje
   '6': ['#facc15', '#ca8a04'], // Hergebruikt nest — geel
};

function nesttypeKleur(type) {
  return NESTTYPE_KLEUREN[String(type ?? -1)] ?? NESTTYPE_KLEUREN['-1'];
}

// ── Kaart voor nestenlocaties ───────────────────────────────────────────────
function NestKaart({ nesten }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const markers = useMemo(() =>
    nesten.filter(n => n.lat && n.lon && !isNaN(parseFloat(n.lat))),
    [nesten]
  );

  useEffect(() => {
    if (!mapRef.current || markers.length === 0) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    let destroyed = false;

    import('leaflet').then(({ default: L }) => {
      if (destroyed || !mapRef.current) return;

      const map = L.map(mapRef.current, { scrollWheelZoom: false });
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      const bounds = [];
      markers.forEach(n => {
        const lat = parseFloat(n.lat);
        const lon = parseFloat(n.lon);
        bounds.push([lat, lon]);

        const [fill, stroke] = nesttypeKleur(n.nesttype);
        const marker = L.circleMarker([lat, lon], {
          radius: 7,
          fillColor: fill,
          color: stroke,
          weight: 1.5,
          fillOpacity: 0.85,
        }).addTo(map);

        const label = [
          `<strong>Kast ${n.kastnummer}</strong>`,
          n.omschrijving || '',
        ].filter(Boolean).join('<br/>');
        marker.bindPopup(label);
      });

      if (bounds.length === 1) {
        map.setView(bounds[0], 14);
      } else if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    });

    return () => {
      destroyed = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [markers]);

  const gebruikteTypes = useMemo(() => {
    const seen = new Map();
    markers.forEach(n => {
      const code = n.nesttype ?? -1;
      if (!seen.has(code)) seen.set(code, nesttypeLabel[code] ?? 'Onbekend');
    });
    return [...seen.entries()].sort((a, b) => a[0] - b[0]);
  }, [markers]);

  if (markers.length === 0) return null;

  return (
    <div className="section">
      <h3>Nestenkaart</h3>
      <div ref={mapRef} style={{ height: 280, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }} />
      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
        {markers.length} van {nesten.length} nesten met GPS-coördinaten
      </p>
      {gebruikteTypes.length > 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 6 }}>
          {gebruikteTypes.map(([code, label]) => {
            const [fill] = nesttypeKleur(code);
            return (
              <span key={code} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill={fill} /></svg>
                {label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────
function computeNestStats({ nesten, legsels, bezoeken, ringen, speciesByEuring, jaar }) {
  const nestenById    = Object.fromEntries(nesten.map(n => [n.id, n]));
  const legselsInJaar = jaar != null ? legsels.filter(l => l.jaar === jaar) : legsels;
  const legselIds     = new Set(legselsInJaar.map(l => l.id));
  const bezoekenInJaar = bezoeken.filter(b => legselIds.has(b.legsel_id));
  const bezoekIds     = new Set(bezoekenInJaar.map(b => b.id));
  const ringenInJaar  = ringen.filter(r => bezoekIds.has(r.nestbezoek_id));

  const nestenMet = new Set(legselsInJaar.map(l => l.nest_id));

  // Per soort — soort staat op het nest, niet het legsel
  const perSoort = {};
  legselsInJaar.forEach(l => {
    const nest = nestenById[l.nest_id];
    const key  = l.soort_euring || nest?.soort_euring || 'onbekend';
    if (!perSoort[key]) perSoort[key] = { naam: speciesByEuring[key]?.naam_nl || key, legsels: 0, eieren: 0, pulli: 0, succes: 0, mislukt: 0 };
    perSoort[key].legsels++;

    // Hoogste eiertelling per legsel
    const bezoekenVanLegsel = bezoekenInJaar.filter(b => b.legsel_id === l.id);
    const maxEieren = Math.max(0, ...bezoekenVanLegsel.map(b => b.aantal_eieren || 0));
    perSoort[key].eieren += maxEieren;

    // Geringde pulli
    perSoort[key].pulli += ringenInJaar.filter(r =>
      bezoekenVanLegsel.some(b => b.id === r.nestbezoek_id)
    ).length;

    // Nestsucces staat op het legsel (opgeslagen bij afsluitend C/X0-bezoek)
    const heeftAfsluitend = bezoekenVanLegsel.some(
      b => b.stadium?.startsWith('C') || b.stadium === 'X0'
    );
    const ns = l.nestsucces;
    if (ns != null) {
      if (ns > 0) perSoort[key].succes++;
      else perSoort[key].mislukt++;
    } else if (heeftAfsluitend && bezoekenVanLegsel.some(b => b.stadium === 'X0')) {
      // X0-bezoek maar nestsucces niet ingevuld = mislukt
      perSoort[key].mislukt++;
    }
  });

  // Stadiumverdeling (laatste bezoek per legsel)
  const stadiumTelling = {};
  legselsInJaar.forEach(l => {
    const laatste = bezoekenInJaar
      .filter(b => b.legsel_id === l.id)
      .sort((a, b) => b.datum.localeCompare(a.datum))[0];
    if (laatste?.stadium) {
      stadiumTelling[laatste.stadium] = (stadiumTelling[laatste.stadium] || 0) + 1;
    }
  });

  // Totaal eieren, pulli, uitgevlogen (max per legsel, gesommeerd)
  let totaalEieren = 0, totaalPulli = 0, totaalUitgevlogen = 0;
  legselsInJaar.forEach(l => {
    const bvl = bezoekenInJaar.filter(b => b.legsel_id === l.id);
    totaalEieren     += Math.max(0, ...bvl.map(b => b.aantal_eieren ?? 0));
    totaalPulli      += Math.max(0, ...bvl.map(b => b.aantal_pulli  ?? 0));
    totaalUitgevlogen += Math.max(0, ...bvl.map(b => b.nestsucces   ?? 0));
  });

  const aantalAfgerond = legselsInJaar.filter(l =>
    bezoekenInJaar.some(b => b.legsel_id === l.id && (b.stadium?.startsWith('C') || b.stadium === 'X0'))
  ).length;

  return {
    aantalNestenMet:   nestenMet.size,
    aantalLegsels:     legselsInJaar.length,
    aantalBezoeken:    bezoekenInJaar.length,
    aantalRingen:      ringenInJaar.length,
    totaalEieren,
    totaalPulli,
    totaalUitgevlogen,
    aantalAfgerond,
    perSoort:          Object.values(perSoort).sort((a, b) => b.legsels - a.legsels),
    stadiumTelling,
  };
}

// ── Hoofdcomponent ─────────────────────────────────────────────────────────
// ── Stamboom-helpers ────────────────────────────────────────────────────────

/**
 * Bouwt stamboomstatistieken op basis van legsel_ouder (oudervogels) en nestring (geringde jongen).
 * Een generatieketen: ouder in legsel A → was zelf jong in legsel B → ...
 */
function computeStamboom({ legsels, bezoeken, nestring, ouders, nesten, vangsten, filterJaar }) {
  if (ouders.length === 0) return null;

  const bezoekById  = new Map(bezoeken.map(b => [b.id, b]));
  const legselById  = new Map(legsels.map(l => [l.id, l]));
  const nestById    = new Map(nesten.map(n => [n.id, n]));
  const vangstById  = new Map((vangsten || []).map(v => [v.id, v]));

  const normRing = r => (r || '').replace(/[\s.]/g, '').toUpperCase();

  // ring → nestring entry (voor vangst_id koppeling)
  const nestringByRing = new Map();
  nestring.forEach(r => {
    const ring = normRing(r.ringnummer);
    if (!ring || nestringByRing.has(ring)) return;
    nestringByRing.set(ring, r);
  });

  // ring → legsel_id (geboortelegsel)
  const geboorteLegsel = new Map();
  nestring.forEach(r => {
    const ring = normRing(r.ringnummer);
    if (!ring || geboorteLegsel.has(ring)) return;
    const bezoek = bezoekById.get(r.nestbezoek_id);
    if (bezoek) geboorteLegsel.set(ring, bezoek.legsel_id);
  });

  // legsel_id → Set<ringnummer> van geringde jongen
  const jongenPerLegsel = new Map();
  nestring.forEach(r => {
    const ring = normRing(r.ringnummer);
    if (!ring) return;
    const bezoek = bezoekById.get(r.nestbezoek_id);
    if (!bezoek) return;
    const legselId = bezoek.legsel_id;
    if (!jongenPerLegsel.has(legselId)) jongenPerLegsel.set(legselId, new Set());
    jongenPerLegsel.get(legselId).add(ring);
  });

  // ring → [legsel_id] waar deze vogel als ouder gekoppeld is
  const legselsAlsOuder = new Map();
  ouders.forEach(o => {
    const ring = normRing(o.ringnummer);
    if (!ring) return;
    if (!legselsAlsOuder.has(ring)) legselsAlsOuder.set(ring, []);
    legselsAlsOuder.get(ring).push(o.legsel_id);
  });

  // ── Generatiediepte per legsel (diepste nakomelingenketen) ──
  const memo = new Map();
  function diepte(legselId, bezocht = new Set()) {
    if (memo.has(legselId)) return memo.get(legselId);
    if (bezocht.has(legselId)) return 0;
    bezocht.add(legselId);
    const jongen = jongenPerLegsel.get(legselId) || new Set();
    let maxKind = 0;
    for (const ring of jongen) {
      for (const kindLegselId of (legselsAlsOuder.get(ring) || [])) {
        const d = diepte(kindLegselId, new Set(bezocht));
        if (d > maxKind) maxKind = d;
      }
    }
    const result = 1 + maxKind;
    memo.set(legselId, result);
    return result;
  }

  const relevanteLegselIds = new Set([
    ...ouders.map(o => o.legsel_id),
    ...[...jongenPerLegsel.keys()],
  ]);
  const dieptes = [];
  for (const legselId of relevanteLegselIds) {
    const ouderRingen = ouders.filter(o => o.legsel_id === legselId).map(o => normRing(o.ringnummer));
    const heeftOuders = ouderRingen.length > 0;
    const isWortel = ouderRingen.every(ring => !geboorteLegsel.has(ring));
    if (isWortel) {
      const d = diepte(legselId);
      // Toon als er ouders gekoppeld zijn (d >= 1) of als er een echte keten is (d > 1)
      if (heeftOuders || d > 1) dieptes.push({ legselId, generaties: d });
    }
  }
  const topBomen = dieptes.sort((a, b) => b.generaties - a.generaties).slice(0, 5);

  // ── Meest productieve ouders ──
  const oudertelling = new Map();
  ouders.forEach(o => {
    const ring = normRing(o.ringnummer);
    if (!ring) return;
    if (filterJaar !== null) {
      const legsel = legselById.get(o.legsel_id);
      if (!legsel || legsel.jaar !== filterJaar) return;
    }
    if (!oudertelling.has(ring)) {
      oudertelling.set(ring, { ring, naam: o.naam_vogel || '', geslacht: o.geslacht, legselIds: [], vangst_id: o.vangst_id });
    }
    const entry = oudertelling.get(ring);
    entry.legselIds.push(o.legsel_id);
    if (!entry.naam && o.naam_vogel) entry.naam = o.naam_vogel;
  });

  const topOuders = [...oudertelling.values()]
    .map(e => ({
      ...e,
      aantalLegsels: e.legselIds.length,
      aantalJongen: e.legselIds.reduce((sum, lId) => sum + (jongenPerLegsel.get(lId)?.size || 0), 0),
    }))
    .sort((a, b) => b.aantalLegsels !== a.aantalLegsels ? b.aantalLegsels - a.aantalLegsels : b.aantalJongen - a.aantalJongen)
    .slice(0, 10);

  // ── Bouw stamboom-weergave voor top-bomen ──
  // Elk legsel-knooppunt bevat ALLE geringde jongen (ook zonder nakomelingen = broers/zussen)
  function bouwTak(legselId, bezocht = new Set(), diepteMax = 6) {
    if (bezocht.has(legselId) || bezocht.size >= diepteMax) return null;
    bezocht.add(legselId);
    const legsel = legselById.get(legselId);
    const nest = legsel ? nestById.get(legsel.nest_id) : null;
    const ouderRingen = ouders.filter(o => o.legsel_id === legselId);

    // Alle geringde jongen in dit legsel, inclusief broers/zussen zonder nakomelingen
    const jongenRingen = [...(jongenPerLegsel.get(legselId) || [])].sort();
    const alleJongen = jongenRingen.map(ring => {
      const kindLegsels = (legselsAlsOuder.get(ring) || [])
        .map(kindId => bouwTak(kindId, new Set(bezocht), diepteMax))
        .filter(Boolean);
      const nestr = nestringByRing.get(ring);
      const vangst = nestr?.vangst_id ? vangstById.get(nestr.vangst_id) : null;
      const naam = vangst?.vogelnaam
        ? vangst.vogelnaam.charAt(0).toUpperCase() + vangst.vogelnaam.slice(1)
        : '';
      return { ring, naam, heeftNakomelingen: kindLegsels.length > 0, kindLegsels };
    });

    return { legselId, legsel, nest, ouderRingen, alleJongen };
  }

  // Controleer recursief of een tak een legsel bevat uit het geselecteerde jaar
  function takBevatJaar(tak, jaar) {
    if (!tak) return false;
    if (tak.legsel?.jaar === jaar) return true;
    return tak.alleJongen?.some(jong =>
      jong.kindLegsels?.some(kindTak => takBevatJaar(kindTak, jaar))
    ) ?? false;
  }

  const stamBomen = topBomen
    .map(({ legselId, generaties }) => ({ generaties, boom: bouwTak(legselId) }))
    .filter(({ boom }) => !filterJaar || takBevatJaar(boom, filterJaar));

  return { topOuders, stamBomen };
}

// ── Eigenaar rapport helpers ──────────────────────────────────────────────────
function svgLocatieKaart(perNest) {
  const pts = perNest.filter(n => n.lat && n.lon && !isNaN(parseFloat(n.lat)) && !isNaN(parseFloat(n.lon)));
  if (pts.length === 0) return '';
  const W = 480, H = 200, PL = 20, PR = 20, PT = 16, PB = 16;
  const lats = pts.map(n => parseFloat(n.lat));
  const lons = pts.map(n => parseFloat(n.lon));
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLon = Math.min(...lons), maxLon = Math.max(...lons);
  const lr = (maxLat - minLat) || 0.001, lonr = (maxLon - minLon) || 0.001;
  const m = 0.35;
  const el = minLat - lr * m, eu = maxLat + lr * m;
  const ew = minLon - lonr * m, ee = maxLon + lonr * m;
  const toX = lon => PL + ((lon - ew) / (ee - ew)) * (W - PL - PR);
  const toY = lat => H - PB - ((lat - el) / (eu - el)) * (H - PT - PB);
  const COLORS = ['#1e3a5f','#16a34a','#dc2626','#d97706','#7c3aed','#0284c7','#b45309','#065f46'];
  const dots = pts.map((n, i) => {
    const x = toX(parseFloat(n.lon)), y = toY(parseFloat(n.lat));
    const col = COLORS[i % COLORS.length];
    const label = n.kastnummer + (n.omschrijving ? ` — ${n.omschrijving}` : '');
    const lx = x + 10, anchor = 'start';
    return `<circle cx="${x}" cy="${y}" r="7" fill="${col}" stroke="white" stroke-width="1.5"/>
      <text x="${lx}" y="${y + 4}" font-size="9" font-family="system-ui,sans-serif" fill="${col}" font-weight="600" text-anchor="${anchor}">${label}</text>`;
  }).join('');
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="border:1px solid #e2e8f0;border-radius:6px;background:#eef4fb;display:block;max-width:100%">
    <rect x="${PL}" y="${PT}" width="${W-PL-PR}" height="${H-PT-PB}" rx="4" fill="#ddeeff" stroke="#c7d9ee" stroke-width="0.8"/>
    <line x1="${PL}" y1="${(PT+H-PB)/2}" x2="${W-PR}" y2="${(PT+H-PB)/2}" stroke="#c7d9ee" stroke-width="0.5"/>
    <line x1="${(PL+W-PR)/2}" y1="${PT}" x2="${(PL+W-PR)/2}" y2="${H-PB}" stroke="#c7d9ee" stroke-width="0.5"/>
    ${dots}
  </svg>`;
}

function svgJaarGrafiek(legselsPerJaar) {
  if (legselsPerJaar.length === 0) return '';
  const W = 480, H = 180, PL = 32, PR = 16, PT = 16, PB = 28;
  const cW = W - PL - PR, cH = H - PT - PB;
  const maxL = Math.max(...legselsPerJaar.map(d => d.legsels), 1);
  const maxU = Math.max(...legselsPerJaar.map(d => d.uitgevlogen), 0);
  const maxVal = Math.max(maxL, maxU, 1);
  const n = legselsPerJaar.length;
  const groupW = cW / n;
  const bW = Math.min(groupW * 0.28, 18);
  const yLines = [0.25, 0.5, 0.75, 1].map(f => {
    const y = PT + cH - f * cH;
    const val = Math.round(f * maxVal);
    return `<line x1="${PL}" y1="${y}" x2="${W-PR}" y2="${y}" stroke="#e2e8f0" stroke-width="0.8"/>
      <text x="${PL-3}" y="${y+3}" font-size="7" text-anchor="end" fill="#94a3b8" font-family="system-ui,sans-serif">${val}</text>`;
  }).join('');
  const bars = legselsPerJaar.map((d, i) => {
    const cx = PL + i * groupW + groupW / 2;
    const lH = (d.legsels / maxVal) * cH;
    const uH = (d.uitgevlogen / maxVal) * cH;
    return `<rect x="${cx - bW - 1}" y="${PT + cH - lH}" width="${bW}" height="${lH}" fill="#1e3a5f" opacity="0.8" rx="2"/>
      <rect x="${cx + 1}" y="${PT + cH - uH}" width="${bW}" height="${uH}" fill="#16a34a" opacity="0.85" rx="2"/>
      <text x="${cx}" y="${H - PB + 12}" font-size="9" text-anchor="middle" fill="#475569" font-family="system-ui,sans-serif">${d.jaar}</text>`;
  }).join('');
  const legendY = PT + 8;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block;max-width:100%">
    <line x1="${PL}" y1="${PT}" x2="${PL}" y2="${PT+cH}" stroke="#cbd5e1" stroke-width="1"/>
    <line x1="${PL}" y1="${PT+cH}" x2="${W-PR}" y2="${PT+cH}" stroke="#cbd5e1" stroke-width="1"/>
    ${yLines}${bars}
    <rect x="${W-PR-100}" y="${legendY}" width="10" height="10" fill="#1e3a5f" opacity="0.8" rx="2"/>
    <text x="${W-PR-87}" y="${legendY+8}" font-size="8" fill="#475569" font-family="system-ui,sans-serif">Legsels</text>
    <rect x="${W-PR-50}" y="${legendY}" width="10" height="10" fill="#16a34a" opacity="0.85" rx="2"/>
    <text x="${W-PR-37}" y="${legendY+8}" font-size="8" fill="#475569" font-family="system-ui,sans-serif">Uitgevlogen</text>
  </svg>`;
}

function generateRapportHTML({ eigenaar, jaar, info, stats, succes, successPct, perNest, legselsPerJaar }) {
  const datum = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  const jaarLabel = jaar ? String(jaar) : 'Alle jaren';

  const soortRijen = stats.perSoort.map(s => {
    const pct = s.succes + s.mislukt > 0 ? Math.round(s.succes / (s.succes + s.mislukt) * 100) : null;
    return `<tr>
      <td>${s.naam}</td><td>${s.legsels}</td><td>${s.eieren || '—'}</td><td>${s.pulli || '—'}</td>
      <td>${pct !== null ? `<span class="${pct >= 50 ? 'ok' : 'nok'}">${s.succes}/${s.succes + s.mislukt} (${pct}%)</span>` : '—'}</td>
    </tr>`;
  }).join('');

  const nestSections = perNest.map(n => {
    const eersteEchteFoto = (Array.isArray(n.fotos) ? n.fotos : []).find(f => typeof f === 'string' && f.startsWith('data:'));
    const fotoHtml = eersteEchteFoto
      ? `<img src="${eersteEchteFoto}" style="width:90px;height:70px;object-fit:cover;border-radius:4px;border:1px solid #e2e8f0;flex-shrink:0"/>`
      : '';
    const legselRijen = n.legsels.length === 0
      ? '<tr><td colspan="5" style="color:#888;font-style:italic">Geen legsels in geselecteerde periode</td></tr>'
      : n.legsels.map(l => `<tr>
          <td>${l.jaar || '—'}</td><td>${l.legselSoort}</td><td>${l.maxEieren || '—'}</td><td>${l.maxPulli || '—'}</td>
          <td>${l.succesLabel || '—'}</td>
        </tr>`).join('');
    return `<div class="nest-blok">
      <div class="nest-header">
        ${fotoHtml}
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap">
            <span class="nest-nr">⌂ ${n.kastnummer}</span>
            ${n.omschrijving ? `<span class="nest-omsch">${n.omschrijving}</span>` : ''}
            ${n.soortNaam !== '—' ? `<span class="nest-soort">${n.soortNaam}</span>` : ''}
          </div>
          ${n.adres ? `<div class="nest-adres">${n.adres}</div>` : ''}
        </div>
      </div>
      <table><thead><tr><th>Jaar</th><th>Soort</th><th>Eieren</th><th>Pullen geringd</th><th>Resultaat</th></tr></thead>
      <tbody>${legselRijen}</tbody></table>
    </div>`;
  }).join('');

  const kaartSvg = svgLocatieKaart(perNest);
  const grafiekSvg = svgJaarGrafiek(legselsPerJaar);

  const contactRegel = [
    info.adres ? `<div>${info.adres}</div>` : '',
    info.email ? `<div>✉ ${info.email}</div>` : '',
    info.telefoon ? `<div>☎ ${info.telefoon}</div>` : '',
  ].filter(Boolean).join('');

  return `<!DOCTYPE html><html lang="nl"><head><meta charset="UTF-8">
<title>Nestrapport — ${eigenaar}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',system-ui,sans-serif;font-size:10.5pt;color:#1a202c;background:#fff;padding:18mm 20mm}
  .rh{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2.5px solid #1e3a5f;padding-bottom:12px;margin-bottom:18px}
  .rh-titel{font-size:20pt;font-weight:700;color:#1e3a5f}
  .rh-sub{font-size:9.5pt;color:#64748b;margin-top:2px}
  .rh-meta{text-align:right;font-size:8.5pt;color:#64748b;line-height:1.7}
  .eb{background:#eef2f8;border-left:4px solid #1e3a5f;padding:10px 14px;margin-bottom:18px;border-radius:2px}
  .eb-naam{font-size:14pt;font-weight:700;color:#1e3a5f}
  .eb-contact{font-size:9pt;color:#555;margin-top:5px;line-height:1.7}
  h2{font-size:12pt;color:#1e3a5f;border-bottom:1px solid #cbd5e1;padding-bottom:4px;margin:18px 0 10px}
  .sg{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:8px}
  .sb{border:1px solid #e2e8f0;border-radius:6px;padding:10px;text-align:center}
  .sw{font-size:19pt;font-weight:700;color:#1e3a5f}
  .sl{font-size:8pt;color:#64748b;margin-top:2px}
  .succes-regel{text-align:center;margin:8px 0 4px;font-size:10.5pt}
  table{width:100%;border-collapse:collapse;font-size:9pt;margin-bottom:6px}
  th{background:#1e3a5f;color:#fff;padding:5px 8px;text-align:left;font-weight:600;font-size:8.5pt}
  td{padding:5px 8px;border-bottom:1px solid #e2e8f0}
  tr:last-child td{border-bottom:none}
  tr:nth-child(even){background:#f8fafc}
  .ok{color:#16a34a;font-weight:600}
  .nok{color:#dc2626;font-weight:600}
  .nest-blok{border:1px solid #e2e8f0;border-radius:6px;margin-bottom:12px;overflow:hidden}
  .nest-header{background:#eef2f8;padding:10px 12px;display:flex;gap:12px;align-items:flex-start}
  .nest-nr{font-weight:700;color:#1e3a5f;font-size:11pt}
  .nest-omsch{color:#475569;font-size:9pt}
  .nest-soort{margin-left:auto;color:#64748b;font-size:8.5pt;font-style:italic}
  .nest-adres{font-size:8.5pt;color:#888;margin-top:3px}
  .nest-blok table{margin:0}
  .rf{margin-top:28px;padding-top:8px;border-top:1px solid #cbd5e1;font-size:8pt;color:#94a3b8;display:flex;justify-content:space-between}
  .grafiek-titel{font-size:9pt;color:#475569;margin-bottom:4px}
  @media print{body{padding:10mm 15mm}}
</style></head><body>
<div class="rh">
  <div><div class="rh-titel">Nestrapport</div><div class="rh-sub">${jaarLabel}</div></div>
  <div class="rh-meta">Opgesteld door: Thijs ter Avest<br>VRS Breedenbroek · Ringernr. 3254<br>${datum}</div>
</div>
<div class="eb">
  <div class="eb-naam">${eigenaar}</div>
  ${contactRegel ? `<div class="eb-contact">${contactRegel}</div>` : ''}
</div>
<h2>Samenvatting</h2>
<div class="sg">
  <div class="sb"><div class="sw">${perNest.length}</div><div class="sl">Nesten</div></div>
  <div class="sb"><div class="sw">${stats.aantalLegsels}</div><div class="sl">Legsels</div></div>
  <div class="sb"><div class="sw">${stats.totaalEieren || 0}</div><div class="sl">Eieren</div></div>
  <div class="sb"><div class="sw">${stats.totaalUitgevlogen || 0}</div><div class="sl">Uitgevlogen</div></div>
</div>
${successPct !== null ? `<div class="succes-regel">Nestsucces: <span class="${successPct >= 50 ? 'ok' : 'nok'}">${succes}/${stats.aantalAfgerond} legsels succesvol (${successPct}%)</span></div>` : ''}
${grafiekSvg ? `<h2>Activiteit per jaar</h2><div class="grafiek-titel">Aantal legsels (blauw) en uitgevlogen jongen (groen) per jaar</div>${grafiekSvg}` : ''}
${stats.perSoort.length > 0 ? `<h2>Per soort</h2><table><thead><tr><th>Soort</th><th>Legsels</th><th>Eieren</th><th>Pullen geringd</th><th>Succes</th></tr></thead><tbody>${soortRijen}</tbody></table>` : ''}
${kaartSvg ? `<h2>Locatie nestkasten</h2>${kaartSvg}` : ''}
${perNest.length > 0 ? `<h2>Nestkasten</h2>${nestSections}` : ''}
<div class="rf"><span>VRS Breedenbroek — nestonderzoek</span><span>Gegenereerd op ${datum}</span></div>
</body></html>`;
}

function EigenaarRapportModal({ nesten, legsels, bezoeken, ringen, speciesByEuring, onClose }) {
  const eigenaars = useMemo(() => {
    const seen = new Set();
    const list = [];
    nesten.forEach(n => {
      const naam = (n.eigenaar_naam || '').trim();
      if (!naam) return;
      const key = naam.toLowerCase();
      if (!seen.has(key)) { seen.add(key); list.push(naam); }
    });
    return list.sort((a, b) => a.localeCompare(b, 'nl'));
  }, [nesten]);

  const beschikbareJaren = useMemo(() => {
    const jaren = new Set(legsels.map(l => l.jaar).filter(Boolean));
    return [...jaren].sort().reverse();
  }, [legsels]);

  const [geselecteerd, setGeselecteerd] = useState(() => eigenaars[0] || '');
  const [jaar, setJaar] = useState('alle');

  const eigenaarNesten = useMemo(
    () => nesten.filter(n => (n.eigenaar_naam || '').trim().toLowerCase() === geselecteerd.toLowerCase()),
    [nesten, geselecteerd]
  );

  const eigenaarInfo = useMemo(() => ({
    email: eigenaarNesten.map(n => n.eigenaar_email).find(Boolean) || '',
    telefoon: eigenaarNesten.map(n => n.eigenaar_telefoon).find(Boolean) || '',
    adres: eigenaarNesten.map(n => n.adres).find(Boolean) || '',
  }), [eigenaarNesten]);

  const geselecteerdJaar = jaar === 'alle' ? null : parseInt(jaar);

  const stats = useMemo(
    () => computeNestStats({ nesten: eigenaarNesten, legsels, bezoeken, ringen, speciesByEuring, jaar: geselecteerdJaar }),
    [eigenaarNesten, legsels, bezoeken, ringen, speciesByEuring, geselecteerdJaar]
  );

  const succes = stats.perSoort.reduce((a, s) => a + s.succes, 0);
  const successPct = stats.aantalAfgerond > 0 ? Math.round((succes / stats.aantalAfgerond) * 100) : null;

  function drukAf() {
    const nestenIds = new Set(eigenaarNesten.map(n => n.id));
    const eigenaarLegsels = legsels.filter(
      l => nestenIds.has(l.nest_id) && (geselecteerdJaar === null || l.jaar === geselecteerdJaar)
    );
    const perNest = eigenaarNesten.map(n => {
      const nestLegsels = eigenaarLegsels.filter(l => l.nest_id === n.id);
      return {
        ...n,
        soortNaam: speciesByEuring[n.soort_euring]?.naam_nl || '—',
        legsels: nestLegsels.map(l => {
          const bvl = bezoeken.filter(b => b.legsel_id === l.id);
          const maxEieren = Math.max(0, ...bvl.map(b => b.aantal_eieren || 0));
          const maxPulli = Math.max(0, ...bvl.map(b => b.aantal_pulli || 0));
          const ns = l.nestsucces;
          const heeftX0 = bvl.some(b => b.stadium === 'X0');
          const heeftC = bvl.some(b => b.stadium?.startsWith('C'));
          let succesLabel = '';
          if (ns != null && ns > 0) succesLabel = `✓ ${ns} uitgevlogen`;
          else if (ns === 0 || heeftX0 || heeftC) succesLabel = '✗ mislukt';
          const legselSoort = speciesByEuring[l.soort_euring || n.soort_euring]?.naam_nl || '—';
          return { ...l, maxEieren, maxPulli, succesLabel, legselSoort };
        }),
      };
    }).filter(n => geselecteerdJaar === null || n.legsels.length > 0);

    // Legsels + uitgevlogen per jaar (voor de grafiek)
    const alleLegselsVanEigenaar = legsels.filter(l => nestenIds.has(l.nest_id));
    const jarenSet = new Set(alleLegselsVanEigenaar.map(l => l.jaar).filter(Boolean));
    const legselsPerJaar = [...jarenSet].sort().map(j => ({
      jaar: j,
      legsels: alleLegselsVanEigenaar.filter(l => l.jaar === j).length,
      uitgevlogen: alleLegselsVanEigenaar.filter(l => l.jaar === j).reduce((sum, l) => sum + Math.max(0, l.nestsucces ?? 0), 0),
    }));

    const html = generateRapportHTML({
      eigenaar: geselecteerd, jaar: geselecteerdJaar, info: eigenaarInfo,
      stats, succes, successPct, perNest, legselsPerJaar,
    });
    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
  }

  const overlayStyle = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: 16,
  };
  const modalStyle = {
    background: 'var(--bg-elevated, #1e293b)', borderRadius: 'var(--radius, 10px)',
    border: '1px solid var(--border)', width: '100%', maxWidth: 440,
    maxHeight: '90vh', overflowY: 'auto',
  };

  if (eigenaars.length === 0) return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Eigenaarrapport</h2>
          <button className="btn-secondary" style={{ padding: '2px 10px' }} onClick={onClose}>✕</button>
        </div>
        <p style={{ padding: 20, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Geen nesten met een eigenaar gevonden. Voeg een eigenaar toe bij de nestkast.
        </p>
      </div>
    </div>
  );

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Eigenaarrapport</h2>
          <button className="btn-secondary" style={{ padding: '2px 10px' }} onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', marginBottom: 4, color: 'var(--text-muted)' }}>Eigenaar</label>
            <select value={geselecteerd} onChange={e => setGeselecteerd(e.target.value)} style={{ width: '100%' }}>
              {eigenaars.map(naam => <option key={naam} value={naam}>{naam}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', marginBottom: 4, color: 'var(--text-muted)' }}>Periode</label>
            <select value={jaar} onChange={e => setJaar(e.target.value)} style={{ width: '100%' }}>
              <option value="alle">Alle jaren</option>
              {beschikbareJaren.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>

          {stats.aantalLegsels > 0 ? (
            <div style={{ background: 'var(--bg-surface, #0f172a)', borderRadius: 8, padding: '12px 16px', fontSize: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 16px' }}>
                {[
                  ['Nesten', eigenaarNesten.length],
                  ['Legsels', stats.aantalLegsels],
                  ['Eieren', stats.totaalEieren || '—'],
                  ['Uitgevlogen', stats.totaalUitgevlogen || '—'],
                ].map(([label, val]) => (
                  <><span style={{ color: 'var(--text-muted)' }}>{label}</span><span>{val}</span></>
                ))}
                {successPct !== null && (
                  <><span style={{ color: 'var(--text-muted)' }}>Succes</span>
                  <span style={{ color: successPct >= 50 ? 'var(--success)' : 'var(--danger)' }}>
                    {succes}/{stats.aantalAfgerond} ({successPct}%)
                  </span></>
                )}
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Geen legsels voor deze selectie.</p>
          )}

          <button className="btn-primary" onClick={drukAf}>
            Afdrukken / PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NestStatsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const switchModule = useModuleSwitch();
  const { nesten, legsels, bezoeken, ringen, ouders, bulkImportNestBackup, markLegselsExported } = useNestData();
  const { records: vangsten } = useRecords();
  const species = useSpeciesRef();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [rapportOpen, setRapportOpen] = useState(false);

  const speciesByEuring = useMemo(() => {
    const map = {};
    species.forEach(s => { if (s.euring_code) map[s.euring_code] = s; });
    return map;
  }, [species]);

  // ── Niet geëxporteerde legsels ──
  const nieutLegsels = useMemo(() => legsels.filter(l => !l.exported_at), [legsels]);
  const nieutStats = useMemo(() =>
    computeNestStats({ nesten, legsels: nieutLegsels, bezoeken, ringen, speciesByEuring, jaar: null }),
    [nesten, nieutLegsels, bezoeken, ringen, speciesByEuring]
  );

  // Verdelingen op nestniveau (nesttype, habitat, nestplaats)
  const nesttypeVerdeling = useMemo(() => {
    const t = {};
    nesten.forEach(n => {
      const code = n.nesttype ?? -1;
      const label = nesttypeLabel[code] ?? `Code ${code}`;
      t[label] = (t[label] || 0) + 1;
    });
    return Object.entries(t).sort((a, b) => b[1] - a[1]);
  }, [nesten]);

  const habitatVerdeling = useMemo(() => {
    const t = {};
    nesten.forEach(n => {
      if (n.habitat == null) return;
      const label = habitatLabel[n.habitat] ?? `Code ${n.habitat}`;
      t[label] = (t[label] || 0) + 1;
    });
    return Object.entries(t).sort((a, b) => b[1] - a[1]);
  }, [nesten]);

  const nestplaatsVerdeling = useMemo(() => {
    const t = {};
    nesten.forEach(n => {
      if (n.nestplaats == null) return;
      const label = nestplaatsLabel[n.nestplaats] ?? `Code ${n.nestplaats}`;
      t[label] = (t[label] || 0) + 1;
    });
    return Object.entries(t).sort((a, b) => b[1] - a[1]);
  }, [nesten]);

  // Grafiek: legsels per jaar
  const legselsPerJaar = useMemo(() => {
    const telling = {};
    legsels.forEach(l => { if (l.jaar) telling[l.jaar] = (telling[l.jaar] || 0) + 1; });
    return Object.entries(telling)
      .sort((a, b) => a[0] - b[0])
      .map(([jaar, count]) => ({ label: jaar, count }));
  }, [legsels]);

  // Grafiek: bezoeken per maand (all time)
  const bezoekenPerMaand = useMemo(() => {
    const telling = {};
    bezoeken.forEach(b => {
      if (!b.datum) return;
      const maand = b.datum.slice(0, 7);
      telling[maand] = (telling[maand] || 0) + 1;
    });
    return Object.entries(telling)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([maand, count]) => {
        const [jaar, mm] = maand.split('-');
        const naam = new Date(maand + '-01').toLocaleDateString('nl-NL', { month: 'short' });
        return { label: `${naam} '${String(jaar).slice(2)}`, count };
      });
  }, [bezoeken]);

  const handleImport = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const backup = JSON.parse(evt.target.result);
        if (!Array.isArray(backup.nesten)) {
          addToast('Ongeldig bestand: geen nestdata gevonden.', 'error', 0);
          return;
        }
        const counts = await bulkImportNestBackup(backup);
        addToast(
          `Geïmporteerd: ${counts.nesten} nesten, ${counts.legsels} legsels, ${counts.bezoeken} bezoeken, ${counts.ringen} ringen, ${counts.ouders} oudervogels.`,
          'success'
        );
      } catch {
        addToast('Import mislukt: ongeldig JSON-bestand.', 'error', 0);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  }, [bulkImportNestBackup, addToast]);

  const [exportOpen, setExportOpen] = useState(false);
  const [filterJaar, setFilterJaar] = useState(null);
  const [soortenSorteer, setSoortenSorteer] = useState('legsels');
  const [tvSorteer, setTvSorteer] = useState({ col: 'afstand', dir: 'desc' });
  const [pullenOpen, setPullenOpen] = useState(false);
  const teruggevangenRef = useRef(null);
  const pullenGeringdRef = useRef(null);

  // ── Geringde pullen (voor tabel onderaan) ──
  const pullenGeringdLijst = useMemo(() => {
    const legselsInJaar = filterJaar != null ? legsels.filter(l => l.jaar === filterJaar) : legsels;
    const legselIds     = new Set(legselsInJaar.map(l => l.id));
    const bezoekenInJaar = bezoeken.filter(b => legselIds.has(b.legsel_id));
    const bezoekIds     = new Set(bezoekenInJaar.map(b => b.id));
    const ringenInJaar  = ringen.filter(r => bezoekIds.has(r.nestbezoek_id));

    const vangstById = new Map((vangsten || []).map(v => [v.id, v]));
    const bezoekById = new Map(bezoeken.map(b => [b.id, b]));
    const legselById = new Map(legsels.map(l => [l.id, l]));
    const nestById   = new Map(nesten.map(n => [n.id, n]));

    return ringenInJaar.map(r => {
      const vangst = vangstById.get(r.vangst_id);
      const bezoek = bezoekById.get(r.nestbezoek_id);
      const legsel = bezoek ? legselById.get(bezoek.legsel_id) : null;
      const nest   = legsel ? nestById.get(legsel.nest_id) : null;
      return { ...r, vangst, bezoek, nest };
    }).sort((a, b) => (b.bezoek?.datum || '').localeCompare(a.bezoek?.datum || ''));
  }, [ringen, vangsten, bezoeken, legsels, nesten, filterJaar]);

  // ── Teruggevangen nestringen (pulli + adulten) ──
  const teruggevangenPulli = useMemo(() => {
    if (!vangsten?.length || !ringen.length) return [];

    const bezoekById = new Map(bezoeken.map(b => [b.id, b]));
    const legselById = new Map(legsels.map(l => [l.id, l]));
    const nestById   = new Map(nesten.map(n => [n.id, n]));

    // Alle unieke ringnummers die in een nestbezoek zijn geringd (gefilterd op jaar)
    const nestRingByNr = new Map(); // normalized ring → first nestring entry (voor nestkoppeling)
    ringen.forEach(r => {
      const ring = (r.ringnummer || '').replace(/\./g, '');
      if (!ring) return;
      if (filterJaar !== null) {
        const bezoek = bezoekById.get(r.nestbezoek_id);
        const legsel = bezoek ? legselById.get(bezoek.legsel_id) : null;
        if (!legsel || legsel.jaar !== filterJaar) return;
      }
      if (!nestRingByNr.has(ring)) nestRingByNr.set(ring, r);
    });

    // Groepeer vangsten per ringnummer (punten gestript), gesorteerd op datum
    const vangstByRing = new Map();
    vangsten.forEach(v => {
      const ring = (v.ringnummer || '').replace(/\./g, '');
      if (!ring) return;
      if (!vangstByRing.has(ring)) vangstByRing.set(ring, []);
      vangstByRing.get(ring).push(v);
    });

    const resultaten = [];

    for (const [ringNr, nestRing] of nestRingByNr) {
      const alleVangsten = (vangstByRing.get(ringNr) || [])
        .sort((a, b) => toISO(a.vangstdatum).localeCompare(toISO(b.vangstdatum)));

      if (alleVangsten.length < 2) continue;

      const eersteVangst = alleVangsten[0];
      const terugvangsten = alleVangsten.slice(1);

      const bezoek = bezoekById.get(nestRing.nestbezoek_id);
      const legsel = bezoek ? legselById.get(bezoek.legsel_id) : null;
      const nest   = legsel ? nestById.get(legsel.nest_id) : null;

      const lat1 = parseFloat(eersteVangst.lat) || parseFloat(nest?.lat) || null;
      const lon1 = parseFloat(eersteVangst.lon) || parseFloat(nest?.lon) || null;

      const rijen = terugvangsten.map(tv => {
        const lat2 = parseFloat(tv.lat) || null;
        const lon2 = parseFloat(tv.lon) || null;
        const afstand = (lat1 && lon1 && lat2 && lon2) ? haversineKm(lat1, lon1, lat2, lon2) : null;
        const dagen   = dagenTussen(eersteVangst.vangstdatum, tv.vangstdatum);
        return { tv, lat2, lon2, afstand, dagen };
      });

      resultaten.push({ ringNr, vogelnaam: capitalize(eersteVangst.vogelnaam || ''), nest, eersteVangst, lat1, lon1, rijen });
    }

    return resultaten.sort((a, b) => {
      const maxA = Math.max(0, ...a.rijen.map(r => r.afstand ?? 0));
      const maxB = Math.max(0, ...b.rijen.map(r => r.afstand ?? 0));
      return maxB - maxA;
    });
  }, [ringen, vangsten, bezoeken, legsels, nesten, filterJaar]);


  const beschikbareJaren = useMemo(() => {
    const jaren = new Set(legsels.map(l => l.jaar).filter(Boolean));
    return [...jaren].sort((a, b) => b - a);
  }, [legsels]);

  // Grafiek: legsels per soort per jaar (trendlijn meerdere soorten)
  const TREND_PALETTE = [
    '#22c55e', '#38bdf8', '#f59e0b', '#a78bfa',
    '#f472b6', '#34d399', '#60a5fa', '#fb923c',
  ];
  const trendPerSoort = useMemo(() => {
    if (beschikbareJaren.length < 2) return null;
    const telling = {};
    legsels.forEach(l => {
      const euring = l.soort_euring;
      if (!euring || !l.jaar) return;
      if (!telling[euring]) telling[euring] = { naam: speciesByEuring[euring]?.naam_nl || euring, jaren: {} };
      telling[euring].jaren[l.jaar] = (telling[euring].jaren[l.jaar] || 0) + 1;
    });
    const soorten = Object.values(telling)
      .filter(s => Object.keys(s.jaren).length >= 2)
      .sort((a, b) => {
        const totA = Object.values(a.jaren).reduce((x, y) => x + y, 0);
        const totB = Object.values(b.jaren).reduce((x, y) => x + y, 0);
        return totB - totA;
      })
      .slice(0, 8);
    if (soorten.length < 1) return null;
    return {
      labels: beschikbareJaren.map(String),
      series: soorten.map((s, i) => ({
        naam: s.naam,
        color: TREND_PALETTE[i % TREND_PALETTE.length],
        values: beschikbareJaren.map(j => s.jaren[j] || 0),
      })),
    };
  }, [legsels, beschikbareJaren, speciesByEuring]);

  const stamboomData = useMemo(() =>
    computeStamboom({ legsels, bezoeken, nestring: ringen, ouders, nesten, vangsten, filterJaar }),
    [legsels, bezoeken, ringen, ouders, nesten, vangsten, filterJaar]
  );

  const gefilterdeStats = useMemo(() =>
    computeNestStats({ nesten, legsels, bezoeken, ringen, speciesByEuring, jaar: filterJaar }),
    [nesten, legsels, bezoeken, ringen, speciesByEuring, filterJaar]
  );

  const tvSortToggle = (col) => {
    setTvSorteer(s => s.col === col
      ? { col, dir: s.dir === 'asc' ? 'desc' : 'asc' }
      : { col, dir: (col === 'soort' || col === 'ring' || col === 'kast') ? 'asc' : 'desc' }
    );
  };

  const teruggevangenSorted = useMemo(() => {
    const { col, dir } = tvSorteer;
    return [...teruggevangenPulli].sort((a, b) => {
      let cmp = 0;
      if (col === 'soort') cmp = a.vogelnaam.localeCompare(b.vogelnaam, 'nl');
      else if (col === 'ring') cmp = a.ringNr.localeCompare(b.ringNr);
      else if (col === 'kast') cmp = (a.nest?.kastnummer || '').localeCompare(b.nest?.kastnummer || '', undefined, { numeric: true });
      else if (col === 'eerste') cmp = toISO(a.eersteVangst.vangstdatum).localeCompare(toISO(b.eersteVangst.vangstdatum));
      else if (col === 'afstand') cmp = Math.max(0, ...a.rijen.map(r => r.afstand ?? 0)) - Math.max(0, ...b.rijen.map(r => r.afstand ?? 0));
      else if (col === 'dagen') cmp = Math.max(0, ...a.rijen.map(r => r.dagen ?? 0)) - Math.max(0, ...b.rijen.map(r => r.dagen ?? 0));
      return dir === 'asc' ? cmp : -cmp;
    });
  }, [teruggevangenPulli, tvSorteer]);

  const stadiumVolgorde = ['B1','B2','B3','E1','E2','E3','E4','N1','N2','N3','N4','C','C+','X0','P','L1','L2'];

  const stadiumSorted = useMemo(() =>
    Object.entries(gefilterdeStats.stadiumTelling)
      .sort((a, b) => {
        const ia = stadiumVolgorde.indexOf(a[0]);
        const ib = stadiumVolgorde.indexOf(b[0]);
        return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
      }),
    [gefilterdeStats.stadiumTelling]
  );

  const maxStadium = useMemo(() =>
    Math.max(1, ...Object.values(gefilterdeStats.stadiumTelling)),
    [gefilterdeStats.stadiumTelling]
  );

  return (
    <div className="page stats-page">

      {/* ══ Sectie 1: Te exporteren ════════════════════════════════════════ */}
      <div className="stats-section stats-section--huidig">
        <div className="section-header" onClick={() => setExportOpen(o => !o)}>
          <h2 className="stats-section-title" style={{ margin: 0 }}>
            Te exporteren
            {nieutStats.aantalLegsels > 0 && (
              <span style={{ marginLeft: 8, fontSize: '0.8rem', color: 'var(--brand)', fontWeight: 700 }}>
                {nieutStats.aantalLegsels}
              </span>
            )}
          </h2>
          <span className={`toggle${exportOpen ? ' open' : ''}`}>▾</span>
        </div>

        {exportOpen && (<>
        <div className="stats-grid" style={{ marginTop: 12 }}>
          <StatCard waarde={nieutStats.aantalNestenMet}  label="Actieve nesten"  onClick={() => navigate('/nest')} />
          <StatCard waarde={nieutStats.aantalLegsels}    label="Legsels"         onClick={() => navigate('/nest')} />
          <StatCard waarde={nieutStats.aantalBezoeken}   label="Bezoeken"        onClick={() => navigate('/nest')} />
          <StatCard waarde={nieutStats.aantalRingen}     label="Geringde pullen" onClick={() => pullenGeringdRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />
        </div>

        {nieutStats.perSoort.length > 0 && (
          <div className="trektellen-table-wrap" style={{ marginBottom: 16 }}>
            <table className="trektellen-table">
              <thead>
                <tr>
                  <th className="tt-col-soort">Soort</th>
                  <th className="tt-col-num">Legsels</th>
                  <th className="tt-col-num">Eieren</th>
                  <th className="tt-col-num">Pulli</th>
                  <th className="tt-col-num">Succes</th>
                </tr>
              </thead>
              <tbody>
                {nieutStats.perSoort.map(s => (
                  <tr key={s.naam}>
                    <td className="tt-col-soort">{s.naam}</td>
                    <td className="tt-col-num">{s.legsels}</td>
                    <td className="tt-col-num">{s.eieren || ''}</td>
                    <td className="tt-col-num">{s.pulli || ''}</td>
                    <td className="tt-col-num">
                      {(s.succes > 0 || s.mislukt > 0)
                        ? <span style={{ color: s.succes > 0 ? 'var(--success)' : 'var(--danger)' }}>
                            {s.succes}/{s.succes + s.mislukt}
                          </span>
                        : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
              {nieutStats.perSoort.length > 1 && (
                <tfoot>
                  <tr className="tt-totaal-row">
                    <td className="tt-col-soort">{nieutStats.perSoort.length} soort{nieutStats.perSoort.length !== 1 ? 'en' : ''}</td>
                    <td className="tt-col-num">{nieutStats.aantalLegsels}</td>
                    <td className="tt-col-num">{nieutStats.perSoort.reduce((a, s) => a + s.eieren, 0) || ''}</td>
                    <td className="tt-col-num">{nieutStats.aantalRingen || ''}</td>
                    <td className="tt-col-num"></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}

        {nieutStats.aantalLegsels === 0 && (
          <p className="stats-empty">Alle legsels zijn al geëxporteerd.</p>
        )}

        {nieutStats.aantalLegsels > 0 && (
          <div className="export-buttons">
            <button
              className="btn-primary"
              onClick={() => {
                exportAviNestTXT({ nesten, legsels: nieutLegsels, bezoeken, ringen, vangsten: vangsten ?? [], speciesByEuring });
                setShowExportConfirm(true);
              }}
            >
              ↓ Exporteer AviNest TXT
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                const data = buildNestExportData({ nesten, legsels: nieutLegsels, bezoeken, ringen, speciesByEuring });
                exportNestCSV(data);
              }}
            >
              ↓ CSV
            </button>
            <button
              className="btn-secondary"
              onClick={() => exportAviNestXML({ nesten, legsels: nieutLegsels, speciesByEuring })}
            >
              ↓ XML (AviNest)
            </button>
          </div>
        )}

        {showExportConfirm && (
          <div className="upload-confirm">
            <p>Legsels markeren als geëxporteerd?</p>
            <div className="upload-confirm-buttons">
              <button
                className="btn-primary"
                onClick={async () => {
                  await markLegselsExported(nieutLegsels.map(l => l.id));
                  setShowExportConfirm(false);
                  addToast(`${nieutLegsels.length} legsel${nieutLegsels.length !== 1 ? 's' : ''} gemarkeerd als geëxporteerd.`, 'success');
                }}
              >
                Ja, markeer als geëxporteerd
              </button>
              <button className="btn-secondary" onClick={() => setShowExportConfirm(false)}>
                Nee, later
              </button>
            </div>
          </div>
        )}
        </>)}
      </div>

      {/* ══ Sectie 2: Totaaloverzicht ══════════════════════════════════════ */}
      <div className="stats-section stats-section--totaal">
        <h2 className="stats-section-title">
          {filterJaar ? `Overzicht ${filterJaar}` : t('stats_total_overview')}
        </h2>

        {beschikbareJaren.length > 1 && (
          <div className="nest-jaar-filter" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            <button
              className={`nest-jaar-btn${filterJaar === null ? ' active' : ''}`}
              onClick={() => setFilterJaar(null)}
            >
              Alle jaren
            </button>
            {beschikbareJaren.map(jaar => (
              <button
                key={jaar}
                className={`nest-jaar-btn${filterJaar === jaar ? ' active' : ''}`}
                onClick={() => setFilterJaar(jaar)}
              >
                {jaar}
              </button>
            ))}
          </div>
        )}

        <div className="stats-grid">
          <StatCard waarde={gefilterdeStats.aantalNestenMet}   label="Actieve nesten"            onClick={() => navigate('/nest')} />
          <StatCard waarde={gefilterdeStats.aantalLegsels}     label="Legsels"                   onClick={() => navigate('/nest')} />
          <StatCard waarde={gefilterdeStats.totaalEieren}      label="Eieren gevonden"            onClick={() => navigate('/nest')} />
          <StatCard waarde={gefilterdeStats.totaalPulli}       label="Pullen geteld"              onClick={() => navigate('/nest')} />
          <StatCard waarde={gefilterdeStats.totaalUitgevlogen} label="Uitgevlogen"                onClick={() => navigate('/nest')} />
          <StatCard waarde={gefilterdeStats.aantalRingen}      label="Pullen geringd"             onClick={() => pullenGeringdRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />
          <StatCard waarde={teruggevangenPulli.length}         label="Nestringen teruggevangen"   onClick={() => teruggevangenRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />
          <StatCard waarde={gefilterdeStats.aantalBezoeken}    label="Bezoeken"                   onClick={() => navigate('/nest')} />
          <StatCard waarde={gefilterdeStats.aantalAfgerond}    label="Legsels afgerond"           onClick={() => navigate('/nest')} />
        </div>

        {/* Legsels per jaar */}
        {legselsPerJaar.length > 1 && (
          <BarChartSimple
            data={legselsPerJaar}
            title="Legsels per jaar"
            color="var(--success)"
          />
        )}

        {/* Legsels per soort per jaar */}
        {trendPerSoort && (
          <GroupedBarChart
            labels={trendPerSoort.labels}
            series={trendPerSoort.series}
            title="Legsels per soort per jaar"
          />
        )}

        {/* Bezoeken per maand */}
        {bezoekenPerMaand.length > 0 && (
          <LineChart
            data={bezoekenPerMaand}
            title="Bezoeken per maand"
            xKey="label"
            yKey="count"
          />
        )}

        {/* Nestenkaart */}
        <NestKaart nesten={nesten} />

        {/* Nesttype verdeling */}
        {nesttypeVerdeling.length > 0 && (
          <DonutChart
            data={nesttypeVerdeling.map(([label, count]) => ({ label, count }))}
            title="Nesttype"
          />
        )}

        {/* Habitat verdeling */}
        {habitatVerdeling.length > 0 && (
          <div className="section">
            <h3>Habitat</h3>
            <VerdelingBars items={habitatVerdeling} kleur="var(--accent)" />
          </div>
        )}

        {/* Nestplaats verdeling */}
        {nestplaatsVerdeling.length > 0 && (
          <div className="section">
            <h3>Nestplaats</h3>
            <VerdelingBars items={nestplaatsVerdeling} kleur="var(--warning, #f59e0b)" />
          </div>
        )}

        {/* Top soorten */}
        {gefilterdeStats.perSoort.length > 0 && (
          <div className="section">
            <h3>Soorten{filterJaar ? ` ${filterJaar}` : ' (alle jaren)'}</h3>
            <div className="trektellen-table-wrap">
              <table className="trektellen-table">
                <thead>
                  <tr>
                    <th
                      className="tt-col-soort"
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      onClick={() => setSoortenSorteer('naam')}
                    >
                      Soort{soortenSorteer === 'naam' ? ' ▼' : ''}
                    </th>
                    {['legsels','eieren','pulli','succes'].map(col => (
                      <th
                        key={col}
                        className="tt-col-num"
                        style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                        onClick={() => setSoortenSorteer(col)}
                      >
                        {col.charAt(0).toUpperCase() + col.slice(1)}
                        {soortenSorteer === col ? ' ▼' : ''}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...gefilterdeStats.perSoort]
                    .sort((a, b) => soortenSorteer === 'naam'
                      ? a.naam.localeCompare(b.naam, 'nl')
                      : (b[soortenSorteer] || 0) - (a[soortenSorteer] || 0)
                    )
                    .map(s => (
                      <tr key={s.naam}>
                        <td className="tt-col-soort">{s.naam}</td>
                        <td className="tt-col-num">{s.legsels}</td>
                        <td className="tt-col-num">{s.eieren || ''}</td>
                        <td className="tt-col-num">{s.pulli || ''}</td>
                        <td className="tt-col-num">
                          {(s.succes > 0 || s.mislukt > 0)
                            ? <span style={{ color: s.succes > 0 ? 'var(--success)' : 'var(--danger)' }}>
                                {s.succes}/{s.succes + s.mislukt}
                              </span>
                            : ''}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Nestsucces */}
        {gefilterdeStats.perSoort.some(s => s.succes > 0 || s.mislukt > 0) && (
          <div className="section">
            <h3>Nestsucces per soort</h3>
            <div className="trektellen-table-wrap">
              <table className="trektellen-table">
                <thead>
                  <tr>
                    <th className="tt-col-soort">Soort</th>
                    <th className="tt-col-num">Legsels</th>
                    <th className="tt-col-num" style={{ color: 'var(--success)' }}>Succes</th>
                    <th className="tt-col-num" style={{ color: 'var(--danger)' }}>Mislukt</th>
                    <th className="tt-col-num">%</th>
                  </tr>
                </thead>
                <tbody>
                  {gefilterdeStats.perSoort
                    .filter(s => s.succes > 0 || s.mislukt > 0)
                    .map(s => {
                      const pct = s.succes + s.mislukt > 0
                        ? Math.round((s.succes / (s.succes + s.mislukt)) * 100)
                        : null;
                      return (
                        <tr key={s.naam}>
                          <td className="tt-col-soort">{s.naam}</td>
                          <td className="tt-col-num">{s.legsels}</td>
                          <td className="tt-col-num" style={{ color: 'var(--success)' }}>{s.succes}</td>
                          <td className="tt-col-num" style={{ color: 'var(--danger)' }}>{s.mislukt}</td>
                          <td className="tt-col-num">
                            {pct !== null && (
                              <span style={{ color: pct >= 50 ? 'var(--success)' : 'var(--danger)' }}>
                                {pct}%
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stadia verdeling */}
        {stadiumSorted.length > 0 && (
          <div className="section">
            <h3>Stadia (laatste bezoek per legsel)</h3>
            <VerdelingBars
              items={stadiumSorted.map(([code, count]) => [stadiumLabel[code] ?? code, count])}
              kleur="var(--warning, #f59e0b)"
            />
          </div>
        )}

        {/* Geringde pullen — inklapbaar */}
        {pullenGeringdLijst.length > 0 && (
          <div ref={pullenGeringdRef} className="section">
            <div className="section-header" style={{ cursor: 'pointer' }} onClick={() => setPullenOpen(o => !o)}>
              <h3 style={{ margin: 0 }}>
                Geringde pullen
                <span style={{ marginLeft: 8, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                  ({pullenGeringdLijst.length})
                </span>
              </h3>
              <span className={`toggle${pullenOpen ? ' open' : ''}`}>▾</span>
            </div>
            {pullenOpen && (
              <div className="trektellen-table-wrap" style={{ marginTop: 10 }}>
                <table className="trektellen-table" style={{ fontSize: '0.78rem' }}>
                  <thead>
                    <tr>
                      <th className="tt-col-soort">Ringnummer</th>
                      <th className="tt-col-soort">Vogel</th>
                      <th className="tt-col-soort">Datum</th>
                      <th className="tt-col-soort">Nest</th>
                      <th className="tt-col-num">Vleugel</th>
                      <th className="tt-col-num">Gewicht</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pullenGeringdLijst.map(r => (
                      <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => r.nest && navigate(`/nest/${r.nest.id}`)}>
                        <td className="tt-col-soort" style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>{(r.ringnummer || '').replace(/[\s.]/g, '').toUpperCase()}</td>
                        <td className="tt-col-soort">{r.vangst?.vogelnaam || '—'}</td>
                        <td className="tt-col-soort">{r.bezoek?.datum ? formatDatum(r.bezoek.datum) : '—'}</td>
                        <td className="tt-col-soort" style={{ color: 'var(--text-muted)' }}>
                          {r.nest ? `⌂ ${r.nest.kastnummer}${r.nest.omschrijving ? ` — ${r.nest.omschrijving}` : ''}` : '—'}
                        </td>
                        <td className="tt-col-num">{r.vangst?.vleugel || '—'}</td>
                        <td className="tt-col-num">{r.vangst?.gewicht || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Teruggevangen nestringen */}
        {teruggevangenPulli.length > 0 && (
          <div ref={teruggevangenRef} className="section">
            <h3>Teruggevangen nestringen ({teruggevangenPulli.length})</h3>
            <div className="trektellen-table-wrap">
              <table className="trektellen-table" style={{ fontSize: '0.78rem' }}>
                <thead>
                  <tr>
                    {[
                      { key: 'soort',   label: 'Vogel',         cls: 'tt-col-soort' },
                      { key: 'eerste',  label: 'Eerste vangst', cls: 'tt-col-soort' },
                      { key: null,      label: 'Terugvangst',   cls: 'tt-col-soort' },
                      { key: 'afstand', label: 'Afstand',       cls: 'tt-col-num' },
                      { key: 'dagen',   label: 'Dagen',         cls: 'tt-col-num' },
                    ].map(({ key, label, cls }) => (
                      <th
                        key={label}
                        className={cls}
                        style={key ? { cursor: 'pointer', userSelect: 'none' } : undefined}
                        onClick={key ? () => tvSortToggle(key) : undefined}
                      >
                        {label}{key && tvSorteer.col === key ? (tvSorteer.dir === 'asc' ? ' ▲' : ' ▼') : ''}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {teruggevangenSorted.flatMap(p =>
                    p.rijen.map((rij, i) => (
                      <tr key={`${p.ringNr}-${i}`}>
                        <td className="tt-col-soort">
                          {i === 0 && (
                            <>
                              <span style={{ color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'monospace' }}
                                onClick={() => { switchModule('ring'); navigate('/ring/records', { state: { ringnummer: p.ringNr } }); }}
                              >{p.ringNr}</span>
                              {p.vogelnaam && <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>{p.vogelnaam}</span>}
                              {p.nest && (
                                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>
                                  ⌂ {p.nest.kastnummer}{p.nest.omschrijving ? ` — ${p.nest.omschrijving}` : ''}
                                </span>
                              )}
                            </>
                          )}
                        </td>
                        <td className="tt-col-soort">
                          {i === 0 && (
                            <>
                              {p.eersteVangst.vangstdatum}
                              {(p.eersteVangst.google_plaats || p.nest?.adres) && (
                                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>
                                  {p.eersteVangst.google_plaats || p.nest?.adres}
                                </span>
                              )}
                            </>
                          )}
                        </td>
                        <td className="tt-col-soort">
                          {rij.tv.vangstdatum}
                          {rij.tv.google_plaats && (
                            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>
                              {rij.tv.google_plaats}
                            </span>
                          )}
                        </td>
                        <td className="tt-col-num">
                          {rij.afstand != null
                            ? <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                                {rij.afstand < 1
                                  ? `${Math.round(rij.afstand * 1000)} m`
                                  : `${rij.afstand.toFixed(1)} km`}
                              </span>
                            : '—'}
                        </td>
                        <td className="tt-col-num">{rij.dagen != null ? rij.dagen : '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Stamboom ── */}
        {stamboomData && (
          <>
            {stamboomData.topOuders.length > 0 && (
              <div className="section">
                <h3>Meest productieve ouders</h3>
                <div className="trektellen-table-wrap">
                  <table className="trektellen-table" style={{ fontSize: '0.78rem' }}>
                    <thead>
                      <tr>
                        <th className="tt-col-soort">Ring</th>
                        <th className="tt-col-soort">Soort</th>
                        <th className="tt-col-num">Legsels</th>
                        <th className="tt-col-num">Jongen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stamboomData.topOuders.map(o => (
                        <tr key={o.ring}>
                          <td className="tt-col-soort" style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>
                            {o.geslacht === 'M' ? '♂ ' : o.geslacht === 'V' ? '♀ ' : ''}{o.ring}
                          </td>
                          <td className="tt-col-soort" style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                            {o.naam || '—'}
                          </td>
                          <td className="tt-col-num" style={{ fontWeight: 600 }}>{o.aantalLegsels}</td>
                          <td className="tt-col-num">{o.aantalJongen || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {stamboomData.stamBomen.length > 0 && (
              <div className="section">
                <h3>Stambomen</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                  Legsels met gekoppelde oudervogels. Groen gemarkeerde jongen zijn later zelf als ouder teruggezien.
                </p>
                {stamboomData.stamBomen.map(({ generaties, boom }, i) => boom && (
                  <div key={i} className="stamboom-blok">
                    <div className="stamboom-blok__header">
                      <span className="stamboom-blok__generaties">{generaties} generatie{generaties !== 1 ? 's' : ''}</span>
                      {boom.nest && (
                        <span
                          className="stamboom-blok__nest"
                          style={{ cursor: 'pointer', color: 'var(--accent)' }}
                          onClick={() => navigate(`/nest/${boom.nest.id}`)}
                        >
                          <NestIcoon nest={boom.nest} size={14} /> {boom.nest.kastnummer}
                          {boom.nest.omschrijving ? ` — ${boom.nest.omschrijving}` : ''}
                        </span>
                      )}
                      {boom.legsel && <span className="stamboom-blok__jaar">{boom.legsel.jaar}</span>}
                    </div>
                    <StamboomTak tak={boom} diepte={0} navigate={navigate} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* AviNest import */}
        <AviNestImportSection />

        {/* Import */}
        <div className="section">
          <h3>Import</h3>
          <p className="import-info">Importeer een eerder geëxporteerde JSON-backup. Bestaande records worden overgeslagen.</p>
          <div className="import-area">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="import-file-input"
              id="nest-import-file"
            />
            <label htmlFor="nest-import-file" className="btn-secondary import-label">
              Kies JSON-backup…
            </label>
          </div>
        </div>

        {/* Eigenaarrapport */}
        <div className="section">
          <h3>Eigenaarrapport</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 10 }}>
            Genereer een printbaar nestrapport voor een tuineigenaar — inclusief samenvatting, nestsucces en overzicht per nestkast.
          </p>
          <div className="export-buttons">
            <button className="btn-secondary" onClick={() => setRapportOpen(true)}>
              ↗ Rapport genereren
            </button>
          </div>
        </div>

        {/* Backup export */}
        <div className="section">
          <h3>Backup</h3>
          <div className="export-buttons">
            <button
              className="btn-secondary"
              onClick={() => exportNestJSONBackup({ nesten, legsels, bezoeken, ringen, vangsten: vangsten ?? [], ouders })}
            >
              ↓ JSON backup (alle data)
            </button>
          </div>
        </div>
      </div>

      {legsels.length === 0 && nesten.length === 0 && (
        <p className="stats-empty" style={{ textAlign: 'center', marginTop: 40 }}>
          {t('nest_stats_empty_all')}
        </p>
      )}

      {rapportOpen && (
        <EigenaarRapportModal
          nesten={nesten}
          legsels={legsels}
          bezoeken={bezoeken}
          ringen={ringen}
          speciesByEuring={speciesByEuring}
          onClose={() => setRapportOpen(false)}
        />
      )}
    </div>
  );
}

// ── Sub-componenten ────────────────────────────────────────────────────────

function StamboomTak({ tak, diepte, navigate }) {
  const INSPRINGING = 20;
  const normRing = r => (r || '').replace(/[\s.]/g, '').toUpperCase();
  const GESLACHT_LABELS = { M: '♂', V: '♀' };

  return (
    <div style={{ marginLeft: diepte * INSPRINGING }}>
      {/* Ouders van dit legsel */}
      {tak.ouderRingen.length > 0 && (
        <div className="stamboom-ouders">
          {tak.ouderRingen.map(o => (
            <span key={o.id} className="stamboom-ouder-chip">
              {GESLACHT_LABELS[o.geslacht] && <span>{GESLACHT_LABELS[o.geslacht]} </span>}
              <span style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>
                {normRing(o.ringnummer)}
              </span>
              {o.naam_vogel && <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}> {o.naam_vogel}</span>}
            </span>
          ))}
        </div>
      )}

      {/* Legsel-info */}
      {tak.legsel && (
        <div className="stamboom-legsel-rij">
          <span className="stamboom-pijl">↓</span>
          <span
            className="stamboom-legsel-link"
            onClick={() => tak.nest && navigate(`/nest/${tak.nest.id}`)}
            style={{ cursor: tak.nest ? 'pointer' : 'default' }}
          >
            {tak.nest ? `⌂ ${tak.nest.kastnummer}` : '?'}
            {tak.legsel.jaar ? ` (${tak.legsel.jaar})` : ''}
          </span>
        </div>
      )}

      {/* Alle geringde jongen: broers/zussen zichtbaar, met nakomelingen recursief */}
      {tak.alleJongen?.length > 0 && (
        <div className="stamboom-jongen-blok">
          {tak.alleJongen.map((jong, i) => (
            <div key={jong.ring + i} className="stamboom-jong-rij">
              <span className={`stamboom-jong-chip${jong.heeftNakomelingen ? ' stamboom-jong-chip--ouder' : ''}`}>
                <span style={{ fontFamily: 'monospace' }}>{jong.ring}</span>
                {jong.naam && <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}> {jong.naam}</span>}
                {jong.heeftNakomelingen && <span className="stamboom-jong-pijl" title="Heeft zelf ook nakomelingen">→</span>}
              </span>
              {/* Recursief: legsels van dit jong als ouder */}
              {jong.kindLegsels.map((kindTak, j) => (
                <StamboomTak key={kindTak.legselId + j} tak={kindTak} diepte={diepte + 1} navigate={navigate} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ waarde, label, onClick }) {
  return (
    <div
      className={`stat-card${onClick ? ' stat-card--link' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      <div className="stat-value">{waarde}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function VerdelingBars({ items, kleur }) {
  const max = Math.max(1, ...items.map(([, n]) => n));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {items.map(([label, count]) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 160, fontSize: '0.78rem', color: 'var(--text-secondary)', flexShrink: 0, textAlign: 'right', lineHeight: 1.3 }}>{label}</div>
          <div style={{ flex: 1, background: 'var(--bg-tertiary)', borderRadius: 3, height: 14, overflow: 'hidden' }}>
            <div style={{ width: `${(count / max) * 100}%`, background: kleur, height: '100%', borderRadius: 3, transition: 'width 0.3s' }} />
          </div>
          <div style={{ width: 24, fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 600, textAlign: 'right' }}>{count}</div>
        </div>
      ))}
    </div>
  );
}

