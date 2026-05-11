/**
 * update-huismus-data.js
 * Huismus (EURING 15910) — biometrie, rui, leeftijd, geslacht, ID, ondersoorten, referenties.
 * Bron: Demongin (2016) p.353–354 — ssp. domesticus en balearoibericus
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const EURING = '15910';

const { data: row, error: fetchErr } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .eq('euring_code', EURING)
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }
console.log('Huidige naam:', row.naam_nl);

const NJ = '{{07-12}}\n';
const VJ = '{{01-06}}\n';

const updates = {

  // ── Biometrie — ssp. domesticus en balearoibericus ─────────────────────────
  bio_vleugel_M_min: 74,   bio_vleugel_M_max: 85,
  bio_vleugel_F_min: 71,   bio_vleugel_F_max: 81,

  bio_staartlengte_M_min: 51,   bio_staartlengte_M_max: 68,
  bio_staartlengte_F_min: 52,   bio_staartlengte_F_max: 60,

  // Bill to skull (M&F gezamenlijk)
  bio_snavel_schedel_M_min: 14,   bio_snavel_schedel_M_max: 16.5,
  bio_snavel_schedel_F_min: 14,   bio_snavel_schedel_F_max: 16.5,
  bio_snavel_schedel_is_bill_to_feathers: false,

  // Bill depth to feathers (M&F gezamenlijk)
  bio_snavel_diepte_mid_M_min: 7.3, bio_snavel_diepte_mid_M_max: 9,
  bio_snavel_diepte_mid_F_min: 7.3, bio_snavel_diepte_mid_F_max: 9,

  // Tarsus (M&F gezamenlijk)
  bio_tarsus_lengte_M_min: 18.1, bio_tarsus_lengte_M_max: 21.2,
  bio_tarsus_lengte_F_min: 18.1, bio_tarsus_lengte_F_max: 21.2,

  // Gewicht (M&F gezamenlijk)
  bio_gewicht_M_min: 22.8, bio_gewicht_M_max: 35,
  bio_gewicht_F_min: 22.8, bio_gewicht_F_max: 35,

  // ── Pennenstructuur ────────────────────────────────────────────────────────
  pennen_structuur: {
    wp: 'P3 (soms P2 of P4)',
  },

  vleugelformule: '',

  // ── Rui ───────────────────────────────────────────────────────────────────
  rui_notities:
    '**1e kj (3)** Volledige postjuv-rui in de zomer. Vroege vogels (eerste leg) ruien al vanaf laat mei; gewoonlijk start laat jun of jul. Soms onregelmatige P-rui (in dalende volgorde) of onderbroken.\n\n' +
    '**na 1e kj (4)** Volledige postbroed-rui half jun–aug tot sep–okt (vroeg nov). S-rui convergerend van S1 en S8.',

  // ── Leeftijdsbepaling ─────────────────────────────────────────────────────
  leeftijds_notities_nj: '',

  leeftijds_notities_vj: [

    NJ +
    '**1e kj (3J/3)** Zomer–vroeg najaar: leeftijdsbepaling zeer moeilijk vanwege verlengd broedseizoen. Vroeg (3J): zonder versleten veren, naakte buik. In/na rui: als buitenste P nog actief groeien, zijn de veren relatief fris; P1 ≤ (0) 2–5 mm boven PC. ♂ M laat aug–sep soms in gemengd verenkleed (♂ M- en ♀ V-kenmerken gemengd); groeiende LC worden roestbruin.',

    NJ +
    '**na 1e kj (4)** Sterk versleten verenkleed. Als buitenste P nog actief groeien (vaak sep–okt): P1 ≤ 5–9 mm boven PC; veren sterk versleten. ♂ M met combinatie verse en versleten veren met roestbruin op bovenzijde.',

    VJ +
    '**1e kj / 2e kj (3/5) ♂ M** Na postjuv-rui: >80% van ♂ M te ouderdomsbepalen. MC1–MC8: proximale helft zwart, distale helft wit met vrijwel zwarte schacht. Smalle bruine zoom op alula 2. Kop minder intens: kroon grijsbruin, lores donkergrijs (veranderend met slijtage).\n♀ V: niet te ouderdomsbepalen na postjuv-rui (EURING leeftijdscode 2 — volgroeid).',

    VJ +
    '**na 1e kj / na 2e kj (4/6) ♂ M** Na postbroed-rui: MC1–MC8 vrijwel volledig wit; distaal deel van schacht zonder zwart. Brede roestbruine zoom op alula 2. Kop meer intens: kroon grijs, lores zwart (vervaagd in vers verenkleed).',

  ].join('\n\n'),

  // ── Geslacht ──────────────────────────────────────────────────────────────
  geslachts_notities_m:
    '- Na postjuv-rui: kin, keel en bovenborst zwart (in fris verenkleed gemasked door bleke puntveren). LC en zijkanten kop roestbruin. Mantel en scapulars met roestbruin\n' +
    '- Juv ♂ M (3J M): soms basaal deel keelveren donkergrijs, maar onbetrouwbaar in 10% van gevallen',

  geslachts_notities_f:
    '- Na postjuv-rui: kin, keel en bovenborst gelbwit. Kroon en nek dof grijsbruin met olijftint. Geen roestbruin in verenkleed\n' +
    '- Juv ♀ V (3J V): keel witachtig of zuiver wit, zonder grijs\n' +
    '- ♀ V niet te onderscheiden van ♀ V Spaanse Mus _P. hispaniolensis_; overlap in alle kenmerken',

  // ── ID-kenmerken ──────────────────────────────────────────────────────────
  determinatie_id_notities:
    'Zie vergelijkingstabel voor onderscheid met verwante mussen.\n\n' +
    '**Vergelijking Huismus / Italiaanse Mus / Spaanse Mus / Ringmus:**\n' +
    '| Kenmerk | Huismus | Italiaanse Mus | Spaanse Mus | Ringmus |\n' +
    '|---|---|---|---|---|\n' +
    '| Kroon ♂ M | Grijs centrum, kastanje zijkanten | Roestbruin, geen grijs | Roestbruin; supercilium duidelijk vóór oog | Kastanjebruin |\n' +
    '| Wangen ♂ M | Grijs | Wit | Witachtig | Wit + donkere vlek |\n' +
    '| Snavel (bill to feathers) | Vaak ≤ 14,5 mm | — | Vaak ≥ 14,5 mm; lang, dik aan basis | — |\n' +
    '| Rug/mantel ♂ M | Kastanjebruin, weinig contrast | Roodachtig, beige bretels | Zwart, witte bretels | — |\n' +
    '| Stuit | Ongestreept | Ongestreept | Zwart gestreept | — |\n' +
    '| Flanken ♂ M broedkleed | Zonder zwart | Zonder zwart (soms dun) | Zwaar zwart gevlekt | — |\n' +
    '| Zwart op onderzijde | Kin + keel + bovenborst | Kin + keel + bovenborst | Kin + keel + bovenborst | Alleen kin + keel |\n' +
    '| ♂ M vs ♀ V | Duidelijk verschillend | Duidelijk verschillend | Duidelijk verschillend | Gelijkend |\n\n' +
    '**Afwijkende vogels**\n\n' +
    '♀ V Huismus en ♀ V Spaanse Mus zijn in alle kenmerken niet te scheiden; er is overlap in alle criteria. ♀ V Italiaanse Mus is niet te onderscheiden van ♀ V Huismus.\n\n' +
    '**Hybridisatie**\n\n' +
    'Huismus × Ringmus: kroon roestbruin met grijs voorhoofd puntvormig uitlopend naar kroon, bef tussenliggend van grootte, klein wit vlekje boven één oog, vage vlek op witachtige wangen; soms grijze stuit en GC met witte punt; of uiterlijk gelijkend op Ringmus of kleine Huismus ♂ M.\n\n' +
    'Huismus × Spaanse Mus (via Italiaanse Mus): variabele hoeveelheid zwart op mantel, strepen op flanken en borstrand. Algemeen in N-Afrika, zeldzamer in Z-Europa.\n\n' +
    'Italiaanse Mus × Spaanse Mus: snavelvorm eerder als Italiaanse Mus; stuit soms zwart gevlekt of gestreept als Spaanse Mus; bovenzijde als Spaanse Mus maar vaak minder zwart; onderzijde variabel.\n\n' +
    'Taxonomie Italiaanse Mus: stabilized hybridspopulatie tussen Huismus en Spaanse Mus (genetisch bevestigd). In Z-Italië meer gelijkend op Spaanse Mus; in W-Sicilië en Malta vrijwel niet te onderscheiden van Spaanse Mus (ssp. maltae, maar strepen op flanken en bef minder uitgebreid). In Algerije, Tunesië en NW-Libië bevolkingen uiterst variabel.',

  // ── Ondersoorten ──────────────────────────────────────────────────────────
  ondersoorten:
    '**domesticus** (Europa excl. Italië, Corsica en bereik van balearoibericus): Donker. ♂ M postjuv met grijs centrumkroon. Iets kleiner en donkerder in Groot-Brittannië en Ierland dan in N- en Centraal-Europa.\n\n' +
    '**balearoibericus** (Mediterraan Frankrijk, centraal en O-Iberisch schiereiland, Balearen, Balkan, ex-Joegoslavië, Z- en O-Roemenië, Griekenland, centraal en W Klein-Azië): Lichter dan domesticus; intermediair tussen domesticus en biblicus.\n\n' +
    '**biblicus** (Levant): Zeer licht.\n\n' +
    '**tingitanus** (Marokko tot Libië): Kleur als balearoibericus, maar ♂ M met duidelijke zwarte strepen op kroon, soms volledig gespikkeld donkergrijs en zwart.\n\n' +
    '**niloticus** (Egypte): Even licht als biblicus maar kleiner.\n\n' +
    'Zeven andere ondersoorten in Azië. Ingevoerd op alle continenten.',

  // ── Bronvermeldingen ──────────────────────────────────────────────────────
  bron_biometrie:         'Demongin (2016) p.353–354 — ssp. domesticus en balearoibericus; bill to feathers MF 12,1–15,2 (niet opgeslagen); tarsus, snavel en gewicht M&F gezamenlijk',
  bron_leeftijdsbepaling: 'Demongin (2016) p.353–354',
  bron_geslacht:          'Demongin (2016) p.353',
  bron_id_kenmerken:      'Demongin (2016) p.353',
  bron_ondersoorten:      'Demongin (2016) p.353',
  bron_ring:              'Demongin (2016) p.353',

  // ── Vangst-checklist ─────────────────────────────────────────────────────
  vangst_checklist: [
    { label: 'Vleugel',         type: 'meting', belang: 3 },
    { label: 'Tarsus',          type: 'meting', belang: 2 },
    { label: 'Gewicht',         type: 'meting', belang: 2 },
    { label: 'LC + wangen',     type: 'obs',    belang: 3, note: 'Roestbruin LC en grijze wangen = ♂ M · Geen roestbruin = ♀ V' },
    { label: 'Keel/bovenborst', type: 'obs',    belang: 3, note: 'Zwart (gemasked in fris kleed) = ♂ M · Gelbwit = ♀ V' },
    { label: 'MC1–MC8',         type: 'obs',    belang: 3, note: 'Prox. helft zwart = 1e/2e kj ♂ M · Vrijwel volledig wit = na 1e/2e kj ♂ M (spring VJ-criterium)' },
    { label: 'Alula 2 zoom',    type: 'obs',    belang: 2, note: 'Smalle bruine zoom = 1e/2e kj ♂ M · Brede roestbruine zoom = na 1e/2e kj ♂ M' },
    { label: 'Stuit',           type: 'obs',    belang: 2, note: 'Ongestreept = Huismus · Gestreept = Spaanse Mus' },
  ],

  // ── Literatuurreferenties ─────────────────────────────────────────────────
  referenties_literatuur: [
    'Alonso (1984)',
    'Alonso (1985)',
    'Blasco-Zumeta & Heinze (2013)',
    'Bronne (2009)',
    'Clement (2011)',
    'Clement et al. (1996)',
    'Cordero (1990a)',
    'Cordero (1990b)',
    'Cordero (1991)',
    'Cordero & Summers-Smith (1993)',
    'Costantini (1996)',
    'Fernandez Garcia (1999)',
    'Folke Nyholm (1966)',
    'Guallar et al. (2010)',
    'Harper (1984)',
    'Hermansen et al. (2011)',
    'Hume (1983b)',
    'Laucht & Dale (2012)',
    'Lehto (1993)',
    'Lockley (1992)',
    'Lockley (1996)',
    'Lowther & Cink (2006)',
    'Metzmacher (1986)',
    'Morrison et al. (2008)',
    'Nero (1951)',
    'Norman (2004e)',
    'Shirihai et al. (2002a)',
    'Smith & Borg (1976)',
    'Summers-Smith (1979a)',
    'Summers-Smith (1980)',
    'Tollié (2009)',
    'Tricot (1968)',
    'Vollot (2013a)',
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
