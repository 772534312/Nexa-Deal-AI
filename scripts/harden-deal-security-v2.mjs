import fs from 'node:fs';

const file = 'server.ts';
let source = fs.readFileSync(file, 'utf8');
let changed = 0;

function replace(label, pattern, replacement) {
  const next = source.replace(pattern, replacement);
  if (next === source) {
    console.log(`[Nexa deal security] ${label}: already hardened or pattern changed.`);
    return;
  }
  source = next;
  changed++;
  console.log(`[Nexa deal security] ${label}: applied.`);
}

// Never fall back across tenants when resolving negotiation entities.
replace(
  'negotiation tenant fallback',
  /const project = db\.projects\.find\(p => p\.id === projectId && p\.workspaceId === wsId\) \|\| db\.projects\[0\];\n\s*const buyer = db\.buyers\.find\(b => b\.id === buyerId && b\.workspaceId === wsId\) \|\| db\.buyers\[0\];/,
  "const project = db.projects.find(p => p.id === projectId && p.workspaceId === wsId);\n  const buyer = db.buyers.find(b => b.id === buyerId && b.workspaceId === wsId);\n  if (!project || !buyer) return res.status(404).json({ error: 'Project or buyer not found or tenant access denied.' });"
);

// Completion checks must be scoped to the current deal.
replace(
  'global closing milestones',
  /const uncompletedMilestones = db\.closingMilestones\.filter\(m => m\.status !== 'COMPLETED'\);/,
  "const dealMilestones = db.closingMilestones.filter(m => (m as any).dealId === deal.id || !(m as any).dealId);\n    const uncompletedMilestones = dealMilestones.filter(m => m.status !== 'COMPLETED');"
);

// Workspace-scoped VDR listing.
replace(
  'unscoped VDR listing',
  /app\.get\('\/api\/vdr\/files', \(req: Request, res: Response\) => \{\n\s*res\.json\(\{ folders: db\.vdrFolders, files: db\.vdrFiles, accessLogs: db\.vdrAccessLogs \}\);\n\}\);/,
  "app.get('/api/vdr/files', (req: Request, res: Response) => {\n  const wsId = getWorkspaceId(req);\n  const projectId = req.query.projectId as string | undefined;\n  const projectIds = new Set(db.projects.filter(p => p.workspaceId === wsId && (!projectId || p.id === projectId)).map(p => p.id));\n  const files = db.vdrFiles.filter(f => !(f as any).projectId || projectIds.has((f as any).projectId));\n  const folders = db.vdrFolders.filter(f => !(f as any).projectId || projectIds.has((f as any).projectId));\n  const accessLogs = db.vdrAccessLogs.filter(l => projectIds.has(l.projectId));\n  res.json({ folders, files, accessLogs });\n});"
);

// VDR access requires an explicit buyer in the same workspace and a project-scoped NDA.
replace(
  'VDR buyer fallback',
  /const buyerId = \(req\.query\.buyerId as string\) \|\| 'buyer-1';\n\s*const file = db\.vdrFiles\.find\(f => f\.id === req\.params\.id\);/,
  "const buyerId = req.query.buyerId as string;\n  if (!buyerId) return res.status(400).json({ error: 'buyerId is required.' });\n  const buyer = db.buyers.find(b => b.id === buyerId && b.workspaceId === wsId);\n  const file = db.vdrFiles.find(f => f.id === req.params.id);\n  if (!buyer) return res.status(404).json({ error: 'Buyer not found or tenant access denied.' });"
);
replace(
  'VDR file tenant scope',
  /if \(!file\) \{\n\s*return res\.status\(404\)\.json\(\{ error: 'File not found in Virtual Data Room\.' \}\);\n\s*\}/,
  "if (!file) {\n    return res.status(404).json({ error: 'File not found in Virtual Data Room.' });\n  }\n\n  const fileProjectId = (file as any).projectId as string | undefined;\n  if (!fileProjectId || !db.projects.some(p => p.id === fileProjectId && p.workspaceId === wsId)) {\n    return res.status(403).json({ error: 'VDR file is not associated with an authorized workspace project.' });\n  }"
);
replace(
  'NDA buyer-only check',
  /const signedNda = db\.ndas\.find\(n => n\.buyerId === buyerId && n\.status === 'SIGNED'\);/,
  "const signedNda = db.ndas.find(n => n.buyerId === buyerId && n.projectId === fileProjectId && n.status === 'SIGNED');"
);
replace('hardcoded VDR project id', /projectId: 'proj-1',/g, 'projectId: fileProjectId,');
replace('fake VDR IP', /ipAddress: '192\.168\.1\.100',/g, "ipAddress: String(req.ip || req.headers['x-forwarded-for'] || 'unknown'),");

