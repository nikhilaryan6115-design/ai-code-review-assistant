import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  FolderGit2, 
  Search, 
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-medium text-[#F2F4F8] tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-[#C5A059]" />
            Engineering Staff Directory
          </h1>
          <p className="text-xs text-[#96A0B0] mt-1 font-sans">
            Track author submission metrics, compliance pass rates, assigned services, and AI pre-review prevention impact.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#96A0B0] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search engineers or services..."
            className="w-full bg-[#161B22] border border-[#2E3643] rounded pl-9 pr-3 py-2 text-xs text-[#F2F4F8] placeholder-[#96A0B0] focus:outline-none focus:border-[#C5A059] font-sans shadow-sm"
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
              className="bg-[#161B22] border border-[#2E3643] rounded p-5 shadow-sm hover:border-[#3E495B] transition-colors flex flex-col justify-between"
            >
              <div>
                {/* Header & Avatar */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={dev.avatar}
                      alt={dev.name}
                      className="w-10 h-10 rounded object-cover ring-1 ring-[#2E3643]"
                    />
                    <div>
                      <h2 className="text-sm font-serif font-medium text-[#F2F4F8] leading-tight">
                        {dev.name}
                      </h2>
                      <p className="text-xs text-[#96A0B0] font-mono mt-0.5">{dev.role}</p>
                    </div>
                  </div>
                  {devPending > 0 && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30 font-medium">
                      {devPending} in triage
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#2E3643]">
                  <p className="text-[11px] font-mono text-[#687487] truncate">
                    {dev.email}
                  </p>
                </div>

                {/* Assigned Repositories */}
                <div className="mt-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#96A0B0] block mb-1.5 font-medium">
                    Assigned Repositories
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {dev.assignedRepositories.map((repo) => (
                      <span
                        key={repo}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0E1116] border border-[#2E3643] text-[#F2F4F8]"
                      >
                        {repo}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats Table */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#2E3643] text-center font-mono">
                  <div className="p-2 rounded bg-[#0E1116] border border-[#2E3643]">
                    <span className="text-[10px] text-[#96A0B0] block uppercase">Submissions</span>
                    <span className="text-sm font-serif font-medium text-[#F2F4F8]">{dev.totalSubmissions}</span>
                  </div>
                  <div className="p-2 rounded bg-[#0E1116] border border-[#2E3643]">
                    <span className="text-[10px] text-[#96A0B0] block uppercase">Pass Rate</span>
                    <span className="text-sm font-serif font-medium text-[#4EAA78]">{dev.approvalRate}%</span>
                  </div>
                  <div className="p-2 rounded bg-[#0E1116] border border-[#2E3643]">
                    <span className="text-[10px] text-[#96A0B0] block uppercase">Criticals</span>
                    <span className="text-sm font-serif font-medium text-[#E06C75]">{dev.criticalIssuesPrevented}</span>
                  </div>
                </div>
              </div>

              {/* View Submissions Link */}
              <div className="mt-4 pt-3 border-t border-[#2E3643] flex items-center justify-between">
                <span className="text-xs font-mono text-[#96A0B0]">
                  {devSubmissions.length} active PR records
                </span>
                <button
                  onClick={() => navigate(`/manager/submissions?developer=${dev.id}`)}
                  className="inline-flex items-center gap-1 text-xs text-[#C5A059] hover:underline font-mono font-medium cursor-pointer"
                >
                  <span>Filter PRs</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
