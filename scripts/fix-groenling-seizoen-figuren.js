/**
 * fix-groenling-seizoen-figuren.js
 * Corrigeert de Groenling (EURING 16490):
 * - {{06-11}} → {{07-12}}  (was overlap met VJ-tab)
 * - {{01-05}} → {{01-06}}
 * - Figuurverwijzingen verwijderd uit geslacht_notities
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
  .eq('euring_code', '16490')
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }

const d = { ...row.data };

// ── Leeftijdsblokken: seizoengrenzen corrigeren ──────────────────────────
d.leeftijds_notities_vj = d.leeftijds_notities_vj
  .replace('{{06-11}}', '{{07-12}}')
  .replace('{{01-05}}', '{{01-06}}');

// ── Geslacht: figuurverwijzingen verwijderen ─────────────────────────────
d.geslachts_notities_m = d.geslachts_notities_m
  .replace(' (zie fig. 4 Demongin)', '');

d.geslachts_notities_f = d.geslachts_notities_f
  .replace(' (zie fig. 4 Demongin)', '');

const { error } = await sb.from('species').upsert({
  euring_code: row.euring_code,
  naam_nl: row.naam_nl,
  data: d,
});

if (error) { console.error('Upsert mislukt:', error.message); process.exit(1); }
console.log('✓ Groenling seizoenblokken en figuurverwijzingen gecorrigeerd');
