-- ============================================================
-- legsel_ouder: koppeling oudervogel aan legsel
-- Voer dit uit in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.legsel_ouder (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  legsel_id       UUID        NOT NULL REFERENCES public.legsel(id) ON DELETE CASCADE,
  ringnummer      TEXT        NOT NULL DEFAULT '',
  centrale        TEXT        NOT NULL DEFAULT 'NLA',
  geslacht        TEXT        NOT NULL DEFAULT 'O'
                              CHECK (geslacht IN ('O', 'M', 'V')),
  naam_vogel      TEXT        NOT NULL DEFAULT '',
  soort_euring    TEXT,
  vangst_id       TEXT        REFERENCES public.vangsten(id) ON DELETE SET NULL,
  aangemaakt_door UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.legsel_ouder ENABLE ROW LEVEL SECURITY;

CREATE POLICY "legsel_ouder lezen"
  ON public.legsel_ouder FOR SELECT TO authenticated
  USING (public.is_nest_lezer());

CREATE POLICY "legsel_ouder aanmaken"
  ON public.legsel_ouder FOR INSERT TO authenticated
  WITH CHECK (public.is_nestonderzoeker());

CREATE POLICY "legsel_ouder bewerken"
  ON public.legsel_ouder FOR UPDATE TO authenticated
  USING (public.is_nestonderzoeker())
  WITH CHECK (public.is_nestonderzoeker());

CREATE POLICY "legsel_ouder verwijderen"
  ON public.legsel_ouder FOR DELETE TO authenticated
  USING (
    aangemaakt_door = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'admin')
    OR public.is_nestonderzoeker()
  );

-- Index voor snelle lookup per legsel
CREATE INDEX IF NOT EXISTS legsel_ouder_legsel_id_idx ON public.legsel_ouder (legsel_id);
-- Index voor stamboom-traversal: zoeken op ringnummer
CREATE INDEX IF NOT EXISTS legsel_ouder_ringnummer_idx ON public.legsel_ouder (ringnummer);
