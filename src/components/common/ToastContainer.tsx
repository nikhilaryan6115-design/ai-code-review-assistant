import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-ivf-green shrink-0 mt-0.5" />,
    error:   <AlertCircle className="w-4 h-4 text-ivf-red shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-4 h-4 text-ivf-amber shrink-0 mt-0.5" />,
    info:    <Info className="w-4 h-4 text-ivf-sec shrink-0 mt-0.5" />,
  };

  const borders = {
    success: 'border-green-200 bg-ivf-surface text-ivf-pri',
    error:   'border-red-200 bg-ivf-surface text-ivf-pri',
    warning: 'border-amber-200 bg-ivf-surface text-ivf-pri',
    info:    'border-ivf-border bg-ivf-surface text-ivf-pri',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-[0_4px_12px_var(--color-shadow)] ${borders[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-ivf-pri tracking-tight">{toast.title}</h4>
              <p className="text-xs text-ivf-sec mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-ivf-sec hover:text-ivf-pri transition-colors p-1 -mr-1 -mt-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
