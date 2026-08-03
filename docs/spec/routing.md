# Routing

PPP messages are routable across networks via the `endpoint` URI in the header.

## Endpoint URI Format

```
pai://<domain>/<action>
```

| Component | Description |
|-----------|-------------|
| `pai://` | PPP scheme |
| `domain` | Service domain (verify, memory, skills, payments, agent, mcp) |
| `action` | Specific action within domain |

## Standard Endpoints

| Endpoint | Domain | Description |
|----------|--------|-------------|
| `pai://verify/kyc` | verify | KYC verification |
| `pai://verify/identity` | verify | Identity proof |
| `pai://memory/recall` | memory | Memory query |
| `pai://memory/store` | memory | Memory write |
| `pai://skills/install` | skills | Install skill |
| `pai://skills/update` | skills | Update skill |
| `pai://payments/request` | payments | ACP payment request |
| `pai://payments/settle` | payments | Settlement |
| `pai://agent/discover` | agent | ADP discovery |
| `pai://agent/register` | agent | Agent registration |
| `pai://mcp/call` | mcp | MCP tool call |
| `pai://mcp/stream` | mcp | MCP streaming |

## Routing Process

```
Sender → Local Router → Mesh Network → Recipient Router → Recipient
```

1. **Local lookup** — Check local endpoint registry
2. **Mesh resolution** — Query ADP for target agent location
3. **Transport selection** — Choose HTTP/WebSocket/QUIC/libp2p
4. **Delivery** — Send to recipient's router
5. **Acknowledgment** — Receipt returned via same path

## Mesh Routing (ADP)

Agent Discovery Protocol (ADP) enables mesh routing:

```typescript
import { ADPClient } from '@pai/adp'

const adp = new ADPClient()
const routes = await adp.resolve('did:agent:pi:target-agent')

// Returns: { endpoints: ['https://api.axiomid.app', 'wss://mesh.pai.network'] }
```

## Broadcast

Use `to: "*"` in header for broadcast messages:

```json
{
  "proto": "ppp/1.0",
  "type": "event",
  "endpoint": "pai://agent/heartbeat",
  "id": "msg_01h...",
  "from": "did:agent:pi:agent1",
  "to": "*",
  "ts": "2026-08-02T12:00:00Z"
}
```

---

## Next: [Error Handling](/spec/error-handling)