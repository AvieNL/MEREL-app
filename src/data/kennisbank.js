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
 *   { type: 'afbeelding', src: '/kennisbank/...jpg', alt: '...', bijschrift?: '...' }
 */

export const KENNISBANK = [

  // ══════════════════════════════════════════════════════════════════════════
  //  CATEGORIE: Biometrie & morfologie
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'vleugel-naamgeving',
    categorie: 'Biometrie & morfologie',
    titel: 'Vleugelnaamgeving — afkortingen EN/NL',
    bron: 'Demongin (2020)',
    secties: [
      {
        type: 'afbeelding',
        src: '/kennisbank/vleugeldiagram.jpg',
        alt: 'Schematische bovenaanzicht van een passerine vleugel met alle veernamen en nummering',
        bijschrift: 'Bovenaanzicht van een typische passerine vleugel. Nummering verloopt van buitenste (vleugelspits) naar binnenste veer — "ascendant numbering".',
      },
      {
        type: 'tekst',
        tekst: 'De nummering van alle verengroepen verloopt van buiten (vleugelspits) naar binnen (richting lichaam). Dit wordt "ascendant numbering" genoemd. Onderstaande tabel geeft de volledige Engelse en Nederlandse benaming per afkorting.',
      },
      {
        type: 'tabel',
        koptekst: ['Afk.', 'Engels', 'Nederlands', 'Toelichting'],
        rijen: [
          ['P',   'Primary',            'Handpen',                   'P1 = buitenste (vleugelspits / wingpoint), P10 = binnenste'],
          ['S',   'Secondary',          'Armpen',                    'S1 = buitenste armpen, aansluitend op P10'],
          ['T',   'Tertial',            'Elleboogpen',               'De 3 binnenste armpennen (T1–T3); ook wel innerste secondaries'],
          ['GC',  'Greater covert',     'Armpendekveer',             'Bedekkende dekveer over de basis van de armpennen; GC1 = buitenste'],
          ['MC',  'Median covert',      'Middelste vleugeldekveer',  'Rij dekveren boven de GC'],
          ['LC',  'Lesser covert',      'Kleine vleugeldekveer',     'Kleinste dekverenrij, boven de MC'],
          ['PC',  'Primary covert',     'Handpendekveer',            'Bedekkende dekveer over de basis van de handpennen'],
          ['CC',  'Carpal covert',      'Carpale dekveer',           'Grote dekveer over het carpaalgewricht (vleugelknie)'],
          ['Em',  'Emargination',       'Versmalling buitenvlag',    'Versmalling op de buitenzijde (outer web / vaan) van een handpen'],
          ['WP',  'Wingpoint',          'Vleugelpunt / handpunt',    'De vleugelspits = punt van langste handpen. WP-maat = lengte totale vleugel (max. akkoordbreedte)'],
          ['TF',  'Tail feather',       'Staartveer',                'TF1 = middelste staartveer; TF6 = buitenste staartveer'],
          ['—',   'Alula',              'Duimvleugel / alula',       '3 kleine veren aan het "duim"-gewricht van de vleugel'],
        ],
      },
      {
        type: 'koptitel',
        tekst: 'Nummering — richting per verengroep',
      },
      {
        type: 'definitielijst',
        items: [
          {
            term: 'P (handpennen)',
            definitie: 'Van buiten naar binnen: P1 = buitenste handpen (vleugelspits), P10 = binnenste. Bij de meeste soorten is P1 de langste veer (= wingpoint).',
          },
          {
            term: 'S (armpennen)',
            definitie: 'Van buiten naar binnen: S1 = buitenste, aansluitend op P10. Aantal varieert per soort (passeriformen: S1–S9).',
          },
          {
            term: 'T (elleboogpennen)',
            definitie: 'T1, T2, T3 — de drie binnenste armpennen, anatomisch aansluitend op de elleboog. In de figuur links afgebeeld, nummering van buiten naar binnen.',
          },
          {
            term: 'GC (armpendekveren)',
            definitie: 'Van buiten naar binnen: GC1 = buitenste, boven S1. Bedekkende rij over de basis van de armpennen.',
          },
          {
            term: 'TF (staartveren)',
            definitie: 'TF1 = middelste staartveer (centraal paar), TF6 = buitenste staartveer. Verschil TF1−TF6 is een diagnostisch kenmerk bij sommige soorten (bijv. Roek).',
          },
          {
            term: 'WP (wingpoint / vleugelpunt)',
            definitie: 'De totale vleugellengte (maximum akkoordbreedte) gemeten van de vleugelspits tot aan het carpaalgewricht, aan de gevouwen vleugel. Niet te verwarren met de WP-afstand in de vleugelformule (= afstand wingpoint tot punt van S1/P1).',
          },
        ],
      },
      {
        type: 'waarschuwing',
        tekst: 'Let op: in oudere Engelstalige literatuur worden handpennen soms van binnen naar buiten genummerd (P1 = binnenste). MEREL en Demongin (2020) volgen de Europese conventie: P1 = buitenste handpen (vleugelspits).',
      },
    ],
  },

  {
    id: 'vleugelformule-begrippen',
    categorie: 'Biometrie & morfologie',
    titel: 'Vleugelformule — begrippen',
    bron: 'Svensson (1992); Demongin (2020)',
    secties: [
      {
        type: 'tekst',
        tekst: 'De vleugelformule beschrijft de relatieve lengte en vorm van de handpennen (P) en armpennen (S). Ze is een belangrijk hulpmiddel bij leeftijds- en soortsbestemming.',
      },
      {
        type: 'koptitel',
        tekst: 'Begrippen',
      },
      {
        type: 'definitielijst',
        items: [
          {
            term: 'P2-positie',
            definitie: 'De plek waar de punt van P2 valt ten opzichte van andere handpennen. Genoteerd als "P2 = 5/6" (= tussen P5 en P6) of "P2 = 6" (= gelijk aan P6). Bepalend voor de vleugelspitsvorm.',
          },
          {
            term: 'WP-afstand (S1/P1)',
            definitie: 'Afstand in mm van de vleugelspits (WP = punt P1) tot de punt van S1, gemeten aan de gevouwen vleugel. Geeft de "vinger" van de vleugel aan.',
          },
          {
            term: 'Emaginatie (Em)',
            definitie: 'Versmalling op de buitenzijde (outer web / vaan) van een handpen. Draagt bij aan de "vingervorming" van de vleugeltip. Genoteerd als de pennen waarop emaginatie aanwezig is: bijv. Em = P3 P4 P5.',
          },
          {
            term: 'Notch / inkeping',
            definitie: 'Versmalling op de binnenzijde (inner web / vlag) van een handpen. De positie van de proximale rand wordt genoteerd t.o.v. punten van andere pennen: bijv. "Notch P2 = 8/10" = proximale rand van de inkeping op P2 valt tussen de punt van P8 en P10.',
          },
        ],
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
