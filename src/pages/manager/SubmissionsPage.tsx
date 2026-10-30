import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../../components/common/RiskBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  GitPullRequest, 
  Search, 
  Filter, 
  ArrowRight, 
  RotateCcw, 
  Calendar,
  Layers,
  ShieldAlert,
  Bot
} from 'lucide-react';
import { RiskLevel, ReviewStatus } from '../../types';

export const SubmissionsPage: React.FC = () => {
  const { submissions, developers, repositories, globalSearch, setGlobalSearch } = useApp();
  const navigate = useNavigate();

  // Filter States
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [developerFilter, setDeveloperFilter] = useState<string>('all');
  const [repositoryFilter, setRepositoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Combined search term
  const effectiveSearch = searchTerm || globalSearch;

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      // Search filter
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

      // Status filter
      if (statusFilter === 'pending') {
        if (sub.status !== 'ai_completed' && sub.status !== 'ai_reviewing') return false;
      } else if (statusFilter === 'completed') {
        if (sub.status !== 'approved' && sub.status !== 'changes_requested' && sub.status !== 'merged') return false;
      }

      // Risk filter
      if (riskFilter !== 'all' && sub.riskLevel !== riskFilter) {
        return false;
      }

      // Developer filter
      if (developerFilter !== 'all' && sub.developer.id !== developerFilter) {
        return false;
      }

      // Repository filter
      if (repositoryFilter !== 'all' && sub.repository.name !== repositoryFilter) {
        return false;
      }

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <GitPullRequest className="w-6 h-6 text-brand-blue" />
            Pull Request Submissions
          </h1>
          <p className="text-xs text-dark-muted mt-1">
            Review incoming pull requests analyzed by Qwen2.5-Coder 7B before manager approval.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-dark-dim">
            Showing <strong className="text-white">{filteredSubmissions.length}</strong> of {submissions.length} PRs
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-4 shadow-md space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search bar */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-dark-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={effectiveSearch}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by title, #ID, or keyword..."
              className="w-full bg-dark-subtle border border-dark-border rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-dark-dim focus:outline-none focus:border-brand-blue font-mono"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-dark-subtle border border-dark-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue font-mono"
            >
              <option value="all">All Review Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="completed">Completed (Approved/Changes)</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full bg-dark-subtle border border-dark-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue font-mono"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical Risk</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
              <option value="safe">Safe / Passed</option>
            </select>
          </div>

          {/* Developer Filter */}
          <div>
            <select
              value={developerFilter}
              onChange={(e) => setDeveloperFilter(e.target.value)}
              className="w-full bg-dark-subtle border border-dark-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue font-mono"
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

        {/* Repository Filter & Quick Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-dark-border/50 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-dark-dim font-mono text-[11px] uppercase">Quick Select:</span>
            <button
              onClick={() => {
                setStatusFilter('pending');
                setRiskFilter('critical');
              }}
              className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-mono transition-colors"
            >
              Pending Criticals
            </button>
            <button
              onClick={() => {
                setDeveloperFilter('dev-1'); // Rahul Sharma
              }}
              className="px-2.5 py-1 rounded-lg bg-brand-blue/10 border border-brand-blue/30 text-brand-blue hover:bg-brand-blue/20 text-xs font-mono transition-colors"
            >
              Rahul Sharma
            </button>
            <button
              onClick={() => {
                setRepositoryFilter('authentication-service');
              }}
              className="px-2.5 py-1 rounded-lg bg-dark-subtle border border-dark-border text-dark-muted hover:text-white text-xs font-mono transition-colors"
            >
              authentication-service
            </button>
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs text-dark-muted hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-subtle text-dark-muted font-mono uppercase tracking-wider text-[11px] border-b border-dark-border">
              <tr>
                <th className="py-3.5 px-4">PR # / Title</th>
                <th className="py-3.5 px-4">Developer</th>
                <th className="py-3.5 px-4">Repository</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Language</th>
                <th className="py-3.5 px-4">AI Review Status</th>
                <th className="py-3.5 px-4">Risk Level</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/50">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-dark-dim">
                    <p className="font-mono text-sm">No submissions match the selected filters.</p>
                    <button
                      onClick={resetFilters}
                      className="mt-3 px-3 py-1.5 text-xs text-brand-blue hover:underline"
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
                      className="hover:bg-dark-subtle/60 cursor-pointer transition-colors group"
                    >
                      {/* PR # and title */}
                      <td className="py-4 px-4 font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-brand-blue font-bold">#{sub.prNumber}</span>
                          <span className="text-dark-text font-sans font-medium line-clamp-1 max-w-[220px] lg:max-w-[280px]">
                            {sub.title}
                          </span>
                        </div>
                        <div className="text-[10px] text-dark-dim mt-0.5 flex items-center gap-2">
                          <span>{sub.repository.branch}</span>
                          <span>→</span>
                          <span>{sub.repository.targetBranch}</span>
                          <span>•</span>
                          <span className="text-emerald-400">+{sub.additions}</span>
                          <span className="text-rose-400">-{sub.deletions}</span>
                        </div>
                      </td>

                      {/* Developer */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={sub.developer.avatar}
                            alt={sub.developer.name}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-dark-border"
                          />
                          <div>
                            <p className="text-dark-text font-medium leading-none">
                              {sub.developer.name}
                            </p>
                            <p className="text-[10px] text-dark-dim mt-0.5">
                              {sub.developer.role}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Repository */}
                      <td className="py-4 px-4 font-mono text-dark-muted">
                        <span className="px-2 py-1 rounded bg-dark-subtle border border-dark-border">
                          {sub.repository.name}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 font-mono text-dark-dim whitespace-nowrap">
                        {dateStr}
                      </td>

                      {/* Language */}
                      <td className="py-4 px-4 font-mono">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-dark-subtle border border-dark-border text-dark-text">
                          {sub.language}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <StatusBadge status={sub.status} size="sm" />
                      </td>

                      {/* Risk */}
                      <td className="py-4 px-4">
                        <RiskBadge level={sub.riskLevel} score={sub.riskScore} size="sm" />
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/manager/reviews/${sub.id}`);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-dark-subtle group-hover:bg-brand-blue group-hover:text-white text-xs font-mono text-dark-text border border-dark-border group-hover:border-brand-blue transition-all"
                        >
                          <span>View Report</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
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
