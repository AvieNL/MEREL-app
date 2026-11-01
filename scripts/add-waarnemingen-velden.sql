-- Migratie: alle extra CSV-velden toevoegen aan waarnemingen-tabel
-- Voer dit uit in de Supabase SQL Editor (dashboard.supabase.com → SQL Editor)
-- Veilig om meerdere keren uit te voeren (IF NOT EXISTS)

ALTER TABLE public.waarnemingen
  ADD COLUMN IF NOT EXISTS obs_time          text         NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS obs_created       text         NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS obs_modified      text         NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS family            text         NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS species_type      text         NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS sex               text         NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS life_stage        text         NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS activity          text         NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS method            text         NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS counting_method   text         NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS related_species_id   text      NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS related_species_name text      NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS accuracy          integer,
  ADD COLUMN IF NOT EXISTS validator_id      text         NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS validator_name    text         NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS validation_date   text         NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS notes             text         NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS substrate         text         NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS is_certain        boolean      NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS is_escape         boolean      NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS obscurity         smallint     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS embargo_date      text         NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS external_ref      text         NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS obs_uuid          text         NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS has_sound         boolean      NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS obs_source        text         NOT NULL DEFAULT '';

-- Optioneel: extra index op soortnaam voor snelle zoekopdrachten
CREATE INDEX IF NOT EXISTS waarnemingen_species_nl
  ON public.waarnemingen (user_id, species_name_nl);
