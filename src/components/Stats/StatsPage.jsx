import { useMemo, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { exportCSV, exportJSON, exportGrielXML, downloadFile } from '../../utils/export';
import { BarChartStacked, BarChartSimple, LineChart, VangstKaart, useChartData } from './Charts';
import './StatsPage.css';

function toISO(d) {
  if (!d) return '';
  const parts = String(d).split('-');
  if (parts.length === 3 && parts[0].length === 2) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return String(d);
}

function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function parseDate(d) {
  if (!d) return null;
  const parts = d.split('-');
  if (parts[0].length === 4) return new Date(+parts[0], +parts[1] - 1, +parts[2]);
  if (parts[2] && parts[2].length === 4) return new Date(+parts[2], +parts[1] - 1, +parts[0]);
  return null;
}

function dagenTussen(d1, d2) {
  if (!d1 || !d2) return null;
  return Math.round(Math.abs(d2 - d1) / 86400000);
}

function haversineKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const toRad = x => x * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDagen(d) {
  if (d === null) return '—';
  if (d === 0) return 'zelfde dag';
  if (d < 30) return `${d} dg`;
  if (d < 365) return `${Math.floor(d / 30)} mnd ${d % 30 ? `${d % 30} dg` : ''}`.trim();
  const j = Math.floor(d / 365);
  const rest = d % 365;
  const m = Math.floor(rest / 30);
  return `${j} jr${m ? ` ${m} mnd` : ''}`;
}

function formatAfstand(km) {
  if (km === null) return '—';
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
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
    const key = rauweNaam.toLowerCase(); // case-insensitieve groepering
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

function computeTerugvangsten(records) {
  const eersteVangst = {};
  records.forEach(r => {
    if (!r.ringnummer) return;
    if (r.metalenringinfo !== 4 && r.metalenringinfo !== '4') {
      const bestaand = eersteVangst[r.ringnummer];
      if (!bestaand || (r.vangstdatum && (!bestaand.vangstdatum || r.vangstdatum < bestaand.vangstdatum))) {
        eersteVangst[r.ringnummer] = r;
      }
    }
  });

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
      const lat1 = parseFloat(origineel.lat);
      const lon1 = parseFloat(origineel.lon);
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
      // Nederlandse decimalen terugzetten
      if (['vleugel','gewicht','kop_snavel','tarsus_lengte','handpenlengte','staartlengte','snavel_schedel','tarsus_teen','tarsus_dikte','achternagel'].includes(child.tagName)) {
        val = val.replace(',', '.');
      }
      // Numerieke velden
      if (['metalenringinfo','verificatie','verplaatst','nauwk_vangstdatum','nauwk_coord','zeker_omstandigheden'].includes(child.tagName)) {
        const num = parseInt(val, 10);
        record[child.tagName] = isNaN(num) ? val : num;
      } else {
        record[child.tagName] = val;
      }
    }
    // Datum normaliseren naar yyyy-mm-dd
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

  // Detecteer separator
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
    // Numerieke velden
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

export default function StatsPage({ records, markAllAsUploaded, importRecords, projects = [], myAupis = {} }) {
  const navigate = useNavigate();
  const [showUploadConfirm, setShowUploadConfirm] = useState(false);
  const [exportError, setExportError] = useState('');

  function openSoorten(soortenTabel, titel) {
    navigate('/stats/soorten', { state: { soortenTabel, titel } });
  }
  const [tvSorteer, setTvSorteer] = useState('tijd');
  const [importStatus, setImportStatus] = useState(null);
  const [jaarPopup, setJaarPopup] = useState(null); // { jaar, soorten: string[] }
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
      ? records.filter(r => !r.project || eigenProjectNamen.has(r.project))
      : records,
    [records, eigenFilter, eigenProjectNamen]
  );

  const huidigeRecords = useMemo(
    () => records.filter(r => !r.uploaded && r.bron !== 'griel_import'),
    [records]
  );
  const huidigeStats = useMemo(() => computeStats(huidigeRecords), [huidigeRecords]);
  const totaalStats = useMemo(() => computeStats(gefilterdRecords), [gefilterdRecords]);
  const alleTerugvangsten = useMemo(() => computeTerugvangsten(gefilterdRecords), [gefilterdRecords]);
  const { perJaar, perMaand, soortenPerJaar } = useChartData(gefilterdRecords);

  const terugvangsten = useMemo(() => {
    const sorted = [...alleTerugvangsten].sort((a, b) => {
      if (tvSorteer === 'afstand') return (b.afstandKm || 0) - (a.afstandKm || 0);
      return (b.dagen || 0) - (a.dagen || 0);
    });
    return sorted.slice(0, 10);
  }, [alleTerugvangsten, tvSorteer]);

  function filterByDatum(data) {
    if (!exportVan && !exportTot) return data;
    return data.filter(r => {
      const iso = toISO(r.vangstdatum);
      if (!iso) return false;
      if (exportVan && iso < exportVan) return false;
      if (exportTot && iso > exportTot) return false;
      return true;
    });
  }

  function setSnelfilter(type) {
    const nu = new Date();
    const vandaag = nu.toISOString().slice(0, 10);
    const gisteren = new Date(nu - 86400000).toISOString().slice(0, 10);
    if (type === 'vandaag')   { setExportVan(vandaag);   setExportTot(vandaag); }
    if (type === 'gisteren')  { setExportVan(gisteren);  setExportTot(gisteren); }
    if (type === 'alles')     { setExportVan('');         setExportTot(''); }
  }

  function handleExport(type, subset) {
    setExportError('');
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
        // Bouw project_naam → aupi map
        const projectAupis = {};
        projects.forEach(p => {
          if (myAupis[p.id]) projectAupis[p.naam] = myAupis[p.id];
        });

        // Valideer AUPIs voor alle projecten in deze export
        const teExporteren = data.filter(r => r.bron !== 'buitenland_import' && r.bron !== 'andere_banen_import');
        const projectenInExport = [...new Set(teExporteren.map(r => r.project).filter(Boolean))];
        const ontbrekend = projectenInExport.filter(naam => !projectAupis[naam]);

        if (ontbrekend.length > 0) {
          setExportError(
            `ActingUserProjectID (AUPI) ontbreekt voor: ${ontbrekend.join(', ')}. ` +
            `Ga naar Projecten → open het project → klik op "Leden" → voer het AUPI-nummer in naast jouw naam. ` +
            `Je vindt dit nummer in GRIEL via: Mijn administratie → Mijn projecten → klik op het + naast het project.`
          );
          return;
        }

        const xml = exportGrielXML(teExporteren, projects, projectAupis);
        downloadFile(xml, `vrs-griel-${datum}.xml`, 'application/xml');
        if (subset === 'huidig') {
          setShowUploadConfirm(true);
        }
        break;
      }
    }
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
          // Probeer als CSV
          parsed = parseCSV(text);
        }

        if (parsed.length === 0) {
          setImportStatus({ type: 'error', message: 'Geen records gevonden in bestand.' });
        } else {
          const count = importRecords(parsed);
          setImportStatus({ type: 'success', message: `${count} records geïmporteerd.` });
        }
      } catch (err) {
        setImportStatus({ type: 'error', message: `Fout bij importeren: ${err.message}` });
      }

      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  }

  function formatDatum(d) {
    if (!d) return '—';
    const parts = d.split('-');
    if (parts[0].length === 4) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return d;
  }

  return (
    <div className="page stats-page">
      {/* Sectie 1: Huidige vangst */}
      <div className="stats-section stats-section--huidig">
        <h2 className="stats-section-title">Huidige vangst</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{huidigeStats.total}</div>
            <div className="stat-label">Totaal</div>
          </div>
          <div className="stat-card stat-card--link" onClick={() => openSoorten(huidigeStats.soortenTabel, 'Huidige vangst')}>
            <div className="stat-value">{huidigeStats.soorten}</div>
            <div className="stat-label">Soorten</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{huidigeStats.nieuw}</div>
            <div className="stat-label">Nieuw</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{huidigeStats.terugvangst}</div>
            <div className="stat-label">Terugvangst</div>
          </div>
        </div>

        {huidigeStats.soortenTabel.length > 0 ? (
          <div className="trektellen-table-wrap">
            <table className="trektellen-table">
              <thead>
                <tr>
                  <th className="tt-col-soort">Soort</th>
                  <th className="tt-col-num">Nieuw</th>
                  <th className="tt-col-num">Terugv.</th>
                  <th className="tt-col-num">Totaal</th>
                </tr>
              </thead>
              <tbody>
                {huidigeStats.soortenTabel.map(s => (
                  <tr key={s.naam}>
                    <td className="tt-col-soort">{capitalize(s.naam)}</td>
                    <td className="tt-col-num">{s.nieuw || ''}</td>
                    <td className="tt-col-num">{s.terugvangst || ''}</td>
                    <td className="tt-col-num tt-col-total">{s.totaal}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="tt-totaal-row">
                  <td className="tt-col-soort">Totaal ({huidigeStats.soorten} soorten)</td>
                  <td className="tt-col-num">{huidigeStats.nieuw}</td>
                  <td className="tt-col-num">{huidigeStats.terugvangst}</td>
                  <td className="tt-col-num tt-col-total">{huidigeStats.total}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <p className="stats-empty">Geen niet-geüploade vangsten.</p>
        )}

        {huidigeStats.total > 0 && (
          <div className="export-buttons">
            <button className="btn-primary" onClick={() => handleExport('griel', 'huidig')}>
              Griel XML exporteren
            </button>
          </div>
        )}

        {exportError && (
          <p className="export-error">{exportError}</p>
        )}

        {showUploadConfirm && (
          <div className="upload-confirm">
            <p>Export gelukt! Wil je deze vangsten als geüpload markeren?</p>
            <div className="upload-confirm-buttons">
              <button className="btn-primary" onClick={handleConfirmUploaded}>
                Ja, markeer als geüpload
              </button>
              <button className="btn-secondary" onClick={() => setShowUploadConfirm(false)}>
                Nee, nog niet
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sectie 2: Totaal overzicht */}
      <div className="stats-section stats-section--totaal">
        <div className="stats-section-header">
          <h2 className="stats-section-title">Totaal overzicht</h2>
          <div className="tv-toggle">
            <button
              className={`tv-toggle-btn${eigenFilter ? ' active' : ''}`}
              onClick={() => setEigenFilter(true)}
            >Eigen projecten</button>
            <button
              className={`tv-toggle-btn${!eigenFilter ? ' active' : ''}`}
              onClick={() => setEigenFilter(false)}
            >Alle vangsten</button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{totaalStats.total}</div>
            <div className="stat-label">Totaal vangsten</div>
          </div>
          <div className="stat-card stat-card--link" onClick={() => openSoorten(totaalStats.soortenTabel, 'Totaal overzicht')}>
            <div className="stat-value">{totaalStats.soorten}</div>
            <div className="stat-label">Soorten</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totaalStats.nieuw}</div>
            <div className="stat-label">Nieuwe ringen</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totaalStats.terugvangst}</div>
            <div className="stat-label">Terugvangsten</div>
          </div>
        </div>

        {/* Grafieken */}
        {perJaar.length > 1 && (
          <BarChartStacked data={perJaar} title="Vangsten per jaar" />
        )}

        {perMaand.some(m => m.count > 0) && (
          <BarChartSimple data={perMaand} title="Vangsten per maand" />
        )}

        {soortenPerJaar.length > 1 && (
          <>
            <LineChart
              data={soortenPerJaar}
              title="Soorten per jaar — klik op een punt voor de soortenlijst"
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
                  <strong>{jaarPopup.soorten.length} soorten in {jaarPopup.jaar}</strong>
                  <button className="jaar-inline-close" onClick={() => setJaarPopup(null)}>✕</button>
                </div>
                <ul className="jaar-inline-list">
                  {jaarPopup.soorten.map(s => (
                    <li key={s}>{capitalize(s)}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* Top soorten */}
        <div className="section">
          <h3>Top soorten</h3>
          <div className="top-list">
            {totaalStats.topSoorten.map(([naam, count]) => (
              <div key={naam} className="top-item">
                <span className="top-name">{capitalize(naam)}</span>
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
              <h3>Terugvangsten (top 10)</h3>
              <div className="tv-toggle">
                <button className={`tv-toggle-btn${tvSorteer === 'tijd' ? ' active' : ''}`} onClick={() => setTvSorteer('tijd')}>Langste tijd</button>
                <button className={`tv-toggle-btn${tvSorteer === 'afstand' ? ' active' : ''}`} onClick={() => setTvSorteer('afstand')}>Verste afstand</button>
              </div>
            </div>
            <div className="trektellen-table-wrap">
              <table className="trektellen-table">
                <thead>
                  <tr>
                    <th className="tt-col-soort">Soort</th>
                    <th>Ring</th>
                    <th>Datum</th>
                    <th className="tt-col-num">Tijd</th>
                    <th className="tt-col-num">Afstand</th>
                  </tr>
                </thead>
                <tbody>
                  {terugvangsten.map((tv, i) => (
                    <tr key={`${tv.ringnummer}-${tv.datum}-${i}`}>
                      <td className="tt-col-soort">{tv.soort}</td>
                      <td className="tv-ring"><span className="ring-link" onClick={() => navigate('/records', { state: { openId: tv.id } })}>{tv.ringnummer}</span></td>
                      <td className="tv-datum">{formatDatum(tv.datum)}</td>
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
        <VangstKaart targetRecords={gefilterdRecords} allRecords={gefilterdRecords} />

        {/* Per project */}
        {totaalStats.projectTabel.length > 0 && (
          <div className="section">
            <h3>Per project</h3>
            <div className="trektellen-table-wrap">
              <table className="trektellen-table">
                <thead>
                  <tr>
                    <th className="tt-col-soort">Project</th>
                    <th className="tt-col-num">Totaal</th>
                    <th className="tt-col-num">Nieuw</th>
                    <th className="tt-col-num">Terugv.</th>
                    <th className="tt-col-num">Soorten</th>
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
                    <td className="tt-col-soort">Totaal ({totaalStats.projectTabel.length} projecten)</td>
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
          <h3>Importeren</h3>
          <p className="import-info">Importeer vangsten vanuit een Griel XML-export, CSV of JSON-bestand.</p>
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
              Bestand kiezen...
            </label>
          </div>
          {importStatus && (
            <div className={`import-status import-status--${importStatus.type}`}>
              {importStatus.message}
            </div>
          )}
        </div>

        <div className="section">
          <h3>Exporteren</h3>

          {/* Datumfilter */}
          <div className="export-filter">
            <div className="export-filter-snel">
              <button
                className={`btn-secondary btn-sm${!exportVan && !exportTot ? ' active' : ''}`}
                onClick={() => setSnelfilter('alles')}
              >Alle</button>
              <button
                className={`btn-secondary btn-sm${exportVan === new Date().toISOString().slice(0,10) && exportVan === exportTot ? ' active' : ''}`}
                onClick={() => setSnelfilter('vandaag')}
              >Vandaag</button>
              <button
                className={`btn-secondary btn-sm${exportVan === new Date(Date.now()-86400000).toISOString().slice(0,10) && exportVan === exportTot ? ' active' : ''}`}
                onClick={() => setSnelfilter('gisteren')}
              >Gisteren</button>
            </div>
            <div className="export-filter-bereik">
              <input
                type="date"
                value={exportVan}
                onChange={e => setExportVan(e.target.value)}
                className="export-date-input"
              />
              <span className="export-filter-tot">t/m</span>
              <input
                type="date"
                value={exportTot}
                onChange={e => setExportTot(e.target.value)}
                className="export-date-input"
              />
            </div>
            <p className="export-filter-count">
              {filterByDatum(records).length} vangsten geselecteerd
            </p>
          </div>

          <div className="export-buttons">
            <button className="btn-primary" onClick={() => handleExport('griel', 'alles')}>
              Griel XML
            </button>
            <button className="btn-secondary" onClick={() => handleExport('csv', 'alles')}>
              CSV
            </button>
            <button className="btn-secondary" onClick={() => handleExport('json', 'alles')}>
              JSON
            </button>
          </div>
          {exportError && (
            <p className="export-error">{exportError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
