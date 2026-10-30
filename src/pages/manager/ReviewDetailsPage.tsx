import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CodeViewer } from '../../components/code/CodeViewer';
import { IssueCard } from '../../components/code/IssueCard';
import { RiskBadge } from '../../components/common/RiskBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DecisionModal } from '../../components/modals/DecisionModal';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertOctagon, 
  RefreshCw, 
  Sparkles, 
  MessageSquare, 
  Send
} from 'lucide-react';

export const ReviewDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    submissions, 
    triggerAIScan, 
    applyIssueFix, 
    dismissIssue 
  } = useApp();

  const [selectedIssueId, setSelectedIssueId] = useState<string | undefined>();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<'approve' | 'request_changes'>('approve');
  const [newComment, setNewComment] = useState('');
  const [commentList, setCommentList] = useState<string[]>([
    'Automated AST pre-screening finished with 2 critical OWASP findings.',
    'Please address line 42 SQL concatenation issue prior to authorization.'
  ]);

  const submission = submissions.find((s) => s.id === id);

  if (!submission) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto">
        <h2 className="text-lg font-serif font-medium text-[#F2F4F8]">Submission Not Located</h2>
        <p className="text-xs text-[#96A0B0]">The requested pull request inspection record does not exist or has been archived.</p>
        <button
          onClick={() => navigate('/manager/submissions')}
          className="px-4 py-2 rounded bg-[#1A2332] border border-[#2E3643] text-[#F2F4F8] text-xs font-medium cursor-pointer"
        >
          Return to Submissions Queue
        </button>
      </div>
    );
  }

  const handleOpenDecision = (type: 'approve' | 'request_changes') => {
    setDecisionType(type);
    setModalOpen(true);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentList([...commentList, newComment.trim()]);
    setNewComment('');
  };

  const filteredIssues = submission.issues.filter((issue) => {
    if (filterSeverity === 'all') return true;
    return issue.severity === filterSeverity;
  });

  const criticalIssuesCount = submission.issues.filter((i) => i.severity === 'critical').length;
  const warningsCount = submission.issues.filter((i) => i.severity === 'medium' || i.severity === 'high').length;
  const securityCount = submission.issues.filter((i) => i.category === 'security').length;
  const performanceCount = submission.issues.filter((i) => i.category === 'performance').length;
  const qualityCount = submission.issues.filter((i) => i.category === 'quality').length;

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2E3643] pb-4 bg-[#161B22] p-4 rounded shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/manager/submissions"
            className="p-2 rounded bg-[#1D232C] border border-[#2E3643] text-[#96A0B0] hover:text-[#F2F4F8] hover:bg-[#252D38] transition-colors"
            title="Back to submissions"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#96A0B0]">
              <span>{submission.repository.name}</span>
              <span>/</span>
              <span className="text-[#C5A059] font-medium">Pull Request #{submission.prNumber}</span>
            </div>
            <h1 className="text-lg font-serif font-medium text-[#F2F4F8] tracking-tight flex items-center gap-2 mt-0.5">
              <span>{submission.title}</span>
            </h1>
          </div>
        </div>

        {/* Manager Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => triggerAIScan(submission.id)}
            disabled={submission.status === 'ai_reviewing'}
            className="flex items-center gap-1.5 px-3 py-2 rounded bg-[#1D232C] border border-[#2E3643] text-xs font-mono text-[#F2F4F8] hover:bg-[#252D38] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            title="Re-run Qwen2.5-Coder 7B"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#C5A059] ${submission.status === 'ai_reviewing' ? 'animate-spin' : ''}`} />
            <span>Re-evaluate</span>
          </button>

          <button
            onClick={() => handleOpenDecision('request_changes')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-[#1A2332] hover:bg-[#233045] border border-[#2E3643] text-[#F2F4F8] text-xs font-medium transition-colors shadow-sm cursor-pointer"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Request Revision</span>
          </button>

          <button
            onClick={() => handleOpenDecision('approve')}
            className="flex items-center gap-1.5 px-4 py-2 rounded bg-[#2D6A4F] hover:bg-[#387F60] text-white text-xs font-medium transition-colors shadow-sm cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Authorize PR</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Details Sidebar & Code Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): AI Findings & Review Metadata */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Developer & Submission Meta Card */}
          <div className="bg-[#161B22] border border-[#2E3643] rounded p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#2E3643] pb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#96A0B0]">
                Author Record
              </span>
              <div className="flex items-center gap-2">
                <StatusBadge status={submission.status} size="sm" />
                <RiskBadge level={submission.riskLevel} score={submission.riskScore} size="sm" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={submission.developer.avatar}
                alt={submission.developer.name}
                className="w-10 h-10 rounded object-cover ring-1 ring-[#2E3643]"
              />
              <div>
                <h2 className="text-sm font-serif font-medium text-[#F2F4F8]">{submission.developer.name}</h2>
                <p className="text-xs text-[#96A0B0] font-mono">{submission.developer.role}</p>
                <p className="text-[11px] text-[#687487] font-mono mt-0.5">{submission.developer.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#0E1116] border border-[#2E3643]">
                <span className="text-[#96A0B0] text-[10px] block">Branch</span>
                <span className="text-[#C5A059] font-medium truncate block">
                  {submission.repository.branch}
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#0E1116] border border-[#2E3643]">
                <span className="text-[#96A0B0] text-[10px] block">Language</span>
                <span className="text-[#F2F4F8] font-medium">{submission.language}</span>
              </div>
              <div className="p-2.5 rounded bg-[#0E1116] border border-[#2E3643]">
                <span className="text-[#96A0B0] text-[10px] block">Diff Scope</span>
                <span className="text-[#F2F4F8] font-medium">
                  <span className="text-[#4EAA78]">+{submission.additions}</span>{' '}
                  <span className="text-[#E06C75]">-{submission.deletions}</span>
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#0E1116] border border-[#2E3643]">
                <span className="text-[#96A0B0] text-[10px] block">Inspection Latency</span>
                <span className="text-[#4EAA78] font-medium">
                  {submission.reviewTimeSeconds || 14}s
                </span>
              </div>
            </div>
          </div>

          {/* 2. Overall Risk Assessment Meter */}
          <div className="bg-[#161B22] border border-[#2E3643] rounded p-5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#96A0B0]">
                Security & Risk Assessment
              </span>
              <span className="text-xs font-mono text-[#F2F4F8] font-medium">
                Score: <strong className={submission.riskScore > 70 ? 'text-[#E06C75]' : 'text-[#4EAA78]'}>{submission.riskScore}</strong> / 100
              </span>
            </div>

            {/* Risk Progress Bar */}
            <div>
              <div className="w-full h-2 bg-[#0E1116] rounded overflow-hidden border border-[#2E3643]">
                <div
                  className={`h-full transition-all duration-300 ${
                    submission.riskScore >= 75
                      ? 'bg-[#A63232]'
                      : submission.riskScore >= 40
                      ? 'bg-[#B7791F]'
                      : 'bg-[#2D6A4F]'
                  }`}
                  style={{ width: `${submission.riskScore}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-[#687487] mt-1">
                <span>0 (Compliant)</span>
                <span>50 (Moderate)</span>
                <span>100 (Critical Risk)</span>
              </div>
            </div>

            {/* Finding categories count */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#2E3643] text-center text-xs">
              <div className="p-2 rounded bg-[#0E1116] border border-[#2E3643]">
                <span className="text-[10px] font-mono uppercase text-[#96A0B0] block">Security</span>
                <span className="font-serif text-sm font-medium text-[#E06C75]">{securityCount} issues</span>
              </div>
              <div className="p-2 rounded bg-[#0E1116] border border-[#2E3643]">
                <span className="text-[10px] font-mono uppercase text-[#96A0B0] block">Performance</span>
                <span className="font-serif text-sm font-medium text-[#D4AF67]">{performanceCount} issues</span>
              </div>
              <div className="p-2 rounded bg-[#0E1116] border border-[#2E3643]">
                <span className="text-[10px] font-mono uppercase text-[#96A0B0] block">Quality</span>
                <span className="font-serif text-sm font-medium text-[#4EAA78]">{qualityCount} issues</span>
              </div>
            </div>
          </div>

          {/* 3. AI Executive Summary */}
          <div className="bg-[#161B22] border border-[#2E3643] rounded p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#C5A059] font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Qwen2.5-Coder Synthesis</span>
            </div>
            <p className="text-xs text-[#F2F4F8] leading-relaxed font-sans">
              {submission.aiSummary}
            </p>
          </div>

          {/* 4. Filterable Issues List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-serif font-medium text-[#F2F4F8]">
                  Inspection Findings ({submission.issues.length})
                </h3>
                <p className="text-xs text-[#96A0B0]">
                  {criticalIssuesCount} critical vulnerabilities, {warningsCount} warnings
                </p>
              </div>

              {/* Severity filter pills */}
              <div className="flex items-center gap-1 text-[11px] font-mono">
                {['all', 'critical', 'high', 'medium'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setFilterSeverity(sev)}
                    className={`px-2 py-0.5 rounded capitalize transition-colors cursor-pointer ${
                      filterSeverity === sev
                        ? 'bg-[#1A2332] text-[#F2F4F8] border border-[#2E3643] font-medium'
                        : 'text-[#96A0B0] hover:text-[#F2F4F8]'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Issue Cards */}
            <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
              {filteredIssues.length === 0 ? (
                <div className="p-6 text-center text-[#96A0B0] text-xs font-mono bg-[#161B22] border border-[#2E3643] rounded">
                  No findings match severity tier: {filterSeverity}.
                </div>
              ) : (
                filteredIssues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    isSelected={selectedIssueId === issue.id}
                    onSelect={() => setSelectedIssueId(issue.id)}
                    onApplyFix={(issueId) => applyIssueFix(submission.id, issueId)}
                    onDismiss={(issueId) => dismissIssue(submission.id, issueId)}
                  />
                ))
              )}
            </div>
          </div>

          {/* 5. Communication Thread Box */}
          <div className="bg-[#161B22] border border-[#2E3643] rounded p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#2E3643] pb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-[#C5A059]" />
                <h4 className="text-xs font-serif font-medium text-[#F2F4F8]">
                  Review Ledger & Developer Exchange
                </h4>
              </div>
              <span className="text-[10px] font-mono text-[#96A0B0]">
                {commentList.length} entries
              </span>
            </div>

            {/* Comment Thread */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {commentList.map((c, i) => (
                <div key={i} className="p-2.5 rounded bg-[#0E1116] border border-[#2E3643] text-xs text-[#F2F4F8]">
                  <div className="flex items-center justify-between mb-1 text-[10px] font-mono text-[#96A0B0]">
                    <span className="font-medium text-[#C5A059]">
                      {i === 0 ? 'Qwen2.5-Coder 7B' : 'Sarah Jenkins (Director of Eng)'}
                    </span>
                    <span>Recent</span>
                  </div>
                  <p className="leading-relaxed font-sans">{c}</p>
                </div>
              ))}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Post review note to timeline..."
                className="flex-1 bg-[#0E1116] border border-[#2E3643] rounded px-3 py-1.5 text-xs text-[#F2F4F8] placeholder-[#96A0B0] focus:outline-none focus:border-[#C5A059] font-sans"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded bg-[#1A2332] hover:bg-[#233045] border border-[#2E3643] text-[#F2F4F8] text-xs font-medium transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#C5A059]" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (7 cols): Full Interactive Code Viewer */}
        <div className="lg:col-span-7 sticky top-20">
          <CodeViewer
            codeFiles={submission.codeFiles}
            issues={submission.issues}
            selectedIssueId={selectedIssueId}
            onApplyFix={(issueId) => applyIssueFix(submission.id, issueId)}
          />
        </div>
      </div>

      {/* Decision Authorization Modal */}
      <DecisionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        submissionId={submission.id}
        prNumber={submission.prNumber}
        developerName={submission.developer.name}
        decisionType={decisionType}
      />
    </div>
  );
};
