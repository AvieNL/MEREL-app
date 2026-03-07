-- Fix: verwijder hardcoded project-IDs ('tuin', 'overig', 'nk027') uit Supabase
-- die conflicteren met de RLS-policy omdat ze geen geldig user_id hebben
-- of van een andere gebruiker zijn.
--
-- Na uitvoeren: de app maakt bij eerste login nieuwe projecten aan met UUID-IDs.

DELETE FROM public.projecten
WHERE id IN ('tuin', 'overig', 'nk027');
