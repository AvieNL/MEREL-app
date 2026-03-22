import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNestRole } from '../../hooks/useNestRole';
import './Navigation.css';

const ALL_TABS = [
  { path: '/nest', labelKey: 'nav_nest_nesten', icon: '🥚', requiresEdit: false },
];

export default function NestNavigation() {
  const { canNestAdd } = useNestRole();
  const { t } = useTranslation();
  const tabs = ALL_TABS.filter(tab => !tab.requiresEdit || canNestAdd);

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end={tab.path === '/nest'}
          className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{t(tab.labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
