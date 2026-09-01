import React from 'react';
import {
  Building2,
  Bot,
  ShieldAlert,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  UserCheck,
  Settings2,
  Globe,
  LayoutDashboard,
  Layers,
  Users,
  Mail,
  TrendingUp,
  Lock,
  FileCheck2,
  BarChart3,
  Sliders,
  Network,
} from 'lucide-react';
import { UserRole, Workspace, User } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  workspace: Workspace | null;
  currentUser: User | null;
  onSwitchRole: (role: UserRole) => void;
  pendingApprovalsCount: number;
  onOpenMissionPrompt: () => void;
  onOpenDealCoach: () => void;
  onOpenGovernance?: () => void;
}

type NavItem = { id: string; label: string; icon: React.ElementType };
type NavGroup = { label: string; items: NavItem[] };

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  workspace,
  currentUser,
  onSwitchRole,
  pendingApprovalsCount,
  onOpenMissionPrompt,
  onOpenDealCoach,
  onOpenGovernance,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);
  const roles: UserRole[] = ['Owner', 'Admin', 'Manager', 'Member', 'Viewer'];

  const navGroups: NavGroup[] = [
    {
      label: 'Workspace',
      items: [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'dealroom', label: 'Deal Room', icon: Building2 },
      ],
    },
    {
      label: 'Assets',
      items: [
        { id: 'projects', label: 'My Assets', icon: Layers },
        { id: 'marketplace', label: 'Marketplace', icon: Globe },
        { id: 'diligence', label: 'Verification', icon: CheckCircle2 },
      ],
    },
    {
      label: 'Buyers',
      items: [
        { id: 'buyers', label: 'Buyer CRM', icon: Users },
        { id: 'campaigns', label: 'Outreach', icon: Mail },
        { id: 'inbox', label: 'Messages', icon: Bot },
      ],
    },
    {
      label: 'Deals',
      items: [
        { id: 'deals', label: 'Offers & Negotiation', icon: TrendingUp },
        { id: 'approvals', label: 'Approvals', icon: ShieldAlert },
        { id: 'dataroom', label: 'VDR & NDA', icon: Lock },
      ],
    },
    {
      label: 'Closing',
      items: [
        { id: 'closing', label: 'Escrow & Handover', icon: FileCheck2 },
      ],
    },
    {
      label: 'Operations',
      items: [
        { id: 'analytics', label: 'Analytics & Risk', icon: BarChart3 },
        { id: 'commandcenter', label: 'Admin', icon: Sliders },
        { id: 'agents', label: 'AI Agents', icon: Network },
      ],
    },
  ];

  return (
    <header id="main-header" className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center space-x-4 min-w-0">
          <div
            id="brand-logo-btn"
            onClick={() => setActiveTab('dashboard')}
            className="flex cursor-pointer items-center space-x-2.5 group shrink-0"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <Bot className="h-5 w-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-bold tracking-tight text-white text-base">NEXA DEAL</span>
                <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">AI</span>
              </div>
              <span className="block text-[10px] text-slate-400 font-medium tracking-wide">AUTONOMOUS M&A BROKER</span>
            </div>
          </div>

          <div className="hidden xl:flex items-center pl-3 border-l border-slate-800 space-x-2 min-w-0">
            <div className="flex items-center space-x-1.5 rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-300 border border-slate-800 truncate">
              <Building2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">{workspace?.name || 'Workspace'}</span>
              <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[9px] text-slate-400 uppercase font-semibold">{workspace?.plan || 'Free'}</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 max-w-md mx-5">
          <button
            id="global-mission-launcher-btn"
            onClick={onOpenMissionPrompt}
            className="flex w-full items-center justify-between rounded-xl bg-slate-900/80 px-3.5 py-1.5 text-xs text-slate-400 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all group shadow-inner"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400 group-hover:text-cyan-400 transition-colors" />
              <span className="text-slate-300 font-normal">Command AI: find buyers, analyze, negotiate...</span>
            </div>
            <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-700">⌘K</kbd>
          </button>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            id="open-public-portal-btn"
            onClick={() => setActiveTab(activeTab === 'landing' ? 'dashboard' : 'landing')}
            className="flex items-center space-x-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium border bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white transition-colors"
            title="Toggle public site"
          >
            <Globe className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden md:inline">{activeTab === 'landing' ? 'Console' : 'Public Site'}</span>
          </button>

          {onOpenGovernance && (
            <button
              id="open-governance-btn"
              onClick={onOpenGovernance}
              className="hidden xl:flex items-center space-x-1.5 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition-colors"
            >
              <Settings2 className="h-3.5 w-3.5 text-slate-400" />
              <span>Settings</span>
            </button>
          )}

          <button
            id="open-deal-coach-btn"
            onClick={onOpenDealCoach}
            className="hidden sm:flex items-center space-x-1.5 rounded-lg bg-indigo-500/10 px-2.5 py-1.5 text-xs font-medium text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
          >
            <Bot className="h-3.5 w-3.5 text-indigo-400" />
            <span>Deal Coach</span>
          </button>

          <button
            id="nav-approvals-btn"
            onClick={() => setActiveTab('approvals')}
            className={`relative flex items-center space-x-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              pendingApprovalsCount > 0
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 animate-pulse'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden md:inline">Approvals</span>
            {pendingApprovalsCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              id="role-switcher-btn"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center space-x-1.5 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <UserCheck className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-slate-200">{currentUser?.role || 'Owner'}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div id="role-dropdown-menu" className="absolute right-0 mt-2 w-44 rounded-xl bg-slate-900 p-1.5 shadow-xl border border-slate-800 z-50">
                <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Switch RBAC Role</div>
                {roles.map((r) => (
                  <button
                    key={r}
                    id={`switch-role-${r.toLowerCase()}-btn`}
                    onClick={() => { onSwitchRole(r); setRoleDropdownOpen(false); }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition-colors ${
                      currentUser?.role === r ? 'bg-indigo-600/20 text-indigo-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{r}</span>
                    {currentUser?.role === r && <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <nav id="workflow-navigation" className="mx-auto max-w-7xl px-4 sm:px-6 pb-2 overflow-x-auto">
        <div className="flex min-w-max items-end gap-2">
          {navGroups.map((group) => (
            <div key={group.label} className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-1">
              <div className="px-2.5 pt-0.5 pb-1 text-[9px] font-bold uppercase tracking-wider text-slate-500">{group.label}</div>
              <div className="flex items-center gap-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`workflow-nav-${item.id}`}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all ${
                        active
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{item.label}</span>
                      {item.id === 'approvals' && pendingApprovalsCount > 0 && (
                        <span className="rounded-full bg-amber-500 px-1.5 text-[9px] font-bold text-slate-950">{pendingApprovalsCount}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
};
