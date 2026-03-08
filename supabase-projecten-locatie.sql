-- Voeg locatievelden toe aan de projecten tabel
-- Uitvoeren in Supabase SQL Editor

alter table public.projecten
  add column if not exists vaste_locatie boolean default false,
  add column if not exists plaatscode    text    default '',
  add column if not exists google_plaats text    default '',
  add column if not exists lat           text    default '',
  add column if not exists lon           text    default '',
  add column if not exists nauwk_coord   text    default '0';
