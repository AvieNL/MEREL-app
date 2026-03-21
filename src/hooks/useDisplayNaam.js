import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSpeciesRef } from './useSpeciesRef';

const LANG_FIELD = { nl: 'naam_nl', en: 'naam_en', de: 'naam_de', fr: 'naam_fr', es: 'naam_es' };

/**
 * Retourneert een lookup-functie (naam_nl) => displayNaam op basis van de huidige taal.
 * Valt terug op naam_nl als er geen vertaling beschikbaar is.
 */
export function useDisplayNaam() {
  const { i18n } = useTranslation();
  const speciesRef = useSpeciesRef();

  return useMemo(() => {
    const field = LANG_FIELD[i18n.language] || 'naam_nl';
    if (field === 'naam_nl') return (naam_nl) => naam_nl;
    const map = new Map();
    speciesRef.forEach(s => {
      if (s.naam_nl) map.set(s.naam_nl.toLowerCase(), s[field] || s.naam_nl);
    });
    return (naam_nl) => {
      if (!naam_nl) return naam_nl;
      return map.get(naam_nl.toLowerCase()) || naam_nl;
    };
  }, [speciesRef, i18n.language]);
}
