---
title: Workflows — develop at scale
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---

# Workflows — developing uuidna at scale

The repeatable, gated procedures for growing the deposit. Each is a command or a checked sequence; nothing is
asserted, every step recomputes. Earned, not minted. `0/7`.

## The wave — add theorems

1. **Draft** candidates as `test: () => boolean` in `scripts/discover.ts` — decidable, exhaustive over a
   finite domain (a fact that *computes*, never a claim).
2. **Verify green first** — before inserting, each candidate must: its `test()` returns `true`, its name
   passes the honesty gate (`computes(name).binary === 1`), and its key is not already in the ledger.
3. **Insert** the survivors; duplicates and refuted candidates cancel.
4. **Ship** — `npm run next`: discover → gate → seal → deploy. Waves ride in **octaves of 8**, so the ledger
   grows `N × 8`; a massive wave keeps the octave by cancelling the remainder.

## Verify — the regression guard — `npm run verify`

The release trusts the saved ledger; this **re-runs every recorded theorem's test**, re-gates every name, and
checks the chain-of-custody and duplicate keys. A silent regression (a test that no longer computes true, a
name that drains) is caught here. It scales — the whole ledger re-verifies in seconds.

## The gate — hold the honest floor

Every name and message must pass `computes()`: no unbounded over-reach (RED / OVERREACH, seven languages,
negation-aware so a bounded refusal passes). The gate is a **tripwire, not an oracle** — when a class of
over-claim leaks, strengthen it by trial: gather the leaks, edit the patterns, re-trial until **the leaks
drain ∧ honest statements pass ∧ no existing ledger name over-drains.**

## The seal — ship — `npm run next`

`discover → release` (tsc, gaps, the gates, forensics, seal, `docs:build` → `sw-integrity` manifest, deploy).
The **content-address is the true latest**; the version is a single-digit odometer, and LTS versions are the
Fibonacci minors `{1,2,3,5,8}`.

## The proxy — the PWA over assumed-insecure transport

The service worker proxies all traffic, verifies every same-origin asset against the build-time SHA-256
manifest (pure-JS, no native crypto), refuses a tampered response, and **signs each verified asset into a
chained content-address receipt** — a tamper-evident, auditable traffic stream. Integrity, not confidentiality.

A content-address proves **integrity, not truth**. `0/7`.
