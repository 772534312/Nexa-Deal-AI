export type UserRole = 'Owner' | 'Admin' | 'Manager' | 'Member' | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  workspaceId: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: 'Free' | 'Pro' | 'Business' | 'Enterprise';
  membersCount: number;
  activeProjectsCount: number;
  monthlyAiBudget: number;
  usedAiBudget: number;
  createdAt: string;
}

export type ProjectStatus = 'draft' | 'active' | 'negotiating' | 'under_contract' | 'sold' | 'archived';
export type ProjectCategory = 
  | 'SaaS' 
  | 'AI Platform' 
  | 'Mobile App' 
  | 'Web Application' 
  | 'Marketplace' 
  | 'E-commerce' 
  | 'API / Developer Tool' 
  | 'Browser Extension' 
  | 'Digital Business'
  | 'Domain + Asset';

export interface ProjectFinancials {
  monthlyRevenue: number;
  annualRevenue: number;
  mrr: number;
  arr: number;
  monthlyProfit: number;
  annualProfit: number;
  monthlyExpenses: number;
  growthRateYoY: number; // e.g. 45%
  churnRate: number; // e.g. 2.1%
  activeUsers: number;
  monthlyTraffic: number;
}

export interface ProjectAsset {
  id: string;
  projectId: string;
  title: string;
  type: 'image' | 'document' | 'screenshot' | 'video' | 'architecture' | 'roadmap' | 'financial_sheet';
  url: string;
  size: string;
  mimeType: string;
  uploadedAt: string;
}

export interface ProjectScores {
  technologyScore: number;
  marketScore: number;
  businessScore: number;
  growthScore: number;
  revenueScore: number;
  strategicScore: number;
  buyerAppeal: number;
  overallScore: number;
}

export interface ValuationReport {
  lowValue: number;
  expectedValue: number;
  highValue: number;
  recommendedAskingPrice: number;
  expectedClosingRangeLow: number;
  expectedClosingRangeHigh: number;
  confidenceScore: number; // 0-100
  revenueMultiple: number; // e.g. 4.2x
  sdeMultiple: number; // e.g. 5.1x
  strategicPremium: number; // e.g. $15,000
  methodologyNotes: string[];
  disclaimer: string;
  generatedAt: string;
}

export interface ProjectIntelligence {
  overview: string;
  businessModel: string;
  technologyStack: string[];
  marketLandscape: string;
  targetCustomers: string[];
  competitiveAdvantages: string[];
  weaknesses: string[];
  risks: string[];
  growthOpportunities: string[];
  strategicValue: string;
  acquisitionOpportunities: string[];
}

export interface PreSaleOptimization {
  missingDocumentation: string[];
  weakMetrics: string[];
  technicalRisks: string[];
  pricingIssues: string[];
  buyerObjections: string[];
  actionableRecommendations: { priority: 'HIGH' | 'MEDIUM' | 'LOW'; title: string; impact: string }[];
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  url: string;
  repositoryUrl: string;
  technologies: string[];
  businessModel: string;
  financials: ProjectFinancials;
  askingPrice: number;
  minimumPrice: number;
  targetPrice: number;
  currency: string;
  country: string;
  targetMarket: string;
  status: ProjectStatus;
  visibility: 'Public' | 'Private' | 'Confidential' | 'Invite Only';
  scores: ProjectScores;
  intelligence?: ProjectIntelligence;
  valuation?: ValuationReport;
  optimization?: PreSaleOptimization;
  readinessReport?: MaReadinessReport;
  claims?: ClaimVerificationItem[];
  ownershipChecklist?: AssetOwnershipItem[];
  assets: ProjectAsset[];
  createdAt: string;
  updatedAt: string;
}

export interface DecisionMaker {
  name: string;
  legalName?: string;
  role: string;
  email: string;
  linkedin?: string;
  corporateEmailVerified?: boolean;
  corporateDmarcVerified?: boolean;
  identityVerificationMethod?: string;
  identityVerifiedAt?: string;
  isAuthorizedMnaSigner?: boolean;
}

export type CorporateAffiliationStatus = 'VERIFIED' | 'AFFILIATION_UNVERIFIED' | 'PENDING_DOCUMENTATION' | 'UNVERIFIED';

