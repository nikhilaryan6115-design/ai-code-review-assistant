import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { RiskBadge } from '../../components/common/RiskBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  GitPullRequest, 
  ArrowRight, 
  RefreshCw
} from 'lucide-react';

export const DeveloperSubmissionsPage: React.FC = () => {
  const { submissions } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'needs_action' | 'approved'>('all');

  const mySubmissions = submissions.filter((s) => {
    if (filter === 'needs_action') {
      return s.status === 'changes_requested' || s.riskLevel === 'critical' || s.riskLevel === 'high';
    }
    if (filter === 'approved') {
      return s.status === 'approved';
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-warm-charcoal tracking-tight flex items-center gap-2">
            <GitPullRequest className="w-5 h-5 text-wine" />
            My Submitted Pull Requests
          </h1>
          <p className="text-xs text-warm-muted mt-1">
            Track automated Qwen2.5-Coder review feedback, fix suggestions, and manager sign-off statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-warm-white border border-warm-border p-1 rounded-lg text-xs font-mono shadow-warm-sm">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filter === 'all' ? 'bg-wine text-white font-bold' : 'text-warm-muted hover:text-warm-charcoal'
              }`}
            >
              All ({submissions.length})
            </button>
            <button
              onClick={() => setFilter('needs_action')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filter === 'needs_action' ? 'bg-amber-700 text-white font-bold' : 'text-warm-muted hover:text-warm-charcoal'
              }`}
            >
              Needs Action
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filter === 'approved' ? 'bg-emerald-700 text-white font-bold' : 'text-warm-muted hover:text-warm-charcoal'
              }`}
            >
              Approved
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {mySubmissions.map((sub) => (
          <div
            key={sub.id}
            onClick={() => navigate(`/manager/reviews/${sub.id}`)}
            className="bg-warm-white border border-warm-border rounded-xl p-5 hover:border-warm-borderStrong transition-all cursor-pointer shadow-warm-sm space-y-3 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-warm-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-wine font-mono font-bold text-xs">
                  #{sub.prNumber}
                </span>
                <h3 className="text-warm-charcoal font-bold text-sm group-hover:text-wine transition-colors">
                  {sub.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={sub.status} size="sm" />
                <RiskBadge level={sub.riskLevel} score={sub.riskScore} size="sm" />
              </div>
            </div>

            <p className="text-xs text-warm-muted line-clamp-2 leading-relaxed">
              {sub.aiSummary}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono text-warm-muted">
              <div className="flex items-center gap-3">
                <span className="px-1.5 py-0.5 rounded bg-warm-subtle text-warm-charcoal text-[11px] font-medium">
                  {sub.repository.name} ({sub.repository.branch})
                </span>
                <span>•</span>
                <span>{sub.language}</span>
                <span>•</span>
                <span className="text-warm-charcoal font-semibold">{sub.issues.length} AI findings</span>
              </div>

              <div className="flex items-center gap-2">
                {sub.status === 'ai_reviewing' ? (
                  <span className="text-wine flex items-center gap-1.5 font-medium">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analyzing patch...
                  </span>
                ) : (
                  <span className="text-wine font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Inspect Report <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
