import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../../components/common/RiskBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  GitPullRequest, 
  Search, 
  ArrowRight, 
  RotateCcw, 
  Filter
} from 'lucide-react';

export const SubmissionsPage: React.FC = () => {
  const { submissions, developers, repositories, globalSearch, setGlobalSearch } = useApp();
  const navigate = useNavigate();

  // Filter States
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [developerFilter, setDeveloperFilter] = useState<string>('all');
  const [repositoryFilter, setRepositoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const effectiveSearch = searchTerm || globalSearch;

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      if (effectiveSearch) {
        const query = effectiveSearch.toLowerCase();
        const matchesQuery = 
          sub.title.toLowerCase().includes(query) ||
          sub.prNumber.toString().includes(query) ||
          sub.developer.name.toLowerCase().includes(query) ||
          sub.repository.name.toLowerCase().includes(query) ||
          sub.language.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      if (statusFilter === 'pending') {
        if (sub.status !== 'ai_completed' && sub.status !== 'ai_reviewing') return false;
      } else if (statusFilter === 'completed') {
        if (sub.status !== 'approved' && sub.status !== 'changes_requested' && sub.status !== 'merged') return false;
      }

      if (riskFilter !== 'all' && sub.riskLevel !== riskFilter) return false;
      if (developerFilter !== 'all' && sub.developer.id !== developerFilter) return false;
      if (repositoryFilter !== 'all' && sub.repository.name !== repositoryFilter) return false;

      return true;
    });
  }, [submissions, effectiveSearch, statusFilter, riskFilter, developerFilter, repositoryFilter]);

  const resetFilters = () => {
    setStatusFilter('all');
    setRiskFilter('all');
    setDeveloperFilter('all');
    setRepositoryFilter('all');
    setSearchTerm('');
    setGlobalSearch('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-medium text-[#F2F4F8] tracking-tight flex items-center gap-2">
            <GitPullRequest className="w-5 h-5 text-[#C5A059]" />
            Pull Request Inspection Ledger
          </h1>
          <p className="text-xs text-[#96A0B0] mt-1 font-sans">
            Filter and triage incoming code submissions evaluated by Qwen2.5-Coder 7B prior to executive authorization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#96A0B0]">
            Displaying <strong className="text-[#F2F4F8]">{filteredSubmissions.length}</strong> of {submissions.length} pull requests
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#161B22] border border-[#2E3643] rounded p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search bar */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-[#96A0B0] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={effectiveSearch}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, PR number, or keyword..."
              className="w-full bg-[#0E1116] border border-[#2E3643] rounded pl-9 pr-3 py-2 text-xs text-[#F2F4F8] placeholder-[#96A0B0] focus:outline-none focus:border-[#C5A059] font-sans transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'completed')}
              className="w-full bg-[#0E1116] border border-[#2E3643] rounded px-3 py-2 text-xs text-[#F2F4F8] focus:outline-none focus:border-[#C5A059] font-sans cursor-pointer"
            >
              <option value="all">All Review States</option>
              <option value="pending">Awaiting Manager Triage</option>
              <option value="completed">Authorized / Reviewed</option>
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full bg-[#0E1116] border border-[#2E3643] rounded px-3 py-2 text-xs text-[#F2F4F8] focus:outline-none focus:border-[#C5A059] font-sans cursor-pointer"
            >
              <option value="all">All Severity Tiers</option>
              <option value="critical">Critical Risk</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
              <option value="safe">Passed / Safe</option>
            </select>
          </div>

          {/* Developer Filter */}
          <div>
            <select
              value={developerFilter}
              onChange={(e) => setDeveloperFilter(e.target.value)}
              className="w-full bg-[#0E1116] border border-[#2E3643] rounded px-3 py-2 text-xs text-[#F2F4F8] focus:outline-none focus:border-[#C5A059] font-sans cursor-pointer"
            >
              <option value="all">All Authors</option>
              {developers.map((dev) => (
                <option key={dev.id} value={dev.id}>
                  {dev.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Second Row: Repository and Reset Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#2E3643]">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#96A0B0]" />
            <span className="text-xs text-[#96A0B0] font-sans">Repository:</span>
            <select
              value={repositoryFilter}
              onChange={(e) => setRepositoryFilter(e.target.value)}
              className="bg-[#0E1116] border border-[#2E3643] rounded px-2.5 py-1 text-xs text-[#F2F4F8] focus:outline-none focus:border-[#C5A059] font-mono cursor-pointer"
            >
              <option value="all">All Repositories</option>
              {repositories.map((repo) => (
                <option key={repo.id} value={repo.name}>
                  {repo.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-[#96A0B0] hover:text-[#F2F4F8] rounded hover:bg-[#1D232C] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-[#161B22] border border-[#2E3643] rounded overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1D232C] text-[#96A0B0] font-mono uppercase tracking-wider text-[10px] border-b border-[#2E3643]">
              <tr>
                <th className="py-3 px-4 font-medium">PR ID / Title</th>
                <th className="py-3 px-4 font-medium">Author</th>
                <th className="py-3 px-4 font-medium">Repository</th>
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium">Language</th>
                <th className="py-3 px-4 font-medium">Review Status</th>
                <th className="py-3 px-4 font-medium">Risk Assessment</th>
                <th className="py-3 px-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E3643] text-[#F2F4F8]">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#96A0B0]">
                    <p className="font-mono text-sm">No submissions match the selected criteria.</p>
                    <button
                      onClick={resetFilters}
                      className="mt-3 px-3 py-1.5 text-xs text-[#C5A059] font-medium hover:underline cursor-pointer"
                    >
                      Clear active filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => {
                  const dateStr = new Date(sub.submissionDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <tr
                      key={sub.id}
                      onClick={() => navigate(`/manager/reviews/${sub.id}`)}
                      className="hover:bg-[#1D232C]/60 cursor-pointer transition-colors group"
                    >
                      {/* PR # and title */}
                      <td className="py-3 px-4 font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-[#C5A059] font-medium">#{sub.prNumber}</span>
                          <span className="text-[#F2F4F8] font-sans font-medium line-clamp-1 max-w-[220px] lg:max-w-[280px]">
                            {sub.title}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#96A0B0] mt-0.5 flex items-center gap-2">
                          <span>{sub.repository.branch}</span>
                          <span>→</span>
                          <span>{sub.repository.targetBranch}</span>
                          <span>•</span>
                          <span className="text-[#4EAA78]">+{sub.additions}</span>
                          <span className="text-[#E06C75]">-{sub.deletions}</span>
                        </div>
                      </td>

                      {/* Developer */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={sub.developer.avatar}
                            alt={sub.developer.name}
                            className="w-6 h-6 rounded object-cover ring-1 ring-[#2E3643]"
                          />
                          <div>
                            <p className="text-[#F2F4F8] font-medium leading-none">
                              {sub.developer.name}
                            </p>
                            <p className="text-[10px] text-[#96A0B0] mt-0.5 font-mono">
                              {sub.developer.role}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Repository */}
                      <td className="py-3 px-4 font-mono">
                        <span className="px-1.5 py-0.5 rounded bg-[#1D232C] border border-[#2E3643] text-[11px] text-[#F2F4F8]">
                          {sub.repository.name}
                        </span>
                      </td>

                      {/* Submission Date */}
                      <td className="py-3 px-4 font-mono text-[#96A0B0]">
                        {dateStr}
                      </td>

                      {/* Language */}
                      <td className="py-3 px-4 font-mono text-[#96A0B0]">
                        <span className="text-[11px]">
                          {sub.language}
                        </span>
                      </td>

                      {/* AI Review Status */}
                      <td className="py-3 px-4">
                        <StatusBadge status={sub.status} size="sm" />
                      </td>

                      {/* Risk Assessment */}
                      <td className="py-3 px-4">
                        <RiskBadge level={sub.riskLevel} score={sub.riskScore} size="sm" />
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right font-mono text-xs">
                        <span className="text-[#C5A059] group-hover:underline inline-flex items-center gap-1 font-medium">
                          Inspect <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