export interface Buyer {
  id: string;
  workspaceId: string;
  companyName: string;
  logo?: string;
  website: string;
  industry: string;
  country: string;
  size: string; // e.g. "50-200 employees"
  products: string[];
  technologies: string[];
  businessModel: string;
  potentialBudgetMin: number;
  potentialBudgetMax: number;
  acquisitionHistory: string[];
  decisionMakers: DecisionMaker[];
  contactEmail: string;
  qualificationTier?: BuyerQualificationTier;
  qualityScore?: BuyerQualityScore;
  corporateAffiliationStatus?: CorporateAffiliationStatus;
  isCorporateAuthorizedRep?: boolean;
  affiliationVerificationMethod?: string;
  affiliationVerifiedAt?: string;
  affiliationEvidenceDoc?: string;
  strategicFitLabel?: string; // Always "AI-Generated Strategic Fit Score"
  strategicFitReasoning?: string[];
  fundingStatus?: string;
  strategicRationale?: string;
  isOptedOut?: boolean;
  optedOutAt?: string;
  status: 'DISCOVERED' | 'CONTACTED' | 'RESPONDED' | 'QUALIFIED' | 'INTERESTED' | 'NEGOTIATING' | 'OFFER_MADE' | 'DUE_DILIGENCE' | 'PASSED';
  intentScore: number; // 0-100
  overallScore: number; // 0-100
  notes: string;
  tags: string[];
  createdAt: string;
}

export interface BuyerMatch {
  id: string;
  projectId: string;
  buyerId: string;
  industryMatch: number;
  techMatch: number;
  marketMatch: number;
  businessModelMatch: number;
  strategicFit: number;
  estimatedBudgetScore: number;
  acquisitionHistoryScore: number;
  buyerIntentScore: number;
  overallMatchScore: number; // 0-100
  strategicRationale: string;
  whyTheyWouldBuy: string;
  synergies: string[];
  integrationRoadmap: string;
  potentialObjections: string[];
}

export type AutomationLevel = 'manual' | 'assisted' | 'autonomous';

export interface Campaign {
  id: string;
  workspaceId: string;
  projectId: string;
  name: string;
  targetIndustry: string;
  targetCountries: string[];
  minBuyerScore: number;
  maxBuyers: number;
  status: 'draft' | 'active' | 'paused' | 'completed';
  automationLevel: AutomationLevel;
  followUpPolicy: {
    followUp1Days: number;
    followUp2Days: number;
    finalFollowUpDays: number;
    stopOnReply: boolean;
    stopOnUnsubscribe: boolean;
  };
  totalTargeted: number;
  totalSent: number;
  totalOpened: number;
  totalReplies: number;
  totalInterested: number;
  createdAt: string;
}

export type EmailIntent = 
  | 'Interested' 
  | 'Not Interested' 
  | 'Question' 
  | 'Price Inquiry' 
  | 'Negotiation' 
  | 'Offer' 
  | 'Counter Offer' 
  | 'NDA Request' 
  | 'Document Request' 
  | 'Demo Request' 
  | 'Spam' 
  | 'Out of Office';

export interface EmailMessage {
  id: string;
  workspaceId: string;
  threadId: string;
  buyerId: string;
  projectId: string;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  direction: 'inbound' | 'outbound';
  status: 'sent' | 'received' | 'draft' | 'queued';
  intent?: EmailIntent;
  intentScore: number; // 0-100
  classificationReason?: string;
  extractedQuestions?: string[];
  extractedOffers?: string[];
  aiDraftReply?: string;
  isApproved: boolean;
  timestamp: string;
}

export type DealStage = 
  | 'DRAFT'
  | 'PUBLISHED'
  | 'CONTACTED'
  | 'RESPONDED'
  | 'QUALIFIED'
  | 'INTERESTED'
  | 'NEGOTIATING'
  | 'OFFER_RECEIVED'
  | 'DUE_DILIGENCE'
  | 'NDA_SIGNED'
  | 'DATA_ROOM'
  | 'PENDING_APPROVAL'
  | 'ACCEPTED'
  | 'CLOSING'
  | 'COMPLETED'
  | 'CANCELLED';

export interface OfferHistoryItem {
  id: string;
  timestamp: string;
  sender: 'BUYER' | 'SELLER' | 'AI_AGENT';
  amount: number;
  upfrontCash: number;
  earnoutAmount: number;
  transitionSupportDays: number;
  nonCompeteMonths: number;
  exclusivityDays: number;
  termsSummary: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED';
}

