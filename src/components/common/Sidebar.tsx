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
      badgeColor: 'bg-[#C5A059]/15 text-[#C5A059] border-[#C5A059]/30' 
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
      badgeColor: 'bg-[#C5A059]/15 text-[#C5A059] border-[#C5A059]/30'
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
      badgeColor: 'bg-[#A63232]/15 text-[#E06C75] border-[#A63232]/30'
    },
    { name: 'AI & Review Rules', path: '/settings', icon: Sliders },
    { name: 'User Profile', path: '/profile', icon: User },
  ];

  const currentNav = role === 'manager' ? managerNav : developerNav;

  return (
    <aside
      className={`relative flex flex-col border-r border-[#2E3643] bg-[#0E1116] transition-all duration-200 select-none shrink-0 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Collapse toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-5 z-20 w-6 h-6 rounded bg-[#161B22] border border-[#2E3643] flex items-center justify-center text-[#96A0B0] hover:text-[#C5A059] hover:border-[#C5A059]/50 shadow-sm transition-colors cursor-pointer"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Role Context Header */}
      <div className={`p-4 border-b border-[#2E3643] ${collapsed ? 'text-center px-2' : ''}`}>
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#96A0B0] block">
                Perspective
              </span>
              <p className="text-xs font-serif font-medium text-[#F2F4F8] mt-0.5">
                {role === 'manager' ? 'Management' : 'Engineering'}
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border uppercase bg-[#161B22] text-[#C5A059] border-[#2E3643] font-medium tracking-wide">
              {role}
            </span>
          </div>
        ) : (
          <div
            className="w-8 h-8 mx-auto rounded flex items-center justify-center border font-mono font-medium text-xs bg-[#161B22] text-[#C5A059] border-[#2E3643]"
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
            <p className="px-3 mb-2 text-[10px] font-mono uppercase tracking-widest text-[#687487] font-semibold">
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
                  `flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#161B22] text-[#F2F4F8] font-semibold border-l-2 border-[#C5A059]'
                      : 'text-[#96A0B0] hover:text-[#F2F4F8] hover:bg-[#161B22]/60'
                  } ${collapsed ? 'justify-center px-2 border-l-0' : ''}`
                }
                title={collapsed ? item.name : undefined}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C5A059]' : 'text-[#96A0B0]'}`} />
                    {!collapsed && (
                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <span className="truncate">{item.name}</span>
                        {item.badge !== undefined && (
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-medium border ${item.badgeColor}`}>
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
            <p className="px-3 mb-2 text-[10px] font-mono uppercase tracking-widest text-[#687487] font-semibold">
              System Ledger
            </p>
          )}
          <nav className="space-y-0.5">
            {systemNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#161B22] text-[#F2F4F8] font-semibold border-l-2 border-[#C5A059]'
                      : 'text-[#96A0B0] hover:text-[#F2F4F8] hover:bg-[#161B22]/60'
                  } ${collapsed ? 'justify-center px-2 border-l-0' : ''}`
                }
                title={collapsed ? item.name : undefined}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C5A059]' : 'text-[#96A0B0]'}`} />
                    {!collapsed && (
                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <span className="truncate">{item.name}</span>
                        {item.badge !== undefined && (
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-medium border ${item.badgeColor}`}>
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
        <div className="p-3 m-3 rounded bg-[#161B22] border border-[#2E3643]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded bg-[#1D232C] border border-[#2E3643] text-[#C5A059] flex items-center justify-center">
              <Bot className="w-3 h-3" />
            </div>
            <div>
              <p className="text-xs font-serif font-medium text-[#F2F4F8] leading-none">Qwen2.5-Coder</p>
              <p className="text-[10px] text-[#96A0B0] font-mono mt-0.5">7B-Instruct Engine</p>
            </div>
          </div>
          <div className="space-y-1 text-[11px] text-[#96A0B0] font-mono pt-1.5 border-t border-[#2E3643]">
            <div className="flex justify-between items-center">
              <span>Risks flagged:</span>
              <span className="text-[#A63232] font-semibold">{criticalCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Avg pre-screen:</span>
              <span className="text-[#2D6A4F] font-semibold">14s</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 text-center" title="Qwen2.5-Coder 7B active">
          <Bot className="w-4 h-4 mx-auto text-[#C5A059]" />
        </div>
      )}
    </aside>
  );
};
