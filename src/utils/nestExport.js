import { downloadFile } from './export';

/**
 * Bouw een genesteld data-object op voor export.
 * nesten → legsels → bezoeken (+ ringen per bezoek)
 */
export function buildNestExportData({ nesten, legsels, bezoeken, ringen, jaar, speciesByEuring }) {
  const jaarInt = parseInt(jaar, 10);

  return nesten.map(nest => {
    const nestLegsels = legsels
      .filter(l => l.nest_id === nest.id && l.jaar === jaarInt)
      .sort((a, b) => a.volgnummer - b.volgnummer)
      .map(legsel => {
        const soort = legsel.soort_euring ? (speciesByEuring[legsel.soort_euring] || null) : null;
        const legselBezoeken = bezoeken
          .filter(b => b.legsel_id === legsel.id)
          .sort((a, b) => a.datum.localeCompare(b.datum))
          .map(bezoek => {
            const bezoekRingen = ringen.filter(r => r.nestbezoek_id === bezoek.id);
            return { ...bezoek, ringen: bezoekRingen };
          });
        return { ...legsel, soort_naam: soort?.naam_nl || null, bezoeken: legselBezoeken };
      });

    if (nestLegsels.length === 0) return null;

    return { ...nest, legsels: nestLegsels };
  }).filter(Boolean);
}

/**
 * JSON-export: volledige nestdata van een seizoen
 */
export function exportNestJSON(data, jaar) {
  const json = JSON.stringify({
    export_datum: new Date().toISOString(),
    seizoen: jaar,
    nesten: data,
  }, null, 2);
  downloadFile(json, `nest-export-${jaar}.json`, 'application/json');
}

/**
 * CSV-export: gedenormaliseerde nestbezoeken van een seizoen
 * Één rij per bezoek.
 */
export function exportNestCSV(data, jaar) {
  const HEADER = [
    'kastnummer', 'omschrijving', 'lat', 'lon',
    'soort', 'habitat', 'nestplaats', 'nesttype',
    'legsel_nr', 'link_type', 'nestsucces',
    'bezoek_datum', 'bezoek_tijd', 'stadium',
    'aantal_eieren', 'aantal_pulli',
    'betrouwb_datum', 'betrouwb_aantal', 'betrouwb_dagen',
    'opmerkingen', 'vervolgbezoek_suggestie',
    'ringen',
  ];

  const rows = [];

  for (const nest of data) {
    for (const legsel of nest.legsels) {
      for (const bezoek of legsel.bezoeken) {
        rows.push([
          nest.kastnummer,
          nest.omschrijving || '',
          nest.lat || '',
          nest.lon || '',
          legsel.soort_naam || legsel.soort_euring || '',
          nest.habitat ?? '',
          nest.nestplaats ?? '',
          nest.nesttype ?? '',
          legsel.volgnummer,
          legsel.link_type ?? '',
          legsel.nestsucces ?? '',
          bezoek.datum,
          bezoek.tijd || '',
          bezoek.stadium,
          bezoek.aantal_eieren ?? '',
          bezoek.aantal_pulli ?? '',
          bezoek.betrouwb_datum ?? '',
          bezoek.betrouwb_aantal ?? '',
          bezoek.betrouwb_dagen ?? '',
          bezoek.opmerkingen || '',
          bezoek.volgende_bezoek_suggestie || '',
          bezoek.ringen.map(r => r.ringnummer || '?').join(';'),
        ]);
      }
    }
  }

  const escape = v => {
    const s = String(v);
    if (s.includes(';') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const csv = [HEADER, ...rows]
    .map(row => row.map(escape).join(';'))
    .join('\n');

  downloadFile(`\uFEFF${csv}`, `nest-export-${jaar}.csv`, 'text/csv;charset=utf-8');
}

/**
 * SOVON-export placeholder — GEDEACTIVEERD
 * Bouw maar verberg achter feature flag totdat importformaat bevestigd is.
 */
export function exportNestSOVON(_data, _jaar) {
  // TODO: implementeer SOVON digitale nestkaart XML/CSV formaat
  // zodra Vogelbescherming/SOVON het importformaat bevestigt
  throw new Error('SOVON export is nog niet geactiveerd');
}
