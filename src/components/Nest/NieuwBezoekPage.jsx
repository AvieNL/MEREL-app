import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/index.js';
import { useNestData } from '../../hooks/useNestData';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import { berekenVervolgbezoekInfo, isAfsluitendStadium } from '../../utils/nestSuggestie';
import NestSoortInfoPanel from './NestSoortInfoPanel';
import NestSoortPicker from './NestSoortPicker';
import {
  BETROUWB_DATUM_CODES, BETROUWB_AANTAL_CODES, BETROUWB_DAGEN_CODES,
  SUCCES2_CODES, MOMENT_CODES, PREDATIE_CODES, METHODE_CODES, VERLIES_CODES,
  EISUCCES_CODES, VINDSTATUS_CODES,
} from '../../data/sovon-codes';
import StadiumPicker from './StadiumPicker';
import './NieuwNestPage.css';
import './NieuwBezoekPage.css';

const HUIDIG_JAAR = new Date().getFullYear();

function vandaag() { return new Date().toISOString().slice(0, 10); }
function nuTijd()  { const d = new Date(); return `${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}`; }

/**
 * Formulier voor een nieuw nestbezoek.
 *
 * Twee toegangspunten:
 *   /nest/bezoek/nieuw              → nestpicker tonen, seizoen/legsel auto aanmaken
 *   /nest/legsel/:legselId/bezoek/nieuw → legsel bekend, nestpicker overslaan
 */
