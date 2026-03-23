import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNestData } from '../../hooks/useNestData';
import { LINK_TYPE_CODES } from '../../data/sovon-codes';
import './NieuwNestPage.css';

const HUIDIG_JAAR = new Date().getFullYear();

export default function NieuwLegselPage() {
  const { nestId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { legsels, nesten, addLegsel } = useNestData();
  const [saving, setSaving] = useState(false);

  const nest = nesten.find(n => n.id === nestId);

  // Hoogste bestaande volgnummer voor dit nest + huidig jaar
  const { volgendVolgnummer, defaultLinkType } = useMemo(() => {
    const bestaande = legsels.filter(l => l.nest_id === nestId && l.jaar === HUIDIG_JAAR);
    return {
      volgendVolgnummer: bestaande.length > 0 ? Math.max(...bestaande.map(l => l.volgnummer)) + 1 : 1,
      defaultLinkType: bestaande.length > 0 ? 1 : 0,
    };
  }, [legsels, nestId]);

  const [linkType, setLinkType] = useState(() => defaultLinkType);

  async function handleSave() {
    setSaving(true);
    try {
      await addLegsel({
        nest_id: nestId,
        jaar: HUIDIG_JAAR,
        volgnummer: volgendVolgnummer,
        link_type: linkType,
      });
      navigate(`/nest/${nestId}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page nieuw-nest-page">
      <div className="nieuw-nest-header">
        <button className="btn-secondary page-back" onClick={() => navigate(`/nest/${nestId}`)}>
          {t('btn_back')}
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
