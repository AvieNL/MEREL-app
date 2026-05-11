/**
 * fix-rui-notities-opmaak.js
 * Verwijder lege regel tussen leeftijdskop en rui-beschrijving in rui_notities.
 * Correct formaat: **kop** tekst (inline, zelfde regel)
 * Fout formaat:   **kop**\n\ntekst (blank line ertussen)
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Roek heeft afwijkend formaat (ingesprongen tabel) — herschrijf naar proza
const ROEK_RUI = [
  '**1e kj (3)** Gedeeltelijke najeugdrui jun–sep. Omvat lichaamsveren, vrijwel alle LC, geen tot vrijwel alle MC, soms enkele binnenste GC, uitzonderlijk alula, enkele P of TF. Zwarte gezichtsveren ruien nov (jan)–mrt (apr); vervangen door korte donkergrijze schacht vrijwel zonder baarden.',
  '**na 1e kj / na 2e kj (4/6)** Volledige nabroederui mei–jun (vroeg jul) tot aug–okt.',
].join('\n\n');

// Eenvoudige regex voor GBS, Pimpelmees, Koolmees: **kop**\n\n → **kop**
function fixBlankeRegel(tekst) {
  return tekst.replace(/(\*\*[^*\n]+\*\*)\n\n/g, '$1 ');
}

const patches = [
  { code: '08760', naam: 'Grote Bonte Specht', fn: fixBlankeRegel },
  { code: '14620', naam: 'Pimpelmees',         fn: fixBlankeRegel },
  { code: '14640', naam: 'Koolmees',           fn: fixBlankeRegel },
  { code: '15630', naam: 'Roek',               fn: () => ROEK_RUI },
];

for (const { code, naam, fn } of patches) {
  const { data: row, error: fetchErr } = await sb
    .from('species')
    .select('euring_code, naam_nl, data')
    .eq('euring_code', code)
    .single();

  if (fetchErr) { console.error(`Ophalen mislukt (${naam}):`, fetchErr.message); continue; }

  const oud = row.data.rui_notities ?? '';
  const nieuw = fn(oud);

  if (oud === nieuw) {
    console.log(`  (ongewijzigd) ${naam}`);
    continue;
  }

  const newData = { ...row.data, rui_notities: nieuw };
  const { error: upsertErr } = await sb.from('species').upsert({
    euring_code: row.euring_code,
    naam_nl:     row.naam_nl,
    data:        newData,
  });

  if (upsertErr) { console.error(`Upsert mislukt (${naam}):`, upsertErr.message); continue; }
  console.log(`✓ ${naam} (${code}) — rui_notities opmaak gecorrigeerd`);
}

console.log('\nKlaar.');
