# Agent Well-Known Protocol

**Discovery & runtime contract standard for PAI agents.** Every agent is reachable at `<agent-id>.axiomid.app` and exposes machine-readable metadata at `/.well-known/*` paths — the agent equivalent of OAuth's `openid-configuration`.

## Design changes

- **"Runtime Manifest" renamed → Agent Runtime Contract** (signable document, not a stateless display blob).
- **YAML display removed** — agents expose metadata as JSON at `/.well-known/*` endpoints only.

## Base URL

```
https://<agent-id>.axiomid.app/
```

## Well-Known Endpoints

| Path | Returns | Purpose |
|------|---------|---------|
| `/.well-known/runtime` | Runtime Contract JSON | Identity, capabilities, policy, memory, trust, loops, proofs |
| `/.well-known/constitution` | Agent Constitution | Signable governance doc the agent is bound to |
| `/.well-known/capabilities` | Capability descriptors | MCP tools, schemas, integration points |
| `/.well-known/proofs` | Latest performance proof | PPP-2 / TrustChain head ref |
| `/.well-known/agent-voucher` | PAI-COIN voucher | Optional per-agent earnings book |

## Runtime Contract (the renamed "manifest")

```json
{
  "wellKnown_version": "1.0",
  "runtime_version": "1.0",
  "agent": {
    "id": "did:agent:pi:peekaaboo",
    "name": "peekaaboo.ai",
    "version": "0.1.0",
    "domain": "peekaaboo.axiomid.app"
  },
  "identity": {
    "did": "did:agent:pi:peekaaboo",
    "issuer": "axiomid",
    "sig": "MEUCIQD..."
  },
  "capabilities": [
    { "id": "vision.inspect", "version": "1.0", "cost": "0.005", "unit": "π" }
  ],
  "policy": {
    "payPerPrompt": 0.01,
    "payPerToken": null,
    "refundPolicy": "full-on-bad-proof",
    "reputationPolicy": "economic-validators"
  },
  "memory": { "scope": "sandbox", "persistenceDays": 30 },
  "trust": {
    "anchoredTo": "axiomid",
    "trustchainHandle": "did:agent:pi:peekaaboo/ch/latest"
  },
  "loops": {
    "attentionMining": true,
    "computeCredit": false,
    "moderationDAO": true,
    "strategyVault": false
  },
  "proofs": {
    "lastProofRef": "https://peekaaboo.axiomid.app/.well-known/proofs"
  }
}
```

## Capabilities Endpoint

```json
// /.well-known/capabilities
{
  "version": "1.0",
  "entry": "/mcp",
  "tools": [
    {
      "name": "inspect",
      "description": "Return vision analysis of agent viewport",
      "inputSchema": { "type": "object", "properties": {} },
      "endpoint": "https://peekaaboo.axiomid.app/mcp/inspect",
      "cost": 0.01,
      "unit": "π"
    }
  ]
}
```

## Constitution Endpoint

Returns the signed governance contract (SOUL Protocol doc). Verifier can confirm the agent agreed to be bound.

```json
{
  "version": "1.0",
  "constitution_ref": "did:agent:pi:peekaaboo/constitution",
  "constitution_hash": "sha256:...",
  "sig": "MEUCIQD...",
  "ratified": "2026-08-06T12:00:00Z"
}
```

## Proofs Endpoint

Exposes TrustChain head + latest PPP-2 performance proofs:

```json
{
  "version": "1.0",
  "trustchainHead": "sha256:abc123...",
  "latestProofs": ["sha256:d7f2...", "sha256:9ab1..."],
  "sequence": 12345
}
```

## Signable

All well-known documents are **signable** by the agent's identity key (`did:agent:pi:...`), binding the published contract to the agent keypair. Signature alg: Ed25519.

## Worker Implementation

```typescript
// skeleton — served by any agent's Worker
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const route = url.pathname;
    if (route === '/.well-known/runtime') return json(runtimeContract);
    if (route === '/.well-known/constitution') return json(constitution);
    if (route === '/.well-known/capabilities') return json(capabilities);
    if (route === '/.well-known/proofs') return json(proofs);
    return text('PAI agent. See /.well-known/runtime');
  }
}
```

## OpenID-style Discovery

`GET /<agent-id>.axiomid.app/.well-known/openid-configuration`
agents can redirect/discover each other's capability + policy before a PPP-1 handshake.

---

## Next: [Error Handling](/spec/error-handling)