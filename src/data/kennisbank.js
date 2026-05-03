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
    id: 'veertopografie',
    categorie: 'Biometrie & morfologie',
    titel: 'Veertopografie',
    secties: [
      {
        type: 'tekst',
        tekst: 'Bij het determineren en ringen van vogels is het belangrijk om de verschillende delen van een veer en een aantal typische structuren goed te kunnen benoemen. Onderstaande termen gelden met name voor slag- en staartpennen, maar zijn in grote lijnen ook toepasbaar op andere veren.',
      },
      {
        type: 'koptitel',
        tekst: 'Basisopbouw van een veer',
      },
      {
        type: 'definitielijst',
        items: [
          {
            term: 'Schacht (rachis)',
            definitie: 'De centrale, stijve as van de veer waar de baarden aan vastzitten. Het onderste, holle deel dat in de huid steekt, wordt de veerpen of calamus genoemd; het bovendeel waaraan de baarden zitten is de rachis.',
          },
          {
            term: 'Binnenvlag (inner vane)',
            definitie: 'De zijde van de veer die naar het lichaam van de vogel toe is gericht wanneer de vleugel gesloten is. Bij de rechtervleugel is dit de linkerkant van de veer; bij de linkervleugel de rechterkant.',
          },
          {
            term: 'Buitenvlag (outer vane)',
            definitie: 'De zijde van de veer die van het lichaam af is gericht wanneer de vleugel gesloten is. Bij de rechtervleugel is dit de rechterkant van de veer; bij de linkervleugel de linkerkant. De buitenvlag is bij veel handpennen smaller dan de binnenvlag.',
          },
          {
            term: 'Top / punt (tip)',
            definitie: 'Het meest distale uiteinde van de veer, het verst verwijderd van de huid. Hier kijk je naar slijtage, vorm en eventuele lichte of zware randen.',
          },
          {
            term: 'Basis (base)',
            definitie: 'Het proximale deel van de veer, dicht bij de huid en de overgang naar de veerpen (calamus). Hier zijn soms donsachtige baarden zichtbaar en is het begin of einde van kleurpatronen te zien.',
          },
          {
            term: 'Baarden en baardjes (barbs & barbules)',
            definitie: 'De zijtakjes die uit de schacht steken (baarden) en de nog fijnere vertakkingen (baardjes) waarmee de veer een samenhangend, gesloten oppervlak vormt. Ze bepalen de "volheid" en structuur van de vlag.',
          },
        ],
      },
      {
        type: 'koptitel',
        tekst: 'Specifieke structuren aan de vlaggen',
      },
      {
        type: 'definitielijst',
        items: [
          {
            term: 'Versmalling buitenvlag (emargination)',
            definitie: 'Een lokale insnoering in de buitenvlag van een handpen, waarbij de buitenrand op een bepaald traject duidelijk smaller is dan het deel ervoor en erna. Dit geeft de indruk van een "uitgehapt" stuk in de buitenvlag. In Engelstalige literatuur aangeduid als emargination of emarginate primary.',
          },
          {
            term: 'Versmalling binnenvlag (notch)',
            definitie: 'Een lokale versmalling of inkeping in de binnenvlag van een handpen. De binnenrand wordt op een bepaald punt smaller en verbreedt daarna weer richting top. In het Engels doorgaans een notch genoemd. Bij sommige soorten (zoals fitis/tjiftjaf) is de aanwezigheid, positie of lengte van de notch een belangrijk determinatiekenmerk.',
          },
        ],
      },
      {
        type: 'koptitel',
        tekst: 'Praktische toepassing',
      },
      {
        type: 'lijst',
        items: [
          'Emarginaties (versmalling buitenvlag) en notches (versmalling binnenvlag) worden gebruikt voor soort-, leeftijds- en geslachtsbepaling op basis van handpennen.',
          'In veldgidsen en determinatiehandleidingen voor ringers worden zowel de Nederlandse beschrijving als de Engelse term vermeld — gebruik ze naast elkaar voor consistente verslaglegging.',
          'Voor digitale invoer in MEREL.app geldt: emargination wordt genoteerd als de pennen waarop versmalling aanwezig is (bijv. Em = P3 P4 P5); de notch-positie als de proximale rand t.o.v. andere pentoppen (bijv. Notch P2 = 8/10).',
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
