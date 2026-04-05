import { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDisplayNaam } from '../../hooks/useDisplayNaam';
import { BarChartStacked, BarChartSimple, LineChart, VangstKaart, useChartData } from './Charts';
import { parseDate, dagenTussen, haversineKm, formatDagen, formatAfstand } from '../../utils/statsHelper';
import { formatDatum } from '../../utils/dateHelper';
import { buildEersteVangstMap } from '../../utils/catchHelper';
import './StatsPage.css';

export default function ProjectDetail({ records }) {
  const navigate = useNavigate();
  const { naam } = useParams();
  const { t } = useTranslation();
  const displayNaam = useDisplayNaam();

  function openSoorten() {
    const tabel = stats.soortenTabel.map(s => ({ naam: displayNaam(s.soort), nieuw: s.nieuw, terugvangst: s.terugvangst, totaal: s.totaal }));
    navigate('/ring/stats/soorten', { state: { soortenTabel: tabel, titel: naam } });
  }

  const projectRecords = useMemo(
    () => records.filter(r => r.project === naam),
    [records, naam]
  );

  const [tvSorteer, setTvSorteer] = useState('tijd');
  const [jaarPopup, setJaarPopup] = useState(null);

  const stats = useMemo(() => {
    const perSoort = {};
    let nieuw = 0;
    let terugvangst = 0;

    projectRecords.forEach(r => {
      const rauweNaam = r.vogelnaam || t('pd_unknown');
      const key = rauweNaam.toLowerCase();
      const display = rauweNaam.charAt(0).toUpperCase() + rauweNaam.slice(1).toLowerCase();
      if (!perSoort[key]) perSoort[key] = { naam: display, nieuw: 0, terugvangst: 0 };
      if (r.metalenringinfo !== 4 && r.metalenringinfo !== '4') {
        perSoort[key].nieuw++;
        nieuw++;
      } else {
        perSoort[key].terugvangst++;
        terugvangst++;
      }
    });

    const soortenTabel = Object.entries(perSoort)
      .map(([, s]) => ({ soort: s.naam, nieuw: s.nieuw, terugvangst: s.terugvangst, totaal: s.nieuw + s.terugvangst }))
      .sort((a, b) => b.totaal - a.totaal);

    const datums = projectRecords
      .map(r => r.vangstdatum)
      .filter(Boolean)
      .sort();
    const eerste = datums[0] || null;
    const laatste = datums[datums.length - 1] || null;

    return {
      totaal: projectRecords.length,
      soorten: Object.keys(perSoort).length, // keys zijn al lowercase
      nieuw,
      terugvangst,
      soortenTabel,
      eerste,
      laatste,
    };
  }, [projectRecords]);

  const { perJaar, perMaand, soortenPerJaar } = useChartData(projectRecords);

  const topSoorten = useMemo(() => stats.soortenTabel.slice(0, 10), [stats.soortenTabel]);

  const alleTerugvangsten = useMemo(() => {
    const eersteVangst = buildEersteVangstMap(records);

    const lijst = [];
    projectRecords.forEach(r => {
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
        soort: r.vogelnaam || t('pd_unknown'),
        datum: r.vangstdatum,
        origDatum: origineel?.vangstdatum || null,
        dagen,
        afstandKm,
      });
    });

    return lijst;
  }, [projectRecords, records]);

  const terugvangsten = useMemo(() => {
    let lijst = alleTerugvangsten;
    if (tvSorteer === 'tijd') {
      const perRing = {};
      alleTerugvangsten.forEach(tv => {
        const key = (tv.ringnummer || '').replace(/\./g, '').toUpperCase();
        if (!perRing[key] || (tv.dagen || 0) > (perRing[key].dagen || 0)) {
          perRing[key] = tv;
        }
      });
      lijst = Object.values(perRing);
    }
    const sorted = [...lijst].sort((a, b) => {
      if (tvSorteer === 'afstand') return (b.afstandKm || 0) - (a.afstandKm || 0);
      return (b.dagen || 0) - (a.dagen || 0);
    });
    return sorted.slice(0, 10);
  }, [alleTerugvangsten, tvSorteer]);


  const topMax = topSoorten.length > 0 ? topSoorten[0].totaal : 1;

  return (
    <div className="page stats-page">
      <Link to="/ring/stats" className="btn-secondary page-back">{t('pd_back')}</Link>
      <h2 className="stats-section-title" style={{ marginTop: 8 }}>{naam}</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totaal}</div>
          <div className="stat-label">{t('pd_catches')}</div>
        </div>
        <div className="stat-card stat-card--link" onClick={openSoorten}>
          <div className="stat-value">{stats.soorten}</div>
          <div className="stat-label">{t('pd_species')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.nieuw}</div>
          <div className="stat-label">{t('pd_new')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.terugvangst}</div>
          <div className="stat-label">{t('pd_recap')}</div>
        </div>
      </div>

      {stats.eerste && (
        <p className="project-period">
          {formatDatum(stats.eerste)} &mdash; {formatDatum(stats.laatste)}
        </p>
      )}

      {perJaar.length > 1 && (
        <BarChartStacked data={perJaar} title={t('pd_per_year')} />
      )}

      {perMaand.some(m => m.count > 0) && (
        <BarChartSimple data={perMaand} title={t('pd_per_month')} />
      )}

      {soortenPerJaar.length > 1 && (
        <>
          <LineChart
            data={soortenPerJaar}
            title={t('pd_species_per_year')}
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
                <strong>{t('pd_species_in_year', { count: jaarPopup.soorten.length, jaar: jaarPopup.jaar })}</strong>
                <button className="jaar-inline-close" onClick={() => setJaarPopup(null)} aria-label={t('pd_close_aria')}>✕</button>
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

      {topSoorten.length > 0 && (
        <div className="chart-block">
          <h3>{t('pd_top10')}</h3>
          <div className="top-list">
            {topSoorten.map(s => (
              <div className="top-item" key={s.soort}>
                <span className="top-name">{displayNaam(s.soort)}</span>
                <div className="top-bar-wrap">
                  <div className="top-bar" style={{ width: `${(s.totaal / topMax) * 100}%` }} />
                </div>
                <span className="top-count">{s.totaal}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.soortenTabel.length > 0 && (
        <div className="section">
          <h3>{t('pd_species_section')}</h3>
          <div className="trektellen-table-wrap">
            <table className="trektellen-table">
              <thead>
                <tr>
                  <th className="tt-col-soort">{t('pd_col_species')}</th>
                  <th className="tt-col-num">{t('pd_new')}</th>
                  <th className="tt-col-num">{t('so_col_recap')}</th>
                  <th className="tt-col-num">{t('so_col_total')}</th>
                </tr>
              </thead>
              <tbody>
                {stats.soortenTabel.map(s => (
                  <tr key={s.soort}>
                    <td className="tt-col-soort">{displayNaam(s.soort)}</td>
                    <td className="tt-col-num">{s.nieuw || ''}</td>
                    <td className="tt-col-num">{s.terugvangst || ''}</td>
                    <td className="tt-col-num tt-col-total">{s.totaal}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="tt-totaal-row">
                  <td className="tt-col-soort">{t('so_total_row', { count: stats.soorten })}</td>
                  <td className="tt-col-num">{stats.nieuw}</td>
                  <td className="tt-col-num">{stats.terugvangst}</td>
                  <td className="tt-col-num tt-col-total">{stats.totaal}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      <VangstKaart targetRecords={projectRecords} allRecords={records} />

      {terugvangsten.length > 0 && (
        <div className="section">
          <div className="tv-header">
            <h3>{t('pd_recap_top10')}</h3>
            <div className="tv-toggle">
              <button className={`tv-toggle-btn${tvSorteer === 'tijd' ? ' active' : ''}`} onClick={() => setTvSorteer('tijd')}>{t('pd_longest_time')}</button>
              <button className={`tv-toggle-btn${tvSorteer === 'afstand' ? ' active' : ''}`} onClick={() => setTvSorteer('afstand')}>{t('pd_farthest')}</button>
            </div>
          </div>
          <div className="trektellen-table-wrap">
            <table className="trektellen-table">
              <thead>
                <tr>
                  <th className="tt-col-soort">{t('pd_col_species')}</th>
                  <th>{t('pd_col_ring')}</th>
                  <th>{t('pd_col_date')}</th>
                  <th className="tt-col-num">{t('pd_col_time')}</th>
                  <th className="tt-col-num">{t('pd_col_distance')}</th>
                </tr>
              </thead>
              <tbody>
                {terugvangsten.map((tv, i) => (
                  <tr key={`${tv.ringnummer}-${tv.datum}-${i}`}>
                    <td className="tt-col-soort">{displayNaam(tv.soort)}</td>
                    <td className="tv-ring"><span className="ring-link" onClick={() => navigate('/ring/records', { state: { openId: tv.id } })}>{tv.ringnummer?.replace(/\./g, '')}</span></td>
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

    </div>
  );
}
