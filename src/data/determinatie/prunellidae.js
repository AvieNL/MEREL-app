/**
 * Determinatiehulpen voor Prunellidae (heggenmus-achtigen)
 * EURING-codes: Heggenmus = 10840 (Prunella modularis)
 */

function datumNaarPeriode(datumStr) {
  if (!datumStr) return null;
  const maand = new Date(datumStr).getMonth() + 1; // 1–12
  return maand >= 1 && maand <= 5 ? 'jan_mei' : 'jun_dec';
}

export const prunellidae = [

  // ─────────────────────────────────────────────────────────────────────────
  // Heggenmus — Leeftijdsbepaling
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'heggenmus-leeftijd',
    soorten: ['10840'],
    resultaat_veld: 'leeftijd',
    naam: 'Leeftijdsbepaling Heggenmus',
    korte_beschrijving: 'GC vlekken → iris kleur',
    bron: 'Demongin (2016) p.244',
    type: 'survey',
    start: 'seizoen',
    overzicht: [
      { conditie: 'Intensief donker gestreepte borst/flanken, geen zuiver grijs', resultaat: '1e kj, deels in jeugdkleed (3J)' },
      { conditie: 'GC2–GC9 met duidelijke geelachtige/witachtige vlekken + zwarte punt', resultaat: '1e kj (3) / 2e kj (5)' },
      { conditie: 'GC-vlekken onduidelijk, vloeien in elkaar over; geen contrast T en S', resultaat: 'na 1e kj (4) / na 2e kj (6)' },
    ],
    stappen: {

      seizoen: {
        id: 'seizoen',
        label: 'Seizoen',
        type: 'keuze',
        uit_formulier: 'vangstdatum',
        transform: datumNaarPeriode,
        vraag: 'In welk seizoen is de vogel gevangen?',
        toelichting: 'Het seizoen bepaalt welke EURING-codes van toepassing zijn.',
        opties: [
          { waarde: 'jun_dec', label: 'Najaar (jun–dec)', volgende: 'streep_borst' },
          { waarde: 'jan_mei', label: 'Voorjaar (jan–mei)', volgende: 'gc_vlekken_vj' },
        ],
      },

      // ── Najaar-pad ──────────────────────────────────────────────────────

      streep_borst: {
        id: 'streep_borst',
        label: 'Streeppatroon borst',
        type: 'keuze',
        vraag: 'Zijn nek, borst en flanken intensief donker gestreept, zonder zuiver grijs?',
        toelichting: 'Vogels vóór de postjuveniele rui zijn doffer en missen zuiver grijs op kop en borst. Na de rui verdwijnt dit intensieve streeppatroon grotendeels.',
        opties: [
          {
            waarde: 'ja',
            label: 'Ja — intensief donker gestreept, geen zuiver grijs (behalve iets op keel)',
            resultaat: {
              waarde: '3',
              label: '1e kj, deels in jeugdkleed',
              zeker: false,
              uitleg: 'Intensief gestreepte nek, borst en flanken zonder zuiver grijs duiden op een juveniel vóór de postjuveniele rui (3J). Bovenzijde bruiner en minder roodachtig dan bij oudere vogels.',
            },
          },
          {
            waarde: 'nee',
            label: 'Nee — niet intensief gestreept',
            volgende: 'gc_vlekken_nj',
          },
        ],
      },

      gc_vlekken_nj: {
        id: 'gc_vlekken_nj',
        label: 'GC vlekken (najaar)',
        type: 'keuze',
        vraag: 'Hoe zien de vlekken op de grote armdekveren (GC2–GC9) eruit?',
        toelichting: 'Juveniele GC hebben duidelijke geelachtige vlekken op beide wimpels met een duidelijke zwarte punt. Met slijtage worden de geelachtige vlekken witachtig. Gemoulte GC (adulte vogels of gemoulte binnenste GC) hebben onduidelijkere, blekere vlekken die geleidelijk overgaan in de zwarte punt en bruinachtige rand. Let op: ruigrens is vaak moeilijk te vinden en kan ontbreken.',
        opties: [
          {
            waarde: 'duidelijk',
            label: 'Duidelijke geelachtige of witachtige (door slijtage) vlekken met een duidelijke, contrasterende zwarte punt',
            resultaat: {
              waarde: '3',
              label: '1e kj',
              zeker: false,
              uitleg: 'Duidelijke vlekken op juv GC2–GC9 duiden op 1e kj (3). Iris dof grijsbruin of grijsolijf. Soms iris met lichte roodachtige tint vanaf laat aug — gebruik iriskleur niet als enig criterium bij tussenliggende kleuren. Als alle GC gemoult: zoek ruigrens in alula of tussen gemoulte T en juv S (met minder donker centrum). Soms enkele juv MC met geelachtige punt aangehouden.',
            },
          },
          {
            waarde: 'onduidelijk',
            label: 'Onduidelijke lichte vlekken, zwarte punt en bruinachtige rand vloeien in elkaar over',
            resultaat: {
              waarde: '4',
              label: 'na 1e kj',
              zeker: false,
              uitleg: 'Onduidelijke GC-vlekken die in elkaar overvloeien duiden op na 1e kj (4). Iris lichter roodbruin (soms lichtbruin, soms even grijsachtig als bij 1e kj). Doorgaans witachtige vlekken op buitenste GC, weinig of geen op binnenste. Geen contrast tussen T en S. MC zonder geelachtige punt.',
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
              uitleg: 'Leeftijdsbepaling van Heggenmus is via verenkleed zeer moeilijk en vereist ervaring. Iris kleur overlapt. Ruigrens ontbreekt bij veel individuen. Leeftijd niet met zekerheid vast te stellen.',
            },
          },
        ],
      },

      // ── Voorjaar-pad ────────────────────────────────────────────────────

      gc_vlekken_vj: {
        id: 'gc_vlekken_vj',
        label: 'GC vlekken (voorjaar)',
        type: 'keuze',
        vraag: 'Hoe zien de vlekken op de grote armdekveren (GC2–GC9) eruit?',
        toelichting: 'In het voorjaar zijn de vlekken door slijtage minder opvallend. Juv GC-vlekken zijn geelachtig of door slijtage witachtig geworden, maar het contrast met de zwarte punt blijft duidelijker dan bij adulte vogels. Let op: leeftijdsbepaling is zeer moeilijk; ervaring vereist.',
        opties: [
          {
            waarde: 'duidelijk',
            label: 'Duidelijke (geelachtige of witachtige) vlekken met een contrasterende zwarte punt',
            resultaat: {
              waarde: '5',
              label: '2e kj',
              zeker: false,
              uitleg: 'Duidelijke vlekken op GC (ook al witachtig door slijtage) duiden in het voorjaar op 2e kj (5) (= vorig najaar: 1e kj (3)). Iris dof grijsbruin/grijsolijf; soms met lichte roodachtige tint. Ruigrens vaak moeilijk te vinden. Let op: leeftijdsbepaling via verenkleed is zeer moeilijk; ervaring vereist.',
            },
          },
          {
            waarde: 'onduidelijk',
            label: 'Onduidelijke lichte vlekken, zwarte punt en rand vloeien in elkaar over',
            resultaat: {
              waarde: '6',
              label: 'na 2e kj',
              zeker: false,
              uitleg: 'Onduidelijke GC-vlekken duiden in het voorjaar op na 2e kj (6) (= vorig najaar: na 1e kj (4)). Iris lichter roodbruin. Geen contrast tussen T en S. MC zonder geelachtige punt.',
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
              uitleg: 'Leeftijdsbepaling van Heggenmus is via verenkleed zeer moeilijk en vereist ervaring. In het voorjaar zijn vlekken door slijtage nog minder betrouwbaar. Leeftijd niet met zekerheid vast te stellen.',
            },
          },
        ],
      },

    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Heggenmus — Geslachtsbepaling
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'heggenmus-geslacht',
    soorten: ['10840'],
    resultaat_veld: 'geslacht',
    naam: 'Geslachtsbepaling Heggenmus',
    korte_beschrijving: 'BP/CP → kleur kin, keel en borst',
    bron: 'Demongin (2016) p.243',
    type: 'survey',
    start: 'bp_cp',
    overzicht: [
      { conditie: 'Broedvlek aanwezig', resultaat: '♀ V (zeker)' },
      { conditie: 'Uitstekende cloaca aanwezig', resultaat: '♂ M (zeker)' },
      { conditie: 'Kin/keel/borst meer loodgrijs', resultaat: '♂ M (waarschijnlijk)' },
      { conditie: 'Kin/keel/borst paler grijs met olijfbruin/witachtige zomen', resultaat: '♀ V (waarschijnlijk)' },
    ],
    stappen: {

      bp_cp: {
        id: 'bp_cp',
        label: 'Broedvlek / cloaca',
        type: 'keuze',
        vraag: 'Is er een broedvlek of uitstekende cloaca aanwezig?',
        toelichting: 'Broedvlek (BP) en uitstekende cloaca zijn betrouwbare geslachtsindicatoren bij Heggenmus.',
        opties: [
          {
            waarde: 'bp',
            label: 'Broedvlek aanwezig',
            resultaat: {
              waarde: 'F',
              label: '♀ V',
              zeker: true,
              uitleg: 'Een broedvlek is een betrouwbare indicator voor het vrouwelijk geslacht.',
            },
          },
          {
            waarde: 'cp',
            label: 'Uitstekende cloaca aanwezig',
            resultaat: {
              waarde: 'M',
              label: '♂ M',
              zeker: true,
              uitleg: 'Een uitstekende cloaca is een betrouwbare indicator voor het mannelijk geslacht.',
            },
          },
          {
            waarde: 'geen',
            label: 'Geen broedvlek of uitstekende cloaca',
            volgende: 'kin_keel',
          },
        ],
      },

      kin_keel: {
        id: 'kin_keel',
        label: 'Kleur kin, keel en borst',
        type: 'keuze',
        vraag: 'Hoe ziet de kleur van kin, keel en borst eruit?',
        toelichting: 'Mannetjes hebben gemiddeld meer loodgrijze kin, keel en borst. Vrouwtjes zijn paler grijs met vaak olijfbruine en witachtige zomen. Imm ♂ M en ad ♀ V zijn echter vaak niet van elkaar te onderscheiden.',
        opties: [
          {
            waarde: 'loodgrijs',
            label: 'Meer loodgrijs — egale grijze tint',
            resultaat: {
              waarde: 'M',
              label: '♂ M (waarschijnlijk)',
              zeker: false,
              uitleg: 'Meer loodgrijze kleur op kin, keel en borst wijst gemiddeld op ♂ M. Let op: imm ♂ M en ad ♀ V zijn vaak niet van elkaar te onderscheiden op basis van verenkleed alleen.',
            },
          },
          {
            waarde: 'paler',
            label: 'Paler grijs — met olijfbruine en/of witachtige zomen',
            resultaat: {
              waarde: 'F',
              label: '♀ V (waarschijnlijk)',
              zeker: false,
              uitleg: 'Paler grijs met olijfbruine of witachtige zomen wijst gemiddeld op ♀ V. Let op: imm ♂ M en ad ♀ V zijn vaak niet van elkaar te onderscheiden op basis van verenkleed alleen.',
            },
          },
          {
            waarde: 'onzeker',
            label: 'Tussenin — niet duidelijk te plaatsen',
            resultaat: {
              waarde: null,
              fallback_waarde: 'U',
              label: 'Niet te bepalen',
              zeker: false,
              uitleg: 'Geslacht niet te bepalen op basis van verenkleed. Geslachtsbepaling van Heggenmus is — zonder BP of uitstekende cloaca — vaak onmogelijk, met name bij imm ♂ M en ad ♀ V.',
            },
          },
        ],
      },

    },
  },

];
