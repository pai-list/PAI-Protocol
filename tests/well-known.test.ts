import { describe, it, expect } from 'vitest';
import { validateRuntimeContract, parseRuntimeContract } from '../src/well-known.js';
import { AgentRuntimeContract } from '../src/types.js';

describe('Agent Well-Known Protocol', () => {
  const sampleContract: AgentRuntimeContract = {
    wellKnown_version: '1.0',
    runtime_version: '1.0',
    agent: {
      id: 'did:agent:pi:peekaaboo',
      name: 'peekaaboo.ai',
      version: '0.1.0',
      domain: 'peekaaboo.axiomid.app',
    },
    identity: {
      did: 'did:agent:pi:peekaaboo',
      issuer: 'axiomid',
      sig: 'MEUCIQD...',
    },
    capabilities: [
      { id: 'vision.inspect', version: '1.0', cost: '0.005', unit: 'π' },
    ],
    policy: {
      payPerPrompt: 0.01,
      payPerToken: null,
      refundPolicy: 'full-on-bad-proof',
      reputationPolicy: 'economic-validators',
    },
    memory: { scope: 'sandbox', persistenceDays: 30 },
    trust: {
      anchoredTo: 'axiomid',
      trustchainHandle: 'did:agent:pi:peekaaboo/ch/latest',
    },
    loops: {
      attentionMining: true,
      computeCredit: false,
      moderationDAO: true,
      strategyVault: false,
    },
    proofs: {
      lastProofRef: 'https://peekaaboo.axiomid.app/.well-known/proofs',
    },
  };

  it('should validate a correct Agent Runtime Contract', () => {
    const result = validateRuntimeContract(sampleContract);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should parse contract object and JSON string', () => {
    const parsedObj = parseRuntimeContract(sampleContract);
    expect(parsedObj).toEqual(sampleContract);

    const jsonStr = JSON.stringify(sampleContract);
    const parsedStr = parseRuntimeContract(jsonStr);
    expect(parsedStr).toEqual(sampleContract);
  });

  it('should reject invalid contracts missing required fields', () => {
    const invalid = { ...sampleContract, agent: { id: 'invalid-did' } };
    expect(validateRuntimeContract(invalid).valid).toBe(false);
  });
});
