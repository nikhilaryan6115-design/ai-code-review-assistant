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
  CheckCheck,
  ArrowRight
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
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200',
      icon: ShieldAlert
    },
    high: {
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-300',
      icon: AlertTriangle
    },
    medium: {
      bg: 'bg-tobacco-50',
      text: 'text-tobacco-800',
      border: 'border-tobacco-200',
      icon: AlertCircle
    },
    low: {
      bg: 'bg-warm-subtle',
      text: 'text-warm-charcoal',
      border: 'border-warm-border',
      icon: Sparkles
    },
    info: {
      bg: 'bg-warm-subtle',
      text: 'text-warm-muted',
      border: 'border-warm-border',
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
          ? 'bg-warm-white border-wine ring-1 ring-wine/20 shadow-warm-md'
          : 'bg-warm-white border-warm-border hover:border-warm-borderStrong shadow-warm-sm'
      } ${isAddressed ? 'opacity-70 bg-warm-subtle/40' : ''}`}
    >
      {/* Header Bar */}
      <div
        className="p-4 flex items-start justify-between cursor-pointer select-none bg-warm-white"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`p-1.5 rounded-lg border shrink-0 ${config.bg} ${config.border} ${config.text}`}>
            <SevIcon className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${config.bg} ${config.border} ${config.text}`}>
                {issue.severity}
              </span>

              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-warm-muted px-2 py-0.5 rounded bg-warm-subtle border border-warm-border">
                <CatIcon className="w-3 h-3 text-tobacco" />
                {issue.category}
              </span>

              <span className="text-[11px] font-mono text-warm-dim">
                {issue.file}:L{issue.lineStart}{issue.lineEnd > issue.lineStart ? `-${issue.lineEnd}` : ''}
              </span>

              {isAddressed && (
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                  <CheckCheck className="w-3 h-3" /> Fix Applied
                </span>
              )}
              {isDismissed && (
                <span className="text-[10px] font-mono text-warm-muted bg-warm-subtle border border-warm-border px-2 py-0.5 rounded">
                  Dismissed
                </span>
              )}
            </div>

            <h4 className="text-sm font-bold text-warm-charcoal tracking-tight">
              {issue.title}
            </h4>

            {issue.cwe && (
              <p className="text-[11px] font-mono text-tobacco mt-0.5 font-medium">
                {issue.cwe}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-3">
          <button
            type="button"
            className="p-1 text-warm-muted hover:text-warm-charcoal rounded transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3.5 border-t border-warm-border/60 pt-3.5 bg-warm-white">
          {/* Explanation */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-warm-muted block mb-1 font-semibold">
              Finding Explanation
            </span>
            <p className="text-xs text-warm-charcoal leading-relaxed font-sans">
              {issue.explanation}
            </p>
          </div>

          {/* Why it is a problem */}
          <div className="p-3 rounded-lg bg-red-50/70 border border-red-200/80">
            <span className="text-[10px] font-mono uppercase tracking-wider text-red-900 font-bold flex items-center gap-1.5 mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-red-700" />
              Why this is a problem
            </span>
            <p className="text-xs text-red-950/90 leading-relaxed font-sans">
              {issue.whyItIsAProblem}
            </p>
          </div>

          {/* Suggested Solution */}
          <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200/80">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-900 font-bold flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              Suggested Solution (Qwen2.5-Coder)
            </span>
            <p className="text-xs text-emerald-950/90 leading-relaxed font-sans">
              {issue.suggestedSolution}
            </p>
          </div>

          {/* Code comparison diff snippet */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-warm-muted font-semibold">
                Suggested Patch Comparison
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(issue.suggestedFixSnippet);
                }}
                className="flex items-center gap-1 text-[11px] font-mono text-wine hover:text-wine-800 transition-colors font-medium"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Fix'}</span>
              </button>
            </div>

            <div className="rounded-lg border border-warm-border overflow-hidden font-mono text-xs">
              <div className="bg-red-50/70 border-b border-red-200/80 p-2.5 text-red-900 overflow-x-auto">
                <span className="text-[10px] font-bold text-red-700 block mb-1 uppercase tracking-wider">
                  - Vulnerable Code
                </span>
                <pre className="text-[11px] leading-relaxed whitespace-pre font-mono text-red-950">
                  {issue.originalSnippet}
                </pre>
              </div>

              <div className="bg-emerald-50/70 p-2.5 text-emerald-900 overflow-x-auto">
                <span className="text-[10px] font-bold text-emerald-700 block mb-1 uppercase tracking-wider">
                  + Suggested Replacement (Qwen2.5-Coder)
                </span>
                <pre className="text-[11px] leading-relaxed whitespace-pre font-mono text-emerald-950">
                  {issue.suggestedFixSnippet}
                </pre>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-warm-border/60">
            <button
              onClick={() => onSelect && onSelect()}
              className="flex items-center gap-1.5 text-xs font-medium text-wine hover:underline transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-tobacco" />
              <span>Inspect in Code Viewer →</span>
            </button>

            <div className="flex items-center gap-2">
              {!isDismissed && onDismiss && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(issue.id);
                  }}
                  className="px-2.5 py-1 text-xs text-warm-muted hover:text-warm-charcoal rounded hover:bg-warm-subtle transition-colors"
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
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
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
