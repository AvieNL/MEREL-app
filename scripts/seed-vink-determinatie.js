/**
 * Seed determinatiehulpen voor Vink (16360) naar Supabase
 * Bron: Demongin (2020) p.357–358
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
    id: 'vink-leeftijd',
    soorten: ['16360'],
    resultaat_veld: 'leeftijd',
    naam: 'Leeftijdsbepaling Vink',
    korte_beschrijving: 'Herfst: PC-kleur vs GC; Voorjaar: TF1-vorm en tertiaaltoestand',
    bron: 'Demongin (2020) p.357–358',
    type: 'survey',
    start: 'seizoen',
    overzicht: [
      {
        conditie: 'Herfst (jul–dec)',
        sub: [
          { conditie: 'Witachtige nekvlek, donzig vent', resultaat: '3J (net uitgevlogen)' },
          { conditie: 'PC duidelijk bleker/bruiner dan binnenste GC', resultaat: 'na 1e kj (4)' },
          { conditie: 'PC vrijwel even donker als GC, T breed en fris', resultaat: 'na 2e kj (6)' },
        ],
      },
      {
        conditie: 'Voorjaar (jan–jun)',
        sub: [
          { conditie: 'TF1 puntig, versleten, doffe bruine rand, geen donkere eindvlek', resultaat: '2e kj (5)' },
          { conditie: 'TF1 afgerond, fris, groene rand buitenvlag', resultaat: 'na 2e kj (6)' },
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
          { waarde: 'jun_dec', label: 'Zomer/herfst (jun–dec)', volgende: 'pc_contrast_nj' },
          { waarde: 'jan_mei', label: 'Winter/voorjaar (jan–mei)', volgende: 'tf1_vorm_vj' },
        ],
      },

      pc_contrast_nj: {
        id: 'pc_contrast_nj',
        label: 'PC-kleur t.o.v. GC',
        type: 'keuze',
        vraag: 'Kleur handpendekveren (PC) vergeleken met de binnenste grote vleugeldekveren (GC)?',
        opties: [
          {
            waarde: 'bleker',
            label: 'PC duidelijk bleker of bruiner dan GC',
            resultaat: {
              waarde: '4', label: 'na 1e kj (4)', zeker: false,
              uitleg: 'Juveniele PC behouden na de gedeeltelijke postjuv-rui. Let op: CC zijn soms donkerder dan GC van dezelfde generatie — dit is geen ruigrens.',
            },
          },
          {
            waarde: 'donker',
            label: 'PC vrijwel even donker (zwart) als GC',
            volgende: 'tertiaal_nj',
          },
          {
            waarde: 'onzeker',
            label: 'Niet duidelijk te beoordelen',
            resultaat: {
              waarde: null, fallback_waarde: 'U', label: 'Niet te bepalen', zeker: false,
              uitleg: 'Contrast PC/GC niet duidelijk. Bij ♀ V zijn contrasten zwakker.',
            },
          },
        ],
      },

      tertiaal_nj: {
        id: 'tertiaal_nj',
        label: 'Tertiaaltoestand (najaar)',
        type: 'keuze',
        vraag: 'Toestand tertialen (T): rand en overgang donker/licht?',
        opties: [
          {
            waarde: 'fris',
            label: 'Breed, fris, uitgebreid rufous eindtip met scherpe grens',
            resultaat: {
              waarde: '6', label: 'na 2e kj (6)', zeker: false,
              uitleg: 'Brede, frisse tertialen met scherpe rufous eindtip en PC even donker als GC wijzen op adult. Bij ♀ V zijn contrasten zwakker.',
            },
          },
          {
            waarde: 'onzeker',
            label: 'Niet duidelijk te beoordelen',
            resultaat: {
              waarde: null, fallback_waarde: 'U', label: 'Niet te bepalen', zeker: false,
              uitleg: 'Tertiaaltoestand niet duidelijk. Bij ♀ V zijn contrasten zwakker.',
            },
          },
        ],
      },

      tf1_vorm_vj: {
        id: 'tf1_vorm_vj',
        label: 'TF1-vorm (voorjaar)',
        type: 'keuze',
        vraag: 'Vorm en toestand van TF1 (buitenste staartpen)?',
        opties: [
          {
            waarde: 'puntig',
            label: 'Puntig, versleten, doffe bruine rand, geen donkere eindvlek',
            resultaat: {
              waarde: '5', label: '2e kj (5)', zeker: false,
              uitleg: 'Juveniele TF1 puntig en versleten met doffe bruine rand op de buitenvlag, zonder donkere eindvlek. Juveniele tertialen smaller en smaller gerand met diffuse grens.',
            },
          },
          {
            waarde: 'afgerond',
            label: 'Afgerond, fris, groene rand op buitenvlag',
            resultaat: {
              waarde: '6', label: 'na 2e kj (6)', zeker: false,
              uitleg: 'Afgeronde, frisse TF1 met groene rand op buitenvlag, soms donkere eindvlek. Tertialen breed met rufous eindtip en scherpe grens.',
            },
          },
          {
            waarde: 'onzeker',
            label: 'Niet duidelijk te beoordelen',
            resultaat: {
              waarde: null, fallback_waarde: 'U', label: 'Niet te bepalen', zeker: false,
              uitleg: 'TF1-vorm niet duidelijk. Bij ♀ V zijn contrasten zwakker.',
            },
          },
        ],
      },

    },
  },

  // ── Geslachtsbepaling ───────────────────────────────────────────────────
  {
    id: 'vink-geslacht',
    soorten: ['16360'],
    resultaat_veld: 'geslacht',
    naam: 'Geslachtsbepaling Vink',
    korte_beschrijving: 'Borstkleur (rozerood vs buff-bruin) → vleugellengte (≥89 mm = ♂ M)',
    bron: 'Demongin (2020) p.357–358',
    type: 'survey',
    start: 'borst_kleur',
    overzicht: [
      { conditie: 'Borst rufous-roze (duidelijk roze tint)', resultaat: '♂ M' },
      { conditie: 'Borst lichtbruin-buff, geen roze tint', resultaat: '♀ V' },
      { conditie: 'Vleugel ≥89 mm', resultaat: '♂ M (zeker — F max 88 mm)' },
      { conditie: 'Vleugel ≤85 mm', resultaat: '♀ V (zeker — M min 86 mm)' },
      { conditie: 'Vleugel 86–88 mm + borstkleur onduidelijk', resultaat: 'Niet te bepalen' },
    ],
    stappen: {

      borst_kleur: {
        id: 'borst_kleur',
        label: 'Borstkleur',
        type: 'keuze',
        vraag: 'Kleur van de borst?',
        opties: [
          {
            waarde: 'roze',
            label: 'Rufous-roze (duidelijk roze tint)',
            resultaat: {
              waarde: 'M', label: '♂ Man', zeker: false,
              uitleg: 'Rufous-roze borst is een ♂ M-kenmerk. Let op: bij jonge ♂ M in de postjuv-rui zijn de veren nog deels getipped met buff.',
            },
          },
          {
            waarde: 'buff',
            label: 'Lichtbruin-buff (geen roze tint)',
            resultaat: {
              waarde: 'F', label: '♀ Vrouw', zeker: false,
              uitleg: 'Lichtbruin-buff borst zonder roze tint is een ♀ V-kenmerk.',
            },
          },
          {
            waarde: 'onzeker',
            label: 'Onduidelijk / niet goed te beoordelen',
            volgende: 'vleugel_meting',
          },
        ],
      },

      vleugel_meting: {
        id: 'vleugel_meting',
        label: 'Vleugellengte',
        type: 'meting',
        vraag: 'Meet de vleugellengte (mm)',
        uit_formulier: 'vleugel',
        inputs: [
          { key: 'vleugel', label: 'Vleugellengte (mm)', min: 70, max: 105 },
        ],
        bereken_type: 'drempelwaarde',
        bereken_config: {
          veld: 'vleugel',
          drempel: 89,
          resultaat_groter_gelijk: {
            waarde: 'M', label: '♂ Man (zeker)', zeker: true,
            uitleg_template: 'Vleugellengte {v} mm ≥ 89 mm: zeker ♂ M (♀ V max 88 mm voor ssp. coelebs).',
          },
          resultaat_kleiner: {
            waarde: null, fallback_waarde: 'U', label: 'Niet te bepalen', zeker: false,
            uitleg_template: 'Vleugellengte {v} mm valt in of onder het overlappingsgebied (♂ M 86–95, ♀ V 80–88 mm). Gebruik borstkleur of andere kenmerken.',
          },
        },
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

console.log('✓ Vink determinatiehulpen toegevoegd aan Supabase:');
rows.forEach(r => console.log(' ', r.id));
