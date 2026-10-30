import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  ShieldAlert, 
  Sparkles, 
  ShieldCheck, 
  CheckCheck, 
  ArrowRight
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !n.read;
    return n.type === filterType;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-normal text-[#F2F4F8] tracking-tight flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-editorial-brass" />
            Notifications & System Alerts
          </h1>
          <p className="text-xs text-editorial-slate mt-1">
            Real-time feed of automated Qwen2.5-Coder detections, manager review sign-offs, and webhook dispatches.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-editorial-surface border border-editorial-border text-xs font-mono text-[#F2F4F8] hover:bg-editorial-subtle transition-editorial shadow-editorial-card cursor-pointer"
        >
          <CheckCheck className="w-4 h-4 text-editorial-brass" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs font-mono">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded transition-editorial cursor-pointer ${
            filterType === 'all' ? 'bg-editorial-navy text-[#F2F4F8] font-medium border border-editorial-border' : 'bg-editorial-surface text-editorial-muted hover:text-[#F2F4F8] border border-editorial-border'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilterType('unread')}
          className={`px-3 py-1.5 rounded transition-editorial cursor-pointer ${
            filterType === 'unread' ? 'bg-editorial-brass text-editorial-bg font-semibold border border-editorial-brass' : 'bg-editorial-surface text-editorial-muted hover:text-[#F2F4F8] border border-editorial-border'
          }`}
        >
          Unread ({notifications.filter(n => !n.read).length})
        </button>
        <button
          onClick={() => setFilterType('critical')}
          className={`px-3 py-1.5 rounded transition-editorial cursor-pointer ${
            filterType === 'critical' ? 'bg-editorial-crimson/20 text-editorial-crimson font-medium border border-editorial-crimson/40' : 'bg-editorial-surface text-editorial-crimson/80 hover:text-editorial-crimson border border-editorial-border'
          }`}
        >
          Critical Vulnerabilities
        </button>
      </div>

      {/* List */}
      <div className="bg-editorial-surface border border-editorial-border rounded-md divide-y divide-editorial-border overflow-hidden shadow-editorial-card">
        {filteredNotifs.length === 0 ? (
          <div className="p-8 text-center text-editorial-muted text-xs font-mono">
            No notifications found in this category.
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.submissionId) {
                  navigate(`/manager/reviews/${notif.submissionId}`);
                }
              }}
              className={`p-4 hover:bg-editorial-subtle/50 transition-editorial cursor-pointer flex items-start gap-3.5 ${
                !notif.read ? 'bg-editorial-subtle/25' : ''
              }`}
            >
              {/* Type icon */}
              <div className="p-2 rounded bg-editorial-subtle border border-editorial-border shrink-0 mt-0.5">
                {notif.type === 'critical' ? (
                  <ShieldAlert className="w-4 h-4 text-editorial-crimson" />
                ) : notif.type === 'warning' ? (
                  <Sparkles className="w-4 h-4 text-editorial-ochre" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-editorial-ivy" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs ${!notif.read ? 'font-serif font-medium text-[#F2F4F8]' : 'font-serif text-[#F2F4F8]/80'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] font-mono text-editorial-muted">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-xs text-editorial-slate mt-1 leading-relaxed font-sans">
                  {notif.message}
                </p>
                {notif.prNumber && (
                  <span className="inline-block mt-2 text-[11px] font-mono text-editorial-brass hover:underline font-medium">
                    Inspect Pull Request #{notif.prNumber} →
                  </span>
                )}
              </div>

              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-editorial-brass shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
