import fs from 'node:fs';

const path = 'server.ts';
let s = fs.readFileSync(path, 'utf8');
const changes = [];

function replaceOnce(label, from, to) {
  const count = s.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected exactly 1 match, found ${count}`);
  s = s.replace(from, to);
  changes.push(label);
}

replaceOnce(
  'remove negotiation project fallback',
  "  const project = db.projects.find(p => p.id === projectId && p.workspaceId === wsId) || db.projects[0];\n  const buyer = db.buyers.find(b => b.id === buyerId && b.workspaceId === wsId) || db.buyers[0];\n",
  "  const project = db.projects.find(p => p.id === projectId && p.workspaceId === wsId);\n  const buyer = db.buyers.find(b => b.id === buyerId && b.workspaceId === wsId);\n\n  if (!project || !buyer) {\n    return res.status(404).json({ error: 'PROJECT_OR_BUYER_NOT_FOUND', message: 'Project or buyer not found in the active workspace.' });\n  }\n"
);

replaceOnce(
  'remove current-user cross-tenant fallbacks',
  "  const user = db.users.find(u => u.workspaceId === wsId) || db.users[0];\n  const workspace = db.workspaces.find(w => w.id === wsId) || db.workspaces[0];\n  res.json({ user, workspace });",
  "  const user = db.users.find(u => u.workspaceId === wsId);\n  const workspace = db.workspaces.find(w => w.id === wsId);\n  if (!user || !workspace) {\n    return res.status(404).json({ error: 'WORKSPACE_NOT_FOUND', message: 'No user/workspace exists for the requested tenant.' });\n  }\n  res.json({ user, workspace });"
);

replaceOnce(
  'scope vdr file listing',
  "app.get('/api/vdr/files', (req: Request, res: Response) => {\n  res.json({ folders: db.vdrFolders, files: db.vdrFiles, accessLogs: db.vdrAccessLogs });\n});",
  "app.get('/api/vdr/files', (req: Request, res: Response) => {\n  const wsId = getWorkspaceId(req);\n  const projectIds = new Set(db.projects.filter(p => p.workspaceId === wsId).map(p => p.id));\n  const files = db.vdrFiles.filter((f: any) => !f.workspaceId ? true : f.workspaceId === wsId);\n  const folders = db.vdrFolders.filter((f: any) => !f.workspaceId ? true : f.workspaceId === wsId);\n  const accessLogs = db.vdrAccessLogs.filter((l: any) => projectIds.has(l.projectId));\n  res.json({ folders, files, accessLogs });\n});"
);

replaceOnce(
  'vdr access buyer tenant validation',
  "  const buyerId = (req.query.buyerId as string) || 'buyer-1';\n  const file = db.vdrFiles.find(f => f.id === req.params.id);\n",
  "  const buyerId = (req.query.buyerId as string) || 'buyer-1';\n  const buyer = db.buyers.find(b => b.id === buyerId && b.workspaceId === wsId);\n  if (!buyer) {\n    return res.status(403).json({ error: 'BUYER_TENANT_ACCESS_DENIED', message: 'Buyer is not a member of the active workspace.' });\n  }\n  const file = db.vdrFiles.find((f: any) => f.id === req.params.id && (!f.workspaceId || f.workspaceId === wsId));\n"
);

replaceOnce(
  'nda list tenant isolation',
  "app.get('/api/ndas', (req: Request, res: Response) => {\n  res.json({ ndas: db.ndas });\n});",
  "app.get('/api/ndas', (req: Request, res: Response) => {\n  const wsId = getWorkspaceId(req);\n  const buyerIds = new Set(db.buyers.filter(b => b.workspaceId === wsId).map(b => b.id));\n  const ndas = db.ndas.filter((n: any) => n.workspaceId === wsId || buyerIds.has(n.buyerId));\n  res.json({ ndas });\n});"
);

replaceOnce(
  'nda signing tenant isolation',
  "  const nda = db.ndas.find(n => n.id === req.params.id);\n  if (!nda) {",
  "  const wsId = getWorkspaceId(req);\n  const nda = db.ndas.find(n => n.id === req.params.id);\n  const buyer = nda ? db.buyers.find(b => b.id === nda.buyerId && b.workspaceId === wsId) : undefined;\n  if (!nda || !buyer) {"
);

replaceOnce(
  'approval status validation',
  "  approval.status = status;\n  approval.resolvedAt = new Date().toISOString();",
  "  if (!['APPROVED', 'REJECTED', 'EDITED'].includes(status)) {\n    return res.status(400).json({ error: 'INVALID_APPROVAL_STATUS' });\n  }\n\n  approval.status = status;\n  approval.resolvedAt = new Date().toISOString();"
);

if (s.includes('|| db.projects[0]') || s.includes('|| db.buyers[0]')) {
  throw new Error('Unsafe project/buyer fallback remains in server.ts');
}

fs.writeFileSync(path, s);
console.log(`Applied ${changes.length} hardening changes:`);
for (const c of changes) console.log(`- ${c}`);
