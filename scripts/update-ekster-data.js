/**
 * update-ekster-data.js
 * Ekster (EURING 15490) — biometrie, rui, leeftijd, geslacht, ID, ondersoorten, referenties.
 * Bron: Demongin (2016) p.343–344 — ssp. pica
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const EURING = '15490';

const { data: row, error: fetchErr } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .eq('euring_code', EURING)
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }
console.log('Huidige naam:', row.naam_nl);

const NJ = '{{07-12}}\n';
const VJ = '{{01-06}}\n';

const updates = {

  // ── Biometrie — ssp. pica (niet galliae, fennorum, mauritanica) ────────────
  // Ad en juv gecombineerd per geslacht
  bio_vleugel_M_min: 178, bio_vleugel_M_max: 206,
  bio_vleugel_F_min: 162, bio_vleugel_F_max: 198,

  bio_staartlengte_M_min: 192, bio_staartlengte_M_max: 270,
  bio_staartlengte_F_min: 171, bio_staartlengte_F_max: 255,

  // Bill to skull (MF apart — ♀ V heeft bredere range)
  bio_snavel_schedel_M_min: 38.1, bio_snavel_schedel_M_max: 42.4,
  bio_snavel_schedel_F_min: 35.2, bio_snavel_schedel_F_max: 44.4,
  bio_snavel_schedel_is_bill_to_feathers: false,

  // Kop + snavel (head and bill, MF apart)
  bio_kop_snavel_M_min: 68, bio_kop_snavel_M_max: 80,
  bio_kop_snavel_F_min: 65, bio_kop_snavel_F_max: 76,

  // Snaveldiepte bij cere (bill depth at cere, MF apart, ad en juv gecombineerd)
  bio_snavel_diepte_M_min: 11.9, bio_snavel_diepte_M_max: 14.7,
  bio_snavel_diepte_F_min: 10.5, bio_snavel_diepte_F_max: 13.9,

  // Tarsus (ad en juv gecombineerd per geslacht)
  bio_tarsus_lengte_M_min: 48.4, bio_tarsus_lengte_M_max: 54.2,
  bio_tarsus_lengte_F_min: 45.3, bio_tarsus_lengte_F_max: 53.4,

  // Gewicht (juv identiek aan adult)
  bio_gewicht_M_min: 171, bio_gewicht_M_max: 290,
  bio_gewicht_F_min: 142, bio_gewicht_F_max: 253,

  // ── Pennenstructuur ────────────────────────────────────────────────────────
  pennen_structuur: {
    wp: '(P4) P5',
    hp: 10,
    hp_note: 'P1 kort',
    ap: 6,
    tp: 4,
    sp: 12,
  },

  // Geen expliciete P-WP afstanden in bron
  vleugelformule: '',

  // ── Nestgegevens ───────────────────────────────────────────────────────────
  eerste_broedleeftijd: '2Y/3Y',

  // ── Rui ───────────────────────────────────────────────────────────────────
  rui_notities:
    '**1e kj (3)** Gedeeltelijke postjuv-rui van jun–okt. Omvat lichaamsveren, alle LC en MC, gewoonlijk alle GC (soms buitenste aangehouden) en soms enkele T, TF1 en TF2.\n\n' +
    '**na 1e kj (4)** Volledige postbroed-rui van (mid-mei) jun–mid-jul tot (mid-aug) sep–okt (nov); kan beginnen in laat apr en eindigen in vroeg aug bij 2e kj.',

  // ── Leeftijdsbepaling ─────────────────────────────────────────────────────
  leeftijds_notities_nj: '',

  leeftijds_notities_vj: [

    NJ +
    '**1e kj volledig juv (3J)** Bovenzijde dof zwart. Iris blauwgrijs, snel donkerbruin wordend. Kleine ring van blauwgrijze [gele] blote huid rond oog. Binnenzijde bovenmandibel bleek, rozeachtig tot witachtig (later zwartgrijs).',

    NJ +
    '**1e kj (3)** (na start postjuv-rui) Vliegveren doorgaans meer versleten en bruinachtig dan bij adult. Juv alula, PC en T weinig glanzend, contrasterende met glanzende geruide GC. TF smal en afgerond. Bovenzijde zwart met weinig metaalglans. Zoek moultgrens tussen doffe juv PC/alula/T en glanzende geruide GC.',

    NJ +
    '**na 1e kj (4)** Glanzende vliegveren. Geen moultgrens in de vleugel. TF vierkant en breed. Bovenzijde zwart met metaalglans.',

    VJ +
    '**1e kj of 2e kj (3 of 5)** P1 en P2 doorgaans meer versleten en bruinachtig dan bij adult. Juv alula, PC en T weinig glanzend, contrasterende met glanzende geruide GC. TF smal en afgerond. Bovenzijde zwart met weinig metaalglans. Niet nader te dateren in voorjaar.',

    VJ +
    '**na 1e kj of na 2e kj (4 of 6)** P1 en P2 glanzend. Geen moultgrens in de vleugel. TF vierkant en breed. Bovenzijde zwart met metaalglans. Niet nader te dateren in voorjaar.',

  ].join('\n\n'),

  // ── Geslacht ──────────────────────────────────────────────────────────────
  geslachts_notities_m:
    '- Geen betrouwbaar visueel kenmerk; vleugelmeting soms bruikbaar maar let op clinale variatie\n' +
    '- Vergelijk bij voorkeur mannetje en vrouwtje binnen het koppel\n' +
    '- Vleugel ≥ 199 mm vrijwel zeker ♂ M (boven ♀ V maximum 198 mm, ssp. pica)\n' +
    '- **Maten ♂ M (ssp. pica, ad):** vleugel 179–206 · staart 204–270 · bill to skull 38,1–42,4 mm · snaveldiepte bij cere 12,1–14,7 mm · tarsus 49,4–53,8 mm · gewicht 171–290 g\n' +
    '- **Formule (ad pica):** ♂ M als 0,02 × staart − 0,02 × gewicht − 0,09 × vleugel − 0,24 × snavellengte (neusgat) − 0,94 × snaveldiepte + 35,8 > 0\n' +
    '- **Formule 1e kj centraal Noorwegen (12% fout):** ♂ M als 0,2275 × vleugel + 1,4806 × snaveldiepte bij hoek ondermandibel − 63,9619 > 0,2639',

  geslachts_notities_f:
    '- Geen betrouwbaar visueel kenmerk; vleugelmeting soms bruikbaar maar let op clinale variatie\n' +
    '- Broedvlek is een betrouwbare ♀ V-indicator (vrouwtje broedt alleen)\n' +
    '- Vleugel ≤ 177 mm vrijwel zeker ♀ V (onder ♂ M minimum 178 mm, ssp. pica)\n' +
    '- **Maten ♀ V (ssp. pica, ad):** vleugel 172–198 · staart 206–255 · bill to skull 35,2–44,4 mm · snaveldiepte bij cere 11,1–13,9 mm · tarsus 46,0–53,4 mm · gewicht 142–253 g',

  // ── ID-kenmerken ──────────────────────────────────────────────────────────
  determinatie_id_notities:
    'Onverwisselbaar. Verenkleed zwart en wit. Lange getrapte staart. Vleugel afgerond met P grotendeels wit.\n\n' +
    '**Hybridisatie**\n\n' +
    'Hybridisatie mogelijk met Bonte Kraai _Corvus cornix_ en Geelsnavelek­ster _Pica nuttalli_.',

  // ── Ondersoorten ──────────────────────────────────────────────────────────
  ondersoorten:
    'Verschillen vrij gering, grotendeels clinaal; meer wit op vleugel van W naar O. Gebieden van intergradatie. Vijf andere ondersoorten in Azië. Ssp. _hudsonia_ wordt nu als aparte soort beschouwd (Zwartbekekster).\n\n' +
    '**pica** (meest van Europa behalve ZW; Britse Eilanden, Klein-Azië, Nabije Oosten): Nominaatvorm. Stuit variabel van kleur, grijsachtig (soms witachtig) met gemengd wit of zwart. Ssp. _fennorum_ en _bactriana_ sterk gelijkend. Incl. _galliae_ (België, W-Duitsland, Frankrijk, Alpen, Italië).\n\n' +
    '**fennorum** (N-Scandinavië, Finland, NW-Rusland tot de Petsjora): Gemiddeld iets meer wit op P en stuit. Iets groter (slechts 2–5%).\n\n' +
    '**bactriana** (Krim, ZW-Rusland, N-Kaukasus tot Centraal-Azië en Baikal): Lijkt op _fennorum_ maar gemiddeld iets meer wit op P.\n\n' +
    '**melanotos** (Iberisch Schiereiland): Lijkt op _pica_ maar stuit gewoonlijk zwart (soms met dof grijsachtig gebied). Soms een beetje blauwachtige blote huid achter het oog.\n\n' +
    '**mauritanica** (NW-Afrika): Vleugel kort, staart lang. P1 vrijwel volledig zwart. Blauw-blote huid achter het oog op alle leeftijden. Stuit zwart. Soms als aparte soort beschouwd (Maghreb-Ekster).',

  // ── Bronvermeldingen ──────────────────────────────────────────────────────
  bron_biometrie:         'Demongin (2016) p.343–344 — ssp. pica; ad en juv gecombineerd per geslacht; snaveldiepte bij cere; bill to nostrils: ♂ M 23–32 mm, ♀ V 21–27 mm (juv identiek)',
  bron_leeftijdsbepaling: 'Demongin (2016) p.343–344',
  bron_geslacht:          'Demongin (2016) p.343–344',
  bron_id_kenmerken:      'Demongin (2016) p.343–344',
  bron_ondersoorten:      'Demongin (2016) p.343–344',
  bron_ring:              'Demongin (2016) p.343',

  // ── Vangst-checklist ─────────────────────────────────────────────────────
  vangst_checklist: [
    { label: 'Vleugel',                type: 'meting', belang: 3 },
    { label: 'Gewicht',                type: 'meting', belang: 2 },
    { label: 'Tarsus',                 type: 'meting', belang: 2 },
    { label: 'Iris kleur',             type: 'obs',    belang: 3, note: 'Blauwgrijs = 1e kj volledig juv (3J) · Donkerbruin = ouder' },
    { label: 'Vliegveren glans',       type: 'obs',    belang: 3, note: 'Weinig glans + moultgrens (juv alula/PC/T vs glanzende GC) = 1e kj · Sterk glanzend, geen moultgrens = na 1e kj' },
    { label: 'TF vorm',                type: 'obs',    belang: 2, note: 'Smal en afgerond = juv/1e kj · Vierkant en breed = adult' },
    { label: 'Binnenzijde bovenmandibel', type: 'obs', belang: 1, note: 'Bleek rozeachtig/witachtig = 3J · Zwartgrijs = ouder' },
    { label: 'Broedvlek',              type: 'obs',    belang: 3, note: 'Aanwezig = ♀ V (broedt alleen)' },
  ],

  // ── Literatuurreferenties ─────────────────────────────────────────────────
  referenties_literatuur: [
    'Birkhead (1991)',
    'Blasco-Zumeta en Heinze (2013)',
    'Goodwin (1986)',
    'Kavanagh (1988)',
    'Madge en Burn (1996)',
    'Trost (1999)',
    'Demongin (2016)',
  ],
};

const newData = { ...row.data, ...updates };

const { error: upsertErr } = await sb.from('species').upsert({
  euring_code: row.euring_code,
  naam_nl:     row.naam_nl,
  data:        newData,
});

if (upsertErr) { console.error('Upsert mislukt:', upsertErr.message); process.exit(1); }
console.log('✓', row.naam_nl, '(', EURING, ') — data bijgewerkt');
console.log('  Velden:', Object.keys(updates).join(', '));
