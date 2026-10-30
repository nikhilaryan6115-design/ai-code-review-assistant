import React from 'react';
import { useApp } from '../../context/AppContext';
import { FolderGit2, GitBranch, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DeveloperRepoPage: React.FC = () => {
  const { repositories, toggleAutoReview } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-normal text-[#F2F4F8] tracking-tight flex items-center gap-2.5">
            <FolderGit2 className="w-5 h-5 text-editorial-brass" />
            Connected Developer Repositories
          </h1>
          <p className="text-xs text-editorial-slate mt-1">
            Repositories configured with automated Qwen2.5-Coder review hooks and webhook triggers.
          </p>
        </div>

        <Link
          to="/repositories"
          className="px-3.5 py-2 rounded bg-editorial-brass hover:bg-editorial-brass/90 text-editorial-bg text-xs font-semibold shadow-editorial-card transition-editorial inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Connect New Repository</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {repositories.map((repo) => (
          <div
            key={repo.id}
            className="bg-editorial-surface border border-editorial-border rounded-md p-5 shadow-editorial-card space-y-4 flex flex-col justify-between hover:border-editorial-border/90 hover:bg-editorial-subtle/30 transition-editorial"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-mono font-medium text-[#F2F4F8]">{repo.name}</h3>
                  <span className="text-[11px] text-editorial-muted font-mono">{repo.fullName}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-editorial-subtle border border-editorial-border text-editorial-slate">
                  {repo.language}
                </span>
              </div>

              <p className="text-xs text-editorial-slate mt-2 line-clamp-2 leading-relaxed font-sans">
                {repo.description}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono">
                <div className="p-2 rounded bg-editorial-subtle/40 border border-editorial-border">
                  <span className="text-editorial-muted text-[10px] block uppercase tracking-wider">Default Branch</span>
                  <span className="text-[#F2F4F8] font-medium flex items-center gap-1.5 mt-0.5">
                    <GitBranch className="w-3 h-3 text-editorial-brass" /> {repo.defaultBranch}
                  </span>
                </div>
                <div className="p-2 rounded bg-editorial-subtle/40 border border-editorial-border">
                  <span className="text-editorial-muted text-[10px] block uppercase tracking-wider">Active PRs</span>
                  <span className="text-editorial-brass font-medium mt-0.5 block">{repo.activePrsCount}</span>
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
                <span className="text-[#F2F4F8] font-mono text-[11px]">Auto AI Review</span>
              </label>

              <span className="text-[11px] font-mono text-editorial-ivy flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-editorial-ivy"></span>
                Webhook Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
