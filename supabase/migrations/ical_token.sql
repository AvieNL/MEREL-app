-- ============================================================
-- iCal-token voor webcal-abonnement
-- Voer uit in Supabase SQL Editor
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS ical_token UUID DEFAULT gen_random_uuid();

-- Bestaande gebruikers zonder token krijgen er één
UPDATE public.profiles
  SET ical_token = gen_random_uuid()
  WHERE ical_token IS NULL;
