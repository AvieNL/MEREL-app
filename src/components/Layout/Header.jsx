import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/index.js';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../hooks/useRole';
import { useNestRole } from '../../hooks/useNestRole';
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
  const { logout, profile, simulatedRole, setSimulatedRole, simulatedNestRole, setSimulatedNestRole } = useAuth();
  const { isSimulating, rol } = useRole();
  const { nestRol, isSimulatingNest } = useNestRole();
  const { mode, setMode } = useTheme();
  const { t } = useTranslation();

  const isRealAdmin = profile?.rol === 'admin';

  const ROL_LABELS = {
    admin:    t('role_admin'),
    'ringer+': t('role_ringer_plus'),
    ringer:   t('role_ringer'),
    viewer:   t('role_viewer'),
    geen:     t('role_ring_none'),
  };

  const NEST_ROL_LABELS = {
    admin:           t('role_admin'),
    nestonderzoeker: t('role_nestonderzoeker'),
    kijker:          t('role_nest_kijker'),
    geen:            t('role_nest_geen'),
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
    // Klik op huidige gesimuleerde rol → zet simulatie uit
    setSimulatedRole(newRol === (simulatedRole || profile?.rol) ? null : newRol);
  }

  function switchNestRole(newRol) {
    // 'geen' simuleren heeft aparte waarde; null = simulatie uit
    const current = simulatedNestRole ?? (profile?.nestkast_rol || 'geen');
    setSimulatedNestRole(newRol === current ? null : newRol);
  }

  function stopAllSimulatie() {
    setSimulatedRole(null);
    setSimulatedNestRole(null);
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

  const handleTitleClick = () => {
    if (onSwitchModule) {
      onSwitchModule();
    } else {
      navigate('/');
    }
  };

  const handleModuleClick = () => {
    navigate(activeModule === 'nest' ? '/nest' : '/');
  };

  return (
    <header className="app-header">
      {/* Hoofd-rij */}
      <div className="header-inner">
        <div className="header-title-group">
          <button className="header-app-title" onClick={handleTitleClick} aria-label={t('app_name')}>
            VRS App{isStaging && <span className="header-staging-badge">STAGING</span>}
          </button>
          <button
            className={`header-module-pill header-module-pill--${activeModule || 'ring'}`}
            onClick={handleModuleClick}
            aria-label={activeModule === 'nest' ? t('module_nest') : t('module_ring')}
          >
            {activeModule === 'nest' ? '🥚' : '🐦'}
            <span>{activeModule === 'nest' ? t('module_nest') : t('module_ring')}</span>
          </button>
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

                {/* ── Module-specifieke items ── */}
                {activeModule !== 'nest' && (
                  <div className="header-dropdown-section">
                    <span className="header-dropdown-section-label">🐦 {t('module_ring')}</span>
                    <button onClick={() => goTo('/projecten')}>{t('nav_projects')}</button>
                    <button onClick={() => goTo('/ringstrengen')}>{t('nav_ring_strings')}</button>
                  </div>
                )}

                {/* ── App-breed ── */}
                <div className="header-dropdown-section">
                  <span className="header-dropdown-section-label">{t('nav_section_app')}</span>
                  {isRealAdmin && (
                    <button onClick={() => goTo('/admin')} className="header-admin-btn">
                      ⚙ {t('nav_admin')}
                    </button>
                  )}
                  <button onClick={() => goTo('/instellingen')}>{t('nav_settings')}</button>
                  <button onClick={() => goTo('/over')}>{t('nav_about')}</button>
                </div>

                {/* ── Rol simuleren (admin only) ── */}
                {isRealAdmin && (
                  <div className="header-dropdown-section header-role-section">
                    <span className="header-dropdown-section-label">{t('nav_simulate_role')}</span>

                    <span className="header-role-sublabel">{t('nav_sim_ring_role')}</span>
                    <div className="header-role-pills">
                      {['admin', 'ringer+', 'ringer', 'viewer', 'geen'].map(r => (
                        <button
                          key={r}
                          className={`header-role-pill header-role-pill--ring${rol === r ? ' header-role-pill--active-ring' : ''}`}
                          onClick={() => switchRole(r)}
                        >
                          {ROL_LABELS[r]}
                        </button>
                      ))}
                    </div>

                    <span className="header-role-sublabel">{t('nav_sim_nest_role')}</span>
                    <div className="header-role-pills">
                      {['admin', 'nestonderzoeker', 'kijker', 'geen'].map(r => {
                        const effectief = simulatedNestRole ?? (isRealAdmin ? 'admin' : (profile?.nestkast_rol || 'geen'));
                        return (
                          <button
                            key={r}
                            className={`header-role-pill header-role-pill--nest${effectief === r ? ' header-role-pill--active-nest' : ''}`}
                            onClick={() => switchNestRole(r)}
                          >
                            {NEST_ROL_LABELS[r]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── Uitloggen ── */}
                <div className="header-dropdown-section header-dropdown-section--last">
                  <button onClick={handleLogout} className="header-logout-btn">{t('nav_logout')}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simulatiebanner */}
      {(isSimulating || isSimulatingNest) && (
        <div className="header-sim-banner">
          {t('nav_simulating')}
          {isSimulating && <strong> {ROL_LABELS[simulatedRole]}</strong>}
          {isSimulating && isSimulatingNest && <span> · </span>}
          {isSimulatingNest && <strong>{NEST_ROL_LABELS[simulatedNestRole] ?? simulatedNestRole}</strong>}
          <button onClick={stopAllSimulatie}>{t('nav_back_to_admin')}</button>
        </div>
      )}
    </header>
  );
}
