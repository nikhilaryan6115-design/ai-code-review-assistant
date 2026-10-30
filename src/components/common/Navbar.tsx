import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Search, 
  Sparkles, 
  UserCheck, 
  Code2, 
  ChevronDown, 
  LogOut, 
  User, 
  Settings as SettingsIcon,
  FolderGit2,
  CheckCheck,
  ShieldAlert,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

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
    <header className="sticky top-0 z-40 h-15 border-b border-warm-border bg-warm-white/95 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between">
      {/* Left: Brand & Search */}
      <div className="flex items-center gap-5">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-wine flex items-center justify-center text-buttercream shadow-wine-sm group-hover:bg-wine-800 transition-colors">
            <Code2 className="w-4 h-4 text-buttercream" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-warm-charcoal font-sans">
                Rev<span className="text-wine">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider bg-buttercream/80 text-tobacco-800 border border-warm-border font-medium">
                Qwen2.5-Coder 7B
              </span>
            </div>
          </div>
        </Link>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center relative w-64 lg:w-72">
          <Search className="w-3.5 h-3.5 text-warm-muted absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search PRs, repos, engineers..."
            className="w-full bg-warm-bg/70 border border-warm-border rounded-lg pl-8 pr-8 py-1.5 text-xs text-warm-charcoal placeholder-warm-dim focus:outline-none focus:border-wine focus:bg-warm-white transition-all font-sans"
          />
          <kbd className="absolute right-2 px-1.5 py-0.5 text-[9px] font-mono text-warm-muted bg-warm-white border border-warm-border rounded shadow-warm-sm pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Role Toggle Switcher */}
        <div className="flex items-center bg-warm-subtle border border-warm-border p-1 rounded-lg">
          <button
            onClick={() => {
              if (role !== 'manager') {
                toggleRole();
                navigate('/manager');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              role === 'manager'
                ? 'bg-wine text-white shadow-sm font-semibold'
                : 'text-warm-muted hover:text-warm-charcoal'
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
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              role === 'developer'
                ? 'bg-wine text-white shadow-sm font-semibold'
                : 'text-warm-muted hover:text-warm-charcoal'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Developer</span>
          </button>
        </div>

        {/* AI Model Health Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-md bg-warm-subtle/60 border border-warm-border text-xs text-warm-muted font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          <span>Qwen2.5-Coder: 7B ready</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-1.5 rounded-lg text-warm-muted hover:text-warm-charcoal hover:bg-warm-subtle border border-transparent hover:border-warm-border transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-wine ring-2 ring-warm-white" />
            )}
          </button>

          <AnimatePresence>
            {showNotifMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-warm-white border border-warm-border shadow-warm-dropdown py-2 z-50 text-warm-charcoal"
              >
                <div className="px-4 py-2 border-b border-warm-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-warm-charcoal uppercase tracking-wider">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-wine-50 text-wine-800 border border-wine-200 font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-wine hover:underline flex items-center gap-1 font-medium"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-warm-border/50">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-xs text-warm-muted text-center">No notifications</p>
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
                        className={`p-3 hover:bg-warm-subtle/50 cursor-pointer transition-colors ${
                          !notif.read ? 'bg-buttercream/30' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {notif.type === 'critical' ? (
                            <ShieldAlert className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                          ) : notif.type === 'warning' ? (
                            <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          ) : (
                            <ShieldCheck className="w-4 h-4 text-wine-700 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs ${!notif.read ? 'font-semibold text-warm-charcoal' : 'text-warm-muted'}`}>
                              {notif.title}
                            </p>
                            <p className="text-[11px] text-warm-muted line-clamp-2 mt-0.5 leading-relaxed">
                              {notif.message}
                            </p>
                            <span className="text-[10px] text-warm-dim font-mono mt-1 block">
                              {notif.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 border-t border-warm-border text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotifMenu(false)}
                    className="text-xs text-wine font-medium hover:underline transition-colors"
                  >
                    View all notifications →
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-warm-subtle border border-transparent hover:border-warm-border transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-warm-border"
            />
            <div className="hidden lg:block text-left pr-1">
              <p className="text-xs font-semibold text-warm-charcoal leading-tight">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-warm-muted leading-tight">
                {currentUser.role}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-warm-dim hidden lg:block" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 rounded-xl bg-warm-white border border-warm-border shadow-warm-dropdown py-1.5 z-50 text-warm-charcoal"
              >
                <div className="px-3 py-2 border-b border-warm-border">
                  <p className="text-xs font-semibold text-warm-charcoal">{currentUser.name}</p>
                  <p className="text-[11px] text-warm-muted font-mono truncate">{currentUser.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-warm-charcoal hover:bg-warm-subtle transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-tobacco" /> Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-warm-charcoal hover:bg-warm-subtle transition-colors"
                  >
                    <SettingsIcon className="w-3.5 h-3.5 text-tobacco" /> Settings & Model Config
                  </Link>
                  <Link
                    to="/repositories"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-warm-charcoal hover:bg-warm-subtle transition-colors"
                  >
                    <FolderGit2 className="w-3.5 h-3.5 text-tobacco" /> Connected Repositories
                  </Link>
                </div>

                <div className="pt-1 border-t border-warm-border">
                  <Link
                    to="/login"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
