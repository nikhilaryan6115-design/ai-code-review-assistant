import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RevAILogo } from '../brand/RevAILogo';

export interface LoadingScreenProps {
  onComplete?: () => void;
  minDurationMs?: number;
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  minDurationMs = 1100,
  message = 'Initializing Qwen2.5-Coder static analysis engine...',
}) => {
  const [progress, setProgress] = useState(15);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / minDurationMs) * 100));
      setProgress(pct);

      if (elapsed >= minDurationMs) {
        clearInterval(interval);
        setIsFinished(true);
        if (onComplete) {
          // Allow fade-out to complete smoothly
          setTimeout(onComplete, 250);
        }
      }
    }, 40);

    return () => clearInterval(interval);
  }, [minDurationMs, onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="revai-loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.28, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ivf-bg text-ivf-pri px-4 select-none"
        >
          {/* Subtle ambient corner framing */}
          <div className="absolute top-6 left-6 text-[11px] font-mono tracking-widest text-ivf-sec uppercase">
            RevAI // System Boot
          </div>
          <div className="absolute top-6 right-6 text-[11px] font-mono text-ivf-sec">
            AST • 7B PARAMETERS
          </div>

          {/* Central Logo Identity Stack */}
          <div className="flex flex-col items-center max-w-sm w-full">
            <RevAILogo
              layout="stacked"
              theme="light"
              animated={true}
              size={52}
              showBadge={true}
              subtitle="Automated Code Review Platform"
              className="mb-8"
            />

            {/* Hairline Progress Meter */}
            <div className="w-48 h-0.5 bg-ivf-border rounded-full overflow-hidden mb-3">
              <motion.div
                className="h-full bg-ivf-accent"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.1 }}
              />
            </div>

            {/* Status Feedback */}
            <p className="text-xs font-mono text-ivf-sec text-center tracking-tight h-4">
              {progress >= 90 ? 'Environment ready. Mounting workspace...' : message}
            </p>
          </div>

          {/* Bottom Security / Architecture Indicator */}
          <div className="absolute bottom-6 text-[11px] font-mono text-ivf-sec/80 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ivf-green animate-pulse" />
            <span>Deterministic AST Sandbox Active</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
