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
  Bot,
  Zap
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role, submissions, notifications } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const pendingCount = submissions.filter(s => s.status === 'ai_completed' || s.status === 'ai_reviewing').length;
  const criticalCount = submissions.filter(s => s.riskLevel === 'critical' || s.riskLevel === 'high').length;
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const managerNav = [
    { name: 'Dashboard', path: '/manager', icon: LayoutDashboard },
    { 
      name: 'Submissions', 
      path: '/manager/submissions', 
      icon: GitPullRequest, 
      badge: pendingCount, 
      badgeColor: 'bg-buttercream text-wine-900 border-warm-border' 
    },
    { name: 'Team Engineers', path: '/manager/developers', icon: Users },
    { name: 'Review History', path: '/manager/history', icon: History },
  ];

  const developerNav = [
    { name: 'Console', path: '/developer', icon: LayoutDashboard },
    { 
      name: 'My Pull Requests', 
      path: '/developer/submissions', 
      icon: GitPullRequest,
      badge: 2,
      badgeColor: 'bg-buttercream text-wine-900 border-warm-border'
    },
    { name: 'My Repositories', path: '/developer/repositories', icon: FolderGit2 },
  ];

  const systemNav = [
    { name: 'Repositories', path: '/repositories', icon: FolderGit2 },
    { 
      name: 'Notifications', 
      path: '/notifications', 
      icon: Bell,
      badge: unreadNotifs > 0 ? unreadNotifs : undefined,
      badgeColor: 'bg-red-100 text-red-800 border-red-200'
    },
    { name: 'AI & Review Rules', path: '/settings', icon: Sliders },
    { name: 'User Profile', path: '/profile', icon: User },
  ];

  const currentNav = role === 'manager' ? managerNav : developerNav;

  return (
    <aside
      className={`relative flex flex-col border-r border-warm-border bg-warm-white transition-all duration-200 select-none ${
        collapsed ? 'w-18' : 'w-60'
      }`}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-5 z-20 w-6 h-6 rounded-full bg-warm-white border border-warm-border flex items-center justify-center text-warm-muted hover:text-wine shadow-warm-sm hover:border-wine transition-colors"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Role Context Header */}
      <div className={`p-4 border-b border-warm-border ${collapsed ? 'text-center px-2' : ''}`}>
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-warm-dim block leading-none">
                Active Perspective
              </span>
              <p className="text-xs font-semibold text-warm-charcoal mt-1">
                {role === 'manager' ? 'Manager Workspace' : 'Developer Workspace'}
              </p>
            </div>
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded border uppercase bg-buttercream text-wine-800 border-warm-border font-medium"
            >
              {role}
            </span>
          </div>
        ) : (
          <div
            className="w-8 h-8 mx-auto rounded-lg flex items-center justify-center border font-mono font-bold text-xs bg-buttercream text-wine-800 border-warm-border"
            title={`${role} mode`}
          >
            {role === 'manager' ? 'MGR' : 'DEV'}
          </div>
        )}
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-6">
        <div>
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-mono uppercase tracking-wider text-warm-dim font-medium">
              Review Flow
            </p>
          )}
          <nav className="space-y-1">
            {currentNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/manager' || item.path === '/developer'}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-wine text-white shadow-wine-sm font-semibold'
                      : 'text-warm-muted hover:text-warm-charcoal hover:bg-warm-subtle/70'
                  } ${collapsed ? 'justify-center px-2' : ''}`
                }
                title={collapsed ? item.name : undefined}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-tobacco'}`} />
                    {!collapsed && (
                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <span className="truncate">{item.name}</span>
                        {item.badge !== undefined && (
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold border ${
                            isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-mono uppercase tracking-wider text-warm-dim font-medium">
              Configuration
            </p>
          )}
          <nav className="space-y-1">
            {systemNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-wine text-white shadow-wine-sm font-semibold'
                      : 'text-warm-muted hover:text-warm-charcoal hover:bg-warm-subtle/70'
                  } ${collapsed ? 'justify-center px-2' : ''}`
                }
                title={collapsed ? item.name : undefined}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-tobacco'}`} />
                    {!collapsed && (
                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <span className="truncate">{item.name}</span>
                        {item.badge !== undefined && (
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold border ${
                            isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* AI Engine Status Card (Bottom) */}
      {!collapsed ? (
        <div className="p-3 m-3 rounded-xl bg-warm-subtle/60 border border-warm-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-wine/10 text-wine flex items-center justify-center">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-warm-charcoal leading-none">Qwen2.5-Coder</p>
              <p className="text-[10px] text-warm-muted font-mono mt-0.5">7B-Instruct Engine</p>
            </div>
          </div>
          <div className="space-y-1 text-[11px] text-warm-muted font-mono pt-1.5 border-t border-warm-border/60">
            <div className="flex justify-between items-center">
              <span>Critical prevented:</span>
              <span className="text-wine font-bold">{criticalCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Avg pre-check:</span>
              <span className="text-emerald-700 font-bold">14s</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 text-center" title="Qwen2.5-Coder 7B active">
          <Bot className="w-4 h-4 mx-auto text-wine" />
        </div>
      )}
    </aside>
  );
};
