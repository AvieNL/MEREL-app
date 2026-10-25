import { RARITY_LABELS } from './utils';

// ◆ amber = vrij zeldzaam, ◆◆ oranje = zeldzaam, ◆ rood = zeer zeldzaam, ◆◆ donkerrood = extreem zeldzaam
export default function RarityIcon({ rarity }) {
  if (!rarity || rarity < 2) return null;
  const icons = rarity === 3 || rarity === 5 ? '◆◆' : '◆';
  const label = RARITY_LABELS[rarity] || '';
  return (
    <span className={`w-rarity-icon w-rarity-icon-${Math.min(rarity, 5)}`} title={label}>
      {icons}
    </span>
  );
}
