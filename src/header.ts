import { PPPHeader, PPPMessageType } from './types.js';
import { isValidDID } from './did.js';

const PROTO_REGEX = /^ppp\/\d+\.\d+$/;
const ENDPOINT_REGEX = /^pai:\/\/[a-z0-9_-]+(\/[a-z0-9_.-]+)*$/i;
const ISO8601_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
const VALID_TYPES: PPPMessageType[] = ['request', 'response', 'event'];

/**
 * Validates a PPPHeader object and returns any validation errors.
 */
export function validateHeader(header: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (typeof header !== 'object' || header === null) {
    return { valid: false, errors: ['Header must be a non-null object'] };
  }

  const h = header as Record<string, unknown>;

  // proto
  if (typeof h.proto !== 'string' || !PROTO_REGEX.test(h.proto)) {
    errors.push(`Invalid 'proto' field: expected format 'ppp/<major>.<minor>', got "${h.proto}"`);
  }

  // type
  if (typeof h.type !== 'string' || !VALID_TYPES.includes(h.type as PPPMessageType)) {
    errors.push(`Invalid 'type' field: expected one of ['request', 'response', 'event'], got "${h.type}"`);
  }

  // endpoint
  if (typeof h.endpoint !== 'string' || !ENDPOINT_REGEX.test(h.endpoint)) {
    errors.push(`Invalid 'endpoint' URI: expected 'pai://<domain>/<action>', got "${h.endpoint}"`);
  }

  // id
  if (typeof h.id !== 'string' || !h.id.trim()) {
    errors.push(`Invalid 'id' field: expected non-empty message ID string, got "${h.id}"`);
  }

  // from
  if (typeof h.from !== 'string' || !isValidDID(h.from)) {
    errors.push(`Invalid 'from' field: expected valid DID, got "${h.from}"`);
  }

  // to
  if (typeof h.to !== 'string' || !isValidDID(h.to, true)) {
    errors.push(`Invalid 'to' field: expected valid DID or '*', got "${h.to}"`);
  }

  // ts
  if (typeof h.ts !== 'string' || !ISO8601_REGEX.test(h.ts) || isNaN(Date.parse(h.ts))) {
    errors.push(`Invalid 'ts' field: expected valid ISO8601 timestamp string, got "${h.ts}"`);
  }

  // ttl
  if (h.ttl !== undefined && (typeof h.ttl !== 'number' || !Number.isInteger(h.ttl) || h.ttl <= 0)) {
    errors.push(`Invalid 'ttl' field: expected positive integer, got "${h.ttl}"`);
  }

  // Optional string fields
  for (const field of ['trace', 'agent', 'session', 'lang']) {
    if (h[field] !== undefined && typeof h[field] !== 'string') {
      errors.push(`Invalid '${field}' field: expected string, got "${typeof h[field]}"`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Parses raw JSON string or object into a validated PPPHeader.
 * Throws Error if header is invalid.
 */
export function parseHeader(rawHeader: unknown): PPPHeader {
  let parsed: unknown = rawHeader;
  if (typeof rawHeader === 'string') {
    try {
      parsed = JSON.parse(rawHeader);
    } catch {
      throw new Error('Header parsing failed: invalid JSON string');
    }
  }

  const { valid, errors } = validateHeader(parsed);
  if (!valid) {
    throw new Error(`Header validation failed: ${errors.join('; ')}`);
  }

  const h = parsed as Record<string, unknown>;
  const header: PPPHeader = {
    proto: h.proto as string,
    type: h.type as PPPMessageType,
    endpoint: h.endpoint as string,
    id: h.id as string,
    from: h.from as string,
    to: h.to as string,
    ts: h.ts as string,
    ttl: typeof h.ttl === 'number' ? h.ttl : 30,
  };

  if (typeof h.trace === 'string') header.trace = h.trace;
  if (typeof h.agent === 'string') header.agent = h.agent;
  if (typeof h.session === 'string') header.session = h.session;
  if (typeof h.lang === 'string') header.lang = h.lang;

  return header;
}

/**
 * Creates a validated PPPHeader object.
 */
export function createHeader(
  params: Omit<PPPHeader, 'proto' | 'ts' | 'ttl'> & Partial<Pick<PPPHeader, 'proto' | 'ts' | 'ttl'>>
): PPPHeader {
  const header: PPPHeader = {
    proto: params.proto ?? 'ppp/1.0',
    type: params.type,
    endpoint: params.endpoint,
    id: params.id,
    from: params.from,
    to: params.to,
    ts: params.ts ?? new Date().toISOString(),
    ttl: params.ttl ?? 30,
    ...(params.trace ? { trace: params.trace } : {}),
    ...(params.agent ? { agent: params.agent } : {}),
    ...(params.session ? { session: params.session } : {}),
    ...(params.lang ? { lang: params.lang } : {}),
  };

  const { valid, errors } = validateHeader(header);
  if (!valid) {
    throw new Error(`Failed to create header: ${errors.join('; ')}`);
  }

  return header;
}

/**
 * Formats header object to JSON string.
 */
export function formatHeader(header: PPPHeader): string {
  const { valid, errors } = validateHeader(header);
  if (!valid) {
    throw new Error(`Cannot format invalid header: ${errors.join('; ')}`);
  }
  return JSON.stringify(header, null, 2);
}
