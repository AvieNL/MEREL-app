/**
 * update-bonte-vliegenvanger-data.js
 * Voegt uitgebreide data toe aan de Bonte Vliegenvanger (EURING 13490) in Supabase.
 * Data gebaseerd op Demongin (2020) p.317–320.
 *
 * Gebruik: node scripts/update-bonte-vliegenvanger-data.js
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
  .eq('euring_code', '13490')
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }
console.log('Huidige naam:', row.naam_nl);

// ─── Nieuwe/bijgewerkte velden ────────────────────────────────────────────────
const updates = {
  // Biometrie (adult, hypoleuca) — Demongin (2020) p.317
  bio_vleugel_M_min: '75',
  bio_vleugel_M_max: '85',
  bio_vleugel_F_min: '73',
  bio_vleugel_F_max: '80',

  bio_staartlengte_M_min: '49',
  bio_staartlengte_M_max: '58',
  bio_staartlengte_F_min: '49',
  bio_staartlengte_F_max: '58',

  bio_snavel_schedel_M_min: '10.7',
  bio_snavel_schedel_M_max: '14.2',
  bio_snavel_schedel_F_min: '10.7',
  bio_snavel_schedel_F_max: '14.2',

  bio_tarsus_lengte_M_min: '16.1',
  bio_tarsus_lengte_M_max: '19.0',
  bio_tarsus_lengte_F_min: '16.1',
  bio_tarsus_lengte_F_max: '19.0',

  bio_gewicht_M_min: '9',
  bio_gewicht_M_max: '17',
  bio_gewicht_F_min: '9',
  bio_gewicht_F_max: '17',

  // Pennen-structuur (JSON) → tabel "Vleugelpunt / Handpennen / Armpennen / Tertials / Staartpennen"
  pennen_structuur: {
    wp:  'P3–P4',
    hp:  10,
    ap:  9,
    tp:  3,
    sp:  12,
  },

  // Vleugelformule — extra formule-info staat in ID-kenmerken
  vleugelformule: '',

  // Ruitiming — geen inline bron
  rui_notities:
    '**Juveniel [3]** Gedeeltelijke postrui juni–augustus: lichaamsveren, gewoonlijk alle kleine vleugeldekveren, geen tot alle middelste dekveren, 0–4 grote armpendekveren (gem. 2), uitzonderlijk 1 binnenste tertial. Gedeeltelijke prebroedselrui in de winter (zie Adult). 2e kj ruiet vaker een slagpen dan adulten.\n\n' +
    '**Adult [4/6]** Complete postbroedselrui van juni/juli tot augustus/september, soms met 1–4 binnenste slagpennen behouden (vaak asymmetrisch). Gedeeltelijke prebroedselrui januari–maart: lichaamsveren, kleine en middelste vleugeldekveren, grote armpendekveren (gem. 6, soms alle), tertials, soms binnenste slagpennen (max. 4), zelden tertiaaldekveren.',

  // Leeftijdsbepaling — ALLES in leeftijds_notities_vj met {{MM-MM}} maandblokken.
  // leeftijds_notities_nj = '' activeert de tabs-modus in SoortDetail.jsx.
  // Najaarblokken: {{07-10}} → zichtbaar in NJ-tab (jul–dec filter).
  // Voorjaarblokken: {{04-06}} → zichtbaar in VJ-tab (jan–jun filter).
  // {{01-12}} → altijd zichtbaar in beide tabs.
  leeftijds_notities_nj: '',

  leeftijds_notities_vj:
    '{{07-10}}\n' +
    '**1e kj (EURING 3) — herfst:**\n' +
    'Gewoonlijk witte zoom op middelste tertial breed op buitenvlag maar zeer smal op binnenvlag, met inkeping bij schacht. Verruide binnenste grote armpendekveren met wittige rand (soms bruinachtig), zonder duidelijke bleke punt, centrum iets donkerder — contrasterende met juveniele dekveren met brede wittige punt (let op: 3 buitenste juv. dekveren met smallere buffrand kunnen lijken op ruigrens). Binnenzijde bovensnavel gewoonlijk bleekroosgrijzig (soms grijs vanaf september). Staartpennen vaak licht spits (maar soms afgerond), licht versleten. Iris donkergrijs zonder bruintint.\n\n' +
    '{{07-10}}\n' +
    '**Adult (EURING 4) — herfst:**\n' +
    'Witte zoom op middelste tertial smal, gelijkmatig en doorlopend, zonder inkeping bij schacht. Binnenste grote armpendekveren smal omzoomd bleekbuff of wittig, zonder inkeping. Geen 2e witte vleugelbaan op middelste dekveren. Soms verbleking en slijtage aan behouden slagpennen. Binnenzijde bovensnavel zwart of donkergrijs, soms grijs. Staartpennen gewoonlijk afgerond, vers en glad.\n\n' +
    '{{04-06}}\n' +
    '**2e kj ♂ M (EURING 5 M) — voorjaar:**\n' +
    'Duidelijk contrast tussen zwartachtige prebroedsel binnenste grote armpendekveren en middelste dekveren, en bruinachtige juveniele buitenste dekveren (m.n. handpendekveren en alula). Juv. buitenste dekveren versleten en verbleekt; juv. GC4 met vrij brede bleke punt of geheel versleten. Handpendekveren bruinachtig, iets bleker dan adult, vrij spits en versleten. Handpennen vaak bruinig en meer versleten dan adult. Als juv. TF nog aanwezig: bruingrijs of dof bruinzwart, duidelijk versleten, soms spits; binnenvlag TF6 gewoonlijk met duidelijk wit venster.\n\n' +
    '{{04-06}}\n' +
    '**2e kj ♀ V (EURING 5 F) — voorjaar:**\n' +
    'Subtiel contrast tussen versleten juveniele dekveren en prebroedseldekveren — iets uitgesproken dan tussen post- en prebroedseldekveren van adult. Handpendekveren licht bleker dan adult, vrij spits en versleten. Handpennen vaak iets meer versleten en bleker dan adult.\n\n' +
    '{{01-12}}\n' +
    '**Adult ♂ M (EURING 6 M):**\n' +
    'Slechts matig contrast tussen donkere prebroedsel middelste en binnenste grote dekveren, en donkergrijs postbroedsel buitenste dekveren. Handpendekveren donkergrijs, afgerond en weinig versleten. Handpennen donkerbruin, matig versleten. Staartpennen gewoonlijk weinig versleten, donkerzwart, vrij afgerond; binnenvlag TF6 met of zonder wit venster langs schacht.\n\n' +
    '{{01-12}}\n' +
    '**Adult ♀ V (EURING 6 F):**\n' +
    'Handpendekveren afgerond en niet sterk versleten. Handpennen matig versleten. Staartpennen gewoonlijk licht versleten.',

  // Geslachtsbepaling — geen kopregel, geen maten, bullets
  geslachts_notities_m:
    '- Gewoonlijk wit vlekje op voorhoofd (vrijwel nooit afwezig).\n' +
    '- Langste bovenstaartdekveren zwart of bruinzwart.\n' +
    '- Centrale staartpennen donkerbruinzwart of zelden zwart.\n' +
    '- ♂ M 1kj: soms TF1–TF3 duidelijk zwartachtig; bovenstaartdekveren nooit bruingrijs.\n' +
    '- In grijze individuen dekveren donkergrijs, contrasterende met bleekbruingrijze kleine dekveren.\n' +
    '- CP (uitstekende cloaca) soms aanwezig.',

  geslachts_notities_f:
    '- Geen wit op voorhoofd (soms enkele bleekwitte veertjes aan basis bij slijtage).\n' +
    '- Langste bovenstaartdekveren bruingrijs met zwarte schachtstip.\n' +
    '- Centrale staartpennen bruingrijs tot bruinzwart.\n' +
    '- Dekveren egaal bruingrijs.\n' +
    '- Duidelijke broedvlek is een betrouwbare ♀ V-indicator.',

  // ID-kenmerken — vergelijkingstabel Withalsvliegenvanger / Balkanvliegenvanger
  determinatie_id_notities:
    '**Vergelijking Bonte Vliegenvanger / Withalsvliegenvanger / Balkanvliegenvanger:**\n' +
    '| Kenmerk | Bonte Vliegenvanger | Withalsvliegenvanger | Balkanvliegenvanger |\n' +
    '|---|---|---|---|\n' +
    '| Vleugelformule P2 | = P5/P6 [P4/P5] | = P4/P5 of P5 | ≈ P4/P5 of P5 |\n' +
    '| P2–WP (mm) | 4–7 | 3–5,5 | 3–5,5 |\n' +
    '| Wit aan basis P | v.a. P6/P7 [P8] | v.a. P3/P4 (P5) | v.a. P3/P4 (♂ M); P5/P6 (♀ V/1kj) |\n' +
    '| Voorhoofdsvlek ♂ M | Klein, soms gedeeld | Groot | Beperkt (1–5 mm), soms gedeeld |\n' +
    '| Stuit ♂ M | Donker | Witgrijs, duidelijk | Diffuus grijswit |\n' +
    '| Kraag ♂ M | Nooit (behoudens iberiae) | Volledig wit | Uitgebreid wit aan halszijde |\n' +
    '| Nekveren | Nooit witband (behoudens iberiae) | Met witte band | Altijd donker |\n' +
    '| TF6 binnenste web | Wit venster langs schacht (var.) | Gewoonlijk geheel zwart (♂ M lente) | Veel wit (♂ M); weinig wit (♀ V/1kj) |\n' +
    '| Bovenzijde ♀ V | Bruin, licht grijstint | Grijzer, soms bleek stuit | Grijzig, nooit bleek stuit |\n\n' +
    '**Hybridisatie** met Withalsvliegenvanger (regelmatig op Gotland/Öland, zeldzaam elders) en Atlas Bonte Vliegenvanger (N Algerije): hybriden (♂ M vaker fertiel) tonen tussenkenmerken zoals onvolledige witachtige kraag en variabele witte vleugelmarkeringen.',

  // Ondersoorten — geen inline bron
  ondersoorten:
    '**F. h. hypoleuca** (Europa tot Oeral, N en centraal Spanje; NL broedvogel): ♂ M met zwarte of zwartachtige bovenzijde (soms bijgemengde bruingrijze veren) of grotendeels bruingrijs (vrijwel altijd 2kj). Zwarte ♂ M overheersend in N, W en Z Europa; bruingrijze ♂ M (muscipeta-variant) in delen van centraal Europa en Rusland. Donkere kleur ♂ M vaak leeftijdsgebonden — zwarte ♂ M zelden 2kj. Stuit gewoonlijk donker; soms enig wit op buitenste TF.\n\n' +
    '**F. h. sibirica** (Siberië O van Oeral): Gemiddeld iets groter dan hypoleuca; vleugel ♂ M 79–84. Lente-♂ M vaak grijzig, bovenzijde iets bleker. Instabiele kenmerken; brede intergradatiezone met Europese populaties.\n\n' +
    '**F. h. iberiae** (centraal Spanje, Portugal): Tussenform tussen hypoleuca en speculigera (mogelijk hybride-origine). Iets kleiner. ♂ M gewoonlijk bijna zo zwart als speculigera, geheel zwarte staart. Soms bijna volledige witte kraag (lijkt op Balkanvliegenvanger). Meer wit op vleugel dan hypoleuca: v.a. [P3] P4 of P5. ♀ V soms niet te onderscheiden; tertials met bredere witte zoom; voorhoofd vaak breed wit (vaker adult dan imm).\n\n' +
    '**F. h. speculigera** (NW Afrika; vroeger beschouwd als ondersoort van hypoleuca): ♂ M lente met breed wit vlekje op voorhoofd (kan tot achter ogen reiken), breed wit op handpennen v.a. P3/P4, witte band aan halszijden. Bovenzijde duidelijk zwart als Withalsvliegenvanger. Stuit vrijwel geheel zwart of met klein diffuus grijswit vlekje. Staart vrijwel altijd geheel zwart. ♀ V en onvolwassen wellicht niet te onderscheiden van hypoleuca.',

  // Bronvermeldingen per sectie
  bron_biometrie:         'Demongin (2020) p.317',
  bron_leeftijdsbepaling: 'Demongin (2020) p.317–320',
  bron_geslacht:          'Demongin (2020) p.318–320',
  bron_id_kenmerken:      'Demongin (2020) p.317–319',
  bron_ondersoorten:      'Demongin (2020) p.317–318',
  bron_ring:              'Demongin (2020) p.319',

  vangst_checklist: [
    { label: 'Vleugel', type: 'meting', belang: 3 },
    { label: 'Staart', type: 'meting', belang: 2 },
    { label: 'Snavel tot schedel', type: 'meting', belang: 2 },
    { label: 'Tarsus', type: 'meting', belang: 1 },
    { label: 'Gewicht', type: 'meting', belang: 2 },
    { label: 'Iriskleur', type: 'obs', belang: 3, note: 'Donkergrijs = 1kj · Bruin = adult' },
    { label: 'Staartpenpatroon', type: 'obs', belang: 3, note: 'TF-kleur en wit: belangrijk voor ♂♀ en leeftijd' },
    { label: 'Bovenstaartdekveren', type: 'obs', belang: 3, note: 'Zwart = ♂ M · Bruingrijs = ♀ V' },
    { label: 'Voorhoofdsvlek', type: 'obs', belang: 2, note: 'Aanwezig = vrijwel zeker ♂ M' },
    { label: 'Broedvlek', type: 'obs', belang: 3, note: 'Aanwezig = zeker ♀ V' },
    { label: 'Ruigrens dekveren/tertials', type: 'obs', belang: 3, note: 'Ruigrens = 1kj; geen contrast = adult' },
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

console.log('✓ Bonte Vliegenvanger-data bijgewerkt in Supabase');
console.log('  Nieuwe velden:', Object.keys(updates).join(', '));
