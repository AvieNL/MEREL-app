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
