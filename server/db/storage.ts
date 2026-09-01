import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const STORAGE_ROOT = process.env.VDR_STORAGE_PATH || path.join(process.cwd(), '.data', 'vdr_objects');

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_ROOT)) {
  try {
    fs.mkdirSync(STORAGE_ROOT, { recursive: true });
  } catch (err) {
    console.error('Warning: could not create VDR storage root:', err);
  }
}

// Master encryption key (fallback to deterministic SHA-256 derived key if not provided in env)
const MASTER_ENCRYPTION_KEY = process.env.VDR_ENCRYPTION_KEY 
  ? crypto.createHash('sha256').update(process.env.VDR_ENCRYPTION_KEY).digest()
  : crypto.createHash('sha256').update('nexa_vdr_master_aes256_production_seed_2026').digest();

export interface StoredObjectMetadata {
  objectId: string;
  workspaceId: string;
  projectId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  sha256Checksum: string;
  isEncrypted: boolean;
  ivHex: string;
  authTagHex: string;
  createdAt: string;
}

export interface SignedUrlResponse {
  downloadUrl: string;
  expiresAt: string;
  fileId: string;
  watermarkPayload?: {
    viewerEmail: string;
    viewerIp: string;
    viewTimestamp: string;
    confidentialityNotice: string;
  };
}

/**
 * Encrypt a buffer using AES-256-GCM
 */
export function encryptBuffer(buffer: Buffer): { encryptedBuffer: Buffer; iv: string; authTag: string } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', MASTER_ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    encryptedBuffer: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
}

/**
 * Decrypt a buffer using AES-256-GCM
 */
export function decryptBuffer(encryptedBuffer: Buffer, ivHex: string, authTagHex: string): Buffer {
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', MASTER_ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
}

/**
 * Upload object to persistent storage
 */
export async function storeVdrObject(
  workspaceId: string,
  projectId: string,
  fileName: string,
  mimeType: string,
  contentBuffer: Buffer
): Promise<StoredObjectMetadata> {
  const objectId = `obj-${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
  const sha256Checksum = crypto.createHash('sha256').update(contentBuffer).digest('hex');

  // Encrypt with AES-256-GCM
  const { encryptedBuffer, iv, authTag } = encryptBuffer(contentBuffer);

  const objectFilePath = path.join(STORAGE_ROOT, `${objectId}.enc`);
  const metaFilePath = path.join(STORAGE_ROOT, `${objectId}.meta.json`);

  const metadata: StoredObjectMetadata = {
    objectId,
    workspaceId,
    projectId,
    fileName,
    mimeType,
    sizeBytes: contentBuffer.length,
    sha256Checksum,
    isEncrypted: true,
    ivHex: iv,
    authTagHex: authTag,
    createdAt: new Date().toISOString(),
  };

  fs.writeFileSync(objectFilePath, encryptedBuffer);
  fs.writeFileSync(metaFilePath, JSON.stringify(metadata, null, 2), 'utf-8');

  return metadata;
}

/**
 * Retrieve decrypted object from persistent storage
 */
export async function getVdrObject(objectId: string): Promise<{ buffer: Buffer; metadata: StoredObjectMetadata } | null> {
  const objectFilePath = path.join(STORAGE_ROOT, `${objectId}.enc`);
  const metaFilePath = path.join(STORAGE_ROOT, `${objectId}.meta.json`);

  if (!fs.existsSync(objectFilePath) || !fs.existsSync(metaFilePath)) {
    return null;
  }

  const metadata: StoredObjectMetadata = JSON.parse(fs.readFileSync(metaFilePath, 'utf-8'));
  const encryptedBuffer = fs.readFileSync(objectFilePath);

  let decryptedBuffer: Buffer;
  if (metadata.isEncrypted) {
    decryptedBuffer = decryptBuffer(encryptedBuffer, metadata.ivHex, metadata.authTagHex);
  } else {
    decryptedBuffer = encryptedBuffer;
  }

  return {
    buffer: decryptedBuffer,
    metadata,
  };
}

/**
 * Generate a secure time-limited signed URL with dynamic viewer watermark instructions
 */
export function generateSignedVdrAccessUrl(
  fileId: string,
  viewerEmail: string,
  viewerIp: string,
  ttlMinutes: number = 15
): SignedUrlResponse {
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();
  const token = crypto
    .createHmac('sha256', MASTER_ENCRYPTION_KEY)
    .update(`${fileId}:${viewerEmail}:${expiresAt}`)
    .digest('hex');

  return {
    downloadUrl: `/api/vdr/files/${fileId}/download?expires=${encodeURIComponent(expiresAt)}&token=${token}`,
    expiresAt,
    fileId,
    watermarkPayload: {
      viewerEmail,
      viewerIp,
      viewTimestamp: new Date().toISOString(),
      confidentialityNotice: 'CONFIDENTIAL — Nexa Deal AI Protected Virtual Data Room. Unauthorized copying or redistribution is strictly prohibited.',
    },
  };
}
