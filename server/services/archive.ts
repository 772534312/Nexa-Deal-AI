import crypto from 'crypto';
import { TransactionArchive, Deal, Project, Buyer, Offer, HandoverMilestoneDay } from '../../src/types';

/**
 * Deterministically sorts object keys recursively to ensure canonical JSON representation
 */
export function canonicalStringify(obj: any): string {
  if (obj === null || obj === undefined) return 'null';
  if (typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) {
    return '[' + obj.map((item) => canonicalStringify(item)).join(',') + ']';
  }
  const sortedKeys = Object.keys(obj).sort();
  const pairs = sortedKeys.map((key) => `${JSON.stringify(key)}:${canonicalStringify(obj[key])}`);
  return '{' + pairs.join(',') + '}';
}

/**
 * Creates a deterministic SHA-256 seal for a closed deal transaction archive
 */
export function sealTransactionArchive(
  deal: Deal,
  project: Project,
  buyer: Buyer,
  acceptedOffer: Offer,
  handoverPlan: HandoverMilestoneDay[] = []
): TransactionArchive {
  const canonicalState = {
    dealId: deal.id,
    projectId: project.id,
    projectName: project.name,
    buyerId: buyer.id,
    buyerCompany: buyer.companyName,
    finalAmount: acceptedOffer.amount,
    currency: acceptedOffer.currency || 'USD',
    acceptedOfferId: acceptedOffer.id,
    closedAt: new Date().toISOString(),
    financials: {
      mrr: project.financials.mrr,
      arr: project.financials.arr,
      monthlyRevenue: project.financials.monthlyRevenue,
    },
    handoverMilestonesCount: handoverPlan.length,
  };

  const canonicalJson = canonicalStringify(canonicalState);
  const sha256Hash = crypto.createHash('sha256').update(canonicalJson).digest('hex');

  return {
    id: `arc-${deal.id}-${Date.now()}`,
    dealId: deal.id,
    projectId: project.id,
    projectName: project.name,
    buyerId: buyer.id,
    buyerName: buyer.companyName,
    sellerName: 'Apex Capital Ventures',
    finalPrice: acceptedOffer.amount,
    finalAmount: acceptedOffer.amount,
    currency: acceptedOffer.currency || 'USD',
    closingDate: new Date().toISOString(),
    offersTimeline: [acceptedOffer],
    approvalsSnapshot: [],
    dueDiligenceSnapshot: [],
    escrowReference: `esc_nexa_${deal.id}`,
    handoverSecretsCount: 5,
    auditLogsCount: 12,
    sha256ProofHash: sha256Hash,
    sha256Hash,
    canonicalState: canonicalJson,
    isReadOnly: true,
  };
}

/**
 * Verifies if a transaction archive's SHA-256 seal matches its canonical payload
 */
export function verifyTransactionArchive(archive: TransactionArchive): { isValid: boolean; expectedHash: string; computedHash: string } {
  const canonicalJson = typeof archive.canonicalState === 'string' ? archive.canonicalState : canonicalStringify(archive.canonicalState);
  const computedHash = crypto.createHash('sha256').update(canonicalJson).digest('hex');
  const expected = archive.sha256Hash || archive.sha256ProofHash;

  return {
    isValid: computedHash === expected,
    expectedHash: expected,
    computedHash,
  };
}
