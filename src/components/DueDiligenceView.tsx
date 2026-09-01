import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Code, 
  DollarSign, 
  FileText, 
  Server, 
  Layers, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { DueDiligenceItem } from '../types';

interface DueDiligenceViewProps {
  items: DueDiligenceItem[];
  onUpdateStatus: (id: string, status: any) => Promise<void>;
}

export const DueDiligenceView: React.FC<DueDiligenceViewProps> = ({
  items,
  onUpdateStatus,
}) => {
  const [selectedPillar, setSelectedPillar] = useState<string>('ALL');

  const pillars = [
    'ALL',
    'Technology',
    'Financials',
    'Legal',
    'Infrastructure',
    'Analytics',
    'Dependencies'
  ];

  const filteredItems = items.filter((item) => {
    if (selectedPillar === 'ALL') return true;
    return item.pillar === selectedPillar;
  });

  const verifiedCount = items.filter(i => i.status === 'VERIFIED').length;
  const healthPercent = Math.round((verifiedCount / items.length) * 100);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">✓ Verified</span>;
      case 'IN_PROGRESS':
        return <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">In Progress</span>;
      case 'ACTION_REQUIRED':
        return <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20">Action Required</span>;
      default:
        return <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-400">Pending</span>;
    }
  };

  return (
    <div id="due-diligence-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            10-Pillar Due Diligence & M&A Readiness
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated verification audits across codebase, IP ownership, financial records, and dependency security.
          </p>
        </div>

        {/* Health Score Pill */}
        <div className="flex items-center space-x-3 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Diligence Readiness</span>
            <span className="font-display text-base font-bold text-emerald-400">{healthPercent}% Score</span>
          </div>
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/20">
            {verifiedCount}/{items.length}
          </div>
        </div>
      </div>

      {/* Pillar Selector */}
      <div className="flex flex-wrap gap-1.5">
        {pillars.map((pil) => (
          <button
            key={pil}
            id={`filter-dd-${pil.toLowerCase()}`}
            onClick={() => setSelectedPillar(pil)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              selectedPillar === pil
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {pil}
          </button>
        ))}
      </div>

      {/* Items Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            id={`dd-item-${item.id}`}
            className="rounded-2xl bg-slate-900/90 p-5 border border-slate-800 shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-indigo-300 border border-indigo-500/20">
                  {item.pillar}
                </span>
                {getStatusBadge(item.status)}
              </div>

              <h4 className="font-display text-sm font-bold text-white mt-2.5">
                {item.title}
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {item.description}
              </p>

              {item.notes && (
                <div className="mt-3 rounded-lg bg-slate-950/70 p-2.5 border border-slate-800/80 text-[11px] text-slate-400">
                  <strong className="text-slate-300">Auditor Notes:</strong> {item.notes}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                Audited by {item.assignedAgent || 'Due Diligence Agent'}
              </span>

              <div className="flex items-center space-x-1.5">
                {item.status !== 'VERIFIED' ? (
                  <button
                    onClick={() => onUpdateStatus(item.id, 'VERIFIED')}
                    className="rounded-lg bg-emerald-600/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white transition-colors"
                  >
                    Mark Verified
                  </button>
                ) : (
                  <button
                    onClick={() => onUpdateStatus(item.id, 'IN_PROGRESS')}
                    className="rounded-lg bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-400 hover:text-slate-200"
                  >
                    Reopen
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
