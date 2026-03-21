import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRole } from '../../hooks/useRole';
import { useReferentiebibliotheek, getFotoUrl } from '../../hooks/useReferentiebibliotheek';
import { verwerkFoto } from '../../utils/imageHelper';
import './ReferentiebibliotheekPage.css';

const MAX_FOTOS = 10;
const LEEG_FORM = { soort: '', maand: '', leeftijd: '', geslacht: 'U', type: 'handmatig', toelichting: '' };
const MAANDEN = Array.from({ length: 12 }, (_, i) => i + 1);

function FotoStrip({ paden, onVerwijder, onToevoegen, maxFotos = MAX_FOTOS }) {
  const fileRef = useRef(null);
  return (
    <div className="ref-thumbnails">
      {paden.map((pad, i) => (
        <div key={pad} className="ref-thumb">
          <img src={getFotoUrl(pad)} alt={`Foto ${i + 1}`} />
          {onVerwijder && (
            <button type="button" className="ref-thumb-remove" onClick={() => onVerwijder(pad)}>×</button>
          )}
        </div>
      ))}
      {onToevoegen && paden.length < maxFotos && (
        <>
          <button type="button" className="ref-thumb-add" onClick={() => fileRef.current?.click()}>
            + Foto
          </button>
          <input ref={fileRef} type="file" accept="image/*,.heic" multiple style={{ display: 'none' }}
            onChange={e => onToevoegen(e.target.files)} />
        </>
      )}
    </div>
  );
}

function ReferentieKaart({ r, t, onEdit, onDelete }) {
  return (
    <div className="ref-kaart">
      <FotoStrip paden={r.foto_paden ?? []} />
      <div className="ref-kaart-info">
        <div className="ref-kaart-soort">{r.soort}</div>
        <div className="ref-kaart-meta">
          <span className={`ref-type-badge ref-type-badge--${r.type}`}>{t(`ref_type_${r.type}`)}</span>
          <span>{t('ref_maand_short', { maand: r.maand })}</span>
          {r.leeftijd && <span>{t('ref_leeftijd_short', { leeftijd: r.leeftijd })}</span>}
          {r.geslacht && r.geslacht !== 'U' && <span>{r.geslacht}</span>}
          <span className="ref-foto-teller">{r.foto_paden?.length ?? 0} foto{(r.foto_paden?.length ?? 0) !== 1 ? "'s" : ''}</span>
        </div>
        {r.toelichting && <div className="ref-kaart-toelichting">{r.toelichting}</div>}
        <div className="ref-kaart-datum">{r.datum}</div>
        <div className="ref-kaart-acties">
          <button className="btn-secondary ref-kaart-btn" onClick={() => onEdit(r)}>{t('ref_edit')}</button>
          <button className="ref-verwijder-knop" onClick={() => onDelete(r.id)}>{t('ref_delete')}</button>
        </div>
      </div>
    </div>
  );
}

