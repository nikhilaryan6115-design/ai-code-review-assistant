import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Code2, Github, Sparkles, Lock, Mail, ArrowRight } from 'lucide-react';

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
    addToast('Persona Activated', 'Viewing workspace as Sarah Jenkins (Director of Engineering).', 'success');
    navigate('/manager');
  };

  const loginAsDeveloper = () => {
    setRole('developer');
    addToast('Persona Activated', 'Viewing workspace as Rahul Sharma (Backend Engineer).', 'success');
    navigate('/developer');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-warm-white border border-warm-border rounded-2xl p-7 shadow-warm-lg space-y-6 text-warm-charcoal">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-11 h-11 mx-auto rounded-xl bg-wine flex items-center justify-center shadow-wine-sm">
            <Code2 className="w-6 h-6 text-buttercream" />
          </div>
          <h2 className="text-xl font-bold tracking-tight font-sans text-warm-charcoal">
            Rev<span className="text-wine">AI</span> Console
          </h2>
          <p className="text-xs text-warm-muted">
            Intelligent pre-review code review assistant powered by Qwen2.5-Coder 7B
          </p>
        </div>

        {/* Demo 1-Click Access Cards */}
        <div className="p-3.5 rounded-xl bg-buttercream/50 border border-warm-border space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-wine font-bold uppercase font-mono tracking-wider text-[10px] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Instant Persona Access
            </span>
            <span className="text-[10px] text-warm-muted font-mono">1-click demo</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={loginAsManager}
              className="p-3 rounded-lg bg-warm-white hover:bg-warm-subtle/80 border border-warm-border text-left transition-all shadow-warm-sm group"
            >
              <span className="text-xs font-bold text-warm-charcoal block group-hover:text-wine transition-colors">
                Manager View →
              </span>
              <span className="text-[10px] text-warm-muted block mt-0.5 leading-tight">
                Sarah Jenkins (PR triage & sign-off)
              </span>
            </button>

            <button
              type="button"
              onClick={loginAsDeveloper}
              className="p-3 rounded-lg bg-warm-white hover:bg-warm-subtle/80 border border-warm-border text-left transition-all shadow-warm-sm group"
            >
              <span className="text-xs font-bold text-warm-charcoal block group-hover:text-wine transition-colors">
                Developer View →
              </span>
              <span className="text-[10px] text-warm-muted block mt-0.5 leading-tight">
                Rahul Sharma (Findings & code patches)
              </span>
            </button>
          </div>
        </div>

        {/* GitHub SSO */}
        <button
          type="button"
          onClick={loginAsManager}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-warm-subtle/80 hover:bg-warm-subtle text-warm-charcoal text-xs font-medium border border-warm-border shadow-warm-sm transition-all"
        >
          <Github className="w-4 h-4 text-warm-charcoal" />
          <span>Continue with GitHub Organization</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-warm-border w-full"></div>
          <span className="bg-warm-white px-3 text-[10px] font-mono text-warm-dim uppercase tracking-wider absolute">
            or email
          </span>
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-warm-muted mb-1 font-medium">
              Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-warm-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="engineer@company.internal"
                className="w-full bg-warm-bg border border-warm-border rounded-lg pl-9 pr-3 py-2 text-xs text-warm-charcoal placeholder-warm-dim focus:outline-none focus:border-wine focus:bg-warm-white font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-warm-muted mb-1 font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-warm-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-warm-bg border border-warm-border rounded-lg pl-9 pr-3 py-2 text-xs text-warm-charcoal placeholder-warm-dim focus:outline-none focus:border-wine focus:bg-warm-white font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-wine hover:bg-wine-800 text-white text-xs font-semibold shadow-wine-sm transition-all"
          >
            {isRegister ? 'Create RevAI Workspace Account' : 'Sign In to Workspace'}
          </button>
        </form>

        <div className="text-center pt-1 border-t border-warm-border/60">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-warm-muted hover:text-wine font-medium transition-colors"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};
