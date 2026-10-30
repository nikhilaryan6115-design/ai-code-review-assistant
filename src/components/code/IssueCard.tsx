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
import { SkullSVG } from '../halloween/SkullSVG';

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

  const severityConfigs: Record<Severity, { bg: string; text: string; border: string; icon: React.ElementType; useSkull?: boolean }> = {
    critical: {
      bg: 'bg-red-950/40',
      text: 'text-red-400',
      border: 'border-red-900/50',
      icon: ShieldAlert,
      useSkull: true
    },
    high: {
      bg: 'bg-pumpkin/15',
      text: 'text-pumpkin',
      border: 'border-pumpkin/30',
      icon: AlertTriangle
    },
    medium: {
      bg: 'bg-nocturne-charcoal',
      text: 'text-amber-300',
      border: 'border-nocturne-border',
      icon: AlertCircle
    },
    low: {
      bg: 'bg-nocturne-charcoal',
      text: 'text-nocturne-ivory',
      border: 'border-nocturne-border',
      icon: Sparkles
    },
    info: {
      bg: 'bg-nocturne-charcoal',
      text: 'text-nocturne-grey',
      border: 'border-nocturne-border',
      icon: Code2
    }
  };

  const categoryIcons = {
    security: Shield,
    performance: Zap,
    quality: CheckCircle2,
    bug: AlertTriangle
  };

  const config = severityConfigs[issue.severity] || severityConfigs.low;
  const SevIcon = config.icon;
  const CatIcon = categoryIcons[issue.category] || Code2;
  const useSkull = config.useSkull;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAddressed = issue.status === 'addressed';
  const isDismissed = issue.status === 'dismissed';

  return (
    <div
      className={`rounded-xl border transition-all duration-150 overflow-hidden ${
        isSelected
          ? 'bg-nocturne-plum border-pumpkin/60 shadow-card-hover'
          : 'bg-nocturne-plum border-nocturne-border hover:border-nocturne-borderSubtle shadow-card'
      } ${isAddressed ? 'opacity-70' : ''}`}
    >
      {/* Header Bar */}
      <div
        className="p-4 flex items-start justify-between cursor-pointer select-none bg-nocturne-plum"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`p-1.5 rounded-lg border shrink-0 ${config.bg} ${config.border} ${config.text}`}>
            {useSkull ? (
              <SkullSVG size={16} color="#F87171" />
            ) : (
              <SevIcon className="w-4 h-4" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${config.bg} ${config.border} ${config.text}`}>
                {issue.severity}
              </span>

              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-nocturne-grey px-2 py-0.5 rounded bg-nocturne-charcoal border border-nocturne-border">
                <CatIcon className="w-3 h-3 text-pumpkin" />
                {issue.category}
              </span>

              <span className="text-[11px] font-mono text-nocturne-grey">
                {issue.file}:L{issue.lineStart}{issue.lineEnd > issue.lineStart ? `-${issue.lineEnd}` : ''}
              </span>

              {isAddressed && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                  <CheckCheck className="w-3 h-3" /> Fix Applied
                </span>
              )}
              {isDismissed && (
                <span className="text-[10px] font-mono text-nocturne-grey bg-nocturne-charcoal border border-nocturne-border px-2 py-0.5 rounded">
                  Dismissed
                </span>
              )}
            </div>

            <h3 className="text-sm font-bold text-nocturne-ivory tracking-tight">
              {issue.title}
            </h3>

            {issue.cwe && (
              <p className="text-[11px] font-mono text-pumpkin mt-0.5 font-medium">
                {issue.cwe}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-3">
          <button
            type="button"
            className="p-1 text-nocturne-grey hover:text-nocturne-ivory rounded transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3.5 border-t border-nocturne-border pt-3.5 bg-nocturne-plum">
          {/* Finding Explanation */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-nocturne-grey block mb-1 font-semibold">
              Finding Explanation
            </span>
            <p className="text-xs text-nocturne-ivory leading-relaxed font-sans">
              {issue.explanation}
            </p>
          </div>

          {/* Why it is a problem */}
          <div className="p-3 rounded-lg bg-red-950/30 border border-red-900/40">
            <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-1.5 mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              Why this is a problem
            </span>
            <p className="text-xs text-red-200 leading-relaxed font-sans">
              {issue.whyItIsAProblem}
            </p>
          </div>

          {/* Suggested Solution */}
          <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Suggested Solution (Qwen2.5-Coder)
            </span>
            <p className="text-xs text-emerald-200 leading-relaxed font-sans">
              {issue.suggestedSolution}
            </p>
          </div>

          {/* Code comparison diff snippet */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-nocturne-grey font-semibold">
                Suggested Patch Comparison
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(issue.suggestedFixSnippet);
                }}
                className="flex items-center gap-1 text-[11px] font-mono text-pumpkin hover:underline transition-colors font-medium cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Fix'}</span>
              </button>
            </div>

            <div className="rounded-lg border border-nocturne-border overflow-hidden font-mono text-xs">
              <div className="bg-[#1C1215] border-b border-red-900/40 p-3 overflow-x-auto">
                <span className="text-[10px] font-bold text-red-400 block mb-1 uppercase tracking-wider">
                  - Vulnerable Code
                </span>
                <pre className="text-[11px] leading-relaxed whitespace-pre font-mono text-red-200">
                  {issue.originalSnippet}
                </pre>
              </div>

              <div className="bg-[#0F1C16] p-3 overflow-x-auto">
                <span className="text-[10px] font-bold text-emerald-400 block mb-1 uppercase tracking-wider">
                  + Suggested Replacement (Qwen2.5-Coder)
                </span>
                <pre className="text-[11px] leading-relaxed whitespace-pre font-mono text-emerald-200">
                  {issue.suggestedFixSnippet}
                </pre>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-nocturne-border">
            <button
              onClick={() => onSelect && onSelect()}
              className="flex items-center gap-1.5 text-xs font-medium text-pumpkin hover:underline transition-colors cursor-pointer"
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
                  className="px-2.5 py-1 text-xs text-nocturne-grey hover:text-nocturne-ivory rounded hover:bg-nocturne-charcoal transition-colors cursor-pointer"
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
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
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
