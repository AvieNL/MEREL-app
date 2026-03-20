import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import { useVeldConfig } from '../../hooks/useVeldConfig';
import { euringReference } from '../../data/euring-reference.js';
import { buildEuringLookup } from '../../utils/euring-lookup';
import RuiscoreDiagram from './RuiscoreDiagram';
import LocatiePicker from './LocatiePicker';
import { useRuitypen } from '../../hooks/useRuitypen';
import { toYMD } from '../../utils/dateHelper';
import { parseVal } from '../../utils/bioHelper';
import {
  LEEFTIJD_OPTIONS, LEEFTIJD_LABELS, PULLUS_LEEFTIJD_OPTIONS, NAUWK_LEEFTIJD_OPTIONS,
  BROEDGROOTTE_OPTIONS, GESLACHT_OPTIONS, GESLACHTSBEPALING_OPTIONS, ALL_RINGCENTRALES,
  VET_OPTIONS, VLIEGSPIER_OPTIONS, BROEDVLEK_OPTIONS, HANDICAP_OPTIONS, CLOACA_OPTIONS,
  PLAATSCODE_OPTIONS, SNAVEL_METHODE_OPTIONS, ANDERE_MERKTEKENS_OPTIONS, VERIFICATIE_OPTIONS,
  VERPLAATST_OPTIONS, ZEKER_OMSTANDIG_OPTIONS, CONDITIE_OPTIONS, NAUWK_COORD_OPTIONS,
  NAUWK_DATUM_OPTIONS, RUI_LICHAAM_OPTIONS, TAAL_LABELS, EMPTY_FORM, REQUIRED_FIELDS,
} from './NieuwPage.constants';
import { fuzzyMatch, renderGeslachtTekst, computeRanges } from './NieuwPage.utils';
import { RUIKAART_SLAGEN } from '../../data/constants';
import InfoPanel from './InfoPanel';
import RuiSeizoenTekst from './RuiSeizoenTekst';
import './NieuwPage.css';

