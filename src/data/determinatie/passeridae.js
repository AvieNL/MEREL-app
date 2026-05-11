/**
 * Determinatiehulpen voor Passeridae (mussen)
 * EURING-codes: Huismus = 15910 (Passer domesticus)
 */

function datumNaarPeriode(datumStr) {
  if (!datumStr) return null;
  const maand = new Date(datumStr).getMonth() + 1; // 1–12
  return maand >= 1 && maand <= 5 ? 'jan_mei' : 'jun_dec';
}

export const passeridae = [

  // ─────────────────────────────────────────────────────────────────────────
  // Huismus — Leeftijdsbepaling
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'huismus-leeftijd',
    soorten: ['15910'],
    resultaat_veld: 'leeftijd',
    naam: 'Leeftijdsbepaling Huismus',
    korte_beschrijving: 'NJ: P1 afstand · VJ: MC kleur (♂ M), ♀ V niet te bepalen',
    bron: 'Demongin (2016) p.353–354',
    type: 'survey',
    start: 'seizoen',
    overzicht: [
      { conditie: 'VJ ♂ M: MC1–MC8 prox. helft zwart, dist. helft wit; smalle bruine alula 2 zoom', resultaat: '1e kj / 2e kj (3/5) ♂ M' },
      { conditie: 'VJ ♂ M: MC1–MC8 vrijwel volledig wit; brede roestbruine alula 2 zoom', resultaat: 'na 1e kj / na 2e kj (4/6) ♂ M' },
      { conditie: 'NJ in rui: P1 ≤ 0–5 mm boven PC, relatief fris', resultaat: '1e kj (3) — voorzichtig' },
      { conditie: 'NJ in rui: P1 ≤ 5–9 mm boven PC, sterk versleten', resultaat: 'na 1e kj (4) — voorzichtig' },
    ],
    stappen: {

      seizoen: {
        id: 'seizoen',
        label: 'Seizoen',
        type: 'keuze',
        uit_formulier: 'vangstdatum',
        transform: datumNaarPeriode,
        vraag: 'In welk seizoen is de vogel gevangen?',
        toelichting: 'Leeftijdsbepaling is sterk seizoensafhankelijk. In het najaar is het zeer moeilijk vanwege het verlengde broedseizoen. In het voorjaar kunnen ♂ M goed worden ingedeeld via MC-kleur; ♀ V zijn niet te ouderdomsbepalen na de postjuv-rui.',
        opties: [
          { waarde: 'jun_dec', label: 'Zomer / najaar (jun–dec)', volgende: 'actieve_rui' },
          { waarde: 'jan_mei', label: 'Voorjaar (jan–mei)', volgende: 'geslacht_vj' },
        ],
      },

      // ── Najaar-pad ──────────────────────────────────────────────────────

      actieve_rui: {
        id: 'actieve_rui',
        label: 'Actieve rui?',
        type: 'keuze',
        vraag: 'Zijn de buitenste handpennen (P) nog actief aan het groeien?',
        toelichting: 'De P1-afstand tot PC (handpendekveren) is alleen bruikbaar als de buitenste P nog actief groeien. Rui van Huismus loopt sterk uiteen door lang broedseizoen.',
        opties: [
          {
            waarde: 'ja',
            label: 'Ja — buitenste P nog actief groeiend',
            volgende: 'p1_afstand',
          },
          {
            waarde: 'nee',
            label: 'Nee — rui klaar of nog niet begonnen',
            resultaat: {
              waarde: null,
              fallback_waarde: 'U',
              label: 'Niet te bepalen',
              zeker: false,
              uitleg: 'Zonder actieve rui is leeftijdsbepaling in het najaar niet mogelijk. Na afloop van de postjuv-rui is 1e kj niet meer te onderscheiden van adult (♀ V) of alleen via MC-kleur in het voorjaar (♂ M). Vroeg in het seizoen (aug): naakte buik + fris verenkleed = 3J.',
            },
          },
        ],
      },

      p1_afstand: {
        id: 'p1_afstand',
        label: 'P1 afstand tot PC',
        type: 'keuze',
        vraag: 'Hoe ver steekt P1 (buitenste nog groeiende handpen) uit boven de PC (handpendekveren)?',
        toelichting: 'Meet de afstand van de punt van P1 tot de langste bijbehorende PC. Een korte afstand wijst op relatief frisse groei (1e kj); een langere afstand op sterk versleten veren (adult). Criterium voorzichtig gebruiken: enige overlap aanwezig.',
        opties: [
          {
            waarde: 'kort',
            label: 'P1 ≤ 0–5 mm boven PC — relatief fris verenkleed',
            resultaat: {
              waarde: '3',
              label: '1e kj (voorzichtig)',
              zeker: false,
              uitleg: 'P1 ≤ 5 mm boven PC bij actieve rui wijst voorzichtig op 1e kj (3). Fris verenkleed past bij een vogel die pas is begonnen te ruien. Let op: leeftijdsbepaling in het najaar is zeer moeilijk; enige overlap aanwezig.',
            },
          },
          {
            waarde: 'lang',
            label: 'P1 ≤ 5–9 mm boven PC — sterk versleten verenkleed',
            resultaat: {
              waarde: '4',
              label: 'na 1e kj (voorzichtig)',
              zeker: false,
              uitleg: 'P1 ≤ 5–9 mm boven PC bij actieve rui wijst voorzichtig op na 1e kj (4). Sterk versleten verenkleed past bij een vogel die al langere tijd gedragen veren heeft. Let op: leeftijdsbepaling in het najaar is zeer moeilijk.',
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
              uitleg: 'Leeftijdsbepaling niet mogelijk op basis van P1-afstand. Leeftijdsbepaling in het najaar is bij Huismus zeer moeilijk vanwege het verlengde broedseizoen.',
            },
          },
        ],
      },

      // ── Voorjaar-pad ────────────────────────────────────────────────────

      geslacht_vj: {
        id: 'geslacht_vj',
        label: 'Geslacht (voorjaar)',
        type: 'keuze',
        vraag: 'Is de vogel een ♂ M?',
        toelichting: 'Leeftijdsbepaling via MC-kleur is alleen mogelijk bij ♂ M. ♀ V zijn na de postjuv-rui niet meer te ouderdomsbepalen (EURING leeftijdscode 2 — volgroeid).',
        opties: [
          {
            waarde: 'M',
            label: '♂ M',
            volgende: 'mc_kleur',
          },
          {
            waarde: 'F',
            label: '♀ V',
            resultaat: {
              waarde: '2',
              label: 'Volgroeid (niet nader te bepalen)',
              zeker: false,
              uitleg: '♀ V Huismus is na de postjuv-rui niet meer te ouderdomsbepalen: er is geen verschil in verenkleed. EURING leeftijdscode 2 (volgroeid).',
            },
          },
          {
            waarde: 'onzeker',
            label: 'Geslacht niet vastgesteld',
            resultaat: {
              waarde: null,
              fallback_waarde: 'U',
              label: 'Niet te bepalen',
              zeker: false,
              uitleg: 'Leeftijdsbepaling via MC-kleur vereist dat het geslacht eerst wordt vastgesteld.',
            },
          },
        ],
      },

      mc_kleur: {
        id: 'mc_kleur',
        label: 'MC kleur (voorjaar ♂ M)',
        type: 'keuze',
        vraag: 'Hoe zijn de middelste vleugeldekveren (MC1–MC8) van kleur?',
        toelichting: 'Dit criterium werkt bij >80% van de ♂ M. Kijk naar de verhouding zwart/wit op de MC. Bij imm ♂ M is de proximale helft zwart en de distale helft wit, met een vrijwel zwarte schacht. Bij ad ♂ M zijn de MC vrijwel volledig wit, met de schacht zonder zwart in het distale deel. Beoordeel ook alula 2: smalle bruine zoom = imm, brede roestbruine zoom = ad.',
        opties: [
          {
            waarde: 'prox_zwart',
            label: 'MC1–MC8: proximale helft zwart, distale helft wit (schacht vrijwel zwart). Smalle bruine zoom op alula 2',
            resultaat: {
              waarde: '3',
              label: '1e kj / 2e kj ♂ M',
              zeker: false,
              uitleg: 'Zwart op de proximale helft van MC1–MC8 en smalle bruine zoom op alula 2 duiden op imm ♂ M (1e kj/2e kj, EURING 3/5). Kop minder intens: kroon grijsbruin, lores donkergrijs (veranderend met slijtage). Grootte van de bef neigt toe te nemen met leeftijd.',
            },
          },
          {
            waarde: 'vrijwel_wit',
            label: 'MC1–MC8: vrijwel volledig wit (distale schacht zonder zwart). Brede roestbruine zoom op alula 2',
            resultaat: {
              waarde: '4',
              label: 'na 1e kj / na 2e kj ♂ M',
              zeker: false,
              uitleg: 'Vrijwel volledig witte MC1–MC8 en brede roestbruine zoom op alula 2 duiden op ad ♂ M (na 1e kj/na 2e kj, EURING 4/6). Kop meer intens: kroon grijs, lores zwart (vervaagd in vers verenkleed).',
            },
          },
          {
            waarde: 'onzeker',
            label: 'Intermediair of niet te beoordelen',
            resultaat: {
              waarde: null,
              fallback_waarde: 'U',
              label: 'Niet te bepalen',
              zeker: false,
              uitleg: 'Intermediaire MC-kleur. Dit kan voorkomen bij ~20% van de ♂ M. Leeftijd niet met zekerheid vast te stellen.',
            },
          },
        ],
      },

    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Huismus — Geslachtsbepaling
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'huismus-geslacht',
    soorten: ['15910'],
    resultaat_veld: 'geslacht',
    naam: 'Geslachtsbepaling Huismus',
    korte_beschrijving: 'Keel/bovenborst kleur + LC en wangenkleur',
    bron: 'Demongin (2016) p.353',
    type: 'survey',
    start: 'keel_kleur',
    overzicht: [
      { conditie: 'Kin/keel/bovenborst zwart (of gemasked door bleke puntveren)', resultaat: '♂ M' },
      { conditie: 'LC en zijkanten kop roestbruin', resultaat: '♂ M' },
      { conditie: 'Kin/keel/bovenborst gelbwit; geen roestbruin', resultaat: '♀ V' },
    ],
    stappen: {

      keel_kleur: {
        id: 'keel_kleur',
        label: 'Keel en bovenborst',
        type: 'keuze',
        vraag: 'Hoe zijn kin, keel en bovenborst van kleur?',
        toelichting: 'Na de postjuv-rui is geslachtsbepaling duidelijk. In fris verenkleed kan het zwart bij ♂ M gemasked zijn door bleke puntveren — blaas de veren uit elkaar voor een goed oordeel. LC en zijkanten kop zijn bij ♂ M roestbruin. ♀ V heeft geen roestbruin in het verenkleed.',
        opties: [
          {
            waarde: 'zwart',
            label: 'Zwart — of gemasked door bleke puntveren in fris verenkleed',
            resultaat: {
              waarde: 'M',
              label: '♂ M',
              zeker: true,
              uitleg: 'Zwarte kin, keel en bovenborst (bef) zijn kenmerkend voor ♂ M. In fris verenkleed gemasked door bleke puntveren. LC en zijkanten kop roestbruin. Mantel en scapulars met roestbruin.',
            },
          },
          {
            waarde: 'gelbwit',
            label: 'Gelbwit of witachtig — zonder zwart',
            resultaat: {
              waarde: 'F',
              label: '♀ V',
              zeker: true,
              uitleg: 'Gelbwitte kin, keel en bovenborst zonder roestbruin in het verenkleed duiden op ♀ V. Kroon en nek dof grijsbruin met olijftint. Juv ♀ V heeft keel witachtig of zuiver wit, zonder grijs. Let op: ♀ V Huismus is niet te scheiden van ♀ V Spaanse Mus.',
            },
          },
          {
            waarde: 'onzeker',
            label: 'Niet te beoordelen — juveniel in vroege rui',
            resultaat: {
              waarde: null,
              fallback_waarde: 'U',
              label: 'Niet te bepalen',
              zeker: false,
              uitleg: 'Bij juv ♂ M (3J M) soms een donkergrijs spoor op het basale deel van de keelveren — maar dit criterium is onbetrouwbaar in ~10% van de gevallen. Groeiende LC worden roestbruin bij ♂ M in laat aug–sep.',
            },
          },
        ],
      },

    },
  },

];
