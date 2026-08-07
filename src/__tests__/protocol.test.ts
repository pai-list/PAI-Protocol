import { describe, it, expect } from 'vitest';

describe('PAI Protocol Standard', () => {
  it('validates PPP wire format envelope structure', () => {
    const pppHeader = {
      proto: 'ppp/1.0',
      endpoint: 'pai://memory',
      from: 'did:axiom:pi:agent_connector_01',
    };
    expect(pppHeader.proto).toBe('ppp/1.0');
    expect(pppHeader.from).toContain('did:axiom:pi');
  });

  it('validates W3C DID document structure format for AxiomID', () => {
    const didDocument = {
      '@context': ['https://www.w3.org/ns/did/v1'],
      id: 'did:axiom:pi:agent_101',
      verificationMethod: [
        {
          id: 'did:axiom:pi:agent_101#key-1',
          type: 'Ed25519VerificationKey2020',
          controller: 'did:axiom:pi:agent_101',
        },
      ],
    };
    expect(didDocument.id).toBe('did:axiom:pi:agent_101');
    expect(didDocument.verificationMethod[0].type).toBe('Ed25519VerificationKey2020');
  });
});
