<div align="center">

```ascii
 ╔═══════════════════════════════════════════════════════════════════════════╗
 ║   _  _  _  _  _  ____  _  _  _  _  _  ____  ____  _  _  ____  ____  ____  ║
 ║  / )( \( \/ )( \/ ___)( \/ )( \/ )( \/ ___)(  _ \( \/ )/ ___)/ ___)(  _ \ ║
 ║  ) __ ( )  (  ) )\___ \ )  /  )  (  ) )\___ \ ) __/ )  / \___ \\___ \ ) __/ ║
 ║  \_)(_/(_/\_)(_/ (____/(_/   (_/\_)(_/ (____/(__)  (_/  (____/(____/(__)   ║
 ║                                                                           ║
 ║                 A X I O M  I D  |  P A I  U N I V E R S E                 ║
 ╚═══════════════════════════════════════════════════════════════════════════╝
```

</div>
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

## The 3 Axes of PPP

| Axis | Document | Description |
|------|----------|-------------|
| PPP-1 | [Peer Transport](spec/ppp-peer-transport.md) | A2A routing over WebRTC/WebSocket, no central broker |
| PPP-2 | [Proof-of-Prompt-Performance](spec/proof-of-prompt-performance.md) | Ed25519 prompt→plan→output chain + Muraqabah |
| PPP-3 | [Pay-Per-Prompt](spec/pay-per-prompt.md) | Micro-settlement in Pi via escrow DO + pi-backend |

## Agent Well-Known Protocol

| Document | Description |
|----------|-------------|
| [Agent Well-Known](spec/agent-well-known.md) | Runtime Contract, Constitution, Capabilities, Proofs at `/.well-known/*` |

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