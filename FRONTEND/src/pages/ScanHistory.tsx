import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, ChevronRight } from 'lucide-react';
import { getSubmissionHistory } from '../services/api';
import type { SubmissionItem } from '../types/phishguard';

export const ScanHistory: React.FC = () => {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBand, setFilterBand] = useState<string>('ALL');

  useEffect(() => {
    getSubmissionHistory().then(setSubmissions);
  }, []);

  const filtered = submissions.filter((item) => {
    const matchesSearch = item.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBand = filterBand === 'ALL' || item.band === filterBand;
    return matchesSearch && matchesBand;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="border-b border-[#5CE1E6]/15 pb-4">
        <h1 className="text-2xl font-bold font-mono text-[#EAF4FF]">Analysis History</h1>
        <p className="text-xs font-mono text-[#8493A8]">Audit Log of Previous Threat Intelligence Submissions</p>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="cyber-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8493A8]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by URL, domain, or email target..."
            className="w-full bg-[#080C15] border border-[#5CE1E6]/30 rounded py-2 pl-9 pr-4 text-xs font-mono text-[#EAF4FF] outline-none focus:border-[#5CE1E6]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-[#5CE1E6]" />
          <select
            value={filterBand}
            onChange={(e) => setFilterBand(e.target.value)}
            className="bg-[#080C15] border border-[#5CE1E6]/30 rounded py-2 px-3 text-xs font-mono text-[#EAF4FF] outline-none"
          >
            <option value="ALL">All Risk Bands</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* HISTORY LIST */}
      <div className="cyber-card p-6 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-xs font-mono text-[#8493A8]">
            No submission records match your search query.
          </div>
        ) : (
          filtered.map((sub) => (
            <div key={sub.id} className="p-4 bg-[#080C15] border border-[#5CE1E6]/10 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#5CE1E6]/30 transition-all">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#EAF4FF]">{sub.target}</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-[#0D1220] border border-[#5CE1E6]/20 rounded text-[#5CE1E6] uppercase">
                    {sub.kind}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#8493A8] font-mono">
                  <Calendar className="w-3 h-3" />
                  <span>{sub.createdAt}</span>
                  <span>• ID: {sub.id}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-between sm:justify-end">
                <span className={`text-xs font-mono font-bold px-3 py-1 rounded ${
                  sub.band === 'Critical' ? 'bg-[#FF3B55]/15 text-[#FF3B55] border border-[#FF3B55]/30' :
                  sub.band === 'High' ? 'bg-[#FFB84D]/15 text-[#FFB84D] border border-[#FFB84D]/30' :
                  'bg-[#43E59B]/15 text-[#43E59B] border border-[#43E59B]/30'
                }`}>
                  {sub.band} ({sub.riskScore}%)
                </span>
                <ChevronRight className="w-4 h-4 text-[#8493A8]" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ScanHistory;
