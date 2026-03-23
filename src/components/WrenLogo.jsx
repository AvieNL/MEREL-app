/**
 * WrenLogo — SVG illustratie van een winterkoning (Troglodytes troglodytes).
 * Gebruikt als app-logo voor WREN.
 */
export default function WrenLogo({ size = 32, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* Branch */}
      <rect x="5" y="83" width="90" height="7" rx="3.5" fill="#5E3218"/>

      {/* Body */}
      <ellipse cx="54" cy="66" rx="21" ry="14" transform="rotate(-10 54 66)" fill="#9E6840"/>

      {/* Tail — bijna verticaal omhoog, kenmerkend voor de winterkoning */}
      <path d="M 71,57 C 74,48 77,38 75,28 C 73,21 67,23 66,31 C 65,41 67,51 71,57 Z" fill="#7A4820"/>
      <path d="M 70,50 L 74,34" stroke="#5E3218" strokeWidth="1.2" strokeLinecap="round" opacity="0.45"/>
      <path d="M 73,51 L 76,36" stroke="#5E3218" strokeWidth="1.2" strokeLinecap="round" opacity="0.45"/>

      {/* Head */}
      <circle cx="38" cy="51" r="12.5" fill="#9E6840"/>

      {/* Supercilium — crème wenkbrauwstreep */}
      <path d="M 27,46 C 32,42 40,42 48,45" stroke="#F2DC9E" strokeWidth="2.8" fill="none" strokeLinecap="round"/>

      {/* Keel/borst lichter */}
      <ellipse cx="43" cy="61" rx="9" ry="8" fill="#BE8855" opacity="0.55"/>
      <ellipse cx="50" cy="71" rx="8" ry="6" fill="#C49060" opacity="0.40"/>

      {/* Snavel */}
      <path d="M 27,50 L 12,48 L 27,54 Z" fill="#5E3218"/>

      {/* Oog */}
      <circle cx="31" cy="48" r="3.5" fill="#1A0800"/>
      <circle cx="30" cy="47" r="1.2" fill="rgba(255,255,255,0.9)"/>

      {/* Vleugelstreepjes */}
      <path d="M 47,62 C 57,59 66,61 72,64" stroke="#6B3A1A" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
      <path d="M 46,67 C 57,64 67,66 73,69" stroke="#6B3A1A" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
      <path d="M 47,72 C 56,70 65,72 71,74" stroke="#6B3A1A" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>

      {/* Poten */}
      <path d="M 47,79 L 44,83" stroke="#5E3218" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M 54,80 L 52,83" stroke="#5E3218" strokeWidth="2.2" strokeLinecap="round"/>

      {/* Tenen */}
      <path d="M 39,83 L 44,83 L 48,82" stroke="#5E3218" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M 44,83 L 42,85" stroke="#5E3218" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M 48,83 L 52,83 L 56,82" stroke="#5E3218" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M 52,83 L 50,85" stroke="#5E3218" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
