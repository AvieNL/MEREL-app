// Interval voor Supabase-pulls van gedeelde tabellen (species, veldconfig)
export const PULL_INTERVAL_MS = 60 * 60 * 1000; // 1 uur

// Aantal slagen op de ruikaart (handpennen P1–P10 + armpennen S1–S10)
export const RUIKAART_SLAGEN = 20;

// Maximale tekstveldlengte voor Griel XML-export
export const MAX_GRIEL_TEKST = 100;

// Maximaal aantal vangsten zichtbaar in de recordslijst
export const MAX_RECORDS_WEERGAVE = 100;

// Korte weergavelabels voor leeftijdcodes (EURING)
export const LEEFTIJD_LABEL = {
  '0': '?',
  '1': 'pullus',
  '2': 'onb.',
  '3': '1kj',
  '4': '+1kj',
  '5': '2kj',
  '6': '+2kj',
  '7': '3kj',
  '8': '+3kj',
  '9': '4kj+',
  'A': '+4kj',
};