function ReferentieEditForm({ r, t, onSave, onCancel, addFotos, verwijderFoto }) {
  const [form, setForm] = useState({
    soort: r.soort,
    maand: String(r.maand),
    leeftijd: r.leeftijd,
    geslacht: r.geslacht,
    type: r.type,
    toelichting: r.toelichting,
  });
  const [saving, setSaving] = useState(false);

  async function handleOpslaan() {
    setSaving(true);
    try {
      await onSave(r.id, {
        soort: form.soort.trim(),
        maand: parseInt(form.maand, 10),
        leeftijd: form.leeftijd,
        geslacht: form.geslacht,
        type: form.type,
        toelichting: form.toelichting,
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleExtraFotos(files) {
    const verwerkt = await Promise.all(Array.from(files).map(verwerkFoto));
    await addFotos(r.id, verwerkt);
  }

  return (
    <div className="ref-edit-form">
      <div className="form-row">
        <div className="form-group">
          <label>{t('ref_soort')} *</label>
          <input type="text" value={form.soort} onChange={e => setForm(p => ({ ...p, soort: e.target.value }))} />
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
        <div className="form-group">
          <label>{t('ref_type')}</label>
          <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
            <option value="bevestigd">{t('ref_type_bevestigd')}</option>
            <option value="gecorrigeerd">{t('ref_type_gecorrigeerd')}</option>
            <option value="handmatig">{t('ref_type_handmatig')}</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>{t('ref_toelichting')}</label>
        <input type="text" value={form.toelichting}
          onChange={e => setForm(p => ({ ...p, toelichting: e.target.value }))} />
      </div>
      <div className="form-group">
        <label>{t('ref_foto')} ({r.foto_paden?.length ?? 0}/{MAX_FOTOS})</label>
        <FotoStrip
          paden={r.foto_paden ?? []}
          onVerwijder={pad => verwijderFoto(r.id, pad)}
          onToevoegen={handleExtraFotos}
          maxFotos={MAX_FOTOS}
        />
      </div>
      <div className="ref-form-acties">
        <button className="btn-primary" onClick={handleOpslaan}
          disabled={saving || !form.soort || !form.maand}>
          {saving ? t('loading') : t('ref_save')}
        </button>
        <button className="btn-secondary" onClick={onCancel}>{t('form_cancel')}</button>
      </div>
    </div>
  );
}

export default function ReferentiebibliotheekPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isRealAdmin } = useRole();
  const {
    referenties, loading,
    addReferentie, updateReferentie,
    addFotosAanReferentie, verwijderFotoUitReferentie,
    deleteReferentie,
  } = useReferentiebibliotheek();

  const [isToevoegen, setIsToevoegen] = useState(false);
  const [bewerkId, setBewerkId] = useState(null);
  const [nieuwForm, setNieuwForm] = useState(LEEG_FORM);
  const [nieuwFotos, setNieuwFotos] = useState([]);
  const [opslaan, setOpslaan] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => { if (!isRealAdmin) navigate('/'); }, [isRealAdmin, navigate]);
  if (!isRealAdmin) return null;

  async function handleNieuweFotos(files) {
    const verwerkt = await Promise.all(
      Array.from(files).slice(0, MAX_FOTOS - nieuwFotos.length).map(verwerkFoto)
    );
    setNieuwFotos(prev => [...prev, ...verwerkt].slice(0, MAX_FOTOS));
  }

  async function handleOpslaan() {
    if (!nieuwForm.soort || !nieuwForm.maand || !nieuwFotos.length) return;
    setOpslaan(true);
    try {
      await addReferentie({
        soort:      nieuwForm.soort.trim(),
        maand:      parseInt(nieuwForm.maand, 10),
        leeftijd:   nieuwForm.leeftijd,
        geslacht:   nieuwForm.geslacht,
        type:       nieuwForm.type,
        toelichting: nieuwForm.toelichting,
        datum:      new Date().toISOString().split('T')[0],
        fotos:      nieuwFotos,
      });
      setNieuwForm(LEEG_FORM);
      setNieuwFotos([]);
      setIsToevoegen(false);
    } finally {
      setOpslaan(false);
    }
  }

  async function handleBewerk(id, changes) {
    await updateReferentie(id, changes);
    setBewerkId(null);
  }

  async function handleVerwijderen(id) {
    if (!window.confirm(t('ref_delete_confirm'))) return;
    await deleteReferentie(id);
  }

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

      {/* Nieuw toevoegen */}
      {isToevoegen && (
        <div className="section ref-form-card">
          <h3>{t('ref_add_manual')}</h3>
          <div className="form-row">
            <div className="form-group">
              <label>{t('ref_soort')} *</label>
              <input type="text" value={nieuwForm.soort} placeholder="bijv. Goudhaan"
                onChange={e => setNieuwForm(p => ({ ...p, soort: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>{t('ref_maand')} *</label>
              <select value={nieuwForm.maand} onChange={e => setNieuwForm(p => ({ ...p, maand: e.target.value }))}>
                <option value="">—</option>
                {MAANDEN.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('ref_leeftijd')}</label>
              <input type="text" value={nieuwForm.leeftijd} placeholder="EURING code"
                onChange={e => setNieuwForm(p => ({ ...p, leeftijd: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>{t('ref_geslacht')}</label>
              <select value={nieuwForm.geslacht} onChange={e => setNieuwForm(p => ({ ...p, geslacht: e.target.value }))}>
                <option value="M">M</option><option value="F">F</option><option value="U">U</option>
              </select>
            </div>
            <div className="form-group">
              <label>{t('ref_type')}</label>
              <select value={nieuwForm.type} onChange={e => setNieuwForm(p => ({ ...p, type: e.target.value }))}>
                <option value="bevestigd">{t('ref_type_bevestigd')}</option>
                <option value="gecorrigeerd">{t('ref_type_gecorrigeerd')}</option>
                <option value="handmatig">{t('ref_type_handmatig')}</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>{t('ref_toelichting')}</label>
            <input type="text" value={nieuwForm.toelichting}
              onChange={e => setNieuwForm(p => ({ ...p, toelichting: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>{t('ref_foto')} * ({nieuwFotos.length}/{MAX_FOTOS})</label>
            <div className="ref-thumbnails">
              {nieuwFotos.map((f, i) => (
                <div key={i} className="ref-thumb">
                  <img src={f.preview} alt={`Foto ${i + 1}`} />
                  <button type="button" className="ref-thumb-remove"
                    onClick={() => setNieuwFotos(p => p.filter((_, j) => j !== i))}>×</button>
                </div>
              ))}
              {nieuwFotos.length < MAX_FOTOS && (
                <button type="button" className="ref-thumb-add" onClick={() => fileRef.current?.click()}>
                  + Foto
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*,.heic" multiple style={{ display: 'none' }}
              onChange={e => handleNieuweFotos(e.target.files)} />
          </div>
          <div className="ref-form-acties">
            <button className="btn-primary" onClick={handleOpslaan}
              disabled={opslaan || !nieuwForm.soort || !nieuwForm.maand || !nieuwFotos.length}>
              {opslaan ? t('loading') : t('ref_save')}
            </button>
            <button className="btn-secondary" onClick={() => { setIsToevoegen(false); setNieuwFotos([]); }}>
              {t('form_cancel')}
            </button>
          </div>
        </div>
      )}

      {loading && <p className="ref-laden">{t('loading')}</p>}
      {!loading && referenties.length === 0 && <p className="ref-leeg">{t('ref_empty')}</p>}

      {!loading && referenties.length > 0 && (
        <div className="ref-lijst">
          {referenties.map(r => (
            <div key={r.id} className="ref-kaart-wrapper">
              {bewerkId === r.id ? (
                <div className="section ref-form-card">
                  <h4>{t('ref_edit')}: {r.soort}</h4>
                  <ReferentieEditForm
                    r={r}
                    t={t}
                    onSave={handleBewerk}
                    onCancel={() => setBewerkId(null)}
                    addFotos={addFotosAanReferentie}
                    verwijderFoto={verwijderFotoUitReferentie}
                  />
                </div>
              ) : (
                <ReferentieKaart
                  r={r}
                  t={t}
                  onEdit={ref => setBewerkId(ref.id)}
                  onDelete={handleVerwijderen}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
