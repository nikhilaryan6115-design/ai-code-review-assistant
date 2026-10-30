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
          <h1 className="text-xl sm:text-2xl font-bold text-nocturne-ivory tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-pumpkin" />
            Engineering Team Directory
          </h1>
          <p className="text-xs text-nocturne-grey mt-1">
            Track developer submission volume, code pass rates, assigned services, and AI pre-review prevention impact.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-nocturne-grey absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search engineers or repos..."
            className="w-full bg-nocturne-plum border border-nocturne-border rounded-lg pl-9 pr-3 py-2 text-xs text-nocturne-ivory placeholder-nocturne-grey focus:outline-none focus:border-wine font-sans shadow-card"
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
              className="bg-nocturne-plum border border-nocturne-border rounded-xl p-5 shadow-card hover:border-nocturne-borderSubtle transition-all flex flex-col justify-between"
            >
              <div>
                {/* Profile Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={dev.avatar}
                      alt={dev.name}
                      className="w-11 h-11 rounded-full object-cover ring-1 ring-nocturne-border"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-nocturne-ivory leading-tight">
                        {dev.name}
                      </h3>
                      <p className="text-xs text-pumpkin font-medium mt-0.5">{dev.role}</p>
                      <p className="text-[11px] text-nocturne-grey font-mono">{dev.email}</p>
                    </div>
                  </div>
                </div>

                {/* Assigned Repositories */}
                <div className="mt-4 pt-3 border-t border-nocturne-border">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-nocturne-grey font-medium block mb-1.5 flex items-center gap-1">
                    <FolderGit2 className="w-3 h-3 text-tobacco" /> Assigned Services
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {dev.assignedRepositories.map((repo) => (
                      <span
                        key={repo}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-nocturne-charcoal border border-nocturne-border text-nocturne-ivory"
                      >
                        {repo}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-nocturne-border text-center font-mono">
                  <div className="p-2 rounded-lg bg-nocturne-charcoal border border-nocturne-border">
                    <span className="text-nocturne-grey text-[10px] block">Submissions</span>
                    <span className="text-sm font-bold text-nocturne-ivory">{dev.totalSubmissions}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-pumpkin-dark/15 border border-pumpkin/30 text-pumpkin">
                    <span className="text-pumpkin text-[10px] block">Pending</span>
                    <span className="text-sm font-bold">{devPending || dev.pendingReviews}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-300 text-emerald-900">
                    <span className="text-emerald-400 text-[10px] block">Pass Rate</span>
                    <span className="text-sm font-bold">{dev.approvalRate}%</span>
                  </div>
                </div>

                {/* AI Catch Impact */}
                <div className="mt-3 p-2.5 rounded-lg bg-nocturne-charcoal/60 border border-nocturne-border flex items-center justify-between text-xs font-mono">
                  <span className="text-nocturne-ivory flex items-center gap-1.5 font-medium">
                    <Award className="w-3.5 h-3.5 text-pumpkin" /> Critical Bugs Pre-Caught:
                  </span>
                  <span className="text-pumpkin font-bold">
                    {dev.criticalIssuesPrevented}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-nocturne-border flex items-center justify-between">
                <span className="text-[10px] font-mono text-nocturne-grey">
                  Joined {dev.joinDate}
                </span>

                <button
                  onClick={() => navigate(`/manager/submissions`)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-pumpkin hover:underline transition-colors"
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
