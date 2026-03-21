import { useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDisplayNaam } from '../../hooks/useDisplayNaam';
import { BarChartSimple, VangstKaart } from './Charts';
import { buildEersteVangstMap } from '../../utils/catchHelper';
import { parseDate, dagenTussen, haversineKm, formatDagen, formatAfstand } from '../../utils/statsHelper';
import { formatDatum } from '../../utils/dateHelper';
import { STATS_UITGESLOTEN } from '../../data/constants';
import { useSettings } from '../../hooks/useSettings';
import './StatsPage.css';

export default function TerugvangstDetail({ records, projects = [] }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSettings();
  const displayNaam = useDisplayNaam();
  const [sorteer, setSorteer] = useState('tijd');
  const [soortSort, setSoortSort] = useState({ col: 'tv', asc: false });
  const [eigenFilter, setEigenFilter] = useState(location.state?.eigenFilter ?? true);

  const eigenProjectNamen = useMemo(() => new Set(projects.map(p => p.naam)), [projects]);

  const gefilterd = useMemo(
    () => records.filter(r =>
      !STATS_UITGESLOTEN.includes(r.vogelnaam?.toLowerCase()) &&
      (!eigenFilter || !r.project || eigenProjectNamen.has(r.project))
    ),
    [records, eigenFilter, eigenProjectNamen]
  );

  const { list, nvPerSoort, tvRecords } = useMemo(() => {
    // externe_ring_info meedoen in eersteVangstMap (voor afstand/dagen berekening),
    // maar niet meetellen als eigen vangst
    const eersteVangst = buildEersteVangstMap(gefilterd);
    const nvPerSoort = {};
    const list = [];
    const tvRecords = [];

    gefilterd.forEach(r => {
      // Referentierecords van externe ringers niet meetellen als vangst
      if (r.bron === 'externe_ring_info') return;
      const key = (r.vogelnaam || '').toLowerCase();
      if (r.metalenringinfo !== 4 && r.metalenringinfo !== '4') {
        nvPerSoort[key] = (nvPerSoort[key] || 0) + 1;
        return;
      }
      tvRecords.push(r);
      if (!r.ringnummer) return;

      const orig = eersteVangst[r.ringnummer];
      const tvDatum = parseDate(r.vangstdatum);
      const origDatum = orig ? parseDate(orig.vangstdatum) : null;
      const dagen = dagenTussen(origDatum, tvDatum);
      const fbLat = parseFloat(settings.ringstationLat) || null;
      const fbLon = parseFloat(settings.ringstationLon) || null;
      const afstandKm = orig
        ? haversineKm(parseFloat(orig.lat) || fbLat, parseFloat(orig.lon) || fbLon, parseFloat(r.lat), parseFloat(r.lon))
        : null;

      list.push({
        id: r.id,
        soort: r.vogelnaam || '',
        ringnummer: r.ringnummer,
        datum: r.vangstdatum,
        origDatum: orig?.vangstdatum || null,
        plaats: r.google_plaats || r.plaatscode || '',
        origPlaats: orig?.google_plaats || orig?.plaatscode || '',
        dagen,
        afstandKm,
        month: tvDatum ? tvDatum.getMonth() : null,
      });
    });

    return { list, nvPerSoort, tvRecords };
  }, [gefilterd]);

  const oudste = useMemo(
    () => list.filter(tv => tv.dagen !== null).sort((a, b) => (b.dagen || 0) - (a.dagen || 0))[0] || null,
    [list]
  );
  const verste = useMemo(
    () => list.filter(tv => tv.afstandKm !== null).sort((a, b) => (b.afstandKm || 0) - (a.afstandKm || 0))[0] || null,
    [list]
  );

  const avgDagen = useMemo(() => {
    const met = list.filter(tv => tv.dagen !== null);
    return met.length ? Math.round(met.reduce((s, tv) => s + tv.dagen, 0) / met.length) : null;
  }, [list]);

  const avgDist = useMemo(() => {
    const met = list.filter(tv => tv.afstandKm !== null);
    return met.length ? met.reduce((s, tv) => s + tv.afstandKm, 0) / met.length : null;
  }, [list]);

  const tijdData = useMemo(() => {
    const cats = [
      { label: t('tv_time_lt30'), max: 30 },
      { label: t('tv_time_1_3m'), max: 90 },
      { label: t('tv_time_3_12m'), max: 365 },
      { label: t('tv_time_1_3j'), max: 1095 },
      { label: t('tv_time_gt3j'), max: Infinity },
    ];
    const counts = cats.map(c => ({ label: c.label, count: 0 }));
    list.forEach(tv => {
      if (tv.dagen === null) return;
      const idx = cats.findIndex(c => tv.dagen < c.max);
      if (idx >= 0) counts[idx].count++;
    });
    return counts;
  }, [list, t]);

  const seizoenData = useMemo(() => {
    const labels = Array.from({ length: 12 }, (_, i) =>
      new Intl.DateTimeFormat(i18n.language, { month: 'short' }).format(new Date(2000, i, 1))
    );
    const counts = labels.map(label => ({ label, count: 0 }));
    list.forEach(tv => { if (tv.month !== null) counts[tv.month].count++; });
    return counts;
  }, [list, i18n.language]);

  const afstandData = useMemo(() => {
    const met = list.filter(tv => tv.afstandKm !== null);
    if (!met.length) return null;
    const cats = [
      { label: t('tv_dist_lt5'), max: 5 },
      { label: t('tv_dist_5_25'), max: 25 },
      { label: t('tv_dist_25_100'), max: 100 },
      { label: t('tv_dist_gt100'), max: Infinity },
    ];
    const counts = cats.map(c => ({ label: c.label, count: 0 }));
    met.forEach(tv => {
      const idx = cats.findIndex(c => tv.afstandKm < c.max);
      if (idx >= 0) counts[idx].count++;
    });
    return counts;
  }, [list, t]);

  const soortenTabel = useMemo(() => {
    const map = {};
    list.forEach(tv => {
      const key = tv.soort.toLowerCase();
      if (!map[key]) map[key] = { soort: tv.soort, tv: 0 };
      map[key].tv++;
    });
    return Object.values(map).map(s => {
      const nv = nvPerSoort[s.soort.toLowerCase()] || 0;
      const totaal = nv + s.tv;
      return { ...s, nv, totaal, pct: totaal > 0 ? Math.round((s.tv / totaal) * 100) : 0 };
    });
  }, [list, nvPerSoort]);

  const gesorteerdeSOorten = useMemo(() => {
    const { col, asc } = soortSort;
    return [...soortenTabel].sort((a, b) => {
      let cmp;
      if (col === 'soort') cmp = displayNaam(a.soort).localeCompare(displayNaam(b.soort), 'nl');
      else if (col === 'nv') cmp = a.nv - b.nv;
      else if (col === 'tv') cmp = a.tv - b.tv;
      else cmp = a.pct - b.pct;
      return asc ? cmp : -cmp;
    });
  }, [soortenTabel, soortSort, displayNaam]);

  const gesorteerd = useMemo(() => {
    return [...list]
      .sort((a, b) =>
        sorteer === 'afstand'
          ? (b.afstandKm || 0) - (a.afstandKm || 0)
          : (b.dagen || 0) - (a.dagen || 0)
      )
      .slice(0, 25);
  }, [list, sorteer]);

  if (list.length === 0) {
    return (
      <div className="page stats-page">
        <div className="stats-section-header">
          <Link to="/stats" className="project-back" style={{ marginTop: 8 }}>{t('pd_back')}</Link>
          <div className="tv-toggle">
            <button className={`tv-toggle-btn${eigenFilter ? ' active' : ''}`} onClick={() => setEigenFilter(true)}>{t('stats_own_projects')}</button>
            <button className={`tv-toggle-btn${!eigenFilter ? ' active' : ''}`} onClick={() => setEigenFilter(false)}>{t('stats_all_catches')}</button>
          </div>
        </div>
        <h2 className="stats-section-title" style={{ marginTop: 8 }}>{t('tv_title')}</h2>
        <p className="stats-empty">{t('tv_no_data')}</p>
      </div>
    );
  }

  return (
    <div className="page stats-page">
      <div className="stats-section-header">
        <Link to="/stats" className="project-back" style={{ marginTop: 8 }}>{t('pd_back')}</Link>
        <div className="tv-toggle">
          <button className={`tv-toggle-btn${eigenFilter ? ' active' : ''}`} onClick={() => setEigenFilter(true)}>{t('stats_own_projects')}</button>
          <button className={`tv-toggle-btn${!eigenFilter ? ' active' : ''}`} onClick={() => setEigenFilter(false)}>{t('stats_all_catches')}</button>
        </div>
      </div>
      <h2 className="stats-section-title" style={{ marginTop: 8 }}>{t('tv_title')}</h2>

      {/* Samenvattende statistieken */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{list.length}</div>
          <div className="stat-label">{t('stats_recatches')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{soortenTabel.length}</div>
          <div className="stat-label">{t('stats_species')}</div>
        </div>
        {avgDagen !== null && (
          <div className="stat-card">
            <div className="stat-value">{formatDagen(avgDagen)}</div>
            <div className="stat-label">{t('tv_avg_days')}</div>
          </div>
        )}
        {avgDist !== null && (
          <div className="stat-card">
            <div className="stat-value">{formatAfstand(avgDist)}</div>
            <div className="stat-label">{t('tv_avg_dist')}</div>
          </div>
        )}
      </div>

      {/* Record-kaarten: oudste en verste */}
      <div className="tv-records-row">
        {oudste && (
          <div className="tv-record-card">
            <div className="tv-record-label">{t('tv_record_oldest')}</div>
            <div className="tv-record-name">{displayNaam(oudste.soort)}</div>
            <div className="tv-record-value">{formatDagen(oudste.dagen)}</div>
            <span
              className="tv-record-ring ring-link"
              onClick={() => navigate('/records', { state: { openId: oudste.id } })}
            >{oudste.ringnummer?.replace(/\./g, '')}</span>
            <div className="tv-record-dates">
              {formatDatum(oudste.origDatum)} → {formatDatum(oudste.datum)}
            </div>
            {oudste.origPlaats && <div className="tv-record-plaats">{oudste.origPlaats}</div>}
          </div>
        )}
        {verste && (
          <div className="tv-record-card">
            <div className="tv-record-label">{t('tv_record_furthest')}</div>
            <div className="tv-record-name">{displayNaam(verste.soort)}</div>
            <div className="tv-record-value">{formatAfstand(verste.afstandKm)}</div>
            <span
              className="tv-record-ring ring-link"
              onClick={() => navigate('/records', { state: { openId: verste.id } })}
            >{verste.ringnummer?.replace(/\./g, '')}</span>
            <div className="tv-record-dates">
              {formatDatum(verste.origDatum)} → {formatDatum(verste.datum)}
            </div>
            {verste.origPlaats && <div className="tv-record-plaats">{verste.origPlaats}</div>}
          </div>
        )}
      </div>

      {/* Grafieken */}
      <BarChartSimple data={tijdData} title={t('tv_chart_time')} color="var(--accent, #38bdf8)" />
      <BarChartSimple data={seizoenData} title={t('tv_chart_season')} color="var(--success, #22c55e)" />
      {afstandData && (
        <BarChartSimple data={afstandData} title={t('tv_chart_distance')} color="var(--warning, #f97316)" />
      )}

      {/* Per soort */}
      <div className="section">
        <h3>{t('tv_species_section')}</h3>
        <div className="trektellen-table-wrap">
          <table className="trektellen-table">
            <thead>
              <tr>
                {[
                  { col: 'soort', label: t('stats_col_species'), cls: 'tt-col-soort' },
                  { col: 'nv',    label: t('stats_col_new'),     cls: 'tt-col-num' },
                  { col: 'tv',    label: t('stats_col_recatch'),  cls: 'tt-col-num' },
                  { col: 'pct',   label: t('tv_col_pct'),         cls: 'tt-col-num' },
                ].map(({ col, label, cls }) => (
                  <th
                    key={col}
                    className={`${cls} tt-col-sortable${soortSort.col === col ? ' tt-col-sorted' : ''}`}
                    onClick={() => setSoortSort(prev =>
                      prev.col === col ? { col, asc: !prev.asc } : { col, asc: col === 'soort' }
                    )}
                  >
                    {label}{soortSort.col === col ? (soortSort.asc ? ' ↑' : ' ↓') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gesorteerdeSOorten.map(s => (
                <tr key={s.soort}>
                  <td className="tt-col-soort">{displayNaam(s.soort)}</td>
                  <td className="tt-col-num">{s.nv || ''}</td>
                  <td className="tt-col-num">{s.tv}</td>
                  <td className="tt-col-num">{s.pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Kaart */}
      <VangstKaart targetRecords={tvRecords} allRecords={gefilterd} fallbackLat={parseFloat(settings.ringstationLat) || null} fallbackLon={parseFloat(settings.ringstationLon) || null} />

      {/* Alle terugvangsten */}
      <div className="section">
        <div className="tv-header">
          <h3>{t('tv_list_title')}</h3>
          <div className="tv-toggle">
            <button
              className={`tv-toggle-btn${sorteer === 'tijd' ? ' active' : ''}`}
              onClick={() => setSorteer('tijd')}
            >{t('stats_longest_time')}</button>
            <button
              className={`tv-toggle-btn${sorteer === 'afstand' ? ' active' : ''}`}
              onClick={() => setSorteer('afstand')}
            >{t('stats_furthest_distance')}</button>
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
              {gesorteerd.map((tv, i) => (
                <tr key={`${tv.ringnummer}-${tv.datum}-${i}`}>
                  <td className="tt-col-soort">{displayNaam(tv.soort)}</td>
                  <td className="tv-ring">
                    <span
                      className="ring-link"
                      onClick={() => navigate('/records', { state: { openId: tv.id } })}
                    >{tv.ringnummer?.replace(/\./g, '')}</span>
                  </td>
                  <td className="tv-datum">{formatDatum(tv.datum) || '—'}</td>
                  <td className="tt-col-num tv-tijd">{formatDagen(tv.dagen)}</td>
                  <td className="tt-col-num tv-afstand">{formatAfstand(tv.afstandKm)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
