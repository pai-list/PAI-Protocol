import { describe, it, expect } from 'vitest';
import { mapErrorToHttpStatus, isRetryableError, createErrorResponse } from '../src/errors.js';
import { PPPErrorCode, PPPHeader } from '../src/types.js';

describe('PPP Error Codes & Handling', () => {
  const requestHeader: PPPHeader = {
    proto: 'ppp/1.0',
    type: 'request',
    endpoint: 'pai://verify/kyc',
    id: 'msg_1001',
    from: 'did:agent:pi:requester',
    to: 'did:agent:pi:service',
    ts: '2026-08-02T12:00:00Z',
    ttl: 30,
  };

  describe('mapErrorToHttpStatus', () => {
    it('should correctly map error codes to HTTP status codes', () => {
      expect(mapErrorToHttpStatus('INVALID_HEADER')).toBe(400);
      expect(mapErrorToHttpStatus('UNAUTHORIZED')).toBe(401);
      expect(mapErrorToHttpStatus('FORBIDDEN')).toBe(403);
      expect(mapErrorToHttpStatus('NOT_FOUND')).toBe(404);
      expect(mapErrorToHttpStatus('METHOD_NOT_ALLOWED')).toBe(405);
      expect(mapErrorToHttpStatus('RATE_LIMITED')).toBe(429);
      expect(mapErrorToHttpStatus('ENDPOINT_ERROR')).toBe(500);
      expect(mapErrorToHttpStatus('ROUTING_FAILED')).toBe(502);
      expect(mapErrorToHttpStatus('SERVICE_UNAVAILABLE')).toBe(503);
      expect(mapErrorToHttpStatus('TIMEOUT')).toBe(504);
    });
  });

  describe('isRetryableError', () => {
    it('should return false for 4xx client errors', () => {
      const clientErrors: PPPErrorCode[] = [
        'INVALID_PROTO',
        'INVALID_MESSAGE',
        'INVALID_HEADER',
        'INVALID_BODY',
        'UNAUTHORIZED',
        'FORBIDDEN',
        'NOT_FOUND',
        'METHOD_NOT_ALLOWED',
      ];
      for (const err of clientErrors) {
        expect(isRetryableError(err)).toBe(false);
      }
    });

    it('should return true for rate limits and server/network errors', () => {
      const retryableErrors: PPPErrorCode[] = [
        'RATE_LIMITED',
        'ENDPOINT_ERROR',
        'ROUTING_FAILED',
        'SERVICE_UNAVAILABLE',
        'TIMEOUT',
      ];
      for (const err of retryableErrors) {
        expect(isRetryableError(err)).toBe(true);
      }
    });
  });

  describe('createErrorResponse', () => {
    it('should create a valid PPP error response message', () => {
      const errResponse = createErrorResponse(
        requestHeader,
        'NOT_FOUND',
        'Requested resource not found',
        { resourceId: '123' }
      );

      expect(errResponse.header.type).toBe('response');
      expect(errResponse.header.from).toBe('did:agent:pi:service');
      expect(errResponse.header.to).toBe('did:agent:pi:requester');
      expect(errResponse.header.endpoint).toBe('pai://verify/kyc');

      expect(errResponse.body.type).toBe('error');
      expect(errResponse.body.code).toBe('NOT_FOUND');
      expect(errResponse.body.message).toBe('Requested resource not found');
      expect(errResponse.body.retryable).toBe(false);
      expect(errResponse.body.details).toEqual({ resourceId: '123' });
    });
  });
});
