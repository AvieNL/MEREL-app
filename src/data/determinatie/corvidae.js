/**
 * Determinatiehulpen voor Corvidae (kraaivogels)
 * EURING-codes: Roek = 15630 (Corvus frugilegus)
 *               Kauw = 15600 (Corvus monedula)
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

  // ─────────────────────────────────────────────────────────────────────────
  // Kauw (EURING 15600 — Corvus monedula)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'kauw-leeftijd',
    soorten: ['15600'],           // Corvus monedula (Kauw)
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

  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'kauw-geslacht',
    soorten: ['15600'],           // Corvus monedula (Kauw)
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
          // Only auto-resolve 'nee' — cannot distinguish 'duidelijk' from 'klein' from the raw form value
          transform: v => (!v || v === '0' || v === '') ? 'nee' : null,
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
        label: 'Cloaca (na kleine BP)',
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
              uitleg: 'Kleine broedvlek + uitstekende cloaca wijst op ♂. Een kleine buikbroedvlek met minder vascularisatie en uitstekende cloaca is een ♂-indicator. Let op: cloaca kan soms moeilijk te beoordelen zijn.',
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
        label: 'Cloaca (geen broedvlek)',
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

  // ─────────────────────────────────────────────────────────────────────────
  // Ekster — Leeftijdsbepaling
  // ─────────────────────────────────────────────────────────────────────────
  {
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
        uit_formulier: 'vangstdatum',
        transform: datumNaarPeriode,
        opties: [
          { waarde: 'jun_dec', label: 'Zomer / najaar (jun–dec)', volgende: 'iris_kleur_nj' },
          { waarde: 'jan_mei', label: 'Voorjaar (jan–mei)',       volgende: 'vliegveren_toestand_vj' },
        ],
      },

      // ── Najaar-pad ──────────────────────────────────────────────────────

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

      // ── Voorjaar-pad ────────────────────────────────────────────────────

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
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Ekster — Geslachtsbepaling
  // ─────────────────────────────────────────────────────────────────────────
  {
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
  },

];
