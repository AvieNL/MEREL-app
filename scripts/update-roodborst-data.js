/**
 * update-roodborst-data.js
 * Roodborst (EURING 10990) — biometrie, rui, leeftijd, geslacht, ID, ondersoorten, referenties.
 * Bron: Demongin (2016) p.245–246 — ssp. rubecula en melophilus (biometrie)
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const EURING = '10990';

const { data: row, error: fetchErr } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .eq('euring_code', EURING)
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }
console.log('Huidige naam:', row.naam_nl);

const NJ = '{{07-12}}\n';
const VJ = '{{01-06}}\n';

const updates = {

  // ── Biometrie — ssp. rubecula en melophilus ───────────────────────────────
  bio_vleugel_M_min: 69, bio_vleugel_M_max: 78,
  bio_vleugel_F_min: 65, bio_vleugel_F_max: 74,

  bio_staartlengte_M_min: 53, bio_staartlengte_M_max: 67,
  bio_staartlengte_F_min: 51, bio_staartlengte_F_max: 64,

  // Bill to skull (MF gezamenlijk)
  bio_snavel_schedel_M_min: 13.4, bio_snavel_schedel_M_max: 16.4,
  bio_snavel_schedel_F_min: 13.4, bio_snavel_schedel_F_max: 16.4,
  bio_snavel_schedel_is_bill_to_feathers: false,

  // Tarsus (MF gezamenlijk)
  bio_tarsus_lengte_M_min: 23.1, bio_tarsus_lengte_M_max: 27.7,
  bio_tarsus_lengte_F_min: 23.1, bio_tarsus_lengte_F_max: 27.7,

  // Gewicht (M en F apart)
  bio_gewicht_M_min: 14, bio_gewicht_M_max: 21,
  bio_gewicht_F_min: 13, bio_gewicht_F_max: 20,

  // ── Pennenstructuur ────────────────────────────────────────────────────────
  pennen_structuur: {
    wp: 'P4–P5',
    hp: 10,
  },

  // ssp. rubecula, melophilus, caucasicus, hyrcanus
  // Vleugelpunt (WP) niet herhalen — staat al via pennen_structuur.wp
  vleugelformule:
    'P2: kort\n' +
    'P2 WP: 9,5–14 mm · P3 WP: 2–4 mm · P6 WP: 1–2 mm · P10 WP: 12–15 mm\n' +
    'Uitgerand: P3–P6',

  // ── Rui ───────────────────────────────────────────────────────────────────
  rui_notities:
    '**1e kj (3)** Gedeeltelijke postjuv-rui van (laat mei) mid-jun–mid-aug tot laat jul–vroeg okt. Omvat lichaamsveren, alle LC en MC, geen tot alle GC (gemiddeld 3–6 binnenste GC; geheel bij hoge uitzondering), soms CC en alula 1, bij hoge uitzondering 1 of 2 T, alula 2 en TF1.\n\n' +
    '**na 1e kj (4)** Volledige postbroed-rui van jun–vroeg aug tot laat jul–sep. Bij hoge uitzondering P-rui tijdelijk gesuspendeerd en 1 PC aangehouden.',

  // ── Leeftijdsbepaling ─────────────────────────────────────────────────────
  leeftijds_notities_nj: '',

  leeftijds_notities_vj: [

    NJ +
    '**1e kj (3J)** Volledig juveniel verenkleed (voor start postjuv-rui, doorgaans jun–vroeg aug). Bovenzijde, vleugeldekveren en staartveren bruin met bleke vlekken. Geen oranje-rood op gezicht of borst.',

    NJ +
    '**1e kj (3)** GC-contrast: buitenste juv GC bruin met geelbruine buitenste rand, contrasterende met binnenste geruid GC (volledig olijf zonder gele punt). Aantal en vorm van de gele punt op GC sterk variabel: kan volledig afwezig zijn op juv veren. Als alle GC geruid: zoek moultgrens met juv PC, alula 2, alula 3 of staartveren. Staartveren (TF) gewoonlijk spitser. Binnenzijde bovenmandibel doorgaans geel tot grijswit, soms donkerder vanaf sep (nauwelijks betrouwbaar).',

    NJ +
    '**na 1e kj (4)** Alle staartveren en alula met olijftint, inclusief rand, geen moultgrens. Controleer altijd de alula om 1e kj met alle GC geruid uit te sluiten. Gele punten op GC doorgaans afwezig; uitzonderlijk zeer grote punten op buitenste GC, dan neemt de grootte gelijkmatig toe van binnen naar buiten (omgekeerd van 1e kj). Staartveren (TF) doorgaans afgerond, soms spits maar breder en vierkanter dan juveniel. Binnenzijde bovenmandibel donker of middelgrijs met iets geel aan de basis (nauwelijks betrouwbaar).',

    VJ +
    '**2e kj (5)** Zelfde GC-contrast als in het najaar. PC en staartveren meer versleten en bruinachtig. Juv PC en TF1 spitser maar door slijtage vaak moeilijk te beoordelen.',

    VJ +
    '**na 2e kj (6)** Geen GC-contrast; alle dekveren egaal olijf zonder moultgrens. PC en staartveren nog vers, donker bruingrijs, afgerond en met egale rand.',

  ].join('\n\n'),

  // ── Geslacht ──────────────────────────────────────────────────────────────
  geslachts_notities_m:
    '- Geen betrouwbaar visueel kenmerk; geslachtsbepaling via vleugelmeting\n' +
    '- Vleugel ≥ 75 mm vrijwel zeker ♂ M (boven ♀ V maximum; ssp. rubecula/melophilus)\n' +
    '- Grensgebied 69–74 mm niet betrouwbaar via vleugelmeting alleen\n' +
    '- Formule volwassen Catalonië (13% fout): ♂ M als 0,723 × vleugel − 52,0198 > 0 (drempel: vleugel ≈ 72 mm)',

  geslachts_notities_f:
    '- Geen betrouwbaar visueel kenmerk; geslachtsbepaling via vleugelmeting\n' +
    '- Vleugel ≤ 64 mm vrijwel zeker ♀ V (onder ♂ M minimum; ssp. rubecula/melophilus)\n' +
    '- Grensgebied 65–74 mm niet betrouwbaar via vleugelmeting alleen',

  // ── ID-kenmerken ──────────────────────────────────────────────────────────
  determinatie_id_notities:
    '**Afwijkende vogels**\n\n' +
    'Zeldzame aberrante kleurvariant waarbij de normale roodborstkleur grotendeels ontbreekt: bovenzijde, bovenste staartveerdekveren en vleugeldekken blauwgrijs; onderzijde wit inclusief keel behalve een brede oranje band van oog tot onderborst; flanken en buik met grijze was; gezicht bleek; staartveren grijsbruin. Gelijkt op Blauwstaart _Tarsiger cyanurus_ (Finland tot China). Onderscheid: tarsus ≤ 24,1 mm en P10 − WP = 16–20 mm.\n\n' +
    '**Vergelijking Roodborst juv / Siberische Calliope juv:**\n' +
    '| Kenmerk | Roodborst | Calliope _C. calliope_ |\n' +
    '|---|---|---|\n' +
    '| Snavel | < 15,6 mm | ≥ 15,6 mm |\n' +
    '| Tarsus | < 27,5 mm | ≥ 27,5 mm |\n' +
    '| Kroonstrepen | Breed afgerond, geelachtig-buff | Smal |\n' +
    '| P2 − WP | 9,5–14 mm | 6,5–11,5 mm |\n' +
    '| P3 − WP | 2–4 mm | 0–1 mm |\n' +
    '| P5 − WP | — | 0,5–3 mm |\n' +
    '| Uitgerand | P3–P6 | P3–P5 |',

  // ── Ondersoorten ──────────────────────────────────────────────────────────
  ondersoorten:
    'Variatie gering en clinaal; sterk beïnvloed door slijtage. Veel gebieden van intergradatie.\n\n' +
    '**rubecula** (Europa tot de Oeral excl. gebieden van onderstaande ssp., Klein-Azië, Madeira, Azoren, W-Canarische Eilanden): Nominaatvorm.\n\n' +
    '**melophilus** (Britse Eilanden): Bovenzijde iets donkerder en bruiner, minder olijf. Oranje-rode keel iets donkerder.\n\n' +
    '**superbus** (Gran Canaria, Tenerife): Bovenzijde grijsolijf, donkerder dan rubecula. Keel diep kastanjerood, sterker contrasterende met brede diepblauwe rand en witte buik. P10 − WP = 10–12 mm. Vogels van Tenerife meer gelijkende op rubecula. Soms als aparte soort beschouwd (Tenerife Robin).\n\n' +
    '**tataricus** (W-Siberië O van Oeral): Bleker. Keel bleker oranje. Bovenzijde met blauwgrijze was.\n\n' +
    '**witherbyi** (Tunesië, Algerije), **valens** (Krim), **caucasicus** (Kaukasus, Transkaukasië), **hyrcanus** (Z-Transkaukasië, N-Iran).',

  // ── Bronvermeldingen ──────────────────────────────────────────────────────
  bron_biometrie:         'Demongin (2016) p.245–246 — ssp. rubecula en melophilus; snavel (bill to skull) en tarsus MF gezamenlijk',
  bron_leeftijdsbepaling: 'Demongin (2016) p.245–246',
  bron_geslacht:          'Demongin (2016) p.245–246',
  bron_id_kenmerken:      'Demongin (2016) p.245–246',
  bron_ondersoorten:      'Demongin (2016) p.245–246',
  bron_ring:              'Demongin (2016) p.245',

  // ── Vangst-checklist ─────────────────────────────────────────────────────
  vangst_checklist: [
    { label: 'Vleugel',              type: 'meting', belang: 3 },
    { label: 'Gewicht',              type: 'meting', belang: 2 },
    { label: 'Tarsus',               type: 'meting', belang: 2 },
    { label: 'GC contrast',          type: 'obs',    belang: 3, note: 'Juv bruin/geelbruin buiten vs olijf geruid binnen = 1e kj · Egale olijf GC = na 1e kj' },
    { label: 'Staartveer (TF) vorm', type: 'obs',    belang: 2, note: 'Spits = 1e kj · Afgerond en breder = na 1e kj' },
    { label: 'Alula kleur',          type: 'obs',    belang: 2, note: 'Olijf egaal incl. rand = na 1e kj · Moultgrens met bruin juv alula 2/3 = 1e kj met alle GC geruid' },
  ],

  // ── Literatuurreferenties ─────────────────────────────────────────────────
  referenties_literatuur: [
    'Bensch et al. (1985a)',
    'Blasco-Zumeta en Heinze (2013)',
    'Cuadrado (1991)',
    'Dietzen et al. (2003)',
    'Dukes en Wallace (1981)',
    'Ellrich et al. (2010)',
    'Gargallo et al. (2011)',
    'Ginter et al. (2005)',
    'Guallar et al. (2010)',
    'Harper (1984)',
    'Jenni en Winkler (1994)',
    'Jolliffe (1980)',
    'Karlsson et al. (1986a)',
    'Madsen (1997)',
    'Norman (2004e)',
    'Orsini en Bouillot (1995)',
    'Ottenby Bird Observatory (2015f)',
    'Pettersson et al. (1990)',
    'Preston (1979)',
    'Rosińska (2007)',
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
