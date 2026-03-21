import { describe, it, expect, vi } from 'vitest';

// Mock modules die aiAnalyse.js importeert maar niet nodig zijn voor de pure functies
vi.mock('../lib/supabase', () => ({ supabase: {} }));
vi.mock('./imageHelper', () => ({ blobNaarBase64: vi.fn() }));
vi.mock('../hooks/useReferentiebibliotheek', () => ({ getFotoUrl: vi.fn(p => p) }));

import { selectReferenties, buildPrompt, MAX_REFERENTIES } from './aiAnalyse';

// ── selectReferenties ─────────────────────────────────────────────────────────

describe('selectReferenties', () => {
  const alleRefs = [
    { soort: 'Merel', maand: 3, type: 'bevestigd',   leeftijd: '3', geslacht: 'M' },
    { soort: 'Merel', maand: 3, type: 'gecorrigeerd', leeftijd: '4', geslacht: 'F' },
    { soort: 'Merel', maand: 9, type: 'handmatig',   leeftijd: '3', geslacht: 'U' },
    { soort: 'Koolmees', maand: 3, type: 'bevestigd', leeftijd: '3', geslacht: 'M' },
  ];

  it('filtert op soort', () => {
    const result = selectReferenties('Merel', 3, alleRefs);
    expect(result.every(r => r.soort === 'Merel')).toBe(true);
  });

  it('sorteert bevestigd vóór gecorrigeerd vóór handmatig', () => {
    const result = selectReferenties('Merel', 3, alleRefs);
    expect(result[0].type).toBe('bevestigd');
    expect(result[1].type).toBe('gecorrigeerd');
  });

  it('sorteert op seizoensafstand als type gelijk is', () => {
    const refs = [
      { soort: 'Merel', maand: 9, type: 'bevestigd', leeftijd: '3', geslacht: 'M' },
      { soort: 'Merel', maand: 3, type: 'bevestigd', leeftijd: '4', geslacht: 'F' },
    ];
    const result = selectReferenties('Merel', 4, refs);
    // maand 3 is 1 weg van 4; maand 9 is 5 weg van 4
    expect(result[0].maand).toBe(3);
  });

  it('berekent seizoensafstand circulair (jan ↔ dec)', () => {
    const refs = [
      { soort: 'Merel', maand: 1, type: 'bevestigd', leeftijd: '3', geslacht: 'M' },
      { soort: 'Merel', maand: 6, type: 'bevestigd', leeftijd: '4', geslacht: 'F' },
    ];
    // Gevraagde maand 12: afstand tot 1 = min(11, 1) = 1; afstand tot 6 = min(6, 6) = 6
    const result = selectReferenties('Merel', 12, refs);
    expect(result[0].maand).toBe(1);
  });

  it(`retourneert maximaal ${MAX_REFERENTIES} resultaten`, () => {
    const veel = Array.from({ length: 15 }, (_, i) => ({
      soort: 'Merel', maand: i + 1, type: 'handmatig', leeftijd: '3', geslacht: 'U',
    }));
    const result = selectReferenties('Merel', 6, veel);
    expect(result.length).toBe(MAX_REFERENTIES);
  });

  it('retourneert lege array als soort niet voorkomt', () => {
    expect(selectReferenties('Roodborst', 3, alleRefs)).toEqual([]);
  });
});

// ── buildPrompt ───────────────────────────────────────────────────────────────

describe('buildPrompt', () => {
  const refs = [
    { leeftijd: '3', geslacht: 'M', maand: 3, type: 'bevestigd' },
  ];

  it('bevat de soortnaam', () => {
    const prompt = buildPrompt('Merel', refs);
    expect(prompt).toContain('Merel');
  });

  it('bevat referentiedata', () => {
    const prompt = buildPrompt('Merel', refs);
    expect(prompt).toContain('leeftijd=3');
    expect(prompt).toContain('geslacht=M');
  });

  it('bevat "Geen referenties beschikbaar" als refs leeg zijn', () => {
    const prompt = buildPrompt('Merel', []);
    expect(prompt).toContain('Geen referenties beschikbaar');
  });

  it('bevat referentie-intro als aantalRefFotos > 0', () => {
    const prompt = buildPrompt('Merel', refs, 2);
    expect(prompt).toContain('BELANGRIJK');
  });

  it('bevat geen referentie-intro als aantalRefFotos = 0', () => {
    const prompt = buildPrompt('Merel', refs, 0);
    expect(prompt).not.toContain('BELANGRIJK');
  });

  it('vraagt om JSON-antwoord', () => {
    const prompt = buildPrompt('Merel', refs);
    expect(prompt).toContain('"leeftijd"');
    expect(prompt).toContain('"geslacht"');
    expect(prompt).toContain('"betrouwbaarheid"');
  });

  it('bevat EURING-geslachtsbepalingcodes', () => {
    const prompt = buildPrompt('Merel', refs);
    // Alle EURING-codes moeten aanwezig zijn
    for (const code of ['A', 'B', 'C', 'D', 'E', 'L', 'P', 'S', 'T', 'U']) {
      expect(prompt).toContain(`${code}=`);
    }
  });
});
