/**
 * update-kauw-data.js
 * Voegt uitgebreide data toe aan de Kauw (EURING 15600) in Supabase.
 * Data gebaseerd op Demongin (2020) p.347–348.
 *
 * Gebruik: node scripts/update-kauw-data.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// ─── Lees huidige data op ─────────────────────────────────────────────────────
const { data: row, error: fetchErr } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .eq('euring_code', '15600')
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }
console.log('Huidige naam:', row.naam_nl);

// ─── Nieuwe/bijgewerkte velden ────────────────────────────────────────────────
const updates = {
  // Biometrie (adult, na eerste complete rui) — Demongin (2020) p.347–348
  bio_vleugel_M_min: '220',
  bio_vleugel_M_max: '249',
  bio_vleugel_F_min: '215',
  bio_vleugel_F_max: '240',

  bio_snavel_schedel_M_min: '32.0',
  bio_snavel_schedel_M_max: '36.5',
  bio_snavel_schedel_F_min: '29.5',
  bio_snavel_schedel_F_max: '33.0',

  // Snavelhoogte op neusgat (bill depth at middle of nostrils)
  bio_snavel_hoogte_neusgat_M_min: '12.8',
  bio_snavel_hoogte_neusgat_M_max: '14.0',
  bio_snavel_hoogte_neusgat_F_min: '11.8',
  bio_snavel_hoogte_neusgat_F_max: '13.4',

  bio_tarsus_lengte_M_min: '39.5',
  bio_tarsus_lengte_M_max: '46.0',
  bio_tarsus_lengte_F_min: '32.5',
  bio_tarsus_lengte_F_max: '44.0',

  bio_gewicht_M_min: '174',
  bio_gewicht_M_max: '265',
  bio_gewicht_F_min: '175',
  bio_gewicht_F_max: '271',

  // Overige velden
  eerste_broedleeftijd: '3Y',

  bron_biometrie: 'Demongin (2020) p.347–348',

  vleugelformule:
    'WP = (3)4; 10 P (P1 kort); 6 S + 4 T; 12 TF\n' +
    'Bron: Demongin (2020) p.347',

  rui_notities:
    '**Juveniel [3]** Gedeeltelijke postrui juli–september: lichaamsveren, alle of deel van kleine en middelste vleugeldekveren, zelden enkele grote armpendekveren, uitzonderlijk enkele tertials of TF.\n\n' +
    '**Adult [4]** Complete postbroedselrui van half-mei/begin-juli tot half-augustus/half-oktober. Rui van 2e kj begint iets eerder dan die van adulten.\n\n' +
    '*Bron: Demongin (2020) p.347–348*',

  // Tabs-formaat: leeftijds_notities_nj leeg laten, alles in vj met {{MM-MM}}-maandblokken
  leeftijds_notities_nj: '',

  leeftijds_notities_vj:
    '{{06-10}}\n' +
    '**1e kj (EURING 3) — na uitvliegen (zomer):**\n' +
    'Iris blauwgrijs (helder, gelijkmatig). Kruin bruinzwart met weinig glans en weinig contrast met de donkere nek. Vers juveniel verenkleed; dekveren zonder of met minimale metaalglans.\n\n' +
    '{{09-03}}\n' +
    '**1e kj (EURING 3) — herfst en winter:**\n' +
    'Iris egaal bruin (donkerbruin, niet gemengd). Juveniele armpennen, grote armpendekveren en tertials dof bruinzwart met zwakke purpertint in vers kleed — contrasterend met gevormde kleine en middelste vleugeldekveren. TF smaller en afgeronder dan bij adult, donkergrijs-bruin met beperkte metaalglans.\n\n' +
    '{{03-07}}\n' +
    '**2e kj lente (EURING 5):**\n' +
    'Iris variabel: wisselend lichtbruin, grijsachtig of zelfs (vuil) wit — nog niet eenduidig zilvergrijs. Juveniele armpennen en tertials zwaar versleten (zichtbaar vanaf maart). Juveniele S en grote armpendekveren bruinzwart, contrasterende met gevormde dekveren.\n\n' +
    '{{01-12}}\n' +
    '**Adult (EURING 4/6):**\n' +
    'Iris helder wit of zilvergrijs. Geen contrast in vleugel: armpennen, tertials en dekveren uniform zwart met sterke paarsblauwe of blauwgroene glans. TF breed, zwartachtig met groene of blauwe glans; in lente vrij fris en begint te slijten pas vanaf eind-mei (met name ♀).\n\n' +
    '*Bron: Demongin (2020) p.347–348*',

  geslachts_notities_m:
    '**♂ Maten (Demongin 2020 p.347–348):**\n' +
    'Vleugel 220–249(255) mm · Snavel tot schedel ±32–36,5 mm · Snavelhoogte neusgat 12,8–14,0 mm · Tarsus 39,5–46 mm · Gewicht 174–265 g.\n\n' +
    'Geen zekere kleurmarkering; mannetjes vallen niet betrouwbaar op te herkennen aan kleur of tekening alleen — gebruik metingen als populatie (ondersoort) bekend is. CP soms aanwezig.\n\n' +
    '*Bron: Demongin (2020) p.347–348*',

  geslachts_notities_f:
    '**♀ Maten (Demongin 2020 p.347–348):**\n' +
    'Vleugel 215–240(247) mm · Snavel tot schedel 29,5–33(35) mm · Snavelhoogte neusgat 11,8–13,4 mm · Tarsus 32,5–44 mm · Gewicht 175–271 g.\n\n' +
    'Duidelijke broedvlek is een betrouwbare ♀-indicator. M kan kleine broedvlek beperkt tot buik hebben (minder gevasculariseerd — voel het verschil). In N en E Europa (soemmerringii) heeft ♀ gemiddeld een minder bleke en minder duidelijke kraag dan ♂ — alleen bruikbaar bij directe vergelijking binnen een paar.\n\n' +
    '*Bron: Demongin (2020) p.347–348*',

  determinatie_id_notities:
    '**Westelijke Kauw vs Daurische Kauw (C. dauuricus):**\n' +
    '| Kenmerk | Westelijke Kauw | Daurische Kauw |\n' +
    '|---|---|---|\n' +
    '| Iris | Blauwgrijs (juv) → bruin (1e kj) → wit/zilvergrijs (ad) | Altijd donkerbruin |\n' +
    '| Pied morph | Nee | Buik en kraag witachtig (adult + sommige imm) |\n' +
    '| Dark morph | Nee | Gezicht, keel en bovenborst zwarter dan overige onderbuik; oordeksel met zilvergrijs streepjes |\n' +
    '| Nek (slijtage) | Bleker in versleten kleed | Blijft donker in versleten kleed |\n\n' +
    '**Hybridisatie** mogelijk: kraagpartij grijs; nek achter deels zwartachtig; oordeksel donkergrijs zonder merkteken of witte strepen.\n\n' +
    '*Bron: Demongin (2020) p.347–348*',

  ondersoorten:
    '**C. m. monedula** (Fennoscandia, centraal Europa t/m N ex-Joegoslavië en Karpaten): Kraag lichtgrijs in vers kleed, donkerder en matter in versleten kleed; zelden opvallender kraagvlek aan zijkant halsonderkant. Mantel en flanken iets bleker dan vleugels, keel en kruin. ♀ heeft vaker beperktere, minder witte kraag dan ♂.\n\n' +
    '**C. m. soemmerringii** (Rusland, O. Balticum, O. Europa, Balkan, Klein-Azië, Kaukasus, t/m Mongolië): Doorgaans duidelijke bleekgrijswitte kraag + vlekken aan halszijde in vers kleed; kroon duidelijk zwart contrasterende met bleekgrijze nek en oordeksel. Meest gecontrasteerd; vleugels zwart sterk contrasterende met rest lichaam.\n\n' +
    '**C. m. spermologus** (W en centraal Europa incl. NL, Groot-Brittannië en Italië; Marokko, NO Algerije): Geen of nauwelijks spoor van bleke kraag op nek. Snavel iets sterker. Donkerder dan beide andere ondersoorten; onderbuik en kopzijde van gelijke grijstint. Inclusief ibericus (Spanje). In NL meest voorkomend.\n\n' +
    '**C. m. cirtensis** (NO Algerije): Iets kleiner; intermediate tussen monedula en spermologus; bleek en mat, geen kraagspoor.\n\n' +
    '*Bron: Demongin (2020) p.347–348*',

  // Bronvermeldingen per sectie (zichtbaar naast sectietitels op de soortenpagina)
  bron_biometrie:         'Demongin (2020) p.347–348',
  bron_leeftijdsbepaling: 'Demongin (2020) p.347–348',
  bron_geslacht:          'Demongin (2020) p.347–348',
  bron_id_kenmerken:      'Demongin (2020) p.347–348',
  bron_ondersoorten:      'Demongin (2020) p.347–348',
  bron_ring:              'Demongin (2020) p.347',

  vangst_checklist: [
    { label: 'Vleugel', type: 'meting', belang: 3, note: 'Hoofdmaat; bij bekende populatie nuttig voor geslacht' },
    { label: 'Snavel tot schedel', type: 'meting', belang: 2, note: 'Bij bekende populatie nuttig voor geslacht' },
    { label: 'Snavelhoogte neusgat', type: 'meting', belang: 2, note: '♂ 12,8–14,0 mm · ♀ 11,8–13,4 mm (Demongin)' },
    { label: 'Tarsus', type: 'meting', belang: 1 },
    { label: 'Gewicht', type: 'meting', belang: 2 },
    { label: 'Iriskleur', type: 'obs', belang: 3, note: 'Blauwgrijs = juv/1e kj (zomer) · Bruin = 1e kj (herfst/winter) · Variabel = 2e kj lente · Wit/zilvergrijs = adult' },
    { label: 'Broedvlek', type: 'obs', belang: 3, note: 'Aanwezig = zeker ♀; let op: ♂ kan kleine BP op buik hebben' },
  ],
};

// ─── Merge en upsert ──────────────────────────────────────────────────────────
const newData = { ...row.data, ...updates };

const { error: upsertErr } = await sb.from('species').upsert({
  euring_code: row.euring_code,
  naam_nl: row.naam_nl,
  data: newData,
});

if (upsertErr) {
  console.error('Upsert mislukt:', upsertErr.message);
  process.exit(1);
}

console.log('✓ Kauw-data bijgewerkt in Supabase');
console.log('  Nieuwe velden:', Object.keys(updates).join(', '));
