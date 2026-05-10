/**
 * seed-houtduif-determinatie.js
 * Voegt de determinatiehulpen voor de Houtduif (EURING 06700) toe aan
 * de Supabase determinatie_aid tabel.
 *
 * Gebruik: node scripts/seed-houtduif-determinatie.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// ─── Aid-definities (Supabase-formaat: geen JS-functies, wel bereken_type) ───

const leeftijdAid = {
  id: 'houtduif-leeftijd',
  soorten: ['06700'],
  resultaat_veld: 'leeftijd',
  naam: 'Leeftijdsbepaling Houtduif',
  korte_beschrijving: 'Via handpendekveren en ruicentra in de handpennen',
  bron: 'Demongin (2020) p.182–183',
  type: 'survey',
  start: 'pc_rand',
  overzicht: [
    { conditie: 'Buffrand op buitenste handpendekveren', resultaat: '1e kj', zeker: false },
    {
      conditie: 'Geen buffrand (egaal donker leigrijs)',
      sub: [
        { conditie: 'Twee ruicentra in P (beide vleugels)', resultaat: '2e kj (deel herkenbaar)' },
        { conditie: 'Één ruicentrum of geen rui', resultaat: 'Adult — of voltooide 2e kj (niet te onderscheiden)' },
      ],
    },
  ],
  stappen: {
    pc_rand: {
      id: 'pc_rand',
      label: 'Handpendekveren',
      type: 'keuze',
      vraag: 'Hoe zijn de buitenste handpendekveren?',
      toelichting: 'Kijk naar de kleur van de buitenste handpendekveren (PC). Een buff- of bruine rand wijst op een 1e-kalenderjaar vogel.',
      opties: [
        {
          waarde: 'buff',
          label: 'Buffachtige of bruine rand op de buitenste PC',
          resultaat: {
            waarde: '3',
            label: '1e kj',
            zeker: false,
            uitleg: 'Een buff- of bruine rand op de buitenste handpendekveren is kenmerkend voor 1e kj. Let op: vroege vogels kunnen hun postrui al bijna hebben voltooid — controleer zo nodig het ruipatroon in de P.',
          },
        },
        {
          waarde: 'donker',
          label: 'Egaal donker leigrijs — geen buffrand',
          volgende: 'ruicentra',
        },
      ],
    },
    ruicentra: {
      id: 'ruicentra',
      label: 'Ruicentra in P',
      type: 'keuze',
      vraag: 'Hoeveel ruicentra zijn zichtbaar in de handpennen?',
      toelichting: 'Controleer beide vleugels. Twee ruicentra = twee aparte zones van verse of actieve pennen. Controleer ook: is P2 nog juveniel (bruinachtig, versleten)? En/of zit er een buffpunt op de buitenste kleine dekveren bij de vleugelboeg?',
      opties: [
        {
          waarde: 'twee',
          label: 'Twee ruicentra (zichtbaar in beide vleugels)',
          resultaat: {
            waarde: '5',
            label: '2e kj',
            zeker: false,
            uitleg: 'Twee ruicentra zijn een betrouwbare indicator voor 2e kj. Let op: alleen een kleine fractie van de 2kj-vogels is zo te herkennen — de meeste zijn al niet meer te onderscheiden van adulten.',
          },
        },
        {
          waarde: 'een',
          label: 'Één ruicentrum, of geen actieve rui zichtbaar',
          resultaat: {
            waarde: '4',
            label: 'Adult (of voltooide 2e kj)',
            zeker: false,
            uitleg: 'Donkere leigrijze handpendekveren zonder buffrand en één ruicentrum wijzen op adult. Een 2e kj dat de postrui heeft afgerond (v.a. de zomer van het 2e kj) is niet meer te onderscheiden van een adult.',
          },
        },
      ],
    },
  },
};

const geslachtAid = {
  id: 'houtduif-geslacht',
  soorten: ['06700'],
  resultaat_veld: 'geslacht',
  naam: 'Geslachtsbepaling Houtduif',
  korte_beschrijving: 'Via kopbreedte achter de ogen — beperkt betrouwbaar, overlap aanwezig',
  bron: 'Demongin (2020) p.182',
  type: 'survey',
  start: 'kopbreedte',
  stappen: {
    kopbreedte: {
      id: 'kopbreedte',
      label: 'Kopbreedte',
      type: 'meting',
      vraag: 'Meet de kopbreedte direct achter de ogen (mm)',
      toelichting: 'Meet de breedte van de kop direct achter de ogen. Let op: er is overlap in de maten (♂ M 22,0–23,8 mm; ♀ V 20,3–23,2 mm). De meting is het meest betrouwbaar bij direct vergelijk van een broedpaar. Bevestig ook via onderbuikkleur: ♂ M sterker roséachtig (vineus), ♀ V roséachtig met grijze tint.',
      inputs: [
        {
          key: 'kopbreedte',
          label: 'Kopbreedte (mm)',
          decimalen: 1,
          min: 18,
          max: 27,
          placeholder: 'bijv. 22.5',
        },
      ],
      // bereken_type wordt door determinatie-interpreter.js omgezet naar een echte functie
      bereken_type: 'drempelwaarde',
      bereken_config: {
        veld: 'kopbreedte',
        drempel: 22,
        resultaat_groter_gelijk: {
          waarde: 'M',
          label: '♂ Mogelijk man',
          zeker: false,
          uitleg_template: 'Kopbreedte {v} mm (≥ 22 mm) wijst op ♂ M. Let op: overlap met ♀ V (20,3–23,2 mm). Betrouwbaarder in direct vergelijk met partner.',
        },
        resultaat_kleiner: {
          waarde: 'F',
          label: '♀ Mogelijk vrouw',
          zeker: false,
          uitleg_template: 'Kopbreedte {v} mm (< 22 mm) wijst op ♀ V. Let op: overlap met ♂ M ((21) 22,0–23,8 mm). Betrouwbaarder in direct vergelijk met partner.',
        },
      },
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

console.log('✓ Houtduif determinatiehulpen toegevoegd aan Supabase:');
rows.forEach(r => console.log(' ', r.id));
