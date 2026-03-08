import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSync } from '../context/SyncContext';

export function useTheme() {
  const { profile, updateProfile } = useAuth();
  const { addToQueue } = useSync();

  const [mode, setModeState] = useState(() => {
    const stored = localStorage.getItem('vrs-mode') || 'donker';
    document.documentElement.setAttribute('data-color', 'blauw');
    document.documentElement.setAttribute('data-mode', stored);
    return stored;
  });

  // Forceer altijd blauw; synchroniseer modus vanuit profiel
  useEffect(() => {
    document.documentElement.setAttribute('data-color', 'blauw');
    localStorage.setItem('vrs-color', 'blauw');
    if (profile?.modus) setModeState(profile.modus);
  }, [profile?.modus]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
    localStorage.setItem('vrs-mode', mode);
  }, [mode]);

  function setMode(newMode) {
    setModeState(newMode);
    updateProfile({ modus: newMode });
    addToQueue('profiles', 'profile_update', { modus: newMode, updated_at: new Date().toISOString() });
  }

  return { mode, setMode };
}
