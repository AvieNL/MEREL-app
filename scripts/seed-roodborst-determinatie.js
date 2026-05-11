/**
 * seed-roodborst-determinatie.js
 * Voegt de determinatiehulpen voor de Roodborst (EURING 10990) toe aan
 * de Supabase determinatie_aid tabel.
 *
 * Gebruik: node scripts/seed-roodborst-determinatie.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// ─── Aid-definities (Supabase-formaat: geen JS-functies, wel transform_type) ──

const leeftijdAid = {
  id: 'roodborst-leeftijd',
  soorten: ['10990'],
  resultaat_veld: 'leeftijd',
  naam: 'Leeftijdsbepaling Roodborst',
  korte_beschrijving: 'GC contrast (juv bruin/geelbruin vs geruid olijf) · alula kleur · staartveer vorm',
  bron: 'Demongin (2016) p.245–246',
  type: 'survey',
  start: 'seizoen',
  overzicht: [
    { conditie: 'Volledig juveniel verenkleed, geen oranje-rood op gezicht of borst', resultaat: '1e kj volledig juv (3J)' },
    { conditie: 'GC contrast: buitenste juv bruin/geelbruin vs binnenste geruid olijf', resultaat: '1e kj (3)' },
    { conditie: 'Alle GC en alula egaal olijf, geen moultgrens', resultaat: 'na 1e kj (4)' },
    { conditie: 'VJ: GC contrast zichtbaar, PC en TF meer versleten', resultaat: '2e kj (5)' },
    { conditie: 'VJ: Geen GC contrast, alle dekveren egaal olijf, PC en TF vers', resultaat: 'na 2e kj (6)' },
  ],
  stappen: {

    seizoen: {
      id: 'seizoen',
      label: 'Seizoen',
      type: 'keuze',
      vraag: 'In welk seizoen is de vogel gevangen?',
      toelichting: 'Het seizoen bepaalt welke EURING-codes van toepassing zijn. Het GC-contrast is bruikbaar in zowel najaar als voorjaar.',
      uit_formulier: {
        veld: 'datum',
        transform_type: 'datum_naar_periode',
      },
      opties: [
        { waarde: 'jun_dec', label: 'Zomer / najaar (jun–dec)', volgende: 'oranje_rood_nj' },
        { waarde: 'jan_mei', label: 'Voorjaar (jan–mei)',       volgende: 'gc_contrast_vj' },
      ],
    },

    // ── Najaar-pad ────────────────────────────────────────────────────────────

    oranje_rood_nj: {
      id: 'oranje_rood_nj',
      label: 'Oranje-rood op gezicht/borst',
      type: 'keuze',
      vraag: 'Is er oranje-rood aanwezig op het gezicht of de borst?',
      toelichting: 'Een vogel in volledig juveniel verenkleed (vóór de postjuv-rui) heeft geen oranje-rood op het gezicht of de borst. De bovenzijde, vleugeldekveren en staartveren zijn bruin met bleke vlekken. Dit stadium is aanwezig vóór de start van de postjuv-rui (doorgaans jun–vroeg aug).',
      opties: [
        {
          waarde: 'nee',
          label: 'Nee — bovenzijde volledig bruin met bleke vlekken, geen oranje-rood',
          resultaat: {
            waarde: '3',
            label: '1e kj volledig juv (3J)',
            zeker: false,
            uitleg: 'Volledig juveniel verenkleed: bovenzijde, vleugeldekveren en staartveren bruin met bleke vlekken, geen oranje-rood op gezicht of borst. Dit stadium is aanwezig vóór de start van de postjuv-rui (doorgaans jun–vroeg aug).',
          },
        },
        {
          waarde: 'ja',
          label: 'Ja — oranje-rood zichtbaar op gezicht of borst',
          volgende: 'gc_contrast_nj',
        },
      ],
    },

    gc_contrast_nj: {
      id: 'gc_contrast_nj',
      label: 'GC contrast (najaar)',
      type: 'keuze',
      vraag: 'Is er contrast zichtbaar in de grote vleugeldekveren (GC)?',
      toelichting: 'Vergelijk de buitenste GC (juveniel: bruin met geelbruine buitenrand) met de binnenste GC (geruid: volledig olijf zonder gele punt). Aantal en vorm van de gele punt op GC zijn sterk variabel en kan volledig afwezig zijn op juv veren. Als alle GC geruid zijn: zoek de moultgrens met juv PC, alula 2, alula 3 of staartveren. Bevestig met staartveer-vorm (spitser = 1e kj) en alula-kleur.',
      opties: [
        {
          waarde: 'contrast',
          label: 'Contrast aanwezig — buitenste juv GC bruin/geelbruin vs binnenste geruid olijf (of moultgrens elders in vleugel)',
          resultaat: {
            waarde: '3',
            label: '1e kj',
            zeker: false,
            uitleg: 'GC-contrast wijst op 1e kj (3). Staartveren (TF) gewoonlijk spitser. Binnenzijde bovenmandibel doorgaans geel tot grijswit, soms donkerder vanaf sep (nauwelijks betrouwbaar).',
          },
        },
        {
          waarde: 'geen_contrast',
          label: 'Geen contrast — alle GC en alula egaal olijf, geen moultgrens',
          resultaat: {
            waarde: '4',
            label: 'na 1e kj',
            zeker: false,
            uitleg: 'Egale olijf GC en alula zonder moultgrens duiden op na 1e kj (4). Controleer altijd de alula om 1e kj met alle GC geruid uit te sluiten. Staartveren (TF) doorgaans afgerond. Binnenzijde bovenmandibel donker of middelgrijs met iets geel aan de basis (nauwelijks betrouwbaar).',
          },
        },
        {
          waarde: 'onzeker',
          label: 'Niet te beoordelen',
          resultaat: {
            waarde: null,
            fallback_waarde: 'U',
            label: 'Niet te bepalen',
            zeker: false,
            uitleg: 'GC-contrast niet te beoordelen. Controleer ook de alula (olijf egaal incl. rand = na 1e kj; moultgrens met bruine juv alula = 1e kj met alle GC geruid) en de staartveren (spitser = 1e kj, afgerond en breder = na 1e kj).',
          },
        },
      ],
    },

    // ── Voorjaar-pad ──────────────────────────────────────────────────────────

    gc_contrast_vj: {
      id: 'gc_contrast_vj',
      label: 'GC contrast (voorjaar)',
      type: 'keuze',
      vraag: 'Is er contrast zichtbaar in de grote vleugeldekveren (GC)?',
      toelichting: 'Zelfde criterium als in het najaar. In het voorjaar zijn de buitenste juv GC meer versleten en bruinachtig. PC en staartveren zijn bij 2e kj meer versleten en bruinachtig; juv PC en TF1 spitser maar door slijtage vaak moeilijk te beoordelen.',
      opties: [
        {
          waarde: 'contrast',
          label: 'Contrast aanwezig — buitenste juv GC versleten/bruinachtig vs binnenste geruid olijf',
          resultaat: {
            waarde: '5',
            label: '2e kj',
            zeker: false,
            uitleg: 'GC-contrast in het voorjaar wijst op 2e kj (5) (= vorig najaar: 1e kj (3)). PC en staartveren meer versleten en bruinachtig. Juv PC en TF1 spitser, maar door slijtage vaak moeilijk te beoordelen.',
          },
        },
        {
          waarde: 'geen_contrast',
          label: 'Geen contrast — alle dekveren egaal olijf zonder moultgrens, PC en TF vers en afgerond',
          resultaat: {
            waarde: '6',
            label: 'na 2e kj',
            zeker: false,
            uitleg: 'Geen GC-contrast en verse, donker bruingrijze, afgeronde PC en staartveren zonder moultgrens wijzen op na 2e kj (6). Alle dekveren egaal olijf.',
          },
        },
        {
          waarde: 'onzeker',
          label: 'Niet te beoordelen (bv. door slijtage)',
          resultaat: {
            waarde: null,
            fallback_waarde: 'U',
            label: 'Niet te bepalen',
            zeker: false,
            uitleg: 'Leeftijdsbepaling niet mogelijk in het voorjaar. Slijtage kan het GC-contrast bij 2e kj doen verdwijnen.',
          },
        },
      ],
    },

  },
};

const geslachtAid = {
  id: 'roodborst-geslacht',
  soorten: ['10990'],
  resultaat_veld: 'geslacht',
  naam: 'Geslachtsbepaling Roodborst',
  korte_beschrijving: 'Geen visueel kenmerk — vleugelmeting leidend; overlap 65–74 mm niet betrouwbaar',
  bron: 'Demongin (2016) p.245–246',
  type: 'survey',
  start: 'vleugel_range',
  overzicht: [
    { conditie: 'Vleugel ≥ 75 mm — boven ♀ V maximum', resultaat: 'Vrijwel zeker ♂ M' },
    { conditie: 'Vleugel 65–74 mm — grensgebied', resultaat: 'Niet betrouwbaar te bepalen' },
    { conditie: 'Vleugel ≤ 64 mm — onder ♂ M minimum', resultaat: 'Vrijwel zeker ♀ V' },
  ],
  stappen: {

    vleugel_range: {
      id: 'vleugel_range',
      label: 'Vleugelmeting',
      type: 'keuze',
      vraag: 'Wat is de vleugelmeting (vlakke vleugel, ssp. rubecula/melophilus)?',
      toelichting: 'Er is geen betrouwbaar visueel kenmerk voor geslachtsbepaling bij Roodborst. De vleugelmeting is de enige bruikbare indicator. In het grensgebied 65–74 mm overlappen ♂ M en ♀ V en is geslachtsbepaling via meting alleen niet betrouwbaar.',
      opties: [
        {
          waarde: 'groot',
          label: '≥ 75 mm — boven het maximum van ♀ V (max 74 mm)',
          resultaat: {
            waarde: 'M',
            label: '♂ M (vrijwel zeker)',
            zeker: false,
            uitleg: 'Vleugel ≥ 75 mm valt boven het maximum van ♀ V (ssp. rubecula/melophilus) en wijst vrijwel zeker op ♂ M. Let op: lokale populaties of andere ondersoorten kunnen afwijkende grenzen hebben.',
          },
        },
        {
          waarde: 'midden',
          label: '65–74 mm — grensgebied, overlap ♂ M en ♀ V',
          resultaat: {
            waarde: null,
            fallback_waarde: 'U',
            label: 'Niet betrouwbaar te bepalen',
            zeker: false,
            uitleg: 'In het grensgebied 65–74 mm overlappen ♂ M en ♀ V. Geslachtsbepaling via vleugelmeting alleen is hier niet betrouwbaar. Formulebepaling voor adulten (Catalonië, 13% fout): ♂ M als 0,723 × vleugel − 52,0198 > 0 (drempelwaarde ca. 72 mm).',
          },
        },
        {
          waarde: 'klein',
          label: '≤ 64 mm — onder het minimum van ♂ M (min 69 mm)',
          resultaat: {
            waarde: 'F',
            label: '♀ V (vrijwel zeker)',
            zeker: false,
            uitleg: 'Vleugel ≤ 64 mm valt onder het minimum van ♂ M (ssp. rubecula/melophilus) en wijst vrijwel zeker op ♀ V. Let op: lokale populaties of andere ondersoorten kunnen afwijkende grenzen hebben.',
          },
        },
      ],
    },

  },
};

// ─── Upsert naar Supabase ────────────────────────────────────────────────────

const rows = [
  { id: leeftijdAid.id, data: leeftijdAid },
  { id: geslachtAid.id, data: geslachtAid },
];

const { error } = await sb.from('determinatie_aid').upsert(rows);

if (error) {
  console.error('Upsert mislukt:', error.message);
  process.exit(1);
}

console.log('✓ Roodborst determinatiehulpen toegevoegd aan Supabase:');
rows.forEach(r => console.log(' ', r.id));
