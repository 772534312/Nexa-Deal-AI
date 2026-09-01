import fs from 'node:fs';
import path from 'node:path';
const file = path.resolve('server.ts');
let source = fs.readFileSync(file, 'utf8');
if (source.includes("import crypto from 'node:crypto';")) process.exit(0);
if (!source.includes("import express, { Request, Response } from 'express';")) throw new Error('server.ts import anchor not found');
source = source.replace("import express, { Request, Response } from 'express';", "import crypto from 'node:crypto';\nimport express, { Request, Response } from 'express';");
fs.writeFileSync(file, source, 'utf8');
console.log('[Nexa auth] crypto import ensured.');
