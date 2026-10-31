import React, { useEffect, useState } from 'react';
import { RevAILogo } from '../brand/RevAILogo';

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

    // Tasteful, gentle loading transition with brand identity
    const timer = setTimeout(() => {
      onComplete();
    }, 400);

    return () => clearTimeout(timer);
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 pointer-events-auto bg-ivf-bg/95 backdrop-blur-xs transition-opacity duration-200 ${
        phase === 'transition' ? 'opacity-100' : 'opacity-0'
      } flex flex-col items-center justify-center gap-3 select-none`}
      aria-live="polite"
    >
      <RevAILogo layout="full" size="md" showBadge={true} animated={true} theme="light" />
      <span className="text-xs font-mono text-ivf-sec">Loading Submissions Ledger...</span>
    </div>
  );
};
