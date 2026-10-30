import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  GitPullRequest, 
  Users, 
  History, 
  FolderGit2, 
  Sliders, 
  Bell, 
  User, 
  Sparkles, 
  ShieldAlert, 
  ChevronLeft, 
  ChevronRight,
  Bot
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role, submissions, notifications } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const pendingCount = submissions.filter(s => s.status === 'ai_completed' || s.status === 'ai_reviewing').length;
  const criticalCount = submissions.filter(s => s.riskLevel === 'critical' || s.riskLevel === 'high').length;
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const managerNav = [
    { name: 'Dashboard Overview', path: '/manager', icon: LayoutDashboard },
    { 
      name: 'Submissions', 
      path: '/manager/submissions', 
      icon: GitPullRequest, 
      badge: pendingCount, 
      badgeColor: 'bg-brand-blue/20 text-brand-blue border-brand-blue/30' 
    },
    { name: 'Developer Management', path: '/manager/developers', icon: Users },
    { name: 'Review History', path: '/manager/history', icon: History },
  ];

  const developerNav = [
    { name: 'Developer Console', path: '/developer', icon: LayoutDashboard },
    { 
      name: 'My Pull Requests', 
      path: '/developer/submissions', 
      icon: GitPullRequest,
      badge: 2,
      badgeColor: 'bg-brand-purple/20 text-brand-purpleLight border-brand-purple/30'
    },
    { name: 'Connected Repositories', path: '/developer/repositories', icon: FolderGit2 },
  ];

  const systemNav = [
    { name: 'GitHub Repositories', path: '/repositories', icon: FolderGit2 },
    { 
      name: 'Notifications', 
      path: '/notifications', 
      icon: Bell,
      badge: unreadNotifs > 0 ? unreadNotifs : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
    { name: 'Model & Rules Config', path: '/settings', icon: Sliders },
    { name: 'User Profile', path: '/profile', icon: User },
  ];

  const currentNav = role === 'manager' ? managerNav : developerNav;

  return (
    <aside
      className={`relative flex flex-col border-r border-dark-border bg-dark-bg transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-20 w-6 h-6 rounded-full bg-dark-card border border-dark-border flex items-center justify-center text-dark-muted hover:text-white shadow-md hover:border-brand-blue transition-colors"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Mode Indicator Banner */}
      <div className={`p-4 border-b border-dark-border/60 ${collapsed ? 'text-center' : ''}`}>
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-dark-dim">
                Active Space
              </span>
              <p className="text-sm font-bold text-white capitalize flex items-center gap-1.5">
                {role === 'manager' ? 'Manager Portal' : 'Developer Hub'}
              </p>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                role === 'manager'
                  ? 'bg-brand-blue/15 text-brand-blue border-brand-blue/30'
                  : 'bg-brand-purple/15 text-brand-purpleLight border-brand-purple/30'
              }`}
            >
              {role}
            </span>
          </div>
        ) : (
          <div
            className={`w-9 h-9 mx-auto rounded-lg flex items-center justify-center border font-mono font-bold text-xs ${
              role === 'manager'
                ? 'bg-brand-blue/15 text-brand-blue border-brand-blue/30'
                : 'bg-brand-purple/15 text-brand-purpleLight border-brand-purple/30'
            }`}
            title={`${role} mode`}
          >
            {role === 'manager' ? 'MGR' : 'DEV'}
          </div>
        )}
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          {!collapsed && (
            <p className="px-3 mb-2 text-[11px] font-mono uppercase tracking-wider text-dark-dim">
              Workflow
            </p>
          )}
          <nav className="space-y-1">
            {currentNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/manager' || item.path === '/developer'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-dark-card text-brand-blue border border-brand-blue/30 shadow-sm'
                      : 'text-dark-muted hover:text-white hover:bg-dark-subtle/70'
                  } ${collapsed ? 'justify-center px-2' : ''}`
                }
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {!collapsed && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate">{item.name}</span>
                    {item.badge !== undefined && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
          {!collapsed && (
            <p className="px-3 mb-2 text-[11px] font-mono uppercase tracking-wider text-dark-dim">
              Integrations & Config
            </p>
          )}
          <nav className="space-y-1">
            {systemNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-dark-card text-brand-blue border border-brand-blue/30 shadow-sm'
                      : 'text-dark-muted hover:text-white hover:bg-dark-subtle/70'
                  } ${collapsed ? 'justify-center px-2' : ''}`
                }
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {!collapsed && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate">{item.name}</span>
                    {item.badge !== undefined && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* AI Engine Status Card (Bottom) */}
      {!collapsed ? (
        <div className="p-3 m-3 rounded-xl bg-gradient-to-b from-dark-card to-dark-subtle border border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 rounded bg-brand-purple/20 text-brand-purpleLight">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Qwen2.5-Coder</p>
              <p className="text-[10px] text-dark-dim font-mono">7B-Instruct Engine</p>
            </div>
          </div>
          <div className="space-y-1.5 text-[11px] text-dark-muted font-mono pt-1 border-t border-dark-border/40">
            <div className="flex justify-between items-center">
              <span>Critical caught:</span>
              <span className="text-rose-400 font-bold">{criticalCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Avg inference:</span>
              <span className="text-emerald-400 font-bold">14s</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 text-center" title="Qwen2.5-Coder 7B active">
          <Bot className="w-5 h-5 mx-auto text-brand-purpleLight" />
        </div>
      )}
    </aside>
  );
};
