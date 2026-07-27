import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRole } from '../../hooks/useRole';
import './Navigation.css';

export default function Navigation({ navCounts = {} }) {
  const { canAdd } = useRole();
  const { t } = useTranslation();

  const tabs = [
    ...(canAdd ? [{ path: '/ring/', labelKey: 'nav_new', icon: '＋', end: true }] : []),
    { path: '/ring/records', labelKey: 'nav_records', icon: '☰', badge: navCounts.total > 0 ? navCounts.total : null },
    { path: '/ring/stats', labelKey: 'nav_stats', icon: '◔', badge: navCounts.today > 0 ? navCounts.today : null },
    { path: '/soorten', labelKey: 'nav_species', icon: '◉', badge: navCounts.soorten > 0 ? navCounts.soorten : null },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end={tab.end ?? false}
          className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
        >
          {tab.badge != null && (
            <span className="nav-badge">{tab.badge}</span>
          )}
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{t(tab.labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
