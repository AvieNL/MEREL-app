import { useState, useEffect } from 'react';
import { useRole } from '../../hooks/useRole';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import LocatiePicker from '../Nieuw/LocatiePicker';
import './ProjectenPage.css';

const ROL_LABELS = { viewer: 'Kijker', ringer: 'Ringer', admin: 'Admin' };

// Ingebouwde component voor ledenbeheeer per project
function ProjectMembers({ project, onAupiSaved }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aupis, setAupis] = useState({});  // user_id → aupi
  const [aupiDraft, setAupiDraft] = useState({});  // user_id → draft

  const isOwner = project.user_id === user?.id;

  async function loadMembers() {
    const { data } = await supabase.rpc('get_project_members', { p_project_id: project.id });
    setMembers(data || []);
    const { data: aupiData } = await supabase
      .from('project_members')
      .select('user_id, aupi')
      .eq('project_id', project.id);
    const map = {};
    (aupiData || []).forEach(r => { map[r.user_id] = r.aupi || ''; });
    setAupis(map);
    setAupiDraft(map);
  }

  async function saveAupi(userId, currentVal) {
    const val = (currentVal ?? aupiDraft[userId] ?? '').trim();
    await supabase
      .from('project_members')
      .update({ aupi: val || null })
      .eq('project_id', project.id)
      .eq('user_id', userId);
    setAupis(prev => ({ ...prev, [userId]: val }));
    if (onAupiSaved) onAupiSaved();
  }

  useEffect(() => {
    if (open) loadMembers();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  async function addMember() {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    try {
      const { data: userId, error: lookupErr } = await supabase.rpc('lookup_user_id', { p_email: trimmed });
      if (lookupErr || !userId) throw new Error('Geen account gevonden voor dit e-mailadres.');
      if (userId === user.id) throw new Error('Je kunt jezelf niet toevoegen.');

      const { error: insertErr } = await supabase
        .from('project_members')
        .insert({ project_id: project.id, user_id: userId, rol: 'viewer' });
      if (insertErr) {
        if (insertErr.code === '23505') throw new Error('Deze gebruiker is al lid van het project.');
        throw insertErr;
      }
      setEmail('');
      await loadMembers();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function removeMember(userId) {
    await supabase.from('project_members').delete()
      .eq('project_id', project.id)
      .eq('user_id', userId);
    await loadMembers();
  }

  async function changeRole(userId, newRol) {
    await supabase.rpc('update_member_role', {
      p_project_id: project.id,
      p_user_id: userId,
      p_rol: newRol,
    });
    setMembers(prev => prev.map(m => m.user_id === userId ? { ...m, rol: newRol } : m));
  }

  if (!isOwner && !project.shared) return null;

  return (
    <div className="project-members">
      <button
        className="project-members-toggle"
        onClick={() => setOpen(o => !o)}
      >
        {open ? '▾' : '▸'} {open ? 'Leden' : `Leden${members.length > 0 ? ` (${members.length})` : ''}`}
      </button>
      {open && (
        <div className="project-members-panel">
          {members.length === 0 ? (
            <p className="project-members-empty">Nog geen leden toegevoegd.</p>
          ) : (
            members.map(m => {
              const canEditAupi = isOwner || m.user_id === user?.id;
              return (
                <div key={m.user_id} className="project-member-row">
                  <span className="project-member-name">
                    {m.ringer_naam || m.email}
                    {m.email && m.ringer_naam && (
                      <span className="project-member-email">{m.email}</span>
                    )}
                  </span>
                  <span className="project-member-aupi">
                    <abbr
                      className="project-member-aupi-label"
                      title="ActingUserProjectID: jouw persoonlijk lidnummer voor dit project in GRIEL. Te vinden via: Mijn administratie → Mijn projecten → klik op het + naast het project."
                    >AUPI</abbr>
                    {canEditAupi ? (
                      <input
                        className="project-member-aupi-input"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="—"
                        value={aupiDraft[m.user_id] ?? ''}
                        onChange={e => setAupiDraft(prev => ({ ...prev, [m.user_id]: e.target.value }))}
                        onBlur={e => saveAupi(m.user_id, e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && saveAupi(m.user_id, e.target.value)}
                      />
                    ) : (
                      <span className="project-member-aupi-value">{aupis[m.user_id] || '—'}</span>
                    )}
                  </span>
                  {m.is_owner ? (
                    <span className="project-member-badge">Eigenaar</span>
                  ) : isOwner ? (
                    <span className="project-member-actions">
                      <select
                        className="project-member-rol-select"
                        value={m.rol || 'viewer'}
                        onChange={e => changeRole(m.user_id, e.target.value)}
                      >
                        <option value="viewer">Kijker</option>
                        <option value="ringer">Ringer</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        className="project-member-remove"
                        onClick={() => removeMember(m.user_id)}
                        title="Verwijderen"
                      >
                        ✕
                      </button>
                    </span>
                  ) : (
                    <span className="project-member-badge project-member-badge--rol">
                      {ROL_LABELS[m.rol] || m.rol}
                    </span>
                  )}
                </div>
              );
            })
          )}
          {isOwner && (
            <div className="project-members-add">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addMember()}
                placeholder="e-mailadres van nieuwe gebruiker"
              />
              <button
                className="btn-success btn-sm"
                onClick={addMember}
                disabled={loading || !email.trim()}
              >
                {loading ? '...' : 'Toevoegen'}
              </button>
            </div>
          )}
          {error && <p className="project-members-error">{error}</p>}
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
    onAdd({ naam: naam.trim(), locatie: locatie.trim(), nummer: nummer.trim(),
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

  function startEdit(p) {
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
  }

  function cancelEdit() {
    setEditId(null);
    setFormError('');
  }

  function saveEdit(p) {
    const newNaam = editNaam.trim();
    if (!newNaam) return;
    if (nummerExists(editNummer, p.id)) {
      setFormError(`Projectnummer ${editNummer.trim()} bestaat al (ook bij inactieve projecten).`);
      return;
    }
    setFormError('');
    if (newNaam !== p.naam && onRenameProject) {
      onRenameProject(p.naam, newNaam);
    }
    onUpdate(p.id, { naam: newNaam, locatie: editLocatie.trim(), nummer: editNummer.trim(),
      vaste_locatie: editVasteLocatie,
      plaatscode: editVasteLocatie ? editPlaatscode : '',
      google_plaats: editVasteLocatie ? editGooglePlaats : '',
      lat: editVasteLocatie ? editLat : '',
      lon: editVasteLocatie ? editLon : '',
      nauwk_coord: editVasteLocatie ? editNauwkCoord : '0',
    });
    setEditId(null);
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
              <LocatiePicker
                lat={lat} lon={lon}
                onChange={(newLat, newLon) => {
                  setLat(newLat);
                  setLon(newLon);
                }}
              />
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
                          onChange={(newLat, newLon) => {
                            setEditLat(newLat);
                            setEditLon(newLon);
                          }}
                        />
                      </div>
                    )}
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
                    <ProjectMembers project={p} onAupiSaved={onAupiSaved} />
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
