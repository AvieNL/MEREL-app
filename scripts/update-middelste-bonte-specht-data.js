/**
 * update-middelste-bonte-specht-data.js
 * Verwerkt data voor Middelste Bonte Specht (EURING 08830, Dendrocopos medius)
 * Bron: Demongin (2020) p.212
 *
 * Gebruik: node scripts/update-middelste-bonte-specht-data.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const EURING = '08830';

const { data: row, error: fetchErr } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .eq('euring_code', EURING)
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }
console.log('Huidige naam:', row.naam_nl);

const updates = {

  // ── Biometrie (ssp. medius) ────────────────────────────────────────────────
  bio_vleugel_M_min:        123.5, bio_vleugel_M_max:        138,
  bio_vleugel_F_min:        120,   bio_vleugel_F_max:        137,
  bio_staartlengte_M_min:   72,    bio_staartlengte_M_max:   88,
  bio_staartlengte_F_min:   64,    bio_staartlengte_F_max:   83,
  bio_snavel_schedel_M_min: 24,    bio_snavel_schedel_M_max: 30,
  bio_snavel_schedel_F_min: 24,    bio_snavel_schedel_F_max: 30,
  bio_tarsus_lengte_M_min:  20,    bio_tarsus_lengte_M_max:  24,
  bio_tarsus_lengte_F_min:  20,    bio_tarsus_lengte_F_max:  23,
  bio_gewicht_M_min:        50,    bio_gewicht_M_max:        85,
  bio_gewicht_F_min:        49.5,  bio_gewicht_F_max:        80,

  // ── Nestgegevens ────────────────────────────────────────────────────────────
  eerste_broedleeftijd: '2Y',

  // ── Pennenstructuur ─────────────────────────────────────────────────────────
  pennen_structuur: {
    wp:      'P4 (soms P3 of P5)',
    wp_note: 'Postjuv; juv WP = P3 (soms P4)',
    hp:      10,
    hp_note: 'P1 gereduceerd in postjuv',
    ap:      10,
    ap_note: '(10–12)',
    tp:      3,
    sp:      12,
    sp_note: 'TF6 gereduceerd',
  },

  // ── Vleugelformule ──────────────────────────────────────────────────────────
  vleugelformule:
    'P1 – WP: 61–67 mm (1e kj) · P1 – WP: 69–80 mm (adult)\n' +
    'P1 projectie boven PC: 5–12 mm breed (1e kj) · ≤ 4–4 mm smal en spits (adult)',

  // ── Rui ─────────────────────────────────────────────────────────────────────
  rui_notities:
    '**1e kj (3)** Gedeeltelijke postjuv-rui (Fig. 2): lichaams­veren, P (start met P10 bij het uitvliegen, laat mei–jul, klaar met P1 in aug–sep), alle of deel LC en MC, TF en binnenste GC, en vaak enkele buitenste PC. S, I, alula en alle of deel GC en PC worden behouden. TF- en lichaamsrui vergelijkbaar met adult; nek wordt als eerste geruid.\n\n' +
    '**Adult (4)** Complete postrui: start met P10 in jun–begin jul, klaar van half aug tot half sep. S ascenderend van S1 en divergerend van S8. TF2–TF5, dan TF1 (TF6 variabel). PC-rui niet gesynchroniseerd met P, soms zijn disparate PC behouden. Lichaamsrui voornamelijk laat jul–begin okt.',

  // ── Leeftijdsbepaling ───────────────────────────────────────────────────────
  leeftijds_notities_nj: '',
  leeftijds_notities_vj:
    '{{07-12}}\n' +
    '**1e kj (3)**\n' +
    'Rode veren van de kruin minder verlengd en smal; rood minder uitgebreid en minder helder, zonder goudbruin op achterste kruin. P5–P3 doorgaans met 2 mm brede witte vlekken op de punt. P1 steekt 5–12 mm boven de PC uit (breed); P1–WP = 61–67.\n\n' +
    '{{01-06}}\n' +
    '**2e kj (5)**\n' +
    'Vergelijkbaar met adult, maar T, S en alle of deel van juveniele GC en PC behouden en bruin, contrasterend met de zwartere geruide veren. Vaak contrasteren buitenste (geruide) PC met versleten en bruinere juveniele binnenste PC.\n\n' +
    '{{07-12}}\n' +
    '**Adult (4/6)**\n' +
    'Zie geslacht voor kruinkleur. Doorgaans alle PC egaal glanzend zwart, zonder contrast; soms enkele geïsoleerde bruinere PC behouden. P5–P3 doorgaans zwart afgepunt, behalve witte rand op buitenste web. P1 ≤ 4–4 mm boven PC, smal en spits; P1–WP = 69–80.\n\n' +
    '{{01-06}}\n' +
    '**Adult (4/6)**\n' +
    'Zie geslacht voor kruinkleur. Doorgaans alle PC egaal glanzend zwart, zonder contrast; soms enkele geïsoleerde bruinere PC behouden. P5–P3 doorgaans zwart afgepunt, behalve witte rand op buitenste web. P1 ≤ 4–4 mm boven PC, smal en spits; P1–WP = 69–80.',

  // ── Geslachtsbepaling ───────────────────────────────────────────────────────
  geslachts_notities_m:
    '- Verlengde en smalle veren van de kruin helder rood (lengte vlek = 34–46 mm; breedte = 20–29 mm) tot op de achterste kruin\n' +
    '- Strepen op de flanken breder en duidelijker dan ♀ V\n' +
    '- Juv ♂ M: lengte helder rood op kruin = 24–25 mm; achterste kruin zwart met licht bruine of rode veerpunten',

  geslachts_notities_f:
    '- Kruin minder intens rood, meer roze-rood (lengte vlek = 29–38 mm; breedte = 18–24 mm), begrensd door roze-bruin, geel of goudbruin op achterste kruin (grens meer diffuus)\n' +
    '- Lichte gebieden op de kop vaak meer buff\n' +
    '- Soms niet te onderscheiden van postjuv ♂ M\n' +
    '- Juv ♀ V: lengte dofbruin-rood op kruin = 18–22 mm; achterste kruin zwart met weinig rood of bruin; geen goudbruin op achterste kruin',

  // ── Identificatiekenmerken ──────────────────────────────────────────────────
  determinatie_id_notities:
    '**Vergelijking Middelste Bonte Specht / Grote Bonte Specht:**\n' +
    '| Kenmerk | Middelste Bonte Specht | Grote Bonte Specht |\n' +
    '|---|---|---|\n' +
    '| Vleugel ♂ M | 123,5–138 mm | groter |\n' +
    '| P1–WP 1e kj | 61–67 mm | 61–74 mm |\n' +
    '| P1–WP adult | 69–80 mm | 75–88 mm |\n' +
    '| Rug/schouders | soms lichtbruin met groentint | normaal zwart-wit |\n\n' +
    '**Afwijkende vogels**\n' +
    'Leucistische vogels mogelijk. Rug en schouders kunnen soms lichtbruin zijn met groene tint.\n\n' +
    '**Hybridisatie**\n' +
    'Hybridisatie met Grote Bonte Specht mogelijk.',

  // ── Ondersoorten ────────────────────────────────────────────────────────────
  ondersoorten:
    '**D. m. medius** (Europa t/m W-Rusland en NW-Turkije): Nominaatvorm. Onderbuik lichtbeige in Centraal-Europa.\n\n' +
    '**D. m. caucasicus** (N-Turkije t/m Kaukasus, Transkaukasië, mogelijk NW-Iran): Borst en buik levendiger goudgeel. Helder roze-rode vlek op stuit en onderstaartdekveren meer beperkt. Flanken sterker gestreept.\n\n' +
    '**D. m. anatoliae** (W- en Z-Turkije): Vergelijkbaar met caucasicus maar kleiner. Intergradatie met sanctijohannis in N-Irak.\n\n' +
    '**D. m. sanctijohannis** (Zagros-gebergte).',

  // ── Bronvermeldingen ────────────────────────────────────────────────────────
  bron_biometrie:         'Demongin (2020) p.212',
  bron_leeftijdsbepaling: 'Demongin (2020) p.212',
  bron_geslacht:          'Demongin (2020) p.212',
  bron_id_kenmerken:      'Demongin (2020) p.212',
  bron_ondersoorten:      'Demongin (2020) p.212',
  bron_ring:              'Demongin (2020) p.212',

  // ── Literatuur ──────────────────────────────────────────────────────────────
  referenties_literatuur: [
    'Gorman (2004)',
    'Konieczny (2000)',
    'Pasinelli (2000)',
    'Winkler et al. (1995)',
  ],

  // ── Vangst-checklist ────────────────────────────────────────────────────────
  vangst_checklist: [
    { label: 'Kruinvlek meten (lengte + breedte)', type: 'obs',   belang: 3, note: '♂ M langer + breder' },
    { label: 'PC-kleur',                           type: 'obs',   belang: 3, note: 'Bruin=1e kj · Zwart=adult' },
    { label: 'P1 boven PC meten (mm)',             type: 'meting',belang: 3, note: '5–12=1e kj · ≤4=adult' },
    { label: 'Vleugel',                            type: 'meting',belang: 2 },
    { label: 'Gewicht',                            type: 'meting',belang: 2 },
    { label: 'Snavel tot schedel',                 type: 'meting',belang: 2 },
  ],
};

const filtered = Object.fromEntries(
  Object.entries(updates).filter(([, v]) => v !== '' && v !== null && v !== undefined)
);

const newData = { ...row.data, ...filtered };

const { error: upsertErr } = await sb.from('species').upsert({
  euring_code: row.euring_code,
  naam_nl:     row.naam_nl,
  data:        newData,
});

if (upsertErr) { console.error('Upsert mislukt:', upsertErr.message); process.exit(1); }

console.log('✓', row.naam_nl, '— data bijgewerkt');
console.log('  Velden:', Object.keys(filtered).join(', '));
