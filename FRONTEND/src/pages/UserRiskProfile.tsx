import React, { useState, useEffect } from 'react';
import { ShieldCheck, User, Award } from 'lucide-react';
import { getUserProfile } from '../services/api';
import type { UserProfile } from '../types/phishguard';

export const UserRiskProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    getUserProfile().then(setProfile);
  }, []);

  if (!profile) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="border-b border-[#5CE1E6]/15 pb-4">
        <h1 className="text-2xl font-bold font-mono text-[#EAF4FF]">My Risk Profile</h1>
        <p className="text-xs font-mono text-[#8493A8]">Individual Cybersecurity Posture & Training Progress</p>
      </div>

      {/* USER CARD & SCORE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="cyber-card p-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#080C15] border border-[#5CE1E6]/40 flex items-center justify-center text-[#5CE1E6]">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-mono text-lg font-bold text-[#EAF4FF]">{profile.name}</h3>
            <p className="text-xs font-mono text-[#8493A8]">{profile.email}</p>
          </div>
          <span className="text-[10px] font-mono px-3 py-1 bg-[#111827] border border-[#5CE1E6]/20 rounded text-[#5CE1E6]">
            ROLE: {profile.role.toUpperCase()}
          </span>
        </div>

        <div className="cyber-card p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-[#5CE1E6]/10 pb-2">
            <span className="text-xs font-mono text-[#8493A8]">PERSONAL RISK SCORE</span>
            <ShieldCheck className="w-4 h-4 text-[#43E59B]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold font-mono text-[#43E59B]">{profile.riskScore}</span>
            <span className="text-xs font-mono text-[#8493A8]">/ 100 (Lower is safer)</span>
          </div>
          <p className="text-xs text-[#8493A8]">
            Your score improves as you complete training modules and correctly report suspicious emails.
          </p>
        </div>

        <div className="cyber-card p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-[#5CE1E6]/10 pb-2">
            <span className="text-xs font-mono text-[#8493A8]">AWARENESS GRADE</span>
            <Award className="w-4 h-4 text-[#5CE1E6]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold font-mono text-[#5CE1E6]">{profile.trainingScore}%</span>
          </div>
          <p className="text-xs text-[#8493A8]">
            Completed 1/3 modules with 100% score.
          </p>
        </div>
      </div>

      {/* METRICS & HISTORY */}
      <div className="cyber-card p-6 space-y-4">
        <h3 className="font-mono text-sm font-bold text-[#EAF4FF] border-b border-[#5CE1E6]/10 pb-3">
          Activity Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#080C15] border border-[#5CE1E6]/10 rounded font-mono">
            <span className="text-xs text-[#8493A8]">Total Submissions</span>
            <p className="text-2xl font-bold text-[#EAF4FF] mt-1">{profile.totalScans}</p>
          </div>
          <div className="p-4 bg-[#080C15] border border-[#5CE1E6]/10 rounded font-mono">
            <span className="text-xs text-[#8493A8]">Reported Phish</span>
            <p className="text-2xl font-bold text-[#43E59B] mt-1">{profile.reportedPhishCount}</p>
          </div>
          <div className="p-4 bg-[#080C15] border border-[#5CE1E6]/10 rounded font-mono">
            <span className="text-xs text-[#8493A8]">Failed Simulations</span>
            <p className="text-2xl font-bold text-[#FF3B55] mt-1">{profile.failedSimulations}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRiskProfile;
