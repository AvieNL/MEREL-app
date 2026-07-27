/**
 * seed-middelste-bonte-specht-determinatie.js
 * Voegt de determinatiehulpen voor de Middelste Bonte Specht (EURING 08830)
 * toe aan de Supabase determinatie_aid tabel.
 *
 * Gebruik: node scripts/seed-middelste-bonte-specht-determinatie.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// ─── Leeftijdsbepaling ────────────────────────────────────────────────────────

const leeftijdAid = {
  id: 'mbs-leeftijd',
  soorten: ['08830'],
  resultaat_veld: 'leeftijd',
  naam: 'Leeftijdsbepaling Middelste Bonte Specht',
  korte_beschrijving: 'PC-kwaliteit als primaire indicator; P1-projectie als bevestiging',
  bron: 'Demongin (2020) p.212',
  type: 'survey',
  start: 'pc_kwaliteit',
  overzicht: [
    { conditie: 'PC dof bruin, contrasterend met verse GC', resultaat: '1e kj (EURING 3)' },
    { conditie: 'PC gemengd: bruin juv-PC naast glanzend zwarte geruide PC', resultaat: '2e kj (EURING 5)' },
    { conditie: 'PC egaal glanzend zwart, geen contrast', resultaat: 'Adult (EURING 6)' },
  ],
  stappen: {

    pc_kwaliteit: {
      id: 'pc_kwaliteit',
      label: 'PC-kwaliteit',
      type: 'keuze',
      vraag: 'Hoe zien de handpendekveren (PC) eruit?',
      toelichting: 'De PC-kleur is het betrouwbaarste leeftijdskenmerk. Bij 1e kj zijn de PC dof bruin en contrasteren ze met verse GC. Adults hebben egaal glanzend zwarte PC zonder contrast. Overgangskleed (2e kj) toont een mix.',
      opties: [
        {
          waarde: 'dof',
          label: 'Dof bruin — contrasterend met verse GC',
          resultaat: {
            waarde: '3',
            label: '1e kj',
            zeker: false,
            uitleg: 'Doffe bruine PC die contrasteren met verse GC: kenmerk van juveniel kleed. P5–P3 doorgaans met 2 mm brede witte vlekken op de punt. P1 steekt 5–12 mm breed boven de PC uit (P1–WP = 61–67).',
          },
        },
        {
          waarde: 'gemengd',
          label: 'Gemengd — bruine juv-PC naast glanzend zwarte geruide PC',
          resultaat: {
            waarde: '5',
            label: '2e kj',
            zeker: false,
            uitleg: 'Aangehouden bruine juv-PC naast nieuwe glanzend zwarte PC. Buitenste (geruide) PC contrasteren vaak met versleten en bruinere juveniele binnenste PC. T, S en deel juv-GC zijn ook behouden.',
          },
        },
        {
          waarde: 'zwart',
          label: 'Egaal glanzend zwart — geen contrast',
          transform_type: null,
          volgende: 'p1_projectie',
        },
      ],
    },

    p1_projectie: {
      id: 'p1_projectie',
      label: 'P1-projectie',
      type: 'keuze',
      vraag: 'Hoe ver steekt P1 boven de PC uit, en hoe ziet P1 eruit?',
      toelichting: 'Bij egaal zwarte PC helpt P1-projectie om adult te bevestigen. Meet de afstand van de punt van P1 tot de langste PC. Adult: P1 smal en spits, ≤ 4–4 mm boven PC.',
      opties: [
        {
          waarde: 'smal',
          label: 'P1 smal en spits, ≤ 4 mm boven PC (P1–WP = 69–80)',
          resultaat: {
            waarde: '6',
            label: 'Adult',
            zeker: false,
            uitleg: 'Egaal glanzend zwarte PC en smal/spits P1 ≤ 4 mm boven PC: adult. P5–P3 doorgaans zwart afgepunt, behalve witte rand op buitenste web. P1–WP = 69–80.',
          },
        },
        {
          waarde: 'breed',
          label: 'P1 breed, > 4 mm boven PC — twijfelachtig',
          resultaat: {
            waarde: null,
            fallback_waarde: 'U',
            label: 'Onzeker',
            zeker: false,
            uitleg: 'PC egaal zwart maar P1-projectie past niet eenduidig bij adult. Controleer of er aangehouden juv-S of versleten GC zijn die wijzen op 2e kj.',
          },
        },
      ],
    },

  },
};

// ─── Geslachtsbepaling ────────────────────────────────────────────────────────

const geslachtAid = {
  id: 'mbs-geslacht',
  soorten: ['08830'],
  resultaat_veld: 'geslacht',
  naam: 'Geslachtsbepaling Middelste Bonte Specht',
  korte_beschrijving: 'Kruinvlekmeting (lengte + breedte); start altijd met leeftijd',
  bron: 'Demongin (2020) p.212',
  type: 'survey',
  start: 'leeftijd_check',
  overzicht: [
    { conditie: 'Kruinvlek ≥ 34 mm lang en ≥ 20 mm breed (postjuv)', resultaat: '♂ M (waarschijnlijk)' },
    { conditie: 'Kruinvlek 29–38 mm lang, roze-rood, goudbruin begrensd', resultaat: '♀ V (waarschijnlijk)' },
    { conditie: 'Juveniel: kruinvlek ≥ 24 mm', resultaat: '♂ M (indicatief)' },
    { conditie: 'Juveniel: kruinvlek ≤ 22 mm', resultaat: '♀ V (indicatief)' },
  ],
  stappen: {

    leeftijd_check: {
      id: 'leeftijd_check',
      label: 'Kleedtype',
      type: 'keuze',
      vraag: 'Is de vogel een juveniel (1e kj vóór postjuv-rui) of postjuveniel/adult?',
      toelichting: 'Begin altijd met leeftijdsbepaling. Geslachtsbepaling van juvenielen is moeilijk — de kruinvlekgrootte is klein (18–25 mm) en het onderscheid is niet absoluut.',
      opties: [
        { waarde: 'postjuv', label: 'Postjuveniel of adult (PC deels of volledig geruid)', volgende: 'kruinvlek_postjuv' },
        { waarde: 'juv',     label: 'Juveniel (PC volledig bruin, nog niet geruid)',         volgende: 'kruinvlek_juv' },
      ],
    },

    kruinvlek_postjuv: {
      id: 'kruinvlek_postjuv',
      label: 'Kruinvlek (postjuv/adult)',
      type: 'meting',
      vraag: 'Meet de lengte van de rode kruinvlek (mm)',
      toelichting: '♂ M: kruinvlek helder rood, lang (34–46 mm) en breed (20–29 mm), reikt tot achterste kruin. ♀ V: kruinvlek roze-rood (29–38 mm lang, 18–24 mm breed), begrensd door roze-bruin/goudbruin. Overlap is beperkt maar aanwezig.',
      inputs: [
        { key: 'kruinvlek', label: 'Rode kruinvlek (mm)', min: 10, max: 60 },
      ],
      bereken_type: 'drempelwaarde',
      bereken_config: {
        veld: 'kruinvlek',
        drempel: 34,
        resultaat_groter_gelijk: {
          waarde: 'M',
          label: '♂ M (waarschijnlijk)',
          zeker: false,
          uitleg_template: 'Kruinvlek {v} mm (≥ 34 mm → waarschijnlijk ♂ M; ♂ M-range 34–46 mm). Controleer ook breedte (♂ M 20–29 mm) en of vlek tot achterste kruin reikt.',
        },
        resultaat_kleiner: {
          waarde: 'F',
          label: '♀ V (waarschijnlijk)',
          zeker: false,
          uitleg_template: 'Kruinvlek {v} mm (< 34 mm → waarschijnlijk ♀ V; ♀ V-range 29–38 mm). Let op roze-rode kleur en goudbruine begrenzing op achterste kruin.',
        },
      },
    },

    kruinvlek_juv: {
      id: 'kruinvlek_juv',
      label: 'Kruinvlek (juveniel)',
      type: 'meting',
      vraag: 'Meet de lengte van de rode kruinvlek bij dit juveniel (mm)',
      toelichting: 'Geslachtsbepaling van juvenielen is indicatief (kleine steekproef in literatuur). ♂ M juv: 24–25 mm helder rood. ♀ V juv: 18–22 mm dofbruin-rood. Geen goudbruin op achterste kruin bij ♀ V juv.',
      inputs: [
        { key: 'kruinvlek_juv', label: 'Rode kruinvlek juv (mm)', min: 5, max: 40 },
      ],
      bereken_type: 'drempelwaarde',
      bereken_config: {
        veld: 'kruinvlek_juv',
        drempel: 23,
        resultaat_groter_gelijk: {
          waarde: 'M',
          label: '♂ M (indicatief)',
          zeker: false,
          uitleg_template: 'Kruinvlek {v} mm (≥ 23 mm → indicatief ♂ M; ♂ M juv-range 24–25 mm, kleine steekproef). Achterste kruin zwart met licht bruine of rode veerpunten.',
        },
        resultaat_kleiner: {
          waarde: 'F',
          label: '♀ V (indicatief)',
          zeker: false,
          uitleg_template: 'Kruinvlek {v} mm (< 23 mm → indicatief ♀ V; ♀ V juv-range 18–22 mm, kleine steekproef). Geen goudbruin op achterste kruin.',
        },
      },
    },

  },
};

// ─── Upsert naar Supabase ─────────────────────────────────────────────────────

const rows = [
  { id: leeftijdAid.id, data: leeftijdAid },
  { id: geslachtAid.id, data: geslachtAid },
];

const { error } = await sb.from('determinatie_aid').upsert(rows);

if (error) {
  console.error('Upsert mislukt:', error.message);
  process.exit(1);
}

console.log('✓ Middelste Bonte Specht determinatiehulpen toegevoegd aan Supabase:');
console.log('  mbs-leeftijd');
console.log('  mbs-geslacht');
