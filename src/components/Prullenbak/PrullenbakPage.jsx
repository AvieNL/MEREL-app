import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecords } from '../../hooks/useRecords';
import { useNestData } from '../../hooks/useNestData';
import { formatDatum as formatDatumNest } from '../../utils/nestPlanning';
import './PrullenbakPage.css';

function stripDots(s) { return s ? s.replace(/\./g, '') : ''; }
function formatDatum(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
}

export default function PrullenbakPage() {
  const { t } = useTranslation();
  const { deletedRecords, restoreRecord, permanentDeleteRecord } = useRecords();
  const { deletedNesten, restoreNest, permanentDeleteNest } = useNestData();

  const [bevestigId, setBevestigId]     = useState(null);
  const [bevestigType, setBevestigType] = useState(null); // 'vangst' | 'nest' | 'alles-ring' | 'alles-nest'

  const leeg = deletedRecords.length === 0 && deletedNesten.length === 0;

  function vraagBevestiging(id, type) {
    setBevestigId(id);
    setBevestigType(type);
  }

  async function bevestigDefinitief() {
    if (bevestigType === 'vangst') {
      permanentDeleteRecord(bevestigId);
    } else if (bevestigType === 'nest') {
      await permanentDeleteNest(bevestigId);
    } else if (bevestigType === 'alles-ring') {
      for (const r of deletedRecords) permanentDeleteRecord(r.id);
    } else if (bevestigType === 'alles-nest') {
      for (const n of deletedNesten) await permanentDeleteNest(n.id);
    }
    setBevestigId(null);
    setBevestigType(null);
  }

  function allesHerstellen(module) {
    if (module === 'ring') deletedRecords.forEach(r => restoreRecord(r.id));
    if (module === 'nest') deletedNesten.forEach(n => restoreNest(n.id));
  }

  const bevestigLabel = bevestigType === 'alles-ring'
    ? t('prullenbak_confirm_all_ring', { count: deletedRecords.length })
    : bevestigType === 'alles-nest'
    ? t('prullenbak_confirm_all_nest', { count: deletedNesten.length })
    : t('prullenbak_confirm_permanent');

  return (
    <div className="page prullenbak-page">
      <h2 className="prullenbak-titel">{t('nav_prullenbak')}</h2>

      {leeg ? (
        <p className="prullenbak-leeg">{t('prullenbak_empty')}</p>
      ) : (
        <>
          {/* ── Vangsten (ringmodule) ── */}
          {deletedRecords.length > 0 && (
            <section className="prullenbak-sectie">
              <div className="prullenbak-sectie__header">
                <h3 className="prullenbak-sectie__titel prullenbak-sectie__titel--ring">
                  <span className="prullenbak-module-icon">◎</span>
                  {t('prullenbak_section_catches')}
                  <span className="prullenbak-sectie__tel">{deletedRecords.length}</span>
                </h3>
                <div className="prullenbak-bulk-acties">
                  <button
                    className="btn-secondary prullenbak-btn"
                    onClick={() => allesHerstellen('ring')}
                  >
                    {t('prullenbak_restore_all')}
                  </button>
                  <button
                    className="btn-danger prullenbak-btn"
                    onClick={() => vraagBevestiging(null, 'alles-ring')}
                  >
                    {t('prullenbak_delete_all')}
                  </button>
                </div>
              </div>
              <div className="prullenbak-lijst">
                {deletedRecords.map(r => (
                  <div key={r.id} className="prullenbak-item">
                    <div className="prullenbak-item__info">
                      <strong>{r.vogelnaam || t('records_unknown')}</strong>
                      {r.ringnummer && <span className="prullenbak-meta">{stripDots(r.ringnummer)}</span>}
                      {r.vangstdatum && <span className="prullenbak-meta">{formatDatum(r.vangstdatum)}</span>}
                    </div>
                    <div className="prullenbak-item__acties">
                      <button className="btn-success prullenbak-btn" onClick={() => restoreRecord(r.id)}>
                        {t('records_restore')}
                      </button>
                      <button className="btn-danger prullenbak-btn" onClick={() => vraagBevestiging(r.id, 'vangst')}>
                        {t('records_delete_permanent')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Nesten (nestmodule) ── */}
          {deletedNesten.length > 0 && (
            <section className="prullenbak-sectie">
              <div className="prullenbak-sectie__header">
                <h3 className="prullenbak-sectie__titel prullenbak-sectie__titel--nest">
                  <span className="prullenbak-module-icon">⌂</span>
                  {t('prullenbak_section_nests')}
                  <span className="prullenbak-sectie__tel">{deletedNesten.length}</span>
                </h3>
                <div className="prullenbak-bulk-acties">
                  <button
                    className="btn-secondary prullenbak-btn"
                    onClick={() => allesHerstellen('nest')}
                  >
                    {t('prullenbak_restore_all')}
                  </button>
                  <button
                    className="btn-danger prullenbak-btn"
                    onClick={() => vraagBevestiging(null, 'alles-nest')}
                  >
                    {t('prullenbak_delete_all')}
                  </button>
                </div>
              </div>
              <div className="prullenbak-lijst">
                {deletedNesten.map(nest => (
                  <div key={nest.id} className="prullenbak-item">
                    <div className="prullenbak-item__info">
                      <strong>⌂ {nest.kastnummer}</strong>
                      {nest.omschrijving && <span className="prullenbak-meta">{nest.omschrijving}</span>}
                      {nest.deleted_at && (
                        <span className="prullenbak-meta prullenbak-meta--datum">
                          {t('prullenbak_deleted_on')} {formatDatumNest(nest.deleted_at.slice(0, 10))}
                        </span>
                      )}
                    </div>
                    <div className="prullenbak-item__acties">
                      <button className="btn-success prullenbak-btn" onClick={() => restoreNest(nest.id)}>
                        {t('records_restore')}
                      </button>
                      <button className="btn-danger prullenbak-btn" onClick={() => vraagBevestiging(nest.id, 'nest')}>
                        {t('records_delete_permanent')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Bevestigingsdialoog definitief verwijderen */}
      {bevestigType && (
        <div className="prullenbak-confirm-overlay">
          <div className="prullenbak-confirm">
            <p>{bevestigLabel}</p>
            <div className="prullenbak-confirm__acties">
              <button className="btn-secondary" onClick={() => { setBevestigId(null); setBevestigType(null); }}>
                {t('btn_cancel')}
              </button>
              <button className="btn-danger" onClick={bevestigDefinitief}>
                {t('btn_delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
