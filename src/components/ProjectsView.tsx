import React, { useMemo, useState } from 'react';
import {
  Plus,
  Search,
  ChevronRight,
  ShieldCheck,
  CircleAlert,
  ExternalLink,
} from 'lucide-react';
import { Project } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenAddProject: () => void;
  onRunAiAnalysis: (project: Project) => void;
  onRunValuation: (project: Project) => void;
}

const categories = ['ALL', 'SaaS', 'AI Platform', 'API / Developer Tool', 'Marketplace', 'Mobile App'];

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onSelectProject,
  onOpenAddProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredProjects = useMemo(() => projects.filter((project) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || [
      project.name,
      project.description,
      ...(project.technologies || []),
    ].some(value => String(value || '').toLowerCase().includes(query));

    const matchesCategory = selectedCategory === 'ALL' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }), [projects, searchQuery, selectedCategory]);

  return (
    <div id="projects-view" className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            Digital Assets Under Representation
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Only seller-submitted assets appear here. Financial and ownership claims remain explicitly unverified until evidence is confirmed.
          </p>
        </div>

        <button
          id="add-new-project-btn"
          onClick={onOpenAddProject}
          className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Digital Asset</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((category) => (
            <button
              key={category}
              id={`filter-cat-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            id="projects-search-input"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by name, technology, or description..."
            className="w-full rounded-xl bg-slate-900 pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 border border-slate-800 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800">
            <Plus className="h-5 w-5 text-slate-400" />
          </div>
          <h3 className="mt-4 text-sm font-bold text-white">
            {projects.length === 0 ? 'No digital assets submitted yet' : 'No assets match your filters'}
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-slate-400">
            {projects.length === 0
              ? 'This workspace is intentionally empty. Add a real website, application, SaaS, API, or other digital asset to begin verification and M&A readiness analysis.'
              : 'Change the search term or category filter. No synthetic project is inserted to fill this view.'}
          </p>
          {projects.length === 0 && (
            <button
              onClick={onOpenAddProject}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500"
            >
              <Plus className="h-4 w-4" />
              Add your first asset
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const financials = project.financials || ({} as NonNullable<Project['financials']>);
            const score = project.scores?.overallScore;
            const verifiedClaims = project.claims?.filter((claim: any) => claim.status === 'VERIFIED').length || 0;
            const claimCount = project.claims?.length || 0;
            const hasEvidence = verifiedClaims > 0;

            return (
              <div
                key={project.id}
                id={`project-card-${project.id}`}
                className="flex flex-col justify-between rounded-2xl bg-slate-900/90 p-5 border border-slate-800 hover:border-indigo-500/50 transition-all shadow-sm group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
                      {project.category}
                    </span>
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold capitalize bg-slate-800 text-slate-400 border border-slate-700">
                      {project.status || 'draft'}
                    </span>
                  </div>

                  <div className="mt-3">
                    <h3 className="font-display text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {project.tagline || project.description || 'Seller-submitted digital asset'}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-950/70 p-3 border border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">MRR / ARR</span>
                      <span className="text-xs font-bold text-slate-200">
                        ${Number(financials.mrr || 0).toLocaleString()} / ${Number(financials.arr || 0).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">YoY Growth</span>
                      <span className="text-xs font-bold text-slate-200">
                        {financials.growthRateYoY == null ? 'Not provided' : `${Number(financials.growthRateYoY)}%`}
                      </span>
                    </div>
                    <div className="pt-1.5 border-t border-slate-800/60">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Asking Price</span>
                      <span className="text-xs font-bold text-indigo-400">
                        {project.askingPrice ? `$${Number(project.askingPrice).toLocaleString()}` : 'Not set'}
                      </span>
                    </div>
                    <div className="pt-1.5 border-t border-slate-800/60">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Minimum Price</span>
                      <span className="text-xs font-bold text-slate-400">
                        {project.minimumPrice ? `$${Number(project.minimumPrice).toLocaleString()}` : 'Not set'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {hasEvidence ? <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> : <CircleAlert className="h-3.5 w-3.5 text-amber-400" />}
                      <span className="text-[10px] text-slate-400">
                        {claimCount ? `${verifiedClaims}/${claimCount} claims verified` : 'Evidence not verified'}
                      </span>
                    </div>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-indigo-300"
                      >
                        Domain <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] text-slate-400">M&A Score:</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-300">
                      {score == null ? 'Pending' : `${score}/100`}
                    </span>
                  </div>

                  <button
                    id={`inspect-project-${project.id}-btn`}
                    onClick={() => onSelectProject(project)}
                    className="flex items-center space-x-1 rounded-lg bg-indigo-600/10 px-2.5 py-1.5 text-xs font-semibold text-indigo-300 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    <span>Open Asset</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
