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
  Bot, 
  ArrowRight,
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
          <h1 className="text-xl sm:text-2xl font-bold text-nocturne-ivory tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-pumpkin" />
            Code Review Audit & History
          </h1>
          <p className="text-xs text-nocturne-grey mt-1">
            Complete audit trail of AI automated evaluations, manager sign-offs, and developer feedback threads.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-nocturne-plum border border-nocturne-border p-1 rounded-lg shadow-card">
          <button
            onClick={() => setFilterDecision('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filterDecision === 'all'
                ? 'bg-pumpkin text-nocturne-bg font-semibold'
                : 'text-nocturne-grey hover:text-nocturne-ivory'
            }`}
          >
            All Logs ({submissions.length})
          </button>
          <button
            onClick={() => setFilterDecision('approved')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filterDecision === 'approved'
                ? 'bg-emerald-700 text-white font-semibold'
                : 'text-nocturne-grey hover:text-nocturne-ivory'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilterDecision('changes_requested')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filterDecision === 'changes_requested'
                ? 'bg-amber-700 text-white font-semibold'
                : 'text-nocturne-grey hover:text-nocturne-ivory'
            }`}
          >
            Changes Requested
          </button>
        </div>
      </div>

      {/* History Timeline Cards */}
      <div className="space-y-3.5">
        {historySubmissions.map((sub) => {
          return (
            <div
              key={sub.id}
              onClick={() => navigate(`/manager/reviews/${sub.id}`)}
              className="bg-nocturne-plum border border-nocturne-border rounded-xl p-5 hover:border-nocturne-borderSubtle transition-all cursor-pointer shadow-card space-y-3.5"
            >
              {/* Row 1: Top info & status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-nocturne-border pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-pumpkin font-bold text-xs">
                    PR #{sub.prNumber}
                  </span>
                  <span className="text-nocturne-ivory font-semibold text-sm line-clamp-1">
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
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-nocturne-border"
                  />
                  <div>
                    <span className="text-nocturne-ivory font-sans font-medium">{sub.developer.name}</span>
                    <span className="text-nocturne-grey text-[11px] block">{sub.repository.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-nocturne-grey">
                  <Clock className="w-3.5 h-3.5 text-tobacco" />
                  <span>
                    Submitted: {new Date(sub.submissionDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-nocturne-grey md:justify-end">
                  <Bot className="w-3.5 h-3.5 text-pumpkin" />
                  <span>AI Pre-check: {sub.reviewTimeSeconds || 14}s</span>
                </div>
              </div>

              {/* Row 3: Manager Decision & Feedback */}
              {sub.managerDecision ? (
                <div
                  className={`p-3 rounded-lg border text-xs ${
                    sub.managerDecision.decision === 'approved'
                      ? 'bg-emerald-950/40 text-emerald-900 border-emerald-800/40'
                      : 'bg-pumpkin-dark/15 text-pumpkin border-pumpkin/30'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase font-bold mb-1">
                    <span className="flex items-center gap-1.5">
                      {sub.managerDecision.decision === 'approved' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-pumpkin" />
                      )}
                      Manager Action: {sub.managerDecision.decision.replace('_', ' ')}
                    </span>
                    <span className="opacity-80">
                      Sign-off by {sub.managerDecision.managerName}
                    </span>
                  </div>
                  <p className="text-nocturne-ivory font-sans mt-1 leading-relaxed">
                    "{sub.managerDecision.feedback}"
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-nocturne-charcoal border border-nocturne-border text-xs text-nocturne-grey flex items-center justify-between">
                  <span>Manager decision is currently pending review.</span>
                  <span className="text-pumpkin font-medium hover:underline flex items-center gap-1">
                    Open Review Details <ArrowRight className="w-3 h-3" />
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
