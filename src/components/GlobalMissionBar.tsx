import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Play, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  Bot, 
  Layers, 
  Cpu, 
  Target, 
  Mail, 
  TrendingUp, 
  DollarSign 
} from 'lucide-react';
import { Mission, Project } from '../types';

interface GlobalMissionBarProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onMissionCreated: (mission: Mission) => void;
}

export const GlobalMissionBar: React.FC<GlobalMissionBarProps> = ({
  isOpen,
  onClose,
  projects,
  onMissionCreated,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isPlanning, setIsPlanning] = useState(false);
  const [plannedMission, setPlannedMission] = useState<Mission | null>(null);

  const presetMissions = [
    {
      title: 'Strategic Buyer Discovery & Multiples Analysis',
      prompt: `Discover top 5 strategic technology companies and PE funds for ${projects[0]?.name || 'DevPulse AI'} with budget >$50k and calculate synergy match scores.`,
      icon: Target,
      tag: 'Discovery',
    },
    {
      title: 'Analyze Inbound Offers & Counter-Negotiation Strategy',
      prompt: `Analyze the latest acquisition proposals for ${projects[0]?.name || 'DevPulse AI'}, compare deal terms, and formulate counter-offers without violating our $${projects[0]?.minimumPrice?.toLocaleString() || '48,000'} floor.`,
      icon: DollarSign,
      tag: 'Negotiation',
    },
    {
      title: 'Execute Automated Outbound M&A Campaign',
      prompt: `Draft personalized bespoke outreach pitches for all corporate development decision makers in the DevOps sector and queue for human approval.`,
      icon: Mail,
      tag: 'Outreach',
    },
    {
      title: 'Comprehensive 10-Pillar Pre-Sale Due Diligence Audit',
      prompt: `Run full technical, financial, and legal due diligence scan on ${projects[0]?.name || 'DevPulse AI'} and prepare Virtual Data Room readiness report.`,
      icon: TrendingUp,
      tag: 'Due Diligence',
    },
  ];

  const handleExecuteMission = async (customPrompt?: string) => {
    const textToRun = customPrompt || prompt;
    if (!textToRun.trim()) return;

    setIsPlanning(true);
    setPlannedMission(null);

    try {
      const res = await fetch('/api/missions/create-and-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToRun }),
      });
      const data = await res.json();
      if (data.mission) {
        setPlannedMission(data.mission);
        onMissionCreated(data.mission);
      }
    } catch (err) {
      console.error('Mission planning error:', err);
    } finally {
      setIsPlanning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div id="mission-planner-modal" className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/50">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-white tracking-wide">AUTONOMOUS MISSION ARCHITECT</h3>
              <p className="text-xs text-slate-400">Command 15 specialized M&A agents with natural language</p>
            </div>
          </div>
          <button 
            id="close-mission-modal-btn"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Input Area */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/40">
          <div className="relative">
            <textarea
              id="mission-prompt-input"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your M&A goal (e.g. 'Search for high-budget PE buyers for FinMatrix API, verify synergy scores, and draft bespoke emails')..."
              className="w-full rounded-xl bg-slate-950 p-4 text-sm text-slate-100 placeholder-slate-500 border border-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none font-sans"
            />
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              <button
                id="run-custom-mission-btn"
                disabled={isPlanning || !prompt.trim()}
                onClick={() => handleExecuteMission()}
                className="flex items-center space-x-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isPlanning ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Planning DAG...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Execute Mission</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Preset Missions */}
          <div className="mt-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              One-Click Autonomous Missions
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presetMissions.map((pm, idx) => {
                const IconComponent = pm.icon;
                return (
                  <button
                    key={idx}
                    id={`preset-mission-${idx}-btn`}
                    onClick={() => {
                      setPrompt(pm.prompt);
                      handleExecuteMission(pm.prompt);
                    }}
                    className="flex items-start space-x-2.5 rounded-xl bg-slate-950/60 p-3 text-left border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-950 transition-all group"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-indigo-400 group-hover:text-cyan-400 group-hover:border-indigo-500/30">
                      <IconComponent className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-white">{pm.title}</span>
                        <span className="rounded bg-slate-800 px-1 py-0.2 text-[9px] text-slate-400 font-medium">{pm.tag}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{pm.prompt}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Mission Plan / Execution Viewer */}
        {plannedMission && (
          <div className="p-6 overflow-y-auto max-h-80 bg-slate-950/70">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Mission DAG Generated & Running</span>
              </div>
              <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                {plannedMission.tasks.length} Agent Tasks
              </span>
            </div>

            <div className="space-y-2.5">
              {plannedMission.tasks.map((task, tidx) => (
                <div 
                  key={task.id} 
                  id={`mission-task-${tidx}`}
                  className="flex items-center justify-between rounded-xl bg-slate-900/90 p-3 border border-slate-800"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                      task.status === 'COMPLETED' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : task.status === 'RUNNING'
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 animate-spin'
                        : 'bg-slate-800 text-slate-500'
                    }`}>
                      {task.status === 'COMPLETED' ? '✓' : tidx + 1}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-slate-200">{task.title}</span>
                        <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[9px] font-mono text-cyan-400 border border-slate-700">
                          {task.toolName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{task.description}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                    task.status === 'COMPLETED'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : task.status === 'RUNNING'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                id="view-in-runtime-btn"
                onClick={onClose}
                className="flex items-center space-x-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                <span>Monitor in Autonomous Agent Runtime</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
