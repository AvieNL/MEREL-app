import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../hooks/useRole';
import { supabase } from '../../lib/supabase';
import { getRuitypenConfig, saveRuitypenConfig, RUITYPE_TYPES, DEFAULT_RUITYPE_CONFIG } from '../../hooks/useRuitypen';
import './AdminPage.css';

const ROLLEN = ['ringer', 'ringer+', 'viewer', 'admin'];
const NEST_ROLLEN = ['', 'nestonderzoeker', 'kijker'];

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
    admin:    t('role_admin'),
    'ringer+': t('role_ringer_plus'),
    ringer:   t('role_ringer'),
    viewer:   t('role_viewer'),
  };

  const NEST_ROL_LABEL = {
    '':               t('role_nest_none'),
    nestonderzoeker:  t('role_nestonderzoeker'),
    kijker:           t('role_nest_kijker'),
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

    const vangstCountMap = {};
    const nestCountMap = {};
    const nestbezoekCountMap = {};

    if (userIds.length > 0) {
      await Promise.all(userIds.map(async uid => {
        const [{ count: v }, { count: n }, { count: nb }] = await Promise.all([
          supabase.from('vangsten').select('*', { count: 'exact', head: true }).eq('user_id', uid).is('deleted_at', null),
          supabase.from('nest').select('*', { count: 'exact', head: true }).eq('aangemaakt_door', uid),
          supabase.from('nestbezoek').select('*', { count: 'exact', head: true }).eq('aangemaakt_door', uid),
        ]);
        vangstCountMap[uid] = v ?? 0;
        nestCountMap[uid] = n ?? 0;
        nestbezoekCountMap[uid] = nb ?? 0;
      }));
    }

    const metCounts = data.map(p => ({
      ...p,
      vangsten_count: vangstCountMap[p.id] ?? 0,
      nest_count: nestCountMap[p.id] ?? 0,
      nestbezoek_count: nestbezoekCountMap[p.id] ?? 0,
    }));
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

  async function changeNestRol(profileId, newNestRol) {
    if (profileId === user.id) return;
    setSavingId(profileId + '-nest');
    const { error: err } = await supabase
      .from('profiles')
      .update({ nestkast_rol: newNestRol || null, updated_at: new Date().toISOString() })
      .eq('id', profileId);
    if (!err) {
      setGebruikers(prev =>
        prev.map(g => g.id === profileId ? { ...g, nestkast_rol: newNestRol || null } : g)
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
        <div className="admin-error" role="alert">
          {error}
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
                      {g.nest_count > 0 && <span className="admin-count">· {t('admin_nests', { count: g.nest_count })}</span>}
                      {g.nestbezoek_count > 0 && <span className="admin-count">· {t('admin_nestbezoeken', { count: g.nestbezoek_count })}</span>}
                    </div>
                  </div>

                  <div className="admin-user-rollen">
                    <div className="admin-user-rol">
                      <span className="admin-rol-label">{t('admin_col_ring_rol')}</span>
                      {g.id === user.id ? (
                        <span className="rol-badge rol-badge--ring">{ROL_LABEL[g.rol] || g.rol}</span>
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
                      {savingId === g.id && <span className="admin-saving">{t('admin_saving')}</span>}
                    </div>
                    <div className="admin-user-rol">
                      <span className="admin-rol-label">{t('admin_col_nest_rol')}</span>
                      {g.rol === 'admin' ? (
                        <span className="rol-badge rol-badge--nest">{t('nestonderzoek_rol_admin')}</span>
                      ) : g.id === user.id ? (
                        <span className="rol-badge rol-badge--nest">{NEST_ROL_LABEL[g.nestkast_rol || ''] || '–'}</span>
                      ) : (
                        <select
                          value={g.nestkast_rol || ''}
                          onChange={e => changeNestRol(g.id, e.target.value)}
                          disabled={savingId === g.id + '-nest'}
                          className="rol-select"
                          aria-label={t('admin_aria_nest_role', { name: g.ringer_naam || g.email })}
                        >
                          {NEST_ROLLEN.map(r => (
                            <option key={r} value={r}>{NEST_ROL_LABEL[r]}</option>
                          ))}
                        </select>
                      )}
                      {savingId === g.id + '-nest' && <span className="admin-saving">{t('admin_saving')}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <h3>{t('admin_invite_title')}</h3>
            <div className="section-content">
              <p className="admin-hint">{t('admin_invite_hint')}</p>

              <p className="admin-hint"><strong className="admin-module-label admin-module-label--ring">{t('admin_role_explanation')}</strong></p>
              <div className="admin-role-list">
                {[
                  ['role_ringer',      'admin_role_ringer_desc'],
                  ['role_ringer_plus', 'admin_role_ringer_plus_desc'],
                  ['role_viewer',      'admin_role_viewer_desc'],
                  ['role_admin',       'admin_role_admin_desc'],
                ].map(([roleKey, descKey]) => (
                  <div key={roleKey} className="admin-role-row">
                    <span className="admin-role-name admin-role-name--ring">{t(roleKey)}</span>
                    <span className="admin-role-desc">{t(descKey)}</span>
                  </div>
                ))}
              </div>

              <p className="admin-hint" style={{ marginTop: '1rem' }}><strong className="admin-module-label admin-module-label--nest">{t('admin_nest_role_explanation')}</strong></p>
              <div className="admin-role-list">
                {[
                  ['role_admin',          'admin_nest_role_admin_desc'],
                  ['role_nestonderzoeker', 'admin_nest_role_nestonderzoeker_desc'],
                  ['role_nest_kijker',     'admin_nest_role_kijker_desc'],
                  ['role_nest_none',       'admin_nest_role_none_desc'],
                ].map(([roleKey, descKey]) => (
                  <div key={roleKey} className="admin-role-row">
                    <span className="admin-role-name admin-role-name--nest">{t(roleKey)}</span>
                    <span className="admin-role-desc">{t(descKey)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Referentiebibliotheek ── */}
          <div className="section">
            <h3>{t('admin_referentiebibliotheek')}</h3>
            <div className="section-content">
              <p className="admin-hint">{t('admin_referentiebibliotheek_desc')}</p>
              <button className="btn-primary" onClick={() => navigate('/referentiebibliotheek')}>
                {t('admin_referentiebibliotheek_link')}
              </button>
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
