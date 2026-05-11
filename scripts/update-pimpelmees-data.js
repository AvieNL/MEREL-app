/**
 * update-pimpelmees-data.js
 * Pimpelmees (EURING 14620) — biometrie, rui, leeftijd, geslacht, ID, ondersoorten, referenties.
 * Bron: Demongin p.326-327
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const EURING = '14620';

const { data: row, error: fetchErr } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .eq('euring_code', EURING)
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }
console.log('Huidige naam:', row.naam_nl);

// ─── Biometrie: ssp. caeruleus caeruleus, adult ───────────────────────────────
const updates = {

  bio_vleugel_M_min: 64,   bio_vleugel_M_max: 73,
  bio_vleugel_F_min: 60,   bio_vleugel_F_max: 69,

  bio_staartlengte_M_min: 49,  bio_staartlengte_M_max: 57,
  bio_staartlengte_F_min: 47,  bio_staartlengte_F_max: 52,

  // Bill to skull: M&F gezamenlijk opgegeven
  bio_snavel_schedel_M_min: 8.3, bio_snavel_schedel_M_max: 9.7,
  bio_snavel_schedel_F_min: 8.3, bio_snavel_schedel_F_max: 9.7,

  bio_tarsus_lengte_M_min: 16.2, bio_tarsus_lengte_M_max: 18.2,
  bio_tarsus_lengte_F_min: 15.7, bio_tarsus_lengte_F_max: 18.2,

  // Gewicht: M&F gezamenlijk
  bio_gewicht_M_min: 9,  bio_gewicht_M_max: 13.5,
  bio_gewicht_F_min: 9,  bio_gewicht_F_max: 13.5,

  // ── Pennenstructuur ─────────────────────────────────────────────────────────
  pennen_structuur: {
    wp: 'P4–P5 (soms P3 of P6)',
  },

  vleugelformule: '',

  // ── Rui ─────────────────────────────────────────────────────────────────────
  rui_notities:
    '**Juveniel [3]**\n' +
    'Gedeeltelijke postjuv-rui van half jun/mid-jul tot vroeg okt. Omvat lichaamsveren, alle LC en MC, 4–10 GC (gewoonlijk alle), meestal CC, alula en T, geen tot alle TF (gewoonlijk TF1; vaak alle, met name bij vogels uit zuidelijke populaties), uitzonderlijk 1 of 2 binnenste S.\n\n' +
    '**Adult [4]**\n' +
    'Volledige postbroed-rui van half mei–jul tot aug–sep(-okt).',

  // ── Leeftijdsbepaling ───────────────────────────────────────────────────────
  // Elke alinea heeft zijn eigen {{MM-MM}}-marker (renderLeeftijdMarkdown filtert per alinea).
  leeftijds_notities_nj: '',

  leeftijds_notities_vj: [

    '{{07-12}}\n' +
    '**Juveniel [3J]** — vóór postjuv-rui\n' +
    'Wangen duidelijk lichtgeel. Kroon dof blauwgrijs.',

    '{{07-12}}\n' +
    '**1e kj in/na postjuv-rui [3]** → in jan: 2e kj [5 vj]\n' +
    'Juv PC dof blauwgrijs, vaak licht groenig getint, contrasterend met helder blauwe gemoulte GC op buitenweb. Soms contrast tussen juv buitenste GC en gemoulte binnenste GC, of tussen gemoulte alula/CC en juv PC. Wangen tijdens en kort na de rui nog licht geel. TF vaak meer versleten dan bij adult; TF1 vaak gemoult en meer afgerond. Soms ruigrens in T en S.\n' +
    'Let op: bij sommige populaties kan slijtage het contrast onbruikbaar maken.',

    '{{07-12}}\n' +
    '**Adult [4]**\n' +
    'Buitenweb van GC, PC, CC en alula gelijkmatig helder blauw; soms licht kleurverschil tussen PC en GC. Geen ruigrens in T, TE of S.',

    '{{01-06}}\n' +
    '**2e kj [5 vj]** (= vorig najaar: 1e kj na rui [3])\n' +
    'Juv PC dof blauwgrijs, vaak licht groenig getint, contrasterend met helder blauwe gemoulte GC op buitenweb. Soms contrast tussen juv buitenste GC en gemoulte binnenste GC, of tussen gemoulte alula/CC en juv PC. TF vaak meer versleten dan bij adult; TF1 vaak gemoult en meer afgerond. Soms ruigrens in T en S.\n' +
    'Let op: bij sommige populaties kan slijtage het contrast onbruikbaar maken.',

    '{{01-06}}\n' +
    '**Adult [6]**\n' +
    'Buitenweb van GC, PC, CC en alula gelijkmatig helder blauw. Geen ruigrens in T, TE of S.',

  ].join('\n\n'),

  // ── Geslacht ────────────────────────────────────────────────────────────────
  geslachts_notities_m:
    '- Alle postjuv dekveren (C) intensief donkerblauw\n' +
    '- Randen van handpennen, stuurpennen en kroondekveertjes met intensiever en doorgaans donkerder blauw (criterium minder eenduidig dan dekverenkleur, met name bij 1e kj ♂)\n' +
    '- Broedvlek en uitstekende cloaca zijn betrouwbare indicatoren\n' +
    '- Vleugellengte alleen bruikbaar bij uiterste waarden',

  geslachts_notities_f:
    '- Alle postjuv dekveren (C) grijsachtig middelblauw\n' +
    '- Randen van handpennen, stuurpennen en kroondekveertjes grijzer en lichter blauw dan bij ♂\n' +
    '- Broedvlek en uitstekende cloaca zijn betrouwbare indicatoren\n' +
    '- ♀ van ssp. ogliastrae soms even opvallend als ♂',

  // ── ID-kenmerken ────────────────────────────────────────────────────────────
  determinatie_id_notities:
    '**Vergelijking Pimpelmees / Afrikaanse Pimpelmees / Azuurmees:**\n' +
    '| Kenmerk | Pimpelmees | Afrikaanse Pimpelmees | Azuurmees |\n' +
    '|---|---|---|---|\n' +
    '| Kroon | Blauwachtig | Zwartblauw | Doorgaans puur wit |\n' +
    '| Bovenzijde | Groenachtig | Blauwgrijs tot leigrijs | Grijsblauw |\n' +
    '| Witte punt op GC en T | Klein, aanwezig | Afwezig of gereduceerd | Uitgebreid wit |\n' +
    '| Donkere kin | Aanwezig | Aanwezig | Afwezig |\n' +
    '| Wit op buitenste TF, T, GC, PC | Beperkt | Beperkt | Uitgebreid |\n' +
    '| Verspreiding | Breed | Canarische Eilanden | Z-Belarus tot China |\n\n' +
    '**Hybridisatie met Koolmees** _Parus major_\n' +
    'Uiterlijk als Pimpelmees, maar buitenste stuurpennen gedeeltelijk wit, kroon donker, snavel en tarsus forser.\n\n' +
    '**Hybridisatie met Azuurmees** (hybride = pleski / CAECYA)\n' +
    'Uiterlijk als Azuurmees, maar weinig wit op staart (soms geen), uitgebreide blauwachtige of grijsachtige kroon, vaak weinig geel op borst en minder wit op vleugel (met name GC). Let op: leucistische Pimpelmees (kop vrijwel geheel wit met slechts dunne zwarte oogstreep) kan op een Azuurmees-hybride lijken.',

  // ── Ondersoorten ────────────────────────────────────────────────────────────
  ondersoorten:
    '**caeruleus** (Europa tot Oeral, behalve uiterste W en Z; N Klein-Azië): Nominaatvorm.\n\n' +
    '**obscurus** (Britse Eilanden, waarschijnlijk NW-Frankrijk): Vergelijkbaar met caeruleus. Rug iets groener en donkerder; onderbuik geler met groentint.\n\n' +
    '**ogliastrae** (Z-Iberisch schiereiland, Corsica, Sardinië): Klein. Bovenzijde minder opvallend dan caeruleus; onderbuik geler.\n\n' +
    '**balearicus** (Balearen): Vergelijkbaar met caeruleus, iets bleker.\n\n' +
    '**calamensis** (Z-Griekenland, Griekse eilanden): Klein. Bleker dan caeruleus.\n\n' +
    '**satunini** (Krim, Kaukasus, Transkaukasië, mogelijk tot Levant): Bleker dan caeruleus.\n\n' +
    '**orientalis** (ZW-Oeral tot Wolga): Duidelijk bleker dan caeruleus. Bovenzijde geler, minder groen.\n\n' +
    '**raddei** (N-Iran): Donkerder dan caeruleus.\n\n' +
    '**persicus** (ZW-Iran): Zeer bleek. Groentint bovenzijde en blauw van kroon vervangen door middengrijs. Onderbuik witachtig, geel alleen op zijkanten borst. Te onderscheiden van Azuurmees door zwarte keel en vleugelpatroon.\n\n' +
    '**ultramarinus** (NW-Afrika): Gelijkend op Afrikaanse Pimpelmees met donker blauwgrijze bovenzijde en intensief gele onderbuik, maar punt van GC en T wit (één vleugelband).\n\n' +
    '**cyrenaicae** (Libië): Klein. Als ultramarinus maar doffer donkere bovenzijde.',

  // ── Bronvermeldingen ────────────────────────────────────────────────────────
  bron_biometrie:         'Demongin (2016) p.326–327 — ssp. caeruleus caeruleus, adult; vleugel juveniel ♂ 61–69, ♀ 58–65; snavel en gewicht M&F gezamenlijk',
  bron_leeftijdsbepaling: 'Demongin (2016) p.326–327',
  bron_geslacht:          'Demongin (2016) p.326–327',
  bron_id_kenmerken:      'Demongin (2016) p.326–327',
  bron_ondersoorten:      'Demongin (2016) p.326–327',
  bron_ring:              'Demongin (2016) p.326–327',

  // ── Vangst-checklist ────────────────────────────────────────────────────────
  vangst_checklist: [
    { label: 'Vleugel',            type: 'meting', belang: 3 },
    { label: 'Tarsus',             type: 'meting', belang: 2 },
    { label: 'Gewicht',            type: 'meting', belang: 2 },
    { label: 'Wangen',             type: 'obs',    belang: 3, note: 'Geel = juv · Wit = adult/na rui' },
    { label: 'PC kleur',           type: 'obs',    belang: 3, note: 'Dof groenig = 1e kj · Helder blauw = adult' },
    { label: 'Dekverenkleur',      type: 'obs',    belang: 3, note: 'Donkerblauw = ♂ · Grijsblauw = ♀' },
    { label: 'Broedvlek/cloaca',   type: 'obs',    belang: 3, note: 'BP = ♀ zeker · Cloaca = ♂ zeker' },
  ],

  // ── Literatuurreferenties ────────────────────────────────────────────────────
  referenties_literatuur: [
    'Blasco-Zumeta & Heinze (2013)',
    'Boon (1994)',
    'Burgess (1982)',
    'Corfield (1980)',
    'Demongin (2016)',
    'Eck & Martens (2006)',
    'Guallar et al. (2010)',
    'Harper (2000)',
    'Harrap & Quinn (1995)',
    'Jenni & Winkler (1994)',
    'Kinnear (2001)',
    'Lascève et al. (2001)',
    'Martin (1991)',
    'Ottenby Bird Observatory (2015r)',
    'Potvliege (1979)',
    'Savioz et al. (2011)',
    'Scott (1993)',
    'Skilsky et al. (1997)',
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
