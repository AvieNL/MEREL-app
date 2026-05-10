/**
 * update-houtduif-data.js
 * Voegt uitgebreide data toe aan de Houtduif (EURING 06700) in Supabase.
 * Data gebaseerd op Demongin (2020) p.182–183.
 *
 * Gebruik: node scripts/update-houtduif-data.js
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
  .eq('euring_code', '06700')
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }
console.log('Huidige naam:', row.naam_nl);

// ─── Nieuwe/bijgewerkte velden ────────────────────────────────────────────────
const updates = {
  // Biometrie (ssp palumbus, adult) — Demongin (2020) p.182
  // Snavel tot verenlijn (bill to feathers = blootgestelde snavel): dichtste bij snavel_schedel
  bio_vleugel_M_min: '243',
  bio_vleugel_M_max: '268',
  bio_vleugel_F_min: '240',
  bio_vleugel_F_max: '260',

  bio_staartlengte_M_min: '156',
  bio_staartlengte_M_max: '174',
  bio_staartlengte_F_min: '153',
  bio_staartlengte_F_max: '172',

  bio_snavel_schedel_M_min: '19.3',
  bio_snavel_schedel_M_max: '23.6',
  bio_snavel_schedel_F_min: '19.3',
  bio_snavel_schedel_F_max: '23.4',

  bio_tarsus_lengte_M_min: '29.8',
  bio_tarsus_lengte_M_max: '34.6',
  bio_tarsus_lengte_F_min: '29.0',
  bio_tarsus_lengte_F_max: '35.0',

  bio_gewicht_M_min: '325',
  bio_gewicht_M_max: '620',
  bio_gewicht_F_min: '248',
  bio_gewicht_F_max: '600',

  // Overige velden
  eerste_broedleeftijd: '2Y',

  // Pennen-structuur (JSON) → tabel "Vleugelpunt / Handpennen / Armpennen / Tertials / Staartpennen"
  pennen_structuur: {
    wp:      'P3–P4',
    hp:      11,
    hp_note: 'P1 sterk gereduceerd',
    ap:      11,
    ap_note: '(soms 12; extr. 10–15)',
    tp:      3,
    sp:      12,
  },

  // Vleugelformule — geen extra info van toepassing
  vleugelformule: '',

  // Ruitiming — geen inline bron
  rui_notities:
    '**Juveniel [3]** Complete gesuspendeerde postrui, start ~6 weken na uitvliegen met lichaamsveren en P11. Rui gewoonlijk gesuspendeerd in november/december en hervat in maart/april; zelden actieve rui jan–feb. Vroege vogels kunnen zonder onderbreking volledig ruien (behalve slagpennen). S ruien oplopend v.a. S1 en divergent v.a. S9–S10; daarna gesuspendeerd met juv. (S2) S3 (S4)–(S6) S8 (S9). S-rui hervat bij volgende ruiseizoenen; S5–S6 soms pas na 1–2 jaar geruid. Een klein deel van de vogels (5–10%, waarschijnlijk late broedsels) begint de postrui pas in het voorjaar van het 2e kj (v.a. mrt/apr).\n\n' +
    '**Adult [4/6]** Complete postbroedselrui (behalve deel van slagpennen). P-rui start april–begin mei, soms gesuspendeerd jun–aug en hervat in september; afgerond in eind oktober–half november, vaak pas in eind december. Soms 1–2 buitenste P niet geruid (worden hervat in mrt–apr). Lichaamsveren, S en staart grotendeels geruid eind augustus–half oktober. S ruien oplopend v.a. S1 en divergent v.a. S9–S11; elk jaar slechts deel van S geruid, waardoor 2 S-generaties tegelijk zichtbaar zijn (vaak asymmetrisch tussen de vleugels).',

  // Leeftijdsbepaling — ALLES in vj; nj = '' voor tabs-modus.
  // {{07-11}} blokken → zichtbaar in NJ-tab
  // {{03-06}} blokken → zichtbaar in VJ-tab
  // {{01-12}} blokken → altijd zichtbaar
  leeftijds_notities_nj: '',

  leeftijds_notities_vj:
    '{{07-11}}\n' +
    '**Juveniel (EURING 3J) — zomer/vroege herfst:**\n' +
    'Handpendekveren, middelste dekveren en kleine dekveren lichtgrijs-bruin met buffrand. Geen witte halvemaanband op nek en geen irisatie. Keel blauwachtig, soms gedeeltelijk roséachtig. Iris parelgrijs of zeer lichtbruin. Poten grijs met paarse tint.\n\n' +
    '{{07-11}}\n' +
    '**1e kj (EURING 3) — herfst:**\n' +
    'Buffachtige of bruine rand op juveniele buitenste handpendekveren. Slechts één ruicentrum binnen handpennen, of geen P-rui. Let op: vroege vogels kunnen compleet ruien (behalve deel slagpennen) — zie ruitiming. Poten worden rood als adult naarmate postrui vordert.\n\n' +
    '{{07-11}}\n' +
    '**2e kj (EURING 5) — herfst:**\n' +
    'Vergelijkbaar met adult. Kleine deel met onvolledige postrui herkenbaar: soms P2 nog juveniel en/of buffachtige punt op buitenste kleine dekveren (doorgaans distaal bij vleugelboeg). Twee ruicentra binnen P — beide vleugels controleren.\n\n' +
    '{{07-11}}\n' +
    '**Adult (EURING 4) — herfst:**\n' +
    'Handpendekveren egaal donker leigrijs zonder buffrand. Kleine dekveren asgrijs tot grijsbruin. Witte halvemaanband op nek en irisatie aanwezig. Keel geheel roséachtig. Iris geel (soms groenachtig wit). Poten purperrood. Gewoonlijk één ruicentrum, maar soms beginnen buitenste P te ruien terwijl binnenste P al opnieuw start (in april).\n\n' +
    '{{03-06}}\n' +
    '**2e kj (EURING 5) — voorjaar:**\n' +
    'Juveniele kleine dekveren en buitenste handpendekveren met bleke rand. Twee ruicentra (vergelijkbaar met 2kj in winter): buitenste juv P behouden, binnenste P voor 2e keer geruid (3 generaties aanwezig); soms is P-rui pas net begonnen. Let op: niet verwarren met adult die mrt–jun de 2 buitenste P ruiet — adult heeft geen buffpunt.\n\n' +
    '{{01-12}}\n' +
    '**Adult (EURING 6) — voorjaar:**\n' +
    'Als adult in herfst. Let op: adult die maart–juni 2 buitenste P ruiet heeft geen buffpunt op dekveren — niet verwarren met 2kj in zomer.',

  // Geslachtsbepaling — bullets, geen kopregels, geen maten
  geslachts_notities_m:
    '- Onderbuik sterker roséachtig (vineus).\n' +
    '- Kop gemiddeld breder: ≥22 mm achter de ogen.\n' +
    '- Betrouwbaarst te herkennen in direct vergelijk met ♀ V van hetzelfde paar.',

  geslachts_notities_f:
    '- Onderbuik roséachtig met grijze tint (minder uitgesproken dan ♂ M).\n' +
    '- Kop gemiddeld smaller: ≤22 mm achter de ogen.\n' +
    '- Betrouwbaarst te herkennen in direct vergelijk met ♂ M van hetzelfde paar.',

  // ID-kenmerken — geen vergelijkingstabel in Demongin; veldkenmerken als alinea
  determinatie_id_notities:
    'Brede witte halvemaan dwars over de vleugel (zichtbaar in vlucht). Van onderen: staart grijs met witte subterminalband en zwarte eindband.',

  // Ondersoorten — slechts 1 ondersoort in Europa
  ondersoorten:
    '**C. p. palumbus** (Europa, O tot W Siberië en Irak; enige ondersoort in NL): Lichte variatie in kleur; subtiele veerverschillen. In totaal 6 ondersoorten wereldwijd, maar alleen palumbus relevant voor Nederlandse ringers.',

  // Bronvermeldingen per sectie
  bron_biometrie:         'Demongin (2020) p.182 (ssp palumbus, snavel = tot verenlijn)',
  bron_leeftijdsbepaling: 'Demongin (2020) p.182–183',
  bron_geslacht:          'Demongin (2020) p.182',
  bron_id_kenmerken:      'Demongin (2020) p.182',
  bron_ondersoorten:      'Demongin (2020) p.182',
  bron_ring:              'Demongin (2020) p.182–183',

  vangst_checklist: [
    { label: 'Vleugel', type: 'meting', belang: 3 },
    { label: 'Staart', type: 'meting', belang: 2 },
    { label: 'Snavel tot verenlijn', type: 'meting', belang: 1 },
    { label: 'Tarsus', type: 'meting', belang: 1 },
    { label: 'Gewicht', type: 'meting', belang: 2 },
    { label: 'Iriskleur', type: 'obs', belang: 3, note: 'Parelgrijs = juv · Geel = adult' },
    { label: 'Handpendekveren', type: 'obs', belang: 3, note: 'Buffrand = 1kj · Grijs = adult' },
    { label: 'Ruipatroon P', type: 'obs', belang: 3, note: '2 centra = 2kj · 1 centrum = 1kj of adult' },
    { label: 'Witte nekband', type: 'obs', belang: 2, note: 'Afwezig = juveniel' },
  ],
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

console.log('✓ Houtduif-data bijgewerkt in Supabase');
console.log('  Nieuwe velden:', Object.keys(updates).join(', '));
