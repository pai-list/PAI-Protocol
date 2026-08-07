import { PPPBody, PPPErrorBody, PPPErrorCode } from './types.js';

const DEFAULT_MAX_BODY_BYTES = 1048576; // 1 MB

/**
 * Validates a PPP body object.
 */
export function validateBody(
  body: unknown,
  maxSizeBytes = DEFAULT_MAX_BODY_BYTES
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { valid: false, errors: ['Body must be a non-null object'] };
  }

  const b = body as Record<string, unknown>;

  if (typeof b.type !== 'string' || !b.type.trim()) {
    errors.push(`Invalid 'type' field in body: expected non-empty string, got "${b.type}"`);
  }

  const serialized = JSON.stringify(body);
  const byteLength = Buffer.byteLength(serialized, 'utf-8');
  if (byteLength > maxSizeBytes) {
    errors.push(`Body size (${byteLength} bytes) exceeds maximum permitted size of ${maxSizeBytes} bytes`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Parses raw JSON string or object into a validated PPPBody.
 */
export function parseBody(rawBody: unknown, maxSizeBytes = DEFAULT_MAX_BODY_BYTES): PPPBody {
  let parsed: unknown = rawBody;
  if (typeof rawBody === 'string') {
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      throw new Error('Body parsing failed: invalid JSON string');
    }
  }

  const { valid, errors } = validateBody(parsed, maxSizeBytes);
  if (!valid) {
    throw new Error(`Body validation failed: ${errors.join('; ')}`);
  }

  return parsed as PPPBody;
}

/**
 * Formats body object to JSON string.
 */
export function formatBody(body: PPPBody): string {
  const { valid, errors } = validateBody(body);
  if (!valid) {
    throw new Error(`Cannot format invalid body: ${errors.join('; ')}`);
  }
  return JSON.stringify(body, null, 2);
}

/**
 * Creates a standard PPP error body.
 */
export function createErrorBody(
  code: PPPErrorCode,
  message: string,
  details?: Record<string, unknown>,
  retryable = false,
  retryAfter?: number
): PPPErrorBody {
  const errorBody: PPPErrorBody = {
    type: 'error',
    code,
    message,
    retryable,
    ...(details ? { details } : {}),
    ...(retryAfter !== undefined ? { retry_after: retryAfter } : {}),
  };

  const { valid, errors } = validateBody(errorBody);
  if (!valid) {
    throw new Error(`Failed to create error body: ${errors.join('; ')}`);
  }

  return errorBody;
}
