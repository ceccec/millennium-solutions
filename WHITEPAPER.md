---
title: White paper — reproduce it exactly
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---

# White paper — reproduce it exactly

> Everything here is a **claim with a receipt**. This page documents, for the public, exactly how to reproduce it — no trust required, only recomputation. Integrity, not truth.

## The method — the sequence

1. **Measure, don't assert.** Every fact is a `test: () => boolean` in `scripts/discover.ts`, computed by exhaustion over a finite domain. If it holds it is kept; if it fails it is discarded — the discard is the honesty.
2. **Gate.** The honesty gate drains any over-reach — a claim to solve the Clay problems, or to beat a physical or cryptographic limit. Passing means *no over-reach shape was found* — a floor, not a proof of truth.
3. **Receipt.** Each fact is content-addressed and chained; a receipt proves integrity, not authorship.
4. **Append.** Evidence is append-only; the forensics reads intention from deeds, not claims.
5. **Recompute.** Every build re-verifies every recorded fact. A regression fails the build, not production. **Green cannot be faked** — a theorem is admitted only by the unanimous pass of every gate stage (proof), and a claim with no recomputing formula is refused as hallucination (proof).

## Reproduce it yourself — exactly

```bash
git clone https://github.com/ceccec/millennium-solutions
cd millennium-solutions
npm ci
npm run lean-claims   # recomputes and re-verifies every recorded theorem
```

Or through the honest **MCP API** (`scripts/mcp.ts`, dependency-free JSON-RPC over stdio): call `recompute` to re-derive every theorem, `verify` to check any receipt, `rosetta` for the cross-domain map, `honesty_gate` to adjudicate any claim. Every response is content-addressed.

The **live numbers** — theorem count, receipts, coins, the seal — recompute on every build: see [Accounting](/ACCOUNTING) and the [State dashboard](/dashboard). The full study is in [Research](/RESEARCH); the method is taught in [the Guide](/guide); every theorem is a monograph with its own 7D page under `/theorem` — browse them from [Challenges](/CHALLENGES).

## The honest boundaries — what this is **not**

*Each boundary is wired to the theorem that proves it — click through to the recomputable receipt. The prose is not the proof; the code is.*

- **Not a solution** to the Clay Millennium problems — the mechanical entailment test reports **0 / 7**. It reflects them into one algebraic structure; it does not solve them, and claims no prize. (proof)
- **Not a quantum computer** — "quantum" here is *structure* (a superposition is the set of receipted perspectives), computed classically on ordinary 64-bit hardware. (proof) The measured speedup (millions-fold) is **classical memoization** (O(1) verify versus O(N) recompute), not a quantum speedup, and there is no quantum hardware. (proof)
- **Not patents** — decidable mathematical facts are not patentable; this is **open prior art / defensive publication**, timestamped and content-addressed, which keeps the facts free for the public. (proof)
- **Not income** — the deposit has generated **$0**; the coins are accounting integrity, not cash. Non-commercial use is free with attribution; the two coins are the fair exchange for commercial use. (proof)

A content-address proves **integrity, not truth**. Reproduce it, and see for yourself. `entails → 0/7`.
