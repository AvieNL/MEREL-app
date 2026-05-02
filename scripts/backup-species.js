/**
 * backup-species.js
 * Exporteert de volledige species-tabel naar scripts/backups/species-DATUM.json
 *
 * Gebruik: node scripts/backup-species.js
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Zet VITE_SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY);

async function backup() {
  console.log('Ophalen species-tabel...');
  let all = [], from = 0;
  while (true) {
    const { data, error } = await sb.from('species').select('naam_nl, data').range(from, from + 999);
    if (error) { console.error('Fout:', error.message); process.exit(1); }
    if (!data?.length) break;
    all = all.concat(data);
    process.stdout.write(`\r  ${all.length} rijen opgehaald...`);
    if (data.length < 1000) break;
    from += 1000;
  }
  console.log(`\nTotaal: ${all.length} soorten`);

  const backupDir = join(__dirname, 'backups');
  mkdirSync(backupDir, { recursive: true });

  const datum = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const bestand = join(backupDir, `species-${datum}.json`);
  writeFileSync(bestand, JSON.stringify(all, null, 2), 'utf8');
  console.log(`Backup opgeslagen: ${bestand}`);
}

backup();
