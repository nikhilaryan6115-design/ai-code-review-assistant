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
          <h1 className="text-xl sm:text-2xl font-serif font-normal text-[#F2F4F8] tracking-tight flex items-center gap-2.5">
            <FolderGit2 className="w-5 h-5 text-editorial-brass" />
            GitHub Repository Integrations
          </h1>
          <p className="text-xs text-editorial-slate mt-1">
            Connect repositories to dispatch automated pull request webhooks and AST inspections to Qwen2.5-Coder.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded bg-editorial-brass hover:bg-editorial-brass/90 text-editorial-bg text-xs font-semibold shadow-editorial-card transition-editorial cursor-pointer"
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
            className="bg-editorial-surface border border-editorial-border rounded-md p-5 shadow-editorial-card space-y-4 flex flex-col justify-between hover:border-editorial-border/90 hover:bg-editorial-subtle/30 transition-editorial"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-editorial-subtle border border-editorial-border flex items-center justify-center text-editorial-brass">
                    <Github className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-medium text-[#F2F4F8]">
                      {repo.name}
                    </h3>
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
                <span>Active</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Connect Modal */}
      <AnimatePresence>
        {showModal && (
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
                  <h3 className="text-base font-serif font-medium text-[#F2F4F8]">Connect GitHub Repository</h3>
                </div>
                <button onClick={() => setShowModal(false)} className="text-editorial-muted hover:text-[#F2F4F8] cursor-pointer transition-editorial">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConnect} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-editorial-muted mb-1 font-medium">
                    Repository Identifier
                  </label>
                  <input
                    type="text"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    placeholder="e.g. billing-microservice"
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Service description"
                    className="w-full bg-editorial-bg border border-editorial-border rounded px-3 py-2 text-xs text-[#F2F4F8] placeholder-editorial-muted font-sans focus:outline-none focus:border-editorial-brass/60 transition-editorial"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-editorial-muted mb-1 font-medium">
                    Primary Tech Stack
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
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
                    onClick={() => setShowModal(false)}
                    className="px-3.5 py-1.5 text-xs text-editorial-slate hover:text-[#F2F4F8] font-medium transition-editorial cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-editorial-brass hover:bg-editorial-brass/90 text-editorial-bg text-xs font-semibold shadow-editorial-card transition-editorial cursor-pointer"
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
