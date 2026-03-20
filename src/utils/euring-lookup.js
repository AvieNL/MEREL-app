export function buildEuringLookup(speciesData = []) {
  const lookup = {};
  for (const s of speciesData) {
    if (s.naam_nl && s.euring_code) {
      lookup[s.naam_nl.toLowerCase()] = String(s.euring_code);
    }
  }
  return lookup;
}
