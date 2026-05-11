/**
 * update-gbs-data.js
 * Grote Bonte Specht (EURING 08760) — biometrie, rui, leeftijd, geslacht, ID, ondersoorten, referenties.
 * Bron: Demongin p.210
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const EURING = '08760';

const { data: row, error: fetchErr } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .eq('euring_code', EURING)
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }
console.log('Huidige naam:', row.naam_nl);

// ─── Biometrie: ssp. major ────────────────────────────────────────────────────
const updates = {

  bio_vleugel_M_min: 137,   bio_vleugel_M_max: 147,
  bio_vleugel_F_min: 137,   bio_vleugel_F_max: 149,

  bio_staartlengte_M_min: 76,   bio_staartlengte_M_max: 100,
  bio_staartlengte_F_min: 81,   bio_staartlengte_F_max: 100,

  bio_snavel_schedel_M_min: 26.9, bio_snavel_schedel_M_max: 32.8,
  bio_snavel_schedel_F_min: 26.0, bio_snavel_schedel_F_max: 31.8,

  bio_tarsus_lengte_M_min: 23.8, bio_tarsus_lengte_M_max: 27,
  bio_tarsus_lengte_F_min: 23,   bio_tarsus_lengte_F_max: 27,

  // Gewicht opgegeven als M&F gezamenlijk
  bio_gewicht_M_min: 68, bio_gewicht_M_max: 100,
  bio_gewicht_F_min: 68, bio_gewicht_F_max: 100,

  eerste_broedleeftijd: '2Y',

  // ── Pennenstructuur ─────────────────────────────────────────────────────────
  pennen_structuur: {
    wp:      'P4 (soms P5)',
    hp:      10,
    hp_note: 'P1 gereduceerd bij juvenielen',
    ap:      11,
    tp:      3,
    sp:      12,
  },

  vleugelformule: '',

  // ── Rui ─────────────────────────────────────────────────────────────────────
  rui_notities:
    '**Juveniel [3]**\n' +
    'Gedeeltelijke postjuv-rui: lichaamsveren, P (start bij P10 bij uitvliegen), (deel van) LC en MC, TF, binnenste GC en vaak buitenste PC. S, T en (deel van) alula, GC en PC aangehouden. P-rui eindigt met P1 op ca. 4 maanden oud. Algemeen van laat mei–vroeg aug tot half sep–nov. Bij irrupties kan rui traag of gesuspendeerd zijn (soms slechts 1 veer groeiend); trekvogels van half sep–half okt suspenderen rui vaak met 5 binnenste P gemoulted. Rui soms actief tot dec–jan (P, TF en lichaamsveren).\n\n' +
    '**2e kj [5]**\n' +
    'Volledige postbroed-rui, vergelijkbaar met adult, maar soms nog juv binnenste PC aangehouden en gewoonlijk S (vooral binnenste) aangehouden.\n\n' +
    '**3e kj [7]**\n' +
    'Volledige postbroed-rui, vergelijkbaar met adult, maar incidenteel 1 of 2 juv PC aangehouden.\n\n' +
    '**Adult [6]**\n' +
    'Volledige postbroed-rui: P10 van jun tot half jul (laat mei of jun in Spanje), gereed van half sep tot okt in gematigde gebieden (okt–nov in N; vroeg aug in Spanje). Alula en enkele S soms aangehouden. S-rui oplopend van S1 en divergent van S8. TF2 t/m TF5 dan TF1 (TF6 variabel); PC-rui niet gesynchroniseerd met corresponderende P. Lichaamsrui voornamelijk jul–vroeg okt.',

  // ── Leeftijdsbepaling ───────────────────────────────────────────────────────
  leeftijds_notities_nj: '',

  leeftijds_notities_vj:
    '{{07-12}}\n' +
    '**Juveniel [3]** — vóór nekrui (ca. jul–okt)\n' +
    'Kroon dof rood met zwarte rand; nek zwart. Buikzijde en onderstaartdekveren roze of dof rood. P2 t/m P10 met witte of lichtbeige punt. P1 steekt 5–12 mm boven de PC uit; breder dan bij adult. P1–WP = 61–74.\n\n' +
    '**1e kj na rui [3/5]** — herfst, na gedeeltelijke postjuv-rui\n' +
    'LC, MC en nieuwe mantelveertjes gemoult, contrasterend met doffe en bruinere juv PC en buitenste GC. Iris dof bruin of roodbruin.\n\n' +
    '**2e kj [5] / 3e kj [7]** — herfst\n' +
    'Vergelijkbaar met adult, maar aangehouden juv PC puntiger, smaller, duidelijk bruiner en meer versleten. Soms aangehouden juv S, meer versleten en gebleekt; lijn van distale witte vlekken niet recht indien juv S aangehouden.\n\n' +
    '**Adult [6/8]**\n' +
    'Kroon zwart. Alle PC egaal glanzend zwart, zonder contrast (incidenteel wat bruinere PC aangehouden). P2 t/m P5 (P6) zonder witte punt. P1 steekt 3–5 mm boven de PC uit; P1–WP = 75–88.\n\n' +
    '**Iris**\n' +
    'Dof bruin of roodbruin bij juveniel; roodbruin of helderder rood bij adult. Individueel erg variabel, onbetrouwbaar als enig kenmerk (zeker in Groot-Brittannië).\n\n' +
    '{{01-06}}\n' +
    '**1e kj [3/5 voorjaar]**\n' +
    'LC, MC en nieuwe mantelveertjes gemoult, contrasterend met doffe en bruinere juv PC en buitenste GC. Iris dof bruin of roodbruin, doorgaans tot (feb) mrt–apr. Bij irrupties kan de kroon bij major uit N-Europa soms nog rood zijn tot in okt.\n\n' +
    '**2e kj [5/7 voorjaar] / 3e kj [7/9 voorjaar]**\n' +
    'Aangehouden juv PC puntiger, smaller, duidelijk bruiner en meer versleten dan verse veren. Soms aangehouden juv S meer versleten en gebleekt; lijn van distale witte vlekken niet recht.\n\n' +
    '**Adult [6/8]**\n' +
    'Kroon zwart. Alle PC egaal glanzend zwart. P2 t/m P5 (P6) zonder witte punt. P1 steekt 3–5 mm boven de PC uit; P1–WP = 75–88.\n\n' +
    '**Iris**\n' +
    'Dof bruin of roodbruin bij juveniel; roodbruin of helderder rood bij adult. Individueel erg variabel, onbetrouwbaar als enig kenmerk.',

  // ── Geslacht ────────────────────────────────────────────────────────────────
  geslachts_notities_m:
    '- Rode band op nek (ook kleine sporen van rood = ♂)\n' +
    '- Juveniel: rode kroonvlek 24–30 mm, weinig grijs of zwart aan de basis; kroonrand doorgaans slechts dun zwart',

  geslachts_notities_f:
    '- Nek egaal blauwzwart (let op: adult ♀ kan soms enkele veren met lichte rode rand hebben, maar zonder duidelijke rode band)\n' +
    '- Juveniel: rode kroonvlek 17–25 mm, minder intens, meer grijs of zwart aan de basis; bredere zwarte lijn boven het oog aan de zijkant van de kroon',

  // ── ID-kenmerken ────────────────────────────────────────────────────────────
  determinatie_id_notities:
    '**Vergelijking Grote Bonte Specht / Syrische Specht / Middelste Bonte Specht / Witrugspecht:**\n' +
    '| Kenmerk | Grote Bonte Specht | Syrische Specht | Middelste Bonte Specht | Witrugspecht |\n' +
    '|---|---|---|---|---|\n' +
    '| Flanken | Niet gestreept (juv zwak) | Grijs gestreept (sterker bij juv) | Dun gestreept | Duidelijk gestreept |\n' +
    '| Band nek–baardstreep | Aanwezig (soms gebroken bij juv) | Afwezig | Kort, niet verbonden met nek | Onderbroken (leucotos) of bijna compleet (lilfordi) |\n' +
    '| Wit ovaal op scapulars | Groot | Groot | Aanwezig | Afwezig (MC/GC breed wit) |\n' +
    '| TF4 en TF5 | Overwegend wit, 2–3 zwarte banden | Weinig wit | Veel wit | Veel wit |\n' +
    '| TF3 | Met wit | Zonder wit | Met wit | Met wit |\n' +
    '| Rug | Zwart | Zwart | Zwart | Wit of zwart geband wit |',

  // ── Ondersoorten ────────────────────────────────────────────────────────────
  ondersoorten:
    '**major** (Scandinavië tot Oeral, Z tot NO-Polen en N-Oekraïne): Onderbuik grijsachtig of crèmewit. Snavel kort maar breed en diep aan de basis.\n\n' +
    '**pinetorum** (continentaal Europa Z van major): Kleiner. Snavel langer en dunner. Onderbuik en voorhoofd lichtgrijs-bruin. Omvat ssp. **anglicus** (Groot-Brittannië) — vergelijkbaar maar iets kleiner, snavel dunner, bovenzijde donkerder en bruiner, wangen meer beige, scapulars minder wit; ssp. **italiae** (Italië, Z-Alpen) — vergelijkbaar met anglicus maar iets blekere onderbuik en blekere partijen op kop; kleinste ondersoort; ssp. **candidus** (ZO-Europa: Z-Oekraïne, Roemenië, ex-Joegoslavië) — vergelijkbaar van formaat met pinetorum.\n\n' +
    '**hispanus** (Iberisch schiereiland): Vergelijkbaar met anglicus en italiae. Snavel iets langer. Soms een rood borstband bij juvenielen.\n\n' +
    '**harterti** (Sardinië): Onderbuik intensief grijsbruin met erg donker rood op stuit. Snavel gemiddeld korter en slanker dan parroti. Omvat ssp. **parroti** (Corsica) — vrij groot, snavel dunner en slanker dan italiae.\n\n' +
    '**numidus** (Algerije, Tunesië): Brede zwarte borstband met rode veerranden. Rood tot op de helft van de stuit. Snavel lang en slank.\n\n' +
    '**mauritanus** (Marokko): Vergelijkbaar met hispanus. Vaak rood halvemaanvormig veld op borst, zonder zwart op het midden van de borst.',

  // ── Bronvermeldingen ────────────────────────────────────────────────────────
  bron_biometrie:         'Demongin (2016) p.210 — maten ssp. major; gewicht M&F gezamenlijk',
  bron_leeftijdsbepaling: 'Demongin (2016) p.210',
  bron_geslacht:          'Demongin (2016) p.210',
  bron_id_kenmerken:      'Demongin (2016) p.210',
  bron_ondersoorten:      'Demongin (2016) p.210',
  bron_ring:              'Demongin (2016) p.210',

  // ── Vangst-checklist ────────────────────────────────────────────────────────
  vangst_checklist: [
    { label: 'Vleugel',              type: 'meting', belang: 3 },
    { label: 'Snavel tot schedel',   type: 'meting', belang: 2 },
    { label: 'Gewicht',              type: 'meting', belang: 2 },
    { label: 'PC kleur',             type: 'obs',    belang: 3, note: 'Juv = dof bruin · Ad = glanzend zwart' },
    { label: 'Nek kleur',            type: 'obs',    belang: 3, note: 'Rood (ook spoor) = ♂ · Zwart = ♀' },
    { label: 'Iris',                 type: 'obs',    belang: 2, note: 'Bruin = juv · Roodbruin/rood = adult' },
    { label: 'Kroonvlek (juv)',      type: 'meting', belang: 2, note: '♂ 24–30 mm · ♀ 17–25 mm' },
    { label: 'P2–P10 punt',          type: 'obs',    belang: 2, note: 'Wit = juv · Geen wit P2–P5 = adult' },
  ],

  // ── Literatuurreferenties ────────────────────────────────────────────────────
  referenties_literatuur: [
    'Aulen & Lundberg (1991)',
    'Blasco-Zumeta & Heinze (2013)',
    'Coulson & Odin (2007)',
    'Demongin (2016)',
    'Garner (2014b)',
    'Gorman (1996)',
    'Gorman (1997)',
    'Gorman (2004)',
    'Kovalev (1996)',
    'Kovalev (1999)',
    'Norman (2003b)',
    'Norman (2004d)',
    'Olszewski (2007)',
    'Prins (1998)',
    'Smith (2010)',
    'Stenberg & Hogstad (2004)',
    'Winkler et al. (1995)',
  ],
};

// ─── Merge en upsert ──────────────────────────────────────────────────────────
const newData = { ...row.data, ...updates };

const { error: upsertErr } = await sb.from('species').upsert({
  euring_code: row.euring_code,
  naam_nl:     row.naam_nl,
  data:        newData,
});

if (upsertErr) { console.error('Upsert mislukt:', upsertErr.message); process.exit(1); }

console.log('✓', row.naam_nl, '(', EURING, ') — data bijgewerkt');
console.log('  Velden:', Object.keys(updates).join(', '));
