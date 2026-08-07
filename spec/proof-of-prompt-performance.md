# PPP-2: Proof-of-Prompt-Performance

**Axis 2 of PAI Peer Protocol (PPP)** — cryptographically binding the prompt→plan→output chain so an agent can prove work was actually performed, honestly, by the stated agent.

## 3-Axis PPP Definition

| Axis | Name | Mechanism |
|------|------|-----------|
| PPP-1 | Peer Transport | WebRTC/WebSocket A2A router |
| **PPP-2** | **Proof-of-Prompt-Performance** | Ed25519 signed prompt→plan→output chain + Muraqabah override |
| PPP-3 | Pay-Per-Prompt | Micro-settlement on Pi via escrow |

---

## The Binding

A performance proof is a hash chain binding the original prompt to the agent's internal plan and the final output.

```
prompt ──(hash)──► plan ──(hash)──► selected action ──(hash)──► output ──(hash)──► receipt
        Ed25519 sig                    Ed25519 sig                     Ed25519 sig
```

Each stage is independently signed. Any tampering with prompt output breaks the chain.

## Proof JSON

```json
{
  "prompt_hash": "sha256:c5e0...",
  "plan_hash": "sha256:9ab1...",
  "output_hash": "sha256:d7f2...",
  "chain": [
    { "op": "prompt", "hash": "sha256:c5e0...", "sig": "MEUCIQD..." },
    { "op": "plan", "hash": "sha256:9ab1...", "sig": "MEUCIQD..." },
    { "op": "output", "hash": "sha256:d7f2...", "sig": "MEUCIQD..." }
  ],
  "agent_id": "did:agent:pi:agent_a",
  "request_id": "msg_01h...",
  "muraqabah": "axiomid:inspect://proof/01h..."
}
```

## Verification

```typescript
import { verifyPerformance } from '@pai/ppp';

const result = verifyPerformance(proof, {
  verifyOutputAgainst: userPrompt, // optional cross-check
  requireMuraqabah: true           // prefer trusted node attestation
});
// { valid: true, linked: true, muraqabahVerified: true }
```

## Muraqabah Override

Under SOUL Protocol, an agent may independently attest. "Muraqabah" is the divine awareness layer — a human-verifiable assertion (level 0) or mutually-attested by an Economic Validator node (level 1).

| Attestation Level | Who | Use |
|-------------------|-----|-----|
| 0 (Self-Ratified) | Agent declares | Cheap; trust through reputation |
| 1 (Validator) | Economic Validator signs | Requires stake; higher trust |

## Replay Protection

Nonce + timestamp embedded in each proof to prevent replay of identical prompt → old output.

## Integrates With

- **Receipt** — each proof step appends a TrustChain receipt
- **DVM-HALL** — proof maps to a verifiable receipt in the audit layer
- **Economic Validators** (`pai://economy/validate/`)

---

## Next: [PPP-3 — Pay-Per-Prompt](/spec/pay-per-prompt)