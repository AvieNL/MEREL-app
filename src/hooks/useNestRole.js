import { useAuth } from '../context/AuthContext';

/**
 * Geeft de nestonderzoek-rol en bijbehorende permissies terug.
 *
 * Admin heeft altijd volledige toegang tot beide modules.
 * Nestonderzoek-rollen staan los van de ring-rollen (aparte kolom in profiles).
 *
 * Rollen nestonderzoek:
 *   nestonderzoeker — eigen nestdata beheren
 *   kijker          — alleen lezen
 *   (geen)          — geen toegang tot nestonderzoek
 */
export function useNestRole() {
  const { profile } = useAuth();
  const nestRol  = profile?.nestkast_rol || null;
  const ringRol  = profile?.rol || 'ringer';
  const isAdmin  = ringRol === 'admin';

  return {
    nestRol,
    hasNestAccess:       isAdmin || !!nestRol,
    canNestAdd:          isAdmin || nestRol === 'nestonderzoeker',
    canNestEdit:         isAdmin || nestRol === 'nestonderzoeker',
    canNestDelete:       isAdmin || nestRol === 'nestonderzoeker',
    isNestonderzoeker:   nestRol === 'nestonderzoeker' || isAdmin,
    isNestKijker:        nestRol === 'kijker',
  };
}
