import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  ShieldAlert, 
  Sparkles, 
  ShieldCheck, 
  CheckCheck, 
  ArrowRight, 
  Filter, 
  Trash2 
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
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-brand-blue" />
            Notifications & Security Alerts
          </h1>
          <p className="text-xs text-dark-muted mt-1">
            Real-time feed of automated Qwen2.5-Coder detections, manager review assignments, and system webhooks.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-dark-card border border-dark-border text-xs font-mono text-dark-text hover:text-white transition-colors"
        >
          <CheckCheck className="w-4 h-4 text-brand-blue" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs font-mono">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filterType === 'all' ? 'bg-brand-blue text-white font-bold' : 'bg-dark-card text-dark-muted hover:text-white'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilterType('unread')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filterType === 'unread' ? 'bg-brand-blue text-white font-bold' : 'bg-dark-card text-dark-muted hover:text-white'
          }`}
        >
          Unread ({notifications.filter(n => !n.read).length})
        </button>
        <button
          onClick={() => setFilterType('critical')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filterType === 'critical' ? 'bg-rose-600 text-white font-bold' : 'bg-dark-card text-rose-400 hover:text-rose-300'
          }`}
        >
          Critical Vulnerabilities
        </button>
      </div>

      {/* List */}
      <div className="bg-dark-card border border-dark-border rounded-2xl divide-y divide-dark-border/60 overflow-hidden shadow-lg">
        {filteredNotifs.length === 0 ? (
          <div className="p-8 text-center text-dark-dim text-xs font-mono">
            No notifications found.
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
              className={`p-4 hover:bg-dark-subtle/70 transition-colors cursor-pointer flex items-start gap-3.5 ${
                !notif.read ? 'bg-dark-subtle/30' : ''
              }`}
            >
              {/* Type icon */}
              <div className="p-2 rounded-xl bg-dark-bg border border-dark-border shrink-0 mt-0.5">
                {notif.type === 'critical' ? (
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                ) : notif.type === 'warning' ? (
                  <Sparkles className="w-5 h-5 text-amber-400" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-brand-blue" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs ${!notif.read ? 'font-bold text-white' : 'font-semibold text-dark-text'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] font-mono text-dark-dim">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-xs text-dark-muted mt-1 leading-relaxed">
                  {notif.message}
                </p>
                {notif.prNumber && (
                  <span className="inline-block mt-2 text-[11px] font-mono text-brand-blue hover:underline">
                    Inspect Pull Request #{notif.prNumber} →
                  </span>
                )}
              </div>

              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-brand-blue shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
