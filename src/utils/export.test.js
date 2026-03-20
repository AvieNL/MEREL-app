import { describe, it, expect } from 'vitest';
import { exportCSV, exportGrielXML } from './export';

// ── exportCSV ─────────────────────────────────────────────────────────────────

describe('exportCSV', () => {
  it('genereert headerrij + datarijen', () => {
    const records = [{ naam: 'Merel', datum: '2024-03-15' }];
    const csv = exportCSV(records);
    expect(csv).toBe('naam,datum\nMerel,2024-03-15');
  });

  it('omsluit veld met komma in quotes', () => {
    const records = [{ naam: 'Grote, Bonte Specht', datum: '2024-01-01' }];
    const csv = exportCSV(records);
    expect(csv).toContain('"Grote, Bonte Specht"');
  });

  it('escapet aanhalingstekens in veld', () => {
    const records = [{ opm: 'zegt "hoi"' }];
    const csv = exportCSV(records);
    expect(csv).toContain('"zegt ""hoi"""');
  });

  it('retourneert lege string bij geen records', () => {
    expect(exportCSV([])).toBe('');
  });
});

// ── exportGrielXML helpers via XML-output ────────────────────────────────────

const basisVangst = {
  vogelnaam: 'Merel',
  ringnummer: 'H123456',
  vangstdatum: '2024-03-15',
  centrale: 'NLA',
  geslacht: 'M',
  leeftijd: '3',
  vangstmethode: 'M',
  tijd: '09:30',
};

const euringLookup = { merel: '14790' };

describe('exportGrielXML — structuur', () => {
  it('genereert geldig XML-document met root-element', () => {
    const xml = exportGrielXML([basisVangst], [], {}, euringLookup);
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<MyBulk');
    expect(xml).toContain('</MyBulk>');
  });

  it('genereert één <Capture> per vangst', () => {
    const xml = exportGrielXML([basisVangst, basisVangst], [], {}, euringLookup);
    const matches = xml.match(/<Capture>/g);
    expect(matches).toHaveLength(2);
  });

  it('bevat <Modus>Insert</Modus>', () => {
    const xml = exportGrielXML([basisVangst], [], {}, euringLookup);
    expect(xml).toContain('<Modus>Insert</Modus>');
  });
});

describe('exportGrielXML — soortcode', () => {
  it('zet EURING-soortcode op 5 cijfers', () => {
    const xml = exportGrielXML([basisVangst], [], {}, euringLookup);
    expect(xml).toContain('<Species>14790</Species>');
  });

  it('levert lege Species-tag als soort onbekend is', () => {
    const xml = exportGrielXML([basisVangst], [], {}, {});
    expect(xml).toContain('<Species></Species>');
  });
});

describe('exportGrielXML — datum en tijd', () => {
  it('converteert dd-mm-yyyy invoer correct naar yyyy-mm-dd in CatchDate', () => {
    const xml = exportGrielXML([{ ...basisVangst, vangstdatum: '15-03-2024' }], [], {}, euringLookup);
    expect(xml).toContain('<CatchDate>2024-03-15</CatchDate>');
  });

  it('formatteert tijd als HHMM zonder dubbele punt', () => {
    const xml = exportGrielXML([basisVangst], [], {}, euringLookup);
    expect(xml).toContain('<CatchTime>0930</CatchTime>');
  });

  it('gebruikt "----" als tijd ontbreekt', () => {
    const xml = exportGrielXML([{ ...basisVangst, tijd: null }], [], {}, euringLookup);
    expect(xml).toContain('<CatchTime>----</CatchTime>');
  });
});

describe('exportGrielXML — geslacht', () => {
  it('converteert V naar F (GRIEL-conventie)', () => {
    const xml = exportGrielXML([{ ...basisVangst, geslacht: 'V' }], [], {}, euringLookup);
    expect(xml).toContain('<Sex>F</Sex>');
  });

  it('laat M ongewijzigd', () => {
    const xml = exportGrielXML([basisVangst], [], {}, euringLookup);
    expect(xml).toContain('<Sex>M</Sex>');
  });

  it('valt terug op U als geslacht ontbreekt', () => {
    const xml = exportGrielXML([{ ...basisVangst, geslacht: null }], [], {}, euringLookup);
    expect(xml).toContain('<Sex>U</Sex>');
  });
});

describe('exportGrielXML — pullus-velden', () => {
  it('vult PullusAge in bij leeftijd=1', () => {
    const xml = exportGrielXML([{ ...basisVangst, leeftijd: '1', pul_leeftijd: '10' }], [], {}, euringLookup);
    expect(xml).toContain('<PullusAge>10</PullusAge>');
  });

  it('gebruikt 99 als pul_leeftijd ontbreekt bij leeftijd=1', () => {
    const xml = exportGrielXML([{ ...basisVangst, leeftijd: '1', pul_leeftijd: '' }], [], {}, euringLookup);
    expect(xml).toContain('<PullusAge>99</PullusAge>');
  });

  it('gebruikt -- als leeftijd niet 1 is', () => {
    const xml = exportGrielXML([basisVangst], [], {}, euringLookup);
    expect(xml).toContain('<PullusAge>--</PullusAge>');
  });

  it('gebruikt U als AccOfPullusAge-fallback bij leeftijd=1', () => {
    const xml = exportGrielXML([{ ...basisVangst, leeftijd: '1', nauwk_pul_leeftijd: '' }], [], {}, euringLookup);
    expect(xml).toContain('<AccOfPullusAge>U</AccOfPullusAge>');
  });

  it('gebruikt - als AccOfPullusAge bij leeftijd niet 1', () => {
    const xml = exportGrielXML([basisVangst], [], {}, euringLookup);
    expect(xml).toContain('<AccOfPullusAge>-</AccOfPullusAge>');
  });
});

describe('exportGrielXML — XML-escaping', () => {
  it('escapet & in opmerkingen', () => {
    const xml = exportGrielXML([{ ...basisVangst, opmerkingen: 'vlieg & zit' }], [], {}, euringLookup);
    expect(xml).toContain('vlieg &amp; zit');
  });

  it('escapet < en > in opmerkingen', () => {
    const xml = exportGrielXML([{ ...basisVangst, opmerkingen: '<test>' }], [], {}, euringLookup);
    expect(xml).toContain('&lt;test&gt;');
  });
});

describe('exportGrielXML — biometrie', () => {
  it('voegt Biometrics-blok toe als vleugel aanwezig is', () => {
    const xml = exportGrielXML([{ ...basisVangst, vleugel: '75' }], [], {}, euringLookup);
    expect(xml).toContain('<Biometrics>');
    expect(xml).toContain('<WingStraightFlat>75</WingStraightFlat>');
  });

  it('laat Biometrics weg als geen biometrie aanwezig is', () => {
    const xml = exportGrielXML([basisVangst], [], {}, euringLookup);
    expect(xml).not.toContain('<Biometrics>');
  });

  it('slaat 0-waarden over in biometrie', () => {
    const xml = exportGrielXML([{ ...basisVangst, vleugel: '0', gewicht: '17' }], [], {}, euringLookup);
    expect(xml).not.toContain('<WingStraightFlat>');
    expect(xml).toContain('<Weight>17</Weight>');
  });

  it('knipt PlaceUserDescription af op 100 tekens', () => {
    const lang = 'A'.repeat(150);
    const xml = exportGrielXML([{ ...basisVangst, google_plaats: lang }], [], {}, euringLookup);
    expect(xml).toContain('A'.repeat(100));
    expect(xml).not.toContain('A'.repeat(101));
  });
});
