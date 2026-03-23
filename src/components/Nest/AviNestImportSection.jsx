import { useState, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { db } from '../../lib/db';
import { supabase } from '../../lib/supabase';
import { parseAviNestTXT } from '../../utils/avinestParser';

/**
 * Import-sectie voor AviNest TXT-exports.
 * Toont een preview met nieuwe records, duplicaten en fouten vóór de import.
 */
export default function AviNestImportSection() {
  const { user }     = useAuth();
  const { addToast } = useToast();
  const fileRef        = useRef(null);

  const [preview,   setPreview]   = useState(null);
  const [importing, setImporting] = useState(false);

  const bestaandeNesten  = useLiveQuery(() => db.nest.toArray(),   [], []);
  const bestaandeLegsels = useLiveQuery(() => db.legsel.toArray(), [], []);

  // ── Preview-berekening ────────────────────────────────────────────────────

  function berekenPreview(parsed) {
    const { nesten, legsels, bezoeken, ringen, fouten } = parsed;

    // Nest: match op kastnummer + adres (case-insensitive)
    const nestResultaten = nesten.map(n => {
      const bestaand = bestaandeNesten.find(e =>
        e.kastnummer === n.kastnummer &&
        (e.adres ?? '').toLowerCase().trim() === (n.adres ?? '').toLowerCase().trim()
      );
      return { ...n, _bestaandId: bestaand?.id ?? null };
    });

    // Legsel: match op volgnummer (= KAARTNR) binnen hetzelfde nest
    const legselResultaten = legsels.map(l => {
      const nestRes = nestResultaten.find(n => n._key === l._nestKey);
      const nestId  = nestRes?._bestaandId;
      if (!nestId) return { ...l, _duplicaat: false };
      const bestaand = bestaandeLegsels.find(e =>
        e.nest_id === nestId && e.volgnummer === l.volgnummer
      );
      return { ...l, _duplicaat: !!bestaand };
    });

    const nieuweLegselsKeys = new Set(
      legselResultaten.filter(l => !l._duplicaat).map(l => l._key)
    );

    return {
      parsed,
      nestResultaten,
      legselResultaten,
      nieuwNesten:       nestResultaten.filter(n => !n._bestaandId).length,
      hergebruiktNesten: nestResultaten.filter(n =>  n._bestaandId).length,
      nieuwLegsels:      legselResultaten.filter(l => !l._duplicaat).length,
      dupLegsels:        legselResultaten.filter(l =>  l._duplicaat),
      nieuwBezoeken:     bezoeken.filter(b => nieuweLegselsKeys.has(b._legselKey)).length,
      nieuwRingen:       ringen.filter(r => {
        const b = bezoeken.find(b => b._key === r._bezoekKey);
        return b && nieuweLegselsKeys.has(b._legselKey);
      }).length,
      fouten,
    };
  }

  // ── Bestand laden ─────────────────────────────────────────────────────────

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const parsed = parseAviNestTXT(evt.target.result);
        if (parsed.nesten.length === 0 && parsed.fouten.length === 0) {
          addToast('Geen nestdata gevonden in dit bestand', 'error', 0);
          return;
        }
        setPreview(berekenPreview(parsed));
      } catch (err) {
        addToast(`Parseerfout: ${err.message}`, 'error', 0);
      }
    };
    reader.readAsText(file, 'iso-8859-1'); // AviNest gebruikt ISO-8859-1
    e.target.value = '';
  }

  // ── Import uitvoeren ──────────────────────────────────────────────────────

  async function handleImport() {
    if (!preview || !user) return;
    setImporting(true);

    const { parsed, nestResultaten, legselResultaten } = preview;
    const { bezoeken, ringen } = parsed;
    const now = new Date().toISOString();

    const nestIdMap   = new Map(); // _key → id
    const legselIdMap = new Map(); // _key → id
    const bezoekIdMap = new Map(); // _key → id

    try {
      // Schrijf direct naar Supabase in FK-volgorde (nest → legsel → nestbezoek → nestring),
      // en tegelijk naar Dexie. De sync queue wordt bewust overgeslagen om parallelle
      // verwerking te voorkomen die FK-violations veroorzaakt.

      // 1. Nesten — altijd upserten (ook hergebruikte) zodat ze zeker in Supabase bestaan
      const alleNestRecords = [];
      for (const n of nestResultaten) {
        const id = n._bestaandId ?? crypto.randomUUID();
        const bestaand = bestaandeNesten.find(e => e.id === n._bestaandId);
        const record = bestaand
          ? { ...bestaand, updated_at: now }
          : {
              id,
              kastnummer:      n.kastnummer,
              adres:           n.adres,
              lat:             n.lat,
              lon:             n.lon,
              soort_euring:    n.soort_euring,
              habitat:         n.habitat,
              nestplaats:      n.nestplaats,
              kasttype:        n.kasttype,
              hoogte:          n.hoogte,
              bescherm:        n.bescherm,
              verstopt:        n.verstopt,
              aangemaakt_door: user.id,
              aangemaakt_op:   now,
              updated_at:      now,
            };
        nestIdMap.set(n._key, id);
        alleNestRecords.push(record);
      }
      if (alleNestRecords.length > 0) {
        const { error } = await supabase.from('nest').upsert(alleNestRecords);
        if (error) throw error;
        await db.nest.bulkPut(alleNestRecords);
      }

      // 2. Legsels
      const nieuweLegselsKeys = new Set();
      const nieuweLegselsRecords = [];
      for (const l of legselResultaten) {
        if (l._duplicaat) continue;
        const nestId = nestIdMap.get(l._nestKey);
        if (!nestId) continue;
        const id = crypto.randomUUID();
        const record = {
          id,
          nest_id:         nestId,
          volgnummer:      l.volgnummer,
          jaar:            l.jaar,
          link_type:       l.link_type,
          datum_1e_ei:     l.datum_1e_ei,
          eistartmarge:    l.eistartmarge,
          nestsucces:      l.nestsucces,
          predatie:        l.predatie,
          verlies:         l.verlies,
          moment:          l.moment,
          aangemaakt_door: user.id,
          updated_at:      now,
        };
        legselIdMap.set(l._key, id);
        nieuweLegselsKeys.add(l._key);
        nieuweLegselsRecords.push(record);
      }
      if (nieuweLegselsRecords.length > 0) {
        const { error } = await supabase.from('legsel').upsert(nieuweLegselsRecords);
        if (error) throw error;
        await db.legsel.bulkPut(nieuweLegselsRecords);
      }

      // 3. Bezoeken
      const nieuweBezoekRecords = [];
      for (const b of bezoeken) {
        if (!nieuweLegselsKeys.has(b._legselKey)) continue;
        const legselId = legselIdMap.get(b._legselKey);
        if (!legselId) continue;
        const id = crypto.randomUUID();
        const record = {
          id,
          legsel_id:       legselId,
          datum:           b.datum,
          stadium:         b.stadium,
          stadium2:        b.stadium2,
          aantal_eieren:   b.aantal_eieren,
          ei_dood:         b.ei_dood,
          aantal_pulli:    b.aantal_pulli,
          jong_dood:       b.jong_dood,
          betrouwb_datum:  b.betrouwb_datum,
          betrouwb_aantal: b.betrouwb_aantal,
          betrouwb_dagen:  b.betrouwb_dagen,
          opmerkingen:     b.opmerkingen,
          aangemaakt_door: user.id,
          updated_at:      now,
        };
        bezoekIdMap.set(b._key, id);
        nieuweBezoekRecords.push(record);
      }
      if (nieuweBezoekRecords.length > 0) {
        const { error } = await supabase.from('nestbezoek').upsert(nieuweBezoekRecords);
        if (error) throw error;
        await db.nestbezoek.bulkPut(nieuweBezoekRecords);
      }

      // 4. Ringen — zoek vangst op ringnummer voor koppeling
      const nieuweRingRecords = [];
      for (const r of ringen) {
        const bezoekId = bezoekIdMap.get(r._bezoekKey);
        if (!bezoekId) continue;
        const vangst = await db.vangsten.filter(v => v.ringnummer === r.ringnummer).first();
        const id = crypto.randomUUID();
        nieuweRingRecords.push({
          id,
          nestbezoek_id:   bezoekId,
          vangst_id:       vangst?.id ?? null,
          ringnummer:      r.ringnummer,
          aangemaakt_door: user.id,
          updated_at:      now,
        });
      }
      if (nieuweRingRecords.length > 0) {
        const { error } = await supabase.from('nestring').upsert(nieuweRingRecords);
        if (error) throw error;
        await db.nestring.bulkPut(nieuweRingRecords);
      }

      const pv = preview;
      setPreview(null);
      addToast(
        `Import geslaagd: ${pv.nieuwNesten} nesten, ${pv.nieuwLegsels} legsels, ${pv.nieuwBezoeken} bezoeken, ${pv.nieuwRingen} ringen`,
        'success'
      );
    } catch (err) {
      addToast(`Import mislukt: ${err.message}`, 'error', 0);
    } finally {
      setImporting(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="section">
      <h3>Nestkast import (AviNest)</h3>
      <p className="import-info">Importeer nestkaartdata uit een AviNest TXT-export.</p>

      {!preview ? (
        <div className="import-area">
          <input
            ref={fileRef}
            type="file"
            accept=".txt"
            onChange={handleFile}
            className="import-file-input"
            id="avinest-import-file"
          />
          <label htmlFor="avinest-import-file" className="btn-secondary import-label">
            Kies AviNest TXT bestand
          </label>
        </div>
      ) : (
        <div className="avinest-preview">
          <div className="avinest-preview__rijen">

            <div className="avinest-preview__rij avinest-preview__rij--ok">
              <span>Nieuw</span>
              <span>
                {preview.nieuwNesten} nesten · {preview.nieuwLegsels} legsels · {preview.nieuwBezoeken} bezoeken · {preview.nieuwRingen} ringen
              </span>
            </div>

            {preview.hergebruiktNesten > 0 && (
              <div className="avinest-preview__rij avinest-preview__rij--info">
                <span>Hergebruikt</span>
                <span>{preview.hergebruiktNesten} bestaande {preview.hergebruiktNesten === 1 ? 'nest' : 'nesten'}</span>
              </div>
            )}

            {preview.dupLegsels.length > 0 && (
              <div className="avinest-preview__rij avinest-preview__rij--warn">
                <span>Al aanwezig</span>
                <span>
                  {preview.dupLegsels.length} {preview.dupLegsels.length === 1 ? 'legsel' : 'legsels'} overgeslagen
                  {' '}(kaart {preview.dupLegsels.map(l => l._kaartnr).join(', ')})
                </span>
              </div>
            )}

            {preview.fouten.length > 0 && (
              <div className="avinest-preview__fouten">
                <div className="avinest-preview__rij avinest-preview__rij--error">
                  <span>Fouten</span>
                  <span>{preview.fouten.length} {preview.fouten.length === 1 ? 'rij' : 'rijen'}</span>
                </div>
                <ul className="avinest-preview__fout-lijst">
                  {preview.fouten.map((f, i) => (
                    <li key={i}>Rij {f.rij} (kaart {f.kaartnr}): {f.reden}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="avinest-preview__acties">
            <button
              className="btn-primary"
              onClick={handleImport}
              disabled={importing || preview.nieuwLegsels === 0}
            >
              {importing ? 'Bezig…' : 'Importeer'}
            </button>
            <button
              className="btn-secondary"
              onClick={() => setPreview(null)}
              disabled={importing}
            >
              Annuleer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