export default function NieuwPage({ onSave, onUpdate, projects, records, speciesOverrides, settings, ringStrengen = [], onAdvanceRing }) {
  const location = useLocation();
  const navigate = useNavigate();
  const editRecord = location.state?.editRecord ?? null;
  const speciesRefData = useSpeciesRef();
  const speciesData = useMemo(
    () => speciesRefData.filter(s => s.naam_nl),
    [speciesRefData]
  );
  const euringLookup = useMemo(() => buildEuringLookup(speciesRefData), [speciesRefData]);

  const ruitypenConfig = useRuitypen();
  const veldConfig = useVeldConfig();
  const configMap = useMemo(
    () => Object.fromEntries(veldConfig.map(v => [v.veld_key, v])),
    [veldConfig]
  );

  // Codes voor een select: gebruik configMap als beschikbaar (met zichtbaar-filter), anders euringReference
  function getCodesForSelect(veldKey) {
    const cfg = configMap[veldKey];
    if (cfg?.codes && cfg.codes.length > 0) {
      return cfg.codes.filter(c => c.zichtbaar !== false);
    }
    return euringReference[veldKey]?.codes ?? [];
  }

  // Is een veld zichtbaar (niet verborgen door admin)?
  function isVeldZichtbaar(veldKey) {
    if (veldConfig.length === 0) return true;
    const cfg = configMap[veldKey];
    return !cfg || cfg.zichtbaar !== false;
  }

  // Dynamische verplichtenlijst: gebruik configMap als beschikbaar, anders hard-coded
  const SECTION_MAP_DYNREQ = {
    'Nieuwe vangst': 'nieuweVangst',
    'Project': 'project',
    'Ringgegevens': 'ringgegevens',
    'Vogel': 'vogel',
    'Vangst': 'vangst',
    'Locatie': 'locatie',
    'Biometrie': 'biometrieBasis',
    'Biometrie vervolg': 'biometrieVervolg',
    'Rui': 'rui',
    'Overige EURING data': 'euringOverig',
  };
  const REQUIRED_LABEL_MAP = Object.fromEntries(REQUIRED_FIELDS.map(f => [f.key, f.label]));
  const REQUIRED_SECTION_MAP = Object.fromEntries(REQUIRED_FIELDS.map(f => [f.key, f.section]));
  const PULLUS_KEYS = new Set(['pul_leeftijd', 'nauwk_pul_leeftijd', 'broedselgrootte']);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const requiredFields = useMemo(() => {
    if (veldConfig.length === 0) return REQUIRED_FIELDS;
    const result = [];
    for (const v of veldConfig) {
      const key = v.veld_key;
      if (v.verplicht === 'ja') {
        result.push({
          key,
          label: REQUIRED_LABEL_MAP[key] ?? key,
          section: REQUIRED_SECTION_MAP[key] ?? SECTION_MAP_DYNREQ[v.sectie] ?? 'nieuweVangst',
        });
      } else if (v.verplicht === 'pullus' || PULLUS_KEYS.has(key)) {
        result.push({
          key,
          label: REQUIRED_LABEL_MAP[key] ?? key,
          section: REQUIRED_SECTION_MAP[key] ?? SECTION_MAP_DYNREQ[v.sectie] ?? 'vogel',
          conditie: f => f.leeftijd === '1',
          isPullusField: true,
        });
      }
    }
    return result;
  }, [veldConfig]); // eslint-disable-line react-hooks/exhaustive-deps

  const [form, setForm] = useState(() => {
    if (editRecord) return { ...EMPTY_FORM, ...editRecord };
    const base = { ...EMPTY_FORM, ringer_initiaal: settings?.ringerInitiaal || '', ringer_nummer: settings?.ringerNummer || '' };
    // Vul project en locatie voor uit de meest recente vangst van vandaag binnen een uur
    const now = Date.now();
    const today = new Date().toISOString().split('T')[0];
    const recent = [...(records || [])]
      .filter(r => r.vangstdatum === today && r.timestamp && (now - new Date(r.timestamp).getTime()) <= 60 * 60 * 1000)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
    if (recent) {
      base.project        = recent.project        ?? base.project;
      base.plaatscode     = recent.plaatscode     ?? base.plaatscode;
      base.google_plaats  = recent.google_plaats  ?? base.google_plaats;
      base.lat            = recent.lat            ?? base.lat;
      base.lon            = recent.lon            ?? base.lon;
      base.nauwk_coord    = recent.nauwk_coord    ?? base.nauwk_coord;
      base.vangstmethode  = recent.vangstmethode  ?? base.vangstmethode;
      base.lokmiddelen    = recent.lokmiddelen    ?? base.lokmiddelen;
    }
    return base;
  });
  const [formErrors, setFormErrors] = useState([]);
  const [sections, setSections] = useState({
    nieuweVangst: true,
    project: true,
    ringgegevens: true,
    vogel: true,
    vangst: true,
    locatie: true,
    biometrieBasis: true,
    biometrieVervolg: false,
    rui: false,
    euringOverig: false,
  });
  const [suggestions, setSuggestions] = useState([]);
  const [saved, setSaved] = useState(false);
  const [ruikaart, setRuikaart] = useState(Array(RUIKAART_SLAGEN).fill(''));

  function updateRuikaart(index, value) {
    // Laatste veld (19) = L/R, rest alleen 0-5
    if (index === 19) {
      if (value !== '' && !/^[LRlr]$/.test(value)) return;
      value = value.toUpperCase();
    } else {
      if (value !== '' && !/^[0-5]$/.test(value)) return;
    }
    const next = [...ruikaart];
    next[index] = value;
    setRuikaart(next);
    // Auto-sum primaries (index 9-18) naar handpen_score
    const hasAnyPrimary = next.slice(9, 19).some(v => v !== '');
    if (hasAnyPrimary) {
      const primSum = next.slice(9, 19).reduce((sum, v) => sum + (parseInt(v) || 0), 0);
      update('handpen_score', String(primSum));
    }
    // Auto-advance naar volgend veld bij geldig karakter
    if (value !== '' && index < 19) {
      document.querySelector(`[data-rui="${index + 1}"]`)?.focus();
    }
  }

  function resetRuikaart() {
    setRuikaart(Array(RUIKAART_SLAGEN).fill(''));
  }

  // Find species reference data for selected species
  const speciesInfo = useMemo(() => {
    if (!form.vogelnaam || speciesRefData.length === 0) return null;
    return speciesRefData.find(
      s => s.naam_nl && s.naam_nl.toLowerCase() === form.vogelnaam.toLowerCase()
    );
  }, [form.vogelnaam, speciesRefData]);

  // Set van fout-keys voor rode omlijning; helper om class toe te voegen
  const errorKeys = useMemo(() => new Set(formErrors.map(f => f.key)), [formErrors]);
  const errCls = (...keys) => keys.some(k => errorKeys.has(k)) ? ' form-group--error' : '';

  // Get species overrides for selected species
  const getOverride = speciesOverrides?.getOverride;
  const soortOverride = useMemo(() => {
    if (!form.vogelnaam || !getOverride) return {};
    return getOverride(form.vogelnaam);
  }, [form.vogelnaam, getOverride]);

  // Get EURING code — soortOverride heeft hoogste prioriteit, dan euringLookup (Supabase + JSON fallback)
  const euringCode = useMemo(() => {
    if (!form.vogelnaam) return '';
    if (soortOverride?.euring_code) return soortOverride.euring_code;
    return euringLookup[form.vogelnaam.toLowerCase()] || '';
  }, [form.vogelnaam, soortOverride, euringLookup]);

  // Compute biometry ranges from existing records for selected species
  const bioRangesFromRecords = useMemo(() => {
    if (!form.vogelnaam) return {};
    const lower = form.vogelnaam.toLowerCase();
    const soortRecords = records.filter(
      r => r.vogelnaam && r.vogelnaam.toLowerCase() === lower && r.leeftijd !== '1'
    );
    return computeRanges(soortRecords);
  }, [form.vogelnaam, records]);

  // Merge: literatuur > gebruikersoverride > eigen vangsten
  const bioRanges = useMemo(() => {
    const BIO_KEYS = [
      { key: 'vleugel',       label: 'Vleugel' },
      { key: 'handpenlengte', label: 'P8' },
      { key: 'staartlengte',  label: 'Staart' },
      { key: 'kop_snavel',    label: 'Snavel-veer' },
      { key: 'snavel_schedel',label: 'Snavel-schedel' },
      { key: 'tarsus_lengte', label: 'Tarsus' },
      { key: 'tarsus_dikte',  label: 'Tarsus dikte' },
      { key: 'gewicht',       label: 'Gewicht' },
    ];
    const merged = {};
    for (const f of BIO_KEYS) {
      const baseMin = parseVal(speciesInfo?.[`bio_${f.key}_min`]);
      const baseMax = parseVal(speciesInfo?.[`bio_${f.key}_max`]);
      const ovMin   = parseVal(soortOverride[`bio_${f.key}_min`]);
      const ovMax   = parseVal(soortOverride[`bio_${f.key}_max`]);
      const fromRec = bioRangesFromRecords[f.key];

      // Soortdata: speciesInfo (species-tabel) heeft prioriteit, soortOverride als fallback
      const litMin = !isNaN(baseMin) ? baseMin : ovMin;
      const litMax = !isNaN(baseMax) ? baseMax : ovMax;

      if (!isNaN(litMin) && !isNaN(litMax)) {
        // 1+2. Soortendata (literatuur of override — beide admin-ingevoerd)
        merged[f.key] = { label: f.label, min: litMin, max: litMax, rangeMin: litMin, rangeMax: litMax, source: 'soortendata' };
      } else if (fromRec) {
        // 3. Eigen vangsten (10% marge)
        const margin = (fromRec.max - fromRec.min) * 0.1 || fromRec.min * 0.1;
        merged[f.key] = {
          label: f.label, min: fromRec.min, max: fromRec.max,
          rangeMin: +(fromRec.min - margin).toFixed(1),
          rangeMax: +(fromRec.max + margin).toFixed(1),
          source: 'vangsten',
        };
      }
    }
    return merged;
  }, [bioRangesFromRecords, soortOverride, speciesInfo]);

  // Geslachtsspecifieke bereiken vanuit soortdata + overrides
  const bioGenderRanges = useMemo(() => {
    const BIO_KEYS = ['vleugel', 'gewicht', 'handpenlengte', 'staartlengte', 'kop_snavel', 'tarsus_lengte', 'tarsus_dikte', 'snavel_schedel'];
    const result = { M: {}, F: {} };
    for (const gender of ['M', 'F']) {
      for (const key of BIO_KEYS) {
        // Override heeft prioriteit boven basisdata
        const ovMin = parseVal(soortOverride[`bio_${key}_${gender}_min`]);
        const ovMax = parseVal(soortOverride[`bio_${key}_${gender}_max`]);
        const baseMin = parseVal(speciesInfo?.[`bio_${key}_${gender}_min`]);
        const baseMax = parseVal(speciesInfo?.[`bio_${key}_${gender}_max`]);
        const min = !isNaN(ovMin) ? ovMin : (!isNaN(baseMin) ? baseMin : NaN);
        const max = !isNaN(ovMax) ? ovMax : (!isNaN(baseMax) ? baseMax : NaN);
        if (!isNaN(min) && !isNaN(max)) {
          // Kleine marge (5%) om grensgevallen niet te snel uit te sluiten
          const margin = (max - min) * 0.05 || Math.abs(min) * 0.02;
          result[gender][key] = {
            min, max,
            rangeMin: +(min - margin).toFixed(1),
            rangeMax: +(max + margin).toFixed(1),
          };
        }
      }
    }
    return result;
  }, [soortOverride, speciesInfo]);

  // Geslachtshint op basis van biometrie
  const genderHint = useMemo(() => {
    const mR = bioGenderRanges.M;
    const fR = bioGenderRanges.F;
    // Alleen zinvol als er velden zijn met zowel M- als F-bereik
    const dualFields = Object.keys(mR).filter(k => fR[k]);
    if (dualFields.length === 0) return null;

    let mScore = 0; // velden die duidelijk op ♂ wijzen
    let fScore = 0; // velden die duidelijk op ♀ wijzen
    let checked = 0;

    for (const key of dualFields) {
      const val = parseVal(form[key]);
      if (isNaN(val) || val <= 0) continue;
      const inM = val >= mR[key].rangeMin && val <= mR[key].rangeMax;
      const inF = val >= fR[key].rangeMin && val <= fR[key].rangeMax;
      checked++;
      if (inM && !inF) mScore++;
      else if (inF && !inM) fScore++;
    }

    if (checked === 0) return null;
    // Suggereer geslacht als alle bekeken velden in dezelfde richting wijzen,
    // of als de meerderheid (≥ 2 velden) duidelijk één kant op wijst
    if (mScore > 0 && fScore === 0) return 'M';
    if (fScore > 0 && mScore === 0) return 'F';
    if (mScore >= 2 && mScore > fScore * 2) return 'M';
    if (fScore >= 2 && fScore > mScore * 2) return 'F';
    return null;
  }, [form, bioGenderRanges]);

  // Check current form values against ranges
  const warnings = useMemo(() => {
    const w = [];
    for (const [key, range] of Object.entries(bioRanges)) {
      const val = parseVal(form[key]);
      if (!isNaN(val) && val > 0) {
        if (val < range.rangeMin || val > range.rangeMax) {
          w.push({
            key,
            label: range.label,
            value: val,
            min: range.rangeMin,
            max: range.rangeMax,
          });
        }
      }
    }
    return w;
  }, [form, bioRanges]);

  function update(field, value) {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'leeftijd' && value !== '1') {
        next.pul_leeftijd = '--';
        next.nauwk_pul_leeftijd = '--';
        next.broedselgrootte = '--';
      }
      return next;
    });
    setFormErrors(prev => prev.filter(f => f.key !== field));
  }

  // Auto-vul locatie vanuit project als dat een vaste locatie heeft
  useEffect(() => {
    if (editRecord) return;
    if (!form.project || !projects?.length) return;
    const project = projects.find(p => p.naam === form.project);
    if (!project?.vaste_locatie) return;
    setForm(prev => ({
      ...prev,
      plaatscode:    project.plaatscode    || prev.plaatscode,
      google_plaats: project.google_plaats || prev.google_plaats,
      lat:           project.lat           || prev.lat,
      lon:           project.lon           || prev.lon,
      nauwk_coord:   project.nauwk_coord   || prev.nauwk_coord,
    }));
  }, [form.project]); // eslint-disable-line react-hooks/exhaustive-deps

  // Recent species from records (unique, most recent first)
  const recentSpecies = useMemo(() => {
    const seen = new Set();
    const recent = [];
    const sorted = [...records].sort((a, b) => {
      const da = a.vangstdatum || '';
      const db = b.vangstdatum || '';
      return db.localeCompare(da);
    });
    for (const r of sorted) {
      if (r.vogelnaam && !seen.has(r.vogelnaam)) {
        seen.add(r.vogelnaam);
        recent.push(r.vogelnaam);
        if (recent.length >= 15) break;
      }
    }
    return recent;
  }, [records]);

  const recentSet = useMemo(() => new Set(recentSpecies), [recentSpecies]);

  const searchSpecies = useCallback((query) => {
    const fields = ['naam_nl', 'naam_lat', 'naam_en', 'naam_de'];
    const results = [];

    for (const sp of speciesData) {
      let bestScore = -1;
      let bestField = 'naam_nl';

      for (const field of fields) {
        const val = sp[field];
        if (!val) continue;
        const score = fuzzyMatch(query, val);
        if (score >= 0 && (bestScore < 0 || score < bestScore)) {
          bestScore = score;
          bestField = field;
          if (score === 0) break; // can't do better than starts-with
        }
      }

      // Also match on EURING code
      if (bestScore !== 0) {
        const spCode = sp.euring_code || euringLookup[sp.naam_nl?.toLowerCase()];
        if (spCode) {
          const codeScore = fuzzyMatch(query, spCode);
          if (codeScore >= 0 && (bestScore < 0 || codeScore < bestScore)) {
            bestScore = codeScore;
            bestField = 'euring_code';
          }
        }
      }

      if (bestScore >= 0) {
        results.push({
          naam_nl: sp.naam_nl,
          matchedField: bestField,
          matchedName: bestField !== 'naam_nl' && bestField !== 'euring_code' ? sp[bestField] : null,
          score: bestScore,
          isRecent: recentSet.has(sp.naam_nl),
        });
      }
    }

    // Sort: recent first, then by score, then alphabetical
    results.sort((a, b) => {
      if (a.isRecent !== b.isRecent) return a.isRecent ? -1 : 1;
      if (a.score !== b.score) return a.score - b.score;
      return a.naam_nl.localeCompare(b.naam_nl);
    });

    return results.slice(0, 10);
  }, [recentSet, speciesData]);

  function handleSpeciesInput(value) {
    update('vogelnaam', value);
    if (value.length >= 2) {
      setSuggestions(searchSpecies(value));
    } else if (value.length === 0) {
      // Show recent species when input is empty
      if (recentSpecies.length > 0) {
        setSuggestions(recentSpecies.slice(0, 8).map(name => ({
          naam_nl: name,
          matchedField: 'naam_nl',
          matchedName: null,
          score: 0,
          isRecent: true,
        })));
      } else {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  }

  function handleSpeciesFocus() {
    if (programmaticFocus.current) {
      programmaticFocus.current = false;
      return;
    }
    if (form.vogelnaam.length === 0 && recentSpecies.length > 0) {
      setSuggestions(recentSpecies.slice(0, 8).map(name => ({
        naam_nl: name,
        matchedField: 'naam_nl',
        matchedName: null,
        score: 0,
        isRecent: true,
      })));
    }
  }

  function selectSpecies(name) {
    update('vogelnaam', name);
    setSuggestions([]);
  }

  function toggleSection(key) {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Valideer verplichte velden
    const errors = [];
    for (const f of requiredFields) {
      if (f.conditie && !f.conditie(form)) continue;
      if (f.key === 'euring_code') continue; // auto-afgeleid, niet door gebruiker invulbaar
      const val = form[f.key];
      const isEmpty = f.isPullusField
        ? (val === '' || val === null || val === undefined || val === '--')
        : (val === '' || val === null || val === undefined);
      if (isEmpty) errors.push(f);
    }

    // EURING-code verplicht: vogelnaam moet bekend zijn in euring-codes.json
    if (!euringCode && form.vogelnaam) {
      errors.push({
        key: 'vogelnaam',
        label: `"${form.vogelnaam}" heeft geen EURING-code — kies een soort uit de lijst`,
        section: 'nieuweVangst',
      });
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      // Open secties met fouten zodat de velden zichtbaar zijn
      const toOpen = {};
      errors.forEach(f => { toOpen[f.section] = true; });
      setSections(prev => ({ ...prev, ...toOpen }));
      document.querySelector('.app-content')?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setFormErrors([]);

    if (editRecord) {
      onUpdate(editRecord.id, { ...form, euring_code: euringCode });
      navigate('/records');
      return;
    }
    onSave({ ...form, euring_code: euringCode });
    if (!isTerugvangst && autoFilledRingId.current && onAdvanceRing) {
      onAdvanceRing(autoFilledRingId.current);
      autoFilledRingId.current = null;
    }
    setForm({
      ...EMPTY_FORM,
      vangstdatum: form.vangstdatum,
      project: form.project,
      plaatscode: form.plaatscode,
      google_plaats: form.google_plaats,
      lat: form.lat,
      lon: form.lon,
      nauwk_coord: form.nauwk_coord,
      vangstmethode: form.vangstmethode,
      lokmiddelen: form.lokmiddelen,
      ringer_initiaal: settings?.ringerInitiaal || '',
      ringer_nummer: settings?.ringerNummer || '',
    });
    resetRuikaart();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setTimeout(() => {
      programmaticFocus.current = true;
      vogelnaamRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      vogelnaamRef.current?.focus();
    }, 50);
  }

  function renderBioField(key, label) {
    const range = bioRanges[key];
    const warning = warnings.find(w => w.key === key);
    // Geslachtsimplicatie per veld
    const val = parseVal(form[key]);
    const mR = bioGenderRanges.M[key];
    const fR = bioGenderRanges.F[key];
    let fieldGenderHint = null;
    if (!isNaN(val) && val > 0 && mR && fR) {
      const inM = val >= mR.rangeMin && val <= mR.rangeMax;
      const inF = val >= fR.rangeMin && val <= fR.rangeMax;
      if (inM && !inF) fieldGenderHint = 'M';
      else if (inF && !inM) fieldGenderHint = 'F';
    }
    const genderMismatch = fieldGenderHint && form.geslacht && form.geslacht !== fieldGenderHint && form.geslacht !== 'U';
    return (
      <div className="form-group">
        <label>{label}</label>
        <input type="text" inputMode="decimal" value={form[key]}
          className={warning ? 'input-warn' : ''}
          onChange={e => update(key, e.target.value)} />
        {range && !warning && (
          <span className={`field-hint field-hint--${range.source}`}>
            {range.min}–{range.max} <em>({range.source})</em>
          </span>
        )}
        {range && range.source === 'soortendata' && bioRangesFromRecords[key] && (
          <span className="field-hint field-hint--vangsten">
            {bioRangesFromRecords[key].min}–{bioRangesFromRecords[key].max} <em>(vangsten, n={bioRangesFromRecords[key].n})</em>
          </span>
        )}
        {warning && (
          <span className="field-warning">
            {warning.value} buiten bereik ({warning.min}–{warning.max})
          </span>
        )}
        {fieldGenderHint && (
          <span className={`field-hint field-gender-hint${genderMismatch ? ' field-hint--warn' : ''}`}>
            {fieldGenderHint === 'M'
              ? <><span className="gender-m">{'\u2642\uFE0E'}</span> wijst op man</>
              : <><span className="gender-f">{'\u2640\uFE0E'}</span> wijst op vrouw</>}
            {genderMismatch && ' — controleer geslacht'}
          </span>
        )}
      </div>
    );
  }

  // Sorteer ringcentrales: gebruikte bovenaan op frequentie, rest alfabetisch
  const ringcentraleOptions = useMemo(() => {
    const freq = {};
    for (const r of records) {
      if (r.centrale) {
        freq[r.centrale] = (freq[r.centrale] || 0) + 1;
      }
    }
    return [...ALL_RINGCENTRALES].sort((a, b) => {
      const fa = freq[a.value] || 0;
      const fb = freq[b.value] || 0;
      if (fa !== fb) return fb - fa; // meest gebruikt eerst
      return a.label.localeCompare(b.label); // rest alfabetisch
    });
  }, [records]);

  // Cloaca/geslacht mismatch waarschuwing (EURING-schaal: code 5 = cloacale protuberans = man)
  const cloacaWarning = useMemo(() => {
    const c = form.cloaca;
    const g = form.geslacht;
    if (!c || !g || c === '0' || c === '1') return null;
    if (c === '5' && g === 'F') return 'Cloacale protuberans (code 5) wijst op een man, maar het ingevoerde geslacht is vrouw';
    if (['3', '4'].includes(c) && g === 'F') return 'Sterke zwelling wijst mogelijk op een man, maar het ingevoerde geslacht is vrouw';
    if (['5', '6'].includes(c) && g === 'M') return 'Cloaca wijst op vrouw, maar het ingevoerde geslacht is man';
    if (c === '7' && g === 'M') return 'Cloaca wijst mogelijk op vrouw, maar het ingevoerde geslacht is man';
    return null;
  }, [form.cloaca, form.geslacht]);

  const isTerugvangst = form.metalenringinfo === 4;

  // Track of het ringnummer auto-ingevuld is (dan mogen we na opslaan de teller ophogen)
  const autoFilledRingId = useRef(null);
  const vogelnaamRef = useRef(null);
  const programmaticFocus = useRef(false);

  // Auto-invullen ringnummer op basis van ringmaat van de geselecteerde soort
  useEffect(() => {
    if (editRecord) return;
    if (isTerugvangst) return;
    if (!speciesInfo?.ringmaat) return;

    // Haal mogelijke maten op: "2.3/2.8 pull" → ["2.3", "2.8"]
    const kandidaatMaten = speciesInfo.ringmaat
      .split('/')
      .map(s => s.trim().replace(/[♂♀].*$/, '').replace(/\s.*$/, '').trim())
      .filter(Boolean);

    // Zoek eerste beschikbare ringstreng die matcht op een van de kandidaatmaten
    const parseRingNum = s => { const m = s?.replace(/\./g,'').match(/^[A-Za-z]*(\d+)[A-Za-z]*$/); return m ? parseInt(m[1],10) : NaN; };
    const match = ringStrengen.find(r =>
      kandidaatMaten.includes(r.ringmaat) && parseRingNum(r.huidige) <= parseRingNum(r.tot)
    );
    if (!match) {
      setForm(prev => ({ ...prev, ringnummer: '' }));
      autoFilledRingId.current = null;
      return;
    }
    setForm(prev => ({ ...prev, ringnummer: match.huidige }));
    autoFilledRingId.current = match.id;
    setFormErrors(prev => prev.filter(f => f.key !== 'ringnummer'));
  }, [speciesInfo?.ringmaat, isTerugvangst]); // eslint-disable-line react-hooks/exhaustive-deps

  // Terugvangst: zoek eigen vogel op basis van ringnummer
  const terugvangstInfo = useMemo(() => {
    if (!isTerugvangst || form.ringnummer.length < 5) return null;
    const normalize = s => s.trim().replace(/\./g, '').toLowerCase();
    const nr = normalize(form.ringnummer);
    const matches = records.filter(r =>
      r.ringnummer && normalize(r.ringnummer) === nr
    );
    if (matches.length === 0) return { eigen: false };
    const gesorteerd = [...matches].sort((a, b) =>
      (toYMD(a.vangstdatum) || '').localeCompare(toYMD(b.vangstdatum) || '')
    );
    const eerste = gesorteerd[0];
    const laatste = gesorteerd[gesorteerd.length - 1];
    return {
      eigen: true,
      vangstdatum: eerste.vangstdatum,
      laatste_vangstdatum: gesorteerd.length > 1 ? laatste.vangstdatum : null,
      leeftijd: eerste.leeftijd,
      vogelnaam: eerste.vogelnaam,
    };
  }, [isTerugvangst, form.ringnummer, records]);

  function toggleTerugvangst() {
    if (isTerugvangst) {
      setForm(prev => ({ ...prev, metalenringinfo: 2, centrale: 'NLA', omstandigheden: '20' }));
    } else {
      setForm(prev => ({ ...prev, metalenringinfo: 4, omstandigheden: '20', ringnummer: '' }));
    }
  }

  return (
    <div className="page nieuw-page">
      <form onSubmit={handleSubmit}>
        {/* Sticky header: topbar + foutmeldingen */}
        <div className="nieuw-sticky-header">
          <div className="nieuw-topbar">
            <span className="nieuw-topbar-titel">
              {editRecord ? `✏️ ${editRecord.vogelnaam || 'Vangst'}` : 'Nieuwe vangst'}
            </span>
            {editRecord && (
              <button type="button" className="btn-secondary nieuw-topbar-btn" onClick={() => navigate('/records')}>
                Annuleren
              </button>
            )}
            <button type="submit" className="btn-primary nieuw-topbar-btn">
              {editRecord ? 'Opslaan' : 'Opslaan'}
            </button>
          </div>

          {formErrors.length > 0 && (
            <div className="form-error-bar">
              <strong>Vul eerst alle verplichte velden in:</strong>
              <div className="form-error-list">
                {formErrors.map(f => <span key={f.key} className="form-error-item">{f.label}</span>)}
              </div>
            </div>
          )}
        </div>

        {saved && (
          <div className="save-toast">Vangst opgeslagen!</div>
        )}

        {/* Sectie: Nieuwe vangst */}
        <div className="section">
          <div className="section-header" onClick={() => toggleSection('nieuweVangst')}>
            <h3>{editRecord ? 'Vangst wijzigen' : 'Nieuwe vangst'}</h3>
            <span className={`toggle ${sections.nieuweVangst ? 'open' : ''}`}>▾</span>
          </div>
          {sections.nieuweVangst && (
            <div className="section-content">
              <div className={`form-group species-input${errCls('vogelnaam')}`}>
                <label>Vogelnaam *</label>
                <input
                  ref={vogelnaamRef}
                  type="text"
                  value={form.vogelnaam}
                  onChange={e => handleSpeciesInput(e.target.value)}
                  onFocus={handleSpeciesFocus}
                  placeholder="Begin te typen..."
                  autoComplete="off"
                />
                {suggestions.length > 0 && (
                  <ul className="suggestions">
                    {suggestions.map(s => {
                      const code = euringLookup[s.naam_nl?.toLowerCase()] || '';
                      return (
                        <li key={s.naam_nl + (s.matchedField || '')} onClick={() => selectSpecies(s.naam_nl)}>
                          <div className="suggestion-content">
                            <span className="suggestion-name">
                              {s.naam_nl}{code && <span className="suggestion-euring"> ({code})</span>}
                            </span>
                            {s.matchedName && (
                              <span className="suggestion-sub">{s.matchedName} ({TAAL_LABELS[s.matchedField]})</span>
                            )}
                            {s.isRecent && !s.matchedName && form.vogelnaam.length < 2 && (
                              <span className="suggestion-sub">Recent gebruikt</span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Soort-info paneel */}
              {speciesInfo && settings?.hulpModus !== 'basis' && (
                <div className="soort-info-panel">
                  <div className="soort-info-grid">
                    <div className="soort-info-item highlight">
                      <span className="sii-label">Ringmaat</span>
                      <span className="sii-value">{speciesInfo.ringmaat || '—'}</span>
                    </div>
                    {speciesInfo.ruitype && (
                      <div className={`soort-info-item${['A','B','C','D'].includes(speciesInfo.ruitype) ? ' ruitype-highlight' : ''}`}>
                        <span className="sii-label">Ruitype</span>
                        <span className="sii-value">
                          {speciesInfo.ruitype}
                          {speciesInfo.ruitype === 'A' && <span className="ruitype-badge">Leeftijd beperkt</span>}
                          {speciesInfo.ruitype === 'B' && <span className="ruitype-badge">Ruigrens bepalend</span>}
                          {speciesInfo.ruitype === 'C' && <span className="ruitype-badge">Ruigrens bepalend</span>}
                          {speciesInfo.ruitype === 'D' && <span className="ruitype-badge">Kleed bepalend</span>}
                          {speciesInfo.ruitype === 'X' && <span className="ruitype-badge">Leeftijd niet bepaalbaar</span>}
                        </span>
                      </div>
                    )}
                    {euringCode && (
                      <div className="soort-info-item">
                        <span className="sii-label">EURING</span>
                        <span className="sii-value">{euringCode}</span>
                      </div>
                    )}
                  </div>

                  {/* Boeken */}
                  {speciesInfo.boeken && Object.keys(speciesInfo.boeken).length > 0 && (
                    <div className="soort-info-boeken">
                      <span className="boeken-label">Boeken</span>
                      <div className="boeken-chips">
                        {Object.entries(speciesInfo.boeken).map(([boek, pagina]) => (
                          <span key={boek} className="boek-chip">
                            <span className="boek-chip-naam">{boek.replace(/_/g, ' ')}</span>
                            <span className="boek-chip-pagina">p.{pagina}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sectie: Project */}
        <div className="section">
          <div className="section-header" onClick={() => toggleSection('project')}>
            <h3>Project</h3>
            <span className={`toggle ${sections.project ? 'open' : ''}`}>▾</span>
          </div>
          {sections.project && (
            <div className="section-content">
              <div className={`form-group${errCls('project')}`}>
                <label>Project *</label>
                <select value={form.project} onChange={e => update('project', e.target.value)}>
                  <option value="">-- Kies --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.naam}>
                      {p.nummer ? `${p.nummer} - ${p.naam}` : p.naam}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row-3">
                <div className={`form-group${errCls('ringer_nummer')}`}>
                  <label>Ringernr *</label>
                  <input type="text" value={form.ringer_nummer}
                    onChange={e => update('ringer_nummer', e.target.value)}
                    placeholder="bijv. 3254" />
                </div>
                <div className="form-group">
                  <label>Initiaal</label>
                  <input type="text" value={form.ringer_initiaal}
                    onChange={e => update('ringer_initiaal', e.target.value)}
                    placeholder="bijv. TtA" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sectie: Ringgegevens */}
        <div className="section">
          <div className="section-header" onClick={() => toggleSection('ringgegevens')}>
            <h3>Ringgegevens</h3>
            <span className={`toggle ${sections.ringgegevens ? 'open' : ''}`}>▾</span>
          </div>
          {sections.ringgegevens && (
            <div className="section-content">
              {/* Terugvangst toggle */}
              <div className="form-group">
                <label className="toggle-label" onClick={toggleTerugvangst}>
                  <span className={`toggle-switch ${isTerugvangst ? 'active' : ''}`}>
                    <span className="toggle-knob" />
                  </span>
                  <span>{isTerugvangst ? 'Terugvangst' : 'Nieuwe ring'}</span>
                </label>
              </div>

              <div className="form-row">
                <div className={`form-group${errCls('centrale')}`}>
                  <label>Ringcentrale *</label>
                  <select value={form.centrale} onChange={e => update('centrale', e.target.value)}>
                    {ringcentraleOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className={`form-group${errCls('ringnummer')}`}>
                  <label>Ringnummer *</label>
                  <input
                    type="text"
                    value={form.ringnummer}
                    onChange={e => { update('ringnummer', e.target.value.toUpperCase()); autoFilledRingId.current = null; }}
                    placeholder="bijv. ...7154867"
                  />
                  {isTerugvangst && terugvangstInfo && (
                    terugvangstInfo.eigen ? (
                      <div className="terugvangst-info terugvangst-info--eigen">
                        <span className="terugvangst-label">Eigen vogel</span>
                        <span>{terugvangstInfo.vogelnaam}</span>
                        {terugvangstInfo.vangstdatum && <span>Eerste vangst: <strong>{terugvangstInfo.vangstdatum}</strong></span>}
                        {terugvangstInfo.laatste_vangstdatum && <span>Laatste vangst: <strong>{terugvangstInfo.laatste_vangstdatum}</strong></span>}
                        {terugvangstInfo.leeftijd && <span>Leeftijd bij eerste vangst: <strong>{LEEFTIJD_LABELS[terugvangstInfo.leeftijd] ?? terugvangstInfo.leeftijd}</strong></span>}
                      </div>
                    ) : (
                      <div className="terugvangst-info terugvangst-info--vreemd">
                        <span className="terugvangst-label">Niet in eigen vangsten</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className={`form-group${errCls('identificatie_methode')}`}>
                  <label>Identificatiemethode *</label>
                  <select value={form.identificatie_methode} onChange={e => update('identificatie_methode', e.target.value)}>
                    {getCodesForSelect('identificatie_methode').map(o => (
                      <option key={o.code} value={o.code}>{o.code} – {o.beschrijving}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Verificatie</label>
                  <select value={form.verificatie} onChange={e => update('verificatie', Number(e.target.value))}>
                    {VERIFICATIE_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className={`form-group${errCls('metalenringinfo')}`}>
                  <label>Metalen ring informatie *</label>
                  <select value={form.metalenringinfo} onChange={e => update('metalenringinfo', Number(e.target.value))}>
                    {getCodesForSelect('metalenringinfo').map(o => (
                      <option key={o.code} value={o.code}>{o.code} – {o.beschrijving}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Andere merktekens</label>
                  <select value={form.andere_merktekens} onChange={e => update('andere_merktekens', e.target.value)}>
                    {ANDERE_MERKTEKENS_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sectie: Vogel */}
        <div className="section">
          <div className="section-header" onClick={() => toggleSection('vogel')}>
            <h3>Vogel</h3>
            <span className={`toggle ${sections.vogel ? 'open' : ''}`}>▾</span>
          </div>
          {sections.vogel && (
            <div className="section-content">
              <div className="form-row">
                <div className={`form-group${errCls('geslacht')}`}>
                  <label>Geslacht *</label>
                  <select value={form.geslacht} onChange={e => update('geslacht', e.target.value)}>
                    {GESLACHT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <InfoPanel items={[
                    { label: '♂', text: speciesInfo?.geslachts_notities_m || soortOverride?.geslachts_notities_m },
                    { label: '♀', text: speciesInfo?.geslachts_notities_f || soortOverride?.geslachts_notities_f },
                  ]} />
                </div>
                <div className="form-group">
                  <label>Bepaling geslacht</label>
                  <select value={form.geslachtsbepaling} onChange={e => update('geslachtsbepaling', e.target.value)}>
                    {GESLACHTSBEPALING_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {genderHint && (() => {
                const sym = genderHint === 'M'
                  ? <span className="gender-m">{'\u2642\uFE0E'}</span>
                  : <span className="gender-f">{'\u2640\uFE0E'}</span>;
                const ingevuld = form.geslacht === 'M' || form.geslacht === 'F';
                const klopt = form.geslacht === genderHint;
                return (
                  <div className={`gender-bio-hint ${klopt ? 'gender-bio-hint--match' : ingevuld ? 'gender-bio-hint--mismatch' : 'gender-bio-hint--suggest'}`}>
                    {klopt
                      ? <>Biometrie bevestigt {sym} man</>
                      : ingevuld
                        ? <>Biometrie wijst op {sym} {genderHint === 'M' ? 'man' : 'vrouw'} — controleer het ingevoerde geslacht</>
                        : <>Op basis van biometrie: waarschijnlijk {sym} {genderHint === 'M' ? 'man' : 'vrouw'}</>
                    }
                  </div>
                );
              })()}

              <div className={`form-group${errCls('leeftijd')}`}>
                <label>Leeftijd *</label>
                <select value={form.leeftijd} onChange={e => update('leeftijd', e.target.value)}>
                  {LEEFTIJD_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <InfoPanel items={[
                  { label: 'Voorjaar', text: speciesInfo?.leeftijds_notities_vj || soortOverride?.leeftijds_notities_vj },
                  { label: 'Najaar',   text: speciesInfo?.leeftijds_notities_nj || soortOverride?.leeftijds_notities_nj },
                ]} />
                {form.leeftijd === '1' && (
                  <div className="pullus-velden">
                    <div className="form-row">
                      <div className={`form-group${errCls('pul_leeftijd')}`}>
                        <label>Pullus leeftijd *</label>
                        <select value={form.pul_leeftijd} onChange={e => update('pul_leeftijd', e.target.value)}>
                          {PULLUS_LEEFTIJD_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className={`form-group${errCls('nauwk_pul_leeftijd')}`}>
                        <label>Nauwkeurigheid *</label>
                        <select value={form.nauwk_pul_leeftijd} onChange={e => update('nauwk_pul_leeftijd', e.target.value)}>
                          {NAUWK_LEEFTIJD_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className={`form-group${errCls('broedselgrootte')}`}>
                      <label>Broedgrootte *</label>
                      <select value={form.broedselgrootte} onChange={e => update('broedselgrootte', e.target.value)}>
                        {BROEDGROOTTE_OPTIONS.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      {speciesInfo?.nest_eieren && (
                        <span className="field-hint">Eieren {speciesInfo.naam_nl}: {speciesInfo.nest_eieren}</span>
                      )}
                    </div>
                  </div>
                )}
                {speciesInfo?.ruitype === 'A' && <>
                  {settings?.hulpModus !== 'basis' && (
                    <div className="ruitype-note ruitype-note--kalender">
                      <div className="ruitype-kalender">
                        <div className="ruitype-kal-rij">
                          <span className="ruitype-kal-zijlabel">Juv.</span>
                          <div className="ruitype-kal-balk">
                            <div className="ruitype-kal-seg ruitype-kal-seg--pull" style={{gridColumn:'span 1'}}>pull.</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--juv"  style={{gridColumn:'span 2'}}>juv</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--rui"  style={{gridColumn:'span 2'}}>complete rui</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--vol"  style={{gridColumn:'span 3'}}>volgroeid</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--akj"  style={{gridColumn:'span 4'}}>na 1 kj</div>
                          </div>
                        </div>
                        <div className="ruitype-kal-maanden">
                          <span className="ruitype-kal-maand">Mei</span>
                          <span className="ruitype-kal-maand">Jun</span>
                          <span className="ruitype-kal-maand">Jul</span>
                          <span className="ruitype-kal-maand">Aug</span>
                          <span className="ruitype-kal-maand">Sep</span>
                          <span className="ruitype-kal-maand">Okt</span>
                          <span className="ruitype-kal-maand">Nov</span>
                          <span className="ruitype-kal-maand ruitype-kal-maand--dec">Dec</span>
                          <span className="ruitype-kal-maand ruitype-kal-maand--jan">Jan</span>
                          <span className="ruitype-kal-maand">Feb</span>
                          <span className="ruitype-kal-maand">Mrt</span>
                          <span className="ruitype-kal-maand">Apr</span>
                        </div>
                        <div className="ruitype-kal-rij">
                          <span className="ruitype-kal-zijlabel">Ad.</span>
                          <div className="ruitype-kal-balk">
                            <div className="ruitype-kal-seg ruitype-kal-seg--vol"  style={{gridColumn:'span 3'}}>volgroeid</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--rui"  style={{gridColumn:'span 2'}}>complete rui</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--vol"  style={{gridColumn:'span 3'}}>volgroeid</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--akj"  style={{gridColumn:'span 4'}}>na 1 kj</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {settings?.hulpModus !== 'basis' && <RuiSeizoenTekst type="A" config={ruitypenConfig} />}
                </>}
                {speciesInfo?.ruitype === 'B' && <>
                  {settings?.hulpModus !== 'basis' && (
                    <div className="ruitype-note ruitype-note--kalender">
                      <div className="ruitype-kalender">
                        <div className="ruitype-kal-rij">
                          <span className="ruitype-kal-zijlabel">Juv.</span>
                          <div className="ruitype-kal-balk">
                            <div className="ruitype-kal-seg ruitype-kal-seg--pull" style={{gridColumn:'span 1'}}>pull.</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--juv"  style={{gridColumn:'span 2'}}>juv</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--rui"  style={{gridColumn:'span 2'}}>part. rui</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--vol"  style={{gridColumn:'span 3'}}>1 kj</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--akj"  style={{gridColumn:'span 4'}}>2 kj</div>
                          </div>
                        </div>
                        <div className="ruitype-kal-maanden">
                          <span className="ruitype-kal-maand">Mei</span>
                          <span className="ruitype-kal-maand">Jun</span>
                          <span className="ruitype-kal-maand">Jul</span>
                          <span className="ruitype-kal-maand">Aug</span>
                          <span className="ruitype-kal-maand">Sep</span>
                          <span className="ruitype-kal-maand">Okt</span>
                          <span className="ruitype-kal-maand">Nov</span>
                          <span className="ruitype-kal-maand ruitype-kal-maand--dec">Dec</span>
                          <span className="ruitype-kal-maand ruitype-kal-maand--jan">Jan</span>
                          <span className="ruitype-kal-maand">Feb</span>
                          <span className="ruitype-kal-maand">Mrt</span>
                          <span className="ruitype-kal-maand">Apr</span>
                        </div>
                        <div className="ruitype-kal-rij">
                          <span className="ruitype-kal-zijlabel">Ad.</span>
                          <div className="ruitype-kal-balk">
                            <div className="ruitype-kal-seg ruitype-kal-seg--vol"  style={{gridColumn:'span 3'}}>2kj / na 2kj</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--rui"  style={{gridColumn:'span 2'}}>complete rui</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--akj"  style={{gridColumn:'span 3'}}>na 1 kj</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--akj"  style={{gridColumn:'span 4'}}>na 2 kj</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {settings?.hulpModus !== 'basis' && <RuiSeizoenTekst type="B" config={ruitypenConfig} />}
                </>}
                {speciesInfo?.ruitype === 'C' && <>
                  {settings?.hulpModus !== 'basis' && (
                    <div className="ruitype-note ruitype-note--kalender">
                      <div className="ruitype-kalender">
                        <div className="ruitype-kal-rij">
                          <span className="ruitype-kal-zijlabel">Juv.</span>
                          <div className="ruitype-kal-balk">
                            <div className="ruitype-kal-seg ruitype-kal-seg--pull" style={{gridColumn:'span 1'}}>pull.</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--juv"  style={{gridColumn:'span 2'}}>juv</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--rui"  style={{gridColumn:'span 2'}}>part. rui</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--vol"  style={{gridColumn:'span 3'}}>1 kj</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--rui"  style={{gridColumn:'span 1'}}>p.r.</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--vol"  style={{gridColumn:'span 3'}}>2 kj</div>
                          </div>
                        </div>
                        <div className="ruitype-kal-maanden">
                          <span className="ruitype-kal-maand">Mei</span>
                          <span className="ruitype-kal-maand">Jun</span>
                          <span className="ruitype-kal-maand">Jul</span>
                          <span className="ruitype-kal-maand">Aug</span>
                          <span className="ruitype-kal-maand">Sep</span>
                          <span className="ruitype-kal-maand">Okt</span>
                          <span className="ruitype-kal-maand">Nov</span>
                          <span className="ruitype-kal-maand ruitype-kal-maand--dec">Dec</span>
                          <span className="ruitype-kal-maand ruitype-kal-maand--jan">Jan</span>
                          <span className="ruitype-kal-maand">Feb</span>
                          <span className="ruitype-kal-maand">Mrt</span>
                          <span className="ruitype-kal-maand">Apr</span>
                        </div>
                        <div className="ruitype-kal-rij">
                          <span className="ruitype-kal-zijlabel">Ad.</span>
                          <div className="ruitype-kal-balk">
                            <div className="ruitype-kal-seg ruitype-kal-seg--vol"  style={{gridColumn:'span 3'}}>2kj / na 2kj</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--rui"  style={{gridColumn:'span 2'}}>complete rui</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--akj"  style={{gridColumn:'span 3'}}>na 1 kj</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--rui"  style={{gridColumn:'span 1'}}>p.r.</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--akj"  style={{gridColumn:'span 3'}}>na 2 kj</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {settings?.hulpModus !== 'basis' && <RuiSeizoenTekst type="C" config={ruitypenConfig} />}
                </>}
                {speciesInfo?.ruitype === 'D' && <>
                  {settings?.hulpModus !== 'basis' && (
                    <div className="ruitype-note ruitype-note--kalender">
                      <div className="ruitype-kalender">
                        <div className="ruitype-kal-rij">
                          <span className="ruitype-kal-zijlabel">Juv.</span>
                          <div className="ruitype-kal-balk">
                            <div className="ruitype-kal-seg ruitype-kal-seg--pull" style={{gridColumn:'span 1'}}>pull.</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--juv"  style={{gridColumn:'span 2'}}>juv</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--rui"  style={{gridColumn:'span 2'}}>part. rui</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--vol"  style={{gridColumn:'span 3'}}>1 kj</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--rui"  style={{gridColumn:'span 1'}}>c.r.</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--akj"  style={{gridColumn:'span 3'}}>na 1 kj</div>
                          </div>
                        </div>
                        <div className="ruitype-kal-maanden">
                          <span className="ruitype-kal-maand">Mei</span>
                          <span className="ruitype-kal-maand">Jun</span>
                          <span className="ruitype-kal-maand">Jul</span>
                          <span className="ruitype-kal-maand">Aug</span>
                          <span className="ruitype-kal-maand">Sep</span>
                          <span className="ruitype-kal-maand">Okt</span>
                          <span className="ruitype-kal-maand">Nov</span>
                          <span className="ruitype-kal-maand ruitype-kal-maand--dec">Dec</span>
                          <span className="ruitype-kal-maand ruitype-kal-maand--jan">Jan</span>
                          <span className="ruitype-kal-maand">Feb</span>
                          <span className="ruitype-kal-maand">Mrt</span>
                          <span className="ruitype-kal-maand">Apr</span>
                        </div>
                        <div className="ruitype-kal-rij">
                          <span className="ruitype-kal-zijlabel">Ad.</span>
                          <div className="ruitype-kal-balk">
                            <div className="ruitype-kal-seg ruitype-kal-seg--vol"  style={{gridColumn:'span 3'}}>volgroeid</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--rui"  style={{gridColumn:'span 2'}}>complete rui</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--akj"  style={{gridColumn:'span 3'}}>na 1 kj</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--rui"  style={{gridColumn:'span 1'}}>c.r.</div>
                            <div className="ruitype-kal-seg ruitype-kal-seg--akj"  style={{gridColumn:'span 3'}}>na 1 kj</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {settings?.hulpModus !== 'basis' && <RuiSeizoenTekst type="D" config={ruitypenConfig} />}
                </>}
                {speciesInfo?.ruitype === 'X' && <>
                  {settings?.hulpModus !== 'basis' && <RuiSeizoenTekst type="X" config={ruitypenConfig} />}
                </>}
              </div>

              {/* Status, Conditie, Omstandigheden, Gemanipuleerd, Verplaatst */}
              <div className="form-row">
                <div className={`form-group${errCls('status')}`}>
                  <label>Status *</label>
                  <select value={form.status} onChange={e => update('status', e.target.value)}>
                    {getCodesForSelect('status').map(o => (
                      <option key={o.code} value={o.code}>{o.code} – {o.beschrijving}</option>
                    ))}
                  </select>
                </div>
                <div className={`form-group${errCls('conditie')}`}>
                  <label>Conditie *</label>
                  <select value={form.conditie} onChange={e => update('conditie', e.target.value)}>
                    {CONDITIE_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className={`form-group${errCls('omstandigheden')}`}>
                  <label>Omstandigheden *</label>
                  <select value={form.omstandigheden} onChange={e => update('omstandigheden', e.target.value)}>
                    {getCodesForSelect('omstandigheden').map(o => (
                      <option key={o.code} value={o.code}>{o.code} – {o.beschrijving}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Zekerheid omstandigheden</label>
                  <select value={form.zeker_omstandigheden} onChange={e => update('zeker_omstandigheden', Number(e.target.value))}>
                    {ZEKER_OMSTANDIG_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className={`form-group${errCls('gemanipuleerd')}`}>
                  <label>Gemanipuleerd *</label>
                  <select value={form.gemanipuleerd} onChange={e => update('gemanipuleerd', e.target.value)}>
                    {getCodesForSelect('gemanipuleerd').map(o => (
                      <option key={o.code} value={o.code}>{o.code} – {o.beschrijving}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Verplaatst</label>
                  <select value={form.verplaatst} onChange={e => update('verplaatst', Number(e.target.value))}>
                    {VERPLAATST_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {form.gemanipuleerd === 'M' && (
                <div className="form-group">
                  <label>Barcode</label>
                  <input type="text" value={form.barcode}
                    onChange={e => update('barcode', e.target.value)} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sectie: Vangst */}
        <div className="section">
          <div className="section-header" onClick={() => toggleSection('vangst')}>
            <h3>Vangst</h3>
            <span className={`toggle ${sections.vangst ? 'open' : ''}`}>▾</span>
          </div>
          {sections.vangst && (
            <div className="section-content">
              <div className="form-row form-row--datum-tijd">
                <div className="form-group">
                  <label>Vangstdatum</label>
                  <input
                    type="date"
                    value={form.vangstdatum}
                    onChange={e => update('vangstdatum', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Tijd (HHMM)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="bijv. 0845"
                    value={form.tijd}
                    onChange={e => update('tijd', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className={`form-group${errCls('vangstmethode')}`}>
                  <label>Vangstmethode *</label>
                  <select value={form.vangstmethode} onChange={e => update('vangstmethode', e.target.value)}>
                    <option value="">-- Kies --</option>
                    {getCodesForSelect('vangstmethode').map(o => (
                      <option key={o.code} value={o.code}>{o.code} – {o.beschrijving}</option>
                    ))}
                  </select>
                </div>
                <div className={`form-group${errCls('nauwk_vangstdatum')}`}>
                  <label>Nauwkeurigheid datum *</label>
                  <select value={form.nauwk_vangstdatum} onChange={e => update('nauwk_vangstdatum', Number(e.target.value))}>
                    {NAUWK_DATUM_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className={`form-group${errCls('lokmiddelen')}`}>
                  <label>Lokmiddelen *</label>
                  <select value={form.lokmiddelen} onChange={e => update('lokmiddelen', e.target.value)}>
                    {getCodesForSelect('lokmiddelen').map(o => (
                      <option key={o.code} value={o.code}>{o.code} – {o.beschrijving}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Netnummer</label>
                  <input type="text" value={form.netnummer}
                    onChange={e => update('netnummer', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Opmerkingen</label>
                <textarea rows="2" value={form.opmerkingen}
                  onChange={e => update('opmerkingen', e.target.value)} />
              </div>
            </div>
          )}
        </div>

        {/* Sectie: Biometrie basis */}
        <div className="section">
          <div className="section-header" onClick={() => toggleSection('biometrieBasis')}>
            <h3>Biometrie</h3>
            {warnings.some(w => ['vleugel', 'gewicht', 'handpenlengte'].includes(w.key)) && <span className="section-badge-warn">!</span>}
            <span className={`toggle ${sections.biometrieBasis ? 'open' : ''}`}>▾</span>
          </div>
          {sections.biometrieBasis && (
            <div className="section-content">
              <div className="form-row">
                {renderBioField('vleugel', 'Vleugel (0,5 mm)')}
                {renderBioField('handpenlengte', 'P8 (0,5 mm)')}
              </div>
              <div className="form-row-3">
                <div className="form-group">
                  <label>Ruiscore</label>
                  <select value={form.rui_lichaam} onChange={e => update('rui_lichaam', e.target.value)}>
                    {RUI_LICHAAM_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Vet (Busse 0-5)</label>
                  <select value={form.vet} onChange={e => update('vet', e.target.value)}>
                    {VET_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Vliegspier</label>
                  <select value={form.borstspier} onChange={e => update('borstspier', e.target.value)}>
                    {VLIEGSPIER_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                {renderBioField('gewicht', 'Gewicht (0,1 g)')}
                <div className="form-group">
                  <label>Weegtijd</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="bijv. 0845"
                    value={form.weegtijd}
                    onChange={e => update('weegtijd', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-row-3">
                <div className="form-group">
                  <label>Cloaca</label>
                  <select value={form.cloaca} onChange={e => update('cloaca', e.target.value)}>
                    {CLOACA_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  {cloacaWarning && (
                    <span className="field-warning">{cloacaWarning}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Broedvlek</label>
                  <select value={form.broedvlek} onChange={e => update('broedvlek', e.target.value)}>
                    {BROEDVLEK_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Handicap</label>
                  <select value={form.handicap} onChange={e => update('handicap', e.target.value)}>
                    {HANDICAP_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {speciesInfo && (speciesInfo.nest_eileg || speciesInfo.broed) && (
                <div className="broed-info-hint">
                  {speciesInfo.broed && <span>Broedt: <strong>{renderGeslachtTekst(speciesInfo.broed)}</strong></span>}
                  {speciesInfo.nest_eileg && <span>Eileg: <strong>{renderGeslachtTekst(speciesInfo.nest_eileg)}</strong></span>}
                  {speciesInfo.nest_broedels && <span>Broedels: <strong>{renderGeslachtTekst(speciesInfo.nest_broedels)}</strong></span>}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sectie 4: Rui */}
        <div className="section">
          <div className="section-header" onClick={() => toggleSection('rui')}>
            <h3>Rui</h3>
            <span className={`toggle ${sections.rui ? 'open' : ''}`}>▾</span>
          </div>
          {sections.rui && (
            <div className="section-content">
              {settings?.hulpModus !== 'basis' && (
                <div className="ruiscore-diagram">
                  <RuiscoreDiagram />
                </div>
              )}
              <div className="ruikaart">
                <div className="ruikaart-labels">
                  <span className="ruikaart-groep ruikaart-tertials">Tertials</span>
                  <span className="ruikaart-groep ruikaart-secondaries">Secondaries</span>
                  <span className="ruikaart-groep ruikaart-primaries">Primaries</span>
                  <span className="ruikaart-groep ruikaart-lr">L/R</span>
                </div>
                <div className="ruikaart-velden">
                  {ruikaart.map((val, i) => (
                    <input
                      key={i}
                      data-rui={i}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className={`ruikaart-input${i === 2 || i === 8 || i === 18 ? ' ruikaart-border-right' : ''}`}
                      value={val}
                      onChange={e => updateRuikaart(i, e.target.value)}
                      placeholder={i === 19 ? 'L/R' : String(i < 3 ? i + 1 : i < 9 ? i - 2 : i - 8)}
                    />
                  ))}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Handpenrui (totaal)</label>
                  <input type="text" value={form.handpen_score}
                    onChange={e => update('handpen_score', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Oude dekveren</label>
                  <input type="text" value={form.oude_dekveren}
                    onChange={e => update('oude_dekveren', e.target.value)} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sectie: Biometrie vervolg */}
        <div className="section">
          <div className="section-header" onClick={() => toggleSection('biometrieVervolg')}>
            <h3>Biometrie vervolg</h3>
            {warnings.some(w => !['vleugel', 'gewicht', 'handpenlengte'].includes(w.key)) && <span className="section-badge-warn">!</span>}
            <span className={`toggle ${sections.biometrieVervolg ? 'open' : ''}`}>▾</span>
          </div>
          {sections.biometrieVervolg && (
            <div className="section-content">
              <div className="form-row">
                {renderBioField('tarsus_lengte', 'Tarsus (0,1 mm)')}
                <div className="form-group">
                  <label>Tarsus-teen (0,1 mm)</label>
                  <input type="text" inputMode="decimal" value={form.tarsus_teen}
                    onChange={e => update('tarsus_teen', e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                {renderBioField('tarsus_dikte', 'Tarsus dikte (0,1 mm)')}
                <div className="form-group">
                  <label>Achternagel (0,1 mm)</label>
                  <input type="text" inputMode="decimal" value={form.achternagel}
                    onChange={e => update('achternagel', e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                {renderBioField('staartlengte', 'Staartlengte (0,1 mm)')}
                <div className="form-group">
                  <label>Staartverschil (0,1 mm)</label>
                  <input type="text" inputMode="decimal" value={form.staart_verschil}
                    onChange={e => update('staart_verschil', e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                {renderBioField('snavel_schedel', 'Snavellengte (0,1 mm)')}
                <div className="form-group">
                  <label>Snavelmethode</label>
                  <select value={form.snavel_methode} onChange={e => update('snavel_methode', e.target.value)}>
                    {SNAVEL_METHODE_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                {renderBioField('kop_snavel', 'Totale koplengte (0,1 mm)')}
              </div>
            </div>
          )}
        </div>

        {/* Sectie: Locatie */}
        <div className="section">
          <div className="section-header" onClick={() => toggleSection('locatie')}>
            <h3>Locatie</h3>
            <span className={`toggle ${sections.locatie ? 'open' : ''}`}>▾</span>
          </div>
          {sections.locatie && (
            <div className="section-content">
              <div className="form-row">
                <div className={`form-group${errCls('plaatscode')}`}>
                  <label>Plaatscode *</label>
                  <select value={form.plaatscode} onChange={e => update('plaatscode', e.target.value)}>
                    {PLAATSCODE_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className={`form-group${errCls('google_plaats')}`}>
                  <label>Plaatsnaam *</label>
                  <input type="text" value={form.google_plaats}
                    onChange={e => update('google_plaats', e.target.value)}
                    placeholder="bijv. Breedenbroek" />
                </div>
              </div>
              <LocatiePicker
                lat={form.lat}
                lon={form.lon}
                onChange={(lat, lon) => { setForm(prev => ({ ...prev, lat, lon })); setFormErrors(prev => prev.filter(f => f.key !== 'lat' && f.key !== 'lon')); }}
                latError={errorKeys.has('lat')}
                lonError={errorKeys.has('lon')}
              />
              <div className={`form-group${errCls('nauwk_coord')}`}>
                <label>Nauwkeurigheid coördinaten *</label>
                <select value={form.nauwk_coord} onChange={e => update('nauwk_coord', e.target.value)}>
                  {NAUWK_COORD_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Sectie: Overige EURING data */}
        <div className="section">
          <div className="section-header" onClick={() => toggleSection('euringOverig')}>
            <h3>Overige EURING data</h3>
            <span className={`toggle ${sections.euringOverig ? 'open' : ''}`}>▾</span>
          </div>
          {sections.euringOverig && (
            <div className="section-content">
              <div className="form-group">
                <label>Opmerkingen 1</label>
                <input type="text" value={form.opmerkingen1}
                  onChange={e => update('opmerkingen1', e.target.value)} />
              </div>
            </div>
          )}
        </div>

      </form>
    </div>
  );
}
