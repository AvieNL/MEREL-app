/**
 * fix-gbs-leeftijd-namen.js
 * Past de leeftijdstekst van de Grote Bonte Specht (08760) aan:
 * - Altijd Nederlandse naam (EURING code) — nooit alleen de code of "Adult"
 * - Gebruik ronde haakjes voor EURING-code
 * Bron: CLAUDE.md EURING leeftijdscodes conventies
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

const NJ = '{{07-12}}\n';
const VJ = '{{01-06}}\n';

const leeftijds_notities_vj = [

  NJ +
  '**1e kj (3)** — vóór postjuv-rui\n' +
  'Kroon dof rood met zwarte rand; nek zwart. Buikzijde en onderstaartdekveren roze of dof rood. P2 t/m P10 met witte of lichtbeige punt; PC breed. P1 steekt 5–12 mm boven de PC uit (P1–WP = 61–74). Let op: bij irrupties (major uit N-Europa) kan de rui traag verlopen waardoor de kroon tot in okt rood blijft.',

  NJ +
  '**na 1e kj (4)** — in/na postjuv-rui → in jan: 2e kj (5)\n' +
  'LC, MC en nieuwe mantelveertjes pas gemoult, contrasterend met doffe, bruinere juv PC en buitenste GC. Buitenste GC doorgaans bruiner dan nieuw gemoult dekveermateriaal. Geen S-rui.',

  NJ +
  '**2e kj (5)** → in jan: 3e kj (7)\n' +
  'Na eerste volledige postbroed-rui: vergelijkbaar met na 2e kj (6), maar aangehouden juv PC puntiger, smaller, duidelijk bruiner en meer versleten. Soms aangehouden juv S meer versleten en gebleekt; lijn van witte vlekken op S-punten niet recht.',

  NJ +
  '**3e kj (7)** → in jan: 4e kj (9)\n' +
  'Vergelijkbaar met na 2e kj (6). Incidenteel 1 of 2 juv PC aangehouden — dan puntiger, smaller en bruiner dan verse PC. Let op: ook vogels ouder dan 3e kj kunnen PC aanhouden over 2 opeenvolgende ruien; niet altijd zeker te onderscheiden.',

  NJ +
  '**na 2e kj (6)**\n' +
  'Alle PC egaal glanzend zwart, zonder contrast. Kroon zwart. P2 t/m P5 (P6) zonder witte punt. P1 steekt 3–5 mm boven de PC uit (P1–WP = 75–88).',

  VJ +
  '**2e kj (5)** (= vorig najaar: na 1e kj (4))\n' +
  'LC, MC en nieuwe mantelveertjes gemoult, contrasterend met doffe en bruinere juv PC en buitenste GC. Buitenste GC doorgaans bruiner dan nieuw gemoult dekveermateriaal. Geen S-rui.',

  VJ +
  '**3e kj (7)** (= vorig najaar: 2e kj (5))\n' +
  'Aangehouden juv PC puntiger, smaller, duidelijk bruiner en meer versleten dan verse veren. Soms aangehouden juv S meer versleten en gebleekt; lijn van witte vlekken op S-punten niet recht.',

  VJ +
  '**4e kj (9)** (= vorig najaar: 3e kj (7))\n' +
  'Sommige vogels te onderscheiden als juv PC aangehouden (puntiger, smaller, bruiner). Let op: ook vogels ouder dan 3e kj kunnen PC aanhouden over 2 opeenvolgende ruien; resultaat onzeker.',

  VJ +
  '**na 2e kj (6)**\n' +
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
console.log('✓ Grote Bonte Specht — leeftijdsnamen bijgewerkt (Nederlandse naam + EURING-code)');
console.log('\nResultaat:\n');
console.log(leeftijds_notities_vj);
