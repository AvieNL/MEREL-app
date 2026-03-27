import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import { useVeldConfig } from '../../hooks/useVeldConfig';
import { euringReference, getBeschrijving } from '../../data/euring-reference.js';
import { buildEuringLookup } from '../../utils/euring-lookup';
import { useDisplayNaam } from '../../hooks/useDisplayNaam';
import { useRuitypen } from '../../hooks/useRuitypen';
import { toYMD, formatDatum } from '../../utils/dateHelper';
import { parseVal } from '../../utils/bioHelper';
import {
  ALL_RINGCENTRALES,
  EMPTY_FORM, REQUIRED_FIELDS,
} from './NieuwPage.constants';
import { fuzzyMatch } from './NieuwPage.utils';
import { RUIKAART_SLAGEN, PULL_INTERVAL_MS } from '../../data/constants';
import { useRecords } from '../../hooks/useRecords';
import { useProjects } from '../../hooks/useProjects';
import { useSpeciesOverrides } from '../../hooks/useSpeciesOverrides';
import { useSettings } from '../../hooks/useSettings';
import { useRingStrengen } from '../../hooks/useRingStrengen';
import { useBioRanges } from '../../hooks/useBioRanges';
import { useAddNestring } from '../../hooks/useAddNestring';
import { useModuleSwitch } from '../../App';
import { NieuwFormContext } from './NieuwFormContext';
import { db } from '../../lib/db';
import { supabase } from '../../lib/supabase';

const NEST_RING_CONTEXT_KEY = 'vrs-ring-uit-nest';
import SectieSoort from './SectieSoort';
import SectieProject from './SectieProject';
import SectieRinggegevens from './SectieRinggegevens';
import SectieVogel from './SectieVogel';
import SectieAIAnalyse from './SectieAIAnalyse';
import SectieVangst from './SectieVangst';
import SectieBiometrieEnRui from './SectieBiometrieEnRui';
import './NieuwPage.css';

