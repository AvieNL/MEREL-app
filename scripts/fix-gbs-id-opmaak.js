/**
 * fix-gbs-id-opmaak.js
 * Herstelt de opmaak van determinatie_id_notities voor de Grote Bonte Specht (08760):
 * - Enkele \n na kop → \n\n zodat Markdown dit als aparte paragraaf rendert (geen <br>)
 * - "Aberrante vogels" → "Afwijkende vogels"
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

// Haal het huidige veld op en herstel de opmaak:
// 1. Elke kop (**...**) gevolgd door \n wordt \n\n
// 2. "Aberrante vogels" → "Afwijkende vogels"
let tekst = row.data.determinatie_id_notities;

// Stap 1: kop + enkele newline → kop + dubbele newline
tekst = tekst.replace(/(\*\*[^\n]+\*\*)\n(?!\n)/g, '$1\n\n');

// Stap 2: term verbeteren
tekst = tekst.replace(/Aberrante vogels/g, 'Afwijkende vogels');

const newData = { ...row.data, determinatie_id_notities: tekst };

const { error } = await sb.from('species').upsert({
  euring_code: row.euring_code,
  naam_nl: row.naam_nl,
  data: newData,
});

if (error) { console.error('Upsert mislukt:', error.message); process.exit(1); }
console.log('✓ Grote Bonte Specht — ID-kenmerken opmaak hersteld');
console.log('\nResultaat determinatie_id_notities:\n');
console.log(tekst);
