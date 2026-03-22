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
  const { profile, simulatedRole, simulatedNestRole } = useAuth();

  // Wanneer een nest-rol gesimuleerd wordt, bypass de admin-volledige-toegang check
  const effectiveNestRol = simulatedNestRole !== null
    ? (simulatedNestRole === 'geen' ? null : simulatedNestRole)
    : (profile?.nestkast_rol || null);

  const effectiveRingRol = simulatedRole || profile?.rol || 'ringer';

  // Admin heeft volledige toegang, tenzij nest-rol expliciet gesimuleerd wordt
  const isAdmin = effectiveRingRol === 'admin' && simulatedNestRole === null;

  return {
    nestRol:             effectiveNestRol,
    isSimulatingNest:    simulatedNestRole !== null,
    hasNestAccess:       isAdmin || !!effectiveNestRol,
    canNestAdd:          isAdmin || effectiveNestRol === 'nestonderzoeker',
    canNestEdit:         isAdmin || effectiveNestRol === 'nestonderzoeker',
    canNestDelete:       isAdmin || effectiveNestRol === 'nestonderzoeker',
    isNestonderzoeker:   effectiveNestRol === 'nestonderzoeker' || isAdmin,
    isNestKijker:        effectiveNestRol === 'kijker',
  };
}
