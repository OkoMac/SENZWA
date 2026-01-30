import React from 'react';

export default function Logo({ height = 36, variant = 'full' }) {
  // Stacked tribal pattern logo matching uploaded brand identity
  // "SEN" top row, "ZWA" bottom row, with geometric African patterns inside letterforms

  if (variant === 'icon') {
    return (
      <svg width={height} height={height} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="iconGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4a843"/>
            <stop offset="50%" stopColor="#e8c566"/>
            <stop offset="100%" stopColor="#b8922e"/>
          </linearGradient>
          {tribalPatternDefs('icon')}
        </defs>
        <rect width="60" height="60" rx="14" fill="url(#iconGold)" opacity="0.08"/>
        <rect width="60" height="60" rx="14" stroke="url(#iconGold)" strokeWidth="1.5" fill="none" opacity="0.3"/>
        <text x="30" y="38" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="28"
          fill={`url(#tribalFill_icon)`} stroke="#d4a843" strokeWidth="0.8">
          S
        </text>
      </svg>
    );
  }

  // Full stacked logo: SEN / ZWA
  const w = height * 3.2;
  const h = height;

  return (
    <svg width={w} height={h} viewBox="0 0 180 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c9a24d"/>
          <stop offset="30%" stopColor="#ddb863"/>
          <stop offset="60%" stopColor="#c5a04a"/>
          <stop offset="100%" stopColor="#a8873a"/>
        </linearGradient>
        {tribalPatternDefs('main')}
      </defs>

      {/* SEN - top row */}
      <text x="2" y="26" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="28"
        letterSpacing="0.06em"
        fill={`url(#tribalFill_main)`}
        stroke="#c5a04a" strokeWidth="0.6">
        SEN
      </text>

      {/* ZWA - bottom row */}
      <text x="2" y="52" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="28"
        letterSpacing="0.06em"
        fill={`url(#tribalFill_main)`}
        stroke="#c5a04a" strokeWidth="0.6">
        ZWA
      </text>
    </svg>
  );
}

