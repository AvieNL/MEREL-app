/**
 * update-krullevaar-data.js
 * Voegt de Krullevaar (EURING 00001) toe aan Supabase.
 * 🐦 Easter egg — Ciconia pettefletensis
 * Bron: Schmidt, A.M.G. (1971). Pluk van de Petteflet. Em. Querido's Uitgeverij.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const data = {
  naam_nl:  'Krullevaar',
  naam_lat: 'Ciconia pettefletensis',
  naam_en:  'Curly Stork',
  naam_de:  'Kräuselstorch',
  naam_fr:  'Cigogne frisée',
  naam_es:  'Cigüeña rizada',

  ringmaat: 'Geen',
  ruitype:  'Onbekend',

  // Biometrie — bron: eigen waarneming vanuit de lift
  bio_vleugel_M_min: 310, bio_vleugel_M_max: 312,
  bio_vleugel_F_min: 310, bio_vleugel_F_max: 312,
  bio_gewicht_M_min: 1800, bio_gewicht_M_max: 4200,
  bio_gewicht_F_min: 1800, bio_gewicht_F_max: 4200,
  bio_tarsus_lengte_M_min: 198, bio_tarsus_lengte_M_max: 203,
  bio_tarsus_lengte_F_min: 198, bio_tarsus_lengte_F_max: 203,

  // Pennenstructuur
  pennen_structuur: {
    wp: 'P1',
    hp: 10,
    hp_note: 'Veren worden door Pluk bijgeknipt',
    sp: 12,
  },

  // Rui
  rui_notities:
    '**Krullevaar** Geen rui geregistreerd. Nieuwe veren worden incidenteel door Pluk bijgeknipt met de keukenschaar. Tijdstip onbekend, vermoedelijk na de maaltijd.',

  // Leeftijdsbepaling
  leeftijds_notities_nj: '',
  leeftijds_notities_vj:
    'Leeftijd niet bepaalbaar. De Krullevaar woont al in de Petteflet zolang de Petteflet bestaat. ' +
    'Iris: geel met een welwillende blik. Geen juveniel verenkleed ooit waargenomen.',

  // Geslacht
  geslachts_notities_m:
    '- De Krullevaar heeft zich nooit uitgesproken over zijn geslacht\n' +
    '- Geen betrouwbaar visueel kenmerk\n' +
    '- Vleugelmeting niet representatief — pas op voor lift',

  geslachts_notities_f:
    '- Zie ♂ M — zelfde situatie',

  // Determinatie
  determinatie_id_notities:
    'Onverwisselbaar. Krul op de kop is diagnostisch. Vleugels opvallend groot voor een appartementsbewoner.\n\n' +
    '**Verwisseling**\n\n' +
    'Verwar niet met gewone Ooievaar _Ciconia ciconia_ — die woont buiten. ' +
    'Verwar ook niet met de Kraanvogel _Grus grus_: de Krullevaar heeft een vaste woonadres.',

  // Ondersoorten
  ondersoorten:
    '**pettefletensis** (zolder, Petteflet, Ottocar Stamstraat): Nominaatvorm. Enige bekende broedvogel van dit adres.\n\n' +
    '**terrasformis** (platte daken, grote steden): Zeldzaam. Overwinteraar. Wordt soms verward met een schotelantenne.',

  // Nestgegevens
  eerste_broedleeftijd: 'Onbekend',

  // Bron
  bron_biometrie:         'Schmidt, A.M.G. (1971). Pluk van de Petteflet. Em. Querido\'s Uitgeverij.',
  bron_leeftijdsbepaling: 'Schmidt, A.M.G. (1971). Pluk van de Petteflet.',
  bron_geslacht:          'Schmidt, A.M.G. (1971). Pluk van de Petteflet.',
  bron_id_kenmerken:      'Schmidt, A.M.G. (1971). Pluk van de Petteflet.',
  bron_ondersoorten:      'Schmidt, A.M.G. (1971). Pluk van de Petteflet.',
  bron_ring:              'Geen ring. Woont al op een vast adres.',

  // Vangst-checklist
  vangst_checklist: [
    { label: 'Vraag of Pluk thuis is',        type: 'obs', belang: 3 },
    { label: 'Controleer of de lift werkt',   type: 'obs', belang: 3 },
    { label: 'Noteer aanwezigheid van Dolly', type: 'obs', belang: 2 },
    { label: 'Tarsus',                        type: 'meting', belang: 1, note: 'Past net op de vensterbank' },
    { label: 'Gewicht',                       type: 'meting', belang: 1, note: 'Varieert sterk afhankelijk van wat Pluk heeft gekookt' },
  ],

  // Literatuur
  referenties_literatuur: [
    'Schmidt, A.M.G. (1971). Pluk van de Petteflet. Em. Querido\'s Uitgeverij.',
    'Blok, C. (ill.) (1971). Pluk van de Petteflet — Illustraties.',
  ],
};

const { error } = await sb.from('species').upsert({
  euring_code: '00001',
  naam_nl: 'Krullevaar',
  data,
});

if (error) { console.error('Upsert mislukt:', error.message); process.exit(1); }
console.log('🐦 Krullevaar (00001) toegevoegd aan Supabase. Pluk is blij.');
