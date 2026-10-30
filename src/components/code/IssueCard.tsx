import React, { useState } from 'react';
import { Issue, Severity } from '../../types';
import { 
  ShieldAlert, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Code2, 
  Sparkles, 
  Check, 
  Copy, 
  Shield, 
  Zap, 
  CheckCheck
} from 'lucide-react';

interface Props {
  issue: Issue;
  isSelected?: boolean;
  onSelect?: () => void;
  onApplyFix?: (issueId: string) => void;
  onDismiss?: (issueId: string) => void;
}

export const IssueCard: React.FC<Props> = ({
  issue,
  isSelected,
  onSelect,
  onApplyFix,
  onDismiss
}) => {
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const severityConfigs: Record<Severity, { bg: string; text: string; border: string; icon: React.ElementType }> = {
    critical: {
      bg: 'bg-[#A63232]/12',
      text: 'text-[#E06C75]',
      border: 'border-[#A63232]/35',
      icon: ShieldAlert,
    },
    high: {
      bg: 'bg-[#B7791F]/12',
      text: 'text-[#D4AF67]',
      border: 'border-[#B7791F]/35',
      icon: AlertTriangle,
    },
    medium: {
      bg: 'bg-[#C5A059]/10',
      text: 'text-[#C5A059]',
      border: 'border-[#C5A059]/30',
      icon: AlertCircle,
    },
    low: {
      bg: 'bg-[#1D232C]',
      text: 'text-[#F2F4F8]',
      border: 'border-[#2E3643]',
      icon: Sparkles,
    },
    info: {
      bg: 'bg-[#1D232C]',
      text: 'text-[#96A0B0]',
      border: 'border-[#2E3643]',
      icon: Code2,
    }
  };

  const categoryIcons = {
    security: Shield,
    performance: Zap,
    quality: CheckCircle2,
    bug: AlertTriangle,
  };

  const config = severityConfigs[issue.severity] || severityConfigs.low;
  const SevIcon = config.icon;
  const CatIcon = categoryIcons[issue.category] || Code2;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAddressed = issue.status === 'addressed';
  const isDismissed = issue.status === 'dismissed';

  return (
    <div
      className={`rounded border transition-colors overflow-hidden ${
        isSelected
          ? 'bg-[#161B22] border-[#C5A059] shadow-sm'
          : 'bg-[#161B22] border-[#2E3643] hover:border-[#3E495B] shadow-sm'
      } ${isAddressed ? 'opacity-70' : ''}`}
    >
      {/* Header Bar */}
      <div
        className="p-4 flex items-start justify-between cursor-pointer select-none bg-[#161B22]"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`p-1.5 rounded border shrink-0 ${config.bg} ${config.border} ${config.text}`}>
            <SevIcon className="w-3.5 h-3.5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded border ${config.bg} ${config.border} ${config.text}`}>
                {issue.severity}
              </span>

              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[#96A0B0] px-2 py-0.5 rounded bg-[#1D232C] border border-[#2E3643]">
                <CatIcon className="w-3 h-3 text-[#C5A059]" />
                {issue.category}
              </span>

              <span className="text-[11px] font-mono text-[#96A0B0]">
                {issue.file}:L{issue.lineStart}{issue.lineEnd > issue.lineStart ? `-${issue.lineEnd}` : ''}
              </span>

              {isAddressed && (
                <span className="text-[10px] font-mono text-[#4EAA78] bg-[#2D6A4F]/15 border border-[#2D6A4F]/35 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                  <CheckCheck className="w-3 h-3" /> Resolved
                </span>
              )}
              {isDismissed && (
                <span className="text-[10px] font-mono text-[#96A0B0] bg-[#1D232C] border border-[#2E3643] px-2 py-0.5 rounded">
                  Dismissed
                </span>
              )}
            </div>

            <h3 className="text-sm font-serif font-medium text-[#F2F4F8] tracking-tight">
              {issue.title}
            </h3>

            {issue.cwe && (
              <p className="text-[11px] font-mono text-[#C5A059] mt-0.5 font-medium">
                {issue.cwe}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-3">
          <button
            type="button"
            className="p-1 text-[#96A0B0] hover:text-[#F2F4F8] rounded transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3.5 border-t border-[#2E3643] pt-3.5 bg-[#161B22]">
          {/* Finding Explanation */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#96A0B0] block mb-1 font-semibold">
              Finding Explanation
            </span>
            <p className="text-xs text-[#F2F4F8] leading-relaxed font-sans">
              {issue.explanation}
            </p>
          </div>

          {/* Why it is a problem */}
          <div className="p-3 rounded bg-[#1A1215] border border-[#A63232]/30">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#E06C75] font-semibold flex items-center gap-1.5 mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-[#E06C75]" />
              Risk Analysis
            </span>
            <p className="text-xs text-[#F2B5BC] leading-relaxed font-sans">
              {issue.whyItIsAProblem}
            </p>
          </div>

          {/* Suggested Solution */}
          <div className="p-3 rounded bg-[#0F1A15] border border-[#2D6A4F]/30">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#4EAA78] font-semibold flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#4EAA78]" />
              Remediation Strategy
            </span>
            <p className="text-xs text-[#BCEAD0] leading-relaxed font-sans">
              {issue.suggestedSolution}
            </p>
          </div>

          {/* Code comparison diff snippet */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#96A0B0] font-semibold">
                Suggested Patch Comparison
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(issue.suggestedFixSnippet);
                }}
                className="flex items-center gap-1 text-[11px] font-mono text-[#C5A059] hover:underline transition-colors font-medium cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-[#2D6A4F]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Patch'}</span>
              </button>
            </div>

            <div className="rounded border border-[#2E3643] overflow-hidden font-mono text-xs">
              <div className="bg-[#1A1215] border-b border-[#2E3643] p-3 overflow-x-auto">
                <span className="text-[10px] font-semibold text-[#E06C75] block mb-1 uppercase tracking-wider">
                  - Vulnerable Implementation
                </span>
                <pre className="text-[11px] leading-relaxed whitespace-pre font-mono text-[#F2B5BC]">
                  {issue.originalSnippet}
                </pre>
              </div>

              <div className="bg-[#0F1A15] p-3 overflow-x-auto">
                <span className="text-[10px] font-semibold text-[#4EAA78] block mb-1 uppercase tracking-wider">
                  + Recommended Fix
                </span>
                <pre className="text-[11px] leading-relaxed whitespace-pre font-mono text-[#BCEAD0]">
                  {issue.suggestedFixSnippet}
                </pre>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-[#2E3643]">
            <button
              onClick={() => onSelect && onSelect()}
              className="flex items-center gap-1.5 text-xs font-medium text-[#C5A059] hover:underline transition-colors cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Inspect in Code Viewer →</span>
            </button>

            <div className="flex items-center gap-2">
              {!isDismissed && onDismiss && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(issue.id);
                  }}
                  className="px-2.5 py-1 text-xs text-[#96A0B0] hover:text-[#F2F4F8] rounded hover:bg-[#1D232C] transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              )}

              {!isAddressed && onApplyFix && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onApplyFix(issue.id);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A2332] hover:bg-[#233045] border border-[#2E3643] text-[#F2F4F8] rounded text-xs font-medium shadow-sm transition-colors cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Apply Patch</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
