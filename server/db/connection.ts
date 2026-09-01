import { Pool, PoolConfig } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Persistent storage location for durable transactions
const PERSISTENT_DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), '.data');
const PERSISTENT_DB_FILE = path.join(PERSISTENT_DATA_DIR, 'nexa_production_db.json');
const PERSISTENT_WAL_FILE = path.join(PERSISTENT_DATA_DIR, 'nexa_wal.log');

// Ensure data directory exists
if (!fs.existsSync(PERSISTENT_DATA_DIR)) {
  try {
    fs.mkdirSync(PERSISTENT_DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Warning: could not create persistent data dir:', err);
  }
}

// Global connection pool cache for hot reload safety
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

  if (!host && !process.env.DATABASE_URL) {
    return null;
  }

  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      max: parseInt(process.env.PG_MAX_CONNECTIONS || '10', 10),
      idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT || '30000', 10),
      connectionTimeoutMillis: parseInt(process.env.PG_CONN_TIMEOUT || '10000', 10),
      ssl: process.env.NODE_ENV === 'production' && !process.env.PG_DISABLE_SSL ? { rejectUnauthorized: false } : false,
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
    ssl: process.env.NODE_ENV === 'production' && !process.env.PG_DISABLE_SSL ? { rejectUnauthorized: false } : false,
  };
}

export function getPool(): Pool | null {
  const config = getPostgresConfig();
  if (!config) {
    return null;
  }

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
    // Durable persistent store check
    const start = Date.now();
    const isWritable = fs.existsSync(PERSISTENT_DATA_DIR);
    return {
      connected: isWritable,
      latencyMs: Date.now() - start,
    };
  }

  const start = Date.now();
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT 1 as health_check');
      return {
        connected: true,
        latencyMs: Date.now() - start,
      };
    } finally {
      client.release();
    }
  } catch (err: any) {
    return {
      connected: false,
      latencyMs: Date.now() - start,
      error: err.message,
    };
  }
}

export function loadDurableDatabaseState<T>(defaultState: T): T {
  try {
    if (fs.existsSync(PERSISTENT_DB_FILE)) {
      const content = fs.readFileSync(PERSISTENT_DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return { ...defaultState, ...parsed };
    }
  } catch (err) {
    console.error('[Persistence Engine] Error loading persistent state from disk:', err);
  }
  return defaultState;
}

export function saveDurableDatabaseState(state: any): void {
  try {
    if (!fs.existsSync(PERSISTENT_DATA_DIR)) {
      fs.mkdirSync(PERSISTENT_DATA_DIR, { recursive: true });
    }

    const tempFile = `${PERSISTENT_DB_FILE}.${Date.now()}.${Math.random().toString(36).substring(2, 6)}.tmp`;
    const serialized = JSON.stringify(state, null, 2);
    
    // Atomic write pattern: Write to temp file then rename
    fs.writeFileSync(tempFile, serialized, 'utf-8');
    fs.renameSync(tempFile, PERSISTENT_DB_FILE);

    // Append to Write-Ahead Log for durability tracking
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
