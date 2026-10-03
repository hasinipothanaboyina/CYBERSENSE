import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, History, GraduationCap, UserCheck, Bell, ShieldCheck } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/scanner', icon: ShieldAlert, label: 'Threat Scanner' },
    { to: '/history', icon: History, label: 'Analysis History' },
    { to: '/awareness', icon: GraduationCap, label: 'Security Awareness' },
    { to: '/risk-profile', icon: UserCheck, label: 'My Risk Profile' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/admin', icon: ShieldCheck, label: 'Admin Dashboard' }
  ];

  return (
    <aside className="w-64 bg-[#070A12] border-r border-[#5CE1E6]/15 h-[calc(100vh-57px)] flex flex-col justify-between p-4 shrink-0 font-mono hidden md:flex">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] text-[#8493A8] uppercase tracking-widest font-bold">
          Platform Workspace
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs transition-all font-bold ${
                  isActive
                    ? 'bg-[#0D1220] text-[#5CE1E6] border border-[#5CE1E6]/30 shadow-[0_0_10px_rgba(92,225,230,0.15)]'
                    : 'text-[#8493A8] hover:text-[#EAF4FF] hover:bg-[#0D1220]/50'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="p-3 bg-[#0D1220] border border-[#5CE1E6]/15 rounded-lg text-xs space-y-2">
        <div className="flex items-center justify-between text-[#5CE1E6]">
          <span className="text-[10px] font-bold">ENGINE STATUS</span>
          <span className="w-2 h-2 rounded-full bg-[#43E59B] animate-pulse" />
        </div>
        <p className="text-[11px] text-[#8493A8]">Neural Heuristics v4.2 Active</p>
      </div>
    </aside>
  );
};

export default Sidebar;
