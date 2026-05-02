-- Biometrie aanvullen vanuit 30-3-2026_0857_3254.xlsx
-- Vult ALLEEN lege velden aan — overschrijft nooit bestaande waarden
-- Filter: bron = 'griel_import' + ringnummer + vangstdatum
-- Beide datumformaten worden geprobeerd (yyyy-mm-dd en dd-mm-yyyy)

BEGIN;

-- winterkoning | ARX....562 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '50,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '9,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '37,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....562'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zanglijster | L...588730 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '120,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '69,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '21TV5954'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '88,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588730'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BP...56801 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '14,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56801'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BP...56802 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56802'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BP...56803 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56803'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BP...56804 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56804'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BP...56805 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56805'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BP...56806 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '60,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56806'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- winterkoning | ARX....564 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '52,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....564'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- winterkoning | ARX....565 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '50,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '37,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....565'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwarte mees | BP...56807 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '62,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '9,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '48,0'),
    'staartlengte', COALESCE(NULLIF(data->>'staartlengte', ''), '51,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'U'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56807'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BP...56808 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56808'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BP...56809 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '60,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56809'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BP...56810 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56810'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BP...56811 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '66,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '51,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'U'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56811'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56812 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56812'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwarte mees | BP...56813 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '59,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '9,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '45,0'),
    'staartlengte', COALESCE(NULLIF(data->>'staartlengte', ''), '46,5'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56813'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BP...56814 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '21,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '4'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56814'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56815 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56815'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56816 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56816'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ARX....566 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '54,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '6,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '46,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....566'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ARX....567 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '60,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '7,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '46,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....567'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- winterkoning | ARX....568 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '50,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '9,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '6'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '37,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....568'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- goudhaan | ARX....569 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '54,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '5,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '42,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....569'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- vink | V...982200 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '88,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '22,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '68,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '23'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'V...982200'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zanglijster | L...588731 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '119,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '64,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '21TV5982'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '90,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588731'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- winterkoning | ARX....563 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '49,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '7,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '36,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....563'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BP...56728 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56728'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BP...56729 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56729'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BP...56730 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56730'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwarte mees | BP...56731 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '62,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '8,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '47,0'),
    'staartlengte', COALESCE(NULLIF(data->>'staartlengte', ''), '47,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '1')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56731'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BP...56732 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '63,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '50,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56732'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BP...56733 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '68,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '21TV5827'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '52,5'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56733'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BP...56734 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '67,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '51,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56734'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56735 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56735'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BP...56736 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '64,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '49,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56736'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwarte mees | BP...56737 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '63,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '9,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '48,0'),
    'staartlengte', COALESCE(NULLIF(data->>'staartlengte', ''), '47,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56737'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56738 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '78,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56738'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56739 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56739'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56740 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56740'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwarte mees | BP...56741 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '60,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '8,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '47,0'),
    'staartlengte', COALESCE(NULLIF(data->>'staartlengte', ''), '45,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56741'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwarte mees | BP...56742 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '61,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '8,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '46,5'),
    'staartlengte', COALESCE(NULLIF(data->>'staartlengte', ''), '48,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56742'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BP...56743 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '67,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '51,5'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56743'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BP...56744 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56744'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56745 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56745'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56746 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56746'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BP...56747 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56747'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56748 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56748'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56749 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56749'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56750 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56750'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- geelgors | Y...041101 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '87,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '27,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '68,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'Y...041101'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BL...92949 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BL...92949'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- goudvink | V...981999 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '83,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '22,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '60,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'V...981999'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BP...56500 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '64,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '47,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56500'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BP...56695 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '65,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '48,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '1')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56695'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BL...92988 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '67,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '51,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BL...92988'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BP...56694 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '65,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '50,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56694'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56093 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56093'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BJ...47459 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BJ...47459'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56144 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56144'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56067 | 10-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56067'
  AND (vangstdatum = '2021-10-10' OR vangstdatum = '10-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BP...56863 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '6'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'U'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56863'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BP...56864 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'U'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56864'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BP...56865 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '13,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56865'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BP...56866 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56866'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwarte mees | BP...56867 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '63,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '50,5'),
    'staartlengte', COALESCE(NULLIF(data->>'staartlengte', ''), '53,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56867'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- heggenmus | BP...56868 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '20,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56868'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BP...56869 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56869'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwarte mees | BP...56870 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '61,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '9,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '47,0'),
    'staartlengte', COALESCE(NULLIF(data->>'staartlengte', ''), '45,5'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56870'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BP...56871 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '13,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56871'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BP...56872 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '22,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '4'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56872'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...588740 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '130,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '107,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '21TV7330'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '97,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588740'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...588741 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '125,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '91,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '4'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '21TV7339'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '94,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588741'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- vink | Y...041102 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '91,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '20,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '72,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'Y...041102'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- gaai | ...1653463 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '184,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '168,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '6'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '21TV7310'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '129,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '...1653463'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- winterkoning | ARX....568 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '50,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '9,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '37,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....568'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56392 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56392'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BL...92730 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '80,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BL...92730'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...588651 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '128,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '95,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '21TV7328'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '96,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588651'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- goudhaan | ARX....578 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '55,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '38,5'),
    'staartlengte', COALESCE(NULLIF(data->>'staartlengte', ''), '42,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....578'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BP...56906 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56906'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BP...56907 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56907'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56908 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56908'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwarte mees | BP...56909 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '66,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '51,0'),
    'staartlengte', COALESCE(NULLIF(data->>'staartlengte', ''), '49,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56909'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56910 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '79,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56910'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56911 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,5'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56911'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- heggenmus | BP...56912 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '69,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '52,5'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56912'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BP...56913 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56913'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BP...56914 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56914'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56915 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56915'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BP...56916 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '66,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '51,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56916'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56489 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56489'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56904 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56904'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BL...92995 | 17-10-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BL...92995'
  AND (vangstdatum = '2021-10-17' OR vangstdatum = '17-10-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...588746 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '132,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '97,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '21TV7831'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '100,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588746'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- goudvink | Y...041112 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '85,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '25,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '65,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'Y...041112'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...588748 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '130,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '103,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '21TV7834'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '98,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588748'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- grote bonte specht | L...588750 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '133,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '76,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '105,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588750'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BP...56980 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56980'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56981 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '80,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56981'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BP...56982 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56982'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BP...56983 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56983'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BP...56984 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '13,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56984'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BP...56985 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56985'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BP...56986 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56986'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BP...56987 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '70,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '13,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56987'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- vink | Y...041110 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '87,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '21,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'Y...041110'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- vink | Y...041111 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '91,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '23,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '67,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '1')
  ),
  updated_at = now()
WHERE ringnummer = 'Y...041111'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...588747 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '133,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '94,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '21TV7274'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '99,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588747'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- winterkoning | ARX....589 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '48,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '8,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '32,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....589'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- grote bonte specht | L...588749 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '139,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '74,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '100,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588749'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56904 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '78,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56904'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56586 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56586'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- vink | V...982049 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '89,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '23,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '65,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'V...982049'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56311 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56311'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56345 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56345'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56592 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '14,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56592'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...588735 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '129,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '104,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '92,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588735'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56065 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '65,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56065'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BL...92950 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BL...92950'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56303 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56303'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BL...92830 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BL...92830'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- boomklever | V...982191 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '86,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '68,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'V...982191'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- grote bonte specht | L...588715 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '135,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '74,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '99,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588715'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56833 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56833'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56317 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '78,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56317'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BL...92985 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '63,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '9,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '50,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BL...92985'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- glanskop | BP...56875 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '64,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '40,5'),
    'staartlengte', COALESCE(NULLIF(data->>'staartlengte', ''), '55,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56875'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56461 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56461'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56067 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56067'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BL...92995 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BL...92995'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56299 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56299'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- vuurgoudhaan | ARX....597 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '52,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '4,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '40,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....597'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- vuurgoudhaan | ARX....598 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '54,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '6,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '41,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....598'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- vink | Y...041116 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '83,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '21,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '64,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'Y...041116'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...588751 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '131,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '93,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '21TV5983'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '99,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588751'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...588688 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '129,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '98,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '21TV5829'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '93,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588688'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- vuurgoudhaan | ARX....595 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '52,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '5,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '40,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....595'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwarte mees | BP...56494 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '61,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '9,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '48,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56494'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- glanskop | BP...56686 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '64,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '49,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56686'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BL...92664 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BL...92664'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BL...92830 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BL...92830'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56586 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56586'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56452 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56452'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BP...56351 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '66,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '50,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56351'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56022 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56022'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- vink | Y...041111 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '89,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '23,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '21TV5971'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '69,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'Y...041111'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56200 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56200'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56853 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56853'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56298 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56298'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BP...56023 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '68,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '41'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56023'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BP...56123 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '67,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '51,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56123'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BL...92912 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BL...92912'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BL...92549 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '65,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '50,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BL...92549'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56592 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,5'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56592'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- vink | V...981982 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '87,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '21,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '67,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'V...981982'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56016 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56016'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BJ...47877 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '78,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '60,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BJ...47877'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56299 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56299'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BL...92916 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '64,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '48,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BL...92916'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BP...56863 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56863'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BP...56070 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '66,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '51,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56070'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56832 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '78,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56832'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56766 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56766'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56592 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56592'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- keep | Y...041117 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '90,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '22,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '69,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'Y...041117'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- goudvink | Y...041118 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '85,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '23,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '65,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'Y...041118'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- vink | Y...041119 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '90,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '23,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '70,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'Y...041119'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- geelgors | Y...041120 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '86,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '29,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '65,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'Y...041120'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- vink | Y...041121 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '91,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '26,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '70,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'Y...041121'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- vink | Y...041122 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '91,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '23,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '70,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'Y...041122'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- vink | Y...041123 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '88,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '22,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '70,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'Y...041123'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- keep | Y...041124 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '89,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '23,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '4'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '69,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'Y...041124'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- vink | Y...041125 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '87,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '23,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '67,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'Y...041125'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BR...10001 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '78,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '60,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10001'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10002 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10002'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10003 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10003'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10004 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10004'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10005 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10005'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10006 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10006'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10007 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10007'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10008 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10008'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10009 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10009'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10010 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '70,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10010'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10011 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '13,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10011'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10012 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10012'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10013 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10013'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BR...10014 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '23'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10014'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BR...10015 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '78,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '60,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10015'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BR...10016 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '65,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '50,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '41'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10016'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10017 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10017'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10018 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '14,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '5'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10018'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10019 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '60,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10019'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10020 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '60,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10020'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10021 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10021'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10022 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10022'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BR...10023 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10023'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BR...10024 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '64,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,5'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10024'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BR...10025 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '64,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '50,0'),
    'staartlengte', COALESCE(NULLIF(data->>'staartlengte', ''), '55,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10025'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BR...10026 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '66,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10026'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10027 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '13,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10027'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10028 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '13,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10028'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10029 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10029'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10030 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10030'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10031 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10031'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10032 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10032'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10033 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '13,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10033'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10034 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10034'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10035 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10035'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10036 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10036'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BP...56988 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56988'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BP...56989 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56989'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56990 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56990'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BP...56991 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56991'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwarte mees | BP...56992 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '62,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '9,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '45,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56992'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56993 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56993'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BP...56994 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '65,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '50,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56994'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BP...56995 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '64,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '50,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56995'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56996 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56996'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BP...56997 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56997'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BP...56998 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56998'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BP...56999 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56999'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BP...57000 | 6-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '67,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '51,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...57000'
  AND (vangstdatum = '2021-11-6' OR vangstdatum = '6-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10111 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '13,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10111'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10112 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10112'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BR...10113 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '66,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '52,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10113'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10114 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10114'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10115 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10115'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BR...10116 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '67,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '52,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10116'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BR...10117 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '78,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '21TV2755'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '60,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10117'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10118 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '60,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10118'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BR...10119 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10119'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BR...10120 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10120'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10121 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10121'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10122 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '13,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10122'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10123 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10123'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10124 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10124'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10125 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10125'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10206 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10206'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BR...10207 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10207'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10208 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10208'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10209 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10209'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BR...10210 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '65,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '50,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10210'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10211 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '13,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10211'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10212 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10212'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BR...10213 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '65,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '50,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10213'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10214 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10214'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BR...10015 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '60,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10015'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BR...10203 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '67,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '50,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10203'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56993 | 20-11-2021
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56993'
  AND (vangstdatum = '2021-11-20' OR vangstdatum = '20-11-2021')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- heggenmus | BR...10042 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '67,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '50,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10042'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10130 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '60,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10130'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BR...10131 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10131'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BR...10132 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '79,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10132'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BR...10133 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '62,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '9,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '48,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10133'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BR...10134 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10134'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10135 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10135'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10136 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10136'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10137 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10137'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10138 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10138'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10139 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10139'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10140 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10140'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10141 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10141'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10142 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10142'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10143 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10143'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10144 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10144'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10145 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10145'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10146 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '69,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10146'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10147 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10147'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10148 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10148'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10149 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10149'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10150 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10150'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10151 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10151'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10152 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '13,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10152'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10153 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10153'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BR...10154 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10154'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BR...10155 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '78,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '60,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10155'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10156 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10156'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10157 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '13,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10157'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10158 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10158'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10159 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10159'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- boomkruiper | ARX....599 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '64,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '9,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '48,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....599'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BL...92983 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '64,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '49,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BL...92983'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- vink | V...981998 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '92,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '21,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '6'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '65,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'V...981998'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BJ...47787 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '9'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BJ...47787'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BL...92950 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '70,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BL...92950'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BL...92995 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BL...92995'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- grote bonte specht | L...588750 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '137,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '75,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '100,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588750'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- middelste bonte specht | H...391726 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '125,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '55,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '98,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'H...391726'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- boomklever | V...982182 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '83,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '20,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '63,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'V...982182'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- boomklever | V...981941 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '89,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '23,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '65,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'V...981941'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- vink | V...981982 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '87,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '66,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'V...981982'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- glanskop | BL...92733 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '62,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '13,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '46,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BL...92733'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BL...92168 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '79,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BL...92168'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- winterkoning | ARX....601 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '51,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '6'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '38,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'U'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....601'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ARX....602 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '62,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '7,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '47,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....602'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ARX....603 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '60,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '8,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '47,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....603'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ARX....604 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '60,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '7,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '46,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....604'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ARX....605 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '60,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '7,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '45,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'U'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....605'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- winterkoning | ARX....606 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '48,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '8,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '35,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'U'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....606'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- boomkruiper | ARX....607 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '60,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '8,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '45,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....607'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zanglijster | L...588753 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '126,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '71,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '92,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588753'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zanglijster | L...588754 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '115,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '70,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '22TV0884'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '86,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588754'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zanglijster | L...588755 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '116,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '66,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '4'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '22TV0885'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '84,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'U'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588755'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- grote bonte specht | L...588756 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '137,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '82,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '104,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588756'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...548951 | 13-4-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00')
  ),
  updated_at = now()
WHERE ringnummer = 'L...548951'
  AND (vangstdatum = '2022-4-13' OR vangstdatum = '13-4-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...548953 | 13-4-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00')
  ),
  updated_at = now()
WHERE ringnummer = 'L...548953'
  AND (vangstdatum = '2022-4-13' OR vangstdatum = '13-4-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...548954 | 13-4-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00')
  ),
  updated_at = now()
WHERE ringnummer = 'L...548954'
  AND (vangstdatum = '2022-4-13' OR vangstdatum = '13-4-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...548955 | 13-4-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '133,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '100,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '4'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '99,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '4'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...548955'
  AND (vangstdatum = '2022-4-13' OR vangstdatum = '13-4-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- huismus | V...981721 | 13-4-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '81,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '31,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '61,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'V...981721'
  AND (vangstdatum = '2022-4-13' OR vangstdatum = '13-4-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- huismus | V...981722 | 13-4-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '81,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '29,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '61,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'V...981722'
  AND (vangstdatum = '2022-4-13' OR vangstdatum = '13-4-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- huismus | V...981723 | 13-4-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '79,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '30,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'V...981723'
  AND (vangstdatum = '2022-4-13' OR vangstdatum = '13-4-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- huismus | V...981724 | 13-4-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '28,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '4'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'V...981724'
  AND (vangstdatum = '2022-4-13' OR vangstdatum = '13-4-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- huismus | V...981725 | 13-4-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '80,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '26,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'V...981725'
  AND (vangstdatum = '2022-4-13' OR vangstdatum = '13-4-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- huismus | V...981726 | 13-4-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '26,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,5'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '1'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'V...981726'
  AND (vangstdatum = '2022-4-13' OR vangstdatum = '13-4-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- huismus | V...981727 | 13-4-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '81,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '28,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '60,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'V...981727'
  AND (vangstdatum = '2022-4-13' OR vangstdatum = '13-4-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- huismus | V...981728 | 13-4-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '79,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '27,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '1')
  ),
  updated_at = now()
WHERE ringnummer = 'V...981728'
  AND (vangstdatum = '2022-4-13' OR vangstdatum = '13-4-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BJ...45653 | 13-4-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '67,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '13,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '51,5'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '4'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'B'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BJ...45653'
  AND (vangstdatum = '2022-4-13' OR vangstdatum = '13-4-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BJ...45654 | 13-4-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '70,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '4'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'B'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BJ...45654'
  AND (vangstdatum = '2022-4-13' OR vangstdatum = '13-4-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BJ...45655 | 13-4-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '78,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BJ...45655'
  AND (vangstdatum = '2022-4-13' OR vangstdatum = '13-4-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...548956 | 13-4-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '135,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '90,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'cloaca', COALESCE(NULLIF(data->>'cloaca', ''), '0'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '99,5'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '1'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '31'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...548956'
  AND (vangstdatum = '2022-4-13' OR vangstdatum = '13-4-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- winterkoning | APN....138 | 13-4-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '55,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'cloaca', COALESCE(NULLIF(data->>'cloaca', ''), '0'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '40,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'APN....138'
  AND (vangstdatum = '2022-4-13' OR vangstdatum = '13-4-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...548953 | 26-4-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '110,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '80,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '73,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...548953'
  AND (vangstdatum = '2022-4-26' OR vangstdatum = '26-4-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...548957 | 5-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '66,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '68,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00')
  ),
  updated_at = now()
WHERE ringnummer = 'L...548957'
  AND (vangstdatum = '2022-5-5' OR vangstdatum = '5-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...548958 | 5-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '55,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '59,1')
  ),
  updated_at = now()
WHERE ringnummer = 'L...548958'
  AND (vangstdatum = '2022-5-5' OR vangstdatum = '5-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...548959 | 5-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '69,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '64,6')
  ),
  updated_at = now()
WHERE ringnummer = 'L...548959'
  AND (vangstdatum = '2022-5-5' OR vangstdatum = '5-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...548960 | 5-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '76,3')
  ),
  updated_at = now()
WHERE ringnummer = 'L...548960'
  AND (vangstdatum = '2022-5-5' OR vangstdatum = '5-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ARX....625 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '61,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '8,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '4'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '46,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....625'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- winterkoning | ARX....601 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '54,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '7'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '37,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '1'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....601'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- winterkoning | ARX....524 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '47,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '9'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '34,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '1'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....524'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- winterkoning | APL....755 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '51,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '9'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '39,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '1'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '32'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'APL....755'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zanglijster | L...588755 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '112,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '69,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '85,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '1'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588755'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...588703 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '123,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '78,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '8'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '97,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '1'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588703'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tuinfluiter | BJ...47594 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '22TV0852'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '3'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BJ...47594'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tuinfluiter | BJ...47924 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '78,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '61,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '6'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BJ...47924'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- heggenmus | BJ...47769 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '22,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '1'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'C'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '10'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BJ...47769'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...548961 | 6-7-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '110,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '74,5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '75,5'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00')
  ),
  updated_at = now()
WHERE ringnummer = 'L...548961'
  AND (vangstdatum = '2022-7-6' OR vangstdatum = '6-7-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ARX....724 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '62,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '7,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '4'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '47,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....724'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ARX....725 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '61,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '7,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '47,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....725'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ARX....726 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '62,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '7,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '47,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....726'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- winterkoning | ARX....722 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '51,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '1')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....722'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- heggenmus | BJ...47769 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '22,7'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '22TV1843'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '12')
  ),
  updated_at = now()
WHERE ringnummer = 'BJ...47769'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...549020 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '129,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '104,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '22TV0471'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '88,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...549020'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zanglijster | L...548962 | 5-6-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '80,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '50,7'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '46,0')
  ),
  updated_at = now()
WHERE ringnummer = 'L...548962'
  AND (vangstdatum = '2023-6-5' OR vangstdatum = '5-6-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zanglijster | L...548963 | 5-6-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '70,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '45,5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '41,0')
  ),
  updated_at = now()
WHERE ringnummer = 'L...548963'
  AND (vangstdatum = '2023-6-5' OR vangstdatum = '5-6-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zanglijster | L...548964 | 5-6-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '80,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '55,1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '47,0')
  ),
  updated_at = now()
WHERE ringnummer = 'L...548964'
  AND (vangstdatum = '2023-6-5' OR vangstdatum = '5-6-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zanglijster | L...548965 | 5-6-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '51,0'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '47,0')
  ),
  updated_at = now()
WHERE ringnummer = 'L...548965'
  AND (vangstdatum = '2023-6-5' OR vangstdatum = '5-6-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...548966 | 28-6-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '62,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '63,8')
  ),
  updated_at = now()
WHERE ringnummer = 'L...548966'
  AND (vangstdatum = '2023-6-28' OR vangstdatum = '28-6-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...548967 | 28-6-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '58,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '60,6')
  ),
  updated_at = now()
WHERE ringnummer = 'L...548967'
  AND (vangstdatum = '2023-6-28' OR vangstdatum = '28-6-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...548968 | 28-6-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '59,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '64,9')
  ),
  updated_at = now()
WHERE ringnummer = 'L...548968'
  AND (vangstdatum = '2023-6-28' OR vangstdatum = '28-6-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...548969 | 28-6-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '49,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '51,7')
  ),
  updated_at = now()
WHERE ringnummer = 'L...548969'
  AND (vangstdatum = '2023-6-28' OR vangstdatum = '28-6-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- fitis | AKY....098 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '67,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '8,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '51,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'AKY....098'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | AKY....099 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '56,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '6,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '42,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'AKY....099'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zanglijster | K...669824 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '120,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '77,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '23B10677'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '90,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'K...669824'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- groene specht | ...1653470 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '165,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '185,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '23B10195'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '120,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '...1653470'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ARX....502 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '54,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '6,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpen_score', COALESCE(NULLIF(data->>'handpen_score', ''), '28'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '41,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'ARX....502'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- winterkoning | AKY....061 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '52,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '9,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '11'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '38,5'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'AKY....061'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- grote bonte specht | K...669865 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '136,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '80,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '8'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '104,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '3'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'K...669865'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zanglijster | K...669864 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '119,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '67,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B00228'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '90,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'K...669864'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | AKY....027 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '62,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '8,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '48,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'AKY....027'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- winterkoning | AKY....061 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '52,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '9,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '37,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'AKY....061'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BL...92148 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '78,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '8'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BL...92148'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | K...669826 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '129,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '84,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B00225'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '95,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'K...669826'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...588679 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '138,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '89,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B00224'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '98,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588679'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | AKY....067 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '60,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '7,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '8'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '46,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'AKY....067'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- winterkoning | AKY....060 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '51,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '36,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'AKY....060'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BJ...47787 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B00219'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BJ...47787'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | K...669872 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '131,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '89,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '9'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B00180'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '96,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '14'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'K...669872'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | K...669873 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '130,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '86,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B00178'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '96,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'K...669873'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- buizerd | ...6217761 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '385,0'),
    'kop_snavel', COALESCE(NULLIF(data->>'kop_snavel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '670,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B00176'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '295,0'),
    'staartlengte', COALESCE(NULLIF(data->>'staartlengte', ''), '205,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '...6217761'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- ijsvogel | P....45368 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '79,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '38,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,5'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'P....45368'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- winterkoning | AKY....012 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '50,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '8'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '38,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'AKY....012'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10160 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10160'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10161 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10161'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10162 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10162'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10163 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10163'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10164 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10164'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10165 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10165'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10166 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10166'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10167 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10167'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10168 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10168'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10169 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10169'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10170 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10170'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10171 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10171'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10172 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10172'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10173 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '4'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10173'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BR...10174 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10174'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sijs | BR...10175 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '14,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10175'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56848 | 27-2-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '78,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '60,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56848'
  AND (vangstdatum = '2022-2-27' OR vangstdatum = '27-2-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56299 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56299'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BR...10219 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '70,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '52,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10219'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BR...10102 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '4'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '52,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10102'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BR...10132 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10132'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BR...10047 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10047'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56573 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56573'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BP...56541 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '4'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56541'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | 57V..30788 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '57V..30788'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56815 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '70,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56815'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56722 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56722'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56498 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56498'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BP...56302 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '20,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '60,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56302'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- rietgors | BR...10176 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '80,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '61,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10176'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BR...10177 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10177'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BR...10178 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '63,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '49,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'C'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10178'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BR...10179 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '6'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10179'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BR...10180 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '78,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10180'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- glanskop | BR...10181 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '65,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '45,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10181'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- glanskop | BR...10182 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '64,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '47,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'C'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10182'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- heggenmus | BR...10183 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '69,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '51,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'U'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10183'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BR...10184 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10184'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BR...10185 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10185'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BR...10186 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10186'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BR...10187 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '52,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10187'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BR...10188 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10188'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BR...10189 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10189'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BR...10190 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10190'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BR...10191 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10191'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BR...10192 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,5'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10192'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborsttapuit | BR...10193 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '66,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '49,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10193'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- heggenmus | BR...10194 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '70,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '23,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '5'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '4'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '52,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'U'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10194'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BR...10226 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10226'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- grote bonte specht | L...588757 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '130,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '80,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '100,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588757'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zanglijster | L...588758 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '118,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '72,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '7'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '22TV0886'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '90,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588758'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- grote bonte specht | L...588759 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '137,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '77,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '103,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588759'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- geelgors | Y...041130 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '82,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '26,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '62,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'Y...041130'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- vink | Y...041131 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '90,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '22,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '70,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'Y...041131'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- geelgors | Y...041132 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '83,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '25,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '65,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'Y...041132'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- vink | Y...041133 | 27-3-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '88,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '22,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '68,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'Y...041133'
  AND (vangstdatum = '2022-3-27' OR vangstdatum = '27-3-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BR...10246 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '69,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '4'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '1')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10246'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BR...10247 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10247'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BR...10248 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '23,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '5'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10248'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BR...10249 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '7'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '4'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10249'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BR...10250 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '7'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '51,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '4'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10250'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BR...10251 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,5'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '1'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10251'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BR...10252 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '62,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '47,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '4'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'B'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10252'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BR...10253 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10253'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BR...10254 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '21,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '4'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,5'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10254'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- grote bonte specht | L...588764 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '136,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '88,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '21TV8920'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '104,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '6'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588764'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- grasmus | BP...56014 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '69,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,5'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '1'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BP...56014'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BR...10179 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '69,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '21,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '9'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '52,5'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '5'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10179'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zanglijster | L...588758 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '117,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '75,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '7'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '84,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '6'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '14')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588758'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BR...10242 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10242'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BR...10243 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '69,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '7'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '4'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10243'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BR...10196 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,5'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '1'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '1')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10196'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BR...10239 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '22TV0853'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '3'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10239'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | 57V..30788 | 22-5-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '8'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '5'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00')
  ),
  updated_at = now()
WHERE ringnummer = '57V..30788'
  AND (vangstdatum = '2022-5-22' OR vangstdatum = '22-5-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...588848 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '128,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '95,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '22TV1840'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '98,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '1')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588848'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33030 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '69,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '51,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33030'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33031 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '52,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '1')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33031'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...33032 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33032'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tuinfluiter | BT...33033 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33033'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...33034 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33034'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33035 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33035'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33036 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '22TV1842'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '0')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33036'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33037 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33037'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33038 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '50,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33038'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...33039 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,5'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33039'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...33040 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33040'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33041 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '20,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '1')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33041'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33042 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '22TV1839'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33042'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33043 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33043'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33044 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33044'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33045 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33045'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33046 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33046'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BT...33047 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '65,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '48,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33047'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33048 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33048'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33049 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33049'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- kleine karekiet | BT...33050 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '66,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '50,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33050'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BT...33051 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '66,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '51,5'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33051'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33052 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33052'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BT...33053 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '65,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '4'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '47,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33053'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33054 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '25,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '5'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33054'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33055 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33055'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- kleine karekiet | BT...33056 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '68,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '52,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '1')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33056'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33057 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '22TV0472'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33057'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33058 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33058'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33059 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '21,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33059'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33060 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33060'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BT...33061 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '66,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '49,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33061'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33062 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '22TV0474'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '1')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33062'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- merel | L...588847 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '126,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '97,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '22TV1841'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '93,5'),
    'geslachtsbepaling', COALESCE(NULLIF(data->>'geslachtsbepaling', ''), 'P'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588847'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zanglijster | L...588846 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '115,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '22TV0473'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '83,5'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '1')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588846'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zanglijster | L...588845 | 26-9-2022
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '115,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '85,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '1')
  ),
  updated_at = now()
WHERE ringnummer = 'L...588845'
  AND (vangstdatum = '2022-9-26' OR vangstdatum = '26-9-2022')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33886 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '70,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33886'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33887 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33887'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33888 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '23B10731'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33888'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- kleine karekiet | BT...33889 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '65,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '49,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33889'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- kleine karekiet | BT...33890 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '66,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '23B10730'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '49,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33890'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- kleine karekiet | BT...33891 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '68,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '13,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '21TV6661'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '51,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33891'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- kleine karekiet | BT...33892 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '65,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '49,5'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '1')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33892'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33893 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33893'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- kleine karekiet | BT...33894 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '69,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '52,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33894'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33895 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33895'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33896 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33896'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...33897 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '70,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '11'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '51,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33897'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33898 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33898'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...33899 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '11'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '52,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33899'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33900 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33900'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33901 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '11'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33901'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33902 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33902'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33903 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '11'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33903'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- grasmus | BT...33904 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '13,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33904'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33905 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '11'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,5'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33905'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...33906 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33906'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...33907 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33907'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33908 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33908'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- grauwe vliegenvanger | BT...33909 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '87,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '13,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '23B10679'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '67,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '1')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33909'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- rietzanger | BT...33910 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '66,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '13,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '4'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '23B10678'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '49,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33910'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33911 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '11'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33911'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...33912 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33912'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tuinfluiter | BT...33913 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '83,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '22,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '11'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '60,5'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33913'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33914 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33914'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...33915 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '11'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33915'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...33916 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '14,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '11'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33916'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33917 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,5'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33917'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33918 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33918'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...33919 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '52,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33919'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- kleine karekiet | BT...33920 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '63,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '47,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33920'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...33921 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33921'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33922 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '78,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33922'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33923 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33923'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33924 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33924'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tuinfluiter | BT...33925 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '82,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '61,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '1')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33925'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sprinkhaanzanger | BT...33926 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '65,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '23B10197'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '49,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33926'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33927 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33927'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- grasmus | BT...33928 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '14,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '11'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33928'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33929 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33929'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- grasmus | BT...33930 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '14,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '41'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33930'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33931 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33931'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- kleine karekiet | BT...33932 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '64,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '47,5'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33932'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- kleine karekiet | BT...33933 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '69,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '52,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33933'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33934 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33934'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33935 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33935'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33936 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33936'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tuinfluiter | BT...33937 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,5'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33937'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33938 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33938'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tuinfluiter | BT...33939 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '80,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '22,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '60,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33939'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33940 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33940'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33941 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33941'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...33942 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33942'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33943 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '4'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33943'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- kleine karekiet | BT...33944 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '67,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '51,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33944'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...33945 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33945'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- vink | BT...33946 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '85,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '22,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpen_score', COALESCE(NULLIF(data->>'handpen_score', ''), '40'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33946'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33947 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33947'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33948 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '70,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33948'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33949 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33949'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...33950 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '78,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,5'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33950'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33951 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '4'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33951'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tuinfluiter | BT...33952 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '50'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33952'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33953 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '45'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33953'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- goudvink | Y...041244 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '82,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '21,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '64,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'Y...041244'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...33601 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '11'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '23B10680'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '51,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33601'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33602 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '80,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpen_score', COALESCE(NULLIF(data->>'handpen_score', ''), '30'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '60,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33602'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- grasmus | BT...33842 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '70,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '52,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33842'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...33877 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33877'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...33774 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,5'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33774'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33859 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33859'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...33141 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '23B10196'),
    'handpen_score', COALESCE(NULLIF(data->>'handpen_score', ''), '40'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33141'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...33784 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33784'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- glanskop | BT...33019 | 20-8-2023
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '62,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '46,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33019'
  AND (vangstdatum = '2023-8-20' OR vangstdatum = '20-8-2023')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26608A | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '55,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '9,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '41,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26608A'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26609A | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '61,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '7,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '46,5'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = '....26609A'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26610A | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '62,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '7,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '46,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26610A'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26611A | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '60,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '7,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '45,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26611A'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26612A | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '55,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '6,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '42,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26612A'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26613A | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '57,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '7,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '8'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '43,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26613A'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26614A | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '55,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '7,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '8'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '41,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '3'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26614A'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26615A | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '55,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '7,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '42,5'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '3'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26615A'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- heggenmus | BT...62560 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B00231'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,5'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '1'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62560'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62561 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '78,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B00229'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62561'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62562 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '8'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62562'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...62563 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '8'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '4'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62563'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62564 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B00227'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62564'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BT...62565 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '66,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '49,5'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '3'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62565'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BT...62566 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '64,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '9,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '48,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '3'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62566'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62567 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '20,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '3'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62567'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...62568 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62568'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...62569 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62569'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...62570 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '7'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '3'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62570'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62571 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '8'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B00222'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62571'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...62572 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62572'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62573 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62573'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...62574 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '78,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '9'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B00220'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62574'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...62575 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62575'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...62576 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '4'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62576'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BT...62577 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '64,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '7'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '48,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '3'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62577'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62578 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B00218'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,5'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62578'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62579 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '4'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,5'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62579'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BT...33639 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '67,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '3'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B00234'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '52,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33639'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...62451 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '79,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B00233'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '60,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62451'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...62557 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '22,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '8'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B00232'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '51,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '4'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62557'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...33774 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '7'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B00230'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33774'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BT...33870 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '63,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '48,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '3'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33870'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62051 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B00226'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62051'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...33677 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '52,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33677'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- heggenmus | BT...62457 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B00223'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,5'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62457'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...62139 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '7'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '3'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62139'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BR...10356 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '14,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '5'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B00221'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10356'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BR...10179 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '23,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '9'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '4'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10179'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BT...33438 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '67,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '7'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '50,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33438'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...33423 | 14-4-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '20,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,5'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '00'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33423'
  AND (vangstdatum = '2024-4-14' OR vangstdatum = '14-4-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...62688 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62688'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62689 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62689'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62690 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '52,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62690'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62691 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '8'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '52,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62691'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62692 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62692'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62693 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62693'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62694 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62694'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- bonte vliegenvanger | BT...62695 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '81,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpen_score', COALESCE(NULLIF(data->>'handpen_score', ''), '27'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '61,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '7'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62695'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...62696 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62696'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- bonte vliegenvanger | BT...62697 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62697'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tuinfluiter | BT...62698 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '81,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '7'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62698'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62699 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '7'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62699'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...62700 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62700'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62701 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62701'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...62702 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '7'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62702'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...62703 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B00177'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62703'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62704 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62704'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- bonte vliegenvanger | BT...62705 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '81,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '61,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62705'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62706 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62706'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...62707 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62707'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26659A | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '55,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '6,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '41,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26659A'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- fitis | ....26660A | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '68,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '7,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '51,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26660A'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26661A | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '62,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '7,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '41,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26661A'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26662A | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '54,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '6,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '40,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26662A'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26663A | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '58,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '6,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '44,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26663A'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26664A | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '60,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '6,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '45,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26664A'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- winterkoning | ....26665A | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '46,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '8,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '34,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26665A'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26666A | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '60,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '7,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '45,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26666A'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26667A | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '55,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '6,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '40,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26667A'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26668A | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '55,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '6,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '42,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26668A'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26669A | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '58,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '6,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '44,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26669A'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26670A | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '62,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '8,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '47,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26670A'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26671A | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '60,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '7,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '46,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26671A'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26672A | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '57,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '7,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '4'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '42,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26672A'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- staartmees | ....26673A | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '60,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '8,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpen_score', COALESCE(NULLIF(data->>'handpen_score', ''), '28'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '6'),
    'staartlengte', COALESCE(NULLIF(data->>'staartlengte', ''), '73,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26673A'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26674A | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '59,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '6,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '44,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '0')
  ),
  updated_at = now()
WHERE ringnummer = '....26674A'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26675A | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '57,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '6,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '43,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26675A'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...62650 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62650'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...62672 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '4'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '52,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62672'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tuinfluiter | BT...33591 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '82,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '4'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '61,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '7'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33591'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62676 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '33'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62676'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33497 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '6'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B00179'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '6'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33497'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62686 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '20,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '7'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62686'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...62654 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '4'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '52,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62654'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tuinfluiter | BT...33476 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '81,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '61,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '6'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33476'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- staartmees | BR...10241 | 7-7-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '64,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '8,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpen_score', COALESCE(NULLIF(data->>'handpen_score', ''), '17'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '48,0'),
    'broedvlek', COALESCE(NULLIF(data->>'broedvlek', ''), '7'),
    'staartlengte', COALESCE(NULLIF(data->>'staartlengte', ''), '80,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10241'
  AND (vangstdatum = '2024-7-7' OR vangstdatum = '7-7-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62913 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62913'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...62914 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '14,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62914'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62915 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62915'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62916 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62916'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tuinfluiter | BT...62917 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '80,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62917'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62918 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62918'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...62919 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62919'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62920 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62920'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62921 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62921'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62922 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62922'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62923 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62923'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...62924 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62924'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62925 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62925'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- kleine karekiet | BT...62926 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '66,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62926'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62927 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62927'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62928 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '20,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62928'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62929 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62929'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62930 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '20,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62930'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62931 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '22,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62931'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62932 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62932'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...62933 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62933'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62934 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62934'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...62935 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '14,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62935'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...62936 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '15,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62936'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tuinfluiter | BT...62937 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '81,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62937'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62938 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62938'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62939 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62939'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...62940 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '14,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62940'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62941 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62941'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BT...62942 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '66,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62942'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BT...62943 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '70,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '12,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62943'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- glanskop | BT...62944 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '65,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62944'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62945 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62945'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tuinfluiter | BT...62946 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '79,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62946'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62947 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '21,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62947'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...62948 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '84,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62948'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...62949 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62949'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62950 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62950'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- grasmus | BT...62951 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62951'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62952 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62952'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tuinfluiter | BT...62953 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '82,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '20,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '4'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '61,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62953'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- kleine karekiet | BT...62954 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '66,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62954'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62955 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '4'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '4'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62955'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- vink | BT...62956 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '78,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '20,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'handpen_score', COALESCE(NULLIF(data->>'handpen_score', ''), '33'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62956'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62957 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '79,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '60,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62957'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BT...62958 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '66,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62958'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...62959 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62959'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62960 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62960'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BT...62961 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '65,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62961'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...62962 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '72,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '16,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B09653'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '52,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62962'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62963 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62963'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62964 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '79,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,1'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '58,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62964'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62965 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62965'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62966 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '54,5'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62966'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62967 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B09656'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62967'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62968 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B09654'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62968'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62969 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B09657'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62969'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...62970 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '78,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62970'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62971 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B09658'),
    'handpen_score', COALESCE(NULLIF(data->>'handpen_score', ''), '18'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '59,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62971'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- vink | BT...62972 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '82,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '20,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62972'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- roodborst | BT...62973 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '14,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B01388'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62973'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62974 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62974'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62975 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '55,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62975'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tuinfluiter | BT...62976 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '78,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62976'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62977 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '56,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62977'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62978 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '71,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '53,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62978'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62979 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62979'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62980 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62980'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- sprinkhaanzanger | BT...62981 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '68,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '13,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '4'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '49,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62981'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BT...62982 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62982'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62983 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62983'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zanglijster | H...391741 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '115,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '71,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24B09650'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '88,0'),
    'handicap', COALESCE(NULLIF(data->>'handicap', ''), '11'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'H...391741'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26721A | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '56,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '6,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26721A'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26722A | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '56,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '6,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '4'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '42,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26722A'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26723A | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '56,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '5,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26723A'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26730A | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '54,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '6,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = '....26730A'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26731A | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '59,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '7,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '1'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = '....26731A'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- geelgors | Y...041305 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '86,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '25,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = 'Y...041305'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- winterkoning | AKY....182 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '58,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '8,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '34,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'AKY....182'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- tjiftjaf | ....26649A | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '61,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '7,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '3')
  ),
  updated_at = now()
WHERE ringnummer = '....26649A'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...62702 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '76,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '18,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62702'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BR...10912 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '73,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,7'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '12'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BR...10912'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62722 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '65,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62722'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...62683 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,2'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '1'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62683'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...62584 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,3'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '57,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62584'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- zwartkop | BT...33792 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,4'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33792'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...62799 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62799'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...62812 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62812'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...62765 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '77,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '3'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62765'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BT...62889 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '65,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,5'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '1'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '0'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '49,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62889'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BT...62791 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '66,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62791'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- vink | Y...041252 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '78,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '19,8'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'Y...041252'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- heggenmus | BT...62560 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '75,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '20,9'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '10'),
    'barcode', COALESCE(NULLIF(data->>'barcode', ''), '24b01387'),
    'handpen_score', COALESCE(NULLIF(data->>'handpen_score', ''), '45'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62560'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- goudvink | Y...041285 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '90,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '25,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '2'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'handpen_score', COALESCE(NULLIF(data->>'handpen_score', ''), '25'),
    'handpenlengte', COALESCE(NULLIF(data->>'handpenlengte', ''), '64,0'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'Y...041285'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BT...33296 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '66,5'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '10,6'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...33296'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- pimpelmees | BT...62810 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '63,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '11,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62810'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

-- koolmees | BT...62822 | 1-9-2024
UPDATE vangsten
SET
  data = data || jsonb_build_object(
    'vleugel', COALESCE(NULLIF(data->>'vleugel', ''), '74,0'),
    'gewicht', COALESCE(NULLIF(data->>'gewicht', ''), '17,0'),
    'vet', COALESCE(NULLIF(data->>'vet', ''), '0'),
    'rui_lichaam', COALESCE(NULLIF(data->>'rui_lichaam', ''), '2'),
    'netnummer', COALESCE(NULLIF(data->>'netnummer', ''), '2'),
    'borstspier', COALESCE(NULLIF(data->>'borstspier', ''), '2')
  ),
  updated_at = now()
WHERE ringnummer = 'BT...62822'
  AND (vangstdatum = '2024-9-1' OR vangstdatum = '1-9-2024')
  AND bron = 'griel_import'
  AND deleted_at IS NULL;

COMMIT;
-- Totaal: 745 UPDATE statements