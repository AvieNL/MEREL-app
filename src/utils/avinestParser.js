/**
 * Parser voor AviNest TXT-export (tab-separated, ISO-8859-1).
 * Groepeert de denormale rijen naar nest / legsel / nestbezoek / nestring.
 */

const intOrNull  = v => { const n = parseInt(v,  10); return isNaN(n) ? null : n; };
const floatOrNull = v => { const n = parseFloat((v || '').replace(',', '.')); return isNaN(n) ? null : n; };

function pad2(s) { return String(s).padStart(2, '0'); }

export function parseAviNestTXT(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) {
    return { nesten: [], legsels: [], bezoeken: [], ringen: [], fouten: [] };
  }

  // Header → kolom-index map
  const headers = lines[0].split('\t').map(h => h.trim());
  const col = {};
  headers.forEach((h, i) => { col[h] = i; });

  const get = (row, name) => {
    const idx = col[name];
    return idx !== undefined ? (row[idx] ?? '').trim() : '';
  };

  const fouten   = [];
  const nestenMap  = new Map(); // nestKey  → nest data
  const legselsMap = new Map(); // legselKey → legsel data
  const bezoekMap  = new Map(); // bezoekKey → bezoek data
  const ringenSeen = new Set();
  const ringenList = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split('\t');
    if (row.every(c => !c.trim())) continue;

    const kaartnr   = get(row, 'KAARTNR');
    const nestnr    = get(row, 'NESTNR');
    const legselnr  = get(row, 'LEGSELNR');
    const pidcode   = get(row, 'PIDCODE');
    const jaar      = get(row, 'JAAR');
    const bezoekdag  = get(row, 'BEZOEKDAG');
    const bezoekmaan = get(row, 'BEZOEKMAAN');
    const bezoekuur  = get(row, 'BEZOEKUUR');
    const ringnr    = get(row, 'RINGNR');

    if (!kaartnr) {
      fouten.push({ rij: i + 1, kaartnr: '?', reden: 'Ontbreekt KAARTNR' });
      continue;
    }

    // ── Nest ────────────────────────────────────────────────────────────────
    const nestKey = `${nestnr}|${pidcode}`;
    if (!nestenMap.has(nestKey)) {
      nestenMap.set(nestKey, {
        _key:        nestKey,
        kastnummer:  nestnr,
        adres:       [get(row, 'PLAATS'), get(row, 'PERCEELNR')].filter(Boolean).join(', '),
        lat:         floatOrNull(get(row, 'Y_DEG')),
        lon:         floatOrNull(get(row, 'X_DEG')),
        soort_euring: get(row, 'EURING') || null,
        habitat:     intOrNull(get(row, 'HABITAT')),
        nestplaats:  intOrNull(get(row, 'NESTPLAATS')),
        kasttype:    intOrNull(get(row, 'KASTTYPE')),
        hoogte:      floatOrNull(get(row, 'HOOGTE')),
        bescherm:    intOrNull(get(row, 'BESCHERM')),
        verstopt:    intOrNull(get(row, 'VERSTOPT')),
      });
    }

    // ── Legsel ──────────────────────────────────────────────────────────────
    const legselKey = `${kaartnr}|${legselnr}`;
    if (!legselsMap.has(legselKey)) {
      const dag  = get(row, 'DAG_1E_EI');
      const maan = get(row, 'MAAND_1E_E');
      const datum1eEi = dag && maan && jaar
        ? `${jaar}-${pad2(maan)}-${pad2(dag)}`
        : null;

      legselsMap.set(legselKey, {
        _key:      legselKey,
        _nestKey:  nestKey,
        _kaartnr:  intOrNull(kaartnr),
        _legselnr: intOrNull(legselnr),
        volgnummer:    intOrNull(kaartnr),  // KAARTNR als unieke sleutel
        jaar:          intOrNull(jaar),
        link_type:     0,
        datum_1e_ei:   datum1eEi,
        eistartmarge:  intOrNull(get(row, 'EISTARTMARGE')),
        nestsucces:    intOrNull(get(row, 'UITGEVL')),
        predatie:      intOrNull(get(row, 'PREDATIE')),
        verlies:       get(row, 'VERLIES')    || null,
        moment:        get(row, 'MOMENT_V_M') || null,
      });
    }

    // ── Nestbezoek ──────────────────────────────────────────────────────────
    if (bezoekdag && bezoekmaan) {
      if (!jaar) {
        fouten.push({ rij: i + 1, kaartnr, reden: 'Bezoekdatum onbekend (geen JAAR)' });
      } else {
        const bezoekKey = `${kaartnr}|${legselnr}|${bezoekdag}|${bezoekmaan}|${bezoekuur}`;
        if (!bezoekMap.has(bezoekKey)) {
          bezoekMap.set(bezoekKey, {
            _key:       bezoekKey,
            _legselKey: legselKey,
            datum:      `${jaar}-${pad2(bezoekmaan)}-${pad2(bezoekdag)}`,
            stadium:    get(row, 'BROED_1') || null,
            stadium2:   get(row, 'BROED_2') || null,
            aantal_eieren: intOrNull(get(row, 'EI')),
            ei_dood:       intOrNull(get(row, 'EI_DOOD')),
            aantal_pulli:  intOrNull(get(row, 'JONG')),
            jong_dood:     intOrNull(get(row, 'JONG_DOOD')),
            betrouwb_datum:  intOrNull(get(row, 'DATUM_BETR')) ?? 1,
            betrouwb_aantal: intOrNull(get(row, 'EI_BETR')) ?? intOrNull(get(row, 'JONG_BETR')) ?? 1,
            betrouwb_dagen:  2,
            opmerkingen:     get(row, 'OPM_BEZOEK') || '',
          });
        }
      }
    }

    // ── Nestring ────────────────────────────────────────────────────────────
    if (ringnr && bezoekdag && bezoekmaan && jaar) {
      const schoon = ringnr.replace(/\./g, '');
      if (schoon) {
        const bezoekKey = `${kaartnr}|${legselnr}|${bezoekdag}|${bezoekmaan}|${bezoekuur}`;
        const ringKey   = `${bezoekKey}|${schoon}`;
        if (!ringenSeen.has(ringKey)) {
          ringenSeen.add(ringKey);
          ringenList.push({
            _bezoekKey: bezoekKey,
            ringnummer: schoon,
            vleugel:    floatOrNull(get(row, 'VLEUGEL')),
            tarsus:     floatOrNull(get(row, 'TARSUS')),
            gewicht:    floatOrNull(get(row, 'GEWICHT')),
          });
        }
      }
    }
  }

  return {
    nesten:  [...nestenMap.values()],
    legsels: [...legselsMap.values()],
    bezoeken: [...bezoekMap.values()],
    ringen:  ringenList,
    fouten,
  };
}
