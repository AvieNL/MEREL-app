-- ============================================================
-- legsel: nest_seizoen tussenlaag verwijderd (conform Dexie v10)
-- legsel heeft nu nest_id + jaar direct, zonder nest_seizoen
-- Voer uit in Supabase SQL Editor
-- ============================================================

-- 1. Nieuwe kolommen toevoegen
ALTER TABLE public.legsel
  ADD COLUMN IF NOT EXISTS nest_id UUID REFERENCES public.nest(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS jaar    SMALLINT;

-- 2. nest_seizoen_id nullable maken (bestaande rijen breken anders)
ALTER TABLE public.legsel
  ALTER COLUMN nest_seizoen_id DROP NOT NULL;

-- 3. UNIQUE constraint verplaatsen (was op nest_seizoen_id + volgnummer)
--    Voeg nieuwe unique toe op nest_id + jaar + volgnummer
ALTER TABLE public.legsel
  ADD CONSTRAINT legsel_nest_jaar_volgnummer_unique
  UNIQUE (nest_id, jaar, volgnummer);
