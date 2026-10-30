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
          <h1 className="text-xl sm:text-2xl font-bold text-nocturne-ivory tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-pumpkin" />
            Notifications & System Alerts
          </h1>
          <p className="text-xs text-nocturne-grey mt-1">
            Real-time feed of automated Qwen2.5-Coder detections, manager review sign-offs, and webhook dispatches.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-nocturne-plum border border-nocturne-border text-xs font-mono text-nocturne-ivory hover:bg-nocturne-wine transition-colors shadow-card"
        >
          <CheckCheck className="w-4 h-4 text-pumpkin" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs font-mono">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            filterType === 'all' ? 'bg-pumpkin text-nocturne-bg font-semibold' : 'bg-nocturne-plum text-nocturne-grey hover:text-nocturne-ivory border border-nocturne-border'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilterType('unread')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            filterType === 'unread' ? 'bg-pumpkin text-nocturne-bg font-semibold' : 'bg-nocturne-plum text-nocturne-grey hover:text-nocturne-ivory border border-nocturne-border'
          }`}
        >
          Unread ({notifications.filter(n => !n.read).length})
        </button>
        <button
          onClick={() => setFilterType('critical')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            filterType === 'critical' ? 'bg-red-800 text-white font-bold' : 'bg-nocturne-plum text-red-400 hover:bg-red-950/40 border border-red-900/40'
          }`}
        >
          Critical Vulnerabilities
        </button>
      </div>

      {/* List */}
      <div className="bg-nocturne-plum border border-nocturne-border rounded-xl divide-y divide-nocturne-border/60 overflow-hidden shadow-card">
        {filteredNotifs.length === 0 ? (
          <div className="p-8 text-center text-nocturne-grey text-xs font-mono">
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
              className={`p-4 hover:bg-nocturne-charcoal transition-colors cursor-pointer flex items-start gap-3.5 ${
                !notif.read ? 'bg-nocturne-charcoal/25' : ''
              }`}
            >
              {/* Type icon */}
              <div className="p-2 rounded-lg bg-nocturne-charcoal border border-nocturne-border shrink-0 mt-0.5">
                {notif.type === 'critical' ? (
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                ) : notif.type === 'warning' ? (
                  <Sparkles className="w-4 h-4 text-pumpkin" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-pumpkin" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs ${!notif.read ? 'font-bold text-nocturne-ivory' : 'font-semibold text-nocturne-ivory'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] font-mono text-nocturne-grey">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-xs text-nocturne-grey mt-1 leading-relaxed">
                  {notif.message}
                </p>
                {notif.prNumber && (
                  <span className="inline-block mt-2 text-[11px] font-mono text-pumpkin hover:underline font-medium">
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
