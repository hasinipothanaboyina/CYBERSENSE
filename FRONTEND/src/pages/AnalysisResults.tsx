import React, { useState } from 'react';
import { ShieldAlert, Cpu, Flag, ChevronRight, Dna, GitCommit, ChevronDown, ChevronUp, AlertOctagon } from 'lucide-react';
import type { AnalysisResult } from '../types/phishguard';

export const AnalysisResultsView: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [showExplainModal, setShowExplainModal] = useState(false);
  const [showTechDetails, setShowTechDetails] = useState(false);

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* 1. RESULT HERO CARD */}
      <div className={`cyber-card p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center border-l-4 ${
        result.riskScore >= 75 ? 'border-l-[#FF3B55]' : result.riskScore >= 50 ? 'border-l-[#FFB84D]' : 'border-l-[#43E59B]'
      }`}>
        {/* CIRCULAR GAUGE */}
        <div className="flex flex-col items-center justify-center min-w-[140px]">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="rgba(92,225,230,0.1)" strokeWidth="8" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={result.riskScore >= 75 ? '#FF3B55' : result.riskScore >= 50 ? '#FFB84D' : '#43E59B'}
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * result.riskScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold font-mono text-[#EAF4FF]">{result.riskScore}%</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#8493A8] uppercase tracking-widest mt-2">
            OVERALL THREAT SCORE
          </span>
        </div>

        {/* DETAILS */}
        <div className="flex-1 space-y-3 w-full">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className={`text-2xl md:text-3xl font-extrabold tracking-wider font-mono ${
              result.riskScore >= 75 ? 'text-[#FF3B55]' : result.riskScore >= 50 ? 'text-[#FFB84D]' : 'text-[#43E59B]'
            }`}>
              {result.classification}
            </h2>
            <div className="flex gap-2">
              <span className="text-[10px] font-mono px-2.5 py-1 bg-[#111827] border border-[#5CE1E6]/20 rounded text-[#5CE1E6]">
                BAND: {result.band}
              </span>
              <span className="text-[10px] font-mono px-2.5 py-1 bg-[#111827] border border-[#5CE1E6]/20 rounded text-[#43E59B]">
                CONFIDENCE: {result.confidence}
              </span>
            </div>
          </div>

          <div className="bg-[#080C15] p-3 rounded border-l-2 border-[#5CE1E6] font-mono text-xs text-[#8493A8]">
            <span className="text-[#5CE1E6] font-bold">TARGET: </span>
            <span className="text-[#EAF4FF]">{result.urlOrTarget}</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-xs text-[#8493A8] leading-relaxed flex-1">
              {result.summary}
            </p>
            {/* FEATURE 2 BUTTON */}
            <button
              onClick={() => setShowExplainModal(true)}
              className="px-4 py-2 bg-[#0D1220] border border-[#5CE1E6] text-[#5CE1E6] font-mono text-xs font-bold rounded hover:bg-[#5CE1E6]/10 transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(92,225,230,0.15)] shrink-0"
            >
              <Cpu className="w-4 h-4" />
              WHY IS THIS DANGEROUS?
            </button>
          </div>
        </div>
      </div>

      {/* FEATURE 1 — THREAT DNA SECTION */}
      {result.threatDna && result.threatDna.length > 0 && (
        <div className="cyber-card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#5CE1E6]/10 pb-3">
            <Dna className="w-5 h-5 text-[#5CE1E6]" />
            <h3 className="font-mono text-sm font-bold text-[#EAF4FF]">THREAT DNA BREAKDOWN</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.threatDna.map((signal, idx) => (
              <div key={idx} className="p-3 bg-[#080C15] border border-[#5CE1E6]/10 rounded space-y-2">
                <div className="flex justify-between items-center font-mono text-xs">
                  <span className="font-bold text-[#EAF4FF]">{signal.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#5CE1E6] font-extrabold">
                      {typeof signal.score === 'number' ? `${signal.score}%` : 'Unavailable'}
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      signal.severity === 'CRITICAL' ? 'bg-[#FF3B55]/20 text-[#FF3B55] border border-[#FF3B55]/40' :
                      signal.severity === 'HIGH' ? 'bg-[#FFB84D]/20 text-[#FFB84D] border border-[#FFB84D]/40' :
                      signal.severity === 'UNAVAILABLE' ? 'bg-[#111827] text-[#8493A8] border border-[#8493A8]/30' :
                      'bg-[#43E59B]/20 text-[#43E59B] border border-[#43E59B]/40'
                    }`}>
                      {signal.severity}
                    </span>
                  </div>
                </div>

                {typeof signal.score === 'number' ? (
                  <div className="w-full bg-[#0D1220] h-1.5 rounded overflow-hidden">
                    <div
                      className={`h-full ${
                        signal.score >= 75 ? 'bg-[#FF3B55]' : signal.score >= 50 ? 'bg-[#FFB84D]' : 'bg-[#43E59B]'
                      }`}
                      style={{ width: `${signal.score}%` }}
                    />
                  </div>
                ) : (
                  <div className="w-full bg-[#0D1220] h-1.5 rounded bg-[#111827]" />
                )}

                <p className="text-[11px] text-[#8493A8] font-mono">{signal.evidence}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FEATURE 3 — ATTACK CHAIN VISUALIZATION */}
      {result.attackChain && result.attackChain.length > 0 && (
        <div className="cyber-card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#5CE1E6]/10 pb-3">
            <GitCommit className="w-5 h-5 text-[#FF3B55]" />
            <h3 className="font-mono text-sm font-bold text-[#EAF4FF]">ATTACK CHAIN VISUALIZATION</h3>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-3 overflow-x-auto py-2">
            {result.attackChain.map((chain, idx) => (
              <React.Fragment key={idx}>
                <div className="p-3 bg-[#080C15] border border-[#5CE1E6]/20 rounded text-center space-y-1 w-full md:w-48 shrink-0">
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                    chain.status === 'detected' ? 'bg-[#FF3B55]/20 text-[#FF3B55]' :
                    chain.status === 'potential' ? 'bg-[#FFB84D]/20 text-[#FFB84D]' :
                    'bg-[#43E59B]/20 text-[#43E59B]'
                  }`}>
                    {chain.status}
                  </span>
                  <h4 className="text-xs font-bold font-mono text-[#EAF4FF]">{chain.step}</h4>
                  <p className="text-[10px] text-[#8493A8]">{chain.detail}</p>
                </div>

                {idx < result.attackChain.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-[#5CE1E6] shrink-0 rotate-90 md:rotate-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* EVIDENCE-LABELED FINDINGS TABLE */}
      <div className="cyber-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#5CE1E6]/10 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#5CE1E6]" />
            <h3 className="font-mono text-sm font-bold text-[#EAF4FF]">Evidence-Labeled Threat Findings</h3>
          </div>
        </div>

        <div className="space-y-2">
          {result.findings.map((f) => (
            <div key={f.id} className="p-3 bg-[#080C15] border border-[#5CE1E6]/10 rounded flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    f.evidence === 'verified' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                    f.evidence === 'heuristic' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    'bg-purple-950 text-purple-400 border border-purple-800'
                  }`}>
                    {f.evidence === 'verified' ? '🟦 Verified Intel' : f.evidence === 'heuristic' ? '🟨 Heuristic' : '🟪 AI-Assessed'}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#EAF4FF]">{f.category}</span>
                </div>
                <p className="text-xs text-[#8493A8]">{f.detail}</p>
              </div>

              {f.points > 0 && (
                <span className="text-xs font-mono font-bold text-[#FF3B55] shrink-0">
                  +{f.points} pts
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* COLLAPSIBLE TECHNICAL DETAILS */}
      <div className="cyber-card p-6 space-y-3">
        <button
          onClick={() => setShowTechDetails(!showTechDetails)}
          className="w-full flex items-center justify-between font-mono text-sm font-bold text-[#5CE1E6] focus:outline-none"
        >
          <span>TECHNICAL TELEMETRY & DOMAIN INTELLIGENCE</span>
          {showTechDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTechDetails && result.telemetry && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-[#5CE1E6]/10 font-mono text-xs">
            <div className="p-3 bg-[#080C15] rounded">
              <span className="text-[#8493A8]">URL LENGTH</span>
              <p className="text-sm font-bold text-[#EAF4FF]">{result.telemetry.urlLength}</p>
            </div>
            <div className="p-3 bg-[#080C15] rounded">
              <span className="text-[#8493A8]">ENTROPY SCORE</span>
              <p className="text-sm font-bold text-[#5CE1E6]">{result.telemetry.entropyScore}</p>
            </div>
            <div className="p-3 bg-[#080C15] rounded">
              <span className="text-[#8493A8]">SUBDOMAINS</span>
              <p className="text-sm font-bold text-[#EAF4FF]">{result.telemetry.subdomainCount}</p>
            </div>
            <div className="p-3 bg-[#080C15] rounded">
              <span className="text-[#8493A8]">HTTPS STATUS</span>
              <p className={`text-sm font-bold ${result.telemetry.httpsStatus ? 'text-[#43E59B]' : 'text-[#FF3B55]'}`}>
                {result.telemetry.httpsStatus ? 'SECURE' : 'INSECURE'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* FEATURE 2 — EXPLAINABLE AI EXPANDABLE MODAL */}
      {showExplainModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="cyber-card max-w-xl w-full p-6 space-y-4 font-sans">
            <div className="flex justify-between items-center border-b border-[#5CE1E6]/15 pb-3">
              <div className="flex items-center gap-2 text-[#5CE1E6] font-mono font-bold">
                <AlertOctagon className="w-5 h-5 text-[#FF3B55]" />
                <span>WHY THIS URL WAS FLAGGED</span>
              </div>
              <button onClick={() => setShowExplainModal(false)} className="text-xs font-mono text-[#8493A8] hover:text-white">
                CLOSE [X]
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {result.findings.map((f, idx) => (
                <div key={idx} className="p-3 bg-[#080C15] border border-[#5CE1E6]/10 rounded space-y-1">
                  <h4 className="font-bold text-[#EAF4FF]">{idx + 1}. {f.category}</h4>
                  <p className="text-[#8493A8]">{f.detail}</p>
                </div>
              ))}

              <div className="p-3 bg-[#0D1220] border-l-2 border-l-[#FF3B55] rounded space-y-1">
                <span className="text-[#5CE1E6] font-bold">FINAL ASSESSMENT:</span>
                <p className="text-[#EAF4FF] font-bold">{result.classification} ({result.riskScore}% Risk)</p>
                <p className="text-[#8493A8]">Confidence Rating: {result.confidence}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowExplainModal(false)}
                className="px-6 py-2 bg-[#5CE1E6] text-[#070A12] font-mono text-xs font-bold rounded"
              >
                DISMISS EXPLANATION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => setFeedbackSent(true)}
          disabled={feedbackSent}
          className="text-xs font-mono text-[#8493A8] hover:text-[#5CE1E6] flex items-center gap-1.5"
        >
          <Flag className="w-3.5 h-3.5" />
          {feedbackSent ? 'Reported as False Positive' : 'Report False Positive'}
        </button>
      </div>
    </div>
  );
};

export default AnalysisResultsView;
