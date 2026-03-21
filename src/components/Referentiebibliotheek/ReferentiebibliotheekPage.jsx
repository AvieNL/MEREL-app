import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRole } from '../../hooks/useRole';
import { useReferentiebibliotheek } from '../../hooks/useReferentiebibliotheek';
import { verwerkFoto } from '../../utils/imageHelper';
import './ReferentiebibliotheekPage.css';

export default function ReferentiebibliotheekPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isRealAdmin } = useRole();
  const { referenties, loading, addReferentie, deleteReferentie } = useReferentiebibliotheek();

  // Formulier voor handmatig toevoegen (admin only)
  const [form, setForm] = useState({ soort: '', maand: '', leeftijd: '', geslacht: 'U', toelichting: '' });
  const [foto, setFoto] = useState(null);
  const [isToevoegen, setIsToevoegen] = useState(false);
  const [opslaan, setOpslaan] = useState(false);

  useEffect(() => {
    if (!isRealAdmin) navigate('/');
  }, [isRealAdmin, navigate]);

  if (!isRealAdmin) return null;

  function handleFormChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleFotoKiezen(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const verwerkt = await verwerkFoto(file);
    setFoto(verwerkt);
  }

  async function handleOpslaan() {
    if (!form.soort || !form.maand || !foto) return;
    setOpslaan(true);
    try {
      await addReferentie({
        soort:       form.soort.trim(),
        maand:       parseInt(form.maand, 10),
        leeftijd:    form.leeftijd,
        geslacht:    form.geslacht,
        type:        'handmatig',
        fotoBlob:    foto.blob,
        fotoPreview: foto.preview,
        datum:       new Date().toISOString().split('T')[0],
        toelichting: form.toelichting,
      });
      setForm({ soort: '', maand: '', leeftijd: '', geslacht: 'U', toelichting: '' });
      setFoto(null);
      setIsToevoegen(false);
    } finally {
      setOpslaan(false);
    }
  }

  async function handleVerwijderen(id) {
    if (!window.confirm(t('ref_delete_confirm'))) return;
    await deleteReferentie(id);
  }

  const MAANDEN = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="page ref-page">
      <div className="ref-header">
        <button className="btn-secondary ref-back-btn" onClick={() => navigate('/admin')}>
          ← {t('admin_title')}
        </button>
        <h2>{t('ref_title')}</h2>
        {!isToevoegen && (
          <button className="btn-primary" onClick={() => setIsToevoegen(true)}>
            + {t('ref_add_manual')}
          </button>
        )}
      </div>

      {/* Formulier handmatig toevoegen */}
      {isToevoegen && (
        <div className="section ref-form-card">
          <h3>{t('ref_add_manual')}</h3>
          <div className="form-row">
            <div className="form-group">
              <label>{t('ref_soort')} *</label>
              <input
                type="text"
                value={form.soort}
                placeholder="bijv. Koolmees"
                onChange={e => handleFormChange('soort', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>{t('ref_maand')} *</label>
              <select value={form.maand} onChange={e => handleFormChange('maand', e.target.value)}>
                <option value="">—</option>
                {MAANDEN.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('ref_leeftijd')}</label>
              <input
                type="text"
                value={form.leeftijd}
                placeholder="EURING code"
                onChange={e => handleFormChange('leeftijd', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>{t('ref_geslacht')}</label>
              <select value={form.geslacht} onChange={e => handleFormChange('geslacht', e.target.value)}>
                <option value="M">M</option>
                <option value="F">F</option>
                <option value="U">U</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>{t('ref_toelichting')}</label>
            <input
              type="text"
              value={form.toelichting}
              onChange={e => handleFormChange('toelichting', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>{t('ref_foto')} *</label>
            <input type="file" accept="image/*,.heic" onChange={handleFotoKiezen} />
            {foto && <img src={foto.preview} alt="preview" className="ref-foto-preview" />}
          </div>
          <div className="ref-form-acties">
            <button
              className="btn-primary"
              onClick={handleOpslaan}
              disabled={opslaan || !form.soort || !form.maand || !foto}
            >
              {opslaan ? t('loading') : t('ref_save')}
            </button>
            <button className="btn-secondary" onClick={() => { setIsToevoegen(false); setFoto(null); }}>
              {t('form_cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Lijst */}
      {loading && <p className="ref-laden">{t('loading')}</p>}

      {!loading && referenties.length === 0 && (
        <p className="ref-leeg">{t('ref_empty')}</p>
      )}

      {!loading && referenties.length > 0 && (
        <div className="ref-lijst">
          {referenties.map(r => (
            <div key={r.id} className="ref-kaart">
              {r.fotoPreview && (
                <img src={r.fotoPreview} alt={r.soort} className="ref-kaart-foto" />
              )}
              <div className="ref-kaart-info">
                <div className="ref-kaart-soort">{r.soort}</div>
                <div className="ref-kaart-meta">
                  <span className={`ref-type-badge ref-type-badge--${r.type}`}>{t(`ref_type_${r.type}`)}</span>
                  <span>{t('ref_maand_short', { maand: r.maand })}</span>
                  {r.leeftijd && <span>{t('ref_leeftijd_short', { leeftijd: r.leeftijd })}</span>}
                  {r.geslacht && r.geslacht !== 'U' && <span>{r.geslacht}</span>}
                </div>
                {r.toelichting && <div className="ref-kaart-toelichting">{r.toelichting}</div>}
                <div className="ref-kaart-datum">{r.datum}</div>
              </div>
              <button
                className="ref-verwijder-btn"
                onClick={() => handleVerwijderen(r.id)}
                aria-label={t('ref_delete')}
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
