/**
 * update-koolmees-data.js
 * Koolmees (EURING 14640) — biometrie, rui, leeftijd, geslacht, ID, ondersoorten, referenties.
 * Bron: Demongin p.328 — metingen ssp. major
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const EURING = '14640';

const { data: row, error: fetchErr } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .eq('euring_code', EURING)
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }
console.log('Huidige naam:', row.naam_nl);

const NJ = '{{07-12}}\n';
const VJ = '{{01-06}}\n';

const updates = {

  // ── Biometrie: ssp. major ────────────────────────────────────────────────
  bio_vleugel_M_min: 73,   bio_vleugel_M_max: 81,
  bio_vleugel_F_min: 70,   bio_vleugel_F_max: 78,

  bio_staartlengte_M_min: 58,   bio_staartlengte_M_max: 71.5,
  bio_staartlengte_F_min: 55,   bio_staartlengte_F_max: 67,

  // Bill to skull: M&F gezamenlijk
  bio_snavel_schedel_M_min: 11.6, bio_snavel_schedel_M_max: 13.5,
  bio_snavel_schedel_F_min: 11.6, bio_snavel_schedel_F_max: 13.5,

  // Bill depth (to feathers): M&F gezamenlijk
  bio_snavel_diepte_mid_M_min: 4.2, bio_snavel_diepte_mid_M_max: 4.7,
  bio_snavel_diepte_mid_F_min: 4.2, bio_snavel_diepte_mid_F_max: 4.7,

  bio_tarsus_lengte_M_min: 19.4, bio_tarsus_lengte_M_max: 22.2,
  bio_tarsus_lengte_F_min: 18.2, bio_tarsus_lengte_F_max: 20.9,

  // Gewicht: M&F gezamenlijk
  bio_gewicht_M_min: 14,  bio_gewicht_M_max: 22,
  bio_gewicht_F_min: 14,  bio_gewicht_F_max: 22,

  // ── Pennenstructuur ────────────────────────────────────────────────────────
  pennen_structuur: {
    wp: 'P4–P5 (soms P6)',
  },

  vleugelformule: '',

  // ── Rui ───────────────────────────────────────────────────────────────────
  rui_notities:
    '**1e kj (3)**\n\n' +
    'Gedeeltelijke postjuv-rui van laat jun/jul tot sep. Omvat lichaamsveren, alle LC en MC, 4–10 GC (gewoonlijk alle), meestal CC, alula, T en TE, uitzonderlijk 1 of 2 binnenste S en 1–5 binnenste PC.\n\n' +
    '**na 1e kj (4)**\n\n' +
    'Volledige postbroed-rui van half mei–jul tot laat jul–half okt.',

  // ── Leeftijdsbepaling ─────────────────────────────────────────────────────
  leeftijds_notities_nj: '',

  leeftijds_notities_vj: [

    NJ +
    '**1e kj, deels in jeugdkleed (3J)** — vóór postjuv-rui\n' +
    'Wangen lichtgeel, niet omgeven door zwart. Kroon dof zwart. Onderzijde dof geel; middenstreep onduidelijk.',

    NJ +
    '**1e kj (3)** — in/na postjuv-rui → in jan: 2e kj (5)\n' +
    'Juv PC en vaak middelste veer van alula begrensd met dof blauwachtig groenig-grijs op buitenweb, contrasterend met dieper blauwgrijs MC en enigszins met gemoulte blauw of blauwgrijs begrensde GC. Contrast duidelijker bij ♂ M dan bij ♀ V. Juv alula 2 vaak contrasterend met blauwere gemoulte alula 1. Zelden contrast tussen juv buitenste GC (zonder blauw, grijsachtig centrum) en gemoulte binnenste GC. Juv TF en T meer versleten dan bij na 1e kj (4); PC meer puntig. Iris donkerbruin, typisch grijsachtig getint in najaar.\n' +
    'Let op: leeftijdsbepaling via PC–GC-contrast soms lastig, met name bij oostelijke individuen.',

    NJ +
    '**na 1e kj (4)**\n' +
    'PC en alula vrijwel van hetzelfde blauw als GC, geen contrast. Soms slechts een smal blauwachtig randje aan PC — geeft doffe indruk, soms gelijkend op 1e kj (3), met name bij ♀ V. Geen ruigrens binnen GC, alula, T of TF. PC meer afgerond. Iris helder bruin met roodachtige tint.\n' +
    'Let op: uitzonderlijk wangen met iets geel bij na 1e kj (4).',

    VJ +
    '**2e kj (5)** (= vorig najaar: 1e kj (3))\n' +
    'Dezelfde criteria als in najaar: juv PC dof blauwachtig groenig-grijs, contrasterend met GC. Slijtage van dekveren is relatief laag, waardoor criteria tot in het voorjaar of zelfs de zomer bruikbaar blijven. Slijtage kan het contrast soms juist makkelijker zichtbaar maken.',

    VJ +
    '**na 2e kj (6)**\n' +
    'Dezelfde criteria als in najaar: PC en alula vrijwel gelijk blauw als GC, geen contrast. Soms enigszins gelijkend op 2e kj (5) door smal randje, met name bij ♀ V.',

  ].join('\n\n'),

  // ── Geslacht ──────────────────────────────────────────────────────────────
  geslachts_notities_m:
    '- Kroon en keel helder blauwachtig-zwart\n' +
    '- Centrale streep op onderzijde gewoonlijk helder, breed, vormt brede vlek op buik tussen benen (bij 1e kj ♂ M (3) soms met witte randen)\n' +
    '- Rand van PC bij 1e kj ♂ M, deels in jeugdkleed (3J M): soms blauwgrijs — alleen bruikbaar als duidelijk spoor van blauw zichtbaar is; niet meetellen bij groenige, grijsachtige of bruinachtige rand',

  geslachts_notities_f:
    '- Zwarte kleur mat, met name op kin en bovenkeel; kroon soms zwarter en helderder\n' +
    '- Centrale streep op onderzijde mat zwartgrijs, zeer smal op borst, soms onderbroken\n' +
    '- Vlek tussen benen klein, gemengd met witachtig\n' +
    '- Postjuv dekveren gewoonlijk minder blauw dan bij ♂ M, rand soms licht groenig getint\n' +
    '- Broedvlek en buikvlek beoordelen vóór het blazen van veren',

  // ── ID-kenmerken ──────────────────────────────────────────────────────────
  determinatie_id_notities:
    '**Onmiskenbaar.** Groot. Kop zwart, wangen wit. Zwarte middenstreep op onderzijde opvallend.\n\n' +
    '**Afwijkende vogels**\n\n' +
    'Sommige individuen atypisch bleek: bovenzijde grijs i.p.v. groen, buik vuil wit i.p.v. geel (gelijkend op oosterse ondersoorten). Overal waarneembaar, ongeacht geografische herkomst; mogelijk een tijdelijke kleurverandering, genetisch bepaald of door voeding.\n\n' +
    '**Verwisseling met Turkestan Mees** _Parus bokharensis_\n\n' +
    'Gelijkend op cinereus-groep, maar staart langer en witter, snavel forsser, zwarte middenstreep op onderzijde smaller in het midden van de buik.\n\n' +
    '**Hybridisatie**\n\n' +
    'Hybridisatie mogelijk met Pimpelmees _Cyanistes caeruleus_ (zie die soort), Glanskop _Poecile palustris_ (zie die soort), Matkop _Poecile montanus_, Zwarte Mees _Periparus ater_ en Turkestan Mees _Parus bokharensis_.',

  // ── Ondersoorten ──────────────────────────────────────────────────────────
  ondersoorten:
    '**Groep 1 — major-groep** (bovenzijde groen, onderzijde grotendeels geel; in O-Middellandse Zee en Nabije Oosten onderzijde bleker geel en bovenzijde grijzer):\n\n' +
    '**major** (Eurazië van Scandinavië en Frankrijk tot Altai, N-Spanje en Italië, ex-Joegoslavië, Bulgarije, Klein-Azië, N-Iran, Transkaukasië): Nominaatvorm.\n\n' +
    '**newtoni** (Groot-Brittannië, Ierland).\n\n' +
    '**corsus** (Corsica, Portugal, Z-Spanje).\n\n' +
    '**mallorcae** (Balearen).\n\n' +
    '**ecki** (Sardinië).\n\n' +
    '**excelsus** (Marokko tot Tunesië).\n\n' +
    '**aphrodite** (Z-Italië, Sicilië, Griekenland, eilanden O-Middellandse Zee excl. Kreta).\n\n' +
    '**niethammeri** (Kreta).\n\n' +
    '**terraesanctae** (Levant).\n\n' +
    '**karelini** (ZO-Azerbeidzjan, N-Iran).\n\n' +
    '**blanfordi** (N-Irak tot W-Iran).\n\n' +
    '**kapustini** (ZO-Kazachstan tot Zee van Ochotsk).\n\n' +
    '**Groep 2 — cinereus-groep** (Transcaspië tot ZO-Azië): bovenzijde blauwgrijs, onderzijde wit. 13 ondersoorten.\n\n' +
    '**Groep 3 — minor-groep** (Tibet tot Japan): bovenzijde groenig, onderzijde witachtig. 9 ondersoorten.',

  // ── Bronvermeldingen ──────────────────────────────────────────────────────
  bron_biometrie:         'Demongin (2016) p.328 — ssp. major; snavel en gewicht M&F gezamenlijk',
  bron_leeftijdsbepaling: 'Demongin (2016) p.328',
  bron_geslacht:          'Demongin (2016) p.328',
  bron_id_kenmerken:      'Demongin (2016) p.328',
  bron_ondersoorten:      'Demongin (2016) p.328',
  bron_ring:              'Demongin (2016) p.328',

  // ── Vangst-checklist ─────────────────────────────────────────────────────
  vangst_checklist: [
    { label: 'Vleugel',         type: 'meting', belang: 3 },
    { label: 'Tarsus',          type: 'meting', belang: 2 },
    { label: 'Gewicht',         type: 'meting', belang: 2 },
    { label: 'Wangen',          type: 'obs',    belang: 3, note: 'Lichtgeel (niet omgeven door zwart) = 1e kj vóór rui (3J)' },
    { label: 'PC-kleur vs. GC', type: 'obs',    belang: 3, note: 'Dof groenig-grijs, contrasterend = 1e kj (3) · Gelijk blauw = na 1e kj (4)' },
    { label: 'Buikvlek',        type: 'obs',    belang: 3, note: 'Breed/helder = ♂ M · Smal/mat, soms onderbroken = ♀ V (beoordeel vóór blazen)' },
    { label: 'Broedvlek',       type: 'obs',    belang: 3, note: 'BP = ♀ V zeker' },
  ],

  // ── Literatuurreferenties ─────────────────────────────────────────────────
  referenties_literatuur: [
    'Blasco-Zumeta & Heinze (2013)',
    'Dhondt (1981)',
    'Duquet (1995)',
    'Eck & Martens (2006)',
    'Fouargue (1996)',
    'Gosler (1987)',
    'Gosler (1999)',
    'Guallar et al. (2010)',
    'Harrap & Quinn (1995)',
    'Jenni & Winkler (1994)',
    'Nowakowski & Rowiński (1996)',
    'Orell & Ojanen (1980)',
    'Ottenby Bird Observatory (2015z)',
    'Petterson (1981)',
    'Roselaar (2007b)',
    'Rymkevich & Bojarinova (1996)',
    'Savioz et al. (2011)',
    'Shirihai et al. (2002a)',
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
