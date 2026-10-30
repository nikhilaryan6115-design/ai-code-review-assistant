import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FolderGit2, 
  Github, 
  Plus, 
  GitBranch, 
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
          <h1 className="text-xl sm:text-2xl font-bold text-warm-charcoal tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-wine" />
            GitHub Repository Integrations
          </h1>
          <p className="text-xs text-warm-muted mt-1">
            Connect repositories to dispatch automated pull request webhooks and AST inspections to Qwen2.5-Coder 7B.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-wine hover:bg-wine-800 text-white text-xs font-semibold shadow-wine-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Connect Repository</span>
        </button>
      </div>

      {/* Repositories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {repositories.map((repo) => (
          <div
            key={repo.id}
            className="bg-warm-white border border-warm-border rounded-xl p-5 shadow-warm-sm space-y-4 flex flex-col justify-between hover:border-warm-borderStrong transition-all"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-warm-subtle/80 border border-warm-border/60 flex items-center justify-center text-warm-charcoal">
                    <Github className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-warm-charcoal font-mono">
                      {repo.name}
                    </h3>
                    <p className="text-[10px] text-warm-muted font-mono">{repo.fullName}</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-warm-subtle border border-warm-border text-warm-charcoal">
                  {repo.language}
                </span>
              </div>

              <p className="text-xs text-warm-muted mt-3 line-clamp-2 leading-relaxed">
                {repo.description}
              </p>

              <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-mono text-center">
                <div className="p-2 rounded bg-warm-subtle/70 border border-warm-border/80">
                  <span className="text-warm-muted text-[10px] block">Stars</span>
                  <span className="text-warm-charcoal font-bold">{repo.stars}</span>
                </div>
                <div className="p-2 rounded bg-warm-subtle/70 border border-warm-border/80">
                  <span className="text-warm-muted text-[10px] block">Branch</span>
                  <span className="text-wine font-bold truncate block">{repo.defaultBranch}</span>
                </div>
                <div className="p-2 rounded bg-warm-subtle/70 border border-warm-border/80">
                  <span className="text-warm-muted text-[10px] block">Reviews</span>
                  <span className="text-emerald-800 font-bold">{repo.totalReviewsCount}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-warm-border/60 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={repo.autoReviewEnabled}
                  onChange={() => toggleAutoReview(repo.id)}
                  className="rounded border-warm-border text-wine focus:ring-0 w-3.5 h-3.5"
                />
                <span className="text-warm-charcoal font-mono text-[11px]">Auto Review</span>
              </label>

              <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
                <span>Active</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Connect Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-charcoal/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18 }}
              className="bg-warm-white border border-warm-border rounded-xl max-w-md w-full p-6 shadow-warm-dropdown space-y-4 text-warm-charcoal"
            >
              <div className="flex items-center justify-between border-b border-warm-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-wine" />
                  <h3 className="text-sm font-bold text-warm-charcoal">Connect GitHub Repository</h3>
                </div>
                <button onClick={() => setShowModal(false)} className="text-warm-dim hover:text-warm-charcoal">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConnect} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-warm-muted mb-1 font-semibold">
                    Repository Identifier
                  </label>
                  <input
                    type="text"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    placeholder="e.g. billing-microservice"
                    required
                    className="w-full bg-warm-bg border border-warm-border rounded-lg px-3 py-2 text-xs text-warm-charcoal placeholder-warm-dim font-mono focus:outline-none focus:border-wine focus:bg-warm-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-warm-muted mb-1 font-semibold">
                    Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Service description"
                    className="w-full bg-warm-bg border border-warm-border rounded-lg px-3 py-2 text-xs text-warm-charcoal placeholder-warm-dim font-sans focus:outline-none focus:border-wine focus:bg-warm-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-warm-muted mb-1 font-semibold">
                    Primary Tech Stack
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-warm-bg border border-warm-border rounded-lg px-3 py-2 text-xs text-warm-charcoal font-sans focus:outline-none focus:border-wine focus:bg-warm-white"
                  >
                    <option value="TypeScript">TypeScript / Node.js</option>
                    <option value="Python">Python / FastAPI</option>
                    <option value="Go">Go / Gin</option>
                    <option value="Rust">Rust / Tokio</option>
                    <option value="Java">Java / Spring</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-warm-border/60">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-3.5 py-1.5 text-xs text-warm-muted hover:text-warm-charcoal font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-wine text-white text-xs font-semibold hover:bg-wine-800 shadow-wine-sm"
                  >
                    Register Webhook & Connect
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
