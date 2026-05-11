/**
 * seed-winterkoning-determinatie.js
 * Laad determinatiehulpen voor Winterkoning (10660) in Supabase.
 * Bron: Demongin (2016) p.243
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const aids = [

  // ── Leeftijdsbepaling ──────────────────────────────────────────────────────
  {
    id: 'winterkoning-leeftijd',
    soorten: ['10660'],
    resultaat_veld: 'leeftijd',
    naam: 'Leeftijdsbepaling Winterkoning',
    korte_beschrijving: 'Onderstaartdekveren → GC kleur/contrast',
    bron: 'Demongin (2016) p.243',
    type: 'survey',
    start: 'seizoen',
    overzicht: [
      { conditie: 'Onderstaartdekveren volledig bruin', resultaat: '1e kj, deels in jeugdkleed (3J)' },
      { conditie: 'Juv buitenste GC roodbruin, korter, contrasterend met grijsbruine binnenste GC', resultaat: '1e kj (3) / 2e kj (5)' },
      { conditie: 'GC egaal middelbruin/grijsbruin, geen contrast met LC/MC', resultaat: 'na 1e kj (4) / na 2e kj (6)' },
    ],
    stappen: {

      seizoen: {
        id: 'seizoen',
        label: 'Seizoen',
        type: 'keuze',
        uit_formulier: 'vangstdatum',
        transform_type: 'datum_naar_periode',
        vraag: 'In welk seizoen is de vogel gevangen?',
        toelichting: 'Het seizoen bepaalt welke EURING-codes van toepassing zijn.',
        opties: [
          { waarde: 'jun_dec', label: 'Najaar (jun–dec)', volgende: 'staart_dek' },
          { waarde: 'jan_mei', label: 'Voorjaar (jan–mei)', volgende: 'gc_contrast_vj' },
        ],
      },

      staart_dek: {
        id: 'staart_dek',
        label: 'Onderstaartdekveren',
        type: 'keuze',
        vraag: 'Hoe zien de onderstaartdekveren (undertail coverts) eruit?',
        toelichting: 'Bij juvenielen vóór de postjuveniele rui neigen de onderstaartdekveren naar volledig bruin. Na de rui zijn ze wit getipt. Dit kenmerk is alleen bruikbaar vroeg in het najaar.',
        opties: [
          {
            waarde: 'bruin',
            label: 'Neigend naar volledig bruin — geen of nauwelijks wit',
            resultaat: {
              waarde: '3',
              label: '1e kj, deels in jeugdkleed',
              zeker: false,
              uitleg: 'Volledig bruine onderstaartdekveren duiden op een juveniel vóór de postjuveniele rui (3J).',
            },
          },
          {
            waarde: 'wit_getipt',
            label: 'Wit getipt',
            volgende: 'gc_contrast_nj',
          },
        ],
      },

      gc_contrast_nj: {
        id: 'gc_contrast_nj',
        label: 'GC kleur en contrast (najaar)',
        type: 'keuze',
        vraag: 'Vergelijk de buitenste en binnenste grote armdekveren (GC): is er een kleur- en lengteverschil?',
        toelichting: 'Juv buitenste GC zijn intensief roodbruin, minder gespikkeld en vaak iets korter. De gemoulte binnenste GC zijn iets lichter grijsbruin met gelige tint, iets langer en hebben een lichtere of witte punt. Gemoulte MC en LC hebben dezelfde kleur als de gemoulte binnenste GC en contrasteren daardoor met de roodbruine juv GC. Let op: ruigrens kan ontbreken als alle GC zijn gemoult — zoek dan contrast in T, alula of MC.',
        opties: [
          {
            waarde: 'contrast',
            label: 'Buitenste GC intensief roodbruin, iets korter — duidelijk contrasterend met grijsbruine binnenste GC',
            resultaat: {
              waarde: '3',
              label: '1e kj',
              zeker: false,
              uitleg: 'Roodbruine juv buitenste GC die contrasteren met grijsbruine gemoulte binnenste GC duiden op 1e kj (3). Gemoulte GC zijn iets langer met lichtere punt en duidelijkere donkere vlekken. MC en LC van dezelfde kleur als gemoulte GC. Soms ook 1 of 2 T gemoult (zelfde soort contrast). CC soms wit getipt.',
            },
          },
          {
            waarde: 'geen_contrast',
            label: 'GC egaal middelbruin of grijsbruin — geen kleurverschil met LC/MC',
            resultaat: {
              waarde: '4',
              label: 'na 1e kj',
              zeker: false,
              uitleg: 'Egaal gekleurde GC zonder contrast met LC/MC duiden op na 1e kj (4). GC middelbruin of grijsbruin, soms met lichte of witte punt op enkele veren.',
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
              uitleg: 'Leeftijdsbepaling via GC-contrast niet mogelijk. Let op: P4-uiterlijk (≤ 8 lichte vlekken = juv; ≥ 10 = post-juv) en alula 3 zijn niet erg betrouwbaar als leeftijdsindicator.',
            },
          },
        ],
      },

      gc_contrast_vj: {
        id: 'gc_contrast_vj',
        label: 'GC kleur en contrast (voorjaar)',
        type: 'keuze',
        vraag: 'Vergelijk de buitenste en binnenste grote armdekveren (GC): is er een kleur- en lengteverschil?',
        toelichting: 'In het voorjaar zijn de kenmerken door slijtage minder uitgesproken. Juv buitenste GC zijn roodbruin en korter dan de binnenste GC. Gemoulte binnenste GC zijn grijsbruin met eventueel een lichte punt.',
        opties: [
          {
            waarde: 'contrast',
            label: 'Buitenste GC intensief roodbruin, iets korter — contrasterend met binnenste grijsbruine GC',
            resultaat: {
              waarde: '5',
              label: '2e kj',
              zeker: false,
              uitleg: 'Roodbruine juv buitenste GC contrasterend met grijsbruine gemoulte binnenste GC duiden in het voorjaar op 2e kj (5) (= vorig najaar: 1e kj (3)). MC en LC van dezelfde kleur als de gemoulte GC.',
            },
          },
          {
            waarde: 'geen_contrast',
            label: 'GC egaal middelbruin of grijsbruin — geen kleurverschil met LC/MC',
            resultaat: {
              waarde: '6',
              label: 'na 2e kj',
              zeker: false,
              uitleg: 'Egaal gekleurde GC zonder contrast met LC/MC duiden in het voorjaar op na 2e kj (6) (= vorig najaar: na 1e kj (4)).',
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
              uitleg: 'Leeftijdsbepaling niet mogelijk. In het voorjaar zijn kenmerken door slijtage minder uitgesproken.',
            },
          },
        ],
      },

    },
  },

  // ── Geslachtsbepaling ─────────────────────────────────────────────────────
  {
    id: 'winterkoning-geslacht',
    soorten: ['10660'],
    resultaat_veld: 'geslacht',
    naam: 'Geslachtsbepaling Winterkoning',
    korte_beschrijving: 'BP/CP → morfometrische formule',
    bron: 'Demongin (2016) p.243',
    type: 'survey',
    start: 'bp_cp',
    overzicht: [
      { conditie: 'Broedvlek aanwezig', resultaat: '♀ V (zeker)' },
      { conditie: 'Uitstekende cloaca aanwezig', resultaat: '♂ M (zeker)' },
      { conditie: 'Morfometrische formule (ssp. indigenus)', resultaat: '♂ M als 0,75 × vleugel + 0,72 × kop+snavel − 58,71 > 0' },
    ],
    stappen: {

      bp_cp: {
        id: 'bp_cp',
        label: 'Broedvlek / cloaca',
        type: 'keuze',
        vraag: 'Is er een broedvlek of uitstekende cloaca aanwezig?',
        toelichting: 'Broedvlek (BP) en uitstekende cloaca zijn betrouwbare geslachtsindicatoren bij Winterkoning.',
        opties: [
          {
            waarde: 'bp',
            label: 'Broedvlek aanwezig',
            resultaat: {
              waarde: 'F',
              label: '♀ V',
              zeker: true,
              uitleg: 'Een broedvlek is een betrouwbare indicator voor het vrouwelijk geslacht.',
            },
          },
          {
            waarde: 'cp',
            label: 'Uitstekende cloaca aanwezig',
            resultaat: {
              waarde: 'M',
              label: '♂ M',
              zeker: true,
              uitleg: 'Een uitstekende cloaca is een betrouwbare indicator voor het mannelijk geslacht.',
            },
          },
          {
            waarde: 'geen',
            label: 'Geen broedvlek of uitstekende cloaca',
            resultaat: {
              waarde: null,
              fallback_waarde: 'U',
              label: 'Niet te bepalen',
              zeker: false,
              uitleg: 'Zonder BP of uitstekende cloaca is geslachtsbepaling bij Winterkoning lastig. Voor ssp. indigenus is een morfometrische formule beschikbaar (4% fout): ♂ M als 0,75 × vleugel + 0,72 × kop+snavel − 58,71 > 0. Voor Catalonië (9% fout): ♂ M als 0,3721 × vleugel + 0,3804 × P3 − 30,4661 > 0. Beiden zijn ondersoort-specifiek — gebruik voorzichtig bij vogels van onbekende herkomst.',
            },
          },
        ],
      },

    },
  },

];

const rows = aids.map(aid => ({ id: aid.id, data: aid }));
const { error } = await sb.from('determinatie_aid').upsert(rows);

if (error) { console.error('Upsert mislukt:', error.message); process.exit(1); }
for (const aid of aids) console.log(`✓ ${aid.naam} (${aid.id})`);
console.log('\n✓ Winterkoning determinatiehulpen opgeslagen in Supabase');
