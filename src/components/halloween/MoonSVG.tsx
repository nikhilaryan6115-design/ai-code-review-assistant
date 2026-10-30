import React from 'react';

interface Props {
  size?: number;
  className?: string;
}

export const MoonSVG: React.FC<Props> = ({ size = 200, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`animate-moon-pulse ${className}`}
  >
    <defs>
      <radialGradient id="moonGrad" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#FFF9ED" stopOpacity="0.98" />
        <stop offset="40%" stopColor="#F5E8C9" stopOpacity="0.95" />
        <stop offset="80%" stopColor="#DFC79B" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#B89060" stopOpacity="0.85" />
      </radialGradient>
      <radialGradient id="moonAtmosphere" cx="50%" cy="50%" r="50%">
        <stop offset="60%" stopColor="transparent" />
        <stop offset="100%" stopColor="#C5A36B" stopOpacity="0.2" />
      </radialGradient>
      <filter id="moonGlowFilter">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="craterSoft">
        <feGaussianBlur stdDeviation="1.5" />
      </filter>
    </defs>

    {/* Outer atmospheric halo */}
    <circle cx="100" cy="100" r="98" fill="#C5A36B" opacity="0.05" />
    <circle cx="100" cy="100" r="90" fill="#C5A36B" opacity="0.06" />
    <circle cx="100" cy="100" r="82" fill="#C5A36B" opacity="0.06" />

    {/* Moon disk */}
    <circle cx="100" cy="100" r="75" fill="url(#moonGrad)" />

    {/* Moon craters */}
    <circle cx="65" cy="75" r="8" fill="#DFC79B" opacity="0.35" />
    <circle cx="65" cy="75" r="6" fill="#C8AD84" opacity="0.2" />

    <circle cx="130" cy="60" r="6" fill="#DFC79B" opacity="0.3" />
    <circle cx="130" cy="60" r="4.5" fill="#C8AD84" opacity="0.2" />

    <circle cx="115" cy="120" r="10" fill="#DFC79B" opacity="0.3" />
    <circle cx="115" cy="120" r="7.5" fill="#C8AD84" opacity="0.18" />

    <circle cx="75" cy="130" r="5" fill="#DFC79B" opacity="0.25" />

    <circle cx="145" cy="100" r="7" fill="#DFC79B" opacity="0.25" />

    {/* Crater rim highlights */}
    <path d="M58 70 Q65 65 72 70" stroke="#FFF9ED" strokeWidth="0.8" fill="none" opacity="0.3" />
    <path d="M108 113 Q115 108 122 113" stroke="#FFF9ED" strokeWidth="0.8" fill="none" opacity="0.25" />

    {/* Moon surface texture — subtle dark patches */}
    <path d="M80 85 Q95 80 110 90 Q125 100 120 115 Q105 120 90 115 Q75 105 80 85Z" fill="#C5A36B" opacity="0.08" />

    {/* Moon highlight (top-left) */}
    <path d="M55 55 Q70 45 90 50" stroke="#FFF9ED" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
    <ellipse cx="72" cy="68" rx="12" ry="8" fill="#FFF9ED" opacity="0.12" transform="rotate(-30 72 68)" />

    {/* Stars around the moon */}
    <circle cx="20" cy="30" r="1.5" fill="#C5A36B" opacity="0.7" />
    <circle cx="170" cy="25" r="1" fill="#C5A36B" opacity="0.6" />
    <circle cx="185" cy="75" r="1.5" fill="#FFF9ED" opacity="0.5" />
    <circle cx="12" cy="140" r="1" fill="#C5A36B" opacity="0.5" />
    <circle cx="175" cy="155" r="1.5" fill="#FFF9ED" opacity="0.6" />
    <circle cx="40" cy="175" r="1" fill="#C5A36B" opacity="0.4" />
    <circle cx="155" cy="185" r="1" fill="#C5A36B" opacity="0.5" />

    {/* 4-point star sparkle near moon */}
    <path d="M160 40 L162 36 L164 40 L168 42 L164 44 L162 48 L160 44 L156 42 Z" fill="#C5A36B" opacity="0.5" />
    <path d="M30 155 L31.5 152 L33 155 L36 156.5 L33 158 L31.5 161 L30 158 L27 156.5 Z" fill="#FFF9ED" opacity="0.4" />
  </svg>
);

export const CrescentMoonSVG: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="cresGrad" cx="60%" cy="40%" r="55%">
        <stop offset="0%" stopColor="#FFF9ED" />
        <stop offset="100%" stopColor="#C5A36B" />
      </radialGradient>
    </defs>
    <path
      d="M21 14C21 19.52 16.52 24 11 24C9.14 24 7.4 23.47 5.93 22.56C7.08 22.84 8.28 23 9.5 23C15.85 23 21 17.85 21 11.5C21 10.28 20.84 9.08 20.56 7.93C21.47 9.4 22 11.14 22 13C22 13.34 21.98 13.67 21.95 14H21Z"
      fill="url(#cresGrad)"
    />
    <path
      d="M18 11C18 16.52 13.52 21 8 21C6.57 21 5.22 20.68 4.02 20.12C5.73 20.68 7.57 21 9.5 21C15.85 21 21 15.85 21 9.5C21 7.57 20.68 5.73 20.12 4.02C20.68 5.22 21 6.57 21 8C21 9.04 20.66 10 20.05 10.78C19.41 10.94 18.72 11 18 11Z"
      fill="#F5E8C9"
      opacity="0.6"
    />
  </svg>
);
