/**
 * seed-pimpelmees-determinatie.js
 * Laad determinatiehulpen voor Pimpelmees (14620) in Supabase.
 * Bron: Demongin (2016) p.326–327
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const aids = [

  // ── Leeftijdsbepaling ──────────────────────────────────────────────────────
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

  // ── Geslachtsbepaling ─────────────────────────────────────────────────────
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

// ── Upsert naar Supabase ──────────────────────────────────────────────────────
const rows = aids.map(aid => ({ id: aid.id, data: aid }));

const { error } = await sb.from('determinatie_aid').upsert(rows);

if (error) {
  console.error('Upsert mislukt:', error.message);
  process.exit(1);
}

for (const aid of aids) {
  console.log(`✓ ${aid.naam} (${aid.id})`);
}
console.log('\n✓ Pimpelmees determinatiehulpen opgeslagen in Supabase');
