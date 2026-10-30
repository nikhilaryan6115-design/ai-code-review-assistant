import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sliders, 
  Bot, 
  ShieldAlert, 
  Cpu, 
  Save, 
  Webhook, 
  Bell, 
  Sparkles, 
  Code2, 
  Check, 
  RotateCcw 
} from 'lucide-react';
import { AISettings } from '../../types';

export const SettingsPage: React.FC = () => {
  const { aiSettings, updateAISettings, addToast } = useApp();
  const [formData, setFormData] = useState<AISettings>(aiSettings);
  const [webhookUrl, setWebhookUrl] = useState('https://api.revai.internal/hooks/github/acme-org');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAISettings(formData);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <Sliders className="w-6 h-6 text-brand-blue" />
          AI Review Engine & Settings
        </h1>
        <p className="text-xs text-dark-muted mt-1">
          Configure Qwen2.5-Coder 7B model parameters, static analysis sensitivities, webhooks, and security gates.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Model Engine Configuration */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-lg space-y-5">
          <div className="flex items-center justify-between border-b border-dark-border/60 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-brand-purple/20 text-brand-purpleLight border border-brand-purple/40">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Inference Engine Parameters</h3>
                <p className="text-xs text-dark-dim font-mono">Model: Qwen2.5-Coder 7B-Instruct</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              v2.5 Release
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-dark-muted mb-1 uppercase text-[10px] tracking-wider">
                Model Identifier
              </label>
              <input
                type="text"
                value={formData.modelIdentifier}
                disabled
                className="w-full bg-dark-subtle border border-dark-border rounded-xl px-3 py-2 text-white font-mono opacity-80 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-dark-muted mb-1 uppercase text-[10px] tracking-wider">
                Temperature ({formData.temperature})
              </label>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                className="w-full accent-brand-blue"
              />
              <span className="text-[10px] text-dark-dim">Lower values yield deterministic, rigorous static code analysis.</span>
            </div>

            <div>
              <label className="block text-dark-muted mb-1 uppercase text-[10px] tracking-wider">
                Max Output Tokens ({formData.maxTokens})
              </label>
              <input
                type="number"
                value={formData.maxTokens}
                onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-dark-muted mb-1 uppercase text-[10px] tracking-wider">
                Vulnerability Confidence Threshold ({formData.confidenceThreshold}%)
              </label>
              <input
                type="range"
                min="50"
                max="99"
                step="1"
                value={formData.confidenceThreshold}
                onChange={(e) => setFormData({ ...formData, confidenceThreshold: parseInt(e.target.value) })}
                className="w-full accent-brand-purple"
              />
              <span className="text-[10px] text-dark-dim">Filters out potential false positives below this confidence.</span>
            </div>
          </div>

          {/* System Prompt */}
          <div>
            <label className="block text-dark-muted mb-1 uppercase text-[10px] tracking-wider font-mono">
              Qwen2.5-Coder Review Prompt Instructions
            </label>
            <textarea
              rows={4}
              value={formData.systemPrompt}
              onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-xl p-3 text-xs text-white font-mono leading-relaxed focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>

        {/* Security Gates & Toggles */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-dark-border/60 pb-3">
            Security Policies & Inspection Modules
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-dark-subtle border border-dark-border cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white block">Security Vulnerability Scanner (OWASP & CWE)</span>
                <span className="text-[11px] text-dark-dim">Detects SQLi, SSRF, XSS, hardcoded secrets, and unsafe deserialization.</span>
              </div>
              <input
                type="checkbox"
                checked={formData.enableSecurityScanning}
                onChange={(e) => setFormData({ ...formData, enableSecurityScanning: e.target.checked })}
                className="rounded border-dark-border text-brand-blue focus:ring-0 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-dark-subtle border border-dark-border cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white block">Performance Regression Audit</span>
                <span className="text-[11px] text-dark-dim">Identifies N+1 query patterns, goroutine leaks, unbuffered channels, and render loops.</span>
              </div>
              <input
                type="checkbox"
                checked={formData.enablePerformanceAudit}
                onChange={(e) => setFormData({ ...formData, enablePerformanceAudit: e.target.checked })}
                className="rounded border-dark-border text-brand-blue focus:ring-0 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-dark-subtle border border-dark-border cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white block">Block Merge on Critical Risk</span>
                <span className="text-[11px] text-dark-dim">Sets GitHub commit status check to failing if risk score exceeds 75.</span>
              </div>
              <input
                type="checkbox"
                checked={formData.blockMergeOnCritical}
                onChange={(e) => setFormData({ ...formData, blockMergeOnCritical: e.target.checked })}
                className="rounded border-dark-border text-brand-blue focus:ring-0 w-4 h-4"
              />
            </label>
          </div>
        </div>

        {/* GitHub Webhook Settings */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2 border-b border-dark-border/60 pb-3">
            <Webhook className="w-4 h-4 text-brand-blue" />
            <h3 className="text-sm font-bold text-white">GitHub Webhook Dispatcher</h3>
          </div>

          <div>
            <label className="block text-dark-muted mb-1 uppercase text-[10px] tracking-wider font-mono">
              Payload Delivery URL
            </label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-3 py-2 text-xs text-white font-mono"
            />
            <span className="text-[11px] text-dark-dim mt-1 block">
              Configured in your GitHub organization repository settings under Webhooks (events: pull_request, push).
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blueHover text-white text-xs font-semibold shadow-glow-blue transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
