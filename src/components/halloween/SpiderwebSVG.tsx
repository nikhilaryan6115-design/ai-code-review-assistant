import React from 'react';

interface Props {
  size?: number;
  className?: string;
  corner?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  opacity?: number;
}

export const SpiderwebSVG: React.FC<Props> = ({ 
  size = 120, 
  className = '', 
  corner = 'top-right',
  opacity = 0.35
}) => {
  // Flip horizontally for left corners
  const flipH = corner === 'top-left' || corner === 'bottom-left';
  // Flip vertically for bottom corners
  const flipV = corner === 'bottom-left' || corner === 'bottom-right';
  const transform = `${flipH ? 'scale(-1,1)' : ''} ${flipV ? 'scale(1,-1)' : ''}`.trim();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-spiderweb-sway ${className}`}
      style={{ opacity }}
    >
      <g transform={transform} transformOrigin="60 60">
        {/* Radial spokes from top-right corner (0, 0) */}
        <line x1="0" y1="0" x2="120" y2="0" stroke="#C5A36B" strokeWidth="0.6" opacity="0.7" />
        <line x1="0" y1="0" x2="0" y2="120" stroke="#C5A36B" strokeWidth="0.6" opacity="0.7" />
        <line x1="0" y1="0" x2="100" y2="40" stroke="#C5A36B" strokeWidth="0.5" opacity="0.6" />
        <line x1="0" y1="0" x2="80" y2="70" stroke="#C5A36B" strokeWidth="0.5" opacity="0.6" />
        <line x1="0" y1="0" x2="55" y2="95" stroke="#C5A36B" strokeWidth="0.5" opacity="0.6" />
        <line x1="0" y1="0" x2="25" y2="110" stroke="#C5A36B" strokeWidth="0.5" opacity="0.55" />
        <line x1="0" y1="0" x2="40" y2="20" stroke="#C5A36B" strokeWidth="0.4" opacity="0.5" />

        {/* Concentric arcs */}
        <path d="M20 0 Q14 14 0 20" stroke="#C5A36B" strokeWidth="0.6" fill="none" opacity="0.65" />
        <path d="M40 0 Q30 16 22 28 Q12 38 0 40" stroke="#C5A36B" strokeWidth="0.55" fill="none" opacity="0.6" />
        <path d="M62 0 Q48 20 38 36 Q24 54 12 66 Q4 78 0 62" stroke="#C5A36B" strokeWidth="0.5" fill="none" opacity="0.55" />
        <path d="M84 0 Q68 24 56 44 Q42 66 26 84 Q14 96 0 84" stroke="#C5A36B" strokeWidth="0.45" fill="none" opacity="0.5" />
        <path d="M106 0 Q86 28 72 52 Q58 76 40 98 Q26 114 0 106" stroke="#C5A36B" strokeWidth="0.4" fill="none" opacity="0.45" />
        <path d="M120 8 Q100 36 85 60 Q68 88 50 110 Q36 120 8 120" stroke="#C5A36B" strokeWidth="0.35" fill="none" opacity="0.4" />

        {/* Spider (optional small spider) */}
        <circle cx="30" cy="30" r="3" fill="#8B7398" opacity="0.6" />
        <line x1="27" y1="32" x2="22" y2="36" stroke="#8B7398" strokeWidth="0.5" opacity="0.6" />
        <line x1="33" y1="32" x2="38" y2="36" stroke="#8B7398" strokeWidth="0.5" opacity="0.6" />
        <line x1="27" y1="30" x2="21" y2="30" stroke="#8B7398" strokeWidth="0.5" opacity="0.6" />
        <line x1="33" y1="30" x2="39" y2="30" stroke="#8B7398" strokeWidth="0.5" opacity="0.6" />
        <line x1="27" y1="28" x2="22" y2="24" stroke="#8B7398" strokeWidth="0.5" opacity="0.6" />
        <line x1="33" y1="28" x2="38" y2="24" stroke="#8B7398" strokeWidth="0.5" opacity="0.6" />
        {/* Silk thread */}
        <line x1="30" y1="27" x2="30" y2="0" stroke="#C5A36B" strokeWidth="0.4" opacity="0.5" strokeDasharray="2 2" />
      </g>
    </svg>
  );
};
