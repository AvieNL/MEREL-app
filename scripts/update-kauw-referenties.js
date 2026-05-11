/**
 * update-kauw-referenties.js
 * Voegt referenties toe aan de Kauw (EURING 15600).
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
  .eq('euring_code', '15600')
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }

const newData = {
  ...row.data,
  referenties_literatuur: [
    'Blasco-Zumeta & Heinze (2013)',
    'Crouzier et al. (1999)',
    'Demongin (2016)',
    'Fisher (1986)',
    'Goodwin (1986)',
    'Harrop (2000)',
    'Henderson (1991)',
    'Leader (2003)',
    'Madge (1994)',
    'Madge & Burn (1996)',
    'Offereins (2004)',
  ],
};

const { error } = await sb.from('species').upsert({
  euring_code: row.euring_code,
  naam_nl: row.naam_nl,
  data: newData,
});

if (error) { console.error('Upsert mislukt:', error.message); process.exit(1); }
console.log('✓ Kauw referenties toegevoegd:', newData.referenties_literatuur.length, 'items');
