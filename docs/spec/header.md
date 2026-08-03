# Header Specification

The PPP Header contains all routing and metadata for message delivery.

## Header Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `proto` | string | Yes | Protocol version (`ppp/1.0`) |
| `type` | enum | Yes | `request` \| `response` \| `event` |
| `endpoint` | string | Yes | Target `.PAI` endpoint URI |
| `id` | uuid-v7 | Yes | Unique message ID |
| `from` | did:agent | Yes | Sender DID |
| `to` | did:agent / * | Yes | Recipient DID or `*` for broadcast |
| `ts` | ISO8601 | Yes | Timestamp |
| `ttl` | int | No | Time-to-live in seconds |

## Field Details

### `proto`
Protocol version string. Format: `ppp/<major>.<minor>`
- Current: `ppp/1.0`
- Future: `ppp/1.1`, `ppp/2.0`

### `type`
| Value | Description |
|-------|-------------|
| `request` | Expects response |
| `response` | Response to request |
| `event` | Fire-and-forget notification |

### `endpoint`
Target `.PAI` endpoint URI:
```
pai://verify
pai://memory/recall
pai://skills/install
pai://payments/create
pai://agent/discover
```

### `id`
UUID v7 (time-ordered UUID):
```
msg_01hxxxxxxxxxxxxxxxxxxxx
```
Format: `msg_<uuidv7>`

### `from` / `to`
DID identifiers:
```
from: did:agent:pi:agent1
to: did:agent:pi:agent2
to: *  (broadcast)
```

### `ts`
ISO 8601 UTC timestamp:
```
2026-08-02T12:00:00Z
2026-08-02T12:00:00.123Z
```

### `ttl`
Time-to-live in seconds. Default: 30 seconds.
```
ttl: 30
```

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `trace` | string | Distributed trace ID |
| `agent` | string | Agent name/version |
| `session` | string | Session ID for multi-turn |
| `lang` | string | Preferred language |

---

## Next: [Body Specification](/spec/body)
EOF