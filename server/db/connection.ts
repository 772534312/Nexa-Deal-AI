import { Pool, PoolConfig } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const PERSISTENT_DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), '.data');
const PERSISTENT_DB_FILE = path.join(PERSISTENT_DATA_DIR, 'nexa_production_db.json');
const PERSISTENT_WAL_FILE = path.join(PERSISTENT_DATA_DIR, 'nexa_wal.log');

if (!fs.existsSync(PERSISTENT_DATA_DIR)) {
  try {
    fs.mkdirSync(PERSISTENT_DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Warning: could not create persistent data dir:', err);
  }
}

declare global {
  var _postgresPool: Pool | undefined;
}

export interface DatabaseConnectionInfo {
  isPostgresConnected: boolean;
  driver: 'POSTGRESQL' | 'DURABLE_STORAGE';
  host?: string;
  database?: string;
  maxConnections: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
}

export function getPostgresConfig(): PoolConfig | null {
  const host = process.env.PGHOST || process.env.SQL_HOST;
  const user = process.env.PGUSER || process.env.SQL_USER;
  const password = process.env.PGPASSWORD || process.env.SQL_PASSWORD;
  const database = process.env.PGDATABASE || process.env.SQL_DB_NAME;
  const port = parseInt(process.env.PGPORT || '5432', 10);

  if (!host && !process.env.DATABASE_URL) return null;

  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      max: parseInt(process.env.PG_MAX_CONNECTIONS || '10', 10),
      idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT || '30000', 10),
      connectionTimeoutMillis: parseInt(process.env.PG_CONN_TIMEOUT || '10000', 10),
      ssl: process.env.NODE_ENV === 'production' && process.env.PG_CA_CERT
        ? { ca: process.env.PG_CA_CERT, rejectUnauthorized: true }
        : process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    };
  }

  return {
    host,
    user,
    password,
    database,
    port,
    max: parseInt(process.env.PG_MAX_CONNECTIONS || '10', 10),
    idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT || '30000', 10),
    connectionTimeoutMillis: parseInt(process.env.PG_CONN_TIMEOUT || '10000', 10),
    ssl: process.env.NODE_ENV === 'production' && !process.env.PG_DISABLE_SSL
      ? { rejectUnauthorized: false }
      : false,
  };
}

export function getPool(): Pool | null {
  const config = getPostgresConfig();
  if (!config) return null;

  if (!global._postgresPool) {
    global._postgresPool = new Pool(config);
    global._postgresPool.on('error', (err) => {
      console.error('[PostgreSQL Pool] Unexpected error on idle client:', err.message);
    });
  }

  return global._postgresPool;
}

export async function testDatabaseConnectivity(): Promise<{ connected: boolean; latencyMs: number; error?: string }> {
  const pool = getPool();
  if (!pool) {
    const start = Date.now();
    const isWritable = fs.existsSync(PERSISTENT_DATA_DIR);
    return { connected: isWritable, latencyMs: Date.now() - start };
  }

  const start = Date.now();
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT 1 as health_check');
      return { connected: true, latencyMs: Date.now() - start };
    } finally {
      client.release();
    }
  } catch (err: any) {
    return { connected: false, latencyMs: Date.now() - start, error: err.message };
  }
}

/**
 * Production must never expose the hard-coded demo transaction graph as seller-owned inventory.
 * Seed records are retained only for local/demo use and are removed by ID on production startup.
 */
