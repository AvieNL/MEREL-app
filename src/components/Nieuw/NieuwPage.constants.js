// Helper: pick the right label based on language
export function getOptLabel(option, lang) {
  if (!lang || lang === 'nl') return option.label;
  return option['label_' + lang] || option.label;
}

// EURING leeftijdcodes 0–9 en A–L (code I bestaat niet in EURING; stopt bij L)
export const LEEFTIJD_OPTIONS = [
  { value: '', label: '-- Kies --', label_en: '-- Choose --', label_de: '-- Wählen --' },
  { value: '0', label: '0 – Onbekend', label_en: '0 – Unknown', label_de: '0 – Unbekannt' },
  { value: '1', label: '1 – Nestjong/pullus', label_en: '1 – Nestling/pullus', label_de: '1 – Nestjung/Pullus' },
  { value: '2', label: '2 – Volgroeid, leeftijd onbekend', label_en: '2 – Full-grown, age unknown', label_de: '2 – Ausgewachsen, Alter unbekannt' },
  { value: '3', label: '3 – 1e kalenderjaar (1 kj)', label_en: '3 – 1st calendar year (1cy)', label_de: '3 – 1. Kalenderjahr (1kj)' },
  { value: '4', label: '4 – Na 1e kj', label_en: '4 – After 1st cy', label_de: '4 – Nach 1. kj' },
  { value: '5', label: '5 – 2e kj', label_en: '5 – 2nd cy', label_de: '5 – 2. kj' },
  { value: '6', label: '6 – Na 2e kj', label_en: '6 – After 2nd cy', label_de: '6 – Nach 2. kj' },
  { value: '7', label: '7 – 3e kj', label_en: '7 – 3rd cy', label_de: '7 – 3. kj' },
  { value: '8', label: '8 – Na 3e kj', label_en: '8 – After 3rd cy', label_de: '8 – Nach 3. kj' },
  { value: '9', label: '9 – 4e kj', label_en: '9 – 4th cy', label_de: '9 – 4. kj' },
  { value: 'A', label: 'A – Na 4e kj', label_en: 'A – After 4th cy', label_de: 'A – Nach 4. kj' },
  { value: 'B', label: 'B – 5e kj', label_en: 'B – 5th cy', label_de: 'B – 5. kj' },
  { value: 'C', label: 'C – Na 5e kj', label_en: 'C – After 5th cy', label_de: 'C – Nach 5. kj' },
  { value: 'D', label: 'D – 6e kj', label_en: 'D – 6th cy', label_de: 'D – 6. kj' },
  { value: 'E', label: 'E – Na 6e kj', label_en: 'E – After 6th cy', label_de: 'E – Nach 6. kj' },
  { value: 'F', label: 'F – 7e kj', label_en: 'F – 7th cy', label_de: 'F – 7. kj' },
  { value: 'G', label: 'G – Na 7e kj', label_en: 'G – After 7th cy', label_de: 'G – Nach 7. kj' },
  { value: 'H', label: 'H – 8e kj', label_en: 'H – 8th cy', label_de: 'H – 8. kj' },
  { value: 'J', label: 'J – Na 8e kj', label_en: 'J – After 8th cy', label_de: 'J – Nach 8. kj' },
  { value: 'K', label: 'K – 9e kj', label_en: 'K – 9th cy', label_de: 'K – 9. kj' },
  { value: 'L', label: 'L – Na 9e kj en verder', label_en: 'L – After 9th cy and beyond', label_de: 'L – Nach 9. kj und weiter' },
];

export const LEEFTIJD_LABELS = {
  '0': 'onbekend', '1': 'pullus', '2': 'volgroeid',
  '3': '1kj', '4': 'na 1kj', '5': '2kj', '6': 'na 2kj',
  '7': '3kj', '8': 'na 3kj', '9': '4kj', 'A': 'na 4kj',
  'B': '5kj', 'C': 'na 5kj', 'D': '6kj', 'E': 'na 6kj',
  'F': '7kj', 'G': 'na 7kj', 'H': '8kj',
  'J': 'na 8kj', 'K': '9kj', 'L': 'na 9kj+',
};

export const PULLUS_LEEFTIJD_OPTIONS = [
  { value: '--', label: '-- – Vogel is geen nestjong', label_en: '-- – Bird is not a chick', label_de: '-- – Kein Nestjung' },
  { value: '99', label: '99 – Leeftijd nestjong niet vastgesteld', label_en: '99 – Pullus age not determined', label_de: '99 – Alter des Nestjungs nicht bestimmt' },
  ...Array.from({ length: 99 }, (_, i) => ({
    value: String(i).padStart(2, '0'),
    label: `${String(i).padStart(2, '0')} – ${i} ${i === 1 ? 'dag' : 'dagen'}`,
    label_en: `${String(i).padStart(2, '0')} – ${i} ${i === 1 ? 'day' : 'days'}`,
    label_de: `${String(i).padStart(2, '0')} – ${i} ${i === 1 ? 'Tag' : 'Tage'}`,
  })),
];

