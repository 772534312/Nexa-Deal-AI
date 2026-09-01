import React from 'react';
import {
  Bot,
  Building2,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  Globe,
  Layers,
  LayoutDashboard,
  Lock,
  Mail,
  Menu,
  Network,
  Settings2,
  ShieldAlert,
  Sliders,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  X,
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

type NavItem = { id: string; label: string; icon: React.ElementType; badge?: boolean };

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
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [roleOpen, setRoleOpen] = React.useState(false);
  const roles: UserRole[] = ['Owner', 'Admin', 'Manager', 'Member', 'Viewer'];

  const primary: NavItem[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'My Assets', icon: Layers },
    { id: 'marketplace', label: 'Marketplace', icon: Globe },
    { id: 'buyers', label: 'Buyers', icon: Users },
    { id: 'deals', label: 'Deals', icon: TrendingUp },
    { id: 'dealroom', label: 'Deal Room', icon: Building2 },
  ];

  const workflow: NavItem[] = [
    { id: 'diligence', label: 'Verification', icon: CheckCircle2 },
    { id: 'dataroom', label: 'VDR & NDA', icon: Lock },
    { id: 'approvals', label: 'Approvals', icon: ShieldAlert, badge: true },
    { id: 'closing', label: 'Closing & Handover', icon: FileCheck2 },
  ];

  const operations: NavItem[] = [
    { id: 'campaigns', label: 'Outreach', icon: Mail },
    { id: 'inbox', label: 'Messages', icon: Bot },
    { id: 'analytics', label: 'Analytics & Risk', icon: TrendingUp },
    { id: 'agents', label: 'AI Agents', icon: Network },
    { id: 'commandcenter', label: 'Admin', icon: Sliders },
  ];

  const go = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  const renderItem = (item: NavItem) => {
    const Icon = item.icon;
    const active = activeTab === item.id;
    return (
      <button
        key={item.id}
        id={`workflow-nav-${item.id}`}
        onClick={() => go(item.id)}
        className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
          active
            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
        }`}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span>{item.label}</span>
        {item.badge && pendingApprovalsCount > 0 && (
          <span className="ml-0.5 rounded-full bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-slate-950">
            {pendingApprovalsCount}
          </span>
        )}
      </button>
    );
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <button
          id="brand-logo-btn"
          onClick={() => go('dashboard')}
          className="flex min-w-0 items-center gap-2.5 text-left"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Bot className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-base font-bold tracking-tight text-white">NEXA DEAL</span>
              <span className="rounded border border-indigo-500/20 bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400">AI</span>
            </div>
            <span className="block text-[10px] font-medium tracking-wide text-slate-500">M&A TRANSACTION PLATFORM</span>
          </div>
        </button>

        <div className="hidden xl:flex min-w-0 flex-1 max-w-sm mx-6">
          <button
            id="global-mission-launcher-btn"
            onClick={onOpenMissionPrompt}
            className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs text-slate-400 transition hover:border-indigo-500/40 hover:text-slate-200"
          >
            <span className="flex items-center gap-2"><Sparkles className="h-3.5 w-3.5 text-indigo-400" />Ask NEXA to act on a deal...</span>
            <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">⌘K</kbd>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="open-public-portal-btn"
            onClick={() => go(activeTab === 'landing' ? 'dashboard' : 'landing')}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white"
          >
            <Globe className="h-3.5 w-3.5 text-cyan-400" />
            {activeTab === 'landing' ? 'Console' : 'Public Site'}
          </button>
          {onOpenGovernance && (
            <button id="open-governance-btn" onClick={onOpenGovernance} className="hidden lg:flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white">
              <Settings2 className="h-3.5 w-3.5" /> Settings
            </button>
          )}
          <button id="open-deal-coach-btn" onClick={onOpenDealCoach} className="hidden md:flex items-center gap-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20">
            <Bot className="h-3.5 w-3.5" /> Deal Coach
          </button>
          <button id="nav-approvals-btn" onClick={() => go('approvals')} className={`hidden sm:flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium ${pendingApprovalsCount > 0 ? 'border-amber-500/30 bg-amber-500/10 text-amber-300' : 'border-slate-800 bg-slate-900 text-slate-400'}`}>
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
            Approvals{pendingApprovalsCount > 0 && <span className="rounded-full bg-amber-500 px-1.5 text-[9px] font-bold text-slate-950">{pendingApprovalsCount}</span>}
          </button>
          <div className="relative hidden sm:block">
            <button id="role-switcher-btn" onClick={() => setRoleOpen(v => !v)} className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-300">
              <UserCheck className="h-3.5 w-3.5 text-cyan-400" /> {currentUser?.role || 'Owner'} <ChevronDown className="h-3 w-3" />
            </button>
            {roleOpen && (
              <div id="role-dropdown-menu" className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-xl">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Role</div>
                {roles.map(role => (
                  <button key={role} id={`switch-role-${role.toLowerCase()}-btn`} onClick={() => { onSwitchRole(role); setRoleOpen(false); }} className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs ${currentUser?.role === role ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-300 hover:bg-slate-800'}`}>
                    {role}{currentUser?.role === role && <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setMobileOpen(v => !v)} className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-300 lg:hidden" aria-label="Open navigation">
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <nav id="workflow-navigation" className="hidden lg:block border-t border-slate-900">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 sm:px-6">
          {primary.map(renderItem)}
          <div className="mx-2 h-6 w-px shrink-0 bg-slate-800" />
          {workflow.map(renderItem)}
          <div className="mx-2 h-6 w-px shrink-0 bg-slate-800" />
          <details className="group relative shrink-0">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-800 hover:text-slate-200">
              <Settings2 className="h-4 w-4" /> More
            </summary>
            <div className="absolute right-0 top-full mt-1 min-w-48 rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl">
              {operations.map(item => <div key={item.id}>{renderItem(item)}</div>)}
            </div>
          </details>
        </div>
      </nav>

      {mobileOpen && (
        <nav className="border-t border-slate-800 bg-slate-950 px-4 py-3 lg:hidden">
          <div className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Workspace</div>
          <div className="grid grid-cols-2 gap-1">{primary.map(renderItem)}</div>
          <div className="my-3 h-px bg-slate-800" />
          <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Transaction Workflow</div>
          <div className="grid grid-cols-2 gap-1">{workflow.map(renderItem)}</div>
          <div className="my-3 h-px bg-slate-800" />
          <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Operations</div>
          <div className="grid grid-cols-2 gap-1">{operations.map(renderItem)}</div>
          <div className="mt-3 flex gap-2">
            <button onClick={onOpenDealCoach} className="flex-1 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 text-xs text-indigo-300">Deal Coach</button>
            {onOpenGovernance && <button onClick={onOpenGovernance} className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-300">Settings</button>}
          </div>
        </nav>
      )}
    </header>
  );
};
