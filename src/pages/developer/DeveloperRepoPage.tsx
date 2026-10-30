import React from 'react';
import { useApp } from '../../context/AppContext';
import { FolderGit2, GitBranch, ExternalLink, ShieldCheck, Zap, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DeveloperRepoPage: React.FC = () => {
  const { repositories, toggleAutoReview } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FolderGit2 className="w-6 h-6 text-brand-purple" />
            Connected Developer Repositories
          </h1>
          <p className="text-xs text-dark-muted mt-1">
            Repositories with active automated Qwen2.5-Coder review hooks and webhook triggers.
          </p>
        </div>

        <Link
          to="/repositories"
          className="px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple/90 text-white text-xs font-semibold shadow-md transition-all inline-flex items-center gap-1.5"
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Connect New GitHub Repo</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {repositories.map((repo) => (
          <div
            key={repo.id}
            className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">{repo.name}</h3>
                  <span className="text-[11px] text-dark-dim font-mono">{repo.fullName}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-dark-subtle border border-dark-border text-dark-text">
                  {repo.language}
                </span>
              </div>

              <p className="text-xs text-dark-muted mt-2 line-clamp-2">
                {repo.description}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono">
                <div className="p-2 rounded bg-dark-subtle border border-dark-border">
                  <span className="text-dark-dim text-[10px] block">Default Branch</span>
                  <span className="text-white flex items-center gap-1">
                    <GitBranch className="w-3 h-3 text-brand-blue" /> {repo.defaultBranch}
                  </span>
                </div>
                <div className="p-2 rounded bg-dark-subtle border border-dark-border">
                  <span className="text-dark-dim text-[10px] block">Active PRs</span>
                  <span className="text-brand-purpleLight font-bold">{repo.activePrsCount}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-dark-border/60 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={repo.autoReviewEnabled}
                  onChange={() => toggleAutoReview(repo.id)}
                  className="rounded border-dark-border text-brand-purple focus:ring-0"
                />
                <span className="text-dark-muted font-mono text-[11px]">Auto AI Review</span>
              </label>

              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Webhook Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