export const NAUWK_LEEFTIJD_OPTIONS = [
  { value: '--', label: '-- – Vogel is geen nestjong', label_en: '-- – Bird is not a chick', label_de: '-- – Kein Nestjung' },
  { value: 'U', label: 'U – Niet genoteerd / onbekend', label_en: 'U – Not noted / unknown', label_de: 'U – Nicht notiert / unbekannt' },
  ...Array.from({ length: 10 }, (_, i) => ({
    value: String(i),
    label: `${i} – nauwkeurig tot ${i === 0 ? 'op de dag' : `±${i} dag${i > 1 ? 'en' : ''}`}`,
    label_en: `${i} – accurate to ${i === 0 ? 'the day' : `±${i} day${i > 1 ? 's' : ''}`}`,
    label_de: `${i} – genau bis auf ${i === 0 ? 'den Tag' : `±${i} Tag${i > 1 ? 'e' : ''}`}`,
  })),
];

export const BROEDGROOTTE_OPTIONS = [
  { value: '--', label: '-- – Vogel is geen nestjong', label_en: '-- – Bird is not a chick', label_de: '-- – Kein Nestjung' },
  { value: '00', label: '00 – Onbekend of niet genoteerd', label_en: '00 – Unknown or not noted', label_de: '00 – Unbekannt oder nicht notiert' },
  { value: '99', label: '99 – Broedgrootte niet genoteerd', label_en: '99 – Brood size not noted', label_de: '99 – Brutgröße nicht notiert' },
  ...Array.from({ length: 49 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: `${String(i + 1).padStart(2, '0')} – ${i + 1} ${i === 0 ? 'kuiken' : 'kuikens'}`,
    label_en: `${String(i + 1).padStart(2, '0')} – ${i + 1} ${i === 0 ? 'chick' : 'chicks'}`,
    label_de: `${String(i + 1).padStart(2, '0')} – ${i + 1} ${i === 0 ? 'Küken' : 'Küken'}`,
  })),
  ...Array.from({ length: 29 }, (_, i) => ({
    value: String(i + 52).padStart(2, '0'),
    label: `${String(i + 52).padStart(2, '0')} – ${i + 52} kuikens`,
    label_en: `${String(i + 52).padStart(2, '0')} – ${i + 52} chicks`,
    label_de: `${String(i + 52).padStart(2, '0')} – ${i + 52} Küken`,
  })),
];

export const GESLACHT_OPTIONS = [
  { value: '', label: '-- Kies --', label_en: '-- Choose --', label_de: '-- Wählen --' },
  { value: 'M', label: '♂ Man', label_en: '♂ Male', label_de: '♂ Männchen' },
  { value: 'F', label: '♀ Vrouw', label_en: '♀ Female', label_de: '♀ Weibchen' },
  { value: 'U', label: 'U - Onbekend', label_en: 'U - Unknown', label_de: 'U - Unbekannt' },
];

export const GESLACHTSBEPALING_OPTIONS = [
  { value: 'A', label: 'A – Activiteit/gedrag', label_en: 'A – Activity/behaviour', label_de: 'A – Aktivität/Verhalten' },
  { value: 'B', label: 'B – Broedvlek', label_en: 'B – Brood patch', label_de: 'B – Brutfleck' },
  { value: 'C', label: 'C – Cloacale protuberans', label_en: 'C – Cloacal protuberance', label_de: 'C – Kloakenvorwölbung' },
  { value: 'D', label: 'D – DNA', label_en: 'D – DNA', label_de: 'D – DNA' },
  { value: 'E', label: 'E – Intern cloacaonderzoek', label_en: 'E – Internal cloacal examination', label_de: 'E – Innere Kloakenuntersuchung' },
  { value: 'L', label: 'L – Laparoscopie', label_en: 'L – Laparoscopy', label_de: 'L – Laparoskopie' },
  { value: 'P', label: 'P – Verenkleed (absoluut)', label_en: 'P – Plumage (absolute)', label_de: 'P – Gefieder (absolut)' },
  { value: 'S', label: 'S – Grootte / kleurintensiteit', label_en: 'S – Size / colour intensity', label_de: 'S – Größe / Farbintensität' },
  { value: 'T', label: 'T – Post-mortem dissectie', label_en: 'T – Post-mortem dissection', label_de: 'T – Post-mortem-Sektion' },
  { value: 'U', label: 'U – Onbekend', label_en: 'U – Unknown', label_de: 'U – Unbekannt' },
];

