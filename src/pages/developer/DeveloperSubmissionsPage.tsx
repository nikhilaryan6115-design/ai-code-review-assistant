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
          <h1 className="text-xl sm:text-2xl font-serif font-normal text-[#F2F4F8] tracking-tight flex items-center gap-2.5">
            <GitPullRequest className="w-5 h-5 text-editorial-brass" />
            My Submitted Pull Requests
          </h1>
          <p className="text-xs text-editorial-slate mt-1">
            Track automated Qwen2.5-Coder review feedback, fix suggestions, and manager sign-off statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-editorial-surface border border-editorial-border p-1 rounded text-xs font-mono shadow-editorial-card">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded transition-editorial cursor-pointer ${
                filter === 'all' ? 'bg-editorial-navy text-[#F2F4F8] font-medium border border-editorial-border' : 'text-editorial-muted hover:text-[#F2F4F8]'
              }`}
            >
              All ({submissions.length})
            </button>
            <button
              onClick={() => setFilter('needs_action')}
              className={`px-3 py-1.5 rounded transition-editorial cursor-pointer ${
                filter === 'needs_action' ? 'bg-editorial-ochre/20 text-editorial-ochre font-medium border border-editorial-ochre/30' : 'text-editorial-muted hover:text-[#F2F4F8]'
              }`}
            >
              Needs Action
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-3 py-1.5 rounded transition-editorial cursor-pointer ${
                filter === 'approved' ? 'bg-editorial-ivy/20 text-editorial-ivy font-medium border border-editorial-ivy/30' : 'text-editorial-muted hover:text-[#F2F4F8]'
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
            className="bg-editorial-surface border border-editorial-border rounded-md p-5 hover:border-editorial-border/90 hover:bg-editorial-subtle/30 transition-editorial cursor-pointer shadow-editorial-card space-y-3 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-editorial-border pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-editorial-brass font-mono font-medium text-xs">
                  #{sub.prNumber}
                </span>
                <h3 className="text-[#F2F4F8] font-serif font-medium text-sm group-hover:text-editorial-brass transition-colors">
                  {sub.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={sub.status} size="sm" />
                <RiskBadge level={sub.riskLevel} score={sub.riskScore} size="sm" />
              </div>
            </div>

            <p className="text-xs text-editorial-slate line-clamp-2 leading-relaxed font-sans">
              {sub.aiSummary}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono text-editorial-muted border-t border-editorial-border/60">
              <div className="flex items-center gap-3">
                <span className="px-1.5 py-0.5 rounded bg-editorial-subtle text-[#F2F4F8] text-[11px] font-mono border border-editorial-border">
                  {sub.repository.name} ({sub.repository.branch})
                </span>
                <span>•</span>
                <span>{sub.language}</span>
                <span>•</span>
                <span className="text-[#F2F4F8] font-medium">{sub.issues.length} findings</span>
              </div>

              <div className="flex items-center gap-2">
                {sub.status === 'ai_reviewing' ? (
                  <span className="text-editorial-brass flex items-center gap-1.5 font-medium font-mono">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analyzing patch...
                  </span>
                ) : (
                  <span className="text-editorial-brass font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-mono">
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
