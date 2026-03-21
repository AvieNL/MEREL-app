import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRole } from '../../hooks/useRole';
import { useReferentiebibliotheek } from '../../hooks/useReferentiebibliotheek';
import { verwerkFoto } from '../../utils/imageHelper';
import './ReferentiebibliotheekPage.css';

const MAX_FOTOS_PER_REF = 10;

// Normaliseer oud formaat {fotoBlob, fotoPreview} naar nieuw {fotos:[]}
function normaliseer(r) {
  if (r.fotos?.length) return r;
  if (r.fotoBlob) return { ...r, fotos: [{ blob: r.fotoBlob, preview: r.fotoPreview }] };
  return { ...r, fotos: [] };
}

export default function ReferentiebibliotheekPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isRealAdmin } = useRole();
  const { referenties, loading, addReferentie, updateReferentie, deleteReferentie } = useReferentiebibliotheek();
  const fileInputRef = useRef(null);
  const extraFotoInputRef = useRef(null);

  const [form, setForm] = useState({ soort: '', maand: '', leeftijd: '', geslacht: 'U', toelichting: '' });
  const [fotos, setFotos] = useState([]);
  const [isToevoegen, setIsToevoegen] = useState(false);
  const [opslaan, setOpslaan] = useState(false);
  const [toevoegenAanId, setToevoegenAanId] = useState(null);

  useEffect(() => {
    if (!isRealAdmin) navigate('/');
  }, [isRealAdmin, navigate]);

  if (!isRealAdmin) return null;

  async function handleFotosKiezen(files) {
    const nieuweFiles = Array.from(files).slice(0, MAX_FOTOS_PER_REF - fotos.length);
    if (!nieuweFiles.length) return;
    const verwerkt = await Promise.all(nieuweFiles.map(verwerkFoto));
    setFotos(prev => [...prev, ...verwerkt].slice(0, MAX_FOTOS_PER_REF));
  }

  function handleFotoVerwijderen(index) {
    setFotos(prev => prev.filter((_, i) => i !== index));
  }

  async function handleOpslaan() {
    if (!form.soort || !form.maand || !fotos.length) return;
    setOpslaan(true);
    try {
      await addReferentie({
        soort:       form.soort.trim(),
        maand:       parseInt(form.maand, 10),
        leeftijd:    form.leeftijd,
        geslacht:    form.geslacht,
        type:        'handmatig',
        fotos:       fotos.map(f => ({ blob: f.blob, preview: f.preview })),
        datum:       new Date().toISOString().split('T')[0],
        toelichting: form.toelichting,
      });
      setForm({ soort: '', maand: '', leeftijd: '', geslacht: 'U', toelichting: '' });
      setFotos([]);
      setIsToevoegen(false);
    } finally {
      setOpslaan(false);
    }
  }

  async function handleExtraFotos(id, files) {
    const ref = normaliseer(referenties.find(r => r.id === id));
    const bestaand = ref.fotos || [];
    const nieuweFiles = Array.from(files).slice(0, MAX_FOTOS_PER_REF - bestaand.length);
    if (!nieuweFiles.length) return;
    const verwerkt = await Promise.all(nieuweFiles.map(verwerkFoto));
    const nieuweFotos = [...bestaand, ...verwerkt.map(f => ({ blob: f.blob, preview: f.preview }))];
    await updateReferentie(id, { fotos: nieuweFotos });
    setToevoegenAanId(null);
  }

  async function handleFotoUitRefVerwijderen(id, fotoIndex) {
    const ref = normaliseer(referenties.find(r => r.id === id));
    const nieuweFotos = ref.fotos.filter((_, i) => i !== fotoIndex);
    await updateReferentie(id, { fotos: nieuweFotos });
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
              <input type="text" value={form.soort} placeholder="bijv. Koolmees"
                onChange={e => setForm(p => ({ ...p, soort: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>{t('ref_maand')} *</label>
              <select value={form.maand} onChange={e => setForm(p => ({ ...p, maand: e.target.value }))}>
                <option value="">—</option>
                {MAANDEN.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('ref_leeftijd')}</label>
              <input type="text" value={form.leeftijd} placeholder="EURING code"
                onChange={e => setForm(p => ({ ...p, leeftijd: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>{t('ref_geslacht')}</label>
              <select value={form.geslacht} onChange={e => setForm(p => ({ ...p, geslacht: e.target.value }))}>
                <option value="M">M</option>
                <option value="F">F</option>
                <option value="U">U</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>{t('ref_toelichting')}</label>
            <input type="text" value={form.toelichting}
              onChange={e => setForm(p => ({ ...p, toelichting: e.target.value }))} />
          </div>

          {/* Foto's uploaden */}
          <div className="form-group">
            <label>{t('ref_foto')} * <small>({fotos.length}/{MAX_FOTOS_PER_REF})</small></label>
            <div className="ref-thumbnails">
              {fotos.map((f, i) => (
                <div key={i} className="ref-thumb">
                  <img src={f.preview} alt={`Foto ${i + 1}`} />
                  <button type="button" className="ref-thumb-remove" onClick={() => handleFotoVerwijderen(i)}>×</button>
                </div>
              ))}
              {fotos.length < MAX_FOTOS_PER_REF && (
                <button type="button" className="ref-thumb-add" onClick={() => fileInputRef.current?.click()}>
                  + Foto
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*,.heic" multiple style={{ display: 'none' }}
              onChange={e => handleFotosKiezen(e.target.files)} />
          </div>

          <div className="ref-form-acties">
            <button className="btn-primary" onClick={handleOpslaan}
              disabled={opslaan || !form.soort || !form.maand || !fotos.length}>
              {opslaan ? t('loading') : t('ref_save')}
            </button>
            <button className="btn-secondary" onClick={() => { setIsToevoegen(false); setFotos([]); }}>
              {t('form_cancel')}
            </button>
          </div>
        </div>
      )}

      {loading && <p className="ref-laden">{t('loading')}</p>}
      {!loading && referenties.length === 0 && <p className="ref-leeg">{t('ref_empty')}</p>}

      {!loading && referenties.length > 0 && (
        <div className="ref-lijst">
          {referenties.map(entry => {
            const r = normaliseer(entry);
            return (
              <div key={r.id} className="ref-kaart">
                {/* Foto-strip */}
                <div className="ref-kaart-fotos">
                  {r.fotos.map((f, i) => (
                    <div key={i} className="ref-kaart-foto-wrap">
                      <img src={f.preview} alt={`${r.soort} ${i + 1}`} className="ref-kaart-foto" />
                      <button className="ref-thumb-remove ref-thumb-remove--kaart"
                        onClick={() => handleFotoUitRefVerwijderen(r.id, i)}
                        aria-label="Foto verwijderen">×</button>
                    </div>
                  ))}
                  {r.fotos.length < MAX_FOTOS_PER_REF && (
                    <>
                      <button type="button" className="ref-thumb-add ref-thumb-add--kaart"
                        onClick={() => { setToevoegenAanId(r.id); extraFotoInputRef.current?.click(); }}>
                        +
                      </button>
                      {toevoegenAanId === r.id && (
                        <input ref={extraFotoInputRef} type="file" accept="image/*,.heic" multiple
                          style={{ display: 'none' }}
                          onChange={e => handleExtraFotos(r.id, e.target.files)} />
                      )}
                    </>
                  )}
                </div>

                <div className="ref-kaart-info">
                  <div className="ref-kaart-soort">{r.soort}</div>
                  <div className="ref-kaart-meta">
                    <span className={`ref-type-badge ref-type-badge--${r.type}`}>{t(`ref_type_${r.type}`)}</span>
                    <span>{t('ref_maand_short', { maand: r.maand })}</span>
                    {r.leeftijd && <span>{t('ref_leeftijd_short', { leeftijd: r.leeftijd })}</span>}
                    {r.geslacht && r.geslacht !== 'U' && <span>{r.geslacht}</span>}
                    <span className="ref-foto-teller">{r.fotos.length} foto{r.fotos.length !== 1 ? "'s" : ''}</span>
                  </div>
                  {r.toelichting && <div className="ref-kaart-toelichting">{r.toelichting}</div>}
                  <div className="ref-kaart-datum">{r.datum}</div>
                </div>

                <button className="ref-verwijder-btn" onClick={() => handleVerwijderen(r.id)}
                  aria-label={t('ref_delete')}>×</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
