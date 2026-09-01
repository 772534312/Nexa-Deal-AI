import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Printer, 
  Building2, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Lock, 
  Layers, 
  Activity,
  DollarSign
} from 'lucide-react';
import { Project } from '../types';

interface ExecutiveReportModalProps {
  projectId: string;
  onClose: () => void;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  projectId,
  onClose
}) => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/executive-report`);
        const data = await res.json();
        setReport(data.report);
      } catch (err) {
        console.error('Failed to load executive report', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [projectId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="executive-report-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Institutional M&A Executive Report</h2>
              <p className="text-xs text-slate-400">17-Section Comprehensive Seller Briefing Document</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-300 print:p-0 print:text-black">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-400">Generating report sections...</div>
          ) : report ? (
            <div className="space-y-6 text-xs">
              {/* Top Meta */}
              <div className="rounded-2xl bg-slate-950 p-5 border border-slate-800/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Confidential M&A Profile</span>
                  <h1 className="text-xl font-bold text-white mt-0.5">{report.projectName}</h1>
                  <p className="text-xs text-slate-400 mt-1">Generated {new Date(report.generatedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Recommended Asking</span>
                    <p className="text-lg font-bold text-emerald-400 font-mono">${(report.valuation?.recommended || 65000).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* 1. Executive Summary */}
              <div className="rounded-2xl bg-slate-950/60 p-5 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <span className="text-indigo-400 font-mono">01.</span>
                  <span>Executive Summary</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">{report.executiveSummary}</p>
              </div>

              {/* 2. Financial Profile */}
              <div className="rounded-2xl bg-slate-950/60 p-5 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <span className="text-indigo-400 font-mono">02.</span>
                  <span>Financial Profile & Unit Economics</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">MRR</span>
                    <p className="text-sm font-bold text-white font-mono mt-0.5">${(report.financialProfile?.monthlyRevenue || 0).toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">ARR</span>
                    <p className="text-sm font-bold text-white font-mono mt-0.5">${(report.financialProfile?.annualRevenue || 0).toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Monthly Profit</span>
                    <p className="text-sm font-bold text-white font-mono mt-0.5">${(report.financialProfile?.profit || 0).toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">YoY Growth</span>
                    <p className="text-sm font-bold text-emerald-400 font-mono mt-0.5">+{report.financialProfile?.growth || 0}%</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Paying Customers</span>
                    <p className="text-sm font-bold text-white font-mono mt-0.5">{(report.financialProfile?.payingCustomers || 0).toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Monthly Traffic</span>
                    <p className="text-sm font-bold text-white font-mono mt-0.5">{(report.financialProfile?.traffic || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* 3. Tech Stack & Competitive Edge */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-950/60 p-5 border border-slate-800 space-y-2">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span className="text-indigo-400 font-mono">03.</span>
                    <span>Technology Stack</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(report.technology || []).map((t: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 font-medium text-xs border border-slate-800">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-950/60 p-5 border border-slate-800 space-y-2">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span className="text-indigo-400 font-mono">04.</span>
                    <span>Competitive Advantages</span>
                  </h3>
                  <div className="space-y-1.5 pt-1">
                    {(report.competitiveAdvantages || []).map((adv: string, i: number) => (
                      <div key={i} className="flex items-center space-x-2 text-slate-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>{adv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Valuation & Target Acquirers */}
              <div className="rounded-2xl bg-slate-950/60 p-5 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <span className="text-indigo-400 font-mono">05.</span>
                  <span>Valuation Range & Target Acquirers</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Floor Valuation</span>
                    <p className="text-sm font-bold text-white font-mono mt-0.5">${(report.valuation?.rangeLow || 48000).toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Target Asking</span>
                    <p className="text-sm font-bold text-emerald-400 font-mono mt-0.5">${(report.valuation?.recommended || 65000).toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">High Valuation</span>
                    <p className="text-sm font-bold text-white font-mono mt-0.5">${(report.valuation?.rangeHigh || 75000).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* 5. Recommended Action */}
              <div className="rounded-2xl bg-indigo-950/40 p-5 border border-indigo-500/30 space-y-2">
                <h3 className="text-sm font-bold text-indigo-200">Recommended Executive M&A Action</h3>
                <p className="text-xs text-indigo-300 leading-relaxed">{report.recommendedAction}</p>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-xs text-slate-400">Failed to load report.</div>
          )}
        </div>
      </div>
    </div>
  );
};
