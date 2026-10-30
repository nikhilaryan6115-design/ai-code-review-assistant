import React, { useState } from 'react';
import { CodeFile, Issue, Severity } from '../../types';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldAlert, 
  AlertTriangle, 
  Split, 
  Code, 
  ChevronRight, 
  CheckCheck,
  Maximize2
} from 'lucide-react';

interface Props {
  codeFiles: CodeFile[];
  issues: Issue[];
  selectedIssueId?: string;
  onApplyFix?: (issueId: string) => void;
}

export const CodeViewer: React.FC<Props> = ({
  codeFiles,
  issues,
  selectedIssueId,
  onApplyFix
}) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'standard' | 'diff'>('standard');
  const [expandedAnnotationLine, setExpandedAnnotationLine] = useState<number | null>(42);

  const activeFile = codeFiles[activeFileIndex] || codeFiles[0];

  if (!activeFile) {
    return (
      <div className="bg-dark-card border border-dark-border rounded-xl p-8 text-center text-dark-dim text-sm">
        No code files found for this submission.
      </div>
    );
  }

  const lines = activeFile.content.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getProblemForLine = (lineNum: number) => {
    return activeFile.problematicLines.find((p) => p.line === lineNum);
  };

  const getIssueForProblem = (issueId: string) => {
    return issues.find((i) => i.id === issueId);
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden shadow-xl flex flex-col">
      {/* File Header & Tabs */}
      <div className="bg-dark-subtle border-b border-dark-border px-3 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* File Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {codeFiles.map((file, idx) => {
            const hasCritical = file.problematicLines.some((p) => p.severity === 'critical');
            const hasWarnings = file.problematicLines.some((p) => p.severity === 'medium' || p.severity === 'high');
            const isActive = idx === activeFileIndex;

            return (
              <button
                key={file.filename}
                onClick={() => {
                  setActiveFileIndex(idx);
                  setExpandedAnnotationLine(null);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-dark-card text-white border border-brand-blue/40 shadow-sm font-semibold'
                    : 'text-dark-muted hover:text-white hover:bg-dark-card/50 border border-transparent'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5 text-brand-blue" />
                <span>{file.filename}</span>
                {hasCritical && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Critical Issue" />
                )}
                {!hasCritical && hasWarnings && (
                  <span className="w-2 h-2 rounded-full bg-amber-500" title="Warning" />
                )}
              </button>
            );
          })}
        </div>

        {/* View Mode controls & Copy */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-dark-bg border border-dark-border rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('standard')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                viewMode === 'standard'
                  ? 'bg-brand-blue/20 text-brand-blue font-medium'
                  : 'text-dark-dim hover:text-white'
              }`}
              title="Standard Annotated View"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Annotated</span>
            </button>
            <button
              onClick={() => setViewMode('diff')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                viewMode === 'diff'
                  ? 'bg-brand-purple/20 text-brand-purpleLight font-medium'
                  : 'text-dark-dim hover:text-white'
              }`}
              title="AI Diff Suggestion View"
            >
              <Split className="w-3.5 h-3.5" />
              <span>AI Diff</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-bg border border-dark-border text-xs font-mono text-dark-muted hover:text-white transition-colors"
            title="Copy full source file"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Code Area */}
      {viewMode === 'standard' ? (
        <div className="overflow-x-auto max-h-[640px] font-mono text-xs leading-relaxed select-text bg-[#090D16]">
          <div className="min-w-full inline-block py-2">
            {lines.map((line, index) => {
              const lineNum = index + 1;
              const problem = getProblemForLine(lineNum);
              const isSelectedLine = problem && problem.issueId === selectedIssueId;
              const isExpanded = expandedAnnotationLine === lineNum;
              const issue = problem ? getIssueForProblem(problem.issueId) : null;

              // Line styling
              let lineBg = 'hover:bg-dark-cardHover/60';
              let lineNumColor = 'text-dark-dim';
              let borderLeft = 'border-l-2 border-transparent';

              if (problem?.severity === 'critical') {
                lineBg = 'bg-rose-500/10 hover:bg-rose-500/15';
                lineNumColor = 'text-rose-400 font-bold';
                borderLeft = 'border-l-2 border-rose-500';
              } else if (problem?.severity === 'medium' || problem?.severity === 'high') {
                lineBg = 'bg-amber-500/10 hover:bg-amber-500/15';
                lineNumColor = 'text-amber-400 font-bold';
                borderLeft = 'border-l-2 border-amber-500';
              } else if (problem?.severity === 'low') {
                lineBg = 'bg-blue-500/10 hover:bg-blue-500/15';
                lineNumColor = 'text-blue-400 font-bold';
                borderLeft = 'border-l-2 border-blue-400';
              }

              if (isSelectedLine) {
                lineBg += ' ring-1 ring-inset ring-brand-blue/50';
              }

              return (
                <React.Fragment key={lineNum}>
                  <div
                    className={`flex items-start group ${lineBg} ${borderLeft} transition-colors px-2 py-0.5`}
                  >
                    {/* Line Number */}
                    <div className="w-12 shrink-0 text-right pr-4 select-none">
                      <span className={`${lineNumColor} text-[11px]`}>{lineNum}</span>
                    </div>

                    {/* Problem icon badge if problem exists */}
                    <div className="w-6 shrink-0 flex items-center justify-center pt-0.5 select-none">
                      {problem && (
                        <button
                          onClick={() => setExpandedAnnotationLine(isExpanded ? null : lineNum)}
                          className="hover:scale-125 transition-transform"
                          title="Click to toggle AI finding annotation"
                        >
                          {problem.severity === 'critical' ? (
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                          ) : problem.severity === 'medium' || problem.severity === 'high' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Code Line Content */}
                    <pre className="flex-1 whitespace-pre font-mono text-[12px] text-slate-200">
                      {line}
                    </pre>
                  </div>

                  {/* Inline AI Annotation Drawer */}
                  {problem && isExpanded && issue && (
                    <div className="my-2 mx-12 p-4 rounded-xl border border-rose-500/30 bg-dark-card shadow-2xl space-y-3 animate-fade-in">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                            issue.severity === 'critical'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {issue.severity}
                          </span>
                          <span className="text-xs font-semibold text-white">
                            {issue.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-dark-dim">
                          Qwen2.5-Coder Line {lineNum}
                        </span>
                      </div>

                      <p className="text-xs text-dark-muted leading-relaxed font-sans">
                        {issue.whyItIsAProblem}
                      </p>

                      <div className="bg-dark-bg p-2.5 rounded-lg border border-dark-border">
                        <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 mb-1">
                          <span className="flex items-center gap-1 font-semibold">
                            <Sparkles className="w-3 h-3" /> Suggested Inline Replacement:
                          </span>
                          {onApplyFix && (
                            <button
                              onClick={() => onApplyFix(issue.id)}
                              className="text-emerald-300 hover:text-white flex items-center gap-1 bg-emerald-600/30 px-2 py-0.5 rounded border border-emerald-500/40"
                            >
                              <CheckCheck className="w-3 h-3" /> Apply Fix
                            </button>
                          )}
                        </div>
                        <pre className="text-[11px] font-mono text-emerald-200 whitespace-pre overflow-x-auto">
                          {issue.suggestedFixSnippet}
                        </pre>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      ) : (
        /* AI Diff Mode */
        <div className="p-4 space-y-4 max-h-[640px] overflow-y-auto bg-[#090D16]">
          <div className="p-3 rounded-lg bg-brand-purple/10 border border-brand-purple/30 text-xs text-brand-purpleLight flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>
              <strong>Qwen2.5-Coder Unified Diff View:</strong> Showing identified vulnerabilities with recommended replacements for <strong>{activeFile.filename}</strong>.
            </span>
          </div>

          {issues.filter(i => i.file === activeFile.filename).length === 0 ? (
            <div className="p-6 text-center text-dark-dim font-mono text-xs">
              No code issues flagged in this file. File is clean.
            </div>
          ) : (
            issues
              .filter(i => i.file === activeFile.filename)
              .map((issue) => (
                <div key={issue.id} className="rounded-xl border border-dark-border overflow-hidden bg-dark-card">
                  <div className="p-3 bg-dark-subtle border-b border-dark-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{issue.title}</span>
                      <span className="text-[11px] font-mono text-dark-dim">
                        Lines {issue.lineStart} - {issue.lineEnd}
                      </span>
                    </div>
                    {onApplyFix && issue.status !== 'addressed' && (
                      <button
                        onClick={() => onApplyFix(issue.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-500 transition-colors"
                      >
                        <CheckCheck className="w-3.5 h-3.5" /> Apply Patch
                      </button>
                    )}
                  </div>

                  <div className="font-mono text-xs">
                    {/* Vulnerable Original */}
                    <div className="bg-rose-950/20 border-b border-rose-900/30 p-3 text-rose-300">
                      <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider mb-1">
                        - Vulnerable Implementation
                      </div>
                      <pre className="whitespace-pre overflow-x-auto text-[11px]">
                        {issue.originalSnippet}
                      </pre>
                    </div>

                    {/* AI Fix */}
                    <div className="bg-emerald-950/20 p-3 text-emerald-300">
                      <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1">
                        + Qwen2.5-Coder Recommended Fix
                      </div>
                      <pre className="whitespace-pre overflow-x-auto text-[11px]">
                        {issue.suggestedFixSnippet}
                      </pre>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-dark-subtle/70 border-t border-dark-border px-4 py-2 flex items-center justify-between text-xs font-mono text-dark-dim">
        <div className="flex items-center gap-3">
          <span>{lines.length} lines</span>
          <span>•</span>
          <span className="capitalize">{activeFile.language}</span>
          <span>•</span>
          <span className="text-rose-400 font-semibold">
            {activeFile.problematicLines.length} flagged locations
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Syntax validated via AST parser</span>
        </div>
      </div>
    </div>
  );
};
