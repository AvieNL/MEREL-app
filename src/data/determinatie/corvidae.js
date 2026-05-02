/**
 * Determinatiehulpen voor Corvidae (kraaivogels)
 * EURING-codes: Roek = 15630 (Corvus frugilegus)
 */

// Grenswaarde vleugel bij gegeven snavellengte tot schedel
// Op basis van twee ijkpunten: (snavel=70, vleugel=282.5) en (snavel=50, vleugel=330)
// Lineaire formule: vleugel_grens = -2.375 * snavel + 448.75
function roekGrens(snavel) {
  return -2.375 * snavel + 448.75;
}

// Zet datum (YYYY-MM-DD of Date) om naar periode 'jan_mei' of 'jun_dec'
function datumNaarPeriode(v) {
  if (!v) return null;
  const m = new Date(v).getMonth() + 1; // 1–12
  if (isNaN(m)) return null;
  return m >= 1 && m <= 5 ? 'jan_mei' : 'jun_dec';
}

export const corvidae = [
  {
    id: 'roek-geslacht',
    soorten: ['15630'],           // Corvus frugilegus (Roek)
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
        verwijzing: {
          aid_id: 'roek-leeftijd',
          label: 'Leeftijd nog niet bepaald?',
          knop_label: 'Bepaal leeftijd eerst',
        },
        uit_formulier: {
          veld: 'leeftijd',
          transform: v => {
            if (!v || v === '' || v === '0') return null;
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
            fallback_waarde: 'U',
            label: 'Exact op de grens — niet te bepalen',
            zeker: false,
            uitleg: `Vleugel ${v} mm valt exact op de grenswaarde bij snavellengte ${s} mm.`,
          };
        },
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'roek-leeftijd',
    soorten: ['15630'],           // Corvus frugilegus (Roek)
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
            conditie: 'Slagpennen zwartachtig bruin, enkele sporen metaalglans, contrasterend met kleine en middelste vleugeldekveren; veren op kin en wangen; neusgaten bedekt',
            sub: [
              { conditie: 'Januari t/m mei', resultaat: '2e kj', type: 'periode' },
              { conditie: 'Juni t/m december', resultaat: '1e kj', type: 'periode' },
            ],
          },
          { conditie: 'Kin en wangen kaal, neusgaten nog bedekt', resultaat: '2e kj (jan–jun)' },
          {
            conditie: 'Slagpennen zwart met sterk metaalachtige purpergroene glans, overeenkomend met vleugeldekveren',
            sub: [
              {
                conditie: 'Sporen van haren, dons of afgebroken pennen op kin, wangen of neusgaten',
                sub: [
                  { conditie: 'Januari t/m mei', resultaat: '3e kj', type: 'periode' },
                  { conditie: 'Juni t/m december', resultaat: '2e kj', type: 'periode' },
                ],
              },
              {
                conditie: 'Kin, wangen en neusgaten geheel kaal',
                sub: [
                  { conditie: 'Januari t/m mei', resultaat: 'na 2e kj', type: 'periode' },
                  { conditie: 'Juni t/m december', resultaat: 'na 1e kj', type: 'periode' },
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
        toelichting: 'Vergelijk kleur en glans van slagpennen met de kleine en middelste vleugeldekveren. Let ook op de vedering van kin, wangen en neusgaten.',
        opties: [
          {
            waarde: 'bruin',
            label: 'Zwartachtig bruin, slechts enkele sporen metaalglans — contrasterend met kleine en middelste vleugeldekveren; veren op kin en wangen; neusgaten bedekt met veren',
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
          {
            waarde: 'zwart_metaalglans',
            label: 'Zwart met sterk metaalachtige purpergroene glans — overeenkomend met de vleugeldekveren',
            volgende: 'kin_sporen',
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
          transform: datumNaarPeriode,
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
          transform: datumNaarPeriode,
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
          transform: datumNaarPeriode,
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
