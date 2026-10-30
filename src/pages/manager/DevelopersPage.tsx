import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  FolderGit2, 
  Search, 
  Award,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DevelopersPage: React.FC = () => {
  const { developers, submissions } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

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
          <h1 className="text-xl sm:text-2xl font-bold text-warm-charcoal tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-wine" />
            Engineering Team Directory
          </h1>
          <p className="text-xs text-warm-muted mt-1">
            Track developer submission volume, code pass rates, assigned services, and AI pre-review prevention impact.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-warm-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search engineers or repos..."
            className="w-full bg-warm-white border border-warm-border rounded-lg pl-9 pr-3 py-2 text-xs text-warm-charcoal placeholder-warm-dim focus:outline-none focus:border-wine font-sans shadow-warm-sm"
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
              className="bg-warm-white border border-warm-border rounded-xl p-5 shadow-warm-sm hover:border-warm-borderStrong transition-all flex flex-col justify-between"
            >
              <div>
                {/* Profile Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={dev.avatar}
                      alt={dev.name}
                      className="w-11 h-11 rounded-full object-cover ring-1 ring-warm-border"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-warm-charcoal leading-tight">
                        {dev.name}
                      </h3>
                      <p className="text-xs text-wine font-medium mt-0.5">{dev.role}</p>
                      <p className="text-[11px] text-warm-muted font-mono">{dev.email}</p>
                    </div>
                  </div>
                </div>

                {/* Assigned Repositories */}
                <div className="mt-4 pt-3 border-t border-warm-border/60">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-warm-muted font-medium block mb-1.5 flex items-center gap-1">
                    <FolderGit2 className="w-3 h-3 text-tobacco" /> Assigned Services
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {dev.assignedRepositories.map((repo) => (
                      <span
                        key={repo}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-warm-subtle/80 border border-warm-border text-warm-charcoal"
                      >
                        {repo}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-warm-border/60 text-center font-mono">
                  <div className="p-2 rounded-lg bg-warm-subtle/70 border border-warm-border/80">
                    <span className="text-warm-muted text-[10px] block">Submissions</span>
                    <span className="text-sm font-bold text-warm-charcoal">{dev.totalSubmissions}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-300 text-amber-900">
                    <span className="text-amber-800 text-[10px] block">Pending</span>
                    <span className="text-sm font-bold">{devPending || dev.pendingReviews}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900">
                    <span className="text-emerald-800 text-[10px] block">Pass Rate</span>
                    <span className="text-sm font-bold">{dev.approvalRate}%</span>
                  </div>
                </div>

                {/* AI Catch Impact */}
                <div className="mt-3 p-2.5 rounded-lg bg-buttercream/60 border border-warm-border flex items-center justify-between text-xs font-mono">
                  <span className="text-warm-charcoal flex items-center gap-1.5 font-medium">
                    <Award className="w-3.5 h-3.5 text-wine" /> Critical Bugs Pre-Caught:
                  </span>
                  <span className="text-wine font-bold">
                    {dev.criticalIssuesPrevented}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-warm-border/60 flex items-center justify-between">
                <span className="text-[10px] font-mono text-warm-muted">
                  Joined {dev.joinDate}
                </span>

                <button
                  onClick={() => navigate(`/manager/submissions`)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-wine hover:underline transition-colors"
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
