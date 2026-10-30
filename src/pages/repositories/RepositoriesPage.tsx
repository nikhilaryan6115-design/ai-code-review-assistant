import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FolderGit2, 
  Github, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Star, 
  GitFork, 
  GitBranch, 
  ExternalLink, 
  RefreshCw,
  X
} from 'lucide-react';

export const RepositoriesPage: React.FC = () => {
  const { repositories, toggleAutoReview, connectNewRepository } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [repoName, setRepoName] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('TypeScript');

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoName.trim()) return;
    connectNewRepository({
      name: repoName.trim(),
      description: description || 'Microservice connected to RevAI',
      language
    });
    setRepoName('');
    setDescription('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FolderGit2 className="w-6 h-6 text-brand-blue" />
            GitHub Repository Integration
          </h1>
          <p className="text-xs text-dark-muted mt-1">
            Connect GitHub repositories to automatically trigger Qwen2.5-Coder 7B on pull request opens and synchronized commits.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blueHover text-white text-xs font-semibold shadow-glow-blue transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Connect New Repository</span>
        </button>
      </div>

      {/* Repositories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {repositories.map((repo) => (
          <div
            key={repo.id}
            className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between hover:border-dark-borderLight transition-all"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Github className="w-5 h-5 text-white" />
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono hover:text-brand-blue transition-colors">
                      {repo.name}
                    </h3>
                    <p className="text-[10px] text-dark-dim font-mono">{repo.fullName}</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-dark-subtle border border-dark-border text-dark-text">
                  {repo.language}
                </span>
              </div>

              <p className="text-xs text-dark-muted mt-2 line-clamp-2">
                {repo.description}
              </p>

              <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-mono text-center">
                <div className="p-2 rounded bg-dark-subtle border border-dark-border">
                  <span className="text-dark-dim text-[10px] block">Stars</span>
                  <span className="text-white font-bold">{repo.stars}</span>
                </div>
                <div className="p-2 rounded bg-dark-subtle border border-dark-border">
                  <span className="text-dark-dim text-[10px] block">Branch</span>
                  <span className="text-brand-blue font-bold truncate block">{repo.defaultBranch}</span>
                </div>
                <div className="p-2 rounded bg-dark-subtle border border-dark-border">
                  <span className="text-dark-dim text-[10px] block">Total Scans</span>
                  <span className="text-emerald-400 font-bold">{repo.totalReviewsCount}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-dark-border/60 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={repo.autoReviewEnabled}
                  onChange={() => toggleAutoReview(repo.id)}
                  className="rounded border-dark-border text-brand-blue focus:ring-0"
                />
                <span className="text-dark-muted font-mono text-[11px]">Auto Review</span>
              </label>

              <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Healthy</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Connect Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-dark-card border border-dark-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5 text-brand-blue" />
                <h3 className="text-base font-bold text-white">Connect GitHub Repository</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-dark-dim hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-dark-muted mb-1">
                  Repository Name
                </label>
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  placeholder="e.g. billing-engine"
                  required
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-xs text-white placeholder-dark-dim font-mono focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-dark-muted mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Service description"
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-xs text-white placeholder-dark-dim font-mono focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-dark-muted mb-1">
                  Primary Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-brand-blue"
                >
                  <option value="TypeScript">TypeScript</option>
                  <option value="Python">Python</option>
                  <option value="Go">Go</option>
                  <option value="Rust">Rust</option>
                  <option value="Java">Java</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-dark-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-blue text-white text-xs font-semibold hover:bg-brand-blueHover shadow-glow-blue"
                >
                  Connect & Install Webhook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
