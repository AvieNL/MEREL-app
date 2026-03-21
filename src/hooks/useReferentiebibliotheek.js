import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const BUCKET = 'referentiebibliotheek';

export function getFotoUrl(pad) {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(pad);
  return data.publicUrl;
}

async function uploadFotos(referentieId, fotos) {
  const paden = [];
  for (const foto of fotos) {
    const pad = `${referentieId}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(pad, foto.blob, { contentType: 'image/jpeg', upsert: false });
    if (!error) paden.push(pad);
  }
  return paden;
}

export function useReferentiebibliotheek() {
  const [referenties, setReferenties] = useState([]);
  const [loading, setLoading] = useState(true);

  const laden = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('referentiebibliotheek')
      .select('*')
      .order('created_at', { ascending: false });
    setReferenties(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { laden(); }, [laden]);

  async function addReferentie({ fotos = [], ...metadata }) {
    // 1. Rij aanmaken om het ID te krijgen
    const { data: inserted, error } = await supabase
      .from('referentiebibliotheek')
      .insert([{ ...metadata, foto_paden: [] }])
      .select()
      .single();
    if (error || !inserted) throw new Error(error?.message ?? 'Opslaan mislukt');

    // 2. Foto's uploaden
    const paden = fotos.length ? await uploadFotos(inserted.id, fotos) : [];

    // 3. Paden opslaan
    const { data: updated } = await supabase
      .from('referentiebibliotheek')
      .update({ foto_paden: paden })
      .eq('id', inserted.id)
      .select()
      .single();

    setReferenties(prev => [updated ?? inserted, ...prev]);
    return updated ?? inserted;
  }

  async function updateReferentie(id, changes) {
    const { data } = await supabase
      .from('referentiebibliotheek')
      .update(changes)
      .eq('id', id)
      .select()
      .single();
    if (data) setReferenties(prev => prev.map(r => r.id === id ? data : r));
  }

  async function addFotosAanReferentie(id, nieuwefotos) {
    const ref = referenties.find(r => r.id === id);
    const nieuwePaden = await uploadFotos(id, nieuwefotos);
    const allePaden = [...(ref?.foto_paden ?? []), ...nieuwePaden];
    await updateReferentie(id, { foto_paden: allePaden });
  }

  async function verwijderFotoUitReferentie(id, pad) {
    await supabase.storage.from(BUCKET).remove([pad]);
    const ref = referenties.find(r => r.id === id);
    const nieuwePaden = (ref?.foto_paden ?? []).filter(p => p !== pad);
    await updateReferentie(id, { foto_paden: nieuwePaden });
  }

  async function deleteReferentie(id) {
    const ref = referenties.find(r => r.id === id);
    if (ref?.foto_paden?.length) {
      await supabase.storage.from(BUCKET).remove(ref.foto_paden);
    }
    await supabase.from('referentiebibliotheek').delete().eq('id', id);
    setReferenties(prev => prev.filter(r => r.id !== id));
  }

  return {
    referenties, loading, laden,
    addReferentie, updateReferentie,
    addFotosAanReferentie, verwijderFotoUitReferentie,
    deleteReferentie,
  };
}
