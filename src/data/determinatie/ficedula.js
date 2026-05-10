/**
 * Determinatiehulpen voor Ficedula (vliegenvangers)
 * EURING-codes: Bonte Vliegenvanger = 13490 (Ficedula hypoleuca)
 */

// ISO-datum → 'jan_mei' | 'jun_dec'
function datumNaarPeriode(v) {
  if (!v) return null;
  const m = new Date(v).getMonth() + 1;
  if (isNaN(m)) return null;
  return m >= 1 && m <= 5 ? 'jan_mei' : 'jun_dec';
}

export const ficedula = [

  // ─────────────────────────────────────────────────────────────────────────
  // Bonte Vliegenvanger — Leeftijdsbepaling
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'bvliegenvanger-leeftijd',
    soorten: ['13490'],
    resultaat_veld: 'leeftijd',
    naam: 'Leeftijdsbepaling Bonte Vliegenvanger',
    korte_beschrijving: 'Herfst: handpendekveren + ruicentra; Voorjaar: slijtage PC + dekverencontrast',
    bron: 'Demongin (2020) p.317–320',
    type: 'survey',
    start: 'seizoen',
    overzicht: [
      {
        conditie: 'Herfst (jul–dec)',
        sub: [
          { conditie: 'Buffrand op buitenste handpendekveren', resultaat: '1e kj' },
          { conditie: 'Geen buffrand + twee ruicentra in P', resultaat: '2e kj (klein deel herkenbaar)' },
          { conditie: 'Geen buffrand + één ruicentrum', resultaat: 'Adult (of voltooide 2e kj)' },
        ],
      },
      {
        conditie: 'Voorjaar (jan–jun)',
        sub: [
          { conditie: 'Juv outer PC versleten en bleek + dekverencontrast zichtbaar', resultaat: '2e kj' },
          { conditie: 'PC afgerond, weinig versleten', resultaat: 'Adult' },
        ],
      },
    ],
    stappen: {

      seizoen: {
        id: 'seizoen',
        label: 'Seizoen',
        type: 'keuze',
        vraag: 'In welk seizoen is de vogel gevangen?',
        toelichting: 'Leeftijdsbepaling verschilt sterk per seizoen. In herfst zijn de handpendekveren de primaire indicator; in voorjaar is de slijtage van handpendekveren en het dekverencontrast leidend.',
        uit_formulier: {
          veld: 'datum',
          transform: datumNaarPeriode,
        },
        opties: [
          {
            waarde: 'jun_dec',
            label: 'Herfst (juni t/m december)',
            volgende: 'pc_rand_nj',
          },
          {
            waarde: 'jan_mei',
            label: 'Voorjaar (januari t/m mei)',
            volgende: 'pc_toestand_vj',
          },
        ],
      },

      // ── Herfst-flow ──────────────────────────────────────────────────────

      pc_rand_nj: {
        id: 'pc_rand_nj',
        label: 'Handpendekveren (herfst)',
        type: 'keuze',
        vraag: 'Hoe zijn de buitenste handpendekveren?',
        toelichting: 'Let op de buitenste handpendekveren (PC). Een witte tot wittige rand op de middelste tertial kan aanvullend bevestigen: bij 1e kj is deze breed op de buitenvlag maar smal met inkeping op de binnenvlag.',
        opties: [
          {
            waarde: 'buff',
            label: 'Wittige of bruine rand op de buitenste handpendekveren',
            resultaat: {
              waarde: '3',
              label: '1e kj',
              zeker: false,
              uitleg: 'Wittige of bruine rand op de buitenste handpendekveren is kenmerkend voor 1e kj. Ondersteunende kenmerken: iris donkergrijs zonder bruintint; tertialzoom breed op buitenvlag maar smal met inkeping op binnenvlag; binnenzijde bovensnavel bleekroosgrijzig.',
            },
          },
          {
            waarde: 'donker',
            label: 'Egaal donker of grijsbruin — geen duidelijke rand',
            volgende: 'ruicentra_nj',
          },
        ],
      },

      ruicentra_nj: {
        id: 'ruicentra_nj',
        label: 'Ruicentra in P (herfst)',
        type: 'keuze',
        vraag: 'Hoeveel ruicentra zijn er zichtbaar in de handpennen?',
        toelichting: 'Controleer beide vleugels. Twee ruicentra = twee aparte zones van verse of actieve pennen. Controleer aanvullend: is P2 nog juveniel (bruinachtig, versleten)? En zit er een buffpunt op de buitenste kleine dekveren bij de vleugelboeg?',
        opties: [
          {
            waarde: 'twee',
            label: 'Twee ruicentra (beide vleugels)',
            resultaat: {
              waarde: '5',
              label: '2e kj',
              zeker: false,
              uitleg: 'Twee ruicentra zijn een betrouwbare indicator voor 2e kj. Soms ook: P2 nog juveniel en/of buffpunt op buitenste kleine dekveren bij vleugelboeg. Let op: de meeste 2kj-vogels hebben de postrui al voltooid en zijn niet meer te onderscheiden van adulten.',
            },
          },
          {
            waarde: 'een',
            label: 'Één ruicentrum of geen actieve rui',
            resultaat: {
              waarde: '4',
              label: 'Adult (of voltooide 2e kj)',
              zeker: false,
              uitleg: 'Handpendekveren zonder rand en één ruicentrum wijzen op adult. Een 2e kj dat de postrui al heeft voltooid (v.a. herfst 2e kj) is niet meer te onderscheiden.',
            },
          },
        ],
      },

      // ── Voorjaar-flow ─────────────────────────────────────────────────────

      pc_toestand_vj: {
        id: 'pc_toestand_vj',
        label: 'Handpendekveren (voorjaar)',
        type: 'keuze',
        vraag: 'Hoe zijn de handpendekveren (PC)?',
        toelichting: 'In voorjaar zijn de handpendekveren (PC) leidend. Bij 2e kj zijn de buitenste PC bruinachtig, iets bleker dan adult, vrij spits en versleten. Bij adult zijn ze meer afgerond en weinig versleten.',
        opties: [
          {
            waarde: 'versleten',
            label: 'Bruinachtig, iets bleker dan adult, vrij spits en versleten',
            volgende: 'dekveren_contrast_vj',
          },
          {
            waarde: 'vers',
            label: 'Afgerond en weinig versleten',
            resultaat: {
              waarde: '6',
              label: 'Adult',
              zeker: false,
              uitleg: 'Afgeronde, weinig versleten handpendekveren wijzen op adult. Bij adult ♂ M zijn de PC donkergrijs; bij adult ♀ V iets grijsbruin.',
            },
          },
        ],
      },

      dekveren_contrast_vj: {
        id: 'dekveren_contrast_vj',
        label: 'Dekverencontrast (voorjaar)',
        type: 'keuze',
        vraag: 'Is er contrast zichtbaar tussen de binnenste en buitenste vleugeldekveren?',
        toelichting: 'Vergelijk de binnenste dekveren (prebroedsel, vers en donkerder) met de buitenste dekveren (juveniel, versleten en bruinachtig). Controleer ook de alula en handpendekveren. Bij 2kj ♂ M is het contrast sterk; bij 2kj ♀ V subtiel.',
        opties: [
          {
            waarde: 'ja',
            label: 'Contrast zichtbaar — binnenste dekveren duidelijk donkerder of fresher dan buitenste',
            resultaat: {
              waarde: '5',
              label: '2e kj',
              zeker: false,
              uitleg: 'Dekverencontrast met versleten buitenste PC bevestigt 2e kj. Aanvullend: binnenste P voor 2e keer geruid (soms 3 generaties zichtbaar); juv TF indien nog aanwezig duidelijk versleten, soms spits.',
            },
          },
          {
            waarde: 'nee',
            label: 'Geen of nauwelijks contrast — dekveren gelijkmatig',
            resultaat: {
              waarde: '6',
              label: 'Adult (of voltooide 2e kj)',
              zeker: false,
              uitleg: 'Weinig dekverencontrast wijst op adult. Een 2e kj met voltooide rui is eventueel herkenbaar via sterk versleten P en bleekder PC — bij twijfel niet te bepalen.',
            },
          },
        ],
      },

    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Bonte Vliegenvanger — Geslachtsbepaling
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'bvliegenvanger-geslacht',
    soorten: ['13490'],
    resultaat_veld: 'geslacht',
    naam: 'Geslachtsbepaling Bonte Vliegenvanger',
    korte_beschrijving: 'Voorjaar: voorhoofdsvlek + bovenstaartdekveren; Herfst: LP + TF-kleur (moeilijk bij 1kj)',
    bron: 'Demongin (2020) p.318–320',
    type: 'survey',
    start: 'seizoen',
    stappen: {

      seizoen: {
        id: 'seizoen',
        label: 'Seizoen',
        type: 'keuze',
        vraag: 'In welk seizoen is de vogel gevangen?',
        toelichting: 'Geslachtsbepaling verschilt per seizoen. In voorjaar zijn ♂ M en ♀ V goed te onderscheiden. In herfst is geslachtsbepaling bij 1e kj zeer moeilijk en vaak niet mogelijk door overlap — begin met leeftijdsbepaling.',
        uit_formulier: {
          veld: 'datum',
          transform: datumNaarPeriode,
        },
        opties: [
          {
            waarde: 'jan_mei',
            label: 'Voorjaar (januari t/m mei)',
            volgende: 'voorhoofdsvlek_vj',
          },
          {
            waarde: 'jun_dec',
            label: 'Herfst (juni t/m december)',
            volgende: 'bovenstaartdekveren_nj',
          },
        ],
      },

      // ── Voorjaar-flow ─────────────────────────────────────────────────────

      voorhoofdsvlek_vj: {
        id: 'voorhoofdsvlek_vj',
        label: 'Voorhoofdsvlek (voorjaar)',
        type: 'keuze',
        vraag: 'Is er een wit vlekje op het voorhoofd aanwezig?',
        toelichting: 'Vrijwel altijd aanwezig bij ♂ M (uitzonderlijk afwezig). Bij ♀ V geen wit op voorhoofd — soms enkele bleekwitte veertjes aan de basis bij slijtage.',
        uit_formulier: {
          veld: 'broedvlek',
          // broedvlek-veld niet relevant hier; geen auto-fill
          transform: () => null,
        },
        opties: [
          {
            waarde: 'ja',
            label: 'Ja — wit vlekje aanwezig op het voorhoofd',
            resultaat: {
              waarde: 'M',
              label: '♂ Man',
              zeker: true,
              uitleg: 'Aanwezigheid van een wit voorhoofdsvlekje is een vrijwel zekere ♂ M-indicator. Let op: soms groot vlekje bij iberiae-ondersoort.',
            },
          },
          {
            waarde: 'nee',
            label: 'Nee — geen wit op het voorhoofd',
            volgende: 'bovenstaartdekveren_vj',
          },
        ],
      },

      bovenstaartdekveren_vj: {
        id: 'bovenstaartdekveren_vj',
        label: 'Bovenstaartdekveren (voorjaar)',
        type: 'keuze',
        vraag: 'Wat is de kleur van de langste bovenstaartdekveren?',
        toelichting: 'Kijk naar de langste bovenstaartdekveren (LP). Bij ♂ M zijn deze zwart of bruinzwart; bij ♀ V bruingrijs met een zwarte schachtstip.',
        opties: [
          {
            waarde: 'zwart',
            label: 'Zwart of bruinzwart',
            resultaat: {
              waarde: 'M',
              label: '♂ Man (mogelijk)',
              zeker: false,
              uitleg: 'Zwarte of bruinzwarte langste bovenstaartdekveren zijn kenmerkend voor ♂ M in voorjaar. Centrale staartpennen zijn donkerbruinzwart (zelden zwart).',
            },
          },
          {
            waarde: 'bruingrijs',
            label: 'Bruingrijs (met zwarte schachtstip)',
            resultaat: {
              waarde: 'F',
              label: '♀ Vrouw (mogelijk)',
              zeker: false,
              uitleg: 'Bruingrijze bovenstaartdekveren met zwarte schachtstip zijn kenmerkend voor ♀ V. Dekveren zijn egaal bruingrijs; centrale staartpennen bruingrijs tot bruinzwart.',
            },
          },
        ],
      },

      // ── Herfst-flow ──────────────────────────────────────────────────────

      bovenstaartdekveren_nj: {
        id: 'bovenstaartdekveren_nj',
        label: 'Bovenstaartdekveren (herfst)',
        type: 'keuze',
        vraag: 'Wat is de kleur van de langste bovenstaartdekveren?',
        toelichting: 'Let op: geslachtsbepaling in herfst — met name bij 1e kj — is zeer moeilijk door overlap. Beide geslachten kunnen dof zwartachtige staartpennen en bovenstaartdekveren hebben. Combineer meerdere kenmerken en bepaal leeftijd eerst.',
        opties: [
          {
            waarde: 'grijs_bruin',
            label: 'Egaal grijsbruin, geen spoor van zwart',
            resultaat: {
              waarde: 'F',
              label: '♀ Vrouw (1e kj, mogelijk)',
              zeker: false,
              uitleg: 'Uniformly grijsbruine LP zonder zwart = duidelijk ♀ V-indicator bij 1e kj. Let op: LP kan soms bruinzwart zijn bij ♀ V 1kj of zwart met bredere bruine punt dan bij ♂ M.',
            },
          },
          {
            waarde: 'zwart',
            label: 'Zwart of bruinzwart (met of zonder bruine punt)',
            volgende: 'tf_kleur_nj',
          },
          {
            waarde: 'onduidelijk',
            label: 'Onduidelijk of gemengd',
            volgende: 'tf_kleur_nj',
          },
        ],
      },

      tf_kleur_nj: {
        id: 'tf_kleur_nj',
        label: 'Staartpennen TF1–3 (herfst)',
        type: 'keuze',
        vraag: 'Wat is de kleur van de centrale staartpennen (TF1 t/m TF3)?',
        toelichting: 'Kijk naar de drie binnenste staartpennen (TF1–TF3). Bij ♂ M zijn deze zwartachtig of zwart; bij ♀ V bruin of bruingrijs. Bij 1kj is er grote overlap — beide geslachten kunnen dof zwartachtige TF hebben.',
        opties: [
          {
            waarde: 'zwart',
            label: 'TF1–TF3 duidelijk zwartachtig of zwart',
            volgende: 'tf6_rand_nj',
          },
          {
            waarde: 'bruin',
            label: 'TF1–TF3 bruin of bruingrijs — niet duidelijk zwartachtig',
            volgende: 'tf6_rand_nj',
          },
          {
            waarde: 'onduidelijk',
            label: 'Niet duidelijk te beoordelen',
            resultaat: {
              waarde: null,
              fallback_waarde: 'U',
              label: 'Niet te bepalen',
              zeker: false,
              uitleg: 'Geslacht is niet betrouwbaar vast te stellen. Geslachtsbepaling van Bonte Vliegenvanger in herfst — met name bij 1e kj — is zeer moeilijk door overlap.',
            },
          },
        ],
      },

      tf6_rand_nj: {
        id: 'tf6_rand_nj',
        label: 'TF6 buitenvlag — witte rand (herfst)',
        type: 'keuze',
        vraag: 'Hoe is de grens van het witte gebied op de buitenvlag van TF6?',
        toelichting: 'Bij ♂ M vormt het witte gebied op de buitenvlag van TF6 een duidelijke, vierkante rand die scherp contrasteert met het donkere deel. Bij ♀ V is de grens schuin of diffuus. Dit kenmerk is variabel en moet met andere kenmerken worden gecombineerd.',
        opties: [
          {
            waarde: 'vierkant',
            label: 'Duidelijk vierkante rand — scherp contrast met donker',
            resultaat: {
              waarde: 'M',
              label: '♂ Man (mogelijk)',
              zeker: false,
              uitleg: 'Vierkante, scherp afgebakende witte rand op TF6-buitenvlag wijst op ♂ M. Bevestig via TF1–3-kleur (zwartachtig bij ♂ M) en LP-kleur (zwart bij ♂ M). Bij 1kj is het resultaat onzeker door overlap.',
            },
          },
          {
            waarde: 'schuin',
            label: 'Schuin of diffuus — geen scherpe grens',
            resultaat: {
              waarde: 'F',
              label: '♀ Vrouw (mogelijk)',
              zeker: false,
              uitleg: 'Schuine of diffuse grens op TF6-buitenvlag wijst op ♀ V. Bij 1kj is het resultaat onzeker door overlap. Bevestig via LP-kleur (grijsbruin bij ♀ V) en TF1–3 (bruin/bruingrijs bij ♀ V).',
            },
          },
          {
            waarde: 'onduidelijk',
            label: 'Niet te beoordelen',
            resultaat: {
              waarde: null,
              fallback_waarde: 'U',
              label: 'Niet te bepalen',
              zeker: false,
              uitleg: 'Geslacht is niet betrouwbaar vast te stellen. Geslachtsbepaling van Bonte Vliegenvanger in herfst is zeer moeilijk door overlap, met name bij 1e kj.',
            },
          },
        ],
      },

    },
  },

];
