import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  DollarSign, 
  TrendingUp, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  FileCheck, 
  Send, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Project } from '../types';

interface MarketplaceViewProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onSubmitOffer: (projectId: string, offerAmount: number, buyerName: string) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  projects,
  onSelectProject,
  onSubmitOffer,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [activeOfferProject, setActiveOfferProject] = useState<Project | null>(null);
  const [buyerName, setBuyerName] = useState('CloudScale Capital');
  const [offerAmount, setOfferAmount] = useState('58000');
  const [offerSuccess, setOfferSuccess] = useState(false);

  const categories = ['ALL', 'SaaS', 'AI Platform', 'API / Developer Tool', 'Marketplace'];

  const filtered = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = selectedCat === 'ALL' || p.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOfferProject) return;
    onSubmitOffer(activeOfferProject.id, Number(offerAmount), buyerName);
    setOfferSuccess(true);
    setTimeout(() => {
      setOfferSuccess(false);
      setActiveOfferProject(null);
    }, 2000);
  };

  return (
    <div id="marketplace-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20 mb-2">
            <Building2 className="h-3.5 w-3.5" />
            <span>Confidential Buyer Acquisition Portal</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            Verified Digital Asset Marketplace
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Curated, profitable SaaS and AI assets represented exclusively by Nexa Deal AI.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                selectedCat === cat
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets by niche, stack, or MRR..."
            className="w-full rounded-xl bg-slate-900 pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 border border-slate-800 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            id={`marketplace-card-${proj.id}`}
            className="rounded-2xl bg-slate-900/90 p-5 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all shadow-sm flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
                  {proj.category}
                </span>
                <span className="flex items-center space-x-1 text-[10px] font-semibold text-emerald-400">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Stripe Audited</span>
                </span>
              </div>

              <h3 className="font-display text-base font-bold text-white mt-3 group-hover:text-indigo-400 transition-colors">
                {proj.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {proj.tagline}
              </p>

              {/* Verified Metrics */}
              <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-950/70 p-3 border border-slate-800">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">Asking Price</span>
                  <span className="font-display text-base font-bold text-emerald-400">
                    ${proj.askingPrice.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">Annual ARR</span>
                  <span className="font-display text-base font-bold text-white">
                    ${proj.financials.arr.toLocaleString()}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">Profit (SDE)</span>
                  <span className="text-xs font-bold text-indigo-300">
                    ${proj.financials.monthlyProfit.toLocaleString()}/mo
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">Growth Rate</span>
                  <span className="text-xs font-bold text-emerald-400">
                    +{proj.financials.growthRateYoY}% YoY
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => onSelectProject(proj)}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                View Teaser
              </button>

              <button
                id={`submit-bid-${proj.id}-btn`}
                onClick={() => {
                  setActiveOfferProject(proj);
                  setOfferAmount(String(proj.askingPrice));
                }}
                className="flex items-center space-x-1 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all"
              >
                <DollarSign className="h-3.5 w-3.5" />
                <span>Submit Acquisition Bid</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Acquisition Offer Modal */}
      {activeOfferProject && (
        <div id="submit-offer-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="font-display text-base font-bold text-white">
              Submit Formal Letter of Intent (LOI) Offer
            </h3>
            <p className="text-xs text-slate-400">
              For asset: <strong className="text-indigo-300">{activeOfferProject.name}</strong> (Asking: ${activeOfferProject.askingPrice.toLocaleString()})
            </p>

            {offerSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                <h4 className="font-display text-base font-bold text-white">Acquisition Offer Dispatched!</h4>
                <p className="text-xs text-slate-400">Nexa Deal AI agents are evaluating terms and queuing for founder approval.</p>
              </div>
            ) : (
              <form onSubmit={handleSendOffer} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Acquirer Entity / Buyer Name *</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 p-2.5 text-xs text-slate-100 border border-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Offer Purchase Price ($ USD) *</label>
                  <input
                    type="number"
                    required
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 p-2.5 text-xs text-emerald-400 font-mono font-bold border border-slate-800"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveOfferProject(null)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Bid to M&A Agent</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
