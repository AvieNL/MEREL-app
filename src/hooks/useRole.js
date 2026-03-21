import { useAuth } from '../context/AuthContext';

/**
 * Geeft de huidige gebruikersrol terug en handige afgeleiden booleans.
 *
 * Rollen:
 *   admin   — volledige toegang + admin panel
 *   ringer+ — eigen data + AI-analyse functie (betaald)
 *   ringer  — eigen data beheren (default)
 *   viewer  — eigen data alleen lezen
 */
export function useRole() {
  const { profile, simulatedRole } = useAuth();
  const realRol = profile?.rol || 'ringer';
  const rol = simulatedRole || realRol;

  return {
    rol,
    realRol,
    isSimulating:    !!simulatedRole,
    isAdmin:         rol === 'admin',
    isRealAdmin:     realRol === 'admin',
    isRingerPlus:    rol === 'ringer+',
    isRinger:        rol === 'ringer',
    isViewer:        rol === 'viewer',
    canAdd:          rol !== 'viewer',
    canEdit:         rol !== 'viewer',
    canDelete:       rol !== 'viewer',
    canUseAI:        rol === 'admin' || rol === 'ringer+',
    canAddReference: rol === 'admin',
  };
}
