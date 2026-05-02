-- Fase 2 fix: voeg publieke SELECT policy toe aan species-tabel.
-- species bevat openbare vogeldata (geen gebruikersdata) en moet leesbaar zijn
-- voor de anonieme sleutel zodat de app soorten kan ophalen.

ALTER TABLE species ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "species_public_read" ON species;
CREATE POLICY "species_public_read" ON species FOR SELECT USING (true);
