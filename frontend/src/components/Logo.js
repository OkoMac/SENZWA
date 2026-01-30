import React from 'react';

export default function Logo({ height = 36, variant = 'full' }) {
  const h = height;
  const iconSize = h;
  const fontSize = h * 0.55;
  const subFontSize = h * 0.2;
  const sSize = h * 0.5;

  const Icon = () => (
    <svg width={iconSize} height={iconSize} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4a843"/>
          <stop offset="50%" stopColor="#e8c566"/>
          <stop offset="100%" stopColor="#b8922e"/>
        </linearGradient>
      </defs>
      <rect width="44" height="44" rx="12" fill="url(#logoGold)"/>
      <path d="M22 8L34 22L22 36L10 22Z" fill="none" stroke="#09090b" strokeWidth="1.5" opacity="0.2"/>
      <path d="M22 12L30 22L22 32L14 22Z" fill="none" stroke="#09090b" strokeWidth="1" opacity="0.15"/>
      <text x="22" y="28" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="18" fill="#09090b">S</text>
    </svg>
  );

  if (variant === 'icon') return <Icon />;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: h * 0.28 }}>
      <Icon />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{
          fontSize,
          fontWeight: 800,
          color: '#fafafa',
          letterSpacing: '0.1em',
          fontFamily: 'Inter, sans-serif',
        }}>
          SENZWA
        </span>
        <span style={{
          fontSize: subFontSize,
          fontWeight: 500,
          color: '#a1a1aa',
          letterSpacing: '0.15em',
          fontFamily: 'Inter, sans-serif',
          marginTop: 2,
        }}>
          MIGRATE SA
        </span>
      </div>
    </div>
  );
}
