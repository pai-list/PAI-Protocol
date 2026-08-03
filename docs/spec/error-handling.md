# Error Handling

PPP defines standard error codes and response format for interoperable error handling.

## Error Response

Error responses use `type: "response"` with error body:

```json
{
  "proto": "ppp/1.0",
  "type": "response",
  "endpoint": "pai://verify/kyc",
  "id": "msg_01h...",
  "from": "did:agent:pi:agent2",
  "to": "did:agent:pi:agent1",
  "ts": "2026-08-02T12:00:01Z"
}
---
{
  "type": "error",
  "code": "VERIFY_KYC_FAILED",
  "message": "Username not found",
  "details": { "username": "pioneer.username" },
  "retryable": false
}
```

## Error Codes

| Code | HTTP | Description | Retryable |
|------|------|-------------|-----------|
| `INVALID_PROTO` | 400 | Unsupported protocol version | No |
| `INVALID_MESSAGE` | 400 | Malformed message | No |
| `INVALID_HEADER` | 400 | Header validation failed | No |
| `INVALID_BODY` | 400 | Body schema validation failed | No |
| `UNAUTHORIZED` | 401 | Invalid/missing signature | No |
| `FORBIDDEN` | 403 | Sender not authorized for endpoint | No |
| `NOT_FOUND` | 404 | Endpoint or agent not found | No |
| `METHOD_NOT_ALLOWED` | 405 | Message type not supported | No |
| `RATE_LIMITED` | 429 | Too many requests | Yes |
| `ENDPOINT_ERROR` | 500 | Endpoint internal error | Yes |
| `ROUTING_FAILED` | 502 | Could not route to target | Yes |
| `TIMEOUT` | 504 | Request timeout | Yes |
| `SERVICE_UNAVAILABLE` | 503 | Endpoint temporarily down | Yes |

## Error Body Schema

```json
{
  "type": "error",
  "code": "ENDPOINT_ERROR",
  "message": "Human-readable description",
  "details": {},
  "retryable": true,
  "retry_after": 30
}
```

## Handling Guidelines

### Sender Side
- **Retry** on retryable errors with exponential backoff
- **Log** all errors to TrustChain for audit
- **Circuit break** after repeated failures

### Receiver Side
- **Validate early** — reject invalid messages before processing
- **Standard codes** — always use PPP error codes
- **Details** — include enough info for debugging (no secrets)

### Transport Errors
| Transport | Error Mapping |
|-----------|---------------|
| HTTP | Map status codes to PPP codes |
| WebSocket | Close code 4000-4999 = PPP errors |
| QUIC | Application error codes |
| libp2p | Protocol-specific errors |

---

*Implementations coming soon...*