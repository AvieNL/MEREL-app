/**
 * EURING soortendatabase importscript
 *
 * Gebruik: node scripts/import-euring.mjs [pad-naar-csv]
 * Standaard CSV-pad: docs/euring-species.csv
 *
 * Logica:
 *  - Alleen rijen met Status = 'sp' worden verwerkt
 *  - Match op naam_lat (case-insensitive) met bestaande Supabase-soorten
 *  - Match gevonden  → euring_code bijwerken in bestaand data-object
 *  - Geen match      → nieuwe entry aanmaken (naam_nl = naam_lat = Current_Name)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ── Config ────────────────────────────────────────────────────────────────────

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT  = resolve(__dir, '..');

// Lees .env.local handmatig (geen dotenv vereist)
function loadEnv() {
  try {
    const raw = readFileSync(resolve(ROOT, '.env.local'), 'utf8');
    const env = {};
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([^#=\s]+)\s*=\s*(.+?)\s*$/);
      if (m) env[m[1]] = m[2];
    }
    return env;
  } catch {
    return {};
  }
}

const env    = loadEnv();
const URL_SB     = env.VITE_SUPABASE_URL         || process.env.VITE_SUPABASE_URL;
const KEY_SB     = env.VITE_SUPABASE_SERVICE_KEY  || process.env.VITE_SUPABASE_SERVICE_KEY
                || env.VITE_SUPABASE_ANON_KEY    || process.env.VITE_SUPABASE_ANON_KEY;

if (!URL_SB || !KEY_SB) {
  console.error('Fout: VITE_SUPABASE_URL en VITE_SUPABASE_SERVICE_KEY (of ANON_KEY) zijn vereist.');
  process.exit(1);
}

const isServiceKey = KEY_SB.includes('"role":"service_role"') ||
  (() => { try { return JSON.parse(atob(KEY_SB.split('.')[1])).role === 'service_role'; } catch { return false; } })();

if (!isServiceKey) {
  console.warn('Waarschuwing: geen service_role key gevonden. Voeg VITE_SUPABASE_SERVICE_KEY toe aan .env.local om RLS te omzeilen.\n');
}

const supabase = createClient(URL_SB, KEY_SB);

// ── CSV-parser ────────────────────────────────────────────────────────────────

function parseCSV(text) {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim());

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Eenvoudige CSV-parse (geen quotes met komma's in EURING-data)
    const values = line.split(',');
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = (values[idx] ?? '').trim();
    });
    rows.push(row);
  }
  return rows;
}

// ── Supabase: haal alle soorten op ───────────────────────────────────────────

async function fetchAllSpecies() {
  const PAGE = 1000;
  let offset = 0;
  const all  = [];

  while (true) {
    const { data, error } = await supabase
      .from('species')
      .select('naam_nl, data')
      .range(offset, offset + PAGE - 1);

    if (error) throw new Error(`Supabase fetch fout: ${error.message}`);
    if (!data || data.length === 0) break;

    all.push(...data);
    if (data.length < PAGE) break;
    offset += PAGE;
  }

  return all;
}

// ── Hoofd ─────────────────────────────────────────────────────────────────────

async function main() {
  const csvPath = process.argv[2]
    ? resolve(process.argv[2])
    : resolve(ROOT, 'docs', 'euring-species.csv');

  console.log(`CSV: ${csvPath}`);

  let csvText;
  try {
    csvText = readFileSync(csvPath, 'utf8');
  } catch {
    console.error(`Kan CSV niet lezen: ${csvPath}`);
    process.exit(1);
  }

  const rows = parseCSV(csvText);
  const INCLUDE_STATUSES = new Set(['sp', 'ssp', 'h', 'a', 'f']);
  const spRows = rows.filter(r => INCLUDE_STATUSES.has(r.Status));
  console.log(`EURING CSV: ${rows.length} rijen totaal, ${spRows.length} met Status=sp/ssp/h/a/f\n`);

  // Haal alle bestaande soorten op
  console.log('Supabase soorten ophalen...');
  const existing = await fetchAllSpecies();
  console.log(`${existing.length} soorten gevonden in Supabase\n`);

  // Bouw lookup: naam_lat.toLowerCase() → bestaande rij
  const byLat = new Map();
  for (const row of existing) {
    const lat = row.data?.naam_lat;
    if (lat) byLat.set(lat.toLowerCase(), row);
  }

  // Verwerk EURING-rijen
  const upserts  = [];  // { naam_nl, data }
  let matched    = 0;
  let newEntries = 0;
  let skipped    = 0;

  for (const r of spRows) {
    const euringCode = r.EURING_Code?.trim();
    const latinName  = r.Current_Name?.trim();
    const englishName = r.English_Name?.trim() || '';

    if (!euringCode || !latinName) {
      skipped++;
      continue;
    }

    const key = latinName.toLowerCase();
    const match = byLat.get(key);

    if (match) {
      // Bestaande soort: voeg euring_code toe aan data
      const updated = { ...match.data, euring_code: euringCode };
      upserts.push({ naam_nl: match.naam_nl, data: updated });
      matched++;
    } else {
      // Nieuwe soort: maak minimale entry aan
      const newData = {
        naam_nl:    latinName,
        naam_lat:   latinName,
        naam_en:    englishName,
        naam_de:    '',
        euring_code: euringCode,
      };
      upserts.push({ naam_nl: latinName, data: newData });
      newEntries++;
    }
  }

  // Dedupliceer op naam_nl (laatste wint bij conflict)
  const upsertMap = new Map();
  for (const u of upserts) upsertMap.set(u.naam_nl, u);
  const deduped = [...upsertMap.values()];

  console.log(`Resultaat:`);
  console.log(`  Gekoppeld (update):  ${matched}`);
  console.log(`  Nieuw (insert):      ${newEntries}`);
  console.log(`  Overgeslagen:        ${skipped}`);
  console.log(`  Duplicaten verwijderd: ${upserts.length - deduped.length}`);
  console.log(`  Totaal te upserten:  ${deduped.length}\n`);

  if (deduped.length === 0) {
    console.log('Niets te doen.');
    return;
  }

  // Upsert in batches van 500
  const BATCH = 500;
  let done = 0;

  for (let i = 0; i < deduped.length; i += BATCH) {
    const batch = deduped.slice(i, i + BATCH);
    const { error } = await supabase
      .from('species')
      .upsert(batch, { onConflict: 'naam_nl' });

    if (error) {
      console.error(`Batch ${i}–${i + batch.length} mislukt: ${error.message}`);
      process.exit(1);
    }

    done += batch.length;
    process.stdout.write(`\rUpsert voortgang: ${done}/${deduped.length}`);
  }

  console.log('\n\nKlaar!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
