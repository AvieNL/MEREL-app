import { useTranslation } from 'react-i18next';

/**
 * Nestoverzichtpagina — wordt uitgewerkt in fase 4.
 * Toont lijst van alle nesten + kaartweergave.
 */
export default function NestOverzichtPage() {
  const { t } = useTranslation();

  return (
    <div className="page">
      <h2>{t('nest_overview_title')}</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        {t('nest_coming_soon')}
      </p>
    </div>
  );
}
