import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('server.ts');
let source = fs.readFileSync(file, 'utf8');

if (source.includes('NEXA_AUTH_HARDENING_APPLIED')) {
  console.log('[Nexa auth] server.ts is already auth-hardened.');
  process.exit(0);
}

function replaceOnce(label, pattern, replacement) {
  if (!source.includes(pattern)) throw new Error(`[Nexa auth] Required pattern not found: ${label}`);
  source = source.replace(pattern, replacement);
}

replaceOnce(
  'auth import',
  "import { verifyWebhookSignature, validateMinimumPriceFloor } from './server/security/governance';",
  "import { verifyWebhookSignature, validateMinimumPriceFloor } from './server/security/governance';\nimport { authenticateRequest, clearSessionCookie, createSession, hashPassword, revokeSession, sessionCookie, verifyPassword } from './server/security/auth';\n/* NEXA_AUTH_HARDENING_APPLIED */"
);

replaceOnce(
  'workspace helper',
  "function getWorkspaceId(req: Request): string {\n  return (req.headers['x-workspace-id'] as string) || 'ws-1';\n}",
  "function getWorkspaceId(req: Request): string {\n  const workspaceId = req.headers['x-workspace-id'];\n  if (typeof workspaceId !== 'string' || !workspaceId) throw new Error('Authenticated workspace context missing.');\n  return workspaceId;\n}"
);

replaceOnce(
  'actor helper',
  "function getActorInfo(req: Request): { actor: string; actorType: 'USER' | 'AGENT' | 'SYSTEM'; role: string } {\n  const actor = (req.headers['x-actor-name'] as string) || 'Founder (Farhan Al-Mansoor)';\n  const actorType = (req.headers['x-actor-type'] as 'USER' | 'AGENT' | 'SYSTEM') || 'USER';\n  const role = (req.headers['x-user-role'] as string) || 'Owner';\n  return { actor, actorType, role };\n}",
  "function getActorInfo(req: Request): { actor: string; actorType: 'USER' | 'AGENT' | 'SYSTEM'; role: string } {\n  const actor = String(req.headers['x-actor-name'] || 'Authenticated User');\n  const actorType = (req.headers['x-actor-type'] as 'USER' | 'AGENT' | 'SYSTEM') || 'USER';\n  const role = String(req.headers['x-user-role'] || 'USER');\n  return { actor, actorType, role };\n}"
);

