import './BronBadge.css';

/**
 * Toont een klein boek-icoontje; bij mouseover verschijnt de bronvermelding als tooltip.
 * Vervangt alle inline "Bron: ..." teksten door een subtiel icoon.
 */
export default function BronBadge({ bron }) {
  if (!bron) return null;
  return (
    <span className="bron-badge" data-tooltip={bron} aria-label={`Bron: ${bron}`}>
      📖
    </span>
  );
}
