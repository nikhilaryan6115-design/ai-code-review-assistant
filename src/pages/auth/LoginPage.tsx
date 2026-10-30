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
    <div className="min-h-screen bg-nocturne-bg flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-nocturne-plum border border-nocturne-border rounded-2xl overflow-hidden shadow-card">
        
        {/* Left Side: Brand & Feature Highlights */}
        <div className="lg:col-span-5 p-8 bg-nocturne-charcoal/50 border-b lg:border-b-0 lg:border-r border-nocturne-border flex flex-col justify-between space-y-8">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-wine-700 flex items-center justify-center text-pumpkin shadow-sm">
                <CrescentMoonSVG size={20} />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-nocturne-ivory font-heading">
                  Rev<span className="text-pumpkin">AI</span>
                </span>
                <span className="block text-[10px] font-mono text-nocturne-grey">
                  Code Review Assistant
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8 space-y-3">
              <h1 className="text-xl font-bold text-nocturne-ivory font-heading leading-snug">
                Detect vulnerabilities before manual reviews begin.
              </h1>
              <p className="text-xs text-nocturne-grey leading-relaxed">
                Powered by Qwen2.5-Coder 7B to pre-screen pull requests, catch security flaws, and generate instant code fixes.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="mt-6 space-y-3 text-xs text-nocturne-grey">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-nocturne-ivory/90">OWASP Top 10 security scanning</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-pumpkin shrink-0 mt-0.5" />
                <span className="text-nocturne-ivory/90">Instant AI unified diff suggestions</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-nocturne-ivory/90">Reduces manager triage time by 75%</span>
              </div>
            </div>
          </div>

          {/* Bottom subtle pumpkin illustration */}
          <div className="pt-6 border-t border-nocturne-border/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-nocturne-grey block">ENGINE SPEC</span>
              <span className="text-xs font-mono font-medium text-pumpkin">Qwen2.5-Coder 7B</span>
            </div>
            <div className="opacity-90">
              <PumpkinSVG size={56} glow={false} />
            </div>
          </div>
        </div>

        {/* Right Side: Sign-in Form & Persona Toggles */}
        <div className="lg:col-span-7 p-8 flex flex-col justify-center space-y-6">
          <div>
            <h2 className="text-xl font-bold text-nocturne-ivory font-heading tracking-tight">
              {isRegister ? 'Create your account' : 'Sign in to RevAI'}
            </h2>
            <p className="text-xs text-nocturne-grey mt-1">
              Select a demo persona below or sign in with your engineering credentials.
            </p>
          </div>

          {/* Demo 1-Click Access Cards */}
          <div className="p-4 rounded-xl bg-nocturne-charcoal/80 border border-nocturne-border space-y-2.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-pumpkin font-semibold block">
              Quick Demo Access
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={loginAsManager}
                className="p-3 rounded-lg bg-nocturne-plum hover:bg-nocturne-wine border border-nocturne-border hover:border-pumpkin/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-nocturne-ivory group-hover:text-pumpkin transition-colors">
                    Manager Persona
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-nocturne-grey group-hover:text-pumpkin transition-colors" />
                </div>
                <span className="text-[11px] text-nocturne-grey block mt-0.5">
                  Sarah Jenkins (PR triage & sign-off)
                </span>
              </button>

              <button
                type="button"
                onClick={loginAsDeveloper}
                className="p-3 rounded-lg bg-nocturne-plum hover:bg-nocturne-wine border border-nocturne-border hover:border-pumpkin/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-nocturne-ivory group-hover:text-pumpkin transition-colors">
                    Developer Persona
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-nocturne-grey group-hover:text-pumpkin transition-colors" />
                </div>
                <span className="text-[11px] text-nocturne-grey block mt-0.5">
                  Rahul Sharma (Code patches & fixes)
                </span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-nocturne-border w-full"></div>
            <span className="bg-nocturne-plum px-3 text-[10px] font-mono text-nocturne-grey uppercase tracking-wider absolute">
              or continue with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-nocturne-grey mb-1.5 font-medium">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-nocturne-grey absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@company.com"
                  className="w-full bg-nocturne-charcoal border border-nocturne-border rounded-lg pl-9 pr-3 py-2 text-xs text-nocturne-ivory placeholder-nocturne-grey focus:outline-none focus:border-pumpkin/50 font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-nocturne-grey mb-1.5 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-nocturne-grey absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-nocturne-charcoal border border-nocturne-border rounded-lg pl-9 pr-10 py-2 text-xs text-nocturne-ivory placeholder-nocturne-grey focus:outline-none focus:border-pumpkin/50 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-nocturne-grey hover:text-nocturne-ivory transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-pumpkin hover:bg-pumpkin-dark text-nocturne-bg text-xs font-semibold tracking-wide transition-all shadow-card cursor-pointer"
            >
              {isRegister ? 'Create Workspace Account' : 'Sign In to Workspace'}
            </button>
          </form>

          {/* GitHub Auth option */}
          <button
            type="button"
            onClick={loginAsManager}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-nocturne-charcoal hover:bg-nocturne-wine text-nocturne-ivory text-xs font-medium border border-nocturne-border transition-all cursor-pointer"
          >
            <Github className="w-4 h-4" />
            <span>Continue with GitHub Organization</span>
          </button>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-nocturne-grey hover:text-pumpkin transition-colors cursor-pointer"
            >
              {isRegister ? 'Already registered? Sign in' : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
