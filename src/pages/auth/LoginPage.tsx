import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Code2, Github, ShieldCheck, Sparkles, ArrowRight, Bot, Lock, Mail } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { setRole, addToast } = useApp();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRole('manager');
    addToast('Signed In', 'Welcome back to RevAI.', 'success');
    navigate('/manager');
  };

  const loginAsManager = () => {
    setRole('manager');
    addToast('Demo Mode Activated', 'Logged in as Sarah Jenkins (Director of Engineering).', 'success');
    navigate('/manager');
  };

  const loginAsDeveloper = () => {
    setRole('developer');
    addToast('Demo Mode Activated', 'Logged in as Rahul Sharma (Backend Engineer).', 'success');
    navigate('/developer');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-dark-card border border-dark-border rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center shadow-glow-blue">
            <Code2 className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-mono">
            Rev<span className="text-brand-blue">AI</span> Console
          </h2>
          <p className="text-xs text-dark-muted">
            Intelligent pre-review code assistant powered by Qwen2.5-Coder 7B
          </p>
        </div>

        {/* Demo 1-Click Access Cards */}
        <div className="p-3.5 rounded-2xl bg-dark-subtle border border-brand-blue/30 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-brand-blue font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Instant Demo Access
            </span>
            <span className="text-[10px] text-dark-dim">No password required</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={loginAsManager}
              className="p-3 rounded-xl bg-brand-blue/15 hover:bg-brand-blue/25 border border-brand-blue/40 text-left transition-all group"
            >
              <span className="text-xs font-bold text-white block group-hover:text-brand-blue transition-colors">
                Manager View →
              </span>
              <span className="text-[10px] text-dark-dim block mt-0.5">
                Sarah Jenkins (PR triage & approval)
              </span>
            </button>

            <button
              type="button"
              onClick={loginAsDeveloper}
              className="p-3 rounded-xl bg-brand-purple/15 hover:bg-brand-purple/25 border border-brand-purple/40 text-left transition-all group"
            >
              <span className="text-xs font-bold text-white block group-hover:text-brand-purpleLight transition-colors">
                Developer View →
              </span>
              <span className="text-[10px] text-dark-dim block mt-0.5">
                Rahul Sharma (PR fixes & status)
              </span>
            </button>
          </div>
        </div>

        {/* GitHub SSO */}
        <button
          type="button"
          onClick={loginAsManager}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl bg-[#24292F] hover:bg-[#2c323a] text-white text-xs font-semibold border border-dark-border shadow-md transition-all font-mono"
        >
          <Github className="w-4 h-4" />
          <span>Continue with GitHub Organization</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-dark-border w-full"></div>
          <span className="bg-dark-card px-3 text-[11px] font-mono text-dark-dim uppercase absolute">
            or email
          </span>
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-dark-dim mb-1">
              Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-dark-dim absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@company.com"
                className="w-full bg-dark-bg border border-dark-border rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-dark-dim focus:outline-none focus:border-brand-blue font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-dark-dim mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-dark-dim absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-dark-bg border border-dark-border rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-dark-dim focus:outline-none focus:border-brand-blue font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blueHover text-white text-xs font-semibold shadow-glow-blue transition-all"
          >
            {isRegister ? 'Create RevAI Account' : 'Sign In to Workspace'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-dark-muted hover:text-white transition-colors"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};
