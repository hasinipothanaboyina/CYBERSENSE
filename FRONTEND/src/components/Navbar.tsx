import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Bell, User, Terminal } from 'lucide-react';
import { getNotifications } from '../services/api';
import type { AppNotification } from '../types/phishguard';

export const Navbar: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getNotifications().then(setNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="bg-[#070A12] border-b border-[#5CE1E6]/15 px-4 md:px-8 py-3.5 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="p-2 bg-[#0D1220] border border-[#5CE1E6]/30 rounded-lg group-hover:border-[#5CE1E6] transition-all shadow-[0_0_10px_rgba(92,225,230,0.15)]">
          <Shield className="w-6 h-6 text-[#5CE1E6]" />
        </div>
        <div className="flex flex-col">
          <span className="font-mono font-extrabold text-xl tracking-wider text-[#EAF4FF] group-hover:text-[#5CE1E6] transition-colors">
            CYBER <span className="text-[#5CE1E6]">SENSE</span>
          </span>
          <span className="font-mono text-[10px] text-[#8493A8] uppercase tracking-widest -mt-1">
            Cyber Threat Intelligence
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        {/* Quick Scan Nav Link */}
        <Link
          to="/scanner"
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#0D1220] border border-[#5CE1E6]/40 text-[#5CE1E6] rounded-md font-mono text-xs font-bold hover:bg-[#5CE1E6]/10 transition-all shadow-[0_0_10px_rgba(92,225,230,0.1)]"
        >
          <Terminal className="w-3.5 h-3.5" />
          START SCAN
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="p-2 text-[#8493A8] hover:text-[#5CE1E6] relative transition-colors rounded-lg bg-[#0D1220] border border-[#5CE1E6]/10"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF3B55] text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0D1220] border border-[#5CE1E6]/30 rounded-lg shadow-2xl p-4 space-y-3 z-50">
              <div className="flex items-center justify-between border-b border-[#5CE1E6]/10 pb-2">
                <span className="font-mono text-xs font-bold text-[#5CE1E6]">SECURITY NOTIFICATIONS</span>
                <Link to="/notifications" onClick={() => setShowNotifMenu(false)} className="text-[10px] font-mono text-[#8493A8] hover:text-white">
                  View All
                </Link>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 bg-[#080C15] border border-[#5CE1E6]/10 rounded text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#EAF4FF]">{n.title}</span>
                      <span className="text-[9px] text-[#8493A8]">{n.createdAt}</span>
                    </div>
                    <p className="text-[#8493A8] text-[11px]">{n.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Link */}
        <button
          onClick={() => navigate('/risk-profile')}
          className="flex items-center gap-2 p-2 bg-[#0D1220] border border-[#5CE1E6]/20 rounded-lg text-[#EAF4FF] hover:border-[#5CE1E6] transition-all"
        >
          <User className="w-4 h-4 text-[#5CE1E6]" />
          <span className="hidden md:inline font-mono text-xs font-bold">Alex Vance</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
