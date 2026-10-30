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
  Bot,
  AlertTriangle,
  FolderGit2
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
  Cell
} from 'recharts';
import { motion } from 'framer-motion';

export const ManagerDashboard: React.FC = () => {
  const { submissions, currentUser } = useApp();
  const navigate = useNavigate();

  // Metrics
  const totalSubmissions = submissions.length + 120;
  const pendingReviews = submissions.filter(s => s.status === 'ai_completed' || s.status === 'ai_reviewing').length;
  const criticalIssues = submissions.filter(s => s.riskLevel === 'critical' || s.riskLevel === 'high').length;
  const completedReviews = submissions.filter(s => s.status === 'approved' || s.status === 'changes_requested').length + 94;

  // Prioritize pending and high risk submissions
  const sortedSubmissions = [...submissions].sort((a, b) => {
    if (a.status === 'ai_completed' && b.status !== 'ai_completed') return -1;
    if (b.status === 'ai_completed' && a.status !== 'ai_completed') return 1;
    return b.riskScore - a.riskScore;
  }).slice(0, 5);

  const chartData = [
    { day: 'Mon', submissions: 14, approved: 10 },
    { day: 'Tue', submissions: 22, approved: 18 },
    { day: 'Wed', submissions: 19, approved: 16 },
    { day: 'Thu', submissions: 28, approved: 23 },
    { day: 'Fri', submissions: 32, approved: 26 },
    { day: 'Sat', submissions: 9, approved: 8 },
    { day: 'Sun', submissions: 12, approved: 11 },
  ];

  const severityData = [
    { name: 'Critical', count: 18, color: '#991B1B' },
    { name: 'High', count: 27, color: '#B45309' },
    { name: 'Medium', count: 46, color: '#987653' },
    { name: 'Low', count: 82, color: '#64748B' },
  ];

  return (
    <div className="space-y-6">
      {/* A. Welcome Section */}
      <div className="bg-warm-white border border-warm-border rounded-xl p-6 shadow-warm-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-tobacco font-medium">
              Engineering Review Dashboard
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded-full bg-buttercream border border-warm-border text-warm-charcoal">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse"></span>
              Qwen2.5-Coder 7B Online
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-warm-charcoal tracking-tight font-sans">
            Good morning, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-warm-muted max-w-2xl leading-relaxed">
            RevAI pre-screened incoming pull requests with static AST parsing, OWASP security rules, and code quality synthesis. 
            There are currently <strong className="text-wine font-semibold">{pendingReviews} reviews pending sign-off</strong>, including <strong className="text-red-700 font-semibold">{criticalIssues} high-risk findings</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/manager/submissions"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-wine hover:bg-wine-800 text-white text-xs font-semibold shadow-wine-sm transition-all"
          >
            <span>Review Pending PRs ({pendingReviews})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* B. Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Submissions"
          value={totalSubmissions}
          change="+18% this month"
          isPositive={true}
          subtitle="6 active microservices"
          icon={GitPullRequest}
          badge="Lifetime"
        />

        <StatCard
          title="Pending Manager Reviews"
          value={pendingReviews}
          change="3 requiring sign-off"
          isPositive={false}
          subtitle="Needs manager triage"
          icon={Clock}
          badge="Active"
        />

        <StatCard
          title="Critical Issues Detected"
          value={criticalIssues}
          change="Caught before review"
          isPositive={false}
          subtitle="SQLi, secrets, leaks"
          icon={ShieldAlert}
          badge="AI Pre-check"
        />

        <StatCard
          title="Completed Reviews"
          value={completedReviews}
          change="14s avg AI review"
          isPositive={true}
          subtitle="94.2% acceptance rate"
          icon={CheckCircle2}
          badge="Verified"
        />
      </div>

      {/* C & D. Review Activity Chart & AI Issue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* C. Activity Chart */}
        <div className="lg:col-span-2 bg-warm-white border border-warm-border rounded-xl p-5 shadow-warm-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 border-b border-warm-border/60 pb-3">
            <div>
              <h3 className="text-sm font-bold text-warm-charcoal">Review Activity & Throughput</h3>
              <p className="text-xs text-warm-muted">Daily PR submissions versus verified manager sign-offs</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-warm-charcoal">
                <span className="w-2.5 h-2.5 rounded bg-wine"></span>
                <span>Submissions</span>
              </div>
              <div className="flex items-center gap-1.5 text-warm-charcoal">
                <span className="w-2.5 h-2.5 rounded bg-tobacco"></span>
                <span>Approved</span>
              </div>
            </div>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#592C3B" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#592C3B" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#987653" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#987653" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8DCB8" vertical={false} />
                <XAxis dataKey="day" stroke="#81766F" fontSize={11} tickLine={false} />
                <YAxis stroke="#81766F" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFDF7',
                    borderColor: '#E8DCB8',
                    borderRadius: '8px',
                    color: '#30272A',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(48, 39, 42, 0.08)'
                  }}
                />
                <Area type="monotone" dataKey="submissions" stroke="#592C3B" strokeWidth={2} fillOpacity={1} fill="url(#colorSub)" />
                <Area type="monotone" dataKey="approved" stroke="#987653" strokeWidth={2} fillOpacity={1} fill="url(#colorApp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* D. AI Issue Breakdown */}
        <div className="bg-warm-white border border-warm-border rounded-xl p-5 shadow-warm-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-warm-charcoal">AI Findings Breakdown</h3>
            <p className="text-xs text-warm-muted">Distribution by detected severity</p>
          </div>

          <div className="h-44 w-full my-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8DCB8" horizontal={false} />
                <XAxis type="number" stroke="#81766F" fontSize={11} tickLine={false} />
                <YAxis type="category" dataKey="name" stroke="#81766F" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFDF7',
                    borderColor: '#E8DCB8',
                    borderRadius: '8px',
                    color: '#30272A',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-warm-border/60 text-xs">
            <div className="p-2.5 rounded-lg bg-red-50/70 border border-red-200">
              <span className="text-red-800 text-[10px] font-mono uppercase font-semibold block">Critical Risks</span>
              <span className="text-red-900 font-bold text-sm">18 issues</span>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200">
              <span className="text-amber-800 text-[10px] font-mono uppercase font-semibold block">Warnings</span>
              <span className="text-amber-900 font-bold text-sm">73 issues</span>
            </div>
          </div>
        </div>
      </div>

      {/* E. Recent Submissions Section (Prioritized by Risk & Pending) */}
      <div className="bg-warm-white border border-warm-border rounded-xl overflow-hidden shadow-warm-sm">
        <div className="p-4 sm:p-5 border-b border-warm-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-warm-charcoal">Recent Code Submissions Requiring Attention</h3>
            <p className="text-xs text-warm-muted">Priority ordered by pending manager sign-off and risk score</p>
          </div>
          <Link
            to="/manager/submissions"
            className="text-xs text-wine hover:text-wine-800 font-medium flex items-center gap-1 transition-colors"
          >
            <span>All Submissions ({submissions.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-warm-subtle/60 text-warm-muted font-mono uppercase tracking-wider text-[11px] border-b border-warm-border">
              <tr>
                <th className="py-3 px-4 font-medium">Pull Request</th>
                <th className="py-3 px-4 font-medium">Developer</th>
                <th className="py-3 px-4 font-medium">Repository</th>
                <th className="py-3 px-4 font-medium">Language</th>
                <th className="py-3 px-4 font-medium">AI Review Status</th>
                <th className="py-3 px-4 font-medium">Risk Assessment</th>
                <th className="py-3 px-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-border/50 text-warm-charcoal">
              {sortedSubmissions.map((sub) => (
                <tr
                  key={sub.id}
                  onClick={() => navigate(`/manager/reviews/${sub.id}`)}
                  className="hover:bg-warm-subtle/50 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-wine font-bold">#{sub.prNumber}</span>
                      <span className="text-warm-charcoal font-sans font-medium line-clamp-1 max-w-[200px] lg:max-w-[280px]">
                        {sub.title}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={sub.developer.avatar}
                        alt={sub.developer.name}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-warm-border"
                      />
                      <span className="font-medium text-warm-charcoal">{sub.developer.name}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-warm-muted">
                    <span className="px-1.5 py-0.5 rounded bg-warm-subtle border border-warm-border/60 text-[11px]">
                      {sub.repository.name}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <span className="text-warm-muted text-[11px]">
                      {sub.language}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <StatusBadge status={sub.status} size="sm" />
                  </td>

                  <td className="py-3 px-4">
                    <RiskBadge level={sub.riskLevel} score={sub.riskScore} size="sm" />
                  </td>

                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-xs text-wine font-semibold group-hover:translate-x-0.5 transition-transform">
                      Review Findings
                      <ArrowRight className="w-3.5 h-3.5" />
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
