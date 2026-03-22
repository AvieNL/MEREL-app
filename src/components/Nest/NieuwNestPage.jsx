import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNestData } from '../../hooks/useNestData';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import LocatiePicker from '../Nieuw/LocatiePicker';
import {
  HABITAT_CODES, NESTPLAATS_CODES, NESTTYPE_CODES,
  VONDST_CODES, VERSTOPT_CODES, BESCHERM_CODES,
} from '../../data/sovon-codes';
import './NieuwNestPage.css';

const HUIDIG_JAAR = new Date().getFullYear();

const LEEG_FORM = {
  kastnummer: '',
  lat: '',
  lon: '',
  omschrijving: '',
  // Seizoensgegevens
  soort_euring: '',
  habitat: '',
  nestplaats: '',
  nesttype: '',
  vondst: '',
  verstopt: '',
  bescherm: '',
};

export default function NieuwNestPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addNest, addNestSeizoen, addLegsel } = useNestData();
  const species = useSpeciesRef();
  const [form, setForm] = useState(LEEG_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [soortZoek, setSoortZoek] = useState('');

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: false }));
  }

  // Soortzoeker — filter op zoekterm
  const gefilterdeSoorten = useMemo(() => {
    if (!soortZoek || soortZoek.length < 2) return [];
    const term = soortZoek.toLowerCase();
    return species
      .filter(s => s.naam_nl?.toLowerCase().includes(term) || s.naam_la?.toLowerCase().includes(term))
      .slice(0, 20);
  }, [soortZoek, species]);

  function validate() {
    const errs = {};
    if (!form.kastnummer.trim()) errs.kastnummer = true;
    return errs;
  }

  async function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    try {
      // 1. Nest aanmaken
      const nestId = await addNest({
        kastnummer: form.kastnummer.trim(),
        lat: form.lat ? parseFloat(form.lat) : null,
        lon: form.lon ? parseFloat(form.lon) : null,
        omschrijving: form.omschrijving.trim(),
      });

      // 2. Seizoensgegevens aanmaken (huidige jaar)
      const seizoenId = await addNestSeizoen({
        nest_id: nestId,
        jaar: HUIDIG_JAAR,
        soort_euring: form.soort_euring || '',
        habitat: form.habitat !== '' ? parseInt(form.habitat, 10) : null,
        nestplaats: form.nestplaats !== '' ? parseInt(form.nestplaats, 10) : null,
        nesttype: form.nesttype || null,
        vondst: form.vondst !== '' ? parseInt(form.vondst, 10) : null,
        verstopt: form.verstopt !== '' ? parseInt(form.verstopt, 10) : null,
        bescherm: form.bescherm !== '' ? parseInt(form.bescherm, 10) : null,
      });

      // 3. Eerste legsel automatisch aanmaken
      await addLegsel({
        nest_seizoen_id: seizoenId,
        volgnummer: 1,
        link_type: 0,
      });

      navigate(`/nest/${nestId}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page nieuw-nest-page">
      <div className="nieuw-nest-header">
        <button className="btn-back" onClick={() => navigate('/nest')}>‹ {t('btn_back')}</button>
        <h2>{t('nest_new_title')}</h2>
      </div>

      {/* ── Locatie ── */}
      <div className="section">
        <div className="section-header"><h3>{t('nest_section_location')}</h3></div>
        <div className="section-content">
          <div className={`form-group${errors.kastnummer ? ' form-group--error' : ''}`}>
            <label>{t('nest_kastnummer')} *</label>
            <input
              type="text"
              value={form.kastnummer}
              onChange={e => update('kastnummer', e.target.value)}
              placeholder={t('nest_kastnummer_placeholder')}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>{t('nest_omschrijving')}</label>
            <input
              type="text"
              value={form.omschrijving}
              onChange={e => update('omschrijving', e.target.value)}
              placeholder={t('nest_omschrijving_placeholder')}
            />
          </div>
          <LocatiePicker
            lat={form.lat}
            lon={form.lon}
            onChange={(lat, lon) => { update('lat', lat); update('lon', lon); }}
          />
        </div>
      </div>

      {/* ── Seizoensgegevens ── */}
      <div className="section">
        <div className="section-header"><h3>{t('nest_section_season', { jaar: HUIDIG_JAAR })}</h3></div>
        <div className="section-content">

          {/* Soort */}
          <div className="form-group">
            <label>{t('nest_soort')}</label>
            <div className="soort-zoeker">
              <input
                type="text"
                value={soortZoek || (form.soort_euring
                  ? (species.find(s => s.euring_code === form.soort_euring)?.naam_nl || form.soort_euring)
                  : '')}
                onChange={e => { setSoortZoek(e.target.value); if (!e.target.value) update('soort_euring', ''); }}
                placeholder={t('nest_soort_placeholder')}
              />
              {gefilterdeSoorten.length > 0 && (
                <div className="soort-zoeker__dropdown">
                  {gefilterdeSoorten.map(s => (
                    <button
                      key={s.naam_nl}
                      className="soort-zoeker__item"
                      onClick={() => {
                        update('soort_euring', s.euring_code || '');
                        setSoortZoek('');
                      }}
                    >
                      <span>{s.naam_nl}</span>
                      <span className="soort-zoeker__latin">{s.naam_la}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('nest_habitat')}</label>
              <select value={form.habitat} onChange={e => update('habitat', e.target.value)}>
                <option value="">{t('nest_code_optional')}</option>
                {HABITAT_CODES.map(c => (
                  <option key={c.code} value={c.code}>{c.code} — {c.nl}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>{t('nest_nestplaats')}</label>
              <select value={form.nestplaats} onChange={e => update('nestplaats', e.target.value)}>
                <option value="">{t('nest_code_optional')}</option>
                {NESTPLAATS_CODES.map(c => (
                  <option key={c.code} value={c.code}>{c.code} — {c.nl}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('nest_nesttype')}</label>
              <select value={form.nesttype} onChange={e => update('nesttype', e.target.value)}>
                <option value="">{t('nest_code_optional')}</option>
                {NESTTYPE_CODES.map(c => (
                  <option key={c.code} value={c.code}>{c.code} — {c.nl}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>{t('nest_vondst')}</label>
              <select value={form.vondst} onChange={e => update('vondst', e.target.value)}>
                <option value="">{t('nest_code_optional')}</option>
                {VONDST_CODES.map(c => (
                  <option key={c.code} value={c.code}>{c.code} — {c.nl}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('nest_verstopt')}</label>
              <select value={form.verstopt} onChange={e => update('verstopt', e.target.value)}>
                <option value="">{t('nest_code_optional')}</option>
                {VERSTOPT_CODES.map(c => (
                  <option key={c.code} value={c.code}>{c.code} — {c.nl}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>{t('nest_bescherm')}</label>
              <select value={form.bescherm} onChange={e => update('bescherm', e.target.value)}>
                <option value="">{t('nest_code_optional')}</option>
                {BESCHERM_CODES.map(c => (
                  <option key={c.code} value={c.code}>{c.code} — {c.nl}</option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>

      <div className="nieuw-nest-acties">
        <button className="btn-secondary" onClick={() => navigate('/nest')} disabled={saving}>
          {t('btn_cancel')}
        </button>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? t('btn_saving') : t('btn_save')}
        </button>
      </div>
    </div>
  );
}
