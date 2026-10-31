import React, { useState, useEffect, useRef } from 'react';
import { 
  FolderGit2, 
  Github, 
  Plus, 
  Search, 
  Star, 
  GitFork, 
  Lock, 
  Globe, 
  ExternalLink, 
  Folder, 
  FileCode, 
  ChevronRight, 
  Sparkles, 
  Check, 
  Loader2, 
  X,
  AlertCircle,
  RefreshCw,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';

interface GitHubSearchResultItem {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  ownerAvatar: string;
  description: string;
  language: string;
  stars: number;
  isPrivate: boolean;
  defaultBranch: string;
  htmlUrl: string;
  isConnected: boolean;
}

interface TreeItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
}

export const RepositoriesPage: React.FC = () => {
  const { repositories, toggleAutoReview, connectNewRepository, addToast } = useApp();
  
  // Tab: 'connected' | 'search_github'
  const [activeTab, setActiveTab] = useState<'connected' | 'search_github'>('connected');

  // Search Bar State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GitHubSearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchTotal, setSearchTotal] = useState<number | null>(null);

  // File Tree & Code Inspection Modal
  const [inspectRepo, setInspectRepo] = useState<GitHubSearchResultItem | null>(null);
  const [treeItems, setTreeItems] = useState<TreeItem[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [isLoadingTree, setIsLoadingTree] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ path: string; filename: string; content: string } | null>(null);
  const [isAnalyzingFile, setIsAnalyzingFile] = useState(false);
  const [fileAnalysisResult, setFileAnalysisResult] = useState<any>(null);

  // Manual Connect Modal
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [manualLanguage, setManualLanguage] = useState('TypeScript');

  const debounceTimerRef = useRef<any>(null);

  // Real GitHub Search with debounce
  const executeSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchTotal(null);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const res = await fetch(`/api/repos/search?q=${encodeURIComponent(query.trim())}`);
      if (!res.ok) {
        throw new Error(`GitHub Search failed (${res.status})`);
      }
      const data = await res.json();
      setSearchResults(data.items || []);
      setSearchTotal(data.total_count || 0);
    } catch (err: any) {
      setSearchError(err.message || 'Failed to search GitHub.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      executeSearch(val);
    }, 350);
  };

  const handleConnectResult = async (repo: GitHubSearchResultItem) => {
    try {
      const res = await fetch('/api/repos/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: repo.name,
          fullName: repo.fullName,
          description: repo.description,
          language: repo.language,
          defaultBranch: repo.defaultBranch,
          isPrivate: repo.isPrivate,
          githubRepoId: repo.id,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to connect repository.');
      }

      connectNewRepository({
        name: repo.name,
        fullName: repo.fullName,
        description: repo.description,
        language: repo.language,
        stars: repo.stars,
        defaultBranch: repo.defaultBranch,
      });

      setSearchResults((prev) =>
        prev.map((item) => (item.fullName === repo.fullName ? { ...item, isConnected: true } : item))
      );

      addToast('Repository Connected', `Successfully connected ${repo.fullName} to RevAI.`, 'success');
    } catch (err: any) {
      addToast('Connection Failed', err.message || 'Could not connect repository', 'error');
    }
  };

  // Open file tree inspector
  const openTreeInspector = async (repo: GitHubSearchResultItem) => {
    setInspectRepo(repo);
    setCurrentPath('');
    setSelectedFile(null);
    setFileAnalysisResult(null);
    loadTree(repo.owner, repo.name, '', repo.defaultBranch);
  };

  const loadTree = async (owner: string, repo: string, path: string, ref: string) => {
    setIsLoadingTree(true);
    try {
      const res = await fetch(
        `/api/repos/tree?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(
          path
        )}&ref=${encodeURIComponent(ref)}`
      );
      if (!res.ok) throw new Error('Failed to load file contents.');
      const data = await res.json();
      setTreeItems(data.contents || []);
      setCurrentPath(path);
    } catch (err: any) {
      addToast('Tree Error', err.message || 'Could not fetch directory tree.', 'error');
    } finally {
      setIsLoadingTree(false);
    }
  };

  const openFile = async (item: TreeItem) => {
    if (!inspectRepo) return;
    setIsLoadingTree(true);
    setFileAnalysisResult(null);
    try {
      const res = await fetch(
        `/api/repos/file-content?owner=${encodeURIComponent(inspectRepo.owner)}&repo=${encodeURIComponent(
          inspectRepo.name
        )}&path=${encodeURIComponent(item.path)}&ref=${encodeURIComponent(inspectRepo.defaultBranch)}`
      );
      if (!res.ok) throw new Error('Failed to fetch file content.');
      const data = await res.json();
      setSelectedFile(data);
    } catch (err: any) {
      addToast('File Error', err.message || 'Could not load file content.', 'error');
    } finally {
      setIsLoadingTree(false);
    }
  };

  const analyzeCurrentFile = async () => {
    if (!inspectRepo || !selectedFile) return;
    setIsAnalyzingFile(true);
    try {
      const res = await fetch('/api/repos/analyze-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner: inspectRepo.owner,
          repo: inspectRepo.name,
          path: selectedFile.path,
          content: selectedFile.content,
          language: inspectRepo.language.toLowerCase(),
        }),
      });

      if (!res.ok) throw new Error('AI analysis failed.');
      const data = await res.json();
      setFileAnalysisResult(data.analysis);
      addToast('AI Analysis Complete', `Scanned ${selectedFile.filename} with RevAI Qwen2.5-Coder.`, 'success');
    } catch (err: any) {
      addToast('Analysis Error', err.message || 'AI review failed.', 'error');
    } finally {
      setIsAnalyzingFile(false);
    }
  };

  const handleManualConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;
    connectNewRepository({
      name: manualName.trim(),
      description: manualDescription || 'Microservice connected to RevAI',
      language: manualLanguage,
    });
    setManualName('');
    setManualDescription('');
    setShowManualModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-normal text-[#F2F4F8] tracking-tight flex items-center gap-2.5">
            <FolderGit2 className="w-5 h-5 text-editorial-brass" />
            GitHub Repository Integrations
          </h1>
          <p className="text-xs text-editorial-slate mt-1">
            Search real GitHub repositories across the internet, explore code trees, and link pull request webhooks to RevAI.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowManualModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded bg-editorial-surface hover:bg-editorial-subtle border border-editorial-border text-editorial-slate hover:text-[#F2F4F8] text-xs font-medium transition-editorial cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manual Entry</span>
          </button>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-editorial-border pb-px">
        <button
          onClick={() => setActiveTab('connected')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-editorial cursor-pointer ${
            activeTab === 'connected'
              ? 'border-editorial-brass text-editorial-brass'
              : 'border-transparent text-editorial-muted hover:text-[#F2F4F8]'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Connected Repositories ({repositories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('search_github')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-editorial cursor-pointer ${
            activeTab === 'search_github'
              ? 'border-editorial-brass text-editorial-brass'
              : 'border-transparent text-editorial-muted hover:text-[#F2F4F8]'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Search GitHub (Live API)</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-editorial-brass/20 text-editorial-brass border border-editorial-brass/30">
            Real Repos
          </span>
        </button>
      </div>

      {/* DEDICATED GITHUB SEARCH BAR VIEW */}
      {activeTab === 'search_github' && (
        <div className="space-y-6">
          {/* Search Input Box */}
          <div className="bg-editorial-surface border border-editorial-border rounded-md p-4 sm:p-5 shadow-editorial-card space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-editorial-brass font-medium">
                Live GitHub Repository Search
              </label>
              <span className="text-[10px] font-mono text-editorial-muted">
                Accepts: repo name, owner/repo, or full GitHub URL
              </span>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-editorial-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder="Search real GitHub repos... (e.g. facebook/react, expressjs/express, or https://github.com/vercel/next.js)"
                className="w-full bg-editorial-bg border border-editorial-border rounded pl-10 pr-10 py-2.5 text-xs text-[#F2F4F8] placeholder-editorial-muted font-mono focus:outline-none focus:border-editorial-brass/70 transition-editorial"
              />
              {isSearching ? (
                <Loader2 className="w-4 h-4 text-editorial-brass animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
              ) : searchQuery ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setSearchTotal(null);
                  }}
                  className="w-4 h-4 text-editorial-muted hover:text-[#F2F4F8] absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}
            </div>

            {/* Quick search pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono text-editorial-muted">
              <span>Try:</span>
              {['expressjs/express', 'facebook/react', 'vercel/next.js', 'fastapi', 'tailwindlabs/tailwindcss'].map(
                (quick) => (
                  <button
                    key={quick}
                    onClick={() => {
                      setSearchQuery(quick);
                      executeSearch(quick);
                    }}
                    className="px-2 py-0.5 rounded bg-editorial-subtle hover:bg-editorial-subtle/80 border border-editorial-border hover:border-editorial-brass/40 text-editorial-slate hover:text-editorial-brass transition-editorial cursor-pointer"
                  >
                    {quick}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Search Status & Errors */}
          {searchError && (
            <div className="p-3.5 rounded bg-red-950/40 border border-red-800/40 text-red-200 text-xs flex items-center gap-2.5 font-mono">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          {searchTotal !== null && !isSearching && (
            <div className="flex items-center justify-between text-xs font-mono text-editorial-muted">
              <span>
                Found <strong className="text-editorial-brass">{searchTotal.toLocaleString()}</strong> repositories on GitHub
              </span>
              <span>Showing top matching results</span>
            </div>
          )}

          {/* Search Results List */}
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((item) => (
                <div
                  key={item.id}
                  className="bg-editorial-surface border border-editorial-border rounded-md p-4 shadow-editorial-card flex flex-col justify-between hover:border-editorial-border/90 hover:bg-editorial-subtle/30 transition-editorial space-y-4"
                >
                  <div>
                    {/* Header: Owner Avatar + Repo Name */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.ownerAvatar}
                          alt={item.owner}
                          className="w-7 h-7 rounded border border-editorial-border shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="text-xs font-mono font-medium text-[#F2F4F8] truncate" title={item.fullName}>
                            {item.name}
                          </h3>
                          <p className="text-[10px] text-editorial-muted font-mono truncate">{item.owner}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.isPrivate ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-editorial-subtle border border-editorial-border text-editorial-muted flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Private
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-editorial-subtle border border-editorial-border text-editorial-muted flex items-center gap-1">
                            <Globe className="w-2.5 h-2.5 text-editorial-brass" /> Public
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-editorial-slate mt-2.5 line-clamp-2 leading-relaxed font-sans">
                      {item.description}
                    </p>

                    {/* Repo Metrics */}
                    <div className="flex items-center gap-3 mt-3 text-[11px] font-mono text-editorial-muted">
                      {item.language && (
                        <span className="px-1.5 py-0.2 rounded bg-editorial-subtle/60 border border-editorial-border text-editorial-slate">
                          {item.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-editorial-brass" />
                        {item.stars.toLocaleString()}
                      </span>
                      <span className="text-editorial-slate/60">•</span>
                      <span className="truncate">{item.defaultBranch}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-editorial-border flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openTreeInspector(item)}
                        className="px-2.5 py-1.5 rounded bg-editorial-subtle hover:bg-editorial-subtle/80 border border-editorial-border text-editorial-slate hover:text-[#F2F4F8] text-[11px] font-mono flex items-center gap-1.5 transition-editorial cursor-pointer"
                        title="Browse repository tree and inspect code"
                      >
                        <Folder className="w-3 h-3 text-editorial-brass" />
                        <span>Browse Files</span>
                      </button>

                      <a
                        href={item.htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-editorial-muted hover:text-[#F2F4F8] transition-editorial cursor-pointer"
                        title="View on GitHub"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {item.isConnected ? (
                      <span className="px-2.5 py-1 rounded bg-editorial-ivy/20 border border-editorial-ivy/40 text-editorial-ivy text-[11px] font-mono flex items-center gap-1">
                        <Check className="w-3 h-3" /> Connected
                      </span>
                    ) : (
                      <button
                        onClick={() => handleConnectResult(item)}
                        className="px-3 py-1.5 rounded bg-editorial-brass hover:bg-editorial-brass/90 text-editorial-bg text-[11px] font-semibold transition-editorial cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Connect</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : !isSearching && searchQuery ? (
            <div className="text-center py-12 bg-editorial-surface border border-editorial-border rounded-md p-6">
              <Github className="w-8 h-8 text-editorial-muted mx-auto mb-2 opacity-50" />
              <p className="text-sm text-[#F2F4F8] font-serif">No GitHub repositories found</p>
              <p className="text-xs text-editorial-slate mt-1 max-w-sm mx-auto">
                No matching repositories found for "{searchQuery}". Try searching by organization name (e.g. "expressjs") or paste a complete URL.
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* CONNECTED REPOSITORIES GRID VIEW */}
      {activeTab === 'connected' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {repositories.map((repo) => (
            <div
              key={repo.id}
              className="bg-editorial-surface border border-editorial-border rounded-md p-5 shadow-editorial-card space-y-4 flex flex-col justify-between hover:border-editorial-border/90 hover:bg-editorial-subtle/30 transition-editorial"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-editorial-subtle border border-editorial-border flex items-center justify-center text-editorial-brass">
                      <Github className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-mono font-medium text-[#F2F4F8]">{repo.name}</h3>
                      <p className="text-[10px] text-editorial-muted font-mono">{repo.fullName}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-editorial-subtle border border-editorial-border text-editorial-slate">
                    {repo.language}
                  </span>
                </div>

                <p className="text-xs text-editorial-slate mt-3 line-clamp-2 leading-relaxed font-sans">
                  {repo.description}
                </p>

                <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-mono text-center">
                  <div className="p-2 rounded bg-editorial-subtle/40 border border-editorial-border">
                    <span className="text-editorial-muted text-[10px] block uppercase tracking-wider">Stars</span>
                    <span className="text-[#F2F4F8] font-medium mt-0.5 block">{repo.stars}</span>
                  </div>
                  <div className="p-2 rounded bg-editorial-subtle/40 border border-editorial-border">
                    <span className="text-editorial-muted text-[10px] block uppercase tracking-wider">Branch</span>
                    <span className="text-editorial-brass font-medium truncate block mt-0.5">{repo.defaultBranch}</span>
                  </div>
                  <div className="p-2 rounded bg-editorial-subtle/40 border border-editorial-border">
                    <span className="text-editorial-muted text-[10px] block uppercase tracking-wider">Reviews</span>
                    <span className="text-editorial-ivy font-medium mt-0.5 block">{repo.totalReviewsCount}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-editorial-border flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={repo.autoReviewEnabled}
                    onChange={() => toggleAutoReview(repo.id)}
                    className="rounded border-editorial-border text-editorial-brass focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span className="text-[#F2F4F8] font-mono text-[11px]">Auto Review</span>
                </label>

                <div className="flex items-center gap-1.5 font-mono text-[11px] text-editorial-ivy">
                  <span className="w-1.5 h-1.5 rounded-full bg-editorial-ivy"></span>
                  <span>Webhook Active</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* REPOSITORY CODE TREE & FILE INSPECTION MODAL */}
      <AnimatePresence>
        {inspectRepo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E1116]/85 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.16 }}
              className="bg-editorial-surface border border-editorial-border rounded-md max-w-4xl w-full max-h-[85vh] flex flex-col shadow-dropdown text-[#F2F4F8] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-editorial-border flex items-center justify-between bg-editorial-subtle/30">
                <div className="flex items-center gap-2.5">
                  <Github className="w-4 h-4 text-editorial-brass" />
                  <div>
                    <h3 className="text-sm font-mono font-medium text-[#F2F4F8]">{inspectRepo.fullName}</h3>
                    <p className="text-[10px] font-mono text-editorial-muted">
                      Branch: <span className="text-editorial-brass">{inspectRepo.defaultBranch}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setInspectRepo(null)}
                  className="text-editorial-muted hover:text-[#F2F4F8] transition-editorial cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body: Split view between Directory Tree and File Contents */}
              <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-editorial-border">
                {/* Left Column: File Tree */}
                <div className="md:col-span-5 p-3 overflow-y-auto max-h-[65vh] space-y-1">
                  <div className="flex items-center justify-between px-2 py-1 text-[11px] font-mono text-editorial-muted border-b border-editorial-border mb-2">
                    <span>Explorer: /{currentPath}</span>
                    {currentPath && (
                      <button
                        onClick={() => {
                          const parent = currentPath.split('/').slice(0, -1).join('/');
                          loadTree(inspectRepo.owner, inspectRepo.name, parent, inspectRepo.defaultBranch);
                        }}
                        className="text-editorial-brass hover:underline cursor-pointer"
                      >
                        ..Up
                      </button>
                    )}
                  </div>

                  {isLoadingTree ? (
                    <div className="p-6 text-center text-xs font-mono text-editorial-muted flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-editorial-brass" />
                      <span>Loading GitHub tree...</span>
                    </div>
                  ) : (
                    treeItems.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => {
                          if (item.type === 'dir') {
                            loadTree(inspectRepo.owner, inspectRepo.name, item.path, inspectRepo.defaultBranch);
                          } else {
                            openFile(item);
                          }
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded hover:bg-editorial-subtle/60 flex items-center justify-between gap-2 text-xs font-mono text-editorial-slate hover:text-[#F2F4F8] transition-editorial cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 truncate">
                          {item.type === 'dir' ? (
                            <Folder className="w-3.5 h-3.5 text-editorial-brass shrink-0" />
                          ) : (
                            <FileCode className="w-3.5 h-3.5 text-editorial-slate shrink-0" />
                          )}
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.type === 'dir' && (
                          <ChevronRight className="w-3 h-3 text-editorial-muted group-hover:text-editorial-brass" />
                        )}
                      </button>
                    ))
                  )}
                </div>

                {/* Right Column: File Content & AI Review Panel */}
                <div className="md:col-span-7 flex flex-col overflow-hidden max-h-[65vh] bg-editorial-bg">
                  {selectedFile ? (
                    <>
                      {/* File Action Bar */}
                      <div className="p-3 border-b border-editorial-border flex items-center justify-between bg-editorial-subtle/40">
                        <span className="text-xs font-mono font-medium text-editorial-brass truncate">
                          {selectedFile.filename}
                        </span>

                        <button
                          onClick={analyzeCurrentFile}
                          disabled={isAnalyzingFile}
                          className="px-3 py-1.5 rounded bg-editorial-brass hover:bg-editorial-brass/90 text-editorial-bg text-xs font-semibold flex items-center gap-1.5 transition-editorial cursor-pointer disabled:opacity-50"
                        >
                          {isAnalyzingFile ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )}
                          <span>Run RevAI Analysis</span>
                        </button>
                      </div>

                      {/* AI Analysis Result Pill if available */}
                      {fileAnalysisResult && (
                        <div className="p-3 bg-editorial-subtle/50 border-b border-editorial-border space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono uppercase tracking-wider text-editorial-brass font-medium">
                              RevAI Assessment: {fileAnalysisResult.riskLevel.toUpperCase()}
                            </span>
                            <span className="text-xs font-mono font-medium text-editorial-ivy">
                              Risk Score: {fileAnalysisResult.riskScore}/100
                            </span>
                          </div>
                          <p className="text-xs text-editorial-slate leading-relaxed font-sans">
                            {fileAnalysisResult.summary}
                          </p>

                          {fileAnalysisResult.issues?.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              {fileAnalysisResult.issues.map((iss: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="p-2 rounded bg-editorial-bg border border-editorial-border text-xs space-y-1"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-mono text-red-400 font-medium">
                                      {iss.title} (Line {iss.lineStart})
                                    </span>
                                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-red-950/60 text-red-300 border border-red-800/40">
                                      {iss.severity}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-editorial-slate">{iss.explanation}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Raw Code View */}
                      <pre className="p-4 overflow-auto flex-1 text-[11px] font-mono leading-relaxed text-[#F2F4F8] bg-[#0A0D12]">
                        <code>{selectedFile.content}</code>
                      </pre>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-editorial-muted space-y-2">
                      <Code className="w-8 h-8 opacity-40 text-editorial-brass" />
                      <p className="text-xs font-mono">Select a file from the repository tree to view code and execute AI vulnerability checks.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MANUAL CONNECT MODAL */}
      <AnimatePresence>
        {showManualModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E1116]/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.16 }}
              className="bg-editorial-surface border border-editorial-border rounded-md max-w-md w-full p-6 shadow-dropdown space-y-4 text-[#F2F4F8]"
            >
              <div className="flex items-center justify-between border-b border-editorial-border pb-3">
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-editorial-brass" />
                  <h3 className="text-base font-serif font-medium text-[#F2F4F8]">Manual Repository Connection</h3>
                </div>
                <button
                  onClick={() => setShowManualModal(false)}
                  className="text-editorial-muted hover:text-[#F2F4F8] cursor-pointer transition-editorial"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleManualConnect} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-editorial-muted mb-1 font-medium">
                    Repository Identifier
                  </label>
                  <input
                    type="text"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="e.g. auth-gateway"
                    required
                    className="w-full bg-editorial-bg border border-editorial-border rounded px-3 py-2 text-xs text-[#F2F4F8] placeholder-editorial-muted font-mono focus:outline-none focus:border-editorial-brass/60 transition-editorial"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-editorial-muted mb-1 font-medium">
                    Description
                  </label>
                  <input
                    type="text"
                    value={manualDescription}
                    onChange={(e) => setManualDescription(e.target.value)}
                    placeholder="Service description"
                    className="w-full bg-editorial-bg border border-editorial-border rounded px-3 py-2 text-xs text-[#F2F4F8] placeholder-editorial-muted font-sans focus:outline-none focus:border-editorial-brass/60 transition-editorial"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-editorial-muted mb-1 font-medium">
                    Primary Tech Stack
                  </label>
                  <select
                    value={manualLanguage}
                    onChange={(e) => setManualLanguage(e.target.value)}
                    className="w-full bg-editorial-bg border border-editorial-border rounded px-3 py-2 text-xs text-[#F2F4F8] font-sans focus:outline-none focus:border-editorial-brass/60 transition-editorial"
                  >
                    <option value="TypeScript">TypeScript / Node.js</option>
                    <option value="Python">Python / FastAPI</option>
                    <option value="Go">Go / Gin</option>
                    <option value="Rust">Rust / Tokio</option>
                    <option value="Java">Java / Spring</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2.5 pt-2 border-t border-editorial-border">
                  <button
                    type="button"
                    onClick={() => setShowManualModal(false)}
                    className="px-3.5 py-1.5 text-xs text-editorial-slate hover:text-[#F2F4F8] font-medium transition-editorial cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-editorial-brass hover:bg-editorial-brass/90 text-editorial-bg text-xs font-semibold shadow-editorial-card transition-editorial cursor-pointer"
                  >
                    Connect Repository
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
