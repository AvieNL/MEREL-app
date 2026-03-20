import { useNieuwForm } from './NieuwFormContext';
import {
  ANDERE_MERKTEKENS_OPTIONS, VERIFICATIE_OPTIONS, LEEFTIJD_LABELS,
} from './NieuwPage.constants';
import './NieuwPage.css';

export default function SectieRinggegevens() {
  const {
    form,
    update,
    errCls,
    sections,
    toggleSection,
    isTerugvangst,
    terugvangstInfo,
    toggleTerugvangst,
    ringcentraleOptions,
    autoFilledRingId,
    getCodesForSelect,
  } = useNieuwForm();

  return (
    <div className="section">
      <div className="section-header" onClick={() => toggleSection('ringgegevens')}>
        <h3>Ringgegevens</h3>
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
              <span>{isTerugvangst ? 'Terugvangst' : 'Nieuwe ring'}</span>
            </label>
          </div>

          <div className="form-row">
            <div className={`form-group${errCls('centrale')}`}>
              <label>Ringcentrale *</label>
              <select value={form.centrale} onChange={e => update('centrale', e.target.value)}>
                {ringcentraleOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className={`form-group${errCls('ringnummer')}`}>
              <label>Ringnummer *</label>
              <input
                type="text"
                value={form.ringnummer}
                onChange={e => { update('ringnummer', e.target.value.toUpperCase()); autoFilledRingId.current = null; }}
                placeholder="bijv. ...7154867"
              />
              {isTerugvangst && terugvangstInfo && (
                terugvangstInfo.eigen ? (
                  <div className="terugvangst-info terugvangst-info--eigen">
                    <span className="terugvangst-label">Eigen vogel</span>
                    <span>{terugvangstInfo.vogelnaam}</span>
                    {terugvangstInfo.vangstdatum && <span>Eerste vangst: <strong>{terugvangstInfo.vangstdatum}</strong></span>}
                    {terugvangstInfo.laatste_vangstdatum && <span>Laatste vangst: <strong>{terugvangstInfo.laatste_vangstdatum}</strong></span>}
                    {terugvangstInfo.leeftijd && <span>Leeftijd bij eerste vangst: <strong>{LEEFTIJD_LABELS[terugvangstInfo.leeftijd] ?? terugvangstInfo.leeftijd}</strong></span>}
                  </div>
                ) : (
                  <div className="terugvangst-info terugvangst-info--vreemd">
                    <span className="terugvangst-label">Niet in eigen vangsten</span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="form-row">
            <div className={`form-group${errCls('identificatie_methode')}`}>
              <label>Identificatiemethode *</label>
              <select value={form.identificatie_methode} onChange={e => update('identificatie_methode', e.target.value)}>
                {getCodesForSelect('identificatie_methode').map(o => (
                  <option key={o.code} value={o.code}>{o.code} – {o.beschrijving}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Verificatie</label>
              <select value={form.verificatie} onChange={e => update('verificatie', Number(e.target.value))}>
                {VERIFICATIE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className={`form-group${errCls('metalenringinfo')}`}>
              <label>Metalen ring informatie *</label>
              <select value={form.metalenringinfo} onChange={e => update('metalenringinfo', Number(e.target.value))}>
                {getCodesForSelect('metalenringinfo').map(o => (
                  <option key={o.code} value={o.code}>{o.code} – {o.beschrijving}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Andere merktekens</label>
              <select value={form.andere_merktekens} onChange={e => update('andere_merktekens', e.target.value)}>
                {ANDERE_MERKTEKENS_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
