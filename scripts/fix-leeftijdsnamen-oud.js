/**
 * fix-leeftijdsnamen-oud.js
 * Brengt leeftijdskoppen van Houtduif, Bonte Vliegenvanger, Kauw en Roek
 * op het nieuwe formaat: Nederlandse naam (EURING code), geen "Adult".
 * Tevens: Pimpelmees determinatie_id_notities — <br> fix (enkelvoudige \n → \n\n).
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// ─── Vervangingen per soort ───────────────────────────────────────────────────

const VERVANGINGEN = {

  // Houtduif (06700)
  '06700': [
    ['**Juveniel (EURING 3J) — zomer/vroege herfst:**',  '**1e kj, deels in jeugdkleed (3J) — zomer/vroege herfst:**'],
    ['**1e kj (EURING 3) — herfst:**',                   '**1e kj (3) — herfst:**'],
    ['**2e kj (EURING 5) — herfst:**',                   '**2e kj (5) — herfst:**'],
    ['**Adult (EURING 4) — herfst:**',                   '**na 1e kj (4) — herfst:**'],
    ['**2e kj (EURING 5) — voorjaar:**',                 '**2e kj (5) — voorjaar:**'],
    ['**Adult (EURING 6) — voorjaar:**',                 '**na 2e kj (6) — voorjaar:**'],
  ],

  // Bonte Vliegenvanger (13490)
  '13490': [
    ['**1e kj (EURING 3) — herfst:**',                   '**1e kj (3) — herfst:**'],
    ['**Adult (EURING 4) — herfst:**',                   '**na 1e kj (4) — herfst:**'],
    ['**2e kj ♂ M (EURING 5 M) — voorjaar:**',          '**2e kj ♂ M (5) — voorjaar:**'],
    ['**2e kj ♀ V (EURING 5 F) — voorjaar:**',          '**2e kj ♀ V (5) — voorjaar:**'],
    ['**Adult ♂ M (EURING 6 M):**',                     '**na 2e kj ♂ M (6):**'],
    ['**Adult ♀ V (EURING 6 F):**',                     '**na 2e kj ♀ V (6):**'],
  ],

  // Kauw (15600)
  '15600': [
    ['**1e kj (EURING 3) — na uitvliegen (zomer):**',   '**1e kj (3) — na uitvliegen (zomer):**'],
    ['**1e kj (EURING 3) — herfst en winter:**',         '**1e kj (3) — herfst en winter:**'],
    ['**2e kj lente (EURING 5):**',                      '**2e kj (5) — lente:**'],
    ['**Adult (EURING 4/6):**',                          '**na 1e kj / na 2e kj (4/6):**'],
  ],

  // Roek (15630)
  '15630': [
    ['**1e kj (EURING 3):**',                            '**1e kj (3):**'],
    ['**2e kj (EURING 5):**',                            '**2e kj (5):**'],
    ['**3e kj (EURING 7):**',                            '**3e kj (7):**'],
    ['**Adult (2e kj) (EURING 6):**',                    '**na 2e kj (6):**'],
    ['**Adult (na 1e kj) (EURING 4):**',                 '**na 1e kj (4):**'],
  ],

};

// ─── Pimpelmees — <br> fix ────────────────────────────────────────────────────
// Elke boldkop (eventueel met inline tekst erna) gevolgd door enkele \n → \n\n

function fixBrTags(tekst) {
  // **...** of **...** _tekst_ of **...** (tekst) gevolgd door \n maar niet \n\n
  return tekst.replace(/(\*\*[^\n]*\*\*[^\n]*)\n(?!\n)/g, '$1\n\n');
}

// ─── Verwerking ───────────────────────────────────────────────────────────────

const codes = [...Object.keys(VERVANGINGEN), '14620'];

const { data: rows, error: fetchErr } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .in('euring_code', codes);

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }

for (const row of rows) {
  const newData = { ...row.data };
  let gewijzigd = false;

  // Leeftijdsnamen
  if (VERVANGINGEN[row.euring_code]) {
    let tekst = row.data.leeftijds_notities_vj || '';
    for (const [oud, nieuw] of VERVANGINGEN[row.euring_code]) {
      if (tekst.includes(oud)) {
        tekst = tekst.replaceAll(oud, nieuw);
        console.log(`  ${row.naam_nl} — vervangen: ${oud.slice(0, 50)}…`);
        gewijzigd = true;
      } else {
        console.log(`  ${row.naam_nl} — NIET gevonden (al ok?): ${oud.slice(0, 50)}…`);
      }
    }
    if (gewijzigd) newData.leeftijds_notities_vj = tekst;
  }

  // Pimpelmees <br> fix
  if (row.euring_code === '14620') {
    const oud = row.data.determinatie_id_notities || '';
    const nieuw = fixBrTags(oud);
    if (nieuw !== oud) {
      newData.determinatie_id_notities = nieuw;
      gewijzigd = true;
      console.log(`  ${row.naam_nl} — <br> fix toegepast op determinatie_id_notities`);
    } else {
      console.log(`  ${row.naam_nl} — determinatie_id_notities: geen <br> gevonden`);
    }
  }

  if (!gewijzigd) {
    console.log(`  ${row.naam_nl} — niets gewijzigd\n`);
    continue;
  }

  const { error } = await sb.from('species').upsert({
    euring_code: row.euring_code,
    naam_nl: row.naam_nl,
    data: newData,
  });
  if (error) { console.error(`  Upsert mislukt (${row.naam_nl}):`, error.message); process.exit(1); }
  console.log(`  ✓ ${row.naam_nl} opgeslagen\n`);
}

console.log('✓ Klaar');
