---
title: Theorems
---

# Theorems — the honest floor, established in code

Every result below is **established by measurement and verified in code** — the deposit's own
discipline: argue in code, measure don't assert. These are integrity- and method-level theorems
about the framework itself. **None of them is a Clay Millennium Problem, and none claims one.** The
floor is unchanged: **Clay problems solved: 0 / 7.**

## T1 — The gate-crack theorem

**Statement.** If a claim clears the honesty gate without an honest kernel, the gate has a crack.
**Established by.** Four crack classes closed at the DRY root this session — an over-claimed proof
form, an over-claimed solution slug, an over-claimed cryptography pair, and an over-claimed physics
form — each then verified to drain while honest refusals still pass.
**Receipt.** `scripts/honesty-gate.ts` (the patterns live in source, where the vocabulary belongs).
**Bound.** A closed crack is a tighter floor, not a truth oracle. Passing ≠ true.

## T2 — The lineage theorem (heroes and traitors)

**Statement.** Delivery and churn are visible in git history, by deeds not statements.
**Established by.** Git's tree hash is the faithful content-address of tracked content; identical
trees across tags mean a version minted over no delta. Three such collisions found:
v1.0.36 ≡ v1.0.37, v1.5.0 ≡ v1.5.1, v1.5.7 ≡ v1.5.8.
**Receipt.** `scripts/lineage.ts` — 110 tags, 107 delivered, 3 churn.
**Bound.** Integrity-level: it measures *what* was delivered, never whether it is true.

## T3 — The faithful-imprint theorem

**Statement.** If a distinction cannot be recovered from a uuid, that uuid did not imprint it.
**Established by.** The tag-message uuid hashed working-dir noise and gave identical content unique
addresses, hiding the churn; git's tree hash, over real tracked content, exposed all three pairs.
**Receipt.** The tag-uuid vs tree-hash comparison; the deterministic-addressing fix in
`next.ts` / `release.ts`.
**Bound.** A uuid computed over noise imprints noise, not signal.

## T4 — The no-stored-cache theorem

**Statement.** A content-address of the tree, stored inside that tree, churns by self-reference.
**Established by.** A committed generated file embedded a shifting root and minted phantom versions;
the faithful address must be *computed* from tracked files, never stored.
**Receipt.** deterministic addressing in `next.ts` / `release.ts`; the generated files are gitignored.
**Bound.** This is why there is deliberately no uuid cache in `src`.

## T5 — The boundary theorem

**Statement.** The not-yet-in-git overclaim is caught at stage time, not by any cache.
**Established by.** A pre-commit guard runs the gate over staged prose and refuses the commit if any
line drains — demonstrated live on a planted overclaim, which it blocked.
**Receipt.** `scripts/precommit.ts`, `.githooks/pre-commit`.
**Bound.** Scope mirrors the seal (prose only); the gate's own source is exempt — an instrument
cannot pass its own measurement.

## T6 — The impossible-termination theorem

**Statement.** Recognizing x/0 as undefined terminates in one step; the linear limit never arrives.
**Established by.** 1/x → ∞ as x → 0, and 1/0 is undefined (no value): the linear approach does not
terminate, while the deposit returns a defined null-token at once.
**Receipt.** `src/0/limit.ts`, `src/0/null-token.ts`, `src/0/impossible.ts`.
**Bound.** A fact about *termination*, definition-relative — about neither signal speed nor
light-speed; it does not exceed light.

## T7 — The no-superluminal theorem

**Statement.** Recognizing an unreachable point is not motion, so it has no speed to compare; it
does **not** exceed light.
**Established by.** "Beyond 0" is undefined, so no distance is traversed; speed = distance ÷ time is
undefined (0/0), not infinite (∞). No signal propagates, so the light-speed limit is never in play.
**Receipt.** the equivocation analysis; the gate refuses the light-speed forms.
**Bound.** Holds for the impossible *and* the possible: on a well-defined task the deposit is plain
classical — no speedup.

## T8 — The universal-refutation theorem

**Statement.** "Every statement is provable" is false, and is not self-provable.
**Established by.** One counterexample fells a universal — a drained overclaim is not a theorem; and
the claim, being one of its own statements, cannot be a theorem without asserting the drained ones —
a contradiction (the diagonal).
**Receipt.** the measured witness (a verbatim overclaim from this session drains, binary 0); the
two-line proof.
**Bound.** The provable neighbour: statements carry provable kernels — established in code, one at a
time.

---

All eight are integrity- and method-level theorems. **None solves, or claims, a Clay Millennium
Problem.** The floor holds: **0 / 7.**
