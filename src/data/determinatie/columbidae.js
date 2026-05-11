/**
 * Determinatiehulpen voor Columbidae (duiven)
 * EURING-codes: Houtduif   = 06700 (Columba palumbus)
 *               Holenduif  = 06680 (Columba oenas)
 */

export const columbidae = [

  // ─────────────────────────────────────────────────────────────────────────
  // Houtduif — Leeftijdsbepaling
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'houtduif-leeftijd',
    soorten: ['06700'],
    resultaat_veld: 'leeftijd',
    naam: 'Leeftijdsbepaling Houtduif',
    korte_beschrijving: 'Via handpendekveren en ruicentra in de handpennen',
    bron: 'Demongin (2020) p.182–183',
    type: 'survey',
    start: 'pc_rand',
    overzicht: [
      { conditie: 'Buffrand op buitenste handpendekveren', resultaat: '1e kj', zeker: false },
      {
        conditie: 'Geen buffrand (egaal donker leigrijs)',
        sub: [
          { conditie: 'Twee ruicentra in P (beide vleugels)', resultaat: '2e kj (deel herkenbaar)' },
          { conditie: 'Één ruicentrum of geen rui', resultaat: 'Adult — of voltooide 2e kj (niet te onderscheiden)' },
        ],
      },
    ],
    stappen: {

      pc_rand: {
        id: 'pc_rand',
        label: 'Handpendekveren',
        type: 'keuze',
        vraag: 'Hoe zijn de buitenste handpendekveren?',
        toelichting: 'Kijk naar de kleur van de buitenste handpendekveren (PC). Een buff- of bruine rand wijst op een 1e-kalenderjaar vogel.',
        opties: [
          {
            waarde: 'buff',
            label: 'Buffachtige of bruine rand op de buitenste PC',
            resultaat: {
              waarde: '3',
              label: '1e kj',
              zeker: false,
              uitleg: 'Een buff- of bruine rand op de buitenste handpendekveren is kenmerkend voor 1e kj. Let op: vroege vogels kunnen hun postrui al bijna hebben voltooid — controleer zo nodig het ruipatroon in de P.',
            },
          },
          {
            waarde: 'donker',
            label: 'Egaal donker leigrijs — geen buffrand',
            volgende: 'ruicentra',
          },
        ],
      },

      ruicentra: {
        id: 'ruicentra',
        label: 'Ruicentra in P',
        type: 'keuze',
        vraag: 'Hoeveel ruicentra zijn zichtbaar in de handpennen?',
        toelichting: 'Controleer beide vleugels. Twee ruicentra = twee aparte zones van verse of actieve pennen. Controleer ook: is P2 nog juveniel (bruinachtig, versleten)? En/of zit er een buffpunt op de buitenste kleine dekveren bij de vleugelboeg?',
        opties: [
          {
            waarde: 'twee',
            label: 'Twee ruicentra (zichtbaar in beide vleugels)',
            resultaat: {
              waarde: '5',
              label: '2e kj',
              zeker: false,
              uitleg: 'Twee ruicentra zijn een betrouwbare indicator voor 2e kj. Let op: alleen een kleine fractie van de 2kj-vogels is zo te herkennen — de meeste zijn al niet meer te onderscheiden van adulten.',
            },
          },
          {
            waarde: 'een',
            label: 'Één ruicentrum, of geen actieve rui zichtbaar',
            resultaat: {
              waarde: '4',
              label: 'Adult (of voltooide 2e kj)',
              zeker: false,
              uitleg: 'Donkere leigrijze handpendekveren zonder buffrand en één ruicentrum wijzen op adult. Een 2e kj dat de postrui heeft afgerond (v.a. de zomer van het 2e kj) is niet meer te onderscheiden van een adult.',
            },
          },
        ],
      },

    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Houtduif — Geslachtsbepaling
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'houtduif-geslacht',
    soorten: ['06700'],
    resultaat_veld: 'geslacht',
    naam: 'Geslachtsbepaling Houtduif',
    korte_beschrijving: 'Via kopbreedte achter de ogen — beperkt betrouwbaar, overlap aanwezig',
    bron: 'Demongin (2020) p.182',
    type: 'survey',
    start: 'kopbreedte',
    stappen: {

      kopbreedte: {
        id: 'kopbreedte',
        label: 'Kopbreedte',
        type: 'meting',
        vraag: 'Meet de kopbreedte direct achter de ogen (mm)',
        toelichting: 'Meet de breedte van de kop direct achter de ogen. Let op: er is overlap in de maten (♂ M 22,0–23,8 mm; ♀ V 20,3–23,2 mm). De meting is het meest betrouwbaar bij direct vergelijk van een broedpaar. Bevestig ook via onderbuikkleur: ♂ M sterker roséachtig (vineus), ♀ V roséachtig met grijze tint.',
        inputs: [
          {
            key: 'kopbreedte',
            label: 'Kopbreedte (mm)',
            decimalen: 1,
            min: 18,
            max: 27,
            placeholder: 'bijv. 22.5',
          },
        ],
        bereken: ({ kopbreedte }) => {
          const k = parseFloat(String(kopbreedte).replace(',', '.'));
          if (isNaN(k) || k <= 0) return null;
          if (k >= 22) {
            return {
              waarde: 'M',
              label: '♂ Mogelijk man',
              zeker: false,
              uitleg: `Kopbreedte ${k} mm (≥ 22 mm) wijst op ♂ M. Let op: overlap met ♀ V (20,3–23,2 mm). Betrouwbaarder in direct vergelijk met partner.`,
            };
          }
          return {
            waarde: 'F',
            label: '♀ Mogelijk vrouw',
            zeker: false,
            uitleg: `Kopbreedte ${k} mm (< 22 mm) wijst op ♀ V. Let op: overlap met ♂ M ((21) 22,0–23,8 mm). Betrouwbaarder in direct vergelijk met partner.`,
          };
        },
      },

    },
  },

];

