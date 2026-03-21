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
  const menuRef = useRef(null);
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

  const THEME_NEXT = { donker: 'licht', licht: 'systeem', systeem: 'donker' };
  const THEME_ARIA = {
    donker: t('theme_to_light'),
    licht: t('theme_to_system'),
    systeem: t('theme_to_dark'),
  };
  const THEME_TITLE = {
    donker: t('theme_light'),
    licht: t('theme_system'),
    systeem: t('theme_dark'),
  };
  const THEME_ICON = { donker: '☀', licht: '◑', systeem: '☾' };

  const TALEN = [
    { code: 'nl', vlag: '🇳🇱' },
    { code: 'en', vlag: '🇬🇧' },
    { code: 'de', vlag: '🇩🇪' },
  ];

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
        <div className="header-menu" ref={menuRef}>
          {TALEN.map(taal => (
            <button
              key={taal.code}
              className={`lang-btn${i18n.language === taal.code ? ' lang-btn--active' : ''}`}
              onClick={() => i18n.changeLanguage(taal.code)}
              aria-label={taal.code.toUpperCase()}
              title={taal.code.toUpperCase()}
            >
              {taal.vlag}
            </button>
          ))}
          <button
            className="theme-toggle-btn"
            onClick={() => setMode(THEME_NEXT[mode] || 'donker')}
            aria-label={THEME_ARIA[mode]}
            title={THEME_TITLE[mode]}
          >
            {THEME_ICON[mode] || '☾'}
          </button>
          <button
            className={`hamburger-btn${isSimulating ? ' hamburger-btn--simulating' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
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
