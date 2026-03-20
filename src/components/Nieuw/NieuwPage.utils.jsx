import { parseVal } from '../../utils/bioHelper';

// Fuzzy match: all characters of query must appear in order in target
// Returns score (lower = better) or -1 if no match
export function fuzzyMatch(query, target) {
  const q = query.toLowerCase();
  const t = target.toLowerCase();

  // Exact substring match — best score
  const substringIdx = t.indexOf(q);
  if (substringIdx === 0) return 0;   // starts-with
  if (substringIdx > 0) return 1;      // substring

  // Fuzzy: all chars in order
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  if (qi === q.length) return 2; // fuzzy match
  return -1; // no match
}

// Renders geslachtsymbolensymbolen inline in tekst (M → ♂, V/F → ♀)
export function renderGeslachtTekst(str) {
  if (!str) return str;
  return String(str).split(/([MVF])/).map((part, i) => {
    if (part === 'M') return <span key={i} className="gender-m">{'\u2642\uFE0E'}</span>;
    if (part === 'V' || part === 'F') return <span key={i} className="gender-f">{'\u2640\uFE0E'}</span>;
    return part || null;
  });
}

// Bereken min/max ranges uit vangstrecords per biometrie-veld (min 3 records, +10% marge)
export function computeRanges(soortRecords) {
  const fields = [
    { key: 'vleugel',       label: 'Vleugel' },
    { key: 'handpenlengte', label: 'P8' },
    { key: 'staartlengte',  label: 'Staart' },
    { key: 'kop_snavel',    label: 'Snavel-veer' },
    { key: 'snavel_schedel',label: 'Snavel-schedel' },
    { key: 'tarsus_lengte', label: 'Tarsus' },
    { key: 'tarsus_dikte',  label: 'Tarsus dikte' },
    { key: 'gewicht',       label: 'Gewicht' },
  ];
  const ranges = {};
  for (const f of fields) {
    const vals = soortRecords
      .map(r => parseVal(r[f.key]))
      .filter(v => !isNaN(v) && v > 0);
    if (vals.length >= 3) {
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const margin = (max - min) * 0.1 || min * 0.1;
      ranges[f.key] = {
        label: f.label,
        min: min,
        max: max,
        rangeMin: +(min - margin).toFixed(1),
        rangeMax: +(max + margin).toFixed(1),
        n: vals.length,
      };
    }
  }
  return ranges;
}
