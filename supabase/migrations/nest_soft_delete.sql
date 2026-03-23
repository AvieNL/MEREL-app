-- ============================================================
-- nest: soft-delete ondersteuning (prullenbak)
-- Voer uit in Supabase SQL Editor
-- ============================================================

ALTER TABLE public.nest
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
