import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNestData } from '../../hooks/useNestData';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import LocatiePicker from '../Nieuw/LocatiePicker';
import {
  HABITAT_CODES, NESTPLAATS_CODES, NESTTYPE_CODES,
  VONDST_CODES, VERSTOPT_CODES, BESCHERM_CODES, KASTTYPE_CODES,
} from '../../data/sovon-codes';
import { IconVogelNest } from '../shared/Icons';
import './NieuwNestPage.css';

function codeLabel(c, lang) { return c[lang] || c.nl; }

// Codes die een extra toelichting vragen
const NESTTYPE_TOEL  = new Set([1, 2, 4]);
const NESTPLAATS_TOEL = new Set([4, 5, 6, 9, 10, 99]);
const VONDST_TOEL    = new Set([6]);

const NESTTYPE_HINTS = {
  nl: { 1: 'Van welke soort?', 2: 'Kastnummer', 4: 'Omschrijving' },
  en: { 1: 'Which species?',   2: 'Box number', 4: 'Description'  },
  de: { 1: 'Welche Art?',      2: 'Kastnummer', 4: 'Beschreibung' },
};
const NESTPLAATS_HINTS = {
  nl: { 4: 'Plantensoort', 5: 'Gewas', 6: 'Struiksoort', 9: 'Naaldboomsoort', 10: 'Loofboomsoort', 99: 'Omschrijving' },
  en: { 4: 'Plant species', 5: 'Crop', 6: 'Shrub species', 9: 'Conifer species', 10: 'Deciduous species', 99: 'Description' },
  de: { 4: 'Pflanzenart', 5: 'Kulturpflanze', 6: 'Strauchart', 9: 'Nadelbaum-Art', 10: 'Laubbaum-Art', 99: 'Beschreibung' },
};
const VONDST_HINTS = {
  nl: { 6: 'Hoe gevonden?' },
  en: { 6: 'How found?'    },
  de: { 6: 'Wie gefunden?' },
};

const LEEG_FORM = {
  locatie_type: 'kast',
  kastnummer: '',
  omschrijving: '',
  eigenaar_naam: '',
  eigenaar_email: '',
  eigenaar_telefoon: '',
  toelichting: '',
  soort_euring: '',
  nesttype: '',
  nesttype_toelichting: '',
  habitat: '',
  nestplaats: '',
  nestplaats_toelichting: '',
  vondst: '',
  vondst_toelichting: '',
  verstopt: '',
  bescherm: '',
  kasttype: '',
  hoogte: '',
  lat: '',
  lon: '',
  adres: '',
};

