/**
 * Seed determinatiehulpen voor Zanglijster (12000) naar Supabase
 * Bron: Demongin (2020) p.266
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const aids = [

  // ── Leeftijdsbepaling ────────────────────────────────────────────────────
  {
    id: 'zanglijster-leeftijd',
    soorten: ['12000'],
    resultaat_veld: 'leeftijd',
    naam: 'Leeftijdsbepaling Zanglijster',
    korte_beschrijving: 'GC-contrast (olijf vs. roestbruin) · TF1-vorm · PC-kleur',
    bron: 'Demongin (2020) p.266',
    type: 'survey',
    start: 'seizoen',
    overzicht: [
      {
        conditie: 'Herfst (jun–dec)',
        sub: [
          { conditie: 'Binnenste GC olijf + geel-buff tip vs. buitenste GC roestbruin + triangulaire gele vlek', resultaat: '1e kj (3)' },
          { conditie: 'Geen GC-contrast; TF1 minder puntig; PC olijf', resultaat: 'na 1e kj (4)' },
        ],
      },
      {
        conditie: 'Voorjaar (jan–mei)',
        sub: [
          { conditie: 'GC-contrast nog zichtbaar; soms driehoekige inkeping op versleten GC', resultaat: '2e kj (5)' },
          { conditie: 'Geen GC-contrast', resultaat: 'Niet nader te dateren' },
        ],
      },
    ],
    stappen: {

      seizoen: {
        id: 'seizoen',
        label: 'Seizoen',
        type: 'keuze',
        vraag: 'In welk seizoen is de vogel gevangen?',
        uit_formulier: 'vangstdatum',
        transform_type: 'datum_naar_periode',
        opties: [
          { waarde: 'jun_dec', label: 'Zomer/herfst (jun–dec)', volgende: 'gc_contrast_nj' },
          { waarde: 'jan_mei', label: 'Winter/voorjaar (jan–mei)', volgende: 'gc_contrast_vj' },
        ],
      },

      gc_contrast_nj: {
        id: 'gc_contrast_nj',
        label: 'GC-contrast (najaar)',
        type: 'keuze',
        vraag: 'Is er contrast tussen de binnenste (verruide) en buitenste (juveniele) grote vleugeldekveren (GC)?',
        toelichting: 'Binnenste GC verruide: olijftint met geel-buff eindtip. Buitenste juv GC: roestbruin met duidelijke triangulaire gele vlek aan de tip. Let op ssp. clarkei (Nederland): bij 1e kj soms weinig of geen kleurcontrast in GC — controleer dan ook TF1-vorm en PC-kleur.',
        opties: [
          {
            waarde: 'ja',
            label: 'Ja — binnenste GC olijf + geel-buff tip, buitenste GC roestbruin + triangulaire gele vlek',
            resultaat: {
              waarde: '3', label: '1e kj (3)', zeker: false,
              uitleg: 'GC-contrast is het hoofdcriterium voor 1e kj. PC roestig gekleurd met geel-buff of lichtbruin-roestkleurige buitenvlag. TF1 gewoonlijk puntig. Bij ssp. clarkei kan het contrast minder duidelijk zijn — gebruik dan ook TF1 en PC als bevestiging.',
            },
          },
          {
            waarde: 'nee',
            label: 'Nee — geen contrast, GC egaal olijf zonder abrupte verandering tussen aangrenzende GC',
            resultaat: {
              waarde: '4', label: 'na 1e kj (4)', zeker: false,
              uitleg: 'Geen GC-contrast wijst op adult. Tertialen, GC en PC olijftint. Langste PC doffer en egaler dan bij 1e kj. TF1 gewoonlijk minder puntig.',
            },
          },
          {
            waarde: 'onzeker',
            label: 'Niet duidelijk te beoordelen',
            volgende: 'tf1_vorm_nj',
          },
        ],
      },

      tf1_vorm_nj: {
        id: 'tf1_vorm_nj',
        label: 'TF1-vorm (najaar)',
        type: 'keuze',
        vraag: 'Vorm van de buitenste staartveer (TF1)?',
        opties: [
          {
            waarde: 'puntig',
            label: 'Puntig',
            resultaat: {
              waarde: '3', label: '1e kj (3)', zeker: false,
              uitleg: 'Puntige TF1 wijst op 1e kj, met name in combinatie met roestige PC. Let op dat er overlap is met adulten.',
            },
          },
          {
            waarde: 'afgerond',
            label: 'Minder puntig of afgerond',
            resultaat: {
              waarde: '4', label: 'na 1e kj (4)', zeker: false,
              uitleg: 'Minder puntige TF1 wijst eerder op adult. Controleer ook PC-kleur: olijf = adult, roestig = 1e kj.',
            },
          },
          {
            waarde: 'onzeker',
            label: 'Niet te beoordelen',
            resultaat: {
              waarde: null, fallback_waarde: 'U', label: 'Niet te bepalen', zeker: false,
              uitleg: 'GC-contrast en TF1-vorm zijn beide niet te beoordelen. Leeftijdsbepaling is niet mogelijk.',
            },
          },
        ],
      },

      gc_contrast_vj: {
        id: 'gc_contrast_vj',
        label: 'GC-contrast (voorjaar)',
        type: 'keuze',
        vraag: 'Is er nog contrast zichtbaar in de grote vleugeldekveren (GC)?',
        toelichting: 'Hetzelfde criterium als in de herfst is in het voorjaar meestal nog bruikbaar. Bij versleten verenkleed soms een driehoekige inkeping op de GC zichtbaar als aanvullend kenmerk.',
        opties: [
          {
            waarde: 'ja',
            label: 'Ja — contrast aanwezig; soms driehoekige inkeping op versleten GC',
            resultaat: {
              waarde: '5', label: '2e kj (5)', zeker: false,
              uitleg: '2e kj (5) = vorig najaar 1e kj (3). GC-contrast in het voorjaar is betrouwbaar als het aanwezig is.',
            },
          },
          {
            waarde: 'nee',
            label: 'Geen contrast zichtbaar',
            resultaat: {
              waarde: null, fallback_waarde: 'U', label: 'Niet nader te dateren', zeker: false,
              uitleg: 'Geen GC-contrast in het voorjaar: kan 2e kj zijn waarbij contrast door slijtage niet meer zichtbaar is, of ouder.',
            },
          },
          {
            waarde: 'onzeker',
            label: 'Niet te beoordelen',
            resultaat: {
              waarde: null, fallback_waarde: 'U', label: 'Niet te bepalen', zeker: false,
              uitleg: 'Leeftijdsbepaling niet mogelijk.',
            },
          },
        ],
      },

    },
  },

  // ── Geslachtsbepaling ───────────────────────────────────────────────────
  {
    id: 'zanglijster-geslacht',
    soorten: ['12000'],
    resultaat_veld: 'geslacht',
    naam: 'Geslachtsbepaling Zanglijster',
    korte_beschrijving: 'Duidelijke broedvlek (BP) aanwezig = ♀ V',
    bron: 'Demongin (2020) p.266',
    type: 'survey',
    start: 'bp_aanwezig',
    overzicht: [
      { conditie: 'Duidelijke broedvlek (BP) aanwezig', resultaat: '♀ V' },
      { conditie: 'Geen of onduidelijke BP', resultaat: 'Niet te bepalen' },
    ],
    stappen: {

      bp_aanwezig: {
        id: 'bp_aanwezig',
        label: 'Broedvlek',
        type: 'keuze',
        vraag: 'Is er een duidelijke broedvlek (BP) aanwezig?',
        opties: [
          {
            waarde: 'ja',
            label: 'Ja — duidelijke BP zichtbaar',
            resultaat: {
              waarde: 'F', label: '♀ Vrouw', zeker: false,
              uitleg: 'Een duidelijke broedvlek (BP) duidt op ♀ V.',
            },
          },
          {
            waarde: 'nee',
            label: 'Nee of niet duidelijk',
            resultaat: {
              waarde: null, fallback_waarde: 'U', label: 'Niet te bepalen', zeker: false,
              uitleg: 'Geen of onduidelijke BP — geslacht niet te bepalen op basis van de in Demongin genoemde criteria.',
            },
          },
        ],
      },

    },
  },

];

// ── Upsert naar Supabase ───────────────────────────────────────────────────
const rows = aids.map(aid => ({ id: aid.id, data: aid }));

const { error } = await sb.from('determinatie_aid').upsert(rows);

if (error) {
  console.error('Upsert mislukt:', error.message);
  process.exit(1);
}

console.log('✓ Zanglijster determinatiehulpen toegevoegd aan Supabase:');
rows.forEach(r => console.log(' ', r.id));
