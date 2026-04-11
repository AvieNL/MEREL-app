import { downloadFile } from './export';

/**
 * Bouw een genesteld data-object op voor export.
 * nesten → legsels → bezoeken (+ ringen per bezoek)
 */
export function buildNestExportData({ nesten, legsels, bezoeken, ringen, jaar, speciesByEuring }) {
  const jaarInt = jaar ? parseInt(jaar, 10) : null;

  return nesten.map(nest => {
    const nestLegsels = legsels
      .filter(l => l.nest_id === nest.id && (jaarInt === null || l.jaar === jaarInt))
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
 * JSON backup: alle data over alle jaren incl. vangsten en oudervogels
 */
export function exportNestJSONBackup({ nesten, legsels, bezoeken, ringen, vangsten, ouders }) {
  const json = JSON.stringify({
    export_datum: new Date().toISOString(),
    export_versie: '3.0',
    bron: 'VRS Breedenbroek nestkastmodule',
    nesten: nesten.map(nest => ({
      ...nest,
      legsels: legsels
        .filter(l => l.nest_id === nest.id)
        .sort((a, b) => (a.jaar - b.jaar) || (a.volgnummer - b.volgnummer))
        .map(legsel => ({
          ...legsel,
          ouders: (ouders || []).filter(o => o.legsel_id === legsel.id),
          bezoeken: bezoeken
            .filter(b => b.legsel_id === legsel.id)
            .sort((a, b) => a.datum.localeCompare(b.datum))
            .map(bezoek => ({
              ...bezoek,
              ringen: ringen
                .filter(r => r.nestbezoek_id === bezoek.id)
                .map(ring => ({
                  ...ring,
                  vangst: vangsten?.find(v => v.id === ring.vangst_id) ?? null,
                })),
            })),
        })),
    })),
  }, null, 2);

  const datum = new Date().toISOString().slice(0, 10);
  downloadFile(json, `nest-backup-${datum}.json`, 'application/json');
}

/**
 * CSV-export: gedenormaliseerde nestbezoeken van een seizoen
 * Één rij per bezoek.
 */
export function exportNestCSV(data, jaar) {
  const HEADER = [
    'kastnummer', 'omschrijving', 'lat', 'lon',
    'soort', 'habitat', 'nestplaats', 'nesttype', 'kasttype', 'hoogte',
    'legsel_nr', 'link_type', 'datum_1e_ei', 'nestsucces',
    'bezoek_datum', 'bezoek_tijd', 'stadium', 'stadium2',
    'aantal_eieren', 'ei_dood', 'aantal_pulli', 'jong_dood',
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
          nest.kasttype ?? '',
          nest.hoogte ?? '',
          legsel.volgnummer,
          legsel.link_type ?? '',
          legsel.datum_1e_ei || '',
          legsel.nestsucces ?? '',
          bezoek.datum,
          bezoek.tijd || '',
          bezoek.stadium,
          bezoek.stadium2 || '',
          bezoek.aantal_eieren ?? '',
          bezoek.ei_dood ?? '',
          bezoek.aantal_pulli ?? '',
          bezoek.jong_dood ?? '',
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

// ── Helpers voor AviNest-formaat ─────────────────────────────────────────────

function datumDag(iso)   { return iso ? parseInt(iso.slice(8, 10), 10) : ''; }
function datumMaand(iso) { return iso ? parseInt(iso.slice(5, 7),  10) : ''; }

function tijdUur(tijdStr) {
  if (!tijdStr) return '';
  return String(tijdStr).replace(':', '').slice(0, 2) || '';
}

function stadiumNaarLeeftijd(stadium) {
  if (!stadium || stadium === 'N+') return '';
  const m = stadium.match(/^N(\d+)$/);
  return m ? parseInt(m[1], 10) : '';
}

function sexeNaarAviNest(geslacht) {
  if (geslacht === 'M') return 'M';
  if (geslacht === 'V') return 'V';
  return 'O';
}

// Kolomvolgorde conform ExportAviNest.TXT header
const AVINIST_HEADERS = [
  'KAARTNR','EURING','SOORT','PROV','LAND','JAAR','PIDCODE','PLAATS','PERCEELNR',
  'ATLASBLOK','KMHOK','X_COORD','Y_COORD','X_DEG','Y_DEG','NAUWK','NESTNR','LEGSELNR',
  'DAG_1E_EI','MAAND_1E_E','EISTARTMARGE','EIMETHODE','LEGSELGR','BEZOEKENKLAAR',
  'BRD_SUCCES','OPM_BROEDSUCCES','MOMENT_V_M','UITGEVL','ALLESGERINGD',
  'BESCHERM','OPM_BESCHERMING','VERLIES','OPM_NESTVERLIES','PREDATIE',
  'RINGDAG','RINGMAAND','HABITAT','OPM_HABITAT','NESTPLAATS','OPM_NESTPLAATS',
  'NEST','OPM_NEST','KASTTYPE','VERSTOPT','NESTSTAAT','HOOGTE','HOOGNAUWK',
  'HOE_GEVOND','OPM_HOEGEVONDEN','LINK_KAART','LINK_TYPE','PENNR','CONTROLE',
  'AANGEMAAKT','MAAKMETHODE','GEWIJZIGD','LOCK','OUDNR','KOLONIENR','PLOTNR',
  'ALGZELF1','ALGZELF2','ALGZELF3','ALGZELF4','ALGZELF5',
  'NESTZELF1','NESTZELF2','NESTZELF3','NESTZELF4','NESTZELF5',
  'SUCCESZELF1','SUCCESZELF2','SUCCESZELF3','SUCCESZELF4','SUCCESZELF5',
  'OPM_KAART',
  'BEZOEKDAG','BEZOEKMAAN','DATUM_BETR','BEZOEKUUR',
  'EI','EI_BETR','EI_DOOD','EI_DVERW','JONG','JONG_BETR','JONG_DOOD','JONG_DVERW',
  'LEEFTIJD','LEEFT_BETR','BROED_1','BROED_2','BEZOEKTYPE',
  'ZELF1','ZELF2','ZELF3','OPM_BEZOEK',
  'CENTRALE','RINGNR','RINGPOSITIE','RINGTYPE','KLEURRING','STEMPEL',
  'LEEFTIJD_KLASSE','SEXE','SEXEMETHODE','TMD','RINGERSNR','PROJECTNR','EXPORTED',
  'KLEURVANDAAG','STEMPVANDAAG','ZELF1_1','ZELF2_1','ZELF3_1','ZELF4','ZELF5','OPM_RINGEN',
  'VLEUGEL','PEN','SNAVEL','KOP','TARSUS','GEWICHT','CONDITIE','KROP','OPM_BIOMETRIE',
];

/**
 * AviNest TXT-export: tab-separated, één rij per ring (of per bezoek zonder ringen).
 * Conform het SOVON AviNest exportformaat.
 */
export function exportAviNestTXT({ nesten, legsels, bezoeken, ringen, vangsten, speciesByEuring }) {
  const rows = [];
  let kaartnr = 1;

  for (const nest of [...nesten].sort((a, b) => String(a.kastnummer).localeCompare(String(b.kastnummer)))) {
    const nestLegsels = legsels
      .filter(l => l.nest_id === nest.id)
      .sort((a, b) => (a.jaar - b.jaar) || (a.volgnummer - b.volgnummer));

    for (const legsel of nestLegsels) {
      const legselBezoeken = bezoeken
        .filter(b => b.legsel_id === legsel.id)
        .sort((a, b) => a.datum.localeCompare(b.datum));

      const soortEuring = legsel.soort_euring
        || legselBezoeken.find(b => b.soort_euring)?.soort_euring
        || nest.soort_euring || '';
      const soortNaam = soortEuring
        ? (speciesByEuring[soortEuring]?.naam_nl ?? soortEuring) : '';

      const legselgr = legselBezoeken.reduce((max, b) =>
        (b.aantal_eieren ?? 0) > max ? (b.aantal_eieren ?? 0) : max, 0) || '';

      const heeftAfsluitend = legselBezoeken.some(b =>
        b.stadium?.startsWith('C') || b.stadium?.startsWith('X'));

      const ringBezoek = legselBezoeken.find(b => ringen.some(r => r.nestbezoek_id === b.id));

      const nestBase = {
        KAARTNR: kaartnr, EURING: soortEuring, SOORT: soortNaam,
        PROV: 'GL', LAND: 'NL', JAAR: legsel.jaar ?? '',
        PIDCODE: '', PLAATS: splitAdresPlaats(nest.adres), PERCEELNR: nest.adres || '',
        ATLASBLOK: '', KMHOK: '', X_COORD: '', Y_COORD: '',
        X_DEG: nest.lon ?? '', Y_DEG: nest.lat ?? '', NAUWK: 1,
        NESTNR: nest.kastnummer ?? '', LEGSELNR: legsel.volgnummer ?? '',
        DAG_1E_EI: datumDag(legsel.datum_1e_ei), MAAND_1E_E: datumMaand(legsel.datum_1e_ei),
        EISTARTMARGE: legsel.eistartmarge ?? '', EIMETHODE: legsel.eimethode ?? '',
        LEGSELGR: legselgr, BEZOEKENKLAAR: heeftAfsluitend ? 1 : 0,
        BRD_SUCCES: legsel.nestsucces ?? '', OPM_BROEDSUCCES: '',
        MOMENT_V_M: legsel.moment ?? '', UITGEVL: legsel.nestsucces ?? '', ALLESGERINGD: 0,
        BESCHERM: nest.bescherm ?? '', OPM_BESCHERMING: '',
        VERLIES: legsel.verlies ?? '', OPM_NESTVERLIES: '', PREDATIE: legsel.predatie ?? '',
        RINGDAG: ringBezoek ? datumDag(ringBezoek.datum) : '',
        RINGMAAND: ringBezoek ? datumMaand(ringBezoek.datum) : '',
        HABITAT: nest.habitat ?? '', OPM_HABITAT: '',
        NESTPLAATS: nest.nestplaats ?? '', OPM_NESTPLAATS: nest.nestplaats_toelichting ?? '',
        NEST: nest.nesttype ?? '', OPM_NEST: nest.nesttype_toelichting ?? '',
        KASTTYPE: nest.kasttype ?? '', VERSTOPT: nest.verstopt ?? '', NESTSTAAT: '',
        HOOGTE: nest.hoogte ?? '', HOOGNAUWK: nest.hoogte != null ? 10 : '',
        HOE_GEVOND: nest.vondst ?? '', OPM_HOEGEVONDEN: nest.vondst_toelichting ?? '',
        LINK_KAART: '', LINK_TYPE: legsel.link_type ?? '',
        PENNR: '', CONTROLE: 0, AANGEMAAKT: legsel.updated_at?.slice(0, 10) ?? '',
        MAAKMETHODE: 1, GEWIJZIGD: nest.updated_at?.slice(0, 10) ?? '', LOCK: 0,
        OUDNR: '', KOLONIENR: '', PLOTNR: '',
        ALGZELF1: '', ALGZELF2: '', ALGZELF3: '', ALGZELF4: '', ALGZELF5: '',
        NESTZELF1: '', NESTZELF2: '', NESTZELF3: '', NESTZELF4: '', NESTZELF5: '',
        SUCCESZELF1: '', SUCCESZELF2: '', SUCCESZELF3: '', SUCCESZELF4: '', SUCCESZELF5: '',
        OPM_KAART: nest.toelichting ?? '',
      };

      for (const bezoek of legselBezoeken) {
        const bezoekRingen = ringen.filter(r => r.nestbezoek_id === bezoek.id);
        const bezoekBase = {
          BEZOEKDAG: datumDag(bezoek.datum), BEZOEKMAAN: datumMaand(bezoek.datum),
          DATUM_BETR: bezoek.betrouwb_datum ?? 1, BEZOEKUUR: tijdUur(bezoek.tijd),
          EI: bezoek.aantal_eieren ?? '', EI_BETR: bezoek.betrouwb_aantal ?? '',
          EI_DOOD: bezoek.ei_dood ?? '', EI_DVERW: '',
          JONG: bezoek.aantal_pulli ?? '', JONG_BETR: bezoek.betrouwb_aantal ?? '',
          JONG_DOOD: bezoek.jong_dood ?? '', JONG_DVERW: '',
          LEEFTIJD: stadiumNaarLeeftijd(bezoek.stadium),
          LEEFT_BETR: bezoek.betrouwb_dagen ?? '',
          BROED_1: bezoek.stadium ?? '', BROED_2: bezoek.stadium2 ?? '',
          BEZOEKTYPE: bezoekRingen.length > 0 ? 6 : 1,
          ZELF1: '', ZELF2: '', ZELF3: '', OPM_BEZOEK: bezoek.opmerkingen ?? '',
        };

        if (bezoekRingen.length === 0) {
          rows.push(buildAviNestRow({ ...nestBase, ...bezoekBase, ...emptyRingCols() }));
        } else {
          for (const ring of bezoekRingen) {
            const vangst = vangsten?.find(v => v.id === ring.vangst_id) ?? null;
            rows.push(buildAviNestRow({ ...nestBase, ...bezoekBase, ...buildRingCols(ring, vangst) }));
          }
        }
      }
    }

    kaartnr++;
  }

  const datum = new Date().toISOString().slice(0, 10);
  const txt = AVINIST_HEADERS.join('\t') + '\n' + rows.join('\n');
  downloadFile(txt, `ExportAviNest-${datum}.txt`, 'text/plain;charset=utf-8');
}

function splitAdresPlaats(adres) {
  if (!adres) return '';
  const parts = adres.split(',');
  return parts.length > 1 ? parts.slice(1).join(',').trim() : '';
}

function emptyRingCols() {
  return {
    CENTRALE: '', RINGNR: '', RINGPOSITIE: '', RINGTYPE: '', KLEURRING: '', STEMPEL: '',
    LEEFTIJD_KLASSE: '', SEXE: '', SEXEMETHODE: '', TMD: '', RINGERSNR: '', PROJECTNR: '',
    EXPORTED: '', KLEURVANDAAG: '', STEMPVANDAAG: '',
    ZELF1_1: '', ZELF2_1: '', ZELF3_1: '', ZELF4: '', ZELF5: '', OPM_RINGEN: '',
    VLEUGEL: '', PEN: '', SNAVEL: '', KOP: '', TARSUS: '', GEWICHT: '', CONDITIE: '',
    KROP: '', OPM_BIOMETRIE: '',
  };
}

function buildRingCols(ring, vangst) {
  return {
    CENTRALE: vangst?.centrale ?? 'NLA',
    RINGNR: ring.ringnummer ?? vangst?.ringnummer ?? '',
    RINGPOSITIE: 'RO', RINGTYPE: 1, KLEURRING: '', STEMPEL: '',
    LEEFTIJD_KLASSE: 2,
    SEXE: sexeNaarAviNest(vangst?.geslacht),
    SEXEMETHODE: vangst?.geslacht_methode ?? 0,
    TMD: '', RINGERSNR: vangst?.ringer_nummer ?? '',
    PROJECTNR: vangst?.project ?? '', EXPORTED: 1,
    KLEURVANDAAG: '', STEMPVANDAAG: '',
    ZELF1_1: '', ZELF2_1: '', ZELF3_1: '', ZELF4: '', ZELF5: '',
    OPM_RINGEN: vangst?.opmerkingen ?? '',
    VLEUGEL: vangst?.vleugel ?? '', PEN: vangst?.p8 ?? '',
    SNAVEL: vangst?.snavel ?? '', KOP: vangst?.kop_snavel ?? '',
    TARSUS: vangst?.tarsus ?? '', GEWICHT: vangst?.gewicht ?? '',
    CONDITIE: vangst?.conditie ?? '', KROP: vangst?.krop ?? '',
    OPM_BIOMETRIE: '',
  };
}

function buildAviNestRow(data) {
  return AVINIST_HEADERS.map(h => String(data[h] ?? '')).join('\t');
}

/**
 * XML-export: nestlocaties conform AviNest ExportPlaats.XML formaat
 */
export function exportAviNestXML({ nesten, legsels, speciesByEuring }) {
  const esc = v => String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const records = nesten.map((nest, idx) => {
    const nestLegsels = legsels.filter(l => l.nest_id === nest.id);
    const soortEuring = nest.soort_euring
      || nestLegsels.find(l => l.soort_euring)?.soort_euring || '';
    const soortNaam = soortEuring
      ? (speciesByEuring[soortEuring]?.naam_nl ?? soortEuring) : '';
    const jaren = nestLegsels.map(l => l.jaar).filter(Boolean);
    const jaar = jaren.length > 0 ? Math.max(...jaren) : new Date().getFullYear();

    return `  <record>
    <id>${idx + 1}</id>
    <jaar>${jaar}</jaar>
    <euring>${esc(soortEuring)}</euring>
    <soort>${esc(soortNaam)}</soort>
    <prov>GL</prov>
    <land>NL</land>
    <plaats>${esc(splitAdresPlaats(nest.adres))}</plaats>
    <perceelnr>${esc(nest.adres || '')}</perceelnr>
    <atlasblok></atlasblok>
    <kmhok></kmhok>
    <x_coord></x_coord>
    <y_coord></y_coord>
    <x_deg>${nest.lon ?? ''}</x_deg>
    <y_deg>${nest.lat ?? ''}</y_deg>
    <nauwk>1</nauwk>
    <nestnr>${esc(nest.kastnummer)}</nestnr>
    <bescherm>${nest.bescherm ?? ''}</bescherm>
    <habitat>${nest.habitat ?? ''}</habitat>
    <nestplaats>${nest.nestplaats ?? ''}</nestplaats>
    <nest>${nest.nesttype ?? ''}</nest>
    <kasttype>${nest.kasttype ?? ''}</kasttype>
    <hoogte>${nest.hoogte ?? ''}</hoogte>
    <hoognauwk>${nest.hoogte != null ? 10 : ''}</hoognauwk>
    <hoe_gevond>${nest.vondst ?? ''}</hoe_gevond>
    <verstopt>${nest.verstopt ?? ''}</verstopt>
    <algzelf1 /><algzelf2 /><algzelf3 /><algzelf4 /><algzelf5 />
    <nestzelf1 /><nestzelf2 /><nestzelf3 /><nestzelf4 /><nestzelf5 />
  </record>`;
  }).join('\n');

  const datum = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<exportplaats>
${records}
</exportplaats>`;
  downloadFile(xml, `ExportPlaats-${datum}.xml`, 'application/xml;charset=utf-8');
}

/**
 * SOVON-export placeholder — GEDEACTIVEERD
 */
export function exportNestSOVON(_data, _jaar) {
  throw new Error('SOVON export is nog niet geactiveerd');
}
