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
  ArrowUpRight,
  Shield,
  Zap,
  CheckCheck,
  EyeOff
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
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      icon: ShieldAlert
    },
    high: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      border: 'border-orange-500/30',
      icon: AlertTriangle
    },
    medium: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      icon: AlertCircle
    },
    low: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      icon: Sparkles
    },
    info: {
      bg: 'bg-slate-500/10',
      text: 'text-slate-400',
      border: 'border-slate-500/30',
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
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        isSelected
          ? 'bg-dark-card border-brand-blue ring-1 ring-brand-blue/40 shadow-glow-blue'
          : 'bg-dark-card/90 border-dark-border hover:border-dark-borderLight'
      } ${isAddressed ? 'opacity-70 border-emerald-500/30' : ''}`}
    >
      {/* Header Bar */}
      <div
        className="p-4 flex items-start justify-between cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`p-2 rounded-lg border shrink-0 ${config.bg} ${config.border} ${config.text}`}>
            <SevIcon className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {/* Severity badge */}
              <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${config.bg} ${config.border} ${config.text}`}>
                {issue.severity}
              </span>

              {/* Category pill */}
              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-dark-muted px-2 py-0.5 rounded bg-dark-subtle border border-dark-border">
                <CatIcon className="w-3 h-3 text-brand-blue" />
                {issue.category}
              </span>

              {/* File and line indicator */}
              <span className="text-[11px] font-mono text-dark-dim">
                {issue.file}:L{issue.lineStart}{issue.lineEnd > issue.lineStart ? `-${issue.lineEnd}` : ''}
              </span>

              {/* Status if addressed */}
              {isAddressed && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCheck className="w-3 h-3" /> Fix Applied
                </span>
              )}
              {isDismissed && (
                <span className="text-[10px] font-mono text-dark-dim bg-dark-subtle border border-dark-border px-2 py-0.5 rounded">
                  Dismissed
                </span>
              )}
            </div>

            <h4 className="text-sm font-semibold text-white tracking-tight leading-snug">
              {issue.title}
            </h4>

            {issue.cwe && (
              <p className="text-[11px] font-mono text-brand-purpleLight mt-0.5">
                {issue.cwe}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-3">
          <button
            type="button"
            className="p-1 text-dark-dim hover:text-white rounded transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3.5 border-t border-dark-border/60 pt-3">
          {/* Explanation */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-dark-dim block mb-1">
              Detailed Finding
            </span>
            <p className="text-xs text-dark-text leading-relaxed">
              {issue.explanation}
            </p>
          </div>

          {/* Why it is a problem */}
          <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5 mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Why this is a problem
            </span>
            <p className="text-xs text-dark-muted leading-relaxed">
              {issue.whyItIsAProblem}
            </p>
          </div>

          {/* Suggested Solution */}
          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Suggested Solution (Qwen2.5-Coder)
            </span>
            <p className="text-xs text-dark-muted leading-relaxed">
              {issue.suggestedSolution}
            </p>
          </div>

          {/* Code comparison diff snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-dark-dim">
                Suggested Patch
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(issue.suggestedFixSnippet);
                }}
                className="flex items-center gap-1 text-[11px] font-mono text-brand-blue hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Fix'}</span>
              </button>
            </div>

            <div className="rounded-lg bg-dark-bg border border-dark-border overflow-hidden font-mono text-xs">
              <div className="bg-rose-950/20 border-b border-rose-900/30 p-2 text-rose-300 overflow-x-auto">
                <span className="text-[10px] font-bold text-rose-400 block mb-1 uppercase tracking-wider">
                  - Original Vulnerable Code
                </span>
                <pre className="text-[11px] leading-relaxed whitespace-pre font-mono text-rose-200/90">
                  {issue.originalSnippet}
                </pre>
              </div>

              <div className="bg-emerald-950/20 p-2 text-emerald-300 overflow-x-auto">
                <span className="text-[10px] font-bold text-emerald-400 block mb-1 uppercase tracking-wider">
                  + Suggested Replacement (Qwen2.5-Coder)
                </span>
                <pre className="text-[11px] leading-relaxed whitespace-pre font-mono text-emerald-200/90">
                  {issue.suggestedFixSnippet}
                </pre>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-dark-border/60">
            <button
              onClick={() => onSelect && onSelect()}
              className="flex items-center gap-1.5 text-xs font-mono text-brand-blue hover:text-white hover:underline transition-colors"
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
                  className="px-2.5 py-1 text-xs text-dark-dim hover:text-dark-text rounded hover:bg-dark-subtle transition-colors"
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
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Apply Fix</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
