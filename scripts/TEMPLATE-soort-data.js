/**
 * TEMPLATE-soort-data.js
 * Kopieer dit bestand, hernoem naar update-[soort]-data.js en vul de velden in.
 * Roek (15630) en Kauw (15600) zijn de referentiesoorten voor opmaak.
 *
 * REGELS (niet afwijken):
 *
 * 1.  pennen_structuur  — altijd JSON-object, NOOIT vleugelformule-tekst voor basistelling
 *     { wp, hp, hp_note?, ap, tp, sp }
 *     wp-waarde = "P4 (soms P3)" formaat, NIET "(3)4"
 *
 * 2.  vleugelformule    — alleen voor extra info (Em/Notch/WP-afstanden).
 *     Leeg string '' als er niets extra's is. NOOIT bron erin.
 *
 * 3.  rui_notities      — markdown OK (**bold**). GEEN inline bron aan het einde.
 *
 * 4.  leeftijds_notities_vj — {{MM-MM}}\n**Titel:**\ninhoud per blok.
 *     GEEN inline bron aan het einde.
 *
 * 5.  leeftijds_notities_nj — altijd '' (lege string) voor tabs-modus.
 *     !! NOOIT inhoud in nj zetten !! Zodra nj inhoud heeft, valt SoortDetail
 *     terug naar klassieke modus (renderMarkdown) en worden {{MM-MM}}-blokken
 *     NIET verwerkt maar als ruwe tekst getoond.
 *     Najaarblokken horen in vj met {{07-12}}-maandmarkers — renderLeeftijdMarkdown
 *     filtert ze op basis van de gekozen tab (vj = jan–jun, nj = jul–dec).
 *
 * 6.  geslachts_notities_m/f — ALLEEN bullets (- item), geen kopregels,
 *     GEEN maten (staan in biometrie), GEEN inline bron.
 *
 * 7.  determinatie_id_notities — tabelformaat:
 *     '**Vergelijking [eigen soort] / [andere soort]:**\n| Kenmerk | ... | ... |\n|---|...'
 *     Bulletformaat: '**Onderscheid met [soort]:**\n- punt\n- punt'
 *     GEEN inline bron.
 *
 * 8.  ondersoorten      — markdown tekst. GEEN inline bron.
 *
 * 9.  bron_*            — ALLE bronvermeldingen uitsluitend hier:
 *     bron_biometrie, bron_leeftijdsbepaling, bron_geslacht,
 *     bron_id_kenmerken, bron_ondersoorten, bron_ring
 *
 * 10. bio_*-sleutels    — gebruik EXACT de keys uit BIO_FIELDS in SoortDetail.jsx:
 *     vleugel, handpenlengte, staartlengte, kop_snavel, snavel_schedel,
 *     snavel_neusgat, tarsus_lengte, tarsus_dikte, snavel_diepte,
 *     snavel_diepte_mid, gewicht
 *     → bio_vleugel_M_min, bio_vleugel_M_max, bio_vleugel_F_min, bio_vleugel_F_max
 *     → bio_snavel_diepte_mid_M_min  ← LET OP: NIET bio_snavel_hoogte_neusgat_*
 *
 * 11. vangst_checklist notes — max ~40 tekens per note.
 *
 * 12. Versie            — na elke run: changelog.js én package.json ophogen.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// ─── Pas aan: EURING-code van de soort ───────────────────────────────────────
const EURING = 'XXXXX';

const { data: row, error: fetchErr } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .eq('euring_code', EURING)
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }
console.log('Huidige naam:', row.naam_nl);

// ─── Vul in ───────────────────────────────────────────────────────────────────
const updates = {

  // ── Biometrie ──────────────────────────────────────────────────────────────
  // Gebruik EXACT deze sleutelnamen (zie BIO_FIELDS in SoortDetail.jsx)
  bio_vleugel_M_min:        '',   bio_vleugel_M_max:        '',
  bio_vleugel_F_min:        '',   bio_vleugel_F_max:        '',
  bio_staartlengte_M_min:   '',   bio_staartlengte_M_max:   '',
  bio_staartlengte_F_min:   '',   bio_staartlengte_F_max:   '',
  bio_snavel_schedel_M_min: '',   bio_snavel_schedel_M_max: '',
  bio_snavel_schedel_F_min: '',   bio_snavel_schedel_F_max: '',
  bio_snavel_diepte_M_min:  '',   bio_snavel_diepte_M_max:  '',
  bio_snavel_diepte_F_min:  '',   bio_snavel_diepte_F_max:  '',
  // snavel_diepte_mid = snaveldiepte midden neusgat (Demongin: "bill depth at nostrils")
  bio_snavel_diepte_mid_M_min: '', bio_snavel_diepte_mid_M_max: '',
  bio_snavel_diepte_mid_F_min: '', bio_snavel_diepte_mid_F_max: '',
  bio_tarsus_lengte_M_min:  '',   bio_tarsus_lengte_M_max:  '',
  bio_tarsus_lengte_F_min:  '',   bio_tarsus_lengte_F_max:  '',
  bio_gewicht_M_min:        '',   bio_gewicht_M_max:        '',
  bio_gewicht_F_min:        '',   bio_gewicht_F_max:        '',

  // ── Nestgegevens ───────────────────────────────────────────────────────────
  eerste_broedleeftijd: '',   // bijv. '3Y' of '(2Y) 3Y'

  // ── Pennenstructuur → tabel op soortenpagina ───────────────────────────────
  // wp-waarde: "P4 (soms P3)" formaat, NIET "(3)4"
  pennen_structuur: {
    wp:      'P? (soms P?)',  // Vleugelpunt
    hp:      0,               // Handpennen (getal)
    hp_note: 'P1 kort',       // optioneel; weglaten als niet van toepassing
    ap:      0,               // Armpennen
    tp:      0,               // Tertials
    sp:      0,               // Staartpennen
  },

  // ── Vleugelformule — alleen extra info, '' als niets extra's ───────────────
  // GEEN bron erin. Gebruik · als scheider voor key:value paren.
  // Voorbeeld: 'Em (buitenvlag): P3–P6 · Notch (binnenvlag): P2–P5'
  vleugelformule: '',

  // ── Ruitiming — markdown, GEEN inline bron ─────────────────────────────────
  // **Vetgedrukte titel** gevolgd door beschrijving.
  rui_notities:
    '**Juveniel [3]** ...\n\n' +
    '**Adult [4]** ...',

  // ── Leeftijdsbepaling — tabs-modus ─────────────────────────────────────────
  // Altijd leeg laten voor najaar (tabs-modus in SoortDetail).
  // GEEN inline bron aan het einde van leeftijds_notities_vj.
  leeftijds_notities_nj: '',
  leeftijds_notities_vj:
    '{{MM-MM}}\n' +
    '**1e kj (EURING 3) — [periode]:**\n' +
    '[kenmerken]\n\n' +
    '{{MM-MM}}\n' +
    '**Adult (EURING 4/6):**\n' +
    '[kenmerken]',

  // ── Geslachtsbepaling — bullets, geen kopregels, geen maten ───────────────
  // GEEN "♂ M — Kenmerken:"-kopregel. GEEN maten (staan in biometrie).
  // GEEN inline bron. Alleen bullets.
  geslachts_notities_m:
    '- [kenmerk 1]\n' +
    '- [kenmerk 2]',

  geslachts_notities_f:
    '- [kenmerk 1]\n' +
    '- [kenmerk 2]',

  // ── ID-kenmerken — tabel of bulletlijst ────────────────────────────────────
  // Tabel: **Vergelijking [eigen soort] / [andere soort]:**\n| ... |
  // Bullets: **Onderscheid met [soort]:**\n- punt
  // Meerdere blokken: scheiden met \n\n
  // GEEN inline bron.
  determinatie_id_notities:
    '**Vergelijking [Soort A] / [Soort B]:**\n' +
    '| Kenmerk | [Soort A] | [Soort B] |\n' +
    '|---|---|---|\n' +
    '| [kenmerk] | [waarde A] | [waarde B] |',

  // ── Ondersoorten — markdown, GEEN inline bron ─────────────────────────────
  ondersoorten:
    '**S. s. subspecies** ([verspreiding]): [kenmerken]\n\n' +
    '**S. s. subspecies2** ([verspreiding]): [kenmerken]',

  // ── Bronvermeldingen per sectie — uitsluitend hier, nooit inline ───────────
  bron_biometrie:         '[Auteur (jaar) p.xxx]',
  bron_leeftijdsbepaling: '[Auteur (jaar) p.xxx]',
  bron_geslacht:          '[Auteur (jaar) p.xxx]',
  bron_id_kenmerken:      '[Auteur (jaar) p.xxx]',
  bron_ondersoorten:      '[Auteur (jaar) p.xxx]',
  bron_ring:              '[Auteur (jaar) p.xxx]',

  // ── Vangst-checklist — notes MAX ~40 tekens ────────────────────────────────
  vangst_checklist: [
    { label: 'Vleugel',          type: 'meting', belang: 3 },
    { label: 'Snavel tot schedel', type: 'meting', belang: 2 },
    { label: 'Gewicht',           type: 'meting', belang: 2 },
    // Voeg toe wat relevant is, houd notes kort:
    // { label: 'Iriskleur', type: 'obs', belang: 3, note: 'Kort=juv · Lang=adult' },
  ],
};

// ─── Lege strings verwijderen voor netere data ────────────────────────────────
const filtered = Object.fromEntries(
  Object.entries(updates).filter(([, v]) => v !== '' && v !== null && v !== undefined)
);

// ─── Merge en upsert ──────────────────────────────────────────────────────────
const newData = { ...row.data, ...filtered };

const { error: upsertErr } = await sb.from('species').upsert({
  euring_code: row.euring_code,
  naam_nl:     row.naam_nl,
  data:        newData,
});

if (upsertErr) { console.error('Upsert mislukt:', upsertErr.message); process.exit(1); }

console.log('✓', row.naam_nl, '— data bijgewerkt');
console.log('  Velden:', Object.keys(filtered).join(', '));
console.log('\nNiet vergeten: changelog.js en package.json versienummer ophogen!');
