import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './StatsPage.css';

export default function SoortenOverzicht() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { soortenTabel = [], titel = 'Soorten', backTo = '/stats' } = location.state || {};

  const [sortKey, setSortKey] = useState('totaal');
  const [sortDir, setSortDir] = useState('desc');

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const sorted = [...soortenTabel].sort((a, b) => {
    const av = sortKey === 'naam' ? (a.naam || '') : (a[sortKey] || 0);
    const bv = sortKey === 'naam' ? (b.naam || '') : (b[sortKey] || 0);
    if (sortKey === 'naam') return sortDir === 'asc' ? av.localeCompare(bv, 'nl') : bv.localeCompare(av, 'nl');
    return sortDir === 'asc' ? av - bv : bv - av;
  });

  function sortIcon(key) {
    if (sortKey !== key) return ' ↕';
    return sortDir === 'desc' ? ' ↓' : ' ↑';
  }

  const totaalNieuw = soortenTabel.reduce((s, r) => s + r.nieuw, 0);
  const totaalTv = soortenTabel.reduce((s, r) => s + r.terugvangst, 0);
  const totaalTotaal = soortenTabel.reduce((s, r) => s + r.totaal, 0);

  return (
    <div className="page stats-page">
      <button className="btn-secondary page-back" onClick={() => navigate(-1)}>{t('so_back')}</button>
      <h2 className="stats-section-title" style={{ marginTop: 8 }}>
        {titel} — {t('so_species_in_title', { count: soortenTabel.length })}
      </h2>

      <div className="trektellen-table-wrap">
        <table className="trektellen-table">
          <thead>
            <tr>
              <th className="tt-col-soort" style={{ cursor: 'pointer' }} onClick={() => toggleSort('naam')}>
                {t('so_col_species')}{sortIcon('naam')}
              </th>
              <th className="tt-col-num" style={{ cursor: 'pointer' }} onClick={() => toggleSort('nieuw')}>
                {t('so_col_new')}{sortIcon('nieuw')}
              </th>
              <th className="tt-col-num" style={{ cursor: 'pointer' }} onClick={() => toggleSort('terugvangst')}>
                {t('so_col_recap')}{sortIcon('terugvangst')}
              </th>
              <th className="tt-col-num" style={{ cursor: 'pointer' }} onClick={() => toggleSort('totaal')}>
                {t('so_col_total')}{sortIcon('totaal')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(s => (
              <tr key={s.naam}>
                <td className="tt-col-soort">{s.naam}</td>
                <td className="tt-col-num">{s.nieuw || ''}</td>
                <td className="tt-col-num">{s.terugvangst || ''}</td>
                <td className="tt-col-num tt-col-total">{s.totaal}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="tt-totaal-row">
              <td className="tt-col-soort">{t('so_total_row', { count: soortenTabel.length })}</td>
              <td className="tt-col-num">{totaalNieuw}</td>
              <td className="tt-col-num">{totaalTv}</td>
              <td className="tt-col-num tt-col-total">{totaalTotaal}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
