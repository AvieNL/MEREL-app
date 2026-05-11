/**
 * update-groenling-data.js
 * Voegt uitgebreide data toe aan de Groenling (EURING 16490) in Supabase.
 * Data gebaseerd op Demongin (2020) p.361–362.
 *
 * Gebruik: node scripts/update-groenling-data.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const { data: row, error: fetchErr } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .eq('euring_code', '16490')
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }
console.log('Soort:', row.naam_nl);

const updates = {

  // ── Biometrie — Demongin (2020) p.361–362 ──────────────────────────────
  bio_vleugel_M_min: '83',
  bio_vleugel_M_max: '96',
  bio_vleugel_F_min: '80',
  bio_vleugel_F_max: '92',

  bio_staartlengte_M_min: '53',
  bio_staartlengte_M_max: '61',
  bio_staartlengte_F_min: '51',
  bio_staartlengte_F_max: '60',

  // Bill to skull — gecombineerd M&F
  bio_snavel_schedel_min: '15.2',
  bio_snavel_schedel_max: '18.5',

  // Bill depth at base — gecombineerd M&F
  bio_snavel_diepte_min: '9.5',
  bio_snavel_diepte_max: '11.0',

  bio_tarsus_lengte_min: '16',
  bio_tarsus_lengte_max: '19',

  bio_gewicht_M_min: '23',
  bio_gewicht_M_max: '36.5',
  bio_gewicht_F_min: '22.5',
  bio_gewicht_F_max: '30',

  // ── Penveren ────────────────────────────────────────────────────────────
  // WP: (P2) P3 (P4) — bron: Demongin p.361
  pennen_structuur: {
    wp: '(P2) P3 (P4)',
    hp: 10,
    ap: 9,
    tp: 3,
    sp: 12,
  },

  eerste_broedleeftijd: '',

  // ── Rui ─────────────────────────────────────────────────────────────────
  rui_notities:
    '**Juveniel [3]** Gedeeltelijke postrui jul–aug t/m eind sep–begin nov (soms compleet, onderbroken). ' +
    'Omvat: lichaamsveren, alle kleine en middelste vleugeldekveren, 1–10 grote armpendekveren (gem. 9 of 10), ' +
    'vaak armpendekveren bij vleugelboeg (CC), nul t/m alle veren van de alula, tertials en stuurpennen, ' +
    'uitzonderlijk 1–2 binnenste armpennen. Soms excentrische handrui (vnl. buitenste, P7–P1) zonder gelijktijdige rui van handpendekveren. ' +
    'Complete rui mogelijk, m.n. in het zuiden.\n\n' +
    '**Adult [4]** Complete postbroedselrui van [eind jun] jul–half aug [half sep] t/m eind sep–half nov [eind nov]. ' +
    'Rui van armpennen eindigt na rui van handpennen (soms in dec). Rui van handpennen en armpennen soms onderbroken. ' +
    'Rui kan starten tijdens broeden.',

  // ── Leeftijdsbepaling ───────────────────────────────────────────────────
  leeftijds_notities_nj: '',

  leeftijds_notities_vj:
    '{{06-11}}\n' +
    '**Juveniel [3J]** Dof zonder duidelijke gele of groene tint. Boven- en borstveren met duidelijke donkere strepen. Binnenste grote armpendekveren met blekere bruine zoom.\n\n' +
    '**1e kj ♂ M [3M] — herfst:**\n' +
    'Geruide armpendekveren bij vleugelboeg (CC) en alula vaak met helderdere gele rand en donkerder centrum dan de meer bruinachtige juveniele handpendekveren (PC), waarvan de rand slechts licht geelgroen en zonder brede grijsachtige punt. Geruid deel van alula (ala 1) van dezelfde gele kleur als aangrenzende kleine dekveren, soms contrasterende met bruingroen buitenweb van overige juv alula-veren.\n' +
    'Juveniele tertials bleker, bruiner met minder egaal grijs — contrasterende met geruidde tertials waarvan buitenweb grijs tot aan de schacht reikt en binnenweb donkerder is. Soms vergelijkbaar contrast tussen geruidde tertials en juveniele binnenste armpennen.\n' +
    'Juveniele buitenste stuurpennen (TF) doorgaans spitser en smaller met iets bleker centrum; vaak een ruigrens binnen de stuurpennen.\n\n' +
    '**Onbekende leeftijd ♂ M (+1e kj) [2(4)M] — herfst:**\n' +
    'Volledig verenkleed zonder ruigrens. Binnenste grote armpendekveren grijsachtig; buitenste grote armpendekveren met grijze punt en brede groene buitenzoom — minder contrast met donker centrum dan bij juveniele grote armpendekveren. Handpendekveren (PC) helder gekleurd als buitenste grote armpendekveren. Buitenweb van alula-veren met veel geel en geelwit, met asgrauwe punt (indien vers). Stuurpennen breder, buitenste TF doorgaans meer afgerond. Alle handpennen en armpennen van één generatie en vers (of weinig versleten).\n\n' +
    '**♀ V — herfst:**\n' +
    'Vaak moeilijk. Bij 1e kj hetzelfde contrast als bij ♂ M maar altijd minder opvallend. Controleer handpendekveren, aanwezigheid van juveniele grote armpendekveren of tertials, vorm van stuurpennen en aanwezigheid van geruidde handpennen. Geruid deel van alula 1 en aangrenzende kleine dekveren groen (geel bij ♂ M). Binnenste grote armpendekveren en buitenweb van geruidde buitenste grote armpendekveren en tertials lichtbruin i.p.v. grijsachtig.\n\n' +
    '{{01-05}}\n' +
    '**2e kj [5] — voorjaar:**\n' +
    'Juveniele stuurpennen doorgaans sterker versleten in feb–mrt, met versleten randen, vaak spits en smal. Juveniele handpennen en armpennen soms bruinachtiger dan zwartachtig.\n\n' +
    '**+1e kj (+2e kj) [4(6)] — voorjaar:**\n' +
    'Stuurpennen vrij vers (randen slechts licht versleten), breed en afgerond. In apr–mei wordt slijtage duidelijker.',

  // ── Geslacht ────────────────────────────────────────────────────────────
  geslachts_notities_m:
    '- BP en cloaca betrouwbaar.\n' +
    '- Uiterlijk P3–P5 (zie fig. 4 Demongin).\n' +
    '- Geel van binnenweb TF4–TF6 reikt tot aan de donkere schacht over ten minste 10 mm (overlap met ♀ V mogelijk).\n' +
    '- Lengte van het zwarte gebied aan de punt van TF5 gemeten langs de schacht < 31 mm.',

  geslachts_notities_f:
    '- BP en cloaca betrouwbaar.\n' +
    '- Uiterlijk P3–P5 (zie fig. 4 Demongin).\n' +
    '- Geel van binnenweb TF4–TF6 reikt niet tot de donkere schacht, of uitzonderlijk over minder dan 10 mm (overlap met ♂ M mogelijk).\n' +
    '- Lengte van het zwarte gebied aan de punt van TF5 gemeten langs de schacht > 31 mm.\n' +
    '- Kruin vuil grijsbruin, gestreept.',

  // ── ID-kenmerken ─────────────────────────────────────────────────────────
  determinatie_id_notities:
    'Krachtige, bleke snavel. Gele rand op buitenste handpennen en buitenste stuurpennen, maar niet op de armpennen (typisch).\n\n' +
    '**Verwarring: Oosterse Groenling** (*C. sinica*, ontsnapt uit gevangenschap): geel ook aan de basis van het buitenweb van de armpennen.\n\n' +
    '**Hybridisatie** mogelijk met Putter *C. carduelis*, Kneu *C. cannabina*, en mogelijk Sijs *C. spinus*, Barmsijs *C. flammea* en Citroengirlitz *Serinus citrinella*.',

  // ── Ondersoorten ─────────────────────────────────────────────────────────
  ondersoorten:
    '**chloris** (N, centraal en O-Europa): Donkerste ondersoort; minder intens groen en geel dan vogels uit Z-Europa; geelgroene delen contrasteren meer met rest van het verenkleed.\n\n' +
    '**harrisoni** (Britse eilanden): Vergelijkbaar met chloris maar iets donkerder.\n\n' +
    '**aurantiiventris** (Z-Europa tot centraal Frankrijk, centraal en O-Spanje, ex-Joegoslavië tot W-Griekenland, N-Tunesië): Bovendelen helderder groen, nauwelijks contrasterende met geelachtig voorhoofd en stuit; onderdelen geler dan chloris.\n\n' +
    '**vanmarli** (Iberisch schiereiland, NW-Marokko): Snavel iets sterker. Bovendelen doffer en minder geel dan aurantiiventris; onderdelen grotendeels geelachtig olijfgroen.\n\n' +
    '**voousi** (Marokkaans Atlas-gebergte, Algerije): Bleek. Even groot als in N-Europa. Snaveldiepte aan de basis 11,0–13,1 mm.\n\n' +
    '**madaraszi** (Corsica, Sardinië): Donker en grotendeels groen, minder geel; minder bruin dan chloris.\n\n' +
    '**muehlei** (O ex-Joegoslavië tot Moldavië en W-Klein-Azië, Kreta, Cyprus): Bovendelen minder bruin dan chloris.\n\n' +
    '**chlorotica** (Levant, N-Egypte): Wordt bij slijtage geler op bovendelen en gezicht dan alle andere ondersoorten.\n\n' +
    '**bilkevitchi** (Kaukasus tot N-Iran en ZW-Turkmenistan): In elk seizoen grauwtiger dan andere ondersoorten.\n\n' +
    '**turkestanica** (Centraal-Azië): Grootste ondersoort; zeer licht bleker en grauwtiger dan chloris.',

  // ── Bronstverantwoording ─────────────────────────────────────────────────
  bron_biometrie:         'Demongin (2020) p.361–362',
  bron_leeftijdsbepaling: 'Demongin (2020) p.361–362',
  bron_geslacht:          'Demongin (2020) p.361–362',
  bron_id_kenmerken:      'Demongin (2020) p.361–362',
  bron_ondersoorten:      'Demongin (2020) p.361–362',
  bron_ring:              'Demongin (2020) p.361',

  // ── Literatuur ───────────────────────────────────────────────────────────
  referenties_literatuur: [
    'Arenas & Senar (2004)',
    'Blasco-Zumeta & Heinze (2013)',
    'Clement (2011)',
    'Clement et al. (1996)',
    'Gargallo & Clarabuch (1995)',
    'Harper (1984)',
    'Harris (1992)',
    'Jenni & Winkler (1994)',
    'Mester & Prunte (1982)',
    'Newton & Rothery (2005)',
    'Norman (2003n)',
    'Norman (2004d)',
    'Norman (2004h)',
    'Ottenby Bird Observatory (2015ad)',
    'Person (2013)',
    'Robert (1977)',
    'Schierer (1979)',
    'Shirihai et al. (2002a)',
    'Winkler & Jenni (1987)',
    'Zamora (2015)',
  ],

  // ── Vangst-checklist ─────────────────────────────────────────────────────
  vangst_checklist: [
    { label: 'Vleugel',              type: 'meting', belang: 3 },
    { label: 'Staart',               type: 'meting', belang: 2 },
    { label: 'Snavel tot schedel',   type: 'meting', belang: 2 },
    { label: 'Snaveldiepte (basis)', type: 'meting', belang: 2 },
    { label: 'Tarsus',               type: 'meting', belang: 1 },
    { label: 'Gewicht',              type: 'meting', belang: 2 },
    { label: 'BP / cloaca',              type: 'obs',    belang: 3, note: 'Betrouwbaar voor geslachtsbepaling' },
    { label: 'P3–P5 uiterlijk',      type: 'obs',    belang: 3, note: '♂ M vs ♀ V op basis van handpenprofiel' },
    { label: 'TF4–TF6 geel (binnenweb)', type: 'meting', belang: 3, note: '≥10 mm tot schacht → ♂ M; overlap mogelijk' },
    { label: 'TF5 zwarte punt (schacht)', type: 'meting', belang: 2, note: '<31 mm → ♂ M; >31 mm → ♀ V' },
    { label: 'Ruigrens (alula / CC / PC / TF)', type: 'obs', belang: 3, note: 'Altijd controleren voor leeftijdsbepaling' },
    { label: 'Schedel pneumatisatie', type: 'obs', belang: 2, note: 'Volledig = niet meer van adult te onderscheiden' },
  ],
};

const newData = { ...row.data, ...updates };

const { error: upsertErr } = await sb.from('species').upsert({
  euring_code: row.euring_code,
  naam_nl: row.naam_nl,
  data: newData,
});

if (upsertErr) { console.error('Upsert mislukt:', upsertErr.message); process.exit(1); }
console.log('✓ Groenling-data bijgewerkt in Supabase');
console.log('  Velden:', Object.keys(updates).join(', '));
