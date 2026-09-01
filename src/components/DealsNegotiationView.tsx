import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Scale, 
  Clock, 
  ChevronRight, 
  ArrowRight, 
  Bot, 
  ShieldAlert,
  Loader2,
  FileText,
  Sliders
} from 'lucide-react';
import { Deal, Offer, Project, Buyer, NegotiationResult } from '../types';

interface DealsNegotiationViewProps {
  deals: Deal[];
  offers: Offer[];
  projects: Project[];
  buyers: Buyer[];
  onTransitionStage: (dealId: string, stage: string) => Promise<void>;
  onRunAiNegotiation: (projectId: string, buyerId: string, offer: any) => Promise<NegotiationResult | null>;
}

export const DealsNegotiationView: React.FC<DealsNegotiationViewProps> = ({
  deals,
  offers,
  projects,
  buyers,
  onTransitionStage,
  onRunAiNegotiation,
}) => {
  const [selectedDeal, setSelectedDeal] = useState<Deal>(deals[0] || null);
  const [simOfferAmount, setSimOfferAmount] = useState('52000');
  const [simUpfrontCash, setSimUpfrontCash] = useState('45000');
  const [simEarnout, setSimEarnout] = useState('7000');
  const [simTransitionDays, setSimTransitionDays] = useState('30');
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [negotiationResult, setNegotiationResult] = useState<NegotiationResult | null>(null);

  const stages = [
    'PROSPECT',
    'OUTREACH_SENT',
    'REPLIED_INTERESTED',
    'NDA_PENDING',
    'VDR_ACCESSED',
    'OFFER_RECEIVED',
    'NEGOTIATING_TERMS',
    'LOI_EXECUTED',
    'CLOSING_ESCROW',
    'ASSET_TRANSFERRED'
  ];

  const handleRunNegotiationSim = async () => {
    if (!selectedDeal) return;
    setIsNegotiating(true);
    setNegotiationResult(null);

    const project = projects.find(p => p.id === selectedDeal.projectId) || projects[0];
    const buyer = buyers.find(b => b.id === selectedDeal.buyerId) || buyers[0];

    const result = await onRunAiNegotiation(project.id, buyer.id, {
      amount: Number(simOfferAmount),
      upfrontCash: Number(simUpfrontCash),
      earnoutConditions: `$${Number(simEarnout)} earnout based on 90-day retention`,
      transitionPeriodDays: Number(simTransitionDays),
    });

    setNegotiationResult(result);
    setIsNegotiating(false);
  };

  return (
    <div id="deals-negotiation-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            Deals Pipeline & AI Negotiation Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated valuation guardrails, counter-offer tactics, and multi-offer comparison matrices.
          </p>
        </div>
      </div>

      {/* 16-Stage Horizontal Progress Overview */}
      <div className="rounded-2xl bg-slate-900/90 p-4 border border-slate-800 overflow-x-auto">
        <div className="flex items-center space-x-2 min-w-[800px]">
          {stages.slice(0, 7).map((stg, sidx) => {
            const isCurrent = selectedDeal?.stage === stg;
            return (
              <div key={stg} className="flex-1 flex items-center space-x-2">
                <button
                  onClick={() => selectedDeal && onTransitionStage(selectedDeal.id, stg)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[9px] uppercase font-bold tracking-wider block">Stage {sidx + 1}</span>
                  <span className="text-xs font-semibold block truncate mt-0.5">{stg.replace(/_/g, ' ')}</span>
                </button>
                {sidx < 6 && <ChevronRight className="h-3.5 w-3.5 text-slate-600 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Deals List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Active Acquisition Deals ({deals.length})
          </span>

          {deals.map((deal) => {
            const isSelected = selectedDeal?.id === deal.id;
            const project = projects.find(p => p.id === deal.projectId);
            const buyer = buyers.find(b => b.id === deal.buyerId);

            return (
              <div
                key={deal.id}
                id={`deal-card-${deal.id}`}
                onClick={() => setSelectedDeal(deal)}
                className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                  isSelected 
                    ? 'bg-slate-900 border-indigo-500 shadow-md shadow-indigo-500/10' 
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-white">{buyer?.companyName || 'Datadog Ventures'}</span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                    ${(deal.currentOfferAmount || 52000).toLocaleString()}
                  </span>
                </div>

                <div className="text-xs text-slate-400 mt-1">Asset: {project?.name}</div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                  <span className="text-slate-400">Closing Prob:</span>
                  <span className="font-bold text-indigo-400">{deal.closingProbability}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: AI Negotiation Studio & Offer Simulator (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedDeal ? (
            <div className="rounded-2xl bg-slate-900/90 p-6 border border-slate-800 shadow-sm space-y-6">
              {/* Deal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    Live Negotiation Terminal
                  </h3>
                  <p className="text-xs text-slate-400">
                    Active deal between <span className="text-slate-200 font-semibold">{buyers.find(b => b.id === selectedDeal.buyerId)?.companyName}</span> and <span className="text-indigo-300 font-semibold">{projects.find(p => p.id === selectedDeal.projectId)?.name}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-400 border border-indigo-500/20">
                    Stage: {selectedDeal.stage.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Offer Simulator Inputs */}
              <div className="rounded-xl bg-slate-950/70 p-5 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sliders className="h-4 w-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Buyer Offer Parameters & Conditions
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">Seller Minimum Floor: $48,000</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Total Offer ($)</label>
                    <input
                      type="number"
                      id="negotiate-offer-amount"
                      value={simOfferAmount}
                      onChange={(e) => setSimOfferAmount(e.target.value)}
                      className="w-full rounded-lg bg-slate-900 p-2 text-xs text-emerald-400 border border-slate-800 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Upfront Cash ($)</label>
                    <input
                      type="number"
                      id="negotiate-upfront-cash"
                      value={simUpfrontCash}
                      onChange={(e) => setSimUpfrontCash(e.target.value)}
                      className="w-full rounded-lg bg-slate-900 p-2 text-xs text-slate-100 border border-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Earnout ($)</label>
                    <input
                      type="number"
                      id="negotiate-earnout"
                      value={simEarnout}
                      onChange={(e) => setSimEarnout(e.target.value)}
                      className="w-full rounded-lg bg-slate-900 p-2 text-xs text-slate-100 border border-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Transition Days</label>
                    <input
                      type="number"
                      id="negotiate-transition"
                      value={simTransitionDays}
                      onChange={(e) => setSimTransitionDays(e.target.value)}
                      className="w-full rounded-lg bg-slate-900 p-2 text-xs text-slate-100 border border-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    id="run-ai-negotiation-btn"
                    disabled={isNegotiating}
                    onClick={handleRunNegotiationSim}
                    className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 transition-all"
                  >
                    {isNegotiating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Evaluating Offer with Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Run AI Negotiation Strategy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* AI Negotiation Output */}
              {negotiationResult && (
                <div className="rounded-xl bg-gradient-to-r from-slate-950 via-indigo-950/20 to-slate-950 p-5 border border-indigo-500/30 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-cyan-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Autonomous Recommendation: <span className="text-emerald-400">{negotiationResult.recommendation}</span>
                      </span>
                    </div>
                    {negotiationResult.counterAmount && (
                      <span className="text-xs font-bold text-indigo-400">
                        Counter: ${negotiationResult.counterAmount.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    <span className="font-semibold text-slate-200 block mb-1">Strategic Tactical Rationale:</span>
                    {negotiationResult.strategicRationale}
                  </div>

                  {negotiationResult.counterTactics && (
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">Negotiation Leverage Levers:</span>
                      <ul className="text-xs text-slate-300 space-y-1">
                        {negotiationResult.counterTactics.map((tactic, tidx) => (
                          <li key={tidx} className="flex items-start space-x-1.5">
                            <span className="text-cyan-400 font-bold">•</span>
                            <span>{tactic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {negotiationResult.draftCounterEmail && (
                    <div className="pt-2">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">Generated Counter-Offer Email:</span>
                      <div className="rounded-lg bg-slate-950 p-3 text-xs text-slate-200 border border-slate-800 whitespace-pre-line font-sans">
                        {negotiationResult.draftCounterEmail}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="py-20 text-center text-xs text-slate-500">
              Select an active deal from the left column to run the AI negotiation simulator.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
