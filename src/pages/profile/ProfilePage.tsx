import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, Key } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, role } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-warm-charcoal tracking-tight flex items-center gap-2">
          <User className="w-5 h-5 text-wine" />
          User Profile & Credentials
        </h1>
        <p className="text-xs text-warm-muted mt-1">
          Manage your developer identity, permissions, and automated pre-review token credentials.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-warm-white border border-warm-border rounded-xl p-6 shadow-warm-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-xl object-cover ring-1 ring-warm-border"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-warm-charcoal">{currentUser.name}</h2>
              <span className="px-2 py-0.5 rounded text-xs font-mono uppercase bg-buttercream text-wine-800 border border-warm-border font-medium">
                {role}
              </span>
            </div>
            <p className="text-xs text-warm-muted font-mono mt-0.5">{currentUser.email}</p>
            <p className="text-xs text-tobacco font-medium mt-0.5">{currentUser.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-warm-border/60 text-xs font-mono">
          <div className="p-3 rounded-lg bg-warm-subtle/70 border border-warm-border/80">
            <span className="text-warm-muted text-[10px] block">Review Authorization</span>
            <span className="text-emerald-800 font-bold">Tier 3 (Merge Rights)</span>
          </div>
          <div className="p-3 rounded-lg bg-warm-subtle/70 border border-warm-border/80">
            <span className="text-warm-muted text-[10px] block">AI Policy Scope</span>
            <span className="text-warm-charcoal font-bold">Org-Wide Enforced</span>
          </div>
          <div className="p-3 rounded-lg bg-warm-subtle/70 border border-warm-border/80">
            <span className="text-warm-muted text-[10px] block">Inference Engine</span>
            <span className="text-wine font-bold">Qwen2.5-Coder 7B</span>
          </div>
        </div>
      </div>

      {/* API Key Tokens */}
      <div className="bg-warm-white border border-warm-border rounded-xl p-6 shadow-warm-sm space-y-4">
        <div className="flex items-center justify-between border-b border-warm-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-wine" />
            <h3 className="text-sm font-bold text-warm-charcoal">Qwen2.5-Coder Inference API Key</h3>
          </div>
          <button className="text-xs font-mono text-wine font-semibold hover:underline">
            Rotate Key
          </button>
        </div>

        <div className="p-3 rounded-lg bg-warm-bg border border-warm-border flex items-center justify-between font-mono text-xs">
          <span className="text-warm-charcoal">revai_live_894f29a00bca8741398d...</span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
            Active
          </span>
        </div>
        <p className="text-[11px] text-warm-muted">
          Used by pre-commit hooks and GitHub Actions to execute local or CI pre-reviews prior to opening pull requests.
        </p>
      </div>
    </div>
  );
};
