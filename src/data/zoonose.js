// Zoönose-bemonsteringsprotocollen per soort (sleutel = parseInt-genormaliseerde EURING-code)
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

  // ── WATERVOGELS — groep 3 (WNV) ─────────────────────────────────────────
  // Serumbuis + FTA · naald 0,5 oranje · keel + cloaca · teken · veren
  '1520':  { groepen: ['3 (WNV)'], bloed: { serumbuis: true, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Knobbelzwaan
  '1790':  { groepen: ['3 (WNV)'], bloed: { serumbuis: true, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Smient
  '1840':  { groepen: ['3 (WNV)'], bloed: { serumbuis: true, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Wintertaling
  '1860':  { groepen: ['3 (WNV)'], bloed: { serumbuis: true, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Wilde Eend
  '1890':  { groepen: ['3 (WNV)'], bloed: { serumbuis: true, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Pijlstaart
  '1910':  { groepen: ['3 (WNV)'], bloed: { serumbuis: true, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Zomertaling
  '4290':  { groepen: ['3 (WNV)'], bloed: { serumbuis: true, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Meerkoet

  // ── ROOFVOGELS — groep 3 (WNV) ──────────────────────────────────────────
  // Serumbuis + FTA · naald 0,5 oranje · keel + cloaca · teken · veren
  '2310':  { groepen: ['3 (WNV)'], bloed: { serumbuis: true, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Wespendief
  '2600':  { groepen: ['3 (WNV)'], bloed: { serumbuis: true, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Bruine Kiekendief
  '2630':  { groepen: ['3 (WNV)'], bloed: { serumbuis: true, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Grauwe Kiekendief
  '3100':  { groepen: ['3 (WNV)'], bloed: { serumbuis: true, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Boomvalk

  // ── STELTLOPERS groep 3 (WNV) ────────────────────────────────────────────
  // Serumbuis + FTA · naald 0,5 oranje · keel + cloaca · teken · veren
  '4560':  { groepen: ['3 (WNV)'], bloed: { serumbuis: true, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Kluut
  '5320':  { groepen: ['3 (WNV)'], bloed: { serumbuis: true, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Grutto
  '5460':  { groepen: ['3 (WNV)'], bloed: { serumbuis: true, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Tureluur

  // ── STELTLOPERS groep 2 (USUV) ───────────────────────────────────────────
  // FTA · naald 0,5 oranje · keel + cloaca · teken · veren
  '4690':  { groepen: ['2 (USUV)'], bloed: { serumbuis: false, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Kleine Plevier
  '4700':  { groepen: ['2 (USUV)'], bloed: { serumbuis: false, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Bontbekplevier
  '4770':  { groepen: ['2 (USUV)'], bloed: { serumbuis: false, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Strandplevier

  // ── ZANGVOGELS WEST-AFRIKA — groep 1 (trek) ─────────────────────────────
  // FTA · naald 0,3 geel · keel optioneel, geen cloaca · teken · veren
  // Uitzondering: Tapuit keel + evt. cloaca
  '10090': { groepen: ['1 (trek)'], bloed: { serumbuis: false, fta: true }, naald: '0.3', swab: { keel: 'optioneel', cloaca: false }, teken: true, veren: true }, // Boompieper
  '11060': { groepen: ['1 (trek)'], bloed: { serumbuis: false, fta: true }, naald: '0.3', swab: { keel: 'optioneel', cloaca: false }, teken: true, veren: true }, // Blauwborst
  '11220': { groepen: ['1 (trek)'], bloed: { serumbuis: false, fta: true }, naald: '0.3', swab: { keel: 'optioneel', cloaca: false }, teken: true, veren: true }, // Gekraagde Roodstaart
  '11460': { groepen: ['1 (trek)'], bloed: { serumbuis: false, fta: true }, naald: '0.3', swab: { keel: 'optioneel', cloaca: 'optioneel' }, teken: true, veren: true }, // Tapuit (evt. cloaca)
  '12510': { groepen: ['1 (trek)'], bloed: { serumbuis: false, fta: true }, naald: '0.3', swab: { keel: 'optioneel', cloaca: false }, teken: true, veren: true }, // Kleine Karekiet
  '12590': { groepen: ['1 (trek)'], bloed: { serumbuis: false, fta: true }, naald: '0.3', swab: { keel: 'optioneel', cloaca: false }, teken: true, veren: true }, // Spotvogel
  '12750': { groepen: ['1 (trek)'], bloed: { serumbuis: false, fta: true }, naald: '0.3', swab: { keel: 'optioneel', cloaca: false }, teken: true, veren: true }, // Grasmus
  '12760': { groepen: ['1 (trek)'], bloed: { serumbuis: false, fta: true }, naald: '0.3', swab: { keel: 'optioneel', cloaca: false }, teken: true, veren: true }, // Tuinfluiter
  '12770': { groepen: ['1 (trek)'], bloed: { serumbuis: false, fta: true }, naald: '0.3', swab: { keel: 'optioneel', cloaca: false }, teken: true, veren: true }, // Zwartkop
  '13490': { groepen: ['1 (trek)'], bloed: { serumbuis: false, fta: true }, naald: '0.3', swab: { keel: 'optioneel', cloaca: false }, teken: true, veren: true }, // Bonte Vliegenvanger

  // ── ZANGVOGELS OOST-AFRIKA — groep 1 (trek) ─────────────────────────────
  // FTA · naald 0,3 geel · keel optioneel, geen cloaca · teken · veren
  // Uitzondering: Grauwe Klauwier ook cloaca
  '12500': { groepen: ['1 (trek)'], bloed: { serumbuis: false, fta: true }, naald: '0.3', swab: { keel: 'optioneel', cloaca: false }, teken: true, veren: true }, // Bosrietzanger
  '12740': { groepen: ['1 (trek)'], bloed: { serumbuis: false, fta: true }, naald: '0.3', swab: { keel: 'optioneel', cloaca: false }, teken: true, veren: true }, // Braamsluiper
  '15150': { groepen: ['1 (trek)'], bloed: { serumbuis: false, fta: true }, naald: '0.3', swab: { keel: 'optioneel', cloaca: true }, teken: true, veren: true }, // Grauwe Klauwier (ook cloaca)

  // ── OVERIG I — groep 2 (USUV) + 3 (WNV) ────────────────────────────────
  // Serumbuis + FTA · naald 0,5 oranje · keel + cloaca · teken · veren
  '3700':  { groepen: ['2 (USUV)', '3 (WNV)'], bloed: { serumbuis: true, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Kwartel
  '6657':  { groepen: ['2 (USUV)', '3 (WNV)'], bloed: { serumbuis: true, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Stadsduif
  '11870': { groepen: ['2 (USUV)', '3 (WNV)'], bloed: { serumbuis: true, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Merel
  '15390': { groepen: ['2 (USUV)', '3 (WNV)'], bloed: { serumbuis: true, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Gaai
  '15490': { groepen: ['2 (USUV)', '3 (WNV)'], bloed: { serumbuis: true, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Ekster
  '15600': { groepen: ['2 (USUV)', '3 (WNV)'], bloed: { serumbuis: true, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Kauw
  '15630': { groepen: ['2 (USUV)', '3 (WNV)'], bloed: { serumbuis: true, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Roek
  '15671': { groepen: ['2 (USUV)', '3 (WNV)'], bloed: { serumbuis: true, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Zwarte Kraai
  '15673': { groepen: ['2 (USUV)', '3 (WNV)'], bloed: { serumbuis: true, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Bonte Kraai
  '15720': { groepen: ['2 (USUV)', '3 (WNV)'], bloed: { serumbuis: true, fta: true }, naald: '0.5', swab: { keel: true, cloaca: true }, teken: true, veren: true }, // Raaf

  // ── OVERIG II — groep 2 (USUV) ───────────────────────────────────────────
  // FTA · naald 0,3 geel · keel optioneel, geen cloaca · teken · veren
  '15910': { groepen: ['2 (USUV)'], bloed: { serumbuis: false, fta: true }, naald: '0.3', swab: { keel: 'optioneel', cloaca: false }, teken: true, veren: true }, // Huismus
  '15980': { groepen: ['2 (USUV)'], bloed: { serumbuis: false, fta: true }, naald: '0.3', swab: { keel: 'optioneel', cloaca: false }, teken: true, veren: true }, // Ringmus

};
