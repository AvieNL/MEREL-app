/**
 * fix-vergelijking-tabel-blok.js
 * Herstelt de tabelblokken in determinatie_id_notities voor Pimpelmees (14620)
 * en Grote Bonte Specht (08760).
 *
 * renderIDKenmerken() splitst op \n\n en verwacht dat **Vergelijking ...:**
 * en alle tabelrijen in hetzelfde blok staan (gescheiden door \n).
 * Door de fixBrTags-fix was daar \n\n van gemaakt, waardoor het titelblok
 * leeg werd en de tabelrijen als plain tekst met <br> gerenderd werden.
 *
 * Fix: **Vergelijking ...:**\n\n| → **Vergelijking ...:**\n|
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const { data: rows, error } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .in('euring_code', ['14620', '08760']);

if (error) { console.error('Ophalen mislukt:', error.message); process.exit(1); }

for (const row of rows) {
  let tekst = row.data.determinatie_id_notities || '';
  if (!tekst) { console.log(`  ${row.naam_nl} — geen determinatie_id_notities`); continue; }

  // Herstel: **Vergelijking...**\n\n| → **Vergelijking...**\n|
  // (alleen de dubbele newline direct na de Vergelijking-titel, vóór een tabelrij)
  const nieuw = tekst.replace(
    /(\*\*Vergelijking [^*]+:\*\*)\n\n(\|)/g,
    '$1\n$2'
  );

  if (nieuw === tekst) {
    console.log(`  ${row.naam_nl} — geen \`\\n\\n|\` gevonden (al ok?)`);
    continue;
  }

  const { error: upsertErr } = await sb.from('species').upsert({
    euring_code: row.euring_code,
    naam_nl: row.naam_nl,
    data: { ...row.data, determinatie_id_notities: nieuw },
  });

  if (upsertErr) { console.error(`  Upsert mislukt (${row.naam_nl}):`, upsertErr.message); process.exit(1); }
  console.log(`  ✓ ${row.naam_nl} — tabelblok hersteld (**Vergelijking...**\\n| i.p.v. \\n\\n|)`);
}

console.log('\n✓ Klaar');
