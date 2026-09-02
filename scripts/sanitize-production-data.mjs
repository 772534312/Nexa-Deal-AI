import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('server/db.ts');
let source = fs.readFileSync(file, 'utf8');

if (!source.includes("sanitizeProductionSeedData")) {
  const importAnchor = "import { NexaRepository } from './db/repository';";
  if (!source.includes(importAnchor)) throw new Error('[Nexa production] db import anchor not found');
  source = source.replace(importAnchor, `${importAnchor}\nimport { sanitizeProductionSeedData } from './db/production-sanitizer';`);
}

const anchor = "export const db: DatabaseState = repository.rawState;";
if (!source.includes(anchor)) throw new Error('[Nexa production] db state anchor not found');

if (!source.includes('sanitizeProductionSeedData(db);')) {
  source = source.replace(anchor, `${anchor}\nsanitizeProductionSeedData(db);\nrepository.persist();`);
}

fs.writeFileSync(file, source, 'utf8');
console.log('[Nexa production] demo seed isolation enabled.');
