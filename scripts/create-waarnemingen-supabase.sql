-- Voer dit script uit in de Supabase SQL Editor (dashboard.supabase.com)
-- Project: merel-app
-- Doel: sla CSV-waarnemingen op in de cloud zodat ze op elk apparaat beschikbaar zijn

create table if not exists public.waarnemingen (
  id                text         not null,
  user_id           uuid         not null references auth.users(id) on delete cascade,
  datum             text,
  species_obs_id    bigint,
  species_name_nl   text         not null default '',
  species_name_lat  text         not null default '',
  euring_code       text         not null default '',
  country_code      text         not null default '',
  country_name      text         not null default '',
  location_name     text         not null default '',
  lat               double precision,
  lon               double precision,
  rarity            smallint     not null default 0,
  validation_status text         not null default '',
  count             integer      not null default 1,
  permalink         text         not null default '',
  province          text         not null default '',
  has_photo         boolean      not null default false,
  source            text         not null default 'csv',
  imported_at       timestamptz           default now(),
  primary key (id, user_id)
);

-- Index voor snelle queries per gebruiker
create index if not exists waarnemingen_user_datum
  on public.waarnemingen (user_id, datum);

-- Row Level Security
alter table public.waarnemingen enable row level security;

create policy "Gebruikers lezen eigen waarnemingen"
  on public.waarnemingen for select
  using (auth.uid() = user_id);

create policy "Gebruikers voegen eigen waarnemingen in"
  on public.waarnemingen for insert
  with check (auth.uid() = user_id);

create policy "Gebruikers werken eigen waarnemingen bij"
  on public.waarnemingen for update
  using (auth.uid() = user_id);

create policy "Gebruikers verwijderen eigen waarnemingen"
  on public.waarnemingen for delete
  using (auth.uid() = user_id);