export default function NieuwBezoekPage() {
  const { legselId: legselIdParam } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || 'nl';
  const navigate = useNavigate();
  const { nesten, legsels, bezoeken, addLegsel, addBezoek, updateLegsel } = useNestData();
  const species = useSpeciesRef();

  // ── Nest- en legsel-context ───────────────────────────────────────────────
  const [nestZoek, setNestZoek] = useState('');
  const [geselecteerdNestId, setGeselecteerdNestId] = useState('');
  // null = auto, legsel.id = specifiek, 'nieuw' = aanmaken
  const [geselecteerdLegsel, setGeselecteerdLegsel] = useState(null);

  // ── Bezoek velden ─────────────────────────────────────────────────────────
  const [datum,            setDatum]            = useState(vandaag());
  const [tijd,             setTijd]             = useState(nuTijd());
  const [stadiumPrimair,   setStadiumPrimair]   = useState('');
  const [stadiumSecundair, setStadiumSecundair] = useState('');
  const [aantalEieren,     setAantalEieren]     = useState('');
  const [eiDood,           setEiDood]           = useState('');
  const [aantalPulli,      setAantalPulli]      = useState('');
  const [jongDood,         setJongDood]         = useState('');
  const [datum1eEi,        setDatum1eEi]        = useState('');
  const [eistartmarge,     setEistartmarge]     = useState('');
  const [opmerkingen,      setOpmerkingen]      = useState('');

  const [betrouwbOpen,   setBetrouwbOpen]   = useState(false);
  const [betrouwbDatum,  setBetrouwbDatum]  = useState(1);
  const [betrouwbAantal, setBetrouwbAantal] = useState(1);
  const [betrouwbDagen,  setBetrouwbDagen]  = useState(2);

  const [nestsucces, setNestsucces] = useState('');
  const [succes2,    setSucces2]    = useState('');
  const [moment,     setMoment]     = useState('');
  const [predatie,   setPredatie]   = useState('');
  const [methode,    setMethode]    = useState('');
  const [verlies,    setVerlies]    = useState('');
  const [eisucces,   setEisucces]   = useState('');
  const [vindstatus, setVindstatus] = useState('');

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // ── Soortkaart ────────────────────────────────────────────────────────────
  const speciesByEuring = useMemo(() => {
    const map = {};
    species.forEach(s => { if (s.euring_code) map[s.euring_code] = s; });
    return map;
  }, [species]);

  // ── Legsel uit URL (bekend pad) ───────────────────────────────────────────
  const legselFromUrl = legselIdParam ? legsels.find(l => l.id === legselIdParam) : null;
  const nestFromUrl   = legselFromUrl ? nesten.find(n => n.id === legselFromUrl.nest_id) : null;

  // Pre-vul nest en legsel als legselId bekend is via URL
  useEffect(() => {
    if (legselIdParam && nestFromUrl && !geselecteerdNestId) {
      setGeselecteerdNestId(nestFromUrl.id);
      setGeselecteerdLegsel(legselIdParam);
    }
  }, [legselIdParam, nestFromUrl?.id]);

  // ── Nest-afleiding ────────────────────────────────────────────────────────
  const geselecteerdNest = useMemo(
    () => nesten.find(n => n.id === geselecteerdNestId) || null,
    [nesten, geselecteerdNestId],
  );

  // ── Nestzoekfilter (alleen nodig zonder URL-legsel) ───────────────────────
  const gefilterdeNesten = useMemo(() => {
    if (legselIdParam || !nestZoek) return [];
    const term = nestZoek.toLowerCase();
    return nesten.filter(n => {
      const vogelNaam = n.soort_euring
        ? (speciesByEuring[n.soort_euring]?.[`naam_${lang}`] || speciesByEuring[n.soort_euring]?.naam_nl || '')
        : '';
      return (
        n.kastnummer?.toLowerCase().includes(term) ||
        n.omschrijving?.toLowerCase().includes(term) ||
        vogelNaam.toLowerCase().includes(term) ||
        n.eigenaar_naam?.toLowerCase().includes(term) ||
        n.adres?.toLowerCase().includes(term)
      );
    }).slice(0, 15);
  }, [nestZoek, nesten, speciesByEuring, lang, legselIdParam]);

  // ── Legsels voor huidig jaar ──────────────────────────────────────────────
  const seizoenLegsels = useMemo(() => {
    if (!geselecteerdNest) return [];
    return legsels
      .filter(l => l.nest_id === geselecteerdNest.id && l.jaar === HUIDIG_JAAR)
      .sort((a, b) => a.volgnummer - b.volgnummer);
  }, [geselecteerdNest, legsels]);

  // Auto-selecteer enkel legsel (alleen in het vrije pad)
  useEffect(() => {
    if (legselIdParam) return;
    if (!geselecteerdNest) { setGeselecteerdLegsel(null); return; }
    if (seizoenLegsels.length === 1) setGeselecteerdLegsel(seizoenLegsels[0].id);
    else setGeselecteerdLegsel(null);
  }, [geselecteerdNest?.id, seizoenLegsels.length, legselIdParam]);

  // ── Soort per bezoek ──────────────────────────────────────────────────────
  const [soortEuring, setSoortEuring] = useState('');

  const actiefLegselId = legselIdParam
    || (geselecteerdLegsel && geselecteerdLegsel !== 'nieuw' ? geselecteerdLegsel : null)
    || (seizoenLegsels.length === 1 ? seizoenLegsels[0].id : null);

  useEffect(() => {
    if (!geselecteerdNestId) { setSoortEuring(''); return; }
    if (actiefLegselId) {
      const eerdereSoort = bezoeken
        .filter(b => b.legsel_id === actiefLegselId && b.soort_euring)
        .sort((a, b) => b.datum.localeCompare(a.datum))[0]?.soort_euring;
      if (eerdereSoort) { setSoortEuring(eerdereSoort); return; }
    }
    setSoortEuring(seizoenLegsels[0]?.soort_euring || geselecteerdNest?.soort_euring || '');
  }, [geselecteerdNestId, actiefLegselId, bezoeken.length, seizoenLegsels]);

  const soort = useMemo(
    () => (soortEuring ? speciesByEuring[soortEuring] || null : null),
    [soortEuring, speciesByEuring],
  );

  // ── Suggestie ─────────────────────────────────────────────────────────────
  const suggestieInfo = useMemo(
    () => berekenVervolgbezoekInfo(stadiumPrimair, datum, soort),
    [stadiumPrimair, datum, soort],
  );
  const suggestie = suggestieInfo?.datum ?? null;

  const isAfsluitend = useMemo(() => isAfsluitendStadium(stadiumPrimair), [stadiumPrimair]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  function nestDisplayNaam(nest) {
    const vogelNaam = nest.soort_euring
      ? (speciesByEuring[nest.soort_euring]?.[`naam_${lang}`] || speciesByEuring[nest.soort_euring]?.naam_nl)
      : null;
    return `⌂ ${nest.kastnummer}${nest.omschrijving ? ` — ${nest.omschrijving}` : ''}${vogelNaam ? ` (${vogelNaam})` : ''}`;
  }

  // ── Validatie ─────────────────────────────────────────────────────────────
  function validate() {
    const errs = {};
    if (!geselecteerdNestId) errs.nest = true;
    if (!stadiumPrimair)     errs.stadium = true;
    return errs;
  }

  // ── Opslaan ───────────────────────────────────────────────────────────────
  async function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    try {
      let doelLegselId;

      if (legselIdParam) {
        // Legsel was al bekend via de URL
        doelLegselId = legselIdParam;
      } else {
        // Legsel zoeken of aanmaken
        doelLegselId = (geselecteerdLegsel && geselecteerdLegsel !== 'nieuw') ? geselecteerdLegsel : null;
        if (!doelLegselId) {
          const bestaande = legsels.filter(l => l.nest_id === geselecteerdNestId && l.jaar === HUIDIG_JAAR);
          const volgnummer = bestaande.length > 0 ? Math.max(...bestaande.map(l => l.volgnummer)) + 1 : 1;
          const link_type  = bestaande.length > 0 ? 1 : 0;
          doelLegselId = await addLegsel({ nest_id: geselecteerdNestId, jaar: HUIDIG_JAAR, volgnummer, link_type });
        }
      }

      await addBezoek({
        legsel_id:       doelLegselId,
        datum,
        tijd:            tijd || null,
        stadium:         stadiumPrimair,
        stadium2:        stadiumSecundair || null,
        aantal_eieren:   aantalEieren !== '' ? parseInt(aantalEieren, 10) : null,
        ei_dood:         eiDood !== '' ? parseInt(eiDood, 10) : null,
        aantal_pulli:    aantalPulli !== '' ? parseInt(aantalPulli, 10) : null,
        jong_dood:       jongDood !== '' ? parseInt(jongDood, 10) : null,
        betrouwb_datum:  betrouwbDatum,
        betrouwb_aantal: betrouwbAantal,
        betrouwb_dagen:  betrouwbDagen,
        opmerkingen,
        soort_euring:    soortEuring || null,
        volgende_bezoek_suggestie: suggestie || null,
        volgende_bezoek_type:      suggestieInfo?.type || null,
      });

      // Datum eerste ei opslaan op het legsel als het nieuw is en datum opgegeven
      if (datum1eEi) {
        await updateLegsel(doelLegselId, {
          datum_1e_ei:    datum1eEi,
          eistartmarge:   eistartmarge !== '' ? parseInt(eistartmarge, 10) : null,
        });
      }

      if (isAfsluitend) {
        await updateLegsel(doelLegselId, {
          nestsucces:  nestsucces  !== '' ? parseInt(nestsucces,  10) : null,
          succes2:     succes2     || null,
          moment:      moment      !== '' ? parseInt(moment,     10) : null,
          predatie:    predatie    !== '' ? parseInt(predatie,   10) : null,
          methode:     methode     !== '' ? parseInt(methode,    10) : null,
          verlies:     verlies     || null,
          eisucces:    eisucces    !== '' ? parseInt(eisucces,   10) : null,
          vindstatus:  vindstatus  !== '' ? parseInt(vindstatus, 10) : null,
        });
      }

      navigate(`/nest/${geselecteerdNestId}`);
    } finally {
      setSaving(false);
    }
  }

  // ── Nestsoort-afwijking check ─────────────────────────────────────────────
  const nestStandaardEuring = seizoenLegsels[0]?.soort_euring || geselecteerdNest?.soort_euring;
  const soortWijktAf = nestStandaardEuring && soortEuring && soortEuring !== nestStandaardEuring;

  return (
    <div className="page nieuw-nest-page">

      {/* ── Sticky topbar ── */}
      <div className="nieuw-sticky-header">
        <div className="nieuw-topbar">
          <span className="nieuw-topbar-titel">
            {geselecteerdNest ? nestDisplayNaam(geselecteerdNest) : t('nest_new_bezoek_title')}
          </span>
          <button type="button" className="btn-primary nieuw-topbar-btn"
            onClick={handleSave} disabled={saving}>
            {saving ? t('btn_saving') : t('btn_save')}
          </button>
        </div>
      </div>

      {/* ── Nestkast selectie (alleen zonder URL-legsel) ── */}
      {!legselIdParam && (
        <div className="section">
          <div className="section-header">
            <h3>
              {t('nest_section_pick_nest')}
              {errors.nest && <span className="field-error"> *</span>}
            </h3>
          </div>
          <div className="section-content">
            <div className="form-group">
              <div className="soort-zoeker">
                <input
                  type="text"
                  value={nestZoek || (geselecteerdNest ? nestDisplayNaam(geselecteerdNest) : '')}
                  onChange={e => {
                    setNestZoek(e.target.value);
                    if (!e.target.value) { setGeselecteerdNestId(''); setGeselecteerdLegsel(null); }
                    if (errors.nest) setErrors(prev => ({ ...prev, nest: false }));
                  }}
                  placeholder={t('nest_pick_placeholder')}
                  autoFocus
                />
                {gefilterdeNesten.length > 0 && (
                  <div className="soort-zoeker__dropdown">
                    {gefilterdeNesten.map(n => (
                      <button key={n.id} type="button" className="soort-zoeker__item"
                        onClick={() => { setGeselecteerdNestId(n.id); setNestZoek(''); }}>
                        <span>⌂ {n.kastnummer}{n.omschrijving ? ` — ${n.omschrijving}` : ''}</span>
                        {n.soort_euring && (
                          <span className="soort-zoeker__latin">
                            {speciesByEuring[n.soort_euring]?.naam_nl || n.soort_euring}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Legsel kiezer bij meerdere bestaande legsels */}
            {geselecteerdNest && seizoenLegsels.length > 1 && (
              <div className="form-group">
                <label>{t('nest_kies_legsel')}</label>
                <div className="legsel-keuze">
                  {seizoenLegsels.map(l => (
                    <button key={l.id} type="button"
                      className={`legsel-keuze-knop${geselecteerdLegsel === l.id ? ' legsel-keuze-knop--actief' : ''}`}
                      onClick={() => setGeselecteerdLegsel(l.id)}>
                      {t('nest_legsel_nr', { nr: l.volgnummer })}
                    </button>
                  ))}
                  <button type="button"
                    className={`legsel-keuze-knop${geselecteerdLegsel === 'nieuw' ? ' legsel-keuze-knop--actief' : ''}`}
                    onClick={() => setGeselecteerdLegsel('nieuw')}>
                    + {t('nest_nieuw_legsel')}
                  </button>
                </div>
              </div>
            )}

            {geselecteerdNest && seizoenLegsels.length === 0 && (
              <p className="admin-hint">{t('nest_auto_seizoen_hint', { jaar: HUIDIG_JAAR })}</p>
            )}
          </div>
        </div>
      )}

      {/* ── Datum en tijd ── */}
      <div className="section">
        <div className="section-content">
          <div className="form-row form-row--datum-tijd">
            <div className="form-group">
              <label>{t('form_date')}</label>
              <input type="date" value={datum} onChange={e => setDatum(e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t('form_time_hhmm')}</label>
              <input type="text" inputMode="numeric" maxLength={5}
                value={tijd} onChange={e => setTijd(e.target.value)}
                placeholder={t('form_time_placeholder')} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Soort (alleen tonen als nest geselecteerd) ── */}
      {geselecteerdNestId && (
        <div className="section">
          <div className="section-header"><h3>{t('nest_soort_bezoek')}</h3></div>
          <div className="section-content">
            <NestSoortPicker
              species={species}
              value={soortEuring}
              onChange={(code) => setSoortEuring(code)}
              lang={lang}
            />
            {soortWijktAf && (
              <p className="nest-soort-afwijking">
                {t('nest_soort_afwijking', {
                  soort: speciesByEuring[nestStandaardEuring]?.[`naam_${lang}`]
                    || speciesByEuring[nestStandaardEuring]?.naam_nl
                    || nestStandaardEuring,
                })}
              </p>
            )}
            <NestSoortInfoPanel soort={soort} stadium={stadiumPrimair} />
          </div>
        </div>
      )}

      {/* ── Stadium ── */}
      <div className="section">
        <div className="section-header">
          <h3>
            {t('nest_stadium')}
            {errors.stadium && <span className="field-error"> *</span>}
          </h3>
        </div>
        <div className="section-content">
          <StadiumPicker
            primair={stadiumPrimair}
            secundair={stadiumSecundair}
            onChangePrimair={code => { setStadiumPrimair(code); setErrors(prev => ({ ...prev, stadium: false })); }}
            onChangeSecundair={setStadiumSecundair}
            aantalEieren={aantalEieren}
            onChangeAantalEieren={setAantalEieren}
            aantalPulli={aantalPulli}
            onChangeAantalPulli={setAantalPulli}
            error={errors.stadium}
          />
          {(stadiumPrimair?.startsWith('E') || aantalEieren !== '' || stadiumPrimair?.startsWith('N') || aantalPulli !== '') && (
            <div className="form-row form-row--dood">
              {(stadiumPrimair?.startsWith('E') || aantalEieren !== '') && (
                <div className="form-group">
                  <label>{t('nest_ei_dood')}</label>
                  <input type="number" inputMode="numeric" min="0" max="30"
                    value={eiDood} onChange={e => setEiDood(e.target.value)} placeholder="0" />
                </div>
              )}
              {(stadiumPrimair?.startsWith('N') || aantalPulli !== '') && (
                <div className="form-group">
                  <label>{t('nest_jong_dood')}</label>
                  <input type="number" inputMode="numeric" min="0" max="30"
                    value={jongDood} onChange={e => setJongDood(e.target.value)} placeholder="0" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Legselgegevens (alleen bij nieuw legsel) ── */}
      {geselecteerdNestId && (seizoenLegsels.length === 0 || geselecteerdLegsel === 'nieuw') && (
        <div className="section">
          <div className="section-header"><h3>{t('nest_legsel_details')}</h3></div>
          <div className="section-content">
            <p className="admin-hint">{t('nest_legsel_details_hint')}</p>
            <div className="form-row">
              <div className="form-group">
                <label>{t('nest_datum_1e_ei')}</label>
                <input type="date" value={datum1eEi} onChange={e => setDatum1eEi(e.target.value)} />
              </div>
              <div className="form-group">
                <label>{t('nest_eistartmarge')}</label>
                <input type="number" inputMode="numeric" min="0" max="14"
                  value={eistartmarge} onChange={e => setEistartmarge(e.target.value)} placeholder="0" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Nestsucces (bij C-/X-stadium) ── */}
      {isAfsluitend && (
        <div className="section">
          <div className="section-header"><h3>{t('nest_section_nestsucces')}</h3></div>
          <div className="section-content">
            <div className="form-row">
              <div className="form-group">
                <label>{t('nest_nestsucces_aantal')}</label>
                <input type="number" min="-1" max="25"
                  value={nestsucces} onChange={e => setNestsucces(e.target.value)} placeholder="-1" />
                <span className="field-hint">{t('nest_nestsucces_hint')}</span>
              </div>
              <div className="form-group">
                <label>{t('nest_succes2')}</label>
                <select value={succes2} onChange={e => setSucces2(e.target.value)}>
                  <option value="">{t('nest_code_optional')}</option>
                  {SUCCES2_CODES.map(c => <option key={c.code} value={c.code}>{c.nl}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('nest_methode')}</label>
                <select value={methode} onChange={e => setMethode(e.target.value)}>
                  <option value="">{t('nest_code_optional')}</option>
                  {METHODE_CODES.map(c => <option key={c.code} value={c.code}>{c.nl}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>{t('nest_moment')}</label>
                <select value={moment} onChange={e => setMoment(e.target.value)}>
                  <option value="">{t('nest_code_optional')}</option>
                  {MOMENT_CODES.map(c => <option key={c.code} value={c.code}>{c.nl}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('nest_predatie')}</label>
                <select value={predatie} onChange={e => setPredatie(e.target.value)}>
                  <option value="">{t('nest_code_optional')}</option>
                  {PREDATIE_CODES.map(c => <option key={c.code} value={c.code}>{c.nl}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>{t('nest_verlies')}</label>
                <select value={verlies} onChange={e => setVerlies(e.target.value)}>
                  <option value="">{t('nest_code_optional')}</option>
                  {VERLIES_CODES.map(c => <option key={c.code} value={c.code}>{c.nl}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('nest_eisucces')}</label>
                <select value={eisucces} onChange={e => setEisucces(e.target.value)}>
                  <option value="">{t('nest_code_optional')}</option>
                  {EISUCCES_CODES.map(c => <option key={c.code} value={c.code}>{c.nl}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>{t('nest_vindstatus')}</label>
                <select value={vindstatus} onChange={e => setVindstatus(e.target.value)}>
                  <option value="">{t('nest_code_optional')}</option>
                  {VINDSTATUS_CODES.map(c => <option key={c.code} value={c.code}>{c.nl}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Opmerkingen ── */}
      <div className="section">
        <div className="section-content">
          <div className="form-group">
            <label>{t('form_remarks')}</label>
            <textarea value={opmerkingen} onChange={e => setOpmerkingen(e.target.value)}
              rows={3} placeholder={t('nest_opmerkingen_placeholder')} />
          </div>
        </div>
      </div>

      {/* ── Betrouwbaarheid (inklapbaar) ── */}
      <div className="section">
        <div className="section-header" onClick={() => setBetrouwbOpen(o => !o)} style={{ cursor: 'pointer' }}>
          <h3>{t('nest_section_betrouwb')}</h3>
          <span className={`toggle ${betrouwbOpen ? 'open' : ''}`}>▾</span>
        </div>
        {betrouwbOpen && (
          <div className="section-content">
            <p className="admin-hint">{t('nest_betrouwb_hint')}</p>
            <div className="form-group">
              <label>{t('nest_betrouwb_datum')}</label>
              <select value={betrouwbDatum} onChange={e => setBetrouwbDatum(Number(e.target.value))}>
                {BETROUWB_DATUM_CODES.map(c => <option key={c.code} value={c.code}>{c[i18n.language] ?? c.nl}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>{t('nest_betrouwb_aantal')}</label>
              <select value={betrouwbAantal} onChange={e => setBetrouwbAantal(Number(e.target.value))}>
                {BETROUWB_AANTAL_CODES.map(c => <option key={c.code} value={c.code}>{c[i18n.language] ?? c.nl}</option>)}
              </select>
            </div>
            {(stadiumPrimair === 'N+' || stadiumPrimair?.startsWith('N')) && (
              <div className="form-group">
                <label>{t('nest_betrouwb_dagen')}</label>
                <select value={betrouwbDagen} onChange={e => setBetrouwbDagen(Number(e.target.value))}>
                  {BETROUWB_DAGEN_CODES.map(c => <option key={c.code} value={c.code}>{c[i18n.language] ?? c.nl}</option>)}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Vervolgbezoeksuggestie ── */}
      {suggestie && (() => {
        const [y, m, d] = suggestie.split('-');
        const datumFormatted = `${d}-${m}-${y}`;
        const dagenAf = Math.round((new Date(suggestie) - new Date(vandaag())) / 86400000);
        const typeIcons = {
          ringen:     '🔖',
          nacontrole: '🗓',
          eileg:      '🗓',
          jongen:     '🗓',
          bouw:       '🗓',
          check:      '🗓',
        };
        const typeKeys = {
          ringen:     'nest_suggestie_ringen',
          nacontrole: 'nest_suggestie_nacontrole',
          eileg:      'nest_suggestie_eileg',
          jongen:     'nest_suggestie_jongen',
          bouw:       'nest_suggestie_bouw',
          check:      'nest_suggestie_check',
        };
        const type = suggestieInfo?.type ?? 'check';
        const icon = typeIcons[type] ?? '🗓';
        const labelStr = `${icon} ${t(typeKeys[type] ?? 'nest_suggestie_check')}`;
        return (
          <div className={`vervolgbezoek-suggestie${type === 'ringen' ? ' vervolgbezoek-suggestie--ringen' : ''}`}>
            <span className="vervolgbezoek-suggestie__label">{labelStr}</span>
            <strong className="vervolgbezoek-suggestie__datum">{datumFormatted}</strong>
            <span className="vervolgbezoek-suggestie__dagen">{t('nest_suggestie_over_dagen', { n: dagenAf })}</span>
          </div>
        );
      })()}

    </div>
  );
}
