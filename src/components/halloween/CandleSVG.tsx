import React from 'react';

interface Props {
  size?: number;
  className?: string;
  flickering?: boolean;
}

export const CandleSVG: React.FC<Props> = ({ size = 40, className = '', flickering = true }) => (
  <svg
    width={size}
    height={size * 2.2}
    viewBox="0 0 40 88"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <radialGradient id="flameGrad" cx="50%" cy="70%" r="50%">
        <stop offset="0%" stopColor="#FCD34D" stopOpacity="1" />
        <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#E87927" stopOpacity="0.7" />
      </radialGradient>
      <radialGradient id="flameOuterGrad" cx="50%" cy="80%" r="50%">
        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#E87927" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="candleGrad" cx="30%" cy="50%" r="70%">
        <stop offset="0%" stopColor="#F5E8C9" stopOpacity="0.95" />
        <stop offset="60%" stopColor="#E8D4A2" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#C5A36B" stopOpacity="0.85" />
      </radialGradient>
      <filter id="flameGlow">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    {/* Flame outer glow */}
    <ellipse cx="20" cy="14" rx="10" ry="14" fill="url(#flameOuterGrad)" className={flickering ? 'animate-candle-flicker' : ''} />

    {/* Flame */}
    <g className={flickering ? 'animate-candle-flicker' : ''} filter="url(#flameGlow)">
      <path
        d="M20 2 C18 6 15 10 15 14 C15 18 17.2 20 20 20 C22.8 20 25 18 25 14 C25 10 22 6 20 2Z"
        fill="url(#flameGrad)"
      />
      {/* Inner flame core */}
      <path
        d="M20 8 C19 10 18 12 18 14 C18 16.2 18.9 17.5 20 17.5 C21.1 17.5 22 16.2 22 14 C22 12 21 10 20 8Z"
        fill="#FEF3C7"
        opacity="0.8"
      />
    </g>

    {/* Wick */}
    <line x1="20" y1="20" x2="20" y2="24" stroke="#3D2806" strokeWidth="1.2" strokeLinecap="round" />

    {/* Wax drip left */}
    <path d="M14 30 Q12 36 13 44" stroke="#E8D4A2" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
    {/* Wax drip right */}
    <path d="M26 32 Q28 40 27 50" stroke="#E8D4A2" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
    {/* Wax pool top */}
    <ellipse cx="20" cy="26" rx="8" ry="3" fill="#DFC79B" opacity="0.7" />

    {/* Candle body */}
    <rect x="13" y="26" width="14" height="50" rx="2" fill="url(#candleGrad)" />
    {/* Candle left edge highlight */}
    <rect x="13" y="26" width="2.5" height="50" rx="1" fill="#FFF9ED" opacity="0.2" />
    {/* Candle right edge shadow */}
    <rect x="24.5" y="26" width="2.5" height="50" rx="1" fill="#8B6840" opacity="0.2" />

    {/* Candle base */}
    <rect x="10" y="74" width="20" height="5" rx="1.5" fill="#8B6840" opacity="0.5" />
    <rect x="8" y="77" width="24" height="3" rx="1" fill="#5C3A0A" opacity="0.6" />

    {/* Glow pool at base */}
    <ellipse cx="20" cy="80" rx="16" ry="4" fill="#E87927" opacity="0.08" />
  </svg>
);

export const TinyCandleSVG: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size * 2} viewBox="0 0 20 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="tinyFlame" cx="50%" cy="70%" r="50%">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="100%" stopColor="#E87927" stopOpacity="0.7" />
      </radialGradient>
    </defs>
    <path d="M10 0 C9 3 7.5 5 7.5 7 C7.5 9.5 8.6 11 10 11 C11.4 11 12.5 9.5 12.5 7 C12.5 5 11 3 10 0Z" fill="url(#tinyFlame)" className="animate-candle-flicker" />
    <line x1="10" y1="11" x2="10" y2="13" stroke="#3D2806" strokeWidth="1" />
    <rect x="6" y="13" width="8" height="22" rx="1" fill="#E8D4A2" opacity="0.85" />
    <rect x="4" y="33" width="12" height="3" rx="1" fill="#5C3A0A" opacity="0.5" />
  </svg>
);
