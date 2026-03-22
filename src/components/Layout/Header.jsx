import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/index.js';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../hooks/useRole';
import { useTheme } from '../../hooks/useTheme';
import SyncIndicator from '../Sync/SyncIndicator';
import './Header.css';

export default function Header({ onSwitchModule, activeModule }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [taalOpen, setTaalOpen] = useState(false);
  const [themaOpen, setThemaOpen] = useState(false);
  const menuRef = useRef(null);
  const taalRef = useRef(null);
  const themaRef = useRef(null);
  const navigate = useNavigate();
  const { logout, profile, simulatedRole, setSimulatedRole } = useAuth();
  const { isSimulating, rol } = useRole();
  const { mode, setMode } = useTheme();
  const { t } = useTranslation();

  const isRealAdmin = profile?.rol === 'admin';

  const ROL_LABELS = {
    admin: t('role_admin'),
    ringer: t('role_ringer'),
    viewer: t('role_viewer'),
  };

  // Hamburger: sluit bij klik buiten
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  // Taal: sluit bij klik buiten (mobiel)
  useEffect(() => {
    if (!taalOpen) return;
    function handleClick(e) {
      if (taalRef.current && !taalRef.current.contains(e.target)) {
        setTaalOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [taalOpen]);

  // Thema: sluit bij klik buiten (mobiel)
  useEffect(() => {
    if (!themaOpen) return;
    function handleClick(e) {
      if (themaRef.current && !themaRef.current.contains(e.target)) {
        setThemaOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [themaOpen]);

  function goTo(path) {
    setMenuOpen(false);
    navigate(path);
  }

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
  }

  function switchRole(newRol) {
    setSimulatedRole(newRol === profile?.rol ? null : newRol);
  }

  const isStaging = import.meta.env.VITE_STAGING === 'true';

  const TALEN = [
    { code: 'nl', vlag: '🇳🇱', naam: 'Nederlands' },
    { code: 'en', vlag: '🇬🇧', naam: 'English' },
    { code: 'de', vlag: '🇩🇪', naam: 'Deutsch' },
  ];

  const THEMAS = [
    { mode: 'donker', icon: '☾', label: t('theme_dark') },
    { mode: 'licht',  icon: '☀', label: t('theme_light') },
    { mode: 'systeem', icon: '◑', label: t('theme_system') },
  ];

  const activeTaal = TALEN.find(tl => tl.code === i18n.language) || TALEN[0];
  const activeThema = THEMAS.find(th => th.mode === mode) || THEMAS[0];

  return (
    <header className="app-header">
      {/* Hoofd-rij */}
      <div className="header-inner">
        <div className="header-title-group">
          {onSwitchModule && (
            <button className="header-module-back" onClick={onSwitchModule} aria-label={t('module_switch')}>
              ‹
            </button>
          )}
          <h1 onClick={() => navigate(activeModule === 'nest' ? '/nest' : '/')} style={{ cursor: 'pointer' }}>
            VRS App{isStaging && <span className="header-staging-badge">STAGING</span>}
          </h1>
          {activeModule === 'nest' && (
            <span className="header-module-badge">{t('module_nest')}</span>
          )}
        </div>
        {profile?.ringer_naam && (
          <span className="header-ringer">
            {profile.ringer_naam}
            <span className="header-ringer-rol"> ({ROL_LABELS[rol] || rol})</span>
          </span>
        )}
        <div className="header-sync">
          <SyncIndicator />
        </div>
        <div className="header-menu">
          {/* Taalkiezer */}
          <div
            className="pref-menu"
            ref={taalRef}
            onMouseEnter={() => { setMenuOpen(false); setThemaOpen(false); setTaalOpen(true); }}
            onMouseLeave={() => setTaalOpen(false)}
          >
            <button
              className="pref-btn"
              onClick={() => { setMenuOpen(false); setThemaOpen(false); setTaalOpen(o => !o); }}
              aria-label={activeTaal.naam}
            >
              {activeTaal.vlag}
            </button>
            {taalOpen && (
              <div className="pref-dropdown">
                {TALEN.map(taal => (
                  <button
                    key={taal.code}
                    className={`pref-item${i18n.language === taal.code ? ' pref-item--active' : ''}`}
                    onClick={() => i18n.changeLanguage(taal.code)}
                  >
                    <span className="pref-item-icon">{taal.vlag}</span>
                    {taal.naam}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Themakiezer */}
          <div
            className="pref-menu"
            ref={themaRef}
            onMouseEnter={() => { setMenuOpen(false); setTaalOpen(false); setThemaOpen(true); }}
            onMouseLeave={() => setThemaOpen(false)}
          >
            <button
              className="pref-btn"
              onClick={() => { setMenuOpen(false); setTaalOpen(false); setThemaOpen(o => !o); }}
              aria-label={activeThema.label}
            >
              {activeThema.icon}
            </button>
            {themaOpen && (
              <div className="pref-dropdown">
                {THEMAS.map(thema => (
                  <button
                    key={thema.mode}
                    className={`pref-item${mode === thema.mode ? ' pref-item--active' : ''}`}
                    onClick={() => setMode(thema.mode)}
                  >
                    <span className="pref-item-icon">{thema.icon}</span>
                    {thema.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hamburger */}
          <div className="hamburger-wrapper" ref={menuRef}>
            <button
              className={`hamburger-btn${isSimulating ? ' hamburger-btn--simulating' : ''}`}
              onClick={() => { setTaalOpen(false); setThemaOpen(false); setMenuOpen(o => !o); }}
              aria-label="Menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <rect x="2" y="4" width="16" height="2" rx="1"/>
                <rect x="2" y="9" width="16" height="2" rx="1"/>
                <rect x="2" y="14" width="16" height="2" rx="1"/>
              </svg>
              {isSimulating && <span className="hamburger-sim-dot" />}
            </button>
            {menuOpen && (
              <div className="header-dropdown">
                {isRealAdmin && (
                  <button onClick={() => goTo('/admin')} className="header-admin-btn">
                    ⚙ {t('nav_admin')}
                  </button>
                )}
                <button onClick={() => goTo('/projecten')}>{t('nav_projects')}</button>
                <button onClick={() => goTo('/ringstrengen')}>{t('nav_ring_strings')}</button>
                <button onClick={() => goTo('/instellingen')}>{t('nav_settings')}</button>
                <button onClick={() => goTo('/over')}>{t('nav_about')}</button>

                {isRealAdmin && (
                  <div className="header-role-section">
                    <span className="header-role-label">{t('nav_simulate_role')}</span>
                    <div className="header-role-btns">
                      {['admin', 'ringer', 'viewer'].map(r => (
                        <button
                          key={r}
                          className={`header-role-btn${rol === r ? ' header-role-btn--active' : ''}`}
                          onClick={() => switchRole(r)}
                        >
                          {ROL_LABELS[r]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="header-dropdown-divider" />
                <button onClick={handleLogout} className="header-logout-btn">{t('nav_logout')}</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simulatiebanner */}
      {isSimulating && (
        <div className="header-sim-banner">
          {t('nav_simulating')} <strong>{ROL_LABELS[simulatedRole]}</strong>
          <button onClick={() => setSimulatedRole(null)}>{t('nav_back_to_admin')}</button>
        </div>
      )}
    </header>
  );
}
