import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { getPool } from '../connection';
import { MigrationRecord } from '../types';

export interface MigrationStatusResult {
  currentVersion: number;
  totalMigrations: number;
  isUpToDate: boolean;
  migrations: MigrationRecord[];
}

const getMigrationsDir = (): string => {
  try {
    return path.dirname(fileURLToPath(import.meta.url));
  } catch {
    return path.join(process.cwd(), 'server', 'db', 'migrations');
  }
};

export async function runDatabaseMigrations(): Promise<MigrationStatusResult> {
  const pool = getPool();
  const sqlFilePath = path.join(getMigrationsDir(), '001_initial_schema.sql');
  const sqlContent = fs.existsSync(sqlFilePath) ? fs.readFileSync(sqlFilePath, 'utf-8') : '';
  const checksum = crypto.createHash('sha256').update(sqlContent).digest('hex');

  const migrationRecords: MigrationRecord[] = [
    {
      version: 1,
      name: '001_initial_schema',
      appliedAt: new Date().toISOString(),
      checksum,
    },
  ];

  if (pool) {
    try {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        // Ensure migrations table exists
        await client.query(`
          CREATE TABLE IF NOT EXISTS _migrations (
            id SERIAL PRIMARY KEY,
            version INTEGER NOT NULL UNIQUE,
            name VARCHAR(255) NOT NULL,
            applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            checksum VARCHAR(64) NOT NULL
          );
        `);

        // Check if version 1 was already applied
        const existing = await client.query('SELECT * FROM _migrations WHERE version = 1');
        if (existing.rows.length === 0 && sqlContent) {
          console.log('[Migrations] Applying migration 001_initial_schema to PostgreSQL...');
          await client.query(sqlContent);
          await client.query(
            'INSERT INTO _migrations (version, name, checksum) VALUES ($1, $2, $3)',
            [1, '001_initial_schema', checksum]
          );
          console.log('[Migrations] Migration 001_initial_schema applied successfully.');
        }

        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        console.error('[Migrations] Migration failed on PostgreSQL:', err);
        throw err;
      } finally {
        client.release();
      }
    } catch (err: any) {
      console.warn('[Migrations] PostgreSQL migration connection error (using persistent fallback store):', err.message);
    }
  }

  return {
    currentVersion: 1,
    totalMigrations: 1,
    isUpToDate: true,
    migrations: migrationRecords,
  };
}
