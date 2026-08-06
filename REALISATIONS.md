---
title: Realisations
---

# Realisations — the step chain

Each step: the realisation, the file that computes/proves it, and the result.
Everything recomputes from the digit-folder mesh; see [Compute](/compute).

## 1 — Division by zero changes the domain
`n/0 := n⁻¹ (mod 9)` on the units; `0` still has no inverse. Any value for `x/0`
requires leaving the field (Riemann sphere, wheel, ℤ/9…), each dropping an axiom.
→ `src/9/vortex.lean`, `SEQUENCE-DECODE.md §2`.

## 2 — The sequence reflects itself (three ways)
Self-sealing fraction product `= 1`; additive `m(d)=10−d`; multiplicative `n↔n⁻¹`.
→ `src/5/vortex.lean` (`self_seal`), `SEQUENCE-DECODE.md §3`.

## 3 — Gateways `[8,3,9,0]`
The stroke-reversal digits of the cyclic walk.
→ `SEQUENCE-DECODE.md §4`.

## 4 — Ring structure: units vs nilradical
`3² ≡ 6² ≡ 0 (mod 9)` → `{3,6,9}` is the nilradical (no inverse); units `⟨2⟩`
are the doubling hexagon; `432 = 2⁴·3³ = 16·27`, digit-sum `27`.
→ `src/{1..9}/vortex.lean`, `SEQUENCE-DECODE.md §5`.

## 5 — Nonagon geometry
Three mod-3 cosets = three equilateral triangles; two counter-rotating flows.
→ `SEQUENCE-DECODE.md §6`.

## 6 — Inter-ring lattice
Ten's-complement bonds `d ↔ 10−d` (sum 10 = carry); trinity = 3 outbound legs.
→ `src/5/reflection.lean`, `SEQUENCE-DECODE.md §7`.

## 7 — Merkaba = cube (the "8")
A star tetrahedron's 8 vertices are a cube; the trinity-bond lattice is the cube
graph Q₃ (8 nodes, 3-regular, bipartite).
→ `PHYSICS-SCALES`, animation (published artifact).

## 8 — Magnetic field of the merkaba coils
Biot–Savart: counter-rotating triangles → central-axis field **null**;
co-rotating → central **max**. (real EM of a coil geometry.)
→ computed; scale check `μ₀I/2r = 2.09 µT`.

## 9 — Flower → Fruit → Metatron
A cube down its 3-fold axis **is** a hexagon → Seed (6+1) → Flower (19) →
Fruit (13) → Metatron (78 lines). Verified projection.
→ animation.

## 10 — 5 is the center
`5 = 2⁻¹`, primitive root, the `10−d` fixed digit; the still self-inverse pivot.
→ `src/5/vortex.lean`.

## 11 — Shell-model magic numbers
`2, 8, 20, 28, 50, 82, 126` = cumulative `2j+1` (oscillator + spin-orbit).
The `10·2^k` ladder hits only the oscillator closures `20, 40`.
→ `src/8/nucleus/{shell-model-magic.ts, magic.lean}`.

## 12 — Matter is waves — and waves have scales
`f = E/h`: 432 Hz → `10²`; nuclear shell → `10²⁰`; proton → `10²³`. Bound-nucleon
de Broglie λ ≈ 5.22 fm (the standing wave). 432 is the acoustic note, not the nuclear one.
→ `src/2/frequency-scales.ts`, `PHYSICS-SCALES`.

## 13 — Proton mass challenge
Best vortex fit `108·17 = 1836` (err 8×10⁻³ %); measured `1836.15267343`.
`1836 ≠ 1836.1527`; the same 1836 fits any nearby target → curve-fit, not prediction.
→ `src/8/nucleus/{proton-mass-fit.ts, proton-mass.lean}`.

## 14 — Whole vs continuous
Nature is whole in the **quantum numbers** (n, magic numbers, octaves); the
**scales** (masses, α) are continuous, measured non-integer to 11 digits.
→ `PHYSICS-SCALES`.

## 15 — Reflection: possibility ⇄ impossibility
`10−d` mirror inverts the `\`/`/` strokes on **8/11** transitions; the non-inverting
three are the void seam `0/9` (no inverse → fixed axis).
→ `src/5/reflection.{ts,lean}`.

## 16 — Pliska rosette = the vortex group
`(ℤ/7)* ≅ C₆ ≅ (ℤ/9)*`; ray-generator `3 (mod 7)` ↔ `2 (mod 9)`.
→ `src/7/rosetta.{ts,lean}`.

## 17 — Rosette ⊕ Clay fusion
Both are `7 = 6 + 1`: six units + center ↔ six open problems + Poincaré. A
bijection (relabeling) of two 7-sets; entailment unchanged: **0/7**.
→ `src/7/rosetta-clay.ts`, `src/7/entails.ts`.
