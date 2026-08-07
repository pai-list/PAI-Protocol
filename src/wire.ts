import { PPPMessage } from './types.js';
import { parseHeader, formatHeader } from './header.js';
import { parseBody, formatBody } from './body.js';
import { parseReceipt } from './receipt.js';

/**
 * Serializes a PPPMessage object into a standard `.ppp` document string wire format.
 */
export function serializePPPMessage(message: PPPMessage): string {
  const parts: string[] = ['.ppp'];

  parts.push(formatHeader(message.header));
  parts.push(formatBody(message.body));

  if (message.receipt) {
    parts.push(JSON.stringify(message.receipt, null, 2));
  }

  return parts.join('\n---\n') + '\n';
}

/**
 * Parses a raw `.ppp` wire format string into a validated PPPMessage object.
 */
export function parsePPPMessage(rawMessage: string): PPPMessage {
  if (typeof rawMessage !== 'string' || !rawMessage.trim()) {
    throw new Error('Cannot parse empty or non-string message');
  }

  let text = rawMessage.trim();

  // Strip magic preamble if present
  if (text.startsWith('.ppp')) {
    text = text.substring(4).trim();
    if (text.startsWith('---')) {
      text = text.substring(3).trim();
    }
  }

  // Split sections by `---` line boundary
  const sections = text
    .split(/\r?\n---\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (sections.length < 2) {
    throw new Error('Invalid PPP wire format: expected at least Header and Body sections separated by "---"');
  }

  const header = parseHeader(sections[0]);
  const body = parseBody(sections[1]);

  let receipt;
  if (sections.length >= 3) {
    receipt = parseReceipt(sections[2]);
  }

  return {
    header,
    body,
    ...(receipt ? { receipt } : {}),
  };
}
