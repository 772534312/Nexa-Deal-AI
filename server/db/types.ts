import { 
  Workspace, User, Project, Buyer, BuyerMatch, Campaign, EmailMessage, 
  Deal, Offer, ApprovalItem, VdrFile, VdrFolder, VdrAccessLog, NDA, 
  DueDiligenceItem, Agent, Mission, RiskEvent, AuditLog, AiUsage, ClosingMilestone,
  IntegrationServiceStatus, SellerPolicy, AssetHandoverSecret, ToolDefinition,
  CommercialMode, SellerVerification, TransactionChecklistItem,
  HandoverMilestoneDay, TransactionArchive, BrokerageEconomics, LaunchChecklistItem
} from '../../src/types';

export interface WebhookEventRecord {
  id: string;
  provider: 'ESCROW' | 'STRIPE' | 'SENDGRID' | 'GITHUB';
  eventId: string;
  eventType: string;
  payload: any;
  status: 'PROCESSED' | 'FAILED' | 'IGNORED';
  signature?: string;
  processedAt: string;
  error?: string;
}

export interface UserSessionRecord {
  id: string;
  userId: string;
  workspaceId: string;
  tokenHash: string;
  role: string;
  createdAt: string;
  expiresAt: string;
  revoked: boolean;
  lastActivity: string;
}

export interface MigrationRecord {
  version: number;
  name: string;
  appliedAt: string;
  checksum: string;
}

export interface DatabaseState {
  commercialMode: CommercialMode;
  workspaces: Workspace[];
  users: User[];
  sessions: UserSessionRecord[];
  projects: Project[];
  buyers: Buyer[];
  matches: BuyerMatch[];
  campaigns: Campaign[];
  emails: EmailMessage[];
  deals: Deal[];
  offers: Offer[];
  approvals: ApprovalItem[];
  vdrFolders: VdrFolder[];
  vdrFiles: VdrFile[];
  vdrAccessLogs: VdrAccessLog[];
  ndas: NDA[];
  dueDiligence: DueDiligenceItem[];
  agents: Agent[];
  missions: Mission[];
  riskEvents: RiskEvent[];
  auditLogs: AuditLog[];
  aiUsages: AiUsage[];
  closingMilestones: ClosingMilestone[];
  sellerPolicies: SellerPolicy[];
  integrations: IntegrationServiceStatus[];
  handoverSecrets: AssetHandoverSecret[];
  tools: ToolDefinition[];
  sellerVerifications: SellerVerification[];
  transactionChecklists: Record<string, TransactionChecklistItem[]>;
  handoverPlans: Record<string, HandoverMilestoneDay[]>;
  transactionArchives: TransactionArchive[];
  brokerageEconomics: BrokerageEconomics[];
  launchChecklists: LaunchChecklistItem[];
  emailSuppressionList: string[];
  agentMemory: Record<string, any>;
  webhookEvents: WebhookEventRecord[];
  migrations: MigrationRecord[];
}
