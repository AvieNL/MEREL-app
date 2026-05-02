import { useState } from 'react';
import DeterminatieModal from './DeterminatieModal';
import './Determinatie.css';

/**
 * DeterminatieButton
 *
 * Toont een klein 🔍-knopje. Bij klikken opent de DeterminatieModal.
 *
 * Props:
 *   aid         — aid-definitie
 *   formValues  — huidige formulierwaarden (null = naslag-modus)
 *   onGebruik   — callback(veld, waarde) voor write-back naar formulier (null = naslag-modus)
 *   label       — optionele knoptekst (default: 'Bepaal')
 */
export default function DeterminatieButton({ aid, getAidById, formValues, onGebruik, label = 'Bepaal' }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="det-btn"
        onClick={() => setOpen(true)}
        title={aid.naam}
      >
        <span className="det-btn__icon">🔍</span>
        {label}
      </button>

      {open && (
        <DeterminatieModal
          aid={aid}
          getAidById={getAidById}
          formValues={formValues}
          onGebruik={onGebruik}
          onSluit={() => setOpen(false)}
        />
      )}
    </>
  );
}
