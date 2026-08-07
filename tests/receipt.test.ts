import { describe, it, expect } from 'vitest';
import {
  canonicalizeJSON,
  calculateMessageHash,
  validateReceipt,
  parseReceipt,
  verifyReceiptHash,
  validateTrustChain,
} from '../src/receipt.js';
import { PPPHeader, PPPBody, PPPReceipt } from '../src/types.js';

describe('PPP Receipt & TrustChain', () => {
  const header: PPPHeader = {
    proto: 'ppp/1.0',
    type: 'request',
    endpoint: 'pai://verify/kyc',
    id: 'msg_01h',
    from: 'did:agent:pi:agent1',
    to: 'did:agent:pi:agent2',
    ts: '2026-08-02T12:00:00Z',
  };

  const body: PPPBody = {
    type: 'verify.kyc',
    username: 'pioneer.username',
  };

  describe('canonicalizeJSON', () => {
    it('should sort object keys deterministically regardless of key order', () => {
      const objA = { b: 2, a: 1, c: { z: 26, y: 25 } };
      const objB = { a: 1, c: { y: 25, z: 26 }, b: 2 };
      expect(canonicalizeJSON(objA)).toBe(canonicalizeJSON(objB));
      expect(canonicalizeJSON(objA)).toBe('{"a":1,"b":2,"c":{"y":25,"z":26}}');
    });
  });

  describe('calculateMessageHash', () => {
    it('should generate consistent SHA-256 hash prefixed with sha256:', () => {
      const hash1 = calculateMessageHash(header, body);
      const hash2 = calculateMessageHash(header, body);

      expect(hash1).toBe(hash2);
      expect(hash1).toMatch(/^sha256:[a-f0-9]{64}$/);
    });
  });

  describe('validateReceipt', () => {
    it('should validate a complete valid receipt', () => {
      const hash = calculateMessageHash(header, body);
      const receipt: PPPReceipt = {
        hash,
        signature: 'MEUCIQD...',
        signer: 'did:agent:pi:agent1',
        chain_hash: 'sha256:abc123def4567890abc123def4567890abc123def4567890abc123def4567890',
        sequence: 12345,
        anchored: true,
        anchor_tx: '0xabc123',
      };

      const result = validateReceipt(receipt);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid receipt fields', () => {
      const invalidHash = {
        hash: 'not-a-hash',
        signature: 'sig',
        signer: 'did:agent:pi:agent1',
        chain_hash: 'sha256:1234567890123456789012345678901234567890123456789012345678901234',
        sequence: 1,
        anchored: false,
      };
      expect(validateReceipt(invalidHash).valid).toBe(false);

      const invalidSequence = {
        hash: 'sha256:1234567890123456789012345678901234567890123456789012345678901234',
        signature: 'sig',
        signer: 'did:agent:pi:agent1',
        chain_hash: 'sha256:1234567890123456789012345678901234567890123456789012345678901234',
        sequence: -1,
        anchored: false,
      };
      expect(validateReceipt(invalidSequence).valid).toBe(false);
    });
  });

  describe('verifyReceiptHash', () => {
    it('should return true for receipt matching header + body', () => {
      const hash = calculateMessageHash(header, body);
      const receipt: PPPReceipt = {
        hash,
        signature: 'MEUCIQD...',
        signer: 'did:agent:pi:agent1',
        chain_hash: 'sha256:1234567890123456789012345678901234567890123456789012345678901234',
        sequence: 1,
        anchored: false,
      };

      expect(verifyReceiptHash(header, body, receipt)).toBe(true);
    });

    it('should return false if header or body was tampered', () => {
      const hash = calculateMessageHash(header, body);
      const receipt: PPPReceipt = {
        hash,
        signature: 'MEUCIQD...',
        signer: 'did:agent:pi:agent1',
        chain_hash: 'sha256:1234567890123456789012345678901234567890123456789012345678901234',
        sequence: 1,
        anchored: false,
      };

      const tamperedHeader = { ...header, endpoint: 'pai://verify/tampered' };
      expect(verifyReceiptHash(tamperedHeader, body, receipt)).toBe(false);
    });
  });

  describe('validateTrustChain', () => {
    it('should validate monotonically increasing sequence numbers', () => {
      const baseReceipt = {
        hash: 'sha256:1234567890123456789012345678901234567890123456789012345678901234',
        signature: 'sig',
        signer: 'did:agent:pi:agent1',
        chain_hash: 'sha256:1234567890123456789012345678901234567890123456789012345678901234',
        anchored: false,
      };

      const receipts: PPPReceipt[] = [
        { ...baseReceipt, sequence: 100 },
        { ...baseReceipt, sequence: 101 },
        { ...baseReceipt, sequence: 102 },
      ];

      expect(validateTrustChain(receipts)).toBe(true);
    });

    it('should reject non-monotonic sequence numbers', () => {
      const baseReceipt = {
        hash: 'sha256:1234567890123456789012345678901234567890123456789012345678901234',
        signature: 'sig',
        signer: 'did:agent:pi:agent1',
        chain_hash: 'sha256:1234567890123456789012345678901234567890123456789012345678901234',
        anchored: false,
      };

      const receipts: PPPReceipt[] = [
        { ...baseReceipt, sequence: 100 },
        { ...baseReceipt, sequence: 99 },
      ];

      expect(validateTrustChain(receipts)).toBe(false);
    });
  });
});