export const ALL_RINGCENTRALES = [
  { value: 'NLA', label: 'NLA - Netherlands' },
  { value: 'ABT', label: 'ABT - Albania' },
  { value: 'AUW', label: 'AUW - Austria' },
  { value: 'BGS', label: 'BGS - Bulgaria' },
  { value: 'BHS', label: 'BHS - Bosnia & Herzegovina' },
  { value: 'BLB', label: 'BLB - Belgium' },
  { value: 'BYM', label: 'BYM - Belarus' },
  { value: 'CIJ', label: 'CIJ - Channel Islands' },
  { value: 'CYC', label: 'CYC - Cyprus' },
  { value: 'CYK', label: 'CYK - Cyprus (North)' },
  { value: 'CZP', label: 'CZP - Czech Republic' },
  { value: 'DEH', label: 'DEH - Germany (Hiddensee)' },
  { value: 'DER', label: 'DER - Germany (Radolfzell)' },
  { value: 'DEW', label: 'DEW - Germany (Helgoland)' },
  { value: 'DKC', label: 'DKC - Denmark' },
  { value: 'ESA', label: 'ESA - Spain (Aranzadi)' },
  { value: 'ESC', label: 'ESC - Spain (Catalan)' },
  { value: 'ESI', label: 'ESI - Spain (Madrid)' },
  { value: 'ESS', label: 'ESS - Spain (SEO/Birdlife)' },
  { value: 'ETM', label: 'ETM - Estonia' },
  { value: 'FRP', label: 'FRP - France' },
  { value: 'GBT', label: 'GBT - UK & Ireland' },
  { value: 'GET', label: 'GET - Georgia' },
  { value: 'GRA', label: 'GRA - Greece' },
  { value: 'HES', label: 'HES - Switzerland' },
  { value: 'HGB', label: 'HGB - Hungary' },
  { value: 'HRZ', label: 'HRZ - Croatia' },
  { value: 'IAB', label: 'IAB - Italy' },
  { value: 'ILT', label: 'ILT - Israel' },
  { value: 'ISR', label: 'ISR - Iceland' },
  { value: 'LID', label: 'LID - Lithuania' },
  { value: 'LIK', label: 'LIK - Lithuania (Museum)' },
  { value: 'LVR', label: 'LVR - Latvia' },
  { value: 'MEC', label: 'MEC - Montenegro' },
  { value: 'MEP', label: 'MEP - Montenegro' },
  { value: 'MKS', label: 'MKS - Macedonia' },
  { value: 'MLV', label: 'MLV - Malta' },
  { value: 'NOS', label: 'NOS - Norway' },
  { value: 'PLG', label: 'PLG - Poland' },
  { value: 'POL', label: 'POL - Portugal' },
  { value: 'ROB', label: 'ROB - Romania' },
  { value: 'RSB', label: 'RSB - Serbia' },
  { value: 'RUM', label: 'RUM - Russian Federation' },
  { value: 'SFH', label: 'SFH - Finland' },
  { value: 'SKB', label: 'SKB - Slovakia' },
  { value: 'SLL', label: 'SLL - Slovenia' },
  { value: 'SVS', label: 'SVS - Sweden' },
  { value: 'TUA', label: 'TUA - Turkey' },
  { value: 'UKK', label: 'UKK - Ukraine' },
];

export const VET_OPTIONS = [
  { value: '', label: '-- Kies --', label_en: '-- Choose --', label_de: '-- Wählen --' },
  { value: '0', label: '0 – Geen vet', label_en: '0 – No fat', label_de: '0 – Kein Fett' },
  { value: '1', label: '1 – Spoor van vet', label_en: '1 – Trace of fat', label_de: '1 – Fettspur' },
  { value: '2', label: '2 – Weinig vet (⅓ fossa)', label_en: '2 – Little fat (⅓ fossa)', label_de: '2 – Wenig Fett (⅓ Fossa)' },
  { value: '3', label: '3 – Matig vet (⅔ fossa)', label_en: '3 – Moderate fat (⅔ fossa)', label_de: '3 – Mäßig Fett (⅔ Fossa)' },
  { value: '4', label: '4 – Fossa gevuld, nog hol', label_en: '4 – Fossa full, still concave', label_de: '4 – Fossa gefüllt, noch konkav' },
  { value: '5', label: '5 – Fossa bol / uitpuilend', label_en: '5 – Fossa bulging', label_de: '5 – Fossa gewölbt' },
];

export const VLIEGSPIER_OPTIONS = [
  { value: '', label: '-- Kies --', label_en: '-- Choose --', label_de: '-- Wählen --' },
  { value: '0', label: '0 – Borstbeen scherp, spier ingevallen', label_en: '0 – Keel sharp, muscle hollow', label_de: '0 – Brustbein scharf, Muskel hohl' },
  { value: '1', label: '1 – Borstbeen goed voelbaar, spier vlak', label_en: '1 – Keel well palpable, muscle flat', label_de: '1 – Brustbein gut tastbar, Muskel flach' },
  { value: '2', label: '2 – Borstbeen nog voelbaar, spier licht gewelfd', label_en: '2 – Keel palpable, muscle slightly rounded', label_de: '2 – Brustbein tastbar, Muskel leicht gewölbt' },
  { value: '3', label: '3 – Borstbeen nauwelijks voelbaar, spier volledig gewelfd', label_en: '3 – Keel barely palpable, muscle fully rounded', label_de: '3 – Brustbein kaum tastbar, Muskel vollständig gewölbt' },
];

export const BROEDVLEK_OPTIONS = [
  { value: '0', label: '0 – Niet bepaald', label_en: '0 – Not determined', label_de: '0 – Nicht bestimmt' },
  { value: '1', label: '1 – Broedvlek afwezig', label_en: '1 – Absent', label_de: '1 – Nicht vorhanden' },
  { value: '2', label: '2 – Broedvlek aanwezig (geen details genoteerd)', label_en: '2 – Present (no details noted)', label_de: '2 – Vorhanden (keine Details)' },
  { value: '3', label: '3 – Startende broedvlek (eileg)', label_en: '3 – Forming (laying)', label_de: '3 – Beginnend (Eiablage)' },
  { value: '4', label: '4 – Duidelijk begrensd (begin van het broeden)', label_en: '4 – Well-vascularised (start of incubation)', label_de: '4 – Gut vaskularisiert (Brutbeginn)' },
  { value: '5', label: '5 – Geaderd en rood (zit op eieren)', label_en: '5 – Vascularised and red (incubating)', label_de: '5 – Vaskularisiert und rot (brütend)' },
  { value: '6', label: '6 – Gerimpeld (jongen aanwezig)', label_en: '6 – Wrinkled (chicks present)', label_de: '6 – Gefaltet (Junge vorhanden)' },
  { value: '7', label: '7 – Groeit dicht (jongen uitgevlogen)', label_en: '7 – Growing over (chicks fledged)', label_de: '7 – Schließt sich (Junge ausgeflogen)' },
];

