-- ============================================================
-- nestbezoek: ontbrekende kolommen toevoegen
-- stadium2, soort_euring, volgende_bezoek_type waren al in gebruik
-- in de app maar ontbraken in het Supabase schema — waardoor elke
-- bezoek-sync faalde met een "column not found" fout.
-- ============================================================

ALTER TABLE public.nestbezoek
  ADD COLUMN IF NOT EXISTS stadium2              TEXT,
  ADD COLUMN IF NOT EXISTS soort_euring          TEXT,
  ADD COLUMN IF NOT EXISTS volgende_bezoek_type  TEXT;
