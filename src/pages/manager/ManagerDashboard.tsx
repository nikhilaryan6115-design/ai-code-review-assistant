import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { RiskBadge } from '../../components/common/RiskBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  GitPullRequest, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Bot,
  Filter,
  TrendingUp,
  Code2,
  ExternalLink
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { activityChartData, severityBreakdownData } from '../../data/mockData';

export const ManagerDashboard: React.FC = () => {
  const { submissions, developers } = useApp();
  const navigate = useNavigate();

  // Metrics
  const totalSubmissions = submissions.length + 120; // total lifetime
  const pendingReviews = submissions.filter(s => s.status === 'ai_completed' || s.status === 'ai_reviewing').length;
  const criticalIssues = submissions.filter(s => s.riskLevel === 'critical' || s.riskLevel === 'high').length;
  const completedReviews = submissions.filter(s => s.status === 'approved' || s.status === 'changes_requested').length + 94;

  const recentSubmissions = submissions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-dark-card via-dark-card to-brand-blue/10 border border-dark-border rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-blue">
              Manager Command Center
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-brand-purple/20 text-brand-purpleLight border border-brand-purple/30">
              <Bot className="w-3 h-3" /> Qwen2.5-Coder 7B Online
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Code Review Intelligence
          </h1>
          <p className="text-xs text-dark-muted mt-1 max-w-xl">
            Pre-reviewing incoming PRs automatically to catch critical vulnerabilities, performance regressions, and architectural anti-patterns before manual sign-off.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/manager/submissions"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blueHover text-white text-xs font-semibold shadow-glow-blue transition-all"
          >
            <span>Review Pending PRs ({pendingReviews})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Code Submissions"
          value={totalSubmissions}
          change="+18% this month"
          isPositive={true}
          subtitle="Across 6 microservices"
          icon={GitPullRequest}
          iconColor="text-brand-blue"
          iconBg="bg-brand-blue/10 border-brand-blue/20"
        />

        <StatCard
          title="Pending Manager Reviews"
          value={pendingReviews}
          change="-4 since yesterday"
          isPositive={true}
          subtitle="Waiting for manager decision"
          icon={Clock}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10 border-amber-500/20"
        />

        <StatCard
          title="Critical Issues Detected"
          value={criticalIssues}
          change="AI flagged before review"
          isPositive={false}
          subtitle="SQL injection, secrets & leaks"
          icon={ShieldAlert}
          iconColor="text-rose-400"
          iconBg="bg-rose-500/10 border-rose-500/20"
        />

        <StatCard
          title="Completed Reviews"
          value={completedReviews}
          change="Avg 14s AI review time"
          isPositive={true}
          subtitle="94.2% developer acceptance"
          icon={CheckCircle2}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Over Time Chart */}
        <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-2xl p-5 shadow-lg flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Review Activity & AI Scans</h3>
              <p className="text-xs text-dark-muted">Daily PR submissions and automated Qwen2.5 scans</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-dark-muted">
                <span className="w-2.5 h-2.5 rounded-sm bg-brand-blue"></span>
                <span>Submissions</span>
              </div>
              <div className="flex items-center gap-1.5 text-dark-muted">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400"></span>
                <span>Approved</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#232D42" vertical={false} />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141A29',
                    borderColor: '#232D42',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}
                />
                <Area type="monotone" dataKey="submissions" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorSub)" />
                <Area type="monotone" dataKey="approved" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorApp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">AI Issue Breakdown</h3>
            <p className="text-xs text-dark-muted">By detected severity level</p>
          </div>

          <div className="h-48 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityBreakdownData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#232D42" horizontal={false} />
                <XAxis type="number" stroke="#64748B" fontSize={11} />
                <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141A29',
                    borderColor: '#232D42',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {severityBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-dark-border/60 text-xs font-mono">
            <div className="p-2 rounded bg-dark-subtle border border-dark-border">
              <span className="text-dark-dim block text-[10px]">Critical</span>
              <span className="text-rose-400 font-bold text-sm">18 found</span>
            </div>
            <div className="p-2 rounded bg-dark-subtle border border-dark-border">
              <span className="text-dark-dim block text-[10px]">High / Medium</span>
              <span className="text-amber-400 font-bold text-sm">73 found</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Code Submissions Table */}
      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-lg">
        <div className="p-5 border-b border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Recent Code Submissions</h3>
            <p className="text-xs text-dark-muted">Latest pull requests analyzed by Qwen2.5-Coder 7B</p>
          </div>
          <Link
            to="/manager/submissions"
            className="text-xs text-brand-blue hover:text-white font-mono flex items-center gap-1 transition-colors"
          >
            <span>View all submissions ({submissions.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-subtle text-dark-muted font-mono uppercase tracking-wider text-[11px] border-b border-dark-border">
              <tr>
                <th className="py-3 px-4">Pull Request</th>
                <th className="py-3 px-4">Developer</th>
                <th className="py-3 px-4">Repository</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">AI Review Status</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/50">
              {recentSubmissions.map((sub) => (
                <tr
                  key={sub.id}
                  onClick={() => navigate(`/manager/reviews/${sub.id}`)}
                  className="hover:bg-dark-subtle/60 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-brand-blue font-bold">#{sub.prNumber}</span>
                      <span className="text-dark-text font-sans font-medium line-clamp-1 max-w-[200px] lg:max-w-[280px]">
                        {sub.title}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={sub.developer.avatar}
                        alt={sub.developer.name}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-dark-border"
                      />
                      <span className="text-dark-text font-medium">{sub.developer.name}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-dark-muted">
                    {sub.repository.name}
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-dark-subtle border border-dark-border text-dark-text">
                      {sub.language}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={sub.status} size="sm" />
                  </td>

                  <td className="py-3.5 px-4">
                    <RiskBadge level={sub.riskLevel} score={sub.riskScore} size="sm" />
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-xs text-brand-blue group-hover:text-white font-medium transition-colors">
                      View Report
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
