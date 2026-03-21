import { supabase } from '../lib/supabase';

const HANDLERS = {
  async upsert({ table_name, data }) {
    const { error } = await supabase.from(table_name).upsert(data);
    if (error) throw error;
  },

  async delete({ table_name, data }, userId) {
    const { error } = await supabase
      .from(table_name)
      .delete()
      .eq('id', data.id)
      .eq('user_id', userId);
    if (error) throw error;
  },

  async batch_upsert({ table_name, data }) {
    for (let i = 0; i < data.length; i += 100) {
      const { error } = await supabase.from(table_name).upsert(data.slice(i, i + 100));
      if (error) throw error;
    }
  },

  async species_override_upsert({ data }) {
    const { error } = await supabase
      .from('species_overrides')
      .upsert(data, { onConflict: 'user_id,soort_naam' });
    if (error) throw error;
  },

  async species_override_delete({ data }) {
    const { error } = await supabase
      .from('species_overrides')
      .delete()
      .eq('user_id', data.user_id)
      .eq('soort_naam', data.soort_naam);
    if (error) throw error;
  },

  async profile_update({ data }, userId) {
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', userId);
    if (error) throw error;
  },

  async mark_uploaded({ data }, userId) {
    const { error } = await supabase
      .from('vangsten')
      .update({ uploaded: true, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .in('id', data.ids);
    if (error) throw error;
  },

  async soft_delete({ data }, userId) {
    const { error } = await supabase
      .from('vangsten')
      .update({ deleted_at: data.deleted_at, updated_at: new Date().toISOString() })
      .eq('id', data.id)
      .eq('user_id', userId);
    if (error) throw error;
  },

  async restore({ data }, userId) {
    const { error } = await supabase
      .from('vangsten')
      .update({ deleted_at: null, updated_at: new Date().toISOString() })
      .eq('id', data.id)
      .eq('user_id', userId);
    if (error) throw error;
  },
};

/**
 * Voert één sync-queue item uit tegen Supabase.
 * Gooit een error als de operatie mislukt (zodat SyncContext de retry-logica kan afhandelen).
 */
export async function executeQueueItem(item, userId) {
  const handler = HANDLERS[item.operation];
  if (handler) await handler(item, userId);
}
