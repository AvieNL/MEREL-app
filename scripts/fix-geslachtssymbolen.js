/**
 * fix-geslachtssymbolen.js
 * Voegt overal de letter M of V toe achter ♂/♀ als die nog ontbreekt.
 * Geldt voor: Pimpelmees (14620) en Grote Bonte Specht (08760).
 * Velden: geslachts_notities_m/f, leeftijds_notities_vj, determinatie_id_notities, vangst_checklist.
 *
 * Regel: ♂ → ♂ M  |  ♀ → ♀ V  (alleen als er nog geen M/V direct achteraan staat)
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * Voegt M/V toe achter ♂/♀ als de letter er nog niet achter staat.
 * Bestaande "♂ M" of "♀ V" worden niet dubbeld.
 */
function fixSymbolen(tekst) {
  if (typeof tekst !== 'string') return tekst;
  // ♂ niet gevolgd door spatie+M of direct M → ♂ M
  tekst = tekst.replace(/♂(?! ?M)/g, '♂ M');
  // ♀ niet gevolgd door spatie+V of direct V → ♀ V
  tekst = tekst.replace(/♀(?! ?V)/g, '♀ V');
  return tekst;
}

function fixVeld(waarde) {
  if (Array.isArray(waarde)) {
    return waarde.map(item => {
      if (typeof item === 'string') return fixSymbolen(item);
      if (typeof item === 'object' && item !== null) {
        return Object.fromEntries(
          Object.entries(item).map(([k, v]) => [k, typeof v === 'string' ? fixSymbolen(v) : v])
        );
      }
      return item;
    });
  }
  return fixSymbolen(waarde);
}

const EURING_CODES = ['14620', '08760'];
const VELDEN = [
  'geslachts_notities_m',
  'geslachts_notities_f',
  'leeftijds_notities_vj',
  'leeftijds_notities_nj',
  'determinatie_id_notities',
  'vangst_checklist',
];

const { data: rows, error: fetchErr } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .in('euring_code', EURING_CODES);

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }

for (const row of rows) {
  const newData = { ...row.data };
  let gewijzigd = false;

  for (const veld of VELDEN) {
    if (row.data[veld] === undefined) continue;
    const oud = JSON.stringify(row.data[veld]);
    const nieuw = fixVeld(row.data[veld]);
    if (JSON.stringify(nieuw) !== oud) {
      newData[veld] = nieuw;
      gewijzigd = true;
      console.log(`  ${row.naam_nl} — ${veld}: symbolen bijgewerkt`);
    }
  }

  if (!gewijzigd) {
    console.log(`  ${row.naam_nl} — geen wijzigingen nodig`);
    continue;
  }

  const { error } = await sb.from('species').upsert({
    euring_code: row.euring_code,
    naam_nl: row.naam_nl,
    data: newData,
  });

  if (error) { console.error(`Upsert mislukt (${row.naam_nl}):`, error.message); process.exit(1); }
  console.log(`  ✓ ${row.naam_nl} opgeslagen`);
}

console.log('\n✓ Geslachtssymbolen bijgewerkt');
