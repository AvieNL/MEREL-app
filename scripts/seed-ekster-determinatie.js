/**
 * seed-ekster-determinatie.js
 * Voegt de determinatiehulpen voor de Ekster (EURING 15490) toe aan
 * de Supabase determinatie_aid tabel.
 *
 * Gebruik: node scripts/seed-ekster-determinatie.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// ─── Aid-definities (Supabase-formaat: geen JS-functies, wel transform_type) ──

const leeftijdAid = {
  id: 'ekster-leeftijd',
  soorten: ['15490'],
  resultaat_veld: 'leeftijd',
  naam: 'Leeftijdsbepaling Ekster',
  korte_beschrijving: 'Iris kleur (3J) · vliegveren glans + moultgrens (alula/PC/T vs GC) · TF vorm',
  bron: 'Demongin (2016) p.343–344',
  type: 'survey',
  start: 'seizoen',
  overzicht: [
    { conditie: 'Iris blauwgrijs, bovenzijde dof zwart, binnenzijde mandibel bleek', resultaat: '1e kj volledig juv (3J)' },
    { conditie: 'Weinig glans, moultgrens juv alula/PC/T vs glanzende GC, TF smal', resultaat: '1e kj (3)' },
    { conditie: 'Sterk glanzend, geen moultgrens, TF vierkant en breed', resultaat: 'na 1e kj (4)' },
    { conditie: 'VJ: vliegveren versleten, TF smal (niet nader te dateren)', resultaat: '1e kj of 2e kj (3 of 5)' },
    { conditie: 'VJ: vliegveren glanzend, TF breed (niet nader te dateren)', resultaat: 'na 1e kj of na 2e kj (4 of 6)' },
  ],
  stappen: {

    seizoen: {
      id: 'seizoen',
      label: 'Seizoen',
      type: 'keuze',
      vraag: 'In welk seizoen is de vogel gevangen?',
      toelichting: 'Het seizoen bepaalt welke EURING-codes van toepassing zijn. Leeftijdsbepaling in het najaar is gedetailleerder dan in het voorjaar.',
      uit_formulier: {
        veld: 'datum',
        transform_type: 'datum_naar_periode',
      },
      opties: [
        { waarde: 'jun_dec', label: 'Zomer / najaar (jun–dec)', volgende: 'iris_kleur_nj' },
        { waarde: 'jan_mei', label: 'Voorjaar (jan–mei)',       volgende: 'vliegveren_toestand_vj' },
      ],
    },

    // ── Najaar-pad ────────────────────────────────────────────────────────────

    iris_kleur_nj: {
      id: 'iris_kleur_nj',
      label: 'Iris kleur',
      type: 'keuze',
      vraag: 'Hoe is de iris van kleur?',
      toelichting: 'Iris blauwgrijs is kenmerkend voor een vogel in volledig juveniel verenkleed (3J), vóór de postjuv-rui. De iris wordt snel donkerbruin. Controleer ook de binnenzijde van de bovenmandibel: bleek rozeachtig tot witachtig = 3J, zwartgrijs = ouder.',
      opties: [
        {
          waarde: 'blauwgrijs',
          label: 'Blauwgrijs — nog niet donkerbruin',
          resultaat: {
            waarde: '3',
            label: '1e kj volledig juv (3J)',
            zeker: false,
            uitleg: 'Blauwgrijze iris wijst op een vogel in volledig juveniel verenkleed (3J). Bovenzijde dof zwart. Kleine ring van blauwgrijze [gele] blote huid rond oog. Binnenzijde bovenmandibel bleek, rozeachtig tot witachtig.',
          },
        },
        {
          waarde: 'donkerbruin',
          label: 'Donkerbruin — of kleur niet goed te beoordelen',
          volgende: 'vliegveren_glans_nj',
        },
      ],
    },

    vliegveren_glans_nj: {
      id: 'vliegveren_glans_nj',
      label: 'Vliegveren glans (najaar)',
      type: 'keuze',
      vraag: 'Zijn de vliegveren glanzend zwart, en is er een moultgrens zichtbaar?',
      toelichting: 'Bij 1e kj zijn de juv alula, PC en T weinig glanzend en contrasteren ze met de glanzende geruide GC. Let ook op de TF: smal en afgerond = 1e kj; vierkant en breed = na 1e kj. Bij na 1e kj zijn alle vliegveren sterk glanzend zwart en is er geen moultgrens.',
      opties: [
        {
          waarde: 'weinig_glans',
          label: 'Weinig glans — juv alula, PC en/of T dof, contrasterende met glanzende geruide GC; TF smal en afgerond',
          resultaat: {
            waarde: '3',
            label: '1e kj',
            zeker: false,
            uitleg: '1e kj (3): vliegveren doorgaans meer versleten en bruinachtig dan bij adult. Juv alula, PC en T weinig glanzend, contrasterende met glanzende geruide GC. TF smal en afgerond. Bovenzijde zwart met weinig metaalglans.',
          },
        },
        {
          waarde: 'sterk_glanzend',
          label: 'Sterk glanzend — alle vliegveren glanzend zwart, geen moultgrens; TF vierkant en breed',
          resultaat: {
            waarde: '4',
            label: 'na 1e kj',
            zeker: false,
            uitleg: 'na 1e kj (4): glanzende vliegveren zonder moultgrens in de vleugel. TF vierkant en breed. Bovenzijde zwart met metaalglans.',
          },
        },
        {
          waarde: 'onzeker',
          label: 'Niet te beoordelen',
          resultaat: {
            waarde: null,
            fallback_waarde: 'U',
            label: 'Niet te bepalen',
            zeker: false,
            uitleg: 'Leeftijdsbepaling niet mogelijk. Controleer iris kleur (blauwgrijs = 3J), TF vorm (smal/afgerond = 1e kj; vierkant/breed = na 1e kj) en binnenzijde bovenmandibel (bleek = 3J).',
          },
        },
      ],
    },

    // ── Voorjaar-pad ──────────────────────────────────────────────────────────

    vliegveren_toestand_vj: {
      id: 'vliegveren_toestand_vj',
      label: 'Vliegveren toestand (voorjaar)',
      type: 'keuze',
      vraag: 'Hoe zijn P1, P2 en de vliegveren in het algemeen?',
      toelichting: 'In het voorjaar zijn 1e kj en 2e kj niet van elkaar te onderscheiden (beide EURING 3 of 5). Leeftijdsbepaling is beperkt tot jong-vogel vs adult. Kijk naar glans, slijtage van P1/P2 en TF-vorm.',
      opties: [
        {
          waarde: 'versleten',
          label: 'P1 en P2 versleten en bruinachtig; alula, PC en T weinig glanzend; TF smal en afgerond',
          resultaat: {
            waarde: null,
            fallback_waarde: 'U',
            label: '1e kj of 2e kj (niet nader te dateren)',
            zeker: false,
            uitleg: '1e kj of 2e kj (3 of 5) — niet nader te dateren in het voorjaar. P1 en P2 doorgaans meer versleten en bruinachtig. Juv alula, PC en T weinig glanzend. TF smal en afgerond. Bovenzijde met weinig metaalglans.',
          },
        },
        {
          waarde: 'glanzend',
          label: 'P1 en P2 glanzend; geen moultgrens in vleugel; TF vierkant en breed',
          resultaat: {
            waarde: null,
            fallback_waarde: 'U',
            label: 'Adult (niet nader te dateren)',
            zeker: false,
            uitleg: 'na 1e kj of na 2e kj (4 of 6) — niet nader te dateren in het voorjaar. P1 en P2 glanzend. Geen moultgrens in de vleugel. TF vierkant en breed. Bovenzijde met metaalglans.',
          },
        },
        {
          waarde: 'onzeker',
          label: 'Niet te beoordelen',
          resultaat: {
            waarde: null,
            fallback_waarde: 'U',
            label: 'Niet te bepalen',
            zeker: false,
            uitleg: 'Leeftijdsbepaling in het voorjaar niet mogelijk. De onderscheidende kenmerken (slijtage P1/P2, TF vorm, vliegveren glans) zijn niet betrouwbaar te beoordelen.',
          },
        },
      ],
    },

  },
};

const geslachtAid = {
  id: 'ekster-geslacht',
  soorten: ['15490'],
  resultaat_veld: 'geslacht',
  naam: 'Geslachtsbepaling Ekster',
  korte_beschrijving: 'Broedvlek (♀ V) · vleugelmeting extreme waarden; overlap 178–198 mm groot',
  bron: 'Demongin (2016) p.343–344',
  type: 'survey',
  start: 'broedvlek_ekster',
  overzicht: [
    { conditie: 'Broedvlek aanwezig', resultaat: '♀ V' },
    { conditie: 'Vleugel ≥ 199 mm', resultaat: 'Vrijwel zeker ♂ M' },
    { conditie: 'Vleugel 178–198 mm', resultaat: 'Niet betrouwbaar te bepalen' },
    { conditie: 'Vleugel ≤ 177 mm', resultaat: 'Vrijwel zeker ♀ V' },
  ],
  stappen: {

    broedvlek_ekster: {
      id: 'broedvlek_ekster',
      label: 'Broedvlek',
      type: 'keuze',
      vraag: 'Is er een broedvlek aanwezig?',
      toelichting: 'De vrouw broedt alleen — een broedvlek is een betrouwbare ♀ V-indicator. Alleen van toepassing in het broedseizoen (circa apr–jul).',
      opties: [
        {
          waarde: 'ja',
          label: 'Ja — broedvlek aanwezig',
          resultaat: {
            waarde: 'F',
            label: '♀ V',
            zeker: true,
            uitleg: 'Aanwezigheid van een broedvlek is een zekere ♀ V-indicator. De vrouw broedt alleen (♂ M heeft geen broedvlek).',
          },
        },
        {
          waarde: 'nee',
          label: 'Nee of niet van toepassing (buiten broedseizoen)',
          volgende: 'vleugel_range_ekster',
        },
      ],
    },

    vleugel_range_ekster: {
      id: 'vleugel_range_ekster',
      label: 'Vleugelmeting',
      type: 'keuze',
      vraag: 'Wat is de vleugelmeting (vlakke vleugel, ssp. pica)?',
      toelichting: 'Er is geen betrouwbaar visueel geslachtskenmerk bij Ekster. De vleugelmeting is de enige bruikbare indicator, maar het grensgebied 178–198 mm is groot. Vergelijk bij voorkeur mannetje en vrouwtje binnen het koppel. Let op clinale variatie: vogels van N-Scandinavië (_fennorum_) zijn gemiddeld 2–5% groter.',
      opties: [
        {
          waarde: 'groot',
          label: '≥ 199 mm — boven het maximum van ♀ V ad (198 mm)',
          resultaat: {
            waarde: 'M',
            label: '♂ M (vrijwel zeker)',
            zeker: false,
            uitleg: 'Vleugel ≥ 199 mm valt boven het maximum van ♀ V ad (ssp. pica: ♀ V max 198 mm) en wijst vrijwel zeker op ♂ M. Juv ♀ V max is 195 mm, dus ≥ 199 mm is voor alle leeftijden ♂ M.',
          },
        },
        {
          waarde: 'midden',
          label: '178–198 mm — grensgebied, grote overlap ♂ M en ♀ V',
          resultaat: {
            waarde: null,
            fallback_waarde: 'U',
            label: 'Niet betrouwbaar te bepalen',
            zeker: false,
            uitleg: 'In het grensgebied 178–198 mm (ssp. pica) overlappen ♂ M en ♀ V sterk. Geslachtsbepaling via vleugelmeting alleen is niet betrouwbaar. Formule voor adult pica: ♂ M als 0,02 × staart − 0,02 × gewicht − 0,09 × vleugel − 0,24 × snavellengte (neusgat) − 0,94 × snaveldiepte + 35,8 > 0.',
          },
        },
        {
          waarde: 'klein',
          label: '≤ 177 mm — onder het minimum van ♂ M (min 178 mm)',
          resultaat: {
            waarde: 'F',
            label: '♀ V (vrijwel zeker)',
            zeker: false,
            uitleg: 'Vleugel ≤ 177 mm valt onder het minimum van ♂ M (ssp. pica: ♂ M min 178 mm juv) en wijst vrijwel zeker op ♀ V. Let op: alleen geldig voor ssp. pica; _fennorum_ en _bactriana_ zijn gemiddeld iets groter.',
          },
        },
      ],
    },

  },
};

// ─── Upsert naar Supabase ────────────────────────────────────────────────────

const rows = [
  { id: leeftijdAid.id, data: leeftijdAid },
  { id: geslachtAid.id, data: geslachtAid },
];

const { error } = await sb.from('determinatie_aid').upsert(rows);

if (error) {
  console.error('Upsert mislukt:', error.message);
  process.exit(1);
}

console.log('✓ Ekster determinatiehulpen toegevoegd aan Supabase:');
rows.forEach(r => console.log(' ', r.id));
