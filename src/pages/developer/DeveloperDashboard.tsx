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
      <div className="bg-nocturne-plum border border-nocturne-border rounded-xl p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-tobacco font-medium">
              Developer Workspace • Rahul Sharma
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse"></span>
              Auto-Review Webhook Active
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-nocturne-ivory tracking-tight font-sans">
            Pre-Review Code Feedback
          </h1>
          <p className="text-xs text-nocturne-grey mt-1 max-w-xl leading-relaxed">
            Get instant static analysis, OWASP vulnerability detections, and unified diff fixes from Qwen2.5-Coder 7B before manager sign-off.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/developer/repositories"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-nocturne-charcoal hover:bg-nocturne-wine text-nocturne-ivory text-xs font-mono border border-nocturne-border transition-all shadow-card"
          >
            <FolderGit2 className="w-4 h-4 text-tobacco" />
            <span>Connected Repos ({repositories.length})</span>
          </Link>
        </div>
      </div>

      {/* Grid: Developer PR Status & Quick AI Scanner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active PR Feedback (PR #142) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Active Pull Request Card */}
          <div className="bg-nocturne-plum border border-nocturne-border rounded-xl p-5 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-nocturne-border pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-nocturne-grey block">
                  Current Submission Under Review
                </span>
                <h3 className="text-base font-bold text-nocturne-ivory mt-0.5 flex items-center gap-2">
                  <span className="text-pumpkin font-mono">#{primaryPR.prNumber}</span>
                  <span>{primaryPR.title}</span>
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={primaryPR.status} size="sm" />
                <RiskBadge level={primaryPR.riskLevel} score={primaryPR.riskScore} size="sm" />
              </div>
            </div>

            {/* AI Summary Banner */}
            <div className="p-4 rounded-lg bg-nocturne-plum/80 border border-nocturne-border space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-nocturne-ivory font-mono flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-pumpkin" /> Qwen2.5-Coder 7B Automated Assessment:
                </span>
                <span className="text-[10px] font-mono text-nocturne-grey">
                  Analysis time: {primaryPR.reviewTimeSeconds || 14}s
                </span>
              </div>
              <p className="text-xs text-nocturne-ivory leading-relaxed font-sans italic">
                "{primaryPR.aiSummary}"
              </p>
            </div>

            {/* Manager Decision Feedback if present */}
            {primaryPR.managerDecision && (
              <div className="p-3.5 rounded-lg bg-pumpkin-dark/15 border border-pumpkin/30 text-xs text-pumpkin flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-pumpkin shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono font-bold block uppercase text-[10px] text-pumpkin">
                    Manager Review Note ({primaryPR.managerDecision.managerName}):
                  </span>
                  <p className="mt-0.5 font-medium">{primaryPR.managerDecision.feedback}</p>
                </div>
              </div>
            )}

            {/* Detected Vulnerabilities & Suggested Fixes */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-nocturne-grey">
                  Actionable Findings & Recommended Fixes ({primaryPR.issues.length})
                </h4>
                <Link
                  to={`/manager/reviews/${primaryPR.id}`}
                  className="text-xs text-pumpkin hover:underline font-medium"
                >
                  Open in Code Inspector →
                </Link>
              </div>

              <div className="space-y-3">
                {primaryPR.issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-4 rounded-xl bg-nocturne-charcoal border border-nocturne-border hover:border-nocturne-borderSubtle transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                          issue.severity === 'critical'
                            ? 'bg-red-950/40 text-red-400 border-red-900/40'
                            : 'bg-pumpkin-dark/15 text-pumpkin border-pumpkin/30'
                        }`}>
                          {issue.severity}
                        </span>
                        <span className="text-xs font-bold text-nocturne-ivory">
                          {issue.title}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-nocturne-grey">
                        {issue.file}:L{issue.lineStart}
                      </span>
                    </div>

                    <p className="text-xs text-nocturne-grey leading-relaxed">
                      {issue.explanation}
                    </p>

                    {/* Code Fix Snippet */}
                    <div className="rounded-lg bg-nocturne-plum border border-nocturne-border overflow-hidden">
                      <div className="px-3 py-1.5 bg-nocturne-charcoal border-b border-nocturne-border flex items-center justify-between text-[11px] font-mono">
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Recommended Fix:
                        </span>
                        <button
                          onClick={() => handleCopyCode(issue.id, issue.suggestedFixSnippet)}
                          className="text-pumpkin hover:text-pumpkin font-medium flex items-center gap-1 transition-colors"
                        >
                          {copiedId === issue.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === issue.id ? 'Copied' : 'Copy Patch'}</span>
                        </button>
                      </div>
                      <pre className="p-3 text-[11px] font-mono text-emerald-200 bg-[#0F1C16] overflow-x-auto whitespace-pre">
                        {issue.suggestedFixSnippet}
                      </pre>
                    </div>

                    {/* Apply Fix */}
                    <div className="flex justify-end pt-1">
                      {issue.status === 'addressed' ? (
                        <span className="text-xs font-mono text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Fix Applied in local branch
                        </span>
                      ) : (
                        <button
                          onClick={() => applyIssueFix(primaryPR.id, issue.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium transition-colors shadow-card"
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
        <div className="space-y-5">
          {/* Live Simulator: Trigger AI Review */}
          <div className="bg-nocturne-plum border border-nocturne-border rounded-xl p-5 shadow-card space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-wine/10 text-pumpkin">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-nocturne-ivory">On-Demand Review Trigger</h3>
                <p className="text-[11px] text-nocturne-grey">Test Qwen2.5-Coder 7B on PR #152</p>
              </div>
            </div>

            <p className="text-xs text-nocturne-grey leading-relaxed">
              Pushed fresh commits or opened a draft PR? Trigger automated pre-review inspection to receive vulnerability checks in ~14 seconds.
            </p>

            <button
              onClick={() => triggerAIScan('sub-152')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-pumpkin hover:bg-pumpkin-dark text-nocturne-bg text-xs font-semibold shadow-card transition-all"
            >
              <Zap className="w-4 h-4 text-buttercream" />
              <span>Trigger Review on PR #152</span>
            </button>

            <div className="space-y-1.5 pt-2 border-t border-nocturne-border text-[11px] font-mono text-nocturne-grey">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-700"></div>
                <span>AST syntax analysis: Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-700"></div>
                <span>OWASP Top 10 heuristics: Enabled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-tobacco"></div>
                <span>7B parameter code reasoning: Ready</span>
              </div>
            </div>
          </div>

          {/* Connected Repositories Mini Widget */}
          <div className="bg-nocturne-plum border border-nocturne-border rounded-xl p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between border-b border-nocturne-border pb-2.5">
              <h3 className="text-xs font-bold text-nocturne-ivory uppercase tracking-wider font-mono flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-tobacco" />
                Connected Repositories
              </h3>
              <Link to="/developer/repositories" className="text-xs text-pumpkin font-medium hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-2">
              {repositories.slice(0, 3).map((repo) => (
                <div
                  key={repo.id}
                  className="p-2.5 rounded-lg bg-nocturne-charcoal border border-nocturne-border flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-mono font-bold text-nocturne-ivory text-xs">{repo.name}</p>
                    <p className="text-[10px] text-nocturne-grey font-mono">{repo.language} • {repo.defaultBranch}</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-700" title="Webhook active"></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
