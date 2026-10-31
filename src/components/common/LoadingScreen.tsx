import React from 'react';
import { motion } from 'framer-motion';
import { RevAILogo } from '../brand/RevAILogo';

export interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Initializing automated code review workspace...',
}) => {
  return (
    <motion.div
      key="revai-loading-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.15, ease: 'easeOut' } }}
      exit={{ opacity: 0, transition: { duration: 0.25, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ivf-bg text-ivf-pri px-4 select-none"
    >
      {/* Central Logo Identity Stack */}
      <div className="flex flex-col items-center max-w-sm w-full">
        <RevAILogo
          layout="stacked"
          theme="light"
          animated={true}
          size={64}
          showBadge={true}
          subtitle="Automated Code Review Platform"
          className="mb-6"
        />

        {/* Status indicator */}
        <p className="text-xs font-mono text-ivf-sec text-center tracking-tight">
          {message}
        </p>
      </div>

      {/* Subtle bottom indicator */}
      <div className="absolute bottom-6 text-[11px] font-mono text-ivf-sec/80 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-ivf-green animate-pulse" />
        <span>Qwen2.5-Coder Engine Active</span>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
