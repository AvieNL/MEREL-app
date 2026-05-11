/**
 * update-kauw-biometrie-spermologus.js
 * Vervangt de biometriematen van de Kauw (EURING 15600) door maten van
 * ssp. spermologus (in NL meest voorkomende ondersoort).
 * Bron: Demongin (2020) p.347–348.
 *
 * Gebruik: node scripts/update-kauw-biometrie-spermologus.js
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
console.log('Soort:', row.naam_nl);

const updates = {
  // Biometrie ssp. spermologus — Demongin (2020) p.347–348
  bio_vleugel_M_min: '228',
  bio_vleugel_M_max: '255',
  bio_vleugel_F_min: '212',
  bio_vleugel_F_max: '247',

  bio_staart_M_min: '116',
  bio_staart_M_max: '146',
  bio_staart_F_min: '109',
  bio_staart_F_max: '139',

  bio_snavel_schedel_M_min: '34.1',
  bio_snavel_schedel_M_max: '40.1',
  bio_snavel_schedel_F_min: '31.2',
  bio_snavel_schedel_F_max: '38.2',

  bio_snavel_diepte_mid_M_min: '13.2',
  bio_snavel_diepte_mid_M_max: '14.8',
  bio_snavel_diepte_mid_F_min: '12.4',
  bio_snavel_diepte_mid_F_max: '13.9',

  bio_tarsus_lengte_M_min: '41.4',
  bio_tarsus_lengte_M_max: '50.0',
  bio_tarsus_lengte_F_min: '39.0',
  bio_tarsus_lengte_F_max: '47.7',

  bio_gewicht_M_min: '192',
  bio_gewicht_M_max: '260',
  bio_gewicht_F_min: '179',
  bio_gewicht_F_max: '240',

  // Bron-noot: zichtbaar naast de biometrietitel op de soortenpagina
  bron_biometrie: 'Demongin (2020) p.347–348 — maten van ssp. spermologus (in NL meest voorkomend)',

  // Vangst-checklist: snavelhoogte bijgewerkt naar spermologus-maten
  vangst_checklist: [
    { label: 'Vleugel', type: 'meting', belang: 3, note: 'Hoofdmaat; bij bekende populatie nuttig voor geslacht' },
    { label: 'Snavel tot schedel', type: 'meting', belang: 2, note: 'Bij bekende populatie nuttig voor geslacht' },
    { label: 'Snavelhoogte neusgat', type: 'meting', belang: 2, note: '♂ M 13,2–14,8 mm · ♀ V 12,4–13,9 mm (ssp. spermologus)' },
    { label: 'Tarsus', type: 'meting', belang: 1 },
    { label: 'Gewicht', type: 'meting', belang: 2 },
    { label: 'Iriskleur', type: 'obs', belang: 3, note: 'Blauwgrijs=juv · Bruin=1kj · Variabel=2kj · Wit=adult' },
    { label: 'Broedvlek', type: 'obs', belang: 3, note: 'Aanwezig = zeker ♀ V; let op: ♂ M kan kleine BP op buik hebben' },
  ],
};

const newData = { ...row.data, ...updates };

const { error: upsertErr } = await sb.from('species').upsert({
  euring_code: row.euring_code,
  naam_nl: row.naam_nl,
  data: newData,
});

if (upsertErr) { console.error('Upsert mislukt:', upsertErr.message); process.exit(1); }

console.log('✓ Kauw biometrie bijgewerkt naar ssp. spermologus');
console.log('  Bijgewerkte velden:', Object.keys(updates).join(', '));
