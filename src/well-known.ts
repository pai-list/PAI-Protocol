import { AgentRuntimeContract } from './types.js';
import { isValidDID } from './did.js';

/**
 * Validates an AgentRuntimeContract object.
 */
export function validateRuntimeContract(contract: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (typeof contract !== 'object' || contract === null) {
    return { valid: false, errors: ['Runtime contract must be a non-null object'] };
  }

  const c = contract as Record<string, unknown>;

  if (typeof c.wellKnown_version !== 'string') {
    errors.push(`Missing or invalid 'wellKnown_version'`);
  }

  if (typeof c.runtime_version !== 'string') {
    errors.push(`Missing or invalid 'runtime_version'`);
  }

  if (typeof c.agent !== 'object' || c.agent === null) {
    errors.push(`Missing or invalid 'agent' section`);
  } else {
    const agent = c.agent as Record<string, unknown>;
    if (typeof agent.id !== 'string' || !isValidDID(agent.id)) {
      errors.push(`Invalid agent.id DID: "${agent.id}"`);
    }
    if (typeof agent.name !== 'string') errors.push(`Missing agent.name`);
    if (typeof agent.domain !== 'string') errors.push(`Missing agent.domain`);
  }

  if (typeof c.identity !== 'object' || c.identity === null) {
    errors.push(`Missing or invalid 'identity' section`);
  }

  if (!Array.isArray(c.capabilities)) {
    errors.push(`'capabilities' must be an array`);
  }

  if (typeof c.policy !== 'object' || c.policy === null) {
    errors.push(`Missing or invalid 'policy' section`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Parses raw JSON string or object into a validated AgentRuntimeContract.
 */
export function parseRuntimeContract(raw: unknown): AgentRuntimeContract {
  let parsed: unknown = raw;
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error('Failed to parse runtime contract: invalid JSON string');
    }
  }

  const { valid, errors } = validateRuntimeContract(parsed);
  if (!valid) {
    throw new Error(`Runtime contract validation failed: ${errors.join('; ')}`);
  }

  return parsed as AgentRuntimeContract;
}
