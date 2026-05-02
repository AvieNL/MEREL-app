-- Volledige RLS-setup voor de species-tabel:
--   SELECT: iedereen (ook anoniem) — vogeldata is publiek
--   INSERT/UPDATE/DELETE: alleen admin-gebruikers

-- Verwijder eventuele bestaande policies
DROP POLICY IF EXISTS "species_public_read"  ON species;
DROP POLICY IF EXISTS "species_admin_insert" ON species;
DROP POLICY IF EXISTS "species_admin_update" ON species;
DROP POLICY IF EXISTS "species_admin_delete" ON species;

-- Publiek lezen
CREATE POLICY "species_public_read" ON species
  FOR SELECT USING (true);

-- Admin schrijven (INSERT / UPDATE / DELETE)
CREATE POLICY "species_admin_insert" ON species
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.rol = 'admin'
    )
  );

CREATE POLICY "species_admin_update" ON species
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.rol = 'admin'
    )
  );

CREATE POLICY "species_admin_delete" ON species
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.rol = 'admin'
    )
  );
