/**
 * fix-cp-naar-cloaca.js
 * Vervangt "CP" door "cloaca" in soortdata en determinatiehulpen in Supabase.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// ── Vervanging in een string ───────────────────────────────────────────────────
function fixStr(s) {
  if (typeof s !== 'string') return s;
  return s
    .replace(/CP \(uitstekende cloaca\) soms aanwezig\./g, 'Uitstekende cloaca soms aanwezig.')
    .replace(/uitstekende cloaca \(CP\)/g, 'uitstekende cloaca')
    .replace(/Uitstekende cloaca \(CP\)/g, 'Uitstekende cloaca')
    .replace(/cloaca-uitstulping \(CP\)/g, 'uitstekende cloaca')
    .replace(/BP en CP zijn betrouwbare/g, 'BP en uitstekende cloaca zijn betrouwbare')
    .replace(/BP en CP betrouwbaar\./g, 'BP en cloaca betrouwbaar.')
    .replace(/BP\/CP betrouwbaar/g, 'BP/cloaca betrouwbaar')
    .replace(/BP \/ CP\b/g, 'BP / cloaca')
    .replace(/Geen BP of CP\b/g, 'Geen BP of cloaca')
    .replace(/CP helpt het geslacht/g, 'Uitstekende cloaca helpt het geslacht')
    .replace(/Zonder broedvlek is CP het/g, 'Zonder broedvlek is uitstekende cloaca het')
    .replace(/Zonder broedvlek of CP is/g, 'Zonder broedvlek of uitstekende cloaca is')
    .replace(/bevestiging via CP geeft/g, 'bevestiging via uitstekende cloaca geeft')
    .replace(/aanwezigheid van CP wijst/g, 'aanwezigheid van uitstekende cloaca wijst')
    .replace(/Kleine broedvlek \+ CP wijst/g, 'Kleine broedvlek + uitstekende cloaca wijst')
    .replace(/vascularisatie en CP is/g, 'vascularisatie en uitstekende cloaca is')
    .replace(/Let op: CP kan moeilijk/g, 'Let op: cloaca kan soms moeilijk')
    .replace(/CP kan moeilijk te beoordelen zijn/g, 'cloaca kan soms moeilijk te beoordelen zijn')
    .replace(/Ja, CP aanwezig/g, 'Ja, uitstekende cloaca aanwezig')
    .replace(/^CP \(na kleine BP\)$/g, 'Cloaca (na kleine BP)')
    .replace(/^CP \(geen broedvlek\)$/g, 'Cloaca (geen broedvolk)')
    .replace(/\bCP\b/g, 'cloaca');
}

// ── Recursief alle strings in een object fixen ────────────────────────────────
function fixObj(obj) {
  if (typeof obj === 'string') return fixStr(obj);
  if (Array.isArray(obj)) return obj.map(fixObj);
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) out[k] = fixObj(v);
    return out;
  }
  return obj;
}

// ── Species data ──────────────────────────────────────────────────────────────
const speciesUpdates = [
  {
    euring: '15600',
    fix: d => {
      d.geslachts_notities_m = fixStr(d.geslachts_notities_m);
      return d;
    },
  },
  {
    euring: '13490',
    fix: d => {
      // Regel was niet in de bron → verwijderen
      if (d.geslachts_notities_m) {
        d.geslachts_notities_m = d.geslachts_notities_m
          .split('\n')
          .filter(line => !/uitstekende cloaca soms aanwezig|CP.*soms aanwezig/i.test(line))
          .join('\n')
          .replace(/\n{3,}/g, '\n\n')
          .trim();
      }
      return d;
    },
  },
  {
    euring: '16490',
    fix: d => {
      d.geslachts_notities_m = fixStr(d.geslachts_notities_m);
      d.geslachts_notities_f = fixStr(d.geslachts_notities_f);
      if (Array.isArray(d.vangst_checklist)) {
        d.vangst_checklist = d.vangst_checklist.map(item => ({
          ...item,
          label: fixStr(item.label),
          note: item.note ? fixStr(item.note) : item.note,
        }));
      }
      return d;
    },
  },
];

for (const { euring, fix } of speciesUpdates) {
  const { data: row, error: fetchErr } = await sb.from('species')
    .select('euring_code, naam_nl, data')
    .eq('euring_code', euring)
    .single();
  if (fetchErr) { console.error(`Ophalen ${euring} mislukt:`, fetchErr.message); continue; }

  const newData = fix({ ...row.data });
  const { error } = await sb.from('species').upsert({ euring_code: row.euring_code, naam_nl: row.naam_nl, data: newData });
  if (error) { console.error(`Upsert ${euring} mislukt:`, error.message); continue; }
  console.log(`✓ Species ${row.naam_nl} (${euring}) gecorrigeerd`);
}

// ── Determinatie aids ─────────────────────────────────────────────────────────
const aidIds = ['roek-geslacht', 'kauw-geslacht', 'groenling-geslacht'];

for (const id of aidIds) {
  const { data: row, error: fetchErr } = await sb.from('determinatie_aid')
    .select('id, data')
    .eq('id', id)
    .single();
  if (fetchErr) { console.error(`Ophalen aid ${id} mislukt:`, fetchErr.message); continue; }

  // Specifieke label-fixes die fixStr niet pakt vanwege context
  const fixedData = fixObj(row.data);
  // label-velden die exact "CP (...)" zijn
  function fixLabels(obj) {
    if (Array.isArray(obj)) return obj.map(fixLabels);
    if (obj && typeof obj === 'object') {
      const out = {};
      for (const [k, v] of Object.entries(obj)) {
        if (k === 'label' && typeof v === 'string') {
          out[k] = v
            .replace(/^CP \(na kleine BP\)$/, 'Cloaca (na kleine BP)')
            .replace(/^CP \(geen broedvlek\)$/, 'Cloaca (geen broedvlek)');
        } else {
          out[k] = fixLabels(v);
        }
      }
      return out;
    }
    return obj;
  }

  const { error } = await sb.from('determinatie_aid').upsert({ id: row.id, data: fixLabels(fixedData) });
  if (error) { console.error(`Upsert aid ${id} mislukt:`, error.message); continue; }
  console.log(`✓ Aid ${id} gecorrigeerd`);
}

console.log('\nKlaar — alle CP-verwijzingen vervangen door cloaca.');
