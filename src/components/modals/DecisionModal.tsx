import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertOctagon, X, MessageSquare, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  submissionId: string;
  prNumber: number;
  developerName: string;
  decisionType: 'approve' | 'request_changes';
}

export const DecisionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  submissionId,
  prNumber,
  developerName,
  decisionType
}) => {
  const { approveSubmission, requestChanges, addToast } = useApp();
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const isApprove = decisionType === 'approve';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    if (isApprove) {
      approveSubmission(submissionId, feedback);
    } else {
      requestChanges(submissionId, feedback);
    }
    
    addToast(
      isApprove ? 'Pull Request Approved' : 'Changes Requested',
      `PR #${prNumber} decision sent to ${developerName}.`,
      isApprove ? 'success' : 'warning'
    );

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ivf-pri/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="bg-ivf-surface border border-ivf-border rounded-xl max-w-lg w-full shadow-lg overflow-hidden text-ivf-pri"
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-ivf-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-lg border flex items-center justify-center ${
                  isApprove
                    ? 'bg-green-50 border-green-200 text-ivf-green'
                    : 'bg-amber-50 border-amber-200 text-ivf-amber'
                }`}
              >
                {isApprove ? <CheckCircle2 className="w-4 h-4" /> : <AlertOctagon className="w-4 h-4" />}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ivf-pri">
                  {isApprove ? 'Authorize Pull Request' : 'Request Revision'}
                </h3>
                <p className="text-[11px] font-mono text-ivf-sec">
                  PR #{prNumber} • {developerName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-ivf-sec hover:text-ivf-pri transition-colors p-1 rounded-md cursor-pointer hover:bg-ivf-bgAlt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-[11px] font-mono text-ivf-sec mb-2 font-medium uppercase tracking-wider">
                Executive Review Notes & Instructions
              </label>
              <textarea
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide clear notes, requested fixes or approval remarks..."
                className="w-full bg-ivf-bgAlt border border-ivf-border rounded-lg p-3 text-xs text-ivf-pri placeholder-ivf-sec focus:outline-none focus:ring-1 focus:ring-ivf-accent focus:border-ivf-accent font-sans leading-relaxed"
                required
              />
            </div>

            <div className="p-3 rounded-lg bg-ivf-bgAlt border border-ivf-border text-xs text-ivf-sec flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-ivf-accent2 shrink-0 mt-0.5" />
              <span>
                This decision will be published to the repository timeline and sent directly to{' '}
                <strong className="text-ivf-pri">{developerName}</strong>.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-ivf-border">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-ivf-sec hover:text-ivf-pri hover:bg-ivf-bgAlt border border-ivf-border transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white transition-colors cursor-pointer ${
                  isApprove
                    ? 'bg-ivf-green hover:bg-green-700'
                    : 'bg-ivf-accent hover:bg-ivf-accentHov'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isApprove ? 'Confirm Authorization' : 'Submit Revision Request'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
