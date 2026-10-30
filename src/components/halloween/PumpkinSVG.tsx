import React from 'react';

interface Props {
  size?: number;
  className?: string;
  glow?: boolean;
  eyesIgnited?: boolean;
  running?: boolean;
}

export const PumpkinSVG: React.FC<Props> = ({ 
  size = 120, 
  className = '', 
  glow = false,
  eyesIgnited = false,
  running = false
}) => {
  return (
    <div className={`relative inline-block select-none ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Natural realistic pumpkin shading */}
          <radialGradient id="pkBody" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#FA8C16" />
            <stop offset="40%" stopColor="#D46215" />
            <stop offset="85%" stopColor="#873809" />
            <stop offset="100%" stopColor="#431407" />
          </radialGradient>

          <radialGradient id="pkSideL" cx="40%" cy="48%" r="50%">
            <stop offset="0%" stopColor="#FA8C16" />
            <stop offset="50%" stopColor="#C4550F" />
            <stop offset="90%" stopColor="#612502" />
          </radialGradient>

          <radialGradient id="pkSideR" cx="60%" cy="48%" r="50%">
            <stop offset="0%" stopColor="#FA8C16" />
            <stop offset="50%" stopColor="#C4550F" />
            <stop offset="90%" stopColor="#612502" />
          </radialGradient>

          {/* Internal fire glow */}
          <radialGradient id="pkFire" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#FFFBE6" />
            <stop offset="35%" stopColor="#FFD666" />
            <stop offset="70%" stopColor="#FA8C16" />
            <stop offset="100%" stopColor="#D4380D" />
          </radialGradient>

          {/* Ignited fire for intense charge */}
          <radialGradient id="pkIgnitedFire" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#FFF1B8" />
            <stop offset="60%" stopColor="#FF7A00" />
            <stop offset="100%" stopColor="#D4380D" />
          </radialGradient>

          <filter id="pkGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="pkSuperGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Shadow underneath */}
        <ellipse cx="60" cy="106" rx="34" ry="7" fill="#000000" opacity="0.45" />

        {/* Running vine feet / legs if running */}
        {running && (
          <g className="animate-pumpkin-stride">
            {/* Left foot vine */}
            <path
              d="M42 98 C38 108 30 112 24 114 C28 112 36 106 44 100"
              stroke="#2E4A18"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Right foot vine */}
            <path
              d="M78 98 C82 108 90 112 96 114 C92 112 84 106 76 100"
              stroke="#2E4A18"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* Stem */}
        <path
          d="M58 28 C57 19 51 14 53 9 C56 5 62 7 60 14 C58 19 63 23 63 28"
          fill="#3B2610"
          stroke="#261706"
          strokeWidth="1"
        />
        {/* Curled vine tendril */}
        <path
          d="M62 14 C67 9 73 11 72 16 C71 20 66 19 68 23"
          stroke="#41611F"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />

        {/* Outer Back Segments */}
        <ellipse cx="32" cy="68" rx="16" ry="26" fill="url(#pkSideL)" opacity="0.9" />
        <ellipse cx="88" cy="68" rx="16" ry="26" fill="url(#pkSideR)" opacity="0.9" />

        {/* Middle Segments */}
        <ellipse cx="44" cy="70" rx="20" ry="30" fill="url(#pkSideL)" />
        <ellipse cx="76" cy="70" rx="20" ry="30" fill="url(#pkSideR)" />

        {/* Center Main Segment */}
        <ellipse cx="60" cy="71" rx="24" ry="32" fill="url(#pkBody)" />

        {/* Natural Vertical Rib Ribbons / Creases */}
        <path d="M60 40 Q57 71 60 102" stroke="#5C2002" strokeWidth="1.8" fill="none" opacity="0.45" strokeLinecap="round" />
        <path d="M47 43 Q43 71 46 99" stroke="#5C2002" strokeWidth="1.6" fill="none" opacity="0.4" strokeLinecap="round" />
        <path d="M73 43 Q77 71 74 99" stroke="#5C2002" strokeWidth="1.6" fill="none" opacity="0.4" strokeLinecap="round" />
        <path d="M36 47 Q32 71 35 95" stroke="#481600" strokeWidth="1.4" fill="none" opacity="0.35" strokeLinecap="round" />
        <path d="M84 47 Q88 71 85 95" stroke="#481600" strokeWidth="1.4" fill="none" opacity="0.35" strokeLinecap="round" />

        {/* Subtle Top Highlights */}
        <path d="M52 42 Q60 38 68 42" stroke="#FFA940" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
        <path d="M38 46 Q43 43 48 46" stroke="#FFA940" strokeWidth="1.2" fill="none" opacity="0.4" strokeLinecap="round" />
        <path d="M72 46 Q77 43 82 46" stroke="#FFA940" strokeWidth="1.2" fill="none" opacity="0.4" strokeLinecap="round" />

        {/* ================= CARVED FACE ================= */}
        <g filter={eyesIgnited ? "url(#pkSuperGlow)" : glow ? "url(#pkGlowFilter)" : undefined}>
          {/* Left Eye - Angled sinister cut */}
          <path
            d="M38 64 L48 57 L47 67 Z"
            fill={eyesIgnited ? "url(#pkIgnitedFire)" : "url(#pkFire)"}
          />
          {/* Left Eye Deep Carve Inset Shadow */}
          <path
            d="M38 64 L48 57"
            stroke="#4D1500"
            strokeWidth="1.2"
            fill="none"
          />

          {/* Right Eye - Angled sinister cut */}
          <path
            d="M82 64 L72 57 L73 67 Z"
            fill={eyesIgnited ? "url(#pkIgnitedFire)" : "url(#pkFire)"}
          />
          {/* Right Eye Deep Carve Inset Shadow */}
          <path
            d="M82 64 L72 57"
            stroke="#4D1500"
            strokeWidth="1.2"
            fill="none"
          />

          {/* Carved Nose */}
          <path
            d="M60 68 L56 75 L64 75 Z"
            fill={eyesIgnited ? "url(#pkIgnitedFire)" : "url(#pkFire)"}
          />

          {/* Sinister Carved Grin with Sharp Teeth */}
          <path
            d="M38 80 L44 86 L49 81 L54 87 L60 80 L66 87 L71 81 L76 86 L82 80 L78 92 L68 96 L60 97 L52 96 L42 92 Z"
            fill={eyesIgnited ? "url(#pkIgnitedFire)" : "url(#pkFire)"}
          />
          {/* Internal Tooth Silhouettes */}
          <path
            d="M48 81 L48 87 L52 87 L52 82 M68 81 L68 87 L72 87 L72 82 M56 94 L56 89 L60 89 L60 95"
            fill="#3B1100"
            stroke="#3B1100"
            strokeWidth="0.8"
          />
        </g>
      </svg>
    </div>
  );
};

export const SmallPumpkinSVG: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M11 4 C11 2 13 2 13 5" stroke="#3B2610" strokeWidth="1.5" strokeLinecap="round" />
    <ellipse cx="12" cy="14" rx="9" ry="8" fill="#D46215" />
    <ellipse cx="12" cy="14" rx="6" ry="8" fill="#FA8C16" />
    <path d="M8 12 L10 10 L10 13 Z" fill="#FFE58F" />
    <path d="M16 12 L14 10 L14 13 Z" fill="#FFE58F" />
    <path d="M8 17 Q12 20 16 17" stroke="#FFE58F" strokeWidth="1.4" fill="none" strokeLinecap="round" />
  </svg>
);
