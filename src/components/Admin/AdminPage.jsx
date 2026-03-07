import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../hooks/useRole';
import { supabase } from '../../lib/supabase';
import { seedVeldConfig } from '../../utils/seedVeldConfig';
import { getRuitypenConfig, saveRuitypenConfig, RUITYPE_TYPES, DEFAULT_RUITYPE_CONFIG } from '../../hooks/useRuitypen';
import './AdminPage.css';

const ROLLEN = ['ringer', 'viewer', 'admin'];
const ROL_LABEL = { admin: 'Admin', ringer: 'Ringer', viewer: 'Viewer' };

export default function AdminPage() {
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const navigate = useNavigate();
  const [gebruikers, setGebruikers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);
  const [ruitypen, setRuitypen] = useState(() => getRuitypenConfig());
  const [ruiSaved, setRuiSaved] = useState(false);

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
    if (window.confirm('Ruitypen terugzetten naar standaardwaarden?')) {
      setRuitypen(DEFAULT_RUITYPE_CONFIG);
      saveRuitypenConfig(DEFAULT_RUITYPE_CONFIG);
    }
  }

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadGebruikers();
  }, [isAdmin]);  // eslint-disable-line react-hooks/exhaustive-deps

  async function loadGebruikers() {
    setLoading(true);
    setError('');

    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true });

    if (err) {
      setError(
        'Kon gebruikers niet laden. Voer eerst supabase-phase3.sql uit in het Supabase SQL-editor.'
      );
      setLoading(false);
      return;
    }

    // Haal vangstenaantal per gebruiker op
    const metCounts = await Promise.all(
      data.map(async (p) => {
        const { count } = await supabase
          .from('vangsten')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', p.id);
        return { ...p, vangsten_count: count ?? 0 };
      })
    );

    setGebruikers(metCounts);
    setLoading(false);
  }

  async function handleSeed() {
    setSeeding(true);
    setSeedDone(false);
    setError('');
    try {
      await seedVeldConfig();
      setSeedDone(true);
    } catch (e) {
      setError('Seed mislukt: ' + e.message);
    } finally {
      setSeeding(false);
    }
  }

  async function changeRol(profileId, newRol) {
    if (profileId === user.id) return; // Admin mag eigen rol niet wijzigen
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

  if (!isAdmin) return null;

  return (
    <div className="page admin-page">
      <h2>Admin panel</h2>

      <button className="admin-link-btn" onClick={() => navigate('/velden')}>
        📋 Veldenoverzicht (EURING)
      </button>

      {loading && <div className="admin-status">Gebruikers laden...</div>}

      {error && (
        <div className="admin-error">
          <strong>Fout:</strong> {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="section">
            <h3>Gebruikers ({gebruikers.length})</h3>
            <div className="admin-users">
              {gebruikers.map(g => (
                <div
                  key={g.id}
                  className={`admin-user-card${g.id === user.id ? ' is-self' : ''}`}
                >
                  <div className="admin-user-info">
                    <div className="admin-user-name">
                      {g.ringer_naam || <em>Naam niet ingesteld</em>}
                      {g.id === user.id && (
                        <span className="admin-badge admin-badge--self">Jij</span>
                      )}
                    </div>
                    <div className="admin-user-meta">
                      <span className="admin-user-email-inline">{g.email || '–'}</span>
                      {g.ringer_nummer && <span>· #{g.ringer_nummer}</span>}
                      <span className="admin-count">· {g.vangsten_count} vangsten</span>
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
                        aria-label={`Rol van ${g.ringer_naam || g.email}`}
                      >
                        {ROLLEN.map(r => (
                          <option key={r} value={r}>{ROL_LABEL[r]}</option>
                        ))}
                      </select>
                    )}
                    {savingId === g.id && (
                      <span className="admin-saving">Opslaan...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <h3>Nieuwe gebruiker uitnodigen</h3>
            <div className="section-content">
              <p className="admin-hint">
                Laat de nieuwe gebruiker zelf een account aanmaken via het inlogscherm
                (Registreren). Zodra ze zijn ingelogd, verschijnen ze hier en kun je
                hun rol instellen.
              </p>
              <p className="admin-hint">
                <strong>Rol uitleg:</strong><br />
                <strong>Ringer</strong> — kan eigen vangsten toevoegen en beheren.<br />
                <strong>Viewer</strong> — kan data alleen bekijken, niet bewerken.<br />
                <strong>Admin</strong> — volledige toegang inclusief dit panel.
              </p>
            </div>
          </div>

          <div className="section">
            <h3>Veldconfiguratie</h3>
            <div className="section-content">
              <p className="admin-hint">
                Vul de <code>veld_config</code>-tabel in Supabase met de standaard EURING-velddefinities.
                Voer dit eenmalig uit na het aanmaken van de tabel. Daarna kun je via het{' '}
                <button className="admin-link-btn admin-link-btn--inline" onClick={() => navigate('/velden')}>
                  Veldenoverzicht
                </button>{' '}
                individuele velden en codes aanpassen.
              </p>
              <button
                className="admin-btn"
                onClick={handleSeed}
                disabled={seeding || !navigator.onLine}
              >
                {seeding ? 'Bezig met seeden...' : 'Seed veldconfiguratie'}
              </button>
              {seedDone && (
                <p className="admin-success">Veldconfiguratie succesvol geseed.</p>
              )}
            </div>
          </div>

          {/* ── Ruitypen editor ── */}
          <div className="section admin-rui-card">
            <div className="admin-rui-header">
              <h3>Ruitypen — seizoensleeftijden</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="admin-btn" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} onClick={resetRuitypen}>Standaard</button>
                <button className="admin-btn" onClick={saveRuitypen}>Opslaan</button>
              </div>
            </div>
            {ruiSaved && <p className="admin-success">Ruitypen opgeslagen.</p>}
            {RUITYPE_TYPES.map(type => (
              <div key={type} className="admin-rui-type">
                <h4 className="admin-rui-type-title">Type {type}</h4>
                <div className="admin-rui-seizoenen">
                  {['voorjaar', 'najaar'].map(seizoen => (
                    <div key={seizoen} className="admin-rui-seizoen">
                      <div className="admin-rui-seizoen-header">
                        <span className="admin-rui-seizoen-label">{seizoen === 'voorjaar' ? 'Voorjaar' : 'Najaar'}</span>
                        <button className="admin-rui-add" onClick={() => addRuiEntry(type, seizoen)}>+ rij</button>
                      </div>
                      {ruitypen[type][seizoen].map((entry, i) => (
                        <div key={i} className="admin-rui-entry">
                          <input
                            className="admin-rui-input admin-rui-input--cond"
                            placeholder="conditie (optioneel)"
                            value={entry.cond}
                            onChange={e => updateRuiEntry(type, seizoen, i, 'cond', e.target.value)}
                          />
                          <span className="admin-rui-arrow">→</span>
                          <input
                            className="admin-rui-input admin-rui-input--val"
                            placeholder="leeftijdslabel"
                            value={entry.val}
                            onChange={e => updateRuiEntry(type, seizoen, i, 'val', e.target.value)}
                          />
                          {ruitypen[type][seizoen].length > 1 && (
                            <button className="admin-rui-remove" onClick={() => removeRuiEntry(type, seizoen, i)}>×</button>
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
