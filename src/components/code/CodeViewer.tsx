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
      <div className="bg-nocturne-plum border border-nocturne-border rounded-xl p-8 text-center text-nocturne-grey text-xs">
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
    <div className="bg-nocturne-plum border border-nocturne-border rounded-xl overflow-hidden shadow-card flex flex-col">
      {/* File Header & Tabs */}
      <div className="bg-nocturne-charcoal/70 border-b border-nocturne-border px-3 py-2 flex flex-wrap items-center justify-between gap-3">
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  isActive
                    ? 'bg-nocturne-plum text-pumpkin border border-nocturne-border font-semibold shadow-card'
                    : 'text-nocturne-grey hover:text-nocturne-ivory hover:bg-nocturne-plum/60 border border-transparent'
                }`}
              >
                <FileCode2 className={`w-3.5 h-3.5 ${isActive ? 'text-pumpkin' : 'text-nocturne-grey'}`} />
                <span>{file.filename}</span>
                {hasCritical && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Critical Issue" />
                )}
                {!hasCritical && hasWarnings && (
                  <span className="w-2 h-2 rounded-full bg-pumpkin" title="Warning" />
                )}
              </button>
            );
          })}
        </div>

        {/* View Mode controls & Copy */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-nocturne-plum border border-nocturne-border rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('standard')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                viewMode === 'standard'
                  ? 'bg-nocturne-charcoal text-nocturne-ivory font-semibold'
                  : 'text-nocturne-grey hover:text-nocturne-ivory'
              }`}
            >
              <Code className="w-3.5 h-3.5" /> Standard
            </button>
            <button
              onClick={() => setViewMode('diff')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                viewMode === 'diff'
                  ? 'bg-nocturne-charcoal text-nocturne-ivory font-semibold'
                  : 'text-nocturne-grey hover:text-nocturne-ivory'
              }`}
            >
              <Split className="w-3.5 h-3.5" /> AI Diff
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-nocturne-plum border border-nocturne-border text-xs text-nocturne-grey hover:text-nocturne-ivory hover:border-nocturne-borderSubtle transition-all cursor-pointer"
            title="Copy file contents"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline font-mono">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {viewMode === 'standard' ? (
        <div className="font-mono text-xs overflow-x-auto max-h-[620px] overflow-y-auto bg-[#0C0A0D]">
          <div className="min-w-full inline-block py-2">
            {lines.map((lineContent, index) => {
              const lineNum = index + 1;
              const problem = getProblemForLine(lineNum);
              const isSelectedIssue = problem && problem.issueId === selectedIssueId;
              const isExpandedAnnotation = expandedAnnotationLine === lineNum;
              const issue = problem ? getIssueForProblem(problem.issueId) : null;

              let lineBg = 'hover:bg-nocturne-wine/40';
              let lineIndicator = null;

              if (problem?.severity === 'critical') {
                lineBg = 'bg-red-950/30 border-l-2 border-red-500';
                lineIndicator = <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />;
              } else if (problem?.severity === 'high') {
                lineBg = 'bg-pumpkin/15 border-l-2 border-pumpkin';
                lineIndicator = <AlertTriangle className="w-3.5 h-3.5 text-pumpkin shrink-0" />;
              } else if (problem?.severity === 'medium') {
                lineBg = 'bg-amber-950/20 border-l-2 border-amber-400';
                lineIndicator = <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
              }

              if (isSelectedIssue) {
                lineBg += ' ring-1 ring-inset ring-pumpkin/50';
              }

              return (
                <React.Fragment key={lineNum}>
                  <div
                    className={`flex items-start px-3 py-0.5 group transition-colors select-text ${lineBg}`}
                  >
                    {/* Line number */}
                    <span className="w-10 shrink-0 text-right pr-4 text-[#7E7375] select-none text-[11px]">
                      {lineNum}
                    </span>

                    {/* Indicator column */}
                    <span className="w-5 shrink-0 flex items-center justify-center select-none pt-0.5">
                      {lineIndicator ? (
                        <button
                          onClick={() => setExpandedAnnotationLine(isExpandedAnnotation ? null : lineNum)}
                          className="hover:scale-125 transition-transform cursor-pointer"
                          title="Click to view AI annotation"
                        >
                          {lineIndicator}
                        </button>
                      ) : null}
                    </span>

                    {/* Code line content with crisp text */}
                    <pre className="flex-1 font-mono text-[12px] text-[#F0EBE1] whitespace-pre pl-1 leading-relaxed">
                      {lineContent || ' '}
                    </pre>
                  </div>

                  {/* Inline AI Annotation Drawer */}
                  {problem && isExpandedAnnotation && issue && (
                    <div className="mx-6 my-2 p-4 rounded-xl bg-nocturne-plum border border-nocturne-border shadow-card space-y-3 font-sans">
                      <div className="flex items-center justify-between border-b border-nocturne-border pb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${
                            problem.severity === 'critical'
                              ? 'bg-red-950/40 text-red-400 border-red-900/40'
                              : 'bg-pumpkin/15 text-pumpkin border-pumpkin/30'
                          }`}>
                            {problem.severity}
                          </span>
                          <span className="text-xs font-bold text-nocturne-ivory">
                            {issue.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-nocturne-grey">
                          Qwen2.5-Coder Flagged at Line {lineNum}
                        </span>
                      </div>

                      <p className="text-xs text-nocturne-grey leading-relaxed font-sans">
                        {issue.whyItIsAProblem}
                      </p>

                      <div className="bg-[#0F1C16] p-3 rounded-lg border border-emerald-900/40">
                        <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300 mb-1.5">
                          <span className="flex items-center gap-1 font-bold">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Suggested Inline Replacement:
                          </span>
                          {onApplyFix && (
                            <button
                              onClick={() => onApplyFix(issue.id)}
                              className="text-white font-semibold flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 rounded transition-colors cursor-pointer text-xs"
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
        <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto bg-[#0C0A0D]">
          <div className="p-3 rounded-lg bg-nocturne-plum border border-nocturne-border text-xs text-nocturne-ivory flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pumpkin shrink-0" />
            <span>
              <strong>Qwen2.5-Coder Unified Diff View:</strong> Comparing original code with AI-recommended patches for <strong>{activeFile.filename}</strong>.
            </span>
          </div>

          {issues.filter(i => i.file === activeFile.filename).length === 0 ? (
            <div className="p-6 text-center text-nocturne-grey font-mono text-xs">
              No code issues flagged in this file. File passes clean.
            </div>
          ) : (
            issues
              .filter(i => i.file === activeFile.filename)
              .map((issue) => (
                <div key={issue.id} className="rounded-xl border border-nocturne-border overflow-hidden bg-nocturne-plum shadow-card">
                  <div className="p-3 bg-nocturne-charcoal/80 border-b border-nocturne-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-nocturne-ivory">{issue.title}</span>
                      <span className="text-[11px] font-mono text-nocturne-grey">
                        Lines {issue.lineStart} - {issue.lineEnd}
                      </span>
                    </div>
                    {onApplyFix && issue.status !== 'addressed' && (
                      <button
                        onClick={() => onApplyFix(issue.id)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-colors cursor-pointer"
                      >
                        <CheckCheck className="w-3.5 h-3.5" /> Apply Patch
                      </button>
                    )}
                  </div>

                  <div className="font-mono text-xs">
                    {/* Vulnerable Original */}
                    <div className="bg-[#1C1215] border-b border-red-900/40 p-3">
                      <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1">
                        - Vulnerable Implementation
                      </div>
                      <pre className="whitespace-pre overflow-x-auto text-[11px] text-red-200">
                        {issue.originalSnippet}
                      </pre>
                    </div>

                    {/* AI Fix */}
                    <div className="bg-[#0F1C16] p-3">
                      <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1">
                        + Qwen2.5-Coder Recommended Fix
                      </div>
                      <pre className="whitespace-pre overflow-x-auto text-[11px] text-emerald-200">
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
      <div className="bg-nocturne-charcoal/70 border-t border-nocturne-border px-4 py-2 flex items-center justify-between text-xs font-mono text-nocturne-grey">
        <div className="flex items-center gap-3">
          <span>{lines.length} lines</span>
          <span>•</span>
          <span className="capitalize">{activeFile.language}</span>
          <span>•</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span>Engine: Qwen2.5-Coder 7B</span>
        </div>
      </div>
    </div>
  );
};
