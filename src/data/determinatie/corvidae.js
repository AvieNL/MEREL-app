/**
 * Determinatiehulpen voor Corvidae (kraaivogels)
 * EURING-codes: Roek = 15820 (Corvus frugilegus)
 */

// Grenswaarde vleugel bij gegeven snavellengte tot schedel
// Op basis van twee ijkpunten: (snavel=70, vleugel=282.5) en (snavel=50, vleugel=330)
// Lineaire formule: vleugel_grens = -2.375 * snavel + 448.75
function roekGrens(snavel) {
  return -2.375 * snavel + 448.75;
}

export const corvidae = [
  {
    id: 'roek-geslacht',
    soorten: ['15820'],           // Corvus frugilegus (Roek)
    resultaat_veld: 'geslacht',
    naam: 'Geslachtsbepaling Roek',
    korte_beschrijving: 'Via broedvlek en vleugel/snavelverhouding (alleen adult)',
    bron: 'Svensson (1992)',
    type: 'survey',
    start: 'broedvlek',
    stappen: {

      broedvlek: {
        id: 'broedvlek',
        label: 'Broedvlek',
        type: 'keuze',
        vraag: 'Is er een broedvlek aanwezig?',
        toelichting: 'Een broedvlek is altijd een teken van een vrouw.',
        // Auto-resolve vanuit formulier: broedvlek !== '0' en niet leeg = aanwezig
        uit_formulier: {
          veld: 'broedvlek',
          transform: v => (v && v !== '0' && v !== '') ? 'ja' : 'nee',
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
        // Auto-resolve vanuit formulier
        uit_formulier: {
          veld: 'leeftijd',
          transform: v => {
            if (!v || v === '' || v === '0') return null; // onbekend → toon stap
            if (v === '1' || v === '3') return 'juveniel';
            return 'adult';
          },
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
        bereken: ({ vleugel, snavel_schedel }) => {
          const v = parseFloat(String(vleugel).replace(',', '.'));
          const s = parseFloat(String(snavel_schedel).replace(',', '.'));
          if (isNaN(v) || isNaN(s) || v <= 0 || s <= 0) return null;
          const grens = roekGrens(s);
          if (v > grens) {
            return {
              waarde: 'M',
              label: '♂ Mogelijk man',
              zeker: false,
              uitleg: `Vleugel ${v} mm ligt boven de grenswaarde van ${grens.toFixed(1)} mm bij snavellengte ${s} mm.`,
            };
          }
          if (v < grens) {
            return {
              waarde: 'F',
              label: '♀ Mogelijk vrouw',
              zeker: false,
              uitleg: `Vleugel ${v} mm ligt onder de grenswaarde van ${grens.toFixed(1)} mm bij snavellengte ${s} mm.`,
            };
          }
          return {
            waarde: null,
            label: 'Exact op de grens — niet te bepalen',
            zeker: false,
            uitleg: `Vleugel ${v} mm valt exact op de grenswaarde bij snavellengte ${s} mm.`,
          };
        },
      },
    },
  },
];
