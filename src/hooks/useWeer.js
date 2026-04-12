import { useState, useEffect, useRef } from 'react';
import { useSettings } from './useSettings';

const REFRESH_MS = 30 * 60 * 1000; // 30 minuten

function windRichting(graden) {
  if (graden == null) return '';
  const r = ['N','NNO','NO','ONO','O','OZO','ZO','ZZO','Z','ZZW','ZW','WZW','W','WNW','NW','NNW'];
  return r[Math.round(graden / 22.5) % 16];
}

function tijdUitISO(iso) {
  if (!iso) return null;
  // "2026-04-12T05:42" → "05:42"
  const m = iso.match(/T(\d{2}:\d{2})/);
  return m ? m[1] : null;
}

export function useWeer() {
  const { settings } = useSettings();
  const [weer, setWeer] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const lat = parseFloat(settings.ringstationLat);
    const lon = parseFloat(settings.ringstationLon);
    if (!lat || !lon) return;

    async function haalWeer() {
      try {
        const url =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,precipitation,wind_speed_10m,wind_direction_10m` +
          `&daily=sunrise,sunset` +
          `&timezone=auto&forecast_days=1`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        setWeer({
          temperatuur:   Math.round(data.current?.temperature_2m ?? 0),
          neerslag:      data.current?.precipitation ?? 0,
          windsnelheid:  Math.round(data.current?.wind_speed_10m ?? 0),
          windRichting:  windRichting(data.current?.wind_direction_10m),
          zonsopgang:    tijdUitISO(data.daily?.sunrise?.[0]),
          zonsondergang: tijdUitISO(data.daily?.sunset?.[0]),
        });
      } catch {
        // stil falen — geen crashmelding in header
      }
    }

    haalWeer();
    timerRef.current = setInterval(haalWeer, REFRESH_MS);
    return () => clearInterval(timerRef.current);
  }, [settings.ringstationLat, settings.ringstationLon]);

  return weer;
}
