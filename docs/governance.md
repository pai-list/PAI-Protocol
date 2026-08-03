# PPP Governance & Collaboration

**Governance is part of the protocol's development cycle, not a document.**

Inspired by the CRAI-F distributed governance lesson: accountability is not
owned by one role or one "ethics PDF" — it is embedded in the loop as a
distributed, self-correcting process.

## Principles

- **Community vetting** — RFC-style review for every spec change. No change
  merges without at least one domain expert + one outsider review.
- **Stakeholder consultation** — agents, humans, and platform owners who
  consume PPP are consulted before breaking changes.
- **Transparency** — every decision recorded (ADR). Merge history IS the
  governance record (TrustChain reserve applies to the spec itself).
- **Accountability loop** — after every 7 spec updates (Sab'iyyah), a
  holistic consistency pass reviews the whole protocol, not just the patch.

## Collaboration Loops

| Loop | Cadence | Owner |
|------|---------|-------|
| PPP RFC review (distributed engineers: identity/runtime/memory/skill/governance) | Per PR via `pai-list/.github` layered review roles | GitHub Actions |
| Stakeholder consultation window | Before any breaking change | Maintainers |
| Community vetting (public review) | Per RFC | All pai-list org repos |
| 7-cycle holistic reflection | Every 7 updates | Maintainers |

## Requirement for This Protocol

This document is accepted under the MIT license. Any change SHOULD reference
the CRAI-F distributed role that owns the lane, or the change is not part of
the protocol spec.

- **Identity Engineer** — `spec/header.md` (did:, pi:, trust) changes
- **Runtime Engineer** — `spec/routing.md` transport behavior changes
- **Memory Engineer** — receipt/TrustChain anchoring changes
- **Skill Engineer** — `spec/body.md` message-type registrations
- **Governance Engineer** — cross-cutting changes, this document, licensing

## License

MIT