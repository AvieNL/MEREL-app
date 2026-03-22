import { useMemo, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import { exportCSV, exportJSON, exportGrielXML, downloadFile } from '../../utils/export';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import { useDisplayNaam } from '../../hooks/useDisplayNaam';
import { buildEuringLookup } from '../../utils/euring-lookup';
import { BarChartStacked, BarChartSimple, LineChart, VangstKaart, useChartData } from './Charts';
import { parseDate, dagenTussen, haversineKm, formatDagen, formatAfstand } from '../../utils/statsHelper';
import { formatDatum, toYMD, todayISO, yesterdayISO } from '../../utils/dateHelper';
import { buildEersteVangstMap } from '../../utils/catchHelper';
import { STATS_UITGESLOTEN } from '../../data/constants';
import { useSettings } from '../../hooks/useSettings';
import './StatsPage.css';

function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function computeStats(records) {
  const soorten = new Set();
  const perSoort = {};
  const perMaand = {};
  const perProject = {};
  let nieuw = 0;
  let terugvangst = 0;

  records.forEach(r => {
    const rauweNaam = r.vogelnaam || 'Onbekend';
    const key = rauweNaam.toLowerCase();
    soorten.add(key);

    if (!perSoort[key]) perSoort[key] = { nieuw: 0, terugvangst: 0, naam: capitalize(rauweNaam) };
    if (r.metalenringinfo !== 4 && r.metalenringinfo !== '4') {
      perSoort[key].nieuw++;
      nieuw++;
    } else {
      perSoort[key].terugvangst++;
      terugvangst++;
    }

    if (r.vangstdatum) {
      const parts = r.vangstdatum.split('-');
      let maandKey;
      if (parts[0].length === 4) {
        maandKey = `${parts[0]}-${parts[1]}`;
      } else if (parts[2] && parts[2].length === 4) {
        maandKey = `${parts[2]}-${parts[1]}`;
      }
      if (maandKey) {
        perMaand[maandKey] = (perMaand[maandKey] || 0) + 1;
      }
    }

    if (r.project) {
      if (!perProject[r.project]) perProject[r.project] = { totaal: 0, nieuw: 0, terugvangst: 0, soorten: new Set() };
      perProject[r.project].totaal++;
      if (r.metalenringinfo !== 4 && r.metalenringinfo !== '4') {
        perProject[r.project].nieuw++;
      } else {
        perProject[r.project].terugvangst++;
      }
      perProject[r.project].soorten.add(key);
    }
  });

  const topSoorten = Object.entries(perSoort)
    .map(([, s]) => [s.naam, s.nieuw + s.terugvangst])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  const soortenTabel = Object.entries(perSoort)
    .map(([, s]) => ({ naam: s.naam, nieuw: s.nieuw, terugvangst: s.terugvangst, totaal: s.nieuw + s.terugvangst }))
    .sort((a, b) => b.totaal - a.totaal);

  const projectTabel = Object.entries(perProject)
    .map(([naam, p]) => ({ naam, totaal: p.totaal, nieuw: p.nieuw, terugvangst: p.terugvangst, soorten: p.soorten.size }))
    .sort((a, b) => b.totaal - a.totaal);

  return { total: records.length, soorten: soorten.size, nieuw, terugvangst, topSoorten, perMaand, perProject, soortenTabel, projectTabel };
}

function computeTerugvangsten(records, fallbackLat, fallbackLon) {
  const eersteVangst = buildEersteVangstMap(records);

  const lijst = [];
  records.forEach(r => {
    if (!r.ringnummer) return;
    if (r.metalenringinfo !== 4 && r.metalenringinfo !== '4') return;

    const origineel = eersteVangst[r.ringnummer];
    const tvDatum = parseDate(r.vangstdatum);
    const origDatum = origineel ? parseDate(origineel.vangstdatum) : null;
    const dagen = dagenTussen(origDatum, tvDatum);

    let afstandKm = null;
    if (origineel) {
      const lat1 = parseFloat(origineel.lat) || fallbackLat || null;
      const lon1 = parseFloat(origineel.lon) || fallbackLon || null;
      const lat2 = parseFloat(r.lat);
      const lon2 = parseFloat(r.lon);
      afstandKm = haversineKm(lat1, lon1, lat2, lon2);
    }

    lijst.push({
      id: r.id,
      ringnummer: r.ringnummer,
      soort: r.vogelnaam || 'Onbekend',
      datum: r.vangstdatum,
      origDatum: origineel?.vangstdatum || null,
      origPlaats: origineel?.plaatscode || origineel?.google_plaats || null,
      plaats: r.plaatscode || r.google_plaats || '',
      dagen,
      afstandKm,
      project: r.project || '',
    });
  });

  return lijst;
}

// --- Import parsers ---

function parseGrielXML(text) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'application/xml');
  const vangsten = doc.querySelectorAll('vangst');
  const records = [];

  vangsten.forEach(v => {
    const record = {};
    for (const child of v.children) {
      let val = child.textContent.trim();
      if (['vleugel','gewicht','kop_snavel','tarsus_lengte','handpenlengte','staartlengte','snavel_schedel','tarsus_teen','tarsus_dikte','achternagel'].includes(child.tagName)) {
        val = val.replace(',', '.');
      }
      if (['metalenringinfo','verificatie','verplaatst','nauwk_vangstdatum','nauwk_coord','zeker_omstandigheden'].includes(child.tagName)) {
        const num = parseInt(val, 10);
        record[child.tagName] = isNaN(num) ? val : num;
      } else {
        record[child.tagName] = val;
      }
    }
    if (record.vangstdatum) {
      const parts = record.vangstdatum.split('-');
      if (parts.length === 3 && parts[2].length === 4) {
        record.vangstdatum = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    records.push(record);
  });

  return records;
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];

  const sep = lines[0].includes('\t') ? '\t' : (lines[0].includes(';') ? ';' : ',');
  const headers = lines[0].split(sep).map(h => h.replace(/^["']|["']$/g, '').trim());

  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(sep).map(v => v.replace(/^["']|["']$/g, '').trim());
    if (vals.length < 2) continue;
    const record = {};
    headers.forEach((h, j) => {
      if (h && vals[j] !== undefined) {
        record[h] = vals[j];
      }
    });
    ['metalenringinfo','verificatie','verplaatst','nauwk_vangstdatum','nauwk_coord','zeker_omstandigheden'].forEach(f => {
      if (record[f] !== undefined) {
        const num = parseInt(record[f], 10);
        if (!isNaN(num)) record[f] = num;
      }
    });
    records.push(record);
  }

  return records;
}


export default function StatsPage({ records, recordsLoading = false, markAllAsUploaded, importRecords, projects = [], myAupis = {} }) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { t } = useTranslation(['common', 'errors']);
  const speciesRef = useSpeciesRef();
  const euringLookup = useMemo(() => buildEuringLookup(speciesRef), [speciesRef]);
  const displayNaam = useDisplayNaam();
  const { settings } = useSettings();

  const statsRecords = useMemo(
    () => records.filter(r =>
      !STATS_UITGESLOTEN.includes(r.vogelnaam?.toLowerCase()) &&
      r.bron !== 'externe_ring_info'
    ),
    [records]
  );
  const [showUploadConfirm, setShowUploadConfirm] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportFout, setExportFout] = useState('');

  function openSoorten(soortenTabel, titel) {
    const translated = soortenTabel.map(s => ({ ...s, naam: displayNaam(s.naam) }));
    navigate('/stats/soorten', { state: { soortenTabel: translated, titel } });
  }
  const [tvSorteer, setTvSorteer] = useState('tijd');
  const [jaarPopup, setJaarPopup] = useState(null);
  const [exportVan, setExportVan] = useState('');
  const [exportTot, setExportTot] = useState('');
  const [eigenFilter, setEigenFilter] = useState(true);
  const fileInputRef = useRef(null);

  const eigenProjectNamen = useMemo(
    () => new Set(projects.map(p => p.naam)),
    [projects]
  );

  const gefilterdRecords = useMemo(
    () => eigenFilter
      ? statsRecords.filter(r => !r.project || eigenProjectNamen.has(r.project))
      : statsRecords,
    [statsRecords, eigenFilter, eigenProjectNamen]
  );

  // Kaart toont ook externe_ring_info (als rode stip), maar telt niet mee in stats
  const kaartRecords = useMemo(() => {
    const externRingInfo = records.filter(r => r.bron === 'externe_ring_info' && r.lat && r.lon);
    return [...gefilterdRecords, ...externRingInfo];
  }, [gefilterdRecords, records]);

  const huidigeRecords = useMemo(
    () => statsRecords.filter(r => !r.uploaded && r.bron !== 'griel_import' && r.bron !== 'externe_tv_melding'),
    [statsRecords]
  );
  const huidigeStats = useMemo(() => computeStats(huidigeRecords), [huidigeRecords]);

  const historischeRecords = useMemo(
    () => gefilterdRecords.filter(r => r.uploaded || r.bron === 'griel_import'),
    [gefilterdRecords]
  );

  const soortenIndicatoren = useMemo(() => {
    if (huidigeRecords.length === 0) return {};
    const huidigJaar = new Date().getFullYear();

    const historisch = {};
    historischeRecords.forEach(r => {
      const key = (r.vogelnaam || 'onbekend').toLowerCase();
      if (!historisch[key]) historisch[key] = { dagCounts: {}, jaren: new Set() };
      const d = parseDate(r.vangstdatum);
      if (d) {
        const dagKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        historisch[key].dagCounts[dagKey] = (historisch[key].dagCounts[dagKey] || 0) + 1;
        historisch[key].jaren.add(d.getFullYear());
      }
    });

    const vandaagCounts = {};
    huidigeRecords.forEach(r => {
      const key = (r.vogelnaam || 'onbekend').toLowerCase();
      vandaagCounts[key] = (vandaagCounts[key] || 0) + 1;
    });

    const result = {};
    for (const [key, vandaagCount] of Object.entries(vandaagCounts)) {
      const hist = historisch[key];
      const maxDagCount = hist ? Math.max(...Object.values(hist.dagCounts), 0) : 0;
      const isBaansoort = !hist;
      const isDagrecord = vandaagCount > maxDagCount;
      const isJaarsoort = !hist || !hist.jaren.has(huidigJaar);

      if (isBaansoort || isDagrecord) {
        result[key] = '*';
      } else if (isJaarsoort) {
        result[key] = '†';
      }
    }
    return result;
  }, [huidigeRecords, historischeRecords]);

  const totaalStats = useMemo(() => computeStats(gefilterdRecords), [gefilterdRecords]);
  const alleTerugvangsten = useMemo(() => {
    const fbLat = parseFloat(settings.ringstationLat) || null;
    const fbLon = parseFloat(settings.ringstationLon) || null;
    return computeTerugvangsten(gefilterdRecords, fbLat, fbLon);
  }, [gefilterdRecords, settings.ringstationLat, settings.ringstationLon]);
  const { perJaar, perMaand, soortenPerJaar } = useChartData(gefilterdRecords);

  const terugvangsten = useMemo(() => {
    const sorted = [...alleTerugvangsten].sort((a, b) => {
      if (tvSorteer === 'afstand') return (b.afstandKm || 0) - (a.afstandKm || 0);
      return (b.dagen || 0) - (a.dagen || 0);
    });
    return sorted.slice(0, 10);
  }, [alleTerugvangsten, tvSorteer]);

  const filterByDatum = useCallback((data) => {
    if (!exportVan && !exportTot) return data;
    return data.filter(r => {
      const iso = toYMD(r.vangstdatum);
      if (!iso) return false;
      if (exportVan && iso < exportVan) return false;
      if (exportTot && iso > exportTot) return false;
      return true;
    });
  }, [exportVan, exportTot]);

  function setSnelfilter(type) {
    const vandaag = todayISO();
    const gisteren = yesterdayISO();
    if (type === 'vandaag')   { setExportVan(vandaag);   setExportTot(vandaag); }
    if (type === 'gisteren')  { setExportVan(gisteren);  setExportTot(gisteren); }
    if (type === 'alles')     { setExportVan('');         setExportTot(''); }
  }

  function handleExport(type, subset) {
    setExporting(type);
    setExportFout('');
    const base = subset === 'huidig' ? huidigeRecords : records;
    const data = filterByDatum(base);
    const datum = new Date().toISOString().split('T')[0];
    switch (type) {
      case 'csv': {
        const csv = exportCSV(data);
        downloadFile(csv, `vrs-export-${datum}.csv`, 'text/csv');
        break;
      }
      case 'json': {
        const json = exportJSON(data);
        downloadFile(json, `vrs-export-${datum}.json`, 'application/json');
        break;
      }
      case 'griel': {
        const projectAupis = {};
        projects.forEach(p => {
          if (myAupis[p.id]) projectAupis[p.naam] = myAupis[p.id];
        });

        const teExporteren = data.filter(r => r.bron !== 'buitenland_import' && r.bron !== 'andere_banen_import' && r.bron !== 'griel_import' && r.bron !== 'externe_tv_melding' && r.bron !== 'externe_ring_info');

        const geenCode = teExporteren.filter(r => !euringLookup[r.vogelnaam?.toLowerCase()]);
        if (geenCode.length > 0) {
          const namen = [...new Set(geenCode.map(r => r.vogelnaam || '(leeg)'))].slice(0, 5).join(', ');
          setExportFout(t('errors:export_no_euring', { count: geenCode.length, names: namen }));
          setExporting(false);
          return;
        }

        const geenDatum = teExporteren.filter(r => !r.vangstdatum);
        if (geenDatum.length > 0) {
          setExportFout(t('errors:export_no_date', { count: geenDatum.length }));
          setExporting(false);
          return;
        }

        const kortRing = teExporteren.filter(r => !r.ringnummer || String(r.ringnummer).trim().length < 4);
        if (kortRing.length > 0) {
          setExportFout(t('errors:export_short_ring', { count: kortRing.length }));
          setExporting(false);
          return;
        }

        const projectenInExport = [...new Set(teExporteren.map(r => r.project).filter(Boolean))];
        const ontbrekend = projectenInExport.filter(naam => !projectAupis[naam]);

        if (ontbrekend.length > 0) {
          setExportFout(t('errors:export_no_aupi', { projects: ontbrekend.join(', ') }));
          setExporting(false);
          return;
        }

        const xml = exportGrielXML(teExporteren, projects, projectAupis, euringLookup);
        downloadFile(xml, `vrs-griel-${datum}.xml`, 'application/xml');
        if (subset === 'huidig') {
          setShowUploadConfirm(true);
        }
        break;
      }
    }
    setExporting(false);
  }

  function handleConfirmUploaded() {
    markAllAsUploaded();
    setShowUploadConfirm(false);
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      let parsed = [];

      try {
        const name = file.name.toLowerCase();
        if (name.endsWith('.xml')) {
          parsed = parseGrielXML(text);
        } else if (name.endsWith('.csv') || name.endsWith('.tsv') || name.endsWith('.txt')) {
          parsed = parseCSV(text);
        } else if (name.endsWith('.json')) {
          const json = JSON.parse(text);
          parsed = Array.isArray(json) ? json : [];
        } else {
          parsed = parseCSV(text);
        }

        if (parsed.length === 0) {
          addToast(t('errors:import_no_records'), 'error', 0);
        } else {
          const REQUIRED = ['vogelnaam', 'ringnummer', 'vangstdatum'];
          const invalid = parsed.filter(r => REQUIRED.some(f => !r[f]));
          if (invalid.length > 0) {
            addToast(t('errors:import_missing_fields', { count: invalid.length }), 'error', 0);
          } else {
            const count = importRecords(parsed);
            addToast(t('errors:import_success', { count }), 'success');
          }
        }
      } catch (err) {
        addToast(t('errors:import_failed', { msg: err.message }), 'error', 0);
      }

      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  }


  if (recordsLoading) {
    return (
      <div className="page stats-page">
        <div className="empty-state">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="page stats-page">
      {/* Sectie 1: Huidige vangst */}
      <div className="stats-section stats-section--huidig">
        <h2 className="stats-section-title">{t('stats_current_catch')}</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{huidigeStats.total}</div>
            <div className="stat-label">{t('stats_total')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{huidigeStats.soorten}</div>
            <div className="stat-label">{t('stats_species')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{huidigeStats.nieuw}</div>
            <div className="stat-label">{t('stats_new')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{huidigeStats.terugvangst}</div>
            <div className="stat-label">{t('stats_recatch')}</div>
          </div>
        </div>

        {huidigeStats.soortenTabel.length > 0 ? (
          <div className="trektellen-table-wrap">
            <table className="trektellen-table">
              <thead>
                <tr>
                  <th className="tt-col-soort">{t('stats_col_species')}</th>
                  <th className="tt-col-num">{t('stats_col_new')}</th>
                  <th className="tt-col-num">{t('stats_col_recatch')}</th>
                  <th className="tt-col-num">{t('stats_col_total')}</th>
                </tr>
              </thead>
              <tbody>
                {huidigeStats.soortenTabel.map(s => {
                  const indicator = soortenIndicatoren[s.naam.toLowerCase()];
                  return (
                    <tr key={s.naam}>
                      <td className="tt-col-soort">
                        {displayNaam(s.naam)}
                        {indicator && <span className={`soort-indicator soort-indicator--${indicator === '*' ? 'record' : 'jaar'}`}>{indicator}</span>}
                      </td>
                      <td className="tt-col-num">{s.nieuw || ''}</td>
                      <td className="tt-col-num">{s.terugvangst || ''}</td>
                      <td className="tt-col-num tt-col-total">{s.totaal}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="tt-totaal-row">
                  <td className="tt-col-soort">{t('stats_total_footer', { count: huidigeStats.soorten })}</td>
                  <td className="tt-col-num">{huidigeStats.nieuw}</td>
                  <td className="tt-col-num">{huidigeStats.terugvangst}</td>
                  <td className="tt-col-num tt-col-total">{huidigeStats.total}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <p className="stats-empty">{t('stats_no_new_catches')}</p>
        )}

        {Object.keys(soortenIndicatoren).length > 0 && (
          <div className="soort-indicator-legenda">
            {Object.values(soortenIndicatoren).includes('*') && (
              <span><span className="soort-indicator soort-indicator--record">*</span> {t('stats_indicator_record')}</span>
            )}
            {Object.values(soortenIndicatoren).includes('†') && (
              <span><span className="soort-indicator soort-indicator--jaar">†</span> {t('stats_indicator_jaar')}</span>
            )}
          </div>
        )}

        {huidigeStats.total > 1 && (
          <div className="trektellen-link">
            <a href="https://www.trektellen.nl" target="_blank" rel="noopener noreferrer">
              trektellen.nl
            </a>
          </div>
        )}

        {huidigeStats.total > 0 && (
          <div className="export-buttons">
            <button className="btn-primary" onClick={() => handleExport('griel', 'huidig')} disabled={!!exporting}>
              {exporting === 'griel' ? t('stats_exporting') : t('stats_export_griel_current')}
            </button>
            {exportFout && (
              <div className="export-fout" role="alert">
                {exportFout}
                <button className="export-fout-sluiten" onClick={() => setExportFout('')} aria-label={t('pd_close_aria')}>✕</button>
              </div>
            )}
          </div>
        )}

        {showUploadConfirm && (
          <div className="upload-confirm">
            <p>{t('stats_export_confirm')}</p>
            <div className="upload-confirm-buttons">
              <button className="btn-primary" onClick={handleConfirmUploaded}>
                {t('stats_export_confirm_yes')}
              </button>
              <button className="btn-secondary" onClick={() => setShowUploadConfirm(false)}>
                {t('stats_export_confirm_no')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sectie 2: Totaal overzicht */}
      <div className="stats-section stats-section--totaal">
        <div className="stats-section-header">
          <h2 className="stats-section-title">{t('stats_total_overview')}</h2>
          <div className="tv-toggle">
            <button
              className={`tv-toggle-btn${eigenFilter ? ' active' : ''}`}
              onClick={() => setEigenFilter(true)}
            >{t('stats_own_projects')}</button>
            <button
              className={`tv-toggle-btn${!eigenFilter ? ' active' : ''}`}
              onClick={() => setEigenFilter(false)}
            >{t('stats_all_catches')}</button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{totaalStats.total}</div>
            <div className="stat-label">{t('stats_total_catches')}</div>
          </div>
          <div className="stat-card stat-card--link" onClick={() => openSoorten(totaalStats.soortenTabel, t('stats_total_overview'))}>
            <div className="stat-value">{totaalStats.soorten}</div>
            <div className="stat-label">{t('stats_species')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totaalStats.nieuw}</div>
            <div className="stat-label">{t('stats_new_rings')}</div>
          </div>
          <div className="stat-card stat-card--link" onClick={() => navigate('/stats/terugvangsten', { state: { eigenFilter } })}>
            <div className="stat-value">{totaalStats.terugvangst}</div>
            <div className="stat-label">{t('stats_recatches')}</div>
          </div>
        </div>

        {/* Grafieken */}
        {perJaar.length > 1 && (
          <BarChartStacked data={perJaar} title={t('stats_chart_per_year')} />
        )}

        {perMaand.some(m => m.count > 0) && (
          <BarChartSimple data={perMaand} title={t('stats_chart_per_month')} />
        )}

        {soortenPerJaar.length > 1 && (
          <>
            <LineChart
              data={soortenPerJaar}
              title={t('stats_chart_species_per_year')}
              xKey="jaar"
              yKey="soorten"
              onPointClick={pt => setJaarPopup(prev =>
                prev?.jaar === pt.jaar ? null : {
                  jaar: pt.jaar,
                  soorten: [...pt.soortenSet].sort((a, b) => a.localeCompare(b, 'nl')),
                }
              )}
            />
            {jaarPopup && (
              <div className="jaar-inline">
                <div className="jaar-inline-header">
                  <strong>{t('stats_species_in_year', { count: jaarPopup.soorten.length, year: jaarPopup.jaar })}</strong>
                  <button className="jaar-inline-close" onClick={() => setJaarPopup(null)} aria-label="Sluiten">✕</button>
                </div>
                <ul className="jaar-inline-list">
                  {jaarPopup.soorten.map(s => (
                    <li key={s}>{displayNaam(s)}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* Top soorten */}
        <div className="section">
          <h3>{t('stats_top_species')}</h3>
          <div className="top-list">
            {totaalStats.topSoorten.map(([naam, count]) => (
              <div key={naam} className="top-item">
                <span className="top-name">{displayNaam(naam)}</span>
                <div className="top-bar-wrap">
                  <div
                    className="top-bar"
                    style={{ width: `${(count / totaalStats.topSoorten[0][1]) * 100}%` }}
                  />
                </div>
                <span className="top-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Terugvangsten */}
        {terugvangsten.length > 0 && (
          <div className="section">
            <div className="tv-header">
              <h3>{t('stats_recatches_top10')}</h3>
              <div className="tv-toggle">
                <button className={`tv-toggle-btn${tvSorteer === 'tijd' ? ' active' : ''}`} onClick={() => setTvSorteer('tijd')}>{t('stats_longest_time')}</button>
                <button className={`tv-toggle-btn${tvSorteer === 'afstand' ? ' active' : ''}`} onClick={() => setTvSorteer('afstand')}>{t('stats_furthest_distance')}</button>
              </div>
            </div>
            <div className="trektellen-table-wrap">
              <table className="trektellen-table">
                <thead>
                  <tr>
                    <th className="tt-col-soort">{t('stats_col_species')}</th>
                    <th>{t('stats_col_ring')}</th>
                    <th>{t('stats_col_date')}</th>
                    <th className="tt-col-num">{t('stats_col_time')}</th>
                    <th className="tt-col-num">{t('stats_col_distance')}</th>
                  </tr>
                </thead>
                <tbody>
                  {terugvangsten.map((tv, i) => (
                    <tr key={`${tv.ringnummer}-${tv.datum}-${i}`}>
                      <td className="tt-col-soort">{displayNaam(tv.soort)}</td>
                      <td className="tv-ring"><span className="ring-link" onClick={() => navigate('/records', { state: { openId: tv.id } })}>{tv.ringnummer}</span></td>
                      <td className="tv-datum">{formatDatum(tv.datum) || '—'}</td>
                      <td className="tt-col-num tv-tijd">{formatDagen(tv.dagen)}</td>
                      <td className="tt-col-num tv-afstand">{formatAfstand(tv.afstandKm)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Kaart */}
        <VangstKaart targetRecords={kaartRecords} allRecords={kaartRecords} fallbackLat={parseFloat(settings.ringstationLat) || null} fallbackLon={parseFloat(settings.ringstationLon) || null} />

        {/* Per project */}
        {totaalStats.projectTabel.length > 0 && (
          <div className="section">
            <h3>{t('stats_per_project')}</h3>
            <div className="trektellen-table-wrap">
              <table className="trektellen-table">
                <thead>
                  <tr>
                    <th className="tt-col-soort">{t('stats_col_project')}</th>
                    <th className="tt-col-num">{t('stats_col_total')}</th>
                    <th className="tt-col-num">{t('stats_col_new')}</th>
                    <th className="tt-col-num">{t('stats_col_recatch')}</th>
                    <th className="tt-col-num">{t('stats_species')}</th>
                  </tr>
                </thead>
                <tbody>
                  {totaalStats.projectTabel.map(p => {
                    const eigenProject = projects.some(ep => ep.naam === p.naam);
                    return (
                      <tr key={p.naam} className={eigenProject ? '' : 'project-row--extern'}>
                        <td className="tt-col-soort">
                          <Link to={`/stats/project/${encodeURIComponent(p.naam)}`} className="project-table-link">
                            {p.naam}
                          </Link>
                          {!eigenProject && <span className="project-extern-badge">extern</span>}
                        </td>
                        <td className="tt-col-num tt-col-total">{p.totaal}</td>
                        <td className="tt-col-num">{p.nieuw || ''}</td>
                        <td className="tt-col-num">{p.terugvangst || ''}</td>
                        <td className="tt-col-num">{p.soorten}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="tt-totaal-row">
                    <td className="tt-col-soort">{t('stats_project_total_footer', { count: totaalStats.projectTabel.length })}</td>
                    <td className="tt-col-num tt-col-total">{totaalStats.total}</td>
                    <td className="tt-col-num">{totaalStats.nieuw}</td>
                    <td className="tt-col-num">{totaalStats.terugvangst}</td>
                    <td className="tt-col-num">{totaalStats.soorten}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Import & Export */}
        <div className="section">
          <h3>{t('stats_import')}</h3>
          <p className="import-info">{t('stats_import_info')}</p>
          <div className="import-area">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xml,.csv,.tsv,.txt,.json"
              onChange={handleImportFile}
              className="import-file-input"
              id="import-file"
            />
            <label htmlFor="import-file" className="btn-secondary import-label">
              {t('stats_choose_file')}
            </label>
          </div>
        </div>

        <div className="section">
          <h3>{t('stats_export')}</h3>

          {/* Datumfilter */}
          <div className="export-filter">
            <div className="export-filter-snel">
              <button
                className={`btn-secondary btn-sm${!exportVan && !exportTot ? ' active' : ''}`}
                onClick={() => setSnelfilter('alles')}
              >{t('stats_filter_all')}</button>
              <button
                className={`btn-secondary btn-sm${exportVan === todayISO() && exportVan === exportTot ? ' active' : ''}`}
                onClick={() => setSnelfilter('vandaag')}
              >{t('stats_filter_today')}</button>
              <button
                className={`btn-secondary btn-sm${exportVan === yesterdayISO() && exportVan === exportTot ? ' active' : ''}`}
                onClick={() => setSnelfilter('gisteren')}
              >{t('stats_filter_yesterday')}</button>
            </div>
            <div className="export-filter-bereik">
              <input
                type="date"
                value={exportVan}
                onChange={e => setExportVan(e.target.value)}
                className="export-date-input"
              />
              <span className="export-filter-tot">{t('stats_filter_until')}</span>
              <input
                type="date"
                value={exportTot}
                onChange={e => setExportTot(e.target.value)}
                className="export-date-input"
              />
            </div>
            <p className="export-filter-count">
              {t('stats_selected_catches', { count: filterByDatum(records).length })}
            </p>
          </div>

          <div className="export-buttons">
            <button className="btn-primary" onClick={() => handleExport('griel', 'alles')} disabled={!!exporting}>
              {exporting === 'griel' ? t('stats_exporting') : t('stats_export_griel_all')}
            </button>
            <button className="btn-secondary" onClick={() => handleExport('csv', 'alles')} disabled={!!exporting}>
              {exporting === 'csv' ? t('stats_exporting') : 'CSV'}
            </button>
            <button className="btn-secondary" onClick={() => handleExport('json', 'alles')} disabled={!!exporting}>
              {exporting === 'json' ? t('stats_exporting') : 'JSON'}
            </button>
          </div>
          {exportFout && (
            <div className="export-fout" role="alert">
              {exportFout}
              <button className="export-fout-sluiten" onClick={() => setExportFout('')} aria-label={t('pd_close_aria')}>✕</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
