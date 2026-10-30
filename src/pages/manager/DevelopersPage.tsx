import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  GitPullRequest, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  FolderGit2, 
  Search, 
  Mail, 
  Calendar,
  ExternalLink,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DevelopersPage: React.FC = () => {
  const { developers, submissions } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDev, setSelectedDev] = useState<string | null>(null);

  const filteredDevs = developers.filter((dev) =>
    dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dev.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dev.assignedRepositories.some((r) => r.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-brand-blue" />
            Developer Management
          </h1>
          <p className="text-xs text-dark-muted mt-1">
            Track developer performance, assigned repositories, review turnaround, and AI risk prevention metrics.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-dark-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search developers or repos..."
            className="w-full bg-dark-card border border-dark-border rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-dark-dim focus:outline-none focus:border-brand-blue font-mono"
          />
        </div>
      </div>

      {/* Developer Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDevs.map((dev) => {
          const devSubmissions = submissions.filter((s) => s.developer.id === dev.id);
          const devPending = devSubmissions.filter((s) => s.status === 'ai_completed' || s.status === 'ai_reviewing').length;

          return (
            <div
              key={dev.id}
              className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-lg hover:border-dark-borderLight transition-all flex flex-col justify-between"
            >
              <div>
                {/* Profile Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={dev.avatar}
                      alt={dev.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-blue/30"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">
                        {dev.name}
                      </h3>
                      <p className="text-xs text-brand-blue font-medium mt-0.5">{dev.role}</p>
                      <p className="text-[11px] text-dark-dim font-mono">{dev.email}</p>
                    </div>
                  </div>
                </div>

                {/* Assigned Repositories */}
                <div className="mt-4 pt-3 border-t border-dark-border/60">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-dark-dim block mb-1.5 flex items-center gap-1">
                    <FolderGit2 className="w-3 h-3" /> Assigned Repositories
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {dev.assignedRepositories.map((repo) => (
                      <span
                        key={repo}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-dark-subtle border border-dark-border text-dark-muted"
                      >
                        {repo}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-dark-border/60 text-center font-mono">
                  <div className="p-2 rounded bg-dark-subtle border border-dark-border">
                    <span className="text-dark-dim text-[10px] block">Submissions</span>
                    <span className="text-sm font-bold text-white">{dev.totalSubmissions}</span>
                  </div>
                  <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">
                    <span className="text-dark-dim text-[10px] block">Pending</span>
                    <span className="text-sm font-bold">{devPending || dev.pendingReviews}</span>
                  </div>
                  <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    <span className="text-dark-dim text-[10px] block">Pass Rate</span>
                    <span className="text-sm font-bold">{dev.approvalRate}%</span>
                  </div>
                </div>

                {/* AI Catch Impact */}
                <div className="mt-3 p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between text-xs font-mono">
                  <span className="text-brand-purpleLight flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" /> Critical Bugs Pre-Caught:
                  </span>
                  <span className="text-brand-purple font-bold">
                    {dev.criticalIssuesPrevented}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-dark-border/60 flex items-center justify-between">
                <span className="text-[10px] font-mono text-dark-dim">
                  Joined {dev.joinDate}
                </span>

                <button
                  onClick={() => navigate(`/manager/submissions?dev=${dev.id}`)}
                  className="inline-flex items-center gap-1 text-xs font-mono text-brand-blue hover:text-white transition-colors"
                >
                  <span>View PR History →</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
