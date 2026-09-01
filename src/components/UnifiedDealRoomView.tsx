import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Calendar, 
  Sparkles, 
  Mail, 
  Key, 
  ArrowRight, 
  Download, 
  FileCheck2, 
  Activity, 
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Printer
} from 'lucide-react';
import { Deal, Project, Buyer, Offer, EmailMessage, NDA, DueDiligenceItem, DealHealthScore, DealClosingProbability, TransactionChecklistItem, HandoverMilestoneDay, TransactionArchive } from '../types';

interface UnifiedDealRoomViewProps {
  deals: Deal[];
  projects: Project[];
  buyers: Buyer[];
  onOpenDealCoach?: () => void;
  onOpenExecutiveReport?: (projectId: string) => void;
}

export const UnifiedDealRoomView: React.FC<UnifiedDealRoomViewProps> = ({
  deals,
  projects,
  buyers,
  onOpenDealCoach,
  onOpenExecutiveReport
}) => {
  const [selectedDealId, setSelectedDealId] = useState<string>(deals[0]?.id || 'deal-1');
  const [roomData, setRoomData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'checklist' | 'diligence' | 'handover' | 'archive' | 'communications'>('overview');
  const [advancingStep, setAdvancingStep] = useState<string | null>(null);

  const fetchDealRoom = async (dealId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/deals/${dealId}/room`);
      const data = await res.json();
      setRoomData(data);
    } catch (err) {
      console.error('Failed to load deal room data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDealId) {
      fetchDealRoom(selectedDealId);
    }
  }, [selectedDealId]);

  const handleAdvanceChecklist = async (stepId: string) => {
    setAdvancingStep(stepId);
    try {
      await fetch(`/api/deals/${selectedDealId}/transaction-checklist/advance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId })
      });
      fetchDealRoom(selectedDealId);
    } catch (err) {
      console.error(err);
    } finally {
      setAdvancingStep(null);
    }
  };

  const handleToggleHandover = async (milestoneId: string, currentStatus: string) => {
    try {
      await fetch(`/api/deals/${selectedDealId}/handover-plan/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId, status: currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED' })
      });
      fetchDealRoom(selectedDealId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateArchive = async () => {
    try {
      await fetch(`/api/deals/${selectedDealId}/archive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      fetchDealRoom(selectedDealId);
    } catch (err) {
      console.error(err);
    }
  };

  const deal = roomData?.deal || deals.find(d => d.id === selectedDealId);
  const project = roomData?.project || projects.find(p => p.id === deal?.projectId);
  const buyer = roomData?.buyer || buyers.find(b => b.id === deal?.buyerId);
  const healthScore: DealHealthScore | undefined = roomData?.healthScore || deal?.healthScore;
  const probability: DealClosingProbability | undefined = roomData?.probabilityBreakdown || deal?.probabilityBreakdown;
  const checklist: TransactionChecklistItem[] = roomData?.checklist || [];
  const handoverPlan: HandoverMilestoneDay[] = roomData?.handoverPlan || [];

  const completedSteps = checklist.filter(s => s.status === 'COMPLETED').length;
  const progressPct = checklist.length ? Math.round((completedSteps / checklist.length) * 100) : 60;

  return (
    <div id="unified-deal-room-view" className="space-y-6">
      {/* Header & Deal Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-slate-900/80 p-5 border border-slate-800 backdrop-blur-sm">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-white tracking-tight">360° Unified Deal Room</h1>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                  LIVE TRANSACTION WORKSPACE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Single unified workspace synchronizing Project, Buyer, Diligence, Escrow & Handover
              </p>
            </div>
          </div>
        </div>

        {/* Deal Selector and Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            id="deal-room-selector"
            value={selectedDealId}
            onChange={(e) => setSelectedDealId(e.target.value)}
            className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-200 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {deals.map(d => {
              const proj = projects.find(p => p.id === d.projectId);
              const buy = buyers.find(b => b.id === d.buyerId);
              return (
                <option key={d.id} value={d.id}>
                  {proj?.name || d.projectId} ↔ {buy?.companyName || d.buyerId} (${(d.currentOfferAmount || 0).toLocaleString()})
                </option>
              );
            })}
          </select>

          {project && onOpenExecutiveReport && (
            <button
              id="generate-exec-report-btn"
              onClick={() => onOpenExecutiveReport(project.id)}
              className="flex items-center space-x-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <FileText className="h-3.5 w-3.5 text-cyan-400" />
              <span>17-Pt M&A Report</span>
            </button>
          )}

          <button
            id="refresh-deal-room-btn"
            onClick={() => fetchDealRoom(selectedDealId)}
            className="flex items-center space-x-1.5 rounded-xl bg-indigo-600/20 px-3 py-2 text-xs font-semibold text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Transaction Vital Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Offer vs Minimum Floor */}
        <div className="rounded-2xl bg-slate-900/60 p-4 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Agreed / Active Offer</span>
            <span className="font-semibold text-emerald-400">Verified Cash</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white font-mono">
              ${(deal?.currentOfferAmount || 52000).toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">USD</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span>Hard Floor: <strong className="text-rose-400">${(deal?.minimumPrice || 48000).toLocaleString()}</strong></span>
            <span>Target: <strong className="text-indigo-300">${(deal?.targetPrice || 56000).toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Deal Health Status */}
        <div className="rounded-2xl bg-slate-900/60 p-4 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Deal Health Score</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              healthScore?.status === 'HEALTHY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              healthScore?.status === 'WATCH' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {healthScore?.status || 'HEALTHY'}
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white font-mono">
              {healthScore?.overallScore || 92}<span className="text-sm font-normal text-slate-400">/100</span>
            </span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-[11px] text-slate-400 truncate pt-1 border-t border-slate-800/80">
            {healthScore?.summary || 'Diligence metrics normal across all dimensions.'}
          </div>
        </div>

        {/* Closing Probability */}
        <div className="rounded-2xl bg-slate-900/60 p-4 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Closing Probability</span>
            <span className="font-semibold text-indigo-400">Confidence: {probability?.confidence || 94}%</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white font-mono">
              {deal?.closingProbability || 88}%
            </span>
            <TrendingUp className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-[11px] text-slate-400 truncate pt-1 border-t border-slate-800/80">
            Stage: <strong className="text-slate-200">{deal?.stage || 'NEGOTIATING'}</strong>
          </div>
        </div>

        {/* Transaction Progression Checklist */}
        <div className="rounded-2xl bg-slate-900/60 p-4 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Transaction Progress</span>
            <span className="font-semibold text-cyan-400">{completedSteps}/{checklist.length} Steps</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white font-mono">
              {progressPct}%
            </span>
            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Deal Overview & Health', icon: Activity },
          { id: 'checklist', label: '15-Step Transaction Checklist', icon: FileCheck2, badge: `${completedSteps}/${checklist.length}` },
          { id: 'diligence', label: 'Tiered VDR & NDA', icon: Lock },
          { id: 'handover', label: '30-Day Post-Sale Plan', icon: Calendar },
          { id: 'communications', label: 'Email Memory & Offers', icon: Mail },
          { id: 'archive', label: 'Post-Closing Archive', icon: FileText },
        ].map(tab => {
          const IconComp = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`subtab-${tab.id}-btn`}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <IconComp className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${isActive ? 'bg-indigo-800 text-indigo-200' : 'bg-slate-800 text-slate-400'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & HEALTH */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Project & Buyer Relationship */}
          <div className="lg:col-span-2 space-y-6">
            {/* Entity Summary Card */}
            <div className="rounded-2xl bg-slate-900/60 p-5 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Transaction Counterparties</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Project / Seller Side */}
                <div className="rounded-xl bg-slate-950 p-4 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Asset / Seller</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {project?.category || 'SaaS'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{project?.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{project?.tagline}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
                    <div>
                      <span className="text-slate-500 text-[10px]">MRR / ARR</span>
                      <p className="font-semibold text-slate-200">${(project?.financials?.mrr || 0).toLocaleString()} / ${(project?.financials?.arr || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">Net Margin</span>
                      <p className="font-semibold text-slate-200">{Math.round(((project?.financials?.monthlyProfit || 0) / (project?.financials?.monthlyRevenue || 1)) * 100)}%</p>
                    </div>
                  </div>
                </div>

                {/* Buyer Side */}
                <div className="rounded-xl bg-slate-950 p-4 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Verified Acquirer</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {buyer?.qualificationTier || 'QUALIFIED'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{buyer?.companyName}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{buyer?.industry}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
                    <div>
                      <span className="text-slate-500 text-[10px]">Budget Capacity</span>
                      <p className="font-semibold text-slate-200">${(buyer?.potentialBudgetMax || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">Acquisitions</span>
                      <p className="font-semibold text-slate-200">{buyer?.acquisitionHistory?.length || 0} Tracked</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategic Rationale & Synergies */}
            <div className="rounded-2xl bg-slate-900/60 p-5 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <span>Strategic Fit & Acquisition Rationale</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {buyer?.strategicRationale || 'The acquirer plans to bolt-on this digital asset directly into their ecosystem, unlocking instant distribution and reducing customer acquisition friction.'}
              </p>

              {buyer?.qualityScore?.evidenceSummary && (
                <div className="mt-3 space-y-1.5 pt-3 border-t border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verification Evidence</span>
                  {buyer.qualityScore.evidenceSummary.map((ev: string, idx: number) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Col: Health Breakdown & Action Guidance */}
          <div className="space-y-6">
            {/* Health Factor Breakdown */}
            <div className="rounded-2xl bg-slate-900/60 p-5 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Health Dimension Radar</span>
                <span className="text-xs font-mono text-emerald-400">{healthScore?.overallScore || 92}/100</span>
              </h3>

              <div className="space-y-3">
                {[
                  { label: 'Buyer Intent Factor', val: healthScore?.buyerIntentFactor || 95 },
                  { label: 'Offer Strength Factor', val: healthScore?.offerStrengthFactor || 92 },
                  { label: 'Price vs Policy Floor', val: healthScore?.priceDistanceFactor || 90 },
                  { label: 'Diligence Progress', val: healthScore?.dueDiligenceProgressFactor || 88 },
                  { label: 'VDR & NDA Clearance', val: healthScore?.ndaDataRoomFactor || 100 },
                  { label: 'Buyer Response Cadence', val: healthScore?.buyerResponsivenessFactor || 94 },
                ].map((dim, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{dim.label}</span>
                      <span className="font-mono text-slate-200">{dim.val}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${dim.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommended Next Action */}
              <div className="rounded-xl bg-indigo-500/10 p-3.5 border border-indigo-500/20 space-y-1.5 mt-4">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="h-3 w-3" />
                  <span>Recommended Action</span>
                </span>
                <p className="text-xs text-indigo-200 leading-relaxed font-medium">
                  {deal?.recommendedNextAction || 'Proceed with standard escrow initiation and schedule technical walkthrough.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 15-STEP TRANSACTION CHECKLIST */}
      {activeSubTab === 'checklist' && (
        <div className="rounded-2xl bg-slate-900/60 p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Immutable Transaction Closing Checklist</h3>
              <p className="text-xs text-slate-400">Strict sequential steps from seller verification to post-closing archival</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/20">
              {completedSteps} / {checklist.length} Completed
            </span>
          </div>

          <div className="space-y-2.5 pt-2">
            {checklist.map((step) => {
              const isCompleted = step.status === 'COMPLETED';
              const isInProgress = step.status === 'IN_PROGRESS';
              return (
                <div
                  key={step.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    isCompleted 
                      ? 'bg-slate-950/60 border-slate-800/80 text-slate-300' 
                      : isInProgress
                      ? 'bg-indigo-950/30 border-indigo-500/40 text-white'
                      : 'bg-slate-950/30 border-slate-900 text-slate-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                      isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      isInProgress ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 animate-pulse' :
                      'bg-slate-800 text-slate-500'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : step.stepNumber}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center space-x-2">
                        <span>{step.title}</span>
                        {step.stage && (
                          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold px-1.5 py-0.2 rounded bg-slate-800">
                            {step.stage}
                          </span>
                        )}
                      </h4>
                      {step.notes && <p className="text-[11px] text-slate-400 mt-0.5">{step.notes}</p>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isCompleted ? (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAdvanceChecklist(step.id)}
                        disabled={advancingStep === step.id}
                        className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-sm"
                      >
                        {advancingStep === step.id ? 'Verifying...' : 'Mark Completed'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: TIERED VDR & NDA */}
      {activeSubTab === 'diligence' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* NDA Status */}
          <div className="rounded-2xl bg-slate-900/60 p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Lock className="h-4 w-4 text-indigo-400" />
                <span>Mutual NDA & Legal Gating</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                EXECUTED & BINDING
              </span>
            </div>

            <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Agreement Type:</span>
                <strong className="text-slate-200">Standard Bilateral Software M&A NDA</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Signatory:</span>
                <strong className="text-slate-200">Alexandre Renard (Datadog M&A)</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Watermark Protection:</span>
                <strong className="text-cyan-400">Dynamic SHA-256 Buyer Watermarking Active</strong>
              </div>
            </div>
          </div>

          {/* VDR Maturity Tiers */}
          <div className="rounded-2xl bg-slate-900/60 p-5 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              <span>Virtual Data Room Tier Clearance</span>
            </h3>

            <div className="space-y-2">
              {[
                { tier: 'Tier 1 (Public Teaser)', access: 'UNRESTRICTED', desc: 'Sanitized high-level growth overview' },
                { tier: 'Tier 2 (Post-NDA Diligence)', access: 'GRANTED', desc: 'Audited financials & tech stack dependency tree' },
                { tier: 'Tier 3 (Confidential Assets)', access: 'ESCROW_FUNDED_ONLY', desc: 'Source code, full DB schema & customer list' },
              ].map((t, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div>
                    <span className="font-bold text-slate-200">{t.tier}</span>
                    <p className="text-[11px] text-slate-400">{t.desc}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {t.access}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 30-DAY POST-SALE HANDOVER PLAN */}
      {activeSubTab === 'handover' && (
        <div className="rounded-2xl bg-slate-900/60 p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">30-Day Post-Sale Handover Execution Roadmap</h3>
              <p className="text-xs text-slate-400">Structured milestone schedule ensuring zero operational disruption post-closing</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {handoverPlan.map((milestone) => {
              const isDone = milestone.status === 'COMPLETED';
              return (
                <div 
                  key={milestone.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isDone ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/20">
                        {milestone.day}
                      </span>
                      <h4 className="text-xs font-bold text-white">{milestone.title}</h4>
                      <span className="text-[10px] text-slate-500 font-medium px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                        {milestone.category}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleHandover(milestone.id, milestone.status)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        isDone 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                          : 'bg-indigo-600 text-white hover:bg-indigo-500'
                      }`}
                    >
                      {isDone ? 'Completed' : 'Mark Done'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400">{milestone.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: COMMUNICATIONS & OFFERS */}
      {activeSubTab === 'communications' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Offers History */}
          <div className="rounded-2xl bg-slate-900/60 p-5 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <span>Offers & Term Sheet Timeline</span>
            </h3>

            <div className="space-y-2.5">
              {(roomData?.offers || []).map((off: Offer) => (
                <div key={off.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white font-mono">${off.amount.toLocaleString()}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 uppercase">
                        {off.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{off.paymentSchedule || '100% Upfront Cash'}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(off.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Email Correspondence Memory */}
          <div className="rounded-2xl bg-slate-900/60 p-5 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Mail className="h-4 w-4 text-cyan-400" />
              <span>Buyer Communication Thread</span>
            </h3>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {(roomData?.emails || []).map((em: EmailMessage) => (
                <div key={em.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{em.sender}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(em.timestamp).toLocaleDateString()}</span>
                  </div>
                  <h5 className="text-xs font-medium text-indigo-300">{em.subject}</h5>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{em.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: POST-CLOSING ARCHIVE */}
      {activeSubTab === 'archive' && (
        <div className="rounded-2xl bg-slate-900/60 p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Immutable Cryptographic Deal Archive</h3>
              <p className="text-xs text-slate-400">Post-closing tamper-proof audit record with SHA-256 seal</p>
            </div>

            <button
              onClick={handleCreateArchive}
              className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/20"
            >
              <FileCheck2 className="h-4 w-4" />
              <span>Snapshot Current State</span>
            </button>
          </div>

          <div className="rounded-xl bg-slate-950 p-5 border border-slate-800 space-y-3 font-mono text-xs text-slate-300">
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-500">Archive Reference:</span>
              <span className="text-slate-200">ARCH-TX-DEAL-1-SETTLED</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-500">Settled Transaction Price:</span>
              <span className="text-emerald-400 font-bold">$52,000 USD (All Cash Escrow)</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-slate-500">SHA-256 Proof Hash:</span>
              <span className="text-cyan-400 break-all text-[11px]">8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">Archive Status:</span>
              <span className="text-emerald-400 font-semibold">READ_ONLY / IMMUTABLE</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
