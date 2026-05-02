/**
 * populate-determinatie.js
 * Vult de determinatie_aid-tabel in Supabase met de aid-definities uit corvidae.js.
 * Functies worden vervangen door type-strings (transform_type / bereken_type).
 *
 * Gebruik: node scripts/populate-determinatie.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// ─── Aid-definities als pure JSON (geen functies) ───────────────────────────
// transform_type en bereken_type worden client-side omgezet naar echte functies.

const aids = [
  {
    id: 'roek-geslacht',
    soorten: ['15630'],
    resultaat_veld: 'geslacht',
    naam: 'Geslachtsbepaling Roek',
    korte_beschrijving: 'Via broedvlek en vleugel/snavelverhouding (alleen adult)',
    bron: 'Demongin (2020) p.349',
    type: 'survey',
    start: 'broedvlek',
    overzicht: [
      { conditie: 'Broedvlek aanwezig', resultaat: '♀ Vrouw', zeker: true },
      {
        conditie: 'Geen broedvlek / niet vastgesteld',
        sub: [
          { conditie: 'Juveniel / 1e kj', resultaat: 'Niet te bepalen' },
          {
            conditie: 'Adult (2e kj of ouder)',
            sub: [
              { conditie: 'Vleugel > grenswaarde', resultaat: '♂ Mogelijk man' },
              { conditie: 'Vleugel < grenswaarde', resultaat: '♀ Mogelijk vrouw' },
              { conditie: 'Grenswaarde (mm) = −2,375 × snavellengte tot schedel + 448,75', info: true },
            ],
          },
        ],
      },
    ],
    stappen: {
      broedvlek: {
        id: 'broedvlek',
        label: 'Broedvlek',
        type: 'keuze',
        vraag: 'Is er een broedvlek aanwezig?',
        toelichting: 'Een broedvlek is altijd een teken van een vrouw.',
        uit_formulier: {
          veld: 'broedvlek',
          transform_type: 'boolean_naar_ja_nee',
        },
        opties: [
          {
            waarde: 'ja',
            label: 'Ja',
            resultaat: {
              waarde: 'F',
              label: '♀ Vrouw',
              zeker: true,
              uitleg: 'Aanwezigheid van een broedvlek bevestigt dat het een vrouw is.',
            },
          },
          {
            waarde: 'nee',
            label: 'Nee / niet vastgesteld',
            volgende: 'leeftijd',
          },
        ],
      },

      leeftijd: {
        id: 'leeftijd',
        label: 'Leeftijd',
        type: 'keuze',
        vraag: 'Is de vogel volwassen (adult)?',
        toelichting: 'De snavelindex geldt alleen voor adulten (2e kj of ouder).',
        verwijzing: {
          aid_id: 'roek-leeftijd',
          label: 'Leeftijd nog niet bepaald?',
          knop_label: 'Bepaal leeftijd eerst',
        },
        uit_formulier: {
          veld: 'leeftijd',
          transform_type: 'euring_leeftijd_naar_adult_juveniel',
        },
        opties: [
          {
            waarde: 'adult',
            label: 'Ja, adult (2e kj of ouder)',
            volgende: 'metingen',
          },
          {
            waarde: 'juveniel',
            label: 'Nee, juveniel / 1e kj',
            resultaat: {
              waarde: null,
              fallback_waarde: 'U',
              label: 'Niet te bepalen',
              zeker: false,
              uitleg: 'De snavelindex voor geslachtsbepaling geldt alleen bij adulte vogels.',
            },
          },
        ],
      },

      metingen: {
        id: 'metingen',
        label: 'Metingen',
        type: 'meting',
        vraag: 'Voer de maten in',
        toelichting: null,
        inputs: [
          {
            key: 'vleugel',
            label: 'Vleugel (mm)',
            uit_formulier: 'vleugel',
            decimalen: 0,
            min: 200,
            max: 420,
            placeholder: 'bijv. 315',
          },
          {
            key: 'snavel_schedel',
            label: 'Snavellengte tot schedel (mm)',
            uit_formulier: 'snavel_schedel',
            decimalen: 1,
            min: 40,
            max: 100,
            placeholder: 'bijv. 62',
          },
        ],
        bereken_type: 'lineaire_grenswaarde',
        bereken_config: {
          veld_a: 'vleugel',
          veld_b: 'snavel_schedel',
          slope: -2.375,
          intercept: 448.75,
          resultaat_groter: {
            waarde: 'M',
            label: '♂ Mogelijk man',
            zeker: false,
            uitleg_template: 'Vleugel {a} mm ligt boven de grenswaarde van {grens} mm bij snavellengte {b} mm.',
          },
          resultaat_kleiner: {
            waarde: 'F',
            label: '♀ Mogelijk vrouw',
            zeker: false,
            uitleg_template: 'Vleugel {a} mm ligt onder de grenswaarde van {grens} mm bij snavellengte {b} mm.',
          },
          resultaat_gelijk: {
            waarde: null,
            fallback_waarde: 'U',
            label: 'Exact op de grens — niet te bepalen',
            zeker: false,
            uitleg_template: 'Vleugel {a} mm valt exact op de grenswaarde bij snavellengte {b} mm.',
          },
        },
      },
    },
  },

  {
    id: 'roek-leeftijd',
    soorten: ['15630'],
    resultaat_veld: 'leeftijd',
    naam: 'Leeftijdsbepaling Roek',
    korte_beschrijving: 'Via kopglans, slagpennen, dekveren en vedering kin/wangen',
    bron: 'Speek (1994) p.191',
    type: 'survey',
    start: 'kop_kleur',
    overzicht: [
      { conditie: 'Kop matzwart', resultaat: '1e kj', zeker: true },
      {
        conditie: 'Kop min of meer glanzend',
        sub: [
          {
            conditie: 'Slagpennen zwartachtig bruin, enkele sporen metaalglans, contrasterend met kleine en middelste vleugeldekveren',
            sub: [
              {
                conditie: 'Veren op kin en wangen; neusgaten bedekt',
                sub: [
                  { conditie: 'Januari t/m mei', resultaat: '2e kj' },
                  { conditie: 'Juni t/m december', resultaat: '1e kj' },
                ],
              },
              { conditie: 'Kin en wangen kaal, neusgaten nog bedekt', resultaat: '2e kj (jan–jun)' },
            ],
          },
          {
            conditie: 'Slagpennen zwart met sterk metaalachtige purpergroene glans, overeenkomend met vleugeldekveren',
            sub: [
              {
                conditie: 'Sporen van haren, dons of afgebroken pennen op kin, wangen of neusgaten',
                sub: [
                  { conditie: 'Januari t/m mei', resultaat: '3e kj' },
                  { conditie: 'Juni t/m december', resultaat: '2e kj' },
                ],
              },
              {
                conditie: 'Kin, wangen en neusgaten geheel kaal',
                sub: [
                  { conditie: 'Januari t/m mei', resultaat: 'na 2e kj' },
                  { conditie: 'Juni t/m december', resultaat: 'na 1e kj' },
                ],
              },
            ],
          },
        ],
      },
    ],
    stappen: {
      kop_kleur: {
        id: 'kop_kleur',
        label: 'Kopkleur',
        type: 'keuze',
        vraag: 'Hoe is de kopkleur?',
        toelichting: 'Let op de glans van kruin en wangen.',
        opties: [
          {
            waarde: 'mat',
            label: 'Matzwart — geen of nauwelijks glans',
            resultaat: {
              waarde: '3',
              label: '1e kj',
              zeker: true,
              uitleg: 'Een matzwarte kop is kenmerkend voor een vogel in zijn eerste kalenderjaar.',
            },
          },
          {
            waarde: 'glanzend',
            label: 'Min of meer glanzend',
            volgende: 'vleugel_type',
          },
        ],
      },

      vleugel_type: {
        id: 'vleugel_type',
        label: 'Slagpennen & dekveren',
        type: 'keuze',
        vraag: 'Hoe zijn de slagpennen en buitenste armpendekveren?',
        toelichting: 'Vergelijk kleur en glans van slagpennen met de kleine en middelste vleugeldekveren.',
        opties: [
          {
            waarde: 'bruin',
            label: 'Zwartachtig bruin, slechts enkele sporen metaalglans — contrasterend met kleine en middelste vleugeldekveren',
            volgende: 'kin_toestand_bruin',
          },
          {
            waarde: 'zwart_metaalglans',
            label: 'Zwart met sterk metaalachtige purpergroene glans — overeenkomend met de vleugeldekveren',
            volgende: 'kin_sporen',
          },
        ],
      },

      kin_toestand_bruin: {
        id: 'kin_toestand_bruin',
        label: 'Kin & wangen',
        type: 'keuze',
        vraag: 'Hoe zijn kin, wangen en neusgaten?',
        toelichting: 'Let op de aanwezigheid van veren op kin en wangen en of de neusgaten bedekt zijn.',
        opties: [
          {
            waarde: 'veren',
            label: 'Veren op kin en wangen; neusgaten bedekt met veren',
            volgende: 'periode_a',
          },
          {
            waarde: 'kaal_neusgat_bedekt',
            label: 'Kin en wangen kaal, maar neusgaten nog bedekt met veren',
            resultaat: {
              waarde: '5',
              label: '2e kj (jan–jun)',
              zeker: false,
              uitleg: 'Kale kin en wangen maar bedekte neusgaten duiden op een 2e-kalenderjaar vogel (januari t/m juni).',
            },
          },
        ],
      },

      periode_a: {
        id: 'periode_a',
        label: 'Periode',
        type: 'keuze',
        vraag: 'In welke periode is de vogel gevangen?',
        toelichting: null,
        uit_formulier: {
          veld: 'datum',
          transform_type: 'datum_naar_periode',
        },
        opties: [
          {
            waarde: 'jan_mei',
            label: 'Januari t/m mei',
            resultaat: {
              waarde: '5',
              label: '2e kj',
              zeker: false,
              uitleg: 'Bruinachtige slagpennen met veren op kin/wangen en bedekte neusgaten; periode januari–mei: 2e kalenderjaar.',
            },
          },
          {
            waarde: 'jun_dec',
            label: 'Juni t/m december',
            resultaat: {
              waarde: '3',
              label: '1e kj',
              zeker: false,
              uitleg: 'Bruinachtige slagpennen met veren op kin/wangen en bedekte neusgaten; periode juni–december: 1e kalenderjaar.',
            },
          },
        ],
      },

      kin_sporen: {
        id: 'kin_sporen',
        label: 'Kin & wangen',
        type: 'keuze',
        vraag: 'Zijn er sporen van haren, dons of afgebroken pennen op de kin, wangen of omgeving van de neusgaten?',
        toelichting: null,
        opties: [
          {
            waarde: 'ja',
            label: 'Ja — (sporen van) haren, dons of afgebroken pennen aanwezig',
            volgende: 'periode_b',
          },
          {
            waarde: 'nee',
            label: 'Nee — kin, wangen en neusgaten geheel kaal',
            volgende: 'periode_c',
          },
        ],
      },

      periode_b: {
        id: 'periode_b',
        label: 'Periode',
        type: 'keuze',
        vraag: 'In welke periode is de vogel gevangen?',
        toelichting: null,
        uit_formulier: {
          veld: 'datum',
          transform_type: 'datum_naar_periode',
        },
        opties: [
          {
            waarde: 'jan_mei',
            label: 'Januari t/m mei',
            resultaat: {
              waarde: '7',
              label: '3e kj',
              zeker: false,
              uitleg: 'Zwarte slagpennen met sterke metaalglans; sporen op kin/wangen; periode januari–mei: 3e kalenderjaar.',
            },
          },
          {
            waarde: 'jun_dec',
            label: 'Juni t/m december',
            resultaat: {
              waarde: '5',
              label: '2e kj',
              zeker: false,
              uitleg: 'Zwarte slagpennen met sterke metaalglans; sporen op kin/wangen; periode juni–december: 2e kalenderjaar.',
            },
          },
        ],
      },

      periode_c: {
        id: 'periode_c',
        label: 'Periode',
        type: 'keuze',
        vraag: 'In welke periode is de vogel gevangen?',
        toelichting: null,
        uit_formulier: {
          veld: 'datum',
          transform_type: 'datum_naar_periode',
        },
        opties: [
          {
            waarde: 'jan_mei',
            label: 'Januari t/m mei',
            resultaat: {
              waarde: '6',
              label: 'na 2e kj',
              zeker: false,
              uitleg: 'Zwarte slagpennen met sterke metaalglans; kin/wangen geheel kaal; periode januari–mei: na 2e kalenderjaar (3e kj of ouder).',
            },
          },
          {
            waarde: 'jun_dec',
            label: 'Juni t/m december',
            resultaat: {
              waarde: '4',
              label: 'na 1e kj',
              zeker: false,
              uitleg: 'Zwarte slagpennen met sterke metaalglans; kin/wangen geheel kaal; periode juni–december: na 1e kalenderjaar (2e kj of ouder).',
            },
          },
        ],
      },
    },
  },
];

// Upsert in Supabase
console.log(`${aids.length} aids uploaden naar Supabase...`);
for (const aid of aids) {
  const { error } = await sb.from('determinatie_aid').upsert({ id: aid.id, data: aid });
  if (error) {
    console.error(`Fout bij ${aid.id}:`, error.message);
    process.exit(1);
  }
  console.log(`  ✓ ${aid.id} (${aid.naam})`);
}
console.log('Klaar.');
