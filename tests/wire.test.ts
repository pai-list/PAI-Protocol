import { describe, it, expect } from 'vitest';
import { serializePPPMessage, parsePPPMessage } from '../src/wire.js';
import { PPPMessage } from '../src/types.js';

describe('PPP Wire Format (.ppp) Serialization & Parsing', () => {
  const sampleMessage: PPPMessage = {
    header: {
      proto: 'ppp/1.0',
      type: 'request',
      endpoint: 'pai://verify/kyc',
      id: 'msg_01hxxxxxxxxxxxxxxxxxxxx',
      from: 'did:agent:pi:agent1',
      to: 'did:agent:pi:agent2',
      ts: '2026-08-02T12:00:00Z',
      ttl: 30,
    },
    body: {
      type: 'verify.kyc',
      username: 'pioneer.username',
    },
    receipt: {
      hash: 'sha256:1234567890123456789012345678901234567890123456789012345678901234',
      signature: 'MEUCIQD...',
      signer: 'did:agent:pi:agent1',
      chain_hash: 'sha256:1234567890123456789012345678901234567890123456789012345678901234',
      sequence: 12345,
      anchored: true,
      anchor_tx: '0xabc123',
    },
  };

  it('should serialize a complete message to .ppp string format', () => {
    const raw = serializePPPMessage(sampleMessage);
    expect(raw).toContain('.ppp');
    expect(raw).toContain('---');
    expect(raw).toContain('"proto": "ppp/1.0"');
    expect(raw).toContain('"type": "verify.kyc"');
    expect(raw).toContain('"sequence": 12345');
  });

  it('should parse serialized .ppp message string back to object (round-trip)', () => {
    const serialized = serializePPPMessage(sampleMessage);
    const parsed = parsePPPMessage(serialized);
    expect(parsed).toEqual(sampleMessage);
  });

  it('should handle messages without a receipt section', () => {
    const noReceiptMsg: PPPMessage = {
      header: sampleMessage.header,
      body: sampleMessage.body,
    };

    const serialized = serializePPPMessage(noReceiptMsg);
    const parsed = parsePPPMessage(serialized);
    expect(parsed.header).toEqual(noReceiptMsg.header);
    expect(parsed.body).toEqual(noReceiptMsg.body);
    expect(parsed.receipt).toBeUndefined();
  });

  it('should parse example .ppp text directly from specification', () => {
    const specExample = `.ppp
{
  "proto": "ppp/1.0",
  "type": "request",
  "endpoint": "pai://verify",
  "id": "msg_01hxxxxxxxxxxxxxxxxxxxx",
  "from": "did:agent:pi:agent1",
  "to": "did:agent:pi:agent2",
  "ts": "2026-08-02T12:00:00Z",
  "ttl": 30
}
---
{
  "type": "verify.kyc",
  "username": "pioneer.username"
}
---
{
  "hash": "sha256:1234567890123456789012345678901234567890123456789012345678901234",
  "signature": "MEUCIQD...",
  "signer": "did:agent:pi:agent1",
  "chain_hash": "sha256:1234567890123456789012345678901234567890123456789012345678901234",
  "sequence": 12345,
  "anchored": true,
  "anchor_tx": "0xabc123"
}`;

    const parsed = parsePPPMessage(specExample);
    expect(parsed.header.proto).toBe('ppp/1.0');
    expect(parsed.header.endpoint).toBe('pai://verify');
    expect(parsed.body.type).toBe('verify.kyc');
    expect(parsed.receipt?.sequence).toBe(12345);
  });

  it('should throw Error when parsing empty or invalid content', () => {
    expect(() => parsePPPMessage('')).toThrow('Cannot parse empty or non-string message');
    expect(() => parsePPPMessage('Just single text line')).toThrow('Invalid PPP wire format');
  });
});
