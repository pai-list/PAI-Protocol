import { describe, it, expect } from 'vitest';
import { isValidDID, isValidAgentDID, parseDID } from '../src/did.js';

describe('DID Validation & Parsing', () => {
  describe('isValidDID', () => {
    it('should validate valid W3C DID identifiers', () => {
      expect(isValidDID('did:agent:pi:agent1')).toBe(true);
      expect(isValidDID('did:agent:12345')).toBe(true);
      expect(isValidDID('did:key:z6MkpTHR8VNsBxYAAWJY16enHP5PxB326g563NT5Jbk37z29')).toBe(true);
      expect(isValidDID('did:web:example.com')).toBe(true);
    });

    it('should handle wildcard * only when allowWildcard is true', () => {
      expect(isValidDID('*')).toBe(false);
      expect(isValidDID('*', true)).toBe(true);
    });

    it('should reject invalid DID formats', () => {
      expect(isValidDID('')).toBe(false);
      expect(isValidDID('not-a-did')).toBe(false);
      expect(isValidDID('did:')).toBe(false);
      expect(isValidDID('did:agent')).toBe(false);
      expect(isValidDID('http://example.com')).toBe(false);
      expect(isValidDID(null as unknown as string)).toBe(false);
      expect(isValidDID(12345 as unknown as string)).toBe(false);
    });
  });

  describe('isValidAgentDID', () => {
    it('should validate PAI agent DIDs', () => {
      expect(isValidAgentDID('did:agent:pi:agent1')).toBe(true);
      expect(isValidAgentDID('did:agent:peekaaboo')).toBe(true);
      expect(isValidAgentDID('did:agent:pi:user_x')).toBe(true);
    });

    it('should reject non-agent DIDs', () => {
      expect(isValidAgentDID('did:key:z6Mk...')).toBe(false);
      expect(isValidAgentDID('did:web:example.com')).toBe(false);
      expect(isValidAgentDID('agent:pi:agent1')).toBe(false);
    });
  });

  describe('parseDID', () => {
    it('should correctly parse standard DIDs with namespace', () => {
      const parsed = parseDID('did:agent:pi:agent1');
      expect(parsed).toEqual({
        scheme: 'did',
        method: 'agent',
        namespace: 'pi',
        id: 'agent1',
        raw: 'did:agent:pi:agent1',
      });
    });

    it('should correctly parse simple DIDs without namespace', () => {
      const parsed = parseDID('did:web:example.com');
      expect(parsed).toEqual({
        scheme: 'did',
        method: 'web',
        id: 'example.com',
        raw: 'did:web:example.com',
      });
    });

    it('should throw Error when parsing malformed DIDs', () => {
      expect(() => parseDID('invalid-did')).toThrow('Invalid DID format: "invalid-did"');
    });
  });
});