// NDA listing/signing is workspace scoped and idempotent.
replace(
  'unscoped NDA listing',
  /app\.get\('\/api\/ndas', \(req: Request, res: Response\) => \{\n\s*res\.json\(\{ ndas: db\.ndas \}\);\n\}\);/,
  "app.get('/api/ndas', (req: Request, res: Response) => {\n  const wsId = getWorkspaceId(req);\n  const projectIds = new Set(db.projects.filter(p => p.workspaceId === wsId).map(p => p.id));\n  const ndas = db.ndas.filter(n => projectIds.has(n.projectId));\n  res.json({ ndas });\n});"
);
replace(
  'unscoped NDA sign',
  /const nda = db\.ndas\.find\(n => n\.id === req\.params\.id\);\n\s*if \(!nda\) \{\n\s*return res\.status\(404\)\.json\(\{ error: 'NDA not found\.' \}\);\n\s*\}\n\s*nda\.status = 'SIGNED';/,
  "const wsId = getWorkspaceId(req);\n  const nda = db.ndas.find(n => n.id === req.params.id);\n  if (!nda) return res.status(404).json({ error: 'NDA not found.' });\n  const ndaProject = db.projects.find(p => p.id === nda.projectId && p.workspaceId === wsId);\n  const ndaBuyer = db.buyers.find(b => b.id === nda.buyerId && b.workspaceId === wsId);\n  if (!ndaProject || !ndaBuyer) return res.status(403).json({ error: 'NDA tenant access denied.' });\n  if (nda.status === 'SIGNED') return res.status(409).json({ error: 'NDA_ALREADY_SIGNED' });\n  nda.status = 'SIGNED';"
);
replace('duplicate NDA workspace lookup', /logAuditEvent\(getWorkspaceId\(req\), nda\.buyerName,/, 'logAuditEvent(wsId, nda.buyerName,');

// Approval resolution accepts only known states and derives the actor from authenticated context.
replace(
  'approval arbitrary status',
  /const \{ status, resolvedBy, notes \} = req\.body; \/\/ 'APPROVED' \| 'REJECTED' \| 'EDITED'/,
  "const { status, notes } = req.body;\n  if (!['APPROVED', 'REJECTED', 'EDITED'].includes(status)) return res.status(400).json({ error: 'INVALID_APPROVAL_STATUS' });"
);
replace('approval actor fallback', /approval\.resolvedBy = resolvedBy \|\| 'Founder \(Farhan Al-Mansoor\)';/, 'approval.resolvedBy = getActorInfo(req).actor;');

// Disable client-controlled role switching.
replace(
  'unsafe role switching endpoint',
  /app\.post\('\/api\/users\/switch-role'[\s\S]*?\n\}\);\n\n\/\/ -------------------------------------------------------------\n\/\/ 2\. PROJECT MANAGEMENT/,
  "app.post('/api/users/switch-role', (_req: Request, res: Response) => {\n  return res.status(403).json({ error: 'ROLE_SWITCHING_DISABLED', message: 'Roles are controlled by authenticated server-side identity.' });\n});\n\n// -------------------------------------------------------------\n// 2. PROJECT MANAGEMENT"
);

// Prevent workspace enumeration.
replace(
  'workspace enumeration',
  /app\.get\('\/api\/workspaces', \(req: Request, res: Response\) => \{\n\s*res\.json\(\{ workspaces: db\.workspaces \}\);\n\}\);/,
  "app.get('/api/workspaces', (req: Request, res: Response) => {\n  const wsId = getWorkspaceId(req);\n  const workspace = db.workspaces.find(w => w.id === wsId);\n  if (!workspace) return res.status(404).json({ error: 'Workspace not found.' });\n  res.json({ workspaces: [workspace] });\n});"
);

// Remove cross-tenant fallback from inbound email processing and deal coach.
replace('email project fallback', /const project = db\.projects\.find\(p => p\.id === projectId && p\.workspaceId === wsId\) \|\| db\.projects\[0\];/, "const project = db.projects.find(p => p.id === projectId && p.workspaceId === wsId);");
replace('email buyer fallback', /const buyer = db\.buyers\.find\(b => b\.id === buyerId && b\.workspaceId === wsId\) \|\| db\.buyers\[0\];/, "const buyer = db.buyers.find(b => b.id === buyerId && b.workspaceId === wsId);");
replace('deal coach project fallback', /const project = db\.projects\.find\(p => p\.id === projectId && p\.workspaceId === wsId\) \|\| db\.projects\[0\];/, "const project = db.projects.find(p => p.id === projectId && p.workspaceId === wsId);");

// Deal room must never fall back to another deal's transaction state.
replace('deal room checklist fallback', /const checklist = db\.transactionChecklists\[deal\.id\] \|\| db\.transactionChecklists\['deal-1'\] \|\| \[\];/, "const checklist = db.transactionChecklists[deal.id] || [];");
replace('deal room handover fallback', /const handoverPlan = db\.handoverPlans\[deal\.id\] \|\| db\.handoverPlans\['deal-1'\] \|\| \[\];/, "const handoverPlan = db.handoverPlans[deal.id] || [];");
replace('deal room VDR global state', /const vdrFiles = db\.vdrFiles;\n\s*const dueDiligence = db\.dueDiligence;/, "const vdrFiles = db.vdrFiles.filter(f => !(f as any).projectId || (f as any).projectId === deal.projectId);\n  const dueDiligence = db.dueDiligence.filter(d => !(d as any).projectId || (d as any).projectId === deal.projectId);");

fs.writeFileSync(file, source, 'utf8');
console.log(`[Nexa deal security] v2 completed with ${changed} transformation(s).`);
