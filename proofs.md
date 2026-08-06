# Proofs

## Fused compute (TypeScript)

All results recompute at page-load from the digit-folder mesh — see
[Computed results](/compute), driven by the `.ts` modules under `src/`.

## Formal layer (Lean)

Per-digit theorems live in the digit folders (`decide` / `norm_num`), covering
the exact ℤ/9 / arithmetic facts:

- `src/1/vortex.lean` … `src/9/vortex.lean` — unity, generator ⟨2⟩, nilradical
  (3² ≡ 6² ≡ 0), inverse pairs, 9 ≡ 0, 432 = 2⁴·3³, complement bonds.
- `src/5/reflection.lean` — the 10−d involution and its fixed digit 5.
- `src/7/rosetta.lean` — (ℤ/7)* ≅ C₆ (the Pliska rosette group).
- `src/8/nucleus/magic.lean` — magic numbers 2, 8, 20, 28, 50, 82, 126.
- `src/8/nucleus/proton-mass.lean` — `108·17 = 1836`, and `1836 ≠ 1836.1527`.

No Lean toolchain is checked in; to verify, set up `lake` + Mathlib and
`lake build` over `src/**/*.lean`.

## Clay entailment

The mechanical entailment test (`src/7/entails.ts`, rendered on
[Compute](/compute)) evaluates each of the seven statements in a world where its
conjecture is false; each stays true, so **Clay problems solved: 0 / 7**.

See also the [Proof of Concept](/PROOF-OF-CONCEPT) index.
