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
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CrescentMoonSVG } from '../halloween/MoonSVG';

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
    <header className="sticky top-0 z-40 h-14 border-b border-nocturne-border bg-nocturne-plum px-4 lg:px-6 flex items-center justify-between">
      {/* Left: Brand & Search */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-wine-700 flex items-center justify-center text-pumpkin group-hover:bg-wine-800 transition-colors">
            <CrescentMoonSVG size={18} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-nocturne-ivory font-heading">
              Rev<span className="text-pumpkin">AI</span>
            </span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono tracking-wider bg-nocturne-charcoal text-nocturne-grey border border-nocturne-border font-medium">
              Qwen2.5-Coder 7B
            </span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center relative w-64 lg:w-72">
          <Search className="w-3.5 h-3.5 text-nocturne-grey absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search PRs, repos, engineers..."
            className="w-full bg-nocturne-charcoal/80 border border-nocturne-border rounded-lg pl-8 pr-8 py-1.5 text-xs text-nocturne-ivory placeholder-nocturne-grey focus:outline-none focus:border-pumpkin/50 focus:bg-nocturne-charcoal transition-all font-sans"
          />
          <kbd className="absolute right-2 px-1.5 py-0.5 text-[9px] font-mono text-nocturne-grey bg-nocturne-plum border border-nocturne-border rounded pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Role Toggle Switcher */}
        <div className="flex items-center bg-nocturne-charcoal border border-nocturne-border p-1 rounded-lg">
          <button
            onClick={() => {
              if (role !== 'manager') {
                toggleRole();
                navigate('/manager');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
              role === 'manager'
                ? 'bg-pumpkin text-nocturne-bg font-semibold shadow-sm'
                : 'text-nocturne-grey hover:text-nocturne-ivory'
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
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
              role === 'developer'
                ? 'bg-pumpkin text-nocturne-bg font-semibold shadow-sm'
                : 'text-nocturne-grey hover:text-nocturne-ivory'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Developer</span>
          </button>
        </div>

        {/* AI Model Health Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-md bg-nocturne-charcoal border border-nocturne-border text-xs text-nocturne-grey font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Engine Online</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-lg text-nocturne-grey hover:text-nocturne-ivory hover:bg-nocturne-charcoal border border-transparent hover:border-nocturne-border transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pumpkin" />
            )}
          </button>

          <AnimatePresence>
            {showNotifMenu && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-nocturne-plum border border-nocturne-border shadow-dropdown py-2 z-50 text-nocturne-ivory"
              >
                <div className="px-4 py-2 border-b border-nocturne-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-nocturne-ivory uppercase tracking-wider">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-pumpkin/20 text-pumpkin border border-pumpkin/30 font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-pumpkin hover:underline flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-nocturne-border">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-xs text-nocturne-grey text-center">No notifications</p>
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
                        className={`p-3 hover:bg-nocturne-wine/50 cursor-pointer transition-colors ${
                          !notif.read ? 'bg-nocturne-charcoal/60' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {notif.type === 'critical' ? (
                            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          ) : notif.type === 'warning' ? (
                            <Sparkles className="w-4 h-4 text-pumpkin shrink-0 mt-0.5" />
                          ) : (
                            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs ${!notif.read ? 'font-semibold text-nocturne-ivory' : 'text-nocturne-grey'}`}>
                              {notif.title}
                            </p>
                            <p className="text-[11px] text-nocturne-grey line-clamp-2 mt-0.5 leading-relaxed">
                              {notif.message}
                            </p>
                            <span className="text-[10px] text-nocturne-grey/70 font-mono mt-1 block">
                              {notif.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 border-t border-nocturne-border text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotifMenu(false)}
                    className="text-xs text-pumpkin font-medium hover:underline transition-colors"
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
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-nocturne-charcoal border border-transparent hover:border-nocturne-border transition-colors cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-nocturne-border"
            />
            <div className="hidden lg:block text-left pr-1">
              <p className="text-xs font-semibold text-nocturne-ivory leading-tight">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-nocturne-grey leading-tight">
                {currentUser.role}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-nocturne-grey hidden lg:block" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 rounded-xl bg-nocturne-plum border border-nocturne-border shadow-dropdown py-1.5 z-50 text-nocturne-ivory"
              >
                <div className="px-3 py-2 border-b border-nocturne-border">
                  <p className="text-xs font-semibold text-nocturne-ivory">{currentUser.name}</p>
                  <p className="text-[11px] text-nocturne-grey font-mono truncate">{currentUser.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-nocturne-ivory hover:bg-nocturne-wine transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-nocturne-grey" /> Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-nocturne-ivory hover:bg-nocturne-wine transition-colors"
                  >
                    <SettingsIcon className="w-3.5 h-3.5 text-nocturne-grey" /> Settings & Model Config
                  </Link>
                  <Link
                    to="/repositories"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-nocturne-ivory hover:bg-nocturne-wine transition-colors"
                  >
                    <FolderGit2 className="w-3.5 h-3.5 text-nocturne-grey" /> Connected Repositories
                  </Link>
                </div>

                <div className="pt-1 border-t border-nocturne-border">
                  <Link
                    to="/login"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-red-400 hover:bg-red-950/30 transition-colors"
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
