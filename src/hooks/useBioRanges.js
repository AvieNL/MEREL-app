import { useMemo } from 'react';
import { parseVal, computeBioRanges } from '../utils/bioHelper';

const BIO_KEYS = [
  { key: 'vleugel',        label: 'Vleugel' },
  { key: 'handpenlengte',  label: 'P8' },
  { key: 'staartlengte',   label: 'Staart' },
  { key: 'kop_snavel',     label: 'Snavel-veer' },
  { key: 'snavel_schedel', label: 'Snavel-schedel' },
  { key: 'tarsus_lengte',  label: 'Tarsus' },
  { key: 'tarsus_dikte',   label: 'Tarsus dikte' },
  { key: 'gewicht',        label: 'Gewicht' },
];

/**
 * Berekent biometrie-bereiken en validatieresultaten voor een geselecteerde soort.
 *
 * Merge-prioriteit (hoog → laag):
 *   1. Literatuurdata uit species-tabel  → source: 'literatuur'
 *   2. Eigen override via species_overrides → source: 'eigen-invoer'
 *   3. Eigen vangsten (min 3, ±10%, geen pullus) → source: 'vangsten'
 *
 * Geslachtslogica voor bioRanges:
 *   - geslacht M of F: gebruik geslachtsspecifieke range; val terug op algemeen bereik
 *   - geslacht U / leeg: gebruik algemeen bereik; als dat ontbreekt: afleiden uit M+F
 */
