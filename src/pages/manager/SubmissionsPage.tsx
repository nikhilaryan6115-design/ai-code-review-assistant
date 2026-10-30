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
          <h1 className="text-xl sm:text-2xl font-bold text-nocturne-ivory tracking-tight flex items-center gap-2 font-heading">
            <GitPullRequest className="w-5 h-5 text-pumpkin" />
            Pull Request Submissions
          </h1>
          <p className="text-xs text-nocturne-grey mt-1">
            Browse and filter code submissions analyzed by Qwen2.5-Coder 7B before manual manager approval.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-nocturne-grey">
            Showing <strong className="text-nocturne-ivory">{filteredSubmissions.length}</strong> of {submissions.length} PRs
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-nocturne-plum border border-nocturne-border rounded-xl p-4 shadow-card space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search bar */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-nocturne-grey absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={effectiveSearch}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, PR #, or keyword..."
              className="w-full bg-nocturne-charcoal border border-nocturne-border rounded-lg pl-9 pr-3 py-2 text-xs text-nocturne-ivory placeholder-nocturne-grey focus:outline-none focus:border-pumpkin/50 font-sans"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'completed')}
              className="w-full bg-nocturne-charcoal border border-nocturne-border rounded-lg px-3 py-2 text-xs text-nocturne-ivory focus:outline-none focus:border-pumpkin/50 font-sans"
            >
              <option value="all">All Review Statuses</option>
              <option value="pending">Pending Review Only</option>
              <option value="completed">Completed / Signed-off</option>
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full bg-nocturne-charcoal border border-nocturne-border rounded-lg px-3 py-2 text-xs text-nocturne-ivory focus:outline-none focus:border-pumpkin/50 font-sans"
            >
              <option value="all">All Risk Levels</option>
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
              className="w-full bg-nocturne-charcoal border border-nocturne-border rounded-lg px-3 py-2 text-xs text-nocturne-ivory focus:outline-none focus:border-pumpkin/50 font-sans"
            >
              <option value="all">All Developers</option>
              {developers.map((dev) => (
                <option key={dev.id} value={dev.id}>
                  {dev.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Second Row: Repository and Reset Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-nocturne-border">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-nocturne-grey" />
            <span className="text-xs text-nocturne-grey">Repository:</span>
            <select
              value={repositoryFilter}
              onChange={(e) => setRepositoryFilter(e.target.value)}
              className="bg-nocturne-charcoal border border-nocturne-border rounded-lg px-2.5 py-1 text-xs text-nocturne-ivory focus:outline-none focus:border-pumpkin/50 font-mono"
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
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-nocturne-grey hover:text-nocturne-ivory rounded hover:bg-nocturne-charcoal transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-nocturne-plum border border-nocturne-border rounded-xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-nocturne-charcoal/70 text-nocturne-grey font-mono uppercase tracking-wider text-[11px] border-b border-nocturne-border">
              <tr>
                <th className="py-3 px-4 font-medium">PR # / Title</th>
                <th className="py-3 px-4 font-medium">Developer</th>
                <th className="py-3 px-4 font-medium">Repository</th>
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium">Language</th>
                <th className="py-3 px-4 font-medium">AI Review Status</th>
                <th className="py-3 px-4 font-medium">Risk Assessment</th>
                <th className="py-3 px-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nocturne-border text-nocturne-ivory">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-nocturne-grey">
                    <p className="font-mono text-sm">No submissions match the selected filters.</p>
                    <button
                      onClick={resetFilters}
                      className="mt-3 px-3 py-1.5 text-xs text-pumpkin font-medium hover:underline cursor-pointer"
                    >
                      Clear all filters
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
                      className="hover:bg-nocturne-wine/40 cursor-pointer transition-colors group"
                    >
                      {/* PR # and title */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-pumpkin font-bold">#{sub.prNumber}</span>
                          <span className="text-nocturne-ivory font-sans font-medium line-clamp-1 max-w-[220px] lg:max-w-[280px]">
                            {sub.title}
                          </span>
                        </div>
                        <div className="text-[10px] text-nocturne-grey mt-0.5 flex items-center gap-2">
                          <span>{sub.repository.branch}</span>
                          <span>→</span>
                          <span>{sub.repository.targetBranch}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold">+{sub.additions}</span>
                          <span className="text-red-400 font-semibold">-{sub.deletions}</span>
                        </div>
                      </td>

                      {/* Developer */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={sub.developer.avatar}
                            alt={sub.developer.name}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-nocturne-border"
                          />
                          <div>
                            <p className="text-nocturne-ivory font-medium leading-none">
                              {sub.developer.name}
                            </p>
                            <p className="text-[10px] text-nocturne-grey mt-0.5">
                              {sub.developer.role}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Repository */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className="px-2 py-0.5 rounded bg-nocturne-charcoal border border-nocturne-border text-[11px] text-nocturne-ivory">
                          {sub.repository.name}
                        </span>
                      </td>

                      {/* Submission Date */}
                      <td className="py-3.5 px-4 font-mono text-nocturne-grey">
                        {dateStr}
                      </td>

                      {/* Language */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className="text-nocturne-grey text-[11px]">
                          {sub.language}
                        </span>
                      </td>

                      {/* AI Review Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={sub.status} size="sm" />
                      </td>

                      {/* Risk Assessment */}
                      <td className="py-3.5 px-4">
                        <RiskBadge level={sub.riskLevel} score={sub.riskScore} size="sm" />
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-xs text-pumpkin font-semibold group-hover:translate-x-0.5 transition-transform">
                          Review
                          <ArrowRight className="w-3.5 h-3.5" />
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
