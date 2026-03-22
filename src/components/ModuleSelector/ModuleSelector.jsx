import { useTranslation } from 'react-i18next';
import { useNestRole } from '../../hooks/useNestRole';
import './ModuleSelector.css';

export default function ModuleSelector({ onSelect }) {
  const { t } = useTranslation();
  const { hasNestAccess } = useNestRole();

  return (
    <div className="module-selector">
      <div className="module-selector__inner">
        <h1 className="module-selector__title">VRS Breedenbroek</h1>
        <p className="module-selector__subtitle">{t('module_choose')}</p>

        <div className="module-selector__cards">
          <button
            className="module-card"
            onClick={() => onSelect('ring')}
          >
            <span className="module-card__icon">🐦</span>
            <span className="module-card__label">{t('module_ring')}</span>
            <span className="module-card__desc">{t('module_ring_desc')}</span>
          </button>

          {hasNestAccess && (
            <button
              className="module-card"
              onClick={() => onSelect('nest')}
            >
              <span className="module-card__icon">🥚</span>
              <span className="module-card__label">{t('module_nest')}</span>
              <span className="module-card__desc">{t('module_nest_desc')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
