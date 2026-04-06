import { useMemo, useState, useRef } from 'react';
import { IconEdit, IconDelete, IconFlag, IconRing, NestIcoon } from '../shared/Icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNestData } from '../../hooks/useNestData';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import { useNestRole } from '../../hooks/useNestRole';
import { useRecords } from '../../hooks/useRecords';
import { useModuleSwitch } from '../../App';
import { HABITAT_CODES, NESTPLAATS_CODES, STADIUM_CODES } from '../../data/sovon-codes';
import { formatDatum, URGENTIE_KLEUR, BROEDSTATUS, getBroedStatus } from '../../utils/nestPlanning';
import { verwerkFoto } from '../../utils/imageHelper';
import './NestDetailPage.css';

function stadiumLabel(code, t) {
  const entry = STADIUM_CODES.find(s => s.code === code);
  if (!entry) return code;
  if (t && entry.tKey) return `${code} — ${t(entry.tKey)}`;
  return entry.nl;
}

export default function NestDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { canNestAdd, canNestEdit, canNestDelete } = useNestRole();
  const { nesten, legsels, bezoeken, ringen, deleteNest, deleteLegsel, deleteBezoek, deleteNestring, updateNest } = useNestData();
  const { records } = useRecords();
  const switchModule = useModuleSwitch();
  const [deleteBevestig, setDeleteBevestig] = useState(false);
  const species = useSpeciesRef();

  const speciesByEuring = useMemo(() => {
    const map = {};
    species.forEach(s => { if (s.euring_code) map[s.euring_code] = s; });
    return map;
  }, [species]);

  const nest = nesten.find(n => n.id === id);

  // Platte lijst van legsels, gesorteerd op datum van meest recente bezoek (nieuwste eerst)
  // displayNummer = volgordepositie over alle jaren (1 = oudste legsel van dit nest)
  const gesorteerdeLegsels = useMemo(() => {
    const nestLegsels = legsels.filter(l => l.nest_id === id);

    // Chronologische volgorde voor nummering: oud → nieuw
    const chronologisch = [...nestLegsels].sort((a, b) => {
      if (a.jaar !== b.jaar) return (a.jaar || 0) - (b.jaar || 0);
      return (a.volgnummer || 0) - (b.volgnummer || 0);
    });
    const nummerMap = {};
    chronologisch.forEach((l, idx) => { nummerMap[l.id] = idx + 1; });

    // Weergavevolgorde: nieuwste bezoek eerst
    return [...nestLegsels].sort((a, b) => {
      const latestA = bezoeken.filter(bz => bz.legsel_id === a.id).map(bz => bz.datum).sort().at(-1) || '';
      const latestB = bezoeken.filter(bz => bz.legsel_id === b.id).map(bz => bz.datum).sort().at(-1) || '';
      return latestB.localeCompare(latestA);
    }).map(l => ({ ...l, displayNummer: nummerMap[l.id] }));
  }, [id, legsels, bezoeken]);

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
        <div className="nest-detail-nummer"><NestIcoon nest={nest} size={22} /> {nest.kastnummer}</div>
        <div className="nest-detail-titel">
          {nest.omschrijving && <p className="nest-detail-omschrijving">{nest.omschrijving}</p>}
          {nest.adres ? (
            <p className="nest-detail-coords">{nest.adres}</p>
          ) : nest.lat && nest.lon ? (
            <p className="nest-detail-coords">{parseFloat(nest.lat).toFixed(5)}, {parseFloat(nest.lon).toFixed(5)}</p>
          ) : null}
        </div>
        <div className="nest-detail-acties">
          {canNestEdit && (
            <button
              className="icon-edit-btn"
              onClick={() => navigate(`/nest/${id}/wijzigen`)}
              title={t('btn_edit')}
            ><IconEdit size={18} /></button>
          )}
          {canNestDelete && (
            <button
              className="icon-delete-btn"
              onClick={() => setDeleteBevestig(true)}
              title={t('btn_delete')}
            ><IconDelete size={18} /></button>
          )}
        </div>
      </div>

      {/* ── Foto's ── */}
      <NestFotoStrip nest={nest} canNestEdit={canNestEdit} updateNest={updateNest} />

      {/* ── Verwijder-bevestiging (naar prullenbak) ── */}
      {deleteBevestig && (
        <div className="nest-delete-confirm">
          <p>{t('nest_delete_confirm', { nr: nest.kastnummer })}</p>
          <div className="nest-delete-confirm__acties">
            <button className="btn-secondary" onClick={() => setDeleteBevestig(false)}>{t('btn_cancel')}</button>
            <button
              className="btn-danger"
              onClick={async () => { await deleteNest(id); navigate('/prullenbak'); }}
            >{t('btn_to_trash')}</button>
          </div>
        </div>
      )}

      {/* ── Legsels (plat, nieuwste eerst) ── */}
      {gesorteerdeLegsels.length === 0 ? (
        <div className="nest-geen-seizoenen">
          <p>{t('nest_no_seasons')}</p>
        </div>
      ) : (
        gesorteerdeLegsels.map(legsel => (
          <LegselBlok
            key={legsel.id}
            legsel={legsel}
            nest={nest}
            bezoeken={bezoeken}
            ringen={ringen}
            soort={speciesByEuring[legsel.soort_euring] || null}
            speciesByEuring={speciesByEuring}
            canNestAdd={canNestAdd}
            canNestEdit={canNestEdit}
            canNestDelete={canNestDelete}
            deleteLegsel={deleteLegsel}
            deleteBezoek={deleteBezoek}
            deleteNestring={deleteNestring}
            records={records}
            navigate={navigate}
            switchModule={switchModule}
            t={t}
          />
        ))
      )}

      {canNestAdd && (
        <button
          className="btn-secondary nest-add-legsel-btn"
          onClick={() => navigate(`/nest/${id}/legsel/nieuw`)}
        >
          + {t('nest_btn_add_legsel')}
        </button>
      )}
    </div>
  );
}


