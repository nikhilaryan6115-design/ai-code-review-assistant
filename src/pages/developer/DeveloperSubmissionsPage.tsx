import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { RiskBadge } from '../../components/common/RiskBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  GitPullRequest, 
  Search, 
  ArrowRight, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  RefreshCw,
  Plus
} from 'lucide-react';

export const DeveloperSubmissionsPage: React.FC = () => {
  const { submissions, triggerAIScan } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'needs_action' | 'approved'>('all');

  // Filter for Developer's PRs
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
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <GitPullRequest className="w-6 h-6 text-brand-purple" />
            My Submitted Pull Requests
          </h1>
          <p className="text-xs text-dark-muted mt-1">
            Track automated Qwen2.5-Coder review feedback, fix suggestions, and manager sign-off statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-dark-card border border-dark-border p-1 rounded-xl text-xs font-mono">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-brand-purple text-white font-bold' : 'text-dark-muted hover:text-white'
              }`}
            >
              All ({submissions.length})
            </button>
            <button
              onClick={() => setFilter('needs_action')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'needs_action' ? 'bg-amber-600 text-white font-bold' : 'text-dark-muted hover:text-white'
              }`}
            >
              Needs Attention
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'approved' ? 'bg-emerald-600 text-white font-bold' : 'text-dark-muted hover:text-white'
              }`}
            >
              Approved
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mySubmissions.map((sub) => (
          <div
            key={sub.id}
            onClick={() => navigate(`/manager/reviews/${sub.id}`)}
            className="bg-dark-card border border-dark-border rounded-2xl p-5 hover:border-dark-borderLight transition-all cursor-pointer shadow-lg space-y-3 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-border/60 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-brand-purpleLight font-mono font-bold text-sm">
                  #{sub.prNumber}
                </span>
                <h3 className="text-white font-semibold text-sm group-hover:text-brand-purpleLight transition-colors">
                  {sub.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={sub.status} size="sm" />
                <RiskBadge level={sub.riskLevel} score={sub.riskScore} size="sm" />
              </div>
            </div>

            <p className="text-xs text-dark-muted line-clamp-2">
              {sub.aiSummary}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono text-dark-dim">
              <div className="flex items-center gap-4">
                <span>{sub.repository.name} ({sub.repository.branch})</span>
                <span>•</span>
                <span>{sub.language}</span>
                <span>•</span>
                <span className="text-white">{sub.issues.length} AI findings</span>
              </div>

              <div className="flex items-center gap-3">
                {sub.status === 'ai_reviewing' ? (
                  <span className="text-brand-purpleLight flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analyzing patch...
                  </span>
                ) : (
                  <span className="text-brand-blue group-hover:text-white flex items-center gap-1">
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
