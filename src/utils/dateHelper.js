// Datum weergeven als dd-mm-yyyy (voor UI), handelt yyyy-mm-dd én d-m-yyyy af
export function formatDatum(d) {
  if (!d) return '';
  const p = d.split('-');
  if (p.length !== 3) return d;
  if (p[0].length === 4) return `${p[2].padStart(2, '0')}-${p[1].padStart(2, '0')}-${p[0]}`;
  return `${p[0].padStart(2, '0')}-${p[1].padStart(2, '0')}-${p[2]}`;
}

// ISO timestamp weergeven als dd-mm-yyyy HH:MM
export function formatDatumTijd(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  if (isNaN(d)) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
}

// Vandaag als yyyy-mm-dd (tijdzone-veilig: lokale datum, geen UTC-verschuiving)
export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Gisteren als yyyy-mm-dd
export function yesterdayISO() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Datum normaliseren naar yyyy-mm-dd (voor opslag en sortering)
export function toYMD(d) {
  if (!d) return d;
  const p = String(d).split('-');
  if (p.length !== 3) return d;
  if (p[0].length === 4) return `${p[0]}-${p[1].padStart(2, '0')}-${p[2].padStart(2, '0')}`;
  if (p[2].length === 4) return `${p[2]}-${p[1].padStart(2, '0')}-${p[0].padStart(2, '0')}`;
  return d;
}
