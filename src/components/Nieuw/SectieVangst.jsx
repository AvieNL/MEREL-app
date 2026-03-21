import { useTranslation } from 'react-i18next';
import { useNieuwForm } from './NieuwFormContext';
import { NAUWK_DATUM_OPTIONS } from './NieuwPage.constants';
import './NieuwPage.css';

export default function SectieVangst() {
  const { t } = useTranslation();
  const {
    form,
    update,
    errCls,
    sections,
    toggleSection,
    getCodesForSelect,
  } = useNieuwForm();

  return (
    <div className="section">
      <div className="section-header" onClick={() => toggleSection('vangst')}>
        <h3>{t('form_section_catch')}</h3>
        <span className={`toggle ${sections.vangst ? 'open' : ''}`}>▾</span>
      </div>
      {sections.vangst && (
        <div className="section-content">
          <div className="form-row form-row--datum-tijd">
            <div className="form-group">
              <label>{t('form_catch_date')}</label>
              <input
                type="date"
                value={form.vangstdatum}
                onChange={e => update('vangstdatum', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>{t('form_time_hhmm')}</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder={t('form_time_placeholder')}
                value={form.tijd}
                onChange={e => update('tijd', e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className={`form-group${errCls('vangstmethode')}`}>
              <label>{t('form_catch_method')}</label>
              <select value={form.vangstmethode} onChange={e => update('vangstmethode', e.target.value)}>
                <option value="">{t('form_choose')}</option>
                {getCodesForSelect('vangstmethode').map(o => (
                  <option key={o.code} value={o.code}>{o.code} – {o.beschrijving}</option>
                ))}
              </select>
            </div>
            <div className={`form-group${errCls('nauwk_vangstdatum')}`}>
              <label>{t('form_date_accuracy')}</label>
              <select value={form.nauwk_vangstdatum} onChange={e => update('nauwk_vangstdatum', Number(e.target.value))}>
                {NAUWK_DATUM_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className={`form-group${errCls('lokmiddelen')}`}>
              <label>{t('form_lures')}</label>
              <select value={form.lokmiddelen} onChange={e => update('lokmiddelen', e.target.value)}>
                {getCodesForSelect('lokmiddelen').map(o => (
                  <option key={o.code} value={o.code}>{o.code} – {o.beschrijving}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>{t('form_net_number')}</label>
              <input type="text" value={form.netnummer}
                onChange={e => update('netnummer', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>{t('form_remarks')}</label>
            <textarea rows="2" value={form.opmerkingen}
              onChange={e => update('opmerkingen', e.target.value)} />
          </div>
        </div>
      )}
    </div>
  );
}
