/**
 * update-heggenmus-data.js
 * Heggenmus (EURING 10840) — biometrie, rui, leeftijd, geslacht, ID, ondersoorten, referenties.
 * Bron: Demongin (2016) p.243–244
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const EURING = '10840';

const { data: row, error: fetchErr } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .eq('euring_code', EURING)
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }
console.log('Huidige naam:', row.naam_nl);

const NJ = '{{07-12}}\n';
const VJ = '{{01-06}}\n';

const updates = {

  // ── Biometrie ─────────────────────────────────────────────────────────────
  bio_vleugel_M_min: 65,   bio_vleugel_M_max: 75,
  bio_vleugel_F_min: 63,   bio_vleugel_F_max: 73,

  // Staart, snavel, tarsus, gewicht: M&F gezamenlijk
  bio_staartlengte_M_min: 53,   bio_staartlengte_M_max: 65,
  bio_staartlengte_F_min: 53,   bio_staartlengte_F_max: 65,

  bio_snavel_schedel_M_min: 13.6, bio_snavel_schedel_M_max: 15.6,
  bio_snavel_schedel_F_min: 13.6, bio_snavel_schedel_F_max: 15.6,

  bio_tarsus_lengte_M_min: 19.4, bio_tarsus_lengte_M_max: 22.6,
  bio_tarsus_lengte_F_min: 19.4, bio_tarsus_lengte_F_max: 22.6,

  bio_gewicht_M_min: 16,  bio_gewicht_M_max: 24,
  bio_gewicht_F_min: 16,  bio_gewicht_F_max: 24,

  // ── Pennenstructuur ────────────────────────────────────────────────────────
  pennen_structuur: {
    wp: 'P4 (soms P3 of P5)',
  },

  vleugelformule: '',

  // ── Rui ───────────────────────────────────────────────────────────────────
  rui_notities:
    '**1e kj (3)** Gedeeltelijke postjuv-rui van laat jun/jul tot sep–half okt. Omvat doorgaans lichaamsveren, alle LC en MC (zelden 1 MC aangehouden), vaak geen GC maar uitzonderlijk alle, zelden CC, alula 1 en alula 2, zelden 1–3 T, soms alle of een deel van de TF (en S). In één geval symmetrische rui van PC gedocumenteerd.\n\n' +
    '**na 1e kj (4)** Volledige postbroed-rui van (laat jun) half jul–aug tot (half aug) laat aug–half okt. TF-rui onregelmatig.',

  // ── Leeftijdsbepaling ─────────────────────────────────────────────────────
  leeftijds_notities_nj: '',

  leeftijds_notities_vj: [

    NJ +
    '**1e kj, deels in jeugdkleed (3J)** Vóór postjuv-rui: doffer. Nek, borst en flanken intensief donker gestreept. Geen zuiver grijs (behalve iets op keel). Bovenzijde bruiner, minder roodachtig.',

    NJ +
    '**1e kj (3)** Iris dof grijsbruin of grijsolijf, soms tot in dec; vanaf laat aug soms met lichte roodachtige tint (niet gebruiken bij tussenliggende kleur). Juv GC2–GC9 met duidelijke geelachtige vlekken op beide wimpels en duidelijke zwarte punt (duidelijk contrasterend met lichte vlekken); geelachtige vlekken op juv GC verkleuren met slijtage tot witachtig. Soms contrasteren juv GC met gemoulte binnenste GC met onduidelijke witachtige vlekken of zelfs zonder lichte vlekken op GC9 en GC10. Gemoulte buitenste GC vaak met grijsachtige tint; minder versleten en steviger van structuur. Ruigrens vaak moeilijk te vinden en ontbreekt bij veel 1e kj. Als alle GC gemoulted: zoek ruigrens binnen alula en tussen gemoulte T en juv S met minder donker centrum. Soms enkele juv MC met geelachtige punt aangehouden.',

    NJ +
    '**na 1e kj (4)** Iris lichter roodbruin (soms lichtbruin, soms even grijsachtig als bij 1e kj (3)). Doorgaans witachtige vlekken op buitenste GC, weinig of geen op binnenste; onduidelijke lichte vlekken, zwarte punt en bruinachtige rand vloeien in elkaar over. Geen contrast tussen T en S. MC zonder geelachtige punt.',

    VJ +
    '**2e kj (5)** (= vorig najaar: 1e kj (3)) Iris dof grijsbruin of grijsolijf; soms met lichte roodachtige tint. Juv GC met duidelijke geelachtige (of door slijtage witachtige) vlekken en duidelijke zwarte punt. Ruigrens vaak moeilijk te vinden. Let op: leeftijdsbepaling via verenkleed is zeer moeilijk; ervaring vereist.',

    VJ +
    '**na 2e kj (6)** (= vorig najaar: na 1e kj (4)) Iris lichter roodbruin. GC-vlekken onduidelijk; geen contrast tussen T en S. MC zonder geelachtige punt.',

  ].join('\n\n'),

  // ── Geslacht ──────────────────────────────────────────────────────────────
  geslachts_notities_m:
    '- Broedvlek (BP) en uitstekende cloaca betrouwbaar\n' +
    '- Kin, keel en borst gemiddeld meer loodgrijs\n' +
    '- Imm ♂ M en ad ♀ V zijn vaak niet van elkaar te onderscheiden',

  geslachts_notities_f:
    '- Broedvlek betrouwbaar\n' +
    '- Kin, keel en borst gemiddeld paler grijs, vaak met olijfbruine en witachtige zomen\n' +
    '- Imm ♂ M en ad ♀ V zijn vaak niet van elkaar te onderscheiden',

  // ── ID-kenmerken ──────────────────────────────────────────────────────────
  determinatie_id_notities:
    'Kop en borst grijsachtig. Bovenzijde bruin, zwart gestreept. Snavel dun en spits.',

  // ── Ondersoorten ──────────────────────────────────────────────────────────
  ondersoorten:
    '**modularis** (grootste deel van Europa excl. Britse eilanden; O tot Oeral): Nominaatvorm. P2 ≥ (0) 1–5 mm tot P7, P2 = 6/7 of ~6.\n\n' +
    '**mabbotti** (Z-Frankrijk, Iberisch schiereiland, Italië, mogelijk Griekenland), **meinertzhageni** (ZW-Balkan), **euxina** (NW Klein-Azië) en **fuscata** (Krim): Zeer gelijkend op nominaatvorm.\n\n' +
    '**occidentalis** en **hebridium** (Britse eilanden): Donkerder dan modularis met opvallendere strepen op bovenzijde. Ssp. hebridium zeer donker, meer loodgrijs op borst. P2 ≤ 3 tot ≥ 3 mm tot PT, P2 = 6/8.\n\n' +
    '**obscura** (Kaukasus, Transkaukasië): De lichtste ondersoort. Meer bruinachtig gewassen, vooral op flanken en zijkanten van kop en nek (kop minder grijs). Grijs op borst schubachtig door witte vlekken en bruinachtige tint.',

  // ── Bronvermeldingen ──────────────────────────────────────────────────────
  bron_biometrie:         'Demongin (2016) p.243–244 — staart, snavel, tarsus en gewicht M&F gezamenlijk',
  bron_leeftijdsbepaling: 'Demongin (2016) p.244',
  bron_geslacht:          'Demongin (2016) p.243',
  bron_id_kenmerken:      'Demongin (2016) p.243',
  bron_ondersoorten:      'Demongin (2016) p.243',
  bron_ring:              'Demongin (2016) p.243',

  // ── Vangst-checklist ─────────────────────────────────────────────────────
  vangst_checklist: [
    { label: 'Vleugel',          type: 'meting', belang: 3 },
    { label: 'Tarsus',           type: 'meting', belang: 2 },
    { label: 'Gewicht',          type: 'meting', belang: 2 },
    { label: 'GC vlekken',       type: 'obs',    belang: 3, note: 'Geelachtig/witachtig met duidelijke zwarte punt = 1e/2e kj (3/5) · Onduidelijk, vloeien in elkaar over = na 1e/2e kj (4/6)' },
    { label: 'Iris kleur',       type: 'obs',    belang: 2, note: 'Dof grijsbruin/grijsolijf = 1e/2e kj (3/5) · Lichter roodbruin = na 1e/2e kj (4/6)' },
    { label: 'Broedvlek/cloaca', type: 'obs',    belang: 3, note: 'BP = ♀ V zeker · Uitstekende cloaca = ♂ M zeker' },
  ],

  // ── Literatuurreferenties ─────────────────────────────────────────────────
  referenties_literatuur: [
    'Blasco-Zumeta & Heinze (2013)',
    'Dal Molin & Joubert (2000)',
    'Ginn (1975)',
    'Guallar et al. (2010)',
    'Herremans & Caekebeke (2004)',
    'Jenni & Winkler (1994)',
    'Menzie (2014)',
    'Menzie & Malmhagen (2013)',
    'Ottenby Bird Observatory (2015e)',
    'Scott (1965a)',
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
