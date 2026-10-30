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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="bg-[#161B22] border border-[#2E3643] rounded-md max-w-lg w-full shadow-xl overflow-hidden text-[#F2F4F8]"
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-[#2E3643] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded border flex items-center justify-center ${
                  isApprove
                    ? 'bg-[#2D6A4F]/15 border-[#2D6A4F]/30 text-[#4EAA78]'
                    : 'bg-[#B7791F]/15 border-[#B7791F]/30 text-[#D4AF67]'
                }`}
              >
                {isApprove ? <CheckCircle2 className="w-4 h-4" /> : <AlertOctagon className="w-4 h-4" />}
              </div>
              <div>
                <h3 className="text-sm font-serif font-medium text-[#F2F4F8]">
                  {isApprove ? 'Authorize Pull Request' : 'Request Revision'}
                </h3>
                <p className="text-[11px] font-mono text-[#96A0B0]">
                  PR #{prNumber} • {developerName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[#96A0B0] hover:text-[#F2F4F8] transition-colors p-1 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-[#96A0B0] mb-2 font-medium">
                Executive Review Notes & Instructions
              </label>
              <textarea
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide clear notes, requested fixes or approval remarks..."
                className="w-full bg-[#0E1116] border border-[#2E3643] rounded p-3 text-xs text-[#F2F4F8] placeholder-[#96A0B0] focus:outline-none focus:border-[#C5A059] font-sans leading-relaxed"
                required
              />
            </div>

            <div className="p-3 rounded bg-[#1D232C] border border-[#2E3643] text-xs text-[#96A0B0] flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <span>
                This decision will be published to the repository timeline and sent directly to{' '}
                <strong className="text-[#F2F4F8]">{developerName}</strong>.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#2E3643]">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded text-xs font-medium text-[#96A0B0] hover:text-[#F2F4F8] hover:bg-[#1D232C] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex items-center gap-1.5 px-4 py-2 rounded text-xs font-medium text-white transition-colors cursor-pointer ${
                  isApprove
                    ? 'bg-[#2D6A4F] hover:bg-[#387F60]'
                    : 'bg-[#1A2332] hover:bg-[#233045] border border-[#2E3643]'
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
