import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/index.js';
import { useNestData } from '../../hooks/useNestData';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import { berekenVervolgbezoekInfo, isAfsluitendStadium } from '../../utils/nestSuggestie';
import PulliRingenForm from './PulliRingenForm';
import { IconRing } from '../shared/Icons';
import NestSoortInfoPanel from './NestSoortInfoPanel';
import NestSoortPicker from './NestSoortPicker';
import {
  BETROUWB_DATUM_CODES, BETROUWB_AANTAL_CODES, BETROUWB_DAGEN_CODES,
  SUCCES2_CODES, MOMENT_CODES, PREDATIE_CODES, METHODE_CODES, VERLIES_CODES,
  EISUCCES_CODES, VINDSTATUS_CODES,
} from '../../data/sovon-codes';
import StadiumPicker from './StadiumPicker';
import './NieuwNestPage.css';
import './NieuwBezoekPage.css';

export default function WijzigBezoekPage() {
  const { bezoekId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { nesten, legsels, bezoeken, updateBezoek, updateLegsel } = useNestData();
  const species = useSpeciesRef();

  const bezoek = bezoeken.find(b => b.id === bezoekId);
  const legsel = bezoek ? legsels.find(l => l.id === bezoek.legsel_id) : null;
  const nest   = legsel ? nesten.find(n => n.id === legsel.nest_id) : null;

  const [form, setForm] = useState(null);
  const [betrouwbOpen, setBetrouwbOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialiseer form zodra bezoek geladen is
  if (bezoek && form === null) {
    setForm({
      datum:          bezoek.datum || '',
      tijd:           bezoek.tijd?.slice(0, 5) || '',
      stadiumPrimair: bezoek.stadium || '',
      stadiumSecundair: bezoek.stadium2 || '',
      aantalEieren:   bezoek.aantal_eieren != null ? String(bezoek.aantal_eieren) : '',
      eiDood:         bezoek.ei_dood   != null ? String(bezoek.ei_dood)   : '',
      aantalPulli:    bezoek.aantal_pulli  != null ? String(bezoek.aantal_pulli)  : '',
      jongDood:       bezoek.jong_dood != null ? String(bezoek.jong_dood) : '',
      soortEuring:    bezoek.soort_euring || '',
      opmerkingen:    bezoek.opmerkingen || '',
      betrouwbDatum:  bezoek.betrouwb_datum  ?? 1,
      betrouwbAantal: bezoek.betrouwb_aantal ?? 1,
      betrouwbDagen:  bezoek.betrouwb_dagen  ?? 2,
      nestsucces:     bezoek.nestsucces  != null ? String(bezoek.nestsucces)  : '',
      succes2:        bezoek.succes2  || '',
      moment:         bezoek.moment   != null ? String(bezoek.moment)   : '',
      predatie:       bezoek.predatie != null ? String(bezoek.predatie) : '',
      methode:        bezoek.methode  != null ? String(bezoek.methode)  : '',
      verlies:        bezoek.verlies  || '',
      eisucces:       bezoek.eisucces != null ? String(bezoek.eisucces) : '',
      vindstatus:     bezoek.vindstatus != null ? String(bezoek.vindstatus) : '',
    });
  }

  const speciesByEuring = useMemo(() => {
    const map = {};
    species.forEach(s => { if (s.euring_code) map[s.euring_code] = s; });
    return map;
  }, [species]);

  const soort = useMemo(
    () => form?.soortEuring ? speciesByEuring[form.soortEuring] || null : null,
    [form?.soortEuring, speciesByEuring],
  );

  const suggestieInfo = useMemo(
    () => form ? berekenVervolgbezoekInfo(form.stadiumPrimair, form.datum, soort) : null,
    [form?.stadiumPrimair, form?.datum, soort],
  );
  const suggestie = suggestieInfo?.datum ?? null;
  const isAfsluitend = form ? isAfsluitendStadium(form.stadiumPrimair) : false;

  if (!bezoek || !legsel || !nest || form === null) {
    return (
      <div className="page">
        <button className="btn-secondary page-back" onClick={() => navigate(-1)}>{t('btn_back')}</button>
      </div>
    );
  }

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: false }));
  }

  async function handleSave() {
    if (!form.stadiumPrimair) { setErrors({ stadium: true }); return; }
    setSaving(true);
    try {
      await updateBezoek(bezoekId, {
        datum:          form.datum,
        tijd:           form.tijd || null,
        stadium:        form.stadiumPrimair,
        stadium2:       form.stadiumSecundair || null,
        aantal_eieren:  form.aantalEieren !== '' ? parseInt(form.aantalEieren, 10) : null,
        ei_dood:        form.eiDood   !== '' ? parseInt(form.eiDood,   10) : null,
        aantal_pulli:   form.aantalPulli  !== '' ? parseInt(form.aantalPulli,  10) : null,
        jong_dood:      form.jongDood !== '' ? parseInt(form.jongDood, 10) : null,
        soort_euring:   form.soortEuring || null,
        opmerkingen:    form.opmerkingen,
        betrouwb_datum:  form.betrouwbDatum,
        betrouwb_aantal: form.betrouwbAantal,
        betrouwb_dagen:  form.betrouwbDagen,
        volgende_bezoek_suggestie: suggestie || null,
        volgende_bezoek_type:      suggestieInfo?.type || null,
      });

      if (isAfsluitend) {
        await updateLegsel(legsel.id, {
          nestsucces:  form.nestsucces  !== '' ? parseInt(form.nestsucces,  10) : null,
          succes2:     form.succes2     || null,
          moment:      form.moment      !== '' ? parseInt(form.moment,      10) : null,
          predatie:    form.predatie    !== '' ? parseInt(form.predatie,    10) : null,
          methode:     form.methode     !== '' ? parseInt(form.methode,     10) : null,
          verlies:     form.verlies     || null,
          eisucces:    form.eisucces    !== '' ? parseInt(form.eisucces,    10) : null,
          vindstatus:  form.vindstatus  !== '' ? parseInt(form.vindstatus,  10) : null,
        });
      }

      navigate(`/nest/${nest.id}`);
    } finally {
      setSaving(false);
    }
  }

  const lang = i18n.language?.slice(0, 2) || 'nl';

  return (
    <div className="page nieuw-nest-page">
      <div className="nieuw-sticky-header">
        <div className="nieuw-topbar">
          <span className="nieuw-topbar-titel">
            ⌂ {nest.kastnummer}{nest.omschrijving ? ` — ${nest.omschrijving}` : ''}
          </span>
          <button type="button" className="btn-secondary nieuw-topbar-btn"
            onClick={() => navigate(`/nest/${nest.id}`)} disabled={saving}>
            {t('btn_cancel')}
          </button>
          <button type="button" className="btn-primary nieuw-topbar-btn"
            onClick={handleSave} disabled={saving}>
            {saving ? t('btn_saving') : t('btn_save')}
          </button>
        </div>
      </div>

      {/* ── Datum en tijd ── */}
      <div className="section">
        <div className="section-content">
          <div className="form-row form-row--datum-tijd">
            <div className="form-group">
              <label>{t('form_date')}</label>
              <input type="date" value={form.datum} onChange={e => update('datum', e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t('form_time_hhmm')}</label>
              <input type="text" inputMode="numeric" maxLength={5}
                value={form.tijd} onChange={e => update('tijd', e.target.value)}
                placeholder={t('form_time_placeholder')} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Soort ── */}
      <div className="section">
        <div className="section-header"><h3>{t('nest_soort_bezoek')}</h3></div>
        <div className="section-content">
          <NestSoortPicker
            species={species}
            value={form.soortEuring}
            onChange={code => update('soortEuring', code)}
            lang={lang}
          />
          <NestSoortInfoPanel soort={soort} stadium={form.stadiumPrimair} />
        </div>
      </div>

      {/* ── Stadium ── */}
      <div className="section">
        <div className="section-header">
          <h3>
            {t('nest_stadium')}
            {errors.stadium && <span className="field-error"> *</span>}
          </h3>
        </div>
        <div className="section-content">
          <StadiumPicker
            primair={form.stadiumPrimair}
            secundair={form.stadiumSecundair}
            onChangePrimair={code => { update('stadiumPrimair', code); setErrors(prev => ({ ...prev, stadium: false })); }}
            onChangeSecundair={code => update('stadiumSecundair', code)}
            aantalEieren={form.aantalEieren}
            onChangeAantalEieren={v => update('aantalEieren', v)}
            aantalPulli={form.aantalPulli}
            onChangeAantalPulli={v => update('aantalPulli', v)}
            error={errors.stadium}
          />
          {(form.stadiumPrimair?.startsWith('E') || form.aantalEieren !== '' || form.stadiumPrimair?.startsWith('N') || form.aantalPulli !== '') && (
            <div className="form-row form-row--dood">
              {(form.stadiumPrimair?.startsWith('E') || form.aantalEieren !== '') && (
                <div className="form-group">
                  <label>{t('nest_ei_dood')}</label>
                  <input type="number" inputMode="numeric" min="0" max="30"
                    value={form.eiDood} onChange={e => update('eiDood', e.target.value)} placeholder="0" />
                </div>
              )}
              {(form.stadiumPrimair?.startsWith('N') || form.aantalPulli !== '') && (
                <div className="form-group">
                  <label>{t('nest_jong_dood')}</label>
                  <input type="number" inputMode="numeric" min="0" max="30"
                    value={form.jongDood} onChange={e => update('jongDood', e.target.value)} placeholder="0" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Nestsucces (bij afsluitend stadium) ── */}
      {isAfsluitend && (
        <div className="section">
          <div className="section-header"><h3>{t('nest_section_nestsucces')}</h3></div>
          <div className="section-content">
            <div className="form-row">
              <div className="form-group">
                <label>{t('nest_nestsucces_aantal')}</label>
                <input type="number" min="-1" max="25"
                  value={form.nestsucces} onChange={e => update('nestsucces', e.target.value)} placeholder="-1" />
                <span className="field-hint">{t('nest_nestsucces_hint')}</span>
              </div>
              <div className="form-group">
                <label>{t('nest_succes2')}</label>
                <select value={form.succes2} onChange={e => update('succes2', e.target.value)}>
                  <option value="">{t('nest_code_optional')}</option>
                  {SUCCES2_CODES.map(c => <option key={c.code} value={c.code}>{c.nl}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('nest_methode')}</label>
                <select value={form.methode} onChange={e => update('methode', e.target.value)}>
                  <option value="">{t('nest_code_optional')}</option>
                  {METHODE_CODES.map(c => <option key={c.code} value={c.code}>{c.nl}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>{t('nest_moment')}</label>
                <select value={form.moment} onChange={e => update('moment', e.target.value)}>
                  <option value="">{t('nest_code_optional')}</option>
                  {MOMENT_CODES.map(c => <option key={c.code} value={c.code}>{c.nl}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('nest_predatie')}</label>
                <select value={form.predatie} onChange={e => update('predatie', e.target.value)}>
                  <option value="">{t('nest_code_optional')}</option>
                  {PREDATIE_CODES.map(c => <option key={c.code} value={c.code}>{c.nl}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>{t('nest_verlies')}</label>
                <select value={form.verlies} onChange={e => update('verlies', e.target.value)}>
                  <option value="">{t('nest_code_optional')}</option>
                  {VERLIES_CODES.map(c => <option key={c.code} value={c.code}>{c.nl}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('nest_eisucces')}</label>
                <select value={form.eisucces} onChange={e => update('eisucces', e.target.value)}>
                  <option value="">{t('nest_code_optional')}</option>
                  {EISUCCES_CODES.map(c => <option key={c.code} value={c.code}>{c.nl}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>{t('nest_vindstatus')}</label>
                <select value={form.vindstatus} onChange={e => update('vindstatus', e.target.value)}>
                  <option value="">{t('nest_code_optional')}</option>
                  {VINDSTATUS_CODES.map(c => <option key={c.code} value={c.code}>{c.nl}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Opmerkingen ── */}
      <div className="section">
        <div className="section-content">
          <div className="form-group">
            <label>{t('form_remarks')}</label>
            <textarea value={form.opmerkingen} onChange={e => update('opmerkingen', e.target.value)}
              rows={3} placeholder={t('nest_opmerkingen_placeholder')} />
          </div>
        </div>
      </div>

      {/* ── Betrouwbaarheid (inklapbaar) ── */}
      <div className="section">
        <div className="section-header" onClick={() => setBetrouwbOpen(o => !o)} style={{ cursor: 'pointer' }}>
          <h3>{t('nest_section_betrouwb')}</h3>
          <span className={`toggle ${betrouwbOpen ? 'open' : ''}`}>▾</span>
        </div>
        {betrouwbOpen && (
          <div className="section-content">
            <div className="form-group">
              <label>{t('nest_betrouwb_datum')}</label>
              <select value={form.betrouwbDatum} onChange={e => update('betrouwbDatum', Number(e.target.value))}>
                {BETROUWB_DATUM_CODES.map(c => <option key={c.code} value={c.code}>{c[i18n.language] ?? c.nl}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>{t('nest_betrouwb_aantal')}</label>
              <select value={form.betrouwbAantal} onChange={e => update('betrouwbAantal', Number(e.target.value))}>
                {BETROUWB_AANTAL_CODES.map(c => <option key={c.code} value={c.code}>{c[i18n.language] ?? c.nl}</option>)}
              </select>
            </div>
            {(form.stadiumPrimair === 'N+' || form.stadiumPrimair?.startsWith('N')) && (
              <div className="form-group">
                <label>{t('nest_betrouwb_dagen')}</label>
                <select value={form.betrouwbDagen} onChange={e => update('betrouwbDagen', Number(e.target.value))}>
                  {BETROUWB_DAGEN_CODES.map(c => <option key={c.code} value={c.code}>{c[i18n.language] ?? c.nl}</option>)}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Pulli ringen ── */}
      {form.stadiumPrimair?.startsWith('N') && form.stadiumPrimair !== 'N+' && (
        <div className="section">
          <div className="section-content">
            <PulliRingenForm bezoekId={bezoekId} />
          </div>
        </div>
      )}

      {/* ── Vervolgbezoeksuggestie ── */}
      {suggestie && (() => {
        const [y, m, d] = suggestie.split('-');
        const datumFormatted = `${d}-${m}-${y}`;
        const dagenAf = Math.round((new Date(suggestie) - new Date(form.datum)) / 86400000);
        const eenMaandGeleden = new Date(); eenMaandGeleden.setMonth(eenMaandGeleden.getMonth() - 1);
        const isVerleden = new Date(suggestie) < eenMaandGeleden;
        const typeKeys = {
          ringen: 'nest_suggestie_ringen', nacontrole: 'nest_suggestie_nacontrole',
          eileg: 'nest_suggestie_eileg', jongen: 'nest_suggestie_jongen',
          bouw: 'nest_suggestie_bouw', check: 'nest_suggestie_check',
        };
        const type = suggestieInfo?.type ?? 'check';
        return (
          <div className={`vervolgbezoek-suggestie${type === 'ringen' ? ' vervolgbezoek-suggestie--ringen' : ''}`}>
            <span className="vervolgbezoek-suggestie__label">
              {type === 'ringen' ? <IconRing size={13} /> : '🗓'} {t(typeKeys[type] ?? 'nest_suggestie_check')}
            </span>
            <strong className="vervolgbezoek-suggestie__datum">{datumFormatted}</strong>
            {!isVerleden && <span className="vervolgbezoek-suggestie__dagen">{t('nest_suggestie_over_dagen', { n: dagenAf })}</span>}
          </div>
        );
      })()}
    </div>
  );
}
