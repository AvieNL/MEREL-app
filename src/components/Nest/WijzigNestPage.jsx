import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNestData } from '../../hooks/useNestData';
import LocatiePicker from '../Nieuw/LocatiePicker';
import './NieuwNestPage.css';

export default function WijzigNestPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { nesten, updateNest } = useNestData();

  const nest = nesten.find(n => n.id === id);

  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Initialiseer form zodra nest geladen is (Dexie is reactief)
  if (nest && form === null) {
    setForm({
      kastnummer: nest.kastnummer || '',
      omschrijving: nest.omschrijving || '',
      lat: nest.lat != null ? String(nest.lat) : '',
      lon: nest.lon != null ? String(nest.lon) : '',
    });
  }

  if (!nest || form === null) {
    return (
      <div className="page">
        <button className="btn-back" onClick={() => navigate(-1)}>‹ {t('btn_back')}</button>
      </div>
    );
  }

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
      await updateNest(id, {
        kastnummer: form.kastnummer.trim(),
        omschrijving: form.omschrijving.trim(),
        lat: form.lat ? parseFloat(form.lat) : null,
        lon: form.lon ? parseFloat(form.lon) : null,
      });
      navigate(`/nest/${id}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page nieuw-nest-page">
      <div className="nieuw-nest-header">
        <button className="btn-back" onClick={() => navigate(`/nest/${id}`)}>‹ {t('btn_back')}</button>
        <h2>{t('nest_edit_title', { nr: nest.kastnummer })}</h2>
      </div>

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

      <div className="nieuw-nest-acties">
        <button className="btn-secondary" onClick={() => navigate(`/nest/${id}`)} disabled={saving}>
          {t('btn_cancel')}
        </button>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? t('btn_saving') : t('btn_save')}
        </button>
      </div>
    </div>
  );
}
