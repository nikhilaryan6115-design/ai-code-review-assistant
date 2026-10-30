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
          <h1 className="text-xl sm:text-2xl font-bold text-nocturne-ivory tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-pumpkin" />
            GitHub Repository Integrations
          </h1>
          <p className="text-xs text-nocturne-grey mt-1">
            Connect repositories to dispatch automated pull request webhooks and AST inspections to Qwen2.5-Coder 7B.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-pumpkin hover:bg-pumpkin-dark text-nocturne-bg text-xs font-semibold shadow-card transition-all"
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
            className="bg-nocturne-plum border border-nocturne-border rounded-xl p-5 shadow-card space-y-4 flex flex-col justify-between hover:border-nocturne-borderSubtle transition-all"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-nocturne-charcoal border border-nocturne-border flex items-center justify-center text-nocturne-ivory">
                    <Github className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-nocturne-ivory font-mono">
                      {repo.name}
                    </h3>
                    <p className="text-[10px] text-nocturne-grey font-mono">{repo.fullName}</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-nocturne-charcoal border border-nocturne-border text-nocturne-ivory">
                  {repo.language}
                </span>
              </div>

              <p className="text-xs text-nocturne-grey mt-3 line-clamp-2 leading-relaxed">
                {repo.description}
              </p>

              <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-mono text-center">
                <div className="p-2 rounded bg-nocturne-charcoal border border-nocturne-border">
                  <span className="text-nocturne-grey text-[10px] block">Stars</span>
                  <span className="text-nocturne-ivory font-bold">{repo.stars}</span>
                </div>
                <div className="p-2 rounded bg-nocturne-charcoal border border-nocturne-border">
                  <span className="text-nocturne-grey text-[10px] block">Branch</span>
                  <span className="text-pumpkin font-bold truncate block">{repo.defaultBranch}</span>
                </div>
                <div className="p-2 rounded bg-nocturne-charcoal border border-nocturne-border">
                  <span className="text-nocturne-grey text-[10px] block">Reviews</span>
                  <span className="text-emerald-400 font-bold">{repo.totalReviewsCount}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-nocturne-border flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={repo.autoReviewEnabled}
                  onChange={() => toggleAutoReview(repo.id)}
                  className="rounded border-nocturne-border text-pumpkin focus:ring-0 w-3.5 h-3.5"
                />
                <span className="text-nocturne-ivory font-mono text-[11px]">Auto Review</span>
              </label>

              <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
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
              className="bg-nocturne-plum border border-nocturne-border rounded-xl max-w-md w-full p-6 shadow-dropdown space-y-4 text-nocturne-ivory"
            >
              <div className="flex items-center justify-between border-b border-nocturne-border pb-3">
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-pumpkin" />
                  <h3 className="text-sm font-bold text-nocturne-ivory">Connect GitHub Repository</h3>
                </div>
                <button onClick={() => setShowModal(false)} className="text-nocturne-grey/60 hover:text-nocturne-ivory">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConnect} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-nocturne-grey mb-1 font-semibold">
                    Repository Identifier
                  </label>
                  <input
                    type="text"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    placeholder="e.g. billing-microservice"
                    required
                    className="w-full bg-nocturne-bg border border-nocturne-border rounded-lg px-3 py-2 text-xs text-nocturne-ivory placeholder-nocturne-grey font-mono focus:outline-none focus:border-wine focus:bg-nocturne-plum"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-nocturne-grey mb-1 font-semibold">
                    Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Service description"
                    className="w-full bg-nocturne-bg border border-nocturne-border rounded-lg px-3 py-2 text-xs text-nocturne-ivory placeholder-nocturne-grey font-sans focus:outline-none focus:border-wine focus:bg-nocturne-plum"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-nocturne-grey mb-1 font-semibold">
                    Primary Tech Stack
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-nocturne-bg border border-nocturne-border rounded-lg px-3 py-2 text-xs text-nocturne-ivory font-sans focus:outline-none focus:border-wine focus:bg-nocturne-plum"
                  >
                    <option value="TypeScript">TypeScript / Node.js</option>
                    <option value="Python">Python / FastAPI</option>
                    <option value="Go">Go / Gin</option>
                    <option value="Rust">Rust / Tokio</option>
                    <option value="Java">Java / Spring</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-nocturne-border">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-3.5 py-1.5 text-xs text-nocturne-grey hover:text-nocturne-ivory font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-pumpkin hover:bg-pumpkin-dark text-nocturne-bg text-xs font-semibold shadow-card"
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
