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
    .map(alinea => {
      const regels = alinea.split('\n').filter(regel => {
        const r = regel.trim();
        if (!r) return false;

        // Gooi regels weg die maateenheden bevatten (mm, g, kg, cm)
        // Gebruik losse check op unit — getal en unit hoeven niet aaneen te staan
        const heeftEenheid = /\b(mm|cm|kg)\b|(?<!\w)g\.(?!\w)|(?<=\d\s{0,4})g\b/.test(r);
        // Simpelere fallback: bevat " mm" of " g." of " kg"
        const heeftMaat = heeftEenheid || / mm\b| g[,. ·]| kg\b/.test(r);

        // Uitzondering: regel bevat ook kwalitatieve kenmerken
        const heeftKenmerk = /broedvlek|verenkleed|kleur|kaal|bleek|donker|glans|iris|oog|poot|lap\b/i.test(r);

        if (heeftMaat && !heeftKenmerk) return false;
        return true;
      });
      return regels.join('\n');
    })
    .filter(a => {
      if (!a) return false;
      // Gooi alinea's weg die alleen een "Maten"-koptekst zijn (zonder kwalitatief deel erna)
      const zonderMarkdown = a.replace(/\*\*/g, '').trim();
      // Detecteer: begint met symbool/tekst gevolgd door "Maten" of "maten"
      if (/maten\s*[\:\(]/i.test(zonderMarkdown) && zonderMarkdown.split('\n').length === 1) return false;
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