// ─────────────────────────────────────────────────────────────────────────────
// Holenduif — Leeftijdsbepaling
// ─────────────────────────────────────────────────────────────────────────────

function datumNaarPeriode(datumStr) {
  if (!datumStr) return null;
  const maand = new Date(datumStr).getMonth() + 1;
  return maand >= 1 && maand <= 5 ? 'jan_mei' : 'jun_dec';
}

columbidae.push({
  id: 'holenduif-leeftijd',
  soorten: ['06680'],
  resultaat_veld: 'leeftijd',
  naam: 'Leeftijdsbepaling Holenduif',
  korte_beschrijving: 'MC/LC/T kleur + buitenste PC kleur',
  bron: 'Demongin (2016) p.182',
  type: 'survey',
  start: 'seizoen',
  overzicht: [
    { conditie: 'MC/LC/T mat lichtbruin, geen irisatie op nek; buitenste PC lichtbruin', resultaat: '1e kj (3)' },
    { conditie: 'MC/LC/T egaal asgrijs; buitenste PC donker grijszwart', resultaat: 'na 1e kj (4)' },
    { conditie: 'VJ: aangehouden juv S/CC/TF + lichtbruine buitenste PC', resultaat: '2e kj (5)' },
  ],
  stappen: {

    seizoen: {
      id: 'seizoen',
      label: 'Seizoen',
      type: 'keuze',
      uit_formulier: 'vangstdatum',
      transform: datumNaarPeriode,
      vraag: 'In welk seizoen is de vogel gevangen?',
      toelichting: 'Het seizoen bepaalt welke EURING-codes van toepassing zijn. Let op: de postjuv-rui is sterk variabel — vroege 1e kj-vogels kunnen de rui al volledig hebben afgerond en zijn dan niet meer te ouderdomsbepalen.',
      opties: [
        { waarde: 'jun_dec', label: 'Najaar (jun–dec)', volgende: 'veer_kleur_nj' },
        { waarde: 'jan_mei', label: 'Voorjaar (jan–mei)', volgende: 'gesuspendeerde_rui' },
      ],
    },

    // ── Najaar-pad ────────────────────────────────────────────────────────

    veer_kleur_nj: {
      id: 'veer_kleur_nj',
      label: 'Kleur MC/LC/T (najaar)',
      type: 'keuze',
      vraag: 'Hoe zien MC, LC en T eruit? Is er irisatie op nek of achterhoofd?',
      toelichting: 'Bij 1e kj zijn MC, LC en T mat lichtbruin. Naarmate de postjuv-rui vordert, worden er asgrijs adult-veren zichtbaar. Adult heeft egaal asgrijs MC/LC. Let op: adults die laat ruien kunnen sterk versleten, bruinachtig verkleurde veren hebben — beoordeel ook de buitenste PC.',
      opties: [
        {
          waarde: 'lichtbruin',
          label: 'MC/LC/T mat lichtbruin (volledig of mix met asgrijs ad-veren); geen of zwakke irisatie op nek',
          volgende: 'pc_kleur_nj',
        },
        {
          waarde: 'asgrijs',
          label: 'MC/LC/T egaal asgrijs; irisatie op nek aanwezig',
          resultaat: {
            waarde: '4',
            label: 'na 1e kj',
            zeker: false,
            uitleg: 'Egaal asgrijs MC/LC en T met irisatie op nek duiden op na 1e kj (4). Buitenste PC donker grijszwart. Soms 2 generaties S zichtbaar. Let op: adults die laat ruien kunnen tijdelijk sterk versleten, bruinachtige veren hebben.',
          },
        },
        {
          waarde: 'onzeker',
          label: 'Niet te beoordelen (bv. sterk versleten of rui bijna compleet)',
          resultaat: {
            waarde: null,
            fallback_waarde: 'U',
            label: 'Niet te bepalen',
            zeker: false,
            uitleg: 'Leeftijdsbepaling niet mogelijk. Als de postjuv-rui volledig voltooid is, is 1e kj niet meer te onderscheiden van adult.',
          },
        },
      ],
    },

    pc_kleur_nj: {
      id: 'pc_kleur_nj',
      label: 'Buitenste PC kleur (najaar)',
      type: 'keuze',
      vraag: 'Hoe is de kleur van de buitenste handpendekveren (PC)?',
      toelichting: 'Bij 1e kj zijn de buitenste juv PC lichtbruin. P kan soms volledig in jeugdveer zijn tot feb of later. Let op: verwar niet met adult die laat ruien — check ook MC/LC/T en aanwezigheid van irisatie.',
      opties: [
        {
          waarde: 'lichtbruin',
          label: 'Lichtbruin — juveniele kleur',
          resultaat: {
            waarde: '3',
            label: '1e kj',
            zeker: false,
            uitleg: 'Lichtbruine buitenste PC, mat lichtbruine MC/LC/T en geen of zwakke irisatie duiden op 1e kj (3). P kan soms volledig in jeugdveer zijn tot feb of later.',
          },
        },
        {
          waarde: 'grijszwart',
          label: 'Donker grijszwart',
          resultaat: {
            waarde: '4',
            label: 'na 1e kj',
            zeker: false,
            uitleg: 'Donker grijszwarte buitenste PC duiden op na 1e kj (4), ook als MC/LC/T nog gedeeltelijk bruin zijn door late rui. Soms 2 generaties S zichtbaar.',
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
            uitleg: 'Leeftijdsbepaling niet mogelijk. Als de postjuv-rui volledig voltooid is, is 1e kj niet meer te onderscheiden van adult.',
          },
        },
      ],
    },

    // ── Voorjaar-pad ──────────────────────────────────────────────────────

    gesuspendeerde_rui: {
      id: 'gesuspendeerde_rui',
      label: 'Gesuspendeerde rui (voorjaar)',
      type: 'keuze',
      vraag: 'Zijn er nog aangehouden versleten juveniele S, CC of TF zichtbaar? En hoe zijn de buitenste PC?',
      toelichting: 'In het voorjaar zijn alleen vogels met een gesuspendeerde of afgebroken postjuv-rui te ouderdomsbepalen. Vogels waarbij de rui volledig voltooid is, zijn niet meer van adult te onderscheiden.',
      opties: [
        {
          waarde: 'ja',
          label: 'Ja — versleten bruinachtige juv S, CC of TF aangehouden; buitenste PC lichtbruin',
          resultaat: {
            waarde: '5',
            label: '2e kj',
            zeker: false,
            uitleg: 'Aangehouden versleten juv S, CC of TF en lichtbruine buitenste PC duiden in het voorjaar op 2e kj (5) (= vorig najaar: 1e kj (3)).',
          },
        },
        {
          waarde: 'nee',
          label: 'Nee — buitenste PC grijszwart, geen aangehouden juv veren',
          resultaat: {
            waarde: null,
            fallback_waarde: 'U',
            label: 'Niet te bepalen',
            zeker: false,
            uitleg: 'Als de postjuv-rui volledig voltooid is, zijn 2e kj (5) en na 2e kj (6) in het voorjaar niet te onderscheiden. Buitenste PC is dan bij beiden grijszwart.',
          },
        },
      ],
    },

  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Holenduif — Geslachtsbepaling
// ─────────────────────────────────────────────────────────────────────────────

columbidae.push({
  id: 'holenduif-geslacht',
  soorten: ['06680'],
  resultaat_veld: 'geslacht',
  naam: 'Geslachtsbepaling Holenduif',
  korte_beschrijving: 'T en scapulars kleur — alleen bij adult met fris verenkleed',
  bron: 'Demongin (2016) p.182',
  type: 'survey',
  start: 'adult_check',
  overzicht: [
    { conditie: 'T en scapulars blauwgrijs', resultaat: '♂ M (waarschijnlijk)' },
    { conditie: 'T en scapulars bruingrijs', resultaat: '♀ V (waarschijnlijk)' },
  ],
  stappen: {

    adult_check: {
      id: 'adult_check',
      label: 'Adult met fris verenkleed?',
      type: 'keuze',
      vraag: 'Is het een adult en zijn de veren niet sterk versleten?',
      toelichting: 'Geslachtsbepaling bij Holenduif is alleen mogelijk bij adults. Bij 1e kj (3) en bij sterk versleten verenkleed is geslacht niet te bepalen.',
      opties: [
        {
          waarde: 'ja',
          label: 'Adult — verenkleed niet sterk versleten',
          volgende: 'scapulars_t',
        },
        {
          waarde: 'nee',
          label: 'Juveniel of sterk versleten verenkleed',
          resultaat: {
            waarde: null,
            fallback_waarde: 'U',
            label: 'Niet te bepalen',
            zeker: false,
            uitleg: 'Geslachtsbepaling is alleen mogelijk bij adults met fris verenkleed. Bij 1e kj (3) of bij sterk versleten veren is het kenmerk (T en scapulars kleur) niet betrouwbaar.',
          },
        },
      ],
    },

    scapulars_t: {
      id: 'scapulars_t',
      label: 'Kleur T en scapulars',
      type: 'keuze',
      vraag: 'Hoe zijn de T (tertialen) en scapulars van kleur?',
      toelichting: 'Kijk bij fris verenkleed naar de kleur van de tertialen en scapulars. Bij ♂ M zijn deze blauwgrijs, bij ♀ V bruingrijs.',
      opties: [
        {
          waarde: 'blauwgrijs',
          label: 'Blauwgrijs',
          resultaat: {
            waarde: 'M',
            label: '♂ M (waarschijnlijk)',
            zeker: false,
            uitleg: 'Blauwgrijze T en scapulars duiden op ♂ M.',
          },
        },
        {
          waarde: 'bruingrijs',
          label: 'Bruingrijs',
          resultaat: {
            waarde: 'F',
            label: '♀ V (waarschijnlijk)',
            zeker: false,
            uitleg: 'Bruingrijze T en scapulars duiden op ♀ V.',
          },
        },
        {
          waarde: 'onzeker',
          label: 'Niet duidelijk te plaatsen',
          resultaat: {
            waarde: null,
            fallback_waarde: 'U',
            label: 'Niet te bepalen',
            zeker: false,
            uitleg: 'Geslacht niet te bepalen op basis van T en scapulars kleur alleen.',
          },
        },
      ],
    },

  },
});
