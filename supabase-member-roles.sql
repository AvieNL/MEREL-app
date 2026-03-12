-- =====================================================
-- VRS App - Rollen per projectlid (viewer / ringer / admin)
-- Voer dit UIT in: Supabase dashboard → SQL Editor → New query
-- =====================================================

-- STAP 1: rol kolom toevoegen aan project_members (default 'viewer')
ALTER TABLE public.project_members
  ADD COLUMN IF NOT EXISTS rol TEXT NOT NULL DEFAULT 'viewer'
    CHECK (rol IN ('viewer', 'ringer', 'admin'));

-- STAP 2: get_project_members updaten zodat rol meekomt
DROP FUNCTION IF EXISTS public.get_project_members(TEXT);

CREATE OR REPLACE FUNCTION public.get_project_members(p_project_id TEXT)
RETURNS TABLE(user_id UUID, email TEXT, ringer_naam TEXT, is_owner BOOLEAN, rol TEXT)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  -- Eigenaar van het project (altijd 'admin' qua rechten)
  SELECT pr.id AS user_id, pr.email, pr.ringer_naam, TRUE AS is_owner, 'admin'::TEXT AS rol
  FROM   public.projecten p
  JOIN   public.profiles pr ON pr.id = p.user_id
  WHERE  p.id = p_project_id
    AND (
      p.user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.project_members
        WHERE project_id = p_project_id AND user_id = auth.uid()
      )
    )

  UNION ALL

  -- Overige leden met hun rol
  SELECT pm.user_id, pr.email, pr.ringer_naam, FALSE AS is_owner, pm.rol
  FROM   public.project_members pm
  JOIN   public.profiles pr ON pr.id = pm.user_id
  WHERE  pm.project_id = p_project_id
    AND (
      EXISTS (
        SELECT 1 FROM public.projecten
        WHERE id = p_project_id AND user_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM public.project_members
        WHERE project_id = p_project_id AND user_id = auth.uid()
      )
    );
$$;

-- STAP 3: Helper functie om rol te wijzigen (alleen projecteigenaar)
CREATE OR REPLACE FUNCTION public.update_member_role(
  p_project_id TEXT,
  p_user_id    UUID,
  p_rol        TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Alleen de eigenaar mag rollen wijzigen
  IF NOT EXISTS (
    SELECT 1 FROM public.projecten
    WHERE id = p_project_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Geen toestemming';
  END IF;

  IF p_rol NOT IN ('viewer', 'ringer', 'admin') THEN
    RAISE EXCEPTION 'Ongeldige rol: %', p_rol;
  END IF;

  UPDATE public.project_members
  SET rol = p_rol
  WHERE project_id = p_project_id AND user_id = p_user_id;
END;
$$;
