/**
 * fix-pimpelmees-leeftijd-namen.js
 * Past de leeftijdstekst van de Pimpelmees (14620) aan:
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
  .eq('euring_code', '14620')
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }

const NJ = '{{07-12}}\n';
const VJ = '{{01-06}}\n';

const leeftijds_notities_vj = [

  NJ +
  '**1e kj, deels in jeugdkleed (3J)** — vóór postjuv-rui\n' +
  'Wangen duidelijk lichtgeel. Kroon dof blauwgrijs.',

  NJ +
  '**1e kj (3)** — in/na postjuv-rui → in jan: 2e kj (5)\n' +
  'Juv PC dof blauwgrijs, vaak licht groenig getint, contrasterend met helder blauwe gemoulte GC op buitenweb. Soms contrast tussen juv buitenste GC en gemoulte binnenste GC, of tussen gemoulte alula/CC en juv PC. Wangen tijdens en kort na de rui nog licht geel. TF vaak meer versleten dan bij na 1e kj (4); TF1 vaak gemoult en meer afgerond. Soms ruigrens in T en S.\n' +
  'Let op: bij sommige populaties kan slijtage het contrast onbruikbaar maken.',

  NJ +
  '**na 1e kj (4)**\n' +
  'Buitenweb van GC, PC, CC en alula gelijkmatig helder blauw; soms licht kleurverschil tussen PC en GC. Geen ruigrens in T, TE of S.',

  VJ +
  '**2e kj (5)** (= vorig najaar: 1e kj (3))\n' +
  'Juv PC dof blauwgrijs, vaak licht groenig getint, contrasterend met helder blauwe gemoulte GC op buitenweb. Soms contrast tussen juv buitenste GC en gemoulte binnenste GC, of tussen gemoulte alula/CC en juv PC. TF vaak meer versleten dan bij na 2e kj (6); TF1 vaak gemoult en meer afgerond. Soms ruigrens in T en S.\n' +
  'Let op: bij sommige populaties kan slijtage het contrast onbruikbaar maken.',

  VJ +
  '**na 2e kj (6)**\n' +
  'Buitenweb van GC, PC, CC en alula gelijkmatig helder blauw. Geen ruigrens in T, TE of S.',

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
console.log('✓ Pimpelmees — leeftijdsnamen bijgewerkt (Nederlandse naam + EURING-code)');
console.log('\nResultaat:\n');
console.log(leeftijds_notities_vj);
