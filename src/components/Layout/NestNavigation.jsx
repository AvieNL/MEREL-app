import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNestRole } from '../../hooks/useNestRole';
import { useNestData } from '../../hooks/useNestData';
import { useRecords } from '../../hooks/useRecords';
import './Navigation.css';

const ALL_TABS = [
  { path: '/nest/bezoek/nieuw',  labelKey: 'nav_new',          icon: '＋', requiresEdit: true },
  { path: '/nest',               labelKey: 'nav_nest_nesten',  icon: '⌂',  requiresEdit: false, end: true },
  { path: '/nest/planning',      labelKey: 'nav_nest_planning', icon: '▦', requiresEdit: false },
  { path: '/nest/stats',         labelKey: 'nav_stats',        icon: '◔', requiresEdit: false },
  { path: '/soorten',            labelKey: 'nav_species',      icon: '◉', requiresEdit: false },
];

export default function NestNavigation() {
  const { canNestAdd } = useNestRole();
  const { t } = useTranslation();
  const { deletedNesten } = useNestData();
  const { deletedRecords } = useRecords();
  const tabs = ALL_TABS.filter(tab => !tab.requiresEdit || canNestAdd);
  const prullenbakTel = (deletedNesten?.length ?? 0) + (deletedRecords?.length ?? 0);

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end={tab.end ?? false}
          className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{t(tab.labelKey)}</span>
        </NavLink>
      ))}
      <NavLink
        to="/prullenbak"
        className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
      >
        <span className="nav-icon" style={{ position: 'relative' }}>
          🗑
          {prullenbakTel > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: -6,
              background: 'var(--danger, #ef4444)', color: '#fff',
              fontSize: '0.55rem', fontWeight: 700, borderRadius: 6,
              padding: '1px 4px', lineHeight: 1.2,
            }}>{prullenbakTel > 9 ? '9+' : prullenbakTel}</span>
          )}
        </span>
        <span className="nav-label">{t('nav_prullenbak')}</span>
      </NavLink>
    </nav>
  );
}
