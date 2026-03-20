import { useNieuwForm } from './NieuwFormContext';
import {
  LEEFTIJD_OPTIONS, PULLUS_LEEFTIJD_OPTIONS, NAUWK_LEEFTIJD_OPTIONS,
  BROEDGROOTTE_OPTIONS, GESLACHT_OPTIONS, GESLACHTSBEPALING_OPTIONS,
  ZEKER_OMSTANDIG_OPTIONS, CONDITIE_OPTIONS, VERPLAATST_OPTIONS,
} from './NieuwPage.constants';
import InfoPanel from './InfoPanel';
import RuiSeizoenTekst from './RuiSeizoenTekst';
import './NieuwPage.css';

export default function SectieVogel() {
  const {
    form,
    update,
    errCls,
    sections,
    toggleSection,
    settings,
    speciesInfo,
    soortOverride,
    genderHint,
    ruitypenConfig,
    getCodesForSelect,
  } = useNieuwForm();

  return (
    <div className="section">
      <div className="section-header" onClick={() => toggleSection('vogel')}>
        <h3>Vogel</h3>
        <span className={`toggle ${sections.vogel ? 'open' : ''}`}>▾</span>
      </div>
      {sections.vogel && (
        <div className="section-content">
          <div className="form-row">
            <div className={`form-group${errCls('geslacht')}`}>
              <label>Geslacht *</label>
              <select value={form.geslacht} onChange={e => update('geslacht', e.target.value)}>
                {GESLACHT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <InfoPanel items={[
                { label: '♂', text: speciesInfo?.geslachts_notities_m || soortOverride?.geslachts_notities_m },
                { label: '♀', text: speciesInfo?.geslachts_notities_f || soortOverride?.geslachts_notities_f },
              ]} />
            </div>
            <div className="form-group">
              <label>Bepaling geslacht</label>
              <select value={form.geslachtsbepaling} onChange={e => update('geslachtsbepaling', e.target.value)}>
                {GESLACHTSBEPALING_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          {genderHint && (() => {
            const sym = genderHint === 'M'
              ? <span className="gender-m">{'\u2642\uFE0E'}</span>
              : <span className="gender-f">{'\u2640\uFE0E'}</span>;
            const ingevuld = form.geslacht === 'M' || form.geslacht === 'F';
            const klopt = form.geslacht === genderHint;
            return (
              <div className={`gender-bio-hint ${klopt ? 'gender-bio-hint--match' : ingevuld ? 'gender-bio-hint--mismatch' : 'gender-bio-hint--suggest'}`}>
                {klopt
                  ? <>Biometrie bevestigt {sym} man</>
                  : ingevuld
                    ? <>Biometrie wijst op {sym} {genderHint === 'M' ? 'man' : 'vrouw'} — controleer het ingevoerde geslacht</>
                    : <>Op basis van biometrie: waarschijnlijk {sym} {genderHint === 'M' ? 'man' : 'vrouw'}</>
                }
              </div>
            );
          })()}

          <div className={`form-group${errCls('leeftijd')}`}>
            <label>Leeftijd *</label>
            <select value={form.leeftijd} onChange={e => update('leeftijd', e.target.value)}>
              {LEEFTIJD_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <InfoPanel items={[
              { label: 'Voorjaar', text: speciesInfo?.leeftijds_notities_vj || soortOverride?.leeftijds_notities_vj },
              { label: 'Najaar',   text: speciesInfo?.leeftijds_notities_nj || soortOverride?.leeftijds_notities_nj },
            ]} />
            {form.leeftijd === '1' && (
              <div className="pullus-velden">
                <div className="form-row">
                  <div className={`form-group${errCls('pul_leeftijd')}`}>
                    <label>Pullus leeftijd *</label>
                    <select value={form.pul_leeftijd} onChange={e => update('pul_leeftijd', e.target.value)}>
                      {PULLUS_LEEFTIJD_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className={`form-group${errCls('nauwk_pul_leeftijd')}`}>
                    <label>Nauwkeurigheid *</label>
                    <select value={form.nauwk_pul_leeftijd} onChange={e => update('nauwk_pul_leeftijd', e.target.value)}>
                      {NAUWK_LEEFTIJD_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={`form-group${errCls('broedselgrootte')}`}>
                  <label>Broedgrootte *</label>
                  <select value={form.broedselgrootte} onChange={e => update('broedselgrootte', e.target.value)}>
                    {BROEDGROOTTE_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  {speciesInfo?.nest_eieren && (
                    <span className="field-hint">Eieren {speciesInfo.naam_nl}: {speciesInfo.nest_eieren}</span>
                  )}
                </div>
              </div>
            )}
            {speciesInfo?.ruitype === 'A' && <>
              {settings?.hulpModus !== 'basis' && (
                <div className="ruitype-note ruitype-note--kalender">
                  <div className="ruitype-kalender">
                    <div className="ruitype-kal-rij">
                      <span className="ruitype-kal-zijlabel">Juv.</span>
                      <div className="ruitype-kal-balk">
                        <div className="ruitype-kal-seg ruitype-kal-seg--pull" style={{gridColumn:'span 1'}}>pull.</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--juv"  style={{gridColumn:'span 2'}}>juv</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--rui"  style={{gridColumn:'span 2'}}>complete rui</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--vol"  style={{gridColumn:'span 3'}}>volgroeid</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--akj"  style={{gridColumn:'span 4'}}>na 1 kj</div>
                      </div>
                    </div>
                    <div className="ruitype-kal-maanden">
                      <span className="ruitype-kal-maand">Mei</span>
                      <span className="ruitype-kal-maand">Jun</span>
                      <span className="ruitype-kal-maand">Jul</span>
                      <span className="ruitype-kal-maand">Aug</span>
                      <span className="ruitype-kal-maand">Sep</span>
                      <span className="ruitype-kal-maand">Okt</span>
                      <span className="ruitype-kal-maand">Nov</span>
                      <span className="ruitype-kal-maand ruitype-kal-maand--dec">Dec</span>
                      <span className="ruitype-kal-maand ruitype-kal-maand--jan">Jan</span>
                      <span className="ruitype-kal-maand">Feb</span>
                      <span className="ruitype-kal-maand">Mrt</span>
                      <span className="ruitype-kal-maand">Apr</span>
                    </div>
                    <div className="ruitype-kal-rij">
                      <span className="ruitype-kal-zijlabel">Ad.</span>
                      <div className="ruitype-kal-balk">
                        <div className="ruitype-kal-seg ruitype-kal-seg--vol"  style={{gridColumn:'span 3'}}>volgroeid</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--rui"  style={{gridColumn:'span 2'}}>complete rui</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--vol"  style={{gridColumn:'span 3'}}>volgroeid</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--akj"  style={{gridColumn:'span 4'}}>na 1 kj</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {settings?.hulpModus !== 'basis' && <RuiSeizoenTekst type="A" config={ruitypenConfig} />}
            </>}
            {speciesInfo?.ruitype === 'B' && <>
              {settings?.hulpModus !== 'basis' && (
                <div className="ruitype-note ruitype-note--kalender">
                  <div className="ruitype-kalender">
                    <div className="ruitype-kal-rij">
                      <span className="ruitype-kal-zijlabel">Juv.</span>
                      <div className="ruitype-kal-balk">
                        <div className="ruitype-kal-seg ruitype-kal-seg--pull" style={{gridColumn:'span 1'}}>pull.</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--juv"  style={{gridColumn:'span 2'}}>juv</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--rui"  style={{gridColumn:'span 2'}}>part. rui</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--vol"  style={{gridColumn:'span 3'}}>1 kj</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--akj"  style={{gridColumn:'span 4'}}>2 kj</div>
                      </div>
                    </div>
                    <div className="ruitype-kal-maanden">
                      <span className="ruitype-kal-maand">Mei</span>
                      <span className="ruitype-kal-maand">Jun</span>
                      <span className="ruitype-kal-maand">Jul</span>
                      <span className="ruitype-kal-maand">Aug</span>
                      <span className="ruitype-kal-maand">Sep</span>
                      <span className="ruitype-kal-maand">Okt</span>
                      <span className="ruitype-kal-maand">Nov</span>
                      <span className="ruitype-kal-maand ruitype-kal-maand--dec">Dec</span>
                      <span className="ruitype-kal-maand ruitype-kal-maand--jan">Jan</span>
                      <span className="ruitype-kal-maand">Feb</span>
                      <span className="ruitype-kal-maand">Mrt</span>
                      <span className="ruitype-kal-maand">Apr</span>
                    </div>
                    <div className="ruitype-kal-rij">
                      <span className="ruitype-kal-zijlabel">Ad.</span>
                      <div className="ruitype-kal-balk">
                        <div className="ruitype-kal-seg ruitype-kal-seg--vol"  style={{gridColumn:'span 3'}}>2kj / na 2kj</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--rui"  style={{gridColumn:'span 2'}}>complete rui</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--akj"  style={{gridColumn:'span 3'}}>na 1 kj</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--akj"  style={{gridColumn:'span 4'}}>na 2 kj</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {settings?.hulpModus !== 'basis' && <RuiSeizoenTekst type="B" config={ruitypenConfig} />}
            </>}
            {speciesInfo?.ruitype === 'C' && <>
              {settings?.hulpModus !== 'basis' && (
                <div className="ruitype-note ruitype-note--kalender">
                  <div className="ruitype-kalender">
                    <div className="ruitype-kal-rij">
                      <span className="ruitype-kal-zijlabel">Juv.</span>
                      <div className="ruitype-kal-balk">
                        <div className="ruitype-kal-seg ruitype-kal-seg--pull" style={{gridColumn:'span 1'}}>pull.</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--juv"  style={{gridColumn:'span 2'}}>juv</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--rui"  style={{gridColumn:'span 2'}}>part. rui</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--vol"  style={{gridColumn:'span 3'}}>1 kj</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--rui"  style={{gridColumn:'span 1'}}>p.r.</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--vol"  style={{gridColumn:'span 3'}}>2 kj</div>
                      </div>
                    </div>
                    <div className="ruitype-kal-maanden">
                      <span className="ruitype-kal-maand">Mei</span>
                      <span className="ruitype-kal-maand">Jun</span>
                      <span className="ruitype-kal-maand">Jul</span>
                      <span className="ruitype-kal-maand">Aug</span>
                      <span className="ruitype-kal-maand">Sep</span>
                      <span className="ruitype-kal-maand">Okt</span>
                      <span className="ruitype-kal-maand">Nov</span>
                      <span className="ruitype-kal-maand ruitype-kal-maand--dec">Dec</span>
                      <span className="ruitype-kal-maand ruitype-kal-maand--jan">Jan</span>
                      <span className="ruitype-kal-maand">Feb</span>
                      <span className="ruitype-kal-maand">Mrt</span>
                      <span className="ruitype-kal-maand">Apr</span>
                    </div>
                    <div className="ruitype-kal-rij">
                      <span className="ruitype-kal-zijlabel">Ad.</span>
                      <div className="ruitype-kal-balk">
                        <div className="ruitype-kal-seg ruitype-kal-seg--vol"  style={{gridColumn:'span 3'}}>2kj / na 2kj</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--rui"  style={{gridColumn:'span 2'}}>complete rui</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--akj"  style={{gridColumn:'span 3'}}>na 1 kj</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--rui"  style={{gridColumn:'span 1'}}>p.r.</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--akj"  style={{gridColumn:'span 3'}}>na 2 kj</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {settings?.hulpModus !== 'basis' && <RuiSeizoenTekst type="C" config={ruitypenConfig} />}
            </>}
            {speciesInfo?.ruitype === 'D' && <>
              {settings?.hulpModus !== 'basis' && (
                <div className="ruitype-note ruitype-note--kalender">
                  <div className="ruitype-kalender">
                    <div className="ruitype-kal-rij">
                      <span className="ruitype-kal-zijlabel">Juv.</span>
                      <div className="ruitype-kal-balk">
                        <div className="ruitype-kal-seg ruitype-kal-seg--pull" style={{gridColumn:'span 1'}}>pull.</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--juv"  style={{gridColumn:'span 2'}}>juv</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--rui"  style={{gridColumn:'span 2'}}>part. rui</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--vol"  style={{gridColumn:'span 3'}}>1 kj</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--rui"  style={{gridColumn:'span 1'}}>c.r.</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--akj"  style={{gridColumn:'span 3'}}>na 1 kj</div>
                      </div>
                    </div>
                    <div className="ruitype-kal-maanden">
                      <span className="ruitype-kal-maand">Mei</span>
                      <span className="ruitype-kal-maand">Jun</span>
                      <span className="ruitype-kal-maand">Jul</span>
                      <span className="ruitype-kal-maand">Aug</span>
                      <span className="ruitype-kal-maand">Sep</span>
                      <span className="ruitype-kal-maand">Okt</span>
                      <span className="ruitype-kal-maand">Nov</span>
                      <span className="ruitype-kal-maand ruitype-kal-maand--dec">Dec</span>
                      <span className="ruitype-kal-maand ruitype-kal-maand--jan">Jan</span>
                      <span className="ruitype-kal-maand">Feb</span>
                      <span className="ruitype-kal-maand">Mrt</span>
                      <span className="ruitype-kal-maand">Apr</span>
                    </div>
                    <div className="ruitype-kal-rij">
                      <span className="ruitype-kal-zijlabel">Ad.</span>
                      <div className="ruitype-kal-balk">
                        <div className="ruitype-kal-seg ruitype-kal-seg--vol"  style={{gridColumn:'span 3'}}>volgroeid</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--rui"  style={{gridColumn:'span 2'}}>complete rui</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--akj"  style={{gridColumn:'span 3'}}>na 1 kj</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--rui"  style={{gridColumn:'span 1'}}>c.r.</div>
                        <div className="ruitype-kal-seg ruitype-kal-seg--akj"  style={{gridColumn:'span 3'}}>na 1 kj</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {settings?.hulpModus !== 'basis' && <RuiSeizoenTekst type="D" config={ruitypenConfig} />}
            </>}
            {speciesInfo?.ruitype === 'X' && <>
              {settings?.hulpModus !== 'basis' && <RuiSeizoenTekst type="X" config={ruitypenConfig} />}
            </>}
          </div>

          {/* Status, Conditie, Omstandigheden, Gemanipuleerd, Verplaatst */}
          <div className="form-row">
            <div className={`form-group${errCls('status')}`}>
              <label>Status *</label>
              <select value={form.status} onChange={e => update('status', e.target.value)}>
                {getCodesForSelect('status').map(o => (
                  <option key={o.code} value={o.code}>{o.code} – {o.beschrijving}</option>
                ))}
              </select>
            </div>
            <div className={`form-group${errCls('conditie')}`}>
              <label>Conditie *</label>
              <select value={form.conditie} onChange={e => update('conditie', e.target.value)}>
                {CONDITIE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className={`form-group${errCls('omstandigheden')}`}>
              <label>Omstandigheden *</label>
              <select value={form.omstandigheden} onChange={e => update('omstandigheden', e.target.value)}>
                {getCodesForSelect('omstandigheden').map(o => (
                  <option key={o.code} value={o.code}>{o.code} – {o.beschrijving}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Zekerheid omstandigheden</label>
              <select value={form.zeker_omstandigheden} onChange={e => update('zeker_omstandigheden', Number(e.target.value))}>
                {ZEKER_OMSTANDIG_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className={`form-group${errCls('gemanipuleerd')}`}>
              <label>Gemanipuleerd *</label>
              <select value={form.gemanipuleerd} onChange={e => update('gemanipuleerd', e.target.value)}>
                {getCodesForSelect('gemanipuleerd').map(o => (
                  <option key={o.code} value={o.code}>{o.code} – {o.beschrijving}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Verplaatst</label>
              <select value={form.verplaatst} onChange={e => update('verplaatst', Number(e.target.value))}>
                {VERPLAATST_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          {form.gemanipuleerd === 'M' && (
            <div className="form-group">
              <label>Barcode</label>
              <input type="text" value={form.barcode}
                onChange={e => update('barcode', e.target.value)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
