/**
 * update-winterkoning-data.js
 * Winterkoning (EURING 10660) — biometrie, rui, leeftijd, geslacht, ID, ondersoorten, referenties.
 * Bron: Demongin (2016) p.243 — Europese ondersoorten excl. islandicus
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const EURING = '10660';

const { data: row, error: fetchErr } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .eq('euring_code', EURING)
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }
console.log('Huidige naam:', row.naam_nl);

const NJ = '{{07-12}}\n';
const VJ = '{{01-06}}\n';

const updates = {

  // ── Biometrie — Europese ondersoorten excl. islandicus ───────────────────
  bio_vleugel_M_min: 47,   bio_vleugel_M_max: 55,
  bio_vleugel_F_min: 44,   bio_vleugel_F_max: 51,

  // Staart, snavel, tarsus: M&F gezamenlijk
  bio_staartlengte_M_min: 25,   bio_staartlengte_M_max: 38,
  bio_staartlengte_F_min: 25,   bio_staartlengte_F_max: 38,

  bio_snavel_schedel_M_min: 12.2, bio_snavel_schedel_M_max: 14.8,
  bio_snavel_schedel_F_min: 12.2, bio_snavel_schedel_F_max: 14.8,

  // Kop+snavel (head and bill): M&F apart
  bio_kop_snavel_M_min: 29,   bio_kop_snavel_M_max: 31.5,
  bio_kop_snavel_F_min: 28.4, bio_kop_snavel_F_max: 30.6,

  bio_tarsus_lengte_M_min: 16,   bio_tarsus_lengte_M_max: 22.8,
  bio_tarsus_lengte_F_min: 16,   bio_tarsus_lengte_F_max: 22.8,

  bio_gewicht_M_min: 8,    bio_gewicht_M_max: 12.5,
  bio_gewicht_F_min: 6.8,  bio_gewicht_F_max: 11.4,

  // ── Pennenstructuur ────────────────────────────────────────────────────────
  pennen_structuur: {
    wp: 'P4–P5 (soms P3 of P6)',
  },

  vleugelformule: '',

  // ── Rui ───────────────────────────────────────────────────────────────────
  rui_notities:
    '**1e kj (3)** Gedeeltelijke postjuv-rui jul–sep tot sep–okt. Omvat lichaamsveren, alle LC en MC, 0 (zelden) tot 8 binnenste GC (gemiddeld 5), zelden CC en alula 1, soms T en enkele TF. Gedeeltelijke prebroed-rui in de winter (zie na 1e kj (4)).\n\n' +
    '**na 1e kj (4)** Volledige postbroed-rui jun–half aug tot sep–half okt. Gedeeltelijke prebroed-rui half jan–apr, beperkt tot lichaamsveren, uitzonderlijk ook LC en MC, schouders en onderste vleugeldekveren.',

  // ── Leeftijdsbepaling ─────────────────────────────────────────────────────
  leeftijds_notities_nj: '',

  leeftijds_notities_vj: [

    NJ +
    '**1e kj, deels in jeugdkleed (3J)** Vóór postjuv-rui: onderstaartdekveren neigend naar volledig bruin (bij post-juv-vogels wit getipt).',

    NJ +
    '**1e kj (3)** In/na postjuv-rui: juv buitenste GC, T en alula intensief roodbruin, minder gespikkeld en vaak iets korter, contrasterend met iets lichtere gemoulte binnenste GC, T en alula (grijsbruin met gelige tint; minder roodachtig). Gemoulte GC vaak iets langer met lichte of witte punt en duidelijkere donkere vlekken. Gemoulte MC en LC van dezelfde kleur als gemoulte GC, contrasterend met de roodbruine juv GC. Soms 1 of 2 T ook gemoult, met zelfde soort contrast als bij GC. CC soms wit getipt.\nLet op: P4-uiterlijk (juv = ≤ 8 lichte vlekken op buitenweb; post-juv = ≥ 10) en alula 3 zijn niet erg betrouwbaar als leeftijdsindicator.',

    NJ +
    '**na 1e kj (4)** GC egaal middelbruin of grijsbruin, soms met lichte of witte punt op enkele veren. Geen kleurverschil tussen GC en LC/MC.',

    VJ +
    '**2e kj (5)** (= vorig najaar: 1e kj (3)) Juv buitenste GC intensief roodbruin, minder gespikkeld en iets korter dan gemoulte GC, contrasterend met binnenste grijsbruine GC. Gemoulte GC iets langer, lichte punt. MC en LC van dezelfde kleur als gemoulte GC.',

    VJ +
    '**na 2e kj (6)** (= vorig najaar: na 1e kj (4)) GC egaal middelbruin of grijsbruin; geen kleurverschil met LC/MC.',

  ].join('\n\n'),

  // ── Geslacht ──────────────────────────────────────────────────────────────
  geslachts_notities_m:
    '- Uitstekende cloaca betrouwbaar\n' +
    '- Geslachtsformule (ssp. indigenus, 4% fout): ♂ M als 0,75 × vleugel + 0,72 × kop+snavel − 58,71 > 0\n' +
    '- Geslachtsformule (Catalonië, 9% fout): ♂ M als 0,3721 × vleugel + 0,3804 × P3 − 30,4661 > 0',

  geslachts_notities_f:
    '- Broedvlek betrouwbaar',

  // ── ID-kenmerken ──────────────────────────────────────────────────────────
  determinatie_id_notities:
    'Onmiskenbaar. Zeer klein. Vleugels en staart zeer kort, met duidelijke dwarsstrepen. Lange, dunne snavel. Bovenzijde overwegend roestbruin. Supercilium licht.',

  // ── Ondersoorten ──────────────────────────────────────────────────────────
  ondersoorten:
    '**troglodytes** (N- en Centraal-Europa tot Oeral, grootste deel van Italië, Griekenland): Relatief warm roestbruin met doffe grijze dwarsstrepen op scapulars, T en rug tot bovenstaartdekveren. Flanken en stuit met duidelijke roestbruine dwarsstrepen.\n\n' +
    '**indigenus** (Ierland, Groot-Brittannië excl. ver N): Bovenzijde iets donkerder, minder helder roestbruin. Intermediair met troglodytes in Z-Engeland. Zes ondersoorten in N-Schotland en de Noordelijke eilanden, N tot IJsland, zeer gelijkend op indigenus maar snavel, vleugel, staart en tarsus iets langer.\n\n' +
    '**koenigi** (Corsica, Sardinië): Bovenzijde grijsachtig olijfbruin getint. Meer uitgebreide dwarsstrepen dan troglodytes; dwarsstrepen reiken tot borst en zijn duidelijker op mantel.\n\n' +
    '**kabylorum** (NW-Afrika, Balearen, Z-Spanje): Gelijkend op koenigi.\n\n' +
    '**cyprotes** (Kreta, Rhodos, Levant): Duidelijk gestreept. Bovenzijde grijzer.\n\n' +
    '**islandicus** (IJsland): Groot. Bovenzijde doller, minder roestbruin. Onderzijde vrij licht en met dwarsstrepen. Biometrie afwijkend — niet opgenomen in maatbereiken.',

  // ── Bronvermeldingen ──────────────────────────────────────────────────────
  bron_biometrie:         'Demongin (2016) p.243 — Europese ondersoorten excl. islandicus; staart, snavel, tarsus M&F gezamenlijk',
  bron_leeftijdsbepaling: 'Demongin (2016) p.243',
  bron_geslacht:          'Demongin (2016) p.243',
  bron_id_kenmerken:      'Demongin (2016) p.243',
  bron_ondersoorten:      'Demongin (2016) p.243',
  bron_ring:              'Demongin (2016) p.243',

  // ── Vangst-checklist ─────────────────────────────────────────────────────
  vangst_checklist: [
    { label: 'Vleugel',               type: 'meting', belang: 3 },
    { label: 'Kop+snavel',            type: 'meting', belang: 2 },
    { label: 'Tarsus',                type: 'meting', belang: 2 },
    { label: 'Gewicht',               type: 'meting', belang: 2 },
    { label: 'Onderstaartdekveren',   type: 'obs',    belang: 2, note: 'Volledig bruin = vóór postjuv-rui (3J) · Wit getipt = na rui' },
    { label: 'GC kleur/contrast',     type: 'obs',    belang: 3, note: 'Roodbruin juv buitenste GC, contrasterend = 1e/2e kj (3/5) · Egaal middelbruin, geen contrast = na 1e/2e kj (4/6)' },
    { label: 'Broedvlek/cloaca',      type: 'obs',    belang: 3, note: 'BP = ♀ V · Uitstekende cloaca = ♂ M' },
  ],

  // ── Literatuurreferenties ─────────────────────────────────────────────────
  referenties_literatuur: [
    'Blasco-Zumeta & Heinze (2013)',
    'Brewer (2000)',
    'Guallar et al. (2010)',
    'Jenni & Winkler (1994)',
    'Norman (2004e)',
    'Scott (1965a)',
    'Shirihai et al. (2002a)',
    'Sweeney & Tatner (1996)',
    'Ward & Feu (2006)',
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
