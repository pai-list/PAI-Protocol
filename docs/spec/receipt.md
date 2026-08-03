# Receipt & TrustChain

The PPP Receipt provides cryptographic proof of message integrity and creates an immutable audit trail via TrustChain.

## Receipt Structure

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

## Fields

| Field | Type | Description |
|-------|------|-------------|
| `hash` | sha256 | Hash of Header + Body (canonical JSON) |
| `signature` | base64 | Ed25519 signature over `hash` |
| `signer` | did:agent | Signer's DID |
| `chain_hash` | sha256 | Current TrustChain head hash |
| `sequence` | int | Monotonic sequence number |
| `anchored` | boolean | Whether anchored to Pi Network |
| `anchor_tx` | hex | Pi Network transaction hash (if anchored) |

## TrustChain

TrustChain is an append-only hash chain where each receipt references the previous:

```
Chain Head (seq: 12345)
  └── hash: sha256(prev_hash + current_receipt)
  └── sequence: 12345
  └── anchored: true (periodically to Pi Network)

Previous (seq: 12344)
  └── hash: sha256(prev_hash + receipt_12344)
  └── ...
```

### Properties

- **Immutable** — Cannot modify without breaking chain
- **Verifiable** — Any receipt can be verified against chain head
- **Anchored** — Periodic Pi Network anchoring for global timestamp
- **Auditable** — Full history reconstructable from any point

## Verification

```typescript
import { verifyReceipt, TrustChain } from '@pai/ppp'

const isValid = verifyReceipt(receipt, chainHead)
const chain = await TrustChain.fetch('did:agent:pi:agent1')
const verified = chain.verify(receipt)
```

## Sigstore Anchoring

Receipts are periodically anchored to Sigstore (Rekor) for public transparency:

```
TrustChain seq 12345 → Sigstore Rekor entry → Pi Network block
```

---

## Next: [Routing](/spec/routing)