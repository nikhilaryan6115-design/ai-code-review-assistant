import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../../components/common/RiskBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CodeViewer } from '../../components/code/CodeViewer';
import { IssueCard } from '../../components/code/IssueCard';
import { DecisionModal } from '../../components/modals/DecisionModal';
import { 
  ArrowLeft, 
  GitPullRequest, 
  GitBranch, 
  Clock, 
  Bot, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Check, 
  XCircle, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Zap, 
  Shield, 
  RefreshCw,
  FileCode2,
  CheckCheck
} from 'lucide-react';

export const ReviewDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    submissions, 
    approveSubmission, 
    requestChanges, 
    triggerAIScan, 
    applyIssueFix, 
    dismissIssue,
    addToast 
  } = useApp();

  const submission = submissions.find((s) => s.id === id) || submissions[0];

  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'security' | 'performance' | 'quality'>('all');
  const [selectedIssueId, setSelectedIssueId] = useState<string>(submission.issues[0]?.id || '');
  
  const [modalType, setModalType] = useState<'approve' | 'request_changes' | null>(null);
  const [newComment, setNewComment] = useState('');
  const [commentList, setCommentList] = useState<string[]>([
    'Automated AI pre-check completed by Qwen2.5-Coder 7B. Identified 1 critical SQL injection vulnerability and 1 missing input validation warning.'
  ]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentList((prev) => [...prev, newComment]);
    setNewComment('');
    addToast('Comment Logged', 'Review feedback posted to developer PR thread.', 'success');
  };

  const filteredIssues = submission.issues.filter((issue) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'critical') return issue.severity === 'critical';
    if (activeTab === 'security') return issue.category === 'security';
    if (activeTab === 'performance') return issue.category === 'performance';
    if (activeTab === 'quality') return issue.category === 'quality';
    return true;
  });

  const criticalIssuesCount = submission.issues.filter((i) => i.severity === 'critical').length;
  const warningsCount = submission.issues.filter((i) => i.severity === 'medium' || i.severity === 'high').length;
  const securityCount = submission.issues.filter((i) => i.category === 'security').length;
  const performanceCount = submission.issues.filter((i) => i.category === 'performance').length;
  const qualityCount = submission.issues.filter((i) => i.category === 'quality').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-nocturne-border pb-4 bg-nocturne-plum p-4 rounded-xl shadow-card">
        <div className="flex items-center gap-3">
          <Link
            to="/manager/submissions"
            className="p-2 rounded-lg bg-nocturne-charcoal border border-nocturne-border text-nocturne-ivory hover:bg-nocturne-wine transition-colors"
            title="Back to submissions"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-nocturne-grey">
              <span>{submission.repository.name}</span>
              <span>/</span>
              <span className="text-pumpkin font-semibold">Pull Request #{submission.prNumber}</span>
            </div>
            <h1 className="text-lg font-bold text-nocturne-ivory tracking-tight flex items-center gap-2 mt-0.5">
              <span>{submission.title}</span>
            </h1>
          </div>
        </div>

        {/* Manager Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => triggerAIScan(submission.id)}
            disabled={submission.status === 'ai_reviewing'}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-nocturne-charcoal border border-nocturne-border text-xs font-mono text-nocturne-ivory hover:bg-nocturne-wine transition-all disabled:opacity-50 shadow-card"
            title="Re-run Qwen2.5-Coder 7B"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-tobacco ${submission.status === 'ai_reviewing' ? 'animate-spin' : ''}`} />
            <span>Re-analyze</span>
          </button>

          <button
            onClick={() => setModalType('request_changes')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-pumpkin-dark/15 border border-pumpkin/30 text-pumpkin hover:bg-amber-100 text-xs font-semibold transition-all shadow-card"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Request Changes</span>
          </button>

          <button
            onClick={() => setModalType('approve')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-pumpkin hover:bg-pumpkin-dark text-nocturne-bg text-xs font-semibold shadow-card transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Approve PR</span>
          </button>
        </div>
      </div>

      {/* Decision Banner if already decided */}
      {submission.managerDecision && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 shadow-card ${
            submission.managerDecision.decision === 'approved'
              ? 'bg-emerald-950/40 text-emerald-900 border-emerald-300'
              : 'bg-pumpkin-dark/15 text-pumpkin border-pumpkin/30'
          }`}
        >
          {submission.managerDecision.decision === 'approved' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-pumpkin shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
                Manager Decision: {submission.managerDecision.decision.replace('_', ' ')}
              </h4>
              <span className="text-[10px] font-mono opacity-80">
                {new Date(submission.managerDecision.decidedAt).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-xs mt-1 leading-relaxed font-sans font-medium">
              "{submission.managerDecision.feedback}"
            </p>
            <p className="text-[10px] font-mono opacity-80 mt-1">
              Signed off by: {submission.managerDecision.managerName}
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Left Column Summary & AI Findings, Right Column Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Metadata, AI Overview, Categorized Issues */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Code Submission Summary Card */}
          <div className="bg-nocturne-plum border border-nocturne-border rounded-xl p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-nocturne-border pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-nocturne-grey font-medium">
                Submission Metadata
              </span>
              <StatusBadge status={submission.status} size="sm" />
            </div>

            <div className="flex items-center gap-3">
              <img
                src={submission.developer.avatar}
                alt={submission.developer.name}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-nocturne-border"
              />
              <div>
                <p className="text-sm font-bold text-nocturne-ivory">
                  {submission.developer.name}
                </p>
                <p className="text-xs text-nocturne-grey font-mono">
                  {submission.developer.email} • {submission.developer.role}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-nocturne-charcoal border border-nocturne-border">
                <span className="text-nocturne-grey text-[10px] block">Branch</span>
                <span className="text-pumpkin font-semibold truncate block">
                  {submission.repository.branch}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-nocturne-charcoal border border-nocturne-border">
                <span className="text-nocturne-grey text-[10px] block">Language</span>
                <span className="text-nocturne-ivory font-semibold">{submission.language}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-nocturne-charcoal border border-nocturne-border">
                <span className="text-nocturne-grey text-[10px] block">Diff Changes</span>
                <span className="text-nocturne-ivory font-medium">
                  <span className="text-emerald-400 font-semibold">+{submission.additions}</span>{' '}
                  <span className="text-red-400 font-semibold">-{submission.deletions}</span>
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-nocturne-charcoal border border-nocturne-border">
                <span className="text-nocturne-grey text-[10px] block">AI Scan Time</span>
                <span className="text-emerald-400 font-semibold">
                  {submission.reviewTimeSeconds || 14}s
                </span>
              </div>
            </div>
          </div>

          {/* 3. Overall Risk Assessment Meter */}
          <div className="bg-nocturne-plum border border-nocturne-border rounded-xl p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between border-b border-nocturne-border pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-nocturne-grey font-medium flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                Overall Risk Assessment
              </span>
              <RiskBadge level={submission.riskLevel} score={submission.riskScore} size="sm" />
            </div>

            {/* Risk Gauge Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-nocturne-grey">Threat Composite Score</span>
                <span className={`font-bold ${
                  submission.riskScore > 75 ? 'text-red-400' : submission.riskScore > 40 ? 'text-pumpkin' : 'text-emerald-400'
                }`}>
                  {submission.riskScore} / 100
                </span>
              </div>
              <div className="w-full h-2.5 bg-nocturne-charcoal rounded-full overflow-hidden border border-nocturne-border">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    submission.riskScore > 75
                      ? 'bg-red-700'
                      : submission.riskScore > 40
                      ? 'bg-amber-600'
                      : 'bg-emerald-700'
                  }`}
                  style={{ width: `${submission.riskScore}%` }}
                />
              </div>
            </div>

            {/* Findings Pill Counters */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono">
              <div className="p-2 rounded-lg bg-red-950/40 border border-red-900/40 text-red-900">
                <span className="block text-base font-bold">{criticalIssuesCount}</span>
                <span className="text-[10px] uppercase font-medium">Critical</span>
              </div>
              <div className="p-2 rounded-lg bg-pumpkin-dark/15 border border-pumpkin/30 text-pumpkin">
                <span className="block text-base font-bold">{warningsCount}</span>
                <span className="text-[10px] uppercase font-medium">Warnings</span>
              </div>
              <div className="p-2 rounded-lg bg-nocturne-charcoal border border-nocturne-border text-nocturne-ivory">
                <span className="block text-base font-bold">{submission.issues.length}</span>
                <span className="text-[10px] uppercase font-medium">Total</span>
              </div>
            </div>
          </div>

          {/* 2. AI-Generated Summary & Explanation (Qwen2.5-Coder 7B) */}
          <div className="bg-nocturne-plum/80 border border-nocturne-border rounded-xl p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between border-b border-nocturne-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-wine/10 text-pumpkin">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-nocturne-ivory font-mono uppercase tracking-wider">
                    Qwen2.5-Coder 7B Synthesis
                  </h3>
                  <span className="text-[10px] text-nocturne-grey font-mono">Engine: {submission.aiModel}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40 font-medium">
                Analysis Ready
              </span>
            </div>

            {/* AI Summary Quote (Matches Prompt Sample) */}
            <blockquote className="p-3.5 rounded-lg bg-nocturne-plum border border-nocturne-border text-xs text-nocturne-ivory leading-relaxed font-sans italic">
              "{submission.aiSummary}"
            </blockquote>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-nocturne-grey font-semibold block mb-1">
                Architecture & Security Assessment
              </span>
              <p className="text-xs text-nocturne-ivory leading-relaxed font-sans">
                {submission.aiExplanation}
              </p>
            </div>
          </div>

          {/* Categorized Issues & Suggested Fixes Section */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-nocturne-ivory tracking-tight">
                  Actionable AI Findings ({submission.issues.length})
                </h3>
                <p className="text-[11px] text-nocturne-grey">Select an issue to highlight line in code viewer</p>
              </div>
            </div>

            {/* Filter Tabs for Issue Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'bg-pumpkin text-nocturne-bg font-semibold shadow-card'
                    : 'bg-nocturne-plum text-nocturne-grey hover:text-nocturne-ivory border border-nocturne-border'
                }`}
              >
                All ({submission.issues.length})
              </button>

              <button
                onClick={() => setActiveTab('critical')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'critical'
                    ? 'bg-red-800 text-white font-bold'
                    : 'bg-nocturne-plum text-red-400 hover:bg-red-950/40 border border-red-900/40'
                }`}
              >
                <ShieldAlert className="w-3 h-3" />
                Critical ({criticalIssuesCount})
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'security'
                    ? 'bg-tobacco text-white font-bold'
                    : 'bg-nocturne-plum text-nocturne-grey hover:bg-nocturne-charcoal border border-nocturne-border'
                }`}
              >
                <Shield className="w-3 h-3" />
                Security ({securityCount})
              </button>

              <button
                onClick={() => setActiveTab('performance')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'performance'
                    ? 'bg-amber-800 text-white font-bold'
                    : 'bg-nocturne-plum text-pumpkin hover:bg-pumpkin-dark/15 border border-pumpkin/30'
                }`}
              >
                <Zap className="w-3 h-3" />
                Perf ({performanceCount})
              </button>

              <button
                onClick={() => setActiveTab('quality')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'quality'
                    ? 'bg-emerald-800 text-white font-bold'
                    : 'bg-nocturne-plum text-emerald-400 hover:bg-emerald-950/40 border border-emerald-300'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                Quality ({qualityCount})
              </button>
            </div>

            {/* Issues List */}
            <div className="space-y-3">
              {filteredIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  isSelected={issue.id === selectedIssueId}
                  onSelect={() => setSelectedIssueId(issue.id)}
                  onApplyFix={(issId) => applyIssueFix(submission.id, issId)}
                  onDismiss={(issId) => dismissIssue(submission.id, issId)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Interactive Code Viewer & Manager Review Chat */}
        <div className="lg:col-span-7 space-y-5">
          {/* Code Viewer Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-nocturne-ivory tracking-tight flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-pumpkin" />
                Code Inspection with Problem Line Highlighting
              </h3>
              <p className="text-[11px] text-nocturne-grey">
                Line 42: SQL injection (Critical) • Line 18: Missing validation • Line 67: Inefficient loop
              </p>
            </div>
          </div>

          {/* Interactive Code Viewer Component */}
          <CodeViewer
            codeFiles={submission.codeFiles}
            issues={submission.issues}
            selectedIssueId={selectedIssueId}
            onApplyFix={(issId) => applyIssueFix(submission.id, issId)}
          />

          {/* Manager Feedback & Comments Section */}
          <div className="bg-nocturne-plum border border-nocturne-border rounded-xl p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-nocturne-border pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-pumpkin" />
                <h4 className="text-xs font-bold text-nocturne-ivory uppercase font-mono tracking-wider">
                  Manager Feedback & Instruction Thread
                </h4>
              </div>
              <span className="text-[10px] font-mono text-nocturne-grey">
                {commentList.length} updates
              </span>
            </div>

            {/* Comment Thread */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {commentList.map((c, i) => (
                <div key={i} className="p-3 rounded-lg bg-nocturne-charcoal border border-nocturne-border text-xs text-nocturne-ivory">
                  <div className="flex items-center justify-between mb-1 text-[10px] font-mono text-nocturne-grey">
                    <span className="font-semibold text-pumpkin">
                      {i === 0 ? 'RevAI Bot (Qwen2.5-Coder)' : 'Sarah Jenkins (Manager)'}
                    </span>
                    <span>Just now</span>
                  </div>
                  <p className="leading-relaxed">{c}</p>
                </div>
              ))}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add instruction or note for developer..."
                className="flex-1 bg-nocturne-bg border border-nocturne-border rounded-lg px-3 py-2 text-xs text-nocturne-ivory placeholder-nocturne-grey focus:outline-none focus:border-wine focus:bg-nocturne-plum font-sans"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-pumpkin hover:bg-pumpkin-dark text-nocturne-bg text-xs font-semibold shadow-card transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Decision Modal */}
      {modalType && (
        <DecisionModal
          isOpen={true}
          onClose={() => setModalType(null)}
          type={modalType}
          prNumber={submission.prNumber}
          developerName={submission.developer.name}
          onConfirm={(feedback) => {
            if (modalType === 'approve') {
              approveSubmission(submission.id, feedback);
            } else {
              requestChanges(submission.id, feedback);
            }
          }}
        />
      )}
    </div>
  );
};
