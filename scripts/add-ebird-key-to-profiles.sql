-- Voer dit script uit in de Supabase SQL Editor (dashboard.supabase.com)
-- Doel: sla eBird API-sleutel op in het gebruikersprofiel zodat hij op alle apparaten beschikbaar is

alter table public.profiles
  add column if not exists ebird_key text not null default '';
