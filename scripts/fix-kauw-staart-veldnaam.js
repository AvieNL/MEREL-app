/**
 * fix-kauw-staart-veldnaam.js
 * Verplaatst bio_staart_* naar bio_staartlengte_* (correcte veldnaam voor SoortDetail).
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

const d = { ...row.data };

// Verwijder foutieve veldnamen en voeg correcte toe
delete d.bio_staart_M_min;
delete d.bio_staart_M_max;
delete d.bio_staart_F_min;
delete d.bio_staart_F_max;

d.bio_staartlengte_M_min = '116';
d.bio_staartlengte_M_max = '146';
d.bio_staartlengte_F_min = '109';
d.bio_staartlengte_F_max = '139';

const { error } = await sb.from('species').upsert({
  euring_code: row.euring_code,
  naam_nl: row.naam_nl,
  data: d,
});

if (error) { console.error('Upsert mislukt:', error.message); process.exit(1); }
console.log('✓ Kauw staartlengte veldnaam gecorrigeerd (bio_staartlengte_*)');
