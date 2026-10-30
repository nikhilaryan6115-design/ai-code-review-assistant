import React from 'react';

interface Props {
  size?: number;
  className?: string;
  color?: string;
}

export const SkullSVG: React.FC<Props> = ({ size = 24, className = '', color = '#EF4444' }) => {
  const id = `skull_${Math.random().toString(36).substr(2, 9)}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id={`${id}_grad`} cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Cranium */}
      <path
        d="M12 2C7.03 2 3 6.03 3 11C3 13.8 4.37 16.27 6.5 17.84V20C6.5 20.55 6.95 21 7.5 21H9.5V22H14.5V21H16.5C17.05 21 17.5 20.55 17.5 20V17.84C19.63 16.27 21 13.8 21 11C21 6.03 16.97 2 12 2Z"
        fill={color}
        opacity="0.85"
      />
      {/* Cranium highlight */}
      <path
        d="M9 5C7 6.5 5.5 8.5 5.5 11"
        stroke="white"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.3"
      />
      {/* Left eye socket */}
      <ellipse cx="9" cy="11" rx="2.2" ry="2.5" fill="#151116" />
      {/* Left eye inner glow */}
      <ellipse cx="9" cy="11" rx="1.4" ry="1.6" fill={color} opacity="0.25" />
      {/* Right eye socket */}
      <ellipse cx="15" cy="11" rx="2.2" ry="2.5" fill="#151116" />
      {/* Right eye inner glow */}
      <ellipse cx="15" cy="11" rx="1.4" ry="1.6" fill={color} opacity="0.25" />
      {/* Nose cavity */}
      <path
        d="M11 14.5 L12 13 L13 14.5 L12 15.5 Z"
        fill="#151116"
        opacity="0.8"
      />
      {/* Teeth dividers */}
      <path
        d="M8.5 20 L8.5 18M11 20 L11 18M13.5 20 L13.5 18M16 20 L16 18"
        stroke="#151116"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const LargeSkullSVG: React.FC<{ size?: number; className?: string }> = ({ size = 80, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="skullGrad" cx="50%" cy="35%" r="55%">
        <stop offset="0%" stopColor="#FFF9ED" stopOpacity="0.95" />
        <stop offset="60%" stopColor="#DDD5C8" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#9B8B7C" stopOpacity="0.85" />
      </radialGradient>
      <filter id="skullGlow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    {/* Cranium */}
    <path d="M40 6C22.33 6 8 20.33 8 38C8 47.6 12.5 56.15 19.5 61.7V69C19.5 70.66 20.84 72 22.5 72H32V76H48V72H57.5C59.16 72 60.5 70.66 60.5 69V61.7C67.5 56.15 72 47.6 72 38C72 20.33 57.67 6 40 6Z" fill="url(#skullGrad)" />
    {/* Left eye */}
    <ellipse cx="28" cy="38" rx="9" ry="10" fill="#211B20" />
    <ellipse cx="28" cy="38" rx="5.5" ry="6.5" fill="#8F2937" opacity="0.35" />
    {/* Right eye */}
    <ellipse cx="52" cy="38" rx="9" ry="10" fill="#211B20" />
    <ellipse cx="52" cy="38" rx="5.5" ry="6.5" fill="#8F2937" opacity="0.35" />
    {/* Nose */}
    <path d="M37 50 L40 44 L43 50 L40 53Z" fill="#211B20" />
    {/* Teeth */}
    <path d="M26 70 L26 61M32 70 L32 61M38 70 L38 61M44 70 L44 61M50 70 L50 61M56 70 L56 61" stroke="#211B20" strokeWidth="2.5" strokeLinecap="round" />
    {/* Highlight */}
    <path d="M24 16C18 22 14 30 14 38" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.25" />
  </svg>
);
