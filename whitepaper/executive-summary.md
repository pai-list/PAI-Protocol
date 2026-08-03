# Executive Summary

The **PAI Protocol (PPP)** is a universal wire protocol for autonomous agent communication. It defines a self-contained, verifiable, and routable message format for agent-to-agent, agent-to-human, and human-to-agent communication.

## The Problem

Current agent communication suffers from:
- **Fragmentation**: Every platform has proprietary protocols
- **No Verifiability**: No cryptographic proof of message integrity
- **No Routing**: Can't route messages across agent meshes
- **No Audit Trail**: No immutable record of agent communications
- **Vendor Lock-in**: Proprietary protocols create walled gardens

## The PPP Solution

**PPP (PAI Protocol)** is a universal wire protocol designed for the agent economy:

| Property | Description |
|----------|-------------|
| **Self-Contained** | Header + Body + Receipt in one document |
| **Verifiable** | Receipt = TrustChain proof + Sigstore anchoring |
| **Routable** | Endpoint URI in header enables mesh routing |
| **Versioned** | Explicit versioning with backward compatibility |
| **Transport Agnostic** | HTTP, WebSocket, QUIC, libp2p, email, etc. |

## Core Architecture

```
.ppp Document
┌─────────────────────────────────────┐
│ Header                              │
├─────────────────────────────────────┤
│ Body (JSON Schema validated)        │
├─────────────────────────────────────┤
│ Receipt (TrustChain + Sigstore)     │
└─────────────────────────────────────┘
```

### Header Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `proto` | string | Yes | Protocol version (`ppp/1.0`) |
| `type` | enum | Yes | `request` \| `response` \| `event` |
| `endpoint` | string | Yes | Target `.PAI` endpoint URI |
| `id` | uuid-v7 | Yes | Unique message ID |
| `from` | did:agent | Yes | Sender DID |
| `to` | did:agent / * | Yes | Recipient DID |
| `ts` | ISO8601 | Yes | Timestamp |
| `ttl` | int | No | Time-to-live (seconds) |
| `trace` | string | No | Distributed trace ID |

### Body
Arbitrary JSON with required `type` field:
```json
{
  "type": "verify.kyc",
  "username": "pioneer.username"
}
```

### Receipt (TrustChain Proof)
```json
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

## Key Innovations

### 1. TrustChain Receipts
Every message gets a cryptographic receipt anchored to:
- **TrustChain** (local hash chain)
- **Sigstore/Rekor** (public transparency log)
- **Pi Network** (periodic blockchain anchoring)

### 2. Mesh Routing
```
Agent A ──► Gateway ──► Mesh ──► Agent B
     │              │          │
     ▼              ▼          ▼
  .ppp msg      .ppp msg   .ppp msg
```

### 3. Transport Agnostic
```
HTTP/WebSocket  ──► PPP
libp2p/QUIC     ──► PPP
Email/SMTP      ──► PPP
Matrix/IRC      ──► PPP
```

## Use Cases

| Domain | Application |
|--------|-------------|
| **Agent Commerce** | ACP payments, escrow, invoicing |
| **Agent Discovery** | Capability broadcast, matchmaking |
| **Multi-Agent Systems** | Swarm coordination, task delegation |
| **Human-Agent** | Verified human↔agent communication |
| **Cross-Platform** | Bridge Discord, Matrix, Email, Matrix |

## Roadmap

| Phase | Timeline | Deliverables |
|-------|----------|--------------|
| **v1.0** | Q3 2026 | Core spec, TypeScript/Rust SDKs, reference gateway |
| **v1.1** | Q4 2026 | Mesh routing, ACP integration, ADP sync |
| **v2.0** | Q1 2027 | Mesh networking, DHT routing, light clients |

## Get Involved

- **Spec**: [GitHub](https://github.com/pai-list/PAI-Protocol)
- **Discord**: [PAI Universe](https://discord.gg/pai-universe)
- **Spec Repo**: `pai-list/PAI-Protocol`

---

*PPP v1.0-draft — Built for the Agent Economy*
EOF