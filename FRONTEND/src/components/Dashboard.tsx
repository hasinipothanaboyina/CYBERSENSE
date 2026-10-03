import { Activity, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const stats = [
    { label: 'Threats Detected', value: '142', icon: AlertTriangle, color: 'text-red-500' },
    { label: 'Safe Scans', value: '1,337', icon: ShieldCheck, color: 'text-matrix-accent' },
    { label: 'Active Monitors', value: '4', icon: Activity, color: 'text-blue-500' },
    { label: 'System Load', value: '23%', icon: Zap, color: 'text-yellow-500' },
  ];

  return (
    <div className="p-6 h-full flex flex-col gap-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-matrix-accent tracking-wider font-mono">System Dashboard</h1>
        <div className="text-sm font-mono text-gray-400">Status: <span className="text-matrix-accent">ONLINE</span></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel p-6 flex items-center justify-between"
          >
            <div>
              <p className="text-gray-400 text-sm font-mono uppercase">{stat.label}</p>
              <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
            </div>
            <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[300px]">
        <div className="glass-panel p-6 lg:col-span-2 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-4 font-mono">Recent Activity Stream</h2>
          <div className="flex-1 flex items-center justify-center border border-dashed border-gray-700/50 rounded-lg bg-black/20">
            <p className="text-gray-500 font-mono text-sm">Visualizing data blocks...</p>
          </div>
        </div>
        <div className="glass-panel p-6 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-4 font-mono">Alerts</h2>
          <div className="flex-1 flex items-center justify-center border border-dashed border-gray-700/50 rounded-lg bg-black/20">
            <p className="text-gray-500 font-mono text-sm">No new anomalies detected.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
