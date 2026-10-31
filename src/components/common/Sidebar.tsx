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
    { name: 'Dashboard', path: '/manager', icon: LayoutDashboard },
    { 
      name: 'Submissions', 
      path: '/manager/submissions', 
      icon: GitPullRequest, 
      badge: pendingCount, 
      badgeColor: 'bg-amber-50 text-ivf-amber border-amber-200' 
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
      badgeColor: 'bg-amber-50 text-ivf-amber border-amber-200'
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
      badgeColor: 'bg-red-50 text-ivf-red border-red-200'
    },
    { name: 'AI & Review Rules', path: '/settings', icon: Sliders },
    { name: 'User Profile', path: '/profile', icon: User },
  ];

  const currentNav = role === 'manager' ? managerNav : developerNav;

  return (
    <aside
      className={`relative flex flex-col border-r border-ivf-border bg-ivf-bg transition-all duration-200 select-none shrink-0 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Collapse toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-5 z-20 w-6 h-6 rounded-md bg-ivf-surface border border-ivf-border flex items-center justify-center text-ivf-sec hover:text-ivf-accent hover:border-ivf-accent/50 shadow-sm transition-colors cursor-pointer"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Role Context Header */}
      <div className={`p-4 border-b border-ivf-border ${collapsed ? 'text-center px-2' : ''}`}>
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-ivf-sec block">
                Perspective
              </span>
              <p className="text-xs font-semibold text-ivf-pri mt-0.5">
                {role === 'manager' ? 'Management' : 'Engineering'}
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-ivf-bgAlt text-ivf-accent border-ivf-border font-medium">
              {role}
            </span>
          </div>
        ) : (
          <div
            className="w-8 h-8 mx-auto rounded-md flex items-center justify-center border font-mono font-medium text-xs bg-ivf-bgAlt text-ivf-accent border-ivf-border"
            title={`${role} perspective`}
          >
            {role === 'manager' ? 'M' : 'D'}
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-6">
        <div>
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] text-ivf-sec font-medium">
              Review Flow
            </p>
          )}
          <nav className="space-y-0.5">
            {currentNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/manager' || item.path === '/developer'}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-ivf-accent/10 text-ivf-accent font-semibold border-l-2 border-ivf-accent'
                      : 'text-ivf-sec hover:bg-ivf-bgAlt hover:text-ivf-pri'
                  } ${collapsed ? 'justify-center px-2 border-l-0' : ''}`
                }
                title={collapsed ? item.name : undefined}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-ivf-accent' : 'text-ivf-sec'}`} />
                    {!collapsed && (
                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <span className="truncate">{item.name}</span>
                        {item.badge !== undefined && (
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${item.badgeColor}`}>
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
            <p className="px-3 mb-2 text-[10px] text-ivf-sec font-medium">
              System Ledger
            </p>
          )}
          <nav className="space-y-0.5">
            {systemNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-ivf-accent/10 text-ivf-accent font-semibold border-l-2 border-ivf-accent'
                      : 'text-ivf-sec hover:bg-ivf-bgAlt hover:text-ivf-pri'
                  } ${collapsed ? 'justify-center px-2 border-l-0' : ''}`
                }
                title={collapsed ? item.name : undefined}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-ivf-accent' : 'text-ivf-sec'}`} />
                    {!collapsed && (
                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <span className="truncate">{item.name}</span>
                        {item.badge !== undefined && (
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${item.badgeColor}`}>
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

      {/* AI Model Status Card (Bottom) */}
      {!collapsed ? (
        <div className="p-3 m-3 rounded-lg bg-ivf-bgAlt border border-ivf-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-md bg-ivf-surface border border-ivf-border text-ivf-accent flex items-center justify-center">
              <Bot className="w-3 h-3" />
            </div>
            <div>
              <p className="text-xs font-semibold text-ivf-pri leading-none">Qwen2.5-Coder</p>
              <p className="text-[10px] text-ivf-sec font-mono mt-0.5">7B-Instruct Engine</p>
            </div>
          </div>
          <div className="space-y-1 text-[11px] text-ivf-sec font-mono pt-1.5 border-t border-ivf-border">
            <div className="flex justify-between items-center">
              <span>Risks flagged:</span>
              <span className="text-ivf-red font-semibold">{criticalCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Avg pre-screen:</span>
              <span className="text-ivf-green font-semibold">14s</span>
            </div>
          </div>
          {/* Ghost ambient decoration in sidebar footer */}
          <div className="mt-2 text-center">
            <span className="ghost-float text-sm" aria-hidden="true">👻</span>
          </div>
        </div>
      ) : (
        <div className="p-3 text-center" title="Qwen2.5-Coder 7B active">
          <Bot className="w-4 h-4 mx-auto text-ivf-accent" />
        </div>
      )}
    </aside>
  );
};
