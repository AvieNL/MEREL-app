import { describe, it, expect } from 'vitest';
import { parseVal, bioDecimal, computeBioRanges } from './bioHelper';

describe('parseVal', () => {
  it('parseert geheel getal', () => {
    expect(parseVal('75')).toBe(75);
  });

  it('parseert decimaal met punt', () => {
    expect(parseVal('75.5')).toBe(75.5);
  });

  it('parseert decimaal met komma', () => {
    expect(parseVal('75,5')).toBe(75.5);
  });

  it('retourneert NaN bij lege string', () => {
    expect(parseVal('')).toBeNaN();
  });

  it('retourneert NaN bij null/undefined', () => {
    expect(parseVal(null)).toBeNaN();
    expect(parseVal(undefined)).toBeNaN();
  });

  it('retourneert NaN bij tekst', () => {
    expect(parseVal('abc')).toBeNaN();
  });
});

describe('bioDecimal', () => {
  it('converteert getal naar string', () => {
    expect(bioDecimal('75')).toBe('75');
  });

  it('converteert komma naar punt', () => {
    expect(bioDecimal('75,5')).toBe('75.5');
  });

  it('retourneert null bij lege waarde', () => {
    expect(bioDecimal('')).toBeNull();
    expect(bioDecimal(null)).toBeNull();
    expect(bioDecimal(undefined)).toBeNull();
  });

  it('retourneert null bij 0', () => {
    expect(bioDecimal('0')).toBeNull();
    expect(bioDecimal(0)).toBeNull();
  });

  it('retourneert null bij negatieve waarde', () => {
    expect(bioDecimal('-5')).toBeNull();
  });

  it('retourneert null bij tekst', () => {
    expect(bioDecimal('abc')).toBeNull();
  });
});

describe('computeBioRanges', () => {
  const records = [
    { vleugel: '74', gewicht: '16' },
    { vleugel: '76', gewicht: '17' },
    { vleugel: '75', gewicht: '15' },
    { vleugel: '78', gewicht: '18' },
  ];

  it('berekent min/max voor velden met ≥3 meetwaarden', () => {
    const result = computeBioRanges(records);
    expect(result.vleugel).toBeDefined();
    expect(result.vleugel.min).toBe(74);
    expect(result.vleugel.max).toBe(78);
    expect(result.vleugel.n).toBe(4);
  });

  it('voegt 10% marge toe aan rangeMin/rangeMax', () => {
    const result = computeBioRanges(records);
    const { min, max, rangeMin, rangeMax } = result.vleugel;
    expect(rangeMin).toBeLessThan(min);
    expect(rangeMax).toBeGreaterThan(max);
  });

  it('slaat veld over met <3 meetwaarden', () => {
    const result = computeBioRanges([
      { vleugel: '74' },
      { vleugel: '76' },
    ]);
    expect(result.vleugel).toBeUndefined();
  });

  it('negeert nul en lege waarden', () => {
    const result = computeBioRanges([
      { vleugel: '0' },
      { vleugel: '' },
      { vleugel: null },
      { vleugel: '75' },
      { vleugel: '76' },
      { vleugel: '74' },
    ]);
    expect(result.vleugel.n).toBe(3);
    expect(result.vleugel.min).toBe(74);
  });

  it('retourneert leeg object bij geen records', () => {
    expect(computeBioRanges([])).toEqual({});
  });
});
