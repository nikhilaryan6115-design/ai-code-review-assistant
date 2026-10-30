import React from 'react';

interface BatProps {
  size?: number;
  className?: string;
  color?: string;
}

export const BatSVG: React.FC<BatProps> = ({ size = 32, className = '', color = '#8B7398' }) => (
  <svg width={size} height={size * 0.55} viewBox="0 0 64 35" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Body */}
    <ellipse cx="32" cy="20" rx="6" ry="7" fill={color} />
    {/* Head */}
    <ellipse cx="32" cy="14" rx="4.5" ry="4" fill={color} />
    {/* Left ear */}
    <path d="M28.5 11 L26 6 L31 10 Z" fill={color} />
    {/* Right ear */}
    <path d="M35.5 11 L38 6 L33 10 Z" fill={color} />
    {/* Left wing */}
    <path
      d="M28 17 C22 12 12 8 4 14 C10 15 14 18 16 22 C20 18 24 17 28 19 Z"
      fill={color}
      opacity="0.9"
    />
    {/* Left wing membrane lines */}
    <path d="M28 18 L10 14" stroke={color} strokeWidth="0.4" opacity="0.5" />
    <path d="M25 20 L14 20" stroke={color} strokeWidth="0.4" opacity="0.5" />
    {/* Right wing */}
    <path
      d="M36 17 C42 12 52 8 60 14 C54 15 50 18 48 22 C44 18 40 17 36 19 Z"
      fill={color}
      opacity="0.9"
    />
    {/* Right wing membrane lines */}
    <path d="M36 18 L54 14" stroke={color} strokeWidth="0.4" opacity="0.5" />
    <path d="M39 20 L50 20" stroke={color} strokeWidth="0.4" opacity="0.5" />
    {/* Eyes */}
    <circle cx="30.5" cy="13.5" r="0.8" fill="#E87927" />
    <circle cx="33.5" cy="13.5" r="0.8" fill="#E87927" />
    {/* Wing tips */}
    <path d="M4 14 L2 18 L6 16 Z" fill={color} opacity="0.7" />
    <path d="M60 14 L62 18 L58 16 Z" fill={color} opacity="0.7" />
  </svg>
);

interface SwarmProps {
  className?: string;
}

export const BatSwarm: React.FC<SwarmProps> = ({ className = '' }) => (
  <div className={`relative ${className}`} aria-hidden="true">
    <div className="absolute animate-bat-float" style={{ top: '10%', left: '5%' }}>
      <BatSVG size={28} color="#6B5B7A" />
    </div>
    <div className="absolute animate-bat-float-2" style={{ top: '30%', left: '20%' }}>
      <BatSVG size={18} color="#5A4A6A" />
    </div>
    <div className="absolute animate-bat-float-3" style={{ top: '5%', left: '40%' }}>
      <BatSVG size={22} color="#7B6B8A" />
    </div>
    <div className="absolute animate-bat-float" style={{ top: '50%', left: '60%', animationDelay: '0.8s' }}>
      <BatSVG size={16} color="#5A4A6A" />
    </div>
    <div className="absolute animate-bat-float-2" style={{ top: '15%', left: '75%', animationDelay: '1.2s' }}>
      <BatSVG size={24} color="#6B5B7A" />
    </div>
    <div className="absolute animate-bat-float-3" style={{ top: '60%', left: '88%', animationDelay: '0.4s' }}>
      <BatSVG size={14} color="#4A3A5A" />
    </div>
  </div>
);

export const CornerBats: React.FC<{ side?: 'left' | 'right' }> = ({ side = 'right' }) => (
  <div className={`absolute top-0 ${side === 'right' ? 'right-0' : 'left-0'} pointer-events-none`} aria-hidden="true">
    <div className={`animate-bat-float ${side === 'left' ? 'scale-x-[-1]' : ''}`} style={{ animationDelay: '0s' }}>
      <BatSVG size={20} color="#5A4A6A" />
    </div>
    <div className={`animate-bat-float-2 mt-2 ${side === 'left' ? 'ml-4 scale-x-[-1]' : 'mr-4'}`} style={{ animationDelay: '0.6s' }}>
      <BatSVG size={14} color="#4A3A5A" />
    </div>
  </div>
);
