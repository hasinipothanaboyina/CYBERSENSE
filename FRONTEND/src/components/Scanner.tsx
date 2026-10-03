import { useState } from 'react';
import { Search, ShieldAlert, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Scanner() {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<'safe' | 'danger' | null>(null);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setIsScanning(true);
    setResult(null);

    // Mock scan delay
    setTimeout(() => {
      setIsScanning(false);
      setResult(Math.random() > 0.5 ? 'safe' : 'danger');
    }, 2000);
  };

  return (
    <div className="p-6 h-full flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 w-full flex flex-col items-center text-center relative overflow-hidden"
      >
        {isScanning && (
          <div className="absolute inset-0 bg-matrix-accent/5 flex items-center justify-center z-0">
             <div className="w-[200%] h-[20px] bg-matrix-accent/20 blur-xl animate-pulse absolute top-1/2 -translate-y-1/2 rotate-12"></div>
          </div>
        )}

        <div className="relative z-10 w-full">
          <ShieldAlert className="w-16 h-16 text-matrix-accent mx-auto mb-6 opacity-80" />
          <h1 className="text-4xl font-bold text-white mb-2 font-mono">Deep Threat Scanner</h1>
          <p className="text-gray-400 mb-8 font-mono">Initialize neural analysis on target URI payload.</p>

          <form onSubmit={handleScan} className="w-full max-w-2xl mx-auto flex gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                className="w-full bg-black/40 border border-matrix-accent/30 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-matrix-accent focus:ring-1 focus:ring-matrix-accent/50 font-mono transition-all"
                placeholder="Enter URL or payload hash to scan..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              disabled={isScanning || !url}
              className="bg-matrix-accent/10 text-matrix-accent border border-matrix-accent/50 hover:bg-matrix-accent/20 hover:border-matrix-accent px-6 py-3 rounded-lg font-mono font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider flex items-center gap-2"
            >
              {isScanning ? 'Scanning...' : 'Analyze'}
            </button>
          </form>

          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-10 p-6 rounded-lg border ${
                result === 'safe' 
                  ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              } font-mono text-left flex items-start gap-4`}
            >
              {result === 'safe' ? (
                <ShieldCheck className="w-8 h-8 flex-shrink-0" />
              ) : (
                <ShieldAlert className="w-8 h-8 flex-shrink-0" />
              )}
              <div>
                <h3 className="text-xl font-bold uppercase tracking-wider mb-2">
                  {result === 'safe' ? 'No Threats Detected' : 'Critical Threat Found'}
                </h3>
                <p className="opacity-80">
                  {result === 'safe' 
                    ? 'The target URI has been verified against known threat vectors and appears clean.' 
                    : 'Warning: Malicious patterns detected in the payload structure. Immediate isolation recommended.'}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