export function useBioRanges(vogelnaam, speciesInfo, soortOverride, records, form) {
  const geslacht = form?.geslacht || '';

  // Bereiken uit eigen vangsten
  const bioRangesFromRecords = useMemo(() => {
    if (!vogelnaam) return {};
    const lower = vogelnaam.toLowerCase();
    const soortRecords = records.filter(
      r => r.vogelnaam && r.vogelnaam.toLowerCase() === lower && r.leeftijd !== '1'
    );
    return computeBioRanges(soortRecords);
  }, [vogelnaam, records]);

  // Helper: haal literatuur- en override-waarden op voor één veld + optioneel geslacht
  function getFieldVals(key, gender) {
    const suffix = gender ? `_${gender}` : '';
    return {
      baseMin: parseVal(speciesInfo?.[`bio_${key}${suffix}_min`]),
      baseMax: parseVal(speciesInfo?.[`bio_${key}${suffix}_max`]),
      ovMin:   parseVal(soortOverride[`bio_${key}${suffix}_min`]),
      ovMax:   parseVal(soortOverride[`bio_${key}${suffix}_max`]),
    };
  }

  // Samengevoegde bereiken, geslachtsbewust
  const bioRanges = useMemo(() => {
    const merged = {};

    for (const f of BIO_KEYS) {
      let effMin, effMax, source;

      if (geslacht === 'M' || geslacht === 'F') {
        // 1a. Geslachtsspecifieke literatuur
        const gs = getFieldVals(f.key, geslacht);
        if (!isNaN(gs.baseMin) && !isNaN(gs.baseMax)) {
          effMin = gs.baseMin; effMax = gs.baseMax; source = 'literatuur';
        }
        // 1b. Geslachtsspecifieke eigen invoer
        else if (!isNaN(gs.ovMin) && !isNaN(gs.ovMax)) {
          effMin = gs.ovMin; effMax = gs.ovMax; source = 'eigen-invoer';
        }
        // val terug op algemeen bereik hieronder als nog niet gevonden
      }

      if (effMin === undefined) {
        const gen = getFieldVals(f.key, null);
        const mVals = getFieldVals(f.key, 'M');
        const fVals = getFieldVals(f.key, 'F');

        // 2. Algemeen literatuurbereik
        if (!isNaN(gen.baseMin) && !isNaN(gen.baseMax)) {
          effMin = gen.baseMin; effMax = gen.baseMax; source = 'literatuur';
        }
        // 3. Afgeleid uit M+F literatuurbereiken
        else if (
          (!isNaN(mVals.baseMin) || !isNaN(fVals.baseMin)) &&
          (!isNaN(mVals.baseMax) || !isNaN(fVals.baseMax))
        ) {
          const mins = [mVals.baseMin, fVals.baseMin].filter(v => !isNaN(v));
          const maxs = [mVals.baseMax, fVals.baseMax].filter(v => !isNaN(v));
          effMin = Math.min(...mins); effMax = Math.max(...maxs); source = 'literatuur';
        }
        // 4. Algemene eigen invoer
        else if (!isNaN(gen.ovMin) && !isNaN(gen.ovMax)) {
          effMin = gen.ovMin; effMax = gen.ovMax; source = 'eigen-invoer';
        }
        // 5. Afgeleid uit M+F eigen invoer
        else if (
          (!isNaN(mVals.ovMin) || !isNaN(fVals.ovMin)) &&
          (!isNaN(mVals.ovMax) || !isNaN(fVals.ovMax))
        ) {
          const mins = [mVals.ovMin, fVals.ovMin].filter(v => !isNaN(v));
          const maxs = [mVals.ovMax, fVals.ovMax].filter(v => !isNaN(v));
          effMin = Math.min(...mins); effMax = Math.max(...maxs); source = 'eigen-invoer';
        }
      }

      if (effMin !== undefined) {
        merged[f.key] = { label: f.label, min: effMin, max: effMax, rangeMin: effMin, rangeMax: effMax, source };
      } else {
        // 6. Eigen vangsten als fallback
        const fromRec = bioRangesFromRecords[f.key];
        if (fromRec) {
          const margin = (fromRec.max - fromRec.min) * 0.1 || fromRec.min * 0.1;
          merged[f.key] = {
            label: f.label, min: fromRec.min, max: fromRec.max,
            rangeMin: +(fromRec.min - margin).toFixed(1),
            rangeMax: +(fromRec.max + margin).toFixed(1),
            source: 'vangsten',
          };
        }
      }
    }
    return merged;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bioRangesFromRecords, soortOverride, speciesInfo, geslacht]);

  // Geslachtsspecifieke bereiken (voor genderhint en per-veld kleur)
  const bioGenderRanges = useMemo(() => {
    const GENDER_KEYS = ['vleugel', 'gewicht', 'handpenlengte', 'staartlengte', 'kop_snavel', 'tarsus_lengte', 'tarsus_dikte', 'snavel_schedel'];
    const result = { M: {}, F: {} };
    for (const gender of ['M', 'F']) {
      for (const key of GENDER_KEYS) {
        // Prioriteit: literatuur > eigen invoer
        const baseMin = parseVal(speciesInfo?.[`bio_${key}_${gender}_min`]);
        const baseMax = parseVal(speciesInfo?.[`bio_${key}_${gender}_max`]);
        const ovMin   = parseVal(soortOverride[`bio_${key}_${gender}_min`]);
        const ovMax   = parseVal(soortOverride[`bio_${key}_${gender}_max`]);
        const min = !isNaN(baseMin) ? baseMin : (!isNaN(ovMin) ? ovMin : NaN);
        const max = !isNaN(baseMax) ? baseMax : (!isNaN(ovMax) ? ovMax : NaN);
        if (!isNaN(min) && !isNaN(max)) {
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

  // Geslachtshint op basis van ingevulde biometriewaarden
  const genderHint = useMemo(() => {
    const mR = bioGenderRanges.M;
    const fR = bioGenderRanges.F;
    const dualFields = Object.keys(mR).filter(k => fR[k]);
    if (dualFields.length === 0) return null;

    let mScore = 0, fScore = 0, checked = 0;
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
    if (mScore > 0 && fScore === 0) return 'M';
    if (fScore > 0 && mScore === 0) return 'F';
    if (mScore >= 2 && mScore > fScore * 2) return 'M';
    if (fScore >= 2 && fScore > mScore * 2) return 'F';
    return null;
  }, [form, bioGenderRanges]);

  // Waarschuwingen: waarden buiten het verwachte bereik
  const warnings = useMemo(() => {
    const w = [];
    for (const [key, range] of Object.entries(bioRanges)) {
      const val = parseVal(form[key]);
      if (!isNaN(val) && val > 0) {
        if (val < range.rangeMin || val > range.rangeMax) {
          w.push({ key, label: range.label, value: val, min: range.rangeMin, max: range.rangeMax });
        }
      }
    }
    return w;
  }, [form, bioRanges]);

  return { bioRangesFromRecords, bioRanges, bioGenderRanges, genderHint, warnings };
}
