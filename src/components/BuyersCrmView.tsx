import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Sparkles, 
  Target, 
  Mail, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  ChevronRight, 
  Building, 
  Globe, 
  Loader2, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight 
} from 'lucide-react';
import { Buyer, Project, MatchResult } from '../types';

interface BuyersCrmViewProps {
  buyers: Buyer[];
  projects: Project[];
  onGenerateOutreach: (project: Project, buyer: Buyer) => void;
  onRunMatch: (project: Project, buyer: Buyer) => Promise<MatchResult | null>;
}

export const BuyersCrmView: React.FC<BuyersCrmViewProps> = ({
  buyers,
  projects,
  onGenerateOutreach,
  onRunMatch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuyerType, setSelectedBuyerType] = useState<string>('ALL');
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0] || null);
  const [activeMatchModalBuyer, setActiveMatchModalBuyer] = useState<Buyer | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [isMatching, setIsMatching] = useState(false);

  const buyerTypes = ['ALL', 'Strategic Corporate', 'Private Equity', 'Family Office', 'Individual Operator', 'Aggregator'];

  const filteredBuyers = buyers.filter((b) => {
    const matchesSearch = b.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.thesis.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedBuyerType === 'ALL' || b.type === selectedBuyerType;
    return matchesSearch && matchesType;
  });

  const handleOpenMatchmaker = async (buyer: Buyer) => {
    setActiveMatchModalBuyer(buyer);
    if (!selectedProject) return;
    setIsMatching(true);
    setMatchResult(null);

    const result = await onRunMatch(selectedProject, buyer);
    setMatchResult(result);
    setIsMatching(false);
  };

  return (
    <div id="buyers-crm-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            Strategic Buyer Discovery & M&A CRM
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous multi-factor matching against corporate strategics, PE roll-up funds, and qualified operators.
          </p>
        </div>

        {/* Project Context Selector for Matching */}
        <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Target Asset:</span>
          <select
            id="crm-target-project-select"
            value={selectedProject?.id || ''}
            onChange={(e) => {
              const p = projects.find(proj => proj.id === e.target.value);
              if (p) setSelectedProject(p);
            }}
            className="bg-transparent text-xs font-bold text-indigo-400 focus:outline-none cursor-pointer"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-slate-100">
                {p.name} (${p.askingPrice.toLocaleString()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {buyerTypes.map((type) => (
            <button
              key={type}
              id={`filter-buyer-${type.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => setSelectedBuyerType(type)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                selectedBuyerType === type
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            id="buyers-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company, thesis, or sector..."
            className="w-full rounded-xl bg-slate-900 pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 border border-slate-800 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Buyers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBuyers.map((buyer) => (
          <div
            key={buyer.id}
            id={`buyer-card-${buyer.id}`}
            className="flex flex-col justify-between rounded-2xl bg-slate-900/90 p-5 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all shadow-sm group"
          >
            <div>
              {/* Header Badge & Corporate Affiliation */}
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/20">
                  {buyer.type}
                </span>
                
                {/* Corporate Affiliation Badge */}
                {buyer.corporateAffiliationStatus === 'VERIFIED' ? (
                  <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Affiliation Verified</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/20">
                    <AlertTriangle className="h-3 w-3" />
                    <span>BUYER AFFILIATION UNVERIFIED</span>
                  </span>
                )}
              </div>

              {/* Status Pill */}
              <div className="mt-2 flex items-center justify-end">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                  buyer.status === 'OFFER_MADE'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : buyer.status === 'NEGOTIATING'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {buyer.status.replace('_', ' ')}
                </span>
              </div>

              {/* Title & Industry */}
              <div className="mt-3 flex items-start space-x-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 border border-slate-800 text-indigo-400 font-display font-bold text-sm">
                  {buyer.companyName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {buyer.companyName}
                  </h3>
                  <span className="text-xs text-slate-400">{buyer.industry}</span>
                </div>
              </div>

              {/* Thesis */}
              <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                {buyer.thesis}
              </p>

              {/* Budget & Decision Makers Bento */}
              <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-950/70 p-3 border border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Budget Range</span>
                  <span className="text-xs font-bold text-emerald-400">
                    ${buyer.budgetMin.toLocaleString()} – ${buyer.budgetMax.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Track Record</span>
                  <span className="text-xs font-bold text-slate-200">
                    {buyer.pastAcquisitionsCount} Acquisitions
                  </span>
                </div>
              </div>

              {/* Decision Makers List */}
              {buyer.decisionMakers && buyer.decisionMakers.length > 0 && (
                <div className="mt-3 space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Key Decision Maker:</span>
                  <div className="flex items-center space-x-2 text-xs text-slate-300">
                    <span className="font-semibold text-white">{buyer.decisionMakers[0].name}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 text-[11px]">{buyer.decisionMakers[0].role}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                id={`match-buyer-${buyer.id}-btn`}
                onClick={() => handleOpenMatchmaker(buyer)}
                className="flex items-center space-x-1 rounded-lg bg-indigo-600/10 px-2.5 py-1.5 text-xs font-semibold text-indigo-300 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Synergy Match</span>
              </button>

              <button
                id={`outreach-buyer-${buyer.id}-btn`}
                onClick={() => onGenerateOutreach(selectedProject, buyer)}
                className="flex items-center space-x-1 text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Pitch</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Synergy Matchmaker Modal */}
      {activeMatchModalBuyer && (
        <div id="synergy-match-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-white tracking-tight">
                    AI Synergy & Matching Engine
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedProject?.name} ➔ {activeMatchModalBuyer.companyName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveMatchModalBuyer(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-slate-900/40">
              {isMatching ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                  <span className="text-xs text-slate-300 font-semibold">Running 8-factor M&A Synergy algorithms...</span>
                </div>
              ) : matchResult ? (
                <div className="space-y-4">
                  {/* Overall Match Score Banner */}
                  <div className="rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-950 to-indigo-950/40 p-5 border border-indigo-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">AI-Generated Strategic Fit Score</span>
                      <h4 className="font-display text-3xl font-bold text-white mt-0.5">
                        {matchResult.overallMatchScore}% Synergy
                      </h4>
                      <span className="text-xs text-emerald-400 font-semibold">
                        Estimated Deal Probability: {matchResult.estimatedDealProbability}%
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">Acquisition Fit</span>
                      <span className="text-xs font-bold text-cyan-400 capitalize">{matchResult.acquisitionFitTier || 'Tier 1 Strategic'}</span>
                    </div>
                  </div>

                  {/* Strategic Rationale */}
                  <div className="rounded-xl bg-slate-950/70 p-4 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                      Strategic Acquirer Rationale
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {matchResult.strategicRationale}
                    </p>
                  </div>

                  {/* Synergy Factors Breakdown */}
                  {matchResult.synergyFactors && (
                    <div className="rounded-xl bg-slate-950/70 p-4 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                        Multi-Factor Evaluation Breakdown
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {Object.entries(matchResult.synergyFactors).map(([key, val]) => (
                          <div key={key} className="rounded-lg bg-slate-900 p-2 border border-slate-800 text-center">
                            <span className="text-[9px] uppercase font-medium text-slate-400 block truncate">{key.replace(/([A-Z])/g, ' $1')}</span>
                            <span className="font-display text-sm font-bold text-indigo-300 block mt-0.5">{val}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Integration Roadmap */}
                  {matchResult.integrationRoadmap && (
                    <div className="rounded-xl bg-slate-950/70 p-4 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                        30-Day Post-Acquisition Integration Plan
                      </span>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {matchResult.integrationRoadmap.map((step, sidx) => (
                          <li key={sidx} className="flex items-center space-x-2">
                            <span className="text-cyan-400 font-bold">→</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => {
                        const b = activeMatchModalBuyer;
                        setActiveMatchModalBuyer(null);
                        onGenerateOutreach(selectedProject, b);
                      }}
                      className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>Proceed to Automated Outreach</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
