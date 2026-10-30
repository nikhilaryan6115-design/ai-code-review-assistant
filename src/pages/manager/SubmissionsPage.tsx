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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-warm-charcoal tracking-tight flex items-center gap-2">
            <GitPullRequest className="w-5 h-5 text-wine" />
            Pull Request Submissions
          </h1>
          <p className="text-xs text-warm-muted mt-1">
            Browse and filter code submissions analyzed by Qwen2.5-Coder 7B before manual manager approval.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-warm-muted">
            Showing <strong className="text-warm-charcoal">{filteredSubmissions.length}</strong> of {submissions.length} PRs
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-warm-white border border-warm-border rounded-xl p-4 shadow-warm-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search bar */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-warm-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={effectiveSearch}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, PR #, or keyword..."
              className="w-full bg-warm-bg border border-warm-border rounded-lg pl-9 pr-3 py-2 text-xs text-warm-charcoal placeholder-warm-dim focus:outline-none focus:border-wine focus:bg-warm-white font-sans"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-warm-bg border border-warm-border rounded-lg px-3 py-2 text-xs text-warm-charcoal focus:outline-none focus:border-wine focus:bg-warm-white font-sans"
            >
              <option value="all">All Review Statuses</option>
              <option value="pending">Pending Manager Review</option>
              <option value="completed">Completed (Approved/Changes)</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full bg-warm-bg border border-warm-border rounded-lg px-3 py-2 text-xs text-warm-charcoal focus:outline-none focus:border-wine focus:bg-warm-white font-sans"
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
              className="w-full bg-warm-bg border border-warm-border rounded-lg px-3 py-2 text-xs text-warm-charcoal focus:outline-none focus:border-wine focus:bg-warm-white font-sans"
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

        {/* Quick Select & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-warm-border/60 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-warm-dim font-mono text-[10px] uppercase font-semibold">Quick Select:</span>
            <button
              onClick={() => {
                setStatusFilter('pending');
                setRiskFilter('critical');
              }}
              className="px-2.5 py-1 rounded-md bg-red-50 border border-red-200 text-red-800 hover:bg-red-100 text-xs font-mono font-medium transition-colors"
            >
              Pending Criticals
            </button>
            <button
              onClick={() => {
                setDeveloperFilter('dev-1');
              }}
              className="px-2.5 py-1 rounded-md bg-buttercream/80 border border-warm-border text-warm-charcoal hover:bg-buttercream text-xs font-mono font-medium transition-colors"
            >
              Rahul Sharma
            </button>
            <button
              onClick={() => {
                setRepositoryFilter('authentication-service');
              }}
              className="px-2.5 py-1 rounded-md bg-warm-subtle border border-warm-border text-warm-muted hover:text-warm-charcoal text-xs font-mono transition-colors"
            >
              authentication-service
            </button>
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs text-warm-muted hover:text-warm-charcoal transition-colors font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-warm-white border border-warm-border rounded-xl overflow-hidden shadow-warm-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-warm-subtle/60 text-warm-muted font-mono uppercase tracking-wider text-[11px] border-b border-warm-border">
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
            <tbody className="divide-y divide-warm-border/50 text-warm-charcoal">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-warm-muted">
                    <p className="font-mono text-sm">No submissions match the selected filters.</p>
                    <button
                      onClick={resetFilters}
                      className="mt-3 px-3 py-1.5 text-xs text-wine font-medium hover:underline"
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
                      className="hover:bg-warm-subtle/50 cursor-pointer transition-colors group"
                    >
                      {/* PR # and title */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-wine font-bold">#{sub.prNumber}</span>
                          <span className="text-warm-charcoal font-sans font-medium line-clamp-1 max-w-[220px] lg:max-w-[280px]">
                            {sub.title}
                          </span>
                        </div>
                        <div className="text-[10px] text-warm-dim mt-0.5 flex items-center gap-2">
                          <span>{sub.repository.branch}</span>
                          <span>→</span>
                          <span>{sub.repository.targetBranch}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold">+{sub.additions}</span>
                          <span className="text-red-700 font-semibold">-{sub.deletions}</span>
                        </div>
                      </td>

                      {/* Developer */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={sub.developer.avatar}
                            alt={sub.developer.name}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-warm-border"
                          />
                          <div>
                            <p className="text-warm-charcoal font-medium leading-none">
                              {sub.developer.name}
                            </p>
                            <p className="text-[10px] text-warm-muted mt-0.5">
                              {sub.developer.role}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Repository */}
                      <td className="py-3.5 px-4 font-mono text-warm-muted">
                        <span className="px-2 py-0.5 rounded bg-warm-subtle border border-warm-border/60 text-[11px]">
                          {sub.repository.name}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 font-mono text-warm-muted whitespace-nowrap text-[11px]">
                        {dateStr}
                      </td>

                      {/* Language */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        {sub.language}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={sub.status} size="sm" />
                      </td>

                      {/* Risk */}
                      <td className="py-3.5 px-4">
                        <RiskBadge level={sub.riskLevel} score={sub.riskScore} size="sm" />
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/manager/reviews/${sub.id}`);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-warm-white text-wine text-xs font-medium border border-warm-border hover:bg-wine hover:text-white transition-all shadow-warm-sm"
                        >
                          <span>Review</span>
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
