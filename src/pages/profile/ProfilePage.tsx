import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, Key } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, role } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-nocturne-ivory tracking-tight flex items-center gap-2">
          <User className="w-5 h-5 text-pumpkin" />
          User Profile & Credentials
        </h1>
        <p className="text-xs text-nocturne-grey mt-1">
          Manage your developer identity, permissions, and automated pre-review token credentials.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-nocturne-plum border border-nocturne-border rounded-xl p-6 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-xl object-cover ring-1 ring-nocturne-border"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-nocturne-ivory">{currentUser.name}</h2>
              <span className="px-2 py-0.5 rounded text-xs font-mono uppercase bg-nocturne-charcoal text-pumpkin border border-nocturne-border font-medium">
                {role}
              </span>
            </div>
            <p className="text-xs text-nocturne-grey font-mono mt-0.5">{currentUser.email}</p>
            <p className="text-xs text-tobacco font-medium mt-0.5">{currentUser.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-nocturne-border text-xs font-mono">
          <div className="p-3 rounded-lg bg-nocturne-charcoal border border-nocturne-border">
            <span className="text-nocturne-grey text-[10px] block">Review Authorization</span>
            <span className="text-emerald-400 font-bold">Tier 3 (Merge Rights)</span>
          </div>
          <div className="p-3 rounded-lg bg-nocturne-charcoal border border-nocturne-border">
            <span className="text-nocturne-grey text-[10px] block">AI Policy Scope</span>
            <span className="text-nocturne-ivory font-bold">Org-Wide Enforced</span>
          </div>
          <div className="p-3 rounded-lg bg-nocturne-charcoal border border-nocturne-border">
            <span className="text-nocturne-grey text-[10px] block">Inference Engine</span>
            <span className="text-pumpkin font-bold">Qwen2.5-Coder 7B</span>
          </div>
        </div>
      </div>

      {/* API Key Tokens */}
      <div className="bg-nocturne-plum border border-nocturne-border rounded-xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-nocturne-border pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-pumpkin" />
            <h3 className="text-sm font-bold text-nocturne-ivory">Qwen2.5-Coder Inference API Key</h3>
          </div>
          <button className="text-xs font-mono text-pumpkin font-semibold hover:underline">
            Rotate Key
          </button>
        </div>

        <div className="p-3 rounded-lg bg-nocturne-bg border border-nocturne-border flex items-center justify-between font-mono text-xs">
          <span className="text-nocturne-ivory">revai_live_894f29a00bca8741398d...</span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 font-medium">
            Active
          </span>
        </div>
        <p className="text-[11px] text-nocturne-grey">
          Used by pre-commit hooks and GitHub Actions to execute local or CI pre-reviews prior to opening pull requests.
        </p>
      </div>
    </div>
  );
};
