-- ============================================================
-- Referentiebibliotheek voor AI leeftijd/geslacht analyse
-- Voer dit uit in Supabase SQL Editor
-- ============================================================

-- 1. Tabel aanmaken
create table if not exists public.referentiebibliotheek (
  id           uuid        primary key default gen_random_uuid(),
  soort        text        not null,
  maand        smallint    not null check (maand between 1 and 12),
  leeftijd     text        not null default '',
  geslacht     text        not null default 'U',
  type         text        not null default 'handmatig',
  toelichting  text        not null default '',
  datum        date        not null default current_date,
  foto_paden   text[]      not null default '{}',
  created_at   timestamptz not null default now()
);

-- 2. Row Level Security
alter table public.referentiebibliotheek enable row level security;

-- Alle ingelogde gebruikers mogen lezen (voor AI-analyse)
create policy "referenties lezen"
  on public.referentiebibliotheek for select
  to authenticated
  using (true);

-- Alleen admins mogen schrijven
create policy "referenties beheren (admin)"
  on public.referentiebibliotheek for all
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and rol = 'admin')
  )
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and rol = 'admin')
  );

-- 3. Storage bucket aanmaken (run apart als SQL niet werkt)
-- Ga naar Supabase Dashboard → Storage → New bucket
-- Naam: referentiebibliotheek
-- Public: AAN (zodat foto-URLs direct toegankelijk zijn)
--
-- Of via SQL:
insert into storage.buckets (id, name, public)
values ('referentiebibliotheek', 'referentiebibliotheek', true)
on conflict (id) do nothing;

-- Storage policies
create policy "referentie fotos lezen"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'referentiebibliotheek');

create policy "admins mogen referentie fotos uploaden"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'referentiebibliotheek'
    and exists (select 1 from public.profiles where id = auth.uid() and rol = 'admin')
  );

create policy "admins mogen referentie fotos verwijderen"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'referentiebibliotheek'
    and exists (select 1 from public.profiles where id = auth.uid() and rol = 'admin')
  );
