/**
 * Determinatiehulpen voor Sylviidae (zangers)
 * EURING-codes: Zwartkop = 12770
 * Bron: Demongin (2020) p.302–303
 */

// ISO-datum → 'jan_mei' | 'jun_dec'
function datumNaarPeriode(v) {
  if (!v) return null;
  const m = new Date(v).getMonth() + 1;
  if (isNaN(m)) return null;
  return m >= 1 && m <= 5 ? 'jan_mei' : 'jun_dec';
}

export const sylviidae = [

  // ─────────────────────────────────────────────────────────────────────────
  // Zwartkop — Leeftijdsbepaling
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'zwartkop-leeftijd',
    soorten: ['12770'],
    resultaat_veld: 'leeftijd',
    naam: 'Leeftijdsbepaling Zwartkop',
    korte_beschrijving: 'Herfst: GC-contrast (verruide vs. juveniele dekveren) + iris; Voorjaar: TF-slijtage (♂ M)',
    bron: 'Demongin (2020) p.302–303',
    type: 'survey',
    start: 'seizoen',
    overzicht: [
      {
        conditie: 'Herfst (jun–dec)',
        sub: [
          { conditie: 'Contrast binnenste GC (groengrijs) vs. buitenste GC (bruin)', resultaat: '1e kj (3)' },
          { conditie: 'Iris grijsbruin/donkerbruin (bij twijfel over GC)', resultaat: '1e kj (3)' },
          { conditie: 'Geen contrast in GC; iris roodbruin', resultaat: 'na 1e kj (4)' },
        ],
      },
      {
        conditie: 'Voorjaar (jan–mei)',
        sub: [
          { conditie: '♂ M + TF versleten en puntig, soms bruin op voorhoofd', resultaat: '2e kj (5)' },
          { conditie: '♂ M + TF fris en afgerond', resultaat: 'na 2e kj (6)' },
          { conditie: '♀ V of geslacht onbekend', resultaat: 'Niet te bepalen' },
        ],
      },
    ],
    stappen: {

      seizoen: {
        id: 'seizoen',
        label: 'Seizoen',
        type: 'keuze',
        vraag: 'In welk seizoen is de vogel gevangen?',
        uit_formulier: 'vangstdatum',
        transform: datumNaarPeriode,
        opties: [
          { waarde: 'jun_dec', label: 'Zomer/herfst (jun–dec)', volgende: 'gc_contrast_nj' },
          { waarde: 'jan_mei', label: 'Winter/voorjaar (jan–mei)', volgende: 'geslacht_vj' },
        ],
      },

      gc_contrast_nj: {
        id: 'gc_contrast_nj',
        label: 'GC-contrast',
        type: 'keuze',
        vraag: 'Is er contrast tussen de binnenste (verruide) en buitenste (juveniele) grote vleugeldekveren (GC)?',
        opties: [
          {
            waarde: 'ja',
            label: 'Ja — binnenste GC met groenachtig-grijze rand, buitenste GC bruinachtig',
            resultaat: {
              waarde: '3', label: '1e kj (3)', zeker: false,
              uitleg: 'Ruigrens binnen GC is een betrouwbaar kenmerk voor 1e kj. Hetzelfde contrast kan ook zichtbaar zijn binnen de tertialen, tussen tertialen en armpennen, of tussen verruide alula 1 en de rest van de alula.',
            },
          },
          {
            waarde: 'nee',
            label: 'Nee — geen contrast, alle GC gelijkmatig groenachtig-grijs',
            resultaat: {
              waarde: '4', label: 'na 1e kj (4)', zeker: false,
              uitleg: 'Geen contrast in GC, PC, CC of alula wijst op een adult. Controleer ook de iris: roodbruin is typisch voor adulten.',
            },
          },
          {
            waarde: 'onzeker',
            label: 'Niet duidelijk te beoordelen',
            volgende: 'iris_kleur_nj',
          },
        ],
      },

      iris_kleur_nj: {
        id: 'iris_kleur_nj',
        label: 'Iris kleur',
        type: 'keuze',
        vraag: 'Kleur van de iris?',
        opties: [
          {
            waarde: 'grijs',
            label: 'Grijsbruin of donkerbruin',
            resultaat: {
              waarde: '3', label: '1e kj (3)', zeker: false,
              uitleg: 'Grijsbruine of donkerbruine iris is kenmerkend voor 1e kj tot begin oktober. Betrouwbaarheid neemt af na oktober.',
            },
          },
          {
            waarde: 'rood',
            label: 'Roodbruin (met duidelijke rode tint)',
            resultaat: {
              waarde: '4', label: 'na 1e kj (4)', zeker: false,
              uitleg: 'Roodbruine iris is typisch voor adulten. Zelden heeft een adult geen rode tint.',
            },
          },
          {
            waarde: 'onzeker',
            label: 'Niet te beoordelen',
            resultaat: {
              waarde: null, fallback_waarde: 'U', label: 'Niet te bepalen', zeker: false,
              uitleg: 'GC-contrast en iriskleur zijn beide niet duidelijk. Leeftijdsbepaling is niet mogelijk.',
            },
          },
        ],
      },

      geslacht_vj: {
        id: 'geslacht_vj',
        label: 'Geslacht (voorjaar)',
        type: 'keuze',
        vraag: 'Geslacht van de vogel?',
        opties: [
          {
            waarde: 'M',
            label: '♂ M (petje zwart)',
            volgende: 'tf_slijtage_vj',
          },
          {
            waarde: 'F',
            label: '♀ V of onzeker',
            resultaat: {
              waarde: null, fallback_waarde: 'U', label: 'Niet te bepalen', zeker: false,
              uitleg: 'Leeftijdsbepaling van ♀ V in het voorjaar is niet betrouwbaar. Dezelfde vleugelcontrastkriteria als in de herfst kunnen soms nog worden gebruikt.',
            },
          },
        ],
      },

      tf_slijtage_vj: {
        id: 'tf_slijtage_vj',
        label: 'TF-toestand (voorjaar ♂ M)',
        type: 'keuze',
        vraag: 'Toestand van de stuurpennen (TF) bij ♂ M in het voorjaar?',
        opties: [
          {
            waarde: 'versleten',
            label: 'TF meer versleten en puntig dan bij adulten; soms bruin op het voorhoofd',
            resultaat: {
              waarde: '5', label: '2e kj (5)', zeker: false,
              uitleg: '2e kj ♂ M (EURING 5 M): versleten en puntige TF, soms bruine veren op het voorhoofd.',
            },
          },
          {
            waarde: 'fris',
            label: 'TF fris en afgerond',
            resultaat: {
              waarde: '6', label: 'na 2e kj (6)', zeker: false,
              uitleg: 'Frisse, afgeronde TF bij ♂ M in het voorjaar wijst op adult.',
            },
          },
          {
            waarde: 'onzeker',
            label: 'Niet duidelijk te beoordelen',
            resultaat: {
              waarde: null, fallback_waarde: 'U', label: 'Niet te bepalen', zeker: false,
              uitleg: 'TF-slijtage niet duidelijk — grote overlap tussen leeftijdsklassen.',
            },
          },
        ],
      },

    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Zwartkop — Geslachtsbepaling
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'zwartkop-geslacht',
    soorten: ['12770'],
    resultaat_veld: 'geslacht',
    naam: 'Geslachtsbepaling Zwartkop',
    korte_beschrijving: 'Petje zwart = ♂ M · petje bruin = ♀ V (geslachtsbepaling echte juvenielen onbetrouwbaar)',
    bron: 'Demongin (2020) p.302–303',
    type: 'survey',
    start: 'petje_kleur',
    overzicht: [
      { conditie: 'Petje (vrijwel) geheel zwart', resultaat: '♂ M' },
      { conditie: 'Petje helder bruin', resultaat: '♀ V (pas op: zeldzame 1e kj ♂ M kan geheel bruin petje hebben)' },
      { conditie: 'Bruine randveren met zwartachtige waas (juveniel)', resultaat: '♂ M (onzeker — sexing 3J onbetrouwbaar)' },
    ],
    stappen: {

      petje_kleur: {
        id: 'petje_kleur',
        label: 'Petje kleur',
        type: 'keuze',
        vraag: 'Kleur van het petje (kruin en bovenzijde hoofd)?',
        opties: [
          {
            waarde: 'zwart',
            label: 'Zwart (eventueel met smalle bruine randen in vers verenkleed)',
            resultaat: {
              waarde: 'M', label: '♂ Man', zeker: false,
              uitleg: 'Zwart petje is kenmerkend voor ♂ M. Na 1e kj: gewoonlijk zonder bruine tinten, uitzonderlijk met duidelijke bruine randen. 1e kj ♂ M: gewoonlijk zwart met bruine eindtips op het voorhoofd, of geheel zwart.',
            },
          },
          {
            waarde: 'bruin',
            label: 'Helder bruin',
            resultaat: {
              waarde: 'F', label: '♀ Vrouw', zeker: false,
              uitleg: 'Helder bruin petje wijst op ♀ V. Pas op: een zeldzame 1e kj ♂ M kan een geheel bruin petje hebben — til de kruinveren op om groeiende of verborgen zwarte veren zichtbaar te maken. Geslachtsbepaling van echte juvenielen (3J) is onbetrouwbaar.',
            },
          },
          {
            waarde: 'zwartachtig',
            label: 'Bruin met zwartachtige waas op de randveren (mogelijke 3J ♂ M)',
            resultaat: {
              waarde: 'M', label: '♂ Man (onzeker)', zeker: false,
              uitleg: 'Bruine randveren met zwartachtige waas zijn kenmerkend voor 3J ♂ M. Geslachtsbepaling van echte juvenielen is echter onbetrouwbaar.',
            },
          },
        ],
      },

    },
  },

];
