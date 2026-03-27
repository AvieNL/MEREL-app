export function IconRing({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      {/* Buitenste ring */}
      <circle cx="12" cy="12" r="9" />
      {/* Binnenste opening */}
      <circle cx="12" cy="12" r="5" />
      {/* Kleine inkeping bovenaan — ring kan open */}
      <path d="M12 3 L12 1" strokeWidth="2.5" stroke="currentColor" />
    </svg>
  );
}

export function IconFlag({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

export function IconEdit({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

/** Vogelnest — gevlochten komvorm */
export function IconVogelNest({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      {/* Bodem van het nest */}
      <path d="M4 13 Q4 20 12 20 Q20 20 20 13" />
      {/* Gevlochten rand van takjes */}
      <path d="M4 13 Q6 9 9 11 Q12 7.5 15 11 Q18 9 20 13" />
      {/* Takjes binnenin */}
      <path d="M7 16.5 Q10 14 14 16" strokeWidth="1.2" />
      <path d="M8.5 18.5 Q12 17 16 18" strokeWidth="1.2" />
    </svg>
  );
}

/** Toont het juiste icoon op basis van nest.locatie_type */
export function NestIcoon({ nest, size = 18 }) {
  if (nest?.locatie_type === 'nest') {
    return <IconVogelNest size={size} />;
  }
  return <span aria-hidden="true" style={{ fontSize: `${size}px`, lineHeight: 1 }}>⌂</span>;
}

export function IconDelete({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}
