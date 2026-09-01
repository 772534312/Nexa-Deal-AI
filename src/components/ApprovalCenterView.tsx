import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  UserCheck, 
  Sliders, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ApprovalItem } from '../types';

interface ApprovalCenterViewProps {
  approvals: ApprovalItem[];
  onResolveApproval: (id: string, status: 'APPROVED' | 'REJECTED' | 'EDITED', notes?: string) => Promise<void>;
}

export const ApprovalCenterView: React.FC<ApprovalCenterViewProps> = ({
  approvals,
  onResolveApproval,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'RESOLVED'>('PENDING');
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const filteredApprovals = approvals.filter((a) => {
    if (filter === 'PENDING') return a.status === 'PENDING';
    if (filter === 'RESOLVED') return a.status !== 'PENDING';
    return true;
  });

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED' | 'EDITED') => {
    setResolvingId(id);
    await onResolveApproval(id, status);
    setResolvingId(null);
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/20">Critical Risk</span>;
      case 'HIGH':
        return <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20">High Risk</span>;
      case 'MEDIUM':
        return <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">Medium Risk</span>;
      default:
        return <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-400">Low Risk</span>;
    }
  };

  return (
    <div id="approval-center-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            Human Approval Center (HITL)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enforces human-in-the-loop oversight for high-risk autonomous agent operations and legal releases.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {(['PENDING', 'RESOLVED', 'ALL'] as const).map((f) => (
            <button
              key={f}
              id={`filter-approval-${f.toLowerCase()}`}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filter === f
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Safety Policy Status Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-white">Active HITL Safety Guardrails</h4>
            <p className="text-xs text-slate-400">
              Financial disclosures, pricing concessions &gt;10%, NDA approvals, and final asset transfers strictly require human confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* Approval Items List */}
      <div className="space-y-4">
        {filteredApprovals.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
            No approval requests found for this filter. All agent operations are nominal.
          </div>
        ) : (
          filteredApprovals.map((item) => {
            const isPending = item.status === 'PENDING';
            return (
              <div
                key={item.id}
                id={`approval-item-${item.id}`}
                className={`rounded-2xl p-6 border transition-all ${
                  isPending
                    ? 'bg-slate-900/90 border-slate-800 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2.5">
                      {getRiskBadge(item.riskLevel)}
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-cyan-400 border border-slate-700">
                        {item.type}
                      </span>
                      <span className="text-xs text-slate-400">Requested by: <strong className="text-slate-200">{item.agentId}</strong></span>
                    </div>

                    <h3 className="font-display text-base font-bold text-white mt-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Status or Action Buttons */}
                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-start">
                    {isPending ? (
                      <>
                        <button
                          id={`reject-approval-${item.id}-btn`}
                          disabled={resolvingId === item.id}
                          onClick={() => handleAction(item.id, 'REJECTED')}
                          className="flex items-center space-x-1 rounded-xl bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 disabled:opacity-50 transition-colors"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Reject</span>
                        </button>

                        <button
                          id={`approve-approval-${item.id}-btn`}
                          disabled={resolvingId === item.id}
                          onClick={() => handleAction(item.id, 'APPROVED')}
                          className="flex items-center space-x-1 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 disabled:opacity-50 transition-all"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Approve Action</span>
                        </button>
                      </>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {item.status} ({item.resolvedBy || 'Founder'})
                      </span>
                    )}
                  </div>
                </div>

                {/* AI Justification & Recommendation */}
                {item.aiRecommendation && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 rounded-xl bg-slate-950/60 p-3.5 border border-slate-800">
                    <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>AI Agent Assessment & Reasoning:</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {item.aiRecommendation}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
