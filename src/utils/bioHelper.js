const BIO_RANGE_FIELDS = [
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
 * Bereken min/max bereiken per biometrie-veld uit een set vangstrecords.
 * Vereist minimaal 3 meetwaarden per veld.
 * Retourneert { [key]: { label, min, max, rangeMin, rangeMax, n } }
 * waarbij rangeMin/rangeMax een 10%-marge bevatten voor validatiedoeleinden.
 */
export function computeBioRanges(records) {
  const ranges = {};
  for (const f of BIO_RANGE_FIELDS) {
    const vals = records
      .map(r => parseVal(r[f.key]))
      .filter(v => !isNaN(v) && v > 0);
    if (vals.length >= 3) {
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const margin = (max - min) * 0.1 || min * 0.1;
      ranges[f.key] = {
        label: f.label,
        min,
        max,
        rangeMin: +(min - margin).toFixed(1),
        rangeMax: +(max + margin).toFixed(1),
        n: vals.length,
      };
    }
  }
  return ranges;
}

// Parse biometriewaarde naar float (komma of punt als decimaalscheider)
export function parseVal(v) {
  if (v === undefined || v === null || v === '') return NaN;
  return parseFloat(String(v).replace(',', '.'));
}

// Biometriewaarde naar string voor XML-export (null bij leeg/nul/ongeldig)
export function bioDecimal(val) {
  if (val === undefined || val === null || val === '') return null;
  const n = parseFloat(String(val).replace(',', '.'));
  if (isNaN(n) || n <= 0) return null;
  return String(n);
}
