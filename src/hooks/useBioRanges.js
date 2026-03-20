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
 * @param {string} vogelnaam  - Geselecteerde soort
 * @param {object} speciesInfo - Soortendata uit de species-tabel (null als onbekend)
 * @param {object} soortOverride - Gebruikersoverride voor de soort
 * @param {Array}  records   - Alle vangsten (filtert zelf op soort en leeftijd)
 * @param {object} form      - Huidig formulier (voor warnings en genderHint)
 * @returns {{ bioRangesFromRecords, bioRanges, bioGenderRanges, genderHint, warnings }}
 */
export function useBioRanges(vogelnaam, speciesInfo, soortOverride, records, form) {
  // Bereiken berekend uit eigen vangsten van deze soort
  const bioRangesFromRecords = useMemo(() => {
    if (!vogelnaam) return {};
    const lower = vogelnaam.toLowerCase();
    const soortRecords = records.filter(
      r => r.vogelnaam && r.vogelnaam.toLowerCase() === lower && r.leeftijd !== '1'
    );
    return computeBioRanges(soortRecords);
  }, [vogelnaam, records]);

  // Samengevoegde bereiken: literatuur (speciesInfo/override) > eigen vangsten
  const bioRanges = useMemo(() => {
    const merged = {};
    for (const f of BIO_KEYS) {
      const baseMin = parseVal(speciesInfo?.[`bio_${f.key}_min`]);
      const baseMax = parseVal(speciesInfo?.[`bio_${f.key}_max`]);
      const ovMin   = parseVal(soortOverride[`bio_${f.key}_min`]);
      const ovMax   = parseVal(soortOverride[`bio_${f.key}_max`]);
      const fromRec = bioRangesFromRecords[f.key];

      const litMin = !isNaN(baseMin) ? baseMin : ovMin;
      const litMax = !isNaN(baseMax) ? baseMax : ovMax;

      if (!isNaN(litMin) && !isNaN(litMax)) {
        merged[f.key] = { label: f.label, min: litMin, max: litMax, rangeMin: litMin, rangeMax: litMax, source: 'soortendata' };
      } else if (fromRec) {
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

  // Geslachtsspecifieke bereiken
  const bioGenderRanges = useMemo(() => {
    const GENDER_KEYS = ['vleugel', 'gewicht', 'handpenlengte', 'staartlengte', 'kop_snavel', 'tarsus_lengte', 'tarsus_dikte', 'snavel_schedel'];
    const result = { M: {}, F: {} };
    for (const gender of ['M', 'F']) {
      for (const key of GENDER_KEYS) {
        const ovMin   = parseVal(soortOverride[`bio_${key}_${gender}_min`]);
        const ovMax   = parseVal(soortOverride[`bio_${key}_${gender}_max`]);
        const baseMin = parseVal(speciesInfo?.[`bio_${key}_${gender}_min`]);
        const baseMax = parseVal(speciesInfo?.[`bio_${key}_${gender}_max`]);
        const min = !isNaN(ovMin) ? ovMin : (!isNaN(baseMin) ? baseMin : NaN);
        const max = !isNaN(ovMax) ? ovMax : (!isNaN(baseMax) ? baseMax : NaN);
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

    let mScore = 0;
    let fScore = 0;
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
