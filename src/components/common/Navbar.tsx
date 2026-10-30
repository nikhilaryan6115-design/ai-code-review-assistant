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
    <header className="sticky top-0 z-40 h-14 border-b border-[#2E3643] bg-[#161B22] px-4 lg:px-6 flex items-center justify-between">
      {/* Left: Brand & Search */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded border border-[#2E3643] bg-[#1A2332] flex items-center justify-center text-[#C5A059]">
            <span className="font-serif font-bold text-sm leading-none">R</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-medium tracking-tight text-[#F2F4F8]">
              Rev<span className="text-[#C5A059]">AI</span>
            </span>
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider bg-[#1F2530] text-[#96A0B0] border border-[#2E3643] uppercase font-medium">
              Qwen2.5-Coder 7B
            </span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center relative w-64 lg:w-72">
          <Search className="w-3.5 h-3.5 text-[#96A0B0] absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search reviews, repos, engineers..."
            className="w-full bg-[#0E1116] border border-[#2E3643] rounded pl-8 pr-8 py-1.5 text-xs text-[#F2F4F8] placeholder-[#96A0B0] focus:outline-none focus:border-[#C5A059] transition-colors font-sans"
          />
          <kbd className="absolute right-2 px-1.5 py-0.5 text-[9px] font-mono text-[#96A0B0] bg-[#161B22] border border-[#2E3643] rounded pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Role Toggle Switcher */}
        <div className="flex items-center bg-[#0E1116] border border-[#2E3643] p-0.5 rounded">
          <button
            onClick={() => {
              if (role !== 'manager') {
                toggleRole();
                navigate('/manager');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              role === 'manager'
                ? 'bg-[#1A2332] text-[#F2F4F8] border border-[#2E3643] font-medium shadow-sm'
                : 'text-[#96A0B0] hover:text-[#F2F4F8]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Manager</span>
          </button>

          <button
            onClick={() => {
              if (role !== 'developer') {
                toggleRole();
                navigate('/developer');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              role === 'developer'
                ? 'bg-[#1A2332] text-[#F2F4F8] border border-[#2E3643] font-medium shadow-sm'
                : 'text-[#96A0B0] hover:text-[#F2F4F8]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Developer</span>
          </button>
        </div>

        {/* Engine Status Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded bg-[#0E1116] border border-[#2E3643] text-xs text-[#96A0B0] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]"></span>
          <span>Engine Active</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded text-[#96A0B0] hover:text-[#F2F4F8] hover:bg-[#1E242E] border border-transparent hover:border-[#2E3643] transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
            )}
          </button>

          <AnimatePresence>
            {showNotifMenu && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-md bg-[#161B22] border border-[#2E3643] shadow-lg py-2 z-50 text-[#F2F4F8]"
              >
                <div className="px-4 py-2 border-b border-[#2E3643] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-serif font-medium text-[#F2F4F8] tracking-wide">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#1A2332] text-[#C5A059] border border-[#2E3643] font-semibold">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-[#C5A059] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#2E3643]/70">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-xs text-[#96A0B0] text-center">No notifications</p>
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
                        className={`p-3 hover:bg-[#1E242E] cursor-pointer transition-colors ${
                          !notif.read ? 'bg-[#1D232C]/60' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {notif.type === 'critical' ? (
                            <ShieldAlert className="w-4 h-4 text-[#A63232] shrink-0 mt-0.5" />
                          ) : notif.type === 'warning' ? (
                            <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                          ) : (
                            <ShieldCheck className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs ${!notif.read ? 'font-medium text-[#F2F4F8]' : 'text-[#96A0B0]'}`}>
                              {notif.title}
                            </p>
                            <p className="text-[11px] text-[#96A0B0] line-clamp-2 mt-0.5 leading-relaxed">
                              {notif.message}
                            </p>
                            <span className="text-[10px] text-[#687487] font-mono mt-1 block">
                              {notif.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 border-t border-[#2E3643] text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotifMenu(false)}
                    className="text-xs text-[#C5A059] font-medium hover:underline transition-colors"
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
            className="flex items-center gap-2 p-1 rounded hover:bg-[#1E242E] border border-transparent hover:border-[#2E3643] transition-colors cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded object-cover ring-1 ring-[#2E3643]"
            />
            <div className="hidden lg:block text-left pr-1">
              <p className="text-xs font-medium text-[#F2F4F8] leading-tight">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-[#96A0B0] leading-tight font-mono">
                {currentUser.role}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#96A0B0] hidden lg:block" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 rounded-md bg-[#161B22] border border-[#2E3643] shadow-lg py-1.5 z-50 text-[#F2F4F8]"
              >
                <div className="px-3 py-2 border-b border-[#2E3643]">
                  <p className="text-xs font-serif font-medium text-[#F2F4F8]">{currentUser.name}</p>
                  <p className="text-[11px] text-[#96A0B0] font-mono truncate">{currentUser.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-[#F2F4F8] hover:bg-[#1E242E] transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-[#96A0B0]" /> Account Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-[#F2F4F8] hover:bg-[#1E242E] transition-colors"
                  >
                    <SettingsIcon className="w-3.5 h-3.5 text-[#96A0B0]" /> Model Configuration
                  </Link>
                  <Link
                    to="/repositories"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-[#F2F4F8] hover:bg-[#1E242E] transition-colors"
                  >
                    <FolderGit2 className="w-3.5 h-3.5 text-[#96A0B0]" /> Git Integrations
                  </Link>
                </div>

                <div className="pt-1 border-t border-[#2E3643]">
                  <Link
                    to="/login"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-[#A63232] hover:bg-[#A63232]/10 transition-colors"
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
