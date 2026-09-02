import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('server.ts');
let source = fs.readFileSync(file, 'utf8');

if (source.includes('NEXA_HARDENING_APPLIED')) {
  console.log('[Nexa hardening] server.ts is already hardened.');
  process.exit(0);
}

const original = source;

function replaceOnce(label, pattern, replacement) {
  if (!source.includes(pattern)) {
    throw new Error(`[Nexa hardening] Required source pattern not found: ${label}`);
  }
  source = source.replace(pattern, replacement);
}

replaceOnce(
  'governance import',
  "import { DealStage, Offer, RiskEvent, VdrAccessLog, VdrPermission } from './src/types';",
  "import { DealStage, Offer, RiskEvent, VdrAccessLog, VdrPermission } from './src/types';\nimport { verifyWebhookSignature, validateMinimumPriceFloor } from './server/security/governance';\n/* NEXA_HARDENING_APPLIED */"
);

replaceOnce(
  'raw request body capture',
  "app.use(express.json({ limit: '10mb' }));",
  "app.use(express.json({ limit: '10mb', verify: (req, _res, buf) => { (req as Request & { rawBody?: string }).rawBody = buf.toString('utf8'); } }));"
);

replaceOnce(
  'onboarding price defaults',
  "  const effectiveMin = Math.max(minimumPrice || 48000, 48000);\n  const effectiveAsking = askingPrice || Math.round(effectiveMin * 1.35);\n  const effectiveTarget = targetPrice || Math.round(effectiveMin * 1.15);\n\n  const mrrVal = Number(mrr || monthlyRevenue || 0);\n  const arrVal = Number(arr || annualRevenue || mrrVal * 12);\n  const profitVal = Number(monthlyProfit || mrrVal * 0.7);",
  "  const numericMinimum = Number(minimumPrice);\n  const numericAsking = Number(askingPrice);\n  const numericTarget = Number(targetPrice);\n  const effectiveMin = numericMinimum;\n  const effectiveAsking = numericAsking;\n  const effectiveTarget = numericTarget;\n\n  if (!Number.isFinite(effectiveMin) || !Number.isFinite(effectiveAsking) || !Number.isFinite(effectiveTarget)) {\n    return res.status(400).json({ error: 'INVALID_PRICING', message: 'Minimum, target, and asking prices must be explicitly supplied as finite numbers.' });\n  }\n\n  const floorCheck = validateMinimumPriceFloor(effectiveMin);\n  if (!floorCheck.isValid || effectiveTarget < effectiveMin || effectiveAsking < effectiveMin) {\n    return res.status(400).json({ error: 'INVALID_PRICING', message: floorCheck.reason || 'Target and asking prices cannot be below the seller minimum floor.' });\n  }\n\n  const mrrVal = Number(mrr ?? monthlyRevenue ?? 0);\n  const arrVal = Number(arr ?? annualRevenue ?? 0);\n  const profitVal = Number(monthlyProfit ?? 0);"
);

replaceOnce(
  'onboarding synthetic readiness',
  "  const legalIpReadiness = 90;\n  const analyticsReadiness = monthlyTraffic > 1000 ? 88 : 60;\n  const documentationReadiness = description && description.length > 50 ? 85 : 60;\n  const buyerAppeal = Math.min(96, Math.max(50, Math.round((financialReadiness + technicalReadiness) / 2)));\n  const marketability = 88;\n  const riskScore = churnRate && Number(churnRate) > 5 ? 35 : 15;",
  "  const legalIpReadiness = repositoryUrl ? 50 : 0;\n  const analyticsReadiness = monthlyTraffic > 0 ? 50 : 0;\n  const documentationReadiness = description && description.length > 50 ? 50 : 0;\n  const buyerAppeal = Math.min(70, Math.max(0, Math.round((financialReadiness + technicalReadiness) / 3)));\n  const marketability = targetMarket ? 50 : 0;\n  const riskScore = churnRate && Number(churnRate) > 5 ? 35 : 15;"
);

replaceOnce(
  'escrow webhook signature bypass',
  "  // 1. Verify HMAC signature\n  if (!signature || (signature !== 'valid-escrow-signature-2026' && !signature.startsWith('sha256='))) {\n    logAuditEvent(wsId, 'Escrow Gateway', 'SYSTEM', 'ESCROW_WEBHOOK_REJECTED', 'Escrow.com', 'Rejected untrusted webhook: Invalid or missing HMAC signature.', 'DENIED');\n    return res.status(401).json({ error: 'INVALID_SIGNATURE', message: 'Webhook signature verification failed. SHA-256 HMAC invalid.' });\n  }",
  "  // 1. Verify HMAC signature against the exact raw request body.\n  const webhookSecret = process.env.ESCROW_WEBHOOK_SECRET;\n  const rawBody = (req as Request & { rawBody?: string }).rawBody || JSON.stringify(req.body);\n  if (!webhookSecret || !verifyWebhookSignature(rawBody, signature || '', webhookSecret)) {\n    logAuditEvent(wsId, 'Escrow Gateway', 'SYSTEM', 'ESCROW_WEBHOOK_REJECTED', 'Escrow.com', 'Rejected untrusted webhook: invalid/missing HMAC signature or server secret.', 'DENIED');\n    return res.status(401).json({ error: 'INVALID_SIGNATURE', message: 'Webhook signature verification failed.' });\n  }"
);

source = source.replace(/find\(p => p\.id === projectId && p\.workspaceId === wsId\) \|\| db\.projects\[0\]/g, "find(p => p.id === projectId && p.workspaceId === wsId)");
source = source.replace(/find\(b => b\.id === buyerId && b\.workspaceId === wsId\) \|\| db\.buyers\[0\]/g, "find(b => b.id === buyerId && b.workspaceId === wsId)");
source = source.replace(/\|\| db\.transactionChecklists\['deal-1'\]/g, '');
source = source.replace(/\|\| db\.handoverPlans\['deal-1'\]/g, '');
source = source.replace(/\|\| db\.transactionArchives\[0\]/g, '');

const stressGuard = "\napp.use('/api/controlled-transaction/run-stress-test', (req: Request, res: Response, next) => {\n  if ((process.env.NODE_ENV === 'production' || process.env.RENDER === 'true') && process.env.NEXA_ENABLE_STRESS_TEST !== 'true') {\n    return res.status(403).json({ error: 'STRESS_TEST_DISABLED', message: 'Synthetic transaction stress tests are disabled in production.' });\n  }\n  next();\n});\n";
const liveGuard = "\napp.use('/api/commercial/mode', (req: Request, res: Response, next) => {\n  if (req.method === 'POST' && (process.env.NODE_ENV === 'production' || process.env.RENDER === 'true') && process.env.NEXA_ALLOW_LIVE_MODE !== 'true') {\n    return res.status(403).json({ error: 'LIVE_MODE_LOCKED', message: 'Commercial mode changes are locked in production until the deployment owner enables them explicitly.' });\n  }\n  next();\n});\n";
replaceOnce(
  'production guards insertion point',
  "app.use(express.urlencoded({ extended: true, limit: '10mb' }));",
  "app.use(express.urlencoded({ extended: true, limit: '10mb' }));" + stressGuard + liveGuard
);

if (source === original) {
  throw new Error('[Nexa hardening] No source changes were produced.');
}

fs.writeFileSync(file, source, 'utf8');
console.log('[Nexa hardening] server.ts hardened successfully.');
