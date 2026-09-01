import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings2, 
  ShieldCheck, 
  Cpu, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Lock,
  Globe,
  Mail,
  GitBranch,
  Key,
  Server,
  DollarSign
} from 'lucide-react';
import { IntegrationServiceStatus, SellerPolicy, ToolDefinition } from '../types';

interface IntegrationsGovernanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntegrationsGovernanceModal: React.FC<IntegrationsGovernanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'integrations' | 'policy' | 'tools'>('integrations');
  const [integrations, setIntegrations] = useState<IntegrationServiceStatus[]>([]);
  const [tools, setTools] = useState<ToolDefinition[]>([]);
  const [policy, setPolicy] = useState<SellerPolicy | null>(null);
  const [savingPolicy, setSavingPolicy] = useState(false);
  const [policySavedSuccess, setPolicySavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/integrations')
        .then(r => r.json())
        .then(d => { if (d.integrations) setIntegrations(d.integrations); });

      fetch('/api/tools')
        .then(r => r.json())
        .then(d => { if (d.tools) setTools(d.tools); });

      fetch('/api/seller-policy')
        .then(r => r.json())
        .then(d => { if (d.policy) setPolicy(d.policy); });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policy) return;
    try {
      setSavingPolicy(true);
      const res = await fetch('/api/seller-policy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policy),
      });
      const data = await res.json();
      if (data.policy) {
        setPolicy(data.policy);
        setPolicySavedSuccess(true);
        setTimeout(() => setPolicySavedSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Error saving seller policy:', err);
    } finally {
      setSavingPolicy(false);
    }
  };

  const getStatusBadge = (status: IntegrationServiceStatus['status']) => {
    switch (status) {
      case 'CONNECTED':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">CONNECTED</span>;
      case 'SANDBOX':
        return <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px] font-bold">SANDBOX MODE</span>;
      case 'DEMO_MODE':
        return <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] font-bold">DEMO MODE</span>;
      default:
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold">CONFIG REQUIRED</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Settings2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">
                Platform Integrations & Governance Policy
              </h3>
              <p className="text-xs text-slate-400">
                Manage live API bridges, autonomous negotiation guardrails, and tool sandboxes.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center px-6 pt-3 border-b border-slate-800 space-x-2 bg-slate-900">
          <button
            onClick={() => setActiveTab('integrations')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'integrations'
                ? 'border-indigo-500 text-white bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Integrations & Service Status ({integrations.length})
          </button>
          <button
            onClick={() => setActiveTab('policy')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'policy'
                ? 'border-indigo-500 text-white bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Seller Policy & Pricing Guardrails
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'tools'
                ? 'border-indigo-500 text-white bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Agent Tool Registry ({tools.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Tab 1: Integrations */}
          {activeTab === 'integrations' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                The platform transparently identifies live API credentials versus sandboxed prototypes. When secret keys are configured in environment variables, agents transition seamlessly from sandbox to live production execution.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-display text-sm font-bold text-white">{item.name}</h4>
                        <span className="text-[10px] text-indigo-400 font-mono">{item.category}</span>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>

                    <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                      <span className="truncate pr-2 font-mono text-[10px] text-slate-400">{item.details}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Seller Policy */}
          {activeTab === 'policy' && policy && (
            <form onSubmit={handleSavePolicy} className="space-y-5">
              <div className="rounded-2xl bg-indigo-950/20 border border-indigo-500/20 p-4 flex items-start space-x-3 text-indigo-300 text-xs">
                <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5 text-indigo-400" />
                <div>
                  <span className="font-bold block">Hardcoded Enforcement Safeguards:</span>
                  AI Agents are mathematically prohibited from accepting or proposing deals below your Minimum Price Floor ($48,000). Any price concessions &gt;10% trigger mandatory Human-in-the-Loop approval.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Minimum Absolute Price Floor ($ USD)
                  </label>
                  <input
                    type="number"
                    value={policy.minimumPriceFloor}
                    onChange={(e) => setPolicy({ ...policy, minimumPriceFloor: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white font-mono"
                    required
                  />
                  <span className="text-[10px] text-slate-400">Agents will auto-reject or counter any bid below this floor.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Acquisition Price ($ USD)
                  </label>
                  <input
                    type="number"
                    value={policy.targetPrice}
                    onChange={(e) => setPolicy({ ...policy, targetPrice: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white font-mono"
                    required
                  />
                  <span className="text-[10px] text-slate-400">Target valuation anchored in initial outreach pitches.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Max Allowed Discount (%)
                  </label>
                  <input
                    type="number"
                    value={policy.maxDiscountPercent}
                    onChange={(e) => setPolicy({ ...policy, maxDiscountPercent: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Max Outreach Pitches / Day
                  </label>
                  <input
                    type="number"
                    value={policy.maxOutreachRatePerDay}
                    onChange={(e) => setPolicy({ ...policy, maxOutreachRatePerDay: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white font-mono"
                    required
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={policy.requireNdaForFinancials}
                    onChange={(e) => setPolicy({ ...policy, requireNdaForFinancials: e.target.checked })}
                    className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0"
                  />
                  <span className="text-xs text-slate-300">
                    Require executed mutual NDA before revealing detailed trailing 12-month P&L sheets
                  </span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={policy.requireHumanApprovalForPriceConcession}
                    onChange={(e) => setPolicy({ ...policy, requireHumanApprovalForPriceConcession: e.target.checked })}
                    className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0"
                  />
                  <span className="text-xs text-slate-300">
                    Require founder human approval for any pricing concession over $2,000
                  </span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={policy.requireHumanApprovalForEscrow}
                    onChange={(e) => setPolicy({ ...policy, requireHumanApprovalForEscrow: e.target.checked })}
                    className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0"
                  />
                  <span className="text-xs text-slate-300">
                    Require founder human approval before initiating final asset escrow disbursements
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                {policySavedSuccess ? (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Seller governance policy successfully synchronized.</span>
                  </span>
                ) : <span />}

                <button
                  type="submit"
                  disabled={savingPolicy}
                  className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{savingPolicy ? 'Saving...' : 'Save Policy'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Tab 3: Tool Registry */}
          {activeTab === 'tools' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                All autonomous sub-agents execute functions through the standardized Tool Registry with strict permission verification and per-minute rate limits.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tools.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-sm font-bold text-white">{t.name}</h4>
                      <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        {t.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">{t.description}</p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {t.requiredPermissions.map(p => (
                        <span key={p} className="text-[9px] font-mono bg-slate-900 text-indigo-300 border border-slate-800 px-1.5 py-0.5 rounded">
                          {p}
                        </span>
                      ))}
                      <span className="text-[9px] font-mono bg-slate-900 text-cyan-400 border border-slate-800 px-1.5 py-0.5 rounded ml-auto">
                        Limit: {t.rateLimit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
