import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRole } from '../../hooks/useRole';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import LocatiePicker from '../Nieuw/LocatiePicker';
import './ProjectenPage.css';

const FORM_DEFAULT = { naam: '', locatie: '', nummer: '', vasteLocatie: false, plaatscode: 'NL--', googlePlaats: '', lat: '', lon: '', nauwkCoord: '0' };
const AUPI_TITLE = 'ActingUserProjectID: jouw persoonlijk lidnummer voor dit project in GRIEL. Te vinden via: Mijn administratie → Mijn projecten → klik op het + naast het project.';

// Read-only ledenlijst op de projectkaart
function ProjectMembers({ project }) {
  const { user } = useAuth();
  const { t } = useTranslation(['common', 'errors']);
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState([]);

  const ROL_LABELS = {
    viewer: t('role_viewer_label'),
    ringer: t('role_ringer_label'),
    admin: t('role_admin_label'),
  };

  const isOwner = project.user_id === user?.id;
  if (!isOwner && !project.shared) return null;

  async function loadMembers() {
    const { data: memberData } = await supabase.rpc('get_project_members', { p_project_id: project.id });
    const { data: aupiData } = await supabase
      .from('project_members')
      .select('user_id, aupi')
      .eq('project_id', project.id);
    const aupiMap = {};
    (aupiData || []).forEach(r => { aupiMap[r.user_id] = r.aupi || ''; });
    setMembers((memberData || []).map(m => ({
      ...m,
      aupi: m.is_owner ? (project.aupi || '') : (aupiMap[m.user_id] || ''),
    })));
  }

  useEffect(() => {
    if (open) loadMembers();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="project-members">
      <button className="project-members-toggle" onClick={() => setOpen(o => !o)}>
        {open ? '▾' : '▸'} {open ? t('project_members_label') : `${t('project_members_label')}${members.length > 0 ? ` (${members.length})` : ''}`}
      </button>
      {open && (
        <div className="project-members-panel">
          {members.length === 0 ? (
            <p className="project-members-empty">{t('project_no_members_added')}</p>
          ) : (
            members.map(m => (
              <div key={m.user_id} className="project-member-row">
                <span className="project-member-name">
                  {m.ringer_naam || m.email}
                  {m.email && m.ringer_naam && (
                    <span className="project-member-email">{m.email}</span>
                  )}
                </span>
                <span className="project-member-aupi">
                  <abbr className="project-member-aupi-label" title={AUPI_TITLE}>AUPI</abbr>
                  <span className="project-member-aupi-value">{m.aupi || '—'}</span>
                </span>
                <span className="project-member-badge">
                  {m.is_owner ? t('project_owner') : (ROL_LABELS[m.rol] || m.rol)}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function ProjectenPage({ projects, onAdd, onUpdate, onDelete, onRenameProject, onAupiSaved }) {
  const { canAdd, canEdit, canDelete } = useRole();
  const { user } = useAuth();
  const { t } = useTranslation(['common', 'errors']);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [formError, setFormError] = useState('');

  const ROL_LABELS = {
    viewer: t('role_viewer_label'),
    ringer: t('role_ringer_label'),
    admin: t('role_admin_label'),
  };

  const [addForm, setAddForm] = useState(FORM_DEFAULT);
  const setAdd = (field, value) => setAddForm(f => ({ ...f, [field]: value }));

  const [editForm, setEditForm] = useState(FORM_DEFAULT);
  const setEdit = (field, value) => setEditForm(f => ({ ...f, [field]: value }));

  const [editMembers, setEditMembers] = useState([]);
  const MEMBER_FORM_DEFAULT = { email: '', aupi: '', loading: false, error: '' };
  const [memberForm, setMemberForm] = useState(MEMBER_FORM_DEFAULT);
  const setMember = (field, value) => setMemberForm(f => ({ ...f, [field]: value }));

  function nummerExists(nummer, excludeId = null) {
    const n = nummer.trim();
    if (!n) return false;
    return projects.some(p => p.id !== excludeId && p.nummer === n);
  }

  function handleAdd(e) {
    e.preventDefault();
    if (!addForm.naam.trim()) return;
    if (nummerExists(addForm.nummer)) {
      setFormError(t('errors:project_number_exists', { number: addForm.nummer.trim() }));
      return;
    }
    setFormError('');
    onAdd({
      naam: addForm.naam.trim(), locatie: addForm.locatie.trim(), nummer: addForm.nummer.trim(),
      vaste_locatie: addForm.vasteLocatie,
      plaatscode: addForm.vasteLocatie ? addForm.plaatscode : '',
      google_plaats: addForm.vasteLocatie ? addForm.googlePlaats : '',
      lat: addForm.vasteLocatie ? addForm.lat : '',
      lon: addForm.vasteLocatie ? addForm.lon : '',
      nauwk_coord: addForm.vasteLocatie ? addForm.nauwkCoord : '0',
    });
    setAddForm(FORM_DEFAULT);
    setShowForm(false);
  }

  async function startEdit(p) {
    setEditId(p.id);
    setEditForm({
      naam: p.naam,
      locatie: p.locatie || '',
      nummer: p.nummer || '',
      vasteLocatie: p.vaste_locatie || false,
      plaatscode: p.plaatscode || 'NL--',
      googlePlaats: p.google_plaats || '',
      lat: p.lat || '',
      lon: p.lon || '',
      nauwkCoord: p.nauwk_coord || '0',
    });
    setMemberForm(MEMBER_FORM_DEFAULT);
    setFormError('');

    const { data: memberData } = await supabase.rpc('get_project_members', { p_project_id: p.id });
    const { data: aupiData } = await supabase
      .from('project_members')
      .select('user_id, aupi')
      .eq('project_id', p.id);
    const aupiMap = {};
    (aupiData || []).forEach(r => { aupiMap[r.user_id] = r.aupi || ''; });
    setEditMembers((memberData || []).map(m => ({
      ...m,
      aupi: m.is_owner ? (p.aupi || '') : (aupiMap[m.user_id] || ''),
    })));
  }

  function cancelEdit() {
    setEditId(null);
    setEditMembers([]);
    setFormError('');
  }

  async function saveEdit(p) {
    const newNaam = editForm.naam.trim();
    if (!newNaam) return;
    if (nummerExists(editForm.nummer, p.id)) {
      setFormError(t('errors:project_number_exists', { number: editForm.nummer.trim() }));
      return;
    }
    setFormError('');
    if (newNaam !== p.naam && onRenameProject) onRenameProject(p.naam, newNaam);
    const ownerAupi = editMembers.find(m => m.is_owner)?.aupi || '';
    onUpdate(p.id, {
      naam: newNaam, locatie: editForm.locatie.trim(), nummer: editForm.nummer.trim(),
      vaste_locatie: editForm.vasteLocatie,
      plaatscode: editForm.vasteLocatie ? editForm.plaatscode : '',
      google_plaats: editForm.vasteLocatie ? editForm.googlePlaats : '',
      lat: editForm.vasteLocatie ? editForm.lat : '',
      lon: editForm.vasteLocatie ? editForm.lon : '',
      nauwk_coord: editForm.vasteLocatie ? editForm.nauwkCoord : '0',
      aupi: ownerAupi,
    });

    const aupiErrors = [];
    for (const m of editMembers.filter(m => !m.is_owner)) {
      const { error: aupiErr } = await supabase.rpc('update_member_aupi', {
        p_project_id: p.id,
        p_user_id: m.user_id,
        p_aupi: m.aupi || null,
      });
      if (aupiErr) {
        console.error('AUPI opslaan mislukt:', aupiErr, { project_id: p.id, user_id: m.user_id });
        aupiErrors.push(`${m.ringer_naam || m.email}: ${aupiErr.message}`);
      }
    }
    if (aupiErrors.length > 0) {
      setFormError(t('errors:project_aupi_save_failed', { errors: aupiErrors.join('; ') }));
      return;
    }
    if (onAupiSaved) onAupiSaved();
    setEditId(null);
    setEditMembers([]);
    setMemberForm(MEMBER_FORM_DEFAULT);
  }

  async function addEditMember(projectId) {
    const trimmed = memberForm.email.trim().toLowerCase();
    if (!trimmed) return;
    setMember('loading', true);
    setMember('error', '');
    try {
      const { data: userId, error: lookupErr } = await supabase.rpc('lookup_user_id', { p_email: trimmed });
      if (lookupErr || !userId) throw new Error(t('errors:project_user_not_found'));
      if (userId === user.id) throw new Error(t('errors:project_cannot_add_self'));
      if (editMembers.some(m => m.user_id === userId)) throw new Error(t('errors:project_already_member'));

      const { error: insertErr } = await supabase
        .from('project_members')
        .insert({ project_id: projectId, user_id: userId, rol: 'viewer' });
      if (insertErr) {
        if (insertErr.code === '23505') throw new Error(t('errors:project_already_member'));
        throw insertErr;
      }

      const { data: memberData } = await supabase.rpc('get_project_members', { p_project_id: projectId });
      const newMember = memberData?.find(m => m.user_id === userId);
      if (newMember) {
        setEditMembers(prev => [...prev, { ...newMember, aupi: memberForm.aupi.trim() }]);
      }
      setMemberForm(MEMBER_FORM_DEFAULT);
    } catch (e) {
      setMember('error', e.message);
    } finally {
      setMember('loading', false);
    }
  }

  async function removeEditMember(projectId, userId) {
    await supabase.from('project_members').delete()
      .eq('project_id', projectId)
      .eq('user_id', userId);
    setEditMembers(prev => prev.filter(m => m.user_id !== userId));
  }

  function updateEditMemberField(userId, field, value) {
    setEditMembers(prev => prev.map(m => m.user_id === userId ? { ...m, [field]: value } : m));
  }

  async function changeEditRole(projectId, userId, newRol) {
    await supabase.rpc('update_member_role', {
      p_project_id: projectId,
      p_user_id: userId,
      p_rol: newRol,
    });
    updateEditMemberField(userId, 'rol', newRol);
  }

  return (
    <div className="page projecten-page">
      <div className="page-top">
        <h2>{t('projects_title')}</h2>
        {canAdd && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? t('projects_cancel') : t('projects_add')}
          </button>
        )}
      </div>

      {showForm && (
        <form className="section" onSubmit={handleAdd}>
          <div className="form-group">
            <label>{t('project_name_label')}</label>
            <input type="text" value={addForm.naam} onChange={e => setAdd('naam', e.target.value)} placeholder={t('project_name_placeholder')} />
          </div>
          <div className="form-group">
            <label>{t('project_location_label')}</label>
            <input type="text" value={addForm.locatie} onChange={e => setAdd('locatie', e.target.value)} placeholder={t('project_location_placeholder')} />
          </div>
          <div className="form-group">
            <label>{t('project_number_label')}</label>
            <input type="text" value={addForm.nummer} onChange={e => setAdd('nummer', e.target.value)} placeholder={t('project_number_placeholder')} />
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input type="checkbox" checked={addForm.vasteLocatie} onChange={e => setAdd('vasteLocatie', e.target.checked)} />
              {t('project_fixed_location')}
            </label>
          </div>
          {addForm.vasteLocatie && (
            <div className="project-locatie-velden">
              <div className="form-group">
                <label>{t('project_place_code')}</label>
                <input type="text" value={addForm.plaatscode} onChange={e => setAdd('plaatscode', e.target.value)} placeholder="bijv. NL--" />
              </div>
              <div className="form-group">
                <label>{t('project_place_name')}</label>
                <input type="text" value={addForm.googlePlaats} onChange={e => setAdd('googlePlaats', e.target.value)} placeholder={t('project_location_placeholder')} />
              </div>
              <LocatiePicker lat={addForm.lat} lon={addForm.lon} onChange={(newLat, newLon) => setAddForm(f => ({ ...f, lat: newLat, lon: newLon }))} />
            </div>
          )}
          {formError && <p className="project-members-error">{formError}</p>}
          <button type="submit" className="btn-success" style={{ width: '100%' }}>
            {t('project_add_btn')}
          </button>
        </form>
      )}

      <div className="project-list">
        {projects.length === 0 ? (
          <div className="empty-state">{t('projects_empty')}</div>
        ) : (
          projects.map(p => {
            const isOwn = p.user_id === user?.id;
            const isShared = p.shared === true;
            return (
              <div key={p.id} className={`project-card${isShared ? ' project-card--shared' : ''}`}>
                {editId === p.id ? (
                  <div className="project-edit">
                    <div className="form-group">
                      <label>{t('project_edit_name')}</label>
                      <input type="text" value={editForm.naam} onChange={e => setEdit('naam', e.target.value)} />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>{t('project_edit_location')}</label>
                        <input type="text" value={editForm.locatie} onChange={e => setEdit('locatie', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>{t('project_edit_number')}</label>
                        <input type="text" value={editForm.nummer} onChange={e => setEdit('nummer', e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input type="checkbox" checked={editForm.vasteLocatie} onChange={e => setEdit('vasteLocatie', e.target.checked)} />
                        {t('project_fixed_location_short')}
                      </label>
                    </div>
                    {editForm.vasteLocatie && (
                      <div className="project-locatie-velden">
                        <div className="form-row">
                          <div className="form-group">
                            <label>{t('project_place_code')}</label>
                            <input type="text" value={editForm.plaatscode} onChange={e => setEdit('plaatscode', e.target.value)} />
                          </div>
                          <div className="form-group">
                            <label>{t('project_place_name')}</label>
                            <input type="text" value={editForm.googlePlaats} onChange={e => setEdit('googlePlaats', e.target.value)} />
                          </div>
                        </div>
                        <LocatiePicker
                          lat={editForm.lat} lon={editForm.lon}
                          onChange={(newLat, newLon) => setEditForm(f => ({ ...f, lat: newLat, lon: newLon }))}
                        />
                      </div>
                    )}

                    {/* Leden & AUPIs */}
                    <div className="edit-members-section">
                      <label className="edit-members-label">{t('project_members_label')}</label>
                      <div className="project-members-panel">
                        {editMembers.length === 0 ? (
                          <p className="project-members-empty">{t('project_no_members')}</p>
                        ) : (
                          editMembers.map(m => (
                            <div key={m.user_id} className="project-member-row">
                              <span className="project-member-name">
                                {m.ringer_naam || m.email}
                                {m.email && m.ringer_naam && (
                                  <span className="project-member-email">{m.email}</span>
                                )}
                              </span>
                              <span className="project-member-aupi">
                                <abbr className="project-member-aupi-label" title={AUPI_TITLE}>AUPI</abbr>
                                <input
                                  className="project-member-aupi-input"
                                  type="text"
                                  inputMode="numeric"
                                  maxLength={6}
                                  placeholder="—"
                                  value={m.aupi}
                                  onChange={e => updateEditMemberField(m.user_id, 'aupi', e.target.value)}
                                />
                              </span>
                              {m.is_owner ? (
                                <span className="project-member-badge">{t('project_owner')}</span>
                              ) : (
                                <span className="project-member-actions">
                                  <select
                                    className="project-member-rol-select"
                                    value={m.rol || 'viewer'}
                                    onChange={e => changeEditRole(p.id, m.user_id, e.target.value)}
                                  >
                                    <option value="viewer">{t('role_viewer_label')}</option>
                                    <option value="ringer">{t('role_ringer_label')}</option>
                                    <option value="admin">{t('role_admin_label')}</option>
                                  </select>
                                  <button
                                    className="project-member-remove"
                                    onClick={() => removeEditMember(p.id, m.user_id)}
                                    title={t('project_remove_member_aria')}
                                    aria-label={t('project_remove_member_aria')}
                                  >✕</button>
                                </span>
                              )}
                            </div>
                          ))
                        )}
                        <div className="project-members-add">
                          <input
                            type="email"
                            value={memberForm.email}
                            onChange={e => setMember('email', e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addEditMember(p.id)}
                            placeholder={t('project_email_placeholder')}
                          />
                          <input
                            className="project-member-aupi-input"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="AUPI"
                            value={memberForm.aupi}
                            onChange={e => setMember('aupi', e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addEditMember(p.id)}
                            title={AUPI_TITLE}
                          />
                          <button
                            className="btn-success btn-sm"
                            onClick={() => addEditMember(p.id)}
                            disabled={memberForm.loading || !memberForm.email.trim()}
                          >
                            {memberForm.loading ? t('project_member_loading') : t('project_add_member')}
                          </button>
                        </div>
                        {memberForm.error && <p className="project-members-error">{memberForm.error}</p>}
                      </div>
                    </div>

                    {formError && editId === p.id && (
                      <p className="project-members-error">{formError}</p>
                    )}
                    <div className="project-edit-actions">
                      <button type="button" className="btn-success btn-sm" onClick={() => saveEdit(p)}>
                        {t('project_save')}
                      </button>
                      <button type="button" className="btn-secondary btn-sm" onClick={cancelEdit}>
                        {t('project_cancel_edit')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="project-header">
                      <div className="project-info">
                        <strong>{p.naam}</strong>
                        <span className="project-meta">
                          {p.nummer && <span className="project-nummer">#{p.nummer}</span>}
                          {p.locatie && <span className="project-loc">{p.locatie}</span>}
                          {p.vaste_locatie && p.lat && p.lon && (
                            <span className="project-loc project-loc--coords">📍 {parseFloat(p.lat).toFixed(4)}, {parseFloat(p.lon).toFixed(4)}</span>
                          )}
                          {isShared && <span className="project-shared-badge">{t('project_shared')}</span>}
                          <button
                            className={`btn-secondary btn-sm badge ${p.actief ? 'badge-success' : ''}`}
                            onClick={() => canEdit && isOwn && onUpdate(p.id, { actief: !p.actief })}
                            disabled={!canEdit || !isOwn}
                          >
                            {p.actief ? t('project_active') : t('project_inactive')}
                          </button>
                        </span>
                      </div>
                      {confirmDeleteId === p.id ? (
                        <div className="project-confirm">
                          {t('project_delete')}
                          <button className="btn-danger btn-sm" onClick={() => { onDelete(p.id); setConfirmDeleteId(null); }}>{t('project_yes')}</button>
                          <button className="btn-secondary btn-sm" onClick={() => setConfirmDeleteId(null)}>{t('project_no')}</button>
                        </div>
                      ) : (
                        <div className="project-actions">
                          {canEdit && isOwn && (
                            <button className="icon-edit-btn" onClick={() => startEdit(p)} title={t('project_edit_aria')}>✎</button>
                          )}
                          {canDelete && isOwn && (
                            <button className="icon-delete-btn" onClick={() => setConfirmDeleteId(p.id)} title={t('project_delete_aria')} aria-label={t('project_delete_aria')}>✕</button>
                          )}
                        </div>
                      )}
                    </div>
                    <ProjectMembers project={p} />
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