const authBlock = `\n// -------------------------------------------------------------\n// AUTHENTICATION / SESSION SECURITY\n// -------------------------------------------------------------\napp.post('/api/auth/register', (req: Request, res: Response) => {\n  const email = String(req.body?.email || '').trim().toLowerCase();\n  const password = String(req.body?.password || '');\n  const name = String(req.body?.legalName || req.body?.name || '').trim();\n  const workspaceName = String(req.body?.workspaceName || `${'Seller'} Workspace`).trim();\n\n  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return res.status(400).json({ error: 'INVALID_EMAIL' });\n  if (!name || name.length < 2 || name.length > 120) return res.status(400).json({ error: 'INVALID_NAME' });\n  if (password.length < 10 || password.length > 256) return res.status(400).json({ error: 'WEAK_PASSWORD', message: 'Password must be at least 10 characters.' });\n  if (db.users.some(u => String(u.email).toLowerCase() === email)) return res.status(409).json({ error: 'EMAIL_ALREADY_REGISTERED' });\n\n  const now = new Date().toISOString();\n  const workspaceId = `ws-${crypto.randomUUID()}`;\n  const userId = `usr-${crypto.randomUUID()}`;\n  const workspace = { id: workspaceId, name: workspaceName || 'Seller Workspace', slug: `seller-${userId.slice(-8)}`, plan: 'Free', membersCount: 1, activeProjectsCount: 0, monthlyAiBudget: 25, usedAiBudget: 0, createdAt: now };\n  const user: any = { id: userId, name, email, role: 'SELLER', workspaceId, createdAt: now, verifiedIdentity: false, legalName: name, corporateEmail: email };\n  user.passwordHash = hashPassword(password);\n  db.workspaces.push(workspace as any);\n  db.users.push(user);\n  const token = createSession(db, userId, workspaceId, user.role);\n  persistDb();\n  res.setHeader('Set-Cookie', sessionCookie(token));\n  res.status(201).json({ user: { ...user, passwordHash: undefined }, workspace, token });\n});\n\napp.post('/api/auth/login', (req: Request, res: Response) => {\n  const email = String(req.body?.email || '').trim().toLowerCase();\n  const password = String(req.body?.password || '');\n  const user: any = db.users.find(u => String(u.email).toLowerCase() === email);\n  if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) return res.status(401).json({ error: 'INVALID_CREDENTIALS' });\n  const token = createSession(db, user.id, user.workspaceId, user.role);\n  persistDb();\n  res.setHeader('Set-Cookie', sessionCookie(token));\n  res.json({ user: { ...user, passwordHash: undefined }, workspace: db.workspaces.find(w => w.id === user.workspaceId), token });\n});\n\napp.post('/api/auth/logout', (req: Request, res: Response) => {\n  const auth = String(req.headers.authorization || '');\n  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';\n  if (token) revokeSession(db, token);\n  persistDb();\n  res.setHeader('Set-Cookie', clearSessionCookie());\n  res.json({ success: true });\n});\n\napp.get('/api/auth/session', (req: Request, res: Response) => {\n  const auth = String(req.headers.authorization || '');\n  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';\n  if (!token) return res.status(401).json({ authenticated: false });\n  const session = authenticateRequest(req, db);\n  if (!session) return res.status(401).json({ authenticated: false });\n  res.json({ authenticated: true, user: session.user, workspace: session.workspace });\n});\n\n// Establish authenticated identity before every protected API route.\napp.use('/api', (req: Request, res: Response, next) => {\n  const publicPath = req.path === '/health' || req.path === '/system/health' || req.path === '/system/readiness' || req.path === '/auth/register' || req.path === '/auth/login' || req.path === '/auth/logout' || req.path === '/auth/session' || req.path === '/escrow/webhook';\n  if (publicPath) return next();\n\n  if (!req.headers.authorization) {\n    const cookieHeader = String(req.headers.cookie || '');\n    const match = cookieHeader.match(/(?:^|;\\s*)nexa_session=([^;]+)/);\n    if (match) req.headers.authorization = `Bearer ${decodeURIComponent(match[1])}`;\n  }\n\n  const identity = authenticateRequest(req, db);\n  if (!identity) return res.status(401).json({ error: 'AUTHENTICATION_REQUIRED', message: 'A valid server-issued session is required.' });\n\n  req.headers['x-user-id'] = identity.user.id;\n  req.headers['x-workspace-id'] = identity.workspace.id;\n  req.headers['x-user-role'] = identity.session.role;\n  req.headers['x-actor-name'] = identity.user.name;\n  req.headers['x-actor-type'] = 'USER';\n\n  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && req.headers.cookie && !req.headers.authorization?.startsWith('Bearer ')) {\n    return res.status(403).json({ error: 'INVALID_SESSION_CONTEXT' });\n  }\n  next();\n});\n`;

replaceOnce('auth insertion point', "app.use(express.urlencoded({ extended: true, limit: '10mb' }));", "app.use(express.urlencoded({ extended: true, limit: '10mb' }));\n" + authBlock);

replaceOnce(
  'current user fallback',
  "  const wsId = getWorkspaceId(req);\n  const user = db.users.find(u => u.workspaceId === wsId) || db.users[0];\n  const workspace = db.workspaces.find(w => w.id === wsId) || db.workspaces[0];",
  "  const wsId = getWorkspaceId(req);\n  const user = db.users.find(u => u.workspaceId === wsId);\n  const workspace = db.workspaces.find(w => w.id === wsId);\n  if (!user || !workspace) return res.status(404).json({ error: 'AUTHENTICATED_WORKSPACE_NOT_FOUND' });"
);

const roleRoute = `app.post('/api/users/switch-role', (req: Request, res: Response) => {\n  const { role } = req.body;\n  if (db.users[0]) {\n    db.users[0].role = role;\n  }\n  res.json({ success: true, user: db.users[0] });\n});`;
replaceOnce('unsafe role switching', roleRoute, `app.post('/api/users/switch-role', (_req: Request, res: Response) => {\n  return res.status(403).json({ error: 'ROLE_CHANGE_FORBIDDEN', message: 'Roles are assigned by the authenticated account and cannot be changed from the client.' });\n});`);

source = source.replace(/buyerId: 'buyer-1',/g, "buyerId: buyerId || '',");
source = source.replace(/const PORT = 3000;/, "const PORT = Number(process.env.PORT || 3000);");

fs.writeFileSync(file, source, 'utf8');
console.log('[Nexa auth] server.ts authentication hardened successfully.');
