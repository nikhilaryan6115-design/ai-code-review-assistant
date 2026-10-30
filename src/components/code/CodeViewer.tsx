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
  CheckCheck
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
      <div className="bg-warm-white border border-warm-border rounded-xl p-8 text-center text-warm-muted text-xs">
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
    <div className="bg-warm-white border border-warm-border rounded-xl overflow-hidden shadow-warm-sm flex flex-col">
      {/* File Header & Tabs */}
      <div className="bg-warm-subtle/80 border-b border-warm-border px-3 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* File Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
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
                    ? 'bg-warm-white text-wine-900 border border-warm-borderStrong shadow-warm-sm font-semibold'
                    : 'text-warm-muted hover:text-warm-charcoal hover:bg-warm-white/60 border border-transparent'
                }`}
              >
                <FileCode2 className={`w-3.5 h-3.5 ${isActive ? 'text-wine' : 'text-tobacco'}`} />
                <span>{file.filename}</span>
                {hasCritical && (
                  <span className="w-2 h-2 rounded-full bg-red-700 animate-pulse" title="Critical Issue" />
                )}
                {!hasCritical && hasWarnings && (
                  <span className="w-2 h-2 rounded-full bg-amber-600" title="Warning" />
                )}
              </button>
            );
          })}
        </div>

        {/* View Mode controls & Copy */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-warm-white border border-warm-border rounded-lg p-0.5 shadow-warm-sm">
            <button
              onClick={() => setViewMode('standard')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                viewMode === 'standard'
                  ? 'bg-buttercream text-wine font-semibold'
                  : 'text-warm-muted hover:text-warm-charcoal'
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
                  ? 'bg-buttercream text-wine font-semibold'
                  : 'text-warm-muted hover:text-warm-charcoal'
              }`}
              title="AI Diff Suggestion View"
            >
              <Split className="w-3.5 h-3.5" />
              <span>AI Patch Diff</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-warm-white border border-warm-border text-xs font-mono text-warm-charcoal hover:bg-warm-subtle transition-colors shadow-warm-sm"
            title="Copy full source file"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5 text-tobacco" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Code Area */}
      {viewMode === 'standard' ? (
        <div className="overflow-x-auto max-h-[600px] font-mono text-xs leading-relaxed select-text bg-[#241C1E] text-[#FBF6EC]">
          <div className="min-w-full inline-block py-2">
            {lines.map((line, index) => {
              const lineNum = index + 1;
              const problem = getProblemForLine(lineNum);
              const isSelectedLine = problem && problem.issueId === selectedIssueId;
              const isExpanded = expandedAnnotationLine === lineNum;
              const issue = problem ? getIssueForProblem(problem.issueId) : null;

              // Line styling
              let lineBg = 'hover:bg-[#32272A]';
              let lineNumColor = 'text-[#7D6B70]';
              let borderLeft = 'border-l-2 border-transparent';

              if (problem?.severity === 'critical') {
                lineBg = 'bg-[#4A1D24]/70 hover:bg-[#4A1D24]';
                lineNumColor = 'text-[#FCA5A5] font-bold';
                borderLeft = 'border-l-2 border-[#EF4444]';
              } else if (problem?.severity === 'medium' || problem?.severity === 'high') {
                lineBg = 'bg-[#4A3219]/60 hover:bg-[#4A3219]';
                lineNumColor = 'text-[#FCD34D] font-bold';
                borderLeft = 'border-l-2 border-[#F59E0B]';
              } else if (problem?.severity === 'low') {
                lineBg = 'bg-[#3A3022]/60 hover:bg-[#3A3022]';
                lineNumColor = 'text-[#E2D1BE] font-bold';
                borderLeft = 'border-l-2 border-[#987653]';
              }

              if (isSelectedLine) {
                lineBg += ' ring-1 ring-inset ring-wine-400';
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

                    {/* Problem icon badge */}
                    <div className="w-6 shrink-0 flex items-center justify-center pt-0.5 select-none">
                      {problem && (
                        <button
                          onClick={() => setExpandedAnnotationLine(isExpanded ? null : lineNum)}
                          className="hover:scale-125 transition-transform"
                          title="Click to toggle AI finding annotation"
                        >
                          {problem.severity === 'critical' ? (
                            <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                          ) : problem.severity === 'medium' || problem.severity === 'high' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-tobacco-300" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Code Line Content */}
                    <pre className="flex-1 whitespace-pre font-mono text-[12px] text-[#F3EDE4]">
                      {line}
                    </pre>
                  </div>

                  {/* Inline AI Annotation Drawer */}
                  {problem && isExpanded && issue && (
                    <div className="my-2 mx-8 p-4 rounded-xl border border-red-300/40 bg-warm-white text-warm-charcoal shadow-warm-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                            issue.severity === 'critical'
                              ? 'bg-red-50 text-red-800 border border-red-200'
                              : 'bg-amber-50 text-amber-900 border border-amber-300'
                          }`}>
                            {issue.severity}
                          </span>
                          <span className="text-xs font-bold text-warm-charcoal">
                            {issue.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-warm-muted">
                          Qwen2.5-Coder Flagged at Line {lineNum}
                        </span>
                      </div>

                      <p className="text-xs text-warm-muted leading-relaxed font-sans">
                        {issue.whyItIsAProblem}
                      </p>

                      <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-200">
                        <div className="flex items-center justify-between text-[11px] font-mono text-emerald-900 mb-1.5">
                          <span className="flex items-center gap-1 font-bold">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Suggested Inline Replacement:
                          </span>
                          {onApplyFix && (
                            <button
                              onClick={() => onApplyFix(issue.id)}
                              className="text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 transition-colors"
                            >
                              <CheckCheck className="w-3 h-3" /> Apply Fix
                            </button>
                          )}
                        </div>
                        <pre className="text-[11px] font-mono text-emerald-950 whitespace-pre overflow-x-auto">
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
        <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto bg-warm-bg/50">
          <div className="p-3 rounded-lg bg-buttercream/80 border border-warm-border text-xs text-warm-charcoal flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-wine shrink-0" />
            <span>
              <strong>Qwen2.5-Coder Unified Diff View:</strong> Comparing original code with AI-recommended patches for <strong>{activeFile.filename}</strong>.
            </span>
          </div>

          {issues.filter(i => i.file === activeFile.filename).length === 0 ? (
            <div className="p-6 text-center text-warm-muted font-mono text-xs">
              No code issues flagged in this file. File passes clean.
            </div>
          ) : (
            issues
              .filter(i => i.file === activeFile.filename)
              .map((issue) => (
                <div key={issue.id} className="rounded-xl border border-warm-border overflow-hidden bg-warm-white shadow-warm-sm">
                  <div className="p-3 bg-warm-subtle/70 border-b border-warm-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-warm-charcoal">{issue.title}</span>
                      <span className="text-[11px] font-mono text-warm-muted">
                        Lines {issue.lineStart} - {issue.lineEnd}
                      </span>
                    </div>
                    {onApplyFix && issue.status !== 'addressed' && (
                      <button
                        onClick={() => onApplyFix(issue.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors"
                      >
                        <CheckCheck className="w-3.5 h-3.5" /> Apply Patch
                      </button>
                    )}
                  </div>

                  <div className="font-mono text-xs">
                    {/* Vulnerable Original */}
                    <div className="bg-red-50/70 border-b border-red-200 p-3 text-red-950">
                      <div className="text-[10px] text-red-700 font-bold uppercase tracking-wider mb-1">
                        - Vulnerable Implementation
                      </div>
                      <pre className="whitespace-pre overflow-x-auto text-[11px]">
                        {issue.originalSnippet}
                      </pre>
                    </div>

                    {/* AI Fix */}
                    <div className="bg-emerald-50/70 p-3 text-emerald-950">
                      <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider mb-1">
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
      <div className="bg-warm-subtle/80 border-t border-warm-border px-4 py-2 flex items-center justify-between text-xs font-mono text-warm-muted">
        <div className="flex items-center gap-3">
          <span>{lines.length} lines</span>
          <span>•</span>
          <span className="capitalize">{activeFile.language}</span>
          <span>•</span>
          <span className="text-red-700 font-semibold">
            {activeFile.problematicLines.length} flagged locations
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
          <span>AST parser verified</span>
        </div>
      </div>
    </div>
  );
};
