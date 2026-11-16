---
title: Usage & metering
description: The inverted model — compute runs free in the user's browser (serverless qpu-os); the QPU's content-address cache is the paid, metered service.
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---

# Usage & metering — compute free, cache paid

> **Inverted, and client-side.** The QPU runs as a **serverless qpu-os in the user's own browser** — the hardware is the **user's device**, and all computing is **client-side and free**. What is **paid** is the **cache**: the QPU's content-address store serves a **verified result by its handle** (the 304 involution, O(1)) so the client need not recompute it (O(n)). You pay to **skip the recompute**, never to compute.

## The model

- **compute:** client-side, **free** — the qpu-os runs in the browser, serverless; the user's device is the hardware.
- **cache (paid):** the QPU serves a verified answer **by handle** — a hit saves the client a recompute. Metered over **x402** (HTTP 402), per serve (or per second of cache usage).
- **unit:** a **handle-serve** — one verified result delivered by its content-address, which would otherwise cost the client `recompute(n)` locally.

## Billing basis — only where a cost occurs

Free is **not a discount**: it is that **no billable cost occurs**. The client computes on their **own device**, so the deposit spends nothing — and the licence (**CC BY-NC-ND**) permits the use. There is nothing to bill. Billing applies **only to a cost the provider actually incurs**: serving the **cache** from its hosted content-address store (and amortising the one-time generation behind a handle). You are billed for a cost the provider incurs, **never for your own free compute**.

## Fair by construction

The cache charges only when it **saves** work: a handle-serve is O(1) — `verify(1) < recompute(n)`, sealed (8 correspondence theorems) — against the client's own `recompute(n)`. You never pay to recompute; you pay only to **skip** it. The content-address efficiency *is* the product, and it is why unbounded streams carry no cost until a cache hit is bought.

## The rate — owner-set (NEEDS_OWNER)

The deposit's policy classifies pricing as **NEEDS_OWNER**: *takes money or sets prices: needs a payment account, a price and terms that only the owner can set* So the three things only the depositor can set are left unset here:

- **rate:** _(unset)_ — currency per handle-serve (or per cache-second).
- **payment account:** _(unset)_ — the x402 wallet / Stripe account.
- **terms:** _(unset)_ — what a serve entitles, refunds, limits.

The meter and the x402 gate are the scaffold; **no price is set and no payment is wired.** Fill the three slots and the provider is live — the code already serves-by-handle and gates.

## Honest floor

The qpu-os is a **classical** engine on the user's device: browser or client, it computes quantum-**shaped** math, **not** physical quantum behaviour. **`isQuantumComputer: false` regardless of where it runs** — running in the user's browser does not make it a quantum computer; that is still the CHSH-on-real-hardware leaf (open, `/iso-conformance`, `/chsh-run`). You pay for the **cache** — a content-address service — never for quantum hardware. Under **CC BY-NC-ND**, a consumer pays to *use* the service, not to resell the work.
