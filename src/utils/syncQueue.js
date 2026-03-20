import { supabase } from '../lib/supabase';

/**
 * Voert één sync-queue item uit tegen Supabase.
 * Gooit een error als de operatie mislukt (zodat SyncContext de retry-logica kan afhandelen).
 */
export async function executeQueueItem(item, userId) {
  const { table_name, operation, data } = item;

  if (operation === 'upsert') {
    const { error } = await supabase.from(table_name).upsert(data);
    if (error) throw error;

  } else if (operation === 'delete') {
    const { error } = await supabase
      .from(table_name)
      .delete()
      .eq('id', data.id)
      .eq('user_id', userId);
    if (error) throw error;

  } else if (operation === 'batch_upsert') {
    const rows = data;
    for (let i = 0; i < rows.length; i += 100) {
      const { error } = await supabase.from(table_name).upsert(rows.slice(i, i + 100));
      if (error) throw error;
    }

  } else if (operation === 'species_override_upsert') {
    const { error } = await supabase
      .from('species_overrides')
      .upsert(data, { onConflict: 'user_id,soort_naam' });
    if (error) throw error;

  } else if (operation === 'species_override_delete') {
    const { error } = await supabase
      .from('species_overrides')
      .delete()
      .eq('user_id', data.user_id)
      .eq('soort_naam', data.soort_naam);
    if (error) throw error;

  } else if (operation === 'profile_update') {
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', userId);
    if (error) throw error;

  } else if (operation === 'mark_uploaded') {
    const { error } = await supabase
      .from('vangsten')
      .update({ uploaded: true, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .in('id', data.ids);
    if (error) throw error;

  } else if (operation === 'soft_delete') {
    const { error } = await supabase
      .from('vangsten')
      .update({ deleted_at: data.deleted_at, updated_at: new Date().toISOString() })
      .eq('id', data.id)
      .eq('user_id', userId);
    if (error) throw error;

  } else if (operation === 'restore') {
    const { error } = await supabase
      .from('vangsten')
      .update({ deleted_at: null, updated_at: new Date().toISOString() })
      .eq('id', data.id)
      .eq('user_id', userId);
    if (error) throw error;
  }
}
