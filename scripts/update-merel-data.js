/**
 * update-merel-data.js
 * Merel (EURING 11870) — biometrie, rui, leeftijd, geslacht, ID, ondersoorten, referenties.
 * Bron: Demongin (2016) p.264–265 — ssp. merula en aterrimus
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const EURING = '11870';

const { data: row, error: fetchErr } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .eq('euring_code', EURING)
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }
console.log('Huidige naam:', row.naam_nl);

const NJ = '{{07-12}}\n';
const VJ = '{{01-06}}\n';

const updates = {

  // ── Biometrie — ssp. merula en aterrimus ──────────────────────────────────
  bio_vleugel_M_min: 122, bio_vleugel_M_max: 138,
  bio_vleugel_F_min: 116, bio_vleugel_F_max: 132,

  bio_staartlengte_M_min: 105,  bio_staartlengte_M_max: 116,
  bio_staartlengte_F_min: 99,   bio_staartlengte_F_max: 112.5,

  // Bill to skull (MF gezamenlijk)
  bio_snavel_schedel_M_min: 23.8, bio_snavel_schedel_M_max: 32.5,
  bio_snavel_schedel_F_min: 23.8, bio_snavel_schedel_F_max: 32.5,
  bio_snavel_schedel_is_bill_to_feathers: false,

  // Tarsus (MF gezamenlijk)
  bio_tarsus_lengte_M_min: 30.2, bio_tarsus_lengte_M_max: 36,
  bio_tarsus_lengte_F_min: 30.2, bio_tarsus_lengte_F_max: 36,

  // Gewicht (M en F apart)
  bio_gewicht_M_min: 80,  bio_gewicht_M_max: 125,
  bio_gewicht_F_min: 70,  bio_gewicht_F_max: 120,

  // ── Pennenstructuur ────────────────────────────────────────────────────────
  pennen_structuur: {
    wp: 'P4 (soms P3 of P5)',
    hp: 10,
  },

  vleugelformule:
    'WP=(3)4(5) · P5 en P6 lang · P1 relatief lang · P2 kort\n' +
    'P1 WP 63–80 mm · P2 WP 10–15 mm · P3 WP (0)1–4 mm · P5 WP 0–(2) mm · P6 WP 2–7 mm · P10 WP 21–31 mm\n' +
    'Uitgerand: P3–P6 · Inkeping: P2–P4 (P5)\n' +
    'Bron: Demongin (2016) p.264',

  // ── Rui ───────────────────────────────────────────────────────────────────
  rui_notities:
    '**1e kj (3)** Gedeeltelijke postjuv-rui van jul–aug (sept) tot sept–okt. Insluitend: lichaamsveren, alle LC en MC (zelden gedeeltelijk), alle of deel van GC (gem. 5–7, zelden slechts 1), vaak CC, soms alula 1 (uitzonderlijk alle), soms 1–3 TF (zelden), soms S (met name S6; asymmetrisch en onregelmatig), uitzonderlijk enkele P en PG. Imm uit Centraal-Europa ruien meer GC dan uit Noord-Europa. Gedeeltelijke rui van lichaamsveren in winter (nader te onderzoeken).\n\n' +
    '**na 1e kj (4)** Volledige postbroed-rui van laat mei–aug tot aug–okt. Uitzonderlijk tijdelijke onderbreking van P-rui. Gedeeltelijke rui van lichaamsveren in winter (nader te onderzoeken).',

  // ── Leeftijdsbepaling ─────────────────────────────────────────────────────
  leeftijds_notities_nj: '',

  leeftijds_notities_vj: [

    NJ +
    '**3J** Bovenzijde, LC en MC met bleke streping. Onderzijde gespikkeld.\n♂ M: staartveren zwart of bijna zwart, soms moeilijk te beoordelen. Centrum bovenste keel zwartachtig.\n♀ V: staartveren olijfbruin, soms moeilijk te beoordelen. Centrum bovenste keel licht gespikkeld.',

    NJ +
    '**1e kj (3) ♂ M** Contrast buitenste GC (zwartbruin of bruin, soms bleke punt) met binnenste GC (zwart, geruid). Als alle GC geruid: zoek contrast met juv PC, in alula, in T of tussen T en S. Bovenzijde bruinzwart, nooit olijftint. Staartveren zwart maar P en S bruin. Snavel gewoonlijk bruinzwart tot dec–jan, dan progressief geel wordend. Juv centrale staartveer gewoonlijk smal en puntig.',

    NJ +
    '**1e kj (3) ♀ V** Zelfde soort contrast in vleugel als ♂ M. Juv veren roestbruin of grijsbruin, geruide veren olijfbruin. Snavel donker, gewoonlijk zonder geel vóór vroeg voorjaar. Juv centrale staartveer gewoonlijk smal en puntig.',

    NJ +
    '**na 1e kj (4) ♂ M** Volledig zwart of donker bruinzwart. Alle GC en T egaal zwart: geen contrast in vleugel. Snavel geel tot oranjeGeel. Centrale staartveer gewoonlijk breed.',

    NJ +
    '**na 1e kj (4) ♀ V** Bovenzijde donker grijsbruin, gewoonlijk met olijftint. Alle GC egaal donker olijfbruin: geen contrast in vleugel. Snavel donker roze of donker geelbruin, zelden zo geel als bij ♂ M. Centrale staartveer gewoonlijk breed.',

    VJ +
    '**2e kj (5) ♂ M** Contrast buitenste GC (zwartbruin, soms bleke punt) met binnenste GC (zwart, geruid). Als alle GC geruid: zoek contrast met juv PC, in alula, in T of tussen T en S. Snavel soms gedeeltelijk donker tot apr. Juv centrale staartveer gewoonlijk nog smal en puntig.',

    VJ +
    '**2e kj (5) ♀ V** Zelfde soort contrast als in het najaar: juv veren roestbruin of grijsbruin, geruide veren olijfbruin. Juv centrale staartveer gewoonlijk nog smal en puntig. Moeilijk te ouderdomsbepalen in jun–jul door slijtage.',

    VJ +
    '**Volwassen — niet nader te dateren** Geen GC-contrast: vleugel gelijkmatig versleten. Centrale staartveer breed. Kan 2e kj (5) zijn waarvan het contrast door slijtage verdwenen is (met name ♀ V in jun–jul), of ouder.',

  ].join('\n\n'),

  // ── Geslacht ──────────────────────────────────────────────────────────────
  geslachts_notities_m:
    '- Volledig zwart of donker bruinzwart verenkleed; staartveren zwart\n' +
    '- 1e kj (3) ♂ M: P en S bruin; snavel bruinzwart tot dec–jan, dan progressief geel wordend\n' +
    '- na 1e kj (4) ♂ M: snavel geel tot oranjeGeel; 2e kj (5) ♂ M soms snavel gedeeltelijk donker tot apr\n' +
    '- Juv (3J) ♂ M: staartveren zwart of bijna zwart (soms moeilijk te beoordelen); centrum bovenste keel zwartachtig',

  geslachts_notities_f:
    '- Bovenzijde donker grijsbruin, gewoonlijk met olijftint; keel en borst roestbruin gestreept of gevlekt zwart\n' +
    '- Staartveren olijfbruin; snavel donker roze of donker geelbruin, zelden zo geel als bij ♂ M\n' +
    '- Kleur onderzijde individueel sterk variabel, zonder correlatie met leeftijd\n' +
    '- Juv (3J) ♀ V: staartveren olijfbruin (soms moeilijk te beoordelen); centrum bovenste keel licht gespikkeld',

  // ── ID-kenmerken ──────────────────────────────────────────────────────────
  determinatie_id_notities:
    '**Vergelijking Merel / Beflijster:**\n' +
    '| Kenmerk | Merel | Beflijster |\n' +
    '|---|---|---|\n' +
    '| Vleugel | ≤ 138 (140) mm | ≥ 130 mm |\n' +
    '| Bleke randen P/S/CC | Geen | Bleke zilveren randen |\n' +
    '| Witte halve maan borst | Afwezig | Aanwezig (soms afwezig bij 1e kj ♀ V) |\n' +
    '| Schubbenpatroon onderzijde | Geen | Aanwezig (excl. na 1e kj ♂ M torquatus) |\n' +
    '| P1 − WP | 63–80 mm | 79–89 mm |\n' +
    '| P2 | Kort | Lang |\n' +
    '| P1 | Lang (relatief) | Kort |\n' +
    '| P10 − WP | 21–31 mm | 37–45 mm |\n\n' +
    '**Leucisme**\n\n' +
    'Talrijke gevallen van leucisme waarbij diverse delen van het verenkleed wit zijn.\n\n' +
    '**Hybridisatie**\n\n' +
    'Hybridisatie mogelijk met: Koperwiek _T. iliacus_, Kramsvogel _T. pilaris_, Zanglijster _T. philomelos_, Beflijster _T. torquatus_, Eilandlijster _T. poliocephalus_ en mogelijk Missellijster _T. viscivorus_.',

  // ── Ondersoorten ──────────────────────────────────────────────────────────
  ondersoorten:
    'Zeer geringe variatie in Europa, vrij clinaal. Zes andere ondersoorten in N-Afrika, Atlantische eilanden en Centraal-Azië.\n\n' +
    '**merula** (Europa excl. uiterste ZO): ♂ M zuiver zwart. ♀ V met donkerbruine bovenzijde.\n\n' +
    '**aterrimus** (Balkan, Griekenland, Kreta, Oekraïne, Kaukasus tot N-Iran): Doffer dan merula. ♀ V met minder bruine bovenzijde en grijzere onderzijde dan bij merula.\n\n' +
    '**syriacus** (ZO-Turkije, Levant, Irak, Iran, Turkmenistan): ♂ M meer dof leizwart dan zwart. ♀ V met significant grijzere onderzijde dan bij merula.',

  // ── Bronvermeldingen ──────────────────────────────────────────────────────
  bron_biometrie:         'Demongin (2016) p.264–265 — ssp. merula en aterrimus; snavel (bill to skull) en tarsus MF gezamenlijk',
  bron_leeftijdsbepaling: 'Demongin (2016) p.264–265',
  bron_geslacht:          'Demongin (2016) p.264–265',
  bron_id_kenmerken:      'Demongin (2016) p.264–265',
  bron_ondersoorten:      'Demongin (2016) p.264–265',
  bron_ring:              'Demongin (2016) p.264',

  // ── Vangst-checklist ─────────────────────────────────────────────────────
  vangst_checklist: [
    { label: 'Vleugel',          type: 'meting', belang: 3 },
    { label: 'Gewicht',          type: 'meting', belang: 2 },
    { label: 'Tarsus',           type: 'meting', belang: 2 },
    { label: 'Staartveren kleur',         type: 'obs',    belang: 3, note: 'Zwart = ♂ M · Olijfbruin = ♀ V (bij juv soms moeilijk)' },
    { label: 'GC contrast',      type: 'obs',    belang: 3, note: 'Buitenste juv vs binnenste geruide GC = 1e kj · Egale GC = na 1e kj' },
    { label: 'Centrale staartveer vorm', type: 'obs',    belang: 2, note: 'Smal en puntig = 1e kj · Breed = na 1e kj' },
    { label: 'Snavelkleur',      type: 'obs',    belang: 2, note: 'Bruinzwart tot dec–jan = 1e kj ♂ M · Geel-oranje = na 1e kj ♂ M' },
  ],

  // ── Literatuurreferenties ─────────────────────────────────────────────────
  referenties_literatuur: [
    'Baillie en Swann (1980)',
    'Blasco-Zumeta en Heinze (2013)',
    'Guallar et al. (2010)',
    'Jenni en Winkler (1994)',
    'Khokhlova (2009)',
    'Leverton (1989)',
    'Ottenby Bird Observatory (2015)',
    'Roselaar (2006b)',
    'Santos (1981)',
    'Selmi (2004)',
    'Shirihai et al. (2002a)',
    'Wysocki (2002)',
    'Zielińska et al. (2005)',
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
