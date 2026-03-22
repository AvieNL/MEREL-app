/**
 * Gedeelde TYPE_CFG en helper voor vangst-type badges.
 * Wordt gebruikt in RecordsPage, SoortDetail en eventuele andere pagina's.
 */

export const TYPE_CFG = {
  nw:  { icon: '○', cls: 'record-type--nw',  key: 'record_type_nw' },
  tv:  { icon: '⟳', cls: 'record-type--tv',  key: 'record_type_tv' },
  tvo: { icon: '⟲', cls: 'record-type--tvo', key: 'record_type_tvo' },
  tvx: { icon: '⊕', cls: 'record-type--tvx', key: 'record_type_tvx' },
  tva: { icon: '⟳', cls: 'record-type--tva', key: 'record_type_tva' },
  nwx: { icon: '○', cls: 'record-type--nwx', key: 'record_type_nwx' },
};

function normalizeRing(ring) {
  return ring ? ring.replace(/\./g, '').replace(/\s/g, '').toLowerCase() : '';
}

/**
 * Bouw een Map van ringnummer → eerste NV-record (voor TV-categorisatie).
 * @param {Array} records
 * @returns {Map<string, object>}
 */
export function buildNvByRing(records) {
  const map = new Map();
  records.forEach(r => {
    if (r.metalenringinfo !== 4 && r.metalenringinfo !== '4' && r.ringnummer) {
      map.set(normalizeRing(r.ringnummer), r);
    }
  });
  return map;
}

/**
 * Bepaal het vangsttype van een record.
 * @param {object} record
 * @param {Map<string, object>} nvByRing - gebuildd via buildNvByRing
 * @returns {'nw'|'tv'|'tvo'|'tvx'|'tva'|'nwx'}
 */
export function getVangstType(record, nvByRing) {
  if (record.bron === 'externe_tv_melding') return 'tva';
  if (record.bron === 'externe_ring_info') return 'nwx';
  if (record.metalenringinfo !== 4 && record.metalenringinfo !== '4') return 'nw';
  if (!record.ringnummer) return 'tvx';
  const original = nvByRing.get(normalizeRing(record.ringnummer));
  if (!original) return 'tvx';
  return original.project === record.project ? 'tv' : 'tvo';
}