export interface Offer {
  id: string;
  dealId: string;
  projectId: string;
  buyerId: string;
  amount: number;
  currency: string;
  upfrontCash: number;
  earnoutAmount: number;
  earnoutTerms: string;
  paymentSchedule: '100% Upfront' | '80% Upfront / 20% Milestone' | '70% Upfront / 30% 12-Mo Earnout' | 'Escrow Staged';
  transitionSupportDays: number;
  nonCompeteMonths: number;
  assetsIncluded: string[];
  exclusivityDays: number;
  expirationDate: string;
  status: 'draft' | 'pending_approval' | 'active' | 'countered' | 'accepted' | 'rejected' | 'expired';
  history: OfferHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  workspaceId: string;
  projectId: string;
  buyerId: string;
  stage: DealStage;
  currentOfferAmount?: number;
  targetPrice: number;
  minimumPrice: number;
  askingPrice: number;
  closingProbability: number; // 0-100%
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  bestDealScore: number; // 0-100
  negotiationLeverage: 'SELLER_ADVANTAGE' | 'BALANCED' | 'BUYER_ADVANTAGE';
  recommendedNextAction: string;
  ndaSigned: boolean;
  dataRoomAccessGranted: boolean;
  assignedAgent: string;
  healthScore?: DealHealthScore;
  probabilityBreakdown?: DealClosingProbability;
  archiveHash?: string;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
}

export type ApprovalActionType = 
  | 'SEND_FINANCIALS' 
  | 'SHARE_SOURCE_CODE' 
  | 'ACCEPT_OFFER' 
  | 'SEND_COUNTER_OFFER' 
  | 'GRANT_DATA_ROOM' 
  | 'FINALIZE_DEAL' 
  | 'SIGN_NDA_AGREEMENT';

export type ApprovalPolicy = 'AUTO_APPROVE' | 'APPROVAL_REQUIRED' | 'NEVER_AUTO_APPROVE';