export const HANDICAP_OPTIONS = [
  { value: '', label: '-- Kies --', label_en: '-- Choose --', label_de: '-- Wählen --' },
  { value: '00', label: '00 - Geen handicap, vermoedelijk gezond', label_en: '00 - No handicap, presumably healthy', label_de: '00 - Keine Beeinträchtigung, vermutlich gesund' },
  { value: '10', label: '10 - PARASIET(EN)', label_en: '10 - PARASITE(S)', label_de: '10 - PARASIT(EN)' },
  { value: '11', label: '11 - Teek(en)', label_en: '11 - Tick(s)', label_de: '11 - Zecke(n)' },
  { value: '12', label: '12 - Veerluis(luizen)', label_en: '12 - Feather louse/lice', label_de: '12 - Federlaus/-läuse' },
  { value: '13', label: '13 - Luisvlieg(en)', label_en: '13 - Hippoboscid fly/flies', label_de: '13 - Lausfliege(n)' },
  { value: '14', label: '14 - Teken en luisvliegen', label_en: '14 - Ticks and hippoboscid flies', label_de: '14 - Zecken und Lausfliegen' },
  { value: '20', label: '20 - KLEURAFWIJKING', label_en: '20 - COLOUR ABERRATION', label_de: '20 - FARBABWEICHUNG' },
  { value: '21', label: '21 - Leucistisch', label_en: '21 - Leucistic', label_de: '21 - Leuzistisch' },
  { value: '22', label: '22 - Albinistisch', label_en: '22 - Albinistic', label_de: '22 - Albinistisch' },
  { value: '23', label: '23 - Groeistrepen', label_en: '23 - Fault bars', label_de: '23 - Hungerstriche' },
  { value: '30', label: '30 - VERENKLEED niet in orde', label_en: '30 - PLUMAGE not in order', label_de: '30 - GEFIEDER nicht in Ordnung' },
  { value: '31', label: '31 - Mist meerdere slagpennen (geen rui)', label_en: '31 - Missing several flight feathers (not moult)', label_de: '31 - Fehlende Schwungfedern (keine Mauser)' },
  { value: '32', label: '32 - Mist meerdere staartpennen (geen rui)', label_en: '32 - Missing several tail feathers (not moult)', label_de: '32 - Fehlende Steuerfedern (keine Mauser)' },
  { value: '33', label: '33 - Mist hele staart', label_en: '33 - Missing entire tail', label_de: '33 - Ganzer Schwanz fehlt' },
  { value: '40', label: '40 - POTEN niet in orde', label_en: '40 - LEGS not in order', label_de: '40 - BEINE nicht in Ordnung' },
  { value: '41', label: '41 - Oude of nieuwe breuk', label_en: '41 - Old or new fracture', label_de: '41 - Alter oder neuer Knochenbruch' },
  { value: '42', label: '42 - Mist teen(en)', label_en: '42 - Missing toe(s)', label_de: '42 - Fehlende Zehe(n)' },
  { value: '43', label: '43 - Mist voet(en)', label_en: '43 - Missing foot/feet', label_de: '43 - Fehlender Fuß/Füße' },
  { value: '44', label: '44 - Kalkpoten', label_en: '44 - Scaly leg', label_de: '44 - Kalkbeine' },
  { value: '45', label: '45 - Gezwel / wrat / tumor (poot)', label_en: '45 - Swelling / wart / tumour (leg)', label_de: '45 - Schwellung / Warze / Tumor (Bein)' },
  { value: '50', label: '50 - SNAVEL niet in orde', label_en: '50 - BILL not in order', label_de: '50 - SCHNABEL nicht in Ordnung' },
  { value: '51', label: '51 - Kruisbek', label_en: '51 - Crossbill-like', label_de: '51 - Kreuzschnabel-artig' },
  { value: '52', label: '52 - Onder- of bovensnavel korter', label_en: '52 - Upper or lower bill shorter', label_de: '52 - Ober- oder Unterschnabel kürzer' },
  { value: '53', label: '53 - Mist onder- of bovensnavel', label_en: '53 - Missing upper or lower bill', label_de: '53 - Ober- oder Unterschnabel fehlt' },
  { value: '60', label: '60 - VLEUGEL niet in orde', label_en: '60 - WING not in order', label_de: '60 - FLÜGEL nicht in Ordnung' },
  { value: '61', label: '61 - Vleugel lam (stress/verrekking/breuk)', label_en: '61 - Wing lame (stress/sprain/fracture)', label_de: '61 - Flügel lahm (Stress/Zerrung/Bruch)' },
  { value: '70', label: '70 - ZIEKTE', label_en: '70 - DISEASE', label_de: '70 - KRANKHEIT' },
  { value: '71', label: '71 - Schimmel', label_en: '71 - Fungal', label_de: '71 - Pilzbefall' },
  { value: '72', label: '72 - Gezwel / wrat / tumor', label_en: '72 - Swelling / wart / tumour', label_de: '72 - Schwellung / Warze / Tumor' },
  { value: '73', label: '73 - Geel', label_en: '73 - Jaundice', label_de: '73 - Gelbsucht' },
  { value: '80', label: '80 - Vleugel nog niet volgroeid (1kj)', label_en: '80 - Wing not fully grown (1cy)', label_de: '80 - Flügel noch nicht ausgewachsen (1kj)' },
  { value: '90', label: '90 - ANDERE MANKEMENTEN', label_en: '90 - OTHER DEFECTS', label_de: '90 - ANDERE MÄNGEL' },
  { value: '91', label: '91 - Blind aan één oog', label_en: '91 - Blind in one eye', label_de: '91 - Auf einem Auge blind' },
  { value: '99', label: '99 - Niet in deze lijst', label_en: '99 - Not in this list', label_de: '99 - Nicht in dieser Liste' },
];

