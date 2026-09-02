import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('server.ts');
let source = fs.readFileSync(file, 'utf8');

function replace(label, oldText, newText) {
  if (!source.includes(oldText)) throw new Error(`[Nexa deal security] Missing pattern: ${label}`);
  source = source.replace(oldText, newText);
}

// Never fall back to another tenant's project/buyer for AI negotiation.
replace(
  'negotiation tenant fallback',
  "const project = db.projects.find(p => p.id === projectId && p.workspaceId === wsId) || db.projects[0];\n  const buyer = db.buyers.find(b => b.id === buyerId && b.workspaceId === wsId) || db.buyers[0];",
  "const project = db.projects.find(p => p.id === projectId && p.workspaceId === wsId);\n  const buyer = db.buyers.find(b => b.id === buyerId && b.workspaceId === wsId);\n  if (!project || !buyer) return res.status(404).json({ error: 'Project or buyer not found or tenant access denied.' });"
);

// Completion prerequisites must belong to this deal, not any deal in the database.
replace(
  'global closing milestones',
  "const uncompletedMilestones = db.closingMilestones.filter(m => m.status !== 'COMPLETED');",
  "const dealMilestones = db.closingMilestones.filter(m => (m as any).dealId === deal.id || !(m as any).dealId);\n    const uncompletedMilestones = dealMilestones.filter(m => m.status !== 'COMPLETED');"
);

// VDR listing must be workspace/project scoped.
replace(
  'unscoped VDR listing',
  "app.get('/api/vdr/files', (req: Request, res: Response) => {\n  res.json({ folders: db.vdrFolders, files: db.vdrFiles, accessLogs: db.vdrAccessLogs });\n});",
  "app.get('/api/vdr/files', (req: Request, res: Response) => {\n  const wsId = getWorkspaceId(req);\n  const projectId = req.query.projectId as string | undefined;\n  const projectIds = new Set(db.projects.filter(p => p.workspaceId === wsId && (!projectId || p.id === projectId)).map(p => p.id));\n  const files = db.vdrFiles.filter(f => {\n    const project = (f as any).projectId;\n    return !project || projectIds.has(project);\n  });\n  const folders = db.vdrFolders.filter(f => {\n    const project = (f as any).projectId;\n    return !project || projectIds.has(project);\n  });\n  const accessLogs = db.vdrAccessLogs.filter(l => projectIds.has(l.projectId));\n  res.json({ folders, files, accessLogs });\n});"
);

// VDR access must validate buyer + file project + signed NDA for that exact project.
replace(
  'VDR buyer fallback',
  "const buyerId = (req.query.buyerId as string) || 'buyer-1';\n  const file = db.vdrFiles.find(f => f.id === req.params.id);",
  "const buyerId = req.query.buyerId as string;\n  if (!buyerId) return res.status(400).json({ error: 'buyerId is required.' });\n  const buyer = db.buyers.find(b => b.id === buyerId && b.workspaceId === wsId);\n  const file = db.vdrFiles.find(f => f.id === req.params.id);\n  if (!buyer) return res.status(404).json({ error: 'Buyer not found or tenant access denied.' });"
);
replace(
  'VDR file tenant scope',
  "  if (!file) {\n    return res.status(404).json({ error: 'File not found in Virtual Data Room.' });\n  }",
  "  if (!file) {\n    return res.status(404).json({ error: 'File not found in Virtual Data Room.' });\n  }\n  const fileProjectId = (file as any).projectId || (req.query.projectId as string | undefined);\n  if (!fileProjectId || !db.projects.some(p => p.id === fileProjectId && p.workspaceId === wsId)) {\n    return res.status(403).json({ error: 'VDR file is not associated with an authorized workspace project.' });\n  }"
);
replace(
  'NDA buyer-only check',
  "const signedNda = db.ndas.find(n => n.buyerId === buyerId && n.status === 'SIGNED');",
  "const signedNda = db.ndas.find(n => n.buyerId === buyerId && n.projectId === fileProjectId && n.status === 'SIGNED');"
);
replace(
  'hardcoded VDR project denied log',
  "projectId: 'proj-1',",
  "projectId: fileProjectId,"
);
replace(
  'hardcoded VDR project granted log',
  "projectId: 'proj-1',",
  "projectId: fileProjectId,"
);
replace(
  'fake VDR IP denied',
  "ipAddress: '192.168.1.100',",
  "ipAddress: String(req.ip || req.headers['x-forwarded-for'] || 'unknown'),"
);
replace(
  'fake VDR IP granted',
  "ipAddress: '192.168.1.100',",
  "ipAddress: String(req.ip || req.headers['x-forwarded-for'] || 'unknown'),"
);

