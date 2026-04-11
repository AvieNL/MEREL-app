import { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useModuleSwitch } from '../../App';
import { useNestData } from '../../hooks/useNestData';
import AviNestImportSection from './AviNestImportSection';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import { useRecords } from '../../hooks/useRecords';
import { useToast } from '../../context/ToastContext';
import { BarChartSimple, DonutChart, LineChart } from '../Stats/Charts';
import { HABITAT_CODES, NESTTYPE_CODES, NESTPLAATS_CODES, STADIUM_CODES } from '../../data/sovon-codes';
import {
  buildNestExportData, exportNestJSONBackup,
  exportNestCSV, exportAviNestTXT, exportAviNestXML,
} from '../../utils/nestExport';
import { formatDatum } from '../../utils/nestPlanning';
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

        const marker = L.circleMarker([lat, lon], {
          radius: 7,
          fillColor: '#22c55e',
          color: '#16a34a',
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

  if (markers.length === 0) return null;

  return (
    <div className="section">
      <h3>Nestenkaart</h3>
      <div ref={mapRef} style={{ height: 280, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }} />
      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
        {markers.length} van {nesten.length} nesten met GPS-coördinaten
      </p>
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
    const key  = nest?.soort_euring || 'onbekend';
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

    // Nestsucces: afsluitend bezoek C-stadium
    const afsluitend = bezoekenVanLegsel
      .filter(b => b.stadium?.startsWith('C') || b.stadium === 'X0')
      .sort((a, b) => b.datum.localeCompare(a.datum))[0];
    if (afsluitend) {
      if (afsluitend.nestsucces > 0) perSoort[key].succes++;
      else if (afsluitend.nestsucces === 0) perSoort[key].mislukt++;
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
function computeStamboom({ legsels, bezoeken, nestring, ouders, nesten, vangsten }) {
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

  const stamBomen = topBomen.map(({ legselId, generaties }) => ({
    generaties,
    boom: bouwTak(legselId),
  }));

  return { topOuders, stamBomen };
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
          `Geïmporteerd: ${counts.nesten} nesten, ${counts.legsels} legsels, ${counts.bezoeken} bezoeken, ${counts.ringen} ringen.`,
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

  const stamboomData = useMemo(() =>
    computeStamboom({ legsels, bezoeken, nestring: ringen, ouders, nesten, vangsten }),
    [legsels, bezoeken, ringen, ouders, nesten, vangsten]
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
                          ⌂ {boom.nest.kastnummer}
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

        {/* Backup export */}
        <div className="section">
          <h3>Backup</h3>
          <div className="export-buttons">
            <button
              className="btn-secondary"
              onClick={() => exportNestJSONBackup({ nesten, legsels, bezoeken, ringen, vangsten: vangsten ?? [] })}
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
                <StamboomTak key={kindTak.legselId + j} tak={kindTak} diepte={0} navigate={navigate} />
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

