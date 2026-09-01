import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ExternalLink, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Bot, 
  Layers, 
  ShieldCheck, 
  ChevronRight, 
  ArrowUpRight,
  BarChart,
  Tag
} from 'lucide-react';
import { Project, ProjectCategory } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenAddProject: () => void;
  onRunAiAnalysis: (project: Project) => void;
  onRunValuation: (project: Project) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onSelectProject,
  onOpenAddProject,
  onRunAiAnalysis,
  onRunValuation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'SaaS', 'AI Platform', 'API / Developer Tool', 'Marketplace', 'Mobile App'];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div id="projects-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            Digital Assets Under Representation
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your digital businesses, applications, and codebases with automated valuation, intelligence scoring, and buyer matching.
          </p>
        </div>

        <button
          id="add-new-project-btn"
          onClick={onOpenAddProject}
          className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>+ Add New Digital Asset</span>
        </button>
      </div>

      {/* Search & Category Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            id="projects-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, technology, or tag..."
            className="w-full rounded-xl bg-slate-900 pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 border border-slate-800 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            id={`project-card-${project.id}`}
            className="flex flex-col justify-between rounded-2xl bg-slate-900/90 p-5 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all shadow-sm group"
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
                  {project.category}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                  project.status === 'negotiating'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : project.status === 'active'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {project.status}
                </span>
              </div>

              {/* Title & Tagline */}
              <div className="mt-3">
                <h3 className="font-display text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {project.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {project.tagline}
                </p>
              </div>

              {/* Financials Metric Bento */}
              <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-950/70 p-3 border border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">MRR / ARR</span>
                  <span className="text-xs font-bold text-slate-200">
                    ${project.financials.mrr.toLocaleString()} / ${project.financials.arr.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">YoY Growth</span>
                  <span className="text-xs font-bold text-emerald-400">
                    +{project.financials.growthRateYoY}%
                  </span>
                </div>
                <div className="pt-1.5 border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Asking Price</span>
                  <span className="text-xs font-bold text-indigo-400">
                    ${project.askingPrice.toLocaleString()}
                  </span>
                </div>
                <div className="pt-1.5 border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Floor / Target</span>
                  <span className="text-xs font-bold text-slate-400">
                    ${project.minimumPrice.toLocaleString()} / ${project.targetPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mt-3 flex flex-wrap gap-1">
                {project.technologies.slice(0, 4).map((tech, idx) => (
                  <span key={idx} className="rounded bg-slate-950 px-2 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-800">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] text-slate-400">Score:</span>
                <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-xs font-bold text-indigo-300">
                  {project.scores.overallScore}/100
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  id={`inspect-project-${project.id}-btn`}
                  onClick={() => onSelectProject(project)}
                  className="flex items-center space-x-1 rounded-lg bg-indigo-600/10 px-2.5 py-1.5 text-xs font-semibold text-indigo-300 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  <span>M&A Intelligence</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
