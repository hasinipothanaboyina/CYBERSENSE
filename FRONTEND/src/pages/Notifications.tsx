import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, GraduationCap } from 'lucide-react';
import { getNotifications, markNotificationRead } from '../services/api';
import type { AppNotification } from '../types/phishguard';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    getNotifications().then(setNotifications);
  }, []);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="border-b border-[#5CE1E6]/15 pb-4">
        <h1 className="text-2xl font-bold font-mono text-[#EAF4FF]">Notification Center</h1>
        <p className="text-xs font-mono text-[#8493A8]">Security Alerts, Threat Intelligence Updates & Awareness Reminders</p>
      </div>

      <div className="cyber-card p-6 space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-xs font-mono text-[#8493A8]">
            No notifications available.
          </div>
        ) : (
          <div className="space-y-3 font-mono">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleMarkRead(n.id)}
                className={`p-4 rounded border transition-all flex items-start justify-between cursor-pointer ${
                  n.isRead
                    ? 'bg-[#080C15] border-[#5CE1E6]/10 opacity-70'
                    : 'bg-[#0D1220] border-[#5CE1E6]/40 shadow-[0_0_10px_rgba(92,225,230,0.1)]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#080C15] rounded border border-[#5CE1E6]/20 mt-0.5">
                    {n.type === 'threat' ? (
                      <ShieldAlert className="w-4 h-4 text-[#FF3B55]" />
                    ) : n.type === 'awareness' ? (
                      <GraduationCap className="w-4 h-4 text-[#5CE1E6]" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-[#43E59B]" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[#EAF4FF]">{n.title}</h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#FF3B55] animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-[#8493A8]">{n.body}</p>
                  </div>
                </div>

                <span className="text-[10px] text-[#8493A8]">{n.createdAt}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