function tribalPatternDefs(id) {
  return (
    <>
      {/* Main tribal pattern - layered geometric African motifs */}
      <pattern id={`tribalBase_${id}`} width="16" height="16" patternUnits="userSpaceOnUse">
        {/* Diamond grid */}
        <path d="M8 0L16 8L8 16L0 8Z" fill="none" stroke="#c5a04a" strokeWidth="0.4" opacity="0.6"/>
        <path d="M8 3L13 8L8 13L3 8Z" fill="#c5a04a" opacity="0.15"/>
        <path d="M8 5L11 8L8 11L5 8Z" fill="#c5a04a" opacity="0.2"/>
        {/* Corner triangles */}
        <path d="M0 0L4 0L0 4Z" fill="#c5a04a" opacity="0.12"/>
        <path d="M16 0L16 4L12 0Z" fill="#c5a04a" opacity="0.12"/>
        <path d="M0 16L0 12L4 16Z" fill="#c5a04a" opacity="0.12"/>
        <path d="M16 16L12 16L16 12Z" fill="#c5a04a" opacity="0.12"/>
        {/* Center dot */}
        <circle cx="8" cy="8" r="1.2" fill="#c5a04a" opacity="0.35"/>
      </pattern>

      <pattern id={`tribalOverlay_${id}`} width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        {/* Zigzag lines */}
        <path d="M0 3L3 0L6 3L9 0L12 3" fill="none" stroke="#c5a04a" strokeWidth="0.3" opacity="0.4"/>
        <path d="M0 9L3 6L6 9L9 6L12 9" fill="none" stroke="#c5a04a" strokeWidth="0.3" opacity="0.4"/>
        {/* Small triangles */}
        <path d="M3 4L6 4L4.5 6Z" fill="#c5a04a" opacity="0.15"/>
        <path d="M9 4L12 4L10.5 6Z" fill="#c5a04a" opacity="0.15"/>
        {/* Dots */}
        <circle cx="1.5" cy="6" r="0.6" fill="#c5a04a" opacity="0.25"/>
        <circle cx="7.5" cy="6" r="0.6" fill="#c5a04a" opacity="0.25"/>
      </pattern>

      <pattern id={`tribalSpirals_${id}`} width="20" height="20" patternUnits="userSpaceOnUse">
        {/* Spiral-like curves */}
        <path d="M5 10C5 7 7 5 10 5C13 5 15 7 15 10" fill="none" stroke="#c5a04a" strokeWidth="0.35" opacity="0.3"/>
        <path d="M7 10C7 8.5 8.5 7 10 7C11.5 7 13 8.5 13 10" fill="none" stroke="#c5a04a" strokeWidth="0.35" opacity="0.4"/>
        {/* Cross-hatch marks */}
        <line x1="0" y1="0" x2="4" y2="4" stroke="#c5a04a" strokeWidth="0.25" opacity="0.2"/>
        <line x1="16" y1="0" x2="20" y2="4" stroke="#c5a04a" strokeWidth="0.25" opacity="0.2"/>
        <line x1="0" y1="16" x2="4" y2="20" stroke="#c5a04a" strokeWidth="0.25" opacity="0.2"/>
        <line x1="16" y1="16" x2="20" y2="20" stroke="#c5a04a" strokeWidth="0.25" opacity="0.2"/>
        {/* Small squares */}
        <rect x="1" y="14" width="2.5" height="2.5" fill="none" stroke="#c5a04a" strokeWidth="0.3" opacity="0.25"/>
        <rect x="16.5" y="14" width="2.5" height="2.5" fill="none" stroke="#c5a04a" strokeWidth="0.3" opacity="0.25"/>
        {/* Dots cluster */}
        <circle cx="10" cy="15" r="0.8" fill="#c5a04a" opacity="0.2"/>
        <circle cx="10" cy="10" r="0.5" fill="#c5a04a" opacity="0.3"/>
      </pattern>

      {/* Composite fill using layered rects in a nested pattern */}
      <pattern id={`tribalFill_${id}`} width="60" height="60" patternUnits="userSpaceOnUse">
        {/* Base gold fill */}
        <rect width="60" height="60" fill="#c5a04a" opacity="0.7"/>
        {/* Layer 1: Diamond grid */}
        <rect width="60" height="60" fill={`url(#tribalBase_${id})`}/>
        {/* Layer 2: Zigzag overlay */}
        <rect width="60" height="60" fill={`url(#tribalOverlay_${id})`}/>
        {/* Layer 3: Spirals and detail */}
        <rect width="60" height="60" fill={`url(#tribalSpirals_${id})`}/>
        {/* Additional inline geometric shapes for variety */}
        <path d="M10 10L15 5L20 10L15 15Z" fill="none" stroke="#a8873a" strokeWidth="0.5" opacity="0.3"/>
        <path d="M30 25L35 20L40 25L35 30Z" fill="none" stroke="#ddb863" strokeWidth="0.4" opacity="0.25"/>
        <path d="M45 8L50 3L55 8L50 13Z" fill="none" stroke="#a8873a" strokeWidth="0.5" opacity="0.3"/>
        <path d="M5 40L10 35L15 40L10 45Z" fill="none" stroke="#ddb863" strokeWidth="0.4" opacity="0.25"/>
        <path d="M25 45L30 40L35 45L30 50Z" fill="none" stroke="#a8873a" strokeWidth="0.5" opacity="0.3"/>
        <path d="M50 38L55 33L60 38L55 43Z" fill="none" stroke="#ddb863" strokeWidth="0.4" opacity="0.25"/>
        {/* Horizontal accent lines */}
        <line x1="0" y1="30" x2="60" y2="30" stroke="#a8873a" strokeWidth="0.3" opacity="0.15"/>
        <line x1="0" y1="15" x2="60" y2="15" stroke="#a8873a" strokeWidth="0.2" opacity="0.1"/>
        <line x1="0" y1="45" x2="60" y2="45" stroke="#a8873a" strokeWidth="0.2" opacity="0.1"/>
        {/* Triangular accents */}
        <path d="M20 0L25 5L15 5Z" fill="#ddb863" opacity="0.1"/>
        <path d="M40 55L45 60L35 60Z" fill="#ddb863" opacity="0.1"/>
        <path d="M55 20L60 25L50 25Z" fill="#ddb863" opacity="0.1"/>
      </pattern>
    </>
  );
}
