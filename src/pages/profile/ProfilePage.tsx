import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, Mail, Shield, Key, GitCommit, CheckCircle2, Bot } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, role } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <User className="w-6 h-6 text-brand-blue" />
          User Profile & Security Keys
        </h1>
        <p className="text-xs text-dark-muted mt-1">
          Manage your developer identity, roles, permissions, and automated token credentials.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-brand-blue/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono uppercase bg-brand-blue/15 text-brand-blue border border-brand-blue/30">
                {role}
              </span>
            </div>
            <p className="text-xs text-dark-muted font-mono mt-1">{currentUser.email}</p>
            <p className="text-xs text-brand-purpleLight font-medium mt-0.5">{currentUser.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-dark-border/60 text-xs font-mono">
          <div className="p-3 rounded-xl bg-dark-subtle border border-dark-border">
            <span className="text-dark-dim text-[10px] block">Review Authorization</span>
            <span className="text-emerald-400 font-bold">Level 3 (Merge Rights)</span>
          </div>
          <div className="p-3 rounded-xl bg-dark-subtle border border-dark-border">
            <span className="text-dark-dim text-[10px] block">AI Policy Scope</span>
            <span className="text-white font-bold">Org-Wide Enforced</span>
          </div>
          <div className="p-3 rounded-xl bg-dark-subtle border border-dark-border">
            <span className="text-dark-dim text-[10px] block">Primary Model</span>
            <span className="text-brand-purpleLight font-bold">Qwen2.5-Coder 7B</span>
          </div>
        </div>
      </div>

      {/* API Key Tokens */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-dark-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-brand-blue" />
            <h3 className="text-sm font-bold text-white">Qwen2.5-Coder Inference API Key</h3>
          </div>
          <button className="text-xs font-mono text-brand-blue hover:underline">
            Rotate Key
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border flex items-center justify-between font-mono text-xs">
          <span className="text-dark-dim">revai_live_894f29a00bca8741398d...</span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Active
          </span>
        </div>
        <p className="text-[11px] text-dark-muted">
          Use this token in your GitHub Actions workflow or pre-commit hook to trigger local reviews before pushing.
        </p>
      </div>
    </div>
  );
};
