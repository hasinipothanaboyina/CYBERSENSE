import React, { useState, useEffect } from 'react';
import { Download, Plus } from 'lucide-react';
import { getAdminIncidents, getAdminCampaigns } from '../services/api';
import type { Incident, Campaign } from '../types/phishguard';

export const AdminDashboard: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');

  useEffect(() => {
    getAdminIncidents().then(setIncidents);
    getAdminCampaigns().then(setCampaigns);
  }, []);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignName.trim()) return;
    const newCamp: Campaign = {
      id: `CAMP-0${campaigns.length + 1}`,
      name: newCampaignName,
      targetCount: 200,
      openRate: 0,
      clickRate: 0,
      reportRate: 0,
      status: 'Draft',
      createdAt: new Date().toISOString().substring(0, 10)
    };
    setCampaigns([newCamp, ...campaigns]);
    setNewCampaignName('');
    setShowModal(false);
  };

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8,Incident ID,Target,Severity,Status,Date\n" + 
      incidents.map(e => `${e.id},${e.target},${e.severity},${e.status},${e.date}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "phishguard_incidents_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#5CE1E6]/15 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-mono text-[#EAF4FF]">Admin Security Intelligence</h1>
          <p className="text-xs font-mono text-[#8493A8]">Organization-wide Risk Oversight & Phishing Simulations</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2 bg-[#0D1220] border border-[#5CE1E6]/30 text-[#5CE1E6] font-mono text-xs font-bold rounded hover:bg-[#5CE1E6]/10 flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> EXPORT CSV
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#5CE1E6] text-[#070A12] font-mono text-xs font-extrabold rounded hover:bg-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> NEW SIMULATION
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="cyber-card p-4 space-y-1">
          <span className="text-xs font-mono text-[#8493A8]">TOTAL USERS</span>
          <p className="text-2xl font-bold font-mono text-[#EAF4FF]">1,240</p>
        </div>
        <div className="cyber-card p-4 space-y-1">
          <span className="text-xs font-mono text-[#8493A8]">ACTIVE INCIDENTS</span>
          <p className="text-2xl font-bold font-mono text-[#FF3B55]">3</p>
        </div>
        <div className="cyber-card p-4 space-y-1">
          <span className="text-xs font-mono text-[#8493A8]">AVG ORG RISK SCORE</span>
          <p className="text-2xl font-bold font-mono text-[#43E59B]">32 / 100</p>
        </div>
        <div className="cyber-card p-4 space-y-1">
          <span className="text-xs font-mono text-[#8493A8]">SIMULATION CLICK RATE</span>
          <p className="text-2xl font-bold font-mono text-[#5CE1E6]">11%</p>
        </div>
      </div>

      {/* INCIDENT MANAGEMENT TABLE */}
      <div className="cyber-card p-6 space-y-4">
        <h3 className="font-mono text-sm font-bold text-[#EAF4FF] border-b border-[#5CE1E6]/10 pb-3">
          Incident Management Queue
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs text-[#EAF4FF]">
            <thead>
              <tr className="border-b border-[#5CE1E6]/15 text-[#8493A8]">
                <th className="py-2">INCIDENT ID</th>
                <th className="py-2">TARGET</th>
                <th className="py-2">SEVERITY</th>
                <th className="py-2">STATUS</th>
                <th className="py-2">ASSIGNED TO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5CE1E6]/10">
              {incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-[#080C15]">
                  <td className="py-3 font-bold text-[#5CE1E6]">{inc.id}</td>
                  <td className="py-3">{inc.target}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${inc.severity === 'Critical' ? 'bg-[#FF3B55]/15 text-[#FF3B55]' : 'bg-[#FFB84D]/15 text-[#FFB84D]'}`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="py-3">{inc.status}</td>
                  <td className="py-3 text-[#8493A8]">{inc.assignedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CAMPAIGN OVERVIEW */}
      <div className="cyber-card p-6 space-y-4">
        <h3 className="font-mono text-sm font-bold text-[#EAF4FF] border-b border-[#5CE1E6]/10 pb-3">
          Simulated Phishing Campaigns
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((camp) => (
            <div key={camp.id} className="p-4 bg-[#080C15] border border-[#5CE1E6]/10 rounded space-y-3 font-mono">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#EAF4FF]">{camp.name}</span>
                <span className="text-[10px] px-2 py-0.5 bg-[#0D1220] border border-[#5CE1E6]/30 text-[#5CE1E6] rounded">
                  {camp.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px] text-[#8493A8]">
                <div>
                  <span>Open Rate</span>
                  <p className="text-sm font-bold text-[#EAF4FF]">{camp.openRate}%</p>
                </div>
                <div>
                  <span>Click Rate</span>
                  <p className="text-sm font-bold text-[#FF3B55]">{camp.clickRate}%</p>
                </div>
                <div>
                  <span>Report Rate</span>
                  <p className="text-sm font-bold text-[#43E59B]">{camp.reportRate}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE CAMPAIGN MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="cyber-card max-w-md w-full p-6 space-y-4 font-mono">
            <h3 className="text-base font-bold text-[#5CE1E6]">Launch Phishing Simulation Campaign</h3>
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-[#8493A8]">Campaign Name</label>
                <input
                  type="text"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  placeholder="e.g. Q4 Urgent Invoice Simulation"
                  className="w-full bg-[#080C15] border border-[#5CE1E6]/30 rounded p-3 text-xs text-[#EAF4FF] outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-[#8493A8]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#5CE1E6] text-[#070A12] text-xs font-bold rounded"
                >
                  LAUNCH CAMPAIGN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
