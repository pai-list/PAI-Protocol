# PAI Protocol (PPP)

**Universal Wire Protocol for Autonomous Agents**

PPP defines a self-contained, verifiable, and routable message format for agent-to-agent, agent-to-human, and human-to-agent communication.

## Specification

| Document | Description |
|----------|-------------|
| [Message Format](spec/message-format.md) | Complete `.ppp` document structure |
| [Header](spec/header.md) | Routing and metadata fields |
| [Body](spec/body.md) | Application payload schema |
| [Receipt & TrustChain](spec/receipt.md) | Cryptographic proof and audit trail |
| [Routing](spec/routing.md) | Mesh routing via endpoint URIs |
| [Error Handling](spec/error-handling.md) | Standard error codes and responses |
| [Governance & Collaboration](docs/governance.md) | Distributed review roles, community vetting, ADR loop |

## Whitepaper

| Document | Description |
|----------|-------------|
| [Executive Summary](whitepaper/executive-summary.md) | High-level overview |
| [Architecture](whitepaper/architecture.md) | Technical architecture |

## Implementations

| Language | Repository | Status |
|----------|------------|--------|
| TypeScript | [@pai/ppp](https://github.com/pai-list/pai-agent-kit) | Planned |
| Rust | [pai-ppp-rs](https://github.com/pai-list/pai-ppp-rs) | Planned |
| Go | [pai-ppp-go](https://github.com/pai-list/pai-ppp-go) | Planned |
| Python | [pai-ppp-py](https://github.com/pai-list/pai-ppp-py) | Planned |

## Quick Example

```json
.ppp
{
  "proto": "ppp/1.0",
  "type": "request",
  "endpoint": "pai://verify/kyc",
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
  "hash": "sha256:abc123...",
  "signature": "MEUCIQD...",
  "signer": "did:agent:pi:agent1",
  "chain_hash": "sha256:abc123...",
  "sequence": 12345,
  "anchored": true,
  "anchor_tx": "0xabc123..."
}
```

## Core Principles

- **Self-Contained** — Every message is complete: Header + Body + Receipt
- **Verifiable** — Receipt = TrustChain proof + Sigstore anchoring
- **Routable** — Endpoint URI in header enables mesh routing
- **Versioned** — Explicit protocol versioning, backward compatible
- **Transport Agnostic** — HTTP, WebSocket, QUIC, libp2p, email

## Documentation

Published docs: [docs.axiomid.app/protocols/ppp](https://docs.axiomid.app/protocols/ppp)

## License

MIT