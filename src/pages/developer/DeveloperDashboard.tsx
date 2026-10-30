import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { RiskBadge } from '../../components/common/RiskBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  GitPullRequest, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  FolderGit2, 
  Bot, 
  Check, 
  Copy, 
  MessageSquare,
  Zap,
  CheckCheck,
  AlertTriangle
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

  const primaryPR = submissions.find((s) => s.id === 'sub-142') || submissions[0];
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    addToast('Patch Copied', 'Suggested fix copied to clipboard.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-editorial-surface border border-editorial-border rounded-md p-6 shadow-editorial-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-editorial-brass font-medium">
              Developer Workspace • Rahul Sharma
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded bg-editorial-ivy/15 text-editorial-ivy border border-editorial-ivy/30">
              <span className="w-1.5 h-1.5 rounded-full bg-editorial-ivy animate-pulse"></span>
              Auto-Review Webhook Active
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-normal text-[#F2F4F8] tracking-tight">
            Pre-Review Code Feedback
          </h1>
          <p className="text-xs text-editorial-slate mt-1 max-w-xl leading-relaxed">
            Instant AST syntax verification, OWASP vulnerability diagnostics, and unified patch generation from Qwen2.5-Coder before manual triage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/developer/repositories"
            className="flex items-center gap-2 px-3.5 py-2 rounded bg-editorial-subtle hover:bg-[#252D38] text-[#F2F4F8] text-xs font-mono border border-editorial-border transition-editorial shadow-editorial-card"
          >
            <FolderGit2 className="w-4 h-4 text-editorial-brass" />
            <span>Connected Repos ({repositories.length})</span>
          </Link>
        </div>
      </div>

      {/* Grid: Developer PR Status & Quick AI Scanner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active PR Feedback (PR #142) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Active Pull Request Card */}
          <div className="bg-editorial-surface border border-editorial-border rounded-md p-5 shadow-editorial-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-editorial-border pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-editorial-muted block">
                  Current Submission Under Inspection
                </span>
                <h3 className="text-base font-serif font-medium text-[#F2F4F8] mt-0.5 flex items-center gap-2">
                  <span className="text-editorial-brass font-mono font-normal">#{primaryPR.prNumber}</span>
                  <span>{primaryPR.title}</span>
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={primaryPR.status} size="sm" />
                <RiskBadge level={primaryPR.riskLevel} score={primaryPR.riskScore} size="sm" />
              </div>
            </div>

            {/* AI Summary Banner */}
            <div className="p-4 rounded bg-editorial-subtle/50 border border-editorial-border space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#F2F4F8] font-mono flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-editorial-brass" /> Qwen2.5-Coder Assessment:
                </span>
                <span className="text-[10px] font-mono text-editorial-muted">
                  Analysis runtime: {primaryPR.reviewTimeSeconds || 14}s
                </span>
              </div>
              <p className="text-xs text-editorial-slate leading-relaxed font-sans italic">
                "{primaryPR.aiSummary}"
              </p>
            </div>

            {/* Manager Decision Feedback if present */}
            {primaryPR.managerDecision && (
              <div className="p-3.5 rounded bg-editorial-brass/10 border border-editorial-brass/30 text-xs text-editorial-brass flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-editorial-brass shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono font-semibold block uppercase text-[10px] tracking-wider text-editorial-brass">
                    Manager Review Note ({primaryPR.managerDecision.managerName}):
                  </span>
                  <p className="mt-0.5 font-normal text-editorial-brass/90">{primaryPR.managerDecision.feedback}</p>
                </div>
              </div>
            )}

            {/* Detected Vulnerabilities & Suggested Fixes */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-widest text-editorial-muted font-medium">
                  Actionable Findings & Suggested Patches ({primaryPR.issues.length})
                </h4>
                <Link
                  to={`/manager/reviews/${primaryPR.id}`}
                  className="text-xs text-editorial-brass hover:underline font-mono transition-editorial"
                >
                  Open in Code Inspector →
                </Link>
              </div>

              <div className="space-y-3">
                {primaryPR.issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-4 rounded bg-editorial-subtle/30 border border-editorial-border hover:border-editorial-border/80 transition-editorial space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-medium uppercase px-2 py-0.5 rounded border ${
                          issue.severity === 'critical'
                            ? 'bg-editorial-crimson/15 text-editorial-crimson border-editorial-crimson/30'
                            : 'bg-editorial-ochre/15 text-editorial-ochre border-editorial-ochre/30'
                        }`}>
                          {issue.severity}
                        </span>
                        <span className="text-xs font-medium text-[#F2F4F8]">
                          {issue.title}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-editorial-muted">
                        {issue.file}:L{issue.lineStart}
                      </span>
                    </div>

                    <p className="text-xs text-editorial-slate leading-relaxed">
                      {issue.explanation}
                    </p>

                    {/* Code Fix Snippet */}
                    <div className="rounded bg-[#0C0F14] border border-editorial-border overflow-hidden">
                      <div className="px-3 py-1.5 bg-editorial-subtle/60 border-b border-editorial-border flex items-center justify-between text-[11px] font-mono">
                        <span className="text-editorial-ivy font-medium flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-editorial-ivy" /> Recommended Patch:
                        </span>
                        <button
                          onClick={() => handleCopyCode(issue.id, issue.suggestedFixSnippet)}
                          className="text-editorial-brass hover:text-editorial-brass/80 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedId === issue.id ? <Check className="w-3 h-3 text-editorial-ivy" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === issue.id ? 'Copied' : 'Copy Patch'}</span>
                        </button>
                      </div>
                      <pre className="p-3 text-[11px] font-mono text-emerald-300 bg-[#0C0F14] overflow-x-auto whitespace-pre">
                        {issue.suggestedFixSnippet}
                      </pre>
                    </div>

                    {/* Apply Fix */}
                    <div className="flex justify-end pt-1">
                      {issue.status === 'addressed' ? (
                        <span className="text-xs font-mono text-editorial-ivy font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-editorial-ivy" /> Patch Applied in local branch
                        </span>
                      ) : (
                        <button
                          onClick={() => applyIssueFix(primaryPR.id, issue.id)}
                          className="px-3 py-1 rounded bg-editorial-navy hover:bg-[#222E42] text-[#F2F4F8] border border-editorial-border hover:border-editorial-ivy/50 text-xs font-medium transition-editorial cursor-pointer"
                        >
                          Mark Patch Applied
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
        <div className="space-y-5">
          {/* Live Simulator: Trigger AI Review */}
          <div className="bg-editorial-surface border border-editorial-border rounded-md p-5 shadow-editorial-card space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded bg-editorial-navy border border-editorial-border text-editorial-brass">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-serif font-medium text-[#F2F4F8]">Automated Review Trigger</h3>
                <p className="text-[11px] font-mono text-editorial-muted">Execute Qwen2.5-Coder on PR #152</p>
              </div>
            </div>

            <p className="text-xs text-editorial-slate leading-relaxed">
              Pushed fresh revisions or opened a draft PR? Trigger automated pre-review inspection to receive vulnerability checks in ~14 seconds.
            </p>

            <button
              onClick={() => triggerAIScan('sub-152')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded bg-editorial-brass hover:bg-editorial-brass/90 text-editorial-bg text-xs font-semibold shadow-editorial-card transition-editorial cursor-pointer"
            >
              <Zap className="w-4 h-4 text-editorial-bg" />
              <span>Trigger Review on PR #152</span>
            </button>

            <div className="space-y-2 pt-2 border-t border-editorial-border text-[11px] font-mono text-editorial-muted">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-editorial-ivy"></div>
                <span>AST syntax analysis: Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-editorial-ivy"></div>
                <span>OWASP Top 10 heuristics: Enabled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-editorial-brass"></div>
                <span>7B parameter code reasoning: Ready</span>
              </div>
            </div>
          </div>

          {/* Connected Repositories Mini Widget */}
          <div className="bg-editorial-surface border border-editorial-border rounded-md p-5 shadow-editorial-card space-y-3">
            <div className="flex items-center justify-between border-b border-editorial-border pb-2.5">
              <h3 className="text-xs font-mono font-medium text-[#F2F4F8] uppercase tracking-wider flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-editorial-brass" />
                Connected Repositories
              </h3>
              <Link to="/developer/repositories" className="text-xs text-editorial-brass font-mono hover:underline transition-editorial">
                View all
              </Link>
            </div>

            <div className="space-y-2">
              {repositories.slice(0, 3).map((repo) => (
                <div
                  key={repo.id}
                  className="p-2.5 rounded bg-editorial-subtle/40 border border-editorial-border flex items-center justify-between text-xs hover:border-editorial-brass/30 transition-editorial"
                >
                  <div>
                    <p className="font-mono font-medium text-[#F2F4F8] text-xs">{repo.name}</p>
                    <p className="text-[10px] text-editorial-muted font-mono">{repo.language} • {repo.defaultBranch}</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-editorial-ivy" title="Webhook active"></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
