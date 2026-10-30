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
        <h1 className="text-xl sm:text-2xl font-serif font-normal text-[#F2F4F8] tracking-tight flex items-center gap-2.5">
          <SlidersHorizontal className="w-5 h-5 text-editorial-brass" />
          AI Review Engine & Policy Settings
        </h1>
        <p className="text-xs text-editorial-slate mt-1">
          Tune Qwen2.5-Coder model parameters, static analysis sensitivities, webhooks, and merge blocker thresholds.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Model Engine Configuration */}
        <div className="bg-editorial-surface border border-editorial-border rounded-md p-6 shadow-editorial-card space-y-5">
          <div className="flex items-center justify-between border-b border-editorial-border pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded bg-editorial-navy border border-editorial-border text-editorial-brass">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-serif font-medium text-[#F2F4F8]">Qwen2.5-Coder Inference Settings</h3>
                <p className="text-xs text-editorial-muted font-mono">Model: Qwen2.5-Coder 7B-Instruct</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-editorial-subtle text-editorial-slate border border-editorial-border font-medium">
              v2.5 Production
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-editorial-muted mb-1 uppercase text-[10px] tracking-wider font-medium">
                Model Identifier
              </label>
              <input
                type="text"
                value={formData.modelIdentifier}
                disabled
                className="w-full bg-editorial-subtle/50 border border-editorial-border rounded px-3 py-2 text-[#F2F4F8] font-mono opacity-80 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-editorial-muted mb-1 uppercase text-[10px] tracking-wider font-medium">
                Temperature ({formData.temperature})
              </label>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                className="w-full accent-editorial-brass cursor-pointer"
              />
              <span className="text-[10px] text-editorial-muted font-sans">Lower values produce deterministic, strict static code analysis.</span>
            </div>

            <div>
              <label className="block text-editorial-muted mb-1 uppercase text-[10px] tracking-wider font-medium">
                Max Output Tokens ({formData.maxTokens})
              </label>
              <input
                type="number"
                value={formData.maxTokens}
                onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                className="w-full bg-editorial-bg border border-editorial-border rounded px-3 py-2 text-[#F2F4F8] focus:outline-none focus:border-editorial-brass/60 transition-editorial"
              />
            </div>

            <div>
              <label className="block text-editorial-muted mb-1 uppercase text-[10px] tracking-wider font-medium">
                Confidence Threshold ({formData.confidenceThreshold}%)
              </label>
              <input
                type="range"
                min="50"
                max="99"
                step="1"
                value={formData.confidenceThreshold}
                onChange={(e) => setFormData({ ...formData, confidenceThreshold: parseInt(e.target.value) })}
                className="w-full accent-editorial-brass cursor-pointer"
              />
              <span className="text-[10px] text-editorial-muted font-sans">Filters false positives below this confidence percentage.</span>
            </div>
          </div>

          {/* System Prompt */}
          <div>
            <label className="block text-editorial-muted mb-1 uppercase text-[10px] tracking-wider font-mono font-medium">
              Qwen2.5-Coder Review Prompt Instructions
            </label>
            <textarea
              rows={4}
              value={formData.systemPrompt}
              onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              className="w-full bg-editorial-bg border border-editorial-border rounded p-3 text-xs text-[#F2F4F8] font-mono leading-relaxed focus:outline-none focus:border-editorial-brass/60 transition-editorial"
            />
          </div>
        </div>

        {/* Security Gates & Toggles */}
        <div className="bg-editorial-surface border border-editorial-border rounded-md p-6 shadow-editorial-card space-y-4">
          <h3 className="text-base font-serif font-medium text-[#F2F4F8] border-b border-editorial-border pb-3">
            Automated Inspection Modules
          </h3>

          <div className="space-y-2.5">
            <label className="flex items-center justify-between p-3.5 rounded bg-editorial-subtle/30 border border-editorial-border cursor-pointer hover:border-editorial-brass/30 transition-editorial">
              <div>
                <span className="text-xs font-serif font-medium text-[#F2F4F8] block">Security Vulnerability Scanner (OWASP & CWE)</span>
                <span className="text-[11px] text-editorial-slate font-sans">Flags SQLi, SSRF, XSS, hardcoded credentials, and unsafe deserialization.</span>
              </div>
              <input
                type="checkbox"
                checked={formData.enableSecurityScanning}
                onChange={(e) => setFormData({ ...formData, enableSecurityScanning: e.target.checked })}
                className="rounded border-editorial-border text-editorial-brass focus:ring-0 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded bg-editorial-subtle/30 border border-editorial-border cursor-pointer hover:border-editorial-brass/30 transition-editorial">
              <div>
                <span className="text-xs font-serif font-medium text-[#F2F4F8] block">Performance Regression Audit</span>
                <span className="text-[11px] text-editorial-slate font-sans">Identifies N+1 query loops, goroutine leaks, unbuffered channels, and render stalls.</span>
              </div>
              <input
                type="checkbox"
                checked={formData.enablePerformanceAudit}
                onChange={(e) => setFormData({ ...formData, enablePerformanceAudit: e.target.checked })}
                className="rounded border-editorial-border text-editorial-brass focus:ring-0 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded bg-editorial-subtle/30 border border-editorial-border cursor-pointer hover:border-editorial-brass/30 transition-editorial">
              <div>
                <span className="text-xs font-serif font-medium text-[#F2F4F8] block">Block Merge on Critical Risk</span>
                <span className="text-[11px] text-editorial-slate font-sans">Sets GitHub commit status check to failing if threat composite exceeds 75.</span>
              </div>
              <input
                type="checkbox"
                checked={formData.blockMergeOnCritical}
                onChange={(e) => setFormData({ ...formData, blockMergeOnCritical: e.target.checked })}
                className="rounded border-editorial-border text-editorial-brass focus:ring-0 w-4 h-4 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* GitHub Webhook Settings */}
        <div className="bg-editorial-surface border border-editorial-border rounded-md p-6 shadow-editorial-card space-y-4">
          <div className="flex items-center gap-2 border-b border-editorial-border pb-3">
            <Webhook className="w-4 h-4 text-editorial-brass" />
            <h3 className="text-base font-serif font-medium text-[#F2F4F8]">GitHub Webhook Dispatcher</h3>
          </div>

          <div>
            <label className="block text-editorial-muted mb-1 uppercase text-[10px] tracking-wider font-mono font-medium">
              Payload Delivery URL
            </label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full bg-editorial-bg border border-editorial-border rounded px-3 py-2 text-xs text-[#F2F4F8] font-mono focus:outline-none focus:border-editorial-brass/60 transition-editorial"
            />
            <span className="text-[11px] text-editorial-muted mt-1 block">
              Configured in repository Webhook settings (events: pull_request, push).
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded bg-editorial-brass hover:bg-editorial-brass/90 text-editorial-bg text-xs font-semibold shadow-editorial-card transition-editorial cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
