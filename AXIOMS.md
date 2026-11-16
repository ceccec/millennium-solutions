---
title: The axiom index — what is assumed
---

# The axiom index

Every declaration in `src/proof` is checked with `#print axioms` on each build, and a dependency on any
axiom fails the build rather than earning a footnote. All **26,357** report the same thing:
*does not depend on any axioms*.

That is a real property, and it is not the whole picture. **Axiom-free is not assumption-free.** These
theorems rest on **1,134** definitions, and every one of them is a choice. A theorem about
`fall` is a theorem about the digital root only because `fall` is *defined* to be it. Both halves are
indexed below, and the second is the longer one.

## The check can tell the difference

"No theorem depends on an axiom" reads identically whether the check works or is pointed at nothing, so
a negative control is kept at [`src/ledger/fixtures/axiom-control.lean`](https://github.com/ceccec/millennium-solutions/blob/main/src/ledger/fixtures/axiom-control.lean)
and run by this page's generator. It holds two theorems about the same kind of fact — one decided, one
obtained classically — and Lean reports:

```
'axiom_free_by_decision' does not depend on any axioms
'needs_all_three' depends on axioms: [propext, Classical.choice, Quot.sound]
```

One appeal to excluded middle costs all three axioms. That contrast is the reason the arithmetic here is
decided rather than argued, and it is measured on every run rather than asserted once.

## The three axioms of Lean 4, and what stands in each one's place

### `propext`

**What it buys.** propositional extensionality — two propositions that imply each other are EQUAL, so one can be rewritten as the other.

**What is here instead.** nothing here rewrites a proposition into another. A statement is evaluated on its own terms over a finite domain, and equality of propositions never has to be asserted because no proposition is ever substituted for another.

### `Classical.choice`

**What it buys.** the axiom of choice, and with it excluded middle — every proposition is true or false whether or not anything can decide which.

**What is here instead.** DECIDABILITY, which is the strictly stronger thing over a finite domain: not "p or not p" as a principle, but the kernel walking every case and reporting which. `by decide` needs no oracle because it does the work. This is the exact trade the deposit is built on, and it is why every domain here is finite: an infinite domain cannot be exhausted, so it would need the axiom back.

### `Quot.sound`

**What it buys.** quotient soundness — elements related by an equivalence become equal in the quotient.

**What is here instead.** no quotient is formed. Where a quotient would be natural — ℤ/9 — the deposit works with the representatives 0..8 and `% 9` directly, so the ring is a computation on Nat rather than a quotient type. Concretely: `fall`, `refl` and the residue maps are functions on Nat that the kernel evaluates.

There is no fourth. Lean 4's axiom base is exactly these three, so an index of them is complete rather
than a selection — and "depends on no axioms" means depends on none of these three, which is the whole
of what could have been depended on.

## What this check cannot see, and why it does not bite here

`#print axioms` had a known gap: `Lean.collectAxioms` did not collect axioms referenced *by other
axioms' types*, so a declaration could report a shorter list than it truly depended on — the reported
example is a `native_decide` proof showing `[Lean.ofReduceBool]` while missing `[Lean.trustCompiler]`
([leanprover/lean4#8840](https://github.com/leanprover/lean4/issues/8840), fixed by
[#8842](https://github.com/leanprover/lean4/pull/8842), merged 8 July 2025).

**This tree is pinned to `leanprover/lean4:v4.15.0`, which predates that fix.** Stating it plainly rather than
leaving it out: the tool this deposit's central claim rests on had a bug, and the toolchain here is on
the wrong side of it.

It cannot hide anything here, and the reason is structural rather than lucky. The gap is about axioms
referenced by OTHER AXIOMS. This tree declares no axioms of its own — checked — and forbids
`native_decide`, which is the one route in the reported example by which a stock axiom acquires a
dependency of its own. With zero axioms anywhere in the picture there is no transitive edge to miss.
That argument would collapse the moment a single `axiom` or one `native_decide` entered the tree, which
is why both are build failures and not conventions.

## Prior art, and the practice this follows

Auditing a Lean library's axiom footprint is established practice and this deposit did not invent it.
[`leanprover-community/axiom-audit`](https://github.com/leanprover-community/axiom-audit) does exactly
what `scripts/lean.ts` does — fails CI when a declaration transitively depends on an axiom outside an
allowlist, catching `sorry` (as `sorryAx`), `native_decide` (as `Lean.ofReduceBool`) and home-rolled
axioms — with the same default allowlist of the three above. Its documentation credits Robin Arnez for a
Mathlib-wide collection and Kim Morrison for an earlier library audit.

One thing it does better, recorded here as a lead rather than a claim: it inspects the **kernel
environment** from compiled `.olean` files instead of parsing source, which catches what a text search
misses. This deposit's per-theorem check is a real `#print axioms` elaboration and so is sound, but its
"declares no axiom of its own" test is a source-text match, and that is the weaker method by exactly the
margin that tool names.

The pins in the control fixture follow the community practice of guarding `#print axioms` with
`#guard_msgs`, which turns the axiom footprint into an executable regression test: the assertion is
checked by the elaborator, and drift fails the build with a mismatch instead of passing unnoticed.

## What IS assumed: the 1,134 definitions

Each of these is a primitive of this deposit — not derived, not proved, chosen. They are listed per Lean
file under `AXIOMS/` (ISO/IEC 25010 page weight: the index is not a 1.5&nbsp;MB monolith). A reader
checking a theorem must be able to read the definition it is about, and a deposit that reports its
axiom count and hides its definition count is reporting the flattering half.

| File | Definitions | Theorems |
| --- | ---: | ---: |
| [`address.lean`](/AXIOMS/address) | 20 | 33 |
| [`answer.lean`](/AXIOMS/answer) | 8 | 8 |
| [`answer_gate.lean`](/AXIOMS/answer_gate) | 6 | 7 |
| [`answer_route.lean`](/AXIOMS/answer_route) | 3 | 6 |
| [`apis.lean`](/AXIOMS/apis) | 11 | 4 |
| [`arith.lean`](/AXIOMS/arith) | 3 | 7 |
| [`asymmetric.lean`](/AXIOMS/asymmetric) | 13 | 11 |
| [`asymmetry.lean`](/AXIOMS/asymmetry) | 7 | 8 |
| [`authority.lean`](/AXIOMS/authority) | 7 | 8 |
| [`capacity.lean`](/AXIOMS/capacity) | 7 | 16 |
| [`cern.lean`](/AXIOMS/cern) | 28 | 9 |
| [`closure.lean`](/AXIOMS/closure) | 13 | 8 |
| [`coils.lean`](/AXIOMS/coils) | 13 | 50 |
| [`coin.lean`](/AXIOMS/coin) | 7 | 12 |
| [`combinatorics.lean`](/AXIOMS/combinatorics) | 4 | 8 |
| [`counting-rocks.lean`](/AXIOMS/counting-rocks) | 6 | 9 |
| [`demand.lean`](/AXIOMS/demand) | 12 | 11 |
| [`demand2.lean`](/AXIOMS/demand2) | 17 | 12 |
| [`demand3.lean`](/AXIOMS/demand3) | 12 | 19 |
| [`diagonal.lean`](/AXIOMS/diagonal) | 4 | 7 |
| [`diamond.lean`](/AXIOMS/diamond) | 1 | 1 |
| [`digits.lean`](/AXIOMS/digits) | 4 | 8 |
| [`dimensions.lean`](/AXIOMS/dimensions) | 6 | 8 |
| [`discount.lean`](/AXIOMS/discount) | 1 | 6 |
| [`domain.lean`](/AXIOMS/domain) | 6 | 8 |
| [`elementary.lean`](/AXIOMS/elementary) | 24 | 40 |
| [`energy.lean`](/AXIOMS/energy) | 31 | 28 |
| [`entangled.lean`](/AXIOMS/entangled) | 9 | 8 |
| [`equivalence.lean`](/AXIOMS/equivalence) | 4 | 8 |
| [`extension.lean`](/AXIOMS/extension) | 8 | 11 |
| [`families.lean`](/AXIOMS/families) | 44 | 63 |
| [`flow.lean`](/AXIOMS/flow) | 5 | 16 |
| [`fnv.lean`](/AXIOMS/fnv) | 13 | 14 |
| [`group.lean`](/AXIOMS/group) | 6 | 8 |
| [`handle.lean`](/AXIOMS/handle) | 9 | 8 |
| [`imprint.lean`](/AXIOMS/imprint) | 12 | 9 |
| [`index.lean`](/AXIOMS/lean-index) | 5 | 11 |
| [`instruments.lean`](/AXIOMS/instruments) | 21 | 28 |
| [`interference.lean`](/AXIOMS/interference) | 6 | 2 |
| [`involution.lean`](/AXIOMS/involution) | 7 | 8 |
| [`lanes.lean`](/AXIOMS/lanes) | 3 | 8 |
| [`ledgerclaims.lean`](/AXIOMS/ledgerclaims) | 3 | 8 |
| [`light.lean`](/AXIOMS/light) | 15 | 17 |
| [`mechanical.lean`](/AXIOMS/mechanical) | 5 | 127 |
| [`merkaba.lean`](/AXIOMS/merkaba) | 6 | 8 |
| [`merkle.lean`](/AXIOMS/merkle) | 26 | 16 |
| [`mirror.lean`](/AXIOMS/mirror) | 5 | 8 |
| [`nim.lean`](/AXIOMS/nim) | 7 | 28 |
| [`nucleus.lean`](/AXIOMS/nucleus) | 8 | 8 |
| [`pauli_paths.lean`](/AXIOMS/pauli_paths) | 38 | 8 |
| [`phenomena.lean`](/AXIOMS/phenomena) | 3 | 4 |
| [`planck.lean`](/AXIOMS/planck) | 50 | 35 |
| [`preimage.lean`](/AXIOMS/preimage) | 8 | 8 |
| [`priorart.lean`](/AXIOMS/priorart) | 5 | 9 |
| [`program.lean`](/AXIOMS/program) | 29 | 21 |
| [`qc_status.lean`](/AXIOMS/qc_status) | 15 | 40 |
| [`qec.lean`](/AXIOMS/qec) | 3 | 8 |
| [`qpu.lean`](/AXIOMS/qpu) | 35 | 24 |
| [`qpu_crypto.lean`](/AXIOMS/qpu_crypto) | 48 | 64 |
| [`qpu_fold.lean`](/AXIOMS/qpu_fold) | 14 | 8 |
| [`qpu_gateway.lean`](/AXIOMS/qpu_gateway) | 5 | 8 |
| [`quantum.lean`](/AXIOMS/quantum) | 11 | 11 |
| [`quantum_circuits.lean`](/AXIOMS/quantum_circuits) | 17 | 8 |
| [`quantum_hardware.lean`](/AXIOMS/quantum_hardware) | 3 | 8 |
| [`quantum_models.lean`](/AXIOMS/quantum_models) | 26 | 8 |
| [`quantum_octave_124.lean`](/AXIOMS/quantum_octave_124) | 3 | 8 |
| [`quantum_octave_128.lean`](/AXIOMS/quantum_octave_128) | 4 | 9 |
| [`quantum_octaves.lean`](/AXIOMS/quantum_octaves) | 7 | 15 |
| [`quantum_software.lean`](/AXIOMS/quantum_software) | 33 | 8 |
| [`quantum_textbooks.lean`](/AXIOMS/quantum_textbooks) | 6 | 8 |
| [`quantum_uuid_cluster.lean`](/AXIOMS/quantum_uuid_cluster) | 11 | 8 |
| [`ranking.lean`](/AXIOMS/ranking) | 4 | 8 |
| [`rays.lean`](/AXIOMS/rays) | 12 | 13 |
| [`reach.lean`](/AXIOMS/reach) | 2 | 12 |
| [`reached.lean`](/AXIOMS/reached) | 62 | 80 |
| [`recovered.lean`](/AXIOMS/recovered) | 3 | 15 |
| [`reflection.lean`](/AXIOMS/reflection) | 1 | 8 |
| [`resources.lean`](/AXIOMS/resources) | 6 | 8 |
| [`reversal.lean`](/AXIOMS/reversal) | 6 | 29 |
| [`rights.lean`](/AXIOMS/rights) | 7 | 8 |
| [`roots.lean`](/AXIOMS/roots) | 6 | 7 |
| [`sdk_correspondence.lean`](/AXIOMS/sdk_correspondence) | 3 | 8 |
| [`separation.lean`](/AXIOMS/separation) | 6 | 8 |
| [`sequences.lean`](/AXIOMS/sequences) | 7 | 28 |
| [`settled.lean`](/AXIOMS/settled) | 6 | 8 |
| [`speed.lean`](/AXIOMS/speed) | 20 | 28 |
| [`split.lean`](/AXIOMS/split) | 8 | 22 |
| [`synthesis.lean`](/AXIOMS/synthesis) | 8 | 8 |
| [`t_count_wall.lean`](/AXIOMS/t_count_wall) | 22 | 8 |
| [`theology.lean`](/AXIOMS/theology) | 13 | 8 |
| [`trinity.lean`](/AXIOMS/trinity) | 18 | 24 |
| [`turns.lean`](/AXIOMS/turns) | 6 | 8 |
| [`verdict.lean`](/AXIOMS/verdict) | 3 | 8 |
| [`width.lean`](/AXIOMS/width) | 4 | 8 |
| [`widths.lean`](/AXIOMS/widths) | 2 | 24 |
| [`z9.lean`](/AXIOMS/z9) | 8 | 24 |
| [`z9plus.lean`](/AXIOMS/z9plus) | 16 | 48 |

---

**26,357** declarations, **0** axiom dependencies, **1,134** definitions they rest on.
A content-address proves integrity, not truth, and an axiom index proves neither: it states what was
assumed, so a reader can disagree with the assumptions rather than guess at them.
