-- Voeg locatie_type kolom toe aan nest tabel
-- Mogelijke waarden: 'kast' (nestkast, standaard) of 'nest' (vrij nest)

ALTER TABLE public.nest
  ADD COLUMN IF NOT EXISTS locatie_type TEXT NOT NULL DEFAULT 'kast'
    CHECK (locatie_type IN ('kast', 'nest'));
