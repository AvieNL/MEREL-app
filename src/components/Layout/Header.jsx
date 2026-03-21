import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/index.js';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../hooks/useRole';
import { useTheme } from '../../hooks/useTheme';
import SyncIndicator from '../Sync/SyncIndicator';
import './Header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [prefOpen, setPrefOpen] = useState(false);
  const menuRef = useRef(null);
  const prefRef = useRef(null);
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

  // Pref: sluit bij klik buiten (mobiel)
  useEffect(() => {
    if (!prefOpen) return;
    function handleClick(e) {
      if (prefRef.current && !prefRef.current.contains(e.target)) {
        setPrefOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [prefOpen]);

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

  return (
    <header className="app-header">
      {/* Hoofd-rij */}
      <div className="header-inner">
        <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>VRS App{isStaging && <span className="header-staging-badge">STAGING</span>}</h1>
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
          {/* Pref-menu: taal + thema */}
          <div
            className="pref-menu"
            ref={prefRef}
            onMouseEnter={() => { setMenuOpen(false); setPrefOpen(true); }}
            onMouseLeave={() => setPrefOpen(false)}
          >
            <button
              className="pref-btn"
              onClick={() => { setMenuOpen(false); setPrefOpen(o => !o); }}
              aria-label={`${activeTaal.naam} / ${THEMAS.find(th => th.mode === mode)?.label}`}
            >
              {activeTaal.vlag}
            </button>
            {prefOpen && (
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
                <div className="pref-divider" />
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
              onClick={() => { setPrefOpen(false); setMenuOpen(o => !o); }}
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
