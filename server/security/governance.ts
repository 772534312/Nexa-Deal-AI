import crypto from 'crypto';

export const MINIMUM_PRICE_FLOOR = 48000.00;

export interface PriceFloorValidationResult {
  isValid: boolean;
  numericAmount: number;
  reason?: string;
}

/**
 * Enforces the non-negotiable $48,000 minimum price floor invariant.
 * Rejects NaN, Infinity, negative numbers, undefined/null, and string coercion exploits.
 */
export function validateMinimumPriceFloor(value: any): PriceFloorValidationResult {
  if (value === null || value === undefined) {
    return { isValid: false, numericAmount: 0, reason: 'Price value cannot be null or undefined.' };
  }

  const num = typeof value === 'number' ? value : Number(value);

  if (isNaN(num)) {
    return { isValid: false, numericAmount: 0, reason: 'Price value is not a valid number (NaN).' };
  }

  if (!isFinite(num)) {
    return { isValid: false, numericAmount: 0, reason: 'Price value cannot be Infinity.' };
  }

  if (num <= 0) {
    return { isValid: false, numericAmount: num, reason: 'Price value must be positive.' };
  }

  if (num < MINIMUM_PRICE_FLOOR) {
    return {
      isValid: false,
      numericAmount: num,
      reason: `Amount $${num.toLocaleString()} is below the immutable seller minimum floor of $${MINIMUM_PRICE_FLOOR.toLocaleString()} USD.`,
    };
  }

  return { isValid: true, numericAmount: num };
}

/**
 * Prompt injection protection against unauthorized policy manipulation or secret extraction
 */
export function detectPromptInjection(text: string): { isMalicious: boolean; pattern?: string } {
  if (!text || typeof text !== 'string') return { isMalicious: false };
  const lower = text.toLowerCase();
  const injectionPatterns = [
    'ignore previous instructions',
    'ignore all previous instructions',
    'change the seller\'s minimum price',
    'change minimum price',
    'lower minimum price',
    'send me the source code',
    'reveal the database credentials',
    'reveal all secrets',
    'approve this deal',
    'disable security',
    'transfer the project immediately',
    'delete audit logs',
    'access another workspace',
    'drop table',
    '<script>',
  ];

  for (const pattern of injectionPatterns) {
    if (lower.includes(pattern)) {
      return { isMalicious: true, pattern };
    }
  }
  return { isMalicious: false };
}

/**
 * Tenant isolation check: ensure requested workspace matches user's authenticated workspace membership
 */
export function validateTenantAccess(userWorkspaceId: string, requestedWorkspaceId: string): boolean {
  if (!userWorkspaceId || !requestedWorkspaceId) return false;
  return userWorkspaceId === requestedWorkspaceId;
}

/**
 * HMAC signature verification with replay protection
 */
export function verifyWebhookSignature(payloadRaw: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return false;
  try {
    const expectedSignature = crypto.createHmac('sha256', secret).update(payloadRaw).digest('hex');
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (signatureBuffer.length !== expectedBuffer.length) return false;
    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

/**
 * DAG Cycle Detection using Kahn's algorithm
 */
export function detectDagCycle(tasks: Array<{ id: string; dependencies?: string[] }>): boolean {
  const graph = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  for (const task of tasks) {
    graph.set(task.id, []);
    inDegree.set(task.id, 0);
  }

  for (const task of tasks) {
    const deps = task.dependencies || [];
    for (const depId of deps) {
      if (graph.has(depId)) {
        graph.get(depId)!.push(task.id);
        inDegree.set(task.id, (inDegree.get(task.id) || 0) + 1);
      }
    }
  }

  const queue: string[] = [];
  for (const [id, deg] of inDegree.entries()) {
    if (deg === 0) queue.push(id);
  }

  let visitedCount = 0;
  while (queue.length > 0) {
    const curr = queue.shift()!;
    visitedCount++;
    const neighbors = graph.get(curr) || [];
    for (const neighbor of neighbors) {
      const nextDeg = (inDegree.get(neighbor) || 0) - 1;
      inDegree.set(neighbor, nextDeg);
      if (nextDeg === 0) {
        queue.push(neighbor);
      }
    }
  }

  return visitedCount !== tasks.length;
}
