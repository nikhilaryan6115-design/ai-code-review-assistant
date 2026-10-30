import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { RiskBadge } from '../../components/common/RiskBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Code2, 
  GitPullRequest, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  FolderGit2, 
  Bot, 
  Check, 
  Copy, 
  RefreshCw, 
  MessageSquare,
  Zap,
  Terminal,
  ExternalLink
} from 'lucide-react';

export const DeveloperDashboard: React.FC = () => {
  const { 
    submissions, 
    repositories, 
    triggerAIScan, 
    applyIssueFix, 
    addToast 
  } = useApp();
  const navigate = useNavigate();

  // Find Rahul Sharma's submissions
  const mySubmissions = submissions.filter((s) => s.developer.name.includes('Rahul') || s.id === 'sub-142' || s.id === 'sub-152');
  const primaryPR = submissions.find((s) => s.id === 'sub-142') || submissions[0];

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    addToast('Code Copied', 'Suggested fix copied to clipboard.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-dark-card via-dark-card to-brand-purple/15 border border-dark-border rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-purpleLight">
              Developer Workspace
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Auto-Review Enabled
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Fast Pre-Review AI Feedback
          </h1>
          <p className="text-xs text-dark-muted mt-1 max-w-xl">
            Get instant security, performance, and bug checks from Qwen2.5-Coder 7B the moment you open a PR, before your engineering manager conducts manual review.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/developer/repositories"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-subtle hover:bg-dark-card text-white text-xs font-mono border border-dark-border transition-all"
          >
            <FolderGit2 className="w-4 h-4 text-brand-purpleLight" />
            <span>Connected Repos ({repositories.length})</span>
          </Link>
        </div>
      </div>

      {/* Grid: Developer PR Status & Quick AI Scanner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active PR Feedback (PR #142) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Pull Request Card */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-border/60 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-dark-dim block">
                  Most Recent Pull Request
                </span>
                <h3 className="text-base font-bold text-white mt-0.5 flex items-center gap-2">
                  <span className="text-brand-purpleLight font-mono">#{primaryPR.prNumber}</span>
                  <span>{primaryPR.title}</span>
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={primaryPR.status} size="sm" />
                <RiskBadge level={primaryPR.riskLevel} score={primaryPR.riskScore} size="sm" />
              </div>
            </div>

            {/* AI Summary Banner */}
            <div className="p-4 rounded-xl bg-dark-subtle border border-dark-border/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-brand-purpleLight font-mono flex items-center gap-1.5">
                  <Bot className="w-4 h-4" /> Qwen2.5-Coder 7B Automated Assessment:
                </span>
                <span className="text-[10px] font-mono text-dark-dim">
                  Inference time: {primaryPR.reviewTimeSeconds || 14}s
                </span>
              </div>
              <p className="text-xs text-dark-text leading-relaxed font-sans">
                "{primaryPR.aiSummary}"
              </p>
            </div>

            {/* Manager Decision Feedback if present */}
            {primaryPR.managerDecision && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono font-bold block uppercase text-[10px]">
                    Manager Feedback ({primaryPR.managerDecision.managerName}):
                  </span>
                  <p className="mt-0.5 text-white">{primaryPR.managerDecision.feedback}</p>
                </div>
              </div>
            )}

            {/* Detected Vulnerabilities & Suggested Fixes */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-dark-dim">
                  Actionable AI Findings ({primaryPR.issues.length})
                </h4>
                <Link
                  to={`/manager/reviews/${primaryPR.id}`}
                  className="text-xs text-brand-blue hover:underline font-mono"
                >
                  Inspect Line by Line →
                </Link>
              </div>

              <div className="space-y-3">
                {primaryPR.issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-4 rounded-xl bg-dark-bg/80 border border-dark-border hover:border-dark-borderLight transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                          issue.severity === 'critical'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}>
                          {issue.severity}
                        </span>
                        <span className="text-xs font-semibold text-white">
                          {issue.title}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-dark-dim">
                        {issue.file}:L{issue.lineStart}
                      </span>
                    </div>

                    <p className="text-xs text-dark-muted">
                      {issue.explanation}
                    </p>

                    {/* Code Fix Snippet */}
                    <div className="rounded-lg bg-dark-card border border-dark-border overflow-hidden">
                      <div className="px-3 py-1.5 bg-dark-subtle border-b border-dark-border flex items-center justify-between text-[11px] font-mono">
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Recommended Fix:
                        </span>
                        <button
                          onClick={() => handleCopyCode(issue.id, issue.suggestedFixSnippet)}
                          className="text-brand-blue hover:text-white flex items-center gap-1 transition-colors"
                        >
                          {copiedId === issue.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === issue.id ? 'Copied' : 'Copy Patch'}</span>
                        </button>
                      </div>
                      <pre className="p-3 text-[11px] font-mono text-emerald-200 overflow-x-auto whitespace-pre">
                        {issue.suggestedFixSnippet}
                      </pre>
                    </div>

                    {/* Apply Fix */}
                    <div className="flex justify-end pt-1">
                      {issue.status === 'addressed' ? (
                        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Fix Applied in local commit
                        </span>
                      ) : (
                        <button
                          onClick={() => applyIssueFix(primaryPR.id, issue.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-mono font-medium transition-colors"
                        >
                          Mark Fix Applied
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Pull Requests List & Test AI Review Trigger */}
        <div className="space-y-6">
          {/* Live Simulator: Trigger AI Review */}
          <div className="bg-dark-card border border-brand-purple/40 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-brand-purple/20 text-brand-purpleLight">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Live AI Review Simulator</h3>
                <p className="text-[11px] text-dark-muted">Test Qwen2.5-Coder on PR #152</p>
              </div>
            </div>

            <p className="text-xs text-dark-text leading-relaxed">
              Have a draft PR or just pushed commits? Trigger on-demand deep inspection to get results in ~14 seconds before requesting manager review.
            </p>

            <button
              onClick={() => triggerAIScan('sub-152')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-95 text-white text-xs font-bold shadow-glow-purple transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Trigger Review on PR #152</span>
            </button>

            <div className="space-y-2 pt-2 border-t border-dark-border/60 text-[11px] font-mono text-dark-dim">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                <span>AST syntax trees: Passed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                <span>OWASP Top 10 heuristics: Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-blue"></div>
                <span>7B parameter code reasoning: Ready</span>
              </div>
            </div>
          </div>

          {/* Connected GitHub Repos Mini List */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-brand-blue" />
                Active Repositories
              </h3>
              <Link to="/developer/repositories" className="text-xs text-brand-blue hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-2">
              {repositories.slice(0, 3).map((repo) => (
                <div
                  key={repo.id}
                  className="p-3 rounded-xl bg-dark-subtle border border-dark-border/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-mono font-semibold text-white">{repo.name}</p>
                    <p className="text-[10px] text-dark-dim font-mono">{repo.language} • {repo.defaultBranch}</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" title="Webhook active"></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
