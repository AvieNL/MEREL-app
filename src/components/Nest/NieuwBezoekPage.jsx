import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNestData } from '../../hooks/useNestData';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import { berekenVervolgbezoek, stadiumGroep, isAfsluitendStadium } from '../../utils/nestSuggestie';
import {
  STADIUM_CODES,
  BETROUWB_DATUM_CODES, BETROUWB_AANTAL_CODES, BETROUWB_DAGEN_CODES,
  SUCCES2_CODES, MOMENT_CODES, PREDATIE_CODES, METHODE_CODES, VERLIES_CODES,
  EISUCCES_CODES, VINDSTATUS_CODES,
} from '../../data/sovon-codes';
import './NieuwBezoekPage.css';

const STADIUM_GROEPEN = [
  { id: 'leeg',       label: 'L — Leeg' },
  { id: 'bouw',       label: 'B — Nestbouw' },
  { id: 'ouders',     label: 'P — Ouders' },
  { id: 'eieren',     label: 'E — Eieren' },
  { id: 'pulli',      label: 'N — Pulli' },
  { id: 'nacontrole', label: 'C — Nacontrole' },
  { id: 'overig',     label: 'X — Overig' },
];

function vandaag() {
  return new Date().toISOString().slice(0, 10);
}

function nuTijd() {
  return new Date().toTimeString().slice(0, 5);
}

