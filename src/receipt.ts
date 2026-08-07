import { createHash } from 'node:crypto';
import { PPPHeader, PPPBody, PPPReceipt } from './types.js';
import { isValidDID } from './did.js';

/**
 * Produces a deterministic canonical JSON string by sorting keys recursively.
 */
export function canonicalizeJSON(obj: unknown): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return '[' + obj.map((item) => canonicalizeJSON(item)).join(',') + ']';
  }

  const keys = Object.keys(obj as Record<string, unknown>).sort();
  const keyValues = keys.map(
    (key) => `${JSON.stringify(key)}:${canonicalizeJSON((obj as Record<string, unknown>)[key])}`
  );
  return '{' + keyValues.join(',') + '}';
}

/**
 * Calculates SHA-256 digest of header + body using canonical JSON representation.
 */
export function calculateMessageHash(header: PPPHeader, body: PPPBody): string {
  const canonicalData = canonicalizeJSON({ header, body });
  const hashHex = createHash('sha256').update(canonicalData, 'utf-8').digest('hex');
  return `sha256:${hashHex}`;
}

/**
 * Validates receipt object structure.
 */
export function validateReceipt(receipt: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (typeof receipt !== 'object' || receipt === null || Array.isArray(receipt)) {
    return { valid: false, errors: ['Receipt must be a non-null object'] };
  }

  const r = receipt as Record<string, unknown>;

  // hash
  if (typeof r.hash !== 'string' || (!r.hash.startsWith('sha256:') && !/^[a-f0-9]{64}$/i.test(r.hash))) {
    errors.push(`Invalid 'hash' field: expected sha256 hash string, got "${r.hash}"`);
  }

  // signature
  if (typeof r.signature !== 'string' || !r.signature.trim()) {
    errors.push(`Invalid 'signature' field: expected base64 string, got "${r.signature}"`);
  }

  // signer
  if (typeof r.signer !== 'string' || !isValidDID(r.signer)) {
    errors.push(`Invalid 'signer' field: expected valid DID, got "${r.signer}"`);
  }

  // chain_hash
  if (typeof r.chain_hash !== 'string' || (!r.chain_hash.startsWith('sha256:') && !/^[a-f0-9]{64}$/i.test(r.chain_hash))) {
    errors.push(`Invalid 'chain_hash' field: expected sha256 hash string, got "${r.chain_hash}"`);
  }

  // sequence
  if (typeof r.sequence !== 'number' || !Number.isInteger(r.sequence) || r.sequence < 0) {
    errors.push(`Invalid 'sequence' field: expected non-negative integer, got "${r.sequence}"`);
  }

  // anchored
  if (typeof r.anchored !== 'boolean') {
    errors.push(`Invalid 'anchored' field: expected boolean, got "${r.anchored}"`);
  }

  // anchor_tx
  if (r.anchor_tx !== undefined && (typeof r.anchor_tx !== 'string' || !r.anchor_tx.trim())) {
    errors.push(`Invalid 'anchor_tx' field: expected hex string, got "${r.anchor_tx}"`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Parses raw JSON string or object into a validated PPPReceipt.
 */
export function parseReceipt(rawReceipt: unknown): PPPReceipt {
  let parsed: unknown = rawReceipt;
  if (typeof rawReceipt === 'string') {
    try {
      parsed = JSON.parse(rawReceipt);
    } catch {
      throw new Error('Receipt parsing failed: invalid JSON string');
    }
  }

  const { valid, errors } = validateReceipt(parsed);
  if (!valid) {
    throw new Error(`Receipt validation failed: ${errors.join('; ')}`);
  }

  return parsed as PPPReceipt;
}

/**
 * Verifies that a receipt's hash matches the header + body content.
 */
export function verifyReceiptHash(header: PPPHeader, body: PPPBody, receipt: PPPReceipt): boolean {
  const expectedHash = calculateMessageHash(header, body);
  return receipt.hash === expectedHash;
}

/**
 * Validates a TrustChain sequence of receipts to ensure monotonic sequencing.
 */
export function validateTrustChain(receipts: PPPReceipt[]): boolean {
  if (!Array.isArray(receipts) || receipts.length === 0) {
    return false;
  }

  for (let i = 0; i < receipts.length; i++) {
    const { valid } = validateReceipt(receipts[i]);
    if (!valid) return false;

    if (i > 0) {
      if (receipts[i].sequence <= receipts[i - 1].sequence) {
        return false;
      }
    }
  }

  return true;
}
