/**
 * Determinatiehulpen voor Paridae (mezen)
 * EURING-codes: Pimpelmees = 14620 (Cyanistes caeruleus)
 *               Koolmees   = 14640 (Parus major)
 */

export const paridae = [

  // ─────────────────────────────────────────────────────────────────────────
  // Pimpelmees — Leeftijdsbepaling
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'pimpelmees-leeftijd',
    soorten: ['14620'],
    resultaat_veld: 'leeftijd',
    naam: 'Leeftijdsbepaling Pimpelmees',
    korte_beschrijving: 'Wangenkleur → PC-kleur t.o.v. GC',
    bron: 'Demongin (2016) p.326–327',
    type: 'survey',
    start: 'wangen',
    overzicht: [
      { conditie: 'Wangen duidelijk lichtgeel', resultaat: 'Juveniel vóór rui (EURING 3J)' },
      { conditie: 'PC dof blauwgrijs / groenig, contrasterend met helder blauwe GC', resultaat: '1e kj na/in rui (EURING 3/5)' },
      { conditie: 'PC uniform helder blauw, geen contrast met GC', resultaat: 'Adult (EURING 4/6)' },
    ],
    stappen: {

      wangen: {
        id: 'wangen',
        label: 'Wangenkleur',
        type: 'keuze',
        vraag: 'Hoe zien de wangen eruit?',
        toelichting: 'Jonge vogels vóór de postjuveniele rui hebben duidelijk lichtgele wangen. Na de rui worden de wangen wit. Tijdens en kort na de rui kunnen ze nog licht geel zijn.',
        opties: [
          {
            waarde: 'geel',
            label: 'Duidelijk lichtgeel',
            resultaat: {
              waarde: '3',
              label: 'Juveniel vóór rui',
              zeker: false,
              uitleg: 'Duidelijk lichtgele wangen duiden op een juveniel vóór de postjuveniele rui. Kroon dof blauwgrijs.',
            },
          },
          {
            waarde: 'wit',
            label: 'Wit of bijna wit',
            volgende: 'pc_kleur',
          },
        ],
      },

      pc_kleur: {
        id: 'pc_kleur',
        label: 'PC-kleur vs. GC',
        type: 'keuze',
        vraag: 'Vergelijk de kleur van de handpendekveren (PC) met de grote armdekveren (GC) op het buitenweb.',
        toelichting: 'Na de postjuveniele rui blijven de juv PC aangehouden. Deze zijn doffer en grijzer dan de vers gemoulte GC. Let op: slijtage kan dit contrast bij vogels uit zuidelijke populaties onbruikbaar maken.',
        opties: [
          {
            waarde: 'contrast',
            label: 'PC dof blauwgrijs (soms groenig getint) — contrasterend met helder blauwe GC',
            resultaat: {
              waarde: '3',
              label: '1e kj',
              zeker: false,
              uitleg: 'Aangehouden juv PC zijn doffer en grijzer (soms groenig getint) dan de vers gemoulte GC. Soms ook contrast tussen juv buitenste GC en gemoulte binnenste GC, of tussen gemoulte alula/CC en juv PC. TF1 vaak gemoult en meer afgerond.',
            },
          },
          {
            waarde: 'uniform',
            label: 'PC en GC gelijkmatig helder blauw — geen contrast',
            resultaat: {
              waarde: '4',
              label: 'Adult',
              zeker: false,
              uitleg: 'Buitenweb van GC, PC, CC en alula gelijkmatig helder blauw. Geen ruigrens in T, TE of S.',
            },
          },
          {
            waarde: 'onzeker',
            label: 'Niet te beoordelen (sterk versleten of zuidelijke populatie)',
            resultaat: {
              waarde: null,
              fallback_waarde: 'U',
              label: 'Niet te bepalen',
              zeker: false,
              uitleg: 'Bij sterk versleten vogels of vogels uit zuidelijke populaties kan slijtage het contrast onbruikbaar maken. Leeftijd niet met zekerheid vast te stellen op basis van dit kenmerk.',
            },
          },
        ],
      },

    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Pimpelmees — Geslachtsbepaling
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'pimpelmees-geslacht',
    soorten: ['14620'],
    resultaat_veld: 'geslacht',
    naam: 'Geslachtsbepaling Pimpelmees',
    korte_beschrijving: 'BP/uitstekende cloaca → dekverenkleur',
    bron: 'Demongin (2016) p.326–327',
    type: 'survey',
    start: 'bp_cp',
    overzicht: [
      { conditie: 'Broedvlek aanwezig', resultaat: '♀ (zeker)' },
      { conditie: 'Uitstekende cloaca', resultaat: '♂ (zeker)' },
      { conditie: 'Alle postjuv dekveren intensief donkerblauw', resultaat: '♂ (waarschijnlijk)' },
      { conditie: 'Alle postjuv dekveren grijsachtig middelblauw', resultaat: '♀ (waarschijnlijk)' },
    ],
    stappen: {

      bp_cp: {
        id: 'bp_cp',
        label: 'Broedvlek / uitstekende cloaca',
        type: 'keuze',
        vraag: 'Is er een broedvlek (BP) of uitstekende cloaca aanwezig?',
        toelichting: 'Broedvlek en uitstekende cloaca zijn de betrouwbaarste geslachtsindicatoren. Controleer dit altijd als eerste.',
        opties: [
          {
            waarde: 'bp',
            label: 'Broedvlek aanwezig',
            resultaat: {
              waarde: 'F',
              label: '♀',
              zeker: true,
              uitleg: 'Een broedvlek is een betrouwbare indicator voor het vrouwelijk geslacht.',
            },
          },
          {
            waarde: 'cp',
            label: 'Uitstekende cloaca',
            resultaat: {
              waarde: 'M',
              label: '♂',
              zeker: true,
              uitleg: 'Een uitstekende cloaca is een betrouwbare indicator voor het mannelijk geslacht.',
            },
          },
          {
            waarde: 'geen',
            label: 'Geen van beide',
            volgende: 'dekveren_kleur',
          },
        ],
      },

      dekveren_kleur: {
        id: 'dekveren_kleur',
        label: 'Dekverenkleur',
        type: 'keuze',
        vraag: 'Wat is de kleur van de postjuveniele dekveren (C)?',
        toelichting: 'De kleur van de dekveren na de postjuveniele rui is het voornaamste geslachtskenmerk. Bij ♂ zijn de dekveren intensief donkerblauw; bij ♀ grijsachtig middelblauw. Randen van handpennen, stuurpennen en kroondekveertjes zijn bij ♂ intensiever en doorgaans donkerder blauw dan bij ♀. Let op: ♀ van ssp. ogliastrae kan soms even opvallend zijn als ♂.',
        opties: [
          {
            waarde: 'donkerblauw',
            label: 'Intensief donkerblauw',
            resultaat: {
              waarde: 'M',
              label: '♂ (waarschijnlijk)',
              zeker: false,
              uitleg: 'Intensief donkerblauwe postjuv dekveren duiden op ♂. Randen van handpennen, stuurpennen en kroondekveertjes intensiever en doorgaans donkerder blauw.',
            },
          },
          {
            waarde: 'grijsblauw',
            label: 'Grijsachtig middelblauw',
            resultaat: {
              waarde: 'F',
              label: '♀ (waarschijnlijk)',
              zeker: false,
              uitleg: 'Grijsachtig middelblauwe postjuv dekveren duiden op ♀. Randen van handpennen, stuurpennen en kroondekveertjes grijzer en lichter blauw dan bij ♂.',
            },
          },
          {
            waarde: 'tussenin',
            label: 'Tussenin — niet duidelijk te plaatsen',
            resultaat: {
              waarde: null,
              fallback_waarde: 'U',
              label: 'Niet te bepalen',
              zeker: false,
              uitleg: 'Vleugellengte alleen bruikbaar bij uiterste waarden. Geslacht niet met zekerheid vast te stellen op basis van dit kenmerk alleen.',
            },
          },
        ],
      },

    },
  },

];

