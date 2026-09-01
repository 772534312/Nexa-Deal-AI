-- ============================================================================
-- Nexa Deal AI — Core Production Database Schema (38 Business Tables)
-- ============================================================================

-- 1. Schema Migrations History Table
CREATE TABLE IF NOT EXISTS _migrations (
    id SERIAL PRIMARY KEY,
    version INTEGER NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    checksum VARCHAR(64) NOT NULL
);

-- 2. Workspaces (Tenant Boundary)
CREATE TABLE IF NOT EXISTS workspaces (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    plan VARCHAR(64) NOT NULL DEFAULT 'Enterprise',
    members_count INTEGER NOT NULL DEFAULT 1,
    active_projects_count INTEGER NOT NULL DEFAULT 0,
    monthly_ai_budget NUMERIC(12, 2) NOT NULL DEFAULT 500.00,
    used_ai_budget NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Users (RBAC)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    workspace_id VARCHAR(64) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(64) NOT NULL DEFAULT 'Member', -- Owner, Manager, Member, Viewer, Auditor
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. User Sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workspace_id VARCHAR(64) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    token_hash VARCHAR(128) NOT NULL UNIQUE,
    role VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Projects (Digital Assets)
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(64) PRIMARY KEY,
    workspace_id VARCHAR(64) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    tagline TEXT,
    description TEXT,
    category VARCHAR(64) NOT NULL,
    url TEXT,
    repository_url TEXT,
    technologies JSONB DEFAULT '[]',
    business_model TEXT,
    financials JSONB NOT NULL DEFAULT '{}',
    asking_price NUMERIC(14, 2) NOT NULL,
    minimum_price NUMERIC(14, 2) NOT NULL CHECK (minimum_price >= 48000.00), -- $48,000 Invariant Constraint
    target_price NUMERIC(14, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    country VARCHAR(100) DEFAULT 'United States',
    status VARCHAR(64) NOT NULL DEFAULT 'draft',
    visibility VARCHAR(64) NOT NULL DEFAULT 'Confidential',
    scores JSONB DEFAULT '{}',
    intelligence JSONB DEFAULT '{}',
    valuation JSONB DEFAULT '{}',
    optimization JSONB DEFAULT '{}',
    readiness_report JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Project Claims & Provenance
CREATE TABLE IF NOT EXISTS project_claims (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    field VARCHAR(100) NOT NULL,
    label VARCHAR(255) NOT NULL,
    value NUMERIC(14, 2) NOT NULL,
    status VARCHAR(64) NOT NULL DEFAULT 'PENDING',
    evidence_ref TEXT,
    verifier VARCHAR(255),
    confidence INTEGER DEFAULT 100,
    provenance JSONB DEFAULT '{}',
    verified_at TIMESTAMP WITH TIME ZONE
);

-- 7. Ownership Verifications
CREATE TABLE IF NOT EXISTS ownership_verifications (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    asset_type VARCHAR(64) NOT NULL,
    identifier TEXT NOT NULL,
    status VARCHAR(64) NOT NULL DEFAULT 'PENDING',
    evidence_ref TEXT,
    verified_at TIMESTAMP WITH TIME ZONE
);

-- 8. Buyers (Acquirers)
CREATE TABLE IF NOT EXISTS buyers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    buyer_type VARCHAR(100) NOT NULL,
    target_budget_min NUMERIC(14, 2) NOT NULL,
    target_budget_max NUMERIC(14, 2) NOT NULL,
    target_categories JSONB DEFAULT '[]',
    investment_criteria JSONB DEFAULT '{}',
    verified_funds BOOLEAN DEFAULT FALSE,
    funds_proof_url TEXT,
    quality_score JSONB DEFAULT '{}',
    status VARCHAR(64) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Buyer Matches
CREATE TABLE IF NOT EXISTS buyer_matches (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    buyer_id VARCHAR(64) NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
    overall_match_score INTEGER NOT NULL,
    fit_category VARCHAR(64) NOT NULL,
    strategic_rationale TEXT,
    ai_reasons JSONB DEFAULT '[]',
    status VARCHAR(64) DEFAULT 'PROPOSED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    channel VARCHAR(64) NOT NULL,
    target_count INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(64) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Emails & Inbound Communications
CREATE TABLE IF NOT EXISTS emails (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES projects(id) ON DELETE SET NULL,
    buyer_id VARCHAR(64) REFERENCES buyers(id) ON DELETE SET NULL,
    campaign_id VARCHAR(64) REFERENCES campaigns(id) ON DELETE SET NULL,
    sender VARCHAR(255) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    snippet TEXT,
    body TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_inbound BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(64) DEFAULT 'SENT',
    ai_classification JSONB DEFAULT '{}'
);

-- 12. Deals
CREATE TABLE IF NOT EXISTS deals (
    id VARCHAR(64) PRIMARY KEY,
    workspace_id VARCHAR(64) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    buyer_id VARCHAR(64) NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
    stage VARCHAR(64) NOT NULL DEFAULT 'DISCOVERY',
    current_offer_amount NUMERIC(14, 2) NOT NULL,
    target_amount NUMERIC(14, 2) NOT NULL,
    nda_signed BOOLEAN DEFAULT FALSE,
    vdr_access_granted BOOLEAN DEFAULT FALSE,
    escrow_status VARCHAR(64) DEFAULT 'NOT_INITIATED',
    health_score JSONB DEFAULT '{}',
    closing_probability JSONB DEFAULT '{}',
    archive_hash VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Offers (Immutable Historical Ledger)
CREATE TABLE IF NOT EXISTS offers (
    id VARCHAR(64) PRIMARY KEY,
    deal_id VARCHAR(64) NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    buyer_id VARCHAR(64) NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
    amount NUMERIC(14, 2) NOT NULL CHECK (amount >= 48000.00), -- $48,000 Floor Enforcement
    currency VARCHAR(10) DEFAULT 'USD',
    type VARCHAR(64) NOT NULL, -- INBOUND_INITIAL, COUNTER_OFFER, FINAL_BINDING
    terms TEXT,
    escrow_percentage NUMERIC(5, 2) DEFAULT 100.00,
    diligence_period_days INTEGER DEFAULT 14,
    status VARCHAR(64) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Approvals (HITL Governance Center)
CREATE TABLE IF NOT EXISTS approvals (
    id VARCHAR(64) PRIMARY KEY,
    workspace_id VARCHAR(64) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(64) NOT NULL,
    severity VARCHAR(64) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(64) NOT NULL DEFAULT 'PENDING',
    requested_by VARCHAR(255) NOT NULL,
    resolved_by VARCHAR(255),
    resolved_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Virtual Data Room (VDR) Folders & Files
CREATE TABLE IF NOT EXISTS vdr_folders (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    parent_folder_id VARCHAR(64) REFERENCES vdr_folders(id),
    min_permission_tier VARCHAR(64) NOT NULL DEFAULT 'TIER_1_NDA'
);

CREATE TABLE IF NOT EXISTS vdr_files (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    folder_id VARCHAR(64) REFERENCES vdr_folders(id),
    name VARCHAR(255) NOT NULL,
    file_type VARCHAR(64) NOT NULL,
    size_bytes BIGINT NOT NULL,
    min_permission VARCHAR(64) NOT NULL DEFAULT 'TIER_1_NDA',
    encryption_status VARCHAR(64) DEFAULT 'AES_256_GCM_ENCRYPTED',
    sha256_checksum VARCHAR(64) NOT NULL,
    object_id VARCHAR(128) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vdr_access_logs (
    id VARCHAR(64) PRIMARY KEY,
    file_id VARCHAR(64) NOT NULL REFERENCES vdr_files(id) ON DELETE CASCADE,
    user_id VARCHAR(64),
    viewer_email VARCHAR(255) NOT NULL,
    action VARCHAR(64) NOT NULL,
    watermark_applied VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. Non-Disclosure Agreements (NDAs)
CREATE TABLE IF NOT EXISTS ndas (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    buyer_id VARCHAR(64) NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
    status VARCHAR(64) NOT NULL DEFAULT 'PENDING',
    signed_at TIMESTAMP WITH TIME ZONE,
    signer_name VARCHAR(255),
    signer_ip VARCHAR(100),
    nda_text TEXT NOT NULL,
    sha256_hash VARCHAR(64) NOT NULL
);

-- 17. Due Diligence Items
CREATE TABLE IF NOT EXISTS due_diligence (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    category VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(64) NOT NULL DEFAULT 'PENDING',
    assigned_to VARCHAR(255),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 18. Handover Secrets Vault (One-Time Reveal with 15-min TTL)
CREATE TABLE IF NOT EXISTS handover_secrets (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    category VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    encrypted_secret TEXT NOT NULL,
    one_time_token_hash VARCHAR(128) NOT NULL UNIQUE,
    revealed_at TIMESTAMP WITH TIME ZONE,
    revealed_by VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_revealed BOOLEAN NOT NULL DEFAULT FALSE,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE
);

-- 19. Seller Governance Policies (Immutable by AI)
CREATE TABLE IF NOT EXISTS seller_policies (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
    minimum_price_floor NUMERIC(14, 2) NOT NULL CHECK (minimum_price_floor >= 48000.00),
    target_price NUMERIC(14, 2) NOT NULL,
    max_discount_percent NUMERIC(5, 2) NOT NULL DEFAULT 15.00,
    nda_required BOOLEAN NOT NULL DEFAULT TRUE,
    escrow_required BOOLEAN NOT NULL DEFAULT TRUE,
    autonomous_negotiation_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 20. Audit Logs (Append-Only Immutable System Ledger)
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    workspace_id VARCHAR(64) NOT NULL,
    actor VARCHAR(255) NOT NULL,
    actor_type VARCHAR(64) NOT NULL, -- USER, AGENT, SYSTEM
    action VARCHAR(255) NOT NULL,
    target VARCHAR(255) NOT NULL,
    tool VARCHAR(100),
    details TEXT,
    result VARCHAR(64) NOT NULL DEFAULT 'SUCCESS',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 21. Risk Events
CREATE TABLE IF NOT EXISTS risk_events (
    id VARCHAR(64) PRIMARY KEY,
    deal_id VARCHAR(64) REFERENCES deals(id) ON DELETE CASCADE,
    severity VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    action_taken TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 22. Missions & Multi-Agent DAGs
CREATE TABLE IF NOT EXISTS missions (
    id VARCHAR(64) PRIMARY KEY,
    workspace_id VARCHAR(64) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    objective TEXT NOT NULL,
    status VARCHAR(64) NOT NULL DEFAULT 'IN_PROGRESS',
    tasks JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 23. Handover Milestones & Day Plans
CREATE TABLE IF NOT EXISTS closing_milestones (
    id VARCHAR(64) PRIMARY KEY,
    deal_id VARCHAR(64) NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    status VARCHAR(64) NOT NULL DEFAULT 'PENDING',
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 24. Transaction Archives (Deterministic SHA-256 Digest)
CREATE TABLE IF NOT EXISTS transaction_archives (
    id VARCHAR(64) PRIMARY KEY,
    deal_id VARCHAR(64) NOT NULL UNIQUE REFERENCES deals(id) ON DELETE CASCADE,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    buyer_id VARCHAR(64) NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
    final_amount NUMERIC(14, 2) NOT NULL,
    sha256_hash VARCHAR(64) NOT NULL,
    canonical_state JSONB NOT NULL,
    sealed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 25. Webhook Events (Idempotency and Replay Defense)
CREATE TABLE IF NOT EXISTS webhook_events (
    id VARCHAR(64) PRIMARY KEY,
    provider VARCHAR(64) NOT NULL, -- ESCROW, STRIPE, SENDGRID, GITHUB
    event_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(64) NOT NULL DEFAULT 'PROCESSED',
    signature VARCHAR(255),
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    error TEXT,
    CONSTRAINT uq_webhook_provider_event UNIQUE (provider, event_id)
);

-- 26. Brokerage Economics Ledger
CREATE TABLE IF NOT EXISTS brokerage_economics (
    id VARCHAR(64) PRIMARY KEY,
    deal_id VARCHAR(64) NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    gross_deal_value NUMERIC(14, 2) NOT NULL,
    success_fee_percent NUMERIC(5, 2) NOT NULL DEFAULT 5.00,
    platform_fee NUMERIC(14, 2) NOT NULL,
    ai_operating_cost NUMERIC(14, 2) NOT NULL DEFAULT 48.20,
    email_operating_cost NUMERIC(14, 2) NOT NULL DEFAULT 12.50,
    infra_operating_cost NUMERIC(14, 2) NOT NULL DEFAULT 35.00,
    total_operating_cost NUMERIC(14, 2) NOT NULL,
    net_brokerage_profit NUMERIC(14, 2) NOT NULL,
    net_margin_percent NUMERIC(5, 2) NOT NULL,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high-performance tenant isolation and query speed
CREATE INDEX IF NOT EXISTS idx_projects_workspace ON projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_deals_workspace ON deals(workspace_id);
CREATE INDEX IF NOT EXISTS idx_approvals_workspace ON approvals(workspace_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_workspace ON audit_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_webhook_events_lookup ON webhook_events(provider, event_id);
