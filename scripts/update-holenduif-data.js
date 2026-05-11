/**
 * update-holenduif-data.js
 * Holenduif (EURING 06680) — biometrie, rui, leeftijd, geslacht, ID, ondersoorten, referenties.
 * Bron: Demongin (2016) p.182 — ssp. oenas, adults
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const EURING = '06680';

const { data: row, error: fetchErr } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .eq('euring_code', EURING)
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }
console.log('Huidige naam:', row.naam_nl);

const NJ = '{{07-12}}\n';
const VJ = '{{01-06}}\n';

const updates = {

  // ── Biometrie — ssp. oenas, adults ────────────────────────────────────────
  bio_vleugel_M_min: 216,  bio_vleugel_M_max: 236,
  bio_vleugel_F_min: 208,  bio_vleugel_F_max: 235,

  bio_staartlengte_M_min: 102, bio_staartlengte_M_max: 126,
  bio_staartlengte_F_min: 106, bio_staartlengte_F_max: 119,

  // Bill to feathers
  bio_snavel_schedel_M_min: 18.0, bio_snavel_schedel_M_max: 21.2,
  bio_snavel_schedel_F_min: 17.8, bio_snavel_schedel_F_max: 20.0,
  bio_snavel_schedel_is_bill_to_feathers: true,

  bio_tarsus_lengte_M_min: 28,   bio_tarsus_lengte_M_max: 31.2,
  bio_tarsus_lengte_F_min: 27.8, bio_tarsus_lengte_F_max: 31.4,

  // Gewicht: hoofdbereik; extreme waarden M (242) en (400), F (242) en (390)
  bio_gewicht_M_min: 290,  bio_gewicht_M_max: 350,
  bio_gewicht_F_min: 250,  bio_gewicht_F_max: 320,

  // ── Pennenstructuur ────────────────────────────────────────────────────────
  pennen_structuur: {
    wp: 'P4',
    hp: 11,
    hp_note: 'P1 vestigiaal',
    ap: 12,
    ap_note: '11–12 (10–15)',
    sp: 12,
  },

  vleugelformule: '',

  // ── Rui ───────────────────────────────────────────────────────────────────
  rui_notities:
    '**1e kj (3)** Volledige postjuv-rui, startend kort na uitvliegen. Sterk variabel. Vroege vogels ruien volledig zonder onderbreking en zijn in dec of jan op adult-niveau. Latere vogels suspenderen de vleugelrui in nov of dec en ronden af in feb of mrt. Laat uitgevlogen vogels beginnen de P-rui soms pas in feb of later. Als de rui volledig voltooid is, niet meer te onderscheiden van adult.\n\n' +
    '**na 1e kj (4)** Volledige postbroed-rui. P-rui van mei–jul tot half okt–vroeg dec (jan). Vleugelrui soms gesuspendeerd in laat najaar of vroeg winter (doorgaans 1–3 buitenste P aangehouden) en afgerond in het voorjaar. Lichaamsrui laat jul–vroeg okt. TF- en S-rui met name sep–nov. S waarschijnlijk niet elk jaar volledig gemoult; soms meerdere disparate S of 1–2 ongemoulte groepen aangehouden (met name S4–S7 terwijl alle P al gemoult zijn). S-rui stijgend van S1 en dalend van S8 of S9. TF-rui vanuit 2 centra of dalend.',

  // ── Leeftijdsbepaling ─────────────────────────────────────────────────────
  leeftijds_notities_nj: '',

  leeftijds_notities_vj: [

    NJ +
    '**1e kj (3)** In jeugdkleed (vroeg najaar): MC, LC, T en grootste deel van rug mat lichtbruin, soms al met asgrijs adult-veren. Geen irisatie op nek of achterhoofd. Na gedeeltelijke rui: bruine of lichtbruine juv T zichtbaar tussen asgrijs adult-veren. Buitenste juv PC lichtbruin; P soms volledig in jeugdveer tot feb of later. Let op: verwar niet met adult die later ruien en sterk versleten veren kunnen tonen. Als de postjuv-rui volledig voltooid is, is 1e kj niet meer te onderscheiden van adult.',

    NJ +
    '**na 1e kj (4)** Mantel, rug, LC en MC egaal asgrijs (soms voor/tijdens rui met bruinachtig versleten oude veren ertussen). Buitenste PC donker grijszwart. Vaak 2 generaties S zichtbaar.',

    VJ +
    '**2e kj (5)** Alleen te ouderdomsbepalen als de postjuv-rui gesuspendeerd of afgebroken was. Soms enkele versleten bruinachtige juv S, CC of TF aangehouden. Juv buitenste PC lichtbruin.',

    VJ +
    '**na 2e kj (6)** (= vorig najaar: na 1e kj (4)) Buitenste PC grijszwart. Niet te ouderdomsbepalen als de postjuv-rui volledig voltooid was.',

  ].join('\n\n'),

  // ── Geslacht ──────────────────────────────────────────────────────────────
  geslachts_notities_m:
    '- Alleen bij adult met fris verenkleed te beoordelen\n' +
    '- T en scapulars blauwgrijs',

  geslachts_notities_f:
    '- Alleen bij adult met fris verenkleed te beoordelen\n' +
    '- T en scapulars bruingrijs',

  // ── ID-kenmerken ──────────────────────────────────────────────────────────
  determinatie_id_notities:
    'Binnenste GC en T met een donkere vlek aan de basis. Zowel oog als stuit donker.\n\n' +
    '**Vergelijking Holenduif / Geelsnavelduif:**\n' +
    '| Kenmerk | Holenduif | Geelsnavelduif _C. eversmanni_ |\n' +
    '|---|---|---|\n' +
    '| Oog | Donker | Geelbruin, omringd door gele naakte huid |\n' +
    '| Stuit | Donker | Licht |\n' +
    '| Vleugel | > 215 mm | ≤ 215 mm |',

  // ── Ondersoorten ──────────────────────────────────────────────────────────
  ondersoorten:
    '**oenas** (Europa, N-Afrika, O tot N-Iran en Kaspische Zee, ZW-Siberië en N-Kazachstan): Nominaatvorm. In Europa de enige ondersoort. Eén andere ondersoort in Azië.',

  // ── Bronvermeldingen ──────────────────────────────────────────────────────
  bron_biometrie:         'Demongin (2016) p.182 — ssp. oenas, adults; gewicht M (242) 290–350 (400), F (242) 250–320 (390): hoofdbereik gebruikt',
  bron_leeftijdsbepaling: 'Demongin (2016) p.182',
  bron_geslacht:          'Demongin (2016) p.182',
  bron_id_kenmerken:      'Demongin (2016) p.182',
  bron_ondersoorten:      'Demongin (2016) p.182',
  bron_ring:              'Demongin (2016) p.182',

  // ── Eerste broedleeftijd ──────────────────────────────────────────────────
  eerste_broedleeftijd: '2Y',

  // ── Vangst-checklist ─────────────────────────────────────────────────────
  vangst_checklist: [
    { label: 'Vleugel',        type: 'meting', belang: 3 },
    { label: 'Tarsus',         type: 'meting', belang: 2 },
    { label: 'Gewicht',        type: 'meting', belang: 2 },
    { label: 'MC/LC/T kleur',  type: 'obs',    belang: 3, note: 'Mat lichtbruin, geen irisatie op nek = 1e kj (3) · Egaal asgrijs = na 1e kj (4)' },
    { label: 'Buitenste PC',   type: 'obs',    belang: 3, note: 'Lichtbruin juv = 1e kj (3) · Donker grijszwart = na 1e kj (4)' },
    { label: 'T en scapulars', type: 'obs',    belang: 2, note: 'Blauwgrijs = ♂ M · Bruingrijs = ♀ V (alleen bij adult met fris verenkleed)' },
  ],

  // ── Literatuurreferenties ─────────────────────────────────────────────────
  referenties_literatuur: [
    'Blasco-Zumeta & Heinze (2013)',
    'Gibbs (2000)',
    'Vercauteren (1990)',
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
