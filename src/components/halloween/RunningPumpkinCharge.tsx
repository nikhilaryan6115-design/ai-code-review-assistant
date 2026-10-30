import React, { useEffect, useState } from 'react';

interface Props {
  isActive: boolean;
  onComplete: () => void;
  startRect?: DOMRect | null;
}

export const RunningPumpkinCharge: React.FC<Props> = ({
  isActive,
  onComplete,
}) => {
  const [phase, setPhase] = useState<'idle' | 'transition'>('idle');

  useEffect(() => {
    if (!isActive) {
      setPhase('idle');
      return;
    }

    setPhase('transition');

    // Tasteful, gentle 220ms page transition
    const timer = setTimeout(() => {
      onComplete();
    }, 220);

    return () => clearTimeout(timer);
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 pointer-events-auto bg-[#0E1116] transition-opacity duration-200 ${
        phase === 'transition' ? 'opacity-90' : 'opacity-0'
      } flex items-center justify-center`}
      aria-live="polite"
    >
      <div className="flex items-center gap-3 text-xs font-mono text-[#96A0B0]">
        <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse"></span>
        <span>Loading Submissions Ledger...</span>
      </div>
    </div>
  );
};