export interface ApprovalItem {
  id: string;
  workspaceId: string;
  projectId: string;
  dealId?: string;
  buyerId?: string;
  actionType: ApprovalActionType;
  title: string;
  description: string;
  amount?: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  aiRecommendation: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EDITED';
  policy: ApprovalPolicy;
  payload: Record<string, any>;
  requestedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export type VdrPermission = 'PRIVATE' | 'NDA_REQUIRED' | 'VIEW_ONLY' | 'DOWNLOAD_ALLOWED';

export interface VdrFile {
  id: string;
  folderId: string;
  name: string;
  category: 'Executive Summary' | 'Product' | 'Technology' | 'Financial' | 'Analytics' | 'Legal' | 'Contracts' | 'Infrastructure' | 'IP' | 'Other';
  size: string;
  permissionLevel: VdrPermission;
  maturityTier?: DataRoomMaturityTier;
  url: string;
  watermarkEnabled: boolean;
  uploadedAt: string;
}

export interface VdrFolder {
  id: string;
  name: string;
  category: VdrFile['category'];
  fileCount: number;
}

export interface VdrAccessLog {
  id: string;
  projectId: string;
  fileId: string;
  fileName: string;
  buyerId: string;
  buyerName: string;
  action: 'VIEW' | 'DOWNLOAD' | 'REQUEST_ACCESS' | 'REVOKED';
  timestamp: string;
  ipAddress: string;
}

export interface NDA {
  id: string;
  projectId: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  status: 'REQUESTED' | 'DRAFTED' | 'SENT' | 'SIGNED' | 'EXPIRED';
  terms: string;
  documentUrl?: string;
  sha256Hash?: string;
  requestedAt: string;
  signedAt?: string;
  expiresAt: string;
}

export interface DueDiligenceItem {
  id: string;
  pillar: 'Product' | 'Technology' | 'Financials' | 'Analytics' | 'Infrastructure' | 'Legal' | 'Contracts' | 'IP' | 'Risks' | 'Dependencies';
  title: string;
  description: string;
  status: 'VERIFIED' | 'IN_PROGRESS' | 'ACTION_REQUIRED' | 'HIGH_RISK';
  notes: string;
  documentRef?: string;
  buyerQuestions: string[];
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  tools: string[];
  status: 'IDLE' | 'ACTIVE' | 'PROCESSING' | 'PAUSED';
  version: string;
  runsCount: number;
  successRate: number; // e.g. 98.4%
}

export interface MissionTask {
  id: string;
  missionId: string;
  agentId: string;
  toolName: string;
  title: string;
  description: string;
  dependencies: string[];
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'BLOCKED';
  input?: any;
  output?: any;
  logs: string[];
  startedAt?: string;
  completedAt?: string;
}

export interface Mission {
  id: string;
  workspaceId: string;
  title: string;
  prompt: string;
  status: 'PENDING' | 'PLANNING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PAUSED';
  progressPercent: number;
  tasks: MissionTask[];
  createdAt: string;
  completedAt?: string;
}

export interface RiskEvent {
  id: string;
  workspaceId: string;
  dealId?: string;
  buyerId?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: 'FRAUD_SUSPICION' | 'UNREALISTIC_TERMS' | 'BYPASS_ATTEMPT' | 'PROMPT_INJECTION' | 'DATA_LEAK_ATTEMPT' | 'PAYMENT_ANOMALY';
  title: string;
  description: string;
  mitigationRecommendation: string;
  status: 'ACTIVE' | 'MITIGATED' | 'DISMISSED';
  timestamp: string;
}

export interface AuditLog {
  id: string;
  workspaceId: string;
  actor: string;
  actorType: 'USER' | 'AGENT' | 'SYSTEM';
  action: string;
  target: string;
  tool?: string;
  details: string;
  result: 'SUCCESS' | 'WARNING' | 'DENIED' | 'ERROR';
  timestamp: string;
}

export interface AiUsage {
  id: string;
  workspaceId: string;
  provider: 'Gemini 3.7 Flash' | 'Gemini Pro' | 'Anthropic' | 'OpenAI';
  tokensUsed: number;
  estimatedCostUsd: number;
  agentId: string;
  operation: string;
  timestamp: string;
}

export type VDRFolder = VdrFolder;
export type VDRFile = VdrFile;
export type VDRAccessLog = VdrAccessLog;
export type AIUsage = AiUsage;

export interface MatchResult {
  overallMatchScore: number;
  estimatedDealProbability: number;
  acquisitionFitTier?: string;
  strategicRationale: string;
  synergies?: string[];
  integrationRoadmap?: string[];
  potentialObjections?: string[];
  synergyFactors?: Record<string, number>;
}

export interface IntegrationServiceStatus {
  id: string;
  name: string;
  category: 'AI Provider' | 'Email / OAuth' | 'Escrow & Settlement' | 'Code & Repositories' | 'DNS & Domains' | 'Encrypted Storage';
  status: 'CONNECTED' | 'DEMO_MODE' | 'CONFIGURATION_REQUIRED' | 'SANDBOX';
  description: string;
  lastSync?: string;
  details: string;
}

export interface SellerPolicy {
  id: string;
  workspaceId: string;
  minimumPriceFloor: number;
  targetPrice: number;
  maxDiscountPercent: number;
  allowedBuyerTypes: string[];
  allowedCountries: string[];
  maxOutreachRatePerDay: number;
  requireNdaForFinancials: boolean;
  requireHumanApprovalForPriceConcession: boolean;
  requireHumanApprovalForEscrow: boolean;
  autonomousNegotiationPriceFloor: number;
  autonomyMode?: 'MANUAL' | 'ASSISTED' | 'AUTONOMOUS';
  isFirstRealDealProtected?: boolean;
  updatedAt: string;
}

export interface AssetHandoverSecret {
  id: string;
  workspaceId?: string;
  projectId: string;
  title: string;
  category: 'Repository Access' | 'Cloud Provider Root' | 'DNS Registrar' | 'Database Credentials' | 'Stripe Account Transfer' | 'API Keys & Secrets' | 'Database' | 'Domain' | 'Hosting' | 'Repository' | 'Payment';
  description?: string;
  isRevealed: boolean;
  maskedValue?: string;
  secretValue?: string;
  encryptedSecret?: string;
  oneTimeTokenHash?: string;
  expiresAt?: string;
  revealedAt?: string;
  revealedBy?: string;
  isLocked?: boolean;
  revealed?: boolean;
  lastAccessedAt?: string;
  accessCount?: number;
  verifiedByBuyer?: boolean;
  verifiedAt?: string;
}

export interface ToolDefinition {
  id: string;
  name: string;
  category: 'Intelligence' | 'Communication' | 'Legal & VDR' | 'Negotiation' | 'Settlement';
  description: string;
  requiredPermissions: string[];
  rateLimit: string;
  status: 'ONLINE' | 'ACTIVE';
  inputSchema: string;
  outputSchema: string;
}

export interface ClosingMilestone {
  id: string;
  title: string;
  category: 'Domain' | 'Repository' | 'Cloud' | 'Database' | 'Documentation' | 'Licenses' | 'Credentials' | 'Escrow';
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  assignedTo: string;
  verifiedBy: string;
  updatedAt: string;
}

export interface NegotiationResult {
  recommendation: string;
  confidenceScore: number;
  strategicRationale: string;
  counterAmount?: number;
  counterTactics?: string[];
  draftCounterEmail?: string;
}

// -------------------------------------------------------------
// COMMERCIAL READINESS & REAL-WORLD TRANSACTION MODELS
// -------------------------------------------------------------
export type CommercialMode = 'DEMO' | 'SANDBOX' | 'LIVE' | 'CONTROLLED_FIRST_TRANSACTION';
export type EvidenceState = 'VERIFIED' | 'SELLER_PROVIDED' | 'BUYER_PROVIDED' | 'AI_INFERRED' | 'SYSTEM_TEST_DATA' | 'UNVERIFIED' | 'UNKNOWN';
export type ClaimVerificationStatus = EvidenceState | 'Verified' | 'Seller Provided' | 'AI Inferred' | 'External Evidence' | 'Unknown';
export type BuyerQualificationTier = 'UNVERIFIED' | 'PARTIALLY_VERIFIED' | 'VERIFIED' | 'QUALIFIED';
export type DealHealthStatus = 'HEALTHY' | 'WATCH' | 'AT_RISK' | 'CRITICAL';
export type DataRoomMaturityTier = 'PUBLIC' | 'QUALIFIED_BUYER' | 'NDA_SIGNED' | 'DUE_DILIGENCE' | 'CLOSING';
export type BrokerageFeeModel = 'SUCCESS_FEE' | 'LISTING_FEE' | 'SUBSCRIPTION' | 'HYBRID';

export interface EvidenceProvenance {
  source: string;
  evidenceType: string;
  evidenceRef: string;
  verificationMethod: string;
  verificationTimestamp: string;
  verifier: string;
  confidence: number; // 0 - 100
  expirationDate?: string;
}

export type LiveDealGateStatus = 'READY FOR FIRST REAL COMMERCIAL TRANSACTION' | 'BLOCKED — EVIDENCE VERIFICATION REQUIRED' | 'BLOCKED — TECHNICAL ISSUE';

export interface LiveDealChecklistCriterion {
  id: string;
  number: number;
  title: string;
  category: 'SELLER' | 'ASSET' | 'BUYER' | 'COMMUNICATION' | 'NEGOTIATION' | 'GOVERNANCE' | 'SECURITY' | 'ESCROW' | 'CLOSING' | 'INFRASTRUCTURE';
  status: 'VERIFIED' | 'BLOCKED' | 'PENDING';
  evidenceSource: string;
  evidenceRef: string;
  verifiedAt: string;
  verifier: string;
  details: string;
  immutableCheck: boolean;
}

export interface FirstLiveDealGateReport {
  status: LiveDealGateStatus;
  overallScore: number;
  evaluationTimestamp: string;
  dealTested: {
    id: string;
    projectId: string;
    projectName: string;
    buyerId: string;
    buyerCompanyName: string;
    buyerContact: string;
    agreedOffer: number;
    sellerFloor: number;
  };
  provenanceChain: {
    realSeller: { verified: boolean; evidence: string; verifier: string };
    realAsset: { verified: boolean; evidence: string; verifier: string };
    verifiableOwnership: { verified: boolean; evidence: string; verifier: string };
    verifiableBuyer: { verified: boolean; affiliationStatus: CorporateAffiliationStatus; evidence: string; verifier: string };
    realBuyerCommunication: { verified: boolean; evidence: string; verifier: string };
    realOffer: { verified: boolean; evidence: string; verifier: string };
    policyCompliantNegotiation: { verified: boolean; evidence: string; verifier: string };
    humanApproval: { verified: boolean; evidence: string; verifier: string };
    ndaExecuted: { verified: boolean; evidence: string; verifier: string };
    controlledDataRoom: { verified: boolean; evidence: string; verifier: string };
    dueDiligenceCompleted: { verified: boolean; evidence: string; verifier: string };
    verifiedEscrowState: { verified: boolean; evidence: string; verifier: string };
    approvedClosing: { verified: boolean; evidence: string; verifier: string };
    secureAssetTransfer: { verified: boolean; evidence: string; verifier: string };
    immutableArchival: { verified: boolean; sha256: string; evidence: string; verifier: string };
  };
  criteria: LiveDealChecklistCriterion[];
  criticalAlerts: string[];
  remediationSteps: string[];
  sha256Seal: string;
}

export interface StressTestStepResult {
  id: string;
  stepNumber: number;
  name: string;
  category: 'SECURITY' | 'GOVERNANCE' | 'VERIFICATION' | 'NEGOTIATION' | 'ESCROW' | 'HANDOVER' | 'CONCURRENCY' | 'FAILURE_DRILL';
  status: 'PASS' | 'FAIL' | 'BLOCKED';
  invariantsEnforced: string[];
  evidence: string;
  timestamp: string;
  details: string;
}

export interface ControlledTransactionReport {
  executionId: string;
  mode: CommercialMode;
  assetTested: {
    id: string;
    name: string;
    domain: string;
    mrr: number;
    arr: number;
    askingPrice: number;
    minimumFloor: number;
  };
  buyerTested: {
    id: string;
    name: string;
    company: string;
    email: string;
    strategicFitScore: number;
  };
  verdict: 'FIRST TRANSACTION SUCCESSFUL' | 'FIRST TRANSACTION SUCCESSFUL WITH ISSUES' | 'FIRST TRANSACTION FAILED';
  transactionExecutionScore: number; // e.g. 98.4
  metrics: {
    securityScore: number;
    automationScore: number;
    reliabilityScore: number;
    complianceScore: number;
    handoverScore: number;
    auditabilityScore: number;
  };
  economics: {
    grossDealValue: number;
    platformFee: number;
    aiCost: number;
    emailCost: number;
    infraCost: number;
    netMargin: number;
    netMarginPercentage: number;
  };
  steps: StressTestStepResult[];
  failureDrills: {
    drill: string;
    simulatedCondition: string;
    expectedBehavior: string;
    actualBehavior: string;
    status: 'PASS' | 'FAIL';
  }[];
  sha256Seal: string;
  executedAt: string;
}

export interface ClaimVerificationItem {
  field: string;
  label: string;
  value: string | number;
  status: ClaimVerificationStatus;
  provenance?: EvidenceProvenance;
  evidenceRef?: string;
  verifiedAt?: string;
  verifier?: string;
  confidence?: number;
  notes?: string;
}

export interface MaReadinessReport {
  overallScore: number; // 0-100
  threshold: number; // default 75
  status: 'READY_FOR_OUTREACH' | 'NOT_READY_FOR_OUTREACH';
  summary: string;
  blockingFactors: string[];
  recommendations: string[];
  categories: {
    financialReadiness: number;
    technicalReadiness: number;
    legalIpReadiness: number;
    analyticsReadiness: number;
    documentationReadiness: number;
    buyerAppeal: number;
    marketability: number;
    riskScore: number;
  };
  generatedAt: string;
}

export interface SellerVerification {
  id: string;
  sellerId: string;
  emailVerified: boolean;
  identityVerified: boolean;
  ownershipVerified: boolean;
  projectControlVerified: boolean;
  domainOwnershipVerified: boolean;
  repoOwnershipVerified: boolean;
  businessInfoVerified: boolean;
  verificationTier: 'TIER_1_BASIC' | 'TIER_2_PROVEN' | 'TIER_3_ENTERPRISE';
  verifiedProvider?: string;
  verifiedAt?: string;
  notes: string[];
}

export interface AssetOwnershipItem {
  id: string;
  assetType: 'Domain' | 'GitHub Repository' | 'Cloud Infrastructure' | 'Application' | 'Database' | 'Analytics' | 'Brand/IP' | 'Stripe/Billing';
  name: string;
  identifier: string;
  verificationMethod: 'DNS TXT Record' | 'OAuth Commit Signature' | 'Cloud IAM Role' | 'Ping Endpoint' | 'SSL Cert Check' | 'Manual Evidence Document';
  status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'FAILED' | 'NOT_STARTED';
  verifiedAt?: string;
  evidenceUrl?: string;
}

export interface BuyerQualityScore {
  strategicFit: number; // 0-100
  financialCapacity: number; // 0-100
  acquisitionHistory: number; // 0-100
  intent: number; // 0-100
  verification: number; // 0-100
  technicalFit: number; // 0-100
  speed: number; // 0-100
  risk: number; // 0-100 (lower is safer)
  overallQualityScore: number; // 0-100
  confidence: number; // 0-100
  evidenceSummary: string[];
}

export interface DealHealthScore {
  status: DealHealthStatus;
  overallScore: number; // 0-100
  buyerIntentFactor: number;
  offerStrengthFactor: number;
  priceDistanceFactor: number;
  dueDiligenceProgressFactor: number;
  ndaDataRoomFactor: number;
  buyerResponsivenessFactor: number;
  riskFactor: number;
  closingProgressFactor: number;
  summary: string;
  primaryRisks: string[];
  suggestedAction: string;
}

export interface DealClosingProbability {
  probability: number; // 0-100%
  confidence: number; // 0-100%
  primaryFactors: string[];
  negativeFactors: string[];
  historicalBenchmark: string;
}

export interface TransactionChecklistItem {
  id: string;
  stepNumber: number;
  title: string;
  stage: DealStage;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'BLOCKED';
  completedAt?: string;
  verifiedBy?: string;
  isImmutable: boolean;
  notes?: string;
}

export interface HandoverMilestoneDay {
  id: string;
  day: 'Day 0' | 'Day 1' | 'Day 3' | 'Day 7' | 'Day 14' | 'Day 30';
  title: string;
  category: 'Technical Support' | 'Bug Transfer' | 'Documentation' | 'Credentials' | 'Infrastructure' | 'Domain' | 'Repository' | 'Analytics' | 'Customer Transition';
  description: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  assignedParty: 'SELLER' | 'BUYER' | 'JOINT';
  completedAt?: string;
  notes?: string;
}

export interface TransactionArchive {
  id: string;
  dealId: string;
  projectId: string;
  projectName: string;
  buyerId: string;
  buyerName: string;
  sellerName: string;
  finalPrice: number;
  finalAmount?: number;
  currency: string;
  closingDate: string;
  offersTimeline: Offer[];
  approvalsSnapshot: ApprovalItem[];
  ndaSnapshot?: NDA;
  dueDiligenceSnapshot: DueDiligenceItem[];
  escrowReference: string;
  handoverSecretsCount: number;
  auditLogsCount: number;
  sha256ProofHash: string;
  sha256Hash?: string;
  canonicalState?: string;
  isReadOnly: true;
}

export interface BrokerageEconomics {
  id: string;
  dealId?: string;
  projectId?: string;
  dealValue: number;
  grossDealValue?: number;
  feeModel: BrokerageFeeModel;
  feePercentage: number;
  minimumFee: number;
  platformFee: number;
  sellerFee: number;
  buyerFee: number;
  estimatedRevenue: number;
  actualRevenue: number;
  aiCost: number;
  emailCost: number;
  infraCost: number;
  totalOperatingCost?: number;
  netMargin: number;
  netBrokerageProfit?: number;
  netMarginPercentage: number;
  netMarginPercent?: number;
  status: 'ESTIMATED' | 'ESCROW_HELD' | 'DISBURSED';
}

export interface ExecutiveReport {
  projectId: string;
  projectName: string;
  generatedAt: string;
  executiveSummary: string;
  assetOverview: string;
  technology: string[];
  businessModel: string;
  financialProfile: {
    monthlyRevenue: number;
    annualRevenue: number;
    profit: number;
    growth: number;
    traffic: number;
    payingCustomers: number;
  };
  market: string;
  competitiveAdvantages: string[];
  risks: string[];
  valuation: {
    recommended: number;
    rangeLow: number;
    rangeHigh: number;
    multiple: number;
  };
  targetBuyers: string[];
  buyerInterestSummary: string;
  offersSummary: string;
  negotiationStatus: string;
  dueDiligenceStatus: string;
  dealHealth: DealHealthScore;
  recommendedAction: string;
}

export interface LaunchChecklistItem {
  id: string;
  title: string;
  category: 'Environment' | 'Integrations' | 'Security & Governance' | 'Workflows';
  status: 'VERIFIED' | 'ACTION_REQUIRED';
  details: string;
}





