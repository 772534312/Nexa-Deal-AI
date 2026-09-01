import crypto from 'crypto';

const VAULT_MASTER_KEY = process.env.VAULT_ENCRYPTION_KEY
  ? crypto.createHash('sha256').update(process.env.VAULT_ENCRYPTION_KEY).digest()
  : crypto.createHash('sha256').update('nexa_handover_vault_master_key_2026').digest();

export interface EncryptedSecretPayload {
  cipherTextHex: string;
  ivHex: string;
  authTagHex: string;
  oneTimeToken: string;
  tokenHash: string;
  expiresAt: string;
}

export interface RevealSecretResult {
  success: boolean;
  decryptedSecret?: string;
  error?: 'EXPIRED' | 'ALREADY_REVEALED' | 'INVALID_TOKEN' | 'DECRYPTION_FAILED';
}

/**
 * Encrypt a plaintext secret with AES-256-GCM and generate a single-use 15-minute token
 */
export function encryptHandoverSecret(plaintext: string, ttlMinutes: number = 15): EncryptedSecretPayload {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', VAULT_MASTER_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(Buffer.from(plaintext, 'utf-8')), cipher.final()]);
  const authTag = cipher.getAuthTag();

  const oneTimeToken = `rev_${crypto.randomBytes(24).toString('hex')}`;
  const tokenHash = crypto.createHash('sha256').update(oneTimeToken).digest('hex');
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();

  return {
    cipherTextHex: encrypted.toString('hex'),
    ivHex: iv.toString('hex'),
    authTagHex: authTag.toString('hex'),
    oneTimeToken,
    tokenHash,
    expiresAt,
  };
}

/**
 * Decrypt a secret using the master key
 */
export function decryptHandoverSecret(cipherTextHex: string, ivHex: string, authTagHex: string): string {
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const cipherText = Buffer.from(cipherTextHex, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-gcm', VAULT_MASTER_KEY, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(cipherText), decipher.final()]);

  return decrypted.toString('utf-8');
}
