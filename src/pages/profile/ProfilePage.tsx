import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, Key } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, role } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-serif font-normal text-[#F2F4F8] tracking-tight flex items-center gap-2.5">
          <User className="w-5 h-5 text-editorial-brass" />
          User Profile & Credentials
        </h1>
        <p className="text-xs text-editorial-slate mt-1">
          Manage your engineering identity, authorization tier, and automated pre-review token credentials.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-editorial-surface border border-editorial-border rounded-md p-6 shadow-editorial-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded object-cover ring-1 ring-editorial-border"
          />
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-serif font-medium text-[#F2F4F8]">{currentUser.name}</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-editorial-subtle text-editorial-brass border border-editorial-border font-medium">
                {role}
              </span>
            </div>
            <p className="text-xs text-editorial-muted font-mono mt-0.5">{currentUser.email}</p>
            <p className="text-xs text-editorial-slate font-medium mt-0.5">{currentUser.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-editorial-border text-xs font-mono">
          <div className="p-3 rounded bg-editorial-subtle/40 border border-editorial-border">
            <span className="text-editorial-muted text-[10px] block uppercase tracking-wider">Review Authorization</span>
            <span className="text-editorial-ivy font-medium mt-0.5 block">Tier 3 (Merge Rights)</span>
          </div>
          <div className="p-3 rounded bg-editorial-subtle/40 border border-editorial-border">
            <span className="text-editorial-muted text-[10px] block uppercase tracking-wider">AI Policy Scope</span>
            <span className="text-[#F2F4F8] font-medium mt-0.5 block">Org-Wide Enforced</span>
          </div>
          <div className="p-3 rounded bg-editorial-subtle/40 border border-editorial-border">
            <span className="text-editorial-muted text-[10px] block uppercase tracking-wider">Inference Engine</span>
            <span className="text-editorial-brass font-medium mt-0.5 block">Qwen2.5-Coder 7B</span>
          </div>
        </div>
      </div>

      {/* API Key Tokens */}
      <div className="bg-editorial-surface border border-editorial-border rounded-md p-6 shadow-editorial-card space-y-4">
        <div className="flex items-center justify-between border-b border-editorial-border pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-editorial-brass" />
            <h3 className="text-base font-serif font-medium text-[#F2F4F8]">Qwen2.5-Coder Inference API Key</h3>
          </div>
          <button className="text-xs font-mono text-editorial-brass font-medium hover:underline cursor-pointer">
            Rotate Key
          </button>
        </div>

        <div className="p-3 rounded bg-editorial-bg border border-editorial-border flex items-center justify-between font-mono text-xs">
          <span className="text-[#F2F4F8]">revai_live_894f29a00bca8741398d...</span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-editorial-ivy/15 text-editorial-ivy border border-editorial-ivy/30 font-medium">
            Active
          </span>
        </div>
        <p className="text-[11px] text-editorial-slate leading-relaxed font-sans">
          Used by pre-commit hooks and GitHub Actions to execute local or CI pre-reviews prior to opening pull requests.
        </p>
      </div>
    </div>
  );
};
