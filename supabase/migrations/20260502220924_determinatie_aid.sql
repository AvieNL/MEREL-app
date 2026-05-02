-- Determinatie-hulpen tabel
-- Slaat aid-definities op als JSONB (zonder JS-functies; die worden client-side geïnjecteerd).
-- De 'id' kolom is de primaire sleutel (bijv. 'roek-geslacht', 'roek-leeftijd').

CREATE TABLE IF NOT EXISTS determinatie_aid (
  id   TEXT PRIMARY KEY,
  data JSONB NOT NULL
);

-- Iedereen mag lezen; alleen service_role mag schrijven (via scripts of admin)
ALTER TABLE determinatie_aid ENABLE ROW LEVEL SECURITY;

CREATE POLICY "determinatie_aid_public_read"
  ON determinatie_aid FOR SELECT
  USING (true);
