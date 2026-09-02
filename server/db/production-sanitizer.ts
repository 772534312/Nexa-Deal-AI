import type { DatabaseState } from './types';

const DEMO_WORKSPACE_IDS = new Set(['ws-1', 'ws-2']);

/**
 * Production must never expose the bundled demonstration transaction graph.
 * Newly registered sellers receive random workspace IDs, so removing only the
 * legacy seed workspaces is safe and does not affect real accounts.
 */
export function sanitizeProductionSeedData(state: DatabaseState): void {
  const isProductionRuntime = process.env.NODE_ENV === 'production'
    || process.env.RENDER === 'true'
    || process.env.NEXA_PRODUCTION_DATA_MODE === 'true';
  if (!isProductionRuntime || process.env.NEXA_ALLOW_DEMO_DATA === 'true') return;

  const demoProjectIds = new Set(state.projects.filter(p => DEMO_WORKSPACE_IDS.has(p.workspaceId)).map(p => p.id));
  const demoBuyerIds = new Set(state.buyers.filter(b => DEMO_WORKSPACE_IDS.has(b.workspaceId)).map(b => b.id));
  const demoDealIds = new Set(state.deals.filter(d => DEMO_WORKSPACE_IDS.has(d.workspaceId)).map(d => d.id));

  state.workspaces = state.workspaces.filter(w => !DEMO_WORKSPACE_IDS.has(w.id));
  state.users = state.users.filter(u => !DEMO_WORKSPACE_IDS.has(u.workspaceId));
  state.projects = state.projects.filter(p => !DEMO_WORKSPACE_IDS.has(p.workspaceId));
  state.buyers = state.buyers.filter(b => !DEMO_WORKSPACE_IDS.has(b.workspaceId));
  state.campaigns = state.campaigns.filter(c => !DEMO_WORKSPACE_IDS.has(c.workspaceId));
  state.emails = state.emails.filter(e => !DEMO_WORKSPACE_IDS.has(e.workspaceId));
  state.deals = state.deals.filter(d => !DEMO_WORKSPACE_IDS.has(d.workspaceId));
  state.approvals = state.approvals.filter(a => !DEMO_WORKSPACE_IDS.has(a.workspaceId));
  state.missions = state.missions.filter(m => !DEMO_WORKSPACE_IDS.has(m.workspaceId));
  state.riskEvents = state.riskEvents.filter(r => !DEMO_WORKSPACE_IDS.has(r.workspaceId));
  state.auditLogs = state.auditLogs.filter(a => !DEMO_WORKSPACE_IDS.has(a.workspaceId));
  state.aiUsages = state.aiUsages.filter(a => !DEMO_WORKSPACE_IDS.has(a.workspaceId));
  state.sellerPolicies = state.sellerPolicies.filter(p => !DEMO_WORKSPACE_IDS.has(p.workspaceId));
  state.integrations = state.integrations.filter(i => !('workspaceId' in i) || !DEMO_WORKSPACE_IDS.has((i as any).workspaceId));
  state.sellerVerifications = state.sellerVerifications.filter(v => !Array.from(['usr-1', 'usr-2', 'usr-3']).includes(v.sellerId));

  state.matches = state.matches.filter(m => !demoProjectIds.has(m.projectId) && !demoBuyerIds.has(m.buyerId));
  state.offers = state.offers.filter(o => !demoDealIds.has(o.dealId) && !demoProjectIds.has(o.projectId) && !demoBuyerIds.has(o.buyerId));
  state.ndas = state.ndas.filter(n => !demoProjectIds.has(n.projectId) && !demoBuyerIds.has(n.buyerId));
  state.vdrAccessLogs = state.vdrAccessLogs.filter(v => !demoProjectIds.has(v.projectId) && !demoBuyerIds.has(v.buyerId));
  state.dueDiligence = state.dueDiligence.filter(d => {
    const projectId = (d as any).projectId;
    return !projectId || !demoProjectIds.has(projectId);
  });
  state.handoverSecrets = state.handoverSecrets.filter(s => !demoProjectIds.has(s.projectId));
  state.brokerageEconomics = state.brokerageEconomics.filter(e => !demoDealIds.has(e.dealId));
  state.transactionArchives = state.transactionArchives.filter(a => !demoDealIds.has(a.dealId) && a.dealId !== 'deal-historical-0');

  for (const id of demoDealIds) {
    delete state.transactionChecklists[id];
    delete state.handoverPlans[id];
  }

  state.emailSuppressionList = state.emailSuppressionList.filter(email => !email.includes('competitor-corp.com'));
  state.agentMemory = Object.fromEntries(Object.entries(state.agentMemory).filter(([key]) => !key.startsWith('proj-1_') && !key.startsWith('buyer-1_')));

  // Keep platform-level agents/tools and launch controls. They are product
  // configuration, not seller-owned transaction data.
}
