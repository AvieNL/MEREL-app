/**
 * seed-holenduif-determinatie.js
 * Laad determinatiehulpen voor Holenduif (06680) in Supabase.
 * Bron: Demongin (2016) p.182
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
    id: 'holenduif-leeftijd',
    soorten: ['06680'],
    resultaat_veld: 'leeftijd',
    naam: 'Leeftijdsbepaling Holenduif',
    korte_beschrijving: 'MC/LC/T kleur + buitenste PC kleur',
    bron: 'Demongin (2016) p.182',
    type: 'survey',
    start: 'seizoen',
    overzicht: [
      { conditie: 'MC/LC/T mat lichtbruin, geen irisatie op nek; buitenste PC lichtbruin', resultaat: '1e kj (3)' },
      { conditie: 'MC/LC/T egaal asgrijs; buitenste PC donker grijszwart', resultaat: 'na 1e kj (4)' },
      { conditie: 'VJ: aangehouden juv S/CC/TF + lichtbruine buitenste PC', resultaat: '2e kj (5)' },
    ],
    stappen: {

      seizoen: {
        id: 'seizoen',
        label: 'Seizoen',
        type: 'keuze',
        uit_formulier: 'vangstdatum',
        transform_type: 'datum_naar_periode',
        vraag: 'In welk seizoen is de vogel gevangen?',
        toelichting: 'Het seizoen bepaalt welke EURING-codes van toepassing zijn. Let op: de postjuv-rui is sterk variabel — vroege 1e kj-vogels kunnen de rui al volledig hebben afgerond en zijn dan niet meer te ouderdomsbepalen.',
        opties: [
          { waarde: 'jun_dec', label: 'Najaar (jun–dec)', volgende: 'veer_kleur_nj' },
          { waarde: 'jan_mei', label: 'Voorjaar (jan–mei)', volgende: 'gesuspendeerde_rui' },
        ],
      },

      veer_kleur_nj: {
        id: 'veer_kleur_nj',
        label: 'Kleur MC/LC/T (najaar)',
        type: 'keuze',
        vraag: 'Hoe zien MC, LC en T eruit? Is er irisatie op nek of achterhoofd?',
        toelichting: 'Bij 1e kj zijn MC, LC en T mat lichtbruin. Naarmate de postjuv-rui vordert, worden er asgrijs adult-veren zichtbaar. Adult heeft egaal asgrijs MC/LC. Let op: adults die laat ruien kunnen sterk versleten, bruinachtig verkleurde veren hebben — beoordeel ook de buitenste PC.',
        opties: [
          {
            waarde: 'lichtbruin',
            label: 'MC/LC/T mat lichtbruin (volledig of mix met asgrijs ad-veren); geen of zwakke irisatie op nek',
            volgende: 'pc_kleur_nj',
          },
          {
            waarde: 'asgrijs',
            label: 'MC/LC/T egaal asgrijs; irisatie op nek aanwezig',
            resultaat: {
              waarde: '4',
              label: 'na 1e kj',
              zeker: false,
              uitleg: 'Egaal asgrijs MC/LC en T met irisatie op nek duiden op na 1e kj (4). Buitenste PC donker grijszwart. Soms 2 generaties S zichtbaar. Let op: adults die laat ruien kunnen tijdelijk sterk versleten, bruinachtige veren hebben.',
            },
          },
          {
            waarde: 'onzeker',
            label: 'Niet te beoordelen (bv. sterk versleten of rui bijna compleet)',
            resultaat: {
              waarde: null,
              fallback_waarde: 'U',
              label: 'Niet te bepalen',
              zeker: false,
              uitleg: 'Leeftijdsbepaling niet mogelijk. Als de postjuv-rui volledig voltooid is, is 1e kj niet meer te onderscheiden van adult.',
            },
          },
        ],
      },

      pc_kleur_nj: {
        id: 'pc_kleur_nj',
        label: 'Buitenste PC kleur (najaar)',
        type: 'keuze',
        vraag: 'Hoe is de kleur van de buitenste handpendekveren (PC)?',
        toelichting: 'Bij 1e kj zijn de buitenste juv PC lichtbruin. P kan soms volledig in jeugdveer zijn tot feb of later. Let op: verwar niet met adult die laat ruien — check ook MC/LC/T en aanwezigheid van irisatie.',
        opties: [
          {
            waarde: 'lichtbruin',
            label: 'Lichtbruin — juveniele kleur',
            resultaat: {
              waarde: '3',
              label: '1e kj',
              zeker: false,
              uitleg: 'Lichtbruine buitenste PC, mat lichtbruine MC/LC/T en geen of zwakke irisatie duiden op 1e kj (3). P kan soms volledig in jeugdveer zijn tot feb of later.',
            },
          },
          {
            waarde: 'grijszwart',
            label: 'Donker grijszwart',
            resultaat: {
              waarde: '4',
              label: 'na 1e kj',
              zeker: false,
              uitleg: 'Donker grijszwarte buitenste PC duiden op na 1e kj (4), ook als MC/LC/T nog gedeeltelijk bruin zijn door late rui. Soms 2 generaties S zichtbaar.',
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
              uitleg: 'Leeftijdsbepaling niet mogelijk. Als de postjuv-rui volledig voltooid is, is 1e kj niet meer te onderscheiden van adult.',
            },
          },
        ],
      },

      gesuspendeerde_rui: {
        id: 'gesuspendeerde_rui',
        label: 'Gesuspendeerde rui (voorjaar)',
        type: 'keuze',
        vraag: 'Zijn er nog aangehouden versleten juveniele S, CC of TF zichtbaar? En hoe zijn de buitenste PC?',
        toelichting: 'In het voorjaar zijn alleen vogels met een gesuspendeerde of afgebroken postjuv-rui te ouderdomsbepalen. Vogels waarbij de rui volledig voltooid is, zijn niet meer van adult te onderscheiden.',
        opties: [
          {
            waarde: 'ja',
            label: 'Ja — versleten bruinachtige juv S, CC of TF aangehouden; buitenste PC lichtbruin',
            resultaat: {
              waarde: '5',
              label: '2e kj',
              zeker: false,
              uitleg: 'Aangehouden versleten juv S, CC of TF en lichtbruine buitenste PC duiden in het voorjaar op 2e kj (5) (= vorig najaar: 1e kj (3)).',
            },
          },
          {
            waarde: 'nee',
            label: 'Nee — buitenste PC grijszwart, geen aangehouden juv veren',
            resultaat: {
              waarde: null,
              fallback_waarde: 'U',
              label: 'Niet te bepalen',
              zeker: false,
              uitleg: 'Als de postjuv-rui volledig voltooid is, zijn 2e kj (5) en na 2e kj (6) in het voorjaar niet te onderscheiden. Buitenste PC is dan bij beiden grijszwart.',
            },
          },
        ],
      },

    },
  },

  // ── Geslachtsbepaling ─────────────────────────────────────────────────────
  {
    id: 'holenduif-geslacht',
    soorten: ['06680'],
    resultaat_veld: 'geslacht',
    naam: 'Geslachtsbepaling Holenduif',
    korte_beschrijving: 'T en scapulars kleur — alleen bij adult met fris verenkleed',
    bron: 'Demongin (2016) p.182',
    type: 'survey',
    start: 'adult_check',
    overzicht: [
      { conditie: 'T en scapulars blauwgrijs', resultaat: '♂ M (waarschijnlijk)' },
      { conditie: 'T en scapulars bruingrijs', resultaat: '♀ V (waarschijnlijk)' },
    ],
    stappen: {

      adult_check: {
        id: 'adult_check',
        label: 'Adult met fris verenkleed?',
        type: 'keuze',
        vraag: 'Is het een adult en zijn de veren niet sterk versleten?',
        toelichting: 'Geslachtsbepaling bij Holenduif is alleen mogelijk bij adults. Bij 1e kj (3) en bij sterk versleten verenkleed is geslacht niet te bepalen.',
        opties: [
          {
            waarde: 'ja',
            label: 'Adult — verenkleed niet sterk versleten',
            volgende: 'scapulars_t',
          },
          {
            waarde: 'nee',
            label: 'Juveniel of sterk versleten verenkleed',
            resultaat: {
              waarde: null,
              fallback_waarde: 'U',
              label: 'Niet te bepalen',
              zeker: false,
              uitleg: 'Geslachtsbepaling is alleen mogelijk bij adults met fris verenkleed. Bij 1e kj (3) of bij sterk versleten veren is het kenmerk (T en scapulars kleur) niet betrouwbaar.',
            },
          },
        ],
      },

      scapulars_t: {
        id: 'scapulars_t',
        label: 'Kleur T en scapulars',
        type: 'keuze',
        vraag: 'Hoe zijn de T (tertialen) en scapulars van kleur?',
        toelichting: 'Kijk bij fris verenkleed naar de kleur van de tertialen en scapulars. Bij ♂ M zijn deze blauwgrijs, bij ♀ V bruingrijs.',
        opties: [
          {
            waarde: 'blauwgrijs',
            label: 'Blauwgrijs',
            resultaat: {
              waarde: 'M',
              label: '♂ M (waarschijnlijk)',
              zeker: false,
              uitleg: 'Blauwgrijze T en scapulars duiden op ♂ M.',
            },
          },
          {
            waarde: 'bruingrijs',
            label: 'Bruingrijs',
            resultaat: {
              waarde: 'F',
              label: '♀ V (waarschijnlijk)',
              zeker: false,
              uitleg: 'Bruingrijze T en scapulars duiden op ♀ V.',
            },
          },
          {
            waarde: 'onzeker',
            label: 'Niet duidelijk te plaatsen',
            resultaat: {
              waarde: null,
              fallback_waarde: 'U',
              label: 'Niet te bepalen',
              zeker: false,
              uitleg: 'Geslacht niet te bepalen op basis van T en scapulars kleur alleen.',
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
console.log('\n✓ Holenduif determinatiehulpen opgeslagen in Supabase');
