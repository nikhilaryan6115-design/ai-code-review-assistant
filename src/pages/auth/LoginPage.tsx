import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Github, Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { CrescentMoonSVG } from '../../components/halloween/MoonSVG';
import { PumpkinSVG } from '../../components/halloween/PumpkinSVG';

export const LoginPage: React.FC = () => {
  const { setRole, addToast } = useApp();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRole('manager');
    addToast('Signed In', 'Welcome to RevAI workspace.', 'success');
    navigate('/manager');
  };

  const loginAsManager = () => {
    setRole('manager');
    addToast('Signed In', 'Viewing workspace as Sarah Jenkins (Director of Engineering).', 'success');
    navigate('/manager');
  };

  const loginAsDeveloper = () => {
    setRole('developer');
    addToast('Signed In', 'Viewing workspace as Rahul Sharma (Backend Engineer).', 'success');
    navigate('/developer');
  };

  return (
    <div className="min-h-screen bg-editorial-bg flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-editorial-surface border border-editorial-border rounded-md overflow-hidden shadow-editorial-card">
        
        {/* Left Side: Brand & Feature Highlights */}
        <div className="lg:col-span-5 p-8 bg-editorial-subtle/40 border-b lg:border-b-0 lg:border-r border-editorial-border flex flex-col justify-between space-y-8">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-editorial-navy border border-editorial-border flex items-center justify-center text-editorial-brass">
                <span className="font-serif font-bold text-base text-editorial-brass">R</span>
              </div>
              <div>
                <span className="font-serif font-medium text-lg tracking-tight text-[#F2F4F8]">
                  Rev<span className="text-editorial-brass font-normal">AI</span>
                </span>
                <span className="block text-[10px] font-mono tracking-widest uppercase text-editorial-muted">
                  Code Review Assistant
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8 space-y-3">
              <h1 className="text-2xl font-serif text-[#F2F4F8] leading-snug font-normal">
                Pre-screen pull requests before manual review.
              </h1>
              <p className="text-xs text-editorial-slate leading-relaxed">
                Powered by Qwen2.5-Coder to systematically surface security vulnerabilities, evaluate blast radius, and formulate verified patch proposals.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="mt-6 space-y-3 text-xs text-editorial-slate">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-editorial-ivy shrink-0 mt-0.5" />
                <span className="text-[#F2F4F8]/90">OWASP Top 10 security vulnerability scanning</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-editorial-brass shrink-0 mt-0.5" />
                <span className="text-[#F2F4F8]/90">Synthesized unified diff patches with test assertions</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-editorial-ivy shrink-0 mt-0.5" />
                <span className="text-[#F2F4F8]/90">Reduces engineering lead triage overhead by 75%</span>
              </div>
            </div>
          </div>

          {/* Bottom subtle engine specification */}
          <div className="pt-6 border-t border-editorial-border flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-editorial-muted block uppercase tracking-wider">Inference Model</span>
              <span className="text-xs font-mono font-medium text-editorial-brass">Qwen2.5-Coder 7B</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-editorial-muted block uppercase tracking-wider">Architecture</span>
              <span className="text-xs font-mono text-editorial-slate">AST + Neural Triage</span>
            </div>
          </div>
        </div>

        {/* Right Side: Sign-in Form & Persona Toggles */}
        <div className="lg:col-span-7 p-8 flex flex-col justify-center space-y-6">
          <div>
            <h2 className="text-xl font-serif font-normal text-[#F2F4F8] tracking-tight">
              {isRegister ? 'Create an Engineering Account' : 'Sign in to RevAI'}
            </h2>
            <p className="text-xs text-editorial-slate mt-1">
              Select an engineering role below for instant demo access, or sign in with workspace credentials.
            </p>
          </div>

          {/* Demo 1-Click Access Cards */}
          <div className="p-4 rounded bg-editorial-subtle/30 border border-editorial-border space-y-2.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-editorial-brass font-medium block">
              Quick Role Switcher
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={loginAsManager}
                className="p-3 rounded bg-editorial-surface hover:bg-editorial-subtle border border-editorial-border hover:border-editorial-brass/40 text-left transition-editorial cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#F2F4F8] group-hover:text-editorial-brass transition-colors">
                    Director of Engineering
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-editorial-muted group-hover:text-editorial-brass transition-colors" />
                </div>
                <span className="text-[11px] text-editorial-muted block mt-1">
                  Sarah Jenkins (Triage & Sign-off)
                </span>
              </button>

              <button
                type="button"
                onClick={loginAsDeveloper}
                className="p-3 rounded bg-editorial-surface hover:bg-editorial-subtle border border-editorial-border hover:border-editorial-brass/40 text-left transition-editorial cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#F2F4F8] group-hover:text-editorial-brass transition-colors">
                    Senior Software Engineer
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-editorial-muted group-hover:text-editorial-brass transition-colors" />
                </div>
                <span className="text-[11px] text-editorial-muted block mt-1">
                  Rahul Sharma (Code Patches & Diffs)
                </span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-editorial-border w-full"></div>
            <span className="bg-editorial-surface px-3 text-[10px] font-mono text-editorial-muted uppercase tracking-widest absolute">
              or continue with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-editorial-muted mb-1.5 font-medium">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-editorial-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@company.com"
                  className="w-full bg-editorial-bg border border-editorial-border rounded pl-9 pr-3 py-2 text-xs text-[#F2F4F8] placeholder-editorial-muted focus:outline-none focus:border-editorial-brass/60 font-sans transition-editorial"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-editorial-muted mb-1.5 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-editorial-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-editorial-bg border border-editorial-border rounded pl-9 pr-10 py-2 text-xs text-[#F2F4F8] placeholder-editorial-muted focus:outline-none focus:border-editorial-brass/60 font-sans transition-editorial"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-editorial-muted hover:text-[#F2F4F8] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded bg-editorial-brass hover:bg-editorial-brass/90 text-editorial-bg text-xs font-semibold tracking-wide transition-editorial shadow-editorial-card cursor-pointer"
            >
              {isRegister ? 'Create Workspace Account' : 'Sign In to Workspace'}
            </button>
          </form>

          {/* GitHub Auth option */}
          <button
            type="button"
            onClick={loginAsManager}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded bg-editorial-surface hover:bg-editorial-subtle text-[#F2F4F8] text-xs font-medium border border-editorial-border transition-editorial cursor-pointer"
          >
            <Github className="w-4 h-4 text-editorial-slate" />
            <span>Continue with GitHub Organization</span>
          </button>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-editorial-slate hover:text-editorial-brass transition-editorial cursor-pointer"
            >
              {isRegister ? 'Already registered? Sign in' : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
