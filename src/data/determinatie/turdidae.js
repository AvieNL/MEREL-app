/**
 * Determinatiehulpen voor Turdidae (lijsters)
 * EURING-codes: Merel = 11870 (Turdus merula)
 */

function datumNaarPeriode(datumStr) {
  if (!datumStr) return null;
  const maand = new Date(datumStr).getMonth() + 1; // 1–12
  return maand >= 1 && maand <= 5 ? 'jan_mei' : 'jun_dec';
}

export const turdidae = [

  // ─────────────────────────────────────────────────────────────────────────
  // Merel — Leeftijdsbepaling
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'merel-leeftijd',
    soorten: ['11870'],
    resultaat_veld: 'leeftijd',
    naam: 'Leeftijdsbepaling Merel',
    korte_beschrijving: 'GC contrast (juv vs geruid) · staartveer-vorm als bevestiging',
    bron: 'Demongin (2016) p.264–265',
    type: 'survey',
    start: 'seizoen',
    overzicht: [
      { conditie: 'Contrast buitenste (juv) GC vs binnenste (geruide) GC; centrale staartveer smal en puntig', resultaat: '1e kj (3)' },
      { conditie: 'Alle GC egaal, geen contrast in vleugel, centrale staartveer breed', resultaat: 'na 1e kj (4)' },
      { conditie: 'VJ: contrast zichtbaar', resultaat: '2e kj (5)' },
    ],
    stappen: {

      seizoen: {
        id: 'seizoen',
        label: 'Seizoen',
        type: 'keuze',
        uit_formulier: 'vangstdatum',
        transform: datumNaarPeriode,
        vraag: 'In welk seizoen is de vogel gevangen?',
        toelichting: 'Het seizoen bepaalt welke EURING-codes van toepassing zijn. GC-contrast is in zowel najaar als voorjaar bruikbaar. In jun–jul kan slijtage bij ♀ V het contrast uitwissen.',
        opties: [
          { waarde: 'jun_dec', label: 'Zomer / najaar (jun–dec)', volgende: 'gc_contrast_nj' },
          { waarde: 'jan_mei', label: 'Voorjaar (jan–mei)',       volgende: 'gc_contrast_vj' },
        ],
      },

      // ── Najaar-pad ──────────────────────────────────────────────────────

      gc_contrast_nj: {
        id: 'gc_contrast_nj',
        label: 'GC contrast (najaar)',
        type: 'keuze',
        vraag: 'Is er contrast zichtbaar in de grote vleugeldekveren (GC) of elders in de vleugel?',
        toelichting: 'Het GC-contrast is het hoofdcriterium. Kijk of de buitenste GC (juveniel: zwartbruin/roestbruin bij ♂ M / ♀ V) contrasteren met de binnenste GC (geruid: zwart bij ♂ M, donker olijfbruin bij ♀ V). Als alle GC geruid zijn, zoek dan contrast met de juv PC, binnen de alula, binnen de T of tussen T en S — juv veren zijn dan lichter dan de geruide veren. Bevestig 1e kj door ook de centrale staartveer te beoordelen: smal en puntig = 1e kj, breed = na 1e kj.',
        opties: [
          {
            waarde: 'contrast',
            label: 'Contrast aanwezig — buitenste juv GC vs binnenste geruide GC (of contrast in alula / T vs S / GC vs PC)',
            resultaat: {
              waarde: '3',
              label: '1e kj',
              zeker: false,
              uitleg: 'GC-contrast wijst op 1e kj (3). Juv centrale staartveer gewoonlijk smal en puntig (bevestiging). Bij ♂ M: bovenzijde bruinzwart (nooit olijftint), staartveren zwart maar P en S bruin, snavel bruinzwart tot dec–jan. Bij ♀ V: juv veren roestbruin of grijsbruin, geruide veren olijfbruin.',
            },
          },
          {
            waarde: 'geen_contrast',
            label: 'Geen contrast — GC en overige vleugelveren volledig egaal, centrale staartveer breed',
            resultaat: {
              waarde: '4',
              label: 'na 1e kj',
              zeker: false,
              uitleg: 'Egale GC zonder contrast duiden op na 1e kj (4). Bij ♂ M: volledig zwart, alle GC en T egaal zwart, snavel geel tot oranjeGeel, centrale staartveer breed. Bij ♀ V: alle GC egaal donker olijfbruin, snavel donker roze of geelbruin, centrale staartveer breed.',
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
              uitleg: 'GC-contrast niet te beoordelen. Probeer ook andere contrastpunten: alula, T vs S, GC vs PC. Centrale staartveer-vorm (smal/puntig vs breed) kan aanvullend houvast geven.',
            },
          },
        ],
      },

      // ── Voorjaar-pad ────────────────────────────────────────────────────

      gc_contrast_vj: {
        id: 'gc_contrast_vj',
        label: 'GC contrast (voorjaar)',
        type: 'keuze',
        vraag: 'Is er contrast zichtbaar in de grote vleugeldekveren (GC) of elders in de vleugel?',
        toelichting: 'Zelfde criterium als in het najaar. In het voorjaar is de vleugel gelijkmatig versleten bij na 1e kj. Veel 2e kj ♀ V zijn moeilijk te ouderdomsbepalen in jun–jul door slijtage.',
        opties: [
          {
            waarde: 'contrast',
            label: 'Contrast aanwezig — buitenste juv GC vs binnenste geruide GC (of contrast in alula / T vs S / GC vs PC)',
            resultaat: {
              waarde: '5',
              label: '2e kj',
              zeker: false,
              uitleg: 'GC-contrast in het voorjaar wijst op 2e kj (5) (= vorig najaar: 1e kj (3)). 2e kj ♂ M (5 M) soms snavel nog gedeeltelijk donker tot apr.',
            },
          },
          {
            waarde: 'geen_contrast',
            label: 'Geen contrast — vleugel gelijkmatig versleten',
            resultaat: {
              waarde: null,
              fallback_waarde: 'U',
              label: 'Niet nader te dateren (volwassen)',
              zeker: false,
              uitleg: 'Geen GC-contrast: volwassen vogel, niet nader te ouderdomsbepalen in het voorjaar. Kan 2e kj (5) zijn waarvan het contrast door slijtage niet meer zichtbaar is (met name ♀ V in jun–jul), of ouder.',
            },
          },
          {
            waarde: 'onzeker',
            label: 'Niet te beoordelen (bv. sterk versleten, jun–jul ♀ V)',
            resultaat: {
              waarde: null,
              fallback_waarde: 'U',
              label: 'Niet te bepalen',
              zeker: false,
              uitleg: 'Leeftijdsbepaling niet mogelijk. Veel 2e kj ♀ V zijn moeilijk te ouderdomsbepalen in jun–jul door slijtage.',
            },
          },
        ],
      },

    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Merel — Geslachtsbepaling
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'merel-geslacht',
    soorten: ['11870'],
    resultaat_veld: 'geslacht',
    naam: 'Geslachtsbepaling Merel',
    korte_beschrijving: 'Staartveren kleur · bij juv ook keel centrum',
    bron: 'Demongin (2016) p.264–265',
    type: 'survey',
    start: 'tf_kleur',
    overzicht: [
      { conditie: 'Staartveren zwart (of bijna); volledig zwart verenkleed', resultaat: '♂ M' },
      { conditie: 'Staartveren olijfbruin; bovenzijde donker grijsbruin met olijftint', resultaat: '♀ V' },
      { conditie: 'Juv, staartveren moeilijk: centrum keel zwartachtig', resultaat: '♂ M (voorzichtig)' },
      { conditie: 'Juv, staartveren moeilijk: centrum keel licht gespikkeld', resultaat: '♀ V (voorzichtig)' },
    ],
    stappen: {

      tf_kleur: {
        id: 'tf_kleur',
        label: 'Staartveren kleur',
        type: 'keuze',
        vraag: 'Hoe zijn de staartveren van kleur?',
        toelichting: 'Kleur van de staartveren is het betrouwbaarste geslachtskenmerk. Bij adulten en na postjuv-rui is het onderscheid duidelijk. Bij een vogel in volledig juveniel verenkleed (3J) kan kleur van de staartveren soms moeilijk te beoordelen zijn — gebruik dan de keel als back-up criterium.',
        opties: [
          {
            waarde: 'zwart',
            label: 'Zwart of bijna zwart',
            resultaat: {
              waarde: 'M',
              label: '♂ M',
              zeker: true,
              uitleg: 'Zwarte staartveren zijn kenmerkend voor ♂ M. Bij na 1e kj (4) ♂ M zijn ook alle vluchtveren zwart en is de snavel geel. Bij 1e kj (3) ♂ M zijn P en S nog bruin en is de snavel tot dec–jan bruinzwart.',
            },
          },
          {
            waarde: 'olijfbruin',
            label: 'Olijfbruin of donker geelbruin',
            resultaat: {
              waarde: 'F',
              label: '♀ V',
              zeker: true,
              uitleg: 'Olijfbruine staartveren zijn kenmerkend voor ♀ V. Bovenzijde donker grijsbruin met olijftint. Keel en borst roestbruin gestreept of gevlekt. Snavel donker roze of geelbruin. Kleur onderzijde individueel sterk variabel, zonder correlatie met leeftijd.',
            },
          },
          {
            waarde: 'onzeker',
            label: 'Moeilijk te beoordelen — volledig juveniel verenkleed',
            volgende: 'keel_centrum',
          },
        ],
      },

      keel_centrum: {
        id: 'keel_centrum',
        label: 'Keel centrum (juv)',
        type: 'keuze',
        vraag: 'Hoe ziet het centrum van de bovenste keel eruit?',
        toelichting: 'Bij juvenielen in volledig jeugdverenkleed (3J) is geslacht soms niet te bepalen via de kleur van de staartveren. Het keel-centrum biedt dan een back-up criterium, maar is ook niet altijd betrouwbaar.',
        opties: [
          {
            waarde: 'zwartachtig',
            label: 'Centrum bovenste keel zwartachtig',
            resultaat: {
              waarde: 'M',
              label: '♂ M (voorzichtig)',
              zeker: false,
              uitleg: 'Zwartachtig centrum van de bovenste keel wijst voorzichtig op ♂ M. Soms moeilijk te beoordelen bij juvenile vogels — ook de kleur van de staartveren controleren.',
            },
          },
          {
            waarde: 'gespikkeld',
            label: 'Centrum bovenste keel licht gespikkeld',
            resultaat: {
              waarde: 'F',
              label: '♀ V (voorzichtig)',
              zeker: false,
              uitleg: 'Licht gespikkeld centrum van de bovenste keel wijst voorzichtig op ♀ V. Soms moeilijk te beoordelen bij juvenile vogels — ook de kleur van de staartveren controleren.',
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
              uitleg: 'Geslacht niet te bepalen op basis van de kleur van de staartveren en keel-centrum bij juveniel. Geslachtsbepaling bij juveniele Merel via de kleur van de staartveren is soms niet mogelijk.',
            },
          },
        ],
      },

    },
  },

];
