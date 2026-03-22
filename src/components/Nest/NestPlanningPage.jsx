import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNestData } from '../../hooks/useNestData';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import { berekenPlanningItems, URGENTIE_KLEUR, formatDatum } from '../../utils/nestPlanning';
import './NestPlanningPage.css';

const HUIDIG_JAAR = new Date().getFullYear();

const TYPE_LABEL = {
  ringen:     'Ringen',
  nacontrole: 'Nacontrole',
  eileg:      'Eileg',
  jongen:     'Jongen verwacht',
  bouw:       'Nestbouw',
  check:      'Bezoek',
};

export default function NestPlanningPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { nesten, legsels, bezoeken } = useNestData();
  const species = useSpeciesRef();

  const speciesByEuring = useMemo(() => {
    const map = {};
    species.forEach(s => { if (s.euring_code) map[s.euring_code] = s; });
    return map;
  }, [species]);

  const items = useMemo(() => berekenPlanningItems({
    nesten, legsels, bezoeken, speciesByEuring, jaar: HUIDIG_JAAR,
  }), [nesten, legsels, bezoeken, speciesByEuring]);

  const verlopen   = items.filter(i => i.urgentie === 'verlopen');
  const dringend   = items.filter(i => i.urgentie === 'dringend');
  const binnenkort = items.filter(i => i.urgentie === 'binnenkort');
  const gepland    = items.filter(i => i.urgentie === 'gepland');

  const groepen = [
    { label: 'Verlopen',   items: verlopen,   kleur: URGENTIE_KLEUR.verlopen },
    { label: 'Dringend',   items: dringend,   kleur: URGENTIE_KLEUR.dringend },
    { label: 'Binnenkort', items: binnenkort, kleur: URGENTIE_KLEUR.binnenkort },
    { label: 'Gepland',    items: gepland,    kleur: URGENTIE_KLEUR.gepland },
  ].filter(g => g.items.length > 0);

  return (
    <div className="page nest-planning-page">
      <h2 className="nest-planning-titel">{t('nest_planning_title')}</h2>

      {items.length === 0 ? (
        <div className="nest-planning-leeg">
          <p>{t('nest_planning_empty')}</p>
        </div>
      ) : (
        groepen.map(groep => (
          <div key={groep.label} className="nest-planning-groep">
            <h3 className="nest-planning-groep__titel" style={{ color: groep.kleur }}>
              {groep.label}
              <span className="nest-planning-groep__tel">{groep.items.length}</span>
            </h3>
            <div className="nest-planning-lijst">
              {groep.items.map(item => (
                <button
                  key={`${item.nestId}-${item.legselId}`}
                  className="nest-planning-item"
                  style={{ '--urgentie-kleur': groep.kleur }}
                  onClick={() => navigate(`/nest/legsel/${item.legselId}/bezoek/nieuw`)}
                >
                  <div className="nest-planning-item__links">
                    <span className="nest-planning-item__nr">#{item.kastnummer}</span>
                    {item.omschrijving && (
                      <span className="nest-planning-item__naam">{item.omschrijving}</span>
                    )}
                    {item.soortNaam && (
                      <span className="nest-planning-item__soort">{item.soortNaam}</span>
                    )}
                  </div>
                  <div className="nest-planning-item__rechts">
                    {item.type && (
                      <span className="nest-planning-item__type">{TYPE_LABEL[item.type] ?? item.type}</span>
                    )}
                    <span className="nest-planning-item__datum">{formatDatum(item.datum)}</span>
                    <span className="nest-planning-item__dagen" style={{ color: groep.kleur }}>
                      {item.dagenAf < 0
                        ? `${Math.abs(item.dagenAf)} dagen te laat`
                        : item.dagenAf === 0 ? 'vandaag'
                        : `over ${item.dagenAf} dagen`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
