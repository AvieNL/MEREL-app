import { useState, useEffect } from 'react';
import { useRole } from '../../hooks/useRole';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import LocatiePicker from '../Nieuw/LocatiePicker';
import './ProjectenPage.css';

const ROL_LABELS = { viewer: 'Kijker', ringer: 'Ringer', admin: 'Admin' };
const AUPI_TITLE = 'ActingUserProjectID: jouw persoonlijk lidnummer voor dit project in GRIEL. Te vinden via: Mijn administratie → Mijn projecten → klik op het + naast het project.';

// Read-only ledenlijst op de projectkaart
function ProjectMembers({ project }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState([]);

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
        {open ? '▾' : '▸'} {open ? 'Leden' : `Leden${members.length > 0 ? ` (${members.length})` : ''}`}
      </button>
      {open && (
        <div className="project-members-panel">
          {members.length === 0 ? (
            <p className="project-members-empty">Nog geen leden toegevoegd.</p>
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
                  {m.is_owner ? 'Eigenaar' : (ROL_LABELS[m.rol] || m.rol)}
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
  const [showForm, setShowForm] = useState(false);
  const [naam, setNaam] = useState('');
  const [locatie, setLocatie] = useState('');
  const [nummer, setNummer] = useState('');
  const [editId, setEditId] = useState(null);
  const [editNaam, setEditNaam] = useState('');
  const [editLocatie, setEditLocatie] = useState('');
  const [editNummer, setEditNummer] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [formError, setFormError] = useState('');

  const [vasteLocatie, setVasteLocatie] = useState(false);
  const [plaatscode, setPlaatscode] = useState('NL--');
  const [googlePlaats, setGooglePlaats] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [nauwkCoord, setNauwkCoord] = useState('0');

  const [editVasteLocatie, setEditVasteLocatie] = useState(false);
  const [editPlaatscode, setEditPlaatscode] = useState('NL--');
  const [editGooglePlaats, setEditGooglePlaats] = useState('');
  const [editLat, setEditLat] = useState('');
  const [editLon, setEditLon] = useState('');
  const [editNauwkCoord, setEditNauwkCoord] = useState('0');

  // Leden + AUPIs in bewerkingsmodus
  const [editMembers, setEditMembers] = useState([]);   // { user_id, ringer_naam, email, rol, is_owner, aupi }
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberAupi, setNewMemberAupi] = useState('');
  const [newMemberLoading, setNewMemberLoading] = useState(false);
  const [newMemberError, setNewMemberError] = useState('');

  function nummerExists(nummer, excludeId = null) {
    const n = nummer.trim();
    if (!n) return false;
    return projects.some(p => p.id !== excludeId && p.nummer === n);
  }

  function handleAdd(e) {
    e.preventDefault();
    if (!naam.trim()) return;
    if (nummerExists(nummer)) {
      setFormError(`Projectnummer ${nummer.trim()} bestaat al (ook bij inactieve projecten).`);
      return;
    }
    setFormError('');
    onAdd({
      naam: naam.trim(), locatie: locatie.trim(), nummer: nummer.trim(),
      vaste_locatie: vasteLocatie,
      plaatscode: vasteLocatie ? plaatscode : '',
      google_plaats: vasteLocatie ? googlePlaats : '',
      lat: vasteLocatie ? lat : '',
      lon: vasteLocatie ? lon : '',
      nauwk_coord: vasteLocatie ? nauwkCoord : '0',
    });
    setNaam(''); setLocatie(''); setNummer('');
    setVasteLocatie(false); setPlaatscode('NL--'); setGooglePlaats('');
    setLat(''); setLon(''); setNauwkCoord('0');
    setShowForm(false);
  }

  async function startEdit(p) {
    setEditId(p.id);
    setEditNaam(p.naam);
    setEditLocatie(p.locatie || '');
    setEditNummer(p.nummer || '');
    setEditVasteLocatie(p.vaste_locatie || false);
    setEditPlaatscode(p.plaatscode || 'NL--');
    setEditGooglePlaats(p.google_plaats || '');
    setEditLat(p.lat || '');
    setEditLon(p.lon || '');
    setEditNauwkCoord(p.nauwk_coord || '0');
    setNewMemberEmail('');
    setNewMemberAupi('');
    setNewMemberError('');
    setFormError('');

    // Laad leden + AUPIs
    const { data: memberData } = await supabase.rpc('get_project_members', { p_project_id: p.id });
    const { data: aupiData } = await supabase
      .from('project_members')
      .select('user_id, aupi')
      .eq('project_id', p.id);
    const aupiMap = {};
    (aupiData || []).forEach(r => { aupiMap[r.user_id] = r.aupi || ''; });
    setEditMembers((memberData || []).map(m => ({
      ...m,
      // Eigenaar-AUPI komt uit projecten.aupi, leden-AUPI uit project_members.aupi
      aupi: m.is_owner ? (p.aupi || '') : (aupiMap[m.user_id] || ''),
    })));
  }

  function cancelEdit() {
    setEditId(null);
    setEditMembers([]);
    setFormError('');
  }

  async function saveEdit(p) {
    const newNaam = editNaam.trim();
    if (!newNaam) return;
    if (nummerExists(editNummer, p.id)) {
      setFormError(`Projectnummer ${editNummer.trim()} bestaat al (ook bij inactieve projecten).`);
      return;
    }
    setFormError('');
    if (newNaam !== p.naam && onRenameProject) onRenameProject(p.naam, newNaam);
    const ownerAupi = editMembers.find(m => m.is_owner)?.aupi || '';
    onUpdate(p.id, {
      naam: newNaam, locatie: editLocatie.trim(), nummer: editNummer.trim(),
      vaste_locatie: editVasteLocatie,
      plaatscode: editVasteLocatie ? editPlaatscode : '',
      google_plaats: editVasteLocatie ? editGooglePlaats : '',
      lat: editVasteLocatie ? editLat : '',
      lon: editVasteLocatie ? editLon : '',
      nauwk_coord: editVasteLocatie ? editNauwkCoord : '0',
      aupi: ownerAupi,
    });

    // Sla leden-AUPIs op via RPC (niet de eigenaar)
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
      setFormError(`AUPI opslaan mislukt: ${aupiErrors.join('; ')}`);
      return;
    }
    if (onAupiSaved) onAupiSaved();
    setEditId(null);
    setEditMembers([]);
  }

  async function addEditMember(projectId) {
    const trimmed = newMemberEmail.trim().toLowerCase();
    if (!trimmed) return;
    setNewMemberLoading(true);
    setNewMemberError('');
    try {
      const { data: userId, error: lookupErr } = await supabase.rpc('lookup_user_id', { p_email: trimmed });
      if (lookupErr || !userId) throw new Error('Geen account gevonden voor dit e-mailadres.');
      if (userId === user.id) throw new Error('Je kunt jezelf niet toevoegen.');
      if (editMembers.some(m => m.user_id === userId)) throw new Error('Deze gebruiker is al lid van het project.');

      const { error: insertErr } = await supabase
        .from('project_members')
        .insert({ project_id: projectId, user_id: userId, rol: 'viewer' });
      if (insertErr) {
        if (insertErr.code === '23505') throw new Error('Deze gebruiker is al lid van het project.');
        throw insertErr;
      }

      // Reload members fresh
      const { data: memberData } = await supabase.rpc('get_project_members', { p_project_id: projectId });
      const newMember = memberData?.find(m => m.user_id === userId);
      if (newMember) {
        setEditMembers(prev => [...prev, { ...newMember, aupi: newMemberAupi.trim() }]);
      }
      setNewMemberEmail('');
      setNewMemberAupi('');
    } catch (e) {
      setNewMemberError(e.message);
    } finally {
      setNewMemberLoading(false);
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
        <h2>Projecten</h2>
        {canAdd && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Annuleer' : '+ Nieuw'}
          </button>
        )}
      </div>

      {showForm && (
        <form className="section" onSubmit={handleAdd}>
          <div className="form-group">
            <label>Projectnaam *</label>
            <input type="text" value={naam} onChange={e => setNaam(e.target.value)} placeholder="bijv. CES Breedenbroek 2025" />
          </div>
          <div className="form-group">
            <label>Locatie</label>
            <input type="text" value={locatie} onChange={e => setLocatie(e.target.value)} placeholder="bijv. Breedenbroek" />
          </div>
          <div className="form-group">
            <label>Projectnummer</label>
            <input type="text" value={nummer} onChange={e => setNummer(e.target.value)} placeholder="bijv. 1925" />
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input type="checkbox" checked={vasteLocatie} onChange={e => setVasteLocatie(e.target.checked)} />
              Vaste locatie (coördinaten opslaan bij project)
            </label>
          </div>
          {vasteLocatie && (
            <div className="project-locatie-velden">
              <div className="form-group">
                <label>Plaatscode</label>
                <input type="text" value={plaatscode} onChange={e => setPlaatscode(e.target.value)} placeholder="bijv. NL--" />
              </div>
              <div className="form-group">
                <label>Plaatsnaam</label>
                <input type="text" value={googlePlaats} onChange={e => setGooglePlaats(e.target.value)} placeholder="bijv. Breedenbroek" />
              </div>
              <LocatiePicker lat={lat} lon={lon} onChange={(newLat, newLon) => { setLat(newLat); setLon(newLon); }} />
            </div>
          )}
          {formError && <p className="project-members-error">{formError}</p>}
          <button type="submit" className="btn-success" style={{ width: '100%' }}>
            Project Toevoegen
          </button>
        </form>
      )}

      <div className="project-list">
        {projects.length === 0 ? (
          <div className="empty-state">Nog geen projecten</div>
        ) : (
          projects.map(p => {
            const isOwn = p.user_id === user?.id;
            const isShared = p.shared === true;
            return (
              <div key={p.id} className={`project-card${isShared ? ' project-card--shared' : ''}`}>
                {editId === p.id ? (
                  <div className="project-edit">
                    <div className="form-group">
                      <label>Naam</label>
                      <input type="text" value={editNaam} onChange={e => setEditNaam(e.target.value)} />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Locatie</label>
                        <input type="text" value={editLocatie} onChange={e => setEditLocatie(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Nummer</label>
                        <input type="text" value={editNummer} onChange={e => setEditNummer(e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input type="checkbox" checked={editVasteLocatie} onChange={e => setEditVasteLocatie(e.target.checked)} />
                        Vaste locatie
                      </label>
                    </div>
                    {editVasteLocatie && (
                      <div className="project-locatie-velden">
                        <div className="form-row">
                          <div className="form-group">
                            <label>Plaatscode</label>
                            <input type="text" value={editPlaatscode} onChange={e => setEditPlaatscode(e.target.value)} />
                          </div>
                          <div className="form-group">
                            <label>Plaatsnaam</label>
                            <input type="text" value={editGooglePlaats} onChange={e => setEditGooglePlaats(e.target.value)} />
                          </div>
                        </div>
                        <LocatiePicker
                          lat={editLat} lon={editLon}
                          onChange={(newLat, newLon) => { setEditLat(newLat); setEditLon(newLon); }}
                        />
                      </div>
                    )}

                    {/* Leden & AUPIs */}
                    <div className="edit-members-section">
                      <label className="edit-members-label">Leden</label>
                      <div className="project-members-panel">
                        {editMembers.length === 0 ? (
                          <p className="project-members-empty">Nog geen leden.</p>
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
                                <span className="project-member-badge">Eigenaar</span>
                              ) : (
                                <span className="project-member-actions">
                                  <select
                                    className="project-member-rol-select"
                                    value={m.rol || 'viewer'}
                                    onChange={e => changeEditRole(p.id, m.user_id, e.target.value)}
                                  >
                                    <option value="viewer">Kijker</option>
                                    <option value="ringer">Ringer</option>
                                    <option value="admin">Admin</option>
                                  </select>
                                  <button
                                    className="project-member-remove"
                                    onClick={() => removeEditMember(p.id, m.user_id)}
                                    title="Verwijderen"
                                  >✕</button>
                                </span>
                              )}
                            </div>
                          ))
                        )}
                        <div className="project-members-add">
                          <input
                            type="email"
                            value={newMemberEmail}
                            onChange={e => setNewMemberEmail(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addEditMember(p.id)}
                            placeholder="e-mailadres nieuw lid"
                          />
                          <input
                            className="project-member-aupi-input"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="AUPI"
                            value={newMemberAupi}
                            onChange={e => setNewMemberAupi(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addEditMember(p.id)}
                            title={AUPI_TITLE}
                          />
                          <button
                            className="btn-success btn-sm"
                            onClick={() => addEditMember(p.id)}
                            disabled={newMemberLoading || !newMemberEmail.trim()}
                          >
                            {newMemberLoading ? '...' : 'Toevoegen'}
                          </button>
                        </div>
                        {newMemberError && <p className="project-members-error">{newMemberError}</p>}
                      </div>
                    </div>

                    {formError && editId === p.id && (
                      <p className="project-members-error">{formError}</p>
                    )}
                    <div className="project-edit-actions">
                      <button type="button" className="btn-success btn-sm" onClick={() => saveEdit(p)}>
                        Opslaan
                      </button>
                      <button type="button" className="btn-secondary btn-sm" onClick={cancelEdit}>
                        Annuleer
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
                          {isShared && <span className="project-shared-badge">Gedeeld</span>}
                          <button
                            className={`btn-secondary btn-sm badge ${p.actief ? 'badge-success' : ''}`}
                            onClick={() => canEdit && isOwn && onUpdate(p.id, { actief: !p.actief })}
                            disabled={!canEdit || !isOwn}
                          >
                            {p.actief ? 'Actief' : 'Inactief'}
                          </button>
                        </span>
                      </div>
                      {confirmDeleteId === p.id ? (
                        <div className="project-confirm">
                          Verwijderen?
                          <button className="btn-danger btn-sm" onClick={() => { onDelete(p.id); setConfirmDeleteId(null); }}>Ja</button>
                          <button className="btn-secondary btn-sm" onClick={() => setConfirmDeleteId(null)}>Nee</button>
                        </div>
                      ) : (
                        <div className="project-actions">
                          {canEdit && isOwn && (
                            <button className="project-icoon" onClick={() => startEdit(p)} title="Bewerken">✎</button>
                          )}
                          {canDelete && isOwn && (
                            <button className="project-icoon project-icoon--delete" onClick={() => setConfirmDeleteId(p.id)} title="Verwijderen">✕</button>
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
