import Dexie from 'dexie';

/**
 * Lokale IndexedDB database via Dexie.js.
 * Dient als offline-first cache en buffer voor Supabase-synchronisatie.
 *
 * Versiebeheer: verhoog het versienummer + voeg een nieuwe .stores() definitie toe
 * als je het schema uitbreidt. Verander NOOIT bestaande versies.
 */
export const db = new Dexie('merel-app');

db.version(1).stores({
  vangsten:          'id, user_id, [user_id+timestamp], vogelnaam, vangstdatum, project, uploaded, bron',
  projecten:         'id, user_id, naam',
  ringstrengen:      'id, user_id',
  species_overrides: '[user_id+soort_naam], user_id, soort_naam',
  sync_queue: '++id, table_name, createdAt, attempts',
  meta: 'key',
});

// Versie 2: deleted_at index voor soft delete van vangsten
db.version(2).stores({
  vangsten: 'id, user_id, [user_id+timestamp], vogelnaam, vangstdatum, project, uploaded, bron, deleted_at',
});

// Versie 3: offline-cache voor soortbasisdata (gevuld vanuit Supabase, incl. EURING-codes)
db.version(3).stores({
  species: 'naam_nl',
});

// Versie 4: offline-cache voor veldconfiguratie (admin-beheerd via Supabase)
db.version(4).stores({
  veld_config: 'veld_key',
});

// Versie 5: referentiebibliotheek voor AI-analyse (foto's + metadata, lokaal opgeslagen)
// Tabel later gemigreerd naar Supabase; zie versie 6.
db.version(5).stores({
  referentiebibliotheek: '++id, soort, maand, type',
});

// Versie 6: referentiebibliotheek-tabel verwijderd uit Dexie (data staat nu in Supabase)
db.version(6).stores({
  referentiebibliotheek: null,
});

// Versie 7: volgorde-index op veld_config voor directe Dexie-sortering
db.version(7).stores({
  veld_config: 'veld_key, volgorde',
});

// Versie 8: offline-cache voor nestkastonderzoek module
db.version(8).stores({
  nest:         'id, aangemaakt_door',
  nest_seizoen: 'id, nest_id, [nest_id+jaar]',
  legsel:       'id, nest_seizoen_id',
  nestbezoek:   'id, legsel_id, datum, aangemaakt_door',
  nestring:     'id, nestbezoek_id, vangst_id',
});

// Versie 9: kastnummer index toegevoegd aan nest (nodig voor orderBy)
db.version(9).stores({
  nest: 'id, aangemaakt_door, kastnummer',
});

// Versie 10: nest_seizoen tussenlaag verwijderd; legsel heeft nu nest_id + jaar direct
db.version(10).stores({
  nest_seizoen: null,
  legsel: 'id, nest_id, [nest_id+jaar]',
});

// Versie 11: nieuwe velden toegevoegd (geen schema-wijziging nodig, Dexie slaat alle velden op)
// nest:      + kasttype, hoogte
// legsel:    + datum_1e_ei, eistartmarge, eimethode
// nestbezoek: + ei_dood, jong_dood
db.version(11).stores({});

// Versie 12: deleted_at index op nest voor soft-delete (prullenbak)
db.version(12).stores({
  nest: 'id, aangemaakt_door, kastnummer, deleted_at',
});

// Versie 13: exported_at index op legsel voor export-tracking (analoog aan uploaded bij vangsten)
db.version(13).stores({
  legsel: 'id, nest_id, [nest_id+jaar], exported_at',
});

// Versie 14: legsel_ouder tabel voor koppeling oudervogels aan legsels (stamboomfunctie)
db.version(14).stores({
  legsel_ouder: 'id, legsel_id, ringnummer',
});
