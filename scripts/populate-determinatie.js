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
          { conditie: 'Juveniel / 1e kj — neusgaten (nog) bedekt', resultaat: 'Niet te bepalen' },
          {
            conditie: 'Adult (2e kj of ouder) — neusgaten kaal en bleekgrijs',
            sub: [
              { conditie: 'Vleugel > grenswaarde', resultaat: '♂ Mogelijk man' },
              { conditie: 'Vleugel < grenswaarde', resultaat: '♀ Mogelijk vrouw' },
              { conditie: 'Grenswaarde (mm) = −2,375 × snavellengte tot schedel + 448,75', info: true },
              { conditie: '♂ typisch: vleugel 295–338 mm · snavel tot schedel 56,5–70 mm · gewicht 405–560 g', info: true },
              { conditie: '♀ typisch: vleugel 280–320 mm · snavel tot schedel 51–62 mm · gewicht 340–500 g', info: true },
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
    korte_beschrijving: 'Via kopglans, slagpennen, neusgaten, kin/wangen en optioneel TF6-meting',
    bron: 'Demongin (2020) p.348–349; Speek (1994) p.191',
    type: 'survey',
    start: 'kop_kleur',
    overzicht: [
      { conditie: 'Kop matzwart — geen of nauwelijks glans; mondholte vleesroze', resultaat: '1e kj', zeker: true },
      {
        conditie: 'Kop min of meer glanzend',
        sub: [
          {
            conditie: 'Slagpennen zwartachtig bruin — zwak of slechts sporen metaalglans, contrasterend met kleine en middelste vleugeldekveren',
            sub: [
              {
                conditie: 'Veren op kin en wangen; neusgaten bedekt; mondholte roze',
                sub: [
                  {
                    conditie: 'Januari t/m mei',
                    resultaat: '2e kj',
                    sub: [
                      { conditie: 'TF6 doorgaans 11–23 mm korter dan TF1 (optionele bevestiging)', info: true },
                    ],
                  },
                  { conditie: 'Juni t/m december', resultaat: '1e kj' },
                ],
              },
              { conditie: 'Kin en wangen kaal; neusgaten nog (gedeeltelijk) bedekt', resultaat: '2e kj (jan–jun)' },
            ],
          },
          {
            conditie: 'Slagpennen zwart met sterk metaalachtige purper-blauwgroene glans — overeenkomend met vleugeldekveren',
            sub: [
              {
                conditie: 'Sporen van haren, dons of afgebroken pennen op kin, wangen of neusgaten; mondholte blauwachtig zwart',
                sub: [
                  { conditie: 'Januari t/m mei', resultaat: '3e kj' },
                  { conditie: 'Juni t/m december', resultaat: '2e kj' },
                ],
              },
              {
                conditie: 'Kin, wangen en neusgaten geheel kaal; neusgaten bleekgrijs; mondholte blauwachtig zwart',
                sub: [
                  {
                    conditie: 'Januari t/m mei',
                    resultaat: 'na 2e kj',
                    sub: [
                      { conditie: 'TF6 doorgaans 18–33 mm korter dan TF1 (optionele bevestiging)', info: true },
                    ],
                  },
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
            volgende: 'tf6_keuze_jong',
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

      tf6_keuze_jong: {
        id: 'tf6_keuze_jong',
        label: 'TF6 meten',
        type: 'keuze',
        vraag: 'Wil je de staartveer TF6 meten ter bevestiging?',
        toelichting: 'Meet de 6e staartveer (TF6) en de 1e staartveer (TF1 = langste). ' +
          'Bij 2e kj is TF6 doorgaans 11–23 mm korter dan TF1. Optioneel — overslaan geeft hetzelfde basisresultaat.',
        opties: [
          {
            waarde: 'meten',
            label: 'Ja, TF6 meten',
            volgende: 'tf6_meting_jong',
          },
          {
            waarde: 'overslaan',
            label: 'Overslaan',
            resultaat: {
              waarde: '5',
              label: '2e kj',
              zeker: false,
              uitleg: 'Bruinachtige slagpennen met veren op kin/wangen en bedekte neusgaten; periode januari–mei: 2e kalenderjaar. (TF6 niet gemeten)',
            },
          },
        ],
      },

      tf6_meting_jong: {
        id: 'tf6_meting_jong',
        label: 'TF6-meting',
        type: 'meting',
        vraag: 'Voer de staartveermetingen in',
        toelichting: 'Meet TF1 (langste staartveer) en TF6 (6e staartveer) op gelijke wijze. Verschil = TF1 − TF6.',
        inputs: [
          {
            key: 'tf1',
            label: 'TF1 — middelste staartveer (mm)',
            decimalen: 0,
            min: 100,
            max: 250,
            placeholder: 'bijv. 170',
            uit_formulier: 'tf1',
          },
          {
            key: 'tf6',
            label: 'TF6 — buitenste staartveer (mm)',
            decimalen: 0,
            min: 80,
            max: 230,
            placeholder: 'bijv. 157',
            uit_formulier: 'tf6',
          },
        ],
        bereken_type: 'tf6_verschil',
        bereken_config: {
          regels: [
            {
              max_excl: 11,
              resultaat: {
                waarde: null,
                fallback_waarde: 'U',
                label: 'TF6-meting buiten normaal bereik',
                zeker: false,
                uitleg_template: 'Verschil TF1 − TF6 = {diff} mm — valt buiten de gepubliceerde normen voor Roek (< 11 mm). Controleer de meting.',
              },
            },
            {
              min_incl: 11,
              max_excl: 24,
              resultaat: {
                waarde: '5',
                label: '2e kj (TF6 bevestigt)',
                zeker: false,
                uitleg_template: 'TF1 {tf1} mm − TF6 {tf6} mm = {diff} mm verschil. Valt in het bereik 11–23 mm voor 2e kj (Demongin 2020 p.349). Bevestigt 2e kalenderjaar.',
              },
            },
            {
              min_incl: 24,
              max_excl: 34,
              resultaat: {
                waarde: '5',
                label: '2e kj (TF6 grensgeval)',
                zeker: false,
                uitleg_template: 'TF1 {tf1} mm − TF6 {tf6} mm = {diff} mm verschil. Valt in het adult-bereik (≥ 24 mm). Overig veederij (bruine slagpennen, bedekte neusgaten) wijst op 2e kj — herbeoordeel neusgaten zorgvuldig.',
              },
            },
            {
              min_incl: 34,
              resultaat: {
                waarde: null,
                fallback_waarde: 'U',
                label: 'TF6-meting buiten normaal bereik',
                zeker: false,
                uitleg_template: 'Verschil TF1 − TF6 = {diff} mm — valt buiten de gepubliceerde normen voor Roek (> 33 mm). Controleer de meting.',
              },
            },
          ],
        },
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
            volgende: 'tf6_keuze_adult',
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

      tf6_keuze_adult: {
        id: 'tf6_keuze_adult',
        label: 'TF6 meten',
        type: 'keuze',
        vraag: 'Wil je de staartveer TF6 meten ter bevestiging?',
        toelichting: 'Meet de 6e staartveer (TF6) en de 1e staartveer (TF1 = langste). ' +
          'Bij adult is TF6 doorgaans 18–33 mm korter dan TF1. Optioneel — overslaan geeft hetzelfde basisresultaat.',
        opties: [
          {
            waarde: 'meten',
            label: 'Ja, TF6 meten',
            volgende: 'tf6_meting_adult',
          },
          {
            waarde: 'overslaan',
            label: 'Overslaan',
            resultaat: {
              waarde: '6',
              label: 'na 2e kj',
              zeker: false,
              uitleg: 'Zwarte slagpennen met sterke metaalglans; kin/wangen geheel kaal; periode januari–mei: na 2e kalenderjaar (3e kj of ouder). (TF6 niet gemeten)',
            },
          },
        ],
      },

      tf6_meting_adult: {
        id: 'tf6_meting_adult',
        label: 'TF6-meting',
        type: 'meting',
        vraag: 'Voer de staartveermetingen in',
        toelichting: 'Meet TF1 (langste staartveer) en TF6 (6e staartveer) op gelijke wijze. Verschil = TF1 − TF6.',
        inputs: [
          {
            key: 'tf1',
            label: 'TF1 — middelste staartveer (mm)',
            decimalen: 0,
            min: 100,
            max: 250,
            placeholder: 'bijv. 175',
            uit_formulier: 'tf1',
          },
          {
            key: 'tf6',
            label: 'TF6 — buitenste staartveer (mm)',
            decimalen: 0,
            min: 80,
            max: 230,
            placeholder: 'bijv. 150',
            uit_formulier: 'tf6',
          },
        ],
        bereken_type: 'tf6_verschil',
        bereken_config: {
          regels: [
            {
              max_excl: 11,
              resultaat: {
                waarde: null,
                fallback_waarde: 'U',
                label: 'TF6-meting buiten normaal bereik',
                zeker: false,
                uitleg_template: 'Verschil TF1 − TF6 = {diff} mm — valt buiten de gepubliceerde normen voor Roek (< 11 mm). Controleer de meting.',
              },
            },
            {
              min_incl: 11,
              max_excl: 18,
              resultaat: {
                waarde: '5',
                label: '2e kj (onverwacht — TF6 wijst op jonger)',
                zeker: false,
                uitleg_template: 'TF1 {tf1} mm − TF6 {tf6} mm = {diff} mm verschil. Valt in het bereik voor 2e kj (11–23 mm). Overig veederij (kale neusgaten, glanzende slagpennen) wijst op adult — herbeoordeel neusgaten en kin/wangen zorgvuldig.',
              },
            },
            {
              min_incl: 18,
              max_excl: 34,
              resultaat: {
                waarde: '6',
                label: 'na 2e kj (TF6 bevestigt)',
                zeker: false,
                uitleg_template: 'TF1 {tf1} mm − TF6 {tf6} mm = {diff} mm verschil. Valt in het adult-bereik 18–33 mm (Demongin 2020 p.349). Bevestigt na 2e kalenderjaar.',
              },
            },
            {
              min_incl: 34,
              resultaat: {
                waarde: null,
                fallback_waarde: 'U',
                label: 'TF6-meting buiten normaal bereik',
                zeker: false,
                uitleg_template: 'Verschil TF1 − TF6 = {diff} mm — valt buiten de gepubliceerde normen voor Roek (> 33 mm). Controleer de meting.',
              },
            },
          ],
        },
      },
    },
  },

  // ─── Kauw-leeftijd ──────────────────────────────────────────────────────────
  {
    id: 'kauw-leeftijd',
    soorten: ['15600'],
    resultaat_veld: 'leeftijd',
    naam: 'Leeftijdsbepaling Kauw',
    korte_beschrijving: 'Via iriskleur en vleugelvedering',
    bron: 'Demongin (2020) p.347–348',
    type: 'survey',
    start: 'iris_kleur',
    stappen: {

      iris_kleur: {
        id: 'iris_kleur',
        label: 'Iriskleur',
        type: 'keuze',
        vraag: 'Welke kleur heeft de iris?',
        toelichting: 'De iriskleur is de betrouwbaarste leeftijdsindicator voor de Kauw en verandert met de leeftijd.',
        opties: [
          {
            waarde: 'blauwgrijs',
            label: 'Blauwgrijs (helder, gelijkmatig blauwgrijs)',
            volgende: 'vleugelvedering',
          },
          {
            waarde: 'bruin',
            label: 'Egaal bruin (donkerbruin, niet gemengd)',
            resultaat: {
              waarde: '3',
              label: '1e kj (herfst/winter)',
              zeker: false,
              uitleg: 'Egaal bruine iris is kenmerkend voor 1e kj in herfst en winter, nadat de juveniele blauwgrijze iris is veranderd. Bevestig via vleugelvedering: juv armpennen en tertials dof bruinzwart.',
            },
          },
          {
            waarde: 'variabel',
            label: 'Gemengd of variabel (lichtbruin t/m grijswit, vuil wit)',
            resultaat: {
              waarde: '5',
              label: '2e kj (lente)',
              zeker: false,
              uitleg: 'Wisselende iriskleur — lichtbruin, grijsachtig of zelfs (vuil) wit — is typisch voor de 2e-kalenderjaar vogel in het voorjaar, tijdens de transitie naar het witte adultiris. TF zijn doorgaans zwaar versleten (vanaf maart).',
            },
          },
          {
            waarde: 'wit',
            label: 'Helder wit of zilvergrijs (egaal, niet gemengd)',
            resultaat: {
              waarde: '4',
              label: 'Adult (na 2e kj)',
              zeker: false,
              uitleg: 'Heldere witte of zilvergrijs iris is kenmerkend voor adulte Kauwen (3e kalenderjaar en ouder). In lente zijn TF breed en vers, met groene of blauwe glans.',
            },
          },
        ],
      },

      vleugelvedering: {
        id: 'vleugelvedering',
        label: 'Vleugelvedering',
        type: 'keuze',
        vraag: 'Hoe zijn de armpennen en tertials vergeleken met de dekveren?',
        toelichting: 'Vergelijk kleur en glans van de armpennen en tertials met de kleine en middelste vleugeldekveren.',
        opties: [
          {
            waarde: 'contrast',
            label: 'Armpennen en tertials dof bruinzwart — contrasterend met gevormde kleine/middelste vleugeldekveren',
            resultaat: {
              waarde: '3',
              label: '1e kj (zomer)',
              zeker: true,
              uitleg: 'Blauwgrijze iris in combinatie met bruinzwarte, niet-glanzende armpennen en tertials bevestigt een juveniele vogel in het eerste kalenderjaar (zomer na uitvliegen).',
            },
          },
          {
            waarde: 'geen_contrast',
            label: 'Weinig of geen contrast — armpennen en tertials uniform glanzend',
            resultaat: {
              waarde: null,
              fallback_waarde: 'U',
              label: 'Niet eenduidig te bepalen',
              zeker: false,
              uitleg: 'Blauwgrijze iris met weinig vleugelcontrast is ongebruikelijk. Mogelijk gaat het om een vroeg 2e kj dat nog niet volledig van iris is gewisseld, of er is een fout in de iriskleurschatting. Overweeg opnieuw te beoordelen.',
            },
          },
        ],
      },

    },
  },

  // ─── Kauw-geslacht ──────────────────────────────────────────────────────────
  {
    id: 'kauw-geslacht',
    soorten: ['15600'],
    resultaat_veld: 'geslacht',
    naam: 'Geslachtsbepaling Kauw',
    korte_beschrijving: 'Via broedvlek (basisindicator); metingen populatieafhankelijk',
    bron: 'Demongin (2020) p.347–348',
    type: 'survey',
    start: 'broedvlek',
    stappen: {

      broedvlek: {
        id: 'broedvlek',
        label: 'Broedvlek',
        type: 'keuze',
        vraag: 'Is er een broedvlek aanwezig?',
        toelichting: 'Alleen ♀ vertoont een duidelijke broedvlek. Let op: ♂ kan een kleine broedvlek beperkt tot de buik hebben, minder gevasculariseerd — voel het verschil in textuur.',
        uit_formulier: {
          veld: 'broedvlek',
          transform_type: 'boolean_naar_ja_nee',
        },
        opties: [
          {
            waarde: 'duidelijk',
            label: 'Ja, duidelijk aanwezig (ook op borst of flanken)',
            resultaat: {
              waarde: 'F',
              label: '♀ Vrouw',
              zeker: true,
              uitleg: 'Een duidelijke broedvlek is een zekere ♀-indicator.',
            },
          },
          {
            waarde: 'klein',
            label: 'Klein, beperkt tot buik, minder gevasculariseerd',
            volgende: 'cp_na_klein_bp',
          },
          {
            waarde: 'nee',
            label: 'Afwezig of niet vastgesteld',
            volgende: 'cp_check',
          },
        ],
      },

      cp_na_klein_bp: {
        id: 'cp_na_klein_bp',
        label: 'CP (na kleine BP)',
        type: 'keuze',
        vraag: 'Is er een uitstekende cloaca aanwezig?',
        toelichting: 'Een kleine broedvlek beperkt tot de buik kan bij ♂ voorkomen. Uitstekende cloaca helpt het geslacht te bevestigen, maar kan soms moeilijk te beoordelen zijn.',
        opties: [
          {
            waarde: 'ja',
            label: 'Ja, uitstekende cloaca aanwezig',
            resultaat: {
              waarde: 'M',
              label: '♂ Man',
              zeker: false,
              uitleg: 'Kleine broedvlek + CP wijst op ♂. Een kleine buikbroedvlek met minder vascularisatie en CP is een ♂-indicator. Let op: cloaca kan soms moeilijk te beoordelen zijn.',
            },
          },
          {
            waarde: 'nee',
            label: 'Nee / niet te beoordelen',
            resultaat: {
              waarde: null,
              fallback_waarde: 'U',
              label: 'Onzeker',
              zeker: false,
              uitleg: 'Een kleine buikbroedvlek zonder bevestiging via uitstekende cloaca geeft geen uitsluitsel. Metingen kunnen helpen als de populatie (ondersoort) bekend is — zie de geslachtsnotities.',
            },
          },
        ],
      },

      cp_check: {
        id: 'cp_check',
        label: 'CP (geen broedvlek)',
        type: 'keuze',
        vraag: 'Is er een uitstekende cloaca aanwezig?',
        toelichting: 'Zonder broedvlek is uitstekende cloaca het enige veldkenmerk voor ♂. Dit kan soms lastig te beoordelen zijn (Demongin).',
        opties: [
          {
            waarde: 'ja',
            label: 'Ja, uitstekende cloaca aanwezig',
            resultaat: {
              waarde: 'M',
              label: '♂ Man',
              zeker: false,
              uitleg: 'Afwezigheid van broedvlek + aanwezigheid van uitstekende cloaca wijst op ♂. Let op: cloaca kan soms moeilijk te beoordelen zijn.',
            },
          },
          {
            waarde: 'nee',
            label: 'Nee / niet te beoordelen',
            resultaat: {
              waarde: null,
              fallback_waarde: 'U',
              label: 'Niet te bepalen',
              zeker: false,
              uitleg: 'Zonder broedvlek of uitstekende cloaca is het geslacht niet betrouwbaar vast te stellen in het veld. Metingen kunnen bijdragen als de populatie (ondersoort) bekend is — zie de geslachtsnotities.',
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
