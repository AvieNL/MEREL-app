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
    async function haalWeer(la, lo) {
      try {
        const url =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${la}&longitude=${lo}` +
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

    function startFetch(la, lo) {
      haalWeer(la, lo);
      timerRef.current = setInterval(() => haalWeer(la, lo), REFRESH_MS);
    }

    const lat = parseFloat(settings.ringstationLat);
    const lon = parseFloat(settings.ringstationLon);

    if (!isNaN(lat) && !isNaN(lon) && lat !== 0 && lon !== 0) {
      startFetch(lat, lon);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => startFetch(pos.coords.latitude, pos.coords.longitude),
        () => {} // geen locatie beschikbaar of geweigerd
      );
    }

    return () => clearInterval(timerRef.current);
  }, [settings.ringstationLat, settings.ringstationLon]);

  return weer;
}
