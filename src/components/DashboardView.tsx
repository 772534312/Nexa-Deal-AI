import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShieldCheck, 
  Bot, 
  Sparkles, 
  ArrowUpRight, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  BarChart3, 
  Target, 
  Mail, 
  FileText,
  Lock,
  Layers
} from 'lucide-react';
import { Project, Deal, Buyer, Mission, ApprovalItem, AuditLog } from '../types';

interface DashboardViewProps {
  projects: Project[];
  deals: Deal[];
  buyers: Buyer[];
  missions: Mission[];
  approvals: ApprovalItem[];
  auditLogs: AuditLog[];
  onSelectProject: (project: Project) => void;
  onOpenAddProject: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenDealCoach: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  deals,
  buyers,
  missions,
  approvals,
  auditLogs,
  onSelectProject,
  onOpenAddProject,
  onNavigateTab,
  onOpenDealCoach,
}) => {
  const totalPipelineVal = projects.reduce((acc, p) => acc + (p.askingPrice || 0), 0);
  const totalOffersVal = deals.reduce((acc, d) => acc + (d.currentOfferAmount || 0), 0);
  const pendingApprovals = approvals.filter(a => a.status === 'PENDING');
  const activeBuyersCount = buyers.filter(b => ['INTERESTED', 'NEGOTIATING', 'OFFER_MADE'].includes(b.status)).length;
  const avgClosingProb = deals.length ? Math.round(deals.reduce((acc, d) => acc + d.closingProbability, 0) / deals.length) : 0;

  return (
    <div id="dashboard-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Mission Control Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20 mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Autonomous AI Brokerage & Acquisition Engine Active</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
              Digital Asset Mission Control
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl mt-1">
              Your 15 specialized AI agents are autonomously discovering buyers, analyzing market multiples, running outreach campaigns, and managing negotiations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="dash-add-project-btn"
              onClick={onOpenAddProject}
              className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add Digital Asset</span>
            </button>
            <button
              id="dash-deal-coach-btn"
              onClick={onOpenDealCoach}
              className="flex items-center space-x-1.5 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all"
            >
              <Bot className="h-4 w-4 text-indigo-400" />
              <span>Ask AI Deal Coach</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Key KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-2xl bg-slate-900/90 p-5 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pipeline Value</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-display text-2xl font-bold text-white">${totalPipelineVal.toLocaleString()}</span>
            <span className="text-xs text-emerald-400 font-medium">3 Assets Listed</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Target asking value across portfolio</p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl bg-slate-900/90 p-5 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Offers Value</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-display text-2xl font-bold text-white">${totalOffersVal.toLocaleString()}</span>
            <span className="text-xs text-indigo-400 font-medium">{deals.length} Active Deals</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Live acquisition bids on table</p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl bg-slate-900/90 p-5 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Interested Buyers</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-display text-2xl font-bold text-white">{activeBuyersCount} Qualified</span>
            <span className="text-xs text-cyan-400 font-medium">Avg Match: 94%</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Corporate & PE buyers in CRM</p>
        </div>

        {/* Metric 4 */}
        <div className={`rounded-2xl p-5 border shadow-sm relative overflow-hidden transition-all ${
          pendingApprovals.length > 0 
            ? 'bg-amber-950/20 border-amber-500/30' 
            : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Human Approvals</span>
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
              pendingApprovals.length > 0
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-display text-2xl font-bold text-white">{pendingApprovals.length} Action Required</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {pendingApprovals.length > 0 ? 'High-risk items intercepted by Policy' : 'All safe actions auto-processed'}
          </p>
        </div>
      </div>

      {/* Main Grid: Active Projects & Active Deals Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Digital Assets Portfolio */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-indigo-400" />
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                Digital Assets Under Representation ({projects.length})
              </h3>
            </div>
            <button 
              id="view-all-projects-btn"
              onClick={() => onNavigateTab('projects')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
            >
              <span>Manage Projects</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-3">
            {projects.map((proj) => (
              <div
                key={proj.id}
                id={`dashboard-project-card-${proj.id}`}
                onClick={() => onSelectProject(proj)}
                className="group cursor-pointer rounded-2xl bg-slate-900/80 p-5 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-display text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {proj.name}
                      </h4>
                      <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/20">
                        {proj.category}
                      </span>
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20 capitalize">
                        {proj.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{proj.tagline}</p>
                  </div>

                  <div className="flex items-center space-x-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">MRR / ARR</span>
                      <span className="text-xs font-bold text-slate-200">
                        ${proj.financials.mrr.toLocaleString()} / ${proj.financials.arr.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">Asking / Floor</span>
                      <span className="text-xs font-bold text-emerald-400">
                        ${proj.askingPrice.toLocaleString()} / ${proj.minimumPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Score Pills & Tech Stack */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] text-slate-400">Overall Score:</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-cyan-400">
                      {proj.scores.overallScore}/100
                    </span>
                    <span className="text-[10px] text-slate-400 ml-2">Strategic Fit:</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-indigo-400">
                      {proj.scores.strategicScore}/100
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {proj.technologies.slice(0, 4).map((tech, tidx) => (
                      <span key={tidx} className="rounded bg-slate-950 px-2 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-800">
                        {tech}
                      </span>
                    ))}
                    {proj.technologies.length > 4 && (
                      <span className="text-[10px] text-slate-400 font-mono">+{proj.technologies.length - 4} more</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Live Agent Operations Feed & Quick Actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-4 w-4 text-cyan-400" />
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                Autonomous Agent Log
              </h3>
            </div>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="rounded-2xl bg-slate-900/80 p-4 border border-slate-800 shadow-sm space-y-3 max-h-[480px] overflow-y-auto">
            {auditLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      log.actorType === 'AGENT' ? 'bg-indigo-400' : 'bg-emerald-400'
                    }`} />
                    <span className="text-xs font-bold text-slate-200">{log.actor}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="text-[11px] font-semibold text-indigo-300">{log.action}</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{log.details}</p>
              </div>
            ))}
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="grid grid-cols-2 gap-2">
            <button
              id="dash-vdr-btn"
              onClick={() => onNavigateTab('dataroom')}
              className="flex items-center space-x-2 rounded-xl bg-slate-900 p-3 text-left border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <Lock className="h-4 w-4 text-indigo-400" />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Data Room</span>
                <span className="text-[10px] text-slate-400">NDA & VDR Files</span>
              </div>
            </button>

            <button
              id="dash-dd-btn"
              onClick={() => onNavigateTab('diligence')}
              className="flex items-center space-x-2 rounded-xl bg-slate-900 p-3 text-left border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Due Diligence</span>
                <span className="text-[10px] text-slate-400">10-Pillar Audit</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
