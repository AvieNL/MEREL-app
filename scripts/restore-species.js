/**
 * restore-species.js
 * Zet de species-tabel terug vanuit een backup-bestand.
 *
 * Gebruik: node scripts/restore-species.js scripts/backups/species-DATUM.json
 *
 * LET OP: dit overschrijft de VOLLEDIGE species-tabel in Supabase.
 * Alleen gebruiken bij noodgevallen.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
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

const bestand = process.argv[2];
if (!bestand) {
  console.error('Gebruik: node scripts/restore-species.js <pad-naar-backup.json>');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY);

async function restore() {
  console.log(`Backup laden: ${bestand}`);
  const rows = JSON.parse(readFileSync(bestand, 'utf8'));
  console.log(`${rows.length} soorten gevonden in backup`);

  const bevestig = process.argv[3];
  if (bevestig !== '--ja') {
    console.log('\nDit overschrijft de VOLLEDIGE species-tabel in Supabase.');
    console.log('Voeg --ja toe om te bevestigen:');
    console.log(`  node scripts/restore-species.js ${bestand} --ja`);
    process.exit(0);
  }

  console.log('Restoren...');
  // Verwijder alles en zet de backup terug in batches van 500
  const BATCH = 500;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { error } = await sb.from('species').upsert(batch);
    if (error) { console.error('Fout bij upsert batch', i, ':', error.message); process.exit(1); }
    process.stdout.write(`\r  ${Math.min(i + BATCH, rows.length)}/${rows.length} hersteld...`);
  }
  console.log('\nRestore voltooid.');
}

restore();
