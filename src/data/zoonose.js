// Zoönose-bemonsteringsprotocollen per soort (sleutel = genormaliseerde EURING-code)
// Panel zichtbaar van 1 jul t/m 31 okt

export const ZOONOSE_SEIZOEN = { van: 7, tot: 10 };

export const NAALD_SPEC = {
  '0.5': { kleur: '#e07000', naam: 'oranje' },
  '0.4': { kleur: '#888888', naam: 'grijs' },
  '0.3': { kleur: '#c8a800', naam: 'geel' },
};

// bloed.serumbuis / bloed.fta: true = altijd, false = niet, 'optioneel' = kan
// swab.keel / swab.cloaca: idem
export const ZOONOSE_DATA = {

  // Merel — Groep 2 (USUV) + Groep 3 (WNV)
  '12820': {
    groepen: ['2 (USUV)', '3 (WNV)'],
    bloed: { serumbuis: true, fta: true },
    naald: '0.5',
    swab: { keel: true, cloaca: true },
    teken: true,
    veren: true,
  },

  // Zwartkop — Groep 1 (trek)
  '12770': {
    groepen: ['1 (trek)'],
    bloed: { serumbuis: false, fta: true },
    naald: '0.3',
    swab: { keel: 'optioneel', cloaca: false },
    teken: true,
    veren: true,
  },
};
