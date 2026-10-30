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
  ArrowRight
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-medium text-[#F2F4F8] tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-[#C5A059]" />
            Review Audit Trail & Historical Ledger
          </h1>
          <p className="text-xs text-[#96A0B0] mt-1 font-sans">
            Complete audit trail of AI automated evaluations, manager sign-offs, and developer feedback threads.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-[#161B22] border border-[#2E3643] p-1 rounded shadow-sm">
          <button
            onClick={() => setFilterDecision('all')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
              filterDecision === 'all'
                ? 'bg-[#1A2332] text-[#F2F4F8] font-medium border border-[#2E3643]'
                : 'text-[#96A0B0] hover:text-[#F2F4F8]'
            }`}
          >
            All Logs ({submissions.length})
          </button>
          <button
            onClick={() => setFilterDecision('approved')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
              filterDecision === 'approved'
                ? 'bg-[#2D6A4F]/20 text-[#4EAA78] font-medium border border-[#2D6A4F]/40'
                : 'text-[#96A0B0] hover:text-[#F2F4F8]'
            }`}
          >
            Approved Only
          </button>
          <button
            onClick={() => setFilterDecision('changes_requested')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
              filterDecision === 'changes_requested'
                ? 'bg-[#B7791F]/20 text-[#D4AF67] font-medium border border-[#B7791F]/40'
                : 'text-[#96A0B0] hover:text-[#F2F4F8]'
            }`}
          >
            Revisions Requested
          </button>
        </div>
      </div>

      {/* Timeline Audit Feed */}
      <div className="space-y-4">
        {historySubmissions.length === 0 ? (
          <div className="p-12 text-center text-[#96A0B0] bg-[#161B22] border border-[#2E3643] rounded font-mono text-xs">
            No historical review records found for this filter criteria.
          </div>
        ) : (
          historySubmissions.map((sub) => {
            const decision = sub.managerDecision;
            const isApproved = decision?.decision === 'approved';

            return (
              <div
                key={sub.id}
                className="bg-[#161B22] border border-[#2E3643] rounded p-5 shadow-sm space-y-4 hover:border-[#3E495B] transition-colors"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2E3643] pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded border flex items-center justify-center shrink-0 ${
                        isApproved
                          ? 'bg-[#2D6A4F]/15 border-[#2D6A4F]/30 text-[#4EAA78]'
                          : decision
                          ? 'bg-[#B7791F]/15 border-[#B7791F]/30 text-[#D4AF67]'
                          : 'bg-[#1D232C] border-[#2E3643] text-[#96A0B0]'
                      }`}
                    >
                      {isApproved ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : decision ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-serif font-medium text-[#F2F4F8] flex items-center gap-2">
                        <span className="text-[#C5A059] font-mono">#{sub.prNumber}</span>
                        <span>{sub.title}</span>
                      </h3>
                      <div className="text-[11px] font-mono text-[#96A0B0] flex items-center gap-2 mt-0.5">
                        <span>Repo: {sub.repository.name}</span>
                        <span>•</span>
                        <span>Author: {sub.developer.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={sub.status} size="sm" />
                    <RiskBadge level={sub.riskLevel} score={sub.riskScore} size="sm" />
                  </div>
                </div>

                {/* Audit Body */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  {/* AI Evaluation Record */}
                  <div className="p-3.5 rounded bg-[#0E1116] border border-[#2E3643] space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#96A0B0]">
                      <span>Qwen2.5-Coder Automated Log</span>
                      <span className="text-[#4EAA78]">{sub.reviewTimeSeconds || 14}s inspection</span>
                    </div>
                    <p className="text-xs text-[#F2F4F8] leading-relaxed">
                      {sub.aiSummary}
                    </p>
                    <div className="pt-2 border-t border-[#2E3643] flex items-center justify-between text-[11px] font-mono text-[#96A0B0]">
                      <span>Findings flagged: {sub.issues.length}</span>
                      <span>Security: {sub.issues.filter(i => i.category === 'security').length}</span>
                    </div>
                  </div>

                  {/* Manager Executive Determination */}
                  <div className="p-3.5 rounded bg-[#0E1116] border border-[#2E3643] space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#96A0B0]">
                      <span>Executive Sign-off</span>
                      <span>
                        {decision ? new Date(decision.decidedAt).toLocaleDateString() : 'Awaiting'}
                      </span>
                    </div>
                    {decision ? (
                      <>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-medium text-[#F2F4F8]">{decision.managerName}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-mono uppercase ${
                              isApproved
                                ? 'bg-[#2D6A4F]/15 text-[#4EAA78] border border-[#2D6A4F]/35'
                                : 'bg-[#B7791F]/15 text-[#D4AF67] border-[#B7791F]/35'
                            }`}
                          >
                            {decision.decision.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-[#96A0B0] italic bg-[#161B22] p-2.5 rounded border border-[#2E3643]">
                          "{decision.feedback}"
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-[#96A0B0] italic pt-2">
                        Pending manual review and authorization by engineering management.
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer link to review room */}
                <div className="flex items-center justify-between pt-2 border-t border-[#2E3643] text-xs font-mono">
                  <span className="text-[#96A0B0]">
                    Submitted {new Date(sub.submissionDate).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => navigate(`/manager/reviews/${sub.id}`)}
                    className="text-[#C5A059] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <span>View Inspection Room</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