export default function NieuwNestPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || 'nl';
  const navigate = useNavigate();
  const { addNest, nesten } = useNestData();
  const species = useSpeciesRef();
  const [form, setForm] = useState(LEEG_FORM);

  // Suggestie: hoogste bestaande numerieke kastnummer + 1
  const volgendNummer = useMemo(() => {
    const nummers = nesten
      .map(n => parseInt(n.kastnummer, 10))
      .filter(n => !isNaN(n) && n > 0);
    return nummers.length > 0 ? Math.max(...nummers) + 1 : 1;
  }, [nesten]);

  // Pre-vul zodra nesten geladen zijn (alleen als veld nog leeg is)
  useEffect(() => {
    if (nesten.length > 0) {
      setForm(prev => prev.kastnummer ? prev : { ...prev, kastnummer: String(volgendNummer) });
    }
  }, [volgendNummer]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [soortZoek, setSoortZoek] = useState('');
  const [eigenaarDropdown, setEigenaarDropdown] = useState(false);

  // Unieke eigenaren uit bestaande nesten (met naam)
  const bekende_eigenaren = useMemo(() => {
    const map = new Map();
    nesten.forEach(n => {
      if (!n.eigenaar_naam?.trim()) return;
      const key = n.eigenaar_naam.trim().toLowerCase();
      if (!map.has(key)) map.set(key, {
        naam:     n.eigenaar_naam.trim(),
        email:    n.eigenaar_email    || '',
        telefoon: n.eigenaar_telefoon || '',
      });
    });
    return [...map.values()];
  }, [nesten]);

  const eigenaarSuggesties = useMemo(() => {
    const term = form.eigenaar_naam.trim().toLowerCase();
    if (!term) return [];
    return bekende_eigenaren.filter(e => e.naam.toLowerCase().includes(term)).slice(0, 8);
  }, [form.eigenaar_naam, bekende_eigenaren]);

  function kiesEigenaar(e) {
    setForm(prev => ({ ...prev, eigenaar_naam: e.naam, eigenaar_email: e.email, eigenaar_telefoon: e.telefoon }));
    setEigenaarDropdown(false);
  }

  const gefilterdeSoorten = useMemo(() => {
    if (!soortZoek || soortZoek.length < 2) return [];
    const term = soortZoek.toLowerCase();
    return species
      .filter(s => s.naam_nl?.toLowerCase().includes(term) || s.naam_la?.toLowerCase().includes(term) || s[`naam_${lang}`]?.toLowerCase().includes(term))
      .slice(0, 20);
  }, [soortZoek, species, lang]);

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: false }));
  }

  function validate() {
    const errs = {};
    if (!form.kastnummer.trim()) errs.kastnummer = true;
    return errs;
  }

  async function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    try {
      const nestId = await addNest({
        locatie_type:      form.locatie_type || 'kast',
        kastnummer:        form.kastnummer.trim(),
        omschrijving:      form.omschrijving.trim(),
        eigenaar_naam:     form.eigenaar_naam.trim(),
        eigenaar_email:    form.eigenaar_email.trim(),
        eigenaar_telefoon: form.eigenaar_telefoon.trim(),
        toelichting:       form.toelichting.trim(),
        soort_euring:      form.soort_euring || '',
        nesttype:               form.nesttype || null,
        nesttype_toelichting:   form.nesttype_toelichting.trim() || null,
        habitat:                form.habitat !== '' ? parseInt(form.habitat, 10) : null,
        nestplaats:             form.nestplaats !== '' ? parseInt(form.nestplaats, 10) : null,
        nestplaats_toelichting: form.nestplaats_toelichting.trim() || null,
        vondst:                 form.vondst !== '' ? parseInt(form.vondst, 10) : null,
        vondst_toelichting:     form.vondst_toelichting.trim() || null,
        verstopt:          form.verstopt !== '' ? parseInt(form.verstopt, 10) : null,
        bescherm:          form.bescherm !== '' ? parseInt(form.bescherm, 10) : null,
        kasttype:          form.locatie_type !== 'nest' && form.kasttype !== '' ? parseInt(form.kasttype, 10) : null,
        hoogte:            form.hoogte !== '' ? parseFloat(form.hoogte) : null,
        lat:               form.lat ? parseFloat(form.lat) : null,
        lon:               form.lon ? parseFloat(form.lon) : null,
        adres:             form.adres.trim(),
      });
      navigate(`/nest/${nestId}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page nieuw-nest-page">
      <div className="nieuw-sticky-header">
        <div className="nieuw-topbar">
          <span className="nieuw-topbar-titel">{t('nest_new_title')}</span>
          <button type="button" className="btn-secondary nieuw-topbar-btn" onClick={() => navigate('/nest')} disabled={saving}>
            {t('btn_cancel')}
          </button>
          <button type="button" className="btn-primary nieuw-topbar-btn" onClick={handleSave} disabled={saving}>
            {saving ? t('btn_saving') : t('btn_save')}
          </button>
        </div>
      </div>

      {/* ── Nestinfo ── */}
      <div className="section">
        <div className="section-header"><h3>{t('nest_section_info')}</h3></div>
        <div className="section-content">
          <div className="form-group">
            <label>{t('nest_locatie_type')}</label>
            <div className="nest-type-picker">
              <button type="button"
                className={`nest-type-btn${form.locatie_type !== 'nest' ? ' nest-type-btn--active' : ''}`}
                onClick={() => update('locatie_type', 'kast')}>
                <span>⌂</span> {t('nest_type_kast')}
              </button>
              <button type="button"
                className={`nest-type-btn${form.locatie_type === 'nest' ? ' nest-type-btn--active' : ''}`}
                onClick={() => update('locatie_type', 'nest')}>
                <IconVogelNest size={15} /> {t('nest_type_nest')}
              </button>
            </div>
          </div>
          <div className="form-row">
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
          </div>
          <div className="form-group">
            <label>{t('nest_eigenaar_naam')}</label>
            <div className="soort-zoeker">
              <input
                type="text"
                value={form.eigenaar_naam}
                onChange={e => { update('eigenaar_naam', e.target.value); setEigenaarDropdown(true); }}
                onFocus={() => setEigenaarDropdown(true)}
                onBlur={() => setTimeout(() => setEigenaarDropdown(false), 150)}
                placeholder={t('nest_eigenaar_naam_placeholder')}
                autoComplete="off"
              />
              {eigenaarDropdown && eigenaarSuggesties.length > 0 && (
                <div className="soort-zoeker__dropdown">
                  {eigenaarSuggesties.map(e => (
                    <button key={e.naam} type="button" className="soort-zoeker__item"
                      onMouseDown={() => kiesEigenaar(e)}>
                      <span>{e.naam}</span>
                      {(e.email || e.telefoon) && (
                        <span className="soort-zoeker__latin">{[e.email, e.telefoon].filter(Boolean).join(' · ')}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="nest-eigenaar-contact">
            <div className="form-group">
              <label>{t('nest_eigenaar_email')}</label>
              <input
                type="email"
                value={form.eigenaar_email}
                onChange={e => update('eigenaar_email', e.target.value)}
                placeholder={t('nest_eigenaar_email_placeholder')}
              />
            </div>
            <div className="form-group">
              <label>{t('nest_eigenaar_telefoon')}</label>
              <input
                type="tel"
                value={form.eigenaar_telefoon}
                onChange={e => update('eigenaar_telefoon', e.target.value)}
                placeholder={t('nest_eigenaar_telefoon_placeholder')}
              />
            </div>
          </div>
          <div className="form-group">
            <label>{t('nest_toelichting')}</label>
            <textarea
              rows={3}
              value={form.toelichting}
              onChange={e => update('toelichting', e.target.value)}
              placeholder={t('nest_toelichting_placeholder')}
            />
          </div>
        </div>
      </div>

      {/* ── Soort & type ── */}
      <div className="section">
        <div className="section-header"><h3>{t('nest_section_type')}</h3></div>
        <div className="section-content">
          <div className="form-group">
            <label>{t('nest_soort')}</label>
            <div className="soort-zoeker">
              <input
                type="text"
                value={soortZoek || (form.soort_euring
                  ? (species.find(s => s.euring_code === form.soort_euring)?.[`naam_${lang}`]
                    || species.find(s => s.euring_code === form.soort_euring)?.naam_nl
                    || form.soort_euring)
                  : '')}
                onChange={e => { setSoortZoek(e.target.value); if (!e.target.value) update('soort_euring', ''); }}
                placeholder={t('nest_soort_placeholder')}
              />
              {gefilterdeSoorten.length > 0 && (
                <div className="soort-zoeker__dropdown">
                  {gefilterdeSoorten.map(s => (
                    <button key={s.naam_nl} className="soort-zoeker__item"
                      onClick={() => { update('soort_euring', s.euring_code || ''); setSoortZoek(''); }}
                    >
                      <span>{s[`naam_${lang}`] || s.naam_nl}</span>
                      <span className="soort-zoeker__latin">{s.naam_la}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('nest_nesttype')}</label>
              <select value={form.nesttype} onChange={e => { update('nesttype', e.target.value); update('nesttype_toelichting', ''); }}>
                <option value="">{t('nest_code_optional')}</option>
                {NESTTYPE_CODES.map(c => <option key={c.code} value={c.code}>{c.code} — {codeLabel(c, lang)}</option>)}
              </select>
              {NESTTYPE_TOEL.has(Number(form.nesttype)) && (
                <input type="text" className="nest-toel-input"
                  value={form.nesttype_toelichting}
                  onChange={e => update('nesttype_toelichting', e.target.value)}
                  placeholder={NESTTYPE_HINTS[lang]?.[Number(form.nesttype)] || 'Toelichting...'}
                />
              )}
            </div>
            <div className="form-group">
              <label>{t('nest_habitat')}</label>
              <select value={form.habitat} onChange={e => update('habitat', e.target.value)}>
                <option value="">{t('nest_code_optional')}</option>
                {HABITAT_CODES.map(c => <option key={c.code} value={c.code}>{c.code} — {codeLabel(c, lang)}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('nest_nestplaats')}</label>
              <select value={form.nestplaats} onChange={e => { update('nestplaats', e.target.value); update('nestplaats_toelichting', ''); }}>
                <option value="">{t('nest_code_optional')}</option>
                {NESTPLAATS_CODES.map(c => <option key={c.code} value={c.code}>{c.code} — {codeLabel(c, lang)}</option>)}
              </select>
              {NESTPLAATS_TOEL.has(Number(form.nestplaats)) && (
                <input type="text" className="nest-toel-input"
                  value={form.nestplaats_toelichting}
                  onChange={e => update('nestplaats_toelichting', e.target.value)}
                  placeholder={NESTPLAATS_HINTS[lang]?.[Number(form.nestplaats)] || 'Toelichting...'}
                />
              )}
            </div>
            <div className="form-group">
              <label>{t('nest_vondst')}</label>
              <select value={form.vondst} onChange={e => { update('vondst', e.target.value); update('vondst_toelichting', ''); }}>
                <option value="">{t('nest_code_optional')}</option>
                {VONDST_CODES.map(c => <option key={c.code} value={c.code}>{c.code} — {codeLabel(c, lang)}</option>)}
              </select>
              {VONDST_TOEL.has(Number(form.vondst)) && (
                <input type="text" className="nest-toel-input"
                  value={form.vondst_toelichting}
                  onChange={e => update('vondst_toelichting', e.target.value)}
                  placeholder={VONDST_HINTS[lang]?.[Number(form.vondst)] || 'Toelichting...'}
                />
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('nest_verstopt')}</label>
              <select value={form.verstopt} onChange={e => update('verstopt', e.target.value)}>
                <option value="">{t('nest_code_optional')}</option>
                {VERSTOPT_CODES.map(c => <option key={c.code} value={c.code}>{c.code} — {codeLabel(c, lang)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>{t('nest_bescherm')}</label>
              <select value={form.bescherm} onChange={e => update('bescherm', e.target.value)}>
                <option value="">{t('nest_code_optional')}</option>
                {BESCHERM_CODES.map(c => <option key={c.code} value={c.code}>{c.code} — {codeLabel(c, lang)}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            {form.locatie_type !== 'nest' && (
            <div className="form-group">
              <label>{t('nest_kasttype')}</label>
              <select value={form.kasttype} onChange={e => update('kasttype', e.target.value)}>
                <option value="">{t('nest_code_optional')}</option>
                {KASTTYPE_CODES.map(c => <option key={c.code} value={c.code}>{c.code} — {codeLabel(c, lang)}</option>)}
              </select>
            </div>
            )}
            <div className="form-group">
              <label>{t('nest_hoogte')}</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                min="0"
                max="50"
                value={form.hoogte}
                onChange={e => update('hoogte', e.target.value)}
                placeholder={t('nest_hoogte_placeholder')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Locatie ── */}
      <div className="section">
        <div className="section-header"><h3>{t('nest_section_location')}</h3></div>
        <div className="section-content">
          <div className="form-group">
            <label>{t('nest_adres')}</label>
            <input
              type="text"
              value={form.adres}
              onChange={e => update('adres', e.target.value)}
              placeholder={t('nest_adres_placeholder')}
            />
          </div>
          <LocatiePicker
            lat={form.lat}
            lon={form.lon}
            onChange={(lat, lon) => { update('lat', lat); update('lon', lon); }}
          />
        </div>
      </div>

    </div>
  );
}