export const CLOACA_OPTIONS = [
  { value: '0', label: '0 – Niet bepaald', label_en: '0 – Not determined', label_de: '0 – Nicht bestimmt' },
  { value: '1', label: '1 – Niet ontwikkeld (geslacht onzeker)', label_en: '1 – Not developed (sex uncertain)', label_de: '1 – Nicht entwickelt (Geschlecht unsicher)' },
  { value: '2', label: '2 – Bol/kegelvormig met plooi en 7 lange veren (man)', label_en: '2 – Bulging/conical with fold and 7 long feathers (male)', label_de: '2 – Gewölbt/kegelförmig mit Falte und 7 langen Federn (Männchen)' },
  { value: '3', label: '3 – Iets bolvormig met 7 lange veren (man)', label_en: '3 – Slightly rounded with 7 long feathers (male)', label_de: '3 – Leicht gerundet mit 7 langen Federn (Männchen)' },
  { value: '4', label: '4 – Enigszins uitstekend met 7 lange veren (man?)', label_en: '4 – Slightly protruding with 7 long feathers (male?)', label_de: '4 – Leicht vorgewölbt mit 7 langen Federn (Männchen?)' },
  { value: '5', label: '5 – Verwijd, zacht gewelfd, 5 korte veren (vrouw)', label_en: '5 – Dilated, softly domed, 5 short feathers (female)', label_de: '5 – Erweitert, sanft gewölbt, 5 kurze Federn (Weibchen)' },
  { value: '6', label: '6 – Zacht gewelfd met 5 korte veren (vrouw)', label_en: '6 – Softly domed with 5 short feathers (female)', label_de: '6 – Sanft gewölbt mit 5 kurzen Federn (Weibchen)' },
  { value: '7', label: '7 – Niet verwijd, onopvallend, 5 korte veren (vrouw?)', label_en: '7 – Not dilated, inconspicuous, 5 short feathers (female?)', label_de: '7 – Nicht erweitert, unauffällig, 5 kurze Federn (Weibchen?)' },
];

export const PLAATSCODE_OPTIONS = [
  { value: 'NL--', label: 'NL-- – Nederland (niet gespecificeerd)' },
  { value: 'NL11', label: 'NL11 – Ameland' },
  { value: 'NL04', label: 'NL04 – Drenthe' },
  { value: 'NL05', label: 'NL05 – Friesland' },
  { value: 'NL06', label: 'NL06 – Gelderland' },
  { value: 'NL02', label: 'NL02 – Griend' },
  { value: 'NL07', label: 'NL07 – Groningen' },
  { value: 'NL17', label: 'NL17 – IJsselmeerpolders (incl. Urk & Schokland)' },
  { value: 'NL08', label: 'NL08 – Limburg' },
  { value: 'NL09', label: 'NL09 – Noord-Brabant' },
  { value: 'NL14', label: 'NL14 – Noord-Holland' },
  { value: 'NL15', label: 'NL15 – Overijssel' },
  { value: 'NL13', label: 'NL13 – Rottumeroog' },
  { value: 'NL12', label: 'NL12 – Schiermonnikoog' },
  { value: 'NL03', label: 'NL03 – Terschelling' },
  { value: 'NL00', label: 'NL00 – Texel' },
  { value: 'NL16', label: 'NL16 – Utrecht' },
  { value: 'NL01', label: 'NL01 – Vlieland' },
  { value: 'NL18', label: 'NL18 – Zeeland' },
  { value: 'NL19', label: 'NL19 – Zuid-Holland' },
];

export const SNAVEL_METHODE_OPTIONS = [
  { value: '', label: '-- Kies --', label_en: '-- Choose --', label_de: '-- Wählen --' },
  { value: 'C', label: 'C – Punt tot cere', label_en: 'C – Tip to cere', label_de: 'C – Spitze bis Wachshaut' },
  { value: 'F', label: 'F – Punt tot veren', label_en: 'F – Tip to feathers', label_de: 'F – Spitze bis Federn' },
  { value: 'N', label: 'N – Punt tot neusgat', label_en: 'N – Tip to nostril', label_de: 'N – Spitze bis Nasenloch' },
  { value: 'S', label: 'S – Punt tot schedel', label_en: 'S – Tip to skull', label_de: 'S – Spitze bis Schädelknochen' },
];

