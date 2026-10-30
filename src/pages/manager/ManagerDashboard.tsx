import React, { useState, useRef } from 'react';
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
  ShieldCheck,
  AlertTriangle,
  Flame,
  ChevronRight
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
import { PumpkinSVG, SmallPumpkinSVG } from '../../components/halloween/PumpkinSVG';
import { RunningPumpkinCharge } from '../../components/halloween/RunningPumpkinCharge';

export const ManagerDashboard: React.FC = () => {
  const { submissions, currentUser } = useApp();
  const navigate = useNavigate();
  const [isCharging, setIsCharging] = useState(false);
  const pumpkinRef = useRef<HTMLDivElement>(null);
  const [pumpkinRect, setPumpkinRect] = useState<DOMRect | null>(null);

  // Metrics
  const totalSubmissions = submissions.length + 120;
  const pendingReviews = submissions.filter(s => s.status === 'ai_completed' || s.status === 'ai_reviewing').length;
  const criticalIssues = submissions.filter(s => s.riskLevel === 'critical' || s.riskLevel === 'high').length;
  const completedReviews = submissions.filter(s => s.status === 'approved' || s.status === 'changes_requested').length + 94;

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
    { name: 'Critical', count: 18, color: '#DC2626' },
    { name: 'High', count: 27, color: '#E87927' },
    { name: 'Medium', count: 46, color: '#C5A36B' },
    { name: 'Low', count: 82, color: '#524554' },
  ];

  // Signature interaction trigger
  const handleReviewPendingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCharging) return;

    if (pumpkinRef.current) {
      setPumpkinRect(pumpkinRef.current.getBoundingClientRect());
    }
    setIsCharging(true);
  };

  const handleChargeComplete = () => {
    navigate('/manager/submissions');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Signature Running Pumpkin Screen Charge Overlay */}
      <RunningPumpkinCharge 
        isActive={isCharging}
        onComplete={handleChargeComplete}
        startRect={pumpkinRect}
      />

      {/* A. Refined Human-Crafted Welcome Hero Banner */}
      <div className="relative bg-nocturne-plum border border-nocturne-border rounded-xl p-6 sm:p-7 overflow-hidden">
        {/* Subtle dark burgundy background depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-wine-900/25 via-nocturne-plum to-nocturne-plum pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left info column */}
          <div className="space-y-3.5 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-nocturne-charcoal border border-nocturne-border text-pumpkin">
                <span className="w-1.5 h-1.5 rounded-full bg-pumpkin animate-pulse" />
                Engineering Command
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-0.5 rounded-full bg-nocturne-wine border border-nocturne-border text-nocturne-grey">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Qwen2.5-Coder 7B Online
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-nocturne-ivory tracking-tight font-heading">
                Welcome back, {currentUser.name.split(' ')[0]}
              </h1>
              <p className="text-sm text-nocturne-grey mt-1 font-sans leading-relaxed">
                RevAI has screened your incoming pull requests with AST analysis and OWASP security rules before manual review.
              </p>
            </div>

            {/* Quick summary metrics */}
            <div className="flex items-center gap-4 text-xs font-mono text-nocturne-grey pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-pumpkin font-semibold text-sm">{pendingReviews}</span>
                <span>pending sign-offs</span>
              </div>
              <span className="text-nocturne-border">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-red-400 font-semibold text-sm">{criticalIssues}</span>
                <span>critical vulnerabilities</span>
              </div>
              <span className="text-nocturne-border">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-semibold text-sm">14s</span>
                <span>avg review time</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleReviewPendingClick}
                disabled={isCharging}
                className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-pumpkin hover:bg-pumpkin-dark text-nocturne-bg font-semibold text-xs tracking-wide transition-all shadow-card hover:shadow-card-hover active:scale-[0.98] disabled:opacity-75 cursor-pointer"
                title="Click to trigger the review flow and signature pumpkin interaction"
              >
                <span>{isCharging ? 'Approaching Submissions...' : `Review Pending PRs (${pendingReviews})`}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              <Link
                to="/manager/history"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-nocturne-charcoal hover:bg-nocturne-wine border border-nocturne-border text-nocturne-ivory text-xs font-medium transition-colors"
              >
                <span>Audit History</span>
              </Link>
            </div>
          </div>

          {/* Right: The Realistic Pumpkin Illustration (Interactive trigger) */}
          <div 
            ref={pumpkinRef}
            onClick={handleReviewPendingClick}
            className="cursor-pointer group flex flex-col items-center justify-center p-3 rounded-xl bg-nocturne-wine/40 border border-nocturne-border hover:border-pumpkin/40 transition-all shrink-0 self-center lg:self-auto"
            title="Click pumpkin or Review button to initiate review charge"
          >
            <div className="transition-transform group-hover:scale-105 duration-200">
              <PumpkinSVG size={110} glow={true} />
            </div>
            <span className="text-[10px] font-mono text-nocturne-grey/80 mt-1 flex items-center gap-1 group-hover:text-pumpkin transition-colors">
              <Flame className="w-3 h-3 text-pumpkin" />
              Click to launch review
            </span>
          </div>
        </div>
      </div>

      {/* B. Executive KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Submissions"
          value={totalSubmissions}
          change="+18% this month"
          isPositive={true}
          subtitle="6 monitored services"
          icon={GitPullRequest}
          badge="Lifetime"
        />
        <StatCard
          title="Pending Reviews"
          value={pendingReviews}
          change="Requires manager sign-off"
          isPositive={false}
          subtitle="Active queue"
          icon={Clock}
          badge="In Triage"
        />
        <StatCard
          title="Critical Issues Caught"
          value={criticalIssues}
          change="Intercepted pre-merge"
          isPositive={false}
          subtitle="SQLi, XSS, token leaks"
          icon={ShieldAlert}
          badge="OWASP AST"
        />
        <StatCard
          title="Verified Approvals"
          value={completedReviews}
          change="94.2% acceptance rate"
          isPositive={true}
          subtitle="No regressions reported"
          icon={CheckCircle2}
          badge="Verified"
        />
      </div>

      {/* C & D. Throughput Charts & AI Severity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Throughput Chart */}
        <div className="lg:col-span-2 bg-nocturne-plum border border-nocturne-border rounded-xl p-5 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b border-nocturne-border pb-3">
            <div>
              <h2 className="text-sm font-bold text-nocturne-ivory font-heading">
                Weekly Review Throughput
              </h2>
              <p className="text-xs text-nocturne-grey mt-0.5">
                Automated AI screening vs verified engineering sign-offs
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-nocturne-ivory">
                <span className="w-2.5 h-2.5 rounded bg-wine-700"></span>
                <span>Submissions</span>
              </div>
              <div className="flex items-center gap-1.5 text-nocturne-ivory">
                <span className="w-2.5 h-2.5 rounded bg-pumpkin"></span>
                <span>Approved</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#592C3B" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#592C3B" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E87927" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#E87927" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2C222E" vertical={false} />
                <XAxis dataKey="day" stroke="#A1989A" fontSize={11} tickLine={false} />
                <YAxis stroke="#A1989A" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#17131A',
                    borderColor: '#2C222E',
                    borderRadius: '8px',
                    color: '#F5F2EB',
                    fontSize: '12px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)'
                  }}
                />
                <Area type="monotone" dataKey="submissions" stroke="#592C3B" strokeWidth={2} fillOpacity={1} fill="url(#colorSub)" />
                <Area type="monotone" dataKey="approved" stroke="#E87927" strokeWidth={2} fillOpacity={1} fill="url(#colorApp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="bg-nocturne-plum border border-nocturne-border rounded-xl p-5 shadow-card flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-nocturne-ivory font-heading">
              AI Vulnerability Breakdown
            </h2>
            <p className="text-xs text-nocturne-grey mt-0.5">
              Identified security, logic & quality findings
            </p>
          </div>

          <div className="h-44 w-full my-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2C222E" horizontal={false} />
                <XAxis type="number" stroke="#A1989A" fontSize={11} tickLine={false} />
                <YAxis type="category" dataKey="name" stroke="#A1989A" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#17131A',
                    borderColor: '#2C222E',
                    borderRadius: '8px',
                    color: '#F5F2EB',
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

          <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-nocturne-border text-xs">
            <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-900/40">
              <span className="text-red-400 text-[10px] font-mono uppercase font-semibold block">Critical Risks</span>
              <span className="text-red-300 font-bold text-sm">18 issues</span>
            </div>
            <div className="p-2.5 rounded-lg bg-pumpkin/10 border border-pumpkin/25">
              <span className="text-pumpkin text-[10px] font-mono uppercase font-semibold block">High Warnings</span>
              <span className="text-pumpkin font-bold text-sm">27 issues</span>
            </div>
          </div>
        </div>
      </div>

      {/* E. Recent Submissions Requiring Attention Table */}
      <div className="bg-nocturne-plum border border-nocturne-border rounded-xl overflow-hidden shadow-card">
        <div className="p-4 sm:p-5 border-b border-nocturne-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <SmallPumpkinSVG size={18} />
              <h2 className="text-sm font-bold text-nocturne-ivory font-heading">
                Pending Code Submissions
              </h2>
            </div>
            <p className="text-xs text-nocturne-grey mt-0.5">
              Ranked by risk score and pending status. Click row to inspect findings and code diff.
            </p>
          </div>
          <Link
            to="/manager/submissions"
            className="text-xs text-pumpkin hover:text-pumpkin-dark font-medium flex items-center gap-1 transition-colors"
          >
            <span>View All PRs ({submissions.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-nocturne-charcoal/70 text-nocturne-grey font-mono uppercase tracking-wider text-[11px] border-b border-nocturne-border">
              <tr>
                <th className="py-3 px-4 font-medium">Pull Request</th>
                <th className="py-3 px-4 font-medium">Author</th>
                <th className="py-3 px-4 font-medium">Repository</th>
                <th className="py-3 px-4 font-medium">Language</th>
                <th className="py-3 px-4 font-medium">AI Status</th>
                <th className="py-3 px-4 font-medium">Risk Score</th>
                <th className="py-3 px-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nocturne-border text-nocturne-ivory">
              {sortedSubmissions.map((sub) => (
                <tr
                  key={sub.id}
                  onClick={() => navigate(`/manager/reviews/${sub.id}`)}
                  className="hover:bg-nocturne-wine/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-pumpkin font-bold">#{sub.prNumber}</span>
                      <span className="text-nocturne-ivory font-sans font-medium line-clamp-1 max-w-[220px] lg:max-w-[300px]">
                        {sub.title}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={sub.developer.avatar}
                        alt={sub.developer.name}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-nocturne-border"
                      />
                      <span className="font-medium text-nocturne-ivory">{sub.developer.name}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-nocturne-grey">
                    <span className="px-2 py-0.5 rounded bg-nocturne-charcoal border border-nocturne-border text-[11px] text-nocturne-ivory">
                      {sub.repository.name}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <span className="text-nocturne-grey text-[11px]">
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
                    <span className="inline-flex items-center gap-1 text-xs text-pumpkin font-semibold group-hover:translate-x-0.5 transition-transform">
                      Review
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
