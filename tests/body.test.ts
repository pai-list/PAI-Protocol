import { describe, it, expect } from 'vitest';
import { validateBody, parseBody, formatBody, createErrorBody } from '../src/body.js';

describe('PPP Body Parsing & Validation', () => {
  const validBody = {
    type: 'verify.kyc',
    username: 'pioneer.username',
    attributes: { age: 25, verified: true },
  };

  describe('validateBody', () => {
    it('should validate a valid body object', () => {
      const result = validateBody(validBody);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject non-object bodies', () => {
      expect(validateBody(null).valid).toBe(false);
      expect(validateBody('string').valid).toBe(false);
      expect(validateBody([1, 2, 3]).valid).toBe(false);
    });

    it('should reject bodies without a valid type field', () => {
      expect(validateBody({ username: 'test' }).valid).toBe(false);
      expect(validateBody({ type: '' }).valid).toBe(false);
      expect(validateBody({ type: 123 }).valid).toBe(false);
    });

    it('should enforce maximum body byte size limit', () => {
      const largeData = 'x'.repeat(100);
      const smallLimit = 50;
      const result = validateBody({ type: 'large.payload', data: largeData }, smallLimit);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('exceeds maximum permitted size');
    });
  });

  describe('parseBody', () => {
    it('should parse valid body object', () => {
      const body = parseBody(validBody);
      expect(body).toEqual(validBody);
    });

    it('should parse valid JSON string', () => {
      const jsonStr = JSON.stringify(validBody);
      const body = parseBody(jsonStr);
      expect(body).toEqual(validBody);
    });

    it('should throw error for invalid JSON string', () => {
      expect(() => parseBody('{ bad json')).toThrow('Body parsing failed: invalid JSON string');
    });
  });

  describe('createErrorBody', () => {
    it('should create a valid error body', () => {
      const errBody = createErrorBody('UNAUTHORIZED', 'Invalid signature', { reason: 'expired' }, false);
      expect(errBody).toEqual({
        type: 'error',
        code: 'UNAUTHORIZED',
        message: 'Invalid signature',
        retryable: false,
        details: { reason: 'expired' },
      });
      expect(validateBody(errBody).valid).toBe(true);
    });

    it('should include retry_after when provided', () => {
      const errBody = createErrorBody('RATE_LIMITED', 'Too many requests', undefined, true, 60);
      expect(errBody.retryable).toBe(true);
      expect(errBody.retry_after).toBe(60);
    });
  });

  describe('formatBody', () => {
    it('should format body object to pretty JSON string', () => {
      const formatted = formatBody(validBody);
      expect(formatted).toContain('"type": "verify.kyc"');
      expect(JSON.parse(formatted)).toEqual(validBody);
    });
  });
});
