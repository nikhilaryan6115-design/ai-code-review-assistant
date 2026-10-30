import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />,
    info: <Info className="w-4 h-4 text-wine-700 shrink-0 mt-0.5" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-warm-white text-warm-charcoal',
    error: 'border-red-200 bg-warm-white text-warm-charcoal',
    warning: 'border-amber-200 bg-warm-white text-warm-charcoal',
    info: 'border-warm-borderStrong bg-warm-white text-warm-charcoal',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-warm-lg ${borders[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-warm-charcoal tracking-tight">{toast.title}</h4>
              <p className="text-xs text-warm-muted mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-warm-dim hover:text-warm-charcoal transition-colors p-1 -mr-1 -mt-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
