import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sliders, 
  Bot, 
  Save, 
  Webhook, 
  SlidersHorizontal
} from 'lucide-react';
import { AISettings } from '../../types';

export const SettingsPage: React.FC = () => {
  const { aiSettings, updateAISettings } = useApp();
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
        <h1 className="text-xl sm:text-2xl font-bold text-warm-charcoal tracking-tight flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-wine" />
          AI Review Engine & Policy Settings
        </h1>
        <p className="text-xs text-warm-muted mt-1">
          Tune Qwen2.5-Coder 7B model parameters, static analysis sensitivities, webhooks, and merge blocker thresholds.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Model Engine Configuration */}
        <div className="bg-warm-white border border-warm-border rounded-xl p-6 shadow-warm-sm space-y-5">
          <div className="flex items-center justify-between border-b border-warm-border/60 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-wine/10 text-wine">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-warm-charcoal">Qwen2.5-Coder Inference Settings</h3>
                <p className="text-xs text-warm-muted font-mono">Model: Qwen2.5-Coder 7B-Instruct</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-buttercream text-warm-charcoal border border-warm-border font-medium">
              v2.5 Production
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-warm-muted mb-1 uppercase text-[10px] tracking-wider font-semibold">
                Model Identifier
              </label>
              <input
                type="text"
                value={formData.modelIdentifier}
                disabled
                className="w-full bg-warm-subtle/80 border border-warm-border rounded-lg px-3 py-2 text-warm-charcoal font-mono opacity-80 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-warm-muted mb-1 uppercase text-[10px] tracking-wider font-semibold">
                Temperature ({formData.temperature})
              </label>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                className="w-full accent-wine"
              />
              <span className="text-[10px] text-warm-muted font-sans">Lower values produce deterministic, strict static code analysis.</span>
            </div>

            <div>
              <label className="block text-warm-muted mb-1 uppercase text-[10px] tracking-wider font-semibold">
                Max Output Tokens ({formData.maxTokens})
              </label>
              <input
                type="number"
                value={formData.maxTokens}
                onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                className="w-full bg-warm-bg border border-warm-border rounded-lg px-3 py-2 text-warm-charcoal focus:outline-none focus:border-wine focus:bg-warm-white"
              />
            </div>

            <div>
              <label className="block text-warm-muted mb-1 uppercase text-[10px] tracking-wider font-semibold">
                Confidence Threshold ({formData.confidenceThreshold}%)
              </label>
              <input
                type="range"
                min="50"
                max="99"
                step="1"
                value={formData.confidenceThreshold}
                onChange={(e) => setFormData({ ...formData, confidenceThreshold: parseInt(e.target.value) })}
                className="w-full accent-wine"
              />
              <span className="text-[10px] text-warm-muted font-sans">Filters false positives below this confidence percentage.</span>
            </div>
          </div>

          {/* System Prompt */}
          <div>
            <label className="block text-warm-muted mb-1 uppercase text-[10px] tracking-wider font-mono font-semibold">
              Qwen2.5-Coder Review Prompt Instructions
            </label>
            <textarea
              rows={4}
              value={formData.systemPrompt}
              onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              className="w-full bg-warm-bg border border-warm-border rounded-lg p-3 text-xs text-warm-charcoal font-mono leading-relaxed focus:outline-none focus:border-wine focus:bg-warm-white"
            />
          </div>
        </div>

        {/* Security Gates & Toggles */}
        <div className="bg-warm-white border border-warm-border rounded-xl p-6 shadow-warm-sm space-y-4">
          <h3 className="text-sm font-bold text-warm-charcoal border-b border-warm-border/60 pb-3">
            Automated Inspection Modules
          </h3>

          <div className="space-y-2.5">
            <label className="flex items-center justify-between p-3 rounded-lg bg-warm-subtle/50 border border-warm-border cursor-pointer hover:bg-warm-subtle transition-colors">
              <div>
                <span className="text-xs font-bold text-warm-charcoal block">Security Vulnerability Scanner (OWASP & CWE)</span>
                <span className="text-[11px] text-warm-muted font-sans">Flags SQLi, SSRF, XSS, hardcoded credentials, and unsafe deserialization.</span>
              </div>
              <input
                type="checkbox"
                checked={formData.enableSecurityScanning}
                onChange={(e) => setFormData({ ...formData, enableSecurityScanning: e.target.checked })}
                className="rounded border-warm-border text-wine focus:ring-0 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-warm-subtle/50 border border-warm-border cursor-pointer hover:bg-warm-subtle transition-colors">
              <div>
                <span className="text-xs font-bold text-warm-charcoal block">Performance Regression Audit</span>
                <span className="text-[11px] text-warm-muted font-sans">Identifies N+1 query loops, goroutine leaks, unbuffered channels, and render stalls.</span>
              </div>
              <input
                type="checkbox"
                checked={formData.enablePerformanceAudit}
                onChange={(e) => setFormData({ ...formData, enablePerformanceAudit: e.target.checked })}
                className="rounded border-warm-border text-wine focus:ring-0 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-warm-subtle/50 border border-warm-border cursor-pointer hover:bg-warm-subtle transition-colors">
              <div>
                <span className="text-xs font-bold text-warm-charcoal block">Block Merge on Critical Risk</span>
                <span className="text-[11px] text-warm-muted font-sans">Sets GitHub commit status check to failing if threat composite exceeds 75.</span>
              </div>
              <input
                type="checkbox"
                checked={formData.blockMergeOnCritical}
                onChange={(e) => setFormData({ ...formData, blockMergeOnCritical: e.target.checked })}
                className="rounded border-warm-border text-wine focus:ring-0 w-4 h-4"
              />
            </label>
          </div>
        </div>

        {/* GitHub Webhook Settings */}
        <div className="bg-warm-white border border-warm-border rounded-xl p-6 shadow-warm-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-warm-border/60 pb-3">
            <Webhook className="w-4 h-4 text-wine" />
            <h3 className="text-sm font-bold text-warm-charcoal">GitHub Webhook Dispatcher</h3>
          </div>

          <div>
            <label className="block text-warm-muted mb-1 uppercase text-[10px] tracking-wider font-mono font-semibold">
              Payload Delivery URL
            </label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full bg-warm-bg border border-warm-border rounded-lg px-3 py-2 text-xs text-warm-charcoal font-mono focus:outline-none focus:border-wine focus:bg-warm-white"
            />
            <span className="text-[11px] text-warm-muted mt-1 block">
              Configured in repository Webhook settings (events: pull_request, push).
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-wine hover:bg-wine-800 text-white text-xs font-semibold shadow-wine-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
