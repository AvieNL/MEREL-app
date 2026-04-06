export function normalizeRingnummer(ring) {
  return ring ? ring.replace(/\./g, '').replace(/\s/g, '').toLowerCase() : '';
}

// Bouwt een map van genormaliseerd ringnummer → vroegste nieuwe vangst (voor terugvangst-analyses)
export function buildEersteVangstMap(records) {
  const eersteVangst = {};
  records.forEach(r => {
    if (!r.ringnummer) return;
    if (r.metalenringinfo !== 4 && r.metalenringinfo !== '4') {
      const key = normalizeRingnummer(r.ringnummer);
      const bestaand = eersteVangst[key];
      if (!bestaand || (r.vangstdatum && (!bestaand.vangstdatum || r.vangstdatum < bestaand.vangstdatum))) {
        eersteVangst[key] = r;
      }
    }
  });
  return eersteVangst;
}
