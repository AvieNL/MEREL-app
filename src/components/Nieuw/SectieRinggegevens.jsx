import { useTranslation } from 'react-i18next';
import { useNieuwForm } from './NieuwFormContext';
import {
  ANDERE_MERKTEKENS_OPTIONS, VERIFICATIE_OPTIONS, LEEFTIJD_LABELS, getOptLabel,
} from './NieuwPage.constants';
import './NieuwPage.css';

export default function SectieRinggegevens() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const {
    form,
    update,
    errCls,
    sections,
    toggleSection,
    isTerugvangst,
    terugvangstInfo,
    duplicaatRingInfo,
    nestRingInfo,
    toggleTerugvangst,
    ringcentraleOptions,
    autoFilledRingId,
    getCodesForSelect,
  } = useNieuwForm();

  return (
    <div className="section">
      <div className="section-header" onClick={() => toggleSection('ringgegevens')}>
        <h3>{t('form_section_ring')}</h3>
        <span className={`toggle ${sections.ringgegevens ? 'open' : ''}`}>▾</span>
      </div>
      {sections.ringgegevens && (
        <div className="section-content">
          {/* Terugvangst toggle */}
          <div className="form-group">
            <label className="toggle-label" onClick={toggleTerugvangst}>
              <span className={`toggle-switch ${isTerugvangst ? 'active' : ''}`}>
                <span className="toggle-knob" />
              </span>
              <span>{isTerugvangst ? t('form_is_recap') : t('form_is_new_ring')}</span>
            </label>
          </div>

          <div className="form-row">
            <div className={`form-group${errCls('centrale')}`}>
              <label>{t('form_ring_central')}</label>
              <select value={form.centrale} onChange={e => update('centrale', e.target.value)}>
                {ringcentraleOptions.map(o => (
                  <option key={o.value} value={o.value}>{getOptLabel(o, lang)}</option>
                ))}
              </select>
            </div>
            <div className={`form-group${errCls('ringnummer')}`}>
              <label>{t('form_ring_number')}</label>
              <input
                type="text"
                value={form.ringnummer}
                onChange={e => { update('ringnummer', e.target.value.toUpperCase().replace(/\./g, '')); autoFilledRingId.current = null; }}
                placeholder="bijv. 7154867"
              />
              {isTerugvangst && terugvangstInfo && (
                terugvangstInfo.eigen ? (
                  <div className="terugvangst-info terugvangst-info--eigen">
                    <span className="terugvangst-label">{t('form_own_bird')}</span>
                    <span>{terugvangstInfo.vogelnaam}{terugvangstInfo.geslacht === 'M' ? ' ♂' : terugvangstInfo.geslacht === 'F' ? ' ♀' : ''}</span>
                    {terugvangstInfo.vangstdatum && <span>{t('form_first_catch_date')} <strong>{terugvangstInfo.vangstdatum}</strong></span>}
                    {terugvangstInfo.laatste_vangstdatum && <span>{t('form_last_catch_date')} <strong>{terugvangstInfo.laatste_vangstdatum}</strong></span>}
                    {terugvangstInfo.leeftijd && <span>{t('form_age_first_catch')} <strong>{LEEFTIJD_LABELS[terugvangstInfo.leeftijd] ?? terugvangstInfo.leeftijd}</strong></span>}
                  </div>
                ) : (
                  <div className="terugvangst-info terugvangst-info--vreemd">
                    <span className="terugvangst-label">{t('form_not_in_own')}</span>
                  </div>
                )
              )}
              {duplicaatRingInfo && (
                <div className="terugvangst-info terugvangst-info--duplicaat">
                  <span className="terugvangst-label">⚠ {t('form_duplicate_ring')}</span>
                  <span>{duplicaatRingInfo.vogelnaam}{duplicaatRingInfo.vangstdatum && ` — ${t('form_first_catch_date_short')} ${duplicaatRingInfo.vangstdatum}`}</span>
                  {duplicaatRingInfo.laatste_vangstdatum && <span>{t('form_last_catch_date')} <strong>{duplicaatRingInfo.laatste_vangstdatum}</strong></span>}
                  {duplicaatRingInfo.count > 1 && <span>{t('form_duplicate_count', { n: duplicaatRingInfo.count })}</span>}
                  <button type="button" className="btn-primary btn-xs"
                    onClick={toggleTerugvangst}>{t('form_set_recap')}</button>
                </div>
              )}
              {nestRingInfo && (
                <div className="nest-ring-tip">
                  <span className="nest-ring-tip__label">{t('form_nest_ring_tip_label')}</span>
                  <span>
                    {t('form_nest_ring_tip_kast', { nr: nestRingInfo.nest.kastnummer })}
                    {nestRingInfo.nest.omschrijving ? ` — ${nestRingInfo.nest.omschrijving}` : ''}
                  </span>
                  {nestRingInfo.nest.eigenaar_naam && (
                    <span className="nest-ring-tip__eigenaar">
                      {nestRingInfo.nest.eigenaar_naam}
                      {nestRingInfo.nest.eigenaar_email ? (
                        <> · <a href={`mailto:${nestRingInfo.nest.eigenaar_email}`} className="nest-ring-tip__mail">{nestRingInfo.nest.eigenaar_email}</a></>
                      ) : null}
                      {nestRingInfo.nest.eigenaar_telefoon ? (
                        <> · <a href={`tel:${nestRingInfo.nest.eigenaar_telefoon}`} className="nest-ring-tip__mail">{nestRingInfo.nest.eigenaar_telefoon}</a></>
                      ) : null}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className={`form-group${errCls('identificatie_methode')}`}>
              <label>{t('form_id_method')}</label>
              <select value={form.identificatie_methode} onChange={e => update('identificatie_methode', e.target.value)}>
                {getCodesForSelect('identificatie_methode').map(o => (
                  <option key={o.code} value={o.code}>{o.code} – {o.beschrijving}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>{t('form_verification')}</label>
              <select value={form.verificatie} onChange={e => update('verificatie', Number(e.target.value))}>
                {VERIFICATIE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{getOptLabel(o, lang)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className={`form-group${errCls('metalenringinfo')}`}>
              <label>{t('form_metal_ring_info')}</label>
              <select value={form.metalenringinfo} onChange={e => update('metalenringinfo', Number(e.target.value))}>
                {getCodesForSelect('metalenringinfo').map(o => (
                  <option key={o.code} value={o.code}>{o.code} – {o.beschrijving}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>{t('form_other_marks')}</label>
              <select value={form.andere_merktekens} onChange={e => update('andere_merktekens', e.target.value)}>
                {ANDERE_MERKTEKENS_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{getOptLabel(o, lang)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
