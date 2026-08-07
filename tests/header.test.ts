import { describe, it, expect } from 'vitest';
import { validateHeader, parseHeader, createHeader, formatHeader } from '../src/header.js';
import { PPPHeader } from '../src/types.js';

describe('PPP Header Parsing & Validation', () => {
  const validHeader: PPPHeader = {
    proto: 'ppp/1.0',
    type: 'request',
    endpoint: 'pai://verify/kyc',
    id: 'msg_01hxxxxxxxxxxxxxxxxxxxx',
    from: 'did:agent:pi:agent1',
    to: 'did:agent:pi:agent2',
    ts: '2026-08-02T12:00:00Z',
    ttl: 30,
  };

  describe('validateHeader', () => {
    it('should validate a correct PPP header', () => {
      const result = validateHeader(validHeader);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate headers with broadcast recipient *', () => {
      const broadcastHeader = { ...validHeader, to: '*' };
      const result = validateHeader(broadcastHeader);
      expect(result.valid).toBe(true);
    });

    it('should validate headers with optional metadata fields', () => {
      const metaHeader = {
        ...validHeader,
        trace: 'trace-12345',
        agent: 'pai-agent/1.0.0',
        session: 'sess-abc',
        lang: 'en',
      };
      const result = validateHeader(metaHeader);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid protocol versions', () => {
      const invalid = { ...validHeader, proto: 'invalid/1.0' };
      const result = validateHeader(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("Invalid 'proto' field");
    });

    it('should reject invalid message types', () => {
      const invalid = { ...validHeader, type: 'command' };
      const result = validateHeader(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("Invalid 'type' field");
    });

    it('should reject invalid endpoint URIs', () => {
      const invalid = { ...validHeader, endpoint: 'http://verify/kyc' };
      const result = validateHeader(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("Invalid 'endpoint' URI");
    });

    it('should reject invalid DIDs in from/to', () => {
      const invalidFrom = { ...validHeader, from: 'not-a-did' };
      expect(validateHeader(invalidFrom).valid).toBe(false);

      const invalidTo = { ...validHeader, to: 'bad-did' };
      expect(validateHeader(invalidTo).valid).toBe(false);
    });

    it('should reject invalid timestamps', () => {
      const invalid = { ...validHeader, ts: '2026-99-99T99:99:99Z' };
      const result = validateHeader(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("Invalid 'ts' field");
    });

    it('should reject non-positive integer TTL', () => {
      const invalidNegative = { ...validHeader, ttl: -5 };
      expect(validateHeader(invalidNegative).valid).toBe(false);

      const invalidFloat = { ...validHeader, ttl: 12.5 };
      expect(validateHeader(invalidFloat).valid).toBe(false);
    });
  });

  describe('parseHeader', () => {
    it('should parse valid header object', () => {
      const header = parseHeader(validHeader);
      expect(header).toEqual(validHeader);
    });

    it('should parse valid header JSON string', () => {
      const jsonStr = JSON.stringify(validHeader);
      const header = parseHeader(jsonStr);
      expect(header).toEqual(validHeader);
    });

    it('should throw error for malformed JSON string', () => {
      expect(() => parseHeader('{ invalid json')).toThrow('Header parsing failed: invalid JSON string');
    });

    it('should throw error for invalid header fields', () => {
      const invalid = { ...validHeader, type: 'invalid' };
      expect(() => parseHeader(invalid)).toThrow('Header validation failed');
    });
  });

  describe('createHeader', () => {
    it('should create a valid header with defaults', () => {
      const header = createHeader({
        type: 'request',
        endpoint: 'pai://verify',
        id: 'msg_100',
        from: 'did:agent:pi:agent1',
        to: 'did:agent:pi:agent2',
      });

      expect(header.proto).toBe('ppp/1.0');
      expect(header.ttl).toBe(30);
      expect(header.ts).toBeDefined();
      expect(validateHeader(header).valid).toBe(true);
    });
  });

  describe('formatHeader', () => {
    it('should format header to pretty JSON string', () => {
      const formatted = formatHeader(validHeader);
      expect(formatted).toContain('"proto": "ppp/1.0"');
      expect(JSON.parse(formatted)).toEqual(validHeader);
    });
  });
});
