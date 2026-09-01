import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  Sparkles, 
  Send, 
  Loader2, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { Project } from '../types';

interface DealCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
}

export const DealCoachModal: React.FC<DealCoachModalProps> = ({
  isOpen,
  onClose,
  projects,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<any | null>(null);

  const sampleQuestions = [
    'Datadog offered $52,000 all-cash vs our $65k asking. Should we counter at $58k or hold firm?',
    'How should we structure a 90-day post-acquisition transition earnout without taking on customer churn risk?',
    'What leverage points do we have regarding our low 2.8% churn and proprietary AST parser IP?',
    'How do we handle buyer requests for customer PII disclosure before closing escrow?',
  ];

  if (!isOpen) return null;

  const handleAsk = async (customQ?: string) => {
    const qToRun = customQ || question;
    if (!qToRun.trim()) return;

    setIsLoading(true);
    setAdvice(null);

    try {
      const res = await fetch('/api/deal-coach/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: qToRun, projectId: selectedProjectId }),
      });
      const data = await res.json();
      if (data.advice) {
        setAdvice(data.advice);
      }
    } catch (err) {
      console.error('Deal coach error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="deal-coach-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-sm sm:text-base font-bold text-white tracking-tight">
                Senior M&A Deal Coach & Strategic Advisor
              </h3>
              <p className="text-xs text-slate-400">Trained on $500M+ in tech acquisitions, LOI tactics, and closing psychology</p>
            </div>
          </div>

          <button
            id="close-coach-modal-btn"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-slate-900/40">
          {/* Target Asset Selector */}
          <div>
            <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Deal Context Asset:</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full rounded-xl bg-slate-950 p-2 text-xs text-slate-100 border border-slate-800 focus:outline-none"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name} (Asking: ${p.askingPrice.toLocaleString()})</option>
              ))}
            </select>
          </div>

          {/* Prompt Area */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Your Negotiation Question or Dilemma:</label>
            <div className="relative">
              <textarea
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Buyer wants a 6-month non-compete covering all software domains. Is this standard?"
                className="w-full rounded-xl bg-slate-950 p-3 text-xs text-slate-100 placeholder-slate-500 border border-slate-800 focus:border-indigo-500 focus:outline-none resize-none font-sans"
              />
              <button
                id="ask-coach-btn"
                disabled={isLoading || !question.trim()}
                onClick={() => handleAsk()}
                className="absolute bottom-3 right-3 flex items-center space-x-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-md shadow-indigo-600/20"
              >
                {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                <span>Consult Coach</span>
              </button>
            </div>
          </div>

          {/* Quick Prompts */}
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1.5">Common Strategic Queries:</span>
            <div className="space-y-1.5">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuestion(q);
                    handleAsk(q);
                  }}
                  className="w-full text-left p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 hover:text-white hover:border-indigo-500/40 transition-colors"
                >
                  💬 {q}
                </button>
              ))}
            </div>
          </div>

          {/* Coach Advice Response */}
          {advice && (
            <div className="rounded-xl bg-gradient-to-r from-slate-950 via-indigo-950/20 to-slate-950 p-5 border border-indigo-500/30 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-indigo-400">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">Deal Coach Strategic Assessment</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">Confidence: {advice.confidence}%</span>
              </div>

              <div className="text-xs text-slate-200 leading-relaxed bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 whitespace-pre-line font-sans">
                {advice.analysis}
              </div>

              {advice.recommendedActions && (
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">Prescribed Action Steps:</span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {advice.recommendedActions.map((act: string, aidx: number) => (
                      <li key={aidx} className="flex items-center space-x-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {advice.leverageSummary && (
                <div className="pt-2 border-t border-slate-800 text-[11px] text-indigo-300">
                  <strong>Seller Leverage Summary:</strong> {advice.leverageSummary}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
