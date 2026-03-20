import { useNieuwForm } from './NieuwFormContext';
import {
  VET_OPTIONS, VLIEGSPIER_OPTIONS, BROEDVLEK_OPTIONS, HANDICAP_OPTIONS, CLOACA_OPTIONS,
  PLAATSCODE_OPTIONS, SNAVEL_METHODE_OPTIONS, NAUWK_COORD_OPTIONS, RUI_LICHAAM_OPTIONS,
} from './NieuwPage.constants';
import { renderGeslachtTekst } from './NieuwPage.utils';
import RuiscoreDiagram from './RuiscoreDiagram';
import LocatiePicker from './LocatiePicker';
import './NieuwPage.css';

export default function SectieBiometrieEnRui() {
  const {
    form,
    update,
    setForm,
    setFormErrors,
    errCls,
    errorKeys,
    sections,
    toggleSection,
    settings,
    speciesInfo,
    warnings,
    cloacaWarning,
    ruikaart,
    updateRuikaart,
    renderBioField,
  } = useNieuwForm();

  return (
    <>
      {/* Sectie: Biometrie basis */}
      <div className="section">
        <div className="section-header" onClick={() => toggleSection('biometrieBasis')}>
          <h3>Biometrie</h3>
          {warnings.some(w => ['vleugel', 'gewicht', 'handpenlengte'].includes(w.key)) && <span className="section-badge-warn">!</span>}
          <span className={`toggle ${sections.biometrieBasis ? 'open' : ''}`}>▾</span>
        </div>
        {sections.biometrieBasis && (
          <div className="section-content">
            <div className="form-row">
              {renderBioField('vleugel', 'Vleugel (0,5 mm)')}
              {renderBioField('handpenlengte', 'P8 (0,5 mm)')}
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label>Ruiscore</label>
                <select value={form.rui_lichaam} onChange={e => update('rui_lichaam', e.target.value)}>
                  {RUI_LICHAAM_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Vet (Busse 0-5)</label>
                <select value={form.vet} onChange={e => update('vet', e.target.value)}>
                  {VET_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Vliegspier</label>
                <select value={form.borstspier} onChange={e => update('borstspier', e.target.value)}>
                  {VLIEGSPIER_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              {renderBioField('gewicht', 'Gewicht (0,1 g)')}
              <div className="form-group">
                <label>Weegtijd</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="bijv. 0845"
                  value={form.weegtijd}
                  onChange={e => update('weegtijd', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label>Cloaca</label>
                <select value={form.cloaca} onChange={e => update('cloaca', e.target.value)}>
                  {CLOACA_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {cloacaWarning && (
                  <span className="field-warning">{cloacaWarning}</span>
                )}
              </div>
              <div className="form-group">
                <label>Broedvlek</label>
                <select value={form.broedvlek} onChange={e => update('broedvlek', e.target.value)}>
                  {BROEDVLEK_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Handicap</label>
                <select value={form.handicap} onChange={e => update('handicap', e.target.value)}>
                  {HANDICAP_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {speciesInfo && (speciesInfo.nest_eileg || speciesInfo.broed) && (
              <div className="broed-info-hint">
                {speciesInfo.broed && <span>Broedt: <strong>{renderGeslachtTekst(speciesInfo.broed)}</strong></span>}
                {speciesInfo.nest_eileg && <span>Eileg: <strong>{renderGeslachtTekst(speciesInfo.nest_eileg)}</strong></span>}
                {speciesInfo.nest_broedels && <span>Broedels: <strong>{renderGeslachtTekst(speciesInfo.nest_broedels)}</strong></span>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sectie: Rui */}
      <div className="section">
        <div className="section-header" onClick={() => toggleSection('rui')}>
          <h3>Rui</h3>
          <span className={`toggle ${sections.rui ? 'open' : ''}`}>▾</span>
        </div>
        {sections.rui && (
          <div className="section-content">
            {settings?.hulpModus !== 'basis' && (
              <div className="ruiscore-diagram">
                <RuiscoreDiagram />
              </div>
            )}
            <div className="ruikaart">
              <div className="ruikaart-labels">
                <span className="ruikaart-groep ruikaart-tertials">Tertials</span>
                <span className="ruikaart-groep ruikaart-secondaries">Secondaries</span>
                <span className="ruikaart-groep ruikaart-primaries">Primaries</span>
                <span className="ruikaart-groep ruikaart-lr">L/R</span>
              </div>
              <div className="ruikaart-velden">
                {ruikaart.map((val, i) => (
                  <input
                    key={i}
                    data-rui={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className={`ruikaart-input${i === 2 || i === 8 || i === 18 ? ' ruikaart-border-right' : ''}`}
                    value={val}
                    onChange={e => updateRuikaart(i, e.target.value)}
                    placeholder={i === 19 ? 'L/R' : String(i < 3 ? i + 1 : i < 9 ? i - 2 : i - 8)}
                  />
                ))}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Handpenrui (totaal)</label>
                <input type="text" value={form.handpen_score}
                  onChange={e => update('handpen_score', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Oude dekveren</label>
                <input type="text" value={form.oude_dekveren}
                  onChange={e => update('oude_dekveren', e.target.value)} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sectie: Biometrie vervolg */}
      <div className="section">
        <div className="section-header" onClick={() => toggleSection('biometrieVervolg')}>
          <h3>Biometrie vervolg</h3>
          {warnings.some(w => !['vleugel', 'gewicht', 'handpenlengte'].includes(w.key)) && <span className="section-badge-warn">!</span>}
          <span className={`toggle ${sections.biometrieVervolg ? 'open' : ''}`}>▾</span>
        </div>
        {sections.biometrieVervolg && (
          <div className="section-content">
            <div className="form-row">
              {renderBioField('tarsus_lengte', 'Tarsus (0,1 mm)')}
              <div className="form-group">
                <label>Tarsus-teen (0,1 mm)</label>
                <input type="text" inputMode="decimal" value={form.tarsus_teen}
                  onChange={e => update('tarsus_teen', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              {renderBioField('tarsus_dikte', 'Tarsus dikte (0,1 mm)')}
              <div className="form-group">
                <label>Achternagel (0,1 mm)</label>
                <input type="text" inputMode="decimal" value={form.achternagel}
                  onChange={e => update('achternagel', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              {renderBioField('staartlengte', 'Staartlengte (0,1 mm)')}
              <div className="form-group">
                <label>Staartverschil (0,1 mm)</label>
                <input type="text" inputMode="decimal" value={form.staart_verschil}
                  onChange={e => update('staart_verschil', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              {renderBioField('snavel_schedel', 'Snavellengte (0,1 mm)')}
              <div className="form-group">
                <label>Snavelmethode</label>
                <select value={form.snavel_methode} onChange={e => update('snavel_methode', e.target.value)}>
                  {SNAVEL_METHODE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              {renderBioField('kop_snavel', 'Totale koplengte (0,1 mm)')}
            </div>
          </div>
        )}
      </div>

      {/* Sectie: Locatie */}
      <div className="section">
        <div className="section-header" onClick={() => toggleSection('locatie')}>
          <h3>Locatie</h3>
          <span className={`toggle ${sections.locatie ? 'open' : ''}`}>▾</span>
        </div>
        {sections.locatie && (
          <div className="section-content">
            <div className="form-row">
              <div className={`form-group${errCls('plaatscode')}`}>
                <label>Plaatscode *</label>
                <select value={form.plaatscode} onChange={e => update('plaatscode', e.target.value)}>
                  {PLAATSCODE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className={`form-group${errCls('google_plaats')}`}>
                <label>Plaatsnaam *</label>
                <input type="text" value={form.google_plaats}
                  onChange={e => update('google_plaats', e.target.value)}
                  placeholder="bijv. Breedenbroek" />
              </div>
            </div>
            <LocatiePicker
              lat={form.lat}
              lon={form.lon}
              onChange={(lat, lon) => { setForm(prev => ({ ...prev, lat, lon })); setFormErrors(prev => prev.filter(f => f.key !== 'lat' && f.key !== 'lon')); }}
              latError={errorKeys.has('lat')}
              lonError={errorKeys.has('lon')}
            />
            <div className={`form-group${errCls('nauwk_coord')}`}>
              <label>Nauwkeurigheid coördinaten *</label>
              <select value={form.nauwk_coord} onChange={e => update('nauwk_coord', e.target.value)}>
                {NAUWK_COORD_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Sectie: Overige EURING data */}
      <div className="section">
        <div className="section-header" onClick={() => toggleSection('euringOverig')}>
          <h3>Overige EURING data</h3>
          <span className={`toggle ${sections.euringOverig ? 'open' : ''}`}>▾</span>
        </div>
        {sections.euringOverig && (
          <div className="section-content">
            <div className="form-group">
              <label>Opmerkingen 1</label>
              <input type="text" value={form.opmerkingen1}
                onChange={e => update('opmerkingen1', e.target.value)} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
