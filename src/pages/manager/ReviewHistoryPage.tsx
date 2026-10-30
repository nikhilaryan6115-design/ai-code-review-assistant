import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { RiskBadge } from '../../components/common/RiskBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  GitPullRequest, 
  ArrowRight, 
  Bot, 
  MessageSquare,
  Search,
  Filter
} from 'lucide-react';

export const ReviewHistoryPage: React.FC = () => {
  const { submissions } = useApp();
  const navigate = useNavigate();
  const [filterDecision, setFilterDecision] = useState<'all' | 'approved' | 'changes_requested'>('all');

  const historySubmissions = submissions.filter((sub) => {
    if (filterDecision === 'all') return true;
    return sub.managerDecision?.decision === filterDecision;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-brand-blue" />
            Code Review Audit & History
          </h1>
          <p className="text-xs text-dark-muted mt-1">
            Complete audit trail of AI automated evaluations, manager sign-offs, and developer feedback threads.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 bg-dark-card border border-dark-border p-1 rounded-xl">
          <button
            onClick={() => setFilterDecision('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              filterDecision === 'all'
                ? 'bg-brand-blue text-white font-bold'
                : 'text-dark-muted hover:text-white'
            }`}
          >
            All Logs ({submissions.length})
          </button>
          <button
            onClick={() => setFilterDecision('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              filterDecision === 'approved'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-dark-muted hover:text-white'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilterDecision('changes_requested')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              filterDecision === 'changes_requested'
                ? 'bg-amber-600 text-white font-bold'
                : 'text-dark-muted hover:text-white'
            }`}
          >
            Changes Requested
          </button>
        </div>
      </div>

      {/* History Timeline Cards */}
      <div className="space-y-4">
        {historySubmissions.map((sub) => {
          const isApproved = sub.status === 'approved' || sub.managerDecision?.decision === 'approved';
          const isChangesReq = sub.status === 'changes_requested' || sub.managerDecision?.decision === 'changes_requested';

          return (
            <div
              key={sub.id}
              onClick={() => navigate(`/manager/reviews/${sub.id}`)}
              className="bg-dark-card border border-dark-border rounded-2xl p-5 hover:border-dark-borderLight transition-all cursor-pointer shadow-lg space-y-4"
            >
              {/* Row 1: Top info & status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-border/60 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-brand-blue font-bold text-sm">
                    PR #{sub.prNumber}
                  </span>
                  <span className="text-white font-semibold text-sm line-clamp-1">
                    {sub.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={sub.status} size="sm" />
                  <RiskBadge level={sub.riskLevel} score={sub.riskScore} size="sm" />
                </div>
              </div>

              {/* Row 2: Developer & Repo info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <img
                    src={sub.developer.avatar}
                    alt={sub.developer.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div>
                    <span className="text-white font-sans font-medium">{sub.developer.name}</span>
                    <span className="text-dark-dim text-[11px] block">{sub.repository.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-dark-muted">
                  <Clock className="w-4 h-4 text-brand-blue" />
                  <span>
                    Submitted: {new Date(sub.submissionDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-dark-muted md:justify-end">
                  <Bot className="w-4 h-4 text-brand-purpleLight" />
                  <span>AI Pre-check: {sub.reviewTimeSeconds || 14}s elapsed</span>
                </div>
              </div>

              {/* Row 3: Manager Decision & Feedback */}
              {sub.managerDecision ? (
                <div
                  className={`p-3.5 rounded-xl border text-xs ${
                    sub.managerDecision.decision === 'approved'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase font-bold mb-1">
                    <span className="flex items-center gap-1.5">
                      {sub.managerDecision.decision === 'approved' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      Manager Action: {sub.managerDecision.decision.replace('_', ' ')}
                    </span>
                    <span className="opacity-80">
                      Sign-off by {sub.managerDecision.managerName}
                    </span>
                  </div>
                  <p className="text-white font-sans mt-1 leading-relaxed">
                    "{sub.managerDecision.feedback}"
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-dark-subtle border border-dark-border/60 text-xs text-dark-dim flex items-center justify-between">
                  <span>Manager decision is currently pending review.</span>
                  <span className="text-brand-blue font-mono hover:underline">
                    Open Review Details →
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
