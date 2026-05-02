-- Fase 2: euring_code als primaire sleutel voor species-tabel
-- Veilig: naam_nl blijft als UNIQUE constraint (app werkt ongewijzigd)

-- Stap 1: voeg euring_code als kolom toe (gevuld vanuit de JSON-blob)
ALTER TABLE species ADD COLUMN IF NOT EXISTS euring_code TEXT;
UPDATE species SET euring_code = data->>'euring_code' WHERE euring_code IS NULL;
ALTER TABLE species ALTER COLUMN euring_code SET NOT NULL;

-- Stap 2: unieke index op euring_code
CREATE UNIQUE INDEX IF NOT EXISTS species_euring_code_key ON species(euring_code);

-- Stap 3: unieke constraint op naam_nl behouden (was al PK, dus al uniek)
ALTER TABLE species ADD CONSTRAINT species_naam_nl_unique UNIQUE (naam_nl);

-- Stap 4: drop de huidige primary key (naam_nl) en maak euring_code de nieuwe PK
ALTER TABLE species DROP CONSTRAINT IF EXISTS species_pkey;
ALTER TABLE species ADD PRIMARY KEY (euring_code);

-- Stap 5: naam_nl index opschonen (constraint hierboven regelt het al)
DROP INDEX IF EXISTS species_euring_code_key;
