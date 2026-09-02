import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('server.ts');
let source = fs.readFileSync(file, 'utf8');

function replaceOnce(label, oldText, newText) {
  if (!source.includes(oldText)) throw new Error(`[Nexa auth routes] Missing pattern: ${label}`);
  source = source.replace(oldText, newText);
}

replaceOnce(
  'register response token exposure',
  "res.status(201).json({ user: { ...user, passwordHash: undefined }, workspace, token });",
  "res.status(201).json({ user: { ...user, passwordHash: undefined }, workspace });"
);
replaceOnce(
  'login response token exposure',
  "res.json({ user: { ...user, passwordHash: undefined }, workspace: db.workspaces.find(w => w.id === user.workspaceId), token });",
  "res.json({ user: { ...user, passwordHash: undefined }, workspace: db.workspaces.find(w => w.id === user.workspaceId) });"
);

replaceOnce(
  'logout bearer-only token extraction',
  "  const auth = String(req.headers.authorization || '');\n  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';\n  if (token) revokeSession(db, token);",
  "  const auth = String(req.headers.authorization || '');\n  const cookieHeader = String(req.headers.cookie || '');\n  const cookieMatch = cookieHeader.match(/(?:^|;\\s*)nexa_session=([^;]+)/);\n  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : (cookieMatch ? decodeURIComponent(cookieMatch[1]) : '');\n  if (token) revokeSession(db, token);"
);

replaceOnce(
  'session bearer-only validation',
  "  const auth = String(req.headers.authorization || '');\n  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';\n  if (!token) return res.status(401).json({ authenticated: false });\n  const session = authenticateRequest(req, db);",
  "  const session = authenticateRequest(req, db);"
);

fs.writeFileSync(file, source, 'utf8');
console.log('[Nexa auth routes] Cookie session routes hardened.');
