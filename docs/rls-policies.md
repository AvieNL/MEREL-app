# Supabase RLS-beleid — VRS Breedenbroek

Dit document beschrijft de vereiste Row Level Security (RLS) policies voor de Supabase-tabellen.
Configureer deze policies via het Supabase-dashboard of via migraties.

## species

Bevat basisdata voor alle ~3565 soorten (namen, EURING-codes, biometriegrenzen, nestdata, etc.).
Wordt beheerd door admins en offline gecached door alle gebruikers.

```sql
-- Alle ingelogde gebruikers mogen soorten lezen (nodig voor offline cache)
create policy "Iedereen leest soorten"
on species for select
to authenticated
using (true);

-- Alleen admins mogen soorten aanmaken of bewerken
create policy "Alleen admins upserten soorten"
on species for insert
to authenticated
with check (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.rol = 'admin'
  )
);

create policy "Alleen admins updaten soorten"
on species for update
to authenticated
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.rol = 'admin'
  )
);

-- Alleen admins mogen soorten verwijderen
create policy "Alleen admins verwijderen soorten"
on species for delete
to authenticated
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.rol = 'admin'
  )
);
```

## vangsten

Gebruikers mogen alleen hun eigen vangsten lezen, aanmaken, bewerken en verwijderen.

```sql
create policy "Eigen vangsten lezen"
on vangsten for select
to authenticated
using (user_id = auth.uid());

create policy "Eigen vangsten aanmaken"
on vangsten for insert
to authenticated
with check (user_id = auth.uid());

create policy "Eigen vangsten bewerken"
on vangsten for update
to authenticated
using (user_id = auth.uid());

create policy "Eigen vangsten verwijderen"
on vangsten for delete
to authenticated
using (user_id = auth.uid());
```

## profiles

Gebruikers mogen alleen hun eigen profiel lezen en bewerken.
Admins mogen alle profielen lezen (voor gebruikersbeheer).

```sql
create policy "Eigen profiel lezen"
on profiles for select
to authenticated
using (
  id = auth.uid()
  or exists (
    select 1 from profiles p
    where p.id = auth.uid() and p.rol = 'admin'
  )
);

create policy "Eigen profiel bewerken"
on profiles for update
to authenticated
using (id = auth.uid());
```

## species_overrides

Gebruikers mogen alleen hun eigen overrides beheren.

```sql
create policy "Eigen overrides lezen"
on species_overrides for select
to authenticated
using (user_id = auth.uid());

create policy "Eigen overrides upserten"
on species_overrides for insert
to authenticated
with check (user_id = auth.uid());

create policy "Eigen overrides updaten"
on species_overrides for update
to authenticated
using (user_id = auth.uid());

create policy "Eigen overrides verwijderen"
on species_overrides for delete
to authenticated
using (user_id = auth.uid());
```

## veld_config

Veldconfiguratie is leesbaar voor alle gebruikers, maar alleen schrijfbaar door admins.

```sql
create policy "Iedereen leest veldconfig"
on veld_config for select
to authenticated
using (true);

create policy "Alleen admins beheren veldconfig"
on veld_config for all
to authenticated
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.rol = 'admin'
  )
);
```

## Verificatie

Controleer in het Supabase-dashboard (Authentication → Policies) of alle bovenstaande policies actief zijn.
Let in het bijzonder op de `species`-tabel: de DELETE-policy is cruciaal om te voorkomen
dat ringers soorten kunnen verwijderen vanuit de soortdetailpagina.
