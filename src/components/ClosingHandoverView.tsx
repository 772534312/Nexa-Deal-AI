import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Globe, 
  GitBranch, 
  Database, 
  UserCheck, 
  Sparkles, 
  Clock, 
  DollarSign,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertTriangle
} from 'lucide-react';
import { ClosingMilestone, AssetHandoverSecret } from '../types';

interface ClosingHandoverViewProps {
  milestones: ClosingMilestone[];
  onToggleMilestone: (id: string) => Promise<void>;
}

export const ClosingHandoverView: React.FC<ClosingHandoverViewProps> = ({
  milestones,
  onToggleMilestone,
}) => {
  const [secrets, setSecrets] = useState<AssetHandoverSecret[]>([]);
  const [loadingSecrets, setLoadingSecrets] = useState(false);
  const [revealingId, setRevealingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'milestones' | 'secrets' | 'escrow'>('milestones');

  const completedCount = milestones.filter(m => m.status === 'COMPLETED').length;
  const progressPercent = milestones.length ? Math.round((completedCount / milestones.length) * 100) : 0;

  const fetchSecrets = async () => {
    try {
      setLoadingSecrets(true);
      const res = await fetch('/api/closing/secrets');
      const data = await res.json();
      if (data.secrets) {
        setSecrets(data.secrets);
      }
    } catch (err) {
      console.error('Error fetching handover secrets:', err);
    } finally {
      setLoadingSecrets(false);
    }
  };

  useEffect(() => {
    fetchSecrets();
  }, []);

  const handleToggle = async (id: string, isNowCompleted: boolean) => {
    if (!isNowCompleted) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
    await onToggleMilestone(id);
  };

  const handleRevealSecret = async (id: string) => {
    try {
      setRevealingId(id);
      const res = await fetch(`/api/closing/secrets/${id}/reveal`, { method: 'POST' });
      const data = await res.json();
      if (data.secret) {
        setSecrets(prev => prev.map(s => s.id === id ? data.secret : s));
      }
    } catch (err) {
      console.error('Error revealing secret:', err);
    } finally {
      setRevealingId(null);
    }
  };

  const handleCopySecret = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleVerifySecret = async (id: string) => {
    try {
      const res = await fetch(`/api/closing/secrets/${id}/verify`, { method: 'POST' });
      const data = await res.json();
      if (data.secret) {
        setSecrets(prev => prev.map(s => s.id === id ? data.secret : s));
      }
    } catch (err) {
      console.error('Error verifying secret:', err);
    }
  };

  return (
    <div id="closing-handover-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            Closing, Escrow & Asset Handover Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated post-LOI settlement: Escrow milestone verification, domain & repository transfer, and encrypted secrets exchange.
          </p>
        </div>

        {/* Progress Card */}
        <div className="flex items-center space-x-3 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Closing Progress</span>
            <span className="font-display text-base font-bold text-emerald-400">{progressPercent}% Ready</span>
          </div>
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/20">
            {completedCount}/{milestones.length}
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('milestones')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'milestones'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          Checklist Milestones ({milestones.length})
        </button>
        <button
          onClick={() => setActiveTab('secrets')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'secrets'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          Encrypted Handover Vault ({secrets.length})
        </button>
        <button
          onClick={() => setActiveTab('escrow')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'escrow'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          Escrow & Wire Status
        </button>
      </div>

      {/* Escrow Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Escrow API Sandbox Mode</span>
              <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-mono text-amber-400 border border-amber-500/20">Test Environment</span>
            </div>
            <h3 className="font-display text-base font-bold text-white mt-0.5">
              $52,000.00 USD Secured in Neutral Escrow Account
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Funds will disburse automatically to seller upon mutual verification of DNS, Git repository transfer, and 72-hour inspection window.
            </p>
          </div>
        </div>
      </div>

      {/* View 1: Milestones */}
      {activeTab === 'milestones' && (
        <div className="space-y-3">
          {milestones.map((milestone, idx) => {
            const isDone = milestone.status === 'COMPLETED';
            return (
              <div
                key={milestone.id}
                id={`milestone-item-${milestone.id}`}
                className={`rounded-2xl p-5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isDone
                    ? 'bg-emerald-950/10 border-emerald-500/30'
                    : 'bg-slate-900/90 border-slate-800'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <button
                    onClick={() => handleToggle(milestone.id, isDone)}
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all mt-0.5 ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                        : 'bg-slate-950 border-slate-700 text-slate-500 hover:border-slate-500'
                    }`}
                  >
                    {isDone ? '✓' : idx + 1}
                  </button>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className={`font-display text-sm font-bold ${isDone ? 'text-emerald-300' : 'text-white'}`}>
                        {milestone.title}
                      </h4>
                      <span className="rounded bg-slate-800 px-2 py-0.2 text-[9px] font-mono text-cyan-400 border border-slate-700">
                        {milestone.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Assigned: <strong className="text-slate-300">{milestone.assignedTo}</strong> • Verification by <span className="text-indigo-300">{milestone.verifiedBy}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                    isDone ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {milestone.status}
                  </span>

                  <button
                    id={`toggle-milestone-${milestone.id}-btn`}
                    onClick={() => handleToggle(milestone.id, isDone)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isDone 
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20'
                    }`}
                  >
                    {isDone ? 'Reopen Step' : 'Mark Completed'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 2: Secrets Vault */}
      {activeTab === 'secrets' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 flex items-start space-x-3 text-amber-300 text-xs">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <span className="font-bold block">Zero-Trust Credential Security Policy:</span>
              Secrets are encrypted with ephemeral tokens. Revealing or copying credentials generates an immutable tamper-evident entry in the platform audit log with IP and timestamp telemetry.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {secrets.map((secret) => (
              <div
                key={secret.id}
                id={`secret-card-${secret.id}`}
                className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="h-8 w-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                      <Key className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-white">{secret.title}</h4>
                      <span className="text-[10px] text-cyan-400 font-mono">{secret.category}</span>
                    </div>
                  </div>

                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                    secret.verifiedByBuyer ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {secret.verifiedByBuyer ? 'Buyer Verified' : 'Pending Verification'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{secret.description}</p>

                {/* Secret Value Box */}
                <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 flex items-center justify-between font-mono text-xs">
                  <span className={secret.isRevealed ? 'text-emerald-400 select-all break-all' : 'text-slate-500'}>
                    {secret.isRevealed && secret.secretValue ? secret.secretValue : secret.maskedValue}
                  </span>

                  <div className="flex items-center space-x-2 ml-2 shrink-0">
                    {!secret.isRevealed ? (
                      <button
                        onClick={() => handleRevealSecret(secret.id)}
                        disabled={revealingId === secret.id}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-sans font-semibold flex items-center space-x-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Reveal</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCopySecret(secret.id, secret.secretValue || '')}
                        className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-sans font-semibold flex items-center space-x-1"
                      >
                        {copiedId === secret.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedId === secret.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Action footer */}
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-slate-800/80">
                  <span>Access count: {secret.accessCount || 0} times</span>
                  {!secret.verifiedByBuyer && (
                    <button
                      onClick={() => handleVerifySecret(secret.id)}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold text-[10px]"
                    >
                      Mark Buyer Verified
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 3: Escrow & Wire */}
      {activeTab === 'escrow' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <h4 className="font-display text-base font-bold text-white">Escrow.com API Transaction Summary</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Agreed Purchase Price</span>
                <span className="font-display text-lg font-bold text-white mt-1 block">$52,000.00 USD</span>
                <span className="text-[10px] text-emerald-400">100% Cash at Closing</span>
              </div>
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Escrow Fee Split</span>
                <span className="font-display text-lg font-bold text-white mt-1 block">50% Buyer / 50% Seller</span>
                <span className="text-[10px] text-slate-400">$640.00 USD standard fee</span>
              </div>
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Inspection Period</span>
                <span className="font-display text-lg font-bold text-cyan-400 mt-1 block">3 Calendar Days</span>
                <span className="text-[10px] text-slate-400">Standard for software assets</span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800/80 text-xs text-slate-400 space-y-2">
              <div className="font-bold text-slate-300">Transaction Milestones:</div>
              <div className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>1. Buyer deposited $52,000 via Fedwire to Escrow.com Trust Account (Verified).</span>
              </div>
              <div className="flex items-center space-x-2 text-amber-400">
                <Clock className="h-4 w-4 shrink-0" />
                <span>2. Seller transfers domain DNS and Git organization credentials (In Progress).</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-500">
                <Clock className="h-4 w-4 shrink-0" />
                <span>3. Buyer confirms technical receipt & starts 72-hour inspection window.</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-500">
                <Clock className="h-4 w-4 shrink-0" />
                <span>4. Escrow.com releases funds to Seller bank account via direct ACH/Wire.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
