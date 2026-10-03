import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Terminal, Cpu, AlertOctagon, GraduationCap } from 'lucide-react';
import MatrixRain from '../components/MatrixRain';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070A12] text-[#EAF4FF] relative overflow-hidden font-sans">
      <MatrixRain />

      {/* HERO SECTION */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0D1220] border border-[#5CE1E6]/30 rounded-full text-xs font-mono text-[#5CE1E6] mb-8 shadow-[0_0_15px_rgba(92,225,230,0.15)]">
          <Shield className="w-4 h-4 text-[#5CE1E6]" />
          <span>CYBER SENSE THREAT INTELLIGENCE PLATFORM</span>
        </div>

        <h1 className="text-4xl md:text-7xl font-extrabold font-mono tracking-tight text-[#EAF4FF] mb-6 leading-tight">
          Think Before You <span className="text-[#5CE1E6] drop-shadow-[0_0_20px_rgba(92,225,230,0.4)]">Click.</span>
        </h1>

        <p className="text-base md:text-xl text-[#8493A8] max-w-2xl font-mono leading-relaxed mb-10">
          AI-powered phishing intelligence that detects digital deception, explains threats with evidence-labeled findings, and empowers every user to stay protected.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
          <Link
            to="/scanner"
            className="px-8 py-4 bg-[#5CE1E6] text-[#070A12] font-mono font-extrabold tracking-wider rounded-lg hover:bg-white transition-all shadow-[0_0_25px_rgba(92,225,230,0.3)] flex items-center justify-center gap-2"
          >
            <Terminal className="w-5 h-5" />
            INITIALIZE SECURITY SCAN
          </Link>
          <Link
            to="/dashboard"
            className="px-8 py-4 bg-[#0D1220] border border-[#5CE1E6]/40 text-[#5CE1E6] font-mono font-bold tracking-wider rounded-lg hover:bg-[#5CE1E6]/10 transition-all flex items-center justify-center gap-2"
          >
            EXPLORE DASHBOARD
          </Link>
        </div>
      </div>

      {/* PLATFORM FEATURES */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="cyber-card p-6 space-y-3">
          <div className="p-3 bg-[#080C15] border border-[#5CE1E6]/20 rounded-lg w-fit text-[#5CE1E6]">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="font-mono text-lg font-bold text-[#EAF4FF]">Triple-Tier AI Analysis</h3>
          <p className="text-xs text-[#8493A8] leading-relaxed">
            Combines static heuristic rules, machine learning URL classifiers, and privacy-first LLMs to extract urgency and threat signals.
          </p>
        </div>

        <div className="cyber-card p-6 space-y-3">
          <div className="p-3 bg-[#080C15] border border-[#5CE1E6]/20 rounded-lg w-fit text-[#FF3B55]">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <h3 className="font-mono text-lg font-bold text-[#EAF4FF]">Evidence-Labeled Findings</h3>
          <p className="text-xs text-[#8493A8] leading-relaxed">
            Clear labels distinguish Verified Intel 🟦, Heuristics 🟨, and AI-assessed findings 🟪 so you know what is proven versus estimated.
          </p>
        </div>

        <div className="cyber-card p-6 space-y-3">
          <div className="p-3 bg-[#080C15] border border-[#5CE1E6]/20 rounded-lg w-fit text-[#43E59B]">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="font-mono text-lg font-bold text-[#EAF4FF]">Interactive Security Awareness</h3>
          <p className="text-xs text-[#8493A8] leading-relaxed">
            Turn detections into teachable moments with micro-lessons, interactive quizzes, and personal risk scoring.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 space-y-8 border-t border-[#5CE1E6]/10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#5CE1E6]">THE DETECTION LOOP</h2>
          <p className="text-xs text-[#8493A8] font-mono">Detect → Explain → Teach → Test → Measure</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Submit Threat', desc: 'Paste suspicious emails, URLs, or upload file metadata.' },
            { step: '02', title: 'Static Extraction', desc: 'Passive OSINT, RDAP lookups, and PII redaction.' },
            { step: '03', title: 'Risk Score & Badges', desc: 'Explainable score with confidence levels & evidence badges.' },
            { step: '04', title: 'Learn & Protect', desc: 'Take targeted quizzes to lower your organizational risk profile.' }
          ].map((item) => (
            <div key={item.step} className="cyber-card p-5 space-y-2">
              <span className="font-mono text-2xl font-extrabold text-[#5CE1E6]">{item.step}</span>
              <h4 className="font-mono text-sm font-bold text-[#EAF4FF]">{item.title}</h4>
              <p className="text-xs text-[#8493A8]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
