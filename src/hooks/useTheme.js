import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSync } from '../context/SyncContext';

function effectiveMode(mode) {
  if (mode === 'systeem') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'donker' : 'licht';
  }
  return mode;
}

export function useTheme() {
  const { profile, updateProfile } = useAuth();
  const { addToQueue } = useSync();

  const [mode, setModeState] = useState(() => {
    const stored = localStorage.getItem('vrs-mode') || 'donker';
    document.documentElement.setAttribute('data-mode', effectiveMode(stored));
    return stored;
  });

  // Synchroniseer modus vanuit profiel
  useEffect(() => {
    if (profile?.modus) setModeState(profile.modus);
  }, [profile?.modus]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pas DOM aan bij moduswijziging
  useEffect(() => {
    document.documentElement.setAttribute('data-mode', effectiveMode(mode));
    localStorage.setItem('vrs-mode', mode);
  }, [mode]);

  // Luister naar OS-themawijzigingen als systeemmodus actief is
  useEffect(() => {
    if (mode !== 'systeem') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    function onchange(e) {
      document.documentElement.setAttribute('data-mode', e.matches ? 'donker' : 'licht');
    }
    mq.addEventListener('change', onchange);
    return () => mq.removeEventListener('change', onchange);
  }, [mode]);

  function setMode(newMode) {
    setModeState(newMode);
    updateProfile({ modus: newMode });
    addToQueue('profiles', 'profile_update', { modus: newMode, updated_at: new Date().toISOString() });
  }

  return { mode, setMode };
}
