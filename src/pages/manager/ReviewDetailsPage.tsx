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
  Calendar, 
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
  ExternalLink,
  ChevronRight,
  FileCode2,
  CheckCheck
} from 'lucide-react';
import { Severity, IssueCategory } from '../../types';

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

  // Find submission, defaulting to sub-142 if not found or id is default
  const submission = submissions.find((s) => s.id === id) || submissions[0];

  // Active Category / Severity Filter for Findings
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'security' | 'performance' | 'quality'>('all');
  const [selectedIssueId, setSelectedIssueId] = useState<string>(submission.issues[0]?.id || '');
  
  // Modals & comments
  const [modalType, setModalType] = useState<'approve' | 'request_changes' | null>(null);
  const [newComment, setNewComment] = useState('');
  const [commentList, setCommentList] = useState<string[]>([
    'Automated AI pre-check completed by Qwen2.5-Coder 7B. Flagged 1 critical security vulnerability.'
  ]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentList((prev) => [...prev, newComment]);
    setNewComment('');
    addToast('Comment Posted', 'Your review comment was added to the pull request.', 'success');
  };

  // Filtered issues list
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
      {/* Top Back Nav & Quick Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-border/80 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/manager/submissions"
            className="p-2 rounded-lg bg-dark-card border border-dark-border text-dark-muted hover:text-white transition-colors"
            title="Back to submissions"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-dark-dim">
              <span>{submission.repository.name}</span>
              <span>/</span>
              <span className="text-brand-blue">Pull Request #{submission.prNumber}</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 mt-0.5">
              <span>{submission.title}</span>
            </h1>
          </div>
        </div>

        {/* Manager Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => triggerAIScan(submission.id)}
            disabled={submission.status === 'ai_reviewing'}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-dark-card border border-dark-border text-xs font-mono text-dark-text hover:text-white hover:border-brand-purple transition-all disabled:opacity-50"
            title="Re-run Qwen2.5-Coder 7B"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-brand-purpleLight ${submission.status === 'ai_reviewing' ? 'animate-spin' : ''}`} />
            <span>Re-run AI</span>
          </button>

          <button
            onClick={() => setModalType('request_changes')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-semibold transition-all"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Request Changes</span>
          </button>

          <button
            onClick={() => setModalType('approve')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/40 transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Approve PR</span>
          </button>
        </div>
      </div>

      {/* Decision Banner if already decided */}
      {submission.managerDecision && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            submission.managerDecision.decision === 'approved'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          }`}
        >
          {submission.managerDecision.decision === 'approved' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
                Manager Decision: {submission.managerDecision.decision.replace('_', ' ')}
              </h4>
              <span className="text-[10px] font-mono opacity-75">
                {new Date(submission.managerDecision.decidedAt).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-xs mt-1 text-white leading-relaxed">
              "{submission.managerDecision.feedback}"
            </p>
            <p className="text-[10px] font-mono opacity-80 mt-1">
              Signed off by: {submission.managerDecision.managerName}
            </p>
          </div>
        </div>
      )}

      {/* Grid: Left Column Summary & AI Findings, Right Column Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols on large screen): Metadata, AI Overview, Categorized Issues */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Code Submission Summary Card */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-dark-dim">
                Submission Metadata
              </span>
              <StatusBadge status={submission.status} size="sm" />
            </div>

            <div className="flex items-center gap-3">
              <img
                src={submission.developer.avatar}
                alt={submission.developer.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-blue/30"
              />
              <div>
                <p className="text-sm font-semibold text-white">
                  {submission.developer.name}
                </p>
                <p className="text-xs text-dark-dim font-mono">
                  {submission.developer.email} • {submission.developer.role}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-dark-border/60 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-dark-subtle border border-dark-border">
                <span className="text-dark-dim text-[10px] block">Branch</span>
                <span className="text-brand-blue font-semibold truncate block">
                  {submission.repository.branch}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-dark-subtle border border-dark-border">
                <span className="text-dark-dim text-[10px] block">Language</span>
                <span className="text-dark-text font-semibold">{submission.language}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-dark-subtle border border-dark-border">
                <span className="text-dark-dim text-[10px] block">Lines Changed</span>
                <span className="text-white">
                  <span className="text-emerald-400">+{submission.additions}</span>{' '}
                  <span className="text-rose-400">-{submission.deletions}</span>
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-dark-subtle border border-dark-border">
                <span className="text-dark-dim text-[10px] block">AI Scan Time</span>
                <span className="text-emerald-400 font-semibold">
                  {submission.reviewTimeSeconds || 14}s (Instant)
                </span>
              </div>
            </div>
          </div>

          {/* 3. Overall Risk Assessment Meter */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-dark-dim flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                Overall Risk Assessment
              </span>
              <RiskBadge level={submission.riskLevel} score={submission.riskScore} size="sm" />
            </div>

            {/* Risk Gauge Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-dark-dim">Threat Composite Score</span>
                <span className={`font-bold ${
                  submission.riskScore > 75 ? 'text-rose-400' : submission.riskScore > 40 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {submission.riskScore} / 100
                </span>
              </div>
              <div className="w-full h-2.5 bg-dark-bg rounded-full overflow-hidden border border-dark-border">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    submission.riskScore > 75
                      ? 'bg-gradient-to-r from-orange-500 to-rose-500'
                      : submission.riskScore > 40
                      ? 'bg-gradient-to-r from-blue-500 to-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${submission.riskScore}%` }}
                />
              </div>
            </div>

            {/* Findings Pill Counters */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono">
              <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300">
                <span className="block text-base font-bold">{criticalIssuesCount}</span>
                <span className="text-[10px] uppercase opacity-80">Critical</span>
              </div>
              <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">
                <span className="block text-base font-bold">{warningsCount}</span>
                <span className="text-[10px] uppercase opacity-80">Warnings</span>
              </div>
              <div className="p-2 rounded bg-brand-blue/10 border border-brand-blue/20 text-brand-blue">
                <span className="block text-base font-bold">{submission.issues.length}</span>
                <span className="text-[10px] uppercase opacity-80">Total Issues</span>
              </div>
            </div>
          </div>

          {/* 2. AI-Generated Summary & Explanation (Qwen2.5-Coder 7B) */}
          <div className="bg-gradient-to-b from-dark-card to-dark-subtle border border-brand-purple/30 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-brand-purple/20 text-brand-purpleLight border border-brand-purple/40">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                    Qwen2.5-Coder 7B Synthesis
                  </h3>
                  <span className="text-[10px] text-dark-dim font-mono">Model: {submission.aiModel}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Analysis Complete
              </span>
            </div>

            {/* AI Summary Quote (Matches Prompt Sample) */}
            <blockquote className="p-3.5 rounded-xl bg-dark-bg/90 border border-dark-border text-xs text-brand-purpleLight/95 leading-relaxed font-sans italic">
              "{submission.aiSummary}"
            </blockquote>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-dark-dim block mb-1">
                Functional Overview & Architecture Impact
              </span>
              <p className="text-xs text-dark-text leading-relaxed">
                {submission.aiExplanation}
              </p>
            </div>
          </div>

          {/* Categorized Issues & Suggested Fixes Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Detailed AI Findings & Fixes ({submission.issues.length})
                </h3>
                <p className="text-[11px] text-dark-muted">Click an issue to jump to problematic code</p>
              </div>
            </div>

            {/* Filter Tabs for Issue Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'bg-brand-blue text-white font-bold'
                    : 'bg-dark-card text-dark-muted hover:text-white border border-dark-border'
                }`}
              >
                All ({submission.issues.length})
              </button>

              <button
                onClick={() => setActiveTab('critical')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'critical'
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-dark-card text-rose-400 hover:text-rose-300 border border-rose-500/30'
                }`}
              >
                <ShieldAlert className="w-3 h-3" />
                Critical ({criticalIssuesCount})
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'security'
                    ? 'bg-brand-purple text-white font-bold'
                    : 'bg-dark-card text-brand-purpleLight hover:text-white border border-brand-purple/30'
                }`}
              >
                <Shield className="w-3 h-3" />
                Security ({securityCount})
              </button>

              <button
                onClick={() => setActiveTab('performance')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'performance'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-dark-card text-amber-400 hover:text-amber-300 border border-amber-500/30'
                }`}
              >
                <Zap className="w-3 h-3" />
                Perf ({performanceCount})
              </button>

              <button
                onClick={() => setActiveTab('quality')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'quality'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-dark-card text-emerald-400 hover:text-emerald-300 border border-emerald-500/30'
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
        <div className="lg:col-span-7 space-y-6">
          {/* Code Viewer Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-brand-blue" />
                Interactive Code Inspection & Problematic Line Highlights
              </h3>
              <p className="text-[11px] text-dark-muted">
                Line 42: SQL injection (Critical) • Line 18: Missing validation • Line 67: N+1 query
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
          <div className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-dark-border/60 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand-blue" />
                <h4 className="text-xs font-semibold text-white uppercase font-mono tracking-wider">
                  Manager Feedback & Review Discussion
                </h4>
              </div>
              <span className="text-[10px] font-mono text-dark-dim">
                {commentList.length} comments
              </span>
            </div>

            {/* Comment Thread */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {commentList.map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-dark-subtle border border-dark-border/70 text-xs text-dark-text">
                  <div className="flex items-center justify-between mb-1 text-[10px] font-mono text-dark-dim">
                    <span className="font-semibold text-brand-blue">
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
                placeholder="Add inline note or instruction for developer..."
                className="flex-1 bg-dark-bg border border-dark-border rounded-xl px-3.5 py-2 text-xs text-white placeholder-dark-dim focus:outline-none focus:border-brand-blue font-sans"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-blue hover:bg-brand-blueHover text-white text-xs font-semibold shadow-sm transition-colors"
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