// Uploads cannot inject arbitrary external URLs as if the platform had stored the file.
replace(
  'VDR arbitrary URL',
  "url: req.body.url || '/vdr/sample.pdf',",
  "url: typeof req.body.url === 'string' && req.body.url.startsWith('/vdr/') ? req.body.url : `/vdr/files/${encodeURIComponent(req.body.name || 'document')}`,"
);

// NDA signing must be tenant/project scoped and cannot be signed by arbitrary actor text.
replace(
  'unscoped NDA sign',
  "  const nda = db.ndas.find(n => n.id === req.params.id);\n  if (!nda) {\n    return res.status(404).json({ error: 'NDA not found.' });\n  }\n  nda.status = 'SIGNED';",
  "  const wsId = getWorkspaceId(req);\n  const nda = db.ndas.find(n => n.id === req.params.id);\n  if (!nda) return res.status(404).json({ error: 'NDA not found.' });\n  const ndaProject = db.projects.find(p => p.id === nda.projectId && p.workspaceId === wsId);\n  const ndaBuyer = db.buyers.find(b => b.id === nda.buyerId && b.workspaceId === wsId);\n  if (!ndaProject || !ndaBuyer) return res.status(403).json({ error: 'NDA tenant access denied.' });\n  if (nda.status === 'SIGNED') return res.status(409).json({ error: 'NDA_ALREADY_SIGNED' });\n  nda.status = 'SIGNED';"
);
replace(
  'duplicate workspace extraction after NDA patch',
  "  logAuditEvent(getWorkspaceId(req), nda.buyerName, 'SYSTEM',",
  "  logAuditEvent(wsId, nda.buyerName, 'SYSTEM',"
);

// Approval resolution must accept only known states and derive actor from authenticated context.
replace(
  'approval arbitrary status and actor',
  "  const { status, resolvedBy, notes } = req.body; // 'APPROVED' | 'REJECTED' | 'EDITED'",
  "  const { status, notes } = req.body; // APPROVED | REJECTED | EDITED\n  if (!['APPROVED', 'REJECTED', 'EDITED'].includes(status)) return res.status(400).json({ error: 'INVALID_APPROVAL_STATUS' });"
);
replace(
  'approval actor fallback',
  "  approval.resolvedBy = resolvedBy || 'Founder (Farhan Al-Mansoor)';",
  "  approval.resolvedBy = getActorInfo(req).actor;"
);

// Role switching is not a legitimate production API.
replace(
  'unsafe role switching endpoint',
  "app.post('/api/users/switch-role', (req: Request, res: Response) => {\n  const { role } = req.body;\n  if (db.users[0]) {\n    db.users[0].role = role;\n  }\n  res.json({ success: true, user: db.users[0] });\n});",
  "app.post('/api/users/switch-role', (_req: Request, res: Response) => {\n  return res.status(403).json({ error: 'ROLE_SWITCHING_DISABLED', message: 'Roles are controlled by authenticated server-side identity.' });\n});"
);

// Public workspace enumeration is not allowed in production.
replace(
  'workspace enumeration',
  "app.get('/api/workspaces', (req: Request, res: Response) => {\n  res.json({ workspaces: db.workspaces });\n});",
  "app.get('/api/workspaces', (req: Request, res: Response) => {\n  const wsId = getWorkspaceId(req);\n  const workspace = db.workspaces.find(w => w.id === wsId);\n  if (!workspace) return res.status(404).json({ error: 'Workspace not found.' });\n  res.json({ workspaces: [workspace] });\n});"
);

fs.writeFileSync(file, source, 'utf8');
console.log('[Nexa deal security] Deal/VDR/NDA/approval hardening enabled.');
