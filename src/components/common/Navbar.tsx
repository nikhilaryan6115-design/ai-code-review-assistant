import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Search, 
  Cpu, 
  ShieldCheck, 
  CheckCheck, 
  Sparkles, 
  UserCheck, 
  Code2, 
  ChevronDown, 
  LogOut, 
  User, 
  Settings as SettingsIcon,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    role, 
    toggleRole, 
    currentUser, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    globalSearch,
    setGlobalSearch
  } = useApp();
  
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-dark-border bg-dark-bg/80 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between">
      {/* Left: Brand & Engine Badge */}
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center shadow-glow-blue group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white font-mono">
                Rev<span className="text-brand-blue">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-brand-purple/15 text-brand-purpleLight border border-brand-purple/30">
                Qwen2.5-Coder 7B
              </span>
            </div>
            <p className="text-[11px] text-dark-dim leading-none hidden md:block">
              Intelligent Pre-Review Assistant
            </p>
          </div>
        </Link>

        {/* Global Search */}
        <div className="hidden md:flex items-center relative ml-6 w-64 lg:w-80">
          <Search className="w-4 h-4 text-dark-muted absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search PRs, repos, developers, CWEs..."
            className="w-full bg-dark-subtle/80 border border-dark-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-dark-text placeholder-dark-dim focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/30 transition-colors font-mono"
          />
          <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-mono text-dark-dim bg-dark-card border border-dark-border rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Role Switcher & Action controls */}
      <div className="flex items-center gap-3">
        {/* Role Toggle Pill */}
        <div className="flex items-center bg-dark-subtle border border-dark-border p-1 rounded-lg">
          <button
            onClick={() => {
              if (role !== 'manager') {
                toggleRole();
                navigate('/manager');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              role === 'manager'
                ? 'bg-brand-blue text-white shadow-sm'
                : 'text-dark-muted hover:text-dark-text'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Manager</span>
          </button>

          <button
            onClick={() => {
              if (role !== 'developer') {
                toggleRole();
                navigate('/developer');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              role === 'developer'
                ? 'bg-brand-purple text-white shadow-sm'
                : 'text-dark-muted hover:text-dark-text'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Developer</span>
          </button>
        </div>

        {/* Live Model Health Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-md bg-dark-card border border-dark-border text-xs font-mono text-dark-muted">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span>Qwen2.5-Coder: 7B active</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-lg text-dark-muted hover:text-white hover:bg-dark-card border border-transparent hover:border-dark-border transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-dark-bg" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-dark-card border border-dark-border shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-dark-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-brand-blue hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-dark-border/50">
                {notifications.length === 0 ? (
                  <p className="p-4 text-xs text-dark-dim text-center">No notifications</p>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.submissionId) {
                          navigate(`/manager/reviews/${notif.submissionId}`);
                          setShowNotifMenu(false);
                        }
                      }}
                      className={`p-3 hover:bg-dark-subtle/80 cursor-pointer transition-colors ${
                        !notif.read ? 'bg-dark-subtle/40' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {notif.type === 'critical' ? (
                          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        ) : notif.type === 'warning' ? (
                          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        ) : (
                          <ShieldCheck className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs ${!notif.read ? 'font-semibold text-white' : 'text-dark-text'}`}>
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-dark-muted line-clamp-2 mt-0.5">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-dark-dim font-mono mt-1 block">
                            {notif.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-dark-border text-center">
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifMenu(false)}
                  className="text-xs text-dark-muted hover:text-white transition-colors"
                >
                  View all notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-dark-card border border-transparent hover:border-dark-border transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-dark-border"
            />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-white leading-tight">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-dark-dim uppercase font-mono tracking-wider">
                {currentUser.role}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-dark-dim hidden lg:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-dark-card border border-dark-border shadow-2xl py-1.5 z-50">
              <div className="px-4 py-2 border-b border-dark-border">
                <p className="text-xs font-semibold text-white">{currentUser.name}</p>
                <p className="text-[11px] text-dark-dim font-mono truncate">{currentUser.email}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-dark-muted hover:text-white hover:bg-dark-subtle transition-colors"
                >
                  <User className="w-4 h-4 text-dark-dim" /> Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-dark-muted hover:text-white hover:bg-dark-subtle transition-colors"
                >
                  <SettingsIcon className="w-4 h-4 text-dark-dim" /> Settings & Model Config
                </Link>
                <Link
                  to="/repositories"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-dark-muted hover:text-white hover:bg-dark-subtle transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-dark-dim" /> Connect GitHub
                </Link>
              </div>

              <div className="pt-1 border-t border-dark-border">
                <Link
                  to="/login"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
