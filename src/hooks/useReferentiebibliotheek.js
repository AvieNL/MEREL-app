import { useState, useEffect } from 'react';
import { db } from '../lib/db';

/**
 * CRUD hook voor de lokale referentiebibliotheek (Dexie).
 * Elke entry bevat: soort, maand, leeftijd, geslacht, type, fotoBlob, datum, toelichting.
 */
export function useReferentiebibliotheek() {
  const [referenties, setReferenties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.referentiebibliotheek.toArray()
      .then(all => { setReferenties(all); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function addReferentie(entry) {
    const id = await db.referentiebibliotheek.add(entry);
    setReferenties(prev => [...prev, { ...entry, id }]);
    return id;
  }

  async function deleteReferentie(id) {
    await db.referentiebibliotheek.delete(id);
    setReferenties(prev => prev.filter(r => r.id !== id));
  }

  async function updateReferentie(id, changes) {
    await db.referentiebibliotheek.update(id, changes);
    setReferenties(prev => prev.map(r => r.id === id ? { ...r, ...changes } : r));
  }

  return { referenties, loading, addReferentie, deleteReferentie, updateReferentie };
}
