import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNestData } from '../../hooks/useNestData';
import { LINK_TYPE_CODES } from '../../data/sovon-codes';
import './NieuwNestPage.css';

export default function NieuwLegselPage() {
  const { seizoenId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { seizoenen, legsels, nesten, addLegsel } = useNestData();
  const [linkType, setLinkType] = useState(1); // standaard: vervolglegsel
  const [saving, setSaving] = useState(false);

  const seizoen = seizoenen.find(s => s.id === seizoenId);
  const nest = seizoen ? nesten.find(n => n.id === seizoen.nest_id) : null;

  // Hoogste bestaande volgnummer voor dit seizoen
  const volgendVolgnummer = useMemo(() => {
    const bestaande = legsels.filter(l => l.nest_seizoen_id === seizoenId);
    return bestaande.length > 0
      ? Math.max(...bestaande.map(l => l.volgnummer)) + 1
      : 1;
  }, [legsels, seizoenId]);

  async function handleSave() {
    setSaving(true);
    try {
      await addLegsel({
        nest_seizoen_id: seizoenId,
        volgnummer: volgendVolgnummer,
        link_type: linkType,
      });
      navigate(`/nest/${nest?.id || ''}`);
    } finally {
      setSaving(false);
    }
  }

  const nestId = nest?.id;

  return (
    <div className="page nieuw-nest-page">
      <div className="nieuw-nest-header">
        <button className="project-back" onClick={() => navigate(`/nest/${nestId}`)}>
          ‹ {t('btn_back')}
        </button>
      </div>

      <div className="section">
        <div className="section-content">
          <div className="form-group">
            <label>{t('nest_link_type')}</label>
            <select value={linkType} onChange={e => setLinkType(Number(e.target.value))}>
              {LINK_TYPE_CODES.map(c => (
                <option key={c.code} value={c.code}>{c.code} — {c.nl}</option>
              ))}
            </select>
          </div>
          <p className="admin-hint">{t('nest_legsel_volgnummer_hint', { nr: volgendVolgnummer })}</p>
        </div>
      </div>

      <div className="nieuw-nest-acties">
        <button className="btn-secondary" onClick={() => navigate(`/nest/${nestId}`)} disabled={saving}>
          {t('btn_cancel')}
        </button>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? t('btn_saving') : t('btn_save')}
        </button>
      </div>
    </div>
  );
}
