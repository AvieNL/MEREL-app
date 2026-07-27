/**
 * Determinatiehulpen voor Picidae (spechten)
 * EURING-codes: Grote Bonte Specht = 08760 (Dendrocopos major)
 *               Middelste Bonte Specht = 08830 (Dendrocopos medius)
 */

export const picidae = [

  // ─────────────────────────────────────────────────────────────────────────
  // Grote Bonte Specht — Leeftijdsbepaling
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'gbs-leeftijd',
    soorten: ['08760'],
    resultaat_veld: 'leeftijd',
    naam: 'Leeftijdsbepaling Grote Bonte Specht',
    korte_beschrijving: 'PC-kleur als primaire indicator; P1-projectie als bevestiging',
    bron: 'Demongin (2016) p.210',
    type: 'survey',
    start: 'pc_kwaliteit',
    overzicht: [
      { conditie: 'PC dof bruin, contrasterend met verse GC', resultaat: '1e kj (EURING 3)' },
      { conditie: 'PC gemengd (deels bruin, deels glanzend zwart)', resultaat: '2e of 3e kj (EURING 5/7)' },
      { conditie: 'PC egaal glanzend zwart, geen contrast', resultaat: 'Adult (EURING 6/8)' },
    ],
    stappen: {

      pc_kwaliteit: {
        id: 'pc_kwaliteit',
        label: 'PC-kwaliteit',
        type: 'keuze',
        vraag: 'Hoe zien de handpendekveren (PC) eruit?',
        toelichting: 'De kleur en kwaliteit van de PC is het betrouwbaarste leeftijdskenmerk. Vergelijk met de grote dekveren (GC): bij juvenielen zijn GC vers en contrasteren ze met de doffe bruine juv PC.',
        opties: [
          {
            waarde: 'dof',
            label: 'Dof bruin — duidelijk contrastend met verse GC en MC',
            resultaat: {
              waarde: '3',
              label: '1e kj',
              zeker: false,
              uitleg: 'Doffe, bruine PC die contrasteren met verse GC: kenmerk van juveniel kleed. P2–P10 hebben witte of lichtbeige punten. P1 steekt 5–12 mm boven de PC uit (P1–WP = 61–74).',
            },
          },
          {
            waarde: 'gemengd',
            label: 'Gemengd — sommige PC bruiner en versleten, andere glanzend zwart',
            resultaat: {
              waarde: '5',
              label: '2e kj / 3e kj',
              zeker: false,
              uitleg: 'Aangehouden bruine juv PC naast nieuwe glanzend zwarte PC duidt op 2e of 3e kj. Soms ook aangehouden juv S — meer versleten en gebleekt, lijn van witte vlekken niet recht.',
            },
          },
          {
            waarde: 'zwart',
            label: 'Egaal glanzend zwart — geen contrast',
            resultaat: {
              waarde: '6',
              label: 'Adult',
              zeker: false,
              uitleg: 'Egaal glanzend zwarte PC zonder contrast: kenmerk van adult. P2–P5 (P6) zonder witte punt. P1 steekt 3–5 mm boven de PC uit (P1–WP = 75–88).',
            },
          },
        ],
      },

    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Grote Bonte Specht — Geslachtsbepaling
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'gbs-geslacht',
    soorten: ['08760'],
    resultaat_veld: 'geslacht',
    naam: 'Geslachtsbepaling Grote Bonte Specht',
    korte_beschrijving: 'Nek: rood = ♂; zwart = ♀; juveniel vóór nekrui → kroonvlekmeting',
    bron: 'Demongin (2016) p.210',
    type: 'survey',
    start: 'nek_check',
    overzicht: [
      { conditie: 'Rood op nek (ook kleine sporen)', resultaat: '♂' },
      { conditie: 'Nek egaal blauwzwart (niet-juveniel)', resultaat: '♀' },
      {
        conditie: 'Juveniel — nekrui nog niet begonnen',
        sub: [
          { conditie: 'Kroonvlek ≥ 24 mm', resultaat: 'waarschijnlijk ♂' },
          { conditie: 'Kroonvlek < 24 mm',  resultaat: 'waarschijnlijk ♀' },
        ],
      },
    ],
    stappen: {

      nek_check: {
        id: 'nek_check',
        label: 'Nekkleur',
        type: 'keuze',
        vraag: 'Wat zie je op de nek van de vogel?',
        toelichting: 'Begin altijd met leeftijdsbepaling. Geslachtsbepaling van juvenielen vóór de nekrui is moeilijk en soms onmogelijk bij versleten kleed. Nekrui begint ca. jul in anglicus, soms pas okt in major tijdens irrupties.',
        opties: [
          {
            waarde: 'rood',
            label: 'Rode band of sporen van rood op de nek',
            resultaat: {
              waarde: 'M',
              label: '♂',
              zeker: false,
              uitleg: 'Rood op de nek is een mannenmerk — ook kleine sporen = ♂. Let op: adult ♀ kan soms enkele licht rood omrande veren hebben, maar nooit een duidelijke rode band.',
            },
          },
          {
            waarde: 'zwart_adult',
            label: 'Nek egaal blauwzwart — vogel niet in juveniel kleed',
            resultaat: {
              waarde: 'F',
              label: '♀',
              zeker: true,
              uitleg: 'Egaal blauwzwarte nek zonder rood bij een niet-juveniele vogel = ♀.',
            },
          },
          {
            waarde: 'juv',
            label: 'Juveniel kleed — rode kroon, nekrui nog niet begonnen',
            volgende: 'kroonvlek',
          },
        ],
      },

      kroonvlek: {
        id: 'kroonvlek',
        label: 'Kroonvlekmeting',
        type: 'meting',
        vraag: 'Meet de lengte van de rode kroonvlek (van voor naar achter, in mm)',
        toelichting: 'Er is overlap bij 24–25 mm (♀-range 17–25 mm, ♂-range 24–30 mm). Het resultaat is indicatief. Bij versleten kleed kan de meting minder betrouwbaar zijn.',
        inputs: [
          { key: 'kroonvlek', label: 'Rode kroonvlek (mm)', min: 5, max: 50 },
        ],
        bereken_type: 'drempelwaarde',
        bereken_config: {
          veld: 'kroonvlek',
          drempel: 24,
          resultaat_groter_gelijk: {
            waarde: 'M',
            label: '♂ (waarschijnlijk)',
            zeker: false,
            uitleg_template: 'Kroonvlek {v} mm (≥ 24 mm → waarschijnlijk ♂; ♂-range is 24–30 mm).',
          },
          resultaat_kleiner: {
            waarde: 'F',
            label: '♀ (waarschijnlijk)',
            zeker: false,
            uitleg_template: 'Kroonvlek {v} mm (< 24 mm → waarschijnlijk ♀; ♀-range is 17–25 mm).',
          },
        },
      },

    },
  },


  // ─────────────────────────────────────────────────────────────────────────
  // Middelste Bonte Specht — Leeftijdsbepaling
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'mbs-leeftijd',
    soorten: ['08830'],
    resultaat_veld: 'leeftijd',
    naam: 'Leeftijdsbepaling Middelste Bonte Specht',
    korte_beschrijving: 'PC-kwaliteit als primaire indicator; P1-projectie als bevestiging',
    bron: 'Demongin (2020) p.212',
    type: 'survey',
    start: 'pc_kwaliteit',
    overzicht: [
      { conditie: 'PC dof bruin, contrasterend met verse GC', resultaat: '1e kj (EURING 3)' },
      { conditie: 'PC gemengd: bruin juv-PC naast glanzend zwarte geruide PC', resultaat: '2e kj (EURING 5)' },
      { conditie: 'PC egaal glanzend zwart, geen contrast', resultaat: 'Adult (EURING 6)' },
    ],
    stappen: {

      pc_kwaliteit: {
        id: 'pc_kwaliteit',
        label: 'PC-kwaliteit',
        type: 'keuze',
        vraag: 'Hoe zien de handpendekveren (PC) eruit?',
        toelichting: 'De PC-kleur is het betrouwbaarste leeftijdskenmerk. Bij 1e kj zijn de PC dof bruin en contrasteren ze met verse GC. Adults hebben egaal glanzend zwarte PC zonder contrast. Overgangskleed (2e kj) toont een mix.',
        opties: [
          {
            waarde: 'dof',
            label: 'Dof bruin — contrasterend met verse GC',
            resultaat: {
              waarde: '3',
              label: '1e kj',
              zeker: false,
              uitleg: 'Doffe bruine PC die contrasteren met verse GC: kenmerk van juveniel kleed. P5–P3 doorgaans met 2 mm brede witte vlekken op de punt. P1 steekt 5–12 mm breed boven de PC uit (P1–WP = 61–67).',
            },
          },
          {
            waarde: 'gemengd',
            label: 'Gemengd — bruine juv-PC naast glanzend zwarte geruide PC',
            resultaat: {
              waarde: '5',
              label: '2e kj',
              zeker: false,
              uitleg: 'Aangehouden bruine juv-PC naast nieuwe glanzend zwarte PC. Buitenste (geruide) PC contrasteren vaak met versleten en bruinere juveniele binnenste PC. T, S en deel juv-GC zijn ook behouden.',
            },
          },
          {
            waarde: 'zwart',
            label: 'Egaal glanzend zwart — geen contrast',
            volgende: 'p1_projectie',
          },
        ],
      },

      p1_projectie: {
        id: 'p1_projectie',
        label: 'P1-projectie',
        type: 'keuze',
        vraag: 'Hoe ver steekt P1 boven de PC uit, en hoe ziet P1 eruit?',
        toelichting: 'Bij egaal zwarte PC helpt P1-projectie om adult te bevestigen. Meet de afstand van de punt van P1 tot de langste PC. Adult: P1 smal en spits, ≤ 4–4 mm boven PC.',
        opties: [
          {
            waarde: 'smal',
            label: 'P1 smal en spits, ≤ 4 mm boven PC (P1–WP = 69–80)',
            resultaat: {
              waarde: '6',
              label: 'Adult',
              zeker: false,
              uitleg: 'Egaal glanzend zwarte PC en smal/spits P1 ≤ 4 mm boven PC: adult. P5–P3 doorgaans zwart afgepunt, behalve witte rand op buitenste web. P1–WP = 69–80.',
            },
          },
          {
            waarde: 'breed',
            label: 'P1 breed, > 4 mm boven PC — twijfelachtig',
            resultaat: {
              waarde: null,
              fallback_waarde: 'U',
              label: 'Onzeker',
              zeker: false,
              uitleg: 'PC egaal zwart maar P1-projectie past niet eenduidig bij adult. Controleer of er aangehouden juv-S of versleten GC zijn die wijzen op 2e kj.',
            },
          },
        ],
      },

    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Middelste Bonte Specht — Geslachtsbepaling
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'mbs-geslacht',
    soorten: ['08830'],
    resultaat_veld: 'geslacht',
    naam: 'Geslachtsbepaling Middelste Bonte Specht',
    korte_beschrijving: 'Kruinvlekmeting (lengte + breedte); start altijd met leeftijd',
    bron: 'Demongin (2020) p.212',
    type: 'survey',
    start: 'leeftijd_check',
    overzicht: [
      { conditie: 'Kruinvlek ≥ 34 mm lang en ≥ 20 mm breed (postjuv)', resultaat: '♂ M (waarschijnlijk)' },
      { conditie: 'Kruinvlek 29–38 mm lang, roze-rood, goudbruin begrensd', resultaat: '♀ V (waarschijnlijk)' },
      { conditie: 'Juveniel: kruinvlek ≥ 24 mm', resultaat: '♂ M (indicatief)' },
      { conditie: 'Juveniel: kruinvlek ≤ 22 mm', resultaat: '♀ V (indicatief)' },
    ],
    stappen: {

      leeftijd_check: {
        id: 'leeftijd_check',
        label: 'Kleedtype',
        type: 'keuze',
        vraag: 'Is de vogel een juveniel (1e kj vóór postjuv-rui) of postjuveniel/adult?',
        toelichting: 'Begin altijd met leeftijdsbepaling. Geslachtsbepaling van juvenielen is moeilijk — de kruinvlekgrootte is klein (18–25 mm) en het onderscheid is niet absoluut.',
        opties: [
          { waarde: 'postjuv', label: 'Postjuveniel of adult (PC deels of volledig geruid)', volgende: 'kruinvlek_postjuv' },
          { waarde: 'juv',     label: 'Juveniel (PC volledig bruin, nog niet geruid)',         volgende: 'kruinvlek_juv' },
        ],
      },

      kruinvlek_postjuv: {
        id: 'kruinvlek_postjuv',
        label: 'Kruinvlek (postjuv/adult)',
        type: 'meting',
        vraag: 'Meet de lengte van de rode kruinvlek (mm)',
        toelichting: '♂ M: kruinvlek helder rood, lang (34–46 mm) en breed (20–29 mm), reikt tot achterste kruin. ♀ V: kruinvlek roze-rood (29–38 mm lang, 18–24 mm breed), begrensd door roze-bruin/goudbruin. Overlap is beperkt maar aanwezig.',
        inputs: [
          { key: 'kruinvlek', label: 'Rode kruinvlek (mm)', min: 10, max: 60 },
        ],
        bereken_type: 'drempelwaarde',
        bereken_config: {
          veld: 'kruinvlek',
          drempel: 34,
          resultaat_groter_gelijk: {
            waarde: 'M',
            label: '♂ M (waarschijnlijk)',
            zeker: false,
            uitleg_template: 'Kruinvlek {v} mm (≥ 34 mm → waarschijnlijk ♂ M; ♂ M-range 34–46 mm). Controleer ook breedte (♂ M 20–29 mm) en of vlek tot achterste kruin reikt.',
          },
          resultaat_kleiner: {
            waarde: 'F',
            label: '♀ V (waarschijnlijk)',
            zeker: false,
            uitleg_template: 'Kruinvlek {v} mm (< 34 mm → waarschijnlijk ♀ V; ♀ V-range 29–38 mm). Let op roze-rode kleur en goudbruine begrenzing op achterste kruin.',
          },
        },
      },

      kruinvlek_juv: {
        id: 'kruinvlek_juv',
        label: 'Kruinvlek (juveniel)',
        type: 'meting',
        vraag: 'Meet de lengte van de rode kruinvlek bij dit juveniel (mm)',
        toelichting: 'Geslachtsbepaling van juvenielen is indicatief (kleine steekproef in literatuur). ♂ M juv: 24–25 mm helder rood. ♀ V juv: 18–22 mm dofbruin-rood. Geen goudbruin op achterste kruin bij ♀ V juv.',
        inputs: [
          { key: 'kruinvlek_juv', label: 'Rode kruinvlek juv (mm)', min: 5, max: 40 },
        ],
        bereken_type: 'drempelwaarde',
        bereken_config: {
          veld: 'kruinvlek_juv',
          drempel: 23,
          resultaat_groter_gelijk: {
            waarde: 'M',
            label: '♂ M (indicatief)',
            zeker: false,
            uitleg_template: 'Kruinvlek {v} mm (≥ 23 mm → indicatief ♂ M; ♂ M juv-range 24–25 mm, kleine steekproef). Achterste kruin zwart met licht bruine of rode veerpunten.',
          },
          resultaat_kleiner: {
            waarde: 'F',
            label: '♀ V (indicatief)',
            zeker: false,
            uitleg_template: 'Kruinvlek {v} mm (< 23 mm → indicatief ♀ V; ♀ V juv-range 18–22 mm, kleine steekproef). Geen goudbruin op achterste kruin.',
          },
        },
      },

    },
  },

];