function isolateSeedRecords<T extends Record<string, any>>(state: T, seedState: T): T {
  const result: any = { ...state };
  const source: any = seedState;

  for (const key of Object.keys(result)) {
    const current = result[key];
    const seed = source[key];

    if (Array.isArray(current) && Array.isArray(seed)) {
      const seedIds = new Set(
        seed.filter((v: any) => v && typeof v.id === 'string').map((v: any) => v.id)
      );
      if (seedIds.size > 0) {
        result[key] = current.filter(
          (v: any) => !v || typeof v.id !== 'string' || !seedIds.has(v.id)
        );
      }
      continue;
    }

    if (
      current && typeof current === 'object' && !Array.isArray(current) &&
      seed && typeof seed === 'object' && !Array.isArray(seed)
    ) {
      if (key === 'transactionChecklists' || key === 'handoverPlans' || key === 'agentMemory') {
        const seedKeys = new Set(Object.keys(seed));
        result[key] = Object.fromEntries(
          Object.entries(current).filter(([k]) => !seedKeys.has(k))
        );
      }
    }
  }

  if (result.commercialMode === 'LIVE') {
    result.commercialMode = 'CONTROLLED_FIRST_TRANSACTION';
  }

  if (Array.isArray(result.emailSuppressionList)) {
    const seedSuppression = new Set(source.emailSuppressionList || []);
    result.emailSuppressionList = result.emailSuppressionList.filter(
      (email: any) => !seedSuppression.has(email)
    );
  }

  // Production still needs a neutral workspace shell so the application can
  // open and accept the first real seller submission. This is not a project,
  // buyer, deal, financial claim, or fake identity.
  if (result.workspaces.length === 0) {
    result.workspaces = [{
      id: 'ws-1',
      name: 'My Workspace',
      slug: 'my-workspace',
      plan: 'Free',
      membersCount: 1,
      activeProjectsCount: 0,
      monthlyAiBudget: 0,
      usedAiBudget: 0,
      createdAt: new Date().toISOString(),
    }];
  }

  if (result.users.length === 0) {
    result.users = [{
      id: 'usr-1',
      name: 'Workspace Owner',
      email: 'owner@local.invalid',
      role: 'Owner',
      workspaceId: result.workspaces[0].id,
    }];
  }

  return result as T;
}

export function loadDurableDatabaseState<T>(defaultState: T): T {
  const production = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
  const showSeedData = process.env.NEXA_SHOW_SEED_DATA === 'true';

  if (production && showSeedData) {
    console.warn('[Nexa] NEXA_SHOW_SEED_DATA=true is enabled; synthetic seed records are visible. Do not use this setting for a real transaction.');
  }

  try {
    if (fs.existsSync(PERSISTENT_DB_FILE)) {
      const content = fs.readFileSync(PERSISTENT_DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      const merged = { ...defaultState, ...parsed } as T;
      return production && !showSeedData ? isolateSeedRecords(merged, defaultState) : merged;
    }
  } catch (err) {
    console.error('[Persistence Engine] Error loading persistent state from disk:', err);
  }

  return production && !showSeedData ? isolateSeedRecords(defaultState, defaultState) : defaultState;
}

export function saveDurableDatabaseState(state: any): void {
  try {
    if (!fs.existsSync(PERSISTENT_DATA_DIR)) fs.mkdirSync(PERSISTENT_DATA_DIR, { recursive: true });

    const tempFile = `${PERSISTENT_DB_FILE}.${Date.now()}.${Math.random().toString(36).substring(2, 6)}.tmp`;
    const serialized = JSON.stringify(state, null, 2);
    fs.writeFileSync(tempFile, serialized, 'utf-8');
    fs.renameSync(tempFile, PERSISTENT_DB_FILE);

    const walEntry = JSON.stringify({
      timestamp: new Date().toISOString(),
      action: 'SNAPSHOT_SYNC',
      sizeBytes: serialized.length,
    }) + '\n';
    fs.appendFileSync(PERSISTENT_WAL_FILE, walEntry, 'utf-8');
  } catch (err) {
    console.error('[Persistence Engine] Fatal error during atomic state sync:', err);
  }
}

export async function closeDatabaseConnections(): Promise<void> {
  if (global._postgresPool) {
    try {
      await global._postgresPool.end();
      console.log('[PostgreSQL Pool] Connection pool gracefully drained.');
    } catch (err) {
      console.error('[PostgreSQL Pool] Error closing pool:', err);
    }
    global._postgresPool = undefined;
  }
}
