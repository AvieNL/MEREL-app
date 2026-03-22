import { useState, useMemo, useRef, useEffect } from 'react';
import './NestSoortPicker.css';

/**
 * Inline soort-zoeker voor nestbezoek formulieren.
 * Toont de geselecteerde soort; bij klikken/typen verschijnt een dropdown.
 *
 * Props:
 *   species      {array}   Alle soorten uit useSpeciesRef()
 *   value        {string}  Geselecteerde euring_code
 *   onChange     {fn}      Callback (euring_code, soortObject) → void
 *   lang         {string}  'nl'|'en'|'de' voor naam display
 */
export default function NestSoortPicker({ species, value, onChange, lang = 'nl' }) {
  const [zoek, setZoek] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const geselecteerdeSoort = useMemo(
    () => species.find(s => s.euring_code === value) || null,
    [species, value],
  );

  const naamKey = `naam_${lang}`;
  function displayNaam(s) { return s?.[naamKey] || s?.naam_nl || ''; }

  const suggesties = useMemo(() => {
    if (!open && !zoek) return [];
    const term = zoek.trim().toLowerCase();
    if (!term) return [];
    return species
      .filter(s =>
        s.naam_nl?.toLowerCase().includes(term) ||
        s.naam_lat?.toLowerCase().includes(term) ||
        s.euring_code?.startsWith(term),
      )
      .slice(0, 20);
  }, [zoek, open, species]);

  // Sluit dropdown bij klik buiten het component
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setZoek('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSelect(s) {
    onChange(s.euring_code, s);
    setZoek('');
    setOpen(false);
  }

  function handleInputChange(e) {
    setZoek(e.target.value);
    setOpen(true);
  }

  function handleClear() {
    onChange('', null);
    setZoek('');
    setOpen(false);
  }

  return (
    <div className="nest-soort-picker" ref={containerRef}>
      {geselecteerdeSoort && !open ? (
        <div className="nest-soort-picker__geselecteerd">
          <span className="nest-soort-picker__naam">{displayNaam(geselecteerdeSoort)}</span>
          <span className="nest-soort-picker__euring">{geselecteerdeSoort.euring_code}</span>
          <button
            type="button"
            className="nest-soort-picker__wijzig"
            onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 10); }}
          >
            wijzigen
          </button>
          <button type="button" className="nest-soort-picker__wis" onClick={handleClear} title="Wis soort">×</button>
        </div>
      ) : (
        <div className="nest-soort-picker__zoek">
          <input
            ref={inputRef}
            type="text"
            value={zoek}
            onChange={handleInputChange}
            onFocus={() => setOpen(true)}
            placeholder="Zoek op naam of EURING-code…"
            autoComplete="off"
          />
          {open && geselecteerdeSoort && (
            <button type="button" className="nest-soort-picker__annuleer" onClick={() => { setOpen(false); setZoek(''); }}>
              annuleren
            </button>
          )}
        </div>
      )}

      {open && suggesties.length > 0 && (
        <ul className="nest-soort-picker__lijst">
          {suggesties.map(s => (
            <li key={s.euring_code} onClick={() => handleSelect(s)}>
              <span className="nest-soort-picker__item-naam">{displayNaam(s)}</span>
              {s.naam_lat && s.naam_lat !== displayNaam(s) && (
                <span className="nest-soort-picker__item-lat">{s.naam_lat}</span>
              )}
              <span className="nest-soort-picker__item-code">{s.euring_code}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
