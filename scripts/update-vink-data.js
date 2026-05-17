/**
 * Vink — Fringilla coelebs — EURING 16360
 * Bron: Demongin (2020) p.357–358
 * Maten alleen voor ssp. coelebs (excl. gengleri, balearica, solomkoi, N-Afrika en Canarische Eilanden)
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const EURING = '16360';

const { data: row, error: fetchErr } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .eq('euring_code', EURING)
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }
console.log('Huidige naam:', row.naam_nl);

const updates = {

  // ── Biometrie (ssp. coelebs) ────────────────────────────────────────────
  bio_vleugel_M_min:        86,    bio_vleugel_M_max:        95,
  bio_vleugel_F_min:        80,    bio_vleugel_F_max:        88,

  bio_staartlengte_M_min:   60,    bio_staartlengte_M_max:   73,
  bio_staartlengte_F_min:   56,    bio_staartlengte_F_max:   68,

  // Snavel tot schedel: gecombineerd M/F
  bio_snavel_schedel_min:   14.1,  bio_snavel_schedel_max:   17,

  // Tarsus: gecombineerd M/F
  bio_tarsus_lengte_min:    16.5,  bio_tarsus_lengte_max:    19.5,

  // Gewicht: gecombineerd M/F
  bio_gewicht_min:          17.5,  bio_gewicht_max:          29,

  // ── Pennen ─────────────────────────────────────────────────────────────
  pennen_structuur: {
    wp: '(3) 4 (5)',
  },

  vleugelformule: '',

  // ── Rui ────────────────────────────────────────────────────────────────
  rui_notities:
    '**1e kj (3)** Gedeeltelijke postjuv-rui van jun–begin sep tot laat jul–midden okt. ' +
    'Omvat: lichaamsveren, alle kleine en middelste vleugeldekveren, 2–10 grote vleugeldekveren (gemiddeld 8–9), ' +
    'zelden carpaaldekveren (CC) en alula, uitzonderlijk alula 2, zelden 1–3 tertialen, uitzonderlijk 1–6 stuurpennen en S6. ' +
    'CC, alula en tertialen worden pas verruide als minimaal 6 grote vleugeldekveren al zijn verruide. ' +
    'Volledige rui mogelijk in de meest zuidelijke populaties.\n\n' +
    '**Volwassen (4)** Volledige postbroedse rui van (laat mei) jun–jul tot midden aug–begin okt (begin nov). ' +
    'Uitzonderlijk 1 handpendekveertje, 1 alula-veer, 1 binnenste armpen of 1 buitenste handpen aangehouden.',

  // ── Leeftijdsbepaling ──────────────────────────────────────────────────
  // leeftijds_notities_nj ALTIJD '' — najaarblokken via {{07-12}} in vj
  leeftijds_notities_nj: '',

  leeftijds_notities_vj:
    '{{07-12}}\n' +
    '**3J** Witachtige vlek op nek. Stuit dof bruingroen. Pennen van de onderbuik licht donzig.\n\n' +

    '{{07-12}}\n' +
    '**na 1e kj (4)** Na gedeeltelijke postjuv-rui: juveniele handpendekveren (PC) duidelijk bleker of bruiner ' +
    'dan de verruide binnenste grote vleugeldekveren (GC). Soms contrast binnen de alula. ' +
    'Juveniele tertialen smaller, met doffe grijze, witte of buff rand en diffuse overgang donker/licht; ' +
    'kunnen contrasteren met verruide tertialen. ' +
    'Let op: CC zijn soms donkerder dan GC van dezelfde generatie — dit is geen ruigrens.\n\n' +

    '{{07-12}}\n' +
    '**na 2e kj (6)** PC vrijwel even zwart als GC, geen ruigrens in GC, tertialen of alula. ' +
    'Tertialen breed en fris, uitgebreid rufous eindtip met scherpe grens donker/licht. ' +
    'Bij ♀ V zijn contrasten zwakker — niet ouderdomsbepalen als onzeker.\n\n' +

    '{{01-06}}\n' +
    '**2e kj (5)** (= vorig najaar: na 1e kj (4)) Juveniele PC iets bleker/bruiner dan verruide GC. ' +
    'TF1 puntig, versleten, doffe bruine rand op buitenvlag, zonder donkere eindvlek. ' +
    'Juveniele tertialen smaller, narrowly gerand, diffuse overgang donker/licht — ' +
    'contrasteert soms met verruide tertialen.\n\n' +

    '{{01-06}}\n' +
    '**na 2e kj (6)** Alula en PC vrijwel even zwart als GC. TF1 afgerond, fris, groene rand op buitenvlag, ' +
    'soms donkere eindvlek. Buitenste TF afgerond. Tertialen breed, fris, uitgebreid rufous eindtip, ' +
    'scherpe grens donker/licht. Bij ♀ V zijn contrasten zwakker — niet ouderdomsbepalen als onzeker. ' +
    'Let op: centrale alula-veer soms aangehouden en bleker dan rest — lijkt op juv-veer maar is volwassen.',

  bron_leeftijdsbepaling: 'Demongin (2020) p.357–358',

  // ── Geslacht ───────────────────────────────────────────────────────────
  geslachts_notities_m:
    '- Borst rufous-roze (duidelijk roze tint), keel en wangen iets donkerder rufous-roze\n' +
    '- Kruin en nek blauwgrijs, deels met rufous-buff eindtip (bij 1e kj na postjuv-rui)\n' +
    '- Juv ♂ M (3J M): onderrug en scapularen geelbruin met groentint; ' +
    'langste kleine vleugeldekveer wit geraamd over 2–4 mm\n' +
    '- Criteria voor juvenielen zijn nog niet volledig bevestigd',

  geslachts_notities_f:
    '- Borst lichtbruin-buff, zonder roze tint\n' +
    '- Kruin grijsbruin, zonder blauwe tint\n' +
    '- Juv ♀ V (3J V): onderrug en scapularen bruingrijs of olijf zonder geelbruine tint; ' +
    'TF1 grijsbruin (niet grijs); langste kleine vleugeldekveer wit geraamd over 0–2 mm\n' +
    '- Criteria voor juvenielen zijn nog niet volledig bevestigd',

  bron_geslacht: 'Demongin (2020) p.357–358',

  // ── ID-kenmerken ───────────────────────────────────────────────────────
  determinatie_id_notities:
    'Karakteristieke combinatie van witte vleugelstrepen (basis van handpennen en armpennen, ' +
    'alle middelste vleugeldekveren en deel van de kleine vleugeldekveren) en TF6 met veel wit.\n\n' +
    '**Hybridisatie:**\n' +
    'Hybridisatie met Keep *(Fringilla montifringilla)* mogelijk.',

  bron_id_kenmerken: 'Demongin (2020) p.357–358',

  // ── Ondersoorten (markdown string) ────────────────────────────────────
  ondersoorten:
    '**Groep 1 — coelebs** (Continentaal Europa, excl. W en ZO, tot Centraal-Siberië)\n' +
    'Nominaatvorm. ♂ M borst meer rozeroze dan rufous-bruin; keel en wangen iets donkerder rufous-roze. ' +
    'Lichte clineale variatie. Sspp. sarda, syriaca, solomkoi, alexandrovi, balearica, tyrrhenica en caucasica worden soms bij coelebs ingedeeld.\n\n' +
    '**gengleri** (Britse Eilanden, Ierland)\n' +
    'Gemiddeld kleiner, iets donkerder, meer rufous op de onderdelen bij ♂ M. Onverzorgde uitstraling, ook bij ♀ V. In vers postbroeds verenkleed vrijwel niet te onderscheiden van coelebs.\n\n' +
    '**balearica** (Iberisch Schiereiland, Balearen)\n' +
    'Kleiner dan coelebs, blekere onderdelen.\n\n' +
    '**tyrrhenica** (Corsica)\n' +
    'Vleugel kort. Sterk contrast tussen donkere wijnrode onderdelen en rufous-kaneelkleurige wangen.\n\n' +
    '**sarda** (Sardinië)\n' +
    'Vleugel kort. Snavel diep. Mantel vrij dof bruin.\n\n' +
    '**solomkoi** (Balkan tot Krim en W-Kaukasus)\n' +
    'Blekere onderdelen dan coelebs. Snavel gemiddeld steviger.\n\n' +
    '**syriaca** (Levant, Cyprus, ZO-Turkije, N-Irak)\n' +
    'Mantel van ♂ M bleker, stuit geelgroen.\n\n' +
    '**Groep 2 — spodiogenys** (N-Afrika, Azoren, Madeira — 4 ondersoorten)\n' +
    'Wangen even blauwgrijs als kruin. Loren zwart. Mantel groen. Onderdelen bleek. ' +
    'Binnenvlag van TF4–TF6 grotendeels wit (TF4 geheel donker bij coelebs-groep).\n\n' +
    '**Groep 3 — canariensis** (Canarische Eilanden — 3 ondersoorten)\n' +
    'Bovenzijde leisteengrijs. Zijkant hoofd oker of oranje-buff als de borst. ' +
    'Weinig wit op vleugel en staart. Onderscheid van Blauwe Vink *(F. teydea)* noodzakelijk.',

  bron_ondersoorten: 'Demongin (2020) p.357',

  // ── Ringgegevens ───────────────────────────────────────────────────────
  bron_ring: 'Demongin (2020) p.357–358',

  // ── Vangst-checklist ───────────────────────────────────────────────────
  vangst_checklist: [
    'Kleur borst: rozerood = ♂ M, buff-bruin = ♀ V',
    'LC randbreedte: 2–4 mm = ♂ M, 0–2 mm = ♀ V (juv)',
    'PC kleur vs GC: bleker = 1e kj',
    'TF1 vorm: puntig/versleten = 1e kj; afgerond/fris = adult',
    'Tertiaalrand: diffuse grens = 1e kj; scherpe rufous tip = adult',
    'Meet vleugel: ≥89 mm = zeker ♂ M',
  ],

  // ── Referenties ────────────────────────────────────────────────────────
  referenties_literatuur: [
    'Blasco-Zumeta & Heinze (2013)',
    'Clement (2011)',
    'Clement et al. (1996)',
    'Corso (2009c)',
    'Corso (2014)',
    'Guallar et al. (2010)',
    'Jenni & Winkler (1994)',
    'Le Roy & Michelat (2011)',
    'Lundwall & Persson (1999b)',
    'Norman (2010b)',
    'Ottenby Bird Observatory (2015a, b)',
    'Perktaş (2011)',
    'Ramos (1998)',
    'Ruelle (1988)',
    'Shirihai et al. (2002a)',
    'Zamora (2015)',
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

console.log('✓ Updated Vink (16360)');
