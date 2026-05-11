import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const { data, error } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .eq('euring_code', '15630')
  .single();

if (error) { console.error(error.message); process.exit(1); }

console.log('naam_nl:', data.naam_nl);
console.log('euring_code:', data.euring_code);
console.log('Keys in data blob:', JSON.stringify(Object.keys(data.data), null, 2));
console.log('\nFull data blob:');
console.log(JSON.stringify(data.data, null, 2));
