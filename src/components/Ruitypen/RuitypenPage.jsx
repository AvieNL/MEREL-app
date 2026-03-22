import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRole } from '../../hooks/useRole';
import { getRuitypenConfig, saveRuitypenConfig, RUITYPE_TYPES, DEFAULT_RUITYPE_CONFIG } from '../../hooks/useRuitypen';
import '../Admin/AdminPage.css';

export default function RuitypenPage() {
  const { isRealAdmin } = useRole();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [ruitypen, setRuitypen] = useState(() => getRuitypenConfig());
  const [saved, setSaved] = useState(false);

  if (!isRealAdmin) {
    navigate('/admin');
    return null;
  }

  function updateEntry(type, seizoen, index, field, value) {
    setRuitypen(prev => {
      const entries = [...prev[type][seizoen]];
      entries[index] = { ...entries[index], [field]: value };
      return { ...prev, [type]: { ...prev[type], [seizoen]: entries } };
    });
  }

  function addEntry(type, seizoen) {
    setRuitypen(prev => ({
      ...prev,
      [type]: { ...prev[type], [seizoen]: [...prev[type][seizoen], { cond: '', val: '' }] },
    }));
  }

  function removeEntry(type, seizoen, index) {
    setRuitypen(prev => {
      const entries = prev[type][seizoen].filter((_, i) => i !== index);
      return { ...prev, [type]: { ...prev[type], [seizoen]: entries } };
    });
  }

  function handleSave() {
    saveRuitypenConfig(ruitypen);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    if (window.confirm(t('admin_rui_confirm_reset'))) {
      setRuitypen(DEFAULT_RUITYPE_CONFIG);
      saveRuitypenConfig(DEFAULT_RUITYPE_CONFIG);
    }
  }

  return (
    <div className="page admin-page">
      <div className="admin-rui-header">
        <h2>{t('admin_ruitypes_title')}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="admin-btn" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} onClick={handleReset}>{t('admin_btn_reset')}</button>
          <button className="admin-btn" onClick={handleSave}>{t('admin_btn_save')}</button>
        </div>
      </div>
      {saved && <p className="admin-success">{t('admin_rui_saved')}</p>}

      {RUITYPE_TYPES.map(type => (
        <div key={type} className="section admin-rui-type" style={{ borderTop: 'none' }}>
          <h4 className="admin-rui-type-title">{t('admin_rui_type', { type })}</h4>
          <div className="admin-rui-seizoenen">
            {['voorjaar', 'najaar'].map(seizoen => (
              <div key={seizoen} className="admin-rui-seizoen">
                <div className="admin-rui-seizoen-header">
                  <span className="admin-rui-seizoen-label">{seizoen === 'voorjaar' ? t('admin_rui_spring') : t('admin_rui_autumn')}</span>
                  <button className="admin-rui-add" onClick={() => addEntry(type, seizoen)}>{t('admin_rui_add_row')}</button>
                </div>
                {ruitypen[type][seizoen].map((entry, i) => (
                  <div key={i} className="admin-rui-entry">
                    <input
                      className="admin-rui-input admin-rui-input--cond"
                      placeholder={t('admin_rui_condition_placeholder')}
                      value={entry.cond}
                      onChange={e => updateEntry(type, seizoen, i, 'cond', e.target.value)}
                    />
                    <span className="admin-rui-arrow">→</span>
                    <input
                      className="admin-rui-input admin-rui-input--val"
                      placeholder={t('admin_rui_age_placeholder')}
                      value={entry.val}
                      onChange={e => updateEntry(type, seizoen, i, 'val', e.target.value)}
                    />
                    {ruitypen[type][seizoen].length > 1 && (
                      <button className="admin-rui-remove" onClick={() => removeEntry(type, seizoen, i)} aria-label={t('admin_rui_remove_row')}>×</button>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
