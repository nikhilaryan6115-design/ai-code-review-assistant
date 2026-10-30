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
          <h1 className="text-xl sm:text-2xl font-bold text-nocturne-ivory tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-pumpkin" />
            Connected Developer Repositories
          </h1>
          <p className="text-xs text-nocturne-grey mt-1">
            Repositories with active automated Qwen2.5-Coder review hooks and webhook triggers.
          </p>
        </div>

        <Link
          to="/repositories"
          className="px-3.5 py-2 rounded-lg bg-pumpkin hover:bg-pumpkin-dark text-nocturne-bg text-xs font-semibold shadow-card transition-all inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Connect New Repository</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {repositories.map((repo) => (
          <div
            key={repo.id}
            className="bg-nocturne-plum border border-nocturne-border rounded-xl p-5 shadow-card space-y-4 flex flex-col justify-between hover:border-nocturne-borderSubtle transition-all"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-nocturne-ivory font-mono">{repo.name}</h3>
                  <span className="text-[11px] text-nocturne-grey font-mono">{repo.fullName}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-nocturne-charcoal border border-nocturne-border text-nocturne-ivory">
                  {repo.language}
                </span>
              </div>

              <p className="text-xs text-nocturne-grey mt-2 line-clamp-2 leading-relaxed">
                {repo.description}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono">
                <div className="p-2 rounded bg-nocturne-charcoal border border-nocturne-border">
                  <span className="text-nocturne-grey text-[10px] block">Default Branch</span>
                  <span className="text-nocturne-ivory font-semibold flex items-center gap-1">
                    <GitBranch className="w-3 h-3 text-tobacco" /> {repo.defaultBranch}
                  </span>
                </div>
                <div className="p-2 rounded bg-nocturne-charcoal border border-nocturne-border">
                  <span className="text-nocturne-grey text-[10px] block">Active PRs</span>
                  <span className="text-pumpkin font-bold">{repo.activePrsCount}</span>
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
                <span className="text-nocturne-ivory font-mono text-[11px]">Auto AI Review</span>
              </label>

              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
                Webhook Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
