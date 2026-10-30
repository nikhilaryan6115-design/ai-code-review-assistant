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
          <h1 className="text-xl sm:text-2xl font-bold text-warm-charcoal tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-wine" />
            Notifications & System Alerts
          </h1>
          <p className="text-xs text-warm-muted mt-1">
            Real-time feed of automated Qwen2.5-Coder detections, manager review sign-offs, and webhook dispatches.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warm-white border border-warm-border text-xs font-mono text-warm-charcoal hover:bg-warm-subtle transition-colors shadow-warm-sm"
        >
          <CheckCheck className="w-4 h-4 text-wine" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs font-mono">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            filterType === 'all' ? 'bg-wine text-white font-bold' : 'bg-warm-white text-warm-muted hover:text-warm-charcoal border border-warm-border'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilterType('unread')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            filterType === 'unread' ? 'bg-wine text-white font-bold' : 'bg-warm-white text-warm-muted hover:text-warm-charcoal border border-warm-border'
          }`}
        >
          Unread ({notifications.filter(n => !n.read).length})
        </button>
        <button
          onClick={() => setFilterType('critical')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            filterType === 'critical' ? 'bg-red-800 text-white font-bold' : 'bg-warm-white text-red-800 hover:bg-red-50 border border-red-200'
          }`}
        >
          Critical Vulnerabilities
        </button>
      </div>

      {/* List */}
      <div className="bg-warm-white border border-warm-border rounded-xl divide-y divide-warm-border/60 overflow-hidden shadow-warm-sm">
        {filteredNotifs.length === 0 ? (
          <div className="p-8 text-center text-warm-muted text-xs font-mono">
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
              className={`p-4 hover:bg-warm-subtle/50 transition-colors cursor-pointer flex items-start gap-3.5 ${
                !notif.read ? 'bg-buttercream/25' : ''
              }`}
            >
              {/* Type icon */}
              <div className="p-2 rounded-lg bg-warm-subtle/80 border border-warm-border shrink-0 mt-0.5">
                {notif.type === 'critical' ? (
                  <ShieldAlert className="w-4 h-4 text-red-700" />
                ) : notif.type === 'warning' ? (
                  <Sparkles className="w-4 h-4 text-amber-700" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-wine" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs ${!notif.read ? 'font-bold text-warm-charcoal' : 'font-semibold text-warm-charcoal'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] font-mono text-warm-muted">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-xs text-warm-muted mt-1 leading-relaxed">
                  {notif.message}
                </p>
                {notif.prNumber && (
                  <span className="inline-block mt-2 text-[11px] font-mono text-wine hover:underline font-medium">
                    Inspect Pull Request #{notif.prNumber} →
                  </span>
                )}
              </div>

              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-wine shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
