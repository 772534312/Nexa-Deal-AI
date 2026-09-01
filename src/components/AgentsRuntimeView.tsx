import React, { useState } from 'react';
import { 
  Bot, 
  Cpu, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Play, 
  Pause, 
  Terminal, 
  Wrench,
  Activity,
  Zap
} from 'lucide-react';
import { Agent, Mission } from '../types';

interface AgentsRuntimeViewProps {
  agents: Agent[];
  missions: Mission[];
  onOpenMissionPrompt: () => void;
}

export const AgentsRuntimeView: React.FC<AgentsRuntimeViewProps> = ({
  agents,
  missions,
  onOpenMissionPrompt,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0] || null);

  return (
    <div id="agents-runtime-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            Multi-Agent System & Mission DAG Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time orchestration of 15 specialized M&A agents with tool isolation, structured memory, and self-healing DAG execution.
          </p>
        </div>

        <button
          onClick={onOpenMissionPrompt}
          className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all self-start sm:self-auto"
        >
          <Sparkles className="h-4 w-4" />
          <span>Launch Autonomous Mission</span>
        </button>
      </div>

      {/* Agents Grid (15 Autonomous Agents) */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Registered Autonomous M&A Agents ({agents.length})
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => {
            const isSelected = selectedAgent?.id === agent.id;
            return (
              <div
                key={agent.id}
                id={`agent-card-${agent.id}`}
                onClick={() => setSelectedAgent(agent)}
                className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                  isSelected 
                    ? 'bg-slate-900 border-indigo-500 shadow-md shadow-indigo-500/10' 
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-display text-xs font-bold text-white">{agent.name}</h4>
                      <span className="text-[10px] text-slate-400 block font-mono">v{agent.version} • {agent.role}</span>
                    </div>
                  </div>

                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                </div>

                <p className="text-[11px] text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                  {agent.systemPrompt.slice(0, 100)}...
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap gap-1">
                  {agent.tools.map((tool, tidx) => (
                    <span key={tidx} className="rounded bg-slate-950 px-1.5 py-0.2 text-[9px] font-mono text-cyan-400 border border-slate-800">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Missions DAG Monitor */}
      <div className="rounded-2xl bg-slate-900/90 p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
              Live Mission Execution DAGs ({missions.length})
            </h3>
          </div>
        </div>

        <div className="space-y-4">
          {missions.map((mission) => (
            <div key={mission.id} className="rounded-xl bg-slate-950/70 p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display text-sm font-bold text-white">{mission.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{mission.prompt}</p>
                </div>
                <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
                  {mission.status}
                </span>
              </div>

              {/* DAG Tasks */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                {mission.tasks.map((task, tidx) => (
                  <div key={task.id} className="rounded-lg bg-slate-900 p-3 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                        {tidx + 1}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-white">{task.title}</span>
                          <span className="text-[10px] font-mono text-cyan-400">[{task.toolName}]</span>
                        </div>
                        <span className="text-[11px] text-slate-400 block">{task.description}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold uppercase ${
                      task.status === 'COMPLETED' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
