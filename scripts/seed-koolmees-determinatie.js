/**
 * seed-koolmees-determinatie.js
 * Laad determinatiehulpen voor Koolmees (14640) in Supabase.
 * Bron: Demongin (2016) p.328
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
    id: 'koolmees-leeftijd',
    soorten: ['14640'],
    resultaat_veld: 'leeftijd',
    naam: 'Leeftijdsbepaling Koolmees',
    korte_beschrijving: 'Wangenkleur → PC-kleur t.o.v. GC',
    bron: 'Demongin (2016) p.328',
    type: 'survey',
    start: 'wangen',
    overzicht: [
      { conditie: 'Wangen lichtgeel, niet omgeven door zwart', resultaat: '1e kj, deels in jeugdkleed (3J)' },
      { conditie: 'PC dof blauwachtig groenig-grijs, contrasterend met GC', resultaat: '1e kj (3)' },
      { conditie: 'PC uniform blauw als GC, geen contrast', resultaat: 'na 1e kj (4)' },
    ],
    stappen: {
      wangen: {
        id: 'wangen',
        label: 'Wangenkleur',
        type: 'keuze',
        vraag: 'Hoe zien de wangen eruit?',
        toelichting: 'Jonge Koolmezen vóór de postjuveniele rui hebben lichtgele wangen die niet omgeven zijn door zwart. Na de rui worden de wangen wit en omgeven door zwart.',
        opties: [
          {
            waarde: 'geel',
            label: 'Lichtgeel — niet omgeven door zwart',
            resultaat: {
              waarde: '3',
              label: '1e kj, deels in jeugdkleed',
              zeker: false,
              uitleg: 'Lichtgele wangen, niet omgeven door zwart, duiden op een juveniel vóór de postjuveniele rui. Kroon dof zwart. Onderzijde dof geel; middenstreep onduidelijk.',
            },
          },
          {
            waarde: 'wit',
            label: 'Wit — omgeven door zwart',
            volgende: 'pc_kleur',
          },
        ],
      },
      pc_kleur: {
        id: 'pc_kleur',
        label: 'PC-kleur vs. GC',
        type: 'keuze',
        vraag: 'Vergelijk de kleur van de handpendekveren (PC) met de middelste armdekveren (MC) en grote armdekveren (GC).',
        toelichting: 'Na de postjuveniele rui blijven de juv PC aangehouden. Deze zijn doffer en groenig-grijs van kleur, terwijl de vers gemoulte GC en MC blauwgrijs zijn. Contrast duidelijker bij ♂ M dan bij ♀ V. Let op: bij oostelijke individuen kan het contrast moeilijker te beoordelen zijn.',
        opties: [
          {
            waarde: 'contrast',
            label: 'PC dof blauwachtig groenig-grijs — contrasterend met dieper blauwgrijs GC/MC',
            resultaat: {
              waarde: '3',
              label: '1e kj',
              zeker: false,
              uitleg: 'Dof groenig-grijze juv PC die contrasteren met de blauwgrijze GC en MC duiden op 1e kj. Juv TF en T vaak meer versleten dan bij na 1e kj (4); PC meer puntig. Iris donkerbruin, soms grijsachtig getint.',
            },
          },
          {
            waarde: 'uniform',
            label: 'PC en GC vrijwel gelijk blauw — geen of nauwelijks contrast',
            resultaat: {
              waarde: '4',
              label: 'na 1e kj',
              zeker: false,
              uitleg: 'Geen contrast tussen PC en GC duidt op na 1e kj (4). PC meer afgerond. Iris helder bruin met roodachtige tint. Let op: uitzonderlijk kunnen wangen iets geel zijn bij na 1e kj (4).',
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
              uitleg: 'Bij sommige individuen (m.n. oostelijke herkomst of sterk versleten) is het contrast niet betrouwbaar te beoordelen. Leeftijd niet met zekerheid vast te stellen.',
            },
          },
        ],
      },
    },
  },

  // ── Geslachtsbepaling ─────────────────────────────────────────────────────
  {
    id: 'koolmees-geslacht',
    soorten: ['14640'],
    resultaat_veld: 'geslacht',
    naam: 'Geslachtsbepaling Koolmees',
    korte_beschrijving: 'BP → buikvlek breedte en kleur',
    bron: 'Demongin (2016) p.328',
    type: 'survey',
    start: 'bp',
    overzicht: [
      { conditie: 'Broedvlek aanwezig', resultaat: '♀ V (zeker)' },
      { conditie: 'Buikvlek breed, helder zwart', resultaat: '♂ M (waarschijnlijk)' },
      { conditie: 'Buikvlek smal, mat zwartgrijs, soms onderbroken', resultaat: '♀ V (waarschijnlijk)' },
    ],
    stappen: {
      bp: {
        id: 'bp',
        label: 'Broedvlek',
        type: 'keuze',
        vraag: 'Is er een broedvlek aanwezig?',
        toelichting: 'Beoordeel de buikvlek en het zwart vóór het blazen van veren.',
        opties: [
          {
            waarde: 'ja',
            label: 'Broedvlek aanwezig',
            resultaat: {
              waarde: 'F',
              label: '♀ V',
              zeker: true,
              uitleg: 'Een broedvlek is een betrouwbare indicator voor het vrouwelijk geslacht.',
            },
          },
          {
            waarde: 'nee',
            label: 'Geen broedvlek',
            volgende: 'buikvlek',
          },
        ],
      },
      buikvlek: {
        id: 'buikvlek',
        label: 'Buikvlek',
        type: 'keuze',
        vraag: 'Hoe ziet de zwarte middenstreep / buikvlek eruit?',
        toelichting: 'Beoordeel vóór het blazen van veren. Bij ♂ M vormt de streep een brede zwarte vlek op de buik tussen de benen. Bij ♀ V is de streep smal en mat, soms onderbroken. Soms moeilijk te beoordelen.',
        opties: [
          {
            waarde: 'breed',
            label: 'Helder blauwachtig-zwart, breed — vormt brede vlek tussen benen',
            resultaat: {
              waarde: 'M',
              label: '♂ M (waarschijnlijk)',
              zeker: false,
              uitleg: 'Brede, heldere buikvlek met blauwachtig-zwarte kleur duidt op ♂ M. Bij 1e kj ♂ M (3) soms met witte randen. Kroon en keel helder blauwachtig-zwart.',
            },
          },
          {
            waarde: 'smal',
            label: 'Mat zwartgrijs, smal op borst — soms onderbroken; vlek tussen benen klein, gemengd met wit',
            resultaat: {
              waarde: 'F',
              label: '♀ V (waarschijnlijk)',
              zeker: false,
              uitleg: 'Smalle, matte buikvlek met grijsachtige kleur duidt op ♀ V. Vlek tussen benen klein, gemengd met witachtig. Postjuv dekveren gewoonlijk minder blauw dan bij ♂ M.',
            },
          },
          {
            waarde: 'onzeker',
            label: 'Tussenin — niet duidelijk te plaatsen',
            resultaat: {
              waarde: null,
              fallback_waarde: 'U',
              label: 'Niet te bepalen',
              zeker: false,
              uitleg: 'Geslacht niet met zekerheid vast te stellen op basis van buikvlek alleen. Geslachtsbepaling van Koolmees is soms moeilijk door diverse mogelijke oorzaken.',
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
console.log('\n✓ Koolmees determinatiehulpen opgeslagen in Supabase');
