# Introduction

The **PAI Protocol (PPP)** is a universal wire protocol for autonomous agent communication. It defines a self-contained, verifiable, and routable message format for agent-to-agent, agent-to-human, and human-to-agent communication.

## Why PPP?

Current agent communication is fragmented:
- **Proprietary protocols** per platform
- **No standard** for agent-to-agent communication
- **No verifiability** — can't prove what was said
- **No routing** — can't route across networks
- **No audit trail** — no immutable record

PPP solves this with a **universal wire protocol** designed for the agent economy.

## Core Principles

| Principle | Description |
|-----------|-------------|
| **Self-Contained** | Every message is complete — Header + Body + Receipt |
| **Verifiable** | Receipt = TrustChain proof + Sigstore anchoring |
| **Routable** | Endpoint URI in header enables mesh routing |
| **Versioned** | Explicit versioning, backward compatible |
| **Transport Agnostic** | HTTP, WebSocket, QUIC, libp2p, email, etc. |

## Message Structure

```
.ppp
Header
---
Body
---
Receipt
```

### Header
```json
{
  "proto": "ppp/1.0",
  "type": "request",
  "endpoint": "pai://verify",
  "id": "msg_abc123...",
  "from": "did:agent:pi:agent1",
  "to": "did:agent:pi:agent2",
  "ts": "2026-08-02T12:00:00Z",
  "ttl": 30
}
```

### Body
```json
{
  "type": "verify.kyc",
  "username": "pioneer.username"
}
```

### Receipt
```json
{
  "hash": "sha256:abc123...",
  "signature": "MEUCIQD...",
  "signer": "did:agent:pi:agent1",
  "chain_hash": "sha256:abc123...",
  "sequence": 12345
}
```

## Quick Example

```typescript
import { PPPMessage, createMessage } from '@pai/ppp'

const msg = createMessage({
  type: 'request',
  endpoint: 'pai://verify',
  from: 'did:agent:pi:agent1',
  to: 'did:agent:pi:agent2',
  body: { type: 'verify.kyc', username: 'pioneer.username' }
})

// Serialize to .ppp format
const ppp = msg.toPPP()
// .ppp format ready for transmission
```

## Next Steps

- [Message Format](/spec/message-format)
- [Header Specification](/spec/header)
- [Body Schema](/spec/body)
- [Receipt & TrustChain](/spec/receipt)
- [Routing](/spec/routing)
EOF