export const ANDERE_MERKTEKENS_OPTIONS = [
  { value: 'ZZ', label: 'ZZ – Geen andere merktekens', label_en: 'ZZ – No other marks', label_de: 'ZZ – Keine anderen Kennzeichen' },
  { value: 'BB', label: 'BB – Kleurring (blauw)', label_en: 'BB – Colour ring (blue)', label_de: 'BB – Farbring (blau)' },
  { value: 'BC', label: 'BC – Kleurring (groen)', label_en: 'BC – Colour ring (green)', label_de: 'BC – Farbring (grün)' },
  { value: 'BD', label: 'BD – Kleurring (rood)', label_en: 'BD – Colour ring (red)', label_de: 'BD – Farbring (rot)' },
  { value: 'BE', label: 'BE – Kleurring (geel)', label_en: 'BE – Colour ring (yellow)', label_de: 'BE – Farbring (gelb)' },
  { value: 'LB', label: 'LB – Vlaggetje (blauw)', label_en: 'LB – Flag (blue)', label_de: 'LB – Fähnchen (blau)' },
  { value: 'LC', label: 'LC – Vlaggetje (groen)', label_en: 'LC – Flag (green)', label_de: 'LC – Fähnchen (grün)' },
  { value: 'LD', label: 'LD – Vlaggetje (rood)', label_en: 'LD – Flag (red)', label_de: 'LD – Fähnchen (rot)' },
  { value: 'LE', label: 'LE – Vlaggetje (geel)', label_en: 'LE – Flag (yellow)', label_de: 'LE – Fähnchen (gelb)' },
  { value: 'K', label: 'K – Kapsel / neckcollar', label_en: 'K – Collar / neckcollar', label_de: 'K – Halsband / Nackenkragen' },
  { value: 'T', label: 'T – Transmitter / zender', label_en: 'T – Transmitter / sender', label_de: 'T – Transmitter / Sender' },
  { value: 'S', label: 'S – Secundaire ring', label_en: 'S – Secondary ring', label_de: 'S – Sekundärring' },
  { value: 'R', label: 'R – Ring op poot (extra)', label_en: 'R – Ring on leg (extra)', label_de: 'R – Ring am Bein (extra)' },
  { value: 'H', label: 'H – Halsband', label_en: 'H – Harness/backpack', label_de: 'H – Rucksack/Halsband' },
  { value: 'G', label: 'G – Gezenderd (telemetrie)', label_en: 'G – Geolocator (telemetry)', label_de: 'G – Geolocator (Telemetrie)' },
  { value: 'F', label: 'F – Vlag (flag)', label_en: 'F – Flag', label_de: 'F – Fahne' },
  { value: 'E', label: 'E – Emitter', label_en: 'E – Emitter', label_de: 'E – Emitter' },
  { value: 'D', label: 'D – Darvic ring', label_en: 'D – Darvic ring', label_de: 'D – Darvic-Ring' },
  { value: 'C', label: 'C – Kleurring (overig)', label_en: 'C – Colour ring (other)', label_de: 'C – Farbring (sonstige)' },
  { value: 'OT', label: 'OT – Ander type merkteken', label_en: 'OT – Other mark type', label_de: 'OT – Anderer Kennzeichentyp' },
  { value: 'OP', label: 'OP – Ander pootmerkteken', label_en: 'OP – Other leg mark', label_de: 'OP – Anderes Beinkennzeichen' },
  { value: 'OM', label: 'OM – Ander merkteken (overig)', label_en: 'OM – Other mark (other)', label_de: 'OM – Anderes Kennzeichen (sonstige)' },
  { value: 'MM', label: 'MM – Meerdere merktekens', label_en: 'MM – Multiple marks', label_de: 'MM – Mehrere Kennzeichen' },
];

export const VERIFICATIE_OPTIONS = [
  { value: 0, label: '0 – Ring NIET bevestigd', label_en: '0 – Ring NOT confirmed', label_de: '0 – Ring NICHT bestätigt' },
  { value: 1, label: '1 – Ring bevestigd', label_en: '1 – Ring confirmed', label_de: '1 – Ring bestätigt' },
];

export const VERPLAATST_OPTIONS = [
  { value: 0, label: '0 – Niet verplaatst', label_en: '0 – Not displaced', label_de: '0 – Nicht umgesetzt' },
  { value: 2, label: '2 – Onopzettelijk verplaatst', label_en: '2 – Accidentally displaced', label_de: '2 – Unabsichtlich umgesetzt' },
  { value: 4, label: '4 – Opzettelijk verplaatst', label_en: '4 – Intentionally displaced', label_de: '4 – Absichtlich umgesetzt' },
  { value: 6, label: '6 – Verplaatst door water', label_en: '6 – Displaced by water', label_de: '6 – Durch Wasser umgesetzt' },
];

export const ZEKER_OMSTANDIG_OPTIONS = [
  { value: 0, label: '0 – Zeker', label_en: '0 – Certain', label_de: '0 – Sicher' },
  { value: 1, label: '1 – Aangenomen', label_en: '1 – Assumed', label_de: '1 – Angenommen' },
];

