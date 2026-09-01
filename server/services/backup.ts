import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { DatabaseState } from '../db/types';
import { saveDurableDatabaseState } from '../db/connection';

const BACKUP_DIR = path.join(process.cwd(), '.data', 'backups');

if (!fs.existsSync(BACKUP_DIR)) {
  try {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  } catch (err) {
    console.error('Warning: could not create backups directory:', err);
  }
}

export interface BackupSnapshotMeta {
  backupId: string;
  createdAt: string;
  sizeBytes: number;
  sha256Checksum: string;
  recordCounts: {
    workspaces: number;
    projects: number;
    deals: number;
    offers: number;
    auditLogs: number;
    vdrFiles: number;
  };
}

/**
 * Creates an immutable point-in-time backup snapshot
 */
export function createDatabaseBackup(state: DatabaseState): BackupSnapshotMeta {
  const backupId = `nexa_backup_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const backupFilePath = path.join(BACKUP_DIR, `${backupId}.json`);
  const metaFilePath = path.join(BACKUP_DIR, `${backupId}.meta.json`);

  const serialized = JSON.stringify(state, null, 2);
  const sha256Checksum = crypto.createHash('sha256').update(serialized).digest('hex');

  const meta: BackupSnapshotMeta = {
    backupId,
    createdAt: new Date().toISOString(),
    sizeBytes: serialized.length,
    sha256Checksum,
    recordCounts: {
      workspaces: state.workspaces?.length || 0,
      projects: state.projects?.length || 0,
      deals: state.deals?.length || 0,
      offers: state.offers?.length || 0,
      auditLogs: state.auditLogs?.length || 0,
      vdrFiles: state.vdrFiles?.length || 0,
    },
  };

  fs.writeFileSync(backupFilePath, serialized, 'utf-8');
  fs.writeFileSync(metaFilePath, JSON.stringify(meta, null, 2), 'utf-8');

  // Prune older backups (keep latest 10)
  pruneOldBackups(10);

  return meta;
}

/**
 * Lists all available backup snapshots
 */
export function listDatabaseBackups(): BackupSnapshotMeta[] {
  if (!fs.existsSync(BACKUP_DIR)) return [];

  const metaFiles = fs.readdirSync(BACKUP_DIR).filter((f) => f.endsWith('.meta.json'));
  const snapshots: BackupSnapshotMeta[] = [];

  for (const file of metaFiles) {
    try {
      const content = fs.readFileSync(path.join(BACKUP_DIR, file), 'utf-8');
      snapshots.push(JSON.parse(content));
    } catch {
      // ignore corrupted meta file
    }
  }

  return snapshots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Restores database from a specific snapshot ID
 */
export function restoreDatabaseBackup(backupId: string): { success: boolean; state?: DatabaseState; error?: string } {
  const backupFilePath = path.join(BACKUP_DIR, `${backupId}.json`);
  const metaFilePath = path.join(BACKUP_DIR, `${backupId}.meta.json`);

  if (!fs.existsSync(backupFilePath) || !fs.existsSync(metaFilePath)) {
    return { success: false, error: 'Backup snapshot not found.' };
  }

  try {
    const meta: BackupSnapshotMeta = JSON.parse(fs.readFileSync(metaFilePath, 'utf-8'));
    const content = fs.readFileSync(backupFilePath, 'utf-8');
    const computedChecksum = crypto.createHash('sha256').update(content).digest('hex');

    if (computedChecksum !== meta.sha256Checksum) {
      return { success: false, error: 'Backup snapshot checksum mismatch (corrupted file).' };
    }

    const state: DatabaseState = JSON.parse(content);
    saveDurableDatabaseState(state);

    return { success: true, state };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

function pruneOldBackups(keepCount: number): void {
  try {
    const snapshots = listDatabaseBackups();
    if (snapshots.length > keepCount) {
      const toDelete = snapshots.slice(keepCount);
      for (const s of toDelete) {
        const jsonPath = path.join(BACKUP_DIR, `${s.backupId}.json`);
        const metaPath = path.join(BACKUP_DIR, `${s.backupId}.meta.json`);
        if (fs.existsSync(jsonPath)) fs.unlinkSync(jsonPath);
        if (fs.existsSync(metaPath)) fs.unlinkSync(metaPath);
      }
    }
  } catch (err) {
    console.error('Error pruning backups:', err);
  }
}
