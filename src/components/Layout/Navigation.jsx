import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRole } from '../../hooks/useRole';
import './Navigation.css';

const ALL_TABS = [
  { path: '/ring/', labelKey: 'nav_new', icon: '＋', requiresEdit: true },
  { path: '/ring/records', labelKey: 'nav_records', icon: '☰' },
  { path: '/ring/stats', labelKey: 'nav_stats', icon: '◔' },
  { path: '/soorten', labelKey: 'nav_species', icon: '◉' },
];

export default function Navigation() {
  const { canAdd } = useRole();
  const { t } = useTranslation();
  const tabs = ALL_TABS.filter(tab => !tab.requiresEdit || canAdd);

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end={tab.path === '/ring/'}
          className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{t(tab.labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
