import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('server.ts');
let source = fs.readFileSync(file, 'utf8');

if (source.includes('NEXA_AUTH_HARDENING_APPLIED')) {
  console.log('[Nexa auth] server.ts is already auth-hardened.');
  process.exit(0);
}

function replaceOnce(label, pattern, replacement) {
  if (!source.includes(pattern)) {
    throw new Error('[Nexa auth] Required pattern not found: ' + label);
  }
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

const authBlock = `
// -------------------------------------------------------------
// AUTHENTICATION / SESSION SECURITY
// -------------------------------------------------------------
app.post('/api/auth/register', (req: Request, res: Response) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const name = String(req.body?.legalName || req.body?.name || '').trim();
  const workspaceName = String(req.body?.workspaceName || 'Seller Workspace').trim();

  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return res.status(400).json({ error: 'INVALID_EMAIL' });
  if (!name || name.length < 2 || name.length > 120) return res.status(400).json({ error: 'INVALID_NAME' });
  if (password.length < 10 || password.length > 256) return res.status(400).json({ error: 'WEAK_PASSWORD', message: 'Password must be at least 10 characters.' });
  if (db.users.some(u => String(u.email).toLowerCase() === email)) return res.status(409).json({ error: 'EMAIL_ALREADY_REGISTERED' });

  const now = new Date().toISOString();
  const workspaceId = 'ws-' + crypto.randomUUID();
  const userId = 'usr-' + crypto.randomUUID();
  const workspace = { id: workspaceId, name: workspaceName || 'Seller Workspace', slug: 'seller-' + userId.slice(-8), plan: 'Free', membersCount: 1, activeProjectsCount: 0, monthlyAiBudget: 25, usedAiBudget: 0, createdAt: now };
  const user: any = { id: userId, name, email, role: 'SELLER', workspaceId, createdAt: now, verifiedIdentity: false, legalName: name, corporateEmail: email };
  user.passwordHash = hashPassword(password);
  db.workspaces.push(workspace as any);
  db.users.push(user);
  const token = createSession(db, userId, workspaceId, user.role);
  persistDb();
  res.setHeader('Set-Cookie', sessionCookie(token));
  res.status(201).json({ user: { ...user, passwordHash: undefined }, workspace });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const user: any = db.users.find(u => String(u.email).toLowerCase() === email);
  if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
  const token = createSession(db, user.id, user.workspaceId, user.role);
  persistDb();
  res.setHeader('Set-Cookie', sessionCookie(token));
  res.json({ user: { ...user, passwordHash: undefined }, workspace: db.workspaces.find(w => w.id === user.workspaceId) });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const auth = String(req.headers.authorization || '');
  const cookieHeader = String(req.headers.cookie || '');
  const cookieMatch = cookieHeader.match(/(?:^|;\\s*)nexa_session=([^;]+)/);
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : (cookieMatch ? decodeURIComponent(cookieMatch[1]) : '');
  if (token) revokeSession(db, token);
  persistDb();
  res.setHeader('Set-Cookie', clearSessionCookie());
  res.json({ success: true });
});

app.get('/api/auth/session', (req: Request, res: Response) => {
  const session = authenticateRequest(req, db);
  if (!session) return res.status(401).json({ authenticated: false });
  res.json({ authenticated: true, user: session.user, workspace: session.workspace });
});

app.use('/api', (req: Request, res: Response, next) => {
  const publicPath = req.path === '/health' || req.path === '/system/health' || req.path === '/system/readiness' || req.path === '/auth/register' || req.path === '/auth/login' || req.path === '/auth/logout' || req.path === '/auth/session' || req.path === '/escrow/webhook';
  if (publicPath) return next();

  const identity = authenticateRequest(req, db);
  if (!identity) return res.status(401).json({ error: 'AUTHENTICATION_REQUIRED', message: 'A valid server-issued session is required.' });

  req.headers['x-user-id'] = identity.user.id;
  req.headers['x-workspace-id'] = identity.workspace.id;
  req.headers['x-user-role'] = identity.session.role;
  req.headers['x-actor-name'] = identity.user.name;
  req.headers['x-actor-type'] = 'USER';
  next();
});
`;

replaceOnce(
  'auth insertion point',
  "app.use(express.urlencoded({ extended: true, limit: '10mb' }));",
  "app.use(express.urlencoded({ extended: true, limit: '10mb' }));\n" + authBlock
);

replaceOnce(
  'current user fallback',
  "  const wsId = getWorkspaceId(req);\n  const user = db.users.find(u => u.workspaceId === wsId) || db.users[0];\n  const workspace = db.workspaces.find(w => w.id === wsId) || db.workspaces[0];",
  "  const wsId = getWorkspaceId(req);\n  const user = db.users.find(u => u.workspaceId === wsId);\n  const workspace = db.workspaces.find(w => w.id === wsId);\n  if (!user || !workspace) return res.status(404).json({ error: 'AUTHENTICATED_WORKSPACE_NOT_FOUND' });"
);

const roleRoute = "app.post('/api/users/switch-role', (req: Request, res: Response) => {\n  const { role } = req.body;\n  if (db.users[0]) {\n    db.users[0].role = role;\n  }\n  res.json({ success: true, user: db.users[0] });\n});";
replaceOnce(
  'unsafe role switching',
  roleRoute,
  "app.post('/api/users/switch-role', (_req: Request, res: Response) => {\n  return res.status(403).json({ error: 'ROLE_CHANGE_FORBIDDEN', message: 'Roles are assigned by the authenticated account and cannot be changed from the client.' });\n});"
);

source = source.replace(/buyerId: 'buyer-1',/g, "buyerId: buyerId || '',");
source = source.replace(/const PORT = 3000;/, "const PORT = Number(process.env.PORT || 3000);");

fs.writeFileSync(file, source, 'utf8');
console.log('[Nexa auth] server.ts authentication hardened successfully.');
