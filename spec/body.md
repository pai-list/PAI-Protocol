# Body Specification

The PPP Body carries the application payload — arbitrary JSON with a required `type` field.

## Structure

```json
{
  "type": "verify.kyc",
  "username": "pioneer.username"
}
```

## Requirements

| Requirement | Description |
|-------------|-------------|
| **Valid JSON** | UTF-8 encoded, parsed as JSON |
| **Required `type`** | String, namespaced (e.g., `verify.kyc`, `pay.request`) |
| **Schema validation** | Validated against endpoint's JSON Schema |
| **Max size** | 1 MB (configurable per endpoint) |

## Type Namespacing

Types follow the pattern: `<domain>.<action>`

| Domain | Actions |
|--------|---------|
| `verify` | `kyc`, `identity`, `proof` |
| `pay` | `request`, `send`, `settle` |
| `skill` | `install`, `update`, `remove` |
| `agent` | `discover`, `register`, `heartbeat` |
| `memory` | `store`, `recall`, `search` |
| `mcp` | `call`, `stream`, `batch` |

## Schema Registration

Endpoints register JSON schemas via the PPP Registry:

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

## Example Body Types

### KYC Verification
```json
{
  "type": "verify.kyc",
  "username": "pioneer.username",
  "level": "l1"
}
```

### Payment Request (ACP)
```json
{
  "type": "pay.request",
  "amount": "10.00",
  "currency": "PI",
  "memo": "Invoice #1234"
}
```

### Skill Install
```json
{
  "type": "skill.install",
  "skillId": "github:pai-skills/pi-kyc",
  "version": "1.2.0",
  "config": { "autoVerify": true }
}
```

### Agent Discovery (ADP)
```json
{
  "type": "agent.discover",
  "capabilities": ["verify.kyc", "memory.recall"],
  "maxResults": 10
}
```

---

## Next: [Receipt & TrustChain](/spec/receipt)