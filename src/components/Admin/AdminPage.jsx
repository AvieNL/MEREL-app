import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../hooks/useRole';
import { supabase } from '../../lib/supabase';
import { getRuitypenConfig, saveRuitypenConfig, RUITYPE_TYPES, DEFAULT_RUITYPE_CONFIG } from '../../hooks/useRuitypen';
import './AdminPage.css';

const ROLLEN = ['ringer', 'viewer', 'admin'];

export default function AdminPage() {
  const { user } = useAuth();
  const { isRealAdmin } = useRole();
  const navigate = useNavigate();
  const { t } = useTranslation(['common', 'errors']);
  const [gebruikers, setGebruikers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);
  const [ruitypen, setRuitypen] = useState(() => getRuitypenConfig());
  const [ruiSaved, setRuiSaved] = useState(false);

  const ROL_LABEL = {
    admin: t('role_admin'),
    ringer: t('role_ringer'),
    viewer: t('role_viewer'),
  };

  function updateRuiEntry(type, seizoen, index, field, value) {
    setRuitypen(prev => {
      const entries = [...prev[type][seizoen]];
      entries[index] = { ...entries[index], [field]: value };
      return { ...prev, [type]: { ...prev[type], [seizoen]: entries } };
    });
  }

  function addRuiEntry(type, seizoen) {
    setRuitypen(prev => ({
      ...prev,
      [type]: { ...prev[type], [seizoen]: [...prev[type][seizoen], { cond: '', val: '' }] },
    }));
  }

  function removeRuiEntry(type, seizoen, index) {
    setRuitypen(prev => {
      const entries = prev[type][seizoen].filter((_, i) => i !== index);
      return { ...prev, [type]: { ...prev[type], [seizoen]: entries } };
    });
  }

  function saveRuitypen() {
    saveRuitypenConfig(ruitypen);
    setRuiSaved(true);
    setTimeout(() => setRuiSaved(false), 2000);
  }

  function resetRuitypen() {
    if (window.confirm(t('admin_rui_confirm_reset'))) {
      setRuitypen(DEFAULT_RUITYPE_CONFIG);
      saveRuitypenConfig(DEFAULT_RUITYPE_CONFIG);
    }
  }

  useEffect(() => {
    if (!isRealAdmin) {
      navigate('/');
      return;
    }
    loadGebruikers();
  }, [isRealAdmin]);  // eslint-disable-line react-hooks/exhaustive-deps

  async function loadGebruikers() {
    setLoading(true);
    setError('');

    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true });

    if (err) {
      setError(t('errors:admin_load_error'));
      setLoading(false);
      return;
    }

    const userIds = data.map(p => p.id);
    const { data: vangstRows } = await supabase
      .from('vangsten')
      .select('user_id')
      .in('user_id', userIds);

    const countByUser = {};
    for (const v of vangstRows || []) {
      countByUser[v.user_id] = (countByUser[v.user_id] || 0) + 1;
    }

    const metCounts = data.map(p => ({ ...p, vangsten_count: countByUser[p.id] ?? 0 }));
    setGebruikers(metCounts);
    setLoading(false);
  }

  async function changeRol(profileId, newRol) {
    if (profileId === user.id) return;
    setSavingId(profileId);
    const { error: err } = await supabase
      .from('profiles')
      .update({ rol: newRol, updated_at: new Date().toISOString() })
      .eq('id', profileId);
    if (!err) {
      setGebruikers(prev =>
        prev.map(g => g.id === profileId ? { ...g, rol: newRol } : g)
      );
    }
    setSavingId(null);
  }

  if (!isRealAdmin) return null;

  return (
    <div className="page admin-page">
      <h2>{t('admin_title')}</h2>

      {loading && <div className="admin-status">{t('admin_loading_users')}</div>}

      {error && (
        <div className="admin-error">
          <strong>Fout:</strong> {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="section">
            <h3>{t('admin_users', { count: gebruikers.length })}</h3>
            <div className="admin-users">
              {gebruikers.map(g => (
                <div
                  key={g.id}
                  className={`admin-user-card${g.id === user.id ? ' is-self' : ''}`}
                >
                  <div className="admin-user-info">
                    <div className="admin-user-name">
                      {g.ringer_naam || <em>{t('admin_name_not_set')}</em>}
                      {g.id === user.id && (
                        <span className="admin-badge admin-badge--self">{t('admin_you')}</span>
                      )}
                    </div>
                    <div className="admin-user-meta">
                      <span className="admin-user-email-inline">{g.email || '–'}</span>
                      {g.ringer_nummer && <span>· #{g.ringer_nummer}</span>}
                      <span className="admin-count">· {t('admin_catches', { count: g.vangsten_count })}</span>
                    </div>
                  </div>

                  <div className="admin-user-rol">
                    {g.id === user.id ? (
                      <span className="rol-badge">
                        {ROL_LABEL[g.rol] || g.rol}
                      </span>
                    ) : (
                      <select
                        value={g.rol || 'ringer'}
                        onChange={e => changeRol(g.id, e.target.value)}
                        disabled={savingId === g.id}
                        className="rol-select"
                        aria-label={t('admin_aria_role', { name: g.ringer_naam || g.email })}
                      >
                        {ROLLEN.map(r => (
                          <option key={r} value={r}>{ROL_LABEL[r]}</option>
                        ))}
                      </select>
                    )}
                    {savingId === g.id && (
                      <span className="admin-saving">{t('admin_saving')}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <h3>{t('admin_invite_title')}</h3>
            <div className="section-content">
              <p className="admin-hint">{t('admin_invite_hint')}</p>
              <p className="admin-hint">
                <strong>{t('admin_role_explanation')}</strong><br />
                <strong>{t('role_ringer')}</strong> — {t('admin_role_ringer_desc').replace(/^Ringer — |^Beringer — |^Ringer — /, '')}<br />
                <strong>{t('role_viewer')}</strong> — {t('admin_role_viewer_desc').replace(/^Viewer — |^Betrachter — /, '')}<br />
                <strong>{t('role_admin')}</strong> — {t('admin_role_admin_desc').replace(/^Admin — /, '')}
              </p>
            </div>
          </div>

          {/* ── Ruitypen editor ── */}
          <div className="section admin-rui-card">
            <div className="admin-rui-header">
              <h3>{t('admin_ruitypes_title')}</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="admin-btn" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} onClick={resetRuitypen}>{t('admin_btn_reset')}</button>
                <button className="admin-btn" onClick={saveRuitypen}>{t('admin_btn_save')}</button>
              </div>
            </div>
            {ruiSaved && <p className="admin-success">{t('admin_rui_saved')}</p>}
            {RUITYPE_TYPES.map(type => (
              <div key={type} className="admin-rui-type">
                <h4 className="admin-rui-type-title">{t('admin_rui_type', { type })}</h4>
                <div className="admin-rui-seizoenen">
                  {['voorjaar', 'najaar'].map(seizoen => (
                    <div key={seizoen} className="admin-rui-seizoen">
                      <div className="admin-rui-seizoen-header">
                        <span className="admin-rui-seizoen-label">{seizoen === 'voorjaar' ? t('admin_rui_spring') : t('admin_rui_autumn')}</span>
                        <button className="admin-rui-add" onClick={() => addRuiEntry(type, seizoen)}>{t('admin_rui_add_row')}</button>
                      </div>
                      {ruitypen[type][seizoen].map((entry, i) => (
                        <div key={i} className="admin-rui-entry">
                          <input
                            className="admin-rui-input admin-rui-input--cond"
                            placeholder={t('admin_rui_condition_placeholder')}
                            value={entry.cond}
                            onChange={e => updateRuiEntry(type, seizoen, i, 'cond', e.target.value)}
                          />
                          <span className="admin-rui-arrow">→</span>
                          <input
                            className="admin-rui-input admin-rui-input--val"
                            placeholder={t('admin_rui_age_placeholder')}
                            value={entry.val}
                            onChange={e => updateRuiEntry(type, seizoen, i, 'val', e.target.value)}
                          />
                          {ruitypen[type][seizoen].length > 1 && (
                            <button className="admin-rui-remove" onClick={() => removeRuiEntry(type, seizoen, i)} aria-label={t('admin_rui_remove_row')}>×</button>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