export const CONDITIE_OPTIONS = [
  { value: '0', label: '0 – Conditie onbekend', label_en: '0 – Condition unknown', label_de: '0 – Zustand unbekannt' },
  { value: '1', label: '1 – Dood, tijdstip onbekend', label_en: '1 – Dead, time unknown', label_de: '1 – Tot, Zeitpunkt unbekannt' },
  { value: '2', label: '2 – Vers dood (binnen ~1 week)', label_en: '2 – Freshly dead (within ~1 week)', label_de: '2 – Frisch tot (innerhalb ~1 Woche)' },
  { value: '3', label: '3 – Niet vers dood (meer dan ~1 week geleden)', label_en: '3 – Not freshly dead (more than ~1 week ago)', label_de: '3 – Nicht frisch tot (vor mehr als ~1 Woche)' },
  { value: '4', label: '4 – Ziek/gewond aangetroffen, vrijgelaten', label_en: '4 – Sick/injured found, released', label_de: '4 – Krank/verletzt gefunden, freigelassen' },
  { value: '5', label: '5 – Ziek/gewond aangetroffen, niet (zeker) vrijgelaten', label_en: '5 – Sick/injured found, not (certainly) released', label_de: '5 – Krank/verletzt gefunden, nicht (sicher) freigelassen' },
  { value: '6', label: '6 – Levend en gezond, in gevangenschap genomen', label_en: '6 – Alive and healthy, taken into captivity', label_de: '6 – Lebend und gesund, in Gefangenschaft genommen' },
  { value: '7', label: '7 – Levend en gezond, zeker vrijgelaten', label_en: '7 – Alive and healthy, certainly released', label_de: '7 – Lebend und gesund, sicher freigelassen' },
  { value: '8', label: '8 – Levend en gezond, vrijgelaten door ringer', label_en: '8 – Alive and healthy, released by ringer', label_de: '8 – Lebend und gesund, vom Beringer freigelassen' },
  { value: '9', label: '9 – Levend en gezond, lot onbekend', label_en: '9 – Alive and healthy, fate unknown', label_de: '9 – Lebend und gesund, Schicksal unbekannt' },
];

export const NAUWK_COORD_OPTIONS = [
  { value: '0', label: '0 – Nauwkeurig tot de opgegeven coördinaten', label_en: '0 – Accurate to the given coordinates', label_de: '0 – Genau bis zu den angegebenen Koordinaten' },
  { value: '1', label: '1 – Straal 5 km', label_en: '1 – Radius 5 km', label_de: '1 – Radius 5 km' },
  { value: '2', label: '2 – Straal 10 km', label_en: '2 – Radius 10 km', label_de: '2 – Radius 10 km' },
  { value: '3', label: '3 – Straal 20 km', label_en: '3 – Radius 20 km', label_de: '3 – Radius 20 km' },
  { value: '4', label: '4 – Straal 50 km', label_en: '4 – Radius 50 km', label_de: '4 – Radius 50 km' },
  { value: '5', label: '5 – Straal 100 km', label_en: '5 – Radius 100 km', label_de: '5 – Radius 100 km' },
  { value: '6', label: '6 – Straal 500 km', label_en: '6 – Radius 500 km', label_de: '6 – Radius 500 km' },
  { value: '7', label: '7 – Straal 1000 km', label_en: '7 – Radius 1000 km', label_de: '7 – Radius 1000 km' },
  { value: '8', label: '8 – Gereserveerd', label_en: '8 – Reserved', label_de: '8 – Reserviert' },
  { value: '9', label: '9 – Ergens in het land/gebied uit de plaatscode', label_en: '9 – Somewhere in the country/area from the place code', label_de: '9 – Irgendwo im Land/Gebiet aus dem Ortscode' },
  ...Array.from({ length: 26 }, (_, i) => {
    const letter = String.fromCharCode(65 + i);
    const num = i + 1;
    return {
      value: letter,
      label: `${letter} – Administratief gebied ${num}`,
      label_en: `${letter} – Administrative area ${num}`,
      label_de: `${letter} – Verwaltungsgebiet ${num}`,
    };
  }),
];

export const NAUWK_DATUM_OPTIONS = [
  { value: 0, label: '0 – Nauwkeurig op de dag', label_en: '0 – Accurate to the day', label_de: '0 – Auf den Tag genau' },
  { value: 1, label: '1 – ±1 dag', label_en: '1 – ±1 day', label_de: '1 – ±1 Tag' },
  { value: 2, label: '2 – ±3 dagen', label_en: '2 – ±3 days', label_de: '2 – ±3 Tage' },
  { value: 3, label: '3 – ±1 week', label_en: '3 – ±1 week', label_de: '3 – ±1 Woche' },
  { value: 4, label: '4 – ±2 weken', label_en: '4 – ±2 weeks', label_de: '4 – ±2 Wochen' },
  { value: 5, label: '5 – ±6 weken', label_en: '5 – ±6 weeks', label_de: '5 – ±6 Wochen' },
  { value: 6, label: '6 – ±3 maanden', label_en: '6 – ±3 months', label_de: '6 – ±3 Monate' },
  { value: 7, label: '7 – ±6 maanden', label_en: '7 – ±6 months', label_de: '7 – ±6 Monate' },
  { value: 8, label: '8 – Slechts nauwkeurig tot op het jaar', label_en: '8 – Accurate to the year only', label_de: '8 – Nur auf das Jahr genau' },
  { value: 9, label: '9 – Datum uitgifte ring / datum vondst (lang dood)', label_en: '9 – Date of ring issue / date found (long dead)', label_de: '9 – Datum der Ringausgabe / Funddatum (lang tot)' },
];

