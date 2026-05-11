/**
 * update-roek-data.js
 * Voegt uitgebreide data toe aan de Roek (EURING 15630) in Supabase.
 * Data gebaseerd op Demongin (2020) p.348–349.
 *
 * Gebruik: node scripts/update-roek-data.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// ─── Lees huidige data op ─────────────────────────────────────────────────────
const { data: row, error: fetchErr } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .eq('euring_code', '15630')
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }
console.log('Huidige naam:', row.naam_nl);

// ─── Nieuwe/bijgewerkte velden ────────────────────────────────────────────────
const updates = {
  // Biometrie — snaveldiepte op schedel (Demongin 2020, p.348)
  bio_snavel_diepte_M_min: '18.7',
  bio_snavel_diepte_M_max: '26.3',
  bio_snavel_diepte_F_min: '17.3',
  bio_snavel_diepte_F_max: '21.9',

  // Geslachtsbepaling
  geslachts_notities_m:
    '**♂ Maten (Demongin 2020 p.348):** vleugel 295–338(347) mm · staart 160–186 mm · ' +
    'snavel tot schedel 56,5–70 mm · snaveldiepte op schedel 18,7–26,3 mm · ' +
    'tarsus 49,2–61 mm · gewicht 405–560(670) g.\n\n' +
    '**Geslachtsindex (adult):** grens = −2,375 × snavellengte + 448,75 mm. ' +
    'Vleugel boven grens → ♂. Gebruik de determinatiehulp voor de exacte berekening.',

  geslachts_notities_f:
    '**♀ Maten (Demongin 2020 p.348):** vleugel 280–320(332) mm · staart 151–177 mm · ' +
    'snavel tot schedel 51–62,2(63) mm · snaveldiepte op schedel 17,3–21,9 mm · ' +
    'tarsus 50–58,8 mm · gewicht 340–500(580) g.\n\n' +
    'Broedvlek is een betrouwbare ♀-indicator.',

  // Leeftijdsbepaling — najaar (jun–dec)
  leeftijds_notities_nj:
    '**1e kj (EURING 3):** Vederpak dof zwartachtig bruin, zonder metaalglans; ' +
    'kin en wangen dicht gevederd; neusgaten bedekt met veren; mondholte vleesroze.\n\n' +
    '**2e kj (EURING 5):** Slagpennen zwartachtig bruin, zwak of slechts sporen metaalglans — ' +
    'contrasterend met vernieuwde kleine en middelste vleugeldekveren; ' +
    'neusgaten nog (gedeeltelijk) bedekt; mondholte roze of bleek.\n\n' +
    '**Adult — na 2e kj (EURING 6+):** Slagpennen zwart met sterk metaalachtige purper-blauwgroene glans, ' +
    'overeenkomend met de vleugeldekveren; neusgaten kaal en bleekgrijs; ' +
    'mondholte blauwachtig zwart; kin en wangen kaal (uitz. pastinator: loren gevederd).\n\n' +
    '*Bron: Demongin (2020) p.348–349; Speek (1994) p.191*',

  // Leeftijdsbepaling — voorjaar (jan–mei)
  leeftijds_notities_vj:
    '**2e kj (EURING 5):** Neusgaten nog (gedeeltelijk) bedekt — tot circa april; ' +
    'slagpennen zwartachtig bruin; deels gevederde kin/wangen; mondholte roze; ' +
    'TF6 ≤ 11–23 mm korter dan TF1.\n\n' +
    '**3e kj (EURING 7):** Sporen van zwarte veren op gezicht (progressief kaalkend); ' +
    'slagpennen glanzend zwart; mondholte blauwachtig zwart.\n\n' +
    '**Na 2e kj — adult (EURING 6+):** Neusgaten kaal en bleekgrijs; slagpennen glanzend zwart; ' +
    'mondholte blauwachtig zwart; TF6 ≤ 18–33 mm korter dan TF1.\n\n' +
    '*Bron: Demongin (2020) p.348–349*',

  // Vleugelformule
  vleugelformule:
    'P1: 8/9(10) boven P2 · P2: 5/6 boven P3\n' +
    'P1 WP: 89–125 mm · P2 WP: 18–41 mm · P3 WP: 0–10 mm · P5 WP: 4–14 mm · P6 WP: 31–47 mm\n' +
    'Uitgerand: P2–P5 · Inkeping: P1–P4\n' +
    'P6 is NIET uitgerand (onderscheid met Zwarte en Bonte Kraai waarbij P6 WEL uitgerand is).',

  // ID-kenmerken ten opzichte van vergelijkbare soorten
  determinatie_id_notities:
    '**Onderscheid met Zwarte Kraai / Bonte Kraai:**\n' +
    '- Snavel rechter (minder gewelfd bovenmandibel).\n' +
    '- Neusgaten bij imm/1e kj bedekt met zwarte veren; bij adult kaal en bleekgrijs.\n' +
    '- Vederpak glanzender (purper/violet-blauw); kopvedering bij adult slanker en meer kaal.\n' +
    '- **P6 NIET uitgerand** bij Roek — bij Zwarte/Bonte Kraai IS P6 uitgerand.\n' +
    '- Lange P1: ≥ 50–72 mm (handig voor snel onderscheid in de hand).\n\n' +
    '*Bron: Demongin (2020) p.348–349*',

  // Nestkastgegevens
  eerste_broedleeftijd: '(2Y) 3Y',

  // Ondersoorten
  ondersoorten:
    '**C. f. frugilegus** — Europa en westelijk/centraal Siberië; neusgaten bij adult kaal en bleekgrijs.\n' +
    '**C. f. pastinator** — Oost-Siberië, China, Japan; loren GEVEDERD bij adult (zeldzaam in NW-Europa).\n' +
    '*Bron: Demongin (2020) p.349*',

  // Bronvermelding biometrie
  bron_biometrie: 'Demongin (2020) p.348',
};

// ─── Merge en upsert ──────────────────────────────────────────────────────────
const newData = { ...row.data, ...updates };

const { error: upsertErr } = await sb.from('species').upsert({
  euring_code: row.euring_code,
  naam_nl: row.naam_nl,
  data: newData,
});

if (upsertErr) {
  console.error('Upsert mislukt:', upsertErr.message);
  process.exit(1);
}

console.log('✓ Roek-data bijgewerkt in Supabase');
console.log('  Nieuwe velden:', Object.keys(updates).join(', '));
