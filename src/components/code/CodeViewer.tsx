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
  CheckCheck,
  RefreshCw,
  GitCommitHorizontal
} from 'lucide-react';

interface Props {
  codeFiles: CodeFile[];
  issues: Issue[];
  selectedIssueId?: string;
  onApplyFix?: (issueId: string) => void;
  onRetry?: () => void;
}

export const CodeViewer: React.FC<Props> = ({
  codeFiles,
  issues,
  selectedIssueId,
  onApplyFix,
  onRetry
}) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'standard' | 'diff'>('standard');
  const [expandedAnnotationLine, setExpandedAnnotationLine] = useState<number | null>(42);

  const activeFile = codeFiles[activeFileIndex] || codeFiles[0];

  if (!activeFile) {
    return (
      <div className="bg-[#161B22] border border-[#2E3643] rounded overflow-hidden shadow-sm">
        {/* Header bar */}
        <div className="bg-[#1D232C] border-b border-[#2E3643] px-4 py-2.5 flex items-center gap-2">
          <GitCommitHorizontal className="w-4 h-4 text-[#C5A059]" />
          <span className="text-xs font-mono text-[#96A0B0]">Code Inspector</span>
        </div>
        <div className="p-10 text-center space-y-4">
          <div className="w-10 h-10 mx-auto rounded bg-[#1D232C] border border-[#2E3643] flex items-center justify-center">
            <FileCode2 className="w-5 h-5 text-[#96A0B0]" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-serif font-medium text-[#F2F4F8]">No Code Files Loaded</h3>
            <p className="text-xs text-[#96A0B0] max-w-xs mx-auto leading-relaxed">
              Code file content could not be retrieved for this submission. This may occur if the pull request 
              was created before repository integration was configured, or if the GitHub token lacks read access.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-1">
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1D232C] border border-[#2E3643] text-xs font-mono text-[#F2F4F8] hover:bg-[#252D38] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#C5A059]" />
                Retry
              </button>
            )}
          </div>
        </div>
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
    <div className="bg-[#161B22] border border-[#2E3643] rounded overflow-hidden shadow-sm flex flex-col">
      {/* File Header & Tabs */}
      <div className="bg-[#1D232C] border-b border-[#2E3643] px-3 py-2 flex flex-wrap items-center justify-between gap-3">
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#161B22] text-[#F2F4F8] border border-[#2E3643] font-medium shadow-sm'
                    : 'text-[#96A0B0] hover:text-[#F2F4F8] hover:bg-[#161B22]/50 border border-transparent'
                }`}
              >
                <FileCode2 className={`w-3.5 h-3.5 ${isActive ? 'text-[#C5A059]' : 'text-[#96A0B0]'}`} />
                <span>{file.filename}</span>
                {hasCritical && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A63232]" title="Critical Issue" />
                )}
                {!hasCritical && hasWarnings && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B7791F]" title="Warning" />
                )}
              </button>
            );
          })}
        </div>

        {/* View Mode controls & Copy */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-[#0E1116] border border-[#2E3643] rounded p-0.5">
            <button
              onClick={() => setViewMode('standard')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                viewMode === 'standard'
                  ? 'bg-[#1A2332] text-[#F2F4F8] font-medium'
                  : 'text-[#96A0B0] hover:text-[#F2F4F8]'
              }`}
            >
              <Code className="w-3.5 h-3.5" /> Source
            </button>
            <button
              onClick={() => setViewMode('diff')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                viewMode === 'diff'
                  ? 'bg-[#1A2332] text-[#F2F4F8] font-medium'
                  : 'text-[#96A0B0] hover:text-[#F2F4F8]'
              }`}
            >
              <Split className="w-3.5 h-3.5" /> Diff
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#161B22] border border-[#2E3643] text-xs text-[#96A0B0] hover:text-[#F2F4F8] hover:border-[#3E495B] transition-colors cursor-pointer"
            title="Copy file contents"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#2D6A4F]" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline font-mono">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {viewMode === 'standard' ? (
        <div className="font-mono text-xs overflow-x-auto max-h-[620px] overflow-y-auto bg-[#0C0F14]">
          <div className="min-w-full inline-block py-2">
            {lines.map((lineContent, index) => {
              const lineNum = index + 1;
              const problem = getProblemForLine(lineNum);
              const isSelectedIssue = problem && problem.issueId === selectedIssueId;
              const isExpandedAnnotation = expandedAnnotationLine === lineNum;
              const issue = problem ? getIssueForProblem(problem.issueId) : null;

              let lineBg = 'hover:bg-[#161B22]/60';
              let lineIndicator = null;

              if (problem?.severity === 'critical') {
                lineBg = 'bg-[#A63232]/10 border-l-2 border-[#A63232]';
                lineIndicator = <ShieldAlert className="w-3.5 h-3.5 text-[#E06C75] shrink-0" />;
              } else if (problem?.severity === 'high') {
                lineBg = 'bg-[#B7791F]/10 border-l-2 border-[#B7791F]';
                lineIndicator = <AlertTriangle className="w-3.5 h-3.5 text-[#D4AF67] shrink-0" />;
              } else if (problem?.severity === 'medium') {
                lineBg = 'bg-[#C5A059]/10 border-l-2 border-[#C5A059]';
                lineIndicator = <AlertTriangle className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />;
              }

              if (isSelectedIssue) {
                lineBg += ' ring-1 ring-inset ring-[#C5A059]/40';
              }

              return (
                <React.Fragment key={lineNum}>
                  <div
                    className={`flex items-start px-3 py-0.5 group transition-colors select-text ${lineBg}`}
                  >
                    {/* Line number */}
                    <span className="w-10 shrink-0 text-right pr-4 text-[#687487] select-none text-[11px]">
                      {lineNum}
                    </span>

                    {/* Indicator column */}
                    <span className="w-5 shrink-0 flex items-center justify-center select-none pt-0.5">
                      {lineIndicator ? (
                        <button
                          onClick={() => setExpandedAnnotationLine(isExpandedAnnotation ? null : lineNum)}
                          className="hover:scale-110 transition-transform cursor-pointer"
                          title="View finding annotation"
                        >
                          {lineIndicator}
                        </button>
                      ) : null}
                    </span>

                    {/* Code line content */}
                    <pre className="flex-1 font-mono text-[12px] text-[#F2F4F8] whitespace-pre pl-1 leading-relaxed">
                      {lineContent || ' '}
                    </pre>
                  </div>

                  {/* Inline AI Annotation Drawer */}
                  {problem && isExpandedAnnotation && issue && (
                    <div className="mx-6 my-2 p-4 rounded bg-[#161B22] border border-[#2E3643] shadow-sm space-y-3 font-sans">
                      <div className="flex items-center justify-between border-b border-[#2E3643] pb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded border ${
                            problem.severity === 'critical'
                              ? 'bg-[#A63232]/15 text-[#E06C75] border-[#A63232]/35'
                              : 'bg-[#B7791F]/15 text-[#D4AF67] border-[#B7791F]/35'
                          }`}>
                            {problem.severity}
                          </span>
                          <span className="text-xs font-serif font-medium text-[#F2F4F8]">
                            {issue.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#96A0B0]">
                          Line {lineNum} Flagged
                        </span>
                      </div>

                      <p className="text-xs text-[#96A0B0] leading-relaxed font-sans">
                        {issue.whyItIsAProblem}
                      </p>

                      <div className="bg-[#0F1A15] p-3 rounded border border-[#2D6A4F]/30">
                        <div className="flex items-center justify-between text-[11px] font-mono text-[#4EAA78] mb-1.5">
                          <span className="flex items-center gap-1 font-semibold">
                            <Sparkles className="w-3.5 h-3.5 text-[#4EAA78]" /> Suggested Inline Replacement:
                          </span>
                          {onApplyFix && (
                            <button
                              onClick={() => onApplyFix(issue.id)}
                              className="text-[#0E1116] font-semibold flex items-center gap-1 bg-[#2D6A4F] hover:bg-[#387F60] text-white px-2.5 py-0.5 rounded transition-colors cursor-pointer text-xs"
                            >
                              <CheckCheck className="w-3 h-3" /> Apply Fix
                            </button>
                          )}
                        </div>
                        <pre className="text-[11px] font-mono text-[#BCEAD0] whitespace-pre overflow-x-auto">
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
        /* Unified Diff Mode */
        <div className="max-h-[660px] overflow-y-auto bg-[#0C0F14]">
          {/* If we have a raw patch from GitHub, render it line-by-line */}
          {activeFile.patch ? (
            <div className="font-mono text-[12px]">
              {activeFile.patch.split('\n').map((line, idx) => {
                let bg = '';
                let color = '#96A0B0';
                let prefix = line[0];
                if (prefix === '+') {
                  bg = 'bg-[#0F1A15]';
                  color = '#4EAA78';
                } else if (prefix === '-') {
                  bg = 'bg-[#1A1215]';
                  color = '#E06C75';
                } else if (line.startsWith('@@')) {
                  bg = 'bg-[#1A2332]';
                  color = '#C5A059';
                }
                return (
                  <div
                    key={idx}
                    className={`flex px-3 py-px leading-5 ${bg}`}
                    style={{ color }}
                  >
                    <span className="w-6 shrink-0 text-right pr-3 text-[#687487] select-none text-[11px]">
                      {idx + 1}
                    </span>
                    <pre className="whitespace-pre flex-1 overflow-x-auto">{line || ' '}</pre>
                  </div>
                );
              })}
            </div>
          ) : issues.filter(i => i.file === activeFile.filename).length === 0 ? (
            <div className="p-6 text-center text-[#96A0B0] font-mono text-xs">
              No code issues flagged in this file. File passes clean.
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <div className="p-3 rounded bg-[#161B22] border border-[#2E3643] text-xs text-[#F2F4F8] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>
                  <strong>Unified Diff Inspection:</strong> AI-recommended patches for <strong>{activeFile.filename}</strong>.
                </span>
              </div>
              {issues
                .filter(i => i.file === activeFile.filename)
                .map((issue) => (
                  <div key={issue.id} className="rounded border border-[#2E3643] overflow-hidden bg-[#161B22]">
                    <div className="p-3 bg-[#1D232C] border-b border-[#2E3643] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-serif font-medium text-[#F2F4F8]">{issue.title}</span>
                        <span className="text-[11px] font-mono text-[#96A0B0]">
                          Lines {issue.lineStart} - {issue.lineEnd}
                        </span>
                      </div>
                      {onApplyFix && issue.status !== 'addressed' && (
                        <button
                          onClick={() => onApplyFix(issue.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1A2332] border border-[#2E3643] text-[#F2F4F8] text-xs font-medium hover:bg-[#233045] transition-colors cursor-pointer"
                        >
                          <CheckCheck className="w-3.5 h-3.5 text-[#C5A059]" /> Apply Patch
                        </button>
                      )}
                    </div>

                    <div className="font-mono text-xs">
                      <div className="bg-[#1A1215] border-b border-[#2E3643] p-3">
                        <div className="text-[10px] text-[#E06C75] font-semibold uppercase tracking-wider mb-1">
                          - Vulnerable Implementation
                        </div>
                        <pre className="whitespace-pre overflow-x-auto text-[11px] text-[#F2B5BC]">
                          {issue.originalSnippet}
                        </pre>
                      </div>

                      <div className="bg-[#0F1A15] p-3">
                        <div className="text-[10px] text-[#4EAA78] font-semibold uppercase tracking-wider mb-1">
                          + Recommended Fix
                        </div>
                        <pre className="whitespace-pre overflow-x-auto text-[11px] text-[#BCEAD0]">
                          {issue.suggestedFixSnippet}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-[#1D232C] border-t border-[#2E3643] px-4 py-2 flex items-center justify-between text-xs font-mono text-[#96A0B0]">
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
