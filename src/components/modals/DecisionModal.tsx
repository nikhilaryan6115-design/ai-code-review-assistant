import React, { useState } from 'react';
import { CheckCircle2, AlertOctagon, X, Send, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: 'approve' | 'request_changes';
  prNumber: number;
  developerName: string;
  onConfirm: (feedback: string) => void;
}

export const DecisionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  type,
  prNumber,
  developerName,
  onConfirm
}) => {
  const [feedback, setFeedback] = useState(
    type === 'approve'
      ? 'Verified the implementation against AI findings and automated test suite. Ready for merge.'
      : 'Please address the critical SQL injection and input validation findings identified by Qwen2.5-Coder before resubmitting.'
  );

  if (!isOpen) return null;

  const isApprove = type === 'approve';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(feedback);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-charcoal/40 backdrop-blur-xs">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.18 }}
          className="bg-warm-white border border-warm-border rounded-xl max-w-lg w-full p-6 shadow-warm-dropdown space-y-4 text-warm-charcoal"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg border ${
                  isApprove
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-900 border-amber-300'
                }`}
              >
                {isApprove ? <CheckCircle2 className="w-5 h-5" /> : <AlertOctagon className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-warm-charcoal">
                  {isApprove ? `Approve Pull Request #${prNumber}` : `Request Changes on #${prNumber}`}
                </h3>
                <p className="text-xs text-warm-muted">
                  Sending feedback to <strong className="text-warm-charcoal font-medium">{developerName}</strong>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-warm-dim hover:text-warm-charcoal p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-warm-muted mb-1.5">
                Manager Review Feedback & Instructions
              </label>
              <textarea
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide clear notes, requested fixes or approval remarks..."
                className="w-full bg-warm-bg border border-warm-border rounded-lg p-3 text-xs text-warm-charcoal placeholder-warm-dim focus:outline-none focus:border-wine focus:bg-warm-white font-sans leading-relaxed"
                required
              />
            </div>

            <div className="p-3 rounded-lg bg-warm-subtle/70 border border-warm-border text-xs text-warm-muted flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-wine shrink-0 mt-0.5" />
              <span>
                This decision will be published to the repository timeline and sent directly to{' '}
                <strong className="text-warm-charcoal">{developerName}</strong>.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-warm-border/60">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-warm-muted hover:text-warm-charcoal hover:bg-warm-subtle transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all shadow-sm ${
                  isApprove
                    ? 'bg-emerald-700 hover:bg-emerald-800'
                    : 'bg-wine hover:bg-wine-800'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isApprove ? 'Confirm Approval' : 'Submit Change Request'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
