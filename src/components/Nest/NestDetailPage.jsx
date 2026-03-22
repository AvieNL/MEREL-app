import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNestData } from '../../hooks/useNestData';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import { useNestRole } from '../../hooks/useNestRole';
import { useModuleSwitch } from '../../App';
import { HABITAT_CODES, NESTPLAATS_CODES, STADIUM_CODES } from '../../data/sovon-codes';
import './NestDetailPage.css';

const NEST_RING_CONTEXT_KEY = 'vrs-ring-uit-nest';

const HUIDIG_JAAR = new Date().getFullYear();

function stadiumLabel(code) {
  return STADIUM_CODES.find(s => s.code === code)?.nl || code;
}

export default function NestDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { canNestAdd, canNestEdit, canNestDelete } = useNestRole();
  const { nesten, seizoenen, legsels, bezoeken, ringen, deleteNest } = useNestData();
  const [deleteBevestig, setDeleteBevestig] = useState(false);
  const species = useSpeciesRef();
  const switchModule = useModuleSwitch();

  const speciesByEuring = useMemo(() => {
    const map = {};
    species.forEach(s => { if (s.euring_code) map[s.euring_code] = s; });
    return map;
  }, [species]);

  const nest = nesten.find(n => n.id === id);

  const nestSeizoenGesorteerd = useMemo(() => {
    return seizoenen
      .filter(s => s.nest_id === id)
      .sort((a, b) => b.jaar - a.jaar);
  }, [seizoenen, id]);

  if (!nest) {
    return (
      <div className="page">
        <button className="btn-secondary page-back" onClick={() => navigate('/nest')}>{t('btn_back')}</button>
        <p style={{ color: 'var(--text-secondary)', marginTop: 16 }}>{t('nest_not_found')}</p>
      </div>
    );
  }

  return (
    <div className="page nest-detail-page">
      {/* ── Header ── */}
      <div className="nest-detail-header">
        <button className="btn-secondary page-back" onClick={() => navigate('/nest')}>{t('btn_back')}</button>
        <div className="nest-detail-titel">
          {nest.omschrijving && <p className="nest-detail-omschrijving">{nest.omschrijving}</p>}
          {nest.lat && nest.lon && (
            <p className="nest-detail-coords">{parseFloat(nest.lat).toFixed(5)}, {parseFloat(nest.lon).toFixed(5)}</p>
          )}
        </div>
        <div className="nest-detail-acties">
          {canNestEdit && (
            <button
              className="btn-secondary nest-actie-btn"
              onClick={() => navigate(`/nest/${id}/wijzigen`)}
              title={t('btn_edit')}
            >✏️</button>
          )}
          {canNestDelete && (
            <button
              className="btn-danger nest-actie-btn"
              onClick={() => setDeleteBevestig(true)}
              title={t('btn_delete')}
            >🗑️</button>
          )}
        </div>
      </div>

      {/* ── Verwijder-bevestiging ── */}
      {deleteBevestig && (
        <div className="nest-delete-confirm">
          <p>{t('nest_delete_confirm', { nr: nest.kastnummer })}</p>
          <div className="nest-delete-confirm__acties">
            <button className="btn-secondary" onClick={() => setDeleteBevestig(false)}>{t('btn_cancel')}</button>
            <button
              className="btn-danger"
              onClick={async () => { await deleteNest(id); navigate('/nest'); }}
            >{t('btn_delete')}</button>
          </div>
        </div>
      )}

      {/* ── Seizoenen ── */}
      {nestSeizoenGesorteerd.length === 0 ? (
        <div className="nest-geen-seizoenen">
          <p>{t('nest_no_seasons')}</p>
        </div>
      ) : (
        nestSeizoenGesorteerd.map(seizoen => (
          <SeizoenBlok
            key={seizoen.id}
            seizoen={seizoen}
            nest={nest}
            legsels={legsels}
            bezoeken={bezoeken}
            ringen={ringen}
            speciesByEuring={speciesByEuring}
            canNestAdd={canNestAdd}
            navigate={navigate}
            switchModule={switchModule}
            t={t}
          />
        ))
      )}
    </div>
  );
}

