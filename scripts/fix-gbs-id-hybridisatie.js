/**
 * fix-gbs-id-hybridisatie.js
 * Voegt de ontbrekende hybridisatie- en aberrantietekst toe aan
 * determinatie_id_notities van de Grote Bonte Specht (08760).
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

const determinatie_id_notities =
  row.data.determinatie_id_notities +
  '\n\n' +
  '**Aberrante vogels**\n' +
  'Zelden: donkere strepen op zijborst en flanken; juvenielen met vaag donker geband wit op scapulars en licht rood stuit (gelijkend op Witrugspecht); zeer weinig witte vlekken op handpennen en armpennen; melanistische vogels.\n\n' +
  '**Hybridisatie**\n' +
  'Hybridisatie met Syrische Specht komt voor (uiterlijk vaak als Syrische Specht, maar onderstaartdekveren helder rood en witte vlekken op slagpennen intermediair tussen beide soorten). Hybridisatie mogelijk met Middelste Bonte Specht, Witrugspecht en Witvleugelspecht _D. leucopterus_.';

const newData = { ...row.data, determinatie_id_notities };

const { error } = await sb.from('species').upsert({
  euring_code: row.euring_code,
  naam_nl: row.naam_nl,
  data: newData,
});

if (error) { console.error('Upsert mislukt:', error.message); process.exit(1); }
console.log('✓ Grote Bonte Specht — hybridisatietekst toegevoegd aan ID-kenmerken');
