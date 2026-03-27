import { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNestData } from '../../hooks/useNestData';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { berekenPlanningItems, URGENTIE_KLEUR, formatDatum } from '../../utils/nestPlanning';
import { downloadNestIcal } from '../../utils/nestIcal';
import { NestIcoon } from '../shared/Icons';
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

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';

export default function NestPlanningPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { nesten, legsels, bezoeken } = useNestData();
  const species = useSpeciesRef();
  const [icalToken, setIcalToken] = useState(null);
  const [webcalKopieerd, setWebcalKopieerd] = useState(false);
  const [webcalOpen, setWebcalOpen] = useState(false);
  const webcalRef = useRef(null);

  useEffect(() => {
    if (!webcalOpen) return;
    function handleClick(e) {
      if (webcalRef.current && !webcalRef.current.contains(e.target)) setWebcalOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [webcalOpen]);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('ical_token').eq('id', user.id).maybeSingle()
      .then(({ data }) => { if (data?.ical_token) setIcalToken(data.ical_token); });
  }, [user]);

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

  const webcalUrl = icalToken
    ? `${SUPABASE_URL}/functions/v1/nest-ical?token=${icalToken}`
    : null;

  function kopieerWebcal() {
    if (!webcalUrl) return;
    navigator.clipboard.writeText(webcalUrl.replace('https://', 'webcal://')).then(() => {
      setWebcalKopieerd(true);
      setTimeout(() => setWebcalKopieerd(false), 2500);
    });
  }

  return (
    <div className="page nest-planning-page">
      <div className="nest-planning-header">
        <h2 className="nest-planning-titel">{t('nest_planning_title')}</h2>
        <div className="nest-planning-ical-knoppen">
          <button
            className="btn-secondary btn-sm"
            onClick={() => downloadNestIcal(items)}
            title="Download .ics bestand"
          >
            ↓ iCal
          </button>
          {webcalUrl && (
            <div className="nest-planning-webcal" ref={webcalRef}>
              <button
                className="btn-secondary btn-sm"
                onClick={() => setWebcalOpen(o => !o)}
                title="Abonneer op live agenda-feed"
              >
                📅 Webcal
              </button>
              {webcalOpen && (
                <div className="nest-planning-webcal-popover">
                  <p className="nest-planning-webcal-uitleg">
                    Kopieer deze link en voeg hem toe als agenda-abonnement in Apple Agenda
                    (<strong>Bestand → Nieuw agenda-abonnement</strong>).
                    De agenda werkt dan automatisch bij.
                  </p>
                  <div className="nest-planning-webcal-url">
                    <code>{webcalUrl.replace('https://', 'webcal://')}</code>
                    <button onClick={kopieerWebcal}>
                      {webcalKopieerd ? '✓' : '⎘'}
                    </button>
                  </div>
                  <a
                    className="nest-planning-webcal-open"
                    href={webcalUrl.replace('https://', 'webcal://')}
                  >
                    Openen in Agenda
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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
                    <span className="nest-planning-item__nr"><NestIcoon nest={item} size={14} /> {item.kastnummer}</span>
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
