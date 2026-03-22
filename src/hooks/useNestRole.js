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

  // Admin heeft volledige toegang: via ring-rol admin, of via nestkast_rol 'admin'
  const isAdmin = (effectiveRingRol === 'admin' || effectiveNestRol === 'admin') && simulatedNestRole === null;

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
