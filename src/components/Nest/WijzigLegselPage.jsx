import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNestData } from '../../hooks/useNestData';
import {
  LINK_TYPE_CODES,
  SUCCES2_CODES, MOMENT_CODES, PREDATIE_CODES, METHODE_CODES,
  VERLIES_CODES, EISUCCES_CODES, VINDSTATUS_CODES,
} from '../../data/sovon-codes';
import './NieuwNestPage.css';

export default function WijzigLegselPage() {
  const { legselId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { legsels, nesten, updateLegsel } = useNestData();
  const [saving, setSaving] = useState(false);

  const legsel = legsels.find(l => l.id === legselId);
  const nest   = legsel ? nesten.find(n => n.id === legsel.nest_id) : null;

  // Zelfde displayNummer-logica als NestDetailPage
  const displayNummer = legsel ? (() => {
    const nestLegsels = legsels.filter(l => l.nest_id === legsel.nest_id);
    const chronologisch = [...nestLegsels].sort((a, b) => {
      if (a.jaar !== b.jaar) return (a.jaar || 0) - (b.jaar || 0);
      return (a.volgnummer || 0) - (b.volgnummer || 0);
    });
    return chronologisch.findIndex(l => l.id === legselId) + 1;
  })() : null;

  const [form, setForm] = useState(null);

  if (legsel && form === null) {
    setForm({
      jaar:       legsel.jaar        ?? new Date().getFullYear(),
      linkType:   legsel.link_type   ?? 0,
      nestsucces: legsel.nestsucces  != null ? String(legsel.nestsucces)  : '',
      succes2:    legsel.succes2     || '',
      moment:     legsel.moment      != null ? String(legsel.moment)      : '',
      predatie:   legsel.predatie    != null ? String(legsel.predatie)    : '',
      methode:    legsel.methode     != null ? String(legsel.methode)     : '',
      verlies:    legsel.verlies     || '',
      eisucces:   legsel.eisucces    != null ? String(legsel.eisucces)    : '',
      vindstatus: legsel.vindstatus  != null ? String(legsel.vindstatus)  : '',
    });
  }

  if (!legsel || !nest || form === null) {
    return (
      <div className="page">
        <button className="btn-secondary page-back" onClick={() => navigate(-1)}>{t('btn_back')}</button>
      </div>
    );
  }

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateLegsel(legselId, {
        jaar:       Number(form.jaar),
        link_type:  form.linkType,
        nestsucces: form.nestsucces !== '' ? parseInt(form.nestsucces, 10) : null,
        succes2:    form.succes2    || null,
        moment:     form.moment     !== '' ? parseInt(form.moment,     10) : null,
        predatie:   form.predatie   !== '' ? parseInt(form.predatie,   10) : null,
        methode:    form.methode    !== '' ? parseInt(form.methode,    10) : null,
        verlies:    form.verlies    || null,
        eisucces:   form.eisucces   !== '' ? parseInt(form.eisucces,   10) : null,
        vindstatus: form.vindstatus !== '' ? parseInt(form.vindstatus, 10) : null,
      });
      navigate(`/nest/${nest.id}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page nieuw-nest-page">
      <div className="nieuw-sticky-header">
        <div className="nieuw-topbar">
          <span className="nieuw-topbar-titel">
            ⌂ {nest.kastnummer}{nest.omschrijving ? ` — ${nest.omschrijving}` : ''} · {t('nest_legsel_nr', { nr: displayNummer ?? legsel.volgnummer })}
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

      {/* ── Jaar & link type ── */}
      <div className="section">
        <div className="section-content">
          <div className="form-row">
            <div className="form-group">
              <label>{t('nest_jaar')}</label>
              <input
                type="number"
                inputMode="numeric"
                min="2000"
                max="2100"
                value={form.jaar}
                onChange={e => update('jaar', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>{t('nest_link_type')}</label>
              <select value={form.linkType} onChange={e => update('linkType', Number(e.target.value))}>
                {LINK_TYPE_CODES.map(c => (
                  <option key={c.code} value={c.code}>{c.code} — {c.nl}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Nestsucces ── */}
      <div className="section">
        <div className="section-header"><h3>{t('nest_section_nestsucces')}</h3></div>
        <div className="section-content">
          <div className="form-row">
            <div className="form-group">
              <label>{t('nest_nestsucces_aantal')}</label>
              <input type="number" min="-1" max="25"
                value={form.nestsucces}
                onChange={e => update('nestsucces', e.target.value)}
                placeholder="-1" />
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
    </div>
  );
}
