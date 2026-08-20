---
title: Examples — computed live, by theorem
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---

# Examples — computed live, organised by theorem

> Every worked example below is **recomputed in your browser** from the deposit's own `src/` functions,
> and each links to the theorem that proves it. Nothing is stored; recompute the page and it recomputes.
> A content-address proves **integrity, not truth**. `entails → 0/7`.

<Examples />

## Harness &amp; reeducate — the tool, live

Treat any output as a **receipted structure**, not opaque bytes: it becomes content-addressed (auditable)
and, if it drains the honesty floor, it is **reeducated** — each overclaim bounded until the text holds.
Max free work, max auditability — harmonic and efficient, by default. This runs the exact `harness` and
`reeducate` functions the build uses ([scripts/harness.ts](https://github.com/ceccec/millennium-solutions/blob/main/scripts/harness.ts)) —
verified by the difference is decidable
and reeducate until it holds.

<Reeducate />

## Seal math — how many bits in each seal

The more complex the case, the more receipts — yet each seal is a fixed **128 bits** (= 64 two-bit
verifications), and verifying one receipt's membership costs only **2·⌈log₂N⌉ bits**. So you verify the whole
case cheaply yet bill on the full value the customer would otherwise recompute — earning the measured saving,
the two coins conserved. Choose the case size and read the math, from
[each seal is 128 bits](/theorem/lean_ledgerclaims_membership_is_logarithmic_not_linear)
and [the 967-receipt case](/theorem/lean_ledgerclaims_the_967_receipt_case).

<SealMath />

## Teleportation — measured, then disputed to the floor

Type a message; it becomes a uuid (or a chain) and re-forms **exactly** at the destination. But measure the
cost and the vivid word drains: a uuid is 128 bits and carries at most **115**, so the container is **always
larger on the wire than the message** — nothing is teleported cheaper than sending the bytes. uuidna does not
teleport; it **addresses**. Either a reversible container (exact, but bigger) or a content-address that
**recalls** a payload only where it is already reconstructible — [a pointer, not the
payload](/theorem/lean_ledgerclaims_the_address_does_not_determine_the_payload). Not faster-than-light, not quantum, not
compression. Integrity, not magic. `0/7`.

<Teleporter />