function SeizoenBlok({ seizoen, nest, legsels, bezoeken, ringen, speciesByEuring, canNestAdd, navigate, switchModule, t }) {
  const vogelNaam = seizoen.soort_euring
    ? (speciesByEuring[seizoen.soort_euring]?.naam_nl || seizoen.soort_euring)
    : t('nest_soort_unknown');

  const habitatLabel = seizoen.habitat != null
    ? (HABITAT_CODES.find(c => c.code === seizoen.habitat)?.nl || seizoen.habitat)
    : null;

  const nestplaatsLabel = seizoen.nestplaats != null
    ? (NESTPLAATS_CODES.find(c => c.code === seizoen.nestplaats)?.nl || seizoen.nestplaats)
    : null;

  const seizoenLegsels = legsels
    .filter(l => l.nest_seizoen_id === seizoen.id)
    .sort((a, b) => a.volgnummer - b.volgnummer);

  return (
    <div className="seizoen-blok">
      <div className="seizoen-blok__header">
        <h3>{seizoen.jaar} — {vogelNaam}</h3>
        {(habitatLabel || nestplaatsLabel) && (
          <div className="seizoen-blok__meta">
            {habitatLabel && <span>{t('nest_habitat')}: {habitatLabel}</span>}
            {nestplaatsLabel && <span>{t('nest_nestplaats')}: {nestplaatsLabel}</span>}
          </div>
        )}
      </div>

      {seizoenLegsels.map(legsel => (
        <LegselBlok
          key={legsel.id}
          legsel={legsel}
          nest={nest}
          seizoen={seizoen}
          bezoeken={bezoeken}
          ringen={ringen}
          soort={speciesByEuring[seizoen.soort_euring] || null}
          speciesByEuring={speciesByEuring}
          canNestAdd={canNestAdd}
          navigate={navigate}
          switchModule={switchModule}
          t={t}
        />
      ))}

      {canNestAdd && (
        <button
          className="btn-secondary nest-add-legsel-btn"
          onClick={() => navigate(`/nest/seizoen/${seizoen.id}/legsel/nieuw`)}
        >
          + {t('nest_btn_add_legsel')}
        </button>
      )}
    </div>
  );
}

function LegselBlok({ legsel, nest, seizoen, bezoeken, ringen, soort, speciesByEuring, canNestAdd, navigate, switchModule, t }) {
  const legselBezoeken = bezoeken
    .filter(b => b.legsel_id === legsel.id)
    .sort((a, b) => a.datum.localeCompare(b.datum));

  function handleVogelRingen(bezoek) {
    sessionStorage.setItem(NEST_RING_CONTEXT_KEY, JSON.stringify({
      bezoekId: bezoek.id,
      nestId: nest?.id || '',
      soortNaam: soort?.naam_nl || '',
      soortEuring: seizoen?.soort_euring || '',
      datum: bezoek.datum,
      lat: nest?.lat || '',
      lon: nest?.lon || '',
    }));
    navigate('/');
    if (switchModule) switchModule('ring');
  }

  return (
    <div className="legsel-blok">
      <div className="legsel-blok__header">
        <span className="legsel-blok__nr">{t('nest_legsel_nr', { nr: legsel.volgnummer })}</span>
        {legsel.nestsucces != null && (
          <span className="legsel-blok__succes">
            {legsel.nestsucces === -1 ? t('nest_succes_unknown') : t('nest_succes_count', { count: legsel.nestsucces })}
          </span>
        )}
      </div>

      {legselBezoeken.length === 0 ? (
        <p className="legsel-geen-bezoeken">{t('nest_no_visits')}</p>
      ) : (
        <div className="bezoek-timeline">
          {legselBezoeken.map(bezoek => {
            const bezoekRingen = ringen.filter(r => r.nestbezoek_id === bezoek.id);
            const isNGroep = bezoek.stadium?.startsWith('N');
            return (
              <div key={bezoek.id} className="bezoek-item">
                <div className="bezoek-item__row">
                  <span className="bezoek-item__datum">{bezoek.datum}{bezoek.tijd ? ` ${bezoek.tijd.slice(0,5)}` : ''}</span>
                  <span className="bezoek-item__stadium">
                    {stadiumLabel(bezoek.stadium)}
                    {bezoek.stadium2 && <> + {stadiumLabel(bezoek.stadium2)}</>}
                  </span>
                  {bezoek.soort_euring && bezoek.soort_euring !== seizoen.soort_euring && (
                    <span className="bezoek-item__soort-afwijking">
                      {speciesByEuring[bezoek.soort_euring]?.naam_nl || bezoek.soort_euring}
                    </span>
                  )}
                  {(bezoek.aantal_eieren != null || bezoek.aantal_pulli != null) && (
                    <span className="bezoek-item__aantallen">
                      {bezoek.aantal_eieren != null && `${bezoek.aantal_eieren}×🥚`}
                      {bezoek.aantal_pulli != null && ` ${bezoek.aantal_pulli}×🐣`}
                    </span>
                  )}
                  {bezoek.volgende_bezoek_suggestie && (
                    <span className="bezoek-item__suggestie">→ {bezoek.volgende_bezoek_suggestie}</span>
                  )}
                  {canNestAdd && isNGroep && (
                    <button
                      className="btn-ring-uit-nest"
                      type="button"
                      onClick={() => handleVogelRingen(bezoek)}
                      title={t('nest_btn_ring_bird')}
                    >
                      🔖 {t('nest_btn_ring_bird')}
                    </button>
                  )}
                </div>
                {bezoekRingen.length > 0 && (
                  <div className="bezoek-ringen">
                    {bezoekRingen.map(r => (
                      <span key={r.id} className="nestring-badge">
                        🔖 {r.ringnummer || t('nest_ring_no_number')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {canNestAdd && (
        <button
          className="btn-primary nest-add-bezoek-btn"
          onClick={() => navigate(`/nest/legsel/${legsel.id}/bezoek/nieuw`)}
        >
          + {t('nest_btn_add_bezoek')}
        </button>
      )}
    </div>
  );
}
