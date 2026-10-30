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
          className="bg-nocturne-plum border border-nocturne-border rounded-xl max-w-lg w-full p-6 shadow-dropdown space-y-4 text-nocturne-ivory"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg border ${
                  isApprove
                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                    : 'bg-pumpkin-dark/15 text-pumpkin border-pumpkin/30'
                }`}
              >
                {isApprove ? <CheckCircle2 className="w-5 h-5" /> : <AlertOctagon className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-nocturne-ivory">
                  {isApprove ? `Approve Pull Request #${prNumber}` : `Request Changes on #${prNumber}`}
                </h3>
                <p className="text-xs text-nocturne-grey">
                  Sending feedback to <strong className="text-nocturne-ivory font-medium">{developerName}</strong>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-nocturne-grey/60 hover:text-nocturne-ivory p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-nocturne-grey mb-1.5">
                Manager Review Feedback & Instructions
              </label>
              <textarea
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide clear notes, requested fixes or approval remarks..."
                className="w-full bg-nocturne-bg border border-nocturne-border rounded-lg p-3 text-xs text-nocturne-ivory placeholder-nocturne-grey focus:outline-none focus:border-pumpkin/50 focus:bg-nocturne-plum font-sans leading-relaxed"
                required
              />
            </div>

            <div className="p-3 rounded-lg bg-nocturne-charcoal border border-nocturne-border text-xs text-nocturne-grey flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-pumpkin shrink-0 mt-0.5" />
              <span>
                This decision will be published to the repository timeline and sent directly to{' '}
                <strong className="text-nocturne-ivory">{developerName}</strong>.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-nocturne-border">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-nocturne-grey hover:text-nocturne-ivory hover:bg-nocturne-wine transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all shadow-sm cursor-pointer ${
                  isApprove
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-pumpkin hover:bg-pumpkin-dark text-nocturne-bg'
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
