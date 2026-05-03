import { useState, useEffect, useCallback } from 'react';
import BronBadge from '../shared/BronBadge';
import './Determinatie.css';

/**
 * DeterminatieModal
 *
 * Props:
 *   aid         — de aid-definitie uit determinatie/index.js
 *   formValues  — huidige formulierwaarden (null in naslag-modus)
 *   onGebruik   — callback(veld, waarde) om resultaat terug te schrijven (null in naslag-modus)
 *   onSluit     — sluit de modal
 */
export default function DeterminatieModal({ aid, getAidById, formValues, onGebruik, onSluit }) {
  const stappenIds = Object.keys(aid.stappen);
  const [geschiedenis, setGeschiedenis] = useState([]);
  const [huidigeStapId, setHuidigeStapId] = useState(null);
  const [keuzes, setKeuzes] = useState({});
  const [metingen, setMetingen] = useState({});
  const [resultaat, setResultaat] = useState(null);
  const [verwijzingAid, setVerwijzingAid] = useState(null); // genest venster

  // Initialiseer: doorloop auto-stappen
  useEffect(() => {
    if (!aid) return;
    startSurvey();
  }, [aid]); // eslint-disable-line react-hooks/exhaustive-deps

  function startSurvey(extraFormValues = {}) {
    setGeschiedenis([]);
    setKeuzes({});
    setMetingen({});
    setResultaat(null);
    setVerwijzingAid(null);
    const effectief = formValues ? { ...formValues, ...extraFormValues } : null;
    verwerkStap(aid.start, {}, {}, [], effectief);
  }

  /**
   * Probeer stap automatisch op te lossen vanuit formulierwaarden.
   * effectiefFormValues is formValues + eventuele overrides na een geneste terugkoppeling.
   */
  function verwerkStap(stapId, huidigKeuzes, huidigMetingen, huidigGeschiedenis, effectiefFormValues = formValues) {
    const stap = aid.stappen[stapId];
    if (!stap) return;

    const nieuweGeschiedenis = [...huidigGeschiedenis, stapId];

    // Auto-resolve keuze-stap via formulierwaarden
    if (stap.type === 'keuze' && stap.uit_formulier && effectiefFormValues) {
      const { veld, transform } = stap.uit_formulier;
      const rawWaarde = effectiefFormValues[veld];
      const autoWaarde = transform ? transform(rawWaarde) : rawWaarde;

      if (autoWaarde !== null && autoWaarde !== undefined) {
        const optie = stap.opties.find(o => o.waarde === autoWaarde);
        if (optie) {
          const nieuweKeuzes = { ...huidigKeuzes, [stapId]: autoWaarde };
          if (optie.resultaat) {
            setGeschiedenis(nieuweGeschiedenis);
            setKeuzes(nieuweKeuzes);
            setResultaat(optie.resultaat);
            setHuidigeStapId(null);
            return;
          }
          if (optie.volgende) {
            // Ga stil door naar volgende stap
            verwerkStap(optie.volgende, nieuweKeuzes, huidigMetingen, nieuweGeschiedenis, effectiefFormValues);
            return;
          }
        }
      }
    }

    // Pre-fill meting-inputs vanuit formulierwaarden
    if (stap.type === 'meting' && effectiefFormValues) {
      const preFill = {};
      stap.inputs.forEach(inp => {
        if (inp.uit_formulier && effectiefFormValues[inp.uit_formulier]) {
          preFill[inp.key] = String(effectiefFormValues[inp.uit_formulier]);
        }
      });
      if (Object.keys(preFill).length > 0) {
        setMetingen(prev => ({ ...preFill, ...prev }));
      }
    }

    // Toon de stap
    setGeschiedenis(nieuweGeschiedenis);
    setHuidigeStapId(stapId);
  }

  function kiesOptie(stap, optie) {
    const nieuweKeuzes = { ...keuzes, [stap.id]: optie.waarde };
    setKeuzes(nieuweKeuzes);

    if (optie.resultaat) {
      setResultaat(optie.resultaat);
      setHuidigeStapId(null);
      return;
    }
    if (optie.volgende) {
      verwerkStap(optie.volgende, nieuweKeuzes, metingen, geschiedenis);
    }
  }

  function berekenMetingen(stap) {
    const invoer = {};
    stap.inputs.forEach(inp => { invoer[inp.key] = metingen[inp.key] || ''; });
    const result = stap.bereken(invoer);
    if (result) {
      setResultaat(result);
      setHuidigeStapId(null);
    }
  }

  function gaTerug() {
    if (geschiedenis.length <= 1) return;
    const vorige = [...geschiedenis];
    vorige.pop(); // verwijder huidige
    const vorigeStapId = vorige[vorige.length - 1];
    setGeschiedenis(vorige);
    setHuidigeStapId(vorigeStapId);
    setResultaat(null);
    // Verwijder keuze van huidige stap
    const nieuweKeuzes = { ...keuzes };
    delete nieuweKeuzes[huidigeStapId];
    setKeuzes(nieuweKeuzes);
  }

  const aantalStappen = stappenIds.length;
  const huidigIndex  = huidigeStapId ? stappenIds.indexOf(huidigeStapId) : aantalStappen;

  const huidigeStap = huidigeStapId ? aid.stappen[huidigeStapId] : null;

  // Zijn meting-inputs voldoende ingevuld?
  const metingenCompleet = huidigeStap?.type === 'meting'
    ? huidigeStap.inputs.every(inp => {
        const v = metingen[inp.key];
        return v && v !== '' && !isNaN(parseFloat(String(v).replace(',', '.')));
      })
    : false;

  // Was een stap auto-resolved?
  function wasAuto(stapId) {
    const stap = aid.stappen[stapId];
    if (!stap || stap.type !== 'keuze' || !stap.uit_formulier || !formValues) return false;
    const { veld, transform } = stap.uit_formulier;
    const raw = formValues[veld];
    const auto = transform ? transform(raw) : raw;
    return auto !== null && auto !== undefined && stap.opties.some(o => o.waarde === auto);
  }

  // Verwijzing: open genest hulpvenster
  function openVerwijzing(stapVerwijzing) {
    const genestAid = getAidById ? getAidById(stapVerwijzing.aid_id) : null;
    if (genestAid) setVerwijzingAid(genestAid);
  }

  // Na "Gebruik dit resultaat" in het geneste venster:
  // schrijf terug naar het formulier én ga direct verder vanuit de huidige stap.
  // Niet herstarten — formValues-prop is nog niet bijgewerkt door React op dit moment.
  function verwijzingGebruikt(veld, waarde) {
    if (onGebruik) onGebruik(veld, waarde);
    setVerwijzingAid(null);

    // Huidige stap verwijst naar dit veld → bereken de auto-waarde en kies de optie
    if (huidigeStap?.type === 'keuze' && huidigeStap.uit_formulier?.veld === veld) {
      const { transform } = huidigeStap.uit_formulier;
      const autoWaarde = transform ? transform(waarde) : waarde;
      const optie = huidigeStap.opties?.find(o => o.waarde === autoWaarde);
      if (optie) {
        kiesOptie(huidigeStap, optie);
        return;
      }
    }
    // Fallback: geen directe koppeling, herstart de survey
    startSurvey({ [veld]: waarde });
  }

  const gekozenOptie = useCallback((stap) => {
    if (!stap) return null;
    const gekozen = keuzes[stap.id];
    return stap.opties?.find(o => o.waarde === gekozen) || null;
  }, [keuzes]);

  return (
    <div className="det-overlay" onClick={e => e.target === e.currentTarget && onSluit()}>
      <div className="det-modal">

        {/* Header */}
        <div className="det-header">
          <h2 className="det-title">{aid.naam}</h2>
          <button type="button" className="det-close" onClick={onSluit} aria-label="Sluiten">×</button>
        </div>
        {aid.bron && <BronBadge bron={aid.bron} />}

        {/* Voortgangsbalk */}
        <div className="det-voortgang" aria-hidden="true">
          {stappenIds.map((sid, i) => (
            <div
              key={sid}
              className={`det-stap-dot${
                resultaat ? ' det-stap-dot--gedaan'
                : i < huidigIndex ? ' det-stap-dot--gedaan'
                : i === huidigIndex ? ' det-stap-dot--actief'
                : ''
              }`}
            />
          ))}
        </div>

        {/* Huidige stap */}
        {huidigeStap && (
          <div className="det-stap">
            <div className="det-stap-label">{huidigeStap.label}</div>
            <div className="det-stap-vraag">{huidigeStap.vraag}</div>
            {huidigeStap.toelichting && (
              <div className="det-toelichting">{huidigeStap.toelichting}</div>
            )}

            {/* Verwijzing naar andere hulp */}
            {huidigeStap.verwijzing && (
              <div className="det-verwijzing">
                <span className="det-verwijzing__label">{huidigeStap.verwijzing.label}</span>
                <button
                  type="button"
                  className="det-verwijzing__btn"
                  onClick={() => openVerwijzing(huidigeStap.verwijzing)}
                >
                  🔍 {huidigeStap.verwijzing.knop_label}
                </button>
              </div>
            )}

            {/* Keuze */}
            {huidigeStap.type === 'keuze' && (
              <div className="det-opties">
                {huidigeStap.opties.map(optie => {
                  const isAuto = wasAuto(huidigeStap.id) && keuzes[huidigeStap.id] === optie.waarde;
                  const isActief = keuzes[huidigeStap.id] === optie.waarde;
                  return (
                    <button
                      key={optie.waarde}
                      type="button"
                      className={`det-optie${isActief ? ' det-optie--actief' : ''}${isAuto ? ' det-optie--auto' : ''}`}
                      onClick={() => kiesOptie(huidigeStap, optie)}
                    >
                      {isActief && <span className="det-optie__check">✓</span>}
                      {optie.label}
                      {isAuto && <span className="det-auto-label">uit formulier</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Meting */}
            {huidigeStap.type === 'meting' && (
              <>
                <div className="det-inputs">
                  {huidigeStap.inputs.map(inp => {
                    const vanFormulier = inp.uit_formulier && formValues?.[inp.uit_formulier];
                    return (
                      <div key={inp.key} className="det-input-group">
                        <label htmlFor={`det-inp-${inp.key}`}>{inp.label}</label>
                        <input
                          id={`det-inp-${inp.key}`}
                          type="number"
                          inputMode="decimal"
                          step={inp.decimalen === 0 ? '1' : '0.1'}
                          min={inp.min}
                          max={inp.max}
                          placeholder={inp.placeholder}
                          value={metingen[inp.key] ?? ''}
                          onChange={e => setMetingen(prev => ({ ...prev, [inp.key]: e.target.value }))}
                        />
                        {vanFormulier && (
                          <div className="det-input-auto-label">✓ overgenomen uit formulier</div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button
                  type="button"
                  className="det-bereken-btn"
                  disabled={!metingenCompleet}
                  onClick={() => berekenMetingen(huidigeStap)}
                >
                  Bereken
                </button>
              </>
            )}

            {/* Terug-knop */}
            {geschiedenis.length > 1 && (
              <button type="button" className="det-terug-btn" onClick={gaTerug}>← Terug</button>
            )}
          </div>
        )}

        {/* Genest hulpvenster voor verwijzingen */}
        {verwijzingAid && (
          <DeterminatieModal
            aid={verwijzingAid}
            getAidById={getAidById}
            formValues={formValues}
            onGebruik={verwijzingGebruikt}
            onSluit={() => setVerwijzingAid(null)}
          />
        )}

        {/* Resultaat */}
        {resultaat && (
          <>
            <div className={`det-resultaat det-resultaat--${resultaat.zeker ? 'zeker' : resultaat.waarde ? 'positief' : 'onzeker'}`}>
              <div className="det-resultaat__label">{resultaat.label}</div>
              <span className={`det-resultaat__zekerheid det-resultaat__zekerheid--${resultaat.zeker ? 'zeker' : resultaat.waarde ? 'mogelijk' : 'onbekend'}`}>
                {resultaat.zeker ? 'Zeker' : resultaat.waarde ? 'Mogelijk' : 'Niet te bepalen'}
              </span>
              {resultaat.uitleg && (
                <div className="det-resultaat__uitleg">{resultaat.uitleg}</div>
              )}
            </div>

            <div className="det-acties">
              {onGebruik && (
                <button
                  type="button"
                  className="det-gebruik-btn"
                  onClick={() => {
                    // Schrijf ingevulde meting-inputs terug naar het formulier
                    geschiedenis.forEach(stapId => {
                      const stap = aid.stappen[stapId];
                      if (stap?.type !== 'meting') return;
                      stap.inputs.forEach(inp => {
                        if (!inp.uit_formulier) return;
                        const waarde = metingen[inp.key];
                        if (waarde === undefined || waarde === '' || waarde === null) return;
                        // Alleen terugschrijven als de waarde verschilt van wat al in het formulier staat
                        const huidig = formValues?.[inp.uit_formulier];
                        if (String(waarde) !== String(huidig ?? '')) {
                          onGebruik(inp.uit_formulier, waarde);
                        }
                      });
                    });
                    // Schrijf het determinatieresultaat zelf terug
                    onGebruik(aid.resultaat_veld, resultaat.waarde ?? resultaat.fallback_waarde ?? '0');
                    onSluit();
                  }}
                >
                  Gebruik dit resultaat →
                </button>
              )}
              <button type="button" className="det-opnieuw-btn" onClick={startSurvey}>
                Opnieuw
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
