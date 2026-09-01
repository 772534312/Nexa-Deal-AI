import { 
  Workspace, User, Project, Buyer, BuyerMatch, Campaign, EmailMessage, 
  Deal, Offer, ApprovalItem, VdrFile, VdrFolder, VdrAccessLog, NDA, 
  DueDiligenceItem, Agent, Mission, RiskEvent, AuditLog, AiUsage, ClosingMilestone,
  IntegrationServiceStatus, SellerPolicy, AssetHandoverSecret, ToolDefinition,
  CommercialMode, SellerVerification, TransactionChecklistItem,
  HandoverMilestoneDay, TransactionArchive, BrokerageEconomics, LaunchChecklistItem
} from '../../src/types';
import { DatabaseState, WebhookEventRecord, UserSessionRecord, MigrationRecord } from './types';
import { loadDurableDatabaseState, saveDurableDatabaseState, getPool } from './connection';
import { validateMinimumPriceFloor } from '../security/governance';
import { calculateBrokerageEconomics } from '../services/economics';
import { sealTransactionArchive } from '../services/archive';

export class NexaRepository {
  private state: DatabaseState;
  private isTransactionActive: boolean = false;
  private transactionRollbackState: DatabaseState | null = null;

  constructor(initialSeedState: DatabaseState) {
    // Load durable state if available, or bootstrap from validated seed
    this.state = loadDurableDatabaseState<DatabaseState>(initialSeedState);
    // Persist immediately to establish durable file baseline
    this.persist();
  }

  /**
   * Internal persistence flush to disk & WAL
   */
  public persist(): void {
    if (!this.isTransactionActive) {
      saveDurableDatabaseState(this.state);
    }
  }