export default function NieuwBezoekPage() {
  const { legselId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { legsels, seizoenen, nesten, bezoeken, addBezoek, updateLegsel } = useNestData();
  const species = useSpeciesRef();

  const [datum, setDatum] = useState(vandaag());
  const [tijd, setTijd] = useState(nuTijd());
  const [stadium, setStadium] = useState('');
  const [aantalEieren, setAantalEieren] = useState('');
  const [aantalPulli, setAantalPulli] = useState('');
  const [opmerkingen, setOpmerkingen] = useState('');
  const [betrouwbOpen, setBetrouwbOpen] = useState(false);
  const [betrouwbDatum, setBetrouwbDatum] = useState(1);
  const [betrouwbAantal, setBetrouwbAantal] = useState(1);
  const [betrouwbDagen, setBetrouwbDagen] = useState(1);
  // Nestsucces (bij C-stadium)
  const [nestsucces, setNestsucces] = useState('');
  const [succes2, setSucces2] = useState('');
  const [moment, setMoment] = useState('');
  const [predatie, setPredatie] = useState('');
  const [methode, setMethode] = useState('');
  const [verlies, setVerlies] = useState('');
  const [eisucces, setEisucces] = useState('');
  const [vindstatus, setVindstatus] = useState('');

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Opzoeken van legsel → seizoen → nest → soort
  const legsel = legsels.find(l => l.id === legselId);
  const seizoen = legsel ? seizoenen.find(s => s.id === legsel.nest_seizoen_id) : null;
  const nest = seizoen ? nesten.find(n => n.id === seizoen.nest_id) : null;

  const soort = useMemo(() => {
    if (!seizoen?.soort_euring) return null;
    return species.find(s => s.euring_code === seizoen.soort_euring) || null;
  }, [seizoen, species]);

  // Vervolgbezoeksuggestie: herberekenen bij elke stadiumwijziging
  const suggestie = useMemo(() => {
    if (!stadium || !datum) return null;
    return berekenVervolgbezoek(stadium, datum, soort);
  }, [stadium, datum, soort]);

  const groepVanStadium = useMemo(() => stadiumGroep(stadium), [stadium]);
  const isAfsluitend = useMemo(() => isAfsluitendStadium(stadium), [stadium]);

  // Reset stadiumspecifieke velden bij stadiumwijziging
  useEffect(() => {
    setAantalEieren('');
    setAantalPulli('');
  }, [groepVanStadium]);

  function validate() {
    const errs = {};
    if (!stadium) errs.stadium = true;
    return errs;
  }

  async function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    try {
      await addBezoek({
        legsel_id: legselId,
        datum,
        tijd: tijd || null,
        stadium,
        aantal_eieren: aantalEieren !== '' ? parseInt(aantalEieren, 10) : null,
        aantal_pulli:  aantalPulli  !== '' ? parseInt(aantalPulli,  10) : null,
        betrouwb_datum:  betrouwbDatum,
        betrouwb_aantal: betrouwbAantal,
        betrouwb_dagen:  betrouwbDagen,
        opmerkingen,
        volgende_bezoek_suggestie: suggestie || null,
      });

      // Bij afsluitend stadium: sla nestsucces op in legsel
      if (isAfsluitend && legsel) {
        await updateLegsel(legselId, {
          nestsucces:  nestsucces !== '' ? parseInt(nestsucces, 10) : null,
          succes2:     succes2     || null,
          moment:      moment      !== '' ? parseInt(moment,    10) : null,
          predatie:    predatie    !== '' ? parseInt(predatie,  10) : null,
          methode:     methode     !== '' ? parseInt(methode,   10) : null,
          verlies:     verlies     || null,
          eisucces:    eisucces    !== '' ? parseInt(eisucces,  10) : null,
          vindstatus:  vindstatus  !== '' ? parseInt(vindstatus,10) : null,
        });
      }

      navigate(`/nest/${nest?.id || ''}`);
    } finally {
      setSaving(false);
    }
  }

  if (!legsel) {
    return (
      <div className="page">
        <p style={{ color: 'var(--text-secondary)' }}>{t('nest_not_found')}</p>
      </div>
    );
  }

  return (
    <div className="page nieuw-bezoek-page">
      <div className="nieuw-nest-header">
        <button className="btn-back" onClick={() => navigate(`/nest/${nest?.id || ''}`)}>
          ‹ {t('btn_back')}
        </button>
        <div>
          <h2>{t('nest_new_bezoek_title')}</h2>
          <p className="nieuw-bezoek-context">
            #{nest?.kastnummer} · {t('nest_legsel_nr', { nr: legsel.volgnummer })}
            {soort && ` · ${soort.naam_nl}`}
          </p>
        </div>
      </div>

      {/* ── Datum en tijd ── */}
      <div className="section">
        <div className="section-content">
          <div className="form-row">
            <div className="form-group">
              <label>{t('form_date')}</label>
              <input type="date" value={datum} onChange={e => setDatum(e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t('form_time_optional')}</label>
              <input type="time" value={tijd} onChange={e => setTijd(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Stadium ── */}
      <div className="section">
        <div className="section-header">
          <h3>{t('nest_stadium')}{errors.stadium && <span className="field-error"> *</span>}</h3>
        </div>
        <div className="section-content">
          {STADIUM_GROEPEN.map(groep => {
            const codesInGroep = STADIUM_CODES.filter(s => s.groep === groep.id);
            if (codesInGroep.length === 0) return null;
            return (
              <div key={groep.id} className="stadium-groep">
                <span className="stadium-groep__label">{groep.label}</span>
                <div className="stadium-knoppen">
                  {codesInGroep.map(s => (
                    <button
                      key={s.code}
                      type="button"
                      className={`stadium-knop${stadium === s.code ? ' stadium-knop--actief' : ''}`}
                      onClick={() => { setStadium(s.code); setErrors(prev => ({ ...prev, stadium: false })); }}
                      title={s.nl}
                    >
                      {s.code}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          {stadium && (
            <p className="stadium-beschrijving">
              {STADIUM_CODES.find(s => s.code === stadium)?.nl || stadium}
            </p>
          )}
        </div>
      </div>

      {/* ── Aantallen (conditioneel) ── */}
      {groepVanStadium === 'eieren' && (
        <div className="section">
          <div className="section-content">
            <div className="form-group">
              <label>{t('nest_aantal_eieren')}</label>
              <input
                type="number" min="0" max="20"
                value={aantalEieren}
                onChange={e => setAantalEieren(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </div>
      )}

      {groepVanStadium === 'pulli' && (
        <div className="section">
          <div className="section-content">
            <div className="form-group">
              <label>{t('nest_aantal_pulli')}</label>
              <input
                type="number" min="0" max="20"
                value={aantalPulli}
                onChange={e => setAantalPulli(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Nestsucces (bij C- of X-stadium) ── */}
      {isAfsluitend && (
        <div className="section">
          <div className="section-header"><h3>{t('nest_section_nestsucces')}</h3></div>
          <div className="section-content">
            <div className="form-row">
              <div className="form-group">
                <label>{t('nest_nestsucces_aantal')}</label>
                <input
                  type="number" min="-1" max="25"
                  value={nestsucces}
                  onChange={e => setNestsucces(e.target.value)}
                  placeholder="-1"
                />
                <span className="field-hint">{t('nest_nestsucces_hint')}</span>
              </div>
              <div className="form-group">
                <label>{t('nest_succes2')}</label>
                <select value={succes2} onChange={e => setSucces2(e.target.value)}>
                  <option value="">{t('nest_code_optional')}</option>
                  {SUCCES2_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.nl}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('nest_methode')}</label>
                <select value={methode} onChange={e => setMethode(e.target.value)}>
                  <option value="">{t('nest_code_optional')}</option>
                  {METHODE_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.nl}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>{t('nest_moment')}</label>
                <select value={moment} onChange={e => setMoment(e.target.value)}>
                  <option value="">{t('nest_code_optional')}</option>
                  {MOMENT_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.nl}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('nest_predatie')}</label>
                <select value={predatie} onChange={e => setPredatie(e.target.value)}>
                  <option value="">{t('nest_code_optional')}</option>
                  {PREDATIE_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.nl}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>{t('nest_verlies')}</label>
                <select value={verlies} onChange={e => setVerlies(e.target.value)}>
                  <option value="">{t('nest_code_optional')}</option>
                  {VERLIES_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.nl}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('nest_eisucces')}</label>
                <select value={eisucces} onChange={e => setEisucces(e.target.value)}>
                  <option value="">{t('nest_code_optional')}</option>
                  {EISUCCES_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.nl}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>{t('nest_vindstatus')}</label>
                <select value={vindstatus} onChange={e => setVindstatus(e.target.value)}>
                  <option value="">{t('nest_code_optional')}</option>
                  {VINDSTATUS_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.nl}</option>
                  ))}
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
            <textarea
              value={opmerkingen}
              onChange={e => setOpmerkingen(e.target.value)}
              rows={3}
              placeholder={t('nest_opmerkingen_placeholder')}
            />
          </div>
        </div>
      </div>

      {/* ── Betrouwbaarheid (inklapbaar) ── */}
      <div className="section">
        <div
          className="section-header"
          onClick={() => setBetrouwbOpen(o => !o)}
          style={{ cursor: 'pointer' }}
        >
          <h3>{t('nest_section_betrouwb')}</h3>
          <span className={`toggle ${betrouwbOpen ? 'open' : ''}`}>▾</span>
        </div>
        {betrouwbOpen && (
          <div className="section-content">
            <p className="admin-hint">{t('nest_betrouwb_hint')}</p>
            <div className="form-group">
              <label>{t('nest_betrouwb_datum')}</label>
              <select value={betrouwbDatum} onChange={e => setBetrouwbDatum(Number(e.target.value))}>
                {BETROUWB_DATUM_CODES.map(c => (
                  <option key={c.code} value={c.code}>{c.nl}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>{t('nest_betrouwb_aantal')}</label>
              <select value={betrouwbAantal} onChange={e => setBetrouwbAantal(Number(e.target.value))}>
                {BETROUWB_AANTAL_CODES.map(c => (
                  <option key={c.code} value={c.code}>{c.nl}</option>
                ))}
              </select>
            </div>
            {groepVanStadium === 'pulli' && (
              <div className="form-group">
                <label>{t('nest_betrouwb_dagen')}</label>
                <select value={betrouwbDagen} onChange={e => setBetrouwbDagen(Number(e.target.value))}>
                  {BETROUWB_DAGEN_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.nl}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Vervolgbezoeksuggestie ── */}
      {suggestie && (
        <div className="vervolgbezoek-suggestie">
          <span className="vervolgbezoek-suggestie__label">🗓 {t('nest_suggestie_label')}</span>
          <strong className="vervolgbezoek-suggestie__datum">{suggestie}</strong>
          {soort && (
            <span className="vervolgbezoek-suggestie__basis">
              ({t('nest_suggestie_basis', {
                soort: soort.naam_nl,
                ei: soort.nest_ei_dagen ?? '?',
                jong: soort.nest_jong_dagen ?? '?',
              })})
            </span>
          )}
        </div>
      )}

      <div className="nieuw-nest-acties">
        <button className="btn-secondary" onClick={() => navigate(`/nest/${nest?.id || ''}`)} disabled={saving}>
          {t('btn_cancel')}
        </button>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? t('btn_saving') : t('btn_save')}
        </button>
      </div>
    </div>
  );
}
