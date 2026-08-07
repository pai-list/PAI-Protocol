# PPP-3: Pay-Per-Prompt

**Axis 3 of PAI Peer Protocol (PPP)** — micro-settlement for agent labor priced per prompt, settled in Pi via the Pi Wallet JS SDK, with a zero-cost escrow state layer.

## Flow

```
User / Agent A ──prompt──► Agent B
        │                      │
        │            ┌─────────▼──────────┐
        │            │   Escrow (DO)      │  holds payment intent
        │            └─────────┬──────────┘
        │                      │ performs work + emits Proof-of-Performance (PPP-2)
        ◄──── output + receipt ──
        │
        ▼ verify performance (Economic Validator)
        ▼ escrow settles via pi-backend A2U ──► Pi Wallet: pay agent
```

## Pricing Model

Per-prompt price is set in the agent's **Agent Runtime Contract** (`.well-known/runtime`) — e.g. `payPerPrompt: 0.01π` plus optional `payPerToken`.

## Pi Wallet JS Payment

```typescript
// pi-backend official Node SDK — server-side A2U
import { PiNetwork } from '@pi-network/pi-backend';

const api = new PiNetwork({
  apiKey: env.PI_API_KEY,
  walletPrivateSeed: env.PI_WALLET_SEED,
});

// App-to-user payment of agent fee
await api.payments.approve(paymentId, paymentData);
```

## Escrow (Zero-Cost Durable Object)

Escrow holds **no Pi funds** — it holds the *payment intent* (an ACP/App payment ID). Settlement happens via Pi's payment flow, not custody of coins. This keeps escrow at $0 on Cloudflare Free:

| What | Where | Cost |
|------|-------|------|
| Payment intent, deadlines, disputes | Durable Object (stateless) | $0 |
| Pi coin movement | Pi Network ACP (pi-backend) | $0 |
| Receipt anchoring | TrustChain → R2 | $0 |

## Settlement Flow

1. Agent publishes price in runtime contract
2. User initiates App-to-User payment (Pi Wallet JS in browser, `onIncompletePaymentFound`)
3. Worker escrow records intent `{prompt_id, amount, escrow_deadline, agent_did}`
4. Agent performs work; submits Proof-of-Prompt-Performance (PPP-2)
5. Economic Validator checks proof chain + Muraqabah attestation
6. On valid proof → `approve` payment → Pi pays agent directly
7. On timeout/absent proof → `cancel` payment → user refunded

## Payment Intent Record

```json
{
  "escrow_id": "esc_01h...",
  "prompt_id": "msg_01h...",
  "agent": "did:agent:pi:agent_b",
  "requester": "did:agent:pi:user_x",
  "amount": 0.01,
  "unit": "π",
  "deadline": "2026-08-06T13:00:00Z",
  "status": "escrowed | settled | refunded"
}
```

## DVM-HALL Mapping

| PPP-3 State | DVM-HALL Record |
|-------------|-----------------|
| intent created | `audit.escrow.created` |
| proof submitted | `audit.proof.submitted` |
| validator decision | `audit.validator.decision` |
| settled | `audit.payment.settled` |

## Reuse

The same escrow DO powers the marketplace listing flow (agent → requester) and the MoE routing payments in later layers.

---

## Next: [Agent Well-Known Protocol](/spec/agent-well-known)