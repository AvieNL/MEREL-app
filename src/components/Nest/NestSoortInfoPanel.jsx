import { useTranslation } from 'react-i18next';
import { berekenRingLeeftijd } from '../../utils/nestSuggestie';
import '../Nieuw/NieuwPage.css';

/**
 * Compact informatiestrip met nestgegevens van de soort.
 * Gebruikt dezelfde stijl als .soort-info-panel in NieuwPage.css.
 *
 * Props:
 *   soort    {object|null}  Soortobject uit Dexie
 *   stadium  {string}       Huidig primair stadium (voor highlight)
 */
export default function NestSoortInfoPanel({ soort, stadium }) {
  const { t } = useTranslation();
  if (!soort) return null;

  const { nest_eieren, nest_ei_dagen, nest_jong_dagen, nest_broedels } = soort;
  if (!nest_eieren && !nest_ei_dagen && !nest_jong_dagen) return null;

  const ringDag = nest_jong_dagen ? berekenRingLeeftijd(soort) : null;

  const items = [
    nest_eieren     && { waarde: nest_eieren,              lbl: t('nest_info_eieren')     },
    nest_ei_dagen   && { waarde: nest_ei_dagen,            lbl: t('nest_info_broeddagen') },
    nest_jong_dagen && { waarde: nest_jong_dagen,          lbl: t('nest_info_nestdagen')  },
    ringDag         && { waarde: `dag ${ringDag} (N6)`,   lbl: t('nest_info_ringen')     },
    nest_broedels   && { waarde: `${nest_broedels}×`,     lbl: t('nest_info_broedsel')   },
  ].filter(Boolean);

  return (
    <div className="soort-info-panel" style={{ marginTop: 10 }}>
      <div className="soort-info-header">
        <strong>{soort.naam_nl}</strong>
        {soort.naam_lat && <span className="soort-lat">{soort.naam_lat}</span>}
      </div>
      <div className="soort-info-grid">
        {items.map((item, i) => (
          <div key={i} className="soort-info-item">
            <span className="sii-label">{item.lbl}</span>
            <span className="sii-value">{item.waarde}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