const MAX_FOTOS = 3;

function NestFotoStrip({ nest, canNestEdit, updateNest }) {
  const fotos = nest.fotos || [];
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState('');
  const [lightbox, setLightbox] = useState(null);
  const inputRef = useRef(null);

  async function handleToevoegen(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFout('');
    setBezig(true);
    try {
      const { preview } = await verwerkFoto(file);
      await updateNest(nest.id, { fotos: [...fotos, preview] });
    } catch (err) {
      setFout(err.message);
    } finally {
      setBezig(false);
      e.target.value = '';
    }
  }

  async function handleVerwijderen(idx) {
    await updateNest(nest.id, { fotos: fotos.filter((_, i) => i !== idx) });
  }

  if (fotos.length === 0 && !canNestEdit) return null;

  return (
    <div className="nest-fotos">
      <div className="nest-fotos__strip">
        {fotos.map((src, i) => (
          <div key={i} className="nest-foto-thumb">
            <img
              src={src}
              alt={`Foto ${i + 1}`}
              onClick={() => setLightbox(i)}
            />
            {canNestEdit && (
              <button
                className="nest-foto-thumb__del"
                onClick={() => handleVerwijderen(i)}
                aria-label="Foto verwijderen"
              >×</button>
            )}
          </div>
        ))}
        {canNestEdit && fotos.length < MAX_FOTOS && (
          <button
            className="nest-foto-add"
            onClick={() => inputRef.current?.click()}
            disabled={bezig}
            title="Foto toevoegen"
          >
            {bezig ? <span>…</span> : (
              <>
                <span className="nest-foto-add__icon">📷</span>
                <span className="nest-foto-add__label">Foto</span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.heic"
        style={{ display: 'none' }}
        onChange={handleToevoegen}
      />
      {fout && <p className="nest-fotos__fout">{fout}</p>}
      {lightbox !== null && (
        <div className="nest-foto-lightbox" onClick={() => setLightbox(null)}>
          <img src={fotos[lightbox]} alt={`Foto ${lightbox + 1}`} onClick={e => e.stopPropagation()} />
          <button className="nest-foto-lightbox__sluit" onClick={() => setLightbox(null)}>×</button>
        </div>
      )}
    </div>
  );
}


function LegselBlok({ legsel, nest, bezoeken, ringen, soort, speciesByEuring, canNestAdd, canNestEdit, canNestDelete, deleteLegsel, deleteBezoek, deleteNestring, records, navigate, switchModule, t }) {
  const [deleteBezoekId, setDeleteBezoekId] = useState(null);
  const [deleteLegselBevestig, setDeleteLegselBevestig] = useState(false);
  const [deleteNestringId, setDeleteNestringId] = useState(null);
  const legselBezoeken = bezoeken
    .filter(b => b.legsel_id === legsel.id)
    .sort((a, b) => a.datum.localeCompare(b.datum));

  // Soort: meest recente bezoek met soort_euring → legsel → nest
  const soortEuring =
    [...legselBezoeken].reverse().find(b => b.soort_euring)?.soort_euring ||
    legsel?.soort_euring ||
    nest?.soort_euring || '';
  const effectieveSoort = speciesByEuring[soortEuring] || soort || null;
  const vogelNaam = effectieveSoort?.naam_nl || soortEuring || '';

  // Status op basis van meest recente bezoek (datum + tijd als tiebreaker)
  const laatsteBezoek = legselBezoeken.reduce((acc, b) => {
    if (!acc) return b;
    if (b.datum > acc.datum) return b;
    if (b.datum === acc.datum && (b.tijd || '') > (acc.tijd || '')) return b;
    return acc;
  }, null);
  const laatsteStadium = laatsteBezoek?.stadium || null;
  const status = getBroedStatus(laatsteStadium);
  const { kleur: statusKleur, labelKey: statusLabelKey } = BROEDSTATUS[status];

  return (
    <div className="legsel-blok" style={{ '--status-kleur': statusKleur }}>
      <div className="legsel-blok__header">
        <span className="legsel-blok__nr">{t('nest_legsel_nr', { nr: legsel.displayNummer ?? legsel.volgnummer })}</span>
        {legsel.jaar && <span className="legsel-blok__jaar">{legsel.jaar}</span>}
        {vogelNaam && <span className="legsel-blok__soort">{vogelNaam}</span>}
        <span className="legsel-blok__status" style={{ '--status-kleur': statusKleur }}>
          <span className="legsel-blok__status-prefix"><IconFlag /></span>
          <span className="legsel-blok__status-waarde">{t(statusLabelKey)}</span>
        </span>
        {legsel.nestsucces != null && (
          <span className="legsel-blok__succes">
            {legsel.nestsucces === -1 ? t('nest_succes_unknown') : t('nest_succes_count', { count: legsel.nestsucces })}
          </span>
        )}
        {canNestEdit && (
          <button
            className="icon-edit-btn legsel-blok__edit"
            type="button"
            onClick={() => navigate(`/nest/legsel/${legsel.id}/wijzigen`)}
            title={t('btn_edit')}
          ><IconEdit size={18} /></button>
        )}
        {canNestDelete && (
          <button
            className="icon-delete-btn legsel-blok__delete"
            type="button"
            onClick={() => setDeleteLegselBevestig(true)}
            title={t('btn_delete')}
          ><IconDelete size={18} /></button>
        )}
      </div>
      {deleteLegselBevestig && (
        <div className="bezoek-delete-confirm">
          <span>{t('nest_legsel_delete_confirm', { nr: legsel.displayNummer ?? legsel.volgnummer })}</span>
          <button className="btn-secondary" onClick={() => setDeleteLegselBevestig(false)}>{t('btn_cancel')}</button>
          <button className="btn-danger" onClick={() => deleteLegsel(legsel.id)}>{t('btn_delete')}</button>
        </div>
      )}

      {legselBezoeken.length === 0 ? (
        <p className="legsel-geen-bezoeken">{t('nest_no_visits')}</p>
      ) : (
        <div className="bezoek-timeline">
          {legselBezoeken.map(bezoek => {
            const bezoekRingen = ringen.filter(r => r.nestbezoek_id === bezoek.id);
            const isRingbaar = ['N5', 'N6', 'N7'].includes(bezoek.stadium);
            return (
              <div key={bezoek.id} className="bezoek-item">
                {/* ── Regel 1: datum + pill + potlood ── */}
                <div className="bezoek-item__row">
                  <span className="bezoek-item__datum">
                    <span className="bezoek-item__datum-label">{t('nest_bezoek_label')}</span>
                    {formatDatum(bezoek.datum)}{bezoek.tijd ? ` ${bezoek.tijd.slice(0,5)}` : ''}
                  </span>
                  {bezoek.volgende_bezoek_suggestie && (() => {
                    const dagenAf = Math.round((new Date(bezoek.volgende_bezoek_suggestie) - new Date()) / 86400000);
                    const urgentie = dagenAf < 0 ? 'verlopen' : dagenAf <= 2 ? 'dringend' : dagenAf <= 5 ? 'binnenkort' : 'gepland';
                    return (
                      <span className="bezoek-item__suggestie-pill" style={{ '--pill-kleur': URGENTIE_KLEUR[urgentie] }}>
                        → {formatDatum(bezoek.volgende_bezoek_suggestie)}
                      </span>
                    );
                  })()}
                  {canNestEdit && (
                    <div className="bezoek-item__acties">
                      <button
                        className="icon-edit-btn"
                        type="button"
                        onClick={() => navigate(`/nest/bezoek/${bezoek.id}/wijzigen`)}
                        title={t('btn_edit')}
                      ><IconEdit size={18} /></button>
                      <button
                        className="icon-delete-btn"
                        type="button"
                        onClick={() => setDeleteBezoekId(bezoek.id)}
                        title={t('btn_delete')}
                      ><IconDelete size={18} /></button>
                    </div>
                  )}
                </div>
                {deleteBezoekId === bezoek.id && (
                  <div className="bezoek-delete-confirm">
                    <span>{t('nest_bezoek_delete_confirm', { datum: formatDatum(bezoek.datum) })}</span>
                    <button className="btn-secondary" onClick={() => setDeleteBezoekId(null)}>{t('btn_cancel')}</button>
                    <button className="btn-danger" onClick={async () => { await deleteBezoek(bezoek.id); setDeleteBezoekId(null); }}>{t('btn_delete')}</button>
                  </div>
                )}
                {/* ── Regel 2: soort + stadium + aantallen ── */}
                <div className="bezoek-item__details">
                  {bezoek.soort_euring && bezoek.soort_euring !== soortEuring && (
                    <span className="bezoek-item__soort-afwijking">
                      {speciesByEuring[bezoek.soort_euring]?.naam_nl || bezoek.soort_euring}
                    </span>
                  )}
                  <span className="bezoek-item__stadium">
                    {stadiumLabel(bezoek.stadium, t)}
                    {bezoek.stadium2 && <> + {stadiumLabel(bezoek.stadium2, t)}</>}
                  </span>
                  {(bezoek.aantal_eieren != null || bezoek.aantal_pulli != null) && (
                    <span className="bezoek-item__aantallen">
                      {bezoek.aantal_eieren != null && `${bezoek.aantal_eieren} ${t('nest_eieren')}`}
                      {bezoek.aantal_pulli != null && ` · ${bezoek.aantal_pulli} ${t('nest_jongen')}`}
                    </span>
                  )}
                </div>
                {bezoekRingen.length > 0 && (
                  <div className="bezoek-item__ringen-blok">
                    <span className="bezoek-item__ringen-label">{t('nest_geringd_label')}:</span>
                    {bezoekRingen.map((r) => {
                      const vangst = records?.find(v => v.id === r.vangst_id);
                      const nr = r.ringnummer?.replace(/\./g, '') || t('nest_ring_no_number');
                      return (
                        <span key={r.id} className="bezoek-item__ring-rij">
                          {deleteNestringId === r.id ? (
                            <span className="bezoek-item__ring-confirm">
                              <span>{t('nest_nestring_delete_confirm', { nr })}</span>
                              <button type="button" className="btn-danger btn-xs"
                                onClick={async () => { await deleteNestring(r.id); setDeleteNestringId(null); }}>
                                {t('btn_delete')}
                              </button>
                              <button type="button" className="btn-secondary btn-xs"
                                onClick={() => setDeleteNestringId(null)}>
                                {t('btn_cancel')}
                              </button>
                            </span>
                          ) : (
                            <>
                              {vangst
                                ? <button className="bezoek-item__ring-link" type="button"
                                    onClick={e => {
  e.stopPropagation();
  try { sessionStorage.setItem('vrs-edit-record', JSON.stringify(vangst)); } catch { /* ignore */ }
  switchModule('ring');
  navigate('/ring/');
}}>
                                    {nr}
                                  </button>
                                : <span className="bezoek-item__ring-orphan">{nr}</span>
                              }
                              {canNestEdit && (
                                <button type="button" className="bezoek-item__ring-delete"
                                  title={t('nest_nestring_delete_title')}
                                  onClick={e => { e.stopPropagation(); setDeleteNestringId(r.id); }}>
                                  ×
                                </button>
                              )}
                            </>
                          )}
                        </span>
                      );
                    })}
                  </div>
                )}
                {canNestAdd && isRingbaar && (
                  <button
                    className="bezoek-item__ring-btn"
                    type="button"
                    onClick={() => navigate(`/nest/bezoek/${bezoek.id}/ringen`)}
                  >
                    <IconRing size={13} /> {t('nest_btn_ringen_pulli')}
                  </button>
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
