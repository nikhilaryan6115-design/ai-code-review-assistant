import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Search, 
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
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RevAILogo } from '../brand/RevAILogo';

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
    <header className="sticky top-0 z-40 h-14 border-b border-ivf-border bg-ivf-bg px-4 lg:px-6 flex items-center justify-between shadow-[0_1px_4px_var(--color-shadow)]">
      {/* Left: Brand & Search */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <RevAILogo
            layout="full"
            size="sm"
            showBadge={true}
            animated={true}
            theme="light"
          />
          <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider bg-ivf-bgAlt text-ivf-sec border border-ivf-border uppercase font-medium ml-1">
            Qwen2.5-Coder 7B
          </span>
        </Link>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center relative w-64 lg:w-72">
          <Search className="w-3.5 h-3.5 text-ivf-sec absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search reviews, repos, engineers..."
            className="w-full bg-ivf-bgAlt border border-ivf-border rounded-lg pl-8 pr-8 py-1.5 text-xs text-ivf-pri placeholder-ivf-sec focus:outline-none focus:ring-1 focus:ring-ivf-accent focus:border-ivf-accent transition-colors font-sans"
          />
          <kbd className="absolute right-2 px-1.5 py-0.5 text-[9px] font-mono text-ivf-sec bg-ivf-bg border border-ivf-border rounded pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Role Toggle — segmented control */}
        <div className="flex items-center bg-ivf-bgAlt rounded-lg p-0.5">
          <button
            onClick={() => {
              if (role !== 'manager') {
                toggleRole();
                navigate('/manager');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              role === 'manager'
                ? 'bg-ivf-accent text-white shadow-sm'
                : 'text-ivf-sec hover:text-ivf-pri'
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              role === 'developer'
                ? 'bg-ivf-accent text-white shadow-sm'
                : 'text-ivf-sec hover:text-ivf-pri'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Developer</span>
          </button>
        </div>

        {/* Engine Status Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-ivf-bgAlt border border-ivf-border text-xs text-ivf-sec font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-ivf-green"></span>
          <span>Engine Active</span>
        </div>

        {/* Ghost ambient decoration */}
        <span className="ghost-float hidden xl:inline-block" aria-hidden="true">👻</span>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-lg text-ivf-sec hover:text-ivf-pri hover:bg-ivf-bgAlt border border-transparent hover:border-ivf-border transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-ivf-accent2" />
            )}
          </button>

          <AnimatePresence>
            {showNotifMenu && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg bg-ivf-surface border border-ivf-border shadow-lg py-2 z-50 text-ivf-pri"
              >
                <div className="px-4 py-2 border-b border-ivf-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-ivf-pri">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-ivf-bgAlt text-ivf-accent2 border border-ivf-border font-semibold">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-ivf-accent hover:underline flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-ivf-border/70">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-xs text-ivf-sec text-center">No notifications</p>
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
                        className={`p-3 hover:bg-ivf-bgAlt cursor-pointer transition-colors ${
                          !notif.read ? 'bg-ivf-bgAlt/50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {notif.type === 'critical' ? (
                            <ShieldAlert className="w-4 h-4 text-ivf-red shrink-0 mt-0.5" />
                          ) : notif.type === 'warning' ? (
                            <Sparkles className="w-4 h-4 text-ivf-amber shrink-0 mt-0.5" />
                          ) : (
                            <ShieldCheck className="w-4 h-4 text-ivf-green shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs ${!notif.read ? 'font-semibold text-ivf-pri' : 'text-ivf-sec'}`}>
                              {notif.title}
                            </p>
                            <p className="text-[11px] text-ivf-sec line-clamp-2 mt-0.5 leading-relaxed">
                              {notif.message}
                            </p>
                            <span className="text-[10px] text-ivf-sec font-mono mt-1 block">
                              {notif.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 border-t border-ivf-border text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotifMenu(false)}
                    className="text-xs text-ivf-accent font-medium hover:underline transition-colors"
                  >
                    View audit ledger →
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
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-ivf-bgAlt border border-transparent hover:border-ivf-border transition-colors cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-ivf-border"
            />
            <div className="hidden lg:block text-left pr-1">
              <p className="text-xs font-medium text-ivf-pri leading-tight">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-ivf-sec leading-tight font-mono">
                {currentUser.role}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-ivf-sec hidden lg:block" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 rounded-lg bg-ivf-surface border border-ivf-border shadow-lg py-1.5 z-50 text-ivf-pri"
              >
                <div className="px-3 py-2 border-b border-ivf-border">
                  <p className="text-xs font-semibold text-ivf-pri">{currentUser.name}</p>
                  <p className="text-[11px] text-ivf-sec font-mono truncate">{currentUser.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-ivf-pri hover:bg-ivf-bgAlt transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-ivf-sec" /> Account Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-ivf-pri hover:bg-ivf-bgAlt transition-colors"
                  >
                    <SettingsIcon className="w-3.5 h-3.5 text-ivf-sec" /> Model Configuration
                  </Link>
                  <Link
                    to="/repositories"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-ivf-pri hover:bg-ivf-bgAlt transition-colors"
                  >
                    <FolderGit2 className="w-3.5 h-3.5 text-ivf-sec" /> Git Integrations
                  </Link>
                </div>

                <div className="pt-1 border-t border-ivf-border">
                  <Link
                    to="/login"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-ivf-red hover:bg-red-50 transition-colors"
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
