import { useNieuwForm } from './NieuwFormContext';
import { NAUWK_DATUM_OPTIONS } from './NieuwPage.constants';
import './NieuwPage.css';

export default function SectieVangst() {
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
        <h3>Vangst</h3>
        <span className={`toggle ${sections.vangst ? 'open' : ''}`}>▾</span>
      </div>
      {sections.vangst && (
        <div className="section-content">
          <div className="form-row form-row--datum-tijd">
            <div className="form-group">
              <label>Vangstdatum</label>
              <input
                type="date"
                value={form.vangstdatum}
                onChange={e => update('vangstdatum', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Tijd (HHMM)</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="bijv. 0845"
                value={form.tijd}
                onChange={e => update('tijd', e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className={`form-group${errCls('vangstmethode')}`}>
              <label>Vangstmethode *</label>
              <select value={form.vangstmethode} onChange={e => update('vangstmethode', e.target.value)}>
                <option value="">-- Kies --</option>
                {getCodesForSelect('vangstmethode').map(o => (
                  <option key={o.code} value={o.code}>{o.code} – {o.beschrijving}</option>
                ))}
              </select>
            </div>
            <div className={`form-group${errCls('nauwk_vangstdatum')}`}>
              <label>Nauwkeurigheid datum *</label>
              <select value={form.nauwk_vangstdatum} onChange={e => update('nauwk_vangstdatum', Number(e.target.value))}>
                {NAUWK_DATUM_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className={`form-group${errCls('lokmiddelen')}`}>
              <label>Lokmiddelen *</label>
              <select value={form.lokmiddelen} onChange={e => update('lokmiddelen', e.target.value)}>
                {getCodesForSelect('lokmiddelen').map(o => (
                  <option key={o.code} value={o.code}>{o.code} – {o.beschrijving}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Netnummer</label>
              <input type="text" value={form.netnummer}
                onChange={e => update('netnummer', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Opmerkingen</label>
            <textarea rows="2" value={form.opmerkingen}
              onChange={e => update('opmerkingen', e.target.value)} />
          </div>
        </div>
      )}
    </div>
  );
}
