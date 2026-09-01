import crypto from 'node:crypto';
import type { Request } from 'express';
import type { DatabaseState, UserSessionRecord } from '../db/types';

const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

function hash(value: string): string {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

export function hashPassword(password: string): string {
  if (typeof password !== 'string' || password.length < 10 || password.length > 256) {
    throw new Error('Password must be between 10 and 256 characters.');
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

export function verifyPassword(password: string, encoded: string): boolean {
  try {
    const [scheme, salt, expectedHex] = String(encoded || '').split('$');
    if (scheme !== 'scrypt' || !salt || !expectedHex) return false;
    const actual = crypto.scryptSync(password, salt, 64);
    const expected = Buffer.from(expectedHex, 'hex');
    return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function createSession(state: DatabaseState, userId: string, workspaceId: string, role: string): string {
  const token = crypto.randomBytes(32).toString('base64url');
  const now = new Date();
  const record: UserSessionRecord = {
    id: `sess-${crypto.randomUUID()}`,
    userId,
    workspaceId,
    tokenHash: hash(token),
    role,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_TTL_MS).toISOString(),
    revoked: false,
    lastActivity: now.toISOString(),
  };
  state.sessions = Array.isArray(state.sessions) ? state.sessions : [];
  state.sessions.push(record);
  return token;
}

export function revokeSession(state: DatabaseState, token: string): void {
  const tokenHash = hash(token);
  const session = state.sessions?.find(s => s.tokenHash === tokenHash);
  if (session) session.revoked = true;
}

export function authenticateRequest(req: Request, state: DatabaseState): { user: any; workspace: any; session: UserSessionRecord } | null {
  const auth = String(req.headers.authorization || '');
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token) return null;

  const tokenHash = hash(token);
  const session = state.sessions?.find(s => s.tokenHash === tokenHash && !s.revoked);
  if (!session || Date.parse(session.expiresAt) <= Date.now()) {
    if (session) session.revoked = true;
    return null;
  }

  const user = state.users.find(u => u.id === session.userId && u.workspaceId === session.workspaceId);
  const workspace = state.workspaces.find(w => w.id === session.workspaceId);
  if (!user || !workspace) return null;

  session.lastActivity = new Date().toISOString();
  return { user, workspace, session };
}

export function sessionCookie(token: string): string {
  return `nexa_session=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`;
}

export function clearSessionCookie(): string {
  return 'nexa_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0';
}
