/**
 * Zwartkop — Sylvia atricapilla — EURING 12770
 * Bron: Demongin (2020) p.302–303
 * Maten voor ssp. atricapilla
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const EURING = '12770';

const { data: row, error: fetchErr } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .eq('euring_code', EURING)
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }
console.log('Huidige naam:', row.naam_nl);

const updates = {

  // ── Biometrie (ssp. atricapilla) ────────────────────────────────────────
  bio_vleugel_M_min:        71,    bio_vleugel_M_max:        81,
  bio_vleugel_F_min:        70,    bio_vleugel_F_max:        81,

  bio_staartlengte_M_min:   56,    bio_staartlengte_M_max:   65,
  bio_staartlengte_F_min:   56,    bio_staartlengte_F_max:   61,

  // Snavel tot schedel: gecombineerd M/F
  bio_snavel_schedel_min:   13.2,  bio_snavel_schedel_max:   18.1,

  // Tarsus: gecombineerd M/F
  bio_tarsus_lengte_min:    19.3,  bio_tarsus_lengte_max:    22.1,

  // Gewicht: gecombineerd M/F
  bio_gewicht_min:          15,    bio_gewicht_max:          25,

  // ── Pennen ─────────────────────────────────────────────────────────────
  pennen_structuur: {
    wp: '3 (4)',
  },

  vleugelformule:
    'P1: lang · P2: relatief kort\n' +
    'P2: gelijk aan P5 of gelijk aan P7/P8\n' +
    'P1 WP: 33.5–44 mm · P2 WP: [1.5] 4–8.5 mm · P4 WP: 0–1 mm · P5 WP: 1–4 mm · P6 WP: 3–10 mm · P10 WP: 13–20 mm\n' +
    'Uitgerand: P3–P5 · Inkeping: P2–P3 (P4) [P5]',

  // ── Rui ────────────────────────────────────────────────────────────────
  rui_notities:
    '**1e kj (3)** Gedeeltelijke postjuv-rui van (laat jun) jul–begin sep tot sep (midden okt). ' +
    'Omvat: lichaamsveren, alle kleine en middelste vleugeldekveren, 3–10 grote vleugeldekveren (gemiddeld 9 of 10), ' +
    'soms carpaaldekveren (CC), geen tot alle alula-veren (vaak geen of alula 1), geen tot alle tertialen, ' +
    'gewoonlijk geen stuurpennen (zelden alle of een deel), uitzonderlijk enkele binnenste armpennen, ' +
    'buitenste handpennen (gewoonlijk excentrisch, van P4 tot P6) of binnenste handpendekveren. ' +
    'Volledige rui mogelijk in aug–sep op het Iberisch Schiereiland. ' +
    'Soms gedeeltelijke prebroedse rui in de winter.\n\n' +
    '**Volwassen (4)** Volledige postbroedse rui van (jun) jul–aug tot midden aug–sep (midden okt). ' +
    'Zelden rui tijdelijk onderbroken na de rui van P10 of P9. ' +
    'Uitzonderlijk enkele kleine vleugeldekveren en S6 aangehouden. ' +
    'Soms gedeeltelijke prebroedse rui van dec tot mrt, waarschijnlijk afhankelijk van overwinteringslocatie; ' +
    'in Afrika inclusief enkele lichaamsveren en CC (vaak 4 binnenste grote vleugeldekveren, misschien alle) en tertialen, ' +
    'zelden enkele stuurpennen en alula 1; of slechts een deel van de lichaamsveren, of volledig onderdrukt ' +
    'in het noorden van het Europese overwinteringsgebied en ook op Corsica en Madeira.',

  // ── Leeftijdsbepaling ──────────────────────────────────────────────────
  // leeftijds_notities_nj ALTIJD '' — najaarblokken via {{07-12}} in vj
  leeftijds_notities_nj: '',

  leeftijds_notities_vj:
    '{{07-12}}\n' +
    '**3J** Kroonveren slecht gestructureerd, doffer en donkerder kaneelbruin dan bij ♀ V na postjuv-rui.\n\n' +

    '{{07-12}}\n' +
    '**1e kj (3)** Vaak contrast tussen binnenste (verruide) grote vleugeldekveren (GC) met groenachtig-grijze rand ' +
    'en buitenste (juveniele) GC met bruinachtige rand. Vaak hetzelfde contrast binnen de tertialen, ' +
    'of tussen verruide tertialen en juveniele armpennen, of tussen verruide alula 1 en rest van de juveniele alula, ' +
    'of tussen verruide carpaaldekveren (CC) en juveniele handpendekveren (PC). ' +
    'Verruide alula 1 en CC gelijkgekleurd aan aangrenzende kleine vleugeldekveren, geraamd met groenachtig grijs. ' +
    'Juveniele tertialen grijzer dan juveniele armpennen — kan lijken op een ruigrens. ' +
    'Zelden ruigrens binnen armpennen of handpennen. ' +
    'Iris grijsbruin of donkerbruin tot begin okt. ' +
    'Stuurpennen (TF) smal en puntig, maar grote overlap met adulten — weinig bruikbaar. ' +
    '♀ V is moeilijker op leeftijd te brengen dan ♂ M.\n\n' +

    '{{07-12}}\n' +
    '**na 1e kj (4)** Geen contrast binnen de vleugel; rand van GC, PC, CC en alula groenachtig grijs. ' +
    'Iris gewoonlijk lichter, meer roodbruin dan bij 1e kj (3), maar zelden zonder rode tint. ' +
    'TF vaak meer afgerond, maar grote overlap met 1e kj (3) — weinig bruikbaar.\n\n' +

    '{{01-06}}\n' +
    '**2e kj ♂ M (5 M)** Soms bruin op het voorhoofd. ' +
    'TF meer versleten en puntig dan bij adulten. ' +
    'Dezelfde vleugelcontrastkriteria als in de herfst zijn soms nog bruikbaar.',

  bron_leeftijdsbepaling: 'Demongin (2020) p.302–303',

  // ── Geslacht ───────────────────────────────────────────────────────────
  geslachts_notities_m:
    '**Najaar:**\n' +
    '- Na 1e kj ♂ M (4 M): Petje zwart, gewoonlijk zonder bruine tinten, behalve smalle randen in vers verenkleed; uitzonderlijk duidelijke bruine randen.\n' +
    '- 1e kj ♂ M (3 M): Petje gewoonlijk zwart met bruine eindtips (vooral op het voorhoofd) of geheel zwart. Uitzonderlijk geheel bruin — iets minder bruin en meer olijftint dan bij de meeste ♀ V; til de kruinveren op om groeiende of verborgen zwarte veren te zien.\n' +
    '- 3J ♂ M: Bruine rand van kruinveren vaak zwartachtig aangelopen.\n\n' +
    '**Voorjaar:**\n' +
    '- Petje geheel zwart of zwart met enkele bruine veren.',

  geslachts_notities_f:
    '**Najaar:**\n' +
    '- ♀ V na postjuv-rui: Petje helder bruin. Let op: zeldzame 1e kj ♂ M kan geheel bruin petje hebben — til de kruinveren op om groeiende zwarte veren te zien. Geslachtsbepaling van echte juvenielen (3J) is onbetrouwbaar.\n\n' +
    '**Voorjaar:**\n' +
    '- Petje bruin.',

  bron_geslacht: 'Demongin (2020) p.302–303',

  // ── ID-kenmerken ───────────────────────────────────────────────────────
  determinatie_id_notities:
    'Onmiskenbaar. Petje zwart (♂ M) of roodbruin (♀ V en 1e kj). Geen wit op de stuurpennen.\n\n' +
    'Melanistische individuen komen voornamelijk voor op de Atlantische eilanden (vooral Madeira). ' +
    '♂ M: hoofd en borst zwartachtig. ♀ V: onderdelen egaal donker olijfbruin, zonder bleke buik.\n\n' +
    'Uitzonderlijk hebben individuen (♀ V en juv?) een egaal olijfbruin hoofd zonder bruine kap — ' +
    'te onderscheiden van Tuinfluiter *(Sylvia borin)* op vleugelformule.\n\n' +
    '**Hybridisatie:**\n\n' +
    'Hybridisatie met Tuinfluiter *(Sylvia borin)* is mogelijk.',

  bron_id_kenmerken: 'Demongin (2020) p.302–303',

  // ── Ondersoorten (markdown string) ────────────────────────────────────
  ondersoorten:
    '**atricapilla** (Europa, W-Siberië, Klein-Azië)\n' +
    'Nominaatvorm. Lichte clinale variatie.\n\n' +
    '**dammholzi** (O-Turkije, Kaukasus, N-Iran)\n' +
    'Blekere en grijzere bovenzijde.\n\n' +
    '**paulucci** (Corsica, Sardinië, Balearen, centraal en Z-Italië, Tunesië)\n' +
    'Individuen van de Balearen worden soms als afzonderlijke ondersoort *koenigi* beschreven.\n\n' +
    '**heineken** (W en ZW-Iberisch Schiereiland, Madeira, Canarische Eilanden, Marokko, Algerije)\n' +
    'Onderdelen donkerder dan bij atricapilla. Keel niet significant bleker dan de zijkanten van de hals.\n\n' +
    '**gularis** (Kaapverdische Eilanden, Azoren)',

  bron_ondersoorten: 'Demongin (2020) p.302',

  // ── Ringgegevens ───────────────────────────────────────────────────────
  bron_ring: 'Demongin (2020) p.302–303',

  // ── Vangst-checklist ───────────────────────────────────────────────────
  vangst_checklist: [
    { label: 'Petje kleur',           type: 'observatie', belang: 3, note: 'zwart = ♂ M · bruin = ♀ V' },
    { label: 'GC-contrast',           type: 'observatie', belang: 3, note: 'binnenste GC groengrijs vs. buitenste GC bruin = 1e kj (3)' },
    { label: 'Alula / CC contrast',   type: 'observatie', belang: 2, note: 'verruide alula 1 of CC vs. rest = 1e kj (3)' },
    { label: 'Iris kleur',            type: 'observatie', belang: 2, note: 'grijsbruin = 1e kj (3) · roodbruin = adult' },
    { label: 'TF-vorm',               type: 'observatie', belang: 1, note: 'puntig = eerder 1e kj · afgerond = eerder adult (veel overlap)' },
    { label: 'Voorhoofd kleur (vj)',  type: 'observatie', belang: 1, note: 'bruin op voorhoofd = 2e kj ♂ M (5 M)' },
  ],

  // ── Referenties ────────────────────────────────────────────────────────
  referenties_literatuur: [
    'Blasco-Zumeta & Heinze (2013)',
    'Copete & Jorda (1993)',
    'Cuadrado et al. (1989)',
    'Fernandez (1993)',
    'Gargallo (1995a)',
    'Gargallo et al. (2011)',
    'Guallar et al. (2010)',
    'Jenni & Winkler (1994)',
    'Martinez & Aymí (1995)',
    'Morganti et al. (2013)',
    'Norman (2003d)',
    'Norman (2003j)',
    'Norman (2004e)',
    'Norman (2011)',
    'Norman (1990)',
    'Payevsky (1999)',
    'Phillips (1994)',
    'Ramos (1998)',
    'Rodriguez (1985)',
    'Shirihai (1988b)',
    'Shirihai et al. (2001a)',
    'Shirihai et al. (2002a)',
    'Smith (1979)',
    'Williamson (1967b)',
    'Wood (1982)',
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

console.log('✓ Updated Zwartkop (12770)');
