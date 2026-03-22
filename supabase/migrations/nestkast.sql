-- ============================================================
-- Nestkastonderzoek module
-- Voer dit uit in Supabase SQL Editor
-- ============================================================

-- ── 1. profiles uitbreiden ───────────────────────────────────

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS sovon_registratienummer TEXT,
  ADD COLUMN IF NOT EXISTS nestkast_rol TEXT
    CHECK (nestkast_rol IN ('nestonderzoeker', 'kijker'));

-- ── 2. Gedeelde RLS-helperfuncties ───────────────────────────

-- Mag lezen: admin, nestonderzoeker, kijker
CREATE OR REPLACE FUNCTION public.is_nest_lezer()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND (rol = 'admin' OR nestkast_rol IN ('nestonderzoeker', 'kijker'))
  )
$$;

-- Mag schrijven: admin, nestonderzoeker
CREATE OR REPLACE FUNCTION public.is_nestonderzoeker()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND (rol = 'admin' OR nestkast_rol = 'nestonderzoeker')
  )
$$;

-- ── 3. nest ──────────────────────────────────────────────────
-- Vaste locatiedata per kast of nest

CREATE TABLE IF NOT EXISTS public.nest (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  kastnummer      TEXT        NOT NULL,
  lat             FLOAT8,
  lon             FLOAT8,
  omschrijving    TEXT        NOT NULL DEFAULT '',
  aangemaakt_door UUID        NOT NULL REFERENCES auth.users(id),
  aangemaakt_op   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.nest ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nest lezen"
  ON public.nest FOR SELECT TO authenticated
  USING (public.is_nest_lezer());

CREATE POLICY "nest aanmaken"
  ON public.nest FOR INSERT TO authenticated
  WITH CHECK (public.is_nestonderzoeker() AND aangemaakt_door = auth.uid());

CREATE POLICY "nest bewerken"
  ON public.nest FOR UPDATE TO authenticated
  USING (
    aangemaakt_door = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'admin')
  )
  WITH CHECK (public.is_nestonderzoeker());

CREATE POLICY "nest verwijderen"
  ON public.nest FOR DELETE TO authenticated
  USING (
    aangemaakt_door = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'admin')
  );

-- ── 4. nest_seizoen ──────────────────────────────────────────
-- Nestgegevens per nest per jaar (HABITAT, NESTPLAATS, etc.)

CREATE TABLE IF NOT EXISTS public.nest_seizoen (
  id              UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  nest_id         UUID     NOT NULL REFERENCES public.nest(id) ON DELETE CASCADE,
  jaar            SMALLINT NOT NULL,
  soort_euring    TEXT     NOT NULL DEFAULT '',
  habitat         SMALLINT,          -- SOVON HABITAT code 0-72
  nestplaats      SMALLINT,          -- SOVON NESTPLAATS code -1 tot 99
  nesttype        TEXT,              -- SOVON NEST code (b.v. '2' = nestkast)
  vondst          SMALLINT,          -- SOVON VONDST code 0-7
  verstopt        SMALLINT,          -- SOVON VERSTOPT code 0/1/3/5
  bescherm        SMALLINT,          -- SOVON BESCHERM code 1-7
  aangemaakt_door UUID     NOT NULL REFERENCES auth.users(id),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (nest_id, jaar)
);

ALTER TABLE public.nest_seizoen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nest_seizoen lezen"
  ON public.nest_seizoen FOR SELECT TO authenticated
  USING (public.is_nest_lezer());

CREATE POLICY "nest_seizoen aanmaken"
  ON public.nest_seizoen FOR INSERT TO authenticated
  WITH CHECK (public.is_nestonderzoeker() AND aangemaakt_door = auth.uid());

CREATE POLICY "nest_seizoen bewerken"
  ON public.nest_seizoen FOR UPDATE TO authenticated
  USING (
    aangemaakt_door = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'admin')
  )
  WITH CHECK (public.is_nestonderzoeker());

CREATE POLICY "nest_seizoen verwijderen"
  ON public.nest_seizoen FOR DELETE TO authenticated
  USING (
    aangemaakt_door = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'admin')
  );

-- ── 5. legsel ────────────────────────────────────────────────
-- Per legsel binnen een nest_seizoen (incl. nestsucces en eierresultaten)

CREATE TABLE IF NOT EXISTS public.legsel (
  id              UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  nest_seizoen_id UUID     NOT NULL REFERENCES public.nest_seizoen(id) ON DELETE CASCADE,
  volgnummer      SMALLINT NOT NULL DEFAULT 1,
  link_type       SMALLINT NOT NULL DEFAULT 0, -- SOVON LINK_TYPE 0-6

  -- Nestsucces (ingevuld bij afsluiting legsel)
  nestsucces      SMALLINT,  -- -1 = onbekend, 0-25 = aantal uitgevlogen
  succes2         TEXT,      -- SOVON SUCCES2 categorie
  moment          SMALLINT,  -- SOVON MOMENT 1-3 (wanneer verlies)
  predatie        SMALLINT,  -- SOVON PREDATIE 0-8
  methode         SMALLINT,  -- SOVON METHODE 0-12 (hoe vastgesteld)
  verlies         TEXT,      -- SOVON VERLIES code (E1-E14, J1-J9, etc.)

  -- Eierresultaten (totaal per legsel)
  eisucces        SMALLINT,  -- SOVON EISUCCES 1-8
  vindstatus      SMALLINT,  -- SOVON VINDSTATUS 0-3

  aangemaakt_door UUID NOT NULL REFERENCES auth.users(id),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (nest_seizoen_id, volgnummer)
);

