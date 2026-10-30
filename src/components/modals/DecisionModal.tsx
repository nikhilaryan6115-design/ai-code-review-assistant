import React, { useState } from 'react';
import { CheckCircle2, AlertOctagon, X, Send, MessageSquare } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-dark-card border border-dark-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border ${
                isApprove
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
            >
              {isApprove ? <CheckCircle2 className="w-5 h-5" /> : <AlertOctagon className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {isApprove ? `Approve Pull Request #${prNumber}` : `Request Changes on #${prNumber}`}
              </h3>
              <p className="text-xs text-dark-dim">
                Sending feedback to <span className="text-dark-text font-medium">{developerName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-dark-dim hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-dark-muted mb-2">
              Manager Review Feedback & Instructions
            </label>
            <textarea
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide clear notes, requested fixes or approval remarks..."
              className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-xs text-white placeholder-dark-dim focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/30 font-sans"
              required
            />
          </div>

          <div className="p-3 rounded-lg bg-dark-subtle border border-dark-border/60 text-xs text-dark-muted flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
            <span>
              This feedback will be posted to the PR timeline and sent via notification to{' '}
              <strong className="text-dark-text">{developerName}</strong>.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-dark-muted hover:text-white hover:bg-dark-subtle transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all shadow-md ${
                isApprove
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30'
                  : 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/30'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isApprove ? 'Confirm Approval' : 'Submit Change Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
