import { describe, it, expect } from 'vitest';
import { formatDatum, formatDatumTijd, toYMD } from './dateHelper';

describe('formatDatum', () => {
  it('converteert yyyy-mm-dd naar dd-mm-yyyy', () => {
    expect(formatDatum('2024-03-15')).toBe('15-03-2024');
  });

  it('converteert al dd-mm-yyyy formaat ongewijzigd', () => {
    expect(formatDatum('15-03-2024')).toBe('15-03-2024');
  });

  it('padded enkelvoudige dag/maand', () => {
    expect(formatDatum('2024-3-5')).toBe('05-03-2024');
  });

  it('retourneert lege string bij null/undefined', () => {
    expect(formatDatum(null)).toBe('');
    expect(formatDatum(undefined)).toBe('');
    expect(formatDatum('')).toBe('');
  });

  it('retourneert invoer ongewijzigd bij ongeldig formaat', () => {
    expect(formatDatum('20240315')).toBe('20240315');
  });
});

describe('toYMD', () => {
  it('laat yyyy-mm-dd ongewijzigd', () => {
    expect(toYMD('2024-03-15')).toBe('2024-03-15');
  });

  it('converteert dd-mm-yyyy naar yyyy-mm-dd', () => {
    expect(toYMD('15-03-2024')).toBe('2024-03-15');
  });

  it('padded enkelvoudige dag/maand', () => {
    expect(toYMD('5-3-2024')).toBe('2024-03-05');
  });

  it('retourneert null/undefined ongewijzigd', () => {
    expect(toYMD(null)).toBe(null);
    expect(toYMD(undefined)).toBe(undefined);
  });

  it('retourneert invoer ongewijzigd bij ongeldig formaat', () => {
    expect(toYMD('20240315')).toBe('20240315');
  });
});

describe('formatDatumTijd', () => {
  it('formatteert ISO timestamp naar dd-mm-yyyy HH:MM', () => {
    expect(formatDatumTijd('2024-03-15T09:30:00.000Z')).toMatch(/15-03-2024 \d{2}:30/);
  });

  it('retourneert lege string bij lege invoer', () => {
    expect(formatDatumTijd('')).toBe('');
    expect(formatDatumTijd(null)).toBe('');
  });

  it('retourneert lege string bij ongeldige datum', () => {
    expect(formatDatumTijd('geen-datum')).toBe('');
  });
});
