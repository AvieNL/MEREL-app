import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRole } from '../../hooks/useRole';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import { useDisplayNaam } from '../../hooks/useDisplayNaam';
import { buildEuringLookup } from '../../utils/euring-lookup';
import { formatDatum } from '../../utils/dateHelper';
import { LEEFTIJD_LABEL, MAX_RECORDS_WEERGAVE } from '../../data/constants';
import './RecordsPage.css';

function geslachtIcoon(g) {
  if (g === 'M') return <span className="gender-m">{'\u2642\uFE0E'}</span>;
  if (g === 'V' || g === 'F') return <span className="gender-f">{'\u2640\uFE0E'}</span>;
  return null;
}

function fmtTijd(t) {
  if (!t) return '';
  const s = String(t).replace(':', '');
  if (s.length === 4) return s.slice(0, 2) + ':' + s.slice(2);
  return t;
}

function stripDots(ring) {
  return ring ? ring.replace(/\./g, '') : '';
}

function leeftijdLabel(code) {
  if (!code) return '';
  return LEEFTIJD_LABEL[code] || code;
}

export default function RecordsPage({ records, recordsLoading = false, deletedRecords = [], onDelete, onRestore, onPermanentDelete }) {
  const [zoek, setZoek] = useState('');
  const [prullenbakOpen, setPrullenbakOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { canDelete } = useRole();
  const speciesRef = useSpeciesRef();
  const euringLookup = useMemo(() => buildEuringLookup(speciesRef), [speciesRef]);
  const { t } = useTranslation();
  const displayNaam = useDisplayNaam();

  useEffect(() => {
    const openId = location.state?.openId;
    if (!openId) return;
    const record = records.find(r => r.id === openId);
    if (record?.ringnummer) setZoek(record.ringnummer);
    setExpanded(openId);
    setTimeout(() => {
      const el = document.getElementById(`record-${openId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.openId]);

  useEffect(() => {
    const filterSoort = location.state?.filterSoort;
    if (filterSoort) setZoek(filterSoort);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.filterSoort]);

  const filtered = useMemo(() => {
    const base = !zoek ? records : (() => {
      const lower = zoek.toLowerCase();
      return records.filter(r =>
        (r.vogelnaam && r.vogelnaam.toLowerCase().includes(lower)) ||
        (r.ringnummer && r.ringnummer.toLowerCase().includes(lower)) ||
        (r.vangstdatum && r.vangstdatum.includes(lower)) ||
        (r.project && r.project.toLowerCase().includes(lower))
      );
    })();
    const toSortKey = d => {
      if (!d) return '';
      const p = d.split('-');
      if (p.length !== 3) return d;
      if (p[0].length === 4) return `${p[0]}-${p[1].padStart(2, '0')}-${p[2].padStart(2, '0')}`;
      if (p[2].length === 4) return `${p[2]}-${p[1].padStart(2, '0')}-${p[0].padStart(2, '0')}`;
      return d;
    };
    return [...base].sort((a, b) => toSortKey(b.vangstdatum).localeCompare(toSortKey(a.vangstdatum)));
  }, [records, zoek]);

  return (
    <div className="page records-page">
      <div className="search-bar">
        <input
          type="search"
          value={zoek}
          onChange={e => setZoek(e.target.value)}
          placeholder={t('records_search_placeholder')}
        />
        <span className="result-count">{t('records_count', { count: filtered.length })}</span>
      </div>

      <div className="records-list">
        {recordsLoading ? (
          <div className="empty-state">{t('loading')}</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">{t('records_empty')}</div>
        ) : (
          filtered.slice(0, MAX_RECORDS_WEERGAVE).map(r => {
            const isTerugvangst = r.metalenringinfo === 4 || r.metalenringinfo === '4';
            return (
            <div
              key={r.id}
              id={`record-${r.id}`}
              className={`record-card ${expanded === r.id ? 'expanded' : ''}`}
              onClick={() => setExpanded(expanded === r.id ? null : r.id)}
            >
              <div className="record-header">
                <span className={`record-type${isTerugvangst ? ' record-type--tv' : ''}`}>{isTerugvangst ? 'TV' : 'NV'}</span>
                <div className="record-main">
                  <strong>
                    {r.vogelnaam ? displayNaam(r.vogelnaam) : t('records_unknown')}
                    {r.vogelnaam && euringLookup[r.vogelnaam.toLowerCase()] && (
                      <span className="euring-hint">({euringLookup[r.vogelnaam.toLowerCase()]})</span>
                    )}
                  </strong>
                  <div className="record-ring-row">
                    <span className="record-ring ring-link" onClick={e => { e.stopPropagation(); setExpanded(r.id); setTimeout(() => { document.getElementById(`record-${r.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 50); }}>{stripDots(r.ringnummer)}</span>
                    {r.geslacht && r.geslacht !== 'U' && geslachtIcoon(r.geslacht)}
                  </div>
                </div>
                <div className="record-meta">
                  <span>{formatDatum(r.vangstdatum)}</span>
                  {r.bron === 'griel_import' && <span className="badge badge-accent">Griel</span>}
                  {r.bron === 'buitenland_import' && <span className="badge badge-accent">Buitenland</span>}
                  {r.bron === 'andere_banen_import' && <span className="badge badge-accent">Extern</span>}
                </div>
              </div>

              {expanded === r.id && (
                <div className="record-details">
                  <div className="detail-grid">
                    {r.leeftijd && <div><span className="detail-label">{t('records_label_age')}</span> {leeftijdLabel(r.leeftijd)}</div>}
                    {r.project && <div><span className="detail-label">{t('records_label_project')}</span> {r.project}</div>}
                    {r.google_plaats && <div><span className="detail-label">{t('records_label_place')}</span> {r.google_plaats}</div>}
                  </div>
                  {canDelete && r.bron !== 'griel_import' && r.bron !== 'buitenland_import' && r.bron !== 'andere_banen_import' && (
                    <div className="record-actions">
                      <button
                        className="record-action-btn record-edit-btn"
                        title="Wijzigen"
                        onClick={e => { e.stopPropagation(); navigate('/', { state: { editRecord: r } }); }}
                      >✏️</button>
                      {onDelete && (
                        <button
                          className="record-action-btn record-delete-btn"
                          title="Verwijderen"
                          onClick={e => { e.stopPropagation(); onDelete(r.id); }}
                        >🗑️</button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            );
          })
        )}
        {filtered.length > 100 && (
          <div className="empty-state">
            {t('records_showing_first', { total: filtered.length })}
          </div>
        )}
      </div>

      {deletedRecords.length > 0 && (
        <div className="prullenbak-section">
          <button
            className="prullenbak-toggle"
            onClick={() => setPrullenbakOpen(o => !o)}
          >
            {prullenbakOpen
              ? t('records_trash', { count: deletedRecords.length })
              : t('records_trash_closed', { count: deletedRecords.length })
            }
          </button>
          {prullenbakOpen && (
            <div className="prullenbak-list">
              {deletedRecords.map(r => (
                <div key={r.id} className="prullenbak-item">
                  <div className="prullenbak-info">
                    <strong>{r.vogelnaam ? displayNaam(r.vogelnaam) : t('records_unknown')}</strong>
                    {r.ringnummer && <span className="prullenbak-ring">{stripDots(r.ringnummer)}</span>}
                    {r.vangstdatum && <span className="prullenbak-datum">{formatDatum(r.vangstdatum)}</span>}
                  </div>
                  <div className="prullenbak-acties">
                    {onRestore && canDelete && (
                      <button
                        className="btn-success prullenbak-btn"
                        onClick={() => onRestore(r.id)}
                      >
                        {t('records_restore')}
                      </button>
                    )}
                    {onPermanentDelete && canDelete && (
                      <button
                        className="btn-danger prullenbak-btn"
                        onClick={() => onPermanentDelete(r.id)}
                      >
                        {t('records_delete_permanent')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
