export { computeBioRanges as computeRanges } from '../../utils/bioHelper';

/**
 * Filtert matenregels uit geslachts_notities en geeft alleen kwalitatieve
 * kenmerken terug (broedvlek, kleur, uiterlijk, etc.).
 * Regels met maateenheden (mm, g, kg, cm) worden weggelaten.
 */
export function extractGeslachtsHint(tekst) {
  if (!tekst) return '';

  // Splits op lege regels (alinea's)
  const alineas = tekst.split(/\n{2,}/).map(a => a.trim()).filter(Boolean);

  const resultaat = alineas
    .filter(alinea => {
      // Gooi de "Maten"-alinea weg: begint (na bold-markers) met een "Maten"-koptekst
      // Voorbeeld: "**♂ Maten (Demongin...)**:" of "**♀ Maten:**"
      const kaal = alinea.replace(/\*\*/g, '').trim();
      if (/^[^\w]*maten[\s(]/i.test(kaal)) return false;
      return true;
    })
    .join('\n\n');

  return resultaat.trim();
}

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

