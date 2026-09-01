import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  LayoutDashboard, 
  Layers, 
  Users, 
  Mail, 
  TrendingUp, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Building2, 
  Cpu, 
  FileCheck2, 
  BarChart3, 
  Sparkles,
  Menu,
  X,
  Plus
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { GlobalMissionBar } from './components/GlobalMissionBar';
import { DashboardView } from './components/DashboardView';
import { ProjectsView } from './components/ProjectsView';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { AddProjectModal } from './components/AddProjectModal';
import { BuyersCrmView } from './components/BuyersCrmView';
import { CampaignsView } from './components/CampaignsView';
import { EmailInboxView } from './components/EmailInboxView';
import { DealsNegotiationView } from './components/DealsNegotiationView';
import { ApprovalCenterView } from './components/ApprovalCenterView';
import { DataRoomView } from './components/DataRoomView';
import { DueDiligenceView } from './components/DueDiligenceView';
import { MarketplaceView } from './components/MarketplaceView';
import { AgentsRuntimeView } from './components/AgentsRuntimeView';
import { ClosingHandoverView } from './components/ClosingHandoverView';
import { AnalyticsRiskView } from './components/AnalyticsRiskView';
import { DealCoachModal } from './components/DealCoachModal';
import { IntegrationsGovernanceModal } from './components/IntegrationsGovernanceModal';
import { UnifiedDealRoomView } from './components/UnifiedDealRoomView';
import { AdminCommandCenterView } from './components/AdminCommandCenterView';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';
import { Sliders, Globe } from 'lucide-react';
import { PublicLandingPage } from './components/PublicLandingPage';
import { 
  Project, 
  Deal, 
  Buyer, 
  Campaign, 
  EmailMessage, 
  ApprovalItem, 
  VDRFolder, 
  VDRFile, 
  VDRAccessLog, 
  NDA, 
  DueDiligenceItem, 
  Agent, 
  Mission, 
  ClosingMilestone, 
  RiskEvent, 
  AuditLog,
  Workspace,
  User,
  UserRole
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core domain states
  const [projects, setProjects] = useState<Project[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [vdrFolders, setVdrFolders] = useState<VDRFolder[]>([]);
  const [vdrFiles, setVdrFiles] = useState<VDRFile[]>([]);
  const [vdrAccessLogs, setVdrAccessLogs] = useState<VDRAccessLog[]>([]);
  const [ndas, setNdas] = useState<NDA[]>([]);
  const [dueDiligence, setDueDiligence] = useState<DueDiligenceItem[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [closingMilestones, setClosingMilestones] = useState<ClosingMilestone[]>([]);
  const [riskEvents, setRiskEvents] = useState<RiskEvent[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Modals
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<Project | null>(null);
  const [isDealCoachOpen, setIsDealCoachOpen] = useState(false);
  const [isGovernanceModalOpen, setIsGovernanceModalOpen] = useState(false);
  const [executiveReportProjectId, setExecutiveReportProjectId] = useState<string | null>(null);

  // Initial Fetch
  const fetchAllData = async () => {
    try {
      const [
        userRes,
        projRes,
        dealRes,
        buyerRes,
        campRes,
        emailRes,
        apprRes,
        vdrRes,
        ndaRes,
        ddRes,
        agentRes,
        misRes,
        closeRes,
        riskRes,
        audRes,
        analyRes,
      ] = await Promise.all([
        fetch('/api/users/current').then(r => r.json()),
        fetch('/api/projects').then(r => r.json()),
        fetch('/api/deals').then(r => r.json()),
        fetch('/api/buyers').then(r => r.json()),
        fetch('/api/campaigns').then(r => r.json()),
        fetch('/api/emails').then(r => r.json()),
        fetch('/api/approvals').then(r => r.json()),
        fetch('/api/vdr/files').then(r => r.json()),
        fetch('/api/ndas').then(r => r.json()),
        fetch('/api/due-diligence').then(r => r.json()),
        fetch('/api/agents').then(r => r.json()),
        fetch('/api/missions').then(r => r.json()),
        fetch('/api/closing/milestones').then(r => r.json()),
        fetch('/api/risk-events').then(r => r.json()),
        fetch('/api/audit-logs').then(r => r.json()),
        fetch('/api/analytics').then(r => r.json()),
      ]);

      if (userRes.user) {
        setCurrentUser(userRes.user);
        setWorkspace(userRes.workspace);
      }
      if (projRes.projects) setProjects(projRes.projects);
      if (dealRes.deals) setDeals(dealRes.deals);
      if (buyerRes.buyers) setBuyers(buyerRes.buyers);
      if (campRes.campaigns) setCampaigns(campRes.campaigns);
      if (emailRes.emails) setEmails(emailRes.emails);
      if (apprRes.approvals) setApprovals(apprRes.approvals);
      if (vdrRes.files) {
        setVdrFolders(vdrRes.folders);
        setVdrFiles(vdrRes.files);
        setVdrAccessLogs(vdrRes.accessLogs);
      }
      if (ndaRes.ndas) setNdas(ndaRes.ndas);
      if (ddRes.dueDiligence) setDueDiligence(ddRes.dueDiligence);
      if (agentRes.agents) setAgents(agentRes.agents);
      if (misRes.missions) setMissions(misRes.missions);
      if (closeRes.milestones) setClosingMilestones(closeRes.milestones);
      if (riskRes.riskEvents) setRiskEvents(riskRes.riskEvents);
      if (audRes.auditLogs) setAuditLogs(audRes.auditLogs);
      if (analyRes) setAnalyticsData(analyRes);
    } catch (err) {
      console.error('Error loading platform state:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsMissionModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleSwitchRole = async (role: UserRole) => {
    try {
      const res = await fetch('/api/users/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (data.user) setCurrentUser(data.user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunAiAnalysis = async (project: Project) => {
    try {
      const res = await fetch(`/api/projects/${project.id}/analyze-ai`, { method: 'POST' });
      const data = await res.json();
      if (data.project) {
        setProjects(prev => prev.map(p => p.id === data.project.id ? data.project : p));
        if (selectedProjectForDetail?.id === data.project.id) {
          setSelectedProjectForDetail(data.project);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunValuation = async (project: Project) => {
    try {
      const res = await fetch(`/api/projects/${project.id}/valuation-ai`, { method: 'POST' });
      const data = await res.json();
      if (data.project) {
        setProjects(prev => prev.map(p => p.id === data.project.id ? data.project : p));
        if (selectedProjectForDetail?.id === data.project.id) {
          setSelectedProjectForDetail(data.project);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunMatch = async (project: Project, buyer: Buyer) => {
    try {
      const res = await fetch('/api/matches/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id, buyerId: buyer.id }),
      });
      const data = await res.json();
      return data.match || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleSendEmailReply = async (emailId: string, replyBody: string) => {
    try {
      await fetch(`/api/emails/${emailId}/send-reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyBody }),
      });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulateInboundEmail = async (emailData: any) => {
    try {
      await fetch('/api/emails/simulate-inbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveApproval = async (id: string, status: 'APPROVED' | 'REJECTED' | 'EDITED', notes?: string) => {
    try {
      await fetch(`/api/approvals/${id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTransitionDealStage = async (dealId: string, stage: string) => {
    try {
      await fetch(`/api/deals/${dealId}/stage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage }),
      });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunAiNegotiation = async (projectId: string, buyerId: string, offer: any) => {
    try {
      const res = await fetch('/api/negotiation/run-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, buyerId, offer }),
      });
      const data = await res.json();
      return data.negotiation || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleSignNda = async (ndaId: string) => {
    try {
      await fetch(`/api/ndas/${ndaId}/sign`, { method: 'POST' });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadVdrFile = async (fileData: Partial<VDRFile>) => {
    try {
      await fetch('/api/vdr/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fileData),
      });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateDdStatus = async (id: string, status: any) => {
    try {
      await fetch(`/api/due-diligence/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleClosingMilestone = async (id: string) => {
    try {
      await fetch(`/api/closing/milestones/${id}/toggle`, { method: 'POST' });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCampaign = async (campaignData: Partial<Campaign>) => {
    try {
      await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData),
      });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitMarketplaceBid = async (projectId: string, amount: number, buyerNameStr: string) => {
    try {
      await handleSimulateInboundEmail({
        buyerId: 'buyer-1',
        projectId,
        subject: `Letter of Intent (LOI) Offer from ${buyerNameStr}`,
        body: `Dear M&A Team, on behalf of ${buyerNameStr}, we submit our formal acquisition proposal of $${amount.toLocaleString()} all-cash for this asset. Please confirm VDR access.`,
        sender: 'corporate-dev@acquisitions.io',
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Navigation Items
  const navItems = [
    { id: 'landing', label: 'Public Portal', icon: Globe },
    { id: 'dashboard', label: 'Mission Control', icon: LayoutDashboard },
    { id: 'dealroom', label: '360° Deal Room', icon: Building2, badge: 'LIVE' },
    { id: 'projects', label: 'Digital Assets', icon: Layers, badge: projects.length },
    { id: 'buyers', label: 'Buyer CRM & Match', icon: Users },
    { id: 'campaigns', label: 'Outreach Campaigns', icon: Mail },
    { id: 'inbox', label: 'Email Agent', icon: Bot, badge: emails.filter(e => !e.isApproved).length || undefined },
    { id: 'deals', label: 'Deals & Negotiation', icon: TrendingUp, badge: deals.length },
    { id: 'approvals', label: 'Human Approvals', icon: ShieldCheck, badge: approvals.filter(a => a.status === 'PENDING').length || undefined, alert: approvals.some(a => a.status === 'PENDING') },
    { id: 'dataroom', label: 'VDR & NDAs', icon: Lock },
    { id: 'diligence', label: 'Due Diligence', icon: CheckCircle2 },
    { id: 'closing', label: 'Closing & Escrow', icon: FileCheck2 },
    { id: 'commandcenter', label: 'Admin Command', icon: Sliders },
    { id: 'analytics', label: 'Analytics & Token Cost', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans">
      {/* If activeTab is 'landing', render public marketing entry page */}
      {activeTab === 'landing' ? (
        <PublicLandingPage
          onStartSellerOnboarding={() => {
            setActiveTab('projects');
            setIsAddProjectOpen(true);
          }}
          onExploreAcquisitions={() => {
            setActiveTab('marketplace');
          }}
          onLaunchWorkspace={() => {
            setActiveTab('dashboard');
          }}
        />
      ) : (
        <>
          {/* Top Navbar */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            workspace={workspace}
            currentUser={currentUser}
            onSwitchRole={handleSwitchRole}
            pendingApprovalsCount={approvals.filter(a => a.status === 'PENDING').length}
            onOpenMissionPrompt={() => setIsMissionModalOpen(true)}
            onOpenDealCoach={() => setIsDealCoachOpen(true)}
            onOpenGovernance={() => setIsGovernanceModalOpen(true)}
          />

          {/* Main App Layout */}
          <div className="flex-1 flex mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 gap-6">
            {/* Left Side Navigation */}
            <aside className="hidden lg:block w-64 shrink-0 space-y-4">
              <div className="rounded-2xl bg-slate-900/80 p-3 border border-slate-800 shadow-sm space-y-1">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-link-${item.id}`}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <IconComponent className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge !== undefined && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                          isActive 
                            ? 'bg-white text-indigo-900' 
                            : item.alert 
                            ? 'bg-amber-500 text-slate-950 animate-pulse' 
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quick AI Kickoff Widget */}
              <div className="rounded-2xl bg-gradient-to-b from-indigo-950/40 to-slate-900 p-4 border border-indigo-500/20 text-center space-y-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mx-auto">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-display text-xs font-bold text-white">Need Deal Strategy?</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Consult with Senior M&A Partner</p>
                </div>
                <button
                  onClick={() => setIsDealCoachOpen(true)}
                  className="w-full rounded-xl bg-indigo-600/20 px-3 py-1.5 text-xs font-bold text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  Ask Deal Coach
                </button>
              </div>
            </aside>

            {/* Mobile Navigation Selector */}
            <div className="lg:hidden w-full mb-4">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full rounded-xl bg-slate-900 p-3 text-xs font-bold text-indigo-300 border border-slate-800"
              >
                {navItems.map(item => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
              {activeTab === 'dealroom' && (
                <UnifiedDealRoomView
                  deals={deals}
                  projects={projects}
                  buyers={buyers}
                  onOpenDealCoach={() => setIsDealCoachOpen(true)}
                  onOpenExecutiveReport={(pId) => setExecutiveReportProjectId(pId)}
                />
              )}

              {activeTab === 'commandcenter' && (
                <AdminCommandCenterView />
              )}

              {activeTab === 'dashboard' && (
                <DashboardView
                  projects={projects}
                  deals={deals}
                  buyers={buyers}
                  missions={missions}
                  approvals={approvals}
                  auditLogs={auditLogs}
                  onSelectProject={(p) => setSelectedProjectForDetail(p)}
                  onOpenAddProject={() => setIsAddProjectOpen(true)}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onOpenDealCoach={() => setIsDealCoachOpen(true)}
                />
              )}

              {activeTab === 'projects' && (
                <ProjectsView
                  projects={projects}
                  onSelectProject={(p) => setSelectedProjectForDetail(p)}
                  onOpenAddProject={() => setIsAddProjectOpen(true)}
                  onRunAiAnalysis={handleRunAiAnalysis}
                  onRunValuation={handleRunValuation}
                />
              )}

              {activeTab === 'buyers' && (
                <BuyersCrmView
                  buyers={buyers}
                  projects={projects}
                  onGenerateOutreach={() => setActiveTab('campaigns')}
                  onRunMatch={handleRunMatch}
                />
              )}

              {activeTab === 'campaigns' && (
                <CampaignsView
                  campaigns={campaigns}
                  projects={projects}
                  buyers={buyers}
                  onOpenPitchGenerator={() => setIsDealCoachOpen(true)}
                  onCreateCampaign={handleCreateCampaign}
                />
              )}

              {activeTab === 'inbox' && (
                <EmailInboxView
                  emails={emails}
                  projects={projects}
                  buyers={buyers}
                  onSendReply={handleSendEmailReply}
                  onSimulateInbound={handleSimulateInboundEmail}
                />
              )}

              {activeTab === 'deals' && (
                <DealsNegotiationView
                  deals={deals}
                  offers={[]}
                  projects={projects}
                  buyers={buyers}
                  onTransitionStage={handleTransitionDealStage}
                  onRunAiNegotiation={handleRunAiNegotiation}
                />
              )}

              {activeTab === 'approvals' && (
                <ApprovalCenterView
                  approvals={approvals}
                  onResolveApproval={handleResolveApproval}
                />
              )}

              {activeTab === 'dataroom' && (
                <DataRoomView
                  folders={vdrFolders}
                  files={vdrFiles}
                  accessLogs={vdrAccessLogs}
                  ndas={ndas}
                  onSignNDA={handleSignNda}
                  onUploadFile={handleUploadVdrFile}
                />
              )}

              {activeTab === 'diligence' && (
                <DueDiligenceView
                  items={dueDiligence}
                  onUpdateStatus={handleUpdateDdStatus}
                />
              )}

              {activeTab === 'marketplace' && (
                <MarketplaceView
                  projects={projects}
                  onSelectProject={(p) => setSelectedProjectForDetail(p)}
                  onSubmitOffer={handleSubmitMarketplaceBid}
                />
              )}

              {activeTab === 'agents' && (
                <AgentsRuntimeView
                  agents={agents}
                  missions={missions}
                  onOpenMissionPrompt={() => setIsMissionModalOpen(true)}
                />
              )}

              {activeTab === 'closing' && (
                <ClosingHandoverView
                  milestones={closingMilestones}
                  onToggleMilestone={handleToggleClosingMilestone}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsRiskView
                  auditLogs={auditLogs}
                  riskEvents={riskEvents}
                  analyticsData={analyticsData}
                />
              )}
            </main>
          </div>
        </>
      )}

      {/* Global Mission Bar Modal */}
      <GlobalMissionBar
        isOpen={isMissionModalOpen}
        onClose={() => setIsMissionModalOpen(false)}
        projects={projects}
        onMissionCreated={(m) => {
          setMissions(prev => [m, ...prev]);
          fetchAllData();
        }}
      />

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        onProjectCreated={(p) => {
          setProjects(prev => [p, ...prev]);
          setSelectedProjectForDetail(p);
          fetchAllData();
        }}
      />

      {/* Deep Project Inspector Modal */}
      <ProjectDetailModal
        project={selectedProjectForDetail}
        isOpen={!!selectedProjectForDetail}
        onClose={() => setSelectedProjectForDetail(null)}
        onRunAiAnalysis={handleRunAiAnalysis}
        onRunValuation={handleRunValuation}
        onLaunchMatchmaker={() => {
          setSelectedProjectForDetail(null);
          setActiveTab('buyers');
        }}
      />

      {/* AI Deal Coach Modal */}
      <DealCoachModal
        isOpen={isDealCoachOpen}
        onClose={() => setIsDealCoachOpen(false)}
        projects={projects}
      />

      {/* Integrations & Governance Policy Modal */}
      <IntegrationsGovernanceModal
        isOpen={isGovernanceModalOpen}
        onClose={() => setIsGovernanceModalOpen(false)}
      />

      {/* 17-Section M&A Executive Report Modal */}
      {executiveReportProjectId && (
        <ExecutiveReportModal
          projectId={executiveReportProjectId}
          onClose={() => setExecutiveReportProjectId(null)}
        />
      )}
    </div>
  );
}