ALTER TABLE public.legsel ENABLE ROW LEVEL SECURITY;

CREATE POLICY "legsel lezen"
  ON public.legsel FOR SELECT TO authenticated
  USING (public.is_nest_lezer());

CREATE POLICY "legsel aanmaken"
  ON public.legsel FOR INSERT TO authenticated
  WITH CHECK (public.is_nestonderzoeker() AND aangemaakt_door = auth.uid());

CREATE POLICY "legsel bewerken"
  ON public.legsel FOR UPDATE TO authenticated
  USING (
    aangemaakt_door = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'admin')
  )
  WITH CHECK (public.is_nestonderzoeker());

CREATE POLICY "legsel verwijderen"
  ON public.legsel FOR DELETE TO authenticated
  USING (
    aangemaakt_door = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'admin')
  );

-- ── 6. nestbezoek ────────────────────────────────────────────
-- Per veldbezoek aan een legsel

CREATE TABLE IF NOT EXISTS public.nestbezoek (
  id                        UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  legsel_id                 UUID    NOT NULL REFERENCES public.legsel(id) ON DELETE CASCADE,
  datum                     DATE    NOT NULL,
  tijd                      TIME,
  stadium                   TEXT    NOT NULL, -- L0/B0-B5/P0-P6/E0-E7/N+/N0-N11/C1-C9/X0
  aantal_eieren             SMALLINT,
  aantal_pulli              SMALLINT,

  -- Betrouwbaarheidsscores (SOVON), default 1 = exact
  betrouwb_datum            SMALLINT NOT NULL DEFAULT 1, -- 1-6
  betrouwb_aantal           SMALLINT NOT NULL DEFAULT 1, -- 1-7
  betrouwb_dagen            SMALLINT NOT NULL DEFAULT 1, -- 1-7

  opmerkingen               TEXT    NOT NULL DEFAULT '',
  volgende_bezoek_suggestie DATE,   -- berekend op basis van stadium + soort

  aangemaakt_door           UUID    NOT NULL REFERENCES auth.users(id),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.nestbezoek ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nestbezoek lezen"
  ON public.nestbezoek FOR SELECT TO authenticated
  USING (public.is_nest_lezer());

CREATE POLICY "nestbezoek aanmaken"
  ON public.nestbezoek FOR INSERT TO authenticated
  WITH CHECK (public.is_nestonderzoeker() AND aangemaakt_door = auth.uid());

CREATE POLICY "nestbezoek bewerken"
  ON public.nestbezoek FOR UPDATE TO authenticated
  USING (
    aangemaakt_door = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'admin')
  )
  WITH CHECK (public.is_nestonderzoeker());

CREATE POLICY "nestbezoek verwijderen"
  ON public.nestbezoek FOR DELETE TO authenticated
  USING (
    aangemaakt_door = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'admin')
  );

-- ── 7. nestring ──────────────────────────────────────────────
-- Ringgegevens per individu per nestbezoek (koppelt aan vangsten)

CREATE TABLE IF NOT EXISTS public.nestring (
  id              UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  nestbezoek_id   UUID     NOT NULL REFERENCES public.nestbezoek(id) ON DELETE CASCADE,
  vangst_id       TEXT     REFERENCES public.vangsten(id) ON DELETE SET NULL,
  centrale        TEXT     NOT NULL DEFAULT 'NLA',
  ringnummer      TEXT     NOT NULL DEFAULT '',
  tmd             SMALLINT NOT NULL DEFAULT 0, -- 0=nieuw geringd, 1=terugvangst
  leeftijd        SMALLINT NOT NULL DEFAULT 2, -- 1=adult, 2=jong
  sexe            TEXT     NOT NULL DEFAULT 'O', -- O/M/V
  positie         TEXT,    -- LO/RO/LB/RB/L/R/O/B (kleurring positie)
  conditie        SMALLINT,-- SOVON CONDITIE 0-7
  krop            SMALLINT,-- SOVON KROP -1/0/1/2 (roofvogels/uilen)
  aangemaakt_door UUID     NOT NULL REFERENCES auth.users(id),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.nestring ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nestring lezen"
  ON public.nestring FOR SELECT TO authenticated
  USING (public.is_nest_lezer());

CREATE POLICY "nestring aanmaken"
  ON public.nestring FOR INSERT TO authenticated
  WITH CHECK (public.is_nestonderzoeker() AND aangemaakt_door = auth.uid());

CREATE POLICY "nestring bewerken"
  ON public.nestring FOR UPDATE TO authenticated
  USING (
    aangemaakt_door = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'admin')
  )
  WITH CHECK (public.is_nestonderzoeker());

CREATE POLICY "nestring verwijderen"
  ON public.nestring FOR DELETE TO authenticated
  USING (
    aangemaakt_door = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'admin')
  );
