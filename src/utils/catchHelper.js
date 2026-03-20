// Bouwt een map van ringnummer → vroegste nieuwe vangst (voor terugvangst-analyses)
export function buildEersteVangstMap(records) {
  const eersteVangst = {};
  records.forEach(r => {
    if (!r.ringnummer) return;
    if (r.metalenringinfo !== 4 && r.metalenringinfo !== '4') {
      const bestaand = eersteVangst[r.ringnummer];
      if (!bestaand || (r.vangstdatum && (!bestaand.vangstdatum || r.vangstdatum < bestaand.vangstdatum))) {
        eersteVangst[r.ringnummer] = r;
      }
    }
  });
  return eersteVangst;
}
