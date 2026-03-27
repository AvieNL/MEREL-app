-- Voeg fotos kolom toe aan nest tabel
-- Opgeslagen als JSONB array van base64 DataURL strings

ALTER TABLE public.nest
  ADD COLUMN IF NOT EXISTS fotos JSONB NOT NULL DEFAULT '[]'::jsonb;
