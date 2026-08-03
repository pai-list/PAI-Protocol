# PAI Protocol Architecture

## Overview

The PAI Protocol (PPP) implements a layered architecture optimized for autonomous agent communication.

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                           │
├─────────────────────────────────────────────────────────────┤
│  Agents │ Wallets │ dApps │ Skills │ Marketplace            │
├─────────────────────────────────────────────────────────────┤
│                    Protocol Layer (PPP)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │  Auth    │ │ Routing  │ │ Serial.  │ │  Compression │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    Transport Layer                             │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐  │
│  │ HTTP   │ │  WS    │ │  QUIC  │ │ libp2p │ │  Email   │  │
│  └────────┘ └────────┘ └────────┘ └────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Design Principles

### 1. Protocol Minimalism
- **Minimal header**: Only essential routing fields
- **Extensible body**: JSON Schema for extensibility
- **Optional receipt**: Only when verification needed

### 2. Transport Agnosticism
```
Application
    │
    ▼
PPP Message (canonical)
    │
    ├─► HTTP/1.1, HTTP/2, HTTP/3
    ├─► WebSocket
    ├─► QUIC / HTTP/3
    ├─► libp2p / QUIC
    ├─► SMTP / Email
    ├─► Matrix / IRC
    └─► Custom transports
```

### 3. Verifiability First
Every message **can** carry a receipt:
- **Local**: TrustChain hash chain
- **Public**: Sigstore/Rekor transparency log
- **On-chain**: Pi Network anchoring (periodic)

---

## Message Flow

```
┌─────────┐     .ppp doc      ┌─────────┐
│ Sender  │ ───────────────►  │ Gateway │
└─────────┘                     └────┬────┘
                                     │
          ┌──────────────────────────┼──────────────────┐
          ▼                          ▼                  ▼
    ┌──────────┐              ┌──────────┐        ┌──────────┐
    │  Mesh    │                │ Gateway  │        │  Agent   │
    │  Mesh    │                │ (Proxy)  │        │  (Sink)  │
    └──────────┘                └──────────┘        └──────────┘
```

---

## Message Lifecycle

```
1. CREATE     ──► Sender creates .ppp document
2. SIGN       ──► Sign with sender's key
3. RECEIPT    ──► Generate TrustChain entry + Sigstore entry
4. ROUTE      ──► Route via mesh/gateway
5. DELIVER    ──► Deliver to recipient
6. VERIFY     ──► Recipient verifies signature + receipt
6. ACK        ──► Optional: send response .ppp
8. ANCHOR     ──► Periodic anchoring to Pi Network
```

---

## Next: [Message Format](/spec/message-format)
EOF