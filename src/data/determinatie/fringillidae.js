/**
 * Determinatiehulpen voor Fringillidae (vinkachtigen)
 * EURING-codes: Groenling = 16490 (Chloris chloris)
 */

// ISO-datum → 'jan_mei' | 'jun_dec'
function datumNaarPeriode(v) {
  if (!v) return null;
  const m = new Date(v).getMonth() + 1;
  if (isNaN(m)) return null;
  return m >= 1 && m <= 5 ? 'jan_mei' : 'jun_dec';
}

export const fringillidae = [

  // ─────────────────────────────────────────────────────────────────────────
  // Groenling — Leeftijdsbepaling
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'groenling-leeftijd',
    soorten: ['16490'],
    resultaat_veld: 'leeftijd',
    naam: 'Leeftijdsbepaling Groenling',
    korte_beschrijving: 'Herfst: ruigrens + PC/alula contrast; Voorjaar: slijtage stuurpennen',
    bron: 'Demongin (2020) p.361–362',
    type: 'survey',
    start: 'seizoen',
    overzicht: [
      {
        conditie: 'Herfst (jul–dec)',
        sub: [
          { conditie: 'Ruigrens in alula/CC/PC/TF zichtbaar', resultaat: '1e kj (of 2e kj na excentrische rui)' },
          { conditie: 'Geen ruigrens + schedel volledig gepneumatiseerd', resultaat: 'Adult — niet meer van adult te onderscheiden' },
        ],
      },
      {
        conditie: 'Voorjaar (jan–jun)',
        sub: [
          { conditie: 'Juveniele stuurpennen sterk versleten (smal, spits)', resultaat: '2e kj' },
          { conditie: 'Stuurpennen vrij vers, breed en afgerond', resultaat: 'Adult (+1e kj)' },
        ],
      },
    ],
    stappen: {

      seizoen: {
        id: 'seizoen',
        label: 'Seizoen',
        type: 'keuze',
        vraag: 'In welk seizoen is de vogel gevangen?',
        toelichting: 'Leeftijdsbepaling verschilt per seizoen. In herfst zijn ruigrenzen de primaire indicator; in voorjaar is slijtage van stuurpennen leidend.',
        uit_formulier: {
          veld: 'datum',
          transform: datumNaarPeriode,
        },
        opties: [
          {
            waarde: 'jun_dec',
            label: 'Zomer/Herfst (juni t/m december)',
            volgende: 'ruigrens_nj',
          },
          {
            waarde: 'jan_mei',
            label: 'Voorjaar (januari t/m mei)',
            volgende: 'tf_slijtage_vj',
          },
        ],
      },

      // ── Herfst-flow ──────────────────────────────────────────────────────

      ruigrens_nj: {
        id: 'ruigrens_nj',
        label: 'Ruigrens (herfst)',
        type: 'keuze',
        vraag: 'Is er een ruigrens zichtbaar in alula, CC, PC en/of stuurpennen?',
        toelichting: 'Controleer altijd op ruigrenzen in alula, armpendekveren bij vleugelboeg (CC), handpendekveren (PC) en stuurpennen. Vogels die compleet geruid zijn (schedel volledig gepneumatiseerd) zijn niet meer van adulten te onderscheiden.',
        opties: [
          {
            waarde: 'ja',
            label: 'Ja — ruigrens zichtbaar',
            volgende: 'ruigrens_detail_nj',
          },
          {
            waarde: 'nee',
            label: 'Geen ruigrens — volledig uniform verenkleed',
            volgende: 'schedel_nj',
          },
        ],
      },

      ruigrens_detail_nj: {
        id: 'ruigrens_detail_nj',
        label: 'Ruigrens detail (herfst)',
        type: 'keuze',
        vraag: 'Wat is het contrast tussen geruidde en niet-geruidde veren?',
        toelichting: 'Bij ♂ M: geruidde alula/CC met helderde gele rand en donker centrum vs. bruine juveniele handpendekveren. Geruid deel alula 1 in dezelfde gele kleur als aangrenzende kleine dekveren. Bij ♀ V: zelfde contrasten maar altijd minder opvallend; alula 1 groen i.p.v. geel.',
        opties: [
          {
            waarde: 'duidelijk',
            label: 'Duidelijk contrast tussen oud (juv) en nieuw (postjuv) verenmateriaal',
            resultaat: {
              waarde: '3',
              label: '1e kj',
              zeker: false,
              uitleg: 'Ruigrens met duidelijk contrast tussen juveniele en postjuveniele veren wijst op 1e kj. Let op: vogels met zeer uitgebreide postrui (incl. handpennen) kunnen niet van adulten worden onderscheiden. Controleer ook schedelpneumatisatie.',
            },
          },
          {
            waarde: 'onduidelijk',
            label: 'Onduidelijk of twijfelachtig contrast',
            resultaat: {
              waarde: null,
              fallback_waarde: 'U',
              label: 'Niet te bepalen',
              zeker: false,
              uitleg: 'Onvoldoende contrast om 1e kj van adult te onderscheiden. Vogels met uitgebreide postrui (schedel volledig gepneumatiseerd) zijn niet meer van adulten te onderscheiden.',
            },
          },
        ],
      },

      schedel_nj: {
        id: 'schedel_nj',
        label: 'Schedelpneumatisatie (herfst)',
        type: 'keuze',
        vraag: 'Is de schedel volledig gepneumatiseerd?',
        toelichting: 'Controleer de schedel via doorschemering. Volledig gepneumatiseerd = één egale laag zonder doorschemering. Vogels zonder ruigrens én met volledig gepneumatiseerde schedel zijn niet meer van adulten te onderscheiden.',
        opties: [
          {
            waarde: 'volledig',
            label: 'Volledig gepneumatiseerd — geen vensters zichtbaar',
            resultaat: {
              waarde: '4',
              label: 'Adult (of voltooide 1e kj)',
              zeker: false,
              uitleg: 'Geen ruigrens en volledig gepneumatiseerde schedel: niet meer van adult te onderscheiden. Dit kan een adult zijn, of een 1e kj dat de postrui volledig heeft afgerond.',
            },
          },
          {
            waarde: 'deels',
            label: 'Deels gepneumatiseerd of onduidelijk',
            resultaat: {
              waarde: '3',
              label: '1e kj (mogelijk)',
              zeker: false,
              uitleg: 'Onvolledige schedelpneumatisatie bij afwezige ruigrens kan op een 1e kj wijzen dat de postrui vrijwel volledig heeft afgerond. Resultaat onzeker.',
            },
          },
        ],
      },

      // ── Voorjaar-flow ─────────────────────────────────────────────────────

      tf_slijtage_vj: {
        id: 'tf_slijtage_vj',
        label: 'Slijtage stuurpennen (voorjaar)',
        type: 'keuze',
        vraag: 'Hoe zijn de stuurpennen (TF) wat betreft slijtage en vorm?',
        toelichting: 'In voorjaar zijn slijtage en vorm van de stuurpennen leidend. Juveniele stuurpennen zijn smal en spits en slijten eerder dan adulte. In feb–mrt zijn de contrasten het duidelijkst. Sommige ♂ M en veel ♀ V zijn tussenin en niet te bepalen.',
        opties: [
          {
            waarde: 'versleten',
            label: 'Sterk versleten, vaak spits en smal (met name in feb–mrt)',
            resultaat: {
              waarde: '5',
              label: '2e kj',
              zeker: false,
              uitleg: 'Sterk versleten, spitse en smalle stuurpennen in voorjaar wijzen op 2e kj (juveniele TF). Juveniele handpennen en armpennen soms ook bruinachtiger dan zwartachtig.',
            },
          },
          {
            waarde: 'vers',
            label: 'Vrij vers, breed en afgerond (randen weinig versleten)',
            resultaat: {
              waarde: '6',
              label: 'Adult (+1e kj)',
              zeker: false,
              uitleg: 'Verse, brede en afgeronde stuurpennen wijzen op adult. In apr–mei wordt slijtage ook bij adulten duidelijker.',
            },
          },
          {
            waarde: 'tussenin',
            label: 'Tussenin — niet duidelijk te beoordelen',
            resultaat: {
              waarde: null,
              fallback_waarde: 'U',
              label: 'Niet te bepalen',
              zeker: false,
              uitleg: 'Sommige individuen (veel ♀ V) zijn in voorjaar niet te leeftijdsbepalen op basis van stuurpennen alleen.',
            },
          },
        ],
      },

    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Groenling — Geslachtsbepaling
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'groenling-geslacht',
    soorten: ['16490'],
    resultaat_veld: 'geslacht',
    naam: 'Geslachtsbepaling Groenling',
    korte_beschrijving: 'BP/cloaca betrouwbaar; TF4–TF6 geel + TF5-meting ondersteunen bij alle leeftijden',
    bron: 'Demongin (2020) p.361–362',
    type: 'survey',
    start: 'bp_cp',
    stappen: {

      bp_cp: {
        id: 'bp_cp',
        label: 'Broedvlek / cloaca',
        type: 'keuze',
        vraag: 'Is er een broedvlek (BP) of uitstekende cloaca aanwezig?',
        toelichting: 'BP en uitstekende cloaca zijn betrouwbare geslachtsindicatoren bij de Groenling op elke leeftijd.',
        opties: [
          {
            waarde: 'bp',
            label: 'Broedvlek (BP) aanwezig',
            resultaat: {
              waarde: 'F',
              label: '♀ Vrouw',
              zeker: true,
              uitleg: 'Broedvlek is een zekere ♀ V-indicator bij de Groenling.',
            },
          },
          {
            waarde: 'cp',
            label: 'Uitstekende cloaca aanwezig',
            resultaat: {
              waarde: 'M',
              label: '♂ Man',
              zeker: true,
              uitleg: 'Uitstekende cloaca is een zekere ♂ M-indicator bij de Groenling.',
            },
          },
          {
            waarde: 'geen',
            label: 'Geen BP of cloaca',
            volgende: 'tf_geel',
          },
        ],
      },

      tf_geel: {
        id: 'tf_geel',
        label: 'TF4–TF6 geel binnenweb',
        type: 'keuze',
        vraag: 'Bereikt het geel op het binnenweb van TF4–TF6 de donkere schacht?',
        toelichting: 'Kijk naar de binnenwebben van stuurpennen TF4, TF5 en TF6. Bij ♂ M reikt het gele gebied over ten minste 10 mm tot aan de donkere schacht. Bij ♀ V reikt het geel niet tot de schacht, of over minder dan 10 mm. Er is overlap mogelijk.',
        opties: [
          {
            waarde: 'ja_10mm',
            label: 'Ja — geel reikt tot aan schacht over ≥ 10 mm',
            volgende: 'tf5_meting',
          },
          {
            waarde: 'nee',
            label: 'Nee — geel reikt niet tot schacht, of < 10 mm',
            volgende: 'tf5_meting',
          },
          {
            waarde: 'onduidelijk',
            label: 'Niet goed te beoordelen',
            volgende: 'tf5_meting',
          },
        ],
      },

      tf5_meting: {
        id: 'tf5_meting',
        label: 'TF5 zwarte punt (schacht)',
        type: 'meting',
        vraag: 'Meet de lengte van het zwarte gebied aan de punt van TF5, gemeten langs de schacht (mm)',
        toelichting: 'Meet langs de schacht van TF5 de lengte van het donkere/zwarte gebied aan de veerpunt. Grens: < 31 mm → ♂ M; > 31 mm → ♀ V. Er is overlap bij beide kenmerken — combineer met het TF-geel-criterium.',
        inputs: [
          {
            key: 'tf5_zwart',
            label: 'Zwarte puntlengte TF5 (mm)',
            decimalen: 0,
            min: 10,
            max: 55,
            placeholder: 'bijv. 28',
          },
        ],
        bereken_type: 'drempelwaarde',
        bereken_config: {
          veld: 'tf5_zwart',
          drempel: 31,
          resultaat_kleiner: {
            waarde: 'M',
            label: '♂ Man (mogelijk)',
            zeker: false,
            uitleg_template: 'TF5 zwarte puntlengte {v} mm (< 31 mm) wijst op ♂ M. Combineer met TF4–TF6 geel-criterium voor betrouwbaarder resultaat.',
          },
          resultaat_groter_gelijk: {
            waarde: 'F',
            label: '♀ Vrouw (mogelijk)',
            zeker: false,
            uitleg_template: 'TF5 zwarte puntlengte {v} mm (≥ 31 mm) wijst op ♀ V. Combineer met TF4–TF6 geel-criterium voor betrouwbaarder resultaat.',
          },
        },
      },

    },
  },

];
