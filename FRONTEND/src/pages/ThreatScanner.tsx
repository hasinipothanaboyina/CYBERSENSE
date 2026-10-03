import React, { useState } from 'react';
import { Mail, Globe, Paperclip, Search, Upload, AlertCircle } from 'lucide-react';
import { submitScanApi } from '../services/api';
import type { AnalysisResult, SubmissionKind } from '../types/phishguard';
import AnalysisResultsView from './AnalysisResults';

export const ThreatScanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SubmissionKind>('url');
  const [urlInput, setUrlInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    let contentToScan: string | File = '';
    if (activeTab === 'url') {
      if (!urlInput.trim()) {
        setErrorMsg('Please enter a valid URL or domain to analyze.');
        return;
      }
      contentToScan = urlInput;
    } else if (activeTab === 'email') {
      if (!emailInput.trim()) {
        setErrorMsg('Please paste email headers or message text to analyze.');
        return;
      }
      contentToScan = emailInput;
    } else if (activeTab === 'file') {
      if (!fileInput) {
        setErrorMsg('Please select or drag-and-drop an attachment file.');
        return;
      }
      contentToScan = fileInput;
    }

    setLoading(true);
    try {
      const res = await submitScanApi(activeTab, contentToScan);
      setScanResult(res);
    } catch {
      setErrorMsg('Failed to process analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileInput(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* SCANNER TITLE */}
      <div className="border-b border-[#5CE1E6]/15 pb-4">
        <h1 className="text-2xl font-bold font-mono text-[#EAF4FF]">Threat Scanner Workspace</h1>
        <p className="text-xs font-mono text-[#8493A8]">Multi-Modal Phishing & Social Engineering Heuristic Analyzer</p>
      </div>

      {/* SCANNER TABS */}
      <div className="cyber-card p-6 space-y-6">
        <div className="flex border-b border-[#5CE1E6]/15 gap-2">
          <button
            onClick={() => { setActiveTab('url'); setScanResult(null); }}
            className={`flex items-center gap-2 px-5 py-3 font-mono text-xs font-bold border-b-2 transition-all ${
              activeTab === 'url'
                ? 'border-[#5CE1E6] text-[#5CE1E6] bg-[#080C15]'
                : 'border-transparent text-[#8493A8] hover:text-[#EAF4FF]'
            }`}
          >
            <Globe className="w-4 h-4" />
            URL / DOMAIN SCAN
          </button>

          <button
            onClick={() => { setActiveTab('email'); setScanResult(null); }}
            className={`flex items-center gap-2 px-5 py-3 font-mono text-xs font-bold border-b-2 transition-all ${
              activeTab === 'email'
                ? 'border-[#5CE1E6] text-[#5CE1E6] bg-[#080C15]'
                : 'border-transparent text-[#8493A8] hover:text-[#EAF4FF]'
            }`}
          >
            <Mail className="w-4 h-4" />
            EMAIL / MESSAGE BODY
          </button>

          <button
            onClick={() => { setActiveTab('file'); setScanResult(null); }}
            className={`flex items-center gap-2 px-5 py-3 font-mono text-xs font-bold border-b-2 transition-all ${
              activeTab === 'file'
                ? 'border-[#5CE1E6] text-[#5CE1E6] bg-[#080C15]'
                : 'border-transparent text-[#8493A8] hover:text-[#EAF4FF]'
            }`}
          >
            <Paperclip className="w-4 h-4" />
            ATTACHMENT METADATA
          </button>
        </div>

        {/* INPUT FORMS */}
        <form onSubmit={handleScan} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-[#FF3B55]/10 border border-[#FF3B55]/40 rounded text-xs font-mono text-[#FF3B55] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#8493A8]">Suspicious URL or Domain Name</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8493A8]" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://paypa1-secure-verification.com/login"
                  className="w-full bg-[#080C15] border border-[#5CE1E6]/30 rounded p-3 pl-11 text-xs font-mono text-[#EAF4FF] placeholder-[#8493A8]/50 focus:border-[#5CE1E6] outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono text-[#8493A8]">
                <label>Paste Email Headers or Raw Text Body</label>
                <span>{emailInput.length} chars</span>
              </div>
              <textarea
                rows={6}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="From: security-alert@paypa1.com&#10;Subject: URGENT: Account Limited&#10;&#10;Please verify your password immediately to avoid suspension..."
                className="w-full bg-[#080C15] border border-[#5CE1E6]/30 rounded p-3 text-xs font-mono text-[#EAF4FF] placeholder-[#8493A8]/50 focus:border-[#5CE1E6] outline-none"
              />
            </div>
          )}

          {activeTab === 'file' && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-[#5CE1E6]/30 bg-[#080C15] rounded-lg p-8 text-center space-y-3 cursor-pointer hover:border-[#5CE1E6] transition-all"
            >
              <Upload className="w-8 h-8 text-[#5CE1E6] mx-auto" />
              <div className="space-y-1 font-mono">
                <p className="text-xs text-[#EAF4FF] font-bold">
                  {fileInput ? fileInput.name : 'Drag & drop suspicious attachment here, or browse file'}
                </p>
                <p className="text-[10px] text-[#8493A8]">
                  {fileInput ? `${(fileInput.size / 1024).toFixed(1)} KB` : 'Static SHA-256 hash lookup. Files are never executed.'}
                </p>
              </div>
              <input
                type="file"
                onChange={(e) => e.target.files && setFileInput(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="inline-block px-4 py-2 bg-[#0D1220] border border-[#5CE1E6]/40 text-[#5CE1E6] rounded text-xs font-mono cursor-pointer">
                Select File
              </label>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#5CE1E6] text-[#070A12] font-mono text-xs font-extrabold rounded hover:bg-white transition-all shadow-[0_0_15px_rgba(92,225,230,0.2)] disabled:opacity-50"
            >
              {loading ? 'RUNNING HEURISTICS...' : 'ANALYZE THREAT'}
            </button>
          </div>
        </form>
      </div>

      {/* RESULT VIEW */}
      {scanResult && <AnalysisResultsView result={scanResult} />}
    </div>
  );
};

export default ThreatScanner;
