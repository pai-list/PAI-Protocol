import { PPPErrorCode, PPPHeader, PPPMessage } from './types.js';
import { createHeader } from './header.js';
import { createErrorBody } from './body.js';

export const PPP_ERROR_HTTP_MAP: Record<PPPErrorCode, number> = {
  INVALID_PROTO: 400,
  INVALID_MESSAGE: 400,
  INVALID_HEADER: 400,
  INVALID_BODY: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  RATE_LIMITED: 429,
  ENDPOINT_ERROR: 500,
  ROUTING_FAILED: 502,
  SERVICE_UNAVAILABLE: 503,
  TIMEOUT: 504,
};

export const PPP_ERROR_RETRYABLE: Record<PPPErrorCode, boolean> = {
  INVALID_PROTO: false,
  INVALID_MESSAGE: false,
  INVALID_HEADER: false,
  INVALID_BODY: false,
  UNAUTHORIZED: false,
  FORBIDDEN: false,
  NOT_FOUND: false,
  METHOD_NOT_ALLOWED: false,
  RATE_LIMITED: true,
  ENDPOINT_ERROR: true,
  ROUTING_FAILED: true,
  SERVICE_UNAVAILABLE: true,
  TIMEOUT: true,
};

/**
 * Maps a PPP error code to corresponding HTTP status code.
 */
export function mapErrorToHttpStatus(code: PPPErrorCode): number {
  return PPP_ERROR_HTTP_MAP[code] ?? 500;
}

/**
 * Checks whether a PPP error is retryable.
 */
export function isRetryableError(code: PPPErrorCode): boolean {
  return PPP_ERROR_RETRYABLE[code] ?? false;
}

/**
 * Helper to generate a standardized PPP error response message for a request.
 */
export function createErrorResponse(
  requestHeader: PPPHeader,
  code: PPPErrorCode,
  message: string,
  details?: Record<string, unknown>,
  responderDID?: string
): PPPMessage {
  const isRetryable = isRetryableError(code);

  const responseHeader = createHeader({
    proto: requestHeader.proto,
    type: 'response',
    endpoint: requestHeader.endpoint,
    id: `msg_err_${Date.now()}`,
    from: responderDID ?? requestHeader.to,
    to: requestHeader.from,
    ts: new Date().toISOString(),
  });

  const responseBody = createErrorBody(code, message, details, isRetryable);

  return {
    header: responseHeader,
    body: responseBody,
  };
}
