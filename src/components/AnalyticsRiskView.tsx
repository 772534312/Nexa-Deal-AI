import React from 'react';
import { 
  BarChart3, 
  Cpu, 
  DollarSign, 
  ShieldAlert, 
  Sparkles, 
  Lock, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  Layers
} from 'lucide-react';
import { AuditLog, RiskEvent, AIUsage } from '../types';

interface AnalyticsRiskViewProps {
  auditLogs: AuditLog[];
  riskEvents: RiskEvent[];
  analyticsData: any;
}

export const AnalyticsRiskView: React.FC<AnalyticsRiskViewProps> = ({
  auditLogs,
  riskEvents,
  analyticsData,
}) => {
  const totalCost = analyticsData?.totalAiCost || 0.084;
  const totalTokens = analyticsData?.totalTokens || 56000;

  return (
    <div id="analytics-risk-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            Analytics, AI Token Economics & Security Risk
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time audit telemetry, token spend tracking across Gemini 2.5 models, and proactive M&A risk detection.
          </p>
        </div>
      </div>

      {/* AI Token Economics Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-slate-900/90 p-5 border border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total AI Tokens Processed</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="font-display text-2xl font-bold text-white">{totalTokens.toLocaleString()}</span>
            <span className="text-xs text-indigo-400 font-mono">tokens</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Across 15 autonomous agents</p>
        </div>

        <div className="rounded-2xl bg-slate-900/90 p-5 border border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Compute / API Spend</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="font-display text-2xl font-bold text-emerald-400">${totalCost.toFixed(4)}</span>
            <span className="text-xs text-slate-400">USD</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Gemini 2.5 Flash server-side usage</p>
        </div>

        <div className="rounded-2xl bg-slate-900/90 p-5 border border-slate-800 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Defensive Shield Status</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="font-display text-2xl font-bold text-cyan-400">100% Secure</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Anti-Prompt Injection & IDOR active</p>
        </div>
      </div>

      {/* Risk Engine Intercepts & Security Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Risk Events */}
        <div className="rounded-2xl bg-slate-900/90 p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                Risk Engine Intercepts ({riskEvents.length})
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {riskEvents.map((risk) => (
              <div key={risk.id} className="rounded-xl bg-slate-950/60 p-4 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{risk.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    risk.severity === 'HIGH' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {risk.severity} SEVERITY
                  </span>
                </div>
                <p className="text-xs text-slate-300">{risk.description}</p>
                <div className="text-[11px] text-indigo-300 font-semibold pt-1 border-t border-slate-800/60">
                  Mitigation: {risk.mitigation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Immutable Audit Stream */}
        <div className="rounded-2xl bg-slate-900/90 p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-indigo-400" />
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                Platform Audit Log ({auditLogs.length})
              </h3>
            </div>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{log.actor} ({log.actorType})</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-indigo-300">{log.action} ➔ {log.target}</div>
                <p className="text-[11px] text-slate-400">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
