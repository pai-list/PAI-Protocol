---
layout: doc
---

# Implementations

Official and community implementations of the PAI Protocol (PPP).

## Official Implementations

| Language | Repository | Package | Status |
|----------|------------|---------|--------|
| TypeScript | [pai-agent-kit](https://github.com/pai-list/pai-agent-kit) | `@pai/ppp` | Planned |
| Rust | [pai-ppp-rs](https://github.com/pai-list/pai-ppp-rs) | `pai-ppp` | Planned |
| Go | [pai-ppp-go](https://github.com/pai-list/pai-ppp-go) | `github.com/pai/ppp` | Planned |
| Python | [pai-ppp-py](https://github.com/pai-list/pai-ppp-py) | `pai-ppp` | Planned |

## Implementation Requirements

All implementations MUST pass the [PPP Compliance Suite](https://github.com/pai-list/ppp-compliance) which validates:

1. **Message Format** — Correct `.ppp` serialization/deserialization
2. **Header Validation** — All required fields, UUID v7, DID format
3. **Body Schema** — JSON Schema validation per endpoint
4. **Receipt Verification** — Ed25519 signature, TrustChain hash chain
5. **Routing** — Endpoint URI parsing, mesh resolution
6. **Error Handling** — Standard error codes and responses

## Running the Compliance Suite

```bash
# Install
npm install -g @pai/ppp-compliance

# Run against your implementation
ppp-compliance test --endpoint http://localhost:3000
```

## Contributing an Implementation

1. Fork this repository
2. Implement the specification
3. Run compliance suite
4. Submit PR with test results

## Specification Version

Current: **ppp/1.0**

See [Message Format](/spec/message-format) for version history.