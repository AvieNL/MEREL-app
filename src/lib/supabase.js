import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  const msg = 'VITE_SUPABASE_URL en VITE_SUPABASE_ANON_KEY zijn vereist in .env.local';
  if (import.meta.env.DEV) throw new Error(msg);
  console.error(msg);
}

export const supabase = createClient(url || '', key || '');