export const RUI_LICHAAM_OPTIONS = [
  { value: '', label: '-- Kies --', label_en: '-- Choose --', label_de: '-- Wählen --' },
  { value: '0', label: '0 – Geen rui', label_en: '0 – No moult', label_de: '0 – Keine Mauser' },
  { value: '1', label: '1 – Gedeeltelijke rui', label_en: '1 – Partial moult', label_de: '1 – Teilmauser' },
  { value: '2', label: '2 – Volledige rui', label_en: '2 – Complete moult', label_de: '2 – Vollmauser' },
];

export const TAAL_LABELS = {
  naam_nl: 'Nederlands',
  naam_lat: 'Latijn',
  naam_en: 'Engels',
  naam_de: 'Duits',
};

export const EMPTY_FORM = {
  vogelnaam: '',
  ringnummer: '',
  metalenringinfo: 2,
  identificatie_methode: 'A0',
  leeftijd: '',
  geslacht: '',
  vangstmethode: '',
  lokmiddelen: 'N',
  vangstdatum: new Date().toISOString().split('T')[0],
  tijd: '',
  project: '',
  centrale: 'NLA',
  status: 'U',
  conditie: '8',
  omstandigheden: '20',
  plaatscode: 'NL--',
  google_plaats: '',
  lat: '',
  lon: '',
  vleugel: '',
  gewicht: '',
  kop_snavel: '',
  tarsus_lengte: '',
  handpenlengte: '',
  staartlengte: '',
  snavel_schedel: '',
  snavel_methode: '',
  staart_verschil: '',
  tarsus_teen: '',
  tarsus_dikte: '',
  vet: '',
  handpen_score: '',
  cloaca: '0',
  broedvlek: '0',
  borstspier: '',
  rui_lichaam: '',
  netnummer: '',
  barcode: '',
  opmerkingen: '',
  opmerkingen1: '',
  andere_merktekens: 'ZZ',
  gemanipuleerd: 'N',
  verplaatst: 0,
  broedselgrootte: '--',
  pul_leeftijd: '--',
  nauwk_pul_leeftijd: '--',
  nauwk_vangstdatum: 0,
  nauwk_coord: '0',
  zeker_omstandigheden: 0,
  verificatie: 0,
  geslachtsbepaling: 'U',
  handicap: '00',
  oude_dekveren: '',
  achternagel: '',
  weegtijd: '',
  ringer_initiaal: '',
  ringer_nummer: '',
};

// Verplichte velden voor validatie bij opslaan
export const REQUIRED_FIELDS = [
  { key: 'vogelnaam',             label: 'Vogelnaam',                    section: 'nieuweVangst' },
  { key: 'project',               label: 'Project',                      section: 'project' },
  { key: 'ringer_nummer',         label: 'Ringernr.',                    section: 'project' },
  { key: 'centrale',              label: 'Ringcentrale',                 section: 'ringgegevens' },
  { key: 'ringnummer',            label: 'Ringnummer',                   section: 'ringgegevens' },
  { key: 'metalenringinfo',       label: 'Metalen ring info',            section: 'ringgegevens' },
  { key: 'identificatie_methode', label: 'Identificatiemethode',         section: 'ringgegevens' },
  { key: 'geslacht',              label: 'Geslacht',                     section: 'vogel' },
  { key: 'leeftijd',              label: 'Leeftijd',                     section: 'vogel' },
  { key: 'pul_leeftijd',          label: 'Pullus leeftijd',              section: 'vogel', conditie: f => f.leeftijd === '1', isPullusField: true },
  { key: 'nauwk_pul_leeftijd',    label: 'Nauwk. pulleeftijd',           section: 'vogel', conditie: f => f.leeftijd === '1', isPullusField: true },
  { key: 'broedselgrootte',       label: 'Broedselgrootte',              section: 'vogel', conditie: f => f.leeftijd === '1', isPullusField: true },
  { key: 'status',                label: 'Status',                       section: 'vogel' },
  { key: 'conditie',              label: 'Conditie',                     section: 'vogel' },
  { key: 'omstandigheden',        label: 'Omstandigheden',               section: 'vogel' },
  { key: 'gemanipuleerd',         label: 'Gemanipuleerd',                section: 'vogel' },
  { key: 'vangstmethode',         label: 'Vangstmethode',                section: 'vangst' },
  { key: 'lokmiddelen',           label: 'Lokmiddelen',                  section: 'vangst' },
  { key: 'nauwk_vangstdatum',     label: 'Nauwkeurigheid datum',         section: 'vangst' },
  { key: 'plaatscode',            label: 'Plaatscode',                   section: 'locatie' },
  { key: 'google_plaats',         label: 'Plaatsnaam',                   section: 'locatie' },
  { key: 'lat',                   label: 'Breedtegraad',                 section: 'locatie' },
  { key: 'lon',                   label: 'Lengtegraad',                  section: 'locatie' },
  { key: 'nauwk_coord',           label: 'Nauwkeurigheid coördinaten',   section: 'locatie' },
];
