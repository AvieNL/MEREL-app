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
    titel: 'Vleugeltopografie',
    bron: 'Demongin (2020)',
    secties: [
      {
        type: 'afbeelding',
        src: '/kennisbank/vleugeldiagram.jpeg',
        alt: 'Schematische bovenaanzicht van een passerine vleugel met alle veernamen en nummering',
        bijschrift: 'Bovenaanzicht van een typische passerine vleugel. Nummering verloopt van buitenste (vleugelspits) naar binnenste veer — "ascendant numbering".',
      },
      {
        type: 'tekst',
        tekst: 'De nummering van alle verengroepen verloopt van buiten (vleugelspits) naar binnen (richting lichaam). Dit wordt "ascendant numbering" genoemd. Onderstaande tabel geeft de volledige Engelse en Nederlandse benaming per afkorting.',
      },
      {
        type: 'waarschuwing',
        tekst: 'Let op: in oudere literatuur worden handpennen soms van binnen naar buiten genummerd (P1 = binnenste). MEREL.app volgt de Europese conventie: P1 = buitenste handpen.',
      },
      {
        type: 'tabel',
        koptekst: ['Afk.', 'Engels', 'Nederlands', 'Toelichting'],
        rijen: [
          ['P',   'Primary',            'Handpen',                   'P1 = buitenste handpen (vaak klein of rudimentair); P10 = binnenste. Nummering van buiten naar binnen.'],
          ['S',   'Secondary',          'Armpen',                    'S1 = buitenste armpen, aansluitend op de binnenste handpen. Nummering van buiten naar binnen.'],
          ['T',   'Tertial',            'Elleboogpen',               'De 3 binnenste armpennen (T1–T3); anatomisch aansluitend op de elleboog'],
          ['GC',  'Greater covert',     'Armpendekveer',             'Bedekkende dekveer over de basis van de armpennen; GC1 = buitenste'],
          ['MC',  'Median covert',      'Middelste vleugeldekveer',  'Rij dekveren boven de GC'],
          ['LC',  'Lesser covert',      'Kleine vleugeldekveer',     'Kleinste dekverenrij, boven de MC'],
          ['PC',  'Primary covert',     'Handpendekveer',            'Bedekkende dekveer over de basis van de handpennen'],
          ['CC',  'Carpal covert',      'Carpale dekveer',           'Grote dekveer over het carpaalgewricht (vleugelknie)'],
          ['Em',  'Emargination',       'Versmalling buitenvlag',    'Versmalling op de buitenzijde (outer web / vaan) van een handpen'],
          ['WP',  'Wingpoint',          'Vleugelpunt / handpunt',    'De punt van de LANGSTE handpen (= eigenlijke vleugelspits). Verschilt per soort — vaak P3–P6. WP-maat = totale vleugellengte'],
          ['TF',  'Tail feather',       'Staartveer',                'TF1 = middelste staartveer; TF6 = buitenste staartveer'],
          ['—',   'Alula',              'Duimvleugel / alula',       '3 kleine veren aan het "duim"-gewricht van de vleugel, bij het carpaalgewricht'],
        ],
      },
    ],
  },

  {
    id: 'vleugelformule-begrippen',
    categorie: 'Biometrie & morfologie',
    titel: 'Vleugelformule',
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
            definitie: 'Afstand in mm van de vleugelspits (WP = punt van de langste handpen) tot de punt van S1, gemeten aan de gevouwen vleugel. Geeft de "vinger" van de vleugel aan.',
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
