import { DIDParsed } from './types.js';

// Regex matching general W3C DID format: did:<method>:<method-specific-id>
const DID_REGEX = /^did:([a-z0-9]+):((?:[a-zA-Z0-9_.-]+:)*[a-zA-Z0-9_.-]+)$/;

// Regex specifically for PAI agent DIDs: did:agent:<namespace>:<identifier> or did:agent:<identifier>
const AGENT_DID_REGEX = /^did:agent:(?:([a-zA-Z0-9_.-]+):)?([a-zA-Z0-9_.-]+)$/;

/**
 * Validates whether a string is a valid W3C DID syntax or wildcard '*'.
 */
export function isValidDID(did: string, allowWildcard = false): boolean {
  if (typeof did !== 'string' || !did.trim()) {
    return false;
  }
  if (allowWildcard && did === '*') {
    return true;
  }
  return DID_REGEX.test(did);
}

/**
 * Validates whether a string is a valid PAI Agent DID (e.g. `did:agent:pi:agent1`).
 */
export function isValidAgentDID(did: string): boolean {
  if (typeof did !== 'string') {
    return false;
  }
  return AGENT_DID_REGEX.test(did);
}

/**
 * Parses a DID string into its structured components.
 * Throws Error if the DID is invalid.
 */
export function parseDID(did: string): DIDParsed {
  if (!isValidDID(did)) {
    throw new Error(`Invalid DID format: "${did}"`);
  }

  const matches = did.match(DID_REGEX);
  if (!matches) {
    throw new Error(`Failed to parse DID: "${did}"`);
  }

  const method = matches[1];
  const specificId = matches[2];

  const parts = specificId.split(':');
  if (parts.length > 1) {
    const id = parts.pop()!;
    const namespace = parts.join(':');
    return {
      scheme: 'did',
      method,
      namespace,
      id,
      raw: did,
    };
  }

  return {
    scheme: 'did',
    method,
    id: specificId,
    raw: did,
  };
}
