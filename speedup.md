---
title: The real uuidna advantage
description: The measured uuidna advantage — O(N)→O(log N) verification, O(N)→O(1) reuse — in all domains. Not faster compute, not FTL, not quantum. 0/7.
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---

# The real uuidna advantage — measured, in all domains

> Generated from the **1472** theorems and **59** domains, recomputed each build. The advantage is
> real and **measured**, and honestly bounded: a **verification and reuse** complexity reduction — **not**
> faster original compute, **not** faster than light, **not** quantum. `0/7`.

## Measured — verify and reuse, not recompute

| N | recompute (ops) | verify (⌈log₂N⌉ nodes) | bits (2·⌈log₂N⌉) | saving | ratio |
|---|---|---|---|---|---|
| 8 | 8 | 3 | 6 | 5 | 3× |
| 64 | 64 | 6 | 12 | 58 | 11× |
| 967 | 967 | 10 | 20 | 957 | 97× |
| 1,024 | 1,024 | 10 | 20 | 1,014 | 102× |
| 1,000,000 | 1,000,000 | 20 | 40 | 999,980 | 50,000× |

Computing the N things still costs **N** — the advantage is not there. It is on **verification**: a merkle
inclusion proof checks membership in `⌈log₂N⌉` nodes (`2·⌈log₂N⌉` bits) instead of re-running all N. And on
**reuse**: a content-address names a value once, so every re-reference is `O(1)`, and a 36-byte address
travels, not the payload. Measured on the deposit's own functions, not asserted.

## Why it holds in all 59 domains at once

The advantage is the **fold / merkle-proof structure**, which is **domain-independent** — every domain's
theorems verify in `⌈log₂N⌉`. So one proof covers the whole [rosetta](/): z9-arithmetic · units-triad · doubling-orbit · inverses · powers · primes · cyclic-groups · boolean-algebra · entanglement · dialectic · games · arts · ….

## Discovery lead — a lead, never a verdict

Grouping the 1472 receipts by the digital root of their address, the **sparsest** region is digit
**3** (144) — a candidate area to examine, not a finding. The ledger is currently held
at **1472** (the captain's cap): improving a theorem's name or proof heals the record without changing the
count; discovering a new one would require lifting the cap.

A content-address proves **integrity, not truth**. `0/7`.