// ─────────────────────────────────────────────────────────────────────────────
// Koolmees — Leeftijdsbepaling
// ─────────────────────────────────────────────────────────────────────────────
paridae.push({
  id: 'koolmees-leeftijd',
  soorten: ['14640'],
  resultaat_veld: 'leeftijd',
  naam: 'Leeftijdsbepaling Koolmees',
  korte_beschrijving: 'Wangenkleur → PC-kleur t.o.v. GC',
  bron: 'Demongin (2016) p.328',
  type: 'survey',
  start: 'wangen',
  overzicht: [
    { conditie: 'Wangen lichtgeel, niet omgeven door zwart', resultaat: '1e kj, deels in jeugdkleed (3J)' },
    { conditie: 'PC dof blauwachtig groenig-grijs, contrasterend met GC', resultaat: '1e kj (3)' },
    { conditie: 'PC uniform blauw als GC, geen contrast', resultaat: 'na 1e kj (4)' },
  ],
  stappen: {

    wangen: {
      id: 'wangen',
      label: 'Wangenkleur',
      type: 'keuze',
      vraag: 'Hoe zien de wangen eruit?',
      toelichting: 'Jonge Koolmezen vóór de postjuveniele rui hebben lichtgele wangen die niet omgeven zijn door zwart. Na de rui worden de wangen wit en omgeven door zwart.',
      opties: [
        {
          waarde: 'geel',
          label: 'Lichtgeel — niet omgeven door zwart',
          resultaat: {
            waarde: '3',
            label: '1e kj, deels in jeugdkleed',
            zeker: false,
            uitleg: 'Lichtgele wangen, niet omgeven door zwart, duiden op een juveniel vóór de postjuveniele rui. Kroon dof zwart. Onderzijde dof geel; middenstreep onduidelijk.',
          },
        },
        {
          waarde: 'wit',
          label: 'Wit — omgeven door zwart',
          volgende: 'pc_kleur',
        },
      ],
    },

    pc_kleur: {
      id: 'pc_kleur',
      label: 'PC-kleur vs. GC',
      type: 'keuze',
      vraag: 'Vergelijk de kleur van de handpendekveren (PC) met de middelste armdekveren (MC) en grote armdekveren (GC).',
      toelichting: 'Na de postjuveniele rui blijven de juv PC aangehouden. Deze zijn doffer en groenig-grijs van kleur, terwijl de vers gemoulte GC en MC blauwgrijs zijn. Contrast duidelijker bij ♂ M dan bij ♀ V. Let op: bij oostelijke individuen kan het contrast moeilijker te beoordelen zijn.',
      opties: [
        {
          waarde: 'contrast',
          label: 'PC dof blauwachtig groenig-grijs — contrasterend met dieper blauwgrijs GC/MC',
          resultaat: {
            waarde: '3',
            label: '1e kj',
            zeker: false,
            uitleg: 'Dof groenig-grijze juv PC die contrasteren met de blauwgrijze GC en MC duiden op 1e kj. Juv TF en T vaak meer versleten dan bij na 1e kj (4); PC meer puntig. Iris donkerbruin, soms grijsachtig getint.',
          },
        },
        {
          waarde: 'uniform',
          label: 'PC en GC vrijwel gelijk blauw — geen of nauwelijks contrast',
          resultaat: {
            waarde: '4',
            label: 'na 1e kj',
            zeker: false,
            uitleg: 'Geen contrast tussen PC en GC duidt op na 1e kj (4). PC meer afgerond. Iris helder bruin met roodachtige tint. Let op: uitzonderlijk kunnen wangen iets geel zijn bij na 1e kj (4).',
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
            uitleg: 'Bij sommige individuen (m.n. oostelijke herkomst of sterk versleten) is het contrast niet betrouwbaar te beoordelen. Leeftijd niet met zekerheid vast te stellen.',
          },
        },
      ],
    },

  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Koolmees — Geslachtsbepaling
// ─────────────────────────────────────────────────────────────────────────────
paridae.push({
  id: 'koolmees-geslacht',
  soorten: ['14640'],
  resultaat_veld: 'geslacht',
  naam: 'Geslachtsbepaling Koolmees',
  korte_beschrijving: 'BP → buikvlek breedte en kleur',
  bron: 'Demongin (2016) p.328',
  type: 'survey',
  start: 'bp',
  overzicht: [
    { conditie: 'Broedvlek aanwezig', resultaat: '♀ V (zeker)' },
    { conditie: 'Buikvlek breed, helder zwart', resultaat: '♂ M (waarschijnlijk)' },
    { conditie: 'Buikvlek smal, mat zwartgrijs, soms onderbroken', resultaat: '♀ V (waarschijnlijk)' },
  ],
  stappen: {

    bp: {
      id: 'bp',
      label: 'Broedvlek',
      type: 'keuze',
      vraag: 'Is er een broedvlek aanwezig?',
      toelichting: 'Beoordeel de buikvlek en het zwart vóór het blazen van veren.',
      opties: [
        {
          waarde: 'ja',
          label: 'Broedvlek aanwezig',
          resultaat: {
            waarde: 'F',
            label: '♀ V',
            zeker: true,
            uitleg: 'Een broedvlek is een betrouwbare indicator voor het vrouwelijk geslacht.',
          },
        },
        {
          waarde: 'nee',
          label: 'Geen broedvlek',
          volgende: 'buikvlek',
        },
      ],
    },

    buikvlek: {
      id: 'buikvlek',
      label: 'Buikvlek',
      type: 'keuze',
      vraag: 'Hoe ziet de zwarte middenstreep / buikvlek eruit?',
      toelichting: 'Beoordeel vóór het blazen van veren. Bij ♂ M vormt de streep een brede zwarte vlek op de buik tussen de benen. Bij ♀ V is de streep smal en mat, soms onderbroken. Soms moeilijk te beoordelen.',
      opties: [
        {
          waarde: 'breed',
          label: 'Helder blauwachtig-zwart, breed — vormt brede vlek tussen benen',
          resultaat: {
            waarde: 'M',
            label: '♂ M (waarschijnlijk)',
            zeker: false,
            uitleg: 'Brede, heldere buikvlek met blauwachtig-zwarte kleur duidt op ♂ M. Bij 1e kj ♂ M (3) soms met witte randen. Kroon en keel helder blauwachtig-zwart.',
          },
        },
        {
          waarde: 'smal',
          label: 'Mat zwartgrijs, smal op borst — soms onderbroken; vlek tussen benen klein, gemengd met wit',
          resultaat: {
            waarde: 'F',
            label: '♀ V (waarschijnlijk)',
            zeker: false,
            uitleg: 'Smalle, matte buikvlek met grijsachtige kleur duidt op ♀ V. Vlek tussen benen klein, gemengd met witachtig. Postjuv dekveren gewoonlijk minder blauw dan bij ♂ M.',
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
            uitleg: 'Geslacht niet met zekerheid vast te stellen op basis van buikvlek alleen. Geslachtsbepaling van Koolmees is soms moeilijk door diverse mogelijke oorzaken.',
          },
        },
      ],
    },

  },
});
