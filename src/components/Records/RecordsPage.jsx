import { useState, useMemo, useEffect } from 'react';
import { IconEdit, IconDelete } from '../shared/Icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRole } from '../../hooks/useRole';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import { useDisplayNaam } from '../../hooks/useDisplayNaam';
import { buildEuringLookup } from '../../utils/euring-lookup';
import { formatDatum } from '../../utils/dateHelper';
import { LEEFTIJD_LABEL, MAX_RECORDS_WEERGAVE } from '../../data/constants';
import { TYPE_CFG, buildNvByRing, getVangstType } from '../../utils/vangstType';
import ExternMeldingModal from './ExternMeldingModal';
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

function normalizeRing(ring) {
  return ring ? ring.replace(/\./g, '').replace(/\s/g, '').toLowerCase() : '';
}

function leeftijdLabel(code) {
  if (!code) return '';
  return LEEFTIJD_LABEL[code] || code;
}

export default function RecordsPage({ records, recordsLoading = false, deletedRecords = [], onDelete, onRestore, onPermanentDelete, onAddRecord }) {
  const [zoek, setZoek] = useState('');
  const [prullenbakOpen, setPrullenbakOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [externModalOpen, setExternModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (new URLSearchParams(location.search).get('prullenbak') === '1') {
      setPrullenbakOpen(true);
      setTimeout(() => document.querySelector('.prullenbak-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [location.search]);

  const navigate = useNavigate();
  const { canDelete } = useRole();
  const speciesRef = useSpeciesRef();
  const euringLookup = useMemo(() => buildEuringLookup(speciesRef), [speciesRef]);

  // Index: ringnummer → originele NV-record (voor TV-categorisatie)
  const nvByRing = useMemo(() => buildNvByRing(records), [records]);

  // Index: naam_nl (lowercase) → alle taalnamen (lowercase) voor meertalig zoeken
  const speciesNaamIndex = useMemo(() => {
    const map = new Map();
    speciesRef.forEach(s => {
      if (!s.naam_nl) return;
      map.set(s.naam_nl.toLowerCase(), [s.naam_nl, s.naam_lat, s.naam_en, s.naam_de, s.naam_fr, s.naam_es]
        .filter(Boolean).map(n => n.toLowerCase()));
    });
    return map;
  }, [speciesRef]);
  const { t } = useTranslation();
  const displayNaam = useDisplayNaam();

  useEffect(() => {
    const openId = location.state?.openId;
    if (!openId) return;
    const ring = location.state?.ringnummer || records.find(r => r.id === openId)?.ringnummer;
    if (ring) setZoek(ring);
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

  // Soortsfrequentie op basis van alle records (niet gefilterd)
  const soortFrequentie = useMemo(() => {
    const freq = {};
    records.forEach(r => { if (r.vogelnaam) freq[r.vogelnaam] = (freq[r.vogelnaam] || 0) + 1; });
    return freq;
  }, [records]);

  const filtered = useMemo(() => {
    const base = !zoek ? records : (() => {
      const lower = zoek.toLowerCase();
      const lowerNorm = normalizeRing(zoek);
      return records.filter(r => {
        const speciesNames = r.vogelnaam ? speciesNaamIndex.get(r.vogelnaam.toLowerCase()) : null;
        const matchesSpecies = speciesNames
          ? speciesNames.some(n => n.includes(lower))
          : (r.vogelnaam && r.vogelnaam.toLowerCase().includes(lower));
        return matchesSpecies ||
          (r.ringnummer && normalizeRing(r.ringnummer).includes(lowerNorm)) ||
          (r.vangstdatum && r.vangstdatum.includes(lower)) ||
          (r.project && r.project.toLowerCase().includes(lower));
      });
    })();
    const toSortKey = d => {
      if (!d) return '';
      const p = d.split('-');
      if (p.length !== 3) return d;
      if (p[0].length === 4) return `${p[0]}-${p[1].padStart(2, '0')}-${p[2].padStart(2, '0')}`;
      if (p[2].length === 4) return `${p[2]}-${p[1].padStart(2, '0')}-${p[0].padStart(2, '0')}`;
      return d;
    };
    return [...base].sort((a, b) => {
      const freqDiff = (soortFrequentie[b.vogelnaam] || 0) - (soortFrequentie[a.vogelnaam] || 0);
      if (freqDiff !== 0) return freqDiff;
      return toSortKey(b.vangstdatum).localeCompare(toSortKey(a.vangstdatum));
    });
  }, [records, zoek, soortFrequentie]);

  return (
    <div className="page records-page">
      {externModalOpen && (
        <ExternMeldingModal
          onClose={() => setExternModalOpen(false)}
          onSave={record => onAddRecord?.(record)}
        />
      )}
      <div className="search-bar">
        <input
          type="search"
          value={zoek}
          onChange={e => setZoek(e.target.value)}
          placeholder={t('records_search_placeholder')}
        />
        <span className="result-count">{t('records_count', { count: filtered.length })}</span>
      </div>
      {onAddRecord && (
        <div style={{ padding: '0 16px 8px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            onClick={() => setExternModalOpen(true)}
          >+ {t('extern_btn')}</button>
        </div>
      )}

      <div className="records-list">
        {recordsLoading ? (
          <div className="empty-state">{t('loading')}</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">{t('records_empty')}</div>
        ) : (
          filtered.slice(0, MAX_RECORDS_WEERGAVE).map(r => {
            const type = getVangstType(r, nvByRing);
            const cfg = TYPE_CFG[type];
            const original = (type === 'tv' || type === 'tvo') && r.ringnummer
              ? nvByRing.get(normalizeRing(r.ringnummer)) ?? null
              : null;
            return (
            <div
              key={r.id}
              id={`record-${r.id}`}
              className={`record-card ${expanded === r.id ? 'expanded' : ''}`}
              onClick={() => setExpanded(expanded === r.id ? null : r.id)}
            >
              <div className="record-header">
                <div className="record-type-col">
                  <span className={`record-type ${cfg.cls}`}>{cfg.icon} {t(cfg.key)}</span>
                  {type === 'tvx' && <span className="record-type-ext">⚠</span>}
                </div>
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
                  {r.bron === 'externe_tv_melding' && <span className="badge badge-warning">{t('extern_badge_tv')}</span>}
                  {r.bron === 'externe_ring_info' && <span className="badge badge-success">{t('extern_badge_nv')}</span>}
                </div>
              </div>

              {expanded === r.id && (
                <div className="record-details">
                  <div className="detail-grid">
                    {r.leeftijd && <div><span className="detail-label">{t('records_label_age')}</span> {leeftijdLabel(r.leeftijd)}</div>}
                    {r.project && <div><span className="detail-label">{t('records_label_project')}</span> {r.project}</div>}
                    {r.google_plaats && <div><span className="detail-label">{t('records_label_place')}</span> {r.google_plaats}</div>}
                  </div>
                  {original && (
                    <div className="record-original">
                      <div className="record-original-title">{t('form_first_catch_date')}</div>
                      <div className="detail-grid">
                        <div><span className="detail-label">{t('form_catch_date')}</span> {formatDatum(original.vangstdatum)}</div>
                        {original.leeftijd && <div><span className="detail-label">{t('records_label_age')}</span> {leeftijdLabel(original.leeftijd)}</div>}
                        {original.project && <div><span className="detail-label">{t('records_label_project')}</span> {original.project}</div>}
                        {original.google_plaats && <div><span className="detail-label">{t('records_label_place')}</span> {original.google_plaats}</div>}
                      </div>
                    </div>
                  )}
                  {canDelete && (
                    <div className="record-actions">
                      <button
                        className="icon-edit-btn"
                        title="Wijzigen"
                        onClick={e => { e.stopPropagation(); navigate('/ring/', { state: { editRecord: r } }); }}
                      ><IconEdit /></button>
                      {onDelete && r.bron !== 'griel_import' && r.bron !== 'buitenland_import' && r.bron !== 'andere_banen_import' && (
                        <button
                          className="icon-delete-btn"
                          title="Verwijderen"
                          onClick={e => { e.stopPropagation(); onDelete(r.id); }}
                        ><IconDelete /></button>
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
