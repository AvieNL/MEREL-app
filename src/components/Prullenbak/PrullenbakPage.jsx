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

  const [bevestigId, setBevestigId] = useState(null);
  const [bevestigType, setBevestigType] = useState(null); // 'vangst' | 'nest'

  const leeg = deletedRecords.length === 0 && deletedNesten.length === 0;

  function vraagBevestiging(id, type) {
    setBevestigId(id);
    setBevestigType(type);
  }

  async function bevestigDefinitief() {
    if (bevestigType === 'vangst') permanentDeleteRecord(bevestigId);
    if (bevestigType === 'nest')   await permanentDeleteNest(bevestigId);
    setBevestigId(null);
    setBevestigType(null);
  }

  return (
    <div className="page prullenbak-page">
      <h2 className="prullenbak-titel">🗑 {t('nav_prullenbak')}</h2>

      {leeg ? (
        <p className="prullenbak-leeg">{t('prullenbak_empty')}</p>
      ) : (
        <>
          {/* ── Vangsten ── */}
          {deletedRecords.length > 0 && (
            <section className="prullenbak-sectie">
              <h3 className="prullenbak-sectie__titel">
                {t('prullenbak_section_catches')}
                <span className="prullenbak-sectie__tel">{deletedRecords.length}</span>
              </h3>
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

          {/* ── Nesten ── */}
          {deletedNesten.length > 0 && (
            <section className="prullenbak-sectie">
              <h3 className="prullenbak-sectie__titel">
                {t('prullenbak_section_nests')}
                <span className="prullenbak-sectie__tel">{deletedNesten.length}</span>
              </h3>
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
      {bevestigId && (
        <div className="prullenbak-confirm-overlay">
          <div className="prullenbak-confirm">
            <p>{t('prullenbak_confirm_permanent')}</p>
            <div className="prullenbak-confirm__acties">
              <button className="btn-secondary" onClick={() => setBevestigId(null)}>
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
