/**
 * Kennisbank — statische ornithologische basiskennis
 *
 * Structuur per artikel:
 *   id        – unieke slug
 *   categorie – groepering in de UI
 *   titel     – weergegeven titel
 *   soort?    – optioneel: koppeling aan soortnaam (Nederlands)
 *   euring?   – optioneel: EURING-code van de soort
 *   bron?     – literatuurverwijzing
 *   secties   – array van { type, ... } blokken (zie hieronder)
 *
 * Sectietypes:
 *   { type: 'tekst', tekst: '...' }
 *   { type: 'lijst', items: ['...', '...'] }
 *   { type: 'definitielijst', items: [{ term, definitie }] }
 *   { type: 'tabel', koptekst: [...], rijen: [[...], [...]] }
 *   { type: 'waarschuwing', tekst: '...' }
 *   { type: 'koptitel', tekst: '...' }   — H3-achtige tussentitel
 */

export const KENNISBANK = [

  // ══════════════════════════════════════════════════════════════════════════
  //  CATEGORIE: Biometrie & morfologie
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'vleugelformule-begrippen',
    categorie: 'Biometrie & morfologie',
    titel: 'Vleugelformule — begrippen',
    bron: 'Svensson (1992); Demongin (2020)',
    secties: [
      {
        type: 'tekst',
        tekst: 'De vleugelformule beschrijft de relatieve lengte en vorm van de handpennen (primaries) en armpennen (secondaries). Ze is een belangrijk hulpmiddel bij leeftijds- en soortsbestemming.',
      },
      {
        type: 'koptitel',
        tekst: 'Nummering van de pennen',
      },
      {
        type: 'definitielijst',
        items: [
          {
            term: 'Handpennen (P1–P10)',
            definitie: 'Geteld van buiten (vleugelspits) naar binnen. P1 = buitenste en langste handpen bij de meeste soorten (= wingpoint). P10 = binnenste handpen.',
          },
          {
            term: 'Armpennen (S1–S9+)',
            definitie: 'Geteld van buiten naar binnen. S1 = buitenste armpenveer (aansluitend op P10). Het aantal varieert per soort.',
          },
        ],
      },
      {
        type: 'koptitel',
        tekst: 'Begrippen',
      },
      {
        type: 'definitielijst',
        items: [
          {
            term: 'WP — Wingpoint / handpunt',
            definitie: 'De vleugelspits: het punt van de langste handpen (P1 bij de meeste soorten). De WP-afstand (handpuntlengte) is de afstand in mm van de WP tot de punt van S1/P1, gemeten aan de gevouwen vleugel.',
          },
          {
            term: 'P2-positie',
            definitie: 'De plek waar de punt van P2 valt ten opzichte van de andere pennen. Genoteerd als "P2 = 5/6" (= tussen P5 en P6) of "P2 = 6" (= gelijk aan P6). Bepalend voor de vleugelspitsvorm.',
          },
          {
            term: 'Emaginatie (Em)',
            definitie: 'Een inkeping (versmalling) op de binnenzijde (vlag/inner web) van een handpen. Draagt bij aan de "vingervorming" van de vleugeltip. Genoteerd als de pennen waarop emaginatie aanwezig is: bijv. Em = P3 P4 P5.',
          },
          {
            term: 'Notch / inkeping',
            definitie: 'Een versmalling op de buitenzijde (vaan/outer web) van een handpen. De positie van de proximale rand van de notch wordt genoteerd ten opzichte van de punten van andere pennen: bijv. "Notch P2 = 8/10" betekent dat de proximale rand van de notch op P2 valt tussen de punt van P8 en P10.',
          },
        ],
      },
      {
        type: 'waarschuwing',
        tekst: 'Let op: in oudere Engelstalige literatuur worden handpennen soms van binnen naar buiten genummerd (P1 = binnenste). MEREL volgt de Europese conventie: P1 = buitenste handpen.',
      },
    ],
  },

];

/**
 * Geeft alle unieke categorieën terug, in de volgorde van eerste optreden.
 */
export function getKennisbankCategorieen() {
  const seen = new Set();
  return KENNISBANK
    .map(a => a.categorie)
    .filter(c => { if (seen.has(c)) return false; seen.add(c); return true; });
}

/**
 * Geeft alle artikelen binnen een categorie terug.
 */
export function getKennisbankArtikelenVoorCategorie(categorie) {
  return KENNISBANK.filter(a => a.categorie === categorie);
}
