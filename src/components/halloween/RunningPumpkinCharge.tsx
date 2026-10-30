import React, { useEffect, useState } from 'react';
import { PumpkinSVG } from './PumpkinSVG';

interface Props {
  isActive: boolean;
  onComplete: () => void;
  startRect?: DOMRect | null;
}

export const RunningPumpkinCharge: React.FC<Props> = ({
  isActive,
  onComplete,
  startRect
}) => {
  const [phase, setPhase] = useState<'idle' | 'react' | 'running' | 'impact'>('idle');

  useEffect(() => {
    if (!isActive) {
      setPhase('idle');
      return;
    }

    // Check reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete();
      return;
    }

    // Step 1: Immediate reaction (eyes ignite & lock on viewer)
    setPhase('react');

    // Step 2: Running stride and rapid charge towards screen
    const runTimer = setTimeout(() => {
      setPhase('running');
    }, 140);

    // Step 3: Cinematic screen impact flash
    const impactTimer = setTimeout(() => {
      setPhase('impact');
    }, 720);

    // Step 4: Completion & Navigation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 900);

    // Failsafe timeout to guarantee navigation
    const failsafe = setTimeout(() => {
      onComplete();
    }, 1100);

    return () => {
      clearTimeout(runTimer);
      clearTimeout(impactTimer);
      clearTimeout(completeTimer);
      clearTimeout(failsafe);
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  // Approximate center calculation for smooth perspective scaling
  const initialLeft = startRect ? startRect.left + startRect.width / 2 : window.innerWidth * 0.78;
  const initialTop = startRect ? startRect.top + startRect.height / 2 : 240;

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-auto overflow-hidden flex items-center justify-center"
      style={{ perspective: 1000 }}
      aria-live="assertive"
      aria-label="Pumpkin charging forward"
    >
      {/* Background Dimmer & Screen Shake */}
      <div 
        className={`absolute inset-0 bg-[#0F0C10]/80 transition-opacity duration-300 ${
          phase === 'running' ? 'animate-camera-rumble opacity-90' : 'opacity-60'
        }`}
      />

      {/* Flying glowing embers / speed streaks during the charge */}
      {phase === 'running' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-pumpkin"
              style={{
                width: `${4 + (i % 3) * 3}px`,
                height: `${14 + (i % 4) * 8}px`,
                top: `${(i * 9) % 90}%`,
                left: `${(i * 13) % 95}%`,
                opacity: 0.6 + (i % 3) * 0.2,
                transform: `rotate(${15 + (i % 5) * 10}deg) scale(${1 + i * 0.2})`,
                transition: 'all 0.4s ease-out'
              }}
            />
          ))}
        </div>
      )}

      {/* The Running Pumpkin */}
      <div
        className={`relative z-10 transition-all ${
          phase === 'react' 
            ? 'scale-110 -translate-y-2' 
            : phase === 'running'
            ? 'animate-pumpkin-stride'
            : ''
        }`}
        style={{
          position: 'fixed',
          left: phase === 'react' ? initialLeft : '50%',
          top: phase === 'react' ? initialTop : '50%',
          transform: phase === 'react'
            ? 'translate(-50%, -50%) scale(1.15) rotate(0deg)'
            : phase === 'running'
            ? 'translate(-50%, -50%) scale(16) translateZ(400px)'
            : 'translate(-50%, -50%) scale(24) translateZ(800px)',
          transition: phase === 'react' 
            ? 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
            : 'transform 0.65s cubic-bezier(0.3, 0, 0.1, 1), left 0.5s ease-out, top 0.5s ease-out',
          transformOrigin: 'center center'
        }}
      >
        <PumpkinSVG
          size={130}
          glow={true}
          eyesIgnited={phase !== 'idle'}
          running={phase === 'running'}
        />
      </div>

      {/* Spooky Impact Flash Overlay */}
      {phase === 'impact' && (
        <div className="absolute inset-0 animate-impact-flash z-30 pointer-events-none" />
      )}
    </div>
  );
};
