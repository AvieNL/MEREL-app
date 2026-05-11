/**
 * fix-gbs-leeftijd-markers.js
 * Elke alinea krijgt zijn eigen {{07-12}} of {{01-06}} marker zodat de
 * tabfilter in renderLeeftijdMarkdown alle alinea's correct filtert.
 * Zonder dit verschijnen alinea's zonder marker in BEIDE tabbladen.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const { data: row, error: fetchErr } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .eq('euring_code', '08760')
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }

// Elke alinea heeft zijn eigen {{MM-MM}}-marker:
// renderLeeftijdMarkdown splitst op \n\n — alleen alinea's MET marker worden gefilterd.
const NJ = '{{07-12}}\n';
const VJ = '{{01-06}}\n';

const leeftijds_notities_vj = [

  NJ +
  '**1e kj vóór postjuv-rui [3]**\n' +
  'Kroon dof rood met zwarte rand; nek zwart. Buikzijde en onderstaartdekveren roze of dof rood. P2 t/m P10 met witte of lichtbeige punt; PC breed. P1 steekt 5–12 mm boven de PC uit (P1–WP = 61–74). Let op: bij irrupties (major uit N-Europa) kan de rui traag verlopen waardoor de kroon tot in okt rood blijft.',

  NJ +
  '**1e kj in/na postjuv-rui [4]** → in jan: 2e kj [5 vj]\n' +
  'LC, MC en nieuwe mantelveertjes pas gemoult, contrasterend met doffe, bruinere juv PC en buitenste GC. Buitenste GC doorgaans bruiner dan nieuw gemoult dekveermateriaal. Geen S-rui.',

  NJ +
  '**2e kj [5 herfst]** → in jan: 3e kj [7 vj]\n' +
  'Na eerste volledige postbroed-rui: vergelijkbaar met adult, maar aangehouden juv PC puntiger, smaller, duidelijk bruiner en meer versleten. Soms aangehouden juv S meer versleten en gebleekt; lijn van witte vlekken op S-punten niet recht.',

  NJ +
  '**3e kj [7 herfst]** → in jan: 4e kj [9 vj]\n' +
  'Vergelijkbaar met adult. Incidenteel 1 of 2 juv PC aangehouden — dan puntiger, smaller en bruiner dan verse PC. Let op: ook adulten kunnen PC aanhouden over 2 opeenvolgende ruien; niet altijd zeker te onderscheiden.',

  NJ +
  '**Adult [6]**\n' +
  'Alle PC egaal glanzend zwart, zonder contrast. Kroon zwart. P2 t/m P5 (P6) zonder witte punt. P1 steekt 3–5 mm boven de PC uit (P1–WP = 75–88).',

  VJ +
  '**2e kj [5 vj]** (= vorig najaar: 1e kj na rui [4])\n' +
  'LC, MC en nieuwe mantelveertjes gemoult, contrasterend met doffe en bruinere juv PC en buitenste GC. Buitenste GC doorgaans bruiner dan nieuw gemoult dekveermateriaal. Geen S-rui.',

  VJ +
  '**3e kj [7 vj]** (= vorig najaar: 2e kj [5 herfst])\n' +
  'Aangehouden juv PC puntiger, smaller, duidelijk bruiner en meer versleten dan verse veren. Soms aangehouden juv S meer versleten en gebleekt; lijn van witte vlekken op S-punten niet recht.',

  VJ +
  '**4e kj [9 vj]** (= vorig najaar: 3e kj [7 herfst])\n' +
  'Sommige vogels te onderscheiden als juv PC aangehouden (puntiger, smaller, bruiner). Let op: adult kan ook PC aanhouden over 2 opeenvolgende ruien; resultaat onzeker.',

  VJ +
  '**Adult [6]**\n' +
  'Alle PC egaal glanzend zwart. Kroon zwart. P2 t/m P5 (P6) zonder witte punt. P1 steekt 3–5 mm boven de PC uit (P1–WP = 75–88).',

].join('\n\n');

const newData = {
  ...row.data,
  leeftijds_notities_vj,
  leeftijds_notities_nj: '',
};

const { error } = await sb.from('species').upsert({
  euring_code: row.euring_code,
  naam_nl: row.naam_nl,
  data: newData,
});

if (error) { console.error('Upsert mislukt:', error.message); process.exit(1); }
console.log('✓ Grote Bonte Specht — elke alinea nu voorzien van seizoensmarker');
