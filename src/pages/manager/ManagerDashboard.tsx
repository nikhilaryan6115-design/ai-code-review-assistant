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
import { RunningPumpkinCharge } from '../../components/halloween/RunningPumpkinCharge';

export const ManagerDashboard: React.FC = () => {
  const { submissions, currentUser } = useApp();
  const navigate = useNavigate();
  const [isCharging, setIsCharging] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);

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
    { name: 'Critical', count: 18, color: '#A63232' },
    { name: 'High', count: 27, color: '#B7791F' },
    { name: 'Medium', count: 46, color: '#C5A059' },
    { name: 'Low', count: 82, color: '#4E5A6C' },
  ];

  const handleReviewPendingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCharging) return;

    if (triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect());
    }
    setIsCharging(true);
  };

  const handleChargeComplete = () => {
    navigate('/manager/submissions');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Retained interaction overlay with tasteful transition */}
      <RunningPumpkinCharge 
        isActive={isCharging}
        onComplete={handleChargeComplete}
        startRect={triggerRect}
      />

      {/* A. Editorial Executive Overview Banner */}
      <div className="bg-[#161B22] border border-[#2E3643] rounded p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left summary */}
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-[#1D232C] border border-[#2E3643] text-[#C5A059] font-medium">
                Executive Command
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded bg-[#1D232C] border border-[#2E3643] text-[#96A0B0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]"></span>
                Qwen2.5-Coder 7B Engine
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#F2F4F8] tracking-tight">
                Review Overview & Sign-off Queue
              </h1>
              <p className="text-sm text-[#96A0B0] mt-1 font-sans leading-relaxed">
                Automated pre-screening has evaluated incoming pull requests with static AST analysis and OWASP compliance rules.
              </p>
            </div>

            {/* Metrics ticker */}
            <div className="flex items-center gap-4 text-xs font-mono text-[#96A0B0] pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[#C5A059] font-semibold text-sm">{pendingReviews}</span>
                <span>pending sign-offs</span>
              </div>
              <span className="text-[#2E3643]">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[#E06C75] font-semibold text-sm">{criticalIssues}</span>
                <span>critical vulnerabilities</span>
              </div>
              <span className="text-[#2E3643]">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[#4EAA78] font-semibold text-sm">14s</span>
                <span>avg inspection latency</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center gap-3" ref={triggerRef}>
              <button
                type="button"
                onClick={handleReviewPendingClick}
                disabled={isCharging}
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#C5A059] hover:bg-[#D4AF67] text-[#0E1116] font-medium text-xs tracking-wide transition-colors shadow-sm disabled:opacity-75 cursor-pointer"
                title="Navigate to pending pull requests"
              >
                <span>{isCharging ? 'Loading Submissions...' : `Review Pending Queue (${pendingReviews})`}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>

              <Link
                to="/manager/history"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded bg-[#1D232C] hover:bg-[#252D38] border border-[#2E3643] text-[#F2F4F8] text-xs font-medium transition-colors"
              >
                <span>Inspection Audit Log</span>
              </Link>
            </div>
          </div>

          {/* Right badge */}
          <div className="hidden lg:flex flex-col items-end justify-center pr-4 text-right">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#687487] block">
              Automated Coverage
            </span>
            <span className="font-serif text-2xl text-[#F2F4F8] mt-0.5 block">
              94.2% Pass Rate
            </span>
            <span className="text-xs text-[#96A0B0] font-sans mt-1 max-w-[200px]">
              Catching flaws before manual manager sign-offs
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
          subtitle="6 monitored repositories"
          icon={GitPullRequest}
          badge="Lifetime"
        />
        <StatCard
          title="Pending Sign-Offs"
          value={pendingReviews}
          change="Requires manager triage"
          isPositive={false}
          subtitle="Awaiting authorization"
          icon={Clock}
          badge="In Queue"
        />
        <StatCard
          title="Vulnerabilities Caught"
          value={criticalIssues}
          change="Pre-merge detection"
          isPositive={false}
          subtitle="AST security rules"
          icon={ShieldAlert}
          badge="OWASP 2026"
        />
        <StatCard
          title="Verified Approvals"
          value={completedReviews}
          change="94.2% first-pass accuracy"
          isPositive={true}
          subtitle="Zero regression rollback"
          icon={CheckCircle2}
          badge="Verified"
        />
      </div>

      {/* C & D. Throughput Charts & AI Severity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Throughput Chart */}
        <div className="lg:col-span-2 bg-[#161B22] border border-[#2E3643] rounded p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b border-[#2E3643] pb-3">
            <div>
              <h2 className="text-sm font-serif font-medium text-[#F2F4F8]">
                Weekly Throughput Ledger
              </h2>
              <p className="text-xs text-[#96A0B0] mt-0.5">
                Automated AI screening submissions versus verified engineering authorizations
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-[#F2F4F8]">
                <span className="w-2 h-2 rounded bg-[#1A2332] border border-[#2E3643]"></span>
                <span>Submissions</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#F2F4F8]">
                <span className="w-2 h-2 rounded bg-[#C5A059]"></span>
                <span>Authorized</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2A384F" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2A384F" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A059" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#C5A059" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2E3643" vertical={false} />
                <XAxis dataKey="day" stroke="#96A0B0" fontSize={11} tickLine={false} />
                <YAxis stroke="#96A0B0" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161B22',
                    borderColor: '#2E3643',
                    borderRadius: '4px',
                    color: '#F2F4F8',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
                  }}
                />
                <Area type="monotone" dataKey="submissions" stroke="#4A6184" strokeWidth={1.5} fillOpacity={1} fill="url(#colorSub)" />
                <Area type="monotone" dataKey="approved" stroke="#C5A059" strokeWidth={1.5} fillOpacity={1} fill="url(#colorApp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="bg-[#161B22] border border-[#2E3643] rounded p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-serif font-medium text-[#F2F4F8]">
              Vulnerability Distribution
            </h2>
            <p className="text-xs text-[#96A0B0] mt-0.5">
              Breakdown by detected risk severity
            </p>
          </div>

          <div className="h-44 w-full my-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2E3643" horizontal={false} />
                <XAxis type="number" stroke="#96A0B0" fontSize={11} tickLine={false} />
                <YAxis type="category" dataKey="name" stroke="#96A0B0" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161B22',
                    borderColor: '#2E3643',
                    borderRadius: '4px',
                    color: '#F2F4F8',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" radius={[0, 2, 2, 0]}>
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-[#2E3643] text-xs">
            <div className="p-2.5 rounded bg-[#A63232]/10 border border-[#A63232]/30">
              <span className="text-[#E06C75] text-[10px] font-mono uppercase tracking-wider font-semibold block">Critical Risks</span>
              <span className="text-[#F2B5BC] font-serif text-base font-medium">18 findings</span>
            </div>
            <div className="p-2.5 rounded bg-[#B7791F]/10 border border-[#B7791F]/30">
              <span className="text-[#D4AF67] text-[10px] font-mono uppercase tracking-wider font-semibold block">High Warnings</span>
              <span className="text-[#F2E0BE] font-serif text-base font-medium">27 findings</span>
            </div>
          </div>
        </div>
      </div>

      {/* E. Recent Submissions Requiring Attention Table */}
      <div className="bg-[#161B22] border border-[#2E3643] rounded overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-[#2E3643] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-serif font-medium text-[#F2F4F8]">
              Active Submissions Requiring Attention
            </h2>
            <p className="text-xs text-[#96A0B0] mt-0.5">
              Ranked by pending status and risk score. Select a pull request to inspect diff and automated findings.
            </p>
          </div>
          <Link
            to="/manager/submissions"
            className="text-xs text-[#C5A059] hover:underline font-medium flex items-center gap-1 transition-colors"
          >
            <span>View Full Queue ({submissions.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1D232C] text-[#96A0B0] font-mono uppercase tracking-wider text-[10px] border-b border-[#2E3643]">
              <tr>
                <th className="py-3 px-4 font-medium">Pull Request</th>
                <th className="py-3 px-4 font-medium">Author</th>
                <th className="py-3 px-4 font-medium">Repository</th>
                <th className="py-3 px-4 font-medium">Language</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Risk Assessment</th>
                <th className="py-3 px-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E3643] text-[#F2F4F8]">
              {sortedSubmissions.map((sub) => (
                <tr
                  key={sub.id}
                  onClick={() => navigate(`/manager/reviews/${sub.id}`)}
                  className="hover:bg-[#1D232C]/60 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-[#C5A059] font-medium">#{sub.prNumber}</span>
                      <span className="text-[#F2F4F8] font-sans font-medium line-clamp-1 max-w-[220px] lg:max-w-[300px]">
                        {sub.title}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={sub.developer.avatar}
                        alt={sub.developer.name}
                        className="w-5 h-5 rounded object-cover ring-1 ring-[#2E3643]"
                      />
                      <span className="font-medium text-[#F2F4F8]">{sub.developer.name}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-[#96A0B0]">
                    <span className="px-1.5 py-0.5 rounded bg-[#1D232C] border border-[#2E3643] text-[11px] text-[#F2F4F8]">
                      {sub.repository.name}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono text-[#96A0B0] text-[11px]">
                    {sub.language}
                  </td>

                  <td className="py-3 px-4">
                    <StatusBadge status={sub.status} size="sm" />
                  </td>

                  <td className="py-3 px-4">
                    <RiskBadge level={sub.riskLevel} score={sub.riskScore} size="sm" />
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-xs">
                    <span className="text-[#C5A059] group-hover:underline inline-flex items-center gap-1 font-medium">
                      Review <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
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
