import React, { useState } from 'react';
import { 
  Mail, 
  Plus, 
  Send, 
  Play, 
  Pause, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  Clock, 
  ChevronRight, 
  Eye, 
  MessageSquare,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { Campaign, Project, Buyer } from '../types';

interface CampaignsViewProps {
  campaigns: Campaign[];
  projects: Project[];
  buyers: Buyer[];
  onOpenPitchGenerator: (project: Project, buyer: Buyer) => void;
  onCreateCampaign: (campaign: Partial<Campaign>) => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({
  campaigns,
  projects,
  buyers,
  onOpenPitchGenerator,
  onCreateCampaign,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [automationLevel, setAutomationLevel] = useState<'MANUAL' | 'ASSISTED' | 'AUTONOMOUS'>('AUTONOMOUS');
  const [maxBuyers, setMaxBuyers] = useState('25');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignName.trim()) return;

    onCreateCampaign({
      name: newCampaignName,
      projectId: selectedProjectId,
      status: 'ACTIVE',
      automationLevel,
      targetCriteria: {
        buyerTypes: ['Strategic Corporate', 'Private Equity'],
        minBudget: 50000,
        industries: ['DevOps', 'Cloud Infrastructure', 'SaaS'],
      },
      followUpPolicy: {
        maxFollowUps: 3,
        daysBetweenFollowUps: 4,
        stopOnReply: true,
      },
    });

    setNewCampaignName('');
    setIsCreating(false);
  };

  return (
    <div id="campaigns-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            Outreach Campaigns & Bespoke Pitches
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Multi-channel outreach with hyper-personalized value propositions and automated stop-on-reply policies.
          </p>
        </div>

        <button
          id="create-campaign-btn"
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>+ Create Acquisition Campaign</span>
        </button>
      </div>

      {/* Create Campaign Modal */}
      {isCreating && (
        <div id="create-campaign-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="font-display text-base font-bold text-white">Create New Outreach Campaign</h3>
            
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Campaign Name *</label>
                <input
                  type="text"
                  required
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  placeholder="e.g. Q3 Strategic DevOps Acquirers"
                  className="w-full rounded-xl bg-slate-950 p-2.5 text-xs text-slate-100 placeholder-slate-500 border border-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Target Asset</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 p-2.5 text-xs text-slate-100 border border-slate-800 focus:border-indigo-500 focus:outline-none"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${p.askingPrice.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Automation Level</label>
                <select
                  value={automationLevel}
                  onChange={(e) => setAutomationLevel(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-950 p-2.5 text-xs text-slate-100 border border-slate-800 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="AUTONOMOUS">Autonomous (AI drafts & queues with Stop-Policy)</option>
                  <option value="ASSISTED">Assisted (Drafts require 1-click human approval)</option>
                  <option value="MANUAL">Manual Review Required</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
                >
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Campaigns Grid */}
      <div className="space-y-4">
        {campaigns.map((camp) => {
          const project = projects.find(p => p.id === camp.projectId) || projects[0];
          return (
            <div
              key={camp.id}
              id={`campaign-card-${camp.id}`}
              className="rounded-2xl bg-slate-900/90 p-5 border border-slate-800 shadow-sm space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-display text-base font-bold text-white">{camp.name}</h3>
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                        {camp.status}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      Promoting: <span className="text-indigo-300 font-semibold">{project?.name}</span> • Automation: <span className="text-cyan-400 font-semibold">{camp.automationLevel}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onOpenPitchGenerator(project, buyers[0])}
                    className="flex items-center space-x-1.5 rounded-xl bg-indigo-600/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Generate Bespoke Pitch</span>
                  </button>
                </div>
              </div>

              {/* Funnel Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3 border-t border-slate-800/80">
                <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800 text-center">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Targeted</span>
                  <span className="font-display text-base font-bold text-white block mt-0.5">{camp.totalTargeted}</span>
                </div>
                <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800 text-center">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Sent</span>
                  <span className="font-display text-base font-bold text-indigo-400 block mt-0.5">{camp.totalSent}</span>
                </div>
                <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800 text-center">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Opened</span>
                  <span className="font-display text-base font-bold text-cyan-400 block mt-0.5">{camp.totalOpened}</span>
                </div>
                <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800 text-center">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Replies</span>
                  <span className="font-display text-base font-bold text-amber-400 block mt-0.5">{camp.totalReplies}</span>
                </div>
                <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800 text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-semibold text-emerald-400 font-bold">Interested</span>
                  <span className="font-display text-base font-bold text-emerald-400 block mt-0.5">{camp.totalInterested}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
