import { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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
import '../Stats/StatsPage.css';

// Lookup maps voor labels
const habitatLabel    = Object.fromEntries(HABITAT_CODES.map(c    => [c.code, c.nl]));
const nesttypeLabel   = Object.fromEntries(NESTTYPE_CODES.map(c   => [c.code, c.nl]));
const nestplaatsLabel = Object.fromEntries(NESTPLAATS_CODES.map(c => [c.code, c.nl]));
const stadiumLabel    = Object.fromEntries(STADIUM_CODES.map(c    => [c.code, c.nl]));

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
export default function NestStatsPage() {
  const { t } = useTranslation();
  const { nesten, legsels, bezoeken, ringen, bulkImportNestBackup, markLegselsExported } = useNestData();
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

  // ── Totaaloverzicht ──
  const totaalStats = useMemo(() =>
    computeNestStats({ nesten, legsels, bezoeken, ringen, speciesByEuring, jaar: null }),
    [nesten, legsels, bezoeken, ringen, speciesByEuring]
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

  const [soortenSorteer, setSoortenSorteer] = useState('legsels');

  const stadiumVolgorde = ['B1','B2','B3','E1','E2','E3','E4','N1','N2','N3','N4','C','C+','X0','P','L1','L2'];

  const stadiumSorted = useMemo(() =>
    Object.entries(totaalStats.stadiumTelling)
      .sort((a, b) => {
        const ia = stadiumVolgorde.indexOf(a[0]);
        const ib = stadiumVolgorde.indexOf(b[0]);
        return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
      }),
    [totaalStats.stadiumTelling]
  );

  const maxStadium = useMemo(() =>
    Math.max(1, ...Object.values(totaalStats.stadiumTelling)),
    [totaalStats.stadiumTelling]
  );

  return (
    <div className="page stats-page">

      {/* ══ Sectie 1: Te exporteren ════════════════════════════════════════ */}
      <div className="stats-section stats-section--huidig">
        <h2 className="stats-section-title">Te exporteren</h2>

        <div className="stats-grid">
          <StatCard waarde={nieutStats.aantalNestenMet}  label="Actieve nesten" />
          <StatCard waarde={nieutStats.aantalLegsels}    label="Legsels" />
          <StatCard waarde={nieutStats.aantalBezoeken}   label="Bezoeken" />
          <StatCard waarde={nieutStats.aantalRingen}     label="Geringde pullen" />
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
      </div>

      {/* ══ Sectie 2: Totaaloverzicht ══════════════════════════════════════ */}
      <div className="stats-section stats-section--totaal">
        <h2 className="stats-section-title">{t('stats_total_overview')}</h2>

        <div className="stats-grid">
          <StatCard waarde={nesten.length}                     label="Nesten totaal" />
          <StatCard waarde={totaalStats.aantalLegsels}         label="Legsels totaal" />
          <StatCard waarde={totaalStats.totaalEieren}          label="Eieren gevonden" />
          <StatCard waarde={totaalStats.totaalPulli}           label="Pullen geteld" />
          <StatCard waarde={totaalStats.totaalUitgevlogen}     label="Uitgevlogen" />
          <StatCard waarde={totaalStats.aantalRingen}          label="Pullen geringd" />
          <StatCard waarde={totaalStats.aantalBezoeken}        label="Bezoeken totaal" />
          <StatCard waarde={totaalStats.aantalAfgerond}        label="Legsels afgerond" />
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

        {/* Top soorten (alle jaren) */}
        {totaalStats.perSoort.length > 0 && (
          <div className="section">
            <h3>Soorten (alle jaren)</h3>
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
                  {[...totaalStats.perSoort]
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
        {totaalStats.perSoort.some(s => s.succes > 0 || s.mislukt > 0) && (
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
                  {totaalStats.perSoort
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

      {totaalStats.aantalLegsels === 0 && nesten.length === 0 && (
        <p className="stats-empty" style={{ textAlign: 'center', marginTop: 40 }}>
          {t('nest_stats_empty_all')}
        </p>
      )}
    </div>
  );
}

// ── Sub-componenten ────────────────────────────────────────────────────────
function StatCard({ waarde, label }) {
  return (
    <div className="stat-card">
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

