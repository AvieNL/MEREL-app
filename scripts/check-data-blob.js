import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const { data, error } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .eq('naam_nl', 'Merel')
  .single();

if (error) { console.error(error.message); process.exit(1); }

// Toon alle keys in de blob
console.log('Keys in data blob:', JSON.stringify(Object.keys(data.data)));
console.log('');
// Toon de eerste paar waarden
const blob = data.data;
for (const k of Object.keys(blob).slice(0, 15)) {
  const v = blob[k];
  const display = typeof v === 'object' ? JSON.stringify(v).slice(0, 60) : String(v).slice(0, 60);
  console.log(`  ${k}: ${display}`);
}