export default function NieuwPage() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const displayNaam = useDisplayNaam();
  const { records, addRecord, updateRecord } = useRecords();
  const { projects: allProjects } = useProjects();
  const projects = allProjects.filter(p => p.actief);
  const speciesOverrides = useSpeciesOverrides();
  const { settings } = useSettings();
  const { ringStrengen = [], advanceHuidige: onAdvanceRing } = useRingStrengen();
  const navigate = useNavigate();
  const addNestring = useAddNestring();
  const switchModule = useModuleSwitch();
  const editRecord = location.state?.editRecord ?? null;

  // Nestkast context: als de ringer vanuit een nestbezoek werd opgestart
  const nestContextRef = useRef(null);
  if (nestContextRef.current === null) {
    try {
      const raw = sessionStorage.getItem(NEST_RING_CONTEXT_KEY);
      nestContextRef.current = raw ? JSON.parse(raw) : false; // false = geen context (vs null = nog niet geladen)
    } catch { nestContextRef.current = false; }
  }
  const nestContext = nestContextRef.current || null;
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
  // Vertaalt beschrijving op basis van huidige taal; gebruikt euringReference als fallback voor vertalingen
  // wanneer configMap-codes geen beschrijving_en/beschrijving_de hebben (Supabase slaat alleen NL op)
  function getCodesForSelect(veldKey) {
    const cfg = configMap[veldKey];
    const lang = i18n.language;
    const codes = cfg?.codes?.length > 0
      ? cfg.codes.filter(c => c.zichtbaar !== false)
      : (euringReference[veldKey]?.codes ?? []);
    if (lang === 'nl') return codes;
    const refByCode = Object.fromEntries(
      (euringReference[veldKey]?.codes ?? []).map(c => [c.code, c])
    );
    return codes.map(c => {
      const beschrijving = c['beschrijving_' + lang]
        || refByCode[c.code]?.['beschrijving_' + lang]
        || c.beschrijving;
      return { ...c, beschrijving };
    });
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

    // Prefill vanuit nestkast-context (vogel ringen vanuit nestbezoek)
    const nestCtx = nestContextRef.current || null;
    if (nestCtx) {
      if (nestCtx.soortNaam) base.vogelnaam = nestCtx.soortNaam;
      if (nestCtx.datum) base.vangstdatum = nestCtx.datum;
      if (nestCtx.lat) base.lat = nestCtx.lat;
      if (nestCtx.lon) base.lon = nestCtx.lon;
      return base;
    }

    // Vul project, vangstmethode en locatie voor vanuit dagdefaults (localStorage) of meest recente vangst van vandaag
    const today = new Date().toISOString().split('T')[0];
    const DAG_KEY = `vrs-dag-defaults-${today}`;
    let dagDefaults = null;
    try {
      const raw = localStorage.getItem(DAG_KEY);
      dagDefaults = raw ? JSON.parse(raw) : null;
    } catch { /* ignore */ }

    if (dagDefaults) {
      base.project        = dagDefaults.project        ?? base.project;
      base.plaatscode     = dagDefaults.plaatscode     ?? base.plaatscode;
      base.google_plaats  = dagDefaults.google_plaats  ?? base.google_plaats;
      base.lat            = dagDefaults.lat            ?? base.lat;
      base.lon            = dagDefaults.lon            ?? base.lon;
      base.nauwk_coord    = dagDefaults.nauwk_coord    ?? base.nauwk_coord;
      base.vangstmethode  = dagDefaults.vangstmethode  ?? base.vangstmethode;
      base.lokmiddelen    = dagDefaults.lokmiddelen    ?? base.lokmiddelen;
      base.tijd           = dagDefaults.tijd           ?? base.tijd;
    } else {
      // Geen localStorage-defaults: gebruik meest recente vangst van vandaag (hele dag, geen tijdslimiet)
      const recent = [...(records || [])]
        .filter(r => r.vangstdatum === today)
        .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))[0];
      if (recent) {
        base.project        = recent.project        ?? base.project;
        base.plaatscode     = recent.plaatscode     ?? base.plaatscode;
        base.google_plaats  = recent.google_plaats  ?? base.google_plaats;
        base.lat            = recent.lat            ?? base.lat;
        base.lon            = recent.lon            ?? base.lon;
        base.nauwk_coord    = recent.nauwk_coord    ?? base.nauwk_coord;
        base.vangstmethode  = recent.vangstmethode  ?? base.vangstmethode;
        base.lokmiddelen    = recent.lokmiddelen    ?? base.lokmiddelen;
        base.tijd           = recent.tijd           ?? base.tijd;
      }
    }
    return base;
  });
  const [formErrors, setFormErrors] = useState([]);
  const [sections, setSections] = useState({
    nieuweVangst: true,
    project: true,
    ringgegevens: true,
    aiAnalyse: false,
    vogel: true,
    vangst: true,
    locatie: true,
    biometrieBasis: true,
    biometrieVervolg: false,
    rui: false,
    euringOverig: false,
  });

  const [aiFotos, setAiFotos] = useState([]);
  const [aiResultaat, setAiResultaat] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [saved, setSaved] = useState(false);
  const [vogelnaamDisplay, setVogelnaamDisplay] = useState(editRecord?.vogelnaam || '');
  const [ruikaart, setRuikaart] = useState(Array(RUIKAART_SLAGEN).fill(''));

  const update = useCallback((field, value) => {
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
  }, []);

  const updateRuikaart = useCallback((index, value) => {
    // Laatste veld (19) = L/R, rest alleen 0-5
    if (index === 19) {
      if (value !== '' && !/^[LRlr]$/.test(value)) return;
      value = value.toUpperCase();
    } else {
      if (value !== '' && !/^[0-5]$/.test(value)) return;
    }
    setRuikaart(prev => {
      const next = [...prev];
      next[index] = value;
      // Auto-sum primaries (index 9-18) naar handpen_score
      const hasAnyPrimary = next.slice(9, 19).some(v => v !== '');
      if (hasAnyPrimary) {
        const primSum = next.slice(9, 19).reduce((sum, v) => sum + (parseInt(v) || 0), 0);
        update('handpen_score', String(primSum));
      }
      return next;
    });
    // Auto-advance naar volgend veld bij geldig karakter
    if (value !== '' && index < 19) {
      document.querySelector(`[data-rui="${index + 1}"]`)?.focus();
    }
  }, [update]);

  const resetRuikaart = useCallback(() => {
    setRuikaart(Array(RUIKAART_SLAGEN).fill(''));
  }, []);

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

  const { bioRangesFromRecords, bioRanges, bioGenderRanges, genderHint, warnings } =
    useBioRanges(form.vogelnaam, speciesInfo, soortOverride, records, form);

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

  // Update weergave-naam als soort geselecteerd is (bij taalwissel of na laden soortendata)
  useEffect(() => {
    if (speciesInfo) {
      setVogelnaamDisplay(displayNaam(speciesInfo.naam_nl) || speciesInfo.naam_nl);
    }
  }, [speciesInfo?.naam_nl, displayNaam]); // eslint-disable-line react-hooks/exhaustive-deps

  const searchSpecies = useCallback((query) => {
    // Huidige taal eerst doorzoeken
    const lang = i18n.language;
    const langField = lang === 'en' ? 'naam_en' : lang === 'de' ? 'naam_de' : 'naam_nl';
    const allFields = ['naam_nl', 'naam_lat', 'naam_en', 'naam_de'];
    const fields = [langField, ...allFields.filter(f => f !== langField)];
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
  }, [recentSet, speciesData, i18n.language]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSpeciesInput = useCallback((value) => {
    setVogelnaamDisplay(value);
    update('vogelnaam', value);
    clearTimeout(searchDebounceRef.current);
    if (value.length >= 2) {
      searchDebounceRef.current = setTimeout(() => {
        setSuggestions(searchSpecies(value));
      }, 150);
    } else if (value.length === 0) {
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
  }, [update, searchSpecies, recentSpecies]);

  const handleSpeciesFocus = useCallback(() => {
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
  }, [form.vogelnaam, recentSpecies]);

  const selectSpecies = useCallback((name) => {
    update('vogelnaam', name);
    setSuggestions([]);
    setActiveIndex(-1);
  }, [update]);

  useEffect(() => { setActiveIndex(-1); }, [suggestions]);

  function handleSpeciesKeyDown(e) {
    if (!suggestions.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      const idx = activeIndex >= 0 ? activeIndex : 0;
      if (suggestions[idx]) {
        if (e.key === 'Enter') e.preventDefault();
        selectSpecies(suggestions[idx].naam_nl);
      }
    } else if (e.key === 'Escape') {
      setSuggestions([]);
    }
  }

  const toggleSection = useCallback((key) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

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
        label: t('form_no_euring', { naam: form.vogelnaam }),
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
      updateRecord(editRecord.id, { ...form, euring_code: euringCode });
      navigate('/records');
      return;
    }
    const newRecord = addRecord({ ...form, euring_code: euringCode });

    // Koppel ring aan nestbezoek als dit vanuit nestonderzoek werd gestart
    const nestCtx = nestContext;
    if (nestCtx && newRecord) {
      addNestring({
        nestbezoek_id: nestCtx.bezoekId,
        vangst_id: newRecord.id,
        ringnummer: form.ringnummer || null,
        centrale: form.centrale || null,
        leeftijd: 2, // jong/pulli
        sexe: form.geslacht || null,
      });
      sessionStorage.removeItem(NEST_RING_CONTEXT_KEY);
      navigate(`/nest/${nestCtx.nestId}`);
      if (switchModule) switchModule('nest');
      return;
    }

    if (!isTerugvangst && autoFilledRingId.current && onAdvanceRing) {
      onAdvanceRing(autoFilledRingId.current);
      autoFilledRingId.current = null;
    }

    // Sla dagdefaults op voor de rest van de dag (tot middernacht)
    const today = new Date().toISOString().split('T')[0];
    const DAG_KEY = `vrs-dag-defaults-${today}`;
    try {
      localStorage.setItem(DAG_KEY, JSON.stringify({
        project:       form.project,
        plaatscode:    form.plaatscode,
        google_plaats: form.google_plaats,
        lat:           form.lat,
        lon:           form.lon,
        nauwk_coord:   form.nauwk_coord,
        vangstmethode: form.vangstmethode,
        lokmiddelen:   form.lokmiddelen,
        tijd:          form.tijd,
      }));
    } catch { /* ignore */ }

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
      tijd: form.tijd,
      ringer_initiaal: settings?.ringerInitiaal || '',
      ringer_nummer: settings?.ringerNummer || '',
    });
    resetRuikaart();
    setAiFotos([]);
    setAiResultaat(null);
    setVogelnaamDisplay('');
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
        {range && (range.source === 'literatuur' || range.source === 'eigen-invoer') && bioRangesFromRecords[key] && (
          <span className="field-hint field-hint--vangsten">
            {t('form_bio_catch_range', { min: bioRangesFromRecords[key].min, max: bioRangesFromRecords[key].max, n: bioRangesFromRecords[key].n })}
          </span>
        )}
        {warning && (
          <span className="field-warning">
            {t('form_bio_out_of_range', { value: warning.value, min: warning.min, max: warning.max })}
          </span>
        )}
        {fieldGenderHint && (
          <span className={`field-hint field-gender-hint${genderMismatch ? ' field-hint--warn' : ''}`}>
            {fieldGenderHint === 'M'
              ? <><span className="gender-m">{'\u2642\uFE0E'}</span> {t('form_bio_indicates_male')}</>
              : <><span className="gender-f">{'\u2640\uFE0E'}</span> {t('form_bio_indicates_female')}</>}
            {genderMismatch && ` ${t('form_bio_check_sex')}`}
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
    if (c === '5' && g === 'F') return t('form_cloaca_warn_cp_female');
    if (['3', '4'].includes(c) && g === 'F') return t('form_cloaca_warn_swelling_female');
    if (['5', '6'].includes(c) && g === 'M') return t('form_cloaca_warn_female_male');
    if (c === '7' && g === 'M') return t('form_cloaca_warn_female_maybe_male');
    return null;
  }, [form.cloaca, form.geslacht]);

  const isTerugvangst = form.metalenringinfo === 4;

  // Track of het ringnummer auto-ingevuld is (dan mogen we na opslaan de teller ophogen)
  const autoFilledRingId = useRef(null);
  const vogelnaamRef = useRef(null);
  const programmaticFocus = useRef(false);
  const searchDebounceRef = useRef(null);

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
    const naam = eerste.vogelnaam || '';
    return {
      eigen: true,
      vangstdatum: formatDatum(eerste.vangstdatum),
      laatste_vangstdatum: gesorteerd.length > 1 ? formatDatum(laatste.vangstdatum) : null,
      leeftijd: eerste.leeftijd,
      geslacht: eerste.geslacht || '',
      vogelnaam: naam ? naam.charAt(0).toUpperCase() + naam.slice(1).toLowerCase() : naam,
    };
  }, [isTerugvangst, form.ringnummer, records]);

  // Nestonderzoek-tip: controleer of het ringnummer van een nestbezoek stamt
  const [nestRingInfo, setNestRingInfo] = useState(null);
  useEffect(() => {
    let cancelled = false;
    async function lookup() {
      const normalize = s => String(s || '').replace(/[\s.]/g, '').toUpperCase();
      const nr = normalize(form.ringnummer);
      if (nr.length < 5) { setNestRingInfo(null); return; }

      // Zoek overeenkomende vangst(en) in eigen records
      const matchingRecords = records.filter(r => r.ringnummer && normalize(r.ringnummer) === nr);
      if (matchingRecords.length === 0) { setNestRingInfo(null); return; }

      // Zoek nestring-koppeling
      let nestringRecord = null;
      for (const rec of matchingRecords) {
        const entry = await db.nestring.where('vangst_id').equals(rec.id).first();
        if (entry) { nestringRecord = entry; break; }
      }
      if (!nestringRecord || cancelled) { setNestRingInfo(null); return; }

      // Volg de keten: nestbezoek → legsel → nest
      const bezoek = await db.nestbezoek.get(nestringRecord.nestbezoek_id);
      if (!bezoek || cancelled) { setNestRingInfo(null); return; }
      const legsel = await db.legsel.get(bezoek.legsel_id);
      if (!legsel || cancelled) { setNestRingInfo(null); return; }
      const nest = await db.nest.get(legsel.nest_id);
      if (!nest || cancelled) { setNestRingInfo(null); return; }

      // Haal profiel van nestonderzoeker op (best-effort via Supabase)
      let profiel = null;
      try {
        const { data } = await supabase
          .from('profiles')
          .select('ringer_naam, email, ringer_nummer')
          .eq('id', nest.aangemaakt_door)
          .single();
        profiel = data;
      } catch { /* offline of geen toegang: toon nest zonder profiel */ }

      if (!cancelled) setNestRingInfo({ nest, profiel });
    }
    lookup();
    return () => { cancelled = true; };
  }, [form.ringnummer, records]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleTerugvangst = useCallback(() => {
    setForm(prev => prev.metalenringinfo === 4
      ? { ...prev, metalenringinfo: 2, centrale: 'NLA', omstandigheden: '20' }
      : { ...prev, metalenringinfo: 4, omstandigheden: '20', ringnummer: '' }
    );
  }, []);

  const contextValue = {
    form,
    vogelnaamDisplay,
    setVogelnaamDisplay,
    update,
    setForm,
    setFormErrors,
    formErrors,
    errorKeys,
    errCls,
    sections,
    toggleSection,
    isVeldZichtbaar,
    settings,
    configMap,
    getCodesForSelect,
    bioRanges,
    bioRangesFromRecords,
    bioGenderRanges,
    warnings,
    genderHint,
    euringCode,
    speciesInfo,
    ruitypenConfig,
    ruikaart,
    updateRuikaart,
    resetRuikaart,
    isTerugvangst,
    terugvangstInfo,
    nestRingInfo,
    toggleTerugvangst,
    autoFilledRingId,
    vogelnaamRef,
    programmaticFocus,
    suggestions,
    activeIndex,
    recentSpecies,
    recentSet,
    handleSpeciesInput,
    handleSpeciesFocus,
    handleSpeciesKeyDown,
    selectSpecies,
    ringcentraleOptions,
    cloacaWarning,
    renderBioField,
    soortOverride,
    euringLookup,
    editRecord,
    projects,
    aiFotos,
    setAiFotos,
    aiResultaat,
    setAiResultaat,
  };

  return (
    <div className="page nieuw-page">
      <NieuwFormContext.Provider value={contextValue}>
        {/* Banner als ringer vanuit nestbezoek werd geopend */}
        {nestContext && (
          <div className="nest-ring-context-banner">
            🥚 {t('nest_ring_context_banner', { soort: nestContext.soortNaam || '?', datum: nestContext.datum || '?' })}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Sticky header: topbar + foutmeldingen */}
          <div className="nieuw-sticky-header">
            <div className="nieuw-topbar">
              <span className="nieuw-topbar-titel">
                {editRecord ? t('form_edit_catch', { naam: editRecord.vogelnaam || '?' }) : t('form_new_catch')}
              </span>
              {editRecord && (
                <button type="button" className="btn-secondary nieuw-topbar-btn" onClick={() => navigate('/records')}>
                  {t('form_cancel')}
                </button>
              )}
              <button type="submit" className="btn-primary nieuw-topbar-btn">
                {t('form_save')}
              </button>
            </div>

            {formErrors.length > 0 && (
              <div className="form-error-bar">
                <strong>{t('form_required_intro')}</strong>
                <div className="form-error-list">
                  {formErrors.map(f => <span key={f.key} className="form-error-item">{f.label}</span>)}
                </div>
              </div>
            )}
          </div>

          {saved && (
            <div className="save-toast">{t('form_saved')}</div>
          )}

          <SectieSoort />
          <SectieProject />
          <SectieRinggegevens />
          <SectieAIAnalyse />
          <SectieVogel />
          <SectieVangst />
          <SectieBiometrieEnRui />
        </form>
      </NieuwFormContext.Provider>
    </div>
  );
}
