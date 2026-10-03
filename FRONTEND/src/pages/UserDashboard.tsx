import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, GraduationCap, Terminal, ArrowUpRight, Activity } from 'lucide-react';
import { getSubmissionHistory } from '../services/api';
import type { SubmissionItem } from '../types/phishguard';

export const UserDashboard: React.FC = () => {
  const [history, setHistory] = useState<SubmissionItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getSubmissionHistory().then(setHistory);
  }, []);

  // Dynamically calculated stats from persistent scan history
  const totalScans = history.length;
  const threatsDetected = history.filter(h => h.band === 'Critical' || h.band === 'High').length;
  const safeSubmissions = history.filter(h => h.band === 'Low').length;
  const avgRiskScore = totalScans > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.riskScore, 0) / totalScans) 
    : 0;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* HEADER & QUICK SCAN */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#5CE1E6]/15 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-mono text-[#EAF4FF]">Security Command Overview</h1>
          <p className="text-xs font-mono text-[#8493A8]">Dynamic Threat Intelligence & Persistent Risk Metrics</p>
        </div>

        <button
          onClick={() => navigate('/scanner')}
          className="px-6 py-2.5 bg-[#5CE1E6] text-[#070A12] font-mono font-bold text-xs rounded-md hover:bg-white transition-all shadow-[0_0_15px_rgba(92,225,230,0.2)] flex items-center gap-2"
        >
          <Terminal className="w-4 h-4" />
          NEW THREAT SCAN
        </button>
      </div>

      {/* DYNAMIC OVERVIEW STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cyber-card p-4 space-y-1">
          <div className="flex items-center justify-between text-[#8493A8] text-xs font-mono">
            <span>TOTAL SCANS</span>
            <Activity className="w-4 h-4 text-[#5CE1E6]" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-[#EAF4FF]">{totalScans}</p>
          <span className="text-[10px] text-[#43E59B] font-mono">Calculated Live</span>
        </div>

        <div className="cyber-card p-4 space-y-1 border-l-2 border-l-[#FF3B55]">
          <div className="flex items-center justify-between text-[#8493A8] text-xs font-mono">
            <span>THREATS DETECTED</span>
            <AlertTriangle className="w-4 h-4 text-[#FF3B55]" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-[#FF3B55]">{threatsDetected}</p>
          <span className="text-[10px] text-[#FF3B55] font-mono">High/Critical Severity</span>
        </div>

        <div className="cyber-card p-4 space-y-1">
          <div className="flex items-center justify-between text-[#8493A8] text-xs font-mono">
            <span>SAFE SUBMISSIONS</span>
            <CheckCircle className="w-4 h-4 text-[#43E59B]" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-[#43E59B]">{safeSubmissions}</p>
          <span className="text-[10px] text-[#8493A8] font-mono">Clean Verified</span>
        </div>

        <div className="cyber-card p-4 space-y-1">
          <div className="flex items-center justify-between text-[#8493A8] text-xs font-mono">
            <span>AVG RISK SCORE</span>
            <GraduationCap className="w-4 h-4 text-[#5CE1E6]" />
          </div>
          <p className="text-3xl font-extrabold font-mono text-[#5CE1E6]">{avgRiskScore}%</p>
          <span className="text-[10px] text-[#5CE1E6] font-mono">System Aggregate</span>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* RECENT SCAN ACTIVITY */}
        <div className="cyber-card p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-[#5CE1E6]/10 pb-3">
            <h3 className="font-mono text-sm font-bold text-[#EAF4FF]">Recent Scan Activity</h3>
            <Link to="/history" className="text-xs font-mono text-[#5CE1E6] hover:underline flex items-center gap-1">
              View History <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate('/scanner')}
                className="p-3 bg-[#080C15] border border-[#5CE1E6]/10 rounded flex items-center justify-between hover:border-[#5CE1E6]/40 cursor-pointer transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#EAF4FF] truncate max-w-xs md:max-w-md">{item.target}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#0D1220] border border-[#5CE1E6]/20 rounded text-[#5CE1E6] uppercase">
                      {item.kind}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8493A8] font-mono">{item.createdAt}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-mono font-extrabold px-2.5 py-1 rounded ${
                    item.band === 'Critical' ? 'bg-[#FF3B55]/15 text-[#FF3B55] border border-[#FF3B55]/30' :
                    item.band === 'High' ? 'bg-[#FFB84D]/15 text-[#FFB84D] border border-[#FFB84D]/30' :
                    'bg-[#43E59B]/15 text-[#43E59B] border border-[#43E59B]/30'
                  }`}>
                    {item.band} ({item.riskScore}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* THREAT DISTRIBUTION & QUICK ACTION */}
        <div className="space-y-6">
          <div className="cyber-card p-5 space-y-4">
            <h3 className="font-mono text-sm font-bold text-[#EAF4FF] border-b border-[#5CE1E6]/10 pb-3">
              Threat Severity Mix
            </h3>
            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between text-[#8493A8] mb-1">
                  <span>Critical Risk</span>
                  <span className="text-[#FF3B55]">{totalScans > 0 ? Math.round((history.filter(h => h.band === 'Critical').length / totalScans) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-[#080C15] h-2 rounded overflow-hidden">
                  <div className="bg-[#FF3B55] h-full" style={{ width: `${totalScans > 0 ? (history.filter(h => h.band === 'Critical').length / totalScans) * 100 : 0}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#8493A8] mb-1">
                  <span>High Risk</span>
                  <span className="text-[#FFB84D]">{totalScans > 0 ? Math.round((history.filter(h => h.band === 'High').length / totalScans) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-[#080C15] h-2 rounded overflow-hidden">
                  <div className="bg-[#FFB84D] h-full" style={{ width: `${totalScans > 0 ? (history.filter(h => h.band === 'High').length / totalScans) * 100 : 0}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#8493A8] mb-1">
                  <span>Safe Submissions</span>
                  <span className="text-[#43E59B]">{totalScans > 0 ? Math.round((history.filter(h => h.band === 'Low').length / totalScans) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-[#080C15] h-2 rounded overflow-hidden">
                  <div className="bg-[#43E59B] h-full" style={{ width: `${totalScans > 0 ? (history.filter(h => h.band === 'Low').length / totalScans) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="cyber-card p-5 space-y-3 bg-gradient-to-br from-[#0D1220] to-[#070A12]">
            <h3 className="font-mono text-sm font-bold text-[#5CE1E6]">Quick Security Action</h3>
            <p className="text-xs text-[#8493A8]">Analyze suspicious email headers or URLs.</p>
            <button
              onClick={() => navigate('/scanner')}
              className="w-full py-2 bg-[#0D1220] border border-[#5CE1E6] text-[#5CE1E6] font-mono text-xs font-bold rounded hover:bg-[#5CE1E6]/10 transition-all"
            >
              Analyze Threat Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
