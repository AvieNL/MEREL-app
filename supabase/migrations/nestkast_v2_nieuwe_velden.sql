-- ============================================================
-- Nestkast module v2 — nieuwe velden (v1.32.0)
-- Voer dit uit in Supabase SQL Editor
-- ============================================================

-- ── nest: kasttype + hoogte ───────────────────────────────────
-- kasttype: SOVON-code 0-5 (0=geen kast, 1=standaard, 2=half-open,
--           3=platform, 4=kunstmatige holte, 5=overig)
-- hoogte:   hoogte boven grond in meters

ALTER TABLE public.nest
  ADD COLUMN IF NOT EXISTS kasttype SMALLINT,
  ADD COLUMN IF NOT EXISTS hoogte   FLOAT8;

-- ── nestbezoek: ei_dood + jong_dood ──────────────────────────
ALTER TABLE public.nestbezoek
  ADD COLUMN IF NOT EXISTS ei_dood   SMALLINT,
  ADD COLUMN IF NOT EXISTS jong_dood SMALLINT;

-- ── legsel: datum_1e_ei + eistartmarge + eimethode ───────────
-- eimethode: 0=onbekend, 1=eigen waarneming, 2=via broedduur,
--            3=via leeftijd pulli, 4=via eilegsnelheid

ALTER TABLE public.legsel
  ADD COLUMN IF NOT EXISTS datum_1e_ei   DATE,
  ADD COLUMN IF NOT EXISTS eistartmarge  SMALLINT,
  ADD COLUMN IF NOT EXISTS eimethode     SMALLINT;
