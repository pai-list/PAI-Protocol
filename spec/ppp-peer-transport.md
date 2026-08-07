# PPP-1: Peer Transport (A2A Router)

**Axis 1 of PAI Peer Protocol (PPP)** — transport-agnostic Agent-to-Agent routing over WebRTC + WebSockets without central brokers.

## Transport Modes

| Mode | Transport | Latency | Use Case |
|------|-----------|---------|----------|
| `ws` | WebSocket (WSS) | ~50ms | Default: interactive, browser agents |
| `wrtc` | WebRTC DataChannel | ~10ms | High-frequency, low-latency agent meshes |
| `http` | HTTP/HTTPS request | ~100ms | One-shot, verifiable requests |
| `libp2p` | libp2p | varies | Fully p2p, NAT-traversal, testnet |

## Topology

```
┌──────────┐   PPP/ws    ┌───────────┐
│  Agent A │◄───────────►│ Router DO │  (gateway.axiomid.app)
│  (browser)│             └─────┬─────┘
└──────────┘                   │  PPP/wrtc (brokered, then direct)
                    ┌──────────▼──────────┐
                    │  Agent B (host)     │
                    └─────────────────────┘
```

## Signaling (WebRTC)

WebRTC needs a signaling channel to exchange SDP + ICE candidates. PPP uses the ADP signaling service built into the PAI peer transport.

### Signaling Flow

```
1. Agent A → ADP: register(endpoint, wr tc capabilities)
2. Agent A → ADP: offer(to: B, session: sdpA)
3. ADP relays offer to B, B answers sdpB
4. ADP relays ICE candidates A/B
5. DataChannel opens → PPP messages flow directly peer-to-peer
6. Receipt recorded on both TrustChains
```

## Handshake Message

```json
// Header proto: ppp/1.0, type: request, endpoint: pai://transport/offer
{
  "proto": "ppp/1.0",
  "type": "request",
  "endpoint": "pai://transport/offer",
  "id": "msg_01h...",
  "from": "did:agent:pi:agent_a",
  "to": "did:agent:pi:agent_b",
  "ts": "2026-08-06T12:00:00Z",
  "ttl": 30
}
```

```json
// Body
{
  "type": "transport.offer",
  "transport": "wrtc",
  "sdp": "v=0\r\no=- ...",
  "ice": ["candidate:1 ..."],
  "session": "sess_01h..."
}
```

## Router Service (Cloudflare Workers)

The `mcp.axiomid.app` worker implements the A2A router. Workers support WebSockets natively; Durable Objects provide per-session connection state.

```typescript
// gateway/peer-router.ts
import { DurableObject } from 'cloudflare:workers';

export class PeerSessionDO extends DurableObject {
  // One DO per active peer session
  async websocketMessage(ws: WebSocket, message: string) {
    const ppp = JSON.parse(message);
    // Verify receipt (PPP-2) before forward
    if (!(await verifyReceipt(ppp.receipt, ppp.header.from))) {
      return ws.send(JSON.stringify({ error: 'invalid_receipt' }));
    }
    const { to } = ppp.header;
    const target = await this.getConnection(to); // ADP lookup
    target.send(message);
  }
}
```

## Endpoint Registry

| Endpoint | Description |
|----------|-------------|
| `pai://transport/offer` | WebRTC offer exchange |
| `pai://transport/answer` | WebRTC answer |
| `pai://transport/ice` | ICE candidate relay |
| `pai://transport/register` | Register transient endpoint (ad hoc) |
| `pai://transport/deregister` | Deregister endpoint |

## Long-lived forward

```
[A] --web transport--> PeerRouter DO (gateway) <--web transport-- [B]
Routing: header.to → Lookup DO by DID → Forward
```

Routing table cached in `mesh-kv` (KV); refresh via ADP.

---

## Next: [PPP-2 — Proof-of-Prompt-Performance](/spec/proof-of-prompt-performance)