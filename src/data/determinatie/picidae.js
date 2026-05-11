/**
 * Determinatiehulpen voor Picidae (spechten)
 * EURING-codes: Grote Bonte Specht = 08760 (Dendrocopos major)
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

];