  /**
   * Execute an atomic transaction block with automatic rollback on error
   */
  public async withTransaction<T>(work: (repo: NexaRepository) => Promise<T>): Promise<T> {
    const pool = getPool();
    if (pool) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        this.isTransactionActive = true;
        this.transactionRollbackState = JSON.parse(JSON.stringify(this.state));

        const result = await work(this);

        await client.query('COMMIT');
        this.isTransactionActive = false;
        this.transactionRollbackState = null;
        this.persist();
        return result;
      } catch (err) {
        await client.query('ROLLBACK');
        if (this.transactionRollbackState) {
          this.state = this.transactionRollbackState;
        }
        this.isTransactionActive = false;
        this.transactionRollbackState = null;
        throw err;
      } finally {
        client.release();
      }
    } else {
      // In-process ACID transaction with state clone & rollback
      this.isTransactionActive = true;
      this.transactionRollbackState = JSON.parse(JSON.stringify(this.state));
      try {
        const result = await work(this);
        this.isTransactionActive = false;
        this.transactionRollbackState = null;
        this.persist();
        return result;
      } catch (err) {
        if (this.transactionRollbackState) {
          this.state = this.transactionRollbackState;
        }
        this.isTransactionActive = false;
        this.transactionRollbackState = null;
        throw err;
      }
    }
  }

  // --- STATE ACCESSORS (For seamless backwards compatibility) ---
  public get rawState(): DatabaseState {
    return this.state;
  }

  // --- WORKSPACES & USERS (Tenant Isolation & RBAC) ---
  public getWorkspaces(): Workspace[] {
    return this.state.workspaces;
  }

  public getWorkspaceById(id: string): Workspace | undefined {
    return this.state.workspaces.find((w) => w.id === id);
  }

  public getUsers(workspaceId?: string): User[] {
    if (workspaceId) {
      return this.state.users.filter((u) => u.workspaceId === workspaceId);
    }
    return this.state.users;
  }

  public getUserById(id: string): User | undefined {
    return this.state.users.find((u) => u.id === id);
  }

  public addUser(user: User): User {
    this.state.users.push(user);
    this.persist();
    return user;
  }

  // --- SESSIONS ---
  public createSession(session: UserSessionRecord): UserSessionRecord {
    this.state.sessions.push(session);
    this.persist();
    return session;
  }

  public getSessionByTokenHash(tokenHash: string): UserSessionRecord | undefined {
    const session = this.state.sessions.find((s) => s.tokenHash === tokenHash && !s.revoked);
    if (session && new Date(session.expiresAt).getTime() < Date.now()) {
      session.revoked = true;
      this.persist();
      return undefined;
    }
    return session;
  }

  public revokeSession(tokenHash: string): boolean {
    const session = this.state.sessions.find((s) => s.tokenHash === tokenHash);
    if (session) {
      session.revoked = true;
      this.persist();
      return true;
    }
    return false;
  }

  // --- PROJECTS (Digital Assets) ---
  public getProjects(workspaceId?: string): Project[] {
    if (workspaceId) {
      return this.state.projects.filter((p) => p.workspaceId === workspaceId);
    }
    return this.state.projects;
  }

  public getProjectById(id: string, workspaceId?: string): Project | undefined {
    const project = this.state.projects.find((p) => p.id === id);
    if (!project) return undefined;
    if (workspaceId && project.workspaceId !== workspaceId) {
      return undefined; // Tenant isolation check
    }
    return project;
  }

  public addProject(project: Project): Project {
    // Validate minimum price floor invariant
    const floorCheck = validateMinimumPriceFloor(project.minimumPrice);
    if (!floorCheck.isValid) {
      throw new Error(`Project minimum price violation: ${floorCheck.reason}`);
    }
    this.state.projects.unshift(project);
    this.persist();
    return project;
  }

  public updateProject(id: string, updates: Partial<Project>, workspaceId?: string): Project | undefined {
    const project = this.getProjectById(id, workspaceId);
    if (!project) return undefined;

    if (updates.minimumPrice !== undefined) {
      const floorCheck = validateMinimumPriceFloor(updates.minimumPrice);
      if (!floorCheck.isValid) {
        throw new Error(`Project minimum price violation: ${floorCheck.reason}`);
      }
    }

    Object.assign(project, updates);
    this.persist();
    return project;
  }

  // --- BUYERS & MATCHES ---
  public getBuyers(): Buyer[] {
    return this.state.buyers;
  }

  public getBuyerById(id: string): Buyer | undefined {
    return this.state.buyers.find((b) => b.id === id);
  }

  public addBuyer(buyer: Buyer): Buyer {
    this.state.buyers.push(buyer);
    this.persist();
    return buyer;
  }

  public getMatches(projectId?: string): BuyerMatch[] {
    if (projectId) {
      return this.state.matches.filter((m) => m.projectId === projectId);
    }
    return this.state.matches;
  }

  // --- DEALS & IMMUTABLE OFFERS ---
  public getDeals(workspaceId?: string): Deal[] {
    if (workspaceId) {
      return this.state.deals.filter((d) => d.workspaceId === workspaceId);
    }
    return this.state.deals;
  }

  public getDealById(id: string, workspaceId?: string): Deal | undefined {
    const deal = this.state.deals.find((d) => d.id === id);
    if (!deal) return undefined;
    if (workspaceId && deal.workspaceId !== workspaceId) {
      return undefined;
    }
    return deal;
  }

  public addDeal(deal: Deal): Deal {
    this.state.deals.unshift(deal);
    this.persist();
    return deal;
  }

  public updateDealStage(dealId: string, stage: Deal['stage'], workspaceId?: string): Deal | undefined {
    const deal = this.getDealById(dealId, workspaceId);
    if (!deal) return undefined;
    deal.stage = stage;
    deal.updatedAt = new Date().toISOString();
    this.persist();
    return deal;
  }

  public getOffers(dealId?: string): Offer[] {
    if (dealId) {
      return this.state.offers.filter((o) => o.dealId === dealId);
    }
    return this.state.offers;
  }

  public getOfferById(id: string): Offer | undefined {
    return this.state.offers.find((o) => o.id === id);
  }

  /**
   * Adds an immutable offer. Strictly enforces $48,000 floor.
   */
  public addOffer(offer: Offer): Offer {
    const floorCheck = validateMinimumPriceFloor(offer.amount);
    if (!floorCheck.isValid) {
      throw new Error(`Offer rejected: ${floorCheck.reason}`);
    }

    this.state.offers.unshift(offer);

    // Update current deal amount
    const deal = this.state.deals.find((d) => d.id === offer.dealId);
    if (deal) {
      deal.currentOfferAmount = offer.amount;
      deal.updatedAt = new Date().toISOString();
    }

    this.persist();
    return offer;
  }

  // --- APPROVALS (HITL Governance) ---
  public getApprovals(workspaceId?: string): ApprovalItem[] {
    if (workspaceId) {
      return this.state.approvals.filter((a) => a.workspaceId === workspaceId);
    }
    return this.state.approvals;
  }

  public addApproval(approval: ApprovalItem): ApprovalItem {
    this.state.approvals.unshift(approval);
    this.persist();
    return approval;
  }

  public resolveApproval(id: string, status: 'APPROVED' | 'REJECTED', resolvedBy: string): ApprovalItem | undefined {
    const approval = this.state.approvals.find((a) => a.id === id);
    if (!approval) return undefined;
    approval.status = status;
    approval.resolvedBy = resolvedBy;
    approval.resolvedAt = new Date().toISOString();
    this.persist();
    return approval;
  }

  // --- VDR (Virtual Data Room) ---
  public getVdrFolders(): VdrFolder[] {
    return this.state.vdrFolders;
  }

  public getVdrFiles(): VdrFile[] {
    return this.state.vdrFiles;
  }

  public getVdrFileById(fileId: string): VdrFile | undefined {
    return this.state.vdrFiles.find((f) => f.id === fileId);
  }

  public addVdrFile(file: VdrFile): VdrFile {
    this.state.vdrFiles.push(file);
    this.persist();
    return file;
  }

  public logVdrAccess(log: VdrAccessLog): void {
    this.state.vdrAccessLogs.unshift(log);
    this.persist();
  }

  public getNdas(projectId?: string): NDA[] {
    if (projectId) {
      return this.state.ndas.filter((n) => n.projectId === projectId);
    }
    return this.state.ndas;
  }

  public signNda(nda: NDA): NDA {
    const existingIndex = this.state.ndas.findIndex((n) => n.id === nda.id || (n.projectId === nda.projectId && n.buyerId === nda.buyerId));
    if (existingIndex >= 0) {
      this.state.ndas[existingIndex] = nda;
    } else {
      this.state.ndas.push(nda);
    }
    this.persist();
    return nda;
  }

  // --- HANDOVER SECRETS (15-min TTL One-Time Reveal) ---
  public getHandoverSecrets(projectId?: string): AssetHandoverSecret[] {
    if (projectId) {
      return this.state.handoverSecrets.filter((s) => s.projectId === projectId);
    }
    return this.state.handoverSecrets;
  }

  public getHandoverSecretById(id: string): AssetHandoverSecret | undefined {
    return this.state.handoverSecrets.find((s) => s.id === id);
  }

  /**
   * Atomically reveals a secret and consumes its one-time token
   */
  public revealHandoverSecret(id: string, actorName: string): { success: boolean; secret?: AssetHandoverSecret; error?: string } {
    const secret = this.state.handoverSecrets.find((s) => s.id === id);
    if (!secret) {
      return { success: false, error: 'Secret not found.' };
    }

    if (secret.isRevealed) {
      return { success: false, error: 'Secret has already been revealed and cannot be accessed again.' };
    }

    if (secret.expiresAt && new Date(secret.expiresAt).getTime() < Date.now()) {
      return { success: false, error: 'One-time reveal token has expired (15-minute TTL exceeded).' };
    }

    // Atomic consumption lock
    secret.isRevealed = true;
    secret.revealedAt = new Date().toISOString();
    secret.revealedBy = actorName;

    this.persist();
    return { success: true, secret };
  }

  // --- WEBHOOK EVENTS (Idempotency & Replay Protection) ---
  public getWebhookEvent(provider: WebhookEventRecord['provider'], eventId: string): WebhookEventRecord | undefined {
    return this.state.webhookEvents.find((e) => e.provider === provider && e.eventId === eventId);
  }

  public recordWebhookEvent(event: WebhookEventRecord): void {
    const existing = this.getWebhookEvent(event.provider, event.eventId);
    if (!existing) {
      this.state.webhookEvents.unshift(event);
      this.persist();
    }
  }

  // --- AUDIT LOGS (Append-Only) ---
  public getAuditLogs(workspaceId?: string): AuditLog[] {
    if (workspaceId) {
      return this.state.auditLogs.filter((l) => l.workspaceId === workspaceId);
    }
    return this.state.auditLogs;
  }

  public addAuditLog(log: AuditLog): void {
    this.state.auditLogs.unshift(log);
    this.persist();
  }

  // --- BROKERAGE ECONOMICS & ARCHIVE SEALS ---
  public getBrokerageEconomics(dealId: string): BrokerageEconomics | undefined {
    return this.state.brokerageEconomics.find((e) => e.dealId === dealId);
  }

  public recordBrokerageEconomics(dealId: string, grossDealValue: number): BrokerageEconomics {
    const calculated = calculateBrokerageEconomics({ dealId, grossDealValue });
    const idx = this.state.brokerageEconomics.findIndex((e) => e.dealId === dealId);
    if (idx >= 0) {
      this.state.brokerageEconomics[idx] = calculated;
    } else {
      this.state.brokerageEconomics.push(calculated);
    }
    this.persist();
    return calculated;
  }

  public getTransactionArchive(dealId: string): TransactionArchive | undefined {
    return this.state.transactionArchives.find((a) => a.dealId === dealId);
  }

  public sealDealArchive(dealId: string): TransactionArchive | undefined {
    const deal = this.state.deals.find((d) => d.id === dealId);
    if (!deal) return undefined;
    const project = this.state.projects.find((p) => p.id === deal.projectId);
    const buyer = this.state.buyers.find((b) => b.id === deal.buyerId);
    const acceptedOffer = this.state.offers.find((o) => o.dealId === dealId && (o.status === 'accepted' || (o.status as string) === 'ACCEPTED')) || this.state.offers.find((o) => o.dealId === dealId);

    if (!project || !buyer || !acceptedOffer) return undefined;

    const handoverPlan = this.state.handoverPlans[dealId] || [];
    const archive = sealTransactionArchive(deal, project, buyer, acceptedOffer, handoverPlan);

    deal.archiveHash = archive.sha256Hash;
    deal.stage = 'COMPLETED';

    const idx = this.state.transactionArchives.findIndex((a) => a.dealId === dealId);
    if (idx >= 0) {
      this.state.transactionArchives[idx] = archive;
    } else {
      this.state.transactionArchives.push(archive);
    }

    this.persist();
    return archive;
  }
}
