# Message Format

Every PPP message is a `.ppp` document with three sections:

```
.ppp
Header
---
Body
---
Receipt
```

## Header

```json
{
  "proto": "ppp/1.0",
  "type": "request",
  "endpoint": "pai://verify",
  "id": "msg_01hxxxxxxxxxxxxxxxxxxxx",
  "from": "did:agent:pi:agent1",
  "to": "did:agent:pi:agent2",
  "ts": "2026-08-02T12:00:00Z",
  "ttl": 30
}
```

### Header Fields

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

### Header Field Details

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `proto` | string | Yes | Protocol version (`ppp/1.0`) |
| `type` | enum | Yes | `request` \| `response` \| `event` |
| `endpoint` | string | Yes | Target `.PAI` endpoint URI |
| `id` | uuid-v7 | Yes | Unique message ID (time-ordered) |
| `from` | did:agent | Yes | Sender DID |
| `to` | did:agent / * | Yes | Recipient DID or `*` for broadcast |
| `ts` | ISO8601 | Yes | Timestamp |
| `ttl` | int | No | Time-to-live in seconds |
| `trace` | string | No | Distributed trace ID |
| `agent` | string | No | Agent name/version |
| `session` | string | No | Session ID for multi-turn |
| `lang` | string | No | Preferred language |

---

## Body

Arbitrary JSON with required `type` field:

```json
{
  "type": "verify.kyc",
  "username": "pioneer.username"
}
```

### Body Requirements

| Requirement | Description |
|-------------|-------------|
| **Must be valid JSON** | Parsed as UTF-8 JSON |
| **Must have `type`** | String, namespaced action (e.g., `verify.kyc`) |
| **Schema validation** | Validated against endpoint's JSON Schema |
| **Max size** | 1 MB (configurable per endpoint) |

### Body Schema Registration

Endpoints register JSON schemas:
```json
{
  "endpoint": "pai://verify",
  "schema": {
    "type": "object",
    "required": ["type", "username"],
    "properties": {
      "type": { "const": "verify.kyc" },
      "username": { "type": "string", "pattern": "^[a-z0-9.]{3,30}$" }
    }
  }
}
```

### Common Body Types

| Type | Description | Schema |
|------|-------------|--------|
| `verify.kyc` | KYC verification | `{ username }` |
| `pay.request` | Payment request | ACP schema |
| `skill.install` | Skill install | `{ skillId, version?, config }` |
| `agent.discover` | ADP discovery | `{ capabilities: string[] }` |
| `memory.recall` | Memory query | `{ query, filters? }` |

---

## Receipt

```
---
Receipt
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

### Receipt Fields

| Field | Type | Description |
|-------|------|-------------|
| `hash` | sha256 | Hash of Header + Body |
| `signature` | base64 | Ed25519 signature |
| `signer` | did:agent | Signer DID |
| `chain_hash` | sha256 | TrustChain head hash |
| `sequence` | int | TrustChain sequence number |
| `anchored` | boolean | Anchored to Pi Network |
| `anchor_tx` | hex | Pi Network anchor tx hash |

---

## Example Message

```
.ppp
{
  "proto": "ppp/1.0",
  "type": "request",
  "endpoint": "pai://verify",
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

---

## Next: [Header Specification](/spec/header)
EOF