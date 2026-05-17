/**
 * Zanglijster — Turdus philomelos — EURING 12000
 * Bron: Demongin (2020) p.266
 * Maten voor ssp. philomelos
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const EURING = '12000';

const { data: row, error: fetchErr } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .eq('euring_code', EURING)
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }
console.log('Huidige naam:', row.naam_nl);

const updates = {

  // ── Biometrie (ssp. philomelos) ─────────────────────────────────────────
  bio_vleugel_M_min:        111,   bio_vleugel_M_max:        127.5,
  bio_vleugel_F_min:        109,   bio_vleugel_F_max:        119,

  bio_staartlengte_M_min:   81,    bio_staartlengte_M_max:   90,
  bio_staartlengte_F_min:   75,    bio_staartlengte_F_max:   87,

  // Snavel tot schedel: gecombineerd M/F (F: idem)
  bio_snavel_schedel_min:   21.0,  bio_snavel_schedel_max:   25.4,

  // Tarsus: gecombineerd M/F (F: idem)
  bio_tarsus_lengte_min:    30.0,  bio_tarsus_lengte_max:    34.5,

  // Gewicht: gecombineerd M/F (F: idem), hoofdbereik zonder [uitschieters]
  bio_gewicht_min:          58.5,  bio_gewicht_max:          90,

  // ── Pennen ─────────────────────────────────────────────────────────────
  pennen_structuur: {
    wp: '3 4',
  },

  vleugelformule:
    'P1: zeer kort · P2: lang\n' +
    'P5: kort · P6: kort\n' +
    'P1 WP: 79–89 mm · P2 WP: 3–6 mm · P5 WP: 3–6 mm · P6 WP: 12–18 mm · P10 WP: 26–35 mm\n' +
    'Uitgerand: P3–P5 · Inkeping: P2–P3 (P4)',

  // ── Rui ────────────────────────────────────────────────────────────────
  rui_notities:
    '**1e kj (3)** Gedeeltelijke postjuv-rui van jul tot begin okt. ' +
    'Omvat: lichaamsveren, alle kleine vleugeldekveren, gewoonlijk alle middelste vleugeldekveren, ' +
    '0–10 grote vleugeldekveren (gemiddeld 3 of 4 binnenste; uitzonderlijk 10), ' +
    'zelden carpaaldekveren (CC) en alula 1, uitzonderlijk alula 2, enkele tertialen en stuurpennen.\n\n' +
    '**Volwassen (4)** Volledige postbroedse rui van [midden jun] laat jun–midden aug [begin sep] ' +
    'tot [begin aug] midden aug–midden okt. Uitzonderlijk rui van de handpennen tijdelijk onderbroken.',

  // ── Leeftijdsbepaling ──────────────────────────────────────────────────
  // leeftijds_notities_nj ALTIJD '' — najaarblokken via {{07-12}} in vj
  leeftijds_notities_nj: '',

  leeftijds_notities_vj:
    '{{07-12}}\n' +
    '**3J** Mantelveren, kleine en middelste vleugeldekveren met bleke schachtstreep.\n\n' +

    '{{07-12}}\n' +
    '**1e kj (3)** Gewoonlijk duidelijk contrast tussen de binnenste (verruide) grote vleugeldekveren (GC), ' +
    'olijftint met geel-buff eindtip, en de buitenste (juveniele) GC, roestbruin met een duidelijkere ' +
    'en triangulaire gele vlek aan de tip (met name op de binnenste juveniele GC). ' +
    'Als geen GC zijn verruide, hebben de binnenste GC een duidelijke gele schachtstreep. ' +
    'Zelden contrast tussen verruide alula 1 en rest van de juveniele alula. ' +
    'Handpendekveren (PC) roestig gekleurd; langste PC meer contrasterend dan bij adult: ' +
    'buitenvlag geel-buff of lichtbruin met roestkleur. ' +
    'Stuurpennen (TF), met name TF1, gewoonlijk puntig. ' +
    'Zelden ruigrens binnen de tertialen. ' +
    'Let op bij ssp. clarkei en hebridensis: bovenzijde bij 1e kj met weinig of geen kleurcontrast in GC — ' +
    'controleer dan ook de vorm van de TF en het bleke uiteinde van de GC.\n\n' +

    '{{07-12}}\n' +
    '**na 1e kj (4)** Geen ruigrens in GC; geel-buff eindtip op GC gemiddeld kleiner dan bij juv GC, ' +
    'niet langs de schacht doorlopend, zonder abrupte verandering in vorm tussen aangrenzende GC. ' +
    'Tertialen, GC en PC olijftint. ' +
    'Langste PC doffer en egaler gekleurd dan bij 1e kj: buitenvlag bruin omrand. ' +
    'TF, met name TF1, gewoonlijk minder puntig.\n\n' +

    '{{01-06}}\n' +
    '**2e kj (5)** Hetzelfde GC-contrast als in de herfst meestal nog bruikbaar. ' +
    'Bij versleten verenkleed soms een duidelijke driehoekige inkeping op de GC zichtbaar.',

  bron_leeftijdsbepaling: 'Demongin (2020) p.266',

  // ── Geslacht ───────────────────────────────────────────────────────────
  geslachts_notities_m: '',

  geslachts_notities_f:
    '- Duidelijke broedplakvlek (BP) duidt op ♀ V.',

  bron_geslacht: 'Demongin (2020) p.266',

  // ── ID-kenmerken ───────────────────────────────────────────────────────
  determinatie_id_notities:
    'Onderzijde vleugeldekveren geel-buff. Onderdelen wit, geel-buff getint op borst en flanken, zwaar gevlekt.\n\n' +
    '**Onderscheid met Merel (juv):**\n' +
    '- Vleugelformule verschilt (zie Merel).\n\n' +
    '**Onderscheid met Grote Lijster:**\n' +
    '- Veel groter.\n' +
    '- Onderzijde vleugeldekveren wit (bij Zanglijster geel-buff).\n' +
    '- Brede witachtige eindtip op de buitenste stuurpennen.\n\n' +
    '**Hybridisatie:**\n\n' +
    'Hybridisatie met Merel *(Turdus merula)* is mogelijk.',

  bron_id_kenmerken: 'Demongin (2020) p.266',

  // ── Ondersoorten (markdown string) ────────────────────────────────────
  ondersoorten:
    '**philomelos** (Europa excl. W; W-Siberië)\n' +
    'Bovenzijde olijfgrijs-bruin zonder roestkleur, contrasteert met meer roodachtige staart en vleugels. ' +
    'Onderdelen eerder roomkleurig.\n\n' +
    '**clarkei** (Britse Eilanden excl. uiterste NW; W en centraal Nederland en België, NW en W-Frankrijk)\n' +
    'Bovenzijde warm bruin, weinig of geen contrast met olijfbruin roodachtig getinte stuit. ' +
    'Onderdelen eerder buff getint. Meest voorkomende ondersoort in Nederland.\n\n' +
    '**hebridensis** (Hebriden, Skye)\n' +
    'Bovenzijde donkerder bruin dan clarkei, contrasteert met vrij grijze stuit. ' +
    'Vlekken op borst groter en zwarter.\n\n' +
    '**nataliae** (centraal Siberië, ZW-Azië)\n' +
    'Groter (vleugel 112–130 mm), bleker en grijzer dan philomelos.',

  bron_ondersoorten: 'Demongin (2020) p.266',

  // ── Ringgegevens ───────────────────────────────────────────────────────
  bron_ring: 'Demongin (2020) p.266',

  // ── Vangst-checklist ───────────────────────────────────────────────────
  vangst_checklist: [
    { label: 'GC-contrast',      type: 'observatie', belang: 3, note: 'olijf binnenste vs. roestbruin buitenste GC = 1e kj (3)' },
    { label: 'TF1-vorm',         type: 'observatie', belang: 2, note: 'puntig = 1e kj · minder puntig = adult' },
    { label: 'PC-kleur',         type: 'observatie', belang: 2, note: 'roestig + geel-buff buitenvlag = 1e kj · olijf = adult' },
    { label: 'Broedplakvlek',    type: 'observatie', belang: 2, note: 'duidelijke BP aanwezig = ♀ V' },
    { label: 'GC-inkeping (vj)', type: 'observatie', belang: 1, note: 'driehoekige inkeping op versleten GC = 2e kj (5)' },
  ],

  // ── Referenties ────────────────────────────────────────────────────────
  referenties_literatuur: [
    'Aymí (1990)',
    'Blasco-Zumeta & Heinze (2013)',
    'Gargallo et al. (2011)',
    'Guallar et al. (2010)',
    'Jenni & Winkler (1994)',
    'Ottenby Bird Observatory (2015l)',
    'Santos (1981)',
    'Shirihai et al. (2002a)',
    'Demongin (2016)',
  ],
};

// ── Merge en upsert ────────────────────────────────────────────────────────
const merged = { ...(row.data || {}), ...updates };

const { error: upsertErr } = await sb.from('species').upsert({
  euring_code: EURING,
  naam_nl: row.naam_nl,
  data: merged,
});

if (upsertErr) {
  console.error('Upsert mislukt:', upsertErr.message);
  process.exit(1);
}

console.log('✓ Updated Zanglijster (12000)');
