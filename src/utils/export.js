import euringCodes from '../data/euring-codes.json';

// CSV Export
export function exportCSV(records) {
  if (!records.length) return '';
  const headers = Object.keys(records[0]);
  const rows = records.map(r =>
    headers.map(h => {
      const val = r[h] ?? '';
      const str = String(val);
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    }).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

// JSON Export
export function exportJSON(records) {
  return JSON.stringify(records, null, 2);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function xmlEsc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\r?\n/g, ' ');  // geen enters toegestaan in vrije tekstvelden
}

function tag(name, value) {
  return `    <${name}>${xmlEsc(value)}</${name}>`;
}

function bioTag(name, value) {
  return `      <${name}>${xmlEsc(value)}</${name}>`;
}

// Datum naar yyyy-mm-dd (GRIEL-formaat)
function toISO(d) {
  if (!d) return '';
  const parts = String(d).split('-');
  if (parts.length === 3 && parts[0].length === 2) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return String(d);
}

// Tijd naar HHMM (4 cijfers, geen dubbele punt)
function toCatchTime(t) {
  if (!t) return '';
  const [h, m] = String(t).split(':');
  return h.padStart(2, '0') + (m || '00').slice(0, 2);
}

// Weegtijd naar hh:mm:ss
function toWeighingTime(t) {
  if (!t) return '';
  const clean = String(t).replace(/:/g, '');
  if (clean.length >= 4) {
    return `${clean.slice(0, 2)}:${clean.slice(2, 4)}:00`;
  }
  return t;
}

// Geslacht: V → F (GRIEL gebruikt F voor vrouw)
function toSex(g) {
  if (!g) return 'U';
  if (g === 'V') return 'F';
  return g;
}

// EURING-soortcode opzoeken op naam (lowercase)
function speciesCode(naam) {
  if (!naam) return '';
  const code = euringCodes[naam.toLowerCase()];
  return code ? String(parseInt(code, 10)) : '';  // bijv. "00720" → "720"
}

// Decimaal met punt (GRIEL gebruikt Engelse notatie in Biometrics)
function bioDecimal(val) {
  if (val === undefined || val === null || val === '') return null;
  const s = String(val).replace(',', '.');
  const n = parseFloat(s);
  return isNaN(n) ? null : String(n);
}

// Vandaag als yyyy-mm-dd
function today() {
  return new Date().toISOString().slice(0, 10);
}

// ── Griel XML Export ─────────────────────────────────────────────────────────

/**
 * Exporteert records als GRIEL bulkupload XML (versie 3.0 / BulkImportNew.xsd)
 * @param {Array} records - Vangstrecords
 * @param {Array} projects - Projectenlijst (voor ActingUserProjectID via nummer)
 */
export function exportGrielXML(records, projects = []) {
  // Projectnummer-map: naam → nummer (ActingUserProjectID)
  const projectNummer = {};
  projects.forEach(p => {
    if (p.naam && p.nummer) projectNummer[p.naam] = p.nummer;
  });

  const captures = records.map(r => {
    const actingId = r.project ? (projectNummer[r.project] || '') : '';
    const specCode  = speciesCode(r.vogelnaam);
    const catchDate = toISO(r.vangstdatum);
    const reportingDate = today();

    // ── Capture-velden (volgorde conform XSD) ───────────────────────────────
    const captureLines = [
      tag('Modus', 'Insert'),
      tag('ReportingDate', reportingDate),
      `    <Executor>`,
      `      <ActingUserProjectID>${xmlEsc(actingId)}</ActingUserProjectID>`,
      `    </Executor>`,
      tag('RingScheme',                  r.centrale || 'NLA'),
      tag('RingNumber',                  r.ringnummer || ''),
      tag('CatchDate',                   catchDate),
      tag('CatchTime',                   toCatchTime(r.tijd)),
      tag('PrimaryIdentificationMethod', r.identificatie_methode || 'A0'),
      tag('VerificationOfMetalRing',     r.verificatie ?? 0),
      tag('MetalRingInformation',        r.metalenringinfo ?? 1),
      tag('OtherMarks',                  r.andere_merktekens || ''),
      tag('Species',                     specCode),
      tag('Manipulated',                 r.gemanipuleerd || 'N'),
      tag('MovedBefore',                 r.verplaatst ?? 0),
      tag('CatchingMethod',              r.vangstmethode || ''),
      tag('CatchingLures',               r.lokmiddelen || 'N'),
      tag('Sex',                         toSex(r.geslacht)),
      tag('Age',                         r.leeftijd || ''),
      tag('Status',                      r.status || 'U'),
      tag('BroodSize',                   r.broedselgrootte || '--'),
      tag('PullusAge',                   (!r.pul_leeftijd || r.pul_leeftijd === '--') ? '99' : r.pul_leeftijd),
      tag('AccOfPullusAge',              (!r.nauwk_pul_leeftijd || r.nauwk_pul_leeftijd === '--') ? 'U' : r.nauwk_pul_leeftijd),
      tag('AccOfDate',                   r.nauwk_vangstdatum ?? 0),
      tag('Latitude',                    r.lat || ''),
      tag('Longitude',                   r.lon || ''),
      tag('PlaceUserDescription',        (r.google_plaats || r.plaatscode || '').slice(0, 100)),
      tag('AccOfCoordinates',            r.nauwk_coord ?? ''),
      tag('Condition',                   r.conditie || ''),
      tag('Circumstances',               r.omstandigheden || ''),
      tag('CircumstancesPresumed',       r.zeker_omstandigheden ?? 0),
      tag('Remarks',                     r.opmerkingen || ''),
      tag('EURINGCodeIdentifier',        '4'),
    ];

    // ── Biometrics (optioneel, exacte volgorde conform XSD / handleiding) ───
    // Alleen tags met waarden worden opgenomen.
    const bio = [];
    const b = (name, val) => { if (val !== null && val !== '') bio.push(bioTag(name, val)); };

    b('NetNumber',                    r.netnummer || null);
    // CesPeriod: niet in onze app
    b('WingStraightFlat',             bioDecimal(r.vleugel));
    // WingNotStraightFlat / WingNotStraightNotFlat: niet in onze app
    b('PrimaryLength',                bioDecimal(r.handpenlengte));
    b('TailLength',                   bioDecimal(r.staartlengte));
    // TailRounding: niet in onze app
    // BillLengthFrontalEdgeFeathers: niet in onze app
    b('BillLengthBendMandibleForehead', bioDecimal(r.snavel_schedel));
    // BillLengthFrontalEdgeCere / BillLengthDistalEdgeNostril: niet in onze app
    // BillDepthBase / BillDepthInnerEdgeNostril / BillDepthGonydealAngle: niet in onze app
    b('TarsusLengthMaximum',          bioDecimal(r.tarsus_lengte));
    // TarsusLengthMinimum: niet in onze app
    b('TarsusLengthToe',              bioDecimal(r.tarsus_teen));
    b('TarsusWidth',                  bioDecimal(r.tarsus_dikte));
    b('TotalHeadLength',              bioDecimal(r.kop_snavel));
    b('PectoralMuscleScore',          r.borstspier || null);
    // StateOfWingPoint: niet in onze app
    b('ClawLength',                   bioDecimal(r.achternagel));
    b('Weight',                       bioDecimal(r.gewicht));
    b('WeighingTime',                 r.weegtijd ? toWeighingTime(r.weegtijd) : null);
    // FatScoreKaiser / FatScoreGosler: niet in onze app
    b('FatScoreBusse',                r.vet !== undefined && r.vet !== '' ? String(r.vet) : null);
    // PrimaryMoultShort / PrimaryScore / Moult / PrimaryMoult: niet in onze app
    b('BodyMoult',                    r.rui_lichaam || null);
    // PlumageCode / OldGreaterCoverts / Alula: niet in onze app
    b('SexingMethod',                 r.geslachtsbepaling || null);
    b('Handicap',                     r.handicap || null);
    b('Cloaca',                       r.cloaca || null);
    b('BroodPatch',                   r.broedvlek || null);
    b('BarCode',                      r.barcode || null);
    b('Other1',                       r.opmerkingen1 || null);
    b('Other2',                       r.opmerkingen2 || null);
    // Observer: waarnemer biometrie (ringersnummer als getal)
    b('Observer',                     r.waarnemer_bio || null);

    if (bio.length > 0) {
      captureLines.push(`    <Biometrics>`);
      bio.forEach(l => captureLines.push(l));
      captureLines.push(`    </Biometrics>`);
    }

    return `  <Capture>\n${captureLines.join('\n')}\n  </Capture>`;
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<MyBulk xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
    '  xsi:noNamespaceSchemaLocation="http://xsd.griel.nl/bulkimportnew.xsd">',
    ...captures,
    '</MyBulk>',
  ].join('\n');
}

export function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
