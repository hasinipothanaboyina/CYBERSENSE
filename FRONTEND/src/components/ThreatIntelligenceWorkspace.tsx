import React, { useState, useEffect } from 'react';
import { Search, Shield } from 'lucide-react';
import { scanUrl } from '../services/api';
import type { AnalysisResult } from '../types/phishguard';
import AnalysisResultsView from '../pages/AnalysisResults';

export const ThreatIntelligenceWorkspace: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('http://paypa1-secure-verification.com/login');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputUrl.trim()) return;

    setLoading(true);
    try {
      const data = await scanUrl(inputUrl);
      setResult(data);
    } catch {
      // Fallback handled in api.ts
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleScan();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      <header className="text-center space-y-2 py-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-2 bg-[#0D1220] border border-[#5CE1E6]/30 rounded-lg shadow-[0_0_10px_rgba(92,225,230,0.2)]">
            <Shield className="w-8 h-8 text-[#5CE1E6]" />
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-wider text-[#5CE1E6] font-mono drop-shadow-[0_0_12px_rgba(92,225,230,0.4)]">
            Advanced Phishing Threat Intelligence
          </h1>
        </div>
        <p className="text-xs md:text-sm text-[#8493A8] font-mono tracking-widest uppercase">
          AI-POWERED URL ANALYSIS · LEXICAL ENTROPY · OSINT · THREAT SCORING
        </p>
      </header>

      <section className="cyber-card p-4 md:p-6 relative overflow-hidden">
        <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8493A8]" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter suspicious URL or domain..."
              className="w-full bg-[#080C15] border border-[#5CE1E6]/30 rounded-md py-3.5 pl-12 pr-4 text-[#EAF4FF] font-mono placeholder-[#8493A8]/60 focus:outline-none focus:border-[#5CE1E6] focus:shadow-[0_0_15px_rgba(92,225,230,0.25)] transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-8 py-3.5 bg-[#0D1220] border border-[#5CE1E6] text-[#5CE1E6] font-mono font-bold tracking-wider rounded-md hover:bg-[#5CE1E6]/10 hover:shadow-[0_0_20px_rgba(92,225,230,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'ANALYZING...' : 'INITIATE SCAN'}
          </button>
        </form>
      </section>

      {result && <AnalysisResultsView result={result} />}
    </div>
  );
};

export default ThreatIntelligenceWorkspace;
