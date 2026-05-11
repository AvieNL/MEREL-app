/**
 * fix-ruitiming-leeftijdsnamen.js
 * Brengt leeftijdslabels in rui_notities op het nieuwe formaat:
 * - [X] → (X) in vette koppen
 * - "Juveniel" → "1e kj"
 * - "Adult" → "na 1e kj" / "na 2e kj" (afhankelijk van code)
 * - Roek: plain-tekst koppen → vetgedrukte Markdown koppen
 * - \n na vette kop → \n\n (voorkomt <br> in renderer)
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// ─── Gerichte vervangingen per soort ─────────────────────────────────────────

const VERVANGINGEN = {

  '06700': [ // Houtduif
    ['**Juveniel [3]**', '**1e kj (3)**'],
    ['**Adult [4/6]**',  '**na 1e kj / na 2e kj (4/6)**'],
  ],

  '08760': [ // Grote Bonte Specht
    ['**Juveniel [3]**', '**1e kj (3)**'],
    ['**2e kj [5]**',    '**2e kj (5)**'],
    ['**3e kj [7]**',    '**3e kj (7)**'],
    ['**Adult [6]**',    '**na 2e kj (6)**'],
  ],

  '13490': [ // Bonte Vliegenvanger
    ['**Juveniel [3]**', '**1e kj (3)**'],
    ['**Adult [4/6]**',  '**na 1e kj / na 2e kj (4/6)**'],
  ],

  '14620': [ // Pimpelmees
    ['**Juveniel [3]**', '**1e kj (3)**'],
    ['**Adult [4]**',    '**na 1e kj (4)**'],
  ],

  '15600': [ // Kauw
    ['**Juveniel [3]**', '**1e kj (3)**'],
    ['**Adult [4]**',    '**na 1e kj (4)**'],
  ],

  '15630': [ // Roek — plain-tekst koppen → Markdown vet
    ['1e kj (EURING 3) — Gedeeltelijke najeugdrui:',        '**1e kj (3) — Gedeeltelijke najeugdrui:**'],
    ['Adult (EURING 4/6) — Volledige nabroederui:',         '**na 1e kj / na 2e kj (4/6) — Volledige nabroederui:**'],
  ],

};

// ─── \n-fix: na vette kop altijd \n\n ────────────────────────────────────────

function fixEnkeleNewlines(tekst) {
  // **...** gevolgd door \n maar niet \n\n → \n\n
  return tekst.replace(/(\*\*[^\n]*\*\*)\n(?!\n)/g, '$1\n\n');
}

// ─── Verwerking ───────────────────────────────────────────────────────────────

const codes = Object.keys(VERVANGINGEN);

const { data: rows, error } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .in('euring_code', codes);

if (error) { console.error('Ophalen mislukt:', error.message); process.exit(1); }

for (const row of rows) {
  const newData = { ...row.data };
  let gewijzigd = false;

  let tekst = row.data.rui_notities || '';
  if (!tekst) { console.log(`  ${row.naam_nl} — geen rui_notities\n`); continue; }

  // Gerichte vervangingen
  for (const [oud, nieuw] of VERVANGINGEN[row.euring_code]) {
    if (tekst.includes(oud)) {
      tekst = tekst.replaceAll(oud, nieuw);
      console.log(`  ${row.naam_nl}: "${oud.slice(0, 50)}" → "${nieuw.slice(0, 50)}"`);
      gewijzigd = true;
    }
  }

  // \n-fix
  const na = fixEnkeleNewlines(tekst);
  if (na !== tekst) {
    tekst = na;
    gewijzigd = true;
    console.log(`  ${row.naam_nl}: \\n → \\n\\n na vette koppen`);
  }

  if (!gewijzigd) { console.log(`  ${row.naam_nl} — niets te wijzigen\n`); continue; }

  newData.rui_notities = tekst;

  const { error: upsertErr } = await sb.from('species').upsert({
    euring_code: row.euring_code,
    naam_nl: row.naam_nl,
    data: newData,
  });
  if (upsertErr) { console.error(`  Upsert mislukt (${row.naam_nl}):`, upsertErr.message); process.exit(1); }
  console.log(`  ✓ ${row.naam_nl} opgeslagen\n`);
}

console.log('✓ Klaar');
