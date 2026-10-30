import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-4 h-4 text-[#A63232] shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />,
    info: <Info className="w-4 h-4 text-[#96A0B0] shrink-0 mt-0.5" />,
  };

  const borders = {
    success: 'border-[#2D6A4F]/40 bg-[#161B22] text-[#F2F4F8]',
    error: 'border-[#A63232]/40 bg-[#161B22] text-[#F2F4F8]',
    warning: 'border-[#C5A059]/40 bg-[#161B22] text-[#F2F4F8]',
    info: 'border-[#2E3643] bg-[#161B22] text-[#F2F4F8]',
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
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded border shadow-lg ${borders[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-serif font-medium text-[#F2F4F8] tracking-tight">{toast.title}</h4>
              <p className="text-xs text-[#96A0B0] mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#96A0B0] hover:text-[#F2F4F8] transition-colors p-1 -mr-1 -mt-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